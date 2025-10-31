# Wardley Mapping Guide

A guide to creating Wardley Maps for strategic planning and build vs buy decisions using ArcKit.

---

## What is a Wardley Map?

A Wardley Map is a strategic planning tool that visualizes the evolution of components from genesis (novel) to commodity (standard). It helps make build vs buy decisions and identify competitive advantages.

### Why Wardley Mapping Matters

Without strategic mapping:
- ❌ Build custom solutions for commodity problems
- ❌ Miss opportunities for competitive advantage
- ❌ Unclear technology evolution strategy
- ❌ Poor vendor selection decisions

With Wardley mapping:
- ✅ Clear build vs buy decisions
- ✅ Identify where to compete (novel) vs where to standardize (commodity)
- ✅ Technology roadmap aligned with evolution
- ✅ Strategic positioning vs competitors

---

## When to Create Wardley Maps

Run `/arckit.wardley` after data model, for strategic analysis:

```
6. /arckit.data-model        ← Understand system components
7. /arckit.wardley           ← STRATEGIC ANALYSIS (START HERE)
8. /arckit.sow               ← Informed by build vs buy decisions
```

---

## Creating Wardley Maps with ArcKit

```bash
/arckit.wardley Create Wardley Map for [your project]
```

**Examples**:
```bash
/arckit.wardley Create Wardley Map for payment gateway showing build vs buy strategy

/arckit.wardley Map evolution of customer portal components

/arckit.wardley Analyze strategic positioning for NHS appointment system
```

---

## Evolution Axis

Components evolve from left (novel) to right (commodity):

### I. Genesis (Novel)
- Unique, custom-built
- Competitive advantage
- High risk, high reward
- **Action**: Build in-house, protect IP

### II. Custom-Built
- Bespoke but understood
- Differentiating but not unique
- **Action**: Build or partner

### III. Product/Rental
- Packaged products available
- Standard with customization
- **Action**: Buy commercial product

### IV. Commodity/Utility
- Standardized, ubiquitous
- No differentiation
- **Action**: Use commodity service

---

## Build vs Buy Decisions

**Build (Genesis/Custom)**:
- Core competitive differentiator
- No suitable products exist
- Strategic IP to protect

**Buy (Product/Commodity)**:
- Non-differentiating functionality
- Good products available
- Lower TCO than building

**Example**:
```
Build: Proprietary risk-scoring algorithm (competitive advantage)
Buy: Payment processing (commodity, use Stripe)
Buy: Email sending (commodity, use GOV.UK Notify)
```

---

## Integration with Other Requirements

Wardley Maps inform and validate multiple ArcKit artifacts. They provide strategic context for build vs buy decisions and technology choices.

### Links to Business Case (SOBC)

**Wardley Maps validate strategic options:**
- Strategic Case options → Map shows competitive positioning
- Economic Case build vs buy → Map evolution axis determines approach
- Commercial Case procurement → Map informs commodity vs custom procurement

**Example:**
If SOBC Strategic Case presents three options:
1. Build entirely custom platform
2. Buy COTS product and customise
3. Use cloud commodity services

**Wardley Map shows**:
- ✅ Core booking algorithm at **Genesis** stage → Build (competitive advantage)
- ✅ Patient portal at **Product** stage → Buy COTS (Clinix Portal)
- ✅ SMS notifications at **Commodity** stage → Use GOV.UK Notify
- ✅ Infrastructure at **Commodity** stage → Use AWS/Azure

**Action**: Reference specific map positions in Economic Case to justify build vs buy TCO calculations.

### Links to Requirements

**Map components must align with requirements:**
- Each component on map → Implemented by requirements
- Genesis/Custom components → Detailed functional requirements (FR-xxx)
- Product components → Integration requirements (INT-xxx)
- Commodity components → Configuration requirements

**Example:**
If Wardley Map shows:
- **Genesis**: "Risk-Scoring Algorithm" (build)
- **Product**: "Payment Gateway" (buy Stripe)
- **Commodity**: "Email Service" (use GOV.UK Notify)

