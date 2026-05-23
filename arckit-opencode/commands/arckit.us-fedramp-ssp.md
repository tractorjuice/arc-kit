---
description: "[COMMUNITY] Draft a FedRAMP System Security Plan (Moderate / High baseline) aligned to the current FedRAMP SSP template structure — system identification, boundary, types of users, interconnections, control implementations, continuous monitoring."
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

Since 2024, FedRAMP requires all new SSP submissions against the **Rev 5** baselines and is progressively requiring **OSCAL** machine-readable submission. The SSP template (Word and OSCAL) is published on fedramp.gov; the structure below reflects the current 15-section layout. Authorization Boundary Guidance (ABG) defines what is in-scope; getting the boundary right is the most common cause of FedRAMP delays.

**Authoritative anchors**:

- FedRAMP SSP Template (Rev 5, current revision) — <https://www.fedramp.gov/documents-templates/>
- FedRAMP Authorization Boundary Guidance — <https://www.fedramp.gov/assets/resources/documents/CSP_A_FedRAMP_Authorization_Boundary_Guidance.pdf>
- FedRAMP Rev 5 Baselines (Low / Moderate / High / LI-SaaS) — <https://www.fedramp.gov/rev5/baselines/>
- NIST SP 800-37 Rev 2 (Risk Management Framework) — <https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-37r2.pdf>
- NIST SP 800-53 Rev 5 — <https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-53r5.pdf>
- FedRAMP OSCAL guidance — <https://www.fedramp.gov/using-the-fedramp-oscal-resources-and-templates/>

## Process

1. Read prerequisites:
   - `projects/000-global/ARC-000-PRIN-*.md` (architecture principles, if present)
   - **REQUIRED**: The project's FIPS 199 artefact — selects the SSP baseline (Moderate or High).
   - **REQUIRED**: The project's NIST 800-53 control-tailoring artefact — provides per-control implementation statements.
   - The project's REQ, DATA, and any HLD / DLD artefacts (for system description, boundary, interconnections)
   - Architecture diagrams (`projects/<id>/diagrams/`) — for boundary, data-flow, and network diagrams referenced in §10–§11
   - `.arckit/templates/_partials/RENDERING.md`

2. Read the template:
   - **First**, check `.arckit/templates-custom/us-fedramp-ssp-template.md` (user override)
   - **Then**, `.arckit/templates/us-fedramp-ssp-template.md`
   - **Fallback**, `.arckit/templates/us-fedramp-ssp-template.md`

3. Use `scripts/bash/create-project.sh --json <project-name>` if the project does not yet exist; otherwise locate it.

4. Use `scripts/bash/generate-document-id.sh <PROJECT_ID> FRSSP --filename` for the artefact filename. The type code for this command is `FRSSP`.

5. Generate the 15-section FedRAMP SSP structure:

   1. **Information System Name and Title** — CSO name, CSP company, FedRAMP package ID (if assigned)
   2. **Information System Categorization** — pull verbatim from FIPS 199 artefact (CIA water-mark)
   3. **Information System Owner** — name, agency/CSP, role, contact details
   4. **Authorizing Official** — Agency AO (Agency Authorization path) or FedRAMP JAB (Joint Authorization)
   5. **Other Designated Contacts** — ISSO, ISSM, AO Designated Rep, PMO POC
   6. **Assignment of Security Responsibility** — RACI for system security; cite the SSP §6 designation
   7. **Information System Operational Status** — Operational / Under Development / Major Modification
   8. **Information System Type** — IaaS / PaaS / SaaS, deployment model (Public / Private / Hybrid / Community)
   9. **General System Description** — purpose, mission served, user populations, customer-facing capabilities
   10. **System Environment** — pull the authorization-boundary diagram; describe components inside vs outside the boundary; identify external services with explicit in-scope / out-of-scope justification per ABG
   11. **System Interconnections** — every external system connection: name, FedRAMP package ID, agreement type (ICA / MOU / ISA), data direction, ports/protocols, sensitivity
   12. **Applicable Laws and Regulations** — FISMA, Privacy Act, E-Gov Act §208, agency-specific statutes (HIPAA for HHS systems, FERPA for ED systems, etc.), executive orders, OMB memoranda (M-24-10 if AI in scope)
   13. **Minimum Security Controls** — control-by-control implementation table drawn from the NIST 800-53 artefact: Control ID, Implementation Status, Control Origination (Service Provider Corporate / SP System Specific / Configured by Customer / Provided by Customer / Shared / Inherited), Implementation Description, Customer Responsibility (if Shared)
   14. **Types of Users** — Internal (CSP staff) / Privileged / Non-Privileged / External / Public; required clearances, citizenship requirements (US-Persons for some agencies), authentication mechanisms (PIV / login.gov / federated)
   15. **Network Architecture** — boundary diagram, internal network topology, public-facing components, management plane separation
   16. **Continuous Monitoring (ConMon) Strategy** — monthly vulnerability scans (authenticated / unauthenticated / web app / container / database), annual assessment, POA&M cadence, ATO drift management

6. Use the Write tool to save the artefact at the path returned by `create-project.sh` + `generate-document-id.sh`.

7. Emit a short summary to the user — CSO name, baseline (Moderate / High), authorization path (Agency / JAB), boundary component count, interconnection count, and any sections marked `<TBC>`. Do not echo the full artefact.

## Handoffs

Once the SSP is in draft, run `/arckit:us-fedramp-readiness` to produce the 3PAO-style Readiness Assessment Report (RAR) capturing gaps against the SSP control claims. The SSP control implementations also drive the Zero Trust scoring (`/arckit:us-zero-trust`) and the ICAM architecture (`/arckit:us-icam`). Boundary, interconnection, and Types-of-Users content must be kept consistent with the architecture diagrams under `projects/<id>/diagrams/`.

## Important Notes

- **The Authorization Boundary is the single highest-risk SSP section** — most FedRAMP delays trace to ambiguous or shifting boundaries. Apply the FedRAMP Authorization Boundary Guidance strictly: every external service must be explicitly in-scope (and therefore covered by the SSP's controls) or out-of-scope (and therefore relying on independent ATO or contractual safeguards).
- **Customer Responsibility Matrix (CRM) is not optional** — for SaaS and PaaS CSOs, the CRM is a separate deliverable but its content is determined by the SSP's Control Origination column. Inconsistency between SSP and CRM blocks authorization.
- **JAB vs Agency path** — most CSOs should pursue Agency Authorization. JAB Authorization is restricted to CSOs that meet the JAB Prioritization Criteria (federal demand, unique capability, market readiness); aiming for JAB without those criteria is a delay pattern.
- **OSCAL submission is being phased in** — confirm with the FedRAMP PMO whether OSCAL is required for the current submission window. Even where Word is accepted, plan the OSCAL conversion as a roadmap item.
- **ConMon is a continuous obligation** — the SSP §16 Continuous Monitoring section is not "set and forget". Monthly vulnerability scanning, ongoing POA&M maintenance, and annual assessment are pre-conditions of maintaining the ATO.

## Suggested Next Steps

After completing this command, consider running:

- `/arckit:us-fedramp-readiness` -- The SSP is the primary input to the 3PAO Readiness Assessment Report; gaps surfaced during SSP authoring populate the RAR gap register.
- `/arckit:us-zero-trust` -- SSP control implementations seed the CISA Zero Trust Maturity scoring (Identity, Devices, Networks, Apps & Workloads, Data pillars).
- `/arckit:us-icam` -- The Types of Users section and IA-family control implementations connect to the ICAM architecture.
