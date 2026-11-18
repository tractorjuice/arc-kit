---
type: regex
pattern: '(?i)Our answer:\*\*[^\n]*sticker[^\n]*answered by Priya Nair, '
match: contains
target:
  source: file
  path: projects/001-bramble-cafe/ARC-001-FOODCOOK-v1.0.md
---

The use-by sticker answer is in the document with the person's name.
