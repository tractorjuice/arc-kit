# G-Cloud Lot 2b Service Definition Guide

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:sdd-lot2b` generates the Service Definition Document (SDD) for a G-Cloud 15 (RM1557.15)
Lot 2b service: Software as a Service (SaaS). Lot 2b is applications hosted in the cloud:
collaboration, CRM, finance, HR, procurement, content, engineering, public sector operations, and
analytics, data and AI tools. The command answers every Lot 2b service question in the question
export of GCA (the Government Commercial Agency, formerly CCS), in its order.

---

## Command

```bash
/arckit:sdd-lot2b <service project or service name>
```

Output:

```text
projects/<NNN>-<service-name>/ARC-<NNN>-SDD-v1.0.md
```

Template: `sdd-lot2-template.md`, shared with Lot 2a. A copy customised with `/arckit:customize`
(in `.arckit/templates-custom/`) takes precedence.

---

## When to Use

- The service is a business application delivered as a service.
- You have already created the service project and recorded Lot 2b with `/arckit:service-design`.
- A design from the previous framework's "Lot 2 - Cloud Software" prompts a choice between 2a and 2b.

For infrastructure software (iSaaS) use `/arckit:sdd-lot2a`.

---

## Inputs

| Input | Purpose |
|-------|---------|
| Supplier profile (`SUPP`) | Certifications, locations, clearances and contacts shared by every service |
| Service design (`SVCD`) | The lot (`**G-Cloud Lot**: Lot 2b — ...`), scope, features, benefits and first-pass categories |
| Existing SDD | On a re-run: confirmed answers are kept and the version bumped; an SDD from the previous framework never carries its categories over |
| Lot questions (`LOTQ`, Part 2) | Optional: four answers are scored again as mandatory award criteria and must agree |
| Lot 2b references | `lot-2b-services.md` questions and the Lot 2b category tree (roots Applications and Application Development and Deployment) |

---

## Output Sections

| Section | Purpose |
|---------|---------|
| Service attributes, name, about, categories | Lot label, name, description, full-path categories from the Lot 2b tree, all in one category group (`Root > Group`), and multi cloud support |
| Features and benefits, scope, reselling | Features, benefits, whether it is an add-on, deployment model, constraints, system requirements and supplier type |
| User support, interfaces, onboarding | Support channels and levels (including AI chatbot), browsers, apps, API, accessibility |
| Data import and export, analytics, scaling | Data formats, metrics, FOCUS resource tagging, scaling |
| Public sector networks | The networks the service connects to |
| Security sections | The NCSC cloud security principles, including the Software Security Code of Practice and post-quantum cryptography |
| Pricing, documents | Education discount and free trial, and the three uploaded documents |
| Evidence register, External References | Evidence for each assertion and the citation trail |

---

## G-Cloud 15 Rules

- Service name ≤ 100 characters (the name only); description ≤ 500 characters.
- Features, benefits and system requirements: at most 10 each, 10 words each.
- Free-text answers: 50, 100 or 200 words depending on the question, shown on each answer's
  `**Words:**` line, counted by the command after writing and recounted by `/arckit:review`. GCA's
  export doesn't state them; they are inferred from the 42,893 live listings (see the
  `gcloud-framework` skill's `framework-questions.md`).
- User support, data storage and processing locations, penetration testing frequency and data
  sanitisation are scored again (2.5% each) as mandatory award criteria in the lot questions, so the
  answers must match.
- The uploaded service definition document is ODF or PDF/A, at most 5 MB, accessible, and contains no
  prices.

## Not in the SDD

- **Prices:** unit prices and the discount for each annual call-off value band are set with
  `/arckit:pricing`; price is 80% of the Lot 2b score.
- **Lot questions:** the mandatory award criteria and certifications (Cyber Essentials is mandatory)
  are answered once per bid with `/arckit:lot-questions`.

---

## Related Commands

- `/arckit:service-design` - Create the service design and choose the lot first.
- `/arckit:sdd-lot2a` - The same questions for infrastructure software (iSaaS).
- `/arckit:pricing` - Price the service after the SDD.
- `/arckit:security` - Generate the security evidence after the SDD.
- `/arckit:lot-questions` - Lot 2a/2b lot questions.
- `/arckit:review` - Check completeness before submission to GCA.
