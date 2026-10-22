# Project Synopsis: Arthaya (FinanceAgent)

## Problem Statement
Individual retail and professional equity analysts face severe cognitive overload when attempting to synthesize disjoint market data sources—including tick-level price series, complex technical oscillators, corporate balance sheet filings, macroeconomic indicators, and high-frequency sentiment news feeds. Traditional retail research platforms present raw, siloed figures without cohesive reasoning, while conventional single-prompt LLM assistants suffer from hallucinated financial figures, inability to compute rigorous mathematical indicators, lack of cross-source provenance, and zero capability to self-audit conflicting signals (such as technical momentum breaking out while regulatory headwinds skew sharply negative).

## Proposed Solution: Arthaya Multi-Agent Intelligence System
**Arthaya** is an autonomous, multi-agent financial intelligence and quantitative equity research platform built with Next.js 16 (React 19 / TypeScript) and an adaptive asynchronous agent coordination pipeline. Rather than executing a rigid linear automation or relying on a single monolithic model, Arthaya coordinates nine specialized, autonomous AI agents:
1. **Orchestrator Agent**: Decomposes complex financial queries, schedules execution graphs, and arbitrates cross-agent discrepancies.
2. **Market Data Agent**: Ingests multi-exchange market quotes and volatility regimes.
3. **Technical Analysis Agent**: Formulates momentum hypotheses using quantitative indicators (RSI, MACD, Bollinger Bands, EMA).
4. **Fundamental Analysis Agent**: Evaluates SEC filings, P/E multiples, and operating margins.
5. **News & Sentiment Agent**: Mines real-time regulatory filings and news catalysts via NLP sentiment scoring.
6. **Historical Analogs Agent**: Mines multi-year macroeconomic cycles for matching historical regimes.
7. **Quantitative Prediction Agent**: Ensembles ML models (Logistic Regression, Random Forest, Gradient Boost) to yield calibrated probability distributions.
8. **Adversarial Critic Agent**: Audits data freshness, zero-leakage constraints, and cross-agent signal harmony. When divergence is detected (e.g., technical momentum vs. negative news catalysts), the Critic disputes the baseline and triggers an adaptive re-planning arbitration loop.
9. **Synthesis Agent**: Compiles an explainable, institutional-grade research dossier featuring complete claim-by-claim provenance.

## Target User Persona
Arthaya is designed for retail equity investors, quantitative analysts, and financial advisors seeking institutional-grade, verifiable, and explainable stock intelligence without the manual burden of scouring disparate terminal windows.

## Scope Alignment & Refinements Since CA2
During CA2, the project conceptualized isolated agents executing discrete analytical tasks (e.g., standalone technical calculations or standalone news sentiment scoring). In CA3, the scope has been fundamentally elevated into a fully coordinated, multi-agent reasoning architecture featuring:
- Dynamic cross-agent communication and inter-agent message buses.
- Adversarial auditing and conflict arbitration where agents critique each other's conclusions and force dynamic re-planning.
- Dual-mode deployment architecture (local high-speed inference engine paired with distributed n8n webhook orchestration fallback).
- Multi-model LLM Gateway routing allowing users to dynamically switch reasoning backbones (Claude 3.5 Sonnet, Gemini 1.5 Pro, Mistral Large, Groq Llama-3).
