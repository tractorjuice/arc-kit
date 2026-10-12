# G-Cloud Lot 3 Service Definition Guide

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:sdd-lot3` generates the Service Definition Document for a G-Cloud 15 (RM1557.15) Lot 3
Cloud Support service. Lot 3 covers managed services, FinOps, migration planning, set-up and
migration, security, QA and testing, training and ongoing support. The command answers every Lot 3
service question in GCA's question export, in its order, and lists the DDaT role levels that deliver
the service. It sets no rates: Lot 3 is priced on the supplier's one rate card (`ARC-000-RATE`),
which `/arckit:pricing` owns and every Lot 3 listing shows in full.

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
- You need to name the role levels that deliver the service and check they are on the supplier's
  rate card.
- Re-run it after `/arckit:pricing` adds this service's missing levels to the card, so section 11
  marks them as on it. A re-run keeps confirmed answers, bumps the version and adds a Revision History
  row.

---

## Inputs

| Input | Purpose |
|-------|---------|
| Supplier profile (`SUPP`) | Staff screening, clearances, certifications and contacts |
| Service design (`SVCD`) | Lot, scope, features, benefits, supplier type and the role levels offered |
| Lot 3 rate card (`RATE`), if present | The supplier's one card: checked to cover this service's role levels, never copied |
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
| Role levels and the rate card | Each DDaT role level that delivers the service, any role outside DDaT mapped to its nearest level, and whether each is on the supplier's rate card; no rates |

---

## G-Cloud 15 Notes

- **One rate card per supplier:** every Lot 3 listing shows the supplier's whole card, and on the
  live listings scraped on 7 October 2026 only 2 of the 1,135 suppliers with more than one Lot 3
  service show different cards. The SDD lists the role levels that deliver the service, named
  exactly as GCA's rate card names them, and copies no rates, which keeps it from disagreeing with
  the card. `/arckit:pricing` sets the rates on the card.
- **Roles outside DDaT:** a procurement or commercial adviser, a trainer or a similar role is listed
  at the nearest DDaT role and level by its work and seniority, and the service definition document
  says which level it is priced at.
- **Scoring:** Lot 3 price is 80% of the score, on the average of every rate on the card, UK and
  offshore. The lowest average in the tender scores the full 80%.
- **Mandatory award criteria:** user support, staff screening and clearance level are scored again
  in the Lot 3 lot questions (2.5% each), so the two documents must agree.
- **Word limits:** 50, 100 or 200 words on each free-text answer, shown on its `**Words:**` line,
  counted by the command after writing and recounted by `/arckit:review`. GCA's export doesn't state
  them; they are inferred from the 42,893 live listings.
- **Uploaded document:** ODF or PDF/A, at most 5 MB, accessible, with no prices.
- **Changed from G-Cloud 14:** the planning, set-up and migration, QA and testing, security testing,
  training and ongoing support question sections are gone (those areas are now categories), and the
  SFIA rate card is replaced by one DDaT rate card per supplier. SFIA roles in an old SDD are mapped
  to DDaT role levels for the supplier to confirm, never carried over.

---

## Related Commands

- `/arckit:service-design` - Create the service design and choose the lot first.
- `/arckit:pricing` - Build or update the supplier's one Lot 3 rate card and set its day rates.
- `/arckit:security` - Generate NCSC Cloud Security Principles evidence.
- `/arckit:lot-questions` - Answer the Lot 3 mandatory award criteria and certifications.
- `/arckit:gcloud-competitors` - Compare with similar Lot 3 listings and their rate cards.
- `/arckit:review` - Check readiness before submission.
