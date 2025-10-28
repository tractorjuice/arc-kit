# UK Government Digital Marketplace Procurement Guide

Complete guide to procuring technology through the UK Government Digital Marketplace using ArcKit.

---

## What is Digital Marketplace?

The **Digital Marketplace** is the UK Government's online procurement platform for buying technology services. All public sector organizations can use it to find and buy:
- Cloud hosting and software
- Digital specialists and outcomes
- Data centre services

**Website**: https://www.digitalmarketplace.service.gov.uk/

---

## Why Use Digital Marketplace?

**Mandatory for UK Government**:
- TCoP Point 11 (Purchasing Strategy) requires considering Digital Marketplace
- Compliant with Crown Commercial Service frameworks
- Pre-approved suppliers (reduces procurement time)
- Auditable decision-making process
- SME-friendly (supports small suppliers)

**Benefits**:
- ✅ **Faster procurement** - Days/weeks instead of months
- ✅ **Pre-vetted suppliers** - Already passed due diligence
- ✅ **Compliant by default** - Frameworks follow government rules
- ✅ **Transparent pricing** - Suppliers publish day rates
- ✅ **Simplified contracts** - Standard terms and conditions
- ✅ **Audit trail** - Built-in documentation

---

## Three Procurement Routes

### 1. G-Cloud Framework

**For**: Cloud services (IaaS, PaaS, SaaS)

**Categories**:
- **Cloud Hosting** - Infrastructure, platforms, datacentre services
- **Cloud Software** - Off-the-shelf applications (CRM, HR, accounting)
- **Cloud Support** - Migration, training, ongoing support

**Examples**:
- AWS/Azure/GCP cloud hosting
- Salesforce, Microsoft 365, Atlassian products
- Cloud migration services
- Security monitoring and support

**When to use**:
- Need cloud hosting or infrastructure
- Buying software-as-a-service
- Cloud migration project
- Ongoing cloud support

**Typical contract value**: £1K - £10M+

### 2. Digital Outcomes and Specialists (DOS)

**For**: Hiring digital specialists or buying digital outcomes

**Categories**:

**A. Digital Outcomes**:
- Complete projects delivered (fixed scope, fixed price)
- Examples: Build a booking system, conduct accessibility audit, design a service

**B. Digital Specialists**:
- Individual specialists (day rate contractors)
- Roles: Product managers, delivery managers, developers, designers, user researchers, architects

**C. User Research**:
- User research studios
- Research participants

**When to use**:
- Need a development team
- Require specific expertise (e.g., enterprise architect, security specialist)
- Want a complete outcome (e.g., "build me a citizen portal")
- Conducting user research

**Typical day rates**: £200 - £1,200/day depending on role and seniority

### 3. Crown Hosting Data Centres

**For**: Physical data centre space and facilities

**When to use**:
- Cannot use cloud (rare - need justification via spend controls)
- Specific security requirements (e.g., SECRET data)
- Legacy systems that cannot be migrated

**Note**: Cloud First policy means this should be **last resort**

---

## How ArcKit Supports Digital Marketplace Procurement

### Step 1: Define Requirements with Digital Marketplace in Mind

```bash
/arckit.requirements Create requirements for digital service supporting G-Cloud procurement
```

**ArcKit helps you**:
- Define requirements compatible with G-Cloud services
- Specify roles for Digital Specialists hiring
- Structure outcomes for DOS outcomes route
- Include mandatory security and compliance requirements

**Key considerations**:
- **Cloud First**: Requirements should favor cloud-native solutions
- **Open Standards**: Ensure no vendor lock-in (TCoP Point 4)
- **Scalability**: Cloud services should auto-scale
- **Security**: Cyber Essentials minimum for suppliers

### Step 2: Choose Procurement Route

**Decision tree ArcKit can help with**:

```
Need cloud services (hosting, software, support)?
    → Use G-Cloud Framework

Need people to work on project?
    → Use Digital Outcomes and Specialists (DOS)
    → Specialists: Hire individuals by role
    → Outcomes: Buy complete deliverable

Need physical data centre?
    → Get spend controls approval first (Cloud First policy)
    → Use Crown Hosting Data Centres
```

