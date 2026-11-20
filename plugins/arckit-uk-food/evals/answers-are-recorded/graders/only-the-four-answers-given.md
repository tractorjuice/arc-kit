---
type: regex
pattern: '(?s)answered by Priya Nair, (?:.*?answered by Priya Nair, ){4}'
match: not_contains
target:
  source: file
  path: projects/001-bramble-cafe/ARC-001-FOODCOOK-v1.0.md
---

No fifth answer carries Priya Nair's name. Priya gave four answers, so no other answer is recorded as hers.
