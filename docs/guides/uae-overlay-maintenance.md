# UAE Federal Overlay Maintenance Reference

> **Overlay Origin**: Official Baseline | **ArcKit Version**: [VERSION]

This document is the maintenance source of truth for the UAE Federal Overlay shipped in v4.10.0. It records every regulatory citation the 12 commands rely on, when each was last verified, what is not yet verified, and how the overlay is reviewed quarterly.

For the user-facing overview of the overlay, see [`uae-overlay.md`](./uae-overlay.md).

---

## Citation Register

Each row records a regulatory or policy instrument cited by one or more `uae-*` commands. "Verified date" is the date the maintainer last checked the cited text against the authoritative source. "Next review" is the scheduled re-check date under the quarterly cadence below.

| Regulation / Instrument | Authority | Primary URL | Verified | Next Review | Used By |
|---|---|---|---|---|---|
| Federal Decree-Law No. 45 of 2021 (Personal Data Protection Law) | UAE Data Office | u.ae/en/about-the-uae/digital-uae/data/data-protection-laws | 2026-04-30 | 2026-07-30 | uae-pdpl, uae-data-sharing |
| UAE Cabinet Decree (23 April 2026) — agentic AI mandate | UAE Cabinet | docs/sources/2026-04-23-uae-cabinet-decree.md (repo-mirrored) | 2026-04-30 | 2026-07-30 | uae-ai-charter, uae-ai-autonomy-tier, uae-priorities-alignment |
| UAE Smart Data Framework | TDRA / UAE Data Office | u.ae/en/about-the-uae/digital-uae/data | 2026-04-30 | 2026-07-30 | uae-classification |
| UAE National Cloud Security Policy v2 | UAE Cybersecurity Council | csc.gov.ae | 2026-04-30 | 2026-07-30 | uae-cloud-residency |
| UAE IAS (Information Assurance Standard) v2 | UAE Cybersecurity Council | csc.gov.ae | 2026-04-30 | 2026-07-30 | uae-ias |
| UAE Pass Service Provider integration guide | TDRA | uaepass.ae | 2026-04-30 | 2026-07-30 | uae-uaepass |
| UAE Code for Government Services | Office of the Prime Minister | u.ae/en/about-the-uae/the-uae-government/government-of-future | 2026-04-30 | 2026-07-30 | uae-zero-bureaucracy |
| UAE Government Services Digital Records Policy | Cabinet Affairs / National Archives | u.ae | 2026-04-30 | 2026-07-30 | uae-digital-records |
| UAE Government Services Data Sharing Policy | Cabinet Affairs | u.ae | 2026-04-30 | 2026-07-30 | uae-data-sharing |
| Federal Government Guide to Aligning Digital Government Projects with National Priorities | Office of the Prime Minister | u.ae | 2026-04-30 | 2026-07-30 | uae-priorities-alignment |
| UAE Charter for the Development and Use of AI | UAE AI Office | ai.gov.ae | 2026-04-30 | 2026-07-30 | uae-ai-charter |
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

## Known Limitations / Not-Verified Items

Six citations in the overlay are marked `[NEEDS VERIFICATION]` in the affected commands' prompts. They render in generated artefacts as inline notes so the architect can see at-glance where to apply local expertise.

### 1. PDPL Executive Regulation status

The PDPL (Federal Decree-Law No. 45 of 2021) was issued in November 2021. Its Executive Regulation, which contains the operative rules on lawful basis tests, DPIA thresholds, and cross-border transfer instruments, was not in force at the time of writing. The overlay applies the conservative reading consistent with the published Decree-Law and the UAE Data Office guidance, but anything that depends on the Executive Regulation should be verified against the gazette.

Tracking: GitHub issue (to be opened post-merge under the v4.10 tracking issue).

### 2. Smart Data Classifications exact level names

The UAE Smart Data Framework references five classification levels. The overlay uses `Open / Shared / Confidential / Secret / Top Secret` based on the most recent published guidance. Federal entities have used slight name variations historically, and we have not yet seen the canonical level names in a single authoritative source. The mapping is conservative; the names should be verified against the entity's local Data Office guidance before publication.

Tracking: GitHub issue (to be opened post-merge).

### 3. UAE Pass Loa-to-eIDAS mapping

UAE Pass publishes Basic and Verified profiles. There is no formal mapping between these profiles and the eIDAS Levels of Assurance (Low / Substantial / High). The overlay's `uae-uaepass` command applies a working assumption (Verified ~= Substantial; Basic ~= Low) that aligns with how some federal entities have treated cross-recognition. This should be checked with TDRA before any cross-border identity acceptance design.

Tracking: GitHub issue (to be opened post-merge).

### 4. AWS me-south-1 acceptability

AWS operates the `me-south-1` region in Bahrain. Several UAE federal use-cases have run on it historically. The current Cloud Security Policy v2 may or may not accept it for `Confidential` and above; the overlay's `uae-cloud-residency` command lists it as a borderline option pending Cybersecurity Council confirmation. UAE-resident options (Microsoft UAE North/Central, Core42 / G42 sovereign, e& Sovereign Launchpad on AWS) are recommended in preference until the position is verified.

Tracking: GitHub issue (to be opened post-merge).

### 5. UAE Central Bank AI guidance

The Central Bank of the UAE has issued AI-related guidance for licensed financial entities. The overlay's `uae-ai-autonomy-tier` Tier 3 (regulated/financial) refers to it generically. The exact citation, and the boundary between Central Bank guidance and Securities and Commodities Authority (SCA) guidance for capital-markets entities, is not yet pinned down.

Tracking: GitHub issue (to be opened post-merge).

### 6. Cabinet Affairs vs National Archives ownership of the Digital Records Policy

The UAE Government Services Digital Records Policy is owned and published under the federal Office of the Prime Minister. The day-to-day stewardship has historically sat with both Cabinet Affairs and the National Archives (different aspects: governance vs records-management technical detail). The overlay names "Cabinet Affairs / National Archives" as joint authority. A clearer single owner would help reviewers know whose interpretation to defer to in edge cases.

Tracking: GitHub issue (to be opened post-merge).

---

## Open GitHub Issues

A tracking issue will be opened for each of the six gaps under the v4.10 milestone. They will be linked here once filed:

- `[ ]` PDPL Executive Regulation status
- `[ ]` Smart Data Classifications exact level names
- `[ ]` UAE Pass LoA-to-eIDAS mapping
- `[ ]` AWS me-south-1 acceptability
- `[ ]` UAE Central Bank AI guidance
- `[ ]` Cabinet Affairs vs National Archives ownership

---

## Help Wanted: UAE Domain Co-Maintainer

The overlay is officially maintained by the ArcKit core maintainer. A UAE-resident co-maintainer with regulatory or federal architecture experience would substantially improve responsiveness.

The role:

- Auto-requested for review on PRs touching `arckit-claude/commands/uae-*.md`, `arckit-claude/templates/uae-*-template.md`, and `.arckit/templates/uae-*-template.md`.
- Owns the quarterly review for the Citation Register.
- Confirms or rejects the six not-verified items above.
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
