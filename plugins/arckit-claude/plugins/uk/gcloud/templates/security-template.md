# Security Evidence Document: [PROJECT_NAME]

> **Template Origin**: Official | **ArcKit Version**: [VERSION] | **Command**: `/arckit-uk-gcloud:security`

**G-Cloud Lot**: [Lot 1a — Infrastructure as a Service (IaaS) and Platform as a Service (PaaS) / Lot 1b — IaaS and PaaS above OFFICIAL / Lot 2a — Infrastructure Software as a Service (iSaaS) / Lot 2b — Software as a Service (SaaS) / Lot 3 — Cloud Support]

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time per _partials/RENDERING.md. -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [DATE] | ArcKit AI | Initial creation from `/arckit.[COMMAND]` command | [PENDING] | [PENDING] |

> G-Cloud 15 (RM1557.15) security answers and evidence for one service: the security sections of the lot's service questions, mapped to the NCSC cloud security principles, with the lot's certification requirements and an evidence register.
> Question wording is from GCA's (the Government Commercial Agency, formerly CCS) question export, and answer options are worded as the live G-Cloud 15 listings show them (scraped 7 October 2026); certification rules from Framework Schedule 1 (Specification) v2.1, Attachment 2 (How to tender) v5.0 and GCA's Updates to Tender Documents.
> Keep only the sections §1 marks for this lot. Delete the rest rather than marking them N/A.

## G-Cloud Details

| Field | Value |
|-------|-------|
| Service Name | [SERVICE_NAME] |
| Supplier | [SUPPLIER_NAME] |
| Framework | G-Cloud 15 (RM1557.15), Government Commercial Agency (GCA, formerly CCS) |
| Confirmed by | [NAME, ROLE] on [DATE] / [PENDING] |

---

## 1. Lot Security Profile

The security sections G-Cloud 15 asks for each lot, and the NCSC cloud security principle each one evidences.

| Section | 1a/1b | 2a/2b | 3 | NCSC principle |
|---------|:-----:|:-----:|:-:|----------------|
| 2.1 Data-in-transit protection | ✓ | ✓ | | 1 Data in transit protection |
| 2.2 Asset protection | ✓ | ✓ | | 2 Asset protection and resilience |
| 2.3 Availability and resilience | ✓ | ✓ | | 2 Asset protection and resilience |
| 2.4 Separation between users | ✓ | | | 3 Separation between customers |
| 2.5 Governance | ✓ | ✓ (adds the Software Security Code of Practice) | | 4 Governance framework |
| 2.6 Operational security | ✓ | ✓ | | 5 Operational security |
| 2.7 Staff security | ✓ (1b: SC or DV only) | ✓ | ✓ | 6 Personnel security |
| 2.8 Secure development | ✓ | ✓ | | 7 Secure development |
| 2.9 Identity and authentication | ✓ (adds management devices) | ✓ | | 9 Secure user management, 10 Identity and authentication, 12 Secure service administration |
| 2.10 Audit information for users | ✓ | ✓ | | 13 Audit information and alerting for customers |

Lot 3 answers only staff security among the service questions; its security assurance comes from staff screening and clearance, Cyber Essentials and the standards in §4.

These answers are published on the listing and must match the service's SDD (`ARC-[PROJECT_ID]-SDD-v*.md`) word for word.

---

## 2. Service Security Answers

*Answer with the options shown in brackets (separated by semicolons where an option itself contains "/"), worded as listings show them. Where the Digital Platform words one differently, `sdd.md` gives its wording in a comment beside the option. Every answer needs evidence in the register (§7), or `[PENDING]`.*

### 2.1 Data-in-Transit Protection
<!-- Lots 1a/1b and 2a/2b. NCSC principle 1. -->

| Question | Answer | Evidence |
|----------|--------|----------|
| **Data protection between buyer and supplier networks** | [Private network or public sector network / TLS (version 1.2 or above) / IPsec or TLS VPN gateway / Legacy SSL and TLS (under version 1.2) / Other] | [EVIDENCE] |
| **Other protection between networks** (if Other) | [DESCRIPTION] | |
| **Data protection within supplier network** | [TLS (version 1.2 or above) / IPsec or TLS VPN gateway / Legacy SSL and TLS (under version 1.2) / Other] | [EVIDENCE] |
| **Other protection within supplier network** (if Other) | [DESCRIPTION] | |

