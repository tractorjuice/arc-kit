# Requirements Guide

A comprehensive guide to writing effective business and technical requirements using ArcKit.

---

## What Are Requirements?

Requirements define **what** a system must do (functional) and **how well** it must do it (non-functional). They serve as the contract between business stakeholders, architects, and implementation teams.

### Why Requirements Matter

Without good requirements:
- ❌ Scope creep and missed expectations
- ❌ Vendor proposals that don't address real needs
- ❌ Design reviews with no objective criteria
- ❌ Failed implementations that don't meet business needs
- ❌ No traceability for compliance audits

With good requirements:
- ✅ Clear scope and acceptance criteria
- ✅ Objective vendor evaluation
- ✅ Design reviews with measurable standards
- ✅ Implementations that solve actual problems
- ✅ Complete traceability for audits

---

## Creating Requirements with ArcKit

### Step 1: Ensure Principles Exist

```bash
# Check if principles are defined
ls .arckit/memory/architecture-principles.md

# If not, create them first
/arckit.principles Create principles for [your organisation]
```

### Step 2: Analyze Stakeholders (CRITICAL - Do This BEFORE Requirements!)

```bash
/arckit.stakeholders Analyze stakeholders for [your project]
```

**Why This is Critical**: Requirements should address **real stakeholder goals**, not invented needs. Understanding who cares about the project and why ensures:
- Requirements trace to stakeholder drivers
- Prioritization based on stakeholder power/interest
- Conflicts identified early
- Strong stakeholder buy-in

**Examples**:
```bash
/arckit.stakeholders Analyze stakeholders for payment gateway where CFO wants cost savings and CTO wants innovation
/arckit.stakeholders Map drivers to goals for customer portal project
/arckit.stakeholders Create stakeholder engagement plan for data warehouse migration
```

### Step 3: Run the Requirements Command

```bash
/arckit.requirements Create requirements for [your project]
```

The requirements command will:
- Check for stakeholder analysis (recommends creating it if missing)
- Trace requirements back to stakeholder goals
- Identify conflicts based on stakeholder conflicts
- Document resolution strategies

**Examples**:
```bash
/arckit.requirements Create requirements for payment gateway modernization
/arckit.requirements Define requirements for customer portal with self-service capabilities
/arckit.requirements Build requirements for data warehouse migration to cloud
```

### Step 4: Review and Refine

The command generates a comprehensive requirements document in `projects/NNN-project-name/requirements.md`. Review, refine, and validate with stakeholders.

---

## Requirement Types

ArcKit organises requirements into five categories:

### 1. Business Requirements (BR-xxx)

**Purpose**: Define business objectives, ROI, and success criteria

**Structure**:
```markdown
### BR-001: Cost Reduction

**Requirement**: Reduce payment processing costs by 30% annually.

**Current State**: $1.2M/year in processing fees (2.5% average rate)

**Target State**: $840K/year (1.75% average rate)

**Rationale**: Current payment processor charging above-market rates.
Competitive bidding expected to reduce fees significantly.

**Success Metrics**:
- [ ] Total payment processing costs < $840K in year 1
- [ ] Average processing rate < 1.75%
- [ ] No increase in failed transactions

**Priority**: MUST

**Stakeholder**: CFO
```

**Common Business Requirements**:
- Cost reduction or avoidance
- Revenue growth
- Market expansion
- Regulatory compliance
- Customer satisfaction improvement
- Operational efficiency

### 2. Functional Requirements (FR-xxx)

**Purpose**: Define features, capabilities, and user workflows

**Structure**:
```markdown
### FR-001: Process Credit Card Payments

**Requirement**: System SHALL process credit card payments (Visa, Mastercard,
Amex, Discover) and return confirmation within 5 seconds.

**User Story**: As a customer, I want to pay with my credit card so that I
can complete my purchase quickly.

**Acceptance Criteria**:
- [ ] Accepts Visa, Mastercard, American Express, Discover
- [ ] Validates card number using Luhn algorithm
- [ ] Checks card expiration date
- [ ] Processes CVV verification
- [ ] Returns transaction ID on success
- [ ] Returns clear error message on failure
- [ ] Completes transaction in < 5 seconds (95th percentile)

**Priority**: MUST

**Dependencies**:
- INT-001: Integration with payment gateway
- NFR-S-001: PCI-DSS compliance

**Test Scenarios**:
1. Valid card → successful charge
2. Expired card → decline with error
3. Invalid CVV → decline with error
4. Insufficient funds → decline with error
5. Network timeout → retry logic
```

**Common Functional Requirements**:
- User authentication and authorisation
- Data entry and validation
- Business logic processing
- Reporting and analytics
- Integration with external systems
- Notifications and alerts

