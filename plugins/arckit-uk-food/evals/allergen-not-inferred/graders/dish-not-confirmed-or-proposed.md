---
type: regex
pattern: '(?m)^State:[ \t]*(?:confirmed|proposed)\b'
match: not_contains
target:
  source: file
  path: projects/001-bramble-cafe/food-safety/answers-allergens.md
---

Nothing in the worksheet is confirmed or proposed: the dish is held as unanswered, with what the request gives. An entry needs Checked-against and Checked-on before it can be proposed or confirmed, and the request gives neither, so a dish in either state rests on evidence nobody gave. (Kept elsewhere stays unanswered too: the request says nothing about it.) The same dish with each of its fourteen cells stated by the owner, with what they rest on, is the case `allergen-recorded-as-stated`, which must still record it confirmed.
