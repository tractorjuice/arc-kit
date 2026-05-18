# Canada Official Languages Act Review

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit.ca-ola`

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time per _partials/RENDERING.md. -->
<!-- Classification line MUST be: -->
<!-- | Classification | UNCLASSIFIED / Protected A / Protected B / Protected C / CONFIDENTIAL / SECRET / TOP SECRET | -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit.ca-ola` | [PENDING] | [PENDING] |

## Executive Summary

[Two to three paragraphs describing the service, the OLA posture across Parts IV, V, and VI, the active-offer mechanism, the Translation Bureau pipeline maturity, and any "translation lag" risks identified. Note OQLF acknowledgement where the service has Quebec exposure, and flag any open items that block launch or substantive release.]

## Service Description

| Item | Value |
|------|-------|
| Department / agency | [name] |
| Service / programme | [name] |
| Description | [what the service does, in plain language] |
| Owner | [accountable role] |
| Operator | [internal team / contractor / processor] |
| Audience | [Canadian public / federal employees / clients of programme X / regional populations] |
| Lifecycle stage | [Concept / Design / Build / Pilot / Live / Modification] |
| Bilingual designation basis | [significant demand / public-travel / head-office / designated bilingual office / Schedule reference] |

## Service Surface Inventory

| Surface | Channel | Audience | Bilingual posture | Active offer mechanism |
|---------|---------|----------|-------------------|------------------------|
| [Public-facing screen — landing page] | Web | Canadian public | Bilingual (EN + FR equivalent) | Bilingual greeting and language toggle on first paint |
| [Forms — service intake] | Web | Canadian public | Bilingual | Toggle persists; both languages release-gated |
| [Notifications — email/SMS] | Email/SMS | Service clients | Bilingual | Language preference captured at intake; both content tracks maintained |
| [Error messages] | All | All users | Bilingual | Equivalent severity wording in both languages |
| [Public registers — open data] | Web | Canadian public | Bilingual | Field labels and metadata in both languages |
| [Accessibility statement] | Web | Canadian public | Bilingual | Linked from every page footer |
| [Printed correspondence] | Mail | Service clients | Bilingual | Cover page bilingual; body in user's language of choice |
| [IVR scripts] | Phone | Service clients | Bilingual | Greeting in both official languages before menu |
| [Social media] | Social | Canadian public | Bilingual | Each post released in both languages simultaneously |
| [Internal admin console — example] | Web | Departmental staff | [Bilingual / EN-only with justification] | n/a (internal — Part V applies) |

> Any unilingual surface must carry a written justification (audience exclusively in one official language, demonstrably no significant demand, etc.) and the justification must be reviewed at every refresh.

## Part IV — Communications with and Services to the Public

| Surface | Bilingual obligation rationale | Active-offer mechanism | Bilingual capacity at time of service | Status |
|---------|--------------------------------|------------------------|----------------------------------------|--------|
| [Landing page] | Significant demand (Schedule reference) | Bilingual greeting + persistent toggle | 24/7 EN/FR via translated content | [Compliant / Gap / Remediation in progress] |
| [Service intake form] | Public-travel / national service | Bilingual greeting + form labels | Real-time validation in both languages | [Compliant / Gap] |
| [IVR — first contact] | Designated bilingual office | "Bonjour / Hello" opening before menu | Bilingual agents available during service hours | [Compliant / Gap] |
| [Counter / in-person] | Designated bilingual office | Bilingual signage + verbal greeting | Bilingual staff present at all times of service | [Compliant / Gap] |
| [Public register] | Significant demand | Bilingual UI + field metadata | Both languages release-gated | [Compliant / Gap] |

> **Active offer is a verb, not a checkbox.** A passive bilingual sign does not satisfy the obligation — the greeting, the screen, the IVR opening, and the written initiation must all extend the offer before the user has to ask.

## Part V — Language of Work

| Tool / system | Region | Designated language posture | Supervision language | Status |
|---------------|--------|------------------------------|----------------------|--------|
| [Service-delivery tooling — example] | National Capital Region | Both EN and FR fully available | Bilingual supervision | [Compliant / Gap] |
| [HR / staffing system] | National Capital Region | Both EN and FR fully available | Bilingual supervision | [Compliant / Gap] |
| [Internal admin console] | New Brunswick (officially bilingual) | Both EN and FR fully available | Bilingual supervision | [Compliant / Gap] |
| [Helpdesk tooling] | Bilingual-designated parts of other regions | Both EN and FR fully available | Bilingual supervision available | [Compliant / Gap] |
| [Reporting / analytics system] | Unilingual regions | Single language acceptable; document audience | n/a | [Compliant / Gap] |

