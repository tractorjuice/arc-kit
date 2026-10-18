---
description: "[COMMUNITY] Generate a Protective Security Policy Framework (PSPF) compliance assessment for Australian Government entities and contractors against the six security domains and numbered requirements of the current PSPF release."
doc-type: AUPSPF
argument-hint: "<project ID or system, e.g. '001'>"
effort: high
handoffs:
  - command: diagram
    description: Architecture and deployment diagrams support PSPF Information, Technology and Physical domain evidence — boundaries, facilities and remote access.
  - command: data-model
    description: Data model evidence identifies information classification, sensitivity, owners, retention, and handling requirements.
  - command: au-ism-controls
    description: The PSPF Technology domain requires the ASD ISM to be applied — the ISM applicability statement is the primary evidence for that domain.
  - command: au-e8-posture
    description: The PSPF Technology domain requires the Essential Eight at Maturity Level Two — E8 posture is the evidence.
  - command: au-pia
    description: APP 11 overlaps the PSPF Information and Personnel domains; PIA cross-reference.
  - command: au-disp-attestation
    description: DISP attestation pack draws on PSPF compliance evidence.
  - command: servicenow
    description: ServiceNow/CMDB evidence supports service ownership, supporting services, support groups, facilities dependencies, and incident/change evidence.
  - command: risk
    description: PSPF gaps and annual protective security report findings should feed the project risk register.
  - command: traceability
    description: PSPF requirements should trace to policies, controls, owners, evidence artefacts, and remediation actions.
  - command: maturity-model
    description: PSPF assessment results can seed security governance maturity uplift planning.
  - command: graph-report
    description: Graph reporting should show AUPSPF coverage alongside AU compliance, risk, traceability, and operations artefacts.
