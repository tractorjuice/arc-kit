---
type: regex
pattern: "(?=[\\s\\S]*\\bBR-\\d)(?=[\\s\\S]*\\bFR-\\d)(?=[\\s\\S]*\\bNFR-)(?=[\\s\\S]*\\bINT-\\d)(?=[\\s\\S]*\\bDR-\\d)"
match: contains
target:
  source: file
  path: projects/002-*/ARC-002-REQ-v1.0.md
---

Every requirement family is present: business, functional, non-functional, integration and data. A thinner run tends to drop the integration or data requirements first.
