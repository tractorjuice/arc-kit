# Architecture Conformance Assessment

> **Template Origin**: Official | **ArcKit Version**: [VERSION] | **Command**: `/arckit.conformance`

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time to _partials/document-control-uk.md or _partials/document-control-uae.md based on plugin userConfig classification_scheme + governance_framework. See _partials/RENDERING.md (when present). -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [DATE] | ArcKit AI | Initial conformance assessment from `/arckit.conformance` command | PENDING | PENDING |

---

## Executive Summary

**Purpose**: This document assesses whether the project's decided architecture (ADRs, principles) conforms to the designed/implemented architecture (HLD, DLD, DevOps). This is a point-in-time conformance check for the [PHASE] phase gate review.

**Scope**: [N] conformance checks executed across [N] ADRs, [N] principles, and [N] design artifacts.

**Overall Conformance Score**: [X]%

| Result | Count | Description |
|--------|-------|-------------|
| ✅ PASS | [N] | Check satisfied with evidence |
| ❌ FAIL | [N] | Conformance violation detected |
| ⚪ NOT ASSESSED | [N] | Insufficient artifacts to check |

**Overall Recommendation**: [CONFORMANT / CONFORMANT WITH CONDITIONS / NON-CONFORMANT]

**Deviation Tiers** (FAIL findings only):

| Tier | Count | Response |
|------|-------|----------|
| 🔴 RED — Escalate | [N] | Blocks next gate — escalate to architecture board |
| 🟡 YELLOW — Negotiate | [N] | Remediate within 30 days or agree fallback |
| 🟢 GREEN — Acceptable | [N] | Document and monitor — no blocking action |

[IF NON-CONFORMANT:]
**Critical Conformance Gaps**:

1. [Check ID] — [Brief description of failure]
2. [Repeat for each RED finding]

**Action Required**: Escalate RED findings to architecture board before proceeding to next gate.

[IF CONFORMANT WITH CONDITIONS:]
**Conditions Noted**: No RED findings — [N] YELLOW findings require remediation by [next gate date].

[IF CONFORMANT:]
**All checks passed** — architecture conforms to decisions and principles.

---

## Conformance Scorecard

| ID | Conformance Check | Severity | Result | Tier | Evidence | Finding Summary |
|----|-------------------|----------|--------|------|----------|-----------------|
| ADR-IMPL | ADR Decision Implementation | HIGH | [✅/❌/⚪] | [—/🔴] | [N] ADRs checked | [Summary] |
| ADR-CONFL | Cross-ADR Consistency | HIGH | [✅/❌/⚪] | [—/🔴] | [N] ADR pairs | [Summary] |
| ADR-SUPER | Superseded ADR Enforcement | MEDIUM | [✅/❌/⚪] | [—/🟡] | [N] superseded | [Summary] |
| PRIN-DESIGN | Principles-to-Design Alignment | HIGH | [✅/❌/⚪] | [—/🔴] | [N] principles | [Summary] |
| COND-RESOLVE | Review Condition Resolution | HIGH | [✅/❌/⚪] | [—/🔴] | [N] conditions | [Summary] |
| EXCPT-EXPIRY | Exception Register Expiry | HIGH | [✅/❌/⚪] | [—/🔴] | [N] exceptions | [Summary] |
| EXCPT-REMEDI | Exception Remediation Progress | MEDIUM | [✅/❌/⚪] | [—/🟡] | [N] active | [Summary] |
| DRIFT-TECH | Technology Stack Drift | MEDIUM | [✅/❌/⚪] | [—/🟡] | [N] technologies | [Summary] |
| DRIFT-PATTERN | Architecture Pattern Drift | MEDIUM | [✅/❌/⚪] | [—/🟡] | [N] patterns | [Summary] |
| RULE-CUSTOM | Custom Constraint Rules | Variable | [✅/❌/⚪] | [—/🟢/🟡/🔴] | [N] rules | [Summary] |
| ATD-KNOWN | Known Technical Debt | LOW | [✅/⚪] | [—/🟢] | [N] items | [Summary] |
| ATD-UNTRACK | Untracked Technical Debt | MEDIUM | [✅/❌/⚪] | [—/🟡] | [N] potential | [Summary] |

