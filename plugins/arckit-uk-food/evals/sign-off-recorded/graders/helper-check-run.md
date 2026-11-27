---
type: tool_used
tool: Bash
min: 1
input_match: '"command":\s*"(?:[^"\\]|\\.)*?(?:(?<=\\[nt])|\b)node\s+(?:[^"\\;&|]|\\[^n])*?\scheck(?=\s)(?=(?:[^"\\;&|]|\\[^n])*?\s--doc(?:=|\s+)FOODCOOK(?![\w-]))(?=(?:[^"\\;&|]|\\[^n])*?\s--report(?:=|\s+)\S)'
---

The command ran the helper's check on the Cooking document after marking it: in the call's own command line, on its first line or a later one, a `node` call whose subcommand is `check`, with the helper's path written out or held in a shell variable, naming `FOODCOOK` with `--doc` and a file with `--report`.
