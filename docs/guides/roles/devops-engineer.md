# DevOps Engineer — ArcKit Command Guide

> **DDaT Role Family**: [Software Development](https://ddat-capability-framework.service.gov.uk/role/development-operations-devops-engineer)
> **Framework**: [UK Government DDaT Capability Framework](https://ddat-capability-framework.service.gov.uk/)

## Overview

The DevOps Engineer designs and implements CI/CD pipelines, infrastructure as code, and deployment automation. You use ArcKit to generate DevOps strategy documents and review architecture diagrams for deployment and infrastructure patterns.

## Primary Commands

| Command | Purpose | Guide |
|---------|---------|-------|
| `/arckit.devops` | Create DevOps strategy — CI/CD pipelines, IaC, container orchestration, developer experience | [Guide](#docs/guides/devops.md) |
| `/arckit.mlops` | Create MLOps strategy — model lifecycle, training pipelines, serving, monitoring (for AI projects) | [Guide](#docs/guides/mlops.md) |
| `/arckit.diagram` | Create deployment, infrastructure, and pipeline architecture diagrams | [Guide](#docs/guides/diagram.md) |

## Secondary Commands

| Command | Your Involvement | Guide |
|---------|-----------------|-------|
| `/arckit.requirements` | Review NFR requirements (deployment frequency, MTTR, change failure rate) | [Guide](#docs/guides/requirements.md) |
| `/arckit.operationalize` | Contribute to runbooks, monitoring, and alerting | [Guide](#docs/guides/operationalize.md) |
| `/arckit.finops` | Review cloud cost implications of infrastructure choices | [Guide](#docs/guides/finops.md) |
| `/arckit.backlog` | Review backlog for DevOps and infrastructure stories | [Guide](#docs/guides/backlog.md) |
| `/arckit.adr` | Record infrastructure and tooling decisions | [Guide](#docs/guides/adr.md) |
| `/arckit.azure-research` | Research Azure DevOps and infrastructure services | [Guide](#docs/guides/azure-research.md) |
| `/arckit.aws-research` | Research AWS DevOps and infrastructure services | [Guide](#docs/guides/aws-research.md) |

## Typical Workflow

```text
requirements → diagram → devops → mlops → operationalize
```

### Step-by-step

1. **Understand NFRs**: Review deployment, availability, and performance requirements
2. **Create diagrams**: Run `/arckit.diagram` for deployment and infrastructure views
3. **Design DevOps**: Run `/arckit.devops` for CI/CD, IaC, and container strategy
4. **Design MLOps** (if AI project): Run `/arckit.mlops` for model pipeline infrastructure
5. **Contribute to operations**: Help create runbooks and monitoring in `/arckit.operationalize`

## Key Artifacts You Own

- `ARC-{PID}-DEVOPS-v*.md` — DevOps strategy
- `ARC-{PID}-MLOPS-v*.md` — MLOps strategy (for AI projects)

## Related Roles

- [Technical Architect](technical-architect.md) — designs the infrastructure you automate
- [IT Service Manager](it-service-manager.md) — manages the services you deploy to
- [Solution Architect](solution-architect.md) — defines the architecture your pipelines build
