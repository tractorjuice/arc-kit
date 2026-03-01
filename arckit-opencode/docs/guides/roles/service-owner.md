# Service Owner — ArcKit Command Guide

> **DDaT Role Family**: [Product and Delivery](https://ddat-capability-framework.service.gov.uk/role/service-owner)
> **Framework**: [UK Government DDaT Capability Framework](https://ddat-capability-framework.service.gov.uk/)

## Overview

The Service Owner is accountable for the quality and performance of a live service. You use ArcKit to design service management, prepare operational readiness, and evidence compliance for service assessments.

## Primary Commands

| Command | Purpose | Guide |
|---------|---------|-------|
| `/arckit.servicenow` | Design ServiceNow service management — CMDB, SLAs, incident, change, problem | [Guide](#docs/guides/servicenow.md) |
| `/arckit.operationalize` | Create operational readiness pack — support model, runbooks, DR/BCP, handover | [Guide](#docs/guides/operationalize.md) |
| `/arckit.service-assessment` | Prepare for GDS Service Standard assessment (14 points) | [Guide](#docs/guides/service-assessment.md) |

## Secondary Commands

| Command | Your Involvement | Guide |
|---------|-----------------|-------|
| `/arckit.plan` | Review project plan for go-live milestones | [Guide](#docs/guides/plan.md) |
| `/arckit.stakeholders` | Ensure service users and support teams are captured | [Guide](#docs/guides/stakeholder-analysis.md) |
| `/arckit.requirements` | Review service-level requirements (NFR-A availability, NFR-P performance) | [Guide](#docs/guides/requirements.md) |
| `/arckit.risk` | Review operational risks and service continuity | [Guide](#docs/guides/risk.md) |
| `/arckit.backlog` | Review backlog for operational stories | [Guide](#docs/guides/backlog.md) |
| `/arckit.finops` | Review cloud cost management for the service | [Guide](#docs/guides/finops.md) |
| `/arckit.story` | Generate service narrative for governance boards | [Guide](#docs/guides/story.md) |
| `/arckit.health` | Monitor artifact health for the service | [Guide](#docs/guides/artifact-health.md) |

## Typical Workflow

```text
requirements → servicenow → operationalize → service-assessment → story
```

### Step-by-step

1. **Understand requirements**: Review NFR requirements for availability, performance, and support SLAs
2. **Design service management**: Run `/arckit.servicenow` for CMDB, SLAs, incident workflows, change control
3. **Prepare operations**: Run `/arckit.operationalize` for runbooks, DR/BCP, on-call rotas, and handover docs
4. **Assess readiness**: Run `/arckit.service-assessment` to evidence compliance against GDS Service Standard
5. **Report**: Run `/arckit.story` to document the service journey for governance

## Key Artifacts You Own

- `ARC-{PID}-SNOW-v*.md` — ServiceNow service design
- `ARC-{PID}-OPS-v*.md` — Operational readiness pack
- `ARC-{PID}-SVCASS-v*.md` — Service assessment report

## Related Roles

- [IT Service Manager](it-service-manager.md) — manages day-to-day service operations you're accountable for
- [Technical Architect](technical-architect.md) — designs the infrastructure your service runs on
- [Product Manager](product-manager.md) — hands off the product for you to run as a live service
- [Delivery Manager](delivery-manager.md) — manages the transition to live service
