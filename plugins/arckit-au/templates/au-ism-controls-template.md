# ASD Information Security Manual (ISM) Control Applicability Statement

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit:au-ism-controls`

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time per _partials/RENDERING.md. -->
<!-- Classification line MUST be: -->
<!-- | Classification | UNOFFICIAL / OFFICIAL / OFFICIAL:Sensitive / PROTECTED / SECRET | -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit:au-ism-controls` command | PENDING | PENDING |

---

## Executive Summary

[Two to three paragraphs: system under assessment, classification, ISM edition used, overall control applicability posture, key gaps, and IRAP / DISP cross-reference position.]

---

## System Context

| Field | Value |
|-------|-------|
| **System Name** | [System name] |
| **Classification** | [UNOFFICIAL / OFFICIAL / OFFICIAL:Sensitive / PROTECTED / SECRET] |
| **Deployment Model** | [Cloud (SaaS/PaaS/IaaS) / On-Premise / Hybrid] |
| **IRAP Assessment Status** | [Assessed (date) / In Progress / Not Required / Not Started] |
| **IRAP Scope** | [What's in scope / Cloud provider's IRAP boundary referenced] |
| **DISP Member** | [Yes (Level 1/2/3) / In Progress / No] |
| **ISM Edition Used** | [e.g., March 2026 — verification date] |
| **Sovereignty** | [All data in AU / Some offshore / Sovereign cloud] |
| **Assessment Date** | [YYYY-MM-DD] |
| **Assessor** | [Name and role] |

---

## Control Domain Applicability Matrix

ISM controls are organised into 17 domains. Applicability depends on the system's classification — controls flagged for the system's *highest classification of processed information* apply.

| # | Domain | Applies | Implementation | Notes |
|---|--------|---------|----------------|-------|
| 1 | Cyber Security Governance | [Y/N] | [✅/⚠️/❌] | [Notes] |
| 2 | Cyber Security Incidents | [Y/N] | [✅/⚠️/❌] | [Cross-ref NDB playbook] |
| 3 | Outsourced Services | [Y/N] | [✅/⚠️/❌] | [MSP boundary, supply chain] |
| 4 | Security Documentation | [Y/N] | [✅/⚠️/❌] | [SSP, SRMP] |
| 5 | Personnel Security | [Y/N] | [✅/⚠️/❌] | [Clearance levels] |
| 6 | Physical Security | [Y/N] | [✅/⚠️/❌] | [Cloud-only systems may N/A this in part] |
| 7 | Communications Infrastructure | [Y/N] | [✅/⚠️/❌] | [Often N/A for pure-cloud] |
| 8 | ICT Equipment Security | [Y/N] | [✅/⚠️/❌] | [Endpoint lifecycle] |
| 9 | System Hardening | [Y/N] | [✅/⚠️/❌] | [Cross-ref E8] |
| 10 | System Management | [Y/N] | [✅/⚠️/❌] | [Admin governance, vuln mgmt] |
| 11 | System Monitoring | [Y/N] | [✅/⚠️/❌] | [SIEM, audit retention] |
| 12 | Cryptography | [Y/N] | [✅/⚠️/❌] | [ASD-approved algorithms, key mgmt] |
| 13 | Gateway Security | [Y/N] | [✅/⚠️/❌] | [Content filtering, DLP] |
| 14 | Data Transfer | [Y/N] | [✅/⚠️/❌] | [Cross-domain, cross-system] |
| 15 | Cloud and IaaS Considerations | [Y/N] | [✅/⚠️/❌] | [Inherit from IRAP cloud provider where applicable] |
| 16 | Working-Off-Site Security | [Y/N] | [✅/⚠️/❌] | [Remote work, mobile, BYOD] |
| 17 | Evaluation Activities | [Y/N] | [✅/⚠️/❌] | [Common Criteria, FIPS] |

---

## Per-Domain Control Applicability Assessment

### Domain 1: Cyber Security Governance

| Aspect | Detail |
|--------|--------|
| **Applies** | [Yes / No] |
| **Implementation** | [✅ / ⚠️ / ❌] |
| **Applicable Controls** | [List ISM control identifiers — e.g., ISM-0027, ISM-0714, ISM-1567] |

**Evidence**: [Security risk management plan, security documentation, change management process, accountable security officer]

**Gaps**: [Specific control IDs not implemented + gap description]

**Remediation**: [Actions, owners, target dates]

**Compensating Controls**: [If any]

---

### Domain 2: Cyber Security Incidents

| Aspect | Detail |
|--------|--------|
| **Applies** | [Yes / No] |
| **Implementation** | [✅ / ⚠️ / ❌] |
| **Applicable Controls** | [List ISM control identifiers] |

**Evidence**: [Incident response plan, NDB playbook reference (`ARC-{P}-AUNDB-v*`), 24/7 monitoring posture]

