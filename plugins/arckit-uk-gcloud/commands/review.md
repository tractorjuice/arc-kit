---
description: Review a G-Cloud service submission for completeness before CCS submission
effort: high
handoffs:
  - command: /arckit:submission-pack
    description: Bundle the service documents once the review is clean
---

> ⚠️ **Community-contributed command** — part of the `arckit-uk-gcloud` overlay, not the
> officially-maintained ArcKit baseline. The review report produced here is an internal readiness aid
> for a UK G-Cloud / Digital Marketplace service submission; it is **not** legal, financial, or
> procurement advice and **does not guarantee CCS acceptance**. CCS may request additional
> information, and some issues only surface during manual CCS review. Confirm framework requirements
> against the live Digital Marketplace guidance before submitting.

You are helping a cloud service supplier **review a G-Cloud service submission for completeness and
consistency** before submitting to the UK G-Cloud Digital Marketplace.

In this overlay **each G-Cloud service is its own ArcKit project** — `projects/{NNN}-service-name/`.
This command does **not** create a new project: the service project was created earlier by
`/arckit:service-design`. This command **resolves the existing service project**, checks its
per-service artefacts plus the supplier-wide documents, and writes a completeness/quality review
report into the project.

## User Input

```text
$ARGUMENTS
```

## Instructions

### 1. Resolve the existing service project

The user should identify the service in `$ARGUMENTS` by **service name** (or name fragment) or by
**project number** (e.g. `004` or `secure-case-mgmt`). List the existing projects as JSON and match
against `$ARGUMENTS`:

```bash
bash "${CLAUDE_PLUGIN_ROOT}/scripts/bash/list-projects.sh" --json
```

From the JSON `projects[]` array, each entry has `name`, `number`, and `path`. Resolve the target:

- If `$ARGUMENTS` is (or contains) a project number, match on `number`.
- Otherwise match the `name` field case-insensitively against the service name / fragment in
  `$ARGUMENTS`.
- If exactly one project matches, use it. If several match, use the **AskUserQuestion** tool to let
  the user pick. If `$ARGUMENTS` is empty, list the candidate projects and ask which one.

**$ARGUMENTS bypass for review scope:** If `$ARGUMENTS` contains `full`,`completeness`,
`consistency`, or`readiness` (beyond the service name), use that to set the review scope in Step 3
and skip the scope question.

**If no matching project is found**, tell the user the service project does not exist and that they
must run `/arckit:service-design` first to create it, then **stop** (do not create a project here).

From the matched project record extract:

- `path` — the service project directory (e.g. `projects/004-secure-case-mgmt`) — the destination
- `number` — the zero-padded project number (e.g. `004`) — use as `PROJECT_ID`
- `name` — the project / service name

### 2. Load the documents under review

Use the **Read tool** to read the artefacts being reviewed. Per-service artefacts live in the
resolved project directory; the supplier-wide documents live under `projects/000-global/supplier/`.

**Per-service artefacts (this project):**

- Service design — `{path}/ARC-{PROJECT_ID}-SVCD-v*.md` (written by `/arckit:service-design`)
- Service Definition Document — `{path}/ARC-{PROJECT_ID}-SDD-v*.md` (written by `/arckit:sdd-lot1`,
  `/arckit:sdd-lot2`, or `/arckit:sdd-lot3`)
- Pricing — `{path}/ARC-{PROJECT_ID}-PRIC-v*.md` (written by `/arckit:pricing`)
- Security evidence — `{path}/ARC-{PROJECT_ID}-SECA-v*.md` (written by `/arckit:security`)

**Supplier-wide documents:**

- Supplier profile — `projects/000-global/supplier/ARC-000-SUPP-v1.0.md` (written by
  `/arckit:supplier-profile`)
- Supplier declaration — `projects/000-global/supplier/ARC-000-DECL-v1.0.md` (written by
  `/arckit:declaration`)

For each document, record whether it **exists** and its highest version. A missing document is a
blocking finding — note which command produces it so the user knows how to remediate.

Also read the G-Cloud framework reference if present, to ground the field-level checks:

```bash
ls "${CLAUDE_PLUGIN_ROOT}/skills/gcloud-framework/references/framework-questions.md" 2>/dev/null
```

If it exists, use the **Read tool** to read it.

