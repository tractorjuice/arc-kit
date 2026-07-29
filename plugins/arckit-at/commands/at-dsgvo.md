---
description: "[COMMUNITY] Assess Austrian DSG / DSGVO obligations — Datenschutzbehörde patterns, §§12–13 DSG special provisions, image processing (§12 DSG), and Austrian enforcement practice"
argument-hint: "<project ID or processing description, e.g. '001', 'ministry HR system with CCTV and health data'>"
effort: high
handoffs:
  - command: dpia
    description: Run a full Data Protection Impact Assessment if AT DSB screening flags high risk
    condition: "2+ AT DPIA criteria triggered or DSB published Blacklist applies"
  - command: eu-rgpd
    description: Run the pan-EU GDPR baseline first if not already completed
    condition: "No prior eu-rgpd assessment exists for this project"
  - command: at-nisg
    description: Assess NISG obligations where personal data is processed by Essential/Important entities
    condition: "Entity potentially qualifies as Essential or Important under NISG"
---


> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output should be reviewed by qualified DSB-Beauftragter / DPO / Rechtsabteilung before reliance. Citations to Datenschutzbehörde (DSB) / EU regulations may lag the current text — verify against the source. Some citations are marked `[NEEDS VERIFICATION]` and should be confirmed by an Austrian data protection practitioner before external use.

You are helping an enterprise architect generate an **Austrian Data Protection Assessment** — the Austrian-specific GDPR layer applied by the Datenschutzbehörde (DSB) under the Datenschutzgesetz (DSG 2018, BGBl. I Nr. 165/1999 as amended). Run this after `/arckit:eu-rgpd` to add Austrian obligations that go beyond the EU GDPR baseline.

## User Input

```text
$ARGUMENTS
```

## Instructions

> **Note**: The ArcKit Project Context hook has already detected all projects, artifacts, external documents, and global policies. Use that context below — no need to scan directories manually.

### Step 0: Read existing artifacts from the project context

**MANDATORY** (warn if missing):

- **DATA** (Data Model) — Extract: all entities with personal data, special category data (besondere Kategorien), data subjects, data flows, retention periods, third-party processors
  - If missing: warn that an AT DSG assessment requires a data model to identify personal data categories
- **RGPD** (EU RGPD Assessment) — Extract: legal basis mapping, DPIA screening results, DPO determination, international transfer analysis
  - If missing: warn that `/arckit:at-dsgvo` should be run after `/arckit:eu-rgpd` for best results. Proceed with available data.

**RECOMMENDED** (read if available, note if missing):

- **REQ** (Requirements) — Extract: data requirements (DR-xxx), compliance requirements, authentication requirements (Bürgerkarte / Handy-Signatur / ID Austria integration)
- **STKE** (Stakeholder Analysis) — Extract: data subject categories (especially minors, patients, employees covered by ArbVG co-determination)

**OPTIONAL** (read if available, skip silently):

- **SECD** (Secure by Design) — Extract: security measures relevant to Art. 32 GDPR assessment
- **RISK** (Risk Register) — Extract: existing privacy-related risks for cross-reference

### Step 0b: Read external documents and policies

- Read any **external documents** in `external/` — extract previous DSB correspondence, Verarbeitungsverzeichnis (Art. 30 ROPA), existing Auftragsverarbeitungsverträge (DPAs), Betriebsvereinbarungen for employee data
- Read any **global policies** in `000-global/policies/` — extract Datenschutzerklärung, data retention schedule, DSB-Meldungen policy
- If a prior DSB assessment or Datenschutzerklärung is found, use it to pre-populate compliance status and identify gaps.

### Step 1: Identify or Create Project

Identify the target project from the hook context. If the project doesn't exist:

1. Use Glob to list `projects/*/` directories and find the highest `NNN-*` number
2. Calculate the next number (zero-padded to 3 digits)
3. Slugify the project name
4. Use the Write tool to create `projects/{NNN}-{slug}/README.md`
5. Set `PROJECT_ID` and `PROJECT_PATH`

### Step 2: Read Source Artifacts

Read all documents from Step 0. Identify:

