# Data Protection Impact Assessment (DPIA) Guide

A comprehensive guide to generating Data Protection Impact Assessments for UK GDPR Article 35 compliance using ArcKit.

---

## What is a DPIA?

A Data Protection Impact Assessment (DPIA) is a systematic process to identify and minimize data protection risks for processing that is likely to result in a high risk to individuals' rights and freedoms. It's a **legal requirement** under UK GDPR Article 35.

### Why DPIAs Matter

Without a DPIA when required:
- ❌ **ICO Enforcement Action** - Fines and regulatory sanctions
- ❌ **Legal Non-Compliance** - Breach of UK GDPR Article 35
- ❌ **Privacy Risks Unidentified** - Data breaches, discrimination, harm to individuals
- ❌ **No ICO Consultation** - Processing starts with high residual risks
- ❌ **Reputational Damage** - Public trust eroded by privacy incidents

With a comprehensive DPIA:
- ✅ **Legal Compliance** - Meets UK GDPR Article 35 requirements
- ✅ **Privacy by Design** - Risks identified and mitigated before processing
- ✅ **ICO Accountability** - Demonstrates due diligence to regulators
- ✅ **Stakeholder Confidence** - Transparent privacy risk management
- ✅ **Reduced Liability** - Mitigations in place to prevent data breaches

---

## When to Create a DPIA

Run `/arckit.dpia` **after data model, before technology research**:

```
5. /arckit.requirements      ← Define data requirements (DR-xxx)
6. /arckit.data-model        ← Identify PII and special category data
7. /arckit.dpia              ← ASSESS PRIVACY RISKS (START HERE)
8. /arckit.research          ← Technology selection (informed by DPIA)
9. /arckit.sow               ← Vendor procurement
```

**CRITICAL**: You **must** run `/arckit.data-model` first because the DPIA needs:
- Inventory of personal data and special category data
- Data subjects (users, customers, employees, children)
- GDPR Article 6 lawful basis for each entity
- GDPR Article 9 conditions for special category data
- Data retention periods and flows

---

## When is a DPIA Required?

### ICO's 9 Screening Criteria

A DPIA is **MANDATORY** if **2 or more** of these criteria are met:

| # | Criterion | Examples |
|---|-----------|----------|
| 1 | **Evaluation or scoring** | Credit scoring, profiling, algorithmic ranking |
| 2 | **Automated decision-making with legal/significant effect** | Loan approvals, recruitment screening, benefits eligibility |
| 3 | **Systematic monitoring** | CCTV, location tracking, behavioral analytics |
| 4 | **Sensitive data** (special category) | Health records, ethnicity, biometrics, criminal records |
| 5 | **Large scale processing** | >5,000 data subjects, national scope, "all citizens" |
| 6 | **Matching or combining datasets** | Data linkage, cross-referencing databases |
| 7 | **Vulnerable data subjects** | Children, elderly, disabled, refugees, patients |
| 8 | **Innovative technology** | AI/ML, blockchain, facial recognition, new tech |
| 9 | **Prevents data subjects from exercising rights** | No SAR mechanism, no deletion, no portability |

**ArcKit automatically scores these criteria** based on your data model and requirements.

---

## Creating a DPIA with ArcKit

### Step 1: Ensure Prerequisites Exist

```bash
# MANDATORY - DPIA needs data model
ls projects/NNN-project-name/data-model.md

# RECOMMENDED - Better results with these artifacts
ls .arckit/memory/architecture-principles.md
ls projects/NNN-project-name/requirements.md
ls projects/NNN-project-name/stakeholder-drivers.md
```

### Step 2: Run DPIA Command

```bash
/arckit.dpia Generate DPIA for [your project]
```

**Examples**:
```bash
/arckit.dpia Generate DPIA for NHS appointment booking system

/arckit.dpia Create data protection impact assessment for HMRC chatbot handling taxpayer queries

/arckit.dpia Assess DPIA necessity for patient records management system
```

### Step 3: Review the Output

ArcKit creates `projects/NNN-project-name/dpia.md` containing:

1. **ICO 9-Criteria Screening** - Automated necessity determination
2. **Description of Processing** - Purposes, scope, data categories, flows
3. **Consultation** - Stakeholders, data subjects, processors
4. **Necessity and Proportionality** - Lawful basis, data minimization
5. **Risk Assessment** - Impact on individuals (privacy harm, discrimination)
6. **Mitigations** - Technical, organizational, procedural controls
7. **ICO Prior Consultation** - Flagged if high residual risks remain
8. **Sign-off and Approval** - Data Controller, DPO, SRO signatures
9. **Review and Monitoring** - 12-month cycle, review triggers
10. **Traceability** - Links to data model, requirements, stakeholders, principles
11. **Data Subject Rights** - SAR, deletion, portability implementation
12. **International Transfers** - Cross-border safeguards (SCCs, BCRs)
13. **Children's Data** - Age verification, parental consent, best interests
14. **AI/Algorithmic Processing** - Bias, transparency, human oversight
15. **Summary and Action Plan** - Risk breakdown, recommendations

---

## ICO 9-Criteria Automated Screening

ArcKit automatically evaluates each criterion:

### Example Screening Output

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 DPIA Screening Results (ICO 9 Criteria)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[X] Criterion 4: Sensitive data
    ✓ Special category data found: Health, Ethnicity
    ✓ Evidence: Patient entity contains diagnosis, medication, treatment_history

[X] Criterion 7: Vulnerable subjects
    ✓ Children identified in stakeholders (age 0-18)
    ✓ Evidence: Pediatric patients in scope

[ ] Criterion 1: Evaluation/scoring
    ✗ Not detected in requirements

[ ] Criterion 2: Automated decision-making
    ✗ No automated decisions with legal effect

[X] Criterion 8: Innovative technology
    ✓ AI/ML detected: Appointment recommendation engine
    ✓ Evidence: FR-025 "ML model predicts optimal appointment times"

**Screening Score**: 3/9 criteria met
**Decision**: ✅ DPIA REQUIRED under UK GDPR Article 35

Proceeding to generate full DPIA...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Risk Assessment Methodology

DPIAs assess **impact on individuals**, not organizational risk.

### Risk Matrix (Likelihood × Severity)

| Likelihood | Minimal Impact | Significant Impact | Severe Impact |
|------------|----------------|-------------------|---------------|
| **Remote** (unlikely to occur) | 🟢 Low | 🟢 Low | 🟠 Medium |
| **Possible** (might occur) | 🟢 Low | 🟠 Medium | 🔴 High |
| **Probable** (will likely occur) | 🟠 Medium | 🔴 High | 🔴 High |

### Severity Levels (Impact on Individuals)

**Minimal Impact**:
- Minor inconvenience or annoyance
- No lasting effect on individuals
- Example: Temporary inability to access non-critical data

**Significant Impact**:
- Financial loss, discrimination, reputational damage
- Psychological distress, anxiety
- Example: Unauthorized disclosure of employment history

**Severe Impact**:
- Serious physical harm, identity theft
- Serious psychological trauma
- Example: Leak of health data, children's data breach

### Example Risk Assessment

```markdown
## Risk Assessment

### DPIA-001: Unauthorized Access to Patient Health Records

**Risk Description**: Database breach exposing patient diagnoses, medications, and treatment history

**Likelihood**: Possible
- External threat actors targeting healthcare data
- High-value data for medical identity theft

**Severity**: Severe
- Patient embarrassment, discrimination by employers/insurers
- Medical identity theft enabling fraudulent prescriptions
- Psychological trauma from sensitive diagnosis disclosure

**Overall Risk**: 🔴 **HIGH** (Possible × Severe)

**Mitigations**:
1. **Technical**: AES-256 encryption at rest, TLS 1.3 in transit
2. **Technical**: Role-based access control (RBAC) with least privilege
3. **Organizational**: Annual penetration testing, security audits
4. **Procedural**: Breach notification plan (ICO within 72 hours)

**Residual Risk**: 🟠 **MEDIUM** (Remote × Severe)
- Likelihood reduced to Remote after encryption + access controls
- Severity remains Severe (nature of health data)

**ICO Prior Consultation**: Not required (residual risk is Medium)
```

---

## Auto-Population from Data Model

ArcKit extracts key information from your data model:

### Personal Data Inventory

From data-model.md:
```markdown
| Entity | PII Fields | Special Category | GDPR Basis | Retention |
|--------|------------|------------------|------------|-----------|
| Patient | name, email, phone, address | health_records, ethnicity | Article 9(2)(h) - Healthcare | 8 years post-treatment |
| Appointment | appointment_notes | health_context | Article 9(2)(h) - Healthcare | 8 years |
| User | email, phone | None | Article 6(1)(b) - Contract | Account lifetime + 2 years |
```

