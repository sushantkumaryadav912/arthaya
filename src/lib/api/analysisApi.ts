import { DEMO_MODE } from "@/lib/utils/env";
import { apiGet } from "./client";
import type { AnalysisRun, AnalysisHorizon, AnalysisDepth } from "@/lib/types";
import { buildCompletedRun } from "@/lib/mock/analysis";

/** Fetch a completed run (demo builds it synchronously). */
export async function getAnalysis(
  ticker: string,
  horizon: AnalysisHorizon = "5D",
  depth: AnalysisDepth = "standard",
): Promise<AnalysisRun | null> {
  if (DEMO_MODE) return buildCompletedRun(ticker, horizon, depth);
  return apiGet<AnalysisRun>(`/analysis/${ticker}?horizon=${horizon}&depth=${depth}`);
}
