import { DEMO_MODE } from "@/lib/utils/env";
import { apiGet } from "./client";
import type { HistoricalAnalysis, Prediction } from "@/lib/types";
import { allPredictions, buildHistorical, buildPrediction } from "@/lib/mock/predictions";

export async function getPrediction(ticker: string, horizonDays = 5): Promise<Prediction | null> {
  if (DEMO_MODE) return buildPrediction(ticker, horizonDays);
  return apiGet<Prediction>(`/predictions/${ticker}?horizon=${horizonDays}`);
}

export async function getAllPredictions(horizonDays = 5): Promise<Prediction[]> {
  if (DEMO_MODE) return allPredictions(horizonDays);
  return apiGet<Prediction[]>(`/predictions?horizon=${horizonDays}`);
}

export async function getHistorical(ticker: string): Promise<HistoricalAnalysis | null> {
  if (DEMO_MODE) return buildHistorical(ticker);
  return apiGet<HistoricalAnalysis>(`/stocks/${ticker}/historical`);
}
