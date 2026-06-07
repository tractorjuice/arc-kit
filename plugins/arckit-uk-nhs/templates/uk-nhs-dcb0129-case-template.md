# Clinical Safety Case Report — [PRODUCT_NAME]

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit:uk-nhs-dcb0129` | **Filename**: `SAFETY-CASE.md` (DCB0129 manufacturer case)

## Document Control

| Field | Value |
|---|---|
| **Document ID** | `SAFETY-CASE.md` (Marcus Baw SAFETY.md spec convention; no ARC- prefix) |
| **Document Type** | Clinical Safety Case Report (DCB0129 manufacturer) |
| **Project** | [PROJECT_NAME] (Project [PROJECT_ID]) |
| **Classification** | [OFFICIAL / OFFICIAL-SENSITIVE] |
| **Status** | DRAFT |
| **Version** | [VERSION] |
| **Created Date** | [YYYY-MM-DD] |
| **Last Modified** | [YYYY-MM-DD] |
| **Review Cycle** | Quarterly (recommended); on every material product change |
| **Next Review Date** | [YYYY-MM-DD] |
| **Owner** | [PRODUCT_OWNER_NAME_AND_ROLE] |
| **Reviewed By** | [PENDING — CSO] |
| **Approved By** | [PENDING — CSO sign-off in §6 below] |
| **Distribution** | [DISTRIBUTION_LIST] |

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---|---|---|---|---|---|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit:uk-nhs-dcb0129` command | PENDING | PENDING |

---

## Risk scoring scales (DCB0129 convention)

| Scale | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| **Severity** | Catastrophic | Major | Considerable | Significant | Minor |
| **Likelihood** | Very High | High | Medium | Low | Very Low |

**Risk levels**: `unacceptable` · `high` · `medium` · `low`
**Hazard status**: `open` · `mitigated` · `accepted` · `closed`

> ⚠️ DCB0129 inverts the usual Orange Book convention where 5 = highest. Read carefully when cross-referencing project risk registers.

---

## 1. Intended Use

