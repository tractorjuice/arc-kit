# Lot 3 Rate Card: [SUPPLIER_NAME]

> **Template Origin**: Official | **ArcKit Version**: [VERSION] | **Command**: `/arckit-uk-gcloud:pricing`

**G-Cloud Lot**: Lot 3 — Cloud Support

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time per _partials/RENDERING.md. -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [DATE] | ArcKit AI | Initial creation from `/arckit.[COMMAND]` command | [PENDING] | [PENDING] |

> G-Cloud 15 (RM1557.15) Lot 3 (Cloud Support) rate card: **one card for all the supplier's Lot 3 services**. G-Cloud 15 is run by the Government Commercial Agency (GCA, formerly CCS).
> Rules from GCA's Framework Schedule 3 (Framework Prices) and Attachment 2 (How to tender) v5.0. Market figures are maximum day rates on live G-Cloud 15 listings, not contract prices.

<!-- This card is supplier-level and lives in projects/000-global/supplier/. /arckit-uk-gcloud:pricing owns it: it is written and changed only there.
     The SDD of each Lot 3 service lists the role levels that deliver it and never copies the rates; each Lot 3 pricing document summarises the card.
     Every Lot 3 listing shows the whole card. On the 27,496 live Lot 3 listings scraped on 7 October 2026,
     2 of the 1,135 suppliers with more than one Lot 3 service show different cards on different services,
     and the median service shows all 222 role levels. -->

## G-Cloud Details

| Field | Value |
|-------|-------|
| Supplier | [SUPPLIER_NAME] |
| Framework | G-Cloud 15 (RM1557.15), Government Commercial Agency (GCA, formerly CCS) |
| Lot | 3 — Cloud Support |
| Lot 3 services on this card | [ARC-NNN-SVCD service names and project numbers] |
| Rate card status | Draft / Confirmed by [NAME, ROLE] on [DATE] |

---

## 1. Rules

| Rule | Detail |
|------|--------|
| Scope | One card for all your Lot 3 services. Every Lot 3 listing shows the same card, so it covers every role any of those services needs |
| What you price | A **maximum** day rate for each role level offered: UK (onshore) and, optionally, offshore |
| Role levels | Only the 222 levels of GCA's rate card (9 job families, 58 roles), named exactly as `lot-3-rate-card.md` names them; leave blank any you can't provide |
| Roles outside DDaT | Price procurement, commercial, training and other roles the rate card doesn't name at the nearest DDaT role and level (section 5) |
| Day | 7.5 working hours |
| Minimum | £50 a day |
| Travel and subsistence | Included within the M25. Elsewhere only if the rate card states it, at the buyer's standard rates |
| No uplift | No risk or contingency uplift inside a day rate |
| Changes | Rates can be reduced at any time, never increased |
| Onshore / offshore | Onshore staff must be available in the UK for the contract; offshore staff may work outside the UK |

---

## 2. UK (Onshore) Maximum Day Rates

| Job family | Role | Role level | Your maximum (£/day) | Market comparison | Position |
|------------|------|------------|----------------------|-------------------|----------|
| [FAMILY] | [ROLE] | [ROLE_LEVEL] | £[RATE] / [PENDING] | [Median £X, p25–p75 £X–£X, N suppliers (DDaT Rate Card skill) / Rivals £X–£X, N listings (GCMP) / No comparison] | [Below p25 / p25–p75 / Above p75 / —] |

## 3. Offshore Maximum Day Rates

| Job family | Role | Role level | Your maximum (£/day) | Market comparison | Position |
|------------|------|------------|----------------------|-------------------|----------|
| [FAMILY] | [ROLE] | [ROLE_LEVEL] | £[RATE] / Not offered | [Offshore median £X (DDaT Rate Card skill) / Rivals £X–£X, N listings (GCMP) / No comparison] | [POSITION / —] |

---

## 4. Projected Average Day Rate (price score 80%)

| Field | Value |
|-------|-------|
| Role levels offered | [N] of 222 |
| Rates entered (UK + offshore) | [N] ([N_UK] UK, [N_OFFSHORE] offshore) |
| Rates left out of the average (under £50 or over £10,000) | [N / None] |
| **Your average day rate** | **£[AVERAGE]** |
| Average of the market medians for the same rates | £[MARKET_AVERAGE] / Not available for every level offered |
| Difference | [+/-]£[DIFF] ([+/-][X]%) / — |

How it scores: the average is every rate entered, added up and divided by the number of rates. The lowest average across all bidders scores 80, and every other bidder scores (lowest average ÷ their average) × 80. Each level offered counts equally, so a card heavy with senior levels raises the average and one that includes junior and offshore levels lowers it. Offer only levels you can staff at that rate for the whole framework.

---

## 5. Roles Mapped to DDaT Role Levels

<!-- For people whose job isn't a DDaT role: procurement and commercial advisers, trainers, bid and contract managers.
     Price each at the nearest DDaT role and level by the work they do and their seniority, and tell buyers which
     level each is priced at. Live Lot 3 procurement services price such people mostly as architects, IT service
     managers, delivery managers and business analysts, and none of the 179 says which level they are priced at.
     Delete this section if every role is a DDaT role. -->

| Your role | Priced as (job family > role > role level) | Why this level |
|-----------|--------------------------------------------|----------------|
| [YOUR ROLE] | [FAMILY > ROLE > ROLE_LEVEL] | [WORK AND SENIORITY THAT MATCH] |

**Where buyers are told:** [The sentence in each affected service's definition document, and in its pricing document if it has one, for example "Our procurement consultants are priced at the DDaT Senior delivery manager level."]

---

## 6. Role Levels Each Service Needs

Every role level a Lot 3 service's design (section 6C) or SDD (section 11) says delivers it must be on this card.

| Service (project) | Role levels that deliver it | All on this card |
|-------------------|-----------------------------|------------------|
| [ARC-NNN-SDD, service name] | [ROLE_LEVEL, ...] | Yes / No: [MISSING LEVELS] |

---

## 7. Expenses Outside the M25

[None claimed: all travel and subsistence is absorbed / Recoverable outside the M25 at the buyer's standard rates, as stated on the rate card]

---

## 8. Compliance Check

| Check | Result |
|-------|--------|
| Every role level named exactly as in `lot-3-rate-card.md` | Pass / Fail |
| Every rate at least £50, for a 7.5-hour day | Pass / Fail |
| No risk or contingency uplift | Pass / Fail |
| Travel and subsistence inside the M25 included | Pass / Fail |
| Every role level any Lot 3 service needs is on the card (section 6) | Pass / Fail |
| Prices in GBP, excluding VAT, to at most two decimal places | Pass / Fail |
| No SFIA levels or SFIA day rates (G-Cloud 15 prices Lot 3 on the DDaT rate card) | Pass / Fail |

---

## 9. Items Requiring Attention

| # | Item | What is needed | Owner |
|---|------|----------------|-------|
| 1 | [ITEM] | [WHAT_IS_NEEDED] | [OWNER] |

---

## External References

> This section provides traceability from generated content back to source documents.
> Follow citation instructions in the project's citation reference guide.

### Document Register

| Doc ID | Filename | Type | Source Location | Description |
|--------|----------|------|-----------------|-------------|
| *None provided* | — | — | — | — |

### Citations

| Citation ID | Doc ID | Page/Section | Category | Quoted Passage |
|-------------|--------|--------------|----------|----------------|
| — | — | — | — | — |

### Unreferenced Documents

| Filename | Source Location | Reason |
|----------|-----------------|--------|
| — | — | — |

---

**Generated by**: ArcKit `/arckit:{command}` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
