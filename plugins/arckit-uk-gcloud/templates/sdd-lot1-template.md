# Service Definition Document: [PROJECT_NAME]

> **Template Origin**: Official | **ArcKit Version**: [VERSION] | **Command**: `/arckit:sdd-lot1`

**G-Cloud Lot**: Lot 1 — Cloud Hosting (IaaS/PaaS)

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time to _partials/document-control-uk.md or _partials/document-control-uae.md based on plugin userConfig classification_scheme + governance_framework. See _partials/RENDERING.md (when present). -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [DATE] | ArcKit AI | Initial creation from `/arckit.[COMMAND]` command | [PENDING] | [PENDING] |

> G-Cloud 14 Framework - Service Definition Document
> Based on Crown Commercial Service official question structure

---

## 1. Service Summary

### 1.1 Service Name
<!-- Max 100 characters -->
```text
[SERVICE_NAME]
```

**Character count:** [X]/100

### 1.2 Service Description
<!-- Max 50 words, 500 characters. Summary of what the service is for. -->
```text
[DESCRIPTION]
```

**Word count:** [X]/50 | **Character count:** [X]/500

### 1.3 Service Features
<!-- Up to 10 features, each max 10 words, 100 characters -->
<!-- Include technical features like 'auto-scaling' or 'load balancing' -->

| # | Feature | Words | Chars |
|---|---------|-------|-------|
| 1 | [Feature 1] | [X]/10 | [X]/100 |
| 2 | [Feature 2] | [X]/10 | [X]/100 |
| 3 | [Feature 3] | [X]/10 | [X]/100 |
| 4 | [Feature 4] | [X]/10 | [X]/100 |
| 5 | [Feature 5] | [X]/10 | [X]/100 |
| 6 | [Feature 6] | [X]/10 | [X]/100 |
| 7 | [Feature 7] | [X]/10 | [X]/100 |
| 8 | [Feature 8] | [X]/10 | [X]/100 |
| 9 | [Feature 9] | [X]/10 | [X]/100 |
| 10 | [Feature 10] | [X]/10 | [X]/100 |

### 1.4 Service Benefits
<!-- Up to 10 benefits, each max 10 words, 100 characters -->

| # | Benefit | Words | Chars |
|---|---------|-------|-------|
| 1 | [Benefit 1] | [X]/10 | [X]/100 |
| 2 | [Benefit 2] | [X]/10 | [X]/100 |
| 3 | [Benefit 3] | [X]/10 | [X]/100 |
| 4 | [Benefit 4] | [X]/10 | [X]/100 |
| 5 | [Benefit 5] | [X]/10 | [X]/100 |
| 6 | [Benefit 6] | [X]/10 | [X]/100 |
| 7 | [Benefit 7] | [X]/10 | [X]/100 |
| 8 | [Benefit 8] | [X]/10 | [X]/100 |
| 9 | [Benefit 9] | [X]/10 | [X]/100 |
| 10 | [Benefit 10] | [X]/10 | [X]/100 |

### 1.5 Service Constraints
<!-- Max 100 words. Any limitations or constraints on the service. -->
```text
[CONSTRAINTS]
```

**Word count:** [X]/100

---

## 2. Service Categories
<!-- Select up to 10 categories from the official Lot 1 list -->

**Selected Categories:**

- [ ] Archiving, backup and disaster recovery
- [ ] Compute and application hosting
- [ ] Container service
- [ ] Content delivery network
- [ ] Data warehousing
- [ ] NoSQL database
- [ ] Relational database
- [ ] Other database services
- [ ] Distributed denial of service attack (DDOS) protection
- [ ] Firewall
- [ ] Infrastructure and platform security
- [ ] Intrusion detection
- [ ] Load balancing
- [ ] Logging and analysis
- [ ] Message queuing and processing
- [ ] Networking (including network as a service)
- [ ] Platform as a service (PaaS)
- [ ] Protective monitoring
- [ ] Search
- [ ] Block storage
- [ ] Object storage
- [ ] Other storage services

**Categories selected:** [X]/10

---

## 3. Pricing

### 3.1 Pricing Model

| Field | Value |
|-------|-------|
| **Minimum Price** | £[PRICE] |
| **Maximum Price** | £[PRICE] (if applicable) |
| **Pricing Unit** | [GB/Hour/Instance/vCPU/User/Unit] |
| **Billing Interval** | [Hour/Day/Month/Year] |

### 3.2 Education Pricing

