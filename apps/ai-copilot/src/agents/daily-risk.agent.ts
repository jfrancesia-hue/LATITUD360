/**
 * Daily Risk Agent — predice riesgos para las próximas N horas en faena.
 *
 * Cruza:
 *   - últimos incidentes (Minera360 → SafetyOps)
 *   - permisos activos
 *   - EPPs próximos a vencer
 *   - clima / pronóstico (placeholder por ahora)
 *
 * Devuelve lista priorizada de alertas con razón explicada en lenguaje natural.
 */
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@latitud360/database";

interface Input {
  organizationId: string;
  horizonHours: number;
}

interface Risk {
  level: "critical" | "high" | "medium" | "low";
  emoji: string;
  title: string;
  reasoning: string;
  data: Record<string, unknown>;
  suggestedActions: string[];
}

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

export async function runDailyRiskAgent(input: Input): Promise<{ risks: Risk[]; summary: string }> {
  const { organizationId, horizonHours } = input;

  // ─── 1) Recolectar señales ─────────────────────────────────────
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const horizonEnd = new Date(Date.now() + horizonHours * 60 * 60 * 1000);

  const [recentIncidents, ppeExpiring, permitsScheduled] = await Promise.all([
    prisma.incident.findMany({
      where: { organizationId, occurredAt: { gte: since }, status: { not: "closed" } },
      take: 30,
    }),
    prisma.pPEAssignment.findMany({
      where: {
        user: { organizationId },
        expiresAt: { lte: horizonEnd, gte: new Date() },
        returnedAt: null,
      },
      include: { ppe: true, user: { select: { id: true, fullName: true, role: true } } },
    }),
    prisma.workPermit.findMany({
      where: {
        organizationId,
        validFrom: { lte: horizonEnd },
        validUntil: { gte: new Date() },
      },
    }),
  ]);

  // ─── 2) Heurísticas determinísticas ────────────────────────────
  const risks: Risk[] = [];

  if (recentIncidents.filter((i) => i.severity === "critical").length > 0) {
    risks.push({
      level: "critical", emoji: "🔴",
      title: "Incidente CRÍTICO sin cerrar en últimos 30d",
      reasoning: "Patrón de repetición posible. Investigación 5 Por Qué priorizada.",
      data: { count: recentIncidents.filter((i) => i.severity === "critical").length },
      suggestedActions: ["Acelerar cierre de investigación", "Comunicar al equipo HSE"],
    });
  }

  const ppeCritical = ppeExpiring.filter((a) => a.ppe.isCritical);
  if (ppeCritical.length > 0) {
    risks.push({
      level: "high", emoji: "🟠",
      title: `${ppeCritical.length} EPP(s) críticos vencerán en ${horizonHours}h`,
      reasoning: "Operarios podrían quedar sin protección reglamentaria. Bloqueo automático recomendado.",
      data: { items: ppeCritical.map((a) => ({ user: a.user.fullName, ppe: a.ppe.name, expires: a.expiresAt })) },
      suggestedActions: ["Reposición urgente desde stock", "Pausa preventiva del operario hasta entrega"],
    });
  }

  if (permitsScheduled.filter((p) => p.permitType === "height" || p.permitType === "confined_space").length > 0) {
    risks.push({
      level: "medium", emoji: "🟡",
      title: "Permisos de alto riesgo programados",
      reasoning: "Trabajo en altura y/o espacios confinados activos en próximas horas. Verificar análisis de riesgo y EPPs.",
      data: { permits: permitsScheduled.length },
      suggestedActions: ["Briefing HSE pre-jornada", "Verificar arnés y atmósfera"],
    });
  }

  // ─── 3) Resumen narrativo con Claude ──────────────────────────
  let summary = "";
  if (anthropic && risks.length > 0) {
    const r = await anthropic.messages.create({
      model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6",
      max_tokens: 400,
      system: "Sos Latitud Copilot. Resumí en español argentino, máx 4 oraciones, los riesgos detectados. Directo, sin adjetivos vacíos.",
      messages: [{ role: "user", content: `Riesgos detectados:\n${JSON.stringify(risks, null, 2)}\n\nResumimelo para el HSE Manager que lo va a leer en su café de las 6am.` }],
    });
    const block = r.content[0];
    if (block && block.type === "text") summary = block.text;
  } else if (risks.length === 0) {
    summary = `Sin alertas en horizonte de ${horizonHours}h. Operación dentro de parámetros nominales.`;
  } else {
    summary = `${risks.length} alertas detectadas. Configurá ANTHROPIC_API_KEY para resúmenes en lenguaje natural.`;
  }

  return { risks, summary };
}
