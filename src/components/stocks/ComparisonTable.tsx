import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ValueDelta } from "@/components/common/ValueDelta";
import { Badge } from "@/components/ui/badge";
import { NA, formatNumber, formatPercent, formatPrice } from "@/lib/utils/format";
import type { Direction, Exchange, StockSummary } from "@/lib/types";

const CUR: Record<Exchange, string> = {
  NSE: "INR",
  BSE: "INR",
  NASDAQ: "USD",
  NYSE: "USD",
};

const DIR_TONE: Record<Direction, "positive" | "negative" | "neutral"> = {
  UP: "positive",
  DOWN: "negative",
  NEUTRAL: "neutral",
};

/** Side-by-side comparison across 2–5 stocks. Presents metrics only — no auto "winner". */
export function ComparisonTable({ stocks }: { stocks: StockSummary[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Metric</TableHead>
          {stocks.map((s) => (
            <TableHead key={s.ticker} className="text-right">
              <span className="tabular font-semibold text-fg">{s.ticker}</span>
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="text-fg-muted">Company</TableCell>
          {stocks.map((s) => (
            <TableCell key={s.ticker} className="text-right text-xs text-fg-muted">{s.name}</TableCell>
          ))}
        </TableRow>
        <TableRow>
          <TableCell className="text-fg-muted">Price</TableCell>
          {stocks.map((s) => (
            <TableCell key={s.ticker} className="tabular text-right text-fg">
              {formatPrice(s.price, CUR[s.exchange])}
            </TableCell>
          ))}
        </TableRow>
        <TableRow>
          <TableCell className="text-fg-muted">Change</TableCell>
          {stocks.map((s) => (
            <TableCell key={s.ticker} className="text-right">
              <ValueDelta change={s.change} changePercent={s.changePercent} showValue={false} className="justify-end" />
            </TableCell>
          ))}
        </TableRow>
        <TableRow>
          <TableCell className="text-fg-muted">RSI</TableCell>
          {stocks.map((s) => (
            <TableCell key={s.ticker} className="tabular text-right text-fg">
              {s.rsi == null ? NA : formatNumber(s.rsi, 1)}
            </TableCell>
          ))}
        </TableRow>
        <TableRow>
          <TableCell className="text-fg-muted">Prediction</TableCell>
          {stocks.map((s) => (
            <TableCell key={s.ticker} className="text-right">
              {s.prediction ? (
                <Badge tone={DIR_TONE[s.prediction]}>{s.prediction}</Badge>
              ) : (
                <span className="text-fg-subtle">{NA}</span>
              )}
            </TableCell>
          ))}
        </TableRow>
        <TableRow>
          <TableCell className="text-fg-muted">Model probability</TableCell>
          {stocks.map((s) => (
            <TableCell key={s.ticker} className="tabular text-right text-fg">
              {s.probability == null ? NA : formatPercent(s.probability * 100, 0, false)}
            </TableCell>
          ))}
        </TableRow>
      </TableBody>
    </Table>
  );
}
