"use client";

import * as React from "react";
import { Plus, X, Sparkles, Scale, RefreshCw } from "lucide-react";
import { PageIntro } from "@/components/common/Headings";
import { Card, CardContent } from "@/components/ui/card";
import { DemoBadge } from "@/components/common/ProvenanceTag";
import { LoadingSkeleton, EmptyState } from "@/components/common/States";
import { ComparisonTable } from "@/components/stocks/ComparisonTable";
import { cn } from "@/lib/utils/cn";
import { listStocks } from "@/lib/api/stockApi";
import { findSeed, toSummary } from "@/lib/mock/stocks";
import { recordSearchedStock, getSearchedStocks } from "@/lib/utils/searchHistory";
import type { StockSummary } from "@/lib/types";

const MAX = 5;
const PRESET_SUGGESTIONS = ["M&M", "AAPL", "NVDA", "TSLA", "RELIANCE", "MSFT", "TATAMOTORS", "INFY"];

export default function ComparePage() {
  const [all, setAll] = React.useState<StockSummary[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selected, setSelected] = React.useState<string[]>([]);
  const [customTicker, setCustomTicker] = React.useState("");
  const [inputError, setInputError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;
    listStocks().then((data) => {
      if (!active) return;
      const initialMap = new Map<string, StockSummary>();
      for (const s of data) {
        initialMap.set(s.ticker.toUpperCase(), s);
      }

      // Check searched stocks from localStorage and ensure they are available
      const searched = getSearchedStocks();
      for (const t of searched) {
        if (!initialMap.has(t)) {
          initialMap.set(t, toSummary(findSeed(t)));
        }
      }

      // Ensure M&M is explicitly present
      if (!initialMap.has("M&M")) {
        initialMap.set("M&M", toSummary(findSeed("M&M")));
      }

      const combined = Array.from(initialMap.values());
      setAll(combined);

      // Default selected: M&M, AAPL, NVDA if available, else first 3
      const defaultSelection = ["M&M", "AAPL", "NVDA"].filter((t) => initialMap.has(t));
      setSelected(defaultSelection.length >= 2 ? defaultSelection : combined.slice(0, 3).map((s) => s.ticker));
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  const toggle = (ticker: string) => {
    setSelected((prev) => {
      if (prev.includes(ticker)) return prev.filter((t) => t !== ticker);
      if (prev.length >= MAX) return prev;
      return [...prev, ticker];
    });
  };

  const handleRemove = (ticker: string) => {
    setSelected((prev) => prev.filter((t) => t !== ticker));
  };

  const handleAddCustom = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setInputError(null);
    const clean = customTicker.trim().toUpperCase();
    if (!clean) return;

    // Validate ticker pattern
    if (!/^[A-Z0-9.\-^=&_]{1,20}$/.test(clean)) {
      setInputError("Invalid ticker symbol. Use letters, numbers, or standard market suffixes (e.g. M&M, TSLA).");
      return;
    }

    // Record to search history for reports integration
    recordSearchedStock(clean);

    // If not in all, generate summary
    let target = all.find((s) => s.ticker.toUpperCase() === clean);
    if (!target) {
      target = toSummary(findSeed(clean));
      setAll((prev) => [target!, ...prev]);
    }

    // Add to selected if space available
    setSelected((prev) => {
      if (prev.includes(clean)) return prev;
      if (prev.length >= MAX) {
        // Replace the last one if reached max
        return [...prev.slice(0, MAX - 1), clean];
      }
      return [...prev, clean];
    });

    setCustomTicker("");
  };

  const chosen = all.filter((s) => selected.includes(s.ticker));

  return (
    <div className="space-y-6">
      <PageIntro
        title="Multi-Stock Comparison Matrix"
        description="Line up 2–5 symbols side by side. Cross-examine real-time price action, RSI momentum, valuation multiples, and Quant ML ensemble forecasts."
        disclaimer="Live comparative quantitative metrics. Metric analysis only — no single winner is automatically declared."
        actions={<DemoBadge />}
      />

      {loading ? (
        <LoadingSkeleton rows={5} />
      ) : (
        <>
          {/* Custom Stock Input & Presets Card */}
          <div className="rounded-xl border border-border/80 bg-surface/80 p-4 shadow-sm backdrop-blur-md space-y-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-semibold text-fg flex items-center gap-1.5">
                  <Scale className="size-4 text-accent" /> Select or Add Symbols to Compare
                </h3>
                <p className="text-xs text-fg-muted">
                  Add custom stocks (e.g. M&M, AAPL, TSLA, NVDA) or select from below. Max {MAX} symbols.
                </p>
              </div>

              {/* Custom Ticker Input */}
              <form onSubmit={handleAddCustom} className="flex items-center gap-2">
                <input
                  type="text"
                  value={customTicker}
                  onChange={(e) => {
                    setCustomTicker(e.target.value);
                    if (inputError) setInputError(null);
                  }}
                  placeholder="Custom symbol (e.g. M&M, TATAMOTORS)..."
                  className="rounded-lg border border-border-strong bg-bg px-3 py-1.5 text-xs text-fg placeholder:text-fg-subtle focus:border-accent focus:outline-none w-56 font-mono uppercase"
                />
                <button
                  type="submit"
                  disabled={!customTicker.trim()}
                  className="flex items-center gap-1 rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-accent-fg hover:opacity-90 disabled:opacity-50 transition-all"
                >
                  <Plus className="size-3.5" /> Add
                </button>
              </form>
            </div>

            {inputError && (
              <p className="text-xs text-negative font-medium">{inputError}</p>
            )}

            {/* Quick Suggestions & Available Symbols */}
            <div className="space-y-2 pt-2 border-t border-border/60">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-medium text-fg-subtle mr-1">Quick Select:</span>
                {PRESET_SUGGESTIONS.map((ticker) => {
                  const on = selected.includes(ticker);
                  return (
                    <button
                      key={ticker}
                      type="button"
                      onClick={() => {
                        let stock = all.find((s) => s.ticker === ticker);
                        if (!stock) {
                          stock = toSummary(findSeed(ticker));
                          setAll((prev) => [stock!, ...prev]);
                        }
                        recordSearchedStock(ticker);
                        toggle(ticker);
                      }}
                      className={cn(
                        "rounded-md border px-2.5 py-1 text-xs font-semibold tabular transition-all",
                        on
                          ? "border-accent bg-accent/15 text-accent shadow-sm"
                          : "border-border-strong bg-elevated/60 text-fg-muted hover:border-accent/40 hover:text-fg",
                      )}
                    >
                      {on ? `✓ ${ticker}` : `+ ${ticker}`}
                    </button>
                  );
                })}
              </div>

              {/* All other available symbols */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {all
                  .filter((s) => !PRESET_SUGGESTIONS.includes(s.ticker))
                  .map((s) => {
                    const on = selected.includes(s.ticker);
                    const disabled = !on && selected.length >= MAX;
                    return (
                      <button
                        key={s.ticker}
                        type="button"
                        onClick={() => toggle(s.ticker)}
                        disabled={disabled}
                        aria-pressed={on}
                        className={cn(
                          "tabular rounded-md border px-2 py-0.5 text-xs font-medium transition-colors",
                          on
                            ? "border-accent bg-accent/10 text-accent font-semibold"
                            : "border-border text-fg-subtle hover:bg-elevated hover:text-fg",
                          disabled && "cursor-not-allowed opacity-30",
                        )}
                      >
                        {s.ticker}
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* Selected Count Indicator */}
            <div className="flex items-center justify-between text-[11px] text-fg-subtle pt-1">
              <span>
                <strong className="text-fg">{selected.length}</strong> / {MAX} symbols selected
                {selected.length < 2 && " (Choose at least 2 to render the matrix)"}
              </span>
              {selected.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelected([])}
                  className="text-fg-subtle hover:text-negative transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* Comparison Grid or Empty State */}
          {chosen.length < 2 ? (
            <EmptyState
              title="Select at least two symbols"
              description="Choose symbols or type custom tickers above to generate a side-by-side comparative analysis."
            />
          ) : (
            <Card>
              <CardContent className="overflow-x-auto p-0">
                <ComparisonTable stocks={chosen} onRemove={handleRemove} />
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
