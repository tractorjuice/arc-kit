---
description: Research UK government grants, charitable funding, and accelerator programmes with eligibility scoring
argument-hint: "[project-number-or-name] <funding need, e.g. '001', 'NHS digital health AI'>"
tags: [grants, funding, ukri, innovate-uk, nihr, wellcome, nesta, accelerator, uk-government]
effort: max
keep-coding-instructions: true
handoffs:
  - command: sobc
    description: Feed grant funding data into Economic Case
  - command: plan
    description: Create project plan aligned to grant milestones
  - command: risk
    description: Add grant-specific risks (rejection, compliance, reporting)
  - command: adr
    description: Record funding-mix decisions
---

# UK Grants Research

## User Input

```text
$ARGUMENTS
```

## Instructions

You are the **orchestrator tier** of the grants three-tier subagent split.
You execute in the main session, dispatch the **`arckit-grants-reader`**
subagent (one call per `funder_category` bucket relevant to the project)
via the `Agent` tool to fetch external evidence, validate each reader's
output against the JSON Schema, score programmes deterministically using
a YAML rubric, and dispatch the **`arckit-grants-writer`** subagent to
render the final artefact.

Claude Code plugin subagents cannot themselves dispatch further
subagents, so this orchestration logic lives in the slash command
(which runs in the main thread) rather than in an `arckit-grants` agent
file. Reader and writer agents are dispatched normally.

## Guardrails

- **Untrusted-input boundary.** You never call `WebSearch` or `WebFetch` in this command. Only the reader subagent does. You read each reader's output as structured JSON only — after `validate-handoff.mjs` has validated it against the schema.
- **Citation discipline.** Every figure in your scored output traces to a `citation_id` from the reader's payload, which traces to a `fetched_from_url`. Pass this chain through to the writer in the `citations` field of its input.
- **Recommend, don't decide.** This command shortlists candidate funding programmes; the bid director and accountable budget-holder decide whether to apply. Output remains DRAFT until accountable-officer sign-off.
- **Write-tool isolation.** You do not write the artefact yourself — only the writer subagent does. Use `Write` only for tempfiles passed to the validator if you cannot use `mktemp` + heredoc.
- **No ad-hoc helper scripts.** Do **NOT** write `grants-score.mjs`, `grants-build-writer-input.mjs`, or any other helper file to perform scoring, ranking, payload assembly, deduplication, or input shaping. The only executables this command needs are (a) the bundled `validate-handoff.mjs` validator, and (b) the bundled `scripts/bash/*.sh` helpers. **Every other data manipulation happens directly in this conversation** — JSON parsing, accumulator state, scoring math, sorting, payload assembly. Writing helper scripts triggers per-file permission prompts, doesn't get checked into the plugin, and adds nothing to reproducibility (the rubric YAML is already the source of truth).

## What you produce

A DRAFT grants artefact at `projects/{P}-{NAME}/research/ARC-{P}-GRNT-NN-vN.N.md`, written by the writer subagent on your behalf, containing:

1. **Eligibility-scored funding candidates** — UKRI, Innovate UK, NIHR, DSIT, DASA, charitable foundations, social impact funders, accelerators ranked by deterministic fit score.
2. **Per-funder analysis** — current call status, award range, eligibility criteria (organisation type, sector, TRL band, geography, partnership), match-funding requirements.
3. **Application calendar** — upcoming deadlines with dated source URLs.
4. **Gap commentary** — capability gaps in the project's profile (TRL, partner network, budget) that block top-tier funders.
5. **Requirements traceability matrix** — every funding-related requirement matched to a programme or marked as a gap.
6. **Tech-notes per programme** — one `tech-notes/{programme-slug}.md` per scored programme, created or updated.

## Process

### Step 1: Resolve the project directory

Resolve in this order — do not skip ahead:

