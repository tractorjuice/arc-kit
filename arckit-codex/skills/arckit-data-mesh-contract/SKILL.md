---
name: arckit-data-mesh-contract
description: "Create federated data product contracts for mesh architectures with SLAs, governance, and interoperability guarantees (project)"
---

You are helping an enterprise architect **create a data mesh contract** for a data product in a federated mesh architecture.

This command generates a **data-mesh-contract** document that defines the formal agreement between a data product provider (domain team) and consumers, following the **Open Data Contract Standard (ODCS) v3.0.2**.

## User Input

```text
$ARGUMENTS
```

## Instructions

> **Note**: Before generating, scan `projects/` for existing project directories. For each project, list all `ARC-*.md` artifacts, check `external/` for reference documents, and check `000-global/` for cross-project policies. If no external docs exist but they would improve output, ask the user.

### Step 0: Check Prerequisites

**IMPORTANT**: Before generating a data mesh contract, verify that foundational artifacts exist:

1. **Architecture Principles** (REQUIRED):
   - Check if `projects/000-global/ARC-000-PRIN-*.md` exists
   - If it does NOT exist:

     ```text
     ❌ Architecture principles not found.

     Data mesh contracts require architecture principles to be established first.
     Principles should include mesh governance standards (federated ownership, data as a product, self-serve infrastructure).

     Please run: $arckit-principles Create enterprise architecture principles

     Then return here to generate the data mesh contract.
     ```

   - If it exists, proceed to Step 1

2. **Data Model** (HIGHLY RECOMMENDED):
   - Check if the project has a `ARC-*-DATA-*.md` file
   - If it does NOT exist:

     ```text
     ⚠️  Warning: No data model found for this project.

     Data mesh contracts are typically derived from existing data models (entities become data products).

     Consider running: $arckit-data-model Create data model for [project name]

     You can proceed without a data model, but you'll need to define schema from scratch.

     Continue anyway? (yes/no)
     ```

   - If user says "no", stop here and tell them to run `$arckit-data-model` first
   - If user says "yes" or if ARC-*-DATA-*.md exists, proceed to Step 1

3. **Stakeholder Analysis** (RECOMMENDED):
   - Check if the project has `ARC-*-STKE-*.md`
   - If it does NOT exist:

     ```text
     ⚠️  Warning: No stakeholder analysis found.

     Stakeholder analysis helps identify:
     - Domain owners (who owns this data product)
     - Consumers (who will use this data product)
     - Data stewards and governance stakeholders

     Consider running: $arckit-stakeholders Analyze stakeholders for [project name]

     You can proceed without stakeholder analysis, but ownership roles will be generic placeholders.

     Continue anyway? (yes/no)
     ```

   - If user says "no", stop here
   - If user says "yes" or if ARC-*-STKE-*.md exists, proceed to Step 1

**Gathering rules** (apply to all user questions in this command):

- Ask the most important question first; fill in secondary details from context or reasonable defaults.
- **Maximum 2 rounds of questions total.** After that, infer the best answer from available context.
- If still ambiguous after 2 rounds, make a reasonable choice and note: *"I went with [X] — easy to adjust if you prefer [Y]."*

### Step 1: Parse User Input

Extract the **data product name** from the user's message. Examples:

- "Create contract for customer payments"
- "Generate mesh contract for seller analytics data product"
- "customer-orders contract"

The data product name should be:

- Kebab-case: `customer-payments`, `seller-analytics`
- Descriptive of the business domain

If the user didn't provide a clear data product name, ask:

```text
What is the name of the data product for this contract?

Examples:
- customer-payments
- seller-analytics
- order-events
- fraud-detection-features

Data product name (kebab-case):
```

### Step 2: Identify the target project