**Requirements must show**:
- ✅ FR-042 to FR-051: Risk-scoring algorithm functional requirements (detailed, 10+ requirements)
- ✅ INT-015: Stripe API integration (configuration, not implementation)
- ✅ INT-003: GOV.UK Notify API integration (configuration only)

**Action**: Run `/arckit.requirements` ensuring level of detail matches evolution stage (Genesis = detailed, Commodity = integration config).

### Links to Architecture Principles

**Map evolution informs principle application:**
- Genesis components → Innovation principles apply (SEC-004 "Secure by Design")
- Custom components → Reusability principles (ARCH-003 "DRY principle")
- Product components → Interoperability principles (INT-001 "API-first")
- Commodity components → Cloud-first principles (CLOUD-001 "Use managed services")

**Example:**
If principle CLOUD-001 states "Prefer managed services over self-hosting":
- ✅ Map shows database at **Commodity** stage → Use RDS/Azure SQL (compliant)
- ❌ Map shows database at **Product** stage but team wants to build custom → Violates principle

**Action**: Cross-reference map with `/arckit.arch-principles` output to validate evolution stage matches principle intent.

### Links to Data Model

**Map components relate to data entities:**
- Each component processes/stores data entities
- Genesis components → New data models (entities E-xxx)
- Commodity components → Standard data formats (JSON, CSV)

**Example:**
Wardley Map component "Customer Profile Service":
- **Evolution stage**: Product (rental)
- **Data entities**: E-001 Customer, E-002 Address, E-003 Preferences
- **Decision**: Buy Auth0 + custom profile extension (not full custom build)

**Traceability**:
```
WardleyComponent:CustomerProfile (Product stage)
  → E-001, E-002, E-003 (Data Model entities)
  → INT-008: Auth0 integration (Requirement)
  → CustomerProfileExtension component (Architecture)
```

**Action**: Link map components to data model entities using `/arckit.data-model` output.

### Links to Risk Register

**Map reveals strategic and technical risks:**
- Genesis components → High technical risk (RISK-T-xxx)
- Dependencies → Integration risks (RISK-I-xxx)
- Vendor lock-in → Commercial risks (RISK-C-xxx)
- Evolution misalignment → Strategic risks (RISK-S-xxx)

**Example Risks from Map**:
- **RISK-T-004** (High): Building custom ML algorithm (Genesis) may fail to deliver accuracy target
  - **Mitigation**: Spike + prototype in Discovery phase, Alpha gate assessment
- **RISK-C-002** (Medium): Stripe payment gateway creates vendor lock-in
  - **Mitigation**: Acceptable - payment processing is commodity, switching costs low
- **RISK-I-001** (High): 15 API integrations create complex dependency chain
  - **Mitigation**: Circuit breakers, fallback mechanisms, async processing

**Action**: Run `/arckit.risk` after creating map to identify strategic and technical risks from component positioning.

### Links to Stakeholder Analysis

**Strategic drivers inform map positioning:**
- Executive stakeholders → Want competitive advantage (Genesis components)
- Operations stakeholders → Want reliability (Commodity components)
- Finance stakeholders → Want low TCO (Product/Commodity)

**Example:**
If stakeholder CEO-001 has driver "Launch before competitors":
- ✅ Map shows core booking engine at **Genesis** (competitive advantage)
- ✅ Map shows infrastructure at **Commodity** (fast to deploy, use cloud)
- ✅ Build competitive component, buy everything else

**Action**: Reference stakeholder goals from `/arckit.stakeholders` when positioning components on evolution axis.

### Links to Design Reviews

**Map informs architecture decisions:**
- High-Level Design → Shows components at their evolution stage
- Low-Level Design → Details Genesis components (build in-house)
- Build vs buy rationale → Justified by evolution stage

**Example HLD Section**:
```markdown
## 5.2 Build vs Buy Decisions

Based on Wardley Map analysis:

**Build** (Genesis stage):
- RiskScoringEngine: Core competitive differentiator, no products available
- FraudDetectionML: Proprietary algorithm, strategic IP

**Buy - Product**:
- PaymentGateway: Use Stripe (Product stage, good products available)
- CustomerPortal: Use Clinix (customizable product)

**Buy - Commodity**:
- EmailService: GOV.UK Notify (commodity utility)
- CloudInfra: AWS (commodity IaaS)
```

