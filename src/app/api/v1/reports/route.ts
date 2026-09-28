import { buildReportSummaries } from "@/lib/mock/reports";
import { ok } from "@/app/api/v1/_lib/respond";

export function GET() {
  return ok(buildReportSummaries());
}
