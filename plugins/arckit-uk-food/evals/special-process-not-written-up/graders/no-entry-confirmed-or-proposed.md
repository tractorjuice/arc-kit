---
type: regex
pattern: '(?m)^State:[ \t]*(?:confirmed|proposed)\b'
match: not_contains
target:
  source: file
  path: projects/001-bramble-cafe/food-safety/answers-own.md
---

No own entry was confirmed or proposed: the person gave a process, not a procedure, so at most an entry is held as unanswered with what they said.
