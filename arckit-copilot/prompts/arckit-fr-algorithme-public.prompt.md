---
description: '[COMMUNITY] Generate a public algorithm transparency notice complying with Article L311-3-1 CRPA (Loi République Numérique) for French public administration algorithmic decisions'
agent: 'agent'
tools: ['readFile', 'editFiles', 'runCommand', 'codebase', 'search']
---

> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output should be reviewed by qualified DPO / RSSI / legal counsel before reliance. Citations to ANSSI / CNIL / EU regulations may lag the current text — verify against the source.

You are helping an enterprise architect generate a **public algorithm transparency notice** complying with Article L311-3-1 of the Code des Relations entre le Public et l'Administration (CRPA), introduced by the **Loi pour une République Numérique** (7 October 2016, Article 4). This notice is a legal obligation for French public administrations that issue individual decisions based wholly or partly on algorithmic processing.

The obligation is distinct from — and complementary to — GDPR Article 22 (automated decisions) and the EU AI Act. It applies to algorithmic processing whether or not it uses machine learning, and covers any significant individual decision made by the administration.

## User Input

```text
${input:topic:Enter project name or topic}
```

## Instructions

> **Note**: Before generating, scan `projects/` for existing project directories. For each project, list all `ARC-*.md` artifacts, check `external/` for reference documents, and check `000-global/` for cross-project policies. If no external docs exist but they would improve output, ask the user.

### Step 0: Read existing artifacts from the project context

**MANDATORY** (warn if missing):

- **REQ** (Requirements) — Extract: system functional requirements, what decisions the system makes or assists, user groups affected, functional requirements for algorithmic processing (FR-xxx), data requirements (DR-xxx)
  - If missing: warn that the transparency notice requires a clear description of what the algorithm does and which decisions it produces

**RECOMMENDED** (read if available, note if missing):

- **DATA** (Data Model) — Extract: personal data processed, data sources, data flows — essential for the data section of the notice
- **STKE** (Stakeholder Analysis) — Extract: citizen groups affected by algorithmic decisions, their characteristics (vulnerable groups?)
- **RGPD** / **CNIL** (GDPR/CNIL Assessments) — Extract: legal basis for personal data processing, DPO contact, any DPIA findings relating to the algorithm

**OPTIONAL** (read if available, skip silently):

- **AIACT** (AI Act Assessment) — Extract: AI risk classification, high-risk category determination if ML used
- **PRIN** (Architecture Principles, 000-global) — Extract: algorithmic transparency principles, data governance policy

### Step 0b: Read external documents and policies

- Read any **external documents** in `external/` — extract existing algorithm documentation, model cards, technical specifications, legal opinions on transparency obligations
- Read any **global policies** in `000-global/policies/` — extract algorithmic transparency policy, data classification policy, citizen rights policy

### Step 1: Identify or Create Project

Identify the target project from the hook context. If the project doesn't exist:

1. Use Glob to list `projects/*/` directories and find the highest `NNN-*` number
2. Calculate the next number (zero-padded to 3 digits)
3. Slugify the project name
4. Use the Write tool to create `projects/{NNN}-{slug}/README.md`
5. Set `PROJECT_ID` and `PROJECT_PATH`

### Step 2: Read Source Artifacts

Read all documents from Step 0. Extract:

- All algorithmic processes that produce individual administrative decisions
- Data inputs used by each algorithm
- Decision types and their impact on citizens
- Whether any algorithm is fully automated or uses human review

### Step 3: Algorithm Transparency Template Reading

**Read the template** (with user override support):

- **First**, check if `.arckit/templates/fr-algorithme-public-template.md` exists in the project root
- **If found**: Read the user's customized template
- **If not found**: Read `.arckit/templates/fr-algorithme-public-template.md`

### Step 4: Algorithm Transparency Assessment

#### Step 4a: Obligation Scoping

Before generating notices, determine whether the obligation applies:

