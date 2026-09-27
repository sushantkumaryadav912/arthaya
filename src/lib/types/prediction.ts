import type { ConfidenceLabel, Direction, SignalClass } from "./common";

/** A single model's probabilistic view. */
export interface ModelVote {
  model: "Logistic Regression" | "Random Forest" | "XGBoost" | "Ensemble";
  direction: Direction;
  probability: number; // 0..1 — MODEL PROBABILITY, never "certainty"
}

export interface Prediction {
  ticker: string;
  direction: Direction;
  probability: number; // 0..1
  horizonDays: number;
  expectedReturn?: number | null; // percent
  model: string;
  calibration?: "Good" | "Moderate" | "Poor" | null;
  confidence: ConfidenceLabel;
  breakdown: ModelVote[];
  generatedAt: string;
}

/** Historical-comparison analysis. */
export interface HistoricalMatch {
  period: string;
  similarity: number; // 0..1
  momentum: SignalClass;
  volatility: SignalClass;
  volume: SignalClass;
  /** Observed forward move AFTER the analog period (historical result, not a forecast). */
  forwardReturn: number; // percent
  forwardWindow: string;
}

export interface HistoricalAnalysis {
  ticker: string;
  currentState: {
    momentum: SignalClass;
    volatility: SignalClass;
    volume: SignalClass;
  };
  matches: HistoricalMatch[];
}
