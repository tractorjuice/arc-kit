---
description: "[COMMUNITY] Generate a SOCI Act Critical Infrastructure Risk Management Program (CIRMP) governance and evidence pack for Australian critical infrastructure assets."
doc-type: AUSOCI
argument-hint: "<project ID or system, e.g. '001', 'Critical Data Platform'>"
effort: high
handoffs:
  - command: diagram
    description: Architecture diagrams identify critical components, boundaries, deployment zones, third parties, and operational dependencies that inform asset scope.
  - command: dfd
    description: DFDs identify data stores, cross-boundary flows, protected-information handling, and incident-reporting evidence paths.
  - command: data-model
    description: Data model evidence identifies protected information, personal information, critical operational data, retention rules, and data owners.
  - command: au-e8-posture
    description: Essential Eight posture supports cyber and information security hazard evidence.
  - command: au-ism-controls
    description: ISM applicability provides broader technical control evidence for SOCI cyber hazards.
  - command: au-ot-security
    description: OT security findings support CIRMP cyber hazard treatment where the critical asset includes connected OT.
  - command: au-pia
    description: Privacy impact findings support information security and protected-information handling.
  - command: au-ndb-playbook
    description: NDB incident response evidence supports notification and escalation pathways where personal information is involved.
  - command: servicenow
    description: ServiceNow/CMDB evidence supports critical component ownership, dependency, incident, change, and service-continuity controls.
  - command: risk
    description: CIRMP material risks and residual risks should feed the project risk register.
  - command: traceability
    description: CIRMP obligations and material risks should trace to requirements, evidence artefacts, owners, controls, and reporting actions.
  - command: maturity-model
    description: Use CIRMP findings to assess governance and operational maturity across cyber, personnel, supply chain, physical, and natural hazards.
  - command: graph-report
    description: Graph reporting should show AUSOCI coverage alongside AU compliance, architecture, risk, traceability, and operations artefacts.
