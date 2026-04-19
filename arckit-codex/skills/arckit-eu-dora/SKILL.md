---
name: arckit-eu-dora
description: "[COMMUNITY] Assess DORA (Digital Operational Resilience Act, EU 2022/2554) compliance for financial sector entities operating in the EU"
---

> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output should be reviewed by qualified DPO / RSSI / legal counsel before reliance. Citations to ANSSI / CNIL / EU regulations may lag the current text — verify against the source.

You are helping an enterprise architect generate a **DORA Compliance Assessment** (Digital Operational Resilience Act, EU Regulation 2022/2554) for a financial sector entity operating in the European Union. DORA has applied since **17 January 2025** and establishes a unified framework for ICT risk management, incident reporting, resilience testing, and third-party risk management in the financial sector.

## User Input

```text
$ARGUMENTS
```

## Instructions

> **Note**: Before generating, scan `projects/` for existing project directories. For each project, list all `ARC-*.md` artifacts, check `external/` for reference documents, and check `000-global/` for cross-project policies. If no external docs exist but they would improve output, ask the user.

### Step 0: Read existing artifacts from the project context

**MANDATORY** (warn if missing):

- **REQ** (Requirements) — Extract: ICT system requirements, availability/resilience requirements (NFR-xxx), third-party integration requirements (INT-xxx), regulatory compliance requirements
  - If missing: proceed with user-provided entity description; warn that full ICT risk assessment requires defined requirements

**RECOMMENDED** (read if available, note if missing):

- **RISK** (Risk Register) — Extract: ICT risks, third-party risks, concentration risks, operational resilience risks
- **SECD** (Secure by Design) — Extract: existing ICT security controls, maturity assessment, current incident response capability
- **PRIN** (Architecture Principles, 000-global) — Extract: ICT risk tolerance, redundancy principles, vendor diversification policy

**OPTIONAL** (read if available, skip silently):

- **NIS2** (NIS2 Assessment) — Extract: overlapping security obligations for financial entities designated as OSE
- **SECNUM** (SecNumCloud Assessment) — Extract: cloud provider sovereignty assessment for French financial entities

### Step 0b: Read external documents and policies

- Read any **external documents** in `external/` — extract ACPR/AMF correspondence, existing ICT risk management framework documentation, third-party registers, previous audit reports, existing BCP/DR documentation
- Read any **global policies** in `000-global/policies/` — extract ICT risk policy, incident response policy, supplier management policy, BCM policy
- If pre-existing ICT risk documentation found, use it to pre-populate maturity assessment.

### Step 1: Identify or Create Project

Identify the target project from the hook context. If the project doesn't exist:

1. Use Glob to list `projects/*/` directories and find the highest `NNN-*` number
2. Calculate the next number (zero-padded to 3 digits)
3. Slugify the project name
4. Use the Write tool to create `projects/{NNN}-{slug}/README.md`
5. Set `PROJECT_ID` and `PROJECT_PATH`

### Step 2: Read Source Artifacts

Read all documents from Step 0. Identify:

- Entity type (bank, payment institution, insurance, investment firm, crypto-asset, CCP, etc.)
- Competent authority (ACPR / AMF / ECB / other)
- Size (microenterprise eligibility for simplified regime)
- Cloud providers in use (potential critical ITPP)
- Existing ICT risk management maturity level

### Step 3: DORA Template Reading

**Read the template** (with user override support):

- **First**, check if `.arckit/templates/eu-dora-template.md` exists in the project root
- **If found**: Read the user's customized template
- **If not found**: Read `.arckit/templates/eu-dora-template.md`

### Step 4: Entity Scoping (Article 2)

Before generating the assessment, determine entity scope:

DORA covers: credit institutions, payment institutions, electronic money institutions, investment firms, crypto-asset service providers (MiCA), insurance/reinsurance undertakings (if > 250 employees), insurance intermediaries (if > 250 employees), pension funds (if > 15 members), CCPs, trading venues, ICT third-party service providers

**Proportionality**: microenterprises (< 10 employees, < €2M turnover) and some small entities may benefit from simplified ICT risk framework (Article 16).

Show entity scoping before generating the full assessment.

### Step 5: Generate DORA Assessment

**CRITICAL**: Use the **Write tool** to create the assessment document.

