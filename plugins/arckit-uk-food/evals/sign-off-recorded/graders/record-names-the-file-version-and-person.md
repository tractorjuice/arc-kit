---
type: regex
pattern: '"doc":\s*"FOODCOOK",\s*"version":\s*"1\.0",\s*"file":\s*"ARC-001-FOODCOOK-v1\.0\.md",\s*"name":\s*"Sam Okafor",\s*"role":\s*"(?:[Tt]he )?[Oo]wner(?: of Bramble Cafe)?",\s*"date":\s*"20\d\d-\d\d-\d\d",\s*"paperSigned":\s*"no",\s*"otherTextRead":\s*false'
match: contains
target:
  source: file
  path: projects/001-bramble-cafe/food-safety/sign-offs.json
---

The record is for the Cooking document, version 1.0, that file, in the name of Sam Okafor, the owner, with a date. It says no signed paper copy was kept (`paperSigned` is `no`): the request mentions none, so a `yes` would be made up. It says no text outside the checked part was shown (`otherTextRead` is false): this document holds none.
