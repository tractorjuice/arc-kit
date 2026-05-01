# How ArcKit v4.10 Operationalises the UAE's Agentic Decree

On 23 April 2026, His Highness Sheikh Mohammed bin Rashid Al Maktoum, chairing the UAE Cabinet under the directives of His Highness Sheikh Mohamed bin Zayed Al Nahyan, set out the most ambitious agentic-AI deadline any government has yet committed to: fifty per cent of UAE government sectors and services on agentic AI within two years. The Cabinet, in the same sitting, adopted four governance instruments to scaffold the work, formed a dedicated taskforce chaired by His Excellency Mohammad Abdullah Al Gergawi to drive execution, and made personal performance assessment of ministers, directors-general, and entities a function of how fast they adopt the new model.

It is a remarkable piece of policy. The UAE has set itself the goal of being the first government in the world to deploy agentic AI at scale across federal operations, and it has put the assessment mechanism in writing.

What it has not done, and could not reasonably do at the level of a Cabinet decree, is specify the underlying infrastructure architects will need to deliver against the deadline. Two years is short. Federal scope is wide. The artefact volume implied by four Cabinet instruments multiplied across half a federal portfolio is large enough that it cannot be produced by hand at the cadence the deadline requires. The infrastructure to compress that artefact production is a problem the architecture community has to solve.

ArcKit v4.10, shipped today, is one piece of that infrastructure. Twelve new commands, an extended Document Control conditional, and a one-time migration helper, all engineered specifically against the four Cabinet instruments and the federal regulatory baseline they sit on. This article describes how each piece of the release maps to the agentic agenda the decree set out, and what it changes about the practical viability of the two-year timeline.

## The Four Cabinet Instruments and What They Oblige

Read the decree in its operational mode and four classes of artefact have to land on every in-scope service.

The **UAE Code for Government Services and Zero Bureaucracy** establishes a single federal reference model for service quality, replacing fragmented entity approaches. In practice this obliges every federal entity to map its service catalogue against the Code, to publish a bureaucracy-elimination baseline (current versus target steps, fields, time, cost), and to commit to customer-experience KPIs that the taskforce can read.

The **Government Services Digital Records Policy** makes digital records the official source of core data, with a comprehensive records guide and continuous data-quality requirements. It obliges a Digital Records Plan per service: source-of-truth designation, retention schedule, records-as-official-source claim, audit and disposal procedures.

The **Government Services Data Sharing Policy**, captured in the principle "collect once, use securely", obliges integration across federal, local, and private-sector boundaries, with explicit governance and information-security safeguards. The artefact this implies is a Data Sharing Agreement per inter-entity data flow, with a documented PDPL lawful basis per share, a federation or API plan, and an information-security treatment that satisfies the Cybersecurity Council's controls.

The **Federal Government Guide to Aligning Digital Government Projects with National Priorities** obliges feasibility studies, pilot approaches, reuse of existing federal capabilities (UAE Pass, FedNet, the federal data-sharing surface as it lands), and explicit avoidance of duplication. The artefact is a National Priorities Alignment Statement: reuse-versus-build justification, capability-reuse register, alignment to NIS 2031, AI 2031, the Digital Economy Strategy, and We the UAE 2031.

These four artefacts, per service, across the in-scope half of the federal portfolio, are not optional additions to the engineering work. They are the substrate the taskforce will read to assess ministerial performance.

## The Direct Mapping from Decree to Toolkit

ArcKit v4.10 ships one official-baseline command per Cabinet instrument, in a one-to-one mapping that mirrors the structure of the decree itself.

`uae-zero-bureaucracy` produces the Service Catalogue review against the Code for Government Services, with the bureaucracy-elimination baseline and customer-experience KPIs the Code expects. `uae-digital-records` produces the Digital Records Plan that the Records Policy obliges, designating the source-of-truth register per service. `uae-data-sharing` produces the Data Sharing Agreement under the Sharing Policy, mapping each cross-entity data flow to a federation mechanism and an explicit PDPL lawful basis, and chains to `uae-pdpl` for the lawful-basis layer. `uae-priorities-alignment` produces the National Priorities Alignment Statement under the Federal Government Guide, with the reuse-versus-build justification, the capability-reuse register, and explicit alignment to the NIS 2031, AI 2031, Digital Economy Strategy, and We the UAE 2031 strategies. Four commands, four instruments, four artefacts.

The handoffs declared in each command's frontmatter render as a Suggested Next Steps section in the generated artefact, so the dependency between the four is not an external diagram but a property the architect can follow inside the toolkit. Run the four in canonical order on a service and the four-instrument compliance picture lands on disk in versioned, classified, citation-traceable form.

That is the surface most directly visible to the taskforce. The rest of the release supports it.

## The Federal Baseline the Decree Rests On

Compliance with the four Cabinet instruments is not stand-alone; it sits on the federal data, security, identity, and procurement laws that have been in force for years. ArcKit v4.10 operationalises that baseline as well.

