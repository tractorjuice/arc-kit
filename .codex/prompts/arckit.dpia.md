---
description: Generate Data Protection Impact Assessment (DPIA) for UK GDPR Article 35 compliance
---

You are helping an enterprise architect generate a **Data Protection Impact Assessment (DPIA)** following UK GDPR Article 35 requirements and ICO guidance.

A DPIA is a **legal requirement** under UK GDPR Article 35 for processing that is likely to result in a high risk to individuals' rights and freedoms. It systematically assesses privacy risks, evaluates necessity and proportionality, and identifies mitigations.

## User Input
```text
$ARGUMENTS
```

## Instructions

### Step 0: Check Prerequisites

**IMPORTANT**: Before generating a DPIA, verify that foundational artifacts exist:

1. **Data Model** (REQUIRED):
   - Check if `projects/*/ARC-*-DATA-v*.md` exists for the target project
   - If it does NOT exist:
     ```
     ❌ Data model not found.

     A DPIA requires a data model to identify:
     - Personal data and special category data being processed
     - Data subjects and vulnerable groups
     - Processing purposes and lawful basis
     - Retention periods and data flows

     Please run: /arckit.data-model Create data model for [project name]

     Then return here to generate the DPIA.
     ```
   - If it exists, proceed to Step 1

2. **Architecture Principles** (RECOMMENDED):
   - Check if `projects/000-global/ARC-000-PRIN-*.md` exists
   - If it does NOT exist, warn:
     ```
     ⚠️  Warning: Architecture principles not found.

     DPIAs should be informed by Privacy by Design principles.
     Consider running: /arckit.principles Create enterprise architecture principles
     ```
   - Continue anyway if user confirms

3. **Requirements and Stakeholders** (RECOMMENDED):
   - Check if `ARC-*-REQ-*.md` and `ARC-*-STKE-*.md` exist for the project
   - If missing, warn that DPIA will have limited context but can still proceed

### Step 1: Identify or Create Project

Use the `create-project.sh` script to find or create the project directory:

```bash
bash .arckit/scripts/bash/create-project.sh --name "$PROJECT_NAME" --json
```

This will return JSON with the project path. Parse it to get `project_id` and `project_path`.

If the user provided a project ID or name in their request, use that. Otherwise, ask the user for the project name.

### Step 2: Read Source Artifacts

Read the following artifacts to extract information for auto-population:

1. **Data Model** (REQUIRED):
   - Read `projects/{project_id}/ARC-*-DATA-*.md`
   - Extract:
     - All entities with PII/special category data
     - Data subjects (User, Customer, Employee, etc.)
     - GDPR Article 6 lawful basis for each entity
     - GDPR Article 9 conditions for special category data
     - Retention periods
     - Data flows (sources, destinations)
     - Data classifications

2. **Requirements** (if exists):
   - Read `projects/{project_id}/ARC-*-REQ-*.md`
   - Extract:
     - Data requirements (DR-xxx) describing processing purposes
     - Security requirements (NFR-SEC-xxx) as potential mitigations
     - Compliance requirements (NFR-C-xxx) related to GDPR

3. **Stakeholder Analysis** (if exists):
   - Read `projects/{project_id}/ARC-*-STKE-*.md`
   - Extract:
     - Data subject categories from stakeholders
     - Vulnerable groups (children, elderly, disabled)
     - RACI for data governance roles (DPO, Data Controller, Data Processors)

4. **Architecture Principles** (if exists):
   - Read `projects/000-global/ARC-000-PRIN-*.md`
   - Extract:
     - Privacy by Design principles
     - Data minimization principles
     - Security principles

5. **Risk Register** (if exists):
   - Read `projects/{project_id}/ARC-*-RISK-*.md`
   - Extract:
     - Existing data protection/privacy risks
     - Check if any risks are already tagged as DPIA-related

6. **Secure by Design Assessment** (if exists):
   - Read any `ARC-*-SECD-*.md` file in `projects/{project_id}/`
   - Extract:
     - Security controls that can serve as DPIA mitigations
     - NCSC CAF A.1 (Data) and A.2 (Identity & Access) controls

### Step 3: DPIA Template Reading

Read the DPIA template:

```bash
cat .arckit/templates/dpia-template.md

   > **Note**: Read the `VERSION` file and update the version in the template metadata line when generating.
```

This template has 16 major sections and uses the ICO's 9-criteria screening checklist.

### Step 4: ICO 9-Criteria Screening (Automated)

Based on the data model analysis, automatically score the ICO 9 criteria:

