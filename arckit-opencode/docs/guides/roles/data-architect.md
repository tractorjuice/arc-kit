# Data Architect — ArcKit Command Guide

> **DDaT Role Family**: [Architecture](https://ddat-capability-framework.service.gov.uk/role/data-architect)
> **Framework**: [UK Government DDaT Capability Framework](https://ddat-capability-framework.service.gov.uk/)

## Overview

The Data Architect designs data structures, governance, and flows. You own ArcKit's data-focused commands — ensuring data models are GDPR-compliant, data sources are catalogued, and data contracts enforce quality standards across the organisation.

## Primary Commands

| Command | Purpose | Guide |
|---------|---------|-------|
| `/arckit.data-model` | Create comprehensive data model with entity relationships, GDPR compliance, and governance | [Guide](#docs/guides/data-model.md) |
| `/arckit.data-mesh-contract` | Define federated data product contracts with SLAs and interoperability guarantees | [Guide](#docs/guides/data-mesh-contract.md) |
| `/arckit.dpia` | Generate Data Protection Impact Assessment for UK GDPR Article 35 | [Guide](#docs/guides/dpia.md) |
| `/arckit.datascout` | Discover external data sources — APIs, datasets, open data portals | [Guide](#docs/guides/datascout.md) |

## Secondary Commands

| Command | Your Involvement | Guide |
|---------|-----------------|-------|
| `/arckit.requirements` | Define Data Requirements (DR-xxx) within the requirements specification | [Guide](#docs/guides/requirements.md) |
| `/arckit.principles` | Contribute data governance principles | [Guide](#docs/guides/principles.md) |
| `/arckit.diagram` | Review data flow diagrams for accuracy | [Guide](#docs/guides/diagram.md) |
| `/arckit.traceability` | Verify DR-xxx requirements trace to data model entities | [Guide](#docs/guides/traceability.md) |
| `/arckit.research` | Evaluate data platforms and storage technologies | [Guide](#docs/guides/research.md) |
| `/arckit.platform-design` | Design data platform ecosystems (data marketplaces, data mesh) | [Guide](#docs/guides/platform-design.md) |

## Typical Workflow

```text
requirements (DR-xxx) → datascout → data-model → data-mesh-contract → dpia
```

### Step-by-step

1. **Define data requirements**: Work with Business Analyst to define DR-xxx requirements in `/arckit.requirements`
2. **Discover data sources**: Run `/arckit.datascout` to find external APIs, datasets, and open data portals
3. **Design data model**: Run `/arckit.data-model` — entities, relationships, GDPR classification, retention policies
4. **Define data contracts**: Run `/arckit.data-mesh-contract` for federated governance (if using data mesh)
5. **Assess privacy impact**: Run `/arckit.dpia` for any processing involving personal data
6. **Verify traceability**: Review `/arckit.traceability` output to confirm all DR-xxx requirements are covered

## Key Artifacts You Own

- `ARC-{PID}-DATA-v*.md` — Data model with entity-relationship diagrams
- `ARC-{PID}-DMC-{NUM}-v*.md` — Data mesh contracts
- `ARC-{PID}-DPIA-v*.md` — Data Protection Impact Assessment
- `ARC-{PID}-DSCT-v*.md` — Data source catalogue

## UK Government Data Context

ArcKit's data commands are designed for UK public sector data governance:

- **datascout** prioritises UK Government open data (data.gov.uk, ONS, NHS Digital, Companies House, OS Data Hub)
- **data-model** includes GDPR compliance classification and ICO lawful basis
- **dpia** follows ICO guidance for UK GDPR Article 35
- **data-mesh-contract** supports TCoP Point 10 (share and reuse technology)

## Related Roles

- [Data Governance Manager](data-governance-manager.md) — enforces the policies your model defines
- [CDO](cdo.md) — sets the data strategy you implement
- [Solution Architect](solution-architect.md) — integrates your data model into the solution design
- [Business Analyst](business-analyst.md) — provides the data requirements you model
