---
description: "[COMMUNITY] Determine the Te Beschermen Belangen (TBB) category for a system or dataset using the BIV scoring method from the TBB systematiek toolkit, with any existing VIRBI 2025 rubricering applied as a floor"
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

You are helping an enterprise architect determine the **Te Beschermen Belangen (TBB) category** for a system or dataset, using the TBB systematiek — "Gereedschap: Te Beschermen Belangen", v1.0, 6 June 2026, part of the Toolkit VIRBI 2025. Its legal basis is the Besluit BVA-stelsel Rijksdienst 2021 (BWBR0044617). The TBB category is the input other Dutch government cloud and security commands (`/arckit:nl-cloud`, `/arckit:nl-bio`) consume — determine it here rather than re-deriving it downstream.

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

Also read `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md` — the template's `<!-- DOC-CONTROL-HEADER -->` marker is resolved against these rules before the artefact is written (see Step 10).

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

### Step 7: Apply the Existing Rubricering as a Floor on the Category

**This command never produces a rubricering.** The systematiek treats the rubricering as an *input* to the TBB determination, not an output of it — §2.1 lists "het rubriceringsniveau van de informatie of van het informatiesysteem" first among the criteria the categorisation must take into account.

Record the rubricering the information in scope **already carries**, if any. Then apply the one direction the systematiek authorises (§3.1: *"Andersom geldt dit echter wel. Indien een proces of informatiesysteem gegevens verwerkt of bevat op het niveau van STG GEHEIM, dan is automatisch sprake van indeling in categorie TBB 2."*) as a **floor** on the category from Step 6:

| Existing marking on the information | Category is at least |
|-------------------------------------|----------------------|
| Stg. ZEER GEHEIM | TBB 1 |
| Stg. GEHEIM | TBB 2 |
| Stg. CONFIDENTIEEL | TBB 3 |
| Departementaal VERTROUWELIJK / ongerubriceerd met merking | TBB 4 |
| None recorded | no floor — Step 6 stands |

If the floor is heavier than the BIV-derived category, the floor wins and the final category is the floor; record both and show which bound applied. If the BIV scoring already produced a heavier category, it stands — the floor never lowers a category.

Where the information carries no marking, do **not** infer one. Report "None recorded" and leave the rubricering unstated.

### Step 8: State the One-Way Inference Warning

**MANDATORY — do not omit or soften this**: The relationship between Stg. classification and TBB category is **not symmetrical**. The systematiek states both halves itself, immediately beneath Tabel B in §3.1:

> Let wel, wanneer een te beschermen belang ingedeeld is in categorie TBB 2, hoeft dit niet te betekenen dat het proces of informatiesysteem gegevens verwerkt of bevat op het niveau van STG GEHEIM. Er kunnen andere redenen zijn waarom een proces of informatiesysteem een dergelijke TBB classificering heeft gekregen.
>
> Andersom geldt dit echter wel. Indien een proces of informatiesysteem gegevens verwerkt of bevat op het niveau van STG GEHEIM, dan is automatisch sprake van indeling in categorie TBB 2.

- **Valid** (Step 7): information already marked at Stg. GEHEIM implies TBB 2.
- **Invalid**: a process determined to be TBB 2 does **not** mean the information it holds is Stg. GEHEIM.

The category is set by the **highest** of the three BIV scores, which may be an availability or integrity score. §2.1 notes that for VIRBI purposes the confidentiality aspect is the one that matters — *"(Voor het VIRBI kijken we slechts/vooral naar Vertrouwelijkheid.)"* — so a category driven by Beschikbaarheid says nothing about how the information must be marked.

Tabel B may be reproduced in the artefact as a reference, but only with the caveat above attached, and never executed as a lookup that yields a marking. Determining a rubricering is an act reserved to the departmental security authority under the Besluit BVA-stelsel Rijksdienst 2021; nothing this command produces licenses handling unmarked information as though it were gerubriceerd.

State this explicitly and prominently in the generated document.

### Step 9: Downstream Implications

State whether the determined TBB category triggers the clause 5.2 public-cloud prohibition (TBB 1–3), and point to `/arckit:nl-cloud` for the full eligibility assessment. Note that the BIV scores also feed `/arckit:nl-bio` control prioritisation.

### Step 10: Generate the Determination Document

**CRITICAL**: Use the **Write tool** to create the determination document.

1. Use `node scripts/generate-document-id.mjs <PROJECT_ID> TBB --filename` for the artefact filename.

2. **Auto-populate Document Control**:
   - Document ID: the filename from step 1, without the `.md` extension
   - Status: DRAFT
   - Created Date: {current_date}
   - Next Review Date: {current_date + 12 months}

3. Resolve the `<!-- DOC-CONTROL-HEADER -->` marker per `RENDERING.md` before writing the artefact. `RENDERING.md` hard-routes the NL regime to `_partials/document-control-nl.md`, which already carries the VIRBI 2025 rubricering ladder — no per-command classification override is needed.

