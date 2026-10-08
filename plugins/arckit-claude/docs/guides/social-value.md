# G-Cloud Social Value Guide

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:social-value` creates or updates the supplier's G-Cloud 15 (RM1557.15) social value
commitments: Sections A, B and C and Operational Readiness of the supplier declaration. Social value
is new in G-Cloud 15 and counts for 10% on every lot. It is marked pass/fail: a pass scores the full
10%, and a fail scores 0 and disqualifies the tender. The measures you commit to appear on every one
of your service listings, buyers can filter search results by them, and a buyer can make any of them
a call-off requirement.

---

## Command

```bash
/arckit:social-value [social value, ESG or sustainability page URL]
```

Output:

```text
projects/000-global/supplier/ARC-000-SOCV-v1.0.md
```

---

## When to Use

- After `/arckit:supplier-profile`, before the service designs, and before `/arckit:declaration`,
  which summarises it.
- When social value policies or the Social Value Contact change; a re-run shows what is recorded and
  updates only what you change.

---

## Inputs

| Input | Purpose |
|-------|---------|
| Supplier profile (`SUPP`) | Social value evidence and the Social Value Contact |
| Optional URL | Social value, ESG, careers or sustainability pages read for evidence |
| Social value model | `skills/gcloud-framework/references/g-cloud-15/social-value-model.md`: every mission, policy outcome and measure, worded as the live listings show them. The declaration's Section B checkboxes, in the question export's wording, are longer for 17 of the 76 measures |

---

## Output Sections

| Section | What it asks | Fails the bid if |
|---------|--------------|------------------|
| Section A: Understanding Social Value | Five "do you understand" questions | Any answer is "No" |
| Section B: Commitment for Future: Delivery | Measures from 4 missions and 7 policy outcomes (1–4 and 6–8), with a delivery plan per measure | No measure is selected |
| Section C: Organisational Readiness | A named Social Value Contact | You state you will not have one |
| Operational Readiness | A commitment to report, and five organisational processes | Any answer is "No" |

Commitments are grouped Mission → Policy Outcome → measure, as listings show them, and each measure
is copied word for word from the social value model, which is built from the live listings. GCA's
checkbox on the Digital Platform is longer for 17 of the 76 measures (it adds illustrative examples
or a trailing clause), so the command tells you which checkbox to tick by its opening words. Each
delivery plan records the evidence today, what you will deliver on a call-off, how it is measured,
the owner and the status.

---

## G-Cloud 15 Notes

- The command never answers a pass/fail question for you, and proposes a measure only when it found
  evidence that it already happens. Anything unconfirmed is `[PENDING]`.
- Selecting more measures does not score more; each one is a commitment a buyer can hold you to.

---

## Related Commands

- `/arckit:supplier-profile` - Must be created first.
- `/arckit:lot-questions` - The lot questions for each lot group you bid for.
- `/arckit:declaration` - Its social value section points to this document.
- `/arckit:review` - Checks this document before submission.
- `/arckit:submission-pack` - Includes this document in the submission bundle.
