# ArcKit for Kimi Code CLI

The Enterprise Architecture Governance Harness, packaged as a Kimi Code CLI plugin.

## Install

Start `kimi`, then install the plugin from the prompt:

```text
/plugins install https://github.com/tractorjuice/arckit-kimi.git
```

## Set up a project

ArcKit skills read templates and helper scripts from your project's `.arckit/`
directory, so scaffold it once per repository:

```bash
pip install git+https://github.com/tractorjuice/arc-kit.git
arckit init my-project --ai kimi
```

## Use it

Every ArcKit command is an Agent Skill. Invoke one with `/skill:`:

```text
/skill:arckit-requirements
/skill:arckit-stakeholders
/skill:arckit-adr
```

The `architecture-workflow` skill loads automatically at session start and
recommends which command to run next.

## MCP servers

Six MCP servers ship with the plugin and are enabled by default. Toggle them
from `/plugins`. Two need API keys in your environment:

- `google-developer-knowledge` needs `GOOGLE_API_KEY`
- `datacommons-mcp` needs `DATA_COMMONS_API_KEY`

Without a key those two servers fail to connect and are marked failed. That is
expected and harmless; the rest of the plugin works normally.

## Licence

MIT. See LICENSE.
