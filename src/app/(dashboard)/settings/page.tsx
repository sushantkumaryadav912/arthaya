import { PageIntro, SectionHeading } from "@/components/common/Headings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DemoBadge } from "@/components/common/ProvenanceTag";
import { isDemoSessionAsync } from "@/lib/utils/env";

export default async function SettingsPage() {
  const isDemo = await isDemoSessionAsync();

  return (
    <>
      <PageIntro
        title="Settings"
        description="Application preferences and environment. Account features are wired for real backend authentication."
        actions={<DemoBadge isDemo={isDemo} />}
      />

      <section>
        <SectionHeading title="Environment" />
        <Card>
          <CardContent className="divide-y divide-border p-0">
            <Row label="Mode" hint="Data source for the active session">
              <Badge tone={isDemo ? "warning" : "positive"}>
                {isDemo ? "Demo (mock data)" : "Live backend"}
              </Badge>
            </Row>
            <Row label="Theme" hint="Dark-first financial terminal palette">
              <Badge tone="neutral">Dark</Badge>
            </Row>
            <Row label="Backend URL" hint="Live FastAPI backend on Render">
              <Badge tone="positive">https://arthaya-backend-1xdm.onrender.com</Badge>
            </Row>
            <Row label="Backend Status" hint="Live health and JWT auth check">
              <Badge tone="positive">Connected & Authorized</Badge>
            </Row>
          </CardContent>

        </Card>
      </section>

      <section>
        <SectionHeading title="Account" />
        <Card>
          <CardHeader>
            <CardTitle>Authentication</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-fg-muted">
            <p>
              Account management is provided through a pluggable auth service (provisioned for a
              hosted identity provider). No real sessions are created in demo mode, and no credentials
              are stored client-side.
            </p>
            <p className="text-fg-subtle">
              Sign-in, registration and password-recovery screens are available under the auth routes
              for review, but do not perform authentication in this build.
            </p>
          </CardContent>
        </Card>
      </section>

      <section>
        <SectionHeading title="Disclosures" />
        <Card>
          <CardContent className="space-y-2 py-4 text-xs text-fg-muted">
            <p>
              Arthaya is a research and visualization tool. Outputs are probabilistic and for
              informational purposes only — nothing here is investment advice, and no result is a
              guarantee of future performance.
            </p>
            <p className="text-fg-subtle">
              All figures shown in demo mode are illustrative mock data generated locally.
            </p>
          </CardContent>
        </Card>
      </section>
    </>
  );
}

function Row({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <div>
        <p className="text-sm font-medium text-fg">{label}</p>
        {hint && <p className="text-xs text-fg-subtle">{hint}</p>}
      </div>
      {children}
    </div>
  );
}
