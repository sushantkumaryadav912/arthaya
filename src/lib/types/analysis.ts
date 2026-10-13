import type { AgentId, AgentStatus } from "./agent";
import type { ConfidenceLabel, Direction, SignalClass } from "./common";
import type { Prediction } from "./prediction";

export type AnalysisDepth = "quick" | "standard" | "deep";
export type AnalysisHorizon = "1D" | "5D" | "20D";

export type AnalysisRunStatus =
  | "queued"
  | "running"
  | "completed"
  | "failed";

/** Streamed event (SSE-ready) — mirrors project.md §15 event shape with multi-agent coordination metadata. */
export interface AnalysisEvent {
  analysisId: string;
  agent: AgentId;
  status: AgentStatus["status"];
  message: string;
  progress?: number;
  timestamp: string;
  /** elapsed clock label e.g. "00:03" */
  clock?: string;
  phase?: "planning" | "perception" | "reasoning" | "tool_execution" | "critique" | "replanning" | "synthesis";
  toolName?: string;
  targetAgent?: AgentId;
  payloadSummary?: string;
  isConflict?: boolean;
  isReplan?: boolean;
}

export interface SignalAgreement {
  technical: SignalClass;
  fundamental: SignalClass;
  news: SignalClass;
  historical: SignalClass;
  mlModel: SignalClass;
}

export interface CriticValidation {
  dataQuality: number | null; // 0..1
  modelQuality: number | null;
  sourceQuality: number | null;
  signalAgreement: number | null;
  modelCalibration: number | null;
  potentialLeakage: "none" | "low" | "elevated" | null;
  missingData: string[];
  staleData: string[];
  notes: string[]; // e.g. "High signal conflict detected."
}

export interface AIResearchSummary {
  overallSignal: Direction;
  probability: number;
  horizonDays: number;
  confidence: ConfidenceLabel;
  marketContext: string;
  technicalView: string;
  fundamentalView: string;
  newsView: string;
  historicalContext: string;
  modelPrediction: string;
  riskFactors: string[];
  conflictingSignals: string[];
  dataQuality: string;
  agreement: SignalAgreement;
}

export interface AnalysisRun {
  analysisId: string;
  ticker: string;
  horizon: AnalysisHorizon;
  horizonDays: number;
  depth: AnalysisDepth;
  status: AnalysisRunStatus;
  agents: AgentStatus[];
  events: AnalysisEvent[];
  prediction?: Prediction;
  critic?: CriticValidation;
  summary?: AIResearchSummary;
  createdAt: string;
  completedAt?: string;
  modelGateway?: string;
  coordinationTrace?: {
    conflictDetected: boolean;
    replanningIterations: number;
    arbitrationSummary: string;
  };
}
