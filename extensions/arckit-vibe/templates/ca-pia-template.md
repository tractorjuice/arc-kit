# Canada Privacy Impact Assessment

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit:ca-pia`

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time per _partials/RENDERING.md. -->
<!-- Classification line MUST be: -->
<!-- | Classification | UNCLASSIFIED / Protected A / Protected B / Protected C / CONFIDENTIAL / SECRET / TOP SECRET | -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit:ca-pia` | [PENDING] | [PENDING] |

## Executive Summary

[Two to three paragraphs describing the programme, the personal information involved, the lawful authority for collection, the headline privacy risks and residual posture, and the OPC notification decision. Note any open lawful-authority items or PIB-registration gaps.]

## Programme / System Description

| Item | Value |
|------|-------|
| Department / agency | [name] |
| Programme / service | [name] |
| Description | [what the system does, in plain language] |
| Owner | [accountable role] |
| Operator | [internal team / contractor / processor] |
| Subject populations | [Canadian residents / federal employees / clients of programme X / etc.] |
| Lifecycle stage | [Concept / Design / Build / Pilot / Live / Modification] |

### Personal Information Lifecycle (textual)

1. **Collect** — channel(s) and source(s) of personal information.
2. **Use** — internal processing, decision-making, analytics.
3. **Disclose** — recipients (internal Canadian gov, other jurisdictions, processors).
4. **Retain** — retention schedule reference and storage jurisdiction.
5. **Dispose** — destruction method and verification.

## Lawful Authority

| Authority cited | Section | Justification | Coverage |
|-----------------|---------|---------------|----------|
| [Enabling statute or regulation] | [section] | [why this collection is necessary for the programme] | [collection / use / disclosure activities covered] |
| Privacy Act | §4 | Collection limited to information that relates directly to an operating programme or activity of the institution | Collection |
| Privacy Act | §5 | Collection directly from the individual where reasonably possible | Collection |
| [TBC] | [TBC] | [If unclear: BLOCKER for OPC notification — resolve before launch] | [TBC] |

> ⚠️ Collection without statutory authority is not lawful. Any `<TBC>` row above is a launch blocker.

## Personal Information Inventory

| Element | Source | Purpose | Sensitivity | Retention | Disclosure recipients | PIB ref |
|---------|--------|---------|-------------|-----------|-----------------------|---------|
| [e.g. legal name] | [individual / partner agency] | [delivery of programme X] | [Protected A / B / C] | [retention schedule] | [internal team / partner agency] | [PIB number or NEW] |
| [contact details] | [individual] | [communications / notification] | [Protected A] | [retention schedule] | [internal team] | [PIB number] |
| [identifiers — SIN if applicable] | [individual / CRA] | [authentication / cross-reference] | [Protected B] | [retention schedule] | [internal team only] | [PIB number] |
| [sensitive categories — health / immigration / etc.] | [individual / partner agency] | [eligibility determination] | [Protected B / C] | [retention schedule] | [internal team / OPC on access request] | [PIB number] |

> Register or update the PIB entry in TBS InfoSource for every element above. Mark `NEW` where a new PIB is required.

## Necessity and Proportionality

### Pressing and Substantial Objective

| Question | Answer |
|----------|--------|
| What is the programme objective? | [statement] |
| Why is it pressing and substantial? | [evidence: statutory mandate, ministerial direction, public-interest rationale] |
| What is the cost of not acting? | [evidence] |

### Rational Connection

| Question | Answer |
|----------|--------|
| How does collecting this personal information advance the objective? | [reasoning] |
| Are there evidence-based alternatives that do not require this collection? | [yes / no — explain] |

### Minimal Impairment

| Question | Answer |
|----------|--------|
| Is each element the minimum needed? | [yes / no per element — link to inventory] |
| Are less intrusive alternatives available (aggregation, de-identification, sampling)? | [yes / no — explain] |
| Can collection be deferred to point of need rather than upfront? | [yes / no — explain] |

### Proportional Effects