---

## ADR Decision Conformance

### ADR Decision Implementation (ADR-IMPL) — [✅/❌/⚪]

| ADR | Title | Status | Decision | Design Evidence | Result |
|-----|-------|--------|----------|-----------------|--------|
| ADR-001 | [Title] | Accepted | [Decision summary] | [HLD/DLD reference or "Not found"] | [✅/❌] |
| [Repeat for each Accepted ADR] |

[IF FAIL:]
**Unimplemented Decisions**:

- **ADR-[N] "[Title]"** (decisions/ARC-*-ADR-[N]-v*.md, line [N]):
  - Decision: "[decision text]"
  - Expected in: HLD/DLD
  - Found: [Nothing / Contradictory design at file:line]
  - Impact: [What this means for the project]

---

### Cross-ADR Consistency (ADR-CONFL) — [✅/❌/⚪]

[IF PASS:]
✅ No contradictions found between [N] accepted ADRs.

[IF FAIL:]
**Conflicting ADR Pairs**:

**Conflict 1**: ADR-[N] vs ADR-[N]

- **ADR-[N] "[Title]"** (file:line): Decides [X]
- **ADR-[N] "[Title]"** (file:line): Decides [Y]
- **Contradiction**: [Describe how decisions conflict]
- **Resolution Required**: [Suggest how to resolve — new ADR superseding one, or clarification]

[Repeat for each conflict]

---

### Superseded ADR Enforcement (ADR-SUPER) — [✅/❌/⚪]

| Superseded ADR | Superseded By | Design Residue Found | Result |
|----------------|---------------|---------------------|--------|
| ADR-[N] "[Title]" | ADR-[N] "[Title]" | [None / file:line description] | [✅/❌] |

[IF FAIL:]
**Superseded Decision Residue**:

- **ADR-[N] "[Title]"** was superseded by ADR-[N] "[Title]"
  - Old decision: "[text]"
  - New decision: "[text]"
  - Residue found: [file:section:line — what still references old decision]
  - Action: Update design to reflect superseding decision

---

## Design-Principles Alignment

### Principles-to-Design Alignment (PRIN-DESIGN) — [✅/❌/⚪]

| # | Principle | Constraint Check | Design Evidence | Result |
|---|-----------|-----------------|-----------------|--------|
| 1 | [Principle Name] | [What must be true] | [file:section:line or "No evidence"] | [✅/❌/⚪] |
| [Repeat for each principle] |

[IF FAIL:]
**Principle Violations**:

**Violation 1**: Principle "[Name]"

- **Principle Statement**: "[text]"
- **Design Violation**: [file:section:line] — [what the design does that violates the principle]
- **Impact**: [Risk created by this violation]
- **Resolution**: [Change design / Request exception / Create ADR justifying deviation]

[Repeat for each violation]

---

## Review Condition & Exception Tracker

### Review Condition Resolution (COND-RESOLVE) — [✅/❌/⚪]

| Source | Condition | Status | Resolution Evidence |
|--------|-----------|--------|---------------------|
| HLDR (file:line) | [Condition text] | [RESOLVED / UNRESOLVED] | [Resolution reference or "None found"] |
| DLDR (file:line) | [Condition text] | [RESOLVED / UNRESOLVED] | [Resolution reference or "None found"] |

[IF FAIL:]
**Unresolved Conditions**:

- **Condition**: "[text]" (source: file:line)
  - Required by: [Reviewer/Board]
  - Deadline: [Date if specified]
  - Status: UNRESOLVED — no evidence of resolution found
  - Action: [What needs to happen]

---

### Exception Register Expiry (EXCPT-EXPIRY) — [✅/❌/⚪]

| Exception ID | Principle/Rule | Approved Date | Expiry Date | Status |
|--------------|---------------|---------------|-------------|--------|
| EXC-[N] | [Principle/Rule] | [Date] | [Date] | [ACTIVE / EXPIRED / REMEDIATED] |

[IF FAIL:]
**Expired Exceptions**:

