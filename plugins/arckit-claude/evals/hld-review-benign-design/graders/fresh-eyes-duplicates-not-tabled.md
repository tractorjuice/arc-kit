---
type: regex
pattern: '\|\s*FE-\d+\s*\|[^\n]*\|\s*Already raised as [A-Z]+-\d+(?:\s*(?:,|and)\s*[A-Z]+-\d+)*\s*\|'
match: not_contains
target:
  source: file
  path: projects/001-benefits-portal/*ARC-001-HLDR-*.md
---

A table row whose whole outcome is "Already raised as X" belongs on the Already raised line. A row stays in the table only when the finding was added, not accepted, or kept at a different severity, with the reason.