### Step 3: Generate SOW Aligned with Digital Marketplace

```bash
/arckit.sow Generate SOW for G-Cloud procurement of cloud hosting services
```

or

```bash
/arckit.sow Generate SOW for Digital Outcomes procurement of citizen portal
```

**ArcKit automatically includes**:

**For G-Cloud SOW**:
- Cloud service categories needed
- Technical specifications (APIs, performance, security)
- Integration requirements
- Support and SLA requirements
- Contract length (typically 12-24 months)

**For DOS Outcomes SOW**:
- Specific outcome desired (what to build/deliver)
- Success criteria
- Deliverables and acceptance criteria
- Timeline and milestones
- Team size if buying specialists

**For DOS Specialists SOW**:
- Roles required (e.g., "2x Senior Developers, 1x Product Manager")
- Skills and experience needed
- Day rate budget range
- Contract length
- IR35 status (inside or outside)

### Step 4: Create Evaluation Criteria

```bash
/arckit.evaluate Create evaluation framework for Digital Marketplace procurement
```

**ArcKit generates**:

**Mandatory Qualifications** (pass/fail):
- [ ] Listed on Digital Marketplace framework
- [ ] Cyber Essentials certified (minimum)
- [ ] Insurance requirements met
- [ ] Relevant case studies provided
- [ ] References available

**Scoring Criteria for G-Cloud** (100 points):
| Criterion | Weight | Points |
|-----------|--------|--------|
| Technical fit | 40% | 40 |
| Price | 30% | 30 |
| Support and SLA | 15% | 15 |
| Security and compliance | 15% | 15 |

**Scoring Criteria for DOS Specialists** (100 points):
| Criterion | Weight | Points |
|-----------|--------|--------|
| Relevant experience | 50% | 50 |
| Skills assessment | 30% | 30 |
| Day rate | 10% | 10 |
| Availability and location | 10% | 10 |

**Scoring Criteria for DOS Outcomes** (100 points):
| Criterion | Weight | Points |
|-----------|--------|--------|
| Proposed approach | 40% | 40 |
| Team experience | 30% | 30 |
| Price | 20% | 20 |
| Timeline and risk | 10% | 10 |

---

## Digital Marketplace Procurement Process

### G-Cloud Procurement Process

**1. Search Digital Marketplace** (1-2 days)
- Go to https://www.digitalmarketplace.service.gov.uk/
- Search for services matching requirements
- Filter by category, price, features
- Shortlist 3-5 suppliers

**2. Further Competition** (optional, 2-4 weeks)
- If multiple suitable suppliers, run mini-competition
- Send requirements to shortlisted suppliers
- Request quotes and proposals
- Evaluate using ArcKit evaluation framework

**3. Direct Award** (for contracts < £100K, 1-2 days)
- Choose supplier directly from marketplace
- Document decision rationale
- Issue purchase order

**4. Award Contract** (1 week)
- Notify successful supplier
- Use standard G-Cloud contract terms
- Define statement of work and SLAs
- Begin service delivery

**Total Time: 1-6 weeks** (much faster than open competition!)

### DOS Outcomes Procurement Process

**1. Publish Requirement** (1 day)
- Post outcome requirement on Digital Marketplace
- Include brief, budget, timeline
- Specify evaluation criteria

**2. Supplier Responses** (2 weeks)
- Suppliers submit proposals
- Typically 5-20 responses

**3. Evaluate Proposals** (1-2 weeks)
```bash
/arckit.evaluate Score [Supplier Name] DOS Outcomes proposal
```
- Use ArcKit to score each proposal
- Check case studies and references
- Interview top candidates if needed

**4. Award and Contract** (1 week)
- Select winner
- Agree detailed statement of work
- Sign contract
- Begin delivery

**Total Time: 4-6 weeks**

### DOS Specialists Procurement Process

**1. Publish Role Requirement** (1 day)
- Post role(s) on Digital Marketplace
- Specify skills, experience, day rate
- Define contract length

