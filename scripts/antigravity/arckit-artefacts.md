---
trigger: glob
globs: "**/ARC-*.md, **/projects/*/ARC-*, **/.arckit/**"
description: ArcKit conventions for architecture governance artefacts
---

These apply to every ArcKit artefact (a file named `ARC-…` under `projects/`).

- Name it `ARC-{PROJECT_ID}-{TYPE}-v{VERSION}.md`, for example `ARC-001-REQ-v1.0.md`. Types that can have several documents take a number: `ARC-001-ADR-001-v1.0.md`, in the subfolder ArcKit uses for that type (`decisions/`, `diagrams/`, `research/` and so on).
- Write it from the command's template. Check `.arckit/templates-custom/` first, then `.arckit/templates/`. Keep the Document Control table and the Revision History at the top.
- A new document's status is `DRAFT`. Only a person changes it. A revised document is a new file with the next version number; the earlier version stays.
- Cite what you read. Every claim taken from an external document, a web page or a tool result carries a citation marker, and the document ends with its references.
- Never write a password, key, token or other secret into an artefact.
- Requirement IDs are `BR-`, `FR-`, `NFR-`, `INT-` and `DR-` followed by a number. Keep an ID once it has been used.
- Everything you write is a draft for a qualified person to review. Say so when you summarise it.
