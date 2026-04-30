import Link from "next/link";
import { ArrowLeft, MapPin, Calendar, User, AlertTriangle, FileText, CheckCircle2, Plus } from "lucide-react";
import { Avatar, Badge, Button, Card, CardContent, SeverityBadge, StatCard } from "@latitud360/ui";

const incident = {
  id: "demo",
  title: "Caída de roca cerca de pasarela de planta",
  type: "near_miss",
  severity: "high" as const,
  status: "investigating",
  description:
    "Se desprendió una roca de aproximadamente 30kg desde el talud sur cerca de la pasarela de acceso a planta. " +
    "No hubo personal en el área en ese momento. La roca impactó la baranda metálica sin pasar al lado peatonal. " +
    "Se observó deterioro de la malla de contención en el sector.",
  occurredAt: "2026-04-15T11:42:00",
  reportedAt: "2026-04-15T12:08:00",
  site: "Mina Hombre Muerto",
  area: "Pasarela acceso planta",
  reporter: { fullName: "Juan Carlos Quispe", jobTitle: "Operario chofer CAT 793" },
  injuryType: null,
  daysLost: 0,
  involvedUsers: [],
  photos: [],
};

const investigation = {
  method: "5_porques",
  rootCauses: [
    { cause: "La malla de contención del talud sur estaba dañada", evidence: "Inspección visual mostró dos secciones con roturas mayores a 50cm", depth: 1 },
    { cause: "El plan de inspección de taludes no se ejecutó en abril", evidence: "Última inspección registrada: 12/marzo", depth: 2 },
    { cause: "Falta de responsable asignado tras rotación de supervisor", evidence: "Cambio de supervisor el 28/marzo sin handover formal", depth: 3 },
    { cause: "El procedimiento de handover de turno no incluye el plan de inspección de taludes", evidence: "SOP HSE-014 no menciona taludes", depth: 4 },
    { cause: "El SOP no fue actualizado tras la nueva matriz de riesgos 2026", evidence: "Última versión SOP: enero 2025", depth: 5 },
  ],
  immediateActions: [
    "Cerrar acceso peatonal a pasarela hasta reparación",
    "Reemplazar malla en sector identificado",
    "Comunicado oficial a todo el personal",
  ],
  preventiveActions: [
    { action: "Actualizar SOP HSE-014 con plan de inspección de taludes", assignedTo: "Carlos Aguirre", dueDate: "2026-05-10", status: "in_progress" as const },
    { action: "Incluir checklist de taludes en handover de supervisor",      assignedTo: "Mariana Salas",  dueDate: "2026-05-05", status: "open" as const },
    { action: "Capacitar 6 supervisores en nueva matriz de riesgos 2026",     assignedTo: "Carlos Aguirre", dueDate: "2026-05-30", status: "open" as const },
  ],
  conclusions: null,
  closedAt: null,
};

const STATUS_LABELS: Record<string, string> = {
  open: "Abierta",
  in_progress: "En progreso",
  completed: "Completada",
  verified: "Verificada",
};

const STATUS_TINT: Record<string, "warn" | "ok" | undefined> = {
  open: "warn",
  in_progress: "warn",
  completed: "ok",
  verified: "ok",
};

export default function IncidentDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6 max-w-5xl">
      <header className="flex items-start gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard/minera360/incidentes">
            <ArrowLeft className="h-4 w-4" /> Incidentes
          </Link>
        </Button>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-mono text-artico/50 uppercase tracking-[0.2em]">
            Minera360 → SafetyOps → Incidente {params.id}
          </p>
          <h1 className="mt-1 font-heading italic text-3xl text-artico tracking-tight leading-tight">
            {incident.title}
          </h1>
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <SeverityBadge severity={incident.severity} />
            <Badge variant="warn">Investigando</Badge>
            <span className="text-xs font-mono text-artico/50">
              <MapPin className="inline h-3 w-3" /> {incident.site} · {incident.area}
            </span>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Días perdidos" value={String(incident.daysLost)} tint="ok" />
        <StatCard label="Personas involucradas" value={String(incident.involvedUsers.length)} />
        <StatCard label="Causas raíz" value={String(investigation.rootCauses.length)} />
        <StatCard label="Acciones preventivas" value={String(investigation.preventiveActions.length)} />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-artico/50 mb-3">
              Descripción
            </h2>
            <p className="text-sm text-artico/85 leading-relaxed">{incident.description}</p>

            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-artico/40">Ocurrió</p>
                <p className="mt-1 text-artico/85 flex items-center gap-2">
                  <Calendar className="h-3 w-3" /> {new Date(incident.occurredAt).toLocaleString("es-AR")}
                </p>
              </div>
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-artico/40">Reportado</p>
                <p className="mt-1 text-artico/85 flex items-center gap-2">
                  <Calendar className="h-3 w-3" /> {new Date(incident.reportedAt).toLocaleString("es-AR")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-artico/50 mb-3">
              Reportado por
            </h2>
            <div className="flex items-center gap-3">
              <Avatar fallback={incident.reporter.fullName} />
              <div>
                <p className="text-sm font-body text-artico">{incident.reporter.fullName}</p>
                <p className="text-xs font-mono text-artico/50">{incident.reporter.jobTitle}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-artico/50 flex items-center gap-2">
            <AlertTriangle className="h-3 w-3" /> Investigación 5 Por Qué
          </h2>
          <Button size="sm" variant="outline">Editar investigación</Button>
        </div>
        <Card>
          <CardContent className="p-0">
            <ol className="divide-y divide-niebla">
              {investigation.rootCauses.map((rc) => (
                <li key={rc.depth} className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-full bg-acero flex items-center justify-center font-heading italic text-xl text-naranja shrink-0">
                      {rc.depth}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-body text-artico">{rc.cause}</p>
                      <p className="mt-1 text-xs font-mono text-artico/50">{rc.evidence}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-artico/50 mb-3 flex items-center gap-2">
          <CheckCircle2 className="h-3 w-3" /> Acciones inmediatas
        </h2>
        <Card>
          <CardContent className="p-5">
            <ul className="space-y-2">
              {investigation.immediateActions.map((a, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-artico/85">
                  <CheckCircle2 className="h-4 w-4 text-ok" /> {a}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-artico/50 flex items-center gap-2">
            <FileText className="h-3 w-3" /> Acciones preventivas
          </h2>
          <Button size="sm"><Plus className="h-3 w-3" /> Agregar acción</Button>
        </div>
        <Card>
          <CardContent className="p-0">
            <ul className="divide-y divide-niebla">
              {investigation.preventiveActions.map((a, i) => (
                <li key={i} className="flex items-start gap-4 p-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-artico/85">{a.action}</p>
                    <p className="mt-1 text-xs font-mono text-artico/50 flex items-center gap-2">
                      <User className="h-3 w-3" /> {a.assignedTo}
                      <span>·</span>
                      <Calendar className="h-3 w-3" /> {a.dueDate}
                    </p>
                  </div>
                  <Badge variant={STATUS_TINT[a.status]}>{STATUS_LABELS[a.status]}</Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
