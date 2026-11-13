---
type: regex
pattern: '(draft cache|Redis)[^\n]*(not in the HLD|new component|HLD (does not|doesn.t)|re-review|personal data|single node|single point)'
match: contains
flags: i
target:
  source: file
  path: projects/001-benefits-portal/*ARC-001-DLDR-*.md
---

The Redis draft cache is new architecture: a single-node store of personal data that the HLD doesn't have. The review has to say so on the same line as the cache.
