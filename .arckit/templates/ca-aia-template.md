# Canada Algorithmic Impact Assessment

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit:ca-aia`

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time per _partials/RENDERING.md. -->
<!-- Classification line MUST be: -->
<!-- | Classification | UNCLASSIFIED / Protected A / Protected B / Protected C / CONFIDENTIAL / SECRET / TOP SECRET | -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit:ca-aia` | [PENDING] | [PENDING] |

## Executive Summary

[Two to three paragraphs describing the automated decision-making system, the decisions automated or assisted, the computed Impact Level (I, II, III, or IV), the headline mitigations triggered by that level (peer review tier, transparency notice, recourse), and the residual algorithmic-risk posture. Note any open peer-review nominations or pending reassessment items.]

## System Description

| Item | Value |
|------|-------|
| Department / agency | [name] |
| System / service name | [name] |
| Purpose | [what the system does in plain language; what outcome it is intended to produce] |
| Decisions automated | [the specific decisions automated or assisted — eligibility / triage / scoring / classification / routing / etc.] |
| Affected populations | [Canadian residents / federal employees / clients of programme X / etc.] |
| Training data lineage | [sources, vintage, licensing — high-level summary; full detail in Training-Data Provenance section] |
| Vendor / model provenance | [supplier, model family, open-source vs proprietary, hosting jurisdiction] |
| Owner | [accountable role] |
| Operator | [internal team / contractor / processor running the model] |
| Accountable executive | [ADM / DG / equivalent] |
| Lifecycle stage | [Concept / Design / Build / Pilot / Live / Modification] |

## Levels I–IV Questionnaire Scoring

The Impact Level is determined by score across the six dimensions of the TBS *Algorithmic Impact Assessment Tool*. Each dimension is scored with evidence cited; the overall Impact Level (I, II, III, or IV) is computed from the totals per the Directive's threshold matrix.

### Dimension 1 — Project

| Question | Score | Evidence |
|----------|-------|----------|
| [project-scope question — e.g. is the project line-of-business or experimental?] | [0–N] | [reference / cite] |
| [project-scope question] | [0–N] | [reference / cite] |
| **Sub-total** | **[N]** | |

### Dimension 2 — System

| Question | Score | Evidence |
|----------|-------|----------|
| [system-design question — e.g. degree of autonomy, integration with downstream systems] | [0–N] | [reference / cite] |
| [system-design question] | [0–N] | [reference / cite] |
| **Sub-total** | **[N]** | |

### Dimension 3 — Algorithm

| Question | Score | Evidence |
|----------|-------|----------|
| [algorithm question — model family, explainability, transparency] | [0–N] | [reference / cite] |
| [algorithm question] | [0–N] | [reference / cite] |
| **Sub-total** | **[N]** | |

### Dimension 4 — Decision

| Question | Score | Evidence |
|----------|-------|----------|
| [decision question — reversibility, stakes, frequency] | [0–N] | [reference / cite] |
| [decision question] | [0–N] | [reference / cite] |
| **Sub-total** | **[N]** | |

### Dimension 5 — Impact

| Question | Score | Evidence |
|----------|-------|----------|
| [impact question — affected population size, vulnerability, severity] | [0–N] | [reference / cite] |
| [impact question] | [0–N] | [reference / cite] |
| **Sub-total** | **[N]** | |

### Dimension 6 — Data

| Question | Score | Evidence |
|----------|-------|----------|
| [data question — sensitivity, provenance, consent posture] | [0–N] | [reference / cite] |
| [data question] | [0–N] | [reference / cite] |
| **Sub-total** | **[N]** | |

### Computed Level

| Item | Value |
|------|-------|
| Raw score (sum of sub-totals) | [N] |
| Mitigation score (controls applied) | [N] |
| Net score | [N] |
| **Computed Impact Level** | **[I / II / III / IV]** |
| Threshold matrix reference | TBS Directive on ADM, current version |

> The questionnaire output is the source of truth. Self-declaring a lower level to avoid peer-review obligations is a Directive breach.

## Per-Level Mitigation Requirements

Mitigations below reflect the Directive's mandated requirements for the computed Level. Mark items not required at the computed Level as `N/A`; do not omit rows — reviewers expect to see the full schedule.

