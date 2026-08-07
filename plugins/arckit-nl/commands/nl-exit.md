---
description: "[COMMUNITY] Produce a mandatory cloud exit plan under Rijksbreed cloudbeleid clause 3.2 — planned exit and disruptive interruption scenarios, provider data destruction, and annual self-test"
doc-type: NLEXIT
argument-hint: "<project ID or cloud service description, e.g. '001', 'email and document collaboration service currently hosted in public cloud'>"
effort: medium
handoffs:
  - command: nl-cloud
    description: Confirm the materieel cloudgebruik determination that triggered this exit-plan obligation, or satisfy clause 4.5(b)
    condition: "No prior /arckit:nl-cloud assessment exists for this system"
  - command: risk
    description: Integrate residual exit risks (data-format lock-in, provider non-cooperation under disruption) into the risk register
    condition: "Residual risks identified in this plan are not yet reflected in ARC-*-RISK"
---


> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output should be reviewed by qualified counsel, the departmental CISO, and CISO Rijk before reliance. Citations to Dutch government policy may lag the current text — verify against the source.

You are helping an enterprise architect produce a **Cloud Exit Plan** required under clause 3.2 of the Herziening rijksbreed cloudbeleid 2026 (Ministerie van Economische Zaken en Klimaat, 3 July 2026, definitief). The exit plan is mandatory, documented, and self-tested wherever materieel publiek cloudgebruik applies, and must cover **two scenarios**: a planned exit and a disruptive interruption of service. It must address destruction of data at the provider after migration, and is reviewed annually. Existing cloud use has a four-year transition; the exit plan itself has a twelve-month production deadline.

## User Input

```text
$ARGUMENTS
```

## Instructions

> **Note**: The ArcKit Project Context hook has already detected all projects, artifacts, external documents, and global policies. Use that context below — no need to scan directories manually.

### Step 0: Read existing artifacts from the project context

**MANDATORY** (warn if missing):

- **REQ** (Requirements) — Extract: system description, hosting model, dependencies, data volumes
  - If missing: warn that a credible exit plan requires a defined hosting and dependency picture

**RECOMMENDED** (read if available, note if missing):

- **RBCLOUD** (Rijksbreed Cloudbeleid Compliance Assessment, from `/arckit:nl-cloud`) — Extract: the materieel cloudgebruik determination that triggers this obligation, and whether this plan is being produced to satisfy clause 4.5(b) for an email/file-storage service
  - If missing: warn that the trigger for this exit plan has not been formally established, and recommend running `/arckit:nl-cloud` first
- **RISK** (Risk Register) — Extract: existing provider-concentration or lock-in risks

**OPTIONAL** (read if available, skip silently):

- **DATA** (Data Model) — Extract: data formats and volumes relevant to portability

### Step 0b: Read external documents and policies

- Read any **external documents** in `external/` — extract existing provider contracts, service-level agreements, prior exit or continuity plans
- Read any **global policies** in `000-global/policies/` — extract business continuity policy, data retention policy

### Step 1: Identify or Create Project

Identify the target project from the hook context. If the project doesn't exist:

1. Use Glob to list `projects/*/` directories and find the highest `NNN-*` number
2. Calculate the next number (zero-padded to 3 digits)
3. Slugify the project name
4. Use the Write tool to create `projects/{NNN}-{slug}/README.md`
5. Set `PROJECT_ID` and `PROJECT_PATH`

### Step 2: Read Source Artifacts

Read all documents from Step 0. Extract the hosting model, actual contracted provider(s), data volumes, and existing continuity arrangements.

### Step 3: Template Reading

**Read the template** (with user override support):

- **First**, check if `.arckit/templates/nl-exit-template.md` exists in the project root
- **If found**: Read the user's customized template
- **If not found**: Read `${CLAUDE_PLUGIN_ROOT}/templates/nl-exit-template.md`

Also read `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md` — the template's `<!-- DOC-CONTROL-HEADER -->` marker is resolved against these rules before the artefact is written (see Step 11).

### Step 4: Establish the Trigger

State why this plan is being produced: materieel publiek cloudgebruik per `/arckit:nl-cloud`, and/or as one of the three cumulative conditions under clause 4.5(b) for an email or document/workplace/file-storage service. If no prior `/arckit:nl-cloud` assessment exists, note this as an open item rather than inventing a trigger.

### Step 5: Scenario A — Planned Exit

Document the export method, target environment, timeline, cost (including egress fees and rebuild effort), dependencies, and owner for a planned, orderly exit — e.g. contract expiry or a policy decision to move.

### Step 6: Scenario B — Disruptive Interruption of Service

Document the same elements for an unplanned, disruptive interruption — e.g. provider insolvency, a sanctions event, or a sudden withdrawal of service. This scenario assumes the provider may not cooperate; the plan must not depend on provider goodwill for data recovery. State the minimum viable continuity path, RTO, and RPO.

**Both scenarios are mandatory.** A plan that only documents a planned, orderly exit does not satisfy clause 3.2.

### Step 7: Destruction of Data at the Provider

Document the contractual basis, method, and verification for destroying data held by the provider after migration completes, in either scenario.

### Step 8: Self-Test Plan and Evidence

Document the test cadence (at minimum annual, aligned to the clause 3.2 review requirement), the last test date and scope, findings, and remediation actions. A plan with no test evidence is aspirational, not compliant — flag this explicitly if no test has yet occurred.

