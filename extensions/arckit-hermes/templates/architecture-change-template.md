---
title: "Architecture Change Request"
docType: ACHG
templateVersion: "1.0"
---

# Architecture Change Request

## Document Control

| Field | Value |
|-------|-------|
| **Document ID** | `ARC-[PROJECT_ID]-ACHG-[ACHG_NUM]-v[VERSION]` |
| **Document Type** | Architecture Change Request |
| **Project** | `[PROJECT_NAME]` |
| **Change ID** | `ACHG-[ACHG_NUM]` |
| **Classification** | `[CLASSIFICATION]` |
| **Status** | DRAFT |
| **Change Type** | `[EVOLUTIONARY / TRANSFORMATIONAL / CORRECTIVE]` |
| **Priority** | `[CRITICAL / HIGH / MEDIUM / LOW]` |
| **Created Date** | `[YYYY-MM-DD]` |
| **Last Modified** | `[YYYY-MM-DD]` |
| **Review Date** | `[YYYY-MM-DD]` |
| **Owner** | `[OWNER_NAME_AND_ROLE]` |
| **Reviewed By** | `[REVIEWER_NAME]` |
| **Approved By** | `[APPROVER_NAME]` |
| **Distribution** | `[DISTRIBUTION_LIST]` |

### Revision History

| Version | Date | Author | Description | Reviewer | Approver |
|---------|------|--------|-------------|----------|----------|
| `[VERSION]` | `[YYYY-MM-DD]` | ArcKit AI | Initial creation from `/arckit:architecture-change` command | `[REVIEWER_NAME]` | `[APPROVER_NAME]` |

---

## 1. Change Request

| Field | Value |
|-------|-------|
| Change ID | `ACHG-[ACHG_NUM]` |
| Change Type | `[EVOLUTIONARY / TRANSFORMATIONAL / CORRECTIVE]` |
| Submitted By | `[NAME]` |
| Date | `[YYYY-MM-DD]` |
| Priority | `[CRITICAL / HIGH / MEDIUM / LOW]` |

---

## 2. Rationale

### 2.1 Business Driver

[Why this change is needed from a business perspective. What objective or problem is being addressed?]

### 2.2 Technical Driver

[Architectural reason for the change — performance, security, scalability, maintainability, or compliance]

### 2.3 Trigger

[What initiated this change request: audit finding, strategic shift, technology obsolescence, stakeholder request, incident response]

### 2.4 Change Description

[Detailed description of the proposed change, including scope boundaries and exclusions]

---

## 3. Impact Assessment

### 3.1 Capability Impact

| Capability | Impact | Detail |
|------------|--------|--------|
| [C-X.X.X: Capability Name] | [Enhanced/Modified/New/Retired] | [Description of impact] |
| [C-X.X.X: Capability Name] | [Enhanced/Modified/New/Retired] | [Description of impact] |

### 3.2 Application Impact

| Application | Impact | Detail |
|-------------|--------|--------|
| [Application Name] | [Enhanced/Modified/Replaced/Retired] | [Description of impact] |
| [Application Name] | [Enhanced/Modified/Replaced/Retired] | [Description of impact] |

### 3.3 Technology Impact

| Technology | Impact | Detail |
|------------|--------|--------|
| [Technology/Platform] | [Enhanced/Modified/Replaced/Retired] | [Description of impact] |
| [Technology/Platform] | [Enhanced/Modified/Replaced/Retired] | [Description of impact] |

### 3.4 Governance Impact

| Governance Area | Impact | Detail |
|-----------------|--------|--------|
| [Standards/Policy/Compliance] | [Changed/Unchanged/New] | [Description of impact] |
| [Standards/Policy/Compliance] | [Changed/Unchanged/New] | [Description of impact] |

---

## 4. Affected Artefacts

| Artefact | Impact Level | Action Required |
|----------|-------------|-----------------|
| `ARC-[PROJECT_ID]-BPCM-v[VERSION].md` | [HIGH / MEDIUM / LOW] | [Update / No change / New section] |
| `ARC-[PROJECT_ID]-STRAT-v[VERSION].md` | [HIGH / MEDIUM / LOW] | [Update / No change / New section] |
| `ARC-[PROJECT_ID]-APP-v[VERSION].md` | [HIGH / MEDIUM / LOW] | [Update / No change / New section] |
| `ARC-[PROJECT_ID]-TRANS-v[VERSION].md` | [HIGH / MEDIUM / LOW] | [Update / No change / New section] |
| `ARC-[PROJECT_ID]-ADMP-v[VERSION].md` | [HIGH / MEDIUM / LOW] | [Update / No change / New section] |

