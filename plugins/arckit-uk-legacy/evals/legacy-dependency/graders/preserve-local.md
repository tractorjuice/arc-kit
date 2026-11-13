---
type: regex
pattern: '(?m)^\| reporting_finding_D7 / reporting \| D7 / rule_D7 \| Accepted \|'
match: contains
target:
  source: file
  path: projects/001-payments/ARC-001-LEGACY-v1.0.md
---

The supplied local finding is preserved separately from the effective dependency result.