**Education sector discount available:** Yes / No
**Details:** [DESCRIPTION]

### 3.3 Free Trial or Free Version

**Free trial available:** Yes / No
**Trial duration:** [X] days
**Free version available:** Yes / No
**Free version limitations:** [DESCRIPTION]

### 3.4 Pricing Document

**URL:** [PRICING_DOCUMENT_URL]

---

## 4. Technical

### 4.1 Virtualisation

**Uses virtualisation:** Yes / No

**Virtualisation technologies:**

- [ ] VMware
- [ ] Hyper-V
- [ ] Citrix XenServer
- [ ] Oracle VM
- [ ] Red Hat Virtualisation
- [ ] KVM hypervisor
- [ ] Other: [SPECIFY]

**Implemented by:**

- [ ] Supplier
- [ ] Third party provider: [NAME]

**Virtualisation separation approach:**
<!-- Max 200 words -->
```text
[DESCRIPTION]
```

### 4.2 API

**API Available:** Yes / No

**API Documentation available:** Yes / No
**API Documentation formats:**

- [ ] HTML
- [ ] PDF
- [ ] Open API/Swagger
- [ ] Other: [SPECIFY]

**API Sandbox/test environment:** Yes / No

**API Usage description:**
<!-- Max 200 words -->
```text
[DESCRIPTION]
```

**Automation tools supported:**

- [ ] Ansible
- [ ] Chef
- [ ] Puppet
- [ ] Terraform
- [ ] CloudFormation
- [ ] ARM Templates
- [ ] Other: [SPECIFY]

### 4.3 Command Line Interface

**CLI Available:** Yes / No

**Supported Operating Systems:**

- [ ] Linux
- [ ] Windows
- [ ] macOS

**CLI Usage description:**
<!-- Max 200 words -->
```text
[DESCRIPTION]
```

### 4.4 Web Interface

**Web Interface Available:** Yes / No

**Web interface accessibility (WCAG 2.1 AA):** Yes / No

**Accessibility description:**
<!-- Max 200 words -->
```text
[DESCRIPTION]
```

### 4.5 Service Interface (Management Console)

**Service interface available:** Yes / No

**Interface accessibility (WCAG 2.1 AA):** Yes / No

**Interface description:**
<!-- Max 200 words -->
```text
[DESCRIPTION]
```

### 4.6 Devices for Service Management

**Service can be managed through:**

- [ ] Dedicated device on a segregated network (e.g. MCN)
- [ ] Dedicated device on a government network (e.g. PSN)
- [ ] Dedicated device over multiple services or networks
- [ ] Any device but through a bastion host (jump server)
- [ ] Directly from any device which may also be used for normal business

---

## 5. Data

### 5.1 Data Storage and Processing Locations

**Know where data is stored/processed:** Yes / No

**Locations:**

- [ ] United Kingdom
- [ ] European Economic Area (EEA)
- [ ] USA - Privacy Shield certified
- [ ] USA - non Privacy Shield
- [ ] Other: [SPECIFY]

**User control over data location:** Yes / No
**Details:** [DESCRIPTION]

### 5.2 End of Contract - Data Extraction

**Data extraction provided:** Yes / No
**Format:** [FORMATS]
**Timeframe:** Within [X] days of contract end
**Cost:** Included / Additional fee: £[X]

**End of contract process:**
<!-- Max 200 words -->
```text
[DESCRIPTION]
```

### 5.3 Data Sanitisation

**Sanitisation process available:** Yes / No

**Sanitisation type (Hosting):**

- [ ] Explicit overwriting of storage before reallocation
- [ ] Deleted data can't be directly accessed
- [ ] Hardware containing data is completely destroyed

---

## 6. Security

### 6.1 Security Governance Standards

**Standards complied with:**

- [ ] ISO/IEC 27001
- [ ] CSA CCM version 3.0
- [ ] Other: [SPECIFY]

**Security governance approach:**
<!-- Max 100 words, 1000 characters -->
```text
[DESCRIPTION]
```

### 6.2 ISO/IEC 27001 Certification

**Current ISO/IEC 27001 certification:** Yes / No

| Field | Value |
|-------|-------|
| Certificate holder | [NAME] |
| Accreditation date | [DATE] |
| Scope exclusions | [EXCLUSIONS] |

### 6.3 ISO 28000 Certification (Supply Chain Security)

**ISO 28000 certified:** Yes / No
**Certificate holder:** [NAME]
**Expiry date:** [DATE]

### 6.4 CSA STAR Certification

