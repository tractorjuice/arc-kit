# Information System Security Policy (PSSI)

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit.fr-pssi`
>
> ⚠️ **Community-contributed** — not yet validated against current ANSSI/CNIL/EU regulatory text. Verify all citations before relying on output.

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time to _partials/document-control-uk.md or _partials/document-control-uae.md based on plugin userConfig classification_scheme + governance_framework. See _partials/RENDERING.md (when present). -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit.fr-pssi` | [PENDING] | [PENDING] |

---

## Foreword

[Signed statement from the highest authority endorsing the PSSI — typically the Minister, Secretary General, or Director General. Explains why information system security is a strategic priority for the organisation and commits to providing the necessary resources.]

---

## 1. Purpose and Scope

### 1.1 Purpose

This Information System Security Policy (PSSI) defines the security objectives, principles, and organisational framework for protecting the information systems of [ORGANISATION NAME]. It constitutes the reference document for all security measures and serves as the basis for the security plans of all projects and systems within scope.

This PSSI is established in accordance with:

- The Référentiel Général de Sécurité (RGS v2.0), published by ANSSI
- Circulaire du Premier Ministre n°5926/SG on information systems security
- [Any sector-specific obligations — OIV arrêté sectoriel, OSE designation, etc.]

### 1.2 Scope

| Element | In Scope | Out of Scope |
|---------|---------|--------------|
| Information systems | [List IS covered] | [List IS explicitly excluded] |
| Sites and locations | [Sites covered] | [Sites excluded] |
| Users | [All staff / specific categories] | [External parties under their own PSSI] |
| Partner systems | [Interconnected systems assessed via EBIOS] | [Partner-owned systems not connected] |

### 1.3 Relationship with Other Documents

| Document | Relationship |
|----------|-------------|
| EBIOS Risk Manager study | Provides the threat and risk analysis that this PSSI addresses |
| System-specific security plans (PSSI-S) | Implement this PSSI at the level of individual systems |
| ANSSI hygiene guide (42 measures) | Baseline measures referenced in Section 6 |
| Incident response plan | Operational procedure referenced in Section 8 |

---

## 2. Security Context

### 2.1 Organisation Profile

| Field | Value |
|-------|-------|
| Organisation name | [Name] |
| Organisation type | [Ministry / Agency / Public institution / Local authority] |
| Sector | [Health / Finance / Transport / Education / Other] |
| OIV / OSE designation | [OIV — sector: X / OSE — sector: X / Not designated] |
| RGS target level | [* / ** / *** — or N/A] |
| Data classification | [Unclassified / DR / Mixed] |
| Number of users | [Approximate] |
| Number of information systems | [Approximate] |

### 2.2 Essential Values

The following assets are the primary objects of protection for this organisation:

| Asset | Type | Criticality | Owner |
|-------|------|-------------|-------|
| [e.g. Citizen personal data] | Data | Critical | [DPO] |
| [e.g. Core mission application] | Service | Critical | [IS Director] |
| [e.g. Payment processing] | Process | Critical | [Finance Director] |

### 2.3 Main Threats

Based on the EBIOS Risk Manager study [reference document], the main threats identified are:

| Threat | Source | Potential Impact |
|--------|--------|-----------------|
| [e.g. Ransomware attack] | Cybercriminals | Availability, data confidentiality |
| [e.g. Data exfiltration] | Nation-state actors | Confidentiality of sensitive data |
| [e.g. Insider threat] | Malicious or negligent staff | Integrity, availability |

---

## 3. Security Objectives

### 3.1 Security Principles

This PSSI is founded on the following principles:

| # | Principle | Description |
|---|-----------|------------|
| P-01 | Need-to-know | Access to information is granted only when there is a demonstrated operational need |
| P-02 | Least privilege | Users and systems operate with the minimum privileges required for their function |
| P-03 | Defence in depth | Security controls are layered — no single control is relied upon exclusively |
| P-04 | Separation of duties | Critical functions require involvement of multiple independent actors |
| P-05 | Traceability | All access to sensitive information is logged and attributable to an individual |
| P-06 | Proportionality | Security measures are proportionate to the value of assets and level of risk |
| P-07 | Continuity | Security measures are designed to maintain mission continuity under degraded conditions |
| P-08 | Resilience | Systems are designed to detect, resist, and recover from security incidents |

### 3.2 Security Objectives by Property

| Security Property | Objective | RGS Level |
|------------------|-----------|-----------|
| Confidentiality | Ensure that information is accessible only to authorised persons | [★ / ★★ / ★★★] |
| Integrity | Ensure that information is accurate and has not been tampered with | [★ / ★★ / ★★★] |
| Availability | Ensure that information systems are available when needed | [★ / ★★ / ★★★] |
| Traceability | Ensure that all operations on information can be traced and attributed | [★ / ★★ / ★★★] |
| Authentication | Ensure that the identity of users and systems is verified | [★ / ★★ / ★★★] |

---

## 4. Organisational Structure

### 4.1 Roles and Responsibilities

| Role | Title | Responsibilities |
|------|-------|----------------|
| Highest Authority (AA) | [Minister / DG / Secretary General] | Approves PSSI, accepts residual risks, grants homologation |
| RSSI | Responsable de la Sécurité des SI | Defines and monitors security policy; reports to AA |
| FSSI | Fonctionnaire de Sécurité des SI | Handles classified and DR information security |
| CSSI | Correspondant SSI | IS security point of contact at operational level |
| DPO | Data Protection Officer | Data protection compliance, GDPR / CNIL obligations |
| IS Director | DSI / DNUM | Implements security measures in information systems |
| Data owners | [Department heads] | Define sensitivity of their data assets |
| Users | All staff | Comply with PSSI; report security incidents |

