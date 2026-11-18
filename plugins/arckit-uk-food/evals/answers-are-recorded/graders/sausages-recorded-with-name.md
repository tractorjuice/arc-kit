---
type: regex
pattern: '(?i)Our answer:\*\*[^\n]*pork sausages[^\n]*answered by Priya Nair, '
match: contains
target:
  source: file
  path: projects/001-bramble-cafe/ARC-001-FOODCOOK-v1.0.md
---

The sausage and burger answer is in the document with the name of the person who gave it.
