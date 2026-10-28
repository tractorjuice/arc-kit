---
description: "[COMMUNITY] Generate an ASD Information Security Manual (ISM) control applicability statement for Australian Government projects, scoped to the system's classification and supporting DISP attestation."
doc-type: AUISM
argument-hint: "<project ID or system, e.g. '001', 'MyGov Portal'>"
effort: high
handoffs:
  - command: diagram
    description: Architecture diagrams identify system boundaries, gateways, zones, hosting, and inherited controls for ISM scoping.
  - command: dfd
    description: DFDs identify data-transfer, gateway, integration, and monitoring controls across trust boundaries.
  - command: data-model
    description: Data model evidence drives classification, retention, data-transfer, and information-handling control applicability.
  - command: au-disp-attestation
    description: ISM applicability is a primary input to the DISP Member self-attestation pack.
  - command: au-pspf
    description: ISM is the technical-controls instantiation of PSPF Information Security outcome — feeds the PSPF assessment.
  - command: au-e8-posture
    description: E8 is a mitigation subset of ISM. The ISM applicability statement extends beyond E8 to cover personnel security, physical security, and information governance controls.
  - command: servicenow
    description: ServiceNow/CMDB evidence supports ICT asset ownership, support groups, change controls, incident queues, and inherited service dependencies.
  - command: risk
    description: ISM control gaps surface as security risks for the project risk register.
  - command: traceability
    description: ISM controls should trace to requirements, evidence artefacts, risks, PSPF, and DISP claims.
  - command: maturity-model
    description: ISM guideline findings can seed a security control maturity uplift model.
  - command: graph-report
    description: Graph reporting should show AUISM coverage across AU compliance, architecture, risk, and operations artefacts.
