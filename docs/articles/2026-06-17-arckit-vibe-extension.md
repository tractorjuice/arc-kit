# ArcKit v5.14: Mistral Vibe Joins the Harness

**ArcKit now ships a Mistral Vibe CLI extension, published from its own `arckit-vibe` repository and regenerated from the same canonical plugin sources as Codex, Gemini, OpenCode, Copilot and Paperclip. The harness is no longer tied to one assistant surface; it now follows the architecture work across another AI CLI.**

---

## Why Vibe matters

ArcKit is deliberately not a hosted architecture app. It is a harness around the AI coding assistants teams already use: Claude Code, Codex CLI, Gemini CLI, OpenCode CLI, GitHub Copilot and now Mistral Vibe.

That matters because serious architecture work is not a single prompt. It is a chain of governed artifacts: stakeholder drivers, requirements, risks, decisions, diagrams, delivery plans, assurance evidence and traceability checks. The assistant can draft the work, but the harness gives it shape: commands, templates, document IDs, project structure, hooks, schemas and review gates.

Vibe support extends that model to another local AI CLI. If a team is standardising on Mistral's developer workflow, ArcKit can now bring the same architecture-governance method with it.

## What ships in 5.14.0

The new Vibe extension includes the same practical ArcKit surface area users expect from the other generated extension packages:

- converted ArcKit skills for the command catalogue
- Vibe agent TOML files generated from the canonical Claude agent definitions
- templates, scripts, schemas and reference materials copied from the core plugin
- MCP configuration for the bundled knowledge servers
- a Vibe-specific extension manifest and README
- release integration through the same generated-extension publishing path

The important implementation detail is that Vibe is generated from the canonical ArcKit plugin, not maintained as a hand-written fork. When the core commands, templates or agent definitions change, the converter regenerates Vibe alongside Codex, Gemini, OpenCode, Copilot and Paperclip.

## A separate repo, by design

The first Vibe work landed in `arc-kit`, but the right distribution shape is the same as the other non-Claude targets: a standalone generated extension repository.

That repository is now live:

```text
https://github.com/tractorjuice/arckit-vibe
```

Users install from there directly:

```bash
git clone https://github.com/tractorjuice/arckit-vibe.git
cd arckit-vibe
mkdir -p ~/.vibe/extensions/
ln -s "$(pwd)" ~/.vibe/extensions/arckit
```

The main ArcKit repo keeps the source of truth, converter logic, tests, version metadata and release wiring. The generated payload lives where users expect to consume it: in a small extension repository that can be cloned, pulled and inspected without dragging the full ArcKit source tree along.

## What the converter does

The converter now treats Vibe as a first-class generated target.

For command skills, it emits Vibe Markdown files with Vibe-compatible frontmatter and command names. For agents, it translates the Claude agent definitions into Vibe TOML files, maps tool names, rewrites extension paths to use `${VIBE_EXTENSION_ROOT}`, and records source metadata so generated files remain traceable.

It also copies the non-command reference skills Vibe needs at runtime, such as Mermaid syntax, PlantUML syntax, Wardley mapping references and the architecture workflow guide. That was the piece that made Vibe more than a list of command prompts: the assistant gets the supporting material the commands rely on.

## The release path is now symmetric

ArcKit's generated-extension publishing script now includes Vibe in the same default sync set as the existing extension repos:

```text
arckit-codex
arckit-gemini
arckit-opencode
arckit-copilot
arckit-paperclip
arckit-vibe
```

The `5.14.0` release pushed all six extension repositories. That keeps the version story simple: ArcKit core, plugin manifests, generated extension version files and the standalone extension repos move together.

The release also updates the markdown lint configuration to ignore generated Vibe payloads in the source checkout, matching the way other generated extension trees are treated. The tracked files stay focused on the source, metadata, tests and user-facing docs.

## What this says about ArcKit

Vibe support is another small proof of the larger architecture.

The durable asset is not one AI assistant integration. It is the governance method and the conversion pipeline around it. ArcKit can express the same architecture workflow through several assistant surfaces because the source is structured: commands, agents, templates, schemas, hooks and references are separable enough to be adapted.

That gives teams more room to choose their assistant without losing the governance layer. Claude Code remains the canonical plugin source. Codex, Gemini, OpenCode, Copilot, Paperclip and now Vibe are generated distributions. The method travels.

For architecture teams, that is the point. The assistant may change. The artifacts, controls and traceability should not.

## Links

- Release: [ArcKit v5.14.0](https://github.com/tractorjuice/arc-kit/releases/tag/v5.14.0)
- Pull request: [#598 — feat: add Mistral Vibe CLI extension support](https://github.com/tractorjuice/arc-kit/pull/598)
- Extension repo: [tractorjuice/arckit-vibe](https://github.com/tractorjuice/arckit-vibe)
- Issue: [#597 — Add support for Mistral Vibe](https://github.com/tractorjuice/arc-kit/issues/597)

<!-- arckit:community-block -->
## Join the ArcKit Community

- **Discord** — real-time conversation, help with commands, and what people are building: [discord.gg/HsA4Y3hQ4](https://discord.gg/HsA4Y3hQ4)
- **LinkedIn Group** — announcements, case studies, and longer-form discussion: [linkedin.com/groups/17641034](https://www.linkedin.com/groups/17641034/)
- **GitHub** — code, issues, and contributions: [github.com/tractorjuice/arc-kit](https://github.com/tractorjuice/arc-kit)
