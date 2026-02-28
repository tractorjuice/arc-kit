# Performance Analyst — ArcKit Command Guide

> **DDaT Role Family**: [Data](https://ddat-capability-framework.service.gov.uk/role/performance-analyst)
> **Framework**: [UK Government DDaT Capability Framework](https://ddat-capability-framework.service.gov.uk/)

## Overview

The Performance Analyst measures service performance and identifies improvement opportunities. You use ArcKit's quality and governance commands to assess architecture health, check conformance, and measure traceability — providing evidence-based insights for decision-making.

## Primary Commands

| Command | Purpose | Guide |
|---------|---------|-------|
| `/arckit.analyze` | Run governance quality analysis — coverage, completeness, and gaps | [Guide](#docs/guides/analyze.md) |
| `/arckit.health` | Scan for stale artifacts, orphaned requirements, version drift | [Guide](#docs/guides/artifact-health.md) |
| `/arckit.conformance` | Check ADR implementation, architecture drift, and technical debt | [Guide](#docs/guides/conformance.md) |
| `/arckit.traceability` | Measure requirements coverage — requirements to design to tests | [Guide](#docs/guides/traceability.md) |

## Secondary Commands

| Command | Your Involvement | Guide |
|---------|-----------------|-------|
| `/arckit.requirements` | Understand the requirements being measured | [Guide](#docs/guides/requirements.md) |
| `/arckit.principles` | Understand the principles being assessed against | [Guide](#docs/guides/principles.md) |
| `/arckit.principles-compliance` | Review principles compliance scores | [Guide](#docs/guides/principles-compliance.md) |
| `/arckit.story` | Contribute metrics and findings to the project narrative | [Guide](#docs/guides/story.md) |
| `/arckit.service-assessment` | Provide performance data for service assessments | [Guide](#docs/guides/service-assessment.md) |

## Typical Workflow

```text
requirements → traceability → analyze → health → conformance
```

### Step-by-step

1. **Understand scope**: Review `/arckit.requirements` for what should be measured
2. **Check traceability**: Run `/arckit.traceability` — are all requirements covered by design and tests?
3. **Assess quality**: Run `/arckit.analyze` for governance quality metrics
4. **Scan for drift**: Run `/arckit.health` to find stale, orphaned, or inconsistent artifacts
5. **Check conformance**: Run `/arckit.conformance` for ADR implementation and architecture drift

## Key Metrics You Track

| Metric | Source Command | What It Measures |
|--------|---------------|-----------------|
| Requirements coverage | `/arckit.traceability` | % of requirements traced to design and test |
| Governance quality | `/arckit.analyze` | Overall architecture governance score |
| Artifact health | `/arckit.health` | Stale artifacts, orphaned requirements, drift |
| Conformance score | `/arckit.conformance` | ADR implementation, consistency, debt |
| Principles compliance | `/arckit.principles-compliance` | Adherence to architecture principles |

## Key Artifacts You Produce/Consume

- `ARC-{PID}-TRAC-v*.md` — Traceability matrix (consume)
- `ARC-{PID}-ANAL-v*.md` — Governance analysis (consume/contribute)
- `ARC-{PID}-CONF-v*.md` — Conformance assessment (consume)
- `ARC-{PID}-PRIN-COMP-v*.md` — Principles compliance scorecard (consume)

## Related Roles

- [Enterprise Architect](enterprise-architect.md) — sets the governance standards you measure
- [Delivery Manager](delivery-manager.md) — uses your metrics for delivery assurance
- [Service Owner](service-owner.md) — uses your metrics for service performance reporting
- [Business Analyst](business-analyst.md) — provides the requirements you measure coverage for
