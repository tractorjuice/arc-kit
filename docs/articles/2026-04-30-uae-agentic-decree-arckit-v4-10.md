# How ArcKit v4.10 Accelerates the UAE's Federal Agentic Decree

ArcKit v4.10, shipped today, is purpose-built to accelerate the UAE's federal agentic transformation. Twelve new commands map one-to-one onto the four Cabinet instruments and the federal regulatory baseline they sit on, producing the artefact set every in-scope service needs at the cadence the two-year deadline rewards. The toolkit is open source, runs across seven AI-assistant distribution formats, and is available now to every UAE federal entity working under the decree.

The transformation it accelerates is the most ambitious agentic-AI commitment any government has made. On 23 April 2026, His Highness Sheikh Mohammed bin Rashid Al Maktoum, chairing the UAE Cabinet under the directives of His Highness Sheikh Mohamed bin Zayed Al Nahyan, announced what will be remembered as a foundational moment in the history of agentic government: a federal commitment to deploy autonomous AI across fifty per cent of UAE government sectors and services within two years. The Cabinet, in the same sitting, adopted four governance instruments to scaffold the work, formed a dedicated taskforce chaired by His Excellency Mohammad Abdullah Al Gergawi to drive execution, and built personal performance assessment of ministers, directors-general, and entities into the delivery model itself.

The four Cabinet instruments do not just describe the destination; they specify the governance scaffolding that gets the federal government there in the time available. The UAE Code for Government Services and Zero Bureaucracy. The Government Services Digital Records Policy. The Government Services Data Sharing Policy. The Federal Government Guide to Aligning Digital Government Projects with National Priorities. Together these four instruments give every federal entity a clear operational template for what the agentic transformation requires of them, and ArcKit v4.10 gives every federal architect a one-to-one set of commands to deliver against them. This article describes how each piece of the release supports the agenda the Cabinet set out, and what it enables for federal architects and Chief AI Officers from this week onwards.

## The Four Cabinet Instruments and the Operational Clarity They Bring

Read the decree in its operational mode and the four instruments give every federal entity an unusually clear set of artefact-level deliverables.

