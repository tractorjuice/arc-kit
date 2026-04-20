---
description: "[COMMUNITY] Generate GDPR (EU 2016/679) compliance assessment for EU/EEA data processing — legal basis mapping, data subject rights, transfers, DPIA screening, and breach notification across all member states"
argument-hint: "<project ID or processing description, e.g. '001', 'e-commerce platform expanding to DE and ES'>"
effort: high
handoffs:
  - command: dpia
    description: Run a full Data Protection Impact Assessment if screening flags 2+ high-risk criteria
    condition: "DPIA screening score is 2 or more"
  - command: fr-rgpd
    description: Add French CNIL-specific obligations on top of the EU GDPR baseline
    condition: "Project processes personal data of French residents or is operated by a French entity"
  - command: eu-ai-act
    description: Assess AI Act obligations where AI systems process personal data
    condition: "Project uses AI or automated decision-making involving personal data"
---


> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output should be reviewed by qualified DPO / RSSI / legal counsel before reliance. Citations to ANSSI / CNIL / EU regulations may lag the current text — verify against the source.

You are helping an enterprise architect generate a **GDPR Compliance Assessment** (EU 2016/679) for any organisation processing personal data of EU/EEA residents. This command takes a member-state-neutral approach to the EU GDPR baseline. For French-specific CNIL obligations, run `/arckit.fr-rgpd` after this assessment.

## User Input

```text
$ARGUMENTS
```

## Instructions

> **Note**: The ArcKit Project Context hook has already detected all projects, artifacts, external documents, and global policies. Use that context below — no need to scan directories manually.

### Step 0: Read existing artifacts from the project context

**MANDATORY** (warn if missing):

- **DATA** (Data Model) — Extract: all entities with personal data, special category data (Article 9), data subjects, data flows to third parties, retention periods, data classifications
  - If missing: warn that GDPR assessment requires a data model to identify what personal data is processed and how

**RECOMMENDED** (read if available, note if missing):

- **REQ** (Requirements) — Extract: data requirements (DR-xxx), compliance requirements (NFR-C-xxx), security requirements (NFR-SEC-xxx), integration points that involve personal data transfer
- **STKE** (Stakeholder Analysis) — Extract: data subject categories, vulnerable groups, organisation's role (controller / processor), RACI for data governance
- **PRIN** (Architecture Principles, 000-global) — Extract: privacy by design principles, data minimisation, retention policies

**OPTIONAL** (read if available, skip silently):

- **RISK** (Risk Register) — Extract: existing privacy risks, data breach history, third-party risks
- **SECD** (Secure by Design) — Extract: security controls relevant to Article 32 assessment

### Step 0b: Read external documents and policies

- Read any **external documents** in `external/` — extract existing privacy policies, Records of Processing Activities (RoPA), Data Processing Agreements, previous DPIA reports, transfer impact assessments
- Read any **global policies** in `000-global/policies/` — extract organisational privacy policy, data retention schedule, data classification scheme, DPO mandate
- **Citation traceability**: When referencing content from external documents, follow `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`.

### Step 1: Identify or Create Project

Identify the target project from the hook context. If the project doesn't exist:

1. Use Glob to list `projects/*/` directories and find the highest `NNN-*` number
2. Calculate the next number (zero-padded to 3 digits)
3. Slugify the project name
4. Use the Write tool to create `projects/{NNN}-{slug}/README.md`
5. Set `PROJECT_ID` and `PROJECT_PATH`

### Step 2: Read Source Artifacts

Read all documents from Step 0. Identify:

- Role: controller / processor / joint controller (from stakeholder analysis or user input)
- Special category data presence (Article 9) → stricter requirements
- International transfers → Schrems II / TIA requirements
- Data subjects: consumers, employees, patients, children?
- Lead supervisory authority: determined by the controller's main establishment

### Step 3: GDPR Template Reading

**Read the template** (with user override support):

- **First**, check if `.arckit/templates/eu-rgpd-template.md` exists in the project root
- **If found**: Read the user's customized template
- **If not found**: Read `${CLAUDE_PLUGIN_ROOT}/templates/eu-rgpd-template.md`

### Step 4: DPIA Screening (Article 35 — Automated)

Based on the data model and requirements, automatically score the EDPB 9 criteria:

| # | Criterion | Score YES if... |
|---|-----------|----------------|
| 1 | Evaluation/scoring | AI/ML profiling, credit scoring, behavioural profiling |
| 2 | Automated decisions | Legal/significant effect without human review |
| 3 | Systematic monitoring | Continuous tracking, surveillance, CCTV, web analytics at scale |
| 4 | Sensitive/special category data | ANY Article 9 category (health, biometric, genetic, etc.) |
| 5 | Large-scale processing | > 5,000 data subjects OR national/regional scope |
| 6 | Matching/combining datasets | Multiple data sources joined for new purposes |
| 7 | Vulnerable data subjects | Children, elderly, patients, job seekers |
| 8 | Innovative technology | AI/ML, biometrics, IoT, blockchain, facial recognition |
| 9 | Prevents exercising rights | No SAR/deletion/portability mechanism |

**DPIA Decision**:

- 2+ criteria: DPIA REQUIRED (Article 35) → recommend running `/arckit.dpia`
- 1 criterion: DPIA RECOMMENDED
- 0 criteria: DPIA NOT REQUIRED (but document the screening)

### Step 5: Generate GDPR Assessment

**CRITICAL**: Use the **Write tool** to create the assessment document.

1. **Detect version**: Check for existing `ARC-{PROJECT_ID}-RGPD-v*.md` files:
   - No existing file → VERSION="1.0"
   - Existing file → minor increment if refreshed, major if scope changed

2. **Auto-populate Document Control**:
   - Document ID: `ARC-{PROJECT_ID}-RGPD-v{VERSION}`
   - Status: DRAFT
   - Created Date: {current_date}
   - Next Review Date: {current_date + 12 months}
   - Classification: OFFICIAL-SENSITIVE
   - Lead Supervisory Authority: determine from controller's main EU establishment

3. **Section 1: Scope and Role Determination**
   - Organisation role (controller / processor / joint controller / sub-processor)
   - Data categories processed (standard personal data, Article 9 special categories, Article 10 criminal data)

4. **Section 2: Lawful Basis Assessment (Articles 6 and 9)**
   - Map each processing activity to Article 6(1) legal basis
   - Map each special category processing to Article 9(2) condition
   - Consent management: if consent used, assess GDPR consent requirements
   - Legitimate interests: flag if used — three-part test required (purpose, necessity, balancing)

5. **Section 3: Privacy by Design and Default (Article 25)**
   - Data minimisation, purpose limitation, storage limitation
   - Pseudonymisation, encryption defaults
   - Privacy-friendly default settings

6. **Section 4: Data Subject Rights (Articles 15–22)**
   - Implementation mechanism for each right with response times
   - Flag any rights without implementation mechanism as gap

7. **Section 5: Records of Processing Activities (Article 30)**
   - RoPA mandatory for organisations with 250+ employees (or processing high-risk/special category data)
   - RoPA location and maintenance status

8. **Section 6: DPIA Assessment**
   - Copy DPIA screening results from Step 4
   - DPIA status: conducted / required / not required

9. **Section 7: Data Processors and Sub-Processors (Article 28)**
   - Processor inventory from data model data flows
   - DPA compliance checklist (processing only on instructions, sub-processor controls, audit rights, deletion/return)

10. **Section 8: International Transfers (Articles 44–49)**
    - Transfer inventory: destination country, transfer mechanism, adequacy decision status
    - Post-Schrems II requirements: TIA documented, SCCs 2021 in place, supplementary measures
    - EU-US Data Privacy Framework status for US transfers
    - Adequacy decision list (current as of 2025)

11. **Section 9: Breach Notification (Articles 33–34)**
    - 72-hour DPA notification process
    - Individual notification trigger (high risk)
    - Internal breach register

12. **Section 10: National Supervisory Authority Context**
    - Lead DPA determination
    - Member-state table (CNIL, BfDI, AP, APD, AGPD, Garante, DPC, IMY)
    - Note: for French deployments, run `/arckit.fr-rgpd` for CNIL-specific requirements

13. **Section 11: Gap Analysis and Action Plan**
    - Consolidated gaps from all sections with priority flags

Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** pass.

Write the document to:

```text
projects/{project_id}/ARC-{PROJECT_ID}-RGPD-v{VERSION}.md
```

