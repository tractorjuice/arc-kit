# Design Review Guide

Complete guide to conducting High-Level Design (HLD) and Detailed Design (DLD) reviews using ArcKit.

---

## Overview

Design reviews are **quality gates** that prevent costly mistakes:
- **HLD Review** - Architecture decisions (before implementation)
- **DLD Review** - Technical implementation details (before coding)

**Critical principle**: Implementation cannot start until both gates pass.

---

## High-Level Design (HLD) Review

### What is HLD?

High-Level Design defines the **architecture** of the solution:
- System components and their responsibilities
- Data flow between components
- Technology stack choices
- Scalability and resilience strategy
- Security architecture
- Integration patterns

### When to Conduct HLD Review

**After vendor selection, before detailed design begins**

Timeline:
1. Vendor selected (week 0)
2. Vendor creates HLD (weeks 1-4)
3. **HLD review** (week 5)
4. Vendor addresses feedback (week 6)
5. HLD approved → DLD work begins

### Running HLD Review

```bash
/arckit.hld-review Review [vendor] HLD for [project]
```

**Example**:
```bash
/arckit.hld-review Review Acme Payment Solutions HLD for payment gateway
```

### What Gets Reviewed

#### 1. Architecture Principles Compliance

For **each principle** in `.arckit/memory/architecture-principles.md`:

```markdown
### CLOUD-001: Cloud-First Architecture

**Status**: ✅ COMPLIANT

**Evidence**:
- Uses AWS cloud-native services (Lambda, API Gateway, DynamoDB)
- Infrastructure-as-Code with Terraform
- Multi-AZ deployment configured
- Auto-scaling groups defined

**Validation Gates**:
- [x] Cloud-native services (no VMs)
- [x] Infrastructure-as-Code defined
- [x] Multi-AZ deployment
- [x] Auto-scaling configured
```

**Violations** are flagged:

```markdown
### SEC-002: API-First Security

**Status**: ❌ NON-COMPLIANT

**Issue**: API endpoints lack rate limiting (required by principle)

**Impact**: System vulnerable to DoS attacks

**Recommendation**: Add AWS WAF with rate limiting (1000 req/min per client)

**Priority**: BLOCKING (must fix before approval)
```

#### 2. Requirements Coverage

For **each requirement** (BR, FR, NFR, INT, DR):

```markdown
### Requirements Coverage Matrix

| Req ID | Requirement | Covered? | HLD Component | Notes |
|--------|-------------|----------|---------------|-------|
| FR-001 | Process CC payments | ✅ | PaymentService | Complete |
| FR-002 | Process ACH | ✅ | PaymentService | Complete |
| NFR-P-001 | Response < 2s | ⚠️ | All | CDN + caching should achieve, needs load testing |
| NFR-S-001 | PCI-DSS | ✅ | SecurityArchitecture | Token vault, encryption |
| NFR-R-001 | 99.99% uptime | ❌ | Infrastructure | Single-region = GAP! Need multi-region |
| INT-001 | Stripe integration | ✅ | PaymentGatewayAdapter | Properly abstracted |
```

**Gaps** are critical:
- ❌ = Requirement not addressed (BLOCKING)
- ⚠️ = Partially addressed (needs clarification)
- ✅ = Fully addressed

#### 3. Architecture Quality Assessment

**Scalability** (Score: 0-10):
```markdown
### Scalability: 7/10

**Strengths**:
- Horizontal scaling with auto-scaling groups (2-50 instances)
- Stateless application design
- Database read replicas (1-10 replicas)
- CDN for static content

**Concerns**:
- Database writes don't scale (single primary)
- No caching strategy defined (should use Redis)
- Session affinity may limit scaling

**Recommendations**:
- Add Redis for caching (reduce DB load 80%)
- Implement CQRS if write scaling becomes issue
```

**Security** (Score: 0-10):
```markdown
### Security: 9/10

**Strengths**:
- OAuth 2.0 + JWT authentication
- AES-256 encryption at rest (RDS encryption)
- TLS 1.2+ in transit
- Token vault for PCI-DSS compliance
- IAM roles (no hardcoded credentials)
- Security groups properly configured

**Concerns**:
- Missing WAF / rate limiting
- No DDoS protection mentioned

**Recommendations**:
- Add AWS WAF with rate limiting
- Enable AWS Shield Standard (free)
```

