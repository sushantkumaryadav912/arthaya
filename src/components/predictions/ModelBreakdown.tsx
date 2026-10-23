import { ProbabilityBar } from "@/components/charts/ProbabilityBar";
import { ProvenanceTag } from "@/components/common/ProvenanceTag";
import type { ModelVote } from "@/lib/types";

/** Per-model vote breakdown feeding the ensemble. */
export function ModelBreakdown({ votes }: { votes?: ModelVote[] }) {
  const list = Array.isArray(votes) ? votes : [];
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-fg-muted">Per-model probability</p>
        <ProvenanceTag kind="ml-prediction" />
      </div>
      <div className="space-y-3">
        {list.map((v) => (
          <ProbabilityBar
            key={v.model}
            label={`${v.model} — ${v.direction}`}
            probability={v.probability}
            direction={v.direction}
          />
        ))}
      </div>
      <p className="text-[10px] text-fg-subtle">
        Ensemble aggregates individual model probabilities. Figures are model outputs, not
        guarantees of outcome.
      </p>
    </div>
  );
}