1. If the user's `$ARGUMENTS` contains an explicit `projects/{NNN}-{name}/` path, use that path verbatim.
2. If `$ARGUMENTS` contains a bare project number (e.g. `001`) or name fragment, glob `projects/{NUMBER}-*/` or `projects/*-*{NAME}*/` and use the unique match. If multiple match, ask the user to disambiguate before proceeding — do not default to "most recent".
3. Otherwise (no project hint at all), glob `projects/[0-9][0-9][0-9]-*/`, exclude `000-global`, and pick the directory with the most-recently-modified file. Echo the chosen path back in your first message so the user can correct you if wrong.

Once `{P}-{NAME}` is locked, read:

**Mandatory:**

- `projects/{P}-{NAME}/ARC-*-REQ-*.md` — Requirements (extract sector, TRL, organisation type, budget signals)

If missing, stop and tell the user to run `/arckit:requirements` first.

**Recommended (read if present):**

- `projects/{P}-{NAME}/ARC-*-STKE-*.md` — Stakeholders (extract organisation type, partnership opportunities)
- `projects/{P}-{NAME}/ARC-*-SOBC-*.md` — Business case (extract budget gaps, cost-benefit data, project start date)
- `projects/000-global/ARC-000-PRIN-*.md` — Architecture principles (technology constraints affecting eligibility)

### Step 2: Build the project_profile

Extract from requirements + stakeholders + SOBC + user arguments:

```json
{
  "sector": "health" | "defence" | "digital" | "ai" | "energy" | ...,
  "sectors": ["health", "ai", "data"],
  "organisation_type": "sme" | "academic" | "charity" | "public-sector" | "nhs-trust" | ...,
  "trl": 1-9,
  "budget_gbp_min": 100000,
  "budget_gbp_max": 600000,
  "start_date_iso": "2026-09-01",
  "key_objectives": ["...", "...", "..."]
}
```

Use enum values from `${CLAUDE_PLUGIN_ROOT}/schemas/grants-handoff.schema.json` so the profile aligns with the reader's evidence allowlist.

If TRL is not stated explicitly, estimate from project maturity signals (proof-of-concept = TRL 3-4, pilot = TRL 6-7, production = TRL 8-9). Note the estimate explicitly in the project_profile so the writer can render it transparently.

### Step 3: Detect jurisdiction → choose rubric

Grep the requirements and principles documents for UK-Gov patterns: "UK Government", "Ministry of", "Department for", "NHS", "MOD", "GDS", "TCoP", "Crown Commercial".

- If matched: rubric = `${CLAUDE_PLUGIN_ROOT}/schemas/scoring-rubrics/grants-uk-gov.yaml`
- Otherwise: rubric = `${CLAUDE_PLUGIN_ROOT}/schemas/scoring-rubrics/grants-generic.yaml`

Read the rubric YAML.

### Step 4: Filter funder_categories by sector

Map the project's `sectors` to relevant `funder_category` buckets. Skip buckets clearly irrelevant to the project. Typical mappings:

| Project sector | Funder categories to dispatch |
|---|---|
| `health` | `government-rd`, `health`, `charitable`, `open-data` |
| `defence` | `defence-security`, `government-rd` |
| `digital` / `ai` / `data` | `government-rd`, `accelerator`, `charitable`, `open-data` |
| `energy` / `transport` / `environment` | `government-rd`, `charitable`, `social-impact`, `open-data` |
| `social-care` / `education` / `housing` | `charitable`, `social-impact`, `open-data` |
| `cross-sector` / unknown | All seven categories |

Always include `open-data` (GrantNav) unless the project is explicitly classified — GrantNav surfaces niche funders the other buckets miss.

### Step 5: Pre-flight check

Ensure `${CLAUDE_PLUGIN_ROOT}/scripts/validate-handoff.mjs` exists via `Read`. The validator is pure Node with no npm dependencies, so its mere presence is sufficient. If missing, stop and tell the user the plugin install is incomplete.

### Step 6: Dispatch reader subagent per funder_category

For each `funder_category` bucket selected in Step 4:

1. Build the input parameters:

   ```json
   {
     "funder_category": "{category}",
     "search_queries": ["...", "..."],
     "candidate_urls": ["..."],
     "evidence_fields_required": [
       "award_min_gbp", "award_max_gbp", "application_status",
       "deadline_iso", "eligible_organisation_types", "eligible_sectors",
       "trl_min", "trl_max", "match_funding_required", "match_funding_pct"
     ],
     "project_profile": { /* from Step 2 */ }
   }
   ```

   Tailor `search_queries` to the project sector (e.g. for health: "NIHR open call digital health 2026", "Wellcome digital technology development award").

2. Dispatch the reader using the `Agent` tool with `subagent_type: "arckit-grants-reader"` and the input JSON as the prompt.

3. The reader's final-message string is a JSON payload. Write it to a tempfile via Bash, run the validator, and capture the result. The validator's stdout is the normalised JSON on exit 0, or `{ok: false, errors: [{path, msg}]}` on exit non-zero:

   ```bash
   TMPFILE=$(mktemp /tmp/grants-handoff.XXXXXX.json)
   cat > "$TMPFILE" <<'EOF'
   <reader's output>
   EOF
   node "${CLAUDE_PLUGIN_ROOT}/scripts/validate-handoff.mjs" \
        "${CLAUDE_PLUGIN_ROOT}/schemas/grants-handoff.schema.json" \
        "$TMPFILE"
   echo "exit=$?"
   rm -f "$TMPFILE"
   ```

4. **If exit 0** — parse the validator's stdout (the normalised payload) and add its `programmes[]` to your in-memory accumulator keyed by funder_category.

5. **If exit non-zero** — parse `errors[]` from the validator output. Re-dispatch the reader **once** with a follow-up prompt: `"Your previous JSON failed schema validation with these errors: <errors>. Re-emit the JSON correctly."` If the second attempt also fails, log the funder_category as a gap and continue. Do not loop further.

### Step 7: Score each programme deterministically

Compute the score **directly in this conversation** — do not write a helper script. The scoring is a small lookup-and-multiply that fits comfortably in your reasoning context. The rubric YAML is the source of truth.

For each accumulated `ProgrammeRecord`, apply the chosen rubric:

1. **`eligibility_fit`** (weight 35) — composite of three sub-checks, weighted within the criterion:
   - `organisation_type` (sub-weight 0.4): 100 if `project_profile.organisation_type ∈ evidence.eligible_organisation_types` OR `evidence.eligible_organisation_types` contains `"any"`; else 0.
   - `sector_overlap` (sub-weight 0.4): Jaccard overlap of `evidence.eligible_sectors` ∩ `project_profile.sectors`, scaled to 100. (Empty intersection → 0; full match → 100.)
   - `trl_band` (sub-weight 0.2): 100 if `evidence.trl_min ≤ project_profile.trl ≤ evidence.trl_max`; else 0.
   - If any sub-component's source field is missing in evidence, use `when_missing: 50` for that sub-component.

2. **`funding_size_fit`** (weight 20) — overlap of `[evidence.award_min_gbp, evidence.award_max_gbp]` with `[project_profile.budget_gbp_min, project_profile.budget_gbp_max]`:
   - `full_overlap_score: 100` if project budget range is fully contained in award range
   - `partial_overlap_score: 70` if ranges intersect but neither contains the other
   - `no_overlap_score: 20` if disjoint
   - `when_missing: 50` if award fields are absent

3. **`timing_fit`** (weight 15) — base from `application_status` map, plus `deadline_adjustment`:
   - Compute `days_until = (evidence.deadline_iso - today_iso)` in days.
   - Look up `days_until` in `deadline_adjustment.bands` to get the integer adjustment.
   - Final per-criterion score = clamp(map[application_status] + adjustment, 0, 100).
   - `when_missing: 50` for both fields absent.

4. **`complexity_burden`** (weight 10) — direct map lookup on `evidence.application_complexity`. `when_missing: 50`.