`uae-pdpl` runs Federal Decree-Law No. 45 of 2021 and produces the DPIA, lawful-basis register, data-subject-rights procedure, cross-border transfer log, and breach-notification playbook the UAE Data Office expects. The "collect once, use securely" principle of the Data Sharing Policy is unworkable without a clean PDPL compliance layer underneath; the two commands chain together by design.

`uae-ias` builds the Statement of Applicability against the Cybersecurity Council's Information Assurance Standard v2 (188 controls across six management and nine technical families, priority-tiered P1 to P4 against the entity's CII designation). Any agentic system processing federal data, irrespective of its functional purpose, sits inside the IAS perimeter and needs the SoA.

`uae-cloud-residency` reads the per-classification residency rules from the National Cloud Security Policy v2 and validates the chosen cloud architecture against them. The approved sovereign options (Core42 and G42, Microsoft UAE North and Central, TDRA FedNet, the e& Sovereign Launchpad on AWS) are named explicitly. The shared-responsibility matrix and exit/portability plan are produced as part of the artefact.

`uae-classification` produces the Smart Data Classification Register that the Digital Records Policy depends on (you cannot designate a record as the official source until you have classified it) and that `uae-cloud-residency` reads to enforce the per-level residency obligations. It is the upstream commit on which most of the rest of the chain depends.

`uae-uaepass` produces the federal identity integration design. UAE Pass is the digital-identity capability that the Federal Government Guide expects services to reuse rather than re-build. The integration design captures the OIDC flow, the claim mapping, the Basic-versus-Verified profile selection (which is itself a security decision worth an ADR), and the Service Provider onboarding pack.

`uae-procurement` produces the federal procurement strategy under Federal Decree-Law No. 11 of 2023, with the ITT/RFP packs aligned to the Ministry of Finance Digital Procurement Platform templates, an In-Country Value plan, and the evaluation report structure. Any agentic AI deployment that depends on commercial vendors (which is most of them, in the current market) needs this artefact for its funding gate.

Eight federal-baseline commands plus the four Cabinet-instrument commands give the architect a complete artefact set covering the obligations a federal entity carries today. Plus the standard ArcKit chain for requirements, stakeholders, risks, data model, integration, ADRs, SOBC, Wardley map, and the framework synthesis. That is an end-to-end pipeline.

## The AI Governance Layer

Two further commands cover the AI-specific governance that the agentic mandate makes load-bearing.

`uae-ai-charter` runs the project's AI system against the twelve principles of the UAE Charter for the Development and Use of AI. The Charter is the federal articulation of how AI ought to be developed and operated; it covers human-machine ties, safety, bias mitigation, data privacy, transparency, human oversight, governance and accountability, technological excellence, human commitment, peaceful coexistence, inclusive access, and lawful compliance. For an agentic system in particular, the human-oversight and governance-and-accountability principles need substantive evidence rather than tick-box statements.

`uae-ai-autonomy-tier` is an internal ArcKit synthesis (it has no single regulatory anchor) that produces the three-tier autonomy posture the practical UAE federal landscape has converged on: Tier 1 internal-productivity, Tier 2 investor-facing-with-approval, Tier 3 regulated or financial. The artefact captures per-tier guard-rails, approval gates, audit obligations, and the criteria for promoting a use-case from one tier to the next. It is the operational governance object that connects the Charter's high-level principles to the specific decisions a federal CAIO has to ratify when they sign off a deployment.

The autonomy tier is the load-bearing artefact for the decree's "autonomous execution and decision-making" language. Without it, "deploying agentic AI" is an undefined operational claim. With it, every deployed system has a documented authority envelope that the taskforce can review.

## The Twelve Commands at a Glance

For the policy reader who wants the complete inventory in one place, here is the full v4.10 command set grouped by the role each plays in the agentic agenda:

**Federal data and security baseline.** `uae-classification` (Smart Data Classification Register), `uae-pdpl` (PDPL compliance), `uae-ias` (IAS Statement of Applicability), `uae-cloud-residency` (sovereign cloud residency).

**Federal identity.** `uae-uaepass` (UAE Pass integration design).

**Cabinet-mandated instruments.** `uae-zero-bureaucracy` (Code for Government Services), `uae-digital-records` (Digital Records Plan), `uae-data-sharing` (Data Sharing Agreement), `uae-priorities-alignment` (National Priorities Alignment Statement).

**AI governance.** `uae-ai-charter` (Charter for AI compliance), `uae-ai-autonomy-tier` (three-tier autonomy posture).

**Procurement.** `uae-procurement` (Federal Decree-Law 11/2023 procurement strategy).

Twelve commands in total. Every one is anchored on a published federal instrument or, in the case of the autonomy tier, on the operational pattern federal entities have already converged on in practice. None of them are speculative. All of them ship as official baseline, taking the officially-maintained command count from 68 to 80.

## The Document Control Conditional

