---
description: "[COMMUNITY] Generate Austrian public procurement documentation aligned with Bundesvergabegesetz 2018 — Oberschwellen/Unterschwellen determination, ANKÖ publication, BVergGVS secondary rules, and BVwG review pathway"
argument-hint: "<project ID or procurement description, e.g. '001', 'federal IT platform €1.5M Oberschwellen'>"
effort: high
handoffs:
  - command: evaluate
    description: Score vendor responses against the award criteria defined in this document
    condition: "Tenders received and ready for evaluation"
  - command: traceability
    description: Link procurement requirements back to functional and non-functional requirements
  - command: at-dsgvo
    description: Include GDPR/DPA obligations in procurement documentation where personal data processed
    condition: "Procurement involves processors of personal data"
  - command: at-nisg
    description: Reflect NISG supply chain obligations in vendor security clauses
    condition: "Contracting entity is Essential or Important under NISG"
---


> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output should be reviewed by qualified Vergabejurist / Rechtsabteilung before reliance. Citations to Bundesvergabegesetz 2018 (BVergG 2018) / EU directive transpositions may lag the current text — verify against the source. Items marked `[NEEDS VERIFICATION]` must be confirmed against the **current BVergG 2018 text and the latest EU threshold regulation** before external use — thresholds are updated every two years.

You are helping an enterprise architect generate **Austrian public procurement documentation** aligned with the Bundesvergabegesetz 2018 (BVergG 2018, BGBl. I Nr. 65/2018 as amended) and relevant secondary rules (BVergGVS, sectoral instruments).

## User Input

```text
$ARGUMENTS
```

## Instructions

> **Note**: The ArcKit Project Context hook has already detected all projects, artifacts, external documents, and global policies. Use that context below — no need to scan directories manually.

### Step 0: Read existing artifacts from the project context

**MANDATORY** (warn if missing):

- **REQ** (Requirements) — Extract: functional requirements (FR-xxx) for procurement scope, non-functional requirements (NFR-xxx), integration requirements (INT-xxx), data sovereignty and security requirements
  - If missing: warn that procurement documentation requires defined requirements to produce a valid Leistungsbeschreibung

**RECOMMENDED** (read if available, note if missing):

- **RISK** (Risk Register) — Extract: vendor risks, technology risks, lock-in risks, sovereignty risks, supply chain risks
- **ATNISG** (AT NISG Assessment) — Extract: supply chain obligations for Essential/Important entities to include as contract clauses
- **ATDSG** (AT DSG Assessment) — Extract: data protection clauses for Auftragsverarbeitung (processor) engagements
- **SECD** (Secure by Design) — Extract: security controls that must be contractually required of the supplier

**OPTIONAL** (read if available, skip silently):

- **PRIN** (Architecture Principles, 000-global) — Extract: open source policy, cloud strategy, technology standards
- **DATA** (Data Model) — Extract: data categories (health data → ELGA/HDS clause, personal data → DPA clause)

### Step 0b: Read external documents and policies

- Read any **external documents** in `external/` — extract previous procurement files (Ausschreibungsunterlagen), ANKÖ publication records, BBG framework references, budget documents, existing supplier contracts
- Read any **global policies** in `000-global/policies/` — extract procurement policy, open source policy, data classification policy
- If procurement-related external documents found, use them to pre-populate threshold analysis and budget constraints.

### Step 1: Identify or Create Project

Identify the target project from the hook context. If the project doesn't exist:

1. Use Glob to list `projects/*/` directories and find the highest `NNN-*` number
2. Calculate the next number (zero-padded to 3 digits)
3. Slugify the project name
4. Use the Write tool to create `projects/{NNN}-{slug}/README.md` and `projects/{NNN}-{slug}/vendors/README.md`
5. Set `PROJECT_ID` and `PROJECT_PATH`

### Step 2: Read Source Artifacts

Read all documents from Step 0. Extract key information for the procurement file:

- Total estimated value (Auftragswert, excl. VAT) — from requirements or user input
- Contracting authority type (klassischer Sektor vs Sektorenauftraggeber) — affects thresholds and rules
- Data categories (drives sovereignty, HDS/ELGA, and DPA clauses)
- Security classification level (drives NISG supply-chain clauses)
- Cloud involvement (drives BRZ / sovereign cloud and data-location requirements)

### Step 3: Template Reading

**Read the template** (with user override support):

- **First**, check if `.arckit/templates/at-bvergg-template.md` exists in the project root
- **If found**: Read the user's customized template
- **If not found**: Read `${CLAUDE_PLUGIN_ROOT}/templates/at-bvergg-template.md`

### Step 4: Threshold Analysis

