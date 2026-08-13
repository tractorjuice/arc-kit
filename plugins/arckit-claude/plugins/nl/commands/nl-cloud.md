---
description: "[COMMUNITY] Assess Rijksbreed cloudbeleid compliance — materieel cloudgebruik determination, clause 5.2/4.5 eligibility, risk assessment, and governance obligations for Dutch central government cloud use"
doc-type: RBCLOUD
argument-hint: "<project ID or cloud service description, e.g. '001', 'case management platform for a ministry'>"
effort: high
handoffs:
  - command: nl-tbb
    description: Determine the TBB category / VIRBI 2025 rubricering for the data in scope before finalising the clause 5.2 eligibility check
    condition: "TBB category not yet determined for the data processed by this system"
  - command: nl-exit
    description: Produce the mandatory clause 3.2 exit plan once materieel cloudgebruik is confirmed
    condition: "Materieel cloudgebruik determined and no exit plan exists yet"
  - command: nl-bio
    description: Assess BIO2 conformance for the hosting environment and security controls
    condition: "BIO2 baseline assessment not yet documented for this system"
  - command: risk
    description: Integrate cloud sovereignty, foreign-interference, and provider-concentration risks into the risk register
    condition: "Risks identified in this assessment are not yet reflected in ARC-*-RISK"
---


> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output should be reviewed by qualified counsel, the departmental CISO, and CISO Rijk before reliance. Citations to Dutch government policy, VIRBI 2025, and EU instruments may lag the current text — verify against the source.

You are helping an enterprise architect generate a **Rijksbreed Cloudbeleid Compliance Assessment** for Dutch central government (Rijksoverheid) cloud use. The Herziening rijksbreed cloudbeleid 2026 (Ministerie van Economische Zaken en Klimaat, 3 July 2026, definitief) is the governing policy — it applies to all central government except the Hoge Colleges van Staat, and the Ministry of Defence is explicitly exempt. Existing cloud use gets a four-year transition; exit plans must be produced within twelve months.

## User Input

```text
$ARGUMENTS
```

## Instructions

> **Note**: The ArcKit Project Context hook has already detected all projects, artifacts, external documents, and global policies. Use that context below — no need to scan directories manually.

### Step 0: Read existing artifacts from the project context

**MANDATORY** (warn if missing):

- **REQ** (Requirements) — Extract: data sensitivity, hosting requirements, security NFRs (NFR-SEC-xxx), integration requirements (INT-xxx), any prior TBB or BIO2 references
  - If missing: warn that the eligibility determination (Section 3) requires a defined data classification

**RECOMMENDED** (read if available, note if missing):

- **TBB** (Te Beschermen Belangen determination, from `/arckit-nl:nl-tbb`) — Extract: TBB category and BIV scores. Use this directly; do not re-derive a TBB category inside this command.
- **BIO2** (BIO2 Conformance Assessment, from `/arckit-nl:nl-bio`) — Extract: existing conformance status relevant to the cloud environment
- **RISK** (Risk Register) — Extract: existing cloud/hosting risks, third-party risks, foreign-interference risks
- **PRIN** (Architecture Principles, 000-global) — Extract: cloud strategy, data sovereignty principles

**OPTIONAL** (read if available, skip silently):

- **DPIA** — Extract: personal data processing details relevant to Section 2.2
- **SECD** (Secure by Design) — Extract: security controls relevant to cloud hosting

### Step 0b: Read external documents and policies

- Read any **external documents** in `external/` — extract prior cloud risk assessments, CISO Rijk correspondence, existing provider contracts
- Read any **global policies** in `000-global/policies/` — extract cloud strategy, data classification policy
- If no external cloud documentation exists, note: "No external cloud documentation found — assessment will be based on requirements and user input."

### Step 1: Identify or Create Project

Identify the target project from the hook context. If the user specifies a project that doesn't exist yet:

1. Use Glob to list `projects/*/` directories and find the highest `NNN-*` number
2. Calculate the next number (zero-padded to 3 digits)
3. Slugify the project name (lowercase, hyphens)
4. Use the Write tool to create `projects/{NNN}-{slug}/README.md` with project name, ID, and date
5. Set `PROJECT_ID` = the 3-digit number, `PROJECT_PATH` = the new directory path

### Step 2: Read Source Artifacts

Read all documents from Step 0. Extract and note the TBB category (if determined), data categories, and any existing provider under consideration for use in the assessment.

### Step 3: Template Reading

**Read the template** (with user override support):

- **First**, check if `.arckit/templates/nl-cloud-template.md` exists in the project root
- **If found**: Read the user's customized template
- **If not found**: Read `${CLAUDE_PLUGIN_ROOT}/templates/nl-cloud-template.md`

Also read `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md` — the template's `<!-- DOC-CONTROL-HEADER -->` marker is resolved against these rules before the artefact is written (see Step 13).

### Step 4: Materieel Cloudgebruik Determination (clause 4.1)

Determine whether this is **materieel publiek cloudgebruik**:

1. Is the use for the organisation's primary or core task?
2. Does it involve large-scale processing of personal data?

If either holds, treat the use as materieel — clauses 3.1 (risk assessment), 3.2 (exit plan), 3.3 (notification), and 3.4 (register) all apply. If neither holds, record the rationale for the lighter-touch determination; do not skip the write-up.

### Step 5: Risk Assessment (clause 3.1)

1. **Integral risk assessment**, required for materieel cloudgebruik, based on the BIV/TBB classification (pull from `/arckit-nl:nl-tbb` output if available; if not available, warn and proceed on user-supplied classification)
2. Weigh the aspects the clause requires — the risk of foreign-government interference is explicitly named and must be assessed and mitigated as far as possible; note in the document that clause 3.1 requires five aspects in total and flag any not covered by current guidance for the assessor to complete against the published text
3. **Pre-scan DPIA / Full DPIA** — required where personal data are processed
4. **DTIA** — required where data transfer to a third country without an adequacy decision is in scope

### Step 6: Eligibility Determination (clauses 5.2, 4.5, 5.4)

This is the section a reader of this assessment will look for first — do not leave it implicit.

1. **Clause 5.2 prohibition check**: Pull the TBB category / rubricering for the data in scope. Public cloud is **prohibited** for staatsgeheim gerubriceerde informatie and for Te Beschermen Belangen niveau 1, 2, and 3. If the TBB category is not yet known, state that explicitly and recommend running `/arckit-nl:nl-tbb` before the assessment can be finalised — do not guess a category.
2. **Clause 4.5 email/file-storage conditions**: If the service in scope is email or document/workplace/file storage, assess all **three cumulative conditions** individually — (a) it is independently established that continuity of service is otherwise at risk, (b) a risk analysis and exit plan have been produced and tested under this policy, (c) the decision is agreed by the responsible minister in agreement with the bewindspersoon voor digitalisering. All three must hold; do not treat partial satisfaction as eligible.
3. **Clause 5.4 basisregistraties**: If the system holds or sources basisregistratie data, state that basisregistraties are not (solely) held in public cloud inside or outside the EEA, and that source data are not managed in public cloud.
4. **No provider qualification list**: State explicitly that, unlike some other jurisdictions, there is no published Dutch cloud-provider qualification list. Do not name, shortlist, or imply that any specific commercial cloud provider is compliant or qualified.

### Step 7: Cybersecurity Requirements (clause 4.2)

Assess against C2000 criteria, ABRO, and whether threat and security advice has been obtained from AIVD and/or MIVD.

### Step 8: Critical or Essential Entity Considerations (clause 4.3)

Determine whether the organisation is a designated vitale aanbieder, falls under the Wwke, or is in the Cbw essential-entity category, **and** whether the supplier for its primary process falls wholly or partly under non-EU/EEA jurisdiction. Where both hold, public cloud use is discouraged ("afgeraden") — this is guidance, not a prohibition; document the risk-acceptance rationale if the organisation proceeds anyway.

