import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-pill font-body font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-naranja focus-visible:ring-offset-2 focus-visible:ring-offset-mina disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-naranja text-white hover:bg-naranja-600",
        secondary: "bg-acero text-artico hover:bg-niebla",
        ghost: "text-artico hover:bg-acero",
        outline: "border border-niebla text-artico hover:bg-acero",
        danger: "bg-alerta text-white hover:bg-alerta/90",
        glass: "bg-white/5 backdrop-blur-md text-artico border border-white/10 hover:bg-white/10",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
);
Button.displayName = "Button";

export { buttonVariants };
