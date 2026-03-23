# Government Reuse Assessment: [PROJECT_NAME]

> **Template Origin**: Official | **ArcKit Version**: [VERSION] | **Command**: `/arckit.gov-reuse`

## Document Control

| Field | Value |
|-------|-------|
| **Document ID** | ARC-[PROJECT_ID]-GOVR-v[VERSION] |
| **Document Type** | Government Reuse Assessment |
| **Project** | [PROJECT_NAME] (Project [PROJECT_ID]) |
| **Classification** | [PUBLIC / OFFICIAL / OFFICIAL-SENSITIVE / SECRET] |
| **Status** | [DRAFT / IN_REVIEW / APPROVED / PUBLISHED / SUPERSEDED / ARCHIVED] |
| **Version** | [VERSION] |
| **Created Date** | [YYYY-MM-DD] |
| **Last Modified** | [YYYY-MM-DD] |
| **Review Cycle** | [Monthly / Quarterly / Annual / On-Demand] |
| **Next Review Date** | [YYYY-MM-DD] |
| **Owner** | [OWNER_NAME_AND_ROLE] |
| **Reviewed By** | [REVIEWER_NAME] ([YYYY-MM-DD]) or PENDING |
| **Approved By** | [APPROVER_NAME] ([YYYY-MM-DD]) or PENDING |
| **Distribution** | [DISTRIBUTION_LIST] |

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [DATE] | ArcKit AI | Initial creation from `/arckit.gov-reuse` agent | PENDING | PENDING |

---

## Executive Summary

### Search Scope

[Describe the capabilities searched for across government repositories, including search platforms used (GOV.UK GitHub organisations, code.gov equivalents, GitLab, etc.) and the project context driving the search.]

**Capabilities Assessed**: [X] capability areas across [Y] government organisations

**Repositories Evaluated**: [Z] repositories reviewed, [W] shortlisted for detailed assessment

### Key Findings

| Capability | Best Candidate | Organisation | Reuse Strategy | Effort Saved |
|------------|---------------|--------------|----------------|--------------|
| [Capability 1] | [Repo Name] | [Organisation] | [Direct reuse / Fork / Adapt] | [X person-days] |
| [Capability 2] | [Repo Name] | [Organisation] | [Direct reuse / Fork / Adapt] | [X person-days] |
| [Capability 3] | [Repo Name] | [Organisation] | [Direct reuse / Fork / Adapt] | [X person-days] |
| [Capability 4] | None found | — | Build new | — |

### Reuse Summary

**Total Estimated Effort Saved**: [X person-days / X person-months]

**Reuse Coverage**: [X]% of required capabilities have government code candidates

**Recommended Approach**: [Brief narrative on overall reuse strategy]

---

## Capability Analysis

### Capability 1: [CAPABILITY_NAME]

**Requirements Addressed**: [BR-001, FR-005, NFR-SEC-002]

**Search Terms Used**: [search queries used to find candidates]

---

#### Candidate: [REPOSITORY_NAME]

