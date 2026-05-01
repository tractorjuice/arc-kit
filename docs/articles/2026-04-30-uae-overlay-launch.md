# ArcKit v4.10: 12 UAE Federal Commands, Community Overlay

ArcKit v4.10, shipped today, adds twelve commands covering the UAE federal regulatory and digital-government stack. The trigger was the Cabinet decree of 23 April 2026 mandating that 50% of federal services run on agentic AI by April 2028. The decree referenced an existing constellation of federal instruments (the Personal Data Protection Law, the Information Assurance Standard, the National Cloud Security Policy, the Code for Government Services, the Charter for AI, the Federal Procurement Decree-Law) and asked architects to deliver against all of them on a 24-month clock. ArcKit's job, as it has been for the UK, French, and Austrian overlays, is to make that delivery less of a slide deck and more of an artefact pipeline.

The twelve commands ship as a community-contributed overlay, sitting alongside the existing 21 EU, French, and Austrian community commands. The officially-maintained baseline stays at 68; community-contributed overlays grow from 21 to 33; total commands available across all tiers: 101. The original v4.10 plan called for an official-tier release, but with no UAE domain co-maintainer in place yet, the community marker is the responsible position. Recruiting that co-maintainer is the v4.11 priority; if and when one joins, the overlay becomes a candidate for official-tier promotion.

## What's in the Release

The twelve commands group into five categories. None of them are speculative; each is anchored on a published federal instrument.

The four federal data and security commands cover the base layer. `uae-classification` produces a UAE Smart Data Classification Register, mapping every dataset in the project to one of `Open`, `Shared`, `Confidential`, `Secret`, or `Top Secret`, with handling rules and a declassification schedule. `uae-pdpl` runs Federal Decree-Law No. 45 of 2021 and produces a DPIA, a lawful-basis register, the data-subject-rights procedure, and the cross-border transfer log. `uae-ias` builds a Statement of Applicability against the Information Assurance Standard v2's 188 controls (60 management M1 to M6, plus 128 technical T1 to T9), priority-tiered P1 to P4 against the entity's CII designation. `uae-cloud-residency` reads the per-classification residency rules from the National Cloud Security Policy v2, names the approved Cloud Service Provider options (Core42 and G42 sovereign offerings, Microsoft UAE North and Central, TDRA FedNet, the e& Sovereign Launchpad on AWS), and captures the shared-responsibility matrix and the exit/portability plan.

Federal identity is one command. `uae-uaepass` produces the UAE Pass integration design, covering the OIDC/OAuth flow, the claim mapping, the Basic-versus-Verified profile selection, the Service Provider onboarding pack, and the e-signature audit trail. The decision between Basic and Verified profiles is captured as an architecturally significant decision and chained to an ADR.

The four Cabinet instruments are the operational rules a federal entity has to align to whether or not the project itself is data, identity, AI, or procurement-shaped. `uae-zero-bureaucracy` reviews the service catalogue under the Code for Government Services and the Zero Bureaucracy programme, capturing service catalogue mapping, bureaucracy-elimination baseline, and customer-experience KPIs. `uae-digital-records` produces the Digital Records Plan (the source-of-truth register per service, the retention schedule, and the records-as-official-source designation) under the Government Services Digital Records Policy. `uae-data-sharing` produces a Data Sharing Agreement under the Government Services Data Sharing Policy ("collect once, use securely") with PDPL lawful basis per share. `uae-priorities-alignment` produces a National Priorities Alignment Statement under the Federal Government Guide, with reuse-versus-build justification, capability-reuse register (UAE Pass, FedNet, etc.), and explicit alignment to NIS 2031, AI 2031, the Digital Economy Strategy, and We the UAE 2031.

AI governance is two commands. `uae-ai-charter` runs the project's AI system against the twelve principles of the UAE Charter for the Development and Use of AI: human-machine ties, safety, bias mitigation, data privacy, transparency, human oversight, governance and accountability, technological excellence, human commitment, peaceful coexistence, inclusive access, and lawful compliance. `uae-ai-autonomy-tier` is an internal ArcKit synthesis (there is no single regulatory anchor for it) producing a three-tier autonomy posture: Tier 1 internal-productivity, Tier 2 investor-facing-with-approval, Tier 3 regulated/financial. The artefact captures per-tier guard-rails, approval gates, audit obligations, and the criteria for promoting a use-case from one tier to the next.

Procurement is one command. `uae-procurement` produces the federal procurement strategy under Federal Decree-Law No. 11 of 2023, with ITT/RFP packs against the Ministry of Finance Digital Procurement Platform templates, an In-Country Value plan, the evaluation report structure, and the contract register.

