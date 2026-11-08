---
type: tool_used
tool: Agent
input_match: '(independent-scorer.*\\"(score|finalScore|firstScore|totalWeighted|evidence)\\"\s*:)|(\\"(score|finalScore|firstScore|totalWeighted|evidence)\\"\s*:.*independent-scorer)'
scope: main
min: 0
max: 0
---

The second score is only independent if the scorer never sees the first. Its prompt carries the scale, the criteria, the claims and the prices, and no score or evidence field.
