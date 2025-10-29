# Traceability Guide

Complete guide to maintaining requirements traceability using ArcKit.

---

## What is Traceability?

Requirements traceability is the ability to trace each requirement through:
- **Requirements** → **Design** → **Implementation** → **Tests** → **Deployment**

### Why Traceability Matters

**For Compliance**:
- FDA (medical devices): 21 CFR Part 11
- ISO 26262 (automotive): Safety-critical systems
- DO-178C (aerospace): Aviation software
- SOX (financial): Audit trails

**For Quality**:
- ✅ Verify every requirement is implemented
- ✅ Detect orphan requirements (not in design)
- ✅ Detect scope creep (design not in requirements)
- ✅ Assess test coverage
- ✅ Impact analysis for change requests

**For Go/No-Go Decisions**:
- "Are we ready to release?"
- "Are all MUST requirements implemented and tested?"
- "What gaps remain?"

---

## Creating Traceability Matrix

### Prerequisites

- ✅ Requirements defined (`/arckit.requirements`)
- ✅ HLD reviewed (`/arckit.hld-review`)
- ✅ DLD reviewed (`/arckit.dld-review`)
- Ideally: Implementation in progress with tests

### Generate Traceability Matrix

```bash
/arckit.traceability Generate matrix for [project]
```

**Example**:
```bash
/arckit.traceability Generate traceability matrix for payment gateway project
```

### What Gets Generated

Three comprehensive reports:

1. **traceability-matrix.md** - Full requirement-to-test mapping
2. **coverage-report.md** - Coverage metrics and analysis
3. **gaps.md** - Detailed gap analysis with remediation plan

---

## Traceability Matrix Structure

### Forward Traceability

Requirement → Design → Implementation → Tests

```markdown
## FR-001: Process Credit Card Payments

**Requirement**: System SHALL process credit card payments and return
confirmation within 5 seconds.

**Priority**: MUST

### Design Mapping

**HLD Components**:
- PaymentService (handles payment logic)
- PaymentGatewayAdapter (integrates with Stripe)
- TransactionRepository (persists transactions)

**DLD Modules**:
- `src/services/payment_service.py::PaymentService.process_payment()`
- `src/adapters/stripe_adapter.py::StripeAdapter.charge()`
- `src/models/transaction.py::Transaction`

**Architecture Patterns**:
- Adapter pattern for payment gateway abstraction
- Repository pattern for data access

### Implementation Mapping

**Source Files**:
- `src/services/payment_service.py` (lines 45-120)
- `src/adapters/stripe_adapter.py` (lines 30-85)
- `src/models/transaction.py` (lines 10-40)

**APIs**:
- POST /v1/payments (endpoint that implements this requirement)

**Database**:
- `payments` table (stores transaction records)

### Test Coverage

**Unit Tests**:
- `tests/services/test_payment_service.py::test_process_payment_success`
- `tests/services/test_payment_service.py::test_process_payment_declined`
- `tests/adapters/test_stripe_adapter.py::test_charge_success`

**Integration Tests**:
- `tests/integration/test_payment_flow.py::test_end_to_end_payment`

**Performance Tests**:
- `tests/performance/test_payment_latency.py::test_payment_under_5s`

**Status**: ✅ FULLY IMPLEMENTED AND TESTED

---

## NFR-R-001: 99.99% Uptime

**Requirement**: System SHALL maintain 99.99% uptime.

**Priority**: MUST

### Design Mapping

**HLD Components**:
- Multi-region deployment (us-east-1, us-west-2)
- Route53 health checks and failover
- Auto-scaling groups (2-50 instances)
- Database replication (primary + read replicas)

**DLD Modules**:
- Infrastructure-as-Code (Terraform)
- Health check endpoint: GET /health
- Circuit breakers in service clients

### Implementation Mapping

**Infrastructure**:
- `terraform/main.tf` (multi-region setup)
- `terraform/autoscaling.tf` (auto-scaling configuration)
- `terraform/route53.tf` (DNS failover)

**Application**:
- `src/health.py::health_check()` (health endpoint)
- `src/clients/base_client.py::CircuitBreaker` (circuit breaker implementation)

### Test Coverage

**Integration Tests**:
- ❌ **MISSING**: No disaster recovery test
- ❌ **MISSING**: No multi-region failover test

**Load Tests**:
- `tests/load/test_sustained_load.py::test_24h_sustained_load`

**Status**: ⚠️ PARTIALLY TESTED - CRITICAL GAPS

**Gap Analysis**:
- **GAP-001**: No automated DR failover test
- **GAP-002**: No chaos engineering / fault injection tests
- **Priority**: HIGH - required for compliance
```

