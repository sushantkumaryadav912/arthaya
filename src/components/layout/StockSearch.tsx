"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles, ArrowRight } from "lucide-react";
import { searchStocks } from "@/lib/api/stockApi";
import { recordSearchedStock } from "@/lib/utils/searchHistory";
import type { StockSummary } from "@/lib/types";
import { cn } from "@/lib/utils/cn";
import { ValueDelta } from "@/components/common/ValueDelta";
import { formatPrice } from "@/lib/utils/format";

/** Global stock search with real-time exchange search and fallback direct resolution. */
export function StockSearch({ className }: { className?: string }) {
  const router = useRouter();
  const [q, setQ] = React.useState("");
  const [results, setResults] = React.useState<StockSummary[]>([]);
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const boxRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    let alive = true;
    if (!q.trim()) {
      setResults([]);
      return;
    }

    const id = setTimeout(async () => {
      const r = await searchStocks(q);
      if (alive) {
        setResults(r.slice(0, 8));
        setActive(0);
      }
    }, 120);

    return () => {
      alive = false;
      clearTimeout(id);
    };
  }, [q]);

  React.useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const go = (ticker: string) => {
    const clean = ticker.trim().toUpperCase();
    if (!clean) return;
    setOpen(false);
    setQ("");
    recordSearchedStock(clean);
    router.push(`/stocks/${clean}`);
  };

  const goAnalyze = (ticker: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const clean = ticker.trim().toUpperCase();
    if (!clean) return;
    setOpen(false);
    setQ("");
    recordSearchedStock(clean);
    router.push(`/analyze?ticker=${clean}`);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (results.length > 0 && results[active]) {
        go(results[active].ticker);
      } else if (q.trim()) {
        go(q.trim().toUpperCase());
      }
      return;
    }
    if (!open || !results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (a + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a - 1 + results.length) % results.length);
    }
  };

  const trimmedQ = q.trim().toUpperCase();

  return (
    <div ref={boxRef} className={cn("relative", className)}>
      <div className="flex h-9 items-center gap-2 rounded-md border border-border-strong bg-surface px-3">
        <Search className="size-4 shrink-0 text-fg-subtle" />
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Search any stock (e.g. M&M, AAPL, TSLA, ZOMATO)…"
          className="w-full bg-transparent text-sm text-fg placeholder:text-fg-subtle focus:outline-none"
          aria-label="Search stocks"
        />
        <div className="hidden sm:flex items-center gap-0.5 font-mono text-[10px] text-fg-subtle border border-border px-1.5 py-0.5 rounded bg-elevated pointer-events-none shrink-0">
          <kbd>⌘</kbd>
          <kbd>K</kbd>
        </div>
      </div>

      {open && q.trim().length > 0 && (
        <div className="absolute left-0 right-0 top-11 z-50 max-h-96 overflow-y-auto rounded-lg border border-border-strong bg-elevated p-1 shadow-2xl backdrop-blur-md">
          {results.length > 0 ? (
            results.map((r, i) => (
              <div
                key={r.ticker}
                onMouseEnter={() => setActive(i)}
                onClick={() => go(r.ticker)}
                className={cn(
                  "flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left cursor-pointer transition-colors",
                  i === active ? "bg-panel" : "hover:bg-panel/60",
                )}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="tabular text-sm font-semibold text-fg">{r.ticker}</p>
                    <span className="text-[10px] font-mono text-fg-subtle rounded border border-border px-1 py-0.2">
                      {r.exchange}
                    </span>
                  </div>
                  <p className="truncate text-xs text-fg-muted">{r.name}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <p className="tabular text-xs font-semibold text-fg">
                      {formatPrice(r.price, r.exchange === "NSE" || r.exchange === "BSE" ? "INR" : "USD")}
                    </p>
                    <ValueDelta changePercent={r.changePercent} showValue={false} className="justify-end text-[11px]" />
                  </div>

                  <button
                    type="button"
                    onClick={(e) => goAnalyze(r.ticker, e)}
                    className="p-1 text-fg-subtle hover:text-accent rounded hover:bg-elevated transition-colors"
                    title={`Analyze ${r.ticker}`}
                  >
                    <Sparkles className="size-3.5 text-accent" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div
              onClick={() => go(trimmedQ)}
              className="flex items-center justify-between p-3 rounded-md cursor-pointer hover:bg-panel text-left"
            >
              <div>
                <p className="text-sm font-semibold text-fg">Search symbol &quot;{trimmedQ}&quot;</p>
                <p className="text-xs text-fg-muted">Inspect live exchange metrics and multi-agent reports</p>
              </div>
              <ArrowRight className="size-4 text-accent" />
            </div>
          )}

          {/* Always provide direct navigation row for any query */}
          {results.length > 0 && !results.some((r) => r.ticker === trimmedQ) && (
            <div
              onClick={() => go(trimmedQ)}
              className="border-t border-border/80 mt-1 pt-1.5 px-3 py-2 flex items-center justify-between cursor-pointer rounded hover:bg-panel"
            >
              <span className="text-xs text-fg font-medium">Search for &quot;{trimmedQ}&quot; directly</span>
              <ArrowRight className="size-3.5 text-accent" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
