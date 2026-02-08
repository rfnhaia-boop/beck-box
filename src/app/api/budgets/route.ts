import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET - List budgets for current user
export async function GET() {
    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { data, error } = await supabase
            .from("budgets")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        if (error) throw error;

        return NextResponse.json({ budgets: data });
    } catch (error) {
        console.error("Error fetching budgets:", error);
        return NextResponse.json({ error: "Failed to fetch budgets" }, { status: 500 });
    }
}

// POST - Create new budget
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const {
            companyName,
            clientName,
            projectType,
            description,
            features,
            deadline,
            budgetValue,
            paymentTerms
        } = body;

        const { data, error } = await supabase
            .from("budgets")
            .insert({
                user_id: user.id,
                company_name: companyName,
                client_name: clientName,
                project_type: projectType,
                description,
                features,
                deadline,
                budget_value: budgetValue,
                payment_terms: paymentTerms || "50% na aprovação, 50% na entrega",
                status: "criado"
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ budget: data });
    } catch (error) {
        console.error("Error creating budget:", error);
        return NextResponse.json({ error: "Failed to create budget" }, { status: 500 });
    }
}

// PATCH - Update budget status and workflow
export async function PATCH(request: NextRequest) {
    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const {
            id,
            status,
            action,
            acceptedNotes,
            finalValue,
            valueChanged,
            completionNotes,
            completionDate
        } = body;

        const updateData: Record<string, unknown> = {
            updated_at: new Date().toISOString()
        };

        if (status) {
            updateData.status = status;
        }

        // Handle "accept" action - client accepted the budget
        if (action === "accept") {
            updateData.status = "em_andamento";
            updateData.accepted_at = new Date().toISOString();
            updateData.started_at = new Date().toISOString();
            if (acceptedNotes) updateData.accepted_notes = acceptedNotes;
            if (finalValue) updateData.final_value = finalValue;
            if (valueChanged !== undefined) updateData.value_changed = valueChanged;
        }

        // Handle "complete" action - project delivered
        if (action === "complete") {
            updateData.status = "entregue";
            updateData.delivered_at = completionDate || new Date().toISOString();
            if (completionNotes) updateData.completion_notes = completionNotes;

            // Calculate execution days if we have started_at
            const { data: budget } = await supabase
                .from("budgets")
                .select("started_at")
                .eq("id", id)
                .single();

            if (budget?.started_at) {
                const started = new Date(budget.started_at);
                const completed = new Date(completionDate || new Date());
                const diffTime = Math.abs(completed.getTime() - started.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                updateData.execution_days = diffDays;
            }
        }

        if (status === "entregue" && !action) {
            updateData.delivered_at = new Date().toISOString();
        }

        const { data, error } = await supabase
            .from("budgets")
            .update(updateData)
            .eq("id", id)
            .eq("user_id", user.id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ budget: data });
    } catch (error) {
        console.error("Error updating budget:", error);
        return NextResponse.json({ error: "Failed to update budget" }, { status: 500 });
    }
}

// DELETE - Delete a budget
export async function DELETE(request: NextRequest) {
    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Budget ID required" }, { status: 400 });
        }

        const { error } = await supabase
            .from("budgets")
            .delete()
            .eq("id", id)
            .eq("user_id", user.id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting budget:", error);
        return NextResponse.json({ error: "Failed to delete budget" }, { status: 500 });
    }
}
