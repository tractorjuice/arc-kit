---
type: regex
pattern: '(?s)### CK-02-Q05\n(?:(?!\n### ).)*?State: confirmed\nBy: Sam Okafor\nOn: \d{4}-\d{2}-\d{2}\n.*### CK-05-Q03\n(?:(?!\n### ).)*?State: confirmed\nBy: Sam Okafor\nOn: \d{4}-\d{2}-\d{2}\n.*### CK-06-Q01\n(?:(?!\n### ).)*?State: confirmed\nBy: Sam Okafor\nOn: \d{4}-\d{2}-\d{2}\n.*### CK-07-Q02\n(?:(?!\n### ).)*?State: confirmed\nBy: Sam Okafor\nOn: \d{4}-\d{2}-\d{2}\n'
match: contains
target:
  source: file
  path: projects/001-bramble-cafe/food-safety/answers-CK.md
---

The four answers given in the request are confirmed, each with the name given.
