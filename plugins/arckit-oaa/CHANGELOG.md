# Changelog

## 1.0.0 (2026-08-16)

- **New standalone plugin**: split from `arckit-togaf-adm` as `arckit-oaa`

- 5 O-AA commands: `oaa-adm-lite`, `product-architecture`, `agile-strategy`, `agile-security`, `agile-governance`

- 5 templates with `_partials` inherited from the `arckit-agent-architecture` pattern

- Build recipe: `oaa-full` (strategy → product → ADM Lite → security → governance)

- References: quality-checklist, citation-instructions, O-AA C208 reference

- **No hard-coded engagement identifiers**: issue refs, checklist IDs, and external Vault paths are `${user_config.*}` placeholders with sensible empty-value fallbacks

- **userConfig keys** in `.claude-plugin/plugin.json`:

  - `organisation_name` — organisation/client name substituted into rendered artefacts
  - `project_issue_prefix` — identifier prefix for engagement/parent issue references (default `ARC`)
  - `safety_checklist_id` — safety/compliance checklist ID referenced in `governance-report.yaml` (blank → `[PENDING]` placeholder)
  - `references_dir` — directory of external reference documents; empty → organisation-specific references omitted

- **Rendering contract**: `templates/_partials/RENDERING.md` documents placeholder substitution for all O-AA templates, not just the doc-control partial

- No breaking changes; `arckit-oaa` is standalone and depends only on `arckit` core (foundation commands `principles`, `requirements`, `stakeholders` must run first)
