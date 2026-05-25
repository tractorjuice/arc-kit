# UK MDR + EU MDR Software-as-Medical-Device Classification — [PRODUCT_NAME]

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit:uk-mdr-classification`

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time per _partials/RENDERING.md. -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---|---|---|---|---|---|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit:uk-mdr-classification` command | PENDING | PENDING |

---

## Statutory currency

This assessment is pinned to:

- UK MDR 2002 as amended through the Medical Devices (Amendment) (Great Britain) Regulations 2024 (and any subsequent published amendments at the assessment date below)
- EU MDR 2017/745 (current text)
- MHRA Software and AI as a Medical Device Programme — work packages published as of the assessment date below

**Assessment date**: [YYYY-MM-DD]

> The MHRA AIaMD Programme is publishing work packages incrementally. Re-run `/arckit:uk-mdr-classification` when material MHRA updates are published. UK MDR reform is in train — verify the legal text against legislation.gov.uk before reliance.

---

## Executive Summary

| Field | Value |
|---|---|
| **Is this product a medical device?** | [Yes / No / Borderline — see §1] |
| **UK MDR 2002 class (if yes)** | [I / IIa / IIb / III / N/A] |
| **EU MDR 2017/745 class (if yes)** | [I / IIa / IIb / III / N/A] |
| **Marking pathway** | [UKCA only / UKCA + UKNI / UKCA + UKNI + CE / CE only via NI / N/A] |
| **Conformity-assessment route** | [Self-declaration / Approved Body / Notified Body / N/A] |
| **Quality Management System expectation** | [ISO 13485 / N/A] |
| **Standards alignment expected** | [ISO 14971, IEC 62304, IEC 62366-1, ISO/IEC 27001, others] |

[One paragraph: classification rationale in plain English, what this means for product placement, recommended next regulatory step.]

---

## 1. Scope determination — is this a medical device?

### 1.1 Intended-purpose statement (verbatim from upstream artefacts)