> The right to work in the official language of choice in designated bilingual regions extends to the tools and the supervision experience, not only to the spoken or written language at the workstation.

## Part VI — Federal Language Obligations

| Obligation | Programme touchpoint | Mitigation | Status |
|------------|----------------------|------------|--------|
| Equitable participation of English- and French-speaking Canadians | [Recruitment / staffing data captured by this system] | [Equity reporting to OCHRO; bias review of any automated screening] | [Compliant / Gap] |
| Non-discrimination on language grounds | [Eligibility, scoring, or routing logic] | [Logic review for language-correlated proxies; appeal route documented] | [Compliant / Gap] |
| Staffing impact — bilingual designation | [HR positions supported by this system] | [Bilingual designation captured per position; capacity tracking] | [Compliant / Gap] |
| Career development support | [Training / promotion pathways supported] | [Equal access in both languages; second-language training reflected in workflows] | [Compliant / Gap] |

## Equivalent Quality Assessment

| Surface | Content depth | Usability | Response time | Release cadence | Status |
|---------|---------------|-----------|---------------|------------------|--------|
| [Landing page] | Identical content in both languages | Equivalent UX in both languages | Same SLA in both languages | Both released simultaneously | [Compliant / Gap] |
| [Service intake form] | Identical fields and help text | Equivalent error handling | Same processing time | Both released simultaneously | [Compliant / Gap] |
| [Notifications] | Identical message body | Equivalent layout | Same dispatch cadence | Both released simultaneously | [Compliant / Gap] |
| [Public register] | Identical record schema | Equivalent search experience | Same query latency | Both released simultaneously | [Compliant / Gap] |
| [IVR] | Identical menu structure | Equivalent prompt clarity | Equivalent wait time | Both updated simultaneously | [Compliant / Gap] |

> "Translation will follow" releases violate the OLA. Release-gating in both languages is the only durable enforcement.

## Translation Pipeline

| Content class | Lead time | Cadence | Owner | Release-gate |
|---------------|-----------|---------|-------|--------------|
| Web content (standard) | [N business days] | [Weekly / on-demand] | [Content owner + Translation Bureau] | Hold release until both languages signed off |
| Forms and labels | [N business days] | [Per-release] | [Content owner + Translation Bureau] | Both languages in same deployment unit |
| Notifications and templates | [N business days] | [Per-template change] | [Service owner + Translation Bureau] | Both templates validated before activation |
| Error messages | [N business days] | [Per-release] | [Engineering + Translation Bureau] | Both released with the same change set |
| Public registers — schema and labels | [N business days] | [Per-schema change] | [Data owner + Translation Bureau] | Both released simultaneously |
| Social media | [Same-day] | [Per-post] | [Communications team] | Each post in both languages at publish time |
| Printed correspondence | [N business days] | [Per-template change] | [Service owner + Translation Bureau] | Both versions on file before send |

> Predictable cadence beats ad-hoc engagement. Build the Translation Bureau lead time into the delivery plan; do not absorb it as a release-time delay.

## OQLF Acknowledgement

| Surface | Quebec exposure | OQLF consideration | Federal supremacy note |
|---------|-----------------|--------------------|------------------------|
| [Public-facing service in Quebec] | Material Quebec audience | OQLF *Charter of the French Language* applies to suppliers and contractors operating in Quebec | Federal supremacy holds for the federal entity; document the supplier-side OQLF obligation |
| [Service hosted/operated in Quebec] | Service hosted on Quebec infrastructure | OQLF may apply to the hosting supplier and to communications with Quebec residents | Federal entity is bound by the OLA; Quebec-based suppliers are concurrently bound by OQLF |
| [Procurement and contracting in Quebec] | Suppliers in Quebec | OQLF applies to supplier internal operations and consumer-facing materials | Federal entity is not bound by OQLF, but supplier obligations affect deliverable language posture |
| [Marketing and engagement in Quebec] | Quebec audience | OQLF advertising and signage rules apply to suppliers placing federal communications | Document the parallel obligation in the supplier brief |

> OQLF does not bind federal entities directly, but it does bind their Quebec-based suppliers and contractors. The acknowledgement is a documentation duty, not a compliance duty under federal law.

## Risk and Mitigation Register

