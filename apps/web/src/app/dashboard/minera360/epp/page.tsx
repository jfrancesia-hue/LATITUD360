import { Plus, Filter, HardHat, AlertTriangle, ShieldAlert } from "lucide-react";
import { Badge, Button, Card, CardContent, StatCard } from "@latitud360/ui";

const PPE_CATEGORY_LABELS: Record<string, string> = {
  head: "Cabeza",
  eye: "Vista",
  hand: "Manos",
  foot: "Pies",
  body: "Cuerpo",
  respiratory: "Respiratorio",
};

const catalog = [
  { id: "1", name: "Casco minero clase E", category: "head", brand: "MSA", stock: 47, isCritical: true,  certificationStandard: "IRAM 3620" },
  { id: "2", name: "Antiparra alta resistencia", category: "eye",  brand: "3M",  stock: 92, isCritical: true,  certificationStandard: "ANSI Z87.1" },
  { id: "3", name: "Botas con puntera de acero",  category: "foot", brand: "Bata", stock: 23, isCritical: true,  certificationStandard: "IRAM 3610" },
  { id: "4", name: "Guantes anti-corte nivel 5",   category: "hand", brand: "Ansell", stock: 67, isCritical: false, certificationStandard: "EN 388" },
  { id: "5", name: "Respirador media cara",        category: "respiratory", brand: "3M", stock: 34, isCritical: true, certificationStandard: "NIOSH N95" },
  { id: "6", name: "Mameluco térmico altura",      category: "body", brand: "Pampero", stock: 18, isCritical: true, certificationStandard: "IRAM 3892" },
] as const;

const expiring = [
  { id: "1", user: "Roberto Méndez",       ppe: "Casco minero clase E", daysToExpire: 3,  isCritical: true },
  { id: "2", user: "Juan Carlos Quispe",   ppe: "Respirador media cara", daysToExpire: 7,  isCritical: true },
  { id: "3", user: "Mariana Salas",        ppe: "Antiparra alta resistencia", daysToExpire: 12, isCritical: true },
  { id: "4", user: "Carlos Aguirre",       ppe: "Guantes anti-corte nivel 5", daysToExpire: 21, isCritical: false },
] as const;

export default function PpePage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-mono text-artico/50 uppercase tracking-[0.2em]">
            Minera360 → SafetyOps → EPP
          </p>
          <h1 className="mt-2 font-heading italic text-4xl text-artico tracking-tight">Equipos de Protección Personal</h1>
          <p className="mt-1 text-sm text-artico/60">Catálogo, asignaciones, vencimientos y compliance crítico.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline"><Filter className="h-4 w-4" /> Filtros</Button>
          <Button variant="outline">Importar CSV</Button>
          <Button><Plus className="h-4 w-4" /> Nuevo EPP</Button>
        </div>
      </header>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="EPPs en catálogo" value="6" />
        <StatCard label="Críticos" value="5" tint="warn" />
        <StatCard label="Asignaciones activas" value="281" />
        <StatCard label="Vencen ≤ 30 días" value="4" tint="alerta" />
      </section>

      <section>
        <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-artico/50 mb-3">Catálogo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {catalog.map((p) => (
            <Card key={p.id} className="hover:translate-y-[-1px] transition-transform">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="w-11 h-11 rounded-xl bg-acero flex items-center justify-center text-naranja">
                    <HardHat className="h-5 w-5" />
                  </div>
                  {p.isCritical && (
                    <Badge variant="alerta"><ShieldAlert className="h-3 w-3" /> Crítico</Badge>
                  )}
                </div>
                <h3 className="mt-4 text-base font-body font-medium text-artico">{p.name}</h3>
                <p className="mt-1 text-xs font-mono text-artico/50 uppercase tracking-wider">
                  {PPE_CATEGORY_LABELS[p.category]} · {p.brand}
                </p>
                <div className="mt-4 flex items-baseline justify-between border-t border-niebla pt-3">
                  <span className="text-xs text-artico/60">Stock</span>
                  <span className="font-heading italic text-2xl text-artico">{p.stock}</span>
                </div>
                <p className="mt-2 text-[10px] font-mono text-artico/40">{p.certificationStandard}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-artico/50 mb-3">Vencimientos próximos</h2>
        <Card>
          <CardContent className="p-0">
            <ul className="divide-y divide-niebla">
              {expiring.map((e) => (
                <li key={e.id} className="flex items-center gap-4 p-5">
                  <AlertTriangle className={`h-5 w-5 ${e.daysToExpire <= 7 ? "text-alerta" : "text-warn"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-artico font-body font-medium">{e.user}</span>
                      {e.isCritical && <Badge variant="alerta">Crítico</Badge>}
                    </div>
                    <p className="text-xs font-mono text-artico/50">{e.ppe}</p>
                  </div>
                  <span className={`font-heading italic text-2xl ${e.daysToExpire <= 7 ? "text-alerta" : "text-warn"}`}>
                    {e.daysToExpire}d
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
