import { Suspense } from "react";
import { PageIntro } from "@/components/common/Headings";
import { DemoBadge } from "@/components/common/ProvenanceTag";
import { LoadingSkeleton } from "@/components/common/States";
import { AnalyzeWorkspace } from "@/components/analysis/AnalyzeWorkspace";

import { DEMO_MODE } from "@/lib/utils/env";

export default function AnalyzePage() {
  return (
    <>
      <PageIntro
        title="AI Analysis Workspace"
        description="Run the multi-agent research pipeline on any symbol and watch each agent execute live."
        disclaimer={
          DEMO_MODE
            ? "Demo data — a live server-sent event stream drives the pipeline over illustrative figures. Not investment advice."
            : "Real-time SSE multi-agent research pipeline connected to live model gateway. Not investment advice."
        }
        actions={<DemoBadge />}
      />
      <Suspense fallback={<LoadingSkeleton rows={6} />}>
        <AnalyzeWorkspace />
      </Suspense>
    </>
  );
}