The **[UAE Code for Government Services and Zero Bureaucracy](https://sheikhmohammed.ae/en/latest-news/30661)** establishes a single federal reference model for service quality, replacing fragmented entity approaches with a unified standard. This gives every federal entity a shared definition of "good" for service design, and a clear obligation to map its catalogue against the Code, publish a bureaucracy-elimination baseline, and commit to customer-experience KPIs the taskforce can evaluate.

The **[Government Services Digital Records Policy](https://sheikhmohammed.ae/en/latest-news/30661)** elevates digital records to the status of official source of core data. The implication is empowering: federal entities now have explicit federal-level authority to digitise records, publish a comprehensive records guide, and operate continuous data-quality requirements as the new normal. Every service produces a Digital Records Plan with source-of-truth designation, retention schedule, and the records-as-official-source designation.

The **[Government Services Data Sharing Policy](https://sheikhmohammed.ae/en/latest-news/30661)**, captured in the principle "collect once, use securely", gives federal entities the federation framework they have needed to integrate cleanly across federal, local, and private-sector boundaries. Every cross-entity data flow becomes a Data Sharing Agreement with a documented PDPL lawful basis, a federation or API plan, and an information-security treatment that satisfies the Cybersecurity Council's controls. The administrative friction that has historically slowed inter-entity collaboration is replaced with a clear operational template.

The **[Federal Government Guide to Aligning Digital Government Projects with National Priorities](https://sheikhmohammed.ae/en/latest-news/30661)** ensures every digital initiative explicitly serves [NIS 2031](https://u.ae/en/about-the-uae/strategies-initiatives-and-awards/strategies-plans-and-visions/finance-and-economy/the-uae-national-investment-strategy), [AI 2031](https://ai.gov.ae/strategy/), the [Digital Economy Strategy](https://u.ae/en/about-the-uae/strategies-initiatives-and-awards/strategies-plans-and-visions/finance-and-economy/uae-digital-economy-strategy), and [We the UAE 2031](https://wethe.ae/). Reuse of existing federal capabilities ([UAE Pass](https://docs.uaepass.ae/), FedNet, the federal data-sharing surface as it lands) becomes the default rather than the exception, making every project lighter, faster, and better aligned to national strategic priorities. The artefact is a National Priorities Alignment Statement: reuse-versus-build justification, capability-reuse register, and the explicit alignment matrix.

Four instruments. Four clearly specified artefacts per service. A taskforce-readable trail across the federal portfolio.

## One Command per Cabinet Instrument

ArcKit v4.10.1 ships one community-contributed command per Cabinet instrument, in a one-to-one mapping that mirrors the structure of the decree itself and lets architects deliver the four required artefacts with confidence. The community-overlay marker reflects the maintenance posture, not the technical maturity: the canonical chain holds, the regression sweep passes, and qualified UAE federal compliance counsel should review output before reliance until a UAE domain co-maintainer joins to share the citation-accuracy load.

`uae-zero-bureaucracy` produces the Service Catalogue review against the Code for Government Services, with the bureaucracy-elimination baseline and customer-experience KPIs the Code expects. The architect runs the command against an existing service definition and receives a structured artefact ready for taskforce review.

`uae-digital-records` produces the Digital Records Plan that the Records Policy obliges, designating the source-of-truth register per service and capturing the retention schedule, audit procedures, and disposal rules in a single coherent artefact.

`uae-data-sharing` produces the Data Sharing Agreement under the Sharing Policy, mapping each cross-entity data flow to a federation mechanism and an explicit PDPL lawful basis. It chains directly to `uae-pdpl` for the lawful-basis layer, so the privacy and sharing artefacts stay coherent and traceable.

`uae-priorities-alignment` produces the National Priorities Alignment Statement under the Federal Government Guide, with the reuse-versus-build justification, the capability-reuse register, and the explicit alignment matrix to NIS 2031, AI 2031, the Digital Economy Strategy, and We the UAE 2031.

The handoffs declared in each command's frontmatter render as a Suggested Next Steps section in the generated artefact, so the dependency between the four is built into the toolkit itself. A federal architect who runs the four commands in canonical order on a service has the four-instrument compliance picture on disk in versioned, classified, citation-traceable form by the end of a working week. That is the cadence the two-year timeline asks for, delivered today.

## The Federal Baseline, Already Strong, Now Operationalised

The four Cabinet instruments rest on a federal data, security, identity, and procurement baseline that has been carefully built and published over years. The Personal Data Protection Law (Federal Decree-Law 45/2021), the UAE Cybersecurity Council's Information Assurance Standard v2, the National Cloud Security Policy v2, the Federal Procurement Decree-Law (11/2023), and the UAE Pass identity infrastructure together represent one of the most coherent federal regulatory stacks in any government anywhere. ArcKit v4.10 makes that stack operationally accessible to every architect at the moment of artefact production.

`uae-pdpl` runs Federal Decree-Law No. 45 of 2021 and produces the DPIA, lawful-basis register, data-subject-rights procedure, cross-border transfer log, and breach-notification playbook the UAE Data Office expects. The "collect once, use securely" principle of the Data Sharing Policy depends on a clean PDPL compliance layer; the two commands chain together by design so federal entities can deliver on both obligations in one coherent workflow.

`uae-ias` builds the Statement of Applicability against the Cybersecurity Council's Information Assurance Standard v2 (188 controls across six management and nine technical families, priority-tiered P1 to P4 against the entity's CII designation). Every agentic system processing federal data sits inside the IAS perimeter, and the toolkit produces the SoA as a structured starting point the architect can complete with their entity-specific evidence in days rather than weeks.

`uae-cloud-residency` reads the per-classification residency rules from the National Cloud Security Policy v2 and validates the chosen cloud architecture against them. The approved sovereign options the UAE has built (Core42 and G42 sovereign offerings, Microsoft UAE North and Central, TDRA FedNet, and the e& Sovereign Launchpad on AWS) are named explicitly, so architects can match each dataset to a residency-compliant CSP with full confidence. The shared-responsibility matrix and exit/portability plan are produced as part of the artefact.

`uae-classification` produces the Smart Data Classification Register the Digital Records Policy depends on (you cannot designate a record as the official source until you have classified it) and that `uae-cloud-residency` reads to enforce the per-level residency obligations. It is the upstream commit on which most of the rest of the chain depends, and the toolkit gets it onto disk in the first half-day of work on a new service.

`uae-uaepass` produces the federal identity integration design. UAE Pass is the federal digital identity capability the Federal Government Guide expects services to reuse, and the toolkit captures the OIDC flow, the claim mapping, the Basic-versus-Verified profile selection, and the Service Provider onboarding pack in a single architecture artefact ready for the ICP and TDRA onboarding process.

`uae-procurement` produces the federal procurement strategy under Federal Decree-Law No. 11 of 2023, with the ITT/RFP packs aligned to the Ministry of Finance Digital Procurement Platform templates, an In-Country Value plan that supports the federal ICV agenda, and the evaluation report structure. Every agentic AI deployment that depends on commercial vendors gets a clean funding-gate artefact from this command.

Eight federal-baseline commands, plus the four Cabinet-instrument commands, give federal architects a complete artefact set covering every obligation a federal entity carries under the decree. Combined with ArcKit's standard chain (requirements, stakeholders, risks, data model, integration, ADRs, SOBC, Wardley map, framework synthesis), this is an end-to-end pipeline a federal architect can run from week one of a new service to taskforce-ready artefact set inside a single calendar quarter.

## The AI Governance Layer the Decree Calls For

Two further commands cover the AI-specific governance the agentic mandate makes load-bearing, and both are anchored on existing UAE leadership in AI policy.

`uae-ai-charter` runs the project's AI system against the twelve principles of the UAE Charter for the Development and Use of AI. The Charter, published by the UAE in 2024, is one of the most comprehensive national AI charters in the world: human-machine ties, safety, bias mitigation, data privacy, transparency, human oversight, governance and accountability, technological excellence, human commitment, peaceful coexistence, inclusive access, and lawful compliance. ArcKit produces a structured assessment against each of the twelve principles, giving federal CAIOs the substantive evidence they need to demonstrate Charter compliance with confidence.

`uae-ai-autonomy-tier` produces the three-tier autonomy posture that operationalises the decree's "autonomous execution and decision-making" language: Tier 1 internal-productivity, Tier 2 investor-facing-with-approval, Tier 3 regulated or financial. The artefact captures per-tier guard-rails, approval gates, audit obligations, and the criteria for promoting a use-case from one tier to the next. It gives federal CAIOs a clear, defensible authority envelope for every deployed agentic system, exactly what the Cabinet's accountability model requires.

The autonomy tier is the bridge between the Charter's high-level principles and the specific operational decisions a federal CAIO ratifies when they sign off a deployment. With it, every agentic system has a documented authority envelope the taskforce can review and the CAIO can defend.

## The Twelve Commands at a Glance

For the policy reader who wants the complete inventory in one place, here is the full v4.10 command set grouped by the role each plays in supporting the agentic agenda.

**Federal data and security baseline.** `uae-classification` (Smart Data Classification Register), `uae-pdpl` (PDPL compliance), `uae-ias` (IAS Statement of Applicability), `uae-cloud-residency` (sovereign cloud residency).

**Federal identity.** `uae-uaepass` (UAE Pass integration design).

**Cabinet-mandated instruments.** `uae-zero-bureaucracy` (Code for Government Services), `uae-digital-records` (Digital Records Plan), `uae-data-sharing` (Data Sharing Agreement), `uae-priorities-alignment` (National Priorities Alignment Statement).

**AI governance.** `uae-ai-charter` (Charter for AI compliance), `uae-ai-autonomy-tier` (three-tier autonomy posture).

**Procurement.** `uae-procurement` (Federal Decree-Law 11/2023 procurement strategy).

Twelve commands in total. Every one is anchored on a published federal instrument or, in the case of the autonomy tier, on the operational pattern federal entities have already converged on. All ship as a community-contributed overlay (officially-maintained baseline stays at 68; community-contributed overlays grow from 21 to 33), and all are available today via marketplace install or `pip install arckit-cli`. The overlay is solo-maintained while a UAE domain co-maintainer is being recruited; once one joins, the overlay becomes a candidate for official-tier promotion.

## A Document Control Header That Speaks the Federal Language

The Document Control table at the head of every artefact has been re-engineered to speak the language of UAE federal governance directly. When an entity sets `governance_framework: UAE Federal` and `classification_scheme: UAE Smart Data` in their plugin configuration, every artefact ArcKit generates from that point on renders the UAE Smart Data ladder (Open, Shared, Confidential, Secret, Top Secret) and adds four federal-context fields to the Document Control table: Federal Entity, Cabinet Instrument cited, Sovereign Cloud Region, and AI Autonomy Tier.

The fields are operationally useful. The Cabinet Instrument field encodes which of the four instruments the artefact attests against, so the taskforce can index artefacts by instrument when reviewing entity progress. The Sovereign Cloud Region records the residency posture the Cybersecurity Council reviews against the National Cloud Security Policy. The AI Autonomy Tier connects every artefact to the autonomy register the entity holds. These four pieces of metadata are exactly the cross-cutting lookups a taskforce-level review will run, and they are now generated automatically with every artefact rather than requiring manual entry.

A one-time `arckit migrate-classification` helper ships in the same release to support entities migrating existing artefacts from the UK ladder (a common starting point for early ArcKit adopters in the region) to the UAE Smart Data ladder. The migration is conservative, transparent, and reviewable: the helper produces a diff for architect approval rather than auto-applying the change.

## Accelerating the Two-Year Delivery Cadence

The decree's two-year timeline rewards entities that establish a fast, repeatable cadence early. ArcKit v4.10 enables exactly that cadence. The toolkit produces each artefact in five to fifteen minutes, freeing the federal architect to spend the rest of the day on editorial judgement, cross-reference verification, and the substantive review the artefact's professional accountability requires. This redistribution of architect time, from drafting to judging, is what makes the two-year timeline arithmetically achievable for federal entities of every size.

A federal CAIO with a small architecture team can now run the canonical UAE chain on a pathfinder service in week two of a programme, complete the full artefact set in week six, and use the framework artefact the toolkit produces to accelerate every subsequent service in the portfolio. By month three, the entity has a working pattern the rest of the in-scope portfolio can re-use. By month twelve, the entity is positioned to deliver against the fifty-per-cent target with months to spare.

The toolkit does not replace the architect's professional judgement or the CAIO's accountability for what they sign off; those are exactly where they should be. What it removes is the artefact-production bottleneck that would otherwise consume the architecture function's calendar, freeing federal architects to focus on the design and assurance work that genuinely requires their expertise.

## What Comes Next

ArcKit's UAE coverage will continue to grow alongside the decree's implementation. Three areas are already on the v4.11 backlog and represent the next set of contributions the maintainer is committed to delivering.

A `uae-translate` utility command will produce Arabic-language companion artefacts for citizen-facing services, supporting the Charter's principle of inclusive access and the natural Arabic-English bilingualism of federal communications.

Sector-specific overlays for the Abu Dhabi Healthcare Information and Cyber Security Standard (ADHICS), the Dubai Information Security Regulation, and the Central Bank of UAE's AI guidance for financial-sector entities will land as community-contributed extensions, building on the same model that supports the existing EU, French, and Austrian community overlays in ArcKit. UAE domain experts interested in maintaining these extensions are warmly invited to reach out via the repository.

The maintainer is actively recruiting a UAE-based domain co-maintainer for the federal overlay as well, to share the citation-accuracy review burden as UAE federal regulatory text continues to evolve. The overlay ships as community-contributed today precisely because solo CODEOWNERS is not a sustainable maintenance posture for fast-moving federal regulatory text; a co-maintainer is the prerequisite for any future official-tier promotion. This is a strong opportunity for a senior UAE federal architect to shape ArcKit's UAE trajectory directly.

## Standing Ready for the Federal Transformation

The UAE has set itself a goal of historic ambition: to be the first government in the world to deploy agentic AI at scale across federal operations. The Cabinet's mechanism is sound. The deadline is clear. The taskforce is named. Ministerial accountability is built into the model. The four governance instruments give every entity a clear operational template. The federal regulatory stack the instruments rest on is one of the most coherent in any government anywhere. The sovereign cloud capacity, the federal identity infrastructure, and the federal training programmes the decree commits to all reinforce the delivery posture.

ArcKit v4.10 is one piece of the supporting infrastructure stack, alongside UAE Pass, FedNet, the federal data-sharing surface, the sovereign cloud capacity that Core42, Microsoft, and e& are building, and the training programmes the decree commits to for federal employees. The release is open source, available today, runs across seven AI-assistant distribution formats (Claude Code, Codex CLI, Gemini CLI, OpenCode CLI, GitHub Copilot, the standalone Codex extension, and the Paperclip TypeScript plugin), and is engineered specifically to accelerate the agenda the Cabinet set out.

Every UAE federal entity working under the decree can install ArcKit v4.10 today, configure it for UAE Federal governance and UAE Smart Data classification, and begin producing the Cabinet-mandated artefacts in their first working week. Twelve commands. Four Cabinet instruments. Eight federal baseline obligations. One coherent toolkit, ready to support the federal architecture community in delivering the most ambitious agentic-government commitment any nation has made.

The decree set the agenda. ArcKit v4.10 stands ready to accelerate it.

## Sources and Further Reading

**Primary sources for the decree and the four Cabinet instruments**

- Sheikh Mohammed bin Rashid Al Maktoum announcement, 23 April 2026: [sheikhmohammed.ae/en/latest-news/30661](https://sheikhmohammed.ae/en/latest-news/30661)
- UAE Media Office, official Cabinet release: [mediaoffice.ae](https://mediaoffice.ae/en/news/2026/april/23-04/mohammed-bin-rashid-chairs-uae-cabinet-meeting)

**Federal regulatory baseline**

- Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data (PDPL): [uaelegislation.gov.ae](https://uaelegislation.gov.ae/en/legislations/1972/download)
- UAE Cybersecurity Council Information Assurance Standard v2: [csc.gov.ae](https://csc.gov.ae/en/w/uae-information-assurance-standard)
- National Cloud Security Policy v2: [csc.gov.ae](https://csc.gov.ae/en/w/national-cloud-security-policy)
- UAE Smart Data Classifications: [u.ae](https://u.ae/en/about-the-uae/digital-uae/data/data-operability)
- Federal Decree-Law No. 11 of 2023 on Procurements in the Federal Government: [mof.gov.ae](https://mof.gov.ae/wp-content/uploads/2024/01/Federal-Law-No.-11-of-2023-on-Procurements-in-the-Federal-Government.pdf)
- UAE Pass developer documentation: [docs.uaepass.ae](https://docs.uaepass.ae/)

**National strategies referenced by `uae-priorities-alignment`**

- UAE National Strategy for AI 2031: [ai.gov.ae/strategy](https://ai.gov.ae/strategy/)
- UAE Charter for the Development and Use of AI: [uaelegislation.gov.ae](https://uaelegislation.gov.ae/en/policy/details/the-uae-charter-for-the-development-and-use-of-artificial-intelligence)
- UAE Digital Economy Strategy: [u.ae](https://u.ae/en/about-the-uae/strategies-initiatives-and-awards/strategies-plans-and-visions/finance-and-economy/uae-digital-economy-strategy)
- We the UAE 2031: [wethe.ae](https://wethe.ae/)

**ArcKit**

- Repository: [github.com/tractorjuice/arc-kit](https://github.com/tractorjuice/arc-kit)
- v4.10.0 release: [github.com/tractorjuice/arc-kit/releases/tag/v4.10.0](https://github.com/tractorjuice/arc-kit/releases/tag/v4.10.0)
- UAE overlay guide: `docs/guides/uae-overlay.md`
- UAE overlay maintenance and citation register: `docs/guides/uae-overlay-maintenance.md`
