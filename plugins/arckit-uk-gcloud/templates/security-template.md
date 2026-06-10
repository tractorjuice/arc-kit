# Security Assertions: [PROJECT_NAME]

> **Template Origin**: Official | **ArcKit Version**: [VERSION] | **Command**: `/arckit:security`

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time to _partials/document-control-uk.md or _partials/document-control-uae.md based on plugin userConfig classification_scheme + governance_framework. See _partials/RENDERING.md (when present). -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [DATE] | ArcKit AI | Initial creation from `/arckit.[COMMAND]` command | [PENDING] | [PENDING] |

> G-Cloud 14 Framework - Security Assertions and Evidence
> Based on NCSC Cloud Security Principles and CCS requirements

---

## 1. NCSC Cloud Security Principles

### Principle 1: Data in Transit Protection
<!-- Max 200 words -->
```text
[DESCRIPTION]
```

**Controls implemented:**

- [ ] TLS 1.2+
- [ ] Certificate management
- [ ] VPN options
- [ ] IPSec

**Evidence:** [REFERENCE]

### Principle 2: Asset Protection and Resilience
<!-- Max 200 words -->
```text
[DESCRIPTION]
```

**Controls implemented:**

- [ ] Physical security controls
- [ ] Data centre standards (Tier III/IV)
- [ ] Equipment lifecycle management
- [ ] Environmental controls

**Evidence:** [REFERENCE]

### Principle 3: Separation Between Users
<!-- Max 200 words -->
```text
[DESCRIPTION]
```

**Controls implemented:**

- [ ] Multi-tenancy isolation
- [ ] Logical separation
- [ ] Network isolation
- [ ] Data segregation

**Evidence:** [REFERENCE]

### Principle 4: Governance Framework
<!-- Max 200 words -->
```text
[DESCRIPTION]
```

**Controls implemented:**

- [ ] Security policies documented
- [ ] Risk management framework
- [ ] Board-level responsibility
- [ ] Regular review cadence

**Evidence:** [REFERENCE]

### Principle 5: Operational Security
<!-- Max 200 words -->
```text
[DESCRIPTION]
```

**Controls implemented:**

- [ ] Vulnerability management
- [ ] Protective monitoring
- [ ] Incident response procedures
- [ ] Change management

**Evidence:** [REFERENCE]

### Principle 6: Personnel Security
<!-- Max 200 words -->
```text
[DESCRIPTION]
```

**Controls implemented:**

- [ ] Background checks (BPSS minimum)
- [ ] Security clearances where required
- [ ] Security awareness training
- [ ] Joiners/movers/leavers process

**Evidence:** [REFERENCE]

### Principle 7: Secure Development
<!-- Max 200 words -->
```text
[DESCRIPTION]
```

**Controls implemented:**

- [ ] Secure SDLC
- [ ] Code review process
- [ ] Security testing in CI/CD
- [ ] Dependency vulnerability scanning

**Evidence:** [REFERENCE]

### Principle 8: Supply Chain Security
<!-- Max 200 words -->
```text
[DESCRIPTION]
```

**Controls implemented:**

- [ ] Subcontractor vetting
- [ ] Third-party risk assessments
- [ ] Supplier security requirements
- [ ] Supply chain monitoring

**Evidence:** [REFERENCE]

### Principle 9: Secure User Management
<!-- Max 200 words -->
```text
[DESCRIPTION]
```

**Controls implemented:**

- [ ] Role-based access control (RBAC)
- [ ] Least privilege principle
- [ ] User provisioning/deprovisioning
- [ ] Access reviews

**Evidence:** [REFERENCE]

### Principle 10: Identity and Authentication
<!-- Max 200 words -->
```text
[DESCRIPTION]
```

**Controls implemented:**

- [ ] Multi-factor authentication (MFA)
- [ ] Single sign-on (SSO)
- [ ] Password policies
- [ ] Identity federation (SAML 2.0 / OAuth 2.0 / OpenID Connect)

**Evidence:** [REFERENCE]

### Principle 11: External Interface Protection
<!-- Max 200 words -->
```text
[DESCRIPTION]
```

**Controls implemented:**

- [ ] API security (rate limiting, authentication)
- [ ] Web application firewall (WAF)
- [ ] DDoS protection
- [ ] Network firewall rules

**Evidence:** [REFERENCE]

### Principle 12: Secure Service Administration
<!-- Max 200 words -->
```text
[DESCRIPTION]
```

**Controls implemented:**

- [ ] Privileged access management (PAM)
- [ ] Admin MFA enforced
- [ ] Admin action audit trails
- [ ] Segregation of duties

**Evidence:** [REFERENCE]

### Principle 13: Audit Information for Users
<!-- Max 200 words -->
```text
[DESCRIPTION]
```

**Controls implemented:**

