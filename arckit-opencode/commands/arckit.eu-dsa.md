---
description: "[COMMUNITY] Assess EU Digital Services Act (DSA, Regulation 2022/2065) compliance obligations for online intermediary services, platforms, and very large online platforms"
---

> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output should be reviewed by qualified DPO / RSSI / legal counsel before reliance. Citations to ANSSI / CNIL / EU regulations may lag the current text — verify against the source.

You are helping an enterprise architect generate a **EU Digital Services Act (DSA) Compliance Assessment** (Regulation EU 2022/2065) for an online intermediary service operating in the European Union. The DSA has applied in full since **17 February 2024** and establishes a tiered framework of obligations for online intermediaries based on their role and user reach.

## User Input

```text
$ARGUMENTS
```

## Instructions

> **Note**: Before generating, scan `projects/` for existing project directories. For each project, list all `ARC-*.md` artifacts, check `external/` for reference documents, and check `000-global/` for cross-project policies. If no external docs exist but they would improve output, ask the user.

### Step 0: Read existing artifacts from the project context

**MANDATORY** (warn if missing):

- **REQ** (Requirements) — Extract: service type (marketplace, platform, search engine, hosting), user scale (average monthly active EU users), functional requirements relating to content moderation, recommender systems, advertising
  - If missing: warn that DSA classification requires understanding of service type and user scale

**RECOMMENDED** (read if available, note if missing):

- **RISK** (Risk Register) — Extract: content moderation risks, platform abuse risks, systemic risks (for VLOPs)
- **STKE** (Stakeholder Analysis) — Extract: user groups (especially minors), business users, regulators

**OPTIONAL** (read if available, skip silently):

- **RGPD** (GDPR Assessment) — Extract: personal data processed in recommender systems and advertising
- **PRIN** (Architecture Principles, 000-global) — Extract: content moderation policy, transparency principles

### Step 0b: Read external documents and policies

- Read any **external documents** in `external/` — extract existing terms of service, transparency reports, content moderation policy, advertising policy, Commission designation decisions (if VLOP/VLOSE)
- Read any **global policies** in `000-global/policies/` — extract content policy, trust and safety policy, recommender system documentation

### Step 1: Identify or Create Project

Identify the target project from the hook context. If the project doesn't exist:

1. Use Glob to list `projects/*/` directories and find the highest `NNN-*` number
2. Calculate the next number (zero-padded to 3 digits)
3. Slugify the project name
4. Use the Write tool to create `projects/{NNN}-{slug}/README.md`
5. Set `PROJECT_ID` and `PROJECT_PATH`

### Step 2: Read Source Artifacts

Read all documents from Step 0. Identify:

- Service type (hosting, platform, marketplace, search engine)
- Monthly active EU users (determines VLOP/VLOSE threshold at 45M)
- Enterprise size (micro/small = < 50 employees and < €10M — some exemptions apply)
- Whether service is formally designated VLOP/VLOSE by the Commission

### Step 3: DSA Template Reading

**Read the template** (with user override support):

- **First**, check if `.arckit/templates/eu-dsa-template.md` exists in the project root
- **If found**: Read the user's customized template
- **If not found**: Read `.arckit/templates/eu-dsa-template.md`

### Step 4: Provider Classification

Before generating the assessment, determine the applicable tier:

| Tier | Criteria | Obligation Level |
|------|---------|----------------|
| Mere conduit / Caching | Pure transmission or temporary caching only | Minimal (Chapter II, cooperation only) |
| Hosting service | Stores content on behalf of users | + Notice and action |
| Online platform (standard) | Hosting + public dissemination, ≥ 50 employees or ≥ €10M | + Content moderation transparency, complaint handling, ads transparency |
| Micro/small online platform | < 50 employees AND < €10M | Same as hosting (exempted from some platform obligations) |
| VLOP / VLOSE | ≥ 45M average monthly EU users, Commission-designated | + Systemic risk assessment, annual audit, researcher access, Commission supervision |

Show the tier determination clearly before generating the full assessment.

### Step 5: Generate DSA Assessment

**CRITICAL**: Use the **Write tool** to create the assessment document.

