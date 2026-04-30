import Link from "next/link";
import { Plus, Filter, Sun, Moon, Sunset, ClipboardList, CheckCircle2 } from "lucide-react";
import { Badge, Button, Card, CardContent, StatCard } from "@latitud360/ui";

const partes = [
  {
    id: "1", reportDate: "2026-04-29", shift: "morning",
    site: "Mina Hombre Muerto", area: "Tajo principal",
    weather: "Despejado, viento NO 18km/h",
    reporter: "Roberto Méndez", status: "approved",
  },
  {
    id: "2", reportDate: "2026-04-29", shift: "afternoon",
    site: "Mina Hombre Muerto", area: "Planta de procesamiento",
    weather: "Parcial nubosidad",
    reporter: "Mariana Salas", status: "submitted",
  },
  {
    id: "3", reportDate: "2026-04-28", shift: "night",
    site: "Mina Hombre Muerto", area: "Tajo principal",
    weather: "Despejado, frío -4°C",
    reporter: "Juan Carlos Quispe", status: "approved",
  },
  {
    id: "4", reportDate: "2026-04-28", shift: "morning",
    site: "Mina Hombre Muerto", area: "Taller mecánico",
    weather: "Despejado",
    reporter: "Roberto Méndez", status: "approved",
  },
] as const;

const shiftIcons = { morning: Sun, afternoon: Sunset, night: Moon };
const shiftLabels = { morning: "Mañana", afternoon: "Tarde", night: "Noche" };

export default function PartesPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-mono text-artico/50 uppercase tracking-[0.2em]">
            Minera360 → SafetyOps → Partes diarios
          </p>
          <h1 className="mt-2 font-heading italic text-4xl text-artico tracking-tight">Partes diarios</h1>
          <p className="mt-1 text-sm text-artico/60">Registros de turno por sitio y área. Firmas digitales.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline"><Filter className="h-4 w-4" /> Filtros</Button>
          <Button><Plus className="h-4 w-4" /> Nuevo parte</Button>
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Partes este mes" value="47" />
        <StatCard label="Pendientes de firma" value="3" tint="warn" />
        <StatCard label="% firmados a tiempo" value="94%" tint="ok" />
      </section>

      <Card>
        <CardContent className="p-0">
          <ul className="divide-y divide-niebla">
            {partes.map((p) => {
              const Icon = shiftIcons[p.shift as keyof typeof shiftIcons];
              return (
                <li key={p.id}>
                  <Link href={`/dashboard/minera360/partes/${p.id}`}
                        className="flex items-start gap-4 p-5 hover:bg-acero/30 transition-colors">
                    <div className="w-11 h-11 rounded-xl bg-acero flex items-center justify-center text-naranja shrink-0">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base text-artico font-body font-medium">
                        {shiftLabels[p.shift as keyof typeof shiftLabels]} · {p.area}
                      </h3>
                      <p className="mt-1 text-xs font-mono text-artico/50 flex items-center gap-2 flex-wrap">
                        <ClipboardList className="h-3 w-3" />
                        <span>{p.reportDate}</span>
                        <span>·</span>
                        <span>{p.site}</span>
                        <span>·</span>
                        <span>{p.weather}</span>
                        <span>·</span>
                        <span>Firmado por {p.reporter}</span>
                      </p>
                    </div>
                    {p.status === "approved" ? (
                      <Badge variant="ok"><CheckCircle2 className="h-3 w-3" /> Aprobado</Badge>
                    ) : (
                      <Badge variant="warn">Pendiente</Badge>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
