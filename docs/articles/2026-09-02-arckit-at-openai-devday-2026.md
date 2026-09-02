# ArcKit at OpenAI DevDay 2026: Architecture Governance for Codex CLI, and an Invitation to Meet

**OpenAI DevDay 2026 is on Tuesday 29 September at Fort Mason, San Francisco. I'll be there. ArcKit — The Enterprise Architecture Governance Harness — has shipped a Codex CLI extension since the plugin split, and it now installs as a Codex plugin from its own marketplace, with 75 governance commands as Agent Skills, lifecycle hooks, and six bundled MCP servers. If you are building with Codex, running architecture or governance for an organisation that has just discovered its engineers are generating design documents with an agent, or simply want to argue about Wardley Maps over a coffee — find me.**

*Mark Craddock · medium.com/arckit*

---

## Why an architecture governance tool is at a developer conference

DevDay is where OpenAI shows developers what the platform can do next. Every year, the gap between "the agent can write it" and "the organisation can sign it off" gets wider. Coding agents now draft requirements, decision records, risk registers, security assessments, and business cases as readily as they draft code. What they do not do, unaided, is produce those documents in a form an architecture review board, a procurement officer, or an auditor can accept: versioned, traceable, cited, and consistent from one artefact to the next.

That gap is what ArcKit exists to close. It is not a model, not a chatbot, and not a document store. It is a harness: a set of slash commands, templates, hooks, and schemas that sit inside the coding agent you already use and turn "write me a risk register" into a governed artefact with a document ID, a document control block, a revision history, a provenance stamp, and citations back to whatever the agent read to produce it. Everything lands in a git repository as Markdown, so the review process is a pull request, not a SharePoint folder.

ArcKit began on Claude Code and Claude Code remains its primary development platform. But the harness was designed from the start to be portable, and Codex CLI has been a first-class target since the very first release. DevDay is the right room to talk about that.

## What ArcKit gives a Codex CLI user

Codex auto-discovers Agent Skills from `.agents/skills/`, and that is exactly where ArcKit puts its commands. Every one of the 75 core commands becomes a skill directory with a `SKILL.md` and an `agents/openai.yaml`, invoked as `$arckit-requirements`, `$arckit-stakeholders`, `$arckit-risk`, `$arckit-sobc`, and so on. The community overlays — UK NHS clinical safety, UK Finance payments, TOGAF ADM, Open Agile Architecture, the jurisdictional packs for the UAE, France, Canada, the EU, Austria, Australia, and US federal civilian — arrive as skills in the same tree. Four reference skills sit alongside them: the architecture workflow that tells the agent which command to run next, and syntax references for Mermaid, PlantUML, and Wardley Maps.

Two install routes exist. The first is the ArcKit CLI:

```bash
uv tool install arckit-cli --from git+https://github.com/tractorjuice/arc-kit.git
arckit init my-project --ai codex
cd my-project
codex
```

That scaffolds the skills, the templates, the helper scripts, the handoff schemas, a `.codex/config.toml` with the MCP servers and agent roles wired in, and the lifecycle hooks. No environment variables, no manual config.

The second is the Codex plugin marketplace:

```bash
codex plugin marketplace add tractorjuice/arckit-codex
```

Enable `hooks` and `plugin_hooks` under `[features]`, restart Codex, and install ArcKit from the plugin directory. The manifest points at the same skills, MCP config, and `hooks/hooks.json`.

Either way you get the six bundled MCP servers — AWS Knowledge, Microsoft Learn, Google Developer Knowledge, Data Commons, govreposcrape for UK government code reuse, and UK Tenders for procurement benchmarks — and the research-heavy commands that use them: vendor research, data source discovery, cloud provider research, grant discovery, tender benchmarking, and competitor landscapes.

## The hooks are the governance

Skills are the visible part. The part that makes it a harness rather than a prompt library is the hook runner, and Codex's lifecycle hooks carry the same policy Claude Code users get. The Codex hook runner handles six events: session start injects project context so the agent knows which projects exist and which artefacts are already there; prompt submit checks the request against the governance workflow; pre-tool-use enforces the file policy, refusing writes to protected paths and blocking secrets before they land in an artefact; post-tool-use stamps provenance and keeps the artefact manifest current; the permission-request hook applies an MCP approval policy so research servers are reachable without a prompt storm; and the stop hook looks for gaps in the traceability chain and suggests the next command.

