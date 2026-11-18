---
type: tool_used
tool: Bash
min: 0
max: 0
input_match: '"command":\s*"(?:[^"\\]|\\.)*?(?:(?:\bsed\s+(?:-[a-zA-Z]+\s+)*(?:-[a-zA-Z]*i|--in-place)|\bperl\s+(?:-[a-zA-Z]+\s+)*-[a-zA-Z]*i)(?:''(?:[^''"\\]|\\.)*''|\\"(?:[^"\\]|\\[^"])*\\"|[^"\\&|;'']|\\[^n"])*ARC-001-FOODCOOK-v1\.0\.md|(?:>>?|\btee(?:\s+-a)?)\s*[^\s"\\&|;]*ARC-001-FOODCOOK-v1\.0\.md|\b(?:cp|mv|install)\s(?:[^"\\&|;\n]|\\[^n])*?\s(?:\\"|'')?[^\s"\\&|;\'']*ARC-001-FOODCOOK-v1\.0\.md(?:\\"|'')?(?=\s*(?:"|&|\||;|\\n)))|"command":\s*"(?=(?:[^"\\]|\\.)*?ARC-001-FOODCOOK-v1\.0\.md)(?:[^"\\]|\\.)*?\b(?:writeFileSync|writeFile|appendFileSync|appendFile|createWriteStream|write_text|write_bytes|open\s*\([^)]*(?:''|\\")[wa]\+?(?:''|\\"))'
---

No shell command rewrote the document in place, sent output into it or put another file over it: no `sed -i` or `perl -i` naming it, whatever options come first and whatever its expression holds (a table row's `|` included); no `>`, `>>` or `tee` onto it; no `cp`, `mv` or `install` whose last argument is the document; and no command that names it and holds a program's file-write call (`writeFileSync`, `open(..., 'w')` and the like), as a `node -e` or `python -c` that rewrites it would. What this cannot see: a script read from a file (`sed -f`), a path held in a shell variable set in an earlier command, and a program that writes the file without its name in the command line. A command that names the document and writes some other file with such a call is failed too.
