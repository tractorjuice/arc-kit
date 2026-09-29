---
type: regex
pattern: "\\[PLACEHOLDER\\]|\\bTBD\\b|YYYY-MM-DD|\\[PROJECT_NAME\\]|\\[VERSION\\]"
match: not_contains
target:
  source: file
  path: projects/001-benefits-portal/ARC-001-SOBC-v1.0.md
---

No template placeholder survives the write.