**Gaps**: [Specific control IDs not implemented]

**Remediation**: [Actions, owners, target dates]

---

### Domain 3: Outsourced Services

| Aspect | Detail |
|--------|--------|
| **Applies** | [Yes — MSP / cloud providers in scope] |
| **Implementation** | [✅ / ⚠️ / ❌] |
| **Applicable Controls** | [List] |

**Evidence**: [MSP contractual security flow-down, supply-chain attestation review, IRAP-assessed cloud service inheritance, MSP-held admin role inventory]

**Gaps**: [Specific control IDs not implemented]

**Remediation**: [Actions, owners, target dates]

---

### Domain 4: Security Documentation

| Aspect | Detail |
|--------|--------|
| **Applies** | [Yes] |
| **Implementation** | [✅ / ⚠️ / ❌] |
| **Applicable Controls** | [List] |

**Evidence**: [System Security Plan (SSP), Security Risk Management Plan (SRMP), Continuous Monitoring Plan, Incident Response Plan]

**Gaps**: [Specific control IDs not implemented]

**Remediation**: [Actions, owners, target dates]

---

### Domain 5: Personnel Security

| Aspect | Detail |
|--------|--------|
| **Applies** | [Yes] |
| **Implementation** | [✅ / ⚠️ / ❌] |
| **Applicable Controls** | [List — varies by classification + DISP membership] |

**Evidence**: [Security clearance verification process, security awareness training, separation of duties, foreign national handling]

**Gaps**: [Specific control IDs]

**Remediation**: [Actions, owners, target dates]

---

### Domain 6: Physical Security

