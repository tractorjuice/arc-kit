# Architecture Principles Guide

A comprehensive guide to establishing and enforcing enterprise architecture governance using ArcKit.

---

## What Are Architecture Principles?

Architecture principles are the fundamental rules and guidelines that govern technology decisions across your organization. They serve as the "constitution" for your enterprise architecture, ensuring consistency, quality, and alignment with business objectives.

### Why You Need Principles

Without architecture principles:
- ❌ Every team makes different technology choices
- ❌ Inconsistent security implementations
- ❌ Vendor lock-in and technical debt accumulate
- ❌ Compliance violations go undetected
- ❌ No objective basis for design reviews

With architecture principles:
- ✅ Consistent technology stack across the organization
- ✅ Enforced security and compliance standards
- ✅ Objective criteria for vendor selection
- ✅ Clear guidelines for design reviews
- ✅ Reduced technical debt

---

## Creating Your First Principles

### Step 1: Initialize ArcKit Project

```bash
arckit init my-enterprise --ai claude
cd my-enterprise
claude
```

### Step 2: Run the Principles Command

```bash
/arckit.principles Create architecture principles for [your organization/industry]
```

**Examples**:
```bash
/arckit.principles Create principles for a financial services company
/arckit.principles Create principles for healthcare with HIPAA compliance
/arckit.principles Create principles for e-commerce retail
/arckit.principles Create principles for government agency
```

### Step 3: Review and Customize

The command will generate comprehensive principles in `.arckit/memory/architecture-principles.md`. Review and customize to match your organization's needs.

---

## Structure of Principles

Each principle should include:

### 1. Principle Statement
Clear, enforceable statement using MUST/SHOULD/MAY

**Example**:
```markdown
### Cloud-First Architecture

**Principle Statement**: All new solutions MUST leverage cloud-native services
unless a documented exception is approved.
```

### 2. Rationale
Explain WHY this principle exists

**Example**:
```markdown
**Rationale**:
- Reduces infrastructure management overhead
- Enables rapid scaling
- Improves disaster recovery capabilities
- Aligns with company FinOps strategy
```

### 3. Approved Technologies
Specific technologies or vendors that comply

**Example**:
```markdown
**Approved Cloud Providers**:
- Primary: AWS
- Secondary: Azure (for specific use cases)
- Not approved: GCP (no current expertise)
```

### 4. Validation Gates
Checklist for compliance verification

**Example**:
```markdown
**Validation Gates**:
- [ ] Solution uses cloud-native services (no VM-based deployments)
- [ ] Infrastructure-as-Code (Terraform) defined
- [ ] Multi-AZ deployment configured
- [ ] Auto-scaling policies defined
```

### 5. Example Implementations
Show what compliance looks like

**Example**:
```markdown
**Example**:
✅ **Compliant**: Serverless API using AWS Lambda + API Gateway + DynamoDB
❌ **Non-compliant**: EC2 instances with manual scaling
```

### 6. Exception Process
How to request deviations

**Example**:
```markdown
**Exception Process**:
1. Submit exception request to Architecture Review Board
2. Document business justification and alternatives considered
3. ARB reviews within 5 business days
4. Approved exceptions are time-limited (max 12 months)
```

---

## Essential Principle Categories

### 1. Strategic Principles

Define high-level technology direction:

- **Cloud-First Architecture**
- **API-First Design**
- **Mobile-First User Experience**
- **Platform Engineering**
- **Buy vs Build Strategy**

### 2. Security Principles

Establish security standards:

- **Security by Design**
- **Zero Trust Architecture**
- **Least Privilege Access**
- **Data Encryption (at rest and in transit)**
- **Security Scanning in CI/CD**

### 3. Data Principles

Govern data management:

- **Single Source of Truth**
- **Data Quality Standards**
- **Privacy by Design**
- **Data Classification**
- **Data Retention Policies**

### 4. Technology Standards

Define approved technologies:

- **Programming Languages** (approved: Python, TypeScript, Go)
- **Frameworks** (approved: React, FastAPI, Spring Boot)
- **Databases** (approved: PostgreSQL, DynamoDB, Redis)
- **Message Queues** (approved: Kafka, SQS, EventBridge)

### 5. Architecture Patterns

Standard design approaches:

- **Microservices Architecture**
- **Event-Driven Architecture**
- **CQRS (Command Query Responsibility Segregation)**
- **Circuit Breaker Pattern**
- **Saga Pattern for Distributed Transactions**

### 6. Development Practices

Engineering standards:

- **CI/CD Pipeline Required**
- **Automated Testing (80% coverage minimum)**
- **Code Review Process**
- **Infrastructure as Code**
- **Observability (logs, metrics, traces)**

---

## Industry-Specific Principles

### Financial Services

Additional principles for banking, fintech, insurance:

```markdown
### Transaction Integrity

**Principle**: All financial transactions MUST implement ACID properties with
audit trails for regulatory compliance.

**Compliance Requirements**:
- SOX (Sarbanes-Oxley)
- PCI-DSS (for payment processing)
- AML/KYC regulations
- Regional banking regulations

**Validation Gates**:
- [ ] Database transactions are ACID-compliant
- [ ] All transactions logged with immutable audit trail
- [ ] Reconciliation process defined
- [ ] Fraud detection integrated
```

### Healthcare

Additional principles for healthcare, medical devices:

```markdown
### HIPAA Compliance

**Principle**: All systems handling Protected Health Information (PHI) MUST
implement HIPAA Security Rule safeguards.

**Requirements**:
- Access controls (role-based, user authentication)
- Audit controls (track all PHI access)
- Integrity controls (prevent unauthorized alteration)
- Transmission security (encrypt PHI in transit)

**Validation Gates**:
- [ ] HIPAA risk assessment completed
- [ ] Business Associate Agreements (BAAs) signed
- [ ] PHI encryption implemented (AES-256)
- [ ] Access logging configured
- [ ] Breach notification procedure defined
```

### Retail/E-Commerce

Additional principles for retail, marketplace platforms:

```markdown
### Payment Processing Security

**Principle**: All payment processing MUST be PCI-DSS compliant with no
storage of full credit card numbers.

**Requirements**:
- PCI-DSS Level 1 compliance
- Tokenization of payment data
- Secure payment gateway integration
- Regular security scanning

**Validation Gates**:
- [ ] Payment data never stored in application database
- [ ] PCI-DSS compliant payment gateway used (Stripe, Adyen)
- [ ] Network segmentation for payment processing
- [ ] Quarterly vulnerability scans completed
```

### Government

Additional principles for public sector, defense:

```markdown
### Accessibility Requirements

**Principle**: All public-facing applications MUST comply with Section 508
accessibility standards.

**Requirements**:
- WCAG 2.1 Level AA compliance
- Screen reader compatibility
- Keyboard navigation support
- Color contrast ratios

**Validation Gates**:
- [ ] Automated accessibility testing in CI/CD
- [ ] Manual accessibility review completed
- [ ] Section 508 VPAT (Voluntary Product Accessibility Template) completed
- [ ] User testing with assistive technologies
```

---

## Using Principles in Your Workflow

### 1. Requirements Definition

Reference principles when defining requirements:

```markdown
### NFR-S-001: Authentication

**Requirement**: System MUST implement OAuth 2.0 with JWT tokens for authentication.

**Rationale**: Aligns with SEC-002 "API-First Security" principle requiring
standard authentication protocols.

**Acceptance Criteria**:
- OAuth 2.0 authorization server configured
- JWT tokens with 1-hour expiration
- Refresh token rotation implemented
```

### 2. Vendor Evaluation

Use principles as mandatory qualifications:

```markdown
## Mandatory Qualifications (Pass/Fail)

1. **Cloud-Native Architecture**: Vendor's solution MUST use cloud-native
   services (aligns with CLOUD-001 principle)

2. **PCI-DSS Certification**: Vendor MUST have current PCI-DSS Level 1
   certification (aligns with SEC-005 principle)
```

### 3. Design Reviews

Check HLD/DLD against principles:

```markdown
## HLD Review: Architecture Principles Compliance

### CLOUD-001: Cloud-First Architecture
✅ **Status**: COMPLIANT
- Uses AWS Lambda, API Gateway, DynamoDB
- Infrastructure defined in Terraform
- Multi-AZ deployment configured

### SEC-002: API-First Security
❌ **Status**: NON-COMPLIANT
**Issue**: API endpoints lack rate limiting
**Recommendation**: Add AWS WAF with rate limiting rules
**Priority**: BLOCKING
```

### 4. Exception Management

Document and track exceptions:

```markdown
## Architecture Exception Request

**Project**: Legacy System Migration
**Principle Violated**: CLOUD-001 (Cloud-First Architecture)
**Requested Exception**: Use on-premise servers for 12 months during migration

**Justification**:
- Legacy system cannot be migrated immediately
- 12-month phased migration plan approved
- Cloud migration roadmap documented

**Mitigation**:
- Monthly progress reviews
- No new features added to on-premise system
- Cloud architecture designed and approved

**Approval**: ARB approved 2024-10-14
**Expiration**: 2025-10-14
**Owner**: Jane Smith, Enterprise Architect
```

