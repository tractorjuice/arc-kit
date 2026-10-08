# Pricing Document: [PROJECT_NAME]

> **Template Origin**: Official | **ArcKit Version**: [VERSION] | **Command**: `/arckit-uk-gcloud:pricing`

**G-Cloud Lot**: [Lot 1a — Infrastructure as a Service (IaaS) and Platform as a Service (PaaS) / Lot 1b — IaaS and PaaS above OFFICIAL / Lot 2a — Infrastructure Software as a Service (iSaaS) / Lot 2b — Software as a Service (SaaS) / Lot 3 — Cloud Support]

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time per _partials/RENDERING.md. -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [DATE] | ArcKit AI | Initial creation from `/arckit.[COMMAND]` command | [PENDING] | [PENDING] |

> G-Cloud 15 (RM1557.15) pricing for one service, laid out for its lot. G-Cloud 15 is run by the Government Commercial Agency (GCA, formerly CCS).
> Rules from GCA's Framework Schedule 3 (Framework Prices), Attachment 2 (How to tender) v5.0 and Framework Schedule 1 (Specification) v2.1. Market figures are maximum rates and discounts on live G-Cloud 15 listings, not contract prices.
> Keep only this lot's sections: §2 for Lots 1a/1b, §3 for Lots 2a/2b, §4 for Lot 3. Delete the other two rather than marking them N/A.

## G-Cloud Details

| Field | Value |
|-------|-------|
| Service Name | [SERVICE_NAME] |
| Supplier | [SUPPLIER_NAME] |
| Framework | G-Cloud 15 (RM1557.15), Government Commercial Agency (GCA, formerly CCS) |
| Lot | [1a / 1b / 2a / 2b / 3] — [LOT_NAME] |
| Pricing status | Draft / Confirmed by [NAME, ROLE] on [DATE] |

---

## 1. Pricing Summary

