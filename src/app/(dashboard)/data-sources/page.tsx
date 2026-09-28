import { PageIntro, SectionHeading } from "@/components/common/Headings";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DemoBadge } from "@/components/common/ProvenanceTag";
import { getDataSources } from "@/lib/api/dataSourceApi";
import type { DataSourceInfo } from "@/lib/types";

const STATUS: Record<DataSourceInfo["status"], { label: string; tone: "positive" | "neutral" | "warning" | "negative" }> = {
  connected: { label: "Connected", tone: "positive" },
  configured: { label: "Configured", tone: "neutral" },
  "not-configured": { label: "Not configured", tone: "warning" },
  degraded: { label: "Degraded", tone: "negative" },
};

export default async function DataSourcesPage() {
  const groups = await getDataSources();

  return (
    <>
      <PageIntro
        title="Data Sources"
        description="Transparency on where each data type originates and its current connection state."
        disclaimer="Demo data — the platform runs on illustrative mock feeds. No live provider credentials are used in the browser."
        actions={<DemoBadge />}
      />

      {groups.map((group) => (
        <section key={group.group}>
          <SectionHeading title={group.group} />
          <Card>
            <CardContent className="overflow-x-auto p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Provider</TableHead>
                    <TableHead>Data type</TableHead>
                    <TableHead>Coverage</TableHead>
                    <TableHead>Last update</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {group.sources.map((s) => {
                    const st = STATUS[s.status];
                    return (
                      <TableRow key={`${group.group}-${s.provider}-${s.dataType}`}>
                        <TableCell className="font-medium text-fg">{s.provider}</TableCell>
                        <TableCell className="text-fg-muted">{s.dataType}</TableCell>
                        <TableCell className="text-fg-muted">{s.coverage ?? "—"}</TableCell>
                        <TableCell className="tabular text-fg-muted">{s.lastUpdate ?? "—"}</TableCell>
                        <TableCell className="text-right">
                          <Badge tone={st.tone}>{st.label}</Badge>
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
        Financial API credentials are held server-side only and never exposed to the client. In demo
        mode all figures are generated locally.
      </p>
    </>
  );
}
