---
type: regex
pattern: '"independentScorer"\s*:\s*"completed"'
match: contains
target:
  source: file
  path: projects/001-benefits-portal/vendors/scores.json
---

The vendor's entry records that the independent scorer ran. The score validator checks the rest: every moderated criterion has both scores, a final score that matches the stored one, and a reason.
