---
type: regex
pattern: '\|\s*FE-\d+\s*\|[^\n]*\|\s*Already raised as (?:(?!lower)[^|\n])*\|\s*$'
match: not_contains
flags: m
target:
  source: file
  path: projects/001-benefits-portal/*ARC-001-HLDR-*.md
---

A finding the review had already raised at the same or a higher severity belongs on the Already raised line, including one the review simply kept at its own higher rating. A row stays in the table only when the finding was added, not accepted, or rated lower than the reviewer rated it, with the reason.