None of that is Codex-specific policy. The Codex hook is a hand-maintained port of the same rules the Claude Code plugin ships, and the test suite asserts the two do not drift — the provenance stamp string, for example, is checked in both sources because the two have diverged before and shipped a lint failure into every stamped artefact.

## One source, nine formats

Nobody wants to maintain 75 commands nine times. ArcKit does not. The Claude Code plugin is the single source of truth; a converter reads each command's frontmatter and body and emits Codex skills, OpenCode commands, Gemini extension TOML, Copilot prompt files, and the Paperclip, Mistral Vibe, and Kimi Code formats. Claude-only frontmatter — effort levels, tool denylists, the keep-instructions flag — is stripped. `${CLAUDE_PLUGIN_ROOT}` paths are rewritten. Commands that delegate to a reader/writer subagent pair on Claude Code get a single-role monolith prompt instead, because Codex cannot dispatch a subagent from inside a skill.

That last point is worth dwelling on, because it is where the platforms genuinely differ and where a CI guard now exists. Two research commands were born as three-tier orchestrators and shipped for eleven weeks with a prompt telling Codex to "dispatch the reader via the Agent tool" — an instruction Codex could not honour. The fix was a monolith prompt per command and a check that derives its scope from the converter's own agent map, so a new split command is covered the day it lands. That is the kind of thing I would like to compare notes on with people building multi-platform skills: what the portable subset really is, and where you have to accept a per-platform fork.

## Bring your own model

A question I expect to hear at DevDay, in one form or another: does this lock you into Anthropic? No. Codex CLI speaks the OpenAI protocol natively, so ArcKit on Codex talks to whatever Codex talks to — OpenAI's hosted models, or a self-hosted server that exposes the same API. There is a Bring Your Own LLM guide in the repository that covers the routes, and the Codex and OpenCode route needs no translation layer at all. The governance is in the templates, the hooks, and the schemas; the model is a choice.

## What I want to talk about

The programme runs from the 10am keynote through breakouts until half past three, with a reception from quarter to five until seven. That reception is the obvious place, but I will be around all day.

Things I would genuinely like to discuss:

- **Skills as a distribution format.** ArcKit ships the same governance logic to Codex, Claude Code, Gemini, Copilot, and four others from one source. What are you finding is portable, and what isn't?
- **Governance for agent-authored artefacts.** If an agent wrote your architecture decision record, who signed it? What does provenance need to look like for an auditor to accept it? ArcKit has an answer; I would like to hear yours.
- **Public sector and regulated industry.** ArcKit's roots are UK Government — GDS Service Standard, Technology Code of Practice, NCSC CAF, the Green Book — and it now has overlays for NHS clinical safety, UK payments, and seven other jurisdictions. If you are trying to get a coding agent past a regulator, let's compare scars.
- **Wardley Mapping.** ArcKit has a full Wardley suite that renders to Mermaid and to OnlineWardleyMaps syntax. If you map, I want to see your maps.
- **AI, generally.** The interesting conversations at these events are rarely about the thing on the slide.

If you are going to be at Fort Mason on the 29th, say so — the Discord server and the LinkedIn group below are the easiest places to reach me beforehand, and GitHub issues work too if you would rather open with a bug report. I will post which sessions I am in on the day.

## Get it

```bash
# Codex CLI, via the ArcKit CLI
arckit init my-project --ai codex

# Codex CLI, via the plugin marketplace
codex plugin marketplace add tractorjuice/arckit-codex

# Claude Code
/plugin marketplace add tractorjuice/arckit-claude
claude plugin install arckit
```

Then start where every ArcKit engagement starts — principles, requirements, stakeholders — and let the handoffs walk you through the rest.

---

*ArcKit is MIT licensed. The core harness and the Codex CLI extension are maintained at [github.com/tractorjuice/arc-kit](https://github.com/tractorjuice/arc-kit); the Codex plugin marketplace is [tractorjuice/arckit-codex](https://github.com/tractorjuice/arckit-codex). Current release: v6.13.0.*

<!-- arckit:community-block -->
## Join the ArcKit Community

- **Discord** - real-time conversation, help with commands, and what people are building: [discord.gg/HsA4Y3hQ4](https://discord.gg/HsA4Y3hQ4)
- **LinkedIn Group** - announcements, case studies, and longer-form discussion: [linkedin.com/groups/17641034](https://www.linkedin.com/groups/17641034/)
- **GitHub** - code, issues, and contributions: [github.com/tractorjuice/arc-kit](https://github.com/tractorjuice/arc-kit)
