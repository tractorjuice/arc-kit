---
type: regex
pattern: "\\|\\s*\\*\\*Status\\*\\*\\s*\\|\\s*DRAFT\\s*\\|"
match: contains
target:
  source: file
  path: projects/001-benefits-portal/ARC-001-SECD-v1.0.md
---

A generated artefact starts as DRAFT. Sign-off is a human act.
