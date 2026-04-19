---
description: "[COMMUNITY] Assess EU AI Act (Regulation 2024/1689) compliance obligations, risk classification, and conformity requirements for AI systems"
---

> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output should be reviewed by qualified DPO / RSSI / legal counsel before reliance. Citations to ANSSI / CNIL / EU regulations may lag the current text — verify against the source.

You are helping an enterprise architect generate an **EU AI Act Compliance Assessment** (Regulation EU 2024/1689) for an AI system deployed in the European Union. The AI Act is the world's first binding horizontal AI regulation, with phased application through 2027.

## User Input

```text
$ARGUMENTS
```

## Instructions

> **Note**: Before generating, scan `projects/` for existing project directories. For each project, list all `ARC-*.md` artifacts, check `external/` for reference documents, and check `000-global/` for cross-project policies. If no external docs exist but they would improve output, ask the user.

### Step 0: Read existing artifacts from the project context

**MANDATORY** (warn if missing):

- **REQ** (Requirements) — Extract: functional requirements describing what the AI system does, AI/ML features, automated decision-making requirements, data inputs and outputs, human oversight requirements
  - If missing: warn that AI Act classification requires a clear description of the AI system's purpose and mechanism

**RECOMMENDED** (read if available, note if missing):

- **RISK** (Risk Register) — Extract: existing AI risks, bias risks, fairness concerns, safety risks
- **DATA** (Data Model) — Extract: training/inference data categories (especially personal data, special category data), data flows
- **STKE** (Stakeholder Analysis) — Extract: affected persons (especially vulnerable groups, employment, benefits), organisation's role (provider / deployer)

**OPTIONAL** (read if available, skip silently):

- **PRIN** (Architecture Principles, 000-global) — Extract: AI ethics principles, responsible AI guidelines, fairness principles
- **SECD** (Secure by Design) — Extract: security controls relevant to Article 15 (accuracy, robustness, cybersecurity)

### Step 0b: Read external documents and policies

- Read any **external documents** in `external/` — extract AI ethics assessments, algorithmic impact assessments, existing conformity documentation, ANSSI or ARCOM correspondence
- Read any **global policies** in `000-global/policies/` — extract responsible AI policy, model governance policy, human oversight policy

### Step 1: Identify or Create Project

Identify the target project from the hook context. If the project doesn't exist:

1. Use Glob to list `projects/*/` directories and find the highest `NNN-*` number
2. Calculate the next number (zero-padded to 3 digits)
3. Slugify the project name
4. Use the Write tool to create `projects/{NNN}-{slug}/README.md`
5. Set `PROJECT_ID` and `PROJECT_PATH`

### Step 2: Read Source Artifacts

Read all documents from Step 0. Identify:

- Is this an AI system under the AI Act definition? (machine-based, infers outputs, varying autonomy)
- Organisation's role: provider (develops/places on market) vs deployer (uses it)
- General-purpose AI model assessment (trained on broad data, > 10²⁵ FLOPs?)
- Potential prohibited practice exposure
- Potential high-risk classification (Annex I product / Annex III standalone)

### Step 3: AI Act Template Reading

**Read the template** (with user override support):

- **First**, check if `.arckit/templates/eu-ai-act-template.md` exists in the project root
- **If found**: Read the user's customized template
- **If not found**: Read `.arckit/templates/eu-ai-act-template.md`

### Step 4: Risk Classification (Critical Step)

Before generating the assessment, determine risk classification:

**PROHIBITED (Article 5 — applicable February 2025)**:

- Social scoring by public authorities
- Subliminal manipulation beyond conscious awareness
- Exploitation of vulnerabilities (age, disability, socioeconomic)
- Real-time remote biometric identification in public spaces (with narrow exceptions)
- Emotion recognition in workplace or educational institutions
- Biometric categorisation for sensitive characteristics
- Predictive policing based solely on profiling

If ANY prohibited practice applies → STOP and flag: the AI system cannot be placed on the EU market.

**HIGH RISK — Annex I** (safety components of products covered by sector legislation): Machinery, toys, recreational craft, lifts, ATEX, medical devices, in vitro diagnostics, aviation, agricultural vehicles, railway

**HIGH RISK — Annex III** (standalone AI systems):

