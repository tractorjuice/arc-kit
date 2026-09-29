---
type: regex
pattern: "^### \\d+\\.[^\\n]*\\n(?:(?!^#{2,3} )(?!Rationale)[\\s\\S])*(?=^#{2,3} )"
match: not_contains
flags: m
target:
  source: file
  path: projects/000-global/ARC-000-PRIN-v1.0.md
---

Every numbered principle carries its own Rationale section, as the command requires. The pattern matches a principle whose section runs to the next heading without one. Before the template gave every example principle both sections, runs at `effort: high` left out Rationale on about five principles and Implications on about eight, copying the template's gaps; runs at `max` did not.
