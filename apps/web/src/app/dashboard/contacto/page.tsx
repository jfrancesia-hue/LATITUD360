import Link from "next/link";
import { Heart, ThumbsUp, MessageCircle, Sparkles, Pin } from "lucide-react";
import { Avatar, Card, CardContent, Badge, Button } from "@latitud360/ui";
import { formatRelativeAR, DEFAULT_VALUES } from "@latitud360/shared";

const posts = [
  {
    id: "1", type: "announcement",
    author: { name: "Jorge Eduardo Francesia", role: "Founder & CEO" },
    title: "127 días sin accidentes con tiempo perdido",
    content:
      "Equipo: hoy alcanzamos 127 días consecutivos sin accidentes con tiempo perdido en Mina Hombre Muerto. Es un récord histórico para la operación. Quiero agradecer a cada uno de ustedes por hacer de la seguridad una decisión diaria. Carlos y Roberto, especialmente: el liderazgo en HSE se nota.",
    publishedAt: new Date("2026-04-27T10:00:00Z"),
    pinned: true, requiresAck: true,
    stats: { reads: 423, ackPct: 87, reactions: 56 },
  },
  {
    id: "2", type: "recognition",
    author: { name: "Carlos Mendoza", role: "HSE Manager" },
    recognition: {
      to: "Roberto Méndez",
      value: DEFAULT_VALUES[0]!,
      message: "Roberto detectó la fisura de la pasarela antes de que pasara algo grave. Atento, profesional, dueño del cambio. Gracias.",
    },
    publishedAt: new Date("2026-04-26T16:30:00Z"),
  },
  {
    id: "3", type: "birthday",
    author: { name: "Sistema" },
    birthday: { name: "Mariana Salas", years: 5, type: "anniversary" as const },
    publishedAt: new Date("2026-04-29T08:00:00Z"),
  },
] as const;

export default function ContactoFeedPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
      {/* Feed central */}
      <div className="space-y-5 max-w-2xl mx-auto w-full">
        <header>
          <p className="text-xs font-mono text-artico/50 uppercase tracking-[0.2em]">
            Contacto → Feed
          </p>
          <h1 className="mt-2 font-heading italic text-4xl text-artico tracking-tight">
            Lo que pasa hoy
          </h1>
        </header>

        {/* Composer */}
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Avatar name="Jorge Eduardo Francesia" size={40} />
            <Link href="/dashboard/contacto/nuevo"
                  className="flex-1 px-4 py-2.5 rounded-pill bg-mina border border-niebla text-artico/50 text-sm hover:border-artico/30">
              ¿Qué querés compartir, Jorge?
            </Link>
          </CardContent>
        </Card>

        {/* Posts */}
        {posts.map((post) => (
          <Card key={post.id} className={post.pinned ? "ring-1 ring-naranja/30" : undefined}>
            <CardContent className="p-5">
              {/* Header */}
              <div className="flex items-start gap-3">
                <Avatar name={post.author.name} size={42} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-artico">{post.author.name}</span>
                    {post.author.role && <span className="text-xs text-artico/50">· {post.author.role}</span>}
                    {post.type === "announcement" && <Badge variant="naranja">Oficial</Badge>}
                    {post.pinned && <Pin className="h-3 w-3 text-naranja" />}
                  </div>
                  <span className="text-xs font-mono text-artico/40">{formatRelativeAR(post.publishedAt)}</span>
                </div>
              </div>

              {/* Body */}
              {post.title && (
                <h3 className="mt-4 font-heading italic text-2xl text-artico leading-snug">{post.title}</h3>
              )}

              {post.type === "recognition" && post.recognition && (
                <div className="mt-4 rounded-xl bg-turquesa/[0.06] border border-turquesa/20 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{post.recognition.value.icon}</span>
                    <div>
                      <p className="text-xs font-mono uppercase tracking-wider text-turquesa">Reconocimiento</p>
                      <p className="font-medium text-artico">{post.recognition.value.label}</p>
                    </div>
                  </div>
                  <p className="text-sm text-artico/85 leading-relaxed">
                    Para <strong className="text-artico">{post.recognition.to}</strong>: {post.recognition.message}
                  </p>
                </div>
              )}

              {post.type === "birthday" && post.birthday && (
                <div className="mt-4 rounded-xl bg-dorado/[0.06] border border-dorado/20 p-5 flex items-center gap-4">
                  <span className="text-4xl">🎉</span>
                  <div className="flex-1">
                    <p className="font-medium text-artico">
                      Hoy cumple {post.birthday.years} años en la empresa: {post.birthday.name}
                    </p>
                    <p className="text-xs text-artico/60 mt-1">Mandale un saludo desde acá.</p>
                  </div>
                  <Button variant="outline" size="sm">Saludar</Button>
                </div>
              )}

              {post.content && (
                <p className="mt-4 text-sm text-artico/85 leading-relaxed whitespace-pre-line">
                  {post.content}
                </p>
              )}

              {/* Footer */}
              {post.stats && (
                <div className="mt-5 pt-4 border-t border-niebla flex items-center justify-between text-xs font-mono text-artico/50">
                  <span>{post.stats.reads} leyeron · {post.stats.ackPct}% confirmaron lectura</span>
                  {post.requiresAck && <Button size="sm" variant="ghost" className="text-naranja">Confirmar lectura</Button>}
                </div>
              )}

              <div className="mt-3 flex items-center gap-1 text-artico/60">
                <Button variant="ghost" size="sm"><ThumbsUp className="h-4 w-4" /> 12</Button>
                <Button variant="ghost" size="sm"><Heart className="h-4 w-4" /> 8</Button>
                <Button variant="ghost" size="sm"><Sparkles className="h-4 w-4" /> 3</Button>
                <Button variant="ghost" size="sm"><MessageCircle className="h-4 w-4" /> Comentar</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sidebar derecha */}
      <aside className="space-y-4 hidden lg:block">
        <Card>
          <CardContent className="p-5">
            <h3 className="font-mono text-xs uppercase tracking-wider text-artico/60 mb-4">Cumpleaños hoy</h3>
            <div className="flex items-center gap-3">
              <Avatar name="Mariana Salas" size={40} />
              <div className="text-sm">
                <p className="text-artico">Mariana Salas</p>
                <p className="text-xs text-artico/50">5 años en la empresa</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <h3 className="font-mono text-xs uppercase tracking-wider text-artico/60 mb-3">Tu turno</h3>
            <p className="text-sm text-artico">Mañana a las 06:00</p>
            <p className="text-xs text-artico/50 mt-1 font-mono">Turno mañana · Sitio Hombre Muerto</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <h3 className="font-mono text-xs uppercase tracking-wider text-artico/60 mb-3">Te están reconociendo</h3>
            <p className="text-sm text-artico/80">Carlos te reconoció por <strong>Seguridad ante todo</strong></p>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
