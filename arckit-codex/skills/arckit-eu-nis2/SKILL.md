---
name: arckit-eu-nis2
description: "[COMMUNITY] Assess NIS2 Directive compliance obligations for EU member state operators of essential services and important entities"
---

> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output should be reviewed by qualified DPO / RSSI / legal counsel before reliance. Citations to ANSSI / CNIL / EU regulations may lag the current text — verify against the source.

You are helping an enterprise architect generate a **NIS2 Compliance Assessment** (EU Directive 2022/2555) for an organisation that may qualify as an Essential Entity or Important Entity under the NIS2 framework. NIS2 is transposed into national law by all EU member states (deadline October 2024).

## User Input

```text
$ARGUMENTS
```

## Instructions

> **Note**: Before generating, scan `projects/` for existing project directories. For each project, list all `ARC-*.md` artifacts, check `external/` for reference documents, and check `000-global/` for cross-project policies. If no external docs exist but they would improve output, ask the user.

### Step 0: Read existing artifacts from the project context

**MANDATORY** (warn if missing):

- **REQ** (Requirements) — Extract: security requirements (NFR-SEC-xxx), operational requirements, integration requirements (INT-xxx), sector and entity type information
  - If missing: proceed with user-provided entity description, but note that requirements analysis would strengthen the gap assessment

**RECOMMENDED** (read if available, note if missing):

- **RISK** (Risk Register) — Extract: existing security risks, supply chain risks, third-party risks, business continuity risks
- **SECD** (Secure by Design) — Extract: existing security controls, maturity assessments, security architecture decisions
- **PRIN** (Architecture Principles, 000-global) — Extract: security baseline, incident response principles, supply chain policy

**OPTIONAL** (read if available, skip silently):

- **SECNUM** (SecNumCloud Assessment) — Extract: OIV/OSE designation already assessed, cloud security posture
- **DORA** (DORA Assessment) — Extract: overlapping ICT resilience obligations if financial sector

### Step 0b: Read external documents and policies

- Read any **external documents** in `external/` — extract existing ANSSI correspondence (OIV/OSE designation letters), sector-specific security orders (arrêtés sectoriels), existing incident response plans, business continuity plans
- Read any **global policies** in `000-global/policies/` — extract security policy, incident response policy, supplier security policy, BCM policy
- If ANSSI designation documents found, use them to pre-populate the OIV/OSE status.

### Step 1: Identify or Create Project

Identify the target project from the hook context. If the project doesn't exist:

1. Use Glob to list `projects/*/` directories and find the highest `NNN-*` number
2. Calculate the next number (zero-padded to 3 digits)
3. Slugify the project name
4. Use the Write tool to create `projects/{NNN}-{slug}/README.md`
5. Set `PROJECT_ID` and `PROJECT_PATH`

### Step 2: Read Source Artifacts

Read all documents from Step 0. Identify:

- Entity sector (Annex I Essential / Annex II Important / out of scope)
- Organisation size (> 250 employees / 50–250 / < 50)
- Member state(s) of operation
- OIV/OSE designation status (France-specific)
- Financial sector involvement (DORA overlap)

### Step 3: NIS2 Template Reading

**Read the template** (with user override support):

- **First**, check if `.arckit/templates/eu-nis2-template.md` exists in the project root
- **If found**: Read the user's customized template
- **If not found**: Read `.arckit/templates/eu-nis2-template.md`

### Step 4: Entity Classification (Article 3)

Before generating the assessment, determine entity classification:

**Annex I — Essential Entities**: Energy (electricity, gas, oil, hydrogen), Transport (air, rail, water, road), Banking, Financial market infrastructure, Health, Drinking water, Wastewater, Digital infrastructure (IXPs, DNS, TLD, cloud, CDN, datacentres), ICT service management (B2B MSPs), Public administration, Space

**Annex II — Important Entities**: Postal and courier, Waste management, Chemicals, Food, Manufacturing (medical devices, computers, transport equipment), Digital providers (online marketplaces, search engines, social networks), Research

**Size thresholds**:

- Essential Entity: sector-qualified AND (> 250 employees OR > €50M revenue)
- Important Entity: sector-qualified AND (50–250 employees OR €10–50M revenue)
- Microenterprises (< 10 employees, < €2M) may benefit from simplified obligations

