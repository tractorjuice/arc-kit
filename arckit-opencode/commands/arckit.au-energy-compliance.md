---
description: "[COMMUNITY] Generate an Australian energy-sector compliance architecture pack covering AER ring-fencing, AEMC NER/NGR, AEMO interfaces, and SOCI escalation evidence."
---

> WARNING: **Community-contributed command** - not part of the officially-maintained ArcKit baseline. Output must be reviewed by qualified legal, regulatory, energy compliance, privacy, cyber security, OT, and operational risk advisers before reliance. Verify the current AER, AEMC, AEMO, CISC, NER, NGR, SOCI, and entity-specific obligations before external use.

You are an enterprise architect generating an **Australian energy-sector compliance architecture pack** for a project, platform, service, or operating model with potential distribution, transmission, retail, metering, market, gas, DER, customer, or system-operator obligations.

## User Input

```text
$ARGUMENTS
```

## Context

Australian energy projects may need architecture evidence for **AER ring-fencing**, AEMC National Electricity Rules (NER), National Gas Rules (NGR), AEMO market and system-operator interfaces, CISC / SOCI obligations, privacy, and OT security. This command does not replace legal compliance analysis; it produces architecture evidence, boundary decisions, data-flow records, and traceability handoffs for qualified review.

**Authoritative anchors**:

- AER ring-fencing - <https://www.aer.gov.au/industry/registers/guidelines/ring-fencing-guideline-electricity-distribution>
- AER energy regulation and compliance - <https://www.aer.gov.au/>
- AEMC National Electricity Rules - <https://www.aemc.gov.au/regulation/energy-rules/national-electricity-rules>
- AEMC National Gas Rules - <https://www.aemc.gov.au/regulation/energy-rules/national-gas-rules>
- AEMO energy systems, markets, and participant interfaces - <https://aemo.com.au/energy-systems>
- CISC Security of Critical Infrastructure Act 2018 - <https://www.cisc.gov.au/legislation-regulation-and-compliance/soci-act-2018>
- OAIC Privacy Act and Australian Privacy Principles - <https://www.oaic.gov.au/privacy/australian-privacy-principles>

## Process

1. Read prerequisites:
   - `projects/000-global/ARC-000-PRIN-*.md` if present.
   - The project's REQ artefact - extract energy-sector obligations, regulated services, market roles, customer data, metering, DER, settlement, availability, and incident requirements.
   - The project's STKE artefact - identify regulated entity, affiliate, ring-fenced business unit, market participant, AEMO contact, regulator, cyber, privacy, OT, operations, and supplier stakeholders.
   - The project's SOCI/CIRMP artefact (`ARC-{P}-AUSOCI-v*`) if available.
   - The project's AESCSF artefact (`ARC-{P}-AUAESCSF-v*`) if available.
   - The project's OT security artefact (`ARC-{P}-AUOT-v*`) if available.
   - The project's PIA artefact (`ARC-{P}-AUPIA-v*`) if available.
   - Existing DFD, diagram, data-model, traceability, ADR, and risk artefacts if available.
   - Existing ServiceNow / CMDB, asset inventory, service catalogue, interface register, data catalogue, vendor access register, obligation register, or evidence register artefacts if available.
   - `.arckit/templates/_partials/RENDERING.md`

2. Read the template:
   - First: `.arckit/templates-custom/au-energy-compliance-template.md` (user override)
   - Then: `.arckit/templates/au-energy-compliance-template.md`
   - Fallback: `.arckit/templates/au-energy-compliance-template.md`

3. Use `scripts/bash/create-project.sh --json <project-name>` if the project does not yet exist.

4. Use `scripts/bash/generate-document-id.sh <PROJECT_ID> AUENERGY --filename` for the artefact filename.

5. Resolve the `<!-- DOC-CONTROL-HEADER -->` marker per `RENDERING.md`. Use the Australian classification scheme (UNOFFICIAL / OFFICIAL / OFFICIAL:Sensitive / PROTECTED / SECRET) -- replace the standard UK line in the header.

