import { DEMO_MODE } from "@/lib/utils/env";
import { apiGet } from "./client";
import type { ReportSummary, ResearchReport } from "@/lib/types";
import { buildReport, buildReportSummaries } from "@/lib/mock/reports";

export async function getReports(): Promise<ReportSummary[]> {
  if (DEMO_MODE) return buildReportSummaries();
  return apiGet<ReportSummary[]>("/reports");
}

export async function getReport(id: string): Promise<ResearchReport | null> {
  if (DEMO_MODE) return buildReport(id);
  return apiGet<ResearchReport>(`/reports/${id}`);
}
