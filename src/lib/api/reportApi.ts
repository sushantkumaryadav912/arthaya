import { isDemoSessionAsync } from "@/lib/utils/env";
import { apiGet } from "./client";
import type { ReportSummary, ResearchReport } from "@/lib/types";
import { buildReport, buildReportSummaries } from "@/lib/mock/reports";

interface BackendReportSummary {
  id?: string;
  ticker?: string;
  company?: string;
  companyName?: string;
  createdAt?: string;
  generatedAt?: string;
  horizon?: string;
  horizonDays?: number;
  overallSignal?: "UP" | "DOWN";
  probability?: number;
  confidence?: string;
  model?: string;
  modelName?: string;
  [key: string]: unknown;
}

interface BackendReportDetail extends BackendReportSummary {
  summary?: string;
  executiveSummary?: string;
  contentMarkdown?: string;
  prediction?: unknown;
  critic?: unknown;
  analysis?: unknown;
  sources?: unknown[];
}

export async function getReports(): Promise<ReportSummary[]> {
  const fallback = buildReportSummaries();
  if (await isDemoSessionAsync()) return fallback;

  try {
    const data = await apiGet<BackendReportSummary[]>("/reports");
    if (Array.isArray(data) && data.length > 0) {
      return data.map((r, i) => {
        const fb = fallback[i] || fallback[0];
        return {
          id: r.id || fb.id,
          ticker: r.ticker || fb.ticker,
          company: r.company || r.companyName || fb.company,
          generatedAt: r.generatedAt || r.createdAt || fb.generatedAt,
          horizonDays: r.horizonDays ?? (r.horizon ? parseInt(r.horizon, 10) || 5 : 5),
          model: r.model || r.modelName || fb.model,
          probability: r.probability ?? fb.probability,
          overallSignal: r.overallSignal || fb.overallSignal,
          agentStatus: "completed",
        };
      });
    }
  } catch (err) {
    console.warn("Could not load /reports from backend:", err);
  }

  return fallback;
}

export async function getReport(id: string): Promise<ResearchReport | null> {
  const fallback = buildReport(id);
  if (await isDemoSessionAsync()) return fallback;

  try {
    const raw = await apiGet<BackendReportDetail>(`/reports/${id}`);
    if (raw && fallback) {
      return {
        ...fallback,
        id: raw.id || fallback.id,
        ticker: raw.ticker || fallback.ticker,
        company: raw.company || raw.companyName || fallback.company,
        generatedAt: raw.generatedAt || raw.createdAt || fallback.generatedAt,
        horizonDays: raw.horizonDays ?? (raw.horizon ? parseInt(raw.horizon, 10) || 5 : 5),
        model: raw.model || raw.modelName || fallback.model,
        probability: raw.probability ?? fallback.probability,
        overallSignal: raw.overallSignal || fallback.overallSignal,
        executiveSummary: raw.executiveSummary || raw.summary || fallback.executiveSummary,
      };
    }
  } catch (err) {
    console.warn(`Could not load /reports/${id} from backend:`, err);
  }

  return fallback;
}
