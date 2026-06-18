# ArcKit for GitHub Copilot

GitHub Copilot prompt and agent bundle for ArcKit — The Enterprise Architecture
Governance Harness (strategy, architecture, delivery, assurance, and interoperability).

This repository is generated from the main ArcKit source repository:
https://github.com/tractorjuice/arc-kit

## What Is Included

- Reusable ArcKit Copilot prompts under `prompts/`
- 10 custom agent definitions under `agents/`
- Project instructions in `copilot-instructions.md`
- 112 document templates under `templates/`
- Handoff schemas and scoring rubrics under `schemas/`
- Helper scripts under `scripts/`

## Install

Use the ArcKit CLI to scaffold a project configured for GitHub Copilot:

```bash
pip install git+https://github.com/tractorjuice/arc-kit.git
arckit init my-project --ai copilot
cd my-project
```

Or with `uv`:

```bash
uv tool install arckit-cli --from git+https://github.com/tractorjuice/arc-kit.git
arckit init my-project --ai copilot
```

The CLI copies prompts into `.github/prompts/` and instructions into the project
so Copilot Chat can use them.

## Usage

Open Copilot Chat in the generated project and invoke ArcKit prompts from the
prompt picker or by typing `/`:

```text
arckit-plan
arckit-principles
arckit-requirements
arckit-risk
arckit-sow
arckit-evaluate
arckit-health
arckit-export-okf
arckit-import-okf
```

## OKF Interoperability

Use `arckit-export-okf` to export ArcKit artifacts as an OKF-compatible Markdown bundle. Use `arckit-import-okf` to import OKF bundles as reviewable ArcKit research notes.

## Updating

This standalone repository is synced from `arc-kit` releases. Pull the latest
commit from this repository, or regenerate a project with the latest ArcKit CLI.

## Documentation

- Main project: https://github.com/tractorjuice/arc-kit
- Website: https://arckit.org
- Releases: https://github.com/tractorjuice/arc-kit/releases
