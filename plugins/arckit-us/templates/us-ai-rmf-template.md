# NIST AI Risk Management Framework Assessment

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit:us-ai-rmf`

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time per _partials/RENDERING.md. -->
<!-- Classification line MUST be: -->
<!-- | Classification | PUBLIC / OFFICIAL / OFFICIAL-SENSITIVE (set via `default_classification` user-config) | -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit:us-ai-rmf` command | PENDING | PENDING |

---

## Executive Summary

[Two to three paragraphs: AI system, intended use, AI RMF 1.0 four-function maturity, GenAI applicability, top three residual risks, and recommended treatment.]

---

## 1. AI System Description

| Field | Value |
|-------|-------|
| **System Name** | [Name] |
| **Intended Use** | [Specific purpose, decision context, automation level] |
| **AI Capability Type** | [Predictive / Classification / Generative / Decision-Support / Autonomous] |
| **GenAI in Use?** | [Yes — see Section 6 / No] |
| **Training Data Sources** | [Public / proprietary / mixed; data classification] |
| **Model Architecture** | [E.g., gradient-boosted trees / transformer 7B / RAG over agency corpus] |
| **Foundation Model (if any)** | [Vendor + version, e.g., Claude Opus 4 / GPT-4o / Llama 3.1 70B] |
| **Deployment Context** | [Internal / customer-facing / inter-agency] |
| **Population Affected** | [Federal employees / public / regulated cohort] |
| **Decisions Affecting Individuals** | [Yes — describe / No / Decision-support only] |
| **Human-in-the-Loop Posture** | [Always / Threshold-triggered / None] |
| **Cross-ref AI Impact Assessment** | [ARC-{P}-AIIA-v*] |
| **Assessment Date** | [YYYY-MM-DD] |
| **Chief AI Officer (CAIO)** | [Name + role] |

---

## 2. Govern Function

Cultivate a culture of risk management. AI RMF 1.0 Govern function sub-categories.

| Sub-category | Maturity | Evidence | Action |
|--------------|----------|----------|--------|
| Govern 1.1 — Legal and regulatory requirements involving AI are understood, managed, and documented | [Not in Place / Partially / Mostly / Fully] | [Evidence] | [Action] |
| Govern 1.2 — Characteristics of trustworthy AI are integrated into organisational policies, processes, and procedures | [Maturity] | [Evidence] | [Action] |
| Govern 1.3 — Processes, procedures, and practices are in place to determine the needed level of risk management activities based on the AI system's risk | [Maturity] | [Evidence] | [Action] |
| Govern 1.4 — The risk management process and its outcomes are established through transparent policies, procedures, and other controls | [Maturity] | [Evidence] | [Action] |
| Govern 1.5 — Ongoing monitoring and periodic review of the risk management process and its outcomes are planned | [Maturity] | [Evidence] | [Action] |
| Govern 1.6 — Mechanisms are in place to inventory AI systems and are resourced according to organisational risk priorities | [Maturity] | [Evidence] | [Action] |
| Govern 1.7 — Processes and procedures are in place for decommissioning and phasing out AI systems safely | [Maturity] | [Evidence] | [Action] |
| Govern 2.1 — Roles, responsibilities, and lines of communication related to mapping, measuring, and managing AI risks are documented | [Maturity] | [Evidence] | [Action] |
| Govern 2.2 — The organisation's personnel and partners receive AI risk-management training | [Maturity] | [Evidence] | [Action] |
| Govern 2.3 — Executive leadership of the organisation takes responsibility for decisions about risks associated with AI system development and deployment | [Maturity] | [Evidence] | [Action] |
| Govern 3.1 — Decision-making related to mapping, measuring, and managing AI risks throughout the lifecycle is informed by a diverse team | [Maturity] | [Evidence] | [Action] |
| Govern 3.2 — Policies and procedures are in place to define and differentiate roles and responsibilities for human-AI configurations and oversight | [Maturity] | [Evidence] | [Action] |
| Govern 4.1 — Organisational policies and practices foster a critical thinking and safety-first mindset | [Maturity] | [Evidence] | [Action] |
| Govern 4.2 — Organisational teams document the risks and potential impacts of AI technology they design, develop, deploy, evaluate, and use | [Maturity] | [Evidence] | [Action] |
| Govern 4.3 — Organisational practices are in place to enable AI testing, identification of incidents, and information sharing | [Maturity] | [Evidence] | [Action] |
| Govern 5.1 — Organisational policies and practices are in place to collect, consider, prioritise, and integrate feedback from those external to the team that developed or deployed the AI system | [Maturity] | [Evidence] | [Action] |
| Govern 5.2 — Mechanisms are established to enable AI actors to regularly incorporate adjudicated feedback from relevant AI actors into system design and implementation | [Maturity] | [Evidence] | [Action] |
| Govern 6.1 — Policies and procedures are in place that address AI risks associated with third-party entities | [Maturity] | [Evidence] | [Action] |
| Govern 6.2 — Contingency processes are in place to handle failures or incidents in third-party data or AI systems deemed to be high-risk | [Maturity] | [Evidence] | [Action] |

