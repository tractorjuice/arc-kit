# AI Assurance Assessment

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit:au-ai-assurance`

<!-- DOC-CONTROL-HEADER -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit:au-ai-assurance` command | PENDING | PENDING |

---

## Executive Summary

[Two to three paragraphs: AI system, deployment phase, regulatory frameworks in scope, overall assurance posture, key gaps.]

---

## 1. AI System Description

| Field | Value |
|-------|-------|
| **System Name** | [System name] |
| **Purpose** | [What the AI does and for whom] |
| **AI Capability Type** | [Generative / Predictive / Decision-Support / Decision-Making / Agentic / Multi-Modal] |
| **Deployment Phase** | [Research / Pilot / Production] |
| **Foundation Model** | [Model + version + vendor — e.g., Claude Opus 4 / GPT-4 / Gemini 2.0 / open-source Llama 3] |
| **Training-Data Sources** | [Public / proprietary / mixed; classification level] |
| **Inference-Data Sources** | [User input / database / API / mixed] |
| **Decisions Affecting Individuals** | [Yes — describe / No / Decision-support only] |
| **Human-in-the-Loop Posture** | [Always / Threshold-triggered / None] |
| **Population Affected** | [Internal users / customers / public / regulated cohort] |
| **Assessment Date** | [YYYY-MM-DD] |
| **AI Accountable Officer** | [Name + role] |

---

## 2. DTA Responsible AI Policy v2.0 Compliance

| Accountability | Status | Evidence | Gap | Mitigation |
|----------------|--------|----------|-----|------------|
| 1. Accountability — designated AI accountable officer | [✅/⚠️/❌] | [Evidence] | [Gap] | [Action] |
| 2. Transparency — public AI use disclosure | [✅/⚠️/❌] | [Evidence] | [Gap] | [Action] |
| 3. Risk-based approach — AI risk assessment performed | [✅/⚠️/❌] | [Evidence] | [Gap] | [Action] |
| 4. Quality data + design integrity | [✅/⚠️/❌] | [Evidence] | [Gap] | [Action] |
| 5. Privacy + security (cross-ref PIA + ISM + E8) | [✅/⚠️/❌] | [Cite ARC-{P}-AUPIA, AUISM, AUE8] | [Gap] | [Action] |
| 6. Human oversight + redress | [✅/⚠️/❌] | [Evidence] | [Gap] | [Action] |

---

## 3. AU AI Ethics Principles Alignment

| Principle | Status | Evidence | Gap | Mitigation |
|-----------|--------|----------|-----|------------|
| 1. Human, societal and environmental wellbeing | [✅/⚠️/❌] | [Evidence] | [Gap] | [Action] |
| 2. Human-centred values | [✅/⚠️/❌] | [Evidence] | [Gap] | [Action] |
| 3. Fairness | [✅/⚠️/❌] | [Cite Fairness Assessment §6] | [Gap] | [Action] |
| 4. Privacy protection and security | [✅/⚠️/❌] | [Cite PIA + E8 + ISM] | [Gap] | [Action] |
| 5. Reliability and safety | [✅/⚠️/❌] | [Evidence] | [Gap] | [Action] |
| 6. Transparency and explainability | [✅/⚠️/❌] | [Evidence] | [Gap] | [Action] |
| 7. Contestability | [✅/⚠️/❌] | [Evidence] | [Gap] | [Action] |
| 8. Accountability | [✅/⚠️/❌] | [Evidence] | [Gap] | [Action] |

---

## 4. ISO 42001 Readiness

| Clause | Topic | Readiness | Notes |
|--------|-------|-----------|-------|
| 4 | Context of the organisation | [✅/⚠️/❌] | [Notes] |
| 5 | Leadership | [✅/⚠️/❌] | [Notes] |
| 6 | Planning | [✅/⚠️/❌] | [Notes] |
| 7 | Support | [✅/⚠️/❌] | [Notes] |
| 8 | Operation | [✅/⚠️/❌] | [Notes] |
| 9 | Performance evaluation | [✅/⚠️/❌] | [Notes] |
| 10 | Improvement | [✅/⚠️/❌] | [Notes] |

**Certification position**: [Targeting certification / Internal alignment only / Not pursuing]

---

## 5. Privacy Act AI-Decision Notification (Dec 2026)

| Aspect | Detail |
|--------|--------|
| **Substantially-automated decisions affecting individuals** | [Yes / No] |
| **Notification mechanism** | [Implemented / Planned for Dec 2026 / Not applicable] |
| **What individuals are told** | [Description of notification content] |
| **Opt-out pathway** | [Yes — describe / Not applicable] |
| **Cross-reference** | [ARC-{P}-AUPIA-v* APP 6 + APP 11] |