### Traceability Table

Compact view of all requirements:

```markdown
## Complete Traceability Matrix

| Req ID | Requirement | Priority | HLD | DLD | Impl | Tests | Status |
|--------|-------------|----------|-----|-----|------|-------|--------|
| BR-001 | Cost reduction 30% | MUST | ✅ | ✅ | ✅ | ⚠️ | Metrics needed |
| FR-001 | Process CC payments | MUST | ✅ | ✅ | ✅ | ✅ | Complete |
| FR-002 | Process ACH | MUST | ✅ | ✅ | ✅ | ✅ | Complete |
| FR-003 | Digital wallets | SHOULD | ✅ | ✅ | 🔄 | ⏳ | In progress |
| NFR-P-001 | Response < 2s | MUST | ✅ | ✅ | ✅ | ✅ | Complete |
| NFR-S-001 | PCI-DSS | MUST | ✅ | ✅ | ✅ | ⚠️ | Tests incomplete |
| NFR-R-001 | 99.99% uptime | MUST | ✅ | ✅ | ✅ | ❌ | No DR tests |
| INT-001 | Stripe integration | MUST | ✅ | ✅ | ✅ | ✅ | Complete |

**Legend**:
- ✅ Complete
- ⚠️ Partially complete
- ❌ Missing / Not started
- 🔄 In progress
- ⏳ Planned
```

---

## Coverage Metrics

### Overall Coverage

```markdown
## Coverage Summary

### By Requirement Type

| Type | Total | Designed | Implemented | Tested | Coverage |
|------|-------|----------|-------------|--------|----------|
| Business (BR) | 15 | 15 (100%) | 15 (100%) | 12 (80%) | 80% |
| Functional (FR) | 45 | 45 (100%) | 42 (93%) | 38 (84%) | 84% |
| Non-Functional (NFR) | 22 | 22 (100%) | 20 (91%) | 16 (73%) | 73% |
| Integration (INT) | 8 | 8 (100%) | 8 (100%) | 7 (88%) | 88% |
| Data (DR) | 5 | 5 (100%) | 5 (100%) | 4 (80%) | 80% |
| **TOTAL** | **95** | **95 (100%)** | **90 (95%)** | **77 (81%)** | **81%** |

### By Priority

| Priority | Total | Complete | % Complete |
|----------|-------|----------|------------|
| MUST | 70 | 65 | 93% |
| SHOULD | 15 | 10 | 67% |
| MAY | 10 | 2 | 20% |

### Critical Gaps

**5 MUST requirements not fully tested**:
- NFR-S-001: PCI-DSS (missing compliance tests)
- NFR-R-001: 99.99% uptime (missing DR tests)
- NFR-R-002: Data backup (missing restore tests)
- FR-042: Fraud detection (missing integration tests)
- INT-003: Accounting integration (missing error scenario tests)

**Overall Readiness**: 81% (Recommend 95%+ for production release)
```

### Coverage Trends

Track over time:

```markdown
## Coverage Trend

| Date | Overall | MUST Reqs | Gaps |
|------|---------|-----------|------|
| 2024-09-01 | 45% | 60% | 35 |
| 2024-09-15 | 62% | 75% | 22 |
| 2024-10-01 | 73% | 88% | 12 |
| 2024-10-14 | 81% | 93% | 5 |
| Target | 95% | 100% | 0 (MUST) |

**Progress**: On track for 95%+ coverage by 2024-11-01 release
```

---

## Gap Analysis

### Types of Gaps

