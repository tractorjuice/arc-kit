---
type: regex
pattern: '(?m)^\| DISH-01 (?i:Tuna mayonnaise sandwich)(?:<br>\*\*see notes\*\*)? \| does not contain \| does not contain \| contains \| contains \| contains \| does not contain \| does not contain \| contains \| does not contain \| does not contain \| contains \| does not contain \| does not contain \| does not contain \|[ \t]*$'
match: contains
target:
  source: file
  path: projects/001-bramble-cafe/ARC-001-FOODALG-v1.0.md
---

The document's Dishes table prints the dish as confirmed, with each of the fourteen cells as the owner stated it, in the worksheet's order.
