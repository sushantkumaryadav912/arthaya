import type { SignalClass } from "./common";
import type { PricePoint } from "./stock";

export interface TechnicalIndicator {
  key: string;
  label: string;
  value: number | null;
  unit?: string;
  interpretation: string;
  status: SignalClass;
  /** Optional historical context sentence. */
  context?: string;
}

export interface MacdPoint {
  t: string;
  macd: number;
  signal: number;
  histogram: number;
}

export interface BollingerPoint {
  t: string;
  price: number;
  upper: number;
  middle: number;
  lower: number;
}

export interface TechnicalSignalSummary {
  momentum: SignalClass;
  trend: SignalClass;
  volatility: SignalClass;
  volume: SignalClass;
  supportResistance: SignalClass;
}

export interface TechnicalAnalysis {
  ticker: string;
  asOf: string;
  indicators: TechnicalIndicator[];
  summary: TechnicalSignalSummary;
  priceWithSma: (PricePoint & { sma20?: number; sma50?: number; sma200?: number })[];
  bollinger: BollingerPoint[];
  macd: MacdPoint[];
  rsiSeries: { t: string; rsi: number }[];
  volumeSeries: { t: string; volume: number }[];
  volatilitySeries: { t: string; volatility: number }[];
}
