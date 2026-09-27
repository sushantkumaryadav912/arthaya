import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDateTime, formatPercent } from "@/lib/utils/format";
import type { Direction, ReportSummary } from "@/lib/types";

const DIR: Record<Direction, { label: string; tone: "positive" | "negative" | "neutral" }> = {
  UP: { label: "Bullish", tone: "positive" },
  DOWN: { label: "Bearish", tone: "negative" },
  NEUTRAL: { label: "Neutral", tone: "neutral" },
};

const STATUS: Record<ReportSummary["agentStatus"], { label: string; tone: "positive" | "warning" | "negative" }> = {
  completed: { label: "Completed", tone: "positive" },
  partial: { label: "Partial", tone: "warning" },
  failed: { label: "Failed", tone: "negative" },
};

/** Research-report summary card linking to the full report. */
export function ReportCard({ report }: { report: ReportSummary }) {
  const dir = DIR[report.overallSignal];
  const st = STATUS[report.agentStatus];
  return (
    <Link href={`/reports/${report.id}`} className="group block">
      <Card className="h-full transition-colors hover:border-border-strong">
        <CardContent className="space-y-3 py-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="tabular text-sm font-semibold text-fg">{report.ticker}</p>
              <p className="text-xs text-fg-muted">{report.company}</p>
            </div>
            <Badge tone={st.tone}>{st.label}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge tone={dir.tone}>{dir.label}</Badge>
            <span className="tabular text-xs text-fg-muted">
              Model probability {formatPercent(report.probability * 100, 0, false)}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-2 text-[10px] text-fg-subtle">
            <span>
              {report.horizonDays}d horizon · {report.model}
            </span>
            <span className="flex items-center gap-1">
              {formatDateTime(report.generatedAt)}
              <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
