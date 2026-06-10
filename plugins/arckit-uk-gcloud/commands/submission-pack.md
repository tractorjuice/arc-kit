---
description: Bundle all approved documents for a G-Cloud service into a CCS submission pack
effort: medium
---

> ⚠️ **Community-contributed command** — part of the `arckit-uk-gcloud` overlay, not the
> officially-maintained ArcKit baseline. The submission pack assembled here is an internal aid for a
> UK G-Cloud / Digital Marketplace submission; it is **not** legal or procurement advice and **does
> not guarantee CCS acceptance**. Framework deadlines are strict and CCS may take several weeks to
> review — confirm requirements against the live Digital Marketplace guidance before submitting.

You are helping a cloud service supplier **assemble a complete submission pack** for a UK G-Cloud
Digital Marketplace service: gathering the service's approved documents plus the supplier-wide
documents into one folder ready for upload to CCS.

In this overlay **each G-Cloud service is its own ArcKit project** — `projects/{NNN}-service-name/`.
This command does **not** create a new project and **does not** create an ArcKit document. It is an
**export action**: it copies existing approved artefacts into a `submission/` folder inside the
service project and writes a `submission/manifest.md` index. The bundle output itself gets **no
ArcKit doc-type and no `ARC-…-` ID**.

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

**If no matching project is found**, tell the user the service project does not exist and that they
must run `/arckit:service-design` first to create it, then **stop** (do not create a project here).

From the matched project record extract:

- `path` — the service project directory (e.g. `projects/004-secure-case-mgmt`) — the source
- `number` — the zero-padded project number (e.g. `004`) — use as `PROJECT_ID`
- `name` — the project / service name

### 2. Verify the documents are ready

The pack should only be assembled once the service has passed `/arckit:review`. Check that each
required artefact exists. Per-service artefacts live in `{path}`; the supplier-wide documents live
under `projects/000-global/supplier/`:

```bash
PROJECT_PATH="{path}"   # e.g. projects/004-secure-case-mgmt
echo "=== Per-service artefacts ==="
ls "$PROJECT_PATH"/ARC-*-SVCD-v*.md 2>/dev/null && echo "✅ Service Design" || echo "❌ Service Design MISSING"
ls "$PROJECT_PATH"/ARC-*-SDD-v*.md  2>/dev/null && echo "✅ SDD"            || echo "❌ SDD MISSING"
ls "$PROJECT_PATH"/ARC-*-PRIC-v*.md 2>/dev/null && echo "✅ Pricing"        || echo "❌ Pricing MISSING"
ls "$PROJECT_PATH"/ARC-*-SECA-v*.md 2>/dev/null && echo "✅ Security"       || echo "❌ Security MISSING"
echo "=== Supplier-wide documents ==="
ls projects/000-global/supplier/ARC-000-SUPP-v*.md 2>/dev/null && echo "✅ Supplier Profile"     || echo "❌ Supplier Profile MISSING"
ls projects/000-global/supplier/ARC-000-DECL-v*.md 2>/dev/null && echo "✅ Supplier Declaration" || echo "❌ Supplier Declaration MISSING"
```

If any required document is missing, **stop** and advise the user to create it first with the
relevant command (`/arckit:service-design`, `/arckit:sdd-lot1` / `lot2` / `lot3`, `/arckit:pricing`,
`/arckit:security`, `/arckit:supplier-profile`, `/arckit:declaration`). If a review report
(`ARC-{PROJECT_ID}-GCRV-v*.md`) exists, read it with the **Read tool** and warn the user if it is not
🟢 READY before proceeding.

### 3. Assemble the submission folder

Create the `submission/` folder inside the service project and copy the latest version of each
artefact into it. Use bash `mkdir -p` and `cp` (do **not** rewrite document contents — this is a
straight export of the approved files):

```bash
PROJECT_PATH="{path}"
SUBMISSION_DIR="$PROJECT_PATH/submission"
mkdir -p "$SUBMISSION_DIR"

# Per-service artefacts (latest version of each)
for type in SVCD SDD PRIC SECA; do
  f=$(ls "$PROJECT_PATH"/ARC-*-"$type"-v*.md 2>/dev/null | sort | tail -1)
  [ -n "$f" ] && cp "$f" "$SUBMISSION_DIR/"
done

# Supplier-wide documents
for f in projects/000-global/supplier/ARC-000-SUPP-v*.md \
         projects/000-global/supplier/ARC-000-DECL-v*.md; do
  g=$(ls $f 2>/dev/null | sort | tail -1)
  [ -n "$g" ] && cp "$g" "$SUBMISSION_DIR/"
done

ls -1 "$SUBMISSION_DIR"
```

