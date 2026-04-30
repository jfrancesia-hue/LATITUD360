import { SEVERITY_META } from "@latitud360/shared";
import type { Severity } from "@latitud360/database";
import { cn } from "../lib/cn";

interface Props {
  severity: Severity;
  className?: string;
  showEmoji?: boolean;
}

export function SeverityBadge({ severity, className, showEmoji = true }: Props) {
  const meta = SEVERITY_META[severity];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill px-2.5 py-0.5 text-xs font-mono uppercase tracking-wider",
        className,
      )}
      style={{ background: `${meta.color}1F`, color: meta.color }}
    >
      {showEmoji && <span aria-hidden>{meta.emoji}</span>}
      <span>{meta.label}</span>
    </span>
  );
}
