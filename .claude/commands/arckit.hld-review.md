---
description: Review High-Level Design (HLD) against architecture principles and requirements
---

You are helping an enterprise architect review a High-Level Design (HLD) document to ensure it meets architecture principles, requirements, and quality standards before implementation begins.

## User Input

```text
$ARGUMENTS
```

## Instructions

1. **Identify the context**: The user should specify:
   - Project name/number
   - Vendor name (if applicable)
   - Location of HLD document or diagrams

2. **Read the governance context**:
   - Read `.arckit/memory/architecture-principles.md` - These are the rules
   - Read `projects/{project-dir}/requirements.md` - These must be satisfied
   - Read `projects/{project-dir}/sow.md` - Check deliverable expectations
   - Read `.arckit/templates/hld-review-template.md` - Review checklist

3. **Obtain the HLD document**:
   - Ask user: "Please provide the HLD document path or paste key sections"
   - Or: "Is the HLD in `projects/{project-dir}/vendors/{vendor}/hld.md`?"
   - Or: "Please share architecture diagrams (I can read images)"

4. **Perform comprehensive review**:

   ### A. Architecture Principles Compliance

   For each principle in architecture-principles.md:
   - **Check compliance**: Does the HLD follow this principle?
   - **Validation gates**: Go through the checklist items
   - **Flag violations**: Document any deviations
   - **Exception handling**: If principle violated, was exception approved?

   Example checks:
   - Cloud-First: Are they using cloud-native services or legacy on-prem?
   - API-First: Is there an API strategy? RESTful? GraphQL?
   - Security by Design: Encryption? Authentication? Authorization?
   - Microservices: Proper service boundaries? No distributed monoliths?

   ### B. Requirements Coverage

   For each requirement (BR, FR, NFR, INT, DR):
   - **Verify coverage**: Is this requirement addressed in the HLD?
   - **Design adequacy**: Is the proposed design sufficient?
   - **Trace to components**: Which components implement this requirement?

   Example:
   - NFR-P-001 (Response time <2s): Does architecture support this? CDN? Caching? Database indexing?
   - NFR-S-001 (PCI-DSS): Is there a clear security architecture? Token vault? Encryption?

   ### C. Architecture Quality Assessment

   **Scalability**:
   - Horizontal scaling strategy
   - Load balancing approach
   - Database scaling (sharding, read replicas)
   - Stateless design

   **Performance**:
   - Caching strategy (Redis, CDN)
   - Database optimisation
   - Asynchronous processing
   - API response times

   **Security**:
   - Authentication/Authorization (OAuth, JWT, RBAC)
   - Data encryption (at rest, in transit)
   - Secrets management
   - API security (rate limiting, WAF)
   - Compliance (PCI-DSS, HIPAA, GDPR, etc.)

   **Resilience**:
   - Fault tolerance (circuit breakers, retries)
   - Disaster recovery (RTO/RPO)
   - Multi-region/AZ deployment
   - Data backup strategy

   **Operational Excellence**:
   - Monitoring and observability (logs, metrics, traces)
   - CI/CD pipeline
   - Blue-green or canary deployment
   - Runbooks and automation

   ### D. Architecture Patterns Review

   - Are patterns used correctly? (microservices, event-driven, CQRS, etc.)
   - Any anti-patterns? (distributed monolith, chatty APIs, tight coupling)
   - Data consistency strategy (eventual vs strong consistency)
   - Integration patterns (sync vs async, message queue)

   ### E. Technology Stack Review

   - Are technologies from approved list?
   - Any deprecated technologies?
   - License compliance
   - Team expertise with chosen stack
   - Vendor lock-in risks

5. **Risk Assessment**:

   Identify and categorize risks:
   - **HIGH**: Principle violations, missing NFRs, security gaps
   - **MEDIUM**: Suboptimal design, performance concerns, tech debt
   - **LOW**: Minor improvements, documentation gaps

6. **Generate Review Report**:

   Create a comprehensive review document with:

   **Executive Summary**:
   - Overall status: APPROVED / APPROVED WITH CONDITIONS / REJECTED
   - Key findings (top 3-5 issues)
   - Recommendation

   **Detailed Findings**:
   - Principle compliance (with violations flagged)
   - Requirements coverage matrix
   - Architecture quality scores
   - Risk assessment
   - Open questions for vendor

   **Action Items**:
   - BLOCKING issues (must fix before approval)
   - Non-blocking improvements (should fix before implementation)
   - Nice-to-have enhancements

   **Approval Conditions** (if APPROVED WITH CONDITIONS):
   - List specific items vendor must address
   - Timeline for remediation
   - Re-review requirements

7. **Write outputs**:
   - `projects/{project-dir}/vendors/{vendor}/hld-review.md` - Full review report
   - `projects/{project-dir}/hld-review-summary.md` - Summary if comparing multiple vendors
   - Update traceability matrix with design references

   **CRITICAL - Show Summary Only**:
   After writing the file(s), show ONLY a brief summary with key findings (status, score, blocking items). Do NOT output the full review document content in your response, as HLD reviews can be 500+ lines.

## Example Usage

User: `/arckit.hld-review Review Acme Payment Solutions HLD for payment gateway project`

You should:
- Read architecture principles
- Read requirements for payment gateway project (001)
- Ask for HLD document location
- Review against all principles:
  - ✅ Cloud-First: Using AWS cloud-native services
  - ✅ API-First: RESTful API with OpenAPI spec
  - ❌ Microservices: Single monolithic service (VIOLATION - should be microservices)
  - ✅ Security: PCI-DSS compliant architecture with token vault
- Check requirements coverage:
  - ✅ NFR-P-001 (Response time): CDN + Redis caching supports <2s
  - ✅ NFR-S-001 (PCI-DSS): Compliant architecture
  - ⚠️  NFR-R-001 (99.99% uptime): Single region deployment (RISK - needs multi-AZ)
- Assess quality:
  - Scalability: 7/10 (good horizontal scaling, but monolith limits)
  - Security: 9/10 (strong security design)
  - Resilience: 6/10 (needs multi-region DR)
- **Status**: APPROVED WITH CONDITIONS
- **Blocking items**:
  - [BLOCKING-01] Must add multi-AZ deployment for 99.99% uptime
  - [BLOCKING-02] Consider microservices migration path to avoid future tech debt
- Write to `projects/001-payment-gateway/vendors/acme-payment-solutions/hld-review.md`

## Important Notes

- HLD review is a GATE - implementation cannot start until approved
- Be thorough but constructive (help vendor improve, don't just criticize)
- All findings must reference specific principles or requirements
- Security and compliance violations are typically BLOCKING
- Performance and scalability concerns should be addressed early
- Document any assumptions or questions for vendor
- HLD approval is NOT final sign-off (DLD review comes next)
- Keep a paper trail for audit purposes
