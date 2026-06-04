---
description: "[COMMUNITY] Generate an ASD Information Security Manual (ISM) control applicability statement for Australian Government projects, scoped to the system's classification and supporting DISP attestation."
---

> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output should be reviewed by a qualified IRAP Assessor or CISO before reliance. ISM is updated quarterly — verify control identifiers against the current edition before any external use.

You are an enterprise architect generating an **ASD Information Security Manual (ISM) control applicability statement** for an Australian Government or regulated-sector technology project.

## User Input

```text
$ARGUMENTS
```

## Context

The Australian Signals Directorate (ASD) Information Security Manual (ISM) is the comprehensive set of cyber-security controls for Australian Government information systems. Where the Essential Eight is a mitigation framework targeting attack-vector defence, the ISM is the comprehensive control set covering governance, personnel, physical, communications, ICT system, networking, cryptography, gateway, data-transfer, evaluation, working-off-site, and incident-response domains. ISM compliance is the core technical-controls evidence for PSPF Information Security outcome and a primary input to DISP attestation.

**Authoritative anchor**: ASD Information Security Manual — <https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/ism>

**Key Australian Security References**:

- ASD Information Security Manual (current edition; updated quarterly)
- Protective Security Policy Framework (PSPF) — <https://www.protectivesecurity.gov.au/>
- ASD Essential Eight Maturity Model (mitigation subset of ISM)
- Defence Industry Security Program (DISP) requirements
- IRAP (Information Security Registered Assessors Program) — control assurance methodology
- Privacy Act 1988 (Cth) — APP 11 alignment

## Process

1. Read prerequisites:
   - `projects/000-global/ARC-000-PRIN-*.md` (architecture principles, if present)
   - The project's REQ artefact — extract NFR-SEC requirements, data classification, compliance obligations
   - The project's RISK artefact — extract existing security risks
   - The project's E8 posture artefact (`ARC-{P}-AUE8-v*`) if available — provides E8 sub-control evidence
   - The project's DATA artefact — for classification-driven control scoping
   - The project's DIAG artefacts (`ARC-{P}-DIAG-*`) — boundaries, gateways, deployment, zones, inherited controls
   - The project's DFD artefacts (`ARC-{P}-DFD-*`) — data transfers, integrations, gateways, cross-domain flows
   - The project's ServiceNow artefact (`ARC-{P}-SNOW-v*`) if available — CMDB CIs, support groups, incident/change workflows
   - The project's TRAC artefact if available — requirement-to-control evidence mapping
   - The project's maturity-model artefact if available — control maturity baseline
   - `.arckit/templates/_partials/RENDERING.md`

2. Read the template:
   - First: `.arckit/templates-custom/au-ism-controls-template.md` (user override)
   - Then: `.arckit/templates/au-ism-controls-template.md`
   - Fallback: `.arckit/templates/au-ism-controls-template.md`

3. Use `scripts/bash/create-project.sh --json <project-name>` if the project does not yet exist.

4. Use `scripts/bash/generate-document-id.sh <PROJECT_ID> AUISM --filename` for the artefact filename.

5. Resolve the `<!-- DOC-CONTROL-HEADER -->` marker per `RENDERING.md`. Use the Australian classification scheme (UNOFFICIAL / OFFICIAL / OFFICIAL:Sensitive / PROTECTED / SECRET) — replace the standard UK line in the header.

