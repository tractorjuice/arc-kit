# `au-federal` Validation Scorecard

**Purpose**: Published alongside the `au-federal` PR for reviewer sanity-check, per maintainer guidance on issue #424:

> alongside the PR, please publish the evaluation scorecard (or a redacted version) — even just a one-page table of what was tested, against which framework, and the pass/fail signal. The "0 UK leakage / 220 AU references / 25/25 scorecard" claims are strong; we want reviewers to be able to sanity-check them rather than take them on trust.

**Date**: 2026-05-06
**Contributor**: @royster70
**Closes**: tractorjuice/arc-kit#424

---

## Two layers of validation

This recipe contribution has two distinct validation layers, against two different test fixtures:

| Layer | What it tests | Test fixture | Status |
|-------|---------------|--------------|--------|
| **A — SKILL.md content quality** | Do the 8 community commands produce credible, evidence-anchored, AU-jurisdiction-compliant artefacts when invoked against real client evidence? | A real Australian SMB engagement (DISP-track, OFFICIAL:Sensitive, pure-SaaS estate). Underlying artefacts available under NDA on request | ✅ Done — see Layer A scorecard below |
| **B — Recipe wave-plan validity** | Does the build harness correctly schedule the 35-target DAG defined in `au-federal.yaml`? | A scratch AU test project initialised under `arckit-au` overlay config | ✅ Schema validates `ok` locally; wave plan computed via topological sort matching the build harness algorithm |

**Why two test fixtures**: SKILL.md content quality requires real-client evidence to validate the recipe produces useful compliance artefacts at OFFICIAL:Sensitive (no public AU evidence pack of comparable scope exists). Recipe wave-plan validity is mechanical / structural and is best tested against the canonical AU proof-of-concept repo.

---

## Layer A — SKILL.md content quality (validated against AU SMB engagement)

### Headline numbers

| Metric | Value |
|--------|-------|
| Evaluation runs | 9 |
| ArcKit artefacts produced | 8 |
| Total compliance documentation | ~4,093 lines |
| Evaluation scorecard pass rate | 25/25 (clean pass at Run 3) |
| UK framework leakage in artefacts | 0 |
| AU framework references in artefacts | 220 |
| AU framework references in 8 SKILL.md commands (this PR) | 188 |
| UK comparison references in 8 SKILL.md commands (intentional, in au-dss + au-pia) | 2 |
| AU classification references in artefacts | 23 |
| Cross-recipe references at scale | AUDISP=21, AUPSPF=22, AUAIA=18, AUISM=12, AUNDB=12 |

### What was tested — per-command

