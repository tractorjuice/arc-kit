# Repository Guidelines

## Project Structure & Module Organization

ArcKit is a multi-target architecture governance toolkit. The canonical plugin lives in `arckit-claude/`; generated or adapted distributions live in `arckit-codex/`, `arckit-gemini/`, `arckit-opencode/`, `arckit-copilot/`, and `arckit-paperclip/`. Python CLI source is in `src/arckit_cli/`. Shared release and conversion tooling is in `scripts/`. Documentation and site assets are under `docs/`. Tests are grouped by target in `tests/codex/`, `tests/plugin/`, and `tests/paperclip/`.

## Build, Test, and Development Commands

- `python scripts/converter.py` regenerates Codex, Gemini, OpenCode, Copilot, and Paperclip outputs from the Claude source commands.
- `pytest tests/codex/test_codex_extension.py` validates Codex plugin structure, hooks, and skill conversion.
- `pytest tests/plugin` runs plugin-focused Python tests.
- `node tests/plugin/test_graph_inject.mjs` and related `.mjs` files run hook utility tests.
- `./scripts/bump-version.sh X.Y.Z` updates version-bearing files for a release.
- `npx markdownlint-cli2 "**/*.md"` checks Markdown style using `.markdownlint-cli2.jsonc`.

## Coding Style & Naming Conventions

Use existing patterns before adding new abstractions. Python code uses standard 4-space indentation. JavaScript hook and validator files are ESM `.mjs` modules. Command and skill names use lowercase hyphenated forms. Slash commands use the colon namespace `/arckit:command` (Claude, Gemini, OpenCode); Codex skills use `$arckit-command`; Copilot uses `/arckit-command`. ArcKit artifact filenames must follow `ARC-NNN-TYPE-vN.N.md`; multi-instance artifacts include a sequence, for example `ARC-001-ADR-001-v1.0.md`.

## Testing Guidelines

Add focused tests near the affected target. For generated extension changes, test the generated output, not only the converter logic. Hook changes should include direct hook execution tests where possible. Before release or broad conversion changes, run the Codex test file, relevant `tests/plugin/*.mjs` checks, and markdownlint.

## Commit & Pull Request Guidelines

Use conventional commits: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`, or `chore:`. Examples from history include `fix: bring codex hooks to parity` and `chore: bump version to 4.20.1`. Pull requests should describe motivation, list validation commands, link related issues, and include screenshots for UI or documentation-site changes. Update `CHANGELOG.md` and target-specific docs when behaviour changes.

## Security & Configuration Tips

Do not commit secrets, local `.env` files, or generated session memory. Keep project-specific template overrides in `.arckit/templates-custom/`. When editing release files, avoid touching unrelated dirty files such as `.arckit/memory/*`.
