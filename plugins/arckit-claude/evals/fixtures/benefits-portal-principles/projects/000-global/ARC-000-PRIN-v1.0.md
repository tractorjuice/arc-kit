# Ashcombe District Council Enterprise Architecture Principles

> **Template Origin**: Official | **ArcKit Version**: 6.16.5 | **Command**: `/arckit:principles`

## Document Control

| Field | Value |
|-------|-------|
| **Document ID** | ARC-000-PRIN-v1.0 |
| **Document Type** | Architecture Principles |
| **Project** | Ashcombe District Council Housing Benefits Digital Service (Project 000 - Global) |
| **Classification** | OFFICIAL |
| **Status** | DRAFT |
| **Version** | 1.0 |
| **Created Date** | 2026-09-29 |
| **Last Modified** | 2026-09-29 |
| **Review Cycle** | Annual |
| **Next Review Date** | 2027-09-29 |
| **Owner** | Head of Digital |
| **Reviewed By** | PENDING |
| **Approved By** | PENDING |
| **Distribution** | Digital and ICT teams, service owners, delivery partners and suppliers under contract |

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| 1.0 | 2026-09-29 | ArcKit AI | Initial creation from `/arckit:principles` command | PENDING | PENDING |

---

## Executive Summary

This document establishes the principles governing all technology architecture decisions for Ashcombe District Council's housing-benefits digital service and the wider digital estate it depends on. These principles ensure consistency, security, accessibility, value for public money and alignment with the Council's strategy across all projects and initiatives.

**Scope**: All technology projects, systems, and initiatives that support the housing-benefits service, including those delivered by suppliers and shared-service partners
**Authority**: Architecture Review Board, chaired by the Head of Digital
**Compliance**: Mandatory unless an exception is approved through the process in Section VI

**Context**: The housing-benefits service pays public money to residents who are often on low incomes or vulnerable, using their most sensitive personal and financial data. It must interoperate with national government data services and landlords, be accessible to every resident, and stand up to external audit. The principles below reflect that context: citizen outcomes, data protection, financial integrity and accessibility carry particular weight.

**Philosophy**: These principles are **technology-agnostic**. They describe WHAT qualities the architecture must have, not HOW to implement them with specific products. Technology selection happens during research and design phases guided by these principles. Where a principle refers to a law, standard or Government guidance, it names the obligation, not a product that meets it.

**Keywords**: MUST, SHOULD and MAY are used as in RFC 2119. MUST is mandatory (exception required to deviate); SHOULD is expected unless there is a recorded reason; MAY is optional.

---

## I. Strategic Principles

### 1. Citizen-Centred, Inclusive Service

**Principle Statement**:
All citizen-facing services MUST be designed around verified user needs, MUST be usable by everyone who is entitled to use them (including disabled people and people with limited digital access or skills), and MUST meet the applicable public-sector accessibility requirements.

**Rationale**:
Housing-benefit claimants include older people, disabled people, people in crisis and people with limited digital confidence. A service that excludes them fails its purpose, increases avoidable contact and hardship, and breaches statutory accessibility and equality duties. Designing from user need also reduces rework and failed claims.

**Implications**:

- User research with real claimants and caseworkers informs design before build and throughout live running
- Accessibility is a design and testing requirement from the start, not a pre-launch audit
- A non-digital or assisted route MUST exist for people who cannot use the online service, and MUST reach the same outcome
- Services follow the Government Digital Service Standard and use shared government design patterns where they fit
- Plain language is used for all citizen-facing content, correspondence and error messages
- Service performance is measured by user outcomes (claims completed, time to decision, avoidable contact), not only by system metrics

**Validation Gates**:

- [ ] User needs documented and evidenced by research with the intended users
- [ ] Accessibility conformance tested against the required standard, using assistive technology and manual testing, not automated tooling alone
- [ ] Accessibility statement published and maintained
- [ ] Assisted-digital and non-digital routes defined, resourced and tested
- [ ] User-outcome measures defined and reported
- [ ] Equality impact considered and recorded

**Good Example**:
A claim form is tested with screen-reader users and people with low digital confidence, saves progress so a claimant can return later, and a telephone route completes the same claim record with the same rules.

**Bad Example**:
A single-page online form that times out after a short period, cannot be completed without a mobile phone, and has no alternative route for people who cannot use it.

**Common Violations**:

- Treating accessibility as a checklist run just before go-live
- Building for the internal caseworker workflow and neglecting the citizen journey
- Providing an assisted route that produces a slower or lower-quality outcome

---

### 2. Security by Design (NON-NEGOTIABLE)

**Principle Statement**:
All architectures MUST implement defence-in-depth security with zero-trust principles. Security is NOT a feature to be added later. It is a foundational requirement and is aligned with National Cyber Security Centre (NCSC) guidance for public-sector organisations.

**Rationale**:
The service holds identity, income, tenancy, bank and household data for a large part of the local population, and pays out public money, making it a target for fraud and cyber attack. A breach harms residents directly and carries legal, financial and reputational consequences for the Council.

**Implications**:

- Threat modelling happens during design, not after build
- Every request is authenticated and authorised, including service-to-service calls
- Security controls are traced to requirements and tested like any other requirement
- Security debt is tracked and prioritised alongside functional work
- Suppliers and shared-service partners are held to equivalent security standards through contract
- Security incidents are reported and handled through a rehearsed process, including notification to the regulator where required

**Zero Trust Pillars**:

