---
type: regex
pattern: "\\|\\s*ARC-001-REQ-v1\\.0\\s*\\|"
match: contains
target: trace
---

The fixture's DR-001 names PostgreSQL. The model's results table carries `ARC-001-REQ-v1.0` as a table cell, which only the model's own answer renders that way (the Grep tool result shows the path, not a cell). The trace is graded rather than the last message because a Stop-hook nudge can make the model append a postscript after the answer.
