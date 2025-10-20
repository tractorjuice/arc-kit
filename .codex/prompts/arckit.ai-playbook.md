---
description: Assess UK Government AI Playbook compliance for responsible AI deployment
---

You are helping a UK government organization assess compliance with the UK Government AI Playbook for responsible AI deployment.

## User Input

```text
$ARGUMENTS
```

## Instructions

1. **Identify AI system context**:
   - AI system name and purpose
   - Type of AI (Generative, Predictive, Computer Vision, NLP, etc.)
   - Use case in government operations
   - Users (internal staff, citizens, affected population)
   - Decision authority level

2. **Determine risk level**:

**HIGH-RISK AI** (requires strictest oversight):
- Fully automated decisions affecting:
  - Health and safety
  - Fundamental rights
  - Access to services
  - Legal status
  - Employment
  - Financial circumstances
- Examples: Benefit eligibility, immigration decisions, medical diagnosis, predictive policing

**MEDIUM-RISK AI** (significant impact with human oversight):
- Semi-automated decisions with human review
- Significant resource allocation
- Examples: Case prioritization, fraud detection scoring, resource allocation

**LOW-RISK AI** (productivity/administrative):
- Recommendation systems with human control
- Administrative automation
- Examples: Email categorization, meeting scheduling, document summarization

3. **Read relevant project documents**:
   - Read `.arckit/memory/architecture-principles.md` (if exists)
   - Read `projects/{project-dir}/requirements.md` (if exists)
   - Read `.arckit/templates/uk-gov-ai-playbook-template.md` for assessment structure

4. **Assess the 10 Core Principles**:

### Principle 1: Understanding AI
- Team understands AI limitations (no reasoning, contextual awareness)
- Realistic expectations (hallucinations, biases, edge cases)
- Appropriate use case for AI capabilities

### Principle 2: Lawful and Ethical Use
- **CRITICAL**: DPIA, EqIA, Human Rights assessment completed
- UK GDPR compliance
- Equality Act 2010 compliance
- Data Ethics Framework applied
- Legal/compliance team engaged early

### Principle 3: Security
- Cyber security assessment (NCSC guidance)
- AI-specific threats assessed:
  - Prompt injection
  - Data poisoning
  - Model theft
  - Adversarial attacks
  - Model inversion
- Security controls implemented
- Red teaming conducted (for high-risk)

### Principle 4: Human Control
- **CRITICAL for HIGH-RISK**: Human-in-the-loop required
- Human override capability
- Escalation process documented
- Staff trained on AI limitations
- Clear responsibilities assigned

**Human Oversight Models**:
- **Human-in-the-loop**: Review EVERY decision (required for high-risk)
- **Human-on-the-loop**: Periodic/random review
- **Human-in-command**: Can override at any time
- **Fully automated**: AI acts autonomously (HIGH-RISK - justify!)

### Principle 5: Lifecycle Management
- Lifecycle plan documented (selection → decommissioning)
- Model versioning and change management
- Monitoring and performance tracking
- Model drift detection
- Retraining schedule
- Decommissioning plan

### Principle 6: Right Tool Selection
- Problem clearly defined
- Alternatives considered (non-AI, simpler solutions)
- Cost-benefit analysis
- AI adds genuine value
- Success metrics defined
- NOT using AI just because it's trendy

### Principle 7: Collaboration
- Cross-government collaboration (GDS, CDDO, AI Standards Hub)
- Academia, industry, civil society engagement
- Knowledge sharing
- Contributing to government AI community

### Principle 8: Commercial Partnership
- Procurement team engaged early
- Contract includes AI-specific terms:
  - Performance metrics and SLAs
  - Explainability requirements
  - Bias audits
  - Data rights and ownership
  - Exit strategy (data portability)
  - Liability for AI failures

### Principle 9: Skills and Expertise
- Team composition verified:
  - AI/ML technical expertise
  - Data science
  - Ethical AI expertise
  - Domain expertise
  - User research
  - Legal/compliance
  - Cyber security
- Training provided on AI fundamentals, ethics, bias

### Principle 10: Organizational Alignment
- AI Governance Board approval
- AI strategy alignment
- Senior Responsible Owner (SRO) assigned
- Assurance team engaged
- Risk management process followed

5. **Assess the 6 Ethical Themes**:

### Theme 1: Safety, Security, and Robustness
- Safety testing (no harmful outputs)
- Robustness testing (edge cases)
- Fail-safe mechanisms
- Incident response plan

