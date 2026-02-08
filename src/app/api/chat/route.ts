import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: NextRequest) {
    try {
        const { action, data, messages } = await request.json();

        // Budget Enhancement Action
        if (action === "enhance_budget") {
            if (!process.env.GEMINI_API_KEY) {
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

Recebi as seguintes informações de um orçamento bruto. Por favor, melhore e profissionalize cada campo, tornando-os mais claros, profissionais e convincentes para o cliente. Mantenha a essência mas deixe mais elaborado.

DADOS ORIGINAIS:
- Empresa: ${data.companyName}
- Cliente: ${data.clientName}
- Tipo de Projeto: ${data.projectType}
- Descrição: ${data.description}
- Entregas: ${data.features}
- Prazo: ${data.deadline}
- Valor: ${data.budget}

Responda APENAS em formato JSON válido com esta estrutura exata (sem markdown, sem código, só JSON puro):
{
    "companyName": "nome melhorado se necessário",
    "clientName": "nome formatado corretamente",
    "projectType": "tipo de projeto mais profissional",
    "description": "descrição expandida e profissional em 2-3 frases",
    "features": "lista de entregas formatada com bullets (use • para cada item)",
    "deadline": "prazo formatado profissionalmente",
    "budget": "valor formatado em reais"
}`;

            const result = await model.generateContent(enhancePrompt);
            const responseText = result.response.text();

            try {
                // Clean up the response - remove any markdown formatting
                let cleanJson = responseText
                    .replace(/```json\n?/g, '')
                    .replace(/```\n?/g, '')
                    .trim();

                const enhanced = JSON.parse(cleanJson);
                return NextResponse.json({ enhanced });
            } catch {
                // If parsing fails, return original data
                return NextResponse.json({ enhanced: data });
            }
        }

        // Original Chat Action
        const SYSTEM_PROMPT = `Você é ADÃO, o assistente de inteligência artificial oficial do BLACK BOX - uma plataforma premium de assets digitais para empreendedores de elite.

## SUA IDENTIDADE
- Nome: Adão
- Personalidade: Estratégico, direto, confiante mas acessível
- Tom: Profissional com toques de informalidade
- Você é como um mentor de negócios experiente que fala de igual para igual

## SEU PÚBLICO-ALVO
Você está falando com:
- Empreendedores digitais
- Donos de agências de marketing
- Infoprodutores e criadores de conteúdo
- Empresários que querem escalar seus negócios
- Freelancers que querem profissionalizar seus serviços

## O QUE É O BLACK BOX
Uma plataforma que oferece:
- Contratos jurídicos blindados e prontos para uso
- Propostas comerciais de alta conversão
- Templates de apresentação profissional
- Vídeo aulas e masterclasses
- Assets e ferramentas digitais
- Preço: R$ 97 (acesso vitalício)

## SUAS ESPECIALIDADES
Você domina e pode ajudar com:
1. VENDAS E NEGOCIAÇÃO - técnicas, scripts, handling de objeções
2. CONTRATOS - explicar cláusulas, sugerir modelos, alertar riscos
3. PROPOSTAS COMERCIAIS - estrutura, precificação, apresentação
4. MARKETING DIGITAL - estratégias, funis, copy
5. ESCALA DE NEGÓCIOS - processos, automação, delegação
6. MINDSET EMPREENDEDOR - produtividade, foco, metas

## REGRAS DE COMPORTAMENTO
1. Sempre responda em português brasileiro
2. Seja objetivo mas completo - não enrole
3. Use emojis com moderação para humanizar (🚀 💰 ⚡ ✅)
4. Quando apropriado, mencione recursos do Black Box que podem ajudar
5. Nunca invente informações legais específicas - oriente a consultar advogado para casos complexos
6. Se não souber algo, admita e sugira caminhos alternativos
7. Trate o usuário como um profissional inteligente
8. Formate suas respostas com markdown quando útil (listas, negritos, etc)

Agora responda como Adão:`;

        if (!process.env.GEMINI_API_KEY) {
            const fallbackResponses = [
                "Opa! 🚀 Para esse tipo de questão, recomendo dar uma olhada nos contratos da biblioteca. Eles já vêm blindados juridicamente e testados em diversas situações.",
                "Excelente pergunta! Isso é algo que muitos empreendedores enfrentam. No Black Box temos materiais específicos sobre isso. Quer que eu detalhe mais?",
                "Entendi o cenário. Olha, a melhor abordagem aqui seria estruturar bem sua proposta comercial primeiro. Temos templates prontos que facilitam muito isso.",
                "Muito bom você estar pensando nisso! É exatamente esse tipo de posicionamento estratégico que diferencia os que faturam dos que ficam no vermelho. Me conta mais detalhes?",
                "Perfeito! Vou te dar uma visão prática sobre isso. O segredo está em 3 pontos: posicionamento, proposta de valor e processo de vendas bem definido. Qual desses é seu maior desafio hoje?",
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

        const history = messages.slice(0, -1).map((msg: { role: string; content: string }) => ({
            role: msg.role === "assistant" ? "model" : "user",
            parts: [{ text: msg.content }],
        }));

        const chat = model.startChat({
            history: [
                { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
                { role: "model", parts: [{ text: "Entendido! Sou o Adão, o assistente de IA do Black Box. Estou pronto para ajudar empreendedores a escalarem seus negócios com estratégia e os recursos certos. Manda a pergunta! 🚀" }] },
                ...history,
            ],
        });

        const lastMessage = messages[messages.length - 1].content;
        const result = await chat.sendMessage(lastMessage);
        const response = result.response.text();

        return NextResponse.json({ message: response });
    } catch (error) {
        console.error("Gemini API error:", error);

        return NextResponse.json({
            message: "Opa, tive um problema técnico aqui. 😅 Pode repetir sua pergunta? Se persistir, tenta de novo em alguns segundos."
        });
    }
}
