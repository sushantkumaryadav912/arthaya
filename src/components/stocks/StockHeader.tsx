"use client";

import Link from "next/link";
import { Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ValueDelta } from "@/components/common/ValueDelta";
import { ProvenanceTag } from "@/components/common/ProvenanceTag";
import { useWatchlist } from "@/hooks/useWatchlist";
import { formatPrice } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { StockOverview } from "@/lib/types";

/** Stock detail header: identity, live-ish price, watchlist toggle, analyze CTA. */
export function StockHeader({ overview }: { overview: StockOverview }) {
  const { has, toggle, hydrated } = useWatchlist();
  const watched = hydrated && has(overview.ticker);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="tabular text-2xl font-semibold tracking-tight text-fg">{overview.ticker}</h1>
          <Badge tone="neutral">{overview.exchange}</Badge>
        </div>
        <p className="text-sm text-fg-muted">{overview.name}</p>
        <div className="flex items-center gap-3 pt-1">
          <span className="tabular text-2xl font-semibold text-fg">
            {formatPrice(overview.price, overview.currency)}
          </span>
          <ValueDelta change={overview.change} changePercent={overview.changePercent} />
        </div>
        <ProvenanceTag kind="market-data" className="mt-1" />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          onClick={() => toggle(overview.ticker)}
          aria-pressed={watched}
        >
          <Star className={cn("size-4", watched && "fill-warning text-warning")} />
          {watched ? "Watching" : "Watch"}
        </Button>
        <Link href={`/analyze?ticker=${overview.ticker}`}>
          <Button>
            <Sparkles className="size-4" />
            Run AI Analysis
          </Button>
        </Link>
      </div>
    </div>
  );
}
