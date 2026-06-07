# Canada First Nations OCAP® Sovereignty Assessment

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit:ca-ocap`
>
> 🪶 **OCAP® notice**: OCAP® is a registered trademark of the First Nations Information Governance Centre (FNIGC). The OCAP® principles describe a *relationship*, not a checklist. This template supports — but does not substitute for — direct engagement with FNIGC and the affected First Nation(s), Métis, and Inuit communities.

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time per _partials/RENDERING.md. -->
<!-- Classification line MUST be: -->
<!-- | Classification | UNCLASSIFIED / Protected A / Protected B / Protected C / CONFIDENTIAL / SECRET / TOP SECRET | -->
<!-- Note: OCAP-relevant artefacts may carry community-protected information that exceeds the federal classification scheme. Mark accordingly and capture the override in Open Items. -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit:ca-ocap` | [PENDING] | [PENDING] |

## Executive Summary

[Two to three paragraphs describing the system, the Indigenous data in scope, the FNIGC pre-engagement status, the headline OCAP findings (or that this artefact is a planning scaffold awaiting engagement), and any open items. Name the affected First Nation(s), Métis Nation governing member(s), and Inuit population(s) in scope.]

## FNIGC Pre-Engagement Confirmation

| Item | Value |
|------|-------|
| Engagement booked or in progress? | [yes / no / in progress / N/A — explain] |
| Date of engagement (if scheduled) | [YYYY-MM-DD] |
| FNIGC engagement contact | [name, role, email] |
| Community engagement contact(s) | [First Nation(s), Métis Nation governing member(s), Inuit organisation(s) — named contact per nation] |
| Engagement nature | [scoping conversation / data-sharing-agreement workshop / governance review / other] |
| Status | [CONFIRMED / IN PROGRESS / NOT CONFIRMED — PLANNING SCAFFOLD / N/A] |

### Planning Scaffold Mode

- [ ] Engagement NOT confirmed — assessment is a planning scaffold only. Subsequent sections are deferred until engagement.

> **Gate behaviour**: If the box above is ticked, the remaining sections must be left as planning scaffolding only and the artefact header status set to `PLANNING SCAFFOLD — INCOMPLETE`. The architect must engage FNIGC and community representatives before completing this assessment.

#### Engagement Letter Scaffold (used only when engagement is not confirmed)

```text
To: [FNIGC engagement coordinator]
From: [Departmental ADM / accountable signatory]
Subject: OCAP® pre-engagement request — [project / service name]

[Department / agency] is designing [system / service] which will process [brief
description of Indigenous data in scope]. Datasets in scope: [list].
We request a pre-engagement conversation under the FNIGC OCAP® framework
to scope [ownership / control / access / possession] arrangements before
any system design is finalised.

Proposed timeline: [date range].
Departmental contacts: [accountable role + ATIP coordinator + privacy counsel].
```

## Indigenous Data Inventory

| Dataset | First Nation(s) of origin | Data nature | Custodianship | Transfer history | Sensitivity |
|---------|---------------------------|-------------|---------------|------------------|-------------|
| [dataset name / ID] | [First Nation(s) named] | [administrative / statistical / traditional knowledge / biological / image / audio / video] | [community-held / co-held / federal-custodied — describe] | [origin and any prior transfers] | [community-protected / Protected B / Protected C / other — explain] |
| [dataset name / ID] | [First Nation(s) named] | [as above] | [as above] | [as above] | [as above] |

## OCAP Principles Mapping

> Provide one mapping block per dataset listed in the Indigenous Data Inventory.

### Dataset: [dataset name / ID]

#### Ownership

| Aspect | Statement |
|--------|-----------|
| Who holds collective ownership | [First Nation(s) / Métis Nation / Inuit organisation] |
| How is ownership asserted | [community resolution, treaty reference, historical record] |
| Supporting agreements | [DSA reference, MOU, treaty article] |

#### Control

| Aspect | Statement |
|--------|-----------|
| Decision authority — use | [governance body and decision rule] |
| Decision authority — sharing | [governance body and decision rule] |
| Decision authority — publication | [governance body and decision rule] |
| Decision authority — deletion | [governance body and decision rule] |
| Decision authority — secondary analysis | [governance body and decision rule] |
| Veto rights | [community body holding veto; conditions] |

