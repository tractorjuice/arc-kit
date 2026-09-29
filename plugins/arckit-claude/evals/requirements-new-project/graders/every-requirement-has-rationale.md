---
type: regex
pattern: "^#{2,5} (?:BR|FR|NFR|INT|DR)-[\\w-]*?\\d+\\b[^\\n]*\\n(?:(?!^#{2,5} (?:BR|FR|NFR|INT|DR)-)(?!^#{2,4} )(?!rationale)[\\s\\S])*(?=^#{2,5} |\\Z)"
match: not_contains
flags: im
target:
  source: file
  path: projects/002-*/ARC-002-REQ-v1.0.md
---

Every requirement written under its own heading carries its own Rationale, as the command requires of each requirement. The pattern matches a requirement section that reaches the next heading without one. Before the template gave every example requirement both, runs at any effort left acceptance criteria off 36 to 61 requirements, starting with every business requirement, whose template example said "Success Criteria" instead.