### Data Flows

From data-model.md integration mapping:
```markdown
**Upstream Sources**:
- NHS Spine (patient demographics via HL7 FHIR)
- GP Clinical Systems (referrals via GP Connect)

**Downstream Consumers**:
- Analytics Platform (anonymized appointment metrics)
- Billing System (patient ID, appointment date - no diagnosis)
```

### Data Subjects

From stakeholder-drivers.md:
```markdown
**Data Subjects**:
- Patients (adults 18-100, children 0-18)
- Parents/Guardians (for child appointments)
- Healthcare Professionals (GPs, consultants, nurses)
```

---

## Data Subject Rights Implementation

ArcKit assesses implementation for each GDPR right:

### Example Rights Assessment

```markdown
## Data Subject Rights Implementation

| Right | Implementation Status | Mechanism |
|-------|----------------------|-----------|
| **SAR (Right of Access)** | ✅ Implemented | Self-service portal at /my-data, 30-day response SLA |
| **Right to Rectification** | ✅ Implemented | Edit profile page, update propagates to downstream systems |
| **Right to Erasure** | ⚠️ Partial | Soft delete (anonymization), 8-year retention for medical records (legal obligation) |
| **Right to Data Portability** | ✅ Implemented | Export to JSON/CSV via /export-data endpoint |
| **Right to Object** | ⚠️ Not Implemented | **ACTION REQUIRED**: Add opt-out for marketing communications |
| **Right to Restrict Processing** | ❌ Not Implemented | **ACTION REQUIRED**: Add "freeze account" feature |
| **Rights re Automated Decision-Making** | N/A | No automated decisions with legal/significant effect |
```

**Risks Identified**:
- DPIA-007: No mechanism to object to marketing (Medium risk)
- DPIA-008: No processing restriction capability (Medium risk)

---

## Children's Data Assessment

If processing children's data, ArcKit generates detailed assessment:

### Example Children's Data Section

```markdown
## Children's Data Processing

**Children in Scope**: YES
- Age range: 0-18 years (pediatric patients)
- Volume: ~2,000 child appointments per month

### Age Verification
- **Method**: Date of birth collected at registration
- **Validation**: Must be under 18 to access pediatric services

### Parental Consent
- ✅ **Implemented**: Parent/guardian creates account for child under 13
- ✅ **Verification**: Parent email verified, photo ID uploaded
- ⚠️ **Gap**: No ongoing consent mechanism for 13-16 year olds (Gillick competence)

### Best Interests Assessment
- Processing necessary for healthcare provision (Article 9(2)(h))
- Child-friendly privacy notice with visual explanations
- Minimal data collection (only clinical necessities)

### Child-Specific Risks
- **DPIA-009**: Risk of parent accessing child's sensitive health data (13-16 age group)
  - **Mitigation**: Age 13+ portal allows child to restrict parent access to diagnosis details
  - **Residual Risk**: 🟢 Low

### Recommendations
1. Implement Gillick competence assessment for 13-16 year olds
2. Annual review of child-friendly privacy notice with children's focus groups
3. Enhanced security for child records (additional audit logging)
```

---

## AI/ML Algorithmic Processing

For AI/ML systems, ArcKit assesses algorithmic risks:

### Example AI/ML Section

```markdown
## AI/Algorithmic Processing Assessment

**AI/ML System in Scope**: YES
- **System**: Appointment Recommendation Engine
- **Purpose**: Predict optimal appointment times based on historical patterns
- **Requirements**: FR-025, FR-026, NFR-P-005

### Algorithmic Bias Assessment

**Protected Characteristics**:
- Ethnicity (special category data in patient record)
- Age (children vs adults)
- Disability (appointment accessibility needs)

**Bias Risks**:
- **DPIA-012**: Algorithm may prioritize majority ethnicity patients if training data skewed
  - **Evidence**: 85% of historical appointments are White British patients
  - **Impact**: Minority patients get suboptimal appointment times (discrimination)
  - **Likelihood**: Possible
  - **Severity**: Significant
  - **Risk Level**: 🔴 HIGH

**Mitigations**:
1. Balanced training data across ethnicities (oversample minorities)
2. Fairness metrics in model evaluation (demographic parity)
3. Explainability: SHAP values for each recommendation
4. Human oversight: Clinician can override algorithm recommendations
5. Monthly bias audits (track appointment quality by ethnicity)

**Residual Risk**: 🟠 MEDIUM (bias monitoring ongoing)

### Explainability and Transparency
- Model type: Gradient Boosted Trees (interpretable)
- Explanations: Top 3 factors shown for each recommendation
- Privacy notice: Clear explanation of algorithmic decision-making
- Link to ATRS: See `atrs-record.md` for full transparency documentation

### Human Oversight
- Clinician must approve each algorithm-suggested appointment
- Override rate tracked (>20% triggers model retraining)
- Complaints process for patients dissatisfied with appointment times
```

