# UAE Federal Overlay Design

**Spec ID**: 2026-04-30-uae-overlay
**Status**: APPROVED for implementation planning
**Target release**: ArcKit v4.8.0
**Author**: brainstormed by Claude with Mark Craddock, 2026-04-30
**Trigger**: UAE Cabinet decree of 23 April 2026 (50% of federal sectors on agentic AI within 24 months) and the four Cabinet-approved governance instruments accompanying it.

---

## 1. Summary

ArcKit gains a 12-command **UAE Federal Overlay** as part of the officially-maintained baseline (taking the count from 68 to 80 official commands). The overlay covers the UAE federal regulatory baseline (PDPL, IAS, cloud residency, Smart Data classification, UAE Pass), the four 23 April 2026 Cabinet instruments (Code for Government Services and Zero Bureaucracy, Digital Records Policy, Data Sharing Policy, National Priorities Alignment), federal AI governance (UAE Charter for AI, three-tier autonomy posture), and federal procurement (Decree-Law 11/2023).

Two plugin userConfig fields are added (`governance_framework: UAE Federal` and `classification_scheme: UAE Smart Data`) and the existing ~83 templates' Document Control headers gain a conditional UAE block that renders only when the framework is set to UAE Federal. Non-UAE projects see byte-identical output to today.

The overlay ships as official baseline (no `[COMMUNITY]` prefix, no inline warning banner, `Template Origin: Official`). Solo CODEOWNERS under `@tractorjuice` initially, with a "Help wanted" issue for a UAE domain co-maintainer.

English-only in v1. Arabic companion artefacts and emirate / sector overlays (ADHICS, Dubai ISR) are explicit deferrals to v4.9 or community contribution.

---

## 2. Locked constraints

| Constraint | Decision | Set in |
|---|---|---|
| Scope tier | Federal core + AI + procurement (12 commands) | Q1 |
| Maintainership | Official baseline (no community markings) | Q2 |
| Integration depth | Surface + plugin userConfig extension | Q3 |
| Bilingual | English-only v1; `-AR` deferred | Q4 |
| Architectural shape | Approach 2: flat overlay + Document Control conditional | Approaches |
| Reference test repo | `arckit-test-project-v20-uae-moi-ipad` (Ministry of Investment) | Research |

---

## 3. The 12 commands

Each command's frontmatter follows the existing baseline pattern: `description`, `argument-hint`, `effort: high`, `handoffs:`, no `[COMMUNITY]` prefix. The four Cabinet-instrument commands carry `keep-coding-instructions: true` because they perform long synthesis runs that should survive `/compact`.

### Federal data and security baseline (4)

| # | Command | Type code | Category | Anchor | Handoffs |
|---|---|---|---|---|---|
| 1 | `uae-pdpl` | `PDPL` | Compliance | Federal Decree-Law 45/2021; UAE Data Office | `risks`, `uae-data-sharing`, `uae-classification` |
| 2 | `uae-ias` | `IAS` | Compliance | UAE Cybersecurity Council IAS v2 (188 controls, P1–P4) | `risks`, `uae-cloud-residency` |
| 3 | `uae-cloud-residency` | `CRES` | Architecture | National Cloud Security Policy v2; TDRA FedNet; Core42; e& Sovereign Launchpad | `uae-classification`, `adr` |
| 4 | `uae-classification` | `CLAS` | Governance | UAE Smart Data Classifications (Open / Shared / Confidential / Secret / Top Secret) | `data-model`, `uae-cloud-residency`, `uae-data-sharing` |

### Federal identity and integration (1)

| # | Command | Type code | Category | Anchor | Handoffs |
|---|---|---|---|---|---|
| 5 | `uae-uaepass` | `UPASS` | Architecture | UAE Pass (TDRA + ICP); OIDC/OAuth; Basic vs Verified profile | `integration`, `adr` |

### The four Cabinet instruments (4)

| # | Command | Type code | Category | Anchor | Handoffs |
|---|---|---|---|---|---|
| 6 | `uae-zero-bureaucracy` | `ZBUR` | Governance | UAE Code for Government Services and Zero Bureaucracy | `uae-priorities-alignment` |
| 7 | `uae-digital-records` | `DREC` | Governance | Government Services Digital Records Policy | `data-model`, `uae-data-sharing` |
| 8 | `uae-data-sharing` | `DSHR` | Governance | Government Services Data Sharing Policy ("collect once, use securely") | `integration`, `uae-pdpl` |
| 9 | `uae-priorities-alignment` | `NPRA` | Governance | Federal Government Guide to Aligning Digital Government Projects with National Priorities; NIS 2031; AI 2031 | `sobc`, `uae-uaepass` |

