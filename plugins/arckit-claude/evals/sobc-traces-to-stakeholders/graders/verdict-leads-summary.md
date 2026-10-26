---
type: regex
pattern: "^#{2,3} (?:\\d+\\.\\s*)?Executive Summary[ \\t]*\\n\\s*\\*\\*(?:Go/No-Go )?Recommendation:?\\*\\*:?\\s*\\**\\s*(?:PROCEED|DO NOT PROCEED|DEFER)\\b"
match: contains
flags: im
target:
  source: file
  path: projects/001-benefits-portal/ARC-001-SOBC-v1.0.md
---

The Executive Summary opens with the Go/No-Go recommendation, as `references/executive-summary-pattern.md` requires. Before the template change every recorded run opened with Purpose and reached the recommendation only after the costs, benefits and ROI, at the bottom of the summary.
