"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Megaphone, Newspaper, Heart, BarChart3, Calendar, Shield, ArrowLeft, Send, AlertCircle } from "lucide-react";
import { Badge, Button, Card, CardContent, Input, Textarea } from "@latitud360/ui";

type PostType = "announcement" | "news" | "recognition" | "poll" | "event" | "policy";
type Audience = "all" | "site" | "area" | "role" | "custom";

const TYPE_OPTIONS: { value: PostType; label: string; description: string; icon: typeof Megaphone; tint: string }[] = [
  { value: "announcement", label: "Comunicado oficial", description: "Información formal de la organización", icon: Megaphone, tint: "text-naranja" },
  { value: "news",         label: "Novedad",            description: "Noticia interna o actualización",       icon: Newspaper, tint: "text-turquesa" },
  { value: "policy",       label: "Política",           description: "Cambio de norma o procedimiento",       icon: Shield,    tint: "text-dorado" },
  { value: "event",        label: "Evento",             description: "Convocatoria, reunión, capacitación",   icon: Calendar,  tint: "text-naranja" },
  { value: "poll",         label: "Encuesta pulso",     description: "1 pregunta para medir clima",          icon: BarChart3, tint: "text-turquesa" },
  { value: "recognition",  label: "Reconocimiento",     description: "Destacar un valor o equipo",            icon: Heart,     tint: "text-turquesa" },
];

const AUDIENCE_OPTIONS: { value: Audience; label: string; description: string }[] = [
  { value: "all",    label: "Toda la organización",    description: "Llega a cada empleado activo" },
  { value: "site",   label: "Por sitio",                description: "Solo personal del sitio elegido" },
  { value: "area",   label: "Por área",                 description: "Solo personal del área elegida" },
  { value: "role",   label: "Por rol",                  description: "Operarios, supervisores, managers..." },
  { value: "custom", label: "Personas específicas",     description: "Lista manual de destinatarios" },
];

export default function NewPostPage() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [type, setType] = useState<PostType>("announcement");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [audience, setAudience] = useState<Audience>("all");
  const [requiresAck, setRequiresAck] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [scheduledDate, setScheduledDate] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (content.trim().length < 1) {
      setError("El cuerpo no puede estar vacío");
      return;
    }
    startTransition(async () => {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          title: title.trim() || undefined,
          content: content.trim(),
          mediaUrls: [],
          audience,
          requiresAck,
          pinned,
          publishedAt: scheduledDate ? new Date(scheduledDate).toISOString() : undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Error al publicar");
        return;
      }
      router.push("/dashboard/contacto");
      router.refresh();
    });
  };

  const selectedType = TYPE_OPTIONS.find((t) => t.value === type)!;

  return (
    <div className="space-y-6 max-w-3xl">
      <header className="flex items-start gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" /> Volver
        </Button>
        <div>
          <p className="text-xs font-mono text-artico/50 uppercase tracking-[0.2em]">
            Contacto → Nueva publicación
          </p>
          <h1 className="mt-1 font-heading italic text-4xl text-artico tracking-tight">Crear publicación</h1>
        </div>
      </header>

      <form onSubmit={onSubmit} className="space-y-6">
        <section>
          <label className="text-xs font-mono uppercase tracking-[0.2em] text-artico/50 mb-3 block">
            Tipo de publicación
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {TYPE_OPTIONS.map(({ value, label, description, icon: Icon, tint }) => (
              <button
                key={value}
                type="button"
                onClick={() => setType(value)}
                className={`text-left rounded-2xl border p-4 transition-all ${
                  type === value
                    ? "bg-acero border-naranja"
                    : "bg-mina border-niebla hover:bg-acero/40"
                }`}
              >
                <Icon className={`h-5 w-5 ${tint}`} />
                <h3 className="mt-3 text-sm font-body text-artico">{label}</h3>
                <p className="mt-0.5 text-xs text-artico/50">{description}</p>
              </button>
            ))}
          </div>
        </section>

        <section>
          <label className="text-xs font-mono uppercase tracking-[0.2em] text-artico/50 mb-2 block" htmlFor="title">
            Título (opcional)
          </label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={`Ej. ${selectedType.label} sobre nueva política de turnos`}
            maxLength={200}
          />
        </section>

        <section>
          <label className="text-xs font-mono uppercase tracking-[0.2em] text-artico/50 mb-2 block" htmlFor="content">
            Cuerpo
          </label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escribí el contenido en español argentino, claro y directo. Sin tecnicismos innecesarios."
            rows={8}
            maxLength={10000}
            required
          />
          <p className="mt-1 text-xs font-mono text-artico/40 text-right">{content.length}/10000</p>
        </section>

        <section>
          <label className="text-xs font-mono uppercase tracking-[0.2em] text-artico/50 mb-3 block">
            Audiencia
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {AUDIENCE_OPTIONS.map(({ value, label, description }) => (
              <button
                key={value}
                type="button"
                onClick={() => setAudience(value)}
                className={`text-left rounded-xl border p-3 transition-all ${
                  audience === value
                    ? "bg-acero border-turquesa"
                    : "bg-mina border-niebla hover:bg-acero/40"
                }`}
              >
                <h3 className="text-sm font-body text-artico">{label}</h3>
                <p className="mt-0.5 text-xs text-artico/50">{description}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={requiresAck}
                  onChange={(e) => setRequiresAck(e.target.checked)}
                  className="mt-1 accent-naranja"
                />
                <div>
                  <h3 className="text-sm font-body text-artico">Requiere lectura confirmada</h3>
                  <p className="mt-0.5 text-xs text-artico/50">
                    Los destinatarios deberán confirmar explícitamente que lo leyeron.
                  </p>
                </div>
              </label>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pinned}
                  onChange={(e) => setPinned(e.target.checked)}
                  className="mt-1 accent-naranja"
                />
                <div>
                  <h3 className="text-sm font-body text-artico">Fijar arriba del feed</h3>
                  <p className="mt-0.5 text-xs text-artico/50">
                    Aparece arriba aunque haya posts más recientes.
                  </p>
                </div>
              </label>
            </CardContent>
          </Card>
        </section>

        <section>
          <label className="text-xs font-mono uppercase tracking-[0.2em] text-artico/50 mb-2 block" htmlFor="scheduled">
            Programar publicación (opcional)
          </label>
          <Input
            id="scheduled"
            type="datetime-local"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
          />
          <p className="mt-1 text-xs text-artico/50">Si lo dejás vacío, se publica al enviar.</p>
        </section>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-alerta/10 border border-alerta/30 text-alerta text-sm">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-niebla">
          <Badge>{TYPE_OPTIONS.find((t) => t.value === type)?.label}</Badge>
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={pending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={pending}>
              <Send className="h-4 w-4" />
              {pending ? "Publicando..." : scheduledDate ? "Programar" : "Publicar ahora"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