### 3. Non-Functional Requirements (NFR-xxx)

**Purpose**: Define quality attributes, performance, security, scalability

ArcKit sub-categorizes NFRs:

#### NFR-P-xxx: Performance

```markdown
### NFR-P-001: API Response Time

**Requirement**: All API endpoints MUST respond within 2 seconds at 95th
percentile under peak load.

**Measurement Method**:
- Load testing with JMeter
- Production monitoring with New Relic
- P95 response time metric

**Load Conditions**:
- Peak load: 10,000 concurrent users
- Transactions: 1,000 TPS
- Data volume: 100M customer records

**Acceptance Criteria**:
- [ ] P50 response time < 500ms
- [ ] P95 response time < 2s
- [ ] P99 response time < 5s
- [ ] No degradation under sustained peak load

**Priority**: MUST

**Consequences of Failure**: Customer abandonment, revenue loss
```

#### NFR-S-xxx: Security

```markdown
### NFR-S-001: PCI-DSS Compliance

**Requirement**: Payment processing system MUST achieve PCI-DSS Level 1
compliance.

**PCI-DSS Requirements**:
1. Install and maintain firewall configuration
2. Do not use vendor-supplied defaults
3. Protect stored cardholder data (encryption at rest)
4. Encrypt transmission of cardholder data (TLS 1.2+)
5. Use and regularly update anti-virus software
6. Develop and maintain secure systems and applications
7. Restrict access to cardholder data (need-to-know)
8. Assign unique ID to each person with computer access
9. Restrict physical access to cardholder data
10. Track and monitor all access to network resources
11. Regularly test security systems and processes
12. Maintain information security policy

**Validation**:
- [ ] Quarterly network scans by ASV (Approved Scanning Vendor)
- [ ] Annual on-site assessment by QSA (Qualified Security Assessor)
- [ ] Attestation of Compliance (AOC) submitted

**Priority**: MUST (regulatory requirement)

**Architecture Alignment**: Aligns with SEC-005 (PCI-DSS) principle
```

#### NFR-R-xxx: Reliability

```markdown
### NFR-R-001: System Availability

**Requirement**: System SHALL maintain 99.99% uptime (4 nines).

**Calculation**:
- Maximum downtime: 52.6 minutes/year
- Maximum downtime: 4.38 minutes/month

**Reliability Measures**:
- Multi-AZ deployment (at least 3 availability zones)
- Automated failover (< 60 seconds)
- Database replication with automatic failover
- Health checks every 30 seconds
- Circuit breakers to prevent cascade failures

**Monitoring**:
- [ ] Uptime monitoring with PagerDuty
- [ ] SLA dashboard with real-time availability
- [ ] Incident response SLA < 15 minutes

**Consequences**:
- SLA credit: 10% monthly fee per 0.1% below target
- Revenue impact: $10K/hour of downtime

**Priority**: MUST
```

#### NFR-SC-xxx: Scalability

```markdown
### NFR-SC-001: Horizontal Scaling

**Requirement**: System MUST automatically scale to handle 10x traffic
spikes within 5 minutes.

**Baseline Load**: 1,000 TPS
**Peak Load**: 10,000 TPS (Black Friday, holiday sales)

**Scaling Strategy**:
- Application servers: Auto-scaling group 2-50 instances
- Database: Read replicas scale 1-10 instances
- Cache: ElastiCache cluster with auto-scaling

**Acceptance Criteria**:
- [ ] Scales from 2 to 20 app instances in < 5 minutes
- [ ] No increase in error rate during scale-up
- [ ] Scales down during low traffic (cost optimisation)
- [ ] Database connections pooled appropriately

**Test Method**: Gradually increase load from 1K to 10K TPS over 10 minutes

**Priority**: MUST
```

#### NFR-C-xxx: Compliance

```markdown
### NFR-C-001: GDPR Compliance

**Requirement**: System MUST comply with GDPR for handling EU customer data.

**GDPR Requirements**:
- Right to access: Customers can request all their data
- Right to rectification: Customers can correct their data
- Right to erasure: Customers can request data deletion
- Right to data portability: Export data in machine-readable format
- Right to object: Customers can opt-out of processing
- Data breach notification: Within 72 hours

**Implementation**:
- [ ] Data subject access request (DSAR) workflow
- [ ] Automated data export (JSON format)
- [ ] Soft delete with 30-day retention before hard delete
- [ ] Consent management system
- [ ] Data processing audit trail
- [ ] Cookie consent banner (EU visitors)

**Documentation**:
- Data Protection Impact Assessment (DPIA)
- Records of Processing Activities (ROPA)
- Data Processing Agreement (DPA) with vendors

**Priority**: MUST (legal requirement for EU customers)
```

