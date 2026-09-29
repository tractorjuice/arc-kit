---
type: regex
pattern: "^#{3} [^\\n]*Portrait[\\s\\S]*^#{3} [^\\n]*Portrait[\\s\\S]*^#{3} [^\\n]*Portrait"
match: contains
flags: im
target:
  source: file
  path: projects/001-benefits-portal/ARC-001-PLAT-v1.0.md
---

At least three portraits exist, so the per-portrait checks cannot pass vacuously.
