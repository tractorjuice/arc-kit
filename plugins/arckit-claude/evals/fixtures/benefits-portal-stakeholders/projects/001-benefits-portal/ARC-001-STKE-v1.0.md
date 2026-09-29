# Stakeholder Drivers & Goals Analysis: Housing Benefits Portal

> **Template Origin**: Official | **ArcKit Version**: 6.16.5 | **Command**: `/arckit:stakeholders`

## Document Control

| Field | Value |
|-------|-------|
| **Document ID** | ARC-001-STKE-v1.0 |
| **Document Type** | Stakeholder Drivers & Goals Analysis |
| **Project** | Housing Benefits Portal (Project 001) |
| **Classification** | OFFICIAL-SENSITIVE |
| **Status** | DRAFT |
| **Version** | 1.0 |
| **Created Date** | 2026-09-29 |
| **Last Modified** | 2026-09-29 |
| **Review Cycle** | Monthly |
| **Next Review Date** | 2026-10-29 |
| **Owner** | Priya Nandakumar, Head of Digital (Chair, Design Authority) |
| **Reviewed By** | PENDING |
| **Approved By** | PENDING |
| **Distribution** | Benefits Transformation Board members; Design Authority; Information Governance Group; Transformation Office; project delivery team. Not for onward circulation: contains assessments of named officers and staff-relations matters. |

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| 1.0 | 2026-09-29 | ArcKit AI | Initial creation from `/arckit:stakeholders` command | PENDING | PENDING |

---

## Executive Summary

### Purpose

This document identifies key stakeholders, their underlying drivers (motivations, concerns, needs), how these drivers manifest into goals, and the measurable outcomes that will satisfy those goals. This analysis ensures stakeholder alignment and provides traceability from individual concerns to project success metrics.

It covers Ashcombe District Council's Housing Benefits Portal, a citizen-facing service that replaces a paper and telephone claim process (see `ARC-001-REQ-v1.0`). The governance structure, named officers and known tensions come from the Transformation Office's governance extract of August 2026 [OS-C11]. Where that extract is silent (elected members, SIRO, Product Manager, Delivery Manager, customer services, IT operations), this document states its assumptions explicitly and marks them *(assumed)*.

### Key Findings

The project is shaped by one dominant tension. The Director of Resources carries a £180k-a-year savings target from the benefits service by 2027-28 [OS-C9]. The 22 caseworkers, speaking through their union representative, have already said that the last system change came without training and caused three months of overtime [OS-C10]. If the portal is read as a headcount-reduction vehicle, or is rolled out the same way as the last change, it will face organised resistance from the people whose adoption produces the savings.

There is a strong underlying synergy. Complete online claims with save-and-resume (BR-001, FR-001), online evidence requests (FR-002), and a 14-day decision standard (BR-002) serve claimants, the Service Owner, customer services and the savings case together, *provided* caseworkers are trained and involved from the start.

Two hard gates sit on the critical path: DPO sign-off of claimant-data processing before go-live [OS-C5], and Design Authority approval of the architecture and any new supplier [OS-C3]. Both boards meet on fixed cadences, so late engagement converts directly into schedule slip.

### Critical Success Factors

- **A transparent, agreed savings composition.** The £180k must be broken down by source (print, post and scanning, contact handling, overtime, subsidy-loss avoidance, and establishment managed through vacancies and attrition). The S151 officer must validate it and share it with the union before build begins.
- **No repeat of the last rollout.** All 22 caseworkers are trained before their office goes live, caseworker representatives take part in design, and post-go-live overtime is monitored against a published threshold.
- **Early compliance and architecture gates.** The DPIA starts in discovery and is signed at IGG before private beta. The Design Authority decides architecture and supplier by 30 November 2026.
- **An inclusive channel shift.** The online route is the default, but assisted-digital, telephone and paper routes stay available, because a large share of the remaining Housing Benefit caseload is pension-age.

### Stakeholder Alignment Score

**Overall Alignment**: MEDIUM

Stakeholders agree strongly on the *what*: faster, online, complete claims. They are split on the *how* and *who pays*. The Director of Resources' financial driver and the caseworkers' job-security and workload drivers conflict directly unless the savings plan is explicit about its sources. The DPO and the Head of Digital are aligned on quality and control, but their gates can pull against the 2027-28 savings timetable. Alignment can reach HIGH if Conflicts 1 and 2 (below) are resolved at the October or November 2026 Benefits Transformation Board.

---

## Stakeholder Identification

### Internal Stakeholders

| Stakeholder | Role/Department | Influence | Interest | Engagement Strategy |
|-------------|----------------|-----------|----------|---------------------|
| Daniel Quist | Director of Resources; Section 151 officer; owns the Revenues and Benefits service and its budget [OS-C2]; chairs the Benefits Transformation Board [OS-C7]; proposed SRO *(assumed)* | HIGH | HIGH | Manage Closely: monthly Board, fortnightly SRO check-in with the delivery lead, owner of the savings plan |
| Priya Nandakumar | Head of Digital; chairs the Design Authority, which approves architecture and any new supplier [OS-C3][OS-C6]; owner of `ARC-001-REQ-v1.0` | HIGH | HIGH | Manage Closely: fortnightly Design Authority, co-owner of target architecture and supplier strategy |
| Tom Okafor | Benefits Service Manager; Service Owner for housing benefits; line-manages 22 caseworkers across two offices [OS-C4] | HIGH | HIGH | Manage Closely: weekly service/product review; co-leads the people-change plan |
| Lena Marsh | Data Protection Officer; must sign off claimant-data processing before go-live [OS-C5]; chairs the Information Governance Group [OS-C8] | HIGH | MEDIUM | Manage Closely (critical-path gate): DPIA working sessions from discovery; monthly IGG |
| Caseworkers (22, two offices) and union representative | Revenues and Benefits; raised concerns about the previous system change through their union representative [OS-C10] | MEDIUM (informal, collective) | HIGH | Manage Closely: caseworker design representatives, a champions network in each office, formal consultation via the union |
| Margaret Ellery | Chief Executive; accountable to Full Council [OS-C1] | HIGH | LOW | Keep Satisfied: quarterly briefing via the Director of Resources; Level 4 escalation |
| Transformation Office | Author of the governance extract [OS-C11]; programme/PMO function *(assumed)* | MEDIUM | HIGH | Keep Informed (delivery partner): benefits tracking, board reporting packs |
| Finance Business Partner *(assumed)* | Supports the S151 officer on savings validation and budget monitoring | MEDIUM | MEDIUM | Keep Satisfied: monthly savings-tracker reconciliation |
| Customer Services / contact centre *(assumed)* | Handles telephone and face-to-face claim enquiries today | LOW | MEDIUM | Keep Informed: channel-shift planning, scripts, assisted-digital role |
| IT Operations / Platform team *(assumed)* | Runs the council PostgreSQL platform service used for claim records (DR-001) | MEDIUM | MEDIUM | Keep Informed: non-functional requirements, support model, recovery testing |
| Portfolio Holder for Finance/Resources *(assumed)* | Cabinet member with political responsibility for benefits and budget | HIGH | MEDIUM | Keep Satisfied: briefing before each phase gate; lines to take on staffing |
| Ward Members *(assumed)* | Receive constituent casework and complaints | LOW | LOW | Monitor: members' bulletin at public beta and live |
| Internal Audit *(assumed)* | Assurance over controls, subsidy and data handling | MEDIUM | LOW | Monitor: include in the annual audit plan; share the controls design |

### External Stakeholders

| Stakeholder | Organization | Relationship | Influence | Interest |
|-------------|--------------|--------------|-----------|----------|
| Housing Benefit claimants | Residents of Ashcombe (mainly pension-age claimants and working-age claimants in supported or temporary accommodation) | Service users; beneficiaries | LOW | HIGH |
| Advice agencies | Local Citizens Advice and housing advice services *(assumed)* | Intermediaries who help claimants apply | LOW | HIGH |
| Landlords | Social and private landlords receiving direct payments | Indirect beneficiaries (payment timeliness) | LOW | MEDIUM |
| Department for Work and Pensions | Central government | Policy owner, subsidy funder, data-sharing partner | HIGH | MEDIUM |
| External auditor | Appointed auditor (Housing Benefit subsidy certification) | Assurance over the subsidy claim | HIGH | LOW |
| Information Commissioner's Office | UK regulator | Data protection oversight and enforcement | HIGH | LOW |
| Local Government and Social Care Ombudsman | Statutory ombudsman | Complaints about maladministration | MEDIUM | LOW |
| Delivery supplier(s) | To be selected; subject to Design Authority approval [OS-C3] | Supplier | MEDIUM | HIGH |

### UK Government Digital Roles (GovS 005)

