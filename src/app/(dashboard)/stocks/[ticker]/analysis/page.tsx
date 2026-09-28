import Link from "next/link";
import { Sparkles } from "lucide-react";
import { getAnalysis } from "@/lib/api";
import { EmptyState } from "@/components/common/States";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AgentTimeline } from "@/components/analysis/AgentTimeline";
import { AIResearchSummary } from "@/components/analysis/AIResearchSummary";
import { DataQualityCard } from "@/components/analysis/DataQualityCard";
import { PredictionCard } from "@/components/predictions/PredictionCard";
import { SectionHeading } from "@/components/common/Headings";

export default async function AnalysisPage({ params }: { params: Promise<{ ticker: string }> }) {
  const { ticker } = await params;
  const run = await getAnalysis(ticker);
  if (!run) return <EmptyState title="No analysis available" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <SectionHeading
          title="Latest AI analysis"
          description="Most recent completed multi-agent run for this stock (demo)."
        />
        <Link href={`/analyze?ticker=${run.ticker}`}>
          <Button>
            <Sparkles className="size-4" />
            Run live analysis
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Agent pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <AgentTimeline agents={run.agents} />
          </CardContent>
        </Card>

        <div className="space-y-6">
          {run.prediction && <PredictionCard prediction={run.prediction} />}
          {run.critic && <DataQualityCard critic={run.critic} />}
        </div>
      </div>

      {run.summary && <AIResearchSummary summary={run.summary} />}
    </div>
  );
}
