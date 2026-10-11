# ADR-002: Dual-Mode Architecture (Mock Showcase vs. Live Backend)

## Status
**Accepted & Implemented**

## Context
Academic and institutional demonstration environments frequently suffer from unreliable networking, rate-limited public APIs (e.g. Yahoo Finance 429), or missing external database connections. However, production financial platforms require live data streams and model inference.

## Decision
We implemented a first-class **Dual-Mode Architecture** across the frontend and API client:
1. **Demo Mode (`NEXT_PUBLIC_DEMO_MODE=true`, default)**:
   - Next.js reads directly from typed mock repositories ([src/lib/mock/](file:///home/sushant/Projects/Agentic/FinanceAgent/arthaya/src/lib/mock/)).
   - Analysis execution uses a Next.js route handler SSE emitter ([src/app/api/v1/analysis/stream/route.ts](file:///home/sushant/Projects/Agentic/FinanceAgent/arthaya/src/app/api/v1/analysis/stream/route.ts)) simulating real delays.
   - The entire platform functions with zero running backend services.
2. **Live Backend Mode (`NEXT_PUBLIC_DEMO_MODE=false`)**:
   - `apiGet` and `apiSend` make real network calls to the FastAPI server (`http://localhost:8000/api/v1`).
   - `useAnalysisStream` subscribes directly to the Python SSE endpoint.
   - Predictions and analyses are calculated with live market data and persisted to SQLite.

## Consequences
- **Positive**: Zero friction for reviewer onboarding and demos; guaranteed reliability during presentations; immediate readiness for live backend connections.
- **Negative**: Dual maintenance of mock models and live API schemas.
- **Mitigation**: Shared domain TypeScript types in `src/lib/types/` enforce schema alignment across both modes.