### Theme 2: Transparency and Explainability
- **MANDATORY**: Algorithmic Transparency Recording Standard (ATRS) published
- System documented publicly (where appropriate)
- Decision explanations available to affected persons
- Model card/factsheet published

### Theme 3: Fairness, Bias, and Discrimination
- Bias assessment completed
- Training data reviewed for bias
- Fairness metrics calculated across protected characteristics:
  - Gender
  - Ethnicity
  - Age
  - Disability
  - Religion
  - Sexual orientation
- Bias mitigation techniques applied
- Ongoing monitoring for bias drift

### Theme 4: Accountability and Responsibility
- Clear ownership (SRO, Product Owner)
- Decision-making process documented
- Audit trail of all AI decisions
- Incident response procedures
- Accountability for errors defined

### Theme 5: Contestability and Redress
- Right to contest AI decisions enabled
- Human review process for contested decisions
- Appeal mechanism documented
- Redress process for those harmed
- Response times defined (e.g., 28 days)

### Theme 6: Societal Wellbeing and Public Good
- Positive societal impact assessment
- Environmental impact considered (carbon footprint)
- Benefits distributed fairly
- Negative impacts mitigated
- Alignment with public values

6. **Generate comprehensive assessment**:

Create detailed report with:

**Executive Summary**:
- Overall score (X/160 points, Y%)
- Risk level (High/Medium/Low)
- Compliance status (Excellent/Good/Adequate/Poor)
- Critical issues
- Go/No-Go decision

**10 Principles Assessment** (each 0-10):
- Compliance status (✅/⚠️/❌)
- Evidence gathered
- Findings
- Gaps
- Score

**6 Ethical Themes Assessment** (each 0-10):
- Compliance status
- Evidence
- Findings
- Gaps
- Score

**Risk-Based Decision**:
- **HIGH-RISK**: MUST score ≥90%, ALL principles met, human-in-the-loop REQUIRED
- **MEDIUM-RISK**: SHOULD score ≥75%, critical principles met
- **LOW-RISK**: SHOULD score ≥60%, basic safeguards in place

**Mandatory Documentation Checklist**:
- [ ] ATRS (Algorithmic Transparency Recording Standard)
- [ ] DPIA (Data Protection Impact Assessment)
- [ ] EqIA (Equality Impact Assessment)
- [ ] Human Rights Assessment
- [ ] Security Risk Assessment
- [ ] Bias Audit Report
- [ ] User Research Report

**Action Plan**:
- High priority (before deployment)
- Medium priority (within 3 months)
- Low priority (continuous improvement)

7. **Map to existing ArcKit artifacts**:

**Link to Requirements**:
- Principle 2 (Lawful) → NFR-C-xxx (GDPR compliance requirements)
- Principle 3 (Security) → NFR-S-xxx (security requirements)
- Principle 4 (Human Control) → FR-xxx (human review features)
- Theme 3 (Fairness) → NFR-E-xxx (equity/fairness requirements)

**Link to Design Reviews**:
- Check HLD addresses AI Playbook principles
- Verify DLD includes human oversight mechanisms
- Ensure security controls for AI-specific threats

**Link to TCoP**:
- AI Playbook complements TCoP
- TCoP Point 6 (Secure) aligns with Principle 3
- TCoP Point 7 (Privacy) aligns with Principle 2

8. **Provide risk-appropriate guidance**:

**For HIGH-RISK AI systems**:
- **STOP**: Do NOT deploy without meeting ALL principles
- Human-in-the-loop MANDATORY (review every decision)
- ATRS publication MANDATORY
- DPIA, EqIA, Human Rights assessments MANDATORY
- Quarterly audits REQUIRED
- AI Governance Board approval REQUIRED
- Senior leadership sign-off REQUIRED

**For MEDIUM-RISK AI**:
- Strong human oversight required
- Critical principles must be met (2, 3, 4)
- ATRS recommended
- DPIA likely required
- Annual audits

**For LOW-RISK AI**:
- Basic safeguards sufficient
- Human oversight recommended
- Periodic review (annual)
- Continuous improvement mindset

9. **Highlight mandatory requirements**:

**ATRS (Algorithmic Transparency Recording Standard)**:
- MANDATORY for central government departments
- MANDATORY for arm's length bodies
- Publish on department website
- Update when system changes significantly

**DPIAs (Data Protection Impact Assessments)**:
- MANDATORY for AI processing personal data
- Must be completed BEFORE deployment
- Must be reviewed and updated regularly

**Equality Impact Assessments (EqIA)**:
- MANDATORY to assess impact on protected characteristics
- Must document how discrimination is prevented

