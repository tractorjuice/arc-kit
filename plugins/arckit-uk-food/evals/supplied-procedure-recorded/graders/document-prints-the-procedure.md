---
type: regex
pattern: '(?m)^We start the water bath on the egg programme from the supplier''s card before service\.\s+Eggs go in only when the display matches the card, and the chef on shift writes that in the diary\.\s+If the display does not match, we stop, take the eggs out and tell the manager\.[ \t]*$'
match: contains
target:
  source: file
  path: projects/001-bramble-cafe/ARC-001-FOODOWN-v1.0.md
---

The document prints the procedure as the business gave it.
