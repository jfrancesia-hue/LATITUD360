"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Textarea, cn } from "@latitud360/ui";
import { INCIDENT_TYPE_LABELS, SEVERITY_META, incidentCreateSchema } from "@latitud360/shared";

const SEVERITIES = ["low", "medium", "high", "critical"] as const;
const TYPES = Object.keys(INCIDENT_TYPE_LABELS) as (keyof typeof INCIDENT_TYPE_LABELS)[];

export default function NewIncidentPage() {
  const router = useRouter();
  const [type, setType] = useState<typeof TYPES[number]>("near_miss");
  const [severity, setSeverity] = useState<typeof SEVERITIES[number]>("medium");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const parsed = incidentCreateSchema.parse({
        siteId: "00000000-0000-0000-0000-000000000001", // TODO: del contexto
        type, severity, title, description,
        occurredAt: new Date(),
        involvedUserIds: [], photoUrls: [], videoUrls: [],
      });
      const res = await fetch("/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });
      if (!res.ok) throw new Error(await res.text());
      router.push("/dashboard/minera360/incidentes");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear el incidente");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="max-w-3xl mx-auto space-y-6">
      <header>
        <p className="text-xs font-mono text-artico/50 uppercase tracking-[0.2em]">
          Minera360 → SafetyOps → Reportar incidente
        </p>
        <h1 className="mt-2 font-heading italic text-4xl text-artico tracking-tight">
          ¿Qué pasó?
        </h1>
        <p className="mt-1 text-sm text-artico/60">
          Reportá ahora. Cuanto antes lo registremos, antes podemos prevenir que se repita.
        </p>
      </header>

      {/* Tipo */}
      <Card>
        <CardHeader>
          <CardTitle>1 · Tipo de incidente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {TYPES.map((t) => (
              <button key={t} type="button" onClick={() => setType(t)}
                className={cn(
                  "p-4 rounded-xl border text-left transition-all",
                  type === t ? "border-naranja bg-naranja/10 text-artico" : "border-niebla text-artico/70 hover:border-artico/30",
                )}>
                <div className="text-sm font-medium">{INCIDENT_TYPE_LABELS[t]}</div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Severidad */}
      <Card>
        <CardHeader>
          <CardTitle>2 · Severidad</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {SEVERITIES.map((s) => {
              const meta = SEVERITY_META[s];
              const active = severity === s;
              return (
                <button key={s} type="button" onClick={() => setSeverity(s)}
                  className={cn(
                    "p-5 rounded-xl border text-left transition-all flex flex-col gap-2",
                    active ? "border-current" : "border-niebla hover:border-artico/30",
                  )}
                  style={active ? { color: meta.color, background: `${meta.color}1A` } : {}}>
                  <span className="text-3xl">{meta.emoji}</span>
                  <span className="font-medium text-sm" style={active ? {} : { color: meta.color }}>{meta.label}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Título + descripción */}
      <Card>
        <CardHeader>
          <CardTitle>3 · Detalles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-xs font-mono uppercase tracking-wider text-artico/60 mb-2">
              Título corto
            </label>
            <Input id="title" required minLength={5} maxLength={200}
                   placeholder="Ej: Caída de roca cerca pasarela planta"
                   value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label htmlFor="desc" className="block text-xs font-mono uppercase tracking-wider text-artico/60 mb-2">
              Contá qué pasó
            </label>
            <Textarea id="desc" required minLength={10} maxLength={4000} rows={6}
                      placeholder="Describilo en tus palabras: dónde, cuándo, quiénes estaban, qué hiciste para mitigar…"
                      value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="rounded-xl bg-alerta/10 border border-alerta/30 p-4 text-alerta text-sm font-mono">
          {error}
        </div>
      )}

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Enviando…" : "Reportar ahora"}
        </Button>
      </div>
    </form>
  );
}