### 4. Integration Requirements (INT-xxx)

**Purpose**: Define external system integrations

```markdown
### INT-001: Payment Gateway Integration

**Requirement**: Integrate with Stripe for payment processing.

**Integration Type**: RESTful API (HTTPS)

**Data Flow**:
1. Customer submits payment → Frontend
2. Frontend → Backend API (tokenized payment)
3. Backend → Stripe API (process payment)
4. Stripe → Webhook (payment confirmation)
5. Backend → Database (update order status)
6. Backend → Customer (confirmation email)

**API Endpoints Used**:
- POST /v1/payment_intents (create payment)
- POST /v1/payment_intents/{id}/confirm (confirm payment)
- POST /v1/refunds (process refund)

**Authentication**: Stripe API keys (secret key in Secrets Manager)

**Error Handling**:
- Network timeout (30s) → Retry 3x with exponential backoff
- Rate limit (429) → Backoff and retry
- Payment declined → Return error to customer
- Webhook failure → Retry with exponential backoff (24 hours max)

**Data Mapping**:
| Our System | Stripe API |
|------------|------------|
| order_id | metadata.order_id |
| customer_email | receipt_email |
| amount_cents | amount (integer, cents) |
| currency | currency (ISO 4217) |

**Acceptance Criteria**:
- [ ] Successful payment processing
- [ ] Proper error handling for all failure modes
- [ ] Webhook signature verification
- [ ] Idempotency keys prevent duplicate charges
- [ ] Retry logic for transient failures

**SLA**: Stripe guarantees 99.99% uptime

**Priority**: MUST

**Dependencies**: NFR-S-001 (PCI-DSS compliance)
```

### 5. Data Requirements (DR-xxx)

**Purpose**: Define data models, retention, privacy, migration

```markdown
### DR-001: Customer Data Model

**Requirement**: Store customer data with proper normalization and indexing.

**Entity Relationship**:
```
Customer (1) → (N) Orders
Customer (1) → (N) Payment Methods
Order (1) → (N) Order Items
```

**Customer Table Schema**:
```sql
CREATE TABLE customers (
  customer_id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP NULL  -- soft delete for GDPR
);

CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_created_at ON customers(created_at);
```

**Data Classification**: PII (Personally Identifiable Information)

**Retention Policy**:
- Active customers: Indefinite
- Inactive customers (no orders in 7 years): Eligible for deletion
- Deleted customers: 30-day soft delete before hard delete

**Encryption**:
- At rest: AWS RDS encryption (AES-256)
- In transit: TLS 1.2+
- Application-level: Email and phone encrypted with KMS

**Backup**:
- Daily automated backups (30-day retention)
- Point-in-time recovery enabled
- Cross-region backup replication

**Privacy Controls**:
- [ ] Access controls (RBAC)
- [ ] Audit logging (all data access)
- [ ] Data masking in non-production environments
- [ ] GDPR-compliant deletion workflow

**Priority**: MUST
```

---

## Writing Effective Requirements

### Best Practices

#### 1. Be Specific and Measurable

❌ **Bad**: System should be fast
✅ **Good**: API endpoints MUST respond in < 2 seconds at P95

❌ **Bad**: System should be secure
✅ **Good**: System MUST implement OAuth 2.0 with MFA for admin access

#### 2. Use Clear Language

- **MUST** / **SHALL**: Mandatory requirement (failure = rejection)
- **SHOULD**: Strongly recommended (failure = points deducted in vendor eval)
- **MAY** / **COULD**: Optional nice-to-have

#### 3. Include Rationale

Always explain WHY:
```markdown
**Rationale**: Current system has 5-minute response times, causing customer
abandonment (40% drop-off rate). Industry standard is < 2 seconds.
```

#### 4. Define Acceptance Criteria

Make it testable:
```markdown
**Acceptance Criteria**:
- [ ] Unit test coverage > 80%
- [ ] All API endpoints have integration tests
- [ ] Load test demonstrates 10K TPS capability
- [ ] Security scan shows no high/critical vulnerabilities
```

#### 5. Identify Dependencies

```markdown
**Dependencies**:
- Requires INT-001 (Stripe integration)
- Blocks FR-015 (Subscription billing)
- Aligns with SEC-002 (API Security) principle
```

### Common Pitfalls

#### 1. Vague Requirements

❌ "System should handle lots of users"
✅ "System MUST support 10,000 concurrent users with < 2s response time"

#### 2. Solution Instead of Requirement

❌ "Use PostgreSQL database"
✅ "Require ACID-compliant database with < 100ms query response time"

(Let vendors propose PostgreSQL, MySQL, etc.)

