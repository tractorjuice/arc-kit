---
type: regex
pattern: "^#{3,4} \\d+\\.\\d+ [^\\n]*\\n(?:(?!^#{2,4} )(?!\\*\\*Rollback)[\\s\\S])*?\\*\\*Detection(?:(?!^#{2,4} )(?!\\*\\*Rollback)[\\s\\S])*(?=^#{2,4} |\\Z)"
match: not_contains
flags: m
target:
  source: file
  path: projects/001-benefits-portal/ARC-001-OPS-v1.0.md
---

Every numbered runbook (a `6.1`-style section with a Detection step) also has its Rollback step, as the command requires of each runbook. Before the template fix only one of its seven example runbooks had all four steps.
