# G-Cloud Framework Questions Reference

> Official question structure from Crown Commercial Service digitalmarketplace-frameworks
> Source: https://github.com/Crown-Commercial-Service/digitalmarketplace-frameworks/tree/main/frameworks/g-cloud-13/questions

---

## Overview

The G-Cloud framework requires suppliers to answer questions in two categories:

| Category | Question Count | Purpose |
|----------|---------------|---------|
| **Services** | ~258 questions | Define each service listing |
| **Declaration** | ~57 questions | Legal compliance, exclusion grounds |

### Standard Textbox Mappings

| Size | Word Limit | Character Limit |
|------|-----------|----------------|
| Small | 50 words | 500 chars |
| Medium | 100 words | 1000 chars |
| Large | 200 words | 2000 chars |

---

## Service Questions by Category

### 1. Service Identity & Description

| Question ID | Question | Type | Limits | Lots |
|-------------|----------|------|--------|------|
| `serviceName` | Service name | Text | 100 chars | All |
| `serviceDescription` | Summary of what service is for | Textbox | 50 words, 500 chars | All |
| `serviceFeaturesHostingAndSoftware` | List service features | List | 10 items, 10 words each, 100 chars each | 1, 2 |
| `serviceFeaturesSupport` | List service features | List | 10 items, 10 words each, 100 chars each | 3 |
| `serviceBenefitsHostingAndSoftware` | List service benefits | List | 10 items, 10 words each, 100 chars each | 1, 2 |
| `serviceBenefitsSupport` | List service benefits | List | 10 items, 10 words each, 100 chars each | 3 |
| `serviceConstraintsHostingAndSoftware` | Any constraints/limitations | Textbox | 100 words, 1000 chars | 1, 2 |
| `serviceConstraintsSupport` | Any constraints/limitations | Textbox | 100 words, 1000 chars | 3 |

### 2. Service Categories

#### Lot 1 - Cloud Hosting Categories (max 10)

| Category |
|----------|
| Archiving, backup and disaster recovery |
| Compute and application hosting |
| Container service |
| Content delivery network |
| Data warehousing |
| NoSQL database |
| Relational database |
| Other database services |
| DDOS protection |
| Firewall |
| Infrastructure and platform security |
| Intrusion detection |
| Load balancing |
| Logging and analysis |
| Message queuing and processing |
| Networking (including NaaS) |
| Platform as a service (PaaS) |
| Protective monitoring |
| Search |
| Block storage |
| Object storage |
| Other storage services |

#### Lot 2 - Cloud Software Categories (max 20)

**18 Primary Categories with 240+ Subcategories:**

1. **Accounting and finance** (22 subcategories)
   - Accounts payable/receivable, Budgeting, ERP, Expenses, Invoicing, Payroll, Tax management, etc.

2. **Analytics and business intelligence** (5 subcategories)
   - BI software, Data analysis, Data visualisation, Data warehouse analytics, etc.

3. **Application security** (8 subcategories)
   - Authentication, Encryption, Fraud detection, Malware protection, Threat management, etc.

4. **Collaborative working** (20 subcategories)
   - Email, File sharing, Messaging, Office productivity, Project tools, Video conferencing, etc.

5. **Creative, design and publishing** (11 subcategories)
   - CMS, Design tools, Digital asset management, Video editing, etc.

6. **Customer relationship management** (12 subcategories)
   - CRM, Customer engagement, Helpdesk, Live chat, etc.

7. **Electronic document and records management** (8 subcategories)
   - Document management, Electronic signatures, Records management, etc.

8. **Healthcare** (21 subcategories)
   - Clinical decision support, EPR, Medical records, Practice management, Telehealth, etc.

9. **Human resources and employee management** (17 subcategories)
   - Applicant tracking, HR management, Learning management, Payroll, Workforce scheduling, etc.

10. **Information and communications technology** (42 subcategories)
    - AI/ML, API management, Cybersecurity, IoT, Mobile device management, Telephony, etc.

11. **Legal and enforcement** (8 subcategories)
    - Case management, Contract lifecycle, Legal billing, etc.