The handoffs declared in each command's frontmatter render as a `## Suggested Next Steps` section in non-Claude variants and as marketplace-driven follow-ups in Claude Code, so the canonical chain is not an external diagram but a property of the artefacts themselves.

## Why Community-Contributed

The first cut of v4.10 shipped as official-baseline. Within a few hours of release the maintainer reclassified the overlay to community-contributed and tagged a v4.10.1 corrective release. The reasoning is straightforward and worth being explicit about. Official-tier in ArcKit carries a citation-accuracy SLA: the maintainer commits to verifying citations on a quarterly cadence, the regression sweep covers 47 reference repositories, and the artefacts are held to a standard that an architect can hand to counsel without a paragraph of caveats. That SLA needs more than one pair of eyes on a fast-moving regulatory corpus. The EU and French overlays carry it because [@thomas-jardinet](https://github.com/thomas-jardinet) is the domain co-maintainer; the Austrian overlays carry it because [@gtonic](https://github.com/gtonic) is the seed contributor with the path under co-ownership.

The UAE overlay does not have that co-maintainer yet. The repository owner shipped the twelve commands solo, anchored on the published federal instruments, with six items flagged `[NEEDS VERIFICATION]` for the Executive Regulations and authority confirmations that are still pending. That is genuinely good work, but solo-maintaining an official-tier overlay against PDPL Executive Regulations, evolving Cabinet instruments, the National Cloud Security Policy v2 footnotes, the UAE Charter for AI, and the In-Country Value scoring framework is not a posture that ages well. The cadence of regulatory change in the federal corpus is not glacial; the autonomy decree itself is six days old. A solo maintainer cannot honour the official-tier SLA on text that moves at that speed without burning out or letting accuracy slip.

The community marker is the honest reading frame. Output from the twelve `uae-*` commands should be reviewed by qualified UAE federal compliance counsel before reliance, citations may lag the current text, and the `[COMMUNITY]` prefix in `/help` makes that visible to every architect who runs the command. Nothing else about the overlay changes: the canonical chain still holds, the Smart Data classification ladder still renders through the conditional Document Control header, the regression sweep still passes, and the twelve commands are still installable through the marketplace today. What changes is the contract the maintainer can credibly stand behind.

Recruiting a UAE domain co-maintainer is now the explicit v4.11 priority. The maintenance document carries the recruiting brief, and the CODEOWNERS file flags the path as recruiting. Once a co-maintainer with the regulatory background and the time to share the citation-review load joins, the overlay becomes a candidate for official-tier promotion in a future release. Until then the community marker stays.

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

For users on the existing ArcKit Claude Code plugin, the v4.10.1 update arrives through the marketplace. Run `claude plugin update` and the twelve new commands appear in `/help` with the `[COMMUNITY]` prefix and a warning banner before each prompt body. The Gemini CLI extension users get the same through `gemini extensions update arckit`. Codex, OpenCode, Copilot, and Paperclip users get the commands through their respective extension repositories or through `arckit init`.

Set `governance_framework: UAE Federal` and `classification_scheme: UAE Smart Data` in plugin userConfig before running any of the twelve commands. The conditional rendering does the rest.

The full release notes are at [github.com/tractorjuice/arc-kit/releases/tag/v4.10.1](https://github.com/tractorjuice/arc-kit/releases/tag/v4.10.1). The README's [UAE Federal Overlay section](https://github.com/tractorjuice/arc-kit/blob/main/README.md#uae-federal-overlay-community-contributed) lists every command with a one-line summary. The full guide is at [`docs/guides/uae-overlay.md`](https://github.com/tractorjuice/arc-kit/blob/main/docs/guides/uae-overlay.md), and the maintenance document at [`docs/guides/uae-overlay-maintenance.md`](https://github.com/tractorjuice/arc-kit/blob/main/docs/guides/uae-overlay-maintenance.md).

For UAE-resident architects who would like to take the co-maintainer role: the recruiting brief is in the maintenance document. Open an issue tagged `uae-overlay` and `co-maintainer` with a short note on background.

The Cabinet decree gave federal entities twenty-four months. v4.10.1 closes one of the first chapters of that clock: the architecture artefact pipeline that takes a federal AI pathfinder from principles through to procurement is now an end-to-end sequence of twelve commands, anchored, tested, and shipping today as a community-contributed overlay while the recruitment of a UAE domain co-maintainer runs in parallel.
