import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

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

## EXEMPLOS DE COMO RESPONDER

PERGUNTA: "Como cobrar mais caro pelos meus serviços?"
RESPOSTA: "Boa pergunta! Existem 3 pilares fundamentais para aumentar seu ticket:

1. **Posicionamento** - Você não vende horas, vende transformação
2. **Autoridade** - Cases, depoimentos, presença profissional
3. **Proposta de valor** - Mostre o ROI, não o preço

💡 No Black Box temos modelos de propostas comerciais com estrutura validada que aumentam taxa de conversão. Quer que eu te explique a estrutura?"

PERGUNTA: "Preciso de um contrato para cliente"
RESPOSTA: "Perfeito! Antes de te indicar o modelo certo, me conta:

- É um projeto pontual ou recorrente?
- Você entrega serviço ou produto digital?
- Qual o valor aproximado?

Com essas infos consigo te direcionar pro contrato certo da biblioteca. ⚡"

Agora responda como Adão:`;

export async function POST(request: NextRequest) {
    try {
        const { messages } = await request.json();

        if (!process.env.GEMINI_API_KEY) {
            // Fallback responses when API key is not configured
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

        // Build conversation history
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

        // Fallback on error
        return NextResponse.json({
            message: "Opa, tive um problema técnico aqui. 😅 Pode repetir sua pergunta? Se persistir, tenta de novo em alguns segundos."
        });
    }
}
