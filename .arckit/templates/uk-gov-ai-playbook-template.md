# UK Government AI Playbook Assessment

> **Template Status**: Alpha | **Version**: [VERSION] | **Command**: `/arckit.ai-playbook`

## Document Control

| Field | Value |
|-------|-------|
| **Document ID** | ARC-[PROJECT_ID]-AIPB-v[VERSION] |
| **Document Type** | UK Government AI Playbook Assessment |
| **Project** | [PROJECT_NAME] (Project [PROJECT_ID]) |
| **Classification** | [PUBLIC / OFFICIAL / OFFICIAL-SENSITIVE / SECRET] |
| **Status** | [DRAFT / IN_REVIEW / APPROVED / PUBLISHED / SUPERSEDED / ARCHIVED] |
| **Version** | [VERSION] |
| **Created Date** | [YYYY-MM-DD] |
| **Last Modified** | [YYYY-MM-DD] |
| **Review Cycle** | [Monthly / Quarterly / Annual / On-Demand] |
| **Next Review Date** | [YYYY-MM-DD] |
| **Owner** | [OWNER_NAME_AND_ROLE] |
| **Reviewed By** | [REVIEWER_NAME] ([YYYY-MM-DD]) or PENDING |
| **Approved By** | [APPROVER_NAME] ([YYYY-MM-DD]) or PENDING |
| **Distribution** | [DISTRIBUTION_LIST] |
| **Department/Agency** | [Department] |
| **AI System** | [Name/Description of AI System] |
| **Assessor** | [Name/Role] |
| **Risk Level** | [High-Risk / Medium-Risk / Low-Risk] |

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [DATE] | ArcKit AI | Initial creation from `/arckit.ai-playbook` command | PENDING | PENDING |

---

## Executive Summary

**Overall Compliance**: [Score/10] principles compliant

**Risk Assessment**:
- [ ] HIGH-RISK (fully automated decisions affecting rights, safety, health)
- [ ] MEDIUM-RISK (significant impact with human oversight)
- [ ] LOW-RISK (productivity tools, administrative tasks)

**Status**:
- ✅ COMPLIANT (9-10 principles met)
- ⚠️ PARTIALLY COMPLIANT (7-8 principles met)
- ❌ NON-COMPLIANT (< 7 principles met)

**Critical Issues**: [Number] blocking issues
**Go/No-Go Decision**: [ ] APPROVED / [ ] APPROVED WITH CONDITIONS / [ ] REJECTED

---

## AI System Overview

### What is the AI System?

**System Name**: [Name]

**Purpose**: [What problem does it solve?]

**Type of AI**:
- [ ] Generative AI (e.g., Large Language Models, image generation)
- [ ] Predictive AI (e.g., risk scoring, forecasting)
- [ ] Computer Vision (e.g., image recognition, object detection)
- [ ] Natural Language Processing (e.g., sentiment analysis, translation)
- [ ] Recommendation System
- [ ] Robotic Process Automation with AI
- [ ] Other: [Specify]

**Use Case**:
[Describe how the AI will be used in government operations]

**Users**:
- Internal users: [Who in government uses it?]
- External users: [Citizens, businesses affected?]
- Affected population: [Who is impacted by decisions?]

**Decision Authority**:
- [ ] AI makes recommendations, humans decide
- [ ] AI makes decisions with human review
- [ ] AI makes autonomous decisions (HIGH-RISK - justify carefully)

---

## The 10 Core Principles Assessment

### 1. Understanding AI

**Principle**: Organizations must comprehend what AI is, its capabilities, and limitations.

**Compliance Status**: [ ] COMPLIANT / [ ] PARTIAL / [ ] NON-COMPLIANT

**Evidence**:
- [ ] Team understands AI is not sentient or reasoning
- [ ] AI limitations documented (hallucinations, biases, edge cases)
- [ ] Use cases appropriate for AI capabilities
- [ ] Realistic expectations set with stakeholders
- [ ] Technical constraints understood (data quality, compute, latency)

