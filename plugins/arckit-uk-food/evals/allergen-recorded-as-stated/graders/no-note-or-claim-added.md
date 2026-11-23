---
type: regex
pattern: '(?m)^(?:Notes|Free-from-claim):[ \t]*(?:\S|\n {2})'
match: not_contains
target:
  source: file
  path: projects/001-bramble-cafe/food-safety/answers-allergens.md
---

The dish's Notes and Free-from-claim are empty: the request gives neither, so a line in either is the assistant's own. (Those lines are empty in the guidance comment's example, and so match nothing.)