#### 3. Untestable Requirements

❌ "System should be user-friendly"
✅ "New users SHALL complete checkout in < 3 minutes with < 10% abandonment rate"

#### 4. Missing Non-Functionals

Don't forget:
- Performance (response time, throughput)
- Security (authentication, encryption, compliance)
- Reliability (uptime, MTBF, MTTR)
- Scalability (growth projections)
- Compliance (regulations, standards)

---

## Requirements Workflow

### 1. Gather Requirements

**Stakeholder Interviews**:
- Business stakeholders (objectives, ROI)
- End users (usability, workflows)
- Operations (reliability, monitoring)
- Security (compliance, threats)
- Legal (regulations, contracts)

**Techniques**:
- User story mapping
- Process flow diagrams
- Current state / future state analysis
- Competitive analysis

### 2. Write Requirements

```bash
/arckit.requirements Create requirements for [project]
```

ArcKit generates a comprehensive template. Fill in details from stakeholder interviews.

### 3. Review with Stakeholders

- **Business**: Validate business requirements and ROI
- **Technical**: Validate NFRs are achievable
- **Security**: Validate compliance requirements
- **Legal**: Validate regulatory requirements

### 4. Prioritize

Mark each requirement:
- **MUST**: Non-negotiable (vendor must comply or be disqualified)
- **SHOULD**: Important but negotiable
- **MAY**: Nice-to-have

### 5. Generate SOW/RFP

```bash
/arckit.sow Generate SOW for [project]
```

Requirements automatically flow into the RFP document.

### 6. Design Reviews

Use requirements as the checklist for HLD/DLD reviews:

```bash
/arckit.hld-review Review [vendor] HLD for [project]
```

Verify every requirement is addressed in the design.

### 7. Traceability

```bash
/arckit.traceability Generate matrix for [project]
```

Ensure every requirement is traced to design, implementation, and tests.

---

## Example: Payment Gateway Requirements

Here's a complete requirements example:

### Business Requirements

**BR-001**: Reduce payment processing costs by 30%
**BR-002**: Increase payment success rate to > 99%
**BR-003**: Enable international payments (50+ countries)

### Functional Requirements

**FR-001**: Process credit card payments (Visa, MC, Amex, Discover)
**FR-002**: Process ACH/bank transfers
**FR-003**: Process digital wallets (Apple Pay, Google Pay, PayPal)
**FR-004**: Support payment installments
**FR-005**: Process refunds and chargebacks
**FR-006**: Fraud detection and prevention
**FR-007**: Real-time payment status dashboard
**FR-008**: Payment reconciliation reporting

### Non-Functional Requirements

**NFR-P-001**: API response time < 2s (P95)
**NFR-P-002**: Process 1,000 TPS sustained, 10,000 TPS peak
**NFR-S-001**: PCI-DSS Level 1 compliance
**NFR-S-002**: OAuth 2.0 authentication
**NFR-S-003**: AES-256 encryption at rest and TLS 1.2+ in transit
**NFR-R-001**: 99.99% uptime SLA
**NFR-R-002**: Zero data loss (RPO = 0)
**NFR-R-003**: < 60 second failover (RTO < 1min)
**NFR-SC-001**: Auto-scale to 10x traffic in 5 minutes
**NFR-C-001**: GDPR compliance (EU customers)
**NFR-C-002**: SOX compliance (financial reporting)

### Integration Requirements

**INT-001**: Stripe payment gateway integration
**INT-002**: Fraud detection service (Sift, Kount)
**INT-003**: Accounting system integration (QuickBooks API)
**INT-004**: CRM integration (Salesforce API)
**INT-005**: Webhook notifications to order management system

### Data Requirements

**DR-001**: Customer data model (PII protection)
**DR-002**: Transaction data model (7-year retention for SOX)
**DR-003**: Audit trail (immutable log of all transactions)
**DR-004**: Data migration from legacy system (10M transactions)

---

## Next Steps

1. **Create requirements**: Run `/arckit.requirements [project]`
2. **Review with stakeholders**: Validate completeness and accuracy
3. **Prioritize**: Mark MUST/SHOULD/MAY
4. **Generate SOW**: Run `/arckit.sow` for RFP
5. **Track traceability**: Use requirements in design reviews

---

## Related Documentation

- [Architecture Principles Guide](principles.md) - Requirements should align with principles
- [Vendor Procurement Guide](procurement.md) - Use requirements for vendor evaluation
- [Design Review Guide](design-review.md) - Verify requirements coverage in designs
- [Traceability Guide](traceability.md) - Track requirements through implementation

---

**Remember**: Requirements are the foundation of everything. Invest time here to save massive effort later.
