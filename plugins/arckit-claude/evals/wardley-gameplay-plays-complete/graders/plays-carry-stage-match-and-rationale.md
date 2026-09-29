---
type: regex
pattern: "\\|[^\\n]*Evolution Stage Match[^\\n]*\\|[^\\n]*Rationale[^\\n]*\\|"
match: contains
flags: i
target:
  source: file
  path: projects/001-benefits-portal/wardley-maps/ARC-001-WGAM-*v1.0.md
---

The play-option tables record each play's evolution stage match and rationale, as the command requires of each play. The template's tables had neither column before the fix.
