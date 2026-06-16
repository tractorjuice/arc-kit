# Deployment Clinical Safety Case Report — [PRODUCT_NAME] at [DEPLOYING_ORGANISATION]

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit:uk-nhs-dcb0160` | **Filename**: `DEPLOYMENT-SAFETY-CASE.md` (DCB0160 deployer)

## Document Control

| Field | Value |
|---|---|
| **Document ID** | `DEPLOYMENT-SAFETY-CASE.md` (Marcus Baw SAFETY.md spec convention) |
| **Document Type** | Deployment Clinical Safety Case Report (DCB0160 deployer) |
| **Project** | [PROJECT_NAME] (Project [PROJECT_ID]) |
| **Classification** | [OFFICIAL / OFFICIAL-SENSITIVE] |
| **Status** | DRAFT |
| **Version** | [VERSION] |
| **Created Date** | [YYYY-MM-DD] |
| **Last Modified** | [YYYY-MM-DD] |
| **Review Cycle** | Quarterly (or on any material deployment / workflow / training change) |
| **Next Review Date** | [YYYY-MM-DD] |
| **Owner** | [DEPLOYING_ORGANISATION_PROJECT_OWNER] |
| **Reviewed By** | [PENDING — deploying-organisation CSO] |
| **Approved By** | [PENDING — deploying-organisation CSO sign-off in §7 below] |
| **Distribution** | [DISTRIBUTION_LIST] |

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---|---|---|---|---|---|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit:uk-nhs-dcb0160` command | PENDING | PENDING |

---

## 1. Deployment Context

| Field | Value |
|---|---|
| **Deploying Organisation** | [NHS Trust / ICS / GP federation / mental health trust / etc.] |
| **Clinical Service Affected** | [e.g. Paediatric Outpatients, Emergency Department, Primary Care] |
| **Sites** | [List of sites or sites-pattern; "all sites within X Trust"] |
| **Patient Population** | [Demographic / clinical population affected] |
| **Estimated Patient Volume** | [Patients per month / year affected] |
| **Project Sponsor** | [Executive sponsor at deploying organisation] |
| **Local Implementation Lead** | [Name / role] |
| **CSO at Deploying Organisation** | [PENDING — name + GMC/NMC/HCPC/GPhC registration] |
| **Caldicott Guardian Sign-off** | [PENDING] |
| **SIRO Sign-off** | [PENDING] |

---

## 2. Scope

### In scope

[Which sites / services / user populations / use cases the deployment covers.]

### Out of scope

[Explicit out-of-scope statements — sites not in this rollout, use cases not in this rollout, legacy systems not being replaced.]

### Phasing

| Phase | Sites | Users | Patient cohort | Go-live | Go / No-Go criteria |
|---|---|---|---|---|---|
| Pilot | [site] | [users] | [cohort] | [date] | [criteria] |
| Wave 1 | | | | | |
| Wave 2 | | | | | |
| Full rollout | | | | | |

---

## 3. Manufacturer Case Acceptance

The deploying organisation has reviewed the manufacturer's DCB0129 case at [manufacturer SAFETY-CASE.md link] dated [YYYY-MM-DD] and:

- ☐ Accepts the manufacturer's intended-use statement as applicable to this deployment
- ☐ Accepts the manufacturer's residual-risk position as documented in §5 of the manufacturer case
- ☐ Has identified the additional deployment-specific risks in §4 below

If any of the above are NOT acceptable, the deployment is **not safe to proceed** until resolved. Document any disagreements with the manufacturer here, including the resolution path (additional local controls / configuration change / request product change from manufacturer / abandon deployment).

---

## 4. Deployment Safety Argument

Top-level claim:

> **G1: The deployment of [PRODUCT_NAME] at [DEPLOYING_ORGANISATION] is acceptably safe for the affected patient population and clinical workflows, given the manufacturer's case and the local controls documented below.**

Sub-claims:

### G1.1 — Clinicians using the system are adequately trained

Evidence:

- Training plan: [link or describe]
- Super-user identification and training: [link]
- Competence assessment before clinical use: [pass criteria]
- Cross-references: D-HAZ-001 (inadequate training)