**2. Specialist Applications** (1-2 weeks)
- Specialists apply with CVs
- Typically 10-50 applications per role

**3. Shortlist and Interview** (1-2 weeks)
- Review CVs (use ArcKit to score)
- Technical assessment if needed
- Interviews with top 3-5 candidates

**4. Hire and Onboard** (1 week)
- Select specialist(s)
- Agree day rate and contract
- Onboarding and security clearance

**Total Time: 3-5 weeks**

---

## Digital Marketplace SOW Templates in ArcKit

### Example 1: G-Cloud Cloud Hosting

```bash
/arckit.sow Generate SOW for G-Cloud procurement of AWS cloud hosting for digital service
```

**Generated SOW includes**:

**Service Required**: Cloud hosting (IaaS/PaaS)

**Technical Requirements**:
- Cloud provider: AWS (or Azure/GCP as alternative)
- Compute: Auto-scaling EC2/ECS instances
- Storage: S3, EBS
- Database: RDS (PostgreSQL)
- Networking: VPC, load balancers, CloudFront CDN
- Security: WAF, GuardDuty, security groups
- Monitoring: CloudWatch, alerting

**Non-Functional Requirements**:
- 99.99% uptime SLA
- UK data residency (London region)
- Cyber Essentials Plus certification
- 24/7 support with 1-hour response time

**Contract Terms**:
- 12-month initial term
- Monthly invoicing
- 30-day termination notice
- Data export capability

### Example 2: DOS Outcomes - Build Citizen Portal

```bash
/arckit.sow Generate SOW for DOS Outcomes to build GOV.UK citizen self-service portal
```

**Generated SOW includes**:

**Outcome Required**: Citizen self-service portal for [service]

**What Success Looks Like**:
- Citizens can [perform task] online 24/7
- Reduces call centre volume by 40%
- Meets Service Standard (Alpha/Beta/Live)
- WCAG 2.2 Level AA accessible

**Deliverables**:
- Discovery phase report (if needed)
- Alpha prototypes
- Beta service (private and public)
- Live service
- User research reports
- Accessibility statement
- Service manual documentation

**Technical Requirements**:
- GOV.UK Design System
- GOV.UK PaaS or cloud hosting
- Integration with [backend systems]
- GOV.UK Notify for notifications

**Team and Approach**:
- Agile/GDS methodology
- Multidisciplinary team required
- User-centered design
- Show and tells every 2 weeks

**Budget**: £[X] - £[Y]
**Timeline**: [X] months

### Example 3: DOS Specialists - Hire Team

```bash
/arckit.sow Generate SOW for DOS Specialists to hire agile delivery team
```

**Generated SOW includes**:

**Roles Required**:

| Role | Quantity | Seniority | Day Rate Budget |
|------|----------|-----------|-----------------|
| Product Manager | 1 | Senior | £700-900/day |
| Delivery Manager | 1 | Senior | £600-800/day |
| Tech Lead | 1 | Senior | £700-900/day |
| Developer | 3 | Mid-Senior | £500-700/day |
| User Researcher | 1 | Mid | £500-700/day |
| Designer | 1 | Senior | £600-800/day |

**Skills Required**:
- Government Digital Service (GDS) experience
- Agile delivery track record
- [Specific tech stack]
- Security clearance (if needed)

**Contract Details**:
- 6-12 month contracts (renewable)
- Inside IR35
- Location: Hybrid (2 days/week in office)
- Start date: [Date]

---

## ArcKit Digital Marketplace Workflow

### Complete Example: Procure Cloud Services

