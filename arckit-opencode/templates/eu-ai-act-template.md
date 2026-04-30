# EU AI Act Compliance Assessment

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit.eu-ai-act`
>
> ⚠️ **Community-contributed** — not yet validated against current ANSSI/CNIL/EU regulatory text. Verify all citations before relying on output.

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time to _partials/document-control-uk.md or _partials/document-control-uae.md based on plugin userConfig classification_scheme + governance_framework. See _partials/RENDERING.md (when present). -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit.eu-ai-act` | [PENDING] | [PENDING] |

## Executive Summary

| Area | Risk Class | Status | Key Findings |
|------|-----------|--------|-------------|
| Risk Classification | [Prohibited / High / Limited / Minimal] | [Compliant / Partial / Gap] | [Summary] |
| Transparency Obligations | [Required / N/A] | [Compliant / Partial / Gap] | [Summary] |
| Technical Requirements | [Applicable / N/A] | [Compliant / Partial / Gap] | [Summary] |
| GPAI Obligations | [Applicable / N/A] | [Compliant / Partial / Gap] | [Summary] |

---

## 1. AI System Classification

### 1.1 Is this an AI System under the AI Act?

| Criterion | Assessment |
|-----------|-----------|
| Machine-based system infers outputs (predictions, recommendations, decisions, content) | ☐ Yes ☐ No |
| Operates with varying degrees of autonomy | ☐ Yes ☐ No |
| Designed for explicit or implicit objectives | ☐ Yes ☐ No |
| Output influences physical or virtual environments | ☐ Yes ☐ No |

**In scope**: ☐ Yes ☐ No (if No, stop here)

### 1.2 GPAI Model Assessment

| Criterion | Assessment |
|-----------|-----------|
| General-purpose AI model (trained on broad data, capable of wide range of tasks) | ☐ Yes ☐ No |
| Systemic risk model (> 10²⁵ FLOPs training compute) | ☐ Yes ☐ No |

**GPAI model**: ☐ Yes — apply Section 5 | ☐ No

### 1.3 Risk Classification

| Risk Level | Category | Applicable |
|-----------|---------|-----------|
| **Prohibited** (Article 5) | Social scoring by public authorities; exploitation of vulnerabilities; subliminal manipulation; real-time remote biometric ID in public spaces (with exceptions); emotion recognition in workplace/education; biometric categorisation on sensitive characteristics | ☐ |
| **High Risk — Annex I** (safety component of product) | Machinery, toys, medical devices, aviation, vehicles covered by sector legislation | ☐ |
| **High Risk — Annex III** (standalone AI) | Critical infrastructure; education/vocational training; employment and worker management; essential private/public services; law enforcement; migration/border control; administration of justice; democratic processes | ☐ |
| **Limited Risk** | Chatbots, deepfake generation, emotion recognition, biometric categorisation | ☐ |
| **Minimal Risk** | AI-enabled video games, spam filters, recommendation systems (non-high-risk) | ☐ |

**Classification**: [Prohibited / High Risk / Limited Risk / Minimal Risk]

## 2. Prohibited AI Practices (Article 5)

[Complete if prohibited classification possible — if confirmed prohibited, the system cannot be placed on the EU market]

| Prohibited Practice | Applicable | Assessment |
|--------------------|-----------|-----------|
| Social scoring by public authorities | ☐ | |
| Exploitation of psychological/physical vulnerabilities | ☐ | |
| Subliminal manipulation beyond person's consciousness | ☐ | |
| Real-time remote biometric identification in public spaces (with limited exceptions) | ☐ | |
| Post-remote biometric identification (except for serious crimes) | ☐ | |
| Emotion recognition in workplace or educational institutions | ☐ | |
| Biometric categorisation based on sensitive characteristics (politics, religion, sex life) | ☐ | |

## 3. High-Risk AI Requirements (Articles 8–17)

[Complete if classified as High Risk]

### 3.1 Risk Management System (Article 9)

| Requirement | Status | Evidence |
|-------------|--------|---------|
| Risk management system established and maintained throughout lifecycle | ☐ | |
| Risks to health, safety, and fundamental rights identified | ☐ | |
| Risk estimation and evaluation conducted | ☐ | |
| Residual risk levels acceptable | ☐ | |

### 3.2 Data Governance (Article 10)

| Requirement | Status |
|-------------|--------|
| Training, validation, and testing datasets identified | ☐ |
| Data governance practices documented | ☐ |
| Training data relevant, sufficiently representative, and free from errors | ☐ |
| Biases identified and addressed | ☐ |
| Special category data in training sets handled appropriately | ☐ |

### 3.3 Technical Documentation (Article 11 + Annex IV)