**Citation traceability**: When you read any document the user has placed under the project's
`external/`, `policies/`, or `vendors/` directories, fetch a G-Cloud listing page, or query an MCP
server, follow the citation instructions in
`${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. Place inline citation markers (e.g.
`[WEB-1-C1]`) next to each fact informed by a source, and populate the **External References**
section (Document Register, Citations, Unreferenced Documents). The ArcKit artefacts under review are
internal project documents and are referenced by their `ARC-` IDs, not as external citations.

### 3. Run the review checks

Set the review scope from the `$ARGUMENTS` bypass in Step 1, or — if none was given — use the
**AskUserQuestion** tool to ask which review the user wants:

1. **Full review** — all checks (3a–3e) and a complete report
2. **Completeness check** — 3a only (documents + mandatory fields)
3. **Consistency audit** — 3b only (cross-document contradictions)
4. **Submission readiness** — 3a + 3c + 3e (completeness + character limits + common rejections),
   pass/fail focused on blocking issues

Reference each finding back to the relevant `ARC-` document ID so the user can locate it.

#### 3a. Completeness checks

**Document existence** (reference each by its ARC-ID):

- [ ] Supplier profile — `ARC-000-SUPP`
- [ ] Supplier declaration — `ARC-000-DECL`
- [ ] Service design — `ARC-{PROJECT_ID}-SVCD`
- [ ] Service Definition Document — `ARC-{PROJECT_ID}-SDD`
- [ ] Pricing — `ARC-{PROJECT_ID}-PRIC`
- [ ] Security evidence — `ARC-{PROJECT_ID}-SECA`

**SDD mandatory fields** (`ARC-{PROJECT_ID}-SDD`):

- [ ] Service name (≤ 100 characters)
- [ ] Service description (≤ 50 words, ≤ 500 characters)
- [ ] Service features (≤ 10 items, each ≤ 100 characters)
- [ ] Service benefits (≤ 10 items, each ≤ 100 characters)
- [ ] Lot correctly identified

**Pricing fields** (`ARC-{PROJECT_ID}-PRIC`):

- [ ] Pricing model defined
- [ ] Price unit specified (GBP)
- [ ] Education pricing addressed
- [ ] Free trial / version addressed

**Security fields** (`ARC-{PROJECT_ID}-SECA`):

- [ ] Security standards declared
- [ ] Data-centre security addressed
- [ ] Data protection (in transit & at rest)
- [ ] Access management described
- [ ] Audit capabilities described

**Support & data fields** (`ARC-{PROJECT_ID}-SDD`):

- [ ] Support availability, channels, and response times defined
- [ ] Documentation availability
- [ ] Data locations specified
- [ ] Data import / export formats
- [ ] End-of-contract process and data-extraction capability

#### 3b. Consistency checks

Cross-reference documents for contradictions:

- **`ARC-000-SUPP` ↔ `ARC-{PROJECT_ID}-SDD`** — company name, certifications, data-centre locations,
  security clearances match
- **`ARC-{PROJECT_ID}-SVCD` ↔ `ARC-{PROJECT_ID}-SDD`** — features, benefits, lot, technical details
  consistent
- **`ARC-{PROJECT_ID}-SDD` ↔ `ARC-{PROJECT_ID}-PRIC`** — pricing model, included features, support
  levels align
- **`ARC-{PROJECT_ID}-SDD` ↔ `ARC-{PROJECT_ID}-SECA`** — certifications, security controls,
  clearances align

#### 3c. Character / word-limit validation

Count and validate the marketplace limits in `ARC-{PROJECT_ID}-SDD`:

- Service name: `[X]/100` characters
- Description: `[X]/50` words, `[X]/500` characters
- Each feature: `[X]/100` characters
- Each benefit: `[X]/100` characters

#### 3d. Evidence verification

Check that assertions in `ARC-{PROJECT_ID}-SECA` and `ARC-000-SUPP` have supporting evidence:

| Assertion | Evidence required | Status |
|-----------|-------------------|--------|
| ISO 27001 | Certificate | ✅ / ❌ |
| Cyber Essentials | Certificate | ✅ / ❌ |
| Penetration testing | Report summary | ✅ / ❌ |
| SC clearances | Staff count | ✅ / ❌ |
| Data centres | Locations verified | ✅ / ❌ |

#### 3e. Common rejection reasons

- [ ] No placeholder text remaining (e.g. `[TO BE COMPLETED]`, `[PENDING]`)
- [ ] No `N/A` where an answer is actually required
- [ ] No contradictory statements
- [ ] No unsubstantiated claims or marketing hyperbole
- [ ] No competitor mentions
- [ ] Pricing in **GBP** only
- [ ] All URLs and contact details valid

### 4. Determine the output filename

`GCRV` is a **single-instance** doc-type per service project. Generate the document ID and filename
with the ArcKit helper (no `--next-num` — GCRV is not multi-instance):

```bash
bash "${CLAUDE_PLUGIN_ROOT}/scripts/bash/generate-document-id.sh" \
     {PROJECT_ID} GCRV --filename