6. Generate the following sections:

   - **System Context** — system name, classification level (UNOFFICIAL / OFFICIAL / OFFICIAL:Sensitive / PROTECTED / SECRET), deployment model, IRAP assessment status, sovereignty position. Classification drives applicability — controls applicable at OFFICIAL:Sensitive are a subset of those at PROTECTED.

   - **Control Domain Applicability Matrix** — table covering all 17 ISM control areas (15 ASD ISM chapter domains plus 2 cross-cutting areas — Cloud/IaaS and Working-Off-Site), marking applicability per system classification:
     1. **Cyber Security Governance** — security risk management, security documentation, change management
     2. **Cyber Security Incidents** — detection, reporting, response, business continuity
     3. **Outsourced Services** — managed service providers, cloud, supply chain
     4. **Security Documentation** — system security plans, security risk management plans
     5. **Personnel Security** — clearance levels, awareness training, separation of duties
     6. **Physical Security** — facilities, equipment, ICT equipment lifecycle
     7. **Communications Infrastructure** — fibre, cabling, telephony
     8. **ICT Equipment Security** — hardware lifecycle, media, sanitisation
     9. **System Hardening** — operating systems, applications, authentication, network
     10. **System Management** — administration, monitoring, maintenance, vulnerability mgmt
     11. **System Monitoring** — event logging, audit, security metrics
     12. **Cryptography** — cryptographic fundamentals, ASD-approved algorithms, key management
     13. **Gateway Security** — gateway architecture, content filtering, DLP
     14. **Data Transfer** — between domains, between systems, data import/export
     15. **Cloud and IaaS Considerations** — IRAP assessment status, sovereign cloud, shared responsibility
     16. **Working-Off-Site Security** — remote work, mobile devices, BYOD
     17. **Evaluation Activities** — Common Criteria, FIPS, vendor product testing

   - **Per-Domain Control Applicability Assessment** — for each in-scope domain, document:
     - Applicability rationale (which controls apply at the system's classification level)
     - Current implementation status: ✅ Implemented / ⚠️ Partial / ❌ Not Implemented / N/A
     - Evidence supporting the status (cite E8 posture artefact, IRAP report, vendor attestations)
     - Gap description with specific ISM control IDs not yet met
     - Remediation actions with owner and target date
     - Compensating controls if applicable

   - **ISM-to-E8 Cross-Reference** — show which E8 strategies map to which ISM domains. Reinforces the E8-as-mitigation-subset framing for governance audiences.

   - **Compliance Summary** — table summarising domain-by-domain compliance posture; overall ISM applicability score (controls implemented / controls applicable).

   - **IRAP Assessment Position** — if the system holds or pursues IRAP assessment, note the IRAP scope, assessment date, residual risks accepted, and re-assessment cadence. For systems integrating with IRAP-assessed cloud services, note the inherited control posture.

   - **ArcKit Evidence Integration** — map `/arckit:diagram`, `/arckit:dfd`, `/arckit:data-model`, `/arckit:servicenow`, `/arckit:risk`, `/arckit:traceability`, `/arckit:graph-report`, and `/arckit:maturity-model` evidence to ISM domain applicability, CMDB ownership, control gaps, risk treatments, and assurance coverage.

   - **Recommendations** — prioritised remediation actions grouped by Quick Wins ( < 30 days), Short-Term (30–90 days), Medium-Term (90–180 days). Each recommendation references the specific ISM control ID(s).

7. Populate the External References section per `.arckit/references/citation-instructions.md`. The ASD ISM (with edition / publication date) MUST appear in the Document Register.

8. Write the artefact via the Write tool to `projects/<project-id>/<filename>`.

9. Show only a summary to the user (one paragraph plus the Compliance Summary table showing per-domain status).

## Important Notes

- ISM controls are tagged with applicability flags (ALL / OFFICIAL / OFFICIAL:Sensitive / PROTECTED / SECRET / TOP SECRET). The applicability statement must select controls appropriate to the *highest classification of information processed*, not the *lowest*.
- ISM is updated quarterly — control IDs and wording can change. The artefact should record the ISM edition / publication date used as a verification anchor.
- For systems integrating with IRAP-assessed cloud services, note explicit shared-responsibility — many ISM controls inherit from the cloud provider's IRAP attestation. Cite the IRAP scope statement, not the cloud provider's marketing.
- Cross-reference the E8 posture artefact wherever an ISM control maps to an E8 sub-control — avoids duplication and keeps the two artefacts consistent.
- For DISP members or systems supporting Defence work, scope the Personnel Security and Physical Security domains carefully — these are commonly under-assessed in cloud-only environments.
- The Cyber Security Incidents domain should reference the project's NDB playbook (`/arckit:au-ndb-playbook`) for personal-information breach scenarios.
- The Outsourced Services domain must include MSP-held admin role boundaries, contractual security-control flow-down, and supply-chain attestation review.
- Use embedded ArcKit artefacts as evidence: diagrams and DFDs for boundaries and data transfer, data models for classification, ServiceNow/CMDB for ownership and operations, risk and traceability for controls, graph-report for coverage, and maturity-model for uplift.

## Suggested Next Steps

After completing this command, consider running:

- `/arckit:diagram` -- Architecture diagrams identify system boundaries, gateways, zones, hosting, and inherited controls for ISM scoping.
- `/arckit:dfd` -- DFDs identify data-transfer, gateway, integration, and monitoring controls across trust boundaries.
- `/arckit:data-model` -- Data model evidence drives classification, retention, data-transfer, and information-handling control applicability.
- `/arckit:au-disp-attestation` -- ISM applicability is a primary input to the DISP Member self-attestation pack.
- `/arckit:au-pspf` -- ISM is the technical-controls instantiation of PSPF Information Security outcome — feeds the PSPF assessment.
- `/arckit:au-e8-posture` -- E8 is a mitigation subset of ISM. The ISM applicability statement extends beyond E8 to cover personnel security, physical security, and information governance controls.
- `/arckit:servicenow` -- ServiceNow/CMDB evidence supports ICT asset ownership, support groups, change controls, incident queues, and inherited service dependencies.
- `/arckit:risk` -- ISM control gaps surface as security risks for the project risk register.
- `/arckit:traceability` -- ISM controls should trace to requirements, evidence artefacts, risks, PSPF, and DISP claims.
- `/arckit:maturity-model` -- ISM domain findings can seed a security control maturity uplift model.
- `/arckit:graph-report` -- Graph reporting should show AUISM coverage across AU compliance, architecture, risk, and operations artefacts.
