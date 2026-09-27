"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Candle } from "@/lib/types";
import { AXIS, GRID_STROKE } from "./chartTheme";

function fmtDate(t: string) {
  return new Date(t).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/**
 * Pragmatic candlestick: each row is drawn as a floating bar spanning
 * [low, high] range via a stacked transparent base, colored by close vs open.
 * Kept dependency-free (no extra charting lib).
 */
export function CandlestickChart({ data, height = 320 }: { data: Candle[]; height?: number }) {
  const rows = data.map((c) => ({
    t: c.t,
    base: c.low,
    range: c.high - c.low,
    up: c.close >= c.open,
    open: c.open,
    close: c.close,
    high: c.high,
    low: c.low,
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: -12 }} barCategoryGap="20%">
        <CartesianGrid stroke={GRID_STROKE} vertical={false} />
        <XAxis dataKey="t" tickFormatter={fmtDate} stroke={AXIS.stroke} fontSize={AXIS.fontSize} minTickGap={40} tickLine={false} />
        <YAxis stroke={AXIS.stroke} fontSize={AXIS.fontSize} tickLine={false} axisLine={false} domain={["auto", "auto"]} width={56} />
        <Tooltip
          cursor={{ fill: "var(--color-elevated)", opacity: 0.4 }}
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const d = payload[0].payload as (typeof rows)[number];
            return (
              <div className="rounded-lg border border-border-strong bg-elevated/95 px-3 py-2 text-xs shadow-lg">
                <p className="mb-1 tabular text-fg-subtle">{fmtDate(d.t)}</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 tabular text-fg">
                  <span className="text-fg-muted">O</span><span>{d.open}</span>
                  <span className="text-fg-muted">H</span><span>{d.high}</span>
                  <span className="text-fg-muted">L</span><span>{d.low}</span>
                  <span className="text-fg-muted">C</span><span>{d.close}</span>
                </div>
              </div>
            );
          }}
        />
        {/* transparent base lifts the visible bar to the low value */}
        <Bar dataKey="base" stackId="c" fill="transparent" isAnimationActive={false} />
        <Bar dataKey="range" stackId="c" isAnimationActive={false} radius={1}>
          {rows.map((r, i) => (
            <Cell key={i} fill={r.up ? "var(--color-positive)" : "var(--color-negative)"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