---

## 6. Fairness Assessment

| Aspect | Detail |
|--------|--------|
| **Methodology** | [E.g., demographic parity, equalised odds, predictive parity] |
| **Protected Attributes Tested** | [List — race, ethnicity, gender, age, disability, geographic, socioeconomic] |
| **Test Population Segments** | [Description] |
| **Fairness Metrics + Results** | [Metric: result, threshold, pass/fail per segment] |
| **Residual Fairness Risks** | [Description] |
| **Validated by** | [Internal / External fairness specialist] |

---

## 7. Security of AI Training + Inference Data

| Aspect | Detail |
|--------|--------|
| **Training-Data Classification** | [UNOFFICIAL / OFFICIAL / OFFICIAL:Sensitive / PROTECTED — note model can memorise PII] |
| **Inference-Data Classification** | [Same scale; consider input + output PII risk] |
| **Prompt-Injection Defences** | [Implemented / Planned] |
| **Model-Extraction Defences** | [Implemented / Planned] |
| **Training-Data Sanitisation** | [Process description] |
| **E8 Cross-Reference** | [ARC-{P}-AUE8-v* — Strategies 1, 4, 11 most relevant] |
| **ISM Cross-Reference** | [ARC-{P}-AUISM-v* Domain 9 + 12] |

---

## 8. Model Lifecycle Governance

| Aspect | Detail |
|--------|--------|
| **Version Control** | [Tooling + cadence] |
| **Change Management** | [Process for model updates] |
| **Drift Detection** | [Metrics + alerting] |
| **Retraining Cadence** | [Trigger conditions] |
| **Retirement / Sunset Criteria** | [Description] |
| **Audit Trail** | [Inference logs retention + scope] |

---

## 9. Vendor / Foundation-Model Disclosure

| Aspect | Detail |
|--------|--------|
| **Vendor Name** | [E.g., Anthropic / OpenAI / Google] |
| **Model + Version** | [E.g., Claude Opus 4.7] |
| **Vendor AI Policy Compliance** | [Vendor's published AI policy alignment] |
| **Training-Data Provenance** | [Disclosed / Partially disclosed / Not disclosed] |
| **Inference Region** | [AU / US / EU / global] |
| **IP / Copyright Position** | [Vendor indemnification stance; user-content rights] |
| **Data-Use Policy** | [Whether prompts/completions used for vendor training] |

---

## 10. Recommendations

### Quick Wins ( < 30 days)

| # | Recommendation | Framework | Effort |
|---|---------------|-----------|--------|
| 1 | [Recommendation] | [DTA / AIEP / ISO42001 / PrivacyAct] | [Low/Medium] |

### Short-Term (30–90 days)

| # | Recommendation | Framework | Effort |
|---|---------------|-----------|--------|
| 1 | [Recommendation] | [Framework] | [Medium/High] |

### Medium-Term (90–180 days)

| # | Recommendation | Framework | Effort |
|---|---------------|-----------|--------|
| 1 | [Recommendation] | [Framework] | [High] |

---

## 11. External References

### Document Register

| Doc ID | Filename | Type | Source | Description |
|--------|----------|------|--------|-------------|
| DTAAI | DTA Responsible AI Policy v2.0 | Policy | digital.gov.au | Effective Dec 2025 |
| AUAIEP | AU AI Ethics Principles | Framework | industry.gov.au | 8 voluntary principles |
| ISO42001 | ISO 42001:2023 (AS adopted Feb 2024) | Standard | standards.org.au | AI Management Systems |
| PA88 | Privacy Act 1988 (Cth) | Legislation | legislation.gov.au | AI-decision notification Dec 2026 |
| AUPIA | ARC-{P}-AUPIA-v* | ArcKit Artefact | projects/ | APP 6 + APP 11 cross-ref |
| AUE8 | ARC-{P}-AUE8-v* | ArcKit Artefact | projects/ | E8 cross-ref |
| AUISM | ARC-{P}-AUISM-v* | ArcKit Artefact | projects/ | ISM cross-ref |

### Verification

| Standard | URL | Verification Date |
|----------|-----|-------------------|
| DTA Responsible AI Policy | https://www.digital.gov.au/policy/ai/policy | [YYYY-MM-DD] |
| AU AI Ethics Principles | https://www.industry.gov.au/publications/australias-artificial-intelligence-ethics-framework/australias-ai-ethics-principles | [YYYY-MM-DD] |
| Privacy Act 1988 | https://www.legislation.gov.au/Details/C2024C00301 | [YYYY-MM-DD] |

---

**Generated by**: ArcKit `/arckit:au-ai-assurance` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