| Mitigation | Required at Level | Implementation status | Owner |
|------------|-------------------|-----------------------|-------|
| Peer review — internal | II (and above) | [Planned / In-progress / Complete] | [Architecture lead] |
| Peer review — external (academic / civil society) | III, IV | [Reviewer named / Reviewer pending / N/A at Level I–II] | [Architecture lead] |
| Transparency notice (bilingual per `ca-ola`) | All Levels | [Published / Drafted / Pending] | [Service owner] |
| Pre-launch publication (≥30 days before launch) | III, IV | [Date scheduled / Pending / N/A at Level I–II] | [Service owner] |
| Human-in-the-loop design — override paths | II, III, IV | [Designed / Implemented / N/A at Level I] | [Service designer] |
| Human-in-the-loop design — escalation thresholds | II, III, IV | [Designed / Implemented / N/A at Level I] | [Service designer] |
| Quality assurance — training/test data validation | All Levels | [Complete / In-progress] | [Data steward] |
| Quality assurance — ongoing monitoring & drift detection | All Levels | [Operational / Planned] | [Operator] |
| Recourse mechanism — appeal to a human decision-maker | All Levels | [Designed / Implemented] | [Service owner] |
| Recourse mechanism — explanation rights | All Levels | [Designed / Implemented] | [Service owner] |
| AIA publication on Open Government portal | All Levels (default) | [Published / Pending / Exempt — cross-ref `ca-soia`] | [ATIP coordinator] |

## Algorithmic Risks Register

| Risk | Type | Likelihood | Impact | Mitigation | Residual |
|------|------|------------|--------|------------|----------|
| Selection bias from non-representative training data | Bias | [Low / Med / High] | [Low / Med / High] | [data audit; representativeness sampling; targeted top-up data collection] | [Low / Med / High] |
| Label bias from historical decision patterns | Bias | [Low / Med / High] | [Low / Med / High] | [label audit; relabel sample with diverse reviewers; documented label rubric] | [Low / Med / High] |
| Concept drift — population shifts over time | Drift | [Low / Med / High] | [Low / Med / High] | [drift-detection metrics; refresh-cadence trigger; rollback plan] | [Low / Med / High] |
| Data drift — input distribution shift | Drift | [Low / Med / High] | [Low / Med / High] | [input-distribution monitoring; alert thresholds; retraining trigger] | [Low / Med / High] |
| Proxy variables for protected grounds | Fairness | [Low / Med / High] | [Low / Med / High] | [feature audit; proxy-detection tests; remove or constrain proxies] | [Low / Med / High] |
| Distributional unfairness across protected grounds | Fairness | [Low / Med / High] | [Low / Med / High] | [disaggregated performance metrics; fairness-constrained training; published fairness report] | [Low / Med / High] |
| Contestability gap — affected individual cannot challenge a decision | Contestability | [Low / Med / High] | [Low / Med / High] | [recourse mechanism; explanation rights; published appeal SLA] | [Low / Med / High] |
| Severity — irreversible adverse decision on a vulnerable individual | Severity | [Low / Med / High] | [Low / Med / High] | [human-in-the-loop for high-stakes branches; mandatory review threshold] | [Low / Med / High] |

Cross-reference `risk` for the project-level continuation of these entries.

## Training-Data Provenance

| Dataset | Source | Licence | Refresh cadence | Drift trigger | Steward |
|---------|--------|---------|-----------------|---------------|---------|
| [training set name] | [internal programme / partner agency / open data / vendor] | [licence terms — including downstream use restrictions] | [annual / quarterly / event-driven] | [metric and threshold that triggers refresh] | [data steward] |
| [validation set name] | [source] | [licence] | [cadence] | [drift trigger] | [steward] |
| [test set name] | [source] | [licence] | [cadence] | [drift trigger] | [steward] |
| [synthetic data — if used] | [generator / process] | [licence / provenance note] | [cadence] | [drift trigger] | [steward] |

> Where a dataset is sourced from a vendor, capture the contractual data-rights position and exit-portability of the dataset as part of the licence column.

## Disclosure Plan

| Audience | Channel | Cadence | Bilingual? | Notes |
|----------|---------|---------|------------|-------|
| Public — affected individuals | Transparency notice on service page | At launch and on material change | Yes — per `ca-ola` | Plain-language explanation of decisions automated and recourse path |
| Public — open-government audience | Open Government portal — AIA publication | At launch (≥30 days pre-launch for Level III/IV) and on reassessment | Yes — per `ca-ola` | Default is open publication; severance only on specific exemption |
| Internal — peer reviewers | Direct sharing of AIA + supporting evidence | At assessment and on reassessment | Working language | Peer review tier set by computed Level |
| Internal — Departmental Security Officer | Security review channel | Pre-launch | Working language | Severance review for Protected B/C content |
| OPC (where personal information is processed) | OPC notification channel | Pre-launch (≥30 days) | Working language | Cross-reference `ca-pia` |
| National-security exemption holders (if applicable) | Restricted briefing | As required | Working language | Cross-reference `ca-soia`; document the exemption rationale |