1. **Identity-Based Access**: No network-based trust; every request authenticated
2. **Least Privilege**: Grant minimum necessary permissions, time-boxed where possible
3. **Encryption Everywhere**: Data encrypted in transit and at rest
4. **Continuous Verification**: Monitor, log, and analyse all access patterns

**Mandatory Controls**:

- [ ] Multi-factor authentication for all staff and administrative access
- [ ] Citizen identity assurance proportionate to the risk of the transaction, using government-recommended approaches
- [ ] Service-to-service authentication (mutual authentication, signed tokens, or equivalent)
- [ ] Secrets management via a secure vault (never in code or configuration files)
- [ ] Network segmentation with minimal trust zones
- [ ] Encryption at rest for all data stores
- [ ] Encrypted transport for all network communication
- [ ] Structured logging of all authentication and authorisation events, and of all access to claimant records
- [ ] Regular security testing (independent penetration testing, vulnerability scanning) and timely patching
- [ ] Segregation of duties between those who can create, approve and pay awards

**Compliance Frameworks**:

- NCSC Cyber Assessment Framework and Secure by Design guidance
- Cyber Essentials Plus as a minimum baseline for the Council and its suppliers
- ISO/IEC 27001 alignment for information security management
- UK GDPR and the Data Protection Act 2018
- Government Security Classifications policy
- Public Sector Network and national data-sharing conditions applicable to connecting to national government services

**Exceptions**:

- NONE. Security principles are non-negotiable.
- Specific control implementations may vary with compensating controls approved by the Senior Information Risk Owner (SIRO).

**Validation Gates**:

- [ ] Threat model completed and reviewed
- [ ] Security controls mapped to requirements
- [ ] Security testing plan defined and independent test completed before go-live
- [ ] Incident response runbook created and rehearsed
- [ ] Supplier security assurance obtained and recorded

**Good Example**:
An internal caseworker tool requires multi-factor sign-in, gives each role only the records it needs, and every view of a claimant record is logged and reviewable.

**Bad Example**:
A shared administrator account used by a team, with credentials stored in a configuration file and no record of who viewed which claim.

**Common Violations**:

- Granting broad standing access "for convenience" and never reviewing it
- Treating the internal network as a trusted zone
- Deferring security testing to the end of the project and then compressing it

---

### 3. Resilience and Fault Tolerance

**Principle Statement**:
All systems MUST gracefully degrade when dependencies fail and recover automatically without data loss or manual intervention. Services on which benefit payments and citizen support depend MUST continue to operate, at least in a degraded mode, through component failure.

**Rationale**:
Failures are inevitable in distributed systems and in the national services the Council depends on. Claimants rely on timely payments to pay rent, so an outage or lost transaction can lead directly to arrears and hardship. The architecture must assume failures will occur and design for resilience rather than perfect reliability.

**Implications**:

- Use protective patterns for external dependencies (circuit breaking, timeouts, bounded retries with back-off)
- Graceful degradation when non-critical services fail (for example, reading claim status continues when document upload is unavailable)
- Automated health checks and recovery
- Failures in one component are isolated from others
- Manual fallback procedures exist for critical payment and decision processes and are rehearsed
- Dependence on a single external supplier or national service has a documented contingency

**Validation Gates**:

- [ ] Failure modes identified and mitigated
- [ ] Fault injection or resilience testing performed
- [ ] Recovery Time Objective (RTO) and Recovery Point Objective (RPO) defined
- [ ] Automated failover tested
- [ ] Degraded-mode behaviour documented and agreed with the service owner
- [ ] Business continuity plan covers the service and has been exercised

**Good Example**:
When an external eligibility data service is unavailable, the portal accepts the claim, records that verification is pending, tells the claimant what happens next, and completes verification automatically when the service returns.

**Bad Example**:
The entire claim submission fails with a generic error because one downstream check timed out.

**Common Violations**:

- No timeouts on external calls, allowing one slow dependency to exhaust capacity
- Recovery procedures that exist on paper but have never been run
- Backups that are taken but never restored in a test

---

### 4. Scalability and Elasticity

**Principle Statement**:
All systems MUST be designed to scale horizontally to meet demand, with the ability to adjust capacity based on load without architectural change.

**Rationale**:
Housing-benefit demand is uneven and driven by external events such as policy change, migration between benefits, economic shocks and end-of-period deadlines. Systems must handle both sustained growth and short peaks without manual intervention, and without paying for peak capacity all year.

**Implications**:

- Design for stateless components that can be replicated
- Avoid hard-coded limits or fixed capacity assumptions
- Distribute load across multiple instances
- Adjust capacity automatically or through a documented, rehearsed process based on demand metrics
- Capacity and cost models account for variable demand

**Validation Gates**:

- [ ] System can scale horizontally (add more instances)
- [ ] No single points of failure that limit scaling
- [ ] Load testing demonstrates capacity growth with added resources
- [ ] Scaling metrics and triggers defined
- [ ] Cost model accounts for variable capacity

**Good Example**:
The portal is load-tested at several times normal claim volume and adds capacity automatically when a policy announcement drives a surge of enquiries.

**Bad Example**:
A single fixed-size server that has to be manually replaced with a larger one when volumes grow.

**Common Violations**:

- Storing user session state on a single instance
- Sizing only for average load
- Scaling the front end while a single shared component remains the bottleneck

---

### 5. Interoperability and Open Standards

**Principle Statement**:
All systems MUST expose and consume functionality through well-defined, versioned interfaces using open, industry-standard protocols and formats. Direct database access across system boundaries is prohibited.

**Rationale**:
The service must exchange data with national government services, landlords, other councils, payment services and case-management systems. Open standards reduce integration cost, avoid supplier lock-in and let components be replaced independently.

