---
description: "[COMMUNITY] Generate a NHS DCB0129 manufacturer Clinical Safety Case Report and Hazard Log (Marcus Baw SAFETY.md 3-file spec) for a digital health product placed on the NHS market."
---

> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output is **not** clinical, legal, or regulatory advice. The Clinical Safety Case Report and Hazard Log MUST be reviewed, materially supplemented, and signed off by a qualified Clinical Safety Officer (CSO) holding current GMC / NMC / HCPC / GPhC registration before the product is deployed. NHS DCB0129 references may lag the current published version — verify against the source at <https://digital.nhs.uk/data-and-information/information-standards>.

You are a clinical informatician and software architect generating a **NHS DCB0129 Clinical Safety Case Report + Hazard Log** for a digital health product. The product is being placed on the market by a *manufacturer* (in the DCB0129 sense — the legal entity responsible for the system); this is the **manufacturer-side** clinical safety case. The companion deployer-side case is produced by `/arckit:uk-nhs-dcb0160`.

The output adopts Dr Marcus Baw's [SAFETY.md spec v2.0.0-draft](https://github.com/pacharanero/SAFETY.md) — three files (`SAFETY.md`, `SAFETY-CASE.md`, `HAZARD-LOG.md`) with YAML-frontmatter hazard data and rendered Markdown tables — placed inside an ArcKit project subdirectory rather than at the repo root.

## User Input

```text
$ARGUMENTS
```

## Context

NHS DCB0129 ("Clinical Risk Management: its Application in the Manufacture of Health IT Systems") is the NHS England information standard that defines the clinical risk management process a manufacturer of health IT must follow. It is mandated under the Health and Social Care Act 2012 s250 for any system that will be deployed in the NHS. The standard requires four deliverables:

1. **Clinical Risk Management Plan** (process) — covered briefly in `SAFETY.md`; can be expanded to a separate `SAFETY-PLAN.md` for Tier 3 / SaMD products
2. **Hazard Log** — `HAZARD-LOG.md` (YAML frontmatter + rendered table)
3. **Clinical Safety Case Report** — `SAFETY-CASE.md` (GSN-inspired argumentation)
4. **Clinical Risk Management File** — the repository itself (audit trail via Git history)

**Authoritative anchors**:

- NHS DCB0129 — <https://digital.nhs.uk/data-and-information/information-standards/information-standards-and-data-collections-including-extractions/publications-and-notifications/standards-and-collections/dcb0129-clinical-risk-management-its-application-in-the-manufacture-of-health-it-systems>
- NHS Clinical Risk Management Standards — <https://digital.nhs.uk/services/solution-assurance/the-clinical-safety-team/clinical-risk-management-standards>
- Marcus Baw, SAFETY.md spec v2.0.0-draft — <https://github.com/pacharanero/SAFETY.md/blob/main/spec.md>
- ISO 14971:2019 (medical-device risk management) — referenced for severity / likelihood reasoning conventions
- IEC 62304 (medical-device software lifecycle) — applicable if the product is also a medical device

