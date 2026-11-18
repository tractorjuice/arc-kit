---
type: regex
pattern: '"doc":\s*"FOODCOOK",\s*"version":\s*"1\.0",\s*"file":\s*"ARC-001-FOODCOOK-v1\.0\.md",\s*"name":\s*"Sam Okafor",\s*"role":\s*"(?:[Tt]he )?[Oo]wner(?: of Bramble Cafe)?"'
match: contains
target:
  source: file
  path: projects/001-bramble-cafe/food-safety/sign-offs.json
---

The record is for the Cooking document, version 1.0, that file, in the name of Sam Okafor, the owner.
