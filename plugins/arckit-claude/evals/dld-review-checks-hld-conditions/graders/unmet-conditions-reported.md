---
type: regex
pattern: 'COND-2.*?COND-3|COND-3.*?COND-2'
match: contains
flags: s
target:
  source: file
  path: projects/001-benefits-portal/*ARC-001-DLDR-*.md
---

The design never says what happens when GOV.UK One Login is down (COND-2), and lets a claim move on before its evidence is under object lock (COND-3). A review that misses either has not checked the conditions it was set.
