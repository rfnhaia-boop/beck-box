import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: NextRequest) {
    try {
        const { action, data, messages } = await request.json();

        // --- N8N INTEGRATION ---
        const n8nUrl = process.env.N8N_CHAT_WEBHOOK_URL;
        const n8nKey = process.env.N8N_API_KEY;

        if (n8nUrl && action !== "enhance_budget") {
            try {
                const lastMessage = messages[messages.length - 1].content;

                const n8nResponse = await fetch(n8nUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...(n8nKey ? { "X-N8N-API-KEY": n8nKey } : {})
                    },
                    body: JSON.stringify({
                        chatInput: lastMessage,
                        history: messages.slice(0, -1),
                        sessionId: "black-box-session"
                    })
                });

                if (n8nResponse.ok) {
                    const n8nData = await n8nResponse.json();
                    return NextResponse.json({
                        message: n8nData.output || n8nData.text || n8nData.message || (Array.isArray(n8nData) ? n8nData[0].output : "Opa, recebi uma resposta vazia do Adão.")
                    });
                }
                console.error("n8n API Error Status:", n8nResponse.status);
            } catch (err) {
                console.error("n8n Integration Error:", err);
            }
        }

        // --- GEMINI BACKUP / BUDGET ENHANCEMENT ---
        // Budget Enhancement Action
        if (action === "enhance_budget") {
            if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes("YOUR_")) {
                return NextResponse.json({ enhanced: data });
            }

            const model = genAI.getGenerativeModel({
                model: "gemini-2.0-flash",
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 2048,
                }
            });

            const enhancePrompt = `Você é um especialista em elaboração de propostas comerciais e orçamentos profissionais.
... (existing prompt logic) ...`;

            const result = await model.generateContent(enhancePrompt);
            const responseText = result.response.text();

            try {
                let cleanJson = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
                const enhanced = JSON.parse(cleanJson);
                return NextResponse.json({ enhanced });
            } catch {
                return NextResponse.json({ enhanced: data });
            }
        }

        // Adão Chat Backup (Gemini)
        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes("YOUR_")) {
            const fallbackResponses = [
                "Opa! 🚀 Estou aqui para te ajudar. Parece que o n8n ou o Gemini estão em manutenção, mas me conta mais sobre o que você precisa!",
                "Excelente pergunta! No Black Box temos as ferramentas certas para elevar seu nível. Como posso agilizar seu processo hoje?",
                "Entendi o desafio. Posicionamento estratégico é tudo. Vamos focar em como o Black Box pode blindar seu negócio.",
                "Foco total na escala! ⚡ É isso que diferencia os amadores dos pros. Qual o seu próximo passo?",
            ];
            return NextResponse.json({
                message: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]
            });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            generationConfig: {
                temperature: 0.8,
                maxOutputTokens: 1024,
            }
        });

        // ... (existing history mapping and chat logic) ...
        const history = messages.slice(0, -1).map((msg: { role: string; content: string }) => ({
            role: msg.role === "assistant" ? "model" : "user",
            parts: [{ text: msg.content }],
        }));

        const chat = model.startChat({
            history: [
                { role: "user", parts: [{ text: "Você é ADÃO, o assistente do Black Box..." }] },
                { role: "model", parts: [{ text: "Pronto! Manda ver." }] },
                ...history,
            ],
        });

        const lastMessage = messages[messages.length - 1].content;
        const result = await chat.sendMessage(lastMessage);
        return NextResponse.json({ message: result.response.text() });

    } catch (error) {
        console.error("Chat API error:", error);
        return NextResponse.json({
            message: "Ops! Tive um problema de conexão. 😅 Pode tentar de novo em alguns segundos?"
        });
    }
}
