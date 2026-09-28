import { getStockOverview } from "@/lib/api";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/stocks/MetricCard";
import { PriceChartPanel } from "@/components/charts/PriceChartPanel";
import { PerformanceChart } from "@/components/charts/PerformanceChart";
import { ProvenanceTag } from "@/components/common/ProvenanceTag";
import { SectionHeading } from "@/components/common/Headings";
import { NA, formatCompact, formatNumber, formatPercent, formatPrice } from "@/lib/utils/format";

export default async function StockOverviewPage({ params }: { params: Promise<{ ticker: string }> }) {
  const { ticker } = await params;
  const o = await getStockOverview(ticker);
  if (!o) notFound();

  const cur = o.currency;
  const metrics: { label: string; value: string; hint?: string }[] = [
    { label: "Market cap", value: o.marketCap == null ? NA : formatCompact(o.marketCap) },
    { label: "P/E ratio", value: o.peRatio == null ? NA : formatNumber(o.peRatio, 1) },
    { label: "EPS", value: o.eps == null ? NA : formatPrice(o.eps, cur) },
    { label: "Beta", value: o.beta == null ? NA : formatNumber(o.beta, 2) },
    { label: "52-week high", value: o.week52High == null ? NA : formatPrice(o.week52High, cur) },
    { label: "52-week low", value: o.week52Low == null ? NA : formatPrice(o.week52Low, cur) },
    { label: "Volume", value: o.volume == null ? NA : formatCompact(o.volume) },
    { label: "Avg volume", value: o.avgVolume == null ? NA : formatCompact(o.avgVolume) },
    {
      label: "Dividend yield",
      value: o.dividendYield == null ? NA : formatPercent(o.dividendYield, 2, false),
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Price</CardTitle>
          <ProvenanceTag kind="market-data" />
        </CardHeader>
        <CardContent>
          <PriceChartPanel series={o.series} candles={o.candles} />
        </CardContent>
      </Card>

      <div>
        <SectionHeading title="Key metrics" description="Demo market data — illustrative values." />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {metrics.map((m) => (
            <MetricCard key={m.label} label={m.label} value={m.value} provenance="market-data" />
          ))}
        </div>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Performance</CardTitle>
          <ProvenanceTag kind="market-data" />
        </CardHeader>
        <CardContent>
          <PerformanceChart data={o.performance} />
        </CardContent>
      </Card>
    </div>
  );
}
