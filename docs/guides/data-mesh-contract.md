# Data mesh and data contracts: a data product contract guide

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

Data mesh is a way of organising analytical data around business domains, with each domain publishing its data as a product under a data contract. This guide explains data mesh, data products and data contracts, and how `/arckit:data-mesh-contract` writes a contract.

---

## What is data mesh?

Zhamak Dehghani described data mesh in [How to Move Beyond a Monolithic Data Lake to a Distributed Data Mesh](https://martinfowler.com/articles/data-monolith-to-mesh.html) (May 2019) and set out its principles in [Data Mesh Principles and Logical Architecture](https://martinfowler.com/articles/data-mesh-principles.html) (December 2020). It is about analytical data. The operational data that services run on is outside its focus.

The four principles:

| Principle | What it means |
|-----------|---------------|
| Domain-oriented decentralised data ownership and architecture | The business domains closest to the data own it and serve it |
| Data as a product | Domains treat the people who use their analytical data as customers |
| Self-serve data infrastructure as a platform | A shared platform lets domains build and run their own data products |
| Federated computational governance | Domain and platform owners agree global rules together, and the platform enforces them automatically |

## What is a data product?

A data product is the unit a domain publishes on the mesh. The 2020 article says it combines three structural components: code, data and metadata, and infrastructure.

The 2019 article lists what domain data needs to be useful as a product:

- Discoverable
- Addressable
- Trustworthy and truthful
- Self-describing semantics and syntax
- Interoperable and governed by global standards
- Secure and governed by a global access control

## What is a data contract?

A data contract is the formal agreement between the domain team that provides a data product and the people who consume it. The [Open Data Contract Standard (ODCS)](https://bitol.io/) defines it as "an agreement between a data producer and its consumers". As well as describing the data, a contract states how the data should behave, through data quality rules, and covers service levels, stakeholders, roles and pricing.

ODCS is an open YAML format from Bitol, a Linux Foundation AI & Data incubation project, released under the Apache 2.0 licence. Its [documentation](https://bitol-io.github.io/open-data-contract-standard/latest/) divides a contract into sections that include fundamentals, schema, data quality, support and communication channels, pricing, team, roles, service-level agreement, and infrastructure and servers. The [ODCS repository](https://github.com/bitol-io/open-data-contract-standard) gives v3.2.0 as the current version.

ArcKit's contract template follows ODCS v3.2.0 and includes an ODCS YAML export (Appendix A), written to validate against the [ODCS v3.2.0 JSON Schema](https://github.com/bitol-io/open-data-contract-standard/blob/main/schema/odcs-json-schema-v3.2.0.json). Unlike a traditional data model, a mesh contract treats the data like an API, with an owner, service levels, versioning and support.

---

## Using /arckit:data-mesh-contract

### Inputs checklist

| Artefact | Purpose |
|----------|---------|
| `ARC-<id>-DATA-v1.0.md` with entity definitions | Provides schema source of truth |
| `ARC-<id>-REQ-v1.0.md` with DR-xxx entries | Defines data quality requirements and SLAs |
| `ARC-<id>-STKE-v1.0.md` | Identifies domain owners and data consumers |
| Architecture principles | Ensures mesh alignment with governance standards |

### Command

```bash
/arckit:data-mesh-contract Create contract for <domain name> data product
```

Output: `projects/<id>/data-contracts/ARC-<id>-DMC-<NNN>-v1.0.md` (multi-instance numbering: `DMC-001`, `DMC-002`, and so on)

### Deliverable snapshot

| Section | Highlights | Next Action |
|---------|------------|-------------|
| Product metadata | Domain, owner, mesh plane alignment | Assign product owner and steward |
| Schema & versioning | Contracted fields, breaking change policy | Sync with `ARC-<id>-DATA-v1.0.md` for consistency |
| SLAs | Freshness, availability, quality KPIs | Define monitoring thresholds in observability platform |
| Access methods | APIs, query endpoints, data feeds | Document authentication and rate limits |
| Data quality | Validation rules, testing requirements | Implement automated quality checks |
| Governance & policy | GDPR compliance, access controls, audit hooks | Review with DPO; integrate with governance platform |
| Consumer obligations | Usage constraints, attribution, support SLA | Publish in data catalogue for discovery |
| Change management | Versioning, deprecation, approval workflow | Establish governance board review cadence |

---

## UK Government Context

### Technology Code of Practice Alignment

| TCoP Point | Mesh Contract Application |
|------------|---------------------------|
| **8. Share, reuse and collaborate** | Federated data products replace siloed databases |
| **6. Make things secure** | Access policies and encryption enforced at contract level |
| **7. Make privacy integral** | PII classification, consent management, and data subject rights |
| **10. Make better use of data** | Published contracts make data products findable and reusable |
| **11. Define your purchasing strategy** | Reuse existing mesh products before building new ones |

### Data Quality Framework

The [Government Data Quality Framework](https://www.gov.uk/government/publications/the-government-data-quality-framework) defines six core data quality dimensions. Mesh contracts cover each one:

1. **Accuracy** – Validation rules and quality KPIs in contract
2. **Validity** – Schema constraints and allowed values
3. **Completeness** – Mandatory field requirements and null handling
4. **Consistency** – Cross-system reconciliation rules
5. **Timeliness** – Freshness SLAs and update frequency
6. **Uniqueness** – Duplicate detection rules

### National Data Strategy (NDS)

The [National Data Strategy](https://www.gov.uk/government/publications/uk-national-data-strategy) (DCMS, 2020) rests on four core pillars. Contracts support each:

| NDS pillar | Mesh contract application |
|------------|---------------------------|
| Data foundations | Schema, metadata and quality rules keep data fit for purpose and findable |
| Data skills | Domain teams own, run and support their own data products |
| Data availability | Catalogue registration and self-serve access let others find and reuse the data |
| Responsible data | Access policies, privacy controls and audit hooks |

---

## Mesh Architecture Principles

### Domain-Driven Design

- Each contract represents **one domain's data product**
- Domain teams own product lifecycle (schema, SLA, support)
- Cross-domain data sharing via published contracts

### Data Product Characteristics

- **Discoverable** – Registered in data catalogue with metadata
- **Addressable** – Unique endpoint or data lake path
- **Understandable** – Schema, semantics, and lineage documented
- **Trustworthy** – SLAs, quality metrics, and governance
- **Secure** – Access policies and encryption standards
- **Interoperable** – Standard formats and protocols

### Federated Computational Governance

- **Automated policy enforcement** – Not manual review
- **Global standards** – Applied locally by domain teams
- **Observable compliance** – Auditable governance hooks

---

## Integration with ArcKit Workflow

### Prerequisites (Run These First)

1. `/arckit:principles` – Establish architecture principles including mesh standards
2. `/arckit:stakeholders` – Identify domain owners and consumers
3. `/arckit:data-model` – Define entities that become data products
4. `/arckit:requirements` – Capture DR-xxx data requirements including quality/SLAs

### Mesh Contract Generation

5. `/arckit:data-mesh-contract` – Create contract per domain data product

### Follow-Up Commands

6. `/arckit:traceability` – Link contracts to requirements and consumers
7. `/arckit:analyze` – Score contract completeness and governance quality
8. `/arckit:dpia` – If contract involves PII (auto-references contract)

---

## Compliance Focus

### GDPR / UK GDPR

- **PII inventory** – List all personal data fields in contract
- **Legal basis** – Document lawful basis for processing
- **Data subject rights** – Mechanism for access, rectification, erasure
- **Cross-border transfers** – If data leaves UK, document adequacy decisions
- **Retention** – Contract specifies deletion policy

### Security Standards

- **Encryption** – At-rest and in-transit standards
- **Access control** – Role-based or attribute-based policies
- **Audit logging** – Who accessed what data when
- **Threat model** – Known risks and mitigations

---

## Contract Lifecycle

### 1. Design Phase

- Domain team drafts contract using template
- References source `ARC-<id>-DATA-v1.0.md` for schema
- Defines SLAs based on consumer requirements
- Documents governance policies

### 2. Review Phase

- Architecture review against mesh principles
- DPO review for privacy compliance
- Security review for access controls
- Governance board approval (if required)

### 3. Publishing Phase

- Register contract in data catalogue
- Provision infrastructure (APIs, storage, monitoring)
- Document consumer onboarding process

### 4. Operations Phase

- Monitor SLA adherence (freshness, availability, quality)
- Track usage metrics and consumer feedback
- Respond to support requests per contract SLA

### 5. Change Management

- Propose schema changes with impact analysis
- Versioning strategy (semantic versioning recommended)
- Deprecation notice period (e.g., 90 days)
- Consumer migration support

---

## Review Tips

- **One contract per domain data product** – Don't bundle unrelated datasets
- **Start with high-value products** – Focus on data with multiple consumers
- **Automate quality checks** – Contract is meaningless without observability
- **Version early** – Use semantic versioning from day one (v1.0.0)
- **Consumer feedback loop** – Review SLAs quarterly based on actual usage
- **Federated ownership** – Domain team owns contract, not central data team

---

## Common Pitfalls

| Pitfall | Do this instead |
|---------|-----------------|
| **Treating contracts as documentation** – They must be enforceable via automation | **Integrate with governance platform** – Use contracts to drive policy engines |
| **Overly rigid schemas** – Allow for evolution with backward compatibility | **Semantic versioning** – Breaking changes increment major version |
| **Vague SLAs** – "High quality" is not measurable | **Specific KPIs** – "99.5% availability, <5min freshness, >95% completeness" |
| **Centralised approval** – Defeats federated mesh model | **Guardrails + autonomy** – Global policies, local implementation |
| **No consumer onboarding** – Great product, no users | **Self-serve discovery** – Catalogue, examples, sandbox environment |

---

## Related Commands

- `/arckit:data-model` – Define entities before creating contracts
- `/arckit:requirements` – Capture DR-xxx requirements that drive SLAs
- `/arckit:traceability` – Link contracts to requirements and consumers
- `/arckit:analyze` – Score contract completeness
- `/arckit:dpia` – Privacy impact assessment for PII-containing products

---

## References

- [Data Mesh Principles and Logical Architecture](https://martinfowler.com/articles/data-mesh-principles.html) (Zhamak Dehghani, martinfowler.com, 2020)
- [How to Move Beyond a Monolithic Data Lake to a Distributed Data Mesh](https://martinfowler.com/articles/data-monolith-to-mesh.html) (Zhamak Dehghani, martinfowler.com, 2019)
- **Data Mesh book (Zhamak Dehghani)**: O'Reilly 2022
- [Open Data Contract Standard (ODCS)](https://github.com/bitol-io/open-data-contract-standard) and [Bitol](https://bitol.io/)
- [PayPal Data Contract Template](https://github.com/paypal/data-contract-template)
- [UK Government Data Quality Framework](https://www.gov.uk/government/publications/the-government-data-quality-framework)
- [National Data Strategy](https://www.gov.uk/government/publications/uk-national-data-strategy)
- [Open standards for government](https://www.gov.uk/government/publications/open-standards-for-government)