### 2.2 Asset Protection
<!-- Lots 1a/1b and 2a/2b. NCSC principle 2. On 2a/2b, data location, penetration testing and sanitisation are also scored lot award criteria (§6). -->

| Question | Answer | Evidence |
|----------|--------|----------|
| **Knowledge of data storage and processing locations** | Yes / No | |
| **Data storage and processing locations** | [United Kingdom / European Economic Area (EEA) / Other locations] | [EVIDENCE] |
| **User control over data storage and processing locations** | Yes / No | |
| **Datacentre security standards** | [Complies with a recognised standard (for example CSA CCM version 4.0); Supplier-defined controls; Managed by a third party] | [EVIDENCE] |
| **Penetration testing frequency** | [At least every 6 months / At least once a year / Less than once a year / Never] | [EVIDENCE] |
| **Penetration testing approach** | [‘IT Health Check’ performed by a CHECK service provider / NCSC approved service provider / ‘IT Health Check’ performed by a CREST-approved service provider / Another external penetration testing organisation / In-house] | [EVIDENCE] |
| **Protecting data at rest** | [Physical access control, complying with CSA CCM v4.0; Physical access control, complying with SSAE-18 / ISAE 3402; Physical access control, complying with another standard; Encryption of all physical media; Scale, obfuscating techniques, or data storage sharding; Other] | [EVIDENCE] |
| **Other data at rest protection approach** (if Other) | [DESCRIPTION] | |
| **Data sanitisation process** | Yes / No | |
| **Data sanitisation type** | [Deleted data can’t be directly accessed / Cryptographic Erasure; Data Erasure; Explicit overwriting of storage before reallocation / Secure Erase; Degaussing; Physical Destruction / Hardware containing data is completely destroyed] | [EVIDENCE] |
| **Equipment disposal approach** | [Complying with a recognised standard, for example CSA CCM v4.0, CAS (Sanitisation) or ISO/IEC 27001 / In-house destruction process / A third-party destruction service] | [EVIDENCE] |

### 2.3 Availability and Resilience
<!-- Lots 1a/1b and 2a/2b. NCSC principle 2. -->

