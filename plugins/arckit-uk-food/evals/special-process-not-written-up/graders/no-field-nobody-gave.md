---
type: regex
pattern: '(?m)^(?:Hazard|Control|Limit|Limit-source|Check|If-it-fails):[ \t]*\S'
match: not_contains
target:
  source: file
  path: projects/001-bramble-cafe/food-safety/answers-own.md
---

Hazard, Control, Limit, Limit-source, Check and If-it-fails of any entry the run leaves are empty. The request gives none of them, so a line in any of them is the assistant's own, with a figure or without: a made-up check, or the person's procedure reworded into Control and Check. (Those lines are empty in the guidance comment's example, and so match nothing.)
