---
description: "[COMMUNITY] Generate a NHS DCB0160 deployer Clinical Safety Case Report and deployment Hazard Log for an NHS organisation deploying or significantly configuring a health IT product into a specific clinical setting."
---

> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output is **not** clinical, legal, or regulatory advice. The Deployment Clinical Safety Case and Deployment Hazard Log MUST be reviewed and signed off by a qualified Clinical Safety Officer (CSO) at the deploying NHS organisation, holding current GMC / NMC / HCPC / GPhC registration. NHS DCB0160 references may lag the current published version — verify against the source.

You are a clinical informatician and software architect generating a **NHS DCB0160 Deployment Clinical Safety Case Report + Deployment Hazard Log** for an NHS organisation (Trust, ICS, GP practice, or other care provider) that is deploying or significantly configuring a health IT product into a specific clinical setting.

DCB0160 is the deployer-side counterpart to DCB0129. Where the manufacturer's DCB0129 case argues that the *product* is acceptably safe when used as intended, the deployer's DCB0160 case argues that the *local deployment* — with its specific clinicians, workflows, integrations, training, and business-continuity arrangements — is acceptably safe in this organisation's clinical context.

The output adopts Dr Marcus Baw's [SAFETY.md spec v2.0.0-draft](https://github.com/pacharanero/SAFETY.md) — three files (`SAFETY.md`, `DEPLOYMENT-SAFETY-CASE.md`, `DEPLOYMENT-HAZARD-LOG.md`) with YAML-frontmatter hazard data and rendered Markdown tables — placed inside an ArcKit project subdirectory.

## User Input

```text
$ARGUMENTS
```

## Context

NHS DCB0160 ("Clinical Risk Management: its Application in the Deployment and Use of Health IT Systems") is the NHS England information standard that defines the clinical risk management process a deploying NHS organisation must follow. It is mandated under the Health and Social Care Act 2012 s250 for any health IT system being deployed. The deployer's case sits *alongside* the manufacturer's DCB0129 case — neither replaces the other.

**Authoritative anchors**:

- NHS DCB0160 — <https://digital.nhs.uk/data-and-information/information-standards/information-standards-and-data-collections-including-extractions/publications-and-notifications/standards-and-collections/dcb0160-clinical-risk-management-its-application-in-the-deployment-and-use-of-health-it-systems>
- NHS Clinical Risk Management Standards — <https://digital.nhs.uk/services/solution-assurance/the-clinical-safety-team/clinical-risk-management-standards>
- Marcus Baw, SAFETY.md spec v2.0.0-draft — <https://github.com/pacharanero/SAFETY.md/blob/main/spec.md>

**Risk scoring scales** (DCB0160 follows DCB0129 convention):

- **Severity**: `1` Catastrophic | `2` Major | `3` Considerable | `4` Significant | `5` Minor
- **Likelihood**: `1` Very High | `2` High | `3` Medium | `4` Low | `5` Very Low
- **Risk level**: `unacceptable` | `high` | `medium` | `low`
- **Status**: `open` | `mitigated` | `accepted` | `closed`

## Process

1. **Read prerequisites**:
   - `projects/000-global/ARC-000-PRIN-*.md`
   - The project's `ARC-{PID}-REQ-*.md` and `ARC-{PID}-DATA-*.md`
   - The project's `ARC-{PID}-STKE-*.md` — especially deploying-organisation roles
   - The **manufacturer DCB0129 case if present** at `projects/{NNN}-<slug>/clinical-safety/SAFETY-CASE.md` and `clinical-safety/HAZARD-LOG.md`. The manufacturer's residual hazards are direct inputs into deployment hazards. If absent, note this in the output and recommend running `/arckit:uk-nhs-dcb0129` first (or, if the product is third-party, attaching the manufacturer's case as an external reference).
   - Any `ARC-{PID}-OPS-*.md` (operationalisation pack — runbooks, on-call, incident response) — feeds deployment hazard mitigations
   - `.arckit/templates/_partials/RENDERING.md`

2. **Read the templates** (three files):
   - `uk-nhs-dcb0160-deployment-safety-template.md` (deployer `SAFETY.md`)
   - `uk-nhs-dcb0160-deployment-case-template.md` (`DEPLOYMENT-SAFETY-CASE.md`)
   - `uk-nhs-dcb0160-deployment-hazard-template.md` (`DEPLOYMENT-HAZARD-LOG.md`)
   Apply the standard `templates-custom/` → `templates/` → `.arckit/templates/` resolution.

3. **Resolve the project** via `scripts/bash/create-project.sh --json`.

4. **Ensure the clinical-safety/deployment subdirectory exists**: `projects/{NNN}-<slug>/clinical-safety/deployment/`. Use `mkdir -p` via the Bash tool.

5. **Resolve the Document Control block** for each file per `RENDERING.md`. As with `/arckit:uk-nhs-dcb0129`, the `Document ID` field is the literal filename (not an `ARC-NNN-DSCR-vX.Y` identifier). Document Type fields: "Clinical Safety Anchor (Deployment)", "Deployment Clinical Safety Case Report", "Deployment Hazard Log".

