# EU Cyber Resilience Act Compliance Assessment

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit.eu-cra`
>
> ⚠️ **Community-contributed** — not yet validated against current ANSSI/CNIL/EU regulatory text. Verify all citations before relying on output.

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time to _partials/document-control-uk.md or _partials/document-control-uae.md based on plugin userConfig classification_scheme + governance_framework. See _partials/RENDERING.md (when present). -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit.eu-cra` | [PENDING] | [PENDING] |

## Executive Summary

| Area | Classification | Status | Key Gaps |
|------|---------------|--------|---------|
| Product Scope | [In scope / Out of scope] | — | — |
| Risk Classification | [Default / Class I / Class II] | [Compliant / Partial / Gap] | [Count] |
| Security by Design | — | [Compliant / Partial / Gap] | [Count] |
| Vulnerability Management | — | [Compliant / Partial / Gap] | [Count] |
| Reporting Capability | — | [Compliant / Partial / Gap] | [Count] |
| Conformity Assessment | — | [Compliant / Partial / Gap] | [Count] |

---

## 1. Scope and Classification

### 1.1 In-Scope Assessment

| Criterion | Assessment |
|-----------|-----------|
| Product with digital elements (hardware or software) | ☐ Yes ☐ No |
| Placed or made available on EU market | ☐ Yes ☐ No |
| Excluded category (medical devices, aviation, automotive, marine, civil aviation regulated by sector law) | ☐ Yes ☐ No — if yes, check sector regulation |

**CRA In Scope**: ☐ Yes ☐ No

### 1.2 Risk Classification

| Class | Annex | Description | Examples | Conformity Route |
|-------|-------|-------------|---------|-----------------|
| **Default** | — | All products not in Class I or II | Most software, consumer IoT | Internal self-assessment |
| **Important (Class I)** | Annex III, Part I | Higher cybersecurity risk | Identity management software, browsers, password managers, VPNs, network monitoring, industrial control systems, smart home security | Self-assessment with harmonised standards |
| **Critical (Class II)** | Annex III, Part II | Highest cybersecurity risk | HSMs, secure elements, smart meters, critical infrastructure components, industrial automation, card readers | Third-party assessment (notified body) |

**Product Classification**: ☐ Default | ☐ Important (Class I) | ☐ Critical (Class II)

### 1.3 Open Source Assessment

| Scenario | CRA Applicability |
|---------|-----------------|
| Purely open source, no commercial activity | Out of scope |
| Open source with paid support/services | In scope for supported product |
| Integrating open source in commercial product | In scope — manufacturer responsible for full product |
| Open source foundation / steward | Lighter obligations (security policies, CVE participation) |

**Open source scenario**: [Scenario] | **CRA applicability**: [Yes / No / Partial]

## 2. Security Requirements by Design (Annex I, Part I)

| Requirement | Description | Status | Gap | Remediation |
|-------------|-------------|--------|-----|-------------|
| No known exploitable vulnerabilities | Place on market without known exploitable vulnerabilities | ☐ | | |
| Secure by default configuration | Products delivered with secure default settings, no unnecessary features enabled | ☐ | | |
| Protection against unauthorised access | Authentication, access control, attack surface reduction | ☐ | | |
| Data confidentiality and integrity | Encryption of data at rest and in transit | ☐ | | |
| Minimal data collection | Process only data strictly necessary for intended purpose | ☐ | | |
| Availability protection | Measures against DoS attacks | ☐ | | |
| Limit attack surface | Disable unused interfaces; minimise exposed components | ☐ | | |
| Reduce exploitable vulnerabilities | Least privilege, defence in depth, secure coding | ☐ | | |
| Integrity monitoring | Verify integrity of software and data | ☐ | | |
| Security audit logging | Log security-relevant events, tamper-resistant logs | ☐ | | |
| Secure update mechanism | Signed updates, rollback capability | ☐ | | |
| End-of-support transparency | Communicate end-of-support date to users | ☐ | | |

## 3. Vulnerability Management Requirements (Annex I, Part II)

