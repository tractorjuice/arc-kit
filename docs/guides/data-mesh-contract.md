# Data Mesh Contract Quick Guide

`/arckit.data-mesh-contract` creates federated data product contracts for mesh architectures with SLAs, governance, and interoperability guarantees.

---

## Inputs Checklist

| Artefact | Purpose |
|----------|---------|
| `ARC-<id>-DATA-v1.0.md` with entity definitions | Provides schema source of truth |
| `ARC-<id>-REQ-v1.0.md` with DR-xxx entries | Defines data quality requirements and SLAs |
| `ARC-<id>-STKE-v1.0.md` | Identifies domain owners and data consumers |
| Architecture principles | Ensures mesh alignment with governance standards |

---

## Command

```bash
/arckit.data-mesh-contract Create contract for <domain name> data product
```

Output: `projects/<id>/ARC-<id>-DMC-001-v1.0.md` (uses multi-instance numbering)

---

## What is a Data Mesh Contract?

A **data product contract** defines the formal agreement between a data product provider (domain team) and consumers in a federated mesh architecture.

Unlike traditional data models, mesh contracts emphasize:
- **Federated ownership** – Domain teams own their data products end-to-end
- **Data as a product** – Treated like APIs with SLAs, versioning, and support
- **Self-serve infrastructure** – Standardized access patterns and discovery
- **Computational governance** – Automated policy enforcement

---

## Deliverable Snapshot

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
| **11. Define your purchasing strategy** | Reuse existing mesh products before building new ones |

### Data Quality Framework

Mesh contracts support the **Government Data Quality Framework** five dimensions:
1. **Accuracy** – Validation rules and quality KPIs in contract
2. **Validity** – Schema constraints and allowed values
3. **Completeness** – Mandatory field requirements and null handling
4. **Consistency** – Cross-system reconciliation rules
5. **Timeliness** – Freshness SLAs and update frequency

### National Data Strategy (NDS)

Contracts align with NDS pillars:
- **Pillar 1 (Unlocking value)** – Discoverability and self-serve access
- **Pillar 2 (Secure and resilient infrastructure)** – Security controls in contract
- **Pillar 3 (Transforming capability)** – Federated domain expertise
- **Pillar 4 (Ensuring responsible use)** – Governance and ethics policies

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

1. `/arckit.principles` – Establish architecture principles including mesh standards
2. `/arckit.stakeholders` – Identify domain owners and consumers
3. `/arckit.data-model` – Define entities that become data products
4. `/arckit.requirements` – Capture DR-xxx data requirements including quality/SLAs

### Mesh Contract Generation

5. `/arckit.data-mesh-contract` – Create contract per domain data product

### Follow-Up Commands

6. `/arckit.traceability` – Link contracts to requirements and consumers
7. `/arckit.analyze` – Score contract completeness and governance quality
8. `/arckit.dpia` – If contract involves PII (auto-references contract)

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

❌ **Treating contracts as documentation** – They must be enforceable via automation
✅ **Integrate with governance platform** – Use contracts to drive policy engines

❌ **Overly rigid schemas** – Allow for evolution with backward compatibility
✅ **Semantic versioning** – Breaking changes increment major version

❌ **Vague SLAs** – "High quality" is not measurable
✅ **Specific KPIs** – "99.5% availability, <5min freshness, >95% completeness"

❌ **Centralized approval** – Defeats federated mesh model
✅ **Guardrails + autonomy** – Global policies, local implementation

❌ **No consumer onboarding** – Great product, no users
✅ **Self-serve discovery** – Catalogue, examples, sandbox environment

---

## Related Commands

- `/arckit.data-model` – Define entities before creating contracts
- `/arckit.requirements` – Capture DR-xxx requirements that drive SLAs
- `/arckit.traceability` – Link contracts to requirements and consumers
- `/arckit.analyze` – Score contract completeness
- `/arckit.dpia` – Privacy impact assessment for PII-containing products

---

## References

- **PayPal Data Contract Template**: https://github.com/paypal/data-contract-template
- **Open Data Contract Standard (ODCS)**: https://github.com/bitol-io/open-data-contract-standard
- **Data Mesh book (Zhamak Dehghani)**: O'Reilly 2022
- **UK Government Data Quality Framework**: https://www.gov.uk/government/publications/the-government-data-quality-framework
- **National Data Strategy**: https://www.gov.uk/government/publications/uk-national-data-strategy
- **GovS 005: Data Standards**: https://www.gov.uk/government/publications/open-standards-for-government
