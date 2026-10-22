"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  Briefcase,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Mail,
  Phone,
  ShieldCheck,
  TrendingUp,
  User,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";
import { authService, type RegisterData } from "@/services/authService";

type Mode = "login" | "register" | "forgot";

const COPY: Record<Mode, { title: string; cta: string; subtitle: string }> = {
  login: {
    title: "Sign in to Arthaya",
    cta: "Sign in",
    subtitle: "Access your multi-agent quantitative workspace.",
  },
  register: {
    title: "Create Institutional Account",
    cta: "Register & Initialize Workspace",
    subtitle: "Complete your professional profile for agentic research access.",
  },
  forgot: {
    title: "Reset password",
    cta: "Send recovery link",
    subtitle: "We'll send you an encrypted authentication link.",
  },
};

function AuthFormInner({ mode }: { mode: Mode }) {
  const copy = COPY[mode];
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams?.get("next") || "/dashboard";

  // Standard credentials
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  // Extended registration profile fields
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [organization, setOrganization] = React.useState("");
  const [role, setRole] = React.useState("Quantitative Analyst");
  const [marketFocus, setMarketFocus] = React.useState("US Equities & Tech (NASDAQ / NYSE)");
  const [horizon, setHorizon] = React.useState("5D");
  const [aumRange, setAumRange] = React.useState("$1M – $10M");

  // Agreements
  const [agreeTerms, setAgreeTerms] = React.useState(false);
  const [agreeDisclaimer, setAgreeDisclaimer] = React.useState(false);
  const [subscribeNews, setSubscribeNews] = React.useState(true);

  // Status feedback
  const [notice, setNotice] = React.useState<{ type: "error" | "success"; message: string } | null>(
    null,
  );
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
        }, 350);
      } else if (mode === "register") {
        // Validation checks
        if (!firstName.trim() || !lastName.trim()) {
          throw new Error("Please enter both your First Name and Last Name.");
        }
        if (!organization.trim()) {
          throw new Error("Please specify your Organization or Firm name.");
        }
        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters long.");
        }
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match. Please re-enter.");
        }
        if (!agreeTerms || !agreeDisclaimer) {
          throw new Error("Please review and accept the Terms of Service and Research Disclaimer.");
        }

        const registrationPayload: RegisterData = {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim().toLowerCase(),
          password,
          confirmPassword,
          phone: phone.trim(),
          organization: organization.trim(),
          role,
          marketFocus,
          horizon,
          aumRange,
          agreeToTerms: agreeTerms,
        };

        await authService.signUp(registrationPayload);
        setNotice({
          type: "success",
          message: "Profile configured and authorized via live backend. Launching workspace...",
        });
        setTimeout(() => {
          window.location.href = nextUrl;
        }, 400);
      } else {
        await authService.forgotPassword(email);
        setNotice({
          type: "success",
          message: "Password recovery instructions sent to your email.",
        });
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
    <Card className="border-0 shadow-none bg-transparent">
      <CardHeader className="p-0 pb-6 text-center sm:text-left">
        <CardTitle className="text-xl sm:text-2xl font-bold font-display tracking-tight text-fg">
          {copy.title}
        </CardTitle>
        <p className="text-xs text-fg-muted mt-1">{copy.subtitle}</p>
      </CardHeader>
      <CardContent className="p-0">
        {mode === "login" && (
          <div className="mb-5 rounded-xl border border-accent/30 bg-accent/10 p-3.5 text-xs shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-accent flex items-center gap-1.5">
                <KeyRound className="size-3.5" /> Demo Analyst Access
              </span>
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="rounded-md bg-accent/20 px-2.5 py-1 text-[11px] font-semibold text-accent hover:bg-accent hover:text-bg transition-colors shadow-xs"
              >
                Auto-fill
              </button>
            </div>
            <p className="mt-1.5 text-[11px] text-fg-muted font-mono">
              analyst@arthaya.ai / password123
            </p>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-5">
          {mode === "register" ? (
            <>
              {/* SECTION 1: Personal Information */}
              <div className="space-y-3 rounded-xl border border-border/80 bg-surface/50 p-4">
                <div className="flex items-center gap-2 border-b border-border/60 pb-2 text-xs font-bold text-fg tracking-wide uppercase">
                  <User className="size-3.5 text-accent" /> 1. Personal Information
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1 min-w-0">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="e.g. Sushant"
                      required
                    />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="e.g. Kumar"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1 min-w-0">
                    <Label htmlFor="email">Work / Professional Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="analyst@firm.com"
                      autoComplete="email"
                      required
                    />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <Label htmlFor="phone">Phone / Mobile (with country code)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 019-2834"
                      autoComplete="tel"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: Professional & Market Profile */}
              <div className="space-y-3 rounded-xl border border-border/80 bg-surface/50 p-4">
                <div className="flex items-center gap-2 border-b border-border/60 pb-2 text-xs font-bold text-fg tracking-wide uppercase">
                  <Briefcase className="size-3.5 text-accent" /> 2. Professional & Market Profile
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1 min-w-0">
                    <Label htmlFor="organization">Firm / Organization / Fund *</Label>
                    <Input
                      id="organization"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="e.g. Citadel / Independent"
                      required
                    />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <Label htmlFor="role">Professional Role / Title</Label>
                    <Select
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value="Quantitative Analyst">Quantitative Analyst</option>
                      <option value="Portfolio Manager">Portfolio Manager</option>
                      <option value="Equity Research Analyst">Equity Research Analyst</option>
                      <option value="Hedge Fund Trader">Hedge Fund / Prop Trader</option>
                      <option value="Risk Officer">Risk Management</option>
                      <option value="Private Investor">Private Investor</option>
                      <option value="Financial Researcher">Academic Researcher</option>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1 min-w-0">
                    <Label htmlFor="marketFocus">Primary Market Focus</Label>
                    <Select
                      id="marketFocus"
                      value={marketFocus}
                      onChange={(e) => setMarketFocus(e.target.value)}
                    >
                      <option value="US Equities & Tech (NASDAQ / NYSE)">US Equities & Tech</option>
                      <option value="Indian Equities (NSE / BSE)">Indian Equities (NSE/BSE)</option>
                      <option value="Global Multi-Asset & Macro">Global Multi-Asset</option>
                      <option value="Quantitative & Statistical Arbitrage">Quant & Stat-Arb</option>
                      <option value="Fundamental Long/Short">Fundamental Long/Short</option>
                    </Select>
                  </div>
                  <div className="space-y-1 min-w-0">
                    <Label htmlFor="horizon">Default Analysis Horizon</Label>
                    <Select
                      id="horizon"
                      value={horizon}
                      onChange={(e) => setHorizon(e.target.value)}
                    >
                      <option value="1D">1-Day Tactical</option>
                      <option value="5D">5-Day Predictive (Standard)</option>
                      <option value="20D">20-Day Position</option>
                      <option value="60D">60-Day Long-Term</option>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1 min-w-0">
                  <Label htmlFor="aumRange">Managed AUM / Trading Portfolio Band</Label>
                  <Select
                    id="aumRange"
                    value={aumRange}
                    onChange={(e) => setAumRange(e.target.value)}
                  >
                    <option value="Emerging (< $250k)">Emerging / Research Account (&lt; $250k)</option>
                    <option value="$250k – $1M">$250k – $1M</option>
                    <option value="$1M – $10M">$1M – $10M</option>
                    <option value="$10M – $100M+">$10M – $100M+</option>
                    <option value="Institutional Tier ($100M+)">Institutional Tier ($100M+)</option>
                  </Select>
                </div>
              </div>

              {/* SECTION 3: Security & Credentials */}
              <div className="space-y-3 rounded-xl border border-border/80 bg-surface/50 p-4">
                <div className="flex items-center gap-2 border-b border-border/60 pb-2 text-xs font-bold text-fg tracking-wide uppercase">
                  <ShieldCheck className="size-3.5 text-accent" /> 3. Security Credentials
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1 min-w-0">
                    <Label htmlFor="password">Create Password (min 6 chars) *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        required
                        className="pr-9"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-fg-subtle hover:text-fg transition-colors"
                        title={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1 min-w-0">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      required
                    />
                  </div>
                </div>

                {password && confirmPassword && (
                  <p
                    className={`text-[11px] font-medium flex items-center gap-1 ${
                      password === confirmPassword ? "text-accent" : "text-warning"
                    }`}
                  >
                    {password === confirmPassword ? (
                      <>
                        <CheckCircle2 className="size-3" /> Passwords match
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="size-3" /> Passwords do not match yet
                      </>
                    )}
                  </p>
                )}
              </div>

              {/* SECTION 4: Compliance & Disclaimers */}
              <div className="space-y-2.5 pt-1 text-xs">
                <label className="flex items-start gap-2.5 cursor-pointer text-fg-muted hover:text-fg">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 size-4 rounded border-border-strong text-accent focus:ring-accent"
                    required
                  />
                  <span>
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent underline underline-offset-2 hover:text-accent-hover font-medium inline-flex items-center gap-0.5"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent underline underline-offset-2 hover:text-accent-hover font-medium inline-flex items-center gap-0.5"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </label>


                <label className="flex items-start gap-2.5 cursor-pointer text-fg-muted hover:text-fg">
                  <input
                    type="checkbox"
                    checked={agreeDisclaimer}
                    onChange={(e) => setAgreeDisclaimer(e.target.checked)}
                    className="mt-0.5 size-4 rounded border-border-strong text-accent focus:ring-accent"
                    required
                  />
                  <span>
                    I acknowledge that Arthaya provides quantitative, probabilistic AI research signals and not individual investment advice.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer text-fg-muted hover:text-fg">
                  <input
                    type="checkbox"
                    checked={subscribeNews}
                    onChange={(e) => setSubscribeNews(e.target.checked)}
                    className="mt-0.5 size-4 rounded border-border-strong text-accent focus:ring-accent"
                  />
                  <span>
                    Receive automated model updates and market regime intelligence alerts.
                  </span>
                </label>
              </div>
            </>
          ) : (
            /* Login & Forgot Password Simple View */
            <>
              <div className="space-y-1.5">
                <Label htmlFor="email">Work / Account Email</Label>
                <div className="relative">
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
              </div>

              {mode !== "forgot" && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="/forgot-password" className="text-[11px] text-accent hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      required
                      className="pr-9"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-fg-subtle hover:text-fg transition-colors"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {notice && (
            <p
              className={
                notice.type === "success"
                  ? "flex items-start gap-2 rounded-lg border border-accent/40 bg-accent/15 px-3 py-2.5 text-xs text-accent"
                  : "flex items-start gap-2 rounded-lg border border-warning/30 bg-warning-soft px-3 py-2.5 text-xs text-warning"
              }
            >
              {notice.type === "success" ? (
                <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
              ) : (
                <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              )}
              <span>{notice.message}</span>
            </p>
          )}

          <Button type="submit" className="w-full py-2.5 text-sm font-semibold" disabled={pending}>
            {pending ? "Authenticating with Backend..." : copy.cta}
          </Button>
        </form>

        <div className="mt-5 space-y-1 text-center text-xs text-fg-muted border-t border-border/60 pt-4">
          {mode === "login" && (
            <p>
              Don't have an institutional account?{" "}
              <Link href="/register" className="font-semibold text-accent hover:underline">
                Create one now
              </Link>
            </p>
          )}
          {mode === "register" && (
            <p>
              Already registered?{" "}
              <Link href="/login" className="font-semibold text-accent hover:underline">
                Sign in
              </Link>
            </p>
          )}
          {mode === "forgot" && (
            <p>
              Remembered your credentials?{" "}
              <Link href="/login" className="font-semibold text-accent hover:underline">
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
    <React.Suspense
      fallback={<div className="p-6 text-center text-xs text-fg-muted">Loading authentication module...</div>}
    >
      <AuthFormInner mode={mode} />
    </React.Suspense>
  );
}
