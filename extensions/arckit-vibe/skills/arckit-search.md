---
name: arckit-search
display_name: ArcKit Search
description: Search across all project artifacts by keyword, document type, or requirement ID
tags: [arckit, architecture, governance]
---

# Project Search

You are helping an enterprise architect search across all project artifacts to find specific decisions, requirements, risks, or design information.

## User Input

```text
${args}
```

> **Note**: The ArcKit Search hook has already indexed all project artifacts and provided them as structured JSON in the context. Use that data — do NOT scan directories manually.
>
> If the hook data is not present (hook context missing), fall back to manual scanning: use `glob pattern="projects/**/ARC-*.md"` to find all artifacts, then parse and search them manually.

## Instructions

1. **Parse the search query** from the user input:
   - **Plain text** → keyword search across titles, content previews, and control fields
   - `--type=XXX` → filter by document type code (ADR, REQ, HLDR, SECD, etc.)
   - `--project=NNN` → filter by project number (e.g., `--project=001`)
   - `--id=XX-NNN` → find documents containing a specific requirement ID (e.g., `--id=BR-003`)
   - Combinations work: `PostgreSQL --type=ADR --project=001`

2. **Search the pre-processed index** from the hook context. Score results by relevance:
   - **10 points** — match in document title
   - **5 points** — match in document control fields (owner, status)
   - **3 points** — match in content preview
   - **2 points** — match in filename
   - Exact matches score double

3. **Output format** (console only — do NOT create a file):

   ```markdown
   ## Search Results for "<query>"

   Found N matches across M projects:

   | Score | Document | Type | Project | Title |
   |-------|----------|------|---------|-------|
   | 15 | ARC-001-ADR-003-v1.0 | ADR | 001-payments | Database Selection |
   | 8 | ARC-001-REQ-v2.0 | REQ | 001-payments | System Requirements |

   ### Top Result Preview
   **ARC-001-ADR-003-v1.0** (decisions/ARC-001-ADR-003-v1.0.md)
   > ...relevant excerpt from the content preview...
   ```

4. **Show the top 3 result previews** with the matching text highlighted or quoted.

5. **If no results found**, suggest:
   - Broadening the search (fewer keywords, remove filters)
   - Checking available document types with their codes
   - Trying alternative terms

6. **If the query is empty**, show a usage summary:

   ```text
   Usage: /arckit:search <query> [--type=TYPE] [--project=NNN] [--id=REQ-ID]

   Examples:
     /arckit:search PostgreSQL
     /arckit:search "data residency" --type=ADR
     /arckit:search --id=BR-003
     /arckit:search security --project=001
   ```

## Vibe-Specific Notes

- Use `read_file` tool to read templates and existing documents
- Use `glob` tool to scan for artifacts: `glob pattern="projects/**/ARC-*.md"`
- Use `bash` tool for shell commands
- Use `write_file` tool to create new files
- Template files are in `.arckit/templates/` or `.arckit/templates-custom/`
- Extension files are in `${VIBE_EXTENSION_ROOT}/`