| Command | Framework anchor | Sub-controls assessed | Pass/Fail signal | Validation run |
|---------|------------------|------------------------|-------------------|----------------|
| `au-e8-posture` | ASD Essential Eight Maturity Model | 8 mitigation strategies × 4 maturity levels (ML0–ML3) | ✅ Pass — produced ML rating per strategy with evidence + remediation; cumulative-ML rule held | Runs 1–3 (Track A → Track B Evidence Index → Track B PnP refresh) |
| `au-pia` | Privacy Act 1988 (Cth) | All 13 APPs assessed; APP 8 cross-border + APP 11 security cross-refs maintained; sensitive information (s 6) catalogued | ✅ Pass — 0 ✅ Compliant / 8 ⚠️ Partial / 4 ❌ Non-Compliant / 1 N/A; APP 11 reasonable-steps test correctly flagged pending E8 evidence elevation | Run 1 |
| `au-dss` | DTA Digital Service Standard | All 13 criteria assessed; C5 cross-refs E8, C7 cross-refs PIA | ✅ Pass — borderline-applicability handled honestly (private-APP-entity case opened with explicit caveat; reframed as flow-down maturity benchmark) | Run 1 |
| `au-ism-controls` | ASD Information Security Manual | All 17 control domains assessed at OFFICIAL:Sensitive classification; IRAP-inheritance pattern correctly applied per-domain | ✅ Pass — Domain 9 correctly delegated to AUE8; Domain 4 (SSP/SRMP/CMP/IRP) surfaced as ❌ Not Implemented (genuinely-new finding beyond AUE8/AUPIA/AUDSS) | Run 4 |
| `au-ndb-playbook` | Privacy Act 1988 Part IIIC + OAIC NDB scheme | Eligibility decision tree + 30-day timeline + RACI + 3 tabletop scenarios + multi-jurisdiction clock coordination | ✅ Pass — operationally usable artefact; correctly identified Privacy Officer designation as chained-dependency gateway; multi-clock matrix surfaced DISP 24hr as binding shortest clock | Run 5 |
| `au-disp-attestation` | DISP (Defence Industry Security Program) | 4 security domains (Governance / Personnel / Physical / Information & Cyber) + FOCI declaration + supply chain + annual board attestation | ✅ Pass — 4 critical attestation blockers identified; 13-item Critical Path produced; FOCI material surfaced as genuinely-new finding | Run 6 |
| `au-pspf` | Protective Security Policy Framework | All 4 outcomes / 16 core requirements; PSPF Self-Assessment vocabulary applied (Compliant / Substantially / Partly / Not Compliant) | ✅ Pass — 0 Compliant / 2 Substantially / 12 Partly / 1 Not Compliant / 1 Inherited; CR12 Insider Threat surfaced as genuinely-new finding | Run 7 |
| `au-ai-assurance` | DTA AI Assurance Framework + Responsible AI Policy v2.0 + AU AI Ethics Principles + ISO 42001 + Privacy Act AI-decision notification (Dec 2026) | DTA RAI 6 accountabilities + 8 AU AI Ethics Principles + ISO 42001 7 clauses + Privacy Act AI notification + fairness assessment + AI training/inference data security | ✅ Pass — Microsoft 365 Copilot deployment (155 users / 91% adoption) correctly identified despite "thin AI evidence" framing; tender-compliance gap on DTA AI Policy v2.0 disclosure surfaced as genuinely-new finding | Run 8 |

### What was tested — at scorecard level

`EVALUATION.md` scorecard four-section breakdown at Run 3:

| Section | Criterion | Result |
|---------|-----------|--------|
| Content Quality (7 criteria) | E8 covers all 8 strategies | ✅ Pass — all 8 strategy assessment blocks present |
| Content Quality | ML levels are cumulative | ✅ Pass — explicit cumulative-ML rule applied |
| Content Quality | Engagement context correctly interpreted | ✅ Pass — pure-SaaS, MSP boundary, DISP L2 in-progress (interview correctly trusted over brief) |
| Content Quality | E8 cloud shared-responsibility correct | ✅ Pass — Cloud-Specific Considerations table per-strategy |
| Content Quality | DSS covers all 13 criteria | ✅ Pass |
| Content Quality | PIA covers all 13 APPs | ✅ Pass |
| Content Quality | PIA information flow diagram present | ✅ Pass — Mermaid DFD with APP annotations |
| AU-vs-UK Differentiation (7 criteria) | Zero UK framework leakage | ✅ Pass — `\b(NCSC\|ICO\|Cyber Essentials\|GovS\|UK GDPR\|GDS\|Cabinet Office\|DPA 2018\|DPIA)\b` returns 0 hits in artefacts |
| AU-vs-UK Differentiation | AU classification system used | ✅ Pass — UNOFFICIAL/OFFICIAL:Sensitive/PROTECTED appears 23 times |
| AU-vs-UK Differentiation | AU regulators referenced | ✅ Pass — 220 AU framework references in artefacts; 188 in this PR's 8 SKILL.md commands |
| AU-vs-UK Differentiation | DISP assessed (not Cyber Essentials) | ✅ Pass — dedicated DISP Compliance Position section; no Cyber Essentials |
| AU-vs-UK Differentiation | IRAP referenced (not Cloud Security Principles) | ✅ Pass — IRAP appears 9× in AUE8 alone; no UK Cloud Security Principles |
| AU-vs-UK Differentiation | Privacy Act 1988 (not UK GDPR) | ✅ Pass — Privacy Act 1988 + 13 APPs throughout AUPIA; no GDPR/ICO/DPA 2018 |
| AU-vs-UK Differentiation | DTA DSS (not GDS Service Standard) | ✅ Pass — 13 AU criteria, not 14 UK points |
| Cross-Reference Integrity (4 criteria) | E8 → PIA cross-ref | ✅ Pass — AUPIA APP 11 references AUE8 |
| Cross-Reference Integrity | DSS → E8 cross-ref | ✅ Pass — AUDSS C5 references AUE8 |
| Cross-Reference Integrity | DSS → PIA cross-ref | ✅ Pass — AUDSS C7 references AUPIA |
| Cross-Reference Integrity | Citation traceability | ✅ Pass — all artefacts use `[DOC_ID-CN]` inline markers per `references/citation-instructions.md` |
| Professional Judgment Comparison (7 criteria) | MFA coverage (boundary question) | ✅ Match (lifted from PARTIAL Run 1 → MATCH Run 2 with CA Policy evidence) |
| Professional Judgment | Admin privilege separation | ✅ Match — MSP-held Global Admin governance gap correctly flagged |
| Professional Judgment | Application control on SaaS reframe | ✅ Match — explicit reframe from endpoint allowlisting to SaaS app governance |
| Professional Judgment | Patching | ✅ Match — vendor-managed for SaaS correctly attributed |
| Professional Judgment | Data classification (security clearance gap) | ✅ Match — correctly identified |
| Professional Judgment | Content sprawl (Hypothesis 1) | ✅ Match (lifted from PARTIAL Run 1 → PARTIAL Run 2 → MATCH Run 3 with PnP evidence: 17 "Project -" sites holding 650 GB; 4,428 CVs in proposals library; 4 empty PnP CSVs) |
| Professional Judgment | Privacy — APP 8 cross-border | ✅ Match — APP 8 ❌ Non-Compliant; vendor data-residency unmapped surfaced |

