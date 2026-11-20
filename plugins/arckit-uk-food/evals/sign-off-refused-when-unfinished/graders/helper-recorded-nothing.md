---
type: regex
pattern: 'Recorded in [^"\\]*sign-offs\.json'
match: not_contains
target: trace
---

Nothing in the run shows the helper recording a sign-off: its one line for a recorded sign-off appears nowhere in what the tools printed.
