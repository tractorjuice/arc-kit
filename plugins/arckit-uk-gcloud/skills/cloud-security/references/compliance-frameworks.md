# G-Cloud Compliance Frameworks Reference

> Key compliance frameworks and certifications for G-Cloud service providers

---

## Security Certifications

### ISO/IEC 27001

**Information Security Management System (ISMS)**

| Aspect | Details |
|--------|---------|
| **Scope** | Management system for information security |
| **Issuing Body** | Accredited certification bodies (UKAS in UK) |
| **Validity** | 3 years with annual surveillance audits |
| **Cost** | £5,000 - £50,000+ depending on scope |
| **Time to Achieve** | 6-18 months |
| **G-Cloud Importance** | High - expected by most public sector buyers |

**Key Requirements:**

- Risk assessment process
- Statement of Applicability
- Security controls (Annex A)
- Management review
- Internal audit
- Continuous improvement

### Cyber Essentials

**Basic Cyber Security Controls**

| Level | Controls | Assessment | Validity |
|-------|----------|------------|----------|
| Cyber Essentials | 5 controls | Self-assessment questionnaire | 12 months |
| Cyber Essentials Plus | 5 controls | Independent technical verification | 12 months |

**The 5 Controls:**

1. **Firewalls** - Boundary protection
2. **Secure Configuration** - Default passwords, unnecessary software
3. **User Access Control** - Least privilege, authentication
4. **Malware Protection** - Anti-virus, application whitelisting
5. **Patch Management** - Security updates within 14 days

**G-Cloud Importance:** High - mandatory for handling personal data

### SOC 2 Type II

**Service Organisation Controls**

| Aspect | Details |
|--------|---------|
| **Scope** | Controls for service organisations |
| **Trust Criteria** | Security, Availability, Processing Integrity, Confidentiality, Privacy |
| **Assessment** | Independent audit by CPA firm |
| **Report Period** | 6-12 months |
| **Validity** | Annual reports |
| **G-Cloud Importance** | Medium-High - valued by sophisticated buyers |

### CSA STAR

**Cloud Security Alliance Security, Trust, Assurance, and Risk**

| Level | Description | Assessment |
|-------|-------------|------------|
| Level 1 | Self-Assessment | CCM questionnaire |
| Level 2 | Third-Party Audit | SOC 2 + CCM or ISO 27001 + CCM |
| Level 3 | Continuous Monitoring | Automated assessment |

**G-Cloud Importance:** Medium - useful for cloud-native services

---

## UK Government Frameworks

### NCSC Cloud Security Principles

**14 Principles for Cloud Security**

| # | Principle | Category |
|---|-----------|----------|
| 1 | Data in transit protection | Data Protection |
| 2 | Asset protection and resilience | Data Protection |
| 3 | Separation between users | Separation |
| 4 | Governance framework | Governance |
| 5 | Operational security | Operations |
| 6 | Personnel security | Personnel |
| 7 | Secure development | Development |
| 8 | Supply chain security | Supply Chain |
| 9 | Secure user management | Access |
| 10 | Identity and authentication | Access |
| 11 | External interface protection | Infrastructure |
| 12 | Secure service administration | Administration |
| 13 | Audit information for users | Audit |
| 14 | Secure use of the service | Usage |

**G-Cloud Importance:** High - reference framework for assessment

### Technology Code of Practice (TCoP)

**13 Points for Government Technology**

| # | Point | Relevance to G-Cloud |
|---|-------|---------------------|
| 1 | Define user needs | Service design |
| 2 | Make things accessible | WCAG compliance |
| 3 | Be open and use open source | Technology choices |
| 4 | Make use of open standards | Interoperability |
| 5 | Use cloud first | Core requirement |
| 6 | Make things secure | Security controls |
| 7 | Make privacy integral | Data protection |
| 8 | Share, reuse and collaborate | GOV.UK services |
| 9 | Integrate and adapt technology | Integration capabilities |
| 10 | Make better use of data | Data management |
| 11 | Define your purchasing strategy | Framework alignment |
| 12 | Meet the Digital Spend Controls | Value for money |
| 13 | Define responsible AI use | AI governance |

### UK Government AI Playbook

**10 Principles for Responsible AI Use**

| # | Principle | Description |
|---|-----------|-------------|
| 1 | Understanding AI | Know what AI is and its limitations |
| 2 | Lawful & Ethical | Use AI lawfully, ethically and responsibly |
| 3 | Security | Know how to use AI securely |
| 4 | Human Oversight | Meaningful human control at right stages |
| 5 | Lifecycle Management | Understand how to manage the AI lifecycle |
| 6 | Right Tool | Use the right tool for the job |
| 7 | Collaboration | Be open and collaborative |
| 8 | Commercial Partnership | Work with commercial colleagues from start |
| 9 | Skills & Expertise | Have skills needed to implement AI |
| 10 | Governance | Use principles alongside org policies |

**AI Solution Phases:**

| Phase | Key Activities |
|-------|----------------|
| 1. Goal Definition | User research, use case identification, baselines |
| 2. Team Assembly | Data scientists, engineers, ethics experts, legal |
| 3. Support Infrastructure | AI strategy, governance board, training |
| 4. Responsible Development | Legal/ethical review, security, transparency |
| 5. Monitoring & Maintenance | Drift detection, bias monitoring, user feedback |

**Use Cases to Avoid:**