**Resilience** (Score: 0-10):
```markdown
### Resilience: 6/10

**Strengths**:
- Multi-AZ deployment (3 AZs)
- Health checks configured
- Auto-recovery for failed instances

**Concerns**:
- Single-region deployment
- RTO/RPO not clearly defined
- No disaster recovery runbook

**Recommendations**:
- Multi-region deployment for 99.99% uptime
- Define RTO: < 60 seconds, RPO: < 5 minutes
- Create DR runbook and test quarterly
```

#### 4. Architecture Patterns Review

Check for anti-patterns:

```markdown
### Pattern Analysis

✅ **Good Patterns**:
- Microservices with clear boundaries
- Event-driven for async processing (Kafka)
- Circuit breakers for resilience
- API Gateway pattern

❌ **Anti-Patterns Found**:
- **Distributed Monolith**: Services share database tables (ISSUE)
- **Chatty APIs**: 10+ API calls for checkout flow (ISSUE)

**Recommendations**:
- Each microservice needs its own database (separate schemas)
- Implement BFF (Backend for Frontend) to reduce API calls
```

#### 5. Technology Stack Review

```markdown
### Technology Stack Compliance

| Component | Proposed | Approved? | Notes |
|-----------|----------|-----------|-------|
| Language | Python 3.11 | ✅ | Approved |
| Framework | FastAPI | ✅ | Approved |
| Database | PostgreSQL 15 | ✅ | Approved |
| Cache | Redis 7 | ✅ | Approved |
| Message Queue | Kafka | ✅ | Approved |
| Monitoring | New Relic | ⚠️ | Prefer Datadog (company standard) |
| CI/CD | GitHub Actions | ✅ | Approved |

**Issues**:
- New Relic not company standard (use Datadog for consistency)
```

### HLD Review Output

The review produces a comprehensive report:

```markdown
## Executive Summary

**Status**: APPROVED WITH CONDITIONS

**Overall Assessment**: Strong architecture with modern cloud-native design.
Addresses most requirements but has critical gaps in disaster recovery and
rate limiting that MUST be addressed.

**Key Findings**:
1. ✅ Cloud-native AWS architecture
2. ✅ Strong PCI-DSS compliant security design
3. ❌ Single-region deployment insufficient for 99.99% uptime
4. ❌ Missing WAF / rate limiting (security risk)
5. ⚠️ Database sharing between microservices (anti-pattern)

**Recommendation**: APPROVE with conditions below

## Blocking Issues (MUST FIX)

**[BLOCKING-01]** Multi-Region Deployment
- Current: Single region (us-east-1)
- Required: Multi-region for 99.99% uptime SLA
- Recommendation: Add us-west-2 with Route53 failover
- Owner: Acme Infrastructure Team
- Due: Before DLD review

**[BLOCKING-02]** WAF and Rate Limiting
- Current: No rate limiting
- Required: Prevent DoS attacks (SEC-002 principle)
- Recommendation: AWS WAF with 1000 req/min per IP
- Owner: Acme Security Team
- Due: Before DLD review

## Non-Blocking Improvements (SHOULD FIX)

**[IMPROVEMENT-01]** Separate Microservice Databases
- Current: Services share database tables
- Issue: Creates tight coupling (anti-pattern)
- Recommendation: Each service gets own schema
- Priority: Medium
- Timeline: Address in DLD

**[IMPROVEMENT-02]** Caching Strategy
- Current: No caching defined
- Issue: May not meet response time SLA
- Recommendation: Redis for session/API response caching
- Priority: Medium
- Timeline: Address in DLD

## Approval Conditions

HLD is APPROVED pending:
1. BLOCKING-01 resolved (multi-region)
2. BLOCKING-02 resolved (WAF/rate limiting)
3. Updated HLD document submitted for re-review

Once conditions met, proceed to DLD phase.

**Next Review Date**: 2024-11-01 (2 weeks)
```

---

## Detailed Design (DLD) Review

### What is DLD?

Detailed Design specifies **implementation details**:
- Component interfaces (API specs)
- Data models (database schemas)
- Algorithms and business logic
- Error handling strategies
- Test plans
- Deployment procedures

### When to Conduct DLD Review

**After HLD approval, before coding begins**

Timeline:
1. HLD approved (week 6)
2. Vendor creates DLD (weeks 7-10)
3. **DLD review** (week 11)
4. Vendor addresses feedback (week 12)
5. DLD approved → Implementation starts

