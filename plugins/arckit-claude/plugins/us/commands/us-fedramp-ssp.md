---
description: "[COMMUNITY] Draft a 14-section FedRAMP System Security Plan (Moderate / High baseline) mapped to the FedRAMP Rev 5 SSP template — system identification, boundary, interconnections, types of users, control implementations, continuous monitoring."
doc-type: FRSSP
argument-hint: "<project ID or CSO name, e.g. '001', 'Agency Citizen Services Portal'>"
effort: high
keep-coding-instructions: true
handoffs:
  - command: us-fedramp-readiness
    description: The SSP is the primary input to the readiness self-assessment (3PAO RAR format); gaps surfaced during SSP authoring populate its gap register.
  - command: us-zero-trust
    description: SSP control implementations seed the CISA Zero Trust Maturity scoring (Identity, Devices, Networks, Apps & Workloads, Data pillars).
  - command: us-icam
    description: The Types of Users section and IA-family control implementations connect to the ICAM architecture.
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

You are an enterprise architect drafting a **FedRAMP System Security Plan (SSP)** for a Cloud Service Offering (CSO) pursuing Agency or JAB authorization at the FedRAMP Moderate or High baseline.

## User Input

```text
$ARGUMENTS
```

## Context

The FedRAMP SSP is the central artefact of a FedRAMP authorization package. It documents the CSO at a level of detail sufficient for an Authorizing Official (AO) — agency-level for Agency ATO, or the FedRAMP PMO / JAB for Joint Authorization — to make a risk-based authorization decision. The SSP cross-references the FedRAMP SAP (Security Assessment Plan), SAR (Security Assessment Report), and POA&M, and is updated continuously through ConMon (Continuous Monitoring).

Since 2024, FedRAMP requires all new SSP submissions against the **Rev 5** baselines and is progressively requiring **OSCAL** machine-readable submission. The FedRAMP Rev 5 SSP template (v1.1, October 2023) has 12 numbered front-matter sections and Appendices A–Q; the control implementations sit in Appendix A, one version per baseline. FedRAMP marked that template legacy on 23 June 2026, as the FedRAMP Consolidated Rules for 2026 replace it, and stops accepting applications for new Rev 5 certifications on 11 June 2027 — confirm on fedramp.gov which template your submission must use. ArcKit's SSP is an architecture-led draft in **14 sections**; step 6 lists each one and the part of the FedRAMP template it feeds. Authorization Boundary Guidance (ABG) defines what is in-scope; getting the boundary right is the most common cause of FedRAMP delays.

**Authoritative anchors**:

- FedRAMP SSP Template (Rev 5, current revision) — <https://www.fedramp.gov/documents-templates/>
- FedRAMP Authorization Boundary Guidance — <https://www.fedramp.gov/assets/resources/documents/CSP_A_FedRAMP_Authorization_Boundary_Guidance.pdf>
- FedRAMP Rev 5 Baselines (Low / Moderate / High / LI-SaaS) — <https://www.fedramp.gov/rev5/baselines/>
- NIST SP 800-37 Rev 2 (Risk Management Framework) — <https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-37r2.pdf>
- NIST SP 800-53 Rev 5 — <https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-53r5.pdf>
- FedRAMP OSCAL guidance — <https://www.fedramp.gov/using-the-fedramp-oscal-resources-and-templates/>
- FedRAMP Consolidated Rules for 2026 — important dates — <https://www.fedramp.gov/2026/timeline/>

## Process

1. Read prerequisites:
   - `projects/000-global/ARC-000-PRIN-*.md` (architecture principles, if present)
   - **REQUIRED**: The project's FIPS 199 artefact — selects the SSP baseline (Moderate or High).
   - **REQUIRED**: The project's NIST 800-53 control-tailoring artefact — provides per-control implementation statements.
   - The project's REQ and DATA artefacts, and any vendor HLD / DLD documents under `projects/<id>/vendors/` (for system description, boundary, interconnections)
   - Architecture diagrams (`projects/<id>/diagrams/`) — for the boundary and data-flow diagrams in §5 and the network diagram in §10
   - `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md`

2. Read the template:
   - **First**, check `.arckit/templates-custom/us-fedramp-ssp-template.md` (user override)
   - **Then**, `.arckit/templates/us-fedramp-ssp-template.md`
   - **Fallback**, `${CLAUDE_PLUGIN_ROOT}/templates/us-fedramp-ssp-template.md`

3. Use `bash ${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh --json --name "<project-name>"` if the project does not yet exist; otherwise locate it.

4. Use `node ${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs <PROJECT_ID> FRSSP {VERSION} --filename` for the artefact filename. The type code for this command is `FRSSP`. Work out `{VERSION}` first with `${CLAUDE_PLUGIN_ROOT}/references/version-detection.md`: a re-run writes the next version beside the earlier file, never over it.

5. Resolve the `<!-- DOC-CONTROL-HEADER -->` marker per `RENDERING.md` before writing the artefact. `RENDERING.md` hard-routes the US regime to `_partials/document-control-us.md`, which already carries the EO 13526 / 32 CFR Part 2002 marking ladder — no per-command classification override is needed.