| Document | Status |
|----------|--------|
| General description of AI system | ☐ |
| Development process and testing methodology | ☐ |
| Monitoring, functioning, and control | ☐ |
| Computational requirements | ☐ |
| Risk management system documentation | ☐ |
| Changes to pre-trained models | ☐ |
| EU Declaration of Conformity | ☐ |

### 3.4 Record-Keeping / Logging (Article 12)

| Requirement | Status |
|-------------|--------|
| Automatic logging enabled | ☐ |
| Logs retained for at least 6 months (or as required) | ☐ |
| Logs accessible to deployer and authority | ☐ |

### 3.5 Transparency and Information to Deployers (Article 13)

| Requirement | Status |
|-------------|--------|
| Instructions for use provided to deployers | ☐ |
| Capabilities and limitations disclosed | ☐ |
| Intended purpose documented | ☐ |
| Performance metrics on specific persons/groups included | ☐ |

### 3.6 Human Oversight (Article 14)

| Requirement | Status |
|-------------|--------|
| Human oversight measures designed into the system | ☐ |
| Natural persons assigned to oversee identified | ☐ |
| Ability to understand output | ☐ |
| Ability to disregard/override/intervene | ☐ |
| Ability to stop operation | ☐ |

### 3.7 Accuracy, Robustness, and Cybersecurity (Article 15)

| Requirement | Status |
|-------------|--------|
| Appropriate accuracy levels documented | ☐ |
| Robustness against errors and inconsistencies | ☐ |
| Resilience against adversarial manipulation | ☐ |
| Cybersecurity measures proportionate to risk | ☐ |

## 4. Transparency Obligations for Limited Risk (Articles 50–52)

[Complete for chatbots, synthetic content, emotion recognition, biometric categorisation]

| Obligation | Applicable AI Type | Status |
|-----------|-------------------|--------|
| Disclose AI interaction to users (chatbots) | Chatbots | ☐ |
| Label AI-generated content (deepfakes, synthetic media) | Generative AI | ☐ |
| Disclose emotion recognition use | Emotion recognition | ☐ |
| Disclose biometric categorisation use | Biometric systems | ☐ |

## 5. GPAI Model Obligations (Articles 53–55)

[Complete if the system uses or is a General-Purpose AI model]

### 5.1 Standard GPAI Obligations (Article 53)

| Obligation | Status |
|-----------|--------|
| Technical documentation maintained | ☐ |
| Copyright compliance policy in place | ☐ |
| Summary of training data published | ☐ |
| Information provided to downstream providers | ☐ |

### 5.2 Systemic Risk GPAI (Article 55) — Models > 10²⁵ FLOPs

| Obligation | Status |
|-----------|--------|
| Adversarial testing (red-teaming) conducted | ☐ |
| Serious incident reporting to AI Office | ☐ |
| Cybersecurity measures for model weights | ☐ |
| Energy efficiency metrics reported | ☐ |

## 6. Conformity Assessment and Registration

### 6.1 Conformity Assessment Route (High Risk only)

| Route | Applicable To | Notified Body Required |
|-------|--------------|----------------------|
| Internal control (Annex VI) | High-risk AI not in Annex I product | No |
| Third-party assessment (Annex VII) | High-risk AI in Annex I product category | Yes |
| Quality management system (Annex VII/VIII) | High-risk AI where harmonised standards apply | Depends |

### 6.2 EU AI Act Registration (Article 49)

| Requirement | Status |
|-------------|--------|
| System registered in EU AI Act database (if high risk, deployer in public sector) | ☐ |
| CE marking affixed (if high risk, Article 48) | ☐ |
| EU Declaration of Conformity issued | ☐ |

## 7. French Market Context

| Authority | Role |
|-----------|------|
| ANSSI | Cybersecurity requirements for AI systems; technical advisory |
| CNIL | GDPR interface with AI Act; AI and fundamental rights |
| French AI Office (future) | Market surveillance for AI Act |
| Comité National de l'IA | Government AI strategy coordination |

## 8. Gap Analysis and Roadmap

| Gap | Article | Priority | Owner | AI Act Deadline |
|-----|---------|---------|-------|----------------|
| [Gap description] | [Art. XX] | 🔴 High | [Role] | [Date] |

**Key AI Act application dates**:

- February 2025: Prohibited AI practices apply
- August 2025: GPAI model obligations apply
- August 2026: High-risk AI (Annex III) obligations apply
- August 2027: High-risk AI (Annex I products) obligations apply

---

**Generated by**: ArcKit `/arckit.eu-ai-act` command
**Generated on**: [YYYY-MM-DD]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
