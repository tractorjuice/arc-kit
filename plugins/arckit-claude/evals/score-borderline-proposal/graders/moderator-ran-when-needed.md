---
type: regex
pattern: '"moderator"\s*:\s*"not run'
match: not_contains
target:
  source: file
  path: projects/001-benefits-portal/vendors/scores.json
---

When the scores differ the moderator settles them; "not run" means it failed twice and the command's own score stood by default.
