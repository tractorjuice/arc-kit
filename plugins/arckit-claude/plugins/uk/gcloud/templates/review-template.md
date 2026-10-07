# G-Cloud Submission Review: [SERVICE_NAME]

> **Template Origin**: Official | **ArcKit Version**: [VERSION] | **Command**: `/arckit-uk-gcloud:review`

**G-Cloud Lot**: [Lot 1a — Infrastructure as a Service (IaaS) and Platform as a Service (PaaS) / Lot 1b — IaaS and PaaS above OFFICIAL / Lot 2a — Infrastructure Software as a Service (iSaaS) / Lot 2b — Software as a Service (SaaS) / Lot 3 — Cloud Support]

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time per _partials/RENDERING.md. -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [DATE] | ArcKit AI | Initial creation from `/arckit-uk-gcloud:review` command | [PENDING] | [PENDING] |

> G-Cloud 15 (RM1557.15) pre-submission readiness review of a supplier's service pack, before
> submission to GCA (the Government Commercial Agency, formerly CCS).
> Every finding cites the `ARC-` ID of the document it concerns, so it can be fixed at source.

---

## 1. Review Scope

| Field | Value |
|-------|-------|
| **Service** | [SERVICE_NAME] (Project [PROJECT_ID]) |
| **Lot** | [1a / 1b / 2a / 2b / 3] — [lot name, as on the service design's **G-Cloud Lot** line] |
| **Lot questions** | `ARC-000-LOTQ`, Part [1 (Lots 1a/1b) / 2 (Lots 2a/2b) / 3 (Lot 3)] |
| **Framework** | G-Cloud 15 (RM1557.15) |
| **Review date** | [DATE] |
| **Review scope** | [Full / Completeness / Consistency / Readiness] |
| **Submission deadline** | [DATE or PENDING] |

---

## 2. Overall Status

**Status**: [🟢 READY / 🟡 NEEDS WORK / 🔴 NOT READY]

[One paragraph: what would happen if this pack were submitted today.]

| Gate | Result |
|------|--------|
| All mandatory documents present, including social value and the lot's lot questions | [✅/❌] |
| Lot is valid (1a, 1b, 2a, 2b or 3) and the same in every document | [✅/❌] |
| All mandatory fields complete (no `[PENDING]` or placeholder text) | [✅/❌] |
| Social value complete: contact named, at least one activity, evidence for each | [✅/❌] |
| Lot questions answered; the certificates the bid needs held (Lots 1a/1b: ISO 9001, 27001, 20000-1, ISO 27018 with public cloud, Carbon Reduction Plan) | [✅/❌] |
| Pricing follows the lot's rules, with no forbidden pricing | [✅/❌] |
| No blocking consistency conflicts | [✅/❌] |
| All entries within character and word limits, including scored answers | [✅/❌] |
| All claimed evidence verifiable | [✅/❌] |

- 🟢 READY: every gate passes. "Should Fix" items may remain.
- 🟡 NEEDS WORK: every mandatory document exists, but at least one gate fails.
- 🔴 NOT READY: a mandatory document is missing, the lot is invalid, social value is incomplete, a
  certificate the bid needs is not held, or a mandatory declaration question is unanswered. A missing
  Cyber Essentials or Cyber Essentials Plus certificate is a call-off warning, not a gate: it is
  mandatory for call-off contracts, not for the bid.

Every ❌ gate produces at least one "Must Fix" action.

---

## 3. Document Completeness

| Document | ARC-ID | Status | Issues |
|----------|--------|--------|--------|
| Supplier Profile | `ARC-000-SUPP` | [✅/🟡/❌] | [-] |
| Social Value Commitments | `ARC-000-SOCV` | [✅/🟡/❌] | [-] |
| Lot Questions (Part [1/2/3]) | `ARC-000-LOTQ` | [✅/🟡/❌] | [-] |
| Supplier Declaration | `ARC-000-DECL` | [✅/🟡/❌] | [-] |
| Service Design | `ARC-[PROJECT_ID]-SVCD` | [✅/🟡/❌] | [-] |
| Service Definition (SDD) | `ARC-[PROJECT_ID]-SDD` | [✅/🟡/❌] | [-] |
| Pricing | `ARC-[PROJECT_ID]-PRIC` | [✅/🟡/❌] | [-] |
| Lot 3 Rate Card (supplier-wide; Lot 3 only) | `ARC-000-RATE` | [✅/🟡/❌ / Not this lot] | [-] |
| Security Evidence | `ARC-[PROJECT_ID]-SECA` | [✅/🟡/❌] | [-] |

**Missing documents**: [list each with the command that creates it, or "None". The SDD comes from
the lot's own command: `/arckit-uk-gcloud:sdd-lot1a`, `sdd-lot1b`, `sdd-lot2a`, `sdd-lot2b` or `sdd-lot3`]

---

## 4. Mandatory Field Status

| Measure | Count |
|---------|-------|
| Complete | [X] / [Y] |
| Incomplete (`[PENDING]`, placeholder or empty) | [X] |
| Invalid (wrong format or value) | [X] |

### Incomplete or Invalid Fields

| ARC-ID | Field | Problem | Fix |
|--------|-------|---------|-----|
| `ARC-[PROJECT_ID]-SDD` | [Field name] | [Empty / `[PENDING]` / placeholder left in / wrong format] | [Value needed, or command to re-run] |

---

## 5. Consistency Issues

Conflicts between two documents in the pack. Name both `ARC-` IDs — a conflict has two sides and fixing the wrong one leaves the pack still inconsistent.

| # | Issue | Documents in conflict | Resolution |
|---|-------|-----------------------|------------|
| 1 | [What disagrees] | `ARC-...` vs `ARC-...` | [Which is correct and why] |

**SDD ↔ pricing cross-checks:**

| Check | Result |
|-------|--------|
| Education discount: SDD answer = `ARC-[PROJECT_ID]-PRIC` §5.1 | [✅ / ❌ / Not asked] |
| Free trial (1a/1b, 2a/2b): SDD answer, description and link = `ARC-[PROJECT_ID]-PRIC` §5.2 | [✅ / ❌ / Not asked on Lot 3] |
| 1a/1b: deployment models priced (`ARC-[PROJECT_ID]-PRIC` §2.1) = models ticked in the SDD | [✅ / ❌ / Not this lot] |
| Lot 3: every SDD role level on `ARC-000-RATE`; no rates in the SDD; PRIC §4 names the card's current version | [✅ / ❌ / Not this lot] |
| Lot-wide figures the same across the supplier's services in this lot | [✅ / ❌ / Only service in the lot] |

*If nothing conflicts, write "No consistency issues found." rather than omitting the section.*

---

## 6. Character and Word-Limit Status

Limits: service name ≤ 100 characters; description ≤ 500 characters; features and benefits ≤ 10
items each, each ≤ 10 words; system requirements (1a/1b, 2a/2b) and what's backed up (1a/1b) ≤ 10
words each. Lots 1a/1b scored answers: ≤ 250 words for each part (Quality Cloud Services parts a–b,
500 words in all; Maximising Buyer Value parts a–c, 750 words in all); customer contractual exit
procedure and change of service ≤ 250 words each. Every other free-text answer has the 50, 100 or
200-word limit on its `**Words:**` line in the SDD (inferred from the live listings; tabulated in
`framework-questions.md`), recounted by the review; "What the … doesn't cover" answers in the lot
questions ≤ 200 words; free trial description ≤ 50 words.

| Measure | Count |
|---------|-------|
| Within limits | [X] / [Y] |
| Exceeding limits | [X] |

### Entries Over Limit

| ARC-ID | Field | Limit | Actual | Over by |
|--------|-------|-------|--------|---------|
| `ARC-[PROJECT_ID]-SVCD` | [Field] | [N chars / N words] | [N] | [N] |
| `ARC-[PROJECT_ID]-SDD` | [Field] | [N chars / N words] | [N] | [N] |
| `ARC-[PROJECT_ID]-SDD` | [N.N Question] | [50 / 100 / 200 words] | [N] | [N] |
| `ARC-000-LOTQ` | [Scored answer part] | [250 words] | [N] | [N] |

*If every entry is within its limit, write "All entries within limits."*

---

## 7. Evidence Status

Claims in the pack that a buyer or GCA (formerly CCS) could ask you to substantiate.

| Measure | Count |
|---------|-------|
| Verified | [X] / [Y] |
| Missing | [X] |

| ARC-ID | Claim | Evidence required | Held? |
|--------|-------|-------------------|-------|
| `ARC-[PROJECT_ID]-SECA` | [e.g. ISO 27001 certified] | [Certificate number and expiry] | [✅/❌] |
| `ARC-000-LOTQ` | [e.g. Cyber Essentials Plus (1a/1b) or Cyber Essentials (2a/2b, 3)] | [Certificate number; Plus awarded within 12 months] | [✅/❌] |
| `ARC-000-SOCV` | [e.g. Policy Outcome 6 measure] | [Evidence of the commitment] | [✅/❌] |

---

## 8. Common Rejection Reasons Checked

| Reason | Applies? | Detail |
|--------|----------|--------|
| Lot missing or not one of 1a, 1b, 2a, 2b, 3 | [✅ Clear / ⚠️ Risk] | [-] |
| Service does not meet the lot definition | [✅ Clear / ⚠️ Risk] | [-] |
| Social value missing or incomplete (pass/fail; a fail loses the whole 10%) | [✅ Clear / ⚠️ Risk] | [-] |
| Lot questions for the service's lot missing, unanswered or over their word limits | [✅ Clear / ⚠️ Risk] | [-] |
| Certificate the bid needs not held (1a/1b: ISO 9001, 27001, 20000-1, Carbon Reduction Plan, ISO 27018 with public cloud) | [✅ Clear / ⚠️ Risk] | [-] |
| Call-off warning: Cyber Essentials Plus (1a/1b) or Cyber Essentials (2a/2b, 3) not held. Mandatory for call-off contracts, not for the bid | [✅ Clear / ⚠️ Warning] | [Alternative chosen] |
| Pricing document missing (Lots 1a/1b and 2a/2b; optional on Lot 3, where the rate card carries the prices and 71% of the 27,496 live listings have one) | [✅ Clear / ⚠️ Risk] | [-] |
| Forbidden pricing ("price on application", "from £x", unexplained ranges) or prices in the service definition document | [✅ Clear / ⚠️ Risk] | [-] |
| Lot 3: the supplier rate card (`ARC-000-RATE`) missing, a rate below £50, or a role level this service needs not on it | [✅ Clear / ⚠️ Risk] | [-] |
| Mandatory declaration question unanswered or `[PENDING]` | [✅ Clear / ⚠️ Risk] | [-] |
| Service name, description or features/benefits exceed limits, or the name carries extra keywords | [✅ Clear / ⚠️ Risk] | [-] |
| Claimed certification not held or expired | [✅ Clear / ⚠️ Risk] | [-] |
| `[PENDING]` or placeholder text remaining (e.g. "[TO BE COMPLETED]") | [✅ Clear / ⚠️ Risk] | [-] |
| "N/A" where an answer is actually required | [✅ Clear / ⚠️ Risk] | [-] |
| Contradictory statements | [✅ Clear / ⚠️ Risk] | [-] |
| Unsubstantiated claims or marketing hyperbole | [✅ Clear / ⚠️ Risk] | [-] |
| Competitor mentions | [✅ Clear / ⚠️ Risk] | [-] |
| Pricing not in GBP | [✅ Clear / ⚠️ Risk] | [-] |
| Documents not ODF or PDF/A, over 5 MB, or not accessible | [✅ Clear / ⚠️ Risk] | [-] |
| Invalid URLs or contact details | [✅ Clear / ⚠️ Risk] | [-] |

---

## 9. Actions Required

### Must Fix (Blocking)

| # | Action | ARC-ID | Command to re-run |
|---|--------|--------|-------------------|
| 1 | [Action] | `ARC-...` | [command to re-run] |

### Should Fix (Recommended)

| # | Action | ARC-ID |
|---|--------|--------|
| 1 | [Action] | `ARC-...` |

### Nice to Have

| # | Action | ARC-ID |
|---|--------|--------|
| 1 | [Action] | `ARC-...` |

*Write "None" under a heading with no actions rather than omitting it. Leave genuinely-unknown values as `[PENDING]` rather than inventing them.*

---

## External References

Sources fetched while running this review — GCA framework guidance, lot definitions, certification registers.

### Document Register

| Doc ID | Source | Category | Retrieved |
|--------|--------|----------|-----------|
| [WEB-1] | [URL] | [GCA guidance / Certification register] | [DATE] |

### Citations

| Citation ID | Doc ID | Page/Section | Quoted Passage |
|-------------|--------|--------------|----------------|
| [WEB-1-C1] | [WEB-1] | [Section] | [Quoted passage] |

### Unreferenced Documents

| Doc ID | Reason not cited |
|--------|------------------|
| [WEB-N] | [Reviewed, nothing material] |

---

**Generated by**: ArcKit `/arckit-uk-gcloud:review` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
