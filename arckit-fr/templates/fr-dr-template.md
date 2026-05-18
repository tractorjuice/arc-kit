# Diffusion Restreinte Handling Assessment

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit.fr-dr`
>
> ⚠️ **Community-contributed** — not yet validated against current ANSSI/CNIL/EU regulatory text. Verify all citations before relying on output.

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time to _partials/document-control-uk.md or _partials/document-control-uae.md based on plugin userConfig classification_scheme + governance_framework. See _partials/RENDERING.md (when present). -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit.fr-dr` | [PENDING] | [PENDING] |

## Scope Statement

> **Important distinction**: This assessment covers the **Diffusion Restreinte (DR)** mention only. DR is an administrative protection mention governed by II 901/SGDSN/ANSSI for electronic systems. It is **not** a classification level under IGI 1300 (which covers Confidentiel Défense and above). Systems handling IGI 1300 classified information require a separate defence security framework beyond the scope of this assessment.

| Element | Value |
|---------|-------|
| System assessed | [System name and description] |
| DR assets identified | [N document types / data categories] |
| Production entity | [Ministry / Directorate / Agency] |
| Receiving entities | [List of authorised recipients] |
| Electronic systems in scope | [IS name(s) hosting DR documents] |

---

## 1. DR Asset Inventory

Identify all information assets produced, processed, or transmitted by the system that carry or should carry the DR mention.

| ID | Asset / Document Type | Origin | Volume (est.) | Current Classification | Should Be DR |
|----|----------------------|--------|--------------|----------------------|--------------|
| DR-DOC-01 | [e.g. Internal security reports] | [Directorate X] | [~N/month] | [Unclassified / DR] | [Yes / No] |
| DR-DOC-02 | [e.g. Audit findings] | | | | |

**DR marking criteria**: Apply DR when unauthorised disclosure would harm the interests of the French State or a third party, without reaching the level requiring formal classification under IGI 1300.

---

## 2. DR Marking and Labelling Rules

### 2.1 Electronic Documents

| Requirement | Rule | Status |
|-------------|------|--------|
| Header marking | "DIFFUSION RESTREINTE" centred at top of every page | ☐ |
| Footer marking | "DIFFUSION RESTREINTE" centred at bottom of every page | ☐ |
| Document metadata | DR mention in file properties / metadata | ☐ |
| Watermark | Diagonal "DIFFUSION RESTREINTE" watermark on each page | ☐ |
| Filename convention | File names must not reveal classified content | ☐ |
| Version control | DR documents versioned and registered in DR registry | ☐ |

### 2.2 DR Registry

| Requirement | Status | Gap |
|-------------|--------|-----|
| Central DR document registry maintained | ☐ | |
| Each DR document assigned a unique reference number | ☐ | |
| Copies tracked (who holds which copy) | ☐ | |
| Registry accessible only to authorised personnel | ☐ | |

---

## 3. Access Control

| Requirement | Rule | Status |
|-------------|------|--------|
| Need-to-know principle | Access granted only to personnel with a demonstrable need | ☐ |
| Individual authorisation | Explicit authorisation by the originating authority | ☐ |
| No third-party sharing without authorisation | DR cannot be shared with external parties without explicit approval | ☐ |
| Visitor and contractor access | DR documents not accessible to unauthorised visitors or contractors | ☐ |
| Access revocation on role change | DR access revoked promptly on departure or role change | ☐ |

### 3.1 Authorised Recipients

| Recipient Entity | Authorised Role | Access Granted By | Date | Review Date |
|-----------------|-----------------|-------------------|------|-------------|
| [Directorate / Unit] | [Role description] | [Authority] | | |

---

## 4. Electronic Storage Requirements

| Requirement | Rule | Status | Gap |
|-------------|------|--------|-----|
| Storage system qualification | DR must be stored on a system approved or qualified by ANSSI | ☐ | |
| Encryption at rest | DR data encrypted with ANSSI-approved solution (minimum AES-256) | ☐ | |
| Encryption key management | Keys managed separately from data, access restricted | ☐ | |
| Logical access control | DR storage area access controlled by individual authentication | ☐ | |
| Audit logging | All access to DR storage logged and retained minimum 1 year | ☐ | |
| Backup encryption | Backups of DR data encrypted to same standard | ☐ | |
| Cloud storage | Only on ANSSI-approved or SecNumCloud-qualified infrastructure | ☐ | |