- **EXC-[N]** for principle "[Name]" — expired [DATE]
  - Original justification: [text]
  - Remediation status: [No remediation evidence / Partial / Complete]
  - Action: Renew exception with CTO/CIO approval OR complete remediation

---

### Exception Remediation Progress (EXCPT-REMEDI) — [✅/❌/⚪]

| Exception ID | Remediation Plan | Progress Evidence | Days to Expiry | Result |
|--------------|-----------------|-------------------|----------------|--------|
| EXC-[N] | [EXISTS / MISSING] | [Evidence summary] | [N] days | [✅/❌] |

[IF FAIL:]
**Exceptions Without Remediation Progress**:

- **EXC-[N]**: No remediation plan documented
  - Expires: [Date] ([N] days remaining)
  - Action: Create remediation plan with milestones before [Date]

---

## Architecture Drift Analysis

### Technology Stack Drift (DRIFT-TECH) — [✅/❌/⚪]

**Decided Technologies** (from ADRs):

| Technology | ADR Source | Category | Design Reference | Status |
|-----------|-----------|----------|-----------------|--------|
| [Technology name] | ADR-[N] (file:line) | [Database/Framework/Language/Cloud/Tool] | [Design file:line or "Not found"] | [✅ Aligned / ❌ Drifted / ⚪ N/A] |

**Undocumented Technologies** (found in design but no ADR):

| Technology | Found In | Category | Risk |
|-----------|----------|----------|------|
| [Technology name] | [file:line] | [Category] | [Why this matters — no governance trail] |

[IF FAIL:]
**Technology Drift Findings**:

- [Technology] decided in ADR-[N] but design uses [different technology] at [file:line]
- [Technology] found in design at [file:line] with no ADR justification

**Drift Score**: [N] of [M] technologies aligned ([X]%)

---

### Architecture Pattern Drift (DRIFT-PATTERN) — [✅/❌/⚪]

**Decided Patterns** (from ADRs/HLD):

| Pattern | Source | Components Using | Components Deviating | Status |
|---------|--------|-----------------|---------------------|--------|
| [Pattern name] | [ADR/HLD file:line] | [List] | [List or "None"] | [✅/❌] |

[IF FAIL:]
**Pattern Drift Findings**:

- Pattern "[name]" chosen in [source file:line]
  - Applied in: [component list with file:line references]
  - Deviating: [component] at [file:line] — uses [different pattern] instead
  - Justification: [ADR exists / No justification found]

---

## Custom Constraint Rules

### Custom Constraint Rules (RULE-CUSTOM) — [✅/❌/⚪]

[IF custom rules file exists:]

**Rules Source**: `.arckit/conformance-rules.md`

| # | Rule | Keyword | Severity | Evidence | Result |
|---|------|---------|----------|----------|--------|
| 1 | [Rule text] | [MUST/SHOULD] | [HIGH/MEDIUM] | [file:line or "No evidence"] | [✅/❌/⚪] |

[IF FAIL:]
**Rule Violations**:

- **Rule [N]**: "[text]"
  - Violation: [file:line — what violates the rule]
  - Severity: [HIGH/MEDIUM]
  - Action: [How to fix]

[IF no custom rules file:]
⚪ No custom constraint rules defined. Create `.arckit/conformance-rules.md` to add project-specific rules.

---

## Architecture Technical Debt Register

### Known Technical Debt (ATD-KNOWN) — [✅/⚪]

| ATD ID | Description | Category | Source | Severity | Owner | Target Resolution |
|--------|-------------|----------|--------|----------|-------|-------------------|
| ATD-001 | [Description] | [DEFERRED-FIX / ACCEPTED-RISK / WORKAROUND / DEPRECATED-PATTERN / SCOPE-REDUCTION / EXCEPTION] | [file:line] | [HIGH/MEDIUM/LOW] | [Role] | [Date/Phase] |

**ATD Category Summary**:

| Category | Count | Description |
|----------|-------|-------------|
| DEFERRED-FIX | [N] | Known deficiency deferred to later phase |
| ACCEPTED-RISK | [N] | Risk consciously accepted as trade-off |
| WORKAROUND | [N] | Temporary solution deviating from intended pattern |
| DEPRECATED-PATTERN | [N] | Superseded pattern not yet migrated |
| SCOPE-REDUCTION | [N] | Quality/feature removed for timeline/budget |
| EXCEPTION | [N] | Approved principle exception with expiry |
| **Total Known ATD** | **[N]** | |

