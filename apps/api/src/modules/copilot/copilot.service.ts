import { Injectable, Logger, ServiceUnavailableException } from "@nestjs/common";
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { PrismaService } from "../../prisma/prisma.service";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const SYSTEM_PROMPT = `Sos Latitud Copilot, el agente IA operativo de Latitud360 — la plataforma minera del NOA argentino construida por Nativos Consultora Digital.

REGLAS DE ESTILO:
- Hablás en español rioplatense argentino, NUNCA en gringlés corporativo.
- Sos directo, técnico cuando hace falta, humano siempre.
- Mostrás cifras concretas, no adjetivos vacíos.
- Cuando hay riesgo crítico lo decís fuerte y claro.
- Usás emojis semáforo: 🔴 crítico, 🟡 medio, 🟢 ok.

CONTEXTO:
- Sos parte del ecosistema Minera360 (HSE/Ambiente/Mantenimiento), Contacto (RRHH) y Latitud (medio).
- Estás conectado a datos reales del tenant en vivo.

PROHIBICIONES:
- No inventes datos. Si no tenés info, decí "necesito chequear X".
- No des consejos legales finales — derivá a abogado o auditoría externa.
- No expongas datos personales sin contexto justificado.`;

@Injectable()
export class CopilotService {
  private readonly logger = new Logger(CopilotService.name);
  private readonly anthropic: Anthropic | null;
  private readonly openai: OpenAI | null;

  constructor(private readonly prisma: PrismaService) {
    this.anthropic = process.env.ANTHROPIC_API_KEY
      ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
      : null;
    this.openai = process.env.OPENAI_API_KEY
      ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
      : null;
  }

  /**
   * Construye contexto del tenant para que Claude tenga datos reales.
   * Lee últimos 30 días: incidentes, partes diarios, posts.
   */
  async buildTenantContext(organizationId: string): Promise<string> {
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [recentIncidents, recentReports, openPermits] = await Promise.all([
      this.prisma.client.incident.findMany({
        where: { organizationId, occurredAt: { gte: since } },
        select: { type: true, severity: true, title: true, status: true, occurredAt: true },
        take: 20,
      }),
      this.prisma.client.dailyReport.count({ where: { organizationId, reportDate: { gte: since } } }),
      this.prisma.client.workPermit.count({ where: { organizationId, status: { in: ["pending", "approved", "active"] } } }),
    ]);

    return `DATOS DEL TENANT (últimos 30 días):
- Incidentes registrados: ${recentIncidents.length}
- Críticos abiertos: ${recentIncidents.filter((i) => i.severity === "critical" && i.status !== "closed").length}
- Altos abiertos: ${recentIncidents.filter((i) => i.severity === "high" && i.status !== "closed").length}
- Partes diarios firmados: ${recentReports}
- Permisos de trabajo activos/pendientes: ${openPermits}

Últimos 5 incidentes:
${recentIncidents.slice(0, 5).map((i) => `  - [${i.severity}] ${i.title} (${i.status})`).join("\n")}`;
  }

  async streamChat(
    organizationId: string,
    messages: ChatMessage[],
  ): Promise<AsyncIterable<string>> {
    if (!this.anthropic) {
      throw new ServiceUnavailableException("ANTHROPIC_API_KEY no configurada");
    }
    const tenantCtx = await this.buildTenantContext(organizationId);
    const fullSystem = `${SYSTEM_PROMPT}\n\n---\n${tenantCtx}`;

    const stream = await this.anthropic.messages.stream({
      model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6",
      max_tokens: 1500,
      system: fullSystem,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    return (async function* () {
      for await (const event of stream) {
        if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
          yield event.delta.text;
        }
      }
    })();
  }

  /** Embeddings vía OpenAI para búsqueda semántica de incidentes / posts */
  async embed(text: string): Promise<number[]> {
    if (!this.openai) throw new ServiceUnavailableException("OPENAI_API_KEY no configurada");
    const r = await this.openai.embeddings.create({
      model: process.env.OPENAI_EMBEDDING_MODEL ?? "text-embedding-3-small",
      input: text,
    });
    return r.data[0]!.embedding;
  }
}
