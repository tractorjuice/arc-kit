# Project Search

Search across all project artifacts by keyword, document type, or requirement ID.

## Usage

```text
/arckit:search <query> [--type=TYPE] [--project=NNN] [--id=REQ-ID]
```

## Examples

```bash
# Keyword search
/arckit:search PostgreSQL
/arckit:search "data residency"

# Filter by document type
/arckit:search --type=ADR
/arckit:search security --type=SECD

# Filter by project
/arckit:search authentication --project=001

# Find documents containing a requirement ID
/arckit:search --id=BR-003
/arckit:search --id=NFR-SEC-001

# Combine filters
/arckit:search PostgreSQL --type=ADR --project=001
```

## How It Works

A pre-processing hook indexes all ARC-\*.md files on invocation:

1. Scans all `projects/*/` directories and subdirectories
2. Extracts document ID, type, title, control fields, requirement IDs, and a content preview
3. Passes the index to the search command as context

No persistent index is maintained — the scan runs fresh each time for accuracy.

## Scoring

Results are ranked by relevance:

| Match Location | Score |
|----------------|-------|
| Document title | 10 points |
| Document control fields | 5 points |
| Content preview | 3 points |
| Filename | 2 points |

Exact matches score double. Results are sorted by total score descending.

## Filter Syntax

| Filter | Description | Example |
|--------|-------------|---------|
| `--type=XXX` | Filter by ARC document type code | `--type=ADR`, `--type=SECD` |
| `--project=NNN` | Filter by project number | `--project=001` |
| `--id=XX-NNN` | Find docs containing a requirement ID | `--id=BR-003` |

Filters can be combined with keywords. The keyword search applies after filters are applied.

## Tips

- Use **short, specific keywords** — "PostgreSQL" is better than "database technology selection"
- Use **`--type` filter** when you know what kind of document you're looking for
- Use **`--id` filter** to trace where a specific requirement is referenced
- **Quotes** around multi-word queries help: `/arckit:search "data residency"`
