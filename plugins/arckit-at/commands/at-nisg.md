---
description: "[COMMUNITY] Assess Austrian NISG 2026 obligations (BGBl. I Nr. 94/2025, in force 1 Oct 2026) — AT transposition of NIS2, Cybersicherheitsbehörde registration, CSIRT incident reporting, KSÖ coordination, and Austrian sectoral rules for Essential/Important entities"
argument-hint: "<project ID or organisation, e.g. '001', 'Austrian regional energy operator', 'Vienna MSP serving critical sectors'>"
effort: high
handoffs:
  - command: eu-nis2
    description: Run the pan-EU NIS2 baseline first if not already completed
    condition: "No prior eu-nis2 assessment exists for this project"
  - command: at-dsgvo
    description: Assess AT DSG obligations where NISG processing involves personal data
    condition: "Security monitoring processes personal data (logs, user activity)"
  - command: risk
    description: Integrate NISG gap findings into the project risk register
  - command: secure
    description: Implement security controls addressing NISG / NIS2 Article 21 ten minimum measures
---


> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output should be reviewed by qualified CISO / Cybersicherheitsbehörde-liaison / Rechtsabteilung before reliance. Citations to the Cybersicherheitsbehörde / A-SIT / EU regulations may lag the current text — verify against the source. Items marked `[NEEDS VERIFICATION]` must be confirmed against the **enacted NISG 2026 text (BGBl. I Nr. 94/2025) and its implementing ordinances (Verordnungen)** before external use — the law is newly enacted and its ordinances are still forthcoming.

You are helping an enterprise architect generate an **Austrian NISG 2026 Compliance Assessment** — the Austrian transposition of NIS2 (EU Directive 2022/2555). The **Netz- und Informationssystemsicherheitsgesetz 2026 (NISG 2026, BGBl. I Nr. 94/2025)** is a **standalone act** (not a mere amendment of the NISG 2018). It was passed on 12 December 2025, published on 23 December 2025, and **enters into force on 1 October 2026 (§51)**; it **replaces the NISG 2018**, which expires on 30 September 2026. Essential/Important entities must register with the Cybersicherheitsbehörde within three months of entry into force — i.e. **by 31 December 2026 (§29)** — and provide the first Wirksamkeitsnachweis by **30 September 2027 (§33)**. Run this after `/arckit:eu-nis2` to add Austrian obligations that go beyond the EU baseline.

## User Input

```text
$ARGUMENTS
```

## Instructions

> **Note**: The ArcKit Project Context hook has already detected all projects, artifacts, external documents, and global policies. Use that context below — no need to scan directories manually.

### Step 0: Read existing artifacts from the project context

**MANDATORY** (warn if missing):

- **REQ** (Requirements) — Extract: security requirements (NFR-SEC-xxx), operational requirements, integration requirements (INT-xxx), sector and entity type information, criticality thresholds
  - If missing: proceed with user-provided entity description, but note that requirements analysis would strengthen the gap assessment

**RECOMMENDED** (read if available, note if missing):

- **NIS2** (EU NIS2 Assessment) — Extract: Annex I / Annex II classification, size threshold results, Article 21 ten-measure status, incident reporting baseline
  - If missing: warn that `/arckit:at-nisg` should be run after `/arckit:eu-nis2` for best results
- **RISK** (Risk Register) — Extract: existing security risks, supply chain risks, third-party risks, business continuity risks
- **SECD** (Secure by Design) — Extract: existing security controls, maturity assessments, security architecture decisions
- **PRIN** (Architecture Principles, 000-global) — Extract: security baseline, incident response principles, supply chain policy

**OPTIONAL** (read if available, skip silently):

- **ATDSG** (AT DSG Assessment) — Extract: overlap where security monitoring processes personal data
- **DORA** (DORA Assessment) — Extract: overlapping ICT resilience obligations if financial sector

### Step 0b: Read external documents and policies

- Read any **external documents** in `external/` — extract existing Cybersicherheitsbehörde / CSIRT / A-SIT correspondence (and any legacy BMI/GovCERT correspondence under the NISG 2018), sector-specific designation letters, incident response plans, BCM plans, Sicherheitshandbuch excerpts
- Read any **global policies** in `000-global/policies/` — extract security policy, incident response policy, supplier security policy, BCM policy
- If BMI designation documents found, use them to pre-populate the Essential/Important status.

### Step 1: Identify or Create Project

Identify the target project from the hook context. If the project doesn't exist:

1. Use Glob to list `projects/*/` directories and find the highest `NNN-*` number
2. Calculate the next number (zero-padded to 3 digits)
3. Slugify the project name
4. Use the Write tool to create `projects/{NNN}-{slug}/README.md`
5. Set `PROJECT_ID` and `PROJECT_PATH`

### Step 2: Read Source Artifacts

Read all documents from Step 0. Identify:

- Sector (NIS2 Annex I Essential / Annex II Important / out of scope)
- Organisation size (>250 employees / 50–250 / <50)
- Operation in Austria (seat, subsidiary, critical service delivery in AT)
- Sector context (energy, finance, health, transport, digital infrastructure, public administration). Under NISG 2026 the **Cybersicherheitsbehörde (Bundesamt für Cybersicherheit)** is the single competent authority for registration, supervision and enforcement; sectoral regulators (E-Control, FMA, etc.) retain their domain-specific roles but do not run NIS supervision separately `[NEEDS VERIFICATION: confirm any sector-specific competences retained under the enacted NISG 2026]`
- Financial sector involvement (DORA overlap)

### Step 3: Template Reading

**Read the template** (with user override support):

- **First**, check if `.arckit/templates/at-nisg-template.md` exists in the project root
- **If found**: Read the user's customized template
- **If not found**: Read `${CLAUDE_PLUGIN_ROOT}/templates/at-nisg-template.md`

### Step 4: Entity Classification (Austrian specifics)

Before generating the assessment, determine entity classification:

**Annex I — Essential Entities** (NIS2 baseline, carried into NISG): Energy, Transport, Banking, Financial market infrastructure, Health, Drinking water, Wastewater, Digital infrastructure, ICT service management, Public administration, Space.

**Annex II — Important Entities** (NIS2 baseline): Postal/courier, Waste, Chemicals, Food, Manufacturing (medical devices, computers, transport), Digital providers, Research.

**Austrian additions or scope differences**:

- Austria may designate additional entities beyond the size thresholds where criticality warrants it `[NEEDS VERIFICATION: confirm the exact designation power and § in the enacted NISG 2026]`
- Public-administration scope: federal bodies are in scope; the treatment of Land-level bodies (federal-only vs opt-in) must be confirmed against the enacted text `[NEEDS VERIFICATION: confirm Länder scope / any Landeshauptmann opt-in and its §]`
- Transition from NISG 2018: the NISG 2018 expires on 30 September 2026 and entities previously designated as *Betreiber wesentlicher Dienste* must be re-assessed against the new Essential/Important classification; NISG 2026 obligations apply from entry into force (1 October 2026) `[NEEDS VERIFICATION: confirm transitional provisions and their § in the enacted text]`

**Size thresholds** (NIS2 carried into NISG):

- Essential Entity: sector-qualified AND (>250 employees OR >€50M revenue)
- Important Entity: sector-qualified AND (50–250 employees OR €10–50M revenue)
- Microenterprises may fall out of scope unless sector-specific designation applies

Show entity classification before generating the full document.

### Step 5: Generate NISG Assessment

**CRITICAL**: Use the **Write tool** to create the assessment document.

1. **Detect version**: Check for existing `ARC-{PROJECT_ID}-ATNISG-v*.md` files:
   - No existing file → VERSION="1.0"
   - Existing file → minor increment if refreshed, major if scope changed

2. **Auto-populate Document Control**:
   - Document ID: `ARC-{PROJECT_ID}-ATNISG-v{VERSION}`
   - Status: DRAFT
   - Created Date: {current_date}
   - Next Review Date: {current_date + 12 months}
   - Entity Designation: from Step 4 classification
   - Note: "This document supplements ARC-{PROJECT_ID}-NIS2-v*.md with Austrian-specific NISG 2026 obligations"

3. **Section 1: Austrian Scope and Designation**
   - Sector classification (sectors in Anlagen 1/2). Competent authority under NISG 2026 is the **Cybersicherheitsbehörde (Bundesamt für Cybersicherheit, §3a)**; note any retained sectoral roles `[NEEDS VERIFICATION]`
   - Entity designation: Essential / Important / Out of scope (§24)
   - Previous NISG 2018 designation (Betreiber wesentlicher Dienste) and re-assessment against the new classification (NISG 2018 expires 30 Sep 2026)
   - Cross-border operations treatment (main establishment rules from NIS2)
   - Federal vs Land competence — confirm scope for Land-level bodies `[NEEDS VERIFICATION]`

