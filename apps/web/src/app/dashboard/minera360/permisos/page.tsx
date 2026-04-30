import { Plus, Filter, ClipboardCheck, ArrowUpRight } from "lucide-react";
import { Badge, Button, Card, CardContent, StatCard } from "@latitud360/ui";

const PERMIT_TYPE_LABELS: Record<string, string> = {
  height: "Trabajo en altura",
  confined_space: "Espacio confinado",
  hot_work: "Trabajo en caliente",
  electrical: "Trabajo eléctrico",
  lifting: "Izaje",
  excavation: "Excavación",
  chemical: "Manipulación química",
};

const permits = [
  {
    id: "1", permitType: "height", status: "active",
    description: "Mantenimiento estructura cinta transportadora 4",
    site: "Mina Hombre Muerto", area: "Planta de procesamiento",
    workers: 4, validFrom: "2026-04-29 07:00", validUntil: "2026-04-29 15:00",
    requestedBy: "Roberto Méndez", approvedBy: "Carlos Aguirre",
  },
  {
    id: "2", permitType: "hot_work", status: "active",
    description: "Soldadura cañería principal salar 3",
    site: "Mina Hombre Muerto", area: "Salar 3",
    workers: 2, validFrom: "2026-04-29 09:00", validUntil: "2026-04-29 13:00",
    requestedBy: "Mariana Salas", approvedBy: "Carlos Aguirre",
  },
  {
    id: "3", permitType: "confined_space", status: "pending",
    description: "Inspección interna tanque de salmuera 7",
    site: "Mina Hombre Muerto", area: "Tanques de salmuera",
    workers: 3, validFrom: "2026-04-30 08:00", validUntil: "2026-04-30 12:00",
    requestedBy: "Juan Carlos Quispe", approvedBy: null,
  },
  {
    id: "4", permitType: "electrical", status: "closed",
    description: "Mantenimiento tablero eléctrico planta 2",
    site: "Mina Hombre Muerto", area: "Planta de procesamiento",
    workers: 2, validFrom: "2026-04-28 14:00", validUntil: "2026-04-28 18:00",
    requestedBy: "Roberto Méndez", approvedBy: "Carlos Aguirre",
  },
] as const;

export default function PermitsPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-mono text-artico/50 uppercase tracking-[0.2em]">
            Minera360 → SafetyOps → Permisos de trabajo
          </p>
          <h1 className="mt-2 font-heading italic text-4xl text-artico tracking-tight">Permisos de trabajo</h1>
          <p className="mt-1 text-sm text-artico/60">Aprobaciones, vigencia y trazabilidad por tipo de permiso.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline"><Filter className="h-4 w-4" /> Filtros</Button>
          <Button><Plus className="h-4 w-4" /> Solicitar permiso</Button>
        </div>
      </header>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Activos ahora" value="2" />
        <StatCard label="Pendientes aprob." value="1" tint="warn" />
        <StatCard label="Esta semana" value="14" />
        <StatCard label="Vencimiento ≤ 2h" value="0" tint="ok" />
      </section>

      <Card>
        <CardContent className="p-0">
          <ul className="divide-y divide-niebla">
            {permits.map((p) => (
              <li key={p.id}>
                <div className="flex items-start gap-4 p-5 hover:bg-acero/30 transition-colors cursor-pointer">
                  <div className="w-11 h-11 rounded-xl bg-acero flex items-center justify-center text-naranja shrink-0">
                    <ClipboardCheck className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base text-artico font-body font-medium">{p.description}</h3>
                      <Badge>{PERMIT_TYPE_LABELS[p.permitType]}</Badge>
                    </div>
                    <p className="mt-1 text-xs font-mono text-artico/50 flex items-center gap-2 flex-wrap">
                      <span>{p.site} · {p.area}</span>
                      <span>·</span>
                      <span>{p.workers} trabajador{p.workers === 1 ? "" : "es"}</span>
                      <span>·</span>
                      <span>{p.validFrom} → {p.validUntil}</span>
                      <span>·</span>
                      <span>Solicitado por {p.requestedBy}</span>
                      {p.approvedBy && (<><span>·</span><span>Aprobado por {p.approvedBy}</span></>)}
                    </p>
                  </div>
                  {p.status === "active" ? (
                    <Badge variant="ok">Activo</Badge>
                  ) : p.status === "pending" ? (
                    <Badge variant="warn">Pendiente</Badge>
                  ) : (
                    <Badge>Cerrado</Badge>
                  )}
                  <ArrowUpRight className="h-4 w-4 text-artico/40 shrink-0 mt-2" />
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
