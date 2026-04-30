import { Plus, Trophy, Heart, ShieldCheck, Users as UsersIcon, Sparkles, Award } from "lucide-react";
import { Avatar, Badge, Button, Card, CardContent, StatCard } from "@latitud360/ui";

const VALUE_LABELS: Record<string, { label: string; icon: typeof Heart }> = {
  seguridad: { label: "Seguridad ante todo", icon: ShieldCheck },
  trabajo_equipo: { label: "Trabajo en equipo", icon: UsersIcon },
  excelencia: { label: "Excelencia operativa", icon: Trophy },
  iniciativa: { label: "Iniciativa", icon: Sparkles },
};

const recentRecognitions = [
  { id: "1", from: "Carlos Aguirre", to: "Roberto Méndez", value: "seguridad",
    message: "Anticipaste el riesgo de la cinta y la frenaste antes que pasara algo. Ese reflejo nos salva siempre.",
    daysAgo: 1 },
  { id: "2", from: "Mariana Salas", to: "Juan Carlos Quispe", value: "trabajo_equipo",
    message: "Te quedaste 2 horas extra para terminar el turno cuando faltó el reemplazo. Gracias.",
    daysAgo: 2 },
  { id: "3", from: "Roberto Méndez", to: "Carlos Aguirre", value: "excelencia",
    message: "Tu plan de mantenimiento bajó el downtime 30%. Liderazgo puro.",
    daysAgo: 3 },
  { id: "4", from: "Juan Carlos Quispe", to: "Mariana Salas", value: "iniciativa",
    message: "Propusiste el nuevo proceso de carga y se viene aplicando hace un mes con éxito.",
    daysAgo: 5 },
] as const;

const leaderboard = [
  { rank: 1, name: "Roberto Méndez",     role: "Supervisor turno mañana", count: 14 },
  { rank: 2, name: "Mariana Salas",      role: "Coordinadora HSE",        count: 11 },
  { rank: 3, name: "Juan Carlos Quispe", role: "Operario senior",         count: 9 },
  { rank: 4, name: "Carlos Aguirre",     role: "HSE Manager",             count: 7 },
  { rank: 5, name: "Ana Castro",         role: "Operadora planta",        count: 5 },
] as const;

const byValue = [
  { value: "seguridad",      count: 18 },
  { value: "trabajo_equipo", count: 12 },
  { value: "excelencia",     count: 10 },
  { value: "iniciativa",     count: 7 },
] as const;

const totalThisMonth = byValue.reduce((sum, v) => sum + v.count, 0);

export default function RecognitionsPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-mono text-artico/50 uppercase tracking-[0.2em]">
            Contacto → Reconocimientos
          </p>
          <h1 className="mt-2 font-heading italic text-4xl text-artico tracking-tight">Reconocimientos</h1>
          <p className="mt-1 text-sm text-artico/60">Cultura por valores, ranking del mes y feed reciente.</p>
        </div>
        <div className="flex gap-3">
          <Button><Plus className="h-4 w-4" /> Reconocer a alguien</Button>
        </div>
      </header>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Este mes" value={String(totalThisMonth)} tint="ok" />
        <StatCard label="Reconocedores únicos" value="22" />
        <StatCard label="Reconocidos únicos" value="31" />
        <StatCard label="Promedio por usuario" value="0.6" />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-artico/50 mb-3">Feed reciente</h2>
          <Card>
            <CardContent className="p-0">
              <ul className="divide-y divide-niebla">
                {recentRecognitions.map((r) => {
                  const meta = VALUE_LABELS[r.value];
                  const Icon = meta?.icon ?? Heart;
                  return (
                    <li key={r.id} className="p-5">
                      <div className="flex items-center gap-3">
                        <Avatar fallback={r.from} size="sm" />
                        <span className="text-sm text-artico/85">
                          <strong>{r.from}</strong> reconoció a <strong>{r.to}</strong>
                        </span>
                        <Badge variant="ok"><Icon className="h-3 w-3" /> {meta?.label ?? r.value}</Badge>
                        <span className="ml-auto text-xs font-mono text-artico/40">hace {r.daysAgo}d</span>
                      </div>
                      <p className="mt-3 pl-11 text-sm text-artico/85 leading-relaxed">"{r.message}"</p>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-artico/50 mb-3">Top del mes</h2>
          <Card>
            <CardContent className="p-5">
              <ul className="space-y-4">
                {leaderboard.map((u) => (
                  <li key={u.rank} className="flex items-center gap-3">
                    <span className={`w-6 text-center font-heading italic text-xl ${u.rank === 1 ? "text-dorado" : "text-artico/60"}`}>
                      {u.rank}
                    </span>
                    <Avatar fallback={u.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-artico truncate">{u.name}</p>
                      <p className="text-[10px] font-mono text-artico/40 truncate">{u.role}</p>
                    </div>
                    <span className="font-heading italic text-xl text-artico">{u.count}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-artico/50 mt-6 mb-3">Por valor</h2>
          <Card>
            <CardContent className="p-5">
              <ul className="space-y-3">
                {byValue.map((v) => {
                  const meta = VALUE_LABELS[v.value];
                  const pct = (100 * v.count) / totalThisMonth;
                  return (
                    <li key={v.value}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-artico/85">{meta?.label ?? v.value}</span>
                        <span className="font-mono text-xs text-artico/50">{v.count}</span>
                      </div>
                      <div className="h-1.5 bg-acero rounded-full overflow-hidden">
                        <div className="h-full bg-turquesa" style={{ width: `${pct}%` }} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