### Step 9: Openbaarheid / Woo (clause 4.4)

Note that the risk analysis and exit plan are subject to Woo publication of relevant decision-making, and that the risk analysis and exit plan may themselves carry a rubricering that withholds publication.

### Step 10: Data Location and Encryption (clause 4.6)

Assess storage and processing location (EEA plus Switzerland — this does **not** extend to Caribisch Nederland), encryption at rest, in transit, and possibly in processing, key management custody (preferably not held by the cloud provider), and the posture for special categories of personal data (preferably not in public cloud; if unavoidable, additional measures such as Privacy Enhancing Technologies).

### Step 11: Governance Obligations (clauses 3.3, 3.4)

1. **Melding en beoordeling**: prior notification to CISO Rijk before implementation, and any aanwijzingen (directions) CISO Rijk has issued
2. **Gekend gebruik**: registration of material public-cloud use and the annual report to CIO Rijk, including the chosen provider

### Step 12: Exit-Plan Cross-Reference (clause 3.2)

State that an exit plan is mandatory, documented, self-tested, covers two scenarios (planned exit; disruptive interruption of service), addresses destruction of data at the provider after migration, and is reviewed annually. Point to `/arckit-nl:nl-exit` for the full plan rather than duplicating it here.

### Step 13: Generate the Assessment

**CRITICAL**: Use the **Write tool** to create the assessment document.

1. Use `node scripts/generate-document-id.mjs <PROJECT_ID> RBCLOUD --filename` for the artefact filename.

2. **Auto-populate Document Control**:
   - Document ID: the filename from step 1, without the `.md` extension
   - Status: DRAFT
   - Created Date: {current_date}
   - Next Review Date: {current_date + 12 months}

3. Resolve the `<!-- DOC-CONTROL-HEADER -->` marker per `RENDERING.md` before writing the artefact. `RENDERING.md` hard-routes the NL regime to `_partials/document-control-nl.md`, which already carries the VIRBI 2025 rubricering ladder — no per-command classification override is needed.

4. Populate the External References section per `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. The Herziening rijksbreed cloudbeleid 2026 and VIRBI 2025 MUST appear in the Document Register with their primary URLs and verification dates.

Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **RBCLOUD** per-type checks pass.

Write the document to:

```text
projects/{project_id}/<filename>
```

### Step 14: Summary Output

```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Rijksbreed Cloudbeleid Compliance Assessment Generated
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 Document: projects/{project_id}/ARC-{PROJECT_ID}-RBCLOUD-v{VERSION}.md
📋 Document ID: {document_id}
📅 Assessment Date: {date}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Determination Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Materieel publiek cloudgebruik: {Yes / No}
Clause 5.2 status:              {Eligible / Prohibited — TBB {n} or staatsgeheim}
Clause 4.5 conditions (if applicable): {All met / Not met}
Exit plan required:             {Yes / No}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Recommendation: {Proceed / Proceed with conditions / Do not proceed}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Risks identified: {N} ({N} high, {N} medium)

Next steps:
1. {If TBB category not determined: Run /arckit-nl:nl-tbb to determine the TBB category}
2. {If materieel cloudgebruik and no exit plan: Run /arckit-nl:nl-exit for the clause 3.2 exit plan}
3. Run /arckit-nl:nl-bio for BIO2 conformance of the hosting environment
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Important Notes

- **No published qualification list**: Unlike France's SecNumCloud, there is no published Dutch list of qualified or compliant cloud providers. Never name, shortlist, or imply endorsement of any specific commercial cloud provider in this assessment.
- **5.2 is a prohibition, not a risk to manage**: Staatsgeheim gerubriceerde informatie and TBB niveau 1–3 cannot go to public cloud under any mitigation. Do not present this as a risk-acceptance decision.
- **4.5 is cumulative, not alternative**: All three conditions for email/file-storage services must be met together. A partially-met set is not eligible.
- **Basisregistraties are out of scope for public cloud** under clause 5.4 — source data are not managed there, inside or outside the EEA.
- **The TBB inference runs one way**: This command consumes a TBB category from `/arckit-nl:nl-tbb`; it does not infer a rubricering level from a TBB category. See that command's one-way inference warning.
- **Use Write Tool**: This is a detailed governance document. Always use the Write tool.