---

## 3. Map Function

Establish context and identify risks. AI RMF 1.0 Map function sub-categories.

| Sub-category | Maturity | Evidence | Action |
|--------------|----------|----------|--------|
| Map 1.1 — Intended purposes, potentially beneficial uses, context-specific laws, norms, and expectations, and prospective settings in which the AI system will be deployed are understood and documented | [Maturity] | [Evidence] | [Action] |
| Map 1.2 — Inter-disciplinary AI actors, competencies, skills, and capacities for establishing context reflect demographic diversity and broad domain and user experience expertise | [Maturity] | [Evidence] | [Action] |
| Map 1.3 — The organisation's mission and relevant goals for the AI technology are understood and documented | [Maturity] | [Evidence] | [Action] |
| Map 1.4 — The business value or context of business use has been clearly defined or, in the case of assessing existing AI systems, re-evaluated | [Maturity] | [Evidence] | [Action] |
| Map 1.5 — Organisational risk tolerances are determined and documented | [Maturity] | [Evidence] | [Action] |
| Map 1.6 — System requirements are documented; AI actor expectations of stakeholders are determined | [Maturity] | [Evidence] | [Action] |
| Map 2.1 — The specific tasks and methods used to implement the tasks that the AI system will support are defined | [Maturity] | [Evidence] | [Action] |
| Map 2.2 — Information about the AI system's knowledge limits and how system output may be utilised and overseen by humans is documented | [Maturity] | [Evidence] | [Action] |
| Map 2.3 — Scientific integrity and TEVV considerations are identified and documented, including those related to experimental design, data collection and selection, system trustworthiness, and construct validation | [Maturity] | [Evidence] | [Action] |
| Map 3.1 — Potential benefits of intended AI system functionality and performance are examined and documented | [Maturity] | [Evidence] | [Action] |
| Map 3.2 — Potential costs, including non-monetary costs, that result from expected or realised AI errors or system functionality and trustworthiness — as connected to organisational risk tolerance — are examined and documented | [Maturity] | [Evidence] | [Action] |
| Map 3.3 — Targeted application scope is specified and documented based on the system's capability, established context, and AI system categorization | [Maturity] | [Evidence] | [Action] |
| Map 3.4 — Processes for operator and practitioner proficiency with AI system performance and trustworthiness — and relevant technical standards and certifications — are defined, assessed, and documented | [Maturity] | [Evidence] | [Action] |
| Map 3.5 — Processes for human oversight, in accordance with organisational policies from Govern, are defined, assessed, and documented | [Maturity] | [Evidence] | [Action] |
| Map 4.1 — Approaches for mapping AI technology and legal risks of its components — including the use of third-party data or software — are in place, followed, and documented | [Maturity] | [Evidence] | [Action] |
| Map 4.2 — Internal risk controls for components of the AI system, including third-party AI technologies, are identified and documented | [Maturity] | [Evidence] | [Action] |
| Map 5.1 — Likelihood and magnitude of each identified impact (both potentially beneficial and harmful) based on expected use, past uses of AI systems in similar contexts, public incident reports, feedback from those external to the team that developed or deployed the AI system, or other data are identified and documented | [Maturity] | [Evidence] | [Action] |
| Map 5.2 — Practices and personnel for supporting regular engagement with relevant AI actors and integrating feedback about positive, negative, and unanticipated impacts are in place and documented | [Maturity] | [Evidence] | [Action] |

---

## 4. Measure Function

Use quantitative, qualitative, or mixed-method tools to analyse, assess, and monitor AI risks.

