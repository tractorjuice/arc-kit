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
| `ARC-000-RATE` (Lot 3 only: the supplier's one rate card) | `/arckit:pricing` |
| `ARC-<NNN>-SECA` | `/arckit:security` |

---

## Review Areas

- A valid G-Cloud 15 lot (`1a`, `1b`, `2a`, `2b` or `3`), the same in every document.
- Every question in the lot's service questions answered; supplier type given on every lot.
- Every category under one root and one group (`Root > Group`); a service whose categories span
  groups is blocking.
- Social value: contact named, at least one Model Award Criteria activity, evidence for each
  commitment.
- Lot questions: 1a/1b conditions of participation, scored answers (250 words per part) and
  certification conditions; 2a/2b and Lot 3 mandatory award criteria.
- The certificates the bid needs (Lots 1a/1b: ISO 9001, 27001, 20000-1, ISO 27018 with public cloud,
  and a Carbon Reduction Plan). A missing Cyber Essentials Plus (1a/1b) or Cyber Essentials (2a/2b,
  3) is reported as a call-off warning, not a blocking finding: both are mandatory for call-offs,
  not for the bid.
- Limits, numerically: name 100 characters, description 500 characters, features and benefits 10
  items of 10 words, and every free-text answer recounted against the 50, 100 or 200-word limit on
  its `**Words:**` line (inferred from the live listings, because GCA's export doesn't state them).
  An SDD written before the counters existed is reported, and its answers counted against
  `framework-questions.md`.
- Pricing rules by lot, and no forbidden pricing ("price on application", "from £x", unexplained
  ranges). Lot 3 is priced on the supplier's one rate card (`ARC-000-RATE`), which must cover every
  role level the SDD lists; the SDD holds no rates.
- Cross-document consistency, naming both `ARC-` IDs in every conflict. The SDD is checked against
  the pricing document as `/arckit:pricing` relies on it to be: the education discount, the free
  trial (answer, description and link), the Lot 1a/1b deployment models priced, the Lot 3 role
  levels against the supplier's rate card, and the lot-wide figures across the supplier's services.
- Documents left over from the previous framework, found by their structure: a title or Framework
  row naming an earlier G-Cloud, a three-lot Lot value or a "1.3 Target Lot" checkbox, an SFIA rate
  card, the old minimum and maximum price fields, a supplier profile with no Central Digital
  Platform or PPON section. Each is blocking, even though the file exists; a G-Cloud 15 document
  that only mentions what changed isn't reported.
- Every unfinished answer is a blocking finding: `[PENDING]` in any form (`[PENDING: …]`,
  `[PENDING — …]`), older markers such as `[TODO]`, `[TBC]` or `*[TO BE ADDED]*`, and template fields
  never filled in. The command finds them with the same placeholder scan `/arckit:submission-pack`
  runs; the Document Control approval rows and the Revision History are not bid answers and are left
  out.
- An action plan naming the `ARC-` ID and the command to re-run.

---

## Related Commands

- `/arckit:gcloud-competitors` - Run benchmark analysis before final review.
- `/arckit:social-value` and `/arckit:lot-questions` - Create the supplier-wide documents the review checks.
- `/arckit:submission-pack` - Bundle the documents after review.
- `/arckit:risk` - Track material submission or delivery risks.
