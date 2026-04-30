# ANSSI Information System Cartography

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit.fr-anssi-carto`
>
> ⚠️ **Community-contributed** — not yet validated against current ANSSI/CNIL/EU regulatory text. Verify all citations before relying on output.

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time to _partials/document-control-uk.md or _partials/document-control-uae.md based on plugin userConfig classification_scheme + governance_framework. See _partials/RENDERING.md (when present). -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit.fr-anssi-carto` | [PENDING] | [PENDING] |

## Cartography Summary

| Level | View | Components Identified | Sensitive Flows |
|-------|------|-----------------------|-----------------|
| Level 1 | Business (Métier) | [N processes, N data assets] | [N] |
| Level 2 | Application (Applicatif) | [N applications, N services] | [N] |
| Level 3 | System/Infrastructure | [N servers, N databases, N devices] | [N] |
| Level 4 | Network (Réseau) | [N segments, N interconnections] | [N] |

| Attack Surface Summary | Count |
|----------------------|-------|
| Internet-exposed entry points | [N] |
| Privileged administration interfaces | [N] |
| Third-party interconnections | [N] |
| Unencrypted sensitive flows | [N] |

---

## Cartography Methodology

This cartography follows the ANSSI guide "Cartographie du système d'information" (2021), which defines four reading levels to represent an information system at increasing levels of technical detail. Each level answers a different question for security analysis:

| Level | Question answered | Audience |
|-------|-------------------|---------|
| Level 1 — Business | What business processes and data does the system support? | RSSI, management |
| Level 2 — Application | Which applications and services implement those processes? | Architects, RSSI |
| Level 3 — System | Which physical/virtual systems host those applications? | System administrators |
| Level 4 — Network | How are those systems interconnected and with the outside? | Network administrators |

---

## Level 1 — Business View (Vue Métier)

The business view identifies the essential values — the processes, information assets, and services that matter to the organisation.

### 1.1 Business Processes

| ID | Process | Description | Criticality | Data Classification |
|----|---------|-------------|-------------|---------------------|
| P-01 | [Process name] | [Description] | [Critical / Important / Standard] | [Classification level] |
| P-02 | [Process name] | [Description] | | |

### 1.2 Essential Information Assets (Valeurs Métier)

| ID | Asset | Type | Owner | Criticality |
|----|-------|------|-------|-------------|
| VM-01 | [Asset name] | [Data / Service / Process] | [Owner] | [Critical / Important / Standard] |
| VM-02 | [Asset name] | | | |

### 1.3 External Actors and Trusted Relationships

| Actor | Type | Relationship | Trust Level |
|-------|------|--------------|-------------|
| [External organisation] | [Partner / Provider / Regulator / User] | [Nature of interaction] | [High / Medium / Low] |

---

## Level 2 — Application View (Vue Applicative)

The application view maps business processes to applications, services, and data flows between them.

### 2.1 Application Inventory

| ID | Application | Purpose | Business Process | Criticality | Hosting |
|----|------------|---------|-----------------|-------------|---------|
| APP-01 | [Name] | [Description] | [P-xx] | [Critical / Important / Standard] | [Cloud / On-prem / SaaS] |
| APP-02 | [Name] | | | | |

### 2.2 Application Interdependencies

| Source | Destination | Flow Type | Protocol | Data Classification | Authentication |
|--------|-------------|-----------|----------|---------------------|----------------|
| APP-01 | APP-02 | [Synchronous API / Async / File transfer] | [HTTPS / SFTP / etc.] | [Level] | [mTLS / OAuth2 / None] |

### 2.3 External Services and SaaS

| Service | Provider | Category | Data Shared | Contract Reference |
|---------|---------|---------|-------------|-------------------|
| [Service name] | [Provider] | [Identity / Email / Storage / Analytics] | [Data types] | [Contract ID] |

---

## Level 3 — System / Infrastructure View (Vue Système)

The system view maps applications to physical or virtual infrastructure components.

