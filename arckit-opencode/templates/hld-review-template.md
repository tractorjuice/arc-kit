# High-Level Design (HLD) Review: [PROJECT_NAME]

> **Template Status**: Beta | **Version**: [VERSION] | **Command**: `/arckit.hld-review`

## Document Control

| Field | Value |
|-------|-------|
| **Document ID** | ARC-[PROJECT_ID]-HLDR-v[VERSION] |
| **Document Type** | [DOCUMENT_TYPE_NAME] |
| **Project** | [PROJECT_NAME] (Project [PROJECT_ID]) |
| **Classification** | [PUBLIC / OFFICIAL / OFFICIAL-SENSITIVE / SECRET] |
| **Status** | [DRAFT / IN_REVIEW / APPROVED / PUBLISHED / SUPERSEDED / ARCHIVED] |
| **Version** | [VERSION] |
| **Created Date** | [YYYY-MM-DD] |
| **Last Modified** | [YYYY-MM-DD] |
| **Review Cycle** | [Monthly / Quarterly / Annual / On-Demand] |
| **Next Review Date** | [YYYY-MM-DD] |
| **Owner** | [OWNER_NAME_AND_ROLE] |
| **Reviewed By** | [REVIEWER_NAME] on [DATE] or [PENDING] |
| **Approved By** | [APPROVER_NAME] on [DATE] or [PENDING] |
| **Distribution** | [DISTRIBUTION_LIST] |

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [DATE] | ArcKit AI | Initial creation from `/arckit.[COMMAND]` command | [PENDING] | [PENDING] |

## Document Purpose

[Brief description of what this document is for and how it will be used]

---

## 1. Review Overview

### 1.1 Purpose

This document captures the Architecture Review Board's evaluation of the High-Level Design (HLD) for [PROJECT_NAME]. The HLD must demonstrate architectural soundness, alignment with enterprise principles, and feasibility before proceeding to detailed design.

### 1.2 HLD Document Under Review

**Document**: [Link to HLD document or path]
**Version**: [VERSION]
**Submitted By**: [VENDOR_NAME]
**Submission Date**: [DATE]

### 1.3 Review Participants

| Name | Role | Organization | Review Focus |
|------|------|--------------|--------------|
| [Name] | Lead Reviewer | Enterprise Architecture | Overall architecture, principle compliance |
| [Name] | Security Architect | Security | Security architecture, threat model, controls |
| [Name] | Domain Architect | Domain Team | Domain fit, integration patterns |
| [Name] | Infrastructure Architect | Cloud/Infra Team | Infrastructure, scalability, resilience |
| [Name] | Data Architect | Data Governance | Data architecture, privacy, governance |
| [Name] | SRE Lead | Operations | Operational readiness, observability |

### 1.4 Review Criteria

The HLD will be evaluated against:
- **Architecture Principles**: Compliance with enterprise architecture principles
- **Requirements Alignment**: Coverage of functional and non-functional requirements
- **Technical Feasibility**: Soundness and implementability of design
- **Security & Compliance**: Adequate security controls and regulatory compliance
- **Scalability & Resilience**: Ability to scale and handle failures gracefully
- **Operational Readiness**: Observability, supportability, maintainability

---

## 2. Executive Summary

### 2.1 Overall Assessment

**Status**: [APPROVED | APPROVED WITH CONDITIONS | REJECTED]

**Summary**: [2-3 paragraph executive summary of the review outcome]

[Example: "The High-Level Design for the Payment Modernization project demonstrates a well-thought-out microservices architecture leveraging AWS cloud-native services. The design aligns with our API-first and cloud-first principles and adequately addresses most functional and non-functional requirements. However, several conditions must be addressed before proceeding to detailed design, primarily related to disaster recovery strategy and observability instrumentation."]

### 2.2 Key Strengths

- [Strength 1: e.g., "Modern, cloud-native architecture with appropriate use of managed services"]
- [Strength 2: e.g., "Comprehensive security controls with defense-in-depth"]
- [Strength 3: e.g., "Clear service boundaries aligned with domain-driven design principles"]

### 2.3 Key Concerns

- [Concern 1: e.g., "Disaster recovery plan lacks detail on failover procedures"]
- [Concern 2: e.g., "Observability strategy does not specify SLO/SLI definitions"]
- [Concern 3: e.g., "Integration with legacy system X requires further clarification"]