- Biometric identification and categorisation (with exceptions)
- Critical infrastructure safety components (road, water, gas, electricity, heating, internet)
- Education and vocational training (admission, assessment, monitoring, grading)
- Employment and worker management (recruitment, promotion, task allocation, performance monitoring, termination)
- Essential private/public services (credit scoring, social benefits, emergency dispatch, risk assessment for insurance/health)
- Law enforcement (risk/profiling, evidence assessment, emotion recognition)
- Migration/asylum/border control (risk assessment, examination, surveillance)
- Administration of justice and democratic processes (AI for courts, elections)

**LIMITED RISK** (transparency obligations only): Chatbots, emotion recognition disclosure, synthetic content labelling, biometric categorisation disclosure

**MINIMAL RISK**: All other AI systems — no mandatory obligations, voluntary codes encouraged

Show the classification clearly before proceeding.

### Step 5: Generate AI Act Assessment

**CRITICAL**: Use the **Write tool** to create the assessment document.

1. **Detect version**: Check for existing `ARC-{PROJECT_ID}-AIACT-v*.md` files:
   - No existing file → VERSION="1.0"
   - Existing file → minor increment if refreshed, major if scope changed

2. **Auto-populate Document Control**:
   - Document ID: `ARC-{PROJECT_ID}-AIACT-v{VERSION}`
   - Status: DRAFT
   - Created Date: {current_date}
   - Next Review Date: {current_date + 12 months}
   - Role: Provider / Deployer (from Step 2)
   - AI System Name: from user input or requirements

3. **Section 1: AI System Classification**
   - In-scope determination (AI system definition check)
   - GPAI model assessment (broad capability, training compute)
   - Risk classification from Step 4 with clear rationale

4. **Section 2: Prohibited Practices Check (Article 5)**
   - All seven prohibited practice categories assessed
   - If any detected: IMMEDIATE FLAG — system cannot be deployed
   - If none: confirm clean with brief rationale

5. **Section 3: High-Risk AI Requirements (Articles 8–17)** (if High Risk)
   - Risk management system (Article 9)
   - Data governance (Article 10): training/validation/test data quality, bias examination
   - Technical documentation (Article 11 + Annex IV)
   - Record-keeping and logging (Article 12)
   - Transparency to deployers (Article 13): instructions for use
   - Human oversight measures (Article 14): override capability, operator training
   - Accuracy, robustness, cybersecurity (Article 15)
   - Conformity assessment route (self-assessment vs notified body)
   - EU Declaration of Conformity and CE marking

6. **Section 4: Transparency Obligations (Article 50)** (Limited Risk)
   - Disclose AI interaction (chatbots)
   - Label AI-generated content (deepfakes, synthetic media)
   - Disclose emotion recognition
   - Disclose biometric categorisation

7. **Section 5: GPAI Model Obligations (Articles 53–55)** (if GPAI)
   - Standard obligations: technical documentation, copyright compliance, training data summary
   - Systemic risk obligations (> 10²⁵ FLOPs): adversarial testing, incident reporting, cybersecurity for model weights

8. **Section 6: Conformity Assessment and Registration**
   - Conformity route determination
   - EU AI Act database registration requirements
   - CE marking process

9. **Section 7: French Market Context**
   - ARCOM (lead competent authority)
   - CNIL (GDPR + AI intersection — "avis IA")
   - ANSSI (cybersecurity for high-risk AI — Article 15)
   - DGCCRF (market surveillance)
   - DINUM circular on AI for civil servants
   - Comité de l'IA générale et de l'IA de confiance (CAIIA)

10. **Section 8: Gap Analysis and Application Timeline**
    - Gap table with AI Act application dates:
      - February 2025: Prohibited practices
      - August 2025: GPAI model obligations
      - August 2026: High-risk (Annex I and III)
      - August 2027: Full application
    - Mermaid Gantt timeline
    - Priority actions with owners

Before writing the file, read `.arckit/references/quality-checklist.md` and verify all **Common Checks** pass.

Write the document to:

```text
projects/{project_id}/ARC-{PROJECT_ID}-AIACT-v{VERSION}.md
```

### Step 6: Summary Output