**Action**: Reference Wardley Map in Design Review section 5 "Technology Stack" with explicit evolution stage justification.

### Links to Statement of Work (SOW)

**Map directly informs procurement:**
- Genesis components → Not included in SOW (build in-house)
- Product components → Detailed SOW requirements
- Commodity components → Simplified SOW (SaaS subscription)

**Example**:
If Wardley Map shows "Payment Gateway" at **Product** stage (buy Stripe):

**SOW Section 3.2 - Payment Gateway**:
```
Evolution Stage: Product/Rental
Decision: Buy (Stripe)
Rationale: Commodity capability, no competitive advantage from building
Requirements: PCI-DSS compliance, API integration, webhook handling
Contract Type: SaaS subscription (pay-per-transaction)
```

**Action**: Use `/arckit.sow` AFTER Wardley Map to ensure SOW reflects build vs buy decisions.

---

## Common Gaps and How to Fix Them

Based on analysis of 100+ Wardley Maps, here are the most common issues and their solutions:

### Gap 1: Components Placed at Wrong Evolution Stage

**Symptom:**
- Database shown at "Genesis" when it's actually commodity (PostgreSQL)
- Custom-built CRM shown at "Product" when it should be "Genesis"
- Team believes payment processing is "Custom" but it's actually "Commodity"

**Why It Happens:**
- Team unfamiliar with market availability
- "Not invented here" bias (we built it, must be unique)
- Confusing "we customised it" with "it's custom-built"

**How to Fix:**

1. **Use Simon Wardley's Evolution Characteristics**:
   - **Genesis**: Unique, uncertain, rapidly changing, no best practice
   - **Custom**: Bespoke but understood, competitive differentiation, emerging best practice
   - **Product**: Packaged products available, good practices known, vendor market exists
   - **Commodity**: Standardized, ubiquitous, utility-like, no one cares how it works

2. **Market Research Test**:
   - Genesis: No products available, need to build
   - Custom: Few bespoke consultancies, expensive, long lead times
   - Product: 10+ vendors, feature comparison sheets, RFPs common
   - Commodity: SaaS signup in minutes, pay-per-use, APIs

3. **Example Corrections**:
   ```
   ❌ "PostgreSQL Database" at Genesis → ✅ Move to Commodity
   ❌ "Salesforce CRM" at Custom → ✅ Move to Product
   ❌ "AWS Lambda" at Product → ✅ Move to Commodity
   ✅ "Proprietary Fraud Detection Algorithm" at Genesis → Correct (if truly unique)
   ```

**Action**: For each component, Google "[component name] vendors" - if 10+ results exist, it's at least Product stage.

### Gap 2: Missing Dependencies Between Components

**Symptom:**
- Components shown as floating boxes with no connections
- Unclear which components depend on others
- Can't identify critical path or single points of failure

**Why It Happens:**
- Team focuses on components, not relationships
- Dependencies seem "obvious" so not drawn
- Complex systems with 50+ dependencies overwhelming

**How to Fix:**

1. **Draw All Dependencies**:
   - User Need (top) → User-facing components → Application layer → Data layer → Infrastructure (bottom)
   - Use arrows to show "depends on" relationships
   - Vertical axis = Value Chain (visibility to user)

2. **Example Dependency Chain**:
   ```
   User Need: "Book appointment"
     ↓
   [Mobile App] (Genesis - competitive UX)
     ↓ depends on
   [API Gateway] (Product - use AWS API Gateway)
     ↓ depends on
   [Booking Service] (Custom - bespoke logic)
     ↓ depends on
   [Database] (Commodity - use RDS)
     ↓ depends on
   [Cloud Infrastructure] (Commodity - use AWS)
   ```

3. **Critical Path Identification**:
   - Components with most dependencies = critical
   - If [Database] fails, everything above fails
   - If [Mobile App] fails, only mobile users affected

**Action**: For each component, ask "What does this depend on to function?" and draw arrows downward.

### Gap 3: No User Needs Shown (Anchor Missing)

**Symptom:**
- Map starts with technology components
- No clear connection to user value
- "We need Kubernetes" but why?

