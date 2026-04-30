# DINUM Standards Compliance Assessment

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit.fr-dinum`
>
> ⚠️ **Community-contributed** — not yet validated against current ANSSI/CNIL/EU regulatory text. Verify all citations before relying on output.

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time to _partials/document-control-uk.md or _partials/document-control-uae.md based on plugin userConfig classification_scheme + governance_framework. See _partials/RENDERING.md (when present). -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit.fr-dinum` | [PENDING] | [PENDING] |

## Executive Summary

| Referential | Compliance Level | Critical Gaps | Next Review |
|-------------|----------------|--------------|-------------|
| State Cloud Doctrine | [Full / Partial / Non-compliant] | [Count] | [Date] |
| RGI v2.0 | [Full / Partial / Non-compliant] | [Count] | [Date] |
| RGAA 4.1 | [X%] | [Count] | [Date] |
| RGESN | [X%] | [Count] | [Date] |
| RGS v2.0 | [Full / Partial / Non-compliant] | [Count] | [Date] |

---

## 1. State Cloud Doctrine (Doctrine cloud de l'État — Circular 6264/SG)

The French cloud-first policy mandates evaluation in order:

1. Internal government cloud (cloud de l'État — Trusted Digital Space)
2. Trusted commercial cloud (SecNumCloud-qualified offers)
3. Standard commercial cloud (justified exception only)

| Step | Assessment | Decision |
|------|-----------|---------|
| Internal government cloud evaluated? | ☐ Yes ☐ No | [Available / Not available] |
| SecNumCloud offer evaluated? | ☐ Yes ☐ No | [Available / Not available / Selected] |
| Standard cloud justified? | ☐ Yes ☐ No | [Justification if applicable] |
| Data sensitivity classification | [Non-sensitive / Sensitive / Highly sensitive] | [Drives cloud tier] |

## 2. RGI v2.0 — Interoperability

### 2.1 Formats and Standards

| Category | Recommended Standard (RGI) | Compliant |
|---------|--------------------------|---------|
| Document exchange | ODF, PDF/A | ☐ |
| Structured data | XML, JSON, CSV | ☐ |
| APIs | REST/JSON, OpenAPI 3.x | ☐ |
| Geographic data | GML, GeoJSON, WMS/WFS | ☐ |
| Identity federation | OpenID Connect, SAML 2.0 | ☐ |
| Electronic signature | XAdES, PAdES, CAdES | ☐ |
| Messaging | Standard email (SMTP/IMAP), MIME | ☐ |

### 2.2 Interoperability Principles

- [ ] Open standards preferred over proprietary formats
- [ ] Published API documentation
- [ ] Semantic interoperability (reference data aligned with national referentiels)
- [ ] Technical interoperability tested across browsers/OS
- [ ] Reversibility guaranteed (no vendor lock-in for public data)

## 3. RGAA 4.1 — Digital Accessibility

### 3.1 Legal Obligations

| Entity | Legal Basis | Obligation |
|--------|-----------|-----------|
| State, EPAs, EICs > 250 agents | Loi 2005-102 + Décret 2019-768 | RGAA compliance mandatory |
| Large private companies (> 250 employees + > €250M revenue) | Loi 2005-102 amended 2016 | RGAA compliance mandatory |
| Others | — | Recommended |

### 3.2 RGAA 4.1 Assessment Areas (106 criteria, 13 themes)

| Theme | Criteria Count | Status | Critical Gaps |
|-------|--------------|--------|--------------|
| 1. Images | 9 | ☐ | |
| 2. Frames | 4 | ☐ | |
| 3. Colour | 9 | ☐ | |
| 4. Multimedia | 13 | ☐ | |
| 5. Tables | 11 | ☐ | |
| 6. Links | 13 | ☐ | |
| 7. Scripts | 8 | ☐ | |
| 8. Mandatory elements | 8 | ☐ | |
| 9. Information structure | 12 | ☐ | |
| 10. Presentation of information | 12 | ☐ | |
| 11. Forms | 15 | ☐ | |
| 12. Navigation | 6 | ☐ | |
| 13. Consultation | 9 | ☐ | |

**Compliance rate**: [X]% — [Full / Partial / Non-compliant]

### 3.3 Mandatory Publication Requirements

- [ ] Accessibility statement (Déclaration d'accessibilité) published on service
- [ ] Compliance rate declared (full / partial / non-compliant)
- [ ] Exemptions documented
- [ ] Feedback mechanism for accessibility issues
- [ ] Multi-year accessibility scheme (schéma pluriannuel) published

## 4. RGESN — Digital Service Ecodesign

### 4.1 RGESN 2024 — 79 Criteria across 8 Categories

| Category | Criteria Count | Status | Key Gaps |
|---------|--------------|--------|---------|
| 1. Strategy | 9 | ☐ | |
| 2. Specifications | 19 | ☐ | |
| 3. Architecture | 8 | ☐ | |
| 4. UX/UI | 12 | ☐ | |
| 5. Content | 9 | ☐ | |
| 6. Frontend | 11 | ☐ | |
| 7. Backend | 8 | ☐ | |
| 8. Hosting | 3 | ☐ | |

### 4.2 Hosting Sustainability

| Requirement | Status |
|-------------|--------|
| Hosting provider PUE declared | ☐ |
| Renewable energy share declared | ☐ |
| French Green Cloud label considered | ☐ |
| Hardware lifecycle (refurbished servers considered) | ☐ |

## 5. RGS v2.0 — Information Systems Security

### 5.1 RGS Security Levels

| Level | Description | Applicable To |
|-------|-------------|--------------|
| RGS * | Basic — standard public service | Most citizen-facing services |
| RGS ** | Enhanced — sensitive data | Health, justice, benefits |
| RGS *** | Strong — very sensitive | Revenue, defence adjacents |

**Target level for this service**: [RGS * / ** / ***]

### 5.2 Key RGS Requirements

| Requirement | RGS Level | Status |
|-------------|----------|--------|
| Security accreditation (Homologation) before go-live | All | ☐ |
| State IS Security Policy (PSSIE) alignment | All | ☐ |
| Cryptographic algorithm compliance (RGS Annex B) | All | ☐ |
| Authentication strength (RGS Annex A) | Level-dependent | ☐ |
| Electronic certificate from qualified TSP | Level-dependent | ☐ |

### 5.3 Security Accreditation Process

1. Risk analysis (ISO 27005 or EBIOS Risk Manager)
2. Security architecture review
3. Technical security testing
4. Security accreditation file (Homologation dossier) submitted to Accreditation Authority (Autorité d'Homologation)
5. Accreditation decision (with or without residual risks)
6. Annual review or after significant change

## 6. FranceConnect / ProConnect Integration

[Complete if applicable — identity federation for public services]

| Requirement | Status |
|-------------|--------|
| FranceConnect integration for citizen authentication | ☐ |
| ProConnect for agent (civil servant) authentication | ☐ |
| eIDAS Level of Assurance (LoA) required | [Low / Substantial / High] |
| ANSSI eIDAS notification status of IDP verified | ☐ |

## 7. DSFR — French State Design System

[Complete if citizen-facing digital service]

| Requirement | Status |
|-------------|--------|
| DSFR components used | ☐ |
| Marianne font applied | ☐ |
| République Française branding guidelines followed | ☐ |
| Colour palette from DSFR | ☐ |
| Accessibility already integrated in DSFR components leveraged | ☐ |

## 8. Gap Analysis and Action Plan

| Gap | Referential | Priority | Owner | Deadline |
|-----|------------|---------|-------|---------|
| [Gap description] | [RGI/RGAA/RGESN/RGS] | 🔴 High | [Role] | [Date] |

---

**Generated by**: ArcKit `/arckit.fr-dinum` command
**Generated on**: [YYYY-MM-DD]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
