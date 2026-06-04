# DISP Member Self-Attestation Pack

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit:au-disp-attestation`

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time per _partials/RENDERING.md. -->
<!-- Classification line MUST be: -->
<!-- | Classification | UNOFFICIAL / OFFICIAL / OFFICIAL:Sensitive / PROTECTED / SECRET | -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit:au-disp-attestation` command | PENDING | PENDING |

---

## Executive Summary

[Two to three paragraphs: organisation, DISP level sought, current attestation readiness, key gaps, target attestation date.]

---

## 1. Organisation Profile

| Field | Value |
|-------|-------|
| **Legal Entity** | [Full name + ABN] |
| **Trading Names** | [If applicable] |
| **Primary Business Activity** | [e.g., Infrastructure Advisory] |
| **Headcount** | [Total + by site] |
| **Sites** | [Office locations + cloud-tenant region] |
| **Defence Contracts in Scope** | [Active / pipeline contracts requiring DISP] |
| **DISP Level Sought** | [Level 1 / 2 / 3] |
| **Target Attestation Date** | [YYYY-MM-DD] |

---

## 2. DISP Level Sought

| Aspect | Detail |
|--------|--------|
| **Level** | [Level 1 / 2 / 3] |
| **Regulatory Driver** | [Specific contract / panel mandate / pipeline anticipation] |
| **Justification** | [Why this level — types of Defence work, classified content handling] |
| **Anticipated Defence Work** | [UNCLASSIFIED / OFFICIAL / OFFICIAL:Sensitive / PROTECTED — content categories handled] |

---

## 3. Security Officer Designation

| Aspect | Detail |
|--------|--------|
| **Chief Security Officer (CSO)** | [Name + role title] |
| **CSO Authority** | [Reporting line, signing authority, budget authority across the four security domains] |
| **CSO Clearance Level** | [Baseline / NV1 / NV2 / PV] |
| **Deputy CSO / Backup** | [Name + role + clearance] |
| **CSO Contact** | [Email / phone for Defence engagement] |
| **Vetting Status Verified** | [Yes / In progress / Not yet] |

---

## 4. Four Security Domains Coverage

### Domain 1: Governance

| Aspect | Detail |
|--------|--------|
| **Implementation Status** | [✅ / ⚠️ / ❌] |

**Evidence**: [Security policy framework, risk management plan, audit cadence, incident management process, change control. Cite ISM applicability statement [ARC-{P}-AUISM] Domain 1 + 4]

**Gaps**: [List]

**Remediation**: [Actions, owners, target dates]

**Sign-off**: [Accountable officer + date]

---

### Domain 2: Personnel Security

| Aspect | Detail |
|--------|--------|
| **Implementation Status** | [✅ / ⚠️ / ❌] |
| **Cleared Personnel Count** | [By clearance level — Baseline: n, NV1: n, NV2: n, PV: n] |
| **Vetting Workflow** | [In-house / outsourced; turnaround time] |

**Evidence**: [Clearance verification process, security awareness training programme, separation of duties model, off-boarding clearance debrief procedure, pre/post-leave briefing for cleared personnel. Cite ISM Domain 5]

**Gaps**: [List]

**Remediation**: [Actions, owners, target dates]

**Sign-off**: [Accountable officer + date]

---

### Domain 3: Physical Security

| Aspect | Detail |
|--------|--------|
| **Implementation Status** | [✅ / ⚠️ / ❌ / Inherited from IRAP cloud provider] |

**Evidence**: [Facility access controls, ICT equipment lifecycle, secure media handling, equipment disposal. For cloud-only systems, cite cloud provider IRAP scope statement (Microsoft IRAP PROTECTED date / AWS IRAP date / GCP IRAP date) + customer-side responsibility implementation]

**Gaps**: [Specific cloud-shared-responsibility gaps]

**Remediation**: [Actions, owners, target dates]

**Sign-off**: [Accountable officer + date]

---

### Domain 4: Information & Cyber Security

| Aspect | Detail |
|--------|--------|
| **Implementation Status** | [✅ / ⚠️ / ❌] |
| **E8 Posture Reference** | [ARC-{P}-AUE8-v*] |
| **ISM Applicability Reference** | [ARC-{P}-AUISM-v*] |

**Evidence**: [Defer to E8 posture artefact for E8 ML2 evidence; ISM applicability for additional controls. Specifically address: cryptography (Domain 12), gateway security (Domain 13), monitoring (Domain 11), BCP (cross-references E8 Strategy 8)]

**Gaps**: [Beyond E8 ML2, list ISM-domain-specific gaps]

**Remediation**: [Actions, owners, target dates]

**Sign-off**: [Accountable officer + date]

