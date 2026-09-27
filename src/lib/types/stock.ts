import type { Direction, Exchange } from "./common";

export interface PricePoint {
  t: string; // ISO timestamp
  price: number;
}

export interface Candle {
  t: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketIndex {
  id: string;
  name: string;
  region: "US" | "IN";
  value: number;
  change: number;
  changePercent: number;
  spark: number[];
}

/** Lightweight record for search results & watchlist rows. */
export interface StockSummary {
  ticker: string;
  name: string;
  exchange: Exchange;
  price: number;
  change: number;
  changePercent: number;
  volume?: number;
  rsi?: number;
  trend?: "up" | "down" | "flat";
  prediction?: Direction;
  probability?: number; // 0..1
  lastAnalysis?: string;
}

export interface PerformanceStat {
  period: "1D" | "1W" | "1M" | "3M" | "6M" | "1Y" | "3Y" | "5Y";
  changePercent: number | null;
}

/** Full overview metrics for the stock detail page. */
export interface StockOverview {
  ticker: string;
  name: string;
  exchange: Exchange;
  currency: string;
  price: number | null;
  change: number | null;
  changePercent: number | null;
  marketStatus: "open" | "closed" | "pre" | "after" | "unknown";
  week52High: number | null;
  week52Low: number | null;
  marketCap: number | null;
  peRatio: number | null;
  eps: number | null;
  volume: number | null;
  avgVolume: number | null;
  beta: number | null;
  dividendYield: number | null;
  performance: PerformanceStat[];
  series: PricePoint[];
  candles: Candle[];
}
