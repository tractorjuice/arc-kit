# G-Cloud Lot Questions Guide

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit-uk-gcloud:lot-questions` answers the G-Cloud 15 (RM1557.15) lot questions for each lot group the
supplier bids for. G-Cloud 15 scores bids, and most of the quality score comes from these questions.
They are answered once per supplier for each lot group, not per service, so they live in one
supplier-wide document with one Part per lot group bid for.

---

## Command

```bash
/arckit-uk-gcloud:lot-questions [1a | 1b | 2a | 2b | 3 | all]
```

Output:

```text
projects/000-global/supplier/ARC-000-LOTQ-v1.0.md
```

Without arguments, the command asks, suggesting the lots your service designs record. A re-run for
another lot group adds its Part and bumps the version.

---

## When to Use

- After the SDDs: run it once the services in the lot group have their service designs, SDDs,
  pricing and security documents. They supply the evidence, and the Lot 2a/2b and Lot 3 award
  criteria repeat their answers, so the lot answers must agree with every service. Without them the
  command drafts only what the profile supports and marks the rest
  `[PENDING: check against the SDD]`.
- A design that records no G-Cloud 15 lot (a G-Cloud 14 design, or one saying `Lot 2`) is left out
  of every lot group, and you are told to re-run `/arckit-uk-gcloud:service-design` for it.
- When a service is added to a lot group or an SDD changes, so the lot answers stay true for every
  service.

---

## Inputs

| Input | Purpose |
|-------|---------|
| Supplier profile (`SUPP`) | Certificates, clearances, Carbon Reduction Plan |
| Service documents (`SVCD`, `SDD`, `SECA`, `PRIC`) | Evidence for the written answers and award criteria, for every service in the group |
| Social value (`SOCV`) | Reported in the quality score tables |
| GCA lot questions | `skills/gcloud-framework/references/g-cloud-15/lot-{1,2,3}-lot-questions.md` |

---

## Output Sections

| Part | What it covers | Weight |
|------|----------------|--------|
| Part 1: Lots 1a and 1b (IaaS and PaaS) | Conditions of participation (reseller or sole control, ISO certificates including ISO 27018 where services include public cloud, Carbon Reduction Plan, Cyber Essentials Plus); two written quality questions; non-scored mandatory questions; standards | Quality Cloud Services 40%, Maximising Buyer Value 40% |
| Part 2: Lots 2a and 2b (iSaaS and SaaS) | User support, asset protection (data location), penetration testing frequency, data sanitisation; Cyber Essentials (mandatory for call-offs); other standards | 2.5% each |
| Part 3: Lot 3 (Cloud Support) | User support, staff security clearance checks, clearance level, Cyber Essentials if a buyer requires it; Cyber Essentials (mandatory for call-offs); other standards | 2.5% each |

Each Part also lists the evidence used and the items requiring attention. Social value (10% on every
lot) is handled by `/arckit-uk-gcloud:social-value`, and price by `/arckit-uk-gcloud:pricing`.

---

## G-Cloud 15 Notes

- **Lots 1a and 1b written answers.** Each part is marked only on whether it fully addresses what it
  asks: Quality Cloud Services has two parts worth 20% of the total score each, Maximising Buyer
  Value three parts worth about 13.3% each. Each part is limited to 250 words (500 and 750 for the
  two questions). The command drafts each part from your evidence with a checklist and counts the
  words. A mark of zero on either question disqualifies the tender for Lots 1a and 1b.
- **Lots 2a, 2b and 3 award criteria.** Each criterion is marked by the option chosen. A "No" scores
  zero and loses that criterion's 2.5%; a tender marking under 33 on all four criteria is
  disqualified (Attachment 2d and Attachment 2's rule for these lots). The answer covers all your
  services in the lot, so the command checks it against every service's SDD and flags any service
  that disagrees.
- **Where GCA's later documents win.** ISO 27018 is mandatory for Lots 1a and 1b whenever services
  include public cloud, and Cyber Essentials is mandatory for call-offs under Lots 2a, 2b and 3.
- **Cyber Essentials is a call-off condition, not a bid condition.** Cyber Essentials Plus (Lots
  1a/1b) and Cyber Essentials (2a, 2b and 3) are mandatory for call-off contracts (Framework
  Schedule 1 v2.1), but Attachment 2 v5.0 doesn't make them conditions of the tender, and 769 Lot 2b
  and 1,977 Lot 3 listings are live with "Cyber essentials: No" and "None of the criteria". A
  missing certificate is reported under Call-off Warnings, not Would Fail as Written. The
  alternatives use the live listings' wording: "within 12 months of the date of award" on Lots 2a,
  2b and 3, the export's "by the date of framework award" on Lots 1a/1b.
- Conditions of participation and declarations such as NCSC adherence are never answered for you;
  anything the evidence doesn't support is `[PENDING]`.

---

## Related Commands

- `/arckit-uk-gcloud:supplier-profile` - Must be created first; supplies certificates and clearances.
- `/arckit-uk-gcloud:social-value` - The social value answers, worth 10% on every lot.
- `/arckit-uk-gcloud:service-design` - Records each service's lot.
- `/arckit-uk-gcloud:security` - Security evidence the written answers draw on.
- `/arckit-uk-gcloud:pricing` - The price questions.
- `/arckit-uk-gcloud:declaration` - The supplier declaration.
- `/arckit-uk-gcloud:review` - Checks word limits and consistency before submission.
