# UAE Federal Overlay Maintenance Reference

> **Overlay Origin**: Official Baseline | **ArcKit Version**: [VERSION]

This document is the maintenance source of truth for the UAE Federal Overlay shipped in v4.10.0. It records every regulatory citation the 12 commands rely on, when each was last verified, what is not yet verified, and how the overlay is reviewed quarterly.

For the user-facing overview of the overlay, see [`uae-overlay.md`](./uae-overlay.md).

---

## Citation Register

Each row records a regulatory or policy instrument cited by one or more `uae-*` commands. "Verified date" is the date the maintainer last checked the cited text against the authoritative source. "Next review" is the scheduled re-check date under the quarterly cadence below.

| Regulation / Instrument | Authority | Primary URL | Verified | Next Review | Used By |
|---|---|---|---|---|---|
| Federal Decree-Law No. 45 of 2021 (Personal Data Protection Law) | UAE Data Office | u.ae/en/about-the-uae/digital-uae/data/data-protection-laws | 2026-10-18 | 2027-01-30 | uae-pdpl, uae-data-sharing |
| UAE Cabinet Decree (23 April 2026) — agentic AI mandate | UAE Cabinet | docs/sources/2026-04-23-uae-cabinet-decree.md (repo-mirrored) | 2026-04-30 | 2026-07-30 | uae-ai-charter, uae-ai-autonomy-tier, uae-priorities-alignment |
| UAE Smart Data Framework — Part 1: Smart Data Principles and Standards (v2.0, February 2019); Part 2: Smart Data Implementation Guide (v2.0, March 2019) | UAE Federal Government (published on u.ae) | u.ae/en/about-the-uae/digital-uae/data/data-operability | 2026-10-18 | 2027-01-30 | uae-classification, Document Control (UAE partial) |
| UAE National Cloud Security Policy v2 | UAE Cybersecurity Council | csc.gov.ae | 2026-04-30 | 2026-07-30 | uae-cloud-residency |
| UAE IAS (Information Assurance Standard) v2 | UAE Cybersecurity Council | csc.gov.ae | 2026-04-30 | 2026-07-30 | uae-ias |
| UAE Pass Service Provider integration guide | TDRA | docs.uaepass.ae | 2026-10-18 | 2027-01-30 | uae-uaepass |
| UAE Code for Government Services | Office of the Prime Minister | u.ae/en/about-the-uae/the-uae-government/government-of-future | 2026-04-30 | 2026-07-30 | uae-zero-bureaucracy |
| UAE Government Services Digital Records Policy | UAE Cabinet (approved 23 April 2026; administering body not named) | uaecabinet.ae (Cabinet meeting announcement, 23 April 2026) | 2026-10-18 | 2027-01-30 | uae-digital-records |
| UAE Government Services Data Sharing Policy | Cabinet Affairs | u.ae | 2026-04-30 | 2026-07-30 | uae-data-sharing |
| Federal Government Guide to Aligning Digital Government Projects with National Priorities | Office of the Prime Minister | u.ae | 2026-04-30 | 2026-07-30 | uae-priorities-alignment |
| UAE Charter for the Development and Use of AI | UAE AI Office | ai.gov.ae | 2026-04-30 | 2026-07-30 | uae-ai-charter |
| Guidance Note on the Consumer Protection and Responsible Adoption and Use of AI and ML by Licensed Financial Institutions in the U.A.E. (issued 11 February 2026) | Central Bank of the UAE | rulebook.centralbank.ae | 2026-10-18 | 2027-01-30 | uae-ai-autonomy-tier |
| Guidelines for Financial Institutions Adopting Enabling Technologies (issued 15 November 2021) | CBUAE, SCA, DFSA and ADGM FSRA (joint) | rulebook.centralbank.ae | 2026-10-18 | 2027-01-30 | uae-ai-autonomy-tier |
| Federal Decree-Law No. 11 of 2023 on Procurements in the Federal Government | Ministry of Finance | mof.gov.ae | 2026-04-30 | 2026-07-30 | uae-procurement |
| MoF Digital Procurement Platform | Ministry of Finance | mof.gov.ae | 2026-04-30 | 2026-07-30 | uae-procurement |

---

## Quarterly Review Cadence

The UAE regulatory landscape is moving quickly. The overlay is reviewed every quarter to catch:

- New Executive Regulations gazetted under the PDPL.
- Cabinet Resolutions that supersede or amend the four Cabinet instruments.
- Updates to the Cybersecurity Council standards (IAS, Cloud Security Policy).
- Procurement threshold changes under the MoF Decree-Law.
- Updates to the Charter for AI and any sector-specific AI guidance (Central Bank, etc.).

