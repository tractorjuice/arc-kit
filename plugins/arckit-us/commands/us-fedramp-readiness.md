---
description: "[COMMUNITY] Produce an internal FedRAMP readiness self-assessment in the format of the 3PAO Readiness Assessment Report — capability statement, gap register, evidence inventory, and recommended FedRAMP certification route (type, path and class)."
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
> are **OMB M-25-21** (use and governance of AI; it rescinded and replaced M-24-10 on 3 April 2025)
> and **OMB M-25-22** (acquisition of AI; it replaced M-24-18). FedRAMP completed the
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

There is no JAB route. OMB M-24-15 (25 July 2024) rescinded the 2011 memo that created the Joint Authorization Board: FedRAMP is now the GSA program office and the FedRAMP Board, existing JAB P-ATOs were re-designated, and the memo provides for agency authorizations (by one agency or a group of agencies) and program authorizations signed by the FedRAMP Director. Under the Consolidated Rules for 2026, every FedRAMP Certification has a **type** — Rev 5, the legacy approach, which takes no new applications after 11 June 2027, or 20x, the new approach assessed against Key Security Indicators — a **path** — Agency, where a sponsoring agency authorizes the service first and FedRAMP then reviews it, or Program, where FedRAMP certifies directly without a sponsor — and a **class**, A to D. For Rev 5, Class B carries the LI-SaaS and Low baselines, Class C Moderate and Class D High. The Program path is the normal route for 20x Classes A to C. For Rev 5 it is open only through the Ready Conversion and Lost Sponsor pipelines, for Class B or C, from 10 August 2026 to 11 June 2027, so a Rev 5 certification generally needs an agency sponsor and Rev 5 Class D always does. The RAR format used here belongs to the Rev 5 approach; it is not a 20x readiness check.

This command produces the **internal self-assessment** that FedRAMP's RAR templates invite CSPs to complete before engaging a 3PAO: the same questions, answered by the CSP, to find and close gaps first. It is not a 3PAO attestation and cannot confer FedRAMP Ready or any other FedRAMP status, but it materially de-risks the 3PAO engagement and helps the agency PMO scope effort.

**Authoritative anchors**:

- FedRAMP Readiness Assessment Report Template (3PAO), Moderate v2.1 (May 2024) and High, legacy since 23 June 2026 — <https://www.fedramp.gov/legacy/> (Moderate: <https://www.fedramp.gov/resources/templates/FedRAMP-Moderate-Readiness-Assessment-Report-(RAR)-Template.docx>)
- FedRAMP Consolidated Rules for 2026 — important dates (FedRAMP Ready retired 28 July 2026) — <https://www.fedramp.gov/2026/timeline/>
- FedRAMP Consolidated Rules for 2026 — Choosing a Certification Path — <https://www.fedramp.gov/2026/providers/start/path/>
- OMB M-24-15 (Modernizing the Federal Risk and Authorization Management Program) — <https://www.whitehouse.gov/wp-content/uploads/2024/07/M-24-15-Modernizing-the-Federal-Risk-and-Authorization-Management-Program.pdf>
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
   - **Control Gap Register** — control-by-control delta against the SSP. For each non-compliant or partial control: Control ID, gap description, severity (Critical / High / Moderate / Low, ArcKit's remediation-priority scale as the template defines it; the RAR itself records Yes / No answers, not severities), remediation owner, target completion date, planned POA&M entry. Cross-reference the NIST 800-53 artefact's "Planned" entries.
   - **Evidence Inventory** — table mapping every artefact (policies, procedures, diagrams, contracts, scan reports) to the controls it evidences. Identify evidence gaps where a control claim has no supporting artefact.
   - **Customer Responsibility Matrix (CRM) Draft** — for SaaS/PaaS CSOs, the controls the customer agency must implement to inherit the CSO's authorization.
   - **Certification Route Recommendation** — the certification profile to pursue: type (Rev 5 or 20x), path (Agency, naming the sponsoring agency, or Program) and class (A–D, with the baseline it carries). Give the rationale: whether an agency sponsor exists, whether the CSO is built on FedRAMP Certified infrastructure (20x) or runs its own (Rev 5), the class agency customers need, and the 11 June 2027 cut-off for new Rev 5 applications. Never offer a JAB P-ATO.
   - **3PAO Engagement Readiness** — go / no-go assessment with the top 5 blockers if no-go.
   - **POA&M Pre-Population** — gaps converted to draft POA&M rows in FedRAMP POA&M template format (Weakness, Source, Asset, Severity, Status, Original Detection Date, Scheduled Completion Date).

7. Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **FRRR** per-type checks pass. Fix any failures before proceeding.
8. Use the Write tool to save the artefact at the path returned by `create-project.sh` + `generate-document-id.mjs`.

9. Emit a short summary to the user — readiness verdict for 3PAO assessment (Ready / Conditionally Ready / Not Ready), gap counts by severity, recommended certification route, and the top 3 blockers. Do not echo the full artefact.

## Handoffs

Surfaced gaps feed the broader `/arckit:service-assessment` evidence pack and remediation timelines drop into `/arckit:roadmap`. Each open gap should be tracked in `/arckit:risk` until closed. Once gaps are remediated, re-run this command to re-baseline before engaging a 3PAO.

## Important Notes

- **This is not the 3PAO's RAR** — only a FedRAMP-recognized 3PAO can prepare and attest the official Readiness Assessment Report, and only the FedRAMP PMO could designate a CSO "FedRAMP Ready" (no new submissions since 28 July 2026). This artefact is the CSP's internal pre-flight self-assessment; treat its verdict as advisory, and never present it with a 3PAO signature.
- **The Capability Statement is read first** — FedRAMP PMO reviewers triage CSOs by their capability statement. A vague, marketing-style description is a delay pattern; be concrete about what the CSO does, what cryptography it uses, what data classes it handles, and what federal mission it serves.
- **The RAR asks Yes / No questions, not severities** — the RAR answers each Federal Mandate and FedRAMP Requirement Yes or No: a Federal Mandate is Yes only when fully and strictly met, a FedRAMP Requirement only when consistently met, and a partly implemented capability is No, with what is missing described. A 3PAO could recommend FedRAMP Ready only if every Federal Mandate was Yes, and the RAR warns that a CSP is unlikely to be authorized if any FedRAMP Requirement is unmet. The 3PAO also judges overall readiness. Critical / High / Moderate / Low is ArcKit's own scale for ordering remediation, defined in the template; be honest with it, because under-rating a gap that would turn a RAR answer to No surfaces during 3PAO assessment and burns 6–12 months.
- **CRM is mandatory for SaaS / PaaS** — the Customer Responsibility Matrix is what agency customers actually consume. A weak CRM blocks downstream agency adoption even after authorization.
- **There is no JAB path** — OMB M-24-15 ended the JAB, and its prioritization criteria no longer apply. A Rev 5 certification generally needs an agency sponsor; the sponsorless Program path is mainly for FedRAMP 20x, and for Rev 5 only through the Ready Conversion and Lost Sponsor pipelines until 11 June 2027. Confirm the route on fedramp.gov before committing.
- **Evidence Inventory gaps are usually the binding constraint** — control claims without evidencing artefacts are the most common 3PAO finding. Treat the Evidence Inventory as the primary remediation backlog, not the gap register.
- **POA&M pre-population accelerates 3PAO engagement** — a draft POA&M with realistic completion dates signals maturity to the 3PAO and the agency PMO. An empty POA&M after a gap register is read as evasion.
- **FedRAMP Rev 5 baseline applies** — all readiness checks must score against Rev 5 baselines. Rev 4 references are deprecated; using Rev 4 control IDs in the gap register is a documentation defect.
