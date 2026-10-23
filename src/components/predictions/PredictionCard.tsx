import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProbabilityBar } from "@/components/charts/ProbabilityBar";
import { ProvenanceTag } from "@/components/common/ProvenanceTag";
import { formatPercent } from "@/lib/utils/format";
import type { Prediction } from "@/lib/types";

const DIR = {
  UP: { icon: ArrowUpRight, tone: "positive" as const, label: "Up" },
  DOWN: { icon: ArrowDownRight, tone: "negative" as const, label: "Down" },
  NEUTRAL: { icon: Minus, tone: "neutral" as const, label: "Neutral" },
};

/** Prediction summary card. Always labels probability as model probability. */
export function PredictionCard({ prediction, href }: { prediction: Prediction; href?: string }) {
  const rawDir = (prediction?.direction || "UP").toString().toUpperCase() as "UP" | "DOWN" | "NEUTRAL";
  const d = DIR[rawDir] || DIR.UP;
  const Icon = d.icon;
  const body = (
    <Card className="h-full transition-colors hover:border-border-strong">
      <CardHeader className="flex-row items-start justify-between gap-2">
        <div>
          <p className="tabular text-sm font-semibold text-fg">{prediction.ticker}</p>
          <p className="text-xs text-fg-subtle">{prediction.horizonDays}-day horizon</p>
        </div>
        <Badge tone={d.tone}>
          <Icon className="size-3" />
          {d.label}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <ProbabilityBar probability={prediction.probability} direction={prediction.direction} />
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
          <span className="text-fg-muted">Confidence</span>
          <span className="text-right text-fg">{prediction.confidence}</span>
          <span className="text-fg-muted">Model</span>
          <span className="text-right text-fg">{prediction.model}</span>
          <span className="text-fg-muted">Calibration</span>
          <span className="text-right text-fg">{prediction.calibration ?? "N/A"}</span>
          <span className="text-fg-muted">Expected move</span>
          <span className="tabular text-right text-fg">{formatPercent(prediction.expectedReturn)}</span>
        </div>
        <div className="flex items-center justify-between border-t border-border pt-2">
          <ProvenanceTag kind="ml-prediction" />
          <span className="text-[10px] text-fg-subtle">Probabilistic — not advice</span>
        </div>
      </CardContent>
    </Card>
  );
  return href ? <Link href={href}>{body}</Link> : body;
}
