---
type: regex
pattern: '(?i)Our answer:\*\*[^\n]*(?:do not|don.t|not)[^\n]*fish[^\n]*answered by Priya Nair, |Our answer:\*\*[^\n]*\bnone\b[^\n]*answered by Priya Nair, '
match: contains
target:
  source: file
  path: projects/001-bramble-cafe/ARC-001-FOODCOOK-v1.0.md
---

The fish answer is in the document with the person's name.
