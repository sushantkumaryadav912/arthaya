"use client";

import * as React from "react";
import { PageIntro } from "@/components/common/Headings";
import { Label, Select } from "@/components/ui/input";
import { DemoBadge, ProvenanceTag } from "@/components/common/ProvenanceTag";
import { LoadingSkeleton, EmptyState } from "@/components/common/States";
import { PredictionCard } from "@/components/predictions/PredictionCard";
import { getAllPredictions } from "@/lib/api/predictionApi";
import type { Prediction } from "@/lib/types";

const HORIZONS = [
  { label: "1 day", days: 1 },
  { label: "5 days", days: 5 },
  { label: "20 days", days: 20 },
];

export default function PredictionsPage() {
  const [days, setDays] = React.useState(5);
  const [rows, setRows] = React.useState<Prediction[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let active = true;
    setLoading(true);
    getAllPredictions(days).then((data) => {
      if (active) {
        setRows(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [days]);

  return (
    <>
      <PageIntro
        title="Prediction Engine"
        description="Ensemble model probabilities across tracked symbols. Model probability — never a certainty."
        disclaimer="Demo data — ML outputs are illustrative and probabilistic. Not investment advice."
        actions={
          <>
            <DemoBadge />
            <ProvenanceTag kind="ml-prediction" />
          </>
        }
      />

      <div className="flex items-end gap-2">
        <div className="space-y-1.5">
          <Label htmlFor="horizon">Horizon</Label>
          <Select
            id="horizon"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
          >
            {HORIZONS.map((h) => (
              <option key={h.days} value={h.days}>{h.label}</option>
            ))}
          </Select>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton rows={4} />
      ) : rows.length === 0 ? (
        <EmptyState title="No predictions available" description="No model outputs for this horizon." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {rows.map((p) => (
            <PredictionCard key={p.ticker} prediction={p} href={`/stocks/${p.ticker}/prediction`} />
          ))}
        </div>
      )}
    </>
  );
}