Show entity classification before generating the full document.

### Step 5: Generate NIS2 Assessment

**CRITICAL**: Use the **Write tool** to create the assessment document.

1. **Detect version**: Check for existing `ARC-{PROJECT_ID}-NIS2-v*.md` files:
   - No existing file → VERSION="1.0"
   - Existing file → minor increment if refreshed, major if scope changed

2. **Auto-populate Document Control**:
   - Document ID: `ARC-{PROJECT_ID}-NIS2-v{VERSION}`
   - Status: DRAFT
   - Created Date: {current_date}
   - Next Review Date: {current_date + 12 months}
   - Member State: from user input
   - Entity Designation: from Step 4 classification

3. **Section 1: Entity Scoping**
   - Sector classification table (Annex I vs Annex II)
   - Size threshold assessment
   - Entity classification result: Essential / Important / Out of scope
   - Supervision consequences table (ex ante vs ex post, max penalties)
   - Member state national competent authority

4. **Section 2: Governance Obligations (Article 20)**
   - Management body approval of security measures
   - Management body liability for non-compliance
   - Management body cybersecurity training requirement
   - Compliance status for each obligation

5. **Section 3: Risk Management Measures (Article 21)**
   - All ten minimum security measures with current status and gaps:
     1. Risk analysis policy
     2. Incident handling
     3. Business continuity / BCM
     4. Supply chain security
     5. Secure acquisition, development, maintenance
     6. Policies to assess effectiveness
     7. Cyber hygiene and training
     8. Cryptography policy
     9. HR security and access control
     10. MFA and secure communications
   - Proportionality assessment: measures proportionate to entity size and risk
   - Extract existing controls from SECD artifact to pre-populate status

6. **Section 4: Incident Reporting (Articles 23–24)**
   - Significant incident definition and classification criteria
   - Four-stage reporting timeline:
     - Early warning: 24 hours (national CSIRT)
     - Incident notification: 72 hours (CSIRT + authority)
     - Intermediate: on request
     - Final report: 1 month
   - Reporting readiness checklist
   - CSIRT contact details for the relevant member state

7. **Section 5: Supply Chain Security (Article 21(2)(d) + Article 22)**
   - Supplier inventory and risk assessment requirements
   - Contractual security clause requirements
   - Software supply chain requirements
   - ENISA supply chain risk framework
   - EU coordinated risk assessment outcomes (5G, if applicable)

8. **Section 6: Business Continuity (Article 21(2)(c))**
   - BCP documentation status
   - Backup and restoration testing
   - Crisis management procedures
   - RTO and RPO definition

9. **Section 7: National Transposition — Member State Specifics**
   - **France**: ANSSI / CERT-FR, LPM OIV overlap, transposition law status, SecNumCloud linkage, sectoral authorities (ANS for santé, ACPR for finance)
   - Other relevant member states from user input
   - Sector-specific guidance from national authorities

10. **Section 8: Gap Analysis and Roadmap**
    - Domain maturity matrix (L1–L5 scale)
    - Priority actions with effort estimates
    - Mermaid Gantt roadmap (0–3 months immediate, 3–6 months short-term, 6–12 months medium-term)
    - Related frameworks crosswalk (ISO 27001, NIST CSF, ANSSI IT hygiene)

Before writing the file, read `.arckit/references/quality-checklist.md` and verify all **Common Checks** pass.

Write the document to:

```text
projects/{project_id}/ARC-{PROJECT_ID}-NIS2-v{VERSION}.md
```

### Step 6: Summary Output

