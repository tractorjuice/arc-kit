# ArcKit for Paperclip

Paperclip plugin for ArcKit, an enterprise architecture governance and vendor
procurement toolkit.

This repository is generated from the main ArcKit source repository:
https://github.com/tractorjuice/arc-kit

## What Is Included

- 116 ArcKit command tools from `src/data/commands.json`
- 5 utility tools for project setup, document IDs, prerequisites, project lists,
  and plugin health checks
- 109 document templates under `templates/`
- Reference guidance under `references/`
- Handoff schemas and scoring rubrics under `schemas/`
- Built plugin entrypoints under `dist/`

## Install

Use the ArcKit CLI to scaffold a project with the standard ArcKit directory
layout, templates, schemas, and project metadata:

```bash
pip install git+https://github.com/tractorjuice/arc-kit.git
arckit init my-project
cd my-project
```

Or with `uv`:

```bash
uv tool install arckit-cli --from git+https://github.com/tractorjuice/arc-kit.git
arckit init my-project
```

Then install this repository as a Paperclip plugin using Paperclip's plugin
installation flow.

## Development

```bash
npm install
npm run typecheck
npm run build
```

`package.json` exposes the Paperclip plugin manifest and worker:

```json
{
  "paperclipPlugin": {
    "manifest": "./dist/manifest.js",
    "worker": "./dist/worker.js"
  }
}
```

## Usage

ArcKit command tools are registered with the `arckit-` prefix:

```text
arckit-plan
arckit-principles
arckit-requirements
arckit-risk
arckit-sow
arckit-evaluate
arckit-health
```

Utility tools include:

```text
arckit-create-project
arckit-generate-doc-id
arckit-check-prerequisites
arckit-list-projects
arckit-check
```

## Updating

This standalone repository is synced from `arc-kit` releases. Pull the latest
commit from this repository, or regenerate a project with the latest ArcKit CLI.

## Documentation

- Main project: https://github.com/tractorjuice/arc-kit
- Website: https://arckit.org
- Releases: https://github.com/tractorjuice/arc-kit/releases