**Implications**:

- Use open, documented protocols and data formats; prefer government-recommended standards and shared data definitions
- Version all interfaces with a backward-compatibility strategy
- Publish interface specifications (contracts, event schemas)
- Prefer existing government platforms and shared services for common needs before building bespoke integrations
- Data exported from any system MUST be available in an open, machine-readable format

**Validation Gates**:

- [ ] Interface specifications published
- [ ] Versioning strategy defined
- [ ] Authentication and authorisation model documented
- [ ] Error handling and retry behaviour specified
- [ ] No direct database coupling across systems
- [ ] Open, machine-readable export available

**Good Example**:
A case-management system publishes a versioned interface for claim status. The portal, the caseworker tool and a reporting service all consume it, and a new version is introduced without breaking existing consumers.

**Bad Example**:
A reporting tool reads directly from another team's database tables, so a schema change silently breaks it.

**Common Violations**:

- Proprietary formats with no export route
- Undocumented "temporary" interfaces that become permanent
- Breaking changes released without notice or versioning

---

### 6. Observability and Operational Excellence

**Principle Statement**:
All systems MUST emit structured telemetry (logs, metrics, traces) enabling real-time monitoring, troubleshooting, capacity planning and audit.

**Rationale**:
We cannot operate what we cannot observe. Instrumentation is a first-class architectural requirement. For a service handling public money, telemetry also underpins incident response, fraud detection and evidence for auditors.

**Implications**:

- Telemetry is designed alongside features, not bolted on before go-live
- Every service propagates correlation and trace identifiers across calls
- Alerts are tied to Service Level Objectives and each has a runbook
- Operational readiness is a release criterion
- Telemetry MUST NOT expose personal data unnecessarily; logs are minimised and access-controlled

**Telemetry Requirements**:

- **Logging**: Structured logs with correlation IDs
- **Metrics**: Request volume, latency percentiles (p50, p95, p99), error rates
- **Tracing**: Distributed trace context for request flows
- **Alerting**: Service Level Objective (SLO)-based alerting with actionable runbooks

**Required Instrumentation**:

- Request volume, latency distribution, error rate
- Resource utilisation (compute, memory, storage, network)
- Service metrics (claims started, completed and abandoned, time to decision, backlog age)
- Security events (authentication failures, policy violations, suspicious patterns)

**Log Retention**:

- **Security and audit logs**: As required by legal obligations and the Council's retention schedule
- **Application logs**: Sufficient for troubleshooting, kept for the shortest period that meets that need
- **Metrics**: Long-term trends with aggregation

**Validation Gates**:

- [ ] Logging, metrics, tracing instrumented
- [ ] Dashboards and alerts configured
- [ ] Service Level Objectives (SLOs) and Service Level Indicators (SLIs) defined
- [ ] Runbooks created for common failure scenarios
- [ ] Capacity planning metrics tracked
- [ ] Logs reviewed for unnecessary personal data

**Good Example**:
A rise in failed claim submissions triggers an alert with a runbook, and the correlation identifier lets support trace the request across every component without reading claimant details.

**Bad Example**:
Support learns of an outage from residents phoning the contact centre, then greps unstructured logs that contain full claimant records.

**Common Violations**:

- Alerting on every metric so that alerts are ignored
- Logging full personal data "to help debugging"
- No owner for dashboards and alerts after go-live

---

### 7. Reuse, Value for Money and Avoiding Lock-in

**Principle Statement**:
Before building or buying, teams MUST assess whether an existing government, shared-service or Council capability can meet the need. Solutions MUST demonstrate value for public money over their whole life, and MUST preserve the Council's ability to change supplier or approach.

**Rationale**:
Council budgets are constrained and public money must be spent well. Duplicating existing capabilities and becoming locked into a single supplier increases cost, risk and inflexibility. Government guidance expects reuse and open working before new build.

**Implications**:

- A documented reuse assessment (existing platforms, shared services, open-source and other public-sector code) precedes any new build or procurement
- Whole-life cost (build, run, licences, exit) is compared across options, not just initial price
- Contracts MUST secure Council ownership of, and access to, its data, configuration and (where commissioned) source code
- An exit and portability plan is defined before a solution is committed to
- Where practical, source code funded by the Council is made open, unless security or law prevents it
- Procurement follows applicable public procurement rules and the routes available to local authorities

**Validation Gates**:

- [ ] Reuse assessment completed and recorded
- [ ] Options compared on whole-life cost and risk
- [ ] Data portability and exit plan documented
- [ ] Data ownership and access secured in the contract
- [ ] Open-source or open-standards alternatives considered

**Good Example**:
The team finds an existing public-sector component for a common need, adopts it, and contributes improvements back rather than commissioning a bespoke equivalent.

**Bad Example**:
A proprietary platform is chosen for a small need with no data export route, making a later change of supplier prohibitively expensive.

**Common Violations**:

- Assuming "build" or "buy" before comparing options
- Ignoring exit costs and data-return terms at contract award
- Customising a product so heavily that upgrades are no longer feasible

---

### 8. Financial Integrity and Auditability

**Principle Statement**:
Every decision, calculation, change and payment affecting a benefit award MUST be traceable, reproducible and tamper-evident, with the ability to show who did what, when, on what evidence and under which rule version.

**Rationale**:
Housing-benefit awards are public money that is subject to statutory rules, external audit, subsidy claims and appeal. Errors and fraud have direct financial and legal consequences, and claimants have the right to challenge decisions. Without an auditable record the Council cannot defend correct decisions or correct wrong ones.