1. **Detect version**: Check for existing `ARC-{PROJECT_ID}-DORA-v*.md` files:
   - No existing file → VERSION="1.0"
   - Existing file → minor increment if refreshed, major if scope changed

2. **Auto-populate Document Control**:
   - Document ID: `ARC-{PROJECT_ID}-DORA-v{VERSION}`
   - Status: DRAFT
   - Created Date: {current_date}
   - Next Review Date: {current_date + 12 months}
   - Entity Type: from user input
   - Competent Authority: ACPR/AMF/ECB/other

3. **Section 1: Entity Scoping**
   - In-scope entity type (Article 2 table)
   - Competent authority
   - Proportionality assessment (microenterprise / simplified regime eligibility)

4. **Executive Summary Maturity Table**
   - Five pillars with current maturity (L1–L5) vs required level vs gap:
     - ICT Risk Management
     - Incident Reporting (4h/72h/1m)
     - Resilience Testing
     - Third-Party Management
     - Concentration Risk

5. **Section 2: ICT Risk Management Framework (Articles 5–16)**
   - All ten framework requirements with status and gaps
   - Extract existing controls from SECD/RISK artifacts
   - Simplified framework eligibility flag if microenterprise

6. **Section 3: ICT Incident Management (Articles 17–23)**
   - Major incident classification criteria (clients affected, transaction volume, duration, reputational impact, economic impact)
   - Three-stage reporting timeline:
     - Initial notification: 4 hours after major classification (max 24h from detection) → ACPR/AMF
     - Intermediate: 72 hours after initial
     - Final: 1 month after resolution
   - Reporting readiness checklist
   - Voluntary cyber threat reporting process

7. **Section 4: Digital Operational Resilience Testing (Articles 24–27)**
   - Annual testing requirements: vulnerability assessments, open-source analysis, network security, gap analysis, source code review (if applicable), scenario-based tests
   - TLPT (Threat-Led Penetration Testing) every 3 years for significant entities
   - TIBER-EU framework requirements
   - Testing status per requirement

8. **Section 5: ICT Third-Party Risk Management (Articles 28–44)**
   - Register of ICT arrangements: inventory all ICT service contracts with criticality assessment
   - Mandatory contract provisions (Article 30): SLAs, notice periods, data location, audit rights, termination rights, BCP provisions
   - Critical ITPP (CITPP) obligations if using ESA-designated critical providers
   - Concentration risk assessment: single-provider over-reliance, exit strategies
   - Sub-contractors and supply chain risks

9. **Section 6: French Supervisory Context**
   - ACPR role (banks, insurance, payment institutions)
   - AMF role (investment firms, CCPs, trading venues)
   - Banque de France (systemic risk)
   - ANSSI (cybersecurity technical input + SecNumCloud)
   - Pre-DORA ACPR ICT requirements supersession

10. **Section 7: Gap Analysis and Roadmap**
    - Pillar-by-pillar gap table with priority and owner
    - Note DORA has applied since 17 January 2025 — all gaps are current violations

Before writing the file, read `.arckit/references/quality-checklist.md` and verify all **Common Checks** pass.

Write the document to:

```text
projects/{project_id}/ARC-{PROJECT_ID}-DORA-v{VERSION}.md
```

### Step 6: Summary Output