The review process is:

1. Walk every row of the Citation Register and re-fetch the primary URL.
2. Compare against the verified date. Flag any document with a different last-modified or version field.
3. For each flagged row, read the diff against the version cited in the overlay's templates and command prompts.
4. Open one issue per material change. Tag with `uae-overlay`, `regulatory-update`, and the affected command(s).
5. Roll the changes into the next ArcKit release (typically a patch or minor) with a changelog entry under `### UAE Overlay Updates`.
6. Bump the verified date and next-review date in the table above.

Cadence: 30 January, 30 April, 30 July, 30 October. Next scheduled review: **2026-07-30**.

---

## Formerly Not-Verified Items

Six citations shipped in v4.10 marked `[NEEDS VERIFICATION]`. Each was checked against its primary source on 18 October 2026 under issue #949, and the guides, commands and templates now state what the source says. Where the source does not settle a point, the wording says so rather than guessing.

### 1. PDPL Executive Regulations

Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data was issued on 20 September 2021, published in Official Gazette No. 712 (supplement) on 26 September 2021, and has been in force since 2 January 2022 (UAE Legislation portal entry for the Decree-Law; u.ae data protection laws page). Its Executive Regulations are a separate Cabinet instrument. The UAE Government portal's data protection page (updated 4 December 2025) names none, and secondary commentary disagrees on whether they have been issued. The status is therefore not asserted: `/arckit:uae-pdpl` records it in each artefact as checked against the UAE Legislation portal, with the date of the check, and bases the assessment on the Decree-Law text alone when no Executive Regulations are in force.

### 2. Smart Data classes

The UAE Smart Data Framework sets **four** classes: `Open`, `Confidential`, `Sensitive` and `Secret`. Source: *Part 1: Smart Data Principles and Standards*, v2.0 (February 2019), Data Classification Standard DC1, and *Part 2: Smart Data Implementation Guide*, v2.0 (March 2019), Guidance Note 5.1, which gives the criteria and examples for each class. Both are published at <https://u.ae/en/about-the-uae/digital-uae/data/data-operability>. In the framework, `Shared` and `Closed` are exchange modes, not classes, and there is no `Top Secret` class. The earlier five-rung ladder (`Open / Shared / Confidential / Secret / Top Secret`) is replaced in the UAE commands and templates, the UAE Document Control partial, the regime routing table in `RENDERING.md`, the CLAS quality checks, the `default_classification` and `classification_scheme` userConfig descriptions, and the `arckit migrate-classification` mapping (UK `TOP SECRET` now maps to `Secret`). Documents already labelled `Shared` or `Top Secret` are not blocked by any hook or check.

### 3. UAE Pass and eIDAS