**Implications**:

- Award decisions retain the inputs, rules version and outcome so any decision can be reproduced later
- Changes to records are captured as auditable events, not silent overwrites
- Audit records are protected from modification, including by administrators
- Financial transactions maintain integrity (complete, correct, exactly-once effect) across system boundaries
- Reconciliation between decision, payment and ledger records is automated and reviewed
- Controls for fraud and error prevention are designed in and evidenced
- Evidence needed for appeals, ombudsman enquiries and external audit is retrievable within agreed time

**Validation Gates**:

- [ ] Audit trail covers create, change, approve and pay events with actor and time
- [ ] Rule and configuration versions recorded against each decision
- [ ] Audit records are immutable to normal users and administrators
- [ ] Automated reconciliation between decision and payment records in place
- [ ] Segregation of duties enforced and tested
- [ ] Audit evidence retrieval rehearsed

**Good Example**:
An auditor selects a past award and the system shows the evidence supplied, the rule version applied, the calculation, the approver, and the payment record.

**Bad Example**:
A caseworker edits an award amount directly in a data store, leaving no record of the previous value or the reason.

**Common Violations**:

- Overwriting values rather than recording changes
- Rules changed in place with no version history
- Audit logs held on the same systems and under the same control as those being audited

---

### 9. Accountable Use of Automation and AI

**Principle Statement**:
Automated decision-making, algorithmic tools and AI MUST remain under accountable human control. Decisions that significantly affect a person's entitlement MUST NOT be made solely by automated means unless the law permits it and safeguards, transparency and a route to human review are in place.

**Rationale**:
Automation can speed up claims and detect errors, but failures can wrongly deny support to vulnerable people at scale and erode public trust. UK data protection law restricts solely automated significant decisions, and public bodies are expected to be transparent about algorithmic tools they use.

**Implications**:

- Each automated or AI-assisted process has a named accountable owner
- The level of human oversight is defined and proportionate to the impact on the individual
- Citizens are told when automation is used and how to request human review
- Algorithmic tools are assessed for bias, fairness and accuracy before and during use
- Government transparency and assurance expectations for algorithmic tools and AI are followed and published where they apply
- Automated fraud or risk flags MUST prompt human review, not automatic refusal or sanction

**Validation Gates**:

- [ ] Accountable owner named for each automated decision process
- [ ] Human oversight level defined and justified
- [ ] Impact and bias assessment completed
- [ ] Citizen notification and human-review route documented
- [ ] Transparency record published where applicable
- [ ] Monitoring for drift and unintended outcomes in place

**Good Example**:
An automated check flags a possible change in circumstances, a caseworker reviews the evidence, and the claimant is told the reason and how to challenge the outcome.

**Bad Example**:
A risk score automatically suspends payments to residents above a threshold, with no explanation or review route.

**Common Violations**:

- Treating a human "approve" click as oversight when the reviewer cannot realistically challenge the output
- Deploying a third-party AI feature without understanding its data use or failure modes
- No monitoring after go-live

---

## II. Data Principles

### 10. Privacy and Data Protection by Design

**Principle Statement**:
All systems that process personal data MUST embed data protection by design and by default, comply with UK GDPR and the Data Protection Act 2018, and process only the minimum personal data needed for a defined lawful purpose.

**Rationale**:
Housing-benefit data includes financial, household, health and tenancy information about people who may be vulnerable. Failure to protect it harms individuals and exposes the Council to regulatory action and loss of trust.

**Implications**:

- A lawful basis and purpose are recorded for each processing activity
- A Data Protection Impact Assessment is completed before processing begins where the risk warrants it, as is normal for benefit and welfare data
- Data collected is limited to what is needed; optional data is not made mandatory
- Data-sharing with national government, landlords and other bodies is covered by documented agreements
- Individuals' rights (access, rectification, objection and others) can be met within statutory time limits
- The Data Protection Officer is consulted at design stage
- Test and development environments use synthetic or anonymised data

**Validation Gates**:

- [ ] Lawful basis and purpose documented for each processing activity
- [ ] Data Protection Impact Assessment completed and approved where required
- [ ] Data minimisation reviewed against the collected fields
- [ ] Data-sharing agreements in place for every external flow
- [ ] Mechanisms for data-subject rights tested
- [ ] Data Protection Officer consulted

**Good Example**:
The claim form asks only for information that the assessment rules require, explains why each item is needed, and records the lawful basis and sharing agreements alongside the design.

**Bad Example**:
A form collects a full history of documents "in case they are useful" and the data is shared with a supplier without an agreement.

**Common Violations**:

- Using live claimant data in test environments
- Reusing data for a new purpose without checking compatibility
- Being unable to find all copies of a person's data when a request is received

---

### 11. Data Classification, Residency and Retention

**Principle Statement**:
Data classification, residency, retention and access controls MUST comply with legal requirements, the Government Security Classifications policy and the Council's records-management policy.

**Rationale**:
Regulatory breaches carry legal, financial and reputational penalties, and data held without clear ownership or retention rules becomes a liability. Governance decided up front is far cheaper than remediation after an incident or audit.

**Implications**:

- Every data store has a named owner and a classification before it goes live
- Hosting and backup locations are chosen to meet residency and legal obligations, including the protection required for transfers outside the UK
- Retention periods are set per record type in the Council's retention schedule and enforced automatically
- Access follows least privilege and is reviewed periodically
- Information is available to meet Freedom of Information and subject-access obligations, and the public-records obligations of the Council

**Data Classification Tiers**:

1. **Public**: No restrictions (published guidance, statistics)
2. **OFFICIAL**: Routine Council business information with standard handling
3. **OFFICIAL-SENSITIVE**: Personal, financial and special-category data (claimant records, income, health, safeguarding markers) requiring enhanced handling and need-to-know access
4. **Above OFFICIAL-SENSITIVE**: Not expected within this service; any such need MUST be escalated to the SIRO before design proceeds

**Data Residency**:

- Personal data MUST reside in the UK, or in jurisdictions with lawful transfer protection recognised under UK data protection law
- Transfers outside the UK require a documented legal basis and risk assessment approved by the Data Protection Officer

**Data Retention**:

- Automatic deletion or review at the end of the defined retention period
- Legal hold process for litigation, investigation and audit
- Backup retention aligned with the retention schedule and recovery requirements

**Validation Gates**:

- [ ] Data classification performed for all data stores
- [ ] Residency requirements mapped to infrastructure
- [ ] Retention policies configured with automated deletion or review
- [ ] Access controls enforce least privilege and need-to-know
- [ ] Data owner named for each store

**Good Example**:
Claim evidence is classified OFFICIAL-SENSITIVE, hosted in the UK, retained for the period in the retention schedule, and deleted automatically with a record of the deletion.

**Bad Example**:
Documents are kept indefinitely "because storage is cheap", with no owner and no retention date.

**Common Violations**:

- Backups held in a different location from primary data with no residency check
- Retention set by the supplier's default rather than the Council's schedule
- No process for placing a legal hold

---

### 12. Data Quality and Lineage

**Principle Statement**:
Data pipelines and records MUST maintain defined data quality standards and provide end-to-end lineage for auditability and troubleshooting.

**Rationale**:
Entitlement decisions, subsidy claims and performance reports are only as reliable as the data behind them. Without lineage, errors cannot be traced to their source and the impact of a change cannot be assessed.

**Implications**:

- Quality rules are defined with data owners and checked automatically at capture and in pipelines
- Producers and consumers agree data contracts before integration
- Lineage metadata is captured as data moves, not reconstructed afterwards
- Quality failures are visible to the data owner and block downstream use where material
- Data supplied by claimants is validated at entry and verified against authoritative sources where they exist

**Quality Standards**:

- **Completeness**: No unexpected gaps in required fields
- **Consistency**: Cross-system data reconciliation
- **Accuracy**: Validation rules and constraints enforced at source
- **Timeliness**: Freshness Service Level Agreements (SLAs) defined and monitored

**Lineage Requirements**:

- Source-to-target mapping documented for all data flows
- Transformation logic version-controlled and reviewable
- Data quality metrics tracked per pipeline
- Impact analysis capability for schema changes

**Validation Gates**:

- [ ] Data quality rules defined and automated
- [ ] Lineage metadata captured and queryable
- [ ] Data contracts between producers and consumers
- [ ] Schema evolution strategy documented

**Good Example**:
A change to how income is recorded triggers an impact analysis that identifies every report and interface using it before the change is released.

**Bad Example**:
Two reports show different caseload totals because each applies its own undocumented filtering.

**Common Violations**:

- Correcting errors downstream rather than at source
- Undocumented transformations in spreadsheets
- No owner for data quality issues

---

### 13. Single Source of Truth

**Principle Statement**:
Every data domain MUST have a single authoritative source. Derived copies MUST be clearly labelled and synchronised.

**Rationale**:
Multiple authoritative sources create inconsistency, reconciliation overhead and data integrity issues. For benefit records, conflicting versions can lead to over- or under-payment and to unreliable responses to citizens.

**Implications**:

- Identify the system of record for each data domain (for example, claimant identity, claim, award, payment, landlord)
- Derived and cached copies are read-only and clearly labelled as such
- Synchronisation strategy defined for all derived copies
- Avoid bidirectional synchronisation without a conflict-resolution strategy
- Shared reference data (such as property and address data) has a designated master

**Validation Gates**:

- [ ] System of record identified for each data entity
- [ ] Derived copies documented with synchronisation frequency
- [ ] No bidirectional synchronisation without conflict-resolution strategy
- [ ] Master data management strategy for shared reference data

**Good Example**:
The case-management system is the only place an award amount is changed. The portal and reports read from it and show when the data was last refreshed.

**Bad Example**:
Caseworkers correct a claimant's address in three systems, and each holds a different value.

**Common Violations**:

- Spreadsheet extracts becoming the working record
- Two systems both accepting updates to the same field
- Copies with no indication of freshness

---

## III. Integration Principles

### 14. Loose Coupling

**Principle Statement**:
Systems MUST be loosely coupled through published interfaces, avoiding shared databases, shared file stores or tight runtime dependencies.

**Rationale**:
Loose coupling enables independent deployment, supplier and technology diversity, team autonomy and system evolution without breaking dependencies. It also allows the Council to replace a component without replacing the whole service.

**Implications**:

- Communicate through published interfaces or asynchronous events
- No direct database access across system boundaries
- Each system manages its own data lifecycle
- Shared libraries are kept minimal (favour duplication over coupling)
- Avoid distributed transactions across systems

**Validation Gates**:

- [ ] Systems communicate via interfaces or events, not shared data stores
- [ ] No shared mutable state
- [ ] Each system has an independent data store
- [ ] Deployment of one system does not require deployment of another
- [ ] Interface changes versioned with backward compatibility

**Good Example**:
A supplier replaces the document-storage component. Because the rest of the service uses a published interface, no other component changes.

