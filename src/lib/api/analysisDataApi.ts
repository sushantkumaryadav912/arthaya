import { DEMO_MODE } from "@/lib/utils/env";
import { apiGet } from "./client";
import type {
  FundamentalAnalysis,
  NewsAnalysis,
  TechnicalAnalysis,
  TechnicalIndicator,
} from "@/lib/types";
import { buildTechnical } from "@/lib/mock/technical";
import { buildFundamentals } from "@/lib/mock/fundamentals";
import { buildNews } from "@/lib/mock/news";

interface BackendTechnical {
  rsi_14?: number;
  sma_20?: number;
  sma_50?: number;
  sma_200?: number;
  macd?: number;
  macd_signal?: number;
  atr_14?: number;
  bollinger_upper?: number;
  bollinger_lower?: number;
  momentum_20d?: number;
  interpretation?: string;
  [key: string]: unknown;
}

interface BackendFundamentals {
  revenue?: number;
  net_income?: number;
  eps?: number;
  pe_ratio?: number;
  pb_ratio?: number;
  ps_ratio?: number;
  roe?: number;
  roa?: number;
  debt_to_equity?: number;
  free_cash_flow?: number;
  revenue_growth_yoy?: number;
  eps_growth_yoy?: number;
  interpretation?: string;
  [key: string]: unknown;
}

interface BackendNews {
  sentiment_score?: number;
  overall_sentiment?: string;
  article_count?: number;
  positive_events?: number;
  negative_events?: number;
  neutral_events?: number;
  interpretation?: string;
  articles?: unknown[];
  [key: string]: unknown;
}

export async function getTechnical(ticker: string): Promise<TechnicalAnalysis | null> {
  const fallback = buildTechnical(ticker);
  if (DEMO_MODE) return fallback;

  try {
    const raw = await apiGet<BackendTechnical>(`/stocks/${ticker}/technical`);
    if (!raw || !fallback) return fallback;

    // Apply live indicators from backend
    const indicators: TechnicalIndicator[] = fallback.indicators.map((ind) => {
      if (ind.key === "rsi" && raw.rsi_14 !== undefined) {
        return {
          ...ind,
          value: raw.rsi_14,
          interpretation: raw.rsi_14 > 70 ? "Overbought territory" : raw.rsi_14 < 30 ? "Oversold bounce watch" : "Neutral range",
          status: raw.rsi_14 > 70 ? "negative" : raw.rsi_14 < 30 ? "positive" : "neutral",
        };
      }
      if (ind.key === "macd" && raw.macd !== undefined) {
        return {
          ...ind,
          value: raw.macd,
          interpretation: raw.macd > 0 ? "Bullish trend divergence" : "Bearish trend pressure",
          status: raw.macd > 0 ? "positive" : "negative",
        };
      }
      if (ind.key === "atr" && raw.atr_14 !== undefined) {
        return {
          ...ind,
          value: raw.atr_14,
          interpretation: `Average True Range $${raw.atr_14.toFixed(2)}`,
        };
      }
      return ind;
    });

    return {
      ...fallback,
      asOf: new Date().toISOString(),
      indicators,
    };
  } catch (err) {
    console.warn(`Could not load /stocks/${ticker}/technical from backend:`, err);
    return fallback;
  }
}

export async function getFundamentals(ticker: string): Promise<FundamentalAnalysis | null> {
  const fallback = buildFundamentals(ticker);
  if (DEMO_MODE) return fallback;

  try {
    const raw = await apiGet<BackendFundamentals>(`/stocks/${ticker}/fundamentals`);
    if (!raw || !fallback) return fallback;

    return {
      ...fallback,
      ratios: fallback.ratios.map((r) => {
        if (r.key === "pe" && raw.pe_ratio !== undefined) return { ...r, value: raw.pe_ratio };
        if (r.key === "pb" && raw.pb_ratio !== undefined) return { ...r, value: raw.pb_ratio };
        if (r.key === "ps" && raw.ps_ratio !== undefined) return { ...r, value: raw.ps_ratio };
        if (r.key === "roe" && raw.roe !== undefined) return { ...r, value: raw.roe };
        if (r.key === "debt_equity" && raw.debt_to_equity !== undefined) return { ...r, value: raw.debt_to_equity };
        return r;
      }),
    };
  } catch (err) {
    console.warn(`Could not load /stocks/${ticker}/fundamentals from backend:`, err);
    return fallback;
  }
}

export async function getNews(ticker: string): Promise<NewsAnalysis | null> {
  const fallback = buildNews(ticker);
  if (DEMO_MODE) return fallback;

  try {
    const raw = await apiGet<BackendNews>(`/stocks/${ticker}/news`);
    if (!raw || !fallback) return fallback;

    return {
      ...fallback,
      sentimentScore: raw.sentiment_score ?? fallback.sentimentScore,
      summary: raw.interpretation ?? fallback.summary,
    };
  } catch (err) {
    console.warn(`Could not load /stocks/${ticker}/news from backend:`, err);
    return fallback;
  }
}
