---
name: arckit-fr-anssi
description: "[COMMUNITY] Assess compliance with ANSSI security recommendations — Guide d'hygiène informatique (42 measures) and cloud security recommendations"
---

> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output should be reviewed by qualified DPO / RSSI / legal counsel before reliance. Citations to ANSSI / CNIL / EU regulations may lag the current text — verify against the source.

You are helping an enterprise architect assess compliance with **ANSSI security recommendations** for a French information system. ANSSI (Agence Nationale de la Sécurité des Systèmes d'Information) publishes the authoritative security guidelines for French organisations. The primary reference is the **Guide d'hygiène informatique** (42 measures), complemented by the **ANSSI cloud security recommendations** (2021) for cloud-hosted or hybrid systems.

These recommendations are best-practice baseline for all organisations and are referenced as mandatory input for OIV security plans, OSE NIS2 compliance, RGS homologation, and PSSI drafting.

## User Input

```text
$ARGUMENTS
```

## Instructions

> **Note**: Before generating, scan `projects/` for existing project directories. For each project, list all `ARC-*.md` artifacts, check `external/` for reference documents, and check `000-global/` for cross-project policies. If no external docs exist but they would improve output, ask the user.

### Step 0: Read existing artifacts from the project context

**MANDATORY** (warn if missing):

- **REQ** (Requirements) — Extract: system description, deployment environment (cloud/on-premise/hybrid), user scale, security requirements (NFR-SEC-xxx), OIV/OSE designation
  - If missing: warn that ANSSI assessment requires understanding of system scope and environment

**RECOMMENDED** (read if available, note if missing):

- **SECD** (Secure by Design) — Extract: existing security controls and baseline measures already in place
- **EBIOS** (EBIOS RM Study) — Extract: security baseline from Workshop 1, existing measures already documented
- **PSSI** (Security Policy) — Extract: stated security objectives and organisational measures
- **DATA** (Data Model) — Extract: data sensitivity levels, which assets need strongest protection

**OPTIONAL** (read if available, skip silently):

- **SECNUM** (SecNumCloud Assessment) — Extract: cloud provider qualification level, informs cloud recommendation assessment
- **NIS2** (NIS2 Assessment) — Extract: Article 21 measures already assessed, avoid duplication
- **PRIN** (Architecture Principles, 000-global) — Extract: security principles and data classification policy

### Step 0b: Read external documents and policies

- Read any **external documents** in `external/` — extract previous ANSSI audits, PASSI penetration test reports, existing hygiene assessments, CERT-FR advisories received
- Read any **global policies** in `000-global/policies/` — extract security policy, access management policy, patch management policy
- If a previous ANSSI assessment exists, note which measures have changed status since the last review

### Step 1: Identify or Create Project

Identify the target project from the hook context. If the project doesn't exist:

1. Use Glob to list `projects/*/` directories and find the highest `NNN-*` number
2. Calculate the next number (zero-padded to 3 digits)
3. Slugify the project name
4. Use the Write tool to create `projects/{NNN}-{slug}/README.md`
5. Set `PROJECT_ID` and `PROJECT_PATH`

### Step 2: Read Source Artifacts

Read all documents from Step 0. From the artifacts, extract:

- System deployment environment: cloud (IaaS/PaaS/SaaS), on-premise, hybrid
- Existing security controls — which of the 42 hygiene measures may already be implemented
- OIV/OSE designation — affects applicability priority (OIV must apply all measures)
- Cloud provider used — determines which cloud recommendations apply

### Step 3: ANSSI Assessment Template Reading

**Read the template** (with user override support):

- **First**, check if `.arckit/templates/fr-anssi-template.md` exists in the project root
- **If found**: Read the user's customized template
- **If not found**: Read `.arckit/templates/fr-anssi-template.md`

### Step 4: ANSSI Compliance Assessment

#### Step 4a: Scope and Context

1. **System profile**: Document the system, its deployment environment, user population, and regulatory context (OIV/OSE/public sector/private)
2. **Cloud determination**: If the system uses any cloud services (IaaS, PaaS, SaaS), flag that cloud security recommendations apply in addition to the 42 measures
3. **Applicability**: Note any measures that are not applicable with justification (e.g. Measure 31 on Wi-Fi if the system has no Wi-Fi)

#### Step 4b: 42 Hygiene Measures Assessment

For each of the 42 measures, assess compliance status based on available artifacts, existing controls, and system context:

- **✅ Implemented**: Evidence of the measure being in place
- **⚠️ Partial**: Measure partially implemented — describe the gap
- **❌ Not implemented**: No evidence of the measure being in place
- **N/A**: Measure genuinely not applicable — document justification

Assess all seven themes:

**Theme 1 — Know and manage your assets** (Measures 1–5): hardware inventory, software inventory, naming conventions, technical contacts, network map

**Theme 2 — Manage user and admin accounts** (Measures 6–13): limit admin accounts, password policy, default credentials, individual accounts, account revocation, access management process, separate privileged accounts, no local admin for standard users

**Theme 3 — Authenticate and control access** (Measures 14–20): authentication before access, MFA for remote/admin, least privilege, restrict data access, physical access, authentication logging, remote maintenance security

**Theme 4 — Secure workstations and mobile devices** (Measures 21–27): configuration baseline, full-disk encryption on laptops, endpoint detection, removable media control, autorun disabled, email filtering, web content filtering

**Theme 5 — Protect your network** (Measures 28–34): network segmentation, inbound/outbound filtering, encrypted protocols, Wi-Fi security, admin interface exposure, intrusion detection, centralised log collection

**Theme 6 — Secure servers and applications** (Measures 35–39): server hardening baseline, unused services disabled, privileged access supervision, backup procedures, backup recovery tests

**Theme 7 — Manage vulnerabilities and updates** (Measures 40–42): software/firmware updates, CERT-FR subscription, vulnerability management process

#### Step 4c: Cloud Security Recommendations (if applicable)

If the system uses cloud services, assess ANSSI cloud security recommendations (2021):

1. **Cloud provider trust level**: Is the provider SecNumCloud-qualified? If not, what is the data sensitivity — does it require a qualified provider?
2. **Data sovereignty**: Is data stored exclusively in the EU? Are there extraterritorial law exposure risks (US CLOUD Act, China MLSA)?
3. **Encryption**: Customer-managed keys (BYOK) for sensitive data?
4. **Shared responsibility model**: Is the boundary between cloud provider and customer responsibilities documented?
5. **Cloud hardening**: Are cloud configurations hardened against ANSSI recommendations or CIS Benchmarks?
6. **Exit strategy**: Is data portability and service reversibility contractually guaranteed?
7. **Incident response**: Does the provider commit to notify within contractual timeframes?

#### Step 4d: Gap Analysis and Remediation Plan

For each non-compliant or partial measure:

- Assign priority: 🔴 High (deploy before go-live or OIV obligation), 🟠 Medium (within 90 days), 🟡 Low (within 12 months)
- Assign owner (role, not individual)
- Propose a concrete remediation action

### Step 5: Generate ANSSI Assessment Document

**CRITICAL**: Use the **Write tool** to create the full assessment document.

1. **Detect version**: Check for existing `ARC-{PROJECT_ID}-ANSSI-v*.md` files:
   - No existing file → VERSION="1.0"
   - Existing file → minor increment if a refresh, major if scope changed

2. **Auto-populate Document Control**:
   - Document ID: `ARC-{PROJECT_ID}-ANSSI-v{VERSION}`
   - Status: DRAFT
   - Created Date: {current_date}
   - Next Review Date: {current_date + 12 months}
   - Classification: OFFICIAL-SENSITIVE minimum (assessment reveals security gaps)

3. Write the complete assessment following the template, populated with Step 4 findings.

Before writing the file, read `.arckit/references/quality-checklist.md` and verify all **Common Checks** plus **ANSSI** per-type checks pass.

Write the document to:

```text
projects/{project_id}/ARC-{PROJECT_ID}-ANSSI-v{VERSION}.md
```

### Step 6: Summary Output

```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ ANSSI Security Assessment Generated
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 Document: projects/{project_id}/ARC-{PROJECT_ID}-ANSSI-v{VERSION}.md
📋 Document ID: {document_id}
📅 Assessment Date: {date}
🔒 Classification: OFFICIAL-SENSITIVE

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Hygiene Score (42 measures)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Implemented:        {N} / 42
Partial:            {N} / 42
Not implemented:    {N} / 42
Not applicable:     {N} / 42

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌩️ Cloud Recommendations (if applicable)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{Cloud applicable: Yes / No}
{If yes: provider qualification status, key gaps}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚨 Priority Gaps ({N} total)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔴 High ({N}): {top gap descriptions}
🟠 Medium ({N}): {medium gap descriptions}
🟡 Low ({N}):

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Next steps:
1. {If OIV/OSE: Run $arckit-fr-ebios — ANSSI findings feed Workshop 1 baseline}
2. {If cloud gaps: Run $arckit-fr-secnumcloud for provider qualification assessment}
3. Run $arckit-fr-pssi to formalise security objectives in a PSSI document
4. Run $arckit-secure to implement technical remediation measures
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Important Notes

- **Both public and private sector**: The ANSSI guide d'hygiène applies to all French organisations — public, private, OIV, OSE, SME. Priority and obligation level differ (OIV must apply all measures; others treat them as strongly recommended).
- **OIV / OSE obligations**: For OIV systems (SIIV), the hygiene measures are a baseline minimum. The sectoral arrêté sectoriel may impose additional measures. For OSE under NIS2, Article 21 measures overlap significantly — run `/arckit.eu-nis2` to avoid duplication.
- **ANSSI cloud recommendations are separate from SecNumCloud**: The cloud recommendations assess the security of the architecture; SecNumCloud is a provider qualification programme. Both are relevant for cloud-hosted sensitive systems.
- **CERT-FR subscription (Measure 41)**: Free subscription at cert.ssi.gouv.fr — flag this if not already done; it costs nothing and provides critical threat intelligence.

## Key References

| Document | Publisher | URL |
|----------|-----------|-----|
| Guide d'hygiène informatique (42 measures) | ANSSI | https://cyber.gouv.fr/publications/guide-dhygiene-informatique |
| Cloud security recommendations (2021) | ANSSI | https://cyber.gouv.fr/publications/prestataires-de-service-informatique-en-nuage-securite-et-resilience |
| ANSSI publications catalogue | ANSSI | https://cyber.gouv.fr/publications |
| CERT-FR security advisories (Measure 41) | CERT-FR / ANSSI | https://www.cert.ssi.gouv.fr/ |
| ANSSI-qualified provider lists (PASSI/PRIS/PDIS) | ANSSI | https://cyber.gouv.fr/qualification-des-prestataires-de-services |
| RGS v2.0 (Référentiel Général de Sécurité) | ANSSI | https://cyber.gouv.fr/referentiel-general-de-securite |

## Success Criteria

- ✅ Assessment document created at `projects/{project_id}/ARC-{PROJECT_ID}-ANSSI-v{VERSION}.md`
- ✅ All 42 hygiene measures assessed with status (implemented / partial / not implemented / N/A)
- ✅ Cloud security recommendations assessed if cloud services are used
- ✅ Gap analysis with priority, owner, and remediation action for each gap
- ✅ Summary score (N / 42 implemented) reported
- ✅ Document classified OFFICIAL-SENSITIVE minimum
- ✅ ANSSI per-type quality checks passed

## Example Usage

```text
$arckit-fr-anssi Assess ANSSI hygiene compliance for a French regional prefecture information system — on-premise Windows/Active Directory environment, 300 users, no cloud services

$arckit-fr-anssi ANSSI security posture for 001 — hybrid cloud ministry portal, hosted on OVHcloud, handling citizen personal data, NIS2 OSE designation

$arckit-fr-anssi ANSSI hygiene assessment for a French private company (OIV énergie sector), SCADA-adjacent IS, mixed cloud and on-premise, 50 IT staff
```

## Suggested Next Steps

After completing this command, consider running:

- `$arckit-fr-ebios` -- Use ANSSI hygiene gap findings as Workshop 1 security baseline in the EBIOS risk analysis *(when ANSSI assessment reveals significant gaps that should inform a formal risk analysis)*
- `$arckit-fr-secnumcloud` -- Assess cloud provider qualification against SecNumCloud when cloud security gaps are identified *(when Cloud security recommendations show gaps around provider qualification or extraterritorial risk)*
- `$arckit-fr-pssi` -- Translate ANSSI compliance findings into formal PSSI security objectives and organisational measures *(when Organisation requires a formal security policy document)*
- `$arckit-secure` -- Implement the technical security measures identified in the ANSSI gap analysis *(when ANSSI hygiene gaps require implementation in the codebase or infrastructure)*