| # | Criterion | Scoring Logic |
|---|-----------|---------------|
| 1 | **Evaluation or scoring** | YES if: AI/ML features mentioned, profiling/scoring in requirements |
| 2 | **Automated decision-making** | YES if: Automated decisions with legal/significant effect in requirements |
| 3 | **Systematic monitoring** | YES if: Continuous tracking, surveillance, monitoring in requirements |
| 4 | **Sensitive data** | YES if: ANY special category data (Article 9) in data model |
| 5 | **Large scale** | YES if: >5000 data subjects mentioned OR "national" scope OR "all citizens" |
| 6 | **Matching datasets** | YES if: Multiple data sources/integrations in data flows |
| 7 | **Vulnerable subjects** | YES if: Children, elderly, disabled, patients identified in stakeholders |
| 8 | **Innovative technology** | YES if: AI/ML, blockchain, biometrics, new tech mentioned |
| 9 | **Prevents rights exercise** | YES if: No mechanism for SAR/deletion/portability in data model |

**DPIA Decision Rules**:
- **2+ criteria met**: DPIA REQUIRED (UK GDPR Article 35)
- **1 criterion met**: DPIA RECOMMENDED (good practice)
- **0 criteria met**: DPIA NOT REQUIRED (but consider Data Privacy Notice)

Show the screening results to the user:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 DPIA Screening Results (ICO 9 Criteria)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[X] Criterion 4: Sensitive data (Special category data found: Health, Ethnicity)
[X] Criterion 7: Vulnerable subjects (Children identified in stakeholders)
[ ] Criterion 1: Evaluation/scoring (Not detected)
... [continue for all 9 criteria]

**Screening Score**: 2/9 criteria met
**Decision**: ✅ DPIA REQUIRED under UK GDPR Article 35

Proceeding to generate full DPIA...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

If the screening shows DPIA NOT REQUIRED, ask the user if they want to proceed anyway (they may want to conduct a DPIA for good practice or to demonstrate accountability).

### Step 5: Generate DPIA Document

**CRITICAL**: Use the **Write tool** to create the DPIA document. DPIAs are typically 3,000-10,000 words and will exceed the 32K token output limit if you try to output the full document in the chat.

Generate the DPIA by:

1. **Auto-populate Document Control**:
   ```bash
   # Generate document ID
   DOC_ID=$(bash .arckit/scripts/bash/generate-document-id.sh {project_id} DPIA v1.0)
   ```
   - Document ID: `{DOC_ID}` (e.g., ARC-001-DPIA-v1.0)
   - Version: 1.0
   - Status: DRAFT
   - Date Created: {current_date}
   - Assessment Date: {current_date}
   - Next Review Date: {current_date + 12 months}
   - Classification: OFFICIAL-SENSITIVE

2. **Section 1: Need for DPIA**:
   - Copy screening results from Step 4
   - List all criteria that were met with evidence from data model

3. **Section 2: Description of Processing**:
   - Project Context: Summarize from user input and requirements
   - Processing Purposes: Extract from DR-xxx requirements and data model "Purpose of Processing" fields
   - Nature of Processing: Describe collection, storage, use, disclosure, deletion
   - Scope of Processing: Data subjects from stakeholder analysis, geographic scope
   - Data Categories: List all PII and special category data from data model entities
   - Data Sources: Extract from data model "Data Flow Sources"
   - Data Destinations: Extract from data model "Data Flow Destinations"
   - Retention Periods: Extract from data model retention policies

4. **Section 3: Consultation**:
   - Internal Stakeholders: Extract from stakeholder RACI (Data Controller, DPO, IT Security)
   - External Stakeholders: Data subjects consultation plans (surveys, focus groups)
   - Data Processors: List any third-party processors from integration requirements

5. **Section 4: Necessity and Proportionality**:
   - Lawful Basis: Extract GDPR Article 6 basis from each entity in data model
   - Special Category Conditions: Extract GDPR Article 9 conditions from data model
   - Necessity Test: For each processing purpose, justify why it's necessary
   - Proportionality Test: Assess if data collection is proportionate to purpose
   - Data Minimization: Review against architecture principles for minimization

6. **Section 5: Risk Assessment**:
   - For EACH entity with PII/special category data, identify risks to individuals:
     - Confidentiality risks (data breach, unauthorized access)
     - Integrity risks (data corruption, inaccurate profiling)
     - Availability risks (inability to access/port data)
   - Score each risk using DPIA risk matrix:
     - **Likelihood**: Remote, Possible, Probable
     - **Severity** (impact on individuals): Minimal, Significant, Severe
     - **Overall Risk**: Low (green), Medium (amber), High (red)
   - Link to existing risks in ARC-*-RISK-*.md if they exist