```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ NIS2 Assessment Generated
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 Document: projects/{project_id}/ARC-{PROJECT_ID}-NIS2-v{VERSION}.md
📋 Document ID: {document_id}
📅 Assessment Date: {date}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Entity Classification
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Classification: {Essential Entity / Important Entity / Out of scope}
Sector: {Annex I or II sector}
Competent Authority: {National authority}
Max Penalty: {€10M/2% or €7M/1.4%}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Gap Summary (Article 21 — Ten Measures)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{Compliance status for each of the 10 measures}

Total Gaps: {N} ({N} high, {N} medium, {N} low)
Incident Reporting: {Ready / Gap — 24h/72h capability needed}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Next steps:
1. {If OIV/OSE (France): Run $arckit-fr-secnumcloud}
2. {If financial sector: Run $arckit-eu-dora for DORA overlap}
3. Run $arckit-secure to implement Article 21 controls
4. Run $arckit-risk to register NIS2 gaps
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Important Notes

- **Management body liability**: NIS2 explicitly makes management body members personally liable for non-compliance. This is a new and significant change from NIS1. Flag this prominently.
- **24-hour reporting capability**: The 24-hour early warning window is very tight. Flag if no 24/7 incident detection and reporting capability exists.
- **OIV/OSE and NIS2 in France**: French OIV entities are subject to stricter obligations under LPM that supplement NIS2. OIV/SIIV systems must comply with both. ANSSI is the single competent authority for both regimes.
- **Member state variations**: NIS2 transposition varies. Germany (NIS2UmsuCG) and France have extended scope beyond EU minimum. Verify national transposition law for each member state of operation.
- **Use Write Tool**: NIS2 assessments cover 8 sections with technical and regulatory depth. Always use the Write tool.

## Key References

| Document | Publisher | URL |
|----------|-----------|-----|
| NIS2 Directive (2022/2555) — full text | EUR-Lex | https://eur-lex.europa.eu/eli/dir/2022/2555/oj |
| ENISA — NIS2 guidance and resources | ENISA | https://www.enisa.europa.eu/topics/cybersecurity-policy/nis-directive-new |
| ANSSI — French NCA for NIS2 (and OIV/OSE authority) | ANSSI | https://cyber.gouv.fr/ |
| CERT-FR — incident reporting contact (France) | CERT-FR / ANSSI | https://www.cert.ssi.gouv.fr/ |
| NIS Cooperation Group — member state guidance documents | NIS CG | https://ec.europa.eu/digital-single-market/en/nis-directive |
| ENISA NIS Investments report (sector benchmarks) | ENISA | https://www.enisa.europa.eu/publications/nis-investments |

> **Note for reviewers**: NIS2 replaced the original NIS Directive (2016/1148) in January 2023, with member state transposition deadline of October 2024. France transposed NIS2 through amendments to the Loi de Programmation Militaire (LPM), building on an existing OIV/OSE framework — ANSSI is the single competent authority for both regimes. "OIV" (Opérateurs d'Importance Vitale — critical infrastructure operators) is a French national designation that predates NIS2 and carries stricter obligations; "OSE" (Opérateurs de Services Essentiels) is the NIS/NIS2 designation. Entities can be both.

## Success Criteria

- ✅ Assessment document created at `projects/{project_id}/ARC-{PROJECT_ID}-NIS2-v{VERSION}.md`
- ✅ Entity classification determined (Essential / Important / Out of scope)
- ✅ Sector (Annex I or II) identified
- ✅ National competent authority and CSIRT identified
- ✅ All ten Article 21 minimum measures assessed with status and gaps
- ✅ Four-stage incident reporting timeline documented
- ✅ Reporting readiness assessed (24-hour capability)
- ✅ Supply chain security requirements mapped
- ✅ Business continuity requirements assessed
- ✅ Management body accountability obligations flagged
- ✅ National transposition specifics for relevant member states included
- ✅ Gap analysis with maturity levels (L1–L5) and roadmap generated

## Example Usage

```text
$arckit-eu-nis2 Assess NIS2 obligations for a French regional energy distribution operator (DSO), Essential Entity under Annex I Energy sector, existing OIV designation, planning cloud migration to SecNumCloud-qualified provider

$arckit-eu-nis2 NIS2 scoping for 001 — Dutch healthcare provider with 300 employees, operating across NL and BE, considering Essential Entity classification under health sector

$arckit-eu-nis2 NIS2 assessment for a managed service provider (MSP) operating across 6 EU member states, ICT service management Annex I
```

## Suggested Next Steps

After completing this command, consider running:

- `$arckit-fr-secnumcloud` -- Assess SecNumCloud alignment for French entities with OIV/OSE designation *(when Entity is French and has OIV or OSE designation)*
- `$arckit-eu-dora` -- Map overlapping ICT resilience obligations for financial sector entities *(when Entity is in the financial sector and subject to both NIS2 and DORA)*
- `$arckit-risk` -- Integrate NIS2 gap findings into the project risk register
- `$arckit-secure` -- Implement security controls addressing NIS2 Article 21 ten minimum measures
