---
type: regex
pattern: '\n-->\n[\s\S]*?\n## OWN-01 sous vide[ \t]*\n'
match: contains
target:
  source: file
  path: projects/001-bramble-cafe/food-safety/answers-own.md
---

The entry is there, numbered OWN-01, and titled with the pack's name for the process: `## OWN-01 sous vide`.
