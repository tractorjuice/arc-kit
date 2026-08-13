---
description: "[COMMUNITY] Assess Austrian digital accessibility obligations — applicability across BaFG (European Accessibility Act, private sector) and WZG (public sector), EN 301 549 / WCAG conformance, Barrierefreiheitserklärung, SMS market surveillance and FFG monitoring"
doc-type: ATBFR
argument-hint: "<project ID or entity/service description, e.g. '001', 'federal ministry portal', 'Vienna fintech with consumer banking app, 8 staff'>"
effort: high
handoffs:
  - command: at-bvergg
    description: Carry the accessibility conformance target into the tender's Leistungsbeschreibung and award criteria
    condition: "Remediation or the service itself will be procured"
  - command: requirements
    description: Raise the conformance gaps as NFR-UX requirements so they enter the delivery backlog
    condition: "Gap analysis produced non-conformances needing engineering work"
  - command: at-dsgvo
    description: Assess DSG obligations where the feedback mechanism collects personal data
    condition: "Feedback mechanism or complaints channel processes personal data"
---


> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output should be reviewed by a qualified accessibility practitioner and Rechtsabteilung before reliance. Citations to BaFG / WZG / EN 301 549 may lag the current text — verify against RIS. Items marked `[NEEDS VERIFICATION]` must be confirmed before external use.

You are helping an enterprise architect generate an **Austrian Accessibility Assessment**. Austria transposed the EU accessibility regime along **two separate tracks**, and which one applies is a question about the entity, not about the technology:

- **BaFG** — *Bundesgesetz über Barrierefreiheitsanforderungen für Produkte und Dienstleistungen*, BGBl. I Nr. 76/2023, applicable since **28 June 2025**. Transposes Directive (EU) 2019/882, the **European Accessibility Act**. Binds economic actors: manufacturers, importers, distributors and service providers.
- **WZG** — *Web-Zugänglichkeits-Gesetz*, BGBl. I Nr. 59/2019, in force **23 July 2019**. Transposes Directive (EU) 2016/2102. Binds federal public bodies and bodies governed by public law for their websites and mobile applications.

An entity can be subject to **both** — a federal body running an in-scope e-commerce or banking service is the common case. Determine applicability first, then assess only the tracks that apply.

> **Not this command's job.** `/arckit:at-bvergg` already covers accessibility as a *procurement* clause (§107 BVergG). This command assesses the entity's own products, services, websites and apps. If you are writing a tender, run `/arckit:at-bvergg`.

## User Input

```text
$ARGUMENTS
```

## Instructions

> **Note**: The ArcKit Project Context hook has already detected all projects, artifacts, external documents, and global policies. Use that context below — no need to scan directories manually.

### Step 0: Read existing artifacts from the project context

**MANDATORY** (warn if missing):

- **REQ** (Requirements) — Extract: NFR-UX / accessibility requirements, user-facing functional scope (FR-xxx), channels and interfaces
  - If missing: warn that conformance cannot be scoped without knowing which surfaces exist. Proceed only on the description in `$ARGUMENTS`.

**RECOMMENDED** (read if available, note if missing):

- **STKE** (Stakeholder Analysis) — Extract: user groups, assistive-technology users, disability representation, whether users are consumers (BaFG) or citizens accessing a public service (WZG)
- **DIAG** / **HLD** — Extract: the actual user-facing surfaces — web, native mobile, kiosk, terminal, documents, e-books

**OPTIONAL** (read if available, skip silently):

- **BVERGG** (AT Procurement) — Extract: any accessibility clause already imposed on a supplier, so the assessment and the contract agree
- **RISK** (Risk Register) — Extract: existing accessibility, reputational or enforcement risks for cross-reference
- **SOBC** — Extract: entity size, turnover and headcount, which drive the BaFG microenterprise exemption

### Step 0b: Read external documents and policies

- Read any **external documents** in `external/` — extract any existing **Barrierefreiheitserklärung**, prior accessibility audit or VPAT, assistive-technology test reports, SMS or FFG correspondence, and user complaints about barriers
- Read any **global policies** in `000-global/policies/` — extract accessibility policy, design-system conformance statements, content style guides
- If a prior accessibility statement or audit is found, use it to pre-populate conformance status and to identify what has drifted since.

### Step 1: Identify or Create Project

Identify the target project from the hook context. If the project doesn't exist, create it with `${CLAUDE_PLUGIN_ROOT}/../arckit-claude/scripts/bash/create-project.sh --json`.

