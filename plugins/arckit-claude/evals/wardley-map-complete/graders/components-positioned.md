---
type: regex
pattern: "component [^\\n\\[]+\\[0?\\.\\d+, ?0?\\.\\d+\\]"
match: contains
target:
  source: file
  path: projects/001-benefits-portal/wardley-maps/ARC-001-WARD-*v1.0.md
---

The map places components with visibility and evolution coordinates in OnlineWardleyMaps syntax.
