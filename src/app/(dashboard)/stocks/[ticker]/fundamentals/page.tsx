import { getFundamentals } from "@/lib/api";
import { EmptyState } from "@/components/common/States";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FundamentalTable } from "@/components/stocks/FundamentalTable";
import { ProvenanceTag } from "@/components/common/ProvenanceTag";
import { SectionHeading } from "@/components/common/Headings";
import { NA, formatNumber } from "@/lib/utils/format";
import type { MetricValue } from "@/lib/types";

function fmtMetric(m: MetricValue): string {
  if (m.value == null) return NA;
  if (m.unit === "%") return `${formatNumber(m.value, 1)}%`;
  if (m.unit === "x") return `${formatNumber(m.value, 2)}x`;
  return formatNumber(m.value, 2);
}

function MetricGroup({ title, metrics }: { title: string; metrics: MetricValue[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="space-y-1.5">
          {metrics.map((m) => (
            <div key={m.label} className="flex items-center justify-between text-xs">
              <dt className="text-fg-muted">{m.label}</dt>
              <dd className="tabular font-medium text-fg">{fmtMetric(m)}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}

export default async function FundamentalsPage({ params }: { params: Promise<{ ticker: string }> }) {
  const { ticker } = await params;
  const f = await getFundamentals(ticker);
  if (!f) return <EmptyState title="No fundamental data available" />;

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricGroup title="Growth" metrics={f.growth} />
        <MetricGroup title="Profitability" metrics={f.profitability} />
        <MetricGroup title="Leverage" metrics={f.leverage} />
        <MetricGroup title="Valuation" metrics={f.valuation} />
      </div>

      {[
        { title: "Income statement", rows: f.incomeStatement },
        { title: "Balance sheet", rows: f.balanceSheet },
        { title: "Cash flow", rows: f.cashFlow },
      ].map((s) => (
        <Card key={s.title}>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>{s.title}</CardTitle>
            <ProvenanceTag kind="market-data" />
          </CardHeader>
          <CardContent>
            <FundamentalTable rows={s.rows} periods={f.periodLabels} />
          </CardContent>
        </Card>
      ))}

      <SectionHeading title="" description="Demo fundamentals — figures are illustrative. Missing values show N/A, never fabricated." />
    </div>
  );
}
