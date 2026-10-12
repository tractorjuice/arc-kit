# G-Cloud Supplier Declaration Guide

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit-uk-gcloud:declaration` prepares the G-Cloud 15 (RM1557.15) supplier declaration for the supplier to
confirm and sign. G-Cloud 15 is run under the Procurement Act 2023, so the declaration builds on the
supplier's core supplier information on the Central Digital Platform (CDP): the supplier registers
there, gets a 12-character PPON, and declares any exclusion grounds (Schedules 6 and 7 of the Act).
The declaration then asks one question about those grounds, rather than listing them.

It is a company-wide document covering every lot bid for, and it **never answers a declaration for
you**: facts such as names and addresses are pre-filled for you to confirm, every declaration answer
is recorded exactly as you give it, and anything unanswered stays `[PENDING]`, never a default "Yes"
or "No".

---

## Command

```bash
/arckit-uk-gcloud:declaration
```

Output:

```text
projects/000-global/supplier/ARC-000-DECL-v1.0.md
```

---

## When to Use

- After `/arckit-uk-gcloud:supplier-profile`, once the supplier is registered on the CDP (the command still
  drafts the other sections if CDP information is incomplete).
- After `/arckit-uk-gcloud:social-value`, whose answers the declaration summarises.
- When CDP information, subcontractors, payment performance or contacts change; a re-run updates
  the existing declaration and bumps its version.
- Before `/arckit-uk-gcloud:review` and `/arckit-uk-gcloud:submission-pack`.

---

## Inputs

| Input | Purpose |
|-------|---------|
| Supplier profile (`SUPP`) | Company identity, CDP details, parent companies, contacts, insurance, payment performance, modern slavery |
| Social value (`SOCV`) | Summarised in the declaration's social value section |
| Lot questions (`LOTQ`) and service designs (`SVCD`) | The lots bid for, which set the insurance and certificate levels at award |
| GCA question export | `skills/gcloud-framework/references/g-cloud-15/declaration.md`, in the export's order |

---

## Output Sections

| Section | Purpose |
|---------|---------|
| Central Digital Platform | Registration, PPON (format-checked), share code, generic published contact details |
| 1–2. Parent companies | Ultimate and immediate parent details |
| 3. Tender information | Single supplier or consortium; members' PPONs, share codes, roles, associated persons, debarment list |
| 4. Exclusion grounds | Whether you or a connected person declared any Schedule 6 or 7 ground on the CDP |
| 5. Subcontractors | Including key subcontractors and associated persons |
| 6. Legal capacity | UK GDPR (pass/fail), with the evidence available on request |
| 7. Payments above £5m a year | Supply chain payment confirmations and figures, and which pass route they meet |
| 8. Modern slavery | Section 54 status and which elements (a) to (f) the statement covers |
| 9. Social value | Summary of the SOCV document |
| 10. Third-party agents or bid writers | Shown verbatim; the supplier decides and answers it |
| 11–14. Award form, connected persons, confirmation, mandatory award question | Contacts, at-risk connected persons, the signatory (never ticked), the pass/fail award question |
| Evidence at Framework Award | Certificates per lot and insurance levels, with any shortfall against the profile |

---

## G-Cloud 15 Notes

- **Third-party agents or bid writers.** The command shows the question and tells you that a
  bid-writing agency, or an AI drafting tool such as ArcKit, may be relevant to it. You decide and
  answer it; if unsure, ask GCA through the Digital Platform.
- **Insurance at framework award** (not a declaration question):

| Insurance | Lots 1a, 2a, 2b and 3 | Lot 1b |
|-----------|-----------------------|--------|
| Employer's (compulsory) liability | £5,000,000 | £5,000,000 |
| Public liability | £1,000,000 minimum | £20,000,000 |
| Professional indemnity | £1,000,000 | £50,000,000 |

- **Changed from G-Cloud 14:** the Public Contracts Regulations 2015 exclusion grounds, the insurance
  question, and the service type and reselling questions are gone from the declaration. Reselling is
  asked in the lot questions and per service.

---

## Related Commands

- `/arckit-uk-gcloud:supplier-profile` - Supplier-wide source evidence; run first.
- `/arckit-uk-gcloud:social-value` - The declaration's social value questions.
- `/arckit-uk-gcloud:lot-questions` - Lot-specific conditions of participation and certificates.
- `/arckit-uk-gcloud:review` - Validate the complete submission set.
- `/arckit-uk-gcloud:submission-pack` - Bundle approved files for upload.
