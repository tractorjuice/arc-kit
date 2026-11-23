---
type: regex
pattern: '(?m)^\| DISH-01(?: [^|\n]*)? (?:\| \*\*NOT CONFIRMED\*\* ){14}\|[ \t]*$'
match: contains
target:
  source: file
  path: projects/001-bramble-cafe/ARC-001-FOODALG-v1.0.md
---

The document's Dishes table has a row for DISH-01 whose fourteen allergen cells all read **NOT CONFIRMED**: the document is written, and shows nothing about the dish's allergens as known.
