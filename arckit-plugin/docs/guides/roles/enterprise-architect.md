# Enterprise Architect — ArcKit Command Guide

> **DDaT Role Family**: [Architecture](https://ddat-capability-framework.service.gov.uk/role/enterprise-architect)
> **Framework**: [UK Government DDaT Capability Framework](https://ddat-capability-framework.service.gov.uk/)

## Overview

The Enterprise Architect owns the architecture governance framework and is the primary ArcKit user. All 52 commands are relevant to this role — you set up principles, define the governance lifecycle, and ensure all architecture artifacts meet organisational standards.

## Primary Commands

Commands you typically own and drive:

| Command | Purpose | Guide |
|---------|---------|-------|
| `/arckit.init` | Set up project structure with numbered directories and global artifacts | [Guide](#docs/guides/plan.md) |
| `/arckit.principles` | Define enterprise architecture principles that govern all projects | [Guide](#docs/guides/principles.md) |
| `/arckit.strategy` | Synthesise strategic artifacts into executive-level Architecture Strategy | [Guide](#docs/guides/strategy.md) |
| `/arckit.roadmap` | Create multi-year strategic roadmap with capability evolution | [Guide](#docs/guides/roadmap.md) |
| `/arckit.wardley` | Map strategic landscape with Wardley Maps for build vs buy decisions | [Guide](#docs/guides/wardley.md) |
| `/arckit.analyze` | Run governance quality analysis across all architecture artifacts | [Guide](#docs/guides/analyze.md) |
| `/arckit.principles-compliance` | Score compliance against architecture principles | [Guide](#docs/guides/principles-compliance.md) |
| `/arckit.conformance` | Assess ADR implementation, architecture drift, and technical debt | [Guide](#docs/guides/conformance.md) |
| `/arckit.health` | Scan for stale research, orphaned requirements, and version drift | [Guide](#docs/guides/artifact-health.md) |
| `/arckit.story` | Generate comprehensive project narrative for governance reporting | [Guide](#docs/guides/story.md) |
| `/arckit.presentation` | Create MARP slide deck for Architecture Review Boards | [Guide](#docs/guides/presentation.md) |
| `/arckit.pages` | Publish architecture documentation as a GitHub Pages site | [Guide](#docs/guides/pages.md) |

## Secondary Commands

Commands you delegate to specialists but review or consume outputs from:

| Command | Your Involvement | Guide |
|---------|-----------------|-------|
| `/arckit.plan` | Review project plans for alignment with architecture governance | [Guide](#docs/guides/plan.md) |
| `/arckit.stakeholders` | Review stakeholder analysis, ensure all architecture forums captured | [Guide](#docs/guides/stakeholder-analysis.md) |
| `/arckit.risk` | Review architecture risks, ensure mitigations align with principles | [Guide](#docs/guides/risk.md) |
| `/arckit.sobc` | Review business case for strategic alignment | [Guide](#docs/guides/sobc.md) |
| `/arckit.requirements` | Review requirements for completeness, traceability | [Guide](#docs/guides/requirements.md) |
| `/arckit.research` | Review technology research and build vs buy recommendations | [Guide](#docs/guides/research.md) |
| `/arckit.adr` | Chair ADR reviews, ensure decisions align with principles | [Guide](#docs/guides/adr.md) |
| `/arckit.hld-review` | Lead HLD review against principles and requirements | [Guide](#docs/guides/hld-review.md) |
| `/arckit.dld-review` | Lead DLD review for implementation readiness | [Guide](#docs/guides/dld-review.md) |
| `/arckit.service-assessment` | Support GDS Service Standard assessment preparation | [Guide](#docs/guides/service-assessment.md) |
| `/arckit.tcop` | Review TCoP compliance | [Guide](#docs/guides/tcop.md) |
| `/arckit.customize` | Tailor templates to organisational standards | [Guide](#docs/guides/customize.md) |

## Typical Workflow

```
principles → plan → stakeholders → risk → sobc → requirements →
research → wardley → adr → diagram → hld-review → dld-review →
backlog → traceability → principles-compliance → conformance →
analyze → story → presentation → pages
```

### Step-by-step

1. **Establish governance**: Run `/arckit.principles` to define the architecture principles that all projects must follow
2. **Initiate project**: Run `/arckit.init` then `/arckit.plan` for project structure and timeline
3. **Delegate foundation**: Assign stakeholders, risk, sobc, requirements to Business Architect / Business Analyst
4. **Guide research**: Review outputs from `/arckit.research`, `/arckit.wardley`, cloud research commands
5. **Review decisions**: Lead ADR sessions, review HLD and DLD via `/arckit.hld-review` and `/arckit.dld-review`
6. **Assess compliance**: Run `/arckit.principles-compliance`, `/arckit.conformance`, `/arckit.analyze`
7. **Report**: Generate `/arckit.story` and `/arckit.presentation` for governance boards
8. **Publish**: Run `/arckit.pages` to publish the full documentation set

## Key Artifacts You Own

- `ARC-000-PRIN-v*.md` — Enterprise architecture principles (global)
- `ARC-{PID}-ANAL-v*.md` — Governance quality analysis
- `ARC-{PID}-PRIN-COMP-v*.md` — Principles compliance scorecard
- `ARC-{PID}-CONF-v*.md` — Architecture conformance assessment
- `ARC-{PID}-STORY-v*.md` — Project story
- `ARC-{PID}-STGY-v*.md` — Architecture strategy

## Related Roles

- [Solution Architect](solution-architect.md) — designs the technical solution you govern
- [Business Architect](business-architect.md) — provides the business context you synthesise
- [CTO/CDIO](cto-cdio.md) — consumes your strategy and roadmap outputs
- [Security Architect](security-architect.md) — owns the security compliance you review
