---
type: regex
pattern: '\|\s*FE-0?1\s*\|[^\n]*(Already raised|Added as|Not accepted)'
match: contains
flags: i
target:
  source: file
  path: projects/001-benefits-portal/*ARC-001-HLDR-*.md
---

The fixture design has flaws a fresh reader will find, so there is at least one fresh-eyes finding, and the review must settle it rather than list it. The outcome has to sit in the finding's own table row.
