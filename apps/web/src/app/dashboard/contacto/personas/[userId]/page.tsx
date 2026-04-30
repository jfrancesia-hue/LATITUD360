import Link from "next/link";
import { ArrowLeft, Heart, MessageSquare, Award, Briefcase, Mail, Cake, Calendar } from "lucide-react";
import { Avatar, Badge, Button, Card, CardContent, StatCard } from "@latitud360/ui";

const profile = {
  id: "demo",
  fullName: "Roberto Méndez",
  jobTitle: "Supervisor turno mañana",
  email: "roberto.mendez@nativos.la",
  role: "supervisor",
  hireDate: "2021-04-15",
  birthDate: "1987-08-22",
  avatarUrl: null,
  yearsAtCompany: 5,
};

const stats = {
  recognitionsReceived: 14,
  recognitionsGiven: 9,
  postsAuthored: 3,
};

const recentRecognitions = [
  { id: "1", from: "Carlos Aguirre", value: "Seguridad ante todo",
    message: "Anticipaste el riesgo de la cinta y la frenaste antes que pasara algo. Ese reflejo nos salva siempre.",
    daysAgo: 1 },
  { id: "2", from: "Mariana Salas", value: "Trabajo en equipo",
    message: "Cuando faltó el reemplazo en el turno noche, te quedaste 4 horas extra sin que nadie te lo pidiera.",
    daysAgo: 8 },
  { id: "3", from: "Juan Carlos Quispe", value: "Excelencia operativa",
    message: "Tu plan de mantenimiento bajó el downtime 30% en el sector de planta.",
    daysAgo: 14 },
] as const;

export default function PersonProfilePage({ params }: { params: { userId: string } }) {
  return (
    <div className="space-y-6 max-w-5xl">
      <header>
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard/contacto/personas">
            <ArrowLeft className="h-4 w-4" /> Personas
          </Link>
        </Button>
      </header>

      <Card>
        <CardContent className="p-8">
          <div className="flex items-start gap-6">
            <Avatar fallback={profile.fullName} size="lg" className="!w-24 !h-24 !text-3xl" />
            <div className="flex-1 min-w-0">
              <h1 className="font-heading italic text-4xl text-artico tracking-tight">
                {profile.fullName}
              </h1>
              <p className="mt-1 text-base text-artico/70 flex items-center gap-2">
                <Briefcase className="h-4 w-4" /> {profile.jobTitle}
              </p>
              <div className="mt-3 flex items-center gap-2 flex-wrap text-xs font-mono text-artico/50">
                <Mail className="h-3 w-3" /> {profile.email}
                <span>·</span>
                <Calendar className="h-3 w-3" />
                <span>Ingreso {profile.hireDate} · {profile.yearsAtCompany} año{profile.yearsAtCompany === 1 ? "" : "s"}</span>
                <span>·</span>
                <Cake className="h-3 w-3" /> {profile.birthDate}
              </div>
            </div>
            <Button>
              <Heart className="h-4 w-4" /> Reconocer
            </Button>
          </div>
        </CardContent>
      </Card>

      <section className="grid grid-cols-3 gap-4">
        <StatCard label="Reconocimientos recibidos" value={String(stats.recognitionsReceived)} tint="ok" />
        <StatCard label="Reconocimientos dados" value={String(stats.recognitionsGiven)} />
        <StatCard label="Publicaciones" value={String(stats.postsAuthored)} />
      </section>

      <section>
        <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-artico/50 mb-3">
          Reconocimientos recientes
        </h2>
        <Card>
          <CardContent className="p-0">
            <ul className="divide-y divide-niebla">
              {recentRecognitions.map((r) => (
                <li key={r.id} className="p-5">
                  <div className="flex items-center gap-3">
                    <Avatar fallback={r.from} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-artico/85">
                        <strong>{r.from}</strong> reconoció su {" "}
                        <Badge variant="ok"><Award className="h-3 w-3" /> {r.value}</Badge>
                      </p>
                    </div>
                    <span className="text-xs font-mono text-artico/40">hace {r.daysAgo}d</span>
                  </div>
                  <p className="mt-3 pl-11 text-sm text-artico/85 leading-relaxed">"{r.message}"</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardContent className="p-5 text-xs font-mono text-artico/50 flex items-center gap-3">
            <MessageSquare className="h-4 w-4" />
            <span>userId: {params.userId}</span>
            <span>·</span>
            <span>API: GET /api/profiles/directory · perfil consume getPublic()</span>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
