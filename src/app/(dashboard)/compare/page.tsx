"use client";

import * as React from "react";
import { PageIntro } from "@/components/common/Headings";
import { Card, CardContent } from "@/components/ui/card";
import { DemoBadge } from "@/components/common/ProvenanceTag";
import { LoadingSkeleton, EmptyState } from "@/components/common/States";
import { ComparisonTable } from "@/components/stocks/ComparisonTable";
import { cn } from "@/lib/utils/cn";
import { listStocks } from "@/lib/api/stockApi";
import type { StockSummary } from "@/lib/types";

const MAX = 5;

export default function ComparePage() {
  const [all, setAll] = React.useState<StockSummary[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selected, setSelected] = React.useState<string[]>([]);

  React.useEffect(() => {
    let active = true;
    listStocks().then((data) => {
      if (!active) return;
      setAll(data);
      setSelected(data.slice(0, 3).map((s) => s.ticker));
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

  const chosen = all.filter((s) => selected.includes(s.ticker));

  return (
    <>
      <PageIntro
        title="Compare"
        description="Line up 2–5 symbols side by side. Metrics only — no automatic winner is declared."
        disclaimer="Demo data — illustrative figures only. Not investment advice."
        actions={<DemoBadge />}
      />

      {loading ? (
        <LoadingSkeleton rows={4} />
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            {all.map((s) => {
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
                    "tabular rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
                    on
                      ? "border-accent bg-accent/10 text-fg"
                      : "border-border-strong text-fg-muted hover:bg-elevated",
                    disabled && "cursor-not-allowed opacity-40",
                  )}
                >
                  {s.ticker}
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-fg-subtle">
            {selected.length}/{MAX} selected — choose at least two symbols to compare.
          </p>

          {chosen.length < 2 ? (
            <EmptyState
              title="Select at least two symbols"
              description="Pick symbols above to build a side-by-side comparison."
            />
          ) : (
            <Card>
              <CardContent className="overflow-x-auto p-0">
                <ComparisonTable stocks={chosen} />
              </CardContent>
            </Card>
          )}
        </>
      )}
    </>
  );
}
