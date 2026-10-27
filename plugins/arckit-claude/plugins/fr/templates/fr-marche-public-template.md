# French Public Procurement File (Dossier de Consultation)

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit-fr:fr-marche-public`
>
> ⚠️ **Community-contributed** — not yet validated against current ANSSI/CNIL/EU regulatory text. Verify all citations before relying on output.

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time per _partials/RENDERING.md. -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit-fr:fr-marche-public` | [PENDING] | [PENDING] |

---

## 1. Threshold Analysis and Recommended Procedure

| Parameter | Value |
|-----------|-------|
| Estimated total value (excl. VAT) | [Amount] |
| Applicable threshold | [< €60k supplies/services or < €100k works / MAPA below the formal threshold / ≥ €140k (central government) or ≥ €216k (other authorities) supplies/services / ≥ €5,404k works] |
| Recommended procedure | [No publicity or competition required / Adapted procedure (MAPA) / Open call for tenders / Restricted call for tenders] |
| Publication on BOAMP | [Yes / BOAMP or JAL (MAPA from €90k) / No] |
| Publication on JOUE (EU Official Journal) | [Yes / No] |
| Minimum consultation period | [X days] |

### 1.1 State Cloud Doctrine (Doctrine cloud de l'État)

[Complete if cloud services are involved — Circular 6282/SG of 5 July 2021]