- Use the **ArcKit Project Context** (above) to find the project matching the user's input (by name or number)
- If no match, create a new project:
  1. Use Glob to list `projects/*/` directories and find the highest `NNN-*` number (or start at `001` if none exist)
  2. Calculate the next number (zero-padded to 3 digits, e.g., `002`)
  3. Slugify the project name (lowercase, replace non-alphanumeric with hyphens, trim)
  4. Use the Write tool to create `projects/{NNN}-{slug}/README.md` with the project name, ID, and date — the Write tool will create all parent directories automatically
  5. Also create `projects/{NNN}-{slug}/external/README.md` with a note to place external reference documents here
  6. Set `PROJECT_ID` = the 3-digit number, `PROJECT_PATH` = the new directory path

**Important**: If the script creates a NEW project, inform the user:

```text
Created new project: Project {project_id} - {project_name}
   Location: {project_path}

Note: This is a new project. You may want to run these commands first:
- $arckit-stakeholders - Identify domain owners and consumers
- $arckit-data-model - Define entities that become data products
- $arckit-requirements - Capture DR-xxx data requirements
```

If the project ALREADY EXISTS, just acknowledge it:

```text
Using existing project: Project {project_id} - {project_name}
   Location: {project_path}
```

### Step 3: Create Contract Directory

Data mesh contracts should be organized in a subdirectory. The directory will be created automatically when saving the file with the Write tool.

The contract file will use the multi-instance naming pattern:

```text
{project_path}/data-contracts/ARC-{PROJECT_ID}-DMC-{NNN}-v1.0.md
```

Where `{NNN}` is the next sequential number for contracts in this project. Check existing files in `data-contracts/` and use the next number (001, 002, ...).

### Step 4: Read the Template

Read the data mesh contract template:

**Read the template** (with user override support):

- **First**, check if `.arckit/templates/data-mesh-contract-template.md` exists in the project root
- **If found**: Read the user's customized template (user override takes precedence)
- **If not found**: Read `.arckit/templates/data-mesh-contract-template.md` (default)

> **Tip**: Users can customize templates with `$arckit-customize data-mesh-contract`

### Step 4b: Read external documents and policies

- Read any **external documents** listed in the project context (`external/` files) — extract existing data product definitions, SLA terms, schema specifications, data quality rules
- Read any **enterprise standards** in `projects/000-global/external/` — extract enterprise data governance standards, data sharing agreements, cross-project data catalogue conventions
- If no external docs exist but they would improve the output, ask: "Do you have any existing data contracts, data product SLAs, or schema specifications? I can read PDFs, YAML, and JSON files directly. Place them in `projects/{project-dir}/external/` and re-run, or skip."
- **Citation traceability**: When referencing content from external documents, follow the citation instructions in `.arckit/references/citation-instructions.md`. Place inline citation markers (e.g., `[PP-C1]`) next to findings informed by source documents and populate the "External References" section in the template.

### Step 5: Gather Context from Existing Artifacts

**IF `ARC-*-DATA-*.md` exists in the project**:

- Read `{project_path}/ARC-*-DATA-*.md`
- Extract:
  - Entity definitions (these become Objects in the contract)
  - Attributes (these become Properties)
  - PII markings
  - Data classifications
  - Relationships

**IF `ARC-*-REQ-*.md` exists**:

- Read `{project_path}/ARC-*-REQ-*.md`
- Extract:
  - DR-xxx data requirements (these inform schema and quality rules)
  - NFR-P-xxx performance requirements (these become SLA targets)
  - NFR-A-xxx availability requirements (these become SLA uptime targets)
  - INT-xxx integration requirements (these become access methods)

**IF `ARC-*-STKE-*.md` exists**:

- Read `{project_path}/ARC-*-STKE-*.md`
- Extract:
  - Stakeholder names and roles (these become ownership roles: Product Owner, Data Steward)
  - Consumer stakeholders (these inform consumer obligations)

**IF `projects/000-global/ARC-000-PRIN-*.md` exists**:

- Read it to understand mesh governance standards
- Look for principles about:
  - Federated ownership
  - Data as a product
  - Self-serve infrastructure
  - Computational governance
  - UK Government compliance (TCoP, GDPR)