12. **Marketing** (23 subcategories)
    - Campaign management, Email marketing, SEO, Social media, etc.

13. **Operations management** (24 subcategories)
    - Asset management, ERP, Inventory, Supply chain, Workflow automation, etc.

14. **Project management and planning** (6 subcategories)
    - Agile/Scrum tools, PSA, Resource planning, Time tracking, etc.

15. **Sales** (8 subcategories)
    - CPQ, eCommerce, Order management, Sales enablement, etc.

16. **Schools, education and libraries** (15 subcategories)
    - eLearning, Library management, School administration, Student information, etc.

17. **Software development tools** (15 subcategories)
    - CI/CD, IDE, Low-code platforms, Testing tools, Version control, etc.

18. **Transport and logistics** (13 subcategories)
    - Fleet management, Route optimisation, Warehouse management, etc.

#### Lot 3 - Cloud Support Categories (max 6)

| Category |
|----------|
| Planning |
| Setup and migration |
| Quality assurance and performance testing |
| Security services |
| Training |
| Ongoing support |

---

### 3. Pricing Questions

| Question ID | Question | Type | Limits | Lots |
|-------------|----------|------|--------|------|
| `price` | How much does the service cost (excluding VAT)? | Pricing | Min required, Max optional | All |
| `priceMin` | Minimum price | Number | Currency format | All |
| `priceMax` | Maximum price | Number | Currency format, > priceMin | All |
| `priceUnit` | Unit of pricing | Select | User/Licence/Instance/etc. | All |
| `priceInterval` | Billing interval | Select | Hour/Day/Month/Year | All |
| `educationPricing` | Education sector discount available? | Boolean | - | All |
| `freeVersionTrialOption` | Free trial available? | Boolean | - | All |
| `freeVersionDescription` | Describe free version/trial | Textbox | 500 chars | All |
| `pricingDocumentURL` | Link to pricing document | URL | Valid URL | All |

---

### 4. Technical Questions

#### API & Integration

| Question ID | Question | Type | Limits | Lots |
|-------------|----------|------|--------|------|
| `APISoftware` | Does service have an API? | Boolean | - | 2 |
| `APIHosting` | Does service have an API? | Boolean | - | 1 |
| `APIDocumentation` | API documentation available? | Boolean | - | 1, 2 |
| `APIDocumentationFormats` | Documentation formats | Checkboxes | HTML, PDF, etc. | 1, 2 |
| `APISandbox` | API sandbox/test environment available? | Boolean | - | 2 |
| `APIUsage` | Describe API usage | Textbox | 200 words, 2000 chars | 1, 2 |
| `APIAutomationTools` | Automation tools supported | Checkboxes | Ansible, Chef, Puppet, etc. | 1 |

#### Command Line Interface

| Question ID | Question | Type | Limits | Lots |
|-------------|----------|------|--------|------|
| `commandLineInterface` | CLI available? | Boolean | - | 1 |
| `commandLineOS` | Supported operating systems | Checkboxes | Linux, Windows, macOS | 1 |
| `commandLineUsage` | Describe CLI usage | Textbox | 200 words, 2000 chars | 1 |

#### Web Interface

| Question ID | Question | Type | Limits | Lots |
|-------------|----------|------|--------|------|
| `webInterface` | Web interface available? | Boolean | - | 1 |
| `webInterfaceUsage` | Describe web interface | Textbox | 200 words, 2000 chars | 1 |
| `webInterfaceAccessibility` | WCAG 2.1 AA compliant? | Boolean | - | 1 |
| `webInterfaceAccessibilityDescription` | Describe accessibility | Textbox | 200 words, 2000 chars | 1 |
| `webInterfaceAccessibilityTesting` | Describe accessibility testing | Textbox | 100 words, 1000 chars | 1 |

#### Service Interface (Lot 2)

| Question ID | Question | Type | Limits | Lots |
|-------------|----------|------|--------|------|
| `serviceInterface` | Service has a management interface? | Boolean | - | 2 |
| `serviceInterfaceDescription` | Describe service interface | Textbox | 100 words, 1000 chars | 2 |
| `serviceInterfaceAccessibility` | Interface WCAG 2.1 AA compliant? | Boolean | - | 2 |
| `serviceInterfaceTesting` | Accessibility testing approach | Radios | - | 2 |

