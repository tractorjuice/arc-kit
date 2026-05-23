---
description: "[COMMUNITY] Produce a 3PAO-style Readiness Assessment Report for a FedRAMP authorization — capability statement, gap register, evidence inventory, and recommended ATO path (Agency vs JAB)."
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

You are an enterprise architect producing a **FedRAMP Readiness Assessment Report (RAR)** — a 3PAO-style internal readiness check ahead of formal third-party assessment.

## User Input

```text
$ARGUMENTS
```

## Context

The FedRAMP Readiness Assessment Report (RAR) is the deliverable a Third Party Assessment Organisation (3PAO) produces against the official RAR template to determine whether a CSO is ready to enter the FedRAMP authorization process. A "FedRAMP Ready" designation requires the 3PAO to attest that the CSO meets the security capabilities, has functioning processes for all 17 control families relevant at the baseline, and has produced an SSP and supporting artefacts of sufficient quality.

This command produces an **internal** RAR-equivalent: a self-assessment in the same shape as the 3PAO RAR, used to surface gaps before engaging a 3PAO. The output is not a 3PAO attestation and does not confer FedRAMP Ready status, but it materially de-risks the 3PAO engagement and helps the agency PMO scope effort.

**Authoritative anchors**:

- FedRAMP Readiness Assessment Report Template (3PAO) — <https://www.fedramp.gov/documents-templates/>
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
   - `.arckit/templates/_partials/RENDERING.md`

2. Read the template:
   - **First**, check `.arckit/templates-custom/us-fedramp-readiness-template.md` (user override)
   - **Then**, `.arckit/templates/us-fedramp-readiness-template.md`
   - **Fallback**, `.arckit/templates/us-fedramp-readiness-template.md`

3. Use `scripts/bash/create-project.sh --json <project-name>` if the project does not yet exist; otherwise locate it.

4. Use `scripts/bash/generate-document-id.sh <PROJECT_ID> FRRR --filename` for the artefact filename. The type code for this command is `FRRR`.

5. Generate the following sections:

   - **Capability Statement** — what the CSO does, the service model (IaaS/PaaS/SaaS), the deployment model, the customer-facing capabilities, and the boundary in one diagram. This is the section a FedRAMP PMO reviewer reads first; it must clearly state why a federal agency would use the CSO.
   - **FedRAMP Ready Capabilities Checklist** — confirmation that the CSO supports the federal baseline capabilities: FIPS 140-3 validated cryptography for data-at-rest and in-transit, multi-factor authentication for privileged access, comprehensive audit logging, vulnerability-management cadence, incident-response process with US-CERT reporting, supply-chain controls, FedRAMP-conformant ConMon, and a US-Persons staffing posture if required.
   - **Control Gap Register** — control-by-control delta against the SSP. For each non-compliant or partial control: Control ID, gap description, severity (Critical / High / Moderate / Low per 3PAO RAR rubric), remediation owner, target completion date, planned POA&M entry. Cross-reference the NIST 800-53 artefact's "Planned" entries.
   - **Evidence Inventory** — table mapping every artefact (policies, procedures, diagrams, contracts, scan reports) to the controls it evidences. Identify evidence gaps where a control claim has no supporting artefact.
   - **Customer Responsibility Matrix (CRM) Draft** — for SaaS/PaaS CSOs, the controls the customer agency must implement to inherit the CSO's authorization.
   - **Authorization Path Recommendation** — Agency Authorization vs JAB Authorization, with rationale referencing JAB prioritization criteria (federal demand, unique capability, market readiness). Most CSOs pursue Agency; JAB is a high bar.
   - **3PAO Engagement Readiness** — go / no-go assessment with the top 5 blockers if no-go.
   - **POA&M Pre-Population** — gaps converted to draft POA&M rows in FedRAMP POA&M template format (Weakness, Source, Asset, Severity, Status, Original Detection Date, Scheduled Completion Date).

6. Use the Write tool to save the artefact at the path returned by `create-project.sh` + `generate-document-id.sh`.

7. Emit a short summary to the user — readiness verdict (Ready / Conditionally Ready / Not Ready), gap counts by severity, recommended authorization path, and the top 3 blockers. Do not echo the full artefact.

## Handoffs

Surfaced gaps feed the broader `/arckit:service-assessment` evidence pack and remediation timelines drop into `/arckit:roadmap`. Each open gap should be tracked in `/arckit:risk` until closed. Once gaps are remediated, re-run this command to re-baseline before engaging a 3PAO.

## Important Notes

- **This is not a 3PAO RAR** — only an accredited 3PAO can issue a binding Readiness Assessment Report and grant "FedRAMP Ready" designation. This artefact is the internal pre-flight check; treat its verdict as advisory only.
- **The Capability Statement is read first** — FedRAMP PMO reviewers triage CSOs by their capability statement. A vague, marketing-style description is a delay pattern; be concrete about what the CSO does, what cryptography it uses, what data classes it handles, and what federal mission it serves.
- **Gap severity rubric is consequential** — Critical and High gaps in the RAR are show-stoppers; Moderate and Low can be POA&M'd and authorised conditionally. Be honest about severity; under-rating a Critical gap surfaces during 3PAO assessment and burns 6–12 months.
- **CRM is mandatory for SaaS / PaaS** — the Customer Responsibility Matrix is what agency customers actually consume. A weak CRM blocks downstream agency adoption even after authorization.
- **JAB Prioritization is competitive** — JAB Authorizations are rationed. If pursuing JAB, the readiness verdict must also clear the JAB Prioritization Criteria; otherwise pivot to Agency.
- **Evidence Inventory gaps are usually the binding constraint** — control claims without evidencing artefacts are the most common 3PAO finding. Treat the Evidence Inventory as the primary remediation backlog, not the gap register.
- **POA&M pre-population accelerates 3PAO engagement** — a draft POA&M with realistic completion dates signals maturity to the 3PAO and the agency PMO. An empty POA&M after a gap register is read as evasion.
- **FedRAMP Rev 5 baseline applies** — all readiness checks must score against Rev 5 baselines. Rev 4 references are deprecated; using Rev 4 control IDs in the gap register is a documentation defect.

## Suggested Next Steps

After completing this command, consider running:

- `/arckit:service-assessment` -- The readiness gap register feeds the broader service-assessment evidence pack.
- `/arckit:roadmap` -- Remediation actions for FedRAMP gaps drop into the architecture roadmap timeline.
- `/arckit:risk` -- Open gaps and POA&M items become entries in the project risk register.
