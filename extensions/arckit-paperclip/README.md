# ArcKit for Paperclip

Paperclip plugin for ArcKit, an enterprise architecture governance,
interoperability, and vendor procurement toolkit.

This repository is generated from the main ArcKit source repository:
https://github.com/tractorjuice/arc-kit

## What Is Included

- ArcKit command tools from `src/data/commands.json`
- 5 utility tools for project setup, document IDs, prerequisites, project lists,
  and plugin health checks
- Document templates under `templates/`
- Reference guidance under `references/`
- Handoff schemas and scoring rubrics under `schemas/`
- Built plugin entrypoints under `dist/`

## Install

Paperclip installs a plugin from a folder or from npm, and never builds one
itself. This plugin isn't on npm, so clone it, build it and install the
folder. The Paperclip server must be running.

```bash
git clone https://github.com/tractorjuice/arckit-paperclip.git
cd arckit-paperclip
npm install
npm run build
paperclipai plugin install .
```

To update, run `git pull` and `npm run build` in the same folder.

## Set up a project

ArcKit's tools read templates from your project's `.arckit/` folder, so
scaffold it once with the ArcKit CLI:

```bash
pip install git+https://github.com/tractorjuice/arc-kit.git
arckit init my-project --ai kimi
```

Or with `uv`:

```bash
uv tool install arckit-cli --from git+https://github.com/tractorjuice/arc-kit.git
arckit init my-project --ai kimi
```

Paperclip isn't one of the CLI's choices. `--ai kimi` creates the `.arckit/`
and `projects/` folders without copying any assistant's command files, so the
project suits Paperclip. Ignore the Kimi next steps it prints.

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
arckit-export-okf
arckit-import-okf
```

## OKF Interoperability

Use `arckit-export-okf` to export ArcKit artifacts as an OKF-compatible Markdown bundle. Use `arckit-import-okf` to import OKF bundles as reviewable ArcKit research notes.

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
