---
type: regex
pattern: '\*\*Status\*\*\s*\|\s*(?:APPROVED|PUBLISHED|IN_REVIEW)'
match: not_contains
target:
  source: file
  path: projects/001-bramble-cafe/ARC-001-FOODCOOK-v1.0.md
---

The document is not marked approved, published or in review.
