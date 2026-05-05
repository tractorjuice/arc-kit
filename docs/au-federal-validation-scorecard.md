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
| **B — Recipe wave-plan validity** | Does the build harness correctly schedule the 35-target DAG defined in `au-federal.yaml`? | [`arckit-test-project-v44-australian-gov`](https://github.com/tractorjuice/arckit-test-project-v44-australian-gov) — the canonical AU proof-of-concept test repo named in the maintainer's #424 References (full name; the `arckit-test-project-v44` shorthand expanded) | ✅ Schema validates `ok` locally; wave plan computed via topological sort matching the build harness algorithm |

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
  arckit-claude/commands/au-*.md | wc -l
# Expected: 2 (intentional cross-references)

# AU framework presence in this PR's 8 SKILL.md commands
grep -rE "\b(ASD|ACSC|OAIC|DTA|PSPF|IRAP|DISP|APP|ISM|Privacy Act 1988)\b" \
  arckit-claude/commands/au-*.md | wc -l
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
$ python -c "import yaml; r=yaml.safe_load(open('arckit-claude/skills/arckit-build/recipes/au-federal.yaml')); ids = {t['id'] for t in r['targets']}; deps_ok = all(d.rstrip('*') in {i.rstrip('-') for i in ids} or any(i.startswith(d.rstrip('*')) for i in ids) for t in r['targets'] for d in t['deps']); print('ok' if deps_ok else 'FAIL')"
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
git clone https://github.com/tractorjuice/arckit-test-project-v44-australian-gov.git
cd arckit-test-project-v44-australian-gov

# Drop the recipe in via project override:
mkdir -p .arckit/recipes
cp <upstream-arc-kit>/arckit-claude/skills/arckit-build/recipes/au-federal.yaml .arckit/recipes/

# Then in a Claude Code session with the ArcKit plugin enabled:
/arckit:build <project-name> --recipe au-federal --plan
```

The harness reads the recipe from `.arckit/recipes/` first (precedence per `arckit-build/SKILL.md` § "Recipe loading"), so the project override picks up before any plugin default.

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
| Wave-plan computes | Either (a) re-run the topological sort against the recipe (deterministic — same algorithm as the build harness) or (b) run `/arckit:build <project> --recipe au-federal --plan` against `arckit-test-project-v44-australian-gov` |
| Converter outputs match | After commands placed in canonical paths, run `python scripts/converter.py` and inspect generated Codex/OpenCode/Gemini/Copilot/Paperclip variants in their respective folders |
| 0 UK leakage in artefacts | Mechanical grep — script in this scorecard above |
| 220 AU references in artefacts | Mechanical grep — script in this scorecard above |
| 188 AU references in this PR's commands | `grep -rE "\b(ASD\|ACSC\|OAIC\|DTA\|PSPF\|IRAP\|DISP\|APP\|ISM\|Privacy Act 1988)\b" arckit-claude/commands/au-*.md \| wc -l` |
| Cross-reference integrity | Each AU artefact has a Document Register listing every cross-reference; AUDISP §13 has the consolidated 13-item Critical Path showing how all 8 commands' outputs feed into the attestation pack |

---

**Generated**: 2026-05-06 by @royster70 for tractorjuice/arc-kit#424 PR submission.
**Cross-references**: [`arckit-claude/skills/arckit-build/recipes/au-federal.yaml`](../arckit-claude/skills/arckit-build/recipes/au-federal.yaml); [`docs/guides/au-federal-overlay.md`](guides/au-federal-overlay.md); underlying artefacts available on request under NDA.
