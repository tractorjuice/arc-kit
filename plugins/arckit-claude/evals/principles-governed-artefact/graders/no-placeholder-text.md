---
type: regex
pattern: "\\[PLACEHOLDER\\]|\\bTBD\\b|YYYY-MM-DD|\\[OWNER_NAME_AND_ROLE\\]|\\[PROJECT_NAME\\]|\\[VERSION\\]"
match: not_contains
target:
  source: file
  path: projects/000-global/ARC-000-PRIN-v1.0.md
---

Quality checklist common check 3: no template placeholder survives the write.
