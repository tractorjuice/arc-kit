---
description: "[COMMUNITY] Assess Austrian DSG / DSGVO obligations — Datenschutzbehörde patterns, image processing under the GDPR (with the VwGH ruling displacing §12 DSG), age-14 consent, research and employee data, and Austrian enforcement practice"
doc-type: ATDSG
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
allowed-tools:
  - Read(/${CLAUDE_PLUGIN_ROOT}/**)
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

- Presence of health data (Gesundheitsdaten) → triggers the Art. 9 GDPR + ELGA / GTelG 2012 health-data section
- Image/video processing (Bildverarbeitung, CCTV) → triggers the image-processing section, assessed on the GDPR (§§12–13 DSG largely displaced; see Section 5)
- Employee data processing → triggers ArbVG Betriebsvereinbarung: §96 Abs 1 Z 3 (control measures affecting human dignity) and/or §96a (Personaldatensysteme)
- Scientific research → triggers §§7–8 DSG (Forschungszwecke); DSB approval (Genehmigung) under §7 DSG, and the Art. 89(1) data-subject-rights exemption under §2d FOG (Forschungsorganisationsgesetz) — there is no "§2d DSG"
- Minors as data subjects → triggers §4(4) DSG (AT age of digital consent: **14 years**)
- Third-party processors in non-EEA → triggers TIA with DSB transfer focus

### Step 3: Template Reading

**Read the template** (with user override support):

- **First**, check if `.arckit/templates-custom/at-dsgvo-template.md` exists in the project root, then `.arckit/templates/at-dsgvo-template.md`
- **If found**: Read the user's customized template
- **If not found**: Read `${CLAUDE_PLUGIN_ROOT}/templates/at-dsgvo-template.md`
- **Then read** `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md` and resolve the `<!-- DOC-CONTROL-HEADER -->` marker in the template before writing. `ATDSG` carries the Austria regime, which hard-routes to `_partials/document-control-at.md` whatever the operator's user config says.

### Step 4: Generate AT Data Protection Assessment

**CRITICAL**: Use the **Write tool** to create the assessment document.

1. **Detect version**: Check for existing `ARC-{PROJECT_ID}-ATDSG-v*.md` files:
   - No existing file → VERSION="1.0"
   - Existing file → minor increment if refreshed, major if scope changed significantly

2. **Auto-populate Document Control**:
   - Document ID: `ARC-{PROJECT_ID}-ATDSG-v{VERSION}` Work out `{VERSION}` first with `${CLAUDE_PLUGIN_ROOT}/references/version-detection.md`: a re-run writes the next version beside the earlier file, never over it.
   - Status: DRAFT
   - Created Date: {current_date}
   - Next Review Date: {current_date + 12 months}
   - Classification: **Eingeschränkt** (or **Vertraulich** where criminal-law confidentiality applies); privacy assessments contain sensitive risk information.
   - Add note: "This document supplements ARC-{PROJECT_ID}-RGPD-v*.md with Austrian/DSB-specific requirements"

3. **Executive Summary and section order**: the template has an Executive Summary table (one row per Sections 1–17) followed by **18 numbered sections**. Write every section in the template's order. Conditional sections (5, 6, 7, 8, 15, and 3 where consent is not a lawful basis) keep their header with an "N/A — …" line when they do not apply, so the numbering never shifts.

4. **Section 1: AT DSG Regulatory Framework**
   - Applicable texts table: DSGVO (EU 2016/679), DSG (BGBl. I 165/1999 idgF); law-enforcement/justice data processing under the **DSG 3. Hauptstück §§36–61** (transposing RL (EU) 2016/680; StPO §§134–143b apply as lex specialis); sector laws (ELGA-G for health, GTelG 2012, ArbVG §96 Abs 1 Z 3 / §96a, TKG 2021)
   - DSB as supervisory authority — contact: dsb.gv.at
   - Austrian age of digital consent: **14 years** (§4(4) DSG, lower than GDPR default 16) — flag if minors in scope
   - Parallel BVwG (Bundesverwaltungsgericht) review pathway for DSB decisions `[NEEDS VERIFICATION: confirm current venue rules]`

5. **Section 2: Lawful Basis Assessment (Art. 6 / Art. 9 GDPR)**
   - Select the Art. 6(1) basis per processing activity and cite the specific Austrian law for lit. (c) and (e); lit. (f) is not available to public authorities
   - Where special category data is processed, select the Art. 9(2) condition (e.g. lit. (g) / (j) with §7 DSG, lit. (h) with ELGA-G / GTelG 2012)

6. **Section 3: Consent Management** (conditional — only where Art. 6(1)(a) or Art. 9(2)(a) is relied on)
   - Freely given, specific, informed, unambiguous; withdrawal as easy as giving; consent records; re-consent on purpose change
   - Employee consent: address the power imbalance (Art. 7 GDPR, WP259)
   - Minors: apply the 14-year age of digital consent (§4(4) DSG)

7. **Section 4: DPIA Screening (Art. 35 GDPR + DSB Blacklist)**
   - Score the nine EDPB WP248 criteria; two or more → full DPIA
   - Check the DSB's Art. 35(4) list, the **DSFA-V (BGBl. II Nr. 278/2018)**; a match means a DPIA is required. The DSFA-AV (BGBl. II Nr. 108/2018) lists the exceptions
   - If a DPIA is required, hand off to `/arckit:dpia`

8. **Section 5: Image and Video Processing (GDPR; §§12–13 DSG)** (conditional — only if CCTV/imagery detected)
   - ⚠️ **Current case law — assess on the GDPR**: the VwGH has held that where private video surveillance is assessed under Art. 6(1)(f) GDPR, **§12 Abs. 2 Z 4 in conjunction with Abs. 3 DSG must be left unapplied**, because the GDPR gives no opening clause for a legislated balancing of interests; the processing is measured **solely** against Art. 6(1)(f) GDPR, case by case (**VwGH 22.10.2025, Ra 2023/04/0075**, confirming the BVwG line of W256 2214855-1, 20.11.2019 and W211 2210458-1, 25.11.2019). The VwGH did not rule on the rest of §§12–13, but its reasoning applies to them too. The OGH applied §12 DSG in civil proceedings (6 Ob 150/19f, 27.11.2019, requiring a case-by-case proportionality test) and civil courts still cite it alongside Art. 6(1)(f) (e.g. 1 Ob 155/25p, 11.11.2025). So: do **not** present §§12–13 DSG as the legal basis, and do **not** present them as stricter than the GDPR
   - Lawful basis: Art. 6(1) GDPR — for private controllers usually lit. (f), with a documented balancing of interests on the facts (reasonable expectations of those filmed, scope of the recording, less intrusive alternatives, data minimisation under Art. 5(1)(c))
   - Labelling (Kennzeichnung) — visible notice naming the controller; this flows from the GDPR transparency duties (Art. 12–14) whatever the status of §13 Abs. 5 DSG
   - Retention: storage limitation under Art. 5(1)(e) GDPR; keep recordings no longer than the purpose needs and document any retention beyond **72 hours**, the benchmark §13 Abs. 3 DSG sets
   - No filming of the most private areas (höchstpersönlicher Lebensbereich) and no use to monitor employees, the cases §12 Abs. 4 DSG prohibits: record these as outcomes of the Art. 6(1)(f) balancing and, for staff, of ArbVG §96 — not as freestanding §12 DSG rules
   - No covert imaging unless a narrow statutory ground applies
   - EDPB Guidelines 3/2019 on processing of personal data through video devices — the VwGH relied on version 2.0 (adopted 29 January 2020) in Ra 2023/04/0075; check edpb.europa.eu for any later version
   - If no image processing: include section header with "N/A — no image or video processing identified"

9. **Section 6: Health Data and ELGA** (conditional — only if health data detected)
   - Elektronische Gesundheitsakte (ELGA-G) interoperability requirements
   - GTelG 2012 telematics interop for data exchange between health providers
   - Art. 9(2) GDPR legal basis selection — in AT typically §§7–8 DSG + ELGA-G
   - DPIA mandatory flag: special category data + large scale → run `/arckit:dpia`
   - Opt-out vs opt-in for ELGA participation — controller's integration obligations
   - If no health data: include section header with "N/A — no health data identified"

10. **Section 7: Employee Data (Arbeitnehmerdatenschutz)** (conditional — only if employee data in scope)
    - ArbVG Betriebsvereinbarung: employee **monitoring** measures that touch human dignity require a BV under **§96 Abs 1 Z 3** (consent-based); **Personaldatensysteme** (personnel data systems beyond general identification/qualification data) require a BV under **§96a**
    - Works council (Betriebsrat) co-determination rights
    - Data Protection Impact Assessment interface with co-determination
    - Distinction: systems touching "personal dignity" need Betriebsvereinbarung regardless of privacy level
    - If out of scope: include section header with "N/A — no employee data or no employee monitoring potential"

11. **Section 8: Scientific Research (§§7–8 DSG)** (conditional — only if research use case)
    - Research exemptions under §§7–8 DSG and Art. 89 GDPR
    - DSB approval (Genehmigung) for research/statistics processing under §7 (esp. §7 Abs 3) DSG; the exemption from Art. 89(1) GDPR data-subject rights for research sits in §2d FOG (Forschungsorganisationsgesetz), not in the DSG
    - Pseudonymisation obligations
    - Retention under research framework
    - If not applicable: include section header with "N/A — no scientific research processing identified"

12. **Section 9: Data Subject Rights (Austrian enforcement)**
    - Standard rights table (Art. 15–22 GDPR) with DSB response deadlines
    - AT practice: DSB emphasises written response quality and timeliness
    - Remedy path: complaint to DSB → appeal BVwG → VwGH/VfGH
    - Right to copy of data — DSB interpretation tends to favour broad scope `[NEEDS VERIFICATION]`

13. **Section 10: DPO Registration and ROPA**
    - Art. 30 GDPR ROPA (Verarbeitungsverzeichnis) — DSB has a documented expectation of depth
    - DPO (Datenschutzbeauftragter) mandatory triggers (Art. 37(1) GDPR):
      - Public authority / public body → always mandatory
      - Large-scale systematic monitoring
      - Large-scale special category data processing
    - DPO contact reporting to DSB via dsb.gv.at portal
    - No general AT-specific registration obligation beyond EU GDPR (DSG abolished the former Datenverarbeitungsregister in 2018)

14. **Section 11: Breach Notification to DSB**
    - 72-hour notification via dsb.gv.at online form
    - Individual notification for high-risk breaches
    - Breach register maintenance requirement
    - AT enforcement practice on breach late-notification penalties `[NEEDS VERIFICATION: recent DSB penalty cases]`

15. **Section 12: Technical and Organisational Measures (Art. 32 GDPR)**
    - Status per Art. 32(1)(a)–(d) measure category, plus Art. 32(4) (anyone acting under the controller's or processor's authority processes the data only on instructions); pre-populate from the SECD artefact where available

16. **Section 13: Data Processing Agreements (Art. 28 GDPR)**
    - Processor register (purpose, location, Auftragsverarbeitungsvertrag in place, sub-processors, last audit); Art. 28(3) mandatory clauses; sub-processor approval chain

17. **Section 14: International Transfers (Post-Schrems II)**
    - Post-Schrems II Transfer Impact Assessment requirement — align with EDPB Recommendations 01/2020
    - EU-US Data Privacy Framework status and AT implications
    - DSB position on SCC supplementary measures `[NEEDS VERIFICATION]`

18. **Section 15: Cookies and Tracking (§165 TKG 2021)** (conditional — only if cookies, pixels, fingerprinting or similar tracking are used)
    - §165 Abs 3 TKG 2021 consent for non-essential storage and access; banner blocks tracking until consent; opt-out as easy as opt-in; cookie categories and retention documented
    - If not applicable: include section header with "N/A — no cookies or tracking identified"

19. **Section 16: DSB Enforcement Priority Self-Assessment**
    - Map against DSB recent enforcement focus (cookie consent, tracking, CCTV retention, employee monitoring, HR data, international transfers) `[NEEDS VERIFICATION: cite recent DSB annual report]`
    - Notable AT reference decisions for calibration `[NEEDS VERIFICATION]`

20. **Section 17: Sanctions Exposure (Art. 83 GDPR + §62 DSG)**
    - Art. 83(4) / 83(5) GDPR ceilings, §62 DSG administrative offences (up to €50,000), §188 TKG 2021 for cookie breaches
    - Public-authority fine exemption under §30 Abs 5 DSG (see Important Notes) — never present the Art. 83 ceilings as a public body's exposure

21. **Section 18: Gap Analysis and Action Plan**
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
🔒 Classification: Eingeschränkt (Vertraulich where criminal-law confidentiality applies)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Austrian-Specific Compliance Areas
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Area                            | Status       | Gaps |
|---------------------------------|--------------|------|
| Image/Video Processing (GDPR)   | {N/A or status} | {N} |
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
- **Image processing is assessed on the GDPR, not §12 DSG**: §§12–13 DSG are still on the statute book, but the VwGH has held that for private video surveillance assessed under Art. 6(1)(f) GDPR, §12 Abs. 2 Z 4 iVm Abs. 3 DSG stays unapplied for want of a GDPR opening clause, and the processing is measured solely against Art. 6(1)(f) (VwGH 22.10.2025, Ra 2023/04/0075, confirming the BVwG's 2019 line). The OGH applied §12 in civil proceedings (6 Ob 150/19f, with a case-by-case proportionality test) and civil courts still cite it alongside Art. 6(1)(f) GDPR. Never present §§12–13 DSG as the legal basis or as stricter than the GDPR.
- **ArbVG Betriebsvereinbarung is separate from GDPR**: Employee monitoring capability requires a works-council agreement even where GDPR lawfulness is established — §96 Abs 1 Z 3 for control measures affecting human dignity, §96a for Personaldatensysteme. Flag if employee monitoring or a personnel data system is possible.
- **Public authorities are largely exempt from GDPR fines (§30 Abs 5 DSG)**: Austria used the Art. 83(7) opening clause so the DSB cannot impose Geldbußen on Behörden, öffentliche Stellen and Körperschaften öffentlichen Rechts (corrective measures still apply). For public-sector controllers, present the Art. 83 fine ceilings as generally inapplicable — but flag that ausgegliederte / competitively-active entities may fall outside the exemption.
- **Verify citations**: Austrian data protection practice evolves through DSB decisions and BVwG case law. Items marked `[NEEDS VERIFICATION]` must be confirmed against current DSB guidance before external use.
- **Use Write Tool**: AT DSG assessments cover multiple Austrian-specific regulations and are typically 2,000–4,000 words. Always use the Write tool.

## Success Criteria

- ✅ Assessment document created at `projects/{project_id}/ARC-{PROJECT_ID}-ATDSG-v{VERSION}.md`
- ✅ All 18 template sections present in order, with conditional sections marked N/A rather than dropped
- ✅ Applicable DSG sections identified (§§7–8, §4(4), §30 Abs 5, §62; §7 DSG Genehmigung / §2d FOG research provisions as applicable)
- ✅ Image/video processing assessed on Art. 6(1) GDPR if CCTV/imagery in scope, citing VwGH Ra 2023/04/0075 for why §12 Abs. 2 Z 4 iVm Abs. 3 DSG is not applied
- ✅ ELGA-G / GTelG 2012 interop assessed if health data in scope
- ✅ ArbVG Betriebsvereinbarung (§96 Abs 1 Z 3 / §96a) flagged if employee monitoring or a personnel data system in scope
- ✅ §§7–8 DSG research exemptions addressed if research use case in scope
- ✅ Age of digital consent at 14 years applied (not GDPR default 16)
- ✅ DPO registration with DSB assessed
- ✅ 72-hour breach notification to DSB process assessed
- ✅ Post-Schrems II TIA requirement applied
- ✅ DSB enforcement priority self-assessment completed
- ✅ Gap analysis with prioritised action plan generated
- ✅ Document classified Eingeschränkt (or Vertraulich where criminal-law confidentiality applies)

## Example Usage

```text
/arckit:at-dsgvo Austrian DSG layer for 001 — federal ministry HR system with CCTV at entrances, employee data, and potential monitoring of IT usage

/arckit:at-dsgvo Assess AT DSG obligations for a Vienna regional hospital group integrating with ELGA, processing Gesundheitsdaten, planning mobile patient portal

/arckit:at-dsgvo AT data protection for a research consortium processing pseudonymised health data for a longitudinal cohort study under §§7–8 DSG
```