[State the product's clinical purpose, indications, contraindications, intended user population (specific clinical roles, patient populations), and intended clinical context. Be precise — the intended-use statement is load-bearing for medical-device classification (`/arckit:uk-mdr-classification`) and for clinical-safety scope.]

### What this product is

[Describe the product in plain English. One paragraph.]

### What this product is not

[Explicit out-of-scope statements. Lists what this product does *not* do, *not* claim, and is *not* intended for. Pre-empts misuse claims.]

### Intended users

[Specific clinical roles — e.g. "registered medical practitioners in NHS secondary care", "registered children's nurses in NHS paediatric inpatient settings". Avoid "any clinician".]

### Intended patient population

[Specific patient population — age range, condition, care setting.]

### Intended clinical context

[Specific clinical setting — inpatient / outpatient / community / home; acute / chronic / preventive; emergency / planned.]

---

## 2. Scope

### In scope for this safety case

[What clinical activities and product features are covered by this safety case.]

### Out of scope for this safety case

[What is explicitly NOT covered. Often includes: deployment-specific arrangements (covered by DCB0160), third-party integrations not maintained by the manufacturer, off-label clinical uses.]

### Deployment assumptions

[What the manufacturer assumes about the deployment environment. These assumptions become the obligations on the deploying organisation's DCB0160 case.]

---

## 3. Safety Argument

Top-level claim:

> **G1: [PRODUCT_NAME] is acceptably safe for use by [intended users] in [intended clinical context] when used as intended.**

This claim is supported by the sub-claims below. Each sub-claim references hazards (H-ID) from the [Hazard Log](./HAZARD-LOG.md) and the controls (C-ID) that mitigate them.

### G1.1 — Clinical hazards are systematically identified and managed

Evidence:

- Hazard identification workshops with clinical SMEs ([list dates / participants])
- Hazard Log [HAZARD-LOG.md](./HAZARD-LOG.md) maintained as a living document
- Cross-referenced with the project risk register and DPIA where overlap exists

### G1.2 — Identified hazards are reduced to acceptable residual risk

Evidence:

- Each hazard in the Hazard Log has documented controls (C-IDs)
- Residual-risk severity × likelihood reassessed after controls
- Residual `unacceptable` and `high` risks have explicit CSO acceptance with justification

### G1.3 — Clinical decisions made by users of the product are based on accurate, current, and relevant data

Evidence:

- [Identity-matching controls — reference H-IDs]
- [Data-currency controls — reference H-IDs]
- [Source-of-truth controls — reference H-IDs]

### G1.4 — The product fails safely

Evidence:

- [Graceful-degradation behaviour — reference H-IDs]
- [Fallback to safe states under failure — reference H-IDs]
- [Notification of failure to clinicians — reference H-IDs]

### G1.5 — Misuse is mitigated by design

Evidence:

- [Usability engineering evidence per IEC 62366-1 if applicable]
- [Authorisation / role-based access design]
- [In-context warnings and decision support]

### G1.6 — Clinical workflow integration is safe

Evidence:

- [Workflow analysis with clinical SMEs]
- [Integration test evidence]
- [Training-and-deployment guidance to deploying organisations]

[Add or remove G-sub-claims to reflect the actual product. Each should reference real H-IDs in the Hazard Log.]

---

## 4. Evidence

### Testing strategy

[Summary of the testing approach: unit / integration / system / clinical-acceptance. Reference the V&V plan if one exists.]

### Clinical validation

[Clinical evaluation evidence: literature review, retrospective evaluation, prospective study, clinical investigation. State the level of evidence available.]

### Usability evidence (IEC 62366-1 alignment, if applicable)

[Formative and summative usability evaluation evidence.]

### Real-world performance monitoring

[Post-deployment monitoring plan — what metrics, what cadence, what triggers a hazard log update.]

---

## 5. Residual Risk

### Accepted residual risks

| H-ID | Residual Severity | Residual Likelihood | Residual Risk | Justification for acceptance |
|---|---|---|---|---|
| H001 | [N] | [N] | [low / medium / high] | [Why this residual risk is acceptable given clinical benefit] |
| ... |  |  |  |  |

[Each accepted residual risk above `low` requires explicit CSO sign-off with justification proportionate to the residual severity.]

### Overall residual risk position

[CSO's overall judgment that the product, with controls in place, is acceptably safe for its intended use. One paragraph.]

---

## 6. CSO Sign-off

| Field | Value |
|---|---|
| **CSO Name** | [PENDING] |
| **Registration** | [GMC / NMC / HCPC / GPhC number — PENDING] |
| **Date** | [PENDING] |
| **Statement** | I have reviewed this Clinical Safety Case Report and the associated Hazard Log. I am satisfied that the clinical hazards have been systematically identified and that residual risks are at an acceptable level given the intended clinical benefit of the product. I approve this safety case. **— [PENDING]** |
| **Signature** | [PENDING] |

---

## External References

| Doc ID | Title | Source | Used in |
|---|---|---|---|
| DCB0129 | Clinical Risk Management: its Application in the Manufacture of Health IT Systems | NHS England | This document, throughout |
| SAFETY-MD-SPEC | SAFETY.md spec v2.0.0-draft | Marcus Baw / pacharanero | Document structure, hazard-log YAML format |
| ISO-14971 | Application of risk management to medical devices | BSI | §1, §3, §5 (cross-referenced with `uk-mdr-classification` if applicable) |
| IEC-62304 | Medical-device software lifecycle processes | BSI | §1, §4 (cross-referenced with `uk-mdr-classification` if applicable) |
| IEC-62366-1 | Application of usability engineering to medical devices | BSI | §3 G1.5, §4 |

---

**Generated by**: ArcKit `/arckit:uk-nhs-dcb0129` command
**Generated on**: [YYYY-MM-DD]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
**Spec lineage**: [Marcus Baw SAFETY.md v2.0.0-draft](https://github.com/pacharanero/SAFETY.md)
