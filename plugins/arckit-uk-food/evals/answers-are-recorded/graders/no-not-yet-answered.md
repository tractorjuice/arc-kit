---
type: regex
pattern: '\*\*NOT YET ANSWERED\*\*'
match: not_contains
target:
  source: file
  path: projects/001-bramble-cafe/ARC-001-FOODCOOK-v1.0.md
---

Every question in a method that applies is now answered, so nothing prints as NOT YET ANSWERED (the method set to not relevant prints none).