**Guaranteed availability** (SLAs, and how users are refunded if they aren't met):

```text
[DESCRIPTION]
```

**Approach to resilience** (including the datacentre set-up; you may say details are available on request):

```text
[DESCRIPTION]
```

**Outage reporting** (public dashboard, API, email alerts):

```text
[DESCRIPTION]
```

### 2.4 Separation Between Users
<!-- Lots 1a/1b only. NCSC principle 3. -->

| Question | Answer | Evidence |
|----------|--------|----------|
| **Virtualisation technology used to keep applications and users sharing the same infrastructure apart** | Yes / No | |
| **Who implements virtualisation** | [Supplier / Third-party] | |
| **Virtualisation technologies used** | [VMware / Hyper-V / Citrix XenServer / Oracle VM / Red Hat Virtualisation / KVM hypervisor / Other] | |
| **Other virtualisation technology used** (if Other) | [DESCRIPTION] | |
| **Third-party virtualisation provider** (if Third-party) | [PROVIDER] | |

**How shared infrastructure is kept separate:**

```text
[DESCRIPTION]
```

### 2.5 Governance
<!-- Lots 1a/1b and 2a/2b. NCSC principle 4. -->

| Question | Answer | Evidence |
|----------|--------|----------|
| **Named board-level person responsible for service security** | Yes / No | [Name and role, internal] |
| **Software Security Code of Practice** (Lots 2a/2b only): does your organisation comply with its recommendations? | Yes / No | [Self-assessment against the code, dated] |
| **Security governance certified** | Yes / No | |
| **Security governance standards** (if certified) | [CSA CSM version 4.0 / ISO/IEC 27001 / Other] | [Certificate] |
| **Other security governance standards** (if Other) | [STANDARDS] | |
| **Security governance approach** (if not certified) | [DESCRIPTION] | |

**Information security policies and processes** (including the reporting structure and how you make sure policies are followed):

```text
[DESCRIPTION]
```

### 2.6 Operational Security
<!-- Lots 1a/1b and 2a/2b. NCSC principle 5. -->

| Question | Answer | Evidence |
|----------|--------|----------|
| **Configuration and change management standard** | [Complies with a recognised standard, for example CSA CCM v4.0 or SSAE-18 / ISAE 3402; Supplier-defined controls] | [EVIDENCE] |
| **Vulnerability management type** | [Complies with a recognised standard, for example CSA CCM v4.0 or SSAE-18 / ISAE 3402; Supplier-defined controls; Undisclosed] | [EVIDENCE] |
| **Protective monitoring type** | [Complies with a recognised standard, for example CSA CCM v4.0 or SSAE-18 / ISAE 3402; Supplier-defined controls; Undisclosed] | [EVIDENCE] |
| **Incident management type** | [Complies with a recognised standard, for example, CSA CCM v4.0 or ISO/IEC 27035:2011 or SSAE-18 / ISAE 3402; Supplier-defined controls; Undisclosed] | [EVIDENCE] |
| **Post-quantum cryptography secure**: are you compliant with NCSC guidance on post-quantum cryptography? | Yes / No | [Migration plan against NCSC's PQC migration timelines] |

**Configuration and change management approach** (how components are tracked through their lifetime; how changes are assessed for security impact):

```text
[DESCRIPTION]
```

**Vulnerability management approach** (how threats are assessed, how quickly patches are deployed, where threat information comes from):

```text
[DESCRIPTION]
```

**Protective monitoring approach** (how compromises are identified, how you respond, how quickly):

```text
[DESCRIPTION]
```

**Incident management approach** (pre-defined processes, how users report incidents, how incident reports are provided):

```text
[DESCRIPTION]
```

### 2.7 Staff Security
<!-- All lots. NCSC principle 6. On Lot 3, screening and clearance level are also scored lot award criteria (§6). -->

| Question | Answer | Evidence |
|----------|--------|----------|
| **Staff security clearance**: how do you manage staff security clearance checks? | [Conforms to BS7858:2019 / Other security clearance / Staff screening not performed] | [Screening policy; BS7858:2019 conformance evidence] |
| **Government security clearance**: if the role requires it, what level are you prepared to make sure your staff have? | [Developed Vetting (DV) / Security Clearance (SC) / Baseline Personnel Security Standard (BPSS) / None]. Lot 1b: DV or SC only | [Clearance register, internal] |

Clearances held now:

| Clearance | Staff holding it | Renewal |
|-----------|------------------|---------|
| BPSS | [X] | No fixed expiry: valid while the person stays with the employer that ran the check; a new employer re-runs it |
| CTC | [X] | [PROCESS] |
| SC | [X] | Reviewed at 10 years |
| DV | [X] | Reviewed at 7 years |
| eDV | [X] | [PROCESS] |

### 2.8 Secure Development
<!-- Lots 1a/1b and 2a/2b. NCSC principle 7. -->

| Question | Answer | Evidence |
|----------|--------|----------|
| **Approach to secure software development best practice** | [Independent review of processes (for example CESG CPA Build Standard, ISO/IEC 27034, ISO/IEC 27001 or CSA CCM v4.0) / Conforms to a recognised standard, but self-assessed / Supplier-defined process] | [EVIDENCE] |

### 2.9 Identity and Authentication
<!-- Lots 1a/1b and 2a/2b. NCSC principles 9, 10 and 12. -->

| Question | Answer | Evidence |
|----------|--------|----------|
| **User authentication needed** | Yes / No | |
| **User authentication** | [Multi-Factor Authentication (MFA) / Public key authentication (including by TLS client certificate) / Identity federation with existing provider (for example Google Apps) / Limited access network (for example PSN) / Dedicated link (for example VPN) / Username or password / Other] | [EVIDENCE] |
| **Other user authentication** (if Other) | [DESCRIPTION] | |
| **Access restriction testing frequency** | [At least every 6 months / At least once a year / Less than once a year / Never] | [EVIDENCE] |
| **Management access authentication** | [Same options as user authentication] | [EVIDENCE] |
| **Description of management access authentication** (if Other) | [DESCRIPTION] | |
| **Devices users manage the service through** (Lots 1a/1b only) | [Dedicated device on a segregated network (providers own provision) / Dedicated device on a government network (for example PSN) / Dedicated device over multiple services or networks / Any device but through a bastion host / Directly from any device which may also be used for normal business (for example web browsing or viewing external email)] | [EVIDENCE] |

**Access restrictions in management interfaces and support channels:**

```text
[DESCRIPTION]
```

### 2.10 Audit Information for Users
<!-- Lots 1a/1b and 2a/2b. NCSC principle 13. -->

| Question | Answer |
|----------|--------|
| **Access to user activity audit information** | [Users have access to real-time audit information / Users receive audit information on a regular basis / Users contact the support team to get audit information / You control when users can access audit information / No audit information available] |
| **How long user audit data is stored for** | [User-defined / At least 12 months / Between 6 months and 12 months / Between 1 month and 6 months / Less than 1 month] |
| **Access to supplier activity audit information** | [Same options as user activity] |
| **How long supplier audit data is stored for** | [Same options as user audit data] |
| **How long system logs are stored for** | [Same options as user audit data] |

---

## 3. NCSC Cloud Security Principles Coverage

| # | Principle | Where addressed | Status | Evidence |
|---|-----------|-----------------|--------|----------|
| 1 | Data in transit protection | §2.1 | [Evidenced / Partly evidenced / Gap / Not asked for this lot] | [REF] |
| 2 | Asset protection and resilience | §2.2, §2.3 | [STATUS] | [REF] |
| 3 | Separation between customers | §2.4 | [STATUS] | [REF] |
| 4 | Governance framework | §2.5 | [STATUS] | [REF] |
| 5 | Operational security | §2.6 | [STATUS] | [REF] |
| 6 | Personnel security | §2.7 | [STATUS] | [REF] |
| 7 | Secure development | §2.8 | [STATUS] | [REF] |
| 8 | Supply chain security | Not a service question. [ISO 28000:2022, Software Security Code of Practice, supplier assurance process] | [STATUS] | [REF] |
| 9 | Secure user management | §2.9 | [STATUS] | [REF] |
| 10 | Identity and authentication | §2.9 | [STATUS] | [REF] |
| 11 | External interface protection | Not a service question. [WAF, DDoS protection, API security] | [STATUS] | [REF] |
| 12 | Secure service administration | §2.9 (management access and devices) | [STATUS] | [REF] |
| 13 | Audit information and alerting for customers | §2.10 | [STATUS] | [REF] |
| 14 | Secure use of the service | Not a service question. [Shared responsibility model, secure configuration guidance] | [STATUS] | [REF] |

Principles not asked as service questions still matter: on Lots 1a/1b the lot questions ask you to confirm you adhere to NCSC guidance, including the cloud security principles, and buyers may check or test it.

**Supporting statements** (principles 8, 11 and 14, where relevant to this lot):

```text
[DESCRIPTION]
```

---

## 4. Certifications and Standards

### 4.1 Required for This Lot

| Standard | Required because | Held | Certificate number | Certification body | Covers this service | Issued | Expires |
|----------|------------------|------|--------------------|--------------------|---------------------|--------|---------|
| [STANDARD] | [RULE AND SOURCE] | Yes / No / Working towards | [NUMBER] | [BODY] | Yes / No / Partly | [DATE] | [DATE] |

<!-- Lots 1a/1b: ISO 9001, ISO/IEC 20000-1 and ISO/IEC 27001; and ISO 14001, ISO/IEC 27017 and, if the service is offered on public cloud, ISO/IEC 27018, unless you resell and rely on the cloud provider's accreditations; plus Cyber Essentials Plus (awarded in the last 12 months, or certified by the date of framework award, or an IASME-certified equivalent), mandatory for every call-off. Lots 2a/2b and 3: Cyber Essentials, mandatory for every call-off. Cyber Essentials and Cyber Essentials Plus are call-off requirements, not conditions of the bid: report a missing one as a call-off warning. -->

**Lot-specific commitments**

| Commitment | Lots | Status | Evidence |
|------------|------|--------|----------|
| Move to a post-quantum cryptography standard, following NCSC's migration timelines | 1a/1b | [STATUS] | [REF] |
| Meet the NCSC cloud security principles, the Security Policy Framework and the Government Security Classifications policy | 1a/1b | [STATUS] | [REF] |
| Adopt the FinOps FOCUS standard | 1a/1b, 2a/2b | [STATUS] | [REF] |
| Accredited secure facility under Facility Security Clearance policy, within 6 months of the framework start | 1b | [STATUS] | [REF] |
| Enough staff security cleared to an appropriate level; accept Security Aspects Letters; comply with UK embargo policies; apply NCSC supply chain security principles | 1b | [STATUS] | [REF] |
| Prepared to hold Cyber Essentials (or equivalent or higher) if a buyer requires it (scored award criterion) | 3 | [STATUS] | [REF] |

### 4.2 Other Standards Asked

| Standard | Held | Accredited by | Accreditation date | What it doesn't cover |
|----------|------|---------------|--------------------|-----------------------|
| ISO/IEC 27001 (Lots 2a/2b and 3 ask here) | Yes / No | [BODY] | [DATE] | [EXCLUSIONS] |
| ISO 28000:2022 (supply chain security) | Yes / No | [BODY] | [DATE] | [EXCLUSIONS] |
| ISO 9001 (2015 or later) (Lots 2a/2b and 3 ask here) | Yes / No | [BODY] | [DATE] | [EXCLUSIONS] |
| Quality management system (QMS) | Yes / No | | | |
| CSA STAR | [No / Level 1: CSA STAR Self-Assessment / Level 2: CSA STAR Attestation] | | [DATE] | [EXCLUSIONS] |
| PCI DSS | Yes / No | [BODY] | [DATE] | [EXCLUSIONS] |
| Cyber Essentials Plus (Lots 2a/2b and 3 ask here) | Yes / No / Working towards | [NUMBER] | [DATE] | |
| Other security certifications | [LIST / None] | | | |

### 4.3 Other Assurance (optional)

| Assurance | Held | Detail | Expires |
|-----------|------|--------|---------|
| SOC 2 Type II | Yes / No | [Report period, trust services criteria, exceptions] | [DATE] |
| ISO 22301 | Yes / No | [SCOPE] | [DATE] |
| NHS DSPT | Yes / No | [Status] | [DATE] |
| [OTHER] | | | |

---

## 5. Security Testing

| Field | Value |
|-------|-------|
| **Penetration testing frequency** | [As §2.2] |
| **Last test** | [DATE] |
| **Next scheduled** | [DATE] |
| **Tester** | [NAME] ([CHECK / CREST / other external / in-house]) |
| **Scope** | [DESCRIPTION] |
| **Access control testing frequency** | [As §2.9] |
| **Vulnerability scanning** | [Frequency, internal / external] |

**Remediation targets:**

| Severity | Target |
|----------|--------|
| Critical | [X] hours |
| High | [X] days |
| Medium | [X] days |
| Low | [X] days |

---

## 6. Lot Award Criteria Consistency
<!-- Lots 2a/2b and 3 only. The lot questions must give the same answers as the service questions. -->

| Award criterion (lot questions) | Answer in the LOTQ document (Part [2/3]) | Matching service answer here | Mark |
|---------------------------------|------------------------------------|------------------------------|------|
| [CRITERION] | [ANSWER] | [§ AND ANSWER] | [100 / 66 / 50 / 33 / 0] |

<!-- Lots 2a/2b: data storage and processing location (UK 100, EEA 66, other 33, not known 0); penetration testing (at least every 6 months 100, at least once a year 66, less than once a year 33, none 0); industry standard data sanitisation (yes 100, no 0). Lot 3: staff screening (BS7858:2019 100, not to BS7858 50, none 0); clearance level prepared to hold (DV 100, SC 66, BPSS 33, none 0); Cyber Essentials if a buyer requires it (yes 100, no 0). Each is weighted 2.5%. -->

---

## 7. Evidence Register

| # | Assertion | Evidence | Provide as | Location | Expiry | Status |
|---|-----------|----------|------------|----------|--------|--------|
| 1 | [ASSERTION] | [DOCUMENT] | [Upload / certificate number / link / on request / internal only] | [PATH OR URL] | [YYYY-MM] | [Current / Expiring / Expired / PENDING] |

**Provide:** certificates whose scope covers this service; Cyber Essentials certificate numbers; CSA STAR registry links; a PCI DSS Attestation of Compliance; a penetration test executive summary or letter of attestation, on request. Uploads must be ODF or PDF/A, at most 5 MB.

**Don't provide:** full audit reports, penetration test findings, vulnerability data, internal policy documents, staff names or clearance records, or unredacted contracts.

---

## 8. Items Requiring Attention

| # | Item | What is needed | Owner |
|---|------|----------------|-------|
| 1 | [ITEM] | [WHAT_IS_NEEDED] | [OWNER] |

## External References

> This section provides traceability from generated content back to source documents.
> Follow citation instructions in the project's citation reference guide.

### Document Register

| Doc ID | Filename | Type | Source Location | Description |
|--------|----------|------|-----------------|-------------|
| *None provided* | — | — | — | — |

### Citations

| Citation ID | Doc ID | Page/Section | Category | Quoted Passage |
|-------------|--------|--------------|----------|----------------|
| — | — | — | — | — |

### Unreferenced Documents

| Filename | Source Location | Reason |
|----------|-----------------|--------|
| — | — | — |

---

**Generated by**: ArcKit `/arckit:{command}` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
