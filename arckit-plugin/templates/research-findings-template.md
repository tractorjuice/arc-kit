# Technology and Service Research: [PROJECT_NAME]

> **Template Status**: Beta | **Version**: [VERSION] | **Command**: `/arckit.research`

## Document Control

| Field | Value |
|-------|-------|
| **Document ID** | ARC-[PROJECT_ID]-RSCH-v[VERSION] |
| **Document Type** | Technology and Service Research |
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
| [VERSION] | [DATE] | ArcKit AI | Initial creation from `/arckit.research` agent | PENDING | PENDING |

---

## Executive Summary

### Research Scope

This document presents research findings for technology, services, and products that can meet the requirements documented in `ARC-{PROJECT_ID}-REQ-v*.md`. It provides build vs buy analysis and vendor recommendations for procurement decisions.

**Requirements Analyzed**: [X] functional, [Y] non-functional, [Z] integration, [W] data requirements

**Research Categories Identified**: [X] categories based on requirement analysis

**Research Approach**: [Market research, vendor evaluation, UK Government Digital Marketplace search, open source assessment]

### Key Findings

[3-5 bullet points summarizing the most important findings]

- **[Category]**: [Recommendation] - [Key reason]
- **[Category]**: [Recommendation] - [Key reason]
- **[Category]**: [Recommendation] - [Key reason]

### Build vs Buy Summary

| Approach | Categories | Total 3-Year TCO | Rationale |
|----------|-----------|------------------|-----------|
| **BUILD** (Custom Development) | [X] categories | £[X] | [Key reason] |
| **BUY** (Commercial SaaS) | [Y] categories | £[Y] | [Key reason] |
| **ADOPT** (Open Source) | [Z] categories | £[Z] | [Key reason] |
| **GOV.UK Platforms** (if applicable) | [W] categories | £[W] | [Key reason] |
| **TOTAL** | [Total] categories | **£[TOTAL]** | Blended approach |

### Top Recommended Vendors

**Shortlist for further evaluation**:

1. **[Vendor/Product 1]** for [Category]: [Key strengths]
2. **[Vendor/Product 2]** for [Category]: [Key strengths]
3. **[Vendor/Product 3]** for [Category]: [Key strengths]

### Requirements Coverage

- ✅ **[X%]** of requirements have identified solutions
- ⚠️ **[Y]** requirements need custom development (no suitable off-the-shelf)
- 🔍 **[Z]** requirements need further research or clarification

---

## Research Categories

> **Note**: Research categories are dynamically identified based on project requirements, not a fixed list.

---

## Category 1: [CATEGORY_NAME]

**Requirements Addressed**: [List requirement IDs: FR-001, FR-015, NFR-SEC-003]

**Why This Category**: [Explain why this capability is needed based on requirements]

---

### Option 1A: Build Custom Solution

**Description**: [What would be built]

**Technology Stack**: [Languages, frameworks, libraries]

**Effort Estimate**:
- **Development**: [X] person-months
- **Skills Required**: [Backend, frontend, DevOps, etc.]
- **Timeline**: [X] months to production-ready

**Cost Breakdown**:
| Cost Item | Year 1 | Year 2 | Year 3 | Notes |
|-----------|--------|--------|--------|-------|
| Development | £[X] | £0 | £0 | [Rate] × [person-months] |
| Infrastructure | £[Y] | £[Y] | £[Y] | Cloud hosting |
| Maintenance (30% of dev) | £[Z] | £[Z] | £[Z] | Bug fixes, updates |
| **Total** | **£[T1]** | **£[T2]** | **£[T3]** | |
| **3-Year TCO** | | | **£[TOTAL]** | |

**Pros**:
- ✅ [Benefit 1]
- ✅ [Benefit 2]
- ✅ [Benefit 3]

**Cons**:
- ❌ [Drawback 1]
- ❌ [Drawback 2]
- ❌ [Drawback 3]

**Risks**:
- [Risk 1]: [Mitigation]
- [Risk 2]: [Mitigation]

**When to Build**:
- Unique competitive advantage or IP
- No suitable commercial products exist
- Long-term TCO favors build over SaaS subscriptions
- Full control required for security/compliance

