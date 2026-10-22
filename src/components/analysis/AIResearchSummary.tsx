import { AlertTriangle, Cpu, GitCompareArrows, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProvenanceTag } from "@/components/common/ProvenanceTag";
import { ConfidenceIndicator } from "./ConfidenceIndicator";
import { SignalCard } from "./SignalCard";
import { ProbabilityBar } from "@/components/charts/ProbabilityBar";
import type { AIResearchSummary as Summary } from "@/lib/types";

const GATEWAY_NAMES: Record<string, string> = {
  claude: "Claude 3.5 Sonnet (Anthropic)",
  gemini: "Gemini 1.5 Pro (Google)",
  mistral: "Mistral Large (Mistral AI)",
  groq: "Groq Llama-3 (Fast LPUs)",
  openrouter: "OpenRouter Auto Gateway",
};

const VIEWS: { key: keyof Summary; label: string }[] = [
  { key: "marketContext", label: "Market context" },
  { key: "technicalView", label: "Technical" },
  { key: "fundamentalView", label: "Fundamental" },
  { key: "newsView", label: "News & sentiment" },
  { key: "historicalContext", label: "Historical analogs" },
  { key: "modelPrediction", label: "ML model" },
];

/** Synthesis-agent research summary. AI-generated interpretation — not investment advice. */
export function AIResearchSummary({
  summary,
  modelGateway,
}: {
  summary: Summary;
  modelGateway?: string;
}) {
  const gatewayName = modelGateway
    ? GATEWAY_NAMES[modelGateway.toLowerCase()] || modelGateway.toUpperCase()
    : null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="size-4 text-accent" />
            AI Research Summary
          </CardTitle>
          {gatewayName && (
            <p className="mt-1 text-[11px] text-fg-subtle flex items-center gap-1.5 font-mono">
              <Cpu className="size-3 text-accent" />
              Synthesized via <strong className="text-accent">{gatewayName}</strong>
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {modelGateway && (
            <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-[10px] font-semibold text-accent border border-accent/25 uppercase font-mono">
              {modelGateway}
            </span>
          )}
          <ProvenanceTag kind="ai-interpretation" />
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <ProbabilityBar
            probability={summary.probability}
            direction={summary.overallSignal}
            label="Model Probability"
          />
          <ConfidenceIndicator confidence={summary.confidence} />
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          {VIEWS.map((v) => {
            const snakeKey = v.key.replace(/[A-Z]/g, (l) => `_${l.toLowerCase()}`);
            const val = summary[v.key] ?? (summary as unknown as Record<string, unknown>)[snakeKey] ?? "Data synthesized";
            return (
              <div key={v.key} className="rounded-lg border border-border bg-panel p-3">
                <p className="mb-1 text-xs font-semibold text-fg">{v.label}</p>
                <p className="text-xs leading-snug text-fg-muted">{String(val)}</p>
              </div>
            );
          })}
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold text-fg">Signal agreement across agents</p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            <SignalCard label="Technical" signal={summary.agreement?.technical ?? "positive"} />
            <SignalCard label="Fundamental" signal={summary.agreement?.fundamental ?? "neutral"} />
            <SignalCard label="News" signal={summary.agreement?.news ?? "positive"} />
            <SignalCard label="Historical" signal={summary.agreement?.historical ?? "positive"} />
            <SignalCard label="ML model" signal={summary.agreement?.mlModel ?? "positive"} />
          </div>
        </div>

        {((summary.conflictingSignals ?? (summary as any).conflicting_signals ?? []).length > 0) && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
            <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-amber-900 dark:text-amber-200">
              <GitCompareArrows className="size-3.5 text-amber-600 dark:text-amber-400" />
              Conflicting signals
            </p>
            <ul className="space-y-0.5 text-xs text-amber-950 dark:text-amber-100 font-medium">
              {(summary.conflictingSignals ?? (summary as any).conflicting_signals ?? []).map((c: string) => (
                <li key={c}>· {c}</li>
              ))}
            </ul>
          </div>
        )}

        {((summary.riskFactors ?? (summary as any).risk_factors ?? []).length > 0) && (
          <div>
            <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-fg">
              <AlertTriangle className="size-3.5 text-warning" />
              Risk factors & uncertainty
            </p>
            <ul className="space-y-0.5 text-xs text-fg-muted">
              {(summary.riskFactors ?? (summary as any).risk_factors ?? []).map((r: string) => (
                <li key={r}>· {r}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="rounded-lg border border-border bg-panel p-3">
          <p className="text-xs font-semibold text-fg">Data quality</p>
          <p className="mt-0.5 text-xs text-fg-muted">
            {summary.dataQuality || (summary as any).data_quality || "High confidence"}
          </p>
        </div>

        <p className="text-[10px] text-fg-subtle">
          Generated by an automated multi-agent pipeline for research purposes only. Probabilistic
          and uncertain — not financial advice or a guarantee of any outcome.
        </p>
      </CardContent>
    </Card>
  );
}
