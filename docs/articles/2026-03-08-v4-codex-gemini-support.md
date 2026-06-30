# ArcKit v4: First-Class Codex and Gemini Support with Hooks, MCP Servers, and Native Policies

If you've been using ArcKit with Codex CLI or Gemini CLI, the v4 release series (now at v4.0.1) changes everything about your experience. What were previously converted copies of Claude Code commands are now fully native extensions, complete with their own hook systems, policy enforcement, MCP server integrations, autonomous agents, and, in Gemini's case, a custom terminal theme drawn from the UK Government Design System.

This isn't a cosmetic update. The v4.0.0 release represents a fundamental restructuring of how ArcKit distributes its 57 architecture governance commands across five AI assistant platforms. The Claude Code plugin remains the source of truth, but the Codex and Gemini extensions are no longer second-class citizens receiving a watered-down translation. They're native extensions that speak each platform's language fluently.

Here's what that means in practice.

## What Gemini CLI Users Get

The Gemini CLI extension has matured into the most feature-rich distribution outside of Claude Code itself. It's not just commands in TOML format. It's a complete governance environment built on Gemini's native extension architecture.

### Native Hook System

Five Python hooks fire at precisely the right moments in the Gemini lifecycle, providing the same kind of automated governance that Claude Code users have enjoyed through its Node.js hook system.

When a session starts, the first hook fires immediately, injecting ArcKit's version number and project context into the conversation. This means Gemini knows, from the very first prompt, which ArcKit version is running and what project state it's working with. There's no need for the user to manually provide context. The hook handles it silently with a five-second timeout.

Before any agent begins its work, a second hook kicks in with a ten-second window. This one is more substantial: it scans the project directory, builds an inventory of existing architecture artifacts, and injects that context before the agent starts planning. If you have a requirements document, three ADRs, and a risk register already in your project, the agent knows about all of them before it writes a single line. This prevents duplicate work and ensures new artifacts reference existing ones.

The real enforcement happens at the tool level. Before any file write operation, two hooks fire in sequence. The first validates that any file being written follows the ARC-xxx naming convention, the standardised document identifier format that keeps architecture artifacts traceable and organised. The second protects ArcKit's own system files from accidental modification. If an agent tries to overwrite an extension configuration file, the hook blocks it.

After a successful write, a fifth hook updates the project's manifest.json automatically. Every new architecture artifact gets registered without the user lifting a finger.

### Declarative Policy Rules

Where Claude Code handles security concerns through hooks, Gemini's extension architecture offers something arguably more elegant: declarative policy rules defined in TOML.

ArcKit ships two policies with the Gemini extension. The first is a hard deny rule that prevents any modification of ArcKit's own extension files. If an agent or command attempts to write to or edit anything within the extension's installation directory, the operation is blocked outright with a clear explanation that these files are managed by the extension itself. This isn't a warning. It's a wall.

The second policy takes a softer approach. When file content being written contains patterns that suggest secrets, such as private keys, hardcoded passwords, API keys, or secret values, the policy triggers an ask decision. The operation pauses, the user sees a warning that the content may contain sensitive material, and they must explicitly confirm before the write proceeds. This catches the accidental inclusion of credentials in architecture documents, which happens more often than anyone likes to admit.

The beauty of this approach is that policies are declarative. They don't require running code. They're configuration. And they complement the hooks rather than duplicating them, giving Gemini users two layers of governance enforcement through two different native mechanisms.

### MCP Servers in the Extension Manifest

Four Model Context Protocol servers come bundled directly in the Gemini extension manifest. AWS Knowledge provides access to AWS service documentation, best practices, and Well-Architected Framework guidance. Microsoft Learn connects to Azure and Microsoft's full documentation library. Google Developer Knowledge taps into GCP's documentation. And Data Commons opens up structured data APIs.

These aren't theoretical integrations. When you run ArcKit's Azure research command through Gemini CLI, the agent is querying Microsoft Learn's actual MCP endpoint, pulling current documentation rather than relying on whatever the model absorbed during training. The same applies to AWS and GCP research: real documentation, real-time, through native MCP connections.

### GDS Terminal Theme

This one is specific to Gemini CLI's theming capabilities. ArcKit ships a custom terminal theme built on the UK Government Digital Service Design System colour palette. The dark background uses GDS black, text renders in the system's prescribed light greys, links appear in GDS blue, and status indicators follow the established green-orange-red pattern for success, warning, and error states.

