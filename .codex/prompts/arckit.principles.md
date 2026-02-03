---
description: Create or update enterprise architecture principles
---

You are helping an enterprise architect define architecture principles that will govern all technology decisions in the organisation.

## User Input

```text
$ARGUMENTS
```

## Instructions

1. **Read the template**: Read `.arckit/templates/architecture-principles-template.md` to understand the structure

   > **Note**: Read the `VERSION` file and update the version in the template metadata line when generating.

2. **Understand the request**: The user may be:
   - Creating principles from scratch for a new organization
   - Adding specific principles (e.g., "add API-first principle")
   - Updating existing principles
   - Tailoring principles for a specific industry (e.g., financial services, healthcare, retail)

3. **Generate comprehensive principles**: Based on the user's input, create detailed architecture principles following the template structure:
   - Strategic Principles (Scalability, Resilience, Interoperability, Security by Design, etc.)
   - Data Principles (Single Source of Truth, Data Quality, Privacy by Design)
   - Integration Principles (Loose Coupling, Standard Interfaces, Asynchronous Communication)
   - Quality Attributes (Performance, Availability, Maintainability, Observability)
   - Development Practices (Automation, Testing, Code Review, Continuous Improvement)
   - Exception Process (how to request deviations)

   **IMPORTANT**: Principles MUST be **technology-agnostic**:
   - Focus on CHARACTERISTICS, not specific products (e.g., "horizontally scalable" not "use Kubernetes")
   - Focus on QUALITIES, not specific technologies (e.g., "encrypted in transit" not "use TLS 1.3")
   - Focus on PATTERNS, not specific implementations (e.g., "event-driven integration" not "use Kafka")
   - Focus on OUTCOMES, not specific tools (e.g., "infrastructure as code" not "use Terraform")

   **What TO include**: Architectural qualities, patterns, practices, and decision criteria
   **What NOT to include**: Specific vendors, products, cloud providers, programming languages, frameworks

4. **Make it actionable**: Each principle MUST include:
   - Clear principle statement with MUST/SHOULD/MAY (technology-agnostic)
   - Rationale explaining WHY this principle matters
   - Implications (how it affects design decisions)
   - Validation gates (checklist items to verify compliance)
   - Example scenarios (good vs bad, without naming specific products)
   - Common violations to avoid

5. **Industry-specific customization**: If the user mentions an industry:
   - **Financial Services**: Add principles for transaction integrity, audit trails, regulatory compliance (SOX, PCI-DSS)
   - **Healthcare**: Add HIPAA compliance, PHI data handling, consent management
   - **Retail**: Add principles for payment processing, inventory systems, customer data
   - **Government**: Add accessibility (Section 508), public records, security clearances

6. **Detect version**: Before generating the document, check if a previous version exists:
   - Look for existing `ARC-000-PRIN-v*.md` files in `projects/000-global/`
   - **If no existing file**: Use VERSION="1.0"
   - **If existing file found**:
     - Read the existing document to understand its scope
     - Compare against current inputs
     - **Minor increment** (e.g., 1.0 → 1.1): Scope unchanged — refreshed content, updated details, corrections
     - **Major increment** (e.g., 1.0 → 2.0): Scope materially changed — new principle categories, removed categories, fundamentally different guidance
   - For v1.1+/v2.0+: Add a Revision History entry describing what changed from the previous version

7. **Write the output**:
   - Generate the document ID using: `.arckit/scripts/bash/generate-document-id.sh 000 PRIN ${VERSION} --filename`
   - This produces: `ARC-000-PRIN-v${VERSION}.md` (000 indicates global/cross-project document)
   - Write to: `projects/000-global/ARC-000-PRIN-v${VERSION}.md`
   - Use the exact template structure
   - Make it ready for immediate use by development teams

   > **WARNING**: Do NOT use legacy filename `architecture-principles.md`. Always use the document ID format.
   > **NOTE**: The `projects/000-global/` directory is for cross-project artifacts like architecture principles.




**IMPORTANT - Auto-Populate Document Information Fields**:

Before completing the document, populate document information fields:

### Auto-populated fields:
- `[PROJECT_ID]` → Extract from project path (e.g., "001")
- `[VERSION]` → Determined version from step 6
- `[DATE]` / `[YYYY-MM-DD]` → Current date in YYYY-MM-DD format
- `[DOCUMENT_TYPE_NAME]` → Document purpose
- `ARC-[PROJECT_ID]-PRIN-v[VERSION]` → Generated document ID
- `[STATUS]` → "DRAFT" for new documents
- `[CLASSIFICATION]` → Default to "OFFICIAL" (UK Gov) or "PUBLIC"

### User-provided fields:
- `[PROJECT_NAME]` → Full project name
- `[OWNER_NAME_AND_ROLE]` → Document owner

### Revision History:
```markdown
| 1.0 | {DATE} | ArcKit AI | Initial creation from `/arckit.principles` command |
```

### Generation Metadata Footer:
```markdown
**Generated by**: ArcKit `/arckit.principles` command
**Generated on**: {DATE}
**ArcKit Version**: [VERSION from VERSION or "1.0.0"]
**Project**: {PROJECT_NAME} (Project {PROJECT_ID})
**AI Model**: [Actual model name]
```


8. **Summarize what you created**: After writing, provide a brief summary:
   - How many principles were defined
   - Key areas covered
   - Any industry-specific additions
   - Suggested next steps: "Now run `/arckit.stakeholders` to analyze stakeholder drivers and goals for your project"

## Example Usage

User: `/arckit.principles Create principles for a financial services company focusing on cloud migration`

You should:
- Read the template
- Generate comprehensive principles
- Add financial services specific requirements (SOX, PCI-DSS, transaction integrity, audit trails)
- Include cloud migration principles (cloud-first, lift-and-shift vs re-architecture)
- Write to `projects/000-global/ARC-000-PRIN-v1.0.md`
- Confirm completion with summary

## Important Notes

- **Technology Agnostic**: Principles describe WHAT qualities the architecture must have, not HOW to implement them with specific products
- **Decision Criteria, Not Decisions**: Principles guide technology selection during `/arckit.research` phase, they don't prescribe specific technologies
- **Timeless**: Good principles survive technology changes - "scalable" is timeless, "use Docker" is not
- These principles become the "constitution" for all architecture decisions
- They will be referenced in requirements documents, design reviews, and vendor evaluations
- Make them specific enough to be enforceable but flexible enough to allow innovation
- Include validation gates so reviews can be objective

## Examples of Good vs Bad Principles

**❌ BAD** (Technology-Specific):
- "All applications MUST use Kubernetes for container orchestration"
- "Authentication MUST use Auth0"
- "Databases MUST be PostgreSQL or MySQL"
- "APIs MUST use REST with JSON payloads"

**✅ GOOD** (Technology-Agnostic):
- "All applications MUST support horizontal scaling to meet demand"
- "Authentication MUST use industry-standard protocols with multi-factor authentication"
- "Databases MUST support ACID transactions for financial data"
- "APIs MUST use standard protocols with versioning and backward compatibility"