### Step 2: Read Source Artifacts

Read the artifacts identified in Step 0 in full. Extract every user-facing surface into an inventory — this inventory is the unit of assessment for the rest of the command.

### Step 3: Template Reading

Read `.arckit/templates-custom/at-barrierefreiheit-template.md` if it exists, otherwise `${CLAUDE_PLUGIN_ROOT}/templates/at-barrierefreiheit-template.md`.

### Step 4: Generate the Austrian Accessibility Assessment

1. **Detect version**: Check for existing `ARC-{PROJECT_ID}-ATBFR-v*.md` files. Increment the minor version if one exists; otherwise start at `v1.0`.

2. **Auto-populate Document Control**: resolve the `<!-- DOC-CONTROL-HEADER -->` marker per `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md`.
   - Classification: OFFICIAL — under the AT InfoSiG scheme use **Offen** once the accessibility statement is published, **Eingeschränkt** while non-conformances are open, since the gap list is an unremediated to-do list. Emit the AT InfoSiG value.

3. **Section 1: Applicability Determination** — do this first; it gates sections 3 and 4.

   Decide each track independently and record the reasoning, not just the verdict.

   - **WZG applies** if the entity is a federal public body, a body governed by public law, or a body predominantly publicly funded, and the surface is a website or mobile application. **The federal WZG does not reach Land-level bodies** — the Länder legislate separately, so a Land or municipal body is assessed against its Landesgesetz, not this act. Name the applicable Landesgesetz if the entity is a Land body `[NEEDS VERIFICATION: confirm the applicable Landesgesetz and its current text]`.
   - **BaFG applies** if the entity is a manufacturer, importer, distributor or service provider and the product or service is in Annex scope. In-scope products include general-purpose computer hardware and operating systems, self-service terminals (payment terminals, ATMs, ticketing and check-in machines, information kiosks), consumer terminal equipment for electronic communications, terminals for audiovisual media services, and e-readers. In-scope services include electronic communications services, audiovisual media services, elements of air/bus/rail/waterborne passenger transport services, consumer banking services, e-books and dedicated software, and e-commerce services.
   - **Microenterprise exemption (BaFG only, and services only).** A Kleinstunternehmen — fewer than 10 persons employed **and** annual turnover of at most EUR 2M **or** balance-sheet total of at most EUR 2M — is exempt from the accessibility requirements **for services it offers or provides** (§ 6, definition at § 3 Z 19) `[NEEDS VERIFICATION: confirm both § numbers against RIS]`. **Products are not exempt**: a nine-person importer of self-service terminals is fully in scope. State explicitly which limb of the test each criterion meets, and record the headcount and financial figures relied on — the Sozialministeriumservice can require an entity claiming the exemption to produce that evidence on request. An exemption asserted without evidence in the file is a finding, not a pass.
   - If neither track applies, say so with the reasoning and stop the substantive assessment there — still produce sections 5 and 6 covering why, and any voluntary conformance target the entity has adopted.

4. **Section 2: Standard and Conformance Mapping** — shared across both tracks; write it once.

   - Both tracks route through **EN 301 549** as the harmonised standard giving a **presumption of conformity**. The version that binds is the one **cited in the Official Journal**: today **v3.2.1**, which normatively references **WCAG 2.1 Level AA**.
   - Draft **v4.1.0** went out for public review in November 2025; final **v4.1.1**, expected to carry WCAG 2.2 AA, is anticipated to be OJ-cited around **October 2026** `[NEEDS VERIFICATION: confirm the OJ citation date and version]`. Assess against **2.1 AA**. Name 2.2 AA only as a forward-looking target where the product or contract lifetime runs past that citation, and mark it as a deliberate choice rather than the legal floor.
   - Produce a per-criterion conformance table for WCAG 2.1 AA (Supports / Partially Supports / Does Not Support / Not Applicable), each row carrying the evidence: which surface, which test method, which date.
   - Record the **test method** honestly — automated scan alone is not conformance evidence. Distinguish automated tooling, manual expert review, and assistive-technology testing with real users.
   - EN 301 549 covers more than the web. Where the inventory includes hardware, terminals, documents or e-books, assess the non-web clauses too and say which ones.

