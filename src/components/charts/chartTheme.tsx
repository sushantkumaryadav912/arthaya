"use client";

import type * as React from "react";

export const AXIS = {
  stroke: "var(--color-fg-subtle)",
  fontSize: 11,
} as const;

export const GRID_STROKE = "var(--color-border)";

export const SERIES_COLORS = [
  "var(--color-accent)",
  "var(--color-cyan)",
  "var(--color-warning)",
  "var(--color-positive)",
  "var(--color-negative)",
  "#a78bfa",
];

interface TooltipEntry {
  color?: string;
  name?: React.ReactNode;
  value?: number | string;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: React.ReactNode;
}

/** Shared dark tooltip. */
export function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border-strong bg-elevated/95 px-3 py-2 text-xs shadow-lg backdrop-blur">
      {label != null && <p className="mb-1 tabular text-fg-subtle">{String(label)}</p>}
      <div className="space-y-0.5">
        {payload.map((p, i) => (
          <div key={i} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-fg-muted">
              <span className="size-2 rounded-full" style={{ background: p.color }} />
              {p.name}
            </span>
            <span className="tabular font-medium text-fg">
              {typeof p.value === "number" ? p.value.toLocaleString() : p.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