### AI governance (2)

| # | Command | Type code | Category | Anchor | Handoffs |
|---|---|---|---|---|---|
| 10 | `uae-ai-charter` | `AICH` | Compliance | UAE Charter for the Development and Use of AI (12 principles) | `uae-ai-autonomy-tier`, `risks` |
| 11 | `uae-ai-autonomy-tier` | `AUTI` | Architecture | Tier 1 internal-productivity / Tier 2 investor-facing-with-approval / Tier 3 regulated/financial (lifted from test repo NFR-SEC-7 / P27) | `adr`, `risks` |

### Procurement (1)

| # | Command | Type code | Category | Anchor | Handoffs |
|---|---|---|---|---|---|
| 12 | `uae-procurement` | `FPRO` | Procurement | Federal Decree-Law 11/2023; MoF Digital Procurement Platform; ICV | `evaluate`, `sobc` |

**Type code uniqueness**: verified against existing codes (RGPD, NIS2, AIACT, DORA, CRA, DSA, DATAACT, IRN, CNIL, SECNUM, MARPUB, DINUM, EBIOS, ANSSI, CARTO, DR, ALGO, PSSI, REUSE plus the standard set REQ, RISK, SOBC, ADR, DMOD, INT, etc.). No collisions.

**Canonical execution chain** (the order a UAE federal entity should run for a new service):

```
principles → uae-classification → uae-pdpl → uae-ias → uae-cloud-residency
  → uae-uaepass → uae-data-sharing → uae-digital-records
  → uae-zero-bureaucracy → uae-ai-charter → uae-ai-autonomy-tier
  → uae-priorities-alignment → uae-procurement
  → requirements → data-model → integration → risks
  → adr (per material decision) → sobc → wardley → framework
```

---

## 4. Plugin userConfig changes

Two fields land in `arckit-claude/.claude-plugin/plugin.json` userConfig.

### `governance_framework` (existing field, description extended)

- Field type today: free-form `string` (per Claude Code plugin schema; not a true enum). Recommended values are documented in the field `description` text.
- Today's recommended values: `UK Gov`, `Generic`.
- New recommended values: `UK Gov`, `Generic`, `UAE Federal`.
- Default: `Generic`.
- Change is to the `description` text only; the `type: string` stays. Validation that `UAE Federal` produces consistent downstream behaviour is enforced by the template substitution logic and the optional plugin-enable warning, not by JSON-schema enum.
- Prompted at plugin enable.

### `classification_scheme` (new field)

- Field type: free-form `string` (matches existing pattern).
- Recommended values: `UK`, `UAE Smart Data`.
- Default: `UK`.
- Prompted at plugin enable.
- Drives the classification options rendered in every Document Control header.

### Combined behaviour

- `governance_framework: UAE Federal` + `classification_scheme: UAE Smart Data` is the coherent UAE configuration.
- Other combinations (e.g. `UAE Federal` + `UK`) produce a non-blocking warning at plugin enable: "UAE Federal projects typically use the UAE Smart Data classification scheme. Continue anyway?"
- Plugin enable validation does not block; it warns. Some UAE entities operate dual-classified.

---

## 5. Document Control conditional and classification rendering

### Scheme-aware classification field

The existing single line in every Document Control table:

```
| Classification | PUBLIC / OFFICIAL / OFFICIAL-SENSITIVE / SECRET |
```

Becomes:

```
| Classification | ${classification_options} |
```

Where the resolver substitutes:

- `PUBLIC / OFFICIAL / OFFICIAL-SENSITIVE / SECRET` when `classification_scheme: UK`
- `Open / Shared / Confidential / Secret / Top Secret` when `classification_scheme: UAE Smart Data`

The default value the architect picks (today `${user_config.default_classification}`) continues to substitute as a free-form string. The architect chooses a value valid in the active scheme; v1 validation is advisory (lint warning, not hook block).

### UAE-specific Document Control block