### Running DLD Review

```bash
/arckit.dld-review Review [vendor] DLD for [project]
```

**Example**:
```bash
/arckit.dld-review Review Acme Payment Solutions DLD for payment gateway
```

### What Gets Reviewed

#### 1. HLD Compliance

Verify HLD conditions were addressed:

```markdown
## HLD Conditions Check

- [x] BLOCKING-01: Multi-region deployment added (us-east-1 + us-west-2)
- [x] BLOCKING-02: AWS WAF configured with rate limiting
- [x] Architecture diagrams updated

**Result**: All HLD conditions met ✅
```

If HLD conditions not met → **Reject DLD, return to HLD**

#### 2. API Design Review

Check API specifications:

```markdown
### API: POST /v1/payments

**OpenAPI Spec**: ✅ Provided (payments-api-v1.yaml)

**Request**:
```json
{
  "amount": 10000,  // cents
  "currency": "USD",
  "payment_method": "card_tok_visa4242",
  "customer_id": "cust_12345",
  "metadata": {
    "order_id": "ord_789"
  }
}
```

**Response (Success - 200)**:
```json
{
  "payment_id": "pay_xyz",
  "status": "succeeded",
  "amount": 10000,
  "created_at": "2024-10-14T10:00:00Z"
}
```

**Response (Error - 400)**:
```json
{
  "error": {
    "code": "invalid_amount",
    "message": "Amount must be positive"
  }
}
```

**Validation**:
- [x] OpenAPI 3.0 spec provided
- [x] Request schema defined
- [x] Response schemas defined (success + errors)
- [x] Authentication documented (Bearer token)
- [x] Rate limiting specified (1000/min)
- [x] Idempotency key supported
```

**Issues found**:

```markdown
❌ **Issue**: Missing error codes for common failures

**Required**:
- `insufficient_funds`
- `card_declined`
- `network_error`
- `payment_timeout`

**Priority**: BLOCKING
```

#### 3. Data Model Review

Check database schema:

```markdown
### Database Schema: payments table

```sql
CREATE TABLE payments (
  payment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(customer_id),
  amount INTEGER NOT NULL CHECK (amount > 0),  -- cents
  currency CHAR(3) NOT NULL DEFAULT 'USD',
  status VARCHAR(20) NOT NULL CHECK (status IN (
    'pending', 'processing', 'succeeded', 'failed', 'refunded'
  )),
  payment_method_id UUID NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  metadata JSONB
);

