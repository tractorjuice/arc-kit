---
type: regex
pattern: '(?m)^Supplied-text:[ \t]*\S'
match: not_contains
target:
  source: file
  path: projects/001-bramble-cafe/food-safety/answers-own.md
---

No procedure was recorded: the request gave none, so no entry in the own methods worksheet holds supplied text. (The line in the guidance comment is empty, and so matches nothing.) The request that does supply a procedure is the case `supplied-procedure-recorded`, which must still record it.