---

## ICO Prior Consultation

If any residual risk is **HIGH** after mitigations, ICO prior consultation is required **before processing can begin**.

### When ICO Consultation is Triggered

```markdown
## ICO Prior Consultation Assessment

**Consultation Required**: ⚠️ YES

**High Residual Risks**:
1. **DPIA-012**: Algorithmic bias in appointment recommendations
   - Residual Risk: 🟠 MEDIUM (downgraded from HIGH after mitigations)
   - **UPDATE**: No longer requires ICO consultation

2. **DPIA-015**: Cross-border transfer to US cloud provider (pre-Brexit adequacy decision)
   - Residual Risk: 🔴 HIGH (no adequacy decision, SCCs alone insufficient for healthcare data)
   - **Requires ICO Consultation**: Yes

**Next Steps**:
1. Prepare ICO consultation submission:
   - Complete DPIA document
   - Evidence of mitigations implemented
   - Justification for why risk cannot be further reduced
2. Submit to ICO via online form: https://ico.org.uk/make-a-complaint/data-protection-complaints/prior-consultation/
3. **DO NOT begin processing until ICO responds** (28 days, extendable to 3 months)
```

---

## Integration with Risk Register

DPIAs feed risks into the project risk register:

### Bidirectional Risk Links

**From DPIA to Risk Register**:
```markdown
# projects/NNN-project-name/risk-register.md

| Risk ID | Category | Description | Source | Likelihood | Impact |
|---------|----------|-------------|--------|------------|--------|
| DPIA-001 | Data Protection | Unauthorized access to patient health records | DPIA Assessment | Possible | Severe |
| DPIA-007 | Data Protection | No mechanism to object to marketing | DPIA Rights Assessment | Possible | Significant |
| DPIA-012 | Data Protection | Algorithmic bias in appointment recommendations | DPIA AI/ML Assessment | Possible | Significant |
```

**From Risk Register to DPIA**:
```markdown
# projects/NNN-project-name/dpia.md

## Existing Risks from Risk Register

The project risk register already identified the following data protection risks:

- **RISK-025**: GDPR compliance for health data (referenced as DPIA-001)
- **RISK-032**: Third-party processor security (now assessed as DPIA-018)
```

---

## Integration with Secure by Design

DPIA mitigations link to security controls:

```markdown
## Mitigation Traceability

| DPIA Risk | Mitigation | Security Control Source |
|-----------|------------|-------------------------|
| DPIA-001 | AES-256 encryption at rest | SEC-CTRL-015 (secure-by-design-assessment.md) |
| DPIA-001 | Role-based access control | SEC-CTRL-022 (secure-by-design-assessment.md) |
| DPIA-012 | Bias monitoring dashboard | SEC-CTRL-089 (ai-playbook-assessment.md) |
| DPIA-018 | Third-party processor contracts | PROC-CTRL-005 (procurement/vendor-assessment.md) |
```

This ensures:
- Security controls are justified by privacy risks
- No orphaned mitigations (each linked to specific risk)
- Complete traceability for audits

---

## Review and Monitoring

DPIAs are living documents, not one-time exercises.

### Review Triggers

Review and update the DPIA when:
- **Time-based**: Every 12 months (mandatory)
- **System changes**: New features, data sources, AI models
- **Data breach**: Any breach affecting data subjects
- **ICO guidance**: New ICO DPIA guidance published
- **Risk changes**: New risks identified, risk likelihood/severity changes
- **Regulation changes**: UK GDPR amendments, new data protection laws

