# Architecture Conformance Guide

`/arckit.conformance` checks whether the decided architecture (ADRs, principles) matches the designed architecture (HLD, DLD). It bridges `/arckit.health` (quick metadata scan) and `/arckit.analyze` (deep governance analysis) by focusing on decided-vs-designed conformance, architecture drift, and technical debt.

---

## When to Run

| Cadence | Trigger | Notes |
|---------|---------|-------|
| Gate reviews | Alpha→Beta, Beta→Live | Attach conformance report to assurance packs |
| After ADR changes | New ADR accepted or superseded | Confirm design still matches decisions |
| After design revisions | HLD or DLD updated | Detect unintentional drift |
| Quarterly | Live systems | Track technical debt trends and exception expiry |

---

## Inputs

| Artefact | Contribution |
|----------|--------------|
| Architecture principles (MANDATORY) | Governance authority — design must conform |
| ADRs (MANDATORY) | Decision authority — design must implement |
| HLD / DLD | Design evidence for conformance checks |
| HLD / DLD reviews | Review conditions to track resolution |
| Risk register, compliance docs | Exception context and remediation tracking |
| `.arckit/conformance-rules.md` | Project-specific constraint rules |

---

## Command

```bash
/arckit.conformance <project description>
```

Output saved as `projects/<id>/ARC-<id>-CONF-v1.0.md`.

---

## 12 Conformance Checks

| ID | Check | Severity | What It Validates |
|----|-------|----------|-------------------|
| ADR-IMPL | ADR Decision Implementation | HIGH | Each accepted ADR's decision reflected in HLD/DLD |
| ADR-CONFL | Cross-ADR Consistency | HIGH | ADRs don't contradict each other |
| ADR-SUPER | Superseded ADR Enforcement | MEDIUM | Design doesn't reference superseded decisions |
| PRIN-DESIGN | Principles-to-Design Alignment | HIGH | Binary pass/fail constraint check against principles |
| COND-RESOLVE | Review Condition Resolution | HIGH | "Approved with conditions" have resolution evidence |
| EXCPT-EXPIRY | Exception Register Expiry | HIGH | Approved exceptions haven't expired |
| EXCPT-REMEDI | Exception Remediation Progress | MEDIUM | Active exceptions show remediation progress |
| DRIFT-TECH | Technology Stack Drift | MEDIUM | Technologies in ADRs match HLD/DLD/DevOps artifacts |
| DRIFT-PATTERN | Architecture Pattern Drift | MEDIUM | Chosen patterns consistently applied across artifacts |
| RULE-CUSTOM | Custom Constraint Rules | Variable | User-defined rules from `.arckit/conformance-rules.md` |
| ATD-KNOWN | Known Technical Debt | LOW | Catalogue acknowledged debt from ADR negatives, risks, workarounds |
| ATD-UNTRACK | Untracked Technical Debt | MEDIUM | Detect potential debt not explicitly acknowledged |

---

## Custom Conformance Rules

Create `.arckit/conformance-rules.md` to define project-specific constraints:

```markdown
# Conformance Rules

1. All API services MUST use OAuth 2.0 for authentication
2. Database connections MUST NOT use plaintext credentials
3. All microservices SHOULD expose health check endpoints
4. Logging MUST follow the structured JSON format defined in ADR-003
```

Keywords determine severity:

- **MUST / MUST NOT** → HIGH severity
- **SHOULD / SHOULD NOT** → MEDIUM severity

---

## Output Structure

| Section | What It Contains |
|---------|-----------------|
| Executive Summary | Conformance score, recommendation (Conformant / With Exceptions / Non-Conformant) |
| Conformance Scorecard | All 12 checks with PASS/FAIL/NOT ASSESSED |
| ADR Decision Conformance | Implementation status, cross-ADR conflicts, superseded residue |
| Design-Principles Alignment | Binary constraint checking per principle |
| Review Condition & Exception Tracker | Unresolved conditions, exception status |
| Architecture Drift Analysis | Technology drift, pattern drift |
| Custom Constraint Rules | Results of user-defined rules |
| Architecture Technical Debt Register | Known ATD, untracked ATD, metrics, trends |
| Findings & Remediation Plan | Prioritised by severity with owners and deadlines |
| Recommendations | Immediate, short-term, medium-term, governance |

---

## Conformance Scoring

| Rating | Criteria | Gate Decision |
|--------|----------|---------------|
| **CONFORMANT** | All checks PASS (or NOT ASSESSED) | ✅ Proceed |
| **CONFORMANT WITH EXCEPTIONS** | Some FAIL but LOW/MEDIUM with plans, >= 80% | ⚠️ Conditional proceed |
| **NON-CONFORMANT** | Any HIGH FAIL or < 80% | ❌ Block until resolved |

---

## Architecture Technical Debt Categories

| Category | Description |
|----------|-------------|
| DEFERRED-FIX | Known deficiency deferred to later phase |
| ACCEPTED-RISK | Risk consciously accepted as trade-off |
| WORKAROUND | Temporary solution deviating from intended pattern |
| DEPRECATED-PATTERN | Superseded pattern not yet migrated |
| SCOPE-REDUCTION | Quality/feature removed for timeline/budget |
| EXCEPTION | Approved principle exception with expiry |

---

## Relationship to Other Commands

```text
/arckit.health          Quick metadata scan (stale files, missing links)
         ↓
/arckit.conformance     Systematic decided-vs-designed check (this command)
         ↓
/arckit.analyze         Deep governance across all dimensions
```

- **/arckit.principles-compliance** provides RAG scoring with remediation plans; **conformance** does binary pass/fail constraint checking
- **/arckit.traceability** maps requirements to design; **conformance** maps decisions to design
- **/arckit.health** checks file freshness and metadata; **conformance** checks architectural integrity

---

## Checklist

- All accepted ADRs have corresponding design evidence.
- No superseded ADR patterns remain in current design.
- Review conditions from HLD/DLD reviews are resolved.
- Exceptions have valid expiry dates and remediation plans.
- Technology stack matches ADR decisions with no undocumented additions.
- Architecture patterns are consistently applied.
- Known technical debt is catalogued with owners and timelines.
- Custom rules (if defined) are satisfied.

---

## Tip

Run conformance checks after each design review cycle. The trend comparison (vs previous assessment) makes conformance drift visible over time — useful for governance boards and audit evidence.