| Sub-category | Maturity | Evidence | Action |
|--------------|----------|----------|--------|
| Measure 1.1 — Approaches and metrics for measurement of AI risks enumerated during the Map function are selected for implementation starting with the most significant AI risks | [Maturity] | [Evidence] | [Action] |
| Measure 1.2 — Appropriateness of AI metrics and effectiveness of existing controls are regularly assessed and updated, including reports of errors and potential impacts | [Maturity] | [Evidence] | [Action] |
| Measure 1.3 — Internal experts who did not serve as front-line developers for the system and/or independent assessors are involved in regular assessments and updates | [Maturity] | [Evidence] | [Action] |
| Measure 2.1 — Test sets, metrics, and details about the tools used during TEVV are documented | [Maturity] | [Evidence] | [Action] |
| Measure 2.2 — Evaluations involving human subjects meet applicable requirements and are representative of the relevant population | [Maturity] | [Evidence] | [Action] |
| Measure 2.3 — AI system performance or assurance criteria are measured qualitatively or quantitatively and demonstrated for conditions similar to deployment setting(s) | [Maturity] | [Evidence] | [Action] |
| Measure 2.4 — The functionality and behaviour of the AI system and its components — as identified in the Map function — are monitored when in production | [Maturity] | [Evidence] | [Action] |
| Measure 2.5 — The AI system to be deployed is demonstrated to be valid and reliable | [Maturity] | [Evidence] | [Action] |
| Measure 2.6 — The AI system is evaluated regularly for safety risks | [Maturity] | [Evidence] | [Action] |
| Measure 2.7 — AI system security and resilience are evaluated and documented | [Maturity] | [Evidence] | [Action] |
| Measure 2.8 — Risks associated with transparency and accountability are examined and documented | [Maturity] | [Evidence] | [Action] |
| Measure 2.9 — The AI model is explained, validated, and documented; AI system output is interpreted within its context and to inform responsible use and governance | [Maturity] | [Evidence] | [Action] |
| Measure 2.10 — Privacy risk of the AI system is examined and documented | [Maturity] | [Evidence] | [Action] |
| Measure 2.11 — Fairness and bias — as identified in the Map function — are evaluated and documented | [Maturity] | [Evidence] | [Action] |
| Measure 2.12 — Environmental impact and sustainability of AI model training and management activities are assessed and documented | [Maturity] | [Evidence] | [Action] |
| Measure 2.13 — Effectiveness of the employed TEVV metrics and processes in the Measure function are evaluated and documented | [Maturity] | [Evidence] | [Action] |
| Measure 3.1 — Approaches, personnel, and documentation are in place to regularly identify and track existing, unanticipated, and emergent AI risks based on factors such as intended and actual performance in deployed contexts | [Maturity] | [Evidence] | [Action] |
| Measure 3.2 — Risk tracking approaches are considered for settings where AI risks are difficult to assess using currently available measurement techniques or where metrics are not yet available | [Maturity] | [Evidence] | [Action] |
| Measure 3.3 — Feedback processes for end users and impacted communities to report problems and appeal system outcomes are established and integrated into AI system evaluation metrics | [Maturity] | [Evidence] | [Action] |
| Measure 4.1 — Measurement approaches for identifying AI risks are connected to deployment context(s) and informed through consultation with domain experts and other end users | [Maturity] | [Evidence] | [Action] |
| Measure 4.2 — Measurement results regarding AI system trustworthiness in deployment context(s) and across the AI lifecycle are informed by input from domain experts and relevant AI actors | [Maturity] | [Evidence] | [Action] |
| Measure 4.3 — Measurable performance improvements or declines based on consultations with relevant AI actors, including affected communities, and field data about context-relevant risks and trustworthiness characteristics are identified and documented | [Maturity] | [Evidence] | [Action] |

---

## 5. Manage Function

Allocate risk resources to mapped and measured risks on a regular basis.

| Sub-category | Maturity | Evidence | Action |
|--------------|----------|----------|--------|
| Manage 1.1 — A determination is made as to whether the AI system achieves its intended purposes and stated objectives and whether its development or deployment should proceed | [Maturity] | [Evidence] | [Action] |
| Manage 1.2 — Treatment of documented AI risks is prioritised based on impact, likelihood, and available resources or methods | [Maturity] | [Evidence] | [Action] |
| Manage 1.3 — Responses to the AI risks deemed high priority — as identified by the Map function — including response, recovery, and communication plans are planned and documented | [Maturity] | [Evidence] | [Action] |
| Manage 1.4 — Negative residual risks (defined as the sum of all unmitigated risks) to both downstream acquirers of AI systems and end users are documented | [Maturity] | [Evidence] | [Action] |
| Manage 2.1 — Resources required to manage AI risks are taken into account, along with viable non-AI alternative systems, approaches, or methods — to reduce the magnitude or likelihood of potential impacts | [Maturity] | [Evidence] | [Action] |
| Manage 2.2 — Mechanisms are in place and applied to sustain the value of deployed AI systems | [Maturity] | [Evidence] | [Action] |
| Manage 2.3 — Procedures are followed to respond to and recover from a previously unknown risk when it is identified | [Maturity] | [Evidence] | [Action] |
| Manage 2.4 — Mechanisms are in place and applied, and responsibilities are assigned and understood, to supersede, disengage, or deactivate AI systems that demonstrate performance or outcomes inconsistent with intended use | [Maturity] | [Evidence] | [Action] |
| Manage 3.1 — AI risks and benefits from third-party resources are regularly monitored and risk controls are applied and documented | [Maturity] | [Evidence] | [Action] |
| Manage 3.2 — Pre-trained models that are used for development are monitored as part of AI system regular monitoring and maintenance | [Maturity] | [Evidence] | [Action] |
| Manage 4.1 — Post-deployment AI system monitoring plans are implemented, including mechanisms for capturing and evaluating input from users and other relevant AI actors, appeal and override, decommissioning, incident response, recovery, and change management | [Maturity] | [Evidence] | [Action] |
| Manage 4.2 — Measurable activities for continual improvements are integrated into AI system updates and include regular engagement with interested parties, including relevant AI actors | [Maturity] | [Evidence] | [Action] |
| Manage 4.3 — Incidents and errors are communicated to relevant AI actors, including affected communities; processes for tracking, responding to, and recovering from incidents and errors are followed and documented | [Maturity] | [Evidence] | [Action] |