### 2.4 Conditions for Approval

**MUST Address Before Detailed Design**:
1. [BLOCKING-01]: [Critical issue that MUST be resolved]
2. [BLOCKING-02]: [Critical issue that MUST be resolved]

**SHOULD Address During Detailed Design**:
1. [ADVISORY-01]: [Important issue that should be clarified]
2. [ADVISORY-02]: [Important issue that should be clarified]

### 2.5 Recommendation

- [ ] **APPROVED**: Proceed to detailed design with no conditions
- [ ] **APPROVED WITH CONDITIONS**: Proceed after addressing blocking items listed above
- [ ] **APPROVED WITH ADVISORIES**: Proceed but address advisory items in DLD
- [ ] **REJECTED**: Significant rework required; resubmit revised HLD for review

**Target Resubmission Date** (if rejected or conditional): [DATE]

---

## 3. Architecture Principles Compliance

Evaluate HLD compliance with enterprise architecture principles.

### 3.1 Principle Compliance Checklist

| Principle ID | Principle Name | Status | Comments |
|--------------|----------------|--------|----------|
| **P-1** | Cloud-First Architecture | [ ] ✅ Compliant<br>[ ] ⚠️ Partial<br>[ ] ❌ Non-Compliant | |
| **P-2** | API-First Integration | [ ] ✅ Compliant<br>[ ] ⚠️ Partial<br>[ ] ❌ Non-Compliant | |
| **P-3** | Security by Design (Zero Trust) | [ ] ✅ Compliant<br>[ ] ⚠️ Partial<br>[ ] ❌ Non-Compliant | |
| **P-4** | Observability & Operational Excellence | [ ] ✅ Compliant<br>[ ] ⚠️ Partial<br>[ ] ❌ Non-Compliant | |
| **P-5** | Data Sovereignty & Governance | [ ] ✅ Compliant<br>[ ] ⚠️ Partial<br>[ ] ❌ Non-Compliant | |
| **P-6** | Approved Technology Stack | [ ] ✅ Compliant<br>[ ] ⚠️ Partial<br>[ ] ❌ Non-Compliant | |
| **P-7** | Infrastructure as Code | [ ] ✅ Compliant<br>[ ] ⚠️ Partial<br>[ ] ❌ Non-Compliant | |
| **P-8** | Microservices & Domain-Driven Design | [ ] ✅ Compliant<br>[ ] ⚠️ Partial<br>[ ] ❌ Non-Compliant | |
| **P-9** | Resilience & Fault Tolerance | [ ] ✅ Compliant<br>[ ] ⚠️ Partial<br>[ ] ❌ Non-Compliant | |
| **P-10** | FinOps & Cost Optimization | [ ] ✅ Compliant<br>[ ] ⚠️ Partial<br>[ ] ❌ Non-Compliant | |

### 3.2 Principle Compliance Details

#### P-1: Cloud-First Architecture

**Assessment**: [✅ Compliant | ⚠️ Partial | ❌ Non-Compliant]

**Evidence**:
- [List specific design decisions that demonstrate compliance]
- [E.g., "Uses AWS Lambda for event processing, eliminating server management"]
- [E.g., "Leverages managed RDS for database, avoiding self-hosted database"]

**Concerns**:
- [List any deviations or concerns]
- [E.g., "Proposes self-hosted Kafka instead of managed MSK without clear justification"]

**Recommendation**:
- [Action items to achieve full compliance]

---

#### P-2: API-First Integration

**Assessment**: [✅ Compliant | ⚠️ Partial | ❌ Non-Compliant]

**Evidence**:
- [E.g., "All services expose RESTful APIs with OpenAPI 3.0 specifications"]
- [E.g., "No direct database access across service boundaries"]
- [E.g., "Authentication via OAuth 2.0 with JWT tokens"]

**Concerns**:
- [E.g., "Integration with legacy System X appears to use direct database access"]

**Recommendation**:
- [E.g., "Replace direct database access with API gateway pattern or CDC (Change Data Capture)"]

---

[Continue for each principle...]

---

## 4. Requirements Coverage Analysis

### 4.1 Functional Requirements Coverage

Review how HLD addresses functional requirements from requirements document.

