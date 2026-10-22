import Link from "next/link";
import Image from "next/image";
import { DemoBadge } from "@/components/common/ProvenanceTag";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center bg-bg px-4 py-12 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 size-96 rounded-full bg-accent/10 blur-[120px]" />
      
      <div className="relative z-10 w-full max-w-xl space-y-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <Link href="/" className="group flex flex-col items-center gap-2" title="Back to Arthaya Home">
            <div className="relative flex size-14 items-center justify-center rounded-2xl border border-accent/40 bg-surface/80 p-2.5 shadow-2xl backdrop-blur transition-all duration-300 group-hover:scale-105 group-hover:border-accent group-hover:shadow-[0_0_30px_rgba(16,185,129,0.35)]">
              <Image
                src="/arthaya_logo.png"
                alt="Arthaya Logo"
                width={48}
                height={48}
                priority
                className="rounded-xl object-contain"
              />
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-display text-2xl font-bold tracking-tight text-fg group-hover:text-accent transition-colors">
                Arthaya
              </span>
              <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold text-accent border border-accent/30">
                PRO
              </span>
            </div>
          </Link>
          <p className="text-xs text-fg-muted max-w-sm font-medium">
            Multi-Agent AI Equity Research & Predictive Intelligence Platform
          </p>
          <DemoBadge />
        </div>

        <div className="rounded-2xl border border-border/80 bg-surface/90 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          {children}
        </div>

        <p className="text-center text-[11px] text-fg-subtle">
          Arthaya Institutional Quantitative Workspace • Live Backend Synced
        </p>
      </div>

    </div>
  );
}

