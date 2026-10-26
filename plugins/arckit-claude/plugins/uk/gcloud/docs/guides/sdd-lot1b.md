# G-Cloud Lot 1b Service Definition Guide

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit-uk-gcloud:sdd-lot1b` generates the Service Definition Document (SDD) for a G-Cloud 15 (RM1557.15)
Lot 1b service: IaaS and PaaS above OFFICIAL. Lot 1b covers the same infrastructure and platform
services as Lot 1a, for buyers whose data is classified above OFFICIAL. GCA (the Government Commercial
Agency, formerly CCS) asks it the same service questions as Lot 1a, except that staff clearance can
only be "Up to Security Clearance (SC)" or "Up to Developed Vetting (DV)".

---

## Command

```bash
/arckit-uk-gcloud:sdd-lot1b <service project or service name>
```

Output:

```text
projects/<NNN>-<service-name>/ARC-<NNN>-SDD-v1.0.md
```

Template: `sdd-lot1-template.md`, shared with Lot 1a. A copy customised with `/arckit:customize`
(in `.arckit/templates-custom/`) takes precedence.

---

## When to Use

- The service is infrastructure or platform for data classified above OFFICIAL (SECRET or TOP
  SECRET).
- You have already created the service project and recorded Lot 1b with `/arckit-uk-gcloud:service-design`.
- Your staff can be offered at SC or DV.

A service that handles only OFFICIAL data belongs in Lot 1a: the command points it to
`/arckit-uk-gcloud:sdd-lot1a`.

---

## Inputs

| Input | Purpose |
|-------|---------|
| Supplier profile (`SUPP`) | Certifications, clearances and contacts shared by every service |
| Service design (`SVCD`) | The lot (`**G-Cloud Lot**: Lot 1b — ...`), the highest classification handled, scope and features |
| Existing SDD | On a re-run: confirmed answers are kept, the version is bumped and a Revision History row added |
| Lot questions (`LOTQ`, Part 1) | Optional: the supplier type must agree with the Reseller or Sole Control answer |
| Lot 1b references | `lot-1b-services.md` questions and the Lot 1a category tree, which Lot 1b shares |

---

## What It Checks

1. The service design is for Lot 1b.
2. The service handles data above OFFICIAL, and the highest classification is recorded.
3. The staff clearance offered (question 19.2) is SC or DV; anything else is reported as a blocker.
4. Whether the service needs ISO 27018, which Lots 1a and 1b both require for a service that
   includes public cloud.

Lot 1b isn't in the public marketplace search, so research uses comparable Lot 1a listings
(`iaas-and-paas`).

---

## Output Sections

| Section | Purpose |
|---------|---------|
| Lot 1b readiness (summary) | Classification, clearance offered and ISO 27018 position |
| Service sections | Every Lot 1a/1b service question, as for `/arckit-uk-gcloud:sdd-lot1a` |
| Evidence register, External References | Evidence for each assertion and the citation trail |

---

## Lot 1b Specifics

- **ISO 27018:** required on Lots 1a and 1b for any service that includes public cloud, unless you
  resell and rely on the cloud provider's accreditations; a private-cloud-only service doesn't need
  it. It is answered in the lot questions, not the SDD.
- **Prices:** go on GCA's separate, non-public platform; prepare them with `/arckit-uk-gcloud:pricing`.
- **Listings:** Lot 1b services are not in the public Digital Marketplace search.
- **Limits** are the same as Lot 1a: name ≤ 100 characters, description ≤ 500 characters, at most 10
  features and benefits of 10 words each, the 50, 100 or 200-word limit on each free-text answer's
  `**Words:**` line, and no prices in the uploaded service definition document.

---

## Related Commands

- `/arckit-uk-gcloud:service-design` - Create the service design and choose the lot first.
- `/arckit-uk-gcloud:sdd-lot1a` - The same questions for services up to OFFICIAL.
- `/arckit-uk-gcloud:lot-questions` - Lot 1a/1b lot questions, including the Lot 1b question and ISO 27018.
- `/arckit-uk-gcloud:pricing` - Price the service after the SDD.
- `/arckit-uk-gcloud:security` - Generate the security evidence after the SDD.
- `/arckit-uk-gcloud:review` - Check completeness before submission to GCA.
