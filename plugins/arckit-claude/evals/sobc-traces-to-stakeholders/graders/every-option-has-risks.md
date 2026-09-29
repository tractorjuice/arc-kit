---
type: regex
pattern: "^#{3,4} Option \\d+[^\\n]*\\n(?:(?!^#{3,4} Option \\d)(?!^#{1,2} )(?!\\*\\*(?:Key )?Risks?\\b)(?!#{4,5} (?:Key )?Risks?\\b)[\\s\\S])*(?=^#{3,4} Option \\d|^#{1,2} |\\Z)"
match: not_contains
flags: im
target:
  source: file
  path: projects/001-benefits-portal/ARC-001-SOBC-v1.0.md
---

Every option carries its own Risks, as the command requires ("For EACH option: … Risks"). The template's third example option had none, and every run on that template (6 of 6, on Opus 5.5 and Sonnet 5.5 at `high` and `max`) left Risks off Option 3.
