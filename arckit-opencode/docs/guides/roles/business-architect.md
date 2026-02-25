# Business Architect — ArcKit Command Guide

> **DDaT Role Family**: [Architecture](https://ddat-capability-framework.service.gov.uk/role/business-architect)
> **Framework**: [UK Government DDaT Capability Framework](https://ddat-capability-framework.service.gov.uk/)

## Overview

The Business Architect bridges business strategy and technology architecture. You own the strategic context phase — stakeholder analysis, business cases, and strategic planning — ensuring technical decisions align with organisational goals.

## Primary Commands

| Command | Purpose | Guide |
|---------|---------|-------|
| `/arckit.stakeholders` | Analyse stakeholder drivers, goals, and measurable outcomes | [Guide](#docs/guides/stakeholder-analysis.md) |
| `/arckit.sobc` | Create Strategic Outline Business Case (Green Book 5-case model) | [Guide](#docs/guides/sobc.md) |
| `/arckit.strategy` | Synthesise strategic artifacts into executive-level Architecture Strategy | [Guide](#docs/guides/strategy.md) |
| `/arckit.roadmap` | Create multi-year strategic roadmap with capability evolution | [Guide](#docs/guides/roadmap.md) |
| `/arckit.platform-design` | Design multi-sided platform strategy (Government as a Platform, marketplaces) | [Guide](#docs/guides/platform-design.md) |

## Secondary Commands

| Command | Your Involvement | Guide |
|---------|-----------------|-------|
| `/arckit.plan` | Create or review project plan and timeline | [Guide](#docs/guides/plan.md) |
| `/arckit.principles` | Contribute business-aligned architecture principles | [Guide](#docs/guides/principles.md) |
| `/arckit.requirements` | Review business requirements (BR-xxx) for alignment with strategy | [Guide](#docs/guides/requirements.md) |
| `/arckit.wardley` | Review Wardley Maps for strategic positioning | [Guide](#docs/guides/wardley.md) |
| `/arckit.risk` | Review business risks and strategic mitigations | [Guide](#docs/guides/risk.md) |
| `/arckit.presentation` | Present strategic findings to boards | [Guide](#docs/guides/presentation.md) |
| `/arckit.story` | Review project narrative for business alignment | [Guide](#docs/guides/story.md) |

## Typical Workflow

```
plan → principles → stakeholders → risk → sobc → strategy → roadmap
```

### For platform projects:
```
plan → principles → stakeholders → risk → sobc → requirements → platform-design → strategy → roadmap
```

### Step-by-step

1. **Plan the project**: Run `/arckit.plan` for project timeline and phases
2. **Set principles**: Contribute business principles to `/arckit.principles`
3. **Map stakeholders**: Run `/arckit.stakeholders` to identify drivers, goals, and power dynamics
4. **Assess risks**: Review `/arckit.risk` for business and strategic risks
5. **Build business case**: Run `/arckit.sobc` with Green Book 5-case model (Strategic, Economic, Commercial, Financial, Management)
6. **Design platform** (if applicable): Run `/arckit.platform-design` for ecosystem strategy
7. **Synthesise strategy**: Run `/arckit.strategy` to combine all strategic inputs
8. **Plan evolution**: Run `/arckit.roadmap` for multi-year capability roadmap

## Key Artifacts You Own

- `ARC-{PID}-STKE-v*.md` — Stakeholder analysis
- `ARC-{PID}-SOBC-v*.md` — Strategic Outline Business Case
- `ARC-{PID}-STGY-v*.md` — Architecture strategy
- `ARC-{PID}-ROAD-v*.md` — Strategic roadmap
- `ARC-{PID}-PLAT-v*.md` — Platform design (if applicable)

## Related Roles

- [Enterprise Architect](enterprise-architect.md) — uses your strategic context for governance decisions
- [Product Manager](product-manager.md) — translates your strategy into delivery plans
- [CTO/CDIO](cto-cdio.md) — consumes your strategy and roadmap at executive level
- [Solution Architect](solution-architect.md) — designs solutions aligned to your business case
