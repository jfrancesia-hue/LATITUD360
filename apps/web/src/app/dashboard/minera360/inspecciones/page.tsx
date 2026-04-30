import { Plus, Filter, ClipboardCheck, Calendar, TrendingUp, AlertTriangle } from "lucide-react";
import { Badge, Button, Card, CardContent, SeverityBadge, StatCard } from "@latitud360/ui";

const inspections = [
  {
    id: "1", type: "safety_walk", site: "Mina Hombre Muerto",
    inspector: "Carlos Aguirre", scheduledFor: "2026-04-29", completedAt: "2026-04-29",
    score: 96.5, findings: 2,
  },
  {
    id: "2", type: "equipment", site: "Mina Hombre Muerto",
    inspector: "Roberto Méndez", scheduledFor: "2026-04-28", completedAt: "2026-04-28",
    score: 88.0, findings: 5,
  },
  {
    id: "3", type: "environmental", site: "Mina Hombre Muerto",
    inspector: "Mariana Salas", scheduledFor: "2026-04-30", completedAt: null,
    score: null, findings: 0,
  },
  {
    id: "4", type: "safety_walk", site: "Mina Hombre Muerto",
    inspector: "Carlos Aguirre", scheduledFor: "2026-05-02", completedAt: null,
    score: null, findings: 0,
  },
] as const;

const openFindings = [
  { id: "1", severity: "high", description: "Extintor fuera de su soporte cerca planta 2", inspectionType: "safety_walk", dueDate: "2026-05-02" },
  { id: "2", severity: "medium", description: "Falta señalización de emergencia en pasillo 4", inspectionType: "safety_walk", dueDate: "2026-05-05" },
  { id: "3", severity: "high", description: "Vibración fuera de rango en cinta transportadora 3", inspectionType: "equipment", dueDate: "2026-05-01" },
  { id: "4", severity: "low", description: "Etiqueta de tablero eléctrico desgastada", inspectionType: "equipment", dueDate: "2026-05-10" },
] as const;

const TYPE_LABELS: Record<string, string> = {
  safety_walk: "Recorrida de seguridad",
  equipment: "Equipos",
  environmental: "Ambiental",
};

export default function InspectionsPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-mono text-artico/50 uppercase tracking-[0.2em]">
            Minera360 → SafetyOps → Inspecciones
          </p>
          <h1 className="mt-2 font-heading italic text-4xl text-artico tracking-tight">Inspecciones</h1>
          <p className="mt-1 text-sm text-artico/60">Plantillas, ejecuciones, scoring automático y findings.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline"><Filter className="h-4 w-4" /> Filtros</Button>
          <Button variant="outline">Plantillas</Button>
          <Button><Plus className="h-4 w-4" /> Nueva inspección</Button>
        </div>
      </header>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Programadas" value="2" />
        <StatCard label="Score promedio" value="92%" tint="ok" />
        <StatCard label="Findings abiertos" value="4" tint="warn" />
        <StatCard label="Cumplimiento" value="94%" tint="ok" />
      </section>

      <section>
        <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-artico/50 mb-3">Inspecciones recientes</h2>
        <Card>
          <CardContent className="p-0">
            <ul className="divide-y divide-niebla">
              {inspections.map((i) => (
                <li key={i.id} className="flex items-start gap-4 p-5 hover:bg-acero/30 transition-colors cursor-pointer">
                  <div className="w-11 h-11 rounded-xl bg-acero flex items-center justify-center text-naranja shrink-0">
                    <ClipboardCheck className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base text-artico font-body font-medium">{TYPE_LABELS[i.type]}</h3>
                      <Badge>{i.site}</Badge>
                    </div>
                    <p className="mt-1 text-xs font-mono text-artico/50 flex items-center gap-2 flex-wrap">
                      <Calendar className="h-3 w-3" />
                      <span>Programada {i.scheduledFor}</span>
                      <span>·</span>
                      <span>Inspector {i.inspector}</span>
                      {i.findings > 0 && (
                        <>
                          <span>·</span>
                          <span className="text-warn">{i.findings} findings</span>
                        </>
                      )}
                    </p>
                  </div>
                  {i.completedAt ? (
                    <div className="text-right">
                      <div className="font-heading italic text-3xl text-ok leading-none">{i.score?.toFixed(0)}%</div>
                      <div className="text-[10px] font-mono text-artico/40 mt-1">SCORE</div>
                    </div>
                  ) : (
                    <Badge variant="warn">Pendiente</Badge>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-artico/50 mb-3">Findings abiertos</h2>
        <Card>
          <CardContent className="p-0">
            <ul className="divide-y divide-niebla">
              {openFindings.map((f) => (
                <li key={f.id} className="flex items-start gap-4 p-4">
                  <SeverityBadge severity={f.severity} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-artico/85">{f.description}</p>
                    <p className="mt-1 text-xs font-mono text-artico/40">
                      {TYPE_LABELS[f.inspectionType]} · vence {f.dueDate}
                    </p>
                  </div>
                  <AlertTriangle className="h-4 w-4 text-warn shrink-0 mt-1" />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