The Document Control table at the head of every artefact has historically rendered the UK Government classification ladder when `governance_framework` was `UK Gov`, and a Generic ladder otherwise. The UAE Smart Data ladder (Open, Shared, Confidential, Secret, Top Secret) is the third option, and it required restructuring the rendering pattern.

v4.10 replaces the hard-coded Document Control block in every template with a single resolver marker. The marker is resolved at command-execution time using rules in `templates/_partials/RENDERING.md`, picking either the UK partial or the UAE partial based on the `classification_scheme` userConfig value. The UAE partial also adds four federal-context fields to the Document Control table: Federal Entity, Cabinet Instrument cited, Sovereign Cloud Region, AI Autonomy Tier.

The fields are not cosmetic. The Cabinet Instrument field encodes which of the four instruments the artefact attests against, so the taskforce can index artefacts by instrument when reviewing entity progress. The Sovereign Cloud Region records the residency posture, which the Cybersecurity Council reviews against the National Cloud Security Policy. The AI Autonomy Tier connects every artefact to the autonomy-tier register the entity holds. These four pieces of metadata are exactly the cross-cutting lookups a taskforce-level review will run against the corpus.

For UK or Generic projects the rendered output is byte-identical to v4.9.4. The conditional fires only when the framework is UAE Federal. There is no behavioural change for the existing 21 community-overlay commands or the UK baseline.

## The Two-Year Timeline and the Architect Ratio

The decree's two-year deadline only becomes arithmetically possible if the architect-to-engineer ratio in federal entities can shift from the conventional one-to-two to something closer to one-to-five or one-to-six. The conventional ratio assumes architects produce artefacts by hand; the new ratio assumes they ratify artefacts produced by tooling. The shift moves the architect's working day from drafting to judging, which is the only redistribution that makes the timeline tractable.

ArcKit v4.10 is one of the pieces that makes that shift possible for federal entities working under the UAE mandate. The toolkit produces the artefact in five to fifteen minutes; the architect spends the rest of the day on editorial judgement, cross-reference verification, and the substantive review the artefact's professional accountability requires. The compression is not a productivity claim about specific tasks; it is a structural change in how an architecture function operates.

The release does not solve the deadline. Tools do not solve deadlines. It removes the specific bottleneck (artefact production at federal scale) that would otherwise make the deadline arithmetically infeasible.

## What the Release Does Not Do

Three things the toolkit deliberately does not attempt, and that any federal entity adopting it should hold separately.

It does not replace human ratification. Every artefact's Document Control table records the architect, reviewer, and approver as named individuals; the toolkit produces the draft, the human ratifies the artefact. The decree's accountability model rests on named ministers, directors-general, and entity owners; the toolkit's role is to make their decisions defensible, not to substitute for them.

It does not yet ship Arabic-language artefacts. The Charter's principle of inclusive access and the UAE Pass user experience both imply an Arabic-language obligation for citizen-facing services. ArcKit v4.10 is English-only; an Arabic translation utility (`uae-translate`) is on the v4.11 backlog.

It does not yet cover the emirate-level overlays (the Dubai Information Security Regulation, the Abu Dhabi Healthcare Information and Cyber Security Standard) or the Central Bank's AI guidance for financial-sector entities. These sit in scope for community contribution under the same model that supports the existing EU, French, and Austrian overlays. A UAE-specific community co-maintainer is being recruited; the help-wanted note sits in the overlay's maintenance documentation.

These are limitations the maintainer is open about. The federal baseline shipped in v4.10 covers what the Cabinet decree specifically asks of every federal entity. The extensions that build on top will follow as the community shape forms.

## What This Means for the Cabinet's Agenda

The most important property of the release is that it ships before any federal entity is materially behind on the deadline. The decree was issued seven days ago. Most entities are still in the principles-and-portfolio-classification phase of their first ninety days. The toolkit is available now, at the point in the calendar where it matters most.

The UAE has set itself the goal of being the first government to deploy agentic AI at scale across federal operations. The Cabinet's mechanism is sound: a clear deadline, a named taskforce, ministerial accountability, and the four governance instruments to scaffold the work. What was missing, until today, was the open-source toolkit infrastructure to produce the artefacts the four instruments oblige at the cadence the deadline requires.

That is what ArcKit v4.10 contributes. The release is one piece of the agentic-government infrastructure stack, alongside UAE Pass, FedNet, the federal data-sharing surface, the sovereign cloud capacity that Core42, Microsoft, and e& are building, and the training programmes the decree commits to for federal employees. None of these pieces alone delivers the deadline. Together, they make the deadline arithmetically possible.

The toolkit is open source, runs across seven AI-assistant distribution formats (Claude Code, Codex CLI, Gemini CLI, OpenCode CLI, GitHub Copilot, the standalone Codex extension, and the Paperclip TypeScript plugin), and is available today via marketplace install or `pip install arckit-cli`. The documentation lives in the repository at `tractorjuice/arc-kit`. The launch announcement carries the full command list and the maintenance commitments.

For UAE federal entities under the decree, the working clock started seven days ago. The toolkit is one fewer thing to build before the work can.
