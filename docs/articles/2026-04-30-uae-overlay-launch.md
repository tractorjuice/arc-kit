# ArcKit v4.10: 12 UAE Federal Commands, Official Baseline

ArcKit v4.10, shipped today, adds twelve commands covering the UAE federal regulatory and digital-government stack. The trigger was the Cabinet decree of 23 April 2026 mandating that 50% of federal services run on agentic AI by April 2028. The decree referenced an existing constellation of federal instruments (the Personal Data Protection Law, the Information Assurance Standard, the National Cloud Security Policy, the Code for Government Services, the Charter for AI, the Federal Procurement Decree-Law) and asked architects to deliver against all of them on a 24-month clock. ArcKit's job, as it has been for the UK, French, and Austrian overlays, is to make that delivery less of a slide deck and more of an artefact pipeline.

The twelve commands ship as official baseline, taking the official-tier count from 68 to 80. The 21 community-contributed commands continue to sit alongside the baseline under their own header. Total commands available across all tiers: 101.

## What's in the Release

The twelve commands group into five categories. None of them are speculative; each is anchored on a published federal instrument.

The four federal data and security commands cover the base layer. `uae-classification` produces a UAE Smart Data Classification Register, mapping every dataset in the project to one of `Open`, `Shared`, `Confidential`, `Secret`, or `Top Secret`, with handling rules and a declassification schedule. `uae-pdpl` runs Federal Decree-Law No. 45 of 2021 and produces a DPIA, a lawful-basis register, the data-subject-rights procedure, and the cross-border transfer log. `uae-ias` builds a Statement of Applicability against the Information Assurance Standard v2's 188 controls (60 management M1 to M6, plus 128 technical T1 to T9), priority-tiered P1 to P4 against the entity's CII designation. `uae-cloud-residency` reads the per-classification residency rules from the National Cloud Security Policy v2, names the approved Cloud Service Provider options (Core42 and G42 sovereign offerings, Microsoft UAE North and Central, TDRA FedNet, the e& Sovereign Launchpad on AWS), and captures the shared-responsibility matrix and the exit/portability plan.

Federal identity is one command. `uae-uaepass` produces the UAE Pass integration design, covering the OIDC/OAuth flow, the claim mapping, the Basic-versus-Verified profile selection, the Service Provider onboarding pack, and the e-signature audit trail. The decision between Basic and Verified profiles is captured as an architecturally significant decision and chained to an ADR.

The four Cabinet instruments are the operational rules a federal entity has to align to whether or not the project itself is data, identity, AI, or procurement-shaped. `uae-zero-bureaucracy` reviews the service catalogue under the Code for Government Services and the Zero Bureaucracy programme, capturing service catalogue mapping, bureaucracy-elimination baseline, and customer-experience KPIs. `uae-digital-records` produces the Digital Records Plan (the source-of-truth register per service, the retention schedule, and the records-as-official-source designation) under the Government Services Digital Records Policy. `uae-data-sharing` produces a Data Sharing Agreement under the Government Services Data Sharing Policy ("collect once, use securely") with PDPL lawful basis per share. `uae-priorities-alignment` produces a National Priorities Alignment Statement under the Federal Government Guide, with reuse-versus-build justification, capability-reuse register (UAE Pass, FedNet, etc.), and explicit alignment to NIS 2031, AI 2031, the Digital Economy Strategy, and We the UAE 2031.

AI governance is two commands. `uae-ai-charter` runs the project's AI system against the twelve principles of the UAE Charter for the Development and Use of AI: human-machine ties, safety, bias mitigation, data privacy, transparency, human oversight, governance and accountability, technological excellence, human commitment, peaceful coexistence, inclusive access, and lawful compliance. `uae-ai-autonomy-tier` is an internal ArcKit synthesis (there is no single regulatory anchor for it) producing a three-tier autonomy posture: Tier 1 internal-productivity, Tier 2 investor-facing-with-approval, Tier 3 regulated/financial. The artefact captures per-tier guard-rails, approval gates, audit obligations, and the criteria for promoting a use-case from one tier to the next.

Procurement is one command. `uae-procurement` produces the federal procurement strategy under Federal Decree-Law No. 11 of 2023, with ITT/RFP packs against the Ministry of Finance Digital Procurement Platform templates, an In-Country Value plan, the evaluation report structure, and the contract register.

The handoffs declared in each command's frontmatter render as a `## Suggested Next Steps` section in non-Claude variants and as marketplace-driven follow-ups in Claude Code, so the canonical chain is not an external diagram but a property of the artefacts themselves.

## Why Official, Not Community