| Question | Answer |
|----------|--------|
| What are the benefits to the public / subjects / institution? | [statement] |
| What are the privacy intrusions? | [statement] |
| Do the benefits outweigh the intrusion? | [yes / no — reasoning] |

## Privacy Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation | Residual |
|------|------------|--------|------------|----------|
| Unauthorised disclosure of Protected B/C data | [Low / Med / High] | [Low / Med / High] | [encryption at rest and in transit; access control; audit logging] | [Low / Med / High] |
| Function creep — use beyond stated purpose | [Low / Med / High] | [Low / Med / High] | [purpose limitation in records of decision; consistent-use analysis under §7] | [Low / Med / High] |
| Inaccurate data leading to adverse decisions | [Low / Med / High] | [Low / Med / High] | [§6(2) accuracy duty; correction procedure; manual review on edge cases] | [Low / Med / High] |
| Cross-border processing without adequate safeguards | [Low / Med / High] | [Low / Med / High] | [contractual safeguards; cross-reference `ca-cloud-residency`; data-localisation where required] | [Low / Med / High] |
| PIB not registered or out of date | [Low / Med / High] | [Low / Med / High] | [register / update PIB entry as part of this PIA] | [Low / Med / High] |

Cross-reference `risk` for the project-level continuation of these entries.

## Transfers and Disclosures

| Recipient | §7 / §8 basis | Routine use letter (§8(2) only) | Cross-border flag | Notes |
|-----------|---------------|--------------------------------|-------------------|-------|
| [internal programme team] | §7 — purpose of collection | n/a | No | [notes] |
| [other federal institution] | §8(2)(a) — consistent use | (a) | No | [notes] |
| [investigative body] | §8(2)(e) — law enforcement / investigation | (e) | No | [notes] |
| [processor in foreign jurisdiction] | §8(2)(f) — agreement | (f) | Yes — cross-reference `ca-cloud-residency` | [notes] |
| [in compelling-circumstances disclosure] | §8(2)(m) — public interest / individual benefit | (m) | [Yes / No] | [notes] |

> Each §8(2) letter (a)–(m) must be matched to the actual disclosure scenario. Do not aggregate dissimilar disclosures under one row.

## Individual Rights

| Right | Procedure | Channel | SLA | Owner |
|-------|-----------|---------|-----|-------|
| §12 access to own personal information | [request intake → identity verification → retrieval → release with severance where required] | [ATIP portal / paper / email] | 30 days, extendable per §15 | ATIP coordinator |
| §13 PIB registration in TBS InfoSource | [register / update PIB entry; publish summary in InfoSource] | TBS InfoSource | At launch and on substantial modification | ATIP coordinator |
| Correction and annotation | [correction request → assessment → correction or annotation per §12(2)] | [ATIP portal / paper] | [SLA] | ATIP coordinator |
| Complaint to OPC | [individual files complaint with OPC; institution responds to OPC investigation] | OPC complaint channel | Per OPC SLA | ATIP coordinator + Privacy Counsel |

## OPC Notification Trigger Analysis

| Trigger | Decision | Justification | Date notified or N/A |
|---------|----------|---------------|----------------------|
| New programme involving personal information | [NOTIFY / N/A] | [reasoning] | [YYYY-MM-DD or N/A] |
| Substantial modification (new data, new purpose, new recipient) | [NOTIFY / N/A] | [reasoning] | [YYYY-MM-DD or N/A] |
| New cross-border processing arrangement | [NOTIFY / N/A] | [reasoning] | [YYYY-MM-DD or N/A] |
| Automated decision-making touching personal information | [NOTIFY / N/A — also trigger `ca-aia`] | [reasoning] | [YYYY-MM-DD or N/A] |
| Sensitive categories (health, immigration, criminal record, biometrics) | [NOTIFY / N/A] | [reasoning] | [YYYY-MM-DD or N/A] |

> The TBS Directive on PIA requires notification at least 30 days before launch for new programmes or substantial modifications. Plan accordingly — OPC consultation is not a sign-off formality.