Appended to the Document Control table when `governance_framework: UAE Federal`:

```
| Federal Entity         | ${user_config.organisation_name} |
| Cabinet Instrument     | [auto-populated or PENDING] |
| Sovereign Cloud Region | [auto-populated or PENDING] |
| AI Autonomy Tier       | [auto-populated or PENDING] |
```

`Federal Entity` reuses `organisation_name`. The other three fields are populated by the command at generation time from upstream artefacts (the SOBC fills `Cabinet Instrument`, the AI Charter assessment fills `AI Autonomy Tier`, the cloud residency assessment fills `Sovereign Cloud Region`). For fresh artefacts with no upstream context, the AI assistant prompts the architect to confirm during generation.

### Implementation mechanism (decided in Phase A)

Two viable approaches, decision deferred to Phase A based on what fits the existing template-loading code most cleanly:

**Option α**: Inline marker syntax using HTML comments:

```
<!-- IF governance_framework=UAE Federal -->
| Federal Entity ... |
<!-- ENDIF -->
```

Template loader strips markers and conditional bodies during `${user_config.*}` substitution. Single change site.

**Option β**: Fragment includes:

```
@include document-control-uae.md
```

Template loader resolves `@include` to one of `document-control-uk.md` or `document-control-uae.md` partials based on `governance_framework`. Two new partial files, no marker syntax to invent.

End-state visible to the architect is identical for either option. Decision is implementation-aesthetic, not semantic.

### Non-UAE projects unchanged

A UK or Generic project sees byte-identical Document Control headers to today's output. The conditional block does not render. The classification options resolve to the UK ladder. Regression tests assert this.

---

## 6. File inventory

### New (41 files)

- 12 command files: `arckit-claude/commands/uae-*.md`
- 24 template files: `arckit-claude/templates/uae-*-template.md` and `.arckit/templates/uae-*-template.md` (12 in each location)
- 5 docs: `docs/guides/uae-overlay.md`, `docs/guides/uae-overlay-maintenance.md`, `docs/articles/2026-04-30-uae-overlay-launch.md`, hero PNG, hero generator script

### Modified (~190 files)

- `arckit-claude/.claude-plugin/plugin.json` (userConfig)
- `arckit-claude/config/doc-types.mjs` (12 new type codes)
- `arckit-claude/commands/pages.md` (12 new rows in document-types table)
- `.github/CODEOWNERS` (3 glob entries for `uae-*`)
- `scripts/converter.py` (env-var rewrite for new userConfig fields)
- ~83 templates in `arckit-claude/templates/` (Document Control header — one outlier without Classification field excluded)
- ~83 templates in `.arckit/templates/` (Document Control header)
- `README.md` (count 68→80, new section)
- `docs/index.html` (commands table)
- `docs/DEPENDENCY-MATRIX.md` (12 new rows)
- `docs/WORKFLOW-DIAGRAMS.md` (UAE chain diagram)
- `CHANGELOG.md` (v4.8.0 entry)
- 15 version files via `scripts/bump-version.sh 4.8.0`

### One-time helper (ships in v4.8.0, removed in v5.0.0)

- `arckit migrate-classification` CLI helper that proposes UAE Smart Data equivalents for existing UK-ladder classifications in a repo. Produces a diff for architect review; does not auto-commit.

---

## 7. Validation

### Static (CI, every PR)

1. `markdownlint-cli2` against new commands and templates.
2. **Type-code dual-registration test** (new): asserts `doc-types.mjs` and `pages.md` document-types table are identical sets. Catches the silent-omission failure mode flagged in the v4.7 EU/French ship.
3. **Frontmatter schema validation**: every command's frontmatter has required keys, valid `effort`, valid `handoffs[].command` references.
4. **Converter round-trip**: every `uae-*.md` produces output in all six non-Claude target directories with Claude-only frontmatter stripped and `${user_config.*}` substitutions converted to env-var form.
5. **Template substitution dry run**: each `uae-*-template.md` rendered with `governance_framework: UAE Federal` produces the four UAE Document Control fields; rendered with `Generic` does not.

### Behavioural (manual, once before v4.8.0 tag)

