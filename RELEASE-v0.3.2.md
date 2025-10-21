# ArcKit v0.3.2 Release Notes

**Release Date:** 2025-10-21
**Release Type:** Patch Release (Command Enhancements)
**Previous Version:** v0.3.1

---

## 🎯 Release Focus: MOD Secure by Design Modernization & Enhanced Analysis

This patch release updates ArcKit to align with the current MOD Secure by Design framework (launched August 2023) and enhances the analysis command to provide comprehensive governance quality checks across all artifacts.

---

## 🔥 BREAKING CHANGE: MOD Secure by Design - RMADS Removed

### `/arckit.mod-secure` - Updated for August 2023 Framework

**What Changed:**
- **RMADS REMOVED**: Risk Management and Accreditation Documentation Set (RMADS) has been completely removed
- **Point-in-time accreditation REPLACED**: Now uses continuous assurance model
- **New terminology**: "Accreditation" → "Continuous assurance", "IAO/IAA" → "DTSL/SAC"

### CAAT (Cyber Activity and Assurance Tracker)

**New Mandatory Self-Assessment Tool:**

```
Discovery/Alpha Phase:
✅ Register on CAAT (MANDATORY for all programmes)
✅ Appoint Delivery Team Security Lead (DTSL)
✅ Complete initial self-assessment based on 7 SbD Principles

Beta Phase:
✅ Update CAAT self-assessment question sets
✅ Security governance review (not accreditation approval)

Live Phase:
✅ Continuously update CAAT throughout lifecycle
✅ Maintain continuous assurance (not one-time accreditation)
```

**Access:**
- Available through MOD Secure by Design portal
- Requires DefenceGateway account for industry partners
- Based on 7 SbD Principles question sets
- MODNET (S) version available in 2025

### New Roles and Responsibilities

**First Line of Defence:**
- **Delivery Team Security Lead (DTSL)**: Owns security for delivery team (REQUIRED from Discovery phase)
- **Security Assurance Coordinator (SAC)**: Supports DTSL (optional)
- **Project Security Officer (PSyO)**: Still required for SECRET+ systems

**Second Line:**
- Technical Coherence Assurance
- Security policies and standards
- Independent security reviews

**Third Line:**
- Independent audit (NAO, GIAA)
- Penetration testing by independent teams

### Terminology Changes

| Old (RMADS-based) | New (SbD Continuous Assurance) |
|-------------------|-------------------------------|
| Accreditation | Continuous assurance |
| Accreditation blockers | Deployment blockers |
| RMADS documentation submitted | CAAT self-assessment completed |
| Accreditation approval | Security governance review |
| IAO/IAA appointment | DTSL appointment |
| Point-in-time assessment | Continuous risk management |

### Supplier Attestation (ISN 2023/10)

**NEW REQUIREMENT for vendor-delivered systems:**
- Suppliers must attest that systems are secure
- Supplier-owned continuous assurance (not MOD accreditation)
- Supplier security requirements must be in contracts
- Contract includes CAAT self-assessment obligations

### Key Principles

**Cyber security is a "licence to operate":**
- Cannot be traded out or descoped
- SROs and capability owners are accountable (not delegated to accreditation authority)
- Delivery teams own security (First Line of Defence)
- Continuous improvement throughout lifecycle

### Resources Added

- **MOD Secure by Design portal**: https://www.digital.mod.uk/policy-rules-standards-and-guidance/secure-by-design
- **JSP 453**: Digital Policies and Standards for Defence
- **ISN 2023/09**: Industry Security Notice - Secure by Design Requirements
- **ISN 2023/10**: Industry Security Notice - Supplier attestation requirements

---

## 📊 Enhanced Analysis Command

### `/arckit.analyze` - Now Analyzes All v0.2.1-v0.3.1 Artifacts

**Previously analyzed:**
- Architecture principles
- Requirements
- Designs (HLD, DLD)
- UK Gov assessments (TCoP, AI Playbook, ATRS)
- Traceability matrix

**NEW artifacts analyzed in v0.3.2:**
- ✨ `stakeholder-drivers.md` (v0.2.1)
- ✨ `risk-register.md` (v0.3.0)
- ✨ `sobc.md` (v0.3.0)
- ✨ `data-model.md` (v0.3.1)
- ✨ `mod-secure-by-design.md` (updated this release)

