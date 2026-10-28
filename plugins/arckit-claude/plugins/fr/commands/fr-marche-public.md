---
description: "[COMMUNITY] Generate French public procurement documentation aligned with code de la commande publique, UGAP catalogue, and DINUM digital standards"
doc-type: MARPUB
argument-hint: "<project ID or procurement description, e.g. '001', 'digital identity platform €2.5M ministry'>"
effort: high
handoffs:
  - command: evaluate
    description: Score vendor responses against the award criteria defined in this document
    condition: "Tenders received and ready for evaluation"
  - command: traceability
    description: Link procurement requirements back to functional and non-functional requirements
allowed-tools:
  - Read(/${CLAUDE_PLUGIN_ROOT}/**)
---


> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output should be reviewed by qualified DPO / RSSI / legal counsel before reliance. Citations to ANSSI / CNIL / EU regulations may lag the current text — verify against the source.

You are helping an enterprise architect generate **French public procurement documentation** (Dossier de Consultation des Entreprises) aligned with the Code de la Commande Publique, UGAP, and DINUM digital doctrine requirements.

## User Input

```text
$ARGUMENTS
```

## Instructions

> **Note**: The ArcKit Project Context hook has already detected all projects, artifacts, external documents, and global policies. Use that context below — no need to scan directories manually.

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

- **First**, check if `.arckit/templates-custom/fr-marche-public-template.md` exists in the project root, then `.arckit/templates/fr-marche-public-template.md`
- **If found**: Read the user's customized template
- **If not found**: Read `${CLAUDE_PLUGIN_ROOT}/templates/fr-marche-public-template.md`
- **Then read** `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md` and resolve the `<!-- DOC-CONTROL-HEADER -->` marker in the template before writing. `MARPUB` carries the France regime, which hard-routes to `_partials/document-control-fr.md` whatever the operator's user config says.

### Step 4: Threshold Analysis

Before generating the document, determine the applicable procedure:

| Estimated value (excl. VAT) | Procedure | BOAMP | JOUE | Min. Period |
|-----------|-----------|-------|------|-------------|
| < €60,000 (supplies/services) or < €100,000 (works) | No publicity or competition required (R2122-8) | No | No | None set |
| From €60,000 to < €90,000 (supplies/services) | MAPA (Marché à Procédure Adaptée) | Free choice of publicity | No | Set by the buyer (no fixed minimum) |
| From €90,000 (supplies/services) or €100,000 (works) to below the formal-procedure threshold | MAPA | BOAMP or a legal-notices journal (JAL) | If needed to reach interested bidders | Set by the buyer (no fixed minimum) |
| ≥ €140,000 (supplies/services, central government authorities) | Formal procedure, e.g. open call for tenders (Appel d'Offres Ouvert) | Yes | Yes | Open call: 35 days (30 if tenders can be sent electronically) |
| ≥ €216,000 (supplies/services, other contracting authorities) | Formal procedure, e.g. open call for tenders | Yes | Yes | Open call: 35 days (30 if tenders can be sent electronically) |
| ≥ €5,404,000 (works, all contracting authorities) | Formal procedure, e.g. open call for tenders | Yes | Yes | Open call: 35 days (30 if tenders can be sent electronically) |

**Central government authorities** (autorités publiques centrales) are the State (except the armed forces' health-service establishments), State public bodies other than EPIC (except public health establishments), independent administrative authorities with legal personality, the Caisse des dépôts, the Légion d'honneur, UGAP and two foundations. Local authorities and other contracting authorities use €216,000. Contracting entities (entités adjudicatrices, utilities) use €432,000 for supplies and services.

> **Note**: The formal-procedure thresholds are the 2026–2027 EU thresholds (Commission Delegated Regulation (EU) 2025/2152, applicable from 1 January 2026), set out in the French avis of 13 January 2026 that forms annex 2 of the Code de la commande publique. EU thresholds are revised every two years, next on 1 January 2028. The national €60,000 / €100,000 thresholds come from décret n° 2025-1386 (works from 1 January 2026, supplies and services from 1 April 2026). Publicity: CCP R2131-12 (MAPA) and R2131-16 (formal procedures); time limits: R2161-2 and R2161-3.

Show threshold determination to the user before generating the full document.

### Step 5: Generate Procurement Documentation

**CRITICAL**: Use the **Write tool** to create the procurement document.

1. **Detect version**: Check for existing `ARC-{PROJECT_ID}-MARPUB-v*.md` files:
   - No existing file → VERSION="1.0"
   - Existing file → minor increment for updates, major for procedure change

2. **Auto-populate Document Control**:
   - Document ID: `ARC-{PROJECT_ID}-MARPUB-v{VERSION}` Work out `{VERSION}` first with `${CLAUDE_PLUGIN_ROOT}/references/version-detection.md`: a re-run writes the next version beside the earlier file, never over it.
   - Status: DRAFT
   - Created Date: {current_date}
   - Review Cycle: On-Demand
   - Classification: Non protégé as default

3. **Section 1: Threshold Analysis and Recommended Procedure**
   - Estimated value (extract from user input or requirements)
   - Applicable threshold and recommended procedure from Step 4
   - BOAMP/JOUE publication requirement
   - Minimum consultation period
   - Cloud doctrine compliance (if cloud services involved — circular 6282/SG)

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
   - Suggested weighting: Technical value (50%), Environmental characteristics (10%), Price (30%), Execution conditions (10%)
   - Sub-criteria breakdown with sovereignty/security sub-criterion (15% of the total)
   - **Environmental award criterion (mandatory)**: at least one award criterion must take account of the environmental characteristics of the offer (CCP L2152-7, as amended by loi n° 2021-1104 Climat et Résilience, art. 35). A single price-only criterion is no longer allowed: if a single criterion is used, it must be cost on a global approach, such as life-cycle cost, that takes the environmental characteristics into account (R2152-7). This applies to every procurement whose consultation is launched, or whose contract notice is sent for publication, from August 2026: R2152-7 from 21 August 2026 (décret n° 2022-767, art. 11), the amended L2152-7 from 22 August 2026 (Légifrance). Flag it as non-compliant if the user's weighting has no environmental criterion
   - Technical scoring grid (0–3 scoring with descriptions), including the environmental criterion
   - **Execution conditions**: include at least one environmental execution condition (CCP L2112-2). For contracts at or above the formal-procedure thresholds, include a social or employment execution condition, or record why one of the L2112-2-1 exceptions applies
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
   If the procurement includes cybersecurity services (audit, incident response, SOC/detection, security consulting, or outsourced administration and maintenance of the system), include selection criteria requiring ANSSI qualification:

   | ANSSI Qualification | Scope | When to Require |
   |--------------------|--------------------|----------------|
   | PASSI (Prestataires d'Audit de Sécurité des SI) | Penetration testing, technical audits | Any IS security audit or pentest |
   | PRIS (Prestataires de Réponse aux Incidents de Sécurité) | Incident response, forensics | IR retainer; recommended for OIV/OSE systems |
   | PDIS (Prestataires de Détection des Incidents de Sécurité) | SOC, threat detection, SIEM management | Managed detection services; required to operate the qualified detection probes on an OIV's SIIV, unless a State service runs them |
   | PACS (Prestataires d'Accompagnement et de Conseil en Sécurité des SI) | Security consulting: homologation support, IS risk management, secure architecture, cyber-crisis preparation | Consulting for homologation, risk analysis, security architecture or crisis preparation |
   | PAMS (Prestataires d'Administration et de Maintenance Sécurisées) | Secure administration and maintenance of the IS, including remote administration by an outsourced provider | Managed services (infogérance) or outsourced administration and maintenance of the system in scope |

   - **What the law requires for OIV/OSE systems** (do not call a qualification mandatory beyond this):
     - **OIV information systems (SIIV)**: the sectoral arrêtés taken under Code de la défense L1332-6-1 (one per sector, e.g. the arrêté du 10 juin 2016 for « Produits de santé ») require qualified detection probes operated by a State service or a qualified provider, so PDIS qualification is compulsory for that service. The homologation audit may be carried out by the operator itself or by a qualified provider, following the PASSI référentiel. Incident handling may be done by the operator or a provider it mandates, following the PRIS référentiel. Controls the Prime Minister orders under L1332-6-3 are carried out by ANSSI, State services or providers the Prime Minister qualifies.
     - **OSE**: the arrêté du 14 septembre 2018 (under décret n° 2018-384, which applies the 2016 NIS directive) asks the operator or its mandated provider to rely on the PASSI, PDIS and PRIS référentiels for audits, detection and incident handling. It does not require a qualified provider.
     - **NIS2 is not a basis today**: France has not yet transposed it (the loi Résilience has not been promulgated).
     - Requiring PASSI for audits and PRIS for incident response on OIV/OSE systems is still recommended. Record it as the buyer's choice, not a legal obligation.
   - Include qualification requirement in the technical specifications (CCTP), not just as selection criterion
   - Qualification lists are published by ANSSI on cyber.gouv.fr — advise buyers to verify currency at contract signature
   - ANSSI qualifications are not certifications: they require reassessment — confirm current validity in tender evaluation

10. **Section 8: Digital State Doctrine Compliance**
    - DINUM checklist: cloud-first, RGI, RGAA, RGESN, open source, GDPR/DPA
    - PSSIE and RGS target level
    - Cross-reference DINUM artifact conclusions if available

Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus **MARPUB** per-type checks pass.

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

✅ Environmental award criterion and execution condition (CCP L2152-7, L2112-2)
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
3. {If tenders received: Run /arckit:evaluate for scoring}
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
| ANSSI-qualified security providers (PACS, PASSI, PRIS, PDIS, PAMS) | ANSSI | https://cyber.gouv.fr/offre-de-service/solutions-certifiees-et-qualifiees/comprendre-levaluation-de-securite/qualification-de-produit-et-services/referentiels-qualification/ |
| DINUM digital doctrine — standards for public IS procurement | DINUM | https://www.numerique.gouv.fr/services/cloud/doctrine/ |
| Procurement thresholds (EU thresholds revised every two years) | DAJ / Légifrance | https://www.economie.gouv.fr/daj/marches-publics |
| Avis relatif aux seuils de procédure (13 January 2026, CCP annex 2) | Légifrance | https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000053346567 |
| CCP L2152-7 — environmental award criterion (loi n° 2021-1104, art. 35) | Légifrance | https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000043975064 |

> **Note for reviewers**: French public procurement is governed by the Code de la commande publique (transposing EU Directives 2014/24 and 2014/25). UGAP is a French central purchasing body — pre-competed framework agreements that public buyers can call off without running a full tender. BOAMP is the French procurement notices bulletin: from €90,000 a MAPA notice goes in the BOAMP or a legal-notices journal (JAL), and at or above the EU thresholds the State, its public bodies other than EPIC and local authorities publish in both the BOAMP and the JOUE/TED. Since August 2026, at least one award criterion must take account of the environmental characteristics of the offer (CCP L2152-7). PACS, PASSI, PRIS and PDIS are ANSSI qualification schemes for security service providers — requiring PASSI-qualified auditors and PRIS-qualified incident responders is mandatory for OIV and recommended for all sensitive IS.

## Success Criteria

- ✅ Procurement document created at `projects/{project_id}/ARC-{PROJECT_ID}-MARPUB-v{VERSION}.md`
- ✅ Threshold analysis completed with recommended procedure
- ✅ BOAMP/JOUE publication requirements determined
- ✅ Requirements statement linked to REQ artifact (FR-xxx, NFR-xxx)
- ✅ Sovereignty and security requirements table populated
- ✅ Award criteria with weighting defined (total = 100%)
- ✅ At least one environmental award criterion and an environmental execution condition included (CCP L2152-7, L2112-2)
- ✅ Security and sovereignty clauses included (data localisation, reversibility, GDPR/DPA)
- ✅ HDS clause included if health data detected
- ✅ SecNumCloud clause included if sensitive data and cloud
- ✅ UGAP catalogue guidance provided
- ✅ Indicative timeline Gantt chart generated
- ✅ DINUM digital doctrine checklist completed

## Example Usage

```text
/arckit-fr:fr-marche-public Generate procurement documentation for a digital identity platform for a French ministry, estimated value €2.5M, handling personal data, requires SecNumCloud, RGAA compliance mandatory

/arckit-fr:fr-marche-public Procurement file for 001 — cybersecurity services contract, €800K, MAPA procedure, existing UGAP framework available

/arckit-fr:fr-marche-public Create procurement file for a French regional health authority digital platform, health data in scope, HDS certification required, estimated €3.5M over 3 years
```