### Review Process

```markdown
## Next Review Date: 2026-05-15

**Review Checklist**:
- [ ] Re-run ICO 9-criteria screening (has scope changed?)
- [ ] Review all DPIA risks (any new risks? likelihood/severity changes?)
- [ ] Verify mitigations still effective (penetration test results? audit findings?)
- [ ] Check data subject rights implementation (any gaps?)
- [ ] Update data inventory (new PII? new data subjects?)
- [ ] Review international transfers (adequacy decisions changed?)
- [ ] Check AI/ML bias metrics (algorithmic fairness maintained?)
- [ ] Update signatures (Data Controller, DPO, SRO sign-off)

**Version Control**:
- Current Version: 1.0 (2025-05-15)
- Previous Versions: docs/archive/dpia-v0.9-2025-04-01.md
```

---

## Best Practices

### 1. Early DPIA Generation
Run the DPIA **before technology selection and procurement**. If the DPIA identifies high risks, you may need different technology or vendors.

❌ **BAD**: Select vendor → Build system → Run DPIA → Discover unmitigable risks → Re-architect
✅ **GOOD**: Run DPIA → Identify risks → Select vendors with appropriate controls → Build system

### 2. Involve the DPO
Your Data Protection Officer (DPO) should review and sign off on every DPIA.

```bash
# After generating DPIA, send to DPO for review
/arckit.dpia Generate DPIA for payment system
# → Review output with DPO
# → Incorporate DPO feedback
# → Get DPO signature in Section 8
```

### 3. Consult Data Subjects
For high-risk processing, consult with data subjects (or their representatives) during DPIA:

**Examples**:
- **Healthcare**: Patient focus groups to discuss appointment data sharing
- **Children**: Consult parents, children's advocates, school representatives
- **AI systems**: User surveys on algorithmic decision-making

Document consultation in DPIA Section 3.

### 4. Link to Other Assessments
DPIAs should reference:
- **AI Playbook**: For AI/ML systems (algorithmic bias, transparency)
- **ATRS**: For algorithmic transparency records
- **Secure by Design**: For technical security controls as mitigations
- **Service Assessment**: GDS Point 5 requires DPIA evidence

### 5. Classify as OFFICIAL-SENSITIVE
DPIAs contain sensitive information about security vulnerabilities and data protection risks. Always classify as **OFFICIAL-SENSITIVE** at minimum.

### 6. Risk Focus: Individuals, Not Organization
DPIA risks focus on **impact on individuals**, not organizational risk.

❌ **WRONG**: "Risk of £10M fine from ICO" (organizational financial risk)
✅ **RIGHT**: "Risk of patient discrimination by insurers if health data leaked" (impact on individuals)

---

## Common Issues

### Issue 1: DPIA Generated Before Data Model

**Error**:
```
❌ Data model not found.

A DPIA requires a data model to identify:
- Personal data and special category data being processed
- Data subjects and vulnerable groups
- Processing purposes and lawful basis

Please run: /arckit.data-model Create data model for [project name]
```

**Solution**: Create data model first, then run DPIA.

### Issue 2: No Special Category Data but DPIA Thinks There Is

**Issue**: DPIA screening flags Criterion 4 (sensitive data) when there's no special category data.

**Cause**: Data model may have ambiguous entity names (e.g., "UserProfile" with "ethnicity" field not marked as special category).

**Solution**: Review data-model.md and ensure special category data is explicitly marked:
```markdown
| Attribute | Type | Special Category | GDPR Article 9 Condition |
|-----------|------|------------------|--------------------------|
| ethnicity | ENUM | YES | 9(2)(j) - Public interest research |
```

### Issue 3: DPIA Says "Not Required" But You Think It Should Be

**Issue**: ICO screening shows 0-1 criteria met, DPIA says not required, but you're processing sensitive data.

