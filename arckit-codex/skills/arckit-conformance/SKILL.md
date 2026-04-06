---
name: arckit-conformance
description: "Assess architecture conformance — ADR decision implementation, cross-decision consistency, design-principles alignment, architecture drift, technical debt, and custom constraint rules"
---

## User Input

```text
$ARGUMENTS
```

## Goal

Generate a systematic **Architecture Conformance Assessment** that checks whether the *decided* architecture (ADRs, principles, approved designs) matches the *designed/implemented* architecture (HLD, DLD, DevOps artifacts). This command fills the gap between `$arckit-health` (quick metadata scan) and `$arckit-analyze` (deep governance across all dimensions) by focusing specifically on **decided-vs-designed conformance**, architecture drift, and architecture technical debt (ATD).

**This is a point-in-time assessment** — run at key project gates or after major design changes to track conformance over time.

## Prerequisites

### Architecture Principles (MANDATORY)

a. **PRIN** (Architecture Principles, in `projects/000-global/`) (MUST exist):

- If NOT found: ERROR "Run $arckit-principles first to define governance standards for your organization"

### Architecture Decision Records (MANDATORY)

b. **ADR** (Architecture Decision Records, in `projects/{project-dir}/decisions/`) (MUST exist):

- If NOT found: ERROR "Run $arckit-adr first — conformance assessment requires at least one accepted ADR"

### Project Artifacts (RECOMMENDED)

More artifacts = better conformance assessment:

- **REQ** (Requirements) in `projects/{project-dir}/` — Requirements to cross-reference
- `projects/{project-dir}/vendors/{vendor}/hld-v*.md` — High-Level Design
- `projects/{project-dir}/vendors/{vendor}/dld-v*.md` — Detailed Low-Level Design
- **HLDR** (HLD Review) in `projects/{project-dir}/reviews/` — Design review findings
- **DLDR** (DLD Review) in `projects/{project-dir}/reviews/` — Detailed review findings
- **PRIN-COMP** (Principles Compliance) in `projects/{project-dir}/` — Prior compliance assessment
- **TRAC** (Traceability Matrix) in `projects/{project-dir}/` — Requirements traceability
- **RISK** (Risk Register) in `projects/{project-dir}/` — Risk context for exceptions
- **DEVOPS** (DevOps Strategy) in `projects/{project-dir}/` — CI/CD and deployment patterns

### Custom Constraint Rules (OPTIONAL)

c. `.arckit/conformance-rules.md` in the project root (if exists):

- Contains user-defined ArchCNL-style constraint rules
- Format: Natural language rules with MUST/MUST NOT/SHOULD/SHOULD NOT keywords
- Example: "All API services MUST use OAuth 2.0 for authentication"
- Example: "Database connections MUST NOT use plaintext credentials"

**Note**: Assessment is possible with minimal artifacts (principles + ADRs), but accuracy improves significantly with HLD/DLD and review documents.

## Operating Constraints

**Non-Destructive Assessment**: Do NOT modify existing artifacts. Generate a new conformance assessment document only.

**Evidence-Based Assessment**: Every finding must cite specific file:section:line references. Avoid vague statements like "design addresses this" — be specific.

**Honest Assessment**: Do not inflate conformance scores. FAIL is better than false PASS. Untracked technical debt should be surfaced, not hidden.

**Architecture Principles Authority**: The architecture principles (`ARC-000-PRIN-*.md` in `projects/000-global/`) are non-negotiable. Any design that contradicts principles is automatically a FAIL.

**ADR Decision Authority**: Accepted ADR decisions are binding. Designs that ignore or contradict accepted decisions are non-conformant.

## Execution Steps

> **Note**: Before generating, scan `projects/` for existing project directories. For each project, list all `ARC-*.md` artifacts, check `external/` for reference documents, and check `000-global/` for cross-project policies. If no external docs exist but they would improve output, ask the user.

### 0. Read the Template

**Read the template** (with user override support):

- **First**, check if `.arckit/templates/conformance-assessment-template.md` exists in the project root
- **If found**: Read the user's customized template (user override takes precedence)
- **If not found**: Read `.arckit/templates/conformance-assessment-template.md` (default)

> **Tip**: Users can customize templates with `$arckit-customize conformance`

### 1. Validate Prerequisites

