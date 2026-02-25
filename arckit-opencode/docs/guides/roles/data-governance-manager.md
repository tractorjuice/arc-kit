# Data Governance Manager — ArcKit Command Guide

> **DDaT Role Family**: [Data](https://ddat-capability-framework.service.gov.uk/role/data-governance-manager)
> **Framework**: [UK Government DDaT Capability Framework](https://ddat-capability-framework.service.gov.uk/)

## Overview

The Data Governance Manager ensures data is managed according to organisational policies and regulatory requirements. You use ArcKit to assess data protection compliance, review data models for governance standards, and measure principles adherence.

## Primary Commands

| Command | Purpose | Guide |
|---------|---------|-------|
| `/arckit.dpia` | Generate Data Protection Impact Assessment for UK GDPR compliance | [Guide](#docs/guides/dpia.md) |
| `/arckit.data-model` | Review data models for governance compliance (classification, retention, lineage) | [Guide](#docs/guides/data-model.md) |
| `/arckit.principles-compliance` | Assess compliance with data governance principles | [Guide](#docs/guides/principles-compliance.md) |
| `/arckit.data-mesh-contract` | Review and enforce data product contracts and SLAs | [Guide](#docs/guides/data-mesh-contract.md) |

## Secondary Commands

| Command | Your Involvement | Guide |
|---------|-----------------|-------|
| `/arckit.principles` | Define data governance principles | [Guide](#docs/guides/principles.md) |
| `/arckit.requirements` | Review data requirements (DR-xxx) for governance standards | [Guide](#docs/guides/requirements.md) |
| `/arckit.datascout` | Review external data sources for compliance and licensing | [Guide](#docs/guides/datascout.md) |
| `/arckit.traceability` | Verify data requirements trace through to governance controls | [Guide](#docs/guides/traceability.md) |
| `/arckit.analyze` | Review governance quality for data governance gaps | [Guide](#docs/guides/analyze.md) |
| `/arckit.atrs` | Review algorithmic transparency for data ethics compliance | [Guide](#docs/guides/atrs.md) |

## Typical Workflow

```
principles → requirements (DR-xxx) → data-model → dpia → data-mesh-contract → principles-compliance
```

### Step-by-step

1. **Set governance standards**: Define data governance principles in `/arckit.principles`
2. **Review data requirements**: Ensure DR-xxx requirements include classification, retention, and lineage
3. **Validate data models**: Review `/arckit.data-model` for GDPR compliance and governance standards
4. **Assess privacy**: Run `/arckit.dpia` for any personal data processing
5. **Enforce contracts**: Review `/arckit.data-mesh-contract` for SLA and quality standards
6. **Measure compliance**: Run `/arckit.principles-compliance` to score adherence to data principles

## Key Artifacts You Review/Approve

- `ARC-{PID}-DPIA-v*.md` — Data Protection Impact Assessment
- `ARC-{PID}-DATA-v*.md` — Data model governance sections
- `ARC-{PID}-DMC-{NUM}-v*.md` — Data mesh contracts
- `ARC-{PID}-PRIN-COMP-v*.md` — Principles compliance scorecard (data sections)

## Related Roles

- [CDO](cdo.md) — sets the data strategy you enforce
- [Data Architect](data-architect.md) — designs the data models you govern
- [Security Architect](security-architect.md) — co-owns data protection compliance
- [Enterprise Architect](enterprise-architect.md) — aligns data governance with architecture governance