```bash
# 1. Initialize project
arckit init digital-service-modernization --ai claude
cd digital-service-modernization
claude

# 2. Define requirements for G-Cloud
/arckit.requirements Define cloud hosting requirements for digital service with
10K concurrent users, UK data residency, 99.99% uptime, Cyber Essentials Plus

# 3. Generate G-Cloud SOW
/arckit.sow Generate SOW for G-Cloud procurement of cloud hosting with AWS/Azure,
include security requirements and SLA terms

# 4. Search Digital Marketplace
# (Manual: Go to digitalmarketplace.service.gov.uk and shortlist suppliers)

# 5. Run further competition
/arckit.evaluate Create evaluation framework for G-Cloud hosting providers

# 6. Score supplier proposals
/arckit.evaluate Score AWS proposal for cloud hosting
/arckit.evaluate Score Azure proposal for cloud hosting
/arckit.evaluate Compare all G-Cloud hosting suppliers

# 7. Award contract to winner
# (Manual: Issue purchase order, sign contract)

# 8. Verify delivery meets requirements
/arckit.hld-review Review AWS architecture design for compliance
```

### Complete Example: Hire DOS Specialists

```bash
# 1. Define team needs
/arckit.requirements Define team requirements for agile delivery: Product Manager,
Delivery Manager, Tech Lead, 3 Developers, User Researcher, Designer

# 2. Generate DOS Specialists SOW
/arckit.sow Generate SOW for DOS Specialists procurement of agile delivery team
with GDS experience, 6-month contracts, inside IR35

# 3. Publish roles on Digital Marketplace
# (Manual: Post requirements on DOS framework)

# 4. Create evaluation criteria for each role
/arckit.evaluate Create evaluation framework for DOS Specialists (Product Manager)

# 5. Score applications
/arckit.evaluate Score Jane Smith application for Product Manager role
/arckit.evaluate Score John Doe application for Product Manager role
/arckit.evaluate Compare all Product Manager candidates

# 6. Hire team
# (Manual: Interviews, contract signing, onboarding)
```

---

## Digital Marketplace Best Practices

### 1. Use G-Cloud for Cloud Services

**Always check G-Cloud first**:
- AWS, Azure, GCP all available
- Pre-negotiated government discounts
- Simplified contracts
- Faster than custom procurement

**When to use direct award** (< £100K):
- Clear requirement
- Single obvious supplier
- Low risk

**When to run competition** (> £100K):
- Multiple suitable suppliers
- Complex requirements
- High value/risk

### 2. DOS Outcomes vs DOS Specialists

**Use DOS Outcomes when**:
- You know what you want built
- Fixed scope and budget preferred
- Less ongoing management needed
- Example: "Build a booking system"

**Use DOS Specialists when**:
- Scope is unclear (Discovery/Alpha)
- Need flexibility to pivot
- Want direct control of team
- Ongoing delivery (months/years)

### 3. Make Decision Auditable

**Document in ArcKit**:
- Requirements that led to procurement
- Evaluation criteria used
- Scoring for each supplier
- Justification for selection
- Alternative suppliers considered

**This creates audit trail for**:
- Internal audit
- National Audit Office
- Freedom of Information requests
- Contract disputes

### 4. Consider SMEs

Digital Marketplace is SME-friendly:
- Lower barriers to entry
- Smaller lot sizes available
- Day rate transparency

**In your SOW**:
- Don't over-specify team size (allows smaller suppliers)
- Break into phases (allows SMEs to bid on phases)
- Accept subcontracting

### 5. Align with TCoP

Digital Marketplace procurement naturally supports:
- **Point 5 (Cloud First)**: G-Cloud framework
- **Point 8 (Share and Reuse)**: Pre-built services
- **Point 11 (Purchasing Strategy)**: Compliant procurement
- **Point 13 (Service Standard)**: DOS suppliers understand GDS

---

## Digital Marketplace in ArcKit Templates

### SOW Template Enhancements

When generating SOW, ArcKit detects UK Government context and adds:

**Procurement Route Section**:
```markdown
## Procurement Route

**Framework**: G-Cloud 14 (or current version)

**Category**: Cloud Hosting

**Justification**: This requirement is best met through G-Cloud framework because:
- Standard cloud hosting service
- Multiple pre-approved suppliers available
- Faster than open competition
- Compliant with TCoP Point 11 (Purchasing Strategy)

**Estimated Contract Value**: £[X] - £[Y] per year

**Further Competition**: Yes (contract value > £100K)
```