| Attribute | Value |
|-----------|-------|
| **Organisation** | [Government Organisation] |
| **Repository URL** | [https://github.com/organisation/repo] |
| **Language** | [Primary language(s)] |
| **License** | [MIT / Apache 2.0 / OGL v3.0 / Crown Copyright] |
| **Last Activity** | [YYYY-MM-DD] |
| **Stars** | [X] |
| **Contributors** | [X] |
| **Documentation** | [Good / Adequate / Sparse / None] |

**Description**: [What this repository does and why it is relevant]

**Reusability Assessment**:

| Criteria | Score (1-5) | Notes |
|----------|-------------|-------|
| **License Compatibility** | [1-5] | [OGL v3.0 / MIT / Apache 2.0 — compatible with project needs?] |
| **Code Quality** | [1-5] | [Test coverage, code style, maintainability indicators] |
| **Documentation Quality** | [1-5] | [README, API docs, deployment guides present?] |
| **Tech Stack Alignment** | [1-5] | [Does it match project tech choices?] |
| **Activity / Maintenance** | [1-5] | [Recent commits, open issues addressed, active community?] |
| **Overall** | **[Avg]** | |

**Recommended Strategy**: [Direct reuse / Fork and adapt / Use as reference / Discard]

**Estimated Effort Saved**: [X person-days if reused vs built from scratch]

**Key Considerations**:

- [Consideration 1: e.g., Requires upgrade from Python 3.8 to 3.12]
- [Consideration 2: e.g., Missing authentication module — must add]
- [Consideration 3: e.g., Tested in GDS infrastructure, may need adaptation]

---

#### Candidate: [ALTERNATIVE_REPOSITORY_NAME]

[Repeat candidate card structure for additional candidates]

---

### Capability 2: [ANOTHER_CAPABILITY_NAME]

[Repeat capability analysis structure for each capability]

---

## License Compatibility Matrix

| Repository | License | Commercial Use | Modification | Distribution | Attribution | Compatible |
|------------|---------|---------------|--------------|--------------|-------------|------------|
| [Repo 1] | MIT | ✅ | ✅ | ✅ | Required | ✅ Yes |
| [Repo 2] | Apache 2.0 | ✅ | ✅ | ✅ | Required | ✅ Yes |
| [Repo 3] | OGL v3.0 | ✅ | ✅ | ✅ | Required | ✅ Yes |
| [Repo 4] | GPL v3 | ⚠️ | ✅ | ⚠️ Copyleft | Required | ⚠️ Review |
| [Repo 5] | Proprietary | ❌ | ❌ | ❌ | — | ❌ No |

**Notes**: [Any specific licensing guidance for this project, e.g., Crown Copyright considerations]

---

## Tech Stack Alignment

| Repository | Language | Framework | Infrastructure | Aligns With Project | Adaptation Needed |
|------------|----------|-----------|----------------|---------------------|-------------------|
| [Repo 1] | Python 3.12 | Django | AWS | ✅ Yes | Minor config changes |
| [Repo 2] | Node.js 20 | Express | GCP | ⚠️ Partial | Container adaptation |
| [Repo 3] | Ruby 3.2 | Rails | Heroku | ❌ No | Full rewrite needed |

**Project Tech Stack**: [List the project's chosen languages, frameworks, and infrastructure]

---

## Gap Analysis

| Capability | Status | Notes | Recommended Action |
|------------|--------|-------|--------------------|
| [Capability 1] | ✅ Reusable | Strong candidate found — [Repo Name] | Fork and integrate |
| [Capability 2] | ⚠️ Partial | Candidate covers 60% of requirements | Adapt [Repo Name] + fill gaps |
| [Capability 3] | ✅ Reusable | Direct reuse possible with minor config | Use [Repo Name] as-is |
| [Capability 4] | ❌ No match | No suitable government code found | Build new component |
| [Capability 5] | ⚠️ Partial | Outdated — last commit 18 months ago | Fork and modernise |

**Legend**: ✅ Reusable &nbsp;|&nbsp; ⚠️ Partial &nbsp;|&nbsp; ❌ No match

---

## Recommendations

### Reuse Strategy Summary

[2-3 paragraph narrative summarising the overall recommended approach to reuse, explaining which candidates are most valuable, the level of adaptation required, and how reuse supports the project timeline and budget goals.]

### Implementation Priority

| Priority | Repository | Capability | Action | Estimated Effort | Timeline |
|----------|------------|------------|--------|-----------------|----------|
| 1 | [Repo Name] | [Capability] | [Fork / Integrate / Configure] | [X days] | [Sprint X] |
| 2 | [Repo Name] | [Capability] | [Fork / Integrate / Configure] | [X days] | [Sprint Y] |
| 3 | [Repo Name] | [Capability] | [Fork / Integrate / Configure] | [X days] | [Sprint Z] |
| 4 | — | [Capability] | Build new | [X days] | [Sprint W] |

### Risk Considerations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Candidate repository abandoned before integration complete | Medium | High | Pin to specific commit; plan for fallback build |
| License incompatibility discovered post-fork | Low | High | Legal review before deep integration |
| Tech stack divergence requires significant adaptation | Medium | Medium | Spike/prototype before committing to reuse |
| Upstream breaking changes after fork | Low | Medium | Evaluate upstream dependency management strategy |

---

## External References

| Document | Type | Source | Key Extractions | Path |
|----------|------|--------|-----------------|------|
| *None provided* | — | — | — | — |

---

**Generated by**: ArcKit `/arckit.gov-reuse` agent
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
