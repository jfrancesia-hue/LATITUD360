"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, Mountain, Radio, Users, Wrench, Settings, ChevronRight,
  Sparkles, ShieldCheck, AlertTriangle, ClipboardList, HardHat,
  ClipboardCheck, FileBarChart2, MessageSquare, Heart, UserCircle,
} from "lucide-react";
import { cn } from "@latitud360/ui";

interface NavItem {
  label: string;
  href: string;
  icon: typeof Home;
}

const sections: { title: string; tint?: string; items: NavItem[] }[] = [
  {
    title: "General",
    items: [
      { label: "Inicio",         href: "/dashboard",         icon: Home },
      { label: "Latitud Copilot", href: "/dashboard/copilot", icon: Sparkles },
    ],
  },
  {
    title: "Minera360 · SafetyOps",
    tint: "text-naranja",
    items: [
      { label: "Dashboard HSE",   href: "/dashboard/minera360",          icon: ShieldCheck },
      { label: "Incidentes",      href: "/dashboard/minera360/incidentes", icon: AlertTriangle },
      { label: "Partes diarios",  href: "/dashboard/minera360/partes",     icon: ClipboardList },
      { label: "Permisos",        href: "/dashboard/minera360/permisos",   icon: ClipboardCheck },
      { label: "EPP",             href: "/dashboard/minera360/epp",        icon: HardHat },
      { label: "Inspecciones",    href: "/dashboard/minera360/inspecciones", icon: ClipboardCheck },
      { label: "Reportes SRT",    href: "/dashboard/minera360/reportes",   icon: FileBarChart2 },
    ],
  },
  {
    title: "Contacto · RRHH",
    tint: "text-turquesa",
    items: [
      { label: "Feed",             href: "/dashboard/contacto",                icon: MessageSquare },
      { label: "Reconocimientos",  href: "/dashboard/contacto/reconocimientos", icon: Heart },
      { label: "Personas",         href: "/dashboard/contacto/personas",        icon: UserCircle },
    ],
  },
  {
    title: "Plataforma",
    items: [
      { label: "Configuración", href: "/dashboard/configuracion", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-60 border-r border-niebla bg-mina">
      <div className="px-5 h-16 flex items-center border-b border-niebla">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-pill bg-gradient-to-br from-naranja to-turquesa flex items-center justify-center font-heading italic text-mina text-base">L</div>
          <span className="font-heading italic text-xl text-artico">Latitud360</span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-6">
        {sections.map((section) => (
          <div key={section.title}>
            <div className={cn("px-3 text-[10px] uppercase tracking-[0.18em] font-mono mb-2 text-artico/40", section.tint)}>
              {section.title}
            </div>
            <ul className="space-y-0.5">
              {section.items.map(({ label, href, icon: Icon }) => {
                const active = pathname === href || (href !== "/dashboard" && pathname?.startsWith(href));
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={cn(
                        "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-body",
                        active
                          ? "bg-acero text-artico"
                          : "text-artico/70 hover:text-artico hover:bg-acero/50",
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="flex-1 truncate">{label}</span>
                      {active && <ChevronRight className="h-3 w-3" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-niebla text-[10px] font-mono text-artico/40">
        Catamarca · 2026
      </div>
    </aside>
  );
}
