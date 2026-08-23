# O-AA Placeholder Substitutions

O-AA templates carry `${user_config.*}` placeholders in place of hard-coded
engagement details, so one template serves every organisation without editing.
When rendering any O-AA template, apply the substitutions below.

This file is **plugin-local to `arckit-oaa`**. It is deliberately not part of
the shared-asset set synced from the core `arckit` plugin: the keys it documents
are declared in `arckit-oaa`'s own `plugin.json` `userConfig` block and exist in
no other plugin. Document Control rendering is a separate concern and is owned
by `templates/_partials/RENDERING.md`, which is shared and must stay identical
to core.

| Placeholder | userConfig key | Empty-value behaviour |
|---|---|---|
| `${user_config.organisation_name}` | `organisation_name` | `[PENDING — organisation]` |
| `${user_config.default_classification}` | `default_classification` | `PUBLIC` |
| `${user_config.project_issue_prefix}` | `project_issue_prefix` | `ARC` |
| `${user_config.safety_checklist_id}` | `safety_checklist_id` | `[PENDING — safety checklist ID]` |
| `${user_config.references_dir}` | `references_dir` | omit the reference entry (see below) |

`organisation_name` and `default_classification` are also consumed by the
Document Control partial that `_partials/RENDERING.md` selects. Substitute them
once, consistently, across both the Document Control block and the body.

## External references

Reference lists in O-AA templates are built from `${user_config.references_dir}`:

- If `references_dir` is set, list the documents found there using paths relative
  to the repository root.
- If it is empty, render only the standard O-AA and TOGAF references and omit
  every organisation-specific entry.
- Never write an absolute filesystem path into a rendered artefact.

A document listed here is an input to the artefact, so it also belongs in the
`## External References` Document Register — see `references/citation-instructions.md`.
