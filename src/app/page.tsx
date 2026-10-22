"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bot,
  Brain,
  CheckCircle2,
  ChevronDown,
  Cpu,
  Database,
  ExternalLink,
  Eye,
  FileCheck2,
  FileText,
  Flame,
  Gauge,
  GitCompare,
  Globe,
  Layers,
  LineChart,
  Lock,
  Moon,
  Network,
  RefreshCw,
  Scale,
  Search,
  Shield,
  ShieldAlert,
  Sparkles,
  Sun,
  TrendingDown,
  TrendingUp,
  Zap,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { AGENT_PIPELINE } from "@/lib/constants/agents";
import { cn } from "@/lib/utils/cn";
import { authService, type AuthUser } from "@/services/authService";

// Agent detail metadata for the interactive showcase
const AGENT_SPEC_DETAILS: Record<
  string,
  {
    role: string;
    icon: React.ElementType;
    color: string;
    tools: string[];
    contractIn: string;
    contractOut: string;
    details: string;
  }
> = {
  orchestrator: {
    role: "DAG Execution Coordinator & Replanning Master",
    icon: Network,
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    tools: ["PlanDecomposer", "DAGScheduler", "ArbitrationCoordinator"],
    contractIn: "Symbol, Horizon, Depth, LLM Gateway Choice",
    contractOut: "Execution graph, sub-task budgets, arbitration directives",
    details:
      "Breaks unstructured investor inquiries into structured dependency graphs. When downstream agents report conflicting signals, the Orchestrator initiates an adaptive replanning routine.",
  },
  market: {
    role: "Microstructure & Volatility Ingestion",
    icon: Activity,
    color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
    tools: ["YFinanceIngestion", "VolatilityEngine (ATR, Beta)", "OrderBookDepth"],
    contractIn: "Ticker symbol, jurisdictional exchange",
    contractOut: "Normalized OHLCV series, ATR, volatility regime classification",
    details:
      "Ingests raw tick and candle data across global venues, standardizes time series, and classifies volatility regimes to contextualize upstream indicators.",
  },
  technical: {
    role: "Quantitative Momentum & Oscillator Hypotheses",
    icon: TrendingUp,
    color: "text-blue-400 bg-blue-500/10 border-blue-500/30",
    tools: ["QuantitativeIndicatorSuite (RSI, MACD, Bollinger Bands, EMA Ribbon)"],
    contractIn: "Normalized OHLCV series from Market Data Agent",
    contractOut: "Directional bias (Bullish/Bearish), indicator metrics, conviction score",
    details:
      "Formulates mathematical momentum and mean-reversion hypotheses without hand-waving, testing trend robustness against multiple timeframe moving averages.",
  },
  fundamental: {
    role: "Intrinsic Valuation & Financial Statement Analysis",
    icon: FileText,
    color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    tools: ["FinancialStatementAnalyzer", "MultipleValuer (P/E, EV/EBITDA, FCF)"],
    contractIn: "SEC 10-K / 10-Q filings, historical balance sheets",
    contractOut: "Sector relative rank, operating margin health, intrinsic valuation bounds",
    details:
      "Mines quarterly balance sheets, income statements, and cash flows to assess capital efficiency, debt solvency, and multiple expansions relative to sector peers.",
  },
  news: {
    role: "Real-time Corporate Catalyst & Sentiment Scoring",
    icon: Globe,
    color: "text-purple-400 bg-purple-500/10 border-purple-500/30",
    tools: ["SentimentNLP", "CatalystExtractor", "RegulatoryNewswireScraper"],
    contractIn: "Newswire feeds, regulatory filings RSS, earnings call transcripts",
    contractOut: "Polarity score (-1.0 to +1.0), event catalyst tags, regulatory risk level",
    details:
      "Extracts breaking corporate developments, leadership changes, antitrust actions, and macroeconomic headlines, scoring sentiment with calibrated domain-specific NLP.",
  },
  historical: {
    role: "Macroeconomic Regime Matching & Precedent Cycles",
    icon: RefreshCw,
    color: "text-orange-400 bg-orange-500/10 border-orange-500/30",
    tools: ["MacroRegimeAnalogEngine", "DynamicTimeWarping (DTW) Similarity"],
    contractIn: "Consolidated volatility, inflation, and momentum feature vectors",
    contractOut: "Matched historical analog windows, post-regime return distributions",
    details:
      "Scans decades of historical market cycles to find macroeconomic analogs matching today's rate environment and volatility profile, uncovering historical precedent probabilities.",
  },
  prediction: {
    role: "Multi-Model Machine Learning Probabilistic Ensemble",
    icon: Cpu,
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    tools: ["MLCalibratedEnsemble (Logistic Regression, Random Forest, Gradient Boost)"],
    contractIn: "Consolidated quantitative vectors from upstream agents",
    contractOut: "Calibrated probability distribution (UP / NEUTRAL / DOWN), confidence intervals",
    details:
      "Combines predictions across an ensemble of tuned machine learning classifiers. Applies probability calibration to eliminate overconfidence and provide mathematical certainty intervals.",
  },
  critic: {
    role: "Adversarial Auditor & Conflict Arbitration Engine",
    icon: ShieldAlert,
    color: "text-rose-400 bg-rose-500/10 border-rose-500/30",
    tools: ["AdversarialAuditor", "SignalConsistencyChecker", "ZeroLeakageAuditor"],
    contractIn: "Raw outputs of Technical, News, Fundamentals, and Prediction agents",
    contractOut: "Data freshness audit, conflict score, re-planning arbitration demand",
    details:
      "The critical agentic safeguard. Audits every claim against zero lookahead bias. When technical breakout signals clash with negative regulatory catalysts (conflict score > 0.65), the Critic rejects consensus and forces a dynamic replan.",
  },
  synthesis: {
    role: "Institutional Research Dossier & Claim Provenance Compiler",
    icon: FileCheck2,
    color: "text-teal-400 bg-teal-500/10 border-teal-500/30",
    tools: ["LLMSynthesisDossier (Claude 3.5, Gemini 1.5, Mistral, Groq)"],
    contractIn: "Audited cross-agent outputs, provenance metadata, risk registers",
    contractOut: "Executive summary, thesis, bull/bear vectors, claim-level citations",
    details:
      "Synthesizes the audited multi-agent intelligence into an institutional-grade investment research report. Every insight includes traceable provenance linking directly to raw evidence.",
  },
};

