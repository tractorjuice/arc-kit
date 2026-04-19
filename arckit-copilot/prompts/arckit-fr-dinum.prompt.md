---
description: '[COMMUNITY] Assess compliance with French digital administration standards — RGI, RGAA, RGESN, RGS, and DINUM doctrine cloud de l''État'
agent: 'agent'
tools: ['readFile', 'editFiles', 'runCommand', 'codebase', 'search']
---

> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output should be reviewed by qualified DPO / RSSI / legal counsel before reliance. Citations to ANSSI / CNIL / EU regulations may lag the current text — verify against the source.

You are helping an enterprise architect generate a **DINUM Standards Compliance Assessment** for a French public sector digital service. DINUM (Direction Interministérielle du Numérique) publishes and enforces French State digital standards — the French equivalents of the UK GDS Service Standard and Technology Code of Practice.

## User Input

```text
${input:topic:Enter project name or topic}
```

## Instructions

> **Note**: Before generating, scan `projects/` for existing project directories. For each project, list all `ARC-*.md` artifacts, check `external/` for reference documents, and check `000-global/` for cross-project policies. If no external docs exist but they would improve output, ask the user.

### Step 0: Read existing artifacts from the project context

**MANDATORY** (warn if missing):

- **REQ** (Requirements) — Extract: functional requirements for the digital service, accessibility requirements (NFR-xxx), interoperability requirements (INT-xxx), security requirements (NFR-SEC-xxx), any DINUM-specific compliance references
  - If missing: warn that DINUM assessment requires defined requirements to scope applicable referentiels

**RECOMMENDED** (read if available, note if missing):

- **PRIN** (Architecture Principles, 000-global) — Extract: open standards principles, accessibility commitments, cloud-first policy, security baseline
- **STKE** (Stakeholder Analysis) — Extract: entity type (ministry / agency / collectivité), size (number of agents), whether service is citizen-facing
- **SECD** (Secure by Design) — Extract: existing security controls, RGS alignment already assessed

**OPTIONAL** (read if available, skip silently):

- **RISK** (Risk Register) — Extract: compliance risks, accessibility risks
- **SECNUM** (SecNumCloud Assessment) — Extract: cloud doctrine compliance already assessed

### Step 0b: Read external documents and policies

- Read any **external documents** in `external/` — extract existing accessibility audits (audits RGAA), previous DINUM assessments, homologation dossiers, CNIL/ANSSI correspondence
- Read any **global policies** in `000-global/policies/` — extract organizational accessibility policy, open source policy, cloud strategy
- If no existing DINUM compliance documentation found, note: "No existing DINUM compliance documentation found — assessment will be generated from scratch."

### Step 1: Identify or Create Project

Identify the target project from the hook context. If the project doesn't exist:

1. Use Glob to list `projects/*/` directories and find the highest `NNN-*` number
2. Calculate the next number (zero-padded to 3 digits)
3. Slugify the project name
4. Use the Write tool to create `projects/{NNN}-{slug}/README.md`
5. Set `PROJECT_ID` and `PROJECT_PATH`

### Step 2: Read Source Artifacts

Read all documents from Step 0. Note especially:

- Entity type and size (determines which referentiels are mandatory vs recommended)
- Whether the service is citizen-facing (triggers DSFR, FranceConnect, RGAA mandatory)
- Data sensitivity (drives cloud doctrine tier)
- Service type (determines applicable ANSSI sector orders)

### Step 3: DINUM Template Reading

**Read the template** (with user override support):

- **First**, check if `.arckit/templates/fr-dinum-template.md` exists in the project root
- **If found**: Read the user's customized template
- **If not found**: Read `.arckit/templates/fr-dinum-template.md`

### Step 4: Applicability Scoping

Before generating the assessment, determine which standards apply:

| Standard | Mandatory if... | For this project |
|----------|----------------|-----------------|
| Doctrine cloud de l'État | Any cloud hosting by French State entity | [Yes/No] |
| RGI v2.0 | Any public digital service | Always Yes |
| RGAA 4.1 | State / EPA / EIC with > 250 agents, or large private company | [Mandatory/Recommended] |
| RGESN | Public digital service (2024: legally binding for many entities) | [Mandatory/Recommended] |
| RGS v2.0 | Any information system operated by the State | Always Yes |
| FranceConnect | Citizen authentication required | [Yes/No] |
| ProConnect | Civil servant authentication required | [Yes/No] |
| DSFR | Citizen-facing public digital service | [Mandatory/Recommended] |

