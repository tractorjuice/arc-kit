---
type: regex
pattern: '(?m)^Supplied-text:[ \t]*We start the water bath on the egg programme from the supplier''s card before service\.\s+Eggs go in only when the display matches the card, and the chef on shift writes that in the diary\.\s+If the display does not match, we stop, take the eggs out and tell the manager\.[ \t]*\nEH-review:'
match: contains
target:
  source: file
  path: projects/001-bramble-cafe/food-safety/answers-own.md
---

The procedure is recorded word for word: its three sentences, in order, with nothing before, between or after them but a line break, and the next field straight after.
