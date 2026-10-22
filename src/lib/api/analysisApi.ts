import { isDemoSessionAsync } from "@/lib/utils/env";
import { apiGet } from "./client";
import type { AnalysisRun, AnalysisHorizon, AnalysisDepth } from "@/lib/types";
import { buildCompletedRun } from "@/lib/mock/analysis";

/** Fetch a completed analysis run from backend. */
export async function getAnalysis(
  ticker: string,
  horizon: AnalysisHorizon = "5D",
  depth: AnalysisDepth = "standard",
): Promise<AnalysisRun | null> {
  const fallback = buildCompletedRun(ticker, horizon, depth);
  if (await isDemoSessionAsync()) return fallback;

  try {
    const data = await apiGet<AnalysisRun>(`/analysis/${ticker}?horizon=${horizon}&depth=${depth}`);
    if (data) return data;
  } catch (err) {
    console.warn(`Could not load /analysis/${ticker} from backend:`, err);
  }

  return fallback;
}
