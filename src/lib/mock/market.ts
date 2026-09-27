import type { MarketIndex } from "@/lib/types";
import { mulberry32, priceSeries, round, seedFrom } from "./generators";

const INDEX_SEEDS: { id: string; name: string; region: "US" | "IN"; base: number }[] = [
  { id: "spx", name: "S&P 500", region: "US", base: 5760 },
  { id: "ndx", name: "NASDAQ", region: "US", base: 20140 },
  { id: "dji", name: "Dow Jones", region: "US", base: 42200 },
  { id: "nifty", name: "NIFTY 50", region: "IN", base: 24850 },
  { id: "sensex", name: "Sensex", region: "IN", base: 81300 },
];

export function buildIndices(): MarketIndex[] {
  return INDEX_SEEDS.map((s) => {
    const spark = priceSeries(s.id, 24, s.base, 0.006, 0.0002);
    const value = spark[spark.length - 1];
    const prev = spark[spark.length - 2];
    return {
      id: s.id,
      name: s.name,
      region: s.region,
      value: round(value),
      change: round(value - prev),
      changePercent: round(((value - prev) / prev) * 100),
      spark: spark.map((v) => round(v)),
    };
  });
}

/** AI-generated market intelligence (clearly labeled in UI). */
export function marketIntelligence() {
  const rand = mulberry32(seedFrom("market-intel-v1"));
  return {
    regime: "Moderately bullish",
    momentum: "Positive",
    volatility: "Elevated",
    newsSentiment: "Neutral-positive",
    confidence: round(0.6 + rand() * 0.12, 2),
    observations: [
      "Technology sector showing positive momentum.",
      "Volatility remains above its recent average.",
      "Earnings-related news activity is elevated.",
    ],
    generatedAt: new Date().toISOString(),
  };
}
