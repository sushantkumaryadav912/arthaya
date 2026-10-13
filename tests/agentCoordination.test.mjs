import test from "node:test";
import assert from "node:assert/strict";
import { buildMultiAgentExecutionPlan } from "../src/lib/agents/multiAgentCoordinator.ts";

test("Multi-Agent Coordinator: executes at least 4 distinct agents", () => {
  const plan = buildMultiAgentExecutionPlan("AAPL", "5D", "standard", "claude");

  assert.ok(plan.steps.length > 0, "Plan should have execution steps");

  const distinctAgents = new Set(plan.steps.map((s) => s.agent));
  assert.ok(
    distinctAgents.size >= 4,
    `Expected >= 4 distinct agents, found ${distinctAgents.size} (${Array.from(distinctAgents).join(", ")})`,
  );

  // Check critical agent presence
  assert.ok(distinctAgents.has("orchestrator"), "Must contain Orchestrator agent");
  assert.ok(distinctAgents.has("technical"), "Must contain Technical agent");
  assert.ok(distinctAgents.has("critic"), "Must contain Adversarial Critic agent");
  assert.ok(distinctAgents.has("synthesis"), "Must contain Synthesis agent");
});

test("Multi-Agent Coordinator: handles custom / unlisted tickers robustly", () => {
  const unlistedTicker = "COIN";
  const plan = buildMultiAgentExecutionPlan(unlistedTicker, "1D", "quick", "groq");

  assert.equal(plan.ticker, "COIN");
  assert.ok(plan.finalRun, "Must generate valid finalRun");
  assert.equal(plan.finalRun.ticker, "COIN");
  assert.ok(plan.finalRun.prediction.probability >= 0 && plan.finalRun.prediction.probability <= 1);
  assert.ok(plan.finalRun.critic.dataQuality > 0);
});

test("Multi-Agent Coordinator: records tools, handoffs, and phase metadata", () => {
  const plan = buildMultiAgentExecutionPlan("NVDA", "5D", "deep", "gemini");

  for (const step of plan.steps) {
    assert.ok(step.agent, "Step must specify agent");
    assert.ok(step.phase, "Step must specify reasoning phase");
    assert.ok(step.toolName, "Step must specify executed tool");
    assert.ok(step.message.length > 0, "Step must have a descriptive message");
  }

  const handoffs = plan.steps.filter((s) => s.targetAgent);
  assert.ok(handoffs.length > 0, "Trace must contain inter-agent handoffs");
});

test("Multi-Agent Coordinator: exercises conflict detection and replanning loop", () => {
  // Test across multiple seeds to ensure conflict logic is verified
  const tickers = ["AAPL", "TSLA", "MSFT", "GOOGL", "AMD", "META"];
  let observedConflictOrReplan = false;

  for (const t of tickers) {
    const plan = buildMultiAgentExecutionPlan(t, "5D", "deep", "claude");
    if (plan.conflictDetected || plan.replanningIterations > 0) {
      observedConflictOrReplan = true;
      const conflictEvents = plan.steps.filter((s) => s.isConflict);
      const replanEvents = plan.steps.filter((s) => s.isReplan);
      assert.ok(conflictEvents.length > 0, "Must tag conflict steps with isConflict");
      assert.ok(replanEvents.length > 0, "Must tag replanning steps with isReplan");
      break;
    }
  }

  assert.ok(observedConflictOrReplan, "Pipeline must be capable of detecting conflict and triggering replanning");
});