#### Browser Support (Lot 2)

| Question ID | Question | Type | Limits | Lots |
|-------------|----------|------|--------|------|
| `browsersAccess` | Which browsers supported? | Boolean | - | 2 |
| `browsersSupported` | List supported browsers | Checkboxes | Chrome, Firefox, Safari, Edge, IE | 2 |

#### Mobile

| Question ID | Question | Type | Limits | Lots |
|-------------|----------|------|--------|------|
| `mobile` | Works on mobile devices? | Boolean | - | 2 |
| `mobileDifferences` | Differences from desktop | Textbox | 100 words, 1000 chars | 2 |

#### Customisation (Lot 2)

| Question ID | Question | Type | Limits | Lots |
|-------------|----------|------|--------|------|
| `customisationAvailable` | Customisation available? | Boolean | - | 2 |
| `customisationDescription` | Describe customisation | Textbox | 200 words, 2000 chars | 2 |

---

### 5. Data Questions

| Question ID | Question | Type | Limits | Lots |
|-------------|----------|------|--------|------|
| `dataStorageAndProcessing` | Know where data stored/processed? | Boolean | - | 1, 2 |
| `dataStorageAndProcessingLocations` | Where is data stored? | Checkboxes | UK, EEA, etc. | 1, 2 |
| `dataStorageAndProcessingUserControl` | Can users control location? | Boolean | - | 1, 2 |
| `dataImportFormats` | Import formats supported | Checkboxes | CSV, JSON, XML, etc. | 2 |
| `dataExportFormats` | Export formats supported | Checkboxes | CSV, JSON, XML, etc. | 2 |
| `dataExportHow` | How users export data | Textbox | 100 words, 1000 chars | 2 |
| `endOfContractDataExtraction` | Data extraction at contract end | Textbox | 200 words, 2000 chars | 1, 2 |
| `endOfContractProcess` | End of contract process | Textbox | 200 words, 2000 chars | 1, 2 |
| `dataSanitisationHosting` | Data sanitisation approach | Boolean | - | 1 |
| `dataSanitisationHostingType` | Data sanitisation type | Checkboxes | - | 1 |
| `dataSanitisationSoftware` | Data sanitisation approach | Boolean | - | 2 |
| `dataSanitisationSoftwareType` | Data sanitisation type | Checkboxes | - | 2 |

---

### 6. Security Questions

#### Governance & Standards

| Question ID | Question | Type | Limits | Lots |
|-------------|----------|------|--------|------|
| `securityGovernanceStandards` | Security standards complied with | Checkboxes | CSA CCM, ISO 27001, Other | 1, 2 |
| `securityGovernanceApproach` | Describe security governance approach | Textbox | 100 words, 1000 chars | 1, 2 |
| `standardsISOIEC27001` | Current ISO 27001 certification? | Boolean | - | 1, 2 |
| `standardsISOIEC27001Who` | Who holds certification? | Text | - | 1, 2 |
| `standardsISOIEC27001When` | When was the certification accredited? | Date | - | 1, 2 |
| `standardsISOIEC27001Exclusions` | Any scope exclusions? | Textbox | 200 words, 2000 chars | 1, 2 |
| `standardsCSASTAR` | CSA STAR certified? | Boolean | - | 1, 2 |
| `standardsCSASTARLevel` | CSA STAR level | Select | Self-Assessment, Attestation, Certification, C-STAR Assessment, Continuous Monitoring | 1, 2 |
| `standardsPCI` | PCI DSS certified? | Boolean | - | 1, 2 |

#### Data Protection