---

### Untracked Technical Debt (ATD-UNTRACK) — [✅/❌/⚪]

[IF potential untracked debt found:]

| # | Potential Debt | Found At | Why Suspected | Recommended Action |
|---|---------------|----------|---------------|-------------------|
| 1 | [Description] | [file:line] | [Reasoning] | [Document in ADR / Add to risk register / Create exception] |

**Action Required**: Review these items with the architecture team. If they represent genuine debt, document them formally (ADR negative consequence, risk register entry, or exception request).

[IF no untracked debt:]
✅ No potential untracked technical debt detected.

---

### ATD Metrics

| Metric | Value |
|--------|-------|
| Total Known ATD Items | [N] |
| Total Potential Untracked ATD | [N] |
| ATD with Remediation Plans | [N] of [N] ([%]) |
| ATD Approaching Deadline | [N] (within 30 days) |
| ATD Overdue | [N] |

[IF previous conformance assessment exists:]

### Trend vs Previous Assessment

| Metric | Previous ([DATE]) | Current | Trend |
|--------|-------------------|---------|-------|
| Conformance Score | [X]% | [Y]% | [↑/↓/→] |
| PASS Count | [N] | [N] | [↑/↓/→] |
| FAIL Count | [N] | [N] | [↑/↓/→] |
| Known ATD Items | [N] | [N] | [↑/↓/→] |
| Untracked ATD | [N] | [N] | [↑/↓/→] |

---

## Findings & Remediation Plan

### 🔴 RED — Escalate (Blocks Next Gate)

[IF RED findings exist:]

| # | Check | Finding | Impact | Alternative Approach | Escalation Path | Owner | Deadline |
|---|-------|---------|--------|---------------------|-----------------|-------|----------|
| 1 | [Check ID] | [Description with file:line] | [Business/technical impact] | [Proposed alternative] | [Architecture board/CTO] | [Role] | [Date] |

### 🟡 YELLOW — Negotiate (Remediate or Agree Fallback)

[IF YELLOW findings exist:]

| # | Check | Finding | Impact | Remediation Steps | Fallback Position | Owner | Deadline |
|---|-------|---------|--------|-------------------|-------------------|-------|----------|
| 1 | [Check ID] | [Description with file:line] | [Business/technical impact] | [Specific remediation] | [Fallback if deferred] | [Role] | [Date] |

### 🟢 GREEN — Acceptable (Document and Monitor)

[IF GREEN findings exist:]

| # | Check | Finding | Impact | Deviation Rationale | Review Date | Owner |
|---|-------|---------|--------|---------------------|-------------|-------|
| 1 | [Check ID] | [Description with file:line] | [Impact] | [Why deviation is acceptable] | [Date] | [Role] |

[IF no findings:]
✅ No conformance findings — all checks passed.

---

## Recommendations

### 🔴 RED — Immediate Actions (before next gate)

[IF RED findings:]

1. [Action] — Owner: [Role] — Deadline: [Date]
2. [Repeat for each RED finding]

### 🟡 YELLOW — Short-Term Actions (within 30 days)

[IF YELLOW findings:]

1. [Action] — Owner: [Role] — Deadline: [Date]
2. [Repeat]

### 🟢 GREEN — Monitoring Actions (next quarter)

1. [Action] — Owner: [Role] — Target: [Date]
2. [Repeat]

### Governance Recommendations

- [Schedule next conformance check at [next gate/milestone]]
- [Consider creating/updating custom conformance rules]
- [Review architecture technical debt register quarterly]
- [Ensure all ADR decisions are reflected in design documents before reviews]

---

## Artifacts Reviewed

**Architecture Principles** (conformance authority):

- ✅ `projects/000-global/ARC-000-PRIN-v*.md` — [DATE] — [N] principles

**Architecture Decision Records**:

- ✅ `projects/{project-dir}/decisions/ARC-*-ADR-*.md` — [N] ADRs ([N] Accepted, [N] Superseded, [N] Other)

