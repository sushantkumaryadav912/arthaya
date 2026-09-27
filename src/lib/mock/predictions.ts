import type {
  ConfidenceLabel,
  Direction,
  HistoricalAnalysis,
  ModelVote,
  Prediction,
} from "@/lib/types";
import { findSeed, UNIVERSE } from "./stocks";
import { isoDaysAgo, mulberry32, round, seedFrom } from "./generators";

function confidenceFor(prob: number): ConfidenceLabel {
  if (prob >= 0.78) return "High";
  if (prob >= 0.68) return "Medium-High";
  if (prob >= 0.58) return "Moderate";
  return "Low";
}

export function buildPrediction(ticker: string, horizonDays = 5): Prediction | null {
  const seed = findSeed(ticker);
  if (!seed) return null;
  const rand = mulberry32(seedFrom(seed.ticker + "pred" + horizonDays));

  const lr = round(0.55 + rand() * 0.22, 2);
  const rf = round(0.58 + rand() * 0.22, 2);
  const xgb = round(0.6 + rand() * 0.22, 2);
  const ens = round((lr + rf + xgb) / 3, 2);
  const direction: Direction = ens >= 0.55 ? "UP" : ens <= 0.45 ? "DOWN" : "NEUTRAL";

  const vote = (model: ModelVote["model"], p: number): ModelVote => ({
    model,
    direction: p >= 0.5 ? "UP" : "DOWN",
    probability: p,
  });

  return {
    ticker: seed.ticker,
    direction,
    probability: ens,
    horizonDays,
    expectedReturn: round((ens - 0.5) * 8, 2),
    model: "Ensemble",
    calibration: rand() > 0.3 ? "Good" : "Moderate",
    confidence: confidenceFor(ens),
    breakdown: [
      vote("Logistic Regression", lr),
      vote("Random Forest", rf),
      vote("XGBoost", xgb),
      vote("Ensemble", ens),
    ],
    generatedAt: isoDaysAgo(0),
  };
}

export function allPredictions(horizonDays = 5): Prediction[] {
  return UNIVERSE.map((s) => buildPrediction(s.ticker, horizonDays)!).filter(Boolean);
}

export function buildHistorical(ticker: string): HistoricalAnalysis | null {
  const seed = findSeed(ticker);
  if (!seed) return null;
  const rand = mulberry32(seedFrom(seed.ticker + "hist"));
  const periods = ["March 2023", "October 2024", "July 2022", "January 2024", "May 2021"];
  const matches = periods
    .map((period) => ({
      period,
      similarity: round(0.6 + rand() * 0.28, 2),
      momentum: (rand() > 0.5 ? "positive" : "neutral") as HistoricalAnalysis["matches"][number]["momentum"],
      volatility: (rand() > 0.5 ? "positive" : "negative") as HistoricalAnalysis["matches"][number]["volatility"],
      volume: (rand() > 0.5 ? "positive" : "neutral") as HistoricalAnalysis["matches"][number]["volume"],
      forwardReturn: round((rand() - 0.4) * 12, 2),
      forwardWindow: "5 trading days",
    }))
    .sort((a, b) => b.similarity - a.similarity);

  return {
    ticker: seed.ticker,
    currentState: {
      momentum: "positive",
      volatility: "positive",
      volume: "positive",
    },
    matches,
  };
}
