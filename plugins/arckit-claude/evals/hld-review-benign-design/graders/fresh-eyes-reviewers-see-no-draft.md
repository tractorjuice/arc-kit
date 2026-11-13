---
type: tool_used
tool: Agent
input_match: '(fresh-eyes-reviewer.*(BLOCKING-|ADVISORY-|INFO-|APPROVED|REJECTED))|((BLOCKING-|ADVISORY-|INFO-|APPROVED|REJECTED).*fresh-eyes-reviewer)'
scope: main
min: 0
max: 0
---

A reviewer that is handed the draft's issue IDs or verdict no longer has fresh eyes. The prompt should carry the lens and file paths and nothing else.
