# UK Government overlay extraction — design

**Status:** Draft for review
**Date:** 2026-06-01
**Author:** Mark Craddock (with Claude)
**Type:** Architecture refactor (breaking, v6.0.0)

## 1. Problem

ArcKit's core `arckit` plugin is not jurisdiction-neutral. It is UK-public-sector with a neutral skin. Every other jurisdiction (UAE, FR, CA, EU, AT, AU, US) ships as an opt-in overlay that depends on core, but UK government compliance, procurement, defence, gov-code reuse, and funding commands live directly in core. This is a historical accident: UK came first, before the overlay pattern existed.

The v5.5 rebrand to "The Enterprise Architecture Governance Harness" makes the inconsistency louder, and core's own marketplace blurb still reads "71 commands... including UK Government compliance." A French, Australian, or US user installing core today inherits ~15 UK-only commands they cannot use.

This refactor extracts the UK-specific surface into officially-maintained overlays, making core genuinely jurisdiction-neutral and the model symmetric across all jurisdictions.

## 2. Decisions (agreed)

1. **Scope: full extraction.** All 15 UK-specific commands leave core. `risk` and `sobc` stay in core but are neutralised. (Alternatives considered: keep UK compliance in core as flagship; maximal neutralisation. Rejected in favour of the principled "a command leaves core iff it is useless or misleading outside its jurisdiction".)
2. **Granularity: split defence.** Two new plugins: `arckit-uk` (UK gov civilian jurisdiction baseline, 13 commands) and `arckit-uk-mod` (defence sector, 2 commands, depends on `arckit-uk`). Keeps defence assurance out of the civilian default-on experience and anticipates defence growth (DEFSTAN, CMMC-equivalent).
3. **Naming: jurisdiction prefix.** `uk-` for `arckit-uk` commands and `uk-mod-` for `arckit-uk-mod`, matching the `ca-`/`us-`/`au-` jurisdiction convention and the `uk-nhs-`/`uk-fs-` sector convention. Collision-safe in the flattened non-Claude distributions.
4. **`arckit-uk` ships `defaultEnabled: true`** — the one overlay that is default-on, so the UK out-of-box experience is preserved. `arckit-uk-mod` is `defaultEnabled: false`.
5. **Decouple UAE + AU, no UK dependency.** AU swaps its one `ai-playbook` recipe target for native `au-ai-assurance`. UAE drops its 5 redundant UK targets — it already double-dips (runs native `uae-pdpl`/`uae-ias`/`uae-ai-charter`/`uae-ai-autonomy-tier` alongside the UK ones), so only UK-specific `tcop` is lost. No overlay takes a dependency on `arckit-uk`.
6. **Move `uk-saas` to `arckit-uk`; author a neutral `baseline` default recipe in core** (neutral governance suite, no compliance). Core's default becomes honestly neutral.
7. **Make core's recommendation engine regime-aware**, gated on the existing `governance_framework` userConfig: `graph-inject`, `graph-rollups`, and the `analyze`/`health`/`impact` + architecture-workflow path suggestions emit `uk-*` only when `governance_framework = UK Gov`; neutral or none otherwise.

## 3. Namespacing reality (the breaking change)

Confirmed against the Claude Code plugin docs: a slash command's namespace is the *plugin* name. There is no bare-name fallback and no cross-plugin alias. Moving `tcop` from `arckit` to `arckit-uk` makes it `/arckit-uk:uk-tcop` permanently; `/arckit:tcop` ceases to exist. This is therefore a **v6.0.0 major** with an unavoidable migration cost (docs, recipes, test repos, muscle memory).

Side finding: the README documents overlay commands as `/arckit:ca-pia`, which is technically wrong per the docs (should be `/arckit-ca:ca-pia`). Fix this in the same doc sweep.

## 4. Target architecture

| Plugin | Maintained | defaultEnabled | Contents | Depends on |
|---|---|---|---|---|
| `arckit` (core) | Official | true | ~56 neutral commands; `risk`/`sobc` neutralised; central `doc-types.mjs` registry (incl. UK/MOD regime entries), `pages.md`, all hooks, graph-inject; AWS/Azure/GCP MCPs; neutral research + datascout agents | — |
| `arckit-uk` | Official | **true** | 13 commands (compliance, procurement, gov-code, grants); 8 agents; govreposcrape MCP | arckit |
| `arckit-uk-mod` | Official | false | 2 defence commands; `uk-mod-sovereign` recipe | arckit, **arckit-uk** |
| `arckit-uk-nhs` | Community | false | unchanged commands; cross-refs re-pointed | arckit, **arckit-uk** |
| `arckit-uk-finance` | Community | false | unchanged commands; cross-refs re-pointed | arckit, **arckit-uk** |