5. **Section 3: Barrierefreiheitserklärung (WZG track — mark N/A with reason if WZG does not apply)**

   The accessibility statement is a statutory deliverable, not a courtesy page. Required content:

   - **Conformance status** in the statutory wording: *vollständig konform*, *teilweise konform*, or *nicht konform* with EN 301 549 / WCAG 2.1 AA.
   - **Non-accessible content**, split into the three categories the Directive requires: content **incompatible** with the accessibility requirements, content excluded as a **disproportionate burden** (unverhältnismäßige Belastung, with the assessment that justifies it), and content **outside the scope** of the legislation.
   - **Preparation method and date** — self-assessment or third-party evaluation, with the date, and a commitment to keep the statement current.
   - **Feedback mechanism** — a working contact channel through which a user can report a barrier or request content in an accessible form, with the response commitment.
   - **Enforcement pointer** — where a complaint goes if the feedback mechanism does not resolve it: the **FFG (Österreichische Forschungsförderungsgesellschaft)**, which handles WZG monitoring and complaints.

   Assess the *existing* statement against this list where one exists, and flag a statement that recites conformance without listing known non-conformances — that is the most common failure and it is visible to any auditor who runs a scan.

6. **Section 4: Product and Service Requirements (BaFG track — mark N/A with reason if BaFG does not apply)**

   - Map each in-scope product or service to the applicable BaFG accessibility requirements, including the information obligations (accessible instructions, and a description of how the service meets the requirements published with the service).
   - **Conformity assessment and declaration**: for **products**, the economic actor draws up an EU declaration of conformity and affixes **CE marking**; the internal production-control route applies where the harmonised standard is used. For **services**, there is no CE marking — the obligation is the published description plus retained supporting documentation. Do not apply CE marking to a service.
   - **Disproportionate burden and fundamental alteration** are the two statutory defences. Both require a documented assessment retained on file, re-assessed when the product or service changes and periodically thereafter. An undocumented claim of burden is not a defence — record it as a gap.
   - **Emergency communications** (Notrufe) are transposed separately through the **TKG 2021**, not the BaFG. Flag it as out of scope here with a pointer, rather than assessing it under the wrong act.

7. **Section 5: Market Surveillance, Monitoring and Exposure**

   - **BaFG — Sozialministeriumservice (SMS)**, the Bundesamt für Soziales und Behindertenwesen, is the market surveillance authority (§ 21) `[NEEDS VERIFICATION]`. It monitors proactively, can order remediation within a set period, and in serious cases can require a product's withdrawal from the market or prohibit a service. Administrative penalties reach **EUR 80,000** (§ 36) `[NEEDS VERIFICATION: confirm the § and the tier structure]`, tiered by severity and set lower for SMEs and microenterprises. Give the exposure as a range against the specific conduct, not a bare headline number.
   - **WZG — FFG** performs monitoring and handles complaints, and Austria reports to the European Commission on a **triennial** cycle. The WZG carries **no administrative fine regime**: the consequence is a finding, a complaint, and publication, not a penalty. State this plainly rather than importing the BaFG number into a public-sector assessment.
   - Where both tracks apply, keep the two exposures separate. They are different authorities with different powers over different surfaces.

8. **Section 6: Gap Analysis and Remediation Roadmap**

   - One row per non-conformance: surface, criterion, severity, user impact, owner, target date, and the track it arises under.
   - Prioritise by user impact first and enforcement exposure second. A blocked login path outranks a decorative contrast failure regardless of which act is in play.
   - Where remediation needs procurement, note the handoff to `/arckit:at-bvergg` so the conformance target lands in the Leistungsbeschreibung rather than being rediscovered at acceptance.
   - Cross-reference each engineering item to an NFR-UX requirement ID, creating them via `/arckit:requirements` if they do not exist.

**Populate the External References section** per `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. BaFG (BGBl. I Nr. 76/2023), WZG (BGBl. I Nr. 59/2019), Directive (EU) 2019/882, Directive (EU) 2016/2102, EN 301 549 v3.2.1 and WCAG 2.1 MUST appear in the Document Register.

Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **ATBFR** per-type checks pass.

**Use the Write tool** to save to:

```text
projects/{project_id}/ARC-{PROJECT_ID}-ATBFR-v{VERSION}.md
```

### Step 5: Summary Output

```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Austrian Accessibility Assessment Generated
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 Document: projects/{project_id}/ARC-{PROJECT_ID}-ATBFR-v{VERSION}.md
📋 Document ID: {document_id}
📅 Assessment Date: {date}
🔒 Classification: OFFICIAL (AT InfoSiG: Offen / Eingeschränkt while gaps are open)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Applicability
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Track | Applies | Basis |
|-------|---------|-------|
| WZG (public sector)  | {Yes / No / Land-level — see Landesgesetz} | {reason} |
| BaFG (products/services) | {Yes / No / Exempt — Kleinstunternehmen, services only} | {reason} |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Conformance (EN 301 549 v3.2.1 → WCAG 2.1 AA)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Result | Count |
|--------|-------|
| Supports | {N} |
| Partially Supports | {N} |
| Does Not Support | {N} |
| Not Applicable | {N} |

