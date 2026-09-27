export type NewsCategory =
  | "Earnings"
  | "Management"
  | "Regulatory"
  | "Product"
  | "M&A"
  | "Macro"
  | "Analyst"
  | "General";

export type Sentiment = "Positive" | "Neutral" | "Negative";

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: string;
  category: NewsCategory;
  sentiment: Sentiment;
  sentimentScore: number; // -1..1
  ticker: string;
}

export interface SentimentPoint {
  t: string;
  positive: number;
  neutral: number;
  negative: number;
  volume: number;
}

export interface NewsAnalysis {
  ticker: string;
  articles: NewsArticle[];
  timeline: SentimentPoint[];
  distribution: { positive: number; neutral: number; negative: number };
}
