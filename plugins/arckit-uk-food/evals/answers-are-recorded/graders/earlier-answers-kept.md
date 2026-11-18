---
type: regex
pattern: '(?s)\A(?:(?:(?!answered by Sam Okafor, ).)*answered by Sam Okafor, ){37}'
match: contains
target:
  source: file
  path: projects/001-bramble-cafe/ARC-001-FOODCOOK-v1.0.md
---

All 37 answers Sam Okafor gave earlier are still in the document, each with Sam's name: none was dropped, and none was put under another name.
