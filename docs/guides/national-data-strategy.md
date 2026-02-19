# UK National Data Strategy — ArcKit Reference Guide

This guide maps the [UK National Data Strategy](https://www.gov.uk/government/publications/uk-national-data-strategy/national-data-strategy) (NDS) to ArcKit commands and artefacts. The NDS sets the government's vision for how data should be used, managed, and governed across the economy and public services.

---

## Five Missions

| # | Mission | Description | ArcKit Commands |
|---|---------|-------------|-----------------|
| 1 | **Unlocking data value** | Use data to grow the economy, improve efficiency, and drive innovation | `/arckit:data-model`, `/arckit:data-mesh-contract`, `/arckit:backlog` |
| 2 | **Pro-growth, trusted data regime** | Regulation and standards that enable data use while maintaining trust | `/arckit:dpia`, `/arckit:principles`, `/arckit:tcop` |
| 3 | **Transforming government use of data** | Better data use for improved public services and decision-making | `/arckit:data-model`, `/arckit:strategy`, `/arckit:plan` |
| 4 | **Secure, resilient data infrastructure** | Infrastructure that keeps data safe and available | `/arckit:secure`, `/arckit:hld-review`, `/arckit:operationalize` |
| 5 | **International data flows** | Champion free and trusted data flows across borders | `/arckit:dpia` (cross-border transfer), `/arckit:data-mesh-contract` |

---

## Four Pillars

| Pillar | Focus | ArcKit Evidence |
|--------|-------|-----------------|
| **Data Foundations** | Standards, metadata, interoperability, quality | `/arckit:data-model` (Data Quality Framework, entity catalogue, metadata standards) |
| **Skills** | Data literacy, analytical capability across the workforce | `/arckit:stakeholders` (data governance roles), `/arckit:operationalize` (training) |
| **Availability** | Findability, access, sharing, open data | `/arckit:data-mesh-contract` (data product contracts, SLAs), `/arckit:data-model` (CRUD matrix) |
| **Responsibility** | Ethics, governance, public trust, accountability | `/arckit:dpia` (privacy impact), `/arckit:principles` (data governance principles), `/arckit:risk` |

---

## Mission-to-Artefact Crosswalk

This table shows which ArcKit artefacts provide evidence for each NDS mission during assurance reviews.

| NDS Mission | Artefact | What It Evidences |
|-------------|----------|-------------------|
| Mission 1 (Value) | Data Model (`ARC-*-DATA`) | Structured data assets, quality metrics, governance roles |
| Mission 1 (Value) | Data Mesh Contract (`ARC-*-DMC`) | Federated data products with SLAs and quality guarantees |
| Mission 2 (Trust) | DPIA (`ARC-*-DPIA`) | Lawful basis, privacy risks, data subject rights |
| Mission 2 (Trust) | Architecture Principles (`ARC-000-PRIN`) | Data governance and ethical data use principles |
| Mission 3 (Government) | Strategy (`ARC-*-STGY`) | Data strategy aligned to organisational objectives |
| Mission 3 (Government) | Plan (`ARC-*-PLAN`) | Milestones for data capability improvements |
| Mission 4 (Security) | Secure Assessment (`ARC-*-SECD`) | CAF assessment, data protection controls (S3, B3) |
| Mission 5 (International) | DPIA (`ARC-*-DPIA`) | Cross-border data transfer safeguards |

---

## NDS Pillar Checklist

Use this checklist when reviewing ArcKit artefacts for NDS alignment.

### Data Foundations
- [ ] Data standards defined (naming, formats, reference data)
- [ ] Metadata captured for all entities (data dictionary/catalogue)
- [ ] Interoperability requirements documented (APIs, open standards)
- [ ] Data quality dimensions defined with measurable targets
- [ ] Data quality monitoring and remediation process in place

### Skills
- [ ] Data ownership roles assigned (Owner, Steward, Custodian)
- [ ] Data literacy requirements identified for key stakeholders
- [ ] Training plan for data governance processes

### Availability
- [ ] Data access controls defined (CRUD matrix)
- [ ] Data sharing agreements documented (internal/external)
- [ ] Data products defined with SLAs (if data mesh architecture)
- [ ] Open data obligations assessed

### Responsibility
- [ ] DPIA completed for personal data processing
- [ ] Data ethics considerations documented
- [ ] Data governance accountability clear (RACI)
- [ ] Public trust and transparency measures in place
- [ ] Data retention and disposal policies defined

---

## National Data Library

The [National Data Library](https://www.gov.uk/government/publications/national-data-library-progress-update-january-2026/national-data-library-progress-update-january-2026) (backed by DSIT investment) aims to make key government datasets discoverable and AI-ready. Projects building government data platforms should consider:

- **AI Readiness**: Are datasets structured for machine learning consumption?
- **Discoverability**: Are data products catalogued with standard metadata?
- **Interoperability**: Do data contracts use open standards for cross-department sharing?

These considerations are captured in `/arckit:data-model` (metadata, quality) and `/arckit:data-mesh-contract` (data products, SLAs).

---

## Relationship to Other Standards

| Standard | Relationship to NDS |
|----------|---------------------|
| **Data Quality Framework** | Operational tool for NDS Data Foundations pillar |
| **GovS 005: Digital** | Sibling policy — digital delivery standards (TCoP, Service Standard) |
| **GovS 010: Analysis** | Data quality and analytical standards supporting NDS Missions 1 and 3 |
| **UK GDPR / Data Protection Act** | Legal framework underpinning NDS Responsibility pillar |
| **Technology Code of Practice** | Point 8 (Share, reuse, collaborate) directly supports NDS Availability |
| **AI Playbook** | AI-readiness requirements build on NDS Data Foundations |

---

## References

- [UK National Data Strategy](https://www.gov.uk/government/publications/uk-national-data-strategy/national-data-strategy)
- [NDS Monitoring & Evaluation Framework](https://www.gov.uk/government/publications/national-data-strategy-monitoring-and-evaluation-update/national-data-strategy-monitoring-and-evaluation-framework)
- [National Data Library Progress Update (January 2026)](https://www.gov.uk/government/publications/national-data-library-progress-update-january-2026/national-data-library-progress-update-january-2026)
- [Government Data Quality Framework](https://www.gov.uk/government/publications/the-government-data-quality-framework)
- [GDS Data Standards](https://www.gov.uk/government/collections/data-standards-for-government)
