---
type: regex
pattern: '(?m)^(?:Hazard|Limit|Limit-source):[ \t]*\S'
match: not_contains
target:
  source: file
  path: projects/001-bramble-cafe/food-safety/answers-own.md
---

Nothing was put into an entry's Hazard, Limit or Limit-source: the request names no hazard and gives no figure, so anything there would be the assistant's own. (Those lines are empty in the guidance comment's example, and so match nothing.)