### G1.2 — The product integrates safely with existing local clinical workflows

Evidence:

- Workflow mapping with clinical SMEs at the deploying organisation: [link]
- Integration with parallel systems (EPR, results, prescribing): [list]
- Handover-of-care points covered: [list]
- Cross-references: D-HAZ-002 (workflow gap), D-HAZ-003 (integration failure)

### G1.3 — The deployment has adequate business continuity if the product is unavailable

Evidence:

- Manual fallback workflow documented and tested: [link]
- BC drill evidence: [date / outcome]
- Cross-references: D-HAZ-004 (BC failure)

### G1.4 — Transition risks from legacy systems are mitigated

Evidence:

- Parallel-running plan: [link]
- Data migration plan and validation: [link]
- Legacy decommission plan: [link]
- Cross-references: D-HAZ-005 (parallel-running confusion), D-HAZ-006 (data migration error)

### G1.5 — Local configuration is correct and verified

Evidence:

- Configuration document: [link]
- Configuration verification process: [who verifies, against what reference]
- Cross-references: D-HAZ-007 (configuration error), D-HAZ-008 (terminology/coding mismatch), D-HAZ-009 (RBAC misalignment)

### G1.6 — Local incident reporting and post-deployment monitoring is in place

Evidence:

- Local incident reporting route into Datix / equivalent
- Cadence of post-deployment monitoring
- Trigger criteria for hazard log update / safety case revision
- Cross-references: D-HAZ-010 (failure to learn from incidents)

[Add or remove G-sub-claims to reflect the actual deployment. Each should reference real D-HAZ-IDs in the Deployment Hazard Log.]

---

## 5. Local Evidence

### Local clinical user testing

[Sessions held, clinical roles tested, outcomes summary.]

### Super-user training records

[Number of super-users trained, attendance, competence assessment outcomes.]

### Integration test evidence

[Local integration test plan and outcomes — interface engine, identity, results, prescribing.]

### Parallel-running evidence

[If parallel running with a legacy system, summary of issues found and resolved.]

---

## 6. Residual Deployment Risk

| D-HAZ-ID | Residual Severity | Residual Likelihood | Residual Risk | Justification for acceptance |
|---|---|---|---|---|
| D-HAZ-001 | [N] | [N] | [low / medium / high] | [Why this residual risk is acceptable given clinical benefit at this organisation] |
| ... |  |  |  |  |

### Overall deployment residual risk position

[Deploying organisation CSO's overall judgment that the deployment, with controls in place, is acceptably safe.]

---

## 7. Deploying-Organisation CSO Sign-off

| Field | Value |
|---|---|
| **Deploying Organisation** | [DEPLOYING_NHS_ORGANISATION] |
| **CSO Name** | [PENDING] |
| **Registration** | [GMC / NMC / HCPC / GPhC number — PENDING] |
| **Date** | [PENDING] |
| **Statement** | I am the Clinical Safety Officer at [DEPLOYING_NHS_ORGANISATION]. I have reviewed this Deployment Clinical Safety Case Report and the associated Deployment Hazard Log, and the manufacturer's DCB0129 case it references. I am satisfied that the deployment of [PRODUCT_NAME] in our clinical context, with the local controls documented in this case, is acceptably safe for our patients and clinicians. I approve this deployment safety case. **— [PENDING]** |
| **Signature** | [PENDING] |

---

## External References

| Doc ID | Title | Source | Used in |
|---|---|---|---|
| DCB0160 | Clinical Risk Management: its Application in the Deployment and Use of Health IT Systems | NHS England | This document, throughout |
| DCB0129 | Manufacturer Clinical Risk Management for Health IT (cross-referenced manufacturer case) | NHS England | §3, throughout |
| SAFETY-MD-SPEC | SAFETY.md spec v2.0.0-draft | Marcus Baw / pacharanero | Document structure |

---

**Generated by**: ArcKit `/arckit:uk-nhs-dcb0160` command
**Generated on**: [YYYY-MM-DD]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
**Spec lineage**: [Marcus Baw SAFETY.md v2.0.0-draft](https://github.com/pacharanero/SAFETY.md)
