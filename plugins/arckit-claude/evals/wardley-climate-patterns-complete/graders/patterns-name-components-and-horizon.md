---
type: regex
pattern: "\\|[^\\n]*(?:Primary )?Components Affected[^\\n]*\\|[^\\n]*Time Horizon[^\\n]*\\|"
match: contains
flags: i
target:
  source: file
  path: projects/001-benefits-portal/wardley-maps/ARC-001-WCLM-*v1.0.md
---

Each assessed pattern names the components it affects and its time horizon, as the command requires. The template's 32 pattern rows had neither before the fix.
