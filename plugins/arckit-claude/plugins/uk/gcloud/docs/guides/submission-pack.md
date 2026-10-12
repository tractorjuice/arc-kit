# G-Cloud Submission Pack Guide

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit-uk-gcloud:submission-pack` bundles every document for a G-Cloud 15 (RM1557.15) service into a
submission folder for GCA (the Government Commercial Agency, formerly CCS). It copies the
supplier-wide bid documents and the service's documents, writes the answers ready to copy into GCA's Digital
Platform, and writes a manifest with a lot-specific checklist and the order of work for submitting.
It is an export action: it does not create a new ArcKit document type.

---

## Command

```bash
/arckit-uk-gcloud:submission-pack <service project or service name>
```

Output:

```text
projects/<NNN>-<service-name>/submission/
projects/<NNN>-<service-name>/submission/manifest.md
projects/<NNN>-<service-name>/submission/answers-export.md
projects/<NNN>-<service-name>/submission/evidence/
projects/000-global/supplier/submission/bid-answers.md   (once per bid, shared by every service)
```

---

## When to Use

- After `/arckit-uk-gcloud:review` shows the service is ready or close to ready. The pack is still built
  without a 🟢 READY review, but it warns prominently and lists every unfinished answer, found with
  the same placeholder scan `/arckit-uk-gcloud:review` runs, and every document written for the previous
  framework.
- When supplier-wide and per-service documents need to be assembled for GCA's Digital Platform.

---

## Required Artefacts

| Artefact | Source command |
|----------|----------------|
| `ARC-000-SUPP` | `/arckit-uk-gcloud:supplier-profile` |
| `ARC-000-SOCV` | `/arckit-uk-gcloud:social-value` |
| `ARC-000-LOTQ` (the Part for the service's lot group) | `/arckit-uk-gcloud:lot-questions` |
| `ARC-000-DECL` | `/arckit-uk-gcloud:declaration` |
| `ARC-<NNN>-SVCD` | `/arckit-uk-gcloud:service-design` |
| `ARC-<NNN>-SDD` | `/arckit-uk-gcloud:sdd-lot1a`, `/arckit-uk-gcloud:sdd-lot1b`, `/arckit-uk-gcloud:sdd-lot2a`, `/arckit-uk-gcloud:sdd-lot2b`, or `/arckit-uk-gcloud:sdd-lot3` |
| `ARC-<NNN>-PRIC` | `/arckit-uk-gcloud:pricing` |
| `ARC-000-RATE` (Lot 3 only: the supplier's one rate card) | `/arckit-uk-gcloud:pricing` |
| `ARC-<NNN>-SECA` | `/arckit-uk-gcloud:security` |

---

## Pack Contents

- **`answers-export.md`:** this service's questions and pricing, in GCA's order, ready to copy, with
  a pointer to the bid answers.
- **`bid-answers.md`** (in `projects/000-global/supplier/submission/`, once per bid): the supplier
  declaration (with the social value sections), the lot questions (1a/1b scored answers with word
  counts) and the Lot 3 rate card. It is written once and refreshed only when a supplier-level
  document changes, so the same answers aren't copied into every service's export.
- **`manifest.md`:** the copied file list with source ARC IDs, the documents to upload (ODF or
  PDF/A, at most 5 MB, accessible; no prices in the service definition document; a Technical Ability
  Certificate for every lot; a pricing document on Lots 1a/1b and 2a/2b, optional on Lot 3), a
  pre-submission checklist for the lot, and the order of work, starting with Central Digital
  Platform registration and the PPON.

---

## Guardrails

- Do not create a service project here; run `/arckit-uk-gcloud:service-design` first.
- Do not rewrite source documents while assembling the pack.
- The declaration, social value and lot questions are answered once per bid; each service then has
  its own service questions, pricing and documents.
- Treat the pack as an internal aid, not a guarantee of acceptance. Confirm the application window's
  deadline and upload requirements in GCA's tender documents before submitting.

---

## Related Commands

- `/arckit-uk-gcloud:review` - Readiness check before packing.
- `/arckit-uk-gcloud:social-value` and `/arckit-uk-gcloud:lot-questions` - Supplier-wide bid documents the pack requires.
- `/arckit-uk-gcloud:declaration` - Supplier-wide declaration input.
- `/arckit-uk-gcloud:security` - Security evidence input.
