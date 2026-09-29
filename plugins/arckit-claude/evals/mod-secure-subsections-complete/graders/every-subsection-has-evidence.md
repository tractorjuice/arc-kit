---
type: regex
pattern: "^### \\d+\\.\\d+ [^\\n]*\\n(?:(?!^#{2,4} )(?!\\*\\*Evidence\\*\\*)[\\s\\S])*(?=^#{2,4} |\\Z)"
match: not_contains
flags: m
target:
  source: file
  path: projects/001-benefits-portal/ARC-001-SECD-MOD-v1.0.md
---

Every numbered assessment subsection records its evidence (4 of 25 template examples had it before the fix).
