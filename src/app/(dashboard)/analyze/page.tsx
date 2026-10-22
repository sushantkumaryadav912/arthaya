import { Suspense } from "react";
import { PageIntro } from "@/components/common/Headings";
import { DemoBadge } from "@/components/common/ProvenanceTag";
import { LoadingSkeleton } from "@/components/common/States";
import { AnalyzeWorkspace } from "@/components/analysis/AnalyzeWorkspace";

import { isDemoSessionAsync } from "@/lib/utils/env";

export default async function AnalyzePage() {
  const isDemo = await isDemoSessionAsync();

  return (
    <>
      <PageIntro
        title="AI Analysis Workspace"
        description="Run the multi-agent research pipeline on any symbol and watch each agent execute live."
        disclaimer={
          isDemo
            ? "Demo data — a live server-sent event stream drives the pipeline over illustrative figures. Not investment advice."
            : "Real-time SSE multi-agent research pipeline connected to live model gateway. Not investment advice."
        }
        actions={<DemoBadge isDemo={isDemo} />}
      />
      <Suspense fallback={<LoadingSkeleton rows={6} />}>
        <AnalyzeWorkspace />
      </Suspense>
    </>
  );
}