### Step 6: Summary Output

```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ GDPR Assessment Generated
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 Document: projects/{project_id}/ARC-{PROJECT_ID}-RGPD-v{VERSION}.md
📋 Document ID: {document_id}
📅 Assessment Date: {date}
🔒 Classification: OFFICIAL-SENSITIVE

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Assessment Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Role: {Controller / Processor / Joint Controller}
Lead DPA: {Authority name}
Data Subjects: {Categories}
Special Category Data: {Yes (categories) / No}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 DPIA Screening: {N}/9 criteria → {REQUIRED / RECOMMENDED / NOT REQUIRED}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

International Transfers: {N} transfers identified
  {List destination countries and mechanisms}

Total Gaps: {N} ({N} high, {N} medium, {N} low)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Next steps:
{If DPIA required: 1. Run /arckit.dpia — DPIA required (2+ criteria met)}
{If French deployment: Run /arckit.fr-rgpd — CNIL-specific requirements}
{If AI: Run /arckit.eu-ai-act — AI and personal data intersection}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Important Notes

- **Member-state neutral**: This command covers EU GDPR only. For French CNIL-specific requirements (cookies, HDS, age of consent 15), run `/arckit.fr-rgpd` after this assessment.
- **Legitimate interests for public authorities**: Article 6(1)(f) legitimate interests CANNOT be used by public authorities for tasks in the exercise of official authority. Flag this explicitly.
- **Schrems II is ongoing**: Even with the EU-US Data Privacy Framework (DPF), Transfer Impact Assessments remain best practice. DPF is subject to ongoing CJEU challenge.
- **DPIA is a legal requirement**: When 2+ EDPB criteria are met, the DPIA is mandatory before processing starts. Non-compliance can result in supervisory authority enforcement.
- **Use Write Tool**: GDPR assessments are typically 3,000–6,000 words. Always use the Write tool.

## Key References

| Document | Publisher | URL |
|----------|-----------|-----|
| GDPR full text (Regulation 2016/679) | EUR-Lex | https://eur-lex.europa.eu/eli/reg/2016/679/oj |
| EDPB — European Data Protection Board (guidelines and opinions) | EDPB | https://edpb.europa.eu/ |
| EU-US Data Privacy Framework | European Commission | https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection/eu-us-data-transfers_en |
| CNIL (French DPA) | CNIL | https://www.cnil.fr/ |
| EDPB DPIA guidelines (WP248) | EDPB | https://edpb.europa.eu/our-work-tools/our-documents/guidelines/guidelines-92017-data-protection-impact-assessment_en |
| Standard Contractual Clauses (SCCs) | European Commission | https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection/standard-contractual-clauses-scc_en |
| DPA contacts across EU member states | EDPB | https://edpb.europa.eu/about-edpb/about-edpb/members_en |

## Success Criteria

- ✅ Assessment document created at `projects/{project_id}/ARC-{PROJECT_ID}-RGPD-v{VERSION}.md`
- ✅ Organisation role determined (controller / processor / joint)
- ✅ Lead supervisory authority identified
- ✅ All processing activities mapped to Article 6 legal basis
- ✅ Special category data mapped to Article 9 conditions
- ✅ EDPB 9-criteria DPIA screening completed
- ✅ Data subject rights implementation assessed (Articles 15–22)
- ✅ International transfers assessed with Schrems II requirements
- ✅ Processor inventory with DPA compliance checked
- ✅ 72-hour breach notification process assessed
- ✅ National supervisory authority map populated
- ✅ Document classified OFFICIAL-SENSITIVE
- ✅ French deployment flagged for `/arckit.fr-rgpd` follow-up

## Example Usage

```text
/arckit.eu-rgpd Assess GDPR compliance for a French e-commerce platform expanding to Germany and Spain, processing purchase history, behavioural analytics, and email marketing, using AWS eu-west-3 (Paris) with Salesforce Marketing Cloud (US-based processor)

/arckit.eu-rgpd GDPR assessment for 001 — SaaS HR platform operating across 5 EU member states, processing employee data, using US-based payroll sub-processor

/arckit.eu-rgpd Assess GDPR for a healthcare research project processing anonymised patient data across FR, DE, NL — assess whether anonymisation is complete
```