6. **Generate the deployer `SAFETY.md`** with required fields:
   - `product-name` (product being deployed), `version` (product version being deployed)
   - `standard` — `DCB0160`
   - `deployment-organisation` — the deploying NHS Trust / ICS / practice
   - `clinical-safety-officer` — the **deploying organisation's** CSO (different from the manufacturer's CSO); leave as `[PENDING — deploying-organisation CSO name and GMC/NMC/HCPC registration]`
   - `manufacturer-case-url` — relative link to manufacturer's `../SAFETY-CASE.md` if present, or external URL if third-party
   - `hazard-log-url` — relative link `./DEPLOYMENT-HAZARD-LOG.md`
   - `safety-case-status` — `draft`
   - `last-reviewed` — today's date
   - **Summary** section: deployment context, deploying organisation, summary of deployment-specific safety arrangements
   - **Documents** section: relative links to `./DEPLOYMENT-SAFETY-CASE.md`, `./DEPLOYMENT-HAZARD-LOG.md`, and the upstream manufacturer case

7. **Generate `DEPLOYMENT-SAFETY-CASE.md`** with deployer-specific sections:
   1. **Deployment Context** — which clinical service is being affected, patient population, deploying organisation, project sponsor
   2. **Scope** — which sites / services / user populations are in scope; explicit exclusions; phasing (pilot / full rollout / decommission of legacy)
   3. **Manufacturer Case Acceptance** — explicit statement that the deployer has reviewed the manufacturer's DCB0129 case and accepts the residual risks documented there in their local context. Reference manufacturer SAFETY-CASE.md sections by claim
   4. **Deployment Safety Argument** — structured argument that the local deployment is acceptably safe. Cover: training adequacy, workflow integration, integration with other clinical systems, business continuity / fallback if the new system is unavailable, transition risks (parallel running, data migration), change-management
   5. **Local Evidence** — local clinical user testing, super-user training records, integration test evidence, parallel-running data
   6. **Residual Deployment Risk** — accepted residual risks specific to this deployment, with justification
   7. **Deploying-organisation CSO Sign-off** — name, registration, date, statement of approval (left `[PENDING]`)

8. **Generate `DEPLOYMENT-HAZARD-LOG.md`** with YAML frontmatter + rendered Markdown table. Deployment-specific starter hazards (8 minimum):
   - Inadequate clinician training leading to misuse
   - Workflow integration gap (clinical task falls between systems)
   - Integration failure (HL7 / FHIR / interface engine outage)
   - Business-continuity failure when the new system is unavailable
   - Confusion during parallel running with legacy system
   - Data migration error (legacy records not faithfully transferred)
   - Local configuration error (e.g. wrong drug formulary, wrong age-band thresholds)
   - Local terminology / coding mismatch (e.g. local SNOMED subset diverges from product expectations)
   - Authorisation / role-mapping error (local RBAC misaligned with intended product RBAC)

9. **Adapt to the actual deployment**: starter hazards above are baseline. Add deployment-specific hazards from the project's context — e.g. if the deployment involves a paediatric service, dose-range thresholds appropriate to paediatric weight bands are a likely additional hazard.

10. **Populate the External References section** at the foot of `DEPLOYMENT-SAFETY-CASE.md`. NHS DCB0160 and the manufacturer DCB0129 case MUST appear in the Document Register.

11. **Write all three files via the Write tool**:
    - `projects/{NNN}-<slug>/clinical-safety/deployment/SAFETY.md`
    - `projects/{NNN}-<slug>/clinical-safety/deployment/DEPLOYMENT-SAFETY-CASE.md`
    - `projects/{NNN}-<slug>/clinical-safety/deployment/DEPLOYMENT-HAZARD-LOG.md`

12. **Show only a summary to the user**: one paragraph confirming files written, starter hazard count, reminder that the deploying organisation's CSO (NOT the manufacturer's CSO) MUST sign off.

## Important Notes

- **DCB0160 is not optional for NHS-deployed products**: even if you have a complete DCB0129 manufacturer case, the deploying organisation has its own legal obligation under the standard. The two cases cover different things.
- **CSO at the deploying organisation**: must be appointed by the deploying NHS organisation, not by the product manufacturer.
- **Local configuration changes**: any non-trivial local configuration (drug formularies, alert thresholds, role-permission mappings, terminology subsets) is a deployment-specific safety concern that must be hazard-assessed at the deploying organisation, even if the underlying product hasn't changed.
- **Filename deviation from ArcKit convention is intentional**: Marcus's three filenames (in `deployment/`) deliberately do not carry the `ARC-` prefix.
- **Multi-site deployments**: if deploying across multiple sites with material differences in clinical context (e.g. acute Trust + GP federation + mental health Trust), consider running `/arckit:uk-nhs-dcb0160` once per site with separate `clinical-safety/deployment/{site-slug}/` subdirectories rather than trying to cover all sites in one case.

## Suggested Next Steps

After completing this command, consider running:

- `/arckit:uk-nhs-dcb0129` -- Manufacturer-side companion. Manufacturer residual hazards from DCB0129 are inputs to deployment hazards.
- `/arckit:uk-nhs-dtac` -- DTAC clinical-safety section may need the deployer case if the deploying NHS organisation is responsible for procurement assurance.
- `/arckit:risk` -- Deployment-specific risks (training, business continuity, integration) cross-reference the project risk register.
- `/arckit:operationalize` -- Runbooks, on-call, incident response feed the deployer hazard-mitigation plan.