**Check Architecture Principles**:

- Look for `ARC-000-PRIN-*.md` in `projects/000-global/`
- If NOT found: ERROR "Architecture principles not found. Run $arckit-principles first."

**Check ADRs**:

- Look for `ARC-*-ADR-*.md` files in `projects/{project-dir}/decisions/`
- If NONE found: ERROR "No ADRs found. Run $arckit-adr first — conformance assessment requires at least one accepted ADR."

### 1b. Read external documents and policies

- Read any **external documents** listed in the project context (`external/` files) — extract audit findings, compliance gaps, certification evidence, remediation plans
- Read any **enterprise standards** in `projects/000-global/external/` — extract enterprise compliance frameworks, cross-project conformance benchmarks
- If no external docs exist but they would improve the assessment, note this as an assessment limitation
- **Citation traceability**: When referencing content from external documents, follow the citation instructions in `.arckit/references/citation-instructions.md`. Place inline citation markers (e.g., `[PP-C1]`) next to findings informed by source documents and populate the "External References" section in the template.

### 2. Identify the Target Project

- Use the **ArcKit Project Context** (above) to find the project matching the user's input (by name or number)
- If no match, create a new project:
  1. Use Glob to list `projects/*/` directories and find the highest `NNN-*` number (or start at `001` if none exist)
  2. Calculate the next number (zero-padded to 3 digits, e.g., `002`)
  3. Slugify the project name (lowercase, replace non-alphanumeric with hyphens, trim)
  4. Use the Write tool to create `projects/{NNN}-{slug}/README.md` with the project name, ID, and date — the Write tool will create all parent directories automatically
  5. Also create `projects/{NNN}-{slug}/external/README.md` with a note to place external reference documents here
  6. Set `PROJECT_ID` = the 3-digit number, `PROJECT_PATH` = the new directory path

### 3. Load All Relevant Artifacts

Read the following artifacts. Do NOT read entire files — extract relevant sections for each conformance check.

**Architecture Principles** (`projects/000-global/ARC-000-PRIN-*.md`):

- Extract ALL principles dynamically (name, statement, rationale, implications)

**ADRs** (`projects/{project-dir}/decisions/ARC-*-ADR-*.md`):

- For EACH ADR, extract: title, status (Accepted/Superseded/Deprecated/Proposed), decision text, context, consequences (positive and negative), related ADRs
- Track supersession chains (which ADR supersedes which)

**Design Documents** (if exist):

- `projects/{project-dir}/vendors/{vendor}/hld-v*.md` — Architecture overview, technology stack, patterns, components
- `projects/{project-dir}/vendors/{vendor}/dld-v*.md` — Detailed implementation, API specs, infrastructure

**Review Documents** (if exist):

- `ARC-*-HLDR-*.md` in `reviews/` — HLD review conditions, findings
- `ARC-*-DLDR-*.md` in `reviews/` — DLD review conditions, findings

**Other Artifacts** (if exist):

- `ARC-*-REQ-*.md` — Requirements for traceability
- `ARC-*-PRIN-COMP-*.md` — Prior principles compliance (for trend comparison)
- `ARC-*-TRAC-*.md` — Traceability matrix
- `ARC-*-RISK-*.md` — Risk register (for exception context)
- `ARC-*-DEVOPS-*.md` — DevOps strategy (for technology stack drift check)

**Custom Rules** (if exist):

- `.arckit/conformance-rules.md` in the project root

### 4. Execute Conformance Checks

Run ALL 12 conformance checks. Each check produces a PASS/FAIL/NOT ASSESSED status with evidence.

---

#### Check ADR-IMPL: ADR Decision Implementation (Severity: HIGH)

For EACH ADR with status "Accepted":

1. Extract the **Decision** section text
2. Search HLD and DLD for evidence that the decision is implemented
3. Check that the technology/pattern/approach chosen in the ADR appears in the design
4. **PASS**: Design documents reference or implement the ADR decision
5. **FAIL**: Decision is accepted but not reflected in design documents
6. **NOT ASSESSED**: No HLD/DLD available to check against

**Evidence format**: `ADR "Title" (file:line) → HLD Section X (file:line) — [IMPLEMENTED/NOT FOUND]`

---

#### Check ADR-CONFL: Cross-ADR Consistency (Severity: HIGH)

