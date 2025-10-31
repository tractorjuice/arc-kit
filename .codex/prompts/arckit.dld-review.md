---
description: Review Detailed Design (DLD) for implementation readiness
---

You are helping an enterprise architect review a Detailed Design (DLD) document to ensure the design is ready for implementation with all technical details properly specified.

## User Input

```text
$ARGUMENTS
```

## Instructions

1. **Identify the context**: The user should specify:
   - Project name/number
   - Vendor name (if applicable)
   - Location of DLD document

2. **Read the review context**:
   - Read `projects/{project-dir}/vendors/{vendor}/hld-review.md` - Ensure HLD issues were addressed
   - Read `.arckit/memory/architecture-principles.md` - Governance rules still apply
   - Read `projects/{project-dir}/requirements.md` - Technical requirements
   - Read `.arckit/templates/dld-review-template.md` - Review checklist

3. **Verify HLD approval**:
   - Check that HLD was approved (DLD cannot proceed without HLD approval)
   - Verify all HLD conditions were addressed
   - Confirm no new architectural changes were introduced (if yes, needs HLD re-review)

4. **Obtain the DLD document**:
   - Ask: "Please provide the DLD document path or paste key sections"
   - Or: "Is the DLD in `projects/{project-dir}/vendors/{vendor}/dld.md`?"
   - Or: "Please share detailed design diagrams, sequence diagrams, ERDs"

5. **Perform detailed technical review**:

   ### A. Component Design Review

   For each component/service:
   - **Interface definition**: APIs, events, messages clearly defined?
   - **Data structures**: Request/response schemas, DTOs documented?
   - **Business logic**: Core algorithms and workflows specified?
   - **Error handling**: Exception handling strategy defined?
   - **Dependencies**: External services, libraries, frameworks listed?

   ### B. API Design Review

   - **API specifications**: OpenAPI/Swagger docs provided?
   - **Endpoint design**: RESTful conventions followed? Proper HTTP methods?
   - **Request validation**: Input validation rules specified?
   - **Response formats**: JSON schemas defined? Error responses documented?
   - **Authentication**: Auth flows detailed? Token formats specified?
   - **Rate limiting**: Throttling strategy defined?
   - **Versioning**: API versioning strategy clear?

   ### C. Data Model Review

   - **Database schema**: ERD provided? Tables, columns, types defined?
   - **Relationships**: Foreign keys, indexes, constraints documented?
   - **Data types**: Appropriate types for each field?
   - **Normalization**: Proper normalization (or justified denormalization)?
   - **Migrations**: Schema migration strategy defined?
   - **Partitioning**: Sharding or partitioning strategy if needed?
   - **Archival**: Data retention and archival approach?

   ### D. Security Implementation Review

   - **Authentication implementation**: OAuth flows, JWT structure, session management?
   - **Authorization implementation**: RBAC/ABAC model, permission matrix?
   - **Encryption details**: Algorithms (AES-256, RSA), key management (KMS)?
   - **Secrets management**: How are secrets stored? (AWS Secrets Manager, Vault)
   - **Input sanitization**: XSS prevention, SQL injection prevention?
   - **Audit logging**: What gets logged? Log retention policy?
   - **Compliance mapping**: How does each control map to compliance requirements?

   ### E. Integration Design Review

   - **Integration patterns**: Sync/async? REST/gRPC/message queue?
   - **Error handling**: Retry logic, circuit breakers, timeouts?
   - **Data transformation**: Mapping between systems defined?
   - **API contracts**: Contract testing approach?
   - **Service discovery**: How services find each other?
   - **Message formats**: Event schemas, message structures?

   ### F. Performance Design Review

   - **Caching strategy**: What gets cached? TTL? Invalidation strategy?
   - **Database optimisation**: Indexes defined? Query optimisation?
   - **Connection pooling**: Pool sizes, timeout configs?
   - **Async processing**: Background jobs, queue workers?
   - **Batch processing**: Batch sizes, scheduling?
   - **Load testing plan**: Performance test scenarios defined?

   ### G. Operational Design Review

   - **Monitoring**: Metrics to track? Dashboards defined? Alert thresholds?
   - **Logging**: Log levels, structured logging, log aggregation?
   - **Tracing**: Distributed tracing implementation (Jaeger, X-Ray)?
   - **Health checks**: Liveness/readiness probes defined?
   - **Configuration**: Config management approach (ConfigMaps, Parameter Store)?
   - **Deployment**: CI/CD pipeline defined? Deployment strategy (blue-green, canary)?

   ### H. Testing Strategy Review

   - **Unit testing**: Coverage targets? Testing frameworks?
   - **Integration testing**: Test scenarios defined?
   - **Contract testing**: API contract tests specified?
   - **Performance testing**: Load/stress test plans?
   - **Security testing**: SAST/DAST tools? Penetration testing plan?
   - **UAT approach**: User acceptance test criteria?