### New Detection Passes

#### E. Stakeholder Traceability Analysis

**Checks if stakeholder-drivers.md exists:**

✅ **Stakeholder Coverage:**
- Requirements traced to stakeholder goals
- Orphan requirements (not linked to any stakeholder goal) - **CRITICAL**
- Requirements missing stakeholder justification

✅ **Conflict Resolution:**
- Requirement conflicts documented and resolved
- Stakeholder impact of conflict resolutions documented
- Decision authority identified

✅ **RACI Governance Alignment:**
- Risk owners from stakeholder RACI matrix
- Data owners from stakeholder RACI matrix
- Delivery roles aligned with RACI

**Missing Stakeholder Analysis:**
- Project has requirements but no stakeholder analysis → **MEDIUM** (RECOMMENDED to run `/arckit.stakeholders`)

#### F. Risk Management Analysis

**Checks if risk-register.md exists:**

✅ **Risk Coverage:**
- High/Very High inherent risks have mitigation requirements - **CRITICAL** if missing
- Risks reflected in design (controls in HLD/DLD)
- Risk owners assigned and aligned with RACI matrix
- Risk responses appropriate (4Ts: Tolerate, Treat, Transfer, Terminate)

✅ **Risk-SOBC Alignment** (if sobc.md exists):
- Strategic risks reflected in Strategic Case urgency
- Financial risks reflected in Economic Case cost contingency
- Risks from risk register included in Management Case Part E

✅ **Risk-Requirements Alignment:**
- Risk mitigation actions translated into requirements
- Security risks addressed by NFR-S-xxx requirements
- Compliance risks addressed by NFR-C-xxx requirements

**Missing Risk Assessment:**
- Project has requirements but no risk register → **MEDIUM** (RECOMMENDED to run `/arckit.risk`)

#### G. Business Case Alignment

**Checks if sobc.md exists:**

✅ **Benefits Traceability:**
- All benefits mapped to stakeholder goals - **CRITICAL** if missing
- All benefits supported by requirements - **CRITICAL** if missing
- Benefits measurable and verifiable - **HIGH** if not measurable
- Benefits realization plan in Management Case

✅ **Option Analysis Quality:**
- Do Nothing baseline included - **HIGH** if missing
- Options analysis covers build vs buy
- Recommended option justified by requirements scope
- Costs realistic for requirements complexity - **CRITICAL** if inadequate

✅ **SOBC-Requirements Alignment:**
- Strategic Case drivers reflected in requirements
- Economic Case benefits delivered by requirements
- Financial Case budget adequate for requirements scope
- Management Case delivery plan realistic

✅ **SOBC-Risk Alignment:**
- Risks from risk register included in Management Case Part E
- Cost contingency reflects financial risks
- Strategic risks justify urgency ("Why Now?")

**Missing Business Case:**
- Project has requirements but no SOBC → **MEDIUM** (RECOMMENDED for major investments to run `/arckit.sobc`)

#### H. Data Model Consistency

**Checks if data-model.md exists:**

✅ **DR-xxx Requirements Coverage:**
- All DR-xxx requirements mapped to entities - **CRITICAL** if missing
- All entities traced back to DR-xxx requirements
- Missing data requirements (system handles data but no DR-xxx)

✅ **Data Model-Design Alignment:**
- Database schemas in DLD match data model entities - **HIGH** if mismatch
- CRUD matrix aligns with component design in HLD - **HIGH** if misaligned
- Data integration flows in HLD match upstream/downstream mappings

✅ **Data Governance Alignment:**
- Data owners from stakeholder RACI matrix - **CRITICAL** if missing
- Data stewards and custodians assigned
- PII identified and GDPR compliance documented - **CRITICAL** if missing

✅ **Data Model Quality:**
- ERD exists and renderable (Mermaid syntax)
- Entities have complete attribute specifications
- Relationships properly defined (cardinality, foreign keys)
- Data quality metrics defined and measurable

**Missing Data Model:**
- Project has DR-xxx requirements but no data model → **MEDIUM** (RECOMMENDED to run `/arckit.data-model`)

#### J. MOD Secure by Design Compliance

**Checks if mod-secure-by-design.md exists:**

