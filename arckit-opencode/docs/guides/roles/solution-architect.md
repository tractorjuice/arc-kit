# Solution Architect — ArcKit Command Guide

> **DDaT Role Family**: [Architecture](https://ddat-capability-framework.service.gov.uk/role/solution-architect)
> **Framework**: [UK Government DDaT Capability Framework](https://ddat-capability-framework.service.gov.uk/)

## Overview

The Solution Architect designs technical solutions to meet business requirements. You own the research, decision-making, and design phases — translating requirements into architecture that can be reviewed, built, and operated.

## Primary Commands

| Command | Purpose | Guide |
|---------|---------|-------|
| `/arckit.requirements` | Define comprehensive business and technical requirements (with Business Analyst) | [Guide](#docs/guides/requirements.md) |
| `/arckit.research` | Research technologies and services with build vs buy analysis | [Guide](#docs/guides/research.md) |
| `/arckit.azure-research` | Deep-dive Azure services via Microsoft Learn MCP | [Guide](#docs/guides/azure-research.md) |
| `/arckit.aws-research` | Deep-dive AWS services via AWS Knowledge MCP | [Guide](#docs/guides/aws-research.md) |
| `/arckit.gcp-research` | Deep-dive GCP services via Google Developer Knowledge MCP | [Guide](#docs/guides/gcp-research.md) |
| `/arckit.wardley` | Map strategic landscape for build vs buy decisions | [Guide](#docs/guides/wardley.md) |
| `/arckit.adr` | Document architecture decisions with options analysis | [Guide](#docs/guides/adr.md) |
| `/arckit.diagram` | Create architecture diagrams (C4 context, container, sequence, dataflow) | [Guide](#docs/guides/diagram.md) |
| `/arckit.hld-review` | Review High-Level Design against principles and requirements | [Guide](#docs/guides/hld-review.md) |
| `/arckit.dld-review` | Review Detailed Design for implementation readiness | [Guide](#docs/guides/dld-review.md) |

## Secondary Commands

| Command | Your Involvement | Guide |
|---------|-----------------|-------|
| `/arckit.stakeholders` | Contribute to stakeholder analysis (technical stakeholders) | [Guide](#docs/guides/stakeholder-analysis.md) |
| `/arckit.data-model` | Review data model for technical feasibility | [Guide](#docs/guides/data-model.md) |
| `/arckit.datascout` | Review external data source options | [Guide](#docs/guides/datascout.md) |
| `/arckit.platform-design` | Design platform strategy for multi-sided ecosystems | [Guide](#docs/guides/platform-design.md) |
| `/arckit.sow` | Contribute technical sections to Statement of Work | [Guide](#docs/guides/sow.md) |
| `/arckit.evaluate` | Lead technical evaluation of vendor proposals | [Guide](#docs/guides/evaluate.md) |
| `/arckit.backlog` | Review backlog for technical feasibility | [Guide](#docs/guides/backlog.md) |
| `/arckit.traceability` | Verify requirements trace through to design and tests | [Guide](#docs/guides/traceability.md) |
| `/arckit.devops` | Input on CI/CD and infrastructure patterns | [Guide](#docs/guides/devops.md) |

## Typical Workflow

```text
requirements → research → cloud-research → wardley → adr →
diagram → hld-review → dld-review → traceability
```

### Step-by-step

1. **Understand the problem**: Review stakeholders and business case from Business Architect
2. **Define requirements**: Run `/arckit.requirements` (co-own with Business Analyst)
3. **Research solutions**: Run `/arckit.research` for market analysis and build vs buy
4. **Cloud deep-dive**: Run `/arckit.azure-research`, `/arckit.aws-research`, or `/arckit.gcp-research` for specific platforms
5. **Map the landscape**: Run `/arckit.wardley` to visualise component evolution
6. **Record decisions**: Run `/arckit.adr` for each significant architecture decision
7. **Create diagrams**: Run `/arckit.diagram` for C4 context, container, and sequence diagrams
8. **Write HLD**: Author the High-Level Design document (external to ArcKit)
9. **Review HLD**: Run `/arckit.hld-review` to validate against principles and requirements
10. **Detail design**: Author DLD, then run `/arckit.dld-review`

## Key Artifacts You Own

- `ARC-{PID}-RSCH-v*.md` — Technology research report
- `ARC-{PID}-ADR-{NUM}-v*.md` — Architecture Decision Records
- `ARC-{PID}-DIAG-{NUM}-v*.md` — Architecture diagrams
- `ARC-{PID}-WARD-{NUM}-v*.md` — Wardley Maps
- `ARC-{PID}-HLDR-v*.md` — HLD review report
- `ARC-{PID}-DLDR-v*.md` — DLD review report

## Related Roles

- [Enterprise Architect](enterprise-architect.md) — governs the principles your designs must follow
- [Technical Architect](technical-architect.md) — takes your HLD into detailed implementation
- [Data Architect](data-architect.md) — owns the data layer of your solution
- [Business Analyst](business-analyst.md) — co-owns requirements with you