6. **Implementation Readiness Check**:

   Ask these critical questions:
   - ✅ Can developers start coding immediately with this DLD?
   - ✅ Are all technical ambiguities resolved?
   - ✅ Are all third-party dependencies identified?
   - ✅ Is the test strategy comprehensive?
   - ✅ Are deployment procedures clear?

7. **Generate Review Report**:

   **Executive Summary**:
   - Status: APPROVED / APPROVED WITH CONDITIONS / REJECTED / NEEDS HLD RE-REVIEW
   - Implementation readiness score (0-100)
   - Top risks or gaps

   **Detailed Findings**:
   - Component design assessment
   - API design review
   - Data model evaluation
   - Security implementation review
   - Integration review
   - Performance considerations
   - Operational readiness
   - Testing strategy assessment

   **Action Items**:
   - BLOCKING issues (must fix before implementation)
   - Non-blocking improvements (fix during implementation)
   - Technical debt to track

   **Implementation Guidance**:
   - Development sequence recommendations
   - Critical path items
   - Risk mitigation during implementation

8. **Write outputs**:
   - `projects/{project-dir}/vendors/{vendor}/dld-review.md` - Full review report
   - Update traceability matrix with implementation details
   - Create implementation checklist if approved

## Example Usage

User: `/arckit.dld-review Review Acme Payment Solutions DLD for payment gateway`

You should:
- Check HLD was approved and conditions met
- Ask for DLD document
- Review component design:
  - ✅ Payment Service: Well-defined API, clear business logic
  - ❌ Fraud Service: Missing ML model specification (BLOCKING)
  - ✅ Notification Service: Complete event-driven design
- Review API design:
  - ✅ OpenAPI 3.0 spec provided
  - ✅ Proper REST conventions
  - ⚠️  Missing rate limiting implementation details
- Review data model:
  - ✅ Complete ERD with all relationships
  - ✅ Indexes on high-traffic queries
  - ❌ Missing data retention/archival strategy (BLOCKING)
- Review security:
  - ✅ OAuth 2.0 + JWT implementation detailed
  - ✅ AES-256 encryption with AWS KMS
  - ✅ PCI-DSS controls mapped to code
- Review testing:
  - ✅ 80% unit test coverage target
  - ✅ Integration test scenarios defined
  - ⚠️  Performance test plan incomplete
- **Status**: APPROVED WITH CONDITIONS
- **Blocking items**:
  - [BLOCKING-01] Specify fraud detection ML model (algorithm, features, thresholds)
  - [BLOCKING-02] Define data retention policy (7 years for PCI compliance)
- Write to `projects/001-payment-gateway/vendors/acme-payment-solutions/dld-review.md`

## Important Notes

- DLD review is the FINAL gate before implementation
- HLD must be approved before DLD review starts
- Any architectural changes require HLD re-review
- DLD must be detailed enough for ANY developer to implement
- All technical decisions must be documented and justified
- Security and compliance details are critical
- Test strategy must be comprehensive
- DLD approval means "ready to code" - no ambiguity allowed
- This is the last chance to catch design issues before expensive code changes