const COMPARISON_POINTS = [
  {
    category: "Architecture",
    terminals: "Fragmented, static terminal screens with zero automated reasoning.",
    monolithic: "Single prompt sent to one LLM; no tools, no specialized roles.",
    arthaya: "9 autonomous domain specialists connected via dynamic DAG & message buses.",
  },
  {
    category: "Signal Conflicts",
    terminals: "Analyst must manually notice conflicting charts and news reports.",
    monolithic: "Hallucinates or glosses over conflicting metrics without auditing.",
    arthaya: "Adversarial Critic computes conflict scores (> 0.65 triggers dynamic replanning).",
  },
  {
    category: "Mathematical Rigor",
    terminals: "Hardcoded formulas without probabilistic forecasts or macro analogs.",
    monolithic: "Frequently fabricates numbers; incapable of deterministic indicator math.",
    arthaya: "Strict Python quantitative suite + calibrated multi-model ML ensemble.",
  },
  {
    category: "Verifiability & Provenance",
    terminals: "Disconnected data feeds; no synthesized provenance trail.",
    monolithic: "Black box response; impossible to verify what source generated each claim.",
    arthaya: "100% claim-by-claim provenance badges linked to source indicators & filings.",
  },
];

const FAQS = [
  {
    question: "What is Arthaya?",
    answer:
      "Arthaya is an autonomous, research-grade multi-agent financial intelligence and quantitative equity analysis platform. Named after the Sanskrit concept of 'Artha' (purposeful wealth created through sound discernment), Arthaya coordinates 9 specialized AI agents to analyze market microstructure, evaluate SEC filings, score news sentiment, run calibrated machine learning prediction ensembles, and compile institutional-grade research dossiers with complete claim provenance.",
  },
  {
    question: "How does Arthaya prove it is a genuine agentic system rather than a fixed workflow?",
    answer:
      "A simple workflow executes immutable sequential steps (Step 1 -> Step 2 -> Step 3) regardless of findings. Arthaya is fundamentally agentic: when the Adversarial Critic detects an irreconcilable conflict (e.g. strong technical breakout momentum clashing with an active regulatory antitrust lawsuit with conflict score > 0.65), it rejects consensus and triggers an arbitration loop where the Orchestrator dynamically forces a re-plan, penalizes downside risk vectors, and recalibrates the prediction ensemble on the fly.",
  },
  {
    question: "How does Arthaya prevent hallucinations?",
    answer:
      "By decoupling mathematical calculations from language generation. All quantitative indicators (RSI, MACD, Bollinger Bands, ATR) are computed deterministically using mathematical engines. Predictions are produced by calibrated ML ensembles (Logistic Regression, Random Forest, Gradient Boost). The LLM is only utilized for semantic synthesis under strict schema constraints, audited by the Adversarial Critic for zero data leakage and factual alignment.",
  },
  {
    question: "Can I choose which frontier LLM powers the synthesis?",
    answer:
      "Yes. Arthaya features a Multi-Model LLM Gateway allowing users to seamlessly toggle between Anthropic Claude 3.5 Sonnet, Google Gemini 1.5 Pro, Mistral Large, and Groq Llama-3 70B directly from the Live Analysis workspace.",
  },
  {
    question: "Is Arthaya financial or investment advice?",
    answer:
      "No. Arthaya is an educational, research, and demonstration platform. All market quotes, model weights, indicators, and predictions in this deployment are simulated and illustrative. Nothing generated by Arthaya constitutes financial, investment, or trading advice.",
  },
];

