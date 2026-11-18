---
type: tool_used
tool: Bash
min: 0
max: 0
input_match: '"command":\s*"(?:[^"\\]|\\.)*?(?:(?:sed\s+(?:-[a-zA-Z]*i|--in-place)|perl\s+-[a-zA-Z]*i)(?:[^"\\;&|]|\\[^n])*ARC-001-FOODCOOK-v1\.0\.md|(?:>>?|\btee(?:\s+-a)?)\s*[^\s"\\;&|]*ARC-001-FOODCOOK-v1\.0\.md)'
---

No shell command rewrote the document in place or sent output into it (`sed -i`, `perl -i`, `>` or `tee` onto the file).