| Question ID | Question | Type | Limits | Lots |
|-------------|----------|------|--------|------|
| `dataProtectionBetweenNetworks` | Protection between networks | Checkboxes | Private network or public sector network, TLS (version 1.2 or above), IPsec or TLS VPN gateway, Bonded fibre optic connections, Legacy SSL or TLS (under version 1.2), Other | 1, 2 |
| `dataProtectionWithinNetwork` | Protection within network | Checkboxes | TLS (version 1.2 or above), IPsec or TLS VPN gateway, Legacy SSL or TLS (under version 1.2), Other | 1, 2 |
| `protectionOfDataAtRest` | Protection of data at rest | Checkboxes | Physical access control conforming to CSA CCM v3.0, Physical access control conforming to SSAE-16 / ISAE 3402, Physical access control conforming to another standard, Encryption of all physical media, Scale obfuscation or data storage sharding, Other | 1, 2 |

#### Vulnerability & Incident Management

| Question ID | Question | Type | Limits | Lots |
|-------------|----------|------|--------|------|
| `vulnerabilityManagementType` | Vulnerability management type | Radios | CSA CCM/SSAE-16 conforming / Supplier-defined / Undisclosed | 1, 2 |
| `vulnerabilityManagementApproach` | Describe vulnerability management | Textbox | 100 words, 1000 chars | 1, 2 |
| `configurationAndChangeManagementType` | Configuration management type | Radios | CSA CCM/SSAE-16 conforming / Supplier-defined / Undisclosed | 1, 2 |
| `configurationAndChangeManagementProcesses` | Describe configuration management | Textbox | 100 words, 1000 chars | 1, 2 |
| `protectiveMonitoringType` | Protective monitoring type | Radios | CSA CCM/SSAE-16 conforming / Supplier-defined / Undisclosed | 1, 2 |
| `protectiveMonitoringApproach` | Describe protective monitoring | Textbox | 100 words, 1000 chars | 1, 2 |
| `incidentManagementType` | Incident management type | Radios | CSA CCM/SSAE-16 conforming / Supplier-defined / Undisclosed | 1, 2 |
| `incidentManagementApproach` | Describe incident management | Textbox | 100 words, 1000 chars | 1, 2 |

#### Testing & Monitoring

| Question ID | Question | Type | Limits | Lots |
|-------------|----------|------|--------|------|
| `penetrationTesting` | Penetration testing frequency | Radios | At least every 6 months / At least once a year / Less often / Never | 1, 2 |
| `penetrationTestingApproach` | Describe pen testing approach | Textbox | 200 words, 2000 chars | 1, 2 |
| `boardLevelServiceSecurity` | Board member for security? | Boolean | - | 1, 2 |

#### Lot 3 Security Testing

| Question ID | Question | Type | Limits | Lots |
|-------------|----------|------|--------|------|
| `securityTestingWhat` | What security testing is provided | Checkboxes | - | 3 |
| `securityTestingAccredited` | Security testing accredited? | Boolean | - | 3 |
| `securityTestingAccreditations` | Security testing accreditations | Checkboxes | CREST, CHECK, Tiger Scheme, Cyber Scheme, GBEST | 3 |
| `securityTestingCCP` | CCP (Certified Cyber Professional) certified? | Boolean | - | 3 |

#### Access & Authentication

| Question ID | Question | Type | Limits | Lots |
|-------------|----------|------|--------|------|
| `userAuthenticationNeeded` | Authentication required? | Boolean | - | 2 |
| `userAuthenticationHosting` | Authentication methods (Hosting) | Checkboxes | 2-factor authentication, Public key authentication (TLS client certificate), Identity federation with existing provider, Limited access over government network (PSN), Dedicated link to service (VPN or bonded fibre), Username or password, Other | 1 |
| `userAuthenticationSoftware` | Authentication methods (Software) | Checkboxes | 2-factor authentication, Public key authentication (TLS client certificate), Identity federation with existing provider, Limited access over government network (PSN), Dedicated link to service (VPN or bonded fibre), Username or password, Other | 2 |
| `userAuthenticationDescription` | Describe authentication | Textbox | 100 words, 1000 chars | 1, 2 |
| `managementAccessAuthenticationDescription` | Describe management access authentication | Textbox | 100 words, 1000 chars | 1, 2 |
| `accessRestrictionManagementAndSupport` | Access management approach | Textbox | 100 words, 1000 chars | 1, 2 |
| `accessRestrictionTesting` | Access restriction testing | Radios | At least every 6 months / At least once a year / Less often / Never | 1, 2 |
| `governmentSecurityClearances` | Staff security clearance level | Radios | Up to Developed Vetting (DV) / Up to Security Clearance (SC) / Up to Baseline Personnel Security Standard (BPSS) / None | All |
| `staffSecurityClearanceChecks` | Staff security clearance checks | Radios | Conforms to BS7858:2012 / Staff screening not to BS7858:2012 but in line / Staff screening not in line with BS7858:2012 | All |

