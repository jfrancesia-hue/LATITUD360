import Link from "next/link";
import { Users, Building2, Boxes, Bell, Lock, Workflow, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@latitud360/ui";

const sections = [
  {
    href: "/dashboard/configuracion/usuarios",
    title: "Usuarios y roles",
    description: "Invitaciones, permisos por producto, SSO con Google/Microsoft, 2FA obligatorio para roles críticos.",
    Icon: Users,
    tint: "text-turquesa",
  },
  {
    href: "/dashboard/configuracion/sitios",
    title: "Sitios y áreas",
    description: "Geolocalización de minas, plantas y oficinas. Áreas operativas con responsables.",
    Icon: Building2,
    tint: "text-naranja",
  },
  {
    href: "/dashboard/configuracion/catalogos",
    title: "Catálogos y plantillas",
    description: "EPPs, plantillas de inspección, valores culturales, tipos de incidente, flujos de aprobación.",
    Icon: Boxes,
    tint: "text-dorado",
  },
  {
    href: "/dashboard/configuracion/notificaciones",
    title: "Notificaciones",
    description: "Canales activos, escalación por severidad, plantillas de email/push/WhatsApp.",
    Icon: Bell,
    tint: "text-turquesa",
  },
  {
    href: "/dashboard/configuracion/seguridad",
    title: "Seguridad y auditoría",
    description: "Audit log, política de contraseñas, IP allowlist, dispositivos confiables.",
    Icon: Lock,
    tint: "text-alerta",
  },
  {
    href: "/dashboard/configuracion/integraciones",
    title: "Integraciones",
    description: "SAP, Maximo, Workday, MercadoPago, Stripe, Resend, Twilio. APIs y webhooks.",
    Icon: Workflow,
    tint: "text-naranja",
  },
] as const;

export default function ConfigPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-mono text-artico/50 uppercase tracking-[0.2em]">
          Plataforma → Configuración
        </p>
        <h1 className="mt-2 font-heading italic text-4xl text-artico tracking-tight">Configuración</h1>
        <p className="mt-1 text-sm text-artico/60">Operación de tu instancia Latitud360. Solo visible para administradores.</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map(({ href, title, description, Icon, tint }) => (
          <Link key={href} href={href}>
            <Card className="h-full hover:translate-y-[-1px] transition-transform">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className={`w-11 h-11 rounded-xl bg-acero flex items-center justify-center ${tint}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-artico/40" />
                </div>
                <h3 className="mt-4 font-heading italic text-2xl text-artico leading-tight">{title}</h3>
                <p className="mt-2 text-sm font-body text-artico/70 leading-relaxed">{description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>

      <Card>
        <CardContent className="p-5 text-xs font-mono text-artico/50">
          <p>
            <strong className="text-artico/85">Tenant actual:</strong> nativos.app.latitud360.com · Plan Pioneer ·
            Suscripción activa hasta 2026-12-31
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
