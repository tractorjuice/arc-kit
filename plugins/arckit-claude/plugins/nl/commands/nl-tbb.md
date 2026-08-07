---
description: "[COMMUNITY] Determine the Te Beschermen Belangen (TBB) category and VIRBI 2025 rubricering for a system or dataset, using the BIV scoring method from the TBB systematiek toolkit"
doc-type: TBB
argument-hint: "<project ID or dataset/system description, e.g. '001', 'case file system handling law-enforcement correspondence'>"
effort: medium
handoffs:
  - command: nl-cloud
    description: Feed the determined TBB category into the clause 5.2 cloud eligibility check
    condition: "TBB category determined and cloud hosting is under consideration for this system"
  - command: nl-bio
    description: Use the TBB-derived BIV scores to prioritise BIO2 control assessment
    condition: "BIO2 conformance assessment for this system has not yet incorporated the BIV scores"
  - command: risk
    description: Reflect the TBB category and any Stg. classification implications in the risk register
    condition: "Risks tied to information classification are not yet reflected in ARC-*-RISK"
---


> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output should be reviewed by qualified counsel and the departmental security officer before reliance. Citations to VIRBI 2025 and the TBB systematiek may lag the current text — verify against the source.

You are helping an enterprise architect determine the **Te Beschermen Belangen (TBB) category** for a system or dataset, using the TBB systematiek — "Gereedschap: Te Beschermen Belangen", v1.0, 6 June 2026, part of the Toolkit VIRBI 2025. Its legal basis is the Besluit BVA-stelsel Rijksdienst 2021 (BWBR0044617). The TBB category is the input other Dutch government cloud and security commands (`/arckit-nl:nl-cloud`, `/arckit-nl:nl-bio`) consume — determine it here rather than re-deriving it downstream.

## User Input

```text
$ARGUMENTS
```

## Instructions

> **Note**: The ArcKit Project Context hook has already detected all projects, artifacts, external documents, and global policies. Use that context below — no need to scan directories manually.

### Step 0: Read existing artifacts from the project context

**MANDATORY** (warn if missing):

- **REQ** (Requirements) — Extract: system description, data types processed, sensitivity indicators, security NFRs (NFR-SEC-xxx)
  - If missing: warn that a TBB determination requires a minimum understanding of what information the system handles

**RECOMMENDED** (read if available, note if missing):

- **DATA** (Data Model) — Extract: data assets, existing classification markers, data flows
- **RISK** (Risk Register) — Extract: existing risks tied to information sensitivity

**OPTIONAL** (read if available, skip silently):

- **PRIN** (Architecture Principles, 000-global) — Extract: any existing information classification policy

### Step 0b: Read external documents and policies

- Read any **external documents** in `external/` — extract prior classification decisions, existing Stg.-marked material, correspondence referencing VIRBI
- Read any **global policies** in `000-global/policies/` — extract information classification policy
- If any source material cites **VIRBI 2013**, flag it explicitly as stale: VIRBI 2025 (BWBR0051482, in force 9 September 2025) replaced and repealed VIRBI 2013 on that date.

### Step 1: Identify or Create Project

Identify the target project from the hook context. If the project doesn't exist:

1. Use Glob to list `projects/*/` directories and find the highest `NNN-*` number
2. Calculate the next number (zero-padded to 3 digits)
3. Slugify the project name
4. Use the Write tool to create `projects/{NNN}-{slug}/README.md`
5. Set `PROJECT_ID` and `PROJECT_PATH`

### Step 2: Read Source Artifacts

Read all documents from Step 0. Extract the information types, users, and existing markings relevant to the determination.

### Step 3: Template Reading

**Read the template** (with user override support):

- **First**, check if `.arckit/templates/nl-tbb-template.md` exists in the project root
- **If found**: Read the user's customized template
- **If not found**: Read `${CLAUDE_PLUGIN_ROOT}/templates/nl-tbb-template.md`

### Step 4: Kernbelangen Relevance Assessment

Assess the relevance of each of the five kernbelangen to the information or process in scope: Democratische rechtsorde; Internationale betrekkingen; Veiligheid; Gevoelige beleidszaken; Betrouwbare dienstverlening. Note which are relevant and why — this frames the BIV scoring that follows.

### Step 5: BIV Scoring

Score **Beschikbaarheid**, **Integriteit**, and **Vertrouwelijkheid** independently, each on the same four-point scale: Zeer Hoog / Hoog / Midden / Laag. Score each on the impact of loss of that property — do not let one property's score influence another's.

### Step 6: TBB Category Determination

**CRITICAL**: The TBB category is set by the **highest** of the three BIV scores, not an average and not confidentiality alone. If Beschikbaarheid scores Hoog while Integriteit and Vertrouwelijkheid score Laag, the TBB category is still driven by the Hoog score.

Apply the fixed mapping:

| Highest BIV score | TBB category |
|--------------------|--------------|
| Zeer Hoog | TBB 1 |
| Hoog | TBB 2 |
| Midden | TBB 3 |
| Laag | TBB 4 |

### Step 7: VIRBI 2025 Rubricering Mapping

Map the TBB category to the corresponding VIRBI 2025 rubricering:

| TBB category | VIRBI 2025 rubricering |
|--------------|-------------------------|
| TBB 1 | Stg. ZEER GEHEIM |
| TBB 2 | Stg. GEHEIM |
| TBB 3 | Stg. CONFIDENTIEEL |
| TBB 4 | Departementaal VERTROUWELIJK, or ongerubriceerd met merking |