7. **Section 6: Mitigations**:
   - For each high/medium risk, propose mitigations:
     - Technical: Encryption, pseudonymization, access controls (link to secure-by-design controls)
     - Organizational: Policies, training, DPIAs for suppliers
     - Procedural: Breach notification, incident response, audit trails
   - Show residual risk after mitigations
   - Extract existing security controls from ARC-*-SECD-*.md as mitigations

8. **Section 7: ICO Consultation**:
   - If any residual risks remain HIGH after mitigations, flag for ICO prior consultation:
     ```
     ⚠️  ICO Prior Consultation Required:
     - Risk DPIA-003 (Unauthorized profiling of children) remains HIGH after mitigations
     - Contact ICO before processing: https://ico.org.uk/make-a-complaint/your-personal-information-concerns/
     ```

9. **Section 8: Sign-off and Approval**:
   - Leave signature fields blank (to be signed by Data Controller, DPO, Senior Responsible Owner)

10. **Section 9: Review and Monitoring**:
    - Set review triggers: 12 months, major system changes, data breaches, ICO guidance updates

11. **Section 10: Traceability**:
    - Link to all source artifacts (ARC-*-DATA-*.md, ARC-*-REQ-*.md, ARC-*-STKE-*.md, ARC-000-PRIN-*.md, ARC-*-RISK-*.md)
    - List all DPIA risks with unique IDs (DPIA-001, DPIA-002, etc.)

12. **Section 11: Data Subject Rights**:
    - For each GDPR right (SAR, rectification, erasure, portability, objection, restriction, automated decision-making):
      - Check if data model has implementation mechanism
      - If YES, describe how it's implemented
      - If NO, flag as a risk and recommend implementation

13. **Section 12: International Transfers**:
    - Check if data model shows any international destinations
    - If YES, identify safeguards (SCCs, BCRs, adequacy decisions)
    - If NO safeguards, flag as HIGH risk

14. **Section 13: Children's Data**:
    - If children identified in stakeholders, generate detailed assessment:
      - Age verification mechanisms
      - Parental consent
      - Child-friendly privacy notices
      - Best interests assessment

15. **Section 14: AI/Algorithmic Processing**:
    - If AI/ML detected in requirements, integrate with ai-playbook assessment:
      - Algorithmic bias risks
      - Explainability/transparency
      - Human oversight
      - Link to ATRS record if it exists

16. **Section 15: Summary and Action Plan**:
    - Summary table: Total risks, high/medium/low breakdown, key mitigations, ICO consultation needed?
    - Action plan: List all recommendations with owners and deadlines

Write the complete DPIA document to:

```
projects/{project_id}/ARC-{PROJECT_ID}-DPIA-v1.0.md
```

### Step 6: Risk Register Integration (Optional)

Ask the user:

```
📊 DPIA generated with [N] risks identified.

Would you like to add DPIA risks to the project risk register?
This will create/update: projects/{project_id}/ARC-*-RISK-*.md

[Y/N]
```

