---
type: regex
pattern: '"reason"\s*:\s*"\s*"'
match: not_contains
target:
  source: file
  path: projects/001-benefits-portal/vendors/scores.json
---

When the scorers differ, each moderated criterion carries a reason. The score validator checks the rest of the entry when the file is written.