---

## Maintaining Principles

### Regular Review Cycle

Principles should be living documents:

- **Quarterly Review**: Update for new technologies, lessons learned
- **Annual Review**: Major revision based on business strategy changes
- **Ad-hoc Updates**: When significant technology shifts occur

### Version Control

Keep principles in Git:

```bash
git log .arckit/memory/architecture-principles.md
```

Track changes, understand evolution, revert if needed.

### Communication

Ensure principles are widely known:

- Include in onboarding for new architects and senior engineers
- Reference in design review meetings
- Link from project documentation
- Discuss in architecture community of practice

---

## Common Pitfalls

### 1. Principles Too Vague

❌ **Bad**: "Systems should be secure"
✅ **Good**: "All systems MUST implement OAuth 2.0 for authentication with MFA for privileged access"

### 2. Principles Too Rigid

❌ **Bad**: "All applications MUST use Java"
✅ **Good**: "Applications SHOULD use approved languages (Java, Python, Go) unless business case justifies alternative"

### 3. No Validation Gates

❌ **Bad**: Principle statement only, no way to verify compliance
✅ **Good**: Principle with clear checklist items for HLD/DLD review

### 4. No Exception Process

❌ **Bad**: Principles with no escape valve for legitimate exceptions
✅ **Good**: Clear exception request process with time limits and accountability

### 5. Principles Not Enforced

❌ **Bad**: Principles exist but design reviews don't check them
✅ **Good**: Every HLD review includes principles compliance section

---

## Example: Complete Principle

Here's a complete, well-structured principle:

```markdown
### SEC-002: API-First Security

**Principle Statement**: All APIs MUST implement OAuth 2.0 authentication,
rate limiting, and request/response logging.

**Rationale**:
- Prevents unauthorized access to business data
- Protects against denial-of-service attacks
- Enables security incident investigation
- Aligns with Zero Trust security model

**Approved Technologies**:
- **Authentication**: OAuth 2.0 with Auth0, Okta, or AWS Cognito
- **Rate Limiting**: AWS WAF, Cloudflare, or Kong API Gateway
- **Logging**: AWS CloudWatch, Datadog, or Splunk

**Validation Gates**:
- [ ] OAuth 2.0 authorization server configured
- [ ] API endpoints require valid JWT token
- [ ] Rate limiting configured (max 1000 req/min per client)
- [ ] Request/response logging to centralized system
- [ ] API gateway handles authentication (no auth in application code)
- [ ] Sensitive data (passwords, tokens) excluded from logs

**Example Implementation**:

✅ **Compliant**:
```typescript
// API Gateway handles OAuth validation
// Application receives validated JWT claims
app.get('/api/users', requireAuth, async (req, res) => {
  const userId = req.user.sub; // from validated JWT
  logger.info('User request', { userId, endpoint: '/api/users' });
  // ... business logic
});
```

❌ **Non-Compliant**:
```typescript
// No authentication
app.get('/api/users', async (req, res) => {
  // Anyone can call this!
});
```

**Common Violations**:
- Basic Auth instead of OAuth 2.0
- No rate limiting (vulnerable to DoS)
- Authentication in application code (not centralized)
- API keys committed to Git

**Exception Process**:
1. Submit request to Security Architecture Review Board
2. Document alternative approach and security controls
3. SARB reviews within 3 business days
4. If approved, exception valid for 6 months maximum
5. Quarterly security reviews required for exceptions

**Related Principles**:
- SEC-001: Security by Design
- SEC-003: Zero Trust Architecture
- DATA-002: Data Access Controls

**Last Updated**: 2024-10-14
**Owner**: Security Architecture Team
```

---

## Next Steps

1. **Create your principles**: Run `/arckit.principles`
2. **Review and customize**: Tailor to your organization
3. **Communicate**: Share with teams and stakeholders
4. **Enforce**: Use in design reviews and vendor evaluation
5. **Maintain**: Regular updates based on lessons learned

---

## Related Documentation

- [Requirements Guide](requirements.md) - How to write requirements that align with principles
- [Design Review Guide](design-review.md) - How to review designs against principles
- [Vendor Procurement Guide](procurement.md) - How to use principles in vendor selection

---

**Remember**: Principles are only valuable if they're enforced. Make them part of every design review, vendor evaluation, and architecture decision.
