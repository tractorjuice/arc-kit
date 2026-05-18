# Austrian Data Protection Assessment (DSG / DSGVO)

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit.at-dsgvo`
>
> ⚠️ **Community-contributed** — not yet validated against current Datenschutzbehörde (DSB) / EU regulatory text. Verify all citations before relying on output. Items marked `[NEEDS VERIFICATION]` require confirmation by an Austrian data protection practitioner.

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time to _partials/document-control-uk.md or _partials/document-control-uae.md based on plugin userConfig classification_scheme + governance_framework. See _partials/RENDERING.md (when present). -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit.at-dsgvo` | [PENDING] | [PENDING] |

## Executive Summary

| # | Area | Status | Key Findings |
|---|------|--------|-------------|
| 1 | AT DSG Regulatory Framework | [Mapped / Partial / Gap] | [Summary] |
| 2 | Lawful Basis (Art. 6 / Art. 9) | [Identified / Unclear / Gap] | [Summary] |
| 3 | Consent Management | [Compliant / Partial / N/A] | [Summary] |
| 4 | DPIA Screening (Art. 35 + DSB Blacklist) | [Required / Not required] | [Summary] |
| 5 | Image/Video Processing (§§12–13 DSG) | [Compliant / Non-compliant / Partial / N/A] | [Summary] |
| 6 | Health Data / ELGA | [Compliant / Partial / N/A] | [Summary] |
| 7 | Employee Data / §96/§96a ArbVG | [Compliant / Gap / N/A] | [Summary] |
| 8 | Scientific Research (§§7–8 DSG) | [Compliant / Partial / N/A] | [Summary] |
| 9 | Data Subject Rights | [Ready / Gap] | [Summary] |
| 10 | DPO Registration and ROPA | [Registered / Pending / N/A] | [Summary] |
| 11 | Breach Notification Readiness | [Ready / Gap] | [Summary] |
| 12 | TOMs (Art. 32) | [Adequate / Partial / Gap] | [Summary] |
| 13 | Data Processing Agreements (Art. 28) | [Complete / Partial / Gap] | [Summary] |
| 14 | International Transfers | [Compliant / Gap / N/A] | [Summary] |
| 15 | Cookies / Tracking (§165 TKG 2021) | [Compliant / Partial / N/A] | [Summary] |
| 16 | DSB Enforcement Self-Assessment | [Low risk / Medium / High] | [Summary] |
| 17 | Sanctions Exposure | [Low / Medium / High / Critical] | [Summary] |

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

## 2. Lawful Basis Assessment (Art. 6 / Art. 9 GDPR)

### Rechtsgrundlage nach Art. 6 Abs 1 DSGVO

| Basis | Lit. | Selected | Justification |
|-------|------|----------|---------------|
| Consent (Einwilligung) | (a) | ☐ | |
| Contract performance (Vertragserfüllung) | (b) | ☐ | |
| Legal obligation (Rechtliche Verpflichtung) | (c) | ☐ | Cite specific AT law: |
| Vital interests (Lebenswichtige Interessen) | (d) | ☐ | |
| Public interest / official authority (Öffentliches Interesse) | (e) | ☐ | Cite specific AT law: |
| Legitimate interests (Berechtigte Interessen) | (f) | ☐ | Not available for public authorities (Art. 6(1) last sentence) |

### Special Category Data (Art. 9 Abs 2 DSGVO)

*Complete only if special category data (Art. 9(1)) is processed.*

| Condition | Lit. | Selected | Notes |
|-----------|------|----------|-------|
| Explicit consent | (a) | ☐ | |
| Employment / social security law | (b) | ☐ | ArbVG / ASVG reference: |
| Vital interests (incapacity) | (c) | ☐ | |
| Foundation / non-profit | (d) | ☐ | |
| Manifestly public | (e) | ☐ | |
| Legal claims | (f) | ☐ | |
| Substantial public interest | (g) | ☐ | §7 DSG / specific AT law: |
| Health / social care | (h) | ☐ | ELGA-G / GTelG reference: |
| Public health | (i) | ☐ | |
| Archiving / research / statistics | (j) | ☐ | §7 Abs 2–3 DSG: |

---

## 3. Consent Management (where Art. 6(1)(a) or Art. 9(2)(a) applies)

*Complete only if consent is the lawful basis for any processing activity.*

