import Link from "next/link";
import { Plus, MapPin, Filter } from "lucide-react";
import { Button, Card, CardContent, SeverityBadge, Badge } from "@latitud360/ui";
import { INCIDENT_TYPE_LABELS } from "@latitud360/shared";

const incidents = [
  {
    id: "1", title: "Caída de roca cerca de pasarela de planta",
    type: "near_miss", severity: "high", status: "investigating",
    site: "Mina Hombre Muerto", area: "Planta de procesamiento",
    occurredAt: "2026-04-15", reporter: "Juan Carlos Quispe",
  },
  {
    id: "2", title: "Extintor vencido en taller mecánico",
    type: "unsafe_condition", severity: "medium", status: "closed",
    site: "Mina Hombre Muerto", area: "Taller mecánico",
    occurredAt: "2026-04-22", reporter: "Roberto Méndez",
  },
] as const;

export default function IncidentsListPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-mono text-artico/50 uppercase tracking-[0.2em]">
            Minera360 → SafetyOps → Incidentes
          </p>
          <h1 className="mt-2 font-heading italic text-4xl text-artico tracking-tight">Incidentes</h1>
          <p className="mt-1 text-sm text-artico/60">2 abiertos · 1 cerrado este mes · 0 críticos abiertos</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline"><Filter className="h-4 w-4" /> Filtros</Button>
          <Button asChild>
            <Link href="/dashboard/minera360/incidentes/nuevo"><Plus className="h-4 w-4" /> Reportar incidente</Link>
          </Button>
        </div>
      </header>

      {/* Lista */}
      <Card>
        <CardContent className="p-0">
          <ul className="divide-y divide-niebla">
            {incidents.map((inc) => (
              <li key={inc.id}>
                <Link href={`/dashboard/minera360/incidentes/${inc.id}`}
                      className="flex items-start gap-4 p-5 hover:bg-acero/30 transition-colors">
                  <SeverityBadge severity={inc.severity} />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base text-artico font-body font-medium truncate">{inc.title}</h3>
                    <p className="mt-1 text-xs font-mono text-artico/50 flex items-center gap-2 flex-wrap">
                      <span>{INCIDENT_TYPE_LABELS[inc.type]}</span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {inc.area}</span>
                      <span>·</span>
                      <span>{inc.occurredAt}</span>
                      <span>·</span>
                      <span>Reportado por {inc.reporter}</span>
                    </p>
                  </div>
                  {inc.status === "closed"
                    ? <Badge variant="ok">Cerrado</Badge>
                    : <Badge variant="warn">Investigando</Badge>}
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
