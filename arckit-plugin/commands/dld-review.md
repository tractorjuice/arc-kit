---
description: Review Detailed Design (DLD) for implementation readiness
---

You are helping an enterprise architect review a Detailed Design (DLD) document to ensure the design is ready for implementation with all technical details properly specified.

## User Input

```text
$ARGUMENTS
```

## Instructions

> **Note**: The ArcKit Project Context hook has already detected all projects, artifacts, external documents, and global policies. Use that context below — no need to scan directories manually.

1. **Identify the context**: The user should specify:
   - Project name/number
   - Vendor name (if applicable)
   - Location of DLD document

2. **Read existing artifacts** from the project context:

   **MANDATORY** (warn if missing):
   - **HLDR** (HLD Review) — Extract: HLD review findings, conditions, outstanding actions
     - If missing: warn that DLD review should follow HLD review
   - **PRIN** (Architecture Principles, in 000-global) — Extract: all principles with validation gates
     - If missing: warn user to run `/arckit:principles` first
   - **REQ** (Requirements) — Extract: NFR/INT/DR requirements for detailed technical verification
     - If missing: warn user to run `/arckit:requirements` first

   **RECOMMENDED** (read if available, note if missing):
   - **DATA** (Data Model) — Extract: entity schemas, data types, relationships for data model review
   - **RISK** (Risk Register) — Extract: technical risks that DLD should address

   **OPTIONAL** (read if available, skip silently):
   - **SECD** (Secure by Design) — Extract: security controls for security implementation review

   **Read the template** (with user override support):
   - **First**, check if `.arckit/templates/dld-review-template.md` exists in the project root
   - **If found**: Read the user's customized template (user override takes precedence)
   - **If not found**: Read `${CLAUDE_PLUGIN_ROOT}/templates/dld-review-template.md` (default)

   > **Note**: Read the `${CLAUDE_PLUGIN_ROOT}/VERSION` file and update the version in the template metadata line when generating.
   > **Tip**: Users can customize templates with `/arckit:customize dld-review`

3. **Verify HLD approval**:
   - Check that HLD was approved (DLD cannot proceed without HLD approval)
   - Verify all HLD conditions were addressed
   - Confirm no new architectural changes were introduced (if yes, needs HLD re-review)

4. **Read external documents and policies**:
   - Read any **vendor DLD submissions** in `projects/{project-dir}/vendors/{vendor}/` — extract detailed component specifications, API contracts, database schemas, deployment configurations, security implementation details
   - Read any **external documents** listed in the project context (`external/` files) — extract performance test results, security scan reports, infrastructure specifications
   - Read any **enterprise standards** in `projects/000-global/external/` — extract enterprise design standards, implementation guidelines, cross-project technical architecture patterns
   - If no vendor DLD found, ask: "Please provide the DLD document path or paste key sections. I can read PDFs, Word docs, and images directly. Place them in `projects/{project-dir}/vendors/{vendor}/` and re-run, or provide the path."

5. **Obtain the DLD document**:
   - Ask: "Please provide the DLD document path or paste key sections"
   - Or: "Is the DLD in `projects/{project-dir}/vendors/{vendor}/dld-v*.md`?"
   - Or: "Please share detailed design diagrams, sequence diagrams, ERDs"

6. **Perform detailed technical review**:

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

7. **Implementation Readiness Check**:

   Ask these critical questions:
   - ✅ Can developers start coding immediately with this DLD?
   - ✅ Are all technical ambiguities resolved?
   - ✅ Are all third-party dependencies identified?
   - ✅ Is the test strategy comprehensive?
   - ✅ Are deployment procedures clear?

8. **Generate Review Report**:

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


---

**CRITICAL - Auto-Populate Document Control Fields**:

Before completing the document, populate ALL document control fields in the header:

**Construct Document ID**:
- **Document ID**: `ARC-{PROJECT_ID}-DLDR-v{VERSION}` (e.g., `ARC-001-DLDR-v1.0`)

**Populate Required Fields**:

*Auto-populated fields* (populate these automatically):
- `[PROJECT_ID]` → Extract from project path (e.g., "001" from "projects/001-project-name")
- `[VERSION]` → "1.0" (or increment if previous version exists)
- `[DATE]` / `[YYYY-MM-DD]` → Current date in YYYY-MM-DD format
- `[DOCUMENT_TYPE_NAME]` → "Detailed Design Review"
- `ARC-[PROJECT_ID]-DLDR-v[VERSION]` → Construct using format above
- `[COMMAND]` → "arckit.dld-review"

*User-provided fields* (extract from project metadata or user input):
- `[PROJECT_NAME]` → Full project name from project metadata or user input
- `[OWNER_NAME_AND_ROLE]` → Document owner (prompt user if not in metadata)
- `[CLASSIFICATION]` → Default to "OFFICIAL" for UK Gov, "PUBLIC" otherwise (or prompt user)

*Calculated fields*:
- `[YYYY-MM-DD]` for Review Date → Current date + 30 days

*Pending fields* (leave as [PENDING] until manually updated):
- `[REVIEWER_NAME]` → [PENDING]
- `[APPROVER_NAME]` → [PENDING]
- `[DISTRIBUTION_LIST]` → Default to "Project Team, Architecture Team" or [PENDING]

**Populate Revision History**:

```markdown
| 1.0 | {DATE} | ArcKit AI | Initial creation from `/arckit:dld-review` command | [PENDING] | [PENDING] |
```

**Populate Generation Metadata Footer**:

The footer should be populated with:
```markdown
**Generated by**: ArcKit `/arckit:dld-review` command
**Generated on**: {DATE} {TIME} GMT
**ArcKit Version**: [Read from ${CLAUDE_PLUGIN_ROOT}/VERSION]
**Project**: {PROJECT_NAME} (Project {PROJECT_ID})
**AI Model**: [Use actual model name, e.g., "claude-sonnet-4-5-20250929"]
**Generation Context**: [Brief note about source documents used]
```

---

9. **Write outputs**:
   - `projects/{project-dir}/vendors/{vendor}/ARC-{PROJECT_ID}-DLDR-v1.0.md` - Full review report
   - Update traceability matrix with implementation details
   - Create implementation checklist if approved

   **CRITICAL - Show Summary Only**:
   After writing the file(s), show ONLY a brief summary with key findings (status, score, blocking items). Do NOT output the full review document content in your response, as DLD reviews can be 700+ lines.

## Example Usage

User: `/arckit:dld-review Review Acme Payment Solutions DLD for payment gateway`

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
- Write to `projects/001-payment-gateway/vendors/acme-payment-solutions/reviews/ARC-001-DLD-v1.0.md`

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
