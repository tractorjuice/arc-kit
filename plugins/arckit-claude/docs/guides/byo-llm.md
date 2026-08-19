# Bring Your Own LLM

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

ArcKit never talks to a model itself. Every distribution format is a package of prompts, templates, hooks and MCP configuration that a host CLI executes. So "run ArcKit on my own model" is a question about configuring the host, not about ArcKit, and none of the routes below need any ArcKit-specific code or flags.

This matters most for two groups: teams whose data classification forbids sending OFFICIAL-SENSITIVE material to a third-party API, and teams who want to evaluate ArcKit without an Anthropic subscription.

---

## Pick a route

| Your situation | Route | Host CLI | Model protocol |
|----------------|-------|----------|----------------|
| Already using Claude Code, want a self-hosted model behind it | [Route 1](#route-1-claude-code-against-a-self-hosted-server) | Claude Code | Anthropic Messages |
| Do not want Claude Code at all | [Route 2](#route-2-codex-cli-or-opencode-no-claude-code) | Codex CLI or OpenCode | OpenAI chat completions |
| Your organisation already runs an LLM gateway | [Route 3](#route-3-an-organisational-llm-gateway) | Claude Code | Anthropic Messages |

Route 1 keeps the most ArcKit functionality. Route 2 needs the least infrastructure. Route 3 is the only one Anthropic supports for its intended purpose (credential and cost control in front of Claude models).

---

## Route 1: Claude Code against a self-hosted server

### Why this used to be hard, and is not any more

Claude Code speaks exactly three API formats, selected by which base-URL variable you set: [Anthropic Messages](https://code.claude.com/docs/en/llm-gateway-protocol#api-formats) via `ANTHROPIC_BASE_URL`, Amazon Bedrock InvokeModel via `ANTHROPIC_BEDROCK_BASE_URL`, and Google Cloud Agent Platform rawPredict via `ANTHROPIC_VERTEX_BASE_URL`. There is no OpenAI chat-completions option, so you cannot point Claude Code at a plain `/v1/chat/completions` endpoint.

Historically that meant running a translation proxy in between. It no longer does. The major serving stacks now implement `/v1/messages` themselves:

| Server | Anthropic Messages support | Notes |
|--------|---------------------------|-------|
| vLLM | Native, with a documented Claude Code integration | Requires `--enable-auto-tool-choice` and the correct `--tool-call-parser` |
| llama.cpp | Since PR #17570 (January 2026) | Streaming, tool use, vision, thinking, and `count_tokens` |
| Ollama | Since v0.14.0 | No `count_tokens`, `tool_choice`, or prompt caching |
| SGLang | Since PR #18630 | See the known issue below |
| LM Studio | Since January 2026 | Streaming and tool calls |

### Configure it

Point Claude Code at the server and remap the three model tiers. Local servers ignore the token value but Claude Code requires one to be present:

```bash
export ANTHROPIC_BASE_URL=http://127.0.0.1:8080
export ANTHROPIC_AUTH_TOKEN=local
export ANTHROPIC_DEFAULT_OPUS_MODEL=Qwen3-Coder-30B
export ANTHROPIC_DEFAULT_SONNET_MODEL=Qwen3-Coder-30B
export ANTHROPIC_DEFAULT_HAIKU_MODEL=Qwen3-Coder-30B
claude
```

To make it persistent for one repository rather than one shell, put the same keys in the `env` block of `.claude/settings.json`. Note that `/plugin` rewrites that file, so if the repository tracks it, treat the change as a git operation.

Verify the routing before you trust it. Run `/status` and check the API endpoint shown, then run any cheap command such as `/arckit:search` and confirm your server logs the request.

### What you keep

Everything in the plugin: all commands, all agents, all skills, every hook (provenance stamping, `validate-arc-filename`, secret detection, manifest updates), the bundled MCP servers, parallel subagent dispatch, and `/arckit:build`. This is the only route that preserves the full governance harness.

### What to know before you rely on it

**Anthropic does not support this.** The [LLM gateway documentation](https://code.claude.com/docs/en/llm-gateway) states plainly that Anthropic "doesn't support routing Claude Code to non-Claude models through any gateway." It is unsupported rather than blocked. Treat it as an evaluation or sovereignty path, not a supported production configuration, and do not raise Anthropic support tickets against it.

**The client contract is demanding and it moves.** Claude Code sends a self-hosted `ANTHROPIC_BASE_URL` endpoint the same beta headers and body fields it sends to `api.anthropic.com`, including `thinking: {"type": "adaptive"}`, `context_management`, `output_config` and beta tool-schema fields. Responses must stream as server-sent events, and Claude Code aborts a stream that relays no bytes for 300 seconds, so a server that goes silent during long generations will drop the connection. If your server rejects fields it does not recognise, set `CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS=1`, which stops the pre-release capabilities and their body fields. Token counting is optional: when `/v1/messages/count_tokens` is absent, Claude Code falls back to counting through the inference endpoint.

**Known per-server issues at the time of writing.**

- SGLang returns `input_tokens: 0` in `message_start` on the streaming endpoint, which breaks Claude Code's context tracking (sgl-project/sglang#20678).
- Ollama does not implement `count_tokens`, and there are reports of the server becoming unresponsive after Claude Code probes `/v1/messages/count_tokens?beta=true` (ollama/ollama#13949).
- vLLM cannot serve models whose names contain a forward slash, which rules out raw Hugging Face IDs such as `openai/gpt-oss-120b`. Versions at or below 0.17.1 also lose prefix caching because of the per-request attribution block; newer versions handle it, and `CLAUDE_CODE_ATTRIBUTION_HEADER=0` is the fallback.
- Fast mode and the WebFetch domain safety check call `api.anthropic.com` directly rather than following `ANTHROPIC_BASE_URL`, so on an air-gapped network they report connectivity errors while inference keeps working.

**Size the model realistically.** ArcKit commands are long. A single `/arckit:requirements` run puts several thousand tokens of instructions, a full template, and any prior artefacts into context before the model writes anything. Plan for at least a 30B-class model with strong tool-calling and at least 64k of usable context. Smaller models tend to abandon the template and emit freeform prose, which fails the Document Control and quality-checklist gates rather than failing loudly.

---

## Route 2: Codex CLI or OpenCode, no Claude Code

Both of these hosts speak the OpenAI protocol natively, so they point straight at vLLM, SGLang, Ollama or LM Studio with no Anthropic translation anywhere in the path. This is the shortest route if you do not want Claude Code installed at all.

Scaffold the project as usual:

```bash
arckit init my-project --ai codex
# or
arckit init my-project --ai opencode
```

### Codex CLI

Add a provider block to your **personal** `~/.codex/config.toml`:

```toml
model = "Qwen3-Coder-30B"
model_provider = "local"

[model_providers.local]
name = "Local vLLM"
base_url = "http://127.0.0.1:8000/v1"
wire_api = "chat"
```

Do not put this in the `.codex/config.toml` that ArcKit generates in the project. That file is a converter output carrying the hooks and MCP servers, and `python scripts/converter.py` overwrites it wholesale.

`wire_api = "chat"` selects chat completions, which is what local servers expose. The default is `"responses"`, which most of them do not implement.

### OpenCode

Add a provider to `opencode.json`:

```json
{
  "provider": {
    "local": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "Local vLLM",
      "options": { "baseURL": "http://127.0.0.1:8000/v1" },
      "models": { "Qwen3-Coder-30B": { "name": "Qwen3 Coder 30B" } }
    }
  }
}
```

Each key in `models` must match an ID returned by `GET /v1/models` on your server, not a display name of your choosing.

### What you keep and what you lose

You keep the commands (as Codex skills or OpenCode commands), the templates, the references, the schemas, and the converter-built hooks, so filename validation and provenance-adjacent checks still run on the Codex side.

You lose everything that is Claude Code only: parallel `Agent` dispatch and therefore `/arckit:build`, background monitors, the `effort:` frontmatter, plugin `userConfig`, and the reader/writer subagent pattern that hardens the research commands against prompt injection. Research-heavy commands still work, but they run inline rather than in an isolated agent context.

---

## Route 3: An organisational LLM gateway

If your organisation already runs LiteLLM, Portkey, TrueFoundry, or Anthropic's own Claude apps gateway, Claude Code connects to it with the same two variables as Route 1:

```bash
export ANTHROPIC_BASE_URL=https://gateway.example.internal
export ANTHROPIC_AUTH_TOKEN=<your gateway credential>
```

Two things are worth knowing:

**Billing changes.** While a gateway credential is active, a developer's claude.ai subscription is not used. The credential replaces the subscription login for that session, subscription usage limits stop applying, and traffic is billed per token to whoever owns the credential the gateway forwards. Setting `ANTHROPIC_BASE_URL` alone, with no credential variable, keeps the subscription active and routes through the gateway on subscription billing.

**Model discovery is off by default.** Set `CLAUDE_CODE_ENABLE_GATEWAY_MODEL_DISCOVERY=1` to have Claude Code query the gateway's `/v1/models` at startup and add the results to the `/model` picker. Only IDs containing `claude` or `anthropic` survive the filter, so a gateway serving models under other aliases needs the `ANTHROPIC_DEFAULT_*_MODEL` variables instead.

For rollout across a team, distribute the base URL and credential through a [managed settings file](https://code.claude.com/docs/en/settings#settings-files) rather than asking each developer to export variables.

---

## Governance implications

ArcKit is a governance harness, so changing the model underneath it changes what the resulting artefacts can be relied on to assert.

**The provenance block records what the model says about itself.** `provenance-stamp.mjs` reads the model identifier from the `**Model**:` line in the human-authored footer, which the model writes about itself at generation time. A remapped local model will report whatever it believes it is, and that may be a tier alias such as `sonnet`, or nothing at all. Check the `## Build Provenance` block on the first few artefacts and correct the footer convention if the recorded identifier is wrong. An artefact that misreports which model produced it is worse than one that reports none.

**Effort levels stop being meaningful.** The silent-downgrade matrix in `provenance-model.mjs` treats an unrecognised model ID as supporting every effort level, so a command declaring `effort: max` is stamped as having run at `max` regardless of what the local model actually did. The effort row becomes decorative under Routes 1 and 3 with a non-Claude model.

**Classification is the usual reason to be here, so make it explicit.** A self-hosted server on your own infrastructure keeps OFFICIAL-SENSITIVE content inside your boundary. A third-party gateway does not: it is another processor in the chain and belongs in the DPIA. Set `default_classification` in the plugin configuration to match the route you actually chose.

**Verify quality rather than assuming it.** Run `/arckit:analyze` and `/arckit:health` after the first few artefacts on any new model. The failure mode with smaller models is not a crash, it is a plausible-looking document that has quietly dropped the Document Control table, the classification ladder, or the citation markers.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|-------------|-----|
| `404` on every request | Base URL includes a trailing `/v1` for Route 1 | Claude Code appends `/v1/messages` itself; set the host and port only |
| `400` naming `thinking`, `context_management`, or `output_config` | Server rejects fields it does not recognise | Set `CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS=1` |
| Stream aborts during long generations | Server sends no keep-alive bytes for 300 seconds | Emit SSE `ping` events during silent gaps |
| Context usage reads as zero or nonsense | Server returns `input_tokens: 0` in `message_start` | Known SGLang issue; no client-side fix |
| Server hangs shortly after Claude Code starts | Probe to an unimplemented `count_tokens` endpoint | Known Ollama issue; return a `404` rather than hanging |
| Model never calls tools, just describes what it would do | Tool calling not enabled on the server | vLLM: add `--enable-auto-tool-choice` and the matching `--tool-call-parser` |
| Fast mode reports a connectivity error | The availability check calls `api.anthropic.com` directly | Expected on restricted networks; inference is unaffected |
| Artefacts ignore the template and read as essays | Model too small for the instruction load | Move to a 30B-class or larger model with longer usable context |
| Codex returns a protocol error on every call | `wire_api` defaulting to `responses` | Set `wire_api = "chat"` in the provider block |

---

## See also

- [Build Harness Guide](build.md), the `/arckit:build` orchestrator, and why it is Claude Code only
- [ArcKit at Enterprise Scale](enterprise-scale.md), managed settings and multi-repo governance
- [Project Initialization Guide](init.md), `arckit init` and the `--ai` targets
- [Claude Code gateway protocol reference](https://code.claude.com/docs/en/llm-gateway-protocol), the contract a self-hosted endpoint has to meet

---

**Generated by**: ArcKit documentation
**ArcKit Version**: [VERSION]
