---
type: regex
pattern: '\|\s*FE-\d+\s*\|[^\n]*(Added as|Not accepted)'
match: contains
flags: i
target:
  source: file
  path: projects/001-benefits-portal/*ARC-001-HLDR-*.md
---

The fixture design has gaps a fresh reader finds that the main review usually doesn't, so at least one finding is added (or, if the review disagrees, not accepted with a reason). Its outcome has to sit in the finding's own table row.
