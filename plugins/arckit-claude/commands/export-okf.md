---
description: Export ArcKit project artifacts as an Open Knowledge Format bundle without changing source ARC files
argument-hint: "(--all | --project <id>) [--out <path>]"
tags: [okf, export, interoperability, knowledge, markdown]
effort: medium
---

# ArcKit: Export OKF Bundle

Export ArcKit ARC artifacts into an Open Knowledge Format-shaped Markdown bundle. This command writes enriched copies under the requested output directory and leaves source files in `projects/` unchanged.

## User Input

```text
$ARGUMENTS
```

## Process

1. Parse the user input. Require either `--all` or `--project <id>`. Use `--out okf` when no output path is supplied.
2. Run the export script from the repository root:

```bash
node ${CLAUDE_PLUGIN_ROOT}/scripts/export-okf.mjs $ARGUMENTS
```

3. Read the JSON summary from the script output.
4. Report the output directory, artifact count, included projects, warnings, and the generated `index.md` / `log.md` files.

## Success Criteria

- The export command completes successfully.
- Source files under `projects/` are not modified.
- Exported Markdown files include OKF frontmatter with ArcKit metadata.
- The output directory contains `index.md` and `log.md`.

## Example Usage

```text
/arckit:export-okf --project 001 --out okf/001
/arckit:export-okf --all --out okf/all
```

## Key References

| Reference | URL |
|---|---|
| Open Knowledge Format blog | https://cloud.google.com/blog/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing |
| OKF proposal gist | https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f |

## Notes

- This is an interoperability export, not a native ArcKit storage-mode change.
- The export mirrors each source path beneath the output directory so provenance is clear.
- Existing source frontmatter is preserved and merged in the exported copy.
