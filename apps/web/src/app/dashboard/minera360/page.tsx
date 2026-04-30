import Link from "next/link";
import { Plus, FileBarChart2, ShieldCheck, AlertTriangle, ClipboardCheck, TrendingDown, TrendingUp, ArrowRight } from "lucide-react";
import { Button, Card, CardContent, StatCard, SeverityBadge, Badge } from "@latitud360/ui";

export default function HSEDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header + filtros + CTA */}
      <header className="flex flex-col md:flex-row md:items-end gap-4 justify-between">
        <div>
          <p className="text-xs font-mono text-artico/50 uppercase tracking-[0.2em]">
            Minera360 → SafetyOps → Dashboard
          </p>
          <h1 className="mt-2 font-heading italic text-4xl md:text-5xl text-artico tracking-tight">
            Dashboard HSE
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="md" asChild>
            <Link href="/dashboard/minera360/reportes"><FileBarChart2 className="h-4 w-4" /> Reporte SRT</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/minera360/incidentes/nuevo"><Plus className="h-4 w-4" /> Reportar incidente</Link>
          </Button>
        </div>
      </header>

      {/* Hero — Días sin accidentes */}
      <Card className="overflow-hidden ring-1 ring-naranja/30">
        <div className="relative bg-gradient-to-br from-naranja/[0.10] via-mina to-mina p-8 md:p-12">
          <div className="absolute inset-0 pointer-events-none opacity-30 mix-blend-overlay"
               style={{ background: "radial-gradient(60% 80% at 50% 100%, rgba(255,107,26,0.4) 0%, transparent 60%)" }} />
          <div className="relative">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-naranja">Récord histórico</p>
            <div className="mt-4 flex items-baseline gap-6 flex-wrap">
              <span className="font-heading italic text-7xl md:text-9xl text-artico leading-none tracking-tight">127</span>
              <div>
                <p className="text-xl text-artico font-body">Días sin accidentes con tiempo perdido</p>
                <p className="text-sm text-artico/60 mt-1">Mina Hombre Muerto · récord histórico de la operación</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 4 KPIs */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="LTIFR" value="0.42"
          delta={{ value: "−18% vs mes anterior", trend: "down" }}
          icon={<TrendingDown className="h-4 w-4" />} accent="ok" />
        <StatCard label="TRIFR" value="1.28"
          delta={{ value: "−12%", trend: "down" }}
          icon={<TrendingDown className="h-4 w-4" />} accent="ok" />
        <StatCard label="Severity Rate" value="8.4"
          delta={{ value: "estable", trend: "flat" }}
          icon={<ShieldCheck className="h-4 w-4" />} />
        <StatCard label="Cumplimiento inspecciones" value="94%"
          delta={{ value: "+5%", trend: "up" }}
          icon={<TrendingUp className="h-4 w-4" />} accent="ok" />
      </section>

      {/* Incidentes recientes + acciones pendientes */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-mono text-xs uppercase tracking-wider text-artico/60">Incidentes recientes</h3>
              <Link href="/dashboard/minera360/incidentes" className="text-xs text-naranja hover:underline inline-flex items-center gap-1">
                Ver todos <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <ul className="divide-y divide-niebla">
              <li className="py-3 flex items-center gap-4">
                <SeverityBadge severity="high" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-artico truncate">Caída de roca cerca de pasarela de planta</p>
                  <p className="text-xs text-artico/50 font-mono mt-0.5">Planta procesamiento · 15-abr · investigando</p>
                </div>
                <Badge variant="warn">Investigando</Badge>
              </li>
              <li className="py-3 flex items-center gap-4">
                <SeverityBadge severity="medium" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-artico truncate">Extintor vencido en taller mecánico</p>
                  <p className="text-xs text-artico/50 font-mono mt-0.5">Taller mecánico · 22-abr · cerrado</p>
                </div>
                <Badge variant="ok">Cerrado</Badge>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-mono text-xs uppercase tracking-wider text-artico/60">Permisos activos</h3>
              <ClipboardCheck className="h-4 w-4 text-artico/40" />
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-pill bg-alerta" />
                <span className="flex-1 truncate">Trabajo en altura — Plataforma 3</span>
                <span className="text-xs font-mono text-artico/40">14:00</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-pill bg-warn" />
                <span className="flex-1 truncate">Espacio confinado — Tanque T-04</span>
                <span className="text-xs font-mono text-artico/40">09:00</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-pill bg-naranja" />
                <span className="flex-1 truncate">Eléctrico — Sub-estación A</span>
                <span className="text-xs font-mono text-artico/40">11:30</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Acciones pendientes */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-mono text-xs uppercase tracking-wider text-artico/60">Acciones preventivas pendientes</h3>
            <Badge variant="alerta">3 vencidas</Badge>
          </div>
          <table className="w-full text-sm">
            <thead className="text-xs font-mono uppercase tracking-wider text-artico/50">
              <tr className="border-b border-niebla">
                <th className="text-left py-2.5">Acción</th>
                <th className="text-left">Asignado</th>
                <th className="text-left">Vence</th>
                <th className="text-left">Severidad</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-niebla">
              <tr className="hover:bg-acero/30">
                <td className="py-3 text-artico/90">Inspección extraordinaria pasarela planta procesamiento</td>
                <td className="text-artico/70">Carlos Mendoza</td>
                <td className="text-artico/70 font-mono">02-may</td>
                <td><SeverityBadge severity="high" showEmoji={false} /></td>
              </tr>
              <tr className="hover:bg-acero/30">
                <td className="py-3 text-artico/90">Reentrenamiento de manejo defensivo turno noche</td>
                <td className="text-artico/70">Roberto Méndez</td>
                <td className="text-artico/70 font-mono">05-may</td>
                <td><SeverityBadge severity="medium" showEmoji={false} /></td>
              </tr>
              <tr className="hover:bg-acero/30">
                <td className="py-3 text-artico/90">Auditoría stock EPP crítico Q2</td>
                <td className="text-artico/70">Mariana Salas</td>
                <td className="text-artico/70 font-mono">10-may</td>
                <td><SeverityBadge severity="low" showEmoji={false} /></td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