When ArcKit added the eighteen EU and French commands in v4.7, then the three Austrian commands in v4.8, both went out as community-tier with a `[COMMUNITY]` prefix in `/help`, a warning banner before each prompt body, and a `Template Origin: Community` value in the Document Control header. The reasoning at the time held: those overlays were contributed by domain experts whose citations needed independent review against rapidly-shifting regulatory text, and the community marker set the right reading frame.

The UAE overlay sits differently for two reasons.

The first is architectural. The four UK / Generic / EU+French / Austrian community overlays are layered onto the existing regulatory backbone; they do not change how Document Control renders, they do not introduce a new classification ladder, and they do not require coordinated changes across the templates registry. The UAE overlay does all three. It introduces a Smart Data classification ladder (Open / Shared / Confidential / Secret / Top Secret), it requires every artefact's Document Control header to render that ladder when `governance_framework` is `UAE Federal`, and it requires the conditional rendering rules to apply uniformly across the entire toolkit (UAE-specific or otherwise). That cross-cutting change cannot be made at community tier without forcing every architect to remember which conditional applied to which template; it has to be a baseline change.

The second reason is regulatory text stability. The EU AI Act is mid-application; ANSSI's SecNumCloud catalogue updates monthly; the Austrian NISG transposition is still settling. Citations in those overlays move quickly enough that flagging community status is a useful warning to architects. The UAE corpus the overlay rests on is unusually stable: Federal Decree-Law No. 45 of 2021 has been in force for four years; Federal Decree-Law No. 11 of 2023 is the consolidated procurement law; the four Cabinet instruments are programme-level documents that change only by Cabinet Resolution. The Charter for AI is a published twelve-principle document. The Information Assurance Standard is at v2. The National Cloud Security Policy is at v2. The places the text is genuinely unsettled (the PDPL Executive Regulation, the exact Smart Data level names, the UAE Pass-to-eIDAS mapping, AWS me-south-1 acceptability, Central Bank AI guidance, Cabinet Affairs versus National Archives ownership of the Digital Records Policy) are flagged inline with `[NEEDS VERIFICATION]` markers and tracked in the maintenance document under their own GitHub issues.

Six explicit deferrals; sixty-plus citations that are stable. That ratio sits closer to UK official tier than to community tier. The overlay ships as official.

The CODEOWNERS file is updated to put the `uae-*` paths under the repository owner alone, with a recruiting note for a UAE domain co-maintainer. When that co-maintainer joins, they will be auto-requested for review on the path; until then the maintainer carries the load.

## The Document Control Conditional

The Document Control table at the head of every artefact has historically rendered one of two ladders: UK Government (`PUBLIC` / `OFFICIAL` / `OFFICIAL-SENSITIVE` / `SECRET` / `TOP SECRET`) when `governance_framework` is `UK Gov`, or Generic (`PUBLIC` / `INTERNAL` / `CONFIDENTIAL` / `RESTRICTED`) otherwise. The table itself was hard-coded into each of the eighty-three or so templates per directory, with the values switched by reading the userConfig at command-execution time.

The UAE overlay's Smart Data ladder cannot be expressed inside a hard-coded table. It needs three branches (UK, Generic, UAE), and each template is now consumed across multiple jurisdictions. Hard-coding three tables per template would multiply the maintenance surface by three with very little benefit.

v4.10 replaces the hard-coded Document Control block with a single `<!-- DOC-CONTROL-HEADER -->` marker. The marker is resolved at command-execution time using the rules in `templates/_partials/RENDERING.md`. The rendering reads `governance_framework` and `classification_scheme` from userConfig, picks the appropriate ladder, and emits the table. For UK or Generic projects the rendered output is byte-identical to v4.9.4; the regression sweep across v3, v8, and v17 confirmed that. For UAE projects the table renders in Smart Data terms.

The architectural lesson is the same one ArcKit's hooks system has been gradually internalising: hard-code where the structure is genuinely fixed, and use markers with a single canonical rendering rule where the structure is jurisdiction-dependent. The Document Control header was the right next candidate.

## Migration from the UK Ladder

A fair number of UAE federal entities have been using ArcKit with `governance_framework: UK Gov` because the UK Government Service Standard was the closest available analogue. Those projects now have artefacts classified `OFFICIAL`, `OFFICIAL-SENSITIVE`, and so on. v4.10 ships a one-time helper to migrate them.

```bash
arckit migrate-classification --root projects             # report only
arckit migrate-classification --root projects --apply     # apply the mapping
```