**Total at Run 3**: 25/25 ✅; Run 1 had 23 ✅ + 2 PARTIAL; Run 2 had 24 ✅ + 1 PARTIAL; Run 3 closed both partials → clean 25/25.

### Mechanical verification commands (reproducible)

Reviewers can run these against the underlying artefacts (or a redacted variant) to confirm the headline numbers:

```bash
# UK framework leakage check (in artefacts)
grep -rE "\b(NCSC|ICO|Cyber Essentials|GovS|UK GDPR|GDS|Cabinet Office|DPA 2018|DPIA)\b" \
  projects/<test-project>/ARC-*-AU*-v*.md | wc -l
# Expected: 0

# AU framework presence check (in artefacts)
grep -rE "\b(ASD|ACSC|OAIC|DTA|PSPF|IRAP|DISP|APP|ISM|Privacy Act 1988)\b" \
  projects/<test-project>/ARC-*-AU*-v*.md | wc -l
# Expected: ~220

# UK leakage in this PR's 8 SKILL.md commands (intentional comparisons in au-dss + au-pia)
grep -rE "\b(NCSC|ICO|Cyber Essentials|GovS|UK GDPR|GDS|Cabinet Office|DPA 2018|DPIA)\b" \
  arckit-au/commands/au-*.md | wc -l
# Expected: 2 (intentional cross-references)

# AU framework presence in this PR's 8 SKILL.md commands
grep -rE "\b(ASD|ACSC|OAIC|DTA|PSPF|IRAP|DISP|APP|ISM|Privacy Act 1988)\b" \
  arckit-au/commands/au-*.md | wc -l
# Expected: 188

# AU classification presence
grep -rE "UNOFFICIAL|OFFICIAL:Sensitive|PROTECTED|SECRET" \
  projects/<test-project>/ARC-*-AU*-v*.md | wc -l
# Expected: ~23
```

### Genuinely-new findings per validation run

Strongest signal that each command adds value beyond mere consolidation — every one of the 5 secondary validation runs surfaced a finding that didn't appear in any prior artefact:

| Run | Command | Genuinely-new finding |
|-----|---------|------------------------|
| 4 | `au-ism-controls` | Domain 4 (Security Documentation) ❌ — SSP/SRMP/CMP/IRP not produced. Single highest-leverage gap across the entire ISM applicability statement |
| 5 | `au-ndb-playbook` | Multi-jurisdiction notification coordination matrix — NDB 30-day + DISP 24hr + SOCI 12hr/72hr + NZ Privacy + EU GDPR. DISP 24hr typically expires before NDB assessment is complete |
| 6 | `au-disp-attestation` | FOCI declaration material — Australian-headquartered with US-PE backer triggers Level 2 FOCI mitigation requirement |
| 7 | `au-pspf` | CR12 Insider Threat programme dimension — content-management modifiers reframed beyond privileged-access governance into insider-threat programme question |
| 8 | `au-ai-assurance` | DTA AI Policy v2.0 tender-compliance disclosure gap — engagement firm authors tender content with Microsoft Copilot (deployed to 91% of users) but tender-response template doesn't disclose AI use |