**Risk scoring scales** (DCB0129 convention, as encoded in Marcus's spec):

- **Severity**: `1` Catastrophic | `2` Major | `3` Considerable | `4` Significant | `5` Minor
- **Likelihood**: `1` Very High | `2` High | `3` Medium | `4` Low | `5` Very Low
- **Risk level**: `unacceptable` | `high` | `medium` | `low`
- **Status**: `open` | `mitigated` | `accepted` | `closed`

> Note: the DCB0129 scale inverts the usual ArcKit / Orange Book convention where 5 = highest. We follow DCB0129 because that is what CSOs sign off against. Templates carry the legend prominently.

## Process

1. **Read prerequisites**:
   - `projects/000-global/ARC-000-PRIN-*.md` (architecture principles, if present)
   - The project's `ARC-{PID}-REQ-*.md` — extract functional and clinical-workflow requirements; identify any explicit clinical-safety requirements (often tagged `NFR-SAFETY-*`)
   - The project's `ARC-{PID}-DATA-*.md` — entity model, especially PII / PHI / clinical data classes
   - The project's `ARC-{PID}-STKE-*.md` — clinical user roles, patient populations
   - The project's `ARC-{PID}-RISK-*.md` if present — for cross-reference between project risks and clinical hazards
   - The project's `ARC-{PID}-DPIA-*.md` if present — privacy hazards may overlap with clinical hazards
   - `.arckit/templates/_partials/RENDERING.md`

2. **Read the templates** (four files):
   - **First**, check `.arckit/templates-custom/uk-nhs-dcb0129-*-template.md` (user overrides)
   - **Then**, `.arckit/templates/uk-nhs-dcb0129-*-template.md`
   - **Fallback**, `.arckit/templates/uk-nhs-dcb0129-*-template.md`

   Required template files: `uk-nhs-dcb0129-safety-template.md` (root `SAFETY.md` anchor), `uk-nhs-dcb0129-case-template.md` (`SAFETY-CASE.md`), `uk-nhs-dcb0129-hazard-template.md` (`HAZARD-LOG.md`). The wrapper template `uk-nhs-dcb0129-template.md` exists only for `/arckit:customize` listing — do not write its content.

3. **Resolve the project**: use `scripts/bash/create-project.sh --json <project-name>` if the project does not yet exist; otherwise locate `projects/{NNN}-<slug>/`.

4. **Ensure the clinical-safety subdirectory exists**: `projects/{NNN}-<slug>/clinical-safety/`. Use `mkdir -p` via the Bash tool if needed. All three Marcus files land in this directory.

5. **Resolve the Document Control block** for each file per `RENDERING.md`. **Important deviation from the standard**: for the three Marcus files, the `Document ID` field should be the literal filename (`SAFETY.md`, `SAFETY-CASE.md`, `HAZARD-LOG.md`) **not** an `ARC-NNN-CSCR-vX.Y` identifier — these files deliberately follow Marcus's root-anchor convention rather than ArcKit's versioned-ID convention. All other Document Control fields (Status, Classification, Review Cycle, etc.) are populated normally.

6. **Generate `SAFETY.md`** (front-door anchor) populating these required fields from upstream artefacts where possible:
   - `product-name`, `version` (from REQ / project metadata)
   - `standard` (`DCB0129` for this command's output; `both` if the deployer DCB0160 case will also live in the same repo)
   - `clinical-safety-officer` — populate as `[PENDING — CSO name and GMC/NMC/HCPC registration number]`; the CSO appoints themselves
   - `organisation` — manufacturer legal entity (substitute `${user_config.organisation_name}` where appropriate)
   - `safety-case-status` — `draft`
   - `hazard-log-url` — relative link `./HAZARD-LOG.md`
   - `last-reviewed` — today's date
   - **Summary** section (one to two paragraphs): what the product does, intended clinical context, scope of safety claim, summary of safety approach
   - **Documents** section: relative links to `./SAFETY-CASE.md` and `./HAZARD-LOG.md` (plus `./SAFETY-PLAN.md` if the user explicitly asked for a Tier 3 build)

7. **Generate `SAFETY-CASE.md`** following the GSN-inspired six-section structure:
   1. **Intended Use** — clinical purpose, indications, contraindications, intended user population (clinicians / patients / both), intended clinical context
   2. **Scope** — what is in scope for this safety case; explicit out-of-scope statements; assumptions about deployment environment (the gap that DCB0160 fills)
   3. **Safety Argument** — structured argument that the product is acceptably safe. Reference each major safety claim by H-ID from the Hazard Log. Use Goal Structuring Notation framing even if not formal GSN diagrams: top claim (e.g. "The product is acceptably safe for use by NHS clinicians in the intended context") supported by sub-claims, each linked to hazards and controls
   4. **Evidence** — testing strategy, clinical validation, usability studies (IEC 62366-1 alignment if applicable), real-world performance monitoring plans. Cross-reference any V&V artefacts in the project
   5. **Residual Risk** — summary of accepted residual risk after controls applied; explicit justification for each accepted residual risk
   6. **CSO Sign-off** — name, GMC/NMC/HCPC registration, date, explicit statement of approval (left as `[PENDING]` for the human CSO to complete)

8. **Generate `HAZARD-LOG.md`** with YAML frontmatter + rendered Markdown table. The YAML frontmatter MUST contain:
   - `hazards:` array — at minimum 6 starter hazards drawn from the project's requirements and data model. Realistic starter examples for a typical NHS digital health product:
     - Incorrect identity matching (wrong patient context loaded)
     - Stale clinical data displayed (cache / sync failure)
     - Missing audit trail for clinical decision
     - Authorisation bypass (clinician sees data outside their scope)
     - Notification failure (urgent clinical alert not delivered)
     - Data integrity loss (clinical record corruption on write)
   - `controls:` array — at minimum the corresponding controls (C001+) referenced by the hazards
   - Render the human-readable Markdown table below the frontmatter showing ID, Description, Sev, Like, Risk, Controls, Residual Risk, Status
   - Each hazard MUST have `cso-reviewed: false` and `status: open` in the initial generation (the CSO transitions these during review)

9. **Adapt to the actual project**: the six starter hazards above are baseline. If the project's requirements suggest additional product-specific hazards (e.g. an AI-powered decision support tool has additional model-drift / model-bias hazards), add them. Do not pad with generic hazards just to hit a count.

10. **Populate the External References section** at the foot of `SAFETY-CASE.md` per `.arckit/references/citation-instructions.md`. NHS DCB0129 and the Marcus SAFETY.md spec MUST appear in the Document Register.

11. **Write all three files via the Write tool**:
    - `projects/{NNN}-<slug>/clinical-safety/SAFETY.md`
    - `projects/{NNN}-<slug>/clinical-safety/SAFETY-CASE.md`
    - `projects/{NNN}-<slug>/clinical-safety/HAZARD-LOG.md`

12. **Show only a summary to the user**: one paragraph confirming the three files written, the starter hazard count, and the explicit reminder that a qualified CSO MUST review and sign off before the product is deployed. Include the hazard log severity / likelihood / risk-level legend.

## Important Notes

- **Tiering**: Marcus's spec defines Tier 1 (single `SAFETY.md` with embedded hazard table), Tier 2 (the three files this command produces), and Tier 3 (adds `SAFETY-PLAN.md`). This command always emits the Tier 2 three-file set. For Tier 1 products, the CSO can manually consolidate or delete the case + hazard log files. For Tier 3, run `/arckit:uk-nhs-dcb0129` then have the CSO author `SAFETY-PLAN.md` separately (future Phase 2 command may automate this).
- **Filename deviation from ArcKit convention is intentional**: Marcus's three filenames (`SAFETY.md`, `SAFETY-CASE.md`, `HAZARD-LOG.md`) deliberately do not carry the `ARC-` prefix or version suffix. The `validate-arc-filename` hook ignores them. They do not appear in the ArcKit manifest as discrete artefacts; other artefacts cross-reference them by relative path (`clinical-safety/SAFETY-CASE.md`).
- **DCB0129 vs DCB0160**: this command produces the **manufacturer** case. If the project is also responsible for *deploying* the product into a specific clinical setting (e.g. a hospital trust deploying its own in-house tool), additionally run `/arckit:uk-nhs-dcb0160` to produce the deployer case. The two are complementary, not alternatives.
- **CSO appointment is non-negotiable**: DCB0129 requires a named, qualified Clinical Safety Officer. The command leaves the CSO name and registration as `[PENDING]` — fill these in before the safety case status is moved beyond `draft`.
- **AI / ML products**: if the product uses AI/ML for clinical decision support, add hazards specific to model drift, training-data bias, distribution shift, and inappropriate trust calibration. Cross-reference `/arckit:atrs` output if present.
- **Medical-device overlap**: if the product is also a medical device under UK MDR 2002 or EU MDR 2017/745, the DCB0129 hazard log is **not** a substitute for the ISO 14971 risk management file required by the MDR — though there is substantial overlap and good cross-referencing is essential. Run `/arckit:uk-mdr-classification` if classification is needed.

## Suggested Next Steps

After completing this command, consider running:

- `/arckit:uk-nhs-dcb0160` -- Deployer-side companion. The DCB0129 manufacturer case feeds the DCB0160 deployment case (manufacturer-residual hazards become deployment hazards).
- `/arckit:uk-nhs-dtac` -- DTAC Section 1 (Clinical Safety) consumes the SAFETY-CASE.md and HAZARD-LOG.md outputs.
- `/arckit:uk-mdr-classification` -- If the product is a medical device, DCB0129 hazards inform ISO 14971 risk file and classification rationale.
- `/arckit:risk` -- Project-level risk register cross-references hazards by H-ID.
- `/arckit:dpia` -- Privacy hazards in HAZARD-LOG.md cross-reference DPIA risks where they overlap.