export default function HomePage() {
  const [selectedAgent, setSelectedAgent] = React.useState<string>("orchestrator");
  const [openFaq, setOpenFaq] = React.useState<number | null>(0);
  const [isLight, setIsLight] = React.useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState<AuthUser | null>(null);

  // Default to light screen! Only switch to dark if explicitly configured as "dark"
  React.useEffect(() => {
    const stored = localStorage.getItem("arthaya:theme");
    const isDark = stored === "dark";
    const lightMode = !isDark;
    setIsLight(lightMode);
    document.documentElement.classList.toggle("light", lightMode);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  // Validate JWT session with backend
  React.useEffect(() => {
    let mounted = true;
    authService.getCurrentUser().then((u) => {
      if (mounted && u) setCurrentUser(u);
    });
    authService.validateToken().then((res) => {
      if (mounted) {
        setCurrentUser(res.authorized ? res.user : null);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handleLogout = async () => {
    await authService.signOut();
    setCurrentUser(null);
  };

  const toggleTheme = () => {
    const next = !isLight;
    setIsLight(next);
    document.documentElement.classList.toggle("light", next);
    document.documentElement.classList.toggle("dark", !next);
    localStorage.setItem("arthaya:theme", next ? "light" : "dark");
  };

  const activeSpec = AGENT_SPEC_DETAILS[selectedAgent] ?? AGENT_SPEC_DETAILS.orchestrator;
  const ActiveIcon = activeSpec.icon;

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-bg text-fg selection:bg-accent/30 selection:text-white">
      {/* Ambient background glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 size-[650px] rounded-full bg-accent/10 blur-[150px] opacity-75" />
        <div className="absolute top-1/3 -left-48 size-[450px] rounded-full bg-cyan-500/10 blur-[140px] opacity-50" />
        <div className="absolute top-2/3 -right-48 size-[500px] rounded-full bg-emerald-600/10 blur-[160px] opacity-50" />
      </div>

      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-border/80 bg-surface/85 backdrop-blur-md transition-all shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo & Brand Header */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative flex size-10 items-center justify-center rounded-xl border border-accent/40 bg-bg p-1 shadow-inner transition-all duration-300 group-hover:border-accent group-hover:shadow-[0_0_18px_rgba(16,185,129,0.4)]">
              <Image
                src="/arthaya_logo.png"
                alt="Arthaya Logo"
                width={30}
                height={30}
                priority
                className="rounded-lg object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-display text-lg font-bold tracking-tight text-fg transition-colors group-hover:text-accent">
                  Arthaya
                </span>
                <span className="rounded bg-accent/15 px-1.5 py-0.5 text-[9px] font-semibold text-accent border border-accent/25">
                  AI SWARM
                </span>
              </div>
              <span className="text-[10px] font-medium tracking-wide text-fg-subtle">
                Multi-Agent Stock Intelligence
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-fg-muted">
            <a href="#about" className="hover:text-accent transition-colors">
              About Arthaya
            </a>
            <a href="#agents" className="hover:text-accent transition-colors">
              The 9 Agents
            </a>
            <a href="#architecture" className="hover:text-accent transition-colors">
              Agentic Architecture
            </a>
            <a href="#capabilities" className="hover:text-accent transition-colors">
              Capabilities
            </a>
            <a href="#faq" className="hover:text-accent transition-colors">
              FAQ
            </a>
          </nav>

          {/* Actions: Theme Toggle, Auth Status & Dashboard Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="flex size-9 items-center justify-center rounded-lg border border-border/80 text-fg-muted hover:border-accent/40 hover:bg-elevated hover:text-accent transition-all duration-200"
              aria-label="Toggle light/dark theme"
            >
              {isLight ? <Moon className="size-4" /> : <Sun className="size-4" />}
            </button>

            {currentUser ? (
              <>
                <div className="hidden sm:flex items-center gap-1.5 rounded-lg border border-accent/30 bg-accent/10 px-2.5 py-1.5 text-xs text-accent">
                  <span className="size-2 rounded-full bg-accent animate-pulse" />
                  <span className="font-medium max-w-[120px] truncate">
                    {currentUser.name || currentUser.email}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-fg-muted hover:text-red-400 hover:border-red-500/40 hover:bg-elevated transition-colors"
                >
                  <LogOut className="size-3.5" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <Link
                href="/login?next=/dashboard"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-fg-muted hover:text-accent hover:border-accent/40 hover:bg-elevated transition-colors"
              >
                <span>Sign In</span>
              </Link>
            )}

            <Link
              href="/dashboard"
              className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-bg hover:bg-accent-strong transition-all duration-200 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_22px_rgba(16,185,129,0.5)] active:scale-95"
            >
              <span>Enter Dashboard</span>
              <ArrowUpRight className="size-3.5" />
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex size-9 items-center justify-center rounded-lg border border-border/80 text-fg-muted hover:text-fg"
              aria-label="Toggle menu"
            >
              <div className="space-y-1">
                <span className="block h-0.5 w-4 bg-current"></span>
                <span className="block h-0.5 w-4 bg-current"></span>
                <span className="block h-0.5 w-4 bg-current"></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-border bg-surface px-4 py-3 space-y-2 text-sm font-medium">
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-fg-muted hover:text-accent"
            >
              About Arthaya
            </a>
            <a
              href="#agents"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-fg-muted hover:text-accent"
            >
              The 9 Agents
            </a>
            <a
              href="#architecture"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-fg-muted hover:text-accent"
            >
              Agentic Architecture
            </a>
            <a
              href="#capabilities"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-fg-muted hover:text-accent"
            >
              Capabilities
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-fg-muted hover:text-accent"
            >
              FAQ
            </a>
            <div className="pt-2 border-t border-border space-y-2">
              {currentUser ? (
                <div className="flex items-center justify-between py-1 text-xs text-accent">
                  <span>Signed in as {currentUser.name || currentUser.email}</span>
                  <button onClick={handleLogout} className="text-red-400 underline">
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/login?next=/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center rounded-lg border border-border py-2 text-xs font-semibold text-fg"
                >
                  Sign In
                </Link>
              )}
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-lg bg-accent py-2 text-xs font-semibold text-bg"
              >
                <span>Enter Dashboard</span>
                <ArrowUpRight className="size-3.5" />
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Sections */}
      <main className="relative z-10">
        {/* HERO SECTION */}
        <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1 text-xs font-medium text-accent backdrop-blur-md mb-8 shadow-sm">
              <Sparkles className="size-3.5 text-accent animate-pulse" />
              <span>Autonomous Multi-Agent Equity Research & Quantitative Intelligence</span>
            </div>

            {/* Massive Heading */}
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-fg max-w-5xl mx-auto leading-[1.08]">
              Institutional Stock Intelligence.{" "}
              <span className="bg-gradient-to-r from-accent via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Orchestrated by 9 AI Specialists.
              </span>
            </h1>

            {/* Subheading */}
            <p className="mt-6 text-base sm:text-lg md:text-xl text-fg-muted max-w-3xl mx-auto leading-relaxed">
              Arthaya replaces fragmented financial terminals and hallucinating single-prompt LLMs
              with an autonomous swarm of reasoning AI agents. Real-time tick ingestion, quantitative
              technical indicators, SEC fundamental valuation, NLP sentiment mining, calibrated
              probabilistic ML ensembles, and an active Adversarial Critic arbitration loop.
            </p>

            {/* CTA Group */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-semibold text-bg shadow-[0_0_25px_rgba(16,185,129,0.35)] hover:shadow-[0_0_35px_rgba(16,185,129,0.55)] hover:bg-accent-strong transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95"
              >
                <span>Launch Live Terminal</span>
                <ArrowRight className="size-4" />
              </Link>

              <Link
                href="/analyze"
                className="flex items-center gap-2 rounded-xl border border-border-strong bg-surface/90 px-6 py-3.5 text-sm font-semibold text-fg hover:border-accent hover:bg-elevated transition-all duration-300 shadow-lg backdrop-blur transform hover:-translate-y-0.5"
              >
                <Sparkles className="size-4 text-accent" />
                <span>Live Analysis Workspace</span>
              </Link>

              <a
                href="#about"
                className="flex items-center gap-1.5 rounded-xl px-4 py-3.5 text-sm font-medium text-fg-muted hover:text-fg transition-colors"
              >
                <span>Explore Architecture</span>
                <ChevronDown className="size-4" />
              </a>
            </div>

            {/* Live Platform Highlights Ticker */}
            <div className="mt-16 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4 max-w-5xl mx-auto text-left">
              <div className="rounded-xl border border-border/80 bg-surface/80 p-4 backdrop-blur shadow-sm hover:border-accent/40 transition-colors">
                <div className="flex items-center gap-2 text-accent mb-1">
                  <Bot className="size-4" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">Agents</span>
                </div>
                <div className="font-display text-2xl font-bold text-fg">9 Specialists</div>
                <p className="mt-0.5 text-xs text-fg-subtle">
                  Dynamic DAG decomposition & self-replanning
                </p>
              </div>

              <div className="rounded-xl border border-border/80 bg-surface/80 p-4 backdrop-blur shadow-sm hover:border-accent/40 transition-colors">
                <div className="flex items-center gap-2 text-cyan-400 mb-1">
                  <Cpu className="size-4" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">LLM Gateway</span>
                </div>
                <div className="font-display text-2xl font-bold text-fg">4 Frontier Models</div>
                <p className="mt-0.5 text-xs text-fg-subtle">
                  Claude 3.5, Gemini 1.5, Mistral, Groq Llama
                </p>
              </div>

              <div className="rounded-xl border border-border/80 bg-surface/80 p-4 backdrop-blur shadow-sm hover:border-accent/40 transition-colors">
                <div className="flex items-center gap-2 text-rose-400 mb-1">
                  <ShieldAlert className="size-4" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">Arbitration</span>
                </div>
                <div className="font-display text-2xl font-bold text-fg">Adversarial Critic</div>
                <p className="mt-0.5 text-xs text-fg-subtle">
                  Conflict auditing & zero lookahead enforcement
                </p>
              </div>

              <div className="rounded-xl border border-border/80 bg-surface/80 p-4 backdrop-blur shadow-sm hover:border-accent/40 transition-colors">
                <div className="flex items-center gap-2 text-emerald-400 mb-1">
                  <CheckCircle2 className="size-4" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">Provenance</span>
                </div>
                <div className="font-display text-2xl font-bold text-fg">100% Verifiable</div>
                <p className="mt-0.5 text-xs text-fg-subtle">
                  Claim-by-claim citations from raw source data
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* WHAT IS ARTHAYA SECTION */}
        <section id="about" className="py-20 border-t border-border/80 bg-surface/40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <span className="eyebrow text-accent font-semibold">The Arthaya Manifesto</span>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-fg">
                What is Arthaya?
              </h2>
              <p className="mt-4 text-sm sm:text-base text-fg-muted leading-relaxed">
                Derived from the Sanskrit <span className="text-accent font-medium">Artha</span> (the
                pursuit of material prosperity guided by sound reason, order, and discernment),{" "}
                <strong>Arthaya</strong> is a production-grade multi-agent financial intelligence and
                equity research network. It was engineered to solve the fundamental breakdown in modern
                financial analysis.
              </p>
            </div>

            {/* The 3-Way Problem vs Solution Comparison */}
            <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="rounded-2xl border border-border bg-surface p-6 shadow-md transition-all hover:border-border-strong flex flex-col">
                <div className="size-11 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mb-4">
                  <TrendingDown className="size-5" />
                </div>
                <h3 className="font-display text-lg font-semibold text-fg">
                  The Old Way: Siloed Terminals
                </h3>
                <p className="mt-2 text-xs text-fg-muted leading-relaxed flex-1">
                  Retail investors and quants spend hours switching between 20+ disconnected browser tabs:
                  candlestick charts on one screen, SEC 10-K filings on another, macro indicators on a
                  third, and high-frequency news feeds on a fourth. Disjointed tools provide raw data but
                  zero cross-domain reasoning or unified synthesis.
                </p>
                <div className="mt-4 pt-4 border-t border-border/60 text-[11px] text-red-400 font-medium">
                  Result: Severe cognitive overload & slow decision-making
                </div>
              </div>

              {/* Card 2 */}
              <div className="rounded-2xl border border-border bg-surface p-6 shadow-md transition-all hover:border-border-strong flex flex-col">
                <div className="size-11 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                  <Flame className="size-5" />
                </div>
                <h3 className="font-display text-lg font-semibold text-fg">
                  The Naive Way: Monolithic LLMs
                </h3>
                <p className="mt-2 text-xs text-fg-muted leading-relaxed flex-1">
                  Asking a general-purpose chat model to analyze a stock results in fabricated numbers,
                  outdated prices, hallucinations, and an inability to perform rigorous mathematical
                  computations. Single-prompt models cannot query order books, enforce zero-leakage
                  constraints, or question their own contradictory assumptions.
                </p>
                <div className="mt-4 pt-4 border-t border-border/60 text-[11px] text-amber-400 font-medium">
                  Result: Hallucinated metrics & untrustworthy signals
                </div>
              </div>

              {/* Card 3: Arthaya */}
              <div className="rounded-2xl border-2 border-accent/50 bg-surface p-6 shadow-[0_0_30px_rgba(16,185,129,0.12)] transition-all hover:border-accent flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-accent text-bg px-3 py-1 text-[10px] font-bold rounded-bl-lg">
                  THE ARTHAYA REVOLUTION
                </div>
                <div className="size-11 rounded-xl bg-accent/20 border border-accent/40 text-accent flex items-center justify-center mb-4">
                  <Sparkles className="size-5" />
                </div>
                <h3 className="font-display text-lg font-semibold text-fg">
                  The Agentic Solution: Arthaya Swarm
                </h3>
                <p className="mt-2 text-xs text-fg-muted leading-relaxed flex-1">
                  Arthaya coordinates 9 domain-specialist agents via an adaptive Directed Acyclic Graph.
                  Deterministic mathematical indicator engines calculate momentum; fine-tuned NLP mines
                  regulatory catalysts; calibrated ML ensembles produce probabilistic distributions; and an
                  Adversarial Critic actively audits conflicts to trigger dynamic replanning.
                </p>
                <div className="mt-4 pt-4 border-t border-accent/30 text-[11px] text-accent font-medium">
                  Result: Institutional-grade, conflict-audited dossiers with 100% provenance
                </div>
              </div>
            </div>

            {/* Feature Comparison Table */}
            <div className="mt-14 rounded-2xl border border-border bg-surface overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-border bg-panel">
                <h4 className="font-display text-sm font-semibold text-fg">
                  Technical Architecture Comparison
                </h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-border text-fg-subtle uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="py-3 px-6">Dimension</th>
                      <th className="py-3 px-6">Legacy Terminals</th>
                      <th className="py-3 px-6">Single-Prompt LLMs</th>
                      <th className="py-3 px-6 text-accent">Arthaya Multi-Agent Platform</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {COMPARISON_POINTS.map((pt, idx) => (
                      <tr key={idx} className="hover:bg-elevated/40 transition-colors">
                        <td className="py-3.5 px-6 font-semibold text-fg">{pt.category}</td>
                        <td className="py-3.5 px-6 text-fg-muted">{pt.terminals}</td>
                        <td className="py-3.5 px-6 text-fg-muted">{pt.monolithic}</td>
                        <td className="py-3.5 px-6 font-medium text-fg bg-accent/5">{pt.arthaya}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* THE 9 AGENTS INTERACTIVE SHOWCASE */}
        <section id="agents" className="py-20 border-t border-border/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="eyebrow text-accent font-semibold">The Autonomous Swarm</span>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-fg">
                The 9 Specialized AI Agents
              </h2>
              <p className="mt-4 text-sm sm:text-base text-fg-muted">
                Each agent in Arthaya is an independent, reasoning domain specialist bound by strict
                input and output schemas. Select any agent below to inspect its inference tools,
                mathematical methods, and pipeline contracts.
              </p>
            </div>

            {/* Agent Selector Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2 mb-8">
              {AGENT_PIPELINE.map((agent) => {
                const isSelected = selectedAgent === agent.agentId;
                const spec = AGENT_SPEC_DETAILS[agent.agentId];
                const IconComponent = spec?.icon || Bot;

                return (
                  <button
                    key={agent.agentId}
                    onClick={() => setSelectedAgent(agent.agentId)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all duration-200",
                      isSelected
                        ? "border-accent bg-accent/15 text-accent shadow-[0_0_15px_rgba(16,185,129,0.25)] scale-105"
                        : "border-border bg-surface text-fg-muted hover:border-border-strong hover:text-fg hover:bg-elevated",
                    )}
                  >
                    <div
                      className={cn(
                        "flex size-9 items-center justify-center rounded-lg border",
                        spec?.color || "border-border bg-panel text-fg",
                      )}
                    >
                      <IconComponent className="size-4" />
                    </div>
                    <span className="text-[11px] font-semibold leading-tight line-clamp-1">
                      {agent.name.replace(" Agent", "")}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Agent Deep-Dive Card */}
            <div className="rounded-2xl border-2 border-border-strong bg-surface p-6 sm:p-8 shadow-xl relative overflow-hidden">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-border/80">
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "flex size-14 items-center justify-center rounded-2xl border shadow-inner",
                      activeSpec.color,
                    )}
                  >
                    <ActiveIcon className="size-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-2xl font-bold text-fg">
                        {AGENT_PIPELINE.find((a) => a.agentId === selectedAgent)?.name}
                      </h3>
                      <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-[10px] font-semibold text-accent border border-accent/25">
                        Active in DAG
                      </span>
                    </div>
                    <p className="text-sm font-medium text-accent mt-0.5">{activeSpec.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/analyze?agent=${selectedAgent}`}
                    className="inline-flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/10 px-4 py-2 text-xs font-semibold text-accent hover:bg-accent hover:text-bg transition-colors"
                  >
                    <span>Observe in Live Workspace</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </div>

              {/* Details & Specifications Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
                    Core Responsibility & Logic
                  </h4>
                  <p className="text-xs text-fg-muted leading-relaxed">{activeSpec.details}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
                    Tools & Inference Methods
                  </h4>
                  <ul className="space-y-1.5">
                    {activeSpec.tools.map((t, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-fg">
                        <CheckCircle2 className="size-3.5 text-accent shrink-0" />
                        <span className="font-mono text-[11px] bg-panel px-1.5 py-0.5 rounded border border-border">
                          {t}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
                      Input Contract
                    </h4>
                    <p className="mt-1 font-mono text-[11px] text-fg-muted bg-panel p-2 rounded border border-border">
                      {activeSpec.contractIn}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
                      Output Contract
                    </h4>
                    <p className="mt-1 font-mono text-[11px] text-accent bg-panel p-2 rounded border border-accent/20">
                      {activeSpec.contractOut}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ARCHITECTURE & REPLANNING SECTION */}
        <section id="architecture" className="py-20 border-t border-border/80 bg-surface/40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="eyebrow text-accent font-semibold">The Autonomous Advantage</span>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-fg">
                Adversarial Arbitration & Dynamic Replanning
              </h2>
              <p className="mt-4 text-sm sm:text-base text-fg-muted">
                How Arthaya fundamentally transcends rigid sequential workflows. When contradictory
                market signals arise, the system engages an active self-healing arbitration loop.
              </p>
            </div>

            {/* Architecture Steps Walkthrough */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="rounded-xl border border-border bg-surface p-5 shadow-sm relative">
                <span className="font-mono text-xs font-bold text-accent">01. DECOMPOSE</span>
                <h4 className="mt-2 font-display text-sm font-semibold text-fg">
                  User Inquiry & Graph Setup
                </h4>
                <p className="mt-1.5 text-xs text-fg-muted leading-relaxed">
                  The user submits a ticker, investment horizon, and frontier LLM gateway. The
                  Orchestrator schedules the execution DAG.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-surface p-5 shadow-sm relative">
                <span className="font-mono text-xs font-bold text-cyan-400">02. INGESTION</span>
                <h4 className="mt-2 font-display text-sm font-semibold text-fg">
                  Parallel Quantitative Mining
                </h4>
                <p className="mt-1.5 text-xs text-fg-muted leading-relaxed">
                  Market, Technical, Fundamental, and News agents execute concurrently to ingest order
                  books, compute oscillators, and mine SEC filings.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-surface p-5 shadow-sm relative">
                <span className="font-mono text-xs font-bold text-blue-400">03. MODELING</span>
                <h4 className="mt-2 font-display text-sm font-semibold text-fg">
                  ML Ensemble & Analogs
                </h4>
                <p className="mt-1.5 text-xs text-fg-muted leading-relaxed">
                  Historical cycles are matched via DTW, and the Prediction Agent ensembles Logistic
                  Regression, Random Forest, and Gradient Boost.
                </p>
              </div>

              <div className="rounded-xl border-2 border-rose-500/50 bg-rose-500/5 p-5 shadow-sm relative">
                <span className="font-mono text-xs font-bold text-rose-400">04. CRITIQUE</span>
                <h4 className="mt-2 font-display text-sm font-semibold text-fg">
                  Adversarial Arbitration
                </h4>
                <p className="mt-1.5 text-xs text-fg-muted leading-relaxed">
                  If Technical breakout conflicts with News regulatory lawsuits (Conflict Score &gt; 0.65),
                  the Critic rejects consensus and triggers an adaptive replan.
                </p>
              </div>

              <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/5 p-5 shadow-sm relative">
                <span className="font-mono text-xs font-bold text-emerald-400">05. SYNTHESIS</span>
                <h4 className="mt-2 font-display text-sm font-semibold text-fg">
                  Audited Dossier Compilation
                </h4>
                <p className="mt-1.5 text-xs text-fg-muted leading-relaxed">
                  The Synthesis Agent outputs an executive report with 100% claim-by-claim provenance
                  badges linked directly to verified evidence.
                </p>
              </div>
            </div>

            {/* Replanning Banner */}
            <div className="mt-8 rounded-2xl border border-accent/30 bg-accent/5 p-6 backdrop-blur">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-accent/20 border border-accent/40 text-accent flex items-center justify-center shrink-0">
                    <Scale className="size-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-fg">
                      Why A Fixed Pipeline Fails, and How Arthaya Succeeds
                    </h4>
                    <p className="text-xs text-fg-muted mt-0.5">
                      A linear workflow blindy passes contradictory data downstream. In Arthaya, the
                      Adversarial Critic operates as an autonomous gatekeeper, forcing dynamic replans
                      with downside volatility penalties until signal integrity reaches institutional
                      confidence.
                    </p>
                  </div>
                </div>
                <Link
                  href="/agents"
                  className="shrink-0 inline-flex items-center gap-2 rounded-lg bg-surface border border-border px-3.5 py-2 text-xs font-semibold text-fg hover:text-accent hover:border-accent transition-colors"
                >
                  <span>View Dynamic Agent Graph</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CORE PLATFORM CAPABILITIES SECTION */}
        <section id="capabilities" className="py-20 border-t border-border/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="eyebrow text-accent font-semibold">Live System Modules</span>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-fg">
                Explore the Platform
              </h2>
              <p className="mt-4 text-sm sm:text-base text-fg-muted">
                Navigate directly into any of Arthaya&apos;s active terminal intelligence modules.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Module 1: Overview */}
              <Link
                href="/dashboard"
                className="group rounded-2xl border border-border bg-surface p-5 transition-all duration-200 hover:border-accent hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] flex flex-col"
              >
                <div className="size-10 rounded-xl bg-panel border border-border text-fg group-hover:border-accent group-hover:text-accent flex items-center justify-center transition-colors mb-3">
                  <BarChart3 className="size-5" />
                </div>
                <h3 className="font-display text-base font-bold text-fg group-hover:text-accent transition-colors">
                  Overview Terminal
                </h3>
                <p className="mt-1 text-xs text-fg-muted leading-relaxed flex-1">
                  Macro index overview, market breadth, volatility radar, and live sector momentum.
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-accent">
                  <span>Open Terminal</span>
                  <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </Link>

              {/* Module 2: Live Analysis */}
              <Link
                href="/analyze"
                className="group rounded-2xl border border-border bg-surface p-5 transition-all duration-200 hover:border-accent hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] flex flex-col"
              >
                <div className="size-10 rounded-xl bg-panel border border-border text-fg group-hover:border-accent group-hover:text-accent flex items-center justify-center transition-colors mb-3">
                  <Sparkles className="size-5" />
                </div>
                <h3 className="font-display text-base font-bold text-fg group-hover:text-accent transition-colors">
                  Live Analysis Workspace
                </h3>
                <p className="mt-1 text-xs text-fg-muted leading-relaxed flex-1">
                  Trigger multi-agent research runs with live SSE thought traces and handoff logs.
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-accent">
                  <span>Run Analysis</span>
                  <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </Link>

              {/* Module 3: Predictions */}
              <Link
                href="/predictions"
                className="group rounded-2xl border border-border bg-surface p-5 transition-all duration-200 hover:border-accent hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] flex flex-col"
              >
                <div className="size-10 rounded-xl bg-panel border border-border text-fg group-hover:border-accent group-hover:text-accent flex items-center justify-center transition-colors mb-3">
                  <LineChart className="size-5" />
                </div>
                <h3 className="font-display text-base font-bold text-fg group-hover:text-accent transition-colors">
                  AI Prediction Engine
                </h3>
                <p className="mt-1 text-xs text-fg-muted leading-relaxed flex-1">
                  Ensemble models, calibrated probability distributions, and price forecast corridors.
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-accent">
                  <span>Explore Forecasts</span>
                  <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </Link>

              {/* Module 4: Agent Intelligence */}
              <Link
                href="/agents"
                className="group rounded-2xl border border-border bg-surface p-5 transition-all duration-200 hover:border-accent hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] flex flex-col"
              >
                <div className="size-10 rounded-xl bg-panel border border-border text-fg group-hover:border-accent group-hover:text-accent flex items-center justify-center transition-colors mb-3">
                  <Bot className="size-5" />
                </div>
                <h3 className="font-display text-base font-bold text-fg group-hover:text-accent transition-colors">
                  Agent Intelligence Hub
                </h3>
                <p className="mt-1 text-xs text-fg-muted leading-relaxed flex-1">
                  Inspect the live dependency graph, execution latency, and per-agent telemetry.
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-accent">
                  <span>View Swarm</span>
                  <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </Link>

              {/* Module 5: Markets */}
              <Link
                href="/markets"
                className="group rounded-2xl border border-border bg-surface p-5 transition-all duration-200 hover:border-accent hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] flex flex-col"
              >
                <div className="size-10 rounded-xl bg-panel border border-border text-fg group-hover:border-accent group-hover:text-accent flex items-center justify-center transition-colors mb-3">
                  <TrendingUp className="size-5" />
                </div>
                <h3 className="font-display text-base font-bold text-fg group-hover:text-accent transition-colors">
                  Markets Screener
                </h3>
                <p className="mt-1 text-xs text-fg-muted leading-relaxed flex-1">
                  Interactive stock universe with live price quotes, percentage shifts, and sector filters.
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-accent">
                  <span>Screen Equities</span>
                  <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </Link>

              {/* Module 6: Stock Comparison */}
              <Link
                href="/compare"
                className="group rounded-2xl border border-border bg-surface p-5 transition-all duration-200 hover:border-accent hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] flex flex-col"
              >
                <div className="size-10 rounded-xl bg-panel border border-border text-fg group-hover:border-accent group-hover:text-accent flex items-center justify-center transition-colors mb-3">
                  <GitCompare className="size-5" />
                </div>
                <h3 className="font-display text-base font-bold text-fg group-hover:text-accent transition-colors">
                  Comparative Analysis
                </h3>
                <p className="mt-1 text-xs text-fg-muted leading-relaxed flex-1">
                  Side-by-side agentic showdown comparing fundamentals, technicals, and prediction odds.
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-accent">
                  <span>Compare Stocks</span>
                  <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </Link>

              {/* Module 7: Reports */}
              <Link
                href="/reports"
                className="group rounded-2xl border border-border bg-surface p-5 transition-all duration-200 hover:border-accent hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] flex flex-col"
              >
                <div className="size-10 rounded-xl bg-panel border border-border text-fg group-hover:border-accent group-hover:text-accent flex items-center justify-center transition-colors mb-3">
                  <FileText className="size-5" />
                </div>
                <h3 className="font-display text-base font-bold text-fg group-hover:text-accent transition-colors">
                  Research Reports
                </h3>
                <p className="mt-1 text-xs text-fg-muted leading-relaxed flex-1">
                  Archived institutional research dossiers with downloadable Markdown and raw JSON files.
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-accent">
                  <span>Read Reports</span>
                  <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </Link>

              {/* Module 8: Model Performance */}
              <Link
                href="/models"
                className="group rounded-2xl border border-border bg-surface p-5 transition-all duration-200 hover:border-accent hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] flex flex-col"
              >
                <div className="size-10 rounded-xl bg-panel border border-border text-fg group-hover:border-accent group-hover:text-accent flex items-center justify-center transition-colors mb-3">
                  <Gauge className="size-5" />
                </div>
                <h3 className="font-display text-base font-bold text-fg group-hover:text-accent transition-colors">
                  Model Performance
                </h3>
                <p className="mt-1 text-xs text-fg-muted leading-relaxed flex-1">
                  Inspect Brier scores, calibration curves, confusion matrices, and ROC-AUC curves.
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-accent">
                  <span>Audit Models</span>
                  <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* FREQUENTLY ASKED QUESTIONS */}
        <section id="faq" className="py-20 border-t border-border/80 bg-surface/40">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="eyebrow text-accent font-semibold">Technical Reference</span>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-fg">
                Frequently Asked Questions
              </h2>
              <p className="mt-3 text-sm text-fg-muted">
                Everything you need to know about Arthaya&apos;s multi-agent architecture and methodology.
              </p>
            </div>

            <div className="space-y-4">
              {FAQS.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={index}
                    className="rounded-xl border border-border bg-surface overflow-hidden transition-all shadow-sm"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full flex items-center justify-between p-5 text-left font-display text-base font-semibold text-fg hover:text-accent transition-colors"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={cn(
                          "size-5 text-fg-muted transition-transform duration-200 shrink-0 ml-4",
                          isOpen && "rotate-180 text-accent",
                        )}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-xs sm:text-sm text-fg-muted leading-relaxed border-t border-border/60 pt-4 bg-panel/50">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* INSTITUTIONAL INTEGRITY & DEMO NOTICE */}
        <section className="py-12 border-t border-border/80">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-warning/30 bg-warning/5 p-6 backdrop-blur flex items-start gap-4">
              <Shield className="size-6 text-warning shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs text-fg-muted leading-relaxed">
                <h4 className="text-sm font-semibold text-fg">
                  Educational & Research Demonstration Disclaimer
                </h4>
                <p>
                  Arthaya uses a simulated stock universe with mock and generated data. Prices,
                  predictions, technical analyses, sentiment scores, and model performance metrics are
                  purely illustrative. Arthaya is designed to showcase autonomous multi-agent reasoning,
                  adversarial auditing, and dynamic replanning in finance. Nothing generated by this
                  platform constitutes financial, investment, or trading advice.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA BANNER */}
        <section className="py-16 border-t border-border/80 bg-gradient-to-b from-surface/60 to-bg">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-fg">
              Experience the 9-Agent Swarm in Real Time
            </h3>
            <p className="mt-4 text-sm text-fg-muted max-w-2xl mx-auto">
              Launch the live equity terminal or initiate a custom multi-agent analysis for AAPL,
              NVDA, MSFT, TSLA, and other equities across our simulated universe.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-semibold text-bg shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:bg-accent-strong transition-all duration-200 active:scale-95"
              >
                <span>Enter Live Dashboard</span>
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/analyze"
                className="inline-flex items-center gap-2 rounded-xl border border-border-strong bg-surface px-6 py-3.5 text-sm font-semibold text-fg hover:border-accent hover:bg-elevated transition-colors"
              >
                <Sparkles className="size-4 text-accent" />
                <span>Launch Analysis Workspace</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border/80 bg-surface/90 py-12 text-xs text-fg-subtle">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
            {/* Brand column */}
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-2.5">
                <Image
                  src="/arthaya_logo.png"
                  alt="Arthaya"
                  width={24}
                  height={24}
                  className="rounded object-contain"
                />
                <span className="font-display text-base font-bold text-fg">Arthaya</span>
                <span className="rounded bg-accent/15 px-1.5 py-0.2 text-[9px] font-semibold text-accent border border-accent/20">
                  AI
                </span>
              </Link>
              <p className="mt-3 text-fg-muted max-w-sm text-xs leading-relaxed">
                Autonomous multi-agent financial intelligence and quantitative equity research
                platform. Powered by 9 collaborative agents, dynamic DAG replanning, and calibrated
                ML ensembles.
              </p>
            </div>

            {/* Column: Intelligence */}
            <div>
              <p className="font-semibold text-fg text-xs uppercase tracking-wider mb-3">
                Intelligence
              </p>
              <ul className="space-y-2">
                <li>
                  <Link href="/dashboard" className="hover:text-accent transition-colors">
                    Overview Terminal
                  </Link>
                </li>
                <li>
                  <Link href="/markets" className="hover:text-accent transition-colors">
                    Markets Screener
                  </Link>
                </li>
                <li>
                  <Link href="/analyze" className="hover:text-accent transition-colors">
                    Live Analysis Workspace
                  </Link>
                </li>
                <li>
                  <Link href="/predictions" className="hover:text-accent transition-colors">
                    Prediction Engine
                  </Link>
                </li>
                <li>
                  <Link href="/agents" className="hover:text-accent transition-colors">
                    Agent Intelligence
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column: Research */}
            <div>
              <p className="font-semibold text-fg text-xs uppercase tracking-wider mb-3">Research</p>
              <ul className="space-y-2">
                <li>
                  <Link href="/compare" className="hover:text-accent transition-colors">
                    Stock Comparison
                  </Link>
                </li>
                <li>
                  <Link href="/reports" className="hover:text-accent transition-colors">
                    Research Reports
                  </Link>
                </li>
                <li>
                  <Link href="/watchlist" className="hover:text-accent transition-colors">
                    Watchlist
                  </Link>
                </li>
                <li>
                  <Link href="/models" className="hover:text-accent transition-colors">
                    Model Calibration
                  </Link>
                </li>
                <li>
                  <Link href="/data-sources" className="hover:text-accent transition-colors">
                    Data Sources
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column: Platform & Auth */}
            <div>
              <p className="font-semibold text-fg text-xs uppercase tracking-wider mb-3">System</p>
              <ul className="space-y-2">
                <li>
                  <Link href="/settings" className="hover:text-accent transition-colors">
                    Settings
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-accent transition-colors">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-accent transition-colors">
                    Register (Demo)
                  </Link>
                </li>
                <li>
                  <a href="#about" className="hover:text-accent transition-colors">
                    About Platform
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
            <div>
              &copy; {new Date().getFullYear()} Arthaya Intelligence Platform. Educational &
              demonstration research prototype.
            </div>
            <div className="flex items-center gap-4">
              <span>Next.js 16 (React 19)</span>
              <span>&bull;</span>
              <span>Tailwind CSS v4</span>
              <span>&bull;</span>
              <span>FastAPI Backend</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
