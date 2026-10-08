"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Sparkles, RotateCcw, Cpu } from "lucide-react";
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
const GATEWAY_PROVIDERS = [
  { id: "claude", name: "Claude 3.5 Sonnet (Anthropic)" },
  { id: "gemini", name: "Gemini 1.5 Pro (Google)" },
  { id: "mistral", name: "Mistral Large (Mistral AI)" },
  { id: "groq", name: "Groq Llama-3 (Fast Inference)" },
  { id: "openrouter", name: "OpenRouter Auto Gateway" },
];

export function AnalyzeWorkspace() {
  const sp = useSearchParams();
  const [ticker, setTicker] = React.useState((sp.get("ticker") ?? "AAPL").toUpperCase());
  const [horizon, setHorizon] = React.useState<AnalysisHorizon>("5D");
  const [depth, setDepth] = React.useState<AnalysisDepth>("standard");
  const [gatewayProvider, setGatewayProvider] = React.useState("claude");
  const { phase, events, agents, run, error, start, reset } = useAnalysisStream();

  const running = phase === "running";

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker.trim()) return;
    start({ ticker: ticker.trim().toUpperCase(), horizon, depth });
  };


  return (
    <div className="space-y-6">
      <Card variant="instrument">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Cpu className="size-4 text-accent" />
            Analysis Configuration & Model Gateway
          </CardTitle>
          <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-[10px] font-semibold text-accent border border-accent/20">
            Multi-Agent Engine
          </span>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-5 sm:items-end">
            <div className="space-y-1.5">
              <Label htmlFor="ticker">Ticker Symbol</Label>
              <Input
                id="ticker"
                value={ticker}
                onChange={(e) => setTicker(e.target.value.toUpperCase())}
                placeholder="AAPL"
                disabled={running}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="horizon">Forecast Horizon</Label>
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
              <Label htmlFor="depth">Pipeline Depth</Label>
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
            <div className="space-y-1.5">
              <Label htmlFor="gateway">LLM Model Gateway</Label>
              <Select
                id="gateway"
                value={gatewayProvider}
                onChange={(e) => setGatewayProvider(e.target.value)}
                disabled={running}
              >
                {GATEWAY_PROVIDERS.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </Select>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={running} variant="glow" className="flex-1">
                <Sparkles className="size-4" />
                {running ? "Orchestrating…" : "Run Analysis"}
              </Button>
              {phase !== "idle" && (
                <Button type="button" variant="outline" onClick={reset} disabled={running}>
                  <RotateCcw className="size-4" />
                </Button>
              )}
            </div>
          </form>
          <p className="mt-3 text-[10px] text-fg-subtle flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-accent animate-pulse-dot" />
            Runs n8n multi-agent pipeline over market data, technicals, fundamentals, news, and ML models. Generates explainable research via {GATEWAY_PROVIDERS.find(p => p.id === gatewayProvider)?.name}.
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
