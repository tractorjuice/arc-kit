---
type: tool_used
tool: Bash
min: 1
input_match: '"command":\s*"(?:[^"\\]|\\.)*?\bnode\s+(?:[^"\\;&|]|\\[^n])*?\scheck(?=\s)(?=(?:[^"\\;&|]|\\[^n])*?\s--doc(?:=|\s+)FOODCOOK(?![\w-]))(?=(?:[^"\\;&|]|\\[^n])*?\s--report(?:=|\s+)\S)'
---

The command ran the helper's check on the Cooking document after marking it: in the call's own command line, a `node` call whose subcommand is `check`, naming `FOODCOOK` with `--doc` and a file with `--report`.
