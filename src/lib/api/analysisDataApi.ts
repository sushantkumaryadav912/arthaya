import { DEMO_MODE } from "@/lib/utils/env";
import { apiGet } from "./client";
import type { FundamentalAnalysis, NewsAnalysis, TechnicalAnalysis } from "@/lib/types";
import { buildTechnical } from "@/lib/mock/technical";
import { buildFundamentals } from "@/lib/mock/fundamentals";
import { buildNews } from "@/lib/mock/news";

export async function getTechnical(ticker: string): Promise<TechnicalAnalysis | null> {
  if (DEMO_MODE) return buildTechnical(ticker);
  return apiGet<TechnicalAnalysis>(`/stocks/${ticker}/technical`);
}

export async function getFundamentals(ticker: string): Promise<FundamentalAnalysis | null> {
  if (DEMO_MODE) return buildFundamentals(ticker);
  return apiGet<FundamentalAnalysis>(`/stocks/${ticker}/fundamentals`);
}

export async function getNews(ticker: string): Promise<NewsAnalysis | null> {
  if (DEMO_MODE) return buildNews(ticker);
  return apiGet<NewsAnalysis>(`/stocks/${ticker}/news`);
}
