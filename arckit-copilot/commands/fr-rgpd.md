---
description: "[COMMUNITY] Assess CNIL-specific GDPR obligations for French deployments — cookies, health data (HDS), minors, délibérations CNIL, and French enforcement patterns"
argument-hint: "<project ID or processing description, e.g. '001', 'patient portal with health data and minors'>"
effort: high
handoffs:
  - command: dpia
    description: Run a full Data Protection Impact Assessment if CNIL screening flags high risk
    condition: "2+ CNIL DPIA criteria triggered"
  - command: fr-secnumcloud
    description: Assess SecNumCloud requirements for health data hosting
    condition: "Health data (données de santé) processed — HDS hosting required"
  - command: fr-marche-public
    description: Include GDPR/DPA obligations in procurement documentation
    condition: "Procurement involves data processors"
---


> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output should be reviewed by qualified DPO / RSSI / legal counsel before reliance. Citations to ANSSI / CNIL / EU regulations may lag the current text — verify against the source.

You are helping an enterprise architect generate a **French CNIL Compliance Assessment** — the French-specific GDPR layer applied by the CNIL (Commission Nationale de l'Informatique et des Libertés). Run this after `/arckit.eu-rgpd` to add French obligations that go beyond the EU GDPR baseline.

## User Input

```text
$ARGUMENTS
```

## Instructions

> **Note**: The ArcKit Project Context hook has already detected all projects, artifacts, external documents, and global policies. Use that context below — no need to scan directories manually.

### Step 0: Read existing artifacts from the project context

**MANDATORY** (warn if missing):

- **DATA** (Data Model) — Extract: all entities with personal data, special category data, data subjects, data flows, retention periods, third-party processors
  - If missing: warn that CNIL assessment requires a data model to identify personal data categories
- **RGPD** (EU RGPD Assessment) — Extract: legal basis mapping, DPIA screening results, DPO determination, international transfer analysis
  - If missing: warn that `/arckit.fr-rgpd` should be run after `/arckit.eu-rgpd` for best results. Proceed with available data.

**RECOMMENDED** (read if available, note if missing):

- **REQ** (Requirements) — Extract: data requirements (DR-xxx), compliance requirements, authentication requirements (determines FranceConnect/minor access)
- **STKE** (Stakeholder Analysis) — Extract: data subject categories (especially minors, patients, vulnerable groups)

**OPTIONAL** (read if available, skip silently):

- **SECD** (Secure by Design) — Extract: security measures relevant to Article 32 GDPR assessment
- **DINUM** (DINUM Standards Assessment) — Extract: cookie consent approach already documented

### Step 0b: Read external documents and policies

- Read any **external documents** in `external/` — extract previous CNIL correspondence, privacy notices, existing DPA agreements, cookie audit reports, HDS certificates
- Read any **global policies** in `000-global/policies/` — extract privacy policy, data retention schedule, cookie policy, DPO mandate
- If a previous CNIL assessment or privacy policy found, use it to pre-populate compliance status and identify gaps.

### Step 1: Identify or Create Project

Identify the target project from the hook context. If the project doesn't exist:

1. Use Glob to list `projects/*/` directories and find the highest `NNN-*` number
2. Calculate the next number (zero-padded to 3 digits)
3. Slugify the project name
4. Use the Write tool to create `projects/{NNN}-{slug}/README.md`
5. Set `PROJECT_ID` and `PROJECT_PATH`

### Step 2: Read Source Artifacts

Read all documents from Step 0. Identify:

- Presence of health data (données de santé) → triggers HDS section
- Presence of data subjects who may be minors → triggers age consent section (15 years in France)
- Presence of cookies/analytics tracking → triggers CNIL cookie guidelines section
- Presence of third-party processors → triggers DPA clause requirements
- Whether entity is a public authority → determines DPO mandatory status

### Step 3: CNIL Template Reading

**Read the template** (with user override support):

- **First**, check if `.arckit/templates/fr-rgpd-template.md` exists in the project root
- **If found**: Read the user's customized template
- **If not found**: Read `${CLAUDE_PLUGIN_ROOT}/templates/fr-rgpd-template.md`

### Step 4: Generate CNIL Compliance Assessment

**CRITICAL**: Use the **Write tool** to create the assessment document.

1. **Detect version**: Check for existing `ARC-{PROJECT_ID}-CNIL-v*.md` files:
   - No existing file → VERSION="1.0"
   - Existing file → minor increment if refreshed, major if scope changed significantly

2. **Auto-populate Document Control**:
   - Document ID: `ARC-{PROJECT_ID}-CNIL-v{VERSION}`
   - Status: DRAFT
   - Created Date: {current_date}
   - Next Review Date: {current_date + 12 months}
   - Classification: OFFICIAL-SENSITIVE (privacy assessments contain sensitive risk information)
   - Add note: "This document supplements ARC-{PROJECT_ID}-RGPD-v*.md with French/CNIL-specific requirements"

3. **Section 1: CNIL Regulatory Framework**
   - Applicable texts table: GDPR, Loi Informatique et Libertés (78-17 amended 2018), CNIL délibérations
   - Identify applicable CNIL référentiels: santé, RH, CCTV, cookies, IA, banque, assurance, éducation
   - French age of consent: 15 years (Article 45 Loi 78-17) — flag if minors detected in scope

4. **Section 2: Cookies and Trackers** (always included — present in virtually all digital services)
   - CNIL cookie guidelines (Délibération 2020-091) compliance checklist:
     - Consent before non-essential cookies deposited
     - "Reject all" as prominent as "Accept all" (CNIL ruling 2021)
     - No cookie wall
     - Consent valid for 6 months maximum
     - Pre-ticked boxes absent
   - Cookie categories table: strictly necessary (no consent), analytics, social media, advertising
   - **CNIL analytics exemption**: Note Matomo correctly configured qualifies; Google Analytics does NOT (CNIL ruling January 2022)
   - Estimated CNIL enforcement risk level based on service type (e-commerce, media, healthcare = high priority sectors)

5. **Section 3: Health Data** (only if health data detected in data model or user input)
   - HDS certification requirements: any third-party hosting of données de santé requires HDS certification
   - HDS-certified provider list guidance (esante.gouv.fr)
   - ANS security framework requirements
   - Mon Espace Santé integration (if patient-facing)
   - CNIL référentiel santé applicability
   - DPIA mandatory flag: health data = special category → run `/arckit.dpia`
   - If no health data: include section header with "N/A — no health data (données de santé) identified"

6. **Section 4: DPO Registration with CNIL**
   - DPO mandatory determination:
     - Public authority → always mandatory
     - Large-scale systematic monitoring → mandatory
     - Large-scale special category data → mandatory
   - DPO registration steps on notifications.cnil.fr
   - DPO contact publication requirement on privacy notice

7. **Section 5: Data Subject Rights (French context)**
   - Standard rights table (Art. 15–22) with French response deadlines
   - **French specificity**: Post-mortem digital legacy rights (Art. 85 Loi 78-17) — not in GDPR itself
   - Flag any rights not implemented in the data model

8. **Section 6: Minors (if applicable)**
   - French age of digital consent: 15 years (vs GDPR default 16)
   - Age verification mechanism requirements
   - Parental consent for under-15 users
   - CNIL enforcement priority: platforms accessible to minors (active 2024–2025)
   - If no minors detected: include section header with "N/A — no minor data subjects identified"

9. **Section 7: CNIL Enforcement Priority Self-Assessment**
   - Map against CNIL 2023–2025 enforcement priorities:
     - Cookie consent violations
     - Illegal transfers to USA (post-Schrems II)
     - Insufficient security (Art. 32)
     - Failure to respond to SARs
     - Retention not enforced
     - DPIA not conducted
     - Profiling without adequate basis
   - Notable reference fines for calibration (Google €150M, Meta €60M, Doctissimo €380K)

10. **Section 8: Breach Notification to CNIL**
    - 72-hour notification requirement via notifications.cnil.fr
    - Individual notification for high-risk breaches
    - Breach register maintenance requirement

11. **Section 9: International Transfers (French context)**
    - Post-Schrems II Transfer Impact Assessment requirement
    - CNIL guidance on TIAs (aligned with EDPB Recommendations 01/2020)
    - EU-US Data Privacy Framework status

12. **Section 10: Gap Analysis and Action Plan**
    - Consolidate gaps from all sections
    - Priority based on CNIL enforcement priority and legal obligation level

Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** pass.

Write the document to:

```text
projects/{project_id}/ARC-{PROJECT_ID}-CNIL-v{VERSION}.md
```

### Step 5: Summary Output

```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ CNIL Compliance Assessment Generated
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 Document: projects/{project_id}/ARC-{PROJECT_ID}-CNIL-v{VERSION}.md
📋 Document ID: {document_id}
📅 Assessment Date: {date}
🔒 Classification: OFFICIAL-SENSITIVE

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 French-Specific Compliance Areas
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Area                       | Status      | Gaps |
|---------------------------|-------------|------|
| CNIL Cookie Guidelines    | {status}    | {N}  |
| Health Data (HDS)         | {N/A or status} | {N} |
| Age of Consent (15 years) | {N/A or status} | {N} |
| DPO Registration          | {status}    | {N}  |
| Post-Mortem Rights        | {status}    | {N}  |
| CNIL Enforcement Risks    | {level}     | {N}  |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ Critical Actions
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{List 🔴 High priority gaps}

Next steps:
1. {If health data: Run /arckit.fr-secnumcloud for HDS-compliant hosting}
2. {If DPIA required: Run /arckit.dpia}
3. {If procurement: Run /arckit.fr-marche-public for DPA clauses}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Important Notes

- **Run after eu-rgpd**: This command adds the French layer on top of the EU GDPR baseline. For best results, run `/arckit.eu-rgpd` first, then this command.
- **CNIL cookie ruling on Google Analytics**: The CNIL ruled in January 2022 that Google Analytics transfers data to the US without adequate protection. This is an active enforcement risk for French services using Google Analytics. Flag explicitly.
- **HDS is legally mandatory**: Any third-party hosting of health data (as defined by Art. L. 1111-8 CSP) without HDS certification is a criminal offence. This is not a recommended control — it is a legal requirement.
- **French age of consent is 15, not 16**: France chose the lower limit allowed by GDPR (member states can set 13–16). Do not apply the GDPR default of 16.
- **Use Write Tool**: CNIL assessments cover multiple French-specific regulations and are typically 2,500–4,500 words. Always use the Write tool.

## Key References

| Document | Publisher | URL |
|----------|-----------|-----|
| CNIL — official website and guidance | CNIL | https://www.cnil.fr/ |
| Délibération 2020-091 — cookies and consent (French rules) | CNIL | https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies/que-dit-la-loi |
| Loi n°78-17 Informatique et Libertés (amended) | Légifrance | https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000886460 |
| HDS — Hébergement de Données de Santé (health data hosting) | ANS (Agence du Numérique en Santé) | https://esante.gouv.fr/secteur/hebergement-des-donnees-de-sante |
| DPO registration with CNIL | CNIL | https://notifications.cnil.fr/ |
| CNIL AIPD / DPIA guidance and tool (PIA) | CNIL | https://www.cnil.fr/fr/outil-pia-telechargez-et-installez-le-logiciel-de-la-cnil |
| GDPR full text | EUR-Lex | https://eur-lex.europa.eu/eli/reg/2016/679/oj |

> **Note for reviewers**: This command covers France-specific GDPR obligations layered on top of the baseline EU GDPR (covered by `/arckit.eu-rgpd`). Key French specifics: the age of digital consent is **15** (not the GDPR default of 16), HDS (Hébergement de Données de Santé) is a mandatory French certification for any cloud provider hosting health data, and the CNIL has issued specific guidance on analytics tools — notably ruling that Google Analytics transfers personal data to the US unlawfully (2022). The CNIL is the French Data Protection Authority (DPA), member of the EDPB.

## Success Criteria

- ✅ Assessment document created at `projects/{project_id}/ARC-{PROJECT_ID}-CNIL-v{VERSION}.md`
- ✅ Applicable CNIL référentiels identified
- ✅ Cookie compliance assessed against Délibération 2020-091 (reject button prominence, no cookie wall, 6-month consent validity)
- ✅ Google Analytics CNIL ruling flagged if analytics tools detected
- ✅ HDS certification requirement assessed (mandatory if health data)
- ✅ DPO registration with CNIL assessed
- ✅ Post-mortem digital legacy rights (Art. 85 Loi 78-17) addressed
- ✅ Age of digital consent at 15 years applied (not GDPR default 16)
- ✅ CNIL enforcement priority self-assessment completed
- ✅ 72-hour breach notification to CNIL process assessed
- ✅ Gap analysis with prioritised action plan generated
- ✅ Document classified OFFICIAL-SENSITIVE

## Example Usage

```text
/arckit.fr-rgpd Assess CNIL compliance for a French regional hospital group deploying a patient portal, processing données de santé, with third-party analytics and a mobile app targeting both adults and teenagers

/arckit.fr-rgpd CNIL layer for 001 — e-commerce platform with Google Analytics, loyalty profiling, EU-US transfers

/arckit.fr-rgpd French GDPR layer for a ministry HR system handling agent personal data, DPO mandatory, no health data
```
