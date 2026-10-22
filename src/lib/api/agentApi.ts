import { isDemoSessionAsync } from "@/lib/utils/env";
import { apiGet } from "./client";
import type { AgentId, AgentRunStatus, AgentStatus, ModelPerformanceReport } from "@/lib/types";
import { buildAgentStatuses } from "@/lib/mock/agents";
import { buildModelReport } from "@/lib/mock/models";

export async function getAgents(): Promise<AgentStatus[]> {
  const fallback = buildAgentStatuses();
  if (await isDemoSessionAsync()) return fallback;

  try {
    const raw = await apiGet<any[]>("/agents");
    if (Array.isArray(raw) && raw.length > 0) {
      return raw.map((a) => ({
        agentId: (a.agentId || a.id) as AgentId,
        name: a.name || a.role || "Agent",
        status: (a.status as AgentRunStatus) || "idle",
        message: a.description || a.message || "",
      }));
    }
  } catch (err) {
    console.warn("Could not load /agents from backend:", err);
  }

  return fallback;
}

export async function getModelPerformance(): Promise<ModelPerformanceReport> {
  const fallback = buildModelReport();
  if (await isDemoSessionAsync()) return fallback;

  try {
    const raw = await apiGet<ModelPerformanceReport>("/models/performance");
    if (raw && raw.models && raw.models.length > 0) {
      return raw;
    }
  } catch (err) {
    console.warn("Could not load /models/performance from backend:", err);
  }

  return fallback;
}