1. **End-to-end on v20**: regenerate Document Control headers across `arckit-test-project-v20-uae-moi-ipad`'s `006-moi-agentic-ai-pathfinder` artefacts under UAE config; verify Smart Data labels and UAE block render correctly; cross-check semantic coherence.
2. **End-to-end command run**: run the canonical chain on a fresh project in v20; confirm artefacts land with correct type codes, citations, handoffs.
3. **Regression sweep**: three UK/Generic test repos (`v3-windows11`, `v8-ons-data-platform`, `v17-fuel-prices`); confirm byte-identical Document Control headers to today's output.
4. **Multi-AI sanity check**: run `uae-pdpl` once on each of Codex / Gemini / OpenCode / Copilot scaffolds.

### Citation accuracy (manual, ongoing)

Each command body cites its anchor regulation by full title and primary URL. `docs/guides/uae-overlay-maintenance.md` lists every citation, the URL, the verification date, and the next quarterly review date. Six items flagged not-verified during research land as explicit "Known limitations" in the same doc and as tracked GitHub issues before v4.8.0 tag:

- PDPL Executive Regulation publication status
- Smart Data Classifications exact level names (vs the inferred set used here)
- UAE Pass LoA-to-eIDAS mapping
- AWS me-south-1 acceptability under current CSC policy
- Central Bank of UAE AI guidance for FSIs
- Cabinet Affairs vs National Archives ownership of the Digital Records Policy

### Out of scope for v1 validation

- Arabic translation accuracy (deferred per Section 9).
- Sector overlays (ADHICS, Dubai ISR) — not in scope.
- Free-zone regimes (DIFC DPL, ADGM DPR) — not in scope.
- Penalty calculation against PDPL fines (informational only).
- Dynamic regulatory feed (manual quarterly cadence).

---

## 8. Rollout

### Phase A — Plumbing

1. Extend `plugin.json` userConfig.
2. Extend `doc-types.mjs` with 12 type codes.
3. Extend `pages.md` document-types table with same 12.
4. Add dual-registration CI test.
5. Implement Document Control conditional rendering (Option α or β).
6. Apply scheme-aware classification field and conditional block to all ~83 existing templates in both directories. ~166 mechanical edits.
7. Regression sweep against three UK/Generic test repos.
8. **Gate**: regression clean before Phase B starts.

### Phase B — Federal data and security commands (4)

`uae-classification`, `uae-pdpl`, `uae-ias`, `uae-cloud-residency`.

1. Author commands and templates.
2. Run converter; generate non-Claude variants.
3. Citation cross-check against regulatory research output and v20 test repo references.
4. End-to-end on v20.
5. **Gate**: domain-expert review pass (or self-review against maintenance doc citations).

### Phase C — Identity, Cabinet instruments, AI, procurement (8)

`uae-uaepass`, `uae-zero-bureaucracy`, `uae-digital-records`, `uae-data-sharing`, `uae-priorities-alignment`, `uae-ai-charter`, `uae-ai-autonomy-tier`, `uae-procurement`.

1. Author. Generate. Cross-check.
2. End-to-end canonical chain run on v20.
3. Multi-AI sanity check.
4. **Gate**: artefact-set completeness against the four Cabinet instruments.

### Phase D — Documentation and release

1. Update `README.md`, `docs/index.html`, `DEPENDENCY-MATRIX.md`, `WORKFLOW-DIAGRAMS.md`.
2. Author `docs/guides/uae-overlay.md` and `docs/guides/uae-overlay-maintenance.md`.
3. Author launch article and hero (different visual treatment from the three UAE articles already shipped this week).
4. Update `CHANGELOG.md` v4.8.0.
5. `./scripts/bump-version.sh 4.8.0`; `python scripts/converter.py`.
6. Tag `v4.8.0`; push; `./scripts/push-extensions.sh`.

### Phase E — Post-ship (next two weeks)

1. Open tracking issues for the six not-verified citations.
2. Open "Help wanted: UAE domain co-maintainer" issue.
3. Triage incoming UAE issues as priority.
4. After two stable weeks, plan v4.9 / v5.0 (Federal Mandate doc-types category, `uae-translate`).

### V20 test repo migration (one-time)

After v4.8.0 lands:

1. Update `arckit-test-project-v20-uae-moi-ipad/.claude/settings.json` userConfig to UAE Federal + UAE Smart Data.
2. Run `arckit migrate-classification`; review the proposed UK→UAE classification mapping per artefact.
3. Manual verification, commit.
4. Future commands run on v20 produce UAE-correct Document Control automatically.