Before generating the document, determine the applicable procedure. **EU thresholds are updated every 2 years** — verify against the latest Delegierte Verordnung (currently VO 2023/2495 for 2024-2025; check for 2026-2027 update) and the §12 BVergG 2018 transposition.

| Threshold Tier | Indicative Auftragswert (excl. VAT) | Procedure | Publication |
|----------------|--------------------------------------|-----------|-------------|
| **Direktvergabe** | < €100,000 | Direct award (no formal procedure) | Informal |
| **Direktvergabe mit Bekanntmachung** | €100,000 — €130,000 | Direct award with notice | ANKÖ |
| **Unterschwellenbereich** (non-open) | Up to EU threshold | Verhandlungsverfahren / nicht-offen | ANKÖ |
| **Oberschwellenbereich — classical** (supplies/services, sub-central) | ≥ €221,000 | Offenes / Nicht-offenes Verfahren / Verhandlungsverfahren | ANKÖ + TED |
| **Oberschwellenbereich — Sektorenauftraggeber** (supplies/services) | ≥ €443,000 | Sektor rules | ANKÖ + TED |
| **Bauaufträge (Works)** — Oberschwellenbereich | ≥ €5,538,000 | Same as supplies/services | ANKÖ + TED |

Show threshold determination to the user before generating the full document. Confirm:

- Contracting authority classification (klassisch / Sektor / subsidised under §4 BVergG)
- Whether value aggregation across lots / framework agreement applies (§13 BVergG)
- Whether §9 BVergG exceptions apply (e.g. in-house exemption, inter-authority cooperation)

### Step 5: Generate Procurement Documentation

**CRITICAL**: Use the **Write tool** to create the procurement document.

1. **Detect version**: Check for existing `ARC-{PROJECT_ID}-BVERGG-v*.md` files:
   - No existing file → VERSION="1.0"
   - Existing file → minor increment for updates, major for procedure change

2. **Auto-populate Document Control**:
   - Document ID: `ARC-{PROJECT_ID}-BVERGG-v{VERSION}`
   - Status: DRAFT
   - Created Date: {current_date}
   - Next Review Date: {current_date + 6 months}
   - Classification: OFFICIAL (procurement docs become public at publication)
   - Auftragswert, procedure and threshold tier captured in header

3. **Section 1: Contracting Authority and Procedure**
   - Legal identity of the Auftraggeber and classification (klassisch / Sektor / subsidised)
   - Applicable BVergG 2018 provisions
   - Selected procedure (Offen / Nicht-offen / Verhandlungsverfahren mit/ohne Bekanntmachung / Wettbewerblicher Dialog / Innovationspartnerschaft)
   - Justification for procedure choice (especially for non-open procedures)
   - Framework agreement (Rahmenvereinbarung) considerations if applicable

4. **Section 2: Leistungsbeschreibung (Requirements Statement)**
   - Functional scope derived from REQ (FR-xxx)
   - Non-functional requirements (performance, availability, security)
   - Integration scope (INT-xxx)
   - Data sovereignty and location requirements
   - Open standards and interoperability requirements
   - Barrier-free / Accessibility (§107 BVergG / EN 301 549 / WCAG 2.2) requirements

5. **Section 3: Eignung (Suitability Criteria)**
   - Berufliche Zuverlässigkeit (trade registration, no Ausschlussgründe under §78 BVergG)
   - Wirtschaftliche und finanzielle Leistungsfähigkeit (financial criteria)
   - Technische Leistungsfähigkeit (references, certifications)
   - ISO 27001 / ISO 22301 / ISO 9001 where justified and proportionate
   - Maximum document burden — proportionality under §20 BVergG

6. **Section 4: Zuschlagskriterien (Award Criteria)**
   - Best-price or best-price-performance ratio (Bestbieterprinzip) — BVergG default is Bestbieter for most supplies/services
   - Criteria table with weightings (price %, quality %, sustainability %, innovation %)
   - Sub-criteria and scoring methodology
   - Disclose scoring formulas in the notice

7. **Section 5: Vertragliche Regelungen (Contractual Terms)**
   - Service Level Agreement (SLA) requirements
   - Data processing addendum (Auftragsverarbeitung, Art. 28 GDPR + DSG)
   - NISG supply chain clauses (if contracting authority is Essential/Important)
   - Intellectual property / open-source handling
   - Exit management / transition obligations
   - Sovereign/Austrian hosting or EU-only data-residency clauses where required
   - Penalty (Vertragsstrafe) and termination rights
   - Applicable law: Austrian law; jurisdiction

