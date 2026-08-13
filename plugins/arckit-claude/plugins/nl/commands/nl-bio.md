---
description: "[COMMUNITY] Assess BIO2 (Baseline Informatiebeveiliging Overheid 2) conformance against ISO/IEC 27001:2023 and 27002:2022 controls plus mandatory overheidsmaatregelen"
doc-type: BIO2
argument-hint: "<project ID or system description, e.g. '001', 'shared services platform for a ministry'>"
effort: high
handoffs:
  - command: nl-cloud
    description: Feed BIO2 conformance status and control gaps into the cloud data-location and encryption assessment
    condition: "This system is cloud-hosted or cloud hosting is under consideration"
  - command: nl-tbb
    description: Determine the TBB category so BIV scores can prioritise which BIO2 controls matter most
    condition: "BIV scores not yet available to prioritise this conformance assessment"
  - command: risk
    description: Reflect open BIO2 control gaps in the risk register
    condition: "Gaps identified in this assessment are not yet reflected in ARC-*-RISK"
---


> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output should be reviewed by qualified counsel and the departmental CISO before reliance. Citations to BIO2 and its base ISO standards may lag the current text — verify against the source.

You are helping an enterprise architect assess conformance with **BIO2 (Baseline Informatiebeveiliging Overheid 2)** for a Dutch government information system. BIO2 was established by the OBDO on 23 September 2025 (version 1.3 dated 9 January 2026), and is built on NEN-EN-ISO/IEC 27001:2023 and NEN-EN-ISO/IEC 27002:2022. BIO2 does not mandate ISO 27001 certification, but the overheidsmaatregelen (government-specific measures) it adds are mandatory where applicable — this assessment must not blur that distinction.

## User Input

```text
$ARGUMENTS
```

## Instructions

> **Note**: The ArcKit Project Context hook has already detected all projects, artifacts, external documents, and global policies. Use that context below — no need to scan directories manually.

### Step 0: Read existing artifacts from the project context

**MANDATORY** (warn if missing):

- **REQ** (Requirements) — Extract: system description, security NFRs (NFR-SEC-xxx), integration requirements, hosting model
  - If missing: warn that a meaningful conformance assessment requires a defined system scope

**RECOMMENDED** (read if available, note if missing):

- **TBB** (Te Beschermen Belangen determination, from `/arckit-nl:nl-tbb`) — Extract: BIV scores to prioritise which control areas matter most
- **RBCLOUD** (Rijksbreed Cloudbeleid Compliance Assessment, from `/arckit-nl:nl-cloud`) — Extract: hosting model, data location, encryption posture already assessed
- **SECD** (Secure by Design) — Extract: existing security controls that overlap with BIO2 measures
- **RISK** (Risk Register) — Extract: existing security risks

**OPTIONAL** (read if available, skip silently):

- **DATA** (Data Model) — Extract: data assets and classification relevant to control scoping

### Step 0b: Read external documents and policies

- Read any **external documents** in `external/` — extract prior BIO2 or BIO assessments, ISO 27001 certification scope statements, audit findings
- Read any **global policies** in `000-global/policies/` — extract information security policy, access control policy
- If prior material references the original BIO or BIO1, note that BIO2 is the current baseline and re-verify.

### Step 1: Identify or Create Project

Identify the target project from the hook context. If the project doesn't exist:

1. Use Glob to list `projects/*/` directories and find the highest `NNN-*` number
2. Calculate the next number (zero-padded to 3 digits)
3. Slugify the project name
4. Use the Write tool to create `projects/{NNN}-{slug}/README.md`
5. Set `PROJECT_ID` and `PROJECT_PATH`

### Step 2: Read Source Artifacts

Read all documents from Step 0. Extract the system's control environment, any existing ISO 27001/27002 conformance evidence, and the BIV scores if available.

### Step 3: Template Reading

**Read the template** (with user override support):

- **First**, check if `.arckit/templates/nl-bio-template.md` exists in the project root
- **If found**: Read the user's customized template
- **If not found**: Read `${CLAUDE_PLUGIN_ROOT}/templates/nl-bio-template.md`

Also read `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md` — the template's `<!-- DOC-CONTROL-HEADER -->` marker is resolved against these rules before the artefact is written (see Step 8).

### Step 4: Scope and Certification Posture

State the system in scope, the BIV scores if available from `/arckit-nl:nl-tbb`, and the certification posture: BIO2 does not require ISO/IEC 27001 certification, but its overheidsmaatregelen are mandatory where applicable regardless of certification status. Do not present "not certified" as equivalent to "non-conformant" — they are different questions.

### Step 5: Assess Against the Four ISO/IEC 27002:2022 Control Themes

Structure the assessment around the four themes the base standard uses — **Organisational**, **People**, **Physical**, and **Technological** controls. For each control area in scope:

1. State the current implementation status
2. Reference the specific BIO2 overheidsmaatregel where you have it from source material provided by the user or project artefacts
3. **Do not invent an overheidsmaatregel number or requirement text you were not given** — where the specific measure text is not available, mark it `[PENDING — cite from current BIO2 text]` and instruct the assessor to complete it from the official document
4. Record a gap where the control is absent, partial, or unverified

Cross-reference `/arckit-nl:nl-cloud` Section 7 (data location and encryption) for the Technological controls theme where the system is cloud-hosted — do not re-derive the encryption assessment from scratch if it already exists.

### Step 6: Gap Summary

Consolidate all gaps identified across the four themes into a single prioritised table with owner and target date.

### Step 7: Sector Context

