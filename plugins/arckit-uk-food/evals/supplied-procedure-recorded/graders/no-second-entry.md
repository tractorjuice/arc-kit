---
type: regex
pattern: '\n-->\n[\s\S]*\n## OWN-[\s\S]*\n## OWN-'
match: not_contains
target:
  source: file
  path: projects/001-bramble-cafe/food-safety/answers-own.md
---

One entry was recorded: below the line that closes the guidance comment there is one own entry, not two. (The entry shown inside that comment is the worksheet's own example.)
