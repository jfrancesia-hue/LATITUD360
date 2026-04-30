import Link from "next/link";
import { ArrowLeft, ClipboardCheck, Calendar, MapPin, User, CheckCircle2, XCircle, Camera, AlertTriangle } from "lucide-react";
import { Avatar, Badge, Button, Card, CardContent, SeverityBadge } from "@latitud360/ui";

const inspection = {
  id: "demo",
  type: "safety_walk",
  site: "Mina Hombre Muerto",
  scheduledFor: "2026-04-29T08:00:00",
  completedAt: "2026-04-29T11:30:00",
  inspector: { fullName: "Carlos Aguirre", jobTitle: "HSE Manager" },
  score: 92.3,
};

const items = [
  { id: "i1",  question: "¿Pasarelas con barandas en buen estado?", type: "yes_no",         answer: true,  notes: null,                          riskLevel: "high" },
  { id: "i2",  question: "¿Señalización visible en accesos peatonales?", type: "yes_no",     answer: true,  notes: null,                          riskLevel: "medium" },
  { id: "i3",  question: "¿Extintores en su soporte y vigentes?", type: "yes_no",            answer: false, notes: "Extintor fuera de soporte cerca planta 2", riskLevel: "high" },
  { id: "i4",  question: "Estado general del orden y limpieza (1 a 5)", type: "scale",       answer: 4,     notes: null,                          riskLevel: "low" },
  { id: "i5",  question: "¿Iluminación adecuada en pasillos?", type: "yes_no",               answer: true,  notes: null,                          riskLevel: "medium" },
  { id: "i6",  question: "¿Salidas de emergencia despejadas?", type: "yes_no",               answer: true,  notes: null,                          riskLevel: "high" },
  { id: "i7",  question: "Foto general del sector inspeccionado",        type: "photo",      photo: "https://placehold.co/400x300/0a0a0a/666?text=Foto+sector+norte" },
  { id: "i8",  question: "¿Equipos de protección colectiva señalizados?", type: "yes_no",   answer: true, notes: null, riskLevel: "medium" },
  { id: "i9",  question: "Observaciones generales", type: "free_text", answer: "Sector general OK. Único hallazgo en planta 2." },
] as const;

const findings = [
  {
    id: "f1",
    description: "[¿Extintores en su soporte y vigentes?] Extintor fuera de soporte cerca planta 2",
    severity: "high" as const,
    status: "open",
    dueDate: "2026-05-02",
    photo: "https://placehold.co/200x150/0a0a0a/666?text=Extintor",
  },
] as const;

export default function InspectionDetailPage({ params }: { params: { id: string } }) {
  const yesItems = items.filter((i) => i.type === "yes_no" && i.answer === true).length;
  const totalYesNo = items.filter((i) => i.type === "yes_no").length;

  return (
    <div className="space-y-6 max-w-5xl">
      <header className="flex items-start gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard/minera360/inspecciones">
            <ArrowLeft className="h-4 w-4" /> Inspecciones
          </Link>
        </Button>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-mono text-artico/50 uppercase tracking-[0.2em]">
            Minera360 → SafetyOps → Inspección {params.id}
          </p>
          <h1 className="mt-1 font-heading italic text-3xl text-artico tracking-tight leading-tight">
            Recorrida de seguridad — {inspection.site}
          </h1>
          <div className="mt-2 flex items-center gap-2 flex-wrap text-xs">
            <Badge variant="ok">Completada</Badge>
            <span className="font-mono text-artico/50">
              <Calendar className="inline h-3 w-3" /> {new Date(inspection.completedAt).toLocaleString("es-AR")}
            </span>
            <span className="font-mono text-artico/50">
              <MapPin className="inline h-3 w-3" /> {inspection.site}
            </span>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="md:col-span-1">
          <CardContent className="p-8 text-center">
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-artico/50">Score</p>
            <div className="mt-2 font-heading italic text-7xl text-ok leading-none">
              {inspection.score.toFixed(0)}
              <span className="text-3xl text-artico/50">%</span>
            </div>
            <p className="mt-3 text-xs font-mono text-artico/50">
              {yesItems} de {totalYesNo} OK
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-artico/50 mb-4">Inspector</h2>
            <div className="flex items-center gap-3">
              <Avatar fallback={inspection.inspector.fullName} />
              <div>
                <p className="text-sm font-body text-artico">{inspection.inspector.fullName}</p>
                <p className="text-xs font-mono text-artico/50">{inspection.inspector.jobTitle}</p>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-artico/40">Programada</p>
                <p className="mt-1 text-artico/85">{new Date(inspection.scheduledFor).toLocaleString("es-AR")}</p>
              </div>
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-artico/40">Tipo</p>
                <p className="mt-1 text-artico/85">Recorrida de seguridad</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-artico/50 mb-3">
          Respuestas del checklist
        </h2>
        <Card>
          <CardContent className="p-0">
            <ul className="divide-y divide-niebla">
              {items.map((item, i) => (
                <li key={item.id} className="flex items-start gap-4 p-4">
                  <div className="w-8 h-8 rounded-lg bg-acero flex items-center justify-center font-mono text-xs text-artico/50 shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-artico/85">{item.question}</p>

                    {item.type === "yes_no" && "answer" in item && (
                      <p className="mt-2 flex items-center gap-2 text-xs font-mono">
                        {item.answer === true ? (
                          <span className="text-ok flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Sí
                          </span>
                        ) : (
                          <span className="text-alerta flex items-center gap-1">
                            <XCircle className="h-3 w-3" /> No
                          </span>
                        )}
                        {item.notes && <span className="text-artico/50">— {item.notes}</span>}
                      </p>
                    )}

                    {item.type === "scale" && "answer" in item && (
                      <p className="mt-2 text-xs font-mono">
                        <span className="text-artico/85">Puntaje: {String(item.answer)}/5</span>
                      </p>
                    )}

                    {item.type === "free_text" && "answer" in item && (
                      <p className="mt-2 text-xs text-artico/60 italic">"{String(item.answer)}"</p>
                    )}

                    {item.type === "photo" && "photo" in item && (
                      <div className="mt-2 flex items-center gap-2 text-xs font-mono text-artico/50">
                        <Camera className="h-3 w-3" /> Foto adjunta
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-artico/50 mb-3 flex items-center gap-2">
          <AlertTriangle className="h-3 w-3" /> Findings auto-generados
        </h2>
        <Card>
          <CardContent className="p-0">
            <ul className="divide-y divide-niebla">
              {findings.map((f) => (
                <li key={f.id} className="flex items-start gap-4 p-5">
                  <SeverityBadge severity={f.severity} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-artico/85">{f.description}</p>
                    <p className="mt-1 text-xs font-mono text-artico/50 flex items-center gap-2">
                      <Calendar className="h-3 w-3" /> Vence {f.dueDate}
                    </p>
                  </div>
                  <Badge variant="warn">{f.status === "open" ? "Abierto" : "Cerrado"}</Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
