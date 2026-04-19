---
description: "[COMMUNITY] Assess Diffusion Restreinte (DR) handling compliance — marking, storage, transmission, and destruction rules for French administrative sensitive information"
argument-hint: "<project ID or system description, e.g. '001', 'ministry IS processing internal audit reports and security assessments'>"
effort: medium
handoffs:
  - command: fr-secnumcloud
    description: Assess cloud provider qualification for hosting systems that process DR information
    condition: "DR documents are stored or processed in cloud infrastructure"
  - command: fr-ebios
    description: Include DR assets in EBIOS Workshop 1 essential values and feared events
    condition: "DR data is a key asset in the system and EBIOS risk analysis is planned"
  - command: fr-anssi
    description: Assess the IS hosting DR data against ANSSI hygiene measures
    condition: "The system processing DR data has not yet been assessed against ANSSI recommendations"
  - command: fr-pssi
    description: Incorporate DR handling rules into the organisation's formal security policy
    condition: "Organisation requires a formal PSSI covering DR data handling"
---


> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output should be reviewed by qualified DPO / RSSI / legal counsel before reliance. Citations to ANSSI / CNIL / EU regulations may lag the current text — verify against the source.

You are helping an enterprise architect assess **Diffusion Restreinte (DR) handling compliance** for a French information system. DR is a French administrative protection mention applied to information whose disclosure would harm the interests of the French State or third parties, without reaching the level requiring formal classification under IGI 1300 (Confidentiel Défense and above).

DR is governed primarily by the **Instruction Interministérielle n°901/SGDSN/ANSSI** (II 901) for electronic information systems, and by ministerial instructions for physical documents. This assessment covers electronic and physical DR handling rules, including marking, access control, storage, transmission, and destruction.

> **Scope boundary**: This command covers DR only. Systems handling Confidentiel Défense or higher classification require a separate defence security framework (IGI 1300 / DGA / SGDSN) that is out of scope for ArcKit.

## User Input

```text
$ARGUMENTS
```

## Instructions

> **Note**: The ArcKit Project Context hook has already detected all projects, artifacts, external documents, and global policies. Use that context below — no need to scan directories manually.

### Step 0: Read existing artifacts from the project context

**MANDATORY** (warn if missing):

- **REQ** (Requirements) — Extract: system description, data types processed, security requirements (NFR-SEC-xxx), OIV/OSE designation, integration with other IS
  - If missing: warn that DR assessment requires a minimum understanding of what information the system handles

**RECOMMENDED** (read if available, note if missing):

- **DATA** (Data Model) — Extract: data assets, classification levels, data flows — essential to identify which assets should carry the DR mention
- **SECD** (Secure by Design) — Extract: existing security controls, encryption mechanisms, access management
- **ANSSI** (ANSSI Assessment) — Extract: IS qualification status, existing security measures that also support DR compliance

**OPTIONAL** (read if available, skip silently):

- **EBIOS** (EBIOS RM Study) — Extract: any prior identification of DR assets in Workshop 1 essential values
- **SECNUM** (SecNumCloud Assessment) — Extract: cloud provider qualification — relevant if DR data stored in cloud
- **PSSI** (Security Policy) — Extract: existing DR handling rules if documented in the PSSI

### Step 0b: Read external documents and policies