**Human Rights Assessments**:
- MANDATORY for decisions affecting rights
- Must consider ECHR (European Convention on Human Rights)
- Document how rights are protected

10. **Write comprehensive output**:

Output location: `projects/{project-dir}/ai-playbook-assessment.md`

Use template structure from `uk-gov-ai-playbook-template.md`

11. **Provide next steps**:

After assessment:
- Summary of compliance level
- Critical blocking issues
- Recommended actions with priorities
- Timeline for remediation
- Next review date

## Example Usage

User: `/arckit.ai-playbook Assess AI Playbook compliance for benefits eligibility chatbot using GPT-4`

You should:
- Identify system: Benefits eligibility chatbot, Generative AI (LLM)
- Determine risk: **HIGH-RISK** (affects access to benefits - fundamental right)
- Assess 10 principles:
  - 1. Understanding AI: ⚠️ PARTIAL - team aware of hallucinations, but risk of false advice
  - 2. Lawful/Ethical: ❌ NON-COMPLIANT - DPIA not yet completed (BLOCKING)
  - 3. Security: ✅ COMPLIANT - prompt injection defenses, content filtering
  - 4. Human Control: ❌ NON-COMPLIANT - fully automated advice (BLOCKING for high-risk!)
  - 5. Lifecycle: ✅ COMPLIANT - monitoring, retraining schedule defined
  - 6. Right Tool: ⚠️ PARTIAL - AI appropriate but alternatives not fully explored
  - 7. Collaboration: ✅ COMPLIANT - engaged with GDS, DWP
  - 8. Commercial: ✅ COMPLIANT - OpenAI contract includes audit rights
  - 9. Skills: ✅ COMPLIANT - multidisciplinary team
  - 10. Organizational: ✅ COMPLIANT - SRO assigned, governance in place
- Assess 6 ethical themes:
  - 1. Safety: ⚠️ PARTIAL - content filtering but some harmful outputs in testing
  - 2. Transparency: ❌ NON-COMPLIANT - ATRS not yet published (MANDATORY)
  - 3. Fairness: ⚠️ PARTIAL - bias testing started, gaps in demographic coverage
  - 4. Accountability: ✅ COMPLIANT - clear ownership, audit trail
  - 5. Contestability: ❌ NON-COMPLIANT - no human review process (BLOCKING)
  - 6. Societal: ✅ COMPLIANT - improves access to benefits advice
- Calculate score: 92/160 (58%) - **POOR, NON-COMPLIANT**
- **CRITICAL ISSUES**:
  - **BLOCKING-01**: No DPIA completed (legal requirement)
  - **BLOCKING-02**: Fully automated advice (high-risk requires human-in-the-loop)
  - **BLOCKING-03**: No ATRS published (mandatory for central government)
  - **BLOCKING-04**: No contestability mechanism (right to human review)
- **DECISION**: ❌ **REJECTED - DO NOT DEPLOY**
- **Remediation required**:
  1. Complete DPIA immediately
  2. Implement human-in-the-loop (review all advice before shown to citizens)
  3. Publish ATRS
  4. Create contestability process
  5. Re-assess after remediation
- Write to `projects/NNN-benefits-chatbot/ai-playbook-assessment.md`
- **Summary**: "HIGH-RISK AI system with 4 blocking issues. Cannot deploy until ALL principles met."

## Important Notes

- AI Playbook is **MANDATORY** guidance for all UK government AI systems
- HIGH-RISK AI cannot deploy without meeting ALL principles
- ATRS publication is MANDATORY for central government
- DPIAs are MANDATORY for AI processing personal data
- Human oversight is REQUIRED for high-risk decisions
- Non-compliance can result in legal challenges, ICO fines, public backlash
- "Move fast and break things" does NOT apply to government AI
- When in doubt, err on side of caution (add more safeguards)

## Related Frameworks

- **Technology Code of Practice** (TCoP) - broader technology governance
- **Data Ethics Framework** - responsible data use
- **Service Standard** - service design and delivery
- **NCSC Guidance** - cyber security for AI systems
- **ICO AI Guidance** - data protection and AI

## Resources

- AI Playbook: https://www.gov.uk/government/publications/ai-playbook-for-the-uk-government
- ATRS: https://www.gov.uk/government/publications/guidance-for-organisations-using-the-algorithmic-transparency-recording-standard
- Data Ethics Framework: https://www.gov.uk/government/publications/data-ethics-framework
- ICO AI Guidance: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/artificial-intelligence/