6. Generate the following sections:

   - **Energy-Sector Applicability** - identify energy sub-sector, regulated services, market participant roles, asset classes, customer or metering data, DER, gas, electricity, and system-operator touchpoints.

   - **AER Ring-Fencing Assessment** - assess regulated/unregulated boundary assumptions, shared services, staff access, data access, branding, affiliate interactions, waivers, and evidence requiring qualified legal review.

   - **NER / NGR and AEMO Obligation Mapping** - map architecture-relevant NER, NGR, AEMO procedure, market interface, registration, dispatch, metering, settlement, and operational obligations at a high level for specialist confirmation.

   - **Energy-Specific SOCI Interpretation** - cross-reference `/arckit:au-soci-cirmp` for critical-infrastructure applicability, protected information, reporting, CIRMP hazards, and SOCI incident escalation.

   - **Market and System-Operator Interface Register** - identify AEMO portals, APIs, B2B / B2M, file transfers, telemetry, dispatch, outage, settlement, and operational interfaces.

   - **DER, Metering, Settlement, and Customer Data Implications** - assess DERMS, DOE, CSIP-AUS, meter data, NMI, billing, customer, settlement, and affiliate data handling.

   - **Regulated Asset, Interface, and Data Inventory** - identify source-of-truth registers for regulated services, unregulated services, critical assets, CMDB CIs, AEMO interfaces, APIs, market files, telemetry links, vendor access paths, customer data, metering data, settlements, owners, criticality, and inventory gaps. Cross-reference `/arckit:servicenow`, `/arckit:data-model`, `/arckit:dfd`, `/arckit:diagram`, `/arckit:risk`, and `/arckit:traceability` where available.

   - **Architecture Evidence** - require ring-fencing boundary diagrams, regulated/unregulated data-flow maps, AEMO interface maps, SOCI incident escalation, and the energy data model.

   - **Regulated / Unregulated Data Flows** - document permitted and prohibited flows, controls, approvals, logging, retention, affiliate access, and evidence owners.

   - **Energy Data Model Dependencies** - record regulated services, assets, customers, NMIs, meters, DER, settlements, outages, market transactions, telemetry, and operational data dependencies.

   - **Diagram and Traceability Handoffs** - list required `/arckit:dfd`, `/arckit:diagram`, `/arckit:data-model`, and `/arckit:traceability` updates.

   - **Architecture Decision Seeds** - propose ADRs for ring-fencing boundaries, shared services, market interface design, DER integration, customer data sharing, and SOCI escalation choices.

   - **Evidence Gaps and Recommendations** - prioritise compliance architecture gaps by owner, artefact, decision, review requirement, and due date.

7. Populate the External References section per `.arckit/references/citation-instructions.md`. Current AER, AEMC NER/NGR, AEMO, CISC / SOCI, and access dates MUST appear in the Document Register.

8. Write the artefact via the Write tool to `projects/<project-id>/<filename>`.

9. Show only a summary to the user: applicability position, key ring-fencing boundaries, AEMO interface risks, SOCI escalation gaps, and top evidence recommendations.

## Important Notes

- This command is community-contributed architecture guidance, not legal, regulatory, or compliance certification advice.
- AER ring-fencing, NER, NGR, AEMO procedures, SOCI obligations, and participant-specific obligations change over time. Record versions, dates checked, and unresolved assumptions.
- If AEMO site resources are temporarily unavailable, record the access date and use the latest verified local or public copy available to the organisation.
- Do not collapse regulated and unregulated data flows into a generic system diagram. Produce explicit boundary, interface, data-model, traceability, and ADR handoffs.
- Use `/arckit:au-aescsf` for energy cyber maturity and `/arckit:au-ot-security` for OT-specific evidence where applicable.
- Inventory-heavy findings should reuse existing ArcKit artefacts: `/arckit:data-model` for data catalogues, `/arckit:servicenow` for CMDB/service inventory, `/arckit:dfd` and `/arckit:diagram` for colour-coded visualisation, `/arckit:risk` for heat/scoring, and `/arckit:graph-report` for register coverage gaps.

## Suggested Next Steps

After completing this command, consider running:

- `/arckit:au-soci-cirmp` -- SOCI/CIRMP evidence provides critical-infrastructure obligations and incident escalation context.
- `/arckit:au-aescsf` -- AESCSF maturity findings provide energy-sector cyber posture evidence.
- `/arckit:au-ot-security` -- OT security evidence supports control-system, grid-edge, and operational technology compliance context.
- `/arckit:au-pia` -- Privacy impact evidence supports customer, metering, billing, and energy data handling.
- `/arckit:dfd` -- Data-flow diagrams provide regulated/unregulated, market, AEMO, metering, DER, and customer flow evidence.
- `/arckit:diagram` -- Architecture diagrams provide ring-fencing boundaries, interface maps, and operational context.
- `/arckit:data-model` -- The energy data model identifies regulated, unregulated, customer, metering, settlement, and operational data dependencies.
- `/arckit:servicenow` -- CMDB and service inventory evidence maps regulated services, CIs, dependencies, owners, support tiers, and operational criticality.
- `/arckit:traceability` -- Traceability links obligations to requirements, controls, decisions, evidence, and residual gaps.
- `/arckit:adr` -- Architecture decisions should be raised for ring-fencing boundaries, AEMO interfaces, DER integration, and data-sharing choices.
- `/arckit:graph-report` -- Governance graph metrics show register coverage, cross-reference density, and missing compliance evidence links.