### Step 6: Generate the Data Mesh Contract

Using the template and context gathered, generate a comprehensive data mesh contract.

**Key Sections to Populate**:

1. **Document Information**:
   - Document ID: `ARC-{project_id}-DMC-{NNN}-v1.0` (multi-instance type, uses sequential numbering)
   - Project: `{project_name}` (Project {project_id})
   - Classification: Determine based on PII content (OFFICIAL-SENSITIVE if PII, OFFICIAL otherwise)
   - Version: Start at `1.0`
   - Status: DRAFT (for new contracts)
   - Date: Today's date (YYYY-MM-DD)
   - Owner: If stakeholder analysis exists, use Product Owner; otherwise use placeholder

2. **Fundamentals (Section 1)**:
   - Contract ID: Generate a UUID
   - Contract Name: `{data-product-name}`
   - Semantic Version: Start at `1.0.0`
   - Status: ACTIVE (for published) or DRAFT (for new)
   - Domain: Extract from project name or ask user (e.g., "customer", "seller", "finance")
   - Data Product: The data product name
   - Tenant: Organization name (if known from stakeholders, otherwise placeholder)
   - Purpose: Describe what this data product provides
   - Ownership: Map from ARC-*-STKE-*.md if available

3. **Schema (Section 2)**:
   - **If ARC-*-DATA-*.md exists**: Map entities → objects, attributes → properties
   - **If ARC-*-DATA-*.md does NOT exist**: Create schema from scratch based on user description
   - For each object:
     - Object name (e.g., CUSTOMER, TRANSACTION)
     - Source entity reference (if from ARC-*-DATA-*.md)
     - Object type (TABLE, DOCUMENT, FILE, STREAM)
     - Properties table with: name, type, required, PII, description, business rules
     - Primary keys, foreign keys, indexes
   - Schema versioning strategy: Semantic versioning
   - Breaking change policy: 90-day deprecation notice

4. **Data Quality (Section 3)**:
   - Quality dimensions: Accuracy, Validity, Completeness, Consistency, Timeliness, Uniqueness
   - **If ARC-*-REQ-*.md exists**: Map DR-xxx requirements to quality rules
   - Automated quality rules in ODCS format:
     - null_check for required fields
     - uniqueness for primary keys
     - referential_integrity for foreign keys
     - regex for format validation (email, phone)
     - range for numeric constraints
   - Monitoring dashboard (placeholder URL)
   - Alert thresholds

5. **Service-Level Agreement (Section 4)**:
   - **If ARC-*-REQ-*.md has NFR-A-xxx**: Use those as uptime targets (default: 99.9%)
   - **If ARC-*-REQ-*.md has NFR-P-xxx**: Use those as response time targets (default: <200ms p95)
   - Freshness targets: <5 minutes for real-time, <1 hour for near-real-time, daily for batch
   - Data retention: Map from ARC-*-DATA-*.md if available, otherwise use defaults (7 years for transactional, 90 days for logs)
   - Support SLA: Critical <30min, High <4 hours, Normal <1 day

6. **Access Methods (Section 5)**:
   - **If ARC-*-REQ-*.md has INT-xxx**: Use those to define access patterns
   - Default access methods:
     - REST API (for queries)
     - SQL Query (for analytics)
     - Data Lake (for batch processing)
   - API specifications: endpoints, authentication (OAuth 2.0 / API Key), rate limits
   - Consumer onboarding process

7. **Security and Privacy (Section 6)**:
   - Data classification: Based on PII content
   - Encryption: AES-256 at rest, TLS 1.3 in transit
   - Access controls: RBAC with roles (Consumer-Read, Analyst-FullRead, Admin)
   - **GDPR/UK GDPR Compliance**:
     - PII inventory from ARC-*-DATA-*.md or schema
     - Legal basis: CONTRACT / LEGITIMATE_INTEREST / CONSENT
     - Data subject rights: API endpoint for access/rectification/erasure
     - Cross-border transfers: Default to UK (London region)
     - DPIA status: REQUIRED if PII exists, NOT_REQUIRED otherwise
   - Audit logging: All API access, schema changes, PII access

