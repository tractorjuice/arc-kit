# Changelog — ArcKit Plugin

All notable changes to the ArcKit Claude Code plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [4.13.1] - 2026-05-03

Same-day follow-up to v4.13.0. All changes are additive enhancements to the build harness — no breaking changes, no removals.

### Added

- **`uae-federal-ai` recipe (#414).** Third built-in recipe for UAE Federal projects under the 23 April 2026 Cabinet agentic AI decree. 48 targets including all 12 UAE community commands (PDPL, IAS, AI Charter, autonomy tier, cloud residency, UAE Pass, data sharing, digital records, priorities alignment, procurement, zero bureaucracy, classification), an integrated research wave, and the core ArcKit governance suite. ADR topics rewritten for UAE federal AI (Core42 / G42 / Microsoft UAE / e& sovereign hosting, UAE Pass tiers, AI autonomy policy, MoF procurement route).
- **Research wave on `uk-saas` and `uk-mod-sovereign` (#417).** Both recipes go from 31/32 → 38 targets each. Default-on per-project research targets: `RESEARCH`, `AWS_RESEARCH`, `AZURE_RESEARCH`, `GCP_RESEARCH`, plus `GOV_REUSE` (uk-saas only) and optional `DATASCOUT`. Skip what you don't need with `--exclude AWS_RESEARCH` etc.
- **`ORG_RESEARCH` upstream target (#417, #414 amendment).** New first-wave target on all three built-in recipes. Researches the target organisation's strategy, structure, and existing systems; output goes to `projects/000-global/research/` so the org context is shared across every project in the same repo. Per-project research targets all `deps: [REQ, ORG_RESEARCH]`, so context flows organisation → project. Default on; opt out with `--exclude ORG_RESEARCH`.

### Documentation

- **Discovery surfaces caught up with v4.13.0 (#416).** `/arckit:build` now appears in `commands.html` (Foundation row), `guides.html` (Getting Started list, count 10 → 11), and a new "Meta: Build Harness" section in `DEPENDENCY-MATRIX.md`. The matrix entry explains why the harness isn't a row/column in the DSM (depends on every other command transitively).
- **sitemap.xml + llms.txt + getting-started.html (#415).** sitemap adds `articles.html` and `article-viewer.html`, refreshes `lastmod=2026-05-03` on the home / commands / guides / getting-started entries. llms.txt updated to 71 commands + 34 community, mentions the build harness with all three recipes and the new build guide, plus a new "Articles and essays" section. getting-started gains a "Faster path (Claude Code only)" notification banner introducing The GDS Harness immediately under the existing Vibe Start banner.
- **Getting-started recipe counts updated** to reflect the post-research-wave shape (uk-saas: 31→38, uk-mod-sovereign: 32→38, uae-federal-ai: 47→48). Banner now also describes the `ORG_RESEARCH` pattern and how to opt out.

### Architecture notes

- All three built-in recipes now share a consistent research-flow shape: `ORG_RESEARCH` (no deps, global) → per-project research targets (deps on REQ + ORG_RESEARCH). Recipe authors writing custom recipes are encouraged to follow this pattern.
- The research targets do not gate ADRs in any recipe — research is informational. Architects read the research outputs when drafting ADRs rather than the harness blocking on them. This keeps the wave plan tight and makes opting research targets in/out a fluid decision per build.

## [4.13.0] - 2026-05-03

### Added

- **`/arckit:build` parallel build harness (#410).** New skill `arckit-build` and slash command `/arckit:build` orchestrate parallel `/arckit:*` artefact generation via subagent isolation. Reads a YAML recipe, computes the dependency DAG, dispatches one `general-purpose` subagent per target per wave, validates outputs, and commits each wave as one atomic git commit. State persisted to `projects/{P}/.arckit/state.json` for resumability across sessions and recipe edits. Two built-in recipes ship with the plugin: `uk-saas` (31 targets — UK Government civilian SaaS with GDS Service Standard, TCoP, NCSC CAF coverage) and `uk-mod-sovereign` (32 targets — MOD / sovereign / air-gapped with `mod-secure` + `jsp-936`, no SVCASS, sealed-media distribution). Recipe schema v1 supports glob deps (`ADR-*`), variable substitution (`{P}/{NAME}/{V}/{TOPIC}`), `optional_targets` with `--enable`/`--exclude` flags, and project overrides via `.arckit/recipes/{name}.yaml`. Worker prompt trusts the existing `validate-arc-filename.mjs` PreToolUse hook for path allocation rather than constructing filenames itself, so multi-instance numbering, subfolder placement, and project-ID padding are all consistent with single-skill invocations. Skill version banner v0.4. Claude-only — `scripts/converter.py` skips both the skill and the slash command for Codex / OpenCode / Gemini / Copilot extensions because parallel `Agent` dispatch is a Claude Code-specific capability.
- **Provenance stamping hook (#409).** New `provenance-stamp.mjs` PostToolUse hook on `Write|Edit` against `projects/**` injects a `## Build Provenance` block into every ArcKit artefact, recording build context (recipe / wave / target / topic) from `state.json`, requested effort from command frontmatter, and effective effort derived via the silent-downgrade matrix (model parsed from the existing `AI Model:` footer line). Block is delimited by HTML comments and rewritten in place on subsequent edits (idempotent). Complements rather than duplicates the human-authored footer the command writes; the block stamps only fields the model cannot authoritatively self-report. When the model doesn't support the requested level, the block reads e.g. `Effective Effort: high (downgraded from max — model does not support that level)` — the auditable signal issue #407 was filed for.
- **Build harness launch article + hero (#411).** Long-form essay at `docs/articles/2026-05-03-build-harness-parallel-architecture-generation.md` plus a 1600x900 hero image with wave-plan visualization (9 waves, GDS palette). Surfaced on both `articles.html` (top of grid) and `index.html` (top of "Latest writing" teaser).
- **`uk-mod-sovereign` recipe.** Sovereign / air-gapped variant with eight rewritten ADR topics, `mod-secure` replacing standard SbD, JSP 936 AI assurance, and ATRS algorithmic transparency as opt-in. Anchored on Principle 21 (Sovereign and Air-Gapped Deployment).

### Fixed

- **CLAUDE.md ADR/DIAG path documentation (#408).** The "Project Structure Created by `arckit init`" tree showed ADRs and diagrams at project root, but `/arckit:adr` and `/arckit:diagram` actually write to `decisions/` and `diagrams/` subfolders (verified against test repos v1, v3, v17). Tree updated to show the correct subfolder layout.

### Architecture notes

- The `validate-arc-filename.mjs` hook is now treated as the authoritative path allocator for ArcKit artefacts. The build harness's worker prompt trusts the hook to normalize paths at write time rather than redundantly invoking `generate-document-id.sh` itself. Recipe `output.subfolder` and `output.multi_instance` fields are documented as orientation hints for `--plan` output; the hook's `SUBDIR_MAP` and multi-instance-types list are the runtime source of truth.

## [4.12.3] - 2026-05-01

### Fixed

- **`/arckit:traceability` actually now reports correct coverage (#389).** Previous v4.12.2 attempt fixed regex namespace collisions but the actual bug was elsewhere: `formatTraceability` reads `node.reqIds` for every non-REQ artifact to build the coverage `refMap`, but `node.reqIds` is only assigned by `scanAllArtifacts` when the caller passes `withNodeMetadata: true` (`graph-utils.mjs:181-188`). The traceability recipe in `graph-inject.mjs` did not request that flag, so `reqIds` was always `undefined` and `refMap` always empty — coverage reported 0% regardless of what was in the documents. Verified end-to-end against `arckit-test-project-v20-uae-moi-ipad` project 006: coverage now reports 41 of 53 requirements (77%), with citation lists per requirement showing the actual covering artifacts (RISK, SOBC, STKE, IAS, PDPL, CLAS, RSCH, WARD, ADR, AUTI, CRES, AICH, NPRA).

## [4.12.2] - 2026-05-01

### Fixed

- **`/arckit:traceability` reported 0% coverage on legacy projects with 1-2 digit REQ IDs (#389).** The v4.12.1 fix loosened the REQ-doc heading extractor but kept the universal `REQ_ID_PATTERN` strict at `\d{3}` to avoid namespace collisions with non-REQ artifacts. Side-effect: cross-references like `BR-1, FR-3, NFR-SEC-7` in `RSCH` / `RISK` / `STKE` / `SOBC` / `WARD` / UAE-overlay compliance assessments were not extracted, so `node.reqIds` came back empty and `formatTraceability` reported zero coverage even when 14 sibling artifacts genuinely cited the requirements. Universal scanner now also accepts `\d{1,3}`.
- **`templates/azure-research-template.md`** — Azure Security Benchmark "Backup & Recovery (BR)" row renamed to `BCK-N` to remove the namespace collision with Business-Requirement IDs. Previously `BR-1, BR-2, BR-3` in the ASB control table would, after the loose-pattern fix, be picked up as REQ cross-references. AWS and GCP research templates checked and confirmed clean (no equivalent collisions).

### Known limitations

- `templates/fr-anssi-carto-template.md` line 144 still uses `INT-01` for network-interconnection IDs, which collides with the REQ Integration namespace. Currently affects only French ANSSI cartography artifacts. Will be addressed in a follow-up.

## [4.12.1] - 2026-05-01

### Fixed

- **Templates aligned to 3-digit REQ IDs** — `requirements-template.md`, `traceability-matrix-template.md`, `hld-review-template.md`, and `jsp-936-template.md` previously used `BR-1` / `FR-1` / `NFR-P-1` placeholder form. 24 of 27 surveyed test-repo REQ documents already use 3-digit zero-padded form (`BR-001`); only the most recent 3 followed the templates literally and broke the hook. Templates now consistently use the 3-digit form. Affects all template copies (`arckit-claude`, `.arckit`, and the five extension templates regenerated by `scripts/converter.py`). `azure-research-template.md` (Azure Security Benchmark `BR-N` namespace for "Backup & Recovery") and `fr-anssi-carto-template.md` (`INT-NN` network-interconnection IDs) were intentionally left unchanged — different namespaces (#386).
- **`hooks/hook-utils.mjs`** — `extractRequirementDetails` heading regex now accepts 1-3 digit numeric suffixes (`### BR-1:`, `#### FR-12:`, `### BR-001:`). Previously hardcoded `\d{3}`, which silently dropped requirements from any REQ document using non-padded IDs — leaving `/arckit:traceability` with an empty graph and forcing the manual fallback. The universal `REQ_ID_PATTERN` scanner stays strict at `\d{3}` to avoid false positives in non-REQ artifacts that use the same prefix in a different namespace (e.g. Azure Security Benchmark `BR-1, BR-2` in `azure-research-template.md`) (#386).
- **`hooks/graph-inject.mjs`** — `formatTraceability` now emits a diagnostic message when no requirements can be extracted from a project that has artifacts, instead of returning `null` silently. The hook bail-out is now visible in the prompt context so the failure mode looks like a hook problem rather than a missing hook (#386).
- **`hooks/graph-inject.mjs`** — `DR-\d{3}` data-requirement detector loosened to `DR-\d{1,3}` so the "missing data-model" recommendation correctly fires for projects with shorter `DR-N` IDs.

## [4.12.0] - 2026-05-01

### Added

- **`hooks/graph-rollups.mjs`** — shared module with `tagNodeHealth()`, `computeAllProjectRollups()`, and the canonical `HIGH_SEVERITY_TYPES` / `ESSENTIAL_TYPES` / `CONTEXTUAL_TYPES` / `STALE_THRESHOLD_DAYS` constants. Used by both `graph-inject.mjs` and `sync-guides.mjs` (#383).
- **`manifest.json` enrichments** written by `sync-guides`:
  - `dependencyGraph.nodes[*].health = { stale, draft, orphan, ageDays }` per node.
  - New `manifest.projectHealth` block with per-project coverage %, compliance readiness %, density, top-3 recommendations, stale/draft/orphan counts.
- **`pages-template.html`** Document Map tints nodes by health (red=stale, amber=draft, dashed=orphan), extends the legend and tooltip, and adds a new "Project Health & Next Steps" dashboard panel rendering one card per project from `manifest.projectHealth`.
- **`docs/llms.txt`** gains an opt-in `## Project status` section listing per-project coverage / compliance / health flags / top recommendation.

### Changed

- `graph-inject.mjs` refactored to import constants from `graph-rollups.mjs`. No behaviour change.
- `sync-guides.mjs` passes `{ withNodeMetadata: true }` to `scanAllArtifacts`. Manifest size grows ~60% on typical projects.
- `docs/guides/hooks.md` refreshed: superseded per-command `*-scan.mjs` rows replaced with a single `graph-inject` row; `graph-rollups.mjs` added to Utility Files table; `sync-guides` description updated.

### Breaking changes

None. Manifest schema is additive.

## [4.11.0] - 2026-05-01

### Added

- `/arckit.navigator` (Live) — project-level GPS that shows coverage against the essential ArcKit baseline, flags DRAFT / stale / orphan artifacts, and recommends the next slash command. Read-only.
- `/arckit.graph-report` (Live) — governance metrics dashboard across all working projects (coverage, cross-reference density, compliance readiness, project comparison). Read-only.
- `hooks/graph-inject.mjs` — consolidated graph-builder hook that replaces the five legacy per-command scan hooks (`search-scan`, `impact-scan`, `traceability-scan`, `health-scan`, `governance-scan`).
- `hooks/graph-utils.mjs` v2 — additive `withNodeMetadata`, `withContent`, `withPreview` opts. Backward compatible.
- Guides: `guides/navigator.md`, `guides/graph-report.md`.

### Changed

- `/arckit.search`, `/arckit.impact`, `/arckit.traceability`, `/arckit.health`, `/arckit.analyze` now consume the unified `graph-inject` pipeline instead of running their own scans.
- Plugin description bumped to "70 slash commands". Officially-maintained baseline is 68 → 70.

### Breaking changes

None.

### Internal

- 8 PRs landed for v4.11.0: #360, #362, #363, #364, #365, #366, #367, with replacement PRs #377 (search) and #378 (matrix doc).

## [4.10.1] - 2026-04-30

### Changed

- UAE Federal Overlay reclassified from official-baseline to community-contributed. All 12 `uae-*` commands now carry the `[COMMUNITY]` description prefix, an inline warning banner before the prompt body, and `Template Origin: Community` in their templates. See top-level `CHANGELOG.md` `[4.10.1]` for the full reclassification notes and rationale.

## [4.10.0] - 2026-04-30

### Added

- 12-command UAE Federal Overlay (initially shipped as official-baseline; reclassified to community-contributed in 4.10.1 the same day). See top-level `CHANGELOG.md` `[4.10.0]` for the full release notes.

## [4.9.4] - 2026-04-28

### Docs

- Added `docs/guides/custom-commands.md` — authoring guide for contributors adding new `/arckit.*` commands. Covers the converter fan-out from the plugin source to six target formats, frontmatter reference, the `$ARGUMENTS` placeholder rewriting table, template-handling differences between Paperclip (embedded) and other targets (verbatim copy), a worked `/arckit.sla` example, the commands/skills/agents/hooks decision table, and a testing checklist. Authored by @Yumstezy (#111, #357)

### Fixed

- `hooks/allow-mcp-tools.mjs` now auto-allows `mcp__govreposcrape__` tool calls. Four of the five bundled MCPs were already in the auto-allow list — govreposcrape was missing, so every `/arckit.gov-reuse`, `/arckit.gov-code-search`, and `/arckit.gov-landscape` run was hitting a permission dialog on every tool call (#215, #358)

## [4.9.3] - 2026-04-28

### Added

- `/arckit.pages` dashboard now surfaces HTML deck artifacts (e.g. `ARC-001-DECK-v1.0.html`) alongside markdown documents in project artifact lists. New `DECK` doc-type code registered in `config/doc-types.mjs` and the `sync-guides` hook (#354)

### Changed

- `plugin.json` declares `"$schema": "https://json.schemastore.org/claude-code-plugin-manifest.json"` for editor autocomplete and IDE-side validation. Recognised by `claude plugin validate` since Claude Code v2.1.120; forward-compatible because Claude Code ignores `$schema` at load time, so no minimum-version bump (#215, #355)

## [4.9.2] - 2026-04-24

### Changed

- Documented minimum Claude Code version bumped from v2.1.112 to **v2.1.117**. `version-check.mjs` SessionStart hook updated (`MIN_CLAUDE_CODE_VERSION = '2.1.117'`); warning copy now lists the Opus 4.7 `/context` size fix (1M instead of 200K — long research sessions no longer autocompact early) and `--agent` `mcpServers` loading as the headline v2.1.117 reasons. `README.md` and `docs/guides/mcp-servers.md` updated to match (#215, #352)

### Postmortem context

The v2.1.117 floor independently clears all three Claude Code regressions described in [Anthropic's April 23 postmortem](https://www.anthropic.com/engineering/april-23-postmortem) (effort default lowered Mar 4 – Apr 7, thinking-cache clearing bug Mar 26 – Apr 10 fixed in v2.1.101, "≤25 words between tool calls" verbosity rule Apr 16 – Apr 20 fixed in v2.1.116). Users on v2.1.117+ are clear of all three.

## [4.9.1] - 2026-04-22

### Fixed

- `/arckit.wardley` and `/arckit.wardley.value-chain` quoting rule now forces quotes on names containing a bare numeric word (`NIS 2031`, `ISO 27001`, `Windows 11`, `Log4j 2024`). The mermaid `wardley-beta` parser tokenises bare digits as numeric literals and breaks rendering otherwise (#349)
- `validate-wardley-math.mjs` Stop-hook extended to scan `mermaid` / `wardley-beta` blocks and block Stop on any unquoted bare-digit name (declarations, `->` edges, `evolve` targets, `pipeline` parents) (#349)

## [4.9.0] - 2026-04-21

### Added

- Mermaid `wardley-beta` rendering now works in generated `docs/index.html` pages — CDN bumped to `mermaid@11.14.0` (2026-04-01 release) which ships the Wardley diagram type as a stable feature (#337)

### Fixed

- `/arckit.wardley` and `/arckit.wardley.value-chain` now emit correctly-quoted names in generated `wardley-beta` blocks using a grammar-driven conditional rule. Hyphenated names like `Real-Time Data Processing` or `GPT-4 LLM Service` previously broke rendering because Mermaid's lexer read the `-` as `->`. Simple multi-word names like `API Gateway` stay unquoted (#341)

### Companion

- [`tractorjuice/wardley-maps-mermaid`](https://github.com/tractorjuice/wardley-maps-mermaid) — public mirror of `swardley/WARDLEY-MAP-REPOSITORY` with 147 OWM-to-Mermaid conversions, all rendering cleanly under Mermaid 11.14.0+

## [4.8.0] - 2026-04-20

### Added (Community-contributed)

- 3 Austrian regulatory commands seeded in #320 and verified in #333 by @gtonic: `/arckit.at-dsgvo` (DSG/DSGVO), `/arckit.at-nisg` (NISG idF BGBl. I Nr. 94/2025 — NIS2 transposition), `/arckit.at-bvergg` (BVergG 2018, thresholds per VO 2023/2495). New doc-type codes ATDSG, ATNISG, BVERGG registered in both `config/doc-types.mjs` and `commands/pages.md`. @gtonic added as Austrian domain CODEOWNERS (#334)
- `/arckit.fr-irn` — IRN (Indice de Résilience Numérique) self-assessment per the aDRI framework (#322)

### Fixed

- Propagate `.guide-status.community` CSS to `pages-template.html` (#327)
- Register 18 EU/FR community guide stems in the `sync-guides` hook
- AT DSG template drift: sync `arckit-claude/templates/at-dsgvo-template.md` with the verified `.arckit/` copy so plugin and extension users get the enriched template
- `docs/superpowers/README.md` MD040 lint error (missing language tag on code fence)

### Docs

- @gtonic added to `docs/contributors.html` as code contributor + Austrian domain maintainer (#328)
- CHANGELOG `[Unreleased]` sync covering 12 untracked commits since v4.7.2 (#329)
- Book content moved to `tractorjuice/arckit-book` (#324, #325)
- Star History chart added to README; DeepWiki `.devin/wiki.json` added
- `docs/superpowers/` tidy + README (#326)
- Registry-consolidation design spec and plan (not yet implemented)

## [4.7.2] - 2026-04-19

### Added

- `## Key References` tables in all 18 EU/French community commands (`arckit-claude/commands/{eu-,fr-}*.md`) pointing to authoritative regulatory sources — EUR-Lex, ANSSI, CNIL, EDPB, ENISA, MITRE (#321)
- 18 new usage guides in `arckit-claude/docs/guides/{eu-,fr-}*.md` covering every EU/French community command. All guides carry `Guide Origin: Community` to preserve provenance. Each guide follows the standard ArcKit guide format: inputs table, command syntax, document structure, workflow, review checklist (#321)

### Changed

- Regenerated extension artefacts for the 18 community commands via `scripts/converter.py`

## [4.7.1] - 2026-04-19

### Fixed

- `/arckit.pages` was silently omitting the 18 v4.7.0 community-contributed type codes (RGPD, NIS2, AIACT, DORA, CRA, DSA, DATAACT, CNIL, SECNUM, MARPUB, DINUM, EBIOS, ANSSI, CARTO, DR, ALGO, PSSI, REUSE) from the rendered dashboard. The `update-manifest.mjs` hook correctly recorded the artifacts in `docs/manifest.json`, but the `/arckit.pages` prompt has its own hardcoded "Only include these known artifact types" allow-list that was missing the new codes. Added all 18 to `commands/pages.md` grouped by category (#317)

### Documentation

- `config/doc-types.mjs` — added a prominent `⚠️ DUAL REGISTRATION REQUIRED` warning at the top so future contributors know to update both `doc-types.mjs` and `pages.md` when adding new type codes (#317)

## [4.7.0] - 2026-04-19

### Added (Community-contributed)

> ⚠️ The 18 EU and French regulatory commands below are community-contributed and have not yet been validated against current ANSSI / CNIL / EU regulatory text. Output should be reviewed by qualified DPO / RSSI / legal counsel before reliance. Citations may lag the current source — verify before use. Domain maintainer: [@thomas-jardinet](https://github.com/thomas-jardinet) — auto-requested for review on `eu-*` / `fr-*` changes via `.github/CODEOWNERS`.

**EU regulations** (member-state-neutral):

- `/arckit.eu-rgpd` — GDPR (EU 2016/679) compliance assessment
- `/arckit.eu-nis2` — NIS2 Directive — operators of essential / important entities
- `/arckit.eu-ai-act` — EU AI Act (Regulation 2024/1689) — risk classification + conformity
- `/arckit.eu-dora` — DORA (EU 2022/2554) — financial sector ICT resilience
- `/arckit.eu-cra` — Cyber Resilience Act (Regulation 2024/2847) — products with digital elements
- `/arckit.eu-dsa` — Digital Services Act (Regulation 2022/2065) — platforms / VLOPs
- `/arckit.eu-data-act` — Data Act (Regulation 2023/2854) — connected products / DAPS

**French government** (apply on top of EU baseline):

- `/arckit.fr-secnumcloud` — SecNumCloud 3.2 qualification (sovereign cloud, OIV/OSE)
- `/arckit.fr-dinum` — RGI / RGAA / RGESN / RGS / doctrine cloud de l'État
- `/arckit.fr-marche-public` — Code de la commande publique procurement docs
- `/arckit.fr-rgpd` — CNIL-specific GDPR layer (cookies, HDS, age 15)
- `/arckit.fr-ebios` — EBIOS Risk Manager 5-workshop study (ANSSI)
- `/arckit.fr-anssi` — ANSSI Guide d'hygiène informatique (42 measures)
- `/arckit.fr-anssi-carto` — ANSSI IS cartography (4 reading levels)
- `/arckit.fr-dr` — Diffusion Restreinte handling (II 901/SGDSN/ANSSI)
- `/arckit.fr-algorithme-public` — Article L311-3-1 CRPA transparency notice
- `/arckit.fr-pssi` — Information System Security Policy per ANSSI/RGS
- `/arckit.fr-code-reuse` — Public code reuse (code.gouv.fr, SILL, EUPL)

### Added

- `.github/CODEOWNERS` — establishes domain ownership; @thomas-jardinet is auto-requested for review on `eu-*` / `fr-*` changes (#316)

### Fixed

- `validate-arc-filename.mjs` PreToolUse hook was blocking every Write call from the new EU and FR commands with exit code 2 ("Unknown document type code"). Registered all 18 codes (RGPD, NIS2, AIACT, DORA, CRA, DSA, DATAACT, CNIL, SECNUM, MARPUB, DINUM, EBIOS, ANSSI, CARTO, DR, ALGO, PSSI, REUSE) in `config/doc-types.mjs` — the single source of truth that all 6 ArcKit hooks import for display names and categorisation. The 7 EU commands shipped via #314 had been broken at the hook layer until #316 hotfixed them (#316)

## [4.6.13] - 2026-04-19

### Fixed

- `stale-artifact-scan` monitor (`scripts/bash/detect-stale-artifacts.sh`) failed with exit 1 in real ArcKit repos, terminating mid-loop after the first artifact. Root cause: the script sourced `common.sh` (whose `set -euo pipefail` leaked into the monitor), so any `grep | sed | tr` pipeline that returned no match would abort via the assignment. Removed the unused `source` line. Also rewrote the Document Control `Status` grep to handle bolded markdown (`| **Status** |`) and anchored it so it no longer matches unrelated `| status |` rows in entity-attribute tables. Reproduced and verified against `tractorjuice/arckit-test-project-v2-hmrc-chatbot` (was: 1 line + exit 1; now: 7 lines + exit 0) (#307)

## [4.6.12] - 2026-04-18

### Fixed

- Plugin manifest rejected by Claude Code v2.1.114 with `userConfig.*.type: Invalid option` and `userConfig.*.title: expected string, received undefined` errors. Added the now-required `title` (human-readable label shown in the enable-time prompt) and `type: "string"` to all five `userConfig` entries in `.claude-plugin/plugin.json` (#302). Without this fix the plugin fails to install on Claude Code v2.1.114+.

## [4.6.11] - 2026-04-18

### Added

- `keep-coding-instructions: true` (Claude Code v2.1.94+) on `requirements`, `research`, `sobc`, `datascout`, and `framework` commands. These long-running commands now keep their template and traceability instructions in context across `/compact`, preventing Claude from "forgetting" Document Control structure, requirement ID conventions, and citation patterns mid-run (#215, #301)

## [4.6.10] - 2026-04-18

### Added

- `monitors` key in `plugin.json` registering a `stale-artifact-scan` background monitor (Claude Code v2.1.105+). At session start, the plugin runs `scripts/bash/detect-stale-artifacts.sh` which scans `projects/` for artifacts with overdue `Next Review Date` or long-unchanged `DRAFT` status and emits one notification line per stale file. Exits silently when the cwd is not an ArcKit project (#215, #300)
- `scripts/bash/detect-stale-artifacts.sh` — one-shot scanner invoked by the new monitor. Caps output at 10 lines; appends a pointer to `/arckit.health` for the full list.

### Changed

- Autoresearch guide adds a "Watching progress without blocking the main session" paragraph recommending the built-in `Monitor` tool (v2.1.98+) for streaming overnight runs from a second session (#215, #300).

## [4.6.9] - 2026-04-18

### Added

- `version-check.mjs` SessionStart hook now also checks the running Claude Code client version and warns when below v2.1.112. Complements the pre-existing plugin self-update check; both warnings combine into a single `additionalContext` block when they fire together (#215, #299)

## [4.6.8] - 2026-04-18

### Added

- Plugin `userConfig` (Claude Code v2.1.83+) in `plugin.json` with 5 fields: `GOOGLE_API_KEY` and `DATA_COMMONS_API_KEY` (sensitive, stored in system keychain) for MCP authentication, plus `organisation_name`, `default_classification`, and `governance_framework` for Document Control defaults. Claude Code prompts once at enable time (#215, #298)

### Changed

- `arckit-claude/.mcp.json` now references `${user_config.GOOGLE_API_KEY}` and `${user_config.DATA_COMMONS_API_KEY}` instead of shell env vars. The converter rewrites these to `${KEY}` for non-Claude extensions so Codex/Gemini/OpenCode continue to read from the shell environment.

## [4.6.7] - 2026-04-18

### Added

- `/arckit.pages` now generates `docs/llms.txt` alongside `index.html` and `manifest.json`, following the [llmstxt.org](https://llmstxt.org/) standard so LLM agents and crawlers can efficiently discover and fetch every artifact, guide, and project in the repository. Uses `raw.githubusercontent.com` URLs for project markdown and relative paths for the site-local dashboard and guides. Protected by a generation marker (`<!-- Generated by ArcKit /arckit:pages -->`) — hand-curated `docs/llms.txt` files without the marker are preserved across re-runs.
- Document `ENABLE_PROMPT_CACHING_1H=1` (Claude Code v2.1.108+) recommendation in MCP setup and autoresearch guides for long ArcKit workflows and overnight optimisation runs (#215)
- `paths:` globs on all 4 plugin skills (`architecture-workflow`, `mermaid-syntax`, `plantuml-syntax`, `wardley-mapping`) for sharper auto-activation (v2.1.84+) — description keywords still trigger the skill when no matching files are in context (#215, #297)
- `if:` conditions (v2.1.85+) on `validate-arc-filename`, `score-validator`, and `update-manifest` hooks to narrow triggering to `projects/**` writes, eliminating unnecessary Node process spawns for unrelated file edits (#215, #297)

### Changed

- Bump minimum Claude Code version to v2.1.112 to unlock Opus 4.7 `xhigh` effort tier and Auto mode for deep-research agents and synthesis commands (#215)
- `CLAUDE.md` documents new command frontmatter (`keep-coding-instructions`, `xhigh`), agent frontmatter (`initialPrompt`), skill frontmatter (`paths:`), hook `if:` field syntax, and newer hook events (PostCompact, PreCompact, FileChanged, CwdChanged, TaskCreated, PermissionDenied)

## [4.6.6] - 2026-04-09

### Added

- Managed agent deployment — deploy any of the 10 ArcKit agents as Claude Managed Agents via the Anthropic API (`scripts/managed-agents/arckit-agent.py`) (#282)
- 3 MCP servers registered on managed agents with `always_allow` permission (AWS Knowledge, Microsoft Learn, govreposcrape)
- 4 custom skills uploaded to managed agents (architecture-workflow, mermaid-syntax, plantuml-syntax, wardley-mapping)

### Changed

- Bump minimum Claude Code version to v2.1.97 (#215)

## [4.6.5] - 2026-04-08

### Fixed

- Pages dashboard not showing global project documents from subdirectories (research, diagrams, decisions, wardley-maps, data-contracts, reviews)

## [4.6.4] - 2026-04-07

### Added

- `/arckit.grants` command — research UK grants, charitable funding, and accelerator programmes with eligibility scoring (#277)
- `arckit-grants` agent — autonomous web research across 7 categories of UK funding bodies including 360Giving/GrantNav
- `GRNT` document type and grants template with citation traceability

## [4.6.3] - 2026-04-06

### Added

- Document version badges in pages sidebar — every document shows its version (e.g., v1.0) with an inline dropdown selector when multiple versions of the same document exist
- Citation traceability for external documents — inline citation markers (`[DOC-CN]`) and structured "External References" section (#158, #207)
- Shared citation instructions file referenced by all 43 commands and 7 research agents

## [4.6.2] - 2026-04-05

### Added

- Mermaid `wardley-beta` test suite — 98% pass rate on 147 real-world maps, ArcKit syntax 100% valid (#271)
- Hooks documentation guide (`docs/guides/hooks.md`)

### Fixed

- Resolve 6 hook bugs and add hooks documentation (#271)
- Add `name` field to generated Codex agent `.toml` files — Codex CLI requires a non-empty name (#269)
- Flatten `[agents.roles.X]` to `[agents.X]` in Codex `config.toml` to prevent `roles` being misinterpreted as a malformed agent role (#269)
- Bump minimum Claude Code version to v2.1.90 across all documentation

## [4.6.1] - 2026-03-28

### Fixed

- Trim all 4 skill descriptions to under 250 characters for Claude Code v2.1.86 context cap (#215)

## [4.6.0] - 2026-03-24

### Changed

- All 9 agents now use `model: inherit` instead of hardcoded `sonnet` — agents use whatever model the user is running
- Added `effort: high` to 10 commands: analyze, dfd, diagram, gcloud-clarify, gcloud-search, impact, principles, principles-compliance, servicenow, story
- Autoresearch: effort and model are now tuneable parameters; plateau threshold increased to 15; results.tsv tracks effort/model

## [4.5.3] - 2026-03-24

### Fixed

- Update agent count from 6 to 9 and MCP server count from 4 to 5 in plugin README
- Update remote-control guide with correct command and agent counts
- Merge optimised gov agent prompts via autoresearch

## [4.5.2] - 2026-03-23

### Fixed

- Update command count from 64 to 67 in plugin.json description
- Update agent and hook counts in MCP servers guide

## [4.5.0] - 2026-03-23

### Added

- **govreposcrape MCP server** — Semantic search over 24,500+ UK government repositories (no API key required)
- `/arckit.gov-reuse` command and agent — Discover reusable UK government code before building from scratch
- `/arckit.gov-code-search` command and agent — Search UK government repositories using natural language queries
- `/arckit.gov-landscape` command and agent — Map the UK government code landscape for a domain
- Government Code Reuse Check step in `/arckit.research` agent — adds "Reuse Government Code" as 5th build-vs-buy option
- Government Code for Data Integration step in `/arckit.datascout` agent — discovers existing API client libraries
- Government Implementation Patterns step in AWS, Azure, and GCP research agents — checks for government precedent
- Document type codes: GOVR, GCSR, GLND with templates, guides, and quality checks
- GOVR, GCSR, GLND added to `/arckit.pages` artifact type list

## [4.4.0] - 2026-03-21

### Added

- Wardley map mathematical model metrics in commands and autoresearch
- Git worktree isolation for autoresearch
- Autoresearch guide for self-improving command prompts

### Fixed

- Sync guides between arckit-claude and docs directories

## [4.3.1] - 2026-03-18

### Added

- Mermaid `wardley-beta` dual output for Wardley map commands — generates both OWM syntax and Mermaid diagram blocks
- Mermaid wardley-beta examples added to mapping references
- Mermaid viewing guidance added to wardley and value chain guides
- Claude Code v2.1.78 agent frontmatter support (`effort`, `maxTurns`, `disallowedTools`) and `StopFailure` hook
- Mermaid special character escaping guidance for diagram command

### Fixed

- Missing component declaration for pipeline parent in Mermaid example

## [4.3.0] - 2026-03-16

### Added

- `/arckit.wardley.value-chain` command — Decompose user needs into value chains
- `/arckit.wardley.doctrine` command — Assess organizational doctrine maturity (4 phases, 40+ principles)
- `/arckit.wardley.gameplay` command — Analyze strategic plays from 60+ gameplay patterns with D&D alignment
- `/arckit.wardley.climate` command — Assess 32 climatic patterns across 6 categories
- Wardley reference files enriched from 3 Wardley Mapping books (doctrine, gameplays, climatic patterns)
- 4 new document types: WVCH, WDOC, WGAM, WCLM
- 4 new document templates and usage guides

### Fixed

- `wardley.md` hook reference corrected from `python3 .py` to `node .mjs`

## [4.2.11] - 2026-03-16

### Added

- Systems thinking foundations in framework command: Ashby's Law of Requisite Variety, Conant-Ashby Good Regulator Theorem, Gall's Law, and Conway's Law integrated into agent guidance, template, and quality checks
- Version check SessionStart hook: compares local plugin version against latest GitHub release and notifies users when an update is available

## [4.2.10] - 2026-03-15

### Added

- Add GitHub issue forms for bugs, features, and questions (#171)

### Fixed

- Correct 9 dependency matrix discrepancies from audit (#170)
- Wrap mermaid.run() in try-catch to prevent page crash on bad diagrams (#172)

## [4.2.4] - 2026-03-11

### Fixed

- Moved STORY doc type from Other to Planning category

## [4.2.3] - 2026-03-11

### Fixed

- Deduplicated cross-reference edges in dependency graph (e.g. 396 → ~40 edges for 14 nodes)

## [4.2.2] - 2026-03-11

### Fixed

- Dependency map always shows 000-global documents when filtering by project

## [4.2.1] - 2026-03-11

### Fixed

- Dependency map layout now wraps nodes into grid rows (max 8 columns) instead of one long row per category
- Fixed null element ID (`doc-content` → `content`) crash when opening dependency map
- Fixed null `type`/`project` crash in dependency map node sorting
- Filtered `.gitkeep` and `README.md` from vendor docs and tech notes in manifest

## [4.2.0] - 2026-03-11

### Added

- Interactive dependency map visualization in pages dashboard (`#dependency-map` route)
- Shared `graph-utils.mjs` module extracted from `impact-scan.mjs` for graph-building logic
- Dependency graph data (`dependencyGraph`) added to `manifest.json` via `sync-guides.mjs`
- "Document Map" nav link in dashboard header with SVG rendering, category-layered layout, hover/click interactions, project filtering, and orphan detection

### Fixed

- Explicit UTF-8 encoding on all Python file I/O operations to prevent encoding issues on non-English systems

## [4.1.1] - 2026-03-11

### Added

- `/arckit.impact` command for blast radius analysis and reverse dependency tracing
- `impact-scan.mjs` hook for dependency graph pre-processing
- `/arckit.search` command for keyword, type, and requirement ID search across all project artifacts
- `/arckit.score` command for structured vendor scoring with JSON storage, comparison, sensitivity analysis, and audit trail
- Session learner skill for capturing and replaying session insights

## [4.0.2] - 2026-03-08

### Added

- `/arckit.framework` command for transforming architecture artifacts into a structured, reusable framework (agent-delegating via arckit-framework agent)
- `/arckit.glossary` command for generating comprehensive project glossary with terms, definitions, acronyms, and cross-references
- `/arckit.maturity-model` command for generating capability maturity model with current-state assessment, target-state definition, and improvement roadmap
- `arckit-framework` agent for autonomous framework synthesis from architecture artifacts
- Missing guides for `dfd`, `health`, and `init` commands
- `dfd` command added to DEPENDENCY-MATRIX with row and column

### Fixed

- Framework command referenced wrong template filename (`framework-template.md` → `framework-overview-template.md`)
- Stale command counts (53 → 57) across all docs, guides, commands.html, and extension copies
- Stale agent counts (5 → 6) in MCP servers and remote control guides

## [3.1.1] - 2026-03-05

### Fixed

- Improve skill descriptions and resolve content issues across all 4 plugin skills (#123)

### Changed

- Add .worktrees/ to gitignore

## [3.1.0] - 2026-03-05

### Added

- **Architecture Workflow process skill** — new `architecture-workflow` skill in `arckit-claude/skills/` that guides users through project onboarding with adaptive-depth questions and tailored command sequence recommendations
- 5 workflow path reference files: standard (private sector), UK Government, Defence, AI/ML modifier, Data platform modifier
- Patterns borrowed from Claude Code brainstorming skill: HARD-GATE, anti-patterns, one-question-at-a-time, adaptive depth

### Changed

- `/arckit:start` command refactored from 189-line inline logic to 21-line thin wrapper delegating to the architecture-workflow skill

## [3.0.9] - 2026-03-03

### Added

- **Governance scan pre-processor hook** (`governance-scan.mjs`) — pre-extracts all artifact metadata, requirements, principles, risks, cross-references, vendor data, and placeholder counts for `/arckit:analyze`, eliminating 20-40 Read tool calls
- Three new shared functions in `hook-utils.mjs`: `extractRequirementDetails`, `extractPrinciples`, `extractRiskEntries`
- Hook-aware shortcut preamble in `analyze.md` — skips Steps 1-2 when pre-extracted data is present

### Changed

- `extractRequirementDetails` moved from `traceability-scan.mjs` to shared `hook-utils.mjs` — no behavioral change, same function in shared location

## [3.0.8] - 2026-03-03

### Changed

- **Shared hook-utils module** — extracted 11 utility functions (`isDir`, `isFile`, `readText`, `listDir`, `mtimeMs`, `findRepoRoot`, `extractDocType`, `extractVersion`, `extractDocControlFields`, `extractRequirementIds`, `parseHookInput`) into `hook-utils.mjs`; updated 9 hooks to import from it, removing ~240 lines of duplicate code
- `COMPOUND_TYPES` now derived dynamically from `config/doc-types.mjs` instead of hardcoded — new compound doc types propagate automatically to all hooks

## [3.0.7] - 2026-03-03

### Added

- `/arckit.template-builder` command — interactive template builder that creates community-origin templates, guides, and optional shareable bundles through a 2-round interview process
- Three-tier origin model for templates and guides: Official, Custom, and Community with distinct banners
- Community guide discovery in `sync-guides.mjs` — scans `.arckit/guides-custom/` and includes community guides in the pages manifest under "Community" category
- `community.` prefix convention for user-generated slash commands
- Diagram quality gate v2 — element count thresholds per diagram type with split strategies, layout direction decision table (LR vs TB), expanded 9-criteria quality gate (was 6), per-criterion remediation table, and iterative review loop (max 3 iterations)

### Fixed

- **Wardley Maps, Data Contracts, Research, and Reviews missing from pages** — added all four doc types to sidebar navigation, search index, and dashboard counting in the pages template; added stats to the hook summary output
- **.gitkeep files leaked into manifest** — dotfiles in `external/` and `policies/` directories were included in the manifest scan; now filtered out
- **Stale statistics in docs/index.html** — updated document and command counts

### Changed

- All 50 official templates updated: `Template Status: <status>` replaced with `Template Origin: Official` banner
- All official guides updated with `Guide Origin: Official` banner after the first heading
- `/arckit:customize` now sets `Template Origin: Custom` banner when copying templates

## [2.22.5] - 2026-03-01

### Fixed

- **Template status line showed ambiguous Version label** — renamed `**Version**: [VERSION]` to `**ArcKit Version**: [VERSION]` on the status blockquote line across all 50 templates so AI correctly fills the ArcKit version instead of the document version
- **Tech-note and vendor-profile templates missing status line** — added the `> **Template Status**: Live | **ArcKit Version**: [VERSION] | **Command**: ...` blockquote to align with the other 48 templates
- **Health command always writes docs/health.json** — ensures dashboard integration works even when docs directory already exists

## [2.22.4] - 2026-03-01

### Fixed

- **Traceability hook missed FR and NFR requirements** — heading regex only matched h3 (`###`) but the requirements template uses h4 (`####`) for FR, NFR, INT, and DR sections; now matches both levels. Also changed the fallback from all-or-nothing to always-merge so regex-extracted IDs supplement heading matches instead of being silently skipped

## [2.22.3] - 2026-03-01

### Fixed

- **Pages directory tree** — moved RSCH from project root to `research/` subdirectory; added all 5 research types (RSCH, DSCT, AWRS, AZRS, GCRS) with sequence numbers to the directory tree
- **Health example filenames** — updated RSCH examples from `ARC-001-RSCH-v1.0.md` to `research/ARC-001-RSCH-001-v1.0.md`
- **Context hook missing vendor profiles and tech notes** — `arckit-context.mjs` now lists flat vendor profile files (`*-profile.md`) alongside vendor subdirectories, and scans `tech-notes/` directory so spawned knowledge from research is visible in project inventory

## [2.22.2] - 2026-03-01

### Fixed

- **Agent version detection Glob patterns** — all 5 research agents now include sequence number wildcard (`*-v*.md`) in Glob patterns for version detection, matching the multi-instance filename format (e.g., `ARC-001-RSCH-001-v1.0.md`)
- **Missing `research/` in Glob paths** — arckit-research and arckit-datascout version detection now searches `research/` subdirectory, matching where documents are actually written
- **Step numbering gaps** — fixed Step 11b → Step 11 in arckit-research (after 11a removal), fixed Step 17 → Step 16 in arckit-datascout (missing step)

## [2.22.1] - 2026-03-01

### Fixed

- **Removed VERSION file reads from 5 agents** — arckit-research, arckit-datascout, arckit-aws-research, arckit-azure-research, and arckit-gcp-research no longer instruct the agent to read `${CLAUDE_PLUGIN_ROOT}/VERSION`; the ArcKit version is already provided via the `arckit-context` SessionStart hook, eliminating unnecessary file reads (and failed `echo $CLAUDE_PLUGIN_ROOT` attempts)
- **Removed VERSION file read from start command** — `/arckit:start` now uses the ArcKit version from context instead of reading the VERSION file

## [2.22.0] - 2026-03-01

### Added

- **Centralized doc type config** — single source of truth (`config/doc-types.mjs`) for all 49 document type codes, categories, multi-instance types, and subdirectory mappings. Replaces duplicated data across 5 hooks/templates
- **Research subdirectory routing** — all research types (RSCH, AWRS, AZRS, GCRS, DSCT) now auto-route to `research/` with sequence numbers (e.g., `ARC-001-RSCH-001-v1.0.md`)
- **`typeCategories` in manifest.json** — pages-template.html reads type-to-category mappings from the manifest instead of hardcoding them, staying in sync with the central config
- **New doc type codes** — GAPS (Gap Analysis, Governance), VEND (Vendor Evaluation, Procurement) added with full metadata

### Fixed

- **HLD/DLD example filenames** — `ARC-001-HLD` → `ARC-001-HLDR`, `ARC-001-DLD` → `ARC-001-DLDR` in hld-review and dld-review commands
- **DMC subdirectory** — `data-mesh-contracts/` → `data-contracts/` in data-mesh-contract command (4 occurrences)
- **DSCT category** — standardized to Discovery (was inconsistent between hooks)
- **PLAT category** — standardized to Architecture (was inconsistent between hooks)
- **DFD missing from pages** — added to type categories

### Changed

- **Hooks import from config** — validate-arc-filename, arckit-context, sync-guides, and update-manifest now import `DOC_TYPES`, `SUBDIR_MAP`, `KNOWN_TYPES`, `MULTI_INSTANCE_TYPES` from `config/doc-types.mjs` instead of defining inline copies
- **Subdirectory scan lists derived from config** — arckit-context, sync-guides, and update-manifest derive their subdirectory scan lists from `SUBDIR_MAP` instead of hardcoding them
- **Agents use inline filenames** — removed `generate-document-id.py` calls from all 5 research agents; they now use inline filename patterns and write directly to `research/`, with the PreToolUse hook as safety net

---

## [2.21.3] - 2026-03-01

### Fixed

- **Hook context not reaching Claude** — all 4 UserPromptSubmit hooks used `systemMessage` (which per docs is only "shown to user") instead of `additionalContext` (which is "added to Claude's context"). This caused Claude to ignore hook-injected instructions like "do not call tools" and redundantly read manifest.json. Switched to `hookSpecificOutput.additionalContext` in sync-guides, health-scan, traceability-scan, and arckit-context
- **Async hooks deliver context one turn late** — `arckit-context.mjs` and `arckit-session.mjs` had `"async": true`, meaning their `additionalContext` arrived on the next conversation turn instead of the current one. Removed async flag — both are fast filesystem scans that complete in < 1 second
- **Research stats missing from pages output** — added Research row to the stats table in sync-guides.mjs

---

## [2.21.2] - 2026-03-01

(Superseded by 2.21.3 — async fix was added after tagging)

---

## [2.21.1] - 2026-03-01

### Added

- **PostToolUse manifest hook** — `update-manifest.mjs` incrementally updates `docs/manifest.json` after every ARC file write, keeping the manifest current without re-running `/arckit:pages`

### Fixed

- **Research files missing from manifest** — cloud research agents (aws-research, azure-research, gcp-research) write to `projects/*/research/` but `sync-guides.mjs` didn't scan that subdirectory. Added `research` to the subdirMap. Affected at least 3 test repos (v7, v17, v18)
- **UserPromptSubmit hooks read wrong field name** — all 5 hooks read `data.user_prompt` but the documented API field is `data.prompt`. Hooks silently got an empty string and exited. Fixed in arckit-context, sync-guides, health-scan, traceability-scan, and secret-detection
- **Hook guards reject Skill-expanded body** — `^` anchors on `isExpandedBody` regex failed when the Skill tool prefixed/wrapped the expanded command body. Removed anchors; unique `description:` strings prevent false positives. Also discovered that `UserPromptSubmit` matchers in hooks.json are silently ignored per the docs — the internal guard is the sole gating mechanism

---

## [2.21.0] - 2026-03-01

### Added

- **Traceability pre-processor hook** — automatically extracts requirements from project artifacts and computes coverage metrics before the traceability command runs

---

## [2.20.5] - 2026-02-28

### Fixed

- **Health hook fires for unrelated commands** — the `hooks.json` substring matcher triggers on any expanded command body that mentions `/arckit:health` or `/arckit:pages` (e.g. conformance, start, customize). Replaced naive regex guards with smart guards that match either the raw slash command or the Skill-expanded body's unique opening text (frontmatter description or heading). Applies to both `sync-guides.mjs` and `health-scan.mjs`.

---

## [2.20.4] - 2026-02-28

### Fixed

- **Pages command ignores hook stats and reads manifest** — removed all tools from `allowed-tools` (was `Read, Glob, Grep`), reformatted hook stats as a markdown table with explicit heading, and added triple-layered "do not call any tools" instructions to prevent the AI from second-guessing the hook's output.

---

## [2.20.3] - 2026-02-28

### Fixed

- **Hooks fail via Skill tool** — removed redundant `user_prompt` regex guards from `sync-guides.mjs` and `health-scan.mjs`. The `hooks.json` matcher already gates each hook; the internal guard silently aborted when the Skill tool passed the expanded command body instead of the raw slash command.

---

## [2.20.2] - 2026-02-28

### Fixed

- **ANAL files missing from pages manifest** — removed Write from `/arckit:pages` allowed-tools so the AI cannot overwrite the hook-generated manifest; strengthened instruction to skip all tool use. Fixed ANAL category mismatch: `sync-guides.mjs` and `pages.md` reference table now map ANAL to Governance (matching `pages-template.html`).

---

## [2.20.1] - 2026-02-28

### Fixed

- **Analysis report type code** — standardized `ANLZ` → `ANAL` across all commands (analyze, health, story, service-assessment) and guides. Files named `ARC-*-ANLZ-*.md` were invisible to the manifest scanner and health hook because metadata tables only recognized `ANAL`.

---

## [2.20.0] - 2026-02-28

### Added

- **Health pre-processor hook** (`health-scan.mjs`) — new `UserPromptSubmit` hook pre-extracts all artifact metadata and applies all 7 detection rules (STALE-RSCH, FORGOTTEN-ADR, UNRESOLVED-COND, ORPHAN-REQ, MISSING-TRACE, VERSION-DRIFT, STALE-EXT) in Node.js, eliminating 20-50+ Read tool calls. The `/arckit:health` command now just formats the console output from hook findings.

---

## [2.19.0] - 2026-02-28

### Added

- **Pages pre-processor hook** — the `sync-guides` hook now handles the entire `/arckit:pages` pipeline (guide sync, title extraction, repo info, template processing, project scanning, manifest generation), reducing the command from ~310 tool calls to zero. The 134KB HTML template and ~95 guide files never enter the context window.

---

## [2.18.0] - 2026-02-28

### Added

- **Guide sync hook** (`sync-guides.mjs`) — new `UserPromptSubmit` hook replaces ~190 Read+Write tool round-trips in `/arckit:pages` with native `fs.copyFileSync`, mtime-based smart skipping, zero tool calls

---

## [2.17.0] - 2026-02-28

### Added

- **Tiered deviation classification** for conformance assessment — GREEN/YELLOW/RED tiers overlay on PASS/FAIL system, classifying FAIL findings by actionability: RED (escalate), YELLOW (negotiate), GREEN (acceptable) (#95)
- **Conversational gathering rules** (max 2 rounds) added to 15 commands for structured user input collection (#94)
- **STANDALONE/SUPERCHARGED degradation** for cloud research commands — graceful fallback when MCP servers are unavailable (#93)

---

## [2.16.0] - 2026-02-28

### Added

- **Quality checklist** (`references/quality-checklist.md`) — shared artifact verification with 10 common checks and 47 per-type checks keyed by document type code; introduces `references/` directory pattern (#92)
- **`argument-hint` frontmatter** on all 53 plugin commands — IDE-visible hints for required arguments

---

## [2.15.1] - 2026-02-28

### Added

- **`allowed-tools` frontmatter** on all 53 plugin commands — explicit tool permissions per command for tighter security and predictability

### Fixed

- Replace Python script calls (`create-project.py`, `generate-document-id.py`, `list-projects.py`) with inline Glob/Write instructions in 20 commands — commands no longer shell out to scripts
- Remove `Bash` from `allowed-tools` in 50 commands that don't need it (down from 53 to only 3: `story`, `init`, `trello`)
- Markdown lint CI now recurses into subdirectories correctly
- Suppress MD038 false positive for intentional space-in-code-span in DEPENDENCY-MATRIX.md

---

## [2.15.0] - 2026-02-28

### Added

- **Markdown linting CI** — markdownlint-cli2 configuration and GitHub Actions workflow enforcing consistent formatting across 571 markdown files; skills override for third-party reference docs

### Fixed

- Trailing whitespace, missing blank lines around headings/lists/fences, bare code fences, emphasis style inconsistencies across all commands, templates, guides, and agents

---

## [2.14.0] - 2026-02-28

### Added

- **Handoffs frontmatter** — 16 plugin commands now declare `handoffs:` in YAML frontmatter for machine-readable workflow navigation (requirements, stakeholders, risk, sobc, research, datascout, data-model, wardley, adr, sow, roadmap, aws/azure/gcp-research, strategy, backlog)
- **Release automation** — `scripts/generate-release-notes.sh` parses git log into Keep a Changelog sections; `.github/workflows/release.yml` creates GitHub Releases on tag push
- **Version automation** — `scripts/bump-version.sh` updates all 11 version files in one command

### Changed

- **Converter uses PyYAML** — `extract_frontmatter_and_prompt()` now uses `yaml.safe_load()` instead of regex, enabling parsing of complex frontmatter fields like `handoffs:`
- **Converter renders handoffs** — `render_handoffs_section()` appends a `## Suggested Next Steps` section to Codex/OpenCode/Gemini output for commands with handoffs
- **Config-driven converter** — refactored `scripts/converter.py` to use `AGENT_CONFIG` dictionary; adding a new AI target only requires a new dict entry

---

## [2.13.2] - 2026-02-28

### Fixed

- **Node.js hooks** — rewrote all 7 plugin hooks from Python to Node.js (.mjs) for Windows compatibility; `python3` doesn't exist on Windows but Node.js is guaranteed on every Claude Code installation (#86)
- Deleted 8 legacy `.py` hook files and 5 legacy `.sh` hook files (13 files removed)
- Added `async: true` to non-blocking hooks (arckit-session, arckit-context) for faster session start
- Version bump across all distribution formats

---

## [2.13.1] - 2026-02-27

### Fixed

- **Cross-platform commands** — removed bash-only patterns (`ls|sort|tail`, `mkdir -p`, `basename`, `sed`, `xargs`) from 7 commands (adr, customize, data-mesh-contract, init, pages, trello, wardley) replacing with Glob/Read/Write tool instructions
- **Cross-platform agents** — replaced `ls|sort -V|tail` version detection with Glob instructions and `generate-document-id.sh` references with `.py` across all 5 agents (research, aws-research, azure-research, gcp-research, datascout)
- **Wardley hook** — changed from bash to python3 for validate-wardley-math hook
- **Trello command** — added Windows PowerShell alternatives for environment variable checks
- **Migration guide** — added platform note that migrate-filenames.sh requires bash (Git Bash / WSL on Windows)
- Regenerated all Codex/OpenCode/Gemini formats via converter

---

## [2.13.0] - 2026-02-27

### Added

- **NCSC Vulnerability Monitoring Service (VMS)** — `/arckit:secure` now assesses VMS enrollment in CAF C2 and includes a VMS Integration subsection (Section 6.1) with 8-day domain / 32-day general remediation benchmarks
- **Cyber Action Plan Alignment** (Section 9.4) — `/arckit:secure` template tracks departmental alignment with the £210m cross-government Cyber Action Plan across four pillars (Skills, Tooling, Resilience, Collaboration)
- **Government Cyber Security Profession** (Section 11) — `/arckit:secure` template assesses CCP certification, DDaT role mapping, Cyber Academy engagement, and workforce development planning
- **Structured vulnerability management** — `/arckit:operationalize` Section 11 expanded with 11.3 Vulnerability Scanning (VMS integration), 11.4 Remediation SLAs (severity-based + VMS benchmarks), and 11.5 Patch Management
- **Critical Vulnerability Remediation runbook** (6.7) — `/arckit:operationalize` template includes full runbook for critical CVEs and VMS alerts

### Changed

- `/arckit:secure` GovS 007 mapping updated: principle 5 (Security culture) references Cyber Security Profession, principle 8 (Continuous improvement) references Cyber Action Plan
- `/arckit:operationalize` handover checklist and NCSC guidance sections include VMS enrollment items
- Version bump across all distribution formats

---

## [2.12.3] - 2026-02-26

### Changed

- **Pages header: Repository icon** — replaced "Repository" text link with a GitHub icon positioned next to the dark/light mode toggle
- **Pages header: version badge** — added ArcKit version badge (`v{{VERSION}}`) to the header menu, populated from the plugin's VERSION file via new `{{VERSION}}` placeholder
- Version bump across all distribution formats

---

## [2.12.2] - 2026-02-26

### Fixed

- **Pages template: GitHub Pages fallback** (#80) — relative paths (`../`) don't work on GitHub Pages because only the `/docs` folder is published; template now tries relative paths first (works for local/full-repo hosting), then falls back to `raw.githubusercontent.com` (works for GitHub Pages public repos)
- **New `{{CONTENT_BASE_URL}}` placeholder** — `/arckit:pages` command sets this to the raw.githubusercontent.com base URL for GitHub repos, enabling the fallback; non-GitHub hosting can set it to empty string

### Changed

- Version bump across all distribution formats

---

## [2.12.1] - 2026-02-26

### Changed

- **Pages template: relative paths instead of GitHub raw URLs** (#79) — `docs/index.html` now loads documents via `../${path}` relative paths instead of `raw.githubusercontent.com`, making the site deployable to any static hosting provider (GitHub Pages, Netlify, Vercel, S3, etc.)
- **Pages command: hosting-agnostic language** (#79) — description and summary updated from "GitHub Pages" to generic "documentation site" terminology with multi-provider deployment instructions
- **Pages error handling: safe DOM methods** (#79) — error display refactored from innerHTML to safe DOM construction (`createElement`/`textContent`), simplified to generic "Document not found" message
- Version bump across all distribution formats

---

## [2.12.0] - 2026-02-26

### Added

- **STALE-EXT detection rule for `/arckit:health`** (#77) — 7th detection rule flags external files in `external/` that are newer than a project's latest artifact, with filename-to-command mapping (e.g., `*api*` → `/arckit:requirements`, `/arckit:data-model`, `/arckit:diagram`) for targeted remediation
- **SessionStart hook external file detection** (#77) — auto-detects new external files at session start and reports them in context with project name and file count
- **UserPromptSubmit hook external file flagging** (#77) — context hook now marks external files as `(**NEW** — newer than latest artifact)` when they are newer than the project's most recent ARC-* artifact
- **PlantUML Syntax Reference skill** (`plantuml-syntax`) (#78) — 10 reference files covering C4-PlantUML (with layout conflict rules), sequence diagrams, class diagrams, activity diagrams, state diagrams, ER diagrams, component diagrams, use case diagrams, common syntax errors, and styling guide
- **C4-PlantUML layout conflict rules** (#78) — explicit rules preventing `Rel_Down`/`Lay_Right` contradictions: directional consistency, vertical consistency, all-pairs agreement, and coverage requirements with validation checklist
- **Format-specific syntax loading in `/arckit:diagram`** (#78) — Step 1d now conditionally loads PlantUML or Mermaid references based on selected output format; PlantUML format loads `c4-plantuml.md` with layout conflict rules
- **Mermaid ERD syntax rules in `/arckit:diagram`** (#78) — explicit rules preventing invalid `PK_FK` key type (must use `PK, FK` comma-separated); loads `entityRelationshipDiagram.md` reference for ER content

### Changed

- Version bump across all distribution formats

---

## [2.11.0] - 2026-02-26

### Added

- **`/arckit.start` onboarding command** — guided entry point with project detection, tool survey, command decision tree, and context-aware workflow routing
- **Mermaid Syntax Reference skill** (`mermaid-syntax`) — 30 official Mermaid syntax reference files (auto-synced from [WH-2099/mermaid-skill](https://github.com/WH-2099/mermaid-skill)) covering all 23 diagram types plus configuration and theming, bundled with ArcKit's existing C4 layout science reference
  - 10 Mermaid-generating commands (`diagram`, `roadmap`, `plan`, `story`, `dfd`, `backlog`, `strategy`, `presentation`, `data-model`, `jsp-936`) now read type-specific syntax references before generating Mermaid code
  - Conversational skill triggers on Mermaid syntax questions (e.g., "what Mermaid diagram types can I use?", "gantt chart date format")

### Changed

- **Getting Started guide** now covers both `/arckit.start` and `/arckit.init` in a single combined guide with a quick-start section, replacing the previous start-only guide
- **GitHub Pages Getting Started section** updated with new steps 4 (`/arckit.start`) and 5 (`/arckit.init`) before the GDS phases workflow
- **`/arckit.pages` command** — added 5 missing guides to category and status tables: `start`, `conformance`, `productivity`, `remote-control`, `mcp-servers`
- Moved `c4-diagram-reference.md` from `templates/` to `skills/mermaid-syntax/references/c4-layout-science.md` — `/arckit.diagram` Step 1d path updated
- Version bump across all distribution formats

---

## [2.10.0] - 2026-02-25

### Added

- **DDaT Role Guides** (#75) — 18 new role-based guides mapping ArcKit commands to [UK Government DDaT Capability Framework](https://ddat-capability-framework.service.gov.uk/) roles, so users can find the commands relevant to their job
  - **Architecture** (7): Enterprise Architect, Solution Architect, Data Architect, Security Architect, Business Architect, Technical Architect, Network Architect
  - **Chief Digital and Data** (3): CTO/CDIO, CDO, CISO
  - **Product and Delivery** (4): Product Manager, Delivery Manager, Business Analyst, Service Owner
  - **Data** (2): Data Governance Manager, Performance Analyst
  - **IT Operations** (1): IT Service Manager
  - **Software Development** (1): DevOps Engineer
- Each guide includes primary commands, secondary commands, typical workflow, key artifacts, and related roles
- **"Roles" nav link** in GitHub Pages template — new top-level navigation alongside Dashboard and Guides
- `showRolesIndex()` function in pages template — renders role guides grouped by DDaT family with command counts
- Role guides added to search index in pages template
- `roleGuides` array in `manifest.json` schema — separate from command guides
- Updated `/arckit.pages` command to sync and index role guides from `docs/guides/roles/`

### Changed

- Version bump across all distribution formats

---

## [2.9.0] - 2026-02-25

### Added

- **Architecture Conformance Assessment** (`/arckit.conformance`) (#55) — new command for systematic decided-vs-designed conformance checking with 12 conformance rules: ADR decision implementation, cross-ADR consistency, superseded ADR enforcement, principles-to-design alignment, review condition resolution, exception register expiry/remediation, technology stack drift, architecture pattern drift, custom constraint rules (ArchCNL-style via `.arckit/conformance-rules.md`), known and untracked architecture technical debt
- New template: `conformance-assessment-template.md`
- New guide: `conformance.md`
- New doc type code: `CONF` (added to filename validation hook and context hook)
- Added `CONF` migration entry to `migrate-filenames.sh`
- Updated DEPENDENCY-MATRIX.md with conformance row/column and critical paths

### Changed

- Version bump across all distribution formats

---

## [2.8.8] - 2026-02-25

### Fixed

- **Markdown escaping for `<` and `>` in generated documents** (#67) — added instruction to all 49 document-generating commands and 5 agents to space-separate less-than/greater-than comparisons (e.g., `< 3 seconds` instead of `<3 seconds`) so markdown renderers don't misinterpret them as HTML tags or emoji
- Fixed unescaped `<` examples in `requirements.md` and `servicenow.md`

### Changed

- Version bump across all distribution formats

---

## [2.8.7] - 2026-02-25

### Added

- **PlantUML rendering in Pages** — `pages-template.html` now renders ` ```plantuml ``` ` code blocks as SVG diagrams via the PlantUML server (`plantuml.com/plantuml/svg/`), with interactive pan/zoom controls, dark mode support (CSS invert filter), fullscreen, scroll-to-zoom, keyboard shortcuts, and error fallback; no new JS dependencies required

### Changed

- Version bump across all distribution formats (CLI, plugin, Gemini extension, OpenCode extension, marketplace)

---

## [2.8.6] - 2026-02-25

### Fixed

- **Mermaid label compatibility for presentations** (#73, #70) — added ASCII-only, no-hyphens, no-special-characters rules to `/arckit.presentation` command, template, and guide; Mermaid's parser breaks on accented characters (é, í, ó) and hyphens in `quadrantChart` data point labels
- **Diagram command UX** (#71, #65) — `/arckit.diagram` now asks both diagram type and output format in a single `AskUserQuestion` call instead of sequentially; skip rules clarified for partial arguments

### Added

- **Mermaid Compatibility section** in presentation guide — documents label restrictions with troubleshooting advice
- **OpenCode extension guides** — MCP servers setup guide and Architecture Productivity Guide synced to OpenCode extension

### Changed

- Version bump across all distribution formats (CLI, plugin, Gemini extension, OpenCode extension, marketplace)

---

## [2.8.5] - 2026-02-24

### Added

- **PlantUML C4 output format for `/arckit.diagram`** (#65) — C4 diagram types (Context, Container, Component) now offer PlantUML C4 as an alternative to Mermaid, with directional layout hints (`Rel_Right`, `Rel_Down`, `Lay_Right`, `Lay_Down`) for precise control on complex diagrams with more than 12 elements
- **Format selector** — interactive prompt (Question 2) lets users choose Mermaid or PlantUML C4 for C4 types; skip with `/arckit.diagram context plantuml`
- **PlantUML C4 examples** — Modes A, B, C include PlantUML examples alongside Mermaid
- **PlantUML syntax guidelines** — include URLs, element syntax, directional relationships, invisible layout constraints
- **PlantUML validation checks** — Step 5 validates directional variants, `Lay_Right`/`Lay_Down` constraints, `@startuml`/`@enduml` wrappers
- **Template PlantUML section** — architecture diagram template includes PlantUML code block, syntax reference, and directional hints quick-reference table
- **Guide update** — diagram guide includes format comparison table (Mermaid vs PlantUML) and PlantUML example
- **Platform support documentation** (#71) — README and docs/index.html note that ArcKit targets Linux, with devcontainer/WSL2 recommended for Windows
- **Pages template support for `/arckit:customize`** (#72) — users can now customize the pages HTML template

### Changed

- Version bump across all distribution formats (CLI, plugin, Gemini extension, OpenCode extension, marketplace)

---

## [2.8.4] - 2026-02-24

### Added

- **Interactive zoom/pan for Mermaid diagrams** — scroll to zoom, drag to pan, double-click to zoom in, toolbar controls (zoom-in, zoom-out, reset, fullscreen), keyboard shortcuts (`+`/`-`/`0`/`f`/`Escape`), and touch pinch-to-zoom via svg-pan-zoom library
- **Diagram fullscreen mode** — expand any diagram to a full-screen overlay with `f` key or toolbar button
- **Accessible diagram controls** — focusable viewports with ARIA labels, keyboard navigation, always-visible controls on mobile/touch devices

### Changed

- Version bump across all distribution formats

---

## [2.8.3] - 2026-02-20

### Added

- **Dark mode for pages template** — CSS-variable-driven dark theme with sun/moon toggle in header, system preference detection (`prefers-color-scheme`), and localStorage persistence
- **Auto-sync guides from plugin** — `/arckit:pages` now copies all guides from the plugin to `docs/guides/` before scanning, ensuring repos always have the latest guides
- **4 missing guides synced to plugin** — `artifact-health`, `c4-layout-science`, `knowledge-compounding`, `security-hooks`

### Changed

- Replaced ~35 hardcoded colour values in pages template with semantic CSS variables
- Mermaid diagrams switch between default/dark theme based on mode
- SVG donut chart text colour reads from CSS variable for dark mode compatibility
- Version bump across all distribution formats

---

## [2.8.2] - 2026-02-20

### Added

- **Health dashboard panel in `/arckit:pages`** — pages template loads `docs/health.json` (when present) and renders an Artifact Health panel with severity bars, findings-by-type breakdown, and a per-project Health column with traffic-light colours
- **`JSON=true` flag for `/arckit:health`** — writes machine-readable `docs/health.json` for dashboard integration alongside the console report

### Fixed

- **All 64 guides now listed in pages command** — added 19 missing guides to category/status tables and corrected status discrepancies (sow/evaluate/customize → live, pages → alpha per README)

### Changed

- Version bump across all distribution formats

---

## [2.8.1] - 2026-02-20

### Added

- **Vendor profiles & tech notes in `/arckit:pages`** — pages command and HTML template now discover, index, and display vendor profiles (`vendors/*-profile.md`) and tech notes (`tech-notes/*.md`) with search, dashboard metrics, Knowledge column, and sidebar navigation (#62)

### Changed

- Version bump across all distribution formats

---

## [2.8.0] - 2026-02-20

### Added

- **Knowledge compounding from research** — research agent now spawns standalone vendor profiles and tech notes from research findings, extracting reusable knowledge that persists beyond the originating project
- New `vendor-profile-template.md` and `tech-note-template.md` templates for spawned knowledge files
- `--no-spawn` flag for `/arckit.research` to skip knowledge compounding when only the main research document is needed
- Documentation: `docs/guides/knowledge-compounding.md` explaining the compound knowledge pattern, deduplication, and directory structure
- **`/arckit:health` command** — scans all projects for stale research, forgotten ADRs, unresolved review conditions, orphaned artifacts, missing traceability, and version drift
- Documentation: artifact-health guide
- **Security hooks** — three new hooks for secret and sensitive file protection:
  - `file-protection.py` — blocks edits to sensitive files (environment files, credentials, private keys, lock files) with configurable exception lists
  - `secret-detection.py` — scans user prompts for potential secrets (API keys, tokens, passwords, connection strings) before they reach the model
  - `secret-file-scanner.py` — scans file content being written for embedded secrets with skip patterns for documentation files
- Documentation: `docs/guides/security-hooks.md` — three-layer protection model guide
- **C4 layout science reference template** — `c4-diagram-reference.md` with research-backed graph drawing guidance: Sugiyama algorithm, tier-based declaration ordering, edge crossing targets (Purchase et al.), C4 colour standards, node shape reference, PlantUML directional hints, prompt antipatterns, and iterative refinement process
- **Diagram quality gate** — structured 6-criterion validation checklist added to `/arckit:diagram` command (edge crossings, visual hierarchy, grouping, flow direction, traceability, abstraction level)
- **C4 layout science guide** — `docs/guides/c4-layout-science.md` standalone reference for C4 diagram best practices

### Changed

- Version bump across all distribution formats

---

## [2.7.1] - 2026-02-20

### Added

- **Wardley Map validation Stop hook** — new `validate-wardley-math.sh` hook fires on Stop for the `/arckit.wardley` command, validating stage-evolution alignment, coordinate ranges [0,1], and OWM code block consistency against Component Inventory tables; blocks stop with actionable error details on failure

### Changed

- Version bump across all distribution formats

---

## [2.7.0] - 2026-02-19

### Added

- **UK Government Cyber Security Standard integration** — `/arckit.secure` template now includes three new sections for CSS compliance (July 2025, Cabinet Office):
  - **9.1 GovAssure Status** — tracker for critical system assurance (cycle year, per-system status, findings, remediation)
  - **9.2 Secure by Design Confidence Rating** — self-assessment against SbD high-confidence profile (principles checklist, gap analysis)
  - **9.3 Cyber Security Standard Exception Register** — non-compliance management per CSS clauses 4.3/4.4 (exception ID, risk assessment, approval authority, improvement plan)
- CSS reference added to Executive Summary, External References, command prompt, and guide
- GovAssure and CSS URLs added to command Resources section
- **GovS 007: Security alignment** — `/arckit.secure` template now includes:
  - **Section 10: GovS 007 Alignment Summary** — mapping table of 9 principles to CAF sections and ArcKit artefacts, plus named security roles table (SSRO, DSO, SIRO)
  - SSRO and DSO added to Approval & Sign-Off section
  - GovS 007 entry added to External References
- New `docs/guides/govs-007-security.md` reference guide cross-mapping GovS 007 principles, security lifecycle, protective security disciplines, and key roles to ArcKit commands
- GovS 007 security roles (SSRO, DSO, SIRO, Cyber Security Lead) added to stakeholders template alongside existing GovS 005 digital roles
- **National Data Strategy reference guide** — new `docs/guides/national-data-strategy.md` mapping NDS 5 missions and 4 pillars to ArcKit commands and artefacts, with pillar checklists and National Data Library context
- NDS added to UK Government standards map (Mermaid diagram, lifecycle table, reference links)
- NDS cross-reference added to data-model command, template, and guide
- **Government Data Quality Framework reference guide** — new `docs/guides/data-quality-framework.md` mapping DQF 5 principles, 6 dimensions, 4 practical tools, maturity model, and data lifecycle to ArcKit artefacts
- DQF alignment note added to data-model template's existing Data Quality Framework section
- DQF cross-reference added to data-model command and guide
- **UK Government Codes of Practice reference guide** — new `docs/guides/codes-of-practice.md` mapping the Rainbow of Books (Magenta, AQuA, Rose, Commercial Playbooks) alongside existing Green/Orange Book coverage to ArcKit commands, with delivery lifecycle mapping
- Magenta Book and Sourcing Playbook references added to SOBC command
- Sourcing Playbook and DDaT Playbook references added to DOS command
- Sourcing Playbook reference added to SOW command
- Magenta Book, Orange Book, AQuA Book, and Rose Book nodes added to standards map Mermaid diagram
- **New `/arckit:presentation` command** — generates MARP-format slide decks from existing project artifacts for governance boards, stakeholder briefings, and gate reviews
  - Supports 4 presentation focus modes: Executive, Technical, Stakeholder, Procurement
  - Configurable slide count (6-8, 10-12, 15-20)
  - Reads all available project artifacts and extracts key content into slides
  - Embeds Mermaid diagrams (Gantt, pie, C4, quadrant charts)
  - MARP output renders to PDF/PPTX/HTML via MARP CLI or VS Code extension
  - Doc type code: `PRES`
- New `presentation-template.md` with MARP frontmatter, Document Control, and slide structure
- New `docs/guides/presentation.md` with rendering instructions and focus option reference
- **Data Commons MCP integration for `/arckit.datascout`** — datascout agent now uses `search_indicators` and `get_observations` tools from the Data Commons MCP (when available) to discover and validate UK statistical data (population, GDP, health, climate, government spending) before category-specific web research; includes sub-national NUTS2 regional queries; skips gracefully if MCP not configured
- **Pinecone MCP integration for `/arckit.wardley`** — wardley command now searches the Wardley Mapping book corpus via Pinecone `search-records` (when available) for relevant strategic context, case studies, gameplay patterns, and evolution analysis; complements local reference files with full book depth; skips gracefully if Pinecone MCP not configured
- New `docs/guides/pinecone-mcp.md` — optional integration guide covering Wardley book knowledge base, configuration, prerequisites, and command integration

---

## [2.6.0] - 2026-02-17

### Added

- **SessionStart hook for version injection** — new `hooks/arckit-session.sh` fires once at session start (and on resume/clear/compact), injecting the ArcKit plugin version into Claude's context and exporting `ARCKIT_VERSION` as an environment variable; also detects whether a `projects/` directory exists
- **OpenCode CLI support** — 4th distribution format (`arckit-opencode/`); `scripts/converter.py` now generates OpenCode markdown alongside Codex and Gemini formats

### Changed

- **Removed per-command VERSION file reads from 46 commands** — commands no longer instruct Claude to read `${CLAUDE_PLUGIN_ROOT}/VERSION`; the version is now provided via `{ARCKIT_VERSION}` from the SessionStart hook context, eliminating a redundant Read tool call on every command invocation
- Updated `hooks.json` to include `SessionStart` event alongside existing `UserPromptSubmit` and `PreToolUse` hooks
- Version bump across all distribution formats (CLI, plugin, extension, marketplace)

---

## [2.5.1] - 2026-02-17

### Changed

- **Removed `generate-document-id.sh` calls from 29 commands** — replaced bash script invocations with inline document ID format strings (e.g., `ARC-{PROJECT_ID}-REQ-v{VERSION}`); the PreToolUse hook now auto-corrects ARC filenames, making script calls redundant. The script itself is retained for `arckit init` and standalone use.
- Version bump across all distribution formats (CLI, plugin, extension, marketplace)

---

## [2.5.0] - 2026-02-17

### Added

- **UserPromptSubmit hook for project context** — new `hooks/arckit-context.sh` hook automatically detects all projects, artifacts, external documents, and global policies before any `/arckit:` command runs, injecting structured context via `systemMessage`
- **Plugin hooks configuration** — new `hooks/hooks.json` firing `arckit-context.sh` on every `UserPromptSubmit` event (skips non-arckit and utility commands)
- **PreToolUse (Write) hook for filename enforcement** — new `hooks/validate-arc-filename.sh` auto-corrects ARC filenames before the Write tool creates them: zero-pads project IDs, normalizes version format, moves multi-instance types (ADR, DIAG, DFD, WARD, DMC) to correct subdirectories, assigns next sequence numbers, and blocks unknown doc type codes

### Changed

- **Refactored 39 commands to use hook-provided context** — removed boilerplate directory scanning, `ARC-*-TYPE-*.md` glob patterns, verbose external docs blocks, and `list-projects.sh` calls; replaced with compact hook-aware references (net -1,071 lines, 66% boilerplate reduction)
- Version bump across all distribution formats (CLI, plugin, extension, marketplace)

---

## [2.4.5] - 2026-02-15

### Added

- **New `/arckit:dfd` command** — Data Flow Diagram (DFD) generation with multi-instance support, document control, and DFD-specific template
- **DFD multi-instance document type** — `DFD` added to `generate-document-id.sh` for sequential numbering (ARC-001-DFD-001, ARC-001-DFD-002, etc.)

### Changed

- **Explicit VERSION file path in all commands and agents** — all 49 commands and 5 agents now reference `${CLAUDE_PLUGIN_ROOT}/VERSION` instead of bare `VERSION`, ensuring the ArcKit version is always read from the plugin's authoritative file regardless of project state
- Version bump across all distribution formats (CLI, plugin, extension, marketplace)

---

## [2.4.4] - 2026-02-12

### Fixed

- **Windows cp1252 encoding fix** — added explicit `encoding='utf-8'` to all file I/O operations in `arckit init` to prevent `UnicodeEncodeError` on Windows (fixes #49)

### Changed

- Version bump across all distribution formats (CLI, plugin, extension, marketplace)

---

## [2.4.3] - 2026-02-11

### Added

- **Data Commons MCP server for Gemini extension** — added `datacommons-mcp` to the Gemini extension MCP configuration, matching the Claude plugin

### Changed

- Version bump across all distribution formats (plugin, extension, marketplace)

---

## [2.4.2] - 2026-02-11

### Added

- **Data Commons MCP server** — bundled as a plugin MCP server for statistical data access (population, economics, health, etc.)

### Fixed

- Version bump to force plugin cache refresh for MCP server testing

---

## [2.4.1] - 2026-02-10

### Added

- **Gemini CLI native extension** — ArcKit is now available as a Gemini CLI extension at [`tractorjuice/arckit-gemini`](https://github.com/tractorjuice/arckit-gemini), giving Gemini users the same zero-config experience as the Claude Code plugin
  - Install: `gemini extensions install https://github.com/tractorjuice/arckit-gemini`
  - Bundled MCP servers (AWS Knowledge, Microsoft Learn via mcp-remote), optional Google Developer Knowledge
  - All 48 commands, templates, scripts, guides, and Wardley Mapping skill included
  - Extension version tracks plugin version (v2.4.1)
- `scripts/converter.py` now generates extension output alongside Codex format, with path rewriting (`${CLAUDE_PLUGIN_ROOT}` -> `~/.gemini/extensions/arckit`)

### Fixed

- **Gemini extension workspace sandbox fix**: Extension commands prepend a file access instruction block telling the model to use `run_shell_command` instead of `read_file` for extension paths (Gemini CLI sandboxes `read_file` to the project directory). `Read` instructions are also rewritten to `cat` commands in extension output.

### Changed

- **CLI is now Codex-only**: Gemini CLI removed from the CLI package — Gemini users should use the native extension instead. The converter now generates 2 output formats (Codex + Extension) instead of 3.

---

## [2.4.0] - 2026-02-09

### Added

- **Google Cloud Research** (`/arckit:gcp-research`) — new command + agent for GCP-specific technology research using the [Google Developer Knowledge MCP](https://developerknowledge.googleapis.com/mcp) server
  - Mirrors the existing AWS and Azure research commands (thin wrapper + autonomous agent)
  - Architecture Framework assessment (6 pillars: Operational Excellence, Security/Privacy/Compliance, Reliability, Cost Optimization, Performance Optimization, Sustainability)
  - Security Command Center mapping (CIS Benchmark for GCP, vulnerability/misconfiguration/threat findings)
  - UK Government: G-Cloud procurement, europe-west2 (London) data residency, NCSC alignment
  - Cost optimization: Committed Use Discounts (CUDs), Sustained Use Discounts (SUDs), Spot VMs, E2 machine types
  - IaC: Terraform (primary), Cloud Build CI/CD pipelines
  - Doc type code: `GCRS`
- Added `google-developer-knowledge` MCP server to plugin `.mcp.json` (requires `GOOGLE_API_KEY` env var)
- Added GCP research template, guide, and dependency matrix entry

---

## [2.3.1] - 2026-02-09

### Fixed

- Pass directory argument to `--next-num` in multi-instance commands (wardley, diagram, data-mesh-contract) to prevent unbound variable crash with `set -u`
- Added guard in `generate-document-id.sh` to give a clear error message when directory is missing
- Replace Mermaid `gitGraph` with `flowchart` in devops template — gitGraph has limited renderer support and fails with "No diagram type detected" errors in GitHub/VS Code
- Added diagram guidelines to devops command to prevent gitGraph usage in generated documents

---

## [2.3.0] - 2026-02-09

### Added

- **Mathematical models** for Wardley Mapping skill — new `references/mathematical-models.md` with evolution scoring formulas, decision metrics (differentiation pressure, commodity leverage, dependency risk), and weak signal detection framework
- Quantitative analysis triggers in skill description (score evolution, calculate ubiquity, differentiation pressure, commodity leverage, weak signal detection, readiness score)
- Optional **Step 6: Quantitative Analysis** in SKILL.md mapping workflow
- Numeric scoring rubric (ubiquity/certainty scales) added to `references/evolution-stages.md`
- Quantitative positioning worked example added to E-Commerce Platform in `references/mapping-examples.md`

---

## [2.2.1] - 2026-02-09

### Fixed

- Added explicit `list-projects.sh --json` step to 9 commands (stakeholders, requirements, adr, sow, roadmap, strategy, dpia, platform-design, data-mesh-contract) to prevent Claude from guessing wrong script paths in plugin-based repos that no longer have `.arckit/scripts/bash/`

---

## [2.2.0] - 2026-02-09

### Added

- **Wardley Mapping skill** (`skills/wardley-mapping/`) for conversational Wardley Mapping — quick questions, evolution stage lookups, doctrine assessments, and interactive map creation with AskUserQuestion
- 5 reference files shared between skill and `/arckit:wardley` command: evolution stages, doctrine, gameplay patterns, climatic patterns, and mapping examples
- Enhanced strategic analysis in `/arckit:wardley` command — now reads shared reference files for doctrine assessment, gameplay patterns, climatic patterns, and mapping examples
- Output documents now include Doctrine Assessment Summary, Applicable Gameplay Patterns, and Climatic Pattern Analysis sections

## [2.1.9] - 2026-02-08

### Added

- Interactive configuration using AskUserQuestion for 8 key commands: backlog, diagram, plan, adr, dpia, sow, sobc, roadmap
- Commands now ask users about key decision points (prioritization approach, diagram type, contract type, evaluation weighting, etc.) before generating documents
- Questions are automatically skipped when users specify preferences via command arguments

## [2.1.8] - 2026-02-07

### Removed

- Redundant SessionStart hook that checked for already-bundled MCP servers (AWS Knowledge + Microsoft Learn are guaranteed by plugin `.mcp.json`)

## [2.1.7] - 2026-02-07

### Changed

- Plugin is now the **sole Claude Code distribution** — CLI no longer ships `.claude/commands/` or `.claude/agents/`
- All 22 test repos migrated from synced files to plugin marketplace

## [2.1.5] - 2026-02-07

### Added

- Bundled Microsoft Learn MCP server (`https://learn.microsoft.com/api/mcp`) via `.mcp.json`

### Changed

- Removed redundant MCP availability checks from Azure research commands (MCP now guaranteed by plugin)

## [2.1.4] - 2026-02-07

### Added

- Bundled AWS Knowledge MCP server (`https://knowledge-mcp.global.api.aws`) via `.mcp.json`

### Changed

- Renamed plugin commands to remove `arckit.` prefix for clean namespacing (e.g. `arckit.requirements` → `requirements`)
- Removed redundant MCP availability checks from AWS research commands (MCP now guaranteed by plugin)

## [2.1.3] - 2026-02-06

### Fixed

- Added missing `get_arckit_dir` and `get_templates_dir` functions to plugin `common.sh`
- Converted `arckit-init` from skill to slash command

## [2.1.2] - 2026-02-06

### Fixed

- Removed `hooks` field from `plugin.json` (auto-discovered from `hooks/` directory)

## [2.1.1] - 2026-02-06

### Fixed

- Reference agents by name in commands instead of `subagent_type: "general-purpose"` workaround
- Removed `agents` field from `plugin.json` (auto-discovered from `agents/` directory)
- Removed invalid `color`, `permissionMode`, `tools` fields from agent frontmatter (invalid in plugin context)

## [2.1.0] - 2026-02-06

### Added

- Initial plugin release for Claude Code marketplace
- 46 slash commands for architecture governance artifact generation
- 4 autonomous agents (research, datascout, aws-research, azure-research)
- 35 document templates with Document Control standard
- Helper scripts (`common.sh`, `create-project.sh`, `generate-document-id.sh`, etc.)
- Command usage guides
- `marketplace.json` for plugin discovery
- MIT LICENSE

### Changed

- All commands use `${CLAUDE_PLUGIN_ROOT}` for template and script references
- Agent frontmatter uses only valid plugin fields (`name`, `description`, `model`)
