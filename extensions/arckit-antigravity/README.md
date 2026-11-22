# ArcKit for Google Antigravity

ArcKit's enterprise architecture governance commands, packaged as an Antigravity plugin.

> **Experimental.** This plugin passes Antigravity's own check (`agy plugin validate --strict`) and installs with `agy plugin install`. One command, `/arckit-start`, has been run in Antigravity's command line (agy 1.5.13) and received the text typed after it. The other 189 have not been run there yet. Please [open an issue](https://github.com/tractorjuice/arc-kit/issues) with what you find.

## Install

```bash
agy plugin install https://github.com/tractorjuice/arckit-antigravity
```

Check it loaded with `agy plugin list`. If your shell can't find `agy`, it is at `~/.gemini/bin/agy`. To update, run the install command again.

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

Antigravity does not put a plugin's name in front of its skills, so every ArcKit skill starts `arckit-`, the four reference skills included (`arckit-mermaid-syntax`, `arckit-plantuml-syntax`, `arckit-wardley-mapping`, `arckit-architecture-workflow`).

Every output is a draft for a qualified person to review. See [What ArcKit does not do](https://github.com/tractorjuice/arc-kit#what-arckit-does-not-do).

## MCP servers

Five servers come with the plugin and need no key: AWS Knowledge, Microsoft Learn, govreposcrape, UK Tenders and Trello.

Two more need a key and are left out, because a plugin with an unfilled key installs switched off: Google Developer Knowledge (`GOOGLE_API_KEY`) and Data Commons (`DATA_COMMONS_API_KEY`). To use them, add each to your workspace's `.agents/mcp_config.json` with its key in a header.

## What is not here yet

- **Agents and hooks.** The plugin ships skills and MCP servers only. Research commands run in the main conversation.
- **Long commands.** Antigravity loads the first 24,000 bytes of a skill. Twenty-nine ArcKit commands are longer, so each of those tells the agent to read the rest from a file in the skill's folder first.

## Licence

MIT. See LICENSE.