1. **Detect version**: Check for existing `ARC-{PROJECT_ID}-DSA-v*.md` files:
   - No existing file → VERSION="1.0"
   - Existing file → minor increment if refreshed, major if classification changed

2. **Auto-populate Document Control**:
   - Document ID: `ARC-{PROJECT_ID}-DSA-v{VERSION}`
   - Status: DRAFT
   - Created Date: {current_date}
   - Next Review Date: {current_date + 12 months}
   - Provider Category: from Step 4 classification
   - DSC: ARCOM (if French establishment) or relevant member state authority

3. **Section 1: Provider Classification**
   - Service type determination with rationale
   - Monthly active EU users (if available) vs 45M threshold
   - Enterprise size assessment (micro/small exemptions)
   - Formal VLOP/VLOSE designation status

4. **Section 2: General Obligations (Chapter II — all intermediaries)**
   - Transparency reports (Article 15): public reporting on content moderation
   - Complaints-handling mechanism
   - Out-of-court dispute settlement (Article 21)
   - Single point of contact for authorities (Article 11)
   - Cooperation with lawful authority orders (Articles 9–10)

5. **Section 3: Hosting Provider Obligations (Article 16)**
   - Notice and action mechanism (report illegal content)
   - Processing of reports and notification to reporters
   - Flagging to law enforcement for serious crimes (child sexual abuse, terrorism)

6. **Section 4: Online Platform Obligations (Articles 17–28)** (if applicable)
   - Statement of reasons for content restriction (Article 17)
   - Internal complaint-handling (Article 20)
   - Trusted flaggers programme (Article 22)
   - Repeat infringer policy (Article 23)
   - Dark patterns prohibition (Article 25)
   - Advertising transparency: no profiling of minors, no sensitive category profiling (Article 26)
   - Recommender systems transparency and non-profiling option (Article 27)

7. **Section 5: VLOP / VLOSE Additional Obligations (Chapter IV)** (if applicable, else mark N/A)
   - Annual systemic risk assessment (Article 34): illegal content, fundamental rights, civic discourse, public security, gender-based violence, minors
   - Risk mitigation measures (Article 35)
   - Crisis response mechanism (Article 36)
   - Independent audit (Article 37) — ISAE 3000 or equivalent
   - Non-profiling recommender option (Article 38)
   - Advertising repository publicly accessible (Article 39)
   - Researcher data access mechanism (Article 40)
   - Digital Services Coordinator notification of new VLOP features (Article 65)

8. **Section 6: French ARCOM Context**
   - ARCOM as Digital Services Coordinator for France
   - ARCOM enforcement powers (fines up to 6% global turnover)
   - French transposition specifics if any
   - European Board for Digital Services coordination

9. **Section 7: Gap Analysis and Action Plan**
   - Obligations by tier with compliance status
   - Priority gaps (🔴 for VLOPs legally required, 🟠 for standard platforms)

Before writing the file, read `.arckit/references/quality-checklist.md` and verify all **Common Checks** pass.

Write the document to:

```text
projects/{project_id}/ARC-{PROJECT_ID}-DSA-v{VERSION}.md
```

### Step 6: Summary Output

