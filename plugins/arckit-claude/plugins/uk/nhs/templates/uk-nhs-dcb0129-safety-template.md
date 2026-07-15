# Clinical Safety — [PRODUCT_NAME]

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit:uk-nhs-dcb0129` | **Filename**: `SAFETY.md` (DCB0129 manufacturer anchor)

## Document Control

| Field | Value |
|---|---|
| **Document ID** | `SAFETY.md` (Marcus Baw SAFETY.md spec convention; no ARC- prefix) |
| **Document Type** | Clinical Safety Anchor (DCB0129 manufacturer) |
| **Project** | [PROJECT_NAME] (Project [PROJECT_ID]) |
| **Classification** | [PUBLIC / OFFICIAL / OFFICIAL-SENSITIVE] |
| **Status** | DRAFT |
| **Version** | [VERSION] |
| **Created Date** | [YYYY-MM-DD] |
| **Last Modified** | [YYYY-MM-DD] |
| **Review Cycle** | Quarterly (recommended for active products) |
| **Next Review Date** | [YYYY-MM-DD] |
| **Owner** | [OWNER_NAME_AND_ROLE] |
| **Reviewed By** | [PENDING] |
| **Approved By** | [PENDING] |
| **Distribution** | [DISTRIBUTION_LIST] |

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---|---|---|---|---|---|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit:uk-nhs-dcb0129` command | PENDING | PENDING |

---

## Required SAFETY.md fields (Marcus Baw SAFETY.md spec v2.0.0)

| Field | Value |
|---|---|
| `product-name` | [PRODUCT_NAME] |
| `version` | [PRODUCT_VERSION] |
| `standard` | DCB0129 |
| `clinical-safety-officer` | [PENDING — CSO name and GMC/NMC/HCPC/GPhC registration number] |
| `organisation` | [MANUFACTURER_LEGAL_ENTITY] |
| `safety-case-status` | draft |
| `hazard-log-url` | [./HAZARD-LOG.md](./HAZARD-LOG.md) |
| `last-reviewed` | [YYYY-MM-DD] |

---

## Summary

[One to two paragraphs: what the product does, intended clinical context, scope of the safety claim, summary of safety approach. Plain English — this is the front door to the safety case for anyone reviewing the product (procurement, CSO, MHRA, NHS England, patients).]

---

## Documents

- [Clinical Safety Case Report](./SAFETY-CASE.md) — the substantive safety argument
- [Hazard Log](./HAZARD-LOG.md) — the YAML-frontmatter hazard register with rendered table
- [Clinical Risk Management Plan](./SAFETY-PLAN.md) — *(optional, Tier 3 / SaMD products only — generate manually if needed)*

---

## Applicable standards and assurance domains

Clinical safety evidence sits alongside wider information-standard evidence. Under the Data (Use and Access) Act 2025 (amending the Health and Social Care Act 2012 Part 9 information-standards framework), standards can reach IT, software, interoperability, portability, information access, and security. This register records which domains apply, where the evidence lives, and who owns it. The Clinical Safety Officer owns the clinical-safety row and cross-references the others where a failure in that domain could cause patient harm; the CSO does not own every domain below.

| Domain | Standard / framework | Applies? | Evidence location | Owner |
|---|---|---|---|---|
| Clinical risk management (manufacture) | DCB0129 | [YES] | `SAFETY-CASE.md` | Manufacturer CSO |
| Clinical risk management (deployment/use) | DCB0160 | [YES/NO/TBD] | Deployment safety case | Deployer CSO |
| Health/care information standards | HSC Act 2012 Part 9 as amended (DUAA 2025) | [TBD] | Evidence pack | Responsible owner |
| Interoperability / connectivity | [e.g. FHIR UK Core, NHS Number, SNOMED CT] | [TBD] | [TBD] | Technical owner |
| Data protection / secondary use | UK GDPR / DPA 2018 / DUAA 2025 context | [TBD] | DPIA / IG evidence | IG lead |
| Information security | [e.g. DSPT, NCSC CAF, Cyber Essentials] | [TBD] | [TBD] | Security owner |
| Portability / storage / access | [TBD] | [TBD] | [TBD] | [TBD] |

---

## Roles and responsibilities

The Data (Use and Access) Act 2025 "relevant IT provider" concept can bring suppliers, operators, and maintainers into the information-standards compliance picture, not only the deploying organisation. Record who holds each role so that clinical-risk ownership across the lifecycle is unambiguous.

| Role | Applies? | Organisation / person | Evidence |
|---|---|---|---|
| Manufacturer / supplier | [YES/NO] | [ORGANISATION] | `SAFETY-CASE.md` |
| Deployer / health organisation | [YES/NO] | [ORGANISATION] | Deployment safety case |
| Operator | [YES/NO] | [ORGANISATION] | [TBD] |
| Maintainer | [YES/NO] | [ORGANISATION] | [TBD] |
| Relevant IT provider (DUAA 2025) | [YES/NO] | [ORGANISATION] | Evidence pack |

---

## Tier

This product is assessed as Marcus Baw SAFETY.md **Tier 2** by default (3-file set). Adjust to Tier 1 (consolidate into this single file) for low-risk reference or information-only tools where the CSO judges a separate case + hazard log to be disproportionate. Adjust to Tier 3 (add `SAFETY-PLAN.md`) for SaMD products and any product where the manufacturer needs to evidence a separate Clinical Risk Management Plan to MHRA or a Notified Body.

---

## Important

This document is **not** clinical, legal, or regulatory advice. It is a generated starting point that MUST be reviewed, materially supplemented, and signed off by a qualified Clinical Safety Officer (CSO) holding current GMC / NMC / HCPC / GPhC registration before the product is placed into clinical use.

---

**Generated by**: ArcKit `/arckit:uk-nhs-dcb0129` command
**Generated on**: [YYYY-MM-DD]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
**Spec lineage**: [Marcus Baw SAFETY.md v2.0.0-draft](https://github.com/pacharanero/SAFETY.md)