```

This returns `ARC-{NNN}-GCRV-v1.0.md` (using the zero-padded project number from Step 1). Use the
returned filename for the output document and take the version (`1.0`) from it. If the service
already has a review report, increment the version and add a Revision History row instead of
overwriting at v1.0.

### 5. Build the review report

There is **no template** for this report — author it inline. Start with a Document Control header
(Document ID = `ARC-{PROJECT_ID}-GCRV-v{VERSION}`, Document Type `G-Cloud Submission Review`,
Classification = `${user_config.default_classification}` falling back to `OFFICIAL`) and a Revision
History table, then the body below. Reference every finding against the `ARC-` ID of the document it
concerns.

```markdown
# G-Cloud Submission Review — [Service Name]

**Service:** [Name] (Project [PROJECT_ID])
**Lot:** [X]
**Review Date:** [DATE]
**Review Scope:** [Full / Completeness / Consistency / Readiness]

## Overall Status: 🟢 READY / 🟡 NEEDS WORK / 🔴 NOT READY

## Document Completeness

| Document | ARC-ID | Status | Issues |
|----------|--------|--------|--------|
| Supplier Profile | ARC-000-SUPP | ✅ | - |
| Supplier Declaration | ARC-000-DECL | ✅ | - |
| Service Design | ARC-[PROJECT_ID]-SVCD | ✅ | - |
| Service Definition (SDD) | ARC-[PROJECT_ID]-SDD | 🟡 | 2 fields incomplete |
| Pricing | ARC-[PROJECT_ID]-PRIC | ✅ | - |
| Security | ARC-[PROJECT_ID]-SECA | ✅ | - |

## Mandatory Field Status
- Complete: [X]/[Y]
- Incomplete: [X]
- Invalid: [X]

## Consistency Issues
1. [Issue — cite the two ARC-IDs that disagree]

## Character / Word-Limit Status
- Within limits: [X]/[Y]
- Exceeding limits: [X]

## Evidence Status
- Verified: [X]/[Y]
- Missing: [X]

## Actions Required

**Must Fix (Blocking):**
1. [Action — name the ARC-ID and the command to re-run]

**Should Fix (Recommended):**
1. [Action]

**Nice to Have:**
1. [Action]
```

Leave genuinely-unknown values as `[PENDING]` rather than inventing them. Append the standard ArcKit
Document Control footer:

```markdown
---

**Generated by**: ArcKit `/arckit:review` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME] (Project [PROJECT_ID])
**Model**: [AI_MODEL]
```

### 6. Write the review report

Use the **Write tool** to save the completed report to:

`{path}/{filename}` — e.g. `projects/004-secure-case-mgmt/ARC-004-GCRV-v1.0.md`

(The Write tool creates parent directories automatically and avoids the 32K output-token limit.) Do
**not** echo the full report into your response — it is large and only a summary should be printed.

### 7. Output summary

Print only a short summary (not the full report):

```markdown
## G-Cloud Submission Review Complete

**Service:** [Name]
**Saved to:** `{path}/ARC-{PROJECT_ID}-GCRV-v1.0.md`

### Overall Status: 🟢 READY / 🟡 NEEDS WORK / 🔴 NOT READY

| Document | ARC-ID | Status |
|----------|--------|--------|
| Supplier Profile | ARC-000-SUPP | ✅ |
| Supplier Declaration | ARC-000-DECL | ✅ |
| Service Design | ARC-[PROJECT_ID]-SVCD | ✅ |
| SDD | ARC-[PROJECT_ID]-SDD | 🟡 |
| Pricing | ARC-[PROJECT_ID]-PRIC | ✅ |
| Security | ARC-[PROJECT_ID]-SECA | ✅ |

### Top Actions Required
1. [Most important blocking action]

### Next Steps
- If 🟢 READY: bundle the documents — `/arckit:submission-pack [service]`
- If 🟡 / 🔴: address the actions above, then re-run `/arckit:review [service]`
```

## Important Notes

- This review **does not guarantee CCS acceptance** — CCS may request clarification, and some issues
  only surface during manual review.
- This command never creates a project — if none is found, direct the user to
  `/arckit:service-design`.
- A missing document is a blocking finding; name the command that produces it (`/arckit:sdd-lot1`,
  `/arckit:pricing`, `/arckit:security`, `/arckit:supplier-profile`, `/arckit:declaration`).
- Keep evidence files organised and accessible; consider a colleague's manual review as well.
- **Markdown escaping**: always include a space after `<` or `>` in comparisons (e.g. `< 100
  characters`, `> 99.9% uptime`) so markdown renderers do not treat them as HTML tags.
