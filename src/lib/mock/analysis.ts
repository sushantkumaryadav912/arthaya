
import type {
  AgentStatus,
  AIResearchSummary,
  AnalysisDepth,
  AnalysisEvent,
  AnalysisHorizon,
  AnalysisRun,
  CriticValidation,
  SignalClass,
} from "@/lib/types";
import { AGENT_ORDER, AGENT_PIPELINE } from "@/lib/constants/agents";
import { findSeed } from "./stocks";
import { buildPrediction } from "./predictions";
import { mulberry32, round, seedFrom } from "./generators";

export const HORIZON_DAYS: Record<AnalysisHorizon, number> = {
  "1D": 1,
  "5D": 5,
  "20D": 20,
};

const AGENT_MESSAGE: Record<string, string> = {
  orchestrator: "Analysis initialized",
  market: "Market data retrieved",
  technical: "Technical indicators calculated",
  fundamental: "Fundamental analysis completed",
  news: "News sentiment completed",
  historical: "Historical comparison completed",
  prediction: "Prediction model completed",
  critic: "Critic validation completed",
  synthesis: "Final synthesis completed",
};

function clock(sec: number): string {
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}

/** Ordered event list for the live timeline / SSE stream. */
export function buildEvents(analysisId: string, _ticker?: string): AnalysisEvent[] {
  return AGENT_ORDER.map((agent, i) => ({
    analysisId,
    agent,
    status: "completed",
    message: AGENT_MESSAGE[agent],
    progress: 1,
    timestamp: new Date(Date.now() + i * 1000).toISOString(),
    clock: clock(i),
  }));
}

function buildCritic(ticker: string): CriticValidation {
  const rand = mulberry32(seedFrom(ticker + "critic"));
  const conflict = rand() > 0.5;

  return {
    dataQuality: round(0.88 + rand() * 0.1, 2),
    modelQuality: round(0.78 + rand() * 0.12, 2),
    sourceQuality: round(0.82 + rand() * 0.12, 2),
    signalAgreement: round(
      conflict ? 0.55 + rand() * 0.15 : 0.78 + rand() * 0.15,
      2,
    ),
    modelCalibration: round(0.8 + rand() * 0.12, 2),
    potentialLeakage: "none",
    missingData:
      rand() > 0.6 ? ["EV/EBITDA (not meaningful for sector)"] : [],
    staleData: [],
    notes: conflict
      ? [
          "High signal conflict detected between news sentiment and technical momentum.",
          "Critic reports the conflict; it does not override the model probability.",
        ]
      : ["Signals broadly aligned across sources."],
  };
}

function buildSummary(
  ticker: string,
  horizonDays: number,
): AIResearchSummary {
  const pred = buildPrediction(ticker, horizonDays)!;
  const rand = mulberry32(seedFrom(ticker + "summary"));
  const newsClass: SignalClass = rand() > 0.5 ? "negative" : "neutral";
  const conflict = newsClass === "negative" && pred.direction === "UP";

  return {
    overallSignal: pred.direction,
    probability: pred.probability,
    horizonDays,
    confidence: pred.confidence,
    marketContext:
      "Broader market regime is moderately constructive with elevated volatility (AI-generated interpretation of demo data).",
    technicalView:
      "Momentum indicators lean positive with price above key moving averages.",
    fundamentalView:
      "Growth and margins are stable; valuation is within the sector's historical range.",
    newsView:
      newsClass === "negative"
        ? "Recent news sentiment skews cautious."
        : "News sentiment is broadly neutral.",
    historicalContext:
      "Comparable historical periods produced mixed forward outcomes — similarity does not guarantee a repeat.",
    modelPrediction: `Ensemble model probability of ${Math.round(
      pred.probability * 100,
    )}% for ${pred.direction} over ${horizonDays} trading days. This is a probabilistic estimate, not a guarantee.`,
    riskFactors: [
      "Elevated volatility may widen the realized outcome range.",
      "Event risk (earnings / macro prints) within the horizon.",
    ],
    conflictingSignals: conflict
      ? [
          "Technical momentum is positive while recent news sentiment is negative.",
        ]
      : [],
    dataQuality:
      "Demo data — all figures are illustrative and clearly marked.",
    agreement: {
      technical: "positive",
      fundamental: "positive",
      news: newsClass,
      historical: "mixed",
      mlModel:
        pred.direction === "UP"
          ? "positive"
          : pred.direction === "DOWN"
            ? "negative"
            : "neutral",
    },
  };
}

/** A fully-completed analysis run (used by the demo flow when it finishes). */
export function buildCompletedRun(
  ticker: string,
  horizon: AnalysisHorizon = "5D",
  depth: AnalysisDepth = "standard",
  analysisId = `an_${ticker}_${horizon}`,
): AnalysisRun | null {
  const seed = findSeed(ticker);

  if (!seed) return null;

  const horizonDays = HORIZON_DAYS[horizon];

  const agents: AgentStatus[] = AGENT_PIPELINE.map((def) => ({
    agentId: def.agentId,
    name: def.name,
    status: "completed",
    progress: 1,
    message: AGENT_MESSAGE[def.agentId],
    executionMs: 800,
  }));

  return {
    analysisId,
    ticker: seed.ticker,
    horizon,
    horizonDays,
    depth,
    status: "completed",
    agents,
    events: buildEvents(analysisId),
    prediction: buildPrediction(ticker, horizonDays)!,
    critic: buildCritic(ticker),
    summary: buildSummary(ticker, horizonDays),
    createdAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
  };
}

export { buildCritic, buildSummary };