---

### Option 1B: Buy - [VENDOR_NAME / PRODUCT_NAME]

**Description**: [What the product does, key features]

**Vendor**: [Vendor name, headquarters, founded year]

**Pricing Model**: [Per user, per transaction, tiered, usage-based]

**Cost Breakdown**:
| Cost Item | Year 1 | Year 2 | Year 3 | Notes |
|-----------|--------|--------|--------|-------|
| Setup/onboarding | £[X] | £0 | £0 | One-time |
| Subscription | £[Y] | £[Y] × 1.1 | £[Y] × 1.2 | [Tier], 10% annual increase |
| Integration | £[Z] | £0 | £0 | [X] person-weeks |
| Training | £[W] | £0 | £0 | User training |
| **Total** | **£[T1]** | **£[T2]** | **£[T3]** | |
| **3-Year TCO** | | | **£[TOTAL]** | |

**Pricing Tiers**:
- **Starter**: £[X]/month - [Features, limits]
- **Professional**: £[Y]/month - [Features, limits]
- **Enterprise**: £[Z]/month - [Features, limits, SLA]

**Estimated Tier for This Project**: [Tier name] based on [usage projection]

**Pros**:
- ✅ [Benefit 1]
- ✅ [Benefit 2]
- ✅ [Benefit 3]

**Cons**:
- ❌ [Limitation 1]
- ❌ [Limitation 2]
- ❌ [Limitation 3]

**Key Features**:
- [Feature 1]: [Description]
- [Feature 2]: [Description]
- [Feature 3]: [Description]

**Integration**:
- **APIs**: REST, GraphQL, webhooks
- **SDKs**: JavaScript, Python, Ruby, Go
- **Authentication**: OAuth 2.0, API keys
- **Documentation**: [Quality rating: Excellent/Good/Fair/Poor]

**Compliance & Security**:
- ✅ GDPR compliant
- ✅ ISO 27001 certified
- ✅ SOC 2 Type II
- ✅ UK data residency available
- ✅ Encryption at rest and in transit

**Vendor Maturity**:
- **Founded**: [Year]
- **Funding**: [Series X, $YM raised] OR [Public company]
- **Customers**: [Notable customers or customer count]
- **Market Position**: [Leader, challenger, niche]
- **Financial Stability**: [Strong/Moderate/Weak]

**Support**:
- **Support Tiers**: Email, chat, phone, dedicated support engineer
- **SLA**: [Uptime guarantee, response times]
- **Community**: [Active community, forum, Stack Overflow]

**Exit Strategy**:
- **Data Export**: [CSV, JSON, API export]
- **Migration Effort**: [Estimated person-weeks to migrate away]
- **Lock-in Risk**: [LOW | MEDIUM | HIGH]

**References**:
- [Customer case study 1]
- [Customer case study 2]
- [G2/Gartner rating]

---

### Option 1C: Buy - [ANOTHER_VENDOR / PRODUCT]

[Repeat structure for second commercial option]

---

### Option 1D: Adopt - [OPEN_SOURCE_PROJECT]

**Description**: [What it does, key features]

**Project Details**:
- **License**: [MIT, Apache 2.0, GPL, AGPL]
- **GitHub**: [URL, star count, fork count]
- **Maturity**: [Mature/Stable/Emerging/Experimental]
- **Last Release**: [Date]
- **Commit Activity**: [Active/Moderate/Slow]
- **Contributors**: [X] contributors

**Hosting Options**:
- **Self-hosted**: Deploy on own infrastructure
- **Managed Service**: [If available, e.g., Redis Labs for Redis]

**Cost Breakdown** (Self-hosted):
| Cost Item | Year 1 | Year 2 | Year 3 | Notes |
|-----------|--------|--------|--------|-------|
| Infrastructure | £[X] | £[X] | £[X] | Cloud hosting (EC2, RDS, etc.) |
| Setup | £[Y] | £0 | £0 | [X] person-weeks |
| Maintenance | £[Z] | £[Z] | £[Z] | [Y] person-weeks/year for updates, patches |
| Commercial Support (optional) | £[W] | £[W] | £[W] | If purchasing support |
| **Total** | **£[T1]** | **£[T2]** | **£[T3]** | |
| **3-Year TCO** | | | **£[TOTAL]** | |