#### 1. Orphan Requirements

Requirements with no design/implementation:

```markdown
## Orphan Requirements

### BR-003: International Expansion ROI

**Requirement**: Enable sales in 50+ countries to increase revenue by 25%

**Status**: ❌ NOT IN DESIGN

**Issue**: Requirement defined but no HLD component addresses it

**Impact**: Business objective will not be met

**Root Cause**: Requirement added late, after HLD approval

**Remediation**:
1. Determine if truly required for v1.0 (discuss with stakeholders)
2. If yes: Update HLD to add international payment support
3. If no: Move to v2.0 backlog and update priority to MAY

**Owner**: Product Manager
**Due**: 2024-10-20
**Priority**: HIGH
```

#### 2. Orphan Design Elements

Design components not tied to any requirement (scope creep?):

```markdown
## Orphan Design Elements

### RecommendationEngine Component

**Location**: HLD Section 4.5, DLD src/ml/recommendation_engine.py

**Description**: ML-based product recommendation engine

**Issue**: No requirement specifies recommendation functionality

**Possible Causes**:
- Scope creep (vendor added feature not requested)
- Missing requirement (stakeholders assumed it was obvious)
- Future requirement (planned for v2.0)

**Investigation**:
- Review with Product Manager: Is this required?
- Check SOW: Was this in scope?
- Review vendor contract: Billable or free addition?

**Recommendation**:
- If not required: Remove from v1.0 (reduce complexity)
- If required: Add requirement BR-015 or FR-055 retroactively
- Document decision and rationale

**Owner**: Enterprise Architect
**Due**: 2024-10-18
**Priority**: MEDIUM
```

#### 3. Untested Requirements

Requirements implemented but not tested:

```markdown
## Untested Requirements

### NFR-R-001: 99.99% Uptime

**Requirement**: System SHALL maintain 99.99% uptime

**Status**: ✅ Implemented, ❌ NOT TESTED

**Implementation**:
- Multi-region deployment configured
- Health checks and auto-scaling working
- Database replication in place

**Missing Tests**:
- ❌ No automated disaster recovery test
- ❌ No chaos engineering / fault injection
- ❌ No multi-region failover simulation

**Risk**: Cannot verify uptime SLA is achievable

**Remediation**:
1. Create DR runbook and test procedure
2. Implement automated DR failover test (weekly)
3. Add chaos engineering tests (Chaos Monkey)
4. Run 72-hour soak test to verify reliability

**Owner**: DevOps Lead
**Due**: Before production release (BLOCKING)
**Priority**: CRITICAL
```

#### 4. Coverage Gaps by Type

```markdown
## Coverage Gaps Summary

### Non-Functional Requirements (NFRs) - 73% Coverage

**Issue**: NFRs are hardest to test but most critical

**Missing Tests**:
- Performance under sustained load (24+ hours)
- Disaster recovery and failover
- Security penetration testing
- Scalability beyond 10K TPS

**Impact**: Production incidents likely

**Remediation**:
- Allocate 2 additional weeks for NFR testing
- Hire third-party security auditor
- Run extended load tests (72 hours)

### Integration Requirements - 88% Coverage

**Issue**: Integration error scenarios not fully tested

**Missing Tests**:
- Third-party API failures (Stripe downtime)
- Network timeouts and retries
- Webhook delivery failures

**Remediation**:
- Add fault injection for integration tests
- Test all error paths (not just happy path)
```

---

## Using Traceability

### 1. Go/No-Go Release Decision

```markdown
## Release Readiness: Payment Gateway v1.0

**Target Release**: 2024-11-01

### Traceability Metrics

- Overall Coverage: 81%
- MUST Requirements: 93% (5 gaps)
- Test Coverage: 77%

### Critical Gaps (BLOCKING)

**Must Fix Before Release**:
1. NFR-R-001: Disaster recovery tests
2. NFR-S-001: PCI-DSS compliance audit
3. FR-042: Fraud detection integration tests
4. INT-003: Accounting integration error tests
5. NFR-R-002: Data backup restore test

**Effort**: 80 hours (2 weeks with current team)

### Decision

**RECOMMEND**: Delay release to 2024-11-15 (2 weeks)

**Rationale**:
- 5 MUST requirements untested = HIGH RISK
- PCI-DSS compliance audit required (cannot launch without)
- 2 additional weeks brings coverage to 98%

**Alternative**: Launch with reduced scope (defer 5 gaps to v1.1)
- Risk: Compliance violations, production incidents
- Not recommended for payment processing system
```

