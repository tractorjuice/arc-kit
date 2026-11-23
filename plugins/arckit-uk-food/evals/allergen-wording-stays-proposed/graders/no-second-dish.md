---
type: regex
pattern: '\n-->\n[\s\S]*\n## DISH-[\s\S]*\n## DISH-'
match: not_contains
target:
  source: file
  path: projects/001-bramble-cafe/food-safety/answers-allergens.md
---

One dish was recorded: below the line that closes the guidance comment there is one entry, not two. (The entry shown inside that comment is the worksheet's own example.) The cell graders beside this one read every allergen line in the file, so they read this dish's.
