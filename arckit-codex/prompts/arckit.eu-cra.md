---
description: "[COMMUNITY] Assess EU Cyber Resilience Act (CRA, Regulation 2024/2847) compliance obligations for products with digital elements placed on the EU market"
---

> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output should be reviewed by qualified DPO / RSSI / legal counsel before reliance. Citations to ANSSI / CNIL / EU regulations may lag the current text — verify against the source.

You are helping an enterprise architect generate a **EU Cyber Resilience Act (CRA) Compliance Assessment** (Regulation EU 2024/2847) for a product with digital elements (software or hardware) placed or made available on the EU market. The CRA entered into force December 2024, with full obligations applying by **11 December 2027**.

## User Input

```text
$ARGUMENTS
```

## Instructions

> **Note**: Before generating, scan `projects/` for existing project directories. For each project, list all `ARC-*.md` artifacts, check `external/` for reference documents, and check `000-global/` for cross-project policies. If no external docs exist but they would improve output, ask the user.

### Step 0: Read existing artifacts from the project context

**MANDATORY** (warn if missing):

- **REQ** (Requirements) — Extract: product functional requirements, security requirements (NFR-SEC-xxx), software update requirements, vulnerability management requirements, SBOM requirements
  - If missing: warn that CRA scoping and classification require a clear product description

**RECOMMENDED** (read if available, note if missing):

- **RISK** (Risk Register) — Extract: security risks, vulnerability risks, third-party component risks, supply chain risks
- **SECD** (Secure by Design) — Extract: existing security controls, secure development practices, vulnerability handling procedures already in place
- **PRIN** (Architecture Principles, 000-global) — Extract: secure-by-default principles, software bill of materials policy, disclosure policy

**OPTIONAL** (read if available, skip silently):

- **DATA** (Data Model) — Extract: data processed by the product (personal data triggers GDPR intersection)
- **NIS2** (NIS2 Assessment) — Extract: if product is used by NIS2-scoped operators, CRA incident reporting overlaps with NIS2

### Step 0b: Read external documents and policies

- Read any **external documents** in `external/` — extract existing vulnerability disclosure policies, CE marking documentation, SBOM files, ANSSI correspondence, existing conformity assessment documentation
- Read any **global policies** in `000-global/policies/` — extract secure development lifecycle policy, vulnerability management policy, disclosure policy

### Step 1: Identify or Create Project

Identify the target project from the hook context. If the project doesn't exist:

1. Use Glob to list `projects/*/` directories and find the highest `NNN-*` number
2. Calculate the next number (zero-padded to 3 digits)
3. Slugify the project name
4. Use the Write tool to create `projects/{NNN}-{slug}/README.md`
5. Set `PROJECT_ID` and `PROJECT_PATH`

### Step 2: Read Source Artifacts

Read all documents from Step 0. Identify:

- Product type: hardware or software?
- Market: placed on EU market?
- Sector regulation exclusions: medical devices (MDR), aviation (EASA), automotive, marine — if excluded, the CRA does not apply
- Open source scenario: commercial or non-commercial?
- Potential Class I or II classification triggers

### Step 3: CRA Template Reading

**Read the template** (with user override support):

- **First**, check if `.arckit/templates/eu-cra-template.md` exists in the project root
- **If found**: Read the user's customized template
- **If not found**: Read `.arckit/templates/eu-cra-template.md`

### Step 4: Scope and Risk Classification

Before generating the assessment, determine:

**In-Scope Check**:

1. Is it a product with digital elements? (hardware + software, or standalone software)
2. Is it placed or made available on the EU market?
3. Is it excluded by sector legislation? (MDR, EASA, automotive, marine, civil aviation)

**Open Source Assessment**:

- Non-commercial open source → out of scope
- Open source with paid support/commercial activity → in scope for supported version
- Open source integrated in commercial product → manufacturer responsible for full product
- Open source steward (foundation) → lighter obligations (security policy, CVE participation)

**Risk Classification (Annex III)**:

- **Class I (Important)**: Identity management software, browsers, password managers, VPNs, network monitoring, industrial control systems, smart home security devices, firewalls, intrusion detection/prevention
- **Class II (Critical)**: HSMs, smart meters, critical infrastructure components, industrial automation PLCs, card readers, smart meters, voting systems, medical devices covered by MDR (if in scope)
- **Default**: All other products with digital elements

Show scope determination and classification before proceeding.

### Step 5: Generate CRA Assessment

**CRITICAL**: Use the **Write tool** to create the assessment document.

