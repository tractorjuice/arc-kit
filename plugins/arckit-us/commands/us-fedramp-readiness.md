---
description: "[COMMUNITY] Produce an internal FedRAMP readiness self-assessment in the format of the 3PAO Readiness Assessment Report — capability statement, gap register, evidence inventory, and recommended ATO path (Agency vs JAB)."
doc-type: FRRR
argument-hint: "<project ID or CSO name, e.g. '001', 'Agency Citizen Services Portal'>"
effort: high
handoffs:
  - command: service-assessment
    description: The readiness gap register feeds the broader service-assessment evidence pack.
  - command: roadmap
    description: Remediation actions for FedRAMP gaps drop into the architecture roadmap timeline.
  - command: risk
    description: Open gaps and POA&M items become entries in the project risk register.
allowed-tools:
  - Read(/${CLAUDE_PLUGIN_ROOT}/**)
  - Bash(bash ${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh *)
  - Bash(bash "${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh" *)
  - Bash(${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh *)
  - Bash(node ${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs *)
  - Bash(node "${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs" *)
---

> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline.
> Output should be reviewed by qualified US federal counsel, your agency's Senior Agency Official
> for Privacy (SAOP), CISO, Chief AI Officer (CAIO), and (for FedRAMP matters) the agency PMO
> and 3PAO before reliance.
>
> **Statutory currency**: EO 14110 was **revoked January 2025**; the active AI assurance mandates
> are **OMB M-24-10** (use of AI) and **OMB M-25-21** (acquisition of AI). FedRAMP completed the
> transition to NIST 800-53 **Rev 5** baselines in 2024 — Rev 4 references are deprecated. Verify
> all citations against the current Federal Register, OMB Circulars page, NIST publications, and
> FedRAMP.gov before relying on this output.

You are an enterprise architect producing an **internal FedRAMP readiness self-assessment** in the format of the FedRAMP Readiness Assessment Report (RAR), ahead of formal third-party assessment.

## User Input

```text
$ARGUMENTS
```

## Context

The official FedRAMP Readiness Assessment Report (RAR) is prepared by a FedRAMP-recognized Third Party Assessment Organization (3PAO) on the FedRAMP RAR template. The 3PAO owns its content, validates the authorization boundary and data flows itself, and signs an attestation that the CSO is ready for authorization. The CSO must meet every Federal Mandate in RAR §4.1 — six for Moderate and High: FIPS 140-validated cryptography wherever cryptography is required; PIV / CAC authentication; Digital Identity Level 2 or higher (Level 3 for High); remediation of High, Moderate and Low vulnerabilities within 30, 90 and 180 days; federal records management; and DNSSEC. The 3PAO then assesses the FedRAMP Requirements in §4.2 and the additional capabilities in §4.3. The RAR is organised by these capability areas, not by control family; the gap register in this artefact records gaps against the FedRAMP Rev 5 baseline controls, which come from 18 of the 20 NIST SP 800-53 Rev 5 control families (every family except PM and PT). The FedRAMP PMO reviewed the 3PAO's RAR and, where it agreed, designated the CSO "FedRAMP Ready" for one year.

Under the FedRAMP Consolidated Rules for 2026, FedRAMP stopped accepting FedRAMP Ready submissions on **28 July 2026**. Class A certification replaces it, and Ready listings that do not convert are renamed "Legacy FedRAMP Ready". Check fedramp.gov for the current route — agency authorization, or a FedRAMP 20x or Rev 5 certification — before planning around a Ready designation.

This command produces the **internal self-assessment** that FedRAMP's RAR templates invite CSPs to complete before engaging a 3PAO: the same questions, answered by the CSP, to find and close gaps first. It is not a 3PAO attestation and cannot confer FedRAMP Ready or any other FedRAMP status, but it materially de-risks the 3PAO engagement and helps the agency PMO scope effort.

**Authoritative anchors**:

- FedRAMP Readiness Assessment Report Template (3PAO) — <https://www.fedramp.gov/documents-templates/> (Moderate RAR template v2.1, May 2024: <https://www.fedramp.gov/resources/templates/FedRAMP-Moderate-Readiness-Assessment-Report-(RAR)-Template.docx>)
- FedRAMP Consolidated Rules for 2026 — important dates (FedRAMP Ready retired 28 July 2026) — <https://www.fedramp.gov/2026/timeline/>
- FedRAMP Agency Authorization Playbook — <https://www.fedramp.gov/agency-authorization/>
- FedRAMP JAB Prioritization Criteria — <https://www.fedramp.gov/jab-prioritization/>
- FedRAMP 3PAO Requirements — <https://www.fedramp.gov/3pao/>
- FedRAMP Continuous Monitoring Strategy Guide — <https://www.fedramp.gov/assets/resources/documents/CSP_Continuous_Monitoring_Strategy_Guide.pdf>

## Process

1. Read prerequisites:
   - `projects/000-global/ARC-000-PRIN-*.md` (architecture principles, if present)
   - **REQUIRED**: The project's FedRAMP SSP artefact — without an SSP the readiness check cannot enumerate the control delta.
   - **REQUIRED**: The project's NIST 800-53 control-tailoring artefact — provides the baseline control set.
   - The project's FIPS 199 artefact — confirms baseline (Moderate / High)
   - Any 3PAO assessment outputs, vulnerability-scan reports, or pen-test reports under `projects/<id>/external/` or `projects/<id>/vendors/`
   - `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md`

2. Read the template:
   - **First**, check `.arckit/templates-custom/us-fedramp-readiness-template.md` (user override)
   - **Then**, `.arckit/templates/us-fedramp-readiness-template.md`
   - **Fallback**, `${CLAUDE_PLUGIN_ROOT}/templates/us-fedramp-readiness-template.md`

3. Use `bash ${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh --json --name "<project-name>"` if the project does not yet exist; otherwise locate it.

4. Use `node ${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs <PROJECT_ID> FRRR {VERSION} --filename` for the artefact filename. The type code for this command is `FRRR`. Work out `{VERSION}` first with `${CLAUDE_PLUGIN_ROOT}/references/version-detection.md`: a re-run writes the next version beside the earlier file, never over it.

5. Resolve the `<!-- DOC-CONTROL-HEADER -->` marker per `RENDERING.md` before writing the artefact. `RENDERING.md` hard-routes the US regime to `_partials/document-control-us.md`, which already carries the EO 13526 / 32 CFR Part 2002 marking ladder — no per-command classification override is needed.

6. Generate the following sections:

   - **Capability Statement** — what the CSO does, the service model (IaaS/PaaS/SaaS), the deployment model, the customer-facing capabilities, and the boundary in one diagram. This is the section a FedRAMP PMO reviewer reads first; it must clearly state why a federal agency would use the CSO.
   - **Federal Mandates** — the six RAR §4.1 mandates listed under Context, each answered Yes only if fully and strictly met; any No blocks a 3PAO RAR submission.
   - **FedRAMP Ready Capabilities Checklist** — confirmation that the CSO supports the federal baseline capabilities: FIPS 140-3 validated cryptography for data-at-rest and in-transit, multi-factor authentication for privileged access, comprehensive audit logging, vulnerability-management cadence, incident-response process with US-CERT reporting, supply-chain controls, FedRAMP-conformant ConMon, and a US-Persons staffing posture if required.
   - **Control Gap Register** — control-by-control delta against the SSP. For each non-compliant or partial control: Control ID, gap description, severity (Critical / High / Moderate / Low per 3PAO RAR rubric), remediation owner, target completion date, planned POA&M entry. Cross-reference the NIST 800-53 artefact's "Planned" entries.
   - **Evidence Inventory** — table mapping every artefact (policies, procedures, diagrams, contracts, scan reports) to the controls it evidences. Identify evidence gaps where a control claim has no supporting artefact.
   - **Customer Responsibility Matrix (CRM) Draft** — for SaaS/PaaS CSOs, the controls the customer agency must implement to inherit the CSO's authorization.
   - **Authorization Path Recommendation** — Agency Authorization vs JAB Authorization, with rationale referencing JAB prioritization criteria (federal demand, unique capability, market readiness). Most CSOs pursue Agency; JAB is a high bar.
   - **3PAO Engagement Readiness** — go / no-go assessment with the top 5 blockers if no-go.
   - **POA&M Pre-Population** — gaps converted to draft POA&M rows in FedRAMP POA&M template format (Weakness, Source, Asset, Severity, Status, Original Detection Date, Scheduled Completion Date).

7. Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **FRRR** per-type checks pass. Fix any failures before proceeding.
8. Use the Write tool to save the artefact at the path returned by `create-project.sh` + `generate-document-id.mjs`.

9. Emit a short summary to the user — readiness verdict for 3PAO assessment (Ready / Conditionally Ready / Not Ready), gap counts by severity, recommended authorization path, and the top 3 blockers. Do not echo the full artefact.

## Handoffs

Surfaced gaps feed the broader `/arckit:service-assessment` evidence pack and remediation timelines drop into `/arckit:roadmap`. Each open gap should be tracked in `/arckit:risk` until closed. Once gaps are remediated, re-run this command to re-baseline before engaging a 3PAO.

## Important Notes

- **This is not the 3PAO's RAR** — only a FedRAMP-recognized 3PAO can prepare and attest the official Readiness Assessment Report, and only the FedRAMP PMO could designate a CSO "FedRAMP Ready" (no new submissions since 28 July 2026). This artefact is the CSP's internal pre-flight self-assessment; treat its verdict as advisory, and never present it with a 3PAO signature.
- **The Capability Statement is read first** — FedRAMP PMO reviewers triage CSOs by their capability statement. A vague, marketing-style description is a delay pattern; be concrete about what the CSO does, what cryptography it uses, what data classes it handles, and what federal mission it serves.
- **Gap severity rubric is consequential** — Critical and High gaps in the RAR are show-stoppers; Moderate and Low can be POA&M'd and authorised conditionally. Be honest about severity; under-rating a Critical gap surfaces during 3PAO assessment and burns 6–12 months.
- **CRM is mandatory for SaaS / PaaS** — the Customer Responsibility Matrix is what agency customers actually consume. A weak CRM blocks downstream agency adoption even after authorization.
- **JAB Prioritization is competitive** — JAB Authorizations are rationed. If pursuing JAB, the readiness verdict must also clear the JAB Prioritization Criteria; otherwise pivot to Agency.
- **Evidence Inventory gaps are usually the binding constraint** — control claims without evidencing artefacts are the most common 3PAO finding. Treat the Evidence Inventory as the primary remediation backlog, not the gap register.
- **POA&M pre-population accelerates 3PAO engagement** — a draft POA&M with realistic completion dates signals maturity to the 3PAO and the agency PMO. An empty POA&M after a gap register is read as evasion.
- **FedRAMP Rev 5 baseline applies** — all readiness checks must score against Rev 5 baselines. Rev 4 references are deprecated; using Rev 4 control IDs in the gap register is a documentation defect.
