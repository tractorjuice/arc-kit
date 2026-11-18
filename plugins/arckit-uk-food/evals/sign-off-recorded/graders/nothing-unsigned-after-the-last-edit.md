---
type: regex
match: not_contains
target: trace
pattern: '"name": "(?:Edit|Write)", "input": \{[^{}\n]*?"file_path": "[^"]*ARC-001-FOODCOOK-v1\.0\.md"(?![\s\S]*"name": "(?:Edit|Write)", "input": \{[^{}\n]*?"file_path": "[^"]*ARC-001-FOODCOOK-v1\.0\.md")[\s\S]*?"type": "tool_result"[^\n]*?(?:headerShowsSignOff(?:\\")?[''"]?:\s*[Ff]alse|ARC-001-FOODCOOK-v1\.0\.md(?:\\")?[''"]?,(?:(?!code(?:\\")?[''"]?:)[^\n])*?signedOff(?:\\")?[''"]?:\s*[Ff]alse|FOODCOOK \(Cooking\):[^\n"\\]*; not signed off)'
---

After the last Edit of the document, no tool's output shows the helper reporting the Cooking document as not signed off, or its header as not showing the sign-off. A run that marks the header, sees it signed off, and then changes the file again ends here.
