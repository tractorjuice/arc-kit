---
description: "[COMMUNITY] Generate a SOCI Act Critical Infrastructure Risk Management Program (CIRMP) governance and evidence pack for Australian critical infrastructure assets."
---

> WARNING: **Community-contributed command** - not part of the officially-maintained ArcKit baseline. Output should be reviewed by qualified legal, regulatory, cyber security, and operational risk advisers before reliance. SOCI obligations vary by asset class and regulator - verify the current Act, Rules, regulator guidance, and entity-specific obligations before external use.

You are an enterprise architect generating a **Security of Critical Infrastructure Act 2018 (SOCI Act) / Critical Infrastructure Risk Management Program (CIRMP) governance and evidence pack** for an Australian critical infrastructure asset or potentially regulated entity.

## User Input

```text
$ARGUMENTS
```

## Context

SOCI is a cross-sector Australian critical-infrastructure regime, not an energy-only obligation. It applies across eleven sectors and may require responsible entities to register assets, report incidents, adopt and comply with a written risk management program, submit annual reports, and protect sensitive SOCI information. This command provides general SOCI/CIRMP support for the AU community overlay; sector recipes such as `au-energy` should consume this artefact and add sector-specific obligations separately.

**Authoritative anchors**:

- Security of Critical Infrastructure Act 2018 (SOCI) - <https://www.cisc.gov.au/legislation-regulation-and-compliance/soci-act-2018>
- CISC Regulatory obligations - <https://www.cisc.gov.au/how-we-support-industry/regulatory-obligations>
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
   - The project's E8 posture artefact (`ARC-{P}-AUE8-v*`) if available.
   - The project's ISM applicability artefact (`ARC-{P}-AUISM-v*`) if available.
   - The project's PIA artefact (`ARC-{P}-AUPIA-v*`) if available.
   - The project's NDB playbook (`ARC-{P}-AUNDB-v*`) if available.
   - The project's OT security artefact (`ARC-{P}-AUOT-v*`) if available and the asset includes OT.
   - The project's RISK artefact if available.
   - `.arckit/templates/_partials/RENDERING.md`

2. Read the template:
   - First: `.arckit/templates-custom/au-soci-cirmp-template.md` (user override)
   - Then: `.arckit/templates/au-soci-cirmp-template.md`
   - Fallback: `.arckit/templates/au-soci-cirmp-template.md`

3. Use `scripts/bash/create-project.sh --json <project-name>` if the project does not yet exist.

4. Use `scripts/bash/generate-document-id.sh <PROJECT_ID> AUSOCI --filename` for the artefact filename.

5. Resolve the `<!-- DOC-CONTROL-HEADER -->` marker per `RENDERING.md`. Use the Australian classification scheme (UNOFFICIAL / OFFICIAL / OFFICIAL:Sensitive / PROTECTED / SECRET) -- replace the standard UK line in the header. Note that SOCI protected information is not the same as PSPF PROTECTED classification; document both where relevant.

6. Generate the following sections:

   - **Critical Asset and Responsible Entity Context** - identify the asset, sector, responsible entity, operator, direct interest holders, regulator, and whether the asset is declared or suspected in scope.

   - **SOCI Applicability Assessment** - assess sector, asset class, thresholds, responsible entity obligations, register obligations, incident reporting, government assistance implications, and any uncertainty requiring legal confirmation.

   - **CIRMP Governance Model** - document accountable owner, board/council/governing body oversight, annual report owner, risk committee, review cadence, and evidence repository.

   - **CIRMP Hazard Domain Assessment** - assess cyber and information security, personnel, supply chain, physical security, and natural hazards. Include material risk, relevant impact, current controls, evidence, gaps, and risk owner.

   - **Cyber and Information Security Evidence** - consolidate evidence from AUE8, AUISM, AUOT where applicable, AUPIA, AUNDB, monitoring, incident response, supplier access, and protected-information handling.

   - **Personnel, Supply Chain, Physical Security, and Natural Hazard Evidence** - capture responsible controls, suppliers, critical workers, physical critical components, facility controls, dependencies, and business continuity evidence.

   - **Incident Reporting and Notification Pathways** - document cyber incident escalation, responsible reporting roles, 12-hour / 72-hour pathways where applicable, regulator contact points, and record-keeping.

   - **Annual Report and Attestation Readiness** - assess whether the entity can produce the annual CIRMP report within required timeframes, with board/council/governing body approval.

   - **Cross-Sector vs Sector-Specific Obligations** - record general SOCI obligations here and explicitly defer sector-specific requirements such as AESCSF, AER ring-fencing, NER/NGR, or AEMO obligations to sector recipes.

   - **Recommendations** - prioritised actions grouped by Immediate, 30-90 days, 90-180 days, and strategic uplift.

7. Populate the External References section per `.arckit/references/citation-instructions.md`. The SOCI Act, current CIRMP Rules / regulator guidance, and verification date MUST appear in the Document Register.

8. Write the artefact via the Write tool to `projects/<project-id>/<filename>`.

9. Show only a summary to the user: likely SOCI applicability position, CIRMP readiness, top material risks, and immediate evidence gaps.

## Important Notes

- This command provides general SOCI/CIRMP support. Do not include energy-specific AESCSF, AER, NER/NGR, or AEMO obligations here except as future sector overlay references.
- SOCI protected information is legally sensitive and is different from PSPF PROTECTED classification. Flag protected-information handling requirements explicitly.
- CIRMP obligations and rules are subject to amendments and may vary by asset class. Record the legislation and guidance version checked.
- The annual report is a governance obligation, not only a cyber artefact. Board/council/governing body approval readiness must be assessed.
- Where the asset includes OT, cross-reference `/arckit:au-ot-security`; where it does not, mark OT evidence as not applicable rather than forcing it into scope.

## Suggested Next Steps

After completing this command, consider running:

- `/arckit:au-e8-posture` -- Essential Eight posture supports cyber and information security hazard evidence.
- `/arckit:au-ism-controls` -- ISM applicability provides broader technical control evidence for SOCI cyber hazards.
- `/arckit:au-ot-security` -- OT security findings support CIRMP cyber hazard treatment where the critical asset includes connected OT.
- `/arckit:au-pia` -- Privacy impact findings support information security and protected-information handling.
- `/arckit:au-ndb-playbook` -- NDB incident response evidence supports notification and escalation pathways where personal information is involved.
- `/arckit:risk` -- CIRMP material risks and residual risks should feed the project risk register.
