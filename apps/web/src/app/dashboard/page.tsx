import Link from "next/link";
import { Mountain, Radio, Users, Sparkles, ArrowRight } from "lucide-react";
import { Card, CardContent, Badge, cn } from "@latitud360/ui";
import { formatRelativeAR } from "@latitud360/shared";

const productCards = [
  {
    title: "Minera360", subtitle: "Operaciones",
    Icon: Mountain, color: "naranja",
    href: "/dashboard/minera360",
    stats: [
      { label: "alertas HSE",         value: "2", tint: "text-alerta" },
      { label: "mantenimiento crítico", value: "1", tint: "text-warn" },
      { label: "partes hoy",          value: "12", tint: "text-artico" },
    ],
  },
  {
    title: "Contacto", subtitle: "Comunicación interna",
    Icon: Users, color: "turquesa",
    href: "/dashboard/contacto",
    stats: [
      { label: "publicaciones nuevas",      value: "3",  tint: "text-artico" },
      { label: "reconocimientos esta semana", value: "47", tint: "text-artico" },
      { label: "lectura de comunicados",    value: "92%", tint: "text-ok" },
    ],
  },
  {
    title: "Latitud", subtitle: "Medio sectorial",
    Icon: Radio, color: "dorado",
    href: "/dashboard/latitud",
    stats: [
      { label: "nota nueva sobre tu mina",  value: "1",     tint: "text-artico" },
      { label: "entrevista programada",     value: "1",     tint: "text-artico" },
      { label: "visitas este mes",          value: "12.4k", tint: "text-artico" },
    ],
  },
  {
    title: "Latitud Copilot", subtitle: "Inteligencia operativa",
    Icon: Sparkles, color: "gradient",
    href: "/dashboard/copilot",
    body: "Detecté 3 riesgos para mañana en faena. ¿Querés verlos?",
  },
];

const colorMap = {
  naranja:  "ring-naranja/30 hover:ring-naranja/60",
  turquesa: "ring-turquesa/30 hover:ring-turquesa/60",
  dorado:   "ring-dorado/30 hover:ring-dorado/60",
  gradient: "ring-naranja/30 hover:ring-naranja/60",
};
const iconColorMap = {
  naranja: "text-naranja", turquesa: "text-turquesa",
  dorado: "text-dorado", gradient: "text-naranja",
};

export default function DashboardHomePage() {
  const today = new Date();
  return (
    <div className="space-y-10">
      {/* Saludo */}
      <header>
        <h1 className="font-heading italic text-4xl md:text-5xl text-artico tracking-tight">
          Hola Jorge, esto pasó en tus operaciones hoy
        </h1>
        <p className="mt-2 text-xs font-mono text-artico/50 uppercase tracking-wider">
          {today.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          {" · "} actualizado {formatRelativeAR(new Date(today.getTime() - 1000 * 60 * 4))}
        </p>
      </header>

      {/* 4 product cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {productCards.map(({ title, subtitle, Icon, color, href, stats, body }) => (
          <Link key={title} href={href}>
            <Card className={cn(
              "h-full ring-1 transition-all hover:translate-y-[-1px]",
              colorMap[color as keyof typeof colorMap],
              color === "gradient" && "bg-gradient-to-br from-naranja/[0.08] via-acero to-turquesa/[0.08]",
            )}>
              <CardContent className="p-6 flex flex-col h-full min-h-[200px]">
                <div className="flex items-start justify-between">
                  <div className={cn("w-11 h-11 rounded-xl bg-niebla flex items-center justify-center", iconColorMap[color as keyof typeof iconColorMap])}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-artico/40" />
                </div>

                <h2 className="mt-5 font-heading italic text-3xl text-artico leading-none">{title}</h2>
                <p className="text-xs font-mono text-artico/50 uppercase tracking-wider mt-1">{subtitle}</p>

                {body && (
                  <p className="mt-5 text-sm font-body text-artico/85 leading-relaxed">
                    {body}
                  </p>
                )}

                {stats && (
                  <div className="mt-5 space-y-2 text-sm font-body">
                    {stats.map((s, i) => (
                      <div key={i} className="flex items-baseline gap-2">
                        <span className={cn("font-heading italic text-2xl leading-none", s.tint)}>{s.value}</span>
                        <span className="text-artico/60">{s.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>

      {/* Lo que pasa ahora */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-mono text-xs uppercase tracking-wider text-artico/60">Últimos incidentes</h3>
              <Link href="/dashboard/minera360/incidentes" className="text-xs text-naranja hover:underline">Ver todos →</Link>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm">
                <Badge variant="alerta">Alta</Badge>
                <span className="flex-1 text-artico/85 truncate">Caída de roca cerca pasarela planta</span>
                <span className="text-xs font-mono text-artico/40">hace 14 d</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Badge variant="warn">Media</Badge>
                <span className="flex-1 text-artico/85 truncate">Extintor vencido en taller</span>
                <span className="text-xs font-mono text-artico/40">hace 7 d</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-mono text-xs uppercase tracking-wider text-artico/60">Feed Contacto</h3>
              <Link href="/dashboard/contacto" className="text-xs text-turquesa hover:underline">Ver feed →</Link>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="text-artico/85">📌 127 días sin accidentes</li>
              <li className="text-artico/85">🏆 Carlos reconoció a Roberto</li>
              <li className="text-artico/85">🎂 Mañana cumple Mariana Salas</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-mono text-xs uppercase tracking-wider text-artico/60">Latitud headlines</h3>
              <Link href="/dashboard/latitud" className="text-xs text-dorado hover:underline">Portal →</Link>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="text-artico/85 truncate">El boom del litio en Catamarca y los 12 proyectos en pipeline</li>
              <li className="text-artico/85 truncate">Entrevista: ministro de minería sobre Xinchuang andino</li>
              <li className="text-artico/85 truncate">MARA + Agua Rica: USD 4.500M y un horizonte de 27 años</li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