This makes UK symmetric with Australia (`arckit-au-energy → arckit-au → arckit`) and fixes the current inconsistency where the UK sector overlays (NHS, Finance) hang directly off core and silently depend on UK compliance commands that happen to live there.

`arckit-uk` + `arckit-uk-mod` are **officially maintained** (TractorJuice), not community. The top-line official command baseline (71) is preserved, now spanning three official plugins: `arckit` (56) + `arckit-uk` (13) + `arckit-uk-mod` (2). Total marketplace plugins: 11 → 13. Total commands unchanged at 147, just redistributed.

## 5. Command naming map

### arckit-uk (`uk-` prefix) — 13 commands

| Core (old) → `arckit-uk` (new) | Sub-domain |
|---|---|
| `tcop` → `uk-tcop` | Compliance |
| `secure` → `uk-secure` | Compliance |
| `dpia` → `uk-dpia` | Compliance |
| `ai-playbook` → `uk-ai-playbook` | Compliance |
| `atrs` → `uk-atrs` | Compliance |
| `service-assessment` → `uk-service-assessment` | Compliance |
| `dos` → `uk-dos` | Procurement |
| `gcloud-search` → `uk-gcloud-search` | Procurement |
| `gcloud-clarify` → `uk-gcloud-clarify` | Procurement |
| `gov-reuse` → `uk-gov-reuse` | Gov-code reuse |
| `gov-code-search` → `uk-gov-code-search` | Gov-code reuse |
| `gov-landscape` → `uk-gov-landscape` | Gov-code reuse |
| `grants` → `uk-grants` | Funding |

### arckit-uk-mod (`uk-mod-` prefix) — 2 commands

| Core (old) → `arckit-uk-mod` (new) |
|---|
| `mod-secure` → `uk-mod-secure` |
| `jsp-936` → `uk-mod-jsp-936` |

## 6. What moves with each command

**Agents (8) → `arckit-uk/agents/`**, renamed `arckit-uk-*` for namespace hygiene; update command references:
- `arckit-gov-reuse`, `arckit-gov-reuse-reader`, `arckit-gov-reuse-writer`
- `arckit-gov-code-search`, `arckit-gov-landscape`
- `arckit-grants`, `arckit-grants-reader`, `arckit-grants-writer`

The reader/writer pattern moves with them: 2 of the 3 families (`grants`, `gov-reuse`) relocate; `datascout` stays in core. `arckit-uk-mod` ships no research agents (its two commands are template-driven).

**MCP → `arckit-uk/.mcp.json`:** move the `govreposcrape` entry out of core `.mcp.json`. It is currently deferred (not `alwaysLoad`), so no eager-load change.

**Templates:**
- 13 `uk-*` command templates → `arckit-uk/templates/` (renamed `uk-*-template.md`)
- 2 defence templates → `arckit-uk-mod/templates/`
- Each overlay carries its own `templates/_partials/` (document-control) and `references/` (citation-instructions, quality-checklist) per the shared-assets sync model.
- Remove the moved templates from the `.arckit/templates/` CLI mirror; `sync-shared-assets.py` + converter propagate from the new sources.

**Recipes:**
- `uk-mod-sovereign.yaml` → `arckit-uk-mod/recipes/`; update command refs to `uk-mod-*` / `uk-*` / neutral core names; remove from the core list hardcoded in `arckit-build/SKILL.md`.
- `uk-nhs-clinical-safety.yaml` → `arckit-uk-nhs/recipes/` (currently orphaned in core); update refs.
- `uk-fs-payments.yaml` → `arckit-uk-finance/recipes/` (currently orphaned in core); update refs.
- `uk-saas.yaml` → `arckit-uk/recipes/` (it chains 6 UK commands — `gov-reuse`, `tcop`, `secure`, `dpia`, `ai-playbook`, `service-assessment` — so it is not neutral). Re-point its targets to `uk-*`. Core gets a new neutral `baseline` default recipe instead (section 7).

**Doc-types:** stay in the central core `doc-types.mjs` registry and `pages.md` (TCOP, SECD, SECD-MOD, AIPB, ATRS, DPIA, SVCASS, JSP936). `REGIMES` already lists `UK` + `MOD`, so no registry change. Update the doc-type→command comments to the new names. Minor consistency fix: tag `SECD` (currently regime-less) as `regime: 'UK'` so graph-inject groups it correctly.

## 7. Core changes

