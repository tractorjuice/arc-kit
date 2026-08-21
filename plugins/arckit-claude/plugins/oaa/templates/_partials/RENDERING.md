# ArcKit Template Rendering Rules

When a template contains the marker `<!-- DOC-CONTROL-HEADER -->`, the command that reads the template MUST resolve the marker to the contents of one of the partials in this directory before writing the artefact to disk:

1. **Read the user's plugin userConfig** for `governance_framework` and `classification_scheme`.
2. **Choose the partial**:

   - If `governance_framework` is `UAE Federal` OR `classification_scheme` is `UAE Smart Data` → use `document-control-uae.md`.

   - Otherwise → use `document-control-uk.md`.
3. **Inline the chosen partial's contents** at the marker location, applying the standard `${user_config.organisation_name}` and `${user_config.default_classification}` substitutions.
4. **Remove the `<!-- DOC-CONTROL-HEADER -->` marker line and its descriptive comment** from the final output.
5. **Populate the UAE-specific fields** (Federal Entity, Cabinet Instrument cited, Sovereign Cloud Region, AI Autonomy Tier) from upstream artefacts where available, or leave the `[PENDING — ...]` placeholder for the architect to fill.

The marker comment is informational only; it does not appear in any rendered artefact.

## Configurable placeholder substitutions

All O-AA templates use `${user_config.*}` placeholders for previously hard-coded engagement details. When rendering any template (not just the doc-control partial), apply these substitutions:

| Placeholder | userConfig key | Empty-value behaviour |
|---|---|---|
| `${user_config.organisation_name}` | `organisation_name` | `[PENDING — organisation]` |
| `${user_config.default_classification}` | `default_classification` | `PUBLIC` |
| `${user_config.project_issue_prefix}` | `project_issue_prefix` | `ARC` |
| `${user_config.safety_checklist_id}` | `safety_checklist_id` | `[PENDING — safety checklist ID]` |
| `${user_config.references_dir}` | `references_dir` | omit the reference entry (see below) |

**External references:** reference lists in templates are built from `${user_config.references_dir}`. If `references_dir` is set, list the documents found there with relative paths; if empty, render only the standard O-AA/TOGAF references and omit any organisation-specific entries. Never hard-code absolute paths into rendered artefacts.

## Quick reference

| User config | Partial used | UAE-specific block |
|---|---|---|
| `governance_framework: UK Gov`, any `classification_scheme` other than `UAE Smart Data` | `document-control-uk.md` | omitted |
| `governance_framework: Generic`, any `classification_scheme` other than `UAE Smart Data` | `document-control-uk.md` | omitted |
| `governance_framework: UAE Federal`, any `classification_scheme` | `document-control-uae.md` | included |
| any `governance_framework`, `classification_scheme: UAE Smart Data` | `document-control-uae.md` | included |
