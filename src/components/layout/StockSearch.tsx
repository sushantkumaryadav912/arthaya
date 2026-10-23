"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { searchStocks } from "@/lib/api/stockApi";
import { recordSearchedStock } from "@/lib/utils/searchHistory";
import type { StockSummary } from "@/lib/types";
import { cn } from "@/lib/utils/cn";
import { ValueDelta } from "@/components/common/ValueDelta";

/** Global stock search with a results dropdown. Navigates to /stocks/[ticker]. */
export function StockSearch({ className }: { className?: string }) {
  const router = useRouter();
  const [q, setQ] = React.useState("");
  const [results, setResults] = React.useState<StockSummary[]>([]);
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const boxRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    let alive = true;
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
    setOpen(false);
    setQ("");
    recordSearchedStock(ticker);
    router.push(`/stocks/${ticker}`);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open || !results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (a + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(results[active].ticker);
    }
  };

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
          placeholder="Search ticker or company…"
          className="w-full bg-transparent text-sm text-fg placeholder:text-fg-subtle focus:outline-none"
          aria-label="Search stocks"
        />
        <div className="hidden sm:flex items-center gap-0.5 font-mono text-[10px] text-fg-subtle border border-border px-1.5 py-0.5 rounded bg-elevated pointer-events-none shrink-0">
          <kbd>⌘</kbd>
          <kbd>K</kbd>
        </div>
      </div>
      {open && results.length > 0 && (
        <div className="absolute left-0 right-0 top-11 z-50 max-h-80 overflow-y-auto rounded-lg border border-border-strong bg-elevated p-1 shadow-xl">
          {results.map((r, i) => (
            <button
              key={r.ticker}
              onMouseEnter={() => setActive(i)}
              onClick={() => go(r.ticker)}
              className={cn(
                "flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left",
                i === active ? "bg-panel" : "hover:bg-panel/60",
              )}
            >
              <div className="min-w-0">
                <p className="tabular text-sm font-medium text-fg">{r.ticker}</p>
                <p className="truncate text-xs text-fg-muted">{r.name}</p>
              </div>
              <ValueDelta changePercent={r.changePercent} showValue={false} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
