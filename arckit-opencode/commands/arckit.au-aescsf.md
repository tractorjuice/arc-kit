---
description: "[COMMUNITY] Generate an Australian Energy Sector Cyber Security Framework maturity assessment for energy-sector projects with IT, OT, market, and grid-edge dependencies."
---

> WARNING: **Community-contributed command** - not part of the officially-maintained ArcKit baseline. Output must be reviewed by qualified energy-sector cyber security, OT security, regulatory, legal, and operational risk advisers before reliance. Verify the current AESCSF version, publication date, AEMO source availability, and applicable entity obligations before external use; if AEMO resources are unavailable, record the attempted access date and re-check before finalising.

You are an enterprise architect generating an **Australian Energy Sector Cyber Security Framework (AESCSF) maturity assessment** for an Australian energy-sector project, asset, market interface, OT environment, DER platform, or regulated energy business capability.

## User Input

```text
$ARGUMENTS
```

## Context

The Australian Energy Sector Cyber Security Framework is an energy-sector cyber maturity framework coordinated through AEMO and industry partners. Use it as an authoritative energy-sector anchor while avoiding verbatim reproduction of detailed AESCSF source text. This artefact complements `/arckit:au-e8-posture`, `/arckit:au-ism-controls`, `/arckit:au-ot-security`, and `/arckit:au-soci-cirmp` by translating baseline cyber, OT, and critical-infrastructure evidence into an energy-specific maturity view.

**Authoritative anchors**:

- AEMO Australian Energy Sector Cyber Security Framework (AESCSF) - <https://aemo.com.au/initiatives/major-programs/cyber-security/aescsf>
- AEMO cyber security program and energy-sector security resources - <https://aemo.com.au/initiatives/major-programs/cyber-security>
- AEMO industry systems and market interfaces - <https://aemo.com.au/energy-systems>
- CISC Security of Critical Infrastructure Act 2018 - <https://www.cisc.gov.au/legislation-regulation-and-compliance/soci-act-2018>
- ASD Essential Eight - <https://www.cyber.gov.au/resources-business-and-government/essential-cybersecurity/essential-eight>
- ASD Information Security Manual - <https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/ism>

## Process

1. Read prerequisites:
   - `projects/000-global/ARC-000-PRIN-*.md` if present.
   - The project's REQ artefact - extract energy obligations, cyber objectives, availability, safety, market, DER, customer, metering, and operational requirements.
   - The project's STKE artefact - identify responsible entity, energy business owner, system operator, market participant, control-room, OT, cyber, privacy, risk, and supplier stakeholders.
   - The project's E8 posture artefact (`ARC-{P}-AUE8-v*`) if available.
   - The project's ISM applicability artefact (`ARC-{P}-AUISM-v*`) if available.
   - The project's OT security artefact (`ARC-{P}-AUOT-v*`) if available.
   - The project's SOCI/CIRMP artefact (`ARC-{P}-AUSOCI-v*`) if available.
   - Existing DFD, diagram, data-model, traceability, and risk artefacts if available.
   - Existing ServiceNow / CMDB, asset inventory, interface register, vendor access register, evidence register, data catalogue, or control register artefacts if available.
   - `.arckit/templates/_partials/RENDERING.md`

2. Read the template:
   - First: `.arckit/templates-custom/au-aescsf-template.md` (user override)
   - Then: `.arckit/templates/au-aescsf-template.md`
   - Fallback: `.arckit/templates/au-aescsf-template.md`

3. Use `scripts/bash/create-project.sh --json <project-name>` if the project does not yet exist.

4. Use `scripts/bash/generate-document-id.sh <PROJECT_ID> AUAESCSF --filename` for the artefact filename.

5. Resolve the `<!-- DOC-CONTROL-HEADER -->` marker per `RENDERING.md`. Use the Australian classification scheme (UNOFFICIAL / OFFICIAL / OFFICIAL:Sensitive / PROTECTED / SECRET) -- replace the standard UK line in the header.