**Cost Breakdown** (Managed Service):
| Cost Item | Year 1 | Year 2 | Year 3 | Notes |
|-----------|--------|--------|--------|-------|
| Managed Service Subscription | £[X] | £[X] | £[X] | [Provider] managed hosting |
| Setup/Integration | £[Y] | £0 | £0 | [X] person-weeks |
| **Total** | **£[T1]** | **£[T2]** | **£[T3]** | |
| **3-Year TCO** | | | **£[TOTAL]** | |

**Pros**:
- ✅ [Benefit 1]
- ✅ [Benefit 2]
- ✅ [Benefit 3]

**Cons**:
- ❌ [Limitation 1]
- ❌ [Limitation 2]
- ❌ [Limitation 3]

**Technical Considerations**:
- **Skills Required**: [Technologies team needs to know]
- **Operational Burden**: [Backup, monitoring, scaling, patching]
- **Community Support**: [Stack Overflow questions, Discord/Slack community]
- **Commercial Support Available**: [Company offering paid support, SLA, cost]

**License Considerations**:
- [License name and key terms]
- [Any restrictions on commercial use, modifications, redistribution]
- [Copyleft requirements if GPL/AGPL]

**Maturity Assessment**:
- [Production-ready OR needs additional work]
- [Used by major companies: list examples]
- [Security track record: CVE history]

---

### Option 1E: GOV.UK Platform - [PLATFORM_NAME] (UK Government Only)

> **Note**: Only applicable if this is a UK Government project (central gov, devolved administrations, NHS, local authorities, blue light services)

**Description**: [What the platform does]

**Eligibility**: [Who can use it: all public sector, central government only, etc.]

**Cost Model**:
- **Setup**: Free OR £[X] one-time
- **Usage**: Free OR [pricing model]
- **Transaction Fees**: [If applicable, e.g., GOV.UK Pay 1.5%]

**Cost Breakdown**:
| Cost Item | Year 1 | Year 2 | Year 3 | Notes |
|-----------|--------|--------|--------|-------|
| Platform Usage | £[X] | £[Y] | £[Z] | [Free or pricing] |
| Integration | £[W] | £0 | £0 | [X] person-weeks |
| **Total** | **£[T1]** | **£[T2]** | **£[T3]** | |
| **3-Year TCO** | | | **£[TOTAL]** | Significantly lower than commercial |

**Pros**:
- ✅ Free or subsidized for public sector
- ✅ GDPR compliant, UK data residency
- ✅ Meets Government Service Standard
- ✅ Well-documented, supported by GDS
- ✅ TCoP compliant (use common platforms)

**Cons**:
- ❌ Only for public sector
- ❌ [Any feature limitations]
- ❌ [Any integration constraints]

**Support**:
- **Documentation**: [URL to docs]
- **Support**: [Email, Slack, ticketing system]
- **SLA**: [If provided]

**Technology Code of Practice Alignment**:
- ✅ **Point 8**: Share, reuse and collaborate (common platform)
- ✅ **Point 6**: Make things secure (security by design)
- ✅ **Point 7**: Make privacy integral (GDPR by design)

**Mandate**:
- [MANDATORY for public-facing services OR RECOMMENDED but not required]

---

### Build vs Buy Recommendation for [CATEGORY]

**Recommended Approach**: [BUILD | BUY: Vendor X | ADOPT: Open Source Y | GOV.UK Platform Z]

**Rationale**:

[2-3 paragraphs explaining why this is the best approach given requirements, budget, timeline, team capabilities, strategic importance]

**Key Decision Factors**:
- ✅ **[Factor 1]**: [Why this matters and how chosen option addresses it]
- ✅ **[Factor 2]**: [Why this matters and how chosen option addresses it]
- ✅ **[Factor 3]**: [Why this matters and how chosen option addresses it]

