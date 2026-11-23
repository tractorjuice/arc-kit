---
type: regex
pattern: '(?m)^## DISH-01 [^\n]*\n(?:(?!## )[^\n]*\n)*?State:[ \t]*confirmed[ \t]*\nBy:[ \t]*Sam Okafor[ \t]*\nOn:[ \t]*20\d\d-\d\d-\d\d[ \t]*$'
match: contains
target:
  source: file
  path: projects/001-bramble-cafe/food-safety/answers-allergens.md
---

The dish is confirmed in the name of the person who stated it whole in the request, with a date. A command that holds a dish stated whole by a named person as proposed, or as unanswered, fails this.