`migrate-classification` deprecated v4.9.0, removed v5.0.0.

### Estimated effort

Single architect, working days: Phase A ≈ 1, Phase B ≈ 2, Phase C ≈ 2, Phase D ≈ 1. Total ≈ 6 days. Phase E ongoing.

---

## 9. Risks and explicit deferrals

### Implementation risks

1. **Template substitution mechanism may need more rework than design implies.** Mitigation: Option β (fragment includes) is the fallback to Option α (inline markers). Decide in Phase A.
2. **Citation accuracy on fast-moving UAE text.** Mitigation: explicit "verified as of" stamps; quarterly maintenance review; first three months expected to see correction PRs.
3. **Solo CODEOWNERS for an official-tier overlay.** Mitigation: explicit "Help wanted" issue; willingness to accept community PRs while recruiting.
4. **Multi-AI converter may need updates for conditional blocks.** Mitigation: extend `scripts/converter.py` in Phase A; verify in round-trip test.
5. **Classification migration on v20 may surface judgement-laden mappings.** Mitigation: helper produces a diff for architect review, never auto-commits.

### Post-ship risks

1. **A UAE entity adopts the overlay and artefacts fail an audit.** Mitigation: README explicitly states ratification is the architect's professional responsibility; "Official" label = citation accuracy at ship date, not warrantied compliance.
2. **A Cabinet circular changes the four instruments.** Mitigation: quarterly maintenance; v4.8.x patches as needed.
3. **Approach 3 (Federal Mandate doc-types category) blocked by v4.8.0 design.** Mitigation: v4.8.0 puts the four instruments in `Governance` category; promotion to `Federal Mandate` later is a clean schema change.

### Explicit deferrals

| Item | Defer to |
|---|---|
| Bilingual Arabic / English (`uae-translate`, `-AR` companion files) | v4.9 |
| Approach 3 (Federal Mandate doc-types category) | v5.0+ after stable production |
| Sector overlays (ADHICS Abu Dhabi healthcare, Dubai ISR DESC, CBUAE AI guidance) | Community contribution candidates |
| Free-zone regimes (DIFC DPL, ADGM DPR) | Community contribution candidates |
| Sharia-compliant data governance (P23 in test repo) | Awaiting authoritative federal anchor |
| Sovereign-vendor evaluation command | Extend `arckit.research` agent rubric in v4.9 |
| Penalty / fine scoring | Out of product surface |
| Dynamic regulatory feed | Manual quarterly cadence is sufficient |

### v4.9 / v5.0 backlog (tracked in maintenance doc)

- Promote four Cabinet instruments to `Federal Mandate` category.
- Land `uae-translate` utility command.
- Recruit UAE domain co-maintainer; dual CODEOWNERS.
- Extend `arckit.research` rubric for UAE sovereign vendors (G42 / Core42, TII Falcon, MBZUAI, e&, Stargate UAE).
- Open community sector overlays (ADHICS, Dubai ISR).
- Confirm quarterly citation review cadence over one full quarter.

---

## 10. Acceptance criteria for v4.8.0

- All static validation passes in CI.
- All four behavioural validation passes complete cleanly.
- Six not-verified citations have tracking issues opened.
- "Help wanted" co-maintainer issue opened.
- Three UK/Generic test repos regression clean (byte-identical Document Control).
- v20 test repo regenerates UAE Document Control correctly under new userConfig.
- README, docs site, dependency matrix, changelog all updated.
- `v4.8.0` tag pushed; extension repos synced.

---

## 11. References

- Cabinet announcement of 23 April 2026 (text mirrored at `docs/2026-04-23-cabinet-agentic-ai-framework.md`).
- Test repo: `tractorjuice/arckit-test-project-v20-uae-moi-ipad` (private).
- EU/French overlay launch article: `docs/articles/2026-04-19-v470-eu-french-regulatory.md`.
- Three already-shipped UAE-context articles this week: `2026-04-30-uae-caio-first-90-days.md`, `2026-04-30-uae-agentic-decree-90-day-playbook.md`, `2026-04-30-toolkit-drafts-architect-judges.md`.
- Regulatory anchors and primary URLs: see `docs/guides/uae-overlay-maintenance.md` (to be authored in Phase D).
