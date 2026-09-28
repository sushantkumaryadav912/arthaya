import { PageIntro } from "@/components/common/Headings";
import { DemoBadge } from "@/components/common/ProvenanceTag";
import { EmptyState } from "@/components/common/States";
import { ReportCard } from "@/components/reports/ReportCard";
import { getReports } from "@/lib/api/reportApi";

export default async function ReportsPage() {
  const reports = await getReports();

  return (
    <>
      <PageIntro
        title="Research Reports"
        description="Completed multi-agent analyses with predictions, critic validation and synthesis."
        disclaimer="Demo data — reports are illustrative research, not investment advice."
        actions={<DemoBadge />}
      />

      {reports.length === 0 ? (
        <EmptyState
          title="No reports yet"
          description="Run an analysis from the workspace to generate a research report."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reports.map((r) => (
            <ReportCard key={r.id} report={r} />
          ))}
        </div>
      )}
    </>
  );
}
