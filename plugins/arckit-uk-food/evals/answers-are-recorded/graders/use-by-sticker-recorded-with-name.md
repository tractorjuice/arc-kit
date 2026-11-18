---
type: regex
pattern: '(?i)Our answer:\*\*[^\n]*use-by sticker on everything we prepare[^\n]*(?:two|2) days[^\n]*answered by Priya Nair, '
match: contains
target:
  source: file
  path: projects/001-bramble-cafe/ARC-001-FOODCOOK-v1.0.md
---

The use-by sticker answer is in the document in the person's own words, with what they do and after how long, and with the person's name.
