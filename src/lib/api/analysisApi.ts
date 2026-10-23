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
  const fallback = buildCompletedRun(ticker, horizon, depth) || buildCompletedRun("AAPL", horizon, depth);
  if (await isDemoSessionAsync()) return fallback;

  try {
    const data = await apiGet<any>(`/analysis/${ticker}?horizon=${horizon}&depth=${depth}`);
    if (data && typeof data === "object") {
      return {
        ...(fallback || {}),
        ...data,
        ticker: data.ticker || fallback?.ticker || ticker.toUpperCase(),
        horizon: data.horizon || fallback?.horizon || horizon,
        depth: data.depth || fallback?.depth || depth,
        status: data.status || fallback?.status || "completed",
        agents:
          Array.isArray(data.agents) && data.agents.length > 0
            ? data.agents
            : fallback?.agents || [],
        prediction: data.prediction ? { ...(fallback?.prediction || {}), ...data.prediction } : fallback?.prediction,
        critic: data.critic ? { ...(fallback?.critic || {}), ...data.critic } : fallback?.critic,
        summary: data.summary ? { ...(fallback?.summary || {}), ...data.summary } : fallback?.summary,
      } as AnalysisRun;
    }
  } catch (err) {
    console.warn(`Could not load /analysis/${ticker} from backend:`, err);
  }

  return fallback;
}