**CSA STAR certified:** Yes / No
**Level:**

- [ ] Level 1 Self-Assessment
- [ ] Level 2 Attestation
- [ ] Level 3 Certification
- [ ] Level 4 C-STAR Assessment
- [ ] Level 5 Continuous Monitoring

**Expiry date:** [DATE]

### 6.5 PCI DSS Certification

**PCI DSS certified:** Yes / No
**Certificate holder:** [NAME]
**Expiry date:** [DATE]

### 6.6 Data Centre Security Standards

**Standards:**

- [ ] SSAE-16 / ISAE 3402
- [ ] ISO 27001
- [ ] PCI DSS
- [ ] Tier III/IV certification
- [ ] Other: [SPECIFY]

### 6.7 Data Protection - Between Networks

**Protection methods:**

- [ ] Private network or public sector network
- [ ] TLS (version 1.2 or above)
- [ ] IPsec or TLS VPN gateway
- [ ] Bonded fibre optic connections
- [ ] Legacy SSL or TLS (under version 1.2)
- [ ] Other: [SPECIFY]

### 6.8 Data Protection - Within Network

**Protection methods:**

- [ ] TLS (version 1.2 or above)
- [ ] IPsec or TLS VPN gateway
- [ ] Legacy SSL or TLS (under version 1.2)
- [ ] Other: [SPECIFY]

### 6.9 Data Protection - At Rest

**Protection approach:**

- [ ] Physical access control, conforming to CSA CCM v3.0
- [ ] Physical access control, conforming to SSAE-16 / ISAE 3402
- [ ] Physical access control, conforming to another standard
- [ ] Encryption of all physical media
- [ ] Scale, obfuscation or data storage sharding
- [ ] Other: [SPECIFY]

### 6.10 Penetration Testing

**Frequency:**

- [ ] At least every 6 months
- [ ] At least once a year
- [ ] Less than once a year
- [ ] Never

**Penetration testing approach:**
<!-- Max 200 words -->
```text
[DESCRIPTION]
```

### 6.11 Vulnerability Management

**Vulnerability management type:**

- [ ] Conforms to a recognised standard, for example CSA CCM v3.0 or SSAE-16 / ISAE 3402
- [ ] Supplier-defined controls
- [ ] Undisclosed

**Vulnerability management approach:**
<!-- Max 100 words, 1000 characters -->
```text
[DESCRIPTION]
```

### 6.12 Protective Monitoring

**Monitoring type:**

- [ ] Conforms to a recognised standard, for example CSA CCM v3.0 or SSAE-16 / ISAE 3402
- [ ] Supplier-defined controls
- [ ] Undisclosed

**Protective monitoring approach:**
<!-- Max 100 words, 1000 characters -->
```text
[DESCRIPTION]
```

### 6.13 Incident Management

**Incident management type:**

- [ ] Conforms to a recognised standard, for example CSA CCM v3.0 or SSAE-16 / ISAE 3402
- [ ] Supplier-defined controls
- [ ] Undisclosed

**Incident management approach:**
<!-- Max 100 words, 1000 characters -->
```text
[DESCRIPTION]
```

### 6.14 Access Management & Authentication

**Authentication required:** Yes / No

**Authentication methods:**

- [ ] 2-factor authentication
- [ ] Public key authentication (including TLS client certificate)
- [ ] Identity federation with existing provider
- [ ] Limited access over government network (e.g. PSN)
- [ ] Dedicated link to service (e.g. VPN or bonded fibre)
- [ ] Username or password
- [ ] Other: [SPECIFY]

**Authentication description:**
<!-- Max 200 words -->
```text
[DESCRIPTION]
```

**Management access authentication:**
<!-- Max 200 words -->
```text
[DESCRIPTION]
```

### 6.15 Audit Trails

**Access to buyer action audit information:**

- [ ] Users have access to real-time audit information
- [ ] Users have access to audit information through an additional service
- [ ] Users contact the support team to get audit information
- [ ] Audit information is available on request
- [ ] No audit information available

**Access to supplier action audit information:**

- [ ] Users have access to real-time audit information
- [ ] Users have access to audit information through an additional service
- [ ] Users contact the support team to get audit information
- [ ] Audit information is available on request
- [ ] No audit information available

**How long buyer audit data is stored:**

- [ ] At least 12 months
- [ ] 7 to 12 months
- [ ] 1 to 6 months
- [ ] Less than 1 month
- [ ] Data is not stored

**How long supplier audit data is stored:**

