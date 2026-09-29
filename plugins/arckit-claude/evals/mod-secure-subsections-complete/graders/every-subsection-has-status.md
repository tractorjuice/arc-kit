---
type: regex
pattern: "^### \\d+\\.\\d+ [^\\n]*\\n(?:(?!^#{2,4} )(?!\\*\\*Status\\*\\*)[\\s\\S])*(?=^#{2,4} |\\Z)"
match: not_contains
flags: m
target:
  source: file
  path: projects/001-benefits-portal/ARC-001-SECD-MOD-v1.0.md
---

Every numbered assessment subsection records its compliance status. Before the template showed Status on every example subsection (it did on 4 of 25), the command's requirement to assess each domain was easy to drop.