#### Audit

| Question ID | Question | Type | Limits | Lots |
|-------------|----------|------|--------|------|
| `auditBuyersActions` | Buyer action audit trails? | Radios | Users have access to real-time audit / Users have access to audit on request / Users don't have access / No audit trail | 1, 2 |
| `auditBuyersActionsStorage` | Buyer audit log retention | Radios | - | 1, 2 |
| `auditSuppliersActions` | Supplier action audit trails? | Radios | Users have access to real-time audit / Users have access to audit on request / Users don't have access / No audit trail | 1, 2 |
| `auditSuppliersActionsStorage` | Supplier audit log retention | Radios | - | 1, 2 |
| `howLongSystemLogsStored` | System log retention | Text | - | 1, 2 |

---

### 7. Backup & Disaster Recovery

| Question ID | Question | Type | Limits | Lots |
|-------------|----------|------|--------|------|
| `backup` | Service backs up data? | Boolean | - | 1 |
| `backupWhatData` | What data is backed up | Checkboxes | - | 1 |
| `backupControls` | Backup controls available | Textbox | 100 words, 1000 chars | 1 |
| `backupScheduling` | Backup scheduling options | Textbox | 200 words, 2000 chars | 1 |
| `backupDatacentre` | Backup datacentre location | Text | - | 1 |
| `backupRecovery` | Recovery process | Textbox | 200 words, 2000 chars | 1 |
| `approachToResilience` | Approach to resilience | Textbox | 200 words, 2000 chars | 1, 2 |
| `guaranteedAvailability` | Guaranteed availability SLA | Text | Percentage | 1, 2 |
| `outageReporting` | Outage reporting mechanism | Textbox | 200 words, 2000 chars | 1, 2 |

---

### 8. Support Questions

| Question ID | Question | Type | Limits | Lots |
|-------------|----------|------|--------|------|
| `supportLevels` | Describe support levels | Textbox | 200 words, 2000 chars | All |
| `emailOrTicketingSupport` | Email/ticketing support? | Boolean | - | All |
| `emailOrTicketingSupportAccessibility` | Email support accessibility | Textbox | 200 words, 2000 chars | All |
| `emailOrTicketingSupportResponseTimes` | Response times | Textbox | 100 words, 1000 chars | All |
| `phoneSupport` | Phone support available? | Boolean | - | All |
| `phoneSupportAvailability` | Phone support hours | Textbox | 200 words, 2000 chars | All |
| `webChatSupport` | Web chat available? | Boolean | - | All |
| `webChatSupportAvailability` | Web chat hours | Textbox | 200 words, 2000 chars | All |
| `webChatSupportAccessibility` | Web chat accessibility | Boolean | - | All |
| `onsiteSupport` | Onsite support available? | Boolean | - | All |
| `supportAvailableToThirdParty` | Third party support access? | Boolean | - | 1, 2 |

---

### 9. Onboarding & Training

| Question ID | Question | Type | Limits | Lots |
|-------------|----------|------|--------|------|
| `gettingStarted` | How users get started | Textbox | 200 words, 2000 chars | 1, 2 |
| `ongoingSupport` | Ongoing support provided? | Boolean | - | All |
| `ongoingSupportDescription` | Describe ongoing support | Textbox | 200 words, 2000 chars | All |
| `training` | Training provided? | Boolean | - | All |
| `trainingDescription` | Describe training | Textbox | 200 words, 2000 chars | All |
| `setupAndMigrationService` | Setup/migration service? | Boolean | - | 3 |
| `setupAndMigrationServiceDescription` | Describe setup/migration | Textbox | 200 words, 2000 chars | 3 |
| `planningService` | Planning service available? | Boolean | - | 3 |
| `planningServiceDescription` | Describe planning service | Textbox | 200 words, 2000 chars | 3 |