4. **Section 2: Governance (NIS2 Art. 20 — as transposed)**
   - Geschäftsleitung (management body) approval of security measures
   - Management body responsibility to steer and oversee cybersecurity (§31). Note: the NISG 2026 does **not** explicitly regulate personal liability of the Leitungsorgane — it follows general principles, and administrative fines (§45) are addressed to the entity as a legal person, not to individuals
   - Management body cybersecurity training requirement
   - Compliance status for each obligation

5. **Section 3: Risk Management Measures (NIS2 Art. 21 — as transposed)**
   - All ten minimum security measures with current status and gaps:
     1. Risk analysis policy
     2. Incident handling
     3. Business continuity / BCM
     4. Supply chain security
     5. Secure acquisition, development, maintenance
     6. Policies to assess effectiveness
     7. Cyber hygiene and training
     8. Cryptography policy
     9. HR security and access control
     10. MFA and secure communications
   - A-SIT guidance alignment where applicable (A-SIT publishes sector-agnostic security guidance; not a regulatory body but commonly referenced by BMI and sectoral authorities)
   - Proportionality assessment: measures proportionate to entity size and risk
   - Extract existing controls from SECD artifact to pre-populate status

6. **Section 4: Incident Reporting (§34)**
   - Reporting channel: significant incidents are reported to the **responsible CSIRT (§8)** via the national **NIS2-Meldeplattform** — **CERT.at** as the national CSIRT and **GovCERT** as the public-administration sectoral CSIRT (run at the Cybersicherheitsbehörde); the CSIRT forwards the report to the **Cybersicherheitsbehörde (§3a)**
   - Four-stage NIS2 reporting timeline per §34 (24h early warning, 72h notification, intermediate on request, 1-month final report)
   - Austrian form and language requirements for reports (German, NIS2-Meldeplattform)
   - Cross-reporting to DSB if personal data breach (Art. 33 GDPR + NISG)
   - National coordination / exercise expectations via the CSS (§12), IKDOK (§13) and OpKoord (§14)

7. **Section 5: Supply Chain Security**
   - Supplier inventory and risk assessment requirements
   - Contractual security clause requirements
   - Software supply chain requirements
   - ENISA supply chain framework plus AT-specific sectoral guidance (e.g. E-Control Verordnungen for energy sector, FMA Rundschreiben for financial sector)
   - EU coordinated risk assessment outcomes (5G, high-risk vendors)

8. **Section 6: Business Continuity and Resilience**
   - BCP documentation status
   - Backup and restoration testing
   - Crisis management procedures
   - RTO / RPO definition aligned with sectoral criticality expectations

9. **Section 7: Supervision, Inspections, and Penalties**
   - Supervisory regime: supervision and enforcement measures by the **Cybersicherheitsbehörde** (§45); administrative penalties (Verwaltungsstrafen) are imposed by the **Bezirksverwaltungsbehörde** `[NEEDS VERIFICATION: confirm the fining authority in the enacted text]`
   - Ex ante (Essential) vs ex post (Important) supervision posture
   - Maximum penalties (§45, per NIS2 Art. 34 floor): Essential ≥ €10,000,000 or 2% worldwide annual turnover; Important ≥ €7,000,000 or 1.4% worldwide annual turnover (the old NISG 2018 §26 ceilings of €50K/€100K are superseded by the NISG 2026). Fines address the entity, not the management personally
   - Right to be heard / appeals (BVwG pathway)
   - Responsible entities for internal governance (CISO / Sicherheitsbeauftragter designation)

10. **Section 8: KSÖ and National Cyber Coordination** *(informational)*
    - KSÖ (Kuratorium Sicheres Österreich) as national PPP forum — voluntary but influential
    - National coordination: the **Cybersicherheitsbehörde (§3a)** is the competent authority; the **zentrale Anlaufstelle (§5)** is the EU single point of contact and the **Nationales Koordinierungszentrum (§6)** the national coordination centre. Operational incident response sits with the CSIRTs (§8). Cross-authority coordination runs through the CSS (§12), IKDOK (§13) and OpKoord (§14)
    - Participation options and information-sharing expectations

11. **Section 9: Gap Analysis and Roadmap**
    - Domain maturity matrix (L1–L5 scale)
    - Priority actions with effort estimates
    - Mermaid Gantt roadmap (0–3 months immediate, 3–6 months short-term, 6–12 months medium-term)
    - Related frameworks crosswalk (ISO 27001, NIST CSF, ISO 22301, BSI IT-Grundschutz — commonly used in AT)

Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** pass.

