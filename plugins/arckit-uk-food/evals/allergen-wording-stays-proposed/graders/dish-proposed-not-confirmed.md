---
type: regex
pattern: '(?m)^## DISH-01 [^\n]*\n(?:(?!## )[^\n]*\n)*?State:[ \t]*proposed[ \t]*\nBy:[ \t]*\nOn:[ \t]*\nSource:[ \t]*\S'
match: contains
target:
  source: file
  path: projects/001-bramble-cafe/food-safety/answers-allergens.md
---

The dish is `proposed`, with nobody's name in `By` or `On` and a `Source` saying where it came from: its cells were read from label wording the request quotes, and a cell read from wording counts only once the dish has been shown back whole and a named person has agreed it. With nobody there to agree it, it waits. A run that records it `confirmed`, in the owner's name, from the request fails this, and so does one that holds it as `unanswered` though it has everything a proposed dish needs. The same dish with each of its fourteen cells stated in so many words, with what they rest on and no label wording quoted, is the case `allergen-recorded-as-stated`, which must still record it confirmed.
