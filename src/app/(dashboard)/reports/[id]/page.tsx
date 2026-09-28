import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageIntro } from "@/components/common/Headings";
import { DemoBadge } from "@/components/common/ProvenanceTag";
import { ReportDetail } from "@/components/reports/ReportDetail";
import { getReport } from "@/lib/api/reportApi";

export default async function ReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const report = await getReport(id);
  if (!report) notFound();

  return (
    <>
      <PageIntro
        title={`${report.ticker} — Research Report`}
        description={report.company}
        disclaimer="Demo data — illustrative research, not investment advice."
        actions={
          <>
            <DemoBadge />
            <Link
              href="/reports"
              className="inline-flex items-center gap-1 text-xs text-accent hover:underline"
            >
              <ArrowLeft className="size-3" /> All reports
            </Link>
          </>
        }
      />
      <ReportDetail report={report} />
    </>
  );
}
