# Delivery Manager — ArcKit Command Guide

> **DDaT Role Family**: [Product and Delivery](https://ddat-capability-framework.service.gov.uk/role/delivery-manager)
> **Framework**: [UK Government DDaT Capability Framework](https://ddat-capability-framework.service.gov.uk/)

## Overview

The Delivery Manager ensures the project is delivered on time and to quality standards. You use ArcKit to track plans, risks, backlogs, and traceability — giving you visibility across all project artifacts to identify blockers and governance gaps.

## Primary Commands

| Command | Purpose | Guide |
|---------|---------|-------|
| `/arckit.plan` | Create and maintain project plan with timeline and governance gates | [Guide](../plan.md) |
| `/arckit.risk` | Maintain risk register following HM Treasury Orange Book | [Guide](../risk.md) |
| `/arckit.backlog` | Generate and review product backlog for sprint planning | [Guide](../backlog.md) |
| `/arckit.trello` | Export backlog to Trello for team visibility | [Guide](../trello.md) |
| `/arckit.traceability` | Track requirements through design to tests — identify gaps | [Guide](../traceability.md) |
| `/arckit.health` | Scan for stale artifacts, orphaned requirements, and version drift | [Guide](../artifact-health.md) |

## Secondary Commands

| Command | Your Involvement | Guide |
|---------|-----------------|-------|
| `/arckit.stakeholders` | Review stakeholder map for delivery dependencies | [Guide](../stakeholder-analysis.md) |
| `/arckit.requirements` | Track requirements completion status | [Guide](../requirements.md) |
| `/arckit.story` | Generate project narrative for governance reporting | [Guide](../story.md) |
| `/arckit.operationalize` | Review operational readiness for go-live | [Guide](../operationalize.md) |
| `/arckit.analyze` | Review governance quality for delivery assurance | [Guide](../analyze.md) |
| `/arckit.service-assessment` | Prepare evidence for GDS Service Standard gates | [Guide](../service-assessment.md) |

## Typical Workflow

```
plan → stakeholders → risk → requirements → backlog → trello →
traceability → health → story
```

### Step-by-step

1. **Plan delivery**: Run `/arckit.plan` for timeline, phases, and governance gates
2. **Map stakeholders**: Ensure `/arckit.stakeholders` captures delivery dependencies
3. **Track risks**: Run `/arckit.risk` and review regularly — update mitigations as project progresses
4. **Monitor requirements**: Track completion of requirements from `/arckit.requirements`
5. **Manage backlog**: Run `/arckit.backlog` then `/arckit.trello` for sprint-level tracking
6. **Check traceability**: Run `/arckit.traceability` to ensure nothing falls through the cracks
7. **Health checks**: Run `/arckit.health` periodically to catch drift and stale artifacts
8. **Report progress**: Run `/arckit.story` for governance board updates

## Key Artifacts You Own

- `ARC-{PID}-PLAN-v*.md` — Project plan (co-owned with Product Manager)
- `ARC-{PID}-RISK-v*.md` — Risk register (co-owned with Security Architect)
- `ARC-{PID}-TRAC-v*.md` — Traceability matrix

## Related Roles

- [Product Manager](product-manager.md) — sets priorities you deliver against
- [Business Analyst](business-analyst.md) — maintains the requirements you track
- [Enterprise Architect](enterprise-architect.md) — sets the governance gates you manage
- [Service Owner](service-owner.md) — receives the service you deliver
