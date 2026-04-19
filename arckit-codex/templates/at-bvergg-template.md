# Austrian Public Procurement Documentation (BVergG 2018)

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit.at-bvergg`
>
> ⚠️ **Community-contributed** — not yet validated against current Bundesvergabegesetz 2018 text or applicable EU threshold regulation. Verify all citations before relying on output. Items marked `[NEEDS VERIFICATION]` must be confirmed against current EU thresholds and §12 BVergG 2018.

## Document Control

| Field | Value |
|-------|-------|
| **Document ID** | ARC-[PROJECT_ID]-BVERGG-v[VERSION] |
| **Document Type** | Austrian Public Procurement Documentation |
| **Project** | [PROJECT_NAME] (Project [PROJECT_ID]) |
| **Classification** | [OFFICIAL] |
| **Status** | DRAFT |
| **Version** | [VERSION] |
| **Created Date** | [YYYY-MM-DD] |
| **Last Modified** | [YYYY-MM-DD] |
| **Review Cycle** | Per procurement |
| **Next Review Date** | [YYYY-MM-DD] |
| **Owner** | [Vergabestelle / Procurement Officer] |
| **Reviewed By** | [Vergabejurist / PENDING] |
| **Approved By** | [PENDING] |
| **Distribution** | [DISTRIBUTION_LIST] |
| **Contracting Authority Type** | [Klassischer Sektor / Sektorenauftraggeber / Subventioniert §4] |
| **Threshold Tier** | [Direktvergabe / Unterschwellen / Oberschwellen] |
| **Auftragswert (excl. VAT)** | € [value] |
| **Selected Procedure** | [Offen / Nicht-offen / Verhandlung m.B. / Verhandlung o.B. / Dialog / Innovationspartnerschaft] |

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit.at-bvergg` | [PENDING] | [PENDING] |

## Executive Summary

| Item | Value |
|------|-------|
| Contracting Authority | [Name] |
| Object | [One-line description] |
| Auftragswert (excl. VAT) | € [value] |
| Threshold Tier | [Tier] |
| Procedure | [Procedure] |
| Publication | [ANKÖ / ANKÖ + TED] |
| Planned Publication Date | [YYYY-MM-DD] |
| Award Target Date | [YYYY-MM-DD] |

---

## 1. Contracting Authority and Procedure

### 1.1 Auftraggeber

| Item | Value |
|------|-------|
| Legal name | [Name] |
| Legal basis (public law / §4 subsidy / Sektor) | [Ground] |
| UID / Register number | [ID] |
| Contact (Vergabestelle) | [Contact] |

### 1.2 Procedure Selection

| Item | Value |
|------|-------|
| Procedure | [e.g. Offenes Verfahren] |
| Legal basis (BVergG 2018 §) | [§ reference] |
| Justification | [Brief justification, especially for non-open procedures] |
| Framework agreement (Rahmenvereinbarung) | [Yes / No] |
| Lots (Teillose) | [Yes / No] |

### 1.3 Threshold Determination `[NEEDS VERIFICATION]`

| Item | Value |
|------|-------|
| Value aggregation applied (§13 BVergG) | [Yes / No] |
| Exception applied (§9 BVergG, in-house, interinstitutional) | [Yes / No — which] |
| Current applicable threshold | € [value] |
| Tier result | [Tier] |

---

## 2. Leistungsbeschreibung (Requirements Statement)

### 2.1 Functional Scope

| ID | Requirement | Source REQ | Mandatory / Desired |
|----|-------------|-----------|---------------------|
| LB-F-001 | | FR-xxx | |

### 2.2 Non-Functional Scope

| Category | Requirement | Source NFR | Acceptance |
|----------|-------------|-----------|-----------|
| Performance | | NFR-P-xxx | |
| Availability | | NFR-AV-xxx | |
| Security | | NFR-SEC-xxx | |
| Accessibility (WAG / WCAG) `[NEEDS VERIFICATION]` | | NFR-UX-xxx | |

### 2.3 Integration and Data

| Item | Requirement |
|------|-------------|
| Integrations | INT-xxx → [External system] |
| Data categories | [Personal / Special category / Health / Classified] |
| Data location / sovereignty | [AT / EU / EEA / Other] |
| Open standards | [e.g. OGC, OAS, W3C] |

---

## 3. Eignung (Suitability Criteria)

### 3.1 Ausschlussgründe (§78 BVergG)

| Ground | Verification method |
|--------|---------------------|
| Clean criminal record — company and key persons | Eigenerklärung + extract |
| Tax and social security compliance | Finanzamt / ÖGK confirmation |
| No insolvency proceedings | Ediktsdatei |