1. **Public administration**: The obligation applies to all public administrations (État, collectivités territoriales, établissements publics, organismes chargés d'une mission de service public). Confirm the entity type.
2. **Individual decision**: The obligation applies to decisions that individually affect a person. General decisions (regulations, policies) are not covered. Confirm the decision type.
3. **Algorithmic basis**: The obligation applies when the decision is taken "wholly or in part" based on algorithmic processing. Even if a human makes the final decision using algorithm output, the obligation may apply.
4. **Significant effect**: The decision must significantly affect the person — access to services, benefits, rights, penalties, educational placement, etc.
5. **Exceptions**: Document any applicable exceptions (national security, public order, criminal investigation — rare).

For each algorithm in scope, assign an ID (ALGO-xx).

#### Step 4b: Algorithm Description (for each ALGO-xx)

For each algorithm subject to the transparency obligation, document in plain language:

1. **Purpose**: What administrative process does this algorithm support? What decision does it produce?
2. **Legal basis**: What legislation or regulation authorises the administrative decision (not the algorithm — the decision itself)?
3. **Algorithm type**: Rule-based (deterministic rules, thresholds, scoring formulas) or statistical/ML model. Use plain language — avoid jargon.
4. **Inputs**: What data does the algorithm receive? List all criteria, indicators, documents, or data points used.
5. **Output**: What does the algorithm produce — a score, a ranking, a classification, a recommendation, a decision?
6. **Parameters and weights**: For each input parameter, describe its influence on the output. If it is a rule-based system, describe the rules. If it is a model, describe the most significant factors. Weights need not be published if doing so would enable gaming — but the existence of influential parameters must be disclosed.
7. **Human review**: Is the algorithmic output the final decision, or does a human decision-maker review it? Document the human oversight step.

#### Step 4c: Data Assessment (for each ALGO-xx)

1. **Data inventory**: List all data types used by the algorithm — source, whether personal data, and legal basis for processing
2. **GDPR Article 22 check**: Does the algorithm make fully automated decisions with legal or similarly significant effects on individuals? If yes, GDPR Article 22 applies — flag for `/arckit.eu-rgpd`
3. **Sensitive data**: Does the algorithm use special categories of data (health, ethnicity, political opinion, etc.)? If yes, enhanced obligations apply.
4. **Data minimisation**: Is the algorithm using only the minimum data necessary? Flag any data inputs whose necessity is unclear.

#### Step 4d: Citizen Rights and Recourse

For each algorithm, document:

1. **Right to explanation**: How can a citizen request an explanation of the algorithmic decision applied to them? Who is the contact point and what is the response time?
2. **Right to human review**: Can the citizen request that a human decision-maker review the algorithmic output? What is the process?
3. **Right to contest**: What administrative appeal mechanism exists? What is the jurisdiction for judicial review?
4. **GDPR rights**: If personal data is processed, what are the data subject rights and the DPO contact?

#### Step 4e: Publication Plan

1. **algorithmes.data.gouv.fr**: All public algorithm notices should be published on the DINUM algorithmic transparency platform
2. **Administration website**: The notice must be accessible from the administration's own website, ideally linked from the decision notification sent to citizens
3. **Decision notification**: The administrative decision letter/email sent to the citizen should reference the existence of algorithmic processing and where to find the notice
4. **Maintenance**: Define a process for updating the notice when the algorithm changes

#### Step 4f: Intersections

- **GDPR / CNIL**: If the algorithm processes personal data, document the GDPR intersection. Recommend running `/arckit.fr-rgpd` for CNIL-specific assessment.
- **EU AI Act**: If the algorithm uses ML/AI techniques, assess the AI Act high-risk category (Annex III includes access to essential public services, education, employment). Recommend `/arckit.eu-ai-act`.
- **DPIA**: If the algorithm systematically profiles citizens or processes sensitive data at scale, a DPIA (AIPD) is likely required. Flag for `/arckit.dpia`.

### Step 5: Generate Algorithm Transparency Document

**CRITICAL**: Use the **Write tool** to create the full transparency notice document.

1. **Detect version**: Check for existing `ARC-{PROJECT_ID}-ALGO-v*.md` files:
   - No existing file → VERSION="1.0"
   - Existing file → minor increment if algorithm updated, major if new algorithm added

2. **Auto-populate Document Control**:
   - Document ID: `ARC-{PROJECT_ID}-ALGO-v{VERSION}`
   - Status: DRAFT
   - Created Date: {current_date}
   - Next Review Date: {current_date + 12 months}
   - Classification: PUBLIC — this notice must be publicly accessible

3. Write the complete transparency notice following the template.

Before writing the file, read `.arckit/references/quality-checklist.md` and verify all **Common Checks** plus **ALGO** per-type checks pass.

Write the document to:

```text
projects/{project_id}/ARC-{PROJECT_ID}-ALGO-v{VERSION}.md
```

### Step 6: Summary Output

```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Algorithm Transparency Notice Generated
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 Document: projects/{project_id}/ARC-{PROJECT_ID}-ALGO-v{VERSION}.md
📋 Document ID: {document_id}
📅 Date: {date}
🔓 Classification: PUBLIC

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Algorithms Assessed
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Algorithms in scope:       {N}
Fully automated decisions: {N}
Personal data involved:    {N} algorithms
AI/ML-based algorithms:    {N}
Published / To publish:    {N} / {N}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ Intersections Flagged
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{GDPR Art. 22 (automated decisions): applies / not applicable}
{AI Act high-risk: likely / not applicable}
{DPIA required: yes / no}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Next steps:
1. Publish notice on algorithmes.data.gouv.fr
2. {If personal data: Run /arckit.fr-rgpd for CNIL assessment}
3. {If ML/AI: Run /arckit.eu-ai-act for AI Act risk classification}
4. {If profiling or sensitive data at scale: Run /arckit.dpia}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Important Notes

- **Legal obligation, not best practice**: Article L311-3-1 CRPA is a legal obligation for public administrations. Non-compliance is not merely a governance gap — it is a breach of administrative law that can be raised in administrative court proceedings contesting an algorithmic decision.
- **Applies to rule-based systems too**: The obligation is not limited to AI or machine learning systems. A scoring formula in a spreadsheet that determines a citizen's benefit entitlement triggers the obligation just as much as a neural network.
- **Plain language is mandatory**: The notice must be understandable by the citizen concerned, not just by data scientists. Technical jargon and mathematical formulae are insufficient — the notice must explain the algorithm in accessible terms.
- **algorithmes.data.gouv.fr**: DINUM operates a public register of algorithmic notices. Publishing there satisfies the publication requirement and increases trust. The notice format is standardised on the platform.
- **Distinction from GDPR Article 22**: GDPR Article 22 applies to fully automated decisions with legal or significant effects when personal data is involved. Article L311-3-1 CRPA applies more broadly — to any individual administrative decision based on algorithmic processing, including when a human reviews the algorithmic output.
- **ATRS parallel**: The UK equivalent is the Algorithmic Transparency Recording Standard (ATRS). The CRPA obligation is more legally binding than ATRS, which is a voluntary standard in the UK.

## Key References

| Document | Publisher | URL |
|----------|-----------|-----|
| Art. L311-3-1 CRPA (algorithmic transparency obligation) | Légifrance | https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000033218710/ |
| Loi n°2016-1321 pour une République Numérique (source legislation) | Légifrance | https://www.legifrance.gouv.fr/loda/id/JORFTEXT000033202746 |
| algorithmes.data.gouv.fr — public algorithm register | DINUM | https://algorithmes.data.gouv.fr/ |
| CNIL guidance on algorithms and automated decisions | CNIL | https://www.cnil.fr/fr/algorithmes |
| GDPR Article 22 — automated individual decision-making | EUR-Lex | https://eur-lex.europa.eu/eli/reg/2016/679/oj |
| EU AI Act (Regulation 2024/1689) — for ML-based algorithms | EUR-Lex | https://eur-lex.europa.eu/eli/reg/2024/1689/oj |

> **Note for reviewers**: Art. L311-3-1 CRPA was introduced by the Loi pour une République Numérique (October 2016), France's digital republic law. It requires French public administrations to explain algorithmic decisions to citizens — a legally binding obligation that predates and goes further than equivalent voluntary standards in the UK (ATRS) or EU (AI Act transparency requirements for high-risk systems).

## Success Criteria

- ✅ Transparency notice document created at `projects/{project_id}/ARC-{PROJECT_ID}-ALGO-v{VERSION}.md`
- ✅ Obligation scope determined (public administration, individual decisions, algorithmic basis)
- ✅ All algorithms subject to obligation identified and assigned ALGO-xx IDs
- ✅ Each algorithm described in plain language (purpose, inputs, parameters, weights, output)
- ✅ Human oversight step documented for each algorithm
- ✅ Data inventory completed (personal data, legal basis, minimisation)
- ✅ Citizen rights and recourse mechanisms documented (explanation, human review, appeal)
- ✅ GDPR Article 22 intersection assessed
- ✅ AI Act intersection flagged if ML/AI used
- ✅ Publication plan (algorithmes.data.gouv.fr + administration website) documented
- ✅ Document classified PUBLIC
- ✅ ALGO per-type quality checks passed

## Example Usage

```text
/arckit.fr-algorithme-public Generate transparency notice for a rectorate school admissions algorithm — prioritises candidates for selective programmes based on grades, distance, and socioeconomic criteria, affects 20,000 students per year

/arckit.fr-algorithme-public Algorithm transparency for 001 — CAF benefit eligibility scoring system, rule-based algorithm combining income, household composition, and employment status, fully automated initial decision

/arckit.fr-algorithme-public Transparency notice for a Pôle Emploi job matching algorithm — ML-based recommendation system matching job seekers to offers, human advisor reviews recommendations
```

## Suggested Next Steps

After completing this command, consider running:

- `/arckit-eu-ai-act` -- Assess AI Act obligations if the algorithm uses machine learning or automated decision-making with significant citizen impact *(when Algorithm uses AI/ML techniques or produces decisions with significant legal or similar effects)*
- `/arckit-eu-rgpd` -- Assess GDPR obligations for personal data processed in the algorithm *(when Algorithm processes personal data — GDPR Article 22 automated decision-making rules may apply)*
- `/arckit-fr-rgpd` -- Assess CNIL-specific obligations for French personal data processing in the algorithm *(when Algorithm processes personal data of French citizens and CNIL guidance applies)*
- `/arckit-dpia` -- Conduct a DPIA if the algorithm systematically processes personal data at scale or profiles individuals *(when Algorithm involves profiling, systematic processing, or sensitive data — DPIA required under GDPR Article 35)*
