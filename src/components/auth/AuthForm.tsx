"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  Briefcase,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  ShieldCheck,
  User,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";
import { authService, type RegisterData } from "@/services/authService";

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (config: { client_id: string; callback: (res: { credential: string }) => void }) => void;
          prompt: (cb?: (notification: { isNotDisplayed: () => boolean; isSkippedMoment: () => boolean }) => void) => void;
        };
      };
    };
  }
}

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

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function AuthFormInner({ mode }: { mode: Mode }) {
  const copy = COPY[mode];
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

  const handleGitHubCallback = React.useCallback(
    async (code: string) => {
      setPending(true);
      setNotice({
        type: "success",
        message: "Exchanging GitHub authorization code with live backend...",
      });
      try {
        const user = await authService.loginWithGitHub(code);
        setNotice({
          type: "success",
          message: `Authenticated via GitHub as ${user.name || user.email}! Launching workspace...`,
        });
        setTimeout(() => {
          window.location.href = nextUrl;
        }, 400);
      } catch (err) {
        setNotice({
          type: "error",
          message: err instanceof Error ? err.message : "GitHub OAuth validation failed on backend.",
        });
        setPending(false);
      }
    },
    [nextUrl],
  );

  const handleGoogleCallback = React.useCallback(
    async (idToken: string) => {
      setPending(true);
      setNotice({
        type: "success",
        message: "Exchanging Google credential with live backend...",
      });
      try {
        const user = await authService.loginWithGoogle(idToken);
        setNotice({
          type: "success",
          message: `Authenticated via Google as ${user.name || user.email}! Launching workspace...`,
        });
        setTimeout(() => {
          window.location.href = nextUrl;
        }, 400);
      } catch (err) {
        setNotice({
          type: "error",
          message: err instanceof Error ? err.message : "Google OAuth verification failed on backend.",
        });
        setPending(false);
      }
    },
    [nextUrl],
  );

  const initGoogleGsi = React.useCallback(() => {
    if (typeof window === "undefined" || !window.google?.accounts?.id) return;
    try {
      window.google.accounts.id.initialize({
        client_id: "709981652871-ooh40oomj1outfprsq4vcrh3333omv6v.apps.googleusercontent.com",
        callback: (response: { credential: string }) => {
          if (response?.credential) {
            handleGoogleCallback(response.credential);
          }
        },
      });
    } catch (e) {
      console.warn("Google GSI initialization notice:", e);
    }
  }, [handleGoogleCallback]);

  // Handle incoming OAuth redirects and script loading
  React.useEffect(() => {
    // 1. Detect GitHub code in query params
    const code = searchParams.get("code");
    if (code) {
      handleGitHubCallback(code);
      return;
    }

    // 2. Detect Google id_token in hash (#id_token=...)
    if (typeof window !== "undefined" && window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const idToken = hashParams.get("id_token");
      if (idToken) {
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
        handleGoogleCallback(idToken);
        return;
      }
    }

    // 3. Load Google Identity Services script
    if (typeof window !== "undefined") {
      const existingScript = document.getElementById("google-gsi-client");
      if (!existingScript) {
        const script = document.createElement("script");
        script.id = "google-gsi-client";
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = () => initGoogleGsi();
        document.body.appendChild(script);
      } else {
        initGoogleGsi();
      }
    }
  }, [searchParams, handleGitHubCallback, handleGoogleCallback, initGoogleGsi]);

  const triggerGoogleOAuth = () => {
    setPending(true);
    setNotice(null);

    // If Google GSI prompt is available, open one-tap/popup prompt
    if (typeof window !== "undefined" && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.prompt((notification: { isNotDisplayed: () => boolean; isSkippedMoment: () => boolean }) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            redirectToGoogleImplicit();
          }
        });
        return;
      } catch {
        // Fall back to direct OAuth redirect
      }
    }

    redirectToGoogleImplicit();
  };

  const redirectToGoogleImplicit = () => {
    const clientId = "709981652871-ooh40oomj1outfprsq4vcrh3333omv6v.apps.googleusercontent.com";
    const redirectUri = window.location.origin + window.location.pathname;
    const nonce = Math.random().toString(36).substring(2);
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
      clientId,
    )}&response_type=id_token&scope=openid%20email%20profile&redirect_uri=${encodeURIComponent(
      redirectUri,
    )}&nonce=${nonce}`;

    window.location.href = googleAuthUrl;
  };

  const triggerGitHubOAuth = async () => {
    setPending(true);
    setNotice(null);
    try {
      const config = await authService.getOAuthConfig();
      const clientId = config.github?.clientId || "Ov23liNxGegvzY9xfUsA";
      const redirectUri = window.location.origin + window.location.pathname;
      const url = `https://github.com/login/oauth/authorize?client_id=${encodeURIComponent(
        clientId,
      )}&scope=user:email&redirect_uri=${encodeURIComponent(redirectUri)}`;
      window.location.href = url;
    } catch {
      const redirectUri = window.location.origin + window.location.pathname;
      window.location.href = `https://github.com/login/oauth/authorize?client_id=Ov23liNxGegvzY9xfUsA&scope=user:email&redirect_uri=${encodeURIComponent(
        redirectUri,
      )}`;
    }
  };

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
        setNotice({ type: "success", message: "JWT authenticated via live backend. Entering workspace..." });
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
        {/* Quick Demo Analyst Credentials on Login */}
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
            <p className="mt-1 text-[10px] text-fg-subtle">
              Use demo credentials for instant analyst access. All other accounts are validated in real time via Firebase Auth.
            </p>
          </div>
        )}

        {/* OAuth Buttons (Google & GitHub Bounded to Live Backend) */}
        {mode !== "forgot" && (
          <div className="space-y-3 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={triggerGoogleOAuth}
                disabled={pending}
                className="flex items-center justify-center gap-2.5 rounded-lg border border-border bg-panel py-2.5 px-3 text-xs font-semibold text-fg transition-all hover:bg-elevated hover:border-border-strong hover:shadow-xs disabled:opacity-50"
              >
                <GoogleIcon className="size-4 shrink-0" />
                <span>Continue with Google</span>
              </button>

              <button
                type="button"
                onClick={triggerGitHubOAuth}
                disabled={pending}
                className="flex items-center justify-center gap-2.5 rounded-lg border border-border bg-panel py-2.5 px-3 text-xs font-semibold text-fg transition-all hover:bg-elevated hover:border-border-strong hover:shadow-xs disabled:opacity-50"
              >
                <GitHubIcon className="size-4 shrink-0" />
                <span>Continue with GitHub</span>
              </button>
            </div>

            <div className="relative flex items-center justify-center pt-2">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-border/80" />
              </div>
              <div className="relative bg-surface px-3 text-[11px] font-medium text-fg-subtle uppercase tracking-wider">
                Or continue with {mode === "register" ? "institutional profile" : "credentials"}
              </div>
            </div>
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
                      placeholder="analyst@fund.com"
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
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: Professional Profile */}
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
                      placeholder="e.g. Citadel, Bridgewater, AlphaFund"
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
                      <option value="Quantitative Analyst / Modeler">Quantitative Analyst / Modeler</option>
                      <option value="Portfolio Manager / Trader">Portfolio Manager / Trader</option>
                      <option value="Risk Manager / Strategist">Risk Manager / Strategist</option>
                      <option value="Research Associate / Intern">Research Associate / Intern</option>
                      <option value="Individual High-Frequency Trader">Individual High-Frequency Trader</option>
                      <option value="Institutional Executive">Institutional Executive</option>
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
                      <option value="US Equities & Tech (NASDAQ / NYSE)">US Equities & Tech (NASDAQ / NYSE)</option>
                      <option value="India Equities (NSE / BSE)">India Equities (NSE / BSE)</option>
                      <option value="Cross-Border Global Multi-Asset">Cross-Border Global Multi-Asset</option>
                      <option value="Macro & FX Correlation">Macro & FX Correlation</option>
                    </Select>
                  </div>
                  <div className="space-y-1 min-w-0">
                    <Label htmlFor="horizon">Default Analysis Horizon</Label>
                    <Select
                      id="horizon"
                      value={horizon}
                      onChange={(e) => setHorizon(e.target.value)}
                    >
                      <option value="1D">1-Day Intraday & Next-Day Close</option>
                      <option value="5D">5-Day Multi-Agent Predictive Horizon (Standard)</option>
                      <option value="20D">20-Day Swing & Regime Trajectory</option>
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
                    <option value="< $1M">&lt; $1M (Proprietary / Pilot Account)</option>
                    <option value="$1M – $10M">$1M – $10M (Emerging Fund / Desk)</option>
                    <option value="$10M – $100M">$10M – $100M (Mid-Tier Institutional)</option>
                    <option value="> $100M">&gt; $100M (Large Institutional Asset Manager)</option>
                  </Select>
                </div>
              </div>

              {/* SECTION 3: Security Credentials */}
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
                      password === confirmPassword ? "text-positive" : "text-negative"
                    }`}
                  >
                    {password === confirmPassword ? (
                      <>
                        <CheckCircle2 className="size-3" /> Passwords match
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="size-3" /> Passwords do not match
                      </>
                    )}
                  </p>
                )}
              </div>

              {/* SECTION 4: Terms & Disclaimers */}
              <div className="space-y-2.5 rounded-xl border border-border/70 bg-panel/30 p-3.5 text-xs">
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
            {pending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" /> Authenticating with Backend...
              </span>
            ) : (
              copy.cta
            )}
          </Button>
        </form>

        <div className="mt-5 space-y-1 text-center text-xs text-fg-muted border-t border-border/60 pt-4">
          {mode === "login" && (
            <p>
              Don&apos;t have an institutional account?{" "}
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
