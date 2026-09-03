---
type: regex
pattern: "\\[[A-Z0-9]{2,8}-C\\d+\\]"
match: contains
target:
  source: file
  path: projects/001-benefits-portal/ARC-001-STKE-v1.0.md
---

Citation discipline (`references/citation-instructions.md`): a finding drawn from an external document carries an inline `[SOURCE-Cn]` marker.
