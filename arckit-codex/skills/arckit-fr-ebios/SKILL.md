---
name: arckit-fr-ebios
description: "[COMMUNITY] Conduct an EBIOS Risk Manager risk analysis study following the ANSSI methodology — five workshops from study framing to risk treatment and homologation recommendation"
---

> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output should be reviewed by qualified DPO / RSSI / legal counsel before reliance. Citations to ANSSI / CNIL / EU regulations may lag the current text — verify against the source.

You are helping an enterprise architect conduct an **EBIOS Risk Manager risk analysis** following the ANSSI (Agence Nationale de la Sécurité des Systèmes d'Information) methodology. EBIOS Risk Manager (Expression des Besoins et Identification des Objectifs de Sécurité) is the French government's official risk analysis methodology, mandatory for OIV (Opérateurs d'Importance Vitale) systems, OSE (Opérateurs de Services Essentiels), RGS homologation, and SecNumCloud provider qualification.

## User Input

```text
$ARGUMENTS
```

## Instructions

> **Note**: Before generating, scan `projects/` for existing project directories. For each project, list all `ARC-*.md` artifacts, check `external/` for reference documents, and check `000-global/` for cross-project policies. If no external docs exist but they would improve output, ask the user.

### Step 0: Read existing artifacts from the project context

**MANDATORY** (warn if missing):

- **REQ** (Requirements) — Extract: system description, functional architecture, integration points (INT-xxx), security requirements (NFR-SEC-xxx), classification level, OIV/OSE designation
  - If missing: STOP — EBIOS Risk Manager requires a clear system description and architecture. Run `/arckit.requirements` first.

**RECOMMENDED** (read if available, note if missing):

- **DATA** (Data Model) — Extract: essential data assets (valeurs métier candidates), data classification levels, data flows to third parties
- **STKE** (Stakeholder Analysis) — Extract: system owners, users, administrators, external entities (potential risk sources)
- **SECD** (Secure by Design) — Extract: existing security baseline measures, controls already in place
- **SECNUM** (SecNumCloud Assessment) — Extract: cloud provider trust level, extraterritorial risk assessment (feeds into Workshop 3 ecosystem threats)
- **DINUM** (DINUM Standards Assessment) — Extract: RGS target level determined, security baseline

**OPTIONAL** (read if available, skip silently):

- **RISK** (Risk Register) — Extract: existing identified risks to pre-populate Workshop 2/3 risk source candidates
- **PRIN** (Architecture Principles, 000-global) — Extract: security principles, data classification policy

### Step 0b: Read external documents and policies

- Read any **external documents** in `external/` — extract previous EBIOS studies, penetration test reports, ANSSI correspondence, sector-specific security orders (arrêtés sectoriels for OIV), threat intelligence reports
- Read any **global policies** in `000-global/policies/` — extract security policy, incident response policy, asset classification policy
- If a previous EBIOS study exists, read it and explicitly note which workshops are being refreshed vs carried forward.

### Step 1: Identify or Create Project

Identify the target project from the hook context. If the project doesn't exist:

1. Use Glob to list `projects/*/` directories and find the highest `NNN-*` number
2. Calculate the next number (zero-padded to 3 digits)
3. Slugify the project name
4. Use the Write tool to create `projects/{NNN}-{slug}/README.md`
5. Set `PROJECT_ID` and `PROJECT_PATH`

### Step 2: Read Source Artifacts

Read all documents from Step 0. From the artifacts, extract:

- System name, description, and technical architecture summary
- Data assets that will become Workshop 1 essential values
- External entities (third parties, partners, interconnections) for Workshop 3 ecosystem map
- Existing security controls for the baseline in Workshop 1
- OIV/OSE designation and classification level

### Step 3: EBIOS Template Reading

**Read the template** (with user override support):

- **First**, check if `.arckit/templates/fr-ebios-template.md` exists in the project root
- **If found**: Read the user's customized template
- **If not found**: Read `.arckit/templates/fr-ebios-template.md`

### Step 4: EBIOS Risk Manager — Five Workshops

**CRITICAL**: This is a structured, sequential risk analysis. Work through all five workshops in order. Use the **Write tool** to write the complete document at the end of Step 5.

---

#### Workshop 1 — Study Framing (Cadrage de l'étude)

**Objective**: Define the scope, identify essential values (valeurs métier), identify feared events, and establish the security baseline.

1. **Study scope**: Define the system boundary — what is included, what is explicitly excluded, which interconnected systems are in scope for the ecosystem analysis
2. **Essential values (Valeurs métier)**: From the data model and requirements, identify the business assets whose protection is the study's primary objective. Typically: core data assets, critical services, key processes. Assign VM-xx IDs.
   - Example: VM-01 Citizen personal data, VM-02 Payment processing service, VM-03 Authentication service
3. **Feared events (Événements redoutés)**: For each essential value, identify events that would constitute a breach. Rate severity on ANSSI 4-level scale:
   - 1 Negligible: minor disruption, no lasting impact
   - 2 Significant: significant disruption, limited financial or reputational impact
   - 3 Major: serious disruption, major financial/reputational damage, legal consequences
   - 4 Critical: systemic impact, catastrophic financial or reputational damage, state-level consequences
4. **Security baseline**: Current security measures in place (ISO 27001, ANSSI hygiene measures, RGS baseline, sector-specific measures)

---

#### Workshop 2 — Risk Sources (Sources de risque)

**Objective**: Identify and profile risk sources, and determine risk source–target pairs.

1. **Risk source catalogue**: Always consider these categories:
   - State-sponsored actors (nation-state cyber espionage, sabotage): High capability, geopolitical motivation
   - Organised cybercriminals (ransomware, fraud): High capability, financial motivation
   - Hacktivists (reputational damage, disruption): Medium capability, ideological motivation
   - Malicious insiders (employees, contractors): Medium capability, financial or ideological motivation
   - Opportunist attackers (script kiddies): Low capability, notoriety motivation
   - Accidental insiders (error, negligence): Not adversarial, but important for availability/integrity
2. **Pertinence assessment**: Retain or exclude each risk source based on motivation and capability in the context of the target system. Document justification for exclusions.
3. **Risk source–target pairs (Couples Source/Objectif)**: For each retained risk source, identify which element of the ecosystem or system is the most likely attack target. Assign CO-xx IDs.

---

#### Workshop 3 — Strategic Scenarios (Scénarios stratégiques)

**Objective**: Model how risk sources reach their targets via the ecosystem (supply chain, partners, trusted channels).

1. **Ecosystem map**: From requirements and external documents, list all stakeholders in the ecosystem — cloud providers, integrators, third-party services, trusted partners, interconnected information systems. Assess trust level and dependency criticality for each.
2. **Strategic scenarios**: For each retained risk source–target pair (CO-xx), describe how the risk source could reach the target via the ecosystem. Consider:
   - Supply chain attacks (compromise a trusted provider → access to target system)
   - Spear-phishing (compromise an employee or administrator → privileged access)
   - Exploitation of interconnected systems (compromise a partner system → lateral movement)
   - Physical intrusion (less common for digital systems, but relevant for hybrid)
3. **Scenario risk level**: Assess each strategic scenario with:
   - Gravity: impact on essential values if the scenario succeeds (1–4 scale)
   - Likelihood: probability of the scenario materialising (1–4 scale)
   - Risk level: combination (often max of both, or use ANSSI risk matrix)

---

#### Workshop 4 — Operational Scenarios (Scénarios opérationnels)

**Objective**: Break down high-risk strategic scenarios into technical attack sequences.

1. **Selection**: Focus operational analysis on the highest-risk strategic scenarios (those with Critical or Major risk level from Workshop 3).
2. **Attack sequence**: For each selected strategic scenario, describe the technical attack path step by step:
   - Reconnaissance (OSINT, scanning)
   - Initial access (phishing, exploitation, supply chain)
   - Execution and persistence
   - Privilege escalation
   - Lateral movement
   - Data exfiltration or sabotage
3. **MITRE ATT&CK mapping**: Map each step to MITRE ATT&CK tactics and techniques. This provides concrete implementation context for security measures.
4. **Technical likelihood**: Assess likelihood based on:
   - Technical feasibility given the identified security baseline
   - Whether public exploits are available for the attack techniques
   - Time and resources required

---

#### Workshop 5 — Risk Treatment (Traitement du risque)

**Objective**: Define security measures, reassess residual risks, and produce the homologation recommendation.

1. **Treatment options**: For each significant risk (from Workshop 3 + 4), choose:
   - **Reduce**: implement security measures that lower likelihood or impact
   - **Avoid**: change architecture/scope to eliminate the risk
   - **Transfer**: contract obligation, insurance (limited in cybersecurity)
   - **Accept**: acknowledge and document residual risk at appropriate authority level
2. **Security measures (Mesures de sécurité)**: Define specific, actionable security measures. Assign MS-xx IDs. For each:
   - Description: what the measure does
   - Type: Technical / Organisational / Legal
   - Addresses: which operational scenario(s) it mitigates
   - Owner: who is responsible for implementation
   - Priority: 🔴 High (deploy before go-live) / 🟠 Medium (deploy within 3 months) / 🟡 Low (deploy within 12 months)
3. **Residual risk reassessment**: After applying measures, reassess remaining risk level for each strategic scenario. Document which residual risks are:
   - Acceptable: within the organisation's risk tolerance → recommend acceptance
   - Acceptable under conditions: specific measures must be confirmed in place
   - Not acceptable: additional treatment needed, or homologation cannot proceed
4. **Homologation recommendation**: Based on the residual risk profile, formulate a clear recommendation to the Autorité d'Homologation:
   - Proceed with homologation (all risks treated or accepted)
   - Proceed with conditions (specific MS-xxx must be confirmed before go-live)
   - Do not proceed (critical residual risks remain unacceptable)

---

### Step 5: Generate EBIOS Document

**CRITICAL**: Use the **Write tool** to create the full EBIOS document.

1. **Detect version**: Check for existing `ARC-{PROJECT_ID}-EBIOS-v*.md` files:
   - No existing file → VERSION="1.0"
   - Existing file → minor increment if refreshed (same scope), major if scope changed or new threat landscape

2. **Auto-populate Document Control**:
   - Document ID: `ARC-{PROJECT_ID}-EBIOS-v{VERSION}`
   - Status: DRAFT
   - Created Date: {current_date}
   - Next Review Date: {current_date + 12 months}
   - Classification: OFFICIAL-SENSITIVE minimum (EBIOS studies contain sensitive risk information); adjust upward if system classification requires it
   - Homologation Authority: from SECD or user input (the Autorité d'Homologation must be named)

3. Write the complete EBIOS study following the five-workshop structure from the template, populated with the analysis conducted in Step 4.

Before writing the file, read `.arckit/references/quality-checklist.md` and verify all **Common Checks** plus **EBIOS** per-type checks pass.

Write the document to:

```text
projects/{project_id}/ARC-{PROJECT_ID}-EBIOS-v{VERSION}.md
```

### Step 6: Summary Output

```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ EBIOS Risk Manager Study Generated
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 Document: projects/{project_id}/ARC-{PROJECT_ID}-EBIOS-v{VERSION}.md
📋 Document ID: {document_id}
📅 Study Date: {date}
🔒 Classification: OFFICIAL-SENSITIVE

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Risk Analysis Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Workshop 1 — Scope and Values:
  Essential Values: {N} (VM-01 to VM-{N})
  Feared Events: {N} ({N} Critical, {N} Major, {N} Significant)

Workshop 2 — Risk Sources:
  Risk Sources Retained: {N} / {N total considered}
  Risk Source–Target Pairs: {N}

Workshop 3 — Strategic Scenarios:
  Scenarios: {N} ({N} Critical/Major risk level)

Workshop 4 — Operational Scenarios:
  Technical Scenarios Analysed: {N}

Workshop 5 — Risk Treatment:
  Security Measures: {N} (Technical: {N}, Organisational: {N}, Legal: {N})
  Residual Risks: {N} ({N} critical, {N} moderate, {N} low)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏛️ Homologation Recommendation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{PROCEED / PROCEED WITH CONDITIONS / DO NOT PROCEED}

{If conditions: List MS-xxx measures that must be confirmed before go-live}
{If critical residuals: List unacceptable residual risks}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Next steps:
1. Submit EBIOS study to Autorité d'Homologation for review
2. {If cloud: Run $arckit-fr-secnumcloud for hosting provider assessment}
3. Run $arckit-secure to implement Workshop 5 technical measures
4. Run $arckit-risk to import residual risks into project risk register
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Important Notes

- **EBIOS requires human expertise**: This command generates a structured EBIOS Risk Manager study from available project artifacts. However, a real EBIOS study for OIV/homologation purposes requires workshops with system architects, operations teams, and security specialists. Use this output as a starting point and draft for the workshop series, not as a final regulatory submission.
- **Classification sensitivity**: EBIOS studies contain detailed information about system vulnerabilities and attack scenarios. Always classify at OFFICIAL-SENSITIVE minimum. For OIV SIIV systems, classification may need to be higher.
- **ANSSI EBIOS RM guide**: The official ANSSI guide (published 2018, updated 2023) is the authoritative reference. This command follows the five-workshop structure and ANSSI severity/likelihood scales.
- **Homologation is sequential**: The EBIOS study is one input to the homologation dossier. Other inputs include security architecture review, penetration testing, and organisational security documentation.
- **effort: max**: EBIOS is one of ArcKit's most complex commands, spanning five workshops and requiring deep analysis of requirements, architecture, and threat landscape. This justifies the `effort: max` setting.
- **Use Write Tool**: EBIOS studies are typically 4,000–12,000 words. Always use the Write tool.

## Key References

| Document | Publisher | URL |
|----------|-----------|-----|
| EBIOS Risk Manager — official guide (2018, updated 2023) | ANSSI | https://cyber.gouv.fr/publications/la-methode-ebios-risk-manager |
| EBIOS RM — club EBIOS (community and tools) | Club EBIOS | https://www.club-ebios.org/ |
| MITRE ATT&CK framework (Workshop 4 technique mapping) | MITRE | https://attack.mitre.org/ |
| RGS v2.0 — homologation requirements | ANSSI | https://cyber.gouv.fr/referentiel-general-de-securite |
| ANSSI — OIV (Opérateurs d'Importance Vitale) obligations | ANSSI | https://cyber.gouv.fr/les-oiv-quest-ce-que-cest |
| NIS2 Directive — OSE (Opérateurs de Services Essentiels) obligations | EUR-Lex | https://eur-lex.europa.eu/eli/dir/2022/2555/oj |

> **Note for reviewers**: EBIOS Risk Manager is the French government's official cybersecurity risk analysis methodology, published by ANSSI (the French national cybersecurity agency). It is mandatory for OIV (critical infrastructure operators) and OSE (essential service operators), and required for RGS homologation. It is France's equivalent of ISO 27005 / NIST RMF but with a structured five-workshop format designed to produce a homologation dossier. "Homologation" is the French administrative process of formally approving an IS for operation — analogous to Authority to Operate (ATO) in the US federal context.

## Success Criteria

- ✅ EBIOS study document created at `projects/{project_id}/ARC-{PROJECT_ID}-EBIOS-v{VERSION}.md`
- ✅ Workshop 1: Study scope, essential values (VM-xx), and feared events documented with severity ratings
- ✅ Workshop 1: Security baseline documented
- ✅ Workshop 2: Risk sources profiled with capability/motivation assessment; source–target pairs (CO-xx) defined
- ✅ Workshop 3: Ecosystem map with stakeholder trust levels; strategic scenarios with risk levels (gravity × likelihood)
- ✅ Workshop 4: Operational attack sequences for high-risk scenarios; MITRE ATT&CK mapping
- ✅ Workshop 5: Security measures (MS-xx) with type, owner, and priority; residual risk reassessment
- ✅ Homologation recommendation (Proceed / Conditions / Do not proceed) clearly stated
- ✅ Document classified OFFICIAL-SENSITIVE minimum
- ✅ Homologation Authority named in Document Control
- ✅ EBIOS per-type quality checks passed

## Example Usage

```text
$arckit-fr-ebios Conduct EBIOS Risk Manager study for a French ministry citizen portal handling personal and financial data, RGS *** target level, requiring homologation before go-live, cloud hosted on SecNumCloud provider

$arckit-fr-ebios EBIOS study for 001 — French regional hospital information system (SIH), OIV designation (secteur santé), données de santé, connexion avec Mon Espace Santé

$arckit-fr-ebios EBIOS Risk Manager for a critical national infrastructure operator (OIV énergie), SIIV system, connection to SCADA/OT network, IGI 1300 classified components
```

## Suggested Next Steps

After completing this command, consider running:

- `$arckit-fr-secnumcloud` -- Assess SecNumCloud provider options informed by EBIOS strategic and operational scenarios *(when Cloud hosting identified as critical dependency in EBIOS ecosystem map)*
- `$arckit-fr-dinum` -- Align EBIOS security measures with RGS homologation requirements *(when System requires RGS homologation)*
- `$arckit-secure` -- Implement the technical security measures identified in Workshop 5 *(when Security measures (MS-xxx) have been defined in EBIOS Workshop 5)*
- `$arckit-risk` -- Import EBIOS residual risks into the project risk register *(when Residual risks from Workshop 5 need to be tracked in the project risk register)*