```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ DSA Compliance Assessment Generated
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 Document: projects/{project_id}/ARC-{PROJECT_ID}-DSA-v{VERSION}.md
📋 Document ID: {document_id}
📅 Assessment Date: {date}
⚡ DSA Applied: 17 February 2024

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Provider Classification
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Tier: {Mere conduit / Hosting / Platform / VLOP / VLOSE}
Monthly EU Users: {N or "< 45M" or "≥ 45M"}
Enterprise Size: {Micro-small / Standard}
VLOP Designation: {Yes / No / Not applicable}
Digital Services Coordinator: {ARCOM / Other}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Compliance Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total Gaps: {N} ({N} high, {N} medium)
{If VLOP: Systemic risk assessment: {status}}
{If VLOP: Annual audit: {status}}

Next steps:
1. {If personal data in recommender/ads: Run /arckit.eu-rgpd}
2. {If AI-driven moderation or recommendation: Run /arckit.eu-ai-act}
3. Run /arckit.risk to register DSA gaps
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Important Notes

- **DSA is live**: The DSA has applied since 17 February 2024 for all providers (VLOPs/VLOSEs had earlier application from August 2023). All identified gaps represent current non-compliance.
- **VLOP designation is Commission-driven**: The European Commission formally designates VLOPs and VLOSEs. Self-assessment of the 45M threshold triggers notification obligations — the Commission then decides.
- **Micro/small enterprise exemptions are real**: Platforms with < 50 employees AND < €10M annual turnover are exempted from some platform-specific obligations (Article 21 out-of-court dispute settlement, Article 27 recommender transparency requirements).
- **ARCOM is proactive**: ARCOM has published detailed DSA compliance guidance for French-established providers. Consult ARCOM guidance alongside this assessment.
- **Recommender systems and AI Act overlap**: Recommender systems may simultaneously fall under DSA (transparency) and AI Act (high-risk if employment/benefits context). Run `/arckit.eu-ai-act` if AI-driven.
- **Use Write Tool**: DSA assessments vary significantly by tier. Always use the Write tool.

## Key References

| Document | Publisher | URL |
|----------|-----------|-----|
| DSA (Regulation 2022/2065) — full text | EUR-Lex | https://eur-lex.europa.eu/eli/reg/2022/2065/oj |
| European Commission — DSA implementation and VLOP designations | European Commission | https://digital-strategy.ec.europa.eu/en/policies/digital-services-act-package |
| ARCOM — French Digital Services Coordinator | ARCOM | https://www.arcom.fr/ |
| European Board for Digital Services | European Commission | https://digital-strategy.ec.europa.eu/en/policies/digital-services-act-package |
| DSA transparency database (VLOP content moderation decisions) | European Commission | https://transparency.dsa.ec.europa.eu/ |

> **Note for reviewers**: The DSA (Digital Services Act) applies to online intermediary services operating in the EU — regardless of where the provider is based. It uses a tiered approach: basic obligations for all intermediaries, additional obligations for hosting providers, further obligations for online platforms (social media, marketplaces, app stores), and the strictest obligations for Very Large Online Platforms (VLOPs) and Search Engines (VLOSEs) with 45M+ monthly active EU users. ARCOM (Autorité de Régulation de la Communication Audiovisuelle et Numérique) is the French Digital Services Coordinator — the national enforcement body for France-established providers. The DSA has fully applied since 17 February 2024.

## Success Criteria

- ✅ Assessment document created at `projects/{project_id}/ARC-{PROJECT_ID}-DSA-v{VERSION}.md`
- ✅ Provider tier classification determined (conduit / hosting / platform / VLOP / VLOSE)
- ✅ Monthly active EU users threshold assessed vs 45M
- ✅ Micro/small enterprise exemption assessed
- ✅ General Chapter II obligations assessed (all intermediaries)
- ✅ Hosting Article 16 obligations assessed if applicable
- ✅ Online platform obligations (Articles 17–28) assessed if applicable
- ✅ VLOP/VLOSE additional obligations (Chapter IV) assessed if applicable or explicitly N/A
- ✅ Annual systemic risk assessment status noted for VLOPs
- ✅ ARCOM (French DSC) context documented
- ✅ Gap analysis with priority actions generated

## Example Usage

```text
/arckit.eu-dsa Assess DSA compliance for a French online marketplace (€500M GMV, 8M monthly EU users), hosting third-party seller listings, with recommendation engine and targeted advertising

/arckit.eu-dsa DSA scoping for 001 — social media platform with 60M monthly EU users, Commission designated VLOP, annual systemic risk assessment required

/arckit.eu-dsa DSA compliance for a SaaS hosting service storing user-generated content for B2B clients, no public dissemination — assess hosting obligations
```

## Suggested Next Steps

After completing this command, consider running:

- `/arckit:eu-rgpd` -- Assess GDPR obligations for personal data processed in recommender systems, advertising, and content moderation *(when Service processes personal data of EU users)*
- `/arckit:eu-ai-act` -- Assess AI Act obligations for recommender systems and automated content moderation *(when Service uses AI for recommendation or content moderation decisions)*
- `/arckit:risk` -- Integrate DSA compliance gaps and systemic risk findings into the risk register *(when VLOP or VLOSE designation applies)*
