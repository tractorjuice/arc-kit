# FedRAMP Readiness Assessment Report (3PAO)

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit:us-fedramp-readiness`

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time per _partials/RENDERING.md. -->
<!-- Classification line MUST be: -->
<!-- | Classification | PUBLIC / OFFICIAL / OFFICIAL-SENSITIVE (set via `default_classification` user-config) | -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit:us-fedramp-readiness` command | PENDING | PENDING |

---

## Executive Summary

[Two to three paragraphs: CSO under assessment, baseline targeted, the 3PAO firm conducting the assessment, the overall readiness recommendation (FedRAMP-Ready / Not Ready / Conditional), and the top three gaps by severity.]

---

## 1. Capability Statement

| Field | Value |
|-------|-------|
| **Cloud Service Offering (CSO)** | [CSO name] |
| **CSP** | [CSP organisation] |
| **Service Model** | [IaaS / PaaS / SaaS] |
| **Baseline Targeted** | [Moderate / High] |
| **Authorisation Path** | [Agency / JAB / Tailored] |
| **3PAO Firm** | [3PAO name + A2LA accreditation #] |
| **Assessment Period** | [YYYY-MM-DD to YYYY-MM-DD] |
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

| Control ID | Gap Description | Severity (High / Mod / Low) | Mitigation Plan | Target Completion (POA&M Target) | Owner |
|-----------|-----------------|------------------------------|-----------------|----------------------------------|-------|
| [AC-2] | [Account management process not fully automated; manual provisioning steps remain.] | [Moderate] | [Automate provisioning via IdP workflow; remove manual steps.] | [YYYY-MM-DD] | [Platform team] |
| [AU-6] | [Audit log review cadence not documented for the application tier.] | [Low] | [Document review SOP; SOC ack daily.] | [YYYY-MM-DD] | [SOC] |
| [SC-7] | [WAF rule set not validated against OWASP top 10.] | [High] | [Engage AppSec; tune WAF; rerun validation.] | [YYYY-MM-DD] | [AppSec] |
| [SR-3] | [SBOM not yet produced for one third-party dependency.] | [Moderate] | [Engage vendor; produce CycloneDX SBOM.] | [YYYY-MM-DD] | [SecOps] |

---

## 4. Evidence Inventory

| Artefact | Control ID(s) | Evidence Status (Complete / Partial / Missing) | Location / Link |
|----------|---------------|------------------------------------------------|-----------------|
| System Security Plan (SSP) | [All] | [Complete] | [ARC-{P}-FRSSP-v*] |
| FIPS 199 Categorization | [RA-2] | [Complete] | [ARC-{P}-FISMA-v*] |
| Tailored 800-53 Control Set | [All] | [Complete] | [ARC-{P}-NIST53-v*] |
| Privacy Impact Assessment | [PT family] | [Complete] | [ARC-{P}-PIA-v*] |
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

## 5. 3PAO RAR Criteria Checklist

Per the FedRAMP 3PAO Readiness Assessment Report template.

| # | Criterion | Status | Notes |
|---|-----------|--------|-------|
| 1 | CSO is fully described (architecture, boundary, components) | [Met / Not Met] | [Notes] |
| 2 | Authorisation boundary diagram approved | [Met / Not Met] | [Notes] |
| 3 | Data flow diagram approved | [Met / Not Met] | [Notes] |
| 4 | All controls implemented or have POA&M target dates | [Met / Not Met] | [Notes] |
| 5 | FedRAMP-Ready CSP dependencies confirmed | [Met / Not Met] | [Notes] |
| 6 | FIPS 140-3 validated crypto modules used for all crypto | [Met / Not Met] | [Notes] |
| 7 | Multi-factor authentication implemented (AAL2 minimum) | [Met / Not Met] | [Notes] |
| 8 | Continuous monitoring strategy documented | [Met / Not Met] | [Notes] |
| 9 | Initial vulnerability scan completed; results in evidence | [Met / Not Met] | [Notes] |
| 10 | Initial penetration test completed; report in evidence | [Met / Not Met] | [Notes] |
| 11 | Initial POA&M populated | [Met / Not Met] | [Notes] |
| 12 | Incident response capability validated by tabletop exercise | [Met / Not Met] | [Notes] |
| 13 | All cryptographic key management implemented per SC-12 | [Met / Not Met] | [Notes] |
| 14 | CRM completed and signed by CSP | [Met / Not Met] | [Notes] |
| 15 | SSDF / EO 14028 self-attestation submitted to CISA | [Met / Not Met] | [Notes] |

**Overall RAR Recommendation**: [FedRAMP-Ready / Not Ready / Conditional]

---

## 6. Penetration Testing Summary

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
Month 3     |================================|  3PAO retest of remediated items
Month 4     |================================|  Submit package to FedRAMP PMO
Month 5-6   |================================|  ATO process (Agency or JAB review)
```

[Replace with project-specific timeline. Include milestone gates: gap closure → 3PAO retest → package submission → AO review → ATO issued.]

| Milestone | Target Date | Owner | Status |
|-----------|-------------|-------|--------|
| All High gaps closed | [YYYY-MM-DD] | [Owner] | [Open / Done] |
| All Moderate gaps closed | [YYYY-MM-DD] | [Owner] | [Open / Done] |
| 3PAO retest complete | [YYYY-MM-DD] | [3PAO] | [Open / Done] |
| Package submitted to FedRAMP PMO | [YYYY-MM-DD] | [System Owner] | [Open / Done] |
| ATO issued | [YYYY-MM-DD] | [AO] | [Open / Done] |

---

## 9. References

| Reference | Citation | URL |
|-----------|----------|-----|
| FedRAMP 3PAO RAR Template | Readiness Assessment Report Template | <https://www.fedramp.gov/documents-templates/> |
| FedRAMP Agency Authorization Playbook | Agency Authorization Playbook | <https://www.fedramp.gov/agency-authorization/> |
| FedRAMP JAB Prioritisation Criteria | JAB Prioritisation Criteria | <https://www.fedramp.gov/jab-prioritization/> |
| FedRAMP Continuous Monitoring Strategy Guide | ConMon Strategy Guide | <https://www.fedramp.gov/assets/resources/documents/CSP_Continuous_Monitoring_Strategy_Guide.pdf> |
| A2LA 3PAO Directory | Accredited 3PAO Directory | <https://customer.a2la.org/index.cfm?event=directory.search> |

---

## 10. Approvals

| Role | Name | Signature | Date |
|------|------|-----------|------|
| 3PAO Lead Assessor | [Name] | [Signature] | [YYYY-MM-DD] |
| CSP System Owner | [Name] | [Signature] | [YYYY-MM-DD] |
| CSP CISO | [Name] | [Signature] | [YYYY-MM-DD] |
| Sponsoring Agency AO (Agency path) | [Name] | [Signature] | [YYYY-MM-DD] |

---

**Generated by**: ArcKit `/arckit:us-fedramp-readiness` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
