# Austrian Data Protection Assessment (DSG / DSGVO)

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit.at-dsgvo`
>
> ⚠️ **Community-contributed** — not yet validated against current Datenschutzbehörde (DSB) / EU regulatory text. Verify all citations before relying on output. Items marked `[NEEDS VERIFICATION]` require confirmation by an Austrian data protection practitioner.

## Document Control

| Field | Value |
|-------|-------|
| **Document ID** | ARC-[PROJECT_ID]-ATDSG-v[VERSION] |
| **Document Type** | Austrian Data Protection Assessment |
| **Project** | [PROJECT_NAME] (Project [PROJECT_ID]) |
| **Classification** | [OFFICIAL / OFFICIAL-SENSITIVE] |
| **Status** | DRAFT |
| **Version** | [VERSION] |
| **Created Date** | [YYYY-MM-DD] |
| **Last Modified** | [YYYY-MM-DD] |
| **Review Cycle** | Annual |
| **Next Review Date** | [YYYY-MM-DD] |
| **Owner** | [OWNER_NAME_AND_ROLE] |
| **Reviewed By** | [PENDING] |
| **Approved By** | [PENDING] |
| **Distribution** | [DISTRIBUTION_LIST] |
| **DPO (Datenschutzbeauftragter)** | [DPO name and contact] |
| **DSB Notification ID** | [DSB contact notification reference / N/A] |

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit.at-dsgvo` | [PENDING] | [PENDING] |

## Executive Summary

| Area | Status | Key Findings |
|------|--------|-------------|
| Image/Video Processing (§§12–13 DSG) | [Compliant / Non-compliant / Partial / N/A] | [Summary] |
| Health Data / ELGA | [Compliant / Partial / N/A] | [Summary] |
| Employee Data / §96a ArbVG | [Compliant / Gap / N/A] | [Summary] |
| DPO Registration with DSB | [Registered / Pending / N/A] | [Summary] |
| DPIA Requirement | [Required / Not required] | [Summary] |
| Breach Notification Readiness | [Ready / Gap] | [Summary] |

---

## 1. AT DSG Regulatory Framework

### 1.1 Applicable Texts

| Text | Reference | Applicability |
|------|-----------|--------------|
| GDPR | Regulation (EU) 2016/679 | Yes |
| Austrian Data Protection Act (DSG) | BGBl. I Nr. 165/1999 (idgF) | Yes |
| ELGA-Gesetz | BGBl. I Nr. 111/2012 | [Yes / No — health data?] |
| Gesundheitstelematikgesetz (GTelG 2012) | BGBl. I Nr. 111/2012 | [Yes / No] |
| ArbVG §96a (Betriebsvereinbarung) | BGBl. Nr. 22/1974 idgF | [Yes / No — employee monitoring?] |
| Telekommunikationsgesetz (TKG 2021) | BGBl. I Nr. 190/2021 | [Yes / No — electronic communications?] |
| Age of Digital Consent — 14 years | §4(4) DSG | [Yes / No — minors in scope?] |

### 1.2 Authority and Remedies

| Item | Value |
|------|-------|
| Supervisory Authority | Datenschutzbehörde (DSB) — dsb.gv.at |
| Primary Remedy Path | Complaint to DSB |
| Appellate Remedy | Bundesverwaltungsgericht (BVwG) |
| Constitutional/Admin Review | VwGH / VfGH |

---

## 2. §§12–13 DSG — Image and Video Processing

*Complete only if CCTV, bodycams, doorbell cameras, visitor imagery, AI-enabled video analytics, or any other Bildverarbeitung is in scope. Otherwise mark N/A.*

| Control | Status | Evidence / Gap |
|---------|--------|----------------|
| Lawful ground under §12 DSG (not only Art. 6 GDPR) | [Yes / No / N/A] | |
| §13 DSG labelling (Kennzeichnung) — visible notice with controller | [Yes / No / N/A] | |
| Retention ≤ 72 hours unless documented justified exception | [Yes / No / N/A] | |
| No covert imaging unless narrow statutory ground applies | [Yes / No / N/A] | |
| DSB Musterleitfaden Bildverarbeitung followed `[NEEDS VERIFICATION]` | [Yes / No / N/A] | |
| Access control to recordings (who, when, audited) | [Yes / No / N/A] | |

---

## 3. Health Data and ELGA

*Complete only if Gesundheitsdaten (Art. 9 GDPR special category health data) are processed.*

