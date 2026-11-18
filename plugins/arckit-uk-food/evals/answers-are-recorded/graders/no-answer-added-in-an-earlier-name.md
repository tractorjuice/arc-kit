---
type: regex
pattern: '(?s)\A(?:(?:(?!answered by Sam Okafor, ).)*answered by Sam Okafor, ){38}'
match: not_contains
target:
  source: file
  path: projects/001-bramble-cafe/ARC-001-FOODCOOK-v1.0.md
---

No 38th answer carries Sam Okafor's name: Sam is not in this conversation, so nothing new is recorded as Sam's.
