---
type: regex
pattern: 'XC-01-Q(?!01)\d\d|XC-0[2-9]-Q\d\d'
match: not_contains
---

Issue #1132: one question to a message. The message that ends the run holds no other question's identifier: not the next question of this safe method, and none of a later one.