> [Quote the intended-purpose / intended-use statement from the project's REQ / SAFETY-CASE / similar. This is the load-bearing input. Small wording changes materially change the classification.]

### 1.2 UK MDR 2002 regulation 2 definition test

The product is a medical device if it is intended by the manufacturer to be used for human beings for the purpose of:

- diagnosis, prevention, monitoring, treatment or alleviation of disease
- diagnosis, monitoring, treatment, alleviation of or compensation for an injury or handicap
- investigation, replacement, or modification of the anatomy or of a physiological process
- control of conception

…and which does not achieve its principal intended action by pharmacological, immunological or metabolic means.

| Test point | Applies? | Notes |
|---|---|---|
| Diagnosis / prevention / monitoring / treatment / alleviation of disease | [Yes / No] | |
| Diagnosis / monitoring / treatment / alleviation / compensation for injury / handicap | [Yes / No] | |
| Investigation / replacement / modification of anatomy or physiological process | [Yes / No] | |
| Control of conception | [Yes / No] | |
| Principal action NOT pharmacological / immunological / metabolic | [Yes / No] | |

### 1.3 MHRA stand-alone software decision tree

| Decision point | Outcome |
|---|---|
| Does the software perform an action on data different from storage, archival, communication, simple search? | [Yes / No] |
| Is the action performed for the benefit of an individual patient? | [Yes / No] |
| If both Yes → likely medical device (continue to §2). If either No → likely not a medical device (skip to §5). | |

### 1.4 Borderline rationale (if applicable)

[If the case is borderline, document the rationale here, citing the MHRA Borderline Manual examples that are closest. Recommend MHRA pre-submission borderline review. State explicitly that the assessment proceeds on the assumption [Yes / No], and the consequences if MHRA reaches a different conclusion.]

### 1.5 Determination

> **Determination**: This product **[IS / IS NOT / IS BORDERLINE]** a medical device under UK MDR 2002 and EU MDR 2017/745.

If **IS NOT**: skip to §5 (Not-a-medical-device closure).
If **IS** or **IS BORDERLINE**: continue.

---

## 2. UK MDR 2002 classification

### 2.1 Classification rules applied

[Identify which classification rules from UK MDR 2002 Schedule 9 (as amended) apply. For SaMD, this is typically driven by the corresponding rule on stand-alone software. State the rule + reasoning.]

### 2.2 Determination

> **UK MDR 2002 Class**: [I / IIa / IIb / III]

### 2.3 Subclass flags

| Flag | Applicable? | Rationale |
|---|---|---|
| Sterile | [Yes / No / N/A for SaMD] | |
| Measuring function | [Yes / No] | |
| Reusable surgical instrument | [Yes / No / N/A for SaMD] | |

### 2.4 Self-certification eligibility

| Eligibility | Status | Notes |
|---|---|---|
| Self-certification permitted (Class I, non-sterile, non-measuring) | [Yes / No] | |
| If self-certified, manufacturer registration with MHRA required | [Yes / N/A] | |

---

## 3. EU MDR 2017/745 classification (for NI placement and EU market access)

### 3.1 Rule 11 application (software)

[Apply Rule 11 with explicit reasoning. Walk through the decision points: does the software provide information used to take decisions with diagnostic / therapeutic purposes? Could those decisions cause death / irreversible deterioration → Class III. Could they cause serious deterioration or surgical intervention → Class IIb. Otherwise → Class IIa. Or: software intended to monitor physiological processes → Class IIa, except monitoring of vital physiological parameters where variations could cause immediate danger → Class IIb. All other software → Class I.]

### 3.2 Other rules considered

[If any other classification rule applies (e.g. rule for software intended to drive or influence active device, rule for software involving liquids in contact with human body), state the rule and outcome.]

### 3.3 Determination

> **EU MDR 2017/745 Class**: [I / IIa / IIb / III]

### 3.4 Divergence from UK MDR

| | UK MDR 2002 | EU MDR 2017/745 |
|---|---|---|
| Class | [Class] | [Class] |
| Conformity route | [Route] | [Route] |
| Marking | UKCA | CE (or UKNI for NI) |

[If the two classifications diverge, explain why and which is more conservative.]

---

## 4. Marking pathway

| Pathway | Required? | Conditions |
|---|---|---|
| **UKCA marking** (Great Britain placement) | [Yes / No] | MHRA registration; Approved Body involvement if Class IIa+ |
| **UKNI marking** (Northern Ireland placement of GB-manufactured) | [Yes / No / N/A] | Notified Body involvement required; UKNI alone not valid in rest of EU |
| **CE marking** (NI placement under Windsor Framework + EU market access) | [Yes / No] | Notified Body in NI or EU; EUDAMED registration |
| **Recognition of CE marking in GB** (transitional) | [Applicable / Not applicable] | Transitional arrangements have moved repeatedly — verify against MHRA |

### 4.1 Recommended routing

[State the practical routing for this product given its intended markets. E.g. "UKCA + CE for full UK + EU coverage", "UKCA only for GB-only product", "UKCA + UKNI for UK-only product including NI".]

### 4.2 Registration obligations

| Obligation | Status | Notes |
|---|---|---|
| MHRA Device Online Registration System (DORS) | [In place / PENDING] | |
| EUDAMED registration (if CE-marked) | [In place / PENDING] | |
| UK Responsible Person (if non-UK manufacturer) | [Appointed / PENDING / N/A] | |
| EU Authorised Representative (if non-EU manufacturer with CE) | [Appointed / PENDING / N/A] | |

---

## 5. Conformity-assessment route

| Class | UK route | EU route |
|---|---|---|
| Class I (non-sterile, non-measuring) | Self-declaration | Self-declaration |
| Class I (sterile / measuring / reusable surgical) | Approved Body | Notified Body |
| Class IIa | Approved Body | Notified Body |
| Class IIb | Approved Body | Notified Body |
| Class III | Approved Body | Notified Body |

| Conformity item | Status | Notes |
|---|---|---|
| Technical documentation prepared | [PASS / FAIL / PENDING] | Annex II / Annex III equivalents |
| Quality Management System (ISO 13485) | [PASS / FAIL / PENDING] | Required for non-Class I; signposted not generated here |
| Clinical evaluation | [PASS / FAIL / PENDING] | Literature route / clinical investigation / PMCF |
| Declaration of Conformity | [PASS / FAIL / PENDING] | |

### Not-a-medical-device closure (only if §1 reached IS NOT)

[Provide the explicit reasoning that this product is not a medical device, citing the MHRA Borderline Manual example closest to this product. Identify the responsible person at the manufacturer who signs off this determination. Record that the manufacturer will not place this product as a medical device and will not represent it as such in marketing or instructions.]

---

## 6. MHRA SaMD / AIaMD Programme considerations

| MHRA AIaMD Programme Work Package | Applicable to this product? | Status / commitment |
|---|---|---|
| WP1 Software | [Yes / N/A] | |
| WP2 Risk classification | [Yes / N/A] | |
| WP3 Innovative devices | [Yes / N/A] | |
| WP4 Cyber Security | [Yes / N/A] | |
| WP6 AIaMD | [Yes / N/A — if AI/ML] | |
| WP9 Cyber Security (AI specific) | [Yes / N/A] | |
| WP11 Best Practice for Manufacturers | [Yes / N/A] | |

[Update WP list and status from the MHRA SaMD/AIaMD page at assessment date; the programme is publishing incrementally.]

---

## 7. Standards alignment

| Standard | Applicable? | Status | Notes |
|---|---|---|---|
| ISO 14971 (risk management) | Yes | [PASS / FAIL / PENDING] | Cross-reference DCB0129 hazard log at `clinical-safety/HAZARD-LOG.md` |
| IEC 62304 (software lifecycle) | Yes | [PASS / FAIL / PENDING] | Software safety class A / B / C from hazard analysis: [class] |
| ISO 13485 (QMS) | [If Class IIa+ or chosen for Class I] | [PASS / FAIL / PENDING] | Signposted only |
| IEC 62366-1 (usability engineering) | [If safety-critical UI] | [PASS / FAIL / PENDING] | |
| ISO/IEC 27001 (information security) | Yes | [PASS / FAIL / PENDING] | Cross-reference `/arckit:secure` output |
| ISO/IEC 25010 (software quality) | Recommended | [PASS / FAIL / PENDING] | |
| ISO/IEC TR 24028 (AI trustworthiness) | [If AIaMD] | [PASS / FAIL / PENDING] | |
| BS EN 82304-1 (health software) | Recommended | [PASS / FAIL / PENDING] | |

---

## 8. Post-market obligations

### 8.1 Post-market surveillance (PMS) plan

[Outline the PMS plan: data sources, cadence, escalation triggers, reporting cadence. Required for all classes; depth scales with class.]

### 8.2 Vigilance reporting

| Event | Reporting timeline | Recipient |
|---|---|---|
| Serious incident (UK) | Within 10 days (15 for non-serious public health concern) | MHRA |
| Serious incident (EU) | Within 15 days (10 for serious public-health threat; 2 for death/serious deterioration) | Competent Authority via EUDAMED |
| Field Safety Corrective Action (FSCA) | Without undue delay | MHRA / Competent Authority |

### 8.3 Periodic Safety Update Report (PSUR)

| Class | Cadence |
|---|---|
| Class III | Annual |
| Class IIa / IIb | Biennial (Class IIa, on request); biennial (Class IIb) — verify against EU MDR Article 86 |
| Class I | Not required (but PMS report under EU MDR Article 85 is) |

### 8.4 Trend reporting

[State the trend-reporting approach for statistically significant increases in non-serious incidents.]

### 8.5 AIaMD substantial-change handling (if AI)

[For AI products, the line between "expected adaptation" and "substantial change requiring reassessment" is regulator-defined. State the threshold, the monitoring approach, and the change-control process.]

---

## 9. Substantial change triggers

| Trigger | Action | Notes |
|---|---|---|
| Change of intended purpose | Reassess classification | Material risk of class change |
| New clinical indication | Reassess classification and clinical evaluation | |
| Change of risk profile | Reassess risk file (ISO 14971) and clinical evaluation | |
| Change of intended-user population | Reassess usability evaluation and clinical evaluation | |
| Change of intended patient population | Reassess clinical evaluation | |
| Change of operating principle (e.g. rule-based → ML) | Reassess software safety class and AIaMD applicability | |

---

## 10. Open regulatory risks

| Risk | Status | Mitigation |
|---|---|---|
| MHRA reform of UK MDR is in flight | Active | Pin assessment date; subscribe to MHRA news; re-run on material change |
| CE-marking recognition in GB has moved repeatedly | Active | Verify against MHRA news at every product release |
| MHRA AIaMD Programme publishing incrementally | Active | Re-run on each new WP publication that may apply |
| Windsor Framework arrangements may change | Monitor | Check NI placement route at each release |

---

## External References

| Doc ID | Title | Source | Used in |
|---|---|---|---|
| UK-MDR-2002 | Medical Devices Regulations 2002 (as amended) | legislation.gov.uk | Throughout |
| EU-MDR-2017-745 | EU MDR 2017/745 | EUR-Lex | §3 |
| MHRA-SAMD | MHRA Guidance on Medical Device Stand-Alone Software | MHRA | §1 |
| MHRA-AIAMD | MHRA Software and AI as a Medical Device Programme | MHRA | §6 |
| MHRA-BORDERLINE | MHRA Borderline Manual | MHRA | §1.4 (if borderline) |
| ISO-14971 | Application of risk management to medical devices | BSI | §7 |
| IEC-62304 | Medical-device software lifecycle | BSI | §7 |
| ISO-13485 | Medical-device QMS | BSI | §7 |
| IEC-62366-1 | Usability engineering for medical devices | BSI | §7 (if applicable) |

---

## Important

This classification assessment is **not** regulatory advice. The output MUST be reviewed and signed off by a qualified Regulatory Affairs Specialist or notified-body / approved-body advisor before being used to make product, procurement, or market-access decisions. Misclassification has material legal, commercial, and patient-safety consequences.

---

**Generated by**: ArcKit `/arckit:uk-mdr-classification` command
**Generated on**: [YYYY-MM-DD]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
