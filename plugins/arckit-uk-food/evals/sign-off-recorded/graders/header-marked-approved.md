---
type: tool_used
tool: Edit
min: 1
input_match: '^(?=.*"file_path":\s*"[^"]*ARC-001-FOODCOOK-v1\.0\.md")(?=.*"new_string":\s*"(?:[^"\\]|\\.)*APPROVED)'
---

The header was marked: an Edit of the document puts `APPROVED` into it. The document was in the project before the run, so the runner cannot read it afterwards; the edit is what is asserted.