Write the document to:

```text
projects/{project_id}/ARC-{PROJECT_ID}-ATNISG-v{VERSION}.md
```

### Step 6: Summary Output

```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ AT NISG Assessment Generated
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 Document: projects/{project_id}/ARC-{PROJECT_ID}-ATNISG-v{VERSION}.md
📋 Document ID: {document_id}
📅 Assessment Date: {date}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Austrian Entity Classification
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Classification: {Essential Entity / Important Entity / Out of scope}
Sector: {Annex I or II sector}
Previous NISG 2018 Status: {BwD / None}
CSIRT Reporting Channel (NIS2-Meldeplattform): {Confirmed / Gap}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Gap Summary (Art. 21 Ten Measures)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{Compliance status for each of the 10 measures}

Total Gaps: {N} ({N} high, {N} medium, {N} low)
Incident Reporting: {Ready / Gap — 24h/72h capability}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Next steps:
1. {If no eu-nis2 baseline: run /arckit:eu-nis2 first}
2. {If personal data in security monitoring: run /arckit:at-dsgvo}
3. Run /arckit:secure to implement Art. 21 controls
4. Run /arckit:risk to register NISG gaps
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Important Notes

- **Run after eu-nis2**: This command adds the Austrian layer. For best results, run `/arckit:eu-nis2` first.
- **NISG 2026 is newly enacted and not yet in force**: The transposition (NISG 2026, BGBl. I Nr. 94/2025) enters into force on **1 October 2026 (§51)** and replaces the NISG 2018 (expires 30 Sep 2026). Implementing ordinances (Verordnungen) are still forthcoming. Key deadlines: registration by **31 December 2026 (§29)**, first Wirksamkeitsnachweis by **30 September 2027 (§33)**. An AT cyber practitioner must confirm before external reliance.
- **Management body duties (not personal liability)**: NIS2 Art. 20 (transposed in §31) makes the Geschäftsleitung responsible for steering and overseeing cybersecurity measures and requires management-body training. Note that the NISG 2026 does **not** explicitly regulate personal liability of management bodies — it follows general principles, and administrative fines under §45 are addressed to the entity as a legal person, not to individuals: Essential ≥ €10M / 2% turnover, Important ≥ €7M / 1.4% turnover (NIS2 Art. 34 floor).
- **24-hour reporting capability**: The 24-hour early warning window is tight. Flag if no 24/7 incident detection and reporting capability exists.
- **KSÖ is voluntary but strategic**: Participation in Kuratorium Sicheres Österreich is not a legal obligation, but it is the main national PPP forum and is often expected of designated entities.
- **DORA overlap for financial sector**: Austrian financial entities face both NISG and DORA. Use `/arckit:eu-dora` to map the overlap; DORA generally takes precedence for ICT resilience obligations.
- **Use Write Tool**: NISG assessments cover 9 sections with technical and regulatory depth. Always use the Write tool.

## Success Criteria

- ✅ Assessment document created at `projects/{project_id}/ARC-{PROJECT_ID}-ATNISG-v{VERSION}.md`
- ✅ Entity classification determined (Essential / Important / Out of scope, §24)
- ✅ Competent authority identified (Cybersicherheitsbehörde / Bundesamt für Cybersicherheit)
- ✅ Previous NISG 2018 designation status captured and re-assessed
- ✅ All ten NIS2 / NISG minimum measures assessed with status and gaps (§32)
- ✅ Incident reporting timeline mapped to the Austrian channel (CSIRT via NIS2-Meldeplattform, §34)
- ✅ Supply chain obligations assessed
- ✅ Business continuity requirements assessed
- ✅ Supervision regime and penalty ceilings documented (with verification flags)
- ✅ KSÖ / NCSC-AT coordination addressed
- ✅ Gap analysis with maturity levels and roadmap generated

## Example Usage

```text
/arckit:at-nisg Assess NISG obligations for a Styrian regional energy distributor (Stromnetzbetreiber) with BwD designation under NISG 2018, 400 employees, operating a SCADA migration project

/arckit:at-nisg NISG scoping for 001 — Austrian MSP serving healthcare and finance customers, 180 employees, HQ in Vienna with a secondary site in Linz

/arckit:at-nisg Austrian NIS2 transposition assessment for a federal ministry IT service provider, public administration sector, including CSIRT reporting readiness (NIS2-Meldeplattform)
```