- Read any **external documents** in `external/` — extract previous DR assessments, ministerial DR handling instructions, IS homologation decisions that mention DR
- Read any **global policies** in `000-global/policies/` — extract DR handling policy, classification policy, information security policy
- If the organisation has a FSSI (Fonctionnaire de Sécurité des Systèmes d'Information), note their contact details — they are the authority for DR compliance

### Step 1: Identify or Create Project

Identify the target project from the hook context. If the project doesn't exist:

1. Use Glob to list `projects/*/` directories and find the highest `NNN-*` number
2. Calculate the next number (zero-padded to 3 digits)
3. Slugify the project name
4. Use the Write tool to create `projects/{NNN}-{slug}/README.md`
5. Set `PROJECT_ID` and `PROJECT_PATH`

### Step 2: Read Source Artifacts

Read all documents from Step 0. Extract:

- Types of information produced, processed, or stored by the system
- Existing handling procedures for sensitive information
- IT systems used for storage and transmission
- Relevant roles: FSSI, RSSI, data owners
- Any cloud services that may host DR information

### Step 3: DR Assessment Template Reading

**Read the template** (with user override support):

- **First**, check if `.arckit/templates/fr-dr-template.md` exists in the project root
- **If found**: Read the user's customized template
- **If not found**: Read `${CLAUDE_PLUGIN_ROOT}/templates/fr-dr-template.md`

### Step 4: DR Compliance Assessment

#### Step 4a: DR Asset Identification

1. **Asset inventory**: Identify all information types in the system that carry or should carry the DR mention. Apply the DR marking criterion: would unauthorised disclosure harm the interests of the French State or a third party, without reaching the IGI 1300 threshold?
   - Typical DR candidates: internal security reports, audit findings, vulnerability assessments, system architecture documents, sensitive correspondence, budget documents not yet public, personnel security information
2. **Current marking status**: For each asset type, note whether it is already marked DR or whether the marking is inconsistently applied
3. **DR registry**: Does the organisation maintain a register of DR documents? Who owns it?

#### Step 4b: Marking and Labelling Compliance

For each electronic document type assessed as DR:

- Is "DIFFUSION RESTREINTE" applied in header and footer of every page?
- Is the DR mention included in document metadata?
- Are DR document references tracked in a registry?

#### Step 4c: Access Control Assessment

1. **Need-to-know application**: Is access to DR information restricted to personnel with a demonstrated need?
2. **Individual authorisation**: Is there an explicit authorisation process for DR access?
3. **Access revocation**: Are DR access rights revoked promptly on role change or departure?
4. **Third-party access**: Are DR documents ever shared with external parties? Is there an approval process?

#### Step 4d: Electronic Storage Assessment

1. **System qualification**: Is the IS used to store DR information registered with the FSSI and approved for DR?
2. **Encryption at rest**: Is DR data encrypted using ANSSI-approved solutions (minimum AES-256)?
3. **Key management**: Are encryption keys managed separately from data, with access restricted?
4. **Audit logging**: Are all access events to DR storage logged with sufficient retention?
5. **Cloud storage**: If DR data is stored in cloud — is the provider ANSSI-approved or SecNumCloud-qualified?

#### Step 4e: Electronic Transmission Assessment

1. **Approved channels**: Is DR transmitted only on approved networks (RIE, ANSSI-approved VPN)?
2. **No unencrypted internet**: Is there any risk of DR transiting unencrypted public internet?
3. **Email**: Is standard email (without approved encryption) ever used for DR? This is non-compliant.
4. **Mobile devices**: Can DR be accessed from unmanaged personal devices?
5. **Transmission logging**: Are all DR transmissions logged?

#### Step 4f: Physical Handling Assessment (if applicable)

1. **Physical marking**: Are physical DR documents marked on cover and every page?
2. **Secure storage**: Are physical DR documents stored in locked cabinets when not in use?
3. **Transport**: Are physical DR documents transported in opaque sealed envelopes via registered mail or secure courier?
4. **Printing**: Are DR documents printed only on approved, supervised printers?

#### Step 4g: Destruction Assessment

1. **Electronic media**: Is DR data destroyed using ANSSI-approved wiping or physical destruction?
2. **Paper**: Are paper DR documents destroyed by cross-cut shredding or incineration?
3. **Destruction logging**: Is destruction of DR documents recorded in the DR registry?

#### Step 4h: IS Compliance for DR Processing

Assess the IS against the II 901 requirements for systems processing DR:

- IS registered as DR-capable with FSSI
- IS homologated for DR (EBIOS study conducted)
- User sessions individually authenticated
- Session lock after maximum 15 minutes of inactivity
- Security patches applied within 30 days
- Security event logs retained minimum 1 year

### Step 5: Generate DR Assessment Document

**CRITICAL**: Use the **Write tool** to create the full DR assessment document.

1. **Detect version**: Check for existing `ARC-{PROJECT_ID}-DR-v*.md` files:
   - No existing file → VERSION="1.0"
   - Existing file → minor increment if refreshed

2. **Auto-populate Document Control**:
   - Document ID: `ARC-{PROJECT_ID}-DR-v{VERSION}`
   - Status: DRAFT
   - Created Date: {current_date}
   - Next Review Date: {current_date + 12 months}
   - Classification: DIFFUSION RESTREINTE (the DR assessment itself contains sensitive handling information)

3. Write the complete assessment following the template.

Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus **DR** per-type checks pass.

Write the document to:

```text
projects/{project_id}/ARC-{PROJECT_ID}-DR-v{VERSION}.md
```

### Step 6: Summary Output

```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ DR Handling Assessment Generated
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 Document: projects/{project_id}/ARC-{PROJECT_ID}-DR-v{VERSION}.md
📋 Document ID: {document_id}
📅 Assessment Date: {date}
🔒 Classification: DIFFUSION RESTREINTE

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 DR Assets and Compliance
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DR asset types identified: {N}
IS homologated for DR:     {Yes / No / Pending}
DR registry maintained:    {Yes / No}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚨 Compliance Gaps ({N} total)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔴 High ({N}): {key gaps — transmission, storage, homologation}
🟠 Medium ({N}):
🟡 Low ({N}):

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Next steps:
1. {If IS not homologated for DR: Run /arckit.fr-ebios for homologation study}
2. {If cloud storage of DR: Run /arckit.fr-secnumcloud for provider qualification}
3. Run /arckit.fr-anssi to assess IS security baseline against ANSSI 42 measures
4. Run /arckit.fr-pssi to incorporate DR handling rules into formal security policy
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Important Notes

- **DR is not a classification level**: DR is an administrative protection mention, not a formal classification under IGI 1300. Confidentiel Défense and higher require a separate defence security framework. This command does not cover IGI 1300 systems.
- **II 901 is the governing text for electronic DR**: The Instruction Interministérielle n°901/SGDSN/ANSSI governs electronic systems processing DR information. Always refer to the current version published by SGDSN/ANSSI.
- **FSSI is the DR authority**: The Fonctionnaire de Sécurité des Systèmes d'Information (FSSI) is the authoritative contact for DR handling in each ministry. Engage the FSSI before making decisions about DR system qualification.
- **IS homologation required**: An IS that processes DR information must be homologated by the RSSI or relevant authority. The homologation is based on an EBIOS risk analysis. Flag this if the IS is not yet homologated.
- **Cloud and DR**: Storing DR information in cloud requires ANSSI-approved infrastructure. Non-qualified providers (including major US hyperscalers) should not be used for DR without explicit ANSSI assessment.

## Key References

| Document | Publisher | URL |
|----------|-----------|-----|
| Diffusion Restreinte — guidance and governing instruction (II 901) | ANSSI / SGDSN | https://cyber.gouv.fr/la-mention-diffusion-restreinte |
| SGDSN (Secrétariat Général de la Défense et de la Sécurité Nationale) | SGDSN | https://www.sgdsn.gouv.fr/ |
| RGS v2.0 — IS homologation requirements | ANSSI | https://cyber.gouv.fr/referentiel-general-de-securite |
| ANSSI-approved encryption products (list) | ANSSI | https://cyber.gouv.fr/produits-services-et-organismes-qualifies |
| CERT-FR — security incident reporting | CERT-FR / ANSSI | https://www.cert.ssi.gouv.fr/ |

> **Note for reviewers**: The II 901/SGDSN/ANSSI instruction governing electronic DR systems is an interministerial instruction not publicly distributed in full. The ANSSI page above provides the publicly accessible guidance. DR is an administrative protection mention, distinct from the IGI 1300 formal classification scheme (Confidentiel Défense and above), which is managed by SGDSN and is outside the scope of this command.

## Success Criteria

- ✅ Assessment document created at `projects/{project_id}/ARC-{PROJECT_ID}-DR-v{VERSION}.md`
- ✅ DR assets identified and inventory completed
- ✅ Scope clearly bounded (DR only, IGI 1300 out of scope stated)
- ✅ Electronic marking and labelling compliance assessed
- ✅ Access control and need-to-know compliance assessed
- ✅ Electronic storage compliance assessed (encryption, qualification, logging)
- ✅ Electronic transmission compliance assessed (approved channels, no unencrypted internet)
- ✅ Physical handling assessed if applicable
- ✅ Destruction procedures assessed
- ✅ IS homologation status for DR processing noted
- ✅ Document classified DIFFUSION RESTREINTE
- ✅ DR per-type quality checks passed

## Example Usage

```text
/arckit.fr-dr Assess DR handling for a French ministry internal audit IS — produces internal reports, security assessments, and audit findings that should carry DR, 150 users across 3 sites

/arckit.fr-dr DR compliance for 001 — interministerial coordination platform handling sensitive policy documents, cloud-hosted on OVHcloud, integration with RIE

/arckit.fr-dr DR assessment for a préfecture IS processing sensitive administrative correspondence and security incident reports
```
