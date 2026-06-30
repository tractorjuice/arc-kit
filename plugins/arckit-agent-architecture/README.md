# ArcKit — AI Agent Architecture Overlay

6 slash commands and the `agent-architecture` build recipe for designing, governing, and securing autonomous AI agent programs:

| Command | Doc Type | Description |
|---------|----------|-------------|
| `/arckit:agent-inventory` | `AAGI` | Agent inventory and capabilities assessment |
| `/arckit:agent-design` | `AAGR` | Agent design patterns and architecture decisions |
| `/arckit:agent-governance` | `AAOV` | Governance frameworks, human oversight, and audit trails |
| `/arckit:agent-integration` | `AAIN` | Agent-to-agent integration, tool contracts, and orchestration |
| `/arckit:agent-security` | `AASE` | Agent security hardening, sandboxing, and permission models |
| `/arckit:agent-maturity` | `AAMT` | Agent maturity model and continuous improvement |

Recipe: `agent-architecture` (6 phases: inventory → design → governance → integration → security → maturity).

## Requires arckit core plugin

```bash
claude plugin install arckit arckit-agent-architecture
```

On Claude Code v2.1.143+, `claude plugin disable arckit` will refuse with a copy-pasteable disable-chain hint while `arckit-agent-architecture` is enabled. Without `arckit` (core), the recipe will not resolve foundation commands (`arckit:principles`, `arckit:requirements`, etc.) and `validate-arc-filename` will not recognise agent architecture doc-type codes (`AAGI`, `AAGR`, `AAOV`, `AAIN`, `AASE`, `AAMT`).

## Scope

**In scope (v1)**: Autonomous AI agent programs — single agents, multi-agent chains, swarms, and hierarchical systems. Covers design, governance, integration, security, and maturity assessment.

**Out of scope**: General-purpose LLM evaluation/benchmarking (deferred to a separate overlay), hardware/infrastructure deployment (cloud, edge, on-prem), regulatory compliance frameworks (covered by sibling overlays such as `arckit-us`).

## Maintainer

`[COMMUNITY]` — community-contributed overlay. Recruiting domain co-maintainer for agent architecture expertise.
