# ASD Information Security Manual (ISM) Control Applicability Statement

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit:au-ism-controls`

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time per _partials/RENDERING.md. -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit:au-ism-controls` command | PENDING | PENDING |

---

## Executive Summary

[Two to three paragraphs: system under assessment, classification, ISM edition used, overall control applicability posture, key gaps, and IRAP / DISP cross-reference position.]

---

## System Context

| Field | Value |
|-------|-------|
| **System Name** | [System name] |
| **Classification** | [UNOFFICIAL / OFFICIAL / OFFICIAL:Sensitive / PROTECTED / SECRET] |
| **Deployment Model** | [Cloud (SaaS/PaaS/IaaS) / On-Premise / Hybrid] |
| **IRAP Assessment Status** | [Assessed (date) / In Progress / Not Required / Not Started] |
| **IRAP Scope** | [What's in scope / Cloud provider's IRAP boundary referenced] |
| **DISP Member** | [Yes (Level 1/2/3) / In Progress / No] |
| **ISM Edition Used** | [e.g., September 2026 — verification date] |
| **Sovereignty** | [All data in AU / Some offshore / Sovereign cloud] |
| **Assessment Date** | [YYYY-MM-DD] |
| **Assessor** | [Name and role] |

---

## Guideline Applicability Matrix

The ISM sets out cyber security principles and 23 cyber security guidelines. Each security control carries applicability markings — NC (non-classified), OS (OFFICIAL: Sensitive), P (PROTECTED), S (SECRET), TS (TOP SECRET) — and the controls marked for the system's *highest classification of processed information* apply. List all 23 guidelines; give a reason for each one that does not apply.

| ISM Guideline | Applies | Implementation | Notes |
|---------------|---------|----------------|-------|
| Cyber security roles | [Y/N] | [✅/⚠️/❌] | [Board, CISO and system owner responsibilities] |
| Cyber security incidents | [Y/N] | [✅/⚠️/❌] | [Cross-ref NDB playbook] |
| Procurement and outsourcing | [Y/N] | [✅/⚠️/❌] | [Supply chain; managed service and cloud service providers; IRAP inheritance] |
| Cyber security documentation | [Y/N] | [✅/⚠️/❌] | [SSP, incident response plan, continuous monitoring plan] |
| Physical security | [Y/N] | [✅/⚠️/❌] | [Cloud-only systems may inherit this in part] |
| Personnel security | [Y/N] | [✅/⚠️/❌] | [Awareness training, AI and web usage policies] |
| Communications infrastructure | [Y/N] | [✅/⚠️/❌] | [Cabling and emanation security; often inherited for pure cloud] |
| Communications systems | [Y/N] | [✅/⚠️/❌] | [Telephony, video conferencing, multifunction devices] |
| Enterprise mobility | [Y/N] | [✅/⚠️/❌] | [Mobile devices, remote access, overseas travel] |
| Evaluated products | [Y/N] | [✅/⚠️/❌] | [Evaluated product procurement and usage] |
| Information technology equipment | [Y/N] | [✅/⚠️/❌] | [Usage, repairs, sanitisation, disposal] |
| Media | [Y/N] | [✅/⚠️/❌] | [Usage, sanitisation, destruction, disposal] |
| System hardening | [Y/N] | [✅/⚠️/❌] | [Cross-ref E8] |
| System access | [Y/N] | [✅/⚠️/❌] | [Identity, MFA, privileged access, credentials] |
| System management | [Y/N] | [✅/⚠️/❌] | [Administration, patching, backups] |
| Security assurance | [Y/N] | [✅/⚠️/❌] | [Security monitoring, event logging, vulnerability assessment] |
| Software development | [Y/N] | [✅/⚠️/❌] | [Secure development, AI and web applications] |
| Database systems | [Y/N] | [✅/⚠️/❌] | [Database servers and databases] |
| Email | [Y/N] | [✅/⚠️/❌] | [Email usage, gateways and servers] |
| Networking | [Y/N] | [✅/⚠️/❌] | [Network design, wired and wireless, service continuity] |
| Cryptography | [Y/N] | [✅/⚠️/❌] | [ASD-approved algorithms and protocols, key management] |
| Gateways | [Y/N] | [✅/⚠️/❌] | [Gateways, CDS, firewalls, content filtering] |
| Data transfers | [Y/N] | [✅/⚠️/❌] | [Import and export between systems and domains] |

