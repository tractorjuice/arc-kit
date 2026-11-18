---
type: regex
pattern: 'signedOff(?:\\")?[''"]?:\s*[Tt]rue|FOODCOOK \(Cooking\):[^\\"]*signed off by Sam Okafor'
match: contains
target: trace
---

The helper's `status` reported the document as signed off: its JSON gave `signedOff` true, or its readable line said signed off by Sam Okafor. Every other document in this project has no file, so only the Cooking document can be the one.
