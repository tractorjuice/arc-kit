---
type: regex
pattern: '\*\*Status:?\*\*:?\s*(?:\[[xX]\]\s*)?\*{0,2}(?:REJECTED|APPROVED WITH CONDITIONS|NEEDS HLD RE-REVIEW)'
match: contains
target:
  source: file
  path: projects/001-benefits-portal/*ARC-001-DLDR-*.md
---

Two conditions are unmet and a new store of personal data appears, so the design can't be approved outright.
