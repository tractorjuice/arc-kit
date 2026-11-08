---
type: tool_used
tool: Agent
input_match: '(independent-scorer.*\\"(score|overall_score|justification|categories|strengths|weaknesses)\\"\s*:)|(\\"(score|overall_score|justification|categories|strengths|weaknesses)\\"\s*:.*independent-scorer)'
scope: main
min: 0
max: 0
---

The second score is only independent if the scorer never sees the first. Its prompt carries the scale, the criteria and the claims, and none of the evaluation's scores or judgements.