✅ **7 SbD Principles Assessment:**
- Principle 1: Understand and Define Context
- Principle 2: Apply Security from the Start
- Principle 3: Apply Defence in Depth
- Principle 4: Follow Secure Design Patterns
- Principle 5: Continuously Manage Risk
- Principle 6: Secure the Supply Chain
- Principle 7: Enable Through-Life Assurance

✅ **NIST Cybersecurity Framework Coverage:**
- **Identify**: Asset inventory, business environment, governance, risk assessment
- **Protect**: Access control, data security, protective technology, training
- **Detect**: Continuous monitoring, anomaly detection, security testing
- **Respond**: Incident response plan, communications to MOD CERT, analysis
- **Recover**: Recovery planning, backup/DR/BC, post-incident improvements

✅ **CAAT Continuous Assurance Process:**
- CAAT registered - **CRITICAL** if not registered (MANDATORY)
- CAAT self-assessment question sets completed
- CAAT continuously updated (not one-time)
- DTSL appointed - **CRITICAL** if missing (REQUIRED from Discovery)
- SAC appointed (if applicable)
- PSyO appointed for SECRET+ systems

✅ **Three Lines of Defence Implementation:**
- First Line: Delivery team owns security (DTSL)
- Second Line: Technical Coherence assurance
- Third Line: Independent audit (NAO, GIAA, pen testing)

✅ **Supplier Attestation** (if vendor-delivered):
- Suppliers attest systems are secure (ISN 2023/10) - **CRITICAL** if missing
- Supplier-owned continuous assurance
- Supplier security requirements in contracts

✅ **Classification-Specific Requirements:**
- OFFICIAL: Cyber Essentials baseline, basic access controls
- OFFICIAL-SENSITIVE: Cyber Essentials Plus, MFA, enhanced logging, DPIA
- SECRET: SC personnel, CESG crypto, air-gap/assured network
- TOP SECRET: DV personnel, compartmented security

**Critical Deployment Blockers:**
- CAAT not registered → **CRITICAL**
- No DTSL appointed → **CRITICAL**
- SECRET+ data without SC cleared personnel → **CRITICAL**
- No encryption at rest or in transit → **CRITICAL**
- Supplier attestation missing → **CRITICAL**

**Missing MOD SbD Assessment:**
- Project for MOD but no SbD assessment → **CRITICAL** (MANDATORY to run `/arckit.mod-secure`)

### Enhanced Report Structure

**NEW sections in analysis report:**

```markdown
## Stakeholder Traceability Analysis
- Requirements traced to stakeholder goals: 92%
- Orphan requirements: 3 (CRITICAL)
- Conflicts resolved: 85%

## Risk Management Analysis
- High/Very High risks mitigated: 85%
- Risk owners from RACI: 100%
- Risk-SOBC alignment: ✅ Yes

## Business Case Analysis
- Benefits traced to stakeholder goals: 95%
- Benefits measurable: 80% (2 benefits not measurable - HIGH)
- Budget adequacy: ✅ Adequate

## Data Model Analysis
- DR-xxx mapped to entities: 100%
- PII identified: ✅ Yes
- Data governance complete: 95%
- Data model-design alignment: ✅ Yes

## MOD Secure by Design Analysis
- 7 SbD Principles Score: 58/70 (83%)
- NIST CSF Coverage: 75%
- CAAT registered: ✅ Yes
- DTSL appointed: ✅ Yes
- Deployment Readiness: ⚠️ Issues to resolve
```

### Updated Metrics Dashboard

**NEW metric categories:**

```markdown
### Stakeholder Traceability
- Requirements traced to stakeholder goals: 92%
- Orphan requirements: 3
- Conflicts resolved: 85%
- RACI governance alignment: 100%
- **Stakeholder Score**: 92%

### Risk Management
- High/Very High risks mitigated: 85%
- Risk owners from RACI: 100%
- Risks reflected in design: 78%
- Risk-SOBC alignment: 100%
- **Risk Management Score**: 88%

### Business Case
- Benefits traced to stakeholder goals: 95%
- Benefits supported by requirements: 100%
- Benefits measurable: 80%
- Budget adequacy: ✅ Adequate
- **Business Case Score**: 92%

### Data Model
- DR-xxx mapped to entities: 100%
- Entities traced to DR-xxx: 100%
- PII identified: 100%
- Data governance complete: 95%
- Data model-design alignment: 100%
- **Data Model Score**: 99%

### MOD Compliance
- 7 SbD Principles Score: 58/70 (83%)
- NIST CSF Coverage: 75%
- CAAT registered and updated: ✅ Yes
- Three Lines of Defence: 85%
- **MOD SbD Score**: 81%

### Overall Governance Health
**Score**: 87%
**Grade**: B (Good governance, minor issues)
```

