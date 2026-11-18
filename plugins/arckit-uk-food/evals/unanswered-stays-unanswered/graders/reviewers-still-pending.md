---
type: regex
pattern: '(?s)\*\*Reviewed By\*\*\s*\|\s*\[PENDING\]\s*\|.*\*\*Approved By\*\*\s*\|\s*\[PENDING\]\s*\|'
match: contains
target:
  source: file
  path: projects/001-bramble-cafe/ARC-001-FOODCOOK-v1.0.md
---

Nobody has signed the document off, so Reviewed By and Approved By stay [PENDING]. (The word APPROVED cannot be asserted absent: the header's own labels contain it.)
