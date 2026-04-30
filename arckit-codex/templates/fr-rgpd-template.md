# French GDPR / CNIL Compliance Assessment

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit.fr-rgpd`
>
> ⚠️ **Community-contributed** — not yet validated against current ANSSI/CNIL/EU regulatory text. Verify all citations before relying on output.

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time to _partials/document-control-uk.md or _partials/document-control-uae.md based on plugin userConfig classification_scheme + governance_framework. See _partials/RENDERING.md (when present). -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit.fr-rgpd` | [PENDING] | [PENDING] |

## Executive Summary

| Area | Status | Key Findings |
|------|--------|-------------|
| CNIL Cookie Guidelines | [Compliant / Non-compliant / Partial] | [Summary] |
| HDS Certification | [Required / Not required / In progress] | [Summary] |
| DPO Registration | [Registered / Pending / N/A] | [Summary] |
| DPIA Requirement | [Required / Not required] | [Summary] |
| Breach Notification | [Process in place / Gap] | [Summary] |

---

## 1. CNIL Regulatory Framework

### 1.1 Applicable Texts

| Text | Reference | Applicability |
|------|-----------|--------------|
| GDPR | Regulation (EU) 2016/679 | [Yes / Partial] |
| French Data Protection Act (Loi Informatique et Libertés) | Loi 78-17 amended 2018 | [Yes / No] |
| CNIL Reference Frameworks (Référentiels) | CNIL website | [List applicable] |
| CNIL Cookie Guidelines | Délibération 2020-091 | [Yes / No] |
| Age of digital consent (15 years in France) | Art. 45 Loi 78-17 | [Yes / No — children in scope?] |

### 1.2 CNIL Reference Frameworks

| Framework | Sector / Use Case | Applicable | Status |
|-----------|------------------|-----------|--------|
| Référentiel Santé | Health data processing | ☐ | |
| Référentiel RH | HR/employee data | ☐ | |
| Référentiel Éducation | Education sector | ☐ | |
| Référentiel Assurance | Insurance sector | ☐ | |
| Référentiel Banque | Banking / financial | ☐ | |
| Référentiel IA | AI systems processing personal data | ☐ | |

## 2. Cookies and Trackers

### 2.1 CNIL Cookie Guidelines (Délibération 2020-091)

| Requirement | Status | Notes |
|-------------|--------|-------|
| Consent collected before any non-essential cookies | ☐ | |
| Cookie banner clearly distinguishes Accept / Reject | ☐ | |
| Reject option as prominent as Accept | ☐ | |
| No pre-ticked consent boxes | ☐ | |
| Consent withdrawal as easy as consent giving | ☐ | |
| Consent valid for 6 months maximum | ☐ | |
| List of cookies and their purposes disclosed | ☐ | |
| Consent proof stored and auditable | ☐ | |
| Strictly necessary cookies do not require consent | ☐ | |

### 2.2 Cookie Categories

| Category | Examples | Consent Required | Status |
|----------|---------|-----------------|--------|
| Strictly necessary | Session management, security | No | |
| Analytics/audience measurement | Matomo (exempt if properly configured), Google Analytics | Yes (or exemption conditions) | |
| Social media | Share buttons, embedded content | Yes | |
| Advertising | Targeting, retargeting | Yes | |
| Functional | Preferences, language | Depends | |

> **Note**: Matomo Analytics is exempt from consent if configured per CNIL conditions (no cross-site tracking, anonymised IPs, opt-out available).

## 3. Health Data (Données de Santé)

### 3.1 HDS Certification Requirements

[Complete if health data is processed]

| Requirement | Reference | Status |
|-------------|-----------|--------|
| HDS certification required for hosting | ANS / Loi 2016-41 | ☐ |
| Certified HDS host identified | ANS HDS list | ☐ |
| HDS certification scope covers the service | Hébergeur agreement | ☐ |
| ANSSI SecNumCloud alignment (if sensitive health data) | CNIL / ANS joint guidance | ☐ |

### 3.2 ANS Security Framework