allowed-tools:
  - Read(/${CLAUDE_PLUGIN_ROOT}/**)
  - Bash(bash ${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh *)
  - Bash(bash "${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh" *)
  - Bash(${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh *)
  - Bash(node ${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs *)
  - Bash(node "${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs" *)
---

> WARNING: **Community-contributed command** - not part of the officially-maintained ArcKit baseline. Output should be reviewed by qualified legal, regulatory, cyber security, and operational risk advisers before reliance. SOCI obligations vary by asset class and regulator - verify the current Act, Rules, regulator guidance, and entity-specific obligations before external use.

You are an enterprise architect generating a **Security of Critical Infrastructure Act 2018 (SOCI Act) / Critical Infrastructure Risk Management Program (CIRMP) governance and evidence pack** for an Australian critical infrastructure asset or potentially regulated entity.

## User Input

```text
$ARGUMENTS
```

## Context

SOCI is a cross-sector Australian critical-infrastructure regime, not an energy-only obligation. It applies across eleven sectors and may require responsible entities to register assets, report incidents, adopt and comply with a written risk management program, submit annual reports, and protect sensitive SOCI information. This command provides general SOCI/CIRMP support for the AU community overlay; sector recipes such as `au-energy` should consume this artefact and add sector-specific obligations separately.

The CIRMP Rules set two tiers. The baseline requirements (Part 2, ss 6–11) apply to every asset class listed in s 4(1) of the Rules. Since 10 June 2026 the enhanced requirements (ss 6A, 8A, 8B, 8C, 9A, 10A and 11A, added by the Security of Critical Infrastructure Legislation Amendment (Enhanced Critical Infrastructure Risk Management Program) Rules 2026) also apply to critical broadcasting, domain name system, electricity, energy market operator, freight infrastructure, freight services, gas, liquid fuel and water assets (s 4A(1)), whose CIRMP must comply with both tiers. For an asset that was a CI asset before 10 June 2026, CISC gives 10 June 2027 for the additional material risks (ss 6A, 8A(2) and 9A(2)) and 10 June 2028 for the other enhanced measures; an asset that becomes a CI asset later has 12 and 24 months from that date (s 4A(6)). The enhanced amendments do not apply to an asset declared under s 51 of the Act before 10 June 2026 while that declaration stays in force (s 12). Critical telecommunications assets follow the telecommunications security and risk management program (TSRMP) instead.

**Authoritative anchors**:

- Security of Critical Infrastructure Act 2018 (SOCI) - <https://www.cisc.gov.au/legislation-regulation-and-compliance/soci-act-2018>
- Security of Critical Infrastructure (Critical infrastructure risk management program) Rules (LIN 23/006) 2023, as amended (CIRMP Rules) - <https://www.legislation.gov.au/F2023L00112/latest/text>
- CISC Regulatory obligations - <https://www.cisc.gov.au/how-we-support-industry/regulatory-obligations>
- CISC enhanced CIRMP implementation factsheet - <https://www.cisc.gov.au/resources-subsite/Documents/enhanced-cirmp-implementation-factsheet.pdf>
- Responsible Entity Critical Infrastructure Risk Management Program annual report - <https://www.cisc.gov.au/resources/online-forms/responsible-entity-risk-management-program-annual-report>
- Security of Critical Infrastructure Act 2018 - <https://www.legislation.gov.au/C2018A00029/latest/text>
- Protected information under the SOCI Act - <https://www.cisc.gov.au/how-we-support-industry/regulatory-obligations/protected-information>
- ASD Information Security Manual - <https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/ism>
- ASD Essential Eight - <https://www.cyber.gov.au/resources-business-and-government/essential-cybersecurity/essential-eight>

## Process

1. Read prerequisites:
   - `projects/000-global/ARC-000-PRIN-*.md` if present.
   - The project's REQ artefact - extract service criticality, asset class, sector, data, cyber, personnel, supply-chain, physical, and continuity obligations.
   - The project's STKE artefact - identify responsible entity, accountable officer, board/council/governing body, regulator, operational owner, cyber owner, suppliers, and asset operators.
   - The project's DIAG artefacts (`ARC-{P}-DIAG-*`) - extract deployment zones, critical components, interfaces, third parties, trust boundaries, and support dependencies.
   - The project's DFD artefacts (`ARC-{P}-DFD-*`) - extract protected information flows, operational data flows, external entities, data stores, and reporting pathways.
   - The project's DATA artefact (`ARC-{P}-DATA-v*`) - extract protected information, personal information, critical operational data, entity owners, retention, and classification.
   - The project's E8 posture artefact (`ARC-{P}-AUE8-v*`) if available.
   - The project's ISM applicability artefact (`ARC-{P}-AUISM-v*`) if available.
   - The project's PIA artefact (`ARC-{P}-AUPIA-v*`) if available.
   - The project's NDB playbook (`ARC-{P}-AUNDB-v*`) if available.
   - The project's OT security artefact (`ARC-{P}-AUOT-v*`) if available and the asset includes OT.
   - The project's ServiceNow artefact (`ARC-{P}-SNOW-v*`) if available - extract CMDB CIs, service dependencies, support groups, SLAs, incident queues, and change controls.
   - The project's RISK artefact if available.
   - The project's TRAC artefact if available.
   - The project's maturity-model artefact if available.
   - `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md`

2. Read the template:
   - First: `.arckit/templates-custom/au-soci-cirmp-template.md` (user override)
   - Then: `.arckit/templates/au-soci-cirmp-template.md`
   - Fallback: `${CLAUDE_PLUGIN_ROOT}/templates/au-soci-cirmp-template.md`

3. Use `bash ${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh --json --name "<project-name>"` if the project does not yet exist.

4. Use `node ${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs <PROJECT_ID> AUSOCI {VERSION} --filename` for the artefact filename. Work out `{VERSION}` first with `${CLAUDE_PLUGIN_ROOT}/references/version-detection.md`: a re-run writes the next version beside the earlier file, never over it.

5. Resolve the `<!-- DOC-CONTROL-HEADER -->` marker per `RENDERING.md` before writing the artefact. `RENDERING.md` hard-routes the AU regime to `_partials/document-control-au.md`, which already carries the PSPF classification ladder — no per-command classification override is needed. Note that SOCI protected information is not the same as PSPF PROTECTED classification; document both where relevant.

6. Generate the following sections:

   - **Critical Asset and Responsible Entity Context** - identify the asset, sector, responsible entity, operator, direct interest holders, regulator, and whether the asset is declared or suspected in scope.

   - **SOCI Applicability Assessment** - assess sector, asset class, thresholds, responsible entity obligations, register obligations, incident reporting, government assistance implications, and any uncertainty requiring legal confirmation. Record the CIRMP tier: baseline (CIRMP Rules s 4(1)), enhanced (s 4A(1)), TSRMP for a critical telecommunications asset, or not subject. For an enhanced-tier asset, record when it became a CI asset and whether the s 12 exception for earlier declarations applies.

   - **ArcKit Architecture and Data Evidence Map** - cross-reference `/arckit:diagram`, `/arckit:dfd`, and `/arckit:data-model` artefacts to asset scope, protected-information handling, operational dependencies, and hazard evidence. Call out missing or stale evidence explicitly.

   - **CIRMP Governance Model** - document accountable owner, board/council/governing body oversight, annual report owner, risk committee, review cadence, and evidence repository.

   - **CIRMP Hazard Domain Assessment** - assess cyber and information security, personnel, supply chain, physical security, and natural hazards; for an enhanced-tier asset, also credential compromise (s 8B) and lateral movement (s 8C) hazards. Include material risk, relevant impact, current controls, evidence, gaps, and risk owner.

   - **Enhanced CIRMP Requirements** - for an enhanced-tier asset, assess each enhanced requirement against its compliance date: the additional material risks (s 6A: prejudice to social or economic stability, national security or defence; foreign ownership, control or influence; offshore or remote access to critical components and to business critical data); cyber material risks (s 8A(2): timely patching, legacy and unsupported components, deploying or hosting advanced, novel or emerging technology, and its use against the asset); the enhanced cyber framework (s 8A(3)–(4)); phishing-resistant MFA with central logging and review of MFA attempts (s 8B); critical-system inventory, recovery and network segregation (s 8C); personnel access management and critical-worker suitability (s 9A: an AusCheck background check, repeated at least every 5 years for ongoing access, or a Negative Vetting 1 or higher clearance revalidated before it lapses); supply-chain mapping, maximum acceptable outage and major-supplier assessment (s 10A); and central management of physical security and natural hazards (s 11A). For a baseline-tier asset, mark the section not applicable.

   - **Cyber and Information Security Evidence** - consolidate evidence from AUE8, AUISM, AUOT where applicable, AUPIA, AUNDB, monitoring, incident response, supplier access, and protected-information handling. Record the cyber framework the CIRMP complies with and its condition: baseline s 8(4) (AS ISO/IEC 27001:2015, Essential Eight Maturity Level One, NIST CSF, C2M2 Maturity Indicator Level 1 or 2020–21 AESCSF Security Profile 1, or an equivalent under s 8(5)); enhanced s 8A(3) (AS ISO/IEC 27001:2023, Essential Eight Maturity Level Two, NIST CSF 2.0, C2M2 v2.1 Maturity Indicator Level 2 or 2023 AESCSF Security Profile 2, or an equivalent to the Essential Eight, C2M2 or AESCSF option under s 8A(4)). Cite AUE8 where the Essential Eight is the chosen framework.

   - **Personnel, Supply Chain, Physical Security, and Natural Hazard Evidence** - capture responsible controls, suppliers, critical workers, physical critical components, facility controls, dependencies, and business continuity evidence.

   - **Incident Reporting and Notification Pathways** - document cyber incident escalation, responsible reporting roles, 12-hour / 72-hour pathways where applicable, regulator contact points, and record-keeping.

   - **Annual Report and Attestation Readiness** - assess whether the entity can produce the annual CIRMP report within required timeframes, with board/council/governing body approval. The 2025–26 report need not include information about the enhanced material risks or measures.

   - **Operations, CMDB, and Traceability Integration** - map critical components and support processes to `/arckit:servicenow` CMDB CIs; map obligations and material risks to `/arckit:risk`, `/arckit:traceability`, `/arckit:graph-report`, and `/arckit:maturity-model` outputs.

   - **Cross-Sector vs Sector-Specific Obligations** - record general SOCI obligations here and explicitly defer sector-specific requirements such as AESCSF, AER ring-fencing, NER/NGR, or AEMO obligations to sector recipes.

   - **Recommendations** - prioritised actions grouped by Immediate, 30-90 days, 90-180 days, and strategic uplift.

7. Populate the External References section per `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. The SOCI Act, current CIRMP Rules / regulator guidance, and verification date MUST appear in the Document Register.

8. Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **AUSOCI** per-type checks pass. Fix any failures before proceeding.
9. Write the artefact via the Write tool to `projects/<project-id>/<filename>`.

10. Show only a summary to the user: likely SOCI applicability position, CIRMP readiness, top material risks, and immediate evidence gaps.

## Important Notes

- This command provides general SOCI/CIRMP support. Do not include AESCSF, AER, NER/NGR, AEMO, or other sector-specialised obligations here except as references to sector overlays such as `arckit-au-energy`.
- SOCI protected information is legally sensitive and is different from PSPF PROTECTED classification. Flag protected-information handling requirements explicitly.
- Treat ArcKit diagrams, DFDs, data models, ServiceNow/CMDB records, risk registers, traceability matrices, graph-report coverage, and maturity assessments as first-class evidence. If an artefact is absent, record the gap and recommend the next ArcKit command.
- CIRMP obligations and rules are subject to amendments and vary by asset class: the enhanced tier applies only to the asset classes in s 4A(1) of the CIRMP Rules. Record the legislation and guidance version checked, including the CIRMP Rules compilation.
- The annual report is a governance obligation, not only a cyber artefact. Board/council/governing body approval readiness must be assessed.
- Where the asset includes OT, cross-reference `/arckit:au-ot-security`; where it does not, mark OT evidence as not applicable rather than forcing it into scope.