### Step 8: State the One-Way Inference Warning

**MANDATORY — do not omit or soften this**: The inference between Stg. classification and TBB category runs **one way only**. Information already marked at Stg. GEHEIM implies TBB 2. A system or process determined to be **TBB 2 does not imply it holds Stg. GEHEIM data** — the TBB category reflects the sensitivity of the belang at stake in that process, not an automatic classification of every piece of information inside it. State this explicitly and prominently in the generated document; never state the inference in reverse.

### Step 9: Downstream Implications

State whether the determined TBB category triggers the clause 5.2 public-cloud prohibition (TBB 1–3), and point to `/arckit-nl:nl-cloud` for the full eligibility assessment. Note that the BIV scores also feed `/arckit-nl:nl-bio` control prioritisation.

### Step 10: Generate the Determination Document

**CRITICAL**: Use the **Write tool** to create the determination document.

1. **Detect version**: Check for existing `ARC-{PROJECT_ID}-TBB-v*.md` files:
   - No existing file → VERSION="1.0"
   - Existing file → minor increment if refreshed, major if the underlying data or system scope changed

2. **Auto-populate Document Control**:
   - Document ID: `ARC-{PROJECT_ID}-TBB-v{VERSION}`
   - Status: DRAFT
   - Created Date: {current_date}
   - Next Review Date: {current_date + 12 months}

Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **TBB** per-type checks pass — including that the one-way inference warning is present and not stated in reverse anywhere in the document.

Write the document to:

```text
projects/{project_id}/ARC-{PROJECT_ID}-TBB-v{VERSION}.md
```

### Step 11: Summary Output

```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ TBB / VIRBI 2025 Rubricering Determination Generated
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 Document: projects/{project_id}/ARC-{PROJECT_ID}-TBB-v{VERSION}.md
📋 Document ID: {document_id}
📅 Assessment Date: {date}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 BIV Scores
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Beschikbaarheid: {score}
Integriteit:     {score}
Vertrouwelijkheid: {score}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ TBB category: {TBB 1 / 2 / 3 / 4}   →   VIRBI 2025: {rubricering}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ Reminder: this inference runs one way. A {TBB category} process does NOT
   imply it holds {rubricering} data.

Next steps:
1. {If cloud hosting under consideration: Run /arckit-nl:nl-cloud for the clause 5.2 eligibility check}
2. Run /arckit-nl:nl-bio to prioritise BIO2 controls using these BIV scores
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Important Notes

- **The highest score wins**: Never average the three BIV scores. Never let Vertrouwelijkheid alone decide the category if Beschikbaarheid or Integriteit scored higher.
- **One-way inference is not optional framing**: This is the single most important thing this command must get right. A TBB 2 process is not automatically holding Stg. GEHEIM data. Reversing the inference silently mis-classifies data downstream and can cause an eligible cloud hosting decision to be blocked, or worse, an ineligible one to look eligible.
- **VIRBI 2013 is stale**: If prior assessments or source documents cite VIRBI 2013, flag it — VIRBI 2025 replaced and repealed it on 9 September 2025.
- **This command determines the category; it does not determine the hosting decision.** Run `/arckit-nl:nl-cloud` for the eligibility consequence.
- **Use Write Tool**: This determination is consumed by other commands — always use the Write tool so it can be read back reliably.

## Key References

| Document | Publisher | URL |
|----------|-----------|-----|
| VIRBI 2025 — Besluit voorschrift informatiebeveiliging rijksdienst bijzondere informatie 2025 (BWBR0051482, in force 9 September 2025) | Rijksoverheid | https://wetten.overheid.nl/BWBR0051482 |
| Besluit BVA-stelsel Rijksdienst 2021 (BWBR0044617) | Rijksoverheid | https://wetten.overheid.nl/BWBR0044617 |
| Gereedschap: Te Beschermen Belangen, v1.0, 6 June 2026 (Toolkit VIRBI 2025) | Rijksoverheid | *(not linked — verify current text before citing)* |

> **Note for reviewers**: VIRBI 2025 replaced and repealed VIRBI 2013 on 9 September 2025 — material still referencing VIRBI 2013 is out of date. The TBB systematiek's five kernbelangen (Democratische rechtsorde, Internationale betrekkingen, Veiligheid, Gevoelige beleidszaken, Betrouwbare dienstverlening) frame the assessment; the actual category is set purely by the highest of the three BIV scores, and the inference from an established Stg. classification down to a TBB category is one-directional only.

## Success Criteria

- ✅ Determination document created at `projects/{project_id}/ARC-{PROJECT_ID}-TBB-v{VERSION}.md`
- ✅ All five kernbelangen assessed for relevance
- ✅ Beschikbaarheid, Integriteit, and Vertrouwelijkheid scored independently
- ✅ TBB category set from the highest of the three scores, with the derivation shown
- ✅ TBB category mapped to a VIRBI 2025 rubricering
- ✅ One-way inference warning stated prominently and correctly
- ✅ VIRBI 2013 flagged as superseded if referenced anywhere in source material
- ✅ Downstream cloud-eligibility implication stated where TBB 1–3 applies

## Example Usage

```text
/arckit-nl:nl-tbb Determine the TBB category for a ministry case-file system handling internal audit findings and sensitive policy correspondence

/arckit-nl:nl-tbb TBB determination for 001, citizen-facing benefits platform processing large-scale personal data, no prior classification on record

/arckit-nl:nl-tbb Assess TBB category for an interdepartmental coordination system touching international relations correspondence
```
