import { Search, Cake, Calendar } from "lucide-react";
import { Avatar, Badge, Card, CardContent, Input, StatCard } from "@latitud360/ui";

const directory = [
  { id: "1", fullName: "Carlos Aguirre",     jobTitle: "HSE Manager",                  role: "manager" },
  { id: "2", fullName: "Roberto Méndez",     jobTitle: "Supervisor turno mañana",      role: "supervisor" },
  { id: "3", fullName: "Mariana Salas",      jobTitle: "Coordinadora HSE",             role: "supervisor" },
  { id: "4", fullName: "Juan Carlos Quispe", jobTitle: "Operario chofer CAT 793",      role: "operator" },
  { id: "5", fullName: "Ana Castro",         jobTitle: "Operadora planta procesamiento", role: "operator" },
  { id: "6", fullName: "Diego Ramírez",      jobTitle: "Mecánico mantenimiento",       role: "operator" },
  { id: "7", fullName: "Lucía Fernández",    jobTitle: "Analista ambiental",           role: "manager" },
  { id: "8", fullName: "Sergio Acuña",       jobTitle: "Supervisor turno noche",       role: "supervisor" },
] as const;

const birthdaysToday = [
  { id: "5", fullName: "Ana Castro" },
] as const;

const anniversaries = [
  { id: "2", fullName: "Roberto Méndez", years: 5 },
  { id: "1", fullName: "Carlos Aguirre", years: 8 },
] as const;

const ROLE_LABELS: Record<string, { label: string; tint: "alerta" | "warn" | "ok" | undefined }> = {
  manager: { label: "Gerencial", tint: "warn" },
  supervisor: { label: "Supervisor", tint: undefined },
  operator: { label: "Operario", tint: undefined },
};

export default function PeoplePage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-mono text-artico/50 uppercase tracking-[0.2em]">
          Contacto → Personas
        </p>
        <h1 className="mt-2 font-heading italic text-4xl text-artico tracking-tight">Personas</h1>
        <p className="mt-1 text-sm text-artico/60">Directorio interno · cumpleaños · aniversarios laborales.</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Activos" value="8" />
        <StatCard label="Cumpleaños hoy" value={String(birthdaysToday.length)} tint="ok" />
        <StatCard label="Aniversarios esta semana" value={String(anniversaries.length)} />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card>
          <CardContent className="p-5">
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-artico/50 mb-4 flex items-center gap-2">
              <Cake className="h-3 w-3" /> Cumpleaños hoy
            </h3>
            {birthdaysToday.length === 0 ? (
              <p className="text-sm text-artico/50">Ningún cumpleaños hoy.</p>
            ) : (
              <ul className="space-y-3">
                {birthdaysToday.map((u) => (
                  <li key={u.id} className="flex items-center gap-3">
                    <Avatar fallback={u.fullName} size="sm" />
                    <span className="text-sm text-artico">{u.fullName}</span>
                    <button type="button" className="ml-auto text-xs text-turquesa hover:underline">
                      Saludar →
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardContent className="p-5">
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-artico/50 mb-4 flex items-center gap-2">
              <Calendar className="h-3 w-3" /> Aniversarios laborales esta semana
            </h3>
            <ul className="space-y-3">
              {anniversaries.map((u) => (
                <li key={u.id} className="flex items-center gap-3">
                  <Avatar fallback={u.fullName} size="sm" />
                  <span className="text-sm text-artico">{u.fullName}</span>
                  <Badge variant="ok">{u.years} año{u.years === 1 ? "" : "s"}</Badge>
                  <button type="button" className="ml-auto text-xs text-turquesa hover:underline">
                    Felicitar →
                  </button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-artico/50">Directorio</h2>
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-artico/40" />
            <Input placeholder="Buscar persona, área, rol..." className="pl-9 w-72" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {directory.map((u) => {
            const role = ROLE_LABELS[u.role];
            return (
              <Card key={u.id} className="hover:translate-y-[-1px] transition-transform cursor-pointer">
                <CardContent className="p-5 flex items-center gap-4">
                  <Avatar fallback={u.fullName} size="lg" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-body text-artico truncate">{u.fullName}</h3>
                    <p className="mt-0.5 text-xs font-mono text-artico/50 truncate">{u.jobTitle}</p>
                    <Badge variant={role.tint} className="mt-2">{role.label}</Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
