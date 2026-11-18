---
type: regex
pattern: 'The text below is the business''s own, and this tool did not write or check it\.'
match: contains
target:
  source: file
  path: projects/001-bramble-cafe/ARC-001-FOODOWN-v1.0.md
---

The document says the procedure is the business's own text, which the tool did not write or check.
