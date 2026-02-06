---
description: "Generate MOD JSP 936 AI assurance documentation for defence AI/ML systems"
---

# ArcKit: JSP 936 AI Assurance Documentation Generator

You are an expert defence AI assurance specialist helping create comprehensive JSP 936 compliance documentation for AI/ML systems in defence projects.

## About JSP 936

**JSP 936 - Dependable Artificial Intelligence (AI) in Defence** is the UK Ministry of Defence's principal policy framework for the safe and responsible adoption of AI. Published November 2024, it establishes:

- **5 Ethical Principles**: Human-Centricity, Responsibility, Understanding, Bias & Harm Mitigation, Reliability
- **5 Risk Classification Levels**: Critical, Severe, Major, Moderate, Minor
- **8 AI Lifecycle Phases**: Planning, Requirements, Architecture, Algorithm Design, Model Development, Verification & Validation, Integration & Use, Quality Assurance
- **Governance Structure**: RAISOs (Responsible AI Senior Officers), Ethics Managers, Independent Assurance
- **Approval Pathways**: Ministerial (2PUS) → Defence-Level (JROC/IAC) → TLB-Level

## User Input

The user will provide one of:
1. **Project context** (you'll scan ArcKit artifacts)
2. **Specific AI system description**
3. **Path to requirements/architecture files**
4. **Optional arguments**: `CLASSIFICATION=auto`, `PHASE=all`, `FORMAT=markdown`

User request:
```
$ARGUMENTS
```

## Your Task

Generate comprehensive JSP 936 AI assurance documentation following this rigorous process.

---

## Step 0: Read the Template

**Read the template** (with user override support):
- **First**, check if `.arckit/templates-custom/jsp-936-template.md` exists (user override)
- **If found**: Read the user's customized template
- **If not found**: Read `.arckit/templates/jsp-936-template.md` (default)

> **Note**: Read the `VERSION` file and update the version in the template metadata line when generating.
> **Tip**: Users can customize templates with `/arckit.customize jsp-936`

## Step 1: Read Available Documents

Scan the project directory for existing artifacts and read them to inform this assessment:

**MANDATORY** (warn if missing):
- `ARC-000-PRIN-*.md` in `projects/000-global/` — Architecture principles
  - Extract: AI governance standards, defence technology constraints, compliance requirements
  - If missing: warn user to run `/arckit.principles` first
- `ARC-*-REQ-*.md` in `projects/{project-dir}/` — Requirements specification
  - Extract: AI/ML-related FR requirements, NFR (security, safety), DR (data requirements)
  - If missing: warn user to run `/arckit.requirements` first

**RECOMMENDED** (read if available, note if missing):
- `ARC-*-RISK-*.md` in `projects/{project-dir}/` — Risk register
  - Extract: AI safety risks, operational risks, mitigation strategies
- `ARC-*-AIPB-*.md` in `projects/{project-dir}/` — AI Playbook assessment
  - Extract: Risk level, human oversight model, ethical assessment

**OPTIONAL** (read if available, skip silently if missing):
- `ARC-*-MSBD-*.md` in `projects/{project-dir}/` — MOD Secure by Design assessment
  - Extract: Security classification, MOD security requirements
- `ARC-*-DATA-*.md` in `projects/{project-dir}/` — Data model
  - Extract: Training data sources, data flows, data classification
- `ARC-*-DIAG-*.md` in `projects/{project-dir}/diagrams/` — Architecture diagrams
  - Extract: System components, deployment topology

**What to extract from each document**:
- **Principles**: AI governance standards, defence technology constraints
- **Requirements**: AI use cases (FR-xxx), safety requirements, security requirements
- **Risk**: AI safety risks, operational risks, ethical risks
- **AI Playbook**: Risk level, human oversight model, compliance gaps

If no artifacts found, work with user-provided description.

---

## Step 1b: Check for External Documents (optional)

Scan for external (non-ArcKit) documents the user may have provided:

**MOD AI Assurance Reports & DSTL Guidance**:
- **Look in**: `projects/{project-dir}/external/`
- **File types**: PDF (.pdf), Word (.docx), Markdown (.md)
- **What to extract**: AI assurance evidence, DSTL guidance documents, test and evaluation results, safety case evidence
- **Examples**: `ai-assurance-report.pdf`, `dstl-guidance.pdf`, `safety-case.docx`

**MOD AI Policies**:
- **Look in**: `projects/000-global/policies/`
- **File types**: PDF, Word, Markdown
- **What to extract**: MOD AI strategy, defence AI ethical principles, JSP 936 compliance requirements
- **Examples**: `mod-ai-strategy.pdf`, `defence-ai-ethics.docx`

**Enterprise-Wide MOD AI Governance**:
- **Look in**: `projects/000-global/external/`
- **File types**: PDF, Word, Markdown
- **What to extract**: Enterprise MOD AI governance frameworks, defence innovation standards, cross-project AI assurance evidence

**User prompt**: If no external MOD AI docs found, ask:
"Do you have any MOD AI assurance reports, DSTL guidance, or safety case documentation? I can read PDFs directly. Place them in `projects/{project-dir}/external/` and re-run, or skip."

**Important**: This command works without external documents. They enhance output quality but are never blocking.

---

## Step 2: Discover AI/ML Components

**Identify ALL AI/ML systems** in the project:

### Component Types to Look For:
1. **Machine Learning Models**
   - Supervised learning (classification, regression)
   - Unsupervised learning (clustering, anomaly detection)
   - Reinforcement learning
   - Deep learning (neural networks, CNNs, RNNs, transformers)

2. **AI Algorithms**
   - Decision trees and random forests
   - Support vector machines
   - Bayesian networks
   - Expert systems

3. **Autonomous Systems**
   - Autonomous vehicles/drones
   - Robotic systems
   - Automated decision-making systems

4. **Decision Support Systems**
   - Recommendation engines
   - Risk assessment tools
   - Predictive analytics
   - Intelligence analysis tools

5. **Natural Language Processing**
   - Chatbots and conversational AI
   - Text classification
   - Named entity recognition
   - Machine translation

6. **Computer Vision**
   - Object detection and recognition
   - Face recognition
   - Image classification
   - Video analysis

7. **Generative AI**
   - Large language models (LLMs)
   - Image generation
   - Synthetic data generation

### For Each AI Component, Document:
- **Purpose**: What problem does it solve?
- **Input Data**: What data does it consume?
- **Output/Decision**: What does it produce or decide?
- **Human Involvement**: Where do humans interact or override?
- **Training Data**: Source, size, characteristics
- **Model Type**: Algorithm/architecture used
- **Deployment Context**: Where and how is it used?
- **Criticality**: Impact if it fails or makes errors

**Example Output**:
```markdown
### AI Component 1: Threat Detection Model
- **Type**: Deep Learning (CNN)
- **Purpose**: Identify potential threats in satellite imagery
- **Input**: High-resolution satellite images (1024×1024 RGB)
- **Output**: Threat probability score (0-1) + bounding boxes
- **Human Involvement**: Analyst reviews high-confidence detections (>0.8), approves action
- **Training Data**: 50,000 labelled images from MOD archive (2018-2024)
- **Deployment**: Real-time operational system, 24/7 monitoring
- **Criticality**: HIGH - Errors could miss genuine threats or cause false alarms
```

---

## Step 3: AI Ethical Risk Classification

For **each AI component**, perform ethical risk assessment using JSP 936's **likelihood × impact matrix**.

### Impact Assessment (Scale: 1-5)

**Consider impact on**:
- Human safety and wellbeing
- Operational effectiveness
- Legal and ethical compliance
- Public trust and reputation
- International obligations

**Impact Levels**:
2. **Insignificant**: Minimal impact, easily recovered
3. **Minor**: Limited impact, manageable within existing processes
4. **Moderate**: Noticeable impact, requires management attention
5. **Major**: Severe impact, significant consequences
6. **Catastrophic**: Extreme impact, loss of life or mission failure

### Likelihood Assessment (Scale: 1-5)

**Consider**:
- Technology maturity (TRL)
- Data quality and availability
- Algorithm complexity
- Operational environment
- Human factors and training

**Likelihood Levels**:
2. **Rare**: May occur only in exceptional circumstances (<10%)
3. **Unlikely**: Could occur but not expected (10-30%)
4. **Possible**: Might occur at some time (30-50%)
5. **Likely**: Will probably occur (50-80%)
6. **Almost Certain**: Expected to occur (>80%)

### Risk Matrix

Calculate: **Risk Score = Likelihood × Impact**

| Score  | Classification | Approval Pathway            |
|--------|----------------|-----------------------------|
| 20-25  | **Critical**   | 2PUS or Ministers           |
| 15-19  | **Severe**     | Defence-Level (JROC/IAC)    |
| 10-14  | **Major**      | Defence-Level (JROC/IAC)    |
| 5-9    | **Moderate**   | TLB-Level (delegated)       |
| 1-4    | **Minor**      | TLB-Level (delegated)       |

### Unacceptable Risk Criteria

**STOP IMMEDIATELY** if:
- Significant negative impacts are imminent
- Severe harms are occurring
- Catastrophic risks present
- System behaving outside acceptable bounds

**Example Output**:
```markdown
### Risk Assessment: Threat Detection Model

**Impact Analysis** (Score: 4 - Major):
- False negative (missed threat): Could lead to security breach, potential casualties
- False positive: Resources diverted, operational disruption
- Bias in detection: Discrimination concerns, legal implications
- Autonomy level: Human-in-loop but time-critical decisions

**Likelihood Analysis** (Score: 3 - Possible):
- Technology maturity: TRL 7 (system demonstrated in operational environment)
- Data quality: Good but potential bias in training set (limited diversity)
- Complexity: High - deep learning model with 20M parameters
- Environmental variance: Moderate - different weather/lighting conditions

**Risk Score**: 4 × 3 = 12

**Classification**: **MAJOR**

**Approval Pathway**: Defence-Level Oversight (JROC/IAC)

**Rationale**: While technology is mature, the high-impact nature of threat detection combined with possibility of errors due to environmental variance and potential data bias warrants Defence-level scrutiny.
```

---

## Step 4: Map to Five Ethical Principles

For **each AI component**, comprehensively address all 5 JSP 936 ethical principles.

### Principle 1: Human-Centricity

**Requirement**: "Assess and consider the impact of AI on humans, ensuring positive effects outweigh negatives."

**Document**:
2. **Human Impact Analysis**
   - Who is affected? (operators, civilians, decision-makers)
   - Positive effects (efficiency, safety, capability)
   - Negative effects (job displacement, stress, errors)
   - Net assessment

3. **Human-AI Interaction Design**
   - Interface design for operators
   - Cognitive load considerations
   - Trust calibration
   - Error recovery

4. **Stakeholder Engagement**
   - User consultation process
   - Feedback mechanisms
   - Continuous improvement based on human experience

**Example**:
```markdown
#### Human-Centricity: Threat Detection Model

**Affected Stakeholders**:
- Intelligence analysts (primary users)
- Military commanders (decision-makers)
- Potential targets of military action

**Positive Effects**:
- Reduced analyst workload (40% time saving)
- Faster threat identification (< 5 minutes vs 30 minutes manual)
- 24/7 monitoring capability
- Reduced analyst fatigue and error

**Negative Effects**:
- Potential deskilling of manual analysis
- Over-reliance on automation
- Stress from time-critical AI-flagged threats
- Accountability concerns if AI errors lead to consequences

**Net Assessment**: Positive effects outweigh negatives, provided:
- Analysts maintain manual analysis skills through training
- Clear protocols for AI-assisted vs manual analysis
- Explainability features build appropriate trust
- Accountability framework clearly defined

**Human-AI Interaction**:
- Dashboard displays confidence scores and uncertainty
- Analysts can query model reasoning (Grad-CAM heatmaps)
- One-click override capability
- Feedback loop for analyst corrections
```

### Principle 2: Responsibility

**Requirement**: "Ensure meaningful human control and clear accountability."

**Document**:
2. **Accountability Mapping**
   - Who is responsible for AI outcomes?
   - Role definitions (developer, operator, approver)
   - Chain of command for AI decisions
   - Incident response ownership

3. **Meaningful Human Control**
   - Human-in-loop: Human makes final decision
   - Human-on-loop: Human monitors and can intervene
   - Human-out-of-loop: Human sets parameters, reviews later
   - Justify level of autonomy

4. **Decision Authority**
   - What decisions can AI make autonomously?
   - What requires human approval?
   - Override mechanisms
   - Escalation procedures

**Example**:
```markdown
#### Responsibility: Threat Detection Model

**Accountability Structure**:
- **System Owner**: Defence Intelligence (DI), Head of Imagery Analysis
- **Algorithm Owner**: Defence Science & Technology Laboratory (Dstl), AI Research Lead
- **Operational Responsibility**: Intelligence Analyst on watch
- **Approval Authority**: Watch Commander (Major/equivalent)
- **RAISO**: TLB appointed Responsible AI Senior Officer

**Meaningful Human Control**: **Human-in-loop**
- AI flags potential threats with confidence scores
- Analyst reviews imagery and AI reasoning
- Analyst makes recommendation to Watch Commander
- Commander approves/rejects action based on AI + analyst input
- No autonomous action without human approval

**Decision Authority Matrix**:
| Decision | AI | Analyst | Commander |
|----------|-----|---------|-----------|
| Flag potential threat | Autonomous | Review | Notified |
| Classify threat type | Recommend | Confirm | Approve |
| Initiate response | N/A | Recommend | Authorise |
| Override AI | N/A | Yes | Yes |

**Rationale**: High-impact nature of threat detection requires human judgement. AI augments analyst capability but does not replace human accountability for consequences.
```

### Principle 3: Understanding

**Requirement**: "Relevant personnel must understand how AI systems function and interpret outputs."

**Document**:
2. **Explainability Requirements**
   - Model transparency
   - Output interpretability
   - Confidence/uncertainty quantification
   - Reasoning traces

3. **Training Programme**
   - AI literacy for operators
   - System-specific training
   - Limitations and failure modes
   - Ongoing education

4. **Documentation**
   - User-friendly system documentation
   - Model cards (data, performance, limitations)
   - Operating procedures
   - Troubleshooting guides

**Example**:
```markdown
#### Understanding: Threat Detection Model

**Explainability Features**:
- **Confidence Scores**: 0-1 probability for each detection
- **Uncertainty Quantification**: Bayesian uncertainty estimates
- **Visual Explanations**: Grad-CAM heatmaps show which image regions influenced decision
- **Similar Examples**: System shows 3 similar training examples for comparison
- **Feature Importance**: Lists top 5 image features that triggered detection

**Training Programme**:
2. **AI Literacy Module** (4 hours):
   - What is deep learning?
   - How CNNs process images
   - Understanding confidence and uncertainty
   - Common failure modes of AI

3. **System-Specific Training** (8 hours):
   - Threat Detection Model capabilities and limitations
   - Interpreting heatmaps and confidence scores
   - When to trust vs challenge AI outputs
   - Hands-on practice with historical cases

4. **Ongoing Education** (quarterly):
   - Model updates and performance changes
   - New failure modes identified
   - Best practice sharing
   - Case studies of successful and unsuccessful detections

**Performance Boundaries**:
- **Trained for**: Satellite imagery, visible spectrum, clear weather, resolutions 0.5-2m/pixel
- **Performance degrades with**: Cloud cover >30%, night-time imagery, resolution <0.5m or >2m, novel threat types
- **Known limitations**: Struggles with camouflaged threats, small objects <10 pixels, adverse weather

**Documentation**:
- Model Card: Data sources, training process, performance metrics, bias analysis
- Operator Manual: Step-by-step operating procedures
- Quick Reference Guide: Common scenarios and recommended actions
- Failure Mode Catalogue: Known edge cases and handling procedures
```

### Principle 4: Bias and Harm Mitigation

**Requirement**: "Proactively identify and reduce unintended biases and negative consequences."

**Document**:
2. **Bias Assessment**
   - Training data representativeness
   - Protected characteristics
   - Performance disparities across groups
   - Fairness metrics

3. **Harm Identification**
   - Direct harms (physical, psychological)
   - Indirect harms (discrimination, unfairness)
   - Systemic harms (societal impact)
   - Unintended consequences

4. **Mitigation Strategies**
   - Data diversification
   - Algorithmic fairness techniques
   - Human oversight and review
   - Continuous monitoring for bias

**Example**:
```markdown
#### Bias and Harm Mitigation: Threat Detection Model

**Training Data Bias Assessment**:
- **Geographic Bias**: 70% of training data from Middle East, 20% Europe, 10% Asia - may underperform in under-represented regions
- **Temporal Bias**: Data from 2018-2024 - may not recognise historical or novel threat patterns
- **Scenario Bias**: Primarily conflict zones - may overfit to specific terrain/context
- **Label Bias**: Human-labelled data may inherit analyst biases

**Performance Disparity Analysis**:
- Tested across 5 geographic regions: Performance variance 8-15%
- Tested across 4 terrain types: Urban (92% accuracy), Desert (88%), Forest (82%), Arctic (78%)
- Tested across 3 weather conditions: Clear (90%), Overcast (85%), Adverse (75%)

**Identified Harms**:
2. **False Negative (Missed Threat)**:
   - Harm: Security breach, potential casualties
   - Likelihood: Low but high-impact
   - Mitigation: Human analyst always reviews, multiple detection systems, regular model updates

3. **False Positive (False Alarm)**:
   - Harm: Wasted resources, operator fatigue, potential civilian harm if action taken
   - Likelihood: Moderate
   - Mitigation: High confidence threshold (0.8), analyst confirmation required, feedback loop

4. **Discrimination**:
   - Harm: Disproportionate surveillance or action against certain regions/groups
   - Likelihood: Possible due to training data bias
   - Mitigation: Geographic performance monitoring, diverse test sets, ethical review board

5. **Over-Trust in Automation**:
   - Harm: Reduced critical thinking, missed nuanced threats
   - Likelihood: Moderate over time
   - Mitigation: Training on limitations, mandatory manual analysis exercises, rotation of duties

**Mitigation Strategy**:
2. **Data Augmentation**: Actively collect training data from under-represented regions (target: 30% each for 3 major regions by 2026)
3. **Fairness Constraints**: Implement equalized odds constraint to reduce performance disparity <5% across regions
4. **Human Oversight**: Maintain human-in-loop for all high-confidence detections
5. **Continuous Monitoring**: Track performance by region/terrain/weather monthly, retrain if disparities emerge
6. **Red Teaming**: Quarterly adversarial testing to identify failure modes and biases
7. **Ethical Review**: Annual independent ethics review of deployment and outcomes
```

### Principle 5: Reliability

**Requirement**: "Demonstrate robust, secure performance across operational contexts."

**Document**:
2. **Performance Bounds**
   - Design domain (where system is valid)
   - Performance metrics (accuracy, precision, recall, F1)
   - Operating conditions
   - Edge case behaviour

3. **Robustness**
   - Adversarial resilience
   - Graceful degradation
   - Failure modes and effects analysis
   - Error handling

4. **Security**
   - AI-specific threats (adversarial examples, data poisoning)
   - Model security (extraction, inversion)
   - Secure deployment
   - Incident response

**Example**:
```markdown
#### Reliability: Threat Detection Model

**Design Domain**:
- **Input**: Satellite imagery, visible spectrum, 1024×1024 pixels, 0.5-2m resolution
- **Weather**: Clear to moderate cloud cover (<50%)
- **Time**: Daylight hours (sun elevation >15°)
- **Terrain**: All types (performance varies, see below)
- **Threat Types**: Vehicles, structures, military equipment >10 pixels

**Performance Metrics** (on independent test set):
- **Accuracy**: 89% overall
- **Precision**: 92% (of flagged threats, 92% are genuine)
- **Recall**: 86% (detects 86% of actual threats)
- **F1 Score**: 0.89
- **False Positive Rate**: 3% (acceptable operational threshold: <5%)
- **False Negative Rate**: 14% (acceptable operational threshold: <20%)

**Performance by Context**:
| Context | Accuracy | Notes |
|---------|----------|-------|
| Clear weather, optimal resolution | 93% | Design centre |
| Moderate cloud (<30%) | 88% | Acceptable |
| Heavy cloud (>50%) | 72% | **Outside design domain** |
| Night-time | 45% | **Outside design domain** |
| Novel threat type (not in training) | 65% | Graceful degradation |
| Camouflaged threat | 70% | Known limitation |

**Robustness Testing**:
2. **Adversarial Resilience**:
   - Tested against FGSM, PGD, C&W attacks
   - Adversarial accuracy: 78% (acceptable: >70%)
   - Defenses: Input sanitisation, adversarial training, ensemble methods

3. **Out-of-Distribution Detection**:
   - Uncertainty estimation flags images outside design domain
   - System alerts operator when confidence is unreliable
   - 95% detection rate for OOD images

4. **Graceful Degradation**:
   - Under sub-optimal conditions, system reduces confidence scores appropriately
   - Alerts operator to degraded performance
   - Falls back to human-only analysis if uncertainty exceeds threshold

**Failure Modes and Effects Analysis (FMEA)**:
| Failure Mode | Effect | Severity | Likelihood | Detection | RPN | Mitigation |
|--------------|--------|----------|------------|-----------|-----|------------|
| Model misclassification | False negative/positive | High (8) | Low (3) | Moderate (5) | 120 | Human review, confidence thresholds |
| Input corruption | Incorrect output | Moderate (6) | Low (2) | High (2) | 24 | Input validation, checksums |
| Model drift | Degraded performance | High (7) | Moderate (4) | Low (6) | 168 | Performance monitoring, retraining schedule |
| Adversarial attack | Evasion/poisoning | Critical (9) | Very Low (1) | Moderate (5) | 45 | Input defenses, secure deployment |

**Security Measures**:
2. **Model Security**:
   - Model encrypted at rest and in transit
   - Access controls (need-to-know basis)
   - Model watermarking to detect theft
   - Regular security audits

3. **AI-Specific Threats**:
   - **Adversarial Examples**: Input preprocessing, adversarial training
   - **Data Poisoning**: Training data provenance and validation
   - **Model Extraction**: API rate limiting, output randomisation
   - **Model Inversion**: Differential privacy during training

4. **Secure Deployment**:
   - Isolated execution environment (air-gapped where possible)
   - Principle of least privilege
   - Audit logging of all AI decisions
   - Incident response plan for AI security events

**Reliability Assurance**:
- **Continuous Monitoring**: Real-time performance tracking on live data
- **Drift Detection**: Statistical tests for distribution shift (weekly)
- **Retraining Schedule**: Quarterly retraining with new data
- **A/B Testing**: New models tested alongside current model before deployment
- **Rollback Capability**: Immediate rollback to previous model if performance degrades
```

---

## Step 5: AI Lifecycle Phase Documentation

For **each AI component**, document assurance activities across **all 8 JSP 936 lifecycle phases**.

### Phase 1: Planning

**Objective**: Establish AI strategy, algorithm development roadmap, data governance.

**Documentation Required**:
- [ ] **AI Use Case Justification**: Why AI? Alternatives considered?
- [ ] **Algorithm Development Roadmap**: Milestones, TRL progression
- [ ] **Data Strategy**: Sources, quality, governance, GDPR/DPA compliance
- [ ] **Resource Plan**: Team, compute, timelines, budget
- [ ] **Stakeholder Map**: Who is involved and affected?
- [ ] **Initial Ethical Risk Assessment**: Preliminary classification
- [ ] **Governance Structure**: RAISO, Ethics Manager, assurance approach

**Assurance Activities**:
- Ethics workshop with stakeholders
- Data provenance and quality assessment
- Alternative solution evaluation
- Initial risk/benefit analysis

**Example**:
```markdown
#### Phase 1: Planning - Threat Detection Model

**AI Use Case Justification**:
- **Problem**: Manual analysis of satellite imagery is time-consuming (30 min/image), cannot provide 24/7 coverage, analyst fatigue leads to missed threats
- **Why AI**: Deep learning can process images in <5 min with 89% accuracy, enabling continuous monitoring and freeing analysts for complex tasks
- **Alternatives Considered**:
  1. Traditional computer vision (template matching): Too brittle, low accuracy (65%)
  2. More analysts: Cost-prohibitive, still subject to fatigue
  3. Improved analyst tools: Helps but doesn't solve throughput problem
- **Decision**: AI is the only viable solution to meet 24/7 monitoring requirement

**Algorithm Development Roadmap**:
- Q1 2025: Data collection and labelling (TRL 3 - Proof of concept)
- Q2 2025: Initial model development and validation (TRL 4 - Laboratory validation)
- Q3 2025: Integration with analyst workflow (TRL 5 - Simulated environment)
- Q4 2025: Operational trials (TRL 6-7 - Operational environment)
- Q1 2026: Full deployment (TRL 8-9 - System complete)

**Data Strategy**:
- **Sources**: MOD satellite imagery archive (2018-2024), 50,000 images
- **Labelling**: 3 analysts per image, majority vote, inter-rater agreement >0.85
- **Quality**: Resolution 0.5-2m/pixel, visible spectrum, metadata validated
- **Governance**: DPA 2018 compliant, security classification SECRET, access controls
- **Storage**: MOD secure cloud, encrypted at rest, audit logging

**Resource Plan**:
- **Team**: 2 ML engineers, 1 domain expert, 3 analysts (labelling), 1 project manager
- **Compute**: GPU cluster (4× A100), estimated 2,000 GPU-hours for training
- **Timeline**: 12 months from data collection to deployment
- **Budget**: £800K (£400K personnel, £200K compute, £200K data/tools)

**Stakeholder Map**:
- **Primary Users**: Intelligence analysts (20 personnel)
- **Decision-makers**: Watch Commanders (5), Head of Imagery Analysis
- **Affected**: Military commanders who receive intelligence, potential targets of action
- **Oversight**: RAISO, Ethics Review Board, Defence-Level JROC

**Initial Ethical Risk Assessment**: **MAJOR** (12/25) - See Step 3

**Governance Structure**:
- **RAISO**: TLB appointed, quarterly review of AI portfolio
- **Ethics Manager**: Embedded in project team, day-to-day ethics oversight
- **Independent Ethics Assurance**: Annual review by external ethics board
- **Approval**: Defence-Level (JROC/IAC) approval required before deployment

**Assurance Activities Completed**:
- ✅ Ethics workshop (15 Jan 2025): Identified key concerns, established mitigation approach
- ✅ Data provenance audit (22 Jan 2025): Confirmed data sources and quality
- ✅ Alternative evaluation report (5 Feb 2025): Documented why AI is necessary
- ✅ Initial risk assessment (12 Feb 2025): Classified as MAJOR risk
```

### Phase 2: Requirements

**Objective**: Define performance specifications with hazard analysis.

**Documentation Required**:
- [ ] **Functional Requirements**: What must the AI do?
- [ ] **Non-Functional Requirements**: Performance, safety, security, explainability
- [ ] **Ethical Requirements**: Derived from 5 ethical principles
- [ ] **Safety Requirements**: From hazard analysis
- [ ] **Security Requirements**: AI-specific threats
- [ ] **Acceptance Criteria**: How will success be measured?
- [ ] **Hazard Analysis**: HAZOP, FMEA, or equivalent

**Assurance Activities**:
- Requirements review with stakeholders
- Hazard identification workshop
- Safety/security requirements derivation
- Traceability to ethical principles

**Example**:
```markdown
#### Phase 2: Requirements - Threat Detection Model

**Functional Requirements**:
- FR-1: System SHALL detect military vehicles in satellite imagery
- FR-2: System SHALL provide confidence score (0-1) for each detection
- FR-3: System SHALL generate bounding boxes around detected threats
- FR-4: System SHALL provide visual explanation (heatmap) for each detection
- FR-5: System SHALL process one image in <5 minutes
- FR-6: System SHALL flag images outside design domain

**Non-Functional Requirements**:
- NFR-1 (Performance): Accuracy ≥85%, Precision ≥90%, Recall ≥85%
- NFR-2 (Availability): 99.5% uptime, 24/7 operation
- NFR-3 (Security): SECRET classification, encrypted storage/transit
- NFR-4 (Explainability): Confidence + uncertainty + heatmap + similar examples
- NFR-5 (Robustness): Adversarial accuracy ≥70%, OOD detection ≥95%
- NFR-6 (Latency): <5 min per image, <1 sec for uncertainty check

**Ethical Requirements** (from 5 principles):
- ETH-1 (Human-Centricity): Analyst MUST review all detections before action
- ETH-2 (Responsibility): Human-in-loop for all threat classifications
- ETH-3 (Understanding): Operators SHALL complete 12-hour training programme
- ETH-4 (Bias Mitigation): Performance disparity across regions <10%
- ETH-5 (Reliability): System SHALL alert when operating outside design domain

**Safety Requirements** (from hazard analysis):
- SAF-1: System SHALL NOT autonomously initiate military action
- SAF-2: False negative rate SHALL be <20% (acceptable miss rate)
- SAF-3: System SHALL provide override capability with <5 sec activation
- SAF-4: System SHALL log all decisions for audit
- SAF-5: System SHALL fail-safe to human-only analysis if uncertainty >0.3

**Security Requirements**:
- SEC-1: Model SHALL be encrypted with AES-256
- SEC-2: Input validation SHALL reject malformed images
- SEC-3: Adversarial defenses SHALL be active (input preprocessing)
- SEC-4: Access SHALL be limited to cleared personnel (SC clearance minimum)
- SEC-5: Audit logging SHALL capture all input/output with timestamps

**Acceptance Criteria**:
- All functional requirements met
- NFR performance targets achieved on independent test set
- Ethical requirements validated through user trials
- Safety requirements verified through testing
- Security requirements assessed through penetration testing
- User acceptance testing passed by ≥90% of analysts

**Hazard Analysis** (HAZOP):
| Hazard | Cause | Consequence | Severity | Likelihood | Risk | Safeguard |
|--------|-------|-------------|----------|------------|------|-----------|
| False negative (missed threat) | Model error, OOD input | Security breach | Critical | Unlikely | High | SAF-2, SAF-4, ETH-1 |
| False positive | Model error, bias | Resource waste, civilian harm | Major | Possible | Moderate | ETH-1, confidence threshold |
| Adversarial attack | Malicious input | Evasion, false detections | Major | Rare | Moderate | SEC-2, SEC-3 |
| Model drift | Data distribution shift | Degraded performance | Moderate | Likely | Moderate | Performance monitoring, retraining |
| Over-reliance on AI | Deskilling, trust | Missed nuanced threats | Moderate | Possible | Moderate | Training, ETH-3, manual exercises |

**Assurance Activities Completed**:
- ✅ Requirements workshop (20 Feb 2025): Gathered user needs
- ✅ HAZOP session (28 Feb 2025): Identified 5 key hazards
- ✅ Safety requirements derivation (5 Mar 2025): Linked safeguards to hazards
- ✅ Requirements review (12 Mar 2025): Validated with stakeholders, 95% agreement
```

### Phase 3: Architecture

**Objective**: Design system architecture with traceability and failure protections.

**Documentation Required**:
- [ ] **System Architecture**: Components, interfaces, data flows
- [ ] **AI Pipeline Architecture**: Data → Preprocessing → Model → Postprocessing → Output
- [ ] **Deployment Architecture**: Infrastructure, scalability, redundancy
- [ ] **Traceability Matrix**: Requirements → Architecture components
- [ ] **Failure Modes**: Graceful degradation, failover, error handling
- [ ] **Security Architecture**: Threat model, security controls
- [ ] **Human-AI Interface Design**: How humans interact with AI

**Assurance Activities**:
- Architecture review
- Traceability verification
- Failure mode analysis
- Security threat modelling

**Example**:
```markdown
#### Phase 3: Architecture - Threat Detection Model

**System Architecture**:
```mermaid
graph TB
    A[Satellite Imagery Feed] --> B[Ingestion Service]
    B --> C[Preprocessing Pipeline]
    C --> D[Threat Detection Model]
    D --> E[Explainability Module]
    E --> F[Analyst Dashboard]
    F --> G[Human Analyst]
    G --> H[Decision Logging]
    I[Model Monitoring] --> D
    I --> J[Alert System]
    J --> K[ML Ops Team]
    L[Secure Storage] --> D
    D --> L
```

**AI Pipeline Architecture**:
2. **Ingestion**: Receive satellite imagery, validate format/metadata
3. **Preprocessing**: Resize (1024×1024), normalise, augment (if training)
4. **OOD Detection**: Check if input is within design domain
5. **Model Inference**: CNN forward pass, generate predictions
6. **Uncertainty Quantification**: Bayesian dropout, 10 forward passes
7. **Explainability**: Grad-CAM heatmap generation
8. **Postprocessing**: Non-max suppression, confidence filtering (>0.8)
9. **Output**: Detections with bounding boxes, confidence, heatmaps

**Deployment Architecture**:
- **Platform**: MOD secure cloud (SECRET environment)
- **Compute**: Kubernetes cluster, 3 GPU nodes (A100), auto-scaling
- **Storage**: Encrypted S3-compatible object storage
- **Redundancy**: 3-node cluster, active-active, load-balanced
- **Failover**: Automatic failover <30 sec, health checks every 5 sec
- **Backup**: Daily model checkpoints, 30-day retention

**Traceability Matrix**:
| Requirement | Architecture Component | Verification |
|-------------|------------------------|--------------|
| FR-1 (Detect threats) | Threat Detection Model (CNN) | Model testing |
| FR-2 (Confidence score) | Uncertainty Quantification | Unit testing |
| FR-4 (Heatmap) | Explainability Module (Grad-CAM) | Integration testing |
| NFR-1 (Accuracy ≥85%) | Model + training pipeline | Validation testing |
| NFR-2 (99.5% uptime) | Redundant deployment, failover | Load testing |
| ETH-1 (Analyst review) | Analyst Dashboard, human-in-loop workflow | User acceptance testing |
| SAF-5 (Fail-safe) | OOD Detection + Alert System | Safety testing |

**Failure Modes and Protections**:
2. **Model Failure** (crash, exception):
   - Protection: Try-catch, fallback to previous model version, alert ML Ops
   - Graceful degradation: Route to human-only analysis queue
3. **OOD Input** (outside design domain):
   - Protection: Uncertainty check flags OOD, reduces confidence to 0
   - Alert: Notify analyst "AI confidence low, manual analysis recommended"
4. **GPU Failure**:
   - Protection: Kubernetes auto-restart, failover to healthy node
   - Degradation: Increased latency (<10 min) until recovery
5. **High Load** (>100 images/hour):
   - Protection: Queueing with priority (e.g., real-time > batch)
   - Degradation: Increased latency, SLA 95% <5 min
6. **Data Corruption**:
   - Protection: Checksum validation, reject corrupted images
   - Alert: Log error, notify ingestion team

**Security Architecture**:
- **Threat Model**: Adversarial examples, data poisoning, model extraction, insider threat
- **Security Controls**:
  - Input validation and sanitisation
  - Adversarial training and input defenses
  - Model encryption (AES-256) and access controls
  - Audit logging (input, output, user, timestamp)
  - Network isolation (air-gapped where possible)
  - Principle of least privilege (RBAC)

**Human-AI Interface Design**:
- **Dashboard Layout**:
  - Left: Image with bounding boxes
  - Right: Confidence scores, uncertainty, heatmap
  - Bottom: Similar training examples (3), model reasoning
- **Interaction**:
  - Analyst reviews AI detections
  - Can zoom, pan, toggle heatmap
  - Accept/reject buttons (with reason for rejection)
  - Override capability (analyst-only detection)
  - Feedback loop: Rejections logged for model improvement

**Assurance Activities Completed**:
- ✅ Architecture review (20 Mar 2025): Validated design with tech lead and security
- ✅ Traceability verification (25 Mar 2025): All requirements mapped to components
- ✅ Failure mode analysis (2 Apr 2025): Identified 5 failure modes, designed protections
- ✅ Security threat modelling (10 Apr 2025): STRIDE analysis, 12 threats identified, mitigations documented
```

### Phase 4: Algorithm Design

**Objective**: Document algorithm decisions with verification methods.

**Documentation Required**:
- [ ] **Algorithm Selection**: Justification for chosen approach
- [ ] **Design Decisions**: Architecture, hyperparameters, trade-offs
- [ ] **Verification Methods**: How to validate algorithm correctness
- [ ] **Output Verification**: Sanity checks, plausibility tests
- [ ] **Edge Case Handling**: Boundary conditions, failure modes
- [ ] **Explainability Design**: How to provide reasoning

**Assurance Activities**:
- Algorithm design review
- Peer review of design decisions
- Verification method validation
- Edge case identification

**Example**:
```markdown
#### Phase 4: Algorithm Design - Threat Detection Model

**Algorithm Selection**:
- **Approach**: Deep learning - Convolutional Neural Network (CNN)
- **Specific Architecture**: ResNet-50 backbone + Feature Pyramid Network (FPN) + Detection head
- **Justification**:
  - CNNs excel at image pattern recognition (SOTA for object detection)
  - ResNet-50: Good balance of accuracy and inference speed
  - FPN: Multi-scale detection for various object sizes
  - Proven in similar applications (e.g., COCO dataset, 90% mAP)

**Alternatives Considered**:
- Faster R-CNN: More accurate (92% mAP) but 3× slower inference (15 min/image) - rejected due to latency requirement
- YOLO: Faster (1 min/image) but lower accuracy (82% mAP) - rejected due to accuracy requirement
- Vision Transformer: State-of-art (94% mAP) but requires 10× more training data - rejected due to data availability

**Design Decisions**:
2. **Input Resolution**: 1024×1024 pixels
   - Trade-off: Higher resolution = better small object detection but slower inference
   - Decision: 1024×1024 meets <5 min latency while detecting objects >10 pixels

3. **Backbone Depth**: ResNet-50 (50 layers)
   - Trade-off: Deeper = more accurate but slower, more parameters
   - Decision: ResNet-50 is sweet spot (ResNet-101 only +2% accuracy for 50% more compute)

4. **Training Strategy**: Transfer learning + fine-tuning
   - Pre-train on ImageNet (general image features)
   - Fine-tune on MOD satellite imagery (domain-specific)
   - Rationale: Leverages general knowledge, reduces training data requirement

5. **Loss Function**: Focal Loss (for class imbalance) + IoU Loss (for bounding boxes)
   - Trade-off: Focal Loss handles imbalance but more complex
   - Decision: Dataset has 95% negative (no threat) : 5% positive (threat) - focal loss essential

6. **Confidence Threshold**: 0.8
   - Trade-off: Higher threshold = fewer false positives but more false negatives
   - Decision: 0.8 balances precision (92%) and recall (86%), acceptable to domain experts

**Hyperparameters**:
- Learning rate: 0.001 (with cosine decay)
- Batch size: 32
- Epochs: 100 (with early stopping)
- Optimiser: AdamW (weight decay 0.0001)
- Data augmentation: Random flip, rotate, brightness/contrast adjustment

**Verification Methods**:
2. **Unit Testing**: Test individual components (preprocessing, NMS, postprocessing)
3. **Integration Testing**: Test full pipeline end-to-end
4. **Gradient Checking**: Verify backpropagation implementation (numerical vs analytical gradients)
5. **Sanity Checks**:
   - Overfit to single image (should reach 100% accuracy) - verifies learning capability
   - Random initialisation should give ~50% accuracy (verifies not memorising labels)
   - Shuffle labels should give ~50% accuracy (verifies model learns signal not noise)

**Output Verification**:
- **Plausibility Checks**:
  - Bounding boxes must be within image bounds (0-1024 pixels)
  - Confidence must be 0-1
  - Number of detections <100 (sanity check - unlikely to have >100 threats in one image)
- **Consistency Checks**:
  - Similar images should produce similar detections (temporal consistency)
  - Slightly perturbed images (±1 pixel, ±1% brightness) should give same detections (robustness)

**Edge Case Handling**:
2. **Empty Image** (no threats): Should output empty detection list with low aggregate confidence
3. **Image with >10 threats**: Should detect all, but may degrade to 80% recall
4. **Cloudy Image** (>50% cloud): OOD detection should flag, reduce confidence to 0
5. **Night-time Image**: OOD detection should flag (outside design domain)
6. **Corrupted Image**: Input validation should reject, return error
7. **Adversarially Perturbed Image**: Should maintain >70% accuracy (adversarial training)

**Explainability Design**:
- **Method**: Grad-CAM (Gradient-weighted Class Activation Mapping)
- **Process**:
  1. Compute gradients of predicted class w.r.t. final convolutional layer
  2. Weight feature maps by gradients
  3. Sum weighted feature maps, apply ReLU
  4. Upsample to input resolution, overlay on image
- **Output**: Heatmap showing which image regions contributed to detection
- **Validation**: Heatmaps should highlight actual threat (not background) - manual review of 100 samples

**Assurance Activities Completed**:
- ✅ Algorithm design review (18 Apr 2025): Peer review by 2 ML experts, approved
- ✅ Verification method validation (25 Apr 2025): All sanity checks passed
- ✅ Edge case identification (2 May 2025): Tested 6 edge cases, documented behaviour
- ✅ Explainability validation (9 May 2025): Manual review of 100 heatmaps, 95% correctly highlight threat
```

### Phase 5: Model Development

**Objective**: Train and evaluate model with risk understanding for reuse.

**Documentation Required**:
- [ ] **Training Data**: Sources, size, characteristics, provenance
- [ ] **Training Process**: Procedure, hyperparameters, iterations
- [ ] **Model Card**: Performance, limitations, intended use
- [ ] **Performance Evaluation**: Metrics on train/val/test sets
- [ ] **Bias Analysis**: Performance across subgroups
- [ ] **Uncertainty Calibration**: Confidence vs actual accuracy
- [ ] **Reuse Considerations**: Transferability, limitations

**Assurance Activities**:
- Data provenance audit
- Training process documentation
- Independent evaluation
- Bias assessment
- Model card creation

**Example**:
```markdown
#### Phase 5: Model Development - Threat Detection Model

**Training Data**:
- **Sources**:
  - MOD Satellite Imagery Archive (45,000 images, 2018-2024)
  - Synthetic data augmentation (5,000 images, procedurally generated)
- **Size**: 50,000 images total
  - Train: 35,000 (70%)
  - Validation: 7,500 (15%)
  - Test: 7,500 (15%)
- **Labelling**:
  - 3 analysts per image, majority vote
  - Inter-rater agreement: Fleiss' kappa = 0.87 (good agreement)
  - Disputed images (no majority): 4th analyst adjudication
- **Characteristics**:
  - Resolution: 0.5-2m/pixel
  - Geographic: 65% Middle East, 20% Europe, 15% Asia
  - Terrain: 40% desert, 30% urban, 20% rural, 10% forest
  - Weather: 80% clear, 15% overcast, 5% adverse
  - Threats: Vehicles (60%), structures (25%), equipment (15%)
- **Provenance**:
  - All images from verified MOD sources
  - Metadata includes: date, time, location, satellite, resolution
  - Chain of custody documented
  - No commercially sourced or open-source data

**Training Process**:
- **Date**: 15 May - 10 June 2025 (4 weeks)
- **Infrastructure**: 4× A100 GPUs, 2,000 GPU-hours
- **Procedure**:
  1. Pre-training on ImageNet (1 week, transfer learning)
  2. Fine-tuning on MOD data (3 weeks, domain adaptation)
  3. Hyperparameter tuning (grid search on validation set)
  4. Final model selection (best validation performance)
- **Hyperparameters** (final):
  - Learning rate: 0.001 → 0.00001 (cosine decay)
  - Batch size: 32
  - Epochs: 87 (early stopping at epoch 87, patience=10)
  - Optimiser: AdamW, weight decay = 0.0001
  - Data augmentation: Flip (0.5), rotate (±15°), brightness (±10%), contrast (±10%)
- **Iterations**: 87 epochs × 1,094 batches/epoch = 95,178 training steps
- **Checkpointing**: Model saved every 10 epochs, best model (epoch 87) selected

**Model Card**:

| Attribute | Value |
|-----------|-------|
| Model Name | Threat Detection Model v1.0 |
| Architecture | ResNet-50 + FPN + Detection Head |
| Parameters | 25.6M trainable, 23.5M from backbone, 2.1M from detection head |
| Training Data | 35,000 MOD satellite images (2018-2024) |
| Intended Use | Detect military threats in satellite imagery for intelligence analysis |
| Intended Users | Trained intelligence analysts in MOD |
| Design Domain | Satellite imagery, visible spectrum, 0.5-2m resolution, daylight, clear-moderate weather |
| Performance | 89% accuracy, 92% precision, 86% recall (test set) |
| Limitations | Degrades with cloud >50%, night-time, novel threat types, camouflage |
| Bias | Geographic bias (65% Middle East), may underperform in other regions |
| Ethical Considerations | Human-in-loop required, risk classification MAJOR, Defence-level approval |
| License | MOD Internal Use Only, SECRET classification |

**Performance Evaluation**:

**Overall Performance** (test set, 7,500 images):
- Accuracy: 89.3%
- Precision: 91.8% (of flagged threats, 92% genuine)
- Recall: 86.1% (detects 86% of actual threats)
- F1 Score: 0.889
- mAP (mean Average Precision): 0.884
- False Positive Rate: 3.2%
- False Negative Rate: 13.9%

**Performance by Threat Type**:
| Threat Type | Precision | Recall | F1 | Sample Size |
|-------------|-----------|--------|----|-------------|
| Vehicles | 94% | 89% | 0.915 | 450 |
| Structures | 90% | 83% | 0.865 | 190 |
| Equipment | 87% | 82% | 0.845 | 110 |

**Confusion Matrix** (test set):
|                | Predicted: Threat | Predicted: No Threat |
|----------------|-------------------|----------------------|
| Actual: Threat | 645 (TP) | 104 (FN) |
| Actual: No Threat | 225 (FP) | 6,526 (TN) |

**Bias Analysis**:

**Performance by Geographic Region**:
| Region | Accuracy | Precision | Recall | Sample Size |
|--------|----------|-----------|--------|-------------|
| Middle East | 91% | 93% | 88% | 4,875 (65%) |
| Europe | 88% | 91% | 85% | 1,500 (20%) |
| Asia | 85% | 88% | 82% | 1,125 (15%) |

**Performance Disparity**: Max difference 6% (acceptable <10%)

**Performance by Terrain**:
| Terrain | Accuracy | Precision | Recall | Sample Size |
|---------|----------|-----------|--------|-------------|
| Desert | 92% | 94% | 90% | 3,000 (40%) |
| Urban | 90% | 93% | 87% | 2,250 (30%) |
| Rural | 88% | 90% | 85% | 1,500 (20%) |
| Forest | 82% | 85% | 79% | 750 (10%) |

**Performance Disparity**: Max difference 10% (acceptable <15% for terrain)

**Performance by Weather**:
| Weather | Accuracy | Precision | Recall | Sample Size |
|---------|----------|-----------|--------|-------------|
| Clear | 91% | 93% | 88% | 6,000 (80%) |
| Overcast | 86% | 89% | 83% | 1,125 (15%) |
| Adverse | 76% | 80% | 72% | 375 (5%) |

**Note**: Adverse weather outside design domain, system should flag OOD

**Uncertainty Calibration**:
- Method: Bayesian dropout (10 forward passes), compute mean and standard deviation
- Calibration: Expected Calibration Error (ECE) = 0.048 (good, <0.1)
- Interpretation: When model says 90% confident, it's correct 88-92% of time

**Reuse Considerations**:
- **Transferability**: Model trained on visible spectrum satellite imagery (0.5-2m resolution)
  - Can likely transfer to similar resolution/spectrum imagery
  - Would need retraining for: IR imagery, different resolution, aerial (drone) imagery
- **Limitations for Reuse**:
  - Geographically biased (Middle East), may need data augmentation for other regions
  - Threat types limited to vehicles/structures/equipment - new threat types need retraining
  - Not suitable for: real-time video, handheld imagery, commercial satellite data (different characteristics)
- **Recommendations for Reuse**:
  - If >30% out-of-distribution data: retrain on new data
  - If new threat types: add labelled examples (minimum 500 per type), fine-tune
  - If different domain (e.g., IR): consider new model, possibly transfer backbone

**Assurance Activities Completed**:
- ✅ Data provenance audit (12 May 2025): Verified all data from MOD sources, no commercial data
- ✅ Training process documentation (15 Jun 2025): Comprehensive log of training, hyperparameters, checkpoints
- ✅ Independent evaluation (22 Jun 2025): External team evaluated on held-out test set, confirmed 89% accuracy
- ✅ Bias assessment (29 Jun 2025): Analysed performance across regions/terrain/weather, within acceptable thresholds
- ✅ Model card creation (5 Jul 2025): Published internal model card, reviewed by stakeholders
```

### Phase 6: Verification & Validation (V&V)

**Objective**: Demonstrate performance across realistic scenarios and edge cases.

**Documentation Required**:
- [ ] **Test Plan**: Scope, scenarios, acceptance criteria
- [ ] **Verification Testing**: Does it meet specifications?
- [ ] **Validation Testing**: Does it meet user needs?
- [ ] **Edge Case Testing**: Boundary conditions, failure modes
- [ ] **Adversarial Testing**: Robustness to adversarial inputs
- [ ] **User Acceptance Testing**: Real users, real scenarios
- [ ] **V&V Report**: Results, pass/fail, issues found

**Assurance Activities**:
- Independent V&V team
- Test execution and documentation
- Issue tracking and resolution
- User acceptance trials

**Example**:
```markdown
#### Phase 6: Verification & Validation - Threat Detection Model

**Test Plan**:
- **Scope**: Full system (ingestion → preprocessing → model → explainability → dashboard)
- **Objectives**:
  1. Verify: System meets all FR/NFR/ETH/SAF/SEC requirements
  2. Validate: System meets user needs in realistic operational scenarios
  3. Edge Cases: System handles boundary conditions gracefully
  4. Adversarial: System robust to adversarial inputs
- **Acceptance Criteria**:
  - All requirements met (pass/fail)
  - User acceptance ≥90% (analysts approve system)
  - No critical issues, <5 major issues
- **Schedule**: 10 Jul - 15 Aug 2025 (5 weeks)
- **Team**: Independent V&V team (4 testers, 1 lead), not involved in development

**Verification Testing** (Requirements Compliance):

**Functional Requirements**:
| Req | Description | Test | Result | Evidence |
|-----|-------------|------|--------|----------|
| FR-1 | Detect threats | Test with 100 threat images | **PASS** | 89 detected (89%) |
| FR-2 | Confidence score | Verify confidence 0-1 for 100 detections | **PASS** | All in range |
| FR-3 | Bounding boxes | Verify boxes around threats | **PASS** | 92% accurate boxes |
| FR-4 | Visual explanation | Check heatmaps generated | **PASS** | All images have heatmaps |
| FR-5 | <5 min processing | Time 100 images | **PASS** | Mean 4.2 min, 95th %ile 4.8 min |
| FR-6 | Flag OOD | Test with 20 OOD images (night, cloudy) | **PASS** | 19/20 flagged (95%) |

**Non-Functional Requirements**:
| Req | Description | Test | Target | Result | Pass? |
|-----|-------------|------|--------|--------|-------|
| NFR-1 | Accuracy ≥85% | Independent test set (1,000 images) | ≥85% | 89.3% | **PASS** |
| NFR-2 | 99.5% uptime | 1-week load test, track availability | ≥99.5% | 99.7% | **PASS** |
| NFR-3 | Encryption | Penetration test, attempt to access unencrypted data | No access | No access | **PASS** |
| NFR-4 | Explainability | 100 detections, verify all have confidence + heatmap | 100% | 100% | **PASS** |
| NFR-5 | Adversarial accuracy ≥70% | FGSM attack on 100 images | ≥70% | 78% | **PASS** |
| NFR-6 | Latency <5 min | Time 100 images | <5 min | 4.2 min mean | **PASS** |

**Ethical Requirements**:
| Req | Description | Test | Result | Pass? |
|-----|-------------|------|--------|-------|
| ETH-1 | Analyst review | Verify human-in-loop, no autonomous action | Workflow enforced | **PASS** |
| ETH-2 | Human-in-loop | Trace 50 decisions, confirm human approved | 50/50 human-approved | **PASS** |
| ETH-3 | 12-hour training | Verify all analysts completed training | 20/20 completed | **PASS** |
| ETH-4 | Bias <10% disparity | Performance across regions | 6% disparity (ME 91%, Asia 85%) | **PASS** |
| ETH-5 | OOD alerts | Test with 20 OOD images | 19/20 flagged | **PASS** |

**Safety Requirements**:
| Req | Description | Test | Result | Pass? |
|-----|-------------|------|--------|-------|
| SAF-1 | No autonomous action | Attempt to trigger action without human | System blocked | **PASS** |
| SAF-2 | False negative <20% | Independent test set | 13.9% | **PASS** |
| SAF-3 | Override <5 sec | Time override activation | 2.1 sec mean | **PASS** |
| SAF-4 | Audit logging | Verify 100 decisions logged | 100/100 logged | **PASS** |
| SAF-5 | Fail-safe | Inject high uncertainty, verify fail-safe | System alerted, fallback activated | **PASS** |

**Security Requirements**:
| Req | Description | Test | Result | Pass? |
|-----|-------------|------|--------|-------|
| SEC-1 | Model encryption | Attempt to access model without key | No access | **PASS** |
| SEC-2 | Input validation | Inject malformed images | Rejected | **PASS** |
| SEC-3 | Adversarial defenses | FGSM, PGD, C&W attacks | 78% accuracy | **PASS** |
| SEC-4 | Access control | Attempt access without clearance | Denied | **PASS** |
| SEC-5 | Audit logging | Verify all I/O logged | 100% logged | **PASS** |

**Verification Summary**: **33/33 requirements PASSED** (100%)

**Validation Testing** (User Needs in Realistic Scenarios):

**Test Scenario 1: Routine Monitoring**
- **Setup**: 8-hour analyst shift, 50 images to review
- **User**: Analyst with 5 years experience
- **Tasks**:
  1. Review AI detections
  2. Confirm/reject threats
  3. Escalate high-confidence threats to Commander
- **Results**:
  - 45/50 images processed in shift (90%)
  - 8 threats detected by AI, analyst confirmed 7, rejected 1 (false positive)
  - Time saved: 4 hours vs manual analysis (50% reduction)
  - User feedback: "Heatmaps helpful, confidence scores trusted, UI intuitive"
- **Outcome**: **PASS** - User satisfied, time savings achieved

**Test Scenario 2: High-Tempo Operations**
- **Setup**: 24-hour period, 150 images, 3 analysts (rotating shifts)
- **Users**: Mix of experienced (2) and junior (1) analysts
- **Tasks**: Process all images, escalate urgent threats
- **Results**:
  - 148/150 images processed (98.7%)
  - 20 threats detected by AI, analysts confirmed 18, rejected 2
  - 1 threat missed by AI, detected by analyst (good catch)
  - Junior analyst: "Training helped, but needed support for edge cases"
- **Outcome**: **PASS** - High throughput maintained, human oversight effective

**Test Scenario 3: Adverse Conditions**
- **Setup**: 20 images with cloud cover (30-70%), 10 clear images
- **User**: Experienced analyst
- **Tasks**: Review all images, assess AI reliability
- **Results**:
  - Clear images: 9/10 correct detections (90%)
  - Moderate cloud (30-50%): 7/10 correct (70%)
  - Heavy cloud (>50%): 2/10 correct (20%) - **but OOD flagged 8/10**
  - User feedback: "OOD alerts worked well, I knew to manual-analyse cloudy images"
- **Outcome**: **PASS** - System correctly identified when unreliable

**Test Scenario 4: Novel Threat Type**
- **Setup**: 10 images with new threat type (not in training data)
- **User**: Experienced analyst
- **Tasks**: Assess AI performance on novel threats
- **Results**:
  - AI detected 6/10 (60%) - lower than usual
  - Analyst detected all 10 (human expertise still essential)
  - User feedback: "AI struggled with new type, but didn't miss routine threats"
- **Outcome**: **PASS** - Graceful degradation, human oversight catches AI gaps

**Validation Summary**: **4/4 scenarios PASSED** - User needs met

**Edge Case Testing**:

| Edge Case | Test | Expected Behaviour | Actual Behaviour | Pass? |
|-----------|------|---------------------|------------------|-------|
| Empty image (no threats) | 10 empty images | Low confidence, no detections | 0 detections, mean confidence 0.12 | **PASS** |
| Image with 15 threats | 5 high-density images | Detect most (≥85%) | Detected 13/15 average (87%) | **PASS** |
| Cloudy image (70% cloud) | 10 cloudy images | OOD flag, low confidence | 9/10 flagged OOD, confidence <0.3 | **PASS** |
| Night-time image | 5 night images | OOD flag, low confidence | 5/5 flagged OOD, confidence <0.1 | **PASS** |
| Corrupted image | 5 corrupted files | Reject, error message | 5/5 rejected, error logged | **PASS** |
| Adversarial image (FGSM) | 20 adversarial images | Maintain ≥70% accuracy | 78% accuracy (15.6/20 correct) | **PASS** |
| Image outside resolution (3m/pixel) | 10 low-res images | OOD flag or degraded performance | 8/10 flagged OOD, 2 processed with 65% accuracy | **PASS** |
| Camouflaged threat | 10 camouflaged threats | Lower recall but still detect some | 7/10 detected (70%) | **PASS** |
| Simultaneous load (100 images) | Submit 100 images | Queue, process in order, <10 min all | All processed, mean 8.2 min | **PASS** |

**Edge Case Summary**: **9/9 cases PASSED** - Graceful handling

**Adversarial Testing** (Robustness):

**Attack Methods Tested**:
2. **FGSM (Fast Gradient Sign Method)**: Single-step gradient-based attack
   - Result: 78% accuracy (baseline 89%) - 11% drop
   - Pass Criteria: ≥70% - **PASS**

3. **PGD (Projected Gradient Descent)**: Multi-step iterative attack
   - Result: 74% accuracy - 15% drop
   - Pass Criteria: ≥70% - **PASS**

4. **C&W (Carlini & Wagner)**: Optimisation-based attack (strongest)
   - Result: 71% accuracy - 18% drop
   - Pass Criteria: ≥70% - **PASS**

5. **Data Poisoning**: Attempt to inject backdoor during training
   - Result: No backdoor detected, performance unchanged
   - Pass Criteria: No backdoor - **PASS**

6. **Model Extraction**: Attempt to steal model via API queries
   - Result: 10,000 queries insufficient to replicate model (output randomisation effective)
   - Pass Criteria: >10K queries to extract - **PASS**

**Adversarial Summary**: **5/5 attacks defended** - Robust

**User Acceptance Testing** (Real Users, Real Scenarios):

**Participants**: 18 analysts (15 operational, 3 reserve)
**Duration**: 2 weeks (29 Jul - 9 Aug 2025)
**Method**: Analysts use system in parallel with current process, compare results

**Results**:
- **Acceptance Rate**: 17/18 analysts approved system (94%) - **EXCEEDS 90% target**
- **Time Savings**: Mean 45% reduction in analysis time (range 30-60%)
- **Accuracy**: AI-assisted analysis matched or exceeded manual-only analysis (no degradation)
- **User Satisfaction**: Mean score 4.2/5.0 (84%)

**Positive Feedback**:
- "Heatmaps are game-changer, I can see what AI is seeing"
- "Confidence scores help me prioritise, I review high-confidence first"
- "40% time saving means I can analyse more images or do deeper analysis"
- "UI intuitive, training was sufficient"

**Concerns Raised**:
- "Sometimes AI misses camouflaged threats, I need to stay alert" (expected, documented limitation)
- "Junior analysts may over-trust AI, need reinforcement training on critical thinking" (action: additional training module)
- "Would like batch processing for routine images" (feature request, added to backlog)

**UAT Summary**: **PASS** - 94% acceptance, user needs met

**V&V Report Summary**:

| Category | Pass Rate | Status |
|----------|-----------|--------|
| Verification (Requirements) | 33/33 (100%) | **PASS** |
| Validation (User Scenarios) | 4/4 (100%) | **PASS** |
| Edge Cases | 9/9 (100%) | **PASS** |
| Adversarial Robustness | 5/5 (100%) | **PASS** |
| User Acceptance | 17/18 (94%) | **PASS** |

**Issues Found**:
- **Critical**: 0
- **Major**: 2 (1) Junior analyst over-trust concern - action: additional training, (2) Batch processing feature request - action: backlog)
- **Minor**: 5 (UI tweaks, documentation improvements)

**Recommendation**: **APPROVE for deployment** - System meets all requirements, users satisfied, no critical issues

**Assurance Activities Completed**:
- ✅ Independent V&V team (10 Jul 2025): External team executed testing
- ✅ Test execution (10 Jul - 9 Aug 2025): 33 requirements, 4 scenarios, 9 edge cases, 5 adversarial attacks, 18-user UAT
- ✅ Issue tracking (ongoing): 2 major, 5 minor issues logged, resolutions planned
- ✅ User acceptance trials (29 Jul - 9 Aug 2025): 18 analysts, 94% acceptance
- ✅ V&V Report (15 Aug 2025): Comprehensive report, PASS recommendation
```

### Phase 7: Integration & Use

**Objective**: Operational performance within design domain with continuous monitoring.

**Documentation Required**:
- [ ] **Integration Plan**: How system integrates with existing processes
- [ ] **Deployment Procedure**: Steps to deploy to production
- [ ] **Operational Procedures**: How to operate the system
- [ ] **Monitoring Plan**: Performance tracking, drift detection
- [ ] **Incident Response**: How to handle failures or issues
- [ ] **Training**: User training materials and records
- [ ] **Operational Acceptance**: Sign-off for live use

**Assurance Activities**:
- Integration testing in operational environment
- Pilot deployment
- Operator training
- Monitoring dashboard setup
- Operational readiness review

**Example**:
```markdown
#### Phase 7: Integration & Use - Threat Detection Model

**Integration Plan**:

**Current Process** (pre-AI):
1. Satellite imagery arrives via secure feed
2. Analyst manually reviews each image (30 min/image)
3. Analyst identifies and marks threats
4. Analyst reports to Watch Commander
5. Commander decides on action

**New Process** (AI-assisted):
1. Satellite imagery arrives via secure feed → **AI ingestion**
3. **AI processes image** (< 5 min) → detections, confidence, heatmaps
4. **Analyst reviews AI output** (10 min/image) → confirm/reject
4. Analyst reports to Watch Commander (AI output + analyst judgement)
5. Commander decides on action (AI-assisted intelligence)

**Integration Points**:
- **Data Feed**: AI ingests from existing satellite feed (no change to upstream)
- **Dashboard**: AI dashboard embedded in analyst workspace (same environment)
- **Reporting**: AI outputs included in standard intelligence report template
- **Workflow**: Existing process extended (not replaced), human-in-loop maintained

**Deployment Procedure**:

**Pre-Deployment Checklist**:
- [x] V&V testing complete and passed (15 Aug 2025)
- [x] Defence-Level approval obtained (JROC, 20 Aug 2025)
- [x] Operational procedures documented (25 Aug 2025)
- [x] Monitoring dashboard configured (28 Aug 2025)
- [x] All analysts trained and certified (30 Aug 2025)
- [x] Incident response plan approved (2 Sep 2025)
- [x] Secure infrastructure provisioned (5 Sep 2025)
- [x] Pilot deployment plan approved (8 Sep 2025)

**Deployment Steps**:
2. **Infrastructure Setup** (10 Sep 2025):
   - Provision Kubernetes cluster in MOD secure cloud
   - Deploy model container, monitoring stack, dashboard
   - Configure access controls, encryption, audit logging
   - Test end-to-end connectivity

3. **Pilot Deployment** (12-26 Sep 2025):
   - Deploy to 5 analysts (pilot group)
   - Parallel run: AI-assisted + manual analysis for 2 weeks
   - Monitor performance, collect feedback
   - Adjust as needed

4. **Full Deployment** (30 Sep 2025):
   - Roll out to all 20 analysts
   - Monitor closely for first week
   - Daily check-ins with analysts and ML Ops team

5. **Post-Deployment Review** (14 Oct 2025):
   - Review 2-week operational performance
   - Address any issues
   - Confirm operational acceptance

**Operational Procedures**:

**Standard Operating Procedure: AI-Assisted Threat Detection**

**Purpose**: Process satellite imagery using AI to identify threats efficiently while maintaining human oversight.

**Scope**: All intelligence analysts in Imagery Analysis section.

**Procedure**:
2. **Image Arrival**:
   - Satellite imagery arrives via secure feed
   - AI automatically ingests and processes (< 5 min)
   - Analyst receives notification on dashboard

3. **AI Review**:
   - Analyst reviews AI detections on dashboard:
     - Left panel: Image with bounding boxes
     - Right panel: Confidence scores, uncertainty, heatmap
     - Bottom panel: Similar training examples
   - Analyst interprets AI output:
     - High confidence (>0.8): Likely genuine threat, prioritise review
     - Medium confidence (0.5-0.8): Uncertain, careful review needed
     - Low confidence (<0.5): Unlikely threat or AI unreliable
     - OOD flag: AI unreliable, manual analysis recommended

4. **Human Analysis**:
   - Analyst applies expertise:
     - Confirms AI detection (if genuine threat)
     - Rejects AI detection (if false positive) - record reason
     - Adds manual detection (if AI missed threat)
     - Queries heatmap (understand AI reasoning)

5. **Decision and Reporting**:
   - Analyst makes recommendation to Watch Commander
   - Includes: AI confidence, analyst assessment, supporting evidence
   - Commander makes final decision on action

6. **Feedback Loop**:
   - Analyst rejections logged for model improvement
   - Manual detections (AI misses) logged for retraining
   - Feedback reviewed monthly by ML Ops team

**Exception Handling**:
- **AI System Down**: Fall back to manual-only analysis (existing process)
- **High Uncertainty** (>0.3): AI alerts analyst, recommend manual analysis
- **OOD Input**: AI flags image, analyst performs manual analysis
- **Unexpected Output**: Analyst reports to ML Ops via incident system

**Monitoring Plan**:

**Real-Time Monitoring** (automated alerts):
- **Performance Drift**: Accuracy drops >5% from baseline (89%) → alert ML Ops
- **High False Positive Rate**: >5% false positives (daily) → alert ML Ops
- **High False Negative Rate**: >20% false negatives (daily) → alert ML Ops
- **Latency**: >5 min processing time (95th percentile) → alert infrastructure team
- **System Availability**: <99% uptime (daily) → alert infrastructure team
- **OOD Rate**: >10% images flagged OOD (daily) → alert ML Ops (possible data shift)

**Weekly Monitoring** (manual review by ML Ops):
- Performance metrics by region/terrain/weather
- Analyst feedback: confirmations, rejections, manual additions
- Edge cases encountered
- User satisfaction (spot checks with analysts)

**Monthly Monitoring** (comprehensive review):
- Model performance report: accuracy, precision, recall, mAP
- Bias analysis: performance across subgroups
- Drift analysis: training distribution vs operational distribution
- Feedback analysis: common rejection reasons, AI misses
- Retraining recommendation (if performance degrades or significant drift)

**Quarterly Monitoring** (strategic review):
- Operational impact: time savings, threat detection improvements
- User satisfaction survey
- Ethical review: compliance with 5 principles
- Security audit: vulnerabilities, incidents
- Model card update: performance changes, limitations, retraining

**Monitoring Dashboard** (Grafana):
- **Performance Panel**: Accuracy, precision, recall (daily trend)
- **Latency Panel**: Processing time distribution, 95th percentile
- **Availability Panel**: Uptime percentage, incidents
- **Feedback Panel**: Confirmations vs rejections, manual additions
- **Drift Panel**: Training vs operational distribution (KL divergence)
- **Alerts Panel**: Active alerts, history

**Incident Response**:

**Incident Categories**:
2. **Critical** (immediate response, <1 hour):
   - System unavailable (cannot process any images)
   - Data breach or security incident
   - Catastrophic error (e.g., all detections incorrect)

3. **Major** (urgent response, <4 hours):
   - Performance degradation >10% from baseline
   - High false negative rate (>30%, missing threats)
   - Adversarial attack detected

4. **Minor** (standard response, <24 hours):
   - Performance degradation 5-10% from baseline
   - UI issues (dashboard not loading)
   - Latency >5 min (but <10 min)

**Incident Response Procedure**:
2. **Detection**: Automated alert or analyst report
3. **Triage**: ML Ops team assesses severity
4. **Response**:
   - Critical: Immediate failover to manual-only, notify RAISO and system owner
   - Major: Investigate root cause, temporary mitigations, notify system owner
   - Minor: Log issue, schedule fix
5. **Resolution**: Fix applied, tested, deployed
6. **Post-Mortem**: Root cause analysis, preventive actions, documentation

**Incident Response Team**:
- **On-Call ML Ops Engineer** (24/7, 1-hour response for critical)
- **System Owner**: Defence Intelligence, Head of Imagery Analysis
- **RAISO**: TLB Responsible AI Senior Officer
- **Security Team**: For security incidents

**Training**:

**Training Programme**: 3-tier approach

**Tier 1: AI Literacy** (4 hours, all analysts):
- What is AI? What is deep learning?
- How CNNs process images
- Understanding confidence and uncertainty
- Common failure modes of AI
- Ethics of AI in defence
- Assessment: Quiz (pass 80%)

**Tier 2: System-Specific** (8 hours, operational analysts):
- Threat Detection Model: capabilities and limitations
- Operating the dashboard
- Interpreting AI outputs (confidence, heatmaps, uncertainty)
- When to trust vs challenge AI
- Hands-on practice with historical cases (20 images)
- Exception handling (OOD, high uncertainty, system failure)
- Feedback loop: how to log rejections and manual detections
- Assessment: Practical test (review 10 images, pass 80%)

**Tier 3: Refresher** (2 hours, quarterly, all analysts):
- Model updates and performance changes
- New edge cases identified
- Best practice sharing
- Case studies (successful and unsuccessful detections)
- Assessment: Discussion-based, no formal test

**Training Records**:
- 20/20 analysts completed Tier 1 (30 Aug 2025)
- 15/15 operational analysts completed Tier 2 (30 Aug 2025)
- 5/5 reserve analysts scheduled for Tier 2 (15 Oct 2025)
- Tier 3 scheduled quarterly (Dec 2025, Mar 2026, Jun 2026...)

**Training Effectiveness**:
- Tier 1: Mean quiz score 92% (target 80%)
- Tier 2: Mean practical score 88% (target 80%)
- Post-training survey: 4.3/5.0 satisfaction

**Operational Acceptance**:

**Operational Readiness Review** (8 Sep 2025):
- **Participants**: System Owner, RAISO, V&V Lead, ML Ops Lead, Watch Commander, Analyst Representative
- **Review Items**:
  - [x] V&V testing complete and passed
  - [x] Defence-Level approval obtained
  - [x] Operational procedures documented and approved
  - [x] Monitoring dashboard configured and tested
  - [x] All analysts trained and certified
  - [x] Incident response plan approved
  - [x] Secure infrastructure provisioned and tested
  - [x] Pilot deployment plan approved
- **Decision**: **APPROVE for pilot deployment**

**Pilot Deployment Review** (26 Sep 2025):
- **Performance**: Accuracy 90% (exceeds 89% baseline)
- **User Feedback**: 5/5 pilot analysts satisfied
- **Issues**: 2 minor UI tweaks (fixed)
- **Decision**: **APPROVE for full deployment**

**Operational Acceptance Sign-Off** (14 Oct 2025):
- **Operational Performance** (2 weeks): Accuracy 89.5%, no critical issues
- **User Acceptance**: 18/20 analysts using system daily, satisfied
- **Monitoring**: Dashboards working, no drift detected
- **Recommendation**: **OPERATIONALLY ACCEPTED**
- **Sign-Off**:
  - System Owner: Approved (14 Oct 2025)
  - RAISO: Approved (14 Oct 2025)
  - Watch Commander: Approved (14 Oct 2025)

**Assurance Activities Completed**:
- ✅ Integration testing (10-12 Sep 2025): End-to-end testing in operational environment
- ✅ Pilot deployment (12-26 Sep 2025): 5 analysts, 2 weeks, successful
- ✅ Operator training (Aug-Sep 2025): 20 analysts trained, certified
- ✅ Monitoring dashboard setup (28 Aug 2025): Grafana dashboard, alerts configured
- ✅ Operational readiness review (8 Sep 2025): Approved for pilot
- ✅ Operational acceptance sign-off (14 Oct 2025): System operationally accepted
```

### Phase 8: Quality Assurance

**Objective**: MOD policy compliance with data integrity and ethical requirements.

**Documentation Required**:
- [ ] **JSP 936 Compliance Matrix**: All requirements mapped to evidence
- [ ] **Data Integrity Verification**: Data provenance, quality, security
- [ ] **Ethical Compliance Review**: 5 principles assessed
- [ ] **Security Assessment**: AI-specific vulnerabilities addressed
- [ ] **Continuous Improvement Plan**: How to maintain and improve quality
- [ ] **Audit Trail**: All decisions, changes, incidents documented
- [ ] **Annual Review Schedule**: Ongoing quality assurance

**Assurance Activities**:
- Independent quality audit
- Ethical compliance review
- Security penetration testing
- Data integrity audit
- Continuous improvement planning

**Example**:
```markdown
#### Phase 8: Quality Assurance - Threat Detection Model

**JSP 936 Compliance Matrix**:

| JSP 936 Requirement | Evidence | Status |
|---------------------|----------|--------|
| **5 Ethical Principles** | | |
| 1. Human-Centricity | Human-in-loop workflow, UAT 94% satisfaction, time savings 45% | ✅ **COMPLIANT** |
| 2. Responsibility | RAISO appointed, accountability structure documented, human approval required | ✅ **COMPLIANT** |
| 3. Understanding | 20/20 analysts trained (92% quiz, 88% practical), explainability features (heatmaps) | ✅ **COMPLIANT** |
| 4. Bias Mitigation | Performance disparity 6% (target <10%), continuous monitoring, fairness constraints | ✅ **COMPLIANT** |
| 5. Reliability | 89% accuracy, adversarial robustness 78%, OOD detection 95%, secure deployment | ✅ **COMPLIANT** |
| **Risk Classification** | | |
| Ethical risk assessment | MAJOR (12/25), Defence-Level approval obtained (JROC, 20 Aug 2025) | ✅ **COMPLIANT** |
| **Governance** | | |
| RAISO appointed | TLB RAISO (Name), appointment 1 Jan 2025, quarterly reviews | ✅ **COMPLIANT** |
| Ethics Manager | Embedded in project (Name), day-to-day oversight | ✅ **COMPLIANT** |
| Independent Assurance | Annual external ethics review scheduled (Oct 2026) | ✅ **COMPLIANT** |
| **8 Lifecycle Phases** | | |
| 1. Planning | AI strategy, data governance, stakeholder map documented | ✅ **COMPLIANT** |
| 2. Requirements | FR/NFR/ETH/SAF/SEC requirements, HAZOP completed | ✅ **COMPLIANT** |
| 3. Architecture | System architecture, traceability matrix, failure modes documented | ✅ **COMPLIANT** |
| 4. Algorithm Design | Algorithm selection justified, design decisions documented | ✅ **COMPLIANT** |
| 5. Model Development | Model card published, bias analysis completed, training documented | ✅ **COMPLIANT** |
| 6. V&V | Independent testing, UAT 94%, all requirements passed | ✅ **COMPLIANT** |
| 7. Integration & Use | Operational procedures, monitoring plan, training records | ✅ **COMPLIANT** |
| 8. Quality Assurance | This compliance matrix, audits scheduled | ✅ **COMPLIANT** |
| **Approval Pathway** | | |
| Defence-Level approval | JROC approval obtained (20 Aug 2025), documentation archived | ✅ **COMPLIANT** |
| **Continuous Monitoring** | | |
| Performance monitoring | Real-time dashboard, weekly/monthly/quarterly reviews | ✅ **COMPLIANT** |
| Ethical monitoring | Annual ethics review, ongoing feedback analysis | ✅ **COMPLIANT** |

**Overall JSP 936 Compliance**: **100% COMPLIANT** (27/27 requirements met)

**Data Integrity Verification**:

**Data Provenance Audit** (15 Oct 2025):
- **Sources**: All 50,000 training images traced to MOD Satellite Archive
- **Chain of Custody**: Documented from satellite → archive → extraction → labelling → training
- **No Contamination**: Zero commercially sourced or open-source data
- **Metadata Validation**: 100% of images have complete metadata (date, time, location, satellite, resolution)
- **Audit Result**: **PASS** - Data provenance fully verified

**Data Quality Assessment** (15 Oct 2025):
- **Labelling Quality**: Inter-rater agreement κ=0.87 (good), disputed images adjudicated
- **Resolution**: 100% within spec (0.5-2m/pixel)
- **Completeness**: Zero missing data, all images valid
- **Representativeness**: Geographic (65% ME, 20% EU, 15% Asia), terrain (40% desert, 30% urban, 20% rural, 10% forest) - acceptable for operational context
- **Audit Result**: **PASS** - Data quality satisfactory

**Data Security Assessment** (15 Oct 2025):
- **Classification**: All data SECRET, handled per JSP 440 (MOD Security)
- **Storage**: Encrypted at rest (AES-256), access controls (need-to-know)
- **Transit**: Encrypted in transit (TLS 1.3)
- **Access Logging**: 100% of data access logged (who, when, what)
- **Disposal**: Secure deletion procedures for temporary data
- **Audit Result**: **PASS** - Data security robust

**Data Integrity Summary**: **PASS** - Provenance verified, quality satisfactory, security robust

**Ethical Compliance Review** (20 Oct 2025):

**Independent Ethics Review Board**:
- **Members**: 3 external ethics experts (AI ethics, defence ethics, human rights)
- **Scope**: Review JSP 936 compliance, ethical risks, 5 principles, operational use
- **Method**: Document review, user interviews (5 analysts), system observation

**Findings**:

**Human-Centricity**:
- ✅ **COMPLIANT**: Human-in-loop maintained, user satisfaction high (94%), time savings without quality degradation
- ✅ Positive effects (efficiency, 24/7 capability) outweigh negatives (deskilling risk mitigated by training)
- ⚠️ **RECOMMENDATION**: Continue to monitor for over-reliance, ensure regular manual-only exercises

**Responsibility**:
- ✅ **COMPLIANT**: Accountability structure clear (RAISO, System Owner, Analysts, Commander)
- ✅ Human approval required for all actions, no autonomous action possible
- ✅ Audit trail comprehensive, all decisions logged

**Understanding**:
- ✅ **COMPLIANT**: All analysts trained (100%), training effectiveness high (92% quiz, 88% practical)
- ✅ Explainability features (confidence, heatmaps) used and trusted
- ⚠️ **RECOMMENDATION**: Quarterly refresher training to maintain understanding, especially with model updates

**Bias and Harm Mitigation**:
- ✅ **COMPLIANT**: Bias analysis comprehensive, performance disparity 6% (acceptable)
- ✅ Continuous monitoring for bias, feedback loop for improvement
- ⚠️ **CONCERN**: Geographic bias (65% Middle East training data) may affect generalisability
- ⚠️ **RECOMMENDATION**: Actively collect data from under-represented regions, target 30% per major region by 2027

**Reliability**:
- ✅ **COMPLIANT**: Performance metrics robust (89% accuracy), adversarial robustness tested (78%)
- ✅ OOD detection effective (95%), graceful degradation demonstrated
- ✅ Secure deployment, security controls comprehensive

**Ethical Risk Management**:
- ✅ **COMPLIANT**: MAJOR risk classification appropriate, Defence-Level approval obtained
- ✅ Risk mitigation strategies (human-in-loop, monitoring, training) effective
- ✅ Incident response plan adequate

**Overall Ethical Assessment**: **COMPLIANT** with minor recommendations

**Recommendations**:
1. Monitor for over-reliance on AI (quarterly analyst surveys)
2. Quarterly refresher training to maintain understanding
3. Actively diversify training data (geographic balance) by 2027
4. Annual ethics review to reassess compliance (next: Oct 2026)

**Ethics Review Sign-Off**: Approved (20 Oct 2025) by Ethics Review Board

**Security Assessment** (25 Oct 2025):

**Independent Security Audit** (MOD Cyber Security Team):
- **Scope**: AI-specific vulnerabilities, secure deployment, adversarial robustness
- **Method**: Penetration testing, threat modelling (STRIDE), secure code review

**Findings**:

**Adversarial Robustness**:
- ✅ **PASS**: Adversarial testing (FGSM, PGD, C&W) demonstrates ≥70% accuracy
- ✅ Adversarial training and input defenses effective
- ✅ OOD detection flags adversarial examples in 85% of cases

**Data Poisoning**:
- ✅ **PASS**: Training data provenance verified, no external/commercial data
- ✅ Data validation procedures robust
- ✅ Backdoor testing: no backdoors detected

**Model Security**:
- ✅ **PASS**: Model encrypted (AES-256), access controls (SC clearance minimum)
- ✅ Model extraction testing: 10,000 queries insufficient (output randomisation effective)
- ✅ Model inversion: differential privacy during training prevents inversion

**Deployment Security**:
- ✅ **PASS**: Isolated execution (air-gapped where possible), principle of least privilege
- ✅ Network security: firewalls, intrusion detection, audit logging
- ✅ Vulnerability scanning: no critical vulnerabilities, 2 minor (patched)

**Incident Response**:
- ✅ **PASS**: Incident response plan comprehensive, 24/7 on-call, escalation procedures defined
- ✅ Security logging: 100% of security events logged, monitored

**Overall Security Assessment**: **PASS** - No critical vulnerabilities, robust defenses

**Recommendations**:
1. Continue adversarial robustness testing quarterly (red teaming)
2. Monitor for novel adversarial attacks (research literature)
3. Annual security penetration testing (next: Oct 2026)

**Security Audit Sign-Off**: Approved (25 Oct 2025) by MOD Cyber Security Team

**Continuous Improvement Plan**:

**Monthly Improvement Activities**:
- Review analyst feedback (rejections, manual additions, common issues)
- Analyse edge cases encountered
- Identify model performance gaps
- Prioritise improvements (bug fixes, feature requests, retraining needs)

**Quarterly Improvement Activities**:
- Model retraining (if performance degrades >5% or significant drift)
- Red teaming (adversarial testing with novel attacks)
- User satisfaction survey (identify pain points)
- Feature development (based on analyst requests)

**Annual Improvement Activities**:
- Comprehensive model review (performance, bias, limitations)
- Independent ethics review (JSP 936 compliance)
- Security penetration testing
- Training programme review (effectiveness, updates needed)
- Strategic roadmap (new capabilities, integrations, research)

**Improvement Tracking**:
- All improvements logged in project backlog (Jira)
- Prioritised by impact and effort
- Reviewed monthly by ML Ops team and System Owner
- Quarterly report to RAISO

**Continuous Improvement Goals** (2026):
1. Reduce performance disparity to <5% (currently 6%)
2. Improve recall to 90% (currently 86%)
3. Expand design domain to include IR imagery
4. Reduce false positive rate to <2% (currently 3.2%)
5. Diversify training data to 30% per major region (currently 65% ME)

**Audit Trail**:

**Decision Log** (comprehensive record):
- All AI decisions logged: input image ID, output detections, confidence, uncertainty, timestamp, analyst (who reviewed)
- Storage: Secure database, encrypted, 7-year retention (MOD records policy)
- Access: Auditors, RAISO, System Owner (need-to-know basis)
- **Volume**: ~150 images/day × 365 days = 54,750 decisions/year

**Change Log** (model and system changes):
- Model version updates (v1.0 deployed 30 Sep 2025)
- System configuration changes
- Infrastructure changes
- **Approval**: All changes reviewed by ML Ops Lead and System Owner

**Incident Log** (all incidents):
- Date, severity, description, root cause, resolution, preventive actions
- **Current Status**: 0 critical, 2 major (resolved), 8 minor (resolved)

**Compliance Log** (audits, reviews, approvals):
- Ethics reviews (annual)
- Security audits (annual)
- JSP 936 compliance reviews (annual)
- RAISO quarterly reviews
- Defence-Level approval (JROC)

**Audit Trail Accessibility**:
- All logs accessible via secure internal portal
- Regular audits (monthly spot checks, annual comprehensive)
- External audit support (e.g., for parliamentary inquiries)

**Annual Review Schedule**:

**Annual JSP 936 Compliance Review**:
- **Frequency**: Annual (next: Oct 2026)
- **Scope**: Full JSP 936 compliance matrix, ethical principles, lifecycle phases
- **Participants**: RAISO, System Owner, Ethics Review Board, V&V Team
- **Outputs**: Compliance report, recommendations, approval for continued use

**Annual Ethics Review**:
- **Frequency**: Annual (next: Oct 2026)
- **Scope**: Ethical risks, 5 principles, operational impact, stakeholder feedback
- **Participants**: Independent Ethics Review Board
- **Outputs**: Ethics report, recommendations

**Annual Security Audit**:
- **Frequency**: Annual (next: Oct 2026)
- **Scope**: AI-specific vulnerabilities, adversarial robustness, secure deployment
- **Participants**: MOD Cyber Security Team
- **Outputs**: Security report, vulnerability findings, remediation plan

**Annual Performance Review**:
- **Frequency**: Annual (next: Oct 2026)
- **Scope**: Model performance, bias, drift, operational impact, user satisfaction
- **Participants**: ML Ops Team, System Owner, Analyst Representative
- **Outputs**: Performance report, retraining recommendations, improvement roadmap

**RAISO Quarterly Review**:
- **Frequency**: Quarterly (Jan, Apr, Jul, Oct)
- **Scope**: Quick check - performance, incidents, compliance, user feedback
- **Participants**: RAISO, System Owner, ML Ops Lead
- **Outputs**: RAISO review memo, any urgent actions

**Quality Assurance Summary**:

| QA Activity | Status | Next Review |
|-------------|--------|-------------|
| JSP 936 Compliance Matrix | 100% COMPLIANT (27/27) | Oct 2026 |
| Data Integrity Verification | PASS | Oct 2026 |
| Ethical Compliance Review | COMPLIANT (minor recs) | Oct 2026 |
| Security Assessment | PASS (no critical vulns) | Oct 2026 |
| Continuous Improvement Plan | IN PLACE | Ongoing |
| Audit Trail | COMPREHENSIVE | Ongoing |
| Annual Review Schedule | ESTABLISHED | See above |

**Overall Quality Assurance**: **COMPLIANT** - System meets all JSP 936 quality requirements

**Assurance Activities Completed**:
- ✅ Independent quality audit (15 Oct 2025): Data provenance, quality, security verified
- ✅ Ethical compliance review (20 Oct 2025): Ethics Review Board approved with minor recommendations
- ✅ Security penetration testing (25 Oct 2025): MOD Cyber Security Team - no critical vulnerabilities
- ✅ Data integrity audit (15 Oct 2025): Provenance, quality, security all passed
- ✅ Continuous improvement planning (28 Oct 2025): Monthly/quarterly/annual activities defined, goals set
- ✅ Audit trail established (ongoing): Comprehensive logging of decisions, changes, incidents, compliance
- ✅ Annual review schedule (28 Oct 2025): JSP 936, ethics, security, performance reviews scheduled
```

---




**IMPORTANT - Auto-Populate Document Information Fields**:

Before completing the document, populate document information fields:

### Auto-populated fields:
- `[PROJECT_ID]` → Extract from project path (e.g., "001")
- `[VERSION]` → Start with "1.0" for new documents
- `[DATE]` / `[YYYY-MM-DD]` → Current date in YYYY-MM-DD format
- `[DOCUMENT_TYPE_NAME]` → Document purpose
- `ARC-[PROJECT_ID]-JSP936-v[VERSION]` → Generated document ID (for filename: `ARC-{PROJECT_ID}-JSP936-v1.0.md`)
- `[STATUS]` → "DRAFT" for new documents
- `[CLASSIFICATION]` → Default to "OFFICIAL" (UK Gov) or "PUBLIC"

### User-provided fields:
- `[PROJECT_NAME]` → Full project name
- `[OWNER_NAME_AND_ROLE]` → Document owner

### Revision History:
```markdown
| 1.0 | {DATE} | ArcKit AI | Initial creation from `/arckit.jsp-936` command |
```

### Generation Metadata Footer:
```markdown
**Generated by**: ArcKit `/arckit.jsp-936` command
**Generated on**: {DATE}
**ArcKit Version**: [Read from VERSION file]
**Project**: {PROJECT_NAME} (Project {PROJECT_ID})
**AI Model**: [Actual model name]
```


## Step 6: Governance & Approval Pathway

Document the governance structure and approval requirements for the AI system.

### Governance Structure

**Responsible AI Senior Officer (RAISO)**:
- **Role**: TLB-appointed senior officer responsible for ethical oversight of AI portfolio
- **Responsibilities**:
  - Maintain ethical assurance across all AI systems
  - Track system performance and risks
  - Liaise with Defence AI and Autonomy Unit
  - Certify JSP 936 compliance
  - Quarterly reviews of AI systems
  - Sign-off for major changes or deployments
- **For This System**: [Name, appointment date, contact]

**Ethics Manager** (for large/significant projects):
- **Role**: Embedded in project team, day-to-day ethics oversight
- **Responsibilities**:
  - Monitor ethical compliance during development
  - Facilitate ethics workshops and reviews
  - Escalate ethical concerns to RAISO
  - Document ethical decisions and rationale
- **For This System**: [Name, if applicable]

**Independent Ethics Assurance**:
- **Role**: External ethics experts provide independent review
- **Frequency**: Annual for deployed systems, milestone reviews during development
- **Composition**: 3-5 experts (AI ethics, defence ethics, domain experts, civil society)
- **Outputs**: Ethics review report, recommendations, approval/concerns

### Approval Pathway

Based on risk classification, determine approval authority:

| Classification | Approval Authority | Documentation Required |
|----------------|-------------------|------------------------|
| **Critical** | 2PUS or Ministers | Full JSP 936 package + ministerial brief |
| **Severe** | Defence-Level (JROC/IAC) | Full JSP 936 package + JROC submission |
| **Major** | Defence-Level (JROC/IAC) | Full JSP 936 package + JROC submission |
| **Moderate** | TLB-Level (delegated) | Full JSP 936 package + TLB approval |
| **Minor** | TLB-Level (delegated) | Lightweight JSP 936 package + TLB approval |

**Approval Process**:
2. **Initial Approval** (before development starts):
   - AI use case justification
   - Ethical risk assessment
   - Governance structure proposed
   - Approval to proceed with development

3. **Design Approval** (after requirements/architecture):
   - Requirements package (FR/NFR/ETH/SAF/SEC)
   - Architecture design
   - Hazard analysis
   - Approval to proceed with implementation

4. **Deployment Approval** (after V&V):
   - Full JSP 936 lifecycle documentation (8 phases)
   - V&V report (pass/fail on requirements)
   - UAT results (user acceptance)
   - Operational readiness review
   - **Final approval to deploy**

5. **Annual Re-Approval**:
   - Annual JSP 936 compliance review
   - Performance report
   - Ethics review
   - Security audit
   - Approval for continued use

### Escalation Criteria

**When to escalate to higher approval authority**:
- Unacceptable risk criteria met (significant negative impacts imminent, severe harms occurring)
- Performance degrades >10% from baseline
- Major security incident (breach, adversarial attack)
- Ethical concerns raised by stakeholders
- Change in operational context (new mission, new risks)

### Example Governance Documentation

```markdown
## Governance & Approval: Threat Detection Model

**Risk Classification**: **MAJOR** (12/25)

**Approval Authority**: Defence-Level (JROC/IAC)

**Responsible AI Senior Officer (RAISO)**:
- **Name**: Air Commodore Jane Smith
- **Appointment**: TLB RAISO, appointed 1 Jan 2025
- **Responsibilities**: Oversight of TLB AI portfolio (12 systems), JSP 936 compliance certification
- **For This System**: Quarterly reviews, signed-off on all major milestones

**Ethics Manager**:
- **Name**: Dr. John Doe, Ethics Lead (embedded in project team)
- **Appointment**: Project Ethics Manager, 1 Feb 2025 - 31 Dec 2025
- **Responsibilities**: Day-to-day ethics oversight, facilitate ethics workshops, escalate concerns to RAISO
- **Activities**: 4 ethics workshops, monthly ethics reviews, documentation of ethical decisions

**Independent Ethics Assurance**:
- **Composition**: 3 external ethics experts
  - Prof. Alice Brown (AI Ethics, University of Oxford)
  - Dr. Bob Green (Defence Ethics, King's College London)
  - Ms. Carol White (Human Rights, Amnesty International UK)
- **Frequency**: Annual review
- **Completed Reviews**:
  - 20 Oct 2025: Approved with minor recommendations (see Phase 8)
  - Next: Oct 2026

**Approval History**:
2. **Initial Approval** (15 Feb 2025):
   - Approved by: JROC
   - Documents: AI use case justification, ethical risk assessment (MAJOR), governance structure
   - Decision: APPROVE to proceed with development

3. **Design Approval** (15 Apr 2025):
   - Approved by: JROC
   - Documents: Requirements (FR/NFR/ETH/SAF/SEC), architecture design, HAZOP
   - Decision: APPROVE to proceed with implementation

4. **Deployment Approval** (5 Sep 2025):
   - Approved by: JROC
   - Documents: Full JSP 936 lifecycle (8 phases), V&V report (pass), UAT 94%, operational readiness
   - Decision: APPROVE for deployment
   - Conditions: Annual review required, continuous monitoring mandatory

5. **Annual Re-Approval** (due Oct 2026):
   - Scheduled: Oct 2026
   - Documents: Annual JSP 936 compliance review, performance report, ethics review, security audit
   - Expected Decision: [pending]

**Escalation Criteria**:
- Performance degradation >10% (current: 89.5%, trigger: <79%)
- False negative rate >30% (current: 13.9%, trigger: >30%)
- Major security incident
- Ethical concerns from stakeholders or ethics board
- Change in operational context (new mission)

**Escalation Procedure**:
1. ML Ops or analyst identifies issue → reports to System Owner
2. System Owner assesses severity → escalates to RAISO if major
3. RAISO convenes emergency review (System Owner, Ethics Manager, ML Ops Lead, Security)
4. Review determines action: halt deployment, mitigate risk, escalate to JROC
5. If escalated to JROC: submit incident report, risk assessment, proposed action
6. JROC decides: continue (with mitigations), pause, terminate

**Governance Dashboard** (maintained by RAISO):
- System status: OPERATIONAL (green)
- Last review: Oct 2025
- Next review: Oct 2026
- Performance: 89.5% accuracy (target: ≥85%)
- Incidents: 0 critical, 2 major (resolved), 8 minor (resolved)
- Compliance: 100% JSP 936 compliant
```

---

## Step 7: Human-AI Teaming Strategy

Document how humans and AI will work together effectively.

### Human-AI Teaming Principles

2. **Complementary Strengths**: AI handles high-volume, pattern-matching tasks; humans handle complex judgement, contextual understanding, ethical decisions

3. **Appropriate Reliance**: Users trust AI when appropriate, challenge when necessary (calibrated trust, not over-trust or under-trust)

4. **Explainable AI**: Users understand why AI made a decision (transparency builds trust and enables oversight)

5. **Human Authority**: Humans maintain decision-making authority, AI provides recommendations (human-in-loop, not human-out-of-loop)

6. **Continuous Learning**: Humans learn from AI (new patterns), AI learns from humans (corrections, edge cases)

### Human Factors Considerations

**Training Requirements**:
- AI literacy (what is AI, how does it work, limitations)
- System-specific training (how to use this AI, interpret outputs)
- Critical thinking (when to challenge AI, recognise failure modes)
- Ethical awareness (JSP 936 principles, responsibilities)

**Cognitive Load**:
- Dashboard design: intuitive, not cluttered
- Information prioritisation: most important info first (confidence, heatmap)
- Workflow integration: AI fits into existing process, minimal disruption
- Alert fatigue: avoid excessive alerts, prioritise genuine concerns

**Trust Calibration**:
- Accurate performance feedback (don't over-promise)
- Transparent about uncertainty and limitations
- Explainability features (show reasoning)
- Consistent performance (predictable behaviour builds trust)

### Operator Support

**Decision Support Features**:
- Confidence scores and uncertainty quantification
- Visual explanations (heatmaps, attention maps)
- Similar examples from training data
- Performance context (how accurate is AI in this scenario?)

**Override and Feedback**:
- Easy override mechanism (analyst can reject AI, add manual detection)
- Feedback loop (rejections logged, inform retraining)
- No penalty for challenging AI (encourage critical thinking)

**Escalation Procedures**:
- When AI is uncertain (high uncertainty, OOD), escalate to senior analyst
- When analyst is uncertain, escalate to Watch Commander
- When system fails, escalate to ML Ops team

### Example Human-AI Teaming Strategy

```markdown
## Human-AI Teaming Strategy: Threat Detection Model

**Teaming Model**: **Human-in-loop** - AI recommends, human decides

### Complementary Strengths

**AI Strengths** (leverage for efficiency):
- Fast processing (<5 min vs 30 min manual)
- 24/7 operation (tireless)
- Consistent pattern recognition (no fatigue)
- High-volume throughput (150 images/day)

**Human Strengths** (leverage for quality):
- Complex judgement (contextual understanding, nuance)
- Ethical reasoning (proportionality, necessity)
- Domain expertise (recognise novel threats, camouflage)
- Adaptability (handle unexpected scenarios)

**Division of Labor**:
- AI: Initial screening, flag potential threats, prioritise analyst workload
- Human: Review AI output, apply expertise, make final decision, report to Commander

### Training Programme (see Phase 7 for details)

**Tier 1: AI Literacy** (4 hours, all analysts):
- Build understanding of AI capabilities and limitations
- Establish realistic expectations (calibrate trust)

**Tier 2: System-Specific** (8 hours, operational analysts):
- Hands-on practice interpreting AI outputs
- Recognise failure modes (when AI struggles)
- Develop critical thinking (when to challenge AI)

**Tier 3: Refresher** (2 hours, quarterly):
- Keep knowledge current (model updates, new edge cases)
- Share best practices (lessons learned)

### Dashboard Design (cognitive load optimisation)

**Layout**:
- **Left Panel** (60% screen): Image with bounding boxes (primary focus)
- **Right Panel** (40% screen): AI insights (confidence, uncertainty, heatmap)
- **Bottom Bar**: Similar examples, model reasoning (secondary info)

**Information Hierarchy**:
2. **Most Important**: Bounding boxes on image (what AI detected)
3. **Second**: Confidence scores (how sure is AI?)
4. **Third**: Heatmap (why did AI detect this?)
5. **Fourth**: Similar examples (context for decision)

**Colour Coding** (quick visual cues):
- **Red bounding box**: High confidence (>0.8) - prioritise review
- **Yellow bounding box**: Medium confidence (0.5-0.8) - careful review
- **Grey bounding box**: Low confidence (<0.5) - likely false positive
- **Blue alert banner**: OOD or high uncertainty - manual analysis recommended

**Workflow Integration**:
- AI dashboard embedded in existing analyst workspace (same environment, no context switching)
- Existing reporting templates extended to include AI output (minimal change)
- Hotkeys for common actions (Accept: Enter, Reject: R, Override: O)

### Appropriate Reliance (trust calibration)

**Build Trust** (when AI is reliable):
- Transparent about performance: "89% accurate on similar images"
- Show reasoning: Heatmaps highlight what AI sees
- Consistent performance: AI doesn't have "off days"
- Success stories: Share cases where AI caught threats analysts missed

**Maintain Vigilance** (when AI might fail):
- Explicit about limitations: "AI struggles with camouflage, cloud cover, novel threats"
- Alert on uncertainty: "AI confidence low, manual analysis recommended"
- Encourage scepticism: "Always apply your expertise, challenge AI if something doesn't look right"
- Near-miss reporting: Share cases where AI was wrong, what analysts caught

**Calibration Feedback**:
- Monthly performance reports shared with analysts (accuracy, false positives/negatives)
- Quarterly user surveys: "Do you trust AI too much, too little, or about right?"
- Spot checks: Do analyst decisions align with AI appropriately?

### Decision Support Features (explainability)

**Confidence & Uncertainty**:
- **Confidence Score**: 0-1, what's the probability this is a threat?
- **Uncertainty**: Standard deviation from 10 forward passes (Bayesian dropout)
- **Interpretation**: "Confidence 0.9, Uncertainty 0.05 = AI is sure. Confidence 0.7, Uncertainty 0.3 = AI is guessing, be careful."

**Visual Explanations**:
- **Heatmap (Grad-CAM)**: Overlay on image, red = regions that influenced detection
- **Purpose**: Analysts can see "Is AI looking at the vehicle (good) or the shadow (bad)?"
- **Validation**: If heatmap highlights irrelevant region, analyst can reject detection

**Similar Examples**:
- Show 3 most similar images from training data
- Purpose: "Have we seen this before? Does this threat look like previous threats?"
- Helps analysts understand AI's reference frame

**Performance Context**:
- Display: "For images like this (desert, clear weather), AI is 92% accurate"
- Purpose: Analysts know when to trust AI more vs less
- Updates based on operational data

### Override and Feedback Mechanisms

**Override Actions**:
2. **Accept Detection**: Analyst confirms threat (Green checkmark button)
3. **Reject Detection**: Analyst rejects false positive (Red X button) - **must provide reason**
4. **Manual Detection**: Analyst adds threat AI missed (Draw bounding box) - **flagged for retraining**
5. **Uncertain**: Analyst unsure, escalate to senior analyst (Yellow ? button)

**Rejection Reasons** (dropdown):
- False positive (no threat present)
- Misclassification (threat is different type than AI said)
- Duplicate detection (AI flagged same threat twice)
- Outside design domain (e.g., cloudy image, AI unreliable)
- Other (free text)

**Feedback Loop** (continuous improvement):
- All rejections logged: image ID, AI output, analyst decision, reason
- Monthly review by ML Ops: Are there common failure modes? Do we need retraining?
- Manual detections (AI misses) prioritised for retraining dataset
- Feedback informs quarterly model updates

**No Penalty for Challenging AI**:
- Analyst performance evaluated on correct final decisions, not on agreement with AI
- Encourage critical thinking: "Your expertise is valuable, trust your judgement"
- Celebrate good catches: Monthly "Best AI Challenge" award for analyst who caught important AI error

### Escalation Procedures

**Escalation Triggers**:
2. **High Uncertainty**: Uncertainty >0.3 → AI alerts analyst "Low confidence, manual analysis recommended"
3. **OOD Input**: Image outside design domain → AI flags, analyst performs manual analysis
4. **Analyst Uncertain**: Analyst unsure about detection → escalate to senior analyst or Watch Commander
5. **System Failure**: AI unavailable → fall back to manual-only, notify ML Ops

**Escalation Process**:
- **Level 1**: AI uncertain → Analyst reviews manually
- **Level 2**: Analyst uncertain → Senior Analyst reviews
- **Level 3**: Senior Analyst uncertain → Watch Commander decides
- **Level 4**: System failure → ML Ops team investigates, System Owner notified

### Monitoring Team Effectiveness (human-AI performance)

**Metrics** (tracked monthly):
- **AI-Assisted Accuracy**: Are analyst+AI decisions correct? (Target: ≥95%)
- **Time Savings**: How much faster is analysis with AI? (Target: ≥40%)
- **Override Rate**: How often do analysts reject AI? (Baseline: ~8%, concerning if suddenly increases)
- **Miss Rate**: How often do analysts miss threats? (Target: <5%)
- **User Satisfaction**: Quarterly survey (Target: ≥4/5)

**Red Flags** (indicate teaming issues):
- Over-reliance: Analysts accepting AI without review (spot checks show superficial reviews)
- Under-trust: Analysts ignoring AI even when accurate (high rejection rate >20% but AI correct)
- Deskilling: Analysts struggling with manual analysis (performance drops in manual-only exercises)
- Cognitive overload: Analysts reporting dashboard confusing or overwhelming

**Corrective Actions**:
- Over-reliance: Refresher training on limitations, manual-only exercises (maintain skills)
- Under-trust: Calibration training, share AI successes, investigate if AI performance degraded
- Deskilling: Regular manual-only exercises, rotate duties (mix AI-assisted and manual days)
- Cognitive overload: Dashboard redesign, user testing, simplify information presentation

### Human-AI Teaming Success Metrics

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| AI-Assisted Accuracy | ≥95% | 96% | ✅ **EXCEEDS** |
| Time Savings | ≥40% | 45% | ✅ **EXCEEDS** |
| Override Rate (rejections) | 5-15% | 8% | ✅ **GOOD** |
| Miss Rate | <5% | 3% | ✅ **GOOD** |
| User Satisfaction | ≥4/5 | 4.2/5 | ✅ **GOOD** |

**Overall Human-AI Teaming**: **EFFECTIVE** - Complementary strengths leveraged, appropriate reliance, users satisfied
```

---

## Step 8: Secure by Design Evidence

Document security measures specific to AI systems.

### AI-Specific Threat Landscape

**Adversarial Threats**:
2. **Adversarial Examples**: Carefully crafted inputs that fool AI (e.g., add imperceptible noise to image, AI misclassifies)
3. **Data Poisoning**: Inject malicious data into training set (e.g., backdoor triggers)
4. **Model Evasion**: Adversary crafts inputs to avoid detection
5. **Model Extraction**: Steal model via API queries
6. **Model Inversion**: Reconstruct training data from model

**Operational Threats**:
7. **Model Drift**: Performance degrades as data distribution shifts
8. **Insider Threat**: Malicious insider modifies model or data
9. **Supply Chain**: Compromised third-party components (libraries, pre-trained models)

### Security Controls for AI

**Input Validation & Sanitisation**:
- Validate image format, resolution, metadata
- Reject malformed or suspicious inputs
- Input preprocessing (normalisation, resize) can mitigate some adversarial examples

**Adversarial Defenses**:
- **Adversarial Training**: Train model on adversarial examples (improves robustness)
- **Input Transformation**: Random resize, JPEG compression, bit depth reduction
- **Ensemble Methods**: Multiple models, vote on output (harder to fool all)
- **Certified Defenses**: Provable robustness bounds (research area, not yet operational)

**Model Security**:
- **Encryption**: Encrypt model at rest (AES-256) and in transit (TLS 1.3)
- **Access Controls**: Restrict model access (need-to-know, SC clearance minimum)
- **Model Watermarking**: Embed unique identifier (detect model theft)
- **Output Randomisation**: Add noise to API outputs (prevent model extraction)

**Data Security**:
- **Data Provenance**: Verify all training data sources, chain of custody
- **Data Validation**: Check for anomalies, statistical tests for poisoning
- **Secure Storage**: Encrypt data, access logs, secure deletion
- **Differential Privacy**: Add noise during training (prevent model inversion)

**Monitoring & Detection**:
- **Performance Monitoring**: Detect drift (performance drops may indicate attack)
- **Anomaly Detection**: Flag unusual inputs or outputs (potential adversarial examples)
- **Audit Logging**: Comprehensive logs for forensics
- **Incident Response**: Plan for AI security incidents

### Example Secure by Design Documentation

```markdown
## Secure by Design: Threat Detection Model

### Threat Model (STRIDE Analysis)

| Threat | Example | Likelihood | Impact | Risk | Mitigation |
|--------|---------|------------|--------|------|------------|
| **Spoofing** | Adversary impersonates legitimate user | Low | Major | Moderate | Authentication (SC clearance), access logs |
| **Tampering** | Adversary modifies model or data | Very Low | Critical | Moderate | Encryption, access controls, integrity checks |
| **Repudiation** | User denies action | Low | Minor | Low | Audit logging (all actions logged) |
| **Information Disclosure** | Adversary steals model or data | Low | Critical | Moderate | Encryption, access controls, output randomisation |
| **Denial of Service** | Adversary overwhelms system | Very Low | Moderate | Low | Rate limiting, redundancy, DDoS protection |
| **Elevation of Privilege** | Adversary gains unauthorised access | Very Low | Critical | Moderate | Principle of least privilege, RBAC |
| **Adversarial Examples** (AI-specific) | Adversary crafts input to fool model | Possible | Major | **High** | **Adversarial training, input defenses** |
| **Data Poisoning** (AI-specific) | Adversary injects malicious training data | Rare | Critical | Moderate | Data provenance verification, validation |
| **Model Extraction** (AI-specific) | Adversary steals model via API | Possible | Major | **High** | **Output randomisation, rate limiting** |
| **Model Inversion** (AI-specific) | Adversary reconstructs training data | Rare | Major | Moderate | Differential privacy |

**Highest Risks**: Adversarial Examples, Model Extraction - prioritise mitigations

### AI-Specific Security Controls

**1. Adversarial Robustness**

**Defense: Adversarial Training**
- **Method**: Augment training data with adversarial examples (FGSM, PGD)
- **Implementation**: 20% of training batches are adversarial examples
- **Result**: Adversarial accuracy 78% (baseline 89%) - 11% drop, acceptable (target ≥70%)

**Defense: Input Transformation**
- **Method**: Random resize (±10%), JPEG compression (quality 85-95%), bit depth reduction (8-bit)
- **Purpose**: Disrupt adversarial perturbations while preserving legitimate image features
- **Result**: Combined with adversarial training, achieves 78% adversarial accuracy

**Defense: Ensemble Methods**
- **Method**: 3 models (ResNet-50, ResNet-101, EfficientNet), vote on output
- **Purpose**: Harder to craft adversarial example that fools all 3 models
- **Result**: Ensemble adversarial accuracy 82% (4% improvement over single model)
- **Trade-off**: 3× inference time (15 min) - **not used operationally due to latency**, but available for high-priority images

**Testing: Adversarial Robustness**
- **Methods Tested**: FGSM, PGD, C&W (see Phase 6)
- **Results**: 78% accuracy (≥70% target) - **PASS**

**2. Data Poisoning Prevention**

**Defense: Data Provenance Verification**
- **Process**: All 50,000 training images traced to MOD Satellite Archive
- **Chain of Custody**: Documented from satellite → archive → extraction → labelling
- **No External Data**: Zero commercially sourced or open-source data (contamination risk)
- **Result**: Provenance 100% verified (see Phase 8)

**Defense: Data Validation**
- **Statistical Tests**: Check for distribution anomalies (outliers, unusual patterns)
- **Labelling Consistency**: Inter-rater agreement κ=0.87 (good), disputed images adjudicated
- **Backdoor Testing**: Test model on trigger patterns (e.g., specific image patch) - no backdoors detected
- **Result**: No evidence of data poisoning

**3. Model Extraction Prevention**

**Defense: Output Randomisation**
- **Method**: Add noise to confidence scores (±0.02 uniform noise)
- **Purpose**: Each query returns slightly different output (model extraction requires consistent outputs)
- **Result**: 10,000 queries insufficient to replicate model (tested by security team)
- **Trade-off**: Minimal impact on analyst use (noise negligible for decision-making)

**Defense: Rate Limiting**
- **Method**: Max 100 queries/user/hour, 1,000 queries/user/day
- **Purpose**: Prevent adversary from making millions of queries needed for model extraction
- **Result**: Legitimate users average 50 queries/day, limit not restrictive

**Defense: API Access Logging**
- **Method**: Log all API queries (user, timestamp, image ID, output)
- **Purpose**: Detect anomalous query patterns (e.g., automated scraping)
- **Result**: Logs reviewed weekly, no suspicious patterns detected

**4. Model Inversion Prevention**

**Defense: Differential Privacy**
- **Method**: Add noise during training (ε=8 differential privacy)
- **Purpose**: Prevent adversary from reconstructing individual training images from model
- **Result**: Model inversion attacks fail to reconstruct recognisable images
- **Trade-off**: Minimal accuracy drop (0.5%) - acceptable

**5. Model Security (Confidentiality & Integrity)**

**Defense: Model Encryption**
- **At Rest**: AES-256 encryption, key managed by MOD key management service
- **In Transit**: TLS 1.3 for all model transfers (training → deployment, deployment → inference)
- **Result**: Penetration testing confirms no unencrypted model access

**Defense: Access Controls**
- **Authentication**: SC clearance minimum for all users
- **Authorisation**: RBAC - analysts (inference only), ML Ops (inference + update), system owner (full access)
- **Result**: Principle of least privilege enforced

**Defense: Model Watermarking**
- **Method**: Embed unique identifier in model weights (imperceptible, survives fine-tuning)
- **Purpose**: If model is stolen, watermark can prove ownership
- **Result**: Watermark detected with 99% confidence after testing

**6. Secure Deployment**

**Defense: Isolated Execution**
- **Method**: Kubernetes cluster in MOD secure cloud (SECRET environment), air-gapped where possible
- **Network Isolation**: Firewall rules, no internet access, VPN-only access
- **Result**: Penetration testing confirms no external network access

**Defense: Principle of Least Privilege**
- **Containers**: Run as non-root user, minimal privileges
- **Secrets**: Stored in Kubernetes secrets, not in code or config files
- **Result**: Security audit confirms least privilege enforced

**Defense: Vulnerability Management**
- **Scanning**: Weekly vulnerability scans of containers, dependencies, OS
- **Patching**: Critical vulnerabilities patched within 24 hours, high within 7 days
- **Result**: Zero critical vulnerabilities, 2 minor (patched)

**7. Monitoring & Incident Response**

**Defense: Performance Monitoring**
- **Purpose**: Sudden performance drop may indicate adversarial attack or drift
- **Metrics**: Daily accuracy, false positive/negative rates
- **Alerts**: Performance drop >5% triggers ML Ops alert
- **Result**: Continuous monitoring dashboard operational (see Phase 7)

**Defense: Anomaly Detection**
- **Purpose**: Flag unusual inputs or outputs (potential adversarial examples)
- **Method**: OOD detection (uncertainty >0.3, flags 95% of OOD images)
- **Result**: OOD inputs flagged, routed to manual analysis

**Defense: Audit Logging**
- **Comprehensive Logs**: All inputs, outputs, users, timestamps, decisions
- **Storage**: Encrypted, 7-year retention, tamper-proof
- **Purpose**: Forensics if security incident occurs
- **Result**: 100% logging coverage (see Phase 8)

**Defense: Incident Response Plan**
- **AI-Specific Incidents**: Adversarial attack, data poisoning, model drift, model theft
- **Response Team**: ML Ops (24/7 on-call), Security Team, System Owner, RAISO
- **Procedure**: Detect → Triage → Contain → Investigate → Remediate → Post-Mortem
- **Result**: Incident response plan tested (tabletop exercise, 15 Oct 2025), approved

### Security Testing Results

| Security Test | Method | Result | Pass Criteria | Status |
|---------------|--------|--------|---------------|--------|
| Adversarial Robustness | FGSM, PGD, C&W attacks | 78% accuracy | ≥70% | ✅ **PASS** |
| Data Poisoning | Backdoor testing, provenance audit | No backdoors | No backdoors | ✅ **PASS** |
| Model Extraction | 10,000 API queries | Failed to replicate | >10K queries | ✅ **PASS** |
| Model Inversion | Inversion attack | Failed to reconstruct images | No reconstruction | ✅ **PASS** |
| Penetration Testing | MOD Cyber Security Team | No critical vulns, 2 minor (patched) | No critical | ✅ **PASS** |
| Vulnerability Scanning | Weekly scans | Zero critical, 2 minor (patched) | No critical | ✅ **PASS** |

**Overall Security Assessment**: **ROBUST** - All AI-specific threats mitigated, no critical vulnerabilities

### Security Compliance

| Standard | Requirement | Status |
|----------|-------------|--------|
| JSP 440 (MOD Security) | SECRET classification handling | ✅ **COMPLIANT** |
| JSP 936 (AI in Defence) | Secure by Design for AI | ✅ **COMPLIANT** |
| DPA 2018 (Data Protection) | Data governance, security | ✅ **COMPLIANT** |
| Cyber Essentials Plus | Basic cyber hygiene | ✅ **CERTIFIED** |

**Next Security Review**: Oct 2026 (annual penetration testing, security audit)
```

---

## Step 9: Supplier Assurance (if applicable)

If AI components are sourced from third-party suppliers, document assurance requirements.

### Supplier Assurance Requirements

**Competence**:
- [ ] Supplier has demonstrated AI expertise (relevant projects, qualifications)
- [ ] Supplier understands MOD requirements (security, ethics, assurance)
- [ ] Supplier has quality management system (ISO 9001 or equivalent)

**Data Provenance**:
- [ ] Supplier provides full data provenance (sources, labelling, chain of custody)
- [ ] Training data is suitable for MOD use (no commercial/open-source if restricted)
- [ ] Data quality is documented (labelling accuracy, representativeness, biases)

**Model Transparency**:
- [ ] Supplier provides model card (architecture, performance, limitations)
- [ ] Supplier documents training process (hyperparameters, iterations, checkpoints)
- [ ] Supplier provides explainability (how does model make decisions?)

**Security**:
- [ ] Supplier follows Secure by Design practices
- [ ] Supplier addresses AI-specific threats (adversarial robustness, data poisoning)
- [ ] Supplier provides security documentation (threat model, controls, testing)

**MOD Policy Compliance**:
- [ ] Supplier complies with JSP 936 (ethical AI)
- [ ] Supplier complies with JSP 440 (MOD security)
- [ ] Supplier complies with DPA 2018 (data protection)

**Ongoing Support**:
- [ ] Supplier provides updates and retraining (model maintenance)
- [ ] Supplier provides incident response (if model fails or is attacked)
- [ ] Supplier provides documentation and training materials

### Supplier Verification

**Pre-Award**:
- Supplier capability assessment (technical, ethical, security)
- Supplier references (previous projects, MOD or similar)
- Supplier proposal review (does it meet JSP 936 requirements?)

**During Development**:
- Regular progress reviews (monthly or milestone-based)
- Independent verification of supplier deliverables (V&V team)
- Ethical and security audits (compliance with JSP 936, JSP 440)

**Acceptance Testing**:
- Supplier provides full documentation (lifecycle phases 1-8)
- Independent V&V (MOD team tests supplier-provided AI)
- Acceptance criteria met (all FR/NFR/ETH/SAF/SEC requirements)

**Post-Deployment**:
- Supplier performance monitoring (does AI meet specifications in operation?)
- Supplier support responsiveness (incident response, updates)
- Annual supplier review (continued compliance with MOD policies)

### Example Supplier Assurance Documentation

```markdown
## Supplier Assurance: Threat Detection Model

**Note**: This system was developed in-house (MOD + Dstl), not supplied by third-party.

**If this were a third-party supply**:

### Supplier Information
- **Supplier**: [Company Name]
- **Contract**: [Contract Number, £value, duration]
- **Deliverable**: Threat Detection Model (CNN for satellite imagery)

### Supplier Competence Assessment (Pre-Award)
- [x] Demonstrated AI expertise: Previous projects for UK Government, 10+ AI engineers
- [x] MOD requirements understanding: Security cleared (SC), familiar with JSP 936
- [x] Quality management: ISO 9001 certified

### Data Provenance Verification (During Development)
- [x] Supplier provided data provenance: 50,000 images from MOD archive (verified by MOD)
- [x] No commercial/open-source data: Confirmed, all MOD-sourced
- [x] Data quality documented: Inter-rater agreement κ=0.87, bias analysis completed

### Model Transparency (During Development)
- [x] Model card provided: ResNet-50 + FPN, 89% accuracy, limitations documented
- [x] Training process documented: Hyperparameters, 87 epochs, checkpoints provided
- [x] Explainability: Grad-CAM heatmaps, confidence/uncertainty quantification

### Security Verification (During Development)
- [x] Secure by Design: Supplier followed MOD secure development practices
- [x] AI-specific threats: Adversarial training, data provenance, model encryption implemented
- [x] Security testing: Penetration testing by MOD Cyber Security Team, passed

### MOD Policy Compliance (During Development)
- [x] JSP 936 compliance: Full lifecycle documentation (8 phases), ethical risk assessment (MAJOR)
- [x] JSP 440 compliance: SECRET classification handling, access controls, encryption
- [x] DPA 2018 compliance: Data governance, security measures, privacy impact assessment

### Independent Verification & Validation (Acceptance Testing)
- [x] Documentation review: MOD V&V team reviewed all supplier deliverables, comprehensive
- [x] Independent testing: MOD V&V team tested model on held-out test set, 89% accuracy (matches supplier claim)
- [x] Acceptance criteria: All FR/NFR/ETH/SAF/SEC requirements met
- [x] Decision: **ACCEPTED** (10 Aug 2025)

### Supplier Performance Monitoring (Post-Deployment)
- Supplier provides quarterly model updates (retraining on new data)
- Supplier provides 24/7 incident response (SLA: critical <1 hour, major <4 hours)
- Supplier performance reviewed annually (next: Oct 2026)

### Supplier Assurance Sign-Off
- **Technical Authority**: [Name, MOD], Approved (10 Aug 2025)
- **Security Authority**: [Name, MOD Cyber Security], Approved (10 Aug 2025)
- **RAISO**: [Name], Approved (10 Aug 2025)
```

---

## Step 10: Continuous Monitoring & Re-Assessment Plan

Document how AI system will be monitored and re-assessed throughout its operational life.

### Continuous Monitoring

**Real-Time Monitoring** (automated, dashboard):
- Performance metrics (accuracy, latency, availability)
- Drift detection (distribution shift, performance degradation)
- Security events (anomalous inputs, access violations)
- Operational metrics (throughput, user feedback)

**Periodic Monitoring** (manual, reports):
- Weekly: Performance by subgroup (region, terrain, weather)
- Monthly: Comprehensive performance report, bias analysis, feedback analysis
- Quarterly: Strategic review, user satisfaction, model card update
- Annual: Full JSP 936 compliance review, ethics review, security audit

### Drift Detection & Retraining

**Types of Drift**:
2. **Data Drift**: Input distribution changes (e.g., new geographic region, different satellite)
3. **Concept Drift**: Relationship between input and output changes (e.g., new threat types)
4. **Performance Drift**: Model accuracy degrades over time

**Detection Methods**:
- Statistical tests (KL divergence, Kolmogorov-Smirnov test)
- Performance monitoring (accuracy drop >5% from baseline)
- Analyst feedback (increased rejection rate, manual additions)

**Retraining Triggers**:
- **Automatic**: Performance drops >5% (accuracy <84%)
- **Scheduled**: Quarterly retraining with new operational data
- **On-Demand**: Significant data drift detected, new threat types emerge

**Retraining Process**:
1. Collect new operational data (labelled by analysts via feedback loop)
2. Re-assess training data (representativeness, bias)
3. Retrain model (fine-tune on new data)
4. Test new model (A/B testing against current model)
5. If new model better: deploy with rollback capability
6. If new model worse: investigate, adjust training, try again

### Re-Assessment & Re-Approval

**Annual JSP 936 Compliance Review**:
- Full lifecycle documentation reviewed
- Performance report (has accuracy maintained ≥85%?)
- Bias analysis (performance disparity still <10%?)
- Ethical compliance (5 principles still met?)
- Security audit (no new vulnerabilities?)
- Operational impact (time savings, user satisfaction)
- **Decision**: Continue use (with any mitigations) or retire system

**Trigger Events for Re-Approval** (outside annual review):
- Major model update (architecture change, significant retraining)
- Change in operational context (new mission, new risks)
- Major security incident (breach, adversarial attack)
- Ethical concerns (stakeholder complaints, ethics board concerns)
- Performance degradation >10% (unresolved after retraining)

**Re-Approval Process**:
- Submit updated JSP 936 documentation (changes since last approval)
- RAISO review and recommendation
- Approval authority (same as original: JROC for MAJOR risk)
- Decision: Continue, modify, or retire system

### System Retirement

**Retirement Criteria**:
- Performance consistently fails to meet requirements (<85% accuracy despite retraining)
- Unacceptable ethical risk (cannot be mitigated)
- Operational context changes (AI no longer needed or suitable)
- Superseded by better system

**Retirement Process**:
1. Decision to retire (System Owner, RAISO, approval authority)
2. Transition plan (fallback to alternative system or manual process)
3. Decommissioning (secure deletion of model and data)
4. Post-retirement review (lessons learned, documentation archival)

### Example Continuous Monitoring Plan

```markdown
## Continuous Monitoring & Re-Assessment: Threat Detection Model

### Real-Time Monitoring Dashboard (Grafana)

**Performance Panel** (updated every 1 hour):
- Accuracy (rolling 24-hour, 7-day)
- Precision, Recall, F1 Score
- False Positive Rate, False Negative Rate
- **Alerts**: Accuracy <84% (red), <87% (yellow)

**Drift Panel** (updated daily):
- Input distribution (KL divergence vs training data)
- Performance by subgroup (region, terrain, weather)
- **Alerts**: KL divergence >0.1 (possible data drift), performance disparity >10% (possible bias drift)

**Security Panel** (real-time):
- Anomalous inputs (OOD rate, unusual patterns)
- Access violations (unauthorised access attempts)
- **Alerts**: OOD rate >10%, access violations >0

**Operational Panel** (updated hourly):
- Throughput (images processed/hour)
- Latency (processing time, 95th percentile)
- Availability (uptime %)
- User feedback (confirmations, rejections, manual additions)
- **Alerts**: Latency >5 min, availability <99%, rejection rate >20%

### Periodic Monitoring Reports

**Weekly Report** (generated Monday, emailed to ML Ops Lead):
- Performance by subgroup (region, terrain, weather)
- Edge cases encountered (OOD images, low confidence, unusual detections)
- Analyst feedback summary (rejections, manual additions)
- **Action Items**: Investigate any performance drop >3%, edge cases >5%

**Monthly Report** (generated 1st of month, reviewed by System Owner):
- Comprehensive performance metrics (accuracy, precision, recall, mAP)
- Bias analysis (performance across regions/terrain/weather)
- Drift analysis (KL divergence, performance trends)
- Feedback analysis (common rejection reasons, AI misses)
- User satisfaction (spot checks, informal surveys)
- **Decision**: Retraining needed? (Yes if performance <87% or significant drift)

**Quarterly Report** (generated end of quarter, reviewed by RAISO):
- Strategic review (operational impact, time savings, threat detection improvements)
- User satisfaction survey (formal, all 20 analysts)
- Ethical review (compliance with 5 principles, any concerns)
- Security review (incidents, vulnerabilities, threat landscape changes)
- Model card update (performance, limitations, changes since last quarter)
- **Decision**: Continue as-is, adjust, or escalate concerns

**Annual Report** (generated end of year, submitted to JROC):
- Full JSP 936 compliance review (27 requirements)
- Performance over 12 months (trends, degradation, improvements)
- Ethics review (independent ethics board report)
- Security audit (MOD Cyber Security Team report)
- Operational impact assessment (quantitative and qualitative benefits)
- **Decision**: Re-approve for another year, modify, or retire

### Drift Detection & Retraining

**Data Drift Detection**:
- **Method**: KL divergence between operational data distribution and training data distribution
- **Threshold**: KL divergence >0.1 triggers investigation
- **Current Status** (as of Oct 2025): KL divergence = 0.05 (acceptable)

**Concept Drift Detection**:
- **Method**: Performance degradation on operational data (accuracy, precision, recall)
- **Threshold**: Accuracy <87% triggers retraining (performance cushion before critical <85%)
- **Current Status**: Accuracy = 89.5% (stable)

**Performance Drift Detection**:
- **Method**: Rolling 7-day accuracy compared to baseline (89%)
- **Threshold**: Drop >5% (to <84%) triggers automatic retraining
- **Current Status**: 89.5% (no drift)

**Retraining Schedule**:
- **Quarterly Scheduled Retraining**: Every 3 months (Jan, Apr, Jul, Oct)
- **Purpose**: Incorporate new operational data (labelled via analyst feedback), maintain performance
- **Process**:
  1. Collect operational data from past 3 months (~13,500 images)
  2. Analysts label new data (prioritise rejections and manual additions)
  3. Augment training set (35,000 original + 13,500 new = 48,500)
  4. Retrain model (fine-tune from current model, 20 epochs)
  5. A/B testing (new model vs current model on held-out validation set)
  6. Deploy if new model ≥current model performance, else investigate

**Last Retraining**: Oct 2025 (initial deployment)
**Next Scheduled Retraining**: Jan 2026

**On-Demand Retraining Triggers**:
- Accuracy drops <87% (retraining triggered immediately)
- Significant data drift (KL divergence >0.1)
- New threat type emerges (e.g., novel vehicle, not in training data)
- Geographic expansion (e.g., deploy to new region with <20% training data representation)

### Re-Assessment & Re-Approval

**Annual JSP 936 Compliance Review** (Oct 2026):
- **Participants**: RAISO, System Owner, Ethics Review Board, V&V Team, Security Team
- **Documents**:
  - Updated JSP 936 lifecycle documentation (any changes in past 12 months)
  - Annual performance report (accuracy, bias, drift)
  - Ethics review report (independent ethics board)
  - Security audit report (MOD Cyber Security Team)
  - Operational impact assessment (time savings, threat detection improvements)
- **Review Items**:
  - [ ] Performance maintained ≥85%?
  - [ ] Bias <10% disparity?
  - [ ] 5 ethical principles still met?
  - [ ] No critical security vulnerabilities?
  - [ ] User satisfaction ≥90%?
  - [ ] Operational benefit sustained?
- **Decision**: Continue (re-approve for 2026-2027), modify (with conditions), or retire

**Trigger Events for Early Re-Approval**:
2. **Major Model Update**: If architecture changes or significant retraining (>50% new data)
   - Process: Submit updated documentation to RAISO, RAISO reviews, JROC re-approval
3. **Change in Operational Context**: If new mission or risk profile changes
   - Process: Re-assess ethical risk, update classification if needed, seek appropriate approval
4. **Major Security Incident**: If breach, adversarial attack, or model theft
   - Process: Incident investigation, security remediation, security re-audit, RAISO/JROC review
5. **Ethical Concerns**: If stakeholders or ethics board raise concerns
   - Process: Ethics investigation, mitigation plan, ethics board review, RAISO/JROC decision
6. **Performance Degradation >10%**: If accuracy <79% despite retraining attempts
   - Process: Root cause analysis, mitigation attempts, if unresolved, consider retirement

**Re-Approval History**:
- Initial Approval: 5 Sep 2025 (JROC)
- Next Annual Re-Approval: Oct 2026
- Trigger Events: None to date

### System Retirement (If Necessary)

**Retirement Criteria**:
- Performance failure: Accuracy <85% sustained despite multiple retraining attempts (>3 months)
- Unacceptable risk: Ethical concerns cannot be mitigated, risk reclassified to CRITICAL (unacceptable)
- Operational irrelevance: Mission changes, AI no longer needed or suitable
- Superseded: New system developed with superior performance and safety

**Retirement Process**:
2. **Decision to Retire**:
   - Recommendation: System Owner, RAISO
   - Approval: JROC (same authority as deployment approval)
   - Rationale documented

3. **Transition Plan** (6-month transition period):
   - Fallback to manual-only analysis (existing capability, no disruption)
   - OR: Transition to successor system (if available)
   - Train analysts on manual-only procedures (refresher, 4 hours)

4. **Decommissioning**:
   - Model deletion: Secure wipe of all model files (backups included)
   - Data handling: Operational data retained per MOD records policy (7 years), training data retained if no privacy concerns
   - Infrastructure: Kubernetes cluster deprovisioned, resources reallocated

5. **Post-Retirement Review**:
   - Lessons learned: What worked? What didn't? Why retire?
   - Documentation archival: Full JSP 936 documentation archived (project records)
   - Knowledge transfer: Share lessons with Defence AI and Autonomy Unit, inform future AI projects

**Retirement Contingency**: If system must be retired urgently (e.g., critical security breach):
- Immediate shutdown (<24 hours)
- Fallback to manual-only (analysts trained, can resume immediately)
- Emergency review within 1 week (System Owner, RAISO, Security Team)
- Decision: Attempt remediation and restoration OR permanent retirement

### Continuous Improvement Metrics (2026 Goals)

| Goal | Baseline (Oct 2025) | Target (Oct 2026) | Status |
|------|---------------------|-------------------|--------|
| Accuracy | 89.5% | ≥90% | On track |
| Performance disparity | 6% | <5% | On track |
| Recall | 86% | ≥90% | On track |
| False positive rate | 3.2% | <2% | On track |
| User satisfaction | 4.2/5 | ≥4.5/5 | On track |
| Geographic diversity (training data) | 65% ME, 20% EU, 15% Asia | 40% ME, 30% EU, 30% Asia | In progress |

**Overall Continuous Monitoring**: **ROBUST** - Comprehensive real-time and periodic monitoring, drift detection, retraining plan, re-assessment process
```

---

## Output Generation

Now, **compile all documentation** into a comprehensive JSP 936 AI Assurance package.

### Output Structure

```markdown
# JSP 936 AI Assurance Documentation
## [Project Name]: [AI System Name]

**Classification**: [Critical/Severe/Major/Moderate/Minor]
**Approval Pathway**: [2PUS/Defence-Level/TLB-Level]
**Date**: [DD Month YYYY]
**Version**: [X.Y]

---

## Executive Summary

[2-3 pages maximum, suitable for approval authority]

- **AI System Overview**: What is it? What does it do?
- **Ethical Risk Classification**: Risk score, rationale, approval pathway
- **Key Ethical Considerations**: Highest risks, mitigation strategies
- **Governance**: RAISO, Ethics Manager, approval status
- **Assurance Status**: JSP 936 compliance, V&V results, user acceptance
- **Recommendation**: [APPROVE for deployment / CONTINUE operation / RETIRE]

---

## 1. AI System Inventory

### [AI Component 1 Name]
- **Type**: [ML model type, e.g., CNN, LLM, RL agent]
- **Purpose**: [What problem does it solve?]
- **Input Data**: [What does it consume?]
- **Output/Decision**: [What does it produce or decide?]
- **Human Involvement**: [Where do humans interact or override?]
- **Training Data**: [Source, size, characteristics]
- **Model Type**: [Algorithm/architecture]
- **Deployment Context**: [Where and how is it used?]
- **Criticality**: [Impact if it fails or makes errors]

[Repeat for each AI component]

---

## 2. Ethical Risk Assessment

[For each AI component]

### [AI Component Name]

#### Impact Analysis (Scale: 1-5)
- **Human Safety**: [Score, rationale]
- **Operational Effectiveness**: [Score, rationale]
- **Legal & Ethical Compliance**: [Score, rationale]
- **Public Trust**: [Score, rationale]
- **International Obligations**: [Score, rationale]
- **Overall Impact Score**: [1-5]

#### Likelihood Analysis (Scale: 1-5)
- **Technology Maturity**: [TRL, score, rationale]
- **Data Quality**: [Score, rationale]
- **Algorithm Complexity**: [Score, rationale]
- **Operational Environment**: [Score, rationale]
- **Human Factors**: [Score, rationale]
- **Overall Likelihood Score**: [1-5]

#### Risk Classification
- **Risk Score**: [Likelihood × Impact = X]
- **Classification**: [Critical/Severe/Major/Moderate/Minor]
- **Approval Pathway**: [2PUS/Defence-Level/TLB-Level]
- **Rationale**: [Why this classification?]

[Repeat for each AI component, then aggregate if multiple components]

---

## 3. Ethical Principles Compliance

[For each AI component, address all 5 principles]

### [AI Component Name]

#### Principle 1: Human-Centricity
- **Human Impact Analysis**: [Who is affected? Positive/negative effects?]
- **Human-AI Interaction Design**: [Interface, cognitive load, trust calibration]
- **Stakeholder Engagement**: [User consultation, feedback mechanisms]
- **Compliance Assessment**: ✅ **COMPLIANT** / ⚠️ **CONCERNS** / ❌ **NON-COMPLIANT**

#### Principle 2: Responsibility
- **Accountability Mapping**: [Who is responsible for AI outcomes?]
- **Meaningful Human Control**: [Human-in-loop/on-loop/out-of-loop?]
- **Decision Authority**: [What can AI decide autonomously?]
- **Compliance Assessment**: ✅ **COMPLIANT** / ⚠️ **CONCERNS** / ❌ **NON-COMPLIANT**

#### Principle 3: Understanding
- **Explainability Requirements**: [Model transparency, output interpretability]
- **Training Programme**: [AI literacy, system-specific, ongoing education]
- **Documentation**: [User guides, model cards, procedures]
- **Compliance Assessment**: ✅ **COMPLIANT** / ⚠️ **CONCERNS** / ❌ **NON-COMPLIANT**

#### Principle 4: Bias and Harm Mitigation
- **Bias Assessment**: [Training data representativeness, performance disparities]
- **Harm Identification**: [Direct/indirect/systemic harms, unintended consequences]
- **Mitigation Strategies**: [Data diversification, algorithmic fairness, human oversight]
- **Compliance Assessment**: ✅ **COMPLIANT** / ⚠️ **CONCERNS** / ❌ **NON-COMPLIANT**

#### Principle 5: Reliability
- **Performance Bounds**: [Design domain, performance metrics, operating conditions]
- **Robustness**: [Adversarial resilience, graceful degradation, failure modes]
- **Security**: [AI-specific threats, model security, secure deployment]
- **Compliance Assessment**: ✅ **COMPLIANT** / ⚠️ **CONCERNS** / ❌ **NON-COMPLIANT**

[Repeat for each AI component]

---

## 4. AI Lifecycle Assurance (8 Phases)

[For each AI component and each phase, document assurance activities]

### [AI Component Name]

#### Phase 1: Planning
- **Documentation**: [AI strategy, algorithm roadmap, data governance, resource plan, stakeholder map, initial risk assessment, governance structure]
- **Assurance Activities**: [Ethics workshop, data provenance audit, alternative evaluation, initial risk/benefit analysis]
- **Status**: ✅ **COMPLETE** / ⚠️ **IN PROGRESS** / ❌ **NOT STARTED**

#### Phase 2: Requirements
- **Documentation**: [FR/NFR/ETH/SAF/SEC requirements, hazard analysis, acceptance criteria, traceability]
- **Assurance Activities**: [Requirements review, hazard identification, safety/security derivation, traceability verification]
- **Status**: ✅ **COMPLETE** / ⚠️ **IN PROGRESS** / ❌ **NOT STARTED**

#### Phase 3: Architecture
- **Documentation**: [System architecture, AI pipeline, deployment architecture, traceability matrix, failure modes, security architecture, human-AI interface]
- **Assurance Activities**: [Architecture review, traceability verification, failure mode analysis, security threat modelling]
- **Status**: ✅ **COMPLETE** / ⚠️ **IN PROGRESS** / ❌ **NOT STARTED**

#### Phase 4: Algorithm Design
- **Documentation**: [Algorithm selection, design decisions, verification methods, output verification, edge case handling, explainability design]
- **Assurance Activities**: [Algorithm design review, peer review, verification method validation, edge case identification]
- **Status**: ✅ **COMPLETE** / ⚠️ **IN PROGRESS** / ❌ **NOT STARTED**

#### Phase 5: Model Development
- **Documentation**: [Training data, training process, model card, performance evaluation, bias analysis, uncertainty calibration, reuse considerations]
- **Assurance Activities**: [Data provenance audit, training documentation, independent evaluation, bias assessment, model card creation]
- **Status**: ✅ **COMPLETE** / ⚠️ **IN PROGRESS** / ❌ **NOT STARTED**

#### Phase 6: Verification & Validation
- **Documentation**: [Test plan, verification testing, validation testing, edge case testing, adversarial testing, UAT, V&V report]
- **Assurance Activities**: [Independent V&V team, test execution, issue tracking, user acceptance trials]
- **Status**: ✅ **COMPLETE** / ⚠️ **IN PROGRESS** / ❌ **NOT STARTED**

#### Phase 7: Integration & Use
- **Documentation**: [Integration plan, deployment procedure, operational procedures, monitoring plan, incident response, training, operational acceptance]
- **Assurance Activities**: [Integration testing, pilot deployment, operator training, monitoring setup, operational readiness review]
- **Status**: ✅ **COMPLETE** / ⚠️ **IN PROGRESS** / ❌ **NOT STARTED**

#### Phase 8: Quality Assurance
- **Documentation**: [JSP 936 compliance matrix, data integrity verification, ethical compliance review, security assessment, continuous improvement plan, audit trail, annual review schedule]
- **Assurance Activities**: [Independent quality audit, ethical review, security testing, data integrity audit, continuous improvement planning]
- **Status**: ✅ **COMPLETE** / ⚠️ **IN PROGRESS** / ❌ **NOT STARTED**

[Repeat for each AI component]

---

## 5. Governance & Approval

### Governance Structure
- **RAISO**: [Name, appointment date, responsibilities]
- **Ethics Manager**: [Name, if applicable]
- **Independent Ethics Assurance**: [Composition, frequency, last review]

### Approval History
- **Initial Approval**: [Date, authority, documents, decision]
- **Design Approval**: [Date, authority, documents, decision]
- **Deployment Approval**: [Date, authority, documents, decision]
- **Annual Re-Approval**: [Next date, schedule]

### Approval Authority
- **Classification**: [Risk classification]
- **Required Approval**: [2PUS/Defence-Level/TLB-Level]
- **Approval Pathway**: [Process diagram or description]

### Escalation Criteria
- [List conditions that trigger escalation to higher authority]

---

## 6. Human-AI Teaming Strategy

### Teaming Model
- [Human-in-loop / Human-on-loop / Human-out-of-loop]

### Complementary Strengths
- **AI Strengths**: [What AI does well]
- **Human Strengths**: [What humans do well]
- **Division of Labour**: [Who does what?]

### Training Programme
- [Tiers, duration, content, effectiveness]

### Dashboard Design
- [Layout, information hierarchy, colour coding, workflow integration]

### Appropriate Reliance (Trust Calibration)
- [Build trust, maintain vigilance, calibration feedback]

### Decision Support Features
- [Confidence/uncertainty, visual explanations, similar examples, performance context]

### Override and Feedback Mechanisms
- [Override actions, rejection reasons, feedback loop, no penalty for challenging AI]

### Escalation Procedures
- [Triggers, levels, process]

### Monitoring Team Effectiveness
- [Metrics, red flags, corrective actions, success metrics]

---

## 7. Secure by Design Evidence

### Threat Model
- [STRIDE analysis or equivalent, AI-specific threats]

### AI-Specific Security Controls
2. **Adversarial Robustness**: [Defenses, testing, results]
3. **Data Poisoning Prevention**: [Defenses, testing, results]
4. **Model Extraction Prevention**: [Defenses, testing, results]
5. **Model Inversion Prevention**: [Defenses, testing, results]
6. **Model Security (Confidentiality & Integrity)**: [Defenses, testing, results]
7. **Secure Deployment**: [Defenses, testing, results]
8. **Monitoring & Incident Response**: [Defenses, testing, results]

### Security Testing Results
- [Summary table: test, method, result, pass criteria, status]

### Security Compliance
- [JSP 440, JSP 936, DPA 2018, Cyber Essentials, etc.]

---

## 8. Supplier Assurance (if applicable)

[If third-party supplier]

### Supplier Information
- [Name, contract, deliverable]

### Supplier Competence Assessment
- [Expertise, MOD requirements, quality management]

### Data Provenance Verification
- [Sources, suitability, quality]

### Model Transparency
- [Model card, training process, explainability]

### Security Verification
- [Secure by Design, AI-specific threats, testing]

### MOD Policy Compliance
- [JSP 936, JSP 440, DPA 2018]

### Independent Verification
- [V&V, acceptance testing, approval]

### Supplier Performance Monitoring
- [Updates, incident response, annual review]

---

## 9. Continuous Monitoring & Re-Assessment Plan

### Real-Time Monitoring
- [Dashboard, metrics, alerts]

### Periodic Monitoring
- [Weekly/monthly/quarterly/annual reports]

### Drift Detection & Retraining
- [Types of drift, detection methods, retraining triggers, retraining process]

### Re-Assessment & Re-Approval
- [Annual review, trigger events, re-approval process]

### System Retirement (if necessary)
- [Retirement criteria, process, contingency]

### Continuous Improvement Goals
- [Metrics, targets, progress]

---

## 10. Compliance Matrix

| JSP 936 Requirement | Evidence | Status |
|---------------------|----------|--------|
| **5 Ethical Principles** | | |
| 1. Human-Centricity | [Reference to Section 3] | ✅ / ⚠️ / ❌ |
| 2. Responsibility | [Reference to Section 3] | ✅ / ⚠️ / ❌ |
| 3. Understanding | [Reference to Section 3] | ✅ / ⚠️ / ❌ |
| 4. Bias & Harm Mitigation | [Reference to Section 3] | ✅ / ⚠️ / ❌ |
| 5. Reliability | [Reference to Section 3] | ✅ / ⚠️ / ❌ |
| **Risk Classification** | [Reference to Section 2] | ✅ / ⚠️ / ❌ |
| **Governance** | | |
| RAISO appointed | [Reference to Section 5] | ✅ / ⚠️ / ❌ |
| Ethics Manager (if applicable) | [Reference to Section 5] | ✅ / ⚠️ / ❌ |
| Independent Assurance | [Reference to Section 5] | ✅ / ⚠️ / ❌ |
| **8 Lifecycle Phases** | | |
| 1. Planning | [Reference to Section 4] | ✅ / ⚠️ / ❌ |
| 2. Requirements | [Reference to Section 4] | ✅ / ⚠️ / ❌ |
| 3. Architecture | [Reference to Section 4] | ✅ / ⚠️ / ❌ |
| 4. Algorithm Design | [Reference to Section 4] | ✅ / ⚠️ / ❌ |
| 5. Model Development | [Reference to Section 4] | ✅ / ⚠️ / ❌ |
| 6. V&V | [Reference to Section 4] | ✅ / ⚠️ / ❌ |
| 7. Integration & Use | [Reference to Section 4] | ✅ / ⚠️ / ❌ |
| 8. Quality Assurance | [Reference to Section 4] | ✅ / ⚠️ / ❌ |
| **Approval Pathway** | [Reference to Section 5] | ✅ / ⚠️ / ❌ |
| **Continuous Monitoring** | [Reference to Section 9] | ✅ / ⚠️ / ❌ |

**Overall JSP 936 Compliance**: [X/Y requirements met] - [%COMPLIANT]

---

## Appendices

### Appendix A: Risk Assessment Methodology
[Detailed explanation of likelihood × impact matrix, scoring rationale]

### Appendix B: Lifecycle Phase Checklists
[For each phase, checklist of required documentation and assurance activities]

### Appendix C: Approval Pathway Flowchart
[Visual flowchart showing approval process from initial to annual re-approval]

### Appendix D: Monitoring Dashboard Design
[Screenshots or mockups of real-time monitoring dashboard]

### Appendix E: Model Card
[Full model card for each AI component]

### Appendix F: V&V Test Report
[Comprehensive test results from Phase 6]

### Appendix G: Ethics Review Reports
[Independent ethics review board reports]

### Appendix H: Security Audit Reports
[MOD Cyber Security Team audit reports]

### Appendix I: Glossary
[Definitions of key terms, acronyms]

### Appendix J: References
[JSP 936, JSP 440, DPA 2018, relevant standards and guidance]

---

**Document Control**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | [DD Mon YYYY] | [Name] | Initial version |
| [X.Y] | [DD Mon YYYY] | [Name] | [Description] |

**Approval**

| Role | Name | Signature | Date |
|------|------|-----------|------|
| RAISO | [Name] | [Signature] | [DD Mon YYYY] |
| System Owner | [Name] | [Signature] | [DD Mon YYYY] |
| [Approval Authority] | [Name] | [Signature] | [DD Mon YYYY] |

---

**Classification**: [Classification marking, e.g., SECRET]
**Handling**: [Handling instructions per JSP 440]

**End of Document**
```

---

## Final Steps

2. **Generate the document** using this template, populated with all information gathered in Steps 1-10

3. **Review for completeness**: Check that all JSP 936 requirements are addressed (27 requirements: 5 principles + risk classification + governance + 8 phases + approval + monitoring)

4. **Write the document** to the project directory:
   - **File path**: `projects/{project-name}/ARC-{PROJECT_ID}-JSP936-v1.0.md`
   - **CRITICAL**: Use the Write tool to save the file. Do NOT output the full document in your response (it will exceed token limits).

5. **Format appropriately**:
   - Use Markdown for easy editing and conversion
   - Generate DOCX if required (for formal submission)
   - Generate PDF for final approval (signed version)

6. **Share summary with user**: Provide a concise summary of the JSP 936 AI Assurance documentation package

7. **Offer follow-up support**: Ask user if they need:
   - Specific sections expanded
   - Supporting materials (e.g., presentation slides for approval authority)
   - Assistance with deployment to other projects
   - Integration with other ArcKit artifacts

---

## Example Output Summary

For a threat detection model in satellite imagery:

**Executive Summary**:
- **AI System**: Threat Detection Model (CNN for satellite imagery)
- **Classification**: MAJOR (12/25) - Defence-Level (JROC) approval
- **Key Risks**: False negatives (missed threats), false positives (resource waste), geographic bias
- **Mitigations**: Human-in-loop, continuous monitoring, bias analysis, adversarial robustness testing
- **Governance**: RAISO appointed, Ethics Manager embedded, annual independent ethics review
- **Assurance**: 100% JSP 936 compliant (27/27 requirements), V&V passed (33/33 requirements), UAT 94% acceptance
- **Recommendation**: **APPROVED for deployment** (5 Sep 2025, JROC)

**Document Structure**: 10 sections + 10 appendices, ~15,000 words, comprehensive evidence for all JSP 936 requirements

**Time Savings**: Manual process 6-10 weeks → AI-assisted 4-7 days (80-85% reduction)

---

You have successfully generated comprehensive JSP 936 AI Assurance documentation for [Project Name]. This documentation package demonstrates full compliance with MOD's principal policy framework for dependable AI in defence, and is ready for submission to the appropriate approval authority.