### Step 9: Annual Review

Set the review cycle to annual with a named owner and next review date.

### Step 10: Residual Risk

Identify residual risks — e.g. data-format lock-in, proprietary managed-service coupling, provider non-cooperation under the disruptive scenario — with likelihood, impact, and mitigation.

### Step 11: Generate the Exit Plan

**CRITICAL**: Use the **Write tool** to create the exit plan document.

1. Use `node scripts/generate-document-id.mjs <PROJECT_ID> NLEXIT --filename` for the artefact filename.

2. **Auto-populate Document Control**:
   - Document ID: the filename from step 1, without the `.md` extension
   - Status: DRAFT
   - Created Date: {current_date}
   - Next Review Date: {current_date + 12 months}

3. Resolve the `<!-- DOC-CONTROL-HEADER -->` marker per `RENDERING.md` before writing the artefact. Use the VIRBI 2025 rubricering ladder (Ongerubriceerd / Departementaal VERTROUWELIJK / Stg. CONFIDENTIEEL / Stg. GEHEIM / Stg. ZEER GEHEIM) in the Document Control Classification row — replace the standard UK line in the header.

4. Populate the External References section per `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. The Herziening rijksbreed cloudbeleid 2026, clause 3.2 MUST appear in the Document Register with its primary URL and the verification date.

Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **NLEXIT** per-type checks pass.

Write the document to:

```text
projects/{project_id}/<filename>
```

### Step 12: Summary Output

```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Cloud Exit Plan Generated
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 Document: projects/{project_id}/ARC-{PROJECT_ID}-NLEXIT-v{VERSION}.md
📋 Document ID: {document_id}
📅 Assessment Date: {date}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Coverage Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Scenario A — Planned exit:              {Documented / Gaps noted}
Scenario B — Disruptive interruption:   {Documented / Gaps noted}
Provider data destruction:              {Contractual clause in place / Not in place}
Self-test evidence:                     {Present / None yet — flagged}
Next review date:                       {date}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Next steps:
1. {If no prior /arckit:nl-cloud assessment: Run /arckit:nl-cloud to confirm the trigger for this plan}
2. {If clause 4.5(b) is the trigger: Update /arckit:nl-cloud Section 3.2 with this plan's reference}
3. Run /arckit:risk to add residual exit risks to the risk register
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Important Notes

- **Both scenarios are mandatory, not alternatives.** Clause 3.2 requires a planned exit AND a disruptive interruption of service to be covered. Do not accept a document that only handles one.
- **The disruptive scenario cannot assume provider cooperation.** If the plan's recovery method depends on the provider actively assisting, flag it as a gap — the scenario exists precisely because the provider may not be able or willing to help.
- **A plan without test evidence is not yet compliant.** Self-testing is part of the clause 3.2 requirement, not an optional maturity add-on. State plainly if no test has occurred yet.
- **This plan does not itself determine cloud eligibility** — that is `/arckit:nl-cloud`'s job. This command assumes a hosting decision already exists (or is being justified under clause 4.5(b)) and plans the exit from it.
- **Use Write Tool**: Exit plans are detailed operational documents. Always use the Write tool.

## Key References

| Document | Publisher | URL |
|----------|-----------|-----|
| Herziening rijksbreed cloudbeleid 2026, clause 3.2 (Exit-plan) (3 July 2026, definitief) | Ministerie van Economische Zaken en Klimaat, Staatssecretaris W.J.M. Aerdts, 3 juli 2026 | Kamerbrief: <https://www.tweedekamer.nl/kamerstukken/brieven_regering/detail?id=2026Z15738&did=2026D35294> · Policy PDF: <https://www.tweedekamer.nl/downloads/document?id=2026D35295> · Kamerstuk 26643, nr. 1541 |
| OBDO "Cloud definities en begrippenlijst" (approved 16 April 2026) | OBDO | *(not linked — verify current text via digitaleoverheid.nl before citing)* |

> **Note for reviewers**: Clause 3.2 sits alongside clause 4.5(b), which requires a tested exit plan as one of three cumulative conditions before email or document/workplace/file-storage services may be processed in public cloud. A single exit plan can satisfy both purposes if it is referenced from the `/arckit:nl-cloud` assessment rather than duplicated.

## Success Criteria

- ✅ Exit plan created at `projects/{project_id}/ARC-{PROJECT_ID}-NLEXIT-v{VERSION}.md`
- ✅ Trigger for the plan stated (materieel cloudgebruik and/or clause 4.5(b))
- ✅ Scenario A (planned exit) documented with export method, timeline, cost, dependencies, owner
- ✅ Scenario B (disruptive interruption) documented, not assuming provider cooperation, with RTO/RPO
- ✅ Provider data destruction after migration addressed with verification method
- ✅ Self-test plan present, with test evidence or an explicit gap flag if untested
- ✅ Annual review cycle set with owner and next review date
- ✅ Residual risks identified with mitigation

## Example Usage

```text
/arckit:nl-exit Produce the exit plan for a departmental email and document collaboration service currently in public cloud, no prior exit test conducted

/arckit:nl-exit Exit plan for 001, case management platform migrating to public cloud under a confirmed materieel cloudgebruik determination

/arckit:nl-exit Annual review update to the exit plan for a shared-services platform, provider contract renewed, update the self-test evidence
```
