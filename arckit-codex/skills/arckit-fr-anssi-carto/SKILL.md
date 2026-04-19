---
name: arckit-fr-anssi-carto
description: "[COMMUNITY] Produce an ANSSI-methodology information system cartography across four reading levels — business, application, system, and network"
---

> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output should be reviewed by qualified DPO / RSSI / legal counsel before reliance. Citations to ANSSI / CNIL / EU regulations may lag the current text — verify against the source.

You are helping an enterprise architect produce an **ANSSI information system cartography** following the ANSSI guide "Cartographie du système d'information" (2021). SI cartography is a structured four-level representation of an information system that provides RSSI, architects, and auditors with a shared understanding of the system boundary, components, interdependencies, and attack surface.

SI cartography is a prerequisite for EBIOS Risk Manager (feeds the ecosystem map in Workshop 3), for homologation dossiers, for NIS2 Article 21 compliance assessments, and for OIV security plans.

## User Input

```text
$ARGUMENTS
```

## Instructions

> **Note**: Before generating, scan `projects/` for existing project directories. For each project, list all `ARC-*.md` artifacts, check `external/` for reference documents, and check `000-global/` for cross-project policies. If no external docs exist but they would improve output, ask the user.

### Step 0: Read existing artifacts from the project context

**MANDATORY** (warn if missing):

- **REQ** (Requirements) — Extract: system functional description, integration requirements (INT-xxx), deployment environment (cloud/on-premise/hybrid), user population, data flows to external parties
  - If missing: STOP — cartography requires a minimum understanding of the system. Run `/arckit.requirements` first.

**RECOMMENDED** (read if available, note if missing):

- **DATA** (Data Model) — Extract: data assets, data classification levels, data flows — essential for business and application levels
- **STKE** (Stakeholder Analysis) — Extract: external entities, partners, third-party providers — essential for ecosystem cartography
- **SECD** (Secure by Design) — Extract: existing network segmentation, security zones, access controls
- **ANSSI** (ANSSI Assessment) — Extract: any prior hygiene findings relating to network or infrastructure

**OPTIONAL** (read if available, skip silently):

- **EBIOS** (EBIOS RM Study) — Extract: ecosystem map from Workshop 3 if a prior EBIOS study exists — avoid duplication
- **PRIN** (Architecture Principles, 000-global) — Extract: data classification policy, infrastructure standards
- **SECNUM** (SecNumCloud Assessment) — Extract: cloud provider details for system and network levels

### Step 0b: Read external documents and policies

- Read any **external documents** in `external/` — extract network diagrams, infrastructure inventories, previous cartographies, penetration test reports (reveal attack surface findings)
- Read any **global policies** in `000-global/policies/` — extract data classification policy, network security policy

### Step 1: Identify or Create Project

Identify the target project from the hook context. If the project doesn't exist:

1. Use Glob to list `projects/*/` directories and find the highest `NNN-*` number
2. Calculate the next number (zero-padded to 3 digits)
3. Slugify the project name
4. Use the Write tool to create `projects/{NNN}-{slug}/README.md`
5. Set `PROJECT_ID` and `PROJECT_PATH`

### Step 2: Read Source Artifacts

Read all documents from Step 0. Extract:

- Business processes and essential data assets (Level 1 inputs)
- Application inventory and interdependencies (Level 2 inputs)
- Server, database, and infrastructure inventory (Level 3 inputs)
- Network segments, interconnections, and internet entry points (Level 4 inputs)
- External parties and trusted relationships across all levels

### Step 3: Cartography Template Reading

**Read the template** (with user override support):

- **First**, check if `.arckit/templates/fr-anssi-carto-template.md` exists in the project root
- **If found**: Read the user's customized template
- **If not found**: Read `.arckit/templates/fr-anssi-carto-template.md`

### Step 4: Four-Level Cartography

Work through the four ANSSI cartography levels in order. Each level progressively increases in technical detail. Use information from source artifacts where available; flag gaps where information is insufficient to complete a level.

#### Level 1 — Business View (Vue Métier)

**Objective**: Identify the business processes and essential information assets that the IS supports. This is the "what does it do and what does it protect?" level.

1. **Business processes**: List all business processes supported by the IS (P-xx IDs). For each, note criticality (critical/important/standard) and data sensitivity.
2. **Essential information assets (Valeurs Métier)**: From the data model and requirements, identify the assets whose protection justifies the IS's existence — core data, key services, critical processes. Assign VM-xx IDs (consistent with EBIOS if a study exists).
3. **External actors**: Identify all external organisations that interact with the IS — citizens, partners, regulators, service providers. Note the nature of the interaction and trust level.
4. **Business-level dependencies**: Which business processes depend on which external actors or partner systems?

