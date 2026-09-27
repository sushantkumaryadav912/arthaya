export type ModelName =
  | "Logistic Regression"
  | "Random Forest"
  | "XGBoost"
  | "Ensemble";

export interface ClassificationMetrics {
  accuracy: number | null;
  precision: number | null;
  recall: number | null;
  f1: number | null;
  rocAuc: number | null;
  logLoss: number | null;
  brier: number | null;
}

export interface RegressionMetrics {
  mae: number | null;
  rmse: number | null;
}

export interface ModelPerformance {
  model: ModelName;
  classification: ClassificationMetrics;
  regression: RegressionMetrics;
}

export interface WalkForwardPeriod {
  period: string; // e.g. "2024 Q1"
  trainWindow: string;
  testWindow: string;
  accuracy: number | null;
  rocAuc: number | null;
}

export interface BaselineComparison {
  name:
    | "Naive Baseline"
    | "Technical-only"
    | "Fundamental-only"
    | "News-only"
    | "Multi-source";
  accuracy: number | null;
  rocAuc: number | null;
  note?: string;
}

export interface ModelPerformanceReport {
  models: ModelPerformance[];
  walkForward: WalkForwardPeriod[];
  baselines: BaselineComparison[];
  /** null when no evaluation data exists → UI shows "No evaluation data available." */
  evaluatedAt: string | null;
}
