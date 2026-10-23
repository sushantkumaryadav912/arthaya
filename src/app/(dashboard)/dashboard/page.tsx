import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { PageIntro, SectionHeading } from "@/components/common/Headings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DemoBadge, ProvenanceTag } from "@/components/common/ProvenanceTag";
import { Sparkline } from "@/components/charts/Sparkline";
import { ValueDelta } from "@/components/common/ValueDelta";
import { StockTable } from "@/components/stocks/StockTable";
import { PredictionCard } from "@/components/predictions/PredictionCard";
import { AgentStatusBadge } from "@/components/common/StatusBadge";
import { getMarketIndices, getMarketIntelligence } from "@/lib/api/marketApi";
import { getWatchlist, DEFAULT_WATCHLIST } from "@/lib/api/watchlistApi";
import { getAllPredictions } from "@/lib/api/predictionApi";
import { getReports } from "@/lib/api/reportApi";
import { isDemoSessionAsync } from "@/lib/utils/env";
import { formatNumber, timeAgo } from "@/lib/utils/format";

export default async function DashboardPage() {
  const [indices, intel, watchlist, predictions, reports, isDemo] = await Promise.all([
    getMarketIndices(),
    getMarketIntelligence(),
    getWatchlist(DEFAULT_WATCHLIST),
    getAllPredictions(5),
    getReports(),
    isDemoSessionAsync(),
  ]);

  return (
    <>
      <PageIntro
        title="Market Overview"
        description="Multi-agent market intelligence across US & India equities."
        disclaimer={
          isDemo
            ? "Demo data — illustrative figures only. Nothing here is investment advice."
            : "Live multi-agent research signals synced with backend. Probabilistic models — not investment advice."
        }
        actions={
          <>
            <DemoBadge isDemo={isDemo} />
            <Link href="/analyze">
              <Button>
                <Sparkles className="size-4" />
                Run AI Analysis
              </Button>
            </Link>
          </>
        }
      />

      {/* Market indices */}
      <section>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          {indices.map((idx) => (
            <div key={idx.id} className="rounded-lg border border-border bg-panel p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-fg-muted">{idx.name}</p>
                <Badge tone="neutral">{idx.region}</Badge>
              </div>
              <p className="mt-2 tabular text-xl font-medium text-fg">{formatNumber(idx.value, 2)}</p>
              <ValueDelta change={idx.change} changePercent={idx.changePercent} />
              <div className="mt-2">
                <Sparkline
                  data={idx.spark}
                  tone={idx.changePercent >= 0 ? "positive" : "negative"}
                  height={36}
                />
              </div>
            </div>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-fg-subtle">
          <ProvenanceTag kind="market-data" className="mr-1" />{" "}
          {isDemo ? "Index levels are demo values." : "Global equity indices synced for market regime classification."}
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Watchlist snapshot */}
        <div className="lg:col-span-2">
          <SectionHeading
            title="Watchlist"
            description="Snapshot of tracked symbols"
            right={
              <Link href="/watchlist" className="text-xs text-accent hover:underline">
                View all
              </Link>
            }
          />
          <Card>
            <CardContent className="p-0">
              <StockTable rows={watchlist} />
            </CardContent>
          </Card>
        </div>

        {/* AI Market Intelligence */}
        <div>
          <SectionHeading title="AI Market Intelligence" />
          <Card variant="instrument">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Regime read</CardTitle>
              <ProvenanceTag kind="ai-interpretation" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <Stat label="Regime" value={intel.regime} />
                <Stat label="Momentum" value={intel.momentum} />
                <Stat label="Volatility" value={intel.volatility} />
                <Stat label="News" value={intel.newsSentiment} />
              </div>
              <ul className="space-y-1.5 border-t border-border pt-3">
                {(intel?.observations || []).map((o: string, i: number) => (
                  <li key={i} className="flex gap-2 text-xs text-fg-muted">
                    <span className="mt-1.5 size-1 shrink-0 rounded-full bg-accent" />
                    {o}
                  </li>
                ))}
              </ul>
              <p className="text-[10px] text-fg-subtle">
                {isDemo
                  ? "AI-generated interpretation of demo data. Model probability, not certainty."
                  : "AI-generated multi-agent regime interpretation. Model probability, not certainty."}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Active analyses */}
      <section>
        <SectionHeading
          title="Recent AI Analyses"
          right={
            <Link href="/reports" className="text-xs text-accent hover:underline">
              All reports
            </Link>
          }
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(reports || []).slice(0, 3).map((r) => (
            <Link key={r.id} href={`/reports/${r.id}`}>
              <Card className="transition-colors hover:border-border-strong">
                <CardContent className="flex items-center justify-between gap-3 py-4">
                  <div className="min-w-0">
                    <p className="tabular text-sm font-medium text-fg">{r.ticker}</p>
                    <p className="truncate text-xs text-fg-subtle">{r.company}</p>
                    <p className="mt-1 text-[10px] text-fg-subtle">{timeAgo(r.generatedAt)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <AgentStatusBadge status="completed" />
                    <span className="tabular text-xs text-fg-muted">
                      {Math.round(r.probability * 100)}% {r.overallSignal}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Prediction snapshot */}
      <section>
        <SectionHeading
          title="Prediction Snapshot"
          description="Ensemble model probabilities — 5-day horizon"
          right={
            <Link href="/predictions" className="flex items-center gap-1 text-xs text-accent hover:underline">
              Prediction engine <ArrowRight className="size-3" />
            </Link>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(predictions || []).slice(0, 4).map((p) => (
            <PredictionCard key={p.ticker} prediction={p} href={`/stocks/${p.ticker}/prediction`} />
          ))}
        </div>
      </section>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-surface px-2.5 py-2">
      <p className="text-[10px] text-fg-subtle">{label}</p>
      <p className="text-xs font-medium text-fg">{value}</p>
    </div>
  );
}