6. Generate the template's 14 sections. The italic note after each one names the part of the FedRAMP Rev 5 SSP template it feeds; that template's §1 Introduction and §2 Purpose are standard text and are not drafted here.

   1. **System Identification** — CSO name and identifier, CSP, FedRAMP package ID (if assigned), service model (IaaS / PaaS / SaaS), deployment model, authorization path, sponsoring agency, baseline, digital identity level, operational status and fully-operational date. *FedRAMP §3 System Information (Table 3.1).*
   2. **System Categorization** — pull verbatim from the FIPS 199 artefact (CIA water-mark). *FedRAMP §3 and Appendix K.*
   3. **System Owner & Authorising Official** — System Owner, Authorizing Official (Agency AO for Agency Authorization, FedRAMP JAB for Joint Authorization), ISSO, ISSM and other designated contacts, plus a separation-of-duties matrix for every role with access to the system. *FedRAMP §4, §5 and §11.*
   4. **System Description** — purpose, mission served, user populations, customer use cases and the sectors targeted. *FedRAMP §3 General System Description and §8.2 Narrative.*
   5. **System Environment** — the authorization-boundary and data-flow diagrams; components inside vs outside the boundary; external services with explicit in-scope / out-of-scope justification per ABG; inventory summary. *FedRAMP §8.1 and Appendix M (Integrated Inventory Workbook).*
   6. **System Interconnections** — leveraged FedRAMP-authorized services; external systems and services without FedRAMP authorization; and every connection that crosses the boundary: name, FedRAMP package ID, agreement type (ICA / MOU / ISA), data direction, ports/protocols, sensitivity. *FedRAMP §6 and §7.*
   7. **Applicable Laws and Regulations** — FISMA, Privacy Act, E-Gov Act §208, agency-specific statutes (HIPAA for HHS systems, FERPA for ED systems, etc.), executive orders, OMB memoranda (M-24-10 if AI in scope). *FedRAMP Appendix L.*
   8. **Minimum Security Controls** — baseline selection and control counts drawn from the NIST 800-53 artefact (the full tailoring matrix stays there), and the Control Origination (Service Provider Corporate / SP System Specific / Configured by Customer / Provided by Customer / Shared / Inherited) and Customer Responsibility of every control that is not wholly provider-originated. *FedRAMP Appendix A and Appendix J (CIS/CRM Workbook).*
   9. **Types of Users** — Internal (CSP staff) / Privileged / Non-Privileged / External / Public; required clearances, citizenship requirements (US-Persons for some agencies), authentication mechanisms (PIV / login.gov / federated) and assurance levels (IAL / AAL / FAL). *FedRAMP §3 Digital Identity Level and Appendix E (Digital Identity Worksheet).*
   10. **Network Architecture** — network diagram, segmentation zones, public-facing components, management-plane separation; services, ports and protocols; cryptographic modules for data at rest and in transit. *FedRAMP §8.1, §9, §10 and Appendix Q.*
   11. **Control Implementations** — implementation narrative for each control family; the control-by-control narrative belongs in Appendix A or the OSCAL SSP. *FedRAMP Appendix A.*
   12. **Configuration Management** — configuration management plan, baseline configurations, change control board, drift detection. *FedRAMP Appendix H.*
   13. **Continuous Monitoring** — vulnerability scan cadence by type (authenticated / unauthenticated / web application / container / database), annual assessment, POA&M cadence, ATO drift management. *FedRAMP Appendix N (ConMon Plan) and Appendix O (POA&M).*
   14. **Appendices Inventory** — each FedRAMP SSP appendix (A–Q) with its source: the section of this plan, the ArcKit artefact, or the CSP document that supplies it. *FedRAMP §12 SSP Appendices List.*

7. Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **FRSSP** per-type checks pass. Fix any failures before proceeding.
8. Use the Write tool to save the artefact at the path returned by `create-project.sh` + `generate-document-id.mjs`.

9. Emit a short summary to the user — CSO name, baseline (Moderate / High), authorization path (Agency / JAB), boundary component count, interconnection count, and any sections marked `<TBC>`. Do not echo the full artefact.

## Handoffs

Once the SSP is in draft, run `/arckit-us:us-fedramp-readiness` to produce the internal readiness self-assessment, in the format of the 3PAO Readiness Assessment Report (RAR), capturing gaps against the SSP control claims. The SSP control implementations also drive the Zero Trust scoring (`/arckit-us:us-zero-trust`) and the ICAM architecture (`/arckit-us:us-icam`). Boundary, interconnection, and Types-of-Users content must be kept consistent with the architecture diagrams under `projects/<id>/diagrams/`.

## Important Notes

- **The Authorization Boundary is the single highest-risk SSP section** — most FedRAMP delays trace to ambiguous or shifting boundaries. Apply the FedRAMP Authorization Boundary Guidance strictly: every external service must be explicitly in-scope (and therefore covered by the SSP's controls) or out-of-scope (and therefore relying on independent ATO or contractual safeguards).
- **Customer Responsibility Matrix (CRM) is not optional** — for SaaS and PaaS CSOs, the CRM is a separate deliverable but its content is determined by the SSP's Control Origination column. Inconsistency between SSP and CRM blocks authorization.
- **JAB vs Agency path** — most CSOs should pursue Agency Authorization. JAB Authorization is restricted to CSOs that meet the JAB Prioritization Criteria (federal demand, unique capability, market readiness); aiming for JAB without those criteria is a delay pattern.
- **OSCAL submission is being phased in** — confirm with the FedRAMP PMO whether OSCAL is required for the current submission window. Even where Word is accepted, plan the OSCAL conversion as a roadmap item.
- **ConMon is a continuous obligation** — the SSP §13 Continuous Monitoring section (FedRAMP Appendix N) is not "set and forget". Monthly vulnerability scanning, ongoing POA&M maintenance, and annual assessment are pre-conditions of maintaining the ATO.