It's more than aesthetic. For teams working in UK public sector contexts, seeing GDS colours signals that this is a governance tool built for their environment. It's a subtle but meaningful piece of identity that reinforces what ArcKit is designed for.

### Six Autonomous Agents

The Gemini extension includes all six of ArcKit's autonomous agents, each with native Gemini agent configurations. The general research agent handles market research, vendor evaluation, and build-versus-buy analysis. The datascout agent discovers data sources and API catalogues. Three cloud-specific agents for AWS, Azure, and GCP conduct deep service research using their respective MCP servers. And the newest addition, the framework agent, transforms existing architecture artifacts into structured, reusable frameworks with principles, patterns, and guidance.

Each agent runs autonomously in its own context, keeping heavy web research isolated from the main conversation. This is the same architectural pattern used in the Claude Code plugin, but implemented through Gemini's native agent system.

## What Codex CLI Users Get

The Codex extension took a different path to first-class status. Rather than hooks and policies, it leans into Codex CLI's native skills architecture and TOML-based agent configuration to deliver the same governance capabilities through the mechanisms Codex was designed around.

### Skills Architecture

Every ArcKit command is now a proper Codex skill. That's 65 skill directories: 57 commands plus four reference skills for architecture workflow guidance, Mermaid diagram syntax, PlantUML syntax, and Wardley mapping notation.

Each skill lives in its own directory with a SKILL.md file containing the command's frontmatter and full prompt, alongside an OpenAI agent YAML configuration. Every skill is set to explicit invocation only, with no implicit triggering. This is a deliberate design choice. Architecture governance commands should run when an architect asks for them, not when an AI assistant thinks it's spotted an opportunity. You invoke a requirements skill because you're ready to write requirements, not because the model noticed you mentioned the word.

The skill format also means Codex CLI's native discovery and invocation system works exactly as designed. Skills show up in Codex's skill listing, they accept the same argument patterns, and they integrate with Codex's existing workflow without any adaptation layer or compatibility shim.

### Agent System

Six agents ship with the Codex extension, each defined through two files: a markdown file containing the agent's full system prompt, and a TOML configuration file specifying developer instructions, operational constraints, and references back to the agent prompt.

The TOML configuration ties into Codex's global agent settings, which cap concurrent threads at three, limit agent depth to one level (no agents spawning agents), and enforce a ten-minute maximum runtime per job. These constraints exist for good reason. Architecture research agents can consume significant resources when they're querying MCP servers and synthesising findings. The caps prevent runaway operations while still giving agents enough room to do thorough work.

This is notably different from how Claude Code handles agents. In the plugin, agents run via the Task tool as autonomous subprocesses. In Codex, they run within Codex's own agent framework with its own concurrency model. Same agents, same prompts, but executing through each platform's native mechanism.

### MCP Servers via config.toml

The same four cloud knowledge bases available to Claude Code and Gemini users are configured in the Codex extension's config.toml. AWS Knowledge, Microsoft Learn, Google Developer Knowledge, and Data Commons, all wired through Codex's native configuration format.

The config.toml is auto-generated by ArcKit's converter, ensuring it stays perfectly synchronised with the MCP configurations in the Claude Code plugin and Gemini extension. When a new MCP server is added to the plugin, it flows through to Codex automatically on the next conversion run.

### Reference Skills

Four reference skills deserve special mention because they serve a different purpose from the command skills. Rather than generating architecture artifacts, these skills act as always-available knowledge bases within the Codex environment.

The architecture workflow skill provides guidance on how ArcKit's commands relate to each other and in what order they're typically used. The Mermaid syntax skill gives the agent accurate diagram syntax without relying on training data that might be outdated. The PlantUML syntax skill does the same for PlantUML diagrams. And the Wardley mapping skill provides the create.wardleymaps.ai syntax used for strategic mapping visualisations.

These reference skills mean a Codex agent generating an architecture diagram can consult the correct, current syntax reference rather than guessing from its training data.

## The Converter: One Source, Five Formats

Behind all of this sits a single Python script that transforms one set of command definitions into five native formats. Understanding how it works explains why Codex and Gemini support could leap so far forward in a single release.