-- Indexes
CREATE INDEX idx_payments_customer ON payments(customer_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created_at ON payments(created_at);
```

**Review**:
- [x] Primary key defined (UUID)
- [x] Foreign keys defined
- [x] NOT NULL constraints appropriate
- [x] CHECK constraints for data integrity
- [x] Indexes on query columns
- [x] Timestamps for audit trail

**Issues**:
- ⚠️ Missing index on `(customer_id, created_at)` for customer payment history query
- ✅ Schema migration script provided (alembic)
```

#### 4. Security Implementation

```markdown
### Security Implementation Review

**Authentication**:
- [x] OAuth 2.0 with Auth0
- [x] JWT token format specified
- [x] Token expiration: 1 hour
- [x] Refresh token rotation implemented

**Authorization**:
- [x] RBAC model defined
- [x] Permission matrix provided
- [x] Least privilege enforced

**Encryption**:
- [x] At rest: RDS encryption (AES-256)
- [x] In transit: TLS 1.2+
- [x] Application-level: PII encrypted with KMS
- [x] Key rotation: Automatic (90 days)

**Secrets Management**:
- [x] AWS Secrets Manager
- [x] No secrets in code/config
- [x] IAM roles (no access keys)

**PCI-DSS**:
- [x] No full card numbers stored
- [x] Token vault used (Stripe)
- [x] Audit logging for all transactions
- [x] Network segmentation

**Issues**: None - security implementation is comprehensive ✅
```

#### 5. Testing Strategy

```markdown
### Test Strategy Review

**Unit Testing**:
- Target: 80% code coverage
- Framework: pytest
- Mock external dependencies
- [x] Strategy documented

**Integration Testing**:
- Test scenarios: 15 defined
- Includes happy path + error cases
- Tests API contracts
- [x] Test plan provided

**Performance Testing**:
- Tool: JMeter
- Scenarios: Ramp from 100 to 10,000 TPS
- Success criteria: P95 < 2s
- [x] Load test plan provided

**Security Testing**:
- SAST: SonarQube in CI/CD
- DAST: OWASP ZAP
- Penetration test: Planned with third party
- [x] Security test plan provided

**Issues**:
- ⚠️ Missing chaos engineering / fault injection tests
- Recommendation: Add Chaos Monkey for resilience testing
```

### DLD Review Output

```markdown
## Executive Summary

**Status**: APPROVED WITH CONDITIONS

**Implementation Readiness**: 85/100

**Assessment**: DLD is comprehensive with clear API specs, solid data models,
and strong security implementation. Minor gaps in error handling and testing
must be addressed before implementation.

## Blocking Issues

**[BLOCKING-01]** Complete API Error Codes
- Missing error codes for payment failures
- Due: Before sprint 1
- Owner: Acme API Team

**[BLOCKING-02]** Add Database Index
- Need index on (customer_id, created_at)
- Due: Before sprint 1
- Owner: Acme Data Team

## Non-Blocking Improvements

**[IMPROVEMENT-01]** Chaos Engineering Tests
- Add fault injection tests
- Timeline: Sprint 3
- Priority: Medium

## Approval Conditions

DLD is APPROVED pending:
1. BLOCKING issues resolved
2. Updated DLD submitted

**Implementation may begin** once conditions met.

**Expected Start**: 2024-11-15
```

---

## Best Practices

### 1. Review as a Team

- Include: Architect, Security, DevOps, Tech Lead
- Multiple perspectives catch more issues
- Formal review meeting (2-3 hours)

### 2. Be Thorough but Constructive

- ✅ "Add WAF for rate limiting to prevent DoS"
- ❌ "Security is terrible"

### 3. Prioritize Issues

- **BLOCKING**: Must fix before proceeding
- **Non-Blocking**: Should fix but not blocking
- **Nice-to-Have**: Optimize later

### 4. Document Everything

- Review notes
- Decisions made
- Rationale for approval/rejection
- Action items with owners

### 5. Follow Up

- Track blocking items to completion
- Re-review if major changes
- Don't approve until conditions met

---

## Common Pitfalls

### 1. Rubber-Stamp Approval

❌ "Looks good" without actual review
✅ Systematic review against principles and requirements

### 2. Reviewing Wrong Level of Detail

- HLD: Don't review code-level details
- DLD: Don't re-review architecture (that was HLD)

### 3. No Follow-Through

❌ Identify issues but don't track resolution
✅ Track blocking items until resolved

### 4. Starting Implementation Too Early

❌ "We'll fix during implementation"
✅ Fix design issues before coding (much cheaper)

---

## Review Checklist

### HLD Review Checklist

- [ ] All architecture principles checked
- [ ] All requirements mapped to components
- [ ] Scalability strategy defined and adequate
- [ ] Security architecture comprehensive
- [ ] Resilience / DR strategy defined
- [ ] Technology stack approved
- [ ] Integration patterns appropriate
- [ ] No anti-patterns identified
- [ ] Blocking issues identified and assigned
- [ ] Approval decision documented

### DLD Review Checklist

- [ ] HLD conditions verified as complete
- [ ] API specs complete (OpenAPI)
- [ ] Database schemas defined with indexes
- [ ] Security implementation detailed
- [ ] Error handling comprehensive
- [ ] Test strategy complete
- [ ] Deployment procedures defined
- [ ] Monitoring and alerting specified
- [ ] Implementation ready (no ambiguities)
- [ ] Approval decision documented

---

## Next Steps

1. **After vendor selection**: Request HLD
2. **Conduct HLD review**: Run `/arckit.hld-review`
3. **Track HLD conditions**: Ensure blocking items resolved
4. **Request DLD**: After HLD approval
5. **Conduct DLD review**: Run `/arckit.dld-review`
6. **Track DLD conditions**: Ensure blocking items resolved
7. **Approve implementation**: Development begins
8. **Traceability**: Run `/arckit.traceability` during implementation

---

## Related Documentation

- [Principles Guide](principles.md) - Principles used in HLD review
- [Requirements Guide](requirements.md) - Requirements used in reviews
- [Procurement Guide](procurement.md) - Vendor selection before design review
- [Traceability Guide](traceability.md) - Verify design meets requirements

---

**Remember**: Design reviews are gates for a reason. Don't skip them or rubber-stamp. Bad designs cost 10x-100x more to fix in production.
