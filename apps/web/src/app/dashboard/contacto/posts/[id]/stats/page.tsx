import Link from "next/link";
import { ArrowLeft, Eye, CheckCircle2, Heart, MessageSquare, ThumbsUp, Lightbulb, Hand } from "lucide-react";
import { Badge, Button, Card, CardContent, StatCard } from "@latitud360/ui";

const REACTION_ICONS = {
  like: { icon: ThumbsUp, label: "Me gusta",  tint: "text-turquesa" },
  applause: { icon: Hand, label: "Aplausos", tint: "text-dorado" },
  heart: { icon: Heart, label: "Corazón",   tint: "text-alerta" },
  idea: { icon: Lightbulb, label: "Idea",   tint: "text-naranja" },
} as const;

const post = {
  id: "demo",
  title: "Nueva política de turnos rotativos 7×7 a partir de junio",
  type: "announcement",
  audience: "all",
  requiresAck: true,
  publishedAt: "2026-04-26T08:00:00Z",
  author: "Carlos Aguirre",
};

const stats = {
  audienceSize: 247,
  reads: 218,
  readRate: 88.3,
  acknowledged: 196,
  ackRate: 89.9,
  reactions: {
    total: 87,
    byType: [
      { type: "like" as const,     count: 54 },
      { type: "applause" as const, count: 19 },
      { type: "heart" as const,    count: 9 },
      { type: "idea" as const,     count: 5 },
    ],
  },
  comments: 31,
};

const readers = [
  { id: "1", fullName: "Roberto Méndez",     readAt: "2026-04-26 08:14", acknowledged: true },
  { id: "2", fullName: "Mariana Salas",      readAt: "2026-04-26 08:22", acknowledged: true },
  { id: "3", fullName: "Juan Carlos Quispe", readAt: "2026-04-26 09:04", acknowledged: true },
  { id: "4", fullName: "Ana Castro",         readAt: "2026-04-27 06:50", acknowledged: false },
  { id: "5", fullName: "Diego Ramírez",      readAt: null,                acknowledged: false },
] as const;

export default function PostStatsPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6 max-w-5xl">
      <header className="flex items-start gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard/contacto">
            <ArrowLeft className="h-4 w-4" /> Feed
          </Link>
        </Button>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-mono text-artico/50 uppercase tracking-[0.2em]">
            Contacto → Publicación → Estadísticas
          </p>
          <h1 className="mt-1 font-heading italic text-3xl text-artico tracking-tight leading-tight">
            {post.title}
          </h1>
          <div className="mt-2 flex items-center gap-2 flex-wrap text-xs">
            <Badge>Comunicado oficial</Badge>
            {post.requiresAck && <Badge variant="warn">Requiere confirmación</Badge>}
            <span className="font-mono text-artico/50">
              Publicado por {post.author} · {new Date(post.publishedAt).toLocaleString("es-AR")}
            </span>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Audiencia" value={String(stats.audienceSize)} />
        <StatCard label="Lectura" value={`${stats.readRate}%`} tint="ok" />
        <StatCard label="Confirmaron" value={`${stats.ackRate}%`} tint="ok" />
        <StatCard label="Comentarios" value={String(stats.comments)} />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card>
          <CardContent className="p-5">
            <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-artico/50 mb-4">
              Reacciones · {stats.reactions.total}
            </h2>
            <ul className="space-y-3">
              {stats.reactions.byType.map(({ type, count }) => {
                const meta = REACTION_ICONS[type];
                const Icon = meta.icon;
                const pct = (100 * count) / stats.reactions.total;
                return (
                  <li key={type}>
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className={`h-4 w-4 ${meta.tint}`} />
                      <span className="text-sm text-artico/85 flex-1">{meta.label}</span>
                      <span className="font-mono text-xs text-artico/50">{count}</span>
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

        <Card className="lg:col-span-2">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-artico/50">
                Lectura por persona
              </h2>
              <span className="text-xs font-mono text-artico/50">
                {stats.reads} de {stats.audienceSize} leyeron
              </span>
            </div>
            <ul className="divide-y divide-niebla">
              {readers.map((r) => (
                <li key={r.id} className="flex items-center gap-3 py-3">
                  {r.readAt ? (
                    <Eye className="h-4 w-4 text-ok" />
                  ) : (
                    <Eye className="h-4 w-4 text-artico/30" />
                  )}
                  <span className="text-sm text-artico/85 flex-1">{r.fullName}</span>
                  {r.acknowledged && <CheckCircle2 className="h-4 w-4 text-ok" />}
                  <span className="font-mono text-xs text-artico/50 w-40 text-right">
                    {r.readAt ?? "Sin leer"}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardContent className="p-5 flex items-center gap-3 text-xs font-mono text-artico/50">
            <MessageSquare className="h-4 w-4" />
            <span>ID: {params.id}</span>
            <span>·</span>
            <span>API: GET /api/communication-stats/post/{params.id}</span>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