The 57 commands live as markdown files with YAML frontmatter in the Claude Code plugin directory. This is the single source of truth. Every command's description, arguments, prerequisites, prompt, and handoff metadata exists in one place, maintained once.

The converter is driven by a configuration dictionary where each AI target is simply an entry specifying its output format, path conventions, and any platform-specific transformations. Adding support for a new AI assistant doesn't require rewriting the converter. It requires adding one dictionary entry and a format function.

The transformations are more involved than simple format conversion. Path rewriting replaces Claude Code's plugin-relative path references with platform-specific paths for Gemini extensions, Codex skills, and OpenCode commands. Format conversion transforms markdown with YAML frontmatter into TOML for Gemini, skill directories for Codex, or differently-structured markdown for OpenCode. Handoffs, the machine-readable workflow metadata that tells the AI what command logically follows, get rendered from YAML into prose "Suggested Next Steps" sections for platforms that don't read YAML frontmatter natively.

But the converter does far more than translate commands. It generates Codex's config.toml with MCP server definitions and agent role settings. It creates per-agent TOML configuration files for the Codex extension. It generates Gemini's hook scripts and policy rules. And it copies templates, helper scripts, command guides, and reference materials to every extension directory, ensuring each distribution is self-contained.

The practical result is that a change to any command in the Claude Code plugin propagates to all five distributions with a single converter run. No manual synchronisation, no drift between platforms, no risk of one extension falling behind.

## Hook Systems Compared

One of the most interesting aspects of ArcKit's multi-platform architecture is how governance enforcement adapts to each platform's native capabilities.

Claude Code has the deepest hook integration by a significant margin. Fifteen Node.js hooks span five lifecycle events. A session start hook initialises context. Six hooks fire on user prompt submission, handling everything from project artifact inventory injection to secret detection in prompts, guide synchronisation for the documentation command, and pre-processing for health checks, traceability scans, and governance gap analysis. Three hooks fire before tool use, validating filenames, protecting system files, and scanning for secrets in file content. A post-tool-use hook updates manifests after writes. And a permission request hook automatically grants MCP tool permissions so users aren't constantly confirming access to cloud knowledge bases.

The prompt submission hooks deserve special attention because several of them act as pre-processors. Before the health check command runs, a hook has already scanned the project and gathered findings. Before the traceability command runs, a hook has already extracted requirements and computed coverage metrics. This pre-processing eliminated hundreds of tool calls that would otherwise happen during command execution. In one case, it reduced over three hundred tool calls to zero.

Gemini CLI takes a different but equally valid approach. Five Python hooks cover the equivalent lifecycle moments: session start, before-agent, before-tool, and after-tool. The hook count is lower because Gemini's policy system handles some of what Claude Code does in hooks. Secret detection, for instance, is a hook in Claude Code but a declarative policy rule in Gemini. File protection is both a hook for active blocking and a policy for declarative denial. The two mechanisms complement each other, giving Gemini users two layers of governance without duplicating logic.

Codex CLI doesn't have a native hook system in the same way. Instead, governance is handled through the agent TOML configurations and through instructions embedded directly in skill prompts. The converter bakes validation guidance, including filename conventions, prerequisite checks, and template adherence, into each skill's prompt, making the governance part of the command's execution rather than a separate enforcement layer.

The key insight across all three platforms is that ArcKit doesn't try to force one governance model onto every AI assistant. Each platform gets enforcement through its native mechanisms. The governance outcomes are the same: validated filenames, protected system files, detected secrets, maintained manifests. But the implementation respects each platform's architecture.

## MCP Servers: Cloud Knowledge at Every Platform's Fingertips

Four Model Context Protocol servers form ArcKit's connection to live cloud documentation, and they're available on every platform.

AWS Knowledge connects to Amazon's official MCP endpoint, providing access to service documentation, architectural best practices, and Well-Architected Framework guidance. Microsoft Learn taps into Azure and the broader Microsoft documentation library through its MCP API. Google Developer Knowledge offers the same for GCP services. And Data Commons provides access to structured data APIs for statistical and demographic research.

What makes this significant is consistency. An architect running the Azure research command gets the same depth of real-time documentation whether they're using Claude Code, Gemini CLI, or Codex CLI. The MCP servers are the same endpoints. The only difference is how each platform configures them. Claude Code uses a JSON configuration file. Codex uses its native TOML config. Gemini embeds them in the extension manifest. The converter ensures all three stay synchronised.

