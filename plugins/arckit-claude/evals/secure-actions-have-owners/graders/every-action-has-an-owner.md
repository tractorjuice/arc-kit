---
type: regex
pattern: "\\*\\*Gaps/Actions\\*\\*:?\\s*\\n\\s*\\n(?:- [^\\n]*Owner[^\\n]*\\n)*- (?![^\\n]*Owner)"
match: not_contains
flags: i
target:
  source: file
  path: projects/001-benefits-portal/ARC-001-SECD-v1.0.md
---

Every remediation action names an owner, as the command requires ("remediation actions with owners and timelines"). The pattern matches a Gaps/Actions list with an action line that names none. Before the template's example actions carried an owner, generated actions had a priority and a deadline but no owner.