### 2. Change Impact Analysis

```markdown
## Change Request: Add Apple Pay Support

**Requirement**: New FR-055: Support Apple Pay

**Traceability Impact Analysis**:

### Affected Requirements

**Dependent Requirements** (may need updates):
- NFR-P-001: Response time (Apple Pay adds latency)
- NFR-S-001: PCI-DSS (Apple Pay tokenization flow)
- INT-001: Payment gateway (Stripe must support Apple Pay)

### Affected Design

**HLD Components**:
- PaymentService (add Apple Pay flow)
- PaymentGatewayAdapter (add Apple Pay adapter)

**DLD Modules**:
- `src/services/payment_service.py` (add payment method)
- `src/adapters/apple_pay_adapter.py` (new file)

### Affected Tests

**New Tests Required**:
- Unit tests for Apple Pay flow (8 test cases)
- Integration test with Stripe Apple Pay API
- Performance test (ensure < 2s response time)
- Security test (token validation)

**Estimated Effort**: 40 hours (1 week)

**Recommendation**: Approve for v1.1 (not v1.0 due to timeline)
```

### 3. Audit Trail

For compliance audits:

```markdown
## FDA Audit: Software Traceability

**Product**: Medical Payment Device
**Regulation**: 21 CFR Part 11
**Audit Date**: 2024-12-01

### Traceability Evidence

**Requirements**:
- All 95 requirements documented with unique IDs
- Each requirement has acceptance criteria
- Requirements approved by stakeholders (sign-offs on file)

**Design Traceability**:
- 100% of requirements traced to HLD components
- 100% of requirements traced to DLD modules
- Architecture review records on file (HLD/DLD reviews)

**Implementation Traceability**:
- 95% of requirements have source code mapping
- Code review records available in GitHub
- Version control history complete

**Test Traceability**:
- 81% of requirements have test coverage
- Test plans documented and approved
- Test execution results recorded

**Gap Analysis**:
- 5 MUST requirements with incomplete tests (documented in gaps.md)
- Remediation plan approved and in progress
- Expected completion: 2024-11-15

**Audit Verdict**: PASS (with minor observation - improve NFR test coverage)
```

---

## Integration with Other Requirements

Traceability integrates with and validates all other ArcKit artifacts:

### Links to Requirements

**Traceability starts with requirements:**
- Every BR, FR, NFR, INT, DR must appear in matrix
- Requirements categorized by priority (MUST/SHOULD/MAY)
- Orphan requirements signal incomplete implementation
- Missing requirements signal scope creep

**Example:**
If requirements.md has FR-015 "Process credit card payments":
- ✅ Traceability matrix shows FR-015 → PaymentService component
- ✅ Shows FR-015 → TestPaymentProcessing test case
- ⚠️ If missing → Requirement not implemented (gap)

**Action:** Every requirement ID must trace to at least one design element.

### Links to Architecture Principles

**Traceability validates principle enforcement:**
- Security principles → Security requirements → Security controls → Security tests
- Performance principles → Performance requirements → Performance architecture → Performance tests
- Reliability principles → Reliability requirements → HA architecture → Failover tests

**Example:**
If principle SEC-001 states "Zero Trust Architecture":
- ✅ Traces to NFR-S-003 "All API calls require authentication"
- ✅ Traces to AuthenticationMiddleware component in HLD
- ✅ Traces to TestAuthenticationEnforcement test suite
- Complete chain: Principle → Requirement → Design → Test

**Action:** Include principle IDs in traceability matrix for governance visibility.

### Links to Stakeholder Analysis

