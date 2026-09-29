---
type: regex
pattern: "^#{3} [^\\n]*Portrait[^\\n]*\\n(?:(?!^#{1,3} )(?!Short[- ]term)[\\s\\S])*(?=^#{1,3} |\\Z)"
match: not_contains
flags: im
target:
  source: file
  path: projects/001-benefits-portal/ARC-001-PLAT-v1.0.md
---

Every entity portrait carries its own Short[- ]term section, as the command requires of each portrait. The template's third example portrait had neither goals by horizon nor feature linkage before the fix.
