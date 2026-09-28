"use client";

import * as React from "react";
import { PriceChart, type Overlay, type PriceChartType } from "./PriceChart";
import { CandlestickChart } from "./CandlestickChart";
import { cn } from "@/lib/utils/cn";
import type { Candle, PricePoint } from "@/lib/types";

type Mode = "area" | "line" | "candlestick";
type RangeKey = "1M" | "3M" | "6M" | "1Y" | "ALL";

const RANGES: { key: RangeKey; label: string; days: number }[] = [
  { key: "1M", label: "1M", days: 22 },
  { key: "3M", label: "3M", days: 66 },
  { key: "6M", label: "6M", days: 132 },
  { key: "1Y", label: "1Y", days: 252 },
  { key: "ALL", label: "All", days: Infinity },
];

const SMA_OVERLAYS: Overlay[] = [
  { key: "sma20", label: "SMA 20" },
  { key: "sma50", label: "SMA 50" },
  { key: "sma200", label: "SMA 200" },
];

interface Props {
  series: (PricePoint & { sma20?: number; sma50?: number; sma200?: number })[];
  candles?: Candle[];
  allowOverlays?: boolean;
}

function Toggle({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
        active ? "bg-elevated text-fg" : "text-fg-muted hover:text-fg",
      )}
    >
      {children}
    </button>
  );
}

/** Interactive price chart with type + range controls and optional SMA overlays. */
export function PriceChartPanel({ series, candles, allowOverlays = false }: Props) {
  const [mode, setMode] = React.useState<Mode>("area");
  const [range, setRange] = React.useState<RangeKey>("6M");
  const [overlays, setOverlays] = React.useState<Record<string, boolean>>({});

  const days = RANGES.find((r) => r.key === range)!.days;
  const sliced = React.useMemo(
    () => (days === Infinity ? series : series.slice(-days)),
    [series, days],
  );
  const slicedCandles = React.useMemo(
    () => (!candles ? [] : days === Infinity ? candles : candles.slice(-days)),
    [candles, days],
  );

  const activeOverlays = allowOverlays ? SMA_OVERLAYS.filter((o) => overlays[o.key]) : [];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1 rounded-lg border border-border bg-panel p-0.5">
          <Toggle active={mode === "area"} onClick={() => setMode("area")}>Area</Toggle>
          <Toggle active={mode === "line"} onClick={() => setMode("line")}>Line</Toggle>
          {candles && candles.length > 0 && (
            <Toggle active={mode === "candlestick"} onClick={() => setMode("candlestick")}>
              Candles
            </Toggle>
          )}
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-border bg-panel p-0.5">
          {RANGES.map((r) => (
            <Toggle key={r.key} active={range === r.key} onClick={() => setRange(r.key)}>
              {r.label}
            </Toggle>
          ))}
        </div>
      </div>

      {allowOverlays && mode !== "candlestick" && (
        <div className="flex flex-wrap items-center gap-2">
          {SMA_OVERLAYS.map((o) => (
            <label key={o.key} className="flex items-center gap-1.5 text-xs text-fg-muted">
              <input
                type="checkbox"
                checked={!!overlays[o.key]}
                onChange={(e) => setOverlays((p) => ({ ...p, [o.key]: e.target.checked }))}
                className="accent-[var(--color-accent)]"
              />
              {o.label}
            </label>
          ))}
        </div>
      )}

      {mode === "candlestick" ? (
        <CandlestickChart data={slicedCandles} />
      ) : (
        <PriceChart data={sliced} type={mode as PriceChartType} overlays={activeOverlays} />
      )}
    </div>
  );
}