- Presence of health data (Gesundheitsdaten) → triggers §§12–13 DSG + ELGA interop section
- Image/video processing (Bildverarbeitung, CCTV) → triggers §§12–13 DSG special regime
- Employee data processing → triggers ArbVG Betriebsvereinbarung: §96 Abs 1 Z 3 (control measures affecting human dignity) and/or §96a (Personaldatensysteme)
- Scientific research → triggers §§7–8 DSG (Forschungszwecke); DSB approval (Genehmigung) under §7 DSG, and the Art. 89(1) data-subject-rights exemption under §2d FOG (Forschungsorganisationsgesetz) — there is no "§2d DSG"
- Minors as data subjects → triggers §4(4) DSG (AT age of digital consent: **14 years**)
- Third-party processors in non-EEA → triggers TIA with DSB transfer focus

### Step 3: Template Reading

**Read the template** (with user override support):

- **First**, check if `.arckit/templates/at-dsgvo-template.md` exists in the project root
- **If found**: Read the user's customized template
- **If not found**: Read `${CLAUDE_PLUGIN_ROOT}/templates/at-dsgvo-template.md`

### Step 4: Generate AT Data Protection Assessment

**CRITICAL**: Use the **Write tool** to create the assessment document.

1. **Detect version**: Check for existing `ARC-{PROJECT_ID}-ATDSG-v*.md` files:
   - No existing file → VERSION="1.0"
   - Existing file → minor increment if refreshed, major if scope changed significantly

2. **Auto-populate Document Control**:
   - Document ID: `ARC-{PROJECT_ID}-ATDSG-v{VERSION}`
   - Status: DRAFT
   - Created Date: {current_date}
   - Next Review Date: {current_date + 12 months}
   - Classification: OFFICIAL-SENSITIVE (privacy assessments contain sensitive risk information)
   - Add note: "This document supplements ARC-{PROJECT_ID}-RGPD-v*.md with Austrian/DSB-specific requirements"

3. **Section 1: AT DSG Regulatory Framework**
   - Applicable texts table: DSGVO (EU 2016/679), DSG (BGBl. I 165/1999 idgF), sector laws (ELGA-G for health, StPO §§134–143b for law enforcement, GTelG 2012, ArbVG §96 Abs 1 Z 3 / §96a)
   - DSB as supervisory authority — contact: dsb.gv.at
   - Austrian age of digital consent: **14 years** (§4(4) DSG, lower than GDPR default 16) — flag if minors in scope
   - Parallel BVwG (Bundesverwaltungsgericht) review pathway for DSB decisions `[NEEDS VERIFICATION: confirm current venue rules]`

4. **Section 2: §§12–13 DSG — Image and Video Processing** (conditional — only if CCTV/imagery detected)
   - ⚠️ **Disputed applicability**: the BVwG held §§12–13 DSG **inapplicable** because of the primacy of the GDPR / absence of an opening clause (BVwG W256 2214855-1, 20.11.2019; W211 2210458-1, 25.11.2019), while the OGH has continued to apply them (6 Ob 150/19f). Treat §§12–13 as **contested** and assess CCTV primarily on the GDPR (Art. 6 lawfulness, Art. 12–14 transparency); apply §§12–13 conservatively as a belt-and-braces layer, not as the settled legal basis. Confirm the current position with a practitioner.
   - §12 DSG specific lawfulness grounds for image processing (if relied on, note as contested — see above)
   - Labelling obligation (Kennzeichnungspflicht) — visible notice with responsible controller. This survives regardless of the §§12–13 dispute, as it also flows from the GDPR transparency duties (Art. 12–14)
   - Retention limit: 72 hours default under §13 DSG unless justified documented exception (contested basis; keep retention short and documented on GDPR necessity/proportionality grounds in any case)
   - Prohibition of covert imaging except narrow statutory cases
   - DSB / EDPB guidance on video processing (EDPB Guidelines 3/2019) applicability `[NEEDS VERIFICATION: confirm current guidance version]`
   - If no image processing: include section header with "N/A — no image or video processing identified"

5. **Section 3: Health Data and ELGA** (conditional — only if health data detected)
   - Elektronische Gesundheitsakte (ELGA-G) interoperability requirements
   - GTelG 2012 telematics interop for data exchange between health providers
   - Art. 9(2) GDPR legal basis selection — in AT typically §§7–8 DSG + ELGA-G
   - DPIA mandatory flag: special category data + large scale → run `/arckit:dpia`
   - Opt-out vs opt-in for ELGA participation — controller's integration obligations
   - If no health data: include section header with "N/A — no health data identified"

