---
type: regex
pattern: '\*\*Status:?\*\*:?\s*(?:\[[xX]\]\s*)?\*{0,2}(?:REJECTED|APPROVED WITH CONDITIONS)'
match: contains
target:
  source: file
  path: projects/001-benefits-portal/*ARC-001-HLDR-*.md
---

Keeps `not-approved-outright` honest: that check passes on any file with no recognisable status line, so this one requires a real verdict.