---

## Per-Guideline Control Applicability Assessment

### Guidelines for cyber security roles

| Aspect | Detail |
|--------|--------|
| **Applies** | [Yes] |
| **Implementation** | [✅ / ⚠️ / ❌] |
| **Applicable Controls** | [ISM control identifiers — e.g., ISM-0714, ISM-0027] |

**Evidence**: [Board or executive committee oversight, CISO appointment and reporting line, system owner accountability for each system, annual reporting of system security status]

**Gaps**: [Specific control IDs not implemented + gap description]

**Remediation**: [Actions, owners, target dates]

---

### Guidelines for cyber security incidents

| Aspect | Detail |
|--------|--------|
| **Applies** | [Yes] |
| **Implementation** | [✅ / ⚠️ / ❌] |
| **Applicable Controls** | [ISM control identifiers] |

**Evidence**: [Cyber security incident management policy and register, insider threat mitigation program, reporting to the CISO and to ASD, enacting the incident response plan, handling data spills, malicious code and intrusions, NDB playbook reference (`ARC-{P}-AUNDB-v*`)]

**Gaps**: [Specific control IDs not implemented + gap description]

**Remediation**: [Actions, owners, target dates]

---

### Guidelines for procurement and outsourcing

| Aspect | Detail |
|--------|--------|
| **Applies** | [Yes — MSP / cloud providers in scope] |
| **Implementation** | [✅ / ⚠️ / ❌ / Inherited from IRAP-assessed cloud service] |
| **Applicable Controls** | [ISM control identifiers] |
| **IRAP Cloud Provider Inheritance** | [Cloud service provider, IRAP assessment date and scope — cite the IRAP report, not marketing material] |

**Evidence**: [Cyber supply chain risk management, outsourced cloud service register, IRAP assessment of each outsourced cloud service provider, contractual security requirements with service providers, service-provider access restricted and independently logged]

**Gaps**: [Specific control IDs not implemented + gap description]

**Remediation**: [Actions, owners, target dates]

---

### Guidelines for cyber security documentation

| Aspect | Detail |
|--------|--------|
| **Applies** | [Yes] |
| **Implementation** | [✅ / ⚠️ / ❌] |
| **Applicable Controls** | [ISM control identifiers] |

**Evidence**: [Cyber security strategy; system security plan, cyber security incident response plan, change and configuration management plan, continuous monitoring plan, security assessment report, plan of action and milestones]

**Gaps**: [Specific control IDs not implemented + gap description]

**Remediation**: [Actions, owners, target dates]

---

### Guidelines for physical security

