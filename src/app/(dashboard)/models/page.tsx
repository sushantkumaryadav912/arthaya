import { PageIntro, SectionHeading } from "@/components/common/Headings";
import { Card, CardContent } from "@/components/ui/card";
import { DemoBadge, ProvenanceTag } from "@/components/common/ProvenanceTag";
import { ModelPerformanceTable } from "@/components/models/ModelPerformanceTable";
import { WalkForwardTimeline } from "@/components/models/WalkForwardTimeline";
import { BaselineComparison } from "@/components/models/BaselineComparison";
import { getModelPerformance } from "@/lib/api/agentApi";
import { formatDateTime } from "@/lib/utils/format";

export default async function ModelsPage() {
  const report = await getModelPerformance();

  return (
    <>
      <PageIntro
        title="Model Performance"
        description="Backtested evaluation of the prediction models. Historical results — not a guarantee of future performance."
        disclaimer={
          report.evaluatedAt
            ? `Demo data — last evaluated ${formatDateTime(report.evaluatedAt)}.`
            : "Demo data — no evaluation data available."
        }
        actions={
          <>
            <DemoBadge />
            <ProvenanceTag kind="backtest" />
          </>
        }
      />

      <section>
        <SectionHeading
          title="Classification & regression metrics"
          description="Per-model accuracy, precision, recall, F1, ROC-AUC, log loss, Brier, MAE & RMSE"
        />
        <Card>
          <CardContent className="overflow-x-auto p-0">
            <ModelPerformanceTable models={report.models} />
          </CardContent>
        </Card>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <SectionHeading
            title="Walk-forward validation"
            description="Each fold trained on the past, tested on unseen future"
          />
          <WalkForwardTimeline periods={report.walkForward} />
        </section>

        <section>
          <SectionHeading
            title="Baseline comparison"
            description="Multi-source model vs. single-source & naive baselines"
          />
          <Card>
            <CardContent className="overflow-x-auto p-0">
              <BaselineComparison baselines={report.baselines} />
            </CardContent>
          </Card>
        </section>
      </div>
    </>
  );
}