If the supplier has additional evidence files (certificates, terms, SLAs) under the project's
`external/`, `vendors/`, or `evidence/` directories that the SDD or security artefact references,
copy them into a `submission/evidence/` subfolder too and list them in the manifest.

### 4. Write the submission manifest

Use the **Write tool** to write `{path}/submission/manifest.md` — an index of everything in the pack,
the documents the supplier still needs to upload to the Digital Marketplace, and a pre-submission
checklist. This manifest is a plain index file: it has **no** ArcKit Document Control header and
**no** `ARC-…-` ID (it is not an ArcKit doc-type). Structure:

```markdown
# G-Cloud Submission Pack — [Service Name]

**Service:** [Name] (Project [PROJECT_ID])
**Lot:** [X]
**Assembled:** [DATE]
**Framework:** G-Cloud [NN]

## Pack Contents

| File | Source ARC-ID | Description |
|------|---------------|-------------|
| ARC-000-SUPP-v1.0.md | ARC-000-SUPP | Supplier profile |
| ARC-000-DECL-v1.0.md | ARC-000-DECL | Supplier declaration |
| ARC-[PROJECT_ID]-SVCD-v1.0.md | ARC-[PROJECT_ID]-SVCD | Service design |
| ARC-[PROJECT_ID]-SDD-v1.0.md | ARC-[PROJECT_ID]-SDD | Service Definition Document |
| ARC-[PROJECT_ID]-PRIC-v1.0.md | ARC-[PROJECT_ID]-PRIC | Pricing |
| ARC-[PROJECT_ID]-SECA-v1.0.md | ARC-[PROJECT_ID]-SECA | Security evidence |

## Evidence to Upload to the Digital Marketplace
- [ ] ISO 27001 certificate
- [ ] Cyber Essentials certificate
- [ ] Penetration-test executive summary
- [ ] Pricing document
- [ ] Terms and conditions

## Pre-Submission Checklist
- [ ] Supplier declaration complete (exclusions, modern slavery, insurance, tax)
- [ ] Service name (≤ 100 chars), description (≤ 50 words), correct lot
- [ ] Features (≤ 10, each ≤ 100 chars) and benefits (≤ 10, each ≤ 100 chars)
- [ ] All prices in GBP; education pricing and free trial/version specified
- [ ] Support hours, channels, and response times entered
- [ ] Security certifications uploaded; data-centre locations specified
- [ ] Preview reviewed, links tested, colleague review and sign-off complete

## Submission Instructions
1. Log in at <https://www.digitalmarketplace.service.gov.uk/suppliers>
2. Apply to the open framework (e.g. G-Cloud [NN]) and complete the supplier declaration
3. Add the service under the correct lot; copy answers from the SDD into each field
4. Upload the evidence documents listed above
5. Preview, then submit for review; note the submission reference
6. Respond to any CCS clarification within 10 working days
```

Fill the table with the **actual filenames copied** in Step 3 (latest versions). Leave unknown values
(framework number, dates) as `[PENDING]` rather than inventing them.

### 5. Output summary

Print only a short summary (not the manifest contents):

```markdown
## Submission Pack Assembled

**Service:** [Name]
**Location:** `{path}/submission/`

### Pack Contents
- [N] documents copied (supplier profile, declaration, SVCD, SDD, pricing, security)
- `manifest.md` — index, evidence-upload list, pre-submission checklist, submission steps

### Evidence Still to Upload
- [ ] ISO 27001 / Cyber Essentials certificates
- [ ] Pricing document / terms and conditions

### Next Steps
1. Work through `submission/manifest.md`
2. Log in to the Digital Marketplace and submit before the framework deadline
3. Respond to CCS queries within 10 working days
```

## Important Notes

- This is an **export action** — it copies approved artefacts and writes an index; it creates **no**
  ArcKit doc-type and **no** `ARC-…-` ID for the bundle.
- Run `/arckit:review` first; only assemble the pack once the service is 🟢 READY.
- This command never creates a project — if none is found, direct the user to
  `/arckit:service-design`.
- Framework deadlines are strict and CCS review can take several weeks; respond to clarifications
  within 10 working days and keep evidence files for the framework period (typically 4 years).
- This pack does **not** guarantee CCS acceptance.