| Aspect | Detail |
|--------|--------|
| **Applies** | [Yes / Partial — cloud-only systems may inherit from the cloud provider's IRAP assessment] |
| **Implementation** | [✅ / ⚠️ / ❌ / Inherited] |
| **Applicable Controls** | [ISM control identifiers] |

**Evidence**: [Physical access to systems, servers, network devices and cryptographic equipment; securing IT equipment and media; inherited facility controls]

**Gaps**: [Specific control IDs not implemented + gap description]

**Remediation**: [Actions, owners, target dates]

---

### Guidelines for personnel security

| Aspect | Detail |
|--------|--------|
| **Applies** | [Yes] |
| **Implementation** | [✅ / ⚠️ / ❌] |
| **Applicable Controls** | [ISM control identifiers] |

**Evidence**: [Cyber security awareness training, general-purpose AI and web usage policies, handling requests to change banking details or user accounts (synthetic impersonation), reporting suspicious contact via online services]

**Gaps**: [Specific control IDs not implemented + gap description]

**Remediation**: [Actions, owners, target dates]

---

### Guidelines for communications infrastructure

| Aspect | Detail |
|--------|--------|
| **Applies** | [Often N/A or inherited for pure-cloud systems] |
| **Implementation** | [✅ / ⚠️ / ❌ / Inherited / N/A] |
| **Applicable Controls** | [ISM control identifiers] |

**Evidence**: [Cabling infrastructure and emanation security for owned facilities; for pure-cloud systems, the inherited position from the cloud provider's IRAP assessment]

**Gaps**: [Specific control IDs not implemented + gap description]

**Remediation**: [Actions, owners, target dates]

---

### Guidelines for communications systems

| Aspect | Detail |
|--------|--------|
| **Applies** | [Yes if telephony, video conferencing, IP telephony, MFDs or fax are in scope] |
| **Implementation** | [✅ / ⚠️ / ❌ / N/A] |
| **Applicable Controls** | [ISM control identifiers] |

**Evidence**: [Telephone systems, video conferencing and IP telephony, multifunction devices, fax machines and services]

**Gaps**: [Specific control IDs not implemented + gap description]

**Remediation**: [Actions, owners, target dates]

---

### Guidelines for enterprise mobility

| Aspect | Detail |
|--------|--------|
| **Applies** | [Yes if mobile devices or remote working are supported] |
| **Implementation** | [✅ / ⚠️ / ❌] |
| **Applicable Controls** | [ISM control identifiers] |

**Evidence**: [Mobile device management, approved mobile platforms, privately owned device policy, encrypted storage and communications, travelling overseas with mobile devices]

**Gaps**: [Specific control IDs not implemented + gap description]

**Remediation**: [Actions, owners, target dates]

---

### Guidelines for evaluated products

| Aspect | Detail |
|--------|--------|
| **Applies** | [Yes if evaluated products are required or in use] |
| **Implementation** | [✅ / ⚠️ / ❌ / N/A] |
| **Applicable Controls** | [ISM control identifiers] |

**Evidence**: [Evaluated product selection and delivery, use of evaluated products in their evaluated configuration]

**Gaps**: [Specific control IDs not implemented + gap description]

**Remediation**: [Actions, owners, target dates]

---

### Guidelines for information technology equipment

| Aspect | Detail |
|--------|--------|
| **Applies** | [Yes for the endpoint and server estate] |
| **Implementation** | [✅ / ⚠️ / ❌ / Inherited] |
| **Applicable Controls** | [ISM control identifiers] |

**Evidence**: [IT equipment management policy and registers, labelling and classification, maintenance and repairs, sanitisation, destruction and disposal]

**Gaps**: [Specific control IDs not implemented + gap description]

**Remediation**: [Actions, owners, target dates]

---

### Guidelines for media

| Aspect | Detail |
|--------|--------|
| **Applies** | [Yes if removable or fixed media are in scope] |
| **Implementation** | [✅ / ⚠️ / ❌ / Inherited] |
| **Applicable Controls** | [ISM control identifiers] |

**Evidence**: [Media management and removable media policies, removable media register, media sanitisation, destruction and disposal]

**Gaps**: [Specific control IDs not implemented + gap description]

**Remediation**: [Actions, owners, target dates]

---

### Guidelines for system hardening

| Aspect | Detail |
|--------|--------|
| **Applies** | [Yes] |
| **Implementation** | [✅ / ⚠️ / ❌] |
| **Applicable Controls** | [ISM control identifiers] |
| **E8 Cross-Reference** | [ARC-{P}-AUE8-v*] |

**Evidence**: [Operating system, user application, server application and virtualisation hardening, including application control and AI application configuration — **defer to the E8 posture artefact for E8-mapped controls**]

**Gaps**: [Specific control IDs not implemented + gap description]

**Remediation**: [Actions, owners, target dates]

---

### Guidelines for system access

| Aspect | Detail |
|--------|--------|
| **Applies** | [Yes] |
| **Implementation** | [✅ / ⚠️ / ❌] |
| **Applicable Controls** | [ISM control identifiers] |
| **E8 Cross-Reference** | [ARC-{P}-AUE8-v* — multi-factor authentication, restrict administrative privileges] |

**Evidence**: [Identity and access management, multi-factor authentication, privileged access, AI agent identities and register, credential management]

**Gaps**: [Specific control IDs not implemented + gap description]

**Remediation**: [Actions, owners, target dates]

---

### Guidelines for system management

| Aspect | Detail |
|--------|--------|
| **Applies** | [Yes] |
| **Implementation** | [✅ / ⚠️ / ❌] |
| **Applicable Controls** | [ISM control identifiers] |
| **E8 Cross-Reference** | [ARC-{P}-AUE8-v* — patching, restrict administrative privileges, regular backups] |

**Evidence**: [System administration and separate privileged operating environments, patch management and cessation of support, data backup and restoration]

**Gaps**: [Specific control IDs not implemented + gap description]

**Remediation**: [Actions, owners, target dates]

---

### Guidelines for security assurance

| Aspect | Detail |
|--------|--------|
| **Applies** | [Yes] |
| **Implementation** | [✅ / ⚠️ / ❌] |
| **Applicable Controls** | [ISM control identifiers] |

**Evidence**: [Security monitoring policy, centralised event logging, event log monitoring and threat hunting, event log retention (searchable for at least 12 months, then per NAA AFDA Express), vulnerability scanning, vulnerability assessments and penetration tests]

**Gaps**: [Specific control IDs not implemented + gap description]

**Remediation**: [Actions, owners, target dates]

---

### Guidelines for software development

| Aspect | Detail |
|--------|--------|
| **Applies** | [Yes if the project develops or customises software] |
| **Implementation** | [✅ / ⚠️ / ❌ / N/A] |
| **Applicable Controls** | [ISM control identifiers] |

**Evidence**: [Secure software development, software bill of materials, build provenance, security testing, AI application development (model poisoning, excessive agency, prompt injection), web application development]

**Gaps**: [Specific control IDs not implemented + gap description]

**Remediation**: [Actions, owners, target dates]

---

### Guidelines for database systems

| Aspect | Detail |
|--------|--------|
| **Applies** | [Yes if the system includes databases] |
| **Implementation** | [✅ / ⚠️ / ❌ / Inherited] |
| **Applicable Controls** | [ISM control identifiers] |

**Evidence**: [Database register, protecting databases and their contents, separation of database servers from web servers, segregation of development, testing, staging and production, database event logging]

**Gaps**: [Specific control IDs not implemented + gap description]

**Remediation**: [Actions, owners, target dates]

---

### Guidelines for email

| Aspect | Detail |
|--------|--------|
| **Applies** | [Yes if the system sends or receives email] |
| **Implementation** | [✅ / ⚠️ / ❌ / N/A] |
| **Applicable Controls** | [ISM control identifiers] |

**Evidence**: [Email usage policy and protective markings, centralised email gateways, SPF, DKIM and DMARC, transport encryption, email content filtering]

**Gaps**: [Specific control IDs not implemented + gap description]

**Remediation**: [Actions, owners, target dates]

---

### Guidelines for networking

| Aspect | Detail |
|--------|--------|
| **Applies** | [Yes] |
| **Implementation** | [✅ / ⚠️ / ❌ / Inherited] |
| **Applicable Controls** | [ISM control identifiers] |

**Evidence**: [Network documentation, segmentation and segregation, networked management interfaces, 802.1X and MACsec, wireless networks, service continuity for online services]

**Gaps**: [Specific control IDs not implemented + gap description]

**Remediation**: [Actions, owners, target dates]

---

### Guidelines for cryptography

| Aspect | Detail |
|--------|--------|
| **Applies** | [Yes for any encrypted data] |
| **Implementation** | [✅ / ⚠️ / ❌] |
| **Applicable Controls** | [ISM control identifiers] |

**Evidence**: [ASD-approved cryptographic algorithms and protocols in use, TLS, SSH and IPsec configuration, key management, transition to post-quantum cryptography]

**Gaps**: [Specific control IDs not implemented + gap description]

**Remediation**: [Actions, owners, target dates]

---

### Guidelines for gateways

| Aspect | Detail |
|--------|--------|
| **Applies** | [Yes for systems with an internet or cross-domain boundary] |
| **Implementation** | [✅ / ⚠️ / ❌ / Inherited] |
| **Applicable Controls** | [ISM control identifiers] |

**Evidence**: [Gateway architecture, cross domain solutions, firewalls and web application firewalls, web proxies and content filtering]

**Gaps**: [Specific control IDs not implemented + gap description]

**Remediation**: [Actions, owners, target dates]

---

### Guidelines for data transfers

| Aspect | Detail |
|--------|--------|
| **Applies** | [Yes if data moves between systems or security domains] |
| **Implementation** | [✅ / ⚠️ / ❌] |
| **Applicable Controls** | [ISM control identifiers] |

**Evidence**: [Data transfer processes and procedures, accountability for data transfers, authorising export, manual import and export, monitoring data import and export]

**Gaps**: [Specific control IDs not implemented + gap description]

**Remediation**: [Actions, owners, target dates]

---

## ISM-to-E8 Cross-Reference

The Essential Eight strategies map to the ISM controls ASD marks with an Essential Eight maturity level. ASD names the strategies; it does not number them.

| E8 Strategy | ISM Guideline(s) | ISM Topics |
|-------------|------------------|------------|
| Patch applications | System management; Security assurance | Mitigating known vulnerabilities, cessation of support; vulnerability scanning |
| Patch operating systems | System management; Security assurance; System hardening | Mitigating known vulnerabilities, cessation of support; vulnerability scanning; operating system releases and versions |
| Multi-factor authentication | System access | Multi-factor authentication |
| Restrict administrative privileges | System access; System management | Privileged access to systems, protecting credentials; separate privileged operating environments, administrative infrastructure |
| Application control | System hardening | Application control (operating system hardening) |
| Restrict Microsoft Office macros | System hardening | Office productivity suites (user application hardening) |
| User application hardening | System hardening | Web browsers, Office productivity suites, PDF applications, PowerShell, command shell |
| Regular backups | System management | Data backup and restoration |

At Maturity Levels Two and Three the strategies also require event logging and incident response, which sit in the ISM's Guidelines for security assurance (security monitoring) and Guidelines for cyber security incidents.

---

## Compliance Summary

| ISM Guideline | Applies | Status | Applicable Controls | Implemented | Gap Count |
|---------------|---------|--------|---------------------|-------------|-----------|
| Cyber security roles | [Y/N] | [✅/⚠️/❌] | [n] | [n] | [n] |
| Cyber security incidents | [Y/N] | [✅/⚠️/❌] | [n] | [n] | [n] |
| Procurement and outsourcing | [Y/N] | [✅/⚠️/❌] | [n] | [n] | [n] |
| Cyber security documentation | [Y/N] | [✅/⚠️/❌] | [n] | [n] | [n] |
| Physical security | [Y/N] | [✅/⚠️/❌] | [n] | [n] | [n] |
| Personnel security | [Y/N] | [✅/⚠️/❌] | [n] | [n] | [n] |
| Communications infrastructure | [Y/N] | [✅/⚠️/❌] | [n] | [n] | [n] |
| Communications systems | [Y/N] | [✅/⚠️/❌] | [n] | [n] | [n] |
| Enterprise mobility | [Y/N] | [✅/⚠️/❌] | [n] | [n] | [n] |
| Evaluated products | [Y/N] | [✅/⚠️/❌] | [n] | [n] | [n] |
| Information technology equipment | [Y/N] | [✅/⚠️/❌] | [n] | [n] | [n] |
| Media | [Y/N] | [✅/⚠️/❌] | [n] | [n] | [n] |
| System hardening | [Y/N] | [✅/⚠️/❌] | [n] | [n] | [n] |
| System access | [Y/N] | [✅/⚠️/❌] | [n] | [n] | [n] |
| System management | [Y/N] | [✅/⚠️/❌] | [n] | [n] | [n] |
| Security assurance | [Y/N] | [✅/⚠️/❌] | [n] | [n] | [n] |
| Software development | [Y/N] | [✅/⚠️/❌] | [n] | [n] | [n] |
| Database systems | [Y/N] | [✅/⚠️/❌] | [n] | [n] | [n] |
| Email | [Y/N] | [✅/⚠️/❌] | [n] | [n] | [n] |
| Networking | [Y/N] | [✅/⚠️/❌] | [n] | [n] | [n] |
| Cryptography | [Y/N] | [✅/⚠️/❌] | [n] | [n] | [n] |
| Gateways | [Y/N] | [✅/⚠️/❌] | [n] | [n] | [n] |
| Data transfers | [Y/N] | [✅/⚠️/❌] | [n] | [n] | [n] |

**Overall**: [n] Implemented / [n] Applicable = [n]% applicability score.

---

## IRAP Assessment Position

| Item | Detail |
|------|--------|
| **IRAP Assessment Status** | [Assessed (date) / In Progress / Not Required / Not Started] |
| **IRAP Scope** | [Description of system boundary assessed] |
| **Residual Risks Accepted** | [List residual risks accepted by Authorising Officer] |
| **Re-Assessment Cadence** | [Annual / On-major-change] |
| **Cloud Provider Inheritance** | [Microsoft Azure / AWS / GCP — IRAP scope citation] |

---

## Recommendations

### Quick Wins ( < 30 days)

| # | Recommendation | ISM Control(s) | ISM Guideline | Effort |
|---|---------------|----------------|---------------|--------|
| 1 | [Recommendation] | [Control IDs] | [Guideline] | [Low/Medium] |

### Short-Term (30–90 days)

| # | Recommendation | ISM Control(s) | ISM Guideline | Effort |
|---|---------------|----------------|---------------|--------|
| 1 | [Recommendation] | [Control IDs] | [Guideline] | [Medium/High] |

### Medium-Term (90–180 days)

| # | Recommendation | ISM Control(s) | ISM Guideline | Effort |
|---|---------------|----------------|---------------|--------|
| 1 | [Recommendation] | [Control IDs] | [Guideline] | [High] |

---

## ArcKit Evidence Integration

| Evidence Area | ArcKit Artefact | How It Supports ISM Applicability | Gap / Follow-up |
|---------------|-----------------|-----------------------------------|-----------------|
| Architecture boundaries | `/arckit:diagram` / ARC-*-DIAG-* | System boundaries, gateways, hosting, zones, inherited controls | [Gap / follow-up] |
| Data transfer evidence | `/arckit:dfd` / ARC-*-DFD-* | Data-transfer, gateway, integration, and cross-domain flow controls | [Gap / follow-up] |
| Classification evidence | `/arckit:data-model` / ARC-*-DATA-* | Classification, retention, owner, and information-handling control applicability | [Gap / follow-up] |
| Operational ownership | `/arckit:servicenow` / ARC-*-SNOW-* | ServiceNow/CMDB CIs, support groups, incident queues, change controls, dependencies | [Gap / follow-up] |
| Control risks | `/arckit:risk` / ARC-*-RISK-* | Residual ISM control gaps and treatment ownership | [Gap / follow-up] |
| Control traceability | `/arckit:traceability` / ARC-*-TRAC-* | ISM controls mapped to requirements, evidence, risks, PSPF, and DISP claims | [Gap / follow-up] |
| Coverage view | `/arckit:graph-report` | AUISM coverage across AU compliance, architecture, risk, and operations artefacts | [Gap / follow-up] |
| Capability uplift | `/arckit:maturity-model` / ARC-*-MMOD-* | ISM control maturity baseline and uplift roadmap | [Gap / follow-up] |

## External References

### Document Register

| Doc ID | Filename | Type | Source | Description |
|--------|----------|------|--------|-------------|
| ASDISM | ASD Information Security Manual | Standard | cyber.gov.au | Primary control framework — edition [DATE] |
| AUE8 | ARC-{P}-AUE8-v* | ArcKit Artefact | projects/ | E8 posture cross-reference (system hardening, system access, system management) |

### Citations

| Citation ID | Doc ID | Section | Category | Quoted Passage |
|-------------|--------|---------|----------|----------------|
| — | — | — | — | — |

### Unreferenced Documents

| Filename | Source Location | Reason |
|----------|-----------------|--------|
| — | — | — |

### Verification

| Standard | URL | Verification Date |
|----------|-----|-------------------|
| ASD Information Security Manual | https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/ism | [YYYY-MM-DD] |
| Protective Security Policy Framework | https://www.protectivesecurity.gov.au/ | [YYYY-MM-DD] |
| IRAP | https://www.cyber.gov.au/about-us/programs-and-services/irap | [YYYY-MM-DD] |

---

## Visual Evidence Decision Rule

Generate companion visual artefacts only when the available evidence includes enough structure to identify real nodes and relationships. If evidence is incomplete but structurally useful, create a clearly marked draft visual with `Pending Input` labels. If structural evidence is insufficient, do not create a diagram; record a Visual Evidence Gap and list the minimum inputs needed.

---

**Generated by**: ArcKit `/arckit:au-ism-controls` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
