---
type: tool_used
tool: Edit
min: 0
max: 0
input_match: '"file_path": "[^"]*ARC-001-FOODCOOK-v1\.0\.md", "old_string": "(?:(?:[^"\\]|\\.)*?\\n)?(?!\| \*\*(?:Status|Last Modified|Reviewed By|Approved By)\*\* \||\| 1\.0 \|(?!(?:[^"\\]|\\[^n])*\| \[PENDING\] \| \[PENDING\] \|(?=\\n|")))(?=\||#|>|<!-{2}|\*\*|-{3})((?:(?!\| \[PENDING\] \| \[PENDING\] \|(?=\\n|"))(?:[^"\\]|\\[^n]))+)(?:\| \[PENDING\] \| \[PENDING\] \|)?(?=\\n|")(?![\s\S]*?"new_string": "(?:[^"\\]|\\.)*?\1)'
---

The marking changed nothing but the five lines it is for. No Edit of the document takes out a table row, a heading, a comment, the template line or a footer line that is not the Status, Last Modified, Reviewed By or Approved By row, without putting the same line back: a marking that also changes the Classification cell, say, fails here, whatever the helper is then shown to print. Of the Revision History row for version 1.0, or a part of it, that ends in its two approval cells still reading `[PENDING]`, everything before those two cells must be put back as it was, so a marking that also rewords the Changes cell fails. That row with its approval cells already filled in is not judged: marking it for a second signer, or putting it back, changes only those cells in a correct run. A line given only for context, and put back unchanged, is not counted, and nor is a part of a line. This reads the Edit tool's input in the order it is sent (the file, the text taken out, the text put in); `marking-edits-can-be-read` fails a call in any other form. A changed line of plain text, and a line added, are not seen here: the helper's own verdict after the last edit, in the three graders that read it, is what catches those.
