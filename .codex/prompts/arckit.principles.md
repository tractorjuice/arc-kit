---
description: Create or update enterprise architecture principles
---

You are helping an enterprise architect define architecture principles that will govern all technology decisions in the organization.

## User Input

```text
$ARGUMENTS
```

## Instructions

1. **Read the template**: Read `.arckit/templates/architecture-principles-template.md` to understand the structure

2. **Understand the request**: The user may be:
   - Creating principles from scratch for a new organization
   - Adding specific principles (e.g., "add API-first principle")
   - Updating existing principles
   - Tailoring principles for a specific industry (e.g., financial services, healthcare, retail)

3. **Generate comprehensive principles**: Based on the user's input, create detailed architecture principles following the template structure:
   - Strategic Principles (Cloud-First, API-First, Security by Design, etc.)
   - Data Principles (Single Source of Truth, Data Quality, Privacy by Design)
   - Technology Standards (approved languages, frameworks, databases)
   - Architecture Patterns (microservices, event-driven, etc.)
   - Development Practices (CI/CD, testing, code review)
   - Exception Process (how to request deviations)

4. **Make it actionable**: Each principle MUST include:
   - Clear principle statement with MUST/SHOULD/MAY
   - Rationale explaining WHY
   - Approved technologies/patterns
   - Validation gates (checklist items)
   - Example implementations
   - Common violations to avoid

5. **Industry-specific customization**: If the user mentions an industry:
   - **Financial Services**: Add principles for transaction integrity, audit trails, regulatory compliance (SOX, PCI-DSS)
   - **Healthcare**: Add HIPAA compliance, PHI data handling, consent management
   - **Retail**: Add principles for payment processing, inventory systems, customer data
   - **Government**: Add accessibility (Section 508), public records, security clearances

6. **Write the output**:
   - If `.arckit/memory/architecture-principles.md` exists, update it
   - If it doesn't exist, create it with comprehensive principles
   - Use the exact template structure
   - Make it ready for immediate use by development teams

7. **Summarize what you created**: After writing, provide a brief summary:
   - How many principles were defined
   - Key areas covered
   - Any industry-specific additions
   - Suggested next steps (e.g., "Now run `/arckit.requirements` to define requirements that comply with these principles")

## Example Usage

User: `/arckit.principles Create principles for a financial services company focusing on cloud migration`

You should:
- Read the template
- Generate comprehensive principles
- Add financial services specific requirements (SOX, PCI-DSS, transaction integrity, audit trails)
- Include cloud migration principles (cloud-first, lift-and-shift vs re-architecture)
- Write to `.arckit/memory/architecture-principles.md`
- Confirm completion with summary

## Important Notes

- These principles become the "constitution" for all architecture decisions
- They will be referenced in requirements documents, design reviews, and vendor evaluations
- Make them specific enough to be enforceable but flexible enough to allow innovation
- Include validation gates so reviews can be objective