### Recipe quality patterns demonstrated

1. **Epistemic honesty under thin evidence** — Track A clean-slate run reported ML0-not-verifiable rather than fabricating ML scores. AUAIA acknowledged thin AI-specific discovery but still surfaced real Copilot deployment from Cloud App Discovery
2. **Correct ML elevation when evidence is rich** — Track B Evidence Index run elevated 4 of 8 E8 strategies from ML0 to defensible ML1; PnP refresh added quantitative substantiation without over-elevating to ML2
3. **Cumulative ML rule held** — no strategy elevated to ML2 prematurely across all 9 runs
4. **Cross-recipe consolidation works at 8-document scale** — AUDISP cross-referenced 5 prior artefacts; AUPSPF cross-referenced 6
5. **Borderline applicability handled honestly** — DSS / PSPF / AI-assurance all opened with applicability caveats for the private-APP-entity case
6. **Genuinely-new findings per validation run** — every one of the 5 secondary runs surfaced material findings not present in any prior artefact

---

## Layer B — Recipe wave-plan validity

### Schema validation — passes

Maintainer's verbatim validation snippet from #424:

```bash
$ python -c "import yaml; r=yaml.safe_load(open('arckit-au/recipes/au-federal.yaml')); ids = {t['id'] for t in r['targets']}; deps_ok = all(d.rstrip('*') in {i.rstrip('-') for i in ids} or any(i.startswith(d.rstrip('*')) for i in ids) for t in r['targets'] for d in t['deps']); print('ok' if deps_ok else 'FAIL')"
ok
```

### Recipe shape

| Field | Value |
|-------|-------|
| `recipe` | `au-federal` |
| `schema_version` | `1` |
| `defaults.version` | `"1.0"` |
| `optional_targets` | 9 (AIP, ORG_RESEARCH, RESEARCH, AWS_RESEARCH, AZURE_RESEARCH, GCP_RESEARCH, DATASCOUT, DATA_MODEL, TRACEABILITY) |
| `post_build_hooks` | 2 (arckit:health, arckit:pages) |
| **Total targets** | **35** |

Target breakdown by group:

| Cohort | Count | Targets |
|--------|-------|---------|
| Foundation | 4 | PRIN, GLOSSARY, REQ, STKE |
| Research wave (optional) | 6 | ORG_RESEARCH, RESEARCH, AWS_RESEARCH, AZURE_RESEARCH, GCP_RESEARCH, DATASCOUT |
| AU community commands | 8 | AU_E8, AU_ISM, AU_PIA, AU_NDB, AU_DSS, AU_PSPF, AU_AI, AU_DISP |
| ADRs | 8 | ADR-001 (Cloud + IRAP), ADR-002 (Identity), ADR-003 (Classification), ADR-004 (AI), ADR-005 (Logging), ADR-006 (Deployment), ADR-007 (Build vs buy), ADR-008 (OSS) |
| Cross-cutting | 3 | DATA_MODEL, RISK, HLD |
| Strategic | 3 | STRATEGY, WARDLEY, SOBC |
| Optional reference | 1 | AIP (UK AI Playbook reference) |
| Synthesis | 2 | FRAMEWORK, TRACEABILITY |

### Wave plan — computed locally

Topological sort over `targets[].deps` with glob expansion (`ADR-*` → all `ADR-` prefixed targets), matching the algorithm in `arckit-claude/skills/arckit-build/SKILL.md` § "Wave plan algorithm":

