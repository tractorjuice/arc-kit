# Algorithmic Transparency Recording Standard (ATRS) Guide

A comprehensive guide to creating Algorithmic Transparency Records for UK Government AI systems using ArcKit.

---

## What is ATRS?

The Algorithmic Transparency Recording Standard (ATRS) requires UK Government organizations to publish information about algorithmic tools that assist in significant decisions affecting individuals.

### Why ATRS Matters

**Mandatory for**:
- Algorithmic decision-making systems
- AI/ML models used in government services
- Automated processing affecting citizens
- Any algorithm assisting significant decisions about individuals

**Purpose**:
- Public transparency and accountability
- Build trust in government AI
- Enable external scrutiny
- Demonstrate responsible AI use
- GDPR Article 22 compliance

**Legal Context**:
- GDPR Article 22 (automated decision-making)
- Equality Act 2010 (no discrimination)
- Public sector transparency obligations
- Central Digital and Data Office (CDDO) guidance

---

## When to Create ATRS

```bash
/arckit.atrs Create Algorithmic Transparency Record for [your AI system]
```

**Required if your system**:
- Uses algorithms to assist decisions about individuals
- Operates in UK central government, local authorities, or public bodies
- Affects significant outcomes (benefits, services, enforcement, rights)
- Involves automated processing with human oversight

**Not required for**:
- Purely manual decision-making
- Simple rule-based systems (e.g., form validation)
- Internal IT systems not affecting citizens
- Statistical analysis without decision-making

**When to publish**:
- Before system goes live
- When algorithm changes significantly
- Annually (review and update)
- After major incidents or public concerns

---

## ATRS Contents

### 1. Organization Details

**What to include**:
- Department/organization name
- Responsible senior official
- Public contact email
- Link to organization website

**Example**:
```markdown
**Organization**: Department for Work and Pensions (DWP)
**Senior Responsible Officer**: Chief Digital and Information Officer
**Contact**: algorithmic.transparency@dwp.gov.uk
**Website**: https://www.gov.uk/government/organisations/department-for-work-and-pensions
```

---

### 2. Algorithm Details

**What to include**:
- Algorithm name
- Clear description of what it does
- Purpose and benefits
- When it was introduced
- Scope (which users/services)

**Example**:
```markdown
### Algorithm Name
Universal Credit Fraud Detection System

### Description
Machine learning model that analyzes benefit claims to identify potential fraud. The system flags high-risk claims for human investigation while automatically processing low-risk claims.

### Purpose
- Reduce fraud in Universal Credit system
- Speed up processing for legitimate claims
- Target investigation resources efficiently

### Date Introduced
October 2023

### Scope
- All new Universal Credit claims
- Approximately 50,000 claims per month
- Used by 800 fraud investigators across UK
```

---

### 3. Decision Details

**What to include**:
- What decisions are influenced
- Human involvement in decisions
- Who makes final decision
- User recourse/appeal process

**Example**:
```markdown
### Decisions Influenced
The algorithm assists fraud investigators by flagging potentially fraudulent claims for review. It does NOT make final decisions.

### Human Involvement
- **High-risk claims (15%)**: Automatically flagged for human investigation
- **Medium-risk claims (25%)**: Reviewed by supervisor
- **Low-risk claims (60%)**: Auto-approved (algorithm-assisted)

### Final Decision Maker
- Human fraud investigator for flagged claims
- Automated approval for low-risk claims (with human oversight)

### Appeal Process
All claimants can:
1. Request human review of their claim
2. Appeal decisions through standard DWP appeals process
3. Contact independent ombudsman
Response time: 5 working days for human review
```

---

### 4. Data Used

**What to include**:
- Input data sources
- Data types used
- Data quality and accuracy
- Protected characteristics processed
- Data retention period

**Example**:
```markdown
### Data Sources
1. Claimant application data (name, address, bank details)
2. HMRC income records
3. DWP historical claims database
4. Third-party identity verification (Experian)
5. Fraud case history

### Data Types
- Personal: Name, address, date of birth, NI number
- Financial: Income, bank account, employment history
- Historical: Previous claims, fraud flags
- Behavioral: Claim submission patterns

### Protected Characteristics
The system processes data that may correlate with protected characteristics:
- Age (date of birth)
- Disability status (from claim type)
- Geographic location (postcode)

**Mitigation**: Fairness constraints ensure equal treatment across protected groups.

### Data Quality
- Accuracy: 98% (verified through HMRC cross-checks)
- Completeness: 95% (some fields optional)
- Timeliness: Updated daily

### Data Retention
- Active claims: Duration of claim + 7 years
- Closed claims: 7 years (HMRC compliance)
- Training data: Anonymized after 3 years
```

---

### 5. Algorithm Type

**What to include**:
- Type of algorithm (rule-based, ML, hybrid)
- Machine learning approach (if applicable)
- Model architecture
- Training approach

