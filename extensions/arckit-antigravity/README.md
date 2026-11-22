# ArcKit for Google Antigravity

ArcKit's enterprise architecture governance commands, packaged as an Antigravity plugin.

> **Experimental and not yet run in Antigravity.** This plugin is built from Antigravity's published plugin format and checked against it by ArcKit's own tests. Nobody has installed it in Antigravity yet. Please [open an issue](https://github.com/tractorjuice/arc-kit/issues) with what you find.

## Install

The plugin is generated from the ArcKit repository. Build it, then install the folder:

```bash
git clone https://github.com/tractorjuice/arc-kit.git
cd arc-kit
uv run --no-project --with pyyaml python scripts/converter.py
agy plugin install ./extensions/arckit-antigravity
```

Check it loaded with `agy plugin list`. Without the `agy` command, copy the `arckit-antigravity` folder into `~/.gemini/config/plugins/` or your workspace's `.agents/plugins/`.

## Set up a project

ArcKit's commands read templates and helper scripts from your project's `.arckit/` folder, so scaffold it once in each repository:

```bash
pip install git+https://github.com/tractorjuice/arc-kit.git
arckit init my-project --ai antigravity
```

You also need Node.js on your `PATH` for the helper scripts.

## Use it

Every ArcKit command is an Agent Skill. Type its name after a slash:

```text
/arckit-start
/arckit-principles Create principles for a financial services company
/arckit-requirements Build a payment processing system
```

Antigravity does not put a plugin's name in front of its skills, so every ArcKit skill starts `arckit-`.

Every output is a draft for a qualified person to review. See [What ArcKit does not do](https://github.com/tractorjuice/arc-kit#what-arckit-does-not-do).

## MCP servers

Five servers come with the plugin and need no key: AWS Knowledge, Microsoft Learn, govreposcrape, UK Tenders and Trello.

Two more need a key and are left out, because a plugin with an unfilled key installs switched off: Google Developer Knowledge (`GOOGLE_API_KEY`) and Data Commons (`DATA_COMMONS_API_KEY`). To use them, add each to your workspace's `.agents/mcp_config.json` with its key in a header.

## What is not here yet

- **Agents and hooks.** The plugin ships skills and MCP servers only. Research commands run in the main conversation.
- **A published repository.** You install from a build of this folder, as above.
- **What you type after the command.** Antigravity's documentation does not say how a skill receives it. If a command ignores your text, say what you want in the next message.

## Licence

MIT. See LICENSE.
