"use client";
import { Search, Bell, ChevronDown } from "lucide-react";
import { Avatar, Input } from "@latitud360/ui";

export function Topbar() {
  return (
    <header className="h-16 border-b border-niebla bg-mina/80 backdrop-blur-md sticky top-0 z-30 flex items-center px-6 gap-4">
      <div className="flex-1 max-w-md relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-artico/40" />
        <Input
          placeholder="Buscar incidentes, personas, permisos…"
          className="pl-9 bg-acero border-niebla h-9"
        />
      </div>

      <button aria-label="Notificaciones" className="relative w-9 h-9 rounded-pill hover:bg-acero flex items-center justify-center">
        <Bell className="h-4 w-4 text-artico/80" />
        <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-pill bg-naranja" />
      </button>

      <button className="flex items-center gap-2 hover:bg-acero rounded-pill px-2 py-1">
        <Avatar name="Jorge Eduardo Francesia" size={32} />
        <span className="hidden md:inline text-sm font-body text-artico/90">Jorge</span>
        <ChevronDown className="h-3.5 w-3.5 text-artico/60" />
      </button>
    </header>
  );
}