---

## 5. Electronic Transmission Rules

| Requirement | Rule | Status | Gap |
|-------------|------|--------|-----|
| Approved transmission channels | DR transmitted only on approved networks (RIE, VPN ANSSI-approved, or equivalent) | ☐ | |
| No public internet | DR must not transit unencrypted public internet | ☐ | |
| Email restrictions | DR must not be sent via standard email without ANSSI-approved encryption | ☐ | |
| End-to-end encryption | Encryption applied before transmission, keys not shared with provider | ☐ | |
| Recipient verification | Recipient identity and authorisation verified before transmission | ☐ | |
| Transmission logging | All DR transmissions logged (sender, recipient, timestamp, document reference) | ☐ | |
| Mobile devices | DR not transmitted to or stored on unmanaged personal mobile devices | ☐ | |

### 5.1 Approved Transmission Channels

| Channel | Type | ANSSI Status | Authorised For DR |
|---------|------|-------------|------------------|
| RIE (Réseau Interministériel de l'État) | Government network | Approved | Yes |
| [VPN solution] | VPN | [ANSSI-qualified / Approved] | [Yes / No] |
| [Secure messaging platform] | Messaging | [Status] | [Yes / No] |
| Standard email (unencrypted) | Email | Not approved | No |
| Consumer cloud (Google Drive, etc.) | Cloud storage | Not approved | No |

---

## 6. Physical Handling Rules

| Requirement | Rule | Status |
|-------------|------|--------|
| Physical medium marking | All physical DR documents marked on cover and every page | ☐ |
| Secure storage | DR documents stored in locked cabinet when not in use | ☐ |
| Clear desk policy | DR documents not left unattended on desks | ☐ |
| Printing restrictions | DR documents printed only on approved, supervised printers | ☐ |
| Transport in sealed envelope | DR documents transported in opaque sealed envelopes marked DR | ☐ |
| Registered mail or secure courier | Physical DR transmitted by registered post or secure courier | ☐ |

---

## 7. Destruction Requirements

| Medium | Approved Method | Status |
|--------|----------------|--------|
| Paper documents | Cross-cut shredding (DIN 66399 P-4 or higher) or incineration | ☐ |
| Electronic storage media (HDD, SSD) | ANSSI-approved degaussing + physical destruction or certified wiping (DoD 5220.22-M or equivalent) | ☐ |
| USB drives / removable media | Physical destruction after ANSSI-approved wiping | ☐ |
| Optical media | Physical destruction (shredding) | ☐ |
| Destruction log | All DR destruction recorded in DR registry | ☐ |

---

## 8. Incident Reporting

| Incident Type | Reporting Obligation | Deadline | Contact |
|--------------|---------------------|---------|---------|
| DR document loss or theft | Report to FSSI and hierarchy | Immediately | [FSSI contact] |
| Unauthorised DR disclosure | Report to FSSI and SGDSN/ANSSI | Within 24 hours | [Contact] |
| Suspected compromise of DR system | Report to FSSI and ANSSI CERT-FR | Within 4 hours | cert@ssi.gouv.fr |
| Physical intrusion to DR storage area | Report to FSSI and security officer | Immediately | [Contact] |

---

## 9. System Compliance Checklist

### 9.1 Information System Requirements for DR Processing

| Requirement | Governing Text | Status | Gap |
|-------------|---------------|--------|-----|
| IS registered as DR-capable with FSSI | II 901 | ☐ | |
| IS homologated for DR data | RGS / EBIOS study | ☐ | |
| User accounts individual and authenticated | II 901 | ☐ | |
| Session lock after inactivity (max 15 min) | II 901 | ☐ | |
| Antivirus and endpoint protection active | II 901 | ☐ | |
| Security patches applied within 30 days | II 901 | ☐ | |
| Security event logs retained 1 year | II 901 | ☐ | |

### 9.2 Gap Summary

| Gap | Priority | Owner | Target Date |
|-----|---------|-------|-------------|
| [Gap description] | 🔴 High | [Role] | [Date] |

---

**Generated by**: ArcKit `/arckit.fr-dr` command
**Generated on**: [YYYY-MM-DD]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
