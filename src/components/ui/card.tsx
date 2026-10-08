import * as React from "react";
import { cn } from "@/lib/utils/cn";

type CardVariant = "panel" | "instrument" | "flat" | "glass" | "interactive";

/**
 * Surfaces are differentiated by role:
 *  - panel       primary content surface (default)
 *  - instrument  primary panel wearing the calibration-scale top edge
 *  - flat        borderless well, separated from ground by inset color
 *  - glass       glassmorphic translucent panel
 *  - interactive card with hover glow elevation
 */
export function Card({
  className,
  variant = "panel",
  hoverable = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { variant?: CardVariant; hoverable?: boolean }) {
  return (
    <div
      className={cn(
        "transition-all duration-200 ease-in-out",
        variant === "instrument" && "instrument",
        variant === "panel" && "rounded-xl border border-border/80 bg-panel shadow-sm",
        variant === "flat" && "rounded-lg bg-elevated/60 border border-transparent",
        variant === "glass" && "glass-panel rounded-xl shadow-lg",
        variant === "interactive" && "rounded-xl border border-border/80 bg-panel shadow-sm hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[0_8px_24px_-8px_rgba(16,185,129,0.18)]",
        (hoverable && variant !== "interactive") && "hover:border-border-strong hover:shadow-md cursor-pointer",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1 p-4 sm:p-5", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("font-display text-sm font-semibold tracking-tight text-fg", className)} {...props} />;
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-xs text-fg-muted leading-relaxed", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4 pt-0 sm:p-5 sm:pt-0", className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center p-4 pt-0 sm:p-5 sm:pt-0 border-t border-border/40 mt-auto", className)} {...props} />;
}

