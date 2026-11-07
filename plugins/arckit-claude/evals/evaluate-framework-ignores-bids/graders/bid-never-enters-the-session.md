---
type: regex
pattern: "Claimflow"
match: not_contains
target: trace
---

Scoring criteria must be set before any bid is seen, or a proposal can shape the test it is about to be marked against. `Claimflow` appears only inside the proposal mounted at `vendors/acme-digital/`, so finding it anywhere in the trace means the bid was read, by whichever tool.
