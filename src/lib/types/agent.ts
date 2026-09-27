export type AgentId =
  | "orchestrator"
  | "market"
  | "technical"
  | "fundamental"
  | "news"
  | "historical"
  | "prediction"
  | "critic"
  | "synthesis";

export type AgentRunStatus =
  | "idle"
  | "waiting"
  | "running"
  | "completed"
  | "failed";

export interface AgentStatus {
  agentId: AgentId;
  name: string;
  status: AgentRunStatus;
  startedAt?: string;
  completedAt?: string;
  progress?: number; // 0..1
  message?: string;
  executionMs?: number;
  dataSources?: string[];
  currentTask?: string;
}

/** Static pipeline definition used to render the agent graph. */
export interface AgentDefinition {
  agentId: AgentId;
  name: string;
  description: string;
  /** upstream agent ids feeding this node */
  dependsOn: AgentId[];
}