| Requirement ID | Requirement Summary | Addressed in HLD | Design Element | Assessment |
|----------------|---------------------|------------------|----------------|------------|
| FR-1 | [Requirement] | [ ] Yes [ ] Partial [ ] No | [Service/component] | [✅ Adequate | ⚠️ Needs clarification | ❌ Inadequate] |
| FR-2 | [Requirement] | [ ] Yes [ ] Partial [ ] No | [Service/component] | [✅ | ⚠️ | ❌] |
| FR-3 | [Requirement] | [ ] Yes [ ] Partial [ ] No | [Service/component] | [✅ | ⚠️ | ❌] |

**Gaps Identified**:
- [FR-X not addressed: [Description and impact]]
- [FR-Y partially addressed: [What's missing]]

**Recommendation**:
- [How to address gaps in detailed design]

---

### 4.2 Non-Functional Requirements Coverage

#### Performance Requirements

| NFR ID | Requirement | Target | HLD Approach | Assessment | Comments |
|--------|-------------|--------|--------------|------------|----------|
| NFR-P-1 | API response time | <200ms (p95) | [Caching strategy, async processing] | [✅ | ⚠️ | ❌] | |
| NFR-P-2 | Throughput | 10K TPS | [Auto-scaling, load balancing] | [✅ | ⚠️ | ❌] | |

#### Availability & Resilience

| NFR ID | Requirement | Target | HLD Approach | Assessment | Comments |
|--------|-------------|--------|--------------|------------|----------|
| NFR-A-1 | Availability SLA | 99.95% | [Multi-AZ deployment, health checks] | [✅ | ⚠️ | ❌] | |
| NFR-A-2 | RPO | <15 min | [Continuous backup, cross-region replication] | [✅ | ⚠️ | ❌] | |
| NFR-A-3 | RTO | <4 hours | [Automated failover, disaster recovery plan] | [✅ | ⚠️ | ❌] | |

#### Security Requirements

| NFR ID | Requirement | HLD Approach | Assessment | Comments |
|--------|-------------|--------------|------------|----------|
| NFR-SEC-1 | Authentication (SSO/MFA) | [OIDC with Okta, MFA enforced] | [✅ | ⚠️ | ❌] | |
| NFR-SEC-2 | Authorization (RBAC) | [OPA for policy enforcement] | [✅ | ⚠️ | ❌] | |
| NFR-SEC-3 | Encryption (TLS 1.3+, AES-256) | [ALB TLS termination, RDS encryption] | [✅ | ⚠️ | ❌] | |
| NFR-SEC-4 | Secrets management | [AWS Secrets Manager with rotation] | [✅ | ⚠️ | ❌] | |

#### Scalability Requirements

| NFR ID | Requirement | HLD Approach | Assessment | Comments |
|--------|-------------|--------------|------------|----------|
| NFR-S-1 | Horizontal scaling | [Auto-scaling groups, stateless services] | [✅ | ⚠️ | ❌] | |
| NFR-S-2 | Data volume growth | [Partitioning strategy, data lifecycle] | [✅ | ⚠️ | ❌] | |

#### Compliance Requirements

| NFR ID | Requirement | HLD Approach | Assessment | Comments |
|--------|-------------|--------------|------------|----------|
| NFR-C-1 | GDPR compliance | [Data residency, deletion APIs, consent] | [✅ | ⚠️ | ❌] | |
| NFR-C-2 | Audit logging | [CloudWatch Logs, 7-year retention] | [✅ | ⚠️ | ❌] | |

---

## 5. Architecture Quality Assessment

### 5.1 System Context Diagram (C4 Level 1)

**Provided in HLD**: [ ] Yes [ ] No

**Assessment**: [✅ Clear | ⚠️ Needs improvement | ❌ Inadequate]

**Comments**:
- [Is the system boundary clear?]
- [Are all external actors and systems identified?]
- [Are data flows and interactions logical?]

**Issues**:
- [Issue 1]
- [Issue 2]

---

### 5.2 Container Diagram (C4 Level 2)

**Provided in HLD**: [ ] Yes [ ] No

**Assessment**: [✅ Clear | ⚠️ Needs improvement | ❌ Inadequate]

**Comments**:
- [Are all major components/services identified?]
- [Are technologies chosen for each container appropriate?]
- [Are inter-container communication patterns clear?]

**Service Decomposition**:

| Service | Responsibility | Technology | Assessment | Comments |
|---------|----------------|------------|------------|----------|
| [Service 1] | [What it does] | [Tech stack] | [✅ | ⚠️ | ❌] | |
| [Service 2] | [What it does] | [Tech stack] | [✅ | ⚠️ | ❌] | |

**Concerns**:
- [Service boundaries unclear between X and Y]
- [Service Z appears to be a "god service" with too many responsibilities]

---

### 5.3 Technology Stack

| Layer | Proposed Technology | Approved? | Assessment | Comments |
|-------|---------------------|-----------|------------|----------|
| **Frontend** | [React, TypeScript] | [✅ | ⚠️ | ❌] | [✅ | ⚠️ | ❌] | |
| **API Gateway** | [AWS API Gateway] | [✅ | ⚠️ | ❌] | [✅ | ⚠️ | ❌] | |
| **Backend Services** | [Node.js, Java Spring Boot] | [✅ | ⚠️ | ❌] | [✅ | ⚠️ | ❌] | |
| **Databases** | [PostgreSQL, Redis] | [✅ | ⚠️ | ❌] | [✅ | ⚠️ | ❌] | |
| **Messaging** | [Kafka, SQS] | [✅ | ⚠️ | ❌] | [✅ | ⚠️ | ❌] | |
| **Container Orchestration** | [EKS - Kubernetes] | [✅ | ⚠️ | ❌] | [✅ | ⚠️ | ❌] | |
| **CI/CD** | [GitHub Actions] | [✅ | ⚠️ | ❌] | [✅ | ⚠️ | ❌] | |
| **Monitoring** | [Prometheus, Grafana, DataDog] | [✅ | ⚠️ | ❌] | [✅ | ⚠️ | ❌] | |

**Non-Approved Technologies**:
- [Technology X]: [Justification provided? Is it acceptable?]

**Technology Risks**:
- [Risk 1: e.g., "Team lacks expertise in Technology Y"]
- [Risk 2: e.g., "Technology Z is bleeding edge with limited community support"]

---

### 5.4 Data Architecture

#### Data Models

**Provided in HLD**: [ ] Yes [ ] No [ ] Deferred to DLD

**Assessment**: [✅ Clear | ⚠️ Needs improvement | ❌ Inadequate]

**Key Entities Identified**:
| Entity | Owning Service | Storage | Assessment |
|--------|----------------|---------|------------|
| [Entity 1] | [Service A] | [PostgreSQL] | [✅ | ⚠️ | ❌] |
| [Entity 2] | [Service B] | [MongoDB] | [✅ | ⚠️ | ❌] |

**Concerns**:
- [Shared database pattern detected between Services X and Y]
- [Data consistency strategy for distributed transactions not clear]

#### Data Flow

**Assessment**: [✅ Clear | ⚠️ Needs improvement | ❌ Inadequate]

**Comments**:
- [Are data flows between services clearly defined?]
- [Is data synchronization strategy clear (sync vs. async, eventual consistency)?]
- [Are data lifecycle and retention policies addressed?]

#### Data Governance

| Aspect | Addressed | Assessment | Comments |
|--------|-----------|------------|----------|
| Data classification | [ ] Yes [ ] No | [✅ | ⚠️ | ❌] | |
| Data residency (GDPR) | [ ] Yes [ ] No | [✅ | ⚠️ | ❌] | |
| Data retention policies | [ ] Yes [ ] No | [✅ | ⚠️ | ❌] | |
| PII handling | [ ] Yes [ ] No | [✅ | ⚠️ | ❌] | |
| Backup and recovery | [ ] Yes [ ] No | [✅ | ⚠️ | ❌] | |

---

### 5.5 Integration Architecture

#### External System Integrations

| External System | Integration Pattern | Protocol | Authentication | Assessment | Comments |
|----------------|---------------------|----------|----------------|------------|----------|
| [System 1] | [RESTful API] | [HTTPS] | [OAuth 2.0] | [✅ | ⚠️ | ❌] | |
| [System 2] | [Event-driven] | [Kafka] | [Mutual TLS] | [✅ | ⚠️ | ❌] | |
| [Legacy System X] | [???] | [???] | [???] | [✅ | ⚠️ | ❌] | |

**Concerns**:
- [Integration with Legacy System X not well-defined]
- [Error handling and retry logic not specified]

#### API Design

**API Standards Compliance**:
- [ ] OpenAPI 3.0 specifications mentioned
- [ ] RESTful design principles followed
- [ ] Versioning strategy defined
- [ ] Rate limiting and quotas addressed
- [ ] Error response format standardized

**Assessment**: [✅ Adequate | ⚠️ Needs detail in DLD | ❌ Inadequate]

---

## 6. Security Architecture Review

### 6.1 Threat Model

**Threat Model Provided**: [ ] Yes [ ] No

**Assessment**: [✅ Comprehensive | ⚠️ Partial | ❌ Absent]

**Threats Identified**:
| Threat | Likelihood | Impact | Mitigation | Assessment |
|--------|------------|--------|------------|------------|
| [Threat 1] | [H/M/L] | [H/M/L] | [Control] | [✅ | ⚠️ | ❌] |
| [Threat 2] | [H/M/L] | [H/M/L] | [Control] | [✅ | ⚠️ | ❌] |

**Missing Threat Analysis**:
- [Threat X not considered]

---

### 6.2 Security Controls

#### Authentication & Authorization

| Control | Requirement | HLD Approach | Assessment |
|---------|-------------|--------------|------------|
| User authentication | SSO with MFA | [OIDC via Okta, MFA enforced] | [✅ | ⚠️ | ❌] |
| Service-to-service auth | Mutual TLS or signed tokens | [Service mesh with mTLS] | [✅ | ⚠️ | ❌] |
| Authorization model | RBAC, least privilege | [OPA with attribute-based policies] | [✅ | ⚠️ | ❌] |
| Session management | Timeout, revocation | [JWT with 15-min expiry, refresh tokens] | [✅ | ⚠️ | ❌] |

#### Network Security

| Control | HLD Approach | Assessment | Comments |
|---------|--------------|------------|----------|
| Network segmentation | [VPC with public/private subnets, security groups] | [✅ | ⚠️ | ❌] | |
| Ingress protection | [WAF, DDoS protection via CloudFront] | [✅ | ⚠️ | ❌] | |
| Egress control | [NAT Gateway, egress rules in security groups] | [✅ | ⚠️ | ❌] | |
| Zero Trust architecture | [Service mesh, no implicit trust] | [✅ | ⚠️ | ❌] | |

#### Data Protection

| Control | HLD Approach | Assessment | Comments |
|---------|--------------|------------|----------|
| Encryption in transit | [TLS 1.3, strong cipher suites] | [✅ | ⚠️ | ❌] | |
| Encryption at rest | [AES-256, managed keys via KMS] | [✅ | ⚠️ | ❌] | |
| Secrets management | [AWS Secrets Manager with auto-rotation] | [✅ | ⚠️ | ❌] | |
| PII tokenization/masking | [Tokenization for payment data, masking in logs] | [✅ | ⚠️ | ❌] | |

#### Security Monitoring

| Control | HLD Approach | Assessment | Comments |
|---------|--------------|------------|----------|
| Audit logging | [CloudWatch Logs, 7-year retention] | [✅ | ⚠️ | ❌] | |
| SIEM integration | [Forward logs to Splunk] | [✅ | ⚠️ | ❌] | |
| Anomaly detection | [GuardDuty for threat detection] | [✅ | ⚠️ | ❌] | |
| Vulnerability scanning | [Trivy for container images, AWS Inspector] | [✅ | ⚠️ | ❌] | |

---

### 6.3 Compliance Mapping

| Compliance Requirement | Control | Assessment | Gap |
|------------------------|---------|------------|-----|
| GDPR Art. 32 (Security) | [Encryption, access controls] | [✅ | ⚠️ | ❌] | |
| GDPR Art. 17 (Right to deletion) | [Deletion API, data lifecycle] | [✅ | ⚠️ | ❌] | |
| HIPAA (if applicable) | [PHI encryption, BAA with AWS] | [✅ | ⚠️ | ❌] | |
| PCI-DSS (if applicable) | [Payment data tokenization, no CHD storage] | [✅ | ⚠️ | ❌] | |
| SOC 2 Type II | [Controls aligned with trust principles] | [✅ | ⚠️ | ❌] | |

**Gaps**:
- [Compliance requirement X not addressed]

---

## 7. Scalability & Performance Architecture

### 7.1 Scalability Strategy

| Aspect | HLD Approach | Assessment | Comments |
|--------|--------------|------------|----------|
| **Horizontal scaling** | [Auto-scaling groups, stateless services] | [✅ | ⚠️ | ❌] | |
| **Vertical scaling** | [Resize instance types as needed] | [✅ | ⚠️ | ❌] | |
| **Database scaling** | [Read replicas, sharding strategy] | [✅ | ⚠️ | ❌] | |
| **Caching** | [Redis for session/data cache, CDN for static assets] | [✅ | ⚠️ | ❌] | |
| **Load balancing** | [ALB with round-robin, health checks] | [✅ | ⚠️ | ❌] | |

**Growth Projections Addressed**: [ ] Yes [ ] No

**Bottlenecks Identified and Mitigated**: [ ] Yes [ ] No

**Concerns**:
- [Database may become bottleneck; sharding strategy not detailed]

---

### 7.2 Performance Optimization

| Optimization | HLD Approach | Assessment | Comments |
|--------------|--------------|------------|----------|
| API response time | [Caching, async processing, database indexing] | [✅ | ⚠️ | ❌] | |
| Database query optimization | [Indexing strategy, query optimization] | [✅ | ⚠️ | ❌] | |
| Asynchronous processing | [SQS for background jobs, Lambda for events] | [✅ | ⚠️ | ❌] | |
| Static asset optimization | [CloudFront CDN, image compression] | [✅ | ⚠️ | ❌] | |

**Performance Testing Plan**: [ ] Yes [ ] No [ ] Deferred to DLD

---

## 8. Resilience & Disaster Recovery

### 8.1 Resilience Patterns

| Pattern | Implemented | Assessment | Comments |
|---------|-------------|------------|----------|
| **Circuit breaker** | [ ] Yes [ ] No | [✅ | ⚠️ | ❌] | |
| **Retry with exponential backoff** | [ ] Yes [ ] No | [✅ | ⚠️ | ❌] | |
| **Timeout on all network calls** | [ ] Yes [ ] No | [✅ | ⚠️ | ❌] | |
| **Bulkhead isolation** | [ ] Yes [ ] No | [✅ | ⚠️ | ❌] | |
| **Graceful degradation** | [ ] Yes [ ] No | [✅ | ⚠️ | ❌] | |
| **Health checks** | [ ] Yes [ ] No | [✅ | ⚠️ | ❌] | |

**Failure Modes Analyzed**: [ ] Yes [ ] No

**Single Points of Failure (SPOFs)**:
- [SPOF 1: [Description and mitigation]]
- [SPOF 2: [Description and mitigation]]

---

### 8.2 High Availability Architecture

| Aspect | HLD Approach | Target | Assessment | Comments |
|--------|--------------|--------|------------|----------|
| **Multi-AZ deployment** | [Services deployed across 3 AZs] | 99.95% | [✅ | ⚠️ | ❌] | |
| **Database HA** | [RDS Multi-AZ with auto-failover] | 99.95% | [✅ | ⚠️ | ❌] | |
| **Stateless services** | [No local state, session in Redis] | N/A | [✅ | ⚠️ | ❌] | |
| **Health monitoring** | [ALB health checks, ECS task health] | N/A | [✅ | ⚠️ | ❌] | |

**Availability SLA**: [99.95%]

**Calculated Availability**: [Show calculation based on component availability]

---

### 8.3 Disaster Recovery

| Aspect | Requirement | HLD Approach | Assessment | Comments |
|--------|-------------|--------------|------------|----------|
| **RPO** | <15 min | [Continuous backup, cross-region replication] | [✅ | ⚠️ | ❌] | |
| **RTO** | <4 hours | [Automated failover via Route53, IaC deployment] | [✅ | ⚠️ | ❌] | |
| **Backup strategy** | Daily | [Automated RDS snapshots, S3 versioning] | [✅ | ⚠️ | ❌] | |
| **Backup retention** | 30 days | [RDS snapshot retention 30 days] | [✅ | ⚠️ | ❌] | |
| **Multi-region failover** | Yes | [Passive DR site in secondary region] | [✅ | ⚠️ | ❌] | |
| **DR testing plan** | Quarterly | [Documented DR drill procedure] | [✅ | ⚠️ | ❌] | |

**DR Runbook Provided**: [ ] Yes [ ] No [ ] Deferred to DLD

**Concerns**:
- [Failover procedure not detailed - must be documented in DLD]

---

## 9. Operational Architecture

### 9.1 Observability

| Aspect | HLD Approach | Assessment | Comments |
|--------|--------------|------------|----------|
| **Logging** | [Structured JSON logs to CloudWatch] | [✅ | ⚠️ | ❌] | |
| **Metrics** | [Prometheus metrics, exported to DataDog] | [✅ | ⚠️ | ❌] | |
| **Tracing** | [OpenTelemetry for distributed tracing] | [✅ | ⚠️ | ❌] | |
| **Dashboards** | [Grafana dashboards for key metrics] | [✅ | ⚠️ | ❌] | |
| **Alerting** | [PagerDuty integration, SLO-based alerts] | [✅ | ⚠️ | ❌] | |

**SLI/SLO Defined**: [ ] Yes [ ] No [ ] Deferred to DLD

**Runbooks for Common Issues**: [ ] Yes [ ] No [ ] Deferred to DLD

---

### 9.2 Deployment Architecture

| Aspect | HLD Approach | Assessment | Comments |
|--------|--------------|------------|----------|
| **Infrastructure as Code** | [Terraform for all infrastructure] | [✅ | ⚠️ | ❌] | |
| **CI/CD pipeline** | [GitHub Actions: build → test → deploy] | [✅ | ⚠️ | ❌] | |
| **Deployment strategy** | [Blue/green deployment, canary releases] | [✅ | ⚠️ | ❌] | |
| **Rollback procedure** | [Automated rollback on health check failure] | [✅ | ⚠️ | ❌] | |
| **Environment parity** | [Dev, Staging, Prod with IaC] | [✅ | ⚠️ | ❌] | |

**Deployment Downtime**: [Zero-downtime deployment]

---

### 9.3 Supportability

| Aspect | Addressed | Assessment | Comments |
|--------|-----------|------------|----------|
| **Operational runbooks** | [ ] Yes [ ] No | [✅ | ⚠️ | ❌] | |
| **Troubleshooting guides** | [ ] Yes [ ] No | [✅ | ⚠️ | ❌] | |
| **On-call procedures** | [ ] Yes [ ] No | [✅ | ⚠️ | ❌] | |
| **Incident response plan** | [ ] Yes [ ] No | [✅ | ⚠️ | ❌] | |
| **Capacity planning** | [ ] Yes [ ] No | [✅ | ⚠️ | ❌] | |

---

## 10. Cost Architecture

### 10.1 Cost Estimation

**Estimated Monthly Cost**: $[X] (at launch) → $[Y] (at Year 3)

**Cost Breakdown**:
| Category | Monthly Cost | Annual Cost | Notes |
|----------|--------------|-------------|-------|
| Compute (EC2/ECS) | $[X] | $[X] | |
| Database (RDS) | $[X] | $[X] | |
| Storage (S3) | $[X] | $[X] | |
| Networking (data transfer) | $[X] | $[X] | |
| Monitoring (DataDog) | $[X] | $[X] | |
| **Total** | **$[X]** | **$[X]** | |

**Cost Optimization Strategies**:
- [ ] Right-sizing of resources
- [ ] Reserved instances for predictable workloads
- [ ] Spot instances for batch jobs
- [ ] Auto-scaling to match demand
- [ ] Data lifecycle policies (S3 tiering)

**Assessment**: [✅ Within budget | ⚠️ Close to budget | ❌ Exceeds budget]

---

### 10.2 FinOps Practices

| Practice | Addressed | Assessment | Comments |
|----------|-----------|------------|----------|
| **Resource tagging** | [ ] Yes [ ] No | [✅ | ⚠️ | ❌] | |
| **Cost monitoring** | [ ] Yes [ ] No | [✅ | ⚠️ | ❌] | |
| **Budget alerts** | [ ] Yes [ ] No | [✅ | ⚠️ | ❌] | |
| **Idle resource detection** | [ ] Yes [ ] No | [✅ | ⚠️ | ❌] | |
| **Showback/chargeback** | [ ] Yes [ ] No | [✅ | ⚠️ | ❌] | |

---

## 11. Issues and Recommendations

### 11.1 Critical Issues (BLOCKING)

Issues that **MUST** be resolved before proceeding to detailed design.

| ID | Issue | Impact | Recommendation | Owner | Target Date |
|----|-------|--------|----------------|-------|-------------|
| BLOCKING-01 | [Issue description] | [HIGH] | [Specific action required] | [Vendor/Architect] | [DATE] |
| BLOCKING-02 | [Issue description] | [HIGH] | [Specific action required] | [Vendor/Architect] | [DATE] |

---

### 11.2 High Priority Issues (ADVISORY)

Issues that **SHOULD** be addressed, preferably before DLD, but not blocking.

| ID | Issue | Impact | Recommendation | Owner | Target Date |
|----|-------|--------|----------------|-------|-------------|
| ADVISORY-01 | [Issue description] | [MEDIUM] | [Specific action required] | [Vendor/Architect] | [DATE] |
| ADVISORY-02 | [Issue description] | [MEDIUM] | [Specific action required] | [Vendor/Architect] | [DATE] |

---

### 11.3 Low Priority Items (INFORMATIONAL)

Suggestions for improvement, not required for approval.

| ID | Suggestion | Benefit | Owner |
|----|------------|---------|-------|
| INFO-01 | [Suggestion] | [Potential benefit] | [Vendor] |
| INFO-02 | [Suggestion] | [Potential benefit] | [Vendor] |

---

## 12. Review Decision

### 12.1 Final Decision

**Status**: [ ] APPROVED | [ ] APPROVED WITH CONDITIONS | [ ] REJECTED

**Effective Date**: [DATE]

**Conditions** (if conditional approval):
1. [BLOCKING-01 must be resolved by [DATE]]
2. [BLOCKING-02 must be resolved by [DATE]]
3. [Revised HLD section X.Y resubmitted for review]

**Next Steps**:
- [ ] Vendor addresses blocking issues
- [ ] Revised HLD sections submitted for re-review (if applicable)
- [ ] Re-review meeting scheduled (if needed): [DATE]
- [ ] Proceed to Detailed Design phase
- [ ] HLD documentation finalized and baselined

---

### 12.2 Reviewer Sign-Off

| Reviewer | Role | Decision | Signature | Date |
|----------|------|----------|-----------|------|
| [Name] | Lead Reviewer / Enterprise Architect | [ ] Approve [ ] Conditional [ ] Reject | _________ | [DATE] |
| [Name] | Security Architect | [ ] Approve [ ] Conditional [ ] Reject | _________ | [DATE] |
| [Name] | Domain Architect | [ ] Approve [ ] Conditional [ ] Reject | _________ | [DATE] |
| [Name] | Infrastructure Architect | [ ] Approve [ ] Conditional [ ] Reject | _________ | [DATE] |
| [Name] | Data Architect | [ ] Approve [ ] Conditional [ ] Reject | _________ | [DATE] |
| [Name] | SRE Lead | [ ] Approve [ ] Conditional [ ] Reject | _________ | [DATE] |

**Unanimous Approval Required**: [ ] Yes [ ] No

**Escalation** (if reviewers cannot reach consensus): [CTO/CIO | Architecture Steering Committee]

---

## 13. Appendices

### Appendix A: HLD Document Reference

[Link to or attach the HLD document under review]

### Appendix B: Requirements Traceability Matrix

[Link to requirements→design traceability matrix]

### Appendix C: Architecture Principles Document

[Link to enterprise architecture principles]

### Appendix D: Review Meeting Notes

[Attach notes from review meetings, Q&A sessions]

---

**Document Control**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | [DATE] | [LEAD_REVIEWER] | Initial review |
| 1.1 | [DATE] | [LEAD_REVIEWER] | Updated after vendor clarifications |
| 2.0 | [DATE] | [LEAD_REVIEWER] | Final approval decision |

## External References

| Document | Type | Source | Key Extractions | Path |
|----------|------|--------|-----------------|------|
| *None provided* | — | — | — | — |

---

**Generated by**: ArcKit `/arckit.hld-review` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]