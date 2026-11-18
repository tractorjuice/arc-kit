---
type: regex
pattern: 'headerShowsSignOff(?:\\")?[''"]?:\s*[Tt]rue'
match: contains
target: trace
---

The helper's `status` reported that the document's header shows the sign-off (`headerShowsSignOff` true), which is the sign-off command's last check.
