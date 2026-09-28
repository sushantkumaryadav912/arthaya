import { PageIntro, SectionHeading } from "@/components/common/Headings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DemoBadge, ProvenanceTag } from "@/components/common/ProvenanceTag";
import { Sparkline } from "@/components/charts/Sparkline";
import { ValueDelta } from "@/components/common/ValueDelta";
import { StockTable } from "@/components/stocks/StockTable";
import { getMarketIndices, getMarketIntelligence } from "@/lib/api/marketApi";
import { listStocks } from "@/lib/api/stockApi";
import { formatNumber } from "@/lib/utils/format";

export default async function MarketsPage() {
  const [indices, intel, stocks] = await Promise.all([
    getMarketIndices(),
    getMarketIntelligence(),
    listStocks(),
  ]);

  const us = indices.filter((i) => i.region === "US");
  const india = indices.filter((i) => i.region === "IN");

  return (
    <>
      <PageIntro
        title="Markets"
        description="Index levels and cross-market state across US & India equities."
        disclaimer="Demo data — illustrative figures only. Not investment advice."
        actions={<DemoBadge />}
      />

      {[
        { title: "United States", rows: us },
        { title: "India", rows: india },
      ].map((group) => (
        <section key={group.title}>
          <SectionHeading title={group.title} />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {group.rows.map((idx) => (
              <div key={idx.id} className="rounded-xl border border-border bg-panel p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-fg-muted">{idx.name}</p>
                  <Badge tone="neutral">{idx.region}</Badge>
                </div>
                <p className="mt-2 tabular text-lg font-semibold text-fg">{formatNumber(idx.value, 2)}</p>
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
        </section>
      ))}

      <section>
        <SectionHeading title="AI Market Intelligence" />
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Regime read</CardTitle>
            <ProvenanceTag kind="ai-interpretation" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
              <Stat label="Regime" value={intel.regime} />
              <Stat label="Momentum" value={intel.momentum} />
              <Stat label="Volatility" value={intel.volatility} />
              <Stat label="News" value={intel.newsSentiment} />
            </div>
            <ul className="space-y-1.5 border-t border-border pt-3">
              {intel.observations.map((o, i) => (
                <li key={i} className="flex gap-2 text-xs text-fg-muted">
                  <span className="mt-1 size-1 shrink-0 rounded-full bg-accent" />
                  {o}
                </li>
              ))}
            </ul>
            <p className="text-[10px] text-fg-subtle">
              AI-generated interpretation of demo data. Model probability, not certainty.
            </p>
          </CardContent>
        </Card>
      </section>

      <section>
        <SectionHeading title="Universe" description="All tracked symbols" />
        <Card>
          <CardContent className="p-0">
            <StockTable rows={stocks} />
          </CardContent>
        </Card>
        <p className="mt-2 text-[11px] text-fg-subtle">
          <ProvenanceTag kind="market-data" className="mr-1" /> Quotes are demo values.
        </p>
      </section>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-surface px-2.5 py-2">
      <p className="text-[10px] uppercase tracking-wide text-fg-subtle">{label}</p>
      <p className="text-xs font-medium text-fg">{value}</p>
    </div>
  );
}