**Evaluation Criteria Section**:
```markdown
## Evaluation Criteria

### Mandatory Qualifications (Pass/Fail)

- [ ] Listed on G-Cloud 14 framework
- [ ] Cyber Essentials certified (minimum)
- [ ] £10M professional indemnity insurance
- [ ] UK GDPR compliant
- [ ] References from 3+ public sector clients

### Scoring (100 points)

[Standard ArcKit evaluation criteria]
```

### TCoP Assessment Enhancement

When running `/arckit.tcop`, Point 11 assessment includes:

```markdown
### 11. Define Your Purchasing Strategy

**Compliance Status**: [ ] COMPLIANT / [ ] PARTIAL / [ ] NON-COMPLIANT

**Evidence**:
- [ ] Digital Marketplace considered as first option
- [ ] G-Cloud framework used for cloud services
- [ ] DOS framework used for specialists/outcomes
- [ ] Direct award process documented (if < £100K)
- [ ] Further competition run (if > £100K)
- [ ] Decision rationale recorded
- [ ] Alternative procurement routes considered and rejected
- [ ] SME access ensured

**Digital Marketplace Usage**:
| Service | Framework | Supplier | Contract Value | Justification |
|---------|-----------|----------|----------------|---------------|
| Cloud hosting | G-Cloud 14 | AWS | £500K/year | Best fit for requirements |
| Delivery team | DOS | [Supplier] | £1.2M/year | Agile team with GDS experience |

**Findings**:
[Describe Digital Marketplace procurement approach]

**Score**: ___/10
```

---

## Common Digital Marketplace Questions

### Q: Do we have to use Digital Marketplace?

**A**: Not mandatory, but:
- TCoP Point 11 requires considering it
- Often fastest and most compliant route
- Must justify why NOT using it if going elsewhere

### Q: Can we procure directly from AWS/Azure/GCP?

**A**: Better to use G-Cloud because:
- Pre-negotiated government rates
- Compliant contracts
- Simplified process
- Audit trail built-in

### Q: What if our requirement isn't on Digital Marketplace?

**A**: Options:
1. Check if DOS Outcomes could deliver it
2. Request supplier joins framework (they can apply)
3. Use different route (e.g., open competition) but justify

### Q: How do we handle contracts > £5M?

**A**: Additional requirements:
- Cabinet Office spend controls approval
- Apply Social Value Model
- More rigorous competition
- Senior approval required

### Q: Can we negotiate prices?

**A**:
- G-Cloud: Prices are published, limited negotiation
- DOS: Day rates negotiable within budget
- Volume discounts may be available

### Q: What about IR35?

**A**: DOS Specialists:
- You must determine IR35 status
- Inside IR35: Treated as employee (pay PAYE)
- Outside IR35: Contractor (they pay own tax)
- Get advice from finance/HR

---

## Next Steps

1. **Review your requirements**: Ensure they fit Digital Marketplace services
2. **Choose framework**: G-Cloud, DOS Outcomes, or DOS Specialists
3. **Generate SOW**: Use `/arckit.sow` with Digital Marketplace context
4. **Search marketplace**: https://www.digitalmarketplace.service.gov.uk/
5. **Evaluate suppliers**: Use `/arckit.evaluate` for objective scoring
6. **Award contract**: Follow framework rules
7. **Document for audit**: ArcKit creates automatic audit trail

---

## Resources

- **Digital Marketplace**: https://www.digitalmarketplace.service.gov.uk/
- **Buyers Guide**: https://www.gov.uk/guidance/digital-marketplace-buyers-guide
- **G-Cloud**: https://www.gov.uk/guidance/g-cloud-buyers-guide
- **DOS**: https://www.gov.uk/guidance/digital-outcomes-and-specialists-buyers-guide
- **Crown Commercial Service**: https://www.crowncommercial.gov.uk/
- **Spend Controls**: https://www.gov.uk/government/collections/cabinet-office-controls

---

**ArcKit makes Digital Marketplace procurement systematic, auditable, and TCoP-compliant.**
