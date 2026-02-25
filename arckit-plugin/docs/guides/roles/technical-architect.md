# Technical Architect — ArcKit Command Guide

> **DDaT Role Family**: [Architecture](https://ddat-capability-framework.service.gov.uk/role/technical-architect)
> **Framework**: [UK Government DDaT Capability Framework](https://ddat-capability-framework.service.gov.uk/)

## Overview

The Technical Architect translates high-level designs into implementable architecture. You own the detailed design, infrastructure patterns, and operational architecture — ensuring solutions can actually be built, deployed, and run.

## Primary Commands

| Command | Purpose | Guide |
|---------|---------|-------|
| `/arckit.diagram` | Create architecture diagrams (C4, sequence, dataflow) | [Guide](../diagram.md) |
| `/arckit.hld-review` | Review High-Level Design against principles and requirements | [Guide](../hld-review.md) |
| `/arckit.dld-review` | Review Detailed Design for implementation readiness | [Guide](../dld-review.md) |
| `/arckit.devops` | Create DevOps strategy with CI/CD, IaC, and container orchestration | [Guide](../devops.md) |
| `/arckit.operationalize` | Create operational readiness pack — runbooks, DR/BCP, on-call, handover | [Guide](../operationalize.md) |

## Secondary Commands

| Command | Your Involvement | Guide |
|---------|-----------------|-------|
| `/arckit.requirements` | Review NFR requirements (performance, scalability, availability) | [Guide](../requirements.md) |
| `/arckit.research` | Evaluate technology options and implementation feasibility | [Guide](../research.md) |
| `/arckit.azure-research` | Deep-dive Azure infrastructure services | [Guide](../azure-research.md) |
| `/arckit.aws-research` | Deep-dive AWS infrastructure services | [Guide](../aws-research.md) |
| `/arckit.gcp-research` | Deep-dive GCP infrastructure services | [Guide](../gcp-research.md) |
| `/arckit.adr` | Record infrastructure and technology decisions | [Guide](../adr.md) |
| `/arckit.servicenow` | Design ITSM integration (CMDB, incident, change) | [Guide](../servicenow.md) |
| `/arckit.mlops` | Design ML pipeline infrastructure (for AI projects) | [Guide](../mlops.md) |
| `/arckit.finops` | Review cloud cost architecture | [Guide](../finops.md) |
| `/arckit.backlog` | Review backlog for technical feasibility and effort estimation | [Guide](../backlog.md) |

## Typical Workflow

```
requirements → research → cloud-research → adr → diagram →
hld-review → dld-review → devops → operationalize
```

### Step-by-step

1. **Understand NFRs**: Review performance, scalability, and availability requirements from `/arckit.requirements`
2. **Research options**: Run `/arckit.research` and cloud-specific research for infrastructure choices
3. **Record decisions**: Run `/arckit.adr` for technology stack, hosting, and infrastructure decisions
4. **Create diagrams**: Run `/arckit.diagram` for container, deployment, and infrastructure diagrams
5. **Review HLD**: Run `/arckit.hld-review` to validate the high-level architecture
6. **Detail the design**: Author DLD, then run `/arckit.dld-review` for implementation readiness
7. **Design CI/CD**: Run `/arckit.devops` for pipeline architecture, IaC, and deployment strategy
8. **Prepare operations**: Run `/arckit.operationalize` for runbooks, DR/BCP, and handover docs

## Key Artifacts You Own

- `ARC-{PID}-DIAG-{NUM}-v*.md` — Architecture diagrams
- `ARC-{PID}-HLDR-v*.md` — HLD review (co-owned with Solution Architect)
- `ARC-{PID}-DLDR-v*.md` — DLD review
- `ARC-{PID}-DEVOPS-v*.md` — DevOps strategy
- `ARC-{PID}-OPS-v*.md` — Operational readiness pack

## Related Roles

- [Solution Architect](solution-architect.md) — provides the HLD you detail into implementable design
- [DevOps Engineer](devops-engineer.md) — implements the CI/CD pipelines you design
- [IT Service Manager](it-service-manager.md) — receives the operational handover you prepare
- [Network Architect](network-architect.md) — collaborates on infrastructure and network design
