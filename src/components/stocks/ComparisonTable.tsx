"use client";

import Link from "next/link";
import { X, Sparkles, ExternalLink, ArrowRight } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ValueDelta } from "@/components/common/ValueDelta";
import { Badge } from "@/components/ui/badge";
import { NA, formatNumber, formatPercent, formatPrice, formatCompact } from "@/lib/utils/format";
import type { Direction, Exchange, StockSummary } from "@/lib/types";

const CUR: Record<Exchange, string> = {
  NSE: "INR",
  BSE: "INR",
  NASDAQ: "USD",
  NYSE: "USD",
};

const DIR_TONE: Record<Direction, "positive" | "negative" | "neutral"> = {
  UP: "positive",
  DOWN: "negative",
  NEUTRAL: "neutral",
};

interface ComparisonTableProps {
  stocks: StockSummary[];
  onRemove?: (ticker: string) => void;
}

/** Side-by-side comparison across 2–5 stocks with full technical, valuation, and ML ensemble metrics. */
export function ComparisonTable({ stocks, onRemove }: ComparisonTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-surface/50">
          <TableHead className="w-48 font-semibold text-fg">Metric</TableHead>
          {stocks.map((s) => (
            <TableHead key={s.ticker} className="text-right">
              <div className="flex items-center justify-end gap-2">
                <Link
                  href={`/stocks/${s.ticker}`}
                  className="tabular text-sm font-bold text-fg hover:text-accent hover:underline flex items-center gap-1"
                >
                  {s.ticker}
                </Link>
                {onRemove && (
                  <button
                    type="button"
                    onClick={() => onRemove(s.ticker)}
                    className="rounded p-0.5 text-fg-subtle hover:bg-elevated hover:text-negative transition-colors"
                    title={`Remove ${s.ticker}`}
                    aria-label={`Remove ${s.ticker}`}
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium text-fg-muted">Company</TableCell>
          {stocks.map((s) => (
            <TableCell key={s.ticker} className="text-right text-xs text-fg-muted">
              {s.name}
            </TableCell>
          ))}
        </TableRow>

        <TableRow>
          <TableCell className="font-medium text-fg-muted">Exchange / Market</TableCell>
          {stocks.map((s) => (
            <TableCell key={s.ticker} className="text-right text-xs font-mono text-fg-muted">
              {s.exchange} ({CUR[s.exchange] ?? "USD"})
            </TableCell>
          ))}
        </TableRow>

        <TableRow>
          <TableCell className="font-medium text-fg-muted">Live Price</TableCell>
          {stocks.map((s) => (
            <TableCell key={s.ticker} className="tabular text-right text-sm font-semibold text-fg">
              {formatPrice(s.price, CUR[s.exchange])}
            </TableCell>
          ))}
        </TableRow>

        <TableRow>
          <TableCell className="font-medium text-fg-muted">Daily Change</TableCell>
          {stocks.map((s) => (
            <TableCell key={s.ticker} className="text-right">
              <ValueDelta
                change={s.change}
                changePercent={s.changePercent}
                showValue={false}
                className="justify-end font-medium"
              />
            </TableCell>
          ))}
        </TableRow>

        <TableRow>
          <TableCell className="font-medium text-fg-muted">RSI (14-Day Momentum)</TableCell>
          {stocks.map((s) => {
            const rsiVal = s.rsi;
            const rsiZone =
              rsiVal == null ? null : rsiVal > 70 ? "Overbought" : rsiVal < 30 ? "Oversold" : "Neutral";
            return (
              <TableCell key={s.ticker} className="tabular text-right text-fg">
                <span className="font-medium">{rsiVal == null ? NA : formatNumber(rsiVal, 1)}</span>
                {rsiZone && (
                  <span
                    className={`ml-1.5 text-[10px] ${
                      rsiZone === "Overbought"
                        ? "text-negative"
                        : rsiZone === "Oversold"
                        ? "text-positive"
                        : "text-fg-subtle"
                    }`}
                  >
                    ({rsiZone})
                  </span>
                )}
              </TableCell>
            );
          })}
        </TableRow>

        <TableRow>
          <TableCell className="font-medium text-fg-muted">Trend Signal</TableCell>
          {stocks.map((s) => (
            <TableCell key={s.ticker} className="text-right">
              <Badge
                tone={
                  s.trend === "up"
                    ? "positive"
                    : s.trend === "down"
                    ? "negative"
                    : "neutral"
                }
              >
                {s.trend ? s.trend.toUpperCase() : "FLAT"}
              </Badge>
            </TableCell>
          ))}
        </TableRow>

        <TableRow>
          <TableCell className="font-medium text-fg-muted">Estimated Volume</TableCell>
          {stocks.map((s) => (
            <TableCell key={s.ticker} className="tabular text-right text-fg-muted text-xs">
              {s.volume ? formatCompact(s.volume) : NA}
            </TableCell>
          ))}
        </TableRow>

        <TableRow className="bg-surface/30">
          <TableCell className="font-medium text-fg-muted">Quant ML Prediction</TableCell>
          {stocks.map((s) => (
            <TableCell key={s.ticker} className="text-right">
              {s.prediction ? (
                <Badge tone={DIR_TONE[s.prediction]}>
                  {s.prediction === "UP" ? "BULLISH ↑" : "BEARISH ↓"}
                </Badge>
              ) : (
                <span className="text-fg-subtle">{NA}</span>
              )}
            </TableCell>
          ))}
        </TableRow>

        <TableRow className="bg-surface/30">
          <TableCell className="font-medium text-fg-muted">Calibrated Probability</TableCell>
          {stocks.map((s) => (
            <TableCell key={s.ticker} className="tabular text-right font-medium text-fg">
              {s.probability == null ? NA : formatPercent(s.probability * 100, 1, false)}
            </TableCell>
          ))}
        </TableRow>

        <TableRow>
          <TableCell className="font-medium text-fg-muted">ML Architecture</TableCell>
          {stocks.map((s) => (
            <TableCell key={s.ticker} className="text-right text-[11px] text-fg-muted">
              XGBoost + RF Ensemble
            </TableCell>
          ))}
        </TableRow>

        <TableRow>
          <TableCell className="font-medium text-fg-muted">Actions</TableCell>
          {stocks.map((s) => (
            <TableCell key={s.ticker} className="text-right">
              <div className="flex items-center justify-end gap-1.5">
                <Link
                  href={`/analyze?ticker=${s.ticker}`}
                  className="inline-flex items-center gap-1 rounded bg-accent/10 px-2 py-1 text-[11px] font-semibold text-accent hover:bg-accent/20 transition-colors"
                  title="Run multi-agent pipeline on this stock"
                >
                  <Sparkles className="size-3" /> Analyze
                </Link>
                <Link
                  href={`/stocks/${s.ticker}`}
                  className="inline-flex items-center gap-1 rounded bg-elevated px-2 py-1 text-[11px] font-medium text-fg-muted hover:text-fg transition-colors"
                  title="View complete stock technical & fundamental profile"
                >
                  Details <ArrowRight className="size-3" />
                </Link>
              </div>
            </TableCell>
          ))}
        </TableRow>
      </TableBody>
    </Table>
  );
}