## PIA Approval Chain

| Role | Approver | Date | Conditions |
|------|----------|------|------------|
| ATIP coordinator | [name] | [YYYY-MM-DD] | [conditions / open items] |
| Privacy counsel | [name] | [YYYY-MM-DD] | [conditions / open items] |
| Departmental Security Officer | [name] | [YYYY-MM-DD] | [conditions / open items] |
| ADM accountable | [name] | [YYYY-MM-DD] | [conditions / open items] |
| Head of institution | [name] | [YYYY-MM-DD] | [conditions / open items] |
| OPC notification | [date sent] | [YYYY-MM-DD] | [response received / pending] |
| TBS notification | [date sent] | [YYYY-MM-DD] | [response received / pending] |

## Action Tracker

| Action | Owner | Due | Status |
|--------|-------|-----|--------|
| Resolve `<TBC>` lawful-authority entries | [Privacy Counsel] | [YYYY-MM-DD] | [Open / Closed] |
| Register / update PIB in TBS InfoSource | [ATIP coordinator] | [YYYY-MM-DD] | [Open / Closed] |
| Submit OPC pre-launch notification (≥30 days before launch) | [ATIP coordinator] | [YYYY-MM-DD] | [Open / Closed] |
| Cross-border safeguards — see `ca-cloud-residency` | [Architecture lead] | [YYYY-MM-DD] | [Open / Closed] |
| Trigger `ca-aia` if automated decision-making is in scope | [Architecture lead] | [YYYY-MM-DD] | [Open / Closed] |

## External References

### Document Register

| Doc ID | Title | URL | Verified date |
|--------|-------|-----|---------------|
| CA-PRIV-ACT | Privacy Act (R.S.C., 1985, c. P-21) | <https://laws-lois.justice.gc.ca/eng/acts/P-21/> | [YYYY-MM-DD] |
| CA-TBS-PIA | TBS Directive on Privacy Impact Assessment | <https://www.tbs-sct.canada.ca/pol/doc-eng.aspx?id=18308> | [YYYY-MM-DD] |
| CA-OPC | Office of the Privacy Commissioner of Canada — published guidance | <https://www.priv.gc.ca/> | [YYYY-MM-DD] |
| CA-INFOSOURCE | TBS InfoSource — Personal Information Banks register | <https://www.canada.ca/en/treasury-board-secretariat/services/access-information-privacy/access-information/information-about-programs-information-holdings.html> | [YYYY-MM-DD] |
| CA-PRIV-REG | Privacy Regulations | <https://laws-lois.justice.gc.ca/eng/regulations/SOR-83-508/> | [YYYY-MM-DD] |

### Citations

| Citation | Doc ID | Section | Used in |
|----------|--------|---------|---------|
| [PRIV-1] | CA-PRIV-ACT | §4 — collection limited to relevant information | Lawful Authority |
| [PRIV-2] | CA-PRIV-ACT | §5 — collection directly from individual where possible | Lawful Authority |
| [PRIV-3] | CA-PRIV-ACT | §6(2) — accuracy duty | Privacy Risks and Mitigations |
| [PRIV-4] | CA-PRIV-ACT | §7 — use limited to purpose / consistent use | Transfers and Disclosures |
| [PRIV-5] | CA-PRIV-ACT | §8 — disclosure restrictions | Transfers and Disclosures |
| [PRIV-6] | CA-PRIV-ACT | §8(2)(a)–(m) — routine-use disclosure letters | Transfers and Disclosures |
| [PRIV-7] | CA-PRIV-ACT | §12 — right of access | Individual Rights |
| [PRIV-8] | CA-PRIV-ACT | §13 — PIB registration | Individual Rights |
| [TBS-PIA-1] | CA-TBS-PIA | Notification requirement (≥30 days before launch) | OPC Notification Trigger Analysis |
| [TBS-PIA-2] | CA-TBS-PIA | PIA approval chain | PIA Approval Chain |

### Unreferenced Documents

[List any documents read during generation but not cited, or "None".]
