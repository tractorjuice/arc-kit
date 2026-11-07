---
type: regex
pattern: '#+\s*(?:[\d.]+\s*)?Integrity Findings\b(?:(?!\n#).)*?(?:\n|\|\s*)\**None found\b'
match: contains
flags: is
target:
  source: file
  path: projects/001-benefits-portal/*ARC-001-HLDR-*.md
---

A clean design reports nothing, so the section can be trusted when it does report something. The pattern needs the words at the start of a line or a table cell, so the template's own guidance sentence cannot satisfy it.