- **Neutralise `risk`:** branch on the existing `governance_framework` userConfig. `UK Gov` → today's HM Treasury Orange Book framing; `Generic` → ISO 31000-style register. No new command.
- **Neutralise `sobc`:** it already partly adapts. Branch on `governance_framework`: `UK Gov` → full Green Book 5-case; `Generic` → generic business-case structure. No separate `uk-sobc`.
- **Remove** the 15 UK command files, their templates, the 8 agents, the govreposcrape MCP entry, and the relocated recipes from core.
- **New neutral `baseline` default recipe** in `arckit-build/recipes/`, replacing `uk-saas` as the default. Chains neutral governance commands only (requirements, stakeholders, data-model, diagram, adr, risk, roadmap, plan, traceability). Update the build skill's default + `SKILL.md` references.
- **Regime-aware recommendation engine:** gate UK command suggestions in `hooks/graph-inject.mjs`, `hooks/graph-rollups.mjs`, `scripts/bash/create-project.sh`, the `analyze`/`health`/`impact` next-step logic, and the architecture-workflow path skills on `governance_framework = UK Gov`. (Pragmatic: core retains a UK suggestion table, gated. Moving the table into `arckit-uk` is a larger framework change, deferred.)
- **Audit:** grep core for residual UK fingerprints (Orange/Green Book outside the gated branches, NCSC, G-Cloud, gov.uk) and confirm none remain in command bodies.

## 8. Blast radius (verified)

A repo-wide audit shows the UK commands are not a clean module: they are woven through core's connective tissue and reused by other overlays, because UK was always the home regime. Two tiers:

### Tier 1 — functional breaks (build recipes that will not resolve a moved `skill: arckit:<cmd>` target)

| Plugin | Recipe(s) | Moved targets | Resolution |
|---|---|---|---|
| `arckit-uae` | `uae-federal-ai`, `uae-agentic-transformation` | 10 (tcop, secure, dpia, ai-playbook, atrs) | **DECIDED: decouple, no dep.** UAE already double-dips — it runs native `uae-pdpl`/`uae-ias`/`uae-ai-charter`/`uae-ai-autonomy-tier` alongside the UK ones. Drop the 5 redundant UK targets; only UK-specific `tcop` is lost (never belonged in a UAE recipe). |
| `arckit-au` | `au-federal` | 1 (ai-playbook) | **DECIDED: native swap.** Replace the `ai-playbook` target with `au-ai-assurance`. No dependency. |
| core (`arckit-build`) | `uk-mod-sovereign`, `uk-nhs-clinical-safety`, `uk-fs-payments` | 20 total | Relocate to `arckit-uk-mod` / `arckit-uk-nhs` / `arckit-uk-finance` and re-point. |
| core (`arckit-build`) | **`uk-saas` (the DEFAULT recipe)** | 6 (gov-reuse, tcop, secure, dpia, ai-playbook, service-assessment) | `uk-saas` is **not neutral** — it is a UK SaaS delivery recipe. **DECIDED: move it to `arckit-uk`; author a neutral `baseline` default recipe in core.** |

### Tier 2 — cosmetic breaks (stale `Run /arckit:<cmd>` next-step suggestions; execution still works, but every suggestion points to a moved command)

Roughly 260 references. None crash, but all are wrong after the move:

| Area | Approx refs |
|---|---|
| core commands (analyze, health, impact, diagram, wardley*, mlops, plan, data-mesh-contract, servicenow, principles-compliance, customize, *-research) | ~60 |
| core agents (research, datascout, aws/azure/gcp-research, gov-*) | ~30 |
| core templates (story, project-plan, *-research, datascout, gov-*) | ~25 |
| core skills (architecture-workflow path refs: uk-gov-path, defence-path, data-path, ai-ml-path, standard-path; mermaid-syntax) | ~16 |
| core docs/guides (incl. `roles/*`, `uk-government/*`, `uk-mod/*`, `govs-007-security`, `codes-of-practice`) | ~93 |
| core code: `hooks/graph-inject.mjs` (keyword→command map), `hooks/graph-rollups.mjs` (doc-type→command map), `scripts/bash/create-project.sh` (welcome text) | ~9 (in `.mjs`/`.sh`, not `.md`) |
| other overlays' command bodies (fr 7, eu 5, at 3, us 3, au 1) | ~19 |
| `arckit-uk-nhs` command/template cross-refs | ~10 |

### NHS + Finance specifics

Both currently depend only on `arckit` and cross-reference UK compliance commands. Required: add `arckit-uk` (`=6.0.0`) to their `dependencies`; re-point cross-refs and recipe targets; no command renames inside NHS/Finance themselves.

### Design consequence

