"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import {
  Sparkles,
  RotateCcw,
  Cpu,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  Download,
  Share2,
} from "lucide-react";
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

const POPULAR_TICKERS = ["AAPL", "NVDA", "TSLA", "MSFT", "RELIANCE", "TCS"];

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
    start({
      ticker: ticker.trim().toUpperCase(),
      horizon,
      depth,
      gateway: gatewayProvider,
    });
  };

  const handleExportFullReport = () => {
    if (!run) return;
    const blob = new Blob([JSON.stringify(run, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `arthaya_${run.ticker}_multiagent_analysis_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Configuration Header Card */}
      <Card variant="instrument">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Cpu className="size-4 text-accent" />
            Adaptive Multi-Agent Workspace & LLM Gateway
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-[10px] font-semibold text-accent border border-accent/20">
              9 Autonomous Agents
            </span>
            <span className="rounded-full bg-cyan-500/15 px-2.5 py-0.5 text-[10px] font-semibold text-cyan-400 border border-cyan-500/20">
              Adversarial Critic Loop
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-5 sm:items-end">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="ticker">Ticker Symbol</Label>
                <span className="text-[10px] text-fg-subtle">Any Symbol</span>
              </div>
              <Input
                id="ticker"
                value={ticker}
                onChange={(e) => setTicker(e.target.value.toUpperCase())}
                placeholder="AAPL, NVDA, TSLA..."
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
                {running ? "Agents Reasoning…" : "Run Analysis"}
              </Button>
              {phase !== "idle" && (
                <Button type="button" variant="outline" onClick={reset} disabled={running}>
                  <RotateCcw className="size-4" />
                </Button>
              )}
            </div>
          </form>

          {/* Quick-fill chips */}
          <div className="mt-3 flex flex-wrap items-center gap-2 pt-2 border-t border-border/50">
            <span className="text-[11px] text-fg-subtle font-mono">Quick Pick:</span>
            {POPULAR_TICKERS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTicker(t)}
                disabled={running}
                className={`rounded px-2 py-0.5 text-[10.5px] font-mono border transition-colors ${
                  ticker === t
                    ? "border-accent bg-accent/20 text-accent font-bold"
                    : "border-border bg-surface text-fg-muted hover:border-accent/50 hover:text-fg"
                }`}
              >
                {t}
              </button>
            ))}
            <span className="ml-auto text-[10.5px] text-fg-subtle">
              Provider: <strong className="text-fg-muted">{GATEWAY_PROVIDERS.find(p => p.id === gatewayProvider)?.name}</strong>
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Error notification if any */}
      {error && <ErrorState title="Analysis failed" description={error} />}

      {/* Dynamic Multi-Agent Arbitration Callout Banner */}
      {run?.coordinationTrace && (
        <div
          className={`flex flex-wrap items-center justify-between gap-4 rounded-xl border p-4 shadow-sm ${
            run.coordinationTrace.conflictDetected
              ? "border-amber-500/30 bg-amber-500/10 text-amber-200"
              : "border-positive/30 bg-positive/10 text-emerald-200"
          }`}
        >
          <div className="flex items-start gap-3">
            {run.coordinationTrace.conflictDetected ? (
              <AlertTriangle className="size-5 shrink-0 text-amber-400 mt-0.5" />
            ) : (
              <CheckCircle2 className="size-5 shrink-0 text-positive mt-0.5" />
            )}
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold tracking-tight">
                  {run.coordinationTrace.conflictDetected
                    ? "Multi-Agent Conflict Arbitrated & Re-Planned"
                    : "Multi-Agent Consensus Formed"}
                </h4>
                {run.coordinationTrace.conflictDetected && (
                  <span className="flex items-center gap-1 rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-300 border border-amber-500/30">
                    <RefreshCw className="size-3" />
                    {run.coordinationTrace.replanningIterations} Re-plan Cycle
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-xs opacity-90 leading-relaxed">
                {run.coordinationTrace.arbitrationSummary}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportFullReport}
              className="flex items-center gap-1.5 rounded-lg border border-white/20 bg-surface/80 px-3 py-1.5 text-xs font-semibold text-fg shadow-sm transition-all hover:bg-elevated hover:border-accent"
            >
              <Download className="size-3.5 text-accent" />
              <span>Export Dossier (JSON)</span>
            </button>
          </div>
        </div>
      )}

      {/* Active Phase Pipeline & Logs */}
      {phase !== "idle" && (
        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-semibold">Agent Pipeline Graph</CardTitle>
              <span className="text-[10px] text-fg-subtle font-mono">9 Agents</span>
            </CardHeader>
            <CardContent>
              <AgentTimeline agents={agents} />
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Live Inter-Agent Coordination Bus</CardTitle>
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
                    <CardTitle className="text-sm font-semibold">Model Ensemble Breakdown</CardTitle>
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

      {/* Synthesis Report */}
      {run?.summary && <AIResearchSummary summary={run.summary} />}
    </div>
  );
}