6. **Section 4: Employee Data (Arbeitnehmerdatenschutz)** (conditional — only if employee data in scope)
   - ArbVG Betriebsvereinbarung: employee **monitoring** measures that touch human dignity require a BV under **§96 Abs 1 Z 3** (consent-based); **Personaldatensysteme** (personnel data systems beyond general identification/qualification data) require a BV under **§96a**
   - Works council (Betriebsrat) co-determination rights
   - Data Protection Impact Assessment interface with co-determination
   - Distinction: systems touching "personal dignity" need Betriebsvereinbarung regardless of privacy level
   - If out of scope: include section header with "N/A — no employee data or no employee monitoring potential"

7. **Section 5: Scientific Research (§§7–8 DSG)** (conditional — only if research use case)
   - Research exemptions under §§7–8 DSG and Art. 89 GDPR
   - DSB approval (Genehmigung) for research/statistics processing under §7 (esp. §7 Abs 3) DSG; the exemption from Art. 89(1) GDPR data-subject rights for research sits in §2d FOG (Forschungsorganisationsgesetz), not in the DSG
   - Pseudonymisation obligations
   - Retention under research framework
   - If not applicable: include section header with "N/A — no scientific research processing identified"

8. **Section 6: Data Subject Rights (Austrian enforcement)**
   - Standard rights table (Art. 15–22 GDPR) with DSB response deadlines
   - AT practice: DSB emphasises written response quality and timeliness
   - Remedy path: complaint to DSB → appeal BVwG → VwGH/VfGH
   - Right to copy of data — DSB interpretation tends to favour broad scope `[NEEDS VERIFICATION]`

9. **Section 7: DSB Reporting and Registration**
   - Art. 30 GDPR ROPA (Verarbeitungsverzeichnis) — DSB has a documented expectation of depth
   - DPO (Datenschutzbeauftragter) mandatory triggers:
     - Public authority / public body → always mandatory
     - Large-scale systematic monitoring
     - Large-scale special category data processing
   - DPO contact reporting to DSB via dsb.gv.at portal
   - No general AT-specific registration obligation beyond EU GDPR (DSG abolished the former Datenverarbeitungsregister in 2018)

10. **Section 8: Breach Notification to DSB**
    - 72-hour notification via dsb.gv.at online form
    - Individual notification for high-risk breaches
    - Breach register maintenance requirement
    - AT enforcement practice on breach late-notification penalties `[NEEDS VERIFICATION: recent DSB penalty cases]`

11. **Section 9: International Transfers (AT context)**
    - Post-Schrems II Transfer Impact Assessment requirement — align with EDPB Recommendations 01/2020
    - EU-US Data Privacy Framework status and AT implications
    - DSB position on SCC supplementary measures `[NEEDS VERIFICATION]`

12. **Section 10: DSB Enforcement Priorities and Gap Analysis**
    - Map against DSB recent enforcement focus (cookie consent, tracking, CCTV retention, employee monitoring, HR data) `[NEEDS VERIFICATION: cite recent DSB annual report]`
    - Notable AT reference decisions for calibration `[NEEDS VERIFICATION]`
    - Consolidate gaps from all sections
    - Priority based on DSB enforcement priority and legal obligation level

Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** pass.

Write the document to:

```text
projects/{project_id}/ARC-{PROJECT_ID}-ATDSG-v{VERSION}.md
```

### Step 5: Summary Output