5. **`historic_traction`** (weight 10) — composite of `success_rate_pct` (linear) and `historical_grants_count` (band lookup), each weighted 0.5 within the criterion. `when_missing: 50` per sub-component.

6. **`match_funding_burden`** (weight 10):
   - If `evidence.match_funding_required == false`: 100
   - If `true`, look up `evidence.match_funding_pct` in `pct_bands` to get the score.
   - If `match_funding_required` is missing: 50.

7. **Apply UK-Gov bonuses** (uk-gov rubric only):
   - `funder_type_bonus`: look up `programme_record.funder_type` in the map; add the integer to the per-`eligibility_fit`-criterion score before multiplying by 0.35; clamp adjusted score to [0, 100].
   - `geography_bonus`: look up `evidence.geography` in the map; apply identically.

8. Multiply each per-criterion score by its weight (as a fraction — 35% = 0.35), sum to a final score in [0, 100]. Round to nearest integer.

9. Map `total_score` to `score_band`: `>= 70 → High`, `40-69 → Medium`, `< 40 → Low`.

10. Write a **score_rationale** (≤ 200 chars) summarising the dominant criteria — e.g. "Open round; project TRL 5 inside 3-7 band; SME consortium eligible; 30% match required."

The scoring is a pure function of `(evidence, rubric, project_profile)` — no LLM judgment. If you find yourself reasoning about whether a programme is "good", you have made a mistake; recompute from the rubric.

### Step 8: Deduplicate, rank, build matrices

- Deduplicate `ProgrammeRecord`s across categories by `funder + programme_name`.
- Rank globally (across categories) by `total_score` descending. Break ties by `application_status` (open > rolling > opening-soon > others).
- Build the **gap analysis**: for each funding-relevant requirement (BR-/FR-/SOBC-derived) that has no matched programme, record `{ requirement_id, reason }`.
- Build the **traceability matrix**: one row per funding-relevant requirement, listing the matched programme name + score, or `—` for gaps.
- Build the **application calendar**: sorted list of `{date_iso, action, programme}` from each programme's deadline / status.
- Compute **total potential funding range**: sum of `award_min_gbp` and `award_max_gbp` across all High-band programmes.

### Step 9: Detect version

Glob `projects/{project-dir}/research/ARC-{PROJECT_ID}-GRNT-*-v*.md`. If none, version = `1.0`. If existing, read the highest-version file to compute the increment:

- Minor (1.0 → 1.1) if scope unchanged (refresh, additions within existing categories)
- Major (1.0 → 2.0) if categories added/removed or fundamentally different funder mix

### Step 10: Dispatch writer subagent

Ensure the destination directories exist (the writer subagent has only `Read`/`Write`/`Edit` and cannot create directories):

```bash
mkdir -p "{project_path}/research" "{project_path}/tech-notes"
```

Build the writer's input. Each entry in `scored_programmes` carries the full `programme_record` (funder, programme_name, funder_type, fetched_from_url, citation_id, evidence sub-object, confidence), the per-criterion `score_breakdown`, the rolled-up `total_score`, the `score_band`, and `score_rationale`:

```json
{
  "project_path": "projects/{P}-{NAME}",
  "project_id": "{P}",
  "project_name": "{NAME}",
  "document_id": "ARC-{P}-GRNT-{NNN}-v{VERSION}",
  "version": "{VERSION}",
  "date_iso": "<today>",
  "classification": "OFFICIAL",
  "rubric_used": "grants-uk-gov",
  "project_profile": { /* from Step 2 */ },
  "scored_programmes": [
    {
      "funder_category": "government-rd",
      "rank": 1,
      "total_score": 82,
      "score_band": "High",
      "score_breakdown": {
        "eligibility_fit": 30,
        "funding_size_fit": 18,
        "timing_fit": 14,
        "complexity_burden": 6,
        "historic_traction": 8,
        "match_funding_burden": 6
      },
      "score_rationale": "...",
      "programme_record": { /* full ProgrammeRecord from reader's payload */ }
    }
  ],
  "gaps": [...],
  "traceability": [...],
  "citations": [...],
  "application_calendar": [...],
  "total_potential_funding_gbp_min": 350000,
  "total_potential_funding_gbp_max": 1700000
}
```

