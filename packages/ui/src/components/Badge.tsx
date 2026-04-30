import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-pill px-2.5 py-0.5 text-xs font-body font-medium",
  {
    variants: {
      variant: {
        default: "bg-niebla text-artico",
        ok: "bg-ok/20 text-ok",
        warn: "bg-warn/20 text-warn",
        alerta: "bg-alerta/20 text-alerta",
        naranja: "bg-naranja/20 text-naranja",
        turquesa: "bg-turquesa/20 text-turquesa",
        dorado: "bg-dorado/20 text-dorado",
        outline: "border border-niebla text-artico",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
