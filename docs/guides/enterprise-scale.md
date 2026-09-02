# ArcKit at Enterprise Scale

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

ArcKit's quick-start docs assume a single repo with a single architecture project. Real enterprises don't look like that. A typical large organisation runs dozens — sometimes hundreds — of applications, each split across multiple repositories, with a central EA function setting principles and standards that downstream teams must follow.

This guide covers how to apply ArcKit in that shape: repo topology, artifact placement, ownership, and avoiding principle duplication across teams.

Tracking issue: [#346](https://github.com/tractorjuice/arc-kit/issues/346).

---

## Claude Enterprise Deployment (first rollout)

ArcKit's canonical runtime is the Claude Code plugin in
`plugins/arckit-claude/`. Treat the enterprise rollout as two linked controls:
the **ArcKit governance repository pattern** and the **Claude Code managed
configuration** that makes the plugin, MCP servers, hooks, and model policy
consistent across developer machines.

Source basis for this section: Anthropic's Claude Code organization setup,
server-managed settings, managed MCP, enterprise deployment, network, security,
data usage, plugin marketplace, plugin recommendation, and Claude Enterprise
administrator docs, plus the Claude Code changelog reviewed through v2.1.201
on 2026-07-04.

### 1. Choose the Claude deployment model

For most ArcKit teams, start with Claude for Enterprise and Claude Code seats.
That gives the architecture function one subscription, SSO, domain capture,
seat assignment, usage analytics, and server-managed Claude Code policy without
running your own model gateway.

Use a cloud-provider deployment only when your security model requires provider
billing, regional controls, or existing cloud compliance inheritance:

| Deployment | Use when | ArcKit notes |
|------------|----------|--------------|
| Claude for Enterprise | You want the shortest path with SSO, managed settings, analytics, Claude.ai, and Claude Code in one estate | Recommended default for the first ArcKit rollout |
| Anthropic Console/API | You are API-first and accept separate Claude.ai access decisions | Good for automation; weaker for user-seat rollout |
| Amazon Bedrock, Claude Platform on AWS, Google Cloud's Agent Platform, or Microsoft Foundry | You need cloud-provider billing, IAM, audit, or regional controls | Pair with endpoint-managed settings or a Claude apps gateway; some Claude.ai features still require Enterprise seats |

Do not design the first ArcKit rollout around Claude Desktop. The current
ArcKit package is a Claude Code plugin, and the full workflow depends on Claude
Code plugin hooks, slash commands, subagents, MCP configuration, and project
settings.

### 2. Prepare identity, seats, and client version

Before installing ArcKit broadly:

- Configure SSO with SAML 2.0 or OIDC, test it with a pilot group, then enable
  domain capture and enforce SSO once validated.
- Use SCIM for phased rollout groups where available. Manual invites are fine
  for a short pilot.
- Assign a seat type that includes Claude Code. In Anthropic's current
  Enterprise guidance, legacy seat-based plans need Premium seats; usage-based
  plans need Chat + Code or Claude Enterprise seats.
- Install Claude Code v2.1.251 or later on pilot machines. ArcKit's
  SessionStart version hook warns below this floor; managed settings can block
  startup below it.
- Verify each pilot user with `claude --version`, `/status`, and
  `/plugin list --enabled`.

### 3. Deploy the ArcKit marketplace and plugin

For a team repository pilot, commit a project-level `.claude/settings.json` so
users are prompted to add the ArcKit marketplace when they trust the repo:

```json
{
  "minimumVersion": "2.1.251",
  "extraKnownMarketplaces": {
    "arckit-claude": {
      "source": {
        "source": "github",
        "repo": "tractorjuice/arckit-claude"
      },
      "autoUpdate": true
    }
  },
  "enabledPlugins": {
    "arckit@arckit-claude": true
  }
}
```

For a managed enterprise rollout, deliver the same marketplace through
server-managed settings or endpoint-managed settings and add a hard version
range:

```json
{
  "requiredMinimumVersion": "2.1.251",
  "requiredMaximumVersion": "2.1.999",
  "extraKnownMarketplaces": {
    "arckit-claude": {
      "source": {
        "source": "github",
        "repo": "tractorjuice/arckit-claude"
      },
      "autoUpdate": true
    }
  },
  "enabledPlugins": {
    "arckit@arckit-claude": true
  },
  "strictKnownMarketplaces": [
    {
      "source": "github",
      "repo": "tractorjuice/arckit-claude"
    }
  ],
  "pluginSuggestionMarketplaces": ["arckit-claude"],
  "pluginTrustMessage": "ArcKit is approved by the enterprise architecture team."
}
```

Use `strictKnownMarketplaces` only after the pilot, when your support path is
ready. It blocks non-allowlisted marketplaces before network or filesystem
access. Claude Code v2.1.195 and later asks users to install and trust plugins
before they run, even when a project enables them. For managed dev containers
or golden images, pre-populate the plugin cache with `CLAUDE_CODE_PLUGIN_SEED_DIR`
so startup does not need to clone the marketplace at runtime.

### 4. Configure ArcKit options and MCP

At enable time, the ArcKit plugin exposes user configuration for organization
defaults and optional MCP credentials:

| ArcKit option | Purpose | Enterprise default |
|---------------|---------|--------------------|
| `organisation_name` | Document Control organization field | Set to the legal entity or architecture function name |
| `default_classification` | Initial classification for generated artifacts | Match your policy, for example `OFFICIAL` or `OFFICIAL-SENSITIVE` |
| `governance_framework` | Default framework in prompts and templates | `UK Gov`, `UAE Federal`, or `Generic` |
| `classification_scheme` | Classification ladder | `UK` unless your rollout uses UAE Smart Data terms |
| `GOOGLE_API_KEY` | Google Developer Knowledge MCP | Leave blank until GCP research is approved |
| `DATA_COMMONS_API_KEY` | Data Commons MCP | Leave blank until statistical lookups are approved |
| `desktop_notifications` | Terminal desktop notifications for stale artifacts | Keep `false` unless the terminal fleet supports OSC notifications |

ArcKit bundles six HTTP MCP servers in `plugins/arckit-claude/.mcp.json`:
AWS Knowledge, Microsoft Learn, Google Developer Knowledge, Data Commons,
govreposcrape, and UK Tenders. AWS Knowledge, Microsoft Learn, govreposcrape,
and UK Tenders are keyless. Google Developer Knowledge and Data Commons need
the sensitive plugin user-config keys above.

If your organization blocks ad-hoc MCP additions, lock customization to plugin
or managed sources and allowlist the ArcKit MCP endpoints by URL:

```json
{
  "strictPluginOnlyCustomization": ["mcp"],
  "allowManagedMcpServersOnly": true,
  "allowedMcpServers": [
    { "serverUrl": "https://knowledge-mcp.global.api.aws" },
    { "serverUrl": "https://learn.microsoft.com/api/mcp" },
    { "serverUrl": "https://developerknowledge.googleapis.com/mcp" },
    { "serverUrl": "https://api.datacommons.org/mcp" },
    { "serverUrl": "https://govreposcrape-api-1060386346356.us-central1.run.app/mcp" },
    { "serverUrl": "https://tenders.run.cns.me/mcp" }
  ]
}
```

Do not put shared API keys into `managed-mcp.json`. That file is readable by
users on the machine. Use per-user environment variables, OAuth, a
`headersHelper`, or ArcKit's sensitive plugin user-config fields.

**Set ArcKit options at user or managed scope, not in the repo.** As of Claude
Code v2.1.207, plugin option values (`pluginConfigs`) are read only from user
settings, `--settings`, and managed settings — a `pluginConfigs` block committed
to a repository's `.claude/settings.json` is ignored. Push `organisation_name`,
`default_classification`, `governance_framework`, and `classification_scheme`
through managed settings so every repository inherits the same Document Control
defaults without a per-repo file to drift.

### 5. Set the security and network baseline

Minimum enterprise controls for ArcKit:

- Deny reads of `.env`, secret stores, credential dumps, and build outputs in
  managed `permissions.deny`. On Claude Code v2.1.257+ add
  `permissions.blockReadsOutsideWorkingDirectories` so the model cannot read
  outside the registered working directories at all; from the same release
  Bash `Read()` deny rules also cover `< file` redirects and reader commands
  such as `tac` and `egrep`, which they previously missed.
- Keep Claude Code's Manual permission mode as the default for regulated
  repositories. Use Auto mode only after your `autoMode.environment` describes
  trusted source control, artifact stores, and internal domains.
- Use sandboxing or development containers for repositories that process
  untrusted supplier documents, procurement evidence, or generated code. Two
  settings tighten this for ArcKit's research commands, which fetch supplier and
  government content from the open web:
  - `sandbox.network.strictAllowlist` (Claude Code v2.1.219+) denies
    non-allowlisted hosts for sandboxed commands **without prompting**, rather
    than asking. Paired with the MCP endpoint allowlist above, research agents
    reach approved sources and nothing else — the closest available fit for
    OFFICIAL-SENSITIVE and egress-restricted deployments.
  - `sandbox.filesystem.disabled` (v2.1.216+) skips filesystem isolation while
    keeping network egress control. Use it only where a helper script genuinely
    breaks under filesystem isolation; it removes a protection layer, so prefer
    fixing the script.
- Configure corporate proxy and CA trust via `HTTPS_PROXY`,
  `NO_PROXY`, `CLAUDE_CODE_CERT_STORE`, and `NODE_EXTRA_CA_CERTS` where needed.
- Allow egress to Claude authentication/API endpoints, the ArcKit marketplace
  repository, and only the MCP endpoints your rollout approves.
- Disable non-essential telemetry where policy requires it with
  `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1`, `DISABLE_TELEMETRY=1`,
  `DISABLE_ERROR_REPORTING=1`, or `DISABLE_FEEDBACK_COMMAND=1`.
- If you export prompts to OpenTelemetry, keep
  `OTEL_LOG_ASSISTANT_RESPONSES=0` unless generated ArcKit artifacts are
  explicitly approved for the telemetry backend.

Commercial Claude Code usage is not used to train Anthropic models by default.
Standard commercial retention is separate from local Claude Code transcripts,
which are stored in plaintext under `~/.claude/projects/` for session resume.
Set `cleanupPeriodDays` and endpoint data-handling rules to match your local
records policy. Zero Data Retention is available only to qualified Enterprise
accounts and must be confirmed with the Anthropic account team.

### 6. Roll out by governance wave

Use a narrow pilot before broad installation:

1. **Architecture pilot**: one EA-owned repo, `projects/000-global/`, and one
   live application project. Validate `/arckit:init`, `/arckit:principles`,
   `/arckit:requirements`, `/arckit:adr`, `/arckit:health`, and
   `/arckit:pages`.
2. **Control pilot**: add managed settings, plugin marketplace restrictions,
   MCP allowlists, secret-read denies, telemetry policy, and a support path for
   `/status`, `/doctor`, `/plugin`, and `claude --safe-mode`.
3. **Domain expansion**: onboard solution/domain repos with unique project IDs
   and references back to `ARC-000-*` artifacts.
4. **Operating model**: assign owners for global principles, reference
   frameworks, project artifacts, templates, and ArcKit release adoption.
5. **Quarterly review**: review Claude Code changelogs, ArcKit changelog
   entries, enabled MCP servers, prompt telemetry labels, stale artifacts, and
   template overrides.

### Claude Code changelog items that matter for ArcKit enterprise

| Version | Enterprise-relevant change | ArcKit impact |
|---------|----------------------------|---------------|
| v2.1.258 | Latest reviewed release as of 2026-09-02; fixes the macOS 12 launch failure introduced in the unpublished 2.1.255 | Reviewed in the v2.1.236-v2.1.258 triage. Any future floor above v2.1.252 must be v2.1.258, not v2.1.257 |
| v2.1.257 | Claude Fable 5.1 (`claude-fable-5-1`) is the default Fable model; `CLAUDE_CODE_SUBAGENT_MODEL_FORCE`; `permissions.blockReadsOutsideWorkingDirectories`; Bash `Read()` deny rules cover redirects and reader commands; `defaultMode: "bypassPermissions"` ignored at project scope; plugin component paths that are symlinks refused; auto-mode Containment Escape rule | Fable 5.1 needs the gateway configured for it — `fable`/`best` keep resolving to Fable 5 until then. ArcKit ships no symlinked component paths and recommends no project-scope `defaultMode` |
| v2.1.251 | `PreModelSwitch` / `PostModelSwitch` hooks; `CLAUDE_CODE_SUBAGENT_MODEL` becomes a default rather than an override; Opus 5 at `effort: xhigh`/`max` with thinking off is sent as `high` instead of failing; file tools no longer follow a symlink swapped after the permission check; Grep/Glob honour `Read()` deny rules through symlinked paths; project settings can no longer enable beta tracing or bypass a managed OTLP collector | **Current ArcKit floor** — the symlink and deny-rule fixes are the class ArcKit's file-protection gates sit in front of, and `effort: max` commands now complete on thinking-off sessions. Verify subagent routing with `/tasks` before relying on `CLAUDE_CODE_SUBAGENT_MODEL` (see model governance above). Effective Effort in ArcKit's provenance stamp cannot see the thinking-off downgrade |
| v2.1.248 | `--restricted` / `CLAUDE_CODE_RESTRICTED=1` strips command and code tools and `WebFetch`, keeps file tools inside the working directory, refuses `bypassPermissions` and ignores user/project/local settings; `experimental.cacheTtl` agent frontmatter; hook stdout that looks like JSON but is not now errors instead of passing as text | `--restricted` removes `WebFetch` from every ArcKit reader, and its effect on plugin hooks and `alwaysLoad` MCP servers is unstated — not yet a recommended profile. All ArcKit hooks emit valid JSON |
| v2.1.246 | `/reload-plugins` counted 0 skills for `skills/*/SKILL.md` layouts; hook errors showed a literal `${CLAUDE_PLUGIN_ROOT}`; duplicate plugin-cache directories; `claude plugin update <bare-name>`; a subagent stopping at `maxTurns` returns output marked partial; on Bedrock/Vertex/Foundry Claude is told when an MCP server failed to connect; telemetry requests no longer carry a third-party gateway's API key to Anthropic | Carried into the current floor: the first four hit ArcKit's exact layout. Reader/writer orchestrators treat a partial return as retry-or-halt |
| v2.1.243 | `modelPicker` and `modelPricing` settings; `promptCacheTtl` / `subagentPromptCacheTtl`; `/tasks` shows each subagent's model and effort; keyless Console sign-in; sandbox violation details kept when the blocked command exits 0 | Model governance controls above; `/tasks` is the cheap way to confirm `effort: max` was applied |
| v2.1.236 | `ANTHROPIC_DEFAULT_MODEL`; macOS sandbox wildcard read-deny rules (`**/.env`) win inside allowed read regions and survive renames; `Monitor` allow rules set aside in auto mode | Session-default model without overriding user picks; strengthens the `.env` deny guidance above |
| v2.1.235 | Reviewed release | Reviewed in the v2.1.221-v2.1.235 triage |
| v2.1.234 | MCP diagnostics no longer print resolved secrets — scope-conflict warnings show the configured `${VAR}` form and connection-failure details show only the server origin; `strictKnownMarketplaces` no longer accepts SCP-style git sources whose host differs from the one git would use | Carried into the current floor — ArcKit ships two keyed MCP servers whose `${user_config.*}` values sit in request headers, and their connections fail by design on a keyless session |
| v2.1.233 | Todo/task tools (`TodoWrite`, `TaskCreate`) removed on Opus 4.8, Sonnet 5, Fable 5, Opus 5 and newer; `Notification` hooks fire for permission prompts under Desktop/VS Code; skill argument values no longer re-expand as template markers | Carried into the current floor: ArcKit agents lose their to-do surface (allowlist entries are inert, not errors), and `$ARGUMENTS` can no longer be re-expanded against ArcKit's `${...}` markers |
| v2.1.232 | Non-teammate subagent spawns run in the background by default; nested git repositories each require their own trust confirmation; GitLab marketplace sources and token redaction | Carried into the current floor: `/arckit:build` waves and reader/writer handoffs dispatch with `run_in_background: false` to keep their sequencing |
| v2.1.224 | 200-subagent-per-session spawn cap removed; `archive` plugin source (zip over HTTPS with SHA-256 pinning); sandbox `denyRead`/`denyWrite` trailing-slash bypass fixed; sandbox violation details now surfaced in Bash results | Carried into the current floor. The `archive` source is the air-gapped install route for fleets with no path to github.com |
| v2.1.222-v2.1.223 | PreToolUse auto-allow hooks no longer bypass tool restrictions in background agent tasks; Bash permission-check bypasses closed; agent `bypassPermissions` now honours org policy; `owner/*` wildcards in `strictKnownMarketplaces` / `blockedMarketplaces` | Carried into the current floor. The auto-allow fix matters more now spawns are background by default; `tractorjuice/*` can be allowlisted in one entry |
| v2.1.221 | WebSearch no longer returns a 400 at `effort: xhigh`/`max` when thinking is disabled | Carried into the current floor: ArcKit's 18 `effort: max` commands and three max-effort research agents were silently broken for anyone running with thinking off |
| v2.1.220 | Reviewed release (unitemised bug fixes) | Reviewed in the v2.1.201-v2.1.220 triage |
| v2.1.219 | Claude Opus 5 (`claude-opus-5`) added as the default Opus model with 1M context and fast mode; `sandbox.network.strictAllowlist`; `DirectoryAdded` hook | Carried into the current floor — earlier clients cannot select Opus 5 |
| v2.1.200 | Manual permission wording, project-scoped plugin loading from git worktrees, plugin validation, background-agent reliability, Windows hook execution, and shell/edit fixes | Carried into the current floor: branch testing, hooks, background agents, and generated artifact edits are materially more reliable |
| v2.1.198 | Server-managed settings cache hardening with proxy/API-routing/auth env vars withheld until a fresh fetch confirms the payload | Important for enterprises that deliver proxy or credential-related settings remotely |
| v2.1.195 | Plugin trust/install is required on every plugin-loading path; plugin enable/disable handles marketplace/manifest name differences | Use seed images or clear onboarding instructions if you want low-friction install |
| v2.1.191 | `forceRemoteSettingsRefresh` can make remote settings fail closed at startup | Use for high-control fleets after confirming `api.anthropic.com` or your gateway is reachable |
| v2.1.176 | `availableModels` enforcement and hook path-condition fixes | Supports model governance and ArcKit's path-scoped hooks |
| v2.1.166-v2.1.169 | Managed settings tolerate invalid entries and keep enforcing valid policy; `--safe-mode` added for troubleshooting | Reduces blast radius from malformed policy and gives support a clean recovery path |
| v2.1.163 | `requiredMinimumVersion` / `requiredMaximumVersion`, `/plugin list --enabled`, and managed permission fetch fixes | Enables hard fleet version gates and plugin-state verification |
| v2.1.152-v2.1.154 | `pluginSuggestionMarketplaces`, directory-based suggestions, and `defaultEnabled: false` for plugins | Lets ArcKit be suggested for architecture repos while overlays remain opt-in |
| v2.1.145 | Agent and tool OpenTelemetry attributes | ArcKit session telemetry can attribute work to research and writer subagents |

### ArcKit changelog items reflected in this guide

| ArcKit entry | Enterprise impact |
|--------------|-------------------|
| Unreleased #580 | Claude Code floor raised to v2.1.251 for the file-tool symlink and Grep/Glob deny-rule fixes, the Opus 5 thinking-off effort fallback, and v2.1.246's plugin-loading fixes that hit ArcKit's exact layout |
| Unreleased #580 | Reactive `FileChanged` context for `projects/*/external/` means newly added evidence can enter Claude Code context without restart or `/compact` |
| v6.12.0 #580 | Claude Code floor raised to v2.1.234 so MCP connection diagnostics can no longer print resolved secrets, and so the WebSearch `xhigh`/`max`, background-agent permission, and sandbox deny-path fixes are guaranteed |
| v6.6.0 #580 | Claude Code floor raised to v2.1.219 for Claude Opus 5 support, and docs refreshed for managed model governance, OTEL response logging, MCP auth, safe-mode troubleshooting, and plugin branch testing |
| v6.0.0 | `tractorjuice/arckit-claude` became the preferred single Claude Code marketplace repo for the core plugin plus overlays |
| v5.13.1 | Claude Code floor v2.1.172 made wildcard-domain `WebFetch(domain:*.gov.uk)` restrictions reliable for regulated research-agent traffic |
| June 2026 #576/#579 | Managed fleet settings, `/plugin list --enabled`, and per-agent telemetry guidance landed in the ArcKit docs and telemetry hooks |
| v5.9.1 | Plugin-bundled MCP servers gained the prefixed tool allowlists and `alwaysLoad` settings needed for ArcKit subagents to reach them reliably |
| Reader/orchestrator/writer security work | Research commands use explicit tool allowlists, untrusted-input boundaries, schema validation, and writer-only file access to reduce MCP/web prompt-injection risk |

### Official Claude references

- [Set up Claude Code for your organization](https://code.claude.com/docs/en/admin-setup)
- [Enterprise deployment overview](https://code.claude.com/docs/en/third-party-integrations)
- [Server-managed settings](https://code.claude.com/docs/en/server-managed-settings)
- [Managed MCP configuration](https://code.claude.com/docs/en/managed-mcp)
- [Enterprise network configuration](https://code.claude.com/docs/en/network-config)
- [Claude Code security](https://code.claude.com/docs/en/security)
- [Claude Code data usage](https://code.claude.com/docs/en/data-usage)
- [Plugin marketplaces](https://code.claude.com/docs/en/plugin-marketplaces)
- [Plugin relevance and organization recommendations](https://code.claude.com/docs/en/plugin-relevance)
- [Claude Code changelog](https://code.claude.com/docs/en/changelog)
- [Set up single sign-on](https://support.claude.com/en/articles/13132885-set-up-single-sign-on-sso)
- [Claude Enterprise plan](https://support.claude.com/en/articles/9797531-what-is-the-enterprise-plan)

## The Core Pattern: `000-global/` + numbered projects

Every ArcKit repo reserves `projects/000-global/` for **cross-cutting artifacts** — principles, enterprise standards, reference patterns, and common ADRs that apply across every downstream project.

```text
projects/
├── 000-global/
│   ├── ARC-000-PRIN-v1.0.md      # Enterprise architecture principles
│   ├── ARC-000-ADR-001-v1.0.md   # Enterprise-wide decisions (e.g. cloud provider)
│   └── ARC-000-FRAM-v1.0.md      # Reference frameworks (data, security, AI)
├── 001-customer-portal/           # Application project 1
├── 002-billing-platform/          # Application project 2
└── 042-identity-service/          # Application project N
```

Downstream projects **reference** `000-global/` artifacts by Document ID rather than restating them. Traceability stays unambiguous because IDs are scoped (`ARC-000-PRIN-*` is global, `ARC-042-REQ-*` is identity-service-specific).

This is the building block for everything below.

---

## Three Repo Topologies

No single topology fits every enterprise. Pick the one that matches your org boundaries — and be ready to evolve as you learn what governs well.

### Topology 1: Single enterprise-architecture repo

All ArcKit artifacts — global and per-application — live in one repo owned by the EA function.

```text
enterprise-architecture/
└── projects/
    ├── 000-global/
    ├── 001-customer-portal/
    ├── 002-billing-platform/
    └── …
```

| Pros | Cons |
|------|------|
| One source of truth; easy to cross-reference | Scales poorly past ~30 applications |
| Central governance is trivial | App teams feel locked out of "their" artifacts |
| Principles and app artifacts evolve in lockstep | Review bottlenecks on the EA team |

**Use when**: EA is highly centralised, application count is low-to-medium, and solution architects report into the EA function.

### Topology 2: Per-application repos, co-located with code

Each application's ArcKit artifacts live in the same repo as its code, under `projects/NNN-app/`. A separate enterprise-architecture repo holds only `000-global/`.

```text
enterprise-architecture/           # EA-owned
└── projects/
    └── 000-global/

customer-portal/                   # App team-owned
├── src/
└── projects/
    └── 001-customer-portal/

billing-platform/                  # App team-owned
├── src/
└── projects/
    └── 002-billing-platform/
```

| Pros | Cons |
|------|------|
| App teams own their architecture artifacts | Cross-app traceability needs tooling |
| Artifacts evolve with the code that implements them | `000-global/` must be synced downstream (see below) |
| Scales to hundreds of applications | Project numbering needs a registry to stay unique |
| Natural fit for federated governance | EA has less direct editorial control |

**Use when**: Application teams own delivery end-to-end, you already federate ownership of code, and the EA function's job is to set guardrails rather than gate every change.

### Topology 3: Grouped solution-architecture repos (hybrid)

Applications that belong to the same business domain or platform share a `solution-architecture` repo. Enterprise-wide artifacts still live in their own repo.

```text
enterprise-architecture/
└── projects/000-global/

payments-solution-architecture/    # Domain-owned
└── projects/
    ├── 010-payment-gateway/
    ├── 011-fraud-detection/
    └── 012-reconciliation/

identity-solution-architecture/    # Domain-owned
└── projects/
    ├── 040-customer-identity/
    └── 041-workforce-identity/
```

| Pros | Cons |
|------|------|
| Balances central control with domain autonomy | Requires clear domain boundaries |
| Related apps cross-reference easily | Still needs `000-global/` sync |
| Maps cleanly onto platform/team topologies | Domain boundaries drift over time |

**Use when**: You have a platform or domain-driven org structure (e.g. Team Topologies, domain-driven design), and a pure app-per-repo model would fragment closely-related architecture work.

---

## Ownership Model

Whichever topology you pick, assign ownership explicitly:

| Scope | Typical Owner | Review Cadence |
|-------|---------------|----------------|
| `000-global/` principles | Chief Architect / EA function | Annual |
| `000-global/` enterprise ADRs | Architecture Review Board | Per-decision |
| `000-global/` reference frameworks | EA + SMEs (security, data, AI) | Quarterly |
| Solution-level artifacts | Solution / Domain Architect | Per-project |
| Application-level artifacts | Application team's architect or tech lead | Per-release |

The Document Control header in every ArcKit artifact has `Owner`, `Reviewed By`, and `Approved By` fields — use them. They're the audit trail.

---

## Avoiding Principle Duplication

The single biggest anti-pattern at enterprise scale is copy-pasting `000-global/ARC-000-PRIN-v1.0.md` into every downstream repo. It drifts, creates false authority, and undermines the EA function.

Three approaches that work:

### 1. Reference by Document ID (simplest)

Downstream artifacts cite the global principle by ID:

> NFR-SEC-012 — Shall comply with enterprise principle `ARC-000-PRIN-v1.0#P-07` (zero-trust network access).

No copy. Just a stable pointer. ArcKit's [Citation Traceability](../../arckit-claude/references/citation-instructions.md) pattern handles this out of the box.

### 2. Git submodule / subtree sync

Per-application repos pull `000-global/` in as a git submodule or subtree, read-only:

```bash
git submodule add https://github.com/yourorg/enterprise-architecture projects/000-global
```

App teams can **read** global artifacts but can't modify them. Updates propagate via `git submodule update`. Works well for Topology 2.

### 3. CI-enforced sync with a manifest

Maintain a `governance-manifest.yaml` in each downstream repo that pins the EA repo commit SHA:

```yaml
enterprise_architecture:
  repo: yourorg/enterprise-architecture
  pinned_sha: a3f8b21
  required_artifacts:
    - ARC-000-PRIN-v1.0.md
    - ARC-000-FRAM-SEC-v1.0.md
```

A CI job (in the EA repo) opens PRs downstream whenever the manifest falls behind. Combine with `/arckit:principles-compliance` to prove conformance on every downstream PR.

---

## Project Numbering at Scale

With a central EA repo (Topology 1) numbering is trivial — the `create-project.sh` script allocates the next free number.

With federated repos (Topologies 2 and 3), you need a **registry** so project IDs stay unique across the enterprise. Options:

- **Shared spreadsheet or wiki page** — low-tech, works up to ~50 apps
- **Lightweight registry service** — issues IDs on request; stores `id → repo` mapping
- **Namespaced IDs** — prefix per domain (`PAY-010-REQ-*`, `IAM-040-REQ-*`) to decentralise allocation (note: this requires a small tweak to `node scripts/generate-document-id.mjs`)

Pick the lightest option that your auditors will accept.

---

## ArcKit + Spec Kit Handoff

ArcKit and [Spec Kit](https://github.com/github/spec-kit) operate at different altitudes:

- **ArcKit** — the governance layer: principles, requirements, stakeholders, ADRs, business cases, procurement, compliance.
- **Spec Kit** — the implementation layer: specification-driven delivery of a given piece of software.

A natural pipeline:

```text
ArcKit                                 Spec Kit
───────                                ────────
/arckit:requirements   ──(FR/NFR)──▶  /spec-kit specify
/arckit:data-model     ──(DR)─────▶  /spec-kit plan
/arckit:adr            ──(constr.)─▶  /spec-kit tasks
                                      /spec-kit implement
/arckit:conformance   ◀─(evidence)── (built artifacts)
```

Keep requirement IDs (`FR-xxx`, `NFR-xxx`, `DR-xxx`) in the Spec Kit spec frontmatter so traceability survives the handoff.

---

## Worked Example (placeholder)

We're looking for a real-world enterprise case study to anchor this guide — ideally a large org with 50+ applications across multiple repos, Topology 2 or 3. If that's you, leave a comment on [issue #346](https://github.com/tractorjuice/arc-kit/issues/346); we'll anonymise however you need.

---

## Fleet & Version Governance (managed settings)

At enterprise scale you usually want to govern *which* Claude Code versions run
ArcKit, *which* models are available, *which* plugins teams may install, and
*which* MCP servers may run - centrally, not repo by repo. Claude Code's
[managed settings](https://code.claude.com/docs/en/settings#settings-files)
and [server-managed settings](https://code.claude.com/docs/en/server-managed-settings)
give administrators the control point ArcKit benefits from.

### Pin a version range across the fleet

ArcKit ships a soft floor: the `version-check.mjs` SessionStart hook *warns*
anyone running below the supported Claude Code version. To *enforce* it, an
admin can set the native managed settings (Claude Code v2.1.163+):

```json
{
  "requiredMinimumVersion": "2.1.251",
  "requiredMaximumVersion": "2.1.999"
}
```

Claude Code then **refuses to start** outside the range and directs the user to
an approved version. Use `requiredMinimumVersion` to guarantee everyone has the
features ArcKit relies on; use `requiredMaximumVersion` as a known-good ceiling
so a regulated fleet doesn't auto-adopt a release before you've validated it.
These are *managed-settings only* — a plugin or repo cannot set them.

> **Run v2.1.169+ for reliable managed-policy salvage.** Current Claude Code
> strips invalid managed-settings entries, surfaces the validation error, and
> keeps enforcing every remaining valid policy. Older clients had weaker
> behavior, so do not rely on hard fleet controls until the client floor is
> enforced.

For an **individual** user or repo that just wants to avoid drifting *below*
the floor, the softer, user-scoped `minimumVersion` in `.claude/settings.json`
blocks auto-update/`claude update` from going below it. ArcKit pins this in its
own repos and the below-floor warning recommends it.

### Govern available models

Managed settings can also govern which models are available to a fleet. Use
your organisation defaults and model restrictions together, and enable
`enforceAvailableModels` when you need project settings, subagents, or manual
model overrides to stay inside the approved list.

ArcKit does not pin a model in its commands. Commands inherit the Claude Code
session default, so a centrally managed model policy is the right control point
for regulated deployments. The current ArcKit guidance assumes Claude Sonnet 5
as the normal default; allow Claude Fable 5.1 (the default Fable model since
Claude Code v2.1.257, Fable 5 before that) only where the tenant exposes it and
the work justifies the higher tier. Behind a Claude apps gateway the `fable`
and `best` aliases keep resolving to Fable 5 until the gateway is configured
for 5.1, so a gateway fleet does not pick up the new default on its own —
users select Fable 5.1 in `/model`, or you set it centrally.

Three newer settings sit alongside `enforceAvailableModels`:

- `ANTHROPIC_DEFAULT_MODEL` (Claude Code v2.1.236+) sets the model new
  sessions start on while a user's `/model` pick still wins and persists —
  unlike `ANTHROPIC_MODEL`, which overrides every session.
- `modelPicker` (v2.1.243+) curates the `/model` list: an ordered, labelled
  set of ids (Bedrock and Vertex spellings included) appended to or replacing
  the built-in lineup.
- `modelPricing` (v2.1.243+, managed) applies your contracted per-model rates
  and discount multiplier to `/cost`, the status line and telemetry cost
  figures instead of list price.

Subagent routing changed in v2.1.251: `CLAUDE_CODE_SUBAGENT_MODEL` now sets
the *default* subagent model, and an agent definition's `model:` or an
explicit per-spawn model takes precedence over it; v2.1.257 added
`CLAUDE_CODE_SUBAGENT_MODEL_FORCE` to restore the old override-everything
behaviour. Every ArcKit agent declares `model: inherit`. Whether that
declaration counts as an override is being verified on tractorjuice/arc-kit#580;
until it is, a fleet that routes ArcKit's readers and writers to a cheaper
model should set `CLAUDE_CODE_SUBAGENT_MODEL_FORCE` rather than rely on the
default, and can read the model each subagent actually ran on from `/tasks`
(v2.1.243+).

### Allowlist the ArcKit marketplace

`pluginSuggestionMarketplaces` lets admins allowlist org marketplaces whose
plugins may surface in context-aware tips. Allowlisting
`tractorjuice/arckit-claude` means Claude Code can suggest ArcKit when a user
opens a directory with a `projects/` tree or `ARC-*` artefacts — useful for
driving adoption across many teams without a manual rollout. Pair with
`strictKnownMarketplaces` / `blockedMarketplaces` if you want to *restrict*
installs to only the marketplaces you've vetted. Both accept `owner/*`
wildcards from Claude Code v2.1.223, so `tractorjuice/*` allowlists the
marketplace and every standalone extension repo in one entry.

### Slice usage/cost metrics by project

If you run Claude Code's OpenTelemetry export, set
`OTEL_RESOURCE_ATTRIBUTES` (Claude Code v2.1.161+) to attach custom labels to
every metric datapoint:

```bash
export OTEL_RESOURCE_ATTRIBUTES="repo=arc-kit,team=enterprise-architecture,project=042-identity-service"
```

You can then slice token/cost usage by team, repo, or project — a natural
complement to the per-artefact Document Control headers and `provenance-stamp`
ArcKit already produces. **Privacy caveat:** these labels are emitted as-is, so
don't put project identifiers in them for OFFICIAL-SENSITIVE / SECRET work
where the label itself would be sensitive.

If you export prompt telemetry but must not export generated response text,
leave assistant-response logging disabled:

```bash
export OTEL_LOG_ASSISTANT_RESPONSES=0
```

Only set `OTEL_LOG_ASSISTANT_RESPONSES=1` in environments where response
content is approved for the telemetry backend. Treat ArcKit artefact drafts,
policy decisions, and evidence summaries as sensitive until your data-handling
rules say otherwise.

---

## Related Guides

- [ArcKit Init](init.md) — bootstrapping a new repo
- [Knowledge Compounding](knowledge-compounding.md) — reusable vendor profiles across projects
- [Conformance](conformance.md) — proving downstream artifacts meet upstream principles
- [Traceability](traceability.md) — linking requirements across artifacts