#### Access

| Aspect | Statement |
|--------|-----------|
| Who accesses | [named roles / institutions / researchers] |
| On what terms | [purpose, time-limit, audit obligation] |
| Access tiering | [public / community-only / restricted-research / individual-consent] |
| Consent withdrawal mechanism | [process and SLA] |

#### Possession

| Aspect | Statement |
|--------|-----------|
| Physical custody | [where stored, in whose facility] |
| Digital custody | [hosting jurisdiction, system, encryption posture] |
| Backup arrangements | [community-side, federal-side, redundancy] |
| Repatriation triggers | [event-based: project end, breach, withdrawal of consent] |

## USAI Considerations (Métis data)

> Apply only where Métis Nation populations are in scope. The Métis Nation OCAS / USAI principles (Utility, Self-Determination, Access, Inter-relationships) are distinct from OCAP and must NOT be conflated.

| Dataset | Métis Nation in scope | USAI principle applied | Status |
|---------|-----------------------|------------------------|--------|
| [dataset / ID] | [Métis Nation governing member: e.g. MNO, MNS, MNA] | [Utility / Self-Determination / Access / Inter-relationships] | [Confirmed / In progress / Not applicable] |

## ITK Principles Considerations (Inuit data)

> Apply only where Inuit populations are in scope. ITK *National Inuit Strategy on Research* (NISR) and Inuit-Crown Partnership Committee guidance govern; OCAP and USAI do NOT substitute.

| Dataset | Inuit population in scope | ITK principle applied | Status |
|---------|---------------------------|-----------------------|--------|
| [dataset / ID] | [Inuit Nunangat region: Inuvialuit / Nunavut / Nunavik / Nunatsiavut] | [NISR principle reference] | [Confirmed / In progress / Not applicable] |

## Data Sharing Agreement Terms

> Used where data is shared between the federal institution and a First Nation, Métis Nation governing member, or Inuit organisation.

| Term | OCAP-aligned commitment | Status |
|------|-------------------------|--------|
| Indigenous co-signatory | [named community signatory present] | [In place / Pending] |
| Purpose limitation | [explicit purpose, no broader use] | [In place / Pending] |
| Time bound | [start / end dates with renewal trigger] | [In place / Pending] |
| Revocability | [community right to withdraw with effect on data] | [In place / Pending] |
| Audit rights | [community right to inspect access logs] | [In place / Pending] |
| Sub-processor restrictions | [no onward processors without community consent] | [In place / Pending] |

## Repatriation Plan

> For data historically collected without informed consent, or data whose custodianship the community wishes to reclaim.

| Dataset | Historical context | Return / Destroy decision | Method | Owner | Date |
|---------|--------------------|---------------------------|--------|-------|------|
| [dataset / ID] | [collected when, by whom, under what authority] | [Return / Destroy / Negotiated retention] | [format-portable export / secure destruction / negotiated co-custody] | [accountable role] | [YYYY-MM-DD] |

## Co-Governance Arrangements

| Body | Indigenous representation | Decision rule | Appeal pathway |
|------|---------------------------|---------------|----------------|
| [data-stewardship board / steering committee] | [number of seats / which nations / appointment process] | [consensus / majority / community-veto] | [escalation route — community → minister → independent review] |
| [working group] | [as above] | [as above] | [as above] |

## Risks and Mitigation Register

| Risk | Likelihood | Impact | Mitigation | Residual |
|------|------------|--------|------------|----------|
| Misuse of traditional knowledge | [Low / Med / High] | [Low / Med / High] | [purpose-limitation; community veto on secondary use; audit] | [Low / Med / High] |
| Secondary analysis without renewed consent | [Low / Med / High] | [Low / Med / High] | [secondary-use gate requires renewed community consent; cross-reference DSA] | [Low / Med / High] |
| Breach of trust through unauthorised disclosure | [Low / Med / High] | [Low / Med / High] | [community-protected classification; access logging; breach-notification clause to community] | [Low / Med / High] |
| UNDRIP Act misalignment | [Low / Med / High] | [Low / Med / High] | [Article 31 review; Crown alignment commitment; legal review] | [Low / Med / High] |
| Treating "Indigenous data" as a single regime | [Low / Med / High] | [Low / Med / High] | [maintain distinct OCAP / USAI / ITK tracks; separate engagement contacts per nation] | [Low / Med / High] |
| Conflict between federal classification and community protection | [Low / Med / High] | [Low / Med / High] | [community-protected override recorded in Document Control; Open Item raised] | [Low / Med / High] |

