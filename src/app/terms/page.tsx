import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CheckCircle2, ShieldAlert, ShieldCheck, Scale, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Terms and Conditions — Arthaya",
  description: "Terms of service, institutional use guidelines, and research disclaimers for Arthaya Multi-Agent Stock Intelligence.",
};

export default function TermsPage() {
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
                TERMS
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
            <Scale className="size-3.5" /> Institutional Service Agreement
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-fg">
            Terms of Service & Conditions of Use
          </h1>
          <p className="mt-2 text-sm text-fg-muted">
            Effective Date: October 24, 2026 • Platform Version 1.0 (Enterprise Multi-Agent Release)
          </p>
        </div>

        {/* Executive summary banner */}
        <div className="mb-10 rounded-2xl border border-accent/30 bg-accent/5 p-5 sm:p-6 text-sm text-fg-muted space-y-2">
          <h2 className="text-base font-bold text-fg flex items-center gap-2">
            <ShieldCheck className="size-5 text-accent" /> Key Agreement Summary
          </h2>
          <p>
            Arthaya provides autonomous multi-agent quantitative analytics, statistical machine-learning forecasts, and large language model (LLM) research synthesis. By registering an account, accessing, or utilizing any portion of Arthaya, you acknowledge that all platform outputs are <strong>probabilistic computational research signals</strong> and <strong>not individual financial or investment advice</strong>.
          </p>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-10 text-sm leading-relaxed text-fg-muted">
          {/* Section 1 */}
          <section className="space-y-3 rounded-2xl border border-border/70 bg-surface/50 p-6 sm:p-7 shadow-xs">
            <h2 className="text-lg font-bold text-fg flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-lg bg-accent/15 text-xs font-bold text-accent">1</span>
              Scope of Service & Multi-Agent Architecture
            </h2>
            <p>
              Arthaya operates a distributed multi-agent architecture comprising nine specialized autonomous agents (including n8n Orchestrator, Market Data Agent, Technical Analysis Agent, Fundamental Analysis Agent, Web Intelligence Agent, Historical Analogs Agent, Layer-2 ML Prediction Agent, Adversarial Critic Agent, and Synthesis Gateway).
            </p>
            <p>
              The platform executes automated data ingest, computes mathematical indicators (such as RSI, MACD, and Bollinger Bands), evaluates SEC EDGAR filings, scrapes web news sentiment, and feeds calibrated features into quantitative classifiers (such as XGBoost, Random Forest, and Logistic Regression).
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3 rounded-2xl border border-border/70 bg-surface/50 p-6 sm:p-7 shadow-xs">
            <h2 className="text-lg font-bold text-fg flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-lg bg-accent/15 text-xs font-bold text-accent">2</span>
              Zero Financial Advice Warranty & Research-Only Purpose
            </h2>
            <div className="rounded-xl border border-warning/30 bg-warning-soft p-4 text-warning space-y-1.5 text-xs">
              <p className="font-semibold flex items-center gap-1.5">
                <ShieldAlert className="size-4 shrink-0" /> Important Regulatory Disclaimer
              </p>
              <p>
                Arthaya is not a registered investment advisor, broker-dealer, financial planner, or commodities trading advisor under the U.S. Securities and Exchange Commission (SEC), FINRA, SEBI, or any regulatory body.
              </p>
            </div>
            <p>
              All information, analyses, price predictions, direction probabilities (e.g. 5-Day "UP" / "DOWN" likelihoods), model evaluations, and synthesized research reports are provided strictly for informational, educational, and quantitative research purposes. Users must independently evaluate all investment decisions and consult certified financial professionals before committing capital.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 rounded-2xl border border-border/70 bg-surface/50 p-6 sm:p-7 shadow-xs">
            <h2 className="text-lg font-bold text-fg flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-lg bg-accent/15 text-xs font-bold text-accent">3</span>
              Probabilistic Signals & Machine Learning Uncertainty
            </h2>
            <p>
              Quantitative models (including XGBoost, Random Forest, and calibrated logistic regressions) output mathematical probabilities based on historical training windows, cross-validation metrics, and walk-forward evaluations.
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Past statistical performance, walk-forward test accuracy, and historical analog regime matching do not guarantee future market outcomes.</li>
              <li>Financial markets are subject to exogenous macro shocks, liquidity constraints, regulatory shifts, and non-stationarity.</li>
              <li>The Adversarial Critic Agent continuously checks for forward data leakage and signal conflict, but cannot eliminate market risk.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 rounded-2xl border border-border/70 bg-surface/50 p-6 sm:p-7 shadow-xs">
            <h2 className="text-lg font-bold text-fg flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-lg bg-accent/15 text-xs font-bold text-accent">4</span>
              User Accounts, Registration & Credential Integrity
            </h2>
            <p>
              During account registration, you agree to provide truthful, accurate, and complete professional details (including institutional affiliation, professional role, and contact information).
            </p>
            <p>
              You are responsible for maintaining the confidentiality of your credentials, JWT session tokens, and passwords. You agree to notify Arthaya immediately upon becoming aware of any unauthorized access or security breach involving your account.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3 rounded-2xl border border-border/70 bg-surface/50 p-6 sm:p-7 shadow-xs">
            <h2 className="text-lg font-bold text-fg flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-lg bg-accent/15 text-xs font-bold text-accent">5</span>
              Third-Party Data Providers & API Availability
            </h2>
            <p>
              Arthaya interfaces with third-party data providers including market data feeds (yfinance / exchanges), SEC EDGAR document filings, Firecrawl web crawlers, Apify extractors, and LLM Model Gateways (Anthropic Claude, Google Gemini, Mistral, and Groq).
            </p>
            <p>
              Arthaya does not warrant uninterrupted, error-free data availability from external feeds. Providers may experience latency, rate-limiting, or downtime that temporarily impacts indicator calculation or report generation.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3 rounded-2xl border border-border/70 bg-surface/50 p-6 sm:p-7 shadow-xs">
            <h2 className="text-lg font-bold text-fg flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-lg bg-accent/15 text-xs font-bold text-accent">6</span>
              Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by applicable law, in no event shall Arthaya, its contributors, affiliates, agents, or licensors be liable for any direct, indirect, punitive, incidental, special, consequential, or exemplary damages—including but not limited to damages for loss of profits, trading losses, goodwill, or capital depreciation—arising out of or in connection with the use or inability to use this platform.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3 rounded-2xl border border-border/70 bg-surface/50 p-6 sm:p-7 shadow-xs">
            <h2 className="text-lg font-bold text-fg flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-lg bg-accent/15 text-xs font-bold text-accent">7</span>
              Modifications to Agreement
            </h2>
            <p>
              Arthaya reserves the right to modify these Terms at any time. Continued use of the platform following the posting of revised terms constitutes your acceptance of and agreement to the modified provisions.
            </p>
          </section>
        </div>

        {/* Footer Actions */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/80 pt-8">
          <Link
            href="/privacy"
            className="text-xs text-accent hover:underline flex items-center gap-1"
          >
            <FileText className="size-3.5" /> View Privacy Policy
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