## Reassessment Triggers

| Trigger | Action | SLA |
|---------|--------|-----|
| Material change to training data | Re-run questionnaire; update Provenance table; re-publish AIA | Before next deployment |
| Model retraining or replacement | Re-run questionnaire; re-trigger peer review at the appropriate tier | Before next deployment |
| Decision-boundary change (new outcomes; widened population) | Re-run questionnaire; re-trigger peer review; update transparency notice | Before next deployment |
| Operating-environment change (new jurisdiction; new partner agency; new processor) | Re-run questionnaire; reassess cross-border posture (cross-ref `ca-cloud-residency`) | Before change goes live |
| Incident — bias finding, drift breach, contestability complaint upheld | Targeted reassessment of affected dimensions; mitigation plan | Within 30 days of confirmed incident |
| Periodic reassessment | Full questionnaire re-run | Annual (default); accelerated for Level III/IV |

## Open Items

| Item | Owner | Due | Status |
|------|-------|-----|--------|
| Resolve open questionnaire scores marked `<TBC>` | [Architecture lead] | [YYYY-MM-DD] | [Open / Closed] |
| Nominate external peer reviewers (Level III/IV) | [Architecture lead] | [YYYY-MM-DD] | [Open / Closed / N/A] |
| Publish AIA on Open Government portal | [ATIP coordinator] | [YYYY-MM-DD] | [Open / Closed] |
| Publish bilingual transparency notice | [Service owner] | [YYYY-MM-DD] | [Open / Closed] |
| Confirm recourse mechanism implementation and SLA | [Service owner] | [YYYY-MM-DD] | [Open / Closed] |
| Trigger `ca-pia` if personal information is in scope | [ATIP coordinator] | [YYYY-MM-DD] | [Open / Closed] |
| Trigger `ca-soia` if national-security exemption claimed | [Privacy Counsel] | [YYYY-MM-DD] | [Open / Closed / N/A] |

## External References

### Document Register

| Doc ID | Title | URL | Verified date |
|--------|-------|-----|---------------|
| CA-TBS-ADM | TBS Directive on Automated Decision-Making | <https://www.tbs-sct.canada.ca/pol/doc-eng.aspx?id=32592> | [YYYY-MM-DD] |
| CA-AIA-TOOL | Algorithmic Impact Assessment Tool (TBS questionnaire) | <https://open.canada.ca/en/algorithmic-impact-assessment> | [YYYY-MM-DD] |
| CA-OLA | Official Languages Act | <https://laws-lois.justice.gc.ca/eng/acts/O-3.01/> | [YYYY-MM-DD] |
| CA-PRIV-ACT | Privacy Act (R.S.C., 1985, c. P-21) | <https://laws-lois.justice.gc.ca/eng/acts/P-21/> | [YYYY-MM-DD] |

### Citations

| Citation | Doc ID | Section | Used in |
|----------|--------|---------|---------|
| [ADM-1] | CA-TBS-ADM | Levels I–IV threshold matrix | Levels I–IV Questionnaire Scoring |
| [ADM-2] | CA-TBS-ADM | Peer review obligations by Level | Per-Level Mitigation Requirements |
| [ADM-3] | CA-TBS-ADM | Notification requirement (≥30 days pre-launch for Level III/IV) | Per-Level Mitigation Requirements |
| [ADM-4] | CA-TBS-ADM | Human-in-the-loop and recourse requirements | Per-Level Mitigation Requirements |
| [ADM-5] | CA-TBS-ADM | Open-publication default | Disclosure Plan |
| [ADM-6] | CA-TBS-ADM | Reassessment on material change | Reassessment Triggers |
| [AIA-TOOL-1] | CA-AIA-TOOL | Six-dimension questionnaire | Levels I–IV Questionnaire Scoring |
| [OLA-1] | CA-OLA | Bilingualism for public-facing services | Disclosure Plan |

### Unreferenced Documents

[List any documents read during generation but not cited, or "None".]
