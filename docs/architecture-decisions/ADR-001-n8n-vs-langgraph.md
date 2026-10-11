# ADR-001: n8n Workflow Automation Hub vs. LangGraph Orchestrator

## Status
**Accepted & Implemented**

## Context
The original prompt specification ([project.md:L68](file:///home/sushant/Projects/Agentic/FinanceAgent/project.md#L68)) proposed using LangGraph as the agent orchestrator for coordinating the multi-agent stock analysis workflow.

During system implementation, the team evaluated LangGraph against an external **n8n** workflow orchestrator instance (`https://n8n.sushantkumaryadav.com.np`).

## Decision
The platform adopted **n8n** as the primary distributed workflow coordinator, paired with an autonomous in-process Python fallback (`_execute_pipeline` in FastAPI):
1. **Visual Execution Tracing**: n8n provides a hosted execution log showing real-time node outputs and network payloads for each step.
2. **Decoupled Data Fetching**: Parallel HTTP nodes in n8n fan out requests across `Market`, `Technical`, `Fundamental`, `News`, and `Historical` endpoints without blocking Python thread pools.
3. **No Heavy LangChain Dependencies**: LangGraph requires large dependency trees (`langchain-core`, `langgraph`, `pydantic-v1` bridges). Adopting n8n keeps `backend/requirements.txt` lightweight (under 18 packages).
4. **Resilient Local Fallback**: If n8n becomes unreachable, `N8NClient` returns `mode: "local_orchestrator"`, prompting FastAPI to execute the pipeline locally without interruption.

## Consequences
- **Positive**: Low backend dependency footprint; visual orchestration debugging; fault-tolerant fallback execution.
- **Negative**: Distributed deployment requires an accessible n8n instance and secure webhook routing.
- **Mitigation**: Implemented SSRF filtering in `arthaya_analysis_orchestrator_fixed.json` to prevent malicious callback redirects.
