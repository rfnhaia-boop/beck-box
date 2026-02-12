import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createBrowserClient } from "@supabase/supabase-js";

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { data, error } = await supabase
            .from("company_tenants")
            .select(`
                *,
                company_users (id, role, email, password_plain),
                company_contracts (id, budget_id, status)
            `)
            .eq("owner_id", user.id)
            .order("created_at", { ascending: false });

        if (error) throw error;

        return NextResponse.json({ companies: data });
    } catch (error: any) {
        console.error("Owner Companies GET Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user: owner } } = await supabase.auth.getUser();

        if (!owner) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { name, cnpj, email, password, budgetIds } = body;

        if (!name || !email || !password) {
            return NextResponse.json({ error: "Preencha todos os campos obrigatórios" }, { status: 400 });
        }

        // 1. Create Tenant (owner's authenticated client — RLS allows owner_id = auth.uid())
        const { data: tenant, error: tenantError } = await supabase
            .from("company_tenants")
            .insert({
                owner_id: owner.id,
                name,
                cnpj: cnpj || null,
                status: 'ACTIVE'
            })
            .select()
            .single();

        if (tenantError) {
            console.error("Tenant creation error:", tenantError);
            return NextResponse.json({ error: "Falha ao criar empresa: " + tenantError.message }, { status: 500 });
        }

        // 2. Create Auth User via signUp (uses anon key — NO service role key needed)
        //    We create a fresh separate client so it doesn't affect the owner's session
        const anonClient = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            { auth: { autoRefreshToken: false, persistSession: false } }
        );

        const { data: signUpData, error: signUpError } = await anonClient.auth.signUp({
            email,
            password,
            options: {
                data: { company_name: name, role: 'CLIENT_ADMIN' }
            }
        });

        if (signUpError || !signUpData.user) {
            console.error("SignUp Error:", signUpError);
            // Rollback: delete tenant
            await supabase.from("company_tenants").delete().eq("id", tenant.id);
            return NextResponse.json({
                error: "Falha ao criar usuário: " + (signUpError?.message || "Erro desconhecido")
            }, { status: 500 });
        }

        const clientUser = signUpData.user;

        // 3. Link User to Tenant (owner's client — RLS allows via check_is_owner)
        const { error: userLinkError } = await supabase
            .from("company_users")
            .insert({
                id: clientUser.id,
                tenant_id: tenant.id,
                role: 'CLIENT_ADMIN',
                email: email,
                password_plain: password
            });

        if (userLinkError) {
            console.error("User link error:", userLinkError);
            // Rollback: delete tenant (user stays in auth but without access)
            await supabase.from("company_tenants").delete().eq("id", tenant.id);
            return NextResponse.json({ error: "Falha ao vincular usuário: " + userLinkError.message }, { status: 500 });
        }

        // 4. Link Contracts (Budgets)
        if (budgetIds && Array.isArray(budgetIds) && budgetIds.length > 0) {
            const contractsData = budgetIds.map((budgetId: string) => ({
                tenant_id: tenant.id,
                budget_id: budgetId,
                status: 'ACTIVE'
            }));

            const { error: contractError } = await supabase
                .from("company_contracts")
                .insert(contractsData);

            if (contractError) {
                console.error("Contract link error:", contractError);
                // Non-critical: contracts can be linked later
            }
        }

        return NextResponse.json({
            company: tenant,
            user: { id: clientUser.id, email: clientUser.email }
        });
    } catch (error: any) {
        console.error("Owner Company POST Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