---

## 5. Essential Eight ML2 Evidence Per Strategy

(Summarised from `ARC-{P}-AUE8-v*` — refer to that artefact for evidence detail.)

| # | Strategy | Current ML | ML2 Evidence | Gap to ML2 | Sign-off |
|---|----------|-----------|--------------|------------|----------|
| 1 | Application Control | [ML0–3] | [Evidence summary] | [Gap] | [Officer + date] |
| 2 | Patch Applications | [ML0–3] | [Evidence summary] | [Gap] | [Officer + date] |
| 3 | Configure MS Office Macros | [ML0–3] | [Evidence summary] | [Gap] | [Officer + date] |
| 4 | User Application Hardening | [ML0–3] | [Evidence summary] | [Gap] | [Officer + date] |
| 5 | Restrict Admin Privileges | [ML0–3] | [Evidence summary] | [Gap] | [Officer + date] |
| 6 | Patch Operating Systems | [ML0–3] | [Evidence summary] | [Gap] | [Officer + date] |
| 7 | Multi-Factor Authentication | [ML0–3] | [Evidence summary] | [Gap] | [Officer + date] |
| 8 | Regular Backups | [ML0–3] | [Evidence summary] | [Gap] | [Officer + date] |

---

## 6. ISM Applicability Highlights

(Summarised from `ARC-{P}-AUISM-v*`.)

| ISM Domain | Material to DISP | Implementation | Gap |
|------------|-------------------|----------------|-----|
| 1. Cyber Security Governance | High | [✅/⚠️/❌] | [Gap] |
| 3. Outsourced Services (MSP boundary) | High | [✅/⚠️/❌] | [Gap] |
| 4. Security Documentation (SSP, SRMP) | High | [✅/⚠️/❌] | [Gap] |
| 5. Personnel Security | High (DISP-specific) | [✅/⚠️/❌] | [Gap] |
| 10. System Management (privileged access) | High | [✅/⚠️/❌] | [Gap] |
| 11. System Monitoring (audit retention) | High | [✅/⚠️/❌] | [Gap] |
| 12. Cryptography | Medium | [✅/⚠️/❌] | [Gap] |
| 15. Cloud and IaaS Considerations | High (if cloud-only) | [✅/⚠️/❌ / Inherited] | [Gap] |

---

## 7. Foreign Ownership, Control or Influence (FOCI) Declaration

| Aspect | Detail |
|--------|--------|
| **Foreign Ownership > 5%** | [Yes / No — if Yes: nation, percentage, entity] |
| **Foreign Board Members** | [Number, nationalities, role authority] |
| **Foreign Personnel with System Access** | [Number, nationalities, access scope] |
| **Foreign Supply-Chain Dependencies** | [Description] |
| **FOCI Mitigation Plan** | [If applicable, summary; cite supporting documentation] |

---

## 8. Supply Chain Security

| Tier 1 Supplier | Service | Attestation Held | Last Reviewed | Cleared for DISP Level |
|-----------------|---------|------------------|---------------|------------------------|
| [MSP name] | M365 admin | [SOC 2 / ISO 27001 / IRAP] | [YYYY-MM-DD] | [Level 1/2/3] |
| [Cloud Provider] | IaaS/PaaS | [IRAP PROTECTED date] | [YYYY-MM-DD] | [Level 1/2/3] |
| [SaaS Provider] | [Service] | [Attestation] | [YYYY-MM-DD] | [Level 1/2/3] |

**Supply-Chain Risk Management Process**: [Describe vendor onboarding, ongoing review, exit procedures]

---

## 9. Incident Response & Reporting

| Aspect | Detail |
|--------|--------|
| **Incident Response Plan** | [Document reference] |
| **24-Hour Defence Notification Capability** | [✅ / ⚠️ / ❌] |
| **OAIC NDB Scheme Integration** | [✅ / ⚠️ / ❌; cite NDB playbook ARC-{P}-AUNDB-v* if available] |
| **Last Tabletop / Live Exercise** | [YYYY-MM-DD] |
| **Lessons Learned Process** | [Description] |

---

## 10. Security Awareness Training

| Aspect | Detail |
|--------|--------|
| **Programme Name** | [E.g., DISP-aligned cyber awareness in ELMO] |
| **Modules** | [Mandatory / role-specific / clearance-holder additional briefings] |
| **Completion Rate (last 12mo)** | [%] |
| **Refresher Cadence** | [Annual / event-driven] |
| **Cleared-Personnel Briefings** | [Pre-leave / post-leave / change-of-role] |

---

## 11. Annual Self-Audit Plan

