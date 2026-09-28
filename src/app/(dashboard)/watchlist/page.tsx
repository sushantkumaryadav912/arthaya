"use client";

import * as React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PageIntro } from "@/components/common/Headings";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DemoBadge } from "@/components/common/ProvenanceTag";
import { EmptyState, LoadingSkeleton } from "@/components/common/States";
import { StockTable } from "@/components/stocks/StockTable";
import { useWatchlist } from "@/hooks/useWatchlist";
import { getWatchlist } from "@/lib/api/watchlistApi";
import type { StockSummary } from "@/lib/types";

export default function WatchlistPage() {
  const { tickers, hydrated, add, remove } = useWatchlist();
  const [rows, setRows] = React.useState<StockSummary[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [input, setInput] = React.useState("");

  React.useEffect(() => {
    if (!hydrated) return;
    let active = true;
    setLoading(true);
    getWatchlist(tickers).then((data) => {
      if (active) {
        setRows(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [tickers, hydrated]);

  const onAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const t = input.trim().toUpperCase();
    if (t) add(t);
    setInput("");
  };

  return (
    <>
      <PageIntro
        title="Watchlist"
        description="Symbols you're tracking. Stored locally in your browser."
        disclaimer="Demo data — illustrative figures only. Not investment advice."
        actions={<DemoBadge />}
      />

      <form onSubmit={onAdd} className="flex max-w-sm gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value.toUpperCase())}
          placeholder="Add ticker (e.g. GOOGL)"
        />
        <Button type="submit" variant="outline">
          <Plus className="size-4" />
          Add
        </Button>
      </form>

      <Card>
        <CardContent className="p-0">
          {!hydrated || loading ? (
            <div className="p-4">
              <LoadingSkeleton rows={4} />
            </div>
          ) : rows.length === 0 ? (
            <EmptyState
              title="Your watchlist is empty"
              description="Add a ticker above or explore the markets."
              action={
                <Link href="/markets">
                  <Button variant="outline" size="sm">Browse markets</Button>
                </Link>
              }
            />
          ) : (
            <StockTable rows={rows} onRemove={remove} />
          )}
        </CardContent>
      </Card>
    </>
  );
}