### New Severity Criteria

**CRITICAL** (added):
- Stakeholder: Orphan requirements (not linked to any stakeholder goal)
- Risk: High/Very High risks with no mitigation in requirements or design
- Risk: Risk owners not from stakeholder RACI matrix (governance gap)
- SOBC: Benefits not traced to stakeholder goals or requirements
- SOBC: Costs inadequate for requirements scope (budget shortfall)
- Data Model: DR-xxx requirements with no entity mapping
- Data Model: PII not identified (GDPR compliance failure)
- Data Model: Data owners not from stakeholder RACI matrix
- MOD: CAAT not registered (MANDATORY for all programmes)
- MOD: No DTSL appointed (required from Discovery phase)
- MOD: SECRET+ data without classification-specific controls
- MOD: Supplier attestation missing for vendor-delivered system

**HIGH** (added):
- Stakeholder: Requirement conflicts not documented or resolved
- Risk: Medium risks with no mitigation plan
- SOBC: Benefits not measurable or verifiable
- Data Model: Database schema in DLD doesn't match data model entities
- MOD: SbD Principles partially compliant with significant gaps

**MEDIUM** (added):
- Stakeholder: Missing stakeholder analysis (recommended to add)
- Risk: Missing risk register (recommended to add)
- SOBC: Missing business case (recommended for major investments)
- Data Model: Missing data model (recommended if DR-xxx exist)

### Example Output

**Before v0.3.2:**
```
Architecture Governance Analysis Report
15 findings (2 CRITICAL, 5 HIGH, 6 MEDIUM, 2 LOW)
85% requirements coverage
TCoP score 92/130 (71%)
Recommendation: Resolve 2 CRITICAL issues before procurement
```

**After v0.3.2:**
```
Architecture Governance Analysis Report
18 findings (3 CRITICAL, 6 HIGH, 7 MEDIUM, 2 LOW)
87% requirements coverage
92% stakeholder traceability
85% risk mitigation
TCoP score 98/130 (75%)
MOD SbD score 58/70 (83%)
Recommendation: Resolve 3 CRITICAL issues before procurement
  - 1 stakeholder orphan (BR-015 not linked to stakeholder goal)
  - 2 high risks unmitigated (R-005, R-012)
```

---

## 📦 Files Changed

**MOD Secure by Design:**
- `.claude/commands/arckit.mod-secure.md` (150 insertions, 58 deletions)
- `.codex/prompts/arckit.mod-secure.md`
- Tags updated: Added `continuous-assurance`, `caat`, `isn-2023-09`, `isn-2023-10`

**Analysis Command:**
- `.claude/commands/arckit.analyze.md` (1,130 insertions, 14 deletions)
- `.codex/prompts/arckit.analyze.md`

**Documentation:**
- `CHANGELOG.md` (v0.3.2 entry added)

---

## 🚀 Upgrade Guide

### For Existing MOD Projects

**If you have existing MOD SbD assessments with RMADS:**

1. **Re-run `/arckit.mod-secure`** to generate CAAT-based assessment:
   ```bash
   /arckit.mod-secure
   ```

2. **Key updates to make:**
   - Register on CAAT (if not already done)
   - Appoint DTSL (replace IAO/IAA references)
   - Update assessment from "accreditation" to "continuous assurance"
   - Remove RMADS documentation references
   - Add CAAT self-assessment completion status
   - Add supplier attestation (if vendor-delivered)

3. **Terminology to update in your documents:**
   - "Accreditation is mandatory" → "Continuous assurance is mandatory"
   - "Accreditation blockers" → "Deployment blockers"
   - "RMADS submitted" → "CAAT self-assessment completed"
   - "IAO/IAA" → "DTSL/SAC"

### For All Projects

**To take advantage of enhanced analysis:**

