---
type: regex
pattern: '(?s)### CK-05-Q03\n(?:(?!\n### ).)*?Answer:[^\n]*(?i:pork sausages)(?:(?!\n### ).)*?State: confirmed.*### CK-06-Q01\n(?:(?!\n### ).)*?Answer: (?i:no)\b'
match: contains
target:
  source: file
  path: projects/001-bramble-cafe/food-safety/answers-CK.md
---

The recorded answers are the ones the person gave: the sausage list and a no to hot holding.
