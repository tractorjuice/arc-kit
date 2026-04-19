---
name: arckit-fr-secnumcloud
description: "[COMMUNITY] Assess SecNumCloud 3.2 qualification compliance for French sovereign cloud procurement and OIV/OSE obligations"
---

> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output should be reviewed by qualified DPO / RSSI / legal counsel before reliance. Citations to ANSSI / CNIL / EU regulations may lag the current text — verify against the source.

You are helping an enterprise architect generate a **SecNumCloud 3.2 Compliance Assessment** for cloud service procurement in the French public sector and regulated private sector. SecNumCloud is ANSSI's cloud security qualification scheme — the primary trust framework for sensitive data hosting in France.

## User Input

```text
$ARGUMENTS
```

## Instructions

> **Note**: Before generating, scan `projects/` for existing project directories. For each project, list all `ARC-*.md` artifacts, check `external/` for reference documents, and check `000-global/` for cross-project policies. If no external docs exist but they would improve output, ask the user.

### Step 0: Read existing artifacts from the project context

**MANDATORY** (warn if missing):

- **REQ** (Requirements) — Extract: data sensitivity levels, data classification, hosting requirements, security NFRs (NFR-SEC-xxx), integration requirements (INT-xxx), any SecNumCloud or sovereignty references
  - If missing: warn that SecNumCloud scoping requires defined requirements, especially data classification

**RECOMMENDED** (read if available, note if missing):

- **RISK** (Risk Register) — Extract: existing cloud/hosting risks, third-party risks, extraterritorial exposure risks
- **PRIN** (Architecture Principles, 000-global) — Extract: cloud strategy, data sovereignty principles, security baseline
- **DINUM** (DINUM Standards Assessment) — Extract: cloud doctrine evaluation results already documented

**OPTIONAL** (read if available, skip silently):

- **SECD** (Secure by Design) — Extract: security controls relevant to cloud hosting
- **MARPUB** (Public Procurement) — Extract: any procurement constraints already documented

### Step 0b: Read external documents and policies

- Read any **external documents** in `external/` — extract OIV/OSE designation letters, ANSSI correspondence, existing SecNumCloud assessments, cloud provider technical documentation
- Read any **global policies** in `000-global/policies/` — extract cloud strategy, data classification policy, sovereignty requirements
- If no external cloud/security docs exist, note: "No external cloud documentation found — assessment will be based on requirements and user input."

### Step 1: Identify or Create Project

Identify the target project from the hook context. If the user specifies a project that doesn't exist yet:

1. Use Glob to list `projects/*/` directories and find the highest `NNN-*` number
2. Calculate the next number (zero-padded to 3 digits)
3. Slugify the project name (lowercase, hyphens)
4. Use the Write tool to create `projects/{NNN}-{slug}/README.md` with project name, ID, and date
5. Set `PROJECT_ID` = the 3-digit number, `PROJECT_PATH` = the new directory path

### Step 2: Read Source Artifacts

Read all documents from Step 0. Extract and note key data classification levels, OIV/OSE status, and any existing provider preferences for use in the assessment.

### Step 3: SecNumCloud Template Reading

**Read the template** (with user override support):

- **First**, check if `.arckit/templates/fr-secnumcloud-template.md` exists in the project root
- **If found**: Read the user's customized template
- **If not found**: Read `.arckit/templates/fr-secnumcloud-template.md`

### Step 4: Entity and Sensitivity Scoping

Before generating the assessment, determine:

1. **Data sensitivity classification**: Based on requirements and user input, classify as:
   - Non-sensitive (standard government data) → Standard commercial cloud may be acceptable
   - Sensitive (personal data, health data, administrative data) → SecNumCloud recommended
   - Highly sensitive (national security, OIV SIIV data) → SecNumCloud required, possibly IGI 1300

