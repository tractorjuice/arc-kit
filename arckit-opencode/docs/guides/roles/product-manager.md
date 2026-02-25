# Product Manager — ArcKit Command Guide

> **DDaT Role Family**: [Product and Delivery](https://ddat-capability-framework.service.gov.uk/role/product-manager)
> **Framework**: [UK Government DDaT Capability Framework](https://ddat-capability-framework.service.gov.uk/)

## Overview

The Product Manager defines what to build and why. You own the planning, requirements, and backlog phases — translating stakeholder needs into a prioritised delivery plan with full traceability back to business goals.

## Primary Commands

| Command | Purpose | Guide |
|---------|---------|-------|
| `/arckit.plan` | Create project plan with timeline, phases, gates, and Mermaid diagrams | [Guide](#docs/guides/plan.md) |
| `/arckit.requirements` | Define business and technical requirements (co-own with Business Analyst) | [Guide](#docs/guides/requirements.md) |
| `/arckit.backlog` | Generate prioritised product backlog — user stories organised into sprints | [Guide](#docs/guides/backlog.md) |
| `/arckit.trello` | Export backlog to Trello board with sprint lists, labels, and checklists | [Guide](#docs/guides/trello.md) |
| `/arckit.story` | Generate project story for stakeholder communication | [Guide](#docs/guides/story.md) |

## Secondary Commands

| Command | Your Involvement | Guide |
|---------|-----------------|-------|
| `/arckit.stakeholders` | Identify and prioritise stakeholders for product decisions | [Guide](#docs/guides/stakeholder-analysis.md) |
| `/arckit.risk` | Review product and delivery risks | [Guide](#docs/guides/risk.md) |
| `/arckit.research` | Review technology research for product feasibility | [Guide](#docs/guides/research.md) |
| `/arckit.traceability` | Verify all requirements are covered in the backlog | [Guide](#docs/guides/traceability.md) |
| `/arckit.health` | Check for orphaned requirements or stale artifacts | [Guide](#docs/guides/artifact-health.md) |
| `/arckit.presentation` | Present product vision and progress to stakeholders | [Guide](#docs/guides/presentation.md) |
| `/arckit.service-assessment` | Prepare for GDS Service Standard assessment (if UK Gov) | [Guide](#docs/guides/service-assessment.md) |

## Typical Workflow

```
plan → stakeholders → requirements → backlog → trello → traceability → story
```

### Step-by-step

1. **Plan the project**: Run `/arckit.plan` for phases, milestones, and governance gates
2. **Understand stakeholders**: Review `/arckit.stakeholders` to know who needs what
3. **Define requirements**: Run `/arckit.requirements` — prioritise BR-xxx and FR-xxx with MoSCoW
4. **Generate backlog**: Run `/arckit.backlog` to convert requirements into user stories and sprints
5. **Export to tooling**: Run `/arckit.trello` to push backlog to Trello for team collaboration
6. **Check coverage**: Run `/arckit.traceability` to verify all requirements have backlog items
7. **Health check**: Run `/arckit.health` periodically to catch orphaned requirements
8. **Tell the story**: Run `/arckit.story` at milestones to communicate progress

## Key Artifacts You Own

- `ARC-{PID}-PLAN-v*.md` — Project plan
- `ARC-{PID}-BKLG-v*.md` — Product backlog (+ JSON export)
- `ARC-{PID}-STORY-v*.md` — Project story (co-owned with Enterprise Architect)

## Related Roles

- [Business Analyst](business-analyst.md) — co-owns requirements, provides detailed analysis
- [Delivery Manager](delivery-manager.md) — manages delivery of the backlog you prioritise
- [Business Architect](business-architect.md) — provides the strategic context for your product
- [Service Owner](service-owner.md) — takes ownership when the product goes live
