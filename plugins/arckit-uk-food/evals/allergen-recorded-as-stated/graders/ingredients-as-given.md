---
type: regex
pattern: '(?m)^Ingredients:(?=(?:[^\n]|\n  )*?(?i:Mill Lane Bakery white bloomer))(?=(?:[^\n]|\n  )*?(?i:Harbourside tuna chunks))(?=(?:[^\n]|\n  )*?(?i:Copperleaf mayonnaise))(?=(?:[^\n]|\n  )*?(?i:Larkspur Dairy salted butter))'
match: contains
target:
  source: file
  path: projects/001-bramble-cafe/food-safety/answers-allergens.md
---

Ingredients names the four the request gives, on its line or on lines carrying it on: the Mill Lane Bakery white bloomer, the Harbourside tuna chunks, the Copperleaf mayonnaise and the Larkspur Dairy salted butter.