### 3.2 Wirtschaftliche / Finanzielle Leistungsfähigkeit

| Criterion | Threshold | Evidence |
|-----------|-----------|----------|
| Annual turnover | ≥ € [value] | Abschluss |
| Professional liability insurance | ≥ € [value] | Policy |

### 3.3 Technische Leistungsfähigkeit

| Criterion | Minimum | Evidence |
|-----------|---------|----------|
| Comparable references (last 3 years) | [N] | Referenzliste |
| Certifications (ISO 27001, ISO 9001, ISO 22301) | [Which — if proportionate] | Certificate |
| Key personnel qualifications | [Roles + CV] | CV |

---

## 4. Zuschlagskriterien (Award Criteria)

**Principle**: Bestbieterprinzip (best price-performance ratio) unless lowest-price is explicitly justified.

| Criterion | Weight (%) | Scoring method |
|-----------|-----------|----------------|
| Price | | Linear / formula |
| Quality | | Scored by panel |
| Sustainability | | |
| Innovation | | |
| Vendor-lock-in / exit | | |
| **Total** | **100** | |

---

## 5. Vertragliche Regelungen

### 5.1 Service Level Agreement

| SLA Item | Target | Measurement | Remedy |
|----------|--------|-------------|--------|
| Availability | [%] | [Method] | [Vertragsstrafe / credit] |
| Response time | [ms / s] | [Method] | [Remedy] |
| Incident MTTR | [hrs] | [Method] | [Remedy] |

### 5.2 Data Protection (Auftragsverarbeitung)

| Clause | Required | Status |
|--------|---------|--------|
| Art. 28 GDPR processor contract | [Yes / No / N/A] | |
| DSG-specific addendum | [Yes / No / N/A] | |
| Sub-processor approval mechanism | [Yes / No / N/A] | |
| International transfer safeguards | [Yes / No / N/A] | |

### 5.3 NISG Supply-Chain Clauses

*Complete only if contracting authority is Essential / Important under NISG.*

| Clause | Required | Status |
|--------|---------|--------|
| Right to audit supplier security | | |
| Incident notification timeline (to CA) | | |
| SBOM / patching obligations | | |
| Vulnerability disclosure | | |
| Exit / data return obligations | | |

### 5.4 IP, Open Source, and Exit

| Item | Position |
|------|---------|
| IP ownership | [Customer / Supplier / Joint] |
| Open-source licences permitted | [Policy reference] |
| Exit and transition | [Obligations] |
| Data return format | [e.g. standard JSON + SQL dump] |

### 5.5 Governing Law

Austrian law. Jurisdiction: [Gerichtsstand].

---

## 6. Publication and Timeline

| Milestone | Date | Notes |
|-----------|------|-------|
| ANKÖ publication | [YYYY-MM-DD] | |
| TED publication (if Oberschwellen) | [YYYY-MM-DD] | |
| Bidder questions window close | [YYYY-MM-DD] | |
| Q&A published | [YYYY-MM-DD] | |
| Angebotsfrist end | [YYYY-MM-DD] | Min. [days] per §87 BVergG |
| Angebotsöffnung | [YYYY-MM-DD HH:MM] | |
| Evaluation complete | [YYYY-MM-DD] | |
| Zuschlagsentscheidung notified | [YYYY-MM-DD] | |
| Stillhaltefrist end | [YYYY-MM-DD] | Min. 10/15 days per BVergG |
| Zuschlagserteilung | [YYYY-MM-DD] | |

---

## 7. Review and Remedies (BVergG Book 4)

| Item | Value |
|------|-------|
| Review venue | [BVwG (federal) / LVwG (Land)] |
| Application fees (Pauschalgebühren) | [reference BVergG § + current Verordnung] |
| Interim measures (einstweilige Verfügung) available | Yes |
| Documentation requirements for defence | [As per §50 BVergG record-keeping] |

---

## 8. Vergabeakt

| Item | Content |
|------|---------|
| Entscheidungsgrundlagen | Decisions + justifications |
| Eignungsprüfung protocols | |
| Angebotsauswertung scores | |
| Zuschlagsentscheidung reasoning | |
| Korrespondenz mit Bewerbern | |
| Retention period | [per §49 BVergG] |

### Annexes

- A. Eigenerklärung / ESPD templates
- B. Technical specifications
- C. Draft contract
- D. Price schedule (Preisblatt)
- E. Evaluation sheet

---

## External References

### Document Register

| DOC_ID | Source | Description |
|--------|--------|-------------|
| | | |

### Citations

| Citation | Used In | Source |
|----------|---------|--------|
| | | |

---

**Generated by**: ArcKit `/arckit.at-bvergg` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