**Bad Example**:
Two systems share database tables, so neither can change its data model without breaking the other.

**Common Violations**:

- "Read-only" direct database access that becomes a hidden dependency
- Supplier-specific behaviour leaking into the wider design
- Release schedules locked together by shared components

---

### 15. Asynchronous Communication

**Principle Statement**:
Systems SHOULD use asynchronous communication for non-real-time interactions to improve resilience and decoupling.

**Rationale**:
Asynchronous patterns reduce temporal coupling, improve fault tolerance and enable better scalability. Many benefit processes, such as evidence checks and notifications, are naturally asynchronous.

**Implications**:

- Message and event schemas are versioned and published like interfaces
- Consumers are idempotent, because messages may be delivered more than once
- Delivery guarantees, ordering and failed-message handling are decided per flow
- User journeys that span asynchronous steps show status rather than block

**When to Use Async**:

- Non-real-time business processes (evidence verification, notifications, batch reconciliation)
- Event notification and publish/subscribe patterns
- Long-running operations that do not require an immediate response
- Integration with unreliable or slow external systems

**When Synchronous is Acceptable**:

- Real-time user interactions requiring immediate feedback
- Query operations (read-only, idempotent)
- Transactions requiring immediate consistency

**Validation Gates**:

- [ ] Async patterns used for non-real-time flows
- [ ] Message durability and delivery guarantees defined
- [ ] Event schemas versioned and published
- [ ] Failed-message handling and alerting configured

**Good Example**:
Submitting a claim returns a reference immediately, and verification, notification and assessment proceed asynchronously with status visible to the claimant.

**Bad Example**:
The citizen waits on a screen while five back-end systems are called one after another.

**Common Violations**:

- Assuming each message is delivered exactly once
- Failed messages that are dropped silently
- Asynchronous flows with no way for the user to see progress

---

## IV. Quality Attributes

### 16. Performance and Efficiency

**Principle Statement**:
All systems MUST meet defined performance targets under expected load with efficient use of computational resources.

**Rationale**:
Slow services drive residents to costlier channels such as telephone and face-to-face contact, and erode trust. Inefficient systems waste money and energy. Performance that is not specified up front is rarely achieved later.

**Performance Targets** (define for each system):

- **Response Time**: p50, p95, p99 latency targets, including on low-bandwidth and mobile connections
- **Throughput**: Requests per second, transactions per minute
- **Concurrency**: Simultaneous user and request capacity
- **Resource Efficiency**: Compute and memory utilisation targets

**Implications**:

- Performance requirements defined before implementation
- Load testing performed before production deployment
- Performance monitoring continuous, not just point-in-time
- Hot paths identified through profiling are optimised
- Caching strategies for expensive operations
- Page weight and client requirements suit the devices residents actually use

**Validation Gates**:

- [ ] Performance requirements defined with measurable targets
- [ ] Load testing performed at expected capacity
- [ ] Performance metrics monitored in production
- [ ] Capacity planning model defined

**Good Example**:
Targets are set for the claim journey on a low-cost phone on a poor connection and are checked in every release.

**Bad Example**:
Performance is only tested on office desktops on the Council network.

**Common Violations**:

- Targets defined as averages that hide long waits
- Load testing with unrepresentative data volumes
- No performance regression check in the release process

---

### 17. Availability and Reliability

**Principle Statement**:
All systems MUST meet defined availability targets with automated recovery and minimal data loss.

**Rationale**:
Outages stop residents completing essential tasks and push demand onto other channels, and can delay payments. Availability targets set by business impact let investment in resilience match what each service actually needs.

**Implications**:

- Availability, RTO and RPO targets are agreed with the service owner per system
- Resilience patterns are chosen to meet those targets, not maximised by default
- Recovery procedures are automated where possible and rehearsed regularly
- Planned maintenance is designed to avoid user-facing downtime, or is scheduled to minimise impact on claimants

**Availability Targets** (define for each system):

- **Uptime SLA**: Agreed per service according to impact (for example, higher for payment processing than for reporting)
- **Recovery Time Objective (RTO)**: Maximum acceptable downtime
- **Recovery Point Objective (RPO)**: Maximum acceptable data loss

**High Availability Patterns**:

- Redundancy across separate failure domains (for example, separate data centres or availability zones)
- Automated health checks and failover
- Active-active or active-passive configurations as justified by targets
- Regular disaster recovery testing

**Validation Gates**:

- [ ] Availability SLA defined
- [ ] RTO and RPO requirements documented
- [ ] Redundancy strategy implemented
- [ ] Failover tested regularly
- [ ] Backup and restore procedures validated

**Good Example**:
The payment run has a tighter recovery objective than the reporting service, and each is tested against its own target.

**Bad Example**:
A uniform "99.99%" target is stated for every system, but no one has costed it or tested it.

**Common Violations**:

- Availability figures quoted by a supplier that exclude planned downtime
- Backups never restored in a rehearsal
- Redundancy that shares a single failure domain

---

### 18. Maintainability and Evolvability

**Principle Statement**:
All systems MUST be designed for change, with clear separation of concerns, modular architecture and current documentation.

**Rationale**:
Software spends most of its lifetime in maintenance, and benefit rules change frequently with legislation and policy. Design decisions should optimise for understandability and modifiability, and reduce dependence on individual people.

**Implications**:

- Modular architecture with clear boundaries
- Separation of concerns (business rules, data access, presentation)
- Business rules are configurable or clearly isolated so that legislative changes can be applied quickly and safely
- Code is self-documenting with meaningful names
- Architecture Decision Records (ADRs) for significant choices
- Automated testing enables confident refactoring
- Supported, in-support versions of components are used; end-of-life technology has a funded migration plan

