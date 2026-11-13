---
type: regex
pattern: '\*\*Status:?\*\*:?\s*(?:\[[xX]\]\s*)?\*{0,2}REJECTED'
match: not_contains
target:
  source: file
  path: projects/001-benefits-portal/*ARC-001-HLDR-*.md
---

The design meets both Must data requirements, uses the council's platforms and GOV.UK One Login, states its recovery targets, retention and residency, and keeps caseworkers in charge of decisions. It may earn conditions, but rejecting it means the review, or the reviewers it accepted, held it to a bar no design meets.
