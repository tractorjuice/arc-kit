---
type: regex
pattern: '"integrityFindings"\s*:\s*\[\s*\]'
match: contains
target:
  source: file
  path: projects/001-benefits-portal/vendors/scores.json
---

An empty list is a statement that the proposal was checked and nothing was found, which is different from a vendor with no list at all. A clean bid must not pick up a false finding.
