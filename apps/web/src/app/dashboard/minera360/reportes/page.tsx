import { Download, FileText, Calendar, TrendingDown, TrendingUp } from "lucide-react";
import { Button, Card, CardContent, StatCard } from "@latitud360/ui";

const monthlyKpis = [
  { month: "Ene", incidents: 3, ltifr: 0.52, severity: 8.4 },
  { month: "Feb", incidents: 2, ltifr: 0.43, severity: 6.1 },
  { month: "Mar", incidents: 4, ltifr: 0.61, severity: 9.2 },
  { month: "Abr", incidents: 1, ltifr: 0.38, severity: 4.0 },
] as const;

const reports = [
  { id: "1", type: "srt", period: "Marzo 2026",       generatedAt: "2026-04-01", generatedBy: "Carlos Aguirre" },
  { id: "2", type: "executive", period: "Marzo 2026", generatedAt: "2026-04-01", generatedBy: "Carlos Aguirre" },
  { id: "3", type: "srt", period: "Febrero 2026",     generatedAt: "2026-03-01", generatedBy: "Carlos Aguirre" },
  { id: "4", type: "executive", period: "Febrero 2026", generatedAt: "2026-03-01", generatedBy: "Carlos Aguirre" },
] as const;

export default function ReportesPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-mono text-artico/50 uppercase tracking-[0.2em]">
            Minera360 → SafetyOps → Reportes
          </p>
          <h1 className="mt-2 font-heading italic text-4xl text-artico tracking-tight">Reportes ejecutivos y SRT</h1>
          <p className="mt-1 text-sm text-artico/60">KPIs auditables: LTIFR, TRIFR, severity rate y reporte SRT mensual.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline"><Calendar className="h-4 w-4" /> Período</Button>
          <Button><FileText className="h-4 w-4" /> Generar reporte SRT</Button>
        </div>
      </header>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="LTIFR (12m)" value="0.42" tint="ok" />
        <StatCard label="TRIFR (12m)" value="1.28" tint="ok" />
        <StatCard label="Severity Rate" value="8.4" />
        <StatCard label="Días sin accidentes" value="127" tint="ok" />
      </section>

      <section>
        <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-artico/50 mb-3">Tendencia trimestral</h2>
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-4 gap-4">
              {monthlyKpis.map((m) => {
                const trend = monthlyKpis[monthlyKpis.indexOf(m) - 1];
                const better = trend ? m.ltifr < trend.ltifr : null;
                return (
                  <div key={m.month} className="text-center">
                    <div className="text-xs font-mono text-artico/50 uppercase tracking-wider mb-2">{m.month}</div>
                    <div className="font-heading italic text-3xl text-artico leading-none">{m.ltifr.toFixed(2)}</div>
                    <div className="mt-1 text-[10px] font-mono text-artico/40">LTIFR</div>
                    {better !== null && (
                      <div className={`mt-2 text-xs flex items-center justify-center gap-1 ${better ? "text-ok" : "text-alerta"}`}>
                        {better ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                        <span>{better ? "Mejora" : "Suba"}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-artico/50 mb-3">Históricos generados</h2>
        <Card>
          <CardContent className="p-0">
            <ul className="divide-y divide-niebla">
              {reports.map((r) => (
                <li key={r.id} className="flex items-center gap-4 p-5 hover:bg-acero/30 transition-colors">
                  <div className="w-11 h-11 rounded-xl bg-acero flex items-center justify-center text-naranja shrink-0">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base text-artico font-body font-medium">
                      {r.type === "srt" ? "Reporte SRT" : "Resumen ejecutivo"} · {r.period}
                    </h3>
                    <p className="mt-1 text-xs font-mono text-artico/50">
                      Generado {r.generatedAt} por {r.generatedBy}
                    </p>
                  </div>
                  <Button variant="outline" size="sm"><Download className="h-3 w-3" /> PDF</Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
