# ArcKit for OpenCode

OpenCode extension for ArcKit, an enterprise architecture governance and vendor
procurement toolkit.

This repository is generated from the main ArcKit source repository:
https://github.com/tractorjuice/arc-kit

## What Is Included

- 116 ArcKit commands under `commands/`
- 10 research and specialist agents under `agents/`
- 112 document templates under `templates/`
- Handoff schemas and scoring rubrics under `schemas/`
- Helper scripts under `scripts/`
- MCP configuration in `opencode.json`

## Install

Use the ArcKit CLI to scaffold a project configured for OpenCode:

```bash
pip install git+https://github.com/tractorjuice/arc-kit.git
arckit init my-project --ai opencode
cd my-project
opencode
```

Or with `uv`:

```bash
uv tool install arckit-cli --from git+https://github.com/tractorjuice/arc-kit.git
arckit init my-project --ai opencode
```

## Usage

ArcKit commands are available in OpenCode with `/arckit.<command>`:

```text
/arckit:plan
/arckit:principles
/arckit:requirements
/arckit:risk
/arckit:sow
/arckit:evaluate
/arckit:health
```

## Updating

This standalone repository is synced from `arc-kit` releases. Pull the latest
commit from this repository, or regenerate a project with the latest ArcKit CLI.

## Documentation

- Main project: https://github.com/tractorjuice/arc-kit
- Website: https://arckit.org
- Releases: https://github.com/tractorjuice/arc-kit/releases