- Fully automated decisions affecting health, safety, or fundamental rights
- High-risk applications without human oversight
- Systems lacking bias and fairness safeguards

**Security Requirements:**

- Comply with "Secure by Design" principles
- Address AI-specific threats (data poisoning, prompt injection, hallucinations)
- Implement content filtering and response validation

**Transparency Requirements:**

- Use Algorithmic Transparency Recording Standard (ATRS) when applicable
- Clearly identify AI-generated content
- Document algorithmic tool usage in decision-making

**G-Cloud Importance:** High - required for AI/ML services sold to government

**Reference:** https://www.gov.uk/government/publications/ai-playbook-for-the-uk-government

---

### NHS Data Security and Protection Toolkit (DSPT)

**For NHS Data Processing**

| Assertion Area | Examples |
|----------------|----------|
| Leadership | IG lead appointed, board oversight |
| Confidentiality | Confidentiality policies, staff training |
| Availability | Business continuity, DR |
| Audit | Audit trails, access logging |
| Security | Technical controls, pen testing |
| Education | Staff awareness training |
| Cyber | Cyber Essentials Plus |
| Technology | Encryption, access controls |
| Third Parties | Supplier assurance |
| Legal | GDPR compliance, DPIAs |

**G-Cloud Importance:** Essential for NHS buyers

---

## Data Protection

### UK GDPR

**Key Requirements for G-Cloud Services:**

| Requirement | Implementation |
|-------------|----------------|
| Lawful basis | Clear purpose and legal basis |
| Data minimisation | Only necessary data |
| Accuracy | Data correction mechanisms |
| Storage limitation | Retention policies |
| Security | Appropriate technical measures |
| Accountability | Documentation, records |
| Data subject rights | SAR, erasure, portability |
| International transfers | SCCs, adequacy decisions |
| Breach notification | 72-hour reporting |

### Data Processing Agreement (DPA)

**Required Provisions (Article 28):**

- Processing only on documented instructions
- Confidentiality obligations
- Security measures
- Sub-processor controls
- Assistance with data subject rights
- Audit rights
- Deletion/return at end of contract
- Demonstration of compliance

---

## Industry Specific

### PCI DSS

**Payment Card Industry Data Security Standard**

| Level | Transactions/Year | Assessment |
|-------|-------------------|------------|
| 1 | >6 million | Annual QSA audit |
| 2 | 1-6 million | Annual SAQ + quarterly scans |
| 3 | 20K-1 million e-commerce | Annual SAQ |
| 4 | <20K e-commerce | Annual SAQ |

**G-Cloud Importance:** Required for payment processing services

### ISO 22301

**Business Continuity Management**

| Aspect | Details |
|--------|---------|
| **Scope** | BCM system certification |
| **Key Elements** | BIA, recovery strategies, BC plans, exercises |
| **G-Cloud Importance** | Medium - valued for critical services |

### ISO 20000-1

**IT Service Management**

| Aspect | Details |
|--------|---------|
| **Scope** | ITSM certification |
| **Alignment** | ITIL practices |
| **G-Cloud Importance** | Medium - demonstrates mature operations |

---

## Security Clearances

### UK Personnel Security Clearances

| Level | Check | Typical Use | Time |
|-------|-------|-------------|------|
| BPSS | Baseline Personnel Security Standard | Standard access | 1-2 weeks |
| CTC | Counter-Terrorist Check | Airport, defence | 6-8 weeks |
| SC | Security Check | OFFICIAL-SENSITIVE | 6-8 weeks |
| DV | Developed Vetting | SECRET | 6-12 months |
| eDV | Enhanced DV | TOP SECRET | 12+ months |

**G-Cloud Relevance:**

- BPSS minimum for most government work
- SC required for OFFICIAL-SENSITIVE data
- DV/eDV for classified systems

---

## Certification Evidence

### What to Provide

| Certification | Evidence |
|---------------|----------|
| ISO 27001 | Certificate (scope must cover service) |
| Cyber Essentials | Certificate with badge |
| SOC 2 | Management assertion letter (not full report) |
| CSA STAR | Registry entry link |
| NHS DSPT | Published status |
| PCI DSS | AOC (Attestation of Compliance) |

### What NOT to Provide

- Full audit reports (confidential)
- Pen test findings (sensitive)
- Detailed vulnerability data
- Internal policy documents
- Unredacted contracts

---

## Maintaining Certifications

| Certification | Renewal | Annual Requirements |
|---------------|---------|---------------------|
| ISO 27001 | 3 years | Surveillance audits |
| Cyber Essentials | Annual | Full re-certification |
| SOC 2 | Annual | New audit report |
| ISO 22301 | 3 years | Surveillance audits |
| PCI DSS | Annual | Assessment + quarterly scans |

---

## References

- NCSC: https://www.ncsc.gov.uk/
- Cyber Essentials: https://www.cyberessentials.ncsc.gov.uk/
- ICO: https://ico.org.uk/
- NHS DSPT: https://www.dsptoolkit.nhs.uk/
- CSA: https://cloudsecurityalliance.org/
- PCI SSC: https://www.pcisecuritystandards.org/
- UK Government AI Playbook: https://www.gov.uk/government/publications/ai-playbook-for-the-uk-government
- Algorithmic Transparency Recording Standard: https://www.gov.uk/government/collections/algorithmic-transparency-recording-standard-hub
