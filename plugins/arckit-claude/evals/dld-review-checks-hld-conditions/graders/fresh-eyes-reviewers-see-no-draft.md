---
type: tool_used
tool: Agent
input_match: '(fresh-eyes-reviewer.*(BLOCKING-|ADVISORY-|INFO-|APPROVED|REJECTED))|((BLOCKING-|ADVISORY-|INFO-|APPROVED|REJECTED).*fresh-eyes-reviewer)'
scope: main
min: 0
max: 0
---

A reviewer handed the draft's issue IDs or verdict no longer has fresh eyes. The earlier HLD review is passed by path, so its conditions reach the reviewer without this review's working.
