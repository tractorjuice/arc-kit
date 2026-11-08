---
type: regex
pattern: '#+[^\n]*Moderation\b(?:(?!\n#).)*?Independent scorer:\s*\**Completed'
match: contains
flags: is
target:
  source: file
  path: projects/001-benefits-portal/vendors/_evaluations/acme-digital/evaluation.md
---

The evaluation's Moderation section says the independent scorer ran. "Not run" here means it failed twice or was skipped.
