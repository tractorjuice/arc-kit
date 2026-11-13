---
type: regex
pattern: '\|\s*FE-\d+\s*\|[^\n]*Added as BLOCKING-'
match: not_contains
target:
  source: file
  path: projects/001-benefits-portal/*ARC-001-HLDR-*.md
---

The test of over-acceptance. Fresh reviewers will always find something to say about a good design; a fresh-eyes finding promoted to a blocking issue on this design means the review deferred to a nitpick instead of weighing it.