6. Generate the following sections:

   - **Energy Context and AESCSF Scope** - identify the energy sub-sector, asset or platform, market role, operational environment, criticality, and AESCSF applicability assumptions.

   - **Criticality and Target Maturity Profile** - document business criticality, safety and market impacts, target maturity rationale, and any legal or regulatory assumptions requiring qualified review.

   - **Domain Maturity Assessment** - assess maturity by AESCSF capability domain using current evidence, target state, gaps, owners, and uplift actions. Do not quote detailed AESCSF source text verbatim.

   - **OT/IT and Grid-Edge Findings** - require OT/IT zone and conduit diagrams, DERMS / DOE / CSIP-AUS flows where applicable, field telemetry, metering, control-room, and grid-edge dependency evidence.

   - **Architecture Evidence** - require OT/IT zone and conduit diagrams, IT/OT data flows, DERMS/DOE/CSIP-AUS flows, vendor remote-access paths, energy data-model dependencies, and cross-references to DFD, diagram, data-model, traceability, and risk evidence.

   - **IT/OT and Market Data Flows** - document IT/OT flows, AEMO or market interfaces, settlement or metering flows, telemetry, API exchanges, file transfers, and protocol gateways.

   - **Energy Data Model Dependencies** - identify dependencies across network assets, DER, meters, NMI / customer records, market settlements, telemetry, outage, switching, and operational data.

   - **Asset, Interface, and Evidence Inventory** - identify source-of-truth registers for OT assets, IT systems, DERMS / DOE platforms, market interfaces, APIs, telemetry links, metering assets, vendor remote-access paths, data catalogues, control evidence, owners, criticality, and inventory gaps. Where ServiceNow or another CMDB exists, cross-reference `/arckit:servicenow` output and ensure inventory rows can be visualised with colour-coded criticality, maturity, or risk status.

   - **Diagram and Traceability Handoffs** - list required `/arckit:dfd`, `/arckit:diagram`, `/arckit:data-model`, `/arckit:traceability`, and `/arckit:risk` updates.

   - **AESCSF Anti-Pattern Register** - call out flat OT networks, undocumented market interfaces, unmanaged vendor remote access, stale DER integration assumptions, missing data ownership, and unsupported control-room dependencies.

   - **Federal Baseline Cross-Reference** - map relevant findings to `/arckit:au-e8-posture`, `/arckit:au-ism-controls`, `/arckit:au-ot-security`, and `/arckit:au-soci-cirmp`.

   - **Maturity Gaps and Risk Treatment** - convert maturity gaps into risk treatments with owner, due date, evidence artefact, and residual risk.

   - **Uplift Roadmap** - prioritise immediate, 30-90 day, 90-180 day, and strategic uplift actions.

7. Populate the External References section per `.arckit/references/citation-instructions.md`. AEMO AESCSF, the verified AESCSF version / publication date, access date, and any AEMO availability issue MUST appear in the Document Register.

8. Write the artefact via the Write tool to `projects/<project-id>/<filename>`.

9. Show only a summary to the user: AESCSF scope, target maturity, highest-risk gaps, architecture evidence gaps, and top five uplift actions.

## Important Notes

- This command is community-contributed guidance, not legal, regulatory, or certification advice.
- AEMO AESCSF resources may be intermittently unavailable. Keep AEMO as the authoritative anchor, record access date and availability status, and require re-verification before external reliance.
- Energy projects often combine enterprise IT, OT, market, DER, metering, settlement, and customer data. Do not assess maturity without architecture evidence for those dependencies.
- Where the project includes critical infrastructure, cross-reference `/arckit:au-soci-cirmp`; where it includes connected OT, cross-reference `/arckit:au-ot-security`.
- Inventory-heavy findings should reuse existing ArcKit artefacts: `/arckit:data-model` for data catalogues, `/arckit:servicenow` for CMDB/service inventory, `/arckit:dfd` and `/arckit:diagram` for colour-coded visualisation, `/arckit:risk` for heat/scoring, `/arckit:maturity-model` for maturity criteria, and `/arckit:graph-report` for coverage gaps.

## Suggested Next Steps

After completing this command, consider running:

- `/arckit:au-e8-posture` -- Essential Eight posture provides the enterprise cyber baseline for AESCSF maturity evidence.
- `/arckit:au-ism-controls` -- ISM applicability provides control evidence and government security cross-references for AESCSF gaps.
- `/arckit:au-ot-security` -- OT security findings provide zone, conduit, connectivity, and remote-access evidence for energy OT environments.
- `/arckit:au-soci-cirmp` -- SOCI/CIRMP evidence supports critical-infrastructure risk treatment and incident escalation context.
- `/arckit:dfd` -- Data-flow diagrams provide IT/OT, market, DERMS, DOE, CSIP-AUS, and vendor-access evidence.
- `/arckit:diagram` -- Architecture diagrams provide OT/IT zone, conduit, ring, market, and grid-edge context.
- `/arckit:data-model` -- Energy data-model dependencies identify asset, metering, settlement, DER, telemetry, and customer data impacts.
- `/arckit:servicenow` -- CMDB and service inventory evidence maps architecture components, dependencies, owners, and support criticality.
- `/arckit:maturity-model` -- Maturity scoring can calibrate AESCSF capability levels and evidence thresholds.
- `/arckit:traceability` -- Traceability links AESCSF findings to requirements, obligations, controls, decisions, and evidence.
- `/arckit:risk` -- AESCSF maturity gaps and residual exposures should feed the project risk register.
- `/arckit:graph-report` -- Governance graph metrics show coverage, cross-reference density, and missing evidence links across registers.
