---
type: regex
pattern: "\\[PLACEHOLDER\\]|\\bTBD\\b|YYYY-MM-DD|\\[PROJECT_NAME\\]|\\[VERSION\\]"
match: not_contains
target:
  source: file
  path: projects/002-*/ARC-002-REQ-v1.0.md
---

No template placeholder survives the write.