#### Level 2 — Application View (Vue Applicative)

**Objective**: Map business processes to the applications and services that implement them, and document the data flows between applications.

1. **Application inventory**: For each application and service (APP-xx IDs), note its purpose, which business process(es) it supports, criticality, and hosting model (cloud/on-premise/SaaS).
2. **Application interdependencies**: Document all application-to-application flows — protocol, data type, data classification, authentication mechanism.
3. **External SaaS and third-party services**: List all external digital services used — email, analytics, identity providers, payment processors, storage. Note data shared with each.
4. **Sensitive application flows**: Flag any flows crossing trust boundaries or carrying sensitive/classified data.

#### Level 3 — System / Infrastructure View (Vue Système)

**Objective**: Map applications to the physical or virtual infrastructure components that host them.

1. **Server inventory**: For each server or virtual machine (SRV-xx IDs) — hostname/role, OS, applications hosted, environment (prod/staging/dev), location (data centre, cloud region), criticality.
2. **Database inventory**: For each database (DB-xx) — DBMS, data owner, classification level, encryption at rest status.
3. **Identity infrastructure**: Document Active Directory domains, identity providers (IdP), privileged access management (PAM) solutions, certificate authorities.
4. **Sensitive equipment**: Firewalls, load balancers, HSMs, network appliances — location and whether administration interfaces are exposed.
5. **Administration paths**: How are servers administered — bastion hosts, jump servers, direct access? From which networks?

#### Level 4 — Network View (Vue Réseau)

**Objective**: Map network segments and their interconnections, including external connections and internet exposure.

1. **Network segments**: For each segment (NET-xx) — name, VLAN/IP range, security zone (internet-facing/internal/restricted/admin), purpose, and which systems it hosts.
2. **External interconnections**: All connections to external networks — RIE, partner VPNs, cloud provider connections, MPLS circuits. For each: encryption, authentication, direction.
3. **Internet entry points**: All points where the internet can reach the IS — public IPs, domains, APIs, email gateways, VPN endpoints. For each: protection in place (WAF, DDoS, firewall rules).
4. **Administration channels**: How does the administration plane connect — bastion/jump host configuration, protocols, MFA, logging.
5. **Sensitive flows**: Map flows identified at Level 2 onto the network — does the application flow cross network zones? Is it encrypted? Does it transit an untrusted network?

#### Attack Surface Summary

After completing all four levels, synthesise the key attack surface findings:

1. **Internet-facing entry points**: Enumerate all internet-exposed services with their protection level
2. **Administration exposure**: Any admin interfaces reachable from non-restricted zones?
3. **Third-party interconnections**: Which external connections could be used as an entry vector?
4. **Unencrypted sensitive flows**: Any flows carrying sensitive data without encryption?
5. **Supply chain dependencies**: Critical SaaS or cloud services with single points of failure or data exposure?

### Step 5: Generate Cartography Document

**CRITICAL**: Use the **Write tool** to create the full cartography document.

1. **Detect version**: Check for existing `ARC-{PROJECT_ID}-CARTO-v*.md` files:
   - No existing file → VERSION="1.0"
   - Existing file → minor increment if refreshed, major if scope changed

2. **Auto-populate Document Control**:
   - Document ID: `ARC-{PROJECT_ID}-CARTO-v{VERSION}`
   - Status: DRAFT
   - Created Date: {current_date}
   - Next Review Date: {current_date + 12 months}
   - Classification: OFFICIAL-SENSITIVE minimum (cartography reveals attack surface — restrict distribution)

3. Write the complete cartography following the template populated with Step 4 findings.

Before writing the file, read `.arckit/references/quality-checklist.md` and verify all **Common Checks** plus **CARTO** per-type checks pass.

Write the document to:

```text
projects/{project_id}/ARC-{PROJECT_ID}-CARTO-v{VERSION}.md
```

### Step 6: Summary Output

