# Canada ATIP Reconciliation

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit:ca-atip`

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time per _partials/RENDERING.md. -->
<!-- Classification line MUST be: -->
<!-- | Classification | UNCLASSIFIED / Protected A / Protected B / Protected C / CONFIDENTIAL / SECRET / TOP SECRET | -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit:ca-atip` | [PENDING] | [PENDING] |

## Executive Summary

[Two to three paragraphs describing the system's information holdings, the headline ATI Act exemption posture per holding, the Privacy Act §4–§8 disclosure footprint, the severance design for any hybrid public/protected views, and any open issues that block ATIP readiness.]

## Information Holdings Inventory

| Holding | Category (Public / Protected / Classified) | PIB ref | Owner | Lifecycle |
|---------|--------------------------------------------|---------|-------|-----------|
| [registrant identity record] | Protected B | [PIB number or NEW] | [ATIP coordinator] | [Live / Pilot / Design] |
| [public-facing register entry] | Public | n/a | [Programme owner] | [Live] |
| [investigative case file] | Protected B / Classified | [PIB number] | [investigative authority] | [Live] |
| [audit trail / severance log] | Protected B | [PIB number or NEW] | [ATIP coordinator] | [Live] |
| [aggregate analytics dataset] | Public / Protected (per field) | [PIB number or NEW] | [Analytics lead] | [Design] |

> Categorise every dataset that surfaces in the data model. A holding without an explicit category is a launch blocker.

## Access to Information Act Mapping

| Holding | Exemption section | Justification | Severance applies |
|---------|-------------------|---------------|-------------------|
| [investigative case file] | §16(1)(c) law enforcement / investigations | [why the disclosure could reasonably be expected to be injurious to enforcement] | Yes |
| [investigative case file — designated body) | §16.1 designated investigative bodies | [where the holding originates from a §16.1 body] | Yes |
| [audit working paper] | §16.5 audits | [where audit working papers fall within §16.5] | Yes |
| [protected disclosure complaint] | §16.6 protected disclosures | [PSDPA whistleblower context] | Yes |
| [foreign-government correspondence] | §13 obtained in confidence | [identify originating government / international organisation] | Yes |
| [federal-provincial briefing] | §14 federal-provincial affairs | [where disclosure could be injurious to FP affairs] | Yes |
| [security-cleared briefing] | §15 international affairs / defence / national security | [identify which §15 head applies] | Yes |
| [personal information element] | §19 (refers to Privacy Act) | [§19 is NOT blanket — test against §8(2) routine uses before invoking] | Yes |
| [policy advice / option memo] | §21 advice and recommendations | [within §21(1)(a)/(b) and the 20-year sunset] | Partial |
| [legal opinion] | §23 solicitor-client privilege | [identify the privilege; do not assert without basis] | Yes |
| [Schedule II statute prohibition] | §24 statutory prohibitions | [identify the specific Schedule II provision] | Yes |

> Per row, the justification must be specific enough for the OIC to follow on review under §30. Asserting §16 or §15 without specifying the head is a common defect.

## Privacy Act §4–§8 Register

| Activity | Section | Justification | Notes |
|----------|---------|---------------|-------|
| [collect legal name and address] | §4 | [collection relates directly to programme X — cite enabling statute] | [link to PIA element row] |
| [collect identity directly from individual] | §5 | [direct collection where reasonably possible] | n/a |
| [collect identity from CRA cross-reference] | §5(2) — exception to direct collection | [identify the exception relied on under §5(2)/(3)] | [link to PIA element row] |
| [use for eligibility decisioning] | §7 — purpose of collection | [exact original purpose] | n/a |
| [use for fraud analytics] | §7(a) — consistent use | [explain reasonable expectation by individual] | [requires consistent-use letter to TBS InfoSource] |
| [disclose to other federal institution for joint programme] | §8(2)(a) — consistent use | [routine-use letter (a)] | [bilateral MOU reference] |
| [disclose to investigative body under federal/provincial law] | §8(2)(e) — investigation | [routine-use letter (e); cite investigative authority] | [link to Information Sharing Agreement] |
| [disclose to processor under contractual safeguards] | §8(2)(f) — agreement | [routine-use letter (f); cite agreement] | [cross-border? cross-reference `ca-cloud-residency`] |
| [disclose to OPC on access request] | §8(2)(c) — compliance with order or to comply with rules of court | [where applicable] | n/a |
| [disclose with consent of the individual] | §8(2)(b) — consent | [identify how consent is captured and revocable] | n/a |
| [public-interest disclosure to a person whose interests it benefits] | §8(2)(m) — public interest | [Minister gives written notice to OPC under §8(5)] | [extraordinary; document rationale] |

> Each §8(2)(a)–(m) letter must be matched to the actual disclosure scenario. Do not aggregate dissimilar disclosures under one row.

## Severance Design

The severance regime governs every transition from a Protected or Classified holding to a Public view, and from one user role to another within a Protected holding.

### Field-Level Severance Rules

| Field | View — Public | View — Protected | View — Classified | Exemption(s) cited |
|-------|---------------|------------------|-------------------|--------------------|
| [registrant legal name] | Reveal | Reveal | Reveal | n/a |
| [registrant home address] | Mask | Reveal | Reveal | §19; Privacy Act §8 |
| [foreign principal name] | Reveal | Reveal | Reveal | n/a |
| [investigative officer identity] | Mask | Mask | Reveal | §16(1)(c); §15 |
| [financial flow amount] | Banded | Reveal | Reveal | §20 third-party (where applicable) |
| [risk score / triage outcome] | Mask | Mask | Reveal | §16(1)(c); §21 advice |
| [free-text narrative] | Mask | Reveal with redaction | Reveal | §19; §16; §21 (per content) |

### Severance Audit Log Schema

| Field | Reviewer role | Exemption cited | Output |
|-------|---------------|-----------------|--------|
| [field name] | [ATIP analyst / delegated officer] | [§13 / §14 / §15 / §16 / §19 / §21 / §23 / §24 — specific head] | [redacted character count, justification reference, retained/deleted, version] |
| [composite redaction] | [Senior ATIP analyst] | [multiple — list each head] | [linked justification memo ref] |
| [late re-redaction on consultation] | [ATIP coordinator] | [as cited] | [reason for change; original release recall ref] |

> Every redaction event must produce one row above. Severance without per-field audit trails will not withstand OIC review.

### Re-Identification Risk Register

| Risk | Likelihood | Impact | Mitigation | Residual |
|------|------------|--------|------------|----------|
| Public register cross-referenced with adjacent open data | [Low / Med / High] | [Low / Med / High] | [k-anonymity threshold; banded fields; suppression rules] | [Low / Med / High] |
| Protected view metadata (timestamps, IDs) leaks through severance gaps | [Low / Med / High] | [Low / Med / High] | [strip metadata on export; review severance tooling output] | [Low / Med / High] |
| Aggregate analytics enabling re-identification of small cohorts | [Low / Med / High] | [Low / Med / High] | [minimum cell size; differential-privacy noise where appropriate] | [Low / Med / High] |
| Triangulation across release tranches | [Low / Med / High] | [Low / Med / High] | [tranche-aware severance; cumulative-disclosure ledger] | [Low / Med / High] |

## ATIP Request Workflow

1. **Intake** — request received via designated channel; identity verification; clarification dialogue where the request is broad.
2. **Triage** — locate responsive records; categorise per Information Holdings Inventory; identify exemptions in play.
3. **Consultation under §27** — notify affected third parties (other institutions, originating governments, third-party suppliers under §20) within statutory timelines.
4. **Severance** — apply field-level severance rules; produce audit log entries per redaction.
5. **Release** — issue release package or refusal; publication of refusals where institutional policy requires.
6. **Complaint pathway** — OIC complaint under §30; institutional response; potential Federal Court review under §41.

| Step | SLA | Owner | Notes |
|------|-----|-------|-------|
| Acknowledge receipt | Within 5 business days | ATIP coordinator | n/a |
| Initial response | 30 days from receipt per §7 | ATIP analyst | clock starts at receipt of fee where applicable |
| §9 extension notice (if required) | Before the 30-day clock expires | ATIP coordinator | written notice with reasons and stated timeline |
| §27 third-party consultation | Within statutory window | ATIP analyst | [identify specific third parties] |
| Severance and release | Per extended deadline | ATIP analyst + Senior reviewer | audit log per redaction |

### Extension justification template (§9)

| Field | Value |
|-------|-------|
| Original deadline | [YYYY-MM-DD] |
| §9 head invoked | §9(1)(a) / (b) / (c) |
| Reason | [e.g. large volume of records; consultations required; interferes unreasonably with operations] |
| Extended deadline | [YYYY-MM-DD] |
| Notice issued to requester | [YYYY-MM-DD] |
| OIC notified (where extension > 30 days) | [YYYY-MM-DD or N/A] |

## Annual Report Mapping

| Reportable item | Source | Period | Reporting authority |
|-----------------|--------|--------|---------------------|
| ATI requests received, granted, refused, extended | Request tracker | Fiscal year | OIC + departmental ATI annual report to Parliament |
| Privacy Act requests and complaints | Request tracker | Fiscal year | OPC + departmental Privacy annual report to Parliament |
| Personal Information Banks and InfoSource updates | PIB register | Continuous | TBS InfoSource |
| OIC investigations and findings | Complaints log | Fiscal year | OIC |
| OPC investigations and findings | Complaints log | Fiscal year | OPC |
| Material modifications triggering PIA refresh | Change log | On occurrence | TBS + OPC notification |

## Open Issues

| Item | Owner | Due | Status |
|------|-------|-----|--------|
| Resolve `<TBC>` exemption rationales | ATIP coordinator | [YYYY-MM-DD] | [Open / Closed] |
| Update PIB entry in TBS InfoSource for new holdings | ATIP coordinator | [YYYY-MM-DD] | [Open / Closed] |
| Confirm §27 third-party consultation list | ATIP analyst | [YYYY-MM-DD] | [Open / Closed] |
| Validate severance tooling against audit log schema | Architecture lead | [YYYY-MM-DD] | [Open / Closed] |
| Resolve re-identification risks marked High | Architecture lead | [YYYY-MM-DD] | [Open / Closed] |
| Cross-reference data-model classification flags | Data architect | [YYYY-MM-DD] | [Open / Closed] |

## External References

### Document Register

| Doc ID | Title | URL | Verified date |
|--------|-------|-----|---------------|
| CA-ATI-ACT | Access to Information Act (R.S.C., 1985, c. A-1) | <https://laws-lois.justice.gc.ca/eng/acts/A-1/> | [YYYY-MM-DD] |
| CA-PRIV-ACT | Privacy Act (R.S.C., 1985, c. P-21) | <https://laws-lois.justice.gc.ca/eng/acts/P-21/> | [YYYY-MM-DD] |
| CA-OIC | Office of the Information Commissioner of Canada — published guidance | <https://www.oic-ci.gc.ca/> | [YYYY-MM-DD] |
| CA-OPC | Office of the Privacy Commissioner of Canada — published guidance | <https://www.priv.gc.ca/> | [YYYY-MM-DD] |
| CA-TBS-ATI | TBS Directive on Access to Information Requests | <https://www.tbs-sct.canada.ca/pol/doc-eng.aspx?id=18310> | [YYYY-MM-DD] |
| CA-TBS-PIA | TBS Directive on Privacy Impact Assessment | <https://www.tbs-sct.canada.ca/pol/doc-eng.aspx?id=18308> | [YYYY-MM-DD] |
| CA-INFOSOURCE | TBS InfoSource — Personal Information Banks register | <https://www.canada.ca/en/treasury-board-secretariat/services/access-information-privacy/access-information/information-about-programs-information-holdings.html> | [YYYY-MM-DD] |

### Citations

| Citation | Doc ID | Section | Used in |
|----------|--------|---------|---------|
| [ATI-1] | CA-ATI-ACT | §7 — 30-day clock | ATIP Request Workflow |
| [ATI-2] | CA-ATI-ACT | §9 — extensions | ATIP Request Workflow |
| [ATI-3] | CA-ATI-ACT | §13 — obtained in confidence | Access to Information Act Mapping |
| [ATI-4] | CA-ATI-ACT | §14 — federal-provincial affairs | Access to Information Act Mapping |
| [ATI-5] | CA-ATI-ACT | §15 — international affairs / defence / national security | Access to Information Act Mapping |
| [ATI-6] | CA-ATI-ACT | §16 / §16.1–§16.6 — law enforcement and investigations | Access to Information Act Mapping |
| [ATI-7] | CA-ATI-ACT | §19 — personal information | Access to Information Act Mapping |
| [ATI-8] | CA-ATI-ACT | §21 — advice and recommendations | Access to Information Act Mapping |
| [ATI-9] | CA-ATI-ACT | §23 — solicitor-client privilege | Access to Information Act Mapping |
| [ATI-10] | CA-ATI-ACT | §24 — statutory prohibitions (Schedule II) | Access to Information Act Mapping |
| [ATI-11] | CA-ATI-ACT | §27 — third-party consultation | ATIP Request Workflow |
| [ATI-12] | CA-ATI-ACT | §30 — OIC complaints | ATIP Request Workflow |
| [PRIV-1] | CA-PRIV-ACT | §4 — collection authority | Privacy Act §4–§8 Register |
| [PRIV-2] | CA-PRIV-ACT | §5 — direct collection (and §5(2)/(3) exceptions) | Privacy Act §4–§8 Register |
| [PRIV-3] | CA-PRIV-ACT | §7 / §7(a) — use limited to purpose / consistent use | Privacy Act §4–§8 Register |
| [PRIV-4] | CA-PRIV-ACT | §8(2)(a)–(m) — routine-use disclosure letters | Privacy Act §4–§8 Register |

### Unreferenced Documents

[List any documents read during generation but not cited, or "None".]
