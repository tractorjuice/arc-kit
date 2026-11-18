---
type: regex
pattern: 'The text below is the business''s own'
match: not_contains
target:
  source: file
  path: projects/001-bramble-cafe/ARC-001-FOODOWN-v*.md
---

If the own methods document was written, it prints no procedure: the line the helper puts above a business's own text is not in it.