**Shortlist for Further Evaluation**:
1. **[Vendor/Product 1]**: [Why shortlisted]
2. **[Vendor/Product 2]**: [Why shortlisted]

**Next Steps**:
- [ ] Schedule vendor demos for shortlisted options
- [ ] Request pricing quotes based on projected usage
- [ ] Technical proof-of-concept (POC) for top 2 options
- [ ] Review security/compliance certifications
- [ ] Check references from similar customers
- [ ] Negotiate contract terms (if proceeding with commercial vendor)

---

## Category 2: [ANOTHER_CATEGORY]

[Repeat structure for each research category identified from requirements]

---

## Total Cost of Ownership (TCO) Summary

### Blended TCO Across All Categories

**Recommended Approach (Blended)**:

| Category | Recommended Option | Year 1 | Year 2 | Year 3 | 3-Year TCO |
|----------|-------------------|--------|--------|--------|------------|
| [Category 1] | [Build/Buy/Adopt] | £[X] | £[Y] | £[Z] | £[TOTAL] |
| [Category 2] | [Build/Buy/Adopt] | £[X] | £[Y] | £[Z] | £[TOTAL] |
| [Category 3] | [Build/Buy/Adopt] | £[X] | £[Y] | £[Z] | £[TOTAL] |
| [Category 4] | [Build/Buy/Adopt] | £[X] | £[Y] | £[Z] | £[TOTAL] |
| **TOTAL** | | **£[X]** | **£[Y]** | **£[Z]** | **£[TOTAL]** |

### Alternative Scenarios

**Scenario A: Build Everything**:
- 3-Year TCO: £[X]
- Pros: Maximum control and flexibility
- Cons: Highest cost, longest time to market, highest risk

**Scenario B: Buy Everything (Commercial SaaS)**:
- 3-Year TCO: £[Y]
- Pros: Fastest time to market, managed services
- Cons: Vendor lock-in, ongoing subscription costs, less control

**Scenario C: Open Source Everything**:
- 3-Year TCO: £[Z]
- Pros: Lower licensing costs, flexibility
- Cons: Operational burden, skills required, support limitations

**Scenario D: Recommended Blended Approach**:
- 3-Year TCO: £[W]
- Pros: Balance of cost, speed, control, and risk
- Cons: [Any trade-offs]

### TCO Assumptions

- Engineering rates: £[X]/day (blended rate for contractors/FTE)
- Infrastructure: AWS UK region pricing (on-demand, reserved instances for savings)
- SaaS pricing: List prices with 10% annual increases
- Maintenance: 20-30% of development cost for custom builds
- Exchange rates: [If relevant]
- Inflation: [If multi-year]

### Risk-Adjusted TCO

| Scenario | Base TCO | Contingency | Risk-Adjusted TCO | Risk Factors |
|----------|----------|-------------|-------------------|--------------|
| Build Everything | £[X] | +20% | £[Y] | Scope creep, delays, skill gaps |
| Buy (SaaS) | £[X] | +10% | £[Y] | Price increases, vendor changes |
| Open Source | £[X] | +15% | £[Y] | Underestimated maintenance |
| Recommended | £[X] | +12% | £[Y] | Blended risk profile |

---

## Requirements Traceability

### Requirements Coverage Matrix

| Requirement ID | Requirement Description | Research Category | Recommended Solution | Rationale |
|----------------|------------------------|-------------------|---------------------|-----------|
| FR-001 | [Requirement text] | [Category] | [Solution] | [Why this meets the requirement] |
| FR-002 | [Requirement text] | [Category] | [Solution] | [Why this meets the requirement] |
| NFR-SEC-001 | [Requirement text] | [Category] | [Solution] | [Why this meets the requirement] |
| INT-001 | [Requirement text] | [Category] | [Solution] | [Why this meets the requirement] |
| DR-001 | [Requirement text] | [Category] | [Solution] | [Why this meets the requirement] |

### Coverage Summary

**Requirements with Identified Solutions**:
- ✅ **[X] requirements ([Y%])** have recommended commercial or open source solutions
- 🔨 **[Z] requirements ([W%])** require custom development (no suitable off-the-shelf)
- 🔍 **[A] requirements ([B%])** need further research or clarification