| Aspect | Detail |
|--------|--------|
| **Applies** | [Yes / Partial — cloud-only systems may inherit from cloud provider's IRAP] |
| **Implementation** | [✅ / ⚠️ / ❌ / Inherited from IRAP cloud provider] |

**Evidence**: [Facility access controls, ICT equipment lifecycle, media handling]

**Gaps**: [Specific control IDs]

**Remediation**: [Actions, owners, target dates]

---

### Domain 7: Communications Infrastructure

| Aspect | Detail |
|--------|--------|
| **Applies** | [Often N/A for pure-cloud systems] |
| **Implementation** | [Inherited / N/A] |

**Notes**: For pure-cloud systems (SaaS/PaaS/IaaS), this domain typically inherits from the cloud provider's IRAP attestation.

---

### Domain 8: ICT Equipment Security

| Aspect | Detail |
|--------|--------|
| **Applies** | [Yes for endpoint estate] |
| **Implementation** | [✅ / ⚠️ / ❌] |
| **Applicable Controls** | [List] |

**Evidence**: [Endpoint hardening, secure media handling, sanitisation procedures, equipment disposal]

**Gaps**: [Specific control IDs]

**Remediation**: [Actions, owners, target dates]

---

### Domain 9: System Hardening

| Aspect | Detail |
|--------|--------|
| **Applies** | [Yes] |
| **Implementation** | [✅ / ⚠️ / ❌] |
| **Applicable Controls** | [List] |
| **E8 Cross-Reference** | [ARC-{P}-AUE8-v*] |

**Evidence**: [Operating system hardening, application hardening, authentication mechanisms, network security] — **defer to E8 posture artefact for E8-mapped controls**.

**Gaps**: [Beyond-E8 ISM control gaps]

**Remediation**: [Actions, owners, target dates]

---

### Domain 10: System Management

| Aspect | Detail |
|--------|--------|
| **Applies** | [Yes] |
| **Implementation** | [✅ / ⚠️ / ❌] |
| **Applicable Controls** | [List] |

**Evidence**: [Privileged access management, vulnerability management, change management, configuration management]

**Gaps**: [Specific control IDs]

**Remediation**: [Actions, owners, target dates]

---

### Domain 11: System Monitoring

| Aspect | Detail |
|--------|--------|
| **Applies** | [Yes] |
| **Implementation** | [✅ / ⚠️ / ❌] |
| **Applicable Controls** | [List] |

**Evidence**: [Event logging, audit retention (typically 7 years for OFFICIAL+), SIEM integration, security metrics]

**Gaps**: [Specific control IDs]

**Remediation**: [Actions, owners, target dates]

---

### Domain 12: Cryptography

| Aspect | Detail |
|--------|--------|
| **Applies** | [Yes for any encrypted data] |
| **Implementation** | [✅ / ⚠️ / ❌] |
| **Applicable Controls** | [List] |

**Evidence**: [ASD-Approved Cryptographic Algorithms (AACA) used; ASD-Approved Cryptographic Protocols (AACP) used; key lifecycle management; HSM use]

**Gaps**: [Specific control IDs]

**Remediation**: [Actions, owners, target dates]

---

### Domain 13: Gateway Security

| Aspect | Detail |
|--------|--------|
| **Applies** | [Yes for systems with internet boundary] |
| **Implementation** | [✅ / ⚠️ / ❌] |
| **Applicable Controls** | [List] |

**Evidence**: [Gateway architecture, content filtering, DLP, certificate management]

**Gaps**: [Specific control IDs]

**Remediation**: [Actions, owners, target dates]

---

### Domain 14: Data Transfer

| Aspect | Detail |
|--------|--------|
| **Applies** | [Yes if cross-domain or cross-system data movement] |
| **Implementation** | [✅ / ⚠️ / ❌] |
| **Applicable Controls** | [List] |

**Evidence**: [Cross-domain solutions, secure file transfer, data import/export controls, sanitisation at boundary]

**Gaps**: [Specific control IDs]

**Remediation**: [Actions, owners, target dates]

---

### Domain 15: Cloud and IaaS Considerations

| Aspect | Detail |
|--------|--------|
| **Applies** | [Yes for any cloud-hosted system] |
| **Implementation** | [✅ / ⚠️ / ❌ / Inherited from IRAP cloud provider] |
| **Applicable Controls** | [List] |
| **IRAP Cloud Provider Inheritance** | [Microsoft Azure (IRAP PROTECTED date), AWS (IRAP date), GCP (IRAP date) — list applicable] |

**Evidence**: [Cloud provider IRAP scope statements, customer-side responsibility implementation, sovereignty configuration]

**Gaps**: [Specific control IDs not satisfied by inheritance]

**Remediation**: [Actions, owners, target dates]

---

### Domain 16: Working-Off-Site Security

| Aspect | Detail |
|--------|--------|
| **Applies** | [Yes if remote work supported] |
| **Implementation** | [✅ / ⚠️ / ❌] |

**Evidence**: [Remote work policy, BYOD posture, mobile device management, secure remote access]

**Gaps**: [Specific control IDs]

**Remediation**: [Actions, owners, target dates]

---

### Domain 17: Evaluation Activities

| Aspect | Detail |
|--------|--------|
| **Applies** | [Yes if Common Criteria / FIPS-evaluated products in scope] |
| **Implementation** | [✅ / ⚠️ / ❌] |

**Evidence**: [Common Criteria / FIPS 140-2 product use, evaluated configurations]

**Gaps**: [Specific control IDs]

**Remediation**: [Actions, owners, target dates]

---

## ISM-to-E8 Cross-Reference

| E8 Strategy | Primary ISM Domain(s) | Notes |
|-------------|-----------------------|-------|
| Application Control | 9 (System Hardening), 13 (Gateway Security) | App allowlist + boundary control |
| Patch Applications | 9, 10 (System Management) | Vulnerability + patch management |
| Configure MS Office Macro Settings | 9 | Application hardening sub-control |
| User Application Hardening | 9 | Endpoint application configuration |
| Restrict Administrative Privileges | 5 (Personnel), 10 (System Management) | Privileged access mgmt |
| Patch Operating Systems | 9, 10 | OS-level patching |
| Multi-Factor Authentication | 9, 12 (Cryptography) | Authentication mechanism |
| Regular Backups | 4 (Security Documentation), 11 (System Monitoring), 17 (Working-Off-Site security for offline backups) | BCP + restore testing |

---

## Compliance Summary

| Domain | Applies | Status | Applicable Controls | Implemented | Gap Count |
|--------|---------|--------|---------------------|-------------|-----------|
| 1. Cyber Security Governance | [Y/N] | [✅/⚠️/❌] | [n] | [n] | [n] |
| 2. Cyber Security Incidents | [Y/N] | [✅/⚠️/❌] | [n] | [n] | [n] |
| 3. Outsourced Services | [Y/N] | [✅/⚠️/❌] | [n] | [n] | [n] |
| 4. Security Documentation | [Y/N] | [✅/⚠️/❌] | [n] | [n] | [n] |
| 5. Personnel Security | [Y/N] | [✅/⚠️/❌] | [n] | [n] | [n] |
| 6. Physical Security | [Y/N] | [✅/⚠️/❌] | [n] | [n] | [n] |
| 7. Communications Infrastructure | [Y/N] | [✅/⚠️/❌] | [n] | [n] | [n] |
| 8. ICT Equipment Security | [Y/N] | [✅/⚠️/❌] | [n] | [n] | [n] |
| 9. System Hardening | [Y/N] | [✅/⚠️/❌] | [n] | [n] | [n] |
| 10. System Management | [Y/N] | [✅/⚠️/❌] | [n] | [n] | [n] |
| 11. System Monitoring | [Y/N] | [✅/⚠️/❌] | [n] | [n] | [n] |
| 12. Cryptography | [Y/N] | [✅/⚠️/❌] | [n] | [n] | [n] |
| 13. Gateway Security | [Y/N] | [✅/⚠️/❌] | [n] | [n] | [n] |
| 14. Data Transfer | [Y/N] | [✅/⚠️/❌] | [n] | [n] | [n] |
| 15. Cloud and IaaS Considerations | [Y/N] | [✅/⚠️/❌] | [n] | [n] | [n] |
| 16. Working-Off-Site Security | [Y/N] | [✅/⚠️/❌] | [n] | [n] | [n] |
| 17. Evaluation Activities | [Y/N] | [✅/⚠️/❌] | [n] | [n] | [n] |

**Overall**: [n] Implemented / [n] Applicable = [n]% applicability score.

---

## IRAP Assessment Position

| Item | Detail |
|------|--------|
| **IRAP Assessment Status** | [Assessed (date) / In Progress / Not Required / Not Started] |
| **IRAP Scope** | [Description of system boundary assessed] |
| **Residual Risks Accepted** | [List residual risks accepted by Authorising Officer] |
| **Re-Assessment Cadence** | [Annual / On-major-change] |
| **Cloud Provider Inheritance** | [Microsoft Azure / AWS / GCP — IRAP scope citation] |

---

## Recommendations

### Quick Wins ( < 30 days)

| # | Recommendation | ISM Control(s) | Domain | Effort |
|---|---------------|----------------|--------|--------|
| 1 | [Recommendation] | [Control IDs] | [#] | [Low/Medium] |

### Short-Term (30–90 days)

| # | Recommendation | ISM Control(s) | Domain | Effort |
|---|---------------|----------------|--------|--------|
| 1 | [Recommendation] | [Control IDs] | [#] | [Medium/High] |

### Medium-Term (90–180 days)

| # | Recommendation | ISM Control(s) | Domain | Effort |
|---|---------------|----------------|--------|--------|
| 1 | [Recommendation] | [Control IDs] | [#] | [High] |

---

## External References

## ArcKit Evidence Integration

| Evidence Area | ArcKit Artefact | How It Supports ISM Applicability | Gap / Follow-up |
|---------------|-----------------|-----------------------------------|-----------------|
| Architecture boundaries | `/arckit:diagram` / ARC-*-DIAG-* | System boundaries, gateways, hosting, zones, inherited controls | [Gap / follow-up] |
| Data transfer evidence | `/arckit:dfd` / ARC-*-DFD-* | Data-transfer, gateway, integration, and cross-domain flow controls | [Gap / follow-up] |
| Classification evidence | `/arckit:data-model` / ARC-*-DATA-* | Classification, retention, owner, and information-handling control applicability | [Gap / follow-up] |
| Operational ownership | `/arckit:servicenow` / ARC-*-SNOW-* | ServiceNow/CMDB CIs, support groups, incident queues, change controls, dependencies | [Gap / follow-up] |
| Control risks | `/arckit:risk` / ARC-*-RISK-* | Residual ISM control gaps and treatment ownership | [Gap / follow-up] |
| Control traceability | `/arckit:traceability` / ARC-*-TRAC-* | ISM controls mapped to requirements, evidence, risks, PSPF, and DISP claims | [Gap / follow-up] |
| Coverage view | `/arckit:graph-report` | AUISM coverage across AU compliance, architecture, risk, and operations artefacts | [Gap / follow-up] |
| Capability uplift | `/arckit:maturity-model` / ARC-*-MMOD-* | ISM control maturity baseline and uplift roadmap | [Gap / follow-up] |

### Document Register

| Doc ID | Filename | Type | Source | Description |
|--------|----------|------|--------|-------------|
| ASDISM | ASD Information Security Manual | Standard | cyber.gov.au | Primary control framework — edition [DATE] |
| AUE8 | ARC-{P}-AUE8-v* | ArcKit Artefact | projects/ | E8 posture cross-reference (Domain 9) |

### Citations

| Citation ID | Doc ID | Section | Category | Quoted Passage |
|-------------|--------|---------|----------|----------------|
| — | — | — | — | — |

### Verification

| Standard | URL | Verification Date |
|----------|-----|-------------------|
| ASD Information Security Manual | https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/ism | [YYYY-MM-DD] |
| Protective Security Policy Framework | https://www.protectivesecurity.gov.au/ | [YYYY-MM-DD] |
| IRAP | https://www.cyber.gov.au/about-us/programs-and-services/irap | [YYYY-MM-DD] |

---

## Visual Evidence Decision Rule

Generate companion visual artefacts only when the available evidence includes enough structure to identify real nodes and relationships. If evidence is incomplete but structurally useful, create a clearly marked draft visual with `Pending Input` labels. If structural evidence is insufficient, do not create a diagram; record a Visual Evidence Gap and list the minimum inputs needed.

---

**Generated by**: ArcKit `/arckit:au-ism-controls` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
