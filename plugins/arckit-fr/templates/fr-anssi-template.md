# ANSSI Security Posture Assessment

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit:fr-anssi`
>
> ⚠️ **Community-contributed** — not yet validated against current ANSSI/CNIL/EU regulatory text. Verify all citations before relying on output.

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time per _partials/RENDERING.md. -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit:fr-anssi` | [PENDING] | [PENDING] |

## Executive Summary

| Hygiene Guide Chapter | Total Measures | Implemented | Partial | Not Implemented |
|----------------------|----------------|-------------|---------|-----------------|
| I. Raise awareness and train | 3 | — | — | — |
| II. Know the information system | 4 | — | — | — |
| III. Authenticate and control access | 6 | — | — | — |
| IV. Secure workstations | 5 | — | — | — |
| V. Secure the network | 8 | — | — | — |
| VI. Secure administration | 3 | — | — | — |
| VII. Manage mobile working | 4 | — | — | — |
| VIII. Keep the information system up to date | 2 | — | — | — |
| IX. Monitor, audit, respond | 5 | — | — | — |
| X. Going further | 2 | — | — | — |
| **Total** | **42** | — | — | — |

| Cloud Recommendations | Status |
|----------------------|--------|
| ANSSI recommendations for hosting sensitive IS in the cloud (v1.0, July 2024) | [Applicable / Not applicable] |
| Cloud provider trust level | [SecNumCloud / EU-qualified / Other] |

---

## 1. Scope and Applicable Guides

| Element | Description |
|---------|------------|
| System studied | [Name and brief description] |
| Assessment boundary | [What is included / excluded] |
| Deployment environment | [Cloud / On-premise / Hybrid] |
| Primary ANSSI guide | Guide d'hygiène informatique (version 2.0, 2017 — 42 measures in 10 chapters) |
| Supplementary guides | [List applicable ANSSI technical guides] |
| Regulatory context | [OIV / OSE / Public sector / Private — affects applicability of measures] |

---

## 2. ANSSI Guide d'Hygiène Informatique — 42 Measures

**Status codes**: ✅ Implemented | ⚠️ Partial | ❌ Not implemented | N/A Not applicable

Status is assessed against each measure's *standard* level. Where the guide also defines a *renforcé* (reinforced) level for a measure, record in Gap / Evidence whether it is met or targeted.

### I — Raise Awareness and Train (Sensibiliser et former)

| # | Measure | Status | Gap / Evidence |
|---|---------|--------|---------------|
| 1 | Train operational teams in information system security | | |
| 2 | Raise users' awareness of basic IT security practices | | |
| 3 | Control the risks of outsourced IT (infogérance) | | |

### II — Know the Information System (Connaître le système d'information)

| # | Measure | Status | Gap / Evidence |
|---|---------|--------|---------------|
| 4 | Identify the most sensitive information and servers, and maintain a network diagram | | |
| 5 | Keep an exhaustive, up-to-date inventory of privileged accounts | | |
| 6 | Organise joiner, leaver and change-of-role procedures for users | | |
| 7 | Allow only managed devices to connect to the organisation's network | | |

### III — Authenticate and Control Access (Authentifier et contrôler les accès)

| # | Measure | Status | Gap / Evidence |
|---|---------|--------|---------------|
| 8 | Identify each person accessing the system by name, and distinguish user and administrator roles | | |
| 9 | Assign the right permissions on the information system's sensitive resources | | |
| 10 | Define and check rules for choosing and sizing passwords | | |
| 11 | Protect passwords stored on systems | | |
| 12 | Change default authentication credentials on devices and services | | |
| 13 | Use strong authentication wherever possible | | |

### IV — Secure Workstations (Sécuriser les postes)

| # | Measure | Status | Gap / Evidence |
|---|---------|--------|---------------|
| 14 | Apply a minimum security level across all IT equipment | | |
| 15 | Protect against threats from removable media | | |
| 16 | Use a centralised management tool to make security policies consistent | | |
| 17 | Enable and configure the local firewall on workstations | | |
| 18 | Encrypt sensitive data sent over the Internet | | |

### V — Secure the Network (Sécuriser le réseau)

| # | Measure | Status | Gap / Evidence |
|---|---------|--------|---------------|
| 19 | Segment the network and partition the zones from each other | | |
| 20 | Secure Wi-Fi access networks and keep their uses separate | | |
| 21 | Use secure protocols wherever they exist | | |
| 22 | Set up a secure Internet access gateway | | |
| 23 | Partition Internet-facing services from the rest of the information system | | |
| 24 | Protect business email | | |
| 25 | Secure dedicated network interconnections with partners | | |
| 26 | Control and protect access to server rooms and technical premises | | |

### VI — Secure Administration (Sécuriser l'administration)

| # | Measure | Status | Gap / Evidence |
|---|---------|--------|---------------|
| 27 | Block Internet access from workstations or servers used to administer the information system | | |
| 28 | Use a dedicated, partitioned network to administer the information system | | |
| 29 | Limit administration rights on workstations to strict operational need | | |

### VII — Manage Mobile Working (Gérer le nomadisme)

| # | Measure | Status | Gap / Evidence |
|---|---------|--------|---------------|
| 30 | Physically secure mobile devices | | |
| 31 | Encrypt sensitive data, especially on equipment that could be lost | | |
| 32 | Secure the network connection of devices used while working remotely | | |
| 33 | Adopt security policies dedicated to mobile terminals | | |

### VIII — Keep the Information System Up to Date (Maintenir le système d'information à jour)

| # | Measure | Status | Gap / Evidence |
|---|---------|--------|---------------|
| 34 | Define an update policy for information system components (including CERT-FR vulnerability monitoring) | | |
| 35 | Anticipate end of support for software and systems, and limit software dependencies | | |

### IX — Monitor, Audit, Respond (Superviser, auditer, réagir)

| # | Measure | Status | Gap / Evidence |
|---|---------|--------|---------------|
| 36 | Enable and configure logs on the most important components | | |
| 37 | Define and apply a backup policy for critical components | | |
| 38 | Carry out regular security checks and audits, then apply the corrective actions | | |
| 39 | Appoint an information system security lead and make them known to staff | | |
| 40 | Define a security incident management procedure | | |

### X — Going Further (Pour aller plus loin)

| # | Measure | Status | Gap / Evidence |
|---|---------|--------|---------------|
| 41 | Carry out a formal risk analysis | | |
| 42 | Prefer ANSSI-qualified products and services | | |

---

## 3. ANSSI Cloud Hosting Recommendations for Sensitive IS (v1.0, July 2024)

[Complete if the system uses cloud services — IaaS, PaaS, SaaS, or hybrid]

### 3.1 Cloud Provider Assessment

| Criterion | Recommendation | Status |
|-----------|---------------|--------|
| IS category | [DR-level sensitive IS / sensitive IS under the State "cloud au centre" doctrine / sensitive IS of an OIV or OSE / SIIV] — ANSSI recommends the cloud offer types to favour for each category | |
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

**Generated by**: ArcKit `/arckit:fr-anssi` command
**Generated on**: [YYYY-MM-DD]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
