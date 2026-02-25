# CDO (Chief Data Officer) — ArcKit Command Guide

> **DDaT Role Family**: [Chief Digital and Data](https://ddat-capability-framework.service.gov.uk/role/chief-data-officer)
> **Framework**: [UK Government DDaT Capability Framework](https://ddat-capability-framework.service.gov.uk/)

## Overview

The Chief Data Officer sets data strategy and governance policy. You use ArcKit's data commands at a strategic level — ensuring data models, privacy assessments, and data contracts align with organisational data strategy and regulatory obligations.

## Primary Commands

| Command | Purpose | Guide |
|---------|---------|-------|
| `/arckit.data-model` | Review and approve data models for governance compliance | [Guide](#docs/guides/data-model.md) |
| `/arckit.dpia` | Oversee Data Protection Impact Assessments for regulatory compliance | [Guide](#docs/guides/dpia.md) |
| `/arckit.datascout` | Discover and catalogue external data sources across the organisation | [Guide](#docs/guides/datascout.md) |
| `/arckit.data-mesh-contract` | Define data governance standards for federated data products | [Guide](#docs/guides/data-mesh-contract.md) |

## Secondary Commands

| Command | Your Involvement | Guide |
|---------|-----------------|-------|
| `/arckit.principles` | Define data governance principles | [Guide](#docs/guides/principles.md) |
| `/arckit.requirements` | Review data requirements (DR-xxx) for strategic alignment | [Guide](#docs/guides/requirements.md) |
| `/arckit.strategy` | Contribute data strategy to Architecture Strategy | [Guide](#docs/guides/strategy.md) |
| `/arckit.analyze` | Review governance quality for data completeness | [Guide](#docs/guides/analyze.md) |
| `/arckit.platform-design` | Oversee data platform strategy for data marketplaces | [Guide](#docs/guides/platform-design.md) |
| `/arckit.atrs` | Review algorithmic transparency records for data ethics | [Guide](#docs/guides/atrs.md) |

## Typical Workflow

```
principles → requirements (DR-xxx) → datascout → data-model → data-mesh-contract → dpia
```

### Step-by-step

1. **Set data principles**: Contribute data governance principles to `/arckit.principles`
2. **Review data requirements**: Ensure DR-xxx requirements align with data strategy
3. **Catalogue data sources**: Run `/arckit.datascout` to map available data across the organisation
4. **Approve data models**: Review `/arckit.data-model` outputs for governance compliance
5. **Define contracts**: Run `/arckit.data-mesh-contract` for federated data governance standards
6. **Oversee privacy**: Review `/arckit.dpia` for regulatory compliance

## Key Artifacts You Oversee

- `ARC-{PID}-DATA-v*.md` — Data models (owned by Data Architect, approved by CDO)
- `ARC-{PID}-DPIA-v*.md` — DPIAs (owned by Data/Security Architect, approved by CDO)
- `ARC-{PID}-DSCT-v*.md` — Data source catalogue
- `ARC-{PID}-DMC-{NUM}-v*.md` — Data mesh contracts

## Related Roles

- [Data Architect](data-architect.md) — implements your data strategy at project level
- [Data Governance Manager](data-governance-manager.md) — enforces the policies you define
- [CTO/CDIO](cto-cdio.md) — aligns technology and data strategy
- [CISO](ciso.md) — co-owns data protection with you