- [ ] Internal government cloud (cloud de l'État) evaluated
- [ ] Trusted commercial cloud (SecNumCloud-qualified offer) evaluated
- [ ] Justification for chosen option documented

## 2. Requirements Statement

### 2.1 Subject of the Contract

[Concise description of the goods or services to be procured]

### 2.2 Functional Requirements (from /arckit:requirements)

[Extract FR-xxx requirements relevant to procurement scope]

### 2.3 Technical Requirements

| Requirement | Priority | Verification criterion |
|-------------|----------|----------------------|
| [NFR-xxx] [Description] | Mandatory / Desirable | [How verified] |

### 2.4 Sovereignty and Security Requirements

| Requirement | Reference framework | Mandatory |
|-------------|--------------------|----|
| Data hosting in France / EU | State Cloud Doctrine | Yes |
| SecNumCloud qualification (if sensitive data) | ANSSI | Depends on classification |
| HDS certification (if health data) | ANS | Yes |
| RGS v2.0 compliance | ANSSI | Yes |
| RGI v2.0 compliance (interoperability) | DINUM | Yes |
| RGAA 4.1 accessibility | DINUM | Yes (public digital services) |
| RGESN ecodesign | Arcep / Arcom | Recommended (non-binding unless written into the contract) |

## 3. Award Criteria

### 3.1 Weighting

| Criterion | Weighting | Sub-criteria |
|-----------|-----------|-------------|
| Technical value | 50% | Functional fit (20%), Technical architecture (15%), Security/sovereignty (15%) |
| Environmental characteristics | 10% | [e.g. energy use of the service, hosting efficiency, equipment lifetime, RGESN-based ecodesign commitments] |
| Price | 30% | Total cost of ownership over [X] years |
| Execution conditions | 10% | Timelines, reversibility, support |

> Total must equal 100%. Adjust sub-criteria to match project priorities. At least one criterion must take account of the environmental characteristics of the offer (CCP L2152-7, since August 2026); do not remove the environmental criterion without replacing it.

### 3.2 Technical Scoring Grid

| Sub-criterion | Score 0 | Score 1 | Score 2 | Score 3 |
|--------------|---------|---------|---------|---------|
| Functional fit | No coverage | Partial | Substantial | Full coverage |
| Security/sovereignty | No compliance | Partial | Substantial | Full SecNumCloud/RGS |
| Environmental characteristics | No commitment | Partial | Substantial, measured | Measured, with targets and reporting |

### 3.3 Environmental and Social Requirements (Code de la commande publique)

Applies to procurements whose consultation is launched, or whose contract notice is sent for publication, from August 2026 (loi n° 2021-1104 Climat et Résilience, art. 35; décret n° 2022-767).

| Requirement | Reference | Included |
|-------------|-----------|----------|
| At least one award criterion takes account of the environmental characteristics of the offer (no single price-only criterion) | CCP L2152-7, R2152-7 | [Yes / No] |
| At least one execution condition takes account of environmental considerations | CCP L2112-2 | [Yes / No — describe the condition] |
| Social or employment execution condition (contracts at or above the formal-procedure thresholds), or the L2112-2-1 exception relied on and recorded | CCP L2112-2-1 | [Yes / Exception: ... / N/A — below threshold] |

## 4. Security and Sovereignty Clauses

### 4.1 Security Annex (mandatory)

The services must comply with:

- RGS v2.0 (security accreditation of the information system before go-live)
- State Information Systems Security Policy (PSSIE)
- ANSSI IT hygiene guide (42 measures)
- [If OIV/OSE] Applicable sector-specific orders under LPM/NIS

### 4.2 Data Localisation Clause

All data processed under this contract must be hosted and processed exclusively within the territory of the European Union. The contractor must guarantee that no extra-European law (Cloud Act, FISA, etc.) can allow access to the data without prior agreement from the French authorities.

### 4.3 Reversibility Clause

In accordance with the DINUM reversibility circular:

- Reversibility plan provided before project start
- Data export in open formats (RGI-compliant)
- Migration period: [X] months
- Exit costs: included in contract price

### 4.4 Open Source Clause

[If applicable per State Cloud Doctrine Point 3]
Specific developments carried out under this contract must be published as open source under [MIT / EUPL] licence unless otherwise justified.

### 4.5 GDPR / Data Processing Agreement

The contractor must provide a Data Processing Agreement (DPA) compliant with GDPR Article 28 covering:

- Processing purposes and data categories
- Sub-processor authorisation and list
- Security measures (Article 32)
- Data subject rights assistance
- Return/deletion of data on contract end

## 5. UGAP Catalogue — Available Framework Agreements

[Check current catalogue at ugap.fr before finalising — framework agreements are updated regularly]

| Category | UGAP Framework | Relevant lot | Listed providers |
|----------|---------------|-------------|-----------------|
| Sovereign cloud IaaS | [UGAP ref] | [Lot] | Outscale, OVHcloud, NumSpot |
| Application development | [UGAP ref] | [Lot] | [Listed IT service firms] |
| Cybersecurity services | [UGAP ref] | [Lot] | [PRIS-qualified providers] |
| Managed services | [UGAP ref] | [Lot] | [Providers] |

## 6. Indicative Timeline

```mermaid
gantt
    title Procurement Timeline
    dateFormat  YYYY-MM-DD
    section Preparation
    Procurement file drafting    :a1, 2024-01-01, 20d
    Legal validation             :a2, after a1, 5d
    section Publication
    BOAMP/JOUE publication       :b1, after a2, 1d
    Consultation period          :b2, after b1, 40d
    section Award
    Tender evaluation            :c1, after b2, 15d
    Award notification           :c2, after c1, 5d
    section Contracting
    Contract signature           :d1, after c2, 10d
```

## 7. ANSSI-Qualified Security Provider Selection

[Complete if the procurement includes cybersecurity services — audit, incident response, detection/SOC. Otherwise state "N/A — no cybersecurity services in scope".]

| ANSSI Qualification | Scope | When to Require | Required in this procurement |
|--------------------|-------|-----------------|------------------------------|
| PASSI (Prestataires d'Audit de la Sécurité des SI) | Penetration testing, technical audits | Any IS security audit or pentest | [Yes / No] |
| PRIS (Prestataires de Réponse aux Incidents de Sécurité) | Incident response, forensics | IR retainer or OIV/OSE obligation | [Yes / No] |
| PDIS (Prestataires de Détection des Incidents de Sécurité) | SOC, threat detection, SIEM management | Managed detection services | [Yes / No] |
| PACS (Prestataires d'Accompagnement et de Conseil en Sécurité des SI) | Security consulting: homologation support, IS risk management, secure architecture, cyber-crisis preparation | Consulting for homologation, risk analysis, security architecture or crisis preparation | [Yes / No] |

- Qualification requirement written into the technical specifications (CCTP), not only as a selection criterion: [Yes / No]
- Qualification validity to be verified against the ANSSI list at contract signature: [Yes / No]

## 8. Digital State Doctrine Compliance

### 8.1 DINUM Checklist

- [ ] Cloud-first policy applied (Circular 6282/SG)
- [ ] RGI v2.0 interoperability — open formats specified
- [ ] RGAA 4.1 accessibility — mandatory clause included for public services
- [ ] RGESN ecodesign — criteria included
- [ ] Open source — publication policy defined
- [ ] Personal data — DPA/GDPR required from contractor

### 8.2 PSSIE and RGS

- Target security level: [RGS * / ** / ***]
- Security accreditation planned before go-live: [Yes / No]
- Accreditation authority: [Name / role]

---

**Generated by**: ArcKit `/arckit-fr:fr-marche-public` command
**Generated on**: [YYYY-MM-DD]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
