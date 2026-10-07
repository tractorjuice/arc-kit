# G-Cloud Lot 3 Service Definition Guide

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:sdd-lot3` generates the Service Definition Document and rate card for a G-Cloud 15
(RM1557.15) Lot 3 Cloud Support service. Lot 3 covers managed services, FinOps, migration planning,
set-up and migration, security, QA and testing, training and ongoing support. The command answers
every Lot 3 service question in GCA's question export, in its order, and builds the service's rate
card: each DDaT role level the service offers, with a maximum UK and offshore day rate.

---

## Command

```bash
/arckit:sdd-lot3 <service project or service name>
```

Output:

```text
projects/<NNN>-<service-name>/ARC-<NNN>-SDD-v1.0.md
```

---

## When to Use

- The service design (`/arckit:service-design`) records the service as Lot 3 — Cloud Support.
- You need the Lot 3 service answers ready to enter on GCA's Digital Platform.
- You need to choose the role levels the service offers and check the rate card against GCA's
  rules before pricing.
- Re-run it after `/arckit:pricing` so the SDD's rate card copies the final rates. A re-run keeps
  confirmed answers, bumps the version and adds a Revision History row.

---

## Inputs

| Input | Purpose |
|-------|---------|
| Supplier profile (`SUPP`) | Staff screening, clearances, certifications and contacts |
| Service design (`SVCD`) | Lot, scope, features, benefits, supplier type and the role levels offered |
| Pricing document (`PRIC`), if present | The source of truth for the day rates |
| Lot questions (`LOTQ`), if present | Part 3's mandatory award criteria must agree with the SDD |
| Lot 3 references | GCA's Lot 3 service questions, the Lot 3 category tree and the DDaT rate card (9 job families, 58 roles, 222 role levels) |

---

## Output Sections

| Section | Purpose |
|---------|---------|
| Service attributes, name and description | Lot label, service name (≤ 100 characters) and description (≤ 500 characters) |
| Categories | Full paths from the Lot 3 tree (root Cloud Support Services) |
| Features and benefits | At most 10 each, 10 words each |
| Service scope and reselling | Service constraints and supplier type |
| User support | Email/ticketing, phone, web chat, AI chatbot, accessibility and support levels |
| Staff security | BS7858:2019 screening and the clearance level offered |
| Pricing and documents | Education discount; service definition, terms and pricing documents |
| Rate card | Each role level offered, with maximum UK and offshore day rates and the average day rate as GCA scores it |

---

## G-Cloud 15 Notes

- **Rate card rules:** role levels named exactly as GCA's rate card names them; a maximum day rate
  per level, UK and optionally offshore; £50 minimum; 7.5-hour day; travel and subsistence inside the
  M25 included; no risk or contingency uplift; rates can only go down.
- **Scoring:** Lot 3 price is 80% of the score, on the average of every rate entered, UK and
  offshore. The lowest average in the tender scores the full 80%, so offer only the role levels the
  service needs.
- **Mandatory award criteria:** user support, staff screening and clearance level are scored again
  in the Lot 3 lot questions (2.5% each), so the two documents must agree.
- **Market comparison:** the summary compares rates with the DDaT Rate Card skill's market table for
  common role levels, or with rival listings from `/arckit:gcloud-competitors`. The overlay bundles
  no benchmark data, and market figures never go into the SDD.
- **Uploaded document:** ODF or PDF/A, at most 5 MB, accessible, with no prices.
- **Changed from G-Cloud 14:** the planning, set-up and migration, QA and testing, security testing,
  training and ongoing support question sections are gone (those areas are now categories), and the
  SFIA rate card is replaced by DDaT role levels. SFIA roles in an old SDD are mapped to DDaT role
  levels for the supplier to confirm, never carried over.

---

## Related Commands

- `/arckit:service-design` - Create the service design and choose the lot first.
- `/arckit:pricing` - Set the maximum day rates for the rate card.
- `/arckit:security` - Generate NCSC Cloud Security Principles evidence.
- `/arckit:lot-questions` - Answer the Lot 3 mandatory award criteria and certifications.
- `/arckit:gcloud-competitors` - Compare with similar Lot 3 listings and their rate cards.
- `/arckit:review` - Check readiness before submission.