| Requirement | Description | Status | Gap |
|-------------|-------------|--------|-----|
| Vulnerability disclosure policy (VDP) | Published, accessible VDP with contact mechanism | ☐ | |
| SBOM (Software Bill of Materials) | Machine-readable SBOM covering top-level dependencies (minimum) | ☐ | |
| CVE registry participation | Register CVEs in MITRE/NVD for product vulnerabilities | ☐ | |
| Free security updates | Provide security updates throughout support lifetime at no extra cost | ☐ | |
| Coordinated disclosure | Responsibly disclose to national CSIRT and ENISA | ☐ | |
| 24-hour incident reporting | Report actively exploited vulnerabilities to ENISA and national CSIRT | ☐ | |
| Documented support period | End-of-life date communicated to users | ☐ | |

### 3.1 SBOM Requirements

| SBOM Element | Status |
|-------------|--------|
| Top-level component inventory | ☐ |
| Machine-readable format (SPDX, CycloneDX) | ☐ |
| Dependency relationships documented | ☐ |
| License information included | ☐ |
| Known vulnerabilities linked (CVE IDs) | ☐ |

## 4. Reporting Obligations

| Event | Deadline | Recipient | Status |
|-------|---------|-----------|--------|
| Awareness of actively exploited vulnerability | **24 hours** — early warning | ENISA + national CSIRT (FR: CERT-FR) | ☐ |
| Incident with impact on security of product | **24 hours** — early warning | ENISA + national CSIRT | ☐ |
| Full incident notification | **72 hours** | ENISA + national CSIRT | ☐ |
| Final incident report | **14 days** after mitigation deployed | ENISA + national CSIRT | ☐ |

**24-hour reporting capability in place**: ☐ Yes ☐ No

## 5. Conformity Assessment

### 5.1 Conformity Route

| Product Class | Conformity Route | Notified Body Required | Status |
|--------------|-----------------|----------------------|--------|
| Default | Module A (internal control) | No | ☐ |
| Important (Class I) — with harmonised standards | Module A with standards | No | ☐ |
| Important (Class I) — without harmonised standards | Module B + C | Yes | ☐ |
| Critical (Class II) | Module B + C or H | Yes | ☐ |

### 5.2 Technical Documentation (Required Before Market Placement)

- [ ] Product description and intended use
- [ ] Design and manufacturing documentation
- [ ] Cybersecurity risk assessment
- [ ] SBOM
- [ ] Security testing results
- [ ] Vulnerability handling procedures
- [ ] EU Declaration of Conformity (Annex V)
- [ ] CE marking

### 5.3 CE Marking

| Requirement | Status |
|-------------|--------|
| CE marking affixed to product | ☐ |
| EU Declaration of Conformity issued | ☐ |
| Declaration references applicable CRA requirements | ☐ |
| Notified body (if required) certificate obtained | ☐ |

## 6. French Market Surveillance

| Authority | Role |
|-----------|------|
| ANSSI | Technical lead for cybersecurity aspects; designated market surveillance authority for CRA in France |
| DGCCRF | General consumer protection market surveillance; coordination with ANSSI |
| CERT-FR | Receives vulnerability and incident reports under CRA Articles 14–15 |

## 7. Gap Analysis and Timeline

| Requirement | Status | Gap Description | Remediation Action | CRA Deadline |
|-------------|--------|----------------|-------------------|-------------|
| Secure by default | ☐ | [Description] | [Action] | Dec 2027 |
| SBOM generation | ☐ | [Description] | [Action] | Dec 2027 |
| VDP published | ☐ | [Description] | [Action] | Dec 2027 |
| 24h reporting capability | ☐ | [Description] | [Action] | Dec 2027 |
| Technical documentation | ☐ | [Description] | [Action] | Dec 2027 |
| CE marking process | ☐ | [Description] | [Action] | Dec 2027 |
| Notified body engaged (if Class I/II) | ☐ | [Description] | [Action] | Sep 2026 (notification bodies) |

**Key CRA dates**:

- 11 September 2026: Notification body obligations apply
- 11 December 2027: Full CRA obligations apply

---

**Generated by**: ArcKit `/arckit.eu-cra` command
**Generated on**: [YYYY-MM-DD]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