allowed-tools:
  - Read(/${CLAUDE_PLUGIN_ROOT}/**)
  - Bash(bash ${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh *)
  - Bash(bash "${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh" *)
  - Bash(${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh *)
  - Bash(node ${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs *)
  - Bash(node "${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs" *)
---

> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output should be reviewed by a PSPF-experienced security officer or government accreditation specialist. The PSPF is administered by the Department of Home Affairs and re-released annually — verify the release against the current publication at protectivesecurity.gov.au.

You are an enterprise architect generating a **Protective Security Policy Framework (PSPF) compliance assessment** for an Australian Government entity or contractor handling government information.

## User Input

```text
$ARGUMENTS
```

## Context

The Protective Security Policy Framework (PSPF) is the Australian Government's protective security policy, administered by the Department of Home Affairs. Non-corporate Commonwealth entities must apply it (PGPA Act s 21); it is better practice for corporate Commonwealth entities and wholly-owned Commonwealth companies; state and territory agencies apply it to the Australian Government security classified information they hold or access; and non-government organisations and service providers implement the parts their deeds or agreements require. PSPF compliance is a primary input to DISP attestation and to IRAP scope statements.

The current release (**PSPF Release 2026**, published 1 July 2026; the PSPF is reviewed and re-released each year) sets out policy across **six security domains**, each a Part of the release, with individually numbered mandatory requirements. Each requirement carries a ribbon giving its number, domain code, applicability and last-updated date — for example `Requirement 0084 | TECH | All entities`.

| Domain | Code | Release 2026 sections |
|--------|------|-----------------------|
| Governance | GOV | 1–4: whole-of-government and entity security roles, security planning, incidents and training, protective security reporting |
| Risk | RISK | 5–8: security risk management, third-party risk management, countering foreign interference and espionage, contingency planning |
| Information | INFO | 9–12: classifications and caveats, information holdings, information disposal, information sharing |
| Technology | TECH | 13–15: technology lifecycle management (including applying the ASD ISM), cyber security strategies (including the Essential Eight to Maturity Level Two), cyber security programs |
| Personnel | PER | 16–22: pre-employment eligibility, access to resources, security clearances and vetting, ongoing assessment, separation |
| Physical | PHYS | 23–25: physical security lifecycle, security zones, physical security measures and controls |

The domains are named, not numbered. Earlier editions organised the PSPF into four outcomes (governance, information, personnel and physical security) with 16 core requirements; the current release replaces that structure, so do not assess against "Outcome 1–4" or "CR1–CR16".

**Authoritative anchor**: Protective Security Policy Framework — <https://www.protectivesecurity.gov.au/> (current release and the List of Requirements under "PSPF Annual Release")

**Key references**:

- PSPF Release 2026 and PSPF Release 2026 – List of Requirements — Department of Home Affairs
- PSPF Standards and PSPF Guidelines — additional mandatory requirements and recommended approaches
- ASD Information Security Manual (ISM) — applied under the Technology domain
- ASD Essential Eight — Maturity Level Two required under the Technology domain
- DISP (Defence Industry Security Program) — adjacent framework

## Process

1. Read prerequisites:
   - The project's E8 posture (`ARC-{P}-AUE8-v*`)
   - The project's ISM applicability (`ARC-{P}-AUISM-v*`) — primary input
   - The project's PIA (`ARC-{P}-AUPIA-v*`)
   - The project's RISK artefact
   - The project's DIAG artefacts (`ARC-{P}-DIAG-*`) — deployment, facility, boundary, and working-off-site evidence
   - The project's DATA artefact (`ARC-{P}-DATA-v*`) — classification, sensitivity, retention, and information-owner evidence
   - The project's ServiceNow artefact (`ARC-{P}-SNOW-v*`) if available — CMDB ownership, support groups, supporting services, incident/change workflows
   - The project's TRAC artefact if available — core-requirement evidence mappings
   - The project's maturity-model artefact if available — security governance capability baseline
   - `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md`

2. Read the template:
   - First: `.arckit/templates-custom/au-pspf-template.md`
   - Then: `.arckit/templates/au-pspf-template.md`
   - Fallback: `${CLAUDE_PLUGIN_ROOT}/templates/au-pspf-template.md`

3. Use `bash ${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh --json --name "<project-name>"` if the project does not yet exist; otherwise locate it.

4. Use `node ${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs <PROJECT_ID> AUPSPF {VERSION} --filename` for the artefact filename. Work out `{VERSION}` first with `${CLAUDE_PLUGIN_ROOT}/references/version-detection.md`: a re-run writes the next version beside the earlier file, never over it.

5. Resolve the `<!-- DOC-CONTROL-HEADER -->` marker per `RENDERING.md` before writing the artefact. `RENDERING.md` hard-routes the AU regime to `_partials/document-control-au.md`, which already carries the PSPF classification ladder — no per-command classification override is needed.

6. Generate the following sections:

   - **Entity Profile** — entity name, type (non-corporate Commonwealth / corporate Commonwealth / wholly-owned Commonwealth company / state or territory agency holding Australian Government classified information / service provider under deed or agreement), PSPF applicability driver (PGPA Act s 21 / better practice / intergovernmental arrangement / contractual flow-down), PSPF release assessed against, Chief Security Officer (CSO) and Chief Information Security Officer (CISO) designation.

   - **Requirement Scoping** — state which requirements are in scope from the PSPF List of Requirements for the release assessed. Requirements apply by applicability tag (All entities, or a named role such as DOS, TAE, AVA, SSPE or SOGS); record any requirement scoped out with the reason. For a service provider, scope only the requirements its deed or agreement imposes and name the clause.

   - **Domain assessments** — one section per domain, in the release's order. In each, assess the in-scope requirements by their PSPF number:
     1. **Governance (GOV)** — security roles (Accountable Authority, CSO, CISO, security practitioners), security governance, security planning, practices and procedures, continuous monitoring, security culture and awareness training, security incidents and investigations, protective security reporting
     2. **Risk (RISK)** — security risk tolerance and management process, third-party risk management (procurement, outsourcing and contract management), countering foreign interference and espionage (including insider threat programs), contingency planning (exceptional circumstances, alternative mitigations, business continuity)
     3. **Information (INFO)** — originator responsibilities, security classifications and caveats, minimum protections and handling, information holdings and asset registers, disposal, need-to-know and domestic and international sharing
     4. **Technology (TECH)** — technology lifecycle management (ISM applied; technology estate, system authorisation, asset storage and disposal), cyber security strategy and Essential Eight to Maturity Level Two, cyber security programs (gateway security, secure cloud and hosting, Systems of Government Significance)
     5. **Personnel (PER)** — pre-employment screening, access to resources, security clearances and Authorised Vetting Agencies, vetting process, maintenance and ongoing assessment, separation
     6. **Physical (PHYS)** — physical security lifecycle (plan, design, construct or lease, operate entity facilities), security zones and their certification, physical security measures and controls

     For each requirement document:
     - Requirement number and domain code exactly as the release shows them (e.g., `0084 | TECH`), with the requirement paraphrased — do not invent numbers; where the List of Requirements is not to hand, mark the number `[VERIFY]`
     - Reporting type from the List of Requirements (Performance / Yes/No / Yes/No/Not Applicable)
     - Status: ✅ Implemented / ⚠️ Partially implemented / ❌ Not implemented / N/A (with reason)
     - Evidence supporting status (cite ARC-{P}-AUISM, AUE8, AUPIA, AUDISP where applicable)
     - Specific gap description
     - Remediation actions with owner and target date

   - **Annual Protective Security Report** — for entities that must report, record who prepares it, the CSO as submitter in the PSPF Reporting Portal (or the offline template for SECRET and above), the reporting period, last submission to the Department of Home Affairs, Accountable Authority approval, the report to the responsible Minister, and the separate ASD Cyber Security Survey.

   - **Compliance Summary** — one row per domain: requirements in scope, implemented, partially implemented, not implemented, N/A; overall statement per domain.

   - **ArcKit Evidence Integration** — map `/arckit:diagram`, `/arckit:data-model`, `/arckit:servicenow`, `/arckit:risk`, `/arckit:traceability`, `/arckit:graph-report`, and `/arckit:maturity-model` outputs to PSPF domains, CMDB ownership, supporting services, annual reporting evidence, and remediation tracking.

   - **Recommendations** — prioritised remediations by Quick Wins / Short-Term / Medium-Term, each tagged to a domain and requirement number.

7. Populate the External References section per `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. The PSPF (with the release assessed, e.g. Release 2026) MUST appear in the Document Register.

8. Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **AUPSPF** per-type checks pass. Fix any failures before proceeding.
9. Write the artefact via the Write tool to `projects/<project-id>/<filename>`.

10. Show only a summary to the user (one paragraph plus the six-domain compliance summary table).

## Important Notes

- The PSPF must be applied by **non-corporate Commonwealth entities** (PGPA Act s 21). It is better practice for corporate Commonwealth entities and wholly-owned Commonwealth companies; state and territory agencies apply it to Australian Government security classified information they hold or access; non-government organisations and service providers implement the parts their deeds or agreements require.
- Accountable Authorities report compliance annually to their Minister and to the Department of Home Affairs (the annual protective security report). Each requirement maps to a reporting question with a reporting type (Performance, Yes/No, or Yes/No/Not Applicable) set out in the List of Requirements. Report the entity's own answers in the entity's own report; this artefact's ✅ / ⚠️ / ❌ statuses are an assessment aid, not the official return.
- **The ISM is applied under the Technology domain.** Defer to the ISM applicability statement (`ARC-{P}-AUISM-v*`) for technical-controls evidence rather than duplicating it. The Technology domain also requires the Essential Eight at Maturity Level Two — cite the E8 posture artefact.
- For the Personnel domain, security clearances are granted by Authorised Vetting Agencies (AGSVA for most entities). Cleared personnel records reference clearance levels (Baseline / NV1 / NV2 / PV) not individual identities.
- For pure-cloud systems and contractors with no physical facilities, much of the Physical domain inherits from cloud provider IRAP attestations and host-organisation facilities. Document the inheritance explicitly.
- Each requirement keeps its number indefinitely, but requirements can be added or amended in each annual release (see that release's Summary of Changes). Record the release assessed and re-check numbers when the release changes.
- For contractors handling Defence-related work, the PSPF assessment dovetails with DISP attestation — cite the DISP pack where it exists rather than re-evidencing.
- Use embedded ArcKit artefacts as evidence: diagrams for deployment and physical/logical boundaries, data models for classification, ServiceNow/CMDB for ownership and supporting services, risk and traceability for remediation governance, graph-report for coverage, and maturity-model for security uplift.
