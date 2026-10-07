# G-Cloud Submission Pack Guide

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:submission-pack` bundles every document for a G-Cloud 15 (RM1557.15) service into a
submission folder for GCA (the Government Commercial Agency, formerly CCS). It copies the
supplier-wide bid documents and the service's documents, writes the answers ready to copy into GCA's Digital
Platform, and writes a manifest with a lot-specific checklist and the order of work for submitting.
It is an export action: it does not create a new ArcKit document type.

---

## Command

```bash
/arckit:submission-pack <service project or service name>
```

Output:

```text
projects/<NNN>-<service-name>/submission/
projects/<NNN>-<service-name>/submission/manifest.md
projects/<NNN>-<service-name>/submission/answers-export.md
projects/<NNN>-<service-name>/submission/evidence/
```

---

## When to Use

- After `/arckit:review` shows the service is ready or close to ready. The pack is still built
  without a 🟢 READY review, but it warns prominently and lists every unfinished answer, found with
  the same placeholder scan `/arckit:review` runs.
- When supplier-wide and per-service documents need to be assembled for GCA's Digital Platform.

---

## Required Artefacts

| Artefact | Source command |
|----------|----------------|
| `ARC-000-SUPP` | `/arckit:supplier-profile` |
| `ARC-000-SOCV` | `/arckit:social-value` |
| `ARC-000-LOTQ` (the Part for the service's lot group) | `/arckit:lot-questions` |
| `ARC-000-DECL` | `/arckit:declaration` |
| `ARC-<NNN>-SVCD` | `/arckit:service-design` |
| `ARC-<NNN>-SDD` | `/arckit:sdd-lot1a`, `/arckit:sdd-lot1b`, `/arckit:sdd-lot2a`, `/arckit:sdd-lot2b`, or `/arckit:sdd-lot3` |
| `ARC-<NNN>-PRIC` | `/arckit:pricing` |
| `ARC-<NNN>-SECA` | `/arckit:security` |

---

## Pack Contents

- **`answers-export.md`:** the supplier declaration (with the social value sections), the lot
  questions (1a/1b scored answers with word counts) and the service questions and pricing, in GCA's
  order, ready to copy.
- **`manifest.md`:** the copied file list with source ARC IDs, the documents to upload (ODF or
  PDF/A, at most 5 MB, accessible; no prices in the service definition document; a Technical Ability
  Certificate for every lot), a pre-submission checklist for the lot, and the order of work, starting
  with Central Digital Platform registration and the PPON.

---

## Guardrails

- Do not create a service project here; run `/arckit:service-design` first.
- Do not rewrite source documents while assembling the pack.
- The declaration, social value and lot questions are answered once per bid; each service then has
  its own service questions, pricing and documents.
- Treat the pack as an internal aid, not a guarantee of acceptance. Confirm the application window's
  deadline and upload requirements in GCA's tender documents before submitting.

---

## Related Commands

- `/arckit:review` - Readiness check before packing.
- `/arckit:social-value` and `/arckit:lot-questions` - Supplier-wide bid documents the pack requires.
- `/arckit:declaration` - Supplier-wide declaration input.
- `/arckit:security` - Security evidence input.
