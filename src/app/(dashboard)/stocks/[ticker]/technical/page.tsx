import { getTechnical } from "@/lib/api";
import { EmptyState } from "@/components/common/States";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IndicatorCard } from "@/components/stocks/IndicatorCard";
import { SignalCard } from "@/components/analysis/SignalCard";
import { PriceChartPanel } from "@/components/charts/PriceChartPanel";
import { ProvenanceTag } from "@/components/common/ProvenanceTag";
import { SectionHeading } from "@/components/common/Headings";

export default async function TechnicalPage({ params }: { params: Promise<{ ticker: string }> }) {
  const { ticker } = await params;
  const t = await getTechnical(ticker);
  if (!t) return <EmptyState title="No technical data available" />;

  return (
    <div className="space-y-6">
      <div>
        <SectionHeading title="Signal summary" description="Analytical classification — not a recommendation." />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <SignalCard label="Momentum" signal={t.summary.momentum} />
          <SignalCard label="Trend" signal={t.summary.trend} />
          <SignalCard label="Volatility" signal={t.summary.volatility} />
          <SignalCard label="Volume" signal={t.summary.volume} />
          <SignalCard label="Support / Resistance" signal={t.summary.supportResistance} />
        </div>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Price & moving averages</CardTitle>
          <ProvenanceTag kind="calculated" />
        </CardHeader>
        <CardContent>
          <PriceChartPanel series={t.priceWithSma} allowOverlays />
        </CardContent>
      </Card>

      <div>
        <SectionHeading title="Indicators" description={`As of ${new Date(t.asOf).toLocaleDateString()}`} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {t.indicators.map((ind) => (
            <IndicatorCard key={ind.key} indicator={ind} />
          ))}
        </div>
      </div>
    </div>
  );
}
