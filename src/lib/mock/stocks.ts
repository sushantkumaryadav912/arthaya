import type {
  Candle,
  Exchange,
  PerformanceStat,
  PricePoint,
  StockOverview,
  StockSummary,
} from "@/lib/types";
import { isoDaysAgo, mulberry32, priceSeries, round, seedFrom } from "./generators";

interface Seed {
  ticker: string;
  name: string;
  exchange: Exchange;
  currency: string;
  base: number;
  sector: string;
}

/** Demo universe (project.md search examples). */
export const UNIVERSE: Seed[] = [
  { ticker: "AAPL", name: "Apple Inc.", exchange: "NASDAQ", currency: "USD", base: 228, sector: "Technology" },
  { ticker: "MSFT", name: "Microsoft Corporation", exchange: "NASDAQ", currency: "USD", base: 421, sector: "Technology" },
  { ticker: "NVDA", name: "NVIDIA Corporation", exchange: "NASDAQ", currency: "USD", base: 134, sector: "Semiconductors" },
  { ticker: "TSLA", name: "Tesla, Inc.", exchange: "NASDAQ", currency: "USD", base: 248, sector: "Automotive" },
  { ticker: "AMZN", name: "Amazon.com, Inc.", exchange: "NASDAQ", currency: "USD", base: 186, sector: "Consumer" },
  { ticker: "GOOGL", name: "Alphabet Inc.", exchange: "NASDAQ", currency: "USD", base: 168, sector: "Technology" },
  { ticker: "RELIANCE", name: "Reliance Industries Ltd.", exchange: "NSE", currency: "INR", base: 2950, sector: "Conglomerate" },
  { ticker: "TCS", name: "Tata Consultancy Services Ltd.", exchange: "NSE", currency: "INR", base: 4120, sector: "IT Services" },
  { ticker: "INFY", name: "Infosys Ltd.", exchange: "NSE", currency: "INR", base: 1880, sector: "IT Services" },
  { ticker: "HDFCBANK", name: "HDFC Bank Ltd.", exchange: "NSE", currency: "INR", base: 1685, sector: "Banking" },
  { ticker: "M&M", name: "Mahindra & Mahindra Ltd.", exchange: "NSE", currency: "INR", base: 2840, sector: "Automotive" },
  { ticker: "TATAMOTORS", name: "Tata Motors Ltd.", exchange: "NSE", currency: "INR", base: 890, sector: "Automotive" },
];

export function findSeed(ticker: string): Seed {
  const normalized = ticker.trim().toUpperCase();
  const existing = UNIVERSE.find((s) => s.ticker === normalized);
  if (existing) return existing;

  // Universal dynamic seed generator for custom/unlisted tickers
  const rand = mulberry32(seedFrom(normalized + "_seed"));
  const isIndian =
    normalized.endsWith(".NS") ||
    normalized.endsWith(".BO") ||
    ["TCS", "INFY", "WIPRO", "ITC", "SBIN", "BHARTIARTL", "KOTAKBANK", "M&M", "TATAMOTORS", "BAJFINANCE"].includes(normalized);

  const basePrice = isIndian ? round(500 + rand() * 3500, 2) : round(25 + rand() * 480, 2);
  const sectors = [
    "Technology",
    "Semiconductors",
    "Consumer Discretionary",
    "Financial Services",
    "Healthcare",
    "Energy",
    "Industrial Goods",
  ];
  const sector = sectors[Math.floor(rand() * sectors.length)];

  return {
    ticker: normalized,
    name: `${normalized} Corp.`,
    exchange: isIndian ? "NSE" : "NASDAQ",
    currency: isIndian ? "INR" : "USD",
    base: basePrice,
    sector,
  };
}

export function searchUniverse(q: string): Seed[] {
  const query = q.trim().toLowerCase();
  if (!query) return UNIVERSE;
  return UNIVERSE.filter(
    (s) =>
      s.ticker.toLowerCase().includes(query) ||
      s.name.toLowerCase().includes(query),
  );
}

