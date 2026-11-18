---
type: regex
pattern: '"doc"[\s\S]*"doc"'
match: not_contains
target:
  source: file
  path: projects/001-bramble-cafe/food-safety/sign-offs.json
---

One sign-off was recorded, not two.
