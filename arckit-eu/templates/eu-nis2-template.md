# NIS2 Compliance Assessment

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit.eu-nis2`
>
> ⚠️ **Community-contributed** — not yet validated against current ANSSI/CNIL/EU regulatory text. Verify all citations before relying on output.

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time to _partials/document-control-uk.md or _partials/document-control-uae.md based on plugin userConfig classification_scheme + governance_framework. See _partials/RENDERING.md (when present). -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit.eu-nis2` | [PENDING] | [PENDING] |

## Executive Summary

| Pillar | Status | Critical Gaps |
|--------|--------|--------------|
| Entity Scoping | [Essential / Important / Out of scope] | [Count] |
| Governance | [Compliant / Partial / Gap] | [Count] |
| Risk Management | [Compliant / Partial / Gap] | [Count] |
| Incident Reporting | [Compliant / Partial / Gap] | [Count] |
| Supply Chain | [Compliant / Partial / Gap] | [Count] |
| Business Continuity | [Compliant / Partial / Gap] | [Count] |

---

## 1. Entity Scoping

### 1.1 Sector Classification (Annex I — Essential / Annex II — Important)

| Sector | Sub-sector | Annex | Applicable |
|--------|-----------|-------|-----------|
| Energy | Electricity, gas, oil, hydrogen | I | ☐ |
| Transport | Air, rail, water, road | I | ☐ |
| Banking | Credit institutions | I | ☐ |
| Financial market infrastructure | Trading venues, CCPs | I | ☐ |
| Health | Healthcare providers, EU reference labs | I | ☐ |
| Drinking water | — | I | ☐ |
| Wastewater | — | I | ☐ |
| Digital infrastructure | IXPs, DNS, TLD, cloud, CDN, datacentres | I | ☐ |
| ICT service management (B2B) | Managed service providers | I | ☐ |
| Public administration | Central / regional government | I | ☐ |
| Space | — | I | ☐ |
| Postal and courier | — | II | ☐ |
| Waste management | — | II | ☐ |
| Chemicals | — | II | ☐ |
| Food | — | II | ☐ |
| Manufacturing (medical, computers, transport equipment) | — | II | ☐ |
| Digital providers | Marketplaces, search engines, social networks | II | ☐ |
| Research | — | II | ☐ |

### 1.2 Size Thresholds

| Criterion | Essential Entity | Important Entity |
|-----------|----------------|-----------------|
| Employees | > 250 | 50–250 |
| Annual turnover | > €50M | €10–50M |
| Balance sheet | > €43M | €10–43M |
| Or: Critical infrastructure designation | — | — |

**Entity classification**: ☐ Essential Entity | ☐ Important Entity | ☐ Out of scope

### 1.3 National Competent Authority

| Member State | NIS2 Authority | Contact |
|-------------|---------------|---------|
| France | ANSSI | cert.fr / anssi.gouv.fr |
| Germany | BSI | bsi.bund.de |
| Netherlands | NCSC-NL | ncsc.nl |
| Spain | CCN-CERT / INCIBE | ccn-cert.cni.es |
| Italy | ACN | acn.gov.it |
| Belgium | CCB | ccb.belgium.be |
| [Other] | [Authority] | [URL] |

**Applicable authority**: [Name]

## 2. Governance Obligations (Article 20)

| Requirement | Status | Evidence |
|-------------|--------|---------|
| Management body approves cybersecurity risk management measures | ☐ | |
| Management body oversees implementation | ☐ | |
| Management body members trained in cybersecurity | ☐ | |
| Management body personally liable for compliance | ☐ | |

## 3. Risk Management Measures (Article 21)

### 3.1 Minimum Security Measures

| Measure | Article 21(2) | Status | Gap |
|---------|--------------|--------|-----|
| Policies on risk analysis and IS security | (a) | ☐ | |
| Incident handling | (b) | ☐ | |
| Business continuity and crisis management | (c) | ☐ | |
| Supply chain security (ICT suppliers) | (d) | ☐ | |
| Security in network and IS acquisition, development, maintenance | (e) | ☐ | |
| Policies and procedures for effectiveness assessment | (f) | ☐ | |
| Basic cyber hygiene and training | (g) | ☐ | |
| Cryptography and encryption policies | (h) | ☐ | |
| HR security, access control, asset management | (i) | ☐ | |
| Multi-factor authentication (MFA) | (j) | ☐ | |
| Secure communications (voice, video, text) | (j) | ☐ | |
| Secure emergency communication systems | (j) | ☐ | |

### 3.2 Proportionality Assessment

| Factor | Assessment |
|--------|-----------|
| Entity size | [Large / Medium / Small] |
| Risk exposure | [High / Medium / Low] |
| Measures proportionate to risk | ☐ Yes ☐ No |
| All-hazards approach applied | ☐ Yes ☐ No |

## 4. Incident Reporting (Articles 23–24)

### 4.1 Significant Incident Definition

An incident is **significant** if it causes or could cause:

- Severe operational disruption or financial loss
- Impact on other natural or legal persons (physical, material, or non-material damage)

### 4.2 Reporting Timeline

| Report | Deadline | Recipient | Content |
|--------|---------|-----------|---------|
| Early warning | **24 hours** from awareness | National CSIRT + Competent Authority | Incident occurred, possibly malicious, possibly cross-border |
| Incident notification | **72 hours** from awareness | National CSIRT + Competent Authority | Initial assessment, severity, indicators of compromise |
| Intermediate report (if requested) | On request | Authority | Status update |
| Final report | **1 month** after submission | National CSIRT + Competent Authority | Full description, type, root cause, applied mitigations, cross-border impact |

### 4.3 Reporting Readiness

| Capability | Status |
|------------|--------|
| 24-hour reporting capability established | ☐ |
| CSIRT contact details known | ☐ |
| Incident classification procedure documented | ☐ |
| Reporting templates prepared | ☐ |
| Crisis communication plan in place | ☐ |

## 5. Supply Chain Security (Article 21(2)(d) + Article 22)

| Requirement | Status | Notes |
|-------------|--------|-------|
| ICT supplier inventory maintained | ☐ | |
| Supplier cybersecurity clauses in contracts | ☐ | |
| Critical supplier risk assessments conducted | ☐ | |
| ENISA ICT supply chain risk framework applied | ☐ | |
| EU coordinated risk assessment outcomes reviewed | ☐ | |
| 5G network equipment restrictions applied (if applicable) | ☐ | |

## 6. Business Continuity (Article 21(2)(c))

| Requirement | Status |
|-------------|--------|
| Business continuity plan documented | ☐ |
| Backup and restoration procedures tested | ☐ |
| Crisis management procedures defined | ☐ |
| Recovery time objectives (RTO) defined | ☐ |
| Recovery point objectives (RPO) defined | ☐ |

## 7. Member State Specifics

### 7.1 France (ANSSI)

[Complete if operating under French jurisdiction]

| Requirement | Status |
|-------------|--------|
| ANSSI sector-specific requirements (OIV/OSE) applied | ☐ |
| CERT-FR incident notification portal registered | ☐ |
| LPM Article 22 obligations assessed (if OIV) | ☐ |
| ANSSI SecNumCloud evaluated for cloud services | ☐ |

### 7.2 Other Member States

[Add sections for each relevant jurisdiction]

## 8. Gap Analysis and Roadmap

| Gap | Article | Priority | Owner | Deadline |
|-----|---------|---------|-------|---------|
| [Gap description] | [Art. XX] | 🔴 High | [Role] | [Date] |

---

**Generated by**: ArcKit `/arckit.eu-nis2` command
**Generated on**: [YYYY-MM-DD]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