| Aspect | Detail |
|--------|--------|
| **Scope** | [Four domains coverage; specific control sample] |
| **Methodology** | [Self-assessment + evidence review + sample testing] |
| **Frequency** | [Annual minimum; on-major-change additional] |
| **Evidence Retention** | [Years] |
| **Last Audit Date** | [YYYY-MM-DD] |
| **Next Scheduled** | [YYYY-MM-DD] |

---

## 12. Attestation Statement

I/we attest that the information in this pack is accurate to the best of my/our knowledge as at the date below. We commit to maintaining the security posture described, completing the listed remediation actions by their target dates, and notifying Defence promptly of any material change to the four security domains.

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Chief Security Officer | | | |
| Director / Managing Director | | | |
| Date of Attestation | | | [YYYY-MM-DD] |
| Re-Attestation Due | | | [YYYY-MM-DD] |

---

## 13. External References

### Upstream ArcKit Evidence

| Evidence Area | ArcKit Artefact | How It Supports DISP Attestation | Gap / Follow-up |
|---------------|-----------------|----------------------------------|-----------------|
| Operational ownership | `/arckit:servicenow` / ARC-*-SNOW-* | ServiceNow/CMDB CIs, support groups, incident queues, change controls, supplier access | [Gap / follow-up] |
| Residual risks | `/arckit:risk` / ARC-*-RISK-* | DISP gaps, risk acceptance, treatment ownership, renewal risks | [Gap / follow-up] |
| Claim provenance | `/arckit:traceability` / ARC-*-TRAC-* | DISP claims mapped to AU artefacts, policies, controls, owners, and evidence records | [Gap / follow-up] |
| Coverage view | `/arckit:graph-report` | AUDISP coverage across AU compliance, risk, traceability, and operations artefacts | [Gap / follow-up] |
| Capability uplift | `/arckit:maturity-model` / ARC-*-MMOD-* | Governance, personnel, physical, cyber, and supplier maturity roadmap | [Gap / follow-up] |

| Artefact | Doc-ID | Cross-Reference |
|----------|--------|-----------------|
| ASD Essential Eight Posture | `ARC-{P}-AUE8-v*` | E8 maturity evidence per Strategy in section 6 |
| ASD ISM Applicability | `ARC-{P}-AUISM-v*` | ISM control coverage per domain in section 6 |
| Privacy Impact Assessment | `ARC-{P}-AUPIA-v*` | APP 11 personal-information protection evidence |
| Notifiable Data Breach Playbook | `ARC-{P}-AUNDB-v*` | Incident-response capability evidence |
| PSPF Compliance Assessment | `ARC-{P}-AUPSPF-v*` | Physical / personnel / governance security evidence |
| DTA Digital Service Standard | `ARC-{P}-AUDSS-v*` | Service-design assurance evidence (where applicable) |
| AI Assurance Assessment | `ARC-{P}-AUAIA-v*` | AI-system risk-control evidence (where applicable) |

### Document Register

| Doc ID | Filename | Type | Source | Description |
|--------|----------|------|--------|-------------|
| DISP | DISP Membership Pack | Standard | defence.gov.au | DISP application + evidence framework — edition [DATE] |
| AUE8 | ARC-{P}-AUE8-v* | ArcKit Artefact | projects/ | Essential Eight evidence |
| AUISM | ARC-{P}-AUISM-v* | ArcKit Artefact | projects/ | ISM applicability evidence |
| AUPIA | ARC-{P}-AUPIA-v* | ArcKit Artefact | projects/ | Privacy Act + APP 11 evidence |
| AUNDB | ARC-{P}-AUNDB-v* | ArcKit Artefact | projects/ | NDB playbook evidence (if available) |
| ASDISM | ASD Information Security Manual | Standard | cyber.gov.au | Underlying control framework |
| E8MM | ASD Essential Eight Maturity Model | Standard | cyber.gov.au | E8 ML2 minimum reference |

### Verification

| Standard | URL | Verification Date |
|----------|-----|-------------------|
| DISP | https://www.defence.gov.au/business-industry/programs/defence-industry-security-program | [YYYY-MM-DD] |
| ASD ISM | https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/ism | [YYYY-MM-DD] |
| ASD E8 | https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight/essential-eight-maturity-model | [YYYY-MM-DD] |

---

## Visual Evidence Decision Rule

Generate companion visual artefacts only when the available evidence includes enough structure to identify real nodes and relationships. If evidence is incomplete but structurally useful, create a clearly marked draft visual with `Pending Input` labels. If structural evidence is insufficient, do not create a diagram; record a Visual Evidence Gap and list the minimum inputs needed.

---

**Generated by**: ArcKit `/arckit:au-disp-attestation` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
