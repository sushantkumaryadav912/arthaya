"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AXIS, ChartTooltip, GRID_STROKE, SERIES_COLORS } from "./chartTheme";

export interface PriceChartPoint {
  t: string;
  price: number;
  sma20?: number;
  sma50?: number;
  sma200?: number;
}

export type PriceChartType = "line" | "area";
export interface Overlay {
  key: "sma20" | "sma50" | "sma200";
  label: string;
}

function fmtDate(t: string) {
  const d = new Date(t);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/** Interactive price chart with optional moving-average overlays. */
export function PriceChart({
  data,
  type = "area",
  overlays = [],
  height = 320,
}: {
  data: PriceChartPoint[];
  type?: PriceChartType;
  overlays?: Overlay[];
  height?: number;
}) {
  const Chart = type === "area" ? AreaChart : LineChart;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <Chart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
        <defs>
          <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.28} />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={GRID_STROKE} vertical={false} />
        <XAxis dataKey="t" tickFormatter={fmtDate} stroke={AXIS.stroke} fontSize={AXIS.fontSize} minTickGap={40} tickLine={false} />
        <YAxis stroke={AXIS.stroke} fontSize={AXIS.fontSize} tickLine={false} axisLine={false} domain={["auto", "auto"]} width={56} />
        <Tooltip content={<ChartTooltip />} labelFormatter={fmtDate} />
        {type === "area" ? (
          <Area type="monotone" dataKey="price" name="Price" stroke="var(--color-accent)" strokeWidth={2} fill="url(#priceFill)" isAnimationActive={false} dot={false} />
        ) : (
          <Line type="monotone" dataKey="price" name="Price" stroke="var(--color-accent)" strokeWidth={2} isAnimationActive={false} dot={false} />
        )}
        {overlays.map((o, i) => (
          <Line
            key={o.key}
            type="monotone"
            dataKey={o.key}
            name={o.label}
            stroke={SERIES_COLORS[(i + 1) % SERIES_COLORS.length]}
            strokeWidth={1.4}
            dot={false}
            isAnimationActive={false}
            connectNulls
          />
        ))}
      </Chart>
    </ResponsiveContainer>
  );
}