The recommendation engine in core (`graph-inject`, `graph-rollups`, and the `analyze`/`health`/`impact` next-step logic plus the architecture-workflow path skills) currently hardcodes UK command suggestions. **Decided (section 2.7): make them regime-aware**, gated on `governance_framework = UK Gov`. This is net-new conditional logic, not find/replace, and is the largest single work item.

## 9. Registration + packaging checklist

- New `arckit-uk/` and `arckit-uk-mod/`: `.claude-plugin/plugin.json`, `VERSION`, `CHANGELOG.md`, `README.md`, `commands/`, `templates/`, `agents/` (uk only), `recipes/` (uk-mod), `references/`, `.mcp.json` (uk only).
- `dependencies`: `arckit-uk → [arckit]`; `arckit-uk-mod → [arckit, arckit-uk]`.
- `defaultEnabled`: `arckit-uk` = true; `arckit-uk-mod` = false.
- `converter.py` `PLUGIN_SOURCES` += `arckit-uk`, `arckit-uk-mod` (the known omission gotcha — uk-finance was missing here for several releases).
- `marketplace.json` += two entries (manual descriptions/keywords; the drift check enforces presence).
- `sync-shared-assets.py` overlay list += both plugins.
- `bump-version.sh` / `tag-plugins.sh` auto-discover from disk (post-#523) and now bump any `arckit*` dep (post-v5.8.0), so the new community→community deps pin correctly.
- CI guards to re-run/extend: `check_references.py`, `test-regime-registration.mjs`, dual-registration (doc-types in both `doc-types.mjs` and `pages.md`).

## 10. Migration (v6.0.0)

- **Clean break, no aliases** (not technically possible). Recommend against transitional core stubs (15 redirect stubs add complexity and Claude commands cannot cleanly redirect). Mitigate with a loud CHANGELOG and a migration guide instead.
- **Migration guide** (`docs/MIGRATION-v6.md`): old→new command table; "enable `arckit-uk`" instructions; note `arckit-uk` is default-on so most users only need to relearn the prefix.
- **Doc sweep:** README (UK sections point to `arckit-uk`/`arckit-uk-mod`; fix the `/arckit:overlay` namespace error globally), `docs/index.html`, `DEPENDENCY-MATRIX.md`, `docs/guides/*`, `CLAUDE.md`, command counts, both CHANGELOGs.
- **Test repos (27):** enable `arckit-uk` (+ `arckit-uk-mod` where defence is exercised); scripted find/replace of `/arckit:<cmd>` → `/arckit-uk:uk-<cmd>` in their `projects/`/`docs/`. Largest manual effort; sequence after the plugins are tagged.
- **Memory updates:** `project_command_count_policy` (official baseline now spans 3 official plugins), `project_reader_writer_pattern` (2 of 3 families moved), `project_overlay_registration_checklist` (two new plugins), `project_min_claude_code_version` / version index.

## 11. Out of scope / future

- A neutral AI-governance command in core to replace `ai-playbook`/`atrs` for non-UK users (net-new; defer).
- A neutral threat-modelling / security-architecture command in core (overlays provide security today; defer).
- Moving the gated UK suggestion tables out of core hooks and into `arckit-uk` (a framework change so overlays can contribute recommendations; deferred — section 7).
- Promoting community jurisdiction overlays to a consistent "official vs community" labelling in docs.

## 12. Risks / open questions

- **`defaultEnabled: true` semantics:** confirm on the target Claude Code version that a default-on overlay surfaces its commands out-of-box on a fresh marketplace install (the plugin docs were not explicit). Gate the release on this.
- **Neutral-core gap:** neutral users lose UK AI-governance and UK service-standard assessment entirely. Accepted (these are inherently jurisdiction-specific; overlays provide equivalents).
- **Test-repo migration volume:** 27 repos, several UK-focused. Script it; budget time.
- **Marketing optics:** core's headline drops 71 → 56, but the official baseline (71) is preserved across three official plugins. Frame accordingly; do not lead with command counts (harness positioning).

## 13. Acceptance criteria

- `arckit-uk` and `arckit-uk-mod` build; `claude plugin tag <dir> --dry-run` clean for all plugins.
- `check_references.py`, `test-regime-registration.mjs`, and dual-registration tests pass.
- `converter.py` emits non-Claude formats including both new plugins with `uk-`/`uk-mod-` names.
- NHS + Finance recipes resolve the new `uk-*` commands; their `dependencies` include `arckit-uk`.
- Core contains zero UK-specific commands; only `risk`/`sobc` remain, gated on `governance_framework`; grep audit clean.
- `docs/MIGRATION-v6.md` published; README namespace error fixed.
