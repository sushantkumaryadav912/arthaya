"use client";

import type * as React from "react";
import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, XAxis, YAxis } from "recharts";
import type { PerformanceStat } from "@/lib/types";
import { AXIS } from "./chartTheme";

/** Horizontal-ish period performance bars. Null periods are skipped (no fabricated values). */
export function PerformanceChart({ data, height = 220 }: { data: PerformanceStat[]; height?: number }) {
  const rows = data
    .filter((d) => d.changePercent !== null)
    .map((d) => ({ period: d.period, value: d.changePercent as number }));

  if (!rows.length) {
    return (
      <div className="flex h-[220px] items-center justify-center text-xs text-fg-subtle">
        No performance data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={rows} margin={{ top: 16, right: 8, bottom: 0, left: -16 }}>
        <XAxis dataKey="period" stroke={AXIS.stroke} fontSize={AXIS.fontSize} tickLine={false} axisLine={false} />
        <YAxis stroke={AXIS.stroke} fontSize={AXIS.fontSize} tickLine={false} axisLine={false} width={40} tickFormatter={(v) => `${v}%`} />
        <Bar dataKey="value" radius={[3, 3, 0, 0]} isAnimationActive={false}>
          {rows.map((r, i) => (
            <Cell key={i} fill={r.value >= 0 ? "var(--color-positive)" : "var(--color-negative)"} />
          ))}
          <LabelList
            dataKey="value"
            position="top"
            className="tabular"
            fontSize={10}
            fill="var(--color-fg-muted)"
            formatter={(value: React.ReactNode) => {
              const n = typeof value === "number" ? value : Number(value);
              return `${n > 0 ? "+" : ""}${n.toFixed(1)}%`;
            }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
