---
type: regex
pattern: '(?m)^projects/001-bramble-cafe/food-safety/sign-offs\.json$'
match: not_contains
target: files
---

No sign-off record was written: the run created no `sign-offs.json`. The Cooking document in this project still shows four questions not yet answered. The same request on a finished document is the case `sign-off-recorded`, which must still record one.
