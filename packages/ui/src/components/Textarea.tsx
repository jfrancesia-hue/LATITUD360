import * as React from "react";
import { cn } from "../lib/cn";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, rows = 4, ...props }, ref) => (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(
        "flex w-full rounded-lg bg-mina border border-niebla px-3 py-2 text-sm text-artico",
        "placeholder:text-artico/40 leading-relaxed",
        "focus-visible:outline-none focus-visible:border-naranja",
        "disabled:cursor-not-allowed disabled:opacity-50 resize-y",
        className,
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
