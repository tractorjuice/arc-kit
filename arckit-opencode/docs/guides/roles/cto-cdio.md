# CTO / CDIO — ArcKit Command Guide

> **DDaT Role Family**: [Chief Digital and Data](https://ddat-capability-framework.service.gov.uk/role/chief-technology-officer)
> **Framework**: [UK Government DDaT Capability Framework](https://ddat-capability-framework.service.gov.uk/)

## Overview

The Chief Technology Officer (CTO) or Chief Digital and Information Officer (CDIO) sets technology strategy and direction. You use ArcKit's strategic and reporting commands to define principles, visualise the technology landscape, and present architectural decisions to boards.

## Primary Commands

| Command | Purpose | Guide |
|---------|---------|-------|
| `/arckit.principles` | Define enterprise-wide architecture principles | [Guide](#docs/guides/principles.md) |
| `/arckit.strategy` | Synthesise strategic artifacts into executive-level Architecture Strategy | [Guide](#docs/guides/strategy.md) |
| `/arckit.roadmap` | Create multi-year strategic roadmap with capability evolution | [Guide](#docs/guides/roadmap.md) |
| `/arckit.wardley` | Visualise technology landscape and evolution with Wardley Maps | [Guide](#docs/guides/wardley.md) |
| `/arckit.presentation` | Generate board-level slide decks from architecture artifacts | [Guide](#docs/guides/presentation.md) |

## Secondary Commands

| Command | Your Involvement | Guide |
|---------|-----------------|-------|
| `/arckit.plan` | Review project plans for strategic alignment | [Guide](#docs/guides/plan.md) |
| `/arckit.sobc` | Review business cases for investment decisions | [Guide](#docs/guides/sobc.md) |
| `/arckit.analyze` | Review governance quality across the portfolio | [Guide](#docs/guides/analyze.md) |
| `/arckit.conformance` | Monitor architecture conformance across projects | [Guide](#docs/guides/conformance.md) |
| `/arckit.story` | Review project narratives for executive reporting | [Guide](#docs/guides/story.md) |
| `/arckit.tcop` | Review TCoP compliance across the department | [Guide](#docs/guides/tcop.md) |
| `/arckit.research` | Review technology research for strategic implications | [Guide](#docs/guides/research.md) |

## Typical Workflow

```
principles → wardley → strategy → roadmap → presentation
```

### Step-by-step

1. **Set principles**: Run `/arckit.principles` to establish the architecture principles for your organisation
2. **Map the landscape**: Run `/arckit.wardley` to visualise current technology positions and evolution
3. **Synthesise strategy**: Run `/arckit.strategy` to combine principles, stakeholder needs, and Wardley Maps into a coherent strategy
4. **Plan evolution**: Run `/arckit.roadmap` for a multi-year capability roadmap with investment phases
5. **Present to board**: Run `/arckit.presentation` in Executive focus mode for board-level slides

## Key Artifacts You Own

- `ARC-000-PRIN-v*.md` — Enterprise architecture principles (global, cross-project)
- `ARC-{PID}-STGY-v*.md` — Architecture strategy (co-owned with Enterprise Architect)
- `ARC-{PID}-ROAD-v*.md` — Strategic roadmap

## Related Roles

- [Enterprise Architect](enterprise-architect.md) — implements the governance framework under your direction
- [Business Architect](business-architect.md) — provides the business context for your strategy
- [CISO](ciso.md) — advises on security strategy and risk appetite
- [CDO](cdo.md) — advises on data strategy and governance
