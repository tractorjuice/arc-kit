---
name: arckit-fr-marche-public
description: "[COMMUNITY] Generate French public procurement documentation aligned with code de la commande publique, UGAP catalogue, and DINUM digital standards"
---

> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output should be reviewed by qualified DPO / RSSI / legal counsel before reliance. Citations to ANSSI / CNIL / EU regulations may lag the current text — verify against the source.

You are helping an enterprise architect generate **French public procurement documentation** (Dossier de Consultation des Entreprises) aligned with the Code de la Commande Publique, UGAP, and DINUM digital doctrine requirements.

## User Input

```text
$ARGUMENTS
```

## Instructions

> **Note**: Before generating, scan `projects/` for existing project directories. For each project, list all `ARC-*.md` artifacts, check `external/` for reference documents, and check `000-global/` for cross-project policies. If no external docs exist but they would improve output, ask the user.

### Step 0: Read existing artifacts from the project context

**MANDATORY** (warn if missing):

- **REQ** (Requirements) — Extract: functional requirements (FR-xxx) for procurement scope, non-functional requirements (NFR-xxx), integration requirements (INT-xxx), data sovereignty and security requirements
  - If missing: warn that procurement documentation requires defined requirements to produce a valid requirements statement

**RECOMMENDED** (read if available, note if missing):

- **RISK** (Risk Register) — Extract: vendor risks, technology risks, lock-in risks, sovereignty risks
- **SECNUM** (SecNumCloud Assessment) — Extract: cloud qualification requirements, recommended providers, data classification that drives sovereignty clauses
- **DINUM** (DINUM Standards Assessment) — Extract: mandatory DINUM standards (RGAA, RGS, RGI) to include as contract requirements

**OPTIONAL** (read if available, skip silently):

- **PRIN** (Architecture Principles, 000-global) — Extract: open source policy, cloud strategy, technology standards
- **DATA** (Data Model) — Extract: data categories (health data → HDS clause, personal data → GDPR/DPA clause)

### Step 0b: Read external documents and policies

- Read any **external documents** in `external/` — extract previous procurement files, UGAP framework references, legal notices, budget documents
- Read any **global policies** in `000-global/policies/` — extract procurement policy, open source policy, data classification policy
- If procurement-related external documents found, use them to pre-populate threshold analysis and budget constraints.

### Step 1: Identify or Create Project

Identify the target project from the hook context. If the project doesn't exist:

1. Use Glob to list `projects/*/` directories and find the highest `NNN-*` number
2. Calculate the next number (zero-padded to 3 digits)
3. Slugify the project name
4. Use the Write tool to create `projects/{NNN}-{slug}/README.md` and `projects/{NNN}-{slug}/vendors/README.md`
5. Set `PROJECT_ID` and `PROJECT_PATH`

### Step 2: Read Source Artifacts

Read all documents from Step 0. Extract key information for the procurement file:

- Total estimated value (from requirements or user input)
- Data categories (drives sovereignty and certification clauses)
- Security classification level (drives RGS requirements)
- Cloud involvement (drives cloud doctrine assessment)

### Step 3: Procurement Template Reading

**Read the template** (with user override support):

- **First**, check if `.arckit/templates/fr-marche-public-template.md` exists in the project root
- **If found**: Read the user's customized template
- **If not found**: Read `.arckit/templates/fr-marche-public-template.md`

### Step 4: Threshold Analysis

Before generating the document, determine the applicable procedure:

| Threshold | Procedure | BOAMP | JOUE | Min. Period |
|-----------|-----------|-------|------|-------------|
| < €40,000 | Below-threshold (no formal procedure required) | No | No | Informal |
| €40,000 – €215,000 (supplies/services) | MAPA (Marché à Procédure Adaptée) | Yes | No | 15 days |
| > €215,000 (supplies/services) | Open call for tenders (Appel d'Offres Ouvert) | Yes | Yes | 35 days |
| > €5.38M (works) | Open call for tenders | Yes | Yes | 35 days |

Show threshold determination to the user before generating the full document.

### Step 5: Generate Procurement Documentation

**CRITICAL**: Use the **Write tool** to create the procurement document.

1. **Detect version**: Check for existing `ARC-{PROJECT_ID}-MARPUB-v*.md` files:
   - No existing file → VERSION="1.0"
   - Existing file → minor increment for updates, major for procedure change

2. **Auto-populate Document Control**:
   - Document ID: `ARC-{PROJECT_ID}-MARPUB-v{VERSION}`
   - Status: DRAFT
   - Created Date: {current_date}
   - Review Cycle: On-Demand
   - Classification: OFFICIAL as default

3. **Section 1: Threshold Analysis and Recommended Procedure**
   - Estimated value (extract from user input or requirements)
   - Applicable threshold and recommended procedure from Step 4
   - BOAMP/JOUE publication requirement
   - Minimum consultation period
   - Cloud doctrine compliance (if cloud services involved — circular 6264/SG)

4. **Section 2: Requirements Statement**
   - Subject of the contract: concise description from user input
   - Functional requirements: extract relevant FR-xxx from REQ artifact
   - Technical requirements: extract relevant NFR-xxx (security, accessibility, interoperability)
   - Sovereignty and security requirements table:
     - Data hosting in France/EU (State Cloud Doctrine)
     - SecNumCloud qualification (if sensitive data — from SECNUM artifact)
     - HDS certification (if health data detected in DATA or REQ)
     - RGS v2.0 compliance
     - RGI v2.0 interoperability
     - RGAA 4.1 accessibility (for public digital services)
     - RGESN ecodesign (recommended)

5. **Section 3: Award Criteria**
   - Suggested weighting: Technical value (60%), Price (30%), Execution conditions (10%)
   - Sub-criteria breakdown with sovereignty/security sub-criterion (15% of technical value)
   - Technical scoring grid (0–3 scoring with descriptions)
   - Note: total must equal 100% — flag if user specifies different weights

6. **Section 4: Security and Sovereignty Clauses**
   - Security annex (mandatory): RGS v2.0, PSSIE, ANSSI IT hygiene guide (42 measures)
   - If OIV/OSE: LPM/NIS sector-specific orders
   - Data localisation clause: EU territory, no extraterritorial law access
   - Reversibility clause: DINUM reversibility requirements (plan, open formats, migration period, exit costs)
   - Open source clause: if applicable per State Cloud Doctrine Point 3
   - GDPR/DPA clause: mandatory if personal data processed — Article 28 requirements

7. **Section 5: UGAP Catalogue**
   - Guide user to check ugap.fr for current framework agreements
   - Provide category table with typical UGAP-accessible provider types:
     - Sovereign cloud IaaS (Outscale, OVHcloud, NumSpot)
     - Application development (major IT service firms)
     - Cybersecurity (PRIS-qualified providers)
     - Managed services

8. **Section 6: Indicative Timeline**
   - Mermaid Gantt chart from today's date:
     - Preparation phase: file drafting + legal validation (3-4 weeks)
     - Publication: BOAMP/JOUE (1 day)
     - Consultation period: per procedure type
     - Evaluation: 2-3 weeks
     - Award and contracting: 3-4 weeks

9. **Section 7: ANSSI-Qualified Security Provider Selection**
   If the procurement includes cybersecurity services (audit, incident response, SOC/detection), include selection criteria requiring ANSSI qualification:

   | ANSSI Qualification | Scope | When to Require |
   |--------------------|--------------------|----------------|
   | PASSI (Prestataires d'Audit de Sécurité des SI) | Penetration testing, technical audits | Any IS security audit or pentest |
   | PRIS (Prestataires de Réponse aux Incidents de Sécurité) | Incident response, forensics | IR retainer or OIV/OSE obligation |
   | PDIS (Prestataires de Détection des Incidents de Sécurité) | SOC, threat detection, SIEM management | Managed detection services |
   | PDCS (Prestataires de Cybersécurité pour les Collectivités) | Local authority-specific cybersecurity | Collectivités territoriales only |

   - For OIV/OSE systems: require PASSI qualification for any IS audit; PRIS for incident response services — both are mandatory under the sectoral arrêté or NIS2 obligations
   - Include qualification requirement in the technical specifications (CCTP), not just as selection criterion
   - Qualification lists are published on ssi.gouv.fr — advise buyers to verify currency at contract signature
   - ANSSI qualifications are not certifications: they require reassessment — confirm current validity in tender evaluation

10. **Section 8: Digital State Doctrine Compliance**
    - DINUM checklist: cloud-first, RGI, RGAA, RGESN, open source, GDPR/DPA
    - PSSIE and RGS target level
    - Cross-reference DINUM artifact conclusions if available

Before writing the file, read `.arckit/references/quality-checklist.md` and verify all **Common Checks** pass.

Write the document to:

```text
projects/{project_id}/ARC-{PROJECT_ID}-MARPUB-v{VERSION}.md
```

### Step 6: Summary Output

```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Procurement File Generated
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 Document: projects/{project_id}/ARC-{PROJECT_ID}-MARPUB-v{VERSION}.md
📋 Document ID: {document_id}
📅 Created: {date}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Procurement Parameters
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Estimated Value: {amount}
Applicable Threshold: {threshold}
Recommended Procedure: {procedure}
BOAMP Publication: {Yes / No}
JOUE Publication: {Yes / No}
Min. Consultation Period: {X days}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛡️ Mandatory Clauses Included
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Security annex (RGS v2.0, PSSIE)
✅ Data localisation clause (EU territory)
✅ Reversibility clause (DINUM standards)
{✅ GDPR/DPA clause (personal data detected)}
{✅ HDS certification clause (health data detected)}
{✅ SecNumCloud clause (sensitive data + cloud)}
{✅ Open source clause (if applicable)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 Requirements Linked
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{N} functional requirements extracted
{N} technical requirements (NFR-xxx) included

Next steps:
1. Review and complete UGAP catalogue references (ugap.fr)
2. Legal team validation of contract clauses
3. {If tenders received: Run $arckit-evaluate for scoring}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Important Notes

- **Threshold accuracy**: The estimated contract value must exclude VAT (hors taxes). Include all option periods in the estimate — the total lifetime value determines the applicable threshold.
- **UGAP catalogue**: UGAP framework references must be verified at ugap.fr before use in official procurement — agreements are updated regularly.
- **Legal validation**: This document generates a draft procurement file. It must be reviewed by the contracting authority's legal team and procurement officer before publication.
- **Cloud Act clause**: The data localisation clause explicitly addresses extraterritorial laws (Cloud Act, FISA). This is a DINUM requirement for any cloud procurement involving sensitive data.
- **Use Write Tool**: Procurement files are typically 3,000–6,000 words. Always use the Write tool.

## Key References

| Document | Publisher | URL |
|----------|-----------|-----|
| Code de la commande publique | Légifrance | https://www.legifrance.gouv.fr/codes/id/LEGITEXT000037701019/ |
| UGAP — Union des Groupements d'Achats Publics (framework catalogue) | UGAP | https://www.ugap.fr/ |
| BOAMP — Bulletin Officiel des Annonces des Marchés Publics | DILA | https://www.boamp.fr/ |
| TED / JOUE — EU procurement journal (above EU thresholds) | EU Publications Office | https://ted.europa.eu/ |
| ANSSI-qualified security providers (PASSI, PRIS, PDIS) | ANSSI | https://cyber.gouv.fr/qualification-des-prestataires-de-services |
| DINUM digital doctrine — standards for public IS procurement | DINUM | https://www.numerique.gouv.fr/services/cloud/doctrine/ |
| Procurement thresholds (updated annually) | DAJ / Légifrance | https://www.economie.gouv.fr/daj/marches-publics |

> **Note for reviewers**: French public procurement is governed by the Code de la commande publique (transposing EU Directives 2014/24 and 2014/25). UGAP is a French central purchasing body — pre-competed framework agreements that public buyers can call off without running a full tender. BOAMP is the mandatory French publication journal for procurement notices above €40,000 (JOUE/TED required above EU thresholds). PASSI, PRIS, and PDIS are ANSSI qualification schemes for security service providers — requiring PASSI-qualified auditors and PRIS-qualified incident responders is mandatory for OIV and recommended for all sensitive IS.

## Success Criteria

- ✅ Procurement document created at `projects/{project_id}/ARC-{PROJECT_ID}-MARPUB-v{VERSION}.md`
- ✅ Threshold analysis completed with recommended procedure
- ✅ BOAMP/JOUE publication requirements determined
- ✅ Requirements statement linked to REQ artifact (FR-xxx, NFR-xxx)
- ✅ Sovereignty and security requirements table populated
- ✅ Award criteria with weighting defined (total = 100%)
- ✅ Security and sovereignty clauses included (data localisation, reversibility, GDPR/DPA)
- ✅ HDS clause included if health data detected
- ✅ SecNumCloud clause included if sensitive data and cloud
- ✅ UGAP catalogue guidance provided
- ✅ Indicative timeline Gantt chart generated
- ✅ DINUM digital doctrine checklist completed

## Example Usage

```text
$arckit-fr-marche-public Generate procurement documentation for a digital identity platform for a French ministry, estimated value €2.5M, handling personal data, requires SecNumCloud, RGAA compliance mandatory

$arckit-fr-marche-public Procurement file for 001 — cybersecurity services contract, €800K, MAPA procedure, existing UGAP framework available

$arckit-fr-marche-public Create procurement file for a French regional health authority digital platform, health data in scope, HDS certification required, estimated €3.5M over 3 years
```

## Suggested Next Steps

After completing this command, consider running:

- `$arckit-evaluate` -- Score vendor responses against the award criteria defined in this document *(when Tenders received and ready for evaluation)*
- `$arckit-traceability` -- Link procurement requirements back to functional and non-functional requirements