---

### 10. Scaling & Infrastructure

| Question ID | Question | Type | Limits | Lots |
|-------------|----------|------|--------|------|
| `scaling` | Service can scale? | Boolean | - | 1 |
| `scalingType` | Scaling type | Radios | Auto/Manual/Both | 1 |
| `independenceOfResources` | Resource independence | Textbox | 100 words, 1000 chars | 1, 2 |
| `virtualisation` | Virtualisation used? | Boolean | - | 1 |
| `virtualisationTechnologiesUsed` | Virtualisation technologies | Checkboxes | VMware, Hyper-V, etc. | 1 |
| `virtualisationSeparation` | Virtualisation separation | Textbox | 100 words, 1000 chars | 1, 2 |
| `cloudDeploymentModel` | Deployment model | Radios | Public/Private/Hybrid/Community | 2 |
| `usageNotifications` | Usage notifications available? | Boolean | - | 1 |
| `usageNotificationsHow` | How notifications are sent | Textbox | 200 words, 2000 chars | 1 |
| `serviceAddOn` | Service available as add-on? | Boolean | - | 1, 2 |
| `serviceAddOnDetails` | Describe add-on details | Textbox | 50 words, 500 chars | 2 |

---

### 11. Networks & Connectivity

| Question ID | Question | Type | Limits | Lots |
|-------------|----------|------|--------|------|
| `publicSectorNetworks` | Connect to public sector networks? | Boolean | - | 2 |
| `publicSectorNetworksTypes` | Which networks | Checkboxes | PSN, HSCN, Janet, etc. | 2 |

---

### 12. Documentation

| Question ID | Question | Type | Limits | Lots |
|-------------|----------|------|--------|------|
| `documentation` | Documentation provided? | Boolean | - | All |
| `documentationFormats` | Documentation formats | Checkboxes | HTML, PDF, etc. | All |
| `documentationAccessibility` | Documentation accessibility | Boolean | - | All |
| `documentationAccessibilityDescription` | Describe doc accessibility | Textbox | 200 words, 2000 chars | All |
| `serviceDefinitionDocumentURL` | SDD URL | URL | Valid URL | All |
| `termsAndConditionsDocumentURL` | T&Cs URL | URL | Valid URL | All |
| `sfiaRateDocumentURL` | SFIA rate card URL | URL | Valid URL (optional) | All |

---

## Declaration Questions (57 total)

### Mandatory Exclusion Grounds

These require "No" to pass (5 questions):

| Question ID | Question | Category |
|-------------|----------|----------|
| `conspiracy` | Conspiracy convictions (last 5 years) | Criminal |
| `corruptionBribery` | Corruption or bribery convictions | Criminal |
| `fraudAndTheft` | Fraud or theft convictions | Criminal |
| `terrorism` | Terrorism-related convictions | Criminal |
| `organisedCrime` | Organised crime convictions | Criminal |

### Discretionary Exclusion Grounds

| Question ID | Question | Category |
|-------------|----------|----------|
| `taxEvasion` | Tax evasion offences | Tax |
| `unspentTaxConvictions` | Unspent tax convictions | Tax |
| `GAAR` | Notified under General Anti-Abuse Rule? | Tax |
| `bankrupt` | Bankruptcy or insolvency | Financial |
| `graveProfessionalMisconduct` | Grave professional misconduct | Professional |
| `distortedCompetition` | Distorted competition | Legal |
| `distortingCompetition` | Distorting competition | Legal |
| `conflictOfInterest` | Conflict of interest | Legal |
| `significantOrPersistentDeficiencies` | Deficient prior contract performance | Performance |
| `seriousMisrepresentation` | Serious misrepresentation | Legal |
| `influencedContractingAuthority` | Influenced contracting authority | Legal |
| `misleadingInformation` | Provided misleading information | Legal |
| `witheldSupportingDocuments` | Withheld supporting documents | Legal |
| `environmentalSocialLabourLaw` | Environmental/social/labour law breaches | Compliance |
| `confidentialInformation` | Obtained confidential information for undue advantage | Legal |

