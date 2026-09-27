import type {
  NewsAnalysis,
  NewsArticle,
  NewsCategory,
  Sentiment,
} from "@/lib/types";
import { findSeed } from "./stocks";
import { isoHoursAgo, mulberry32, round, seedFrom } from "./generators";

const CATEGORIES: NewsCategory[] = [
  "Earnings", "Product", "Analyst", "Regulatory", "Management", "M&A", "Macro", "General",
];

/** Demo publishers — clearly fictional so we never impersonate a real source. */
const DEMO_SOURCES = [
  "Arthaya Demo Wire",
  "Sample Markets Daily",
  "Demo Financial Times",
  "Mock Analyst Desk",
];

const HEADLINES: Record<NewsCategory, string> = {
  Earnings: "reports quarterly results in line with expectations (demo)",
  Product: "unveils next-generation product roadmap (demo)",
  Analyst: "coverage updated by demo research desk (demo)",
  Regulatory: "responds to regulatory review filing (demo)",
  Management: "announces leadership team update (demo)",
  "M&A": "explores strategic partnership opportunities (demo)",
  Macro: "moves with broader sector on macro data (demo)",
  General: "featured in weekly sector roundup (demo)",
};

export function buildNews(ticker: string): NewsAnalysis | null {
  const seed = findSeed(ticker);
  if (!seed) return null;
  const rand = mulberry32(seedFrom(seed.ticker + "news"));

  const articles: NewsArticle[] = Array.from({ length: 12 }).map((_, i) => {
    const category = CATEGORIES[Math.floor(rand() * CATEGORIES.length)];
    const score = round((rand() - 0.45) * 1.6, 2);
    const sentiment: Sentiment = score > 0.2 ? "Positive" : score < -0.2 ? "Negative" : "Neutral";
    const src = DEMO_SOURCES[Math.floor(rand() * DEMO_SOURCES.length)];
    return {
      id: `${seed.ticker}-n${i}`,
      title: `${seed.name} ${HEADLINES[category]}`,
      summary:
        "This is clearly-marked demo content used to illustrate the news & sentiment layer. Real deployments populate source, url, published_at, summary, sentiment and sentiment_score from configured providers.",
      source: src,
      url: "#",
      publishedAt: isoHoursAgo(Math.floor(rand() * 72)),
      category,
      sentiment,
      sentimentScore: score,
      ticker: seed.ticker,
    };
  });

  const timeline = Array.from({ length: 14 }).map((_, i) => {
    const positive = Math.round(rand() * 6);
    const neutral = Math.round(rand() * 5);
    const negative = Math.round(rand() * 4);
    return {
      t: isoHoursAgo((14 - i) * 12),
      positive,
      neutral,
      negative,
      volume: positive + neutral + negative,
    };
  });

  const distribution = articles.reduce(
    (acc, a) => {
      if (a.sentiment === "Positive") acc.positive++;
      else if (a.sentiment === "Negative") acc.negative++;
      else acc.neutral++;
      return acc;
    },
    { positive: 0, neutral: 0, negative: 0 },
  );

  return { ticker: seed.ticker, articles, timeline, distribution };
}