| Control | Status | Notes |
|---------|--------|-------|
| Consent is freely given (no bundling, no imbalance of power) | [Yes / No / N/A] | |
| Consent is specific (per purpose, not blanket) | [Yes / No / N/A] | |
| Consent is informed (plain language, purpose disclosed) | [Yes / No / N/A] | |
| Consent is unambiguous (clear affirmative action) | [Yes / No / N/A] | |
| Withdrawal mechanism equally easy as giving consent | [Yes / No / N/A] | |
| Consent records stored with timestamp and version | [Yes / No / N/A] | |
| Re-consent triggered on purpose change | [Yes / No / N/A] | |
| Employee consent: power imbalance addressed (Art. 7 + WP259) | [Yes / No / N/A] | |

---

## 4. DPIA Screening (Art. 35 GDPR + DSB Blacklist)

*Tick all criteria that apply. If ≥2 are ticked, a full DPIA is required (EDPB WP248 rev.01).*

| # | Criterion (EDPB / DSB) | Applies |
|---|------------------------|--------|
| 1 | Evaluation or scoring (including profiling) | ☐ |
| 2 | Automated decision-making with legal/similar effect | ☐ |
| 3 | Systematic monitoring | ☐ |
| 4 | Sensitive data or data of highly personal nature | ☐ |
| 5 | Data processed on large scale | ☐ |
| 6 | Matching or combining datasets | ☐ |
| 7 | Data concerning vulnerable data subjects | ☐ |
| 8 | Innovative use or applying new technology | ☐ |
| 9 | Processing preventing data subjects from exercising a right | ☐ |

| DSB Blacklist match (DSFA-V BGBl. II Nr. 278/2018) | [Yes / No] | Specify: |

**Result:** [DPIA required / DPIA not required / Borderline — consult DPO]

---

## 5. §§12–13 DSG — Image and Video Processing

*Complete only if CCTV, bodycams, doorbell cameras, visitor imagery, AI-enabled video analytics, or any other Bildverarbeitung is in scope. Otherwise mark N/A.*

| Control | Status | Evidence / Gap |
|---------|--------|----------------|
| Lawful ground under §12 DSG (not only Art. 6 GDPR) | [Yes / No / N/A] | |
| §13 DSG labelling (Kennzeichnung) — visible notice with controller | [Yes / No / N/A] | |
| Retention ≤ 72 hours unless documented justified exception | [Yes / No / N/A] | |
| No covert imaging unless narrow statutory ground applies | [Yes / No / N/A] | |
| DSB-Praxis und EDPB-Leitlinien 3/2019 zur Bildverarbeitung berücksichtigt | [Yes / No / N/A] | |
| Access control to recordings (who, when, audited) | [Yes / No / N/A] | |

---

## 6. Health Data and ELGA

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

## 7. Employee Data (Arbeitnehmerdatenschutz)

*Complete only if employees' personal data are processed in systems capable of monitoring, evaluating, or profiling employees.*

| Control | Status | Evidence / Gap |
|---------|--------|----------------|
| ArbVG §96 Abs 1 Z 3 / §96a Betriebsvereinbarung in place | [Yes / No / N/A] | |
| Works council (Betriebsrat) informed / consulted | [Yes / No / N/A] | |
| Transparency notice to employees | [Yes / No / N/A] | |
| Necessity and proportionality documented | [Yes / No / N/A] | |
| Prohibition on use for discipline beyond scope of BV | [Yes / No / N/A] | |

---

## 8. Scientific Research (§§7–8 DSG)

*Complete only if processing is for scientific or statistical research purposes under Art. 89 GDPR.*

| Item | Status | Notes |
|------|--------|-------|
| Research purpose documented | [Yes / No / N/A] | |
| Pseudonymisation in place | [Yes / No / N/A] | |
| §7 Abs 3 DSG Genehmigung der DSB beantragt | [Yes / No / N/A] | |
| Re-identification risk assessed | [Yes / No / N/A] | |
| Publication plan compliant with Art. 89 GDPR | [Yes / No / N/A] | |

---

## 9. Data Subject Rights (Austrian enforcement)

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

## 10. DPO Registration and ROPA

**DPO Mandatory Assessment (Art. 37(1) GDPR):**

| Criterion | Applies | Justification |
|-----------|---------|---------------|
| (a) Processing by public authority/body | [Yes / No] | |
| (b) Core activities require regular, systematic monitoring at large scale | [Yes / No] | |
| (c) Core activities involve large-scale processing of special categories / criminal data | [Yes / No] | |

→ If any = Yes → DPO is mandatory

