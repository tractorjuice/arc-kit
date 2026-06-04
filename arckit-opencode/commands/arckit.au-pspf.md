---
description: "[COMMUNITY] Generate a Protective Security Policy Framework (PSPF) compliance assessment for Australian Government entities and contractors against the four security outcomes and 16 core requirements."
---

> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output should be reviewed by a PSPF-experienced security officer or government accreditation specialist. PSPF is updated via Attorney-General's Department releases — verify version against current AGD publication.

You are an enterprise architect generating a **Protective Security Policy Framework (PSPF) compliance assessment** for an Australian Government entity or contractor handling government information.

## User Input

```text
$ARGUMENTS
```

## Context

The Protective Security Policy Framework (PSPF) is the Australian Government's overarching security policy framework administered by the Attorney-General's Department. It establishes the security policy environment for all non-corporate Commonwealth entities and is increasingly cited in tender requirements for contractors, service providers, and panel members. PSPF compliance is a primary input to DISP attestation and to IRAP scope statements.

PSPF is structured around **four security outcomes** with **16 core requirements**:

- **Outcome 1: Security Governance** (4 core requirements)
- **Outcome 2: Information Security** (4 core requirements — ISM is the technical instantiation)
- **Outcome 3: Personnel Security** (4 core requirements)
- **Outcome 4: Physical Security** (4 core requirements)

**Authoritative anchor**: Protective Security Policy Framework — <https://www.protectivesecurity.gov.au/>

**Key references**:

- PSPF (current edition) — Attorney-General's Department
- ASD Information Security Manual (ISM) — instantiates Outcome 2
- ASD Essential Eight — minimum cyber baseline supporting Outcome 2
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
   - `.arckit/templates/_partials/RENDERING.md`

2. Read the template:
   - First: `.arckit/templates-custom/au-pspf-template.md`
   - Then: `.arckit/templates/au-pspf-template.md`
   - Fallback: `.arckit/templates/au-pspf-template.md`

3. Use `scripts/bash/create-project.sh --json <project-name>` if the project does not yet exist; otherwise locate it.

4. Use `scripts/bash/generate-document-id.sh <PROJECT_ID> AUPSPF --filename` for the artefact filename.

5. Resolve the `<!-- DOC-CONTROL-HEADER -->` marker per `RENDERING.md`. Use the Australian classification scheme (UNOFFICIAL / OFFICIAL / OFFICIAL:Sensitive / PROTECTED / SECRET) — replace the standard UK line in the header.

6. Generate the following sections:

   - **Entity Profile** — entity name, type (non-corporate Commonwealth / corporate Commonwealth / contractor / panel member / state-government with PSPF flow-down), PSPF applicability driver (direct / contractual flow-down), Chief Security Officer (CSO) designation, security maturity self-assessment level.

   - **Outcome 1: Security Governance** — assessment of the 4 core requirements:
     1. CR1: Role of accountable authority (security governance leadership)
     2. CR2: Management structures and responsibilities (CSO, security committee, executives)
     3. CR3: Security planning and risk management
     4. CR4: Security maturity monitoring (Annual Self-Assessment + reporting to AGD)

   - **Outcome 2: Information Security** — assessment of 4 core requirements (ISM is the primary instantiation here):
     1. CR5: Sensitive and classified information (information classification, marking, handling)
     2. CR6: Access to information (need-to-know, security clearances)
     3. CR7: Safeguarding information from cyber threats (E8 + ISM)
     4. CR8: Sensitive and classified discussions and communications

   - **Outcome 3: Personnel Security** — assessment of 4 core requirements:
     1. CR9: Eligibility and suitability (vetting + AGSVA clearance process)
     2. CR10: Ongoing assessment (continuous suitability)
     3. CR11: Separation of personnel (off-boarding clearance debrief)
     4. CR12: Insider threat

   - **Outcome 4: Physical Security** — assessment of 4 core requirements:
     1. CR13: Entity facilities (physical security zones)
     2. CR14: Working off-site (remote work + travel)
     3. CR15: Physical security risk
     4. CR16: Supporting services (cleaning, maintenance, contractor access)

     For each Core Requirement document:
     - Compliance status: ✅ Fully Compliant / ⚠️ Partially Compliant / ❌ Non-Compliant / N/A
     - Evidence supporting status (cite ARC-{P}-AUISM, AUE8, AUPIA, AUDISP where applicable)
     - Specific gap description
     - Remediation actions with owner and target date
     - PSPF Self-Assessment Level achieved (if relevant — Compliant / Substantially Compliant / Partly Compliant / Not Compliant)

   - **PSPF Annual Self-Assessment** — for non-corporate Commonwealth entities, document Annual Self-Assessment Report status, last submission to AGD, current self-assessed maturity level, gaps.

   - **Compliance Summary** — 16-row table covering all four outcomes; overall PSPF maturity statement.

   - **ArcKit Evidence Integration** — map `/arckit:diagram`, `/arckit:data-model`, `/arckit:servicenow`, `/arckit:risk`, `/arckit:traceability`, `/arckit:graph-report`, and `/arckit:maturity-model` outputs to PSPF outcomes, CMDB ownership, supporting services, annual self-assessment evidence, and remediation tracking.

   - **Recommendations** — prioritised remediations by Quick Wins / Short-Term / Medium-Term, each tagged to specific Core Requirement.

