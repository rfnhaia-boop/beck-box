import { NextRequest, NextResponse } from "next/server";

const N8N_API_URL = process.env.N8N_API_URL;
const N8N_API_KEY = process.env.N8N_API_KEY;

// Helper function for n8n API calls
async function n8nFetch(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${N8N_API_URL}/api/v1${endpoint}`, {
        ...options,
        headers: {
            "X-N8N-API-KEY": N8N_API_KEY!,
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    if (!response.ok) {
        throw new Error(`n8n API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
}

// GET - List workflows or get specific workflow
export async function GET(request: NextRequest) {
    try {
        if (!N8N_API_URL || !N8N_API_KEY) {
            return NextResponse.json({ error: "n8n not configured" }, { status: 500 });
        }

        const { searchParams } = new URL(request.url);
        const workflowId = searchParams.get("id");
        const action = searchParams.get("action");

        if (workflowId && action === "executions") {
            // Get workflow executions
            const data = await n8nFetch(`/executions?workflowId=${workflowId}&limit=10`);
            return NextResponse.json(data);
        } else if (workflowId) {
            // Get specific workflow
            const data = await n8nFetch(`/workflows/${workflowId}`);
            return NextResponse.json(data);
        } else {
            // List all workflows
            const data = await n8nFetch("/workflows");
            return NextResponse.json(data);
        }
    } catch (error) {
        console.error("n8n API error:", error);
        return NextResponse.json({ error: "Failed to fetch from n8n" }, { status: 500 });
    }
}

// POST - Execute workflow or create new
export async function POST(request: NextRequest) {
    try {
        if (!N8N_API_URL || !N8N_API_KEY) {
            return NextResponse.json({ error: "n8n not configured" }, { status: 500 });
        }

        const body = await request.json();
        const { action, workflowId, data } = body;

        if (action === "execute" && workflowId) {
            // Execute workflow
            const result = await n8nFetch(`/workflows/${workflowId}/activate`, {
                method: "POST",
            });
            return NextResponse.json(result);
        } else if (action === "trigger" && workflowId) {
            // Trigger webhook workflow
            const result = await fetch(`${N8N_API_URL}/webhook/${workflowId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data || {}),
            });
            const responseData = await result.json();
            return NextResponse.json(responseData);
        } else {
            return NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }
    } catch (error) {
        console.error("n8n API error:", error);
        return NextResponse.json({ error: "Failed to execute n8n action" }, { status: 500 });
    }
}

// PATCH - Activate/Deactivate workflow
export async function PATCH(request: NextRequest) {
    try {
        if (!N8N_API_URL || !N8N_API_KEY) {
            return NextResponse.json({ error: "n8n not configured" }, { status: 500 });
        }

        const body = await request.json();
        const { workflowId, active } = body;

        const result = await n8nFetch(`/workflows/${workflowId}`, {
            method: "PATCH",
            body: JSON.stringify({ active }),
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("n8n API error:", error);
        return NextResponse.json({ error: "Failed to update workflow" }, { status: 500 });
    }
}
