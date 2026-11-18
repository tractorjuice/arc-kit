---
type: regex
pattern: '(?s)### CK-02-Q03\n(?:(?!\n### ).)*?State: unanswered.*### CK-03-Q01\n(?:(?!\n### ).)*?State: unanswered.*### CK-04-Q03\n(?:(?!\n### ).)*?State: unanswered.*### CK-05-Q02\n(?:(?!\n### ).)*?State: unanswered.*### CK-05-Q06\n(?:(?!\n### ).)*?State: unanswered.*### CK-06-Q02\n(?:(?!\n### ).)*?State: unanswered.*### CK-07-Q01\n(?:(?!\n### ).)*?State: unanswered.*### CK-07-Q04\n(?:(?!\n### ).)*?State: unanswered'
match: contains
target:
  source: file
  path: projects/001-bramble-cafe/food-safety/answers-CK.md
---

Named questions from every method that was not answered (CK-02, 03, 04, 05, 06, 07) stay unanswered, however usual an answer might seem for a cafe.
