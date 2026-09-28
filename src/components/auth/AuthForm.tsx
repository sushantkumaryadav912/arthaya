"use client";

import * as React from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
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

export function AuthForm({ mode }: { mode: Mode }) {
  const copy = COPY[mode];
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [notice, setNotice] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setNotice(null);
    try {
      if (mode === "login") await authService.signIn(email, password);
      else if (mode === "register") await authService.signUp(email, password, name);
      else await authService.forgotPassword(email);
      setNotice("Request accepted.");
    } catch (err) {
      setNotice(
        err instanceof Error && err.message
          ? err.message
          : "Authentication is not configured in this demo build.",
      );
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
        <form onSubmit={onSubmit} className="space-y-4">
          {mode === "register" && (
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" autoComplete="name" />
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
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
            <p className="flex items-start gap-1.5 rounded-md border border-warning/30 bg-warning-soft px-2.5 py-2 text-xs text-warning">
              <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
              {notice}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "…" : copy.cta}
          </Button>
        </form>

        <div className="mt-4 space-y-1 text-center text-xs text-fg-muted">
          {mode === "login" && (
            <>
              <p>
                <Link href="/forgot-password" className="text-accent hover:underline">Forgot password?</Link>
              </p>
              <p>
                No account?{" "}
                <Link href="/register" className="text-accent hover:underline">Create one</Link>
              </p>
            </>
          )}
          {mode === "register" && (
            <p>
              Already have an account?{" "}
              <Link href="/login" className="text-accent hover:underline">Sign in</Link>
            </p>
          )}
          {mode === "forgot" && (
            <p>
              Remembered it?{" "}
              <Link href="/login" className="text-accent hover:underline">Back to sign in</Link>
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