1. **Detect version**: Check for existing `ARC-{PROJECT_ID}-CRA-v*.md` files:
   - No existing file → VERSION="1.0"
   - Existing file → minor increment if refreshed, major if classification changed

2. **Auto-populate Document Control**:
   - Document ID: `ARC-{PROJECT_ID}-CRA-v{VERSION}`
   - Status: DRAFT
   - Created Date: {current_date}
   - Next Review Date: {current_date + 12 months}
   - Role: Manufacturer / Importer / Distributor
   - Product Name: from user input or requirements

3. **Section 1: Scope and Classification**
   - In-scope determination with rationale
   - Open source scenario assessment
   - Risk classification (Default / Class I / Class II) with Annex III reference
   - Conformity assessment route from classification

4. **Section 2: Security Requirements by Design (Annex I, Part I)**
   - All twelve security requirements with status and gaps:
     1. No known exploitable vulnerabilities at market placement
     2. Secure by default configuration
     3. Protection against unauthorised access (authentication, access control)
     4. Data confidentiality and integrity
     5. Minimal data collection
     6. Availability protection (DoS resistance)
     7. Limit attack surface (disable unused interfaces)
     8. Reduce exploitable vulnerabilities (least privilege, defence in depth)
     9. Integrity monitoring
     10. Security audit logging
     11. Secure update mechanism (signed updates, rollback)
     12. End-of-support transparency
   - Extract existing controls from SECD artifact

5. **Section 3: Vulnerability Management (Annex I, Part II)**
   - Vulnerability Disclosure Policy (VDP): published, accessible, contact mechanism
   - SBOM requirements: machine-readable, top-level dependencies minimum, SPDX or CycloneDX format
   - CVE registry participation: MITRE/NVD registration for product vulnerabilities
   - Free security updates throughout support lifetime
   - Coordinated disclosure to CSIRT and ENISA
   - 24-hour incident reporting capability

6. **Section 4: Reporting Obligations**
   - Four-stage reporting timeline:
     - 24h: early warning on actively exploited vulnerability → ENISA + CERT-FR
     - 24h: early warning on security incident with product impact → ENISA + CERT-FR
     - 72h: full incident notification → ENISA + CERT-FR
     - 14 days after mitigation: final report → ENISA + CERT-FR
   - Reporting readiness assessment

7. **Section 5: Conformity Assessment**
   - Conformity route by classification:
     - Default: Module A internal control
     - Class I with harmonised standards: Module A with standards (no notified body)
     - Class I without harmonised standards: Module B+C (notified body required)
     - Class II: Module B+C or H (notified body required)
   - Technical documentation checklist (product description, design docs, risk assessment, SBOM, test results, VDP, Declaration of Conformity, CE marking)
   - Notified body engagement timeline if required

8. **Section 6: French Market Surveillance**
   - ANSSI: technical lead and designated CRA market surveillance authority
   - DGCCRF: consumer protection coordination
   - CERT-FR: vulnerability and incident report recipient

9. **Section 7: Gap Analysis and Timeline**
   - All requirements with status, gap, remediation action, and CRA deadline
   - Key dates:
     - 11 September 2026: Notification body obligations
     - 11 December 2027: Full CRA obligations

Before writing the file, read `.arckit/references/quality-checklist.md` and verify all **Common Checks** pass.

Write the document to:

```text
projects/{project_id}/ARC-{PROJECT_ID}-CRA-v{VERSION}.md
```

### Step 6: Summary Output