```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ SI Cartography Generated
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 Document: projects/{project_id}/ARC-{PROJECT_ID}-CARTO-v{VERSION}.md
📋 Document ID: {document_id}
📅 Date: {date}
🔒 Classification: OFFICIAL-SENSITIVE

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Cartography Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Level 1 — Business:    {N} processes, {N} essential assets, {N} external actors
Level 2 — Application: {N} applications, {N} SaaS services, {N} interdependency flows
Level 3 — System:      {N} servers, {N} databases, {N} admin paths
Level 4 — Network:     {N} segments, {N} external interconnections, {N} internet entry points

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚨 Attack Surface Findings
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Internet-exposed entry points:        {N}
Admin interfaces exposed (risk):      {N}
Third-party interconnections:         {N}
Unencrypted sensitive flows:          {N}
High-priority recommendations:        {N}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Next steps:
1. Run $arckit-fr-ebios — cartography feeds Workshop 3 ecosystem map directly
2. Run $arckit-fr-anssi — use network and system findings to prioritise hygiene gaps
3. Run $arckit-diagram — generate visual diagrams from cartography data
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Important Notes

- **Cartography is security-sensitive**: A complete SI cartography reveals attack surface, administration paths, and asset locations. Always classify OFFICIAL-SENSITIVE minimum and restrict distribution to personnel with a need to know.
- **Four levels are complementary, not alternatives**: The value of ANSSI cartography is the ability to trace from a business asset (Level 1) through the application (Level 2) and infrastructure (Level 3) down to the network exposure (Level 4). Completing only one or two levels produces an incomplete picture.
- **EBIOS synergy**: If an EBIOS Risk Manager study is planned or exists, the cartography feeds directly into Workshop 3 (ecosystem map) and Workshop 4 (operational scenarios). The VM-xx IDs should be consistent between the two documents.
- **Living document**: The cartography must be updated when the IS architecture changes significantly. A stale cartography is worse than no cartography — it gives false confidence. Set a review trigger on major architectural change.
- **Visual diagrams**: This command produces a structured text cartography. Use `/arckit.diagram` to generate visual Mermaid or PlantUML diagrams from the cartography data for presentations and homologation dossiers.

## Key References

| Document | Publisher | URL |
|----------|-----------|-----|
| Guide de cartographie du système d'information | ANSSI | https://cyber.gouv.fr/publications/cartographie-du-systeme-dinformation |
| Guide d'hygiène informatique (42 measures) | ANSSI | https://cyber.gouv.fr/publications/guide-dhygiene-informatique |
| EBIOS Risk Manager guide (Workshop 3 ecosystem map) | ANSSI | https://cyber.gouv.fr/publications/la-methode-ebios-risk-manager |
| ANSSI publications catalogue | ANSSI | https://cyber.gouv.fr/publications |

## Success Criteria

- ✅ Cartography document created at `projects/{project_id}/ARC-{PROJECT_ID}-CARTO-v{VERSION}.md`
- ✅ Level 1 (business): processes, essential assets, and external actors documented
- ✅ Level 2 (application): application inventory, interdependencies, and SaaS services documented
- ✅ Level 3 (system): server and database inventory, identity infrastructure, admin paths documented
- ✅ Level 4 (network): network segments, external interconnections, and internet entry points documented
- ✅ Sensitive flows identified and mapped across all four levels
- ✅ Attack surface summary with internet-exposed entry points and admin exposure
- ✅ Security recommendations prioritised from attack surface findings
- ✅ Document classified OFFICIAL-SENSITIVE minimum

## Example Usage

```text
$arckit-fr-anssi-carto Produce SI cartography for a French ministry digital services platform — three production data centres, Azure cloud, 50k citizen users, integration with FranceConnect and DGFIP APIs

$arckit-fr-anssi-carto Cartography for 001 — regional hospital IS (SIH), OIV santé designation, connected to Mon Espace Santé, mix of on-premise VMware and SaaS clinical software

$arckit-fr-anssi-carto ANSSI cartography for a French energy operator (OIV énergie), separate IT and OT networks, SCADA interconnection, cloud-hosted analytics platform
```

## Suggested Next Steps

After completing this command, consider running:

- `$arckit-fr-ebios` -- Use the cartography ecosystem map and attack surface summary as Workshop 3 input *(when Cartography reveals interconnections and trust boundaries that need risk analysis)*
- `$arckit-fr-anssi` -- Use cartography findings to prioritise ANSSI hygiene measures assessment *(when Network view reveals exposed interfaces or unprotected sensitive flows)*
- `$arckit-diagram` -- Generate architecture diagrams from the cartography data *(when Visual diagram representation of cartography levels is needed)*
- `$arckit-secure` -- Address security findings from the cartography attack surface analysis *(when Cartography reveals unacceptable attack surface exposure)*