Show this scoping table to the user before generating the full assessment.

### Step 5: Generate DINUM Assessment

**CRITICAL**: Use the **Write tool** to create the assessment document.

1. **Detect version**: Check for existing `ARC-{PROJECT_ID}-DINUM-v*.md` files:
   - No existing file → VERSION="1.0"
   - Existing file → minor increment if refreshed, major if scope changed

2. **Auto-populate Document Control**:
   - Document ID: `ARC-{PROJECT_ID}-DINUM-v{VERSION}`
   - Status: DRAFT
   - Created Date: {current_date}
   - Next Review Date: {current_date + 12 months}
   - Review Cycle: Annual
   - Classification: from user input or OFFICIAL as default

3. **Section 1: Doctrine Cloud de l'État** (Circulaire 6264/SG)
   - Cloud evaluation hierarchy: internal government cloud → SecNumCloud-qualified → standard cloud
   - Assessment table for each tier
   - Data sensitivity classification driving the cloud tier requirement
   - If SECNUM artifact exists, cross-reference its conclusions

4. **Section 2: RGI v2.0 — Interoperability**
   - Formats and standards compliance table (ODF, JSON, REST/OpenAPI, GeoJSON, OpenID Connect, XAdES, SMTP)
   - Interoperability principles checklist (open standards, API documentation, reversibility)
   - Extract specific requirements from REQ artifact if available

