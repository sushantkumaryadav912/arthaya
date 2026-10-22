import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CheckCircle2, Lock, Shield, Eye, Database, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Privacy Policy — Arthaya",
  description: "Privacy and data protection policy for Arthaya Multi-Agent Stock Intelligence platform.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-bg text-fg">
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-border/80 bg-surface/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex size-9 items-center justify-center rounded-xl border border-accent/40 bg-surface p-1.5 shadow-sm group-hover:border-accent transition-colors">
              <Image
                src="/arthaya_logo.png"
                alt="Arthaya"
                width={28}
                height={28}
                className="rounded-lg object-contain"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-lg text-fg tracking-tight">Arthaya</span>
              <span className="rounded bg-accent/15 px-1.5 py-0.5 text-[9px] font-semibold text-accent border border-accent/30">
                PRIVACY
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-fg-muted hover:text-fg hover:border-accent/40 transition-colors"
            >
              <ArrowLeft className="size-3.5" /> Back to Register
            </Link>
            <Link href="/login">
              <Button size="sm" className="h-8 text-xs font-semibold px-3.5">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        {/* Hero badge & title */}
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent mb-3">
            <Shield className="size-3.5" /> Data Protection & Confidentiality
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-fg">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-fg-muted">
            Effective Date: October 24, 2026 • Platform Version 1.0 (Enterprise Multi-Agent Release)
          </p>
        </div>

        {/* Commitment Banner */}
        <div className="mb-10 rounded-2xl border border-accent/30 bg-accent/5 p-5 sm:p-6 text-sm text-fg-muted space-y-2">
          <h2 className="text-base font-bold text-fg flex items-center gap-2">
            <Lock className="size-5 text-accent" /> Institutional Data Privacy Commitment
          </h2>
          <p>
            At Arthaya, we recognize that quantitative research strategies, portfolio preferences, and institutional identities require the highest standard of data privacy. We never monetize, sell, or rent your research data or institutional profile to third parties.
          </p>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-10 text-sm leading-relaxed text-fg-muted">
          {/* Section 1 */}
          <section className="space-y-3 rounded-2xl border border-border/70 bg-surface/50 p-6 sm:p-7 shadow-xs">
            <h2 className="text-lg font-bold text-fg flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-lg bg-accent/15 text-xs font-bold text-accent">1</span>
              Information We Collect
            </h2>
            <p>
              When you register and interact with the Arthaya multi-agent platform, we collect the following categories of information:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Account & Institutional Profile:</strong> Your full name, professional email address, phone number, organization or firm affiliation, primary market focus (e.g. US Equities, Indian Equities), default analysis horizon (e.g. 5D, 20D), and managed AUM range.</li>
              <li><strong>Authentication Credentials:</strong> Encrypted password hashes, OAuth session identifiers (Google/GitHub/Firebase), and issued JWT access tokens.</li>
              <li><strong>Research & Workspace Telemetry:</strong> Tickers queried, analyses initiated, model gateway preferences selected, and generated research reports saved to your workspace.</li>
              <li><strong>Technical Metadata:</strong> IP address, browser type, device information, and interaction timestamps.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3 rounded-2xl border border-border/70 bg-surface/50 p-6 sm:p-7 shadow-xs">
            <h2 className="text-lg font-bold text-fg flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-lg bg-accent/15 text-xs font-bold text-accent">2</span>
              Zero Access to Private Brokerage or Custody Accounts
            </h2>
            <div className="rounded-xl border border-accent/30 bg-accent/10 p-4 text-xs space-y-1">
              <p className="font-semibold text-accent flex items-center gap-1.5">
                <CheckCircle2 className="size-4 shrink-0" /> Zero Custody & Brokerage Isolation
              </p>
              <p className="text-fg-muted">
                Arthaya does not connect to your live brokerage, clearing firm, or bank accounts. All multi-agent research calculations are conducted entirely using public market data feeds, SEC EDGAR public filings, and quantitative models.
              </p>
            </div>
            <p>
              The platform does not execute financial transactions, hold capital, or transmit trade orders to market centers.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 rounded-2xl border border-border/70 bg-surface/50 p-6 sm:p-7 shadow-xs">
            <h2 className="text-lg font-bold text-fg flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-lg bg-accent/15 text-xs font-bold text-accent">3</span>
              How We Use Your Information
            </h2>
            <p>We process your data exclusively for the following purposes:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>To authenticate your session via secure JWT tokens and enforce authorized route protection across the workspace.</li>
              <li>To tailor your dashboard, watchlist, and default analysis horizons to your firm's investment preferences.</li>
              <li>To route multi-agent pipeline executions and display real-time SSE progress events.</li>
              <li>To detect security incidents, prevent abuse, and maintain backend service health.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 rounded-2xl border border-border/70 bg-surface/50 p-6 sm:p-7 shadow-xs">
            <h2 className="text-lg font-bold text-fg flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-lg bg-accent/15 text-xs font-bold text-accent">4</span>
              LLM Model Gateway & Zero PII Transmission
            </h2>
            <p>
              When the Synthesis Agent generates research reports using our Model Gateway (such as Claude 3.5 Sonnet, Gemini 2.0 Flash, or Mistral Large), only aggregated financial metrics, technical indicators, and news sentiment vectors are transmitted to the model.
            </p>
            <p>
              <strong>Zero personally identifiable information (PII)</strong>—such as your name, email, phone number, or firm—is ever passed to underlying third-party LLM inference providers.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3 rounded-2xl border border-border/70 bg-surface/50 p-6 sm:p-7 shadow-xs">
            <h2 className="text-lg font-bold text-fg flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-lg bg-accent/15 text-xs font-bold text-accent">5</span>
              Cookies & Local Storage Policy
            </h2>
            <p>
              We utilize minimal, strictly functional cookies and local storage tokens:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>arthaya_token (Cookie):</strong> Secure session cookie used by Next.js middleware to authenticate workspace transitions.</li>
              <li><strong>arthaya:token & arthaya:user (Local Storage):</strong> Client-side storage utilized to maintain user state and authenticate API requests with the live backend.</li>
              <li>We do <strong>not</strong> employ third-party advertising cookies, social media trackers, or retargeting pixels.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-3 rounded-2xl border border-border/70 bg-surface/50 p-6 sm:p-7 shadow-xs">
            <h2 className="text-lg font-bold text-fg flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-lg bg-accent/15 text-xs font-bold text-accent">6</span>
              Data Security & Encryption
            </h2>
            <p>
              All communications between your browser, our Next.js frontend, and the Render FastAPI backend are encrypted in transit using Transport Layer Security (TLS 1.3 / HTTPS). Database records are encrypted at rest with industry-standard cryptographic algorithms.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3 rounded-2xl border border-border/70 bg-surface/50 p-6 sm:p-7 shadow-xs">
            <h2 className="text-lg font-bold text-fg flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-lg bg-accent/15 text-xs font-bold text-accent">7</span>
              Your Rights & Data Portability
            </h2>
            <p>
              In accordance with international privacy frameworks (including GDPR and CCPA), you have the right to request a copy of your stored profile data, update inaccurate information, or request the complete deletion of your account and associated research history.
            </p>
          </section>
        </div>

        {/* Footer Actions */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/80 pt-8">
          <Link
            href="/terms"
            className="text-xs text-accent hover:underline flex items-center gap-1"
          >
            <FileText className="size-3.5" /> View Terms of Service
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/register">
              <Button className="h-9 px-5 text-xs font-semibold">
                Accept & Proceed to Registration
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