1. Compare all Accepted ADRs for contradictions:
   - Technology choices that conflict (e.g., ADR-001 chooses PostgreSQL, ADR-005 chooses MongoDB for same purpose)
   - Pattern choices that conflict (e.g., ADR-002 mandates event-driven, ADR-007 mandates synchronous API calls for same integration)
   - Scope overlaps where decisions disagree
2. **PASS**: No contradictions found between accepted ADRs
3. **FAIL**: Contradictions identified — list conflicting ADR pairs with specific conflicts

**Evidence format**: `ADR-001 (file:line) CONFLICTS WITH ADR-005 (file:line) — [description]`

---

#### Check ADR-SUPER: Superseded ADR Enforcement (Severity: MEDIUM)

1. Identify all Superseded ADRs
2. Check that HLD/DLD does NOT reference patterns/technologies from superseded decisions
3. Check that the superseding ADR's decision IS reflected instead
4. **PASS**: No residue from superseded decisions found in design
5. **FAIL**: Design still references superseded decision patterns/technologies

**Evidence format**: `Superseded ADR "Title" (file:line) — residue found in HLD Section X (file:line)`

---

#### Check PRIN-DESIGN: Principles-to-Design Alignment (Severity: HIGH)

For EACH architecture principle:

1. Extract the principle statement and implications
2. Search HLD/DLD for design elements that satisfy or violate the principle
3. Apply **binary pass/fail** constraint checking (unlike principles-compliance which uses RAG scoring):
   - Does the design VIOLATE this principle? → FAIL
   - Does the design SATISFY this principle? → PASS
   - Insufficient evidence to determine? → NOT ASSESSED
4. This is a **hard constraint check**, not a maturity assessment

**Note**: This differs from `$arckit-principles-compliance` which provides RAG scoring with remediation plans. This check is a binary gate: does the design conform or not?

**Evidence format**: `Principle "Name" — HLD Section X (file:line) [SATISFIES/VIOLATES] — [description]`

---

#### Check COND-RESOLVE: Review Condition Resolution (Severity: HIGH)

1. Read HLD/DLD review documents (HLDR, DLDR)
2. Look for conditions — typically flagged as "APPROVED WITH CONDITIONS", "CONDITIONAL", "CONDITIONS", or specific condition markers
3. For each condition found:
   - Search for evidence of resolution in subsequent artifacts or updated designs
   - Check if condition has been addressed in a newer version of the reviewed document
4. **PASS**: All review conditions have resolution evidence
5. **FAIL**: Unresolved conditions found — list each with its source and status

**Evidence format**: `Condition "[text]" (file:line) — [RESOLVED in file:line / UNRESOLVED]`

---

#### Check EXCPT-EXPIRY: Exception Register Expiry (Severity: HIGH)

