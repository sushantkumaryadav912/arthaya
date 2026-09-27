import type { AIResearchSummary, CriticValidation } from "./analysis";
import type { Direction } from "./common";
import type { Prediction } from "./prediction";

export interface ReportSummary {
  id: string;
  ticker: string;
  company: string;
  generatedAt: string;
  horizonDays: number;
  model: string;
  probability: number;
  overallSignal: Direction;
  agentStatus: "completed" | "partial" | "failed";
}

export interface ResearchReport extends ReportSummary {
  executiveSummary: string;
  prediction: Prediction;
  critic: CriticValidation;
  analysis: AIResearchSummary;
  sources: { provider: string; url?: string; retrievedAt?: string }[];
}