4. Populate the External References section per `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. VIRBI 2025 (BWBR0051482) MUST appear in the Document Register with its primary URL and the verification date.

Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **TBB** per-type checks pass — including that the one-way inference warning is present and not stated in reverse anywhere in the document.

Write the document to:

```text
projects/{project_id}/<filename>
```

### Step 11: Summary Output

```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ TBB Category Determination Generated
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
✅ TBB category:              {TBB 1 / 2 / 3 / 4}
🔒 Existing marking in scope: {rubricering already carried, or "none recorded"}
📐 Bound that applied:        {highest BIV score / floor from existing marking}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ Reminder: this determination produces NO rubricering. A {TBB category}
   process does NOT mean the information it holds is gerubriceerd at the
   corresponding level. Marking is an act of the departmental security
   authority, not an output of the TBB systematiek.

Next steps:
1. {If cloud hosting under consideration: Run /arckit:nl-cloud for the clause 5.2 eligibility check}
2. Run /arckit:nl-bio to prioritise BIO2 controls using these BIV scores
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Important Notes

- **The highest score wins**: Never average the three BIV scores. Never let Vertrouwelijkheid alone decide the category if Beschikbaarheid or Integriteit scored higher.
- **One-way inference is not optional framing**: This is the single most important thing this command must get right. A TBB 2 process is not automatically holding Stg. GEHEIM data. Reversing the inference silently mis-classifies data downstream and can cause an eligible cloud hosting decision to be blocked, or worse, an ineligible one to look eligible.
- **This command produces no rubricering at all**: the systematiek takes the rubricering as an *input* to the categorisation (§2.1) and states that only the marking-to-category direction holds (§3.1). Step 7 therefore reads an existing marking and applies it as a floor; it never derives a marking from the category. If a downstream artefact needs a rubricering, it comes from the information's own marking or from the departmental security authority — never from this document.
- **VIRBI 2013 is stale**: If prior assessments or source documents cite VIRBI 2013, flag it — VIRBI 2025 replaced and repealed it on 9 September 2025.
- **This command determines the category; it does not determine the hosting decision.** Run `/arckit:nl-cloud` for the eligibility consequence.
- **Use Write Tool**: This determination is consumed by other commands — always use the Write tool so it can be read back reliably.

## Key References

| Document | Publisher | URL |
|----------|-----------|-----|
| VIRBI 2025 — Besluit voorschrift informatiebeveiliging rijksdienst bijzondere informatie 2025 (BWBR0051482, in force 9 September 2025) | Rijksoverheid | https://wetten.overheid.nl/BWBR0051482 |
| Besluit BVA-stelsel Rijksdienst 2021 (BWBR0044617) | Rijksoverheid | https://wetten.overheid.nl/BWBR0044617 |
| Gereedschap: Te Beschermen Belangen (TBB) systematiek, v1.0, 6 June 2026 (Toolkit VIRBI 2025) | Digitale Overheid / CISO Rijk | https://www.digitaleoverheid.nl/wp-content/uploads/sites/8/2026/05/Gereedschap-TBB-systematiek-PDF.pdf |
| Gereedschapskist implementatie VIRBI 2025 (toolkit index) | Digitale Overheid | https://www.digitaleoverheid.nl/overzicht-van-alle-onderwerpen/cybersecurity/digitale-weerbaarheid/aan-de-slag-met-digitale-weerbaarheid/gereedschapskist-implementatie-virbi-2025/ |

> **Note for reviewers**: VIRBI 2025 replaced and repealed VIRBI 2013 on 9 September 2025 — material still referencing VIRBI 2013 is out of date. The TBB systematiek's five kernbelangen (Democratische rechtsorde, Internationale betrekkingen, Veiligheid, Gevoelige beleidszaken, Betrouwbare dienstverlening) frame the assessment; the actual category is set by the highest of the three BIV scores, raised to a floor where the information already carries a marking. The inference runs from an established Stg. classification to a TBB category only — the systematiek states in §3.1 that the reverse "hoeft dit niet te betekenen", so this command emits no rubricering.

## Success Criteria

- ✅ Determination document created at `projects/{project_id}/ARC-{PROJECT_ID}-TBB-v{VERSION}.md`
- ✅ All five kernbelangen assessed for relevance
- ✅ Beschikbaarheid, Integriteit, and Vertrouwelijkheid scored independently
- ✅ TBB category set from the highest of the three scores, with the derivation shown
- ✅ Existing rubricering recorded and applied as a floor; no rubricering derived from the category
- ✅ One-way inference warning stated prominently and correctly
- ✅ VIRBI 2013 flagged as superseded if referenced anywhere in source material
- ✅ Downstream cloud-eligibility implication stated where TBB 1–3 applies

## Example Usage

```text
/arckit:nl-tbb Determine the TBB category for a ministry case-file system handling internal audit findings and sensitive policy correspondence

/arckit:nl-tbb TBB determination for 001, citizen-facing benefits platform processing large-scale personal data, no prior classification on record

/arckit:nl-tbb Assess TBB category for an interdepartmental coordination system touching international relations correspondence
```
