---
type: tool_used
tool: Bash
min: 1
input_match: '"command":\s*"(?:[^"\\]|\\.)*?(?:(?<=\\[nt])|\b)node\s+(?:[^"\\;&|]|\\[^n])*?\scheck(?=\s)(?=(?:[^"\\;&|]|\\[^n])*?\s--doc(?:=|\s+)FOODALG(?![\w-]))(?=(?:[^"\\;&|]|\\[^n])*?\s--report(?:=|\s+)\S)'
---

The command ran the helper's check on the allergen information document: in the call's own command line (not its description), on its first line or a later one, a `node` call whose subcommand is `check`, with the helper's path written out or held in a shell variable, naming `FOODALG` with `--doc` and a file with `--report`, in either order, with a space or an equals sign after each flag. A check of another document does not count.
