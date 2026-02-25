# Business Analyst — ArcKit Command Guide

> **DDaT Role Family**: [Product and Delivery](https://ddat-capability-framework.service.gov.uk/role/business-analyst)
> **Framework**: [UK Government DDaT Capability Framework](https://ddat-capability-framework.service.gov.uk/)

## Overview

The Business Analyst elicits, analyses, and documents requirements. You are the bridge between stakeholders and the technical team — owning the requirements specification and ensuring traceability from business needs through to design and test.

## Primary Commands

| Command | Purpose | Guide |
|---------|---------|-------|
| `/arckit.requirements` | Create comprehensive business and technical requirements (BR, FR, NFR, INT, DR) | [Guide](#docs/guides/requirements.md) |
| `/arckit.stakeholders` | Analyse stakeholder drivers, goals, and measurable outcomes | [Guide](#docs/guides/stakeholder-analysis.md) |
| `/arckit.data-model` | Model data entities, relationships, and governance (with Data Architect) | [Guide](#docs/guides/data-model.md) |
| `/arckit.traceability` | Generate requirements traceability matrix — requirements to design to tests | [Guide](#docs/guides/traceability.md) |

## Secondary Commands

| Command | Your Involvement | Guide |
|---------|-----------------|-------|
| `/arckit.plan` | Contribute to project planning (requirements phase estimation) | [Guide](#docs/guides/plan.md) |
| `/arckit.sobc` | Provide requirements analysis for business case | [Guide](#docs/guides/sobc.md) |
| `/arckit.backlog` | Review backlog for requirements coverage | [Guide](#docs/guides/backlog.md) |
| `/arckit.research` | Provide requirements context for technology research | [Guide](#docs/guides/research.md) |
| `/arckit.risk` | Identify requirements-related risks (scope creep, ambiguity) | [Guide](#docs/guides/risk.md) |
| `/arckit.story` | Review project story for requirements accuracy | [Guide](#docs/guides/story.md) |
| `/arckit.analyze` | Review governance analysis for requirements gaps | [Guide](#docs/guides/analyze.md) |

## Typical Workflow

```
stakeholders → requirements → data-model → traceability
```

### Step-by-step

1. **Map stakeholders**: Run `/arckit.stakeholders` to identify who needs what and why
2. **Elicit requirements**: Run `/arckit.requirements` — categorise as BR-xxx, FR-xxx, NFR-xxx, INT-xxx, DR-xxx
3. **Model data**: Run `/arckit.data-model` (with Data Architect) to define entities and relationships from DR-xxx
4. **Verify traceability**: Run `/arckit.traceability` to ensure all requirements trace to design and test artifacts
5. **Iterate**: As design progresses, re-run traceability to catch gaps

## Requirements ID Prefixes

As the requirements author, you'll use these ID prefixes:

| Prefix | Category | Examples |
|--------|----------|---------|
| BR-xxx | Business Requirements | BR-001, BR-002 |
| FR-xxx | Functional Requirements | FR-001, FR-002 |
| NFR-xxx | Non-Functional Requirements | NFR-P-001 (Performance), NFR-SEC-001 (Security) |
| INT-xxx | Integration Requirements | INT-001, INT-002 |
| DR-xxx | Data Requirements | DR-001, DR-002 |

## Key Artifacts You Own

- `ARC-{PID}-REQ-v*.md` — Requirements specification (the most-consumed artifact in ArcKit)
- `ARC-{PID}-STKE-v*.md` — Stakeholder analysis (co-owned with Business Architect)
- `ARC-{PID}-TRAC-v*.md` — Traceability matrix (co-owned with Delivery Manager)

## Related Roles

- [Product Manager](product-manager.md) — prioritises the requirements you define
- [Solution Architect](solution-architect.md) — designs solutions to meet your requirements
- [Data Architect](data-architect.md) — models data from your DR-xxx requirements
- [Business Architect](business-architect.md) — provides the strategic context for your analysis