### 3.1 Server Inventory

| ID | Hostname / Role | OS | Hosted Applications | Environment | Location | Criticality |
|----|----------------|----|---------------------|-------------|---------|-------------|
| SRV-01 | [Hostname] | [OS] | [APP-xx] | [Prod / Staging / Dev] | [DC / AZ / Region] | [Critical / Standard] |

### 3.2 Database Inventory

| ID | Database | DBMS | Data Owner | Classification | Encryption at Rest |
|----|---------|------|------------|----------------|-------------------|
| DB-01 | [Name] | [PostgreSQL / MySQL / etc.] | [Owner] | [Level] | [Yes / No] |

### 3.3 Active Directory and Identity Infrastructure

| Component | Role | Criticality | Admin Access Control |
|-----------|------|-------------|---------------------|
| [AD domain / IdP / PAM] | [Description] | [Critical] | [Description] |

### 3.4 Sensitive Equipment

| Equipment | Type | Purpose | Physical Location | Admin Interface Exposed |
|-----------|------|---------|------------------|------------------------|
| [Firewall / Load balancer / HSM] | | | | [Yes (internal only) / No] |

---

## Level 4 — Network View (Vue Réseau)

The network view maps physical and logical network segments and interconnections.

### 4.1 Network Segments

| ID | Segment Name | VLAN / Range | Purpose | Security Zone | Systems |
|----|-------------|-------------|---------|---------------|---------|
| NET-01 | [Name] | [10.x.x.x/24] | [Production / DMZ / Admin / Dev] | [Internet-facing / Internal / Restricted] | [SRV-xx list] |

### 4.2 External Interconnections

| ID | Interconnection | Remote Party | Protocol | Encryption | Authentication | Direction |
|----|----------------|-------------|---------|-----------|----------------|-----------|
| INT-01 | [Name] | [Partner / Provider] | [MPLS / VPN / Internet] | [Yes / No] | [Certificate / PSK] | [In / Out / Both] |

### 4.3 Internet Entry Points

| Entry Point | Type | Protection | Exposed Services |
|-------------|------|-----------|-----------------|
| [IP / Domain] | [Website / API / VPN / Email] | [WAF / DDoS / Firewall rules] | [Port / service list] |

### 4.4 Administration Channels

| Administration Path | Access Method | MFA | Logging | Restricted to |
|--------------------|---------------|-----|---------|--------------|
| [Jump host / Bastion / Direct SSH] | [SSH / RDP / Web console] | [Yes / No] | [Yes / No] | [IP range / Role] |

---

## 5. Sensitive Flows Analysis

Sensitive flows are data flows that cross trust boundaries, carry classified data, or represent privileged access paths.

| Flow ID | Source | Destination | Data | Classification | Encrypted | Risk |
|---------|--------|-------------|------|----------------|-----------|------|
| FL-01 | [Component] | [Component] | [Data type] | [Level] | [Yes / No] | [High / Medium / Low] |

---

## 6. Attack Surface Summary

| Attack Vector | Entry Point | Protection in Place | Residual Exposure |
|--------------|-------------|--------------------|--------------------|
| External web | [URL / IP] | [WAF, CDN, firewall] | [Low / Medium / High] |
| VPN / remote access | [VPN endpoint] | [MFA, certificate] | |
| Third-party interconnections | [INT-xx] | [Encryption, auth] | |
| Supply chain (SaaS) | [Service] | [Contract, access control] | |
| Physical | [DC / Office] | [Badge, CCTV] | |

---

## 7. Recommendations

| Priority | Finding | Recommendation | Owner | Target Date |
|---------|---------|----------------|-------|-------------|
| 🔴 High | [e.g. Admin interface exposed to internet] | [Restrict to bastion host only] | [Role] | [Date] |
| 🟠 Medium | | | | |
| 🟡 Low | | | | |

---

**Generated by**: ArcKit `/arckit.fr-anssi-carto` command
**Generated on**: [YYYY-MM-DD]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
