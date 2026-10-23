import type { AnalysisDepth, AnalysisHorizon } from "@/lib/types";

const VALID_HORIZONS: AnalysisHorizon[] = ["1D", "5D", "20D"];
const VALID_DEPTHS: AnalysisDepth[] = ["quick", "standard", "deep"];

const TICKER_PATTERN = /^[A-Z0-9.\-^=&_]{1,20}$/;

export function validateAnalysisInput(
  tickerInput: string,
  horizonInput: string | null,
  depthInput: string | null,
) {
  const ticker = tickerInput.trim().toUpperCase();

  if (!TICKER_PATTERN.test(ticker)) {
    return {
      ok: false as const,
      error: "Ticker must contain 1–15 valid ticker characters.",
    };
  }

  const horizon = horizonInput ?? "5D";
  if (!VALID_HORIZONS.includes(horizon as AnalysisHorizon)) {
    return {
      ok: false as const,
      error: "Invalid horizon. Allowed values: 1D, 5D, 20D.",
    };
  }

  const depth = depthInput ?? "standard";
  if (!VALID_DEPTHS.includes(depth as AnalysisDepth)) {
    return {
      ok: false as const,
      error: "Invalid depth. Allowed values: quick, standard, deep.",
    };
  }

  return {
    ok: true as const,
    value: {
      ticker,
      horizon: horizon as AnalysisHorizon,
      depth: depth as AnalysisDepth,
    },
  };
}
