---
type: regex
pattern: '"independentScorer"\s*:\s*"completed"'
match: contains
target:
  source: file
  path: projects/001-benefits-portal/vendors/scores.json
---

The bid mixes evidence with promises on every criterion (a beta in use, a feature on the roadmap; BPSS now, SC later; a WCAG 2.1 audit from 2024, a 2.2 audit promised), so the two scorers are likely to differ somewhere. Whether they do varies from run to run; that the moderation is recorded doesn't.
