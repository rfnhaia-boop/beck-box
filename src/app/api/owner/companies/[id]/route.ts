import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = 'force-dynamic';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const [
            { data: tenant, error: tenantError },
            { data: users },
            { data: contracts },
            { data: milestones },
            { data: documents },
            { data: updates }
        ] = await Promise.all([
            supabase.from("company_tenants").select("*").eq("id", id).eq("owner_id", user.id).single(),
            supabase.from("company_users").select("id, role, email, password_plain").eq("tenant_id", id),
            supabase.from("company_contracts").select("*, budgets(*)").eq("tenant_id", id),
            supabase.from("project_milestones").select("*").eq("tenant_id", id).order("created_at", { ascending: true }),
            supabase.from("project_documents").select("*").eq("tenant_id", id).order("created_at", { ascending: false }),
            supabase.from("project_updates").select("*").eq("tenant_id", id).order("created_at", { ascending: false })
        ]);

        if (tenantError || !tenant) {
            return NextResponse.json({ error: "Company not found" }, { status: 404 });
        }

        return NextResponse.json({
            tenant,
            users: users || [],
            contracts: contracts || [],
            milestones: milestones || [],
            documents: documents || [],
            updates: updates || []
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { action, payload } = body;

        switch (action) {
            // --- PHASE MANAGEMENT ---
            case "update_phase": {
                const updateData: any = {};
                if (payload.phase_presentation !== undefined) updateData.phase_presentation = payload.phase_presentation;
                if (payload.phase_budget !== undefined) updateData.phase_budget = payload.phase_budget;
                if (payload.phase_contract !== undefined) updateData.phase_contract = payload.phase_contract;
                if (payload.presentation_url !== undefined) updateData.presentation_url = payload.presentation_url;
                if (payload.contract_url !== undefined) updateData.contract_url = payload.contract_url;
                if (payload.logo_url !== undefined) updateData.logo_url = payload.logo_url;

                const { data, error } = await supabase
                    .from("company_tenants")
                    .update(updateData)
                    .eq("id", id)
                    .select()
                    .single();
                if (error) throw error;
                return NextResponse.json({ tenant: data });
            }

            // --- MILESTONES ---
            case "add_milestone": {
                const { data, error } = await supabase
                    .from("project_milestones")
                    .insert({ tenant_id: id, ...payload, status: 'pending' })
                    .select()
                    .single();
                if (error) throw error;
                return NextResponse.json({ milestone: data });
            }

            case "update_milestone_status": {
                const newStatus = payload.status; // 'pending' | 'in_progress' | 'complete'
                const updateData: any = { status: newStatus };
                if (newStatus === 'complete') {
                    updateData.completed_at = new Date().toISOString();
                } else {
                    updateData.completed_at = null;
                }

                const { data, error } = await supabase
                    .from("project_milestones")
                    .update(updateData)
                    .eq("id", payload.id)
                    .select()
                    .single();
                if (error) throw error;
                return NextResponse.json({ milestone: data });
            }

            case "delete_milestone": {
                const { error } = await supabase
                    .from("project_milestones")
                    .delete()
                    .eq("id", payload.id);
                if (error) throw error;
                return NextResponse.json({ ok: true });
            }

            // --- DOCUMENTS ---
            case "add_document": {
                const { data, error } = await supabase
                    .from("project_documents")
                    .insert({ tenant_id: id, ...payload })
                    .select()
                    .single();
                if (error) throw error;
                return NextResponse.json({ document: data });
            }

            case "toggle_document_visibility": {
                const { data: existing } = await supabase
                    .from("project_documents")
                    .select("visible_to_client")
                    .eq("id", payload.id)
                    .single();

                const { data, error } = await supabase
                    .from("project_documents")
                    .update({ visible_to_client: !existing?.visible_to_client })
                    .eq("id", payload.id)
                    .select()
                    .single();
                if (error) throw error;
                return NextResponse.json({ document: data });
            }

            case "delete_document": {
                const { error } = await supabase
                    .from("project_documents")
                    .delete()
                    .eq("id", payload.id);
                if (error) throw error;
                return NextResponse.json({ ok: true });
            }

            // --- UPDATES ---
            case "add_update": {
                const { data, error } = await supabase
                    .from("project_updates")
                    .insert({ tenant_id: id, ...payload })
                    .select()
                    .single();
                if (error) throw error;
                return NextResponse.json({ update: data });
            }

            case "toggle_update_visibility": {
                const { data: existing } = await supabase
                    .from("project_updates")
                    .select("visible_to_client")
                    .eq("id", payload.id)
                    .single();

                const { data, error } = await supabase
                    .from("project_updates")
                    .update({ visible_to_client: !existing?.visible_to_client })
                    .eq("id", payload.id)
                    .select()
                    .single();
                if (error) throw error;
                return NextResponse.json({ update: data });
            }

            case "delete_update": {
                const { error } = await supabase
                    .from("project_updates")
                    .delete()
                    .eq("id", payload.id);
                if (error) throw error;
                return NextResponse.json({ ok: true });
            }

            case "update_tenant": {
                const { data, error } = await supabase
                    .from("company_tenants")
                    .update(payload)
                    .eq("id", id)
                    .select()
                    .single();
                if (error) throw error;
                return NextResponse.json({ tenant: data });
            }

            default:
                return NextResponse.json({ error: "Unknown action" }, { status: 400 });
        }
    } catch (error: any) {
        console.error("Company PATCH Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
