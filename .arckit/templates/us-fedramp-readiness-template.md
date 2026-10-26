# FedRAMP Readiness Self-Assessment (3PAO RAR Format)

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit:us-fedramp-readiness`

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time per _partials/RENDERING.md. -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit:us-fedramp-readiness` command | PENDING | PENDING |

---

## Executive Summary

> **Status of this document**: an internal self-assessment prepared by the CSP in the format of the FedRAMP Readiness Assessment Report (RAR). It is not the official RAR, which a FedRAMP-recognized 3PAO prepares, owns and attests, and it cannot confer FedRAMP Ready or any other FedRAMP status. FedRAMP has accepted no new FedRAMP Ready submissions since 28 July 2026 (FedRAMP Consolidated Rules for 2026).

[Two to three paragraphs: CSO under assessment, baseline targeted, who prepared this self-assessment, the 3PAO engaged or planned (if any), the readiness verdict for 3PAO assessment (Ready / Conditionally Ready / Not Ready), and the top three gaps by severity.]

---

## 1. Capability Statement

| Field | Value |
|-------|-------|
| **Cloud Service Offering (CSO)** | [CSO name] |
| **CSP** | [CSP organisation] |
| **Service Model** | [IaaS / PaaS / SaaS] |
| **Baseline Targeted** | [Moderate / High] |
| **Authorisation Path** | [Agency / JAB / Tailored] |
| **Prepared By** | [CSP readiness lead — name + role] |
| **3PAO Engaged (planned or contracted)** | [3PAO name + A2LA accreditation # / Not yet engaged] |
| **Self-Assessment Period** | [YYYY-MM-DD to YYYY-MM-DD] |
| **Sponsoring Agency** (if Agency path) | [Agency] |
| **Target ATO Date** | [YYYY-MM-DD] |

### What the CSO Provides

[Two-paragraph description of the service, customer use cases, and key capabilities relevant to federal customers.]

### Customer Responsibility Matrix (Summary)

| Control Family | CSO Provides | Customer Responsibility |
|----------------|--------------|-------------------------|
| AC | [What the CSO handles] | [What the customer must configure] |
| AU | [What the CSO handles] | [What the customer must configure] |
| CM | [What the CSO handles] | [What the customer must configure] |
| IR | [What the CSO handles] | [What the customer must configure] |
| SC | [What the CSO handles] | [What the customer must configure] |
| SI | [What the CSO handles] | [What the customer must configure] |

[Full CRM is a separate deliverable; this is a summary view for the RAR.]

---

## 2. Authorisation Path Recommendation

| Path | Recommended? | Rationale |
|------|--------------|-----------|
| **Agency ATO** | [Yes / No] | [Single sponsoring agency identified; suits CSOs with a primary federal customer.] |
| **JAB P-ATO** | [Yes / No] | [Multi-agency demand; suits widely-used CSOs.] |
| **FedRAMP Tailored (Low-Impact SaaS)** | [Yes / No] | [LI-SaaS only; suits collaboration / productivity tools with no PII / no sensitive data.] |

**Recommendation**: [Agency / JAB / Tailored] — [Rationale narrative]

---

## 3. Gap Register

Gaps identified during the readiness assessment that must be remediated before authorisation.

| Control ID | Gap Description | Severity (Critical / High / Moderate / Low) | Mitigation Plan | Target Completion (POA&M Target) | Owner |
|-----------|-----------------|---------------------------------------------|-----------------|----------------------------------|-------|
| [AC-2] | [Account management process not fully automated; manual provisioning steps remain.] | [Moderate] | [Automate provisioning via IdP workflow; remove manual steps.] | [YYYY-MM-DD] | [Platform team] |
| [AU-6] | [Audit log review cadence not documented for the application tier.] | [Low] | [Document review SOP; SOC ack daily.] | [YYYY-MM-DD] | [SOC] |
| [SC-7] | [WAF rule set not validated against OWASP top 10.] | [High] | [Engage AppSec; tune WAF; rerun validation.] | [YYYY-MM-DD] | [AppSec] |
| [SR-3] | [SBOM not yet produced for one third-party dependency.] | [Moderate] | [Engage vendor; produce CycloneDX SBOM.] | [YYYY-MM-DD] | [SecOps] |

---

## 4. Evidence Inventory

| Artefact | Control ID(s) | Evidence Status (Complete / Partial / Missing) | Location / Link |
|----------|---------------|------------------------------------------------|-----------------|
| System Security Plan (SSP) | [All] | [Complete] | [ARC-{P}-FRSSP-v*] |
| FIPS 199 Categorization | [RA-2] | [Complete] | [ARC-{P}-FIPS199-v*] |
| Tailored 800-53 Control Set | [All] | [Complete] | [ARC-{P}-NIST-v*] |
| Privacy Impact Assessment | [PT family] | [Complete] | [ARC-{P}-USPIA-v*] |
| Contingency Plan | [CP-2] | [Complete] | [Reference] |
| Incident Response Plan | [IR-8] | [Complete] | [Reference] |
| Configuration Management Plan | [CM-9] | [Complete] | [Reference] |
| ConMon Plan | [CA-7] | [Partial — pending FedRAMP PMO template alignment] | [Reference] |
| POA&M (initial) | [CA-5] | [Complete] | [Reference] |
| Vulnerability Scan (authenticated) | [RA-5] | [Complete — last scan YYYY-MM-DD] | [Scan report ref] |
| Penetration Test Report | [CA-8] | [Complete — last test YYYY-MM-DD] | [Pentest report ref] |
| Customer Responsibility Matrix (CRM) | [All inherited] | [Complete] | [Reference] |
| FIPS 140-3 Validation Certs for crypto modules | [SC-13] | [Complete — CMVP cert NNNN] | [CMVP cert link] |
| SSDF Self-Attestation (EO 14028) | [SR family] | [Complete] | [ARC-{P}-SBOM-v*] |

---

## 5. Readiness Criteria Checklist

### 5.1 Federal Mandates (RAR §4.1)

The six Federal Mandates in the FedRAMP Moderate and High RAR templates. Answer Yes only if the mandate is fully and strictly met; an alternative implementation is a No. A 3PAO will not submit a RAR while any answer is No.

| # | Federal Mandate | Fully Met? | Evidence / Notes |
|---|-----------------|------------|------------------|
| 1 | FIPS 140-validated cryptographic modules used everywhere cryptography is required (SC-13), including all SC-8, SC-8(1) and SC-28 encryption | [Yes / No] | [Notes] |
| 2 | System fully supports user authentication with agency PIV or CAC credentials | [Yes / No] | [Notes] |
| 3 | System operates at Digital Identity Level 2 or higher (Moderate) / Level 3 (High) | [Yes / No] | [Notes] |
| 4 | CSP consistently remediates High vulnerabilities within 30 days, Moderate within 90 and Low within 180 | [Yes / No] | [Notes] |
| 5 | CSP and system meet federal records management requirements (record holds, NARA, FOIA) | [Yes / No] | [Notes] |
| 6 | External DNS supports DNSSEC for origin authentication and integrity (SC-20, SC-21, SC-22) | [Yes / No] | [Notes] |

### 5.2 Further Readiness Checks

ArcKit's pre-assessment checks, covering ground the RAR assesses under FedRAMP Requirements (§4.2) and Additional Capabilities (§4.3), plus federal requirements the RAR does not test (row 13).

| # | Criterion | Status | Notes |
|---|-----------|--------|-------|
| 1 | CSO is fully described (architecture, boundary, components) | [Met / Not Met] | [Notes] |
| 2 | Authorisation boundary diagram approved | [Met / Not Met] | [Notes] |
| 3 | Data flow diagram approved | [Met / Not Met] | [Notes] |
| 4 | All controls implemented or have POA&M target dates | [Met / Not Met] | [Notes] |
| 5 | Leveraged services are FedRAMP Authorized (not In Process or Ready) | [Met / Not Met] | [Notes] |
| 6 | Multi-factor authentication implemented (AAL2 minimum) | [Met / Not Met] | [Notes] |
| 7 | Continuous monitoring strategy documented | [Met / Not Met] | [Notes] |
| 8 | Initial vulnerability scan completed; results in evidence | [Met / Not Met] | [Notes] |
| 9 | Initial POA&M populated | [Met / Not Met] | [Notes] |
| 10 | Incident response capability validated by tabletop exercise | [Met / Not Met] | [Notes] |
| 11 | All cryptographic key management implemented per SC-12 | [Met / Not Met] | [Notes] |
| 12 | CRM completed and signed by CSP | [Met / Not Met] | [Notes] |
| 13 | SSDF / EO 14028 self-attestation submitted to CISA | [Met / Not Met] | [Notes] |

**Readiness Verdict for 3PAO Assessment**: [Ready / Conditionally Ready / Not Ready]

---

## 6. Penetration Testing Summary

[The RAR does not require a penetration test, though the 3PAO reviews any existing results when it assesses separation measures; the full initial assessment of a Moderate or High system does require one. Record the latest test here, or "None yet" with the planned date.]

| Field | Value |
|-------|-------|
| **Test Firm** | [Firm name] |
| **Test Period** | [YYYY-MM-DD to YYYY-MM-DD] |
| **Scope** | [In-scope assets, applications, APIs] |
| **Methodology** | [PTES / OWASP WSTG / NIST SP 800-115] |
| **Critical Findings** | [Count + status] |
| **High Findings** | [Count + status] |
| **Medium Findings** | [Count + status] |
| **Low Findings** | [Count + status] |
| **Retest Date** | [YYYY-MM-DD] |
| **Final Status** | [All criticals remediated / N criticals open with mitigation] |

---

## 7. Continuous Monitoring Readiness

| Element | Status | Notes |
|---------|--------|-------|
| ConMon Plan documented | [Complete / In progress] | [Reference] |
| Monthly POA&M ready for FedRAMP PMO submission | [Yes / No] | [Notes] |
| Authenticated scan cadence proven (≥ 4 weeks history) | [Yes / No] | [Notes] |
| IR drill (tabletop or functional) completed in last 12 months | [Yes / No] | [Notes] |
| Annual assessment scope agreed with AO | [Yes / No] | [Notes] |

---

## 8. Remediation Roadmap

```text
Month 1     |================================|  Address all High gaps
Month 2     |================================|  Address Moderate gaps
Month 3     |================================|  3PAO assessment (official RAR or full initial assessment)
Month 4     |================================|  Submit package to FedRAMP PMO
Month 5-6   |================================|  ATO process (Agency or JAB review)
```

[Replace with project-specific timeline. Include milestone gates: gap closure → 3PAO assessment → package submission → AO review → ATO issued.]

| Milestone | Target Date | Owner | Status |
|-----------|-------------|-------|--------|
| All High gaps closed | [YYYY-MM-DD] | [Owner] | [Open / Done] |
| All Moderate gaps closed | [YYYY-MM-DD] | [Owner] | [Open / Done] |
| 3PAO assessment complete | [YYYY-MM-DD] | [3PAO] | [Open / Done] |
| Package submitted to FedRAMP PMO | [YYYY-MM-DD] | [System Owner] | [Open / Done] |
| ATO issued | [YYYY-MM-DD] | [AO] | [Open / Done] |

---

## 9. References

| Reference | Citation | URL |
|-----------|----------|-----|
| FedRAMP 3PAO RAR Template | Readiness Assessment Report Template (Moderate v2.1, May 2024; High) | <https://www.fedramp.gov/documents-templates/> |
| FedRAMP Consolidated Rules for 2026 | Important dates — FedRAMP Ready retired 28 July 2026 | <https://www.fedramp.gov/2026/timeline/> |
| FedRAMP Agency Authorization Playbook | Agency Authorization Playbook | <https://www.fedramp.gov/agency-authorization/> |
| FedRAMP JAB Prioritisation Criteria | JAB Prioritisation Criteria | <https://www.fedramp.gov/jab-prioritization/> |
| FedRAMP Continuous Monitoring Strategy Guide | ConMon Strategy Guide | <https://www.fedramp.gov/assets/resources/documents/CSP_Continuous_Monitoring_Strategy_Guide.pdf> |
| A2LA 3PAO Directory | Accredited 3PAO Directory | <https://customer.a2la.org/index.cfm?event=directory.search> |

---

## 10. Approvals

[Internal approval of the self-assessment. A 3PAO signs only the official RAR it prepares, never this document.]

| Role | Name | Signature | Date |
|------|------|-----------|------|
| CSP Readiness Lead (preparer) | [Name] | [Signature] | [YYYY-MM-DD] |
| CSP System Owner | [Name] | [Signature] | [YYYY-MM-DD] |
| CSP CISO | [Name] | [Signature] | [YYYY-MM-DD] |

---

**Generated by**: ArcKit `/arckit:us-fedramp-readiness` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