Test method: {automated / manual expert / assistive-technology}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ Critical Actions
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{List 🔴 High priority gaps}

Exposure: {BaFG: SMS, up to EUR 80,000, tiered | WZG: FFG monitoring and complaints, no fine regime | Both, assessed separately}

Next steps:
1. {If WZG applies and no statement exists: publish a Barrierefreiheitserklärung}
2. {If remediation will be procured: Run /arckit:at-bvergg}
3. {If gaps need engineering: Run /arckit:requirements to raise NFR-UX items}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Important Notes

- **Applicability is about the entity, not the technology.** The same web application is assessed under the WZG for a federal ministry and under the BaFG for a bank. Decide the track before assessing anything, and support both where both apply.
- **The microenterprise exemption covers services only.** § 6 exempts Kleinstunternehmen offering or providing *services*; it does not exempt products. A nine-person importer of ticketing terminals is fully in scope. This is the single most common misreading of the BaFG.
- **An exemption without evidence is a gap.** The SMS can require an entity claiming the microenterprise exemption to produce the supporting headcount and financial evidence. Record the figures in the assessment.
- **The federal WZG does not cover Land bodies.** The Länder legislate separately. Route a Land or municipal body to its Landesgesetz rather than assessing it here.
- **The WZG has no fines.** Do not carry the BaFG's EUR 80,000 ceiling into a public-sector assessment. The consequence there is monitoring, complaint and publication.
- **Assess against WCAG 2.1 AA.** EN 301 549 v3.2.1 is the OJ-cited version and it is what carries the presumption of conformity. WCAG 2.2 AA arrives with v4.1.1, expected around October 2026 `[NEEDS VERIFICATION]`; specifying it earlier raises the bar above the legal floor and must be recorded as a deliberate decision. This matches `/arckit:at-bvergg`.
- **Automated scanning is not conformance.** A statement resting on a tool report alone is a finding. Record the test method for every criterion.
- **Verify citations**: BaFG paragraph numbers here are drawn from secondary sources because RIS was unavailable at authoring time. Confirm § 3 Z 19, § 6, § 21 and § 36 against RIS before external use.
- **Use Write Tool**: Accessibility assessments carrying a per-criterion table run 2,000–4,000 words. Always use the Write tool.

## Success Criteria

- ✅ Assessment document created at `projects/{project_id}/ARC-{PROJECT_ID}-ATBFR-v{VERSION}.md`
- ✅ Applicability determined for both tracks independently, with reasoning recorded
- ✅ Microenterprise exemption applied to services only, never to products, with the headcount and financial evidence recorded
- ✅ Land-level bodies routed to the applicable Landesgesetz rather than assessed under the federal WZG
- ✅ Conformance assessed against EN 301 549 v3.2.1 / WCAG 2.1 AA, with WCAG 2.2 AA appearing only as an explicit forward-looking decision
- ✅ Per-criterion table carries evidence and test method, not just a verdict
- ✅ Barrierefreiheitserklärung assessed against all five required elements where WZG applies
- ✅ Conformity assessment route correct per type — CE marking for products, published description for services
- ✅ Disproportionate burden and fundamental alteration claims backed by a documented, retained assessment
- ✅ Emergency communications flagged as TKG 2021 rather than assessed under the BaFG
- ✅ SMS and FFG exposures stated separately and correctly, with no fine regime asserted under the WZG
- ✅ Gap analysis prioritised by user impact first, with owners, dates and NFR-UX cross-references
- ✅ Items requiring practitioner verification marked `[NEEDS VERIFICATION]`

## Example Usage

```text
/arckit:at-barrierefreiheit Accessibility assessment for 001 — federal ministry citizen portal and its companion mobile app

/arckit:at-barrierefreiheit Vienna fintech, 8 staff, EUR 1.4M turnover, consumer banking app plus a self-service card-issuing terminal in branches

/arckit:at-barrierefreiheit Assess both tracks for a public transport operator — passenger information website, ticketing app, and platform ticket machines
```