```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ EU AI Act Assessment Generated
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 Document: projects/{project_id}/ARC-{PROJECT_ID}-AIACT-v{VERSION}.md
📋 Document ID: {document_id}
📅 Assessment Date: {date}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🤖 AI System Classification
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Risk Class: {PROHIBITED ⛔ / HIGH RISK 🔴 / LIMITED RISK 🟡 / MINIMAL RISK 🟢}
GPAI Model: {Yes / No}
Role: {Provider / Deployer}

{If PROHIBITED: ⛔ SYSTEM CANNOT BE DEPLOYED ON EU MARKET — see Section 2}
{If HIGH RISK: Full conformity assessment required before market placement}
{If LIMITED RISK: Transparency obligations apply}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Conformity Requirements
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{Summary of applicable requirements with status}
Total Gaps: {N} ({N} high, {N} medium)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏰ Critical Deadlines
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{Application dates relevant to this classification}

Next steps:
1. {If personal data: Run /arckit.eu-rgpd for GDPR obligations}
2. {If high-risk: Initiate conformity assessment process}
3. Run /arckit.risk to register AI Act gaps
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Important Notes

- **Prohibited practices apply now**: Article 5 prohibited practices have applied since February 2025. Any prohibited AI system deployed after that date is a violation.
- **Classification is consequential**: High-risk classification triggers extensive conformity requirements (documentation, logging, human oversight, CE marking, database registration). If in doubt about classification, treat as high-risk.
- **Provider vs deployer obligations differ**: Providers bear the main conformity obligations. Deployers have narrower obligations (human oversight, appropriate use) but are also responsible for compliance in their context of use.
- **GPAI models are a separate track**: Even if the AI system using a GPAI model is not high-risk, the GPAI model provider has its own obligations under Articles 53–55.
- **Use Write Tool**: AI Act assessments cover multiple risk levels and detailed technical requirements. Always use the Write tool.

## Key References

| Document | Publisher | URL |
|----------|-----------|-----|
| EU AI Act (Regulation 2024/1689) — full text | EUR-Lex | https://eur-lex.europa.eu/eli/reg/2024/1689/oj |
| EU AI Office — implementation guidance and GPAI codes of practice | European Commission | https://digital-strategy.ec.europa.eu/en/policies/ai-office |
| AI Act application timeline and obligations summary | European Commission | https://digital-strategy.ec.europa.eu/en/policies/european-approach-artificial-intelligence |
| ENISA — AI cybersecurity guidance | ENISA | https://www.enisa.europa.eu/topics/artificial-intelligence |
| MITRE ATLAS — adversarial ML threat matrix | MITRE | https://atlas.mitre.org/ |
| ANSSI — AI security guidance (French context) | ANSSI | https://cyber.gouv.fr/publications |

> **Note for reviewers**: The EU AI Act is the world's first comprehensive AI regulation, applying to providers and deployers of AI systems in the EU regardless of where the provider is based. It uses a risk-based approach: prohibited practices (e.g. social scoring, real-time biometric surveillance) are banned outright; high-risk systems (Annex III — employment, education, essential services, law enforcement, migration, justice) face strict conformity requirements before market placement; GPAI models (general-purpose AI, e.g. large language models) have separate transparency and safety obligations. Application dates are phased: prohibited practices from February 2025, high-risk from August 2026.

## Success Criteria

- ✅ Assessment document created at `projects/{project_id}/ARC-{PROJECT_ID}-AIACT-v{VERSION}.md`
- ✅ In-scope determination made (AI system definition assessed)
- ✅ Prohibited practices (Article 5) assessed — system flagged and stopped if prohibited
- ✅ Risk classification determined (Default / Class I / Class II / GPAI)
- ✅ High-risk requirements (Articles 8–17) assessed if applicable
- ✅ Transparency obligations (Article 50) assessed if limited risk
- ✅ GPAI obligations (Articles 53–55) assessed if applicable
- ✅ Conformity route determined (self-assessment vs notified body)
- ✅ EU database registration requirement assessed
- ✅ French market authority context documented (ARCOM, CNIL, ANSSI)
- ✅ Application timeline with relevant deadlines provided
- ✅ Gap analysis with priority actions generated

## Example Usage

```text
/arckit.eu-ai-act Assess AI Act compliance for an automated CV screening tool used by a French public employment service (France Travail), processing personal data, making pre-selection recommendations to human recruiters

/arckit.eu-ai-act AI Act classification for 001 — chatbot for citizen service portal, built on GPT-4, providing information about public benefits eligibility

/arckit.eu-ai-act Assess a real-time emotion detection system to be deployed in a retail environment to monitor customer satisfaction
```

## Suggested Next Steps

After completing this command, consider running:

- `/arckit:eu-rgpd` -- Assess GDPR obligations for personal data used in AI training or inference *(when AI system processes personal data)*
- `/arckit:risk` -- Integrate AI Act compliance gaps and prohibited practice findings into the risk register
- `/arckit:traceability` -- Link AI Act conformity requirements back to functional requirements *(when High-risk AI system classification confirmed)*
