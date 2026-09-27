import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PredictionCard } from "@/components/predictions/PredictionCard";
import { DataQualityCard } from "@/components/analysis/DataQualityCard";
import { AIResearchSummary } from "@/components/analysis/AIResearchSummary";
import { SectionHeading } from "@/components/common/Headings";
import { ProvenanceTag } from "@/components/common/ProvenanceTag";
import { formatDateTime } from "@/lib/utils/format";
import type { ResearchReport } from "@/lib/types";

/** Full research report view assembling prediction, critic and synthesis. */
export function ReportDetail({ report }: { report: ResearchReport }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-3">
          <CardTitle className="flex items-center gap-2">
            <FileText className="size-4 text-accent" />
            Executive summary
          </CardTitle>
          <ProvenanceTag kind="ai-interpretation" />
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-xs text-fg-muted">
            <Badge tone="neutral">{report.ticker}</Badge>
            <span>{report.company}</span>
            <span className="text-fg-subtle">· {report.horizonDays}d horizon · {report.model}</span>
            <span className="text-fg-subtle">· {formatDateTime(report.generatedAt)}</span>
          </div>
          <p className="text-sm leading-relaxed text-fg-muted">{report.executiveSummary}</p>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <SectionHeading title="ML prediction" />
          <PredictionCard prediction={report.prediction} />
        </div>
        <DataQualityCard critic={report.critic} />
      </div>

      <AIResearchSummary summary={report.analysis} />

      <Card>
        <CardHeader>
          <CardTitle>Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1.5 text-xs">
            {report.sources.map((s, i) => (
              <li key={i} className="flex items-center justify-between gap-2 border-b border-border/60 pb-1.5 last:border-0">
                <span className="text-fg-muted">{s.provider}</span>
                <span className="text-fg-subtle">
                  {s.retrievedAt ? formatDateTime(s.retrievedAt) : "Demo source"}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[10px] text-fg-subtle">
            Sources are illustrative demo providers. This report is automated research output, not
            investment advice.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
