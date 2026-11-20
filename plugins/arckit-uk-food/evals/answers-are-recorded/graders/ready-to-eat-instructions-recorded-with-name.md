---
type: regex
pattern: '(?i)Our answer:\*\*\s*yes\b[^\n]*answered by Priya Nair, '
match: contains
target:
  source: file
  path: projects/001-bramble-cafe/ARC-001-FOODCOOK-v1.0.md
---

The yes about manufacturer's instructions is in the document with the person's name.