The UAE PASS developer documentation (<https://docs.uaepass.ae/quick-start-guide-uae-pass-staging-environment/user-account-types>) defines three account types: SOP1 Basic (unverified), SOP2 Advanced (verified, advanced signature) and SOP3 Qualified (verified with biometrics, qualified signature). It publishes no mapping to the eIDAS levels of assurance; the only `eidas` strings in it are identifiers in the signing platform's URNs. The earlier working assumption (Verified ≈ Substantial, Basic ≈ Low) was ArcKit's, not TDRA's, and the guide now says so: any eIDAS equivalence is the architect's assumption, to be confirmed with TDRA before a cross-border identity acceptance design.

### 4. AWS `me-south-1`

`me-south-1` is AWS's Middle East (Bahrain) Region, so it is not UAE-resident and does not meet the overlay's UAE-residency rule for Confidential, Sensitive and Secret datasets. AWS's UAE Region is `me-central-1`, Middle East (UAE), open since August 2022 (AWS Availability Zones documentation; AWS News Blog). The text of the National Cloud Security Policy v2 could not be retrieved from csc.gov.ae on 18 October 2026, so whether it permits a non-UAE Region for Open data is left to the policy text, which `/arckit:uae-cloud-residency` cites.

### 5. Central Bank AI guidance

The Central Bank of the UAE issued the *Guidance Note on the Consumer Protection and Responsible Adoption and Use of Artificial Intelligence and Machine Learning by Licensed Financial Institutions in the U.A.E.* on 11 February 2026 (CBUAE Rulebook, Market Conduct & Consumer Protection). It applies to CBUAE-licensed financial institutions, including insurance providers, and is to be read with the UAE Charter for the Development and Use of AI and the *Guidelines for Financial Institutions Adopting Enabling Technologies*. Those Guidelines were issued on 15 November 2021 jointly by CBUAE, the Securities and Commodities Authority (SCA), the DFSA and the ADGM FSRA, and are in force. For a capital-markets entity supervised by SCA, the joint 2021 Guidelines are the instrument SCA co-issued; the 2026 Guidance Note is a CBUAE instrument.

### 6. Digital Records Policy owner

The UAE Cabinet approved the Government Services Digital Records Policy on 23 April 2026. The Cabinet's announcement and the Dubai Media Office release carry the same text: the policy sets a national framework for managing government services data, makes digital records the official source of core data, and adds a comprehensive records guide. Neither names the body that owns or administers the policy, and neither names the Ministry of Cabinet Affairs or the National Library and Archives; the policy text was not published with them. The earlier "Cabinet Affairs / National Archives" attribution is withdrawn. `/arckit:uae-digital-records` records the administering body only when the entity has it in writing, and otherwise lists it as an open item.

---

## Resolution Status

All six items were resolved under GitHub issue #949 on 18 October 2026:

- `[x]` PDPL Executive Regulations — status recorded per artefact with the date checked
- `[x]` Smart Data classes — four classes, from the framework itself
- `[x]` UAE Pass and eIDAS — no published mapping
- `[x]` AWS `me-south-1` — Bahrain, not UAE-resident
- `[x]` Central Bank AI guidance — CBUAE Guidance Note, 11 February 2026
- `[x]` Digital Records Policy owner — not named by the Cabinet

---

## Help Wanted: UAE Domain Co-Maintainer

The overlay is officially maintained by the ArcKit core maintainer. A UAE-resident co-maintainer with regulatory or federal architecture experience would substantially improve responsiveness.

The role:

- Auto-requested for review on PRs touching `plugins/arckit-uae/commands/uae-*.md`, `plugins/arckit-uae/templates/uae-*-template.md`, `plugins/arckit-uae/recipes/uae-*.yaml`, and `.arckit/templates/uae-*-template.md`.
- Owns the quarterly review for the Citation Register.
- Reviews the six formerly not-verified items above against local practice, especially the PDPL Executive Regulations status and the Digital Records Policy's administering body, which the public sources do not settle.
- Recommends additions when new federal instruments are gazetted.
- Not in the merge path; the repository owner remains the final approver.

Profile: enterprise architect, DPO, RSSI, or programme manager with hands-on UAE federal experience. Particularly useful are people who have run pathfinders on the Cabinet's agentic-AI programme, contributed to a federal entity's IAS implementation, or worked on UAE Pass integrations as a Service Provider.

To apply: open an issue tagged `uae-overlay` and `co-maintainer` on the [arc-kit](https://github.com/tractorjuice/arc-kit) repository, with a short note on background and proposed time commitment.

---

## v4.11 / v5.0 Backlog

Four overlay extensions are deliberately out of scope for v4.10 and tracked here for the next minor release window:

### Federal Mandate Doc-Types Category

The four Cabinet instruments (`ZBUR`, `DREC`, `DSHR`, `NPRA`) currently sit under the existing `Governance` doc-types category. A dedicated `Federal Mandate` category would improve discoverability and group these alongside any future Cabinet-derived artefacts. Requires a doc-types registry change and a manifest re-generation.

### `uae-translate` (Bilingual Arabic / English)

A future command that takes any ArcKit artefact and generates an Arabic-language version, plus a side-by-side bilingual version for ministerial submissions. Requires a translation backend, glossary management for federal terms (where Arabic precision matters), and cultural-review handoff. Complex enough to warrant a v5.0 commitment.

### Sector Overlays

Sector-specific overlays for federal entities operating in regulated verticals. Initial targets: ADHICS (Abu Dhabi healthcare), Dubai ISR (Dubai information security regulation), Central Bank financial services, SCA capital markets. These are good candidates for community contributions, similar to the EU/French/Austrian pattern.

### Sovereign-Vendor Evaluation

A `uae-vendor-sovereignty` command that scores vendors against the federal sovereign-cloud and ICV criteria, comparable in shape to `fr-secnumcloud` for France. Requires a vendor matrix (Core42, G42, Microsoft UAE, e&, du, Mubadala-portfolio, etc.) and an ICV scoring rubric.

---

**Generated by**: ArcKit overlay maintenance documentation
**ArcKit Version**: [VERSION]
**Last full review**: 2026-04-30
**Next scheduled review**: 2026-07-30
