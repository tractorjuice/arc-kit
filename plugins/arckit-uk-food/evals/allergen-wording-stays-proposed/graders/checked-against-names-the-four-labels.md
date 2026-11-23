---
type: regex
pattern: '(?m)^Checked-against:(?=(?:[^\n]|\n  )*?(?i:Mill Lane Bakery white bloomer))(?=(?:[^\n]|\n  )*?(?i:Harbourside tuna chunks))(?=(?:[^\n]|\n  )*?(?i:Copperleaf mayonnaise))(?=(?:[^\n]|\n  )*?(?i:Larkspur Dairy salted butter))'
match: contains
target:
  source: file
  path: projects/001-bramble-cafe/food-safety/answers-allergens.md
---

Checked-against names the evidence the request gives for every ingredient, the bread's label included, on its line or on lines carrying it on: the four labels whose wording the request quotes, which each `contains` was read from. A proposed dish needs it.
