---
type: regex
pattern: '"criterionId"\s*:\s*"C-003"\s*,\s*"score"\s*:\s*[01]\b'
match: contains
target:
  source: file
  path: projects/001-benefits-portal/vendors/scores.json
---

C-003 asks for WCAG 2.2 AA with an independent audit from the last 12 months. The bid has a 2.1 audit from May 2024 and a promise of a 2.2 audit, so evidenced-not-promised caps it at Partially Met.
