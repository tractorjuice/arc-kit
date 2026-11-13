---
type: regex
pattern: '#+\s*(?:[\d.]+\s*)?Integrity Findings\b(?:(?!\n#).)*?(?:\n|\|\s*)\**None found\b'
match: contains
flags: is
target:
  source: file
  path: projects/001-benefits-portal/*ARC-001-HLDR-*.md
---

A clean design reports nothing, from the review or from any of its reviewers.
