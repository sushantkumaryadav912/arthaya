"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertTriangle, CheckCircle2, KeyRound, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { authService } from "@/services/authService";

type Mode = "login" | "register" | "forgot";

const COPY: Record<Mode, { title: string; cta: string; subtitle: string }> = {
  login: { title: "Sign in", cta: "Sign in", subtitle: "Access your research workspace." },
  register: { title: "Create account", cta: "Create account", subtitle: "Set up a new workspace." },
  forgot: { title: "Reset password", cta: "Send reset link", subtitle: "We'll email you a recovery link." },
};

function AuthFormInner({ mode }: { mode: Mode }) {
  const copy = COPY[mode];
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams?.get("next") || "/dashboard";

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [notice, setNotice] = React.useState<{ type: "error" | "success"; message: string } | null>(null);
  const [pending, setPending] = React.useState(false);

  const fillDemoCredentials = () => {
    setEmail("analyst@arthaya.ai");
    setPassword("password123");
    setNotice(null);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setNotice(null);

    try {
      if (mode === "login") {
        await authService.signIn(email, password);
        setNotice({ type: "success", message: "JWT authenticated. Entering workspace..." });
        setTimeout(() => {
          window.location.href = nextUrl;
        }, 400);
      } else if (mode === "register") {
        await authService.signUp(email, password, name);
        setNotice({ type: "success", message: "Account created and authorized. Entering workspace..." });
        setTimeout(() => {
          window.location.href = nextUrl;
        }, 400);
      } else {
        await authService.forgotPassword(email);
        setNotice({ type: "success", message: "Password reset request recorded for demo environment." });
      }
    } catch (err) {
      setNotice({
        type: "error",
        message: err instanceof Error ? err.message : "Authentication failed.",
      });
    } finally {
      setPending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{copy.title}</CardTitle>
        <p className="text-xs text-fg-muted">{copy.subtitle}</p>
      </CardHeader>
      <CardContent>
        {mode === "login" && (
          <div className="mb-4 rounded-lg border border-accent/30 bg-accent/10 p-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-accent flex items-center gap-1.5">
                <KeyRound className="size-3.5" /> Demo Analyst Access
              </span>
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="rounded bg-accent/20 px-2 py-0.5 text-[10px] font-semibold text-accent hover:bg-accent hover:text-bg transition-colors"
              >
                Auto-fill
              </button>
            </div>
            <p className="mt-1 text-[11px] text-fg-muted font-mono">
              analyst@arthaya.ai / password123
            </p>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          {mode === "register" && (
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Quantitative Analyst"
                autoComplete="name"
              />
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="analyst@arthaya.ai"
              autoComplete="email"
              required
            />
          </div>
          {mode !== "forgot" && (
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                required
              />
            </div>
          )}

          {notice && (
            <p
              className={
                notice.type === "success"
                  ? "flex items-start gap-1.5 rounded-md border border-accent/40 bg-accent/15 px-2.5 py-2 text-xs text-accent"
                  : "flex items-start gap-1.5 rounded-md border border-warning/30 bg-warning-soft px-2.5 py-2 text-xs text-warning"
              }
            >
              {notice.type === "success" ? (
                <CheckCircle2 className="mt-0.5 size-3.5 shrink-0" />
              ) : (
                <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
              )}
              {notice.message}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Authenticating JWT..." : copy.cta}
          </Button>
        </form>

        <div className="mt-4 space-y-1 text-center text-xs text-fg-muted">
          {mode === "login" && (
            <>
              <p>
                <Link href="/forgot-password" className="text-accent hover:underline">
                  Forgot password?
                </Link>
              </p>
              <p>
                No account?{" "}
                <Link href="/register" className="text-accent hover:underline">
                  Create one
                </Link>
              </p>
            </>
          )}
          {mode === "register" && (
            <p>
              Already have an account?{" "}
              <Link href="/login" className="text-accent hover:underline">
                Sign in
              </Link>
            </p>
          )}
          {mode === "forgot" && (
            <p>
              Remembered it?{" "}
              <Link href="/login" className="text-accent hover:underline">
                Back to sign in
              </Link>
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function AuthForm({ mode }: { mode: Mode }) {
  return (
    <React.Suspense fallback={<div className="p-6 text-center text-xs text-fg-muted">Loading form...</div>}>
      <AuthFormInner mode={mode} />
    </React.Suspense>
  );
}
