---
type: regex
pattern: "\\*\\*Gaps/Actions\\*\\*:?\\s*\\n\\s*\\n(?:- [^\\n]*Owner[^\\n]*\\n)*- (?![^\\n]*Owner)"
match: not_contains
flags: i
target:
  source: file
  path: projects/001-benefits-portal/ARC-001-SECD-MOD-v1.0.md
---

Every remediation action names an owner, as the command requires.
