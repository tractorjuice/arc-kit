# G-Cloud Pricing Guide

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit-uk-gcloud:pricing` generates the G-Cloud 15 (RM1557.15) pricing document for a service, laid out for
its lot. G-Cloud 15 prices every lot differently, and price is scored: 10% of the bid on Lots 1a/1b
and 80% on Lots 2a/2b and Lot 3. The command reads the service's lot from its service design,
explains each scored figure, and checks the prices against the framework's pricing rules. For Lot 3
it also owns the supplier's one rate card, shared by every Lot 3 service.

---

## Command

```bash
/arckit-uk-gcloud:pricing <service project or service name>
```

Output:

```text
projects/<NNN>-<service-name>/ARC-<NNN>-PRIC-v1.0.md
projects/000-global/supplier/ARC-000-RATE-v1.0.md   (Lot 3 only: the supplier's one rate card)
```

---

## When to Use

- After `/arckit-uk-gcloud:service-design` and the service's SDD command, so the pricing agrees with the
  SDD's deployment models, education discount, free trial and the Lot 3 role levels.
- Before submission review, so `/arckit-uk-gcloud:review` can check the pricing against the SDD.
- When the lot-wide figures (onboarding table and minimum discount, discount matrix, or rate card)
  need to be set or changed. A re-run updates the existing document rather than overwriting it.

---

## Inputs

| Input | Purpose |
|-------|---------|
| Service design (`SVCD`) | The G-Cloud 15 lot (1a, 1b, 2a, 2b or 3) |
| Service Definition Document (`SDD`) | Deployment models, education discount, free trial and the Lot 3 role levels that deliver the service |
| Lot 3 rate card (`RATE`), if present | The supplier's one card for every Lot 3 service: this command creates or updates it |
| Supplier profile (`SUPP`) | Shared supplier context |
| Other services' pricing documents in the same lot | Lot-wide figures to reuse |
| Competitor benchmark (`GCMP`), if present | Rivals' prices, discount tiers or rate cards to compare with |
| Tender intelligence (`TNDR`), if present | Awarded-value sanity check on the overall price level |

---

## Pricing by Lot

| Lot | What you price | What is scored |
|-----|----------------|----------------|
| **1a / 1b** | A price formula for each deployment model: Baseline Price + Fixed Onboarding Costs − Framework Discount ± Further Supplier-Specific Schemes − Time Limited Discounts, with a link to the baseline price list | Onboarding price (average of a 9-cell scenario table) 5%; minimum discount on baseline prices 5% |
| **2a / 2b** | Unit prices in a pricing document, plus a discount for each of six annual call-off value bands, from under £250,000 to over £5,000,001 | The total of the six band discounts, 80% |
| **3** | One rate card per supplier: a maximum day rate, UK and optionally offshore, for each role level offered on GCA's rate card (9 job families, 58 roles, 222 levels) | The average of all rates on the card, 80% |

The onboarding table and minimum discount (1a/1b), the discount matrix (2a/2b) and the rate card
(Lot 3) are set once per lot and apply to every service you list in it. Lot 1b pricing goes on GCA's
separate, non-public Lot 1b platform.

**Lot 3: one rate card per supplier.** Every Lot 3 listing shows the supplier's whole card: on the
live listings scraped on 7 October 2026 only 2 of the 1,135 suppliers with more than one Lot 3
service show different cards, and the median Lot 3 service shows all 222 role levels. So the card is
a supplier-wide document, `ARC-000-RATE`, which only this command writes. It covers every role level
any Lot 3 service needs; each Lot 3 SDD lists the levels that deliver its service and copies no
rates, and each Lot 3 pricing document summarises the card. Roles outside DDaT, such as procurement
advisers and trainers, are priced at the nearest DDaT role and level, recorded on the card and
stated in the service definition document.

---

## Output Sections

| Section | Purpose |
|---------|---------|
| Pricing summary | What is priced, what is scored and the lot-wide figures |
| Lot section (one of §2–§4) | Price formula and onboarding table (1a/1b); unit prices and discount matrix (2a/2b); a summary of the supplier rate card and this service's role levels on it (3) |
| Education discount and free trial | The two Yes/No answers (free trial on Lots 1a/1b and 2a/2b only) |
| Compliance check | Pass or fail against each pricing rule |
| Pricing document (upload) | What the uploaded pricing document contains |
| Market context | Where every comparison came from |

---

## Rules It Checks

- No "price on application", no "from £x" prices, no minimum-only prices and no unexplained ranges.
- No pricing in the service definition document.
- Prices in GBP, excluding VAT; the 0.75% management charge allowed for inside the prices.
- Lots 2a/2b unit prices and Lot 3 day rates can only go down; the minimum discount and the 2a/2b
  discount matrix are fixed until the framework reopens.
- Lot 3, on the rate card: every rate at least £50 for a 7.5-hour day, travel and subsistence inside
  the M25 included, no risk or contingency uplift, role levels named exactly as GCA's rate card names
  them, and every level a Lot 3 service needs present.

---

## Market Comparison

The overlay bundles no benchmark data. For Lot 3, rates for 12 common role levels are compared with
the market table in the DDaT Rate Card skill (maximum UK rates on 42,893 G-Cloud 15 listings scraped
7 October 2026). Any other comparison, including 2a/2b discount tiers, comes from rival listings in
the service's `/arckit-uk-gcloud:gcloud-competitors` artefact, quoted with the number of listings. Listing
figures are maximums, not what buyers pay, and the command never invents a market figure or fills
one in as your price.

---

## Changed from G-Cloud 14

The minimum and maximum price, pricing unit and billing interval fields have gone. Lot 3 SFIA-level
day rates are replaced by the DDaT rate card. Price was not scored before; now it is.

---

## Related Commands

- `/arckit-uk-gcloud:service-design` - Records the lot this command reads.
- `/arckit-uk-gcloud:sdd-lot1a`, `/arckit-uk-gcloud:sdd-lot1b`, `/arckit-uk-gcloud:sdd-lot2a`, `/arckit-uk-gcloud:sdd-lot2b`,
  `/arckit-uk-gcloud:sdd-lot3` - Create the SDD before pricing; Lot 3's SDD lists the role levels that deliver
  the service.
- `/arckit-uk-gcloud:gcloud-competitors` - Compare with similar live listings.
- `/arckit:tenders` - Awarded-value context for the overall price level.
- `/arckit-uk-gcloud:review` - Checks pricing against the SDD and flags any remaining `[PENDING]`.