| Item | Status | Notes |
|------|--------|-------|
| DPO mandatory determination | [Mandatory / Voluntary / Not required] | Reason: |
| DPO contact notified to DSB (dsb.gv.at portal) | [Yes / No / N/A] | |
| Verarbeitungsverzeichnis (Art. 30) — depth aligned with DSB expectation | [Yes / Partial / Gap] | |

---

## 11. Breach Notification to DSB

| Item | Status | Evidence / Gap |
|------|--------|----------------|
| Process for 72-hour DSB notification | [Ready / Gap] | |
| Individual notification for high-risk breach | [Ready / Gap] | |
| Breach register maintained | [Yes / No] | |
| Tabletop exercise carried out in last 12 months | [Yes / No] | |

---

## 12. Technical and Organisational Measures (Art. 32 GDPR)

| Measure Category | Art. 32 Ref | Status | Evidence |
|-----------------|-------------|--------|----------|
| Pseudonymisation and encryption | Abs 1 lit a | ☐ | |
| Confidentiality of processing systems | Abs 1 lit b | ☐ | |
| Integrity of processing systems | Abs 1 lit b | ☐ | |
| Availability and resilience | Abs 1 lit b | ☐ | |
| Ability to restore availability after incident | Abs 1 lit c | ☐ | |
| Regular testing / assessment of effectiveness | Abs 1 lit d | ☐ | |
| Processor obligations contractually passed down | Abs 4 | ☐ | |

---

## 13. Data Processing Agreements (Art. 28 GDPR)

| Processor | Purpose | Location | AVV in place | Sub-processors disclosed | Last audit |
|-----------|---------|----------|--------------|--------------------------|------------|
| | | | [Yes / No] | [Yes / No] | |

**Key checks:**

- Art. 28(3) mandatory clauses included
- Processor's TOMs documented (Art. 32)
- Sub-processor chain approved (Art. 28(2)/(4))
- Termination / data return clause present

---

## 14. International Transfers (Post-Schrems II)

| Item | Status | Notes |
|------|--------|-------|
| Transfer mapping complete (countries, recipients, categories) | [Yes / No] | |
| TIA conducted per EDPB Recommendations 01/2020 | [Yes / No] | |
| SCCs + supplementary measures documented | [Yes / No / N/A] | |
| EU-US Data Privacy Framework reliance assessed | [Yes / No / N/A] | |

---

## 15. Cookies and Tracking (§165 TKG 2021)

*Complete only if the system uses cookies, fingerprinting, pixels, or similar tracking technologies.*

| Control | Status | Notes |
|---------|--------|-------|
| §165 TKG 2021 consent required for non-essential cookies | [Yes / No / N/A] | |
| Consent freely given, specific, informed (no dark patterns) | [Yes / No / N/A] | |
| Opt-out equally easy as opt-in | [Yes / No / N/A] | |
| Cookie banner blocks tracking until consent | [Yes / No / N/A] | |
| Cookie categories documented (essential / analytics / marketing) | [Yes / No / N/A] | |
| Retention periods per cookie documented | [Yes / No / N/A] | |
| Third-party tracking disclosed in privacy notice | [Yes / No / N/A] | |

---

## 16. DSB Enforcement Priority Self-Assessment

*Map the processing against recent DSB enforcement themes. Reference the most recent DSB Datenschutzbericht (Tätigkeitsbericht) and published DSB decisions (available via RIS).*

| Theme | Applicable | Residual Risk |
|-------|-----------|---------------|
| Cookie consent / web tracking | [Yes / No] | [Low / Medium / High] |
| CCTV retention overshoot | [Yes / No] | [Low / Medium / High] |
| Employee monitoring without BV | [Yes / No] | [Low / Medium / High] |
| SAR response timeliness | [Yes / No] | [Low / Medium / High] |
| Lawful ground for HR data | [Yes / No] | [Low / Medium / High] |
| International transfers (esp. USA) | [Yes / No] | [Low / Medium / High] |

---

## 17. Sanctions Exposure (Art. 83 GDPR + §62 DSG)

| Violation Category | Legal Basis | Maximum Penalty |
|-------------------|-------------|-----------------|
| GDPR Art. 83(4) — controller/processor obligations | Art. 83(4) | €10M / 2% turnover |
| GDPR Art. 83(5) — principles, rights, transfers | Art. 83(5) | €20M / 4% turnover |
| §62 DSG — Austrian-specific violations | §62 DSG | €50,000 |
| §109 TKG 2021 — telecom/cookie violations | §109 TKG | €37,000 |

**Current residual risk rating:** [Low / Medium / High / Critical]

---

## 18. Gap Analysis and Action Plan

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
