import Link from "next/link";
import { Activity } from "lucide-react";
import { DemoBadge } from "@/components/common/ProvenanceTag";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-bg px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-md bg-accent/15 text-accent">
              <Activity className="size-4" />
            </span>
            <span className="text-base font-semibold tracking-tight text-fg">Arthaya</span>
          </Link>
          <p className="text-xs text-fg-muted">Multi-Agent Stock Intelligence</p>
          <DemoBadge />
        </div>
        {children}
        <p className="text-center text-[11px] text-fg-subtle">
          Demo build — authentication is not active. No credentials are stored.
        </p>
      </div>
    </div>
  );
}
