---
type: regex
pattern: "^#{3,4} [^\\n]*Do Nothing[^\\n]*\\n(?:(?!^#{2,3} )[\\s\\S])*?(?:TCO|Total Cost of Ownership)"
match: contains
flags: im
target:
  source: file
  path: projects/001-benefits-portal/decisions/ARC-001-ADR-001-v1.0.md
---

The Do Nothing baseline carries its own cost analysis. The command says to include CAPEX, OPEX and TCO for each option; the template's Do Nothing example had none, and staying put has costs too.
