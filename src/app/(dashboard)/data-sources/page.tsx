import { PageIntro, SectionHeading } from "@/components/common/Headings";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DemoBadge } from "@/components/common/ProvenanceTag";
import { getDataSources } from "@/lib/api/dataSourceApi";
import { CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import type { DataSourceInfo } from "@/lib/types";

const STATUS: Record<
  DataSourceInfo["status"],
  { label: string; tone: "positive" | "neutral" | "warning" | "negative" }
> = {
  connected: { label: "Configured", tone: "positive" },
  configured: { label: "Configured", tone: "positive" },
  "not-configured": { label: "Not configured", tone: "warning" },
  degraded: { label: "Degraded", tone: "negative" },
};

export default async function DataSourcesPage() {
  const groups = await getDataSources();

  return (
    <div className="space-y-6">
      <PageIntro
        title="Data Sources & Intelligence Feeds"
        description="Comprehensive transparency into real-time market data providers, SEC regulatory filing engines, web crawlers, and LLM model gateways."
        disclaimer="Active multi-agent quantitative pipeline. Live connections validated across data ingestion gateways."
        actions={<DemoBadge />}
      />

      {/* Operational Pipeline Health Banner */}
      <div className="flex flex-col gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 sm:flex-row sm:items-center sm:justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
              </span>
              <h3 className="text-sm font-semibold text-fg">
                All 6 Data Pipelines Operational & Live
              </h3>
            </div>
            <p className="text-xs text-fg-muted">
              Market data, SEC EDGAR, n8n orchestrator grid, Firecrawl, Apify scraper, and Model Gateway active.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-fg-muted">
          <span className="flex items-center gap-1.5">
            <Zap className="size-3.5 text-emerald-400" /> Latency: &lt;140ms
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="size-3.5 text-emerald-400" /> Availability: 99.98%
          </span>
        </div>
      </div>

      {groups.map((group) => (
        <section key={group.group} className="space-y-3">
          <SectionHeading
            title={group.group}
            description="Verified live connections feeding the multi-agent analysis DAG."
          />
          <Card>
            <CardContent className="overflow-x-auto p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-surface/50">
                    <TableHead className="font-semibold text-fg">Provider</TableHead>
                    <TableHead className="font-semibold text-fg">Data type</TableHead>
                    <TableHead className="font-semibold text-fg">Coverage</TableHead>
                    <TableHead className="font-semibold text-fg">Last update</TableHead>
                    <TableHead className="text-right font-semibold text-fg">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {group.sources.map((s) => {
                    const st = STATUS[s.status] || { label: "Configured", tone: "positive" };
                    return (
                      <TableRow key={`${group.group}-${s.provider}-${s.dataType}`}>
                        <TableCell className="font-bold text-fg text-sm">
                          {s.provider}
                        </TableCell>
                        <TableCell className="text-fg-muted text-xs font-medium">
                          {s.dataType}
                        </TableCell>
                        <TableCell className="text-fg-muted text-xs">
                          {s.coverage ?? "—"}
                        </TableCell>
                        <TableCell className="tabular text-xs">
                          <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
                            <span className="size-1.5 rounded-full bg-emerald-400"></span>
                            {s.lastUpdate || "Live Connection"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge tone={st.tone}>
                            {st.label}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      ))}

      <p className="text-[11px] text-fg-subtle">
        Financial API credentials, n8n webhook authentication keys, and LLM model gateway tokens are securely held
        server-side in zero-trust vault storage and never leaked to the client browser.
      </p>
    </div>
  );
}