| Risk | Likelihood | Impact | Mitigation | Residual |
|------|------------|--------|------------|----------|
| Complaint to the Commissioner of Official Languages on Part IV (services) | [Low / Med / High] | [Low / Med / High] | [Active offer evidenced; bilingual capacity at time of service; release-gating in both languages] | [Low / Med / High] |
| Court remedy under Part X | [Low / Med / High] | [Low / Med / High] | [Documented compliance regime; redress procedure in place; Commissioner consultation history] | [Low / Med / High] |
| "Translation lag" release violating equal quality | [Low / Med / High] | [Low / Med / High] | [Both-languages release-gate; deployment unit holds both content tracks] | [Low / Med / High] |
| Internal tooling Part V invisibility | [Low / Med / High] | [Low / Med / High] | [Tooling EN/FR availability audited per region; supervision language captured per role] | [Low / Med / High] |
| OQLF supplier non-compliance in Quebec | [Low / Med / High] | [Low / Med / High] | [Supplier brief includes OQLF clauses; supplier audit on Quebec-facing deliverables] | [Low / Med / High] |
| Reputational risk from public unilingual release | [Low / Med / High] | [Low / Med / High] | [Communications playbook gates social media in both languages; incident playbook on inadvertent unilingual release] | [Low / Med / High] |

## Open Items

| Item | Owner | Due | Status |
|------|-------|-----|--------|
| [Translation Bureau lead time confirmation per content class] | [Service owner] | [YYYY-MM-DD] | [Open / Closed] |
| [Active-offer signage refresh on legacy surfaces] | [Service owner] | [YYYY-MM-DD] | [Open / Closed] |
| [Part V audit of internal tooling in designated regions] | [Operations lead] | [YYYY-MM-DD] | [Open / Closed] |
| [OQLF supplier clauses inserted into Quebec procurement] | [Procurement lead] | [YYYY-MM-DD] | [Open / Closed] |
| [Bill C-13 phasing-in provisions tracked via Order in Council] | [Privacy / OLA counsel] | [YYYY-MM-DD] | [Open / Closed] |

## External References

### Document Register

| Doc ID | Title | URL | Verified date |
|--------|-------|-----|---------------|
| CA-OLA | Official Languages Act (R.S.C., 1985, c. 31 (4th Supp.)) | <https://laws-lois.justice.gc.ca/eng/acts/O-3.01/> | [YYYY-MM-DD] |
| CA-C13 | An Act for the Substantive Equality of Canada's Official Languages (S.C. 2023, c. 15) | <https://laws-lois.justice.gc.ca/eng/annualstatutes/2023_15/> | [YYYY-MM-DD] |
| CA-TBS-OL | TBS Policy on Official Languages | <https://www.tbs-sct.canada.ca/pol/doc-eng.aspx?id=26160> | [YYYY-MM-DD] |
| CA-OL-REG | Directive on the Implementation of the Official Languages (Communications with and Services to the Public) Regulations | <https://www.tbs-sct.canada.ca/pol/doc-eng.aspx?id=32522> | [YYYY-MM-DD] |
| CA-COL | Commissioner of Official Languages — published guidance | <https://www.clo-ocol.gc.ca/> | [YYYY-MM-DD] |

### Citations

| Citation | Doc ID | Section | Used in |
|----------|--------|---------|---------|
| [OLA-1] | CA-OLA | Part IV — Communications with and Services to the Public | Part IV — Communications with and Services to the Public |
| [OLA-2] | CA-OLA | Part V — Language of Work | Part V — Language of Work |
| [OLA-3] | CA-OLA | Part VI — Participation of English-speaking and French-speaking Canadians | Part VI — Federal Language Obligations |
| [OLA-4] | CA-OLA | Part VII — Advancement of English and French | Risk and Mitigation Register |
| [OLA-5] | CA-OLA | Part X — Court Remedy | Risk and Mitigation Register |
| [C13-1] | CA-C13 | Substantive equality amendments to the OLA | Executive Summary; Part VI |
| [TBS-OL-1] | CA-TBS-OL | Active offer expectations | Part IV — Communications with and Services to the Public |
| [OL-REG-1] | CA-OL-REG | Significant demand and public-travel rules | Service Surface Inventory; Part IV |
| [COL-1] | CA-COL | Commissioner's complaint and audit guidance | Risk and Mitigation Register |

### Unreferenced Documents

[List any documents read during generation but not cited, or "None".]
