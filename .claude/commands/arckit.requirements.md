---
description: Create comprehensive business and technical requirements
---

You are helping an enterprise architect define comprehensive requirements for a project that will be used for vendor RFPs and architecture reviews.

## User Input

```text
$ARGUMENTS
```

## Instructions

1. **Check for architecture principles and stakeholder analysis**:
   - First, check if `.arckit/memory/architecture-principles.md` exists
     - If it doesn't exist, suggest running `/arckit.principles` first
   - Then, check if a stakeholder analysis exists for this project
     - Look for `projects/*/stakeholder-drivers.md` files
     - If stakeholder analysis exists, read it to understand stakeholder goals and priorities
     - If it doesn't exist, strongly recommend running `/arckit.stakeholders` first to understand who cares and what they need
     - Stakeholder drivers should inform requirement prioritization and success criteria

2. **Create or find the project**:
   - Run `.arckit/scripts/bash/create-project.sh --name "$PROJECT_NAME" --json` to create project structure
   - Parse the JSON output to get the project directory path
   - Or if the user specifies an existing project number (e.g., "001"), use that

3. **Read the template**: Read `.arckit/templates/requirements-template.md` to understand the structure

4. **Generate comprehensive requirements** based on user input:

   **Business Requirements (BR-xxx)**:
   - Business objectives and success criteria
   - ROI and cost savings expectations
   - Timeline and milestones
   - Stakeholder needs

   **Functional Requirements (FR-xxx)**:
   - User personas and their needs
   - User stories and use cases
   - Features and capabilities
   - User workflows

   **Non-Functional Requirements (NFR-xxx)**:
   - Performance (response time, throughput, concurrent users)
   - Security (authentication, authorization, encryption, compliance)
   - Scalability (growth projections, load handling)
   - Reliability (uptime SLA, MTBF, MTTR)
   - Compliance (regulations, standards, certifications)

   **Integration Requirements (INT-xxx)**:
   - Upstream/downstream systems
   - APIs and protocols
   - Data exchange formats
   - Authentication methods

   **Data Requirements (DR-xxx)**:
   - Data models and schemas
   - Data retention and archival
   - Data privacy and classification
   - Migration requirements

5. **Ensure traceability**: Each requirement MUST have:
   - Unique ID (BR-001, FR-001, NFR-P-001, etc.)
   - Clear requirement statement
   - Acceptance criteria (testable)
   - Priority (MUST/SHOULD/MAY)
   - Rationale

6. **Align with stakeholder goals and architecture principles**:
   - If stakeholder analysis exists, trace requirements back to stakeholder goals:
     - Example: "BR-001 addresses CFO's goal G-1: Reduce infrastructure costs 40% by end of Year 1"
     - Example: "NFR-P-001 supports Operations Director's outcome O-3: Maintain 99.95% uptime"
   - Reference relevant principles from `.arckit/memory/architecture-principles.md`:
     - Example: "NFR-S-001 aligns with Security by Design principle (SEC-001)"
   - Ensure high-priority stakeholder drivers get MUST requirements
   - Document which stakeholder benefits from each requirement

7. **Write the output**:
   - Write to `projects/{project-dir}/requirements.md`
   - Use the exact template structure
   - Include all sections even if some are TBD

8. **Summarize what you created**:
   - How many requirements were defined (BRs, FRs, NFRs, etc.)
   - Key gaps or TBDs that need follow-up
   - Suggested next steps (e.g., "Now run `/arckit.sow` to generate RFP document")

## Example Usage

User: `/arckit.requirements Create requirements for a payment gateway modernization project`

You should:
- Check for architecture principles
- Create project "payment-gateway-modernization" (gets number 001)
- Generate comprehensive requirements:
  - Business: Cost savings, improved conversion, reduced downtime
  - Functional: Payment processing, refunds, fraud detection, reporting
  - NFR: PCI-DSS compliance, 99.99% uptime, <2s response time, encryption
  - Integration: CRM, accounting system, fraud service
  - Data: Transaction records, PII handling, 7-year retention
- Write to `projects/001-payment-gateway-modernization/requirements.md`
- Confirm completion with summary

## Important Notes

- Requirements drive everything: SOW, vendor evaluation, design reviews, testing
- Be specific and measurable (avoid "fast", use "<2 seconds")
- Include WHY (rationale) not just WHAT
- Make acceptance criteria testable
- Flag compliance requirements clearly (PCI-DSS, HIPAA, SOX, GDPR, etc.)