8. **Governance and Change Management (Section 7)**:
   - Change request process: Minor (7 days notice), Major (90 days notice)
   - Contract review cycle: Quarterly
   - Deprecation policy: 90-day notice + migration support

9. **Consumer Obligations (Section 8)**:
   - Attribution requirements
   - Usage constraints (no redistribution, no reverse engineering)
   - Data quality feedback
   - Compliance with own GDPR obligations
   - Security (protect credentials, rotate keys)

10. **Pricing (Section 9)**:
    - Default: FREE tier for internal consumers
    - Optional: Cost recovery model (per request, per GB)
    - If external consumers: Consider commercial pricing

11. **Infrastructure (Section 10)**:
    - Cloud provider: AWS (default for UK Gov) / Azure / GCP
    - Region: UK (London) - eu-west-2
    - High availability: Multi-AZ
    - DR: RTO 4 hours, RPO 15 minutes
    - Infrastructure components: API Gateway, Compute (Lambda/ECS), Database (RDS), Cache (Redis), Storage (S3)

12. **Observability (Section 11)**:
    - Key metrics: request rate, error rate, latency, freshness, quality, cost
    - Alerts: Error rate >1%, Latency >500ms, Freshness >5min
    - Logging: 30 days hot, 1 year cold

13. **Testing (Section 12)**:
    - Test environments: Dev, Staging, Production
    - Sample test cases for consumers
    - CI/CD integration

14. **Limitations (Section 13)**:
    - Document any known limitations
    - Known issues table

15. **Roadmap (Section 14)**:
    - Upcoming features (next 6 months)
    - Long-term vision

16. **Related Contracts (Section 15)**:
    - **If INT-xxx requirements exist**: List upstream dependencies
    - List known downstream consumers (from stakeholders if available)

17. **Appendices (Section 16)**:
    - ODCS YAML export
    - Changelog (version history)
    - Glossary
    - Contact information

### Step 7: Construct Document ID

- **Document ID**: `ARC-{PROJECT_ID}-DMC-{NNN}-v{VERSION}` (e.g., `ARC-001-DMC-001-v1.0`)
- Sequence number `{NNN}`: Check existing files in `data-contracts/` and use the next number (001, 002, ...)

---

**CRITICAL - Auto-Populate Document Control Fields**:

Before completing the document, populate ALL document control fields in the header:

**Construct Document ID**:

- **Document ID**: `ARC-{PROJECT_ID}-DMC-{NNN}-v{VERSION}` (e.g., `ARC-001-DMC-001-v1.0`)

**Populate Required Fields**:

*Auto-populated fields* (populate these automatically):

- `[PROJECT_ID]` → Extract from project path (e.g., "001" from "projects/001-project-name")
- `[VERSION]` → "1.0" (or increment if previous version exists)
- `[DATE]` / `[YYYY-MM-DD]` → Current date in YYYY-MM-DD format
- `[DOCUMENT_TYPE_NAME]` → "Data Mesh Contract"
- `ARC-[PROJECT_ID]-DMC-v[VERSION]` → Construct using format above
- `[COMMAND]` → "arckit.data-mesh-contract"

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
| 1.0 | {DATE} | ArcKit AI | Initial creation from `$arckit-data-mesh-contract` command | [PENDING] | [PENDING] |
```

**Populate Generation Metadata Footer**:

The footer should be populated with:

```markdown
**Generated by**: ArcKit `$arckit-data-mesh-contract` command
**Generated on**: {DATE} {TIME} GMT
**ArcKit Version**: {ARCKIT_VERSION}
**Project**: {PROJECT_NAME} (Project {PROJECT_ID})
**AI Model**: [Use actual model name, e.g., "claude-sonnet-4-5-20250929"]
**Generation Context**: [Brief note about source documents used]
```

---

Before writing the file, read `.arckit/references/quality-checklist.md` and verify all **Common Checks** plus the **DMC** per-type checks pass. Fix any failures before proceeding.

### Step 8: Write the Contract File

**IMPORTANT**: Use the **Write tool** to create the file. Do NOT output the full document content to the user (it will be 2000-4000 lines and exceed token limits).

```text
Write tool:
  file_path: {project_path}/data-contracts/ARC-{PROJECT_ID}-DMC-{NNN}-v1.0.md
  content: {full contract content}