---

## 6. Generative AI Profile (NIST AI 600-1)

[If GenAI is in use, complete this section. If not, mark "Not Applicable" and explain.]

**GenAI Applicability**: [Yes / No]

If yes, score the 12 GenAI-specific risk categories from NIST AI 600-1:

| GenAI Risk | Maturity | Evidence | Action |
|-----------|----------|----------|--------|
| Confabulation (hallucination of false content) | [Maturity] | [Evidence] | [Action] |
| Dangerous, Violent, or Hateful Content | [Maturity] | [Evidence] | [Action] |
| Data Privacy (training-data memorisation; inference-time leakage) | [Maturity] | [Evidence] | [Action] |
| Environmental Impact (training + inference energy / water / carbon) | [Maturity] | [Evidence] | [Action] |
| Harmful Bias or Homogenization | [Maturity] | [Evidence] | [Action] |
| Human-AI Configuration (over-reliance, automation bias) | [Maturity] | [Evidence] | [Action] |
| Information Integrity (mis/disinformation amplification) | [Maturity] | [Evidence] | [Action] |
| Information Security (prompt injection, model extraction, adversarial inputs) | [Maturity] | [Evidence] | [Action] |
| Intellectual Property (training-data copyright; output IP) | [Maturity] | [Evidence] | [Action] |
| Obscene, Degrading, and/or Abusive Content | [Maturity] | [Evidence] | [Action] |
| Toxicity, Bias, and Homogenization in outputs | [Maturity] | [Evidence] | [Action] |
| Value Chain and Component Integration (third-party model risks) | [Maturity] | [Evidence] | [Action] |

---

## 7. Residual Risk Register

| Risk ID | Description | Likelihood | Impact | Treatment | Owner |
|---------|-------------|-----------|--------|-----------|-------|
| AIR-001 | [Risk description] | [Low / Med / High] | [Low / Med / High] | [Accept / Mitigate / Transfer / Avoid] | [Role] |

---

## 8. Control-to-RMF-Function Crosswalk

Map NIST SP 800-53 controls to AI RMF functions.

| 800-53 Control | AI RMF Function | Sub-category | Notes |
|----------------|-----------------|--------------|-------|
| RA-3 | Map | Map 5.1 | [Risk assessment of AI system harms] |
| RA-5 | Measure | Measure 2.7 | [Vulnerability monitoring] |
| SI-4 | Manage | Manage 4.1 | [System monitoring during operation] |
| CA-7 | Manage | Manage 4.1 | [Continuous monitoring] |
| PT-1 | Govern | Govern 1.1 | [PII processing policy] |
| AT-2 | Govern | Govern 2.2 | [AI awareness training] |
| SR-3 | Govern | Govern 6.1 | [Third-party AI supply chain] |
| SA-11 | Measure | Measure 2.5 | [Developer testing] |
| IR-4 | Manage | Manage 4.3 | [AI incident handling] |

---

## 9. References

| Reference | Citation | URL |
|-----------|----------|-----|
| NIST AI RMF 1.0 | Artificial Intelligence Risk Management Framework 1.0 | <https://doi.org/10.6028/NIST.AI.100-1> |
| AI RMF Playbook | Playbook for the AI RMF | <https://airc.nist.gov/AI_RMF_Knowledge_Base/Playbook> |
| NIST AI 600-1 | AI RMF: Generative AI Profile | <https://doi.org/10.6028/NIST.AI.600-1> |
| OMB M-24-10 | Advancing Governance, Innovation, and Risk Management for Agency Use of AI | <https://www.whitehouse.gov/wp-content/uploads/2024/03/M-24-10-Advancing-Governance-Innovation-and-Risk-Management-for-Agency-Use-of-Artificial-Intelligence.pdf> |

---

## 10. Approvals

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Chief AI Officer (CAIO) | [Name] | [Signature] | [YYYY-MM-DD] |
| AI Use-Case Owner | [Name] | [Signature] | [YYYY-MM-DD] |
| CISO | [Name] | [Signature] | [YYYY-MM-DD] |
| Senior Agency Official for Privacy (SAOP) | [Name] | [Signature] | [YYYY-MM-DD] |

---

**Generated by**: ArcKit `/arckit:us-ai-rmf` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