- [ ] At least 12 months
- [ ] 7 to 12 months
- [ ] 1 to 6 months
- [ ] Less than 1 month
- [ ] Data is not stored

### 6.16 Board-Level Security Responsibility

**Named board member responsible for service security:** Yes / No
**Name and role:** [NAME], [ROLE]

---

## 7. Operations

### 7.1 Backup

**Service backs up data:** Yes / No

**Data backed up:**
<!-- Up to 10 items, each max 10 words, 100 characters -->

| # | Data backed up | Words | Chars |
|---|----------------|-------|-------|
| 1 | [Item 1] | [X]/10 | [X]/100 |
| 2 | [Item 2] | [X]/10 | [X]/100 |
| 3 | [Item 3] | [X]/10 | [X]/100 |
| 4 | [Item 4] | [X]/10 | [X]/100 |
| 5 | [Item 5] | [X]/10 | [X]/100 |
| 6 | [Item 6] | [X]/10 | [X]/100 |
| 7 | [Item 7] | [X]/10 | [X]/100 |
| 8 | [Item 8] | [X]/10 | [X]/100 |
| 9 | [Item 9] | [X]/10 | [X]/100 |
| 10 | [Item 10] | [X]/10 | [X]/100 |

**Backup controls:**
<!-- Max 100 words, 1000 characters -->
```text
[DESCRIPTION]
```

**Backup scheduling:**
<!-- Max 200 words -->
```text
[DESCRIPTION]
```

### 7.2 Backup Data Centre Location

**Backup datacentre setup:**

- [ ] Multiple datacentres with disaster recovery
- [ ] Multiple datacentres without disaster recovery
- [ ] Single datacentre with multiple copies
- [ ] Single datacentre without multiple copies

### 7.3 Disaster Recovery

**Recovery Time Objective (RTO):** [X] hours
**Recovery Point Objective (RPO):** [X] hours

**Recovery process:**
<!-- Max 200 words -->
```text
[DESCRIPTION]
```

### 7.4 Approach to Resilience
<!-- Max 200 words -->
```text
[DESCRIPTION]
```

### 7.5 Guaranteed Availability

**SLA Target:** [X]%
**Measurement Period:** Monthly / Quarterly

**Outage reporting:**
<!-- Max 200 words -->
```text
[DESCRIPTION]
```

### 7.6 Configuration and Change Management

**Configuration and change management type:**

- [ ] Conforms to a recognised standard, for example CSA CCM v3.0 or SSAE-16 / ISAE 3402
- [ ] Supplier-defined controls

**Configuration and change management process:**
<!-- Max 100 words, 1000 characters -->
```text
[DESCRIPTION]
```

---

## 8. Scaling

### 8.1 Scaling Capability

**Service can scale:** Yes / No

**Scaling type:**

- [ ] Automatic (auto-scaling)
- [ ] Manual
- [ ] Both

**Scaling approach:**
<!-- Max 200 words -->
```text
[DESCRIPTION]
```

### 8.2 Independence of Resources
<!-- Max 200 words -->
```text
[DESCRIPTION]
```

### 8.3 Usage Monitoring & Metrics

**Metrics available:** Yes / No

**Metrics provided:**

- [ ] CPU
- [ ] Disk
- [ ] HTTP request and response status
- [ ] Memory
- [ ] Network
- [ ] Number of active instances
- [ ] Other: [SPECIFY]

**Usage notification approach:**
<!-- Max 200 words -->
```text
[DESCRIPTION]
```

---

## 9. Support

### 9.1 Support Levels
<!-- Max 200 words, 2000 characters -->
```text
[DESCRIPTION]
```

**Word count:** [X]/200 | **Character count:** [X]/2000

### 9.2 Support Channels

| Channel | Available | Hours | Accessibility |
|---------|-----------|-------|---------------|
| Email/Ticketing | Yes/No | [HOURS] | [WCAG compliance] |
| Phone | Yes/No | [HOURS] | - |
| Web Chat | Yes/No | [HOURS] | [WCAG compliance] |
| Onsite | Yes/No | [AVAILABILITY] | - |

### 9.3 Support Response Times

| Priority | Response Target | Resolution Target |
|----------|-----------------|-------------------|
| Critical (P1) | [X] hours | [X] hours |
| High (P2) | [X] hours | [X] hours |
| Medium (P3) | [X] hours | [X] days |
| Low (P4) | [X] hours | [X] days |

### 9.4 Third Party Support Access

