import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-accent text-bg hover:bg-accent-strong font-semibold shadow-sm hover:shadow-[0_0_18px_rgba(16,185,129,0.35)]",
        outline: "border border-border-strong bg-surface/50 text-fg hover:bg-elevated hover:border-accent/40 hover:text-accent",
        ghost: "text-fg-muted hover:bg-elevated hover:text-fg",
        subtle: "bg-elevated/80 text-fg hover:bg-border-strong hover:text-fg",
        danger: "bg-negative/90 text-white hover:bg-negative shadow-sm hover:shadow-[0_0_18px_rgba(244,63,94,0.35)] font-semibold",
        glow: "bg-accent/15 text-accent border border-accent/30 hover:bg-accent/25 hover:border-accent/60 shadow-[0_0_12px_rgba(16,185,129,0.15)] font-semibold",
      },
      size: {
        sm: "h-8 px-3 text-xs rounded-md",
        md: "h-9 px-4 rounded-lg",
        lg: "h-10 px-5 text-base rounded-xl",
        icon: "h-9 w-9 rounded-lg",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { buttonVariants };

