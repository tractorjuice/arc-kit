# JSP 936 AI Assurance Documentation

> **Template Status**: Experimental | **Version**: [VERSION] | **Command**: `/arckit.jsp-936`

## Document Control

| Field | Value |
|-------|-------|
| **Document ID** | ARC-[PROJECT_ID]-JSP936-v[VERSION] |
| **Document Type** | JSP 936 AI Assurance Documentation |
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

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [DATE] | ArcKit AI | Initial creation from `/arckit.jsp-936` command | PENDING | PENDING |

---

## Executive Summary

**AI System Purpose**: [2-3 sentence description of what the AI system does and why it's needed]

**Overall Risk Classification**: [Critical / Severe / Major / Moderate / Minor]

**Key AI Components**: [Number of AI/ML components identified]

**Ethical Risk Assessment**:
- **Likelihood**: [1-5 - Rare to Almost Certain]
- **Impact**: [1-5 - Insignificant to Catastrophic]
- **Risk Score**: [Likelihood × Impact = X]

**Key Findings**:
- [Summary of critical ethical considerations]
- [Summary of AI-specific security risks]
- [Summary of human-AI teaming approach]

**Approval Status**: [Not Started / In Progress / Approved / Conditional Approval]

**Critical Issues**: [Any blocking issues for approval]

---

## 1. AI System Inventory

### 1.1 AI Component Catalogue

#### AI Component 1: [Name]

**Component Details**:
- **Type**: [ML Model / AI Algorithm / Autonomous System / Decision Support / NLP / Computer Vision / Generative AI]
- **Sub-type**: [e.g., Deep Learning CNN / Random Forest / LLM / etc.]
- **Purpose**: [What problem does it solve?]
- **Criticality**: [Critical / High / Medium / Low]

**Input Data**:
- **Data Sources**: [Where does data come from?]
- **Data Types**: [Structured/Unstructured, Image/Text/Sensor, etc.]
- **Data Volume**: [Scale of data processed]
- **Data Classification**: [OFFICIAL / OFFICIAL-SENSITIVE / SECRET / TOP SECRET]

**Output/Decisions**:
- **Output Type**: [Classification / Prediction / Recommendation / Autonomous Action]
- **Decision Authority**: [Informational / Advisory / Semi-Autonomous / Fully Autonomous]
- **Impact of Output**: [What happens based on this output?]

**Human Involvement**:
- **Teaming Model**: [Human-in-loop / Human-on-loop / Human-out-of-loop]
- **Human Control Points**: [Where do humans interact?]
- **Override Capability**: [Yes / No / Partial]

**Training Data**:
- **Dataset Source**: [Where did training data come from?]
- **Dataset Size**: [Number of samples]
- **Dataset Timeframe**: [When was data collected?]
- **Labeling Method**: [Manual / Automated / Semi-automated]
- **Data Quality Assessment**: [High / Medium / Low]

**Model Details**:
- **Algorithm/Architecture**: [Specific model architecture]
- **Model Size**: [Number of parameters / Model complexity]
- **Training Method**: [Supervised / Unsupervised / Reinforcement Learning]
- **Performance Metrics**: [Accuracy, F1-score, etc.]
- **Technology Readiness Level (TRL)**: [1-9]

**Deployment Context**:
- **Deployment Environment**: [Cloud / On-premise / Edge / Operational system]
- **Operational Tempo**: [Real-time / Batch / On-demand]
- **Availability Requirements**: [24/7 / Business hours / Mission-critical]
- **User Base**: [Who uses this system?]

#### AI Component 2: [Name]
[Repeat structure above for each AI component]

### 1.2 AI System Architecture

**High-Level Architecture**:
[Diagram or description of how AI components integrate into overall system]

**Data Flow**:
[Description of data flow through AI components]

**Integration Points**:
- [Integration 1: AI component ↔ System component]
- [Integration 2: AI component ↔ Human operator]

---

## 2. Ethical Risk Assessment

### 2.1 Risk Matrix for AI Component 1: [Name]

#### Impact Assessment (Scale: 1-5)

**Human Safety and Wellbeing**: [Score 1-5]
- [Assessment rationale]
- Potential harms: [Description]

**Operational Effectiveness**: [Score 1-5]
- [Assessment rationale]
- Mission impact: [Description]

**Legal and Ethical Compliance**: [Score 1-5]
- [Assessment rationale]
- Compliance risks: [Description]

**Public Trust and Reputation**: [Score 1-5]
- [Assessment rationale]
- Reputational impact: [Description]

**International Obligations**: [Score 1-5]
- [Assessment rationale]
- International law considerations: [Description]

**Overall Impact Score**: [Highest score from above = X]

#### Likelihood Assessment (Scale: 1-5)

**Technology Maturity (TRL)**: [Score 1-5]
- Current TRL: [1-9]
- Maturity risks: [Description]

**Data Quality and Availability**: [Score 1-5]
- Data quality assessment: [Description]
- Data availability: [Description]

**Algorithm Complexity**: [Score 1-5]
- Complexity level: [High / Medium / Low]
- Complexity risks: [Description]

**Operational Environment**: [Score 1-5]
- Environment variability: [Description]
- Environmental risks: [Description]

**Human Factors and Training**: [Score 1-5]
- Training adequacy: [Description]
- Human error potential: [Description]

**Overall Likelihood Score**: [Highest score from above = Y]

#### Risk Classification

**Risk Score**: [Likelihood (Y) × Impact (X) = Z]

**Classification**: [Based on score Z]
- 20-25: **Critical** → 2PUS or Ministerial approval
- 15-19: **Severe** → Defence-Level (JROC/IAC) approval
- 10-14: **Major** → Defence-Level (JROC/IAC) approval
- 5-9: **Moderate** → TLB-Level approval (delegated)
- 1-4: **Minor** → TLB-Level approval (delegated)

**Approval Pathway**: [2PUS/Ministerial / Defence-Level / TLB-Level]

#### Unacceptable Risk Check

**Unacceptable Risk Criteria**:
- [ ] Significant negative impacts are imminent
- [ ] Severe harms are occurring
- [ ] Catastrophic risks present
- [ ] System behaving outside acceptable bounds

**Status**: [ACCEPTABLE / STOP - UNACCEPTABLE RISK]

**Justification**: [If unacceptable, explain why work cannot proceed]

### 2.2 Risk Matrix for AI Component 2: [Name]
[Repeat structure above for each AI component]

### 2.3 Overall Project Risk Classification

**Highest Individual Risk Score**: [Maximum score from all AI components]
**Overall Project Classification**: [Critical / Severe / Major / Moderate / Minor]
**Required Approval Authority**: [2PUS/Ministerial / Defence-Level / TLB-Level]

---

## 3. Five Ethical Principles Compliance

### 3.1 Principle 1: Human-Centricity

**Principle**: AI systems must respect human dignity, rights, and values. Humans must remain in control of AI systems.

#### For AI Component 1: [Name]

**Impact on People**:
- **Affected Stakeholders**: [Who is impacted by this AI?]
- **Positive Impacts**: [Benefits to humans]
- **Negative Impacts**: [Potential harms to humans]
- **Rights Considerations**: [Human rights, data rights, etc.]

**Human-AI Interaction**:
- **Interaction Model**: [Human-in-loop / Human-on-loop / Human-out-of-loop]
- **Control Mechanisms**: [How humans maintain control]
- **Override Capability**: [Yes / No / Partial - describe]
- **Transparency to Users**: [What users see/understand about AI decisions]

**Stakeholder Engagement**:
- **Stakeholders Consulted**: [List of stakeholder groups]
- **Consultation Method**: [Workshops / Surveys / Interviews]
- **Feedback Incorporated**: [How stakeholder input shaped design]
- **Ongoing Engagement Plan**: [How to maintain stakeholder involvement]

**Compliance Status**: [✅ Compliant | ⚠️ Partially Compliant | ❌ Non-Compliant]

**Evidence**: [Documentation references, design documents, user research]

**Gaps/Actions**:
- [ ] [Action 1]
- [ ] [Action 2]

#### For AI Component 2: [Name]
[Repeat structure for each AI component]

### 3.2 Principle 2: Responsibility

**Principle**: Clear accountability for AI systems throughout their lifecycle. Meaningful human control must be maintained.

#### For AI Component 1: [Name]

**Accountability Mapping**:
- **System Owner**: [Name/Role] - Overall accountability
- **RAISO (Responsible AI Senior Officer)**: [Name/Role] - AI governance
- **Ethics Manager**: [Name/Role] - Ethical oversight
- **Technical Lead**: [Name/Role] - Technical implementation
- **Operational Commander**: [Name/Role] - Operational use
- **Data Owner**: [Name/Role] - Training data governance

**Meaningful Human Control**:
- **Control Level**: [Full / Substantial / Limited / None]
- **Decision Authority**: [Human decides / Human approves / Human monitors / Fully autonomous]
- **Control Mechanisms**: [Describe how humans control AI]
- **Time to Intervene**: [Time available for human to intervene if needed]

**Decision Traceability**:
- **Decision Logging**: [Yes / No - what is logged?]
- **Audit Trail**: [Yes / No - can decisions be traced?]
- **Explainability**: [Can decisions be explained after the fact?]

**Compliance Status**: [✅ Compliant | ⚠️ Partially Compliant | ❌ Non-Compliant]

**Evidence**: [RACI matrix, governance documents, decision logs]

**Gaps/Actions**:
- [ ] [Action 1]
- [ ] [Action 2]

#### For AI Component 2: [Name]
[Repeat structure for each AI component]

### 3.3 Principle 3: Understanding

**Principle**: AI systems must be understandable, explainable, and appropriately transparent.

#### For AI Component 1: [Name]

**Explainability**:
- **Explainability Method**: [LIME / SHAP / Attention maps / Rule extraction / Other]
- **Explanation Target Audience**: [Operators / Commanders / Oversight / Public]
- **Explanation Content**: [What is explained - feature importance, decision rationale, etc.]
- **Explanation Accuracy**: [How faithful are explanations to actual model behavior?]

**Documentation**:
- **Model Card**: [Yes / No - document model details]
- **Technical Documentation**: [Architecture, training, performance]
- **Operational Documentation**: [User guides, SOPs]
- **Ethics Documentation**: [This JSP 936 assessment]

**Training Programme**:
- **Operator Training**: [Duration, content, competency assessment]
- **Commander Training**: [Understanding AI capabilities and limitations]
- **Technical Training**: [For maintainers and developers]
- **Training Completion**: [% of required personnel trained]

**Limitations Understanding**:
- **Known Limitations**: [List model limitations]
- **Failure Modes**: [How system can fail]
- **Limitation Communication**: [How limitations communicated to users]

**Compliance Status**: [✅ Compliant | ⚠️ Partially Compliant | ❌ Non-Compliant]

**Evidence**: [Model card, training materials, documentation library]

**Gaps/Actions**:
- [ ] [Action 1]
- [ ] [Action 2]

#### For AI Component 2: [Name]
[Repeat structure for each AI component]

### 3.4 Principle 4: Bias and Harm Mitigation

**Principle**: AI systems must be designed to minimise bias and prevent harm.

#### For AI Component 1: [Name]

**Bias Assessment**:
- **Bias Testing Conducted**: [Yes / No / In Progress]
- **Bias Testing Method**: [Fairness metrics, demographic parity, equal opportunity, etc.]
- **Protected Characteristics Tested**: [Age, gender, race, ethnicity, disability, etc.]
- **Bias Identified**: [Description of any bias found]
- **Bias Severity**: [High / Medium / Low / None detected]

**Bias Sources**:
- **Data Bias**: [Historical bias in training data?]
- **Algorithmic Bias**: [Algorithm inherently biased?]
- **Deployment Bias**: [Different performance in deployment vs. training?]
- **Feedback Loop Bias**: [System decisions creating biased future data?]

**Harm Identification**:
- **Potential Harms**: [List potential harms from AI system]
- **Harm Likelihood**: [For each harm: High / Medium / Low]
- **Harm Severity**: [For each harm: High / Medium / Low]
- **Vulnerable Groups**: [Groups at higher risk of harm]

**Mitigation Strategies**:
- **Data Mitigation**: [Diverse training data, bias detection in data, rebalancing]
- **Algorithmic Mitigation**: [Fairness constraints, debiasing techniques, adversarial debiasing]
- **Operational Mitigation**: [Human oversight, decision review, performance monitoring by demographic]
- **Ongoing Monitoring**: [Continuous bias monitoring in production]

**Compliance Status**: [✅ Compliant | ⚠️ Partially Compliant | ❌ Non-Compliant]

**Evidence**: [Bias test reports, fairness metrics, mitigation documentation]

**Gaps/Actions**:
- [ ] [Action 1]
- [ ] [Action 2]

#### For AI Component 2: [Name]
[Repeat structure for each AI component]

### 3.5 Principle 5: Reliability

**Principle**: AI systems must be robust, secure, and perform consistently within defined boundaries.

#### For AI Component 1: [Name]

**Performance Boundaries**:
- **Performance Metrics**: [Accuracy, precision, recall, F1, etc.]
- **Minimum Acceptable Performance**: [Threshold for each metric]
- **Current Performance**: [Measured performance]
- **Performance Variability**: [How much does performance vary?]
- **Out-of-Distribution Detection**: [How system handles novel inputs]

**Robustness**:
- **Adversarial Robustness**: [Tested against adversarial examples? Results?]
- **Environmental Robustness**: [Performance across different conditions]
- **Degradation Handling**: [How system handles degraded inputs]
- **Edge Case Handling**: [How system handles unusual inputs]

**Security**:
- **AI-Specific Threats Assessed**: [Adversarial examples, data poisoning, model extraction, model inversion]
- **Security Controls**: [Input validation, adversarial defenses, model security]
- **Penetration Testing**: [AI-specific penetration testing conducted?]
- **Security Monitoring**: [Anomaly detection, attack detection]

**Reliability Evidence**:
- **Test Coverage**: [% of operational scenarios tested]
- **Verification & Validation**: [V&V report completed?]
- **Operational Testing**: [Real-world performance data]
- **Failure Rate**: [Mean time between failures]

**Compliance Status**: [✅ Compliant | ⚠️ Partially Compliant | ❌ Non-Compliant]

**Evidence**: [Test reports, V&V documentation, security assessments]

**Gaps/Actions**:
- [ ] [Action 1]
- [ ] [Action 2]

#### For AI Component 2: [Name]
[Repeat structure for each AI component]

---

## 4. AI Lifecycle Phase Documentation

### Phase 1: Planning

**Status**: [Not Started / In Progress / Completed]

**Documentation Required**:
- [ ] AI Use Case Justification
- [ ] Alternative approaches considered (AI vs. non-AI)
- [ ] Initial ethical risk screening
- [ ] Stakeholder identification
- [ ] Resource requirements
- [ ] Success criteria

**Documentation Location**: [File path or reference]

**Key Decisions**:
- [Decision 1: Why AI is appropriate for this problem]
- [Decision 2: Initial risk classification]

**Assurance Activities**:
- [ ] Ethics Manager review
- [ ] RAISO consultation
- [ ] Stakeholder engagement plan

**Gaps/Actions**:
- [ ] [Action 1]
- [ ] [Action 2]

### Phase 2: Requirements

**Status**: [Not Started / In Progress / Completed]

**Documentation Required**:
- [ ] Functional Requirements (FR)
- [ ] Non-Functional Requirements (NFR)
- [ ] Ethical Requirements (ETH)
- [ ] Safety Requirements (SAF)
- [ ] Security Requirements (SEC)
- [ ] HAZOP analysis (Hazard and Operability Study)
- [ ] Requirements traceability matrix

**Documentation Location**: [File path or reference]

**Key Requirements**:
- [FR-01: Functional requirement example]
- [NFR-01: Performance requirement example]
- [ETH-01: Ethical requirement example]
- [SAF-01: Safety requirement example]
- [SEC-01: Security requirement example]

**Assurance Activities**:
- [ ] Requirements review with stakeholders
- [ ] HAZOP workshop conducted
- [ ] Ethics requirements validated
- [ ] Requirements completeness check

**Gaps/Actions**:
- [ ] [Action 1]
- [ ] [Action 2]

### Phase 3: Architecture

**Status**: [Not Started / In Progress / Completed]

**Documentation Required**:
- [ ] System architecture design
- [ ] AI component integration design
- [ ] Data architecture and flow
- [ ] Human-AI interaction design
- [ ] Requirements traceability to architecture
- [ ] Failure mode analysis
- [ ] Security architecture

**Documentation Location**: [File path or reference]

**Key Architectural Decisions**:
- [Decision 1: Model architecture selection and rationale]
- [Decision 2: Human-in-loop placement]
- [Decision 3: Data pipeline design]

**Assurance Activities**:
- [ ] Architecture review
- [ ] Failure mode effects analysis (FMEA)
- [ ] Security architecture review
- [ ] Human factors review

**Gaps/Actions**:
- [ ] [Action 1]
- [ ] [Action 2]

### Phase 4: Algorithm Design

**Status**: [Not Started / In Progress / Completed]

**Documentation Required**:
- [ ] Algorithm selection justification
- [ ] Alternative algorithms considered
- [ ] Algorithm limitations documented
- [ ] Bias mitigation strategy
- [ ] Explainability approach
- [ ] Verification methods defined

**Documentation Location**: [File path or reference]

**Algorithm Details**:
- **Selected Algorithm**: [e.g., Convolutional Neural Network]
- **Selection Rationale**: [Why this algorithm?]
- **Alternatives Considered**: [Other algorithms evaluated]
- **Trade-offs**: [Performance vs. explainability, etc.]

**Assurance Activities**:
- [ ] Algorithm design review
- [ ] Explainability assessment
- [ ] Bias mitigation plan review

**Gaps/Actions**:
- [ ] [Action 1]
- [ ] [Action 2]

### Phase 5: Model Development

**Status**: [Not Started / In Progress / Completed]

**Documentation Required**:
- [ ] Training data documentation
- [ ] Data preprocessing pipeline
- [ ] Model training methodology
- [ ] Model card
- [ ] Performance evaluation report
- [ ] Bias analysis report
- [ ] Hyperparameter tuning log
- [ ] Version control and model registry

**Documentation Location**: [File path or reference]

**Training Data**:
- **Dataset Name/Version**: [Name v1.0]
- **Dataset Size**: [X samples]
- **Data Collection Method**: [How collected]
- **Data Labeling**: [Manual / Automated - quality checks]
- **Data Quality**: [Assessment results]
- **Data Bias**: [Bias assessment results]

**Model Performance**:
- **Training Performance**: [Metrics on training set]
- **Validation Performance**: [Metrics on validation set]
- **Test Performance**: [Metrics on held-out test set]
- **Cross-validation Results**: [If applicable]

**Assurance Activities**:
- [ ] Training data review
- [ ] Model performance review
- [ ] Bias testing completed
- [ ] Model card review

**Gaps/Actions**:
- [ ] [Action 1]
- [ ] [Action 2]

### Phase 6: Verification & Validation (V&V)

**Status**: [Not Started / In Progress / Completed]

**Documentation Required**:
- [ ] V&V plan
- [ ] Test cases and scenarios
- [ ] V&V report
- [ ] Performance against requirements
- [ ] Robustness testing results
- [ ] Adversarial testing results
- [ ] User acceptance testing (UAT)
- [ ] Independent V&V report (for Critical/Severe)

**Documentation Location**: [File path or reference]

**Testing Coverage**:
- **Functional Testing**: [% scenarios covered]
- **Performance Testing**: [Results vs. requirements]
- **Robustness Testing**: [Edge cases, adversarial examples]
- **Security Testing**: [Penetration test results]
- **User Acceptance Testing**: [UAT completion status]

**V&V Results**:
- **Requirements Met**: [X / Y requirements passed]
- **Test Pass Rate**: [% of tests passed]
- **Critical Failures**: [Any critical issues found]
- **Performance vs. Baseline**: [Better / Same / Worse]

**Assurance Activities**:
- [ ] Independent V&V conducted (if Critical/Severe)
- [ ] Test results review
- [ ] Requirements traceability verified
- [ ] UAT sign-off

**Gaps/Actions**:
- [ ] [Action 1]
- [ ] [Action 2]

### Phase 7: Integration & Use

**Status**: [Not Started / In Progress / Completed]

**Documentation Required**:
- [ ] Deployment plan
- [ ] Operational procedures (SOPs)
- [ ] User training materials
- [ ] Monitoring and alerting setup
- [ ] Incident response procedures
- [ ] Maintenance procedures
- [ ] Release notes

**Documentation Location**: [File path or reference]

**Deployment**:
- **Deployment Environment**: [Production / Staging / Pilot]
- **Deployment Date**: [Date]
- **Deployment Method**: [Blue-green / Canary / Rolling / Big bang]
- **Rollback Plan**: [Yes / No - describe]

**Operational Procedures**:
- **Standard Operating Procedures**: [SOPs documented]
- **User Guides**: [User documentation available]
- **Troubleshooting Guide**: [Common issues documented]
- **Escalation Procedures**: [Who to contact for issues]

**Training**:
- **Operator Training**: [Completion status]
- **Commander Training**: [Completion status]
- **Maintenance Training**: [Completion status]

**Assurance Activities**:
- [ ] Deployment review
- [ ] Operational readiness review
- [ ] Training completion verified
- [ ] Monitoring verified operational

**Gaps/Actions**:
- [ ] [Action 1]
- [ ] [Action 2]

### Phase 8: Quality Assurance

**Status**: [Not Started / In Progress / Completed]

**Documentation Required**:
- [ ] Compliance matrix (all JSP 936 requirements)
- [ ] Quality assurance report
- [ ] Data integrity assessment
- [ ] Model performance monitoring report
- [ ] Ethical review report
- [ ] Security audit report
- [ ] Lessons learned

**Documentation Location**: [File path or reference]

**Compliance Matrix**:

| JSP 936 Requirement | Status | Evidence | Comments |
|---------------------|--------|----------|----------|
| AI ethical risk classification | [✅/⚠️/❌] | [Reference] | [Comments] |
| Five principles assessment | [✅/⚠️/❌] | [Reference] | [Comments] |
| Lifecycle documentation | [✅/⚠️/❌] | [Reference] | [Comments] |
| Governance structure | [✅/⚠️/❌] | [Reference] | [Comments] |
| Human-AI teaming | [✅/⚠️/❌] | [Reference] | [Comments] |
| Bias mitigation | [✅/⚠️/❌] | [Reference] | [Comments] |
| Explainability | [✅/⚠️/❌] | [Reference] | [Comments] |
| Security controls | [✅/⚠️/❌] | [Reference] | [Comments] |
| Continuous monitoring | [✅/⚠️/❌] | [Reference] | [Comments] |

**Quality Metrics**:
- **Documentation Completeness**: [% complete]
- **Requirements Traceability**: [% traceable]
- **Test Coverage**: [% covered]
- **Defect Density**: [Defects per KLOC]

**Assurance Activities**:
- [ ] Independent ethical review
- [ ] Security audit conducted
- [ ] Compliance verification
- [ ] Final approval obtained

**Gaps/Actions**:
- [ ] [Action 1]
- [ ] [Action 2]

---

## 5. Governance & Approval

### 5.1 AI Governance Structure

**Responsible AI Senior Officer (RAISO)**:
- **Name**: [Name]
- **Role**: [Role/Position]
- **Responsibilities**: [Overall AI governance, policy compliance, strategic oversight]

**Ethics Manager**:
- **Name**: [Name]
- **Role**: [Role/Position]
- **Responsibilities**: [Day-to-day ethical oversight, ethics reviews, stakeholder engagement]

**Independent Ethics Assurance**:
- **Required**: [Yes / No - Required for Critical classification]
- **Assurance Provider**: [Name/Organization]
- **Assurance Status**: [Not Started / In Progress / Completed]

**Governance Board**:
- **Board Name**: [AI Ethics Board / Project Board / etc.]
- **Meeting Frequency**: [Monthly / Quarterly / As needed]
- **Last Meeting**: [Date]
- **Next Meeting**: [Date]

### 5.2 Approval Pathway

**Risk Classification**: [Critical / Severe / Major / Moderate / Minor]

**Approval Authority**: [Based on classification]
- **Critical (20-25)**: 2PUS or Ministers
- **Severe (15-19)**: Defence-Level - JROC/IAC
- **Major (10-14)**: Defence-Level - JROC/IAC
- **Moderate (5-9)**: TLB-Level (delegated)
- **Minor (1-4)**: TLB-Level (delegated)

**Approval Process**:
- [ ] Initial ethical screening (Ethics Manager)
- [ ] Detailed JSP 936 assessment (this document)
- [ ] RAISO review and endorsement
- [ ] Independent assurance (if Critical)
- [ ] Ethics Board review
- [ ] Submission to approval authority
- [ ] Approval granted / Conditional approval / Rejected

**Approval History**:

| Date | Milestone | Approver | Decision | Conditions |
|------|-----------|----------|----------|------------|
| [Date] | Initial Screening | [Name] | [Approved/Conditional/Rejected] | [Any conditions] |
| [Date] | RAISO Review | [Name] | [Approved/Conditional/Rejected] | [Any conditions] |
| [Date] | Ethics Board | [Name] | [Approved/Conditional/Rejected] | [Any conditions] |
| [Date] | Final Approval | [Authority] | [Approved/Conditional/Rejected] | [Any conditions] |

### 5.3 Escalation Criteria

**Escalation Triggers**:
- [ ] Risk classification increases
- [ ] Significant system changes
- [ ] Ethical concerns arise during deployment
- [ ] Performance degrades below acceptable bounds
- [ ] Serious incidents occur
- [ ] Bias or harm identified
- [ ] Security breach

**Escalation Process**: [Describe how and when to escalate]

**Escalation History**: [Log of any escalations]

---

## 6. Human-AI Teaming Strategy

### 6.1 Teaming Model

**For AI Component 1: [Name]**

**Teaming Model**: [Human-in-loop / Human-on-loop / Human-out-of-loop]

**Model Definition**:
- **Human-in-loop**: Human reviews every AI decision before action
- **Human-on-loop**: Human monitors AI with ability to intervene
- **Human-out-of-loop**: AI operates autonomously, humans set constraints

**Rationale**: [Why this teaming model was selected]

**Time Criticality**: [Time available for human intervention]

### 6.2 Training Requirements

**Operator Training Programme**:
- **Duration**: [X hours/days]
- **Content**: [AI capabilities, limitations, SOPs, ethical considerations]
- **Competency Assessment**: [Written test / Practical assessment / Both]
- **Refresher Training**: [Frequency]
- **Training Completion**: [X% of operators trained]

**Commander Training Programme**:
- **Duration**: [X hours/days]
- **Content**: [Strategic use of AI, ethical decision-making, accountability]
- **Competency Assessment**: [Method]
- **Training Completion**: [X% of commanders trained]

**Technical Staff Training**:
- **Duration**: [X hours/days]
- **Content**: [Model maintenance, monitoring, troubleshooting]
- **Training Completion**: [X% of technical staff trained]

### 6.3 Human Control Interface

**Dashboard Design**:
- **Key Information Displayed**: [AI confidence, decision rationale, alerts, performance metrics]
- **Visualization**: [How AI outputs are presented]
- **Alert Mechanisms**: [How operators are alerted to issues]
- **Control Mechanisms**: [How operators can intervene]

**Trust Calibration**:
- **Trust Indicators**: [How to help users trust AI appropriately - not too much, not too little]
- **Confidence Display**: [How AI confidence is communicated]
- **Uncertainty Handling**: [How system handles and communicates uncertainty]
- **Performance Feedback**: [How users learn about AI performance]

**Decision Support Features**:
- **Explanation Interface**: [How AI explains its decisions]
- **Alternative Options**: [Does AI show alternative decisions?]
- **Confidence Scores**: [Numerical / Graphical / Color-coded]
- **Supporting Evidence**: [What evidence is shown to support AI decision]

**Override Mechanisms**:
- **Override Capability**: [Yes / No / Partial]
- **Override Process**: [How operators override AI]
- **Override Logging**: [All overrides logged and reviewed]
- **Override Feedback**: [Overrides used to improve AI]

---

## 7. Secure by Design Evidence

### 7.1 AI-Specific Threat Landscape

**Adversarial Examples**:
- **Threat**: Carefully crafted inputs that fool the AI
- **Likelihood**: [High / Medium / Low]
- **Impact**: [High / Medium / Low]
- **Risk**: [Critical / High / Medium / Low]
- **Mitigation**: [Adversarial training, input validation, ensemble methods]

**Data Poisoning**:
- **Threat**: Malicious data injected into training set
- **Likelihood**: [High / Medium / Low]
- **Impact**: [High / Medium / Low]
- **Risk**: [Critical / High / Medium / Low]
- **Mitigation**: [Data provenance, data validation, anomaly detection]

**Model Extraction**:
- **Threat**: Adversary steals model through queries
- **Likelihood**: [High / Medium / Low]
- **Impact**: [High / Medium / Low]
- **Risk**: [Critical / High / Medium / Low]
- **Mitigation**: [Query limits, differential privacy, model obfuscation]

**Model Inversion**:
- **Threat**: Adversary reconstructs training data
- **Likelihood**: [High / Medium / Low]
- **Impact**: [High / Medium / Low]
- **Risk**: [Critical / High / Medium / Low]
- **Mitigation**: [Differential privacy, aggregation, access controls]

**Backdoor Attacks**:
- **Threat**: Hidden triggers cause malicious behavior
- **Likelihood**: [High / Medium / Low]
- **Impact**: [High / Medium / Low]
- **Risk**: [Critical / High / Medium / Low]
- **Mitigation**: [Model inspection, trigger detection, diverse training data]

**Concept Drift**:
- **Threat**: Real-world data distribution changes over time
- **Likelihood**: [High / Medium / Low]
- **Impact**: [High / Medium / Low]
- **Risk**: [Critical / High / Medium / Low]
- **Mitigation**: [Continuous monitoring, drift detection, retraining]

### 7.2 AI-Specific Security Controls

**Input Validation**:
- [ ] Input bounds checking
- [ ] Anomaly detection on inputs
- [ ] Adversarial example detection
- [ ] Input sanitization

**Adversarial Defenses**:
- [ ] Adversarial training
- [ ] Input transformations
- [ ] Ensemble methods
- [ ] Certified defenses

**Model Security**:
- [ ] Model access controls
- [ ] Query rate limiting
- [ ] Model versioning and integrity
- [ ] Secure model storage

**Data Security**:
- [ ] Training data access controls
- [ ] Data encryption (at rest and in transit)
- [ ] Data provenance tracking
- [ ] Differential privacy

**Monitoring and Detection**:
- [ ] Input monitoring for attacks
- [ ] Output monitoring for anomalies
- [ ] Performance monitoring for drift
- [ ] Security event logging

### 7.3 Security Testing

**Adversarial Testing**:
- **Testing Method**: [FGSM / PGD / C&W / Other]
- **Attack Success Rate**: [% of adversarial examples that fooled model]
- **Robust Accuracy**: [Accuracy under adversarial attack]
- **Mitigation Effectiveness**: [How well defenses work]

**Penetration Testing**:
- **AI-Specific Pentest**: [Yes / No]
- **Pentest Date**: [Date]
- **Findings**: [Critical: X, High: Y, Medium: Z, Low: W]
- **Remediation Status**: [X% remediated]

**Red Teaming**:
- **Red Team Exercise**: [Yes / No]
- **Exercise Date**: [Date]
- **Scenarios Tested**: [Data poisoning, model extraction, adversarial attacks, etc.]
- **Findings**: [Summary of red team findings]

---

## 8. Supplier Assurance (if applicable)

**Third-Party AI Components**: [Yes / No]

### 8.1 Supplier Details

**Supplier 1: [Name]**

**Component Provided**: [Pre-trained model / Dataset / AI service / etc.]

**Supplier Assessment**:
- [ ] Supplier competence verified (AI expertise)
- [ ] Data provenance documented
- [ ] Model transparency provided
- [ ] Security practices assessed
- [ ] MOD JSP 936 compliance verified
- [ ] Ethical AI practices verified
- [ ] Contract includes AI-specific clauses

**Data Provenance**:
- **Training Data Source**: [Where supplier obtained data]
- **Data Quality**: [Supplier's data quality processes]
- **Bias Assessment**: [Supplier's bias testing results]
- **Data Rights**: [Licensing and usage rights]

**Model Transparency**:
- **Model Card Provided**: [Yes / No]
- **Architecture Details**: [Level of detail provided]
- **Performance Metrics**: [Metrics provided by supplier]
- **Known Limitations**: [Documented by supplier]

**Security**:
- **Security Certifications**: [ISO 27001, Cyber Essentials Plus, etc.]
- **Vulnerability Disclosure**: [Supplier's process]
- **Incident Response**: [Supplier's IR process]
- **Supply Chain Security**: [Supplier's supply chain assurance]

**MOD Compliance**:
- **JSP 936 Compliance**: [Supplier assessed against JSP 936]
- **JSP 440 Compliance**: [If applicable]
- **UK GDPR Compliance**: [Data protection]
- **NCSC Guidelines**: [Follow NCSC guidance]

**Ongoing Assurance**:
- **Monitoring**: [How supplier performance is monitored]
- **Reviews**: [Frequency of supplier reviews]
- **SLAs**: [Service level agreements]
- **Exit Strategy**: [Plan if supplier relationship ends]

---

## 9. Continuous Monitoring & Re-Assessment Plan

### 9.1 Real-Time Monitoring

**Performance Monitoring**:
- **Metrics Tracked**: [Accuracy, latency, throughput, error rate]
- **Monitoring Frequency**: [Real-time / Hourly / Daily]
- **Alert Thresholds**: [When alerts triggered]
- **Monitoring Dashboard**: [URL or location]

**Bias Monitoring**:
- **Metrics Tracked**: [Fairness metrics by demographic group]
- **Monitoring Frequency**: [Real-time / Daily / Weekly]
- **Alert Thresholds**: [Bias threshold for alerts]

**Security Monitoring**:
- **Threats Monitored**: [Adversarial inputs, anomalies, attacks]
- **Monitoring Tools**: [SIEM, anomaly detection, etc.]
- **Alert Thresholds**: [Security alert triggers]

**Drift Detection**:
- **Data Drift Monitoring**: [Input distribution changes]
- **Concept Drift Monitoring**: [Model performance degradation]
- **Monitoring Method**: [Statistical tests, performance tracking]
- **Alert Thresholds**: [Drift alert triggers]

### 9.2 Periodic Reporting

**Daily Reports**:
- System uptime and availability
- Error rates and failures
- Security alerts

**Weekly Reports**:
- Performance metrics trends
- User feedback summary
- Incident summary

**Monthly Reports**:
- Detailed performance analysis
- Bias assessment results
- Security posture summary
- Drift analysis
- Incidents and resolutions

**Quarterly Reports**:
- Comprehensive JSP 936 compliance review
- Ethics Manager review
- Risk re-assessment
- Governance Board review

### 9.3 Retraining Triggers

**Automatic Retraining Triggers**:
- [ ] Performance drops below [X%] threshold
- [ ] Significant data drift detected
- [ ] Bias increases beyond acceptable threshold
- [ ] New data volume reaches [X] samples

**Manual Retraining Triggers**:
- [ ] Operational environment changes
- [ ] New requirements added
- [ ] Security vulnerabilities discovered
- [ ] Ethical concerns arise
- [ ] Scheduled retraining (every [X] months)

**Retraining Process**:
- [ ] Trigger detected and validated
- [ ] New training data collected and validated
- [ ] Model retrained following Phase 5 process
- [ ] Revalidated following Phase 6 process
- [ ] Ethics Manager approval for redeployment
- [ ] Deployment following Phase 7 process

### 9.4 Annual JSP 936 Compliance Review

**Annual Review Process**:
- [ ] Full re-assessment of all Five Principles
- [ ] Risk re-classification
- [ ] Lifecycle documentation review
- [ ] Governance structure review
- [ ] Human-AI teaming effectiveness review
- [ ] Security audit
- [ ] Bias assessment
- [ ] Performance review
- [ ] Stakeholder consultation

**Review Schedule**:
- **Last Annual Review**: [Date]
- **Next Annual Review**: [Date]

**Re-Approval Process**:
- [ ] Updated JSP 936 assessment (this document)
- [ ] Ethics Manager review
- [ ] RAISO endorsement
- [ ] Submission to original approval authority
- [ ] Re-approval granted / Conditional / System decommissioned

### 9.5 System Retirement Criteria

**Retirement Triggers**:
- [ ] Risk classification increases to unacceptable level
- [ ] Performance degrades below minimum acceptable
- [ ] Ethical concerns cannot be mitigated
- [ ] Security vulnerabilities cannot be remediated
- [ ] Technology becomes obsolete
- [ ] Operational requirements change
- [ ] Cost-benefit analysis no longer favorable

**Retirement Process**:
- [ ] Retirement decision documented
- [ ] Stakeholder notification
- [ ] Alternative solution identified
- [ ] Graceful decommissioning plan
- [ ] Data archival or deletion
- [ ] Lessons learned documentation
- [ ] Final report to governance

---

## 10. JSP 936 Compliance Matrix

### Compliance Summary

| JSP 936 Requirement | Status | Evidence Location | Comments |
|---------------------|--------|-------------------|----------|
| **Ethical Risk Classification** | | | |
| Risk assessment completed | [✅/⚠️/❌] | Section 2 | [Comments] |
| Likelihood assessed (1-5) | [✅/⚠️/❌] | Section 2.1 | [Comments] |
| Impact assessed (1-5) | [✅/⚠️/❌] | Section 2.1 | [Comments] |
| Risk score calculated | [✅/⚠️/❌] | Section 2.1 | [Comments] |
| Classification assigned | [✅/⚠️/❌] | Section 2 | [Comments] |
| Unacceptable risk check | [✅/⚠️/❌] | Section 2.1 | [Comments] |
| **Five Ethical Principles** | | | |
| Human-Centricity assessed | [✅/⚠️/❌] | Section 3.1 | [Comments] |
| Responsibility assigned | [✅/⚠️/❌] | Section 3.2 | [Comments] |
| Understanding demonstrated | [✅/⚠️/❌] | Section 3.3 | [Comments] |
| Bias & Harm mitigated | [✅/⚠️/❌] | Section 3.4 | [Comments] |
| Reliability proven | [✅/⚠️/❌] | Section 3.5 | [Comments] |
| **AI Lifecycle Documentation** | | | |
| Phase 1: Planning | [✅/⚠️/❌] | Section 4 | [Comments] |
| Phase 2: Requirements | [✅/⚠️/❌] | Section 4 | [Comments] |
| Phase 3: Architecture | [✅/⚠️/❌] | Section 4 | [Comments] |
| Phase 4: Algorithm Design | [✅/⚠️/❌] | Section 4 | [Comments] |
| Phase 5: Model Development | [✅/⚠️/❌] | Section 4 | [Comments] |
| Phase 6: V&V | [✅/⚠️/❌] | Section 4 | [Comments] |
| Phase 7: Integration & Use | [✅/⚠️/❌] | Section 4 | [Comments] |
| Phase 8: Quality Assurance | [✅/⚠️/❌] | Section 4 | [Comments] |
| **Governance** | | | |
| RAISO assigned | [✅/⚠️/❌] | Section 5.1 | [Comments] |
| Ethics Manager assigned | [✅/⚠️/❌] | Section 5.1 | [Comments] |
| Independent assurance (if Critical) | [✅/⚠️/❌] | Section 5.1 | [Comments] |
| Governance board established | [✅/⚠️/❌] | Section 5.1 | [Comments] |
| Approval pathway followed | [✅/⚠️/❌] | Section 5.2 | [Comments] |
| Escalation process defined | [✅/⚠️/❌] | Section 5.3 | [Comments] |
| **Human-AI Teaming** | | | |
| Teaming model defined | [✅/⚠️/❌] | Section 6.1 | [Comments] |
| Training programme delivered | [✅/⚠️/❌] | Section 6.2 | [Comments] |
| Human control interface designed | [✅/⚠️/❌] | Section 6.3 | [Comments] |
| Trust calibration addressed | [✅/⚠️/❌] | Section 6.3 | [Comments] |
| Override mechanisms provided | [✅/⚠️/❌] | Section 6.3 | [Comments] |
| **Secure by Design** | | | |
| AI threat landscape assessed | [✅/⚠️/❌] | Section 7.1 | [Comments] |
| AI-specific controls implemented | [✅/⚠️/❌] | Section 7.2 | [Comments] |
| Security testing completed | [✅/⚠️/❌] | Section 7.3 | [Comments] |
| **Supplier Assurance** (if applicable) | | | |
| Supplier assessment completed | [✅/⚠️/❌] | Section 8 | [Comments] |
| Data provenance documented | [✅/⚠️/❌] | Section 8.1 | [Comments] |
| Model transparency provided | [✅/⚠️/❌] | Section 8.1 | [Comments] |
| Supplier MOD compliance verified | [✅/⚠️/❌] | Section 8.1 | [Comments] |
| **Continuous Monitoring** | | | |
| Real-time monitoring implemented | [✅/⚠️/❌] | Section 9.1 | [Comments] |
| Periodic reporting established | [✅/⚠️/❌] | Section 9.2 | [Comments] |
| Drift detection operational | [✅/⚠️/❌] | Section 9.1 | [Comments] |
| Retraining triggers defined | [✅/⚠️/❌] | Section 9.3 | [Comments] |
| Annual review scheduled | [✅/⚠️/❌] | Section 9.4 | [Comments] |
| Retirement criteria defined | [✅/⚠️/❌] | Section 9.5 | [Comments] |

**Overall Compliance**: [X% Complete]

**Critical Gaps**: [Number of critical gaps requiring immediate attention]

**Approval Recommendation**: [Ready for Approval / Conditional Approval / Not Ready]

---

## Appendices

### Appendix A: Risk Assessment Methodology

[Detailed explanation of how risk assessment was conducted]

### Appendix B: Ethical Risk Checklist

[Complete checklist of all ethical risks considered]

### Appendix C: Approval Process Flowchart

[Flowchart showing approval pathway for this risk classification]

### Appendix D: Model Card

[Detailed model card following standard template]

### Appendix E: Data Card

[Detailed data card documenting training data]

### Appendix F: Bias Assessment Report

[Full bias assessment results]

### Appendix G: V&V Report

[Verification and validation report]

### Appendix H: Security Test Report

[Adversarial testing and penetration test results]

### Appendix I: Training Materials

[Links to or excerpts from training materials]

### Appendix J: Monitoring Dashboard Screenshots

[Visual examples of monitoring dashboards]

---

## Approval and Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Project Lead | [Name] | | |
| Technical Lead | [Name] | | |
| Ethics Manager | [Name] | | |
| RAISO | [Name] | | |
| Independent Assurance (if Critical) | [Name/Org] | | |
| Approval Authority | [Name/Position] | | |

---

**Document Control**:
- **Version**: 1.0
- **Classification**: [OFFICIAL / OFFICIAL-SENSITIVE]
- **Last Reviewed**: [Date]
- **Next Review**: [Date - annual minimum]
- **Document Owner**: [Name/Role]
- **Related Documents**:
  - JSP 936 - Dependable Artificial Intelligence (AI) in Defence
  - Project Architecture Documentation
  - Project Requirements Documentation
  - Risk Register
  - Security Assessment

## External References

| Document | Type | Source | Key Extractions | Path |
|----------|------|--------|-----------------|------|
| *None provided* | — | — | — | — |

---

**Generated by**: ArcKit `/arckit.jsp-936` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]