| Field | Value |
|-------|-------|
| **What is priced** | [Lots 1a/1b: the price formula for each deployment model / Lots 2a/2b: unit prices and the six-band discount matrix / Lot 3: nothing per service; the supplier's one rate card (`ARC-000-RATE`) gives a maximum day rate for each role level offered] |
| **What the bid scores on price** | [Lots 1a/1b: onboarding price 5% and minimum discount 5% / Lots 2a/2b: the total of the six band discounts, 80% / Lot 3: the average day rate, 80%] |
| **Lot-wide figures** | [Lots 1a/1b: onboarding table and minimum discount / Lots 2a/2b: discount matrix / Lot 3: the whole rate card, kept once in `ARC-000-RATE`]: the same on every service you list in this lot |
| **Currency and tax** | GBP, excluding VAT |
| **Discount for educational organisations** | Yes / No |
| **Free trial available** (Lots 1a/1b, 2a/2b) | Yes / No |
| **Pricing document** | [FILE_NAME] (ODF or PDF/A, at most 5 MB, accessible) / Lot 3: optional, [FILE_NAME / None] |
| **Market comparison used** | [DDaT Rate Card skill table (maximum UK rates, listings scraped 7 October 2026) / rival listings in the GCMP artefact ([N] listings) / none] |

---

## 2. Lots 1a and 1b: Price Formula
<!-- Lots 1a and 1b only. Lot 1b: every figure in this section goes on GCA's separate, non-public Lot 1b platform, not on a public listing. -->

Framework Schedule 3, Annex 1, paragraph 3.2:

> **Framework Price = Baseline Price + Fixed Onboarding Costs − Framework Discount ± Further Supplier-Specific Schemes − Time Limited Discounts**

Listings label the same terms: *Total Cost = Baseline Pricing − Minimum Discounting + Onboarding Activity + Additional sources of cost − Additional sources of cost reduction.*

### 2.1 Deployment Models Priced

Taken from the SDD's "Cloud deployment model" answer. One formula for each model offered.

| Deployment model | Offered | Where the detailed prices live |
|------------------|---------|-------------------------------|
| Public cloud | Yes / No | Publicly visible on your (or your subcontractor's) website at all times, linked from the listing |
| Private cloud | Yes / No | Need not be public; given in your call-off tender against the buyer's requirement |
| Community cloud | Yes / No | As private cloud |
| Hybrid cloud | Yes / No | Public price list for any public cloud component |

### 2.2 Formula: [DEPLOYMENT_MODEL]
<!-- Repeat this table for each deployment model offered. -->

| Listing term | Schedule 3 term | Your entry | Rule |
|--------------|-----------------|------------|------|
| Baseline Pricing | Baseline Price | [What the baseline is: fixed price, or unit price × units, with the unit of measure] | Can go up or down during the framework |
| Baseline Pricing - Web link | — | [URL] | Must stay live. For public cloud, the price list must be public |
| Minimum Discounting | Framework Discount | [X]% | **Scored 5%.** One figure for the lot, fixed for the framework term (§2.4) |
| Onboarding Activity | Fixed Onboarding Costs | [What onboarding covers and how it is priced, based on the onboarding examples in §2.3] | Fixed for the life of each call-off. Only real onboarding work; none on a continuation or extension of an existing contract |
| Additional sources of cost | Further Supplier-Specific Schemes that add cost | [Management fees, currency conversion, mandatory support plans, or "None"] | State every one; nothing may be hidden |
| Additional sources of cost reduction | Further Supplier-Specific Schemes that cut cost, and Time Limited Discounts | [Volume, commitment, up-front payment, public sector or private pricing programmes; time-limited offers with their end dates] | Can be increased (prices cut further) at any time. Time-limited discounts must be published on the Digital Platform |

### 2.3 Onboarding Price (scored 5%)

The Digital Platform asks for a maximum total onboarding cost in 9 cells, each for a scenario it defines, priced "as though for a reasonable requirement from a reasonably assumable buyer". These are the onboarding examples that Fixed Onboarding Costs at call-off must be based on.

| # | Scenario (copy the wording from the Digital Platform) | Maximum total cost over the scenario term (£, ex VAT) |
|---|--------------------------------------------------------|------------------------------------------------------|
| 1 | [SCENARIO] | £[PRICE] |
| 2 | [SCENARIO] | £[PRICE] |
| 3 | [SCENARIO] | £[PRICE] |
| 4 | [SCENARIO] | £[PRICE] |
| 5 | [SCENARIO] | £[PRICE] |
| 6 | [SCENARIO] | £[PRICE] |
| 7 | [SCENARIO] | £[PRICE] |
| 8 | [SCENARIO] | £[PRICE] |
| 9 | [SCENARIO] | £[PRICE] |
| | **Average of the 9 cells** | **£[AVERAGE]** |

How it scores: the lowest average across all bidders scores 5%, and every other bidder scores (lowest average ÷ their average) × 5. A blank cell scores 0 for the whole question. An entry of £0 is evaluated as £0.01.

### 2.4 Minimum Discount (scored 5%)

| Field | Value |
|-------|-------|
| Minimum discount applicable to your baseline prices | [X]% |
| Applies to | Every service called off under Lot [1a/1b], by any buyer |
| Fixed until | The framework reopens to new bids (about February 2028 and August 2029) |
| Other 1a/1b services of yours showing the same figure | [SERVICES / None yet] |

How it scores: the highest discount across all bidders scores 5%, and the others score in proportion. An entry of 0% is evaluated as 0.01%. No benchmark for this figure is bundled with this overlay.

### 2.5 Billing Basis

| Requirement (Framework Schedule 1) | How this service meets it |
|------------------------------------|---------------------------|
| Available pay as you go, with no minimum contractual or volume commitment | [DESCRIPTION] |
| Consumption measured and billed per hour (compute) or per GB (storage), or finer | [DESCRIPTION] |
| Usage data exportable in a recognised format (for example CSV) | [DESCRIPTION] |
| Preferential terms for term or volume commitments (optional) | [DESCRIPTION / None] |

---

## 3. Lots 2a and 2b: Unit Prices and Discount Matrix
<!-- Lots 2a and 2b only. -->

### 3.1 Unit Prices

| Item | Unit of measure | Unit price (£, ex VAT) | What the price includes |
|------|-----------------|------------------------|-------------------------|
| [ITEM] | [per user per month / per GB per month / per instance per year / ...] | £[PRICE] | [INCLUDED] |
| [ITEM] | [UNIT] | £[PRICE] | [INCLUDED] |

Unit prices can be reduced at any time during the framework but never increased. Every price says exactly what it buys: no ranges, no "from" prices, no price on application.

### 3.2 How a Call-Off Price Is Worked Out

Framework Schedule 3, Annex 1, paragraph 4.2: unit price × units needed over the full contract term = contract value; ÷ number of years = annual contract value; that value's band sets the discount (§3.3); any time-limited discount (§3.4) then applies.

**Worked example:** [N] [UNITS] × £[UNIT_PRICE] × [YEARS] years = £[CONTRACT_VALUE]; ÷ [YEARS] = £[ANNUAL_VALUE] a year, in band "[BAND]", so [X]% off: £[DISCOUNTED_ANNUAL] a year.

### 3.3 Discount Matrix (price score 80%)

| Annual call-off contract value (ex VAT) | Your discount | Rivals' discounts (GCMP artefact) |
|-----------------------------------------|---------------|-----------------------------------|
| Less than £250,000 | [X.XX]% | [X%–X%, N listings / No comparison available] |
| Between £250,000 and £500,000 | [X.XX]% | [COMPARISON] |
| Between £500,001 and £1,000,000 | [X.XX]% | [COMPARISON] |
| Between £1,000,001 and £2,500,000 | [X.XX]% | [COMPARISON] |
| Between £2,500,001 and £5,000,000 | [X.XX]% | [COMPARISON] |
| Over £5,000,001 | [X.XX]% | [COMPARISON] |
| **Total of the six discounts** | **[X.XX]%** | |

Comparison: rivals' discount tiers as recorded in this service's GCMP artefact (`/arckit-uk-gcloud:gcloud-competitors`), [N] listings, retrieved [DATE]; or "No comparison available". This overlay bundles no discount benchmark, so never fill this column with figures that aren't in the GCMP artefact.

How it scores: each bidder's six discounts are added up. The highest total across all bidders scores 80%, and every other bidder scores (their total ÷ highest total) × 80. Every band must be filled in, from 0% to 100%, to two decimal places; 0% is allowed. The matrix is publicly visible, applies to every service you call off under this lot, and is fixed until the framework reopens.

### 3.4 Time-Limited Discounts

| Offer | Discount | Applies to | Ends | Published on the Digital Platform |
|-------|----------|------------|------|-----------------------------------|
| [OFFER / None] | [X]% | [ITEMS] | [DATE] | Yes / No |

---

## 4. Lot 3: Rate Card
<!-- Lot 3 only. -->

Lot 3 is priced on **one rate card for all your Lot 3 services**, kept at supplier level in `projects/000-global/supplier/ARC-000-RATE-v*.md` and shown in full on every Lot 3 listing. `/arckit-uk-gcloud:pricing` writes it from `rate-card-template.md`; this section only records how this service relates to it. Rates, the market comparison and the average day rate stay on the card.

| Field | Value |
|-------|-------|
| Rate card | `ARC-000-RATE-v[VERSION]` of [DATE] |
| Role levels on the card | [N] of 222 ([N_UK] UK rates, [N_OFFSHORE] offshore) |
| Average day rate, as GCA scores it (price 80%) | £[AVERAGE] |
| Role levels that deliver this service | [ROLE_LEVEL, ...] (from the service design and SDD) |
| All of them on the card | Yes / No: [MISSING LEVELS, added to the card on this run] |
| Roles priced at the nearest DDaT level | [YOUR ROLE → ROLE_LEVEL, ... / None] |

---

## 5. Education Discount and Free Trial

### 5.1 Discount for Educational Organisations

| Field | Value |
|-------|-------|
| **Do you offer special pricing for educational organisations?** | Yes / No |
| What the discount is and who qualifies | [DESCRIPTION, set out in the pricing document] |

### 5.2 Free Trial
<!-- Lots 1a/1b and 2a/2b only. Lot 3 has no free trial question. -->

| Field | Value |
|-------|-------|
| **Free trial available** | Yes / No |
| **Description of free trial** (at most 50 words: the listings' limit) | [What's included, what isn't, any time limit] |
| **Link to free trial** | [URL] |

---

## 6. Compliance Check

| Check | Result |
|-------|--------|
| No "price on application" | Pass / Fail |
| No "from £x" prices | Pass / Fail |
| No minimum-only prices | Pass / Fail |
| No unexplained ranges (each price says what it buys: "£100 = x, £200 = y", never "£100–£300") | Pass / Fail |
| No pricing in the service definition document | Pass / Fail |
| Prices in GBP, excluding VAT, to at most two decimal places | Pass / Fail |
| Prices treated as maximums, within the lot's change rules | Pass / Fail |
| 0.75% management charge allowed for inside the prices, not added as a line item | Pass / Fail |
| Lot-wide figures match the supplier's other services in this lot | Pass / Fail / Only service in the lot |
| Education discount and free trial answers match the SDD | Pass / Fail / No SDD yet |
| **Lots 1a/1b:** all 9 onboarding cells completed; public cloud prices publicly linked; pay as you go available | Pass / Fail |
| **Lots 2a/2b:** all six bands completed, each 0–100%; unit prices never raised | Pass / Fail |
| **Lot 3:** the supplier rate card (`ARC-000-RATE`) exists and passes its own compliance check; every role level this service needs is on it | Pass / Fail |

---

## 7. Pricing Document (upload)

The "Pricing document" uploaded with the listing. It is not indexed by marketplace search. Every live Lot 1a, 2a and 2b listing has one; on Lot 3 it is optional (71% of the 27,496 live Lot 3 listings have one), because the rate card carries the prices.

| Content | Detail |
|---------|--------|
| Full pricing model | [Formula, unit prices or rate card, as above] |
| What's included and what costs extra | [DESCRIPTION] |
| Discounts | [Lot discount, education discount, schemes, time-limited offers] |
| Billing frequency and basis | [DESCRIPTION] |
| Minimum commitment | [None / DESCRIPTION] |
| Format | ODF or PDF/A, at most 5 MB, meets accessibility standards |

---

## 8. Market Context

| Source | What it shows | Used for |
|--------|---------------|----------|
| DDaT Rate Card skill table (listings scraped 7 October 2026) | Maximum UK and offshore day rates for 12 common Lot 3 role levels on live G-Cloud 15 listings | §4.2–4.4 positions (Lot 3 only) |
| GCMP artefact (`/arckit-uk-gcloud:gcloud-competitors`), if present | Rivals' published prices, discount tiers or rate cards, with the number of listings | §3.3 or §4.2–4.4 comparisons |
| TNDR artefact (`/arckit:tenders`), if present | Awarded contract values for comparable contracts. Awarded value is not actual spend | Sanity check on overall price level |
| [OTHER] | [DESCRIPTION] | [USE] |

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
