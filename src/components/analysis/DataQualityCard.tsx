import { AlertTriangle, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProvenanceTag } from "@/components/common/ProvenanceTag";
import { cn } from "@/lib/utils/cn";
import type { CriticValidation } from "@/lib/types";

const PCT = (v: number | null) => (v == null ? "N/A" : `${Math.round(v * 100)}%`);

function toneFor(v: number | null): string {
  if (v == null) return "bg-elevated";
  if (v >= 0.75) return "bg-positive";
  if (v >= 0.5) return "bg-accent";
  if (v >= 0.3) return "bg-warning";
  return "bg-negative";
}

function QualityBar({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-fg-muted">{label}</span>
        <span className="tabular font-medium text-fg">{PCT(value)}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-elevated">
        <div
          className={cn("h-full rounded-full", toneFor(value))}
          style={{ width: `${value == null ? 0 : Math.round(value * 100)}%` }}
        />
      </div>
    </div>
  );
}

const LEAKAGE_TONE: Record<string, string> = {
  none: "text-positive",
  low: "text-fg-muted",
  elevated: "text-negative",
};

/** Critic-agent validation panel: an adversarial quality check, not a guarantee. */
export function DataQualityCard({ critic }: { critic: CriticValidation }) {
  const flags = [...critic.notes];
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="size-4 text-accent" />
          Critic Validation
        </CardTitle>
        <ProvenanceTag kind="ai-interpretation" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <QualityBar label="Data quality" value={critic.dataQuality} />
          <QualityBar label="Model quality" value={critic.modelQuality} />
          <QualityBar label="Source quality" value={critic.sourceQuality} />
          <QualityBar label="Signal agreement" value={critic.signalAgreement} />
          <QualityBar label="Model calibration" value={critic.modelCalibration} />
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
          <span className="text-fg-muted">
            Potential leakage:{" "}
            <span className={cn("font-medium", LEAKAGE_TONE[critic.potentialLeakage ?? ""] ?? "text-fg-subtle")}>
              {critic.potentialLeakage ?? "N/A"}
            </span>
          </span>
        </div>

        {(critic.missingData.length > 0 || critic.staleData.length > 0) && (
          <div className="grid gap-2 text-xs sm:grid-cols-2">
            <div>
              <p className="mb-1 font-medium text-fg-muted">Missing data</p>
              {critic.missingData.length ? (
                <ul className="space-y-0.5 text-fg-subtle">
                  {critic.missingData.map((m) => (
                    <li key={m}>· {m}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-fg-subtle">None flagged</p>
              )}
            </div>
            <div>
              <p className="mb-1 font-medium text-fg-muted">Stale data</p>
              {critic.staleData.length ? (
                <ul className="space-y-0.5 text-fg-subtle">
                  {critic.staleData.map((m) => (
                    <li key={m}>· {m}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-fg-subtle">None flagged</p>
              )}
            </div>
          </div>
        )}

        {flags.length > 0 && (
          <div className="space-y-1 rounded-lg border border-warning/30 bg-warning-soft p-3">
            {flags.map((n) => (
              <p key={n} className="flex items-start gap-1.5 text-xs text-warning">
                <AlertTriangle className="mt-0.5 size-3 shrink-0" />
                {n}
              </p>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
