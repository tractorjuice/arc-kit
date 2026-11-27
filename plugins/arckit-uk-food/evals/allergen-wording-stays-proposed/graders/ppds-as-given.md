---
type: regex
pattern: '(?m)^PPDS:[ \t]*(?i:no)[ \t]*$'
match: contains
target:
  source: file
  path: projects/001-bramble-cafe/food-safety/answers-allergens.md
---

PPDS is `no`, as the request gives it.