The authentication model varies by server. AWS Knowledge and Microsoft Learn require no API keys, as they're publicly accessible MCP endpoints. Google Developer Knowledge and Data Commons require API keys, which users configure in their environment. The converter places these key references in the correct format for each platform automatically.

For the three cloud research agents covering AWS, Azure, and GCP, MCP servers are essential infrastructure. These agents don't guess about cloud services from training data. They query live documentation endpoints and synthesise current, accurate findings into architecture research documents.

## v4.0.0: The Restructuring That Made It Possible

Everything described above was enabled by a single architectural decision in v4.0.0: treating every distribution format as a first-class, independently structured extension.

The most visible change was renaming the plugin directory from arckit-plugin to arckit-claude. This wasn't just tidying. It established a consistent naming convention across all distributions: arckit-claude, arckit-codex, arckit-gemini, arckit-opencode. Each name immediately communicates what platform it serves.

Version synchronisation followed. All five distributions, including the CLI package, Claude Code plugin, Gemini extension, Codex extension, and OpenCode extension, now share a version number. A single bump-version script updates all twelve version files across the repository in one operation. When v4.0.1 shipped, every distribution moved together.

The converter was overhauled from a collection of format-specific functions into a config-driven pipeline. The AGENT_CONFIG dictionary replaced hard-coded conversion logic with declarative target definitions. This is what made it practical to give each platform deep, native support. Adding a new output format or enriching an existing one became a configuration change rather than a rewrite.

The Codex extension became fully standalone in this release. Previously, Codex support was scaffolded through the arckit init CLI command, which copied files into a project directory. Now arckit-codex is its own self-contained extension with skills, agents, a config.toml, and its own version tracking. It's published as a separate repository and can be installed independently.

These structural changes aren't the exciting part of v4.0.0. The hooks, policies, MCP servers, and native skills described in this article are the exciting part. But none of them would exist without the restructuring that made room for each platform to be treated as what it is: a unique environment with its own idioms, capabilities, and expectations.

## What's Next

The pipeline continues to grow. Three commands are currently in development: a framework command that transforms existing architecture artifacts into structured, reusable frameworks with principles and patterns; a glossary command that generates comprehensive project glossaries with cross-referenced terms; and a maturity model command that produces capability maturity assessments with improvement roadmaps.

All three will flow through the same converter pipeline, appearing as native skills in Codex, TOML commands in Gemini, and markdown commands in OpenCode, automatically, from a single source definition.

ArcKit is open source and available on GitHub. For Claude Code users, it's a marketplace plugin install away. Gemini CLI users can install the extension directly from its published repository. Codex and OpenCode users can scaffold projects through the CLI. Whichever AI assistant your team has standardised on, the same 57 architecture governance commands, with the same templates, the same agents, and the same cloud knowledge integrations, are available in a format that feels native to your platform.

That's what first-class support means. Not a translation. Not a compatibility layer. A native experience, built for each platform, from a single source of truth.

<!-- arckit:related-articles -->
## Related Articles

- [ArcKit v4.1.1: GitHub Copilot, Vendor Scoring, and Blast Radius](article-viewer.html?a=2026-03-11-v411-copilot-vendor-scoring-impact)
- [ArcKit v5.0.0: One Toolkit, Seven Plugins, Install Only What You Need](article-viewer.html?a=2026-05-18-arckit-v5-plugin-split)
- [The Token Budget Behind ArcKit's Plugin Split](article-viewer.html?a=2026-05-20-plugin-split-token-budget)
- [Your Architecture Documents Are Connected — Now You Can See How](article-viewer.html?a=2026-03-12-document-map-medium)

<!-- arckit:community-block -->
## Join the ArcKit Community

- **Discord** — real-time conversation, help with commands, and what people are building: [discord.gg/HsA4Y3hQ4](https://discord.gg/HsA4Y3hQ4)
- **LinkedIn Group** — announcements, case studies, and longer-form discussion: [linkedin.com/groups/17641034](https://www.linkedin.com/groups/17641034/)
- **GitHub** — code, issues, and contributions: [github.com/tractorjuice/arc-kit](https://github.com/tractorjuice/arc-kit)