**Validation Gates**:

- [ ] Architecture documentation exists and is current
- [ ] Module boundaries clear with defined responsibilities
- [ ] Automated test coverage enables safe refactoring
- [ ] Architecture Decision Records (ADRs) document key choices
- [ ] No unmanaged end-of-life components

**Good Example**:
A change to an allowance rate is made in one isolated rule set, tested automatically and released within the required legislative date.

**Bad Example**:
Rates are hard-coded in several places, and only one departing contractor knows where.

**Common Violations**:

- Documentation written at go-live and never updated
- Knowledge held by one individual or one supplier
- Deferring upgrades until the component is out of support

---

## V. Development Practices

### 19. Infrastructure as Code

**Principle Statement**:
All infrastructure MUST be defined as code, version-controlled and deployed through automated pipelines.

**Rationale**:
Manual infrastructure changes create drift, inconsistency and undocumented state. Infrastructure as Code (IaC) enables repeatability, auditability and disaster recovery.

**Implications**:

- All infrastructure defined in declarative code
- Infrastructure changes go through code review
- Environments are reproducible from code
- No manual changes to production infrastructure
- Infrastructure versioned alongside application code

**Validation Gates**:

- [ ] Infrastructure defined as code
- [ ] Infrastructure code version-controlled
- [ ] Automated deployment pipeline for infrastructure
- [ ] No manual infrastructure changes in production

**Good Example**:
A new test environment is created from the same code as production in minutes, and the change is reviewed and recorded.

**Bad Example**:
An engineer changes a production setting by hand during an incident and does not record it.

**Common Violations**:

- Emergency changes that never get back-ported to code
- Environments that differ in undocumented ways
- Infrastructure code held outside version control

---

### 20. Automated Testing

**Principle Statement**:
All code changes MUST be validated through automated testing before deployment to production.

**Rationale**:
Manual testing cannot keep pace with frequent change, and defects found in production cost far more to fix. For a service that calculates and pays benefits, incorrect behaviour causes real financial harm. Automated tests give the confidence to change systems safely and quickly.

**Implications**:

- Tests are written alongside the code they cover and run on every change
- A failing test blocks the merge
- Non-functional tests (performance, security, accessibility, resilience) are automated, not left to release time
- Test data is synthetic or anonymised, never live personal data
- Benefit calculation rules have comprehensive automated tests derived from the governing regulations, reviewed by a subject-matter expert

**Test Pyramid**:

- **Unit Tests**: Fast, isolated, high coverage (70-80% of tests)
- **Integration Tests**: Test component interactions (15-20% of tests)
- **End-to-End Tests**: Critical user journeys (5-10% of tests)

**Required Test Types**:

- Functional tests (does it work?)
- Performance tests (is it fast enough?)
- Security tests (is it secure?)
- Accessibility tests (can everyone use it?)
- Resilience tests (does it handle failures?)

**Validation Gates**:

- [ ] Automated tests exist and pass before merge
- [ ] Test coverage meets defined thresholds
- [ ] Critical paths have end-to-end tests
- [ ] Performance tests run regularly
- [ ] Calculation rules covered by expert-reviewed test cases
- [ ] Test data contains no live personal data

**Good Example**:
Each rule in the assessment logic has test cases from the regulations, and any change that alters an existing result fails the build until reviewed.

**Bad Example**:
Rule changes are checked by a person keying a few sample claims into a live system.

**Common Violations**:

- Copying production data into test for realism
- Skipping tests to meet a legislative deadline
- Tests that only check the happy path

---

### 21. Continuous Integration and Deployment

**Principle Statement**:
All code changes MUST go through automated build, test and deployment pipelines with quality gates at each stage.

**Rationale**:
Automated pipelines make releases small, frequent and repeatable, which lowers the risk of each change and shortens the time to deliver value and fix defects.

**Implications**:

- Every change reaches production through the pipeline; there are no manual deployments
- Quality and security gates are automated and cannot be skipped without a recorded exception
- Deployments are reversible, with rollback or roll-forward rehearsed
- Pipeline definitions are version-controlled with the code
- The pipeline retains evidence (who approved and what was released) to support audit

**Pipeline Stages**:

1. **Source Control**: All changes committed to version control
2. **Build**: Automated compilation and packaging
3. **Test**: Automated test execution
4. **Security Scan**: Dependency and code vulnerability scanning
5. **Deployment**: Automated deployment to environments

**Quality Gates**:

- All tests must pass
- No critical security vulnerabilities
- Code review approval required
- Deployment requires production readiness checklist

**Validation Gates**:

- [ ] Automated CI/CD pipeline exists
- [ ] Pipeline includes security scanning
- [ ] Deployment is automated and repeatable
- [ ] Rollback capability tested
- [ ] Release evidence retained

**Good Example**:
A small change passes automated tests and security scans, is approved by a second person, and is released with a rehearsed rollback.

**Bad Example**:
A supplier engineer deploys directly to production from a laptop.

**Common Violations**:

- Pipeline gates that are routinely bypassed
- Large infrequent releases
- Untested rollback procedures

---

## VI. Exception Process

### Requesting Architecture Exceptions

Principles are mandatory unless a documented exception is approved by the Architecture Review Board.

**Valid Exception Reasons**:

- Technical constraints that prevent compliance
- Regulatory or legal requirements
- Transitional state during migration
- Pilot or proof-of-concept with a defined end date

**Exception Request Requirements**:

