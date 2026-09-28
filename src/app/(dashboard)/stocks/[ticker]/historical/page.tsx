import { getHistorical } from "@/lib/api";
import { EmptyState } from "@/components/common/States";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SignalCard } from "@/components/analysis/SignalCard";
import { SignalBadge } from "@/components/common/StatusBadge";
import { ProvenanceTag } from "@/components/common/ProvenanceTag";
import { SectionHeading } from "@/components/common/Headings";
import { formatPercent } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

export default async function HistoricalPage({ params }: { params: Promise<{ ticker: string }> }) {
  const { ticker } = await params;
  const h = await getHistorical(ticker);
  if (!h) return <EmptyState title="No historical comparison available" />;

  return (
    <div className="space-y-6">
      <div>
        <SectionHeading title="Current market state" description="Conditions used to find historical analogs." />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <SignalCard label="Momentum" signal={h.currentState.momentum} />
          <SignalCard label="Volatility" signal={h.currentState.volatility} />
          <SignalCard label="Volume" signal={h.currentState.volume} />
        </div>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Historical analogs</CardTitle>
          <ProvenanceTag kind="backtest" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead className="text-right">Similarity</TableHead>
                <TableHead className="text-center">Momentum</TableHead>
                <TableHead className="text-center">Volatility</TableHead>
                <TableHead className="text-center">Volume</TableHead>
                <TableHead className="text-right">Fwd return</TableHead>
                <TableHead className="text-right">Window</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {h.matches.map((m) => (
                <TableRow key={m.period}>
                  <TableCell className="font-medium text-fg">{m.period}</TableCell>
                  <TableCell className="tabular text-right text-fg">{Math.round(m.similarity * 100)}%</TableCell>
                  <TableCell className="text-center"><div className="flex justify-center"><SignalBadge signal={m.momentum} /></div></TableCell>
                  <TableCell className="text-center"><div className="flex justify-center"><SignalBadge signal={m.volatility} /></div></TableCell>
                  <TableCell className="text-center"><div className="flex justify-center"><SignalBadge signal={m.volume} /></div></TableCell>
                  <TableCell className={cn("tabular text-right", m.forwardReturn >= 0 ? "text-positive" : "text-negative")}>
                    {formatPercent(m.forwardReturn)}
                  </TableCell>
                  <TableCell className="text-right text-xs text-fg-subtle">{m.forwardWindow}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p className="text-[10px] text-fg-subtle">
            Forward returns are observed historical outcomes after each analog period — not a
            forecast. Similarity does not guarantee a repeat.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
