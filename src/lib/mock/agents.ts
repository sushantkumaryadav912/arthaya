import type { AgentRunStatus, AgentStatus } from "@/lib/types";
import { AGENT_PIPELINE } from "@/lib/constants/agents";
import { isoHoursAgo, mulberry32, round, seedFrom } from "./generators";

const SOURCE_MAP: Record<string, string[]> = {
  orchestrator: ["Internal"],
  market: ["yfinance (demo)", "Alpha Vantage (demo)"],
  technical: ["Computed indicators"],
  fundamental: ["Company filings (demo)"],
  news: ["News providers (demo)"],
  historical: ["Historical price store (demo)"],
  prediction: ["Feature engine", "LR / RF / XGBoost"],
  critic: ["Validation heuristics"],
  synthesis: ["LLM synthesis (demo)"],
};

/** Snapshot of all agents for the Agent Control Center. */
export function buildAgentStatuses(): AgentStatus[] {
  const rand = mulberry32(seedFrom("agents-snapshot"));
  const statuses: AgentRunStatus[] = ["completed", "completed", "completed", "running", "idle"];
  return AGENT_PIPELINE.map((def, i) => {
    const status = i === 0 ? "completed" : statuses[Math.floor(rand() * statuses.length)];
    return {
      agentId: def.agentId,
      name: def.name,
      status,
      startedAt: isoHoursAgo(2),
      completedAt: status === "completed" ? isoHoursAgo(2) : undefined,
      progress: status === "running" ? round(0.3 + rand() * 0.5, 2) : status === "completed" ? 1 : 0,
      executionMs: status === "completed" ? Math.round(400 + rand() * 2600) : undefined,
      dataSources: SOURCE_MAP[def.agentId],
      currentTask: status === "running" ? def.description : undefined,
      message: status === "completed" ? "Completed successfully" : status === "running" ? "In progress" : "Idle",
    };
  });
}