**Example**:
```markdown
### Algorithm Type
Hybrid: Rule-based + Machine Learning

### Components
1. **Rule-based layer**: Hard rules for obvious fraud signals
   - Income discrepancy > £10K = auto-flag
   - Multiple claims same address = auto-flag

2. **ML layer**: Gradient Boosted Decision Tree (XGBoost)
   - 50 features derived from claim data
   - Trained on 500K historical claims (2018-2023)
   - Supervised learning (labeled fraud cases)

### Model Architecture
- Input: 50 features (numeric, categorical)
- Algorithm: XGBoost ensemble (100 trees)
- Output: Fraud probability score (0-1)
- Threshold: >0.7 = flag for investigation

### Training Approach
- Dataset: 500K historical claims (10% fraud rate)
- Train/validation/test split: 70%/15%/15%
- Cross-validation: 5-fold
- Re-trained: Quarterly with new fraud cases
```

---

### 6. Fairness and Bias

**What to include**:
- Bias analysis conducted
- Fairness metrics
- Mitigation measures
- Monitoring approach

**Example**:
```markdown
### Bias Analysis
Conducted bias analysis across protected characteristics (Equality Act 2010):

**Findings**:
- Historical data shows approval rate disparity:
  - Non-disabled: 80% approval
  - Disabled: 72% approval
- Risk: Model may learn historical bias

### Mitigation Measures
1. **Fairness Constraints**: Equal approval rates (±5%) across disability status
2. **Oversampling**: Balanced training data to reflect population
3. **Feature Auditing**: Removed proxy features for disability
4. **Regular Testing**: Monthly fairness audits

### Fairness Metrics
| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Demographic Parity | ±5% | 3% | ✅ |
| Equal Opportunity | ±5% | 4% | ✅ |
| Predictive Parity | ±5% | 2% | ✅ |

### Ongoing Monitoring
- Monthly fairness dashboard
- Alerts if metrics breach ±5% threshold
- Quarterly fairness report to senior management
```

---

### 7. Human Oversight

**What to include**:
- Human review process
- Override capability
- Escalation procedures
- Training for human reviewers

**Example**:
```markdown
### Human Review Process
**High-risk claims (score >0.7)**:
- Automatically assigned to fraud investigator
- Full manual review within 10 working days
- Investigator can override algorithm

**Medium-risk claims (score 0.4-0.7)**:
- Reviewed by team supervisor
- Spot-check 20% of flagged claims

**Low-risk claims (score <0.4)**:
- Auto-approved
- Random audit of 5%

### Override Capability
Investigators can override algorithm decisions:
- Override logged with reason
- Senior approval required for high-value claims (>£10K)
- Monthly review of override patterns

### Escalation
- Algorithm errors escalated to data science team
- Fairness concerns escalated to ethics board
- Public complaints escalated to ombudsman

### Training
All fraud investigators receive:
- 2-day training on algorithm use
- Guidance on interpreting fraud scores
- Bias awareness training
- Annual refresher courses
```

---

### 8. Performance and Impact

**What to include**:
- Accuracy metrics
- Impact on users
- Benefits realized
- Issues identified

**Example**:
```markdown
### Performance Metrics
**Accuracy**:
- Overall: 92% (target: 90%) ✅
- Precision: 85% (true positives / flagged)
- Recall: 68% (true positives / all fraud)

**Impact on Processing Time**:
- Before algorithm: 6 weeks average
- After algorithm: 3 days for low-risk (60% of claims)
- High-risk: Still 6 weeks (requires investigation)

### Benefits Realized
- **Citizens**: Faster decisions for legitimate claims
- **Staff**: Focus on complex cases, not data entry
- **Government**: Reduced fraud losses by £5M annually

### Issues Identified
1. Lower accuracy for new claimants (no history)
   - Mitigation: Human review for first-time claimants
2. Edge cases: Northern Ireland claims
   - Fix: Retrained model with NI data

### User Feedback
- Positive: 82% of users satisfied with faster processing
- Concerns: 15% concerned about algorithm accuracy
- Action: Improved user communications about human oversight
```

---

### 9. Contact Information

**What to include**:
- Public contact for questions
- Complaint process
- Freedom of Information contact

**Example**:
```markdown
### Public Contact
**Email**: algorithmic.transparency@dwp.gov.uk
**Phone**: 0800 XXX XXXX (Monday-Friday, 9am-5pm)

### Complaints
- Online: www.gov.uk/dwp/complaints
- Ombudsman: Independent Case Examiner (ICE)

### Freedom of Information
**FOI team**: foi.request@dwp.gov.uk
**ICO**: https://ico.org.uk/ (data protection concerns)
```

---

## Where ATRS is Published

**Official Hub**:
- https://www.gov.uk/government/collections/algorithmic-transparency-recording-standard-hub
- Searchable by department and algorithm type
- Publicly accessible
- Machine-readable format (JSON)

**Your Organization Website**:
- Publish prominently on department website
- Link from service pages using the algorithm
- Include in accessibility statement

**Update Frequency**:
- Review annually
- Update when algorithm changes significantly
- Update after incidents or public concerns

---

## ATRS Template

