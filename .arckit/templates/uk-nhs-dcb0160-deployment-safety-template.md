# Deployment Clinical Safety — [PRODUCT_NAME] at [DEPLOYING_ORGANISATION]

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit:uk-nhs-dcb0160` | **Filename**: `SAFETY.md` (DCB0160 deployer anchor)

## Document Control

| Field | Value |
|---|---|
| **Document ID** | `SAFETY.md` (deployment) — Marcus Baw SAFETY.md spec convention; no ARC- prefix |
| **Document Type** | Clinical Safety Anchor (DCB0160 deployer) |
| **Project** | [PROJECT_NAME] (Project [PROJECT_ID]) |
| **Classification** | [OFFICIAL / OFFICIAL-SENSITIVE] |
| **Status** | DRAFT |
| **Version** | [VERSION] |
| **Created Date** | [YYYY-MM-DD] |
| **Last Modified** | [YYYY-MM-DD] |
| **Review Cycle** | Quarterly (or on any material deployment change) |
| **Next Review Date** | [YYYY-MM-DD] |
| **Owner** | [DEPLOYING_ORGANISATION_PROJECT_OWNER] |
| **Reviewed By** | [PENDING — deploying-organisation CSO] |
| **Approved By** | [PENDING — deploying-organisation CSO] |
| **Distribution** | [DISTRIBUTION_LIST] |

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---|---|---|---|---|---|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit:uk-nhs-dcb0160` command | PENDING | PENDING |

---

## Required SAFETY.md fields (Marcus Baw SAFETY.md spec v2.0.0, deployer adaptation)

| Field | Value |
|---|---|
| `product-name` | [PRODUCT_NAME] |
| `product-version` | [PRODUCT_VERSION_BEING_DEPLOYED] |
| `standard` | DCB0160 |
| `deployment-organisation` | [DEPLOYING_NHS_ORGANISATION] |
| `clinical-safety-officer` | [PENDING — deploying-organisation CSO name and GMC/NMC/HCPC/GPhC registration] |
| `manufacturer-case-url` | [../SAFETY-CASE.md](../SAFETY-CASE.md) *(or external URL if third-party product)* |
| `hazard-log-url` | [./DEPLOYMENT-HAZARD-LOG.md](./DEPLOYMENT-HAZARD-LOG.md) |
| `safety-case-status` | draft |
| `last-reviewed` | [YYYY-MM-DD] |

---

## Summary

[One to two paragraphs: deployment context (which clinical service, which sites, which patient population), the deploying NHS organisation, summary of deployment-specific safety arrangements (training, fallback, integration, business continuity), phasing if applicable (pilot / staged rollout / decommission of legacy).]

---

## Documents

- [Deployment Clinical Safety Case Report](./DEPLOYMENT-SAFETY-CASE.md) — substantive deployer safety argument
- [Deployment Hazard Log](./DEPLOYMENT-HAZARD-LOG.md) — deployment-specific hazards (YAML frontmatter + rendered table)
- [Manufacturer SAFETY-CASE.md](../SAFETY-CASE.md) — upstream manufacturer DCB0129 case *(if same repo)*

---

## Applicable standards and assurance domains

Clinical safety evidence sits alongside wider information-standard evidence. Under the Data (Use and Access) Act 2025 (amending the Health and Social Care Act 2012 Part 9 information-standards framework), standards can reach IT, software, interoperability, portability, information access, and security. This register records which domains apply, where the evidence lives, and who owns it. The Clinical Safety Officer owns the clinical-safety row and cross-references the others where a failure in that domain could cause patient harm; the CSO does not own every domain below.

| Domain | Standard / framework | Applies? | Evidence location | Owner |
|---|---|---|---|---|
| Clinical risk management (manufacture) | DCB0129 | [YES/NO] | received from manufacturer (see `../SAFETY-CASE.md`) | Manufacturer CSO |
| Clinical risk management (deployment/use) | DCB0160 | [YES] | this deployment safety case | Deployer CSO |
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
| Deployer / health organisation | [YES] | [ORGANISATION] | Deployment safety case |
| Operator | [YES/NO] | [ORGANISATION] | [TBD] |
| Maintainer | [YES/NO] | [ORGANISATION] | [TBD] |
| Relevant IT provider (DUAA 2025) | [YES/NO] | [ORGANISATION] | Evidence pack |

---

## Relationship to manufacturer case

The deploying organisation has reviewed the manufacturer's DCB0129 Clinical Safety Case Report and accepted its residual risks **in the context of this specific deployment**. Deployment-specific hazards (training inadequacy, workflow integration, business continuity, local configuration) are documented in this case and are **not** covered by the manufacturer case.

If material residual risks from the manufacturer case are *not* acceptable to the deploying organisation in its local context, the deployment is **not safe to proceed** until those risks are addressed — typically by additional local controls, by configuration changes, or by requesting product changes from the manufacturer.

---

## Important

This document is **not** clinical, legal, or regulatory advice. It is a generated starting point that MUST be reviewed, materially supplemented, and signed off by the **deploying organisation's** Clinical Safety Officer (NOT the manufacturer's CSO) before the product is deployed into clinical use at this organisation.

---

**Generated by**: ArcKit `/arckit:uk-nhs-dcb0160` command
**Generated on**: [YYYY-MM-DD]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
**Spec lineage**: [Marcus Baw SAFETY.md v2.0.0-draft](https://github.com/pacharanero/SAFETY.md)