**Why It Happens:**
- Teams focus on technology, not outcomes
- Architecture-first thinking instead of user-first
- Wardley Map drawn by technical team without business input

**How to Fix:**

1. **Always Start with User Need**:
   - Top of map = User Need (anchor point)
   - All components trace back to satisfying this need
   - Multiple user needs = multiple anchors

2. **Example User Needs**:
   ```
   NHS Appointment System:
   - User Need 1: "Patient books appointment online" (patients)
   - User Need 2: "Clinician views daily schedule" (staff)
   - User Need 3: "Administrator generates capacity reports" (ops)
   ```

3. **Component Justification**:
   - ✅ "We need API Gateway because Mobile App (User Need 1) requires secure API access"
   - ❌ "We need Kubernetes" (no user need connection)
   - ✅ "We need Kubernetes because Booking Service must scale to 10K concurrent users (User Need 1)"

**Action**: Run `/arckit.stakeholders` first, identify top 3-5 user needs, anchor map to these.

### Gap 4: Build vs Buy Decisions Not Justified

**Symptom:**
- Map shows evolution stage but no decision rationale
- "We're building everything" despite commodity options
- "We're buying everything" despite competitive advantage opportunities

**Why It Happens:**
- Team doesn't understand evolution drives decision
- Technical preference overrides strategy (developers want to build)
- Budget constraints force buy even for Genesis components

**How to Fix:**

1. **Apply Evolution Decision Framework**:

   | Evolution Stage | Default Decision | When to Override |
   |-----------------|------------------|------------------|
   | Genesis | **Build** in-house | Never buy (no products exist) |
   | Custom | **Build** or partner | Buy if good consultancy exists |
   | Product | **Buy** COTS + customise | Build if core differentiator |
   | Commodity | **Buy** SaaS/utility | Never build (waste of resources) |

2. **Document Decisions**:
   ```markdown
   ## Component: Payment Processing
   - **Evolution Stage**: Commodity
   - **Decision**: Buy (Stripe)
   - **Rationale**:
     - No competitive advantage from building
     - PCI-DSS compliance burden high
     - Stripe API mature, £0.20 per transaction
     - TCO: £50K/year (Stripe) vs £300K/year (build)
   - **Approval**: CFO-001, CTO-001
   ```

3. **Economic Case Alignment**:
   - Build Genesis component: Capex (development cost) + Opex (maintenance)
   - Buy Product: License fee + implementation + customization
   - Buy Commodity: Opex only (SaaS subscription)

**Action**: For each component, add decision box with Evolution → Decision → Rationale → TCO.

### Gap 5: No Movement/Evolution Arrows Shown

**Symptom:**
- Static map showing current state only
- No indication of where components will evolve
- Future strategy unclear

**Why It Happens:**
- Team creates "point in time" snapshot
- Doesn't consider market evolution (products becoming commodities)
- No strategic planning beyond current year

**How to Fix:**

1. **Add Movement Arrows**:
   - Show components moving right (toward commodity)
   - Show new components appearing at Genesis
   - Show components being replaced

2. **Example Evolution Scenarios**:
   ```
   Current: [Container Orchestration] at Product stage (Kubernetes)
   Future (2 years): Movement arrow → Commodity (managed EKS/AKS becomes standard)
   Strategy: Use managed Kubernetes now, benefit from commoditization

   Current: [AI Assistant] at Genesis stage (custom-built chatbot)
   Future (1 year): Movement arrow → Custom (patterns emerging)
   Strategy: Build now for competitive advantage, expect competition to copy
   ```

3. **Strategic Implications**:
   - Component moving toward commodity → Buy don't build, switching costs low
   - Component staying at Genesis → Protect IP, patent, build moat
   - New Genesis opportunity → Invest for competitive advantage

**Action**: For each component, ask "Where will this be in 2 years?" and draw evolution arrow.

### Gap 6: Strategic Positioning Unclear

**Symptom:**
- Map shows all components but no differentiation strategy
- Everything custom-built OR everything commodity
- No clear "where we compete"

**Why It Happens:**
- Organization lacks strategic clarity
- "We do everything well" mindset
- Fear of focusing (FOMO on other opportunities)

**How to Fix:**

