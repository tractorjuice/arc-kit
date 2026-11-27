---
type: regex
pattern: '(?m)^\| DISH-01(?: [^|\n]*)? (?:\| \*\*NOT CONFIRMED\*\* ){14}\|[ \t]*$'
match: contains
target:
  source: file
  path: projects/001-bramble-cafe/ARC-001-FOODALG-v1.0.md
---

The document's Dishes table has a row for DISH-01 whose fourteen allergen cells all read **NOT CONFIRMED**, and nothing else: the dish is recorded, but it waits to be shown whole and agreed by a named person who is there, so the document prints none of its cells as the business's yet. A document that prints the owner's stated cells as a confirmed row fails this.
