/** Shared primitive types used across domains. */

export type Tone = "positive" | "negative" | "neutral" | "warning";

/** Analytical classification (NOT an investment recommendation). */
export type SignalClass = "positive" | "neutral" | "negative" | "mixed";

export type Direction = "UP" | "DOWN" | "NEUTRAL";

export type Exchange = "NASDAQ" | "NYSE" | "NSE" | "BSE";

export type ConfidenceLabel = "Low" | "Moderate" | "Medium-High" | "High";

/** Provenance tag so the UI can distinguish data types (project.md §32). */
export type Provenance =
  | "market-data"
  | "calculated"
  | "ml-prediction"
  | "ai-interpretation"
  | "backtest"
  | "demo";

export interface DataSourceInfo {
  provider: string;
  dataType: string;
  lastUpdate?: string;
  status: "connected" | "configured" | "not-configured" | "degraded";
  coverage?: string;
}

/** Standard API envelope from the route-handler backend. */
export interface ApiResult<T> {
  data: T;
  demo: boolean;
  generatedAt: string;
}