```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ AT DSG / DSGVO Assessment Generated
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 Document: projects/{project_id}/ARC-{PROJECT_ID}-ATDSG-v{VERSION}.md
📋 Document ID: {document_id}
📅 Assessment Date: {date}
🔒 Classification: OFFICIAL-SENSITIVE

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Austrian-Specific Compliance Areas
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Area                            | Status       | Gaps |
|---------------------------------|--------------|------|
| §§12–13 Image/Video Processing  | {N/A or status} | {N} |
| Health Data / ELGA              | {N/A or status} | {N} |
| Employee Data / §96 Abs 1 Z 3 / §96a ArbVG | {N/A or status} | {N} |
| Research Exemptions §§7–8 DSG   | {N/A or status} | {N} |
| Age of Consent (14 years)       | {N/A or status} | {N} |
| DPO Registration with DSB       | {status}     | {N}  |
| DSB Enforcement Risks           | {level}      | {N}  |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ Critical Actions
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{List 🔴 High priority gaps}

Next steps:
1. {If DPIA required: Run /arckit:dpia}
2. {If employee monitoring: draft Betriebsvereinbarung §96a ArbVG}
3. {If no eu-rgpd baseline: Run /arckit:eu-rgpd first}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Important Notes

- **Run after eu-rgpd**: This command adds the Austrian layer on top of the EU GDPR baseline. For best results, run `/arckit:eu-rgpd` first, then this command.
- **Austrian age of digital consent is 14, not 16**: Austria chose the lower limit allowed by GDPR (§4(4) DSG). Do not apply the GDPR default of 16.
- **§§12–13 DSG on image processing is contested**: AT retained a standalone image-processing regime, but the BVwG held §§12–13 DSG inapplicable for want of a GDPR opening clause (W256 2214855-1; W211 2210458-1, 2019), while the OGH still applies them (6 Ob 150/19f). Assess CCTV/imagery primarily on the GDPR and treat §§12–13 as a contested additional layer — do not present them as the settled legal basis.
- **ArbVG Betriebsvereinbarung is separate from GDPR**: Employee monitoring capability requires a works-council agreement even where GDPR lawfulness is established — §96 Abs 1 Z 3 for control measures affecting human dignity, §96a for Personaldatensysteme. Flag if employee monitoring or a personnel data system is possible.
- **Public authorities are largely exempt from GDPR fines (§30 Abs 5 DSG)**: Austria used the Art. 83(7) opening clause so the DSB cannot impose Geldbußen on Behörden, öffentliche Stellen and Körperschaften öffentlichen Rechts (corrective measures still apply). For public-sector controllers, present the Art. 83 fine ceilings as generally inapplicable — but flag that ausgegliederte / competitively-active entities may fall outside the exemption.
- **Verify citations**: Austrian data protection practice evolves through DSB decisions and BVwG case law. Items marked `[NEEDS VERIFICATION]` must be confirmed against current DSB guidance before external use.
- **Use Write Tool**: AT DSG assessments cover multiple Austrian-specific regulations and are typically 2,000–4,000 words. Always use the Write tool.

## Success Criteria

- ✅ Assessment document created at `projects/{project_id}/ARC-{PROJECT_ID}-ATDSG-v{VERSION}.md`
- ✅ Applicable DSG sections identified (§§7–8, §§12–13, §4(4); §7 DSG Genehmigung / §2d FOG research provisions as applicable)
- ✅ §§12–13 DSG image-processing regime assessed if CCTV/imagery in scope, with its contested applicability (BVwG vs OGH) flagged and GDPR treated as the primary basis
- ✅ ELGA-G / GTelG 2012 interop assessed if health data in scope
- ✅ ArbVG Betriebsvereinbarung (§96 Abs 1 Z 3 / §96a) flagged if employee monitoring or a personnel data system in scope
- ✅ §§7–8 DSG research exemptions addressed if research use case in scope
- ✅ Age of digital consent at 14 years applied (not GDPR default 16)
- ✅ DPO registration with DSB assessed
- ✅ 72-hour breach notification to DSB process assessed
- ✅ Post-Schrems II TIA requirement applied
- ✅ DSB enforcement priority self-assessment completed
- ✅ Gap analysis with prioritised action plan generated
- ✅ Document classified OFFICIAL-SENSITIVE

## Example Usage

```text
/arckit:at-dsgvo Austrian DSG layer for 001 — federal ministry HR system with CCTV at entrances, employee data, and potential monitoring of IT usage

/arckit:at-dsgvo Assess AT DSG obligations for a Vienna regional hospital group integrating with ELGA, processing Gesundheitsdaten, planning mobile patient portal

/arckit:at-dsgvo AT data protection for a research consortium processing pseudonymised health data for a longitudinal cohort study under §§7–8 DSG
```
