# Changelog

## 1.1.0 (2026-07-27)

- Adds `/arckit:repo-audit` for auditing a codebase against architecture principles and requirements (#616)
- Accepts a local path, a public GitHub or GitLab URL, or the current repository; remote targets are shallow-cloned to a temporary directory after confirmation and deleted afterwards
- Two automatically inferred modes: conformance (scores the codebase against PRIN/REQ artefacts) and cold (standalone as-built audit). Degrades rather than erroring when prerequisites are thin
- Writes a `CDAU` Codebase Audit artefact to `projects/{PID}-{name}/audits/`, multi-instance so one project can audit several repositories
- Findings carry both severity and confidence (Verified / Inferred / Absent), and undocumented decisions are emitted as ready-to-file ADR stubs
- Never executes code from the audited repository, never writes a secret value into the report, and never writes into the audited repo
- Private repositories are out of scope; clone locally and audit the path instead
- Plugin is no longer exempt from the shared-asset sync, so it now carries `templates/_partials/` and `references/` for the Document Control header

## 1.0.0 (2026-07-04)

- Initial release
- Adds `/arckit:repo-docs` for source-grounded, agent-readable repository documentation
- Writes repository docs under `docs/repository/`
- Uses OpenWiki-inspired targeted discovery, git-history-aware updates, temporary planning, source references, and secret avoidance
