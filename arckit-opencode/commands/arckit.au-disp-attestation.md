---
description: "[COMMUNITY] Generate a DISP (Defence Industry Security Program) Member self-attestation pack covering E8 ML2, ISM applicability, governance, personnel security, and incident reporting — supports DISP Levels 1, 2, 3."
---

> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output should be reviewed by a qualified DISP-experienced security officer or DISP advisor before submission to Defence. DISP requirements may be updated — verify against the current DISP Membership Pack before any external use.

You are an enterprise architect generating a **DISP (Defence Industry Security Program) Member self-attestation pack** for an Australian organisation supplying products or services to Defence.

## User Input

```text
$ARGUMENTS
```

## Context

The Defence Industry Security Program (DISP) is the security accreditation framework for Australian organisations supplying Defence. DISP Membership has three levels (Levels 1, 2, 3 — formerly Entry, Level 1, Level 2 in earlier guidance) with progressively-deeper governance, personnel, ICT, physical, and supply-chain security obligations. Essential Eight ML2 has been the minimum cyber baseline for DISP members since 2025; ISM applicability scales with the level. The attestation pack is the supplier's self-evidence document referenced during DISP application, audit, and renewal.

**Authoritative anchor**: Defence Industry Security Program — <https://www.defence.gov.au/business-industry/programs/defence-industry-security-program>

**Key references**:

- DISP Membership Pack (current edition) — application form + evidence requirements
- ASD Essential Eight Maturity Model (ML2 minimum for DISP) — <https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight/essential-eight-maturity-model>
- ASD Information Security Manual — <https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/ism>
- Protective Security Policy Framework (PSPF)
- Defence Security Principles Framework (DSPF) — referenced sections only
- Privacy Act 1988 (Cth) — APP 11 alignment

## Process

1. Read prerequisites:
   - The project's E8 posture artefact (`ARC-{P}-AUE8-v*`) — primary input
   - The project's ISM applicability statement (`ARC-{P}-AUISM-v*`) — primary input
   - The project's PIA (`ARC-{P}-AUPIA-v*`) — APP 11 cross-reference
   - The project's PSPF assessment (`ARC-{P}-AUPSPF-v*`) — physical / personnel / information security evidence
   - The project's RISK artefact — for SecRisk register integration
   - The project's ServiceNow artefact (`ARC-{P}-SNOW-v*`) if available — CMDB CIs, service owners, support groups, incident queues, and change controls
   - The project's TRAC artefact if available — claim-to-evidence mapping
   - The project's maturity-model artefact if available — security capability uplift baseline
   - `.arckit/templates/_partials/RENDERING.md`

2. Read the template:
   - First: `.arckit/templates-custom/au-disp-attestation-template.md` (user override)
   - Then: `.arckit/templates/au-disp-attestation-template.md`
   - Fallback: `.arckit/templates/au-disp-attestation-template.md`

3. Use `scripts/bash/create-project.sh --json <project-name>` if needed.

4. Use `scripts/bash/generate-document-id.sh <PROJECT_ID> AUDISP --filename` for the artefact filename.

5. Resolve the `<!-- DOC-CONTROL-HEADER -->` marker per `RENDERING.md`. Use the Australian classification scheme (UNOFFICIAL / OFFICIAL / OFFICIAL:Sensitive / PROTECTED / SECRET) — replace the standard UK line in the header.

