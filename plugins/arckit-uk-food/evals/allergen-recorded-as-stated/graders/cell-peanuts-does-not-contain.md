---
type: regex
pattern: '(?m)^Peanuts:[ \t]*(?i:does not contain)[ \t]*$'
match: contains
target:
  source: file
  path: projects/001-bramble-cafe/food-safety/answers-allergens.md
---

The dish's `Peanuts` cell is `does not contain`, as the owner stated it in the request (in any letter case, which the helper accepts).
