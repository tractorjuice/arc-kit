---
description: "[COMMUNITY] Assess Austrian NISG 2024 obligations — AT transposition of NIS2, BMI/GovCERT reporting, KSÖ coordination, and Austrian sectoral rules for Essential/Important entities"
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


> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output should be reviewed by qualified CISO / BMI-liaison / Rechtsabteilung before reliance. Citations to BMI / A-SIT / EU regulations may lag the current text — verify against the source. Items marked `[NEEDS VERIFICATION]` must be confirmed against the **current NISG 2024 text and implementing ordinances** before external use — the legislation is recent and evolving.

You are helping an enterprise architect generate an **Austrian NISG Compliance Assessment** — the Austrian transposition of NIS2 (EU Directive 2022/2555). The Austrian Netz- und Informationssystemsicherheitsgesetz (NISG 2024, replacing NISG 2018) extends NIS2 obligations with Austria-specific designation, reporting, and supervision rules. Run this after `/arckit.eu-nis2` to add Austrian obligations that go beyond the EU baseline.

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
  - If missing: warn that `/arckit.at-nisg` should be run after `/arckit.eu-nis2` for best results
- **RISK** (Risk Register) — Extract: existing security risks, supply chain risks, third-party risks, business continuity risks
- **SECD** (Secure by Design) — Extract: existing security controls, maturity assessments, security architecture decisions
- **PRIN** (Architecture Principles, 000-global) — Extract: security baseline, incident response principles, supply chain policy

**OPTIONAL** (read if available, skip silently):

- **ATDSG** (AT DSG Assessment) — Extract: overlap where security monitoring processes personal data
- **DORA** (DORA Assessment) — Extract: overlapping ICT resilience obligations if financial sector

### Step 0b: Read external documents and policies

- Read any **external documents** in `external/` — extract existing BMI / GovCERT / A-SIT correspondence, sector-specific designation letters, incident response plans, BCM plans, Sicherheitshandbuch excerpts
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
- Sector-specific Austrian designation status (e.g. E-Control for electricity, FMA for finance, ELGA/BMSGPK for health) `[NEEDS VERIFICATION: confirm current competent authorities under NISG 2024]`
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

- Austria may designate additional entities under NISG 2024 based on criticality assessment `[NEEDS VERIFICATION: confirm NISG 2024 additions vs EU baseline]`
- Public-administration scope includes federal and Land-level bodies — verify which Landesgesetze interact with NISG obligations `[NEEDS VERIFICATION]`
- Special regimes continue for previously designated Betreiber wesentlicher Dienste under NISG 2018 — transition rules apply `[NEEDS VERIFICATION: confirm NISG 2024 transition clauses]`

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
   - Note: "This document supplements ARC-{PROJECT_ID}-NIS2-v*.md with Austrian-specific NISG 2024 obligations"

3. **Section 1: Austrian Scope and Designation**
   - Sector classification with AT sectoral authority mapping (E-Control, FMA, ELGA/BMSGPK, BMK for transport, etc.) `[NEEDS VERIFICATION]`
   - Entity designation: Essential / Important / Out of scope under NISG
   - Previous NISG 2018 designation (Betreiber wesentlicher Dienste) and transition status
   - Cross-border operations treatment (main establishment rules from NIS2)
   - Federal vs Land competence — confirm venue for supervision `[NEEDS VERIFICATION]`

4. **Section 2: Governance (NIS2 Art. 20 — as transposed)**
   - Geschäftsleitung (management body) approval of security measures
   - Management body personal liability for non-compliance — AT practice `[NEEDS VERIFICATION: confirm penalty regime in NISG 2024]`
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
   - A-SIT guidance alignment where applicable `[NEEDS VERIFICATION: confirm current A-SIT publications]`
   - Proportionality assessment: measures proportionate to entity size and risk
   - Extract existing controls from SECD artifact to pre-populate status

6. **Section 4: Incident Reporting — Austrian Channel**
   - Report to **GovCERT.gv.at** (federal CERT) and/or sectoral CERT as applicable `[NEEDS VERIFICATION: confirm GovCERT/BKÄ/BMI channel under NISG 2024]`
   - Four-stage NIS2 reporting timeline (24h early warning, 72h notification, intermediate on request, 1-month final report)
   - Austrian form and language requirements for reports
   - Cross-reporting to DSB if personal data breach (Art. 33 GDPR + NISG)
   - Tabletop / exercise expectations from BMI `[NEEDS VERIFICATION]`