```

Note: Use the constructed document ID format for the filename.

### Step 9: Show Summary to User

After writing the file, show the user a concise summary (do NOT show the full document):

```text
✅ Data Mesh Contract Generated

**Contract**: ARC-{PROJECT_ID}-DMC-{NNN}-v1.0.md
**Location**: {project_path}/data-contracts/
**Document ID**: ARC-{project_id}-DMC-{NNN}-v1.0
**ODCS Version**: v3.0.2
**Contract Version**: 1.0.0
**Status**: DRAFT

---

## Contract Summary

**Data Product**: {data_product_name}
**Domain**: {domain_name}
**Purpose**: {brief_purpose}

### Schema
- **Objects**: {N} objects defined
- **Properties**: {M} total properties
- **PII Fields**: {P} fields contain PII

### SLA Commitments
- **Availability**: {99.9%} uptime
- **Response Time (p95)**: {<200ms}
- **Freshness**: {<5 minutes}
- **Data Retention**: {7 years}

### Quality Rules
- {N} automated quality rules defined
- Quality dimensions: Accuracy, Validity, Completeness, Consistency, Timeliness, Uniqueness

### Access Methods
- REST API: {endpoint}
- SQL Query: {database.schema.table}
- Data Lake: {s3://bucket/prefix}

### Security
- Classification: {OFFICIAL-SENSITIVE} (contains PII)
- Encryption: AES-256 at rest, TLS 1.3 in transit
- Access Control: RBAC (Consumer-Read, Analyst-FullRead, Admin)
- GDPR Compliant: ✅

### Governance
- Change Process: Minor (7 days notice), Major (90 days notice)
- Review Cycle: Quarterly
- Deprecation Policy: 90-day notice + migration support

---

## Next Steps

1. **Review Contract**: Open the file and customize placeholders ({...})
2. **Domain Team Review**: Product Owner should review all sections
3. **DPO Review** (if PII): Ensure GDPR compliance is accurate
4. **Security Review**: Validate encryption and access controls
5. **Publish to Catalogue**: Register contract in data catalogue for discovery
6. **Consumer Onboarding**: Set up sandbox environment for consumers to test

## Related Commands

- `$arckit-traceability` - Link this contract to requirements and consumers
- `$arckit-analyze` - Score contract completeness and governance quality
- `$arckit-dpia` - Generate Data Protection Impact Assessment (if PII present)

---

**Full contract**: `{project_path}/data-contracts/ARC-{PROJECT_ID}-DMC-{NNN}-v1.0.md` ({line_count} lines)
```

### Step 10: Post-Generation Recommendations

Based on what artifacts exist, recommend next steps:

**If no ARC-*-REQ-*.md**:

```text
💡 Tip: Run $arckit-requirements to capture DR-xxx data requirements.
   These will inform SLA targets and quality rules in future contract updates.
```

**If no ARC-*-STKE-*.md**:

```text
💡 Tip: Run $arckit-stakeholders to identify domain owners and consumers.
   This will help assign real names to ownership roles instead of placeholders.
```

**If PII exists but no ARC-*-DPIA-*.md**:

```text
⚠️  This contract contains PII ({N} fields marked as PII).

UK GDPR Article 35 may require a Data Protection Impact Assessment (DPIA).

Consider running: $arckit-dpia Generate DPIA for {project_name}
```

**If this is a UK Government project**:

```text
💡 UK Government Alignment:
   - Technology Code of Practice: Point 8 (Share, reuse and collaborate) ✅
   - National Data Strategy: Pillar 1 (Unlocking value) ✅
   - Data Quality Framework: 5 dimensions covered ✅

Consider running:
   - $arckit-tcop - Technology Code of Practice assessment
   - $arckit-service-assessment - GDS Service Standard (if digital service)
```

## Important Notes

1. **Token Limit Handling**: ALWAYS use the Write tool for the full document. NEVER output the complete contract to the user (it's 2000-4000 lines). Only show the summary.

2. **ODCS Compliance**: This contract follows Open Data Contract Standard (ODCS) v3.0.2. The Appendix A contains a YAML export that can be consumed programmatically.

3. **UK Government Context**: If this is a UK Government project, ensure:
   - Data stored in UK (London region)
   - UK GDPR compliance
   - Technology Code of Practice alignment
   - National Data Strategy alignment
   - Data Quality Framework coverage

4. **Traceability**: The contract links to:
   - Source data model (entities → objects)
   - Requirements (DR-xxx → quality rules, NFR-xxx → SLAs)
   - Stakeholders (→ ownership roles)
   - Architecture principles (→ governance standards)

5. **Versioning**: Use semantic versioning (MAJOR.MINOR.PATCH):
   - MAJOR: Breaking changes (remove field, change type)
   - MINOR: Backward-compatible additions (new field, new object)
   - PATCH: Bug fixes (data quality fixes, documentation)

6. **Federated Ownership**: The domain team owns this contract end-to-end. They are responsible for:
   - SLA adherence
   - Quality monitoring
   - Consumer support
   - Schema evolution
   - Change management

7. **One Contract Per Product**: Don't bundle unrelated datasets. Each domain data product should have its own contract.

8. **Automation is Critical**: The contract is meaningless without observability and automated policy enforcement. Ensure:
   - Quality rules are executable by data quality engines
   - SLA metrics are monitored in real-time
   - Access controls are enforced via API gateway
   - Audit logs are captured automatically

- **Markdown escaping**: When writing less-than or greater-than comparisons, always include a space after `<` or `>` (e.g., `< 3 seconds`, `> 99.9% uptime`) to prevent markdown renderers from interpreting them as HTML tags or emoji

## Example User Interactions

**Example 1: Simple contract creation**

```text
User: $arckit-data-mesh-contract Create contract for customer payments
Assistant:
  - Checks prerequisites ✅
  - Creates project 001-customer-payments
  - Finds ARC-*-DATA-*.md with CUSTOMER and TRANSACTION entities
  - Generates contract mapping entities → objects
  - Shows summary (not full document)
```

**Example 2: Contract without data model**

```text
User: $arckit-data-mesh-contract seller-analytics contract
Assistant:
  - Checks prerequisites ✅
  - Warns: No data model found
  - User confirms to proceed
  - Generates contract with generic schema placeholders
  - Recommends running $arckit-data-model first
```

**Example 3: Contract with full context**

```text
User: $arckit-data-mesh-contract fraud-detection-features
Assistant:
  - Checks prerequisites ✅
  - Finds ARC-*-DATA-*.md, ARC-*-REQ-*.md, ARC-*-STKE-*.md
  - Maps entities → objects
  - Maps DR-xxx → quality rules
  - Maps NFR-P-xxx → SLA response time targets
  - Maps stakeholders → ownership roles
  - Generates comprehensive contract with minimal placeholders
  - Shows summary
```

## Error Handling

**If architecture principles don't exist**:

- Stop and tell user to run `$arckit-principles` first
- Do NOT proceed without principles

**If user provides unclear data product name**:

- Ask for clarification: "What is the name of the data product?"
- Suggest examples: customer-payments, seller-analytics, order-events

**If project creation fails**:

- Show error message from create-project.sh
- Ask user to check permissions or directory structure

**If template file is missing**:

- Error: "Template not found: .arckit/templates/data-mesh-contract-template.md"
- Ask user to check ArcKit installation

**If file write fails**:

- Show error message
- Check if directory exists
- Check permissions