5. **Section 3: RGAA 4.1 — Digital Accessibility**
   - Legal obligations table (entity type and size determine mandatory/recommended)
   - Assessment areas table: all 13 themes with 106 criteria count
   - If existing audit results found in external documents, populate theme status
   - Mandatory publication requirements checklist (déclaration d'accessibilité, schéma pluriannuel)
   - Compliance rate: [X]% if audit data available, otherwise [To be assessed via RGAA audit]

6. **Section 4: RGESN — Digital Service Ecodesign**
   - 8-category table across 79 criteria (2024 version)
   - Hosting sustainability requirements
   - Note any ecodesign constraints from requirements

7. **Section 5: RGS v2.0 — Information Systems Security**
   - Determine target RGS level (* / ** / ***) based on service type and data sensitivity
   - Key RGS requirements checklist
   - Homologation process steps — flag if homologation is planned/completed
   - If SECD artifact exists, cross-reference security controls

8. **Section 6: FranceConnect / ProConnect Integration** (if applicable)
   - Requirements for FranceConnect (citizen) and ProConnect (agent) integration
   - eIDAS Level of Assurance required
   - Skip if service has no authentication requirements

9. **Section 7: DSFR — French State Design System** (if citizen-facing)
   - Component usage, Marianne font, branding guidelines
   - Note that DSFR components include built-in RGAA compliance — flag if already using DSFR

10. **Section 8: Gap Analysis and Action Plan**
    - Consolidate gaps from all sections
    - Priority flags (🔴 High for legally mandatory gaps, 🟠 Medium for recommended, 🟡 Low for good practice)
    - Owner and deadline columns for completion

11. **Executive Summary** (top of document)
    - Compliance level per referential (Full / Partial / Non-compliant + percentage where applicable)
    - Critical gap count per referential

Before writing the file, read `.arckit/references/quality-checklist.md` and verify all **Common Checks** pass.

Write the document to:

```text
projects/{project_id}/ARC-{PROJECT_ID}-DINUM-v{VERSION}.md
```

### Step 6: Summary Output

```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ DINUM Standards Assessment Generated
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 Document: projects/{project_id}/ARC-{PROJECT_ID}-DINUM-v{VERSION}.md
📋 Document ID: {document_id}
📅 Assessment Date: {date}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Compliance Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Referential       | Status        | Critical Gaps |
|-------------------|---------------|--------------|
| Doctrine Cloud    | {status}      | {N}          |
| RGI v2.0          | {status}      | {N}          |
| RGAA 4.1          | {X%}          | {N}          |
| RGESN             | {status}      | {N}          |
| RGS v2.0          | {status}      | {N}          |

Total critical gaps: {N}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ Immediate Actions Required
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{List of 🔴 High priority gaps with owners}

Next steps:
1. {If personal data: Run /arckit.fr-rgpd for CNIL compliance}
2. {If cloud: Run /arckit.fr-secnumcloud for cloud doctrine alignment}
3. {If RGS gaps: Run /arckit.secure for security controls}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Important Notes

- **RGAA mandatory threshold**: RGAA 4.1 is legally mandatory for State entities, EPAs, and EICs with more than 250 agents. Always verify entity type and size before marking RGAA as "Recommended."
- **Homologation**: RGS homologation is mandatory before any new information system goes live. Flag this clearly if no homologation process is documented.
- **Doctrine cloud hierarchy**: The three-tier cloud evaluation (internal → SecNumCloud → standard) is mandatory to document even if the conclusion is that standard cloud is acceptable. The justification for each tier must be on record.
- **DSFR and RGAA**: Using DSFR components provides partial RGAA compliance by design. Note this in the assessment — it reduces the audit scope but does not eliminate the obligation.
- **Use Write Tool**: DINUM assessments cover 5+ referentiels and are typically 2,000-4,000 words. Always use the Write tool.

## Key References

| Document | Publisher | URL |
|----------|-----------|-----|
| RGAA 4.1 — Référentiel Général d'Accessibilité pour les Administrations | DINUM | https://accessibilite.numerique.gouv.fr/ |
| RGESN — Référentiel Général d'Écoconception de Services Numériques | DINUM / MTE | https://ecoresponsable.numerique.gouv.fr/publications/referentiel-general-ecoconception/ |
| RGI 2.0 — Référentiel Général d'Interopérabilité | DINUM | https://www.numerique.gouv.fr/publications/interoperabilite/ |
| RGS v2.0 — Référentiel Général de Sécurité | ANSSI | https://cyber.gouv.fr/referentiel-general-de-securite |
| DSFR — Système de Design de l'État | DINUM | https://www.systeme-de-design.gouv.fr/ |
| FranceConnect — identity federation | DINUM | https://franceconnect.gouv.fr/ |
| Doctrine cloud de l'État — cloud-first policy | DINUM | https://www.numerique.gouv.fr/services/cloud/doctrine/ |
| API.gouv.fr — government API catalogue | DINUM | https://api.gouv.fr/ |

> **Note for reviewers**: DINUM (Direction Interministérielle du Numérique) is France's central digital government directorate, equivalent in purpose to the UK's GDS (Government Digital Service). The RGI, RGAA, RGESN, and RGS are mandatory referentiels for French public IS — not voluntary standards. The DSFR (Design System of the French State) is the official component library for all public-facing government digital services, analogous to the GOV.UK Design System.

## Success Criteria

- ✅ Assessment document created at `projects/{project_id}/ARC-{PROJECT_ID}-DINUM-v{VERSION}.md`
- ✅ Applicable standards scoped (mandatory vs recommended per entity type)
- ✅ Cloud doctrine three-tier evaluation documented
- ✅ RGI interoperability principles assessed
- ✅ RGAA 4.1 compliance level determined (13 themes, 106 criteria framework)
- ✅ RGESN ecodesign categories assessed
- ✅ RGS security level determined (*//**/***) and homologation status noted
- ✅ FranceConnect/ProConnect applicability assessed
- ✅ DSFR applicability assessed for citizen-facing services
- ✅ Gap analysis with prioritised action plan generated
- ✅ Executive summary compliance table populated

## Example Usage

```text
/arckit.fr-dinum Assess DINUM standards compliance for a citizen-facing tax declaration portal operated by a French ministry, handling personal and financial data, targeting full RGAA compliance and SecNumCloud hosting, with FranceConnect integration

/arckit.fr-dinum DINUM compliance for 001 — regional government digital service, 300 agents, partial cloud migration to OVHcloud

/arckit.fr-dinum Assess digital standards for a French local authority (mairie) citizen portal, under 250 agents, RGAA recommended not mandatory
```

## Suggested Next Steps

After completing this command, consider running:

- `/arckit-fr-rgpd` -- Assess CNIL-specific GDPR obligations after establishing DINUM compliance baseline *(when Service processes personal data of French residents)*
- `/arckit-fr-secnumcloud` -- Assess SecNumCloud requirements if cloud hosting is involved *(when Cloud hosting required under doctrine cloud de l'État)*
- `/arckit-secure` -- Generate Secure by Design assessment aligned with RGS findings