| Wave | Count | Targets |
|------|-------|---------|
| W0 | 2 | `ORG_RESEARCH`, `PRIN` |
| W1 | 3 | `GLOSSARY`, `REQ`, `STKE` |
| W2 | 11 | `ADR-002`, `ADR-008`, `AU_E8`, `AU_PIA`, `AWS_RESEARCH`, `AZURE_RESEARCH`, `DATASCOUT`, `GCP_RESEARCH`, `RESEARCH`, `STRATEGY`, `WARDLEY` |
| W3 | 7 | `ADR-001`, `ADR-007`, `AU_AI`, `AU_DSS`, `AU_ISM`, `AU_NDB`, `DATA_MODEL` |
| W4 | 4 | `ADR-003`, `ADR-004`, `ADR-005`, `AU_PSPF` |
| W5 | 3 | `ADR-006`, `AIP`, `AU_DISP` |
| W6 | 2 | `HLD`, `RISK` |
| W7 | 2 | `SOBC`, `TRACEABILITY` |
| W8 | 1 | `FRAMEWORK` |
| W9 (post-build) | 2 | `arckit:health`, `arckit:pages` |

**9 build waves, max parallelism 11 (W2), 35 targets total**. No cycles, no orphan targets, no unresolved deps. Comparable in shape to `ca-federal-fitaa.yaml` (~9 waves, max parallelism ~6, ~30 targets).

### Re-running the wave-plan dry run maintainer-side

```bash
# In a scratch repo with the ArcKit plugin enabled:
mkdir -p .arckit/recipes
cp <upstream-arc-kit>/arckit-au/recipes/au-federal.yaml .arckit/recipes/

# Then in a Claude Code session with the ArcKit plugin enabled:
/arckit:build <project-name> --recipe au-federal --plan
```

The harness reads the recipe from `.arckit/recipes/` first (precedence per `arckit-build/SKILL.md` § "Recipe loading"), so the project override picks up before any plugin default.

---

## Layer C — Currency + review-feedback updates since PR open

The scorecard's Layer A (SKILL.md content quality against the AU SMB engagement) and Layer B (recipe wave-plan structural validity) are **snapshots at PR open (2026-05-06)**. Layer C captures changes that landed **after** the original validation runs — both review-feedback fixes (round-2) and currency updates beyond the maintainer's review (AI6).

Layer C's evidence type differs from A and B:

| Layer | Evidence type | Strength |
|-------|---------------|----------|
| A | Validated against real client artefacts (AU SMB engagement, NDA-locked) | Strongest — but not reviewable without NDA |
| B | Mechanical / structural (schema validates, topological sort completes) | Reviewable, deterministic |
| C | Source verification + mechanical grep (URL liveness, canonical-wording match, regression-test pass) | Reviewable; weaker than A but stronger than self-assertion |

Layer A's headline claims (9 runs, 25/25, 220 AU references in artefacts, 0 UK leakage) remain anchored to the original SMB engagement and are not affected by the changes below — that engagement predates the round-2 + AI6 work and is not being re-run.

### Update 1 — Round-2 review-feedback fixes (2026-05-07)

**Why added**: Responding to maintainer review #441 round 2, which identified 4 IMPORTANT items after the round-1 BLOCKERS were resolved.

**What was changed**:

| Round-2 item | What changed | Files |
|--------------|--------------|-------|
| #2 citation-instructions parity | 4 AU commands gained `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md` reference in their External References step. Brings all 8 AU commands to parity with the canonical `ca-*` pattern. | `au-ai-assurance`, `au-disp-attestation`, `au-ndb-playbook`, `au-pspf` |
| #3 severity flags | `AUDSS` (DTA Digital Service Standard Conformance) + `AUPSPF` (PSPF Scorecard) bumped to `severity: 'HIGH'`. Both go to senior accountable officers (DTA conformance / CSO), matching the heuristic the other 6 AU codes follow. | `arckit-claude/config/doc-types.mjs` |
| #4 flagship key | Top-level `flagship: AU_DISP` declared explicitly in recipe YAML — previously documented only in the comment header + README. | `arckit-au/recipes/au-federal.yaml` |
| DISP template lint propagation | Maintainer's `c18eefab` removed a consecutive blank line in the canonical `au-disp-attestation-template.md`; converter regen propagates the fix to the four extension copies. | `arckit-{codex,opencode,copilot,paperclip}/templates/au-disp-attestation-template.md` |
| Paperclip surgical regen | `commands.json` updated for 16 entries (4 AU + 12 UAE — the latter propagating the round-1 doc-id fix that the maintainer's surgical merge had inadvertently missed for paperclip) while preserving the 5 v4.16+ Claude-only entries (datascout/gov-reuse/grants/pages/wardley) byte-identical to `c18eefab`. | `arckit-paperclip/src/data/commands.json` |
| Documentation catch-up | `CHANGELOG.md [Unreleased]` block populated with the round-2 + AI6 entries; `docs/guides/au-federal-overlay.md` describes AI6 in the `au-ai-assurance` section and Reference Anchors. | `CHANGELOG.md`, `docs/guides/au-federal-overlay.md` |

**Mechanical verification commands**:

```bash
# Item #2 — all 8 AU commands reference citation-instructions
grep -lE 'references/citation-instructions\.md' arckit-au/commands/au-*.md | wc -l
# Expected: 8

# Item #3 — AUDSS + AUPSPF carry severity: 'HIGH'
grep -E "'AU(DSS|PSPF)':.*severity: 'HIGH'" arckit-claude/config/doc-types.mjs | wc -l
# Expected: 2

# Item #4 — recipe declares flagship: AU_DISP
grep -c '^flagship: AU_DISP$' arckit-au/recipes/au-federal.yaml
# Expected: 1

# UAE doc-id signature (round-1 fix propagated to paperclip JSON via surgical regen)
grep -c "generate-document-id.sh <PROJECT_ID>" arckit-paperclip/src/data/commands.json
# Expected: >= 20 (8 AU + 12 UAE entries)
```

**Test coverage** — 11 new regression-guard assertions in `tests/plugin/test_au_federal_recipe.py`:

| Test name | Cardinality | What it asserts |
|-----------|-------------|------------------|
| `test_round2_item2_command_references_citation_instructions[...]` | 8 (parametrised) | Every AU command references `citation-instructions.md` |
| `test_round2_item3_audss_aupspf_severity_high[AUDSS]` / `[AUPSPF]` | 2 | Both bumped to `severity: 'HIGH'` |
| `test_round2_item4_recipe_declares_au_disp_flagship` | 1 | Recipe top-level declares `flagship: AU_DISP` |

Run: `pytest tests/plugin/test_au_federal_recipe.py -k round2` — expected 11 passing.

### Update 2 — AU Essential AI Practices (AI6) currency addition (2026-05-08)

**Why added**: The National AI Centre (NAIC) published its 6 Essential AI Practices ("AI6") framework in October 2025; the current Foundations + Implementation Guidance pages on `ai.gov.au` are the most operationally-current Australian AI guidance for 2026. The original `au-ai-assurance` command covered DTA Responsible AI Policy v2.0, AU AI Ethics Principles, ISO 42001, and Privacy Act AI-decision notification — but not AI6 by name. An AI Assurance assessment for any AU project in 2026 without an AI6 alignment section would be a notable omission. Currency-update commit beyond the maintainer's review scope.

**Source verification**:

| Source | URL fragment | Last verified | Status |
|--------|--------------|---------------|--------|
| NAIC Essential AI Practices — Foundations | `ai.gov.au/.../guidance-ai-adoption-foundations` | 2026-05-08 | 200 OK (verified via `curl`) |
| NAIC Essential AI Practices — Implementation Guidance | `ai.gov.au/.../guidance-ai-adoption-implementation-guidance` | 2026-05-08 | Linked directly from Foundations page; same publisher (NAIC) |

**Six canonical AI6 practices** (preserved verbatim from `ai.gov.au` page headings):

| # | Practice | Source anchor on ai.gov.au |
|---|----------|-----------------------------|
| 1 | Decide who is accountable | `#1-decide-who-is-accountable` |
| 2 | Understand impacts and plan accordingly | `#2-understand-impacts-and-plan-accordingly` |
| 3 | Measure and manage risks | `#3-measure-and-manage-risks-implement-ai-specific-risk-management` |
| 4 | Share essential information | `#4-share-essential-information` |
| 5 | Test and monitor | `#5-test-and-monitor` |
| 6 | Maintain human control | `#6-maintain-human-control` |

**Mechanical verification commands**:

```bash
# AI6 framework named in au-ai-assurance.md
grep -cE "AI6|Essential AI Practices|National AI Centre|NAIC" \
  arckit-au/commands/au-ai-assurance.md
# Expected: >= 4 (Context + Anchors + Process step + External Refs)

# All 6 canonical practice names present
for p in "Decide who is accountable" \
         "Understand impacts and plan accordingly" \
         "Measure and manage risks" \
         "Share essential information" \
         "Test and monitor" \
         "Maintain human control"; do
  grep -q "$p" arckit-au/commands/au-ai-assurance.md && echo "OK: $p" \
    || echo "MISS: $p"
done
# Expected: 6 OK lines

# Canonical URLs in External References (Foundations + Implementation Guidance)
grep -cE "essential-ai-practices/guidance-ai-adoption-(foundations|implementation-guidance)" \
  arckit-au/templates/au-ai-assurance-template.md
# Expected: >= 2

# Overlay guide describes AI6 (catches doc/source drift)
grep -cE "AI6|Essential AI Practices" docs/guides/au-federal-overlay.md
# Expected: >= 3 (au-ai-assurance section + use-case bullets + Reference Anchors)

# Confidentiality boundary — no proprietary cross-walks leaked.
# Scoped to arckit-claude/ (the actual PR content). docs/ is free to describe
# the exclusion in prose — see "Public-domain scope" below for what's omitted.
# Uses crosswalk-shaped patterns rather than mere co-occurrence to avoid
# false-positives on legitimate listings (e.g., "DTA Policy, AI6, ISO 42001
# MUST appear in the Document Register" is a list, not a crosswalk).
grep -rE "AI6\s*↔|↔\s*AI6|AI6.*crosswalk|crosswalk.*AI6|AI6.*mapped to|mapped to.*AI6|AI6.*coverage analysis" \
  arckit-claude/ 2>/dev/null | wc -l
# Expected: 0
# Rationale: AI6 ↔ ISO 42001 / NIST AI RMF / Singapore AI Verify crosswalks are
# the contributor's commercial advisory IP and are explicitly excluded from this PR.
```

**Test coverage** — 11 new pytest assertions in `tests/plugin/test_au_federal_recipe.py`:

| Test name | Cardinality | What it asserts |
|-----------|-------------|------------------|
| `test_ai6_command_references_ai6_framework` | 1 | au-ai-assurance.md references AI6, Essential AI Practices, NAIC |
| `test_ai6_command_lists_each_essential_practice[...]` | 6 (parametrised) | Each canonical practice name appears verbatim |
| `test_ai6_template_has_alignment_section_with_all_6_practices[...]` | 2 | Both template paths (canonical + CLI dual-sync) have section 4 with 6-row table |
| `test_ai6_template_external_references_include_ai6[...]` | 2 | Verification table includes both Foundations + Implementation URLs |

Plus 1 documentation-drift guard:

| `test_ai6_overlay_guide_mentions_ai6` | 1 | docs/guides/au-federal-overlay.md cites AI6 + canonical name + Foundations URL |

Run: `pytest tests/plugin/test_au_federal_recipe.py -k ai6` — expected 12 passing (11 framework-fidelity + 1 doc-drift guard).

**Public-domain scope**:

The AI6 addition uses **only public-domain NAIC content** — framework name, 6 practice titles, canonical URLs, cross-framework alignment to DTA Responsible AI Policy v2.0 (DTA's own published policy) and AU AI Ethics Principles (Department of Industry's own framework).

Explicitly **excluded** (protected as separate commercial advisory IP, not part of this PR):

- AI6 ↔ ISO/IEC 42001 control-area mapping
- AI6 ↔ NIST AI RMF function mapping
- AI6 ↔ Singapore IMDA AI Verify (85 testable criteria) mapping
- AI6 coverage analysis / gap percentages against any of the above
- Implementation methodology for assessing each practice

The confidentiality-grep above (`grep -rE "AI6\s*↔|crosswalk|mapped to|coverage analysis" arckit-claude/`) mechanically verifies the exclusion against the PR's actual content (canonical commands + templates + config). A reviewer running it without context can confirm no proprietary mapping has been accidentally published. The grep is deliberately scoped to `arckit-claude/` — `docs/` is free to describe what's excluded in prose (such as the bullets above) without tripping the test.

### Drift since PR open — Layer A mechanical claims rerun

| Original PR-open claim | Value at 2026-05-08 | Drift | Cause |
|------------------------|---------------------|-------|-------|
| UK leakage in PR commands = 2 | 2 | 0 | Intentional comparisons in `au-dss` + `au-pia` unchanged |
| AU framework presence in PR commands = 188 | 190 | +2 | AI6 addition contributes "NAIC" + canonical anchor mentions |
| AU type code count = 8 | 8 | 0 | No new codes (AI6 is content within `AUAIA`, not a new code) |
| Recipe target count = 35 | 35 | 0 | AI6 sits within the existing `AU_AI` target, not a new target |
| pytest test count *(new metric — not tracked at PR open)* | 191 | n/a | Grew through rounds: 61 baseline → 168 (round-1 + Tier 1) → 179 (round-2) → 190 (AI6) → 191 (doc-drift guard) |

### Test architecture evolution

The test suite has grown from 61 baseline tests at PR open to 191 at HEAD across the 5-tier architecture established in round 1:

| Tier | Purpose | Baseline | Round 1 | Round 2 | AI6 | HEAD |
|------|---------|----------|---------|---------|-----|------|
| Existence + integration | Files / schemas / IDs / registrations exist and resolve | 61 | 61 | 61 | 61 | 61 |
| Review-guard (round 1) | Each round-1 blocker / important item encoded as assertion | — | 76 | 76 | 76 | 76 |
| Tier 1 (framework / source / provenance) | Regulator-defined contract numbers; recipe ↔ source ↔ doc-types consistency; authoritative URL fragments | — | 31 | 31 | 31 | 31 |
| Review-guard (round 2) | Each round-2 IMPORTANT item encoded as assertion | — | — | 11 | 11 | 11 |
| Currency (AI6) + doc-drift | AI6 framework fidelity + guide describes AI6 | — | — | — | 11 | 12 |
| **Total** | | **61** | **168** | **179** | **190** | **191** |

All tiers green at HEAD.

---

## Pre-publication redactions

The underlying artefacts contain client-specific evidence references that are NOT included in this PR:

- The 8 ArcKit artefacts (`ARC-002-AU*-v*.md`) reference an anonymised "real AU SMB engagement"
- Specific user names, file paths, and org-internal data not surfaced in this scorecard

If reviewers need to see the underlying artefacts to validate the headline numbers, they can be shared under NDA on request to @royster70.

---

## Pointers for further sanity-check

| Want to verify | Where to look |
|----------------|---------------|
| Recipe schema validates | Run the maintainer's verbatim snippet (above) — confirmed `ok` locally |
| Wave-plan computes | Either (a) re-run the topological sort against the recipe (deterministic — same algorithm as the build harness) or (b) run `/arckit:build <project> --recipe au-federal --plan` against `arckit-au-test-project` |
| Converter outputs match | After commands placed in canonical paths, run `python scripts/converter.py` and inspect generated Codex/OpenCode/Gemini/Copilot/Paperclip variants in their respective folders |
| 0 UK leakage in artefacts | Mechanical grep — script in this scorecard above |
| 220 AU references in artefacts | Mechanical grep — script in this scorecard above |
| 188 AU references in this PR's commands | `grep -rE "\b(ASD\|ACSC\|OAIC\|DTA\|PSPF\|IRAP\|DISP\|APP\|ISM\|Privacy Act 1988)\b" arckit-au/commands/au-*.md \| wc -l` |
| Cross-reference integrity | Each AU artefact has a Document Register listing every cross-reference; AUDISP §13 has the consolidated 13-item Critical Path showing how all 8 commands' outputs feed into the attestation pack |

---

**Generated**: 2026-05-06 by @royster70 for tractorjuice/arc-kit#424 PR submission.
**Layer C addendum**: 2026-05-08 — round-2 review-feedback fixes (#441) + AI6 currency update; existing Layer A and Layer B sections preserved as the original PR-open snapshot.
**Cross-references**: [`arckit-au/recipes/au-federal.yaml`](../arckit-au/recipes/au-federal.yaml); [`docs/guides/au-federal-overlay.md`](guides/au-federal-overlay.md); underlying artefacts available on request under NDA.