function dailyChange(seed: Seed): { price: number; change: number; pct: number } {
  const series = priceSeries(seed.ticker, 2, seed.base);
  const prev = series[0];
  const price = series[1];
  const change = round(price - prev);
  const pct = round((change / prev) * 100);
  return { price: round(price), change, pct };
}

export function toSummary(seed: Seed): StockSummary {
  const { price, change, pct } = dailyChange(seed);
  const rand = mulberry32(seedFrom(seed.ticker + "sum"));
  const rsi = round(35 + rand() * 45, 1);
  const prob = round(0.55 + rand() * 0.25, 2);
  return {
    ticker: seed.ticker,
    name: seed.name,
    exchange: seed.exchange,
    price,
    change,
    changePercent: pct,
    volume: Math.round((5 + rand() * 60) * 1e6),
    rsi,
    trend: pct > 0.3 ? "up" : pct < -0.3 ? "down" : "flat",
    prediction: pct >= 0 ? "UP" : "DOWN",
    probability: prob,
    lastAnalysis: isoDaysAgo(Math.floor(rand() * 4)),
  };
}

export function allSummaries(): StockSummary[] {
  return UNIVERSE.map(toSummary);
}

function buildCandles(ticker: string, closes: number[]): Candle[] {
  const rand = mulberry32(seedFrom(ticker + "ohlc"));
  return closes.map((close, i) => {
    const open = i === 0 ? close : closes[i - 1];
    const spread = close * (0.005 + rand() * 0.015);
    const high = round(Math.max(open, close) + spread * rand());
    const low = round(Math.min(open, close) - spread * rand());
    return {
      t: isoDaysAgo(closes.length - i),
      open: round(open),
      high,
      low,
      close: round(close),
      volume: Math.round((4 + rand() * 50) * 1e6),
    };
  });
}

function perf(closes: number[]): PerformanceStat[] {
  const last = closes[closes.length - 1];
  const at = (n: number) => {
    const idx = closes.length - 1 - n;
    if (idx < 0) return null;
    return round(((last - closes[idx]) / closes[idx]) * 100);
  };
  return [
    { period: "1D", changePercent: at(1) },
    { period: "1W", changePercent: at(5) },
    { period: "1M", changePercent: at(21) },
    { period: "3M", changePercent: at(63) },
    { period: "6M", changePercent: at(126) },
    { period: "1Y", changePercent: at(251) },
    { period: "3Y", changePercent: null },
    { period: "5Y", changePercent: null },
  ];
}

export function buildOverview(ticker: string): StockOverview | null {
  const seed = findSeed(ticker);
  if (!seed) return null;
  const closes = priceSeries(seed.ticker, 260, seed.base * 0.82);
  const candles = buildCandles(seed.ticker, closes);
  const series: PricePoint[] = closes.map((price, i) => ({
    t: isoDaysAgo(closes.length - i),
    price,
  }));
  const last = closes[closes.length - 1];
  const prev = closes[closes.length - 2];
  const rand = mulberry32(seedFrom(seed.ticker + "ov"));
  return {
    ticker: seed.ticker,
    name: seed.name,
    exchange: seed.exchange,
    currency: seed.currency,
    price: round(last),
    change: round(last - prev),
    changePercent: round(((last - prev) / prev) * 100),
    marketStatus: "unknown",
    week52High: round(Math.max(...closes) * 1.02),
    week52Low: round(Math.min(...closes) * 0.98),
    marketCap: Math.round((0.4 + rand() * 3) * 1e12),
    peRatio: round(18 + rand() * 22, 1),
    eps: round(3 + rand() * 9, 2),
    volume: Math.round((5 + rand() * 55) * 1e6),
    avgVolume: Math.round((8 + rand() * 45) * 1e6),
    beta: round(0.7 + rand() * 0.9, 2),
    dividendYield: seed.sector === "Banking" ? round(rand() * 1.5, 2) : round(rand() * 0.9, 2),
    performance: perf(closes),
    series,
    candles,
  };
}
