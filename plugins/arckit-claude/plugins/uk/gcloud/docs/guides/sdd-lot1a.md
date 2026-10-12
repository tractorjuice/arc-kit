# G-Cloud Lot 1a Service Definition Guide

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit-uk-gcloud:sdd-lot1a` generates the Service Definition Document (SDD) for a G-Cloud 15 (RM1557.15)
Lot 1a service: Infrastructure as a Service (IaaS) and Platform as a Service (PaaS). It answers every
Lot 1a service question in the question export of GCA (the Government Commercial Agency, formerly
CCS), in the export's order. Options are worded as the live G-Cloud 15 listings show them, which is
what buyers see, with the Digital Platform's wording beside any option it words differently.

---

## Command

```bash
/arckit-uk-gcloud:sdd-lot1a <service project or service name>
```

Output:

```text
projects/<NNN>-<service-name>/ARC-<NNN>-SDD-v1.0.md
```

Template: `sdd-lot1-template.md`, shared with Lot 1b. A copy customised with `/arckit:customize`
(in `.arckit/templates-custom/`) takes precedence.

---

## When to Use

- The service is infrastructure or platform: compute, storage, networking, containers, databases or
  platform services for data up to OFFICIAL.
- You have already created the service project and recorded Lot 1a with `/arckit-uk-gcloud:service-design`.
- You need the answers ready to enter on GCA's Digital Platform, and the source for the service
  definition document you upload.

For data above OFFICIAL use `/arckit-uk-gcloud:sdd-lot1b`; a service designed for another lot is pointed to its
own command.

---

## Inputs

| Input | Purpose |
|-------|---------|
| Supplier profile (`SUPP`) | Certifications, locations, clearances and contacts shared by every service |
| Service design (`SVCD`) | The lot (`**G-Cloud Lot**: Lot 1a — ...`), scope, features, benefits and first-pass categories |
| Existing SDD | On a re-run: confirmed answers are kept, the version is bumped and a Revision History row added |
| Lot questions (`LOTQ`, Part 1) | Optional: the supplier type must agree with the Reseller or Sole Control answer |
| Lot 1a references | `lot-1a-services.md` questions and the Lot 1a category tree (roots IaaS and PaaS) |

---

## Output Sections

| Section | Purpose |
|---------|---------|
| Service attributes, name, about, categories | Lot label, name, description and full-path categories from the Lot 1a tree, all in one category group (`Root > Group`) |
| Features and benefits, scope, reselling | Features, benefits, deployment model, constraints, system requirements and supplier type |
| User support, interfaces, onboarding | Support channels and levels (including AI chatbot), web interface, API, CLI, accessibility |
| Backups, analytics, scaling | Backup and recovery, metrics, FOCUS resource tagging, scaling |
| Security sections | The NCSC cloud security principles: data in transit, asset protection, separation, governance, operational and staff security (including post-quantum cryptography), secure development, identity, audit |
| Energy efficiency, pricing, documents | Energy efficiency, education discount and free trial, and the three uploaded documents |
| Evidence register, External References | Evidence for each assertion and the citation trail |

---

## G-Cloud 15 Rules

- Service name ≤ 100 characters (the name only); description ≤ 500 characters.
- Features, benefits, system requirements and backed-up items: at most 10 each, 10 words each.
- Free-text answers: 50, 100 or 200 words depending on the question, shown on each answer's
  `**Words:**` line, counted by the command after writing and recounted by `/arckit-uk-gcloud:review`. GCA's
  export doesn't state them; they are inferred from the 42,893 live listings (see the
  `gcloud-framework` skill's `framework-questions.md`).
- The uploaded service definition document is ODF or PDF/A, at most 5 MB, accessible, and contains no
  prices.
- Anything unconfirmed is written as `[PENDING]`; `/arckit-uk-gcloud:review` treats it as blocking.

## Not in the SDD

- **Prices:** the Lot 1a price formula (baseline price, fixed onboarding costs, framework discount,
  supplier-specific schemes, time-limited discounts) is set with `/arckit-uk-gcloud:pricing`.
- **Lot questions:** Reseller or Sole Control, the scored Quality Cloud Services and Maximising Buyer
  Value answers, and certifications (including ISO 27018, required for a service that includes public
  cloud unless you resell and rely on the provider's accreditations) are answered once per bid with
  `/arckit-uk-gcloud:lot-questions`.

---

## Related Commands

- `/arckit-uk-gcloud:service-design` - Create the service design and choose the lot first.
- `/arckit-uk-gcloud:sdd-lot1b` - The same questions for services above OFFICIAL.
- `/arckit-uk-gcloud:pricing` - Price the service after the SDD.
- `/arckit-uk-gcloud:security` - Generate the security evidence after the SDD.
- `/arckit-uk-gcloud:lot-questions` - Lot 1a/1b lot questions.
- `/arckit-uk-gcloud:review` - Check completeness before submission to GCA.
