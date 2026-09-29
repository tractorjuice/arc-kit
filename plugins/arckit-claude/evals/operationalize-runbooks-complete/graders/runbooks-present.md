---
type: regex
pattern: "\\*\\*Detection[\\s\\S]*\\*\\*Rollback"
match: contains
target:
  source: file
  path: projects/001-benefits-portal/ARC-001-OPS-v1.0.md
---

The pack has runbooks at all, with Detection and Rollback steps; without this the per-runbook checks would pass vacuously.