### 4.2 Security Committee

| Committee | Frequency | Attendees | Purpose |
|-----------|-----------|-----------|---------|
| Security Steering Committee | Quarterly | AA, RSSI, DSI | Review security posture, validate budget |
| RSSI Operational Committee | Monthly | RSSI, CSSI, DSI teams | Review incidents, vulnerabilities, measure progress |
| Homologation Board | On demand | AA, RSSI, system owner | Review and grant system homologation |

---

## 5. Applicable Standards and References

| Standard / Guide | Applicability | Status |
|-----------------|--------------|--------|
| RGS v2.0 (ANSSI) | Mandatory for public IS | [Target level stated] |
| Guide d'hygiène informatique ANSSI (42 measures) | Strongly recommended | [Compliance level — see ANSSI assessment] |
| EBIOS Risk Manager | Risk analysis methodology | [Study reference] |
| ISO 27001 / 27002 | International reference (optional) | [Certified / Applied / Not applied] |
| [Sectoral arrêté (OIV)] | Mandatory if OIV | [Applicable sector] |
| NIS2 / French transposition | Mandatory if OSE | [Status] |
| RGPD / CNIL guidance | Mandatory | [CNIL assessment reference] |

---

## 6. Security Domains

### 6.1 Access Management and Authentication

- All access to information systems requires individual authentication
- Administrative accounts use multi-factor authentication
- Privileged access is managed through a Privileged Access Management (PAM) solution
- Access rights are reviewed at least annually and on role change
- RGS target level for authentication: [★ / ★★ / ★★★]

### 6.2 Network Security

- Network segmentation separates production, administration, and user zones
- Inbound and outbound traffic filtered at network perimeter
- Remote access only via approved VPN with strong authentication
- Administration interfaces not exposed to the internet

### 6.3 Workstation and Endpoint Security

- All workstations managed and configured against an approved baseline
- Endpoint detection and response (EDR) deployed on all workstations
- Full-disk encryption on all laptops
- Software installation restricted to approved applications

### 6.4 Application Security

- Applications developed following ANSSI secure development guidelines
- Third-party applications approved before deployment
- Patch management: critical patches applied within [30 days]; medium within [90 days]
- Web applications protected by WAF where internet-exposed

### 6.5 Data Protection

- Data classified and handled according to sensitivity (public / internal / confidential / DR)
- Sensitive data encrypted at rest and in transit
- Data minimisation applied — only data necessary for the purpose is collected
- Personal data subject to CNIL / GDPR requirements (see CNIL assessment [reference])

### 6.6 Physical Security

- Server rooms and data centres access controlled by badge
- Screen lock activated after [15 minutes] of inactivity
- Clear desk policy — sensitive documents secured when not in use
- Visitor access to secure areas supervised and logged

### 6.7 Business Continuity and Recovery

- Business continuity plan (PCA) defined for critical systems
- Recovery time objective (RTO): [X hours] for critical systems
- Recovery point objective (RPO): [X hours] for critical systems
- Backup and recovery tests conducted at least annually

### 6.8 Vulnerability Management and Updates

- Vulnerability scanning performed at least monthly on internet-exposed systems
- CERT-FR advisories monitored and acted upon within [timeframe]
- Penetration testing by PASSI-qualified provider at least every [2 years]

---

## 7. User Obligations

All users of the organisation's information systems must:

| Obligation | Detail |
|-----------|--------|
| Protect credentials | Never share passwords or authentication tokens |
| Report incidents | Report any suspected security incident to [contact] immediately |
| Follow acceptable use policy | Use IS only for professional purposes |
| Protect sensitive information | Not share DR or confidential information with unauthorised parties |
| Complete security training | Complete annual mandatory security awareness training |
| Device security | Lock screen when leaving workstation; not use unmanaged devices for work |

---

## 8. Security Incident Management

| Phase | Action | Responsible | Timeframe |
|-------|--------|-------------|-----------|
| Detection | Identify and confirm incident | All users / SOC | Immediate |
| Declaration | Report to RSSI via [channel] | Discoverer | Within 1 hour |
| Qualification | Assess severity and impact | RSSI + SOC | Within 4 hours |
| Containment | Isolate affected systems | DSI / SOC | As soon as qualified |
| Notification (NIS2 / ANSSI) | Notify ANSSI / CERT-FR if significant | RSSI | Within 24 hours |
| Eradication and recovery | Remove threat, restore service | DSI | Per RTO |
| Post-incident review | Root cause analysis, lessons learned | RSSI + DSI | Within 30 days |

---

## 9. PSSI Lifecycle

| Trigger | Action |
|---------|--------|
| Annual review | RSSI assesses PSSI against current threat landscape and updates if needed |
| Major architectural change | PSSI reviewed and updated if scope changes |
| Security incident of significance | Post-incident review may trigger PSSI update |
| New regulatory obligation | PSSI updated to reflect new requirements |
| Homologation renewal | PSSI reviewed as part of homologation dossier |

This PSSI is approved by the Highest Authority [NAME] on [DATE] and comes into force immediately.

---

**Generated by**: ArcKit `/arckit.fr-pssi` command
**Generated on**: [YYYY-MM-DD]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