**Gaps and Concerns**:

**GAP-1**: [Requirement ID]: [Gap description]
- **Impact**: [What can't be done without this]
- **Options**: [Build custom | Wait for market | Workaround]
- **Recommendation**: [What to do]

**GAP-2**: [Another gap]

---

## UK Government Considerations

> **Note**: Only applicable if this is a UK Government project

### Technology Code of Practice (TCoP) Compliance

Assessment against 13 TCoP points relevant to technology selection:

| TCoP Point | Status | Notes |
|-----------|--------|-------|
| **1. Define user needs** | ✅ Compliant | Research driven by user requirements |
| **2. Make things accessible** | ✅ Compliant | All vendors assessed for WCAG 2.1 AA |
| **3. Be open and use open standards** | ✅ Compliant | Open source options prioritized |
| **4. Make use of open source** | ✅ Compliant | [X] categories using open source |
| **5. Use cloud first** | ✅ Compliant | Public cloud (AWS/Azure/GCP) recommended |
| **6. Make things secure** | ✅ Compliant | Security by design, ISO 27001 vendors |
| **7. Make privacy integral** | ✅ Compliant | GDPR compliance mandatory, UK data residency |
| **8. Share, reuse and collaborate** | ✅ Compliant | GOV.UK platforms used where available |
| **9. Integrate and adapt technology** | ✅ Compliant | APIs and interoperability assessed |
| **10. Make better use of data** | ✅ Compliant | Open data formats, data standards |
| **11. Define your purchasing strategy** | ✅ Compliant | Digital Marketplace procurement |
| **12. Meet the Service Standard** | ⚠️ If applicable | For public-facing services |
| **13. Spend controls** | ⚠️ If >£100K | Spend approval process required |

### GOV.UK Common Platforms Used

| Platform | Category | Status | Rationale |
|----------|----------|--------|-----------|
| GOV.UK One Login | Authentication | ✅ Recommended | Mandatory for public-facing services |
| GOV.UK Pay | Payments | ✅ Recommended | No setup fees, 1.5% transaction fee |
| GOV.UK Notify | Notifications | ✅ Recommended | Free for central government |
| GOV.UK Forms | Forms | ✅ Recommended | Free form builder |
| GOV.UK Publishing | Content | ⚠️ If applicable | For gov.uk domain content |

**Benefits of GOV.UK Platforms**:
- ✅ Free or subsidized for public sector
- ✅ Pre-built, well-tested, accessible
- ✅ GDPR compliant, UK data residency
- ✅ Meets Service Standard and TCoP
- ✅ Reduces development and operational costs

### Digital Marketplace Procurement Strategy

**G-Cloud 14** (Cloud hosting, software, support):
- [X] suppliers found for [category]
- Top suppliers: [List with day rates or pricing]

**Digital Outcomes and Specialists (DOS)**:
- [X] suppliers found for [specialist role or outcome]
- Top suppliers: [List with day rates]

**Procurement Approach**:
1. Search Digital Marketplace for relevant categories
2. Shortlist 3-5 suppliers based on capability, price, past performance
3. Request further information or quotes
4. Award directly (if <£100K) or mini-competition (if >£100K)
5. Use framework terms (no custom contract negotiation)

**Benefits**:
- ✅ Pre-approved suppliers (due diligence done)
- ✅ SME-friendly (1/3 spend with SMEs target)
- ✅ Fast procurement (no OJEU if under threshold)
- ✅ Framework terms enforced (fair pricing)

### Government Cloud and Data Residency

**Data Classification**: [OFFICIAL | OFFICIAL-SENSITIVE | SECRET]

**Hosting Requirements**:

**For OFFICIAL**:
- ✅ Public cloud (AWS, Azure, GCP) acceptable
- ✅ UK regions preferred but not required
- ✅ No special accreditation needed

**For OFFICIAL-SENSITIVE**:
- ✅ Public cloud acceptable with additional controls (encryption, logging, MFA)
- ⚠️ UK data residency may be required by department policy
- ⚠️ Consider Government Cloud (IL2) if mandated

**For SECRET**:
- ❌ Public cloud NOT acceptable
- ✅ Government Cloud (IL3+) OR air-gapped infrastructure required
- ✅ Security-cleared personnel required

**Recommended Approach for This Project**:
- [Public cloud (AWS UK region) | Government Cloud | Air-gapped]
- [Rationale based on data classification]

---

## Integration with Wardley Mapping

Research findings inform Wardley Map value chain positioning and evolution:

### Value Chain Components by Evolution

| Component | Evolution Stage | Recommended Approach | Rationale |
|-----------|----------------|---------------------|-----------|
| [Component 1] | Genesis (novel) | Build Custom | Unique IP, competitive advantage |
| [Component 2] | Custom | Build OR Buy Product | No clear commodity, build if differentiating |
| [Component 3] | Product | Buy SaaS | Mature products available (Stripe, Auth0) |
| [Component 4] | Commodity | Use Managed Service | Standard infrastructure (AWS S3, RDS) |

**Evolution Axis Guidance**:
- **Genesis** (left): Novel, rare, uncertain → Build if strategic, otherwise wait
- **Custom** (mid-left): Bespoke, emerging → Build if no product, buy if available
- **Product** (mid-right): Off-the-shelf, stabilizing → Buy SaaS unless strong rationale to build
- **Commodity** (right): Standard, ubiquitous → Use cloud/open source, don't build

**Strategic Insights**:
- [Insight 1]: [e.g., "Payments are commoditized - use Stripe, don't build"]
- [Insight 2]: [e.g., "ML recommendation engine is novel IP - build in-house"]
- [Insight 3]: [e.g., "Authentication is product - use Auth0 or GOV.UK One Login"]

**Next Steps**:
- Run `/arckit.wardley` to create Wardley Map with research findings
- Position components on evolution axis based on build/buy decisions
- Identify strategic plays (e.g., componentize novel features once mature)

---

## Integration with SOBC Economic Case

Research findings feed into Strategic Outline Business Case (SOBC) Economic Case:

### Options Analysis for SOBC

**Option 0: Do Nothing (Baseline)**
- Cost: £0
- Benefits: None
- Risk: [Current pain points persist]

**Option 1: Build Everything Custom**
- 3-Year TCO: £[X]
- Benefits: [Maximum control, flexibility, IP ownership]
- Risks: [Highest cost, longest delivery, skill dependencies]
- NPV: £[Y] (if benefits quantified)

**Option 2: Buy Commercial SaaS (Recommended)**
- 3-Year TCO: £[Z]
- Benefits: [Fast delivery, managed services, proven solutions]
- Risks: [Vendor lock-in, subscription costs, less control]
- NPV: £[W] (if benefits quantified)

**Option 3: Open Source + Managed Services**
- 3-Year TCO: £[A]
- Benefits: [Lower costs, flexibility, avoid lock-in]
- Risks: [Operational burden, skills required, support limitations]
- NPV: £[B] (if benefits quantified)

**Option 4: Hybrid (Build Custom for Core, Buy for Commodity)**
- 3-Year TCO: £[C]
- Benefits: [Balance cost, speed, control, and risk]
- Risks: [Complexity of integration]
- NPV: £[D] (if benefits quantified)

**Preferred Option**: [Option X] - [Name]

**Rationale**: [Why this option provides best value for money based on cost, benefits, risk, and strategic fit]

### Cost Data for SOBC

**CAPEX (Initial Investment)**:
- Development: £[X]
- Setup/Integration: £[Y]
- Infrastructure: £[Z]
- **Total CAPEX**: £[TOTAL]

**OPEX (Ongoing Annual)**:
- Subscriptions: £[X]/year
- Infrastructure: £[Y]/year
- Maintenance: £[Z]/year
- Support: £[W]/year
- **Total OPEX**: £[TOTAL]/year

### Benefits for SOBC

**Quantified Benefits** (from vendor claims, case studies, benchmarks):

- **Cost Savings**: £[X]/year from [automation, efficiency, reduction in manual work]
- **Revenue Increase**: £[Y]/year from [improved conversion, new features, faster delivery]
- **Productivity**: [Z] hours/week saved per user × [W] users × £[rate]/hour = £[A]/year
- **Quality**: [Reduce defects by X%, reduce downtime by Y hours/year = £[B] saved]

**Qualitative Benefits**:
- Improved user experience (CSAT, NPS)
- Faster time to market
- Scalability for growth
- Reduced technical debt
- Better security posture

**Total Benefits (3-year)**: £[TOTAL]

**Net Present Value (NPV)**: £[Benefits - Costs discounted at 3.5% per Green Book]

---

## Vendor Shortlist for Further Evaluation

### Top 3 Vendors/Products Recommended

#### 1. [VENDOR/PRODUCT 1] for [Category]

**Overall Rating**: ⭐⭐⭐⭐⭐ (5/5) OR ⭐⭐⭐⭐☆ (4/5)

**Strengths**:
- [Key strength 1]
- [Key strength 2]
- [Key strength 3]

**Concerns**:
- [Concern 1 if any]
- [Concern 2 if any]

**Next Steps**:
- [ ] Schedule demo for [date]
- [ ] Request formal pricing quote
- [ ] Technical POC ([duration])
- [ ] Security review (ISO 27001, SOC 2, penetration test reports)
- [ ] Check 3 customer references

**Decision Criteria**:
- [ ] Meets all MUST requirements
- [ ] [X]% of SHOULD requirements met
- [ ] Pricing within budget (£[X])
- [ ] Integration feasibility confirmed
- [ ] Security/compliance approved
- [ ] References positive

#### 2. [VENDOR/PRODUCT 2] for [Category]

[Repeat structure]

#### 3. [VENDOR/PRODUCT 3] for [Category]

[Repeat structure]

---

## Risks and Mitigations

### Vendor Risks

**VR-1: Vendor Lock-in**
- **Risk**: Difficult or expensive to switch vendors after commitment
- **Impact**: HIGH - Could lead to price increases, feature stagnation
- **Likelihood**: MEDIUM
- **Mitigation**:
  - Negotiate data portability clauses in contract
  - Use abstraction layers in code (don't couple directly to vendor APIs)
  - Maintain export capabilities for all data
  - Annual vendor performance review with exit planning

**VR-2: Vendor Viability**
- **Risk**: Startup vendor fails or gets acquired
- **Impact**: HIGH - Service discontinuation, forced migration
- **Likelihood**: LOW (if established vendor) / MEDIUM (if startup)
- **Mitigation**:
  - Choose financially stable vendors (funded Series B+, profitable, or public)
  - Escrow agreements for critical IP
  - Maintain ability to self-host if open core model

**VR-3: Price Increases**
- **Risk**: SaaS prices increase beyond budget over time
- **Impact**: MEDIUM - Budget overruns, forced migration
- **Likelihood**: MEDIUM - SaaS vendors regularly increase prices 10-20%/year
- **Mitigation**:
  - Negotiate multi-year fixed pricing
  - Include price increase caps in contract (e.g., max 10%/year)
  - Budget 10-15% annual increase in TCO projections

### Technical Risks

**TR-1: Integration Complexity**
- **Risk**: Integration more complex than anticipated
- **Impact**: MEDIUM - Delays, cost overruns
- **Likelihood**: MEDIUM
- **Mitigation**:
  - Technical POC before commitment
  - Allocate 20% contingency for integration effort
  - Engage vendor professional services for initial setup

**TR-2: Performance at Scale**
- **Risk**: Solution doesn't meet performance requirements at projected scale
- **Impact**: HIGH - SLA breaches, poor user experience
- **Likelihood**: LOW (if vendor proven) / MEDIUM (if unproven)
- **Mitigation**:
  - Load testing during POC
  - Review vendor SLA and performance track record
  - Phased rollout to validate performance

**TR-3: Skills Gap**
- **Risk**: Team lacks skills to operate/maintain chosen technology
- **Impact**: MEDIUM - Operational issues, delays
- **Likelihood**: MEDIUM (for open source) / LOW (for SaaS)
- **Mitigation**:
  - Training budget allocated (£[X])
  - Hire specialists if needed
  - Leverage vendor professional services

### Compliance Risks

**CR-1: Data Residency**
- **Risk**: Vendor doesn't support UK data residency (required for GDPR, UK Gov)
- **Impact**: HIGH - Compliance blocker
- **Likelihood**: LOW (most major vendors support UK/EU regions)
- **Mitigation**:
  - Confirm UK/EU data residency in contract
  - Review vendor data processing agreement (DPA)
  - DPIA if required for high-risk processing

---

## Next Steps and Recommendations

### Immediate Actions (0-2 weeks)

1. **Stakeholder Review**: Present research findings to [steering committee, CTO, CFO]
2. **Shortlist Approval**: Confirm top 3 vendors for deeper evaluation
3. **Budget Approval**: Secure budget for [£X] over 3 years
4. **Procurement Planning**: Determine procurement route (RFP, Digital Marketplace, direct)

### Vendor Evaluation (2-6 weeks)

5. **Schedule Demos**: Book demos with shortlisted vendors
6. **Request Pricing**: Formal pricing quotes based on projected usage
7. **Technical POCs**: 2-week POCs for top 2 vendors per category
8. **Security Review**: Review ISO 27001, SOC 2, penetration test reports
9. **Reference Checks**: Contact 3 customers per vendor (similar use cases)

### Decision and Procurement (6-12 weeks)

10. **Vendor Selection**: Make final decision based on evaluation criteria
11. **Contract Negotiation**: Negotiate SLA, pricing, data protection agreement
12. **Procurement**: Execute procurement (PO, framework, RFP award)
13. **Onboarding Plan**: Schedule kickoff, training, integration

### Integration with Other Commands

14. **Update SOBC**: Run `/arckit.sobc` to update Economic Case with research data
15. **Create Wardley Map**: Run `/arckit.wardley` to map value chain with evolution positioning
16. **Generate SOW/RFP**: Run `/arckit.sow` to create vendor RFP with technical requirements
17. **HLD Review**: Run `/arckit.hld-review` once architecture defined, validate against research

---

## Appendices

### Appendix A: Research Methodology

**Data Sources**:
- Vendor websites and documentation
- G2, Gartner, Forrester reviews and ratings
- UK Government Digital Marketplace
- GitHub (for open source projects)
- Industry analyst reports
- Customer case studies and references

**Evaluation Criteria**:
- Requirements fit (MUST/SHOULD/COULD)
- Pricing and TCO (3-year projection)
- Vendor maturity and financial stability
- Security and compliance (ISO 27001, SOC 2, GDPR)
- Integration capabilities (APIs, SDKs)
- Support and SLA
- Customer references and reputation

**Limitations**:
- Pricing based on list prices (discounts may be available)
- TCO projections include assumptions (see TCO section)
- Market rapidly evolves (research valid for ~6 months)

### Appendix B: Glossary

[Define terms used in this document]

- **TCO**: Total Cost of Ownership (all costs over time)
- **CAPEX**: Capital Expenditure (initial investment)
- **OPEX**: Operational Expenditure (ongoing costs)
- **SaaS**: Software as a Service
- **PaaS**: Platform as a Service
- **IaaS**: Infrastructure as a Service
- **SLA**: Service Level Agreement
- **API**: Application Programming Interface
- **SDK**: Software Development Kit
- **NPV**: Net Present Value
- **TCoP**: Technology Code of Practice (UK Government)

### Appendix C: Vendor Contact Information

[List of shortlisted vendors with contact details, account managers, sales engineering]

### Appendix D: Detailed Pricing Sheets

[Attach detailed pricing from vendors if available]

---

**Document History**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | [DATE] | [AUTHOR] | Initial draft |
| 0.2 | [DATE] | [AUTHOR] | Stakeholder feedback incorporated |
| 1.0 | [DATE] | [AUTHOR] | Approved version |

## External References

| Document | Type | Source | Key Extractions | Path |
|----------|------|--------|-----------------|------|
| *None provided* | — | — | — | — |

---

**Generated by**: ArcKit `/arckit.research` agent
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]

