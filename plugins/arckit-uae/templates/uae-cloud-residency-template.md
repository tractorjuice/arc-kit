# UAE Sovereign Cloud Residency Assessment

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit:uae-cloud-residency`

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time per _partials/RENDERING.md. -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit:uae-cloud-residency` | [PENDING] | [PENDING] |

## Executive Summary

[Two to three paragraphs describing the residency posture, the chosen sovereign cloud combination, residual non-compliance (if any), and the exit / portability stance under the UAE National Cloud Security Policy, Version 2.0.]

## Scope

| Item | Value |
|------|-------|
| Services in scope | [list] |
| Upstream dependencies | [services / platforms] |
| Downstream dependencies | [services / platforms] |
| Shared platform components | [identity / observability / backup / secrets / etc.] |
| Out-of-scope (with rationale) | [list] |

## Per-Dataset Residency Assessment

For each Dataset ID from the project's Smart Data Classification Register (`ARC-<project-id>-CLAS-v*.md`), map the Smart Data class to the policy's data classification level (Appendix 6.7) and assess required and actual residency.

| Dataset ID | Classification | Policy level (Appendix 6.7) | Required tier | Chosen CSP | Region | Compliance check |
|------------|----------------|-----------------------------|---------------|------------|--------|-------------------|
| [DS-001] | [Open / Confidential / Sensitive / Secret] | [Open, Confidential/Restricted, Secret or Top Secret — mapping rationale] | [Baseline Secure Cloud / Partial Sovereign Cloud / Sovereign Cloud] | [Core42 / G42 / Microsoft UAE North / UAE Central / FedNet / e& Sovereign Launchpad / etc.] | [region] | [Compliant / Non-compliant — rationale] |

> Under the National Cloud Security Policy, Version 2.0: Open data needs only the Baseline Secure Cloud Requirements, with its location known (§2.4.1.1–2.4.1.3); Confidential/Restricted data MUST be stored and processed on a Partial Sovereign or Sovereign Cloud, with the data stored in the UAE (§2.4.1.4, §3.4.1.1); data above Confidential/Restricted MUST be stored and processed on a Sovereign Cloud, with processing and metadata also in the UAE (§2.4.1.5, §3.4.1.4–3.4.1.5). Any non-compliant row is a critical gap unless the Cyber Security Council has granted an exception (§1.4).

## CSP Due-Diligence Pack

For each candidate CSP, record the diligence posture.

### Core42 / G42 sovereign cloud

| Item | Value |
|------|-------|
| Sovereign-data scope | [in scope / out of scope] |
| Regional footprint | [Abu Dhabi / Dubai / other] |
| DESC accreditation | [Y/N — date] |
| CSC accreditation | [Y/N — date] |
| Documented limitations | [notes] |

### Microsoft UAE North (Dubai) and UAE Central (Abu Dhabi)

| Item | Value |
|------|-------|
| Sovereign-data scope | [in scope / out of scope] |
| Regional footprint | [UAE North / UAE Central / both] |
| DESC accreditation | [Y/N — date] |
| CSC accreditation | [Y/N — date] |
| Documented limitations | [notes] |

### TDRA FedNet

| Item | Value |
|------|-------|
| Sovereign-data scope | [in scope / out of scope] |
| Regional footprint | [federal data centre] |
| Accreditation | [TDRA — date] |
| Documented limitations | [notes] |

### e& Sovereign Launchpad on AWS

| Item | Value |
|------|-------|
| Sovereign-data scope | [in scope / out of scope] |
| Regional footprint | [me-central-1 / other] |
| DESC accreditation | [Y/N — date] |
| CSC accreditation | [Y/N — date] |
| Documented limitations | [notes] |

> Add additional candidate CSPs (e.g. Oracle UAE, Google Cloud) using the same pattern.

## Shared-Responsibility Matrix

For the chosen CSP combination, record the division of security responsibilities.

| Layer | CSP responsibility | Customer responsibility | Notes |
|-------|---------------------|--------------------------|-------|
| Physical and environmental | [scope] | [scope] | [notes] |
| Infrastructure (compute / storage / network) | [scope] | [scope] | [notes] |
| Platform (managed services) | [scope] | [scope] | [notes] |
| Application | [scope] | [scope] | [notes] |
| Data and encryption keys | [scope] | [scope] | [notes — BYOK / HYOK / customer-managed] |
| Identity and access | [scope] | [scope] | [notes — UAE PASS / federation] |
| Operations and monitoring | [scope] | [scope] | [notes] |

## Exit and Portability Plan

| Item | Plan |
|------|------|
| Data egress strategy | [export format, mechanism, owner] |
| Format portability | [open formats / proprietary mitigations] |
| Identity migration | [plan] |
| Encryption key custody on exit | [HSM transfer / re-wrap / re-key] |
| Contingency residency on regulatory change | [target alt CSP, migration runbook ref] |
| Estimated exit time-to-restore | [hours / days] |

## External References

### Document Register

| Doc ID | Title | URL | Verified date |
|--------|-------|-----|---------------|
| UAE-NCSP-V2 | UAE National Cloud Security Policy, Version 2.0, September 2025 (UAE Cyber Security Council) | <https://csc.gov.ae/documents/38662/1042755/National+Cloud+Security+Policy_V2.0.pdf/ee6897fa-943b-8874-d23b-c0ec1608c90f> | [YYYY-MM-DD] |

### Citations

| Citation | Doc ID | Section | Used in |
|----------|--------|---------|---------|
| [CRES-1] | UAE-NCSP-V2 | §2.4.1, Appendices 6.7–6.9 (classification levels and sovereignty tiers) | Per-Dataset Residency Assessment |
| [CRES-2] | UAE-NCSP-V2 | §3.4.1.2, §3.4.1.6 (CSP lists of compliant services) | CSP Due-Diligence Pack |
| [CRES-3] | UAE-NCSP-V2 | §1.2 (responsibilities by service model) | Shared-Responsibility Matrix |

### Unreferenced Documents

[List any documents read during generation but not cited, or "None".]

---

**Generated by**: ArcKit `/arckit:uae-cloud-residency` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