> The [Government Functional Standard for Digital (GovS 005)](https://www.gov.uk/government/publications/government-functional-standard-govs-005-digital) defines mandatory digital governance roles. Include these when the project sits within a UK Government context.
>
> **Local government note**: GovS 005 is mandatory for central government, not district councils. The roles below are adopted as good practice. CDDO spend controls do not apply. The council may choose to align with the GDS Service Standard and MHCLG's Local Digital Declaration.

| Role | Responsibility | Typical Power/Interest | Engagement Strategy |
|------|---------------|----------------------|---------------------|
| Senior Responsible Owner (SRO): Daniel Quist *(proposed)* | Accountable for outcomes, budget and benefits realisation; chairs the Benefits Transformation Board [OS-C7] | HIGH / HIGH | Manage Closely: SRO appointment letter to be confirmed at the October 2026 Board |
| Service Owner: Tom Okafor | Owns the end-to-end housing-benefit service and its user outcomes [OS-C4] | HIGH / HIGH | Manage Closely: weekly service review |
| Product Manager: **unassigned (gap)** | Prioritises the backlog against user needs, BR-002 and the savings plan | MEDIUM / HIGH | Appoint by 31 October 2026, either from the digital team or a senior caseworker seconded to the role |
| Delivery Manager: **unassigned (gap)**; Transformation Office candidate | Manages cadence, risks, dependencies and board reporting | MEDIUM / HIGH | Appoint by 31 October 2026; owns the RAID log |
| CDDO | Cross-government assurance and spend control | N/A / N/A | Not applicable to a district council; the Design Authority performs the equivalent local technical assurance |
| CDIO equivalent: Priya Nandakumar | Council digital strategy and technology oversight via the Design Authority [OS-C3] | HIGH / HIGH | Manage Closely (covered above) |
| DDaT Profession Lead equivalent: Priya Nandakumar | Digital capability, skills and recruitment | LOW / MEDIUM | Monitor: capability plan for in-house support after live |

### UK Government Security Roles (GovS 007)

> The [Government Functional Standard for Security (GovS 007)](https://www.gov.uk/government/publications/government-functional-standard-govs-007-security) defines mandatory protective security roles. Include these when the project sits within a UK Government context.
>
> **Local government note**: The governance extract names no SIRO or security lead. These are gaps to close before the DPIA is signed.

| Role | Responsibility | Typical Power/Interest | Engagement Strategy |
|------|---------------|----------------------|---------------------|
| Senior Security Risk Owner (SSRO): **not named** | Board-level protective-security risk | HIGH / MEDIUM | Confirm whether the council designates one; otherwise the SIRO covers this |
| Departmental Security Officer (DSO): **not applicable** | Central-government role | N/A / N/A | The council IT security lead performs the equivalent day-to-day role |
| Senior Information Risk Owner (SIRO): **not named (gap)** | Owns information risk and signs risk acceptance | HIGH / MEDIUM | Confirm the holder by 31 October 2026. If this is the Director of Resources (common in districts), record the separation from the SRO role in the RACI. |
| Cyber Security Lead: IT security lead *(assumed)* | Security architecture review, penetration testing, DWP data-sharing security conditions | MEDIUM / HIGH | Keep Informed: Design Authority attendee for security items |

### Stakeholder Power-Interest Grid

```text
                                INTEREST
                  Low                               High
        ┌───────────────────────────────┬───────────────────────────────┐
        │        KEEP SATISFIED         │        MANAGE CLOSELY         │
        │                               │                               │
   High │ • Chief Executive (M. Ellery) │ • Director of Resources / SRO │
        │ • Portfolio Holder (assumed)  │   (D. Quist)                  │
        │ • DWP                         │ • Head of Digital             │
 P      │ • External auditor            │   (P. Nandakumar)             │
 O      │ • ICO                         │ • Service Owner (T. Okafor)   │
 W      │ • Finance Business Partner    │ • DPO (L. Marsh)              │
 E      │                               │ • Caseworkers + union rep *   │
 R      ├───────────────────────────────┼───────────────────────────────┤
        │            MONITOR            │         KEEP INFORMED         │
        │                               │                               │
   Low  │ • Ward Members                │ • Claimants                   │
        │ • Internal Audit              │ • Advice agencies             │
        │ • LGSCO                       │ • Landlords                   │
        │                               │ • Customer Services           │
        │                               │ • IT Operations / Platform    │
        │                               │ • Transformation Office       │
        │                               │ • Delivery supplier(s)        │
        └───────────────────────────────┴───────────────────────────────┘
  * Formal power MEDIUM, but collective power over adoption is high
    given the prior grievance [OS-C10], so they are managed closely.
```

| Stakeholder | Power | Interest | Quadrant | Engagement Strategy |
|-------------|-------|----------|----------|---------------------|
| Daniel Quist (Director of Resources / SRO) | HIGH | HIGH | Manage Closely | Monthly Board; fortnightly SRO check-in; owns savings plan |
| Priya Nandakumar (Head of Digital) | HIGH | HIGH | Manage Closely | Fortnightly Design Authority; architecture co-ownership |
| Tom Okafor (Service Owner) | HIGH | HIGH | Manage Closely | Weekly service review; co-leads change plan |
| Lena Marsh (DPO) | HIGH | MEDIUM | Manage Closely | DPIA co-production from discovery; monthly IGG |
| Caseworkers and union representative | MEDIUM | HIGH | Manage Closely | Co-design, champions, formal union consultation |
| Margaret Ellery (Chief Executive) | HIGH | LOW | Keep Satisfied | Quarterly briefing via SRO |
| Portfolio Holder *(assumed)* | HIGH | MEDIUM | Keep Satisfied | Pre-gate briefings; staffing lines to take |
| DWP | HIGH | MEDIUM | Keep Satisfied | Data-sharing conditions; subsidy compliance evidence |
| External auditor | HIGH | LOW | Keep Satisfied | Walk-through of evidence capture and audit trail before live |
| ICO | HIGH | LOW | Keep Satisfied | No direct engagement; satisfied through the DPIA and privacy notice |
| Finance Business Partner *(assumed)* | MEDIUM | MEDIUM | Keep Satisfied | Monthly savings reconciliation |
| Claimants | LOW | HIGH | Keep Informed | User research, beta feedback, GOV.UK-style content |
| Advice agencies | LOW | HIGH | Keep Informed | Beta partner sessions; intermediary guidance |
| Landlords | LOW | MEDIUM | Keep Informed | Landlord bulletin at public beta |
| Customer Services *(assumed)* | LOW | MEDIUM | Keep Informed | Channel-shift briefings; assisted-digital training |
| IT Operations / Platform *(assumed)* | MEDIUM | MEDIUM | Keep Informed | Non-functional requirement reviews; runbook handover |
| Transformation Office | MEDIUM | HIGH | Keep Informed | Benefits tracker; board packs |
| Delivery supplier(s) | MEDIUM | HIGH | Keep Informed | Contract governance through the Design Authority |
| Ward Members *(assumed)* | LOW | LOW | Monitor | Members' bulletin at milestones |
| Internal Audit *(assumed)* | MEDIUM | LOW | Monitor | Controls design shared; audit plan entry |
| LGSCO | MEDIUM | LOW | Monitor | Complaints trend monitored monthly |

**Quadrant Interpretation:**

- **Manage Closely** (High Power, High Interest): Key decision-makers requiring active engagement
- **Keep Satisfied** (High Power, Low Interest): Influential stakeholders needing periodic updates
- **Keep Informed** (Low Power, High Interest): Engaged stakeholders needing regular communication
- **Monitor** (Low Power, Low Interest): Minimal engagement required

---

## Stakeholder Drivers Analysis

### SD-1: Director of Resources - Deliver the £180k savings target

**Stakeholder**: Daniel Quist, Director of Resources (S151 officer, proposed SRO)

**Driver Category**: FINANCIAL

**Driver Statement**: Deliver £180k a year of recurring savings from the benefits service by 2027-28 [OS-C9] so that it can be banked in the council's medium-term financial plan.

**Context & Background**: District councils are under sustained funding pressure. As S151 officer, Daniel Quist has a statutory duty for the council's financial administration [OS-C2], so this target is also his personal and professional commitment to members. If the whole £180k came from staffing, it would equal roughly 4–5 FTE at an assumed £38–42k fully loaded cost per caseworker, which is about 20% of the 22-caseworker establishment. Staff will do this arithmetic themselves, which is why the composition of the savings matters as much as the total (see Conflict 1).

**Driver Intensity**: CRITICAL

**Enablers** (What would help):

- A savings plan broken down by source and validated by Finance before build begins
- Early, high digital take-up that reduces print, post, scanning and telephone handling
- Vacancy management and natural attrition rather than compulsory redundancy

**Blockers** (What would hinder):

- Go-live slipping beyond mid-2027, which leaves too little of 2027-28 to reach the full run rate
- Low take-up among pension-age claimants, which reduces channel-shift savings
- Industrial-relations dispute or productivity dip after go-live (repeat of [OS-C10])

**Related Stakeholders**:

- Caseworkers and union (conflicting: job security, workload)
- Tom Okafor (partly conflicting: team capacity during transition)
- Portfolio Holder (aligned on savings; sensitive to job-loss headlines)

---

### SD-2: Director of Resources - Protect subsidy and budget control

**Stakeholder**: Daniel Quist, Director of Resources (S151 officer)

**Driver Category**: RISK

**Driver Statement**: Avoid losing Housing Benefit subsidy through local-authority error and keep the programme within budget, so that the S151 officer is not reporting overspends or subsidy clawback to members.

**Context & Background**: DWP reimburses most Housing Benefit expenditure through subsidy. Overpayments caused by local-authority error lose subsidy once they exceed DWP thresholds (currently 0.48% lower and 0.54% upper, to be confirmed against current DWP subsidy guidance). The external auditor certifies the subsidy claim. Poorer evidence capture in a new system could raise error rates.

**Driver Intensity**: HIGH

**Enablers** (What would help):

- Structured evidence capture and a caseworker evidence-request workflow (FR-002)
- A full audit trail of claim changes and decisions
- Early walk-through of the design with the external auditor

**Blockers** (What would hinder):

- Data migration errors or parallel-running inconsistencies
- Caseworkers bypassing the new workflow because they were not trained

**Related Stakeholders**:

- External auditor, DWP (aligned)
- Head of Digital (aligned on audit trail and data quality)

---

### SD-3: Chief Executive - Reputation and accountability to Full Council

**Stakeholder**: Margaret Ellery, Chief Executive

**Driver Category**: STRATEGIC

**Driver Statement**: Show Full Council [OS-C1] that the council is modernising services and meeting its budget without a visible service failure or staff dispute.

**Context & Background**: Benefits failures are highly visible. They surface as member casework, local press coverage, Ombudsman complaints and hardship for vulnerable residents. The Chief Executive's interest will be low while things go well and will rise sharply if they do not.

**Driver Intensity**: MEDIUM

**Enablers** (What would help):

- Clear phase-gate reporting from the SRO
- Early wins (for example, a private beta with positive claimant feedback)

**Blockers** (What would hinder):

- Industrial action or a public union statement
- Claim backlog or processing times rising after go-live

**Related Stakeholders**:

- Director of Resources (escalation route), Portfolio Holder

---

### SD-4: Head of Digital - Architectural coherence and supplier control

**Stakeholder**: Priya Nandakumar, Head of Digital

**Driver Category**: STRATEGIC

**Driver Statement**: Make sure the portal fits the council's target architecture, reuses platform services, and does not create new supplier lock-in. The Design Authority she chairs approves architecture decisions and any new supplier [OS-C3].

**Context & Background**: The requirements already commit to the council's PostgreSQL platform service with point-in-time recovery (DR-001), which shows that platform reuse is intended. Revenues and benefits software markets are concentrated, and add-on e-claim modules from the incumbent system supplier are a common fast path that can deepen lock-in. The Head of Digital owns the requirements document, so the design will be judged against her standards.

**Driver Intensity**: HIGH

**Enablers** (What would help):

- An options appraisal (build on platform, buy an e-claims module, or a hybrid) brought to the Design Authority early
- Documented architecture principles (`ARC-000-PRIN` does not yet exist)
- Contract clauses for exit and data portability

**Blockers** (What would hinder):

- Schedule pressure from SD-1 forcing a supplier decision before the options are properly appraised
- Fortnightly Design Authority cadence [OS-C6] not planned into the critical path

**Related Stakeholders**:

- Director of Resources (tension: speed and cost versus architectural quality)
- IT Operations (aligned: supportability)
- DPO (aligned: privacy by design)

---

### SD-5: Head of Digital - Credibility of the digital function

**Stakeholder**: Priya Nandakumar, Head of Digital

**Driver Category**: PERSONAL

**Driver Statement**: Deliver a visible, well-received citizen-facing service that rebuilds confidence in digital change after the previous system rollout was badly received by staff [OS-C10].

**Context & Background**: The governance extract does not say who led the previous change. Whoever did, staff are likely to associate "the new system" with digital. A successful portal strengthens the case for further service redesign across the council.

**Driver Intensity**: MEDIUM

**Enablers** (What would help):

- User-centred delivery with caseworkers visibly shaping the product
- Published service performance data

**Blockers** (What would hinder):

- Being held responsible for business-change failings outside the digital team's control

**Related Stakeholders**:

- Tom Okafor, caseworkers (co-dependency on adoption)

---

### SD-6: Service Owner - Meet the 14-day decision standard

**Stakeholder**: Tom Okafor, Benefits Service Manager and Service Owner

**Driver Category**: OPERATIONAL

**Driver Statement**: Issue claim decisions within 14 calendar days of a complete submission (BR-002) and cut the time his team loses to incomplete claims and chasing evidence.

**Context & Background**: Tom Okafor is accountable for service performance across two offices and 22 caseworkers [OS-C4]. Paper and telephone claims usually arrive incomplete, which starts a cycle of evidence requests that inflates processing time. DWP publishes local-authority speed-of-processing statistics, so performance is publicly comparable.

**Driver Intensity**: CRITICAL

**Enablers** (What would help):

- Guided online forms with validation, plus save-and-resume (FR-001), so that more claims arrive complete
- Online evidence requests and uploads (FR-002)
- Work queues and management information on claim age

**Blockers** (What would hinder):

- A productivity dip during transition with no backfill
- Running paper and digital processes in parallel for longer than planned

**Related Stakeholders**:

- Claimants (strongly aligned)
- Director of Resources (aligned on productivity; tension on staffing)

---

### SD-7: Service Owner - Protect the team and his credibility with it

**Stakeholder**: Tom Okafor, Benefits Service Manager

**Driver Category**: PERSONAL

**Driver Statement**: Avoid repeating the last rollout, which caseworkers say came without training and caused three months of overtime [OS-C10], and keep the trust of the team he line-manages.

**Context & Background**: A Service Owner who sided with an unpopular change once cannot easily do so again. Tom Okafor is likely to support the portal publicly and privately press hard for training, backfill and realistic go-live dates. He is the key bridge between the Board and the caseworkers.

**Driver Intensity**: HIGH

**Enablers** (What would help):

- A training plan and backfill budget written into the business case
- The authority to hold go-live in his office if readiness criteria are not met

**Blockers** (What would hinder):

- Go-live dates driven only by the savings timetable
- Savings messaging that implies job losses

**Related Stakeholders**:

- Caseworkers and union (aligned)
- Director of Resources (tension on timeline and staffing)

---

### SD-8: Caseworkers and union representative - Training, workload and job security

**Stakeholder**: 22 caseworkers across two offices, represented by their trade union representative [OS-C4][OS-C10]

**Driver Category**: OPERATIONAL

**Driver Statement**: Be properly trained before go-live, avoid another stretch of forced overtime, and not lose jobs to a system they are asked to make work.

**Context & Background**: The grievance is specific, recent and formally raised through the union [OS-C10]. The savings target [OS-C9] will be visible to staff. Caseworkers hold the tacit knowledge of the claim rules and evidence standards, so a portal designed without them will have gaps that surface as rework after go-live.

**Driver Intensity**: CRITICAL

**Enablers** (What would help):

- Role-based training completed before go-live, with sandbox practice
- Caseworker representatives in design sprints and user acceptance testing
- A written commitment on how savings will be achieved (for example, no compulsory redundancies, subject to the council's decision)

**Blockers** (What would hinder):

- Training squeezed out by schedule pressure
- A single "big bang" go-live across both offices

**Related Stakeholders**:

- Tom Okafor (aligned)
- Director of Resources (conflicting)

---

### SD-9: DPO - Lawful processing of claimant data

**Stakeholder**: Lena Marsh, Data Protection Officer and Chair of the Information Governance Group

**Driver Category**: COMPLIANCE

**Driver Statement**: Make sure claimant data is processed lawfully and securely, with a signed DPIA and an agreed retention schedule. She must sign off processing before go-live [OS-C5], and the Information Governance Group decides DPIA sign-off and retention [OS-C8].

**Context & Background**: Housing Benefit claims involve financial, household, health and disability information about vulnerable people, including special category data. Online submission, document upload, DWP data sharing and six-year evidence retention (DR-002) all fall within the DPIA's scope. The ICO can take enforcement action, and a breach involving benefits data would be highly damaging.

**Driver Intensity**: CRITICAL

**Enablers** (What would help):

- DPIA drafted from discovery onward rather than presented at the end
- Clear data flows and a processor agreement with any supplier
- Automated retention and deletion on the platform

**Blockers** (What would hinder):

- The DPIA first presented shortly before go-live, when the monthly IGG cadence leaves no time to fix issues
- Unclear SIRO ownership of risk acceptance

**Related Stakeholders**:

- Head of Digital (aligned: privacy by design)
- Director of Resources (tension: gate timing)

---

### SD-10: Claimants - Claim easily and get a fast decision

**Stakeholder**: Housing Benefit claimants

**Driver Category**: CUSTOMER

**Driver Statement**: Claim without visiting an office (BR-001), pause and come back to a claim (FR-001), and get a decision quickly (BR-002) so that rent arrears and eviction risk do not build up.

**Context & Background**: Claimants are often in financial stress. Delays translate into arrears, and landlords may start possession action. The remaining Housing Benefit caseload is increasingly pension-age claimants and working-age claimants in supported or temporary accommodation, because DWP has moved most working-age claimants to Universal Credit.

**Driver Intensity**: CRITICAL

**Enablers** (What would help):

- A mobile-first, plain-language service with photo upload of evidence
- Progress updates and clear evidence requests

**Blockers** (What would hinder):

- Complex forms and inaccessible design
- Mandatory account creation or identity steps that exclude people

**Related Stakeholders**:

- Tom Okafor (aligned); advice agencies (aligned); landlords (aligned)

---

### SD-11: Digitally excluded and vulnerable claimants, and advice agencies - Inclusion

**Stakeholder**: Claimants with low digital access, skills or confidence, and the advice agencies that help them

**Driver Category**: CUSTOMER

**Driver Statement**: Keep a fair, accessible route to claim for people who cannot or will not use the portal. The council is bound by the Public Sector Equality Duty (Equality Act 2010) and the Public Sector Bodies Accessibility Regulations 2018.

**Context & Background**: Pension-age claimants have lower digital take-up. Advice agencies often submit claims on behalf of clients and need an intermediary-friendly route.

**Driver Intensity**: HIGH

**Enablers** (What would help):

- Assisted-digital support in customer services and at advice partners
- Paper and telephone routes kept; an Equality Impact Assessment (EqIA) completed before public beta

**Blockers** (What would hinder):

- A savings model that assumes close to 100% digital take-up and pressures teams to withdraw other routes

**Related Stakeholders**:

- Director of Resources (tension: channel-shift savings)
- Customer Services (aligned: assisted digital)

---

### SD-12: Elected Members - Political accountability

**Stakeholder**: Portfolio Holder for Finance/Resources and Ward Members *(assumed; not in the governance extract)*

**Driver Category**: STRATEGIC

**Driver Statement**: Deliver the budget without job-loss headlines and without a rise in constituent complaints about benefits.

**Context & Background**: Budget savings are agreed politically. Members field the complaints when claims are delayed and will be asked about staffing if the union raises concerns publicly.

**Driver Intensity**: MEDIUM

**Enablers** (What would help):

- A briefing before each phase gate, including staffing lines to take

**Blockers** (What would hinder):

- Learning about problems from constituents or the press first

**Related Stakeholders**:

- Chief Executive, Director of Resources

---

### SD-13: DWP and external auditor - Subsidy accuracy and data-sharing compliance

**Stakeholder**: Department for Work and Pensions; the council's external auditor

**Driver Category**: COMPLIANCE

**Driver Statement**: Make sure Housing Benefit is paid accurately, the subsidy claim can be certified, and the council meets DWP data-sharing conditions for access to DWP systems.

**Context & Background**: The council administers Housing Benefit on DWP's behalf. Any change to how evidence and decisions are recorded affects the audit trail that the auditor tests.

**Driver Intensity**: HIGH

**Enablers** (What would help):

- An immutable audit trail of claims, decisions and the evidence relied on
- Early walk-through with the auditor

**Blockers** (What would hinder):

- Changes that alter DWP data flows without meeting DWP's security conditions

**Related Stakeholders**:

- Director of Resources (SD-2, aligned); DPO (aligned)

---

### SD-14: Customer Services - Reduce avoidable contact

**Stakeholder**: Customer Services / contact centre *(assumed)*

**Driver Category**: OPERATIONAL

**Driver Statement**: Reduce "where's my claim?" calls and face-to-face visits so that advisers can focus on complex and vulnerable callers.

**Context & Background**: The current process is paper and telephone based, so customer services absorbs much of the failure demand.

**Driver Intensity**: MEDIUM

**Enablers** (What would help):

- Claim status and progress notifications in the portal
- An assisted-digital script and training

**Blockers** (What would hinder):

- A surge of support calls at launch with no preparation

**Related Stakeholders**:

- Claimants, Tom Okafor (aligned)

---

### SD-15: IT Operations / Platform team - Supportable, recoverable service

**Stakeholder**: IT Operations / Platform team *(assumed)*

**Driver Category**: OPERATIONAL

**Driver Statement**: Operate the portal on standard platform services, including the PostgreSQL service with point-in-time recovery (DR-001), with clear runbooks, monitoring and supplier support boundaries.

**Context & Background**: A small district IT team cannot absorb bespoke infrastructure. Recovery obligations and six-year retention (DR-002) have storage and operational implications.

**Driver Intensity**: MEDIUM

**Enablers** (What would help):

- Early non-functional requirements, a support model and an operational-readiness pack

**Blockers** (What would hinder):

- Supplier-hosted components outside the platform with unclear support ownership

**Related Stakeholders**:

- Head of Digital (aligned)

---

## Driver-to-Goal Mapping

### Goal G-1: Launch a complete online claim channel

**Derived From Drivers**: SD-1, SD-6, SD-10, SD-14

**Goal Owner**: Tom Okafor (Service Owner)

**Goal Statement**: Enable citizens to submit a complete Housing Benefit claim online with save-and-resume (BR-001, FR-001). Private beta in one office by 28 February 2027, public beta by 31 May 2027 and full live across both offices by 31 October 2027. At least 60% of new claims should be submitted online within six months of full live.

**Why This Matters**: The online channel is the mechanism behind almost every other benefit: complete claims (SD-6), channel-shift savings (SD-1), claimant convenience (SD-10) and less avoidable contact (SD-14). The 60% target is deliberately below typical working-age benchmarks because of the pension-age caseload mix.

**Success Metrics**:

- **Primary Metric**: Percentage of new claims submitted online
- **Secondary Metrics**:
  - Online completion rate (started versus submitted), target ≥ 75%
  - Percentage of online claims complete at first submission, target ≥ 70%

**Baseline**: 0% online today (paper and telephone process). Current share of claims complete at first submission to be measured in discovery by 31 October 2026.

**Target**: ≥ 60% online share by 30 April 2028

**Measurement Method**: Portal analytics and the benefits system's claim-source field, reported monthly to the Benefits Transformation Board

**Dependencies**:

- Design Authority architecture and supplier decision (G-6)
- DPIA signed before private beta (G-5)

**Risks to Achievement**:

- Lower digital take-up among pension-age claimants (R-5)
- Supplier or architecture decision delays (R-7)

---

### Goal G-2: Decide claims within 14 days

**Derived From Drivers**: SD-6, SD-10, SD-3

**Goal Owner**: Tom Okafor (Service Owner)

**Goal Statement**: Issue at least 90% of new-claim decisions within 14 calendar days of a complete submission (BR-002) by Q4 2027-28 (January to March 2028). Separately publish the end-to-end time from first contact to decision.

**Why This Matters**: This is the outcome claimants feel and the measure by which the Service Owner's performance is judged publicly. Publishing both measures prevents the definition of "complete" being used to flatter performance (see Conflict 5).

**Success Metrics**:

- **Primary Metric**: Percentage of new claims decided within 14 days of complete submission
- **Secondary Metrics**:
  - Mean end-to-end days from first contact to decision
  - Number of evidence requests per claim

**Baseline**: To be extracted from the benefits system in discovery by 31 October 2026. National average new-claim processing is around three weeks, so the local baseline is expected to be similar or longer.

**Target**: ≥ 90% within 14 days; end-to-end mean ≤ 18 days

**Measurement Method**: Benefits-system management information, weekly to the Service Owner and monthly to the Board; cross-checked against DWP speed-of-processing returns

**Dependencies**:

- G-1 (complete online claims), G-4 (trained caseworkers), FR-002 evidence requests

**Risks to Achievement**:

- Transition productivity dip (R-1)
- Parallel running of paper and digital routes

---

### Goal G-3: Realise £180k recurring savings through a transparent plan

**Derived From Drivers**: SD-1, SD-2, SD-8, SD-12

**Goal Owner**: Daniel Quist (Director of Resources / SRO)

**Goal Statement**: Reach an annualised run rate of £180k recurring savings from the benefits service by 31 March 2028 [OS-C9]. Finance must validate the savings breakdown by source, and it must be shared with the union through formal consultation by 31 December 2026.

**Why This Matters**: This meets the S151 officer's target and reduces caseworker anxiety by making the sources of savings explicit (see Conflict 1).

**Success Metrics**:

- **Primary Metric**: Annualised recurring savings validated by Finance (£)
- **Secondary Metrics**:
  - Savings by source against plan (illustrative split for Finance to validate: print, post and scanning £45k; contact handling £35k; overtime and agency £30k; subsidy-loss avoidance £20k; establishment through vacancy management and attrition £50k)
  - Cashable versus non-cashable savings

**Baseline**: 2026-27 benefits service budget (Finance to confirm)

**Target**: £180k annualised run rate by 31 March 2028

**Measurement Method**: Monthly Finance savings tracker reconciled to the ledger; reported to the Benefits Transformation Board

**Dependencies**:

- G-1 take-up, G-2 productivity, G-4 stable adoption

**Risks to Achievement**:

- Savings attribution gap (R-4)
- Industrial-relations dispute (R-2)
- Falling Housing Benefit caseload (R-9)

---

### Goal G-4: Get the workforce ready with no repeat of the last rollout

**Derived From Drivers**: SD-7, SD-8, SD-5, SD-3

**Goal Owner**: Tom Okafor (Service Owner)

**Goal Statement**: All 22 caseworkers complete role-based training at least 10 working days before their office goes live. At least one caseworker representative from each office takes part in every sprint review from alpha onward. Caseworker overtime in the three months after each office goes live stays at or below 110% of the prior six-month average.

**Why This Matters**: This goal directly answers the grievance [OS-C10]. It is also the precondition for G-2 and G-3.

**Success Metrics**:

- **Primary Metric**: Percentage of caseworkers trained ≥ 10 working days before go-live
- **Secondary Metrics**:
  - Overtime hours per month against the six-month pre-go-live baseline
  - Caseworker pulse-survey confidence score (target ≥ 70% "confident" at go-live)

**Baseline**: 0% trained. Overtime baseline from payroll for April to September 2026. Pulse-survey baseline to be taken in October 2026.

**Target**: 100% trained; overtime ≤ 110% of baseline; confidence ≥ 70%

**Measurement Method**: Learning records, payroll overtime report, quarterly pulse survey

**Dependencies**:

- Training environment available at least six weeks before private beta
- Backfill budget approved by the Board

**Risks to Achievement**:

- Schedule compression removing training time (R-1)

---

### Goal G-5: Pass the compliance gate on time

**Derived From Drivers**: SD-9, SD-13, SD-2

**Goal Owner**: Lena Marsh (DPO)

**Goal Statement**: The DPIA is signed off by the Information Governance Group [OS-C8] before private beta (target: January 2027 IGG). The DPO signs off claimant-data processing before go-live [OS-C5]. The six-year evidence retention schedule (DR-002) is approved. There are zero reportable personal-data breaches in the first 12 months of live service.

**Why This Matters**: This is a hard gate. Without it there is no go-live, and a late gate pushes back every savings and service goal.

**Success Metrics**:

- **Primary Metric**: DPIA sign-off date against plan
- **Secondary Metrics**:
  - Number of reportable breaches (ICO notifications)
  - Retention and deletion jobs executed as scheduled

**Baseline**: No DPIA exists for the portal. The SIRO is not named.

**Target**: DPIA signed at January 2027 IGG; zero reportable breaches

**Measurement Method**: IGG minutes; breach log; platform retention-job reports

**Dependencies**:

- SIRO confirmed; supplier processor agreement; data-flow design from the Design Authority

**Risks to Achievement**:

- Late DPIA (R-3); unclear risk ownership (R-6)

---

### Goal G-6: Approve architecture and supplier by 30 November 2026

**Derived From Drivers**: SD-4, SD-15, SD-1

**Goal Owner**: Priya Nandakumar (Head of Digital)

**Goal Statement**: The Design Authority approves the target architecture and any new supplier [OS-C3] by 30 November 2026. This is based on an options appraisal (build on platform, buy an e-claims module, or a hybrid) that reuses the council PostgreSQL platform service (DR-001) and includes exit and data-portability terms.

**Why This Matters**: This unblocks procurement and build in time for a February 2027 private beta. It also protects long-term cost and flexibility, which serves both SD-4 and SD-1.

**Success Metrics**:

- **Primary Metric**: Design Authority decision date
- **Secondary Metrics**:
  - Portal availability ≥ 99.5% in service hours after live
  - Successful point-in-time-recovery test before public beta

**Baseline**: No architecture decision recorded; `ARC-000-PRIN` not yet created

**Target**: Decision by 30 November 2026; recovery test passed by 30 April 2027

**Measurement Method**: Design Authority minutes and architecture decision records; platform monitoring

**Dependencies**:

- Architecture principles; requirements expanded to include non-functional and integration requirements

**Risks to Achievement**:

- Design Authority decision latency (R-7)

---

### Goal G-7: Build an inclusive, accessible service

**Derived From Drivers**: SD-11, SD-10, SD-12

**Goal Owner**: Tom Okafor (Service Owner), with the Head of Digital for accessibility

**Goal Statement**: Complete an Equality Impact Assessment before public beta (31 May 2027). The portal meets WCAG 2.2 AA, which exceeds the WCAG 2.1 AA legal minimum. Assisted-digital, telephone and paper routes are kept throughout 2027-28. User satisfaction is at least 80% by 31 March 2028.

**Why This Matters**: This protects vulnerable claimants and the council's equality duty, and keeps the savings model honest.

**Success Metrics**:

- **Primary Metric**: User satisfaction (post-submission survey)
- **Secondary Metrics**:
  - Accessibility audit issues open at public beta (target: zero at AA level)
  - Assisted-digital sessions per month

**Baseline**: No online service; no satisfaction measure exists today

**Target**: ≥ 80% satisfaction; zero open AA issues; published accessibility statement

**Measurement Method**: Exit survey; independent accessibility audit; customer-services logs

**Dependencies**:

- User research with pension-age claimants and advice agencies

**Risks to Achievement**:

- Low take-up among excluded groups (R-5)

---

### Goal G-8: Protect subsidy through structured evidence

**Derived From Drivers**: SD-2, SD-13, SD-6

**Goal Owner**: Daniel Quist (Director of Resources)

**Goal Statement**: Keep local-authority-error overpayments below the DWP lower subsidy threshold in 2027-28, supported by structured online evidence capture and caseworker evidence requests (FR-002). There should be no qualification of the subsidy certification attributable to the portal.

**Why This Matters**: This avoids subsidy loss, which would erode the savings case, and satisfies the auditor.

**Success Metrics**:

- **Primary Metric**: Local-authority-error overpayments as a percentage of total expenditure
- **Secondary Metrics**:
  - Auditor findings attributable to portal processes

**Baseline**: 2025-26 subsidy claim position (Finance to confirm)

**Target**: Below the lower threshold; zero portal-attributable findings

**Measurement Method**: Subsidy claim workings; external auditor certification report

**Dependencies**:

- G-4 (caseworkers using structured workflow); audit trail design (G-6)

**Risks to Achievement**:

- Migration errors; workarounds by untrained staff (R-1)

---

## Goal-to-Outcome Mapping

### Outcome O-1: Faster decisions for claimants

**Supported Goals**: G-1, G-2, G-8

**Outcome Statement**: At least 90% of new claims are decided within 14 days of complete submission, and mean end-to-end time is 18 days or less, by Q4 2027-28.

**Measurement Details**:

- **KPI**: New-claim decisions within 14 days (%)
- **Current Value**: To be baselined by 31 October 2026 (estimated three weeks or more end to end)
- **Target Value**: ≥ 90% within 14 days; end-to-end mean ≤ 18 days
- **Measurement Frequency**: Weekly (operational), Monthly (Board)
- **Data Source**: Benefits-system management information; DWP speed-of-processing returns
- **Report Owner**: Tom Okafor

**Business Value**:

- **Financial Impact**: Less arrears-driven hardship and fewer discretionary housing payment requests; fewer chasing contacts
- **Strategic Impact**: Performance is publicly comparable with other councils
- **Operational Impact**: Fewer evidence cycles per claim
- **Customer Impact**: Less arrears and eviction risk for claimants

**Timeline**:

- **Phase 1 (Months 1-3, Oct–Dec 2026)**: Baseline established; performance dashboard live
- **Phase 2 (Months 4-6, Jan–Mar 2027)**: Private-beta claims tracked separately; 14-day rate for beta cohort ≥ 75%
- **Phase 3 (Months 7-12, Apr–Sep 2027)**: Public beta; 14-day rate ≥ 85% for online claims
- **Sustainment (Year 2+, 2027-28 onward)**: ≥ 90% across all channels by Q4 2027-28

**Stakeholder Benefits**:

- **Claimants**: Faster decisions and certainty
- **Tom Okafor**: Delivers BR-002 and public performance credibility
- **Landlords**: Timelier payments

**Leading Indicators** (early signals of success):

- Percentage of online claims complete at first submission
- Evidence requests per claim falling

**Lagging Indicators** (final proof of success):

- 14-day decision rate
- DWP published processing times

---

### Outcome O-2: £180k recurring savings realised

**Supported Goals**: G-1, G-2, G-3, G-8

**Outcome Statement**: An annualised £180k of recurring savings from the benefits service is achieved and banked by 31 March 2028 [OS-C9], with no compulsory redundancies (recommended, subject to Board and member decision).

**Measurement Details**:

- **KPI**: Validated annualised recurring savings (£)
- **Current Value**: £0
- **Target Value**: £180k run rate
- **Measurement Frequency**: Monthly
- **Data Source**: Finance savings tracker and ledger
- **Report Owner**: Finance Business Partner, for Daniel Quist

**Business Value**:

- **Financial Impact**: £180k a year recurring; subsidy-loss avoidance
- **Strategic Impact**: Contributes to the medium-term financial plan
- **Operational Impact**: Lower print, post, scanning and contact-handling volumes
- **Customer Impact**: Neutral to positive, provided G-7 holds

**Timeline**:

- **Phase 1 (Months 1-3, Oct–Dec 2026)**: Savings breakdown validated and consulted on
- **Phase 2 (Months 4-6, Jan–Mar 2027)**: Budget 2027-28 set with phased savings profile
- **Phase 3 (Months 7-12, Apr–Sep 2027)**: Non-staff savings begin (print, post, scanning)
- **Sustainment (Year 2+, 2027-28 onward)**: Full run rate by 31 March 2028

**Stakeholder Benefits**:

- **Daniel Quist**: Target met; S151 obligations supported
- **Portfolio Holder / Chief Executive**: Budget delivered without a dispute
- **Caseworkers**: Transparency and no compulsory redundancies

**Leading Indicators** (early signals of success):

- Online take-up trajectory; print and post volumes falling

**Lagging Indicators** (final proof of success):

- Ledger-confirmed savings at 2027-28 outturn

---

### Outcome O-3: Stable workforce adoption

**Supported Goals**: G-4

**Outcome Statement**: Both offices go live with every caseworker trained, overtime at or below 110% of baseline for three months after go-live, and caseworker confidence of at least 70%.

**Measurement Details**:

- **KPI**: Overtime ratio (post-go-live / baseline); caseworker confidence (%)
- **Current Value**: Baselines to be taken from payroll (April to September 2026) and an October 2026 pulse survey
- **Target Value**: ≤ 1.10 overtime ratio; ≥ 70% confidence
- **Measurement Frequency**: Monthly (overtime); Quarterly (survey)
- **Data Source**: Payroll; pulse survey; learning records
- **Report Owner**: Tom Okafor

**Business Value**:

- **Financial Impact**: Avoids overtime cost and productivity loss seen in the last change [OS-C10]
- **Strategic Impact**: Rebuilds trust in change for future transformation
- **Operational Impact**: Sustained throughput during transition
- **Customer Impact**: No backlog spike for claimants

**Timeline**:

- **Phase 1 (Months 1-3, Oct–Dec 2026)**: Caseworker representatives appointed; pulse baseline taken
- **Phase 2 (Months 4-6, Jan–Mar 2027)**: First office trained ahead of private beta
- **Phase 3 (Months 7-12, Apr–Sep 2027)**: Second office trained ahead of its go-live
- **Sustainment (Year 2+, 2027-28 onward)**: Refresher training; champions network maintained

**Stakeholder Benefits**:

- **Caseworkers**: Confidence and no overtime spike
- **Tom Okafor**: Keeps team trust
- **Head of Digital**: A credible change track record

**Leading Indicators** (early signals of success):

- Sprint-review attendance by caseworker representatives; training completion rates

**Lagging Indicators** (final proof of success):

- Overtime ratio; sickness absence; union grievances (target: none related to the portal)

---

### Outcome O-4: Lawful, trusted processing of claimant data

**Supported Goals**: G-5

**Outcome Statement**: The portal goes live with DPO sign-off [OS-C5] and an approved DPIA and retention schedule [OS-C8], with zero reportable breaches in the first 12 months.

**Measurement Details**:

- **KPI**: Reportable personal-data breaches (count); DPIA actions closed (%)
- **Current Value**: No DPIA in place
- **Target Value**: Zero breaches; 100% of DPIA actions closed before live
- **Measurement Frequency**: Monthly (IGG)
- **Data Source**: Breach log; DPIA action tracker
- **Report Owner**: Lena Marsh

**Business Value**:

- **Financial Impact**: Avoids ICO fines and incident costs
- **Strategic Impact**: Protects public trust in digital services
- **Operational Impact**: Automated retention reduces manual record-keeping
- **Customer Impact**: Claimants' sensitive data is protected

**Timeline**:

- **Phase 1 (Months 1-3, Oct–Dec 2026)**: DPIA screening and draft; SIRO confirmed
- **Phase 2 (Months 4-6, Jan–Mar 2027)**: DPIA signed at January IGG; private beta
- **Phase 3 (Months 7-12, Apr–Sep 2027)**: DPIA reviewed for public beta changes
- **Sustainment (Year 2+, 2027-28 onward)**: Annual DPIA review; retention jobs audited

**Stakeholder Benefits**:

- **Lena Marsh**: Compliant sign-off with no last-minute surprises
- **Claimants**: Trustworthy handling of their data
- **Chief Executive**: Avoids reputational damage

**Leading Indicators** (early signals of success):

- DPIA drafted before alpha ends; processor agreement signed

**Lagging Indicators** (final proof of success):

- Zero breaches; clean internal audit on data handling

---

### Outcome O-5: Inclusive channel shift

**Supported Goals**: G-1, G-7

**Outcome Statement**: At least 60% of new claims are made online by April 2028, with user satisfaction of at least 80% and non-digital routes kept for those who need them.

**Measurement Details**:

- **KPI**: Online share of new claims (%); user satisfaction (%)
- **Current Value**: 0% online; satisfaction not measured
- **Target Value**: ≥ 60% online; ≥ 80% satisfied
- **Measurement Frequency**: Monthly
- **Data Source**: Portal analytics; exit survey; customer-services logs
- **Report Owner**: Tom Okafor

**Business Value**:

- **Financial Impact**: Drives the print, post, scanning and contact-handling savings in O-2
- **Strategic Impact**: A reusable digital claims pattern for other council services (for example, Council Tax Reduction)
- **Operational Impact**: Fewer avoidable calls and visits
- **Customer Impact**: 24/7 access and save-and-resume

**Timeline**:

- **Phase 1 (Months 1-3, Oct–Dec 2026)**: User research with pension-age claimants and advice agencies
- **Phase 2 (Months 4-6, Jan–Mar 2027)**: Private beta, with invited users only
- **Phase 3 (Months 7-12, Apr–Sep 2027)**: Public beta; online share ≥ 35%
- **Sustainment (Year 2+, 2027-28 onward)**: ≥ 60% by April 2028

**Stakeholder Benefits**:

- **Claimants and advice agencies**: A convenient, accessible route
- **Customer Services**: Less avoidable contact
- **Daniel Quist**: Realistic, bankable channel-shift savings

**Leading Indicators** (early signals of success):

- Completion rate; drop-off points; assisted-digital demand

**Lagging Indicators** (final proof of success):

- Online share; satisfaction; complaint volumes

---

### Outcome O-6: Sustainable architecture and protected subsidy

**Supported Goals**: G-6, G-8

**Outcome Statement**: The portal runs on approved council platform services with availability of at least 99.5% and proven recovery. Local-authority-error overpayments stay below the DWP lower threshold in 2027-28.

**Measurement Details**:

- **KPI**: Availability (%); local-authority-error rate (% of expenditure)
- **Current Value**: Not applicable (new service); 2025-26 error rate to be confirmed by Finance
- **Target Value**: ≥ 99.5% availability; below the lower threshold
- **Measurement Frequency**: Monthly (availability); Annual (subsidy)
- **Data Source**: Platform monitoring; subsidy claim and auditor report
- **Report Owner**: Priya Nandakumar (availability); Daniel Quist (subsidy)

**Business Value**:

- **Financial Impact**: Avoided lock-in costs; avoided subsidy loss
- **Strategic Impact**: Platform reuse sets a pattern for future services
- **Operational Impact**: Supportable within existing IT operations
- **Customer Impact**: A reliable service

**Timeline**:

- **Phase 1 (Months 1-3, Oct–Dec 2026)**: Design Authority decision by 30 November 2026
- **Phase 2 (Months 4-6, Jan–Mar 2027)**: Build on platform; audit-trail design walk-through with the auditor
- **Phase 3 (Months 7-12, Apr–Sep 2027)**: Recovery test passed; operational handover
- **Sustainment (Year 2+, 2027-28 onward)**: Clean subsidy certification

**Stakeholder Benefits**:

- **Priya Nandakumar**: Coherent, controlled architecture
- **IT Operations**: A supportable service
- **Daniel Quist, DWP, auditor**: Accurate subsidy and a clean audit trail

**Leading Indicators** (early signals of success):

- Design Authority decisions on time; recovery test results

**Lagging Indicators** (final proof of success):

- Availability; subsidy certification outcome

---

## Complete Traceability Matrix

### Stakeholder → Driver → Goal → Outcome

| Stakeholder | Driver ID | Driver Summary | Goal ID | Goal Summary | Outcome ID | Outcome Summary |
|-------------|-----------|----------------|---------|--------------|------------|-----------------|
| Director of Resources | SD-1 | £180k savings by 2027-28 | G-3 | Transparent £180k savings plan | O-2 | £180k recurring savings |
| Director of Resources | SD-1 | £180k savings by 2027-28 | G-1 | Online claim channel | O-5 | Inclusive channel shift |
| Director of Resources | SD-2 | Protect subsidy and budget | G-8 | Structured evidence, low error | O-6 | Protected subsidy |
| Chief Executive | SD-3 | Reputation to Full Council | G-2 | 14-day decisions | O-1 | Faster decisions |
| Chief Executive | SD-3 | Reputation to Full Council | G-4 | Workforce readiness | O-3 | Stable adoption |
| Head of Digital | SD-4 | Architecture and supplier control | G-6 | Design Authority decision by Nov 2026 | O-6 | Sustainable architecture |
| Head of Digital | SD-5 | Credibility of digital | G-4 | Workforce readiness | O-3 | Stable adoption |
| Service Owner | SD-6 | Meet 14-day standard | G-2 | 14-day decisions | O-1 | Faster decisions |
| Service Owner | SD-6 | Meet 14-day standard | G-1 | Online claim channel | O-1 | Faster decisions |
| Service Owner | SD-7 | Protect team trust | G-4 | Workforce readiness | O-3 | Stable adoption |
| Caseworkers and union | SD-8 | Training, workload, job security | G-4 | Workforce readiness | O-3 | Stable adoption |
| Caseworkers and union | SD-8 | Training, workload, job security | G-3 | Transparent savings plan | O-2 | Savings with no compulsory redundancies |
| DPO | SD-9 | Lawful processing | G-5 | Compliance gate on time | O-4 | Lawful, trusted processing |
| Claimants | SD-10 | Easy claim, fast decision | G-1 | Online claim channel | O-5 | Inclusive channel shift |
| Claimants | SD-10 | Easy claim, fast decision | G-2 | 14-day decisions | O-1 | Faster decisions |
| Excluded claimants and advice agencies | SD-11 | Inclusion | G-7 | Inclusive, accessible service | O-5 | Inclusive channel shift |
| Elected Members | SD-12 | Political accountability | G-3 | Transparent savings plan | O-2 | £180k recurring savings |
| DWP and auditor | SD-13 | Subsidy and data-sharing compliance | G-8 | Structured evidence | O-6 | Protected subsidy |
| DWP and auditor | SD-13 | Subsidy and data-sharing compliance | G-5 | Compliance gate | O-4 | Lawful processing |
| Customer Services | SD-14 | Reduce avoidable contact | G-1 | Online claim channel | O-5 | Inclusive channel shift |
| IT Operations | SD-15 | Supportable, recoverable | G-6 | Design Authority decision; recovery test | O-6 | Sustainable architecture |

### Conflict Analysis

**Competing Drivers**:

- **Conflict 1: Savings versus job security (SD-1 versus SD-8, SD-7)**. The Director of Resources needs £180k a year by 2027-28 [OS-C9], but caseworkers fear the portal is a headcount-reduction tool after a badly handled previous change [OS-C10]. A staffing-only route implies cutting about 20% of the establishment.
  - **Resolution Strategy**: Publish a savings breakdown by source, validated by Finance, by 31 December 2026 (see G-3). Take non-staff savings first. Achieve any establishment reduction through vacancy management and attrition, and recommend that the Board and members commit to no compulsory redundancies. Consult formally with the union. Link savings release to O-3 stability criteria so that savings are not taken before the service can sustain them.

- **Conflict 2: Savings timetable versus compliance and readiness gates (SD-1 versus SD-9, SD-7)**. Reaching a full run rate in 2027-28 pushes towards an early go-live, but the DPO's pre-go-live sign-off [OS-C5], the monthly IGG cadence [OS-C8] and a full training programme cannot be compressed late in the project.
  - **Resolution Strategy**: Put these gates on the critical path now. Start the DPIA in discovery and target the January 2027 IGG. Book the training window before private beta. Phase go-live office by office rather than a single "big bang".

- **Conflict 3: Architectural quality versus speed and cost (SD-4 versus SD-1)**. An add-on module from the incumbent benefits-system supplier may be quicker to deploy but could deepen lock-in. The Design Authority must approve any new supplier [OS-C3].
  - **Resolution Strategy**: Bring an options appraisal to the Design Authority in October or November 2026, scored against architecture principles, total cost of ownership and exit cost. Decide by 30 November 2026 (G-6). Use the fortnightly Design Authority cadence [OS-C6] for rapid iteration rather than waiting for a single big decision.

- **Conflict 4: Channel-shift savings versus inclusion (SD-1 versus SD-11)**. A savings model that assumes very high digital take-up would push towards withdrawing paper and telephone routes, which is at odds with the equality duty and the pension-age caseload.
  - **Resolution Strategy**: Base the savings on a realistic take-up target (≥ 60%). Keep assisted routes throughout 2027-28. Complete an EqIA before public beta.

- **Conflict 5: Defining "complete submission" (SD-6 versus SD-10)**. BR-002 measures 14 days from a *complete* submission. The Service Owner benefits from a strict definition, but claimants and advice agencies experience time from first contact.
  - **Resolution Strategy**: Agree and publish the definition of "complete". Report both measures (G-2).

- **Conflict 6: Concentration of roles (governance)**. The Director of Resources is budget holder, savings-target owner, S151 officer, Board chair and proposed SRO. If they are also the SIRO, the same person would accept information risk on a project they are under pressure to deliver.
  - **Resolution Strategy**: Confirm the SIRO. If it is the Director of Resources, record the DPO's independent sign-off [OS-C5] as a non-overridable go-live condition in the RACI.

**Synergies**:

- **Synergy 1**: The Service Owner's 14-day target (SD-6), claimants' need for speed (SD-10), Customer Services' avoidable-contact reduction (SD-14) and the Director's savings (SD-1) all depend on complete online claims with evidence upload (G-1). One investment satisfies four drivers.
- **Synergy 2**: The caseworkers' training demand (SD-8) and the Director's savings (SD-1) align once framed correctly. A trained, engaged team is what produces the productivity that makes savings real, while an untrained one produces overtime [OS-C10] that erodes them.
- **Synergy 3**: The DPO's lawful-processing driver (SD-9) and the Head of Digital's platform driver (SD-4) both favour platform reuse with built-in retention, recovery and audit (DR-001, DR-002).
- **Synergy 4**: Structured evidence capture (FR-002) meets the Director's subsidy concern (SD-2), DWP and auditor assurance (SD-13) and faster decisions (SD-6).

---

## Communication & Engagement Plan

### Stakeholder-Specific Messaging

#### Daniel Quist - Director of Resources / SRO

**Primary Message**: The portal is the most reliable route to £180k recurring savings, provided the savings are transparent and the rollout avoids the productivity loss of the last change.

**Key Talking Points**:

- Savings breakdown by source and timing, with confidence levels
- Readiness gates protect the savings rather than delay them: a failed go-live costs more than a phased one
- Subsidy protection through structured evidence

**Communication Frequency**: Fortnightly (SRO check-in); Monthly (Benefits Transformation Board)

**Preferred Channel**: Board papers and a savings dashboard

**Success Story**: The 2027-28 outturn confirms £180k recurring savings, with no dispute and no subsidy loss.

---

#### Margaret Ellery - Chief Executive

**Primary Message**: A modernised benefits service is being delivered to budget, with staff brought along.

**Key Talking Points**:

- Phase-gate status and headline KPIs
- How workforce and union relations are being managed

**Communication Frequency**: Quarterly

**Preferred Channel**: Briefing via the Director of Resources; corporate leadership team update

**Success Story**: The report to Full Council cites the portal as a model transformation.

---

#### Priya Nandakumar - Head of Digital

**Primary Message**: The portal will be built to council architecture standards, with the Design Authority deciding early and in time for delivery.

**Key Talking Points**:

- Options appraisal and total cost of ownership, including exit costs
- Platform reuse (DR-001) and audit-trail design
- Caseworker co-design as the way to avoid the last rollout's reputation

**Communication Frequency**: Fortnightly (Design Authority); Weekly (delivery)

**Preferred Channel**: Design Authority papers, architecture decision records, sprint reviews

**Success Story**: A reusable claims pattern is adopted by a second council service.

---

#### Tom Okafor - Service Owner

**Primary Message**: You set the readiness bar for your offices. The portal is designed to deliver your 14-day standard without burning out your team.

**Key Talking Points**:

- Training plan, backfill and office-by-office go-live criteria
- Fewer incomplete claims and evidence cycles (FR-001, FR-002)
- Management information on claim age and work queues

**Communication Frequency**: Weekly

**Preferred Channel**: Service review meeting; sprint reviews

**Success Story**: The 14-day target is met with overtime at baseline and the team saying "this one was done properly".

---

#### Caseworkers and union representative

**Primary Message**: You will be trained before anything goes live, you will help design it, and here is exactly where the savings come from.

**Key Talking Points**:

- Direct acknowledgement of the last rollout and what will be different this time [OS-C10]
- Published savings breakdown and position on redundancies
- Caseworker representatives in sprint reviews; champions in each office; practice sandbox

**Communication Frequency**: Fortnightly (team briefings); Monthly (union liaison meeting)

**Preferred Channel**: Face-to-face team briefings in both offices; formal union consultation; sprint demos

**Success Story**: The union reports no portal-related grievances, and caseworkers volunteer as beta champions.

---

#### Lena Marsh - Data Protection Officer

**Primary Message**: You will see the DPIA from discovery onward, not at the end, and the design builds privacy in.

**Key Talking Points**:

- Data flows, processors, DWP data sharing, special category data
- Retention automation for six years after closure (DR-002)
- A timetable that aligns the DPIA with the January 2027 IGG

**Communication Frequency**: Fortnightly working session until DPIA sign-off; Monthly (IGG)

**Preferred Channel**: DPIA working sessions; IGG papers

**Success Story**: The DPIA is signed at the first IGG it is presented to.

---

#### Elected Members - Portfolio Holder and Ward Members

**Primary Message**: Residents get a faster, easier way to claim. Budget savings are being delivered responsibly, and nobody is being left behind.

**Key Talking Points**:

- Savings approach and staffing position
- Retained non-digital routes; performance data

**Communication Frequency**: Before each phase gate (Portfolio Holder); at public beta and live (Ward Members)

**Preferred Channel**: Portfolio Holder briefing; members' bulletin

**Success Story**: Member casework on benefit delays falls.

---

#### Claimants and advice agencies

**Primary Message**: Claim online at any time, save your progress, and upload evidence from your phone. Help is available if you need it.

**Key Talking Points**:

- Save-and-resume (FR-001), evidence upload, status updates
- Assisted-digital, telephone and paper routes remain

**Communication Frequency**: At each beta phase; ongoing through service content

**Preferred Channel**: Council website, letters to existing claimants, advice-agency partner sessions

**Success Story**: User satisfaction of at least 80%, and advice agencies recommend the online route.

---

#### DWP and external auditor

**Primary Message**: The portal strengthens the audit trail and evidence quality behind Housing Benefit decisions.

**Key Talking Points**:

- Audit-trail design; data-sharing security conditions

**Communication Frequency**: As needed; one design walk-through before public beta

**Preferred Channel**: Formal correspondence; auditor walk-through

**Success Story**: A clean subsidy certification for 2027-28.

---

#### Customer Services and IT Operations

**Primary Message**: Less avoidable contact for Customer Services and a supportable platform service for IT Operations, with clear handover.

**Key Talking Points**:

- Assisted-digital scripts and training; launch contact forecast
- Runbooks, monitoring, recovery testing, support boundaries

**Communication Frequency**: Monthly, rising to weekly in the four weeks around each go-live

**Preferred Channel**: Team briefings; operational-readiness reviews

**Success Story**: Claim-status calls fall by at least 30% within six months of live, and there are no severity-1 incidents without a runbook.

---

## Change Impact Assessment

### Impact on Stakeholders

| Stakeholder | Current State | Future State | Change Magnitude | Resistance Risk | Mitigation Strategy |
|-------------|---------------|--------------|------------------|-----------------|---------------------|
| Caseworkers (22) | Key paper and telephone claims; chase missing evidence by letter and phone | Process structured online claims; request evidence in the system (FR-002) | HIGH | HIGH | Training before go-live, co-design, champions, transparent savings plan, overtime monitoring |
| Tom Okafor | Manages two offices on a paper workflow | Manages hybrid digital and paper queues with live management information | MEDIUM | MEDIUM | Readiness authority; backfill; phased go-live |
| Daniel Quist | Target set, route to savings undefined | Savings tracked by source through the Board | LOW | LOW | Savings dashboard; phased profile |
| Lena Marsh | No DPIA for the portal | DPIA owner and ongoing reviewer | MEDIUM | MEDIUM (gate delay, not opposition) | Early DPIA co-production; IGG slots booked |
| Priya Nandakumar | Owns requirements; no architecture decision yet | Design Authority decisions; platform service owner | MEDIUM | LOW | Early options appraisal |
| Customer Services | Handle claim calls and visits | Assisted-digital support; fewer status calls | MEDIUM | MEDIUM | Training; launch contact forecast |
| IT Operations | No portal to run | Run portal on platform with defined support boundaries | MEDIUM | LOW | Operational-readiness pack; runbooks |
| Claimants | Paper forms, office visits, telephone | Online by default, with assisted routes | MEDIUM | MEDIUM (pension-age groups) | Assisted digital; paper retained; plain-language content |
| Advice agencies | Help complete paper forms | Help clients online; possibly an intermediary route | MEDIUM | LOW | Partner sessions in beta |

### Change Readiness

**Champions** (Enthusiastic supporters):

- Daniel Quist: the portal is his most credible route to the £180k target [OS-C9]
- Priya Nandakumar: a flagship service for the digital function that she governs through the Design Authority [OS-C3]
- Transformation Office: owns the programme narrative and already maps the governance [OS-C11]

**Fence-sitters** (Neutral, need convincing):

- Tom Okafor: supports the goal (BR-002) but will be convinced only by a credible training, backfill and phased go-live plan
- Lena Marsh: neutral gatekeeper; persuaded by early, complete DPIA evidence, not by timetable pressure
- Margaret Ellery and the Portfolio Holder: supportive while there is no dispute or service failure; persuaded by gate reporting
- Customer Services: persuaded by a launch contact forecast and assisted-digital training

**Resisters** (Opposed or skeptical):

- Caseworkers and union representative: resist because of the prior untrained rollout and overtime [OS-C10] and the implied job risk from the savings target [OS-C9]. Strategy: acknowledge the history openly, give caseworkers design roles, publish the savings breakdown, commit to training before go-live and an overtime threshold, and consult formally with the union. Aim to turn two or three respected caseworkers into beta champions.

---

## Risk Register (Stakeholder-Related)

### Risk R-1: Repeat of the previous rollout

**Related Stakeholders**: Caseworkers, Tom Okafor, Priya Nandakumar

**Risk Description**: Training is squeezed and go-live causes an overtime spike and backlog, repeating the previous change [OS-C10].

**Impact on Goals**: G-2, G-3, G-4, G-8

**Probability**: MEDIUM

**Impact**: HIGH

**Mitigation Strategy**: Make training ≥ 10 working days before go-live a hard readiness criterion; approve backfill budget; go live office by office. Owner: Tom Okafor.

**Contingency Plan**: Pause the second office's go-live; bring in temporary processing support; extend parallel running.

---

### Risk R-2: Industrial-relations dispute over savings

**Related Stakeholders**: Caseworkers and union, Daniel Quist, Portfolio Holder, Chief Executive

**Risk Description**: The savings target is read as job cuts, leading to a formal dispute, non-cooperation with design, or public union statements.

**Impact on Goals**: G-3, G-4, G-1

**Probability**: MEDIUM

**Impact**: HIGH

**Mitigation Strategy**: Publish the savings breakdown by source by 31 December 2026; recommend a no-compulsory-redundancy position; start formal consultation early. Owner: Daniel Quist.

**Contingency Plan**: Escalate to the Chief Executive and HR for formal dispute resolution; re-profile savings timing.

---

### Risk R-3: Late DPIA delays go-live

**Related Stakeholders**: Lena Marsh, Daniel Quist, Priya Nandakumar

**Risk Description**: The DPIA is presented late. The monthly IGG cadence [OS-C8] adds four or more weeks per iteration, and go-live cannot proceed without DPO sign-off [OS-C5].

**Impact on Goals**: G-5, G-1, G-3

**Probability**: MEDIUM

**Impact**: HIGH

**Mitigation Strategy**: Start the DPIA in discovery; hold fortnightly working sessions; book January 2027 IGG. Owner: delivery lead, with Lena Marsh.

**Contingency Plan**: Ask the IGG chair for an extraordinary meeting; limit private beta scope to reduce processing risk.

---

### Risk R-4: Savings attribution gap

**Related Stakeholders**: Daniel Quist, Finance Business Partner, Portfolio Holder

**Risk Description**: The portal alone does not generate £180k. Some savings (for example, subsidy-loss avoidance) are non-cashable, leaving a shortfall at 2027-28 outturn.

**Impact on Goals**: G-3

**Probability**: MEDIUM

**Impact**: MEDIUM

**Mitigation Strategy**: Finance validates the cashable and non-cashable split by 31 December 2026; identify complementary service changes. Owner: Daniel Quist.

**Contingency Plan**: Re-profile the target to 2028-29 through the medium-term financial plan; report transparently to members.

---

### Risk R-5: Low digital take-up

**Related Stakeholders**: Claimants, advice agencies, Daniel Quist, Customer Services

**Risk Description**: Pension-age claimants and those in supported accommodation take up the online route more slowly than planned.

**Impact on Goals**: G-1, G-3, G-7

**Probability**: MEDIUM

**Impact**: MEDIUM

**Mitigation Strategy**: Research with pension-age users; intermediary route for advice agencies; assisted digital. Owner: Tom Okafor.

**Contingency Plan**: Shift savings emphasis towards back-office efficiency (FR-002, scanning).

---

### Risk R-6: Unassigned governance roles

**Related Stakeholders**: Daniel Quist, Lena Marsh, Priya Nandakumar

**Risk Description**: The SRO (unconfirmed), SIRO, Product Manager and Delivery Manager are not named in the governance extract, which slows decisions and blurs risk acceptance.

**Impact on Goals**: G-5, G-6, all delivery goals

**Probability**: HIGH

**Impact**: MEDIUM

**Mitigation Strategy**: Confirm all four roles at the October 2026 Benefits Transformation Board. Owner: Daniel Quist.

**Contingency Plan**: The Transformation Office acts as interim Delivery Manager; the Service Owner acts as interim Product Manager.

---

### Risk R-7: Design Authority or supplier decision delay

**Related Stakeholders**: Priya Nandakumar, delivery supplier(s), Daniel Quist

**Risk Description**: The options appraisal or supplier approval [OS-C3] slips past 30 November 2026, compressing build time before private beta.

**Impact on Goals**: G-6, G-1

**Probability**: MEDIUM

**Impact**: HIGH

**Mitigation Strategy**: Schedule Design Authority items in October and November; create architecture principles (`/arckit:principles`); pre-agree evaluation criteria. Owner: Priya Nandakumar.

**Contingency Plan**: Hold an extraordinary Design Authority meeting; move private beta to March 2027 and absorb the slip in public beta.

---

### Risk R-8: Public and political scrutiny after go-live

**Related Stakeholders**: Chief Executive, elected members, claimants, LGSCO

**Risk Description**: Early defects or delays generate member casework, press coverage or Ombudsman complaints.

**Impact on Goals**: G-2, G-7

**Probability**: LOW

**Impact**: HIGH

**Mitigation Strategy**: Phased beta; publish performance; brief members before each gate. Owner: Daniel Quist.

**Contingency Plan**: Prepare lines to take; set up a rapid-response triage team; widen assisted routes temporarily.

---

### Risk R-9: Falling Housing Benefit caseload

**Related Stakeholders**: Daniel Quist, Priya Nandakumar, Tom Okafor

**Risk Description**: The working-age caseload keeps falling as DWP moves claimants to Universal Credit, which weakens the portal's value case and the savings achievable from it.

**Impact on Goals**: G-3, G-1

**Probability**: HIGH

**Impact**: MEDIUM

**Mitigation Strategy**: Design the claim pattern to be reusable. Consider bringing Council Tax Reduction claims into scope; this is outside the current requirements, so it is a Board decision. Owner: Priya Nandakumar.

**Contingency Plan**: Re-baseline savings against the forecast caseload in the 2027-28 budget round.

---

## Governance & Decision Rights

### Decision Authority Matrix (RACI)

| Decision Type | Responsible | Accountable | Consulted | Informed |
|---------------|-------------|-------------|-----------|----------|
| Project scope and budget | Transformation Office | Daniel Quist (Benefits Transformation Board chair) [OS-C7] | Priya Nandakumar, Tom Okafor, Finance Business Partner | Chief Executive, Portfolio Holder |
| Savings plan and breakdown | Finance Business Partner | Daniel Quist (S151) | Tom Okafor, union representative, HR | Portfolio Holder, caseworkers |
| Architecture decisions | Solution architect / delivery supplier | Priya Nandakumar (Design Authority chair) [OS-C3] | IT Operations, IT security lead, Lena Marsh | Benefits Transformation Board |
| New supplier approval | Procurement | Priya Nandakumar (Design Authority chair) [OS-C3] | Daniel Quist, Legal | Benefits Transformation Board |
| DPIA sign-off and retention schedule | Delivery lead | Lena Marsh (IGG chair) [OS-C8] | SIRO, Priya Nandakumar, Tom Okafor | Benefits Transformation Board |
| Requirements and backlog prioritisation | Product Manager (to appoint) | Tom Okafor (Service Owner) | Caseworker representatives, claimants (research), Priya Nandakumar | Delivery supplier |
| Training and people-change plan | Tom Okafor | Daniel Quist (SRO) | Union representative, HR, caseworkers | Benefits Transformation Board |
| Office go-live readiness | Tom Okafor | Tom Okafor (Service Owner) | Caseworker champions, IT Operations | Benefits Transformation Board |
| Go/No-go for go-live | Delivery lead | Daniel Quist (Board chair) [OS-C7] | Priya Nandakumar, Tom Okafor | Chief Executive, members |
| Data-processing sign-off (go-live condition; cannot be overridden) | Delivery lead | Lena Marsh (DPO) [OS-C5] | SIRO | Benefits Transformation Board |
| Establishment changes | HR | Daniel Quist (Director) | Union representative, Tom Okafor | Portfolio Holder, Chief Executive |

### Escalation Path

1. **Level 1**: Delivery Manager / Product Manager, with Tom Okafor as Service Owner (day-to-day delivery and service decisions)
2. **Level 2**: Specialist boards. Design Authority for architecture and suppliers (fortnightly) [OS-C6]; Information Governance Group for data protection (monthly) [OS-C8]; Benefits Transformation Board for scope, budget and go-live (monthly) [OS-C7].
3. **Level 3**: Daniel Quist as SRO (cross-board conflicts, savings versus readiness trade-offs)
4. **Level 4**: Margaret Ellery, Chief Executive, and the corporate leadership team (strategic conflicts, industrial relations)
5. **Level 5**: Cabinet / Full Council [OS-C1] (budget changes beyond officer delegations)

---

## Validation & Sign-off

### Stakeholder Review

| Stakeholder | Review Date | Comments | Status |
|-------------|-------------|----------|--------|
| Daniel Quist (Director of Resources) | Planned: October 2026 Benefits Transformation Board | Validate savings driver, SRO role and conflict resolutions | PENDING |
| Priya Nandakumar (Head of Digital) | Planned: October 2026 Design Authority | Validate architecture drivers and G-6 date | PENDING |
| Tom Okafor (Service Owner) | Planned: week of 5 October 2026 | Validate caseworker drivers, G-2 and G-4 baselines | PENDING |
| Lena Marsh (DPO) | Planned: October 2026 IGG | Validate G-5 timetable and SIRO gap | PENDING |
| Union representative | Planned: at first consultation meeting | Validate SD-8 and the Conflict 1 resolution (subject to Board agreement) | PENDING |

### Document Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Project Sponsor (SRO) | Daniel Quist | PENDING | PENDING |
| Business Owner (Service Owner) | Tom Okafor | PENDING | PENDING |
| Enterprise Architect (Design Authority chair) | Priya Nandakumar | PENDING | PENDING |

---

## Appendices

### Appendix A: Stakeholder Interview Summaries

No stakeholder interviews have been held for this version. The drivers are derived from the governance extract [OS-C11] and `ARC-001-REQ-v1.0`, with inferred motivations clearly reasoned. The following interviews are recommended to validate them before v1.1.

#### Recommended Interview Schedule - October 2026

| Interviewee | Focus | Drivers to Validate |
|-------------|-------|---------------------|
| Daniel Quist | Savings composition, SRO role, redundancy position | SD-1, SD-2 |
| Priya Nandakumar | Architecture options, supplier landscape, Design Authority timetable | SD-4, SD-5 |
| Tom Okafor | Baselines, training, backfill, go-live criteria | SD-6, SD-7 |
| Lena Marsh | DPIA scope, IGG timetable, SIRO | SD-9 |
| Union representative and caseworker group (each office) | Lessons from the previous rollout | SD-8 |

**Follow-up Actions**:

- Transformation Office to schedule interviews by 16 October 2026
- Update this document to v1.1 with validated drivers and baselines

---

### Appendix B: Survey Results

No surveys have been conducted. A caseworker pulse-survey baseline (confidence, workload, change readiness) is recommended in October 2026 to provide the G-4 and O-3 baseline.

---

### Appendix C: References

- `ARC-001-REQ-v1.0`: Requirements, Housing Benefits Portal (BR-001, BR-002, FR-001, FR-002, DR-001, DR-002)
- `org-structure.md`: Ashcombe District Council, Digital and Benefits Governance (extract), Transformation Office, August 2026
- Architecture Principles (`ARC-000-PRIN`): **not yet created**; recommended via `/arckit:principles`
- Government Functional Standard GovS 005 (Digital) and GovS 007 (Security), used as good practice
- Equality Act 2010 (Public Sector Equality Duty); Public Sector Bodies (Websites and Mobile Applications) Accessibility Regulations 2018
- UK GDPR and Data Protection Act 2018
- DWP Housing Benefit subsidy guidance (local-authority error thresholds, to be confirmed against current edition)

---

## External References

> This section provides traceability from generated content back to source documents.
> Follow citation instructions in the project's citation reference guide.

### Document Register

| Doc ID | Filename | Type | Source Location | Description |
|--------|----------|------|-----------------|-------------|
| OS | org-structure.md | Organisation chart / governance extract | 001-benefits-portal/external/ | Ashcombe District Council Digital and Benefits Governance extract (Transformation Office, August 2026): reporting lines, boards, known tensions |

### Citations

| Citation ID | Doc ID | Page/Section | Category | Quoted Passage |
|-------------|--------|--------------|----------|----------------|
| OS-C1 | OS | Reporting lines | Stakeholder Need | "Chief Executive: Margaret Ellery. Accountable to Full Council." |
| OS-C2 | OS | Reporting lines | Stakeholder Need | "Director of Resources: Daniel Quist. Owns the Revenues and Benefits service and its budget; the Section 151 officer." |
| OS-C3 | OS | Reporting lines | Design Decision | "Head of Digital: Priya Nandakumar. Chairs the Design Authority, which approves architecture decisions and any new supplier." |
| OS-C4 | OS | Reporting lines | Stakeholder Need | "Benefits Service Manager: Tom Okafor. Service Owner for housing benefits; line-manages 22 caseworkers across two offices." |
| OS-C5 | OS | Reporting lines | Compliance Constraint | "Data Protection Officer: Lena Marsh. Must sign off any processing of claimant data before go-live." |
| OS-C6 | OS | Boards (table) | Design Decision | Table row: Design Authority; chair Head of Digital; cadence fortnightly; decides architecture, suppliers, technical standards. |
| OS-C7 | OS | Boards (table) | Stakeholder Need | Table row: Benefits Transformation Board; chair Director of Resources; cadence monthly; decides scope, budget, go-live. |
| OS-C8 | OS | Boards (table) | Compliance Constraint | Table row: Information Governance Group; chair Data Protection Officer; cadence monthly; decides DPIA sign-off, retention. |
| OS-C9 | OS | Known tensions | Business Requirement | "The Director of Resources has a savings target of £180k a year from the benefits service by 2027-28." |
| OS-C10 | OS | Known tensions | Risk Factor | "Caseworkers have raised, through their union representative, that the last system change was rolled out without training and increased overtime for three months." |
| OS-C11 | OS | Document header | Stakeholder Need | "Prepared by the Transformation Office, August 2026." |

### Unreferenced Documents

| Filename | Source Location | Reason |
|----------|-----------------|--------|
| README.md | 001-benefits-portal/external/ | Placeholder note describing the directory's purpose; no stakeholder content |

---

**Generated by**: ArcKit `/arckit:stakeholders` command
**Generated on**: 2026-09-29
**ArcKit Version**: 6.16.5
**Project**: Housing Benefits Portal (Project 001)
**AI Model**: Claude Opus 5.5 (claude-opus-5-5)

<!-- arckit-provenance:start -->

## Build Provenance

*Stamped automatically by the ArcKit plugin's `provenance-stamp.mjs` PostToolUse hook. Complements (does not replace) the human-authored footer above. Carries only fields the model can't authoritatively self-report: build context from `.arckit/state.json` and effort levels derived from command frontmatter + the silent-downgrade matrix.*

| Field | Value |
|-------|-------|
| Requested Effort | `high` |
| Effective Effort | *unknown — model not parsed from existing footer* |
| Stamped at | 2026-09-29T08:49:34.081Z |

<!-- arckit-provenance:end -->
