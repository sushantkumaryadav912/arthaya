# CA3 Presentation, Live Demo & Evaluator Defense Master Guide

---

## 1. Team Presentation Structure (5-7 Minutes)

### Slide 1: Problem & System Identity
- **Hook**: "Retail investors and quantitative analysts look at dozens of disconnected terminal windows: technical charts, balance sheet filings, breaking news sentiment, and probabilistic forecasts. Conventional LLMs hallucinate numbers and cannot reason through conflicting signals. Arthaya solves this with a genuine 9-agent autonomous financial intelligence network."
- **Presenter**: Team Lead / Eccha Bansal.

### Slide 2: Why Multi-Agent? (Agent vs. Workflow Distinction)
- **Key CA3 Defense**: "Why couldn't one agent or a simple Zapier/n8n chain do this? A simple workflow executes fixed sequential steps: Step 1 -> Step 2 -> Step 3. If Step 2 finds a technical breakout, but Step 3 finds an active antitrust lawsuit, a workflow blindly passes the data forward without reasoning. In Arthaya, each agent is an independent reasoning specialist. When the Adversarial Critic detects a divergence, it halts consensus and triggers an arbitration loop where the Orchestrator forces a dynamic re-plan."

### Slide 3: Architecture & Data Flow
- Walk through the Mermaid diagram from `docs/ca3/02_DESIGN_DOCUMENT.md`.
- Explain the fan-out to Market, Technical, Fundamental, News, and Historical specialists.
- Highlight the convergence onto the Prediction Engine and the Adversarial Critic.

### Slide 4: The Core Agentic Innovation: Conflict Arbitration & Re-planning Loop
- Show an actual example:
  - Technical Agent: RSI 64.8 (Bullish Breakout, 81% conviction).
  - News Agent: Regulatory Antirust Fine (-0.58 Bearish sentiment).
  - Critic Agent: Emits **Conflict Alert** (Divergence score 0.74 > threshold 0.65).
  - Orchestrator: Dynamic Re-plan directive commanding Prediction Agent to penalize bullish probability.
  - Prediction Agent: Recalibrates ensemble from 72% down to 58%, expanding uncertainty bounds.

### Slide 5: Engineering Rigor, Resilience & Test Coverage
- Next.js 16 (React 19 / Turbopack) for sub-second SSE streaming.
- 100% automated test suite (`tests/` directory exercising multi-agent coordination, validation, and universal fallbacks).
- Universal ticker support: Zero crashes on unknown or emerging stock symbols.

### Slide 6: Live Demo Walkthrough
- Switch to the live deployed URL (or local dashboard).
- Execute an analysis on `AAPL` (or `NVDA`).
- Show the Live Inter-Agent Message Bus, the Conflict Banner, and the exported Execution Trace.

### Slide 7: Summary & Future Scope
- Conclude with how Arthaya scales to portfolio optimization and autonomous risk hedging.

---

## 2. Live Demo Script & Click Path (Category C: 6 Marks)

1. **Step 1: Open Workspace**:
   - Navigate to `/analyze`. Point out the 9-agent pipeline graph and the Model Gateway selector (Claude 3.5 Sonnet / Gemini 1.5 Pro / Groq / Mistral).
2. **Step 2: Enter Ticker & Configure**:
   - Select ticker `AAPL`, Horizon `5D`, Depth `deep`, Gateway `Claude`.
   - Click **Run Analysis**.
3. **Step 3: Watch the Multi-Agent Bus in Real Time**:
   - Point out the status badges and timestamps in the **Agent Pipeline Graph**.
   - Open the **Live Inter-Agent Coordination Bus**:
     - Point out the `[TOOL]` execution frames (e.g. `YFinanceDataIngestion`, `QuantitativeIndicatorSuite`).
     - Point out the `➔ TARGET AGENT` handoffs (Market ➔ Technical, Technical ➔ Prediction).
4. **Step 4: Highlight the Conflict & Re-plan Event**:
   - Show the **Amber Conflict Alert**: Critic flags divergence between Technical and News vectors.
   - Show the **Dynamic Re-plan Badge**: Orchestrator commands ensemble recalibration.
5. **Step 5: Demonstrate Robustness on Arbitrary Tickers**:
   - In front of the evaluator, enter an unlisted symbol like `META` or `AMD` or `COIN`.
   - Show that the system seamlessly generates a dynamic seed, executes all 9 agents, and completes without errors or crashes.
6. **Step 6: Show Trace Export**:
   - Click **Trace JSON** in the message bus. Show that the exact execution log can be downloaded for forensic analysis.

---

## 3. Individual Readiness & Evaluator Q&A Defense (Category D & G)

### For Eccha Bansal (`EcchaBansalAgrawal` / `23070122215`):
- **Question 1**: *"What is your specific contribution to the multi-agent system?"*
  - **Answer**: "I focused on the inter-agent coordination and adversarial validation architecture. I designed the dynamic arbitration loop where the Adversarial Critic agent monitors signal concordance between the Technical and News agents. When divergence exceeds threshold (such as overbought price momentum against negative regulatory catalysts), the Orchestrator halts simple synthesis, modifies the execution path, and commands the Prediction Agent to re-plan with risk-weighted penalties. I also implemented universal ticker fallback resolution and the automated test suite in `tests/` to guarantee system robustness."
- **Question 2**: *"How does Arthaya prove it is a genuine agentic system rather than a fixed workflow?"*
  - **Answer**: "A fixed workflow always executes Step 2 after Step 1 in an immutable order regardless of what Step 1 found. In Arthaya, the execution path is adaptive: if the Critic flags a conflict, the system dynamically iterates through an arbitration and re-planning sub-routine (`isReplan: true`). The Prediction Agent recalibrates probability distributions on the fly based on cross-agent feedback before the Synthesis Agent is allowed to produce a dossier."
- **Question 3**: *"Why did you choose Next.js and Server-Sent Events (SSE) for agent streaming?"*
  - **Answer**: "Financial intelligence must be explainable in real time. Standard WebSockets introduce connection state overhead, while basic polling adds latency. Next.js 16 API route streaming over HTTP SSE (`ReadableStream`) provides continuous, low-latency agent-to-client telemetry while keeping the deployment serverless-compatible on Vercel."

### For Teammate 1 (`23070122180`):
- **Topic**: Market & Technical Specialist Agents.
- **Key Defense**: Computes RSI, MACD, and Bollinger Bands with strict zero-leakage cutoff; verifies that indicator calculation uses only data prior to the decision timestamp.

### For Teammate 2 (`23070122265`):
- **Topic**: Fundamental, News & Historical Analogs Agents.
- **Key Defense**: Analyzes SEC quarterly metrics, extracts catalyst polarity using NLP sentiment scoring, and queries macro historical analogs.

### For Teammate 3 (`23070122264`):
- **Topic**: Quantitative Prediction Ensemble & Model Gateway.
- **Key Defense**: Ensembles Logistic Regression, Random Forest, and XGBoost; applies Platt calibration to convert raw model votes into calibrated probabilities across 1D, 5D, and 20D horizons.
