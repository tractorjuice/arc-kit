# G-Cloud Submission Review Guide

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:review` checks a G-Cloud 15 (RM1557.15) service submission for completeness and internal
consistency before submission to GCA (the Government Commercial Agency, formerly CCS). It validates
the supplier-wide bid documents (supplier profile, social value, lot questions, declaration) and the
service's own documents (service design, SDD, pricing, security) as a joined submission set. A
missing document doesn't stop the review: it is reported as a blocking finding, with the command
that creates it.

---

## Command

```bash
/arckit:review <service project or service name> [full|completeness|consistency|readiness]
```

Output:

```text
projects/<NNN>-<service-name>/ARC-<NNN>-GCRV-v1.0.md
```

---

## When to Use

- After supplier-wide and service-specific documents are drafted.
- Before `/arckit:submission-pack`, which warns unless the review is 🟢 READY.
- When there are multiple revisions and you need a single readiness view.
- Before copying answers into GCA's Digital Platform.

---

## Required Artefacts

| Artefact | Command |
|----------|---------|
| `ARC-000-SUPP` | `/arckit:supplier-profile` |
| `ARC-000-SOCV` | `/arckit:social-value` |
| `ARC-000-LOTQ` (the Part for the service's lot group) | `/arckit:lot-questions` |
| `ARC-000-DECL` | `/arckit:declaration` |
| `ARC-<NNN>-SVCD` (records the lot) | `/arckit:service-design` |
| `ARC-<NNN>-SDD` | `/arckit:sdd-lot1a`, `/arckit:sdd-lot1b`, `/arckit:sdd-lot2a`, `/arckit:sdd-lot2b`, or `/arckit:sdd-lot3` |
| `ARC-<NNN>-PRIC` | `/arckit:pricing` |
| `ARC-<NNN>-SECA` | `/arckit:security` |

---

## Review Areas

- A valid G-Cloud 15 lot (`1a`, `1b`, `2a`, `2b` or `3`), the same in every document.
- Every question in the lot's service questions answered; supplier type given on every lot.
- Social value: contact named, at least one Model Award Criteria activity, evidence for each
  commitment.
- Lot questions: 1a/1b conditions of participation, scored answers (250 words per part) and
  certification conditions; 2a/2b and Lot 3 mandatory award criteria.
- The lot's mandatory certifications: Cyber Essentials Plus for 1a/1b, Cyber Essentials for 2a/2b
  and 3.
- Limits, numerically: name 100 characters, description 500 characters, features and benefits 10
  items of 10 words.
- Pricing rules by lot, and no forbidden pricing ("price on application", "from £x", unexplained
  ranges).
- Cross-document consistency, naming both `ARC-` IDs in every conflict.
- Every `[PENDING]` value is a blocking finding.
- An action plan naming the `ARC-` ID and the command to re-run.

---

## Related Commands

- `/arckit:gcloud-competitors` - Run benchmark analysis before final review.
- `/arckit:social-value` and `/arckit:lot-questions` - Create the supplier-wide documents the review checks.
- `/arckit:submission-pack` - Bundle the documents after review.
- `/arckit:risk` - Track material submission or delivery risks.
