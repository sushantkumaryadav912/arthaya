import { DEMO_MODE } from "@/lib/utils/env";
import { apiGet } from "./client";
import type { AgentStatus, ModelPerformanceReport } from "@/lib/types";
import { buildAgentStatuses } from "@/lib/mock/agents";
import { buildModelReport } from "@/lib/mock/models";

export async function getAgents(): Promise<AgentStatus[]> {
  if (DEMO_MODE) return buildAgentStatuses();
  return apiGet<AgentStatus[]>("/agents");
}

export async function getModelPerformance(): Promise<ModelPerformanceReport> {
  if (DEMO_MODE) return buildModelReport();
  return apiGet<ModelPerformanceReport>("/models/performance");
}
