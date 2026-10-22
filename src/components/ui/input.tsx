import * as React from "react";
import { cn } from "@/lib/utils/cn";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "flex h-9.5 w-full rounded-lg border border-border-strong/80 bg-surface/90 px-3.5 py-2 text-sm text-fg placeholder:text-fg-subtle transition-all duration-200 focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 shadow-inner",
        className,
      )}
      {...props}
    />
  );
}

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("text-xs font-semibold text-fg-muted tracking-tight", className)}
      {...props}
    />
  );
}

export function Select({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "flex h-9.5 w-full min-w-0 max-w-full rounded-lg border border-border-strong/80 bg-surface/90 px-3 text-sm text-fg transition-all duration-200 focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20 focus-visible:outline-none shadow-inner cursor-pointer truncate",
        className,
      )}
      {...props}
    />
  );
}