```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ DORA Assessment Generated
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 Document: projects/{project_id}/ARC-{PROJECT_ID}-DORA-v{VERSION}.md
📋 Document ID: {document_id}
📅 Assessment Date: {date}
⚡ DORA Applied: 17 January 2025

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏦 Entity Scoping
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Entity Type: {type}
Competent Authority: {ACPR / AMF / other}
Simplified Regime: {Eligible / Not eligible}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Maturity Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Pillar                        | Current | Required | Gap  |
|-------------------------------|---------|----------|------|
| ICT Risk Management           | L{N}    | L3+      | {gap}|
| Incident Reporting (4h/72h)   | L{N}    | L4       | {gap}|
| Resilience Testing            | L{N}    | L3       | {gap}|
| Third-Party Management        | L{N}    | L3+      | {gap}|
| Concentration Risk            | L{N}    | L2       | {gap}|

Total Gaps: {N} ({N} high priority)

Next steps:
1. {If OSE designation: Run $arckit-eu-nis2 for NIS2 overlap}
2. Run $arckit-risk to register DORA gaps
3. Run $arckit-secure for ICT security controls
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Important Notes

- **DORA is live**: DORA has applied since 17 January 2025. All identified gaps represent current non-compliance. There is no transition period remaining.
- **4-hour reporting**: The initial notification to ACPR/AMF must be within 4 hours of classifying an incident as "major" (max 24h from detection). This requires 24/7 monitoring and rapid classification capability.
- **Concentration risk is explicit**: DORA explicitly requires assessment of over-reliance on single ICT providers. Multi-cloud or multi-provider strategies must be documented and justified.
- **TLPT requires regulatory agreement**: For significant entities, TLPT scope must be agreed with ACPR/AMF before testing. Allow 3–6 months lead time.
- **Use Write Tool**: DORA assessments are comprehensive and cover 5 major pillars. Always use the Write tool.

## Key References

| Document | Publisher | URL |
|----------|-----------|-----|
| DORA (Regulation 2022/2554) — full text | EUR-Lex | https://eur-lex.europa.eu/eli/reg/2022/2554/oj |
| EBA — DORA regulatory technical standards and guidelines | EBA | https://www.eba.europa.eu/regulation-and-policy/operational-resilience |
| EIOPA — DORA guidance for insurance sector | EIOPA | https://www.eiopa.europa.eu/digital-operational-resilience-act_en |
| ESMA — DORA guidance for investment sector | ESMA | https://www.esma.europa.eu/convergence/digital-operational-resilience |
| ACPR — French banking/insurance supervisor (DORA national enforcement) | ACPR | https://acpr.banque-france.fr/ |
| AMF — French financial markets authority | AMF | https://www.amf-france.org/ |
| ENISA — ICT risk and financial sector cybersecurity | ENISA | https://www.enisa.europa.eu/topics/cybersecurity-policy/financial-sector |

> **Note for reviewers**: DORA (Digital Operational Resilience Act) applies to the entire EU financial sector — banks, insurers, investment firms, payment institutions, crypto-asset service providers, and their critical ICT third-party providers. It is enforced by the European Supervisory Authorities (EBA, EIOPA, ESMA) jointly. In France, ACPR (banking/insurance) and AMF (markets) are the national competent authorities. DORA's TLPT (Threat-Led Penetration Testing) requires testing against real threat scenarios — more rigorous than standard penetration testing.

## Success Criteria

- ✅ Assessment document created at `projects/{project_id}/ARC-{PROJECT_ID}-DORA-v{VERSION}.md`
- ✅ Entity type and competent authority determined
- ✅ Simplified regime eligibility assessed
- ✅ ICT risk management framework assessed (Articles 5–16)
- ✅ Major incident classification criteria defined
- ✅ Three-stage reporting timeline (4h/72h/1m) assessed
- ✅ Annual testing programme assessed
- ✅ TLPT requirements assessed for significant entities
- ✅ ICT third-party register documented
- ✅ Mandatory contract provisions (Article 30) checklist completed
- ✅ Concentration risk assessed with exit strategies
- ✅ French supervisory context (ACPR/AMF/ANSSI) documented
- ✅ Maturity assessment (L1–L5) for all five pillars
- ✅ Gap analysis with priority actions generated

## Example Usage

```text
$arckit-eu-dora Assess DORA compliance for a French payment institution (€200M revenue, 300 staff) migrating core payment processing to a cloud-native architecture using AWS and a French SecNumCloud-qualified secondary provider, ACPR-supervised

$arckit-eu-dora DORA scoping for 001 — French insurance company (€1.5B premiums) with no formal ICT risk framework, ACPR-supervised, using SAP RISE (cloud) as core system

$arckit-eu-dora DORA for a Belgian CCP with operations in FR and NL, AMF/FSMA co-supervised, considering a new critical cloud dependency on a single provider
```

## Suggested Next Steps

After completing this command, consider running:

- `$arckit-eu-nis2` -- Map overlapping NIS2 cybersecurity obligations for financial entities designated as OSE *(when Entity is also subject to NIS2 as an operator of essential services)*
- `$arckit-risk` -- Integrate DORA ICT risk findings and third-party concentration risks into the risk register
- `$arckit-secure` -- Implement technical security controls addressing DORA ICT risk management requirements