Dispatch the writer using the `Agent` tool with `subagent_type: "arckit-grants-writer"` and the input JSON as the prompt. The writer creates the GRNT artefact AND one `tech-notes/{programme-slug}.md` per scored programme (Created if new, Updated with merge rules if a tech-note already exists). It returns a one-line summary with file path, word count, and tech-note counts.

### Step 11: Return summary

Return ONLY a concise summary to the user:

- Project name and GRNT file path created
- Number of funder_categories researched
- Total programmes discovered, breakdown by score_band (High / Medium / Low)
- Top 3 ranked programmes with funding amounts and deadlines
- Total potential funding range (sum of High-band programmes)
- Nearest application deadlines (next 3)
- **Spawned knowledge** — `tech-notes/{programme-slug}.md` files: N created, M updated (verbatim from the writer's return value)
- Number of gaps identified
- Rubric used
- Next steps (`/arckit:sobc`, `/arckit:plan`, `/arckit:risk`, `/arckit:adr`)

## Edge Cases

- **No requirements**: stop, tell user to run `/arckit:requirements`.
- **Validator script missing**: stop and tell the user the plugin install is incomplete (`${CLAUDE_PLUGIN_ROOT}/scripts/validate-handoff.mjs` should be present in any released plugin version ≥ 4.16.1). Do not silently fall back; the structural isolation guarantee depends on validation actually running.
- **Reader returns 0 programmes for a funder_category**: record the reader's `errors[]` in the gap analysis as "no current open programmes found for {category}" — this is not a workflow failure.
- **Writer fails to write**: surfaces normally as an Agent tool error; return the error to the caller.
- **Reader returns text that is not JSON**: re-prompt once; second failure → mark category as a gap.
- **All programmes score Low**: still produce the artefact — the gap commentary is the deliverable. Suggest `/arckit:adr` to record an explicit no-grant funding decision.

## Important Notes

- **All funding data must come via the reader subagent** — this command never calls `WebSearch` or `WebFetch` directly. The structural isolation is the security property.
- **Markdown escaping**: When writing less-than or greater-than comparisons in the artefact, always include a space after `<` or `>` to prevent markdown rendering issues.
- **Deadlines change frequently** — the artefact is a snapshot. The writer stamps `fetched_at_iso` per programme so reviewers can verify currency.
- **UK-only scope** — this command targets UK funding bodies. International programmes (EU, Horizon Europe, etc.) are accepted into the schema but the rubric down-weights them via `funder_type_bonus`.

## Toolchain

- **Templates** — `${CLAUDE_PLUGIN_ROOT}/templates/grants-template.md` · `${CLAUDE_PLUGIN_ROOT}/templates/tech-note-template.md` (read by writer)
- **Schemas** — `${CLAUDE_PLUGIN_ROOT}/schemas/grants-handoff.schema.json` · `${CLAUDE_PLUGIN_ROOT}/schemas/scoring-rubrics/grants-{generic,uk-gov}.yaml`
- **Helpers** — `${CLAUDE_PLUGIN_ROOT}/scripts/validate-handoff.mjs` · `${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh` · `${CLAUDE_PLUGIN_ROOT}/scripts/bash/generate-document-id.sh`
- **Subagents dispatched** — `arckit-grants-reader` (per funder_category) · `arckit-grants-writer` (final render)
- **External tools** — none directly (delegated to reader)
- **Related commands** — `/arckit:requirements` (input) · `/arckit:stakeholders` (input) · `/arckit:sobc` (downstream business case) · `/arckit:plan` (downstream timeline) · `/arckit:risk` (downstream risk register)