### Mitigating Factors

| Question ID | Question |
|-------------|----------|
| `mitigatingFactors` | Mitigating circumstances for exclusion grounds |
| `mitigatingFactors2` | Additional mitigating factors |
| `mitigatingFactors3` | Further mitigating factors |

### Modern Slavery

| Question ID | Question |
|-------------|----------|
| `modernSlaveryTurnover` | Annual turnover £36m+? |
| `modernSlaveryReportingRequirements` | Published modern slavery statement? |
| `modernSlaveryStatement` | Modern slavery statement URL |
| `modernSlaveryStatementOptional` | Optional statement if under threshold |

### Insurance

| Question ID | Question | Requirement |
|-------------|----------|-------------|
| `employersInsurance` | Employers liability insurance (£5m minimum) | Mandatory |

### What It Means to Be on G-Cloud 13

| Question ID | Question |
|-------------|----------|
| `unfairCompetition` | No collusion or canvassing (fair competition declaration) |
| `canProvideFromDayOne` | Can provide services from day one? |
| `termsAndConditions` | Accept framework T&Cs? |
| `termsOfParticipation` | Accept terms of participation? |
| `10WorkingDays` | Can respond to requirements in 10 working days? |
| `accurateInformation` | Information accurate and complete? |
| `accuratelyDescribed` | Services accurately described? |
| `publishContracts` | Accept contract publication? |
| `servicesDoNotInclude` | Services exclude prohibited items? |
| `proofOfClaims` | Can provide evidence for claims? |
| `informationChanges` | Will notify of changes? |
| `readUnderstoodGuidance` | Read and understood guidance? |
| `understandHowToAskQuestions` | Know how to ask questions? |
| `understandTool` | Understand the submission tool? |
| `helpBuyersComplyTechnologyCodesOfPractice` | Help buyers comply with TCoP? |
| `MI` | Accept management information requirements? |
| `fullAccountability` | Accept full accountability? |
| `equalityAndDiversity` | Equality and diversity compliance? |
| `environmentallyFriendly` | Environmental sustainability? |

### Service Type

| Question ID | Question |
|-------------|----------|
| `servicesHaveOrSupportCloudHostingCloudSoftware` | Services are cloud hosting/software? |
| `servicesHaveOrSupportCloudSupport` | Services are cloud support? |
| `offerServicesYourselves` | Offer services yourself (not just resell)? |
| `subcontracting` | Will use subcontractors? |
| `resellingOrganisations` | Reselling other organisations' services? |
| `resellingType` | Type of reselling |

### Contact Information

| Question ID | Question |
|-------------|----------|
| `primaryContact` | Primary contact name |
| `primaryContactEmail` | Primary contact email |
| `contactNameContractNotice` | Contract notice contact name |
| `contactEmailContractNotice` | Contract notice contact email |
| `dunsNumberCompanyRegistrationNumber` | DUNS/Company registration number |

---

## Key Validation Rules

### Character/Word Limits

| Field Type | Limit |
|------------|-------|
| Service name | 100 characters |
| Service description | 50 words, 500 characters |
| Features/Benefits | 10 items max, 10 words each, 100 chars each |
| Textbox (small) | 50 words, 500 characters |
| Textbox (medium) | 100 words, 1000 characters |
| Textbox (large) | 200 words, 2000 characters |
| Support levels | 200 words, 2000 characters |

### Category Limits

| Lot | Max Categories |
|-----|---------------|
| Lot 1 - Cloud Hosting | 10 |
| Lot 2 - Cloud Software | 20 |
| Lot 3 - Cloud Support | 6 |

---

## References

- Source Repository: https://github.com/Crown-Commercial-Service/digitalmarketplace-frameworks
- Digital Marketplace: https://www.digitalmarketplace.service.gov.uk/
- G-Cloud Supplier Guide: https://www.gov.uk/guidance/g-cloud-suppliers-guide