| Requirement | Status |
|-------------|--------|
| ANS health IS security framework reviewed | ☐ |
| Health data access audit trail in place | ☐ |
| Health data breach notification to CNIL within 72h | ☐ |
| Data Processing Agreement with HDS host in place | ☐ |

## 4. Data Protection Officer (DPO)

### 4.1 DPO Requirement Assessment

| Entity Type | DPO Mandatory? |
|-------------|---------------|
| Public authority or public body | Yes (GDPR Art. 37(1)(a)) |
| Large-scale systematic monitoring | Yes (GDPR Art. 37(1)(b)) |
| Large-scale special category data | Yes (GDPR Art. 37(1)(c)) |
| Other | Recommended |

**DPO Mandatory for this project**: ☐ Yes ☐ No

### 4.2 DPO Registration (CNIL)

| Requirement | Status |
|-------------|--------|
| DPO designated | ☐ |
| DPO registered with CNIL | ☐ |
| CNIL registration number obtained | [Registration number] |
| DPO contact details published on service | ☐ |

## 5. Data Subject Rights (French Context)

| Right | GDPR Article | French Specifics | Implementation Status |
|-------|-------------|-----------------|----------------------|
| Right of access (SAR) | Art. 15 | 30-day response deadline | ☐ |
| Right to rectification | Art. 16 | — | ☐ |
| Right to erasure | Art. 17 | — | ☐ |
| Right to restriction | Art. 18 | — | ☐ |
| Right to portability | Art. 20 | — | ☐ |
| Right to object | Art. 21 | — | ☐ |
| Rights re: automated decisions | Art. 22 | — | ☐ |
| Right re: death (post-mortem) | Art. 85 Loi 78-17 | **French specificity** — digital legacy rights | ☐ |

> **French specificity**: France's Loi Informatique et Libertés (Art. 85) grants specific rights over personal data after death (directives numériques posthumes) — not covered by GDPR itself.

## 6. Children's Data

### 6.1 Age of Digital Consent

| Jurisdiction | Age of Consent | Verification Mechanism |
|-------------|---------------|----------------------|
| France | **15 years** (Art. 45 Loi 78-17) | Parental consent below 15 required |
| EU (GDPR default) | 16 years | Member states may lower to 13 |

| Requirement | Status |
|-------------|--------|
| Age verification mechanism implemented | ☐ |
| Parental consent flow for under-15s | ☐ |
| Child-friendly privacy notice available | ☐ |
| Data minimisation applied for children | ☐ |

## 7. CNIL Prior Authorisation and Declarations

### 7.1 Processing Requiring Prior CNIL Consultation (Pre-GDPR remnants)

| Processing Type | Requirement | Status |
|----------------|-------------|--------|
| Biometric data processing | Prior DPIA + possible CNIL consultation | ☐ |
| Genetic data processing | DPIA required | ☐ |
| Large-scale criminal conviction data | DPIA + CNIL consultation | ☐ |
| Surveillance / CCTV | DPIA if systematic monitoring | ☐ |

## 8. Breach Notification

| Requirement | Deadline | Recipient | Status |
|-------------|---------|-----------|--------|
| Breach notification to CNIL | **72 hours** from awareness | CNIL (via notifications.cnil.fr) | ☐ |
| Notification to affected individuals | Without undue delay | Individuals (if high risk) | ☐ |
| Breach documentation | Ongoing | Internal breach register | ☐ |

## 9. International Transfers

| Transfer | Destination | Safeguard | Status |
|----------|------------|-----------|--------|
| [Data type] | [Country] | [SCC / BCR / Adequacy / None] | ☐ |

> **Post-Schrems II**: Standard Contractual Clauses (SCCs) must be supplemented by a Transfer Impact Assessment (TIA) when transferring to non-adequate countries. CNIL has issued guidance on TIAs aligned with EDPB Recommendations 01/2020.

## 10. Gap Analysis and Action Plan

| Gap | Reference | Priority | Owner | Deadline |
|-----|-----------|---------|-------|---------|
| [Gap description] | [CNIL / GDPR / Loi 78-17] | 🔴 High | [Role] | [Date] |

---

**Generated by**: ArcKit `/arckit.fr-rgpd` command
**Generated on**: [YYYY-MM-DD]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