**AI Limitations Documented**:
| Limitation | Impact | Mitigation |
|------------|--------|------------|
| [e.g., Hallucinations in LLM] | [May generate false information] | [Human review of all outputs] |
| [e.g., Bias in training data] | [May discriminate against groups] | [Fairness testing, bias mitigation] |

**Findings**:
[Describe team's understanding of AI capabilities and limitations]

**Gaps**:
[List misunderstandings or unrealistic expectations]

**Score**: ___/10

---

### 2. Lawful and Ethical Use

**Principle**: AI deployment must comply with legal requirements and ethical standards.

**Compliance Status**: [ ] COMPLIANT / [ ] PARTIAL / [ ] NON-COMPLIANT

**Evidence**:
- [ ] Legal review completed (data protection, equality, human rights)
- [ ] Data Protection Impact Assessment (DPIA) completed
- [ ] Equality Impact Assessment (EqIA) completed
- [ ] Human Rights assessment completed
- [ ] UK GDPR compliance verified
- [ ] Equality Act 2010 compliance verified
- [ ] Public Sector Equality Duty considered
- [ ] Data Ethics Framework applied
- [ ] Early engagement with legal/compliance teams

**Legal and Ethical Checks**:
| Check | Status | Issues Found | Resolution |
|-------|--------|--------------|------------|
| DPIA | ✅ / 🔄 / ❌ | [Issues] | [Actions] |
| EqIA | ✅ / 🔄 / ❌ | [Issues] | [Actions] |
| Human Rights | ✅ / 🔄 / ❌ | [Issues] | [Actions] |
| UK GDPR | ✅ / 🔄 / ❌ | [Issues] | [Actions] |
| Equality Act | ✅ / 🔄 / ❌ | [Issues] | [Actions] |

**Data Protection**:
- Legal basis for processing: [Consent / Legitimate Interest / Public Task / etc.]
- Special category data: [ ] Yes / [ ] No (if yes, justify)
- Data retention period: [X months/years]
- Right to object: [ ] Enabled / [ ] Not applicable

**Findings**:
[Describe legal and ethical compliance]

**Gaps**:
[List legal or ethical risks]

**Score**: ___/10

---

### 3. Security

**Principle**: Systems must be secure and resilient to cyber attacks, including AI-specific threats.

**Compliance Status**: [ ] COMPLIANT / [ ] PARTIAL / [ ] NON-COMPLIANT

**Evidence**:
- [ ] Cyber security assessment completed
- [ ] NCSC guidance followed
- [ ] AI-specific threats assessed (prompt injection, data poisoning, model theft)
- [ ] Security controls implemented
- [ ] Penetration testing completed
- [ ] Red teaming conducted (for high-risk AI)
- [ ] Incident response plan includes AI-specific scenarios
- [ ] Supply chain security verified (third-party AI services)

**AI-Specific Security Threats**:
| Threat | Risk Level | Mitigation |
|--------|------------|------------|
| Prompt Injection | [H/M/L] | [Input sanitization, content filtering] |
| Data Poisoning | [H/M/L] | [Data validation, anomaly detection] |
| Model Theft | [H/M/L] | [Access controls, API rate limiting] |
| Adversarial Attacks | [H/M/L] | [Robustness testing, input validation] |
| Model Inversion | [H/M/L] | [Differential privacy, access controls] |

**Security Controls**:
- [ ] Input validation and sanitization
- [ ] Output content filtering (for generative AI)
- [ ] Rate limiting on API endpoints
- [ ] Access controls (RBAC/ABAC)
- [ ] Audit logging of all AI interactions
- [ ] Encryption at rest and in transit
- [ ] Secure model storage and versioning
- [ ] Regular security updates and patching

**Findings**:
[Describe security implementation]

**Gaps**:
[List security vulnerabilities]

**Score**: ___/10

---

### 4. Human Control

**Principle**: Meaningful human oversight must exist at appropriate stages.

**Compliance Status**: [ ] COMPLIANT / [ ] PARTIAL / [ ] NON-COMPLIANT

**Evidence**:
- [ ] Human-in-the-loop design implemented
- [ ] Decision points require human approval
- [ ] Override capability exists for humans
- [ ] Escalation process documented
- [ ] Human review frequency defined
- [ ] Staff training on AI system limitations
- [ ] Clear responsibilities assigned

**Human Oversight Model**:
- [ ] **Human-in-the-loop**: Human reviews EVERY decision before implementation
- [ ] **Human-on-the-loop**: Human reviews decisions periodically/randomly
- [ ] **Human-in-command**: Human can override AI decisions at any time
- [ ] **Fully automated**: AI acts autonomously (HIGH-RISK - justify!)

**Human Review Requirements**:
| Decision Type | Review Requirement | Reviewer Role | Escalation Path |
|---------------|-------------------|---------------|-----------------|
| [High-impact decisions] | Every decision | [Senior officer] | [SRO] |
| [Medium-impact] | Random sample (10%) | [Team lead] | [Senior officer] |
| [Low-impact] | Audit trail only | [Automated monitoring] | [Team lead] |

**For High-Risk AI** (affecting health, safety, fundamental rights):
- [ ] MUST have human-in-the-loop (review every decision)
- [ ] Humans trained on AI limitations and biases
- [ ] Override process tested and documented
- [ ] Decision rationale explainable to affected persons

**Findings**:
[Describe human oversight mechanisms]

**Gaps**:
[List areas lacking sufficient human control]

**Score**: ___/10

---

### 5. Lifecycle Management

**Principle**: Understand complete product lifecycle from selection to decommissioning.

**Compliance Status**: [ ] COMPLIANT / [ ] PARTIAL / [ ] NON-COMPLIANT

**Evidence**:
- [ ] Lifecycle plan documented
- [ ] Supplier selection criteria defined
- [ ] Contract includes performance metrics and SLAs
- [ ] Model versioning and change management
- [ ] Monitoring and performance tracking
- [ ] Retraining schedule defined
- [ ] Model drift detection implemented
- [ ] Decommissioning plan (data deletion, model retirement)
- [ ] Handover documentation prepared

**Lifecycle Stages**:

**1. Selection and Procurement**:
- [ ] Requirements defined (see ARC-{PROJECT_ID}-REQ-v*.md)
- [ ] Build vs buy decision documented
- [ ] Supplier evaluation completed (see ARC-*-EVAL-*.md)
- [ ] Contract includes AI-specific terms (performance, bias, retraining)

**2. Development and Testing**:
- [ ] Training data provenance documented
- [ ] Bias testing completed
- [ ] Performance benchmarks established
- [ ] User acceptance testing (UAT) with real users
- [ ] Accessibility testing completed

**3. Deployment**:
- [ ] Phased rollout plan (pilot, beta, full deployment)
- [ ] Monitoring dashboards configured
- [ ] Alert thresholds defined
- [ ] Incident response procedures ready

**4. Operation and Maintenance**:
- [ ] Ongoing performance monitoring
- [ ] Model drift detection (monthly checks)
- [ ] Retraining schedule (e.g., quarterly with new data)
- [ ] User feedback collection mechanism
- [ ] Regular fairness and bias audits

**5. Decommissioning**:
- [ ] Data deletion procedure defined
- [ ] Model archive or deletion
- [ ] User notification plan
- [ ] Alternative process for affected users
- [ ] Lessons learned documentation

**Model Monitoring Metrics**:
| Metric | Baseline | Threshold | Current | Action if Exceeded |
|--------|----------|-----------|---------|-------------------|
| Accuracy | [%] | [%] | [%] | [Retrain model] |
| False Positive Rate | [%] | [%] | [%] | [Tune threshold] |
| Fairness (demographic parity) | [±%] | [±%] | [±%] | [Bias mitigation] |
| Latency | [ms] | [ms] | [ms] | [Scale infrastructure] |

**Findings**:
[Describe lifecycle management approach]

**Gaps**:
[List missing lifecycle processes]

**Score**: ___/10

---

### 6. Right Tool Selection

**Principle**: AI should only be deployed when it genuinely solves problems better than alternatives.

**Compliance Status**: [ ] COMPLIANT / [ ] PARTIAL / [ ] NON-COMPLIANT

**Evidence**:
- [ ] Problem clearly defined
- [ ] Alternative solutions considered (non-AI, simpler AI)
- [ ] Cost-benefit analysis completed
- [ ] AI adds genuine value over alternatives
- [ ] Use case appropriate for AI (not using AI for sake of it)
- [ ] Success metrics defined
- [ ] Pilot/proof-of-concept completed

**Alternatives Considered**:
| Solution | Pros | Cons | Why Not Chosen |
|----------|------|------|----------------|
| Manual process | [Accurate] | [Slow, expensive] | [Cannot scale to demand] |
| Rule-based system | [Explainable] | [Inflexible] | [Too many edge cases] |
| Simple ML (not AI) | [Faster] | [Less accurate] | [Accuracy critical for use case] |
| AI (selected) | [Accurate, scalable] | [Less explainable, bias risk] | [Best fit with mitigation] |

**Use Case Appropriateness**:
- [ ] Problem is well-suited to AI capabilities
- [ ] Sufficient quality training data available
- [ ] Success can be measured objectively
- [ ] Acceptable trade-offs (e.g., explainability vs accuracy)
- [ ] NOT using AI just because it's trendy

**Inappropriate Use Cases to Avoid**:
- [ ] Fully automated decisions on life-changing matters (without justification)
- [ ] High-stakes decisions with insufficient training data
- [ ] Use cases requiring 100% accuracy where AI can't achieve it
- [ ] Situations where simpler solutions are adequate

**Success Metrics**:
| Metric | Baseline | Target | Current | Status |
|--------|----------|--------|---------|--------|
| [Accuracy] | [%] | [%] | [%] | ✅ / ⚠️ / ❌ |
| [Processing time] | [X hours] | [X minutes] | [X minutes] | ✅ / ⚠️ / ❌ |
| [Cost per transaction] | [£X] | [£Y] | [£Z] | ✅ / ⚠️ / ❌ |
| [User satisfaction] | [X/10] | [Y/10] | [Z/10] | ✅ / ⚠️ / ❌ |

**Findings**:
[Describe rationale for AI selection]

**Gaps**:
[List concerns about appropriateness]

**Score**: ___/10

---

### 7. Collaboration

**Principle**: Engage across government and with external stakeholders.

**Compliance Status**: [ ] COMPLIANT / [ ] PARTIAL / [ ] NON-COMPLIANT

**Evidence**:
- [ ] Cross-government collaboration (GDS, CDDO, AI Standards Hub)
- [ ] Academia partnerships
- [ ] Industry engagement
- [ ] Civil society consultation
- [ ] User community involvement
- [ ] Sharing lessons learned
- [ ] Contributing to government AI community

**Collaboration Activities**:
| Stakeholder | Engagement Type | Purpose | Outcome |
|-------------|-----------------|---------|---------|
| [GDS] | [Workshop] | [Best practices] | [Adopted design patterns] |
| [University X] | [Research partnership] | [Bias mitigation] | [Improved fairness metrics] |
| [Civil society org] | [Consultation] | [Rights impact] | [Enhanced safeguards] |
| [Other dept] | [Knowledge sharing] | [Similar use case] | [Reused components] |

**Knowledge Sharing**:
- [ ] Documented lessons learned
- [ ] Presented at cross-government forums
- [ ] Published case studies (where appropriate)
- [ ] Contributed to reusable components

**Findings**:
[Describe collaboration efforts]

**Gaps**:
[List missed collaboration opportunities]

**Score**: ___/10

---

### 8. Commercial Partnership

**Principle**: Early engagement with commercial colleagues on responsible AI expectations.

**Compliance Status**: [ ] COMPLIANT / [ ] PARTIAL / [ ] NON-COMPLIANT

**Evidence**:
- [ ] Procurement team engaged early
- [ ] AI requirements in contract (performance, explainability, bias)
- [ ] Supplier responsible AI commitments documented
- [ ] Audit rights included in contract
- [ ] Data rights and ownership clear
- [ ] Exit strategy defined (data portability, model ownership)
- [ ] Performance metrics and SLAs
- [ ] Liability and indemnity clauses for AI failures

**Contract Requirements for AI**:
- [ ] **Performance metrics**: Accuracy, latency, uptime SLAs
- [ ] **Explainability**: Supplier must explain how AI works
- [ ] **Bias audits**: Regular fairness testing required
- [ ] **Retraining**: Frequency and process for model updates
- [ ] **Data rights**: Government owns training data and outputs
- [ ] **Audit rights**: Government can audit AI system
- [ ] **Security**: Cyber security standards compliance
- [ ] **Liability**: Clear accountability for AI failures
- [ ] **Exit**: Data portability, model handover, decommissioning

**Supplier Responsible AI Commitments**:
| Commitment | Contractual? | Verification Method |
|------------|--------------|---------------------|
| [Bias testing quarterly] | ✅ Yes | [Audit reports] |
| [Explainability documentation] | ✅ Yes | [Technical docs] |
| [Data security standards] | ✅ Yes | [Cyber Essentials Plus cert] |
| [Human oversight capability] | ✅ Yes | [Override mechanism tested] |

**Findings**:
[Describe commercial partnership approach]

**Gaps**:
[List missing contract terms or supplier commitments]

**Score**: ___/10

---

### 9. Skills and Expertise

**Principle**: Teams need appropriate technical, ethical, and domain expertise.

**Compliance Status**: [ ] COMPLIANT / [ ] PARTIAL / [ ] NON-COMPLIANT

**Evidence**:
- [ ] AI/ML technical expertise on team
- [ ] Data science capability
- [ ] Ethical AI expertise or access
- [ ] Domain expertise (understanding of problem domain)
- [ ] User research capability
- [ ] Legal/compliance expertise
- [ ] Cyber security expertise
- [ ] Training provided to all team members

**Team Composition**:
| Role | Filled? | Name/Team | Expertise Level |
|------|---------|-----------|-----------------|
| AI/ML Specialist | ✅ / ❌ | [Name] | [Junior/Mid/Senior] |
| Data Scientist | ✅ / ❌ | [Name] | [Junior/Mid/Senior] |
| Ethics Advisor | ✅ / ❌ | [Name] | [Junior/Mid/Senior] |
| Domain Expert | ✅ / ❌ | [Name] | [Junior/Mid/Senior] |
| User Researcher | ✅ / ❌ | [Name] | [Junior/Mid/Senior] |
| Legal/Compliance | ✅ / ❌ | [Name] | [Junior/Mid/Senior] |
| Security Specialist | ✅ / ❌ | [Name] | [Junior/Mid/Senior] |
| Product Manager | ✅ / ❌ | [Name] | [Junior/Mid/Senior] |

**Training Provided**:
- [ ] AI fundamentals for all team members
- [ ] Ethical AI considerations
- [ ] Bias recognition and mitigation
- [ ] AI system limitations
- [ ] User research with AI systems
- [ ] Incident response for AI failures

**Findings**:
[Describe team capabilities]

**Gaps**:
[List missing skills or expertise]

**Score**: ___/10

---

### 10. Organizational Alignment

**Principle**: AI use must align with organizational policies, governance, and assurance.

**Compliance Status**: [ ] COMPLIANT / [ ] PARTIAL / [ ] NON-COMPLIANT

**Evidence**:
- [ ] AI governance board approval obtained
- [ ] AI strategy alignment documented
- [ ] Organizational AI principles followed
- [ ] Risk management process followed
- [ ] Assurance team engaged throughout
- [ ] Escalation process defined and followed
- [ ] Senior Responsible Owner (SRO) assigned
- [ ] Regular governance reviews scheduled

**Governance Structure**:
- **AI Governance Board**: [Name of board]
- **Senior Responsible Owner**: [Name, title]
- **Product Owner**: [Name, title]
- **Assurance Lead**: [Name, title]

**Governance Checkpoints**:
| Phase | Review Required | Status | Date | Outcome |
|-------|-----------------|--------|------|---------|
| Concept | AI Governance Board | ✅ / 🔄 / ⏳ | [Date] | [Approved/Conditions] |
| Design | Technical Review | ✅ / 🔄 / ⏳ | [Date] | [Approved/Conditions] |
| Pre-Deployment | Security & Ethics Review | ✅ / 🔄 / ⏳ | [Date] | [Approved/Conditions] |
| Post-Deployment | Performance Review | ✅ / 🔄 / ⏳ | [Date] | [Approved/Conditions] |

**Organizational AI Principles** (if defined):
- [ ] Aligns with department's AI principles
- [ ] Aligns with cross-government AI principles
- [ ] No conflicts with organizational values

**Findings**:
[Describe organizational alignment]

**Gaps**:
[List governance or alignment issues]

**Score**: ___/10

---

## Six Ethical Themes Assessment

### 1. Safety, Security, and Robustness

**Compliance Status**: [ ] COMPLIANT / [ ] PARTIAL / [ ] NON-COMPLIANT

**Evidence**:
- [ ] Safety testing completed (no harmful outputs)
- [ ] Robustness testing (handles edge cases)
- [ ] Security controls implemented (see Principle 3)
- [ ] Fail-safe mechanisms in place
- [ ] Incident response plan tested

**Safety Measures**:
| Risk | Safeguard | Testing | Status |
|------|-----------|---------|--------|
| [Harmful content generation] | [Content filtering] | [Red team testing] | ✅ / ⚠️ / ❌ |
| [Biased outcomes] | [Fairness testing] | [Demographic analysis] | ✅ / ⚠️ / ❌ |
| [System failures] | [Graceful degradation] | [Chaos engineering] | ✅ / ⚠️ / ❌ |

**Score**: ___/10

---

### 2. Transparency and Explainability

**Compliance Status**: [ ] COMPLIANT / [ ] PARTIAL / [ ] NON-COMPLIANT

**Evidence**:
- [ ] Algorithmic Transparency Recording Standard (ATRS) completed
- [ ] System documented publicly (where appropriate)
- [ ] Decision explanations available to affected persons
- [ ] Model card or factsheet published
- [ ] Privacy notice includes AI use

**ATRS Compliance**:
- **ATRS URL**: [Link to published ATRS entry]
- **Publication Date**: [Date]
- **Last Updated**: [Date]

**Explainability Level**:
- [ ] **Full explainability**: Can explain why each decision was made
- [ ] **Partial explainability**: Can explain general logic, not individual decisions
- [ ] **Black box**: Cannot explain decisions (must justify if high-risk)

**Public Communication**:
- [ ] Citizens informed AI is being used
- [ ] How to request human review explained
- [ ] Complaint mechanism published

**Score**: ___/10

---

### 3. Fairness, Bias, and Discrimination

**Compliance Status**: [ ] COMPLIANT / [ ] PARTIAL / [ ] NON-COMPLIANT

**Evidence**:
- [ ] Bias assessment completed
- [ ] Training data reviewed for bias
- [ ] Fairness metrics calculated
- [ ] Protected characteristics analysis
- [ ] Bias mitigation techniques applied
- [ ] Ongoing monitoring for bias drift

**Fairness Testing**:
| Protected Characteristic | Metric | Baseline | Threshold | Current | Status |
|-------------------------|--------|----------|-----------|---------|--------|
| Gender | Demographic parity | ±5% | ±10% | [%] | ✅ / ⚠️ / ❌ |
| Ethnicity | Equal opportunity | ±5% | ±10% | [%] | ✅ / ⚠️ / ❌ |
| Age | Equalized odds | ±5% | ±10% | [%] | ✅ / ⚠️ / ❌ |
| Disability | Calibration | ±5% | ±10% | [%] | ✅ / ⚠️ / ❌ |

**Bias Mitigation**:
- [ ] Diverse training data sourced
- [ ] Data augmentation for underrepresented groups
- [ ] Algorithmic fairness techniques applied
- [ ] Regular fairness audits scheduled

**Score**: ___/10

---

### 4. Accountability and Responsibility

**Compliance Status**: [ ] COMPLIANT / [ ] PARTIAL / [ ] NON-COMPLIANT

**Evidence**:
- [ ] Clear ownership assigned (SRO, Product Owner)
- [ ] Decision-making process documented
- [ ] Audit trail of all AI decisions
- [ ] Incident response procedures
- [ ] Accountability for errors defined

**Accountability Structure**:
- **Senior Responsible Owner**: [Name] - Strategic oversight
- **Product Owner**: [Name] - Day-to-day operation
- **Technical Lead**: [Name] - Technical implementation
- **Ethics Lead**: [Name] - Ethical oversight

**Incident Response**:
- [ ] Process for reporting AI errors
- [ ] Root cause analysis procedure
- [ ] Corrective action tracking
- [ ] Learning and improvement loop

**Score**: ___/10

---

### 5. Contestability and Redress

**Compliance Status**: [ ] COMPLIANT / [ ] PARTIAL / [ ] NON-COMPLIANT

**Evidence**:
- [ ] Right to contest AI decisions enabled
- [ ] Human review process for contested decisions
- [ ] Appeal mechanism documented and accessible
- [ ] Redress process for those harmed
- [ ] Response times defined (e.g., 28 days)

**Contestability Process**:
1. **How users can contest**: [Email form, online portal, phone]
2. **Information required**: [What users must provide]
3. **Review timeline**: [X working days]
4. **Human reviewer**: [Role/team]
5. **Appeal if unsatisfied**: [Next level escalation]
6. **Redress options**: [Correction, compensation, apology]

**Testing**:
- [ ] Contestability process tested with real users
- [ ] Response times meet targets
- [ ] Users satisfied with process

**Score**: ___/10

---

### 6. Societal Wellbeing and Public Good

**Compliance Status**: [ ] COMPLIANT / [ ] PARTIAL / [ ] NON-COMPLIANT

**Evidence**:
- [ ] Positive societal impact assessment
- [ ] Environmental impact considered (carbon footprint of AI)
- [ ] Benefits distributed fairly across society
- [ ] Negative impacts mitigated
- [ ] Alignment with public values

**Societal Impact**:
| Impact | Positive/Negative | Magnitude | Mitigation/Enhancement |
|--------|-------------------|-----------|------------------------|
| [Improved service access] | Positive | High | [Proactively promote to underserved] |
| [Job displacement] | Negative | Medium | [Reskilling programs, redeployment] |
| [Environmental (compute)] | Negative | Low | [Efficient models, renewable energy] |

**Public Good**:
- [ ] Solves real problem for citizens
- [ ] Accessible to all (not just tech-savvy)
- [ ] Maintains human dignity and autonomy
- [ ] Strengthens democratic values

**Score**: ___/10

---

## Overall Assessment Summary

### Compliance Scorecard

| Assessment Area | Score /10 | Status |
|-----------------|-----------|--------|
| **10 Core Principles** | | |
| 1. Understanding AI | __ | ✅ / ⚠️ / ❌ |
| 2. Lawful and Ethical Use | __ | ✅ / ⚠️ / ❌ |
| 3. Security | __ | ✅ / ⚠️ / ❌ |
| 4. Human Control | __ | ✅ / ⚠️ / ❌ |
| 5. Lifecycle Management | __ | ✅ / ⚠️ / ❌ |
| 6. Right Tool Selection | __ | ✅ / ⚠️ / ❌ |
| 7. Collaboration | __ | ✅ / ⚠️ / ❌ |
| 8. Commercial Partnership | __ | ✅ / ⚠️ / ❌ |
| 9. Skills and Expertise | __ | ✅ / ⚠️ / ❌ |
| 10. Organizational Alignment | __ | ✅ / ⚠️ / ❌ |
| **Principles Subtotal** | **__/100** | |
| | | |
| **6 Ethical Themes** | | |
| 1. Safety, Security, Robustness | __ | ✅ / ⚠️ / ❌ |
| 2. Transparency, Explainability | __ | ✅ / ⚠️ / ❌ |
| 3. Fairness, Bias, Discrimination | __ | ✅ / ⚠️ / ❌ |
| 4. Accountability, Responsibility | __ | ✅ / ⚠️ / ❌ |
| 5. Contestability, Redress | __ | ✅ / ⚠️ / ❌ |
| 6. Societal Wellbeing, Public Good | __ | ✅ / ⚠️ / ❌ |
| **Ethics Subtotal** | **__/60** | |
| | | |
| **TOTAL SCORE** | **__/160** | |

**Percentage Score**: ___%

### Compliance Levels

- **90-100%** (144-160 points): Excellent - Exemplary responsible AI
- **75-89%** (120-143 points): Good - Compliant with minor improvements needed
- **60-74%** (96-119 points): Adequate - Significant gaps to address
- **< 60%** (< 96 points): Poor - Major compliance issues

### Risk-Based Decision

**For HIGH-RISK AI** (fully automated decisions affecting rights/safety/health):
- [ ] MUST score ≥ 90% to proceed
- [ ] ALL principles must be met (no ❌ allowed)
- [ ] Human-in-the-loop REQUIRED
- [ ] ATRS publication MANDATORY
- [ ] Regular audits (quarterly minimum)

**For MEDIUM-RISK AI**:
- [ ] SHOULD score ≥ 75% to proceed
- [ ] Critical principles must be met (2, 3, 4)
- [ ] Human oversight required
- [ ] Annual audits

**For LOW-RISK AI**:
- [ ] SHOULD score ≥ 60% to proceed
- [ ] Basic safeguards in place
- [ ] Periodic review (annual)

### Critical Issues (Blocking)

1. [Issue description]
2. [Issue description]
3. [Issue description]

### Recommendations

#### High Priority (Address before deployment)

1. [Recommendation]
2. [Recommendation]

#### Medium Priority (Address within 3 months)

1. [Recommendation]
2. [Recommendation]

#### Low Priority (Continuous improvement)

1. [Recommendation]
2. [Recommendation]

---

## Action Plan

| Action | Principle/Theme | Owner | Due Date | Status |
|--------|----------------|-------|----------|--------|
| [Action item] | [Principle #] | [Name] | [Date] | 🔄 / ⏳ / ✅ |

---

## Mandatory Documentation

### Required Assessments (attach or link)

- [ ] **ATRS** (Algorithmic Transparency Recording Standard): [Link]
- [ ] **DPIA** (Data Protection Impact Assessment): [Link]
- [ ] **EqIA** (Equality Impact Assessment): [Link]
- [ ] **Human Rights Assessment**: [Link]
- [ ] **Security Risk Assessment**: [Link]
- [ ] **Bias Audit Report**: [Link]
- [ ] **User Research Report**: [Link]

### Governance Approvals

- [ ] AI Governance Board approval: [Date]
- [ ] Senior Responsible Owner sign-off: [Date]
- [ ] Legal review: [Date]
- [ ] Security review: [Date]
- [ ] Ethics review: [Date]

---

## Go/No-Go Decision

**Decision**: [ ] APPROVED / [ ] APPROVED WITH CONDITIONS / [ ] REJECTED

**Conditions for Approval** (if applicable):
1. [Condition 1]
2. [Condition 2]
3. [Condition 3]

**Deployment Approval**: [ ] Yes / [ ] No

**Ongoing Monitoring Required**:
- [ ] Weekly performance reviews (first month)
- [ ] Monthly bias audits
- [ ] Quarterly governance reviews
- [ ] Annual comprehensive reassessment

---

## Sign-Off

**Assessed By**: [Name, Role]
**Date**: [Date]

**Senior Responsible Owner**:
Name: ________________
Date: ________________
Signature: ________________

**AI Governance Board Chair**:
Name: ________________
Date: ________________
Signature: ________________

---

## Review Schedule

**Next Review**: [Date]
**Review Frequency**:
- [ ] Monthly (high-risk)
- [ ] Quarterly (medium-risk)
- [ ] Annually (low-risk)

---

**Template Version**: 1.0
**Last Updated**: 2025-10-14
**Source**: https://www.gov.uk/government/publications/ai-playbook-for-the-uk-government

## External References

| Document | Type | Source | Key Extractions | Path |
|----------|------|--------|-----------------|------|
| *None provided* | — | — | — | — |

---

**Generated by**: ArcKit `/arckit.ai-playbook` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]

