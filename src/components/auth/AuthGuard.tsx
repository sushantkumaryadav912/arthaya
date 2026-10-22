"use client";

import * as React from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Lock, ShieldCheck, Sparkles } from "lucide-react";
import { authService, type AuthUser } from "@/services/authService";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [checking, setChecking] = React.useState(true);
  const [authorized, setAuthorized] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();

  React.useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      try {
        const result = await authService.validateToken();

        if (!mounted) return;

        if (result.authorized && result.user) {
          setAuthorized(true);
          setChecking(false);
        } else {
          setAuthorized(false);
          setChecking(false);
          // Redirect to login preserving the target route
          const target = pathname && pathname !== "/" ? pathname : "/dashboard";
          router.replace(`/login?next=${encodeURIComponent(target)}`);
        }
      } catch {
        if (!mounted) return;
        setAuthorized(false);
        setChecking(false);
        const target = pathname && pathname !== "/" ? pathname : "/dashboard";
        router.replace(`/login?next=${encodeURIComponent(target)}`);
      }
    }

    checkAuth();

    return () => {
      mounted = false;
    };
  }, [pathname, router]);

  if (checking) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-bg px-4 text-center">
        <div className="relative flex size-16 items-center justify-center rounded-2xl border border-accent/40 bg-surface p-3 shadow-[0_0_30px_rgba(16,185,129,0.25)]">
          <Image
            src="/arthaya_logo.png"
            alt="Arthaya"
            width={40}
            height={40}
            priority
            className="rounded object-contain animate-pulse"
          />
        </div>

        <div className="mt-6 flex items-center gap-2 text-accent">
          <Lock className="size-4 animate-bounce" />
          <span className="font-display text-sm font-semibold tracking-wide uppercase">
            Validating JWT Authorization
          </span>
        </div>

        <p className="mt-2 text-xs text-fg-muted max-w-sm">
          Verifying cryptographic credentials with the Arthaya security gateway before granting
          terminal access...
        </p>

        <div className="mt-4 flex items-center gap-1.5 text-[11px] text-fg-subtle">
          <span className="inline-block size-1.5 rounded-full bg-accent animate-ping" />
          <span>Validating HMAC-SHA256 signature</span>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-bg px-4 text-center">
        <div className="rounded-2xl border border-warning/30 bg-surface p-8 max-w-md shadow-2xl space-y-4">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-warning/10 text-warning">
            <Lock className="size-6" />
          </div>
          <h2 className="font-display text-lg font-bold text-fg">Terminal Access Restricted</h2>
          <p className="text-xs text-fg-muted">
            You must be authenticated with a valid JWT session to access the dashboard and research
            workspaces. Redirecting to sign in...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
