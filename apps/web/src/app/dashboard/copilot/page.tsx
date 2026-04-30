"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Mic, ShieldAlert, ArrowRight } from "lucide-react";
import { Button, Card, CardContent, Input, cn } from "@latitud360/ui";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "¿Qué riesgos tengo mañana en faena?",
  "Resumime el mes en seguridad",
  "¿Cómo está el clima organizacional?",
  "Listame permisos críticos para hoy",
];

export default function CopilotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hola Jorge, soy Latitud Copilot. Tengo acceso en vivo a tus datos de Minera360, Contacto y Latitud. Preguntame lo que necesites: predicción de riesgos, KPIs operativos, clima del equipo, datos del sector. Pensar en español argentino, no en gringlés corporativo.",
    },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || streaming) return;
    const next: Message[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setStreaming(true);

    try {
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      if (!res.ok || !res.body) throw new Error("Copilot no disponible");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      setMessages((m) => [...m, { role: "assistant", content: "" }]);
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }
    } catch (e) {
      setMessages((m) => [...m, {
        role: "assistant",
        content: "No pude conectarme al backend. Verificá que ANTHROPIC_API_KEY esté configurada en apps/api o usá el mock local.",
      }]);
    } finally {
      setStreaming(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 h-[calc(100vh-10rem)]">
      {/* Chat */}
      <div className="flex flex-col">
        <header className="mb-4">
          <p className="text-xs font-mono text-artico/50 uppercase tracking-[0.2em]">Latitud Copilot</p>
          <h1 className="mt-2 font-heading italic text-4xl text-artico tracking-tight">
            Tu cerebro operativo
          </h1>
        </header>

        <Card className="flex-1 flex flex-col overflow-hidden">
          {/* Mensajes */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-5">
            {messages.map((m, i) => (
              <div key={i} className={cn("flex gap-3", m.role === "user" ? "justify-end" : "")}>
                {m.role === "assistant" && (
                  <div className="w-8 h-8 rounded-pill bg-gradient-to-br from-naranja to-turquesa flex items-center justify-center shrink-0">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                )}
                <div className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3 text-sm font-body leading-relaxed whitespace-pre-line",
                  m.role === "user" ? "bg-naranja text-white rounded-br-md" : "bg-acero text-artico rounded-bl-md",
                )}>
                  {m.content}
                  {streaming && i === messages.length - 1 && m.role === "assistant" && (
                    <span className="inline-block w-1.5 h-4 bg-naranja ml-1 animate-pulse align-middle" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Sugerencias */}
          <div className="px-5 pt-3 pb-2 flex gap-2 overflow-x-auto border-t border-niebla">
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => send(s)}
                      className="shrink-0 px-3 py-1.5 rounded-pill bg-mina border border-niebla text-xs font-body text-artico/80 hover:border-artico/30">
                {s}
              </button>
            ))}
          </div>

          {/* Composer */}
          <form onSubmit={(e) => { e.preventDefault(); send(input); }}
                className="p-4 border-t border-niebla flex items-center gap-2">
            <button type="button" aria-label="Dictado por voz"
                    className="w-10 h-10 rounded-pill hover:bg-acero flex items-center justify-center text-artico/60">
              <Mic className="h-4 w-4" />
            </button>
            <Input
              placeholder="Preguntale algo al Copilot…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={streaming}
              className="flex-1"
            />
            <Button type="submit" disabled={streaming || !input.trim()} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </Card>
      </div>

      {/* Panel contexto */}
      <aside className="space-y-4 hidden lg:block">
        <Link href="/dashboard/copilot/daily-risk">
          <Card className="hover:translate-y-[-1px] transition-transform cursor-pointer ring-1 ring-naranja/30">
            <CardContent className="p-5 bg-gradient-to-br from-naranja/10 via-mina to-alerta/10">
              <div className="flex items-center justify-between">
                <ShieldAlert className="h-5 w-5 text-naranja" />
                <ArrowRight className="h-4 w-4 text-artico/40" />
              </div>
              <h3 className="mt-3 font-heading italic text-2xl text-artico leading-tight">
                Alertas del día
              </h3>
              <p className="mt-2 text-xs font-mono text-artico/50">
                Daily Risk Agent · 3 alertas activas para próximas 24h
              </p>
            </CardContent>
          </Card>
        </Link>

        <Card>
          <CardContent className="p-5">
            <h3 className="font-mono text-xs uppercase tracking-wider text-artico/60 mb-4">Datos consultados</h3>
            <ul className="space-y-3 text-xs font-mono text-artico/70">
              <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-pill bg-naranja mt-1 shrink-0" /><span>Minera360 → SafetyOps · 247 incidentes 90d</span></li>
              <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-pill bg-naranja mt-1 shrink-0" /><span>Minera360 → AssetIQ · 18 camiones operativos</span></li>
              <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-pill bg-turquesa mt-1 shrink-0" /><span>Contacto → Encuestas · pulse Q2 2026</span></li>
              <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-pill bg-dorado mt-1 shrink-0" /><span>Servicio meteorológico · pronóstico 72hs</span></li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <h3 className="font-mono text-xs uppercase tracking-wider text-artico/60 mb-3">Sugerencias proactivas</h3>
            <ul className="space-y-3 text-sm text-artico/85">
              <li>📅 3 cumpleaños críticos esta semana sin saludar</li>
              <li>🌡️ 2 reportes ambientales sin publicar</li>
              <li>⚠️ EPP arnés vencerán en 14d (3 unidades)</li>
            </ul>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
