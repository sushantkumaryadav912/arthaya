import type {
  BollingerPoint,
  MacdPoint,
  SignalClass,
  TechnicalAnalysis,
  TechnicalIndicator,
} from "@/lib/types";
import { findSeed } from "./stocks";
import { isoDaysAgo, mulberry32, priceSeries, round, seedFrom } from "./generators";

function sma(arr: number[], period: number, idx: number): number | undefined {
  if (idx < period - 1) return undefined;
  let sum = 0;
  for (let i = idx - period + 1; i <= idx; i++) sum += arr[i];
  return round(sum / period);
}

function classForRsi(rsi: number): SignalClass {
  if (rsi >= 70) return "negative";
  if (rsi <= 30) return "positive";
  if (rsi >= 55) return "positive";
  if (rsi <= 45) return "neutral";
  return "neutral";
}

export function buildTechnical(ticker: string): TechnicalAnalysis | null {
  const seed = findSeed(ticker);
  if (!seed) return null;
  const closes = priceSeries(seed.ticker, 120, seed.base * 0.9);
  const rand = mulberry32(seedFrom(seed.ticker + "tech"));

  const rsi = round(35 + rand() * 45, 1);
  const macdVal = round((rand() - 0.4) * 3, 2);
  const atr = round(seed.base * (0.01 + rand() * 0.02), 2);
  const momentum = round((rand() - 0.4) * 6, 2);
  const volatility = round(12 + rand() * 20, 1);

  const priceWithSma = closes.map((price, i) => ({
    t: isoDaysAgo(closes.length - i),
    price: round(price),
    sma20: sma(closes, 20, i),
    sma50: sma(closes, 50, i),
    sma200: sma(closes, 100, i),
  }));

  const bollinger: BollingerPoint[] = closes.slice(-60).map((price, i, arr) => {
    const mid = arr.slice(Math.max(0, i - 19), i + 1);
    const mean = mid.reduce((a, b) => a + b, 0) / mid.length;
    const sd = Math.sqrt(mid.reduce((a, b) => a + (b - mean) ** 2, 0) / mid.length);
    return {
      t: isoDaysAgo(60 - i),
      price: round(price),
      middle: round(mean),
      upper: round(mean + 2 * sd),
      lower: round(mean - 2 * sd),
    };
  });

  const macd: MacdPoint[] = closes.slice(-60).map((_, i) => {
    const m = round(Math.sin(i / 6) * 2 + (rand() - 0.5), 2);
    const s = round(m * 0.8, 2);
    return { t: isoDaysAgo(60 - i), macd: m, signal: s, histogram: round(m - s, 2) };
  });

  const rsiSeries = closes.slice(-60).map((_, i) => ({
    t: isoDaysAgo(60 - i),
    rsi: round(40 + Math.sin(i / 5) * 18 + (rand() - 0.5) * 6, 1),
  }));

  const volumeSeries = closes.slice(-60).map((_, i) => ({
    t: isoDaysAgo(60 - i),
    volume: Math.round((4 + rand() * 50) * 1e6),
  }));

  const volatilitySeries = closes.slice(-60).map((_, i) => ({
    t: isoDaysAgo(60 - i),
    volatility: round(12 + Math.sin(i / 8) * 6 + rand() * 4, 1),
  }));

  const last20 = sma(closes, 20, closes.length - 1)!;
  const last50 = sma(closes, 50, closes.length - 1)!;
  const last = closes[closes.length - 1];

  const indicators: TechnicalIndicator[] = [
    { key: "rsi", label: "RSI (14)", value: rsi, interpretation: rsi > 55 ? "Momentum positive" : rsi < 45 ? "Momentum soft" : "Momentum neutral", status: classForRsi(rsi), context: "Relative to the neutral 30–70 band." },
    { key: "macd", label: "MACD", value: macdVal, interpretation: macdVal > 0 ? "Above signal line" : "Below signal line", status: macdVal > 0 ? "positive" : "negative" },
    { key: "sma20", label: "SMA 20", value: last20, interpretation: last > last20 ? "Price above SMA 20" : "Price below SMA 20", status: last > last20 ? "positive" : "negative" },
    { key: "sma50", label: "SMA 50", value: last50, interpretation: last > last50 ? "Price above SMA 50" : "Price below SMA 50", status: last > last50 ? "positive" : "negative" },
    { key: "sma200", label: "SMA 200", value: round(seed.base * 0.85), interpretation: "Long-term trend reference", status: "neutral" },
    { key: "ema", label: "EMA (20)", value: round(last20 * 1.002), interpretation: "Short-term trend reference", status: "neutral" },
    { key: "atr", label: "ATR (14)", value: atr, interpretation: "Average true range", status: "neutral", context: "Absolute volatility in price units." },
    { key: "momentum", label: "Momentum", value: momentum, unit: "%", interpretation: momentum > 0 ? "Positive" : "Negative", status: momentum > 0 ? "positive" : "negative" },
    { key: "volatility", label: "Volatility (annualized)", value: volatility, unit: "%", interpretation: volatility > 25 ? "Elevated" : "Contained", status: volatility > 25 ? "mixed" : "neutral" },
  ];

  return {
    ticker: seed.ticker,
    asOf: new Date().toISOString(),
    indicators,
    summary: {
      momentum: momentum > 0 ? "positive" : "negative",
      trend: last > last50 ? "positive" : "negative",
      volatility: volatility > 25 ? "negative" : "neutral",
      volume: rand() > 0.5 ? "positive" : "neutral",
      supportResistance: "neutral",
    },
    priceWithSma,
    bollinger,
    macd,
    rsiSeries,
    volumeSeries,
    volatilitySeries,
  };
}