If YES:
1. Read `projects/{project_id}/ARC-*-RISK-*.md` (or create from template if it doesn't exist)
2. Add each DPIA risk as a new entry with:
   - Risk ID: DPIA-001, DPIA-002, etc.
   - Category: "Data Protection"
   - Source: "DPIA Assessment"
   - Link back to DPIA document
3. Update the risk register file

### Step 7: Summary Output

**IMPORTANT**: Do NOT output the full DPIA document to the chat (it's too large). Instead, show a concise summary:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ DPIA Generated Successfully
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 Document: projects/{project_id}/ARC-{PROJECT_ID}-DPIA-v{VERSION}.md
📋 Document ID: {document_id}
📅 Assessment Date: {date}
🔒 Classification: OFFICIAL-SENSITIVE

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Assessment Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**ICO Screening**: {N}/9 criteria met → DPIA REQUIRED

**Processing Overview**:
- Data Subjects: {list data subject categories}
- Personal Data: {N} entities with PII
- Special Category Data: {YES/NO} ({categories if yes})
- Lawful Basis: {primary Article 6 basis}
- Retention Period: {typical retention}

**Risk Assessment**:
- Total Risks Identified: {N}
  - 🔴 High: {N} (requires immediate action)
  - 🟠 Medium: {N} (requires mitigation)
  - 🟢 Low: {N} (accepted)

**Key Risks**:
1. DPIA-001: {risk description} - {severity}
2. DPIA-002: {risk description} - {severity}
3. DPIA-003: {risk description} - {severity}

**Mitigations Proposed**: {N} technical, organizational, and procedural controls

**ICO Prior Consultation**: {REQUIRED / NOT REQUIRED}
{If required: List residual high risks that trigger consultation}

**Data Subject Rights**:
- ✅ Implemented: {list rights with mechanisms}
- ❌ Not Implemented: {list rights needing implementation}

**Next Steps**:
1. Review and approve DPIA (Data Controller, DPO, SRO signatures)
2. {If ICO consultation needed: Contact ICO before processing}
3. Implement recommended mitigations
4. Establish 12-month review cycle
5. {If children's data: Implement age verification and parental consent}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔗 Traceability
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Source Artifacts**:
- ✅ Data Model: projects/{project_id}/ARC-*-DATA-*.md
- ✅ Requirements: projects/{project_id}/ARC-*-REQ-*.md
- ✅ Stakeholders: projects/{project_id}/ARC-*-STKE-*.md
- ✅ Architecture Principles: projects/000-global/ARC-000-PRIN-*.md

**Related Artifacts**:
- Risk Register: projects/{project_id}/ARC-*-RISK-*.md ({added/updated})
- Secure by Design: projects/{project_id}/ARC-*-SECD-*.md
- {If AI: AI Playbook: projects/{project_id}/ARC-*-AIPB-*.md}
- {If AI: ATRS: projects/{project_id}/ARC-*-ATRS-*.md}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 References
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- UK GDPR Article 35: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/accountability-and-governance/data-protection-impact-assessments-dpias/
- ICO DPIA Guidance: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/accountability-and-governance/data-protection-impact-assessments-dpias/what-is-a-dpia/
- ICO Prior Consultation: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/accountability-and-governance/data-protection-impact-assessments-dpias/do-we-need-to-consult-the-ico/

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Important Notes

1. **Legal Requirement**: A DPIA is **mandatory** under UK GDPR Article 35 when processing is likely to result in high risk to individuals. Failure to conduct a DPIA when required can result in ICO enforcement action.

2. **Use Write Tool**: DPIAs are large documents (typically 3,000-10,000 words). You MUST use the Write tool to create the file. Do NOT output the full DPIA in the chat.

3. **Risk Assessment Focus**: DPIA risks focus on **impact on individuals** (privacy harm, discrimination, physical harm, financial loss, reputational damage), NOT organizational risks. This is different from the risk register.

4. **Screening is Critical**: Always perform the ICO 9-criteria screening first. If the screening shows DPIA not required, don't generate a full DPIA unless the user explicitly requests it.

5. **Data Model Dependency**: A DPIA cannot be generated without a data model. The data model is the source of truth for what personal data is being processed.

6. **Bidirectional Risk Links**: DPIA risks should be added to the risk register (with "Data Protection" category), and existing privacy risks in the risk register should be referenced in the DPIA.

7. **Mitigation Sources**: Extract security controls from the Secure by Design assessment as DPIA mitigations. This creates traceability from risks → mitigations → security controls.

8. **ICO Consultation Threshold**: If ANY residual risk remains HIGH after mitigations, ICO prior consultation is required before processing can begin.

9. **Children's Data**: If processing children's data, the DPIA must include additional assessment of age verification, parental consent, best interests, and child-friendly privacy notices.

10. **AI/ML Systems**: If the system uses AI/ML for profiling, automated decision-making, or algorithmic processing, integrate with `/arckit.ai-playbook` assessment and link to ATRS record.

11. **Classification**: DPIAs contain sensitive information about data protection risks and vulnerabilities. Always classify as **OFFICIAL-SENSITIVE** at minimum.

12. **Review Cycle**: DPIAs must be reviewed regularly (recommended: 12 months) and updated when:
    - New processing activities are added
    - Data protection risks change
    - ICO guidance is updated
    - A data breach occurs

## Success Criteria

- ✅ DPIA document created at `projects/{project_id}/ARC-{PROJECT_ID}-DPIA-v1.0.md`
- ✅ ICO 9-criteria screening performed and documented
- ✅ All personal data and special category data from data model included
- ✅ Processing purposes extracted from requirements
- ✅ Data subjects and vulnerable groups identified from stakeholders
- ✅ Risk assessment completed with likelihood, severity, and overall risk scores
- ✅ Mitigations proposed for all high and medium risks
- ✅ ICO prior consultation flagged if residual high risks remain
- ✅ Data subject rights implementation assessed (SAR, deletion, portability, etc.)
- ✅ International transfer safeguards identified if applicable
- ✅ Children's data assessment completed if applicable
- ✅ AI/algorithmic processing assessment completed if applicable
- ✅ Traceability links to data model, requirements, stakeholders, principles, risk register
- ✅ Summary output shows key metrics, risks, and next steps
- ✅ Document classified as OFFICIAL-SENSITIVE
- ✅ 12-month review cycle established

## Example Usage

```
/arckit.dpia Generate DPIA for NHS appointment booking system

/arckit.dpia Create data protection impact assessment for HMRC chatbot handling taxpayer queries

/arckit.dpia Assess DPIA necessity for Windows 11 deployment (employee data only)
```
