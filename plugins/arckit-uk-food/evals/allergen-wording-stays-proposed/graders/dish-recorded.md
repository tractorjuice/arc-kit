---
type: regex
pattern: '\n-->\n[\s\S]*?\n## DISH-01 (?i:Tuna mayonnaise sandwich)[ \t]*\n'
match: contains
target:
  source: file
  path: projects/001-bramble-cafe/food-safety/answers-allergens.md
---

The dish the request gives is in the worksheet, below the guidance comment, numbered DISH-01 and titled with the name the request gives it (in any letter case). A run that records nothing fails this.
