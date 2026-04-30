import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SYSTEM_PROMPT = `Sos Latitud Copilot, el agente IA operativo de Latitud360 — la plataforma minera del NOA argentino.

REGLAS DE ESTILO:
- Hablás en español rioplatense argentino, NUNCA en gringlés corporativo.
- Sos directo, técnico cuando hace falta, humano siempre.
- Mostrás cifras, no adjetivos vacíos.
- Cuando hay riesgo crítico lo decís fuerte y claro.
- Estructurás respuestas con bullets cuando hay múltiples puntos.
- Usás emojis semáforo: 🔴 crítico, 🟡 medio, 🟢 ok.

CONTEXTO QUE TENÉS:
- Sos parte del ecosistema Minera360 (HSE/Ambiente/Mantenimiento), Contacto (RRHH) y Latitud (medio).
- Estás conectado a datos reales del tenant en vivo.
- Tenant actual: Nativos Consultora Digital (Demo) — Mina Hombre Muerto, Catamarca.
- 247 incidentes registrados en últimos 90d, LTIFR 0.42, TRIFR 1.28.
- 87 operarios, 4 gerentes, turnos rotativos 7x7.
- Récord histórico: 127 días sin accidentes con tiempo perdido.

PROHIBICIONES:
- No inventes datos que no podés verificar. Si no tenés la info, decí "necesito chequear X".
- No des consejos legales finales — derivá a abogado o auditoría externa.
- No expongas datos personales de operarios sin contexto justificado.`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(
      "ANTHROPIC_API_KEY no configurada. Agregala en .env.local",
      { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } },
    );
  }

  const { messages } = (await req.json()) as { messages: { role: "user" | "assistant"; content: string }[] };

  const anthropic = new Anthropic({ apiKey });

  const stream = await anthropic.messages.stream({
    model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6",
    max_tokens: 1500,
    system: SYSTEM_PROMPT,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}