**Cause**: Data model may not capture special category data (it's implied in text descriptions but not in entity attributes).

**Solution**: Update data-model.md to explicitly list PII and special category data as attributes.

### Issue 4: Too Many Risks Identified (50+ risks)

**Issue**: DPIA generates 50+ risks, making it unmanageable.

**Cause**: ArcKit generates fine-grained risks for each entity and data flow.

**Solution**: Consolidate related risks:
- Group risks by entity (e.g., all Patient entity risks → DPIA-001)
- Group risks by threat (e.g., all unauthorized access risks → DPIA-010)
- Focus on top 10 HIGH/MEDIUM risks for detailed assessment

### Issue 5: ICO Prior Consultation Required But Timeline Tight

**Issue**: DPIA identifies HIGH residual risks requiring ICO consultation, but project launch is in 4 weeks (ICO can take 3 months).

**Solution**:
1. **Enhance mitigations** to reduce residual risk to MEDIUM (no ICO consultation needed)
2. **De-scope high-risk processing** for initial launch (add later after ICO consultation)
3. **Start ICO consultation early** (during Alpha, not Beta)

---

## ArcKit Workflow Integration

### Before DPIA

1. **`/arckit.principles`** - Establish Privacy by Design principles
2. **`/arckit.stakeholders`** - Identify data subjects (especially vulnerable groups)
3. **`/arckit.requirements`** - Define data requirements (DR-xxx)
4. **`/arckit.data-model`** - Inventory PII, special category data, lawful basis

### After DPIA

1. **`/arckit.risk`** - Add DPIA risks to risk register
2. **`/arckit.research`** - Technology selection informed by DPIA mitigations
3. **`/arckit.sow`** - Vendor RFP includes data protection requirements from DPIA
4. **`/arckit.secure`** - Security controls implement DPIA mitigations
5. **`/arckit.service-assessment`** - GDS Point 5 evidence includes DPIA

---

## UK GDPR Legal Context

### UK GDPR Article 35: Data Protection Impact Assessments

**Full Text** (key excerpts):

> **Article 35(1)**: Where a type of processing is likely to result in a high risk to the rights and freedoms of natural persons, the controller shall, prior to the processing, carry out an assessment of the impact of the envisaged processing operations on the protection of personal data.

> **Article 35(3)**: A data protection impact assessment shall in particular be required in the case of:
> - (a) systematic and extensive evaluation of personal aspects...including profiling;
> - (b) processing on a large scale of special categories of data...or of personal data relating to criminal convictions;
> - (c) systematic monitoring of publicly accessible areas on a large scale.

**Penalties for Non-Compliance**:
- **Article 83(4)**: Up to £8.7 million or 2% of global annual turnover (whichever is higher)

### ICO Guidance

**Primary Source**: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/accountability-and-governance/data-protection-impact-assessments-dpias/

**Key ICO Requirements**:
1. **Mandatory when 2+ ICO criteria met** (screening checklist)
2. **Consult DPO** throughout DPIA process
3. **Consult data subjects** where appropriate
4. **Prior consultation with ICO** if residual risk is HIGH
5. **Keep DPIAs under review** (update when processing changes)

---

## Reference Links

- **UK GDPR Article 35**: https://www.legislation.gov.uk/uksi/2019/419/article/35
- **ICO DPIA Guidance**: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/accountability-and-governance/data-protection-impact-assessments-dpias/
- **ICO DPIA Template**: https://ico.org.uk/media/for-organisations/documents/2553993/dpia-template.docx
- **ICO Prior Consultation**: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/accountability-and-governance/data-protection-impact-assessments-dpias/do-we-need-to-consult-the-ico/
- **ICO 9 Screening Criteria**: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/accountability-and-governance/data-protection-impact-assessments-dpias/what-is-a-dpia/

---

## Summary Checklist

Before running `/arckit.dpia`:
- [ ] Data model exists (`projects/NNN/data-model.md`)
- [ ] PII and special category data identified in data model
- [ ] GDPR Article 6 lawful basis documented for each entity
- [ ] Architecture principles include Privacy by Design

After generating DPIA:
- [ ] ICO 9-criteria screening reviewed (is DPIA required?)
- [ ] All HIGH and MEDIUM risks have mitigations
- [ ] No HIGH residual risks (or ICO prior consultation planned)
- [ ] Data subject rights implementation gaps addressed
- [ ] DPO has reviewed and signed off
- [ ] DPIA risks added to risk register
- [ ] DPIA mitigations linked to security controls
- [ ] 12-month review cycle scheduled
- [ ] Document classified as OFFICIAL-SENSITIVE

**DPIAs are not optional**. If UK GDPR Article 35 requires a DPIA, you **must** conduct one before processing begins. Use ArcKit to generate a comprehensive, audit-ready DPIA that demonstrates ICO accountability.
