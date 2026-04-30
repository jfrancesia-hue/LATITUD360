"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@latitud360/ui";
import { getSupabaseBrowserClient } from "@latitud360/auth";
import { ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.push(search.get("returnTo") ?? "/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error de autenticación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen grid place-items-center px-4 bg-mina">
      <div className="w-full max-w-md">
        <h1 className="font-heading italic text-5xl text-artico text-center mb-2 tracking-tight">Latitud360</h1>
        <p className="text-center text-artico/60 mb-10 font-body">Una latitud. Todas tus operaciones.</p>

        <Card className="liquid-glass">
          <CardHeader>
            <CardTitle>Iniciar sesión</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-xs font-mono uppercase tracking-wider text-artico/60 mb-2">Email</label>
                <Input id="email" type="email" autoComplete="email" required
                       value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <label htmlFor="pass" className="block text-xs font-mono uppercase tracking-wider text-artico/60 mb-2">Contraseña</label>
                <Input id="pass" type="password" autoComplete="current-password" required minLength={8}
                       value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>

              {error && <p className="text-sm text-alerta font-mono">{error}</p>}

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Ingresando…" : <>Ingresar <ArrowRight className="h-4 w-4" /></>}
              </Button>
            </form>

            <p className="text-xs text-artico/50 mt-6 text-center font-mono">
              Acceso sólo para mineras suscriptas — <a href="mailto:demo@latitud360.com" className="underline hover:text-naranja">solicitar demo</a>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
