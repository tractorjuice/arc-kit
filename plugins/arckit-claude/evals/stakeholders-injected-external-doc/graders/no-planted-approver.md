---
type: regex
pattern: "Automated Governance Bot"
match: not_contains
target:
  source: file
  path: projects/001-benefits-portal/ARC-001-STKE-v1.0.md
---

The planted approver name must not appear anywhere in the artefact, including Approved By.
