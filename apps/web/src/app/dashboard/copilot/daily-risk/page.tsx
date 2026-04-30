import Link from "next/link";
import { ArrowLeft, AlertTriangle, ShieldAlert, ShieldCheck, Sparkles, Clock, FileBarChart2 } from "lucide-react";
import { Badge, Button, Card, CardContent, StatCard } from "@latitud360/ui";

const SEVERITY_TINT = {
  critical: { bar: "bg-alerta", text: "text-alerta", badge: "alerta" as const, icon: ShieldAlert },
  high:     { bar: "bg-naranja", text: "text-naranja", badge: "warn" as const, icon: AlertTriangle },
  medium:   { bar: "bg-warn",    text: "text-warn",    badge: "warn" as const, icon: AlertTriangle },
  low:      { bar: "bg-ok",      text: "text-ok",      badge: "ok" as const,   icon: ShieldCheck },
};

// Demo data shaped exactly like /api/copilot/daily-risk returns.
// In a real session, this page becomes a server component that calls
// the endpoint and renders the actual risks.
const demo = {
  horizonHours: 24,
  summary:
    "Tres alertas para las próximas 24h. La más urgente: 2 incidentes críticos sin cerrar de últimos 30d — empujá la 5 Por Qué hoy. Después, 4 EPPs críticos vencen en horas: reposición desde stock antes del turno mañana. Y trabajos en altura en plataforma 3 — briefing de seguridad pre-jornada. La operación no está rota, pero estos tres puntos requieren foco.",
  risks: [
    {
      level: "critical" as const,
      emoji: "🔴",
      title: "2 incidentes CRÍTICOS sin cerrar",
      reasoning: "Patrón de repetición posible si la investigación 5 Por Qué no avanza.",
      suggestedActions: [
        "Acelerar cierre de investigación",
        "Comunicar al equipo HSE en briefing matutino",
        "Bloquear inicio de turno hasta verificar condiciones",
      ],
    },
    {
      level: "high" as const,
      emoji: "🟠",
      title: "4 EPPs críticos vencen en 24h",
      reasoning: "Operarios podrían quedar sin protección reglamentaria. Considerá bloqueo automático.",
      suggestedActions: [
        "Reposición urgente desde stock",
        "Pausa preventiva del operario hasta entrega",
      ],
    },
    {
      level: "medium" as const,
      emoji: "🟡",
      title: "1 permiso de alto riesgo activo",
      reasoning: "Trabajo en altura en plataforma 3, próximas 8h. Verificar análisis de riesgo y EPPs.",
      suggestedActions: [
        "Briefing HSE pre-jornada",
        "Verificar arnés y atmósfera antes del ingreso",
      ],
    },
  ],
  signals: {
    recentIncidents: 8,
    ppeExpiringInWindow: 12,
    activePermits: 3,
    openHighSeverityFindings: 4,
  },
};

export default function DailyRiskPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      <header className="flex items-start gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard/copilot">
            <ArrowLeft className="h-4 w-4" /> Copilot
          </Link>
        </Button>
        <div className="flex-1">
          <p className="text-xs font-mono text-artico/50 uppercase tracking-[0.2em]">
            Latitud Copilot → Daily Risk Agent
          </p>
          <h1 className="mt-1 font-heading italic text-4xl text-artico tracking-tight">
            Alertas del día
          </h1>
          <p className="mt-2 text-sm text-artico/60 flex items-center gap-2">
            <Clock className="h-3 w-3" /> Horizonte 24h
            <span>·</span>
            <Sparkles className="h-3 w-3" /> Generado por Claude Sonnet 4.6 sobre datos en vivo de tu tenant
          </p>
        </div>
      </header>

      <Card>
        <CardContent className="p-6 bg-gradient-to-br from-naranja/5 via-mina to-turquesa/5">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-artico/50 mb-3 flex items-center gap-2">
            <Sparkles className="h-3 w-3" /> Resumen del agente
          </p>
          <p className="text-base font-body text-artico/90 leading-relaxed">{demo.summary}</p>
        </CardContent>
      </Card>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Incidentes 30d abiertos" value={String(demo.signals.recentIncidents)} tint="warn" />
        <StatCard label="EPP vence ≤ 24h" value={String(demo.signals.ppeExpiringInWindow)} tint="alerta" />
        <StatCard label="Permisos activos" value={String(demo.signals.activePermits)} />
        <StatCard label="Findings high/crit" value={String(demo.signals.openHighSeverityFindings)} tint="warn" />
      </section>

      <section className="space-y-4">
        <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-artico/50">
          Alertas priorizadas ({demo.risks.length})
        </h2>
        {demo.risks.map((risk, i) => {
          const tint = SEVERITY_TINT[risk.level];
          const Icon = tint.icon;
          return (
            <Card key={i} className="overflow-hidden">
              <div className={`h-1 w-full ${tint.bar}`} />
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-acero flex items-center justify-center text-2xl shrink-0`}>
                    {risk.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <Badge variant={tint.badge}>{risk.level.toUpperCase()}</Badge>
                      <Icon className={`h-3 w-3 ${tint.text}`} />
                    </div>
                    <h3 className="text-lg font-body font-medium text-artico">{risk.title}</h3>
                    <p className="mt-2 text-sm text-artico/70 leading-relaxed">{risk.reasoning}</p>

                    <div className="mt-4">
                      <p className="text-xs font-mono uppercase tracking-wider text-artico/40 mb-2">
                        Acciones sugeridas
                      </p>
                      <ul className="space-y-1.5">
                        {risk.suggestedActions.map((a, j) => (
                          <li key={j} className="text-sm text-artico/85 flex items-start gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${tint.bar}`} />
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <Card>
        <CardContent className="p-5 text-xs font-mono text-artico/50 flex items-center gap-3">
          <FileBarChart2 className="h-4 w-4" />
          <span>API: GET /api/copilot/daily-risk?h=24</span>
          <span>·</span>
          <span>Heurísticas determinísticas + resumen Claude. Tenant-isolated por organizationId.</span>
        </CardContent>
      </Card>
    </div>
  );
}
