---
type: regex
pattern: "\"model\": \"claude-sonnet-5-5"
match: contains
target: trace
---

The run used the model the case pins. Claude Code below v2.1.284 cannot select Sonnet 5.5, so on an older client this fails before anything else is worth reading.
