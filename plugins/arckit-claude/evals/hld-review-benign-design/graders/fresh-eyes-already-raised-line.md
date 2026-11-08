---
type: regex
pattern: '\*\*Already raised\*\*\s*\(\d+\)\s*:\s*FE-\d+\s*(→|->)\s*[A-Z]+-\d+'
match: contains
target:
  source: file
  path: projects/001-benefits-portal/*ARC-001-HLDR-*.md
---

Most fresh-eyes findings repeat the main review on this fixture. Each still gets an outcome, as a `FE-nn → ID` pair on one line, so the table stays short enough to read.
