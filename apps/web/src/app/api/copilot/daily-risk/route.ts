import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import Anthropic from "@anthropic-ai/sdk";
import { getCurrentSession } from "@latitud360/auth/server";
import { prisma } from "@latitud360/database";
import { can } from "@latitud360/shared";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RiskLevel = "critical" | "high" | "medium" | "low";

type Risk = {
  level: RiskLevel;
  emoji: string;
  title: string;
  reasoning: string;
  data: Record<string, unknown>;
  suggestedActions: string[];
};

const SUMMARY_SYSTEM = `Sos Latitud Copilot. Resumí en español rioplatense argentino, máximo 4 oraciones, los riesgos detectados. Directo, sin adjetivos vacíos. Pensá que lo lee un HSE Manager en su café de las 6am — tiene que decidir qué hace primero.`;

export async function GET(req: NextRequest) {
  const session = await getCurrentSession(cookies(), req.headers.get("x-tenant-slug") ?? undefined);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!can(session.user.role, "minera360", "report", "read")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const horizonHours = Math.max(1, Math.min(168, parseInt(searchParams.get("h") ?? "24", 10)));

  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const horizonEnd = new Date(Date.now() + horizonHours * 60 * 60 * 1000);

  // ─── Recolectar señales ──────────────────────────────────────────
  const [recentIncidents, ppeExpiring, permitsScheduled, openFindings] = await Promise.all([
    prisma.incident.findMany({
      where: {
        organizationId: session.user.organizationId,
        occurredAt: { gte: since },
        status: { not: "closed" },
      },
      take: 30,
      select: { id: true, severity: true, type: true, occurredAt: true, title: true, daysLost: true },
    }),
    prisma.ppeAssignment.findMany({
      where: {
        ppe: { organizationId: session.user.organizationId },
        expiresAt: { lte: horizonEnd, gte: new Date() },
        returnedAt: null,
      },
      include: {
        ppe: { select: { name: true, isCritical: true, category: true } },
        user: { select: { id: true, fullName: true, role: true } },
      },
    }),
    prisma.workPermit.findMany({
      where: {
        organizationId: session.user.organizationId,
        validFrom: { lte: horizonEnd },
        validUntil: { gte: new Date() },
      },
      select: { id: true, permitType: true, status: true, validFrom: true, validUntil: true },
    }),
    prisma.finding.count({
      where: {
        status: "open",
        inspection: { organizationId: session.user.organizationId },
        severity: { in: ["high", "critical"] },
      },
    }),
  ]);

  // ─── Heurísticas determinísticas ────────────────────────────────
  const risks: Risk[] = [];

  const criticalUnclosed = recentIncidents.filter((i) => i.severity === "critical");
  if (criticalUnclosed.length > 0) {
    risks.push({
      level: "critical",
      emoji: "🔴",
      title: `${criticalUnclosed.length} incidente${criticalUnclosed.length === 1 ? "" : "s"} CRÍTICO sin cerrar`,
      reasoning: "Patrón de repetición posible si la investigación 5 Por Qué no avanza.",
      data: { incidents: criticalUnclosed.map((i) => ({ id: i.id, title: i.title, occurredAt: i.occurredAt })) },
      suggestedActions: [
        "Acelerar cierre de investigación",
        "Comunicar al equipo HSE en briefing matutino",
        "Bloquear inicio de turno hasta verificar condiciones",
      ],
    });
  }

  const ppeCritical = ppeExpiring.filter((a) => a.ppe.isCritical);
  if (ppeCritical.length > 0) {
    risks.push({
      level: ppeCritical.length >= 5 ? "critical" : "high",
      emoji: ppeCritical.length >= 5 ? "🔴" : "🟠",
      title: `${ppeCritical.length} EPP${ppeCritical.length === 1 ? "" : "s"} crítico${ppeCritical.length === 1 ? "" : "s"} vence${ppeCritical.length === 1 ? "" : "n"} en ${horizonHours}h`,
      reasoning: "Operarios podrían quedar sin protección reglamentaria. Considerá bloqueo automático.",
      data: {
        items: ppeCritical.slice(0, 10).map((a) => ({
          user: a.user.fullName,
          ppe: a.ppe.name,
          expires: a.expiresAt,
        })),
      },
      suggestedActions: [
        "Reposición urgente desde stock",
        "Pausa preventiva del operario hasta entrega",
      ],
    });
  }

  const highRiskPermits = permitsScheduled.filter(
    (p) => p.permitType === "height" || p.permitType === "confined_space",
  );
  if (highRiskPermits.length > 0) {
    risks.push({
      level: "medium",
      emoji: "🟡",
      title: `${highRiskPermits.length} permiso${highRiskPermits.length === 1 ? "" : "s"} de alto riesgo activo${highRiskPermits.length === 1 ? "" : "s"}`,
      reasoning: "Trabajo en altura y/o espacios confinados en próximas horas. Verificar análisis de riesgo y EPPs.",
      data: { permits: highRiskPermits.length },
      suggestedActions: [
        "Briefing HSE pre-jornada",
        "Verificar arnés y atmósfera antes del ingreso",
      ],
    });
  }

  if (openFindings >= 3) {
    risks.push({
      level: "medium",
      emoji: "🟡",
      title: `${openFindings} findings de severidad alta sin cerrar`,
      reasoning: "Acumulación de hallazgos abiertos puede señalar plan de inspecciones desbalanceado.",
      data: { count: openFindings },
      suggestedActions: ["Priorizar cierre en orden de severidad", "Asignar responsable explícito a cada finding"],
    });
  }

  // ─── Resumen narrativo ─────────────────────────────────────────
  const apiKey = process.env.ANTHROPIC_API_KEY;
  let summary = "";
  if (risks.length === 0) {
    summary = `Sin alertas en horizonte de ${horizonHours}h. Operación dentro de parámetros nominales.`;
  } else if (apiKey) {
    try {
      const anthropic = new Anthropic({ apiKey });
      const r = await anthropic.messages.create({
        model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6",
        max_tokens: 400,
        system: SUMMARY_SYSTEM,
        messages: [
          {
            role: "user",
            content: `Riesgos detectados:\n${JSON.stringify(risks, null, 2)}\n\nResumimelo en máximo 4 oraciones para el HSE Manager.`,
          },
        ],
      });
      const block = r.content[0];
      if (block && block.type === "text") summary = block.text;
    } catch {
      summary = `${risks.length} alertas detectadas (resumen narrativo no disponible — verificá ANTHROPIC_API_KEY).`;
    }
  } else {
    summary = `${risks.length} alertas detectadas. Configurá ANTHROPIC_API_KEY para el resumen narrativo en lenguaje natural.`;
  }

  return NextResponse.json({
    horizonHours,
    summary,
    risks,
    signals: {
      recentIncidents: recentIncidents.length,
      ppeExpiringInWindow: ppeExpiring.length,
      activePermits: permitsScheduled.length,
      openHighSeverityFindings: openFindings,
    },
    generatedAt: new Date().toISOString(),
  });
}