Note whether the organisation is in scope of the Cyberbeveiligingswet (Cbw, the Dutch NIS2 transposition) or the Wet weerbaarheid kritieke entiteiten (Wwke, the CER transposition) — both approved by the Eerste Kamer on 7 July 2026 and in force 15 August 2026, replacing the Wbni. Where in scope, note that the Rijksinspectie Digitale Infrastructuur (RDI) is the supervisory authority.

### Step 8: Generate the Assessment

**CRITICAL**: Use the **Write tool** to create the assessment document.

1. Use `node scripts/generate-document-id.mjs <PROJECT_ID> BIO2 --filename` for the artefact filename.

2. **Auto-populate Document Control**:
   - Document ID: the filename from step 1, without the `.md` extension
   - Status: DRAFT
   - Created Date: {current_date}
   - Next Review Date: {current_date + 12 months}

3. Resolve the `<!-- DOC-CONTROL-HEADER -->` marker per `RENDERING.md` before writing the artefact. `RENDERING.md` hard-routes the NL regime to `_partials/document-control-nl.md`, which already carries the VIRBI 2025 rubricering ladder — no per-command classification override is needed.

4. Populate the External References section per `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. BIO2 — Baseline Informatiebeveiliging Overheid 2 MUST appear in the Document Register with its primary URL and the verification date.

Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **BIO2** per-type checks pass.

Write the document to:

```text
projects/{project_id}/<filename>
```

### Step 9: Summary Output

```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ BIO2 Conformance Assessment Generated
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 Document: projects/{project_id}/ARC-{PROJECT_ID}-BIO2-v{VERSION}.md
📋 Document ID: {document_id}
📅 Assessment Date: {date}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Conformance Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Overall conformance: {Conformant / Partially conformant / Not conformant}
ISO 27001 certified:  {Yes / No — not required by BIO2}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚨 Gaps ({N} total)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔴 High ({N}):
🟠 Medium ({N}):
🟡 Low ({N}):

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Next steps:
1. {If BIV scores not available: Run /arckit-nl:nl-tbb to prioritise remaining control work}
2. {If cloud-hosted: Run /arckit-nl:nl-cloud for the data-location and encryption assessment}
3. Run /arckit:risk to add open gaps to the risk register
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Important Notes

- **Certification is not conformance**: BIO2 does not mandate ISO/IEC 27001 certification. Do not report "not certified" as a finding of non-conformance on its own — assess the overheidsmaatregelen directly.
- **Do not invent overheidsmaatregel text**: This assessment must not fabricate specific BIO2 measure numbers, wording, or thresholds that were not supplied in source material. Use the `[PENDING — cite from current BIO2 text]` placeholder and instruct the assessor to complete it.
- **BIO2 is version 1.3 (9 January 2026)**: If prior material cites an earlier BIO2 version or the original BIO/BIO1, flag it for re-verification.
- **This is a security-baseline assessment, not a cloud-eligibility assessment.** Run `/arckit-nl:nl-cloud` for hosting eligibility and `/arckit-nl:nl-tbb` for classification.
- **Use Write Tool**: BIO2 assessments are detailed technical documents. Always use the Write tool.

## Key References

| Document | Publisher | URL |
|----------|-----------|-----|
| BIO2 — Baseline Informatiebeveiliging Overheid 2 (established 23 September 2025, v1.3 dated 9 January 2026) | OBDO | *(not linked — verify current text via digitaleoverheid.nl before citing)* |
| NEN-EN-ISO/IEC 27001:2023 | NEN / ISO/IEC | *(not linked — standard is not freely published; verify via NEN)* |
| NEN-EN-ISO/IEC 27002:2022 | NEN / ISO/IEC | *(not linked — standard is not freely published; verify via NEN)* |
| Cyberbeveiligingswet (Cbw) | Rijksoverheid | *(not linked — in force 15 August 2026; verify current text via wetten.overheid.nl before citing)* |
| Wet weerbaarheid kritieke entiteiten (Wwke) | Rijksoverheid | *(not linked — in force 15 August 2026; verify current text via wetten.overheid.nl before citing)* |

> **Note for reviewers**: BIO2 is built on NEN-EN-ISO/IEC 27001:2023 and 27002:2022 but does not require formal certification against either — the overheidsmaatregelen it layers on top are the mandatory element, applied where relevant to the system in scope. This command structures the assessment around the four ISO/IEC 27002:2022 control themes (Organisational, People, Physical, Technological) as an organising scaffold; it does not assert specific BIO2 overheidsmaatregel numbers that were not supplied by the user or project source material.

## Success Criteria

- ✅ Assessment document created at `projects/{project_id}/ARC-{PROJECT_ID}-BIO2-v{VERSION}.md`
- ✅ BIO2 version and base standards cited correctly
- ✅ Certification-vs-conformance distinction stated explicitly
- ✅ All four ISO/IEC 27002:2022 control themes addressed
- ✅ No overheidsmaatregel number or requirement text fabricated
- ✅ BIV scores from `/arckit-nl:nl-tbb` used to prioritise controls where available
- ✅ Gap summary includes priority, owner, and target date
- ✅ Cbw/Wwke sector applicability noted

## Example Usage

```text
/arckit-nl:nl-bio Assess BIO2 conformance for a ministry shared-services platform, ISO 27001 certification not pursued, BIV scores not yet determined

/arckit-nl:nl-bio BIO2 conformance for 001, cloud-hosted case management system, cross-reference existing clause 4.6 encryption assessment

/arckit-nl:nl-bio Conformance assessment for an interdepartmental data-exchange platform in scope of the Cyberbeveiligingswet as an essential entity
```
