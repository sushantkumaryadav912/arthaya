import type { AgentDefinition } from "@/lib/types";

/** Canonical multi-agent pipeline (project.md §14 / §34). */
export const AGENT_PIPELINE: AgentDefinition[] = [
  {
    agentId: "orchestrator",
    name: "Orchestrator",
    description: "Coordinates the agent graph and sequences execution.",
    dependsOn: [],
  },
  {
    agentId: "market",
    name: "Market Agent",
    description: "Retrieves price, volume and market-state data.",
    dependsOn: ["orchestrator"],
  },
  {
    agentId: "technical",
    name: "Technical Agent",
    description: "Computes indicators (RSI, MACD, SMA/EMA, Bollinger, ATR).",
    dependsOn: ["orchestrator"],
  },
  {
    agentId: "fundamental",
    name: "Fundamental Agent",
    description: "Parses statements, ratios, growth and valuation.",
    dependsOn: ["market"],
  },
  {
    agentId: "news",
    name: "News Agent",
    description: "Collects news and derives sentiment.",
    dependsOn: ["technical"],
  },
  {
    agentId: "historical",
    name: "Historical Agent",
    description: "Finds historical analogs to current conditions.",
    dependsOn: ["fundamental", "news"],
  },
  {
    agentId: "prediction",
    name: "Prediction Agent",
    description: "Runs LR / RF / XGBoost, ensembles and calibrates.",
    dependsOn: ["historical"],
  },
  {
    agentId: "critic",
    name: "Critic Agent",
    description: "Validates data, model and source quality; flags conflicts.",
    dependsOn: ["prediction"],
  },
  {
    agentId: "synthesis",
    name: "Synthesis Agent",
    description: "Produces the final research summary with provenance.",
    dependsOn: ["critic"],
  },
];

/** Execution order used by the demo analysis stream. */
export const AGENT_ORDER: AgentDefinition["agentId"][] = [
  "orchestrator",
  "market",
  "technical",
  "fundamental",
  "news",
  "historical",
  "prediction",
  "critic",
  "synthesis",
];
