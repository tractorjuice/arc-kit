---
description: "[COMMUNITY] Generate an Information System Security Policy (PSSI) for French public or private organisations — security objectives, principles, organisational structure, and applicable ANSSI/RGS standards"
---

> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output should be reviewed by qualified DPO / RSSI / legal counsel before reliance. Citations to ANSSI / CNIL / EU regulations may lag the current text — verify against the source.

You are helping an enterprise architect generate an **Information System Security Policy (PSSI — Politique de Sécurité des Systèmes d'Information)** for a French organisation. The PSSI is the foundational security governance document that defines the organisation's security objectives, principles, organisational structure, and the framework within which all system-level security plans and measures are developed.

For French public administrations, the PSSI is referenced as a mandatory document by the **Référentiel Général de Sécurité (RGS v2.0)** and the **Circulaire du Premier Ministre n°5926/SG**. For OIV systems, it is a required component of the security plan submitted to ANSSI. For OSE under NIS2, it constitutes part of the governance measures required by Article 21(2)(a).

## User Input

```text
$ARGUMENTS
```

## Instructions

> **Note**: Before generating, scan `projects/` for existing project directories. For each project, list all `ARC-*.md` artifacts, check `external/` for reference documents, and check `000-global/` for cross-project policies. If no external docs exist but they would improve output, ask the user.

### Step 0: Read existing artifacts from the project context

**MANDATORY** (warn if missing):

- **REQ** (Requirements) — Extract: organisation type, system description, user population, security requirements (NFR-SEC-xxx), OIV/OSE designation, data classification levels, RGS target level
  - If missing: warn that PSSI generation requires a clear understanding of the organisation scope and regulatory context

**RECOMMENDED** (read if available, note if missing):

- **EBIOS** (EBIOS RM Study) — Extract: essential values (VM-xx), main threats, security baseline from Workshop 1 — directly feeds PSSI threat context and security objectives
- **ANSSI** (ANSSI Assessment) — Extract: compliance status of the 42 hygiene measures — feeds the security baseline section
- **STKE** (Stakeholder Analysis) — Extract: organisational roles, key decision-makers (Highest Authority, RSSI, DPO)
- **DATA** (Data Model) — Extract: data classification levels, essential data assets, data owners
- **SECD** (Secure by Design) — Extract: existing security controls and architecture decisions already made

**OPTIONAL** (read if available, skip silently):

- **NIS2** (NIS2 Assessment) — Extract: Article 21 measures already assessed — avoid duplicating NIS2 obligations in PSSI
- **CNIL** (CNIL Assessment) — Extract: DPO contact, data protection obligations referenced in PSSI
- **CARTO** (SI Cartography) — Extract: system scope, essential assets, network boundaries — feeds PSSI scope section
- **PRIN** (Architecture Principles, 000-global) — Extract: security principles already documented at enterprise level

### Step 0b: Read external documents and policies

- Read any **external documents** in `external/` — extract previous PSSI versions, ministerial security directives, OIV sectoral arrêté, ANSSI inspection findings, audit reports
- Read any **global policies** in `000-global/policies/` — extract existing security-related policies that the PSSI should reference or supersede

### Step 1: Identify or Create Project

Identify the target project from the hook context. If the project doesn't exist:

1. Use Glob to list `projects/*/` directories and find the highest `NNN-*` number
2. Calculate the next number (zero-padded to 3 digits)
3. Slugify the project name
4. Use the Write tool to create `projects/{NNN}-{slug}/README.md`
5. Set `PROJECT_ID` and `PROJECT_PATH`

### Step 2: Read Source Artifacts

Read all documents from Step 0. Extract:

- Organisation type and regulatory status (ministry / agency / OIV / OSE / local authority / private)
- IS scope (what systems, how many users, how many sites)
- Essential values and main threats (from EBIOS if available)
- Existing security controls (from ANSSI if available)
- Relevant roles: who is the Highest Authority (AA), who is the RSSI, who is the DPO
- RGS target level and any specific sectoral obligations

### Step 3: PSSI Template Reading

**Read the template** (with user override support):

- **First**, check if `.arckit/templates/fr-pssi-template.md` exists in the project root
- **If found**: Read the user's customized template
- **If not found**: Read `.arckit/templates/fr-pssi-template.md`

### Step 4: PSSI Generation

The PSSI is a governance document, not a technical checklist. It must be readable by both technical and non-technical audiences, and must be approved at the highest level of the organisation.

#### Step 4a: Organisation Profile and Regulatory Context

1. **Organisation type**: Ministry, agency, local authority, public institution, OIV, OSE, private company. Each has different mandatory requirements.
2. **Regulatory obligations**: Which regulations impose security requirements — RGS, OIV sectoral arrêté, NIS2, GDPR, sector-specific law?
3. **RGS target level**: If the organisation is subject to RGS, what is the target level (*, **, ***)? This defines the stringency of security measures required.
4. **OIV/OSE designation**: If OIV, which sector and which SIIV systems are in scope? If OSE, which essential services?

#### Step 4b: Security Context

From EBIOS study or threat assessment:

1. **Essential values**: What assets does the IS protect (citizen data, payment processing, national defence, public health records)?
2. **Main threats**: What are the plausible threat sources given the organisation's profile (state-sponsored attackers, cybercriminals, insider threats)?
3. **Regulatory context**: What are the consequences of a security failure (reputational, financial, legal, mission impact)?

If no EBIOS study exists, derive the threat context from the organisation's profile and sector. Flag that an EBIOS study should be commissioned.

#### Step 4c: Security Objectives

Define clear, measurable security objectives for each security property:

1. **Confidentiality**: What information must be kept confidential and from whom?
2. **Integrity**: What data or processes must be protected from unauthorised modification?
3. **Availability**: What systems must remain available and to what SLA?
4. **Traceability**: What operations must be attributable to identified individuals?
5. **Authentication**: What level of assurance is required for user and system identity?

Map each objective to an RGS level (*, **, ***) if the organisation is RGS-subject.

#### Step 4d: Security Principles

Define 8–12 high-level security principles that will guide all security decisions in the organisation. Principles should be:

- Simple and memorable
- Actionable by architects and developers
- Consistent with ANSSI recommendations

Reference the standard principles from the template (need-to-know, least privilege, defence in depth, separation of duties, traceability, proportionality, continuity, resilience) and add any organisation-specific principles.

#### Step 4e: Organisational Structure

1. **Highest Authority (AA)**: Who signs the PSSI and is accountable for residual risks? (Minister, Director General, Secretary General)
2. **RSSI**: Identify by role — responsibilities, reporting line, access to the AA
3. **FSSI**: If the organisation handles DR or classified information, name the FSSI
4. **CSSI**: System-level security correspondents in each directorate
5. **DPO**: Data Protection Officer contact and responsibilities in the security framework
6. **IS Director (DSI/DNUM)**: Relationship with RSSI — who implements what the RSSI defines
7. **Security committees**: What governance forums exist for reviewing security posture?

#### Step 4f: Applicable Standards and Baseline

List all standards and guides the PSSI references:

- RGS v2.0 and target levels per system
- ANSSI Guide d'hygiène informatique (42 measures) — compliance level
- EBIOS RM (risk analysis methodology in use)
- ISO 27001/27002 if certified or applied
- Sectoral obligations (OIV arrêté, NIS2, DORA, etc.)
- GDPR / CNIL obligations

#### Step 4g: Security Domains

For each of the seven security domains in the template (access management, network security, workstation security, application security, data protection, physical security, business continuity), define:

- The principle that applies in this domain
- The minimum standard required
- The reference to the detailed technical measure (without duplicating the ANSSI guide)

#### Step 4h: User Obligations

Draft the mandatory security obligations for all IS users — concise, enforceable, and appropriate for an annex that can be attached to employment contracts or supplier agreements.

#### Step 4i: Incident Management Framework

Define the incident management process at the PSSI level — who declares, who qualifies, who notifies ANSSI/CERT-FR, who authorises containment. The detailed playbook is in the incident response plan; the PSSI defines the authority and roles.

### Step 5: Generate PSSI Document

**CRITICAL**: Use the **Write tool** to create the full PSSI document.

1. **Detect version**: Check for existing `ARC-{PROJECT_ID}-PSSI-v*.md` files:
   - No existing file → VERSION="1.0"
   - Existing file → minor increment if existing PSSI is being refreshed, major if scope changes significantly

2. **Auto-populate Document Control**:
   - Document ID: `ARC-{PROJECT_ID}-PSSI-v{VERSION}`
   - Status: DRAFT
   - Created Date: {current_date}
   - Next Review Date: {current_date + 36 months} (PSSI review cycle is typically 3 years or on major change)
   - Classification: OFFICIAL-SENSITIVE minimum (PSSI reveals security objectives and weaknesses)
   - Approved By: PENDING — must be signed by the Highest Authority

3. Write the complete PSSI following the template.

Before writing the file, read `.arckit/references/quality-checklist.md` and verify all **Common Checks** plus **PSSI** per-type checks pass.

Write the document to:

```text
projects/{project_id}/ARC-{PROJECT_ID}-PSSI-v{VERSION}.md
```

### Step 6: Summary Output

```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ PSSI Generated
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 Document: projects/{project_id}/ARC-{PROJECT_ID}-PSSI-v{VERSION}.md
📋 Document ID: {document_id}
📅 Date: {date}
🔒 Classification: OFFICIAL-SENSITIVE

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 PSSI Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Organisation type:    {Ministry / Agency / OIV / OSE / Local authority / Private}
OIV/OSE designation: {Yes — sector: X / No}
RGS target level:    {* / ** / *** / N/A}
Security principles: {N} defined
Security domains:    {N} covered
Roles defined:       AA / RSSI / {FSSI /} DPO / DSI

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ Actions Required Before Approval
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{If no EBIOS study: Threat context derived from profile — commission EBIOS study}
{If OIV: Submit to ANSSI for validation as part of security plan}
{Approval required from: [Highest Authority role]}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Next steps:
1. Run /arckit.fr-ebios — provides threat context and risk baseline for PSSI Section 2
2. Run /arckit.fr-anssi — assess compliance against the PSSI security baseline
3. Run /arckit.fr-anssi-carto — produce SI cartography to populate PSSI scope
4. {If DR data: Run /arckit.fr-dr — incorporate DR handling rules}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Important Notes

- **PSSI is mandatory for French public administrations**: The Circulaire PM 5926/SG requires all ministries and their agencies to have a PSSI. The RGS formalises this for IS subject to RGS. This is not a best-practice recommendation — it is a legal obligation for public sector IS.
- **Approval by the Highest Authority is essential**: A PSSI not approved and signed by the Highest Authority has no governance weight. The RSSI must secure this commitment. The PSSI generated here is DRAFT — flag the approval step prominently.
- **PSSI is not a technical document**: It defines objectives and principles, not implementation details. Implementation details live in system security plans (PSSI-S), the ANSSI assessment, and EBIOS studies. Keep the PSSI at governance level.
- **3-year review cycle**: Unlike most ArcKit documents (annual review), a PSSI has a typical review cycle of 3 years or on major change. This is reflected in the Next Review Date.
- **Relationship with EBIOS**: The PSSI and EBIOS RM are complementary. EBIOS provides the risk analysis that justifies the PSSI's security objectives. The PSSI provides the governance framework that gives EBIOS its authority. Ideally, EBIOS comes before or alongside the PSSI.
- **Applicable to private sector too**: While the RGS/Circulaire obligations apply specifically to public administrations, the PSSI format is applicable to any French organisation that wants to formalise its security governance — OIV private operators, OSE in the financial sector, large enterprises.

## Key References

| Document | Publisher | URL |
|----------|-----------|-----|
| Guide PSSI — methodology for drafting a security policy | ANSSI | https://cyber.gouv.fr/publications/politique-de-securite-des-systemes-dinformation |
| RGS v2.0 (Référentiel Général de Sécurité) — mandatory for public IS | ANSSI | https://cyber.gouv.fr/referentiel-general-de-securite |
| Guide d'hygiène informatique (42 measures) — PSSI baseline reference | ANSSI | https://cyber.gouv.fr/publications/guide-dhygiene-informatique |
| EBIOS Risk Manager — risk analysis methodology referenced in PSSI | ANSSI | https://cyber.gouv.fr/publications/la-methode-ebios-risk-manager |
| CERT-FR — incident notification contact | CERT-FR / ANSSI | https://www.cert.ssi.gouv.fr/ |
| NIS2 Directive — Article 21 security measures (for OSE) | EUR-Lex | https://eur-lex.europa.eu/eli/dir/2022/2555/oj |

> **Note for reviewers**: The PSSI (Politique de Sécurité des Systèmes d'Information) is the French equivalent of an Information Security Policy. It is mandatory for French public administrations under the Circulaire du Premier Ministre n°5926/SG and the RGS. The RGS (Référentiel Général de Sécurité) is the French government's security standard framework, published by ANSSI — analogous in purpose to ISO 27001 but specific to French public IS.

## Success Criteria

- ✅ PSSI document created at `projects/{project_id}/ARC-{PROJECT_ID}-PSSI-v{VERSION}.md`
- ✅ Organisation type and regulatory context determined (RGS level, OIV/OSE, sector)
- ✅ Security context documented: essential values, main threats
- ✅ Security objectives defined for each property (C/I/A/T/Authentication) with RGS level if applicable
- ✅ 8+ security principles defined, consistent with ANSSI recommendations
- ✅ Organisational structure documented: AA, RSSI, (FSSI,) DPO, DSI, CSSI
- ✅ All 7 security domains covered with principles and minimum standards
- ✅ User obligations defined
- ✅ Incident management framework defined (roles and escalation)
- ✅ Applicable standards and baseline documented (RGS, ANSSI hygiene, EBIOS, ISO 27001)
- ✅ Approval by Highest Authority flagged as required
- ✅ Document classified OFFICIAL-SENSITIVE minimum
- ✅ PSSI per-type quality checks passed

## Example Usage

```text
/arckit.fr-pssi Generate PSSI for the French Ministry of Culture IS — 2,000 users across 5 sites, OIV designation (secteur culture), RGS ** target level, mix of cloud and on-premise

/arckit.fr-pssi PSSI for 001 — French regional health agency (ARS), OSE designation under NIS2, handling patient data and public health surveillance, CNIL DPO already appointed

/arckit.fr-pssi PSSI for a private OIV operator in the energy sector — gas transmission network, SCADA-adjacent IS, ANSSI sectoral arrêté énergie applies
```

## Suggested Next Steps

After completing this command, consider running:

- `/arckit:fr-ebios` -- Conduct an EBIOS risk analysis to populate the PSSI threat context and refine security objectives *(when PSSI threat context requires a formal risk analysis or homologation is required)*
- `/arckit:fr-anssi` -- Assess compliance against ANSSI 42 hygiene measures to populate the PSSI security baseline section *(when PSSI security baseline has not yet been assessed against ANSSI hygiene measures)*
- `/arckit:fr-anssi-carto` -- Produce SI cartography to identify assets and interdependencies referenced in the PSSI scope *(when PSSI scope definition requires a structured cartography of the information system)*
- `/arckit:fr-dr` -- Document DR handling rules as a specific section of the PSSI *(when Organisation processes Diffusion Restreinte information)*
- `/arckit:eu-nis2` -- Align PSSI security measures with NIS2 Article 21 obligations *(when Organisation is an OSE under NIS2)*