**Support available to third parties:** Yes / No

---

## 10. Onboarding

### 10.1 Getting Started
<!-- Max 200 words -->
```text
[DESCRIPTION]
```

### 10.2 Setup and Migration Service

**Setup/migration service available:** Yes / No

**Description:**
<!-- Max 200 words -->
```text
[DESCRIPTION]
```

### 10.3 Training

**Training available:** Yes / No

**Training description:**
<!-- Max 200 words -->
```text
[DESCRIPTION]
```

---

## 11. Documentation

### 11.1 Documentation Available

**Documentation provided:** Yes / No

**Documentation formats:**

- [ ] HTML (online)
- [ ] PDF
- [ ] Video tutorials
- [ ] API reference
- [ ] Architecture guides
- [ ] Other: [SPECIFY]

### 11.2 Documentation Accessibility

**WCAG 2.1 AA compliant:** Yes / No

### 11.3 Document URLs

| Document | URL |
|----------|-----|
| Service Definition Document | [URL] |
| Terms and Conditions | [URL] |
| Pricing Document | [URL] |

---

## 12. Security Clearances

### 12.1 Government Security Clearances

**Government security clearances:**

- [ ] DV (Developed Vetting)
- [ ] SC (Security Check)
- [ ] BPSS (Baseline Personnel Security Standard)
- [ ] None

### 12.2 Staff Security Clearance Checks

**Staff security clearance checks:**

- [ ] Conforms to BS7858:2012
- [ ] Non-BS7858 staff vetting
- [ ] No staff vetting

---

## 13. Reselling

### 13.1 Reselling Type

**Reselling type:**

- [ ] Not a reseller
- [ ] Reseller (taking full contract risk)
- [ ] Broker (introducing buyer to supplier)

**Reselling organisations:** [ORGANISATION_NAMES]
<!-- Only required if reselling or brokering -->

---

## 14. Service Add-On

### 14.1 Service Add-On

**Is this an add-on to an existing service?** Yes / No

### 14.2 System Requirements
<!-- Up to 10 items, each max 10 words, 100 characters -->

| # | System Requirement | Words | Chars |
|---|-------------------|-------|-------|
| 1 | [Requirement 1] | [X]/10 | [X]/100 |
| 2 | [Requirement 2] | [X]/10 | [X]/100 |
| 3 | [Requirement 3] | [X]/10 | [X]/100 |
| 4 | [Requirement 4] | [X]/10 | [X]/100 |
| 5 | [Requirement 5] | [X]/10 | [X]/100 |
| 6 | [Requirement 6] | [X]/10 | [X]/100 |
| 7 | [Requirement 7] | [X]/10 | [X]/100 |
| 8 | [Requirement 8] | [X]/10 | [X]/100 |
| 9 | [Requirement 9] | [X]/10 | [X]/100 |
| 10 | [Requirement 10] | [X]/10 | [X]/100 |

---

## 15. Energy Efficiency

### 15.1 Energy Efficient Data Centres

**Energy efficient datacentres:** Yes / No

**Energy efficiency description:**
<!-- Max 200 words -->
```text
[DESCRIPTION]
```

**PUE (Power Usage Effectiveness):** [X]
**Renewable energy percentage:** [X]%

---

## 16. Additional Accreditations

| Accreditation | Status | Expiry Date | Scope |
|---------------|--------|-------------|-------|
| [ACCREDITATION] | Yes/No | [DATE] | [SCOPE] |

---

## 17. Quality Assurance and Testing

### 17.1 QA Process
<!-- Max 200 words -->
```text
[DESCRIPTION]
```

### 17.2 Secure Development
<!-- Max 200 words -->
```text
[DESCRIPTION]
```

---

## 18. Equipment Disposal

### 18.1 Equipment Disposal Approach
<!-- Max 200 words -->
```text
[DESCRIPTION]
```

**Standard:** WEEE / NIST SP 800-88 / Other: [SPECIFY]
**Certificate provided:** Yes / No

---

## Appendix A: Evidence Register

| Assertion | Evidence Document | Location |
|-----------|-------------------|----------|
| ISO 27001 | Certificate | [URL/PATH] |
| Cyber Essentials Plus | Certificate | [URL/PATH] |
| SOC 2 Type II | Report summary | [URL/PATH] |
| Pen Test | Executive Summary | [URL/PATH] |
| [ASSERTION] | [DOCUMENT] | [LOCATION] |

---

**Generated by**: ArcKit `/arckit:{command}` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
