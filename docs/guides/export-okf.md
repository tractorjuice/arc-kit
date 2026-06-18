# `/arckit:export-okf` - Open Knowledge Format export

Export ArcKit project artifacts into an Open Knowledge Format-shaped Markdown bundle for sharing with tools that expect lightweight metadata frontmatter.

## Quick Start

```text
/arckit:export-okf --project 001 --out okf/001
```

Export every project:

```text
/arckit:export-okf --all --out okf/all
```

The command writes copied artifacts under the output directory. It does not modify source files in `projects/`.

## Output

The export directory contains:

| Path | Purpose |
|---|---|
| `index.md` | Bundle-level index of exported artifacts |
| `log.md` | Export summary and warnings |
| `projects/.../ARC-*.md` | Copied ArcKit artifacts with OKF frontmatter |

Each exported artifact keeps the original Markdown body and receives frontmatter fields such as `type`, `title`, `description`, `resource`, `timestamp`, `tags`, and an `arckit` metadata object.

## What Gets Exported

`export-okf` scans standardized ArcKit Markdown artifacts whose filenames match:

```text
ARC-NNN-TYPE-vN.N.md
ARC-NNN-TYPE-SEQ-vN.N.md
```

Examples:

```text
projects/001-demo/ARC-001-REQ-v1.0.md
projects/001-demo/decisions/ARC-001-ADR-001-v1.0.md
projects/001-demo/research/ARC-001-RSCH-003-v1.0.md
```

## Project Selection

| Option | Meaning |
|---|---|
| `--project 001` | Export the matching project directory, for example `001-demo` |
| `--project 001-demo` | Export the exact project directory |
| `--all` | Export every numbered project directory under `projects/` |
| `--out <path>` | Write the bundle to this path, relative to the repo root unless absolute |

Use one of `--project` or `--all`, not both.

## Interoperability Notes

ArcKit remains the source format. OKF is an export layer that adds portable metadata for downstream knowledge tools while preserving the original ARC filenames, headings, and content.

The export mirrors source paths beneath the output directory so reviewers can trace every OKF copy back to its ArcKit source artifact.

## Limitations

- The command exports Markdown artifacts only.
- It does not promise compatibility with every future OKF consumer.
- It does not import OKF content back into ArcKit; use the import workflow when available.
- Existing malformed frontmatter in a source file is left unchanged in the copied output.
