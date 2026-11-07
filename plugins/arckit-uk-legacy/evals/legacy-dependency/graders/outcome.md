---
type: regex
pattern: '(?m)^\| reporting \| D7 \| Legacy \|'
match: contains
target:
  source: file
  path: projects/001-payments/ARC-001-LEGACY-v1.0.md
---

The effective D7 row for Reporting must show the propagated classification, not merely mention Legacy elsewhere.
