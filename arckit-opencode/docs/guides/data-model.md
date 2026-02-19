# Data Model Quick Guide

`/arckit.data-model` transforms Data Requirements (DR-xxx) into an ERD, governance catalogue, and GDPR compliance pack.

---

## Inputs Checklist

| Artefact | Purpose |
|----------|---------|
| `ARC-<id>-REQ-v1.0.md` with DR-xxx entries | Defines entities and attributes |
| Up-to-date stakeholders & risk register | Drives governance roles and retention risk |
| Latest architecture diagrams | Populate CRUD matrix and integrations |

---

## Command

```bash
/arckit.data-model Create data model for <project name>
```

Output: `projects/<id>/ARC-<id>-DATA-v1.0.md`

---

## Deliverable Snapshot

| Section | Highlights | Next Action |
|---------|------------|-------------|
| Mermaid ERD | Normalised entity diagram ready for mermaid.live | Share with architects for validation |
| Entity catalogue | Attributes, data types, keys, derived fields | Flag unknown data types for modelling session |
| GDPR pack | PII inventory, legal basis, retention, data subject rights | Review with DPO; schedule DPIA if high risk |
| Governance matrix | Owner, steward, custodian, classification | Update RACI and onboarding materials |
| CRUD & integrations | Component ↔ entity access + upstream/downstream feeds | Align with API contracts and ETL plans |
| Data quality | KPIs, controls, monitoring cadence | Feed into ServiceNow service design |

---

## Compliance Focus

- **Identify PII** – mark direct/indirect PII in the catalogue.
- **Retention** – confirm duration against organisation policy.
- **Security** – ensure encryption/segmentation controls align with risk appetite.
- **Subject rights** – validate mechanism for access/erasure/export.

Use the output to enrich `/arckit.dpia` (automatic when run afterwards).

---

## Review Tips

- Run the command whenever requirements change materially.
- Ask data stewards to sign off catalogue rows before build.
- Store diagrams alongside other architecture artefacts for audit trails.

---

## Related Commands

- `/arckit.dpia` - Generate Data Protection Impact Assessment (auto-references data model)
- `/arckit.data-mesh-contract` - Create federated data product contracts from entities (mesh architecture)
- `/arckit.traceability` - Link entities to requirements and test cases

## UK Government Data Policy

For UK Government data projects, the data model provides evidence for the [National Data Strategy](https://www.gov.uk/government/publications/uk-national-data-strategy/national-data-strategy) — particularly the **Data Foundations** pillar (metadata standards, data quality) and **Availability** pillar (data access controls, sharing agreements). The Data Quality Framework section aligns with the [Government Data Quality Framework](https://www.gov.uk/government/publications/the-government-data-quality-framework/the-government-data-quality-framework) (6 dimensions, 5 principles). See `docs/guides/national-data-strategy.md` and `docs/guides/data-quality-framework.md` for full mappings.