## Open Items

| Item | Owner | Due | Status |
|------|-------|-----|--------|
| Confirm FNIGC pre-engagement and lift planning scaffold flag | [accountable role] | [YYYY-MM-DD] | [Open / Closed] |
| Resolve community-protected classification override | [DSO + ATIP coordinator] | [YYYY-MM-DD] | [Open / Closed] |
| Complete USAI engagement with named Métis Nation governing member | [accountable role] | [YYYY-MM-DD] | [Open / Closed / N/A] |
| Complete ITK engagement with named Inuit organisation | [accountable role] | [YYYY-MM-DD] | [Open / Closed / N/A] |
| Sign Data Sharing Agreement with each affected nation | [accountable role + community signatory] | [YYYY-MM-DD] | [Open / Closed] |
| Confirm UNDRIP Act Article 31 review by departmental legal | [Privacy Counsel] | [YYYY-MM-DD] | [Open / Closed] |

## External References

### Document Register

| Doc ID | Title | URL | Verified date |
|--------|-------|-----|---------------|
| CA-OCAP | First Nations Principles of OCAP® — FNIGC | <https://fnigc.ca/ocap-training/take-the-course/the-first-nations-principles-of-ocap/> | [YYYY-MM-DD] |
| CA-FNIGC | First Nations Information Governance Centre — homepage and guidance | <https://fnigc.ca/> | [YYYY-MM-DD] |
| CA-UNDRIP-ACT | United Nations Declaration on the Rights of Indigenous Peoples Act (S.C. 2021, c. 14) | <https://laws-lois.justice.gc.ca/eng/acts/U-2.2/> | [YYYY-MM-DD] |
| CA-UNDRIP-AP | UNDRIP Act Action Plan (Department of Justice) | <https://www.justice.gc.ca/eng/declaration/index.html> | [YYYY-MM-DD] |
| CA-USAI | Métis Nation OCAS / USAI principles — Métis Nation Council | <https://www2.metisnation.ca/> | [YYYY-MM-DD] |
| CA-ITK-NISR | Inuit Tapiriit Kanatami — National Inuit Strategy on Research | <https://www.itk.ca/national-inuit-strategy-on-research/> | [YYYY-MM-DD] |
| CA-PRIV-ACT | Privacy Act (R.S.C., 1985, c. P-21) | <https://laws-lois.justice.gc.ca/eng/acts/P-21/> | [YYYY-MM-DD] |

### Citations

| Citation | Doc ID | Section | Used in |
|----------|--------|---------|---------|
| [OCAP-1] | CA-OCAP | Ownership principle | OCAP Principles Mapping — Ownership |
| [OCAP-2] | CA-OCAP | Control principle | OCAP Principles Mapping — Control |
| [OCAP-3] | CA-OCAP | Access principle | OCAP Principles Mapping — Access |
| [OCAP-4] | CA-OCAP | Possession principle | OCAP Principles Mapping — Possession |
| [UNDRIP-1] | CA-UNDRIP-ACT | Article 31 — cultural heritage and intellectual property | Risks and Mitigation Register |
| [UNDRIP-2] | CA-UNDRIP-ACT | Crown commitment to align federal law | Executive Summary |
| [USAI-1] | CA-USAI | USAI principles applicable to Métis data | USAI Considerations |
| [ITK-1] | CA-ITK-NISR | NISR principles applicable to Inuit data | ITK Principles Considerations |
| [FNIGC-1] | CA-FNIGC | OCAP® trademark and engagement protocol | FNIGC Pre-Engagement Confirmation |

### Unreferenced Documents

[List any documents read during generation but not cited, or "None".]