## Key References

| Document | Publisher | URL |
|----------|-----------|-----|
| Herziening rijksbreed cloudbeleid 2026 (3 July 2026, definitief) | Ministerie van Economische Zaken en Klimaat, Staatssecretaris W.J.M. Aerdts, 3 juli 2026 | Kamerbrief: <https://www.tweedekamer.nl/kamerstukken/brieven_regering/detail?id=2026Z15738&did=2026D35294> · Policy PDF: <https://www.tweedekamer.nl/downloads/document?id=2026D35295> · Kamerstuk 26643, nr. 1541 |
| VIRBI 2025 — Besluit voorschrift informatiebeveiliging rijksdienst bijzondere informatie 2025 (BWBR0051482) | Rijksoverheid | https://wetten.overheid.nl/BWBR0051482 |
| Cyberbeveiligingswet (Cbw) and Wet weerbaarheid kritieke entiteiten (Wwke) | Rijksoverheid | *(not linked — approved by the Eerste Kamer 7 July 2026, in force 15 August 2026; verify current text via wetten.overheid.nl before citing)* |
| BIO2 — Baseline Informatiebeveiliging Overheid 2 | OBDO | *(not linked — verify current text via digitaleoverheid.nl before citing)* |
| OBDO "Cloud definities en begrippenlijst" (approved 16 April 2026) | OBDO | *(not linked — verify current text via digitaleoverheid.nl before citing)* |
| Nederlandse Digitaliseringsstrategie | Rijksoverheid | *(not linked — verify current text via rijksoverheid.nl before citing)* |
| Visie Digitale Autonomie en Soevereiniteit van de Overheid | Rijksoverheid | *(not linked — verify current text via rijksoverheid.nl before citing)* |

> **Note for reviewers**: The Herziening rijksbreed cloudbeleid 2026 is the successor to earlier Dutch central-government cloud policy. It sits alongside — and is distinct from — the EU-level frameworks (GDPR, NIS2/Cbw). A key distinction from France's SecNumCloud regime: **there is no published Dutch cloud-provider qualification list.** Eligibility is determined by clause-by-clause assessment of the workload and data in scope, not by checking a provider against a register.

## Success Criteria

- ✅ Assessment document created at `projects/{project_id}/ARC-{PROJECT_ID}-RBCLOUD-v{VERSION}.md`
- ✅ Materieel publiek cloudgebruik determination made with rationale (clause 4.1)
- ✅ Clause 3.1 risk assessment completed, including foreign-government interference and DPIA/DTIA applicability
- ✅ Clause 5.2 eligibility explicitly determined using a TBB category (or explicitly flagged as pending `/arckit-nl:nl-tbb`)
- ✅ Clause 4.5 three cumulative conditions assessed individually where applicable
- ✅ Clause 5.4 basisregistraties constraint assessed where applicable
- ✅ Clause 4.2 cybersecurity criteria assessed
- ✅ Clause 4.3 critical/essential-entity discouragement assessed
- ✅ Clause 4.4 Woo publication posture noted
- ✅ Clause 4.6 data location and encryption assessed
- ✅ Clauses 3.3 and 3.4 governance obligations captured as actions
- ✅ No specific commercial cloud provider named as compliant or qualified
- ✅ Decision and recommendation stated clearly

## Example Usage

```text
/arckit-nl:nl-cloud Assess cloud eligibility for a case management platform at a Dutch ministry, processing personal data at scale, no cloud provider selected yet

/arckit-nl:nl-cloud Cloud hosting assessment for 001, departmental email and document collaboration service currently under review for public cloud migration

/arckit-nl:nl-cloud Evaluate materieel cloudgebruik and clause 5.2 eligibility for a system handling Departementaal VERTROUWELIJK policy documents
```