6. Generate the following sections:

   - **Organisation Profile** — entity name, ABN, primary business activity, Defence contracts in scope, headcount, sites, foreign ownership / control / influence (FOCI) declaration.

   - **DISP Level Sought** — Level 1 / Level 2 / Level 3, regulatory driver (specific contract requirement, panel mandate, anticipated tender pipeline), justification of level chosen.

   - **Security Officer Designation** — Chief Security Officer (CSO) name + role + authority, deputy / backup CSO, contact details, vetting status. **DISP requires a named, suitably-cleared CSO with authority across the four security domains.**

   - **Four Security Domains Coverage** — DISP requires evidence across four domains:
     1. **Governance** — security policy, risk management, audit, incident management, change control
     2. **Personnel Security** — security clearances appropriate to work, security awareness training, separation of duties, off-boarding
     3. **Physical Security** — facility security, ICT equipment security, equipment lifecycle (cloud-only systems may inherit much of this from cloud provider's IRAP)
     4. **Information & Cyber Security** — Essential Eight ML2 minimum, ISM applicability, cryptography, gateway, monitoring, BCP

     For each domain, document:
     - Current implementation state (cite E8 posture, ISM applicability, supporting policies)
     - Evidence references (artefact IDs + document register)
     - Gap description
     - Remediation plan with target dates
     - Sign-off statement by accountable officer

   - **Essential Eight ML2 Evidence Per Strategy** — for each of the 8 E8 strategies, summarise the current ML position and evidence supporting ML2 attestation. Cite the AUE8 artefact directly.

   - **ISM Applicability Highlights** — beyond E8, summarise which ISM domains apply, current implementation summary, and identify any ISM gaps that materially affect DISP attestation. Cite the AUISM artefact.

   - **Foreign Ownership, Control or Influence (FOCI) Declaration** — disclose any foreign ownership > 5%, foreign-board-member arrangements, foreign-supply-chain dependencies, foreign-personnel access. DISP Level 2 + 3 require FOCI mitigation plans where applicable.

   - **Supply Chain Security** — disclose Tier 1 suppliers (MSPs, SaaS, cloud), supply-chain attestations held (SOC 2 / ISO 27001 / IRAP), supply-chain risk management process.

   - **Incident Response & Reporting** — incident response plan summary, 24-hour rapid notification capability for Defence-relevant incidents, OAIC NDB scheme integration, evidence of last incident response exercise. Cite NDB playbook (`ARC-{P}-AUNDB-v*`) if available.

   - **Security Awareness Training** — DISP-mandated security awareness training programme, completion rate, refresher cadence, security-clearance-holder additional briefings (pre/post-leave for cleared personnel).

   - **Annual Self-Audit Plan** — DISP requires annual self-audit; describe scope, methodology, evidence retention.

   - **ArcKit Evidence Integration** — map `/arckit:servicenow` CMDB evidence, `/arckit:risk` residual risks, `/arckit:traceability` claim-to-evidence links, `/arckit:graph-report` coverage, and `/arckit:maturity-model` uplift domains to DISP attestation claims.

   - **Attestation Statement** — formal CSO + Director sign-off statement attesting to the accuracy of the pack, with signature blocks, date, and re-attestation cadence.

7. Populate the External References section per `.arckit/references/citation-instructions.md`. The DISP Membership Pack (with edition) MUST appear in the Document Register.

8. Write the artefact via the Write tool to `projects/<project-id>/<filename>`.

9. Show only a summary to the user (one paragraph plus the Four Security Domains coverage table).

## Important Notes

- The pack is a **self-attestation**, not a third-party assurance. Defence reserves the right to audit. Artefact tone should be evidence-based and conservative — do not claim controls not yet implemented.
- The CSO designation is a hard requirement. If no CSO is named in the source artefacts, the pack must explicitly flag this as an outstanding action — it cannot be filled in by the recipe.
- For Level 2 + 3 members supplying classified Defence work, security clearances of personnel handling that work must be evidenced. Records of clearance levels held may be sensitive — reference by clearance level (Baseline / NV1 / NV2 / PV) not by individual name.
- Cloud-only systems that inherit Physical Security from an IRAP-assessed cloud provider should explicitly cite the cloud provider's IRAP scope statement, not generic marketing.
- The pack should integrate with the project's risk register — material residual risks should appear both in the risk register and in the DISP pack's gap descriptions.
- For DISP renewal cycles, the artefact should produce a redline-friendly format so year-on-year changes are easy to track.
- Use embedded ArcKit artefacts as evidence: ServiceNow/CMDB for operational ownership, risk for residual gaps, traceability for claim provenance, graph-report for coverage, and maturity-model for annual uplift planning.

## Suggested Next Steps

After completing this command, consider running:

- `/arckit:au-e8-posture` -- E8 ML2 evidence per strategy is a primary input to the DISP attestation pack.
- `/arckit:au-ism-controls` -- ISM applicability statement is a primary input — controls beyond E8 mandated by DISP level.
- `/arckit:au-pia` -- Privacy Act + APP 11 alignment cited in attestation pack.
- `/arckit:au-ndb-playbook` -- Notifiable Data Breach response is the operational complement to DISP incident reporting.
- `/arckit:servicenow` -- ServiceNow/CMDB evidence supports service ownership, support groups, incident queues, change controls, and supplier access.
- `/arckit:risk` -- DISP residual risks must remain aligned with the project risk register.
- `/arckit:traceability` -- DISP claims should trace to source AU artefacts, controls, policies, owners, and evidence records.
- `/arckit:maturity-model` -- DISP gaps can seed a security governance, personnel, physical, and cyber maturity uplift model.
- `/arckit:graph-report` -- Graph reporting should show AUDISP coverage across AU compliance, risk, traceability, and operations artefacts.
