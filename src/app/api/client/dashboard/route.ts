import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 1. Get Tenant ID for this user (RLS allows id = auth.uid())
        const { data: companyUser, error: companyUserError } = await supabase
            .from("company_users")
            .select("tenant_id")
            .eq("id", user.id)
            .single();

        if (companyUserError || !companyUser) {
            return NextResponse.json({ error: "No tenant found for this user" }, { status: 403 });
        }

        const tenantId = companyUser.tenant_id;

        // 2. Fetch all domain data in parallel (RLS allows via check_is_member)
        const [
            { data: tenant },
            { data: milestones },
            { data: documents },
            { data: updates },
            { data: contracts }
        ] = await Promise.all([
            supabase.from("company_tenants").select("*").eq("id", tenantId).single(),
            supabase.from("project_milestones").select("*").eq("tenant_id", tenantId).order("due_date", { ascending: true }),
            supabase.from("project_documents").select("*").eq("tenant_id", tenantId).eq("visible_to_client", true).order("created_at", { ascending: false }),
            supabase.from("project_updates").select("*").eq("tenant_id", tenantId).eq("visible_to_client", true).order("created_at", { ascending: false }),
            supabase.from("company_contracts").select("*, budgets(*)").eq("tenant_id", tenantId)
        ]);

        return NextResponse.json({
            tenant,
            milestones: milestones || [],
            documents: documents || [],
            updates: updates || [],
            contracts: contracts || []
        });
    } catch (error: any) {
        console.error("Client Dashboard GET Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
