"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Sparkles, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Select } from "@/components/ui/input";
import { AgentTimeline } from "@/components/analysis/AgentTimeline";
import { LiveExecutionLog } from "@/components/analysis/LiveExecutionLog";
import { AIResearchSummary } from "@/components/analysis/AIResearchSummary";
import { DataQualityCard } from "@/components/analysis/DataQualityCard";
import { PredictionCard } from "@/components/predictions/PredictionCard";
import { ModelBreakdown } from "@/components/predictions/ModelBreakdown";
import { ErrorState } from "@/components/common/States";
import { useAnalysisStream } from "@/hooks/useAnalysisStream";
import type { AnalysisDepth, AnalysisHorizon } from "@/lib/types";

const HORIZONS: AnalysisHorizon[] = ["1D", "5D", "20D"];
const DEPTHS: AnalysisDepth[] = ["quick", "standard", "deep"];

export function AnalyzeWorkspace() {
  const sp = useSearchParams();
  const [ticker, setTicker] = React.useState((sp.get("ticker") ?? "AAPL").toUpperCase());
  const [horizon, setHorizon] = React.useState<AnalysisHorizon>("5D");
  const [depth, setDepth] = React.useState<AnalysisDepth>("standard");
  const { phase, events, agents, run, error, start, reset } = useAnalysisStream();

  const running = phase === "running";

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker.trim()) return;
    start({ ticker: ticker.trim().toUpperCase(), horizon, depth });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Analysis configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-4 sm:items-end">
            <div className="space-y-1.5">
              <Label htmlFor="ticker">Ticker</Label>
              <Input
                id="ticker"
                value={ticker}
                onChange={(e) => setTicker(e.target.value.toUpperCase())}
                placeholder="AAPL"
                disabled={running}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="horizon">Horizon</Label>
              <Select
                id="horizon"
                value={horizon}
                onChange={(e) => setHorizon(e.target.value as AnalysisHorizon)}
                disabled={running}
              >
                {HORIZONS.map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="depth">Depth</Label>
              <Select
                id="depth"
                value={depth}
                onChange={(e) => setDepth(e.target.value as AnalysisDepth)}
                disabled={running}
              >
                {DEPTHS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </Select>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={running} className="flex-1">
                <Sparkles className="size-4" />
                {running ? "Analyzing…" : "Run Analysis"}
              </Button>
              {phase !== "idle" && (
                <Button type="button" variant="outline" onClick={reset} disabled={running}>
                  <RotateCcw className="size-4" />
                </Button>
              )}
            </div>
          </form>
          <p className="mt-3 text-[10px] text-fg-subtle">
            Runs a live multi-agent pipeline over demo data via a server-sent event stream. Output is
            probabilistic research, not investment advice.
          </p>
        </CardContent>
      </Card>

      {error && <ErrorState title="Analysis failed" description={error} />}

      {phase !== "idle" && (
        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Agent pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <AgentTimeline agents={agents} />
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Live execution</CardTitle>
              </CardHeader>
              <CardContent>
                <LiveExecutionLog events={events} />
              </CardContent>
            </Card>

            {run?.prediction && (
              <div className="grid gap-6 md:grid-cols-2">
                <PredictionCard prediction={run.prediction} />
                <Card>
                  <CardHeader>
                    <CardTitle>Model breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ModelBreakdown votes={run.prediction.breakdown} />
                  </CardContent>
                </Card>
              </div>
            )}
            {run?.critic && <DataQualityCard critic={run.critic} />}
          </div>
        </div>
      )}

      {run?.summary && <AIResearchSummary summary={run.summary} />}
    </div>
  );
}
