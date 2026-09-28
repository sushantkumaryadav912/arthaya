import { PageIntro, SectionHeading } from "@/components/common/Headings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DemoBadge } from "@/components/common/ProvenanceTag";
import { DEMO_MODE } from "@/lib/utils/env";

export default function SettingsPage() {
  return (
    <>
      <PageIntro
        title="Settings"
        description="Application preferences and environment. Account features are wired for a real auth provider but disabled in demo mode."
        actions={<DemoBadge />}
      />

      <section>
        <SectionHeading title="Environment" />
        <Card>
          <CardContent className="divide-y divide-border p-0">
            <Row label="Mode" hint="Data source for the entire application">
              <Badge tone={DEMO_MODE ? "warning" : "positive"}>
                {DEMO_MODE ? "Demo (mock data)" : "Live backend"}
              </Badge>
            </Row>
            <Row label="Theme" hint="Dark-first financial terminal palette">
              <Badge tone="neutral">Dark</Badge>
            </Row>
            <Row label="Backend" hint="Route-handler API under /api/v1">
              <Badge tone="positive">Connected</Badge>
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