```markdown
# Algorithmic Transparency Record

## 1. Organization Details
- Organization: [Name]
- Senior Responsible Officer: [Name, Title]
- Contact: [Email]
- Website: [URL]

## 2. Algorithm Details
- Name: [Algorithm Name]
- Description: [What it does]
- Purpose: [Why it exists]
- Date Introduced: [Date]
- Scope: [Who/what it affects]

## 3. Decision Details
- Decisions Influenced: [What decisions]
- Human Involvement: [How humans are involved]
- Final Decision Maker: [Human or automated]
- Appeal Process: [How users can appeal]

## 4. Data Used
- Data Sources: [Where data comes from]
- Data Types: [What data is used]
- Protected Characteristics: [Which are processed]
- Data Quality: [Accuracy, completeness]
- Data Retention: [How long kept]

## 5. Algorithm Type
- Type: [Rule-based, ML, hybrid]
- ML Approach: [If applicable]
- Model Architecture: [Details]
- Training: [How trained]

## 6. Fairness and Bias
- Bias Analysis: [Conducted]
- Fairness Metrics: [Defined and tested]
- Mitigation: [Measures taken]
- Monitoring: [Ongoing approach]

## 7. Human Oversight
- Review Process: [How humans review]
- Override: [Can humans override?]
- Escalation: [Process for issues]
- Training: [For human reviewers]

## 8. Performance and Impact
- Accuracy: [Metrics]
- Impact: [On users]
- Benefits: [Realized]
- Issues: [Identified and fixed]

## 9. Contact
- Public Contact: [Email/phone]
- Complaints: [Process]
- FOI: [Contact]
```

---

## Integration with Other Requirements

### AI Playbook
- **Link**: [AI Playbook Guide](ai-playbook.md)
- **Overlap**: ATRS is the public transparency artifact for AI Playbook Principle 5 (Ensure Transparency)
- **Action**: Complete AI Playbook assessment before creating ATRS

### GDPR Article 22
- **Requirement**: Right to explanation for automated decision-making
- **Overlap**: ATRS provides explanation to public, Article 22 provides explanation to individuals
- **Action**: Ensure ATRS meets both public transparency and individual rights

### Technology Code of Practice (TCoP)
- **Point 1**: User needs (ATRS explains benefits to users)
- **Point 6**: Security (ATRS describes data protection)
- **Point 7**: Privacy (ATRS describes data use)
- **Link**: [TCoP Guide](technology-code-of-practice.md)

### Equality Act 2010
- **Requirement**: No discrimination based on protected characteristics
- **Overlap**: ATRS requires fairness analysis across protected characteristics
- **Action**: Conduct fairness testing before publishing ATRS

---

## ATRS Checklist

- [ ] Algorithm clearly described (name, purpose, scope)
- [ ] Human involvement in decisions explained
- [ ] Appeal/complaint process documented
- [ ] All data sources listed
- [ ] Protected characteristics identified
- [ ] Data retention policy stated
- [ ] Algorithm type and architecture described
- [ ] Bias analysis conducted and documented
- [ ] Fairness metrics defined and tested
- [ ] Mitigation measures implemented
- [ ] Human oversight process described
- [ ] Override capability documented
- [ ] Performance metrics published
- [ ] Impact on users described
- [ ] Public contact information provided
- [ ] Published on GOV.UK ATRS hub
- [ ] Linked from organization website
- [ ] Reviewed annually

---

## Common Gaps

### 1. Vague Algorithm Description
**Gap**: "Uses AI to improve efficiency"
**Fix**: "XGBoost model analyzes 50 features to predict fraud risk, flagging high-risk claims for human investigation"

### 2. No Fairness Analysis
**Gap**: "We assume the algorithm is fair"
**Fix**: Conduct bias analysis, test fairness metrics, document mitigations

### 3. Missing Human Oversight
**Gap**: "Algorithm makes decisions"
**Fix**: Document human-in-the-loop process, override capability, escalation

### 4. No User Recourse
**Gap**: "Decisions are final"
**Fix**: Provide appeal process, human review option, complaint mechanism

### 5. Technical Jargon
**Gap**: "Gradient boosted ensemble with L2 regularization"
**Fix**: "Machine learning model that learns patterns from historical fraud cases"

---

## Examples from Government

### Published ATRS Examples:
- **Home Office**: Visa decision support
- **HMRC**: Tax fraud detection
- **DWP**: Benefit claim processing
- **MOJ**: Sentencing risk assessment

**Browse**: https://www.gov.uk/government/collections/algorithmic-transparency-recording-standard-hub

---

## Support

For issues or questions:
- GitHub Issues: https://github.com/tractorjuice/arc-kit/issues
- Official ATRS: https://www.gov.uk/government/publications/algorithmic-transparency-template
- CDDO Guidance: https://www.gov.uk/government/organisations/central-digital-and-data-office
- ICO (GDPR): https://ico.org.uk/

---

**Last updated**: 2025-10-28
**ArcKit Version**: 0.3.6