**Traceability shows stakeholder value delivered:**
- Stakeholder goals (G-xxx) → Business requirements (BR-xxx) → Features delivered
- Stakeholder outcomes (O-xxx) → Success metrics → Test results
- Stakeholder concerns → Risk mitigations → Validation tests

**Example:**
If CFO has goal "G-1: Reduce costs 40%":
- ✅ Traces to BR-003 "Automate procurement workflow"
- ✅ Traces to AutomationEngine component
- ✅ Traces to TestAutomationEfficiency (validates cost savings)
- Shows CFO's goal is implemented and tested

**Action:** Create stakeholder-facing traceability view: Goals → Requirements → Status.

### Links to Risk Register

**Traceability validates risk mitigations:**
- HIGH/CRITICAL risks → Mitigation requirements → Architecture → Tests
- Risk acceptance decisions → Requirements to skip → Gaps explained
- Residual risks → Monitoring requirements → Observability → Alert tests

**Example:**
If RISK-003 is "Single point of failure (HIGH)" with mitigation "Multi-AZ deployment":
- ✅ Traces to NFR-R-002 "99.95% uptime SLA"
- ✅ Traces to Multi-AZ deployment architecture in HLD
- ✅ Traces to TestFailoverScenarios test suite
- Proves risk is mitigated, not just documented

**Action:** Include risk IDs in traceability matrix to show mitigation coverage.

### Links to Business Case (SOBC)

**Traceability validates business case delivery:**
- Economic Case benefits → Business requirements → Implementation → Validation
- Strategic Case objectives → Requirements → Architecture → Tests
- Management Case assumptions → Non-functional requirements → Tests

**Example:**
If SOBC Economic Case claims "£500K annual savings from automation":
- ✅ Traces to BR-008 "Reduce manual approval time from 5 days to 1 hour"
- ✅ Traces to WorkflowAutomation component
- ✅ Traces to TestAutomationPerformance (proves 1 hour target achieved)
- ⚠️ If savings not tested → Business case at risk

**Action:** Create business case validation report using traceability data.

### Links to Data Model

**Traceability validates data implementation:**
- Data requirements (DR-xxx) → Entities (E-xxx) → Database tables → Data tests
- PII inventory → Encryption requirements → Security controls → Compliance tests
- Retention requirements → Archive procedures → Automation → Audit tests

**Example:**
If DR-005 requires "Store customer payment history for 7 years":
- ✅ Traces to Entity E-004 (PaymentHistory)
- ✅ Traces to payment_history table in PostgreSQL
- ✅ Traces to PaymentHistoryRepository component
- ✅ Traces to TestDataRetention (validates 7-year policy)

**Action:** Ensure every DR-xxx traces to entity, table, and data validation test.

### Links to Design Reviews

**Traceability is the deliverable FROM design reviews:**
- HLD Review → High-level traceability (Requirements → Containers/Services)
- DLD Review → Detailed traceability (Requirements → Components/Classes)
- Review checklist → Traceability coverage targets (80% minimum, 95% ideal)
- Approval criteria → Gaps addressed or justified

**Example:**
HLD Review for payment gateway checks:
- ✅ All payment requirements (FR-015 to FR-022) trace to PaymentService
- ✅ All integration requirements (INT-xxx) trace to external APIs
- ⚠️ NFR-P-003 (caching) has no design element → Add Redis cache
- HLD approved contingent on adding cache

**Action:** Use traceability matrix as primary review artifact for design reviews.

### Links to Compliance

**Traceability provides audit evidence:**
- GDPR Article 17 (Right to erasure) → DR-012 → DeleteUserDataService → TestDataErasure
- PCI-DSS 3.2.1 (Encrypt card data) → NFR-S-005 → AES-256 encryption → TestEncryption
- Technology Code of Practice #5 (Make things secure) → Security requirements → Security controls → Security tests

**Example:**
For GDPR audit, traceability shows:
- ✅ Legal basis documented (DR-003)
- ✅ Consent management implemented (FR-008)
- ✅ Data subject rights implemented (FR-009 to FR-012)
- ✅ All GDPR requirements tested (90+ test cases)
- Compliance proven with traceability matrix as evidence