**Design Documents**:

- [✅/❌] `projects/{project-dir}/vendors/{vendor}/hld-v*.md` — [Available/Not available]
- [✅/❌] `projects/{project-dir}/vendors/{vendor}/dld-v*.md` — [Available/Not available]

**Review Documents**:

- [✅/❌] `projects/{project-dir}/reviews/ARC-*-HLDR-*.md` — [Available/Not available]
- [✅/❌] `projects/{project-dir}/reviews/ARC-*-DLDR-*.md` — [Available/Not available]

**Other Artifacts**:

- [✅/❌] `ARC-*-REQ-*.md` — [Available/Not available]
- [✅/❌] `ARC-*-PRIN-COMP-*.md` — [Available/Not available]
- [✅/❌] `ARC-*-TRAC-*.md` — [Available/Not available]
- [✅/❌] `ARC-*-RISK-*.md` — [Available/Not available]
- [✅/❌] `ARC-*-DEVOPS-*.md` — [Available/Not available]

**Custom Rules**:

- [✅/❌] `.arckit/conformance-rules.md` — [Available/Not available]

**Assessment Limitations**:

- [List any limitations based on missing artifacts]

---

## Appendix: Conformance Check Methodology

### Check Severity Levels

| Severity | Meaning | Action Required |
|----------|---------|-----------------|
| **HIGH** | Critical conformance violation — architecture integrity at risk | Immediate remediation before next gate |
| **MEDIUM** | Notable deviation — architecture drift detected | Remediation within 30 days or next gate |
| **LOW** | Informational — acknowledged debt being tracked | Monitor and review quarterly |

### ATD Categories

| Category | Description | Typical Source |
|----------|-------------|---------------|
| DEFERRED-FIX | Known deficiency deferred to later phase | ADR consequences, review conditions |
| ACCEPTED-RISK | Risk consciously accepted as trade-off | Risk register, ADR trade-offs |
| WORKAROUND | Temporary solution deviating from intended pattern | DLD, DevOps strategy |
| DEPRECATED-PATTERN | Superseded pattern not yet migrated | Superseded ADRs |
| SCOPE-REDUCTION | Quality/feature removed for timeline/budget | Requirements changes, sprint reviews |
| EXCEPTION | Approved principle exception with expiry | Exception register, compliance assessments |

### Deviation Tiers

| Tier | Criteria | Required Response |
|------|----------|-------------------|
| 🔴 RED — Escalate | FAIL + HIGH severity | Explain risk, provide alternative approach, escalate to architecture board/CTO |
| 🟡 YELLOW — Negotiate | FAIL + MEDIUM severity | Specific remediation steps + timeline, fallback position if deferred |
| 🟢 GREEN — Acceptable | FAIL + LOW severity | Document deviation rationale, set review date, no blocking action |

### Conformance Scoring

- **CONFORMANT** (100%): All checks PASS or NOT ASSESSED
- **CONFORMANT WITH CONDITIONS** ( >= 80%): No RED findings, YELLOW/GREEN findings have remediation plans
- **NON-CONFORMANT** ( < 80% or any RED finding): Critical gaps requiring immediate action

### Evidence Referencing Convention

All findings reference source artifacts using: `file:section:line` format.

- Example: `decisions/ARC-001-ADR-001-v1.0.md:Decision:15` — ADR file, Decision section, line 15
- Example: `vendors/acme/hld-v1.md:4.2 Security:156-203` — HLD file, section 4.2, lines 156-203

## External References

> This section provides traceability from generated content back to source documents.
> Follow citation instructions in the project's citation reference guide.

### Document Register

| Doc ID | Filename | Type | Source Location | Description |
|--------|----------|------|-----------------|-------------|
| *None provided* | — | — | — | — |

### Citations

| Citation ID | Doc ID | Page/Section | Category | Quoted Passage |
|-------------|--------|--------------|----------|----------------|
| — | — | — | — | — |

### Unreferenced Documents

| Filename | Source Location | Reason |
|----------|-----------------|--------|
| — | — | — |

---

**Generated by**: ArcKit `/arckit.conformance` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
