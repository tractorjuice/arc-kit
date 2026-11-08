---
type: regex
pattern: 'HLD conformance\s*\|\s*Completed'
match: contains
flags: i
target:
  source: file
  path: projects/001-benefits-portal/*ARC-001-DLDR-*.md
---

The HLD conformance lens reports back. "Not run" here means it failed twice or the step was skipped.
