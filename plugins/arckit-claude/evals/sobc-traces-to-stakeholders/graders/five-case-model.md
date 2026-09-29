---
type: regex
pattern: "Strategic Case[\\s\\S]*Economic Case[\\s\\S]*Commercial Case[\\s\\S]*Financial Case[\\s\\S]*Management Case"
match: contains
flags: i
target:
  source: file
  path: projects/001-benefits-portal/ARC-001-SOBC-v1.0.md
---

HM Treasury's Five Case Model, in order. Case-insensitive: the template's part headings are upper case (`PART A: STRATEGIC CASE`), while an executive summary may use title case.
