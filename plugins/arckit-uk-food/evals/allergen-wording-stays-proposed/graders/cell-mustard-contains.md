---
type: regex
pattern: '(?m)^Mustard:[ \t]*(?i:contains)[ \t]*$'
match: contains
target:
  source: file
  path: projects/001-bramble-cafe/food-safety/answers-allergens.md
---

The dish's `Mustard` cell is `contains` (in any letter case, which the helper accepts): the label wording the request quotes names it, picked out as MUSTARD on the mayonnaise jar's label. Read from wording, it is a proposal, and the dish waits to be shown back; a run that leaves it empty, as if nothing read from wording could be recorded, fails this.
