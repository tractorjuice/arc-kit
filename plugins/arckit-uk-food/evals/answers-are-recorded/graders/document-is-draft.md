---
type: regex
pattern: '(?m)^\|\s*\*\*Status\*\*\s*\|\s*DRAFT\b'
match: contains
target:
  source: file
  path: projects/001-bramble-cafe/ARC-001-FOODCOOK-v1.0.md
---

The header says DRAFT.