The mapping is conservative: `PUBLIC` becomes `Open`, `OFFICIAL` becomes `Shared`, `OFFICIAL-SENSITIVE` becomes `Confidential`, `SECRET` and `TOP SECRET` keep their names. The architect should review the proposed diff (the `--apply` flag is opt-in for exactly that reason) and verify Confidential and above against the entity's local Data Office guidance before the change goes into version control. The helper's job is to remove the mechanical work; the judgement stays with the architect.

## The Reference Implementation

Every ArcKit overlay needs a regression baseline, both for confidence in the release and for demonstrating the canonical chain to people who haven't run it. The UAE overlay's reference implementation is the `arckit-test-project-v20-uae-moi-ipad` test repo. It is private (the brief is sensitive enough to live inside the `tractorjuice` organisation rather than on the public test-repo set), but the artefact pipeline it exercises is the canonical chain end-to-end: principles, requirements, data-model, risk, then the twelve `uae-*` commands in canonical order, then sobc, wardley, and framework. It served as the v20 baseline for the Phase B and Phase C end-to-end gates during this release.

The other 46 test repos remain on UK or Generic tiers; the regression sweep confirmed Document Control output is unchanged for them.

## What's Deferred

Four overlay extensions are deliberately out of scope for v4.10 and tracked in the maintenance document for the v4.11 / v5.0 backlog.

Bilingual Arabic / English, via a future `uae-translate` command, is the most-asked feature and the most complex. It needs a translation backend, glossary management for federal terms (where Arabic precision matters in ministerial submissions), and a cultural-review handoff to a human reviewer. v5.0 territory.

The Federal Mandate doc-types category would group the four Cabinet instruments (`ZBUR`, `DREC`, `DSHR`, `NPRA`) under a dedicated category instead of the current `Governance` placement. Mechanical change; held back to keep the v4.10 release surface focused on the twelve commands themselves.

Sector overlays (ADHICS for Abu Dhabi healthcare, Dubai ISR, Central Bank financial services, SCA capital markets) are the natural next layer for federal entities operating in regulated verticals. They are good candidates for community contributions in the same shape that the EU/French/Austrian work demonstrated. v4.11 onwards.

A `uae-vendor-sovereignty` command, comparable to `fr-secnumcloud` for France, would score vendors against the federal sovereign-cloud and ICV criteria. Held for v4.12 alongside the wider procurement-domain refresh.

## What's Next

In the first week post-merge, the six `[NEEDS VERIFICATION]` items get one tracking issue each, and the UAE domain co-maintainer recruiting issue is opened. The Citation Register's quarterly review cadence runs on 30 July. The v4.11 window (target: late June 2026) brings the Federal Mandate doc-types category and the first sector-overlay seed. v5.0 brings the bilingual `uae-translate` command for federal-entity submissions where the Arabic version is the legally authoritative one. The maintenance document is the ongoing source of truth: every quarter the Citation Register is re-verified, the verified date is updated, and any drift is reflected in the next patch release. The aim is for the overlay to age well.

## How to Use

For users on the existing ArcKit Claude Code plugin, the v4.10 update arrives through the marketplace. Run `claude plugin update` and the twelve new commands appear in `/help` without a community prefix; they are part of the official baseline. The Gemini CLI extension users get the same through `gemini extensions update arckit`. Codex, OpenCode, Copilot, and Paperclip users get the commands through their respective extension repositories or through `arckit init`.

Set `governance_framework: UAE Federal` and `classification_scheme: UAE Smart Data` in plugin userConfig before running any of the twelve commands. The conditional rendering does the rest.

The full release notes are at [github.com/tractorjuice/arc-kit/releases/tag/v4.10.0](https://github.com/tractorjuice/arc-kit/releases/tag/v4.10.0). The README's [UAE Federal Overlay section](https://github.com/tractorjuice/arc-kit/blob/main/README.md#uae-federal-overlay-official-baseline) lists every command with a one-line summary. The full guide is at [`docs/guides/uae-overlay.md`](https://github.com/tractorjuice/arc-kit/blob/main/docs/guides/uae-overlay.md), and the maintenance document at [`docs/guides/uae-overlay-maintenance.md`](https://github.com/tractorjuice/arc-kit/blob/main/docs/guides/uae-overlay-maintenance.md).

For UAE-resident architects who would like to take the co-maintainer role: the recruiting brief is in the maintenance document. Open an issue tagged `uae-overlay` and `co-maintainer` with a short note on background.

The Cabinet decree gave federal entities twenty-four months. v4.10 closes one of the first chapters of that clock: the architecture artefact pipeline that takes a federal AI pathfinder from principles through to procurement is now an end-to-end sequence of twelve commands, anchored, official, and tested.