1. Search for exception registers in principles-compliance assessment, risk register, and review documents
2. Look for patterns: "Exception", "EXC-", "Approved exception", "Waiver", "Exemption"
3. For each exception found, check if the expiry date has passed (compare to today's date)
4. **PASS**: No expired exceptions found (or no exceptions exist)
5. **FAIL**: Expired exceptions found that haven't been renewed or remediated

**Evidence format**: `Exception "EXC-NNN" (file:line) — expired [DATE], [REMEDIATED/STILL ACTIVE]`

---

#### Check EXCPT-REMEDI: Exception Remediation Progress (Severity: MEDIUM)

1. For each active (non-expired) exception found:
   - Check if a remediation plan exists
   - Check if there's evidence of progress toward remediation
   - Check if remediation timeline is realistic given remaining time to expiry
2. **PASS**: All active exceptions have remediation plans with evidence of progress
3. **FAIL**: Exceptions missing remediation plans or showing no progress

**Evidence format**: `Exception "EXC-NNN" — remediation plan [EXISTS/MISSING], progress [EVIDENCE/NONE]`

---

#### Check DRIFT-TECH: Technology Stack Drift (Severity: MEDIUM)

1. Extract technology choices from ADRs (databases, frameworks, languages, cloud services, tools)
2. Extract technology references from HLD, DLD, and DevOps strategy
3. Compare: do the technologies in design documents match ADR decisions?
4. Look for technologies appearing in design that were NOT decided via ADR (undocumented technology adoption)
5. **PASS**: Technology stack in design matches ADR decisions
6. **FAIL**: Technologies in design don't match ADR decisions, or undocumented technologies found

**Evidence format**: `Technology "[name]" — ADR (file:line) says [X], Design (file:line) uses [Y]`

---

#### Check DRIFT-PATTERN: Architecture Pattern Drift (Severity: MEDIUM)

1. Extract architecture patterns from ADRs and HLD (microservices, event-driven, REST, CQRS, etc.)
2. Check DLD for consistent pattern application across all components
3. Look for components that deviate from the chosen pattern without an ADR justifying the deviation
4. **PASS**: Patterns consistently applied across all design artifacts
5. **FAIL**: Inconsistent pattern application found

**Evidence format**: `Pattern "[name]" chosen in ADR/HLD (file:line) — DLD component [X] (file:line) uses [different pattern]`

---

#### Check RULE-CUSTOM: Custom Constraint Rules (Severity: Variable)

1. Read `.arckit/conformance-rules.md` if it exists
2. For each rule defined:
   - Parse the rule (natural language with MUST/MUST NOT/SHOULD/SHOULD NOT)
   - Search design artifacts for evidence of compliance or violation
   - Assign severity based on keyword: MUST/MUST NOT → HIGH, SHOULD/SHOULD NOT → MEDIUM
3. **PASS**: Rule satisfied with evidence
4. **FAIL**: Rule violated — cite specific violation
5. **NOT ASSESSED**: Insufficient artifacts to check rule
6. If no custom rules file exists: mark as NOT ASSESSED with note "No custom rules defined"

**Evidence format**: `Rule "[text]" — [SATISFIED/VIOLATED] at (file:line)`

---

#### Check ATD-KNOWN: Known Technical Debt (Severity: LOW)

1. Catalogue acknowledged architecture technical debt from:
   - **ADR negative consequences**: "Consequences" sections listing accepted downsides
   - **Risk register accepted risks**: Risks accepted as trade-offs (ACCEPT treatment)
   - **Review conditions**: Deferred items from HLD/DLD reviews
   - **Workarounds**: Temporary solutions documented in design
   - **Scope reductions**: Quality/features removed for timeline/budget
2. Classify each debt item into ATD categories:
   - DEFERRED-FIX: Known deficiency deferred to later phase
   - ACCEPTED-RISK: Risk consciously accepted as trade-off
   - WORKAROUND: Temporary solution deviating from intended pattern
   - DEPRECATED-PATTERN: Superseded pattern not yet migrated
   - SCOPE-REDUCTION: Quality/feature removed for timeline/budget
   - EXCEPTION: Approved principle exception with expiry
3. **PASS**: Known debt is documented and tracked (this check always passes if debt is acknowledged)
4. **NOT ASSESSED**: No artifacts available to catalogue debt

**Evidence format**: `ATD-NNN: "[description]" — Category: [category], Source: (file:line)`

---

#### Check ATD-UNTRACK: Untracked Technical Debt (Severity: MEDIUM)

1. Look for potential architecture technical debt NOT explicitly acknowledged:
   - Technologies in design but not in ADR decisions (ad-hoc adoption)
   - TODO/FIXME/HACK/WORKAROUND markers in design documents
   - Inconsistencies between HLD and DLD suggesting shortcuts
   - Design elements contradicting principles without an exception
   - Review findings not addressed in subsequent versions
2. **PASS**: No untracked debt detected
3. **FAIL**: Potential untracked debt identified — list items for team review

**Evidence format**: `Potential ATD: "[description]" found at (file:line) — not documented in any ADR/risk/exception`

---

### 5. Calculate Conformance Score

**Scoring**:

- Count PASS, FAIL, NOT ASSESSED for each check
- Calculate overall conformance percentage: `(PASS count / (PASS + FAIL count)) × 100`
- Exclude NOT ASSESSED from the denominator

**Deviation Tier Assignment** — for each FAIL finding, assign a tier based on result + severity:

- 🔴 RED: FAIL + HIGH severity — escalate immediately, blocks next gate
- 🟡 YELLOW: FAIL + MEDIUM severity — negotiate remediation within 30 days, include fallback
- 🟢 GREEN: FAIL + LOW severity — acceptable deviation, document and monitor

**Tier-Specific Response Requirements**:

- For each 🔴 RED finding: explain the architecture risk, propose an alternative approach, recommend escalation to architecture board/CTO
- For each 🟡 YELLOW finding: provide specific remediation steps + timeline, include a fallback position if remediation is deferred
- For each 🟢 GREEN finding: document the deviation rationale, set a review date, no blocking action required

**Overall Recommendation**:

- **CONFORMANT**: All checks PASS (or NOT ASSESSED), no FAIL findings
- **CONFORMANT WITH CONDITIONS**: No RED findings, YELLOW/GREEN findings have remediation plans, conformance >= 80%
- **NON-CONFORMANT**: Any RED finding, or conformance < 80%

### 6. Generate Document

Use the document ID `ARC-{PROJECT_ID}-CONF-v{VERSION}` (e.g., `ARC-001-CONF-v1.0`).

Before writing the file, read `.arckit/references/quality-checklist.md` and verify all **Common Checks** plus the **CONF** per-type checks pass. Fix any failures before proceeding.

**Use the Write tool** to save the document to `projects/{project-dir}/ARC-{PROJECT_ID}-CONF-v{VERSION}.md`.

Populate the template with all conformance check results, following the structure defined in the template.

**IMPORTANT**: Use Write tool, not output to user. Document will be 500-2000 lines depending on the number of ADRs, principles, and findings.

**Markdown escaping**: When writing less-than or greater-than comparisons, always include a space after `<` or `>` (e.g., `< 3 seconds`, `> 99.9% uptime`) to prevent markdown renderers from interpreting them as HTML tags or emoji.

### 7. Show Summary to User

Display concise summary (NOT full document):

```text
✅ Architecture conformance assessment generated

📊 **Conformance Summary**:
   - Overall Score: [X]% ([CONFORMANT / CONFORMANT WITH CONDITIONS / NON-CONFORMANT])
   - Checks Passed: [X] / [Y]
   - Checks Failed: [X]
   - Not Assessed: [X]

[IF RED findings:]
🔴 **RED — Escalate** ([N]):
   - [Check ID]: [Brief description]
   [List all RED findings]

[IF YELLOW findings:]
🟡 **YELLOW — Negotiate** ([N]):
   - [Check ID]: [Brief description]
   [List all YELLOW findings]

[IF GREEN findings:]
🟢 **GREEN — Acceptable** ([N]):
   - [Check ID]: [Brief description]
   [List all GREEN findings]

[IF ATD items found:]
📦 **Architecture Technical Debt**: [X] known items, [Y] potential untracked items

📄 **Document**: projects/{project-dir}/ARC-{PROJECT_ID}-CONF-v{VERSION}.md

🔍 **Recommendation**:
   [CONFORMANT]: ✅ Architecture conforms to decisions and principles
   [CONFORMANT WITH CONDITIONS]: ⚠️ No critical deviations — [N] YELLOW findings need remediation by [date]
   [NON-CONFORMANT]: ❌ [N] RED findings require escalation before proceeding

**Next Steps**:
1. Review detailed findings in the generated document
2. [IF RED findings:] Escalate critical deviations to architecture board immediately
3. [IF YELLOW findings:] Agree remediation plans or fallback positions within 30 days
4. [IF ATD items:] Review technical debt register with architecture board
5. [IF custom rules missing:] Consider creating `.arckit/conformance-rules.md` for project-specific rules
6. Schedule next conformance check at [next gate/phase]
```

## Post-Generation Actions

After generating the assessment document:

1. **Suggest Follow-up Commands**:

   ```text
   📋 **Related Commands**:
   - $arckit-principles-compliance - Detailed RAG scoring of principle compliance
   - $arckit-analyze - Comprehensive governance gap analysis
   - $arckit-traceability - Requirements traceability matrix
   - $arckit-health - Quick metadata health check
   ```

2. **Track in Project**:
   Suggest adding remediation actions to project tracking:
   - Create backlog items for FAIL findings
   - Schedule architecture technical debt review
   - Set next conformance check date

## Important Notes

- **Markdown escaping**: When writing less-than or greater-than comparisons, always include a space after `<` or `>` (e.g., `< 3 seconds`, `> 99.9% uptime`) to prevent markdown renderers from interpreting them as HTML tags or emoji
