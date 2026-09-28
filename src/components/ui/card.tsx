import * as React from "react";
import { cn } from "@/lib/utils/cn";

type CardVariant = "panel" | "instrument" | "flat";

/**
 * Surfaces are differentiated by role:
 *  - panel       primary content surface (default)
 *  - instrument  primary panel wearing the calibration-scale top edge
 *  - flat        borderless well, separated from the ground by inset color
 */
export function Card({
  className,
  variant = "panel",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { variant?: CardVariant }) {
  return (
    <div
      className={cn(
        variant === "instrument" && "instrument",
        variant === "panel" && "rounded-lg border border-border bg-panel",
        variant === "flat" && "rounded-md bg-elevated/60",
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
  return <h3 className={cn("font-display text-sm font-medium text-fg", className)} {...props} />;
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-xs text-fg-muted", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4 pt-0 sm:p-5 sm:pt-0", className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center p-4 pt-0 sm:p-5 sm:pt-0", className)} {...props} />;
}