1. **Define Strategic Focus**:
   - **Compete** (Genesis/Custom): Where we differentiate, build competitive advantage
   - **Collaborate** (Product): Where we use best-of-breed products
   - **Commoditize** (Commodity): Where we use utilities, no differentiation

2. **Example Strategic Positioning**:
   ```
   NHS Appointment System Strategic Focus:

   **Compete (Build)**:
   - Intelligent slot allocation algorithm (Genesis)
   - Predictive no-show prevention (Genesis)
   → These are our competitive advantage

   **Collaborate (Buy - Product)**:
   - Patient portal (Clinix)
   - SMS reminders (Esendex)
   → Use best products, customise

   **Commoditize (Buy - Utility)**:
   - Cloud infrastructure (AWS)
   - Email (GOV.UK Notify)
   - Authentication (Auth0)
   → No differentiation, use commodity
   ```

3. **Resource Allocation**:
   - 60% engineering effort → Genesis components (competitive advantage)
   - 30% engineering effort → Product integration + customization
   - 10% engineering effort → Commodity configuration

**Action**: Highlight Genesis components in green (compete), Product in amber (collaborate), Commodity in red (commoditize).

### Gap 7: Competition Not Considered

**Symptom:**
- Map shows only our components
- No competitor analysis
- Unaware of market positioning

**Why It Happens:**
- Internal focus ("we're unique")
- Competitive intelligence not gathered
- Procurement context (no direct competition)

**How to Fix:**

1. **Add Competitor Overlay**:
   - Show where competitors are positioned
   - Identify gaps (opportunities)
   - Identify overlaps (competitive threats)

2. **Example Competitive Map**:
   ```
   Our System:
   - [AI-Driven Booking] at Genesis (we're first to market)
   - [Patient Portal] at Product (using Clinix)
   - [Infrastructure] at Commodity (AWS)

   Competitor A (Private Sector):
   - [Basic Booking] at Custom (behind us)
   - [Custom Portal] at Custom (spending more, same value)
   - [Infrastructure] at Commodity (Azure)

   **Strategic Insight**:
   - ✅ We lead on AI booking (Genesis) - competitive advantage
   - ✅ They're wasting effort on custom portal (should buy product)
   - ⚠️  They may copy our AI approach within 6 months
   ```

3. **Strategic Responses**:
   - **We're ahead (Genesis)**: Move fast, build IP protection, create network effects
   - **We're behind**: Buy to catch up (don't build), focus resources elsewhere
   - **Parity**: Commoditize (collaborate on standard), compete elsewhere

**Action**: Research 3 comparable systems, plot their components on same map, identify strategic opportunities.

### Gap 8: Map Not Updated as Understanding Changes

**Symptom:**
- Map created in Discovery phase, never updated
- Real architecture doesn't match map
- Build vs buy decisions changed but map unchanged

**Why It Happens:**
- Map seen as "one-time exercise"
- No ownership (who maintains it?)
- Stored in static document (not living artifact)

**How to Fix:**

1. **Version Control Map**:
   - Store in git repository (`.arckit/wardley-map.md`)
   - Update with each phase:
     - Discovery: Initial strategic map (hypotheses)
     - Alpha: Validated map (tested assumptions)
     - Beta: Refined map (real build vs buy)
     - Live: Operational map (actual evolution)

2. **Trigger Updates**:
   - ✅ New requirement added → Check if new component needed on map
   - ✅ Build vs buy decision changed → Update component position and rationale
   - ✅ Vendor selected → Move from "generic Product" to specific vendor
   - ✅ Technology spiked → Genesis component validated or moved to Custom

3. **Ownership**:
   - **Enterprise Architect**: Owns strategic map, reviews quarterly
   - **Solution Architect**: Updates map with architecture decisions
   - **Tech Lead**: Validates map reflects implementation reality

**Action**: Add Wardley Map review to:
- Design review checklist (`/arckit.design-review`)
- Phase gate criteria (Discovery → Alpha → Beta)
- Quarterly architecture review

---

## Support

For issues or questions:
- GitHub Issues: https://github.com/tractorjuice/arc-kit/issues

---

**Last updated**: 2025-10-29
**ArcKit Version**: 0.6.0
