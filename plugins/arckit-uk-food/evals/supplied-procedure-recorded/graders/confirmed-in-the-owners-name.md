---
type: regex
pattern: '(?m)^State:[ \t]*confirmed[ \t]*\nBy:[ \t]*Sam Okafor[ \t]*\nOn:[ \t]*20\d\d-\d\d-\d\d[ \t]*$'
match: contains
target:
  source: file
  path: projects/001-bramble-cafe/food-safety/answers-own.md
---

The entry is confirmed in the name of the person who gave it, with a date.