- [ ] Justification with business and technical rationale
- [ ] Alternative approach and compensating controls
- [ ] Risk assessment and mitigation plan
- [ ] Expiry date (exceptions are time-bound)
- [ ] Remediation plan to achieve compliance

**Approval Process**:

1. Submit the exception request to the Head of Digital's architecture function
2. Review by the Architecture Review Board
3. Head of Digital approval for exceptions to any principle; the Senior Information Risk Owner (SIRO) must also approve any exception affecting principles 2, 10 or 11, and the Data Protection Officer must be consulted for principles 10 and 11
4. Document the exception in the project architecture documentation and the exceptions register
5. Review exceptions quarterly

**Non-negotiable**: Principle 2 (Security by Design) does not admit exceptions to the principle itself. Only compensating controls for a specific control implementation may be approved, and only by the SIRO.

---

## VII. Governance and Compliance

### Architecture Review Gates

All projects must pass architecture reviews at key milestones, aligned with Government Digital Service delivery phases:

**Discovery / Alpha**:

- [ ] Architecture principles understood
- [ ] High-level approach aligns with principles
- [ ] Reuse assessment started
- [ ] No obvious principle violations

**Beta / Design**:

- [ ] Detailed architecture documented
- [ ] Compliance with each principle validated
- [ ] Exceptions requested and approved
- [ ] Security, data protection and accessibility principles validated
- [ ] Data Protection Impact Assessment completed where required

**Pre-Production / Live**:

- [ ] Implementation matches approved architecture
- [ ] All validation gates passed
- [ ] Operational readiness verified
- [ ] Independent security testing completed and findings resolved

### Enforcement

- Architecture reviews are **mandatory** for all projects
- Principle violations must be remediated before production deployment
- Approved exceptions are time-bound and reviewed quarterly
- Retrospective reviews for compliance on live systems
- Principles are reviewed at least annually and after any material change in legislation, policy or threat landscape

---

## VIII. Appendix

### Principle Summary Checklist

| # | Principle | Category | Criticality | Validation |
|---|-----------|----------|-------------|------------|
| 1 | Citizen-Centred, Inclusive Service | Strategic | CRITICAL | User research, accessibility testing |
| 2 | Security by Design | Strategic | CRITICAL | Threat model, penetration testing |
| 3 | Resilience and Fault Tolerance | Strategic | CRITICAL | Resilience testing, RTO/RPO |
| 4 | Scalability and Elasticity | Strategic | HIGH | Load testing, scaling metrics |
| 5 | Interoperability and Open Standards | Strategic | HIGH | Interface specifications, versioning |
| 6 | Observability and Operational Excellence | Strategic | HIGH | Metrics, logs, traces |
| 7 | Reuse, Value for Money and Avoiding Lock-in | Strategic | HIGH | Reuse assessment, exit plan |
| 8 | Financial Integrity and Auditability | Strategic | CRITICAL | Audit trail, reconciliation |
| 9 | Accountable Use of Automation and AI | Strategic | HIGH | Impact assessment, human-review route |
| 10 | Privacy and Data Protection by Design | Data | CRITICAL | DPIA, data-sharing agreements |
| 11 | Data Classification, Residency and Retention | Data | CRITICAL | Compliance audit, retention configuration |
| 12 | Data Quality and Lineage | Data | MEDIUM | Quality metrics, lineage |
| 13 | Single Source of Truth | Data | HIGH | System-of-record register |
| 14 | Loose Coupling | Integration | HIGH | Deployment independence |
| 15 | Asynchronous Communication | Integration | MEDIUM | Async patterns used |
| 16 | Performance and Efficiency | Quality | HIGH | Load testing |
| 17 | Availability and Reliability | Quality | CRITICAL | SLA monitoring, recovery tests |
| 18 | Maintainability and Evolvability | Quality | MEDIUM | Documentation, tests |
| 19 | Infrastructure as Code | Development | HIGH | IaC coverage |
| 20 | Automated Testing | Development | HIGH | Test coverage |
| 21 | Continuous Integration and Deployment | Development | HIGH | Pipeline exists |

## External References

> This section provides traceability from generated content back to source documents.
> Follow citation instructions in the project's citation reference guide.

### Document Register

| Doc ID | Filename | Type | Source Location | Description |
|--------|----------|------|-----------------|-------------|
| *None consulted* | — | — | — | — |

No global policies were present in `projects/000-global/policies/`, and no external documents were provided. The principles were therefore generated from the request and general UK public-sector practice. References to laws, standards and Government guidance name obligations only; they are not cited from supplied source material and should be confirmed by the Data Protection Officer, SIRO and Legal before the document is approved.

---

**Generated by**: ArcKit `/arckit:principles` command
**Generated on**: 2026-09-29
**ArcKit Version**: 6.16.5
**Project**: Ashcombe District Council Housing Benefits Digital Service (Project 000 - Global)
**AI Model**: Claude Sonnet 5.5 (claude-sonnet-5-5)

<!-- arckit-provenance:start -->

## Build Provenance

*Stamped automatically by the ArcKit plugin's `provenance-stamp.mjs` PostToolUse hook. Complements (does not replace) the human-authored footer above. Carries only fields the model can't authoritatively self-report: build context from `.arckit/state.json` and effort levels derived from command frontmatter + the silent-downgrade matrix.*

| Field | Value |
|-------|-------|
| Requested Effort | `high` |
| Effective Effort | *unknown — model not parsed from existing footer* |
| Stamped at | 2026-09-29T15:50:53.255Z |

<!-- arckit-provenance:end -->
