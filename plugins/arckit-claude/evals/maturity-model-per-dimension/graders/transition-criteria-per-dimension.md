---
type: regex
pattern: "^#{2,3} [^\\n]*transition[^\\n]*\\n(?:(?!^## )[\\s\\S])*?\\|\\s*DIM-0?1\\s*\\|(?:(?!^## )[\\s\\S])*?\\|\\s*DIM-0?2\\s*\\|"
match: contains
flags: im
target:
  source: file
  path: projects/001-benefits-portal/ARC-001-MMOD-v1.0.md
---

Transition criteria are given per dimension, not once for the model, as the command requires ("For each dimension, define what must be demonstrated to progress").