7. **Section 5: Supply Chain Security**
   - Supplier inventory and risk assessment requirements
   - Contractual security clause requirements
   - Software supply chain requirements
   - ENISA supply chain framework plus any AT-specific sectoral guidance (e.g. E-Control secondary rules for energy) `[NEEDS VERIFICATION]`
   - EU coordinated risk assessment outcomes (5G, high-risk vendors)

8. **Section 6: Business Continuity and Resilience**
   - BCP documentation status
   - Backup and restoration testing
   - Crisis management procedures
   - RTO / RPO definition aligned with sectoral criticality expectations

9. **Section 7: Supervision, Inspections, and Penalties**
   - Supervisory regime: BMI / competent sectoral authority inspections
   - Ex ante (Essential) vs ex post (Important) supervision posture
   - Maximum penalties — EU baseline plus any AT-specific uplift `[NEEDS VERIFICATION: confirm NISG 2024 penalty ceilings]`
   - Right to be heard / appeals (BVwG pathway)
   - Responsible entities for internal governance (CISO / Sicherheitsbeauftragter designation)

10. **Section 8: KSÖ and National Cyber Coordination** *(informational)*
    - KSÖ (Kuratorium Sicheres Österreich) as national PPP forum — voluntary but influential
    - National Cyber Security Centre (NCSC-AT) / GovCERT roles `[NEEDS VERIFICATION]`
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
Sector: {Annex I or II sector + AT authority}
Previous NISG 2018 Status: {BwD / None}
GovCERT Channel: {Confirmed / Gap}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Gap Summary (Art. 21 Ten Measures)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{Compliance status for each of the 10 measures}

Total Gaps: {N} ({N} high, {N} medium, {N} low)
Incident Reporting: {Ready / Gap — 24h/72h capability}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Next steps:
1. {If no eu-nis2 baseline: run /arckit.eu-nis2 first}
2. {If personal data in security monitoring: run /arckit.at-dsgvo}
3. Run /arckit.secure to implement Art. 21 controls
4. Run /arckit.risk to register NISG gaps
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Important Notes

- **Run after eu-nis2**: This command adds the Austrian layer. For best results, run `/arckit.eu-nis2` first.
- **NISG 2024 is recent and evolving**: Citations are marked `[NEEDS VERIFICATION]` where they depend on provisions likely to shift via implementing ordinances. An AT cyber practitioner must confirm before external reliance.
- **Management body liability**: NIS2 makes management body members personally liable — the AT penalty regime and defensibility posture need confirmation `[NEEDS VERIFICATION]`.
- **24-hour reporting capability**: The 24-hour early warning window is tight. Flag if no 24/7 incident detection and reporting capability exists.
- **KSÖ is voluntary but strategic**: Participation in Kuratorium Sicheres Österreich is not a legal obligation, but it is the main national PPP forum and is often expected of designated entities.
- **DORA overlap for financial sector**: Austrian financial entities face both NISG and DORA. Use `/arckit.eu-dora` to map the overlap; DORA generally takes precedence for ICT resilience obligations.
- **Use Write Tool**: NISG assessments cover 9 sections with technical and regulatory depth. Always use the Write tool.

## Success Criteria

- ✅ Assessment document created at `projects/{project_id}/ARC-{PROJECT_ID}-ATNISG-v{VERSION}.md`
- ✅ Entity classification determined (Essential / Important / Out of scope)
- ✅ Sectoral Austrian authority identified (E-Control / FMA / BMK / ELGA / BMI / etc.)
- ✅ Previous NISG 2018 designation status captured
- ✅ All ten NIS2 / NISG minimum measures assessed with status and gaps
- ✅ Incident reporting timeline mapped to Austrian channel (GovCERT + sectoral)
- ✅ Supply chain obligations assessed
- ✅ Business continuity requirements assessed
- ✅ Supervision regime and penalty ceilings documented (with verification flags)
- ✅ KSÖ / NCSC-AT coordination addressed
- ✅ Gap analysis with maturity levels and roadmap generated

## Example Usage

```text
/arckit.at-nisg Assess NISG obligations for a Styrian regional energy distributor (Stromnetzbetreiber) with BwD designation under NISG 2018, 400 employees, operating a SCADA migration project

/arckit.at-nisg NISG scoping for 001 — Austrian MSP serving healthcare and finance customers, 180 employees, HQ in Vienna with a secondary site in Linz

/arckit.at-nisg Austrian NIS2 transposition assessment for a federal ministry IT service provider, public administration sector, including GovCERT reporting readiness
```