- [ ] User action logging
- [ ] Log retention policy
- [ ] Log export capability
- [ ] Real-time alerting

**Evidence:** [REFERENCE]

### Principle 14: Secure Use of the Service
<!-- Max 200 words -->
```text
[DESCRIPTION]
```

**Controls implemented:**

- [ ] User security guidance documentation
- [ ] Secure configuration guides
- [ ] Shared responsibility model documented
- [ ] Security best practices published

**Evidence:** [REFERENCE]

---

## 2. Certifications

### 2.1 ISO/IEC 27001

| Field | Value |
|-------|-------|
| **Certified** | Yes / No |
| **Certificate holder** | [NAME] |
| **Certificate number** | [NUMBER] |
| **Certification body** | [BODY] |
| **Scope** | [SCOPE] |
| **Issue date** | [DATE] |
| **Expiry date** | [DATE] |
| **Scope exclusions** | [EXCLUSIONS] |

### 2.2 Cyber Essentials / Cyber Essentials Plus

| Field | Value |
|-------|-------|
| **Level** | Cyber Essentials / Cyber Essentials Plus |
| **Certificate number** | [NUMBER] |
| **Certification date** | [DATE] |
| **Expiry date** | [DATE] |
| **Certification body** | [BODY] |

### 2.3 SOC 2 Type II

| Field | Value |
|-------|-------|
| **Certified** | Yes / No |
| **Report date** | [DATE] |
| **Trust service criteria** | [Security / Availability / Processing Integrity / Confidentiality / Privacy] |
| **Audit period** | [START] to [END] |
| **Exceptions noted** | [DESCRIPTION] |

### 2.4 CSA STAR

| Field | Value |
|-------|-------|
| **Certified** | Yes / No |
| **Level** | 1 (Self-Assessment) / 2 (Attestation) / 3 (Certification) / 4 (C-STAR Assessment) / 5 (Continuous Monitoring) |
| **Certificate date** | [DATE] |
| **Expiry date** | [DATE] |

### 2.5 PCI DSS

| Field | Value |
|-------|-------|
| **Certified** | Yes / No |
| **Compliance level** | Level [1-4] |
| **Certificate holder** | [NAME] |
| **Expiry date** | [DATE] |
| **Scope** | [DESCRIPTION] |

### 2.6 Other Certifications

| Certification | Status | Expiry | Scope |
|---------------|--------|--------|-------|
| ISO 22301 (Business Continuity) | [Yes/No] | [DATE] | [SCOPE] |
| ISO 9001 (Quality) | [Yes/No] | [DATE] | [SCOPE] |
| [OTHER] | [Yes/No] | [DATE] | [SCOPE] |

---

## 3. Security Testing

### 3.1 Penetration Testing

| Field | Value |
|-------|-------|
| **Frequency** | [Annually / Bi-annually / Quarterly] |
| **Last test date** | [DATE] |
| **Next scheduled** | [DATE] |
| **Testing provider** | [NAME] |
| **Scope** | [DESCRIPTION] |
| **Methodology** | [OWASP / CREST / CHECK / Other] |

**Remediation process:**
<!-- Max 200 words -->
```text
[DESCRIPTION]
```

### 3.2 Vulnerability Scanning

| Field | Value |
|-------|-------|
| **Frequency** | [Daily / Weekly / Monthly] |
| **Tools used** | [TOOLS] |
| **Scope** | [Internal / External / Both] |

**Remediation SLAs:**

| Severity | Remediation Target |
|----------|--------------------|
| Critical | [X] hours |
| High | [X] days |
| Medium | [X] days |
| Low | [X] days |

---

## 4. Security Clearances

| Clearance Level | Number of Staff | Renewal Process |
|-----------------|-----------------|-----------------|
| BPSS | [X] | [PROCESS] |
| CTC | [X] | [PROCESS] |
| SC | [X] | 10-year renewal |
| DV | [X] | 7-year renewal |
| eDV | [X] | [PROCESS] |

---

## Appendix A: Evidence Register

| # | Assertion | Evidence Document | Location | Expiry | Status |
|---|-----------|-------------------|----------|--------|--------|
| 1 | ISO 27001 certified | Certificate PDF | [URL/PATH] | [DATE] | Current / Expired |
| 2 | Cyber Essentials Plus | Certificate | [URL/PATH] | [DATE] | Current / Expired |
| 3 | Annual pen test completed | Executive summary | [URL/PATH] | [DATE] | Current / Expired |
| 4 | SC cleared staff | Staff register | Internal HR | Ongoing | Current |
| 5 | SOC 2 Type II | Audit report | [URL/PATH] | [DATE] | Current / Expired |
| 6 | [ASSERTION] | [DOCUMENT] | [LOCATION] | [DATE] | [STATUS] |

---

**Generated by**: ArcKit `/arckit:{command}` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