7. Populate the External References section per `.arckit/references/citation-instructions.md`. PSPF (with edition) MUST appear in the Document Register.

8. Write the artefact via the Write tool to `projects/<project-id>/<filename>`.

9. Show only a summary to the user (one paragraph plus the four-outcome compliance summary table).

## Important Notes

- PSPF directly applies to **non-corporate Commonwealth entities**. Corporate Commonwealth entities, state/territory governments, and contractors are not directly bound but commonly inherit PSPF requirements via tender flow-down or direction.
- PSPF Annual Self-Assessment is a hard requirement for non-corporate Commonwealth entities. Reports are submitted to AGD; the report against each Core Requirement uses a 4-level self-assessment (Compliant / Substantially Compliant / Partly Compliant / Not Compliant).
- **ISM is the technical instantiation of Outcome 2 Information Security.** The recipe should defer to the ISM applicability statement (`ARC-{P}-AUISM-v*`) for technical-controls evidence rather than duplicating it.
- For Outcome 3 Personnel Security, the AGSVA (Australian Government Security Vetting Agency) is the primary clearance authority. Cleared personnel records reference clearance levels (Baseline / NV1 / NV2 / PV) not individual identities.
- For pure-cloud systems and contractors with no physical facilities, Outcome 4 Physical Security largely inherits from cloud provider IRAP attestations + host-organisation facilities. Document the inheritance explicitly.
- For contractors handling Defence-related work, the PSPF assessment dovetails with DISP attestation — cite the DISP pack where it exists rather than re-evidencing.
- Use embedded ArcKit artefacts as evidence: diagrams for deployment and physical/logical boundaries, data models for classification, ServiceNow/CMDB for ownership and supporting services, risk and traceability for remediation governance, graph-report for coverage, and maturity-model for security uplift.

## Suggested Next Steps

After completing this command, consider running:

- `/arckit:diagram` -- Architecture and deployment diagrams support PSPF information, physical, facility, and working-off-site evidence.
- `/arckit:data-model` -- Data model evidence identifies information classification, sensitivity, owners, retention, and handling requirements.
- `/arckit:au-ism-controls` -- ISM is the technical-controls instantiation of PSPF Information Security outcome — primary input to PSPF Outcome 2.
- `/arckit:au-e8-posture` -- E8 supports PSPF Information Security outcome.
- `/arckit:au-pia` -- APP 11 + PSPF Personnel Security overlap; PIA cross-reference.
- `/arckit:au-disp-attestation` -- DISP attestation pack draws on PSPF compliance evidence.
- `/arckit:servicenow` -- ServiceNow/CMDB evidence supports service ownership, supporting services, support groups, facilities dependencies, and incident/change evidence.
- `/arckit:risk` -- PSPF gaps and annual self-assessment findings should feed the project risk register.
- `/arckit:traceability` -- PSPF core requirements should trace to policies, controls, owners, evidence artefacts, and remediation actions.
- `/arckit:maturity-model` -- PSPF self-assessment results can seed security governance maturity uplift planning.
- `/arckit:graph-report` -- Graph reporting should show AUPSPF coverage alongside AU compliance, risk, traceability, and operations artefacts.