---

## 5. ADM Re-Entry Point

| ADM Phase | Re-Entry | Scope |
|-----------|----------|-------|
| Phase A (Architecture Vision) | [YES / NO] | [Scope of re-entry] |
| Phase B (Business Architecture) | [YES / NO] | [Scope of re-entry] |
| Phase C (Information Systems Architectures) | [YES / NO] | [Scope of re-entry] |
| Phase D (Technology Architecture) | [YES / NO] | [Scope of re-entry] |
| Phase E (Opportunities & Solutions) | [YES / NO] | [Scope of re-entry] |
| Phase F (Migration Planning) | [YES / NO] | [Scope of re-entry] |
| Phase G (Implementation Governance) | [YES / NO] | [Scope of re-entry] |
| Phase H (Architecture Change Management) | [YES / NO] | [Scope of re-entry] |

---

## 6. Cost/Benefit

| Item | Amount |
|------|--------|
| Implementation Cost (CAPEX) | `[£X]` |
| Ongoing Cost (OPEX/year) | `[£X/year]` |
| Expected Benefit (year 1) | `[£Y]` |
| Expected Benefit (annual) | `[£Y/year]` |
| Payback Period | `[Z months]` |
| 3-Year TCO | `[£X]` |

### UK Government Financial Considerations

| Item | Detail |
|------|--------|
| Spending Review Period | `[FY 2024/25 / FY 2025/26]` |
| G-Cloud Frame | `[Frame reference if applicable]` |
| TCoP Alignment | [Technology Code of Practice points addressed] |
| Reuse Opportunity | [Cross-government service reuse assessment] |

---

## 7. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| [Risk 1: Technical implementation risk] | [High/Medium/Low] | [High/Medium/Low] | [Mitigation strategy] |
| [Risk 2: Operational disruption risk] | [High/Medium/Low] | [High/Medium/Low] | [Mitigation strategy] |
| [Risk 3: Compliance/regulatory risk] | [High/Medium/Low] | [High/Medium/Low] | [Mitigation strategy] |
| [Risk 4: Financial risk] | [High/Medium/Low] | [High/Medium/Low] | [Mitigation strategy] |

---

## 8. Approval Workflow

| Stage | Owner | Decision | Date |
|-------|-------|----------|------|
| Submission | `[REQUESTER]` | Submitted | `[YYYY-MM-DD]` |
| Assessment | `[ARCHITECT]` | [Pending/Approved/Rejected/Conditional] | `[YYYY-MM-DD]` |
| Board Review | `[BOARD]` | [Pending/Approved/Rejected/Conditional] | `[YYYY-MM-DD]` |
| Approval | `[BOARD_CHAIR]` | [Pending/Approved/Rejected/Conditional] | `[YYYY-MM-DD]` |
| Implementation | `[TEAM]` | [Pending/Started/Complete] | `[YYYY-MM-DD]` |

---

## 9. Traceability

### Change-to-Artefact Traceability

| Source | Link | Target |
|--------|------|--------|
| `ARC-[PROJECT_ID]-BORD-v[VERSION].md` | → | `ACHG-[ACHG_NUM]` |
| `ACHG-[ACHG_NUM]` | → | [List of affected artefacts] |
| [ADR-XXX / STRAT / REQ] | → | `ACHG-[ACHG_NUM]` |

### Cross-References

| Reference | Type | Detail |
|-----------|------|--------|
| [ADR-XXX] | ADR | Related architecture decisions |
| [REQ-XXX] | Requirement | Requirements addressed by this change |
| [RISK-XXX] | Risk | Risks mitigated or created by this change |
| [ACHG-XXX] | Change Request | Related change requests |

### External References

| ID | Source | Relevance |
|----|--------|-----------|
| [ACHG-E1] | [External document name] | [What it contributed] |

---

**Generated by**: ArcKit `/arckit:architecture-change` command
**Generated on**: `[DATE] [TIME] GMT`
**ArcKit Version**: `{ARCKIT_VERSION}`
**Project**: `[PROJECT_NAME]` (Project `[PROJECT_ID]`)
**AI Model**: `[MODEL_NAME]`
**Generation Context**: [Brief note about source documents used]
