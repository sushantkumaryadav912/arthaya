import { DEMO_MODE } from "@/lib/utils/env";
import { apiGet } from "./client";
import type { HistoricalAnalysis, Prediction } from "@/lib/types";
import { allPredictions, buildHistorical, buildPrediction } from "@/lib/mock/predictions";

interface BackendPrediction {
  id?: string;
  ticker?: string;
  horizon?: string;
  direction?: "UP" | "DOWN";
  probability?: number;
  model?: string;
  model_version?: string;
  predicted_at?: string;
  breakdown?: { model: "Logistic Regression" | "Random Forest" | "XGBoost" | "Ensemble"; direction: "UP" | "DOWN"; probability: number }[];
  [key: string]: unknown;
}

interface BackendHistorical {
  analogues?: {
    date: string;
    similarity: number;
    return_1d?: string;
    return_5d?: string;
    return_20d?: string;
  }[];
  mean_return_5d?: number;
  up_frequency_5d?: number;
  interpretation?: string;
  [key: string]: unknown;
}

export async function getPrediction(ticker: string, horizonDays = 5): Promise<Prediction | null> {
  const fallback = buildPrediction(ticker, horizonDays);
  if (DEMO_MODE) return fallback;

  try {
    const raw = await apiGet<BackendPrediction>(`/predictions/${ticker}?horizon=${horizonDays}D`);
    if (!raw) return fallback;

    const prob = raw.probability ?? fallback.probability;
    const direction = raw.direction ?? fallback.direction;

    return {
      ticker: raw.ticker || ticker.toUpperCase(),
      direction,
      probability: prob,
      horizonDays: raw.horizon ? parseInt(raw.horizon, 10) || horizonDays : horizonDays,
      expectedReturn: fallback.expectedReturn,
      model: raw.model ? `${raw.model} ${raw.model_version || ""}`.trim() : fallback.model,
      calibration: "Good",
      confidence: prob >= 0.75 ? "High" : prob >= 0.6 ? "Moderate" : "Low",
      breakdown: raw.breakdown && raw.breakdown.length > 0 ? raw.breakdown : fallback.breakdown,
      generatedAt: raw.predicted_at || new Date().toISOString(),
    };
  } catch (err) {
    console.warn(`Could not load /predictions/${ticker} from backend:`, err);
    return fallback;
  }
}

export async function getAllPredictions(horizonDays = 5): Promise<Prediction[]> {
  if (DEMO_MODE) return allPredictions(horizonDays);

  const universe = ["AAPL", "NVDA", "TSLA", "MSFT", "RELIANCE"];
  try {
    const results = await Promise.all(
      universe.map((t) => getPrediction(t, horizonDays)),
    );
    const valid = results.filter((p): p is Prediction => Boolean(p));
    if (valid.length > 0) return valid;
  } catch (err) {
    console.warn("Could not load batch predictions from backend:", err);
  }

  return allPredictions(horizonDays);
}

export async function getHistorical(ticker: string): Promise<HistoricalAnalysis | null> {
  const fallback = buildHistorical(ticker);
  if (DEMO_MODE) return fallback;

  try {
    const raw = await apiGet<BackendHistorical>(`/stocks/${ticker}/historical`);
    if (!raw || !raw.analogues || raw.analogues.length === 0) return fallback;

    return {
      ticker: ticker.toUpperCase(),
      currentState: fallback.currentState,
      matches: raw.analogues.map((a, i) => ({
        period: a.date,
        similarity: a.similarity,
        momentum: a.similarity > 0.85 ? "positive" : "neutral",
        volatility: "neutral",
        volume: "neutral",
        forwardReturn: parseFloat(a.return_5d?.replace("%", "") ?? "1.8"),
        forwardWindow: "5D",
      })),
    };
  } catch (err) {
    console.warn(`Could not load /stocks/${ticker}/historical from backend:`, err);
    return fallback;
  }
}
