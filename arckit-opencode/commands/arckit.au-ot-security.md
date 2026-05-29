---
description: "[COMMUNITY] Generate an ASD operational technology cyber security assessment for Australian Government and critical-infrastructure projects with connected OT environments."
---

> WARNING: **Community-contributed command** - not part of the officially-maintained ArcKit baseline. Output should be reviewed by a qualified OT cyber security specialist, CISO, safety owner, or IRAP Assessor before reliance. ASD and partner OT guidance is periodically updated - verify the guidance version and publication date before external use.

You are an enterprise architect generating an **ASD operational technology cyber security assessment** for an Australian Government, regulated-sector, or critical-infrastructure technology project with connected OT, ICS, SCADA, cyber-physical, building-management, industrial-control, or field-device environments.

## User Input

```text
$ARGUMENTS
```

## Context

ASD operational technology guidance is reusable beyond any one industry sector. It applies to government and critical-infrastructure environments where cyber compromise can affect safety, availability, physical processes, public services, environmental outcomes, or operational continuity. This command complements the Australian Essential Eight and ISM artefacts: E8 and ISM provide the security-control foundation, while this artefact applies OT-specific architecture, connectivity, and safety constraints.

**Authoritative anchors**:

- ASD / ACSC Operational Technology environments - <https://www.cyber.gov.au/business-government/secure-design/operational-technology-environments>
- Principles of operational technology cyber security - <https://www.cyber.gov.au/resources-business-and-government/maintaining-devices-and-systems/critical-infrastructure/principles-operational-technology-cybersecurity>
- Creating and maintaining a definitive view of your operational technology architecture - <https://www.cyber.gov.au/business-government/secure-design/operational-technology-environments/creating-and-maintaining-a-definitive-view-of-your-operational-technology-architecture>
- Secure connectivity principles for Operational Technology - <https://www.cyber.gov.au/business-government/secure-design/operational-technology-environments/secure-connectivity-principles-for-operational-technology>
- Principles for the secure integration of Artificial Intelligence in Operational Technology - <https://www.cyber.gov.au/business-government/secure-design/operational-technology-environments/principles-for-the-secure-integration-of-artificial-intelligence-in-operational-technology>
- ASD Information Security Manual - <https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/ism>
- ASD Essential Eight - <https://www.cyber.gov.au/resources-business-and-government/essential-cybersecurity/essential-eight>

## Process

1. Read prerequisites:
   - `projects/000-global/ARC-000-PRIN-*.md` if present.
   - The project's REQ artefact - extract OT, availability, safety, remote access, supplier access, resilience, and regulatory requirements.
   - The project's STKE artefact - identify operational owner, safety owner, control-system owner, CISO, managed-service providers, and suppliers.
   - The project's E8 posture artefact (`ARC-{P}-AUE8-v*`) if available.
   - The project's ISM applicability artefact (`ARC-{P}-AUISM-v*`) if available.
   - The project's RISK artefact if available.
   - `.arckit/templates/_partials/RENDERING.md`

2. Read the template:
   - First: `.arckit/templates-custom/au-ot-security-template.md` (user override)
   - Then: `.arckit/templates/au-ot-security-template.md`
   - Fallback: `.arckit/templates/au-ot-security-template.md`

3. Use `scripts/bash/create-project.sh --json <project-name>` if the project does not yet exist.

4. Use `scripts/bash/generate-document-id.sh <PROJECT_ID> AUOT --filename` for the artefact filename.

5. Resolve the `<!-- DOC-CONTROL-HEADER -->` marker per `RENDERING.md`. Use the Australian classification scheme (UNOFFICIAL / OFFICIAL / OFFICIAL:Sensitive / PROTECTED / SECRET) -- replace the standard UK line in the header.

6. Generate the following sections:

   - **OT Environment Context** - system name, operational function, safety impact, availability requirements, OT/IT boundary, third-party access, classification, and critical-infrastructure relevance.

   - **ASD OT Guidance Alignment** - assess the project against ASD OT principles, definitive OT architecture guidance, secure connectivity principles, and AI-in-OT principles if AI is in scope.

   - **Definitive OT Architecture View** - record whether the organisation has an authoritative view of OT assets, data flows, trust boundaries, dependencies, owners, and connectivity paths.

   - **IT/OT Segmentation and Trust Boundaries** - document zones, conduits, boundary controls, admin pathways, jump hosts, protocol gateways, DMZs, and monitoring points.

   - **Secure Connectivity and Remote Access** - assess business case, exposure, inbound connectivity, brokered access, just-in-time access, privileged access workstations, vendor access, obsolete device compensating controls, and logging.

   - **Supplier and Managed-Service Access** - document suppliers, managed-service providers, support paths, privileged access, contractual controls, and evidence review cadence.

   - **Monitoring, Logging, and Incident Response** - assess OT logging coverage, SOC integration, safety escalation paths, isolation options, recovery constraints, and post-incident evidence updates.

   - **Safety, Availability, and Recovery Constraints** - identify where cyber controls must be adapted for safety, uptime, legacy devices, maintenance windows, physical process constraints, and manual fallback.

   - **AI-in-OT Considerations** - if AI is present, assess governance, testing, safety controls, monitoring, human oversight, and failsafe mechanisms. If AI is not present, record that this section is not applicable and list trigger conditions for reassessment.

   - **ISM and E8 Cross-Reference** - show where OT findings reuse or qualify existing AUE8 and AUISM evidence.

   - **Recommendations** - prioritised actions grouped by Immediate, 30-90 days, 90-180 days, and strategic uplift. Each action must identify owner, evidence artefact, and residual risk.

7. Populate the External References section per `.arckit/references/citation-instructions.md`. ASD OT guidance documents and the verification date MUST appear in the Document Register.

8. Write the artefact via the Write tool to `projects/<project-id>/<filename>`.

9. Show only a summary to the user: overall OT posture, highest-risk connectivity gaps, and the top five recommended actions.

## Important Notes

- Essential Eight was not designed specifically for OT environments. Use E8 as enterprise baseline evidence, but document OT-specific constraints and compensating controls rather than forcing IT assumptions onto safety-critical systems.
- ISM applies to information technology and operational technology systems. Cross-reference AUISM for control evidence wherever possible.
- OT safety and availability may override normal enterprise IT patching and change windows. Record compensating controls and residual risk explicitly.
- Direct internet exposure, unmanaged vendor remote access, undocumented radio links, flat OT networks, and obsolete boundary devices are high-risk patterns that must be called out.
- SOCI/CIRMP applicability is handled by `/arckit:au-soci-cirmp`; this command supplies OT cyber evidence that may feed that artefact.

## Suggested Next Steps

After completing this command, consider running:

- `/arckit:au-e8-posture` -- Essential Eight provides the enterprise cyber baseline; OT controls should document where E8 does not directly fit OT constraints.
- `/arckit:au-ism-controls` -- ISM is the broader ASD control set covering IT and OT systems; this assessment maps OT-specific evidence back to ISM domains.
- `/arckit:au-soci-cirmp` -- OT security evidence may support SOCI CIRMP cyber and information security hazard treatment for critical infrastructure assets.
- `/arckit:risk` -- OT exposure, safety, availability, and remote-access gaps should feed the project risk register.
