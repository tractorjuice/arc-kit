# IT Service Manager — ArcKit Command Guide

> **DDaT Role Family**: [IT Operations](https://ddat-capability-framework.service.gov.uk/role/it-service-manager)
> **Framework**: [UK Government DDaT Capability Framework](https://ddat-capability-framework.service.gov.uk/)

## Overview

The IT Service Manager ensures IT services are delivered effectively and efficiently. You use ArcKit to design ITSM processes, prepare operational readiness documentation, and manage cloud costs.

## Primary Commands

| Command | Purpose | Guide |
|---------|---------|-------|
| `/arckit.servicenow` | Design ServiceNow service management — CMDB, SLAs, incident, change, problem management | [Guide](#docs/guides/servicenow.md) |
| `/arckit.operationalize` | Create operational readiness pack — support model, runbooks, DR/BCP, on-call, handover | [Guide](#docs/guides/operationalize.md) |
| `/arckit.finops` | Create FinOps strategy — cloud cost management, optimization, governance, forecasting | [Guide](#docs/guides/finops.md) |

## Secondary Commands

| Command | Your Involvement | Guide |
|---------|-----------------|-------|
| `/arckit.requirements` | Review service-level requirements (SLAs, availability, support hours) | [Guide](#docs/guides/requirements.md) |
| `/arckit.risk` | Review operational risks and service continuity | [Guide](#docs/guides/risk.md) |
| `/arckit.backlog` | Review backlog for operational and support stories | [Guide](#docs/guides/backlog.md) |
| `/arckit.traceability` | Verify service requirements trace to operational design | [Guide](#docs/guides/traceability.md) |
| `/arckit.health` | Monitor artifact health for live service documentation | [Guide](#docs/guides/artifact-health.md) |
| `/arckit.diagram` | Review infrastructure and service diagrams | [Guide](#docs/guides/diagram.md) |

## Typical Workflow

```
requirements → servicenow → finops → operationalize
```

### Step-by-step

1. **Understand SLAs**: Review service-level requirements from `/arckit.requirements`
2. **Design ITSM**: Run `/arckit.servicenow` for CMDB configuration, SLA design, incident workflows
3. **Plan cost management**: Run `/arckit.finops` for cloud cost governance and optimization
4. **Prepare for live**: Run `/arckit.operationalize` for runbooks, DR/BCP, and support handover

## Key Artifacts You Own

- `ARC-{PID}-SNOW-v*.md` — ServiceNow service design (co-owned with Service Owner)
- `ARC-{PID}-FINOPS-v*.md` — FinOps strategy
- `ARC-{PID}-OPS-v*.md` — Operational readiness pack (co-owned with Technical Architect)

## Related Roles

- [Service Owner](service-owner.md) — accountable for the service you manage
- [Technical Architect](technical-architect.md) — designs the infrastructure you operate
- [DevOps Engineer](devops-engineer.md) — automates the deployments you manage changes for
- [Delivery Manager](delivery-manager.md) — manages the transition to your operational support
