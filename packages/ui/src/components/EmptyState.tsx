import * as React from "react";
import { cn } from "../lib/cn";

interface Props {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ title, description, icon, action, className }: Props) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center py-16 px-6", className)}>
      {icon && <div className="mb-5 text-artico/40">{icon}</div>}
      <h3 className="font-heading italic text-2xl text-artico">{title}</h3>
      {description && <p className="mt-2 text-sm text-artico/60 max-w-md font-body font-light">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
