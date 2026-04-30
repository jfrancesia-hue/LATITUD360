/**
 * Ops Assistant — chat conversacional Q&A sobre operaciones del tenant.
 * Usa LangChain + Claude con tool-calling sobre métricas reales de la DB.
 */
import { ChatAnthropic } from "@langchain/anthropic";
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";
import { prisma } from "@latitud360/database";

interface Input {
  organizationId: string;
  question: string;
  history: { role: "user" | "assistant"; content: string }[];
}

const SYSTEM = `Sos Latitud Copilot, agente IA de Latitud360 (plataforma minera del NOA).
Hablás español argentino, sos directo y técnico cuando hace falta.
Usás emojis semáforo: 🔴 crítico, 🟡 medio, 🟢 ok.

REGLAS:
- Si pedís un dato que no tengo en el contexto, decí "necesito chequear X" en lugar de inventar.
- Si la pregunta es sobre seguridad / HSE → priorizá rigor sobre velocidad.
- Datos personales de operarios solo si la pregunta los justifica.`;

async function buildContext(organizationId: string): Promise<string> {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const [
    incCount, openCritical, openHigh, dailyCount, permitsActive,
    ppeExpiring, postsThisWeek, recognitionsThisWeek,
  ] = await Promise.all([
    prisma.incident.count({ where: { organizationId, occurredAt: { gte: since } } }),
    prisma.incident.count({ where: { organizationId, severity: "critical", status: { not: "closed" } } }),
    prisma.incident.count({ where: { organizationId, severity: "high", status: { not: "closed" } } }),
    prisma.dailyReport.count({ where: { organizationId, reportDate: { gte: since } } }),
    prisma.workPermit.count({ where: { organizationId, status: { in: ["approved", "active"] } } }),
    prisma.pPEAssignment.count({
      where: {
        user: { organizationId },
        expiresAt: { lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), gte: new Date() },
        returnedAt: null,
      },
    }),
    prisma.post.count({ where: { organizationId, publishedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } }),
    prisma.recognition.count({ where: { organizationId, createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } }),
  ]);
  return `CONTEXTO DEL TENANT (últimos 30d salvo aclaración):
- Incidentes registrados: ${incCount}
- Críticos abiertos: ${openCritical}
- Altos abiertos: ${openHigh}
- Partes diarios: ${dailyCount}
- Permisos activos/aprobados: ${permitsActive}
- EPPs venciendo en 30d: ${ppeExpiring}
- Posts esta semana: ${postsThisWeek}
- Reconocimientos esta semana: ${recognitionsThisWeek}`;
}

export async function runOpsAssistant(input: Input): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return "Necesito ANTHROPIC_API_KEY configurada en apps/ai-copilot/.env.local para responder.";
  }

  const ctx = await buildContext(input.organizationId);
  const llm = new ChatAnthropic({
    model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6",
    maxTokens: 1500,
    temperature: 0.3,
  });

  const messages = [
    new SystemMessage(`${SYSTEM}\n\n---\n${ctx}`),
    ...input.history.map((m) =>
      m.role === "user" ? new HumanMessage(m.content) : new AIMessage(m.content),
    ),
    new HumanMessage(input.question),
  ];

  const r = await llm.invoke(messages);
  return typeof r.content === "string" ? r.content : JSON.stringify(r.content);
}