| Item | Status | Notes |
|------|--------|-------|
| Art. 9(2) lawfulness ground selected | [Ground + reference] | |
| §§7–8 DSG research ground considered | [Yes / No / N/A] | |
| ELGA-G interop requirements met | [Yes / No / N/A] | |
| GTelG 2012 telematics compliance | [Yes / No / N/A] | |
| Opt-out handling implemented | [Yes / No / N/A] | |
| DPIA triggered (Art. 35 + DSB Blacklist) | [Required / Not required] | |

---

## 4. Employee Data (Arbeitnehmerdatenschutz)

*Complete only if employees' personal data are processed in systems capable of monitoring, evaluating, or profiling employees.*

| Control | Status | Evidence / Gap |
|---------|--------|----------------|
| ArbVG §96a Betriebsvereinbarung in place `[NEEDS VERIFICATION]` | [Yes / No / N/A] | |
| Works council (Betriebsrat) informed / consulted | [Yes / No / N/A] | |
| Transparency notice to employees | [Yes / No / N/A] | |
| Necessity and proportionality documented | [Yes / No / N/A] | |
| Prohibition on use for discipline beyond scope of BV | [Yes / No / N/A] | |

---

## 5. Scientific Research (§§7–8 DSG)

*Complete only if processing is for scientific or statistical research purposes under Art. 89 GDPR.*

| Item | Status | Notes |
|------|--------|-------|
| Research purpose documented | [Yes / No / N/A] | |
| Pseudonymisation in place | [Yes / No / N/A] | |
| §2d DSG DSB opinion requested `[NEEDS VERIFICATION]` | [Yes / No / N/A] | |
| Re-identification risk assessed | [Yes / No / N/A] | |
| Publication plan compliant with Art. 89 GDPR | [Yes / No / N/A] | |

---

## 6. Data Subject Rights (Austrian enforcement)

| Right | Art. | Response Timeline | Status | Notes |
|-------|------|-------------------|--------|-------|
| Access | 15 | 1 month (extendable to 3) | [Ready / Gap] | |
| Rectification | 16 | 1 month | [Ready / Gap] | |
| Erasure | 17 | 1 month | [Ready / Gap] | |
| Restriction | 18 | 1 month | [Ready / Gap] | |
| Portability | 20 | 1 month | [Ready / Gap] | |
| Object | 21 | 1 month | [Ready / Gap] | |
| No solely-automated decision | 22 | — | [Ready / Gap] | |
| DSB complaint pathway disclosed in privacy notice | — | — | [Yes / No] | |

---

## 7. DPO Registration and ROPA

| Item | Status | Notes |
|------|--------|-------|
| DPO mandatory determination | [Mandatory / Voluntary / Not required] | Reason: |
| DPO contact notified to DSB (dsb.gv.at portal) | [Yes / No / N/A] | |
| Verarbeitungsverzeichnis (Art. 30) — depth aligned with DSB expectation | [Yes / Partial / Gap] | |

---

## 8. Breach Notification to DSB

| Item | Status | Evidence / Gap |
|------|--------|----------------|
| Process for 72-hour DSB notification | [Ready / Gap] | |
| Individual notification for high-risk breach | [Ready / Gap] | |
| Breach register maintained | [Yes / No] | |
| Tabletop exercise carried out in last 12 months | [Yes / No] | |

---

## 9. International Transfers (Post-Schrems II)

| Item | Status | Notes |
|------|--------|-------|
| Transfer mapping complete (countries, recipients, categories) | [Yes / No] | |
| TIA conducted per EDPB Recommendations 01/2020 | [Yes / No] | |
| SCCs + supplementary measures documented | [Yes / No / N/A] | |
| EU-US Data Privacy Framework reliance assessed | [Yes / No / N/A] | |

---

## 10. DSB Enforcement Priority Self-Assessment

*Map the processing against recent DSB enforcement themes. Cite the most recent DSB annual report / published decisions `[NEEDS VERIFICATION]`.*

| Theme | Applicable | Residual Risk |
|-------|-----------|---------------|
| Cookie consent / web tracking | [Yes / No] | [Low / Medium / High] |
| CCTV retention overshoot | [Yes / No] | [Low / Medium / High] |
| Employee monitoring without BV | [Yes / No] | [Low / Medium / High] |
| SAR response timeliness | [Yes / No] | [Low / Medium / High] |
| Lawful ground for HR data | [Yes / No] | [Low / Medium / High] |
| International transfers (esp. USA) | [Yes / No] | [Low / Medium / High] |

---

## 11. Gap Analysis and Action Plan

| # | Gap | Priority | Owner | Target Date | Related Article |
|---|-----|----------|-------|-------------|----------------|
| 1 | | 🔴 / 🟠 / 🟡 | | | |

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

**Generated by**: ArcKit `/arckit.at-dsgvo` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
