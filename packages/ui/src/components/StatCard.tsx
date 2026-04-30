import * as React from "react";
import { cn } from "../lib/cn";

interface Props {
  label: string;
  value: string | number;
  delta?: { value: string; trend: "up" | "down" | "flat" };
  icon?: React.ReactNode;
  accent?: "naranja" | "turquesa" | "dorado" | "ok" | "alerta";
  className?: string;
}

const accentMap = {
  naranja:  { ring: "ring-naranja/30", text: "text-naranja" },
  turquesa: { ring: "ring-turquesa/30", text: "text-turquesa" },
  dorado:   { ring: "ring-dorado/30", text: "text-dorado" },
  ok:       { ring: "ring-ok/30", text: "text-ok" },
  alerta:   { ring: "ring-alerta/30", text: "text-alerta" },
};

const trendMap = {
  up:   { sym: "↑", color: "text-ok" },
  down: { sym: "↓", color: "text-alerta" },
  flat: { sym: "→", color: "text-artico/60" },
};

export function StatCard({ label, value, delta, icon, accent, className }: Props) {
  const a = accent ? accentMap[accent] : null;
  return (
    <div
      className={cn(
        "rounded-2xl bg-acero border border-niebla p-5 flex flex-col gap-3",
        a && `ring-1 ${a.ring}`,
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-body text-artico/60">{label}</span>
        {icon && <span className={cn("text-artico/60", a?.text)}>{icon}</span>}
      </div>
      <div className="font-heading italic text-4xl text-artico leading-none tracking-tight">
        {value}
      </div>
      {delta && (
        <div className={cn("flex items-center gap-1 text-xs font-mono", trendMap[delta.trend].color)}>
          <span aria-hidden>{trendMap[delta.trend].sym}</span>
          <span>{delta.value}</span>
        </div>
      )}
    </div>
  );
}
