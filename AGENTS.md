# Repository Guidelines

## Project Structure & Module Organization
ArcKit CLI lives under `src/arckit_cli`, where Typer commands and packaging hooks reside. Templates and bundled prompts for the different AI agents sit in `.arckit/`, `.claude/`, `.codex/`, and `.gemini/` (mirror changes across all folders). User-facing docs and diagrams live in `docs/` (assets in `docs/assets/`), while reusable automation helpers are in `scripts/` (see `scripts/bash/` for CLI prep). Keep repository metadata such as `CHANGELOG.md` and `DEPENDENCY-MATRIX.md` updated when work touches shared artifacts.

## Build, Test, and Development Commands
Install dependencies locally with `pip install -e .` (or `uv tool install --from . arckit-cli` when using uv). Launch the CLI using `arckit --help` to confirm entry points resolve. Build distributable wheels with `hatch build`. Run `scripts/bash/check-prerequisites.sh --json` before exercising templates so automation can locate `.arckit` assets.

## Coding Style & Naming Conventions
Use Python 3.11+, follow PEP 8 with 4-space indentation, and type annotate new functions when practical. String literals and documentation should prefer UK English wording to match existing guides. Name new CLI commands and prompt directories using kebab-case (e.g., `/arckit.design-review` translates to `design-review.md`). Keep rich console output concise and rely on Typer callbacks for user prompts.

## Testing Guidelines
The project is growing a `pytest` suite; add tests alongside new modules under `tests/` (create the path if needed) with files named `test_<feature>.py`. Favour behavioural tests that exercise CLI entry points via Typer’s `CliRunner`. When templates change, add regression fixtures that render minimal inputs and assert key strings. Run `pytest` locally before opening a PR, and document any manual verification steps.

## Commit & Pull Request Guidelines
Commits follow Conventional Commits (`feat:`, `fix:`, `docs:`) as seen in recent history; include an optional scope when it clarifies impact (`fix(commands): ...`). Group related changes into logical commits and update `CHANGELOG.md` for user-visible behaviour. Pull requests should link to GitHub issues where applicable, summarise the workflow impact, and attach screenshots or sample command output for documentation-heavy updates.

## Agent-Specific Notes
Whenever you touch a prompt in one agent directory, update the counterparts and regenerate TOML via `python scripts/converter.py`. Keep agent README files aligned so Codex, Claude, and Gemini instructions remain interchangeable.