8. **Section 6: Publication and Timeline**
   - ANKÖ publication (mandatory for most above-threshold)
   - TED publication for Oberschwellenbereich
   - Minimum Angebotsfrist per §§71–76 BVergG (above-threshold open procedure: min. 30 days, classical sector)
   - Bidder question window (Bewerberfragen) and answers (Q&A published to all)
   - Opening session (Angebotsöffnung) formalities
   - Standstill period (Stillhaltefrist) and notifications
   - Contract award (Zuschlag) announcement

9. **Section 7: Review and Remedies (BVergG Book 4)**
   - Review before the Bundesverwaltungsgericht (BVwG) for Bundesvergaben
   - Landesverwaltungsgerichte for Land procurements
   - Application fees and interim measures
   - Standstill period compliance
   - Record-keeping for defensibility

10. **Section 8: Documentation and File**
    - Vergabeakt (procurement file) structure expected by audit bodies (Rechnungshof, EU auditors)
    - Retention obligations
    - Audit trail of decisions and justifications
    - Annex: self-declaration forms (Eigenerklärung / ESPD)

Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** pass.

Write the document to:

```text
projects/{project_id}/ARC-{PROJECT_ID}-BVERGG-v{VERSION}.md
```

### Step 6: Summary Output

```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ AT BVergG Procurement Documentation Generated
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 Document: projects/{project_id}/ARC-{PROJECT_ID}-BVERGG-v{VERSION}.md
📋 Document ID: {document_id}
📅 Planned Publication Date: {date}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Procedure Decision
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Auftragswert: €{value} (excl. VAT)
Tier: {Direktvergabe / Unterschwellen / Oberschwellen — classical / Sektor}
Procedure: {Offen / Nicht-offen / Verhandlung / etc.}
Publication: {ANKÖ only / ANKÖ + TED}
Minimum Angebotsfrist: {days}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ Critical Actions
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{List ⚠️ Items requiring Vergabejurist review before publication}

Next steps:
1. {If personal data: Include DPA from /arckit.at-dsgvo}
2. {If Essential/Important: Include NISG supply clauses from /arckit.at-nisg}
3. Legal review before ANKÖ publication
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Important Notes

- **Thresholds change every 2 years**: EU Oberschwellenwerte are revised biennially. Always verify the current values against the latest Commission Delegated Regulation and BVergG text — do not rely on the indicative numbers without verification.
- **Bundesvergaben vs Landesvergaben**: BVergG 2018 covers federal procurement; Land procurement procedures may be subject to additional Landesgesetze. Confirm venue for review.
- **ANKÖ publication is mandatory**: Most above-threshold procedures require ANKÖ (Auftragnehmerkataster Österreich) publication. TED publication is additionally required for EU Oberschwellen.
- **Bestbieter is the default**: For most supplies and services, BVergG 2018 requires the best-price-performance-ratio criterion, not lowest-price. Justify clearly if using lowest-price only.
- **NISG and DSG interplay**: Where the contracting authority is an Essential / Important entity under NISG, or where personal data is processed, the contract must carry the corresponding supply-chain security and Auftragsverarbeitung clauses.
- **Standstill period is a hard requirement**: Non-observance of the Stillhaltefrist is a frequent basis for successful BVwG applications. Document timing precisely.
- **Use Write Tool**: BVergG procurement docs cover 8 sections with legal and technical content. Always use the Write tool.

## Success Criteria

- ✅ Procurement document created at `projects/{project_id}/ARC-{PROJECT_ID}-BVERGG-v{VERSION}.md`
- ✅ Contracting authority classification confirmed (klassisch / Sektor / subsidised)
- ✅ Threshold tier determined with current values verified
- ✅ Procedure selected with BVergG 2018 justification
- ✅ Leistungsbeschreibung traced to REQ (FR/NFR/INT)
- ✅ Eignungskriterien proportionate under §20 BVergG
- ✅ Zuschlagskriterien weighted and transparent (Bestbieterprinzip justified)
- ✅ DPA clauses included where personal data processed (Art. 28 GDPR + DSG)
- ✅ NISG supply-chain clauses included where applicable
- ✅ ANKÖ (and TED if Oberschwellen) publication plan
- ✅ Angebotsfrist and Stillhaltefrist compliant with BVergG
- ✅ Review pathway (BVwG / LVwG) documented
- ✅ Vergabeakt structure defined for defensibility

## Example Usage

```text
/arckit.at-bvergg Austrian procurement for 001 — federal digital identity platform, Auftragswert €1.8M, classical sector, Oberschwellenbereich, processes personal data, Essential entity under NISG

/arckit.at-bvergg BVergG 2018 procurement pack for a municipal water utility SCADA upgrade — Sektorenauftraggeber, Oberschwellenbereich, €3.2M, Essential entity

/arckit.at-bvergg Direct award for a €60K proof-of-concept integration, classical sector, no personal data
```
