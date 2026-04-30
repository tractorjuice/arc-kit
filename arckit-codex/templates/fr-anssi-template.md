# ANSSI Security Posture Assessment

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit.fr-anssi`
>
> ⚠️ **Community-contributed** — not yet validated against current ANSSI/CNIL/EU regulatory text. Verify all citations before relying on output.

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time to _partials/document-control-uk.md or _partials/document-control-uae.md based on plugin userConfig classification_scheme + governance_framework. See _partials/RENDERING.md (when present). -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit.fr-anssi` | [PENDING] | [PENDING] |

## Executive Summary

| Hygiene Measure Theme | Total Measures | Implemented | Partial | Not Implemented |
|----------------------|----------------|-------------|---------|-----------------|
| Know and manage your assets | 5 | — | — | — |
| Manage user and admin accounts | 8 | — | — | — |
| Authenticate and control access | 7 | — | — | — |
| Secure workstations and mobile devices | 7 | — | — | — |
| Protect your network | 7 | — | — | — |
| Secure your servers and applications | 5 | — | — | — |
| Manage vulnerabilities and updates | 3 | — | — | — |
| **Total** | **42** | — | — | — |

| Cloud Recommendations | Status |
|----------------------|--------|
| ANSSI cloud security recommendations (2021) | [Applicable / Not applicable] |
| Cloud provider trust level | [SecNumCloud / EU-qualified / Other] |

---

## 1. Scope and Applicable Guides

| Element | Description |
|---------|------------|
| System studied | [Name and brief description] |
| Assessment boundary | [What is included / excluded] |
| Deployment environment | [Cloud / On-premise / Hybrid] |
| Primary ANSSI guide | Guide d'hygiène informatique (2017 edition, 42 measures) |
| Supplementary guides | [List applicable ANSSI technical guides] |
| Regulatory context | [OIV / OSE / Public sector / Private — affects applicability of measures] |

---

## 2. ANSSI Guide d'Hygiène Informatique — 42 Measures

**Status codes**: ✅ Implemented | ⚠️ Partial | ❌ Not implemented | N/A Not applicable

### Theme 1 — Know and Manage Your Assets

| # | Measure | Status | Gap / Evidence |
|---|---------|--------|---------------|
| 1 | Establish and maintain an up-to-date inventory of all hardware assets | | |
| 2 | Establish and maintain an up-to-date inventory of all software assets | | |
| 3 | Define and use naming conventions for accounts and machines | | |
| 4 | Identify a technical contact responsible for each software product | | |
| 5 | Produce and maintain a network map | | |

### Theme 2 — Manage User and Admin Accounts

| # | Measure | Status | Gap / Evidence |
|---|---------|--------|---------------|
| 6 | Limit the number of accounts with administrative privileges | | |
| 7 | Define a strong password policy for all accounts | | |
| 8 | Change default credentials on all equipment | | |
| 9 | Prefer individual accounts over shared accounts | | |
| 10 | Revoke inactive accounts promptly | | |
| 11 | Define and apply a user access management process (joiners/movers/leavers) | | |
| 12 | Separate privileged administrator accounts from daily-use accounts | | |
| 13 | Do not grant local administrator rights to standard users | | |

### Theme 3 — Authenticate and Control Access

| # | Measure | Status | Gap / Evidence |
|---|---------|--------|---------------|
| 14 | Authenticate all users before granting access to information systems | | |
| 15 | Enable multi-factor authentication for all remote access and admin accounts | | |
| 16 | Apply the principle of least privilege for all accounts | | |
| 17 | Limit access to data and applications to authorised users only | | |
| 18 | Restrict physical access to sensitive systems | | |
| 19 | Log and monitor all authentication events | | |
| 20 | Protect the confidentiality and integrity of remote maintenance sessions | | |

### Theme 4 — Secure Workstations and Mobile Devices

| # | Measure | Status | Gap / Evidence |
|---|---------|--------|---------------|
| 21 | Apply a configuration baseline to all workstations | | |
| 22 | Enable full-disk encryption on all laptops and mobile devices | | |
| 23 | Protect workstations with endpoint detection capability | | |
| 24 | Control the use of removable media | | |
| 25 | Disable autorun on all workstations | | |
| 26 | Implement an email filtering solution | | |
| 27 | Implement a web content filtering solution | | |

### Theme 5 — Protect Your Network

| # | Measure | Status | Gap / Evidence |
|---|---------|--------|---------------|
| 28 | Segment the network and isolate sensitive systems | | |
| 29 | Filter inbound and outbound network flows | | |
| 30 | Use encrypted protocols for all sensitive communications | | |
| 31 | Secure Wi-Fi access points | | |
| 32 | Limit exposure of administration interfaces to the internet | | |
| 33 | Deploy an intrusion detection capability | | |
| 34 | Collect and centralise security logs | | |

### Theme 6 — Secure Servers and Applications

| # | Measure | Status | Gap / Evidence |
|---|---------|--------|---------------|
| 35 | Apply a hardened configuration baseline to all servers | | |
| 36 | Disable unused services and ports on all systems | | |
| 37 | Supervise privileged access to production systems | | |
| 38 | Implement backup and recovery procedures | | |
| 39 | Test backup recovery regularly | | |

### Theme 7 — Manage Vulnerabilities and Updates

| # | Measure | Status | Gap / Evidence |
|---|---------|--------|---------------|
| 40 | Keep all software and firmware up to date | | |
| 41 | Subscribe to CERT-FR security advisories | | |
| 42 | Define and apply a vulnerability management process | | |

---

## 3. ANSSI Cloud Security Recommendations (2021)

[Complete if the system uses cloud services — IaaS, PaaS, SaaS, or hybrid]

### 3.1 Cloud Provider Assessment

| Criterion | Recommendation | Status |
|-----------|---------------|--------|
| Provider qualification | Prefer SecNumCloud-qualified providers for sensitive data | |
| Data location | EU-only hosting for data subject to French law | |
| Extraterritorial law exposure | Assess US CLOUD Act / China MLSA applicability | |
| Encryption key management | Customer-managed keys (BYOK) preferred | |
| Incident response SLA | Provider must notify within contractual timeframe | |
| Exit strategy | Data portability and reversibility contractually guaranteed | |

### 3.2 Cloud Architecture Security

| Requirement | Status | Gap |
|-------------|--------|-----|
| Shared responsibility model documented | | |
| Identity and access management in cloud follows least privilege | | |
| Cloud configuration hardening applied (CIS Benchmarks or equivalent) | | |
| Cloud activity logging enabled and sent to SIEM | | |
| API access secured with strong authentication | | |
| Secrets management solution in place (no credentials in code) | | |

---

## 4. Gap Analysis and Remediation Plan

| Measure / Recommendation | Status | Priority | Owner | Target Date |
|--------------------------|--------|---------|-------|-------------|
| [Measure description] | ❌ | 🔴 High | [Role] | [Date] |

**Priority levels**:

- 🔴 High: deploy before go-live or within 30 days
- 🟠 Medium: deploy within 90 days
- 🟡 Low: deploy within 12 months

### 4.1 Summary Score

| Metric | Count |
|--------|-------|
| Measures fully implemented | [N] / 42 |
| Measures partially implemented | [N] / 42 |
| Measures not implemented | [N] / 42 |
| Cloud recommendations applicable | [N] |
| Cloud recommendations implemented | [N] |

---

**Generated by**: ArcKit `/arckit.fr-anssi` command
**Generated on**: [YYYY-MM-DD]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
