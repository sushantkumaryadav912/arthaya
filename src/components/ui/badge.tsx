import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-tight transition-all duration-200",
  {
    variants: {
      tone: {
        neutral: "border-border-strong bg-elevated/70 text-fg-muted hover:bg-elevated hover:text-fg",
        positive: "border-positive/35 bg-positive-soft text-positive hover:bg-positive/20 shadow-[0_0_8px_rgba(16,185,129,0.15)]",
        negative: "border-negative/35 bg-negative-soft text-negative hover:bg-negative/20 shadow-[0_0_8px_rgba(244,63,94,0.15)]",
        warning: "border-warning/35 bg-warning-soft text-warning hover:bg-warning/20",
        accent: "border-accent/40 bg-accent/15 text-accent hover:bg-accent/25 shadow-[0_0_10px_rgba(16,185,129,0.2)]",
        live: "border-accent/50 bg-accent/20 text-accent animate-pulse-dot shadow-[0_0_12px_rgba(16,185,129,0.3)]",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}

