# Repository Guidelines

## Project Structure & Module Organization

ArcKit is a multi-target architecture governance toolkit. Core plugin source lives in `plugins/arckit-claude/`; jurisdiction and specialist overlays live in sibling `plugins/arckit-*/` directories. Distributions under `extensions/` target Codex, Gemini, OpenCode, Copilot, Paperclip, Vibe, and Kimi. Python CLI source is in `src/arckit_cli/`; tooling is in `scripts/`; documentation and site assets are in `docs/`. Tests live in `tests/` by CLI or target, with script checks in `scripts/tests/`.

## Build, Test, and Development Commands

- `python -m pip install -e . pytest pyyaml` installs the CLI and test dependencies; use Python 3.11+ in a virtual environment.
- `python scripts/converter.py` regenerates all seven extension formats. Edit canonical source before regenerating.
- `python -m pytest -q` runs the full Python suite used by CI; generate extensions first.
- `python -m pytest tests/codex/test_codex_extension.py` runs focused Codex checks.
- `node tests/plugin/test_graph_inject.mjs` runs a hook test; execute other relevant `.mjs` suites similarly.
- `./scripts/bump-version.sh X.Y.Z` updates version-bearing files for a release.
- `npx markdownlint-cli2 "**/*.md"` checks Markdown style using `.markdownlint-cli2.jsonc`.

## Coding Style & Naming Conventions

Follow existing patterns: Python uses four-space indentation; JavaScript hooks and validators use ESM `.mjs`. Write documentation in UK English. Use lowercase hyphenated command names: `/arckit:data-model` for Claude, Gemini, and OpenCode; `$arckit-data-model` for Codex; `/arckit-data-model` for Copilot. Artifact filenames follow `ARC-NNN-TYPE-vN.N.md`, with sequences for multiple instances, e.g. `ARC-001-ADR-001-v1.0.md`.

## Testing Guidelines

Add focused regression tests near the affected target, using `test_*.py` for pytest and existing `.mjs` naming patterns for Node suites. Test generated output and execute changed hooks directly. Before releases or broad conversion changes, run the full Python suite, relevant Node checks, and Markdown linting.

## Commit & Pull Request Guidelines

Use conventional commits (`feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:`), optionally scoped, e.g. `fix(init): correct template file paths`. PRs should explain motivation and resulting behaviour, list validation commands, link issues, and include screenshots for UI changes. Update `CHANGELOG.md` under `Unreleased` and relevant docs. Follow `CONTRIBUTING.md` for new-command, overlay, and doc-type registration.

## Security & Configuration Tips

Keep secrets, local `.env` files, and generated session memory out of commits. Store template overrides in `.arckit/templates-custom/`. Preserve unrelated local changes, especially `.arckit/memory/*`.
