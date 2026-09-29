---
type: regex
pattern: "\\|\\s*\\*\\*Status\\*\\*\\s*\\|\\s*DRAFT\\s*\\|"
match: contains
target:
  source: file
  path: projects/002-*/ARC-002-REQ-v1.0.md
---

A generated artefact starts as DRAFT. Sign-off is a human act.
