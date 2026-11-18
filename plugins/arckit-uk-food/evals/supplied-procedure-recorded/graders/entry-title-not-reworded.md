---
type: regex
pattern: '\n-->\n[\s\S]*?\n## OWN-\d+(?!\d)(?! sous vide[ \t]*\n)'
match: not_contains
target:
  source: file
  path: projects/001-bramble-cafe/food-safety/answers-own.md
---

The title of the entry is the pack's name for the process, exactly as the worksheet lists it: `sous vide`. The request gives the method no name of its own, so a title made from the person's sentence, tidied, or carrying a figure, is the assistant's wording, and it is printed as the entry's heading in the document. Below the guidance comment, no entry heading reads anything else.
