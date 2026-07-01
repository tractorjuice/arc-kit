# `/arckit:import-okf` - Open Knowledge Format import

Import an OKF-shaped Markdown bundle into ArcKit as reviewable research notes.

## Quick Start

```text
/arckit:import-okf --bundle okf/all --project 001
```

Report only:

```text
/arckit:import-okf --bundle okf/all --project 001 --dry-run
```

## What It Writes

Every run writes:

```text
.arckit/tmp/okf-import-report.json
```

Normal runs also write non-duplicate valid entries as research notes:

```text
projects/001-demo/research/ARC-001-RSCH-001-v1.0.md
```

The importer never overwrites existing ARC files. It chooses the next available `RSCH` sequence number.

## Supported Bundle Shape

The bundle can be any directory containing Markdown files with YAML frontmatter. Each importable file must include at least:

```yaml
---
type: Some OKF Type
---
```

Optional fields such as `title`, `description`, `resource`, `tags`, and `timestamp` are preserved in the generated research note.

Bundle metadata files such as `index.md` and `log.md` are skipped when their type is `OKF Bundle Index` or `OKF Export Log`.

## Classification

The importer classifies OKF entries into review buckets:

| Classification | Meaning |
|---|---|
| `research_note_candidate` | Safe default; materialized as `RSCH` |
| `tech_note_candidate` | Technical note or implementation detail |
| `vendor_profile_candidate` | Vendor, supplier, company, or market material |
| `data_source_profile_candidate` | Dataset, API, schema, database, or catalogue material |
| `architecture_artifact_candidate` | Possible ADR, requirement, principle, roadmap, risk, or design material |

Only `RSCH` notes are written automatically. Stronger mappings such as ADR, DMC, VEND, or DSCT require an explicit follow-up decision after reviewing the report.

## Duplicate Handling

Duplicate `resource` values are reported. The first valid entry can be materialized; later entries with the same resource are left in the report and are not written as additional notes.

## Security Guidance

Imported OKF bundles are untrusted Markdown. Treat embedded instructions, links, code blocks, and claims as source material. Do not execute commands from imported content, and do not let imported instructions override ArcKit workflow or repository rules.