**Action:** Include compliance framework IDs in traceability matrix (GDPR Article X, PCI-DSS X.X).

### Links to Testing

**Traceability drives test strategy:**
- MUST requirements → 100% test coverage required
- SHOULD requirements → 80% test coverage target
- MAY requirements → Tested if implemented
- Critical path requirements → Integration + E2E tests required

**Example:**
If FR-015 is MUST "Process credit card payments":
- ✅ Unit tests: TestPaymentProcessing (component level)
- ✅ Integration tests: TestStripeIntegration (API level)
- ✅ E2E tests: TestCheckoutFlow (user journey)
- ✅ Security tests: TestPCICompliance (compliance)
- All 4 test types required for MUST requirements

**Action:** Generate test plan from traceability gaps - untested requirements = test cases to write.

### Integration Summary

**Traceability is the validation layer that proves:**
1. **Vertical alignment**: Principles → Requirements → Design → Code → Tests
2. **Horizontal traceability**: Stakeholders → Goals → Requirements → Features → Tests
3. **Governance compliance**: Risks → Mitigations → Requirements → Architecture → Tests
4. **Business case delivery**: Benefits → Requirements → Implementation → Validation

**Without traceability, you have documents. With traceability, you have proof.**

---

## Best Practices

### 1. Maintain Throughout Lifecycle

- ❌ Create traceability matrix at end (too late!)
- ✅ Update traceability after each phase (requirements, HLD, DLD, implementation, testing)

### 2. Automate Where Possible

- Link requirement IDs in code comments:
  ```python
  # Implements FR-001: Process credit card payments
  def process_payment(payment_data):
      ...
  ```

- Link requirement IDs in test names:
  ```python
  def test_fr001_process_payment_success():
      ...
  ```

- Use tools to extract and build matrix automatically

### 3. Focus on MUST Requirements

- 100% of MUST requirements MUST be implemented and tested
- SHOULD and MAY can have gaps (document why)

### 4. Regular Reviews

- Weekly: Update traceability status
- Monthly: Review gaps and remediation progress
- Before release: Complete gap analysis

### 5. Use for Communication

Traceability matrix is excellent for:
- Status updates to stakeholders
- Release readiness reviews
- Audit preparation
- Onboarding new team members

---

## Common Pitfalls

### 1. No Traceability Until End

❌ "We'll document traceability before release"
✅ Maintain traceability throughout (cheaper to fix gaps early)

### 2. Incomplete Test Traceability

❌ Only test happy paths
✅ Test all acceptance criteria (including error cases)

### 3. No Gap Remediation

❌ Identify gaps but don't fix them
✅ Track gaps to resolution (owner + due date)

### 4. Ignoring Orphans

❌ "Extra design components are fine"
✅ Investigate orphans (scope creep? missing requirements?)

---

## Tools and Automation

### Manual (ArcKit)

- `/arckit.traceability` generates reports from documents
- Requires manual updates to reflect implementation status

### Automated Options

**Requirements Management Tools**:
- Jira (requirements as tickets, link to code/tests)
- Azure DevOps (work items with traceability)
- IBM DOORS (formal requirements management)

**Integration**:
```python
# Link requirement in code
# REQ: FR-001
def process_payment():
    ...

# Link requirement in test
# TEST: FR-001
def test_process_payment():
    ...
```

Parse comments to build traceability automatically.

---

## Next Steps

1. **Generate initial matrix**: Run `/arckit.traceability`
2. **Review gaps**: Analyze critical gaps (MUST requirements)
3. **Remediation plan**: Assign owners and due dates
4. **Update regularly**: Weekly status updates
5. **Go/no-go decision**: Use for release readiness

---

## Related Documentation

- [Requirements Guide](requirements.md) - Start with good requirements
- [Design Review Guide](design-review.md) - Verify design traces to requirements
- [Principles Guide](principles.md) - Principles also need traceability

---

**Remember**: You can't improve what you don't measure. Traceability is your measurement system for project completeness.

---

**Last updated**: 2025-10-28
**ArcKit Version**: 0.4.0
