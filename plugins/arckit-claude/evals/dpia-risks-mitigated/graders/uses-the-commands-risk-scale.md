---
type: regex
pattern: "\\b(?:Remote|Possible|Probable)\\b[\\s\\S]*\\b(?:Minimal|Significant|Severe)\\b"
match: contains
target:
  source: file
  path: projects/001-benefits-portal/ARC-001-DPIA-v1.0.md
---

Likelihood and severity use the command's scale (Remote/Possible/Probable, Minimal/Significant/Severe). The template used a different Low/Medium/High scale before the fix.
