import { PageIntro, SectionHeading } from "@/components/common/Headings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DemoBadge } from "@/components/common/ProvenanceTag";
import { AgentCard } from "@/components/agents/AgentCard";
import { AgentGraph } from "@/components/agents/AgentGraph";
import { getAgents } from "@/lib/api/agentApi";
import { AGENT_PIPELINE } from "@/lib/constants/agents";
import type { AgentId, AgentRunStatus } from "@/lib/types";

export default async function AgentsPage() {
  const agents = await getAgents();
  const statusById = Object.fromEntries(
    agents.map((a) => [a.agentId, a.status]),
  ) as Partial<Record<AgentId, AgentRunStatus>>;

  return (
    <>
      <PageIntro
        title="Agent Intelligence"
        description="The multi-agent pipeline: an orchestrator sequences specialist agents that feed a prediction, critic and synthesis stage."
        disclaimer="Demo data — agent status reflects the most recent illustrative run."
        actions={<DemoBadge />}
      />

      <section>
        <SectionHeading title="Pipeline graph" description="Dependency flow across the agent graph" />
        <Card>
          <CardContent className="overflow-x-auto py-6">
            <AgentGraph statuses={statusById} />
          </CardContent>
        </Card>
      </section>

      <section>
        <SectionHeading title="Agents" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {AGENT_PIPELINE.map((agent) => (
            <AgentCard key={agent.agentId} agent={agent} status={statusById[agent.agentId]} />
          ))}
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>How the pipeline works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs text-fg-muted">
          <p>
            The Orchestrator fans work out to the Market, Technical, Fundamental, News and Historical
            agents. Their outputs converge on the Prediction agent, which ensembles multiple models.
          </p>
          <p>
            The Critic agent independently validates data, model and source quality and flags
            conflicting signals before the Synthesis agent produces the final research summary — with
            provenance for every claim.
          </p>
        </CardContent>
      </Card>
    </>
  );
}
