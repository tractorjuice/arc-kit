---
type: regex
pattern: '#+\s*(?:[\d.]+\s*)?Integrity Findings\b(?:(?!\n#).)*?(?:\n|\|\s*)\**None found\b'
match: contains
flags: is
target:
  source: file
  path: projects/001-benefits-portal/vendors/_evaluations/acme-digital/evaluation.md
---

A clean bid picks up no finding from the reader or the independent scorer, so the section can be trusted when it does report one.
