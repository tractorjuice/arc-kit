# Public Algorithm Transparency Notice

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit.fr-algorithme-public`
>
> ⚠️ **Community-contributed** — not yet validated against current ANSSI/CNIL/EU regulatory text. Verify all citations before relying on output.

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time to _partials/document-control-uk.md or _partials/document-control-uae.md based on plugin userConfig classification_scheme + governance_framework. See _partials/RENDERING.md (when present). -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit.fr-algorithme-public` | [PENDING] | [PENDING] |

## Algorithm Inventory Summary

| Algorithm | Category | Automated Decision | Affects Citizens | Published |
|-----------|---------|-------------------|-----------------|-----------|
| [Algorithm name] | [Allocation / Scoring / Filtering / Ranking] | [Fully / Partially / No] | [Yes / No] | ☐ |

---

## Legal Framework

### Obligation Scope (Article L311-3-1 CRPA)

Public administrations that issue individual decisions based wholly or in part on algorithmic processing must inform the citizen of:

1. The existence of the algorithmic processing
2. The main parameters of the algorithm
3. The degree of influence each parameter has on the decision

This obligation applies to all **individual decisions** that **significantly affect** the person concerned.

| Scoping Question | Answer | Obligation Triggered |
|-----------------|--------|---------------------|
| Is the entity a public administration? | [Yes / No] | If yes, obligation may apply |
| Does the system produce individual decisions? | [Yes / No] | If yes, continue assessment |
| Are decisions made wholly or partly by algorithm? | [Yes / No] | If yes, obligation applies |
| Do decisions significantly affect citizens? | [Yes / No] | If yes, proactive disclosure required |
| Are there applicable sector-specific exceptions? | [Yes / No] | If yes, document exception |

**Conclusion**: [Obligation applies / Partially applies / Does not apply — with rationale]

---

## Algorithm 1: [Algorithm Name]

> Repeat this section for each algorithm subject to the transparency obligation.

### 1.1 Algorithm Identification

| Field | Value |
|-------|-------|
| Algorithm name | [Name] |
| Algorithm ID | ALGO-[PROJECT_ID]-01 |
| Responsible authority | [Ministry / Directorate / Agency] |
| Contact point | [Email or web form for citizen enquiries] |
| Implementation date | [YYYY-MM-DD] |
| Last updated | [YYYY-MM-DD] |
| Publication URL | [algorithmes.data.gouv.fr/[slug]] |

### 1.2 Purpose and Context

| Field | Description |
|-------|------------|
| Purpose | [What decision or recommendation does this algorithm produce?] |
| Administrative context | [Which administrative process does it support?] |
| Legal basis for the process | [Legislation or regulation authorising the decision] |
| Decision type | [Individual decision / Recommendation / Scoring / Prioritisation] |
| Fully automated? | [Yes — no human review / No — human decision-maker uses algorithm output] |
| Volume | [Approximately N decisions per year] |

### 1.3 Algorithm Description

| Field | Description |
|-------|------------|
| Algorithm type | [Rule-based / Statistical model / Machine learning / Hybrid] |
| Main logic | [Plain-language explanation of the algorithm's core logic — no jargon] |
| Inputs | [List of data inputs: criteria, indicators, scores] |
| Output | [Score / Classification / Decision / Ranked list] |
| Output scale | [0–100 / A–D / Boolean] |

### 1.4 Parameters and Their Influence

Parameters are the variables the algorithm uses when computing its output. This section explains what each parameter is and how much influence it has on the result.

| # | Parameter | Description | Data Source | Weight / Influence | Justification |
|---|-----------|-------------|-------------|-------------------|---------------|
| 1 | [Parameter name] | [What it measures] | [Source] | [High / Medium / Low / N%] | [Why this parameter is relevant] |
| 2 | [Parameter name] | | | | |

**Influence note**: [Explain how parameters combine — e.g. "The final score is the weighted sum of the three parameters above. Parameter 1 carries the most weight because..."]

### 1.5 Data Used

| Data Type | Source | Personal Data | Legal Basis (if personal) | Retention |
|-----------|--------|--------------|--------------------------|-----------|
| [Data type] | [Source system / External DB / User-provided] | [Yes / No] | [Art. 6(1)(e) GDPR — public task] | [Period] |

### 1.6 Citizen Rights and Recourse

| Right | Mechanism |
|-------|-----------|
| Right to explanation | Citizen may request explanation of the algorithmic decision from [contact point] |
| Right to human review | Citizen may request a human decision-maker review the algorithmic output — [process description] |
| Right to contest | Citizen may contest the decision through [administrative appeal / judicial review] |
| Right of access to personal data | GDPR Article 15 — contact [DPO] |
| Response timeline | Administration must respond to explanation requests within [30 days] |

---

## GDPR Intersection

[Complete if the algorithm processes personal data]

| Issue | Assessment |
|-------|-----------|
| Personal data in algorithm inputs | [Yes / No — list data types] |
| Legal basis for processing | [Art. 6(1)(e) — public task / Other] |
| Automated decision-making under GDPR Art. 22 | [Fully automated individual decisions with legal/significant effects → Art. 22 applies] |
| DPIA required (Art. 35) | [Yes / No — systematic processing, profiling, or vulnerable groups trigger DPIA] |
| Data minimisation | [Only data strictly necessary for the decision purpose is used] |
| Profiling | [Algorithm constitutes profiling as defined in GDPR Art. 4(4): Yes / No] |

---

## AI Act Intersection

[Complete if the algorithm uses machine learning or AI techniques]

| Issue | Assessment |
|-------|-----------|
| AI system in scope of EU AI Act | [Yes / No] |
| High-risk category (Annex III) | [e.g. Annex III point 5 — access to essential public services / Other / Not applicable] |
| Transparency obligations (Art. 13) | [If high-risk: technical documentation, instructions for use, logging] |
| Human oversight requirement (Art. 14) | [If high-risk: human review capability required] |
| Recommendation | [Run `/arckit.eu-ai-act` for full AI Act assessment] |

---

## Publication and Maintenance

| Action | Status | Target Date |
|--------|--------|-------------|
| Notice drafted and reviewed by legal team | ☐ | |
| Published on algorithmes.data.gouv.fr | ☐ | |
| Published on the administration's own website | ☐ | |
| Referenced in the administrative decision notification sent to citizens | ☐ | |
| Review process defined for algorithm changes | ☐ | |
| Contact point operational and responsive | ☐ | |

---

**Generated by**: ArcKit `/arckit.fr-algorithme-public` command
**Generated on**: [YYYY-MM-DD]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