2. **OIV/OSE designation**: Is the entity an OIV (Opérateur d'Importance Vitale) or OSE (Opérateur de Services Essentiels)?
   - OIV: obligations under LPM Article 22, ANSSI sector orders (arrêtés sectoriels)
   - OSE: obligations under NIS directive transposition

3. **Applicable regulatory framework**: From requirements or user input, determine if any of the following apply: HDS (health data), DORA (financial sector), IGI 1300 (classified information), RGPD (personal data)

Show a brief scoping summary before generating the full document.

### Step 5: Generate SecNumCloud Assessment

**CRITICAL**: Use the **Write tool** to create the assessment document.

1. **Detect version**: Check for existing `ARC-{PROJECT_ID}-SECNUM-v*.md` files:
   - No existing file → VERSION="1.0"
   - Existing file → compare scope; minor increment (1.0 → 1.1) if refreshed, major (1.0 → 2.0) if scope changed

2. **Auto-populate Document Control**:
   - Document ID: `ARC-{PROJECT_ID}-SECNUM-v{VERSION}`
   - Status: DRAFT
   - Created Date: {current_date}
   - Next Review Date: {current_date + 12 months}
   - Classification: OFFICIAL-SENSITIVE (minimum for cloud assessments)

3. **Section 1: Context and Scope**
   - Project sensitivity classification from Step 4
   - Applicable regulatory framework table (SecNumCloud, LPM, NIS2, IGI 1300, GDPR, DORA)
   - Data categories and OIV/OSE status

4. **Section 2: SecNumCloud 3.2 Qualification Matrix**
   - Provider status table for: S3NS (PREMI3NS), Outscale, OVHcloud, Bleu, NumSpot, Cloud Temple
   - Key criteria assessment for shortlisted providers: extraterritorial immunity, sovereign personnel, data residency, sovereign encryption, ANSSI audit
   - Critical note: Visa ≠ Qualification — flag procurement risk if user mentions providers with Visa only

5. **Section 3: Extraterritorial Legal Risk Assessment**
   - Risk framework: Cloud Act, FISA Section 702, ITAR/EAR, UK Investigatory Powers Act
   - Provider exposure matrix: map each shortlisted provider against legislation
   - ANSSI position on FISA-702 residual risk for US-lineage providers

6. **Section 4: OIV/OSE Obligation Mapping** (if applicable)
   - OIV obligations under LPM Article 22 and sector orders
   - OSE obligations under NIS directive
   - Leave blank with "N/A — entity is not designated OIV/OSE" if not applicable

7. **Section 5: Architecture Recommendations**
   - Match ANSSI patterns (A/B/C) to the sensitivity level determined in Step 4
   - Key management requirements table
   - Specific recommendations for health data (HDS), classified data (IGI 1300), sensitive personal data

8. **Section 6: Procurement Guidance**
   - UGAP catalogue alignment — identify relevant framework agreements
   - Code de la Commande Publique considerations (thresholds, JOUE publication)
   - Mandatory contractual annexes: ANSSI security annex, GDPR DPA, reversibility clause

9. **Section 7: Residual Risk Register**
   - Pre-populate with standard SECNUM risks (R01: no qualified SaaS provider, R02: FISA-702 residual, R03: qualification status change)
   - Add project-specific risks from the scoping analysis

10. **Section 8: Decision Matrix and Recommendation**
    - Shortlist providers by qualification status, extraterritorial risk, and fit to requirements
    - State clear recommendation with rationale based on data sensitivity level

Before writing the file, read `.arckit/references/quality-checklist.md` and verify all **Common Checks** pass.

Write the document to:

```text
projects/{project_id}/ARC-{PROJECT_ID}-SECNUM-v{VERSION}.md
```

### Step 6: Summary Output

```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ SecNumCloud Assessment Generated
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 Document: projects/{project_id}/ARC-{PROJECT_ID}-SECNUM-v{VERSION}.md
📋 Document ID: {document_id}
📅 Assessment Date: {date}
🔒 Classification: OFFICIAL-SENSITIVE

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Scoping Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Data Sensitivity: {classification}
OIV/OSE Designation: {Yes / No}
SecNumCloud Required: {Yes / Recommended / Not required}
HDS Required: {Yes / No}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏗️ Provider Matrix Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{Summary table of provider qualification status}

⚠️ Extraterritorial Risk: {Summary of Cloud Act / FISA-702 exposure}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Recommended Provider(s): {Name(s) with brief rationale}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Risks identified: {N} ({N} high, {N} medium)

Next steps:
1. {If OIV/OSE: Run $arckit-eu-nis2 for NIS2 obligation mapping}
2. Run $arckit-fr-marche-public for procurement documentation
3. {If health data: verify HDS certification of shortlisted providers}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Important Notes

- **Qualification vs Visa**: A SecNumCloud Visa (provisional) does NOT confer the same assurance level as a full Qualification. Always distinguish in procurement documents.
- **FISA-702 residual risk**: ANSSI's position is that US-lineage providers carry residual FISA-702 risk even after SecNumCloud qualification. This must be explicitly acknowledged and risk-accepted at the appropriate authority level.
- **Qualification status changes**: SecNumCloud qualifications are maintained only as long as providers continue to meet requirements. Include a contractual clause requiring maintained qualification throughout the contract period.
- **Use Write Tool**: SecNumCloud assessments are detailed technical documents. Always use the Write tool.

## Key References

| Document | Publisher | URL |
|----------|-----------|-----|
| SecNumCloud qualification scheme — official page | ANSSI | https://cyber.gouv.fr/secnumcloud |
| SecNumCloud 3.2 referential (requirements document) | ANSSI | https://cyber.gouv.fr/publications/referentiel-secnumcloud-32 |
| List of SecNumCloud-qualified providers | ANSSI | https://cyber.gouv.fr/prestataires-de-service-qualifies-secnumcloud |
| UGAP catalogue — sovereign cloud framework agreements | UGAP | https://www.ugap.fr/ |
| ANSSI — OIV obligations | ANSSI | https://cyber.gouv.fr/les-oiv-quest-ce-que-cest |
| NIS2 Directive — OSE obligations | EUR-Lex | https://eur-lex.europa.eu/eli/dir/2022/2555/oj |
| DINUM cloud doctrine for French public administration | DINUM | https://www.numerique.gouv.fr/services/cloud/doctrine/ |

> **Note for reviewers**: SecNumCloud is France's national cloud security qualification scheme, administered by ANSSI. It is the French equivalent of — and more stringent than — the EU's EUCS (European Cybersecurity Certification Scheme for Cloud Services). SecNumCloud 3.2 explicitly prohibits extraterritorial law exposure (US CLOUD Act, China MLSA), making it the required scheme for French government sensitive data and OIV systems. A key distinction: **SecNumCloud visa ≠ SecNumCloud qualification** — some providers hold a visa (provisional) rather than full qualification; only full qualification satisfies OIV/OSE and ministerial requirements.

## Success Criteria

- ✅ Assessment document created at `projects/{project_id}/ARC-{PROJECT_ID}-SECNUM-v{VERSION}.md`
- ✅ Data sensitivity classification determined from requirements
- ✅ OIV/OSE status assessed
- ✅ All six candidate providers assessed (S3NS, Outscale, OVHcloud, Bleu, NumSpot, Cloud Temple)
- ✅ Extraterritorial legal risk (Cloud Act, FISA-702) assessed per provider
- ✅ Architecture pattern recommended based on sensitivity
- ✅ UGAP catalogue guidance included
- ✅ Residual risk register populated
- ✅ Decision matrix with recommendation provided
- ✅ Document classified OFFICIAL-SENSITIVE

## Example Usage

```text
$arckit-fr-secnumcloud Assess SecNumCloud compliance for a health data platform at a French regional hospital group (CHR), handling données de santé, potential OSE designation

$arckit-fr-secnumcloud Cloud hosting assessment for 001, ministry platform handling personal and financial data, no OIV designation

$arckit-fr-secnumcloud Evaluate sovereign cloud options for a French local authority (collectivité territoriale) digital services platform, mixed-sensitivity data
```

## Suggested Next Steps

After completing this command, consider running:

- `$arckit-fr-marche-public` -- Generate procurement documentation once SecNumCloud requirements are defined *(when Cloud provider shortlist and qualification requirements identified)*
- `$arckit-eu-nis2` -- Map OIV/OSE obligations to NIS2 requirements *(when Entity has OIV or OSE designation)*
- `$arckit-risk` -- Integrate SecNumCloud and extraterritorial risks into the risk register
