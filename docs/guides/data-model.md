# Data model: entity relationship diagram (ERD) and logical model

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

A data model describes what a system holds data about, what it records about each thing and how those things relate. This guide covers entity relationship diagrams (ERDs), the conceptual, logical and physical levels of modelling, and how `/arckit:data-model` builds a model from your data requirements.

---

## What a data model is

A data model has three building blocks:

- **Entities**: the things you hold data about, such as Customer, Order or Payment.
- **Attributes**: the facts you record about each entity, with a data type and any keys.
- **Relationships**: how entities connect, and how many of one can relate to the other (cardinality).

The usual picture of a data model is an entity relationship diagram (ERD). Peter Chen proposed the entity-relationship model in [a 1976 paper in ACM Transactions on Database Systems](https://doi.org/10.1145/320434.320440). Its abstract says: "A special diagrammatic technique is introduced as a tool for database design."

In an ERD, each box is an entity and each line is a relationship. The symbols at the ends of a line give the cardinality. [Mermaid](https://mermaid.js.org/syntax/entityRelationshipDiagram.html), which ArcKit uses, draws ERDs in crow's foot notation:

- `|o` or `o|`: zero or one
- `||`: exactly one
- `}o` or `o{`: zero or more
- `}|` or `|{`: one or more

Keys are marked `PK` (primary key), `FK` (foreign key) or `UK` (unique key).

---

## Conceptual, logical and physical data models

Data models are usually built at three levels of detail. AWS's [guide to data modeling](https://aws.amazon.com/what-is/data-modeling/) describes them like this:

| Level | What it shows | Usually written by |
|-------|---------------|--------------------|
| Conceptual | The big picture: what data the system holds and the business rules it follows | Business stakeholders and analysts |
| Logical | Entities, attributes with their data types, keys and relationships. It does not depend on any database product | Data architects and analysts |
| Physical | How the logical model is built in a specific database: its field types, relationships and performance tuning | Data engineers |

The same guide notes that teams typically choose their database technology after the logical model is done, and that some agile teams skip the logical model and go straight from conceptual to physical.

---

## What a data model should contain

A data model that others can review and build from records, for each entity:

- a name, a definition and the requirement it comes from
- its attributes, with type, whether each is required, and its keys
- its relationships to other entities, with cardinality
- who owns it and who looks after it day to day
- its classification, retention period and whether it holds personal data

`/arckit:data-model` produces a logical model in this shape, with some physical detail added: suggested indexes, a database technology recommendation and a schema migration approach.

---

## Using /arckit:data-model

`/arckit:data-model` transforms Data Requirements (DR-xxx) into an ERD, governance catalogue, and GDPR compliance pack.

## Inputs Checklist

| Artefact | Purpose |
|----------|---------|
| `ARC-<id>-REQ-v1.0.md` with DR-xxx entries | Defines entities and attributes |
| Up-to-date stakeholders & risk register | Drives governance roles and retention risk |
| Latest architecture diagrams | Populate CRUD matrix and integrations |

---

## Command

```bash
/arckit:data-model Create data model for <project name>
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

Use the output to enrich `/arckit:dpia` (automatic when run afterwards).

---

## Review Tips

- Run the command whenever requirements change materially.
- Ask data stewards to sign off catalogue rows before build.
- Store diagrams alongside other architecture artefacts for audit trails.

---

## Related Commands

- `/arckit:dpia` - Generate Data Protection Impact Assessment (auto-references data model)
- `/arckit:data-mesh-contract` - Create federated data product contracts from entities (mesh architecture)
- `/arckit:traceability` - Link entities to requirements and test cases

## UK Government Data Policy

For UK Government data projects, the data model provides evidence for the [National Data Strategy](https://www.gov.uk/government/publications/uk-national-data-strategy/national-data-strategy) — particularly the **Data foundations** pillar (metadata standards, data quality) and **Data availability** pillar (data access controls, sharing agreements). The Data Quality Framework section aligns with the [Government Data Quality Framework](https://www.gov.uk/government/publications/the-government-data-quality-framework/the-government-data-quality-framework) (6 dimensions, 5 principles). See the [National Data Strategy guide](national-data-strategy.md) and the [Data Quality Framework guide](data-quality-framework.md) for full mappings.