allowed-tools:
  - Read(/${CLAUDE_PLUGIN_ROOT}/**)
  - Bash(bash ${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh *)
  - Bash(bash "${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh" *)
  - Bash(${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh *)
  - Bash(node ${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs *)
  - Bash(node "${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs" *)
---

> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output should be reviewed by a qualified IRAP Assessor or CISO before reliance. ISM is updated quarterly — verify control identifiers against the current edition before any external use.

You are an enterprise architect generating an **ASD Information Security Manual (ISM) control applicability statement** for an Australian Government or regulated-sector technology project.

## User Input

```text
$ARGUMENTS
```

## Context

The Australian Signals Directorate (ASD) Information Security Manual (ISM) is the comprehensive set of cyber-security controls for Australian Government information systems. Where the Essential Eight is a mitigation framework targeting attack-vector defence, the ISM is the comprehensive control set: cyber security principles plus 23 cyber security guidelines covering roles, incidents, procurement and outsourcing, documentation, physical and personnel security, communications, enterprise mobility, evaluated products, IT equipment, media, system hardening, access and management, security assurance, software development, databases, email, networking, cryptography, gateways and data transfers. ISM compliance is the core technical-controls evidence for the PSPF Technology domain (which requires the ISM to be applied) and a primary input to DISP attestation.

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
   - `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md`

2. Read the template:
   - First: `.arckit/templates-custom/au-ism-controls-template.md` (user override)
   - Then: `.arckit/templates/au-ism-controls-template.md`
   - Fallback: `${CLAUDE_PLUGIN_ROOT}/templates/au-ism-controls-template.md`

3. Use `bash ${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh --json --name "<project-name>"` if the project does not yet exist.

4. Use `node ${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs <PROJECT_ID> AUISM {VERSION} --filename` for the artefact filename. Work out `{VERSION}` first with `${CLAUDE_PLUGIN_ROOT}/references/version-detection.md`: a re-run writes the next version beside the earlier file, never over it.

5. Resolve the `<!-- DOC-CONTROL-HEADER -->` marker per `RENDERING.md` before writing the artefact. `RENDERING.md` hard-routes the AU regime to `_partials/document-control-au.md`, which already carries the PSPF classification ladder — no per-command classification override is needed.

6. Generate the following sections:

   - **System Context** — system name, classification level (UNOFFICIAL / OFFICIAL / OFFICIAL:Sensitive / PROTECTED / SECRET), deployment model, IRAP assessment status, sovereignty position. Classification drives applicability — controls applicable at OFFICIAL:Sensitive are a subset of those at PROTECTED.

   - **Guideline Applicability Matrix** — table covering all 23 cyber security guidelines in the current ISM (the September 2026 release has 23, alongside the cyber security principles), in ISM order, marking applicability per system classification:
     - **Cyber security roles** — board and executive committee, chief information security officer, system owners
     - **Cyber security incidents** — managing and responding to cyber security incidents, reporting to ASD
     - **Procurement and outsourcing** — cyber supply chain risk management, managed services and cloud services (IRAP assessment of outsourced cloud service providers, shared responsibility)
     - **Cyber security documentation** — cyber security strategy, system security plan, incident response plan, continuous monitoring plan
     - **Physical security** — facilities and systems, IT equipment and media
     - **Personnel security** — cyber security awareness training
     - **Communications infrastructure** — cabling infrastructure, emanation security
     - **Communications systems** — telephone systems, video conferencing and IP telephony, multifunction devices, fax
     - **Enterprise mobility** — mobile device management and usage, privately owned devices, remote access
     - **Evaluated products** — evaluated product procurement and usage
     - **Information technology equipment** — usage, maintenance, sanitisation, destruction, disposal
     - **Media** — usage, sanitisation, destruction, disposal
     - **System hardening** — operating system, user application, server application and virtualisation hardening
     - **System access** — identity and access management, multi-factor authentication, privileged access, credential management
     - **System management** — system administration, system maintenance (patching), data backup and restoration
     - **Security assurance** — security monitoring (event logging, monitoring, retention, threat hunting), security assessments
     - **Software development** — secure software development, AI, mobile and web application development
     - **Database systems** — database servers, databases
     - **Email** — email usage, email gateways and servers
     - **Networking** — network design and configuration, wired and wireless networks, service continuity
     - **Cryptography** — cryptographic fundamentals, ASD-approved algorithms and protocols
     - **Gateways** — gateways, cross domain solutions, firewalls, web proxies, content filtering
     - **Data transfers** — data import and export between systems and security domains

     The ISM has no separate system monitoring, cloud or working-off-site guideline: event logging sits in Guidelines for security assurance, cloud services in Guidelines for procurement and outsourcing, and remote and mobile working in Guidelines for enterprise mobility. If the ISM edition used has a different guideline list, follow that edition and record the difference.

   - **Per-Guideline Control Applicability Assessment** — for each in-scope guideline, document:
     - Applicability rationale (which controls apply at the system's classification level)
     - Current implementation status: ✅ Implemented / ⚠️ Partial / ❌ Not Implemented / N/A
     - Evidence supporting the status (cite E8 posture artefact, IRAP report, vendor attestations)
     - Gap description with specific ISM control IDs not yet met
     - Remediation actions with owner and target date
     - Compensating controls if applicable

   - **ISM-to-E8 Cross-Reference** — show which E8 strategies map to which ISM guidelines, naming the strategies as ASD does (ASD does not number them). Reinforces the E8-as-mitigation-subset framing for governance audiences.

   - **Compliance Summary** — table summarising guideline-by-guideline compliance posture; overall ISM applicability score (controls implemented / controls applicable).

   - **IRAP Assessment Position** — if the system holds or pursues IRAP assessment, note the IRAP scope, assessment date, residual risks accepted, and re-assessment cadence. For systems integrating with IRAP-assessed cloud services, note the inherited control posture.

   - **ArcKit Evidence Integration** — map `/arckit:diagram`, `/arckit:dfd`, `/arckit:data-model`, `/arckit:servicenow`, `/arckit:risk`, `/arckit:traceability`, `/arckit:graph-report`, and `/arckit:maturity-model` evidence to ISM guideline applicability, CMDB ownership, control gaps, risk treatments, and assurance coverage.

   - **Recommendations** — prioritised remediation actions grouped by Quick Wins ( < 30 days), Short-Term (30–90 days), Medium-Term (90–180 days). Each recommendation references the specific ISM control ID(s).

7. Populate the External References section per `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. The ASD ISM (with edition / publication date) MUST appear in the Document Register.

8. Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **AUISM** per-type checks pass. Fix any failures before proceeding.
9. Write the artefact via the Write tool to `projects/<project-id>/<filename>`.

10. Show only a summary to the user (one paragraph plus the Compliance Summary table showing per-guideline status).

## Important Notes

- ISM security controls carry applicability markings: NC (non-classified systems, government and non-government), OS (OFFICIAL: Sensitive), P (PROTECTED), S (SECRET) and TS (TOP SECRET). The applicability statement must select controls appropriate to the *highest classification of information processed*, not the *lowest*.
- ISM is updated quarterly — control IDs and wording can change. The artefact should record the ISM edition / publication date used as a verification anchor.
- For systems integrating with IRAP-assessed cloud services, note explicit shared-responsibility — many ISM controls inherit from the cloud provider's IRAP attestation. Cite the IRAP scope statement, not the cloud provider's marketing.
- Cross-reference the E8 posture artefact wherever an ISM control maps to an E8 sub-control — avoids duplication and keeps the two artefacts consistent.
- For DISP members or systems supporting Defence work, scope the Guidelines for personnel security and Guidelines for physical security carefully — these are commonly under-assessed in cloud-only environments.
- The Guidelines for cyber security incidents assessment should reference the project's NDB playbook (`/arckit-au:au-ndb-playbook`) for personal-information breach scenarios.
- The Guidelines for procurement and outsourcing assessment must include MSP-held admin role boundaries, contractual security-control flow-down, and supply-chain attestation review.
- Use embedded ArcKit artefacts as evidence: diagrams and DFDs for boundaries and data transfer, data models for classification, ServiceNow/CMDB for ownership and operations, risk and traceability for controls, graph-report for coverage, and maturity-model for uplift.
