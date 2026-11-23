# ArcKit for Google Antigravity

ArcKit's enterprise architecture governance commands, packaged as an Antigravity plugin.

> **Experimental.** This plugin passes Antigravity's own check (`agy plugin validate --strict`) and installs with `agy plugin install`. Eight core commands have been run in Antigravity (start, init, principles, stakeholders, requirements, devops, secure and aws-research, on 22 November 2026) and each wrote its document from its template. The other 182 have not been run there yet. Please [open an issue](https://github.com/tractorjuice/arc-kit/issues) with what you find.

## Install

```bash
agy plugin install https://github.com/tractorjuice/arckit-antigravity
```

Using Gemini CLI? ArcKit's established extension for it is [arckit-gemini](https://github.com/tractorjuice/arckit-gemini).

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

## Subagents, checks and a rule

These three parts are generated in the format Antigravity documents and pass `agy plugin validate --strict`. They have not yet been run in a live Antigravity session.

- **Twelve subagents.** The research commands (`/arckit-research`, `/arckit-datascout`, `/arckit-grants`, `/arckit-tenders`, `/arckit-competitors`, the three cloud research commands, the three government code commands and `/arckit-framework`) hand their work to a subagent, so the pages they read stay out of your conversation. If a subagent can't be started, the command does the work itself. `/arckit-evaluate` and `/arckit-score` stay in your conversation.
- **Checks on what gets written.** Before Antigravity creates or edits a file, the plugin stops a wrongly named `ARC-` document and names the right path, stops a write to a protected file such as `.env`, a lock file or a private key, and stops text that looks like a credential. After a write it updates the project's manifest where there is one. These need Node.js 18 or later. If a check can't run, a write to an `ARC-` document is stopped; any other write goes ahead.
- **One rule.** ArcKit's conventions for naming, status, citations and requirement IDs apply while an `ARC-` document is in context.

The protected-file check applies in every workspace while the plugin is enabled, not only in ArcKit projects. Turn the plugin off in a workspace where it gets in the way.

## What is not here yet

- **Session context, provenance stamps and the other Claude Code hooks.** Antigravity has no event for some of them, and the stamp records settings only Claude Code has.
- **Long commands.** Antigravity loads the first 24,000 bytes of a skill. Thirty-three ArcKit commands are longer, so each of those tells the agent to read the rest from a file in the skill's folder first.

## Licence

MIT. See LICENSE.
