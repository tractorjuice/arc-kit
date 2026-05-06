# Five patterns to steal from anthropics/financial-services

Anthropic does not ship reference architectures often. When they do, the vertical is the demo. The patterns are the product.

Parts of the financial services sector are cooked, and you can date the moment fairly precisely. Recently, Anthropic dropped anthropics/financial-services into a public GitHub repo. Sitting there in the open, for free, is a working Pitch Agent, Earnings Reviewer, KYC Screener, and GL Reconciler, with a headless Managed Agents deployment track on the side.

If your day job is charging clients six figures to produce those workflows in PowerPoint, that is a bad morning. The skills, slash commands, MCP connectors, and steering-event examples are all in the open. Daloopa, FactSet, Morningstar, S&P, Moody’s, LSEG, and Pitchbook are wired up.

Two reactions show up in our inbox within hours of a release like this. The first is panic, which is understandable. The second is the one that ages better. Treat the repo as a reference architecture, read it the way you would read a whitepaper, and harvest what the team got right. We did this in arc-kit#442 for ArcKit, and most of the patterns transfer cleanly to any research-heavy AI plugin or workflow.

Five are worth calling out.

## 1. Reader, orchestrator, writer isolation

Every cookbook in the repo splits each agent into three tiers. The reader subagent has `Read` and `Grep`, no MCPs, and is the only thing that touches untrusted documents. It returns schema-validated, length-capped JSON. The orchestrator never sees the raw text. The writer is the sole holder of `Write` and runs in a clean context.

This neutralises prompt injection from documents the reader ingests. Most ArcKit research commands today read external input (vendor packs, policy PDFs, web fetches, MCP results) in the same context that writes the artefact. The split closes that surface entirely. Worth adopting wherever a plugin reads attacker-controlled input.

## 2. Schema-gated handoffs with an allowlist

`scripts/orchestrate.py` defines `ALLOWED_TARGETS` and a `HANDOFF_PAYLOAD_SCHEMA`. Agents emit:

```json
{"type":"handoff_request","target_agent":"earnings-reviewer","payload":{...}}
```

The orchestrator validates the target against the allowlist and the payload against the schema before routing as the next steering event. The script explicitly warns about attacker-controlled documents quoting forged handoff blobs. Allowlist plus schema is the answer.

ArcKit's existing `handoffs:` frontmatter is a passive "Suggested Next Steps" hint rendered by the converter. Upgrading it to active routing with the same allowlist plus schema validation closes the same injection vector for chained workflows like `requirements` to `adr` to `hld-review`.

## 3. Output schemas on every reader

Reader subagents declare `output_schema:` in YAML. JSON Schema with `additionalProperties: false`, `maxItems`, `maxLength`, and regex `pattern` constraints on every field. From `transcript-reader.yaml`:

```yaml
output_schema:
  required: [ticker, period, actuals]
  additionalProperties: false
  properties:
    ticker: { type: string, maxLength: 12, pattern: "^[A-Z.]+$" }
    guidance_notes:
      type: array
      maxItems: 50
      items: { maxLength: 256, pattern: "^[A-Za-z0-9 .,%$()_/:-]+$" }
```

A `validate.py` enforces the schema between reader and orchestrator. If your agents pass structured data between tiers, every one of those fields wants a length cap and a regex. Requirement IDs (`BR-001`, `FR-xxx`, `ECX-NN`) and Document Control headers are the obvious candidates in ArcKit's case.

## 4. Cross-reference linting

`scripts/check.py` walks every manifest and verifies that every `system.file`, `skills.path`, and `callable_agents.manifest` reference resolves to a file on disk. It also checks that bundled-skill copies have not drifted from the vertical-plugin source.

ArcKit ships seven distribution formats generated from one canonical plugin. A broken `${CLAUDE_PLUGIN_ROOT}/templates/foo.md` reference, or a deleted helper script still referenced by a command, currently passes CI. The fix is small (a Python or Node script walking commands, agents, skills, resolving references, asserting they exist) but the pattern is generalisable: lint your references, not just your YAML.

## 5. Two ways from one source

Each named agent ships interactively as a Cowork plugin and headlessly as a Managed Agent cookbook. Same `agents/<slug>.md` system prompt. The Managed Agent wrapper adds `agent.yaml` (model, tools, MCPs, callable subagents), `subagents/*.yaml` with output schemas, and `steering-examples.json` with three canonical trigger events.

The interactive track is the development surface. The headless track runs the same workflow on cron or behind your own orchestration. The architectural cost of designing for both, from day one, is small. The cost of retrofitting later is not. For ArcKit, the obvious targets are `/arckit:health`, `/arckit:navigator`, `/arckit:graph-report`, and the autoresearch loops, all of which are governance-on-cron use cases waiting to happen.

## What to do with it

If you maintain a Claude Code plugin, a Cowork pack, or a Managed Agent, read the financial-services repo cover to cover. Not for the FSI specifics. For the security model, the schema discipline, the linting rigour, and the dual-track shipping pattern. Then write your own version of arc-kit#442: a numbered list of patterns you are adopting, ranked by impact, with concrete pull-request scope.

Anthropic does not ship reference architectures often. When they do, the vertical is the demo. The patterns are the product.

---

**Generated by**: Mark Craddock, ArcKit
**Date**: 6 May 2026
**ArcKit Version**: 4.15.2
**Site**: [arckit.org](https://arckit.org)
