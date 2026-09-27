"use client";

import { Area, AreaChart, ResponsiveContainer } from "recharts";

/** Tiny sparkline for index/summary cards. Tone-driven stroke. */
export function Sparkline({
  data,
  tone = "neutral",
  height = 40,
}: {
  data: number[];
  tone?: "positive" | "negative" | "neutral";
  height?: number;
}) {
  const color =
    tone === "positive"
      ? "var(--color-positive)"
      : tone === "negative"
        ? "var(--color-negative)"
        : "var(--color-accent)";
  const chartData = data.map((v, i) => ({ i, v }));
  const id = `spark-${tone}-${data.length}`;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={chartData} margin={{ top: 2, bottom: 2, left: 0, right: 0 }}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#${id})`}
          isAnimationActive={false}
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
