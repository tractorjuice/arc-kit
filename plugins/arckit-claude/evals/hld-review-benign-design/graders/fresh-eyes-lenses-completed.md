---
type: regex
pattern: 'Comprehension\s*\|\s*Completed.*?Principles\s*\|\s*Completed.*?Requirements\s*\|\s*Completed'
match: contains
flags: is
target:
  source: file
  path: projects/001-benefits-portal/*ARC-001-HLDR-*.md
---

All three lenses report back on a design this size. A lens marked "Not run" here means a reviewer failed twice or the step was skipped.