```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ CRA Compliance Assessment Generated
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 Document: projects/{project_id}/ARC-{PROJECT_ID}-CRA-v{VERSION}.md
📋 Document ID: {document_id}
📅 Assessment Date: {date}
⏰ CRA Full Application: 11 December 2027

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔒 Product Classification
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

In Scope: {Yes / No}
Classification: {Default / Important (Class I) / Critical (Class II)}
Conformity Route: {Internal control / Module B+C / Module H}
Notified Body Required: {Yes / No}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Requirements Status
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Security by Design (Annex I Part I): {N}/12 requirements met
Vulnerability Management (Annex I Part II): {N}/7 requirements met
Reporting Capability (24h): {Ready / Gap}

Total Gaps: {N} ({N} high, {N} medium)

Critical path items:
- SBOM: {status}
- VDP: {status}
- 24h reporting: {status}
- CE marking: {status}

Next steps:
1. {If NIS2 overlap: Run /arckit.eu-nis2}
2. {If AI component: Run /arckit.eu-ai-act}
3. Run /arckit.secure for Annex I security controls
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Important Notes

- **Visa vs Qualification distinction for comparison**: Note that unlike SecNumCloud, the CRA has a single qualification framework — but Annex III classification (Class I vs II) determines whether a notified body is required.
- **SBOM is mandatory**: A Software Bill of Materials at minimum for top-level dependencies is a CRA requirement, not a best practice. SPDX or CycloneDX formats are recommended.
- **24-hour reporting**: The 24-hour early warning window for actively exploited vulnerabilities is very tight. Requires security monitoring infrastructure and clear escalation paths to ENISA and CERT-FR.
- **"Secure by default" means exactly that**: Devices/software must be shipped with the most secure settings on by default. Pre-configured default passwords are explicitly prohibited.
- **Open source stewards have lighter obligations**: If the project is an open source foundation or steward (not commercialising the software), the CRA applies lighter obligations — document this clearly in the assessment.
- **Use Write Tool**: CRA assessments cover 12+ security requirements and a conformity assessment process. Always use the Write tool.

## Key References

| Document | Publisher | URL |
|----------|-----------|-----|
| CRA (Regulation 2024/2847) — full text | EUR-Lex | https://eur-lex.europa.eu/eli/reg/2024/2847/oj |
| ENISA — CRA guidance and product security resources | ENISA | https://www.enisa.europa.eu/topics/cybersecurity-policy/cyber-resilience-act |
| European Commission — CRA implementation page | European Commission | https://digital-strategy.ec.europa.eu/en/policies/cyber-resilience-act |
| CERT-FR — vulnerability disclosure and reporting (France) | CERT-FR / ANSSI | https://www.cert.ssi.gouv.fr/ |
| ANSSI — French national cybersecurity agency (market surveillance authority) | ANSSI | https://cyber.gouv.fr/ |
| CycloneDX — SBOM standard | OWASP | https://cyclonedx.org/ |
| SPDX — SBOM standard | Linux Foundation | https://spdx.dev/ |

> **Note for reviewers**: The CRA (Cyber Resilience Act) is the EU's first regulation imposing mandatory cybersecurity requirements on products with digital elements — hardware and software sold on the EU market. It applies to manufacturers, importers, and distributors. Products are classified as Default (most products), Important Class I (e.g. browsers, password managers, VPNs, routers), or Critical Class II (e.g. OS, industrial control systems, smart meters). Application deadline is 11 December 2027. The SBOM (Software Bill of Materials) requirement means manufacturers must know and disclose all software components in their products — this is a significant supply chain transparency obligation.

## Success Criteria

- ✅ Assessment document created at `projects/{project_id}/ARC-{PROJECT_ID}-CRA-v{VERSION}.md`
- ✅ In-scope determination made (product with digital elements, EU market, no sector exclusion)
- ✅ Open source scenario assessed
- ✅ Risk classification determined (Default / Class I / Class II)
- ✅ Conformity assessment route determined (internal control vs notified body)
- ✅ All 12 Annex I Part I security requirements assessed with status
- ✅ All 7 Annex I Part II vulnerability management requirements assessed
- ✅ SBOM requirement assessed (format, scope, maintenance)
- ✅ VDP assessment (published, accessible, contact)
- ✅ Four-stage incident reporting timeline assessed
- ✅ 24-hour reporting capability to ENISA and CERT-FR assessed
- ✅ Technical documentation completeness assessed
- ✅ CE marking and EU Declaration of Conformity process assessed
- ✅ French market surveillance authorities (ANSSI, CERT-FR) documented
- ✅ Gap analysis with CRA application deadline (December 2027) timeline

## Example Usage

```text
/arckit.eu-cra Assess CRA compliance for an industrial IoT gateway device placed on EU market, connecting factory floor OT equipment to cloud analytics, firmware updateable, classified as Important (Class I) under Annex III

/arckit.eu-cra CRA assessment for 001 — password manager software (SaaS), placed on EU market, subscription model, Class I classification expected

/arckit.eu-cra CRA compliance for an open source network monitoring tool with commercial support contract, assess whether the open source steward exemption applies
```

## Suggested Next Steps

After completing this command, consider running:

- `/arckit:eu-nis2` -- Map overlapping incident reporting obligations between CRA and NIS2 *(when Product is used by NIS2-scoped entities as part of their critical infrastructure)*
- `/arckit:eu-ai-act` -- Assess AI Act obligations if the product contains an AI system *(when Product with digital elements includes an AI component)*
- `/arckit:secure` -- Implement security controls addressing CRA Annex I essential requirements