1. **Create recommended artifacts** (if missing):
   ```bash
   # If you haven't already:
   /arckit.stakeholders  # Analyze stakeholder drivers and conflicts
   /arckit.risk          # Create Orange Book risk register
   /arckit.sobc          # Create Green Book business case
   /arckit.data-model    # Create data model (if DR-xxx exist)
   ```

2. **Run enhanced analysis:**
   ```bash
   /arckit.analyze
   ```

3. **Review new sections:**
   - Stakeholder Traceability Analysis
   - Risk Management Analysis
   - Business Case Analysis
   - Data Model Analysis
   - MOD Secure by Design Analysis (if MOD project)

4. **Address new CRITICAL/HIGH issues** identified:
   - Orphan requirements (not linked to stakeholder goals)
   - High/Very High risks without mitigation
   - Benefits not traced to stakeholders or requirements
   - DR-xxx requirements not mapped to entities
   - PII not identified (GDPR risk)
   - CAAT not registered (MOD projects)

---

## 🐛 Bug Fixes

None in this release.

---

## 📈 Benefits

### For MOD Projects

✅ **Compliance with Current Framework**: Updated to August 2023 MOD SbD approach
✅ **No More RMADS**: Simplified documentation, continuous assurance replaces one-time accreditation
✅ **Clear Roles**: DTSL owns security (First Line of Defence)
✅ **CAAT Guidance**: Detailed instructions for mandatory self-assessment
✅ **Supplier Accountability**: Clear attestation requirements (ISN 2023/10)

### For All Projects

✅ **Comprehensive Governance Analysis**: Now analyzes 9 artifact types (was 5)
✅ **End-to-End Traceability**: Stakeholder → Driver → Goal → Risk → Benefit → Requirement → Entity → Design
✅ **Early Issue Detection**: 15 new CRITICAL/HIGH severity criteria
✅ **Governance Quality Score**: 10 metric categories (was 5)
✅ **Actionable Recommendations**: Specific findings with severity, location, and remediation

---

## 🔄 Migration from v0.3.1

No breaking changes for non-MOD projects.

**For MOD projects:**

| Action | Required? | Impact |
|--------|-----------|--------|
| Re-run `/arckit.mod-secure` | ✅ RECOMMENDED | Updates assessment to CAAT framework |
| Register on CAAT | ✅ MANDATORY | Required for all MOD programmes |
| Appoint DTSL | ✅ MANDATORY | Required from Discovery phase |
| Update terminology in docs | ⚠️ RECOMMENDED | "Accreditation" → "Continuous assurance" |
| Obtain supplier attestation | ✅ MANDATORY | If vendor-delivered system |

---

## 📦 Installation

### New Projects

```bash
# Install ArcKit CLI
pip install git+https://github.com/tractorjuice/arc-kit.git

# Or with uv
uv tool install arckit-cli --from git+https://github.com/tractorjuice/arc-kit.git

# Initialize project
arckit init my-project --ai claude
cd my-project
```

### Existing Projects

```bash
# Pull latest from arc-kit repository
cd your-arckit-project
git pull

# Or reinitialize with latest version
arckit init . --ai claude --force
```

---

## 🔗 Resources

**MOD Secure by Design:**
- https://www.digital.mod.uk/policy-rules-standards-and-guidance/secure-by-design
- JSP 440: https://www.gov.uk/government/publications/jsp-440-defence-information-assurance
- JSP 453: https://www.digital.mod.uk/policy-rules-standards-and-guidance
- NCSC Secure Design Principles: https://www.ncsc.gov.uk/collection/cyber-security-design-principles

**HM Treasury Frameworks:**
- Green Book (Business Cases): https://www.gov.uk/government/publications/the-green-book-appraisal-and-evaluation-in-central-governent
- Orange Book (Risk Management): https://www.gov.uk/government/publications/orange-book

**Data Protection:**
- ICO GDPR Guidance: https://ico.org.uk/for-organisations/guide-to-data-protection/
- Data Protection Act 2018: https://www.legislation.gov.uk/ukpga/2018/12/contents

---

## 📝 Full Changelog

See [CHANGELOG.md](CHANGELOG.md) for complete version history.

---

**Full Release:** v0.3.2
**Tag:** `v0.3.2`
**Previous Release:** [v0.3.1](https://github.com/tractorjuice/arc-kit/releases/tag/v0.3.1)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
