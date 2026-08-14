# Changelog

All notable changes to ArcKit will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- **Five commands wrote a governed `ARC-*` artefact with no Document Control block and no Revision History** (#792). Each built its document from a skeleton inlined in the command body rather than from a template, against the Template-Driven Generation rule in `CLAUDE.md`. All five now read their template and resolve the `<!-- DOC-CONTROL-HEADER -->` marker.

  Three had a template that named its own command in its header and was never read — `/arckit:backlog` (`BKLG`), `/arckit:gcloud-clarify` (`GCLC`) and `/arckit:gcloud-search` (`GCLD`). Two had **no template at all**: `arckit-uk-gcloud`'s `/arckit:gcloud-competitors` (`GCMP`) and `/arckit:review` (`GCRV`), whose command bodies said *"there is no separate template for this doc-type; structure the report inline"*. Both now ship one.

  This was **fully-wired coverage aimed at impossible documents**, not a coverage gap. All five codes already had a `### <CODE>` section in `references/quality-checklist.md`, and all five commands instructed the model to verify the Common Checks — of which 1 (*Document Control complete: all 14 fields*), 4 (*Classification set*) and 6 (*Revision History present*) cannot be satisfied by a document with no Document Control block. Two commands went further and carried a **CRITICAL - Auto-Populate Document Control Fields** block for a header they never emitted.

  `GCMP` and `GCRV` are registered `regime: 'UK'` and listed in `RENDERING.md`'s regime index, so the index had been claiming routing coverage for two doc-types whose artefacts structurally could not hold a Classification field.

  Citation traceability was broken in the same way for the three core commands: `## External References` was in all three templates and none of the three skeletons, while `/arckit:backlog` instructed the model to *"populate the 'External References' section in the template"* — a section its own output never contained.

- **`Review Date` corrected to `Next Review Date` in 33 commands and agents.** The Document Control Standard has no `Review Date` field; the calculated-fields instruction had been naming one for the whole 14-field block, which is the same 13-vs-14 drift the six worked examples carried before #791.

### Added

- **Two new `arckit-uk-gcloud` templates**: `gcloud-competitors-template.md` (`GCMP`) and `review-template.md` (`GCRV`), both with the marker, Revision History and External References. `arckit-uk-gcloud` is not in `PLUGIN_SOURCES`, so neither mirrors into `.arckit/templates/`.

- **A fourth check in `scripts/check-doc-control-resolution.py`**: a command declaring a `doc-type:` must reference a template file. The first three checks walk *templates* and ask who reads them, so a command with no template was invisible to them — which is why `GCMP` and `GCRV` needed a separate sweep rather than surfacing in the #760 pass. `doc-type: none` commands are out of scope. Both exemption lists (`NO_READER_KNOWN`, `NO_TEMPLATE_KNOWN`) are now empty, and a test asserts they stay that way.

- **`Unmet Must-Have Requirements`** in `gcloud-requirements-template.md`, plus the G-Cloud framework notes ported from the old inline skeleton. A per-service gap belongs in that service's block; a requirement *nothing* on the shortlist meets changes the procurement decision rather than the ranking, so it now has its own place and an explicit "write None rather than omitting" instruction.

### Fixed

- **`<!-- DOC-CONTROL-HEADER -->` templates now have a command that actually resolves them** (#760). `templates/_partials/RENDERING.md` states the rule normatively — *the command that reads the template MUST resolve the marker* — and nothing enforced it. **91 template/command pairs did not**, so those artefacts rendered a literal HTML comment and no Document Control block at all, which is strictly worse than the short hand-maintained table the marker replaced.

  The sharpest case was **France**. `FR` hard-routes and `document-control-fr.md` shipped in #752, but **0 of 12 `fr-*` commands read `RENDERING.md`**, so the French ladder was unreachable from the commands it was added for and `/arckit:fr-anssi` rendered a UK ladder for a hard-routed French artefact. **Austria** was 1 of 4, the three older commands predating `at-barrierefreiheit` (#773). Both regimes are now 100%.

  Resolution was added to 74 commands and 6 agents in total. The **writer subagents** matter most: `arckit-tenders-writer`, `arckit-competitors-writer`, `arckit-datascout-writer`, `arckit-gov-reuse-writer` and `arckit-grants-writer` are the tier that holds the `Write` call, and **0 of 20 agents referenced `RENDERING.md`** before this. Their instruction covers spawned per-item profiles and tech-notes too, not just the main artefact.

- **The marker comment contradicted the file it pointed at, on 121 of 168 templates.** It restated the routing rule as *"resolved to `document-control-uk.md` or `document-control-uae.md` based on plugin userConfig"* — true before #744 made routing regime-first, and naming two partials when there are now seven. `apply_doc_control_marker.py`'s `MARKER` constant was never updated, so the conversion in #761 wrote the stale wording into all 16 templates it converted. The comment now defers instead of paraphrasing (`<!-- Resolved at command-execution time per _partials/RENDERING.md. -->`), which is what stops it drifting again, and the script normalises existing markers rather than only converting new ones.

- **The pre-#744 classification fallback was still live in 47 commands and 9 agents.** They instructed the model to substitute `[CLASSIFICATION]` from `${user_config.default_classification}` — the operator-driven path #744 replaced with regime routing — against a placeholder that survives in **exactly 1 of 168 templates** (the MARP footer in `presentation-template.md`). All 56 now defer to the resolved header. This was also the stated reason #761 deferred the guard, on the understanding that core resolved the marker by a second legitimate mechanism; it did not.

- **Six core commands shipped a worked example that contradicted the partial.** `adr`, `requirements`, `secure`, `sow`, `tcop` and `traceability` each carried an "Example Fully Populated Document Control Section" — a **13-field** table using `Review Date` instead of `Next Review Date` and omitting `Review Cycle`. Being a concrete example, it outranked the 14-field partial for the model copying it. Replaced with the marker.

- **`/arckit:template-builder` was a factory for the defect.** Every template it generated carried a hand-written 14-row Document Control table with a hardcoded UK ladder, so each user-built template was born outside regime routing. It now emits the marker.

### Added

- **`scripts/check-doc-control-resolution.py`** — the guard #760 asked for, wired into `lint-markdown.yml` beside `check-quality-checklist-refs.py`. It checks three things: every marker template has a reader (command *or* writer subagent) that references `_partials/RENDERING.md`; the marker comment is the current one-line form; and the converse, that a template hand-maintaining a Document Control block without the marker is declared deliberate with a reason.

  `arckit-uk-nhs`'s six DCB0129/DCB0160 safety-case templates are recorded in `INLINE_BY_DESIGN`: they follow the Marcus Baw `SAFETY.md` spec convention, whose Document ID is the literal `SAFETY.md` with no `ARC-` prefix, and converting them would break that convention on purpose. `apply_doc_control_marker.py` carries the same exemption, having converted all six by accident during this work. `uk-nhs-dtac-template.md` and `uk-mdr-classification-template.md` are explicitly **not** exempt.

  Three templates are recorded in `NO_READER_KNOWN` rather than fixed, and tracked on #792: `backlog-template.md`, `gcloud-clarify-template.md` and `gcloud-requirements-template.md` each name their owning command in their own header, and that command writes its artefact from a skeleton inlined in the command body instead — with no `## Document Control` and no `## Revision History` at all, which makes Common Checks 1, 4 and 6 unsatisfiable for `BKLG`, `GCLC` and `GCLD`. Against the Template-Driven Generation rule in `CLAUDE.md`, and a behaviour change rather than a wording one. The guard walks templates and asks who reads them, so a command writing a governed artefact with **no** template is invisible to it — `arckit-uk-gcloud`'s `gcloud-competitors` (`GCMP`) and `review` (`GCRV`) have the same defect and needed a separate sweep to find. Both noted on #792.

  15 tests in `tests/plugin/test_doc_control_resolution.py`, weighted toward the negative cases: the guard fails on an unresolved marker, an unread template, a stale comment, an undeclared inline table, a stale exemption, and on matching nothing at all.

## [6.9.0] — 2026-08-13

### Added

- **`/arckit:at-barrierefreiheit` — Austrian digital accessibility, across both of Austria's transposition tracks** (#710, requested by @gtonic). The Austrian overlay covered data protection, NIS2 and procurement but had no accessibility command, which became a live gap when the **BaFG** (*Bundesgesetz über Barrierefreiheitsanforderungen für Produkte und Dienstleistungen*, BGBl. I Nr. 76/2023) became applicable on **28 June 2025** as Austria's transposition of the European Accessibility Act.

  Austria transposed the EU accessibility regime along two separate tracks, and which one applies is a question about the **entity**, not the technology. The **BaFG** binds economic actors — manufacturers, importers, distributors, service providers. The **WZG** (*Web-Zugänglichkeits-Gesetz*, BGBl. I Nr. 59/2019, transposing Directive (EU) 2016/2102) binds federal public bodies for their websites and apps. A federal body running an in-scope e-commerce or banking service is subject to both. The command therefore leads with an applicability determination that decides each track independently and supports "both", then writes one artefact in which non-applicable sections are marked N/A with the reason rather than omitted.

  A single neutrally-named doc-type, **`ATBFR`** — Austrian Accessibility Assessment (BaFG / WZG) — carries both tracks. Naming it `BAFG` would have filed a public body's WZG assessment under a private-sector act's name; splitting it into `BAFG` and `WZG` would have needed the first `doc-type: [A, B]` list in the tree and duplicated the EN 301 549 mapping, which is the substantive half of the document and identical across both.

  Four traps are handled in the command rather than left to the model. The **microenterprise exemption covers services only** — a nine-person importer of self-service terminals is fully in scope, and this is the most common misreading of the act. **An exemption without evidence is a gap**, because the Sozialministeriumservice can require the headcount and financial figures on request. **The federal WZG does not reach Land or municipal bodies**, which are routed to their Landesgesetz. And **the WZG has no fine regime**, so the BaFG's EUR 80,000 ceiling must not be carried into a public-sector assessment; the two exposures are stated separately, SMS against FFG.

  Conformance is assessed against **EN 301 549 v3.2.1, giving WCAG 2.1 AA**, matching the position `/arckit:at-bvergg` now takes after #769. WCAG 2.2 AA arrives with v4.1.1, expected to be OJ-cited around October 2026, and appears only as an explicit forward-looking decision.

  Ships with the template (plugin plus CLI mirror), `docs/guides/at-barrierefreiheit.md`, and an `ATBFR` quality-checklist section. BaFG paragraph references (§ 3 Z 19, § 6, § 21, § 36) are drawn from secondary sources and carry `[NEEDS VERIFICATION]` markers: RIS returned 503 on every attempt across three weeks of authoring.

- **The Document Control classification ladder now follows the artefact's jurisdiction, not the person running the command.** A Canadian Privacy Impact Assessment carried the UK `PUBLIC / OFFICIAL / OFFICIAL-SENSITIVE / SECRET` ladder unless the operator happened to have configured a matching `classification_scheme`, which is the wrong dependency: the ladder is a property of the artefact and the regime it is written under, not of the workstation it was generated on. Each doc-type's existing `regime:` tag now selects the partial, via a new `REGIME_PARTIALS` map in `config/doc-types.mjs`, and regime beats user config — a `PIA` renders the Canadian ladder whoever runs it.

  Three new partials ship with it: `document-control-ca.md` (UNCLASSIFIED / Protected A–C / CONFIDENTIAL / SECRET / TOP SECRET), `document-control-au.md` (UNOFFICIAL / OFFICIAL / OFFICIAL:Sensitive / PROTECTED / SECRET) and `document-control-nl.md`, which carries the VIRBI 2025 ladder ahead of the `NL` regime itself so that #739 is a registration change rather than a wording exercise. The Canadian and Australian overlays previously reached the right ladder only through a per-command instruction repeated in every `ca-*` and `au-*` command body; that inline override remains and now agrees with the routing rather than substituting for it.

  **`UK`, `MOD`, `EU` and `US` deliberately do not hard-route.** They are registered in an explicit `UK_FALLBACK_BY_DESIGN` set and fall through to the existing user-config chain exactly as before, so the 41 doc-types tagged with those regimes render identically to previous releases and a UAE- or Austrian-configured entity running `/arckit:dpia` keeps its own ladder. For `US` this is a deferral rather than a decision: it has no authoritative ladder wording anywhere in this repository, and a wrong ladder inside a Document Control header reads more authoritative than a fallback does. It becomes a two-line change once a domain maintainer supplies the wording — see `FR`'s `document-control-fr.md` below for how that resolves in practice. `MOD` and `EU` are settled — MOD artefacts use the UK Government ladder, and the EU commands assess EU instruments from a member state's perspective, which EUCI does not govern.

  **`FR` hard-routes as of this release.** `document-control-fr.md` (Non protégé / Diffusion Restreinte / Secret / Très Secret — a single linear row, consistent with `AT`/`UAE`/`UK`; Diffusion Restreinte is a protection mention under II 901/SGDSN/ANSSI, not a classification rung under IGI 1300) now ships and `FR` is registered in `REGIME_PARTIALS`, so the 12 `FR`-regime doc-types render the French ladder regardless of the operator's `classification_scheme`. The 26 inline classification instructions repeated across 10 `fr-*` command bodies (`fr-anssi`, `fr-anssi-carto`, `fr-code-reuse`, `fr-dinum`, `fr-ebios`, `fr-irn`, `fr-marche-public`, `fr-pssi`, `fr-rgpd`, `fr-secnumcloud`) are remapped to match (`OFFICIAL-SENSITIVE` → `Diffusion Restreinte`, `PUBLIC`/`OFFICIAL` → `Non protégé`), following the same in-agreement-with-routing pattern as the `CA`/`AU` overrides above.

  `scripts/tests/test-regime-registration.mjs` enforces the routing rather than merely observing it: a regime outside the fallback set must name the partial derived from its own code, and a regime inside it must name the UK partial. Pointing `CA` at the Australian partial passed CI before this; it now fails with the regime named. The guard also holds `templates/_partials/RENDERING.md` to the registry, because that file — not `config/doc-types.mjs` — is what resolves the marker at runtime. Community overlay plugins ship `templates/_partials/` but no `config/` directory, so `RENDERING.md` is now self-contained: it carries the regime index and the routing table inline, and the resolution can be completed without opening another file. The CLI's `.arckit/templates/_partials/` mirror is compared by content in `tests/plugin/test_template_consistency.py`, after a basename-only comparison let it sit a whole feature behind.

  Both of those tables are asserted cell by cell, addressed by column name rather than by position: the partial each regime names, its classification ladder against the partial's own Classification row, its label against `REGIME_LABELS`, and its routing against `UK_FALLBACK_BY_DESIGN` in **both** tables, so the two cannot contradict each other. The ladder comparison is exact, with the one legitimate abbreviation registered in the guard (CA's `Protected A–C` stands for three spelled-out rungs); comparing only the first and last rung accepted a row that kept its ends while describing an entirely different scheme in between, and the middle rungs are the jurisdiction-distinguishing part. A missing column, a ragged row, a duplicated regime, or a regime the registry does not know is now reported by name instead of crashing the run or passing silently. `Lint Markdown` triggers on the scripts it executes, so neither a guard's own test nor `sync-shared-assets.py` can be edited without running the job that owns it.

- **Netherlands Public Sector Overlay (`arckit-nl`) — four commands, community-contributed.** The Netherlands had no overlay, and its central-government cloud rules changed substantially in 2025–2026 in ways that make generic EU guidance insufficient: the **Herziening rijksbreed cloudbeleid 2026** (Ministerie van Economische Zaken en Klimaat, 3 July 2026) replaced the 2022 policy, **VIRBI 2025** (BWBR0051482) came into force on 9 September 2025 and repealed VIRBI 2013 the same day, and the **Cyberbeveiligingswet** and **Wet weerbaarheid kritieke entiteiten** — the Dutch NIS2 and CER transpositions — came into force on 15 August 2026.

  `/arckit:nl-cloud` (**RBCLOUD**) assesses a cloud deployment against the Rijksbreed cloudbeleid clause by clause, including the determination of *materieel publiek cloudgebruik*, the mandatory risk analysis, notification to CISO Rijk, and the eligibility rules that prohibit public cloud for staatsgeheim-classified information and for Te Beschermen Belangen levels 1–3, and that permit email and workplace services only where three cumulative conditions are met.

  `/arckit:nl-tbb` (**TBB**) determines a Te Beschermen Belangen category by scoring Beschikbaarheid, Integriteit and Vertrouwelijkheid against the five kernbelangen, taking the highest of the three. It then derives an **indicative** VIRBI 2025 rubricering — recorded as a `voorstel` awaiting the departmental rubriceringsautoriteit, never as a determined classification, and never overriding a marking the information already carries. The asymmetry is stated prominently: information at Stg. GEHEIM implies TBB 2, but a TBB 2 process does not mean the information it holds is Stg. GEHEIM. Since the category can be driven by an availability or integrity score rather than a confidentiality one, treating the derived value as a determination would silently over-classify.

  `/arckit:nl-bio` (**BIO2**) assesses conformance against the Baseline Informatiebeveiliging Overheid 2, established by the OBDO on 23 September 2025 and built on NEN-EN-ISO/IEC 27001:2023 and 27002:2022. `/arckit:nl-exit` (**NLEXIT**) produces the exit plan that clause 3.2 makes mandatory for material cloud use, covering both a planned exit and a disruptive interruption, with annual review.

  Two deliberate omissions, both places where inventing content would have been worse than leaving a gap. Unlike France's SecNumCloud there is **no published Dutch qualification list**, so no commercial provider is named as compliant, and the overlay says so where a reader would otherwise expect one. And where the source text was not to hand — the remaining aspects of the clause 3.1 risk analysis, and the individual BIO2 overheidsmaatregelen — the commands instruct the assessor to consult the current text rather than shipping a plausible-looking list.

  Registering the first **NL** regime also required the two-part change `CONTRIBUTING.md` describes (four codes in `config/doc-types.mjs`, plus `NL` in `REGIMES` and `REGIME_LABELS`), a row per code in the `/arckit:pages` known-artifact-types table, and entries in `.claude-plugin/marketplace.json` and the `converter.py` plugin list so the overlay reaches the non-Claude targets. All seven repository check scripts pass.

- **`/arckit:eu-cloud-sovereignty` (`EUCSF`) — EU Cloud Sovereignty Framework assessment.** The Commission published the framework (v1.2.1, October 2025) to supplement security assurance with sovereignty-specific safeguards in cloud procurement, and it is beginning to be adopted as a national yardstick rather than only a Commission procurement tool — so an overlay command seemed more useful than leaving each contracting authority to encode it themselves.

  The command assesses a cloud service against the eight Sovereignty Objectives (SOV-1 Strategic through SOV-8 Environmental Sustainability) using the framework's own weights — 15/10/10/15/20/15/10/5, summing to 100 — and records a Sovereignty Effectiveness Assurance Level per objective from SEAL-0 (no sovereignty) to SEAL-4 (full digital sovereignty). It computes the weighted Sovereignty Score the framework defines as an award criterion, and checks each objective against the minimum SEAL required.

  Two points the command is deliberately loud about, because both are easy to get wrong. **Minimum SEAL levels come from the tender specification, not from the framework** — the framework supplies the scale, the contracting authority supplies the floor. And **a supplier's self-declared SEAL is an unverified claim until the assessor records evidence**, so the template carries an evidence column per objective drawn from the framework's own contributing factors, which are observable things: who holds decisive authority over the service, which legal system governs the contract, whether the customer alone holds cryptographic access, where support staff sit and under whose jurisdiction, the provenance of hardware, firmware and software, and whether APIs and licences actually permit exit. The command records an assessment; it does not certify. No commercial provider is named as sovereign or as achieving any SEAL level, and the command says explicitly that no published EU list of assessed providers exists.

  Includes a member-state adoption section, with the Netherlands as the worked example: the Dutch *Notitie: Verkenning Overheidsbrede Soevereine Clouddiensten* (NDS Cloudprogramma, 11 June 2026) adopts the framework as its measure of sovereignty, publishes an official Dutch rendering of the SEAL levels, sets SEAL4 as the target for a government-wide sovereign cloud service, and — the part worth borrowing — applies SEAL on the **demand** side, so a workplace requiring SEAL3 requires a service achieving at least SEAL3.

### Fixed

- **The IGI 1300 citation in `fr-dr` was stale.** It read "Confidentiel Défense and above" as the boundary above Diffusion Restreinte, describing the pre-2021 three-tier scheme (Confidentiel/Secret/Très Secret Défense). The 2021 IGI 1300 reform collapsed that into two tiers (Secret / Très Secret), so the wording now reads "Secret or Très Secret" everywhere it appears: `plugins/arckit-fr/commands/fr-dr.md`, `plugins/arckit-fr/templates/fr-dr-template.md` and its `.arckit/templates/` CLI-package-data copy (overlay templates are dual-located and neither sync script compares that pair by content), `README.md`, and `docs/guides/fr-dr.md` (prose plus its DR-vs-classified table, now two rows instead of three).

- **A follow-up audit of the whole `arckit-fr` overlay** (triggered by the fix above, going beyond the review that scoped it) found nine more issues, verified live against ANSSI/CNIL/Légifrance rather than from memory:
  - `fr-algorithme-public` used `Classification: PUBLIC` — not on the FR ladder — in the same way the `fr-dr` fix corrected 10 other commands; the reviewer's file list hadn't included it. Now `Non protégé`.
  - `.arckit/templates/fr-anssi-carto-template.md` (CLI copy) was a second instance of the exact dual-location drift the reviewer's blocker 2 found in `fr-dr-template.md`, on an unrelated file: it still used `INT-01`/`INT-xx` IDs, which `/arckit:traceability` and `/arckit:health` misread as unmet Integration Requirements — the plugin source had already been fixed to `ECX-NN` with an explanatory note, but no sync script compares this pair by content, so the CLI copy never caught up.
  - 5 of 12 `fr-*` commands (`fr-irn`, `fr-rgpd`, `fr-secnumcloud`, `fr-marche-public`, `fr-dinum`) never invoked their own per-type quality-checklist section despite one existing for each — they checked only **Common Checks**. All 12 now gate on their per-type section (`check-quality-checklist-refs.py`'s `arckit-fr` count moves from 7 to 12).
  - `fr-marche-public`'s procurement thresholds were two biennial cycles stale (`€215,000` / `€5.38M`, last correct for 2022–2023) — updated to the 2026–2027 EU thresholds in force since 1 January 2026 (`€216,000` / `€5,404,000`), with a note flagging the next revision (1 January 2028).
  - `fr-pssi` cited a non-existent circular ("n°5926/SG") for the PSSIE; the actual founding text is **Circulaire du Premier Ministre n°5725/SG du 17 juillet 2014** (confirmed on Légifrance).
  - `fr-dinum` and `fr-marche-public` cited **6264/SG** for the State cloud doctrine — that number belongs to a different circular (the open-source policy one, correctly cited elsewhere in `fr-code-reuse`). The cloud doctrine circular is **6282/SG du 5 juillet 2021**.
  - `fr-ebios` said the EBIOS Risk Manager guide was "updated 2023" — ANSSI's update was published 26 March **2024**. The ANSSI cloud security recommendations cited in `fr-anssi` carried the same one-cycle-behind pattern ("2021") against a 8 July **2024** update.
  - `fr-anssi`, `fr-pssi`, and `fr-secnumcloud` presented OIV/OSE as the sole current regulatory category; France's NIS2 transposition is moving former OIV/OSE entities into Entités Essentielles / Entités Importantes (EE/EI). A note now flags the terminology shift in all three (the exact transposition date wasn't confirmed against a primary source, so the note asks for verification rather than asserting a date).
  - **11 dead or redirected URLs** across the overlay, all following the same pattern — ANSSI restructured `cyber.gouv.fr/publications/*` and several other paths at some point after these citations were written, and nothing in this repo checks external link liveness. Every citation was individually re-verified live (not assumed) and repointed to its current location.

- **`/arckit:nl-tbb` no longer derives a VIRBI 2025 rubricering from the TBB category — the systematiek runs the other way** (#781). The command mapped the determined TBB category to a rubricering and recorded it as an *indicatieve rubricering (voorstel)*. Reading the primary source settles that this direction is not available: *Gereedschap: Te Beschermen Belangen (TBB) systematiek*, [v1.0, 6 June 2026](https://www.digitaleoverheid.nl/wp-content/uploads/sites/8/2026/05/Gereedschap-TBB-systematiek-PDF.pdf), publishes the relation as Tabel B in §3.1 and then forecloses one half of it in the sentence immediately beneath:

  > Let wel, wanneer een te beschermen belang ingedeeld is in categorie TBB 2, hoeft dit niet te betekenen dat het proces of informatiesysteem gegevens verwerkt of bevat op het niveau van STG GEHEIM. […] Andersom geldt dit echter wel. Indien een proces of informatiesysteem gegevens verwerkt of bevat op het niveau van STG GEHEIM, dan is automatisch sprake van indeling in categorie TBB 2.

  Three things in the source point the same way. §2.1 lists *"het rubriceringsniveau van de informatie of van het informatiesysteem"* first among the criteria the categorisation must take into account — the rubricering is an **input**, not an output. §2.1 also notes *"(Voor het VIRBI kijken we slechts/vooral naar Vertrouwelijkheid.)"*, while the category is set by the **highest** of the three BIV scores. And the document never uses *voorstel*, *indicatief* or *advies* of a rubricering anywhere; it describes the categorisation as a *"hulpmiddel voor prioritering bij de toewijzing van middelen"*.

  The practical failure was real rather than cosmetic: a process scoring Hoog on **Beschikbaarheid** alone reached TBB 2 and was then stamped **Stg. GEHEIM**, a confidentiality marking produced by an availability score, flowing into the Document Control Classification row. Labelling it a *voorstel* changed the noun, not the arrow.

  Step 7 is now inverted. It records the rubricering the information **already carries**, and applies the one direction the systematiek authorises as a **floor** on the category — Stg. GEHEIM ⇒ at least TBB 2, and so on. The floor never lowers a category; where both bounds exist, both are recorded with the one that applied identified. Where the information carries no marking, none is inferred: the artefact states "None recorded" and leaves the rubricering unstated. Tabel B survives in the artefact as cited reference with the source's caveat attached, never as a lookup that yields a marking.

  The TBB scale runs backwards to its numbering, and the floor rule is stated in those terms so it cannot be resolved arithmetically. **TBB 1 is the most sensitive category and TBB 4 the least**, so the final category is the *more sensitive* of the two bounds, which is the **lower-numbered** one. Left as "the category is at least TBB 3", a numeric reading is satisfied by TBB 4 and the floor never applies: BIV scoring yielding TBB 4 against information marked Stg. CONFIDENTIEEL would stay at TBB 4 and miss the clause 5.2 public-cloud prohibition that TBB 1–3 triggers. Step 6 now anchors the ordering, Step 7 resolves the bounds by sensitivity with a worked example, and the per-type quality check enforces it. Only the `Stg. GEHEIM → TBB 2` row is quoted outright in §3.1; the other three extend the same authorised direction across Tabel B's pairings, which the command now says rather than implies.

  Step 8's one-way warning now quotes the systematiek verbatim rather than resting on our own reasoning, and the sign-off line names the **beveiligingsautoriteit / BVA** — the role §1.5 actually names, appointed by the SG under the [Besluit BVA-stelsel Rijksdienst 2021](https://wetten.overheid.nl/BWBR0044617), noting that *"de exacte rolverdeling kan per departement verschillen"*. The command previously said *rubriceringsautoriteit*, which the systematiek does not use.

  The TBB systematiek also gains a citable URL in Key References, where it previously carried *"(not linked — verify current text before citing)"* — which is why the question could not be settled from the overlay itself. Four-category ladder and highest-of-three rule are confirmed verbatim and unchanged.

- **23 templates had drifted between the plugin tree and the `.arckit/templates/` CLI mirror, because the test guarding the two trees compared filenames and not contents** (#784). `test_plugin_and_cli_templates_are_in_sync` built two sets of `os.path.basename(p)` and asserted the symmetric difference was empty, so a template present in both trees passed however far the copies had diverged. `test_plugin_and_cli_partials_are_in_sync` already used `filecmp.cmp`, and its docstring records the same bug being fixed one scope down for `_partials/RENDERING.md`; the fix was applied to the partials and not to the templates beside them.

  This reaches users rather than being tidy-up. `.arckit/templates/` ships as CLI package data and is scaffolded by `arckit init`, and commands resolve the project-root `.arckit/templates/<name>` **before** falling back to `${CLAUDE_PLUGIN_ROOT}/templates/`. In a CLI-scaffolded project the drifted copy is the one that renders and the plugin copy is never read.

  Sixteen of the 23 still carried the frozen, fully-expanded Document Control table that `<!-- DOC-CONTROL-HEADER -->` replaced. With no marker there is nothing for `_partials/RENDERING.md` to resolve, so the regime routing added in #744 never fired for those templates at all, across `arckit-togaf-adm` (9), `arckit-uk-finance` (4) and `arckit-agent-architecture` (3). They also still used `{{DOCUMENT_ID}}` mustache placeholders against the tree's `[PLACEHOLDER]` convention.

  The remaining seven were content staleness, and the sharpest was `fr-anssi-carto-template.md`: the CLI copy still numbered interconnection rows `INT-01`, which collides with the `INT-\d{1,3}` Integration Requirement pattern reserved in `hooks/hook-utils.mjs`, so every row surfaced as a missed requirement in `/arckit:traceability` and `/arckit:health` scans. The plugin copy had already renamed these to `ECX-NN`. The NHS DCB0129/DCB0160 copies were missing the Data (Use and Access) Act 2025 amendment to the Health and Social Care Act 2012 Part 9 citation, plus a re-review-triggers section and an applicable-standards register.

  `test_plugin_and_cli_templates_have_identical_content` now compares contents with `filecmp.cmp`, matching the partials test. All 23 copies are resynced from the plugin tree, which stays the source of truth. Note there is still no sync script for this mirror: `sync-shared-assets.py` writes into plugin directories only, so the copy remains manual and is now merely guarded.

- **Every scripted project-creation path in the overlay commands called `create-project.sh` in a form it rejects** (#775, #777). 41 files across eight plugins, in two spellings, neither of which can produce a project:

  ```text
  create-project.sh --json <project-name>   # 32 files → [ERROR] Unknown option: <project-name>
  create-project.sh --json                  # 9 files  → [ERROR] Project name is required in JSON mode
  ```

  The script takes its name as `--name "NAME"`; it has no positional argument. The positional spelling was the large majority — the correct `--name` form appeared in only five files repo-wide, both in `arckit-uk-finance` and `arckit-uk-gcloud` — so it was what each new overlay was copied from.

  **Five of the nameless callers were worse than a failed call: they used a create-only script as a lookup.** `wardley.value-chain`, `wardley.doctrine` and the three NHS commands instructed the model to "run `create-project.sh --json` to get the current project path", then read `project_id` and `project_path` out of the response. There is no response — the call exits 1 — and neither key exists under any invocation, since the script emits `project_number` and `project_dir`. All five now resolve the project from the **ArcKit Project Context** the `arckit-context.mjs` hook already injects, which is what the other 49 core commands do, and fall back to creating one only when none exists.

  **The two `gov-*` agents had a second trap underneath the first.** Both state they work without a project context, and `create-project.sh` refuses in precisely that case: it requires `ARC-000-PRIN-*.md` and exits 1 without it, whatever `--name` says. They now pass `--force`, and are told to create the directory directly when `projects/` does not exist at all, since the script cannot resolve a repo root without it. This is the trap `repo-audit.md:103` already documented for the same script; the two agents predate that note.

  Because these are prompts rather than scripts, the failure degraded rather than stopped: the model got a usage dump, improvised a directory, and the command appeared to work. What it skipped is everything `create-project.sh` does beyond `mkdir` — the `external/README.md`, the `000-global/policies` and `000-global/external` scaffolding, and the project README carrying the correct `ARC-{NNN}-*` filename list. #762 is the standing evidence that a wrong project README is not something people notice.

  `scripts/check-create-project-invocations.py` is new and wired into `lint-markdown.yml`. It parses invocations out of code spans and fenced blocks only, leaving prose mentions alone, and rejects a positional argument, a missing `--name`, or a flag the script does not define. Against the pre-fix tree it reports all 42 occurrences; nothing before it would have noticed a command citing a flag that does not exist.

- **`create_project_dir` wrote a whole project tree into an existing directory rather than refusing it** (#765). `create-project.sh` only ever creates, and the directory it builds is named `{freshly-allocated-number}-{slug}`, so a target that already exists means the numbering is wrong — not that the user picked a taken name. Bare `mkdir -p` in bash and `exist_ok=True` in Python both succeeded in that case, and the caller went on to write a README and a full set of `ARC-{NNN}-*` paths over the top of an existing project, exiting 0. That is why #762 was silent: the octal bug allocated a used number and nothing downstream objected.

  The overwrite is worse than the duplicate directory the original report described. #762 happened to collide on a number while differing on the slug, so it produced a second `010-` directory alongside the first. When the slug matches too, the `cat > README.md` at `create-project.sh:229` replaces the existing project's README in place, and the run still reports `"success": true`. Both copies of the helper now refuse before anything is written.

  A guard in `common.sh` alone would not have been enough. Under `set -euo pipefail` a bare failing call kills the script at line 126, long before the JSON block at line 385, so a `--json` caller received exit 1 with **zero bytes on stdout** — no error object, nothing to parse. Roughly 59 command files are instructed to run this with `--json` and read stdout. The call is now wrapped in `if !`, which suspends errexit deliberately, and emits `{"error": ..., "success": false}` matching the shape already used for a missing project name. The Python entrypoint does the same.

  Applied to all four copies — both `common.sh`, both `common.py` — plus both `create-project` entrypoints. `check-common-parity.py` would not have caught a bash-only fix: it compares the root copy against the plugin copy *within* a language and says so in its own docstring, so a change landing in bash and missed in Python passes CI green. `tests/plugin/test_project_dir_collision.py` covers the cross-language contract: the guard refuses an existing target in all four copies, pre-existing content survives, a fresh target is still created in full, and end-to-end the entrypoints refuse a colliding number and report it as JSON. The refusal path is unreachable through correct numbering by construction, so the end-to-end tests inject a numbering fault the way #762 produced one.

  The guard is deliberately not wired to `--force`, which means "skip the principles prerequisite check". A numbering fault is never something to force past. Side effect worth recording: two agents concurrently deriving the same next number now fail loudly instead of silently sharing a directory.

- **The secret scanner's OIDC exemption only fired when the permission line was the last content in the input, so in the file scanner it never fired at all** (#737, reported by @johnfelipe). v6.8.0 exempted a value that is exactly `read`, `write`, `none`, `true`, `false` or `null` from the five reference-guarded key-value rules, so that `id-token: write` would stop being read as credential material. The exemption was anchored with `$`, but all nine rules are built with the `gi` flags and no `m`, so `$` matched end of *input* rather than end of line. The guard fired only when the permission line happened to be the final content in the string.

  Real input is almost never shaped that way. `secret-file-scanner.mjs` runs on whole file contents, where a `permissions:` block is followed by the `jobs:` it authorises, so the OIDC case the v6.8.0 entry was written for stayed blocked in that hook throughout, this repository's own release workflow included. `secret-detection.mjs` blocked any prompt or subagent report that quoted the line mid-paragraph, which is what halted a long `/arckit:repo-audit` run part-way through. Trailing spaces after the value defeated the guard as well.

  Both copies now spell end of line out as `[^\S\r\n]*(?:\r?\n|$)` instead of relying on `$`, which fixes it in one place per file rather than adding `m` to nine regex constructors. Literal credentials, provider token formats, and values that merely begin with a level word such as `token: writeKeyABC123` are still blocked, in the middle of a file as well as at the end.

  Six regression tests in `tests/plugin/scanner-reference-guard.test.mjs` cover the multi-line and trailing-whitespace cases against both hooks. Every capability vector in that suite had been a single line with nothing following it, which is exactly why `$` looked correct when the guard shipped. The parity test now compares the `REF` and `LEVEL` guard constants as well as the pattern block, because the block interpolates them and this bug lived in a line the old comparison never read.

- **`/arckit:at-bvergg` told Austrian buyers to write WCAG 2.2 AA into the accessibility clause, which is a UK position rather than an EU one** (#769). §107 BVergG invokes EN 301 549, and the version that matters is the one cited in the *Official Journal*, because that citation is what carries the presumption of conformity. That is **v3.2.1** (published March 2021, harmonised August 2021), which normatively references **WCAG 2.1 AA**. The command body and the BVergG template both named 2.2 AA flatly, so every generated Austrian tender pack overstated the legal floor without saying it was doing so.

  This is #542 landing one jurisdiction too far. That change moved the UK baseline to 2.2 AA correctly — SI 2022/1097 replaced the fixed WCAG reference with a rolling one, and GDS has monitored against 2.2 since October 2024 — and it deliberately left the overlays alone, recording that `fr-dinum` and `ca-gc-digital-standards` "correctly remain on 2.1". The Austrian overlay did not exist yet, so it was never in that scope and picked up 2.2 independently. It now matches France rather than the UK.

  The forward-looking half is kept rather than dropped: draft v4.1.0 went out for public review in November 2025 and final v4.1.1, expected to carry WCAG 2.2 AA, is anticipated to be OJ-cited around October 2026. The command, template and guide all say 2.2 AA may be specified where a contract runs past that citation, provided it is stated as a deliberate decision instead of copied in as the default. The date carries a `[NEEDS VERIFICATION]` marker. A new `BVERGG` quality-checklist item holds the distinction, and `docs/guides/at-bvergg.md` gains a Key Note explaining why the UK position does not transfer.

- **Every public-facing description of `/arckit:at-nisg` still named the superseded law and the wrong reporting authority** (#770). #707 rewrote the command and its template from the mistaken "NISG 2024 / 2018-amendment" framing to the enacted standalone **NISG 2026** (BGBl. I Nr. 94/2025, in force 1 October 2026), but the correction stopped at the plugin. Five surfaces a prospective user reads *before* installing anything were left behind: `README.md` in both the community-overlay warning block and the command bullet, and three pages of the published site (`docs/commands.html`, `docs/guides.html`, `docs/contributors.html`).

  Two errors, not one. The year was the visible half. The second was the authority: the README bullet and the contributors credit both headlined "GovCERT reporting", and the site pages said "BMI reporting timelines" and "BKA / BMI reporting", all of which describe the NISG 2018 regime. Under the enacted NISG 2026 the competent authority is the new **Bundesamt für Cybersicherheit** (§3a) and significant incidents go to the **responsible CSIRT** (§34 Abs. 1, CSIRTs per §8) via the NIS2-Meldeplattform, with CERT.at as national CSIRT and GovCERT only as the public-administration sectoral CSIRT. For anything outside public administration the old wording named a body that does not receive the report.

  The `NISG 2024` string survived a targeted grep at the time because two of the five surfaces never carried the year, only the stale authority. Historical records are deliberately untouched: both `CHANGELOG.md` copies and `docs/articles/2026-04-20-v480-austrian-overlay.md` describe the position as it stood and are left as written. Documentation only, no command, template or converter output changes.

- **`README.md` still called the Austrian overlay an unmaintained seed contribution.** Three passages described the AT commands as "a seed contribution inviting an Austrian domain maintainer", "pending a domain maintainer", and carrying markers "reflecting their seed status", with citations expected to be tightened by "a future domain maintainer". @gtonic took on that role and has since run a full legal-accuracy pass across all three commands (#707), which is already recorded in `.github/CODEOWNERS` and on `docs/contributors.html`. The README was the last surface still saying otherwise, and it is the first one a prospective user reads.

  The `[NEEDS VERIFICATION]` note is kept but re-grounded. The markers are still there, twenty of them, and they now flag genuinely open points rather than unreviewed text: implementing ordinances not yet issued under the NISG 2026, Länder scope and opt-in, current guidance versions, and recent DSB case law.

- **`create-project.sh` handed back a project number that already existed, once a repo passed seven projects** (#762, reported by @chrismckelt). `get_next_project_number` in both `common.sh` copies compared the zero-padded directory prefix inside an arithmetic context, where bash reads a leading `0` as octal. `008` and `009` are invalid octal, so the comparison errored and was skipped; `010` and `011` were silently read as decimal 8 and 9. `max_num` never reached the true maximum. With `001`–`011` present the function returned `010`, and `create_project_dir`'s bare `mkdir -p` landed a second `010-` project on top of the existing one, with a README and a full set of `ARC-010-*` artefact paths under the wrong project ID.

  Nothing surfaced the failure. The failing `((...))` sits in an `if` condition, where `errexit` is suspended, so the script printed two stderr lines, reported `"success": true` and exited 0. `set -euo pipefail` was already in place; this is the second distinct way this same function has failed quietly under it, after the `find` interaction noted at `create-project.sh:70`.

  Both arithmetic sites now force base 10. The bug reached users through the default path: 48 commands invoke `scripts/bash/create-project.sh`, and all six extensions that ship bash scripts carried the same copy. The Python implementation in `scripts/python/common.py` was always correct, so the two script sets disagreed on any repo past seven projects.

  `tests/plugin/test_project_numbering.py` covers allocation across both copies for seven through twelve projects, asserts the allocation is silent, holds the bash and Python implementations to the same answer, and reproduces the original collision end-to-end. Seven is included deliberately: it is the last count the octal arithmetic got right, so a future rewrite cannot fix the tail by breaking the head.

- **`slugify` deleted accented characters from project directory names for every plugin user, and had done since March** (#766). `slugify` is implemented four times: bash and Python, each in a root copy and a plugin copy. Commit `f8544b4a` (#204, "preserve accented characters in slugify") landed in `scripts/bash/common.sh` only. The other three kept the original `[^a-z0-9]` class, so a project named `Café Modernisation` became `caf-modernisation`, with the character dropped mid-word. Marketplace users never touch `scripts/bash/`, so the single copy that carried the fix was the one they never ran.

  #204's approach would not have held anyway. `[:alnum:]` follows `LC_CTYPE`, so the root copy returned `cafe-zurich-ecole` under a UTF-8 locale and `caf-z-rich-cole` under `LC_ALL=C`: the same project name produced a different directory depending on the caller's environment.

  All four copies now transliterate to ASCII, so `Café Zürich ÉCOLE` becomes `cafe-zurich-ecole` in every locale and in both languages. The table covers Latin-1 Supplement plus the Latin Extended-A characters used across European official languages, and drops anything outside it consistently. Transliteration was chosen over preserving the accent because these names become filesystem paths, git entries and published URLs, and because macOS stores accents decomposed (NFD) where Linux composes them (NFC), so a literal accented directory name can mismatch across a clone. The bash implementation pins `LC_ALL=C` for the byte-oriented steps and spells out its character classes rather than using `\+` or `\|`, which are GNU extensions absent from BSD sed.

  `tests/plugin/test_slugify.py` holds all four copies to the same corpus, asserts the bash output is identical under `LC_ALL=C` and `C.UTF-8`, and asserts no copy can emit non-ASCII. The corpus includes the Turkish dotted capital `İ` deliberately: `str.lower()` maps it to `i` plus a combining dot, so Python lowercasing had to be restricted to A-Z to stay equal to bash.

- **`scripts/check-common-parity.py` now holds both copies of `common.sh` and `common.py` in step**, so the drift above cannot recur silently (#766). The byte-identity assert used for the two `create-project.sh` copies could not work here, because one difference is deliberate: `find_repo_root` keys on `.arckit/` in the root copy and on `projects/` in the plugin copy, since a marketplace user has `projects/` but never runs `arckit init`. A whole-file diff would report that forever, and a guard that is always red teaches people to ignore it.

  The guard compares definition by definition instead. Functions are keyed by name rather than position, because `get_templates_dir` sits at a different offset in each bash copy and that is cosmetic. Each function carries the comment block immediately above it, since #204 changed `slugify`'s comment as well as its body. Everything outside a definition is compared as one unit. Declared divergences carry their reason in the script, and **an allowlist entry that no longer describes a real difference is itself a failure**, so the allowlist cannot quietly grow into a list of things nobody checks. The bash parser splits on `name() {`; the Python side uses `ast` and covers module-level constants and the module docstring as well as functions.

  Run against `main` as it stood before this release, the guard reports the `slugify` drift. It also reports **nothing** for the `common.py` pair, which is the honest limit of what it can do: both Python copies were equally stale, so they agreed with each other while disagreeing with the fixed bash copy. This guard checks root against plugin, not bash against Python. Cross-language agreement is held separately by `tests/plugin/test_slugify.py` and `tests/plugin/test_project_numbering.py`, and a new function shared by both languages needs a test of that kind.

  `tests/plugin/test_common_parity.py` exercises the guard against synthetic pairs rather than only the real files, because a guard that cannot fail is decoration: it proves the guard catches a drifted body, a drifted comment, a function present in only one copy, and drift outside any function, while accepting a declared divergence and a pure ordering difference. The deliberate `find_repo_root` divergence is now also commented in both bash copies, which previously stated it only in the Python docstrings.

- **Fifteen doc-types told the model to verify quality checks that did not exist, and it invented them instead.** Every command ends by instructing the model to read `references/quality-checklist.md` and verify "all **Common Checks** plus the **`<CODE>`** per-type checks". For nine `arckit-togaf-adm` codes (`ADMP` `BPCM` `APP` `APPR` `GAPA` `TRANS` `BORD` `ACHG` `REPO`) and six `arckit-agent-architecture` codes (`AAGI` `AAGR` `AASE` `AAIN` `AAOV` `AAMT`) the file had no such section. Nothing errored and nothing was logged — the model simply reached a heading that was not there and supplied its own criteria for the artefact it was about to write. Both overlays landed on 2026-06-30 and had shipped this way since (#749, PR #750). The canonical file goes from 75 sections to 90.

  The content is derived, not invented, but **not from the source #748 assumes.** That issue proposes deriving per-type checks from each command's `## Success Criteria` section; only 30 of 180 commands have one, and coverage falls almost exactly on the regimes whose checklist sections already exist (`arckit-eu` 7/7, `arckit-fr` 12/12, `arckit-at` 3/3, against 0/9 and 0/6 for the two overlays fixed here). These sections come instead from each command's `## Instructions` and its template, which is where the checkable detail actually lives: ID schemes (`APP-xxx`, `WP-xxx`, `AGT-xxx`, `CNT-xxx`), decision enums (`KEEP / MERGE / REPLACE / RETIRE`, the three oversight tiers), and the derived-value rules the templates define. That last group carries most of the weight — the checks assert that a derived value **agrees with its inputs** rather than merely being present, so gap severity must match what the Size × Urgency matrix produces and rationalisation summary counts must reconcile with the per-application decisions.

- **`scripts/check-quality-checklist-refs.py` now asserts that every per-type reference resolves** (PR #751), so this cannot recur silently. The invariant is keyed on what files emit, not on the doc-type registry: if a command or agent emits `**<CODE>** per-type checks`, a `### <CODE>` section must exist in the checklist that file will actually read. Resolution is **per plugin** — `${CLAUDE_PLUGIN_ROOT}` has no cross-plugin fallback, so checking against the core copy would pass a plugin carrying no checklist at all, which `arckit-fde` does today and would fail open on the moment it gained a governance command. It covers agents as well as commands (8 agent files emit these references; a `commands/`-only scan misses them) and fails when it matches nothing at all, so a tree-wide rewording cannot quietly turn it into decoration.

  The obvious invariant would not have worked. Asserting that every regime-carrying doc-type has a section — #748's suggestion — is wrong in both directions: it misses all fifteen fixed here, because neither plugin's codes carry a `regime`, and it false-positives on `WVCH` and `MMOD`, which ask for Common Checks only by design, and on `WGAM`/`WCLM`, which point at the shared `WARD` section deliberately. The same `regime` filter is why the fifteen went unreported for two months.

  **This does not close #748.** Sixty-one doc-types across the UK, UAE, CA, AU and US regimes still have no per-type section, and their commands reference the checklist in no phrasing at all — so they skip the ten Common Checks too, and the guard stays green over every one of them. Fixing those needs an invocation line added to each command as well as a section, in six overlays with no `## Success Criteria` to work from.

- **`references/quality-checklist.md` checked artefacts against classification ladders they no longer render** (#787, PR #788). Regime routing above changed which ladder an artefact carries, but the checklist that gates the write was never brought along, so for six regimes the check and the partial disagreed about what a valid value is.

  Common check 4 enumerated three schemes — UK, UAE and AT — against the six that hard-route, so `AU`, `CA`, `NL` and `FR` were all absent. A Canadian Privacy Impact Assessment correctly classified `Protected B` rendered that value from `document-control-ca.md` and then failed the check every `ca-*` command gates on. Rather than extend the list to seven and leave the next regime to drift in again, the check now defers to `templates/_partials/RENDERING.md`, whose tables `test-regime-registration.mjs` already holds to the doc-type registry. Nothing is added to the command's reading either way: the marker resolution has already opened that file by the time the check runs.

  Seven per-type sections named a UK classification for doc-types routing elsewhere. Six are `FR` — `IRN`, `EBIOS`, `ANSSI`, `CARTO`, `ALGO`, `PSSI` — and take the values the `arckit-fr` remap settled (`OFFICIAL-SENSITIVE` → `Diffusion Restreinte`, and `PUBLIC` → `Non protégé` for `ALGO`, whose point is that the notice must be publicly accessible, so the intent survives the rename). Because that remap had already converted those commands' own inline checklists, each `fr-*` command was carrying **two contradictory checks for the same artefact**: `fr-anssi.md` asserted `Diffusion Restreinte minimum` at line 240 and `OFFICIAL-SENSITIVE minimum` through the shared checklist at line 564.

  The seventh, `ATDSG`, has been live since regime routing landed. It becomes `Eingeschränkt`, rising to `Vertraulich` where criminal-law confidentiality applies — the pair `at-dsgvo.md` itself specifies, not `Vertraulich` alone. `at-dsgvo.md`'s own checklist line carried the same UK assertion and moves with it: unlike the `FR` commands, `AT` was internally consistent beforehand, so correcting the shared checklist alone would have created the contradiction rather than removed it.

  The seven are the complete set, established by scanning all 157 per-type sections against the regime index for tokens belonging to another regime's ladder. No guard ships with this. Two things have to be settled first: hard-routed regimes currently use two conventions — local ladder only in `FR` and `AU`, dual UK-plus-local in `at-bvergg` and `at-barrierefreiheit` — and until one is chosen a guard cannot tell an intentional dual notation from drift; and naive token matching is too noisy to be the mechanism, since `OFFICIAL` and `SECRET` span three ladders and `Open`, `Secret`, `Shared` and `Confidential` are ordinary English words that appear in unrelated prose.

## [6.8.0] — 2026-08-04

### Added

- **The CLI is published to PyPI automatically on tag push.** Publishing `arckit-cli` was a manual step, so it stopped happening: PyPI sat at **6.4.1** while the repo was on 6.7.5, and `pip install arckit-cli` served a three-release-old CLI to anyone not using the git URL. A `pypi` job in `.github/workflows/release.yml` now builds and uploads on the same `vX.Y.Z` tag that cuts the GitHub Release, so the two can no longer drift.

  It uses [PyPI Trusted Publishing](https://docs.pypi.org/trusted-publishers/) rather than a stored API credential, which needs a one-time configuration on PyPI recorded in `docs/RELEASING.md` — that document had no PyPI section at all, which is the underlying reason the step was forgettable. Two guards: the job fails if the tag disagrees with the built version, because PyPI never lets a version number be reused and a wrong upload can only be yanked, not undone; and the build goes through `hatch_build.py`, so a wheel with empty extension trees cannot be published (#730).

- **Every command now declares the doc-type it writes as data, and the registry gate asserts each recipe `output.type` matches it.** `check-doc-type-registry.py` could previously only tell whether a code *resolved*, not whether it named the *right* artefact. That blind spot was one plausible fix away from shipping: `UAE-PROC` de-prefixed to `PROC`, which **is** registered, to Canada's Federal Procurement Strategy. It would have passed every existing check while keying `.arckit/state.json` to the wrong type (#715).

  The declaration is a `doc-type:` field in command frontmatter: a single code, a `[A, B]` list where a command writes more than one governed artefact, or `none` where it writes no `ARC-*` artefact at all (20 commands, including `/arckit:search`, `/arckit:health`, `/arckit:impact` and `/arckit:pages`, all of which produce console output or a docs site rather than a governed artefact). It sits on the **command** even where the command delegates to an agent holding the Write call: `/arckit:framework` declares `FWRK` although `arckit-framework` writes it. The declaration describes what running the command produces, which is what a recipe target names, and it keeps the gate from having to follow delegation.

  Recipe-target coverage went from **52 of 398** checkable to **398 of 398**. The field is stripped by the converter, since nothing consumes it at runtime on any platform.

- **`/arckit:repo-audit` takes `--diagram-format mermaid|plantuml`.** The as-built C4 container diagram was hardcoded as Mermaid in `codebase-audit-template.md`, with no way to choose. Mermaid stays the default, deliberately: an audit report is normally read in the repository it audits, and GitHub, GitLab and ArcKit Pages all render Mermaid inline with no toolchain, whereas PlantUML needs a server, the VS Code extension, or ArcKit Pages. `--diagram-format plantuml` emits C4-PlantUML instead, for the case where layout quality on a large container diagram matters more than portability — that format supports directional hints (`Lay_D`, `Lay_R`) which start to matter above roughly ten containers. `puml` and `c4-plantuml` are accepted synonyms, `mmd` for Mermaid, and an unrecognised value warns and falls back to Mermaid rather than aborting the audit. Check mode now reports the resolved format. Requested by @johnfelipe (#706).

  Two supporting changes so the choice is discoverable rather than buried in a flag. The template now carries a comment explaining which format it uses, why, and how to change it permanently. And `docs/guides/repo-audit.md` documents the per-project route, including the fact that **`/arckit:customize` cannot copy this template** — it globs the core plugin's `templates/` directory and this one ships in `arckit-repo`, so the guide gives a tested `find`-based copy command instead. The plugin cache is version-pinned and the path differs depending on whether `arckit-repo` was installed standalone or bundled inside `arckit`, which is why a literal `cp` path would have been wrong.

- **`scripts/check-doc-type-registry.py` — a CI gate asserting every doc-type reference resolves against the registry.** Three places name codes independently of `config/doc-types.mjs` and each drifted in its own way, so the gate covers all three: recipe `output.type` values; `ARC-{PID}-{CODE}-v` filenames in command and agent bodies, where an unregistered code is fatal because the PreToolUse hook blocks the write; and the `/arckit:pages` known-artifact-types table, the dual registration `doc-types.mjs` warns about in its header. It reports 161 registered codes against 398 recipe, 685 command/agent and 161 table references, and suggests the intended code where one is obvious (`'GLO' is not in DOC_TYPES (did you mean GLOS?)`).

  This is the check @chrismckelt proposed on #712. He suggested `check_recipes.py`; it went into its own script instead because the drift spans commands and `pages.md` as well as recipes, following the `check-multi-instance-parity.py` precedent for cross-registry parity. It complements `check_doctype_collisions.py`, which asserts uniqueness *within* the registry rather than resolution of references *to* it. Two exemption lists keep it honest rather than over-firing: codes named only inside a negation (`uk-nhs-dcb0129.md` says the Document ID is the literal filename, "**not** an `ARC-NNN-CSCR-vX.Y` identifier"), and prose naming future work (`sobc.md` on the later `OBC`/`FBC` business-case stages). Both are documented inline with the reason.

  Verified by mutation, not just by passing: reintroducing `GLO` in one recipe fails with the `GLOS` suggestion, and un-registering `GLOS` reproduces #712's exact signature of ten errors across `glossary.md` and `pages.md`.

- **Austrian InfoSiG classification scheme.** A new `classification_scheme` value **`AT InfoSiG`** (and `governance_framework: AT Gov`) renders Document Control headers with the Informationssicherheitsgesetz ladder — **Offen / Eingeschränkt / Vertraulich / Geheim / Streng geheim** — via a new `_partials/document-control-at.md` partial. `RENDERING.md` now resolves UAE → AT → UK in order; the quality-checklist Classification check and `default_classification` are scheme-aware; and `/arckit:at-bvergg` / `/arckit:at-dsgvo` emit the InfoSiG equivalent of their former UK defaults. UK and UAE overlays are unaffected. (Closes #709.)

### Changed

- **`generate-document-id.sh` is now `generate-document-id.mjs`, and imports the doc-type registry instead of restating it.** The bash version carried its own `MULTI_INSTANCE_TYPES` string in two hand-maintained copies. That list drifted and shipped three times: v5.9.0 added `TNDR`/`CMPT` without updating bash, so every `/arckit:competitors` run emitted the same colliding ID (fixed v5.9.2, #566); `GRNT` went the same way and surfaced only while adding `CDAU`; and the script's own header comment was five types behind until #722. It needed a dedicated CI guard, `check-multi-instance-parity.py`, purely to police the duplication.

  The Node version does `import { MULTI_INSTANCE_TYPES, KNOWN_TYPES, SUBDIR_MAP } from '../config/doc-types.mjs'`, so `config/doc-types.mjs` is the only copy of each list and there is nothing left to keep in sync. `check-multi-instance-parity.py` is removed along with its CI step, and registering a multi-instance doc-type is one place rather than three. Portability was **not** the motivation and does not on its own justify the move: 42 of the 66 calling commands also call `create-project.sh`, so a machine without bash fails either way (#723).

  Two capabilities follow from having the registry in scope, neither of which the bash version could offer:

  - **An unregistered doc-type code is now rejected at generation time**, with a message naming both places it has to be registered. Previously the generator had no registry knowledge at all and emitted `ARC-001-GLOS-v1.0.md` quite happily, leaving `validate-arc-filename.mjs` to block the write two steps later with no indication of what to fix. That is exactly how `/arckit:glossary` and `/arckit:framework` shipped unusable (#712, #714). The check found a live instance immediately: the script's own documented example used `HLD`, which is not a registered code — the artefact type is `HLDR`, one of the six recipe mismatches #714 corrected.
  - **A new `--relpath` flag** applies `SUBDIR_MAP` and returns the project-relative path (`research/ARC-001-RSCH-001-v1.0.md`), so callers no longer hand-assemble `research/`, `decisions/` and `framework/` in prose.

  It also validates that `PROJECT_ID` is numeric and says so when a doc-type has been passed in that slot, which is the precise shape of the bug that made all 12 `arckit-uae` call sites no-ops until #722.

  `scripts/bash/generate-document-id.sh` and its plugin copy are now identical shims that `exec node` the generator, so projects scaffolded before this change keep working and pick up the current registry once `arckit init` refreshes `.arckit/`. Both will be removed a release later. Zero npm dependencies, matching `validate-handoff.mjs`: the marketplace clones the plugin but never runs `npm install`.

  `arckit init` now scaffolds `.arckit/scripts/generate-document-id.mjs` and `.arckit/config/doc-types.mjs` side by side so the generator's relative import resolves, and the converter ships both into all seven generated extension formats. 82 call sites across 79 command, agent, skill and doc files were rewritten from `bash …/scripts/bash/generate-document-id.sh` to `node …/scripts/generate-document-id.mjs`, and the generator was added to the `allow-plugin-internals.mjs` and Codex hook allowlists so invocations are still auto-permitted.

### Fixed

- **The site's install FAQ told users to `pip install arckit` — a different project.** `arckit` on PyPI is an unrelated third-party package (tools for the Abstraction & Reasoning Corpus, v1.0.1); ArcKit's CLI is **`arckit-cli`**. The instruction sat in `docs/index.html`'s FAQ JSON-LD, which is what search engines' rich results and AI assistants quote, so it was the most-syndicated install line in the repo. Corrected to the git URL every other install doc uses, and the `--ai` list it quotes now includes `kimi`, which the CLI has supported since v6.4.0.

- **`uv tool upgrade arckit-cli --from git+…` is not a valid command.** `uv tool upgrade` takes no `--from`; running the documented line fails with `error: unexpected argument '--from' found`, so the uv upgrade path in `README.md` and `docs/guides/upgrading.md` never worked. Replaced with `uv tool install --force arckit-cli --from git+…`, verified against uv. (`uv tool install --from` is fine — only `upgrade` rejects it.)

- **The Copilot install section understated what the CLI scaffolds by half.** README claimed 80 prompt files; `arckit init --ai copilot` writes **165** — the 75 official commands plus the community overlays. The CLI's Gemini redirect quoted "all 48 commands", three formats out of date, and no longer hardcodes a number.

- **The secret scanner blocked GitHub Actions OIDC permissions.** The generic key-value rule in `secret-detection.mjs` / `secret-file-scanner.mjs` matched the `id-token` key set to `write` — the required syntax for publishing without a stored credential — so ArcKit's own hooks refused every workflow that used it, this repo's release workflow included. A declared permission level is not credential material, so the five reference-guarded key-value rules now also exempt a value that is exactly `read`, `write`, `none`, `true`, `false` or `null`. Deliberately narrow: `write_this_down` and `readonly` still fail the word boundary and are still blocked, as are all the literal-secret and provider-format cases the suite already covered.

- **`arckit init` scaffolded an empty project on Homebrew Python, because `get_data_paths()` trusted the interpreter's prefix over the module's own location.** Every candidate base came from `site.getsitepackages()`, which CPython derives from `sys.prefix`. Homebrew patches sysconfig's `osx_framework_library` scheme so pip writes purelib to `<brew>/lib/python3.11/site-packages` and shared data to `<brew>`, while `sys.prefix` still points inside the Framework bundle — two trees that never meet. Every probe missed and control reached `build_paths(source_root)`, which fabricated `/opt/homebrew/lib/python3.11/.arckit/templates`: a path that cannot exist on any machine, reported as a yellow warning under a green "initialized successfully" banner.

  Resolution now starts from the one thing that is true regardless of what the interpreter believes its prefix to be — where the installed module actually sits. It walks up to the `site-packages`/`dist-packages` ancestor and takes the prefix above it, which also covers Debian's `dist-packages` and any venv. Each `sysconfig` scheme's `data` path is probed as well, so Homebrew's scheme is found by name rather than by hardcoding `/opt/homebrew` (the workaround proposed on the issue, which would have missed Intel macOS at `/usr/local` and Linuxbrew). `ARCKIT_DATA_DIR` overrides everything, for layouts nobody predicted. When nothing resolves, `find_data_root()` returns `None` and the caller prints the full candidate list instead of inventing a path — the original report cost a round trip precisely because the fabricated path looked like a deliberate answer. Reported by @designlabdotcx (#730).

- **`arckit init` announced success no matter how much of the project was missing.** Every asset copy was best-effort with a yellow warning, after which the command printed `✓ ArcKit project initialized successfully!` and Next Steps that could not work — the reporter's own paste on #730 shows `Warning: Copilot prompts not found` three lines above the success banner. That is what turned two clear-cut bugs into a report that needed a round trip to diagnose: nothing in the output said the project was unusable.

  Assets are now resolved and checked **before** anything is written, so a broken install exits 1 with the missing keys and their resolved paths, and leaves no half-scaffolded directory behind. Only assets that make a project unusable gate the run — the templates, the helper scripts, the document-ID generator and its registry (42 of 66 commands call it), plus whichever command tree the selected `--ai` needs; `--all-ai` requires both the Codex and OpenCode trees. Optional and degrading copies stay best-effort. `kimi` declares no assets of its own, since its commands arrive via the extension installed from inside the Kimi TUI, and a test asserts every `--ai` target declares its requirements so a new one cannot silently skip the gate.

- **A wheel built from a git checkout shipped extensions with no commands in them.** `extensions/` is converter output and gitignored, so `pip install git+https://github.com/tractorjuice/arc-kit.git` — the only install route the README documents — packaged just each extension's tracked `README.md`, `VERSION` and `docs/`. `arckit init --ai copilot` then produced a project with no prompts, no agents and no `copilot-instructions.md`; `--ai codex` and `--ai opencode` were equally hollow and simply nobody had reported them. The published wheels were complete only by accident of being built from a working tree where `scripts/converter.py` had been run; the published sdist is hollow to this day, so `python -m build` (sdist first, then wheel *from* that sdist) reproduced the same empty package from a clean clone.

  `hatch_build.py` is a hatchling build hook that regenerates the extension formats before either target is assembled, and refuses to package a tree still missing them, naming what is absent. `pyyaml` joins `[build-system] requires` because the converter parses command frontmatter. Verified end to end: a clean clone of the branch now builds a wheel carrying 165 Copilot prompts, 10 agents and `copilot-instructions.md`, installs, and scaffolds a complete project with no warnings — and with `ARCKIT_SKIP_CONVERTER=1` the same clone fails the build loudly rather than shipping the empty one. A test asserts the hook's required-asset manifest keeps covering every `extensions/*` entry in `shared-data`, so a future extension cannot inherit this silently (#730).

- **`/arckit:pages` published a scan of the local disk, because only one of the two `docs/manifest.json` writers had a gitignore guard.** #690 taught `update-manifest.mjs` that "a published index must not reference a file that will never be published". `sync-guides.mjs`, which rewrites the *whole* manifest rather than appending one entry, never got the same guard. ArcKit gitignores its own `projects/`, so running the command here replaced the published index with whatever happened to be on that machine. `sync-guides.mjs` now applies the same rule at the point project directories are discovered, so `projects[]`, `global[]`, `dependencyGraph` and `projectHealth` are all correct by construction rather than pruned afterwards. That distinction matters: `dependencyGraph` comes from a separate scan and keys its nodes by document ID rather than storing an array, so a post-hoc walk of the finished manifest missed it and left gitignored paths published. Scoped to ArcKit artefact directories, not the whole manifest, so a repo that gitignores its generated `docs/` keeps its guides instead of silently losing the lot. Fails open when git is unavailable, still indexes untracked-but-not-ignored artefacts (the normal case for a freshly written one), and reports what it omitted. A no-op in every current test repo (#727).

- **Hand-added `<head>` content in `docs/index.html` was destroyed on every `/arckit:pages` run.** The page is generated wholesale from `pages-template.html`, so arckit.org silently lost its analytics tag. The tag cannot simply live in the template: the template ships to every ArcKit user, and baking one site's measurement ID into it would put that ID on everybody's page. Content between `<!-- ARCKIT:PRESERVE -->` and `<!-- /ARCKIT:PRESERVE -->` is now carried across from the existing page into the regenerated one, so analytics tags, verification meta and custom fonts survive. A test asserts neither template copy contains anything shaped like a measurement ID.

- **`docs/manifest.json` was the output of the generator #691 reverted**, carrying 4 of the 12 keys `sync-guides.mjs` produces. #683 added `scripts/generate-docs-manifest.py`, #691 removed it as "a duplicate, inferior implementation" — correctly — but left its output committed, and the `/arckit:pages` crash fixed in #726 meant nothing could regenerate it. Rebuilt with the real generator: 204 guides, 18 role guides, and `projects: []`, which is the honest answer for a repo that gitignores its own `projects/`. The previous file listed 33 pseudo-projects that were really guide groups.

- **`update-manifest.mjs`'s ownership comment described an arrangement that ended in #691.** It named `scripts/generate-docs-manifest.py`, deleted in that revert, and claimed the two writers "do not overlap once the gitignore guard is in place". They did overlap, and the guard was only on one of them. Corrected to name `sync-guides.mjs` as the full generator and this hook as the incremental updater, both now guarded.

- **Three `/arckit:build` recipe targets in `uk-nhs-clinical-safety.yaml` were keyed to the wrong artefact type, found by the new check on its first run.** `AWS_RESEARCH`, `AZURE_RESEARCH` and `GCP_RESEARCH` all set `output.type: RSCH`, but those commands write `AWRS`, `AZRS` and `GCRS`. `RSCH` is registered, to `/arckit:research`, so the codes resolved and nothing flagged them: this is the "resolves but names the wrong type" class in the wild, not a hypothetical. Five targets in that one recipe shared the `RSCH` key, so `--resume` and `--target` could not distinguish them. Every one of the seven other recipes with the same three targets already used `AWRS`/`AZRS`/`GCRS` with `multi_instance: true`; this one was the outlier and is now aligned (#715).

- **`/arckit:pages` crashed before it could rebuild the dashboard, in any repo containing an `audits/` or `framework/` directory.** `sync-guides.mjs` routes each artefact into `project[<camelCased SUBDIR_MAP directory>]`, deriving those keys from `SUBDIR_MAP` — but the bucket list it pushed into was hand-written. Registering a doc-type with a new subdirectory therefore left an undefined array, and `scanProject` died on `project[key].push(...)`.

  It shipped twice and was never reported, because the crash only fires in a repo that actually has the directory: `audits` arrived with `CDAU` in v6.7.0, `framework` with `FWRK` in #714. That is why `docs/manifest.json` went stale. The buckets are now derived from `SUBDIR_MAP` by the same `subdirKey()` helper the routing loop uses, so the two cannot diverge again, and `tests/plugin/sync-guides-buckets.test.mjs` pins it (it fails against the previous shape).

- **Eight Node test suites, 64 tests, were never run by CI.** `lint-markdown.yml` globbed `tests/plugin/*.test.mjs` and listed one `test_*.mjs` file explicitly, leaving the other eight unrun — including `test_update_manifest.mjs`, the `docs/manifest.json` coverage, and the graph and OKF suites. The step's own comment claimed the glob "avoids the per-file enumeration drift that left suites unrun"; it did not, for the second naming convention. Both patterns are now globbed, taking the job from 166 tests to 266. Same class of gap as #719, where pytest ran 52 of 1,445.

- **The doc-type registry gate was blind to every multi-instance filename, which is the one form all 20 `MULTI_INSTANCE_TYPES` codes are actually written in.** `check-doc-type-registry.py`'s command/agent check is the half that catches the *fatal* class of drift: `validate-arc-filename.mjs` blocks any write whose code is not in `KNOWN_TYPES`, and the command has no conforming name to fall back to. Its pattern required the code to be followed immediately by `-v`, so `ARC-001-WGAM-001-v1.0.md`, `ARC-{PID}-ADR-{NNN}-v1.0.md` and `ARC-{PROJECT_ID}-WGAM-{NUM}-v{VERSION}.md` produced no match at all. Only the literal `NN`/`NNN` placeholder form was ever checked, and only incidentally, because the code group swallowed it and the `NOT_A_CODE_IN_PROSE` fallback split it back off. An unregistered multi-instance code therefore passed the gate and was then blocked at runtime by the hook, which strips the sequence segment before its own `KNOWN_TYPES` lookup: the exact `GLOS`/`FWRK` failure, unguarded. The pattern now accepts an optional sequence segment (`-001`, `-{NNN}`, `-{NUM}`) and is pinned by `tests/plugin/test_doc_type_registry.py`, including an end-to-end probe asserting the gate fails on unregistered codes in that form. The check went from 685 to 785 resolved references on the current tree, with no new failures, so this closed the hole rather than revealing a live break (#715).

- **All 12 `arckit-uae` commands called `generate-document-id.sh` with the doc-type in the `PROJECT_ID` slot, so the call could only ever fail.** They read `generate-document-id.sh FPRO --filename`; the script takes positionals as `PROJECT_ID` then `DOC_TYPE`, so every one of them exited 1 with `Error: DOC_TYPE required` and the model was left to invent a filename. Corrected to `<PROJECT_ID> FPRO --filename`, matching the idiom already used by the `arckit-ca`, `arckit-us`, `arckit-au`, `arckit-uk-finance` and `arckit-uk-nhs` overlays. Worth noting for #714's audit trail: the *code values* in those calls were right, so resolving `UAE-PROC` to `FPRO` and `UAE-PRIORITIES` to `NPRA` against them was still correct (#715).

- **`generate-document-id.sh`'s header comment listed the multi-instance types and had drifted five behind the code.** It named 15 types while `MULTI_INSTANCE_TYPES` held 20, omitting `CDAU`, `GCSR`, `GLND`, `GOVR` and `GRNT`, so anyone consulting it to decide whether a type needs `--next-num` got the wrong answer for five of them. `check-multi-instance-parity.py` guards the variable across all three registries but only reads the `MULTI_INSTANCE_TYPES="..."` assignment, so it could not see the comment. The duplicate list is removed rather than re-synchronised: the comment now points at the variable, which eliminates the drift surface instead of recreating it. Applied to both tracked copies (#715).

- **`/arckit:glossary` could never write a conforming filename — no glossary code was registered, so the hook blocked every run.** `commands/glossary.md` instructs the model to write `ARC-{PROJECT_ID}-GLOS-v1.0.md` in eight places, but `config/doc-types.mjs` had no `GLOS` entry, so `validate-arc-filename.mjs` rejected the write as an unknown document type and no fallback name existed. Three different spellings were in use and none was registered: `GLOS` in the command, `GLO` in six `/arckit:build` recipes, `GLOSS` in a seventh. `GLOS` is now registered — it is what the command already used, and the 3-character `GLO` was an outlier against the surrounding 4-character codes — with the seven recipes converged on it. Reported by @chrismckelt against 6.7.5 (#712).

  The recipe spellings were the less serious half. `output.type` keys `.arckit/state.json` and is explicitly not used for path construction, so an unregistered code there did not block a write; it produced a state key `--resume` and `--target` could not match. The write-blocking half was entirely command-side.

  Recipe **scope** disagreed too: six recipes wrote `project: "000-global"` while the seventh and the command both said per-project. Settled on per-project, because all seven pass `args: "{P}"`, whereas the genuinely repo-wide targets in the same recipes (`PRIN`, `STRAT`) pass `args: ""` — the six were self-contradictory.

- **`/arckit:framework` was broken the same way, via an unregistered `FWRK`.** Not reported; found by the new registry gate below on its first run. `agents/arckit-framework.md` writes `projects/{P}-{NAME}/framework/ARC-{P}-FWRK-v{VERSION}.md` in three places, and `FWRK` was absent from the registry, so every framework build was blocked at the write. `FWRK` is now registered with a `SUBDIR_MAP` entry routing it to `framework/`, and `commands/framework.md` already told the model to verify "the **FWRK** per-type checks" in a checklist that had no such section — added, along with a `GLOS` section.

  The same agent also described the executive guide as `ARC-{P}-EXEC-vN.N.md` in its deliverables list while its own write step says to name it `{Project-Name}-Executive-Guide.md` and that it is deliberately *not* an `ARC-*` artefact. The deliverables list is now consistent with the write step; no `EXEC` code was registered, since the file should not carry one.

- **Five further classes of recipe code drift, all silent.** Each is a code whose command writes a *different* registered code, so nothing failed loudly: `AIP` → `AIPB`, `HLD` → `HLDR`, `SBD` → `SECD`, `TRACE` → `TRAC`, and twelve invented `UAE-`-prefixed codes in `uae-federal-ai.yaml` (`UAE-CLAS`, `UAE-PDPL`, `UAE-AICH`, …) whose commands write the bare form, as its sibling `uae-agentic-transformation.yaml` already did. Two of the twelve were not simple de-prefixings and were resolved against each command's `generate-document-id.sh` call: `UAE-PRIORITIES` → `NPRA` and `UAE-PROC` → `FPRO`.

- **The Austrian overlay's NISG command and template described the wrong law.** They framed the NIS2 transposition as a 2018 amendment (`NISG, BGBl. I Nr. 111/2018 idF BGBl. I Nr. 94/2025`) and in places called it "NISG 2024". The enacted law is the standalone **NISG 2026** (BGBl. I Nr. 94/2025), which *replaces* the NISG 2018 (expiring 30 Sep 2026) and **enters into force on 1 October 2026** (§51), with registration due by 31 Dec 2026 (§29) — i.e. it is not yet in force. The competent authority is the new **Bundesamt für Cybersicherheit** (§3a), incident reports go to the responsible **CSIRT** (§8 — CERT.at as national CSIRT, GovCERT as public-administration sectoral CSIRT) via the NIS2-Meldeplattform (§34), and administrative penalties (§45) address the entity, not management personally (personal liability is not explicitly regulated). Fabricated paragraph references (§18, §§24-25, §4(4), §22, §3(4)) were replaced with the enacted numbering (§§2–14, 24, 29, 31–34, 45, 51) or honest `[NEEDS VERIFICATION]` flags. Verified against BGBl. I Nr. 94/2025 plus Schönherr and Hochleitner (iura.at) analyses.

- **`/arckit:at-nisg` — full paragraph-level verification against the enacted NISG 2026 text (BGBl. I Nr. 94/2025), correcting the details the earlier pass had left approximate or flagged.** Checked every citation against the authentic Bundesgesetzblatt. Four substantive fixes: (1) the **Wirksamkeitsnachweis was conflated with the §33 Abs. 1 Selbstdeklaration** — the ~30 Sep 2027 milestone is the *self-declaration* of implemented measures (within 12 months of the registration duty), while the independent audit **Wirksamkeitsnachweis (§33 Abs. 2)** cannot be requested until at earliest two years after entry into force (~Oct 2028); both are now shown separately. (2) The claim that the old **€50k/€100k ceilings are "superseded" was wrong** — they survive as a *lower tier* in **§45 Abs. 4** for procedural breaches (registration, self-declaration, obstruction of supervision), alongside the **§45 Abs. 2/3** core-duty ceilings of *up to* €10M/2% (essential) and €7M/1.4% (important) — corrected from the misleading "≥" to the enacted "bis zu". (3) **Supervision and enforcement were mis-cited as §45** — they are **§38 (Aufsichtsmaßnahmen)** and **§39 (Durchsetzungsmaßnahmen)**; §45 is the penalty catalogue. (4) The fining authority is confirmed as the **Bezirksverwaltungsbehörde (§44 Abs. 1)** and the size-independent criticality designation resolved to **§26** (both previously `[NEEDS VERIFICATION]` / `[VERIFY §]`). The personal-liability note is now anchored to **§44** (legal-person attribution; §44 Abs. 5 waives §9 VStG punishment once the entity is fined). Entry into force (1 Oct 2026, §51) and the three-month registration window (§29 Abs. 3) re-confirmed against §51's nine-months-plus-month-start mechanic.

  Three further corrections from a second pass over the authentic text: (5) **public-administration bodies were shown the §45 fine ceilings, which do not apply to them.** §46 operates expressly "abweichend von § 45": for Behörden and sonstige Stellen der öffentlichen Verwaltung — including Gebietskörperschaften and bodies constituted under private law — the Bezirksverwaltungsbehörde establishes non-compliance **by Bescheid** with a remediation deadline and, if the lawful state is not restored once the Bescheid is final, **publishes** the non-compliance (§46 Abs. 2, a Verfassungsbestimmung). No fine is imposed. Since public administration is an in-scope sector (§2 Z 10) and the command is explicitly offered for it, an Austrian federal body would otherwise have been given a materially wrong penalty exposure. (6) The **§33 Abs. 2 deadline structure was only half-stated** — the general window to evidence implementation is two years from the Aufforderung, but **Essential entities have only two months** for the operative and organisational proof (§33 Abs. 2 second sentence); for Important entities §38 Abs. 2 applies analogously. (7) **§44 Abs. 7's ne bis in idem was missing** — where the Datenschutzbehörde has already fined the same conduct under Art. 58(2)(i) GDPR, no NISG fine may follow, which is directly relevant to the command's DSB cross-reporting step.

- **`/arckit:at-bvergg` shipped stale procurement thresholds and an out-of-date legal frame.** The command used the 2024–2025 EU values (€221k/€443k/€5,538k); it now uses the 22 October 2025 threshold regulations, all in force 1 Jan 2026 for 2026–2027 (€140k central / €216k sub-central / €432k utilities / €5,404k works). These span three instruments and the command now cites each tier's own: **(EU) 2025/2152** for the classical sectors (Directive 2014/24/EU — central, sub-central, works), **(EU) 2025/2150** for **Sektorenauftraggeber / utilities** (Directive 2014/25/EU — the €432k figure, which is *not* from 2025/2152), and **(EU) 2025/2151** for concessions (Directive 2014/23/EU). It is also aligned to the **Vergaberechtsgesetz 2026** (BGBl. I Nr. 8/2026) — the largest procurement reform since the BVergG 2018, a Novelle in force **1 March 2026** (eForms from 1 October 2026, including below-threshold): permanent Direktvergabe limits (supplies/services **€143k**, works **€200k**; central/Bund authorities effectively capped at the €140k EU Oberschwelle), the "document ≥3 Vergleichsangebote/Preisauskünfte from €50k" rule, harmonised Ausschlussgründe/Selbstreinigung, binding Rahmenvereinbarungs-Höchstwerte, and a tiered Nachprüfungs-Pauschalgebühren system. The BVergG 2018 keeps its name and numbering; the BVERGG doc-type label is updated to "BVergG 2018 idF VergabeRG 2026". (Closes #708.)

- **`/arckit:at-dsgvo` overstated Austrian data-protection specifics.** The §§12–13 DSG image-processing regime is now flagged as **contested** — the BVwG held it inapplicable for want of a GDPR opening clause (W256 2214855-1; W211 2210458-1, 2019) while the OGH still applies it (6 Ob 150/19f) — and the assessment is anchored on the GDPR. The **§30 Abs 5 DSG** exemption of Behörden / öffentliche Stellen from GDPR fines (Art. 83(7)) is now recorded in the command and template.

- **`/arckit:at-dsgvo` carried three wrong statutory citations.** `§2d DSG` does not exist — the DSB research/statistics approval is **§7 DSG** and the Art. 89(1) data-subject-rights exemption is **§2d FOG** (Forschungsorganisationsgesetz); the cookie-penalty row cited `§109 TKG 2021 / €37,000` (that is the *TKG 2003* provision) and is corrected to **§188 TKG 2021, up to €75,000** for breach of the §165 Abs 3 information duty (Fernmeldebehörde); and the employee-monitoring trigger conflated §96a with **§96 Abs 1 Z 3 ArbVG** (control measures affecting human dignity), now distinguished from §96a (Personaldatensysteme). The law-enforcement/justice data-protection regime now points to the **DSG 3. Hauptstück (§§36–61, transposing RL (EU) 2016/680)**, with StPO §§134–143b noted as lex specialis, instead of citing only the StPO.

- **CODEOWNERS matched no overlay files.** The `at-*` / `eu-*` / `fr-*` / `ca-*` / `uae-*` patterns pointed at a non-existent `arckit-claude/…` root path, so the domain maintainers (@gtonic, @thomas-jardinet) were never auto-requested for review. Patterns now target the real `plugins/arckit-<x>/…`, the generated `plugins/arckit-claude/plugins/<x>/…` mirror, `.arckit/templates/…` and `docs/guides/…`.

### Security

- **postcss pinned to `>=8.5.18` (GHSA-r28c-9q8g-f849).** postcss `<=8.5.17` carries a regular-expression denial of service, CVSS 7.5. It reaches ArcKit transitively through the `@mermaid-js/mermaid-cli` devDependency chain, so the exposure is the local and CI diagram-rendering toolchain rather than anything shipped to users — the pin is precautionary, not a response to a live incident. Applied as an npm `overrides` entry, which raises the transitive version without adding postcss as a direct dependency of ArcKit. Contributed by @anupamme (#703).

## [6.7.5] — 2026-07-28

### Fixed

- **The Build Provenance block failed markdownlint in every artefact ArcKit stamps.** `.markdownlint-cli2.jsonc` sets MD049 to `asterisk`; both provenance stamping hooks emitted their preamble as `_Stamped automatically by …_`. Because that block is appended to every stamped artefact, the violation shipped into each one — in user repos as much as this one, so this is a product defect rather than repo hygiene. Fixed in both sources: `plugins/arckit-claude/hooks/provenance-stamp.mjs`, which propagates to the generated extensions, and `extensions/arckit-codex/hooks/arckit-codex-hook.mjs`, which is hand-maintained, carries its own stamp string, and could not be reached by the converter. `tests/plugin/provenance-emphasis.test.mjs` now asserts both open and close on `*` in both sources (#701).

- **The release flow's plugin-manifest validation had never validated anything.** Step 7/8 cross-checks every `plugin.json` against its marketplace entry to catch version drift before tagging. The `/release` skill discovered manifests with `find . -maxdepth 3`, but from the repo root they sit at depth 4 — the glob matched nothing, the loop body never ran, and it exited 0 reporting a clean pass. Every release from v6.0.0 through v6.7.4 "passed" that way. Separately, both the skill and `docs/RELEASING.md` passed the `name` field from `plugin.json` to `claude plugin tag`, which takes a path: `claude plugin tag arckit` fails with `Path not found`. Had the glob ever matched, every iteration would have failed anyway. Both now search from `plugins`, derive the directory path, and assert the glob found something before looping — the count assertion being the actual fix, since a loop whose body may never run is unvalidated until it reports what it covered (#700).

### Changed

- **`books/` and `docs/pitch-decks/` are no longer linted.** Both are gitignored with zero tracked files, so CI never saw them while every local run did — `books/` alone produced 1,259 errors. That volume of noise in `bump-version.sh` output is what let the provenance defect above sit unnoticed. Now excluded, matching the existing treatment of `docs/articles/`, `docs/plans/` and `research/`. `projects/**` stays in scope deliberately despite also being gitignored here: those artefacts are ArcKit's own output, and linting them is exactly what surfaced the defect. A repo-wide sweep is now clean at 3,502 files.

## [6.7.4] — 2026-07-28

Repository and site maintenance. No changes to the plugin, commands, agents,
hooks, templates or any generated extension — the version moves only because
all distribution formats ship in lockstep.

### Fixed

- **Three contributors credited in the CHANGELOGs were missing from `docs/contributors.html`.** @Yumstezy (authored `docs/guides/custom-commands.md`, #111/#357), @jhonurrego-tekton (reported #688, v6.7.2) and @chrismckelt (reported #693, v6.7.3) all had release-note credits and no card on the site. All three are now listed, and the two counts the page carries — the hero stat and the Community Impact paragraph — are consistent with the 19 cards on it.

### Added

- **`scripts/check-contributor-credits.py`, a CI guard against contributor-credit drift.** The page is hand-maintained and nothing derives it from the CHANGELOGs, so crediting someone at release time and listing them on the site are independent acts — and only one of them is part of the release flow. The failure was silent and one-directional (the CHANGELOG right, the site quietly incomplete), which is why it accumulated across three releases before anyone looked. The guard fails CI when a handle credited in either CHANGELOG has no profile link on the page.

  Checked in one direction only. The reverse would be wrong: a card may legitimately predate the credit convention, or record a contribution such as a proposed overlay or an adopted external spec that never produced a release note.

  Code spans and fenced blocks are stripped before scanning, because a credit is always prose and `@`-prefixed tokens are everywhere in a technical changelog — without it, PlantUML's `@startuml`/`@enduml` register as contributors, as would npm scopes and decorators. Bare version specifiers such as `mermaid@11.15.0` are excluded by a word-boundary guard rather than by the code stripping, so they stay excluded outside backticks too.

  Wiring `docs/contributors.html` into the `lint-markdown.yml` path filters also closes a related gap: a PR touching only that file previously triggered no CI at all. Confirmed working: the next contributors-only PR ran the lint job, where the one before it had run no checks whatsoever.

### Changed

- **The Community Impact summary on `docs/contributors.html` now states its counting rule and the real domain-maintainer total.** The figures themselves were correct and are unchanged — they are a disjoint partition, every person counted once under their primary role, summing to the 19 cards on the page. But three of the code contributors also maintain a jurisdictional overlay (Austria, Australia, EU / France), which the sentence hid: it read as though ArcKit has one domain maintainer when it has four. Naming the partition rule matters as much as the figure, since without it the next reader mistakes those numbers for a badge tally and "corrects" a correct number into a wrong one.

## [6.7.3] — 2026-07-28

### Fixed

- **`evolve` lines carrying a trailing `label` were silently dropped from the generated Mermaid block — a side-effect of the #508 fix.** PR #511 anchored the evolve target at end-of-line to stop `003` being taken as the target in `evolve "Foo (Project 003)" 0.74`. That fix was correct, but the anchor also meant no evolve line with *any* trailing text could match, and `owm-to-mermaid.mjs` skips unmatched lines silently. The label suffix is now an optional non-capturing group, so the #508 anchor holds while labels are tolerated and stripped as they were before #511. Reported by @chrismckelt against 6.7.2 (#693).

  Wider than reported in two ways. First, this is the **documented** syntax, not an edge case: `commands/wardley.md` gives the output template as `evolve {Component Name} {target_evolution} label {label text}`, repeats it in the syntax summary, and uses it in worked examples, and both `wardley-map-template.md` copies follow suit — so a `/arckit:wardley` run that followed ArcKit's own instructions lost *every* evolve line from the Mermaid block while the OWM block above it showed them all. Second, the canonical OWM offset form `evolve X 0.8 label [10, -5]` was dropped too, not just free-text labels.

- **`validate-wardley-math.mjs` was blind to the same lines, so nothing caught the inconsistency at write time.** The hook carried the same end-anchored evolve pattern in two places. A labelled evolve line therefore never landed in the reference list, and an evolve pointing at an undeclared or misspelled component passed validation silently. Both patterns now take the same optional label suffix; the dangling-reference check fires on labelled lines as it always should have (#693).

  No documentation change was needed: `commands/wardley.md` describes the converter as handling "`evolve`-label stripping", which was true before #511 and is true again now. The code was wrong, not the doc.

## [6.7.2] — 2026-07-27

### Fixed

- **Overlay artefacts silently lost their Build Provenance block — a regression introduced in v6.7.1.** The publish-time namespacing rewrite (#685, #686) rewrites every published `.md`, template footers included, so an artefact generated from a published overlay template carries `/arckit-repo:repo-audit`. The footer pattern in `provenance-stamp.mjs` required `:` or `.` immediately after `arckit`, so `arckit-repo:` matched nothing: the command went undetected, its `effort:` was never read, and with no build context the block was skipped entirely. Source-tree runs were unaffected because sources keep the portable `/arckit:X` form, which is exactly why no test caught it. The pattern now accepts an optional `-<namespace>` (#689).

- **An overlay command's `effort:` could never resolve — pre-existing, all 105 overlay commands.** `readCommandFrontmatter` only ever looked at `<plugin-root>/commands/<name>.md`. Core lives there; overlays do not — in the published layout they nest under the core root, and in the dev tree they are siblings. Command lookup now falls back to a bounded search of both layouts. Bounded deliberately: an unbounded walk inside a PostToolUse hook with a 5s timeout is a bad trade (#689).

- **`docs/manifest.json` no longer indexes artefacts that git actively ignores.** The manifest is a *published* index — ArcKit serves its own at `arckit.org/manifest.json` — so indexing a gitignored artefact writes a reference to a one-machine-only file into a file everyone fetches, producing a permanent 404. `update-manifest.mjs` now skips ignored paths. Ignored, **not** merely untracked: a brand-new artefact in a repo that tracks `projects/` is untracked until committed and must still be indexed. Fails open when git is absent or the directory is not a repository, since neither can prove a path is ignored (#690).

- **`CLAUDE.md` recommended the wrong Claude Code marketplace.** It told users to add `tractorjuice/arc-kit` while three other places recommend `tractorjuice/arckit-claude`. Both publish all 16 plugins under identical names, so a user following both instructions registers `arckit`, `arckit-repo` and the rest twice. Reported by @jhonurrego-tekton, who found duplicate entries in `installed_plugins.json` alongside a "Plugin 'arckit' not cached" warning (#688).

### Removed

- **`scripts/generate-docs-manifest.py`, added in v6.7.1, has been reverted** along with its 13 tests and its CI step (#691). It was a duplicate, inferior implementation of something the product already does: `sync-guides.mjs`, driven by `/arckit:pages`, is the real generator and builds a far richer schema (`guides`, `roleGuides`, `guideSectionOrder`, `typeCategories`, `dependencyGraph`, `projectHealth` and more). The generator wrote four of those keys and modelled guides as pseudo-projects rather than the arrays the dashboard consumes, so running `/arckit:pages` would have overwritten it, CI would then have failed on `--check`, and the obvious fix — running `--write` — would have destroyed the real manifest.

  **This supersedes the v6.7.1 entries** that listed the generator under *Added* and stated that `docs/manifest.json` "is now generated, never hand-edited". There is no `generate-docs-manifest.py` step to run after adding a guide, template, or article.

  The enriched `docs/manifest.json` **content** is kept. Reverting it would restore four entries pointing at deleted files; 463 entries with zero dangling references is a better frozen snapshot than 107 with four 404s. Nothing maintains it in this repository, and `sync-guides.mjs` owns it wherever `/arckit:pages` is actually run.

## [6.7.1] — 2026-07-27

### Fixed

- **Overlay slash commands now resolve in Claude Code.** Claude Code namespaces plugin commands by the `name` in `plugin.json`. The core plugin is named `arckit`, so `/arckit:adr` works, but every overlay is named `arckit-<x>` — so none of the 105 overlay commands resolved under the documented `/arckit:` prefix. Confirmed live: `arckit:repo-audit` returns "Unknown skill" while `arckit-repo:repo-docs` runs. The published Claude plugins now carry the namespaced form (`/arckit-uae:uae-ai-charter`, `/arckit-togaf-adm:adm-preliminary`, `/arckit-repo:repo-audit`), applied at publish time by `scripts/claude_command_namespacing.py` from both `sync-claude-plugin-layout.py` and `push-extensions.sh` (#685, #686).

  The command **sources** deliberately keep the portable `/arckit:X` form, because `converter.py` already rewrites it per target: Copilot gets `/arckit-X`, Codex and Kimi get their own skill prefixes, and Gemini and OpenCode keep `/arckit:X` because the converter merges every overlay into one flat `arckit` namespace. Rewriting the 2,698 source references would have broken seven working formats to fix one. Claude Code was simply the only target with no rewrite step.

- **`/arckit:repo-audit` no longer scores a codebase against an unrelated project.** Mode inference assumed any project in the repository described the audited code. Auditing this repo, whose only project is a UK consulting *market study*, would have produced a full page of confident Met/Not-met verdicts against 28 irrelevant requirements. The command now confirms the project actually describes the repository, asks when the evidence is ambiguous, and falls back to cold mode when correspondence is unconfirmed. `--check` reports the judgement (#684).

- **`create-project.sh` failed silently on a fresh repository.** With no `projects/000-global/`, `find` exited non-zero, `2>/dev/null` hid the reason, and `set -euo pipefail` killed the script at the assignment — three lines before the error that would have said `Run: /arckit:principles`. It exited 1 with zero bytes on both streams, in exactly the case that most needs the guidance. Fixed in both copies (#684).

- **Three dangling command references** that nothing validated: `/arckit:hld` and `/arckit:dld` (uk-nhs-dtac) and `/arckit:app-inventory` (togaf application-rationalization). No commands by those names have ever existed. `check_references.py` checks plugin-root paths and handoffs, not whether a referenced command exists (#685).

- **The `/arckit:repo-audit` guide was unreachable from the published site.** It shipped in v6.7.0 and reached both guide trees, but nothing linked to it, so it could only be found by guessing its `guide-viewer.html` URL. Added to `docs/guides.html` and `docs/manifest.json`, with reciprocal cross-references between `repo-docs` and `repo-audit`, which had only ever pointed one way (#681).

### Added

- **`scripts/check-guide-site-links.py`**, wired into `lint-markdown.yml`. `docs/guides.html` and `docs/roles.html` are hand-maintained and nothing derived them from `docs/guides/`, so a guide could pass `check-guide-parity.py`, ship to all seven extensions, and still be invisible on the site. Checks both directions — unlinked guides and dead links — and treats a guide as reachable from any site page, so role guides on `roles.html` are covered without a blanket exemption that would hide one going missing (#682).

- **`scripts/generate-docs-manifest.py`**, wired into `lint-markdown.yml`. `docs/manifest.json` is published at `arckit.org/manifest.json` as a programmatic document index, and nothing in the site HTML reads it, so its drift went unnoticed: six months stale and roughly a quarter complete (54 of 238 guides, 45 of 166 templates, 2 of 62 articles), with one entry pointing at a deleted file. Now generated from disk — 463 documents across 33 groups — indexing **git-tracked files only**, so gitignored working-tree files are never advertised as published (#683).

### Changed

- `docs/manifest.json` is now generated, never hand-edited. Run `python3 scripts/generate-docs-manifest.py --write` after adding a guide, template, or article. `--check` ignores the `generated` timestamp so a rebuild on a quiet day is not reported as drift.

## [6.7.0] — 2026-07-27

### Added

- **`/arckit:repo-audit`** in the optional `arckit-repo` plugin (#616). Audits a codebase against architecture principles and requirements. Accepts the current repository, a local path, or a public GitHub/GitLab URL; remote targets are shallow-cloned (`--depth 100`, no submodules) to a temporary directory after confirmation, and deleted afterwards. Two modes are inferred, never flagged: **conformance** scores the codebase against the project's `PRIN`/`REQ` artefacts, giving each principle and requirement a Met / Partial / Not met / Not evidenced verdict with the source path that justifies it; **cold** runs a standalone as-built audit and emits a seed capability list. Unlike `/arckit:conformance` it degrades rather than hard-erroring when prerequisites are thin, because auditing an inherited codebase is usually the first thing a user does. Findings carry a severity *and* a confidence (Verified / Inferred / Absent), and the Blocking Decisions section emits every implied-but-unrecorded decision as a ready-to-file ADR stub. Three rules are absolute: never execute code from the audited repository (static reading only, because the code is untrusted at the point it is read), never write a discovered secret's value into the report, and never write into the audited repo. Private repositories are out of scope; clone locally and audit the path. Claude Code only, like `/arckit:repo-docs`.
- **`CDAU` doc-type** (Codebase Audit, Governance, multi-instance) writing to a new `projects/{PID}-{name}/audits/` subdirectory, so one project can audit several repositories and a re-audit does not overwrite its predecessor.
- **`scripts/check-multi-instance-parity.py`**, wired into `lint-markdown.yml`. `MULTI_INSTANCE_TYPES` is duplicated across `doc-types.mjs` and *two* copies of `generate-document-id.sh`, and nothing enforced agreement.

### Fixed

- **`GRNT` was missing from both bash `MULTI_INSTANCE_TYPES` lists**, so `/arckit:grants` generated IDs with no `-NNN-` sequence and every run overwrote the previous artefact. This is the second occurrence of this exact bug (`TNDR`/`CMPT`, fixed v5.9.2 in PR #566); the CI guard proposed at the time was never built, and now is. The header comment in `doc-types.mjs` claiming the bash list held "10 entries" was long stale and is rewritten.
- **`arckit-repo` declared `"dependencies": []`** while its README and marketplace description both stated "Requires arckit core". Every other community plugin declares `{"name": "arckit", "version": "=6.6.0"}`. Beyond the marketplace install chain, the missing declaration meant `check_references.py` could not resolve `${user_config.*}` keys from core.

### Changed

- **`arckit-repo` is no longer exempt from the shared-asset sync.** `SYNC_EXEMPT_PLUGINS` listed it as a tooling plugin with no governance commands, which was true of `/arckit:repo-docs` and is not true of `/arckit:repo-audit`: a `CDAU` artefact carries a Document Control header that resolves `${CLAUDE_PLUGIN_ROOT}/templates/_partials/` against the plugin's own root, so it must carry its own copy.
- `tests/plugin/test_template_consistency.py` now includes `arckit-repo` in its plugin scan, for the same reason.

## [6.6.0] — 2026-07-27

### Changed

- **Minimum Claude Code version raised to v2.1.219** (from v2.1.200) for **Claude Opus 5** support. v2.1.219 added `claude-opus-5` as the default Opus model, with 1M context and fast mode; earlier clients cannot select it. The floor carries forward every prior driver (project-scoped plugin loading from git worktrees and `claude agents --plugin-dir` visibility from v2.1.200, background-subagent reliability from v2.1.198-v2.1.199, the wildcard-domain `WebFetch` fix from v2.1.172, and older MCP/hook/telemetry unlocks). Updated across `version-check.mjs` (constant, per-feature warning bullet, header threshold list), both READMEs, `CLAUDE.md`, 13 guides, the enterprise-scale managed-settings examples and changelog table, the repo dogfood `.claude/settings.json`, and the test-repo scaffold template.

### Added

- **Guide-tree parity check** (`scripts/check-guide-parity.py`, wired into `lint-markdown.yml`). ArcKit keeps user guides in two trees — `docs/guides/` (the published site and CLI package data) and `plugins/arckit-claude/docs/guides/` (what the converter pushes into all seven extensions) — and nothing kept them in step. `sync-shared-assets.py` covers `templates/_partials/` and `references/` but has never touched `docs/guides`. The check enforces byte-identical parity for every guide present in both trees, allows root-only guides (community-overlay and maintainer docs deliberately don't ship to extensions), and rejects plugin-only guides, which can never reach the site or the CLI package. `--sync` copies root to plugin and only ever writes to the plugin tree.
- **Recipe wave-width and cycle checks** (`scripts/check_recipes.py`). The validator now computes the topological wave plan for every recipe and fails when a wave exceeds Claude Code's concurrent-subagent cap (20), warns within 4 of it, and detects dependency cycles that previously surfaced only at runtime as an empty wave. Baseline: widest shipped wave is 16 of 20.
- **`/arckit:build` wave splitting.** The orchestrator now splits any wave wider than 20 at dispatch time rather than assuming the recipe is well-formed — user-authored recipes under `.arckit/recipes/` never pass through CI. A split wave still produces one commit.

### Fixed

- **Plugin-tree guide drift.** `plugins/arckit-claude/docs/guides/mcp-servers.md` was missing the "Optional: MCP per-request timeout" section that four `*-research.md` guides in the same tree link to, leaving a dead anchor; `security-hooks.md` was missing "Restricting web access for research agents" entirely, so the plugin tree shipped no domain-restriction guidance. Both sections backfilled; the two trees now share a heading structure.
- **Cross-reference linter false positive on guide code blocks.** `check_references.py` resolved `${CLAUDE_PLUGIN_ROOT}` references found inside fenced code blocks in `docs/guides/**`. A guide that teaches users to write their own command necessarily *displays* command source, and that sample source references files the reader has not created yet — `custom-commands.md` walks through building an `/arckit:sla` command and tells the reader to create `sla-template.md` as a later step. The linter now blanks fenced blocks (handling nested and variable-length fences, preserving line numbers) for guides only; command, agent, and skill bodies keep full checking including code blocks, because a reference there is real wherever it appears. Surfaced by the new guide-parity sync, which propagated the root copy into the plugin tree where the linter runs.
- **Guide-tree drift resolved across 10 files.** Drift ran in *both* directions, so this was a merge rather than a one-way copy:
  - Root was correct and the plugin copy stale in 7: `autoresearch.md` (missing the entire Stopping Conditions and Self-Harness sections), `mcp-servers.md` (hardcoded "75 slash commands" and "Skills: 1"), `security-hooks.md` / `c4-layout-science.md` / `custom-commands.md` (pre-v6 `arckit-claude/` paths that no longer exist, since plugins moved under `plugins/`), `roles/README.md` and `roles/enterprise-architect.md` (hardcoded "70 commands").
  - The plugin copy was correct and root stale in 3: `pages.md` and `template-builder.md` (both still pointed at a category map in `hooks/sync-guides.mjs`; the real source is `config/guide-groups.mjs`, which `sync-guides.mjs` imports from), and `roles/service-owner.md`, where root documented the service-assessment artefact as `ARC-{PID}-SASS-v*.md` — the registered doc-type code is `SVCASS`, so readers were told to look for a file the command never writes.
- **`CLAUDE.md` step 3 for adding a command pointed at `plugins/arckit-claude/guides/`, a directory that does not exist** (the real path is `plugins/arckit-claude/docs/guides/`). This was the root cause of the drift: the documented workflow sent guide authors somewhere invalid, so the plugin copy was routinely skipped. Step 3 now names the sync command, and a new "Guide Trees" section documents the canonical direction.
- `mcp-servers.md` troubleshooting told users to run `echo $GOOGLE_API_KEY`, printing a live credential to the terminal in a guide that elsewhere highlights key redaction for OFFICIAL-SENSITIVE deployments. Replaced with a presence check that does not echo the value.

### Documentation

- **Claude Code v2.1.201–v2.1.220 adoption** (#580). Refreshed guidance against the current platform:
  - `agents/READER-PATTERN.md` asserted that "subagents cannot spawn other subagents" — true when written, false since nested `Agent` dispatch returned. Rewrote the rationale: the orchestrators stay on the main thread by **choice**, not platform limitation, because the nesting default moved three times in three months (depth 5 in v2.1.172, disabled in v2.1.217, depth 3 in v2.1.219) and any user can disable it with `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH=1`, which would break a re-homed orchestrator outright rather than degrade it.
  - `CLAUDE.md` model guidance: Opus 5 is the default Opus model; effort support now covers Opus 5 / Sonnet 5 / Fable 5; fast mode applies to Opus 5 and Opus 4.8 only, with Opus 4.7 fast mode removed on 2026-07-24 (Claude Code still treats 4.7 as fast-mode-capable while the API rejects the requests, so it fails silently rather than degrading). Rates corrected to the documented $10/$50 per MTok. Verified against the official model-config and fast-mode docs.
  - `mcp-servers.md`: MCP calls auto-background after 2 minutes (`CLAUDE_CODE_MCP_AUTO_BACKGROUND_MS`, v2.1.212) and how that interacts with a raised `MCP_TOOL_TIMEOUT`; per-server `request_timeout_ms` is honoured again (v2.1.206); failed servers now report HTTP status and error text (v2.1.218).
  - `enterprise-scale.md`: `sandbox.network.strictAllowlist` (v2.1.219) and `sandbox.filesystem.disabled` (v2.1.216) in the security baseline; plugin option values must be set at user or managed scope, since v2.1.207 stopped reading `pluginConfigs` from a repository's `.claude/settings.json`.
  - `security-hooks.md`: sandboxed commands reach the network independently of `WebFetch` rules, and `strictAllowlist` closes that gap.
  - `research.md` / `autoresearch.md`: the session-wide 200-call WebSearch budget and 200/20 subagent budgets (v2.1.212, v2.1.217), which a search-heavy run or a long optimisation loop can exhaust.
- **`build.md` session limits** (#580). Documents the concurrent-subagent (20), per-session subagent (200), and per-session WebSearch (200) caps, and — the point the spike settled — that **all three deny rather than queue**. Verified against the Claude Code v2.1.220 binary: an over-cap spawn throws "Concurrent subagent limit reached ... Do not retry" per excess call. Because the harness is halt-on-fail, an over-wide wave fails rather than running slower. Records the current margin (widest shipped wave 16 of 20, largest total spawn 49 of 200) and notes the ultracode bypass exists but must not be relied on.

## [6.5.0] — 2026-07-27

### Added

- **Kimi Code CLI hooks.** The `arckit-kimi` plugin manifest now wires 16 governance and security hooks (session context injection, prompt and file secret detection, file protection, ARC filename validation, score and Wardley-math validation, provenance stamping, manifest updates, stale-artifact notices, session learner, post-compact rehydrate, and telemetry) through a new `hooks/kimi-hook-adapter.mjs`. The adapter runs each unmodified Claude hook as a child and re-expresses its Claude-shaped output in Kimi's contract (context to stdout on exit 0, blocks to exit 2), so the battle-tested Claude hooks stay byte-for-byte unchanged. Path-scoped hooks carry an adapter-level guard that stands in for Claude's `if:` conditions, which Kimi's flat hook schema cannot express. The translation logic is unit-tested in isolation; the end-to-end wiring is not yet smoke-tested against a live Kimi runtime.
- **Kimi manifest metadata.** `kimi.plugin.json` now carries `author`, `homepage`, `repository`, `license`, `keywords`, and a fuller `interface` block (`longDescription`, `developerName`, `websiteURL`) for the `/plugins` browser.

### Fixed

- **Build Provenance model-id parsing** (#664). `extractModelFromContent` rejected model ids containing a provider prefix or a bracketed context-window suffix (e.g. `claude-opus-4-8[1m]`, bedrock-style `us.anthropic.claude-*`), silently dropping the model from the stamp. Widened the id character class and extracted the pure model/effort helpers into a testable `provenance-model.mjs`.
- Softened the converter's `generate_kimi_plugin_json` note that asserted Kimi supports `headers` on remote MCP servers. Kimi's published schema documents only `url`, so the two keyed servers (`google-developer-knowledge`, `datacommons-mcp`) may not authenticate under Kimi until confirmed on a live instance.
- **Build Provenance effort matrix corrected** (#669). The effort helper ranked `xhigh` above `max`, inverting the official Claude Code ordering (`max` is the deepest tier), and used a single per-model cap that could not represent Opus 4.6 / Sonnet 4.6, which support `max` but not `xhigh`. The stamp therefore recorded the wrong "Effective Effort" for those models: `xhigh` was reported as downgraded to `max`, where the harness actually falls back to `high`. Replaced the single cap with per-model supported sets, fixed the level ordering, and dropped the incorrect Haiku 4.5 entry (Haiku does not support effort). Verified against the official model-config docs (`code.claude.com/docs`).
- Corrected a non-existent `moonshotai/kimi-v3` example id to `kimi-k3` in the provenance model helper (#670).

## [6.4.0] — 2026-07-25

### Added

- **Kimi Code CLI extension** (`arckit-kimi`) — ninth distribution format. Every ArcKit command ships as a Kimi Agent Skill invoked with `/skill:arckit-<command>`, with the six bundled MCP servers declared in `kimi.plugin.json` and `architecture-workflow` auto-loaded at session start. Install by starting `kimi` and running `/plugins install https://github.com/tractorjuice/arckit-kimi.git` at the prompt; scaffold a project with `arckit init --ai kimi`.

### Fixed

- The converter now strips Claude-only `paths:` frontmatter from reference skills it copies into the Mistral Vibe and Kimi Code CLI extensions, matching the stripping already applied elsewhere; the field is meaningless (and previously left dangling) in both non-Claude formats.
- A command reference at the end of a sentence, e.g. `/arckit:stakeholders.`, no longer has the sentence-final full stop swallowed into the command name (which previously rendered `$arckit-stakeholders-` in the Codex extension, and the equivalent in Kimi). The converter's command-name capture now stops at a word boundary; internal dots and hyphens (`wardley.climate`, `security-assessment`) are preserved (#666).

## [6.3.0] — 2026-07-16

### Added

- **arckit-uk-nhs**: DUAA 2025 coverage, hazard-archetype checklist, re-review triggers, and statutory-anchor correction (#646).

### Changed

- Corrected two false claims about the bundled MCP servers in the documentation (#653).

## [6.2.0] — 2026-07-13

### Added

- **Repository plugin.** Added the optional `arckit-repo` plugin, starting with
  `/arckit:repo-docs` to generate and maintain source-grounded, agent-readable
  repository documentation under `docs/repository/`, adapting OpenWiki-style
  targeted discovery and incremental update prompts for ArcKit. It is a
  Claude Code only tooling plugin with no core dependency, following the
  `arckit-fde` shape: it ships via the marketplace but is not converted into
  the non-Claude extensions (#651).

### Changed

- **Reactive external-document context (#580, #644).** Added Claude Code
  `FileChanged` hook coverage for `projects/*/external/` directories so newly
  added or changed evidence is injected into session context without waiting
  for a restart, `/compact`, or another `/arckit:` command.
- **Claude Code minimum-version floor raised to v2.1.200 (#642).** Updated the
  runtime version check, repo/test-repo settings, and docs to require the
  latest v2.1.200 floor for project-scoped plugin loading from git worktrees,
  `claude agents --plugin-dir` agent/skill visibility, and the recent
  background-subagent reliability and hook diagnostics fixes tracked in #580.
- **Claude Code v2.1.200 documentation backlog (#580, #643, #645).** Added
  managed model governance, OTEL assistant-response, MCP auth, safe-mode
  troubleshooting, plugin branch-testing, and ArcKit skill-layout guidance,
  plus a Claude enterprise deployment guide; refreshed stale Claude model
  examples for Sonnet 5-era defaults.
- **DeepBook guide marked proprietary (#651).** `arckit-deepbook` is
  proprietary software in a private repository and is not part of the
  open-source ArcKit distribution. Its guide now carries a Licence and
  Availability section stating that it is not installable from the public
  marketplace and that no rights are granted without written consent.
  Generated books remain the property of whoever generated them.

### Fixed

- **User-config title validation guard (#639).** Added a test asserting every
  plugin `userConfig` entry declares a `title`, so a missing field fails in CI
  instead of breaking `claude plugin validate` and marketplace installs.
- **Removed DeepBook generated content from the public repository (#650).**
  Book drafts, run checkpoints, and a symlink to an absolute path outside the
  repository had been committed. They are untracked and ignored. The ignore
  rule for the symlink had a trailing slash, which does not match a symlink —
  corrected, so the path can no longer be re-added. This also restored a
  green `Lint Markdown` build, which the generated book content had been
  failing.

## [6.1.7] — 2026-07-03

### Fixed

- **Generated extension publishing guard (#638).** Added release preflight
  checks so standalone extension publishing fails before touching remote repos
  when required generated distribution files are missing.

### Changed

- **NHS DCB0129 numbering caveat (#641).** Corrected the clinical-safety
  severity/likelihood caveat so it attributes the `1 = worst` ordinals to
  ArcKit's storage encoding rather than to DCB0129/0160 or the Orange Book.

## [6.1.6] — 2026-07-03

### Fixed

- **Pages overlay guide ordering (#636).** Ordered overlay packs as
  global/framework packs first, followed by country and regional packs in a
  consistent sequence so generated Pages guide indexes are easier to scan.

## [6.1.5] — 2026-07-03

### Fixed

- **Claude plugin manifest validation.** Added the required `title` field to
  the TOGAF ADM and Agent Architecture `default_classification` user-config
  entries so `claude plugin validate` and marketplace installs succeed.

## [6.1.4] — 2026-07-03

### Fixed

- **Pages guide grouping (#633).** Centralized guide section/category metadata
  so plugin operations, overlay packs, community guides, and uncategorised
  items render in predictable Pages guide sections instead of collapsing into
  the generic `Other` bucket.
- **Standalone overlay reference validation.** Updated reference checks and
  shared plugin assets so nested Claude overlay docs resolve bundled and core
  plugin references correctly.

## [6.1.3] — 2026-07-02

### Fixed

- **Codex Pages namespaced invocation (#631).** Updated the Codex pages hooks
  so `$arckit-codex:arckit-pages` receives the same sync-guides statistics as
  `$arckit-pages`, allowing the command to complete without reading generated
  files directly.

## [6.1.2] — 2026-07-02

### Fixed

- **Codex Pages fresh-repo handling (#629).** Updated the generated Codex
  pages command, prompt, and skill to rely on the `sync-guides` hook for
  template and version resolution so `$arckit-pages` no longer requires a
  preinstalled `.arckit` scaffold in a fresh repository.

### Changed

- **Documentation site coverage.** Completed command guide coverage across the
  ArcKit docs and published the TOGAF ADM and agent architecture guide pages.

## [6.1.0] — 2026-06-30

### Added

- **TOGAF ADM and agent architecture overlays.** Added the community
  `arckit-togaf-adm` and `arckit-agent-architecture` plugins, plus the
  supporting doc types, templates, recipes, release wiring, and contributors
  page coverage.

## [6.0.0] — 2026-06-30

### Added

- **Single Claude Code marketplace repo.** Added release tooling and metadata
  so `tractorjuice/arckit-claude` publishes the core plugin plus regional,
  sector, tooling, and supplier overlays from one structured repo.

### Changed

- **Claude marketplace install path.** Updated user-facing documentation,
  test-repo templates, and release guidance to prefer
  `tractorjuice/arckit-claude` for Claude Code installs.

## [5.15.2] — 2026-06-30

### Fixed

- **Discord invite links (#623).** Updated Discord invite links across the
  documentation site.

### Changed

- **Health output documentation (#620).** Clarified that `/arckit:health`
  writes `docs/health.json` as part of its normal reporting flow.
- **Documentation site updates.** Added the ArcKit usage thank-you article and
  GA4 site tag.

## [5.15.1] — 2026-06-29

### Added

- **OpenCode extension metadata.** Added a description to the standalone
  `arckit-opencode` extension manifest.

### Fixed

- **Codex hook runner resolution (#619).** Codex lifecycle hooks now resolve the
  hook runner from `CODEX_PLUGIN_ROOT` or the installed plugin cache instead of
  assuming Codex was started from the extension directory. The converter and
  Codex tests now guard both bundled plugin hooks and generated standalone
  config hooks against cwd-dependent runner paths.
- **Self-Harness utility hardening (#617).** Hardened the Self-Harness support
  utilities added in v5.15.0.
- **Standalone extension release tags (#607).** Fixed extension release
  publishing so standalone extension repos receive release tags consistently.
- **Documentation site rendering.** Corrected SVG font-family syntax in the new
  ArcKit Architects hero image.

### Changed

- **Documentation and article index updates.** Added the ArcKit Architects, OKF,
  and Self-Harness articles, moved ArcKit Architects to the first article slot,
  refreshed article indexes, `llms.txt`, sitemap metadata, getting-started
  assistant coverage, and community footer links.
- **Extension validation coverage (#608).** Added full extension suites to keep
  generated targets aligned with the converter.

## [5.15.0] — 2026-06-19

### Added

- **Self-Harness autoresearch implementation.** Added a Self-Harness enhanced
  autoresearch program based on arXiv:2606.09498v1, plus tracer, weakness-miner,
  harness-proposer, and harness-validator utilities for iterative harness
  improvement.
- **Open Knowledge Format interoperability.** Added `/arckit:export-okf` and
  `/arckit:import-okf` plus shared OKF frontmatter helpers. Export writes copied
  OKF-compatible Markdown bundles without mutating source ARC files. Import scans
  OKF Markdown, writes `.arckit/tmp/okf-import-report.json`, and materializes
  valid non-duplicate entries as `RSCH` review notes by default.
- **Optional OKF source frontmatter stamping.** `provenance-stamp.mjs` can now
  merge OKF metadata into native ARC artifacts when explicitly enabled with
  `ARCKIT_OKF_FRONTMATTER=1` or `.arckit/config.json` containing
  `{ "okfFrontmatter": true }`. Stamping is off by default and idempotent.

### Changed

- **OKF documentation coverage.** Updated remaining extension READMEs, getting
  started docs, guide index, remote-control docs, MCP setup docs, and copied
  dependency matrices so all current documentation surfaces mention the OKF
  import/export workflow consistently.

## [5.14.0] — 2026-06-17

### Added

- **Mistral Vibe CLI extension support (#598).** ArcKit now ships a Vibe
  extension with converted ArcKit skills, Vibe agent TOML, bundled templates,
  scripts, schemas, references, and MCP configuration. The generated payload is
  published to the standalone
  [`tractorjuice/arckit-vibe`](https://github.com/tractorjuice/arckit-vibe)
  repository, matching the existing separate Codex, Gemini, OpenCode, Copilot,
  and Paperclip extension repo model.

## [5.13.2] — 2026-06-17

### Fixed

- **STALE-EXT scans `external/` recursively (#595).** `/arckit:health` now
  includes files nested under project `external/` subdirectories and reports
  their relative paths, instead of only checking direct children. Claude, Codex,
  and Gemini session/context external-document listings use the same recursive
  scan.
- **Documentation site search metadata improved.** The generated site now ships
  refreshed SEO metadata, cache headers, sitemap entries, and the AI CLI harness
  article so search and social previews index the current documentation.
- **External context supports subtitle/transcript files (#600).** Project
  `external/` guidance, scaffolding, and project context handling now include
  `.srt` and `.vtt` transcript files alongside PDFs, Word documents, Markdown,
  images, CSV, and SQL references.
- **Manifest auto-update tolerates legacy entries without `documentId` (#601).**
  `hooks/update-manifest.mjs` now deduplicates existing manifest entries by
  `documentId` when present and falls back to the entry path basename when
  older `docs/manifest.json` rows omit `documentId`, avoiding non-blocking
  PostToolUse warnings after `/arckit:principles` writes global artifacts.

## [5.13.1] — 2026-06-11

### Changed

- **Claude Code minimum-version floor raised v2.1.156 → v2.1.172.** v2.1.172 fixed wildcard-domain `WebFetch` permission rules (`WebFetch(domain:*.gov.uk)`) that never matched subdomains on earlier clients — the exact shape ArcKit's security-hooks guide recommends for confining research-agent traffic in OFFICIAL-SENSITIVE deployments, so the floor makes that shipped guidance actually hold. v2.1.172 also carries the Claude Fable 5 runtime (GA in v2.1.170); ArcKit defaults to the latest model tier. Updated every floor reference: `version-check.mjs` (`MIN_CLAUDE_CODE_VERSION` + warning bullets), `CLAUDE.md`, `README.md`, `docs/guides/enterprise-scale.md` (`requiredMinimumVersion` example), `hooks/README.md`, and the repo/test-repo `.claude/settings.json` `minimumVersion` (#593).

## [5.13.0] — 2026-06-10

### Added

- **arckit-uk-gcloud** (13th marketplace plugin) — Proprietary, Claude-Code-only supplier-side G-Cloud bid-authoring overlay: 11 commands (supplier-profile, service-design, sdd-lot1/2/3, declaration, pricing, security, gcloud-competitors, review, submission-pack), 8 doc-types (SUPP/SVCD/SDD/DECL/PRIC/SECA/GCMP/GCRV), 3 skills (gcloud-framework, cloud-security, sfia-skills), and the uk-gcloud-submission build recipe. Requires arckit core. Ported from the standalone gcloud-kit plugin. Not distributed to the non-Claude extension formats (proprietary).

## [5.12.1] — 2026-06-10

### Fixed

- **Secret scanner no longer false-positives on code/IaC references to secrets**
  (#590). The generic key-value rules in `secret-file-scanner.mjs` and
  `secret-detection.mjs` matched any non-whitespace value, so legitimate
  assignments that *reference* a secret rather than hardcoding it —
  `secret = module.sm.secret_ids["x"]` (Terraform), `password = var.db_password`,
  `api_key = process.env.API_KEY`, Pulumi `config.requireSecret(...)`, Kubernetes
  `secretKeyRef.name`, CDK `Token.fromAsset(...)` — were blocked. A structural
  reference guard now exempts values that are an identifier followed by a property
  access, index, or call, or a `${...}`/`$(...)` interpolation. Literal/unquoted
  secrets and provider token formats (`sk-`, `ghp_`, `AIza`, PEM, …) are still
  caught. The two hooks' pattern libraries were realigned to be byte-identical and
  are now covered by `tests/plugin/scanner-reference-guard.test.mjs`, which also
  guards against future drift between them.

## [5.12.0] — 2026-06-09

### Added

- **`arckit-fde` plugin (12th marketplace plugin)** — a lean, Claude Code only ArcKit
  plugin with one command, `/arckit-fde:create`, that interviews the user and renders a
  brandable, GitHub-Pages-ready Forward Deploy Engineering consulting website into `docs/`.
  Clone-and-substitute templates (scalar `{{TOKEN}}`s plus `<!-- BEGIN/END -->` list
  regions; brand colour via a single `:root` CSS custom property), `uk-public-sector` and
  `generic` market presets, a saved `fde-site.config.yaml` for repeatable re-renders, and
  discovery metadata (`llms.txt`, `sitemap.xml`, `robots.txt`, `.nojekyll`). Not wired into
  the converter (Claude-only), no governance doc-types, no dependencies. Includes a
  `scripts/tests/test-fde-templates.mjs` consistency guard and a launch article. The
  officially-maintained command baseline is unchanged; `/arckit-fde:create` is a tooling
  command.

## [5.11.2] — 2026-06-08

### Changed

- **Generated non-Claude extension dirs moved under `extensions/`.** The five converter-output dirs (`arckit-codex`, `arckit-opencode`, `arckit-copilot`, `arckit-gemini`, `arckit-paperclip`) now live under `extensions/` instead of the repo root, decluttering the top level and mirroring the `plugins/` grouping used for Claude Code plugin sources. The dirs remain gitignored generated content (only hand-authored files per extension are tracked); `arckit-claude` is still the single source of truth — run `python scripts/converter.py` after pulling. Build tooling (`scripts/converter.py`, `scripts/bump-version.sh`, `scripts/push-extensions.sh`), packaging (`pyproject.toml` shared-data, CLI data-path resolution — installed wheel layout now `share/arckit/extensions/<ext>`), CI, tests and docs were updated accordingly. Published-extension repos and install commands are unchanged.

## [5.11.1] — 2026-06-07

Maintenance release — repository restructure and hygiene only. **Plugin content is unchanged**; installation and usage are identical to 5.11.0.

### Changed

- **Plugin sources moved under `plugins/`** (#585). All 11 Claude Code plugin source directories (`arckit-claude` + 10 community overlays) now live under `plugins/` (e.g. `plugins/arckit-claude/`); `marketplace.json` points each entry at `./plugins/<name>`. The generated, gitignored non-Claude extension dirs stay at the repo root. Release tooling, CI, tests and docs were updated accordingly.
- **Generated distribution formats are no longer tracked** (#581). The five non-Claude extension dirs (`arckit-codex`, `arckit-opencode`, `arckit-copilot`, `arckit-gemini`, `arckit-paperclip`) are regenerated by `scripts/converter.py` and published to their own repos by `scripts/push-extensions.sh`, so their ~2,600 generated files are now gitignored rather than committed. `arckit-claude` is the single source of truth — run `python scripts/converter.py` after pulling.
- Gitignored the `docs/superpowers/` dev-workflow process artefacts (#583); noted that `tools/wardley-lsp/` now lives in its own repository (#582).

### Removed

- **`docs/proposals/`** confidential partnership material removed from the public repo and gitignored (#584).

## [5.11.0] — 2026-06-05

### Added

- **End-of-turn traceability nudge** (#578). The `Stop` hook (`session-learner.mjs`) now emits one gentle, non-blocking next-step suggestion via `hookSpecificOutput.additionalContext` when a session's commits leave a curated traceability-chain gap — `REQ`→no `TRAC` (`/arckit:traceability`), `STKE`→no `REQ` (`/arckit:requirements`), `REQ`→no `DATA` (`/arckit:data-model`), `ADR`→no `DIAG` (`/arckit:diagram`). It reacts to the just-finished turn, distinct from the SessionStart stale-artifact monitor and `/arckit:navigator`/`health`. Version-gated to Claude Code v2.1.163+ (older clients treat a `Stop` `additionalContext` as a hook error): `version-check.mjs` persists the detected client version to `.arckit/memory/.cc-version` at SessionStart and the nudge stays silent below the gate, on `StopFailure`, or when `ARCKIT_NO_NUDGE` is set. The decision logic is the pure, unit-tested `selectNudge` in `session-nudge.mjs`.
- **Per-agent telemetry attribution** (#579). `telemetry.mjs` stamps `agent_id`/`agent_type` (Claude Code v2.1.145+) onto latency and MCP records when a tool runs inside a subagent, so the session summary and `docs/telemetry.json` now break tool activity down **by agent** (e.g. `arckit-research` vs the main thread). New pure `telemetry-rollup.mjs` (`summariseTelemetry`/`rollupTelemetry`) adds a `byAgent` breakdown and the `/arckit:pages` "Recent Sessions" panel surfaces the busiest subagent. `parent_agent_id` is not exposed to hooks, so activity is attributed per agent rather than reconstructing the dispatch tree.
- **`minimumVersion` floor guidance** (#575). The below-floor `version-check.mjs` warning now recommends adding `"minimumVersion"` to `.claude/settings.json` so background auto-updates / `claude update` cannot drift below ArcKit's Claude Code floor — distinct from the org-only managed `requiredMinimumVersion`. Dogfooded in this repo and the test-repo scaffold.

### Changed

- **Documentation — Claude Code v2.1.161–v2.1.163 adoption** (#576). New "Fleet & Version Governance (managed settings)" section in the enterprise-scale guide (`requiredMinimumVersion`/`requiredMaximumVersion`, `pluginSuggestionMarketplaces`, `OTEL_RESOURCE_ATTRIBUTES`); the MCP guide notes the sub-1000 ms per-server `timeout` floor and that `claude mcp` now redacts secrets; the autoresearch guide documents `--fallback-model`; the security-hooks guide documents scoping research-agent `WebFetch` to approved domains; the custom-commands guide documents the `\$` literal-dollar escape; `/plugin list --enabled` noted in the install guide.
- **Documentation — effort-tier accuracy** (#577). Corrected the `effort:` frontmatter description: `max` is supported on Opus 4.6/4.7/4.8 and `xhigh` is the tier Opus 4.7/4.8 add. Verified ArcKit's `effort: max` commands run as `max` on Opus 4.8 (no code change needed).

## [5.10.0] — 2026-06-04

### Added

- **AU Federal visual-evidence enrichment** (derived from #569). The `arckit-au` Federal commands and templates now compose with ArcKit's existing architecture and evidence tooling — `/arckit:diagram`, `/arckit:dfd`, `/arckit:data-model`, `/arckit:servicenow`, `/arckit:risk`, `/arckit:traceability`, `/arckit:graph-report` and `/arckit:maturity-model` — via embedded enrichment handoffs and an "ArcKit Architecture Evidence Map" section in each command. A standard **Visual Evidence Decision Rule** is applied across all ten Federal templates: generate companion visuals only when the evidence has enough structure for real nodes and relationships; generate a clearly marked draft visual with `Pending Input` labels when evidence is partial but structurally useful; otherwise record a **Visual Evidence Gap** and list the minimum inputs needed. The guidance stays cross-sector (SOCI/OT is not made energy-specific). The `au-federal` recipe gains default visual/evidence targets (DIAG, DFD, ServiceNow, maturity, traceability) and a `graph-report` post-build hook, plus synthetic eval fixtures for the complete / partial / sparse evidence scenarios.
- **`MMOD` (Maturity Model Assessment) doc-type registered.** The core `/arckit:maturity-model` command has always emitted `ARC-*-MMOD-*` document IDs, but `MMOD` was never registered in `config/doc-types.mjs` or the `/arckit:pages` allow-list, so maturity artefacts were not recognised by graph-inject or the documentation site. Registered as a regime-neutral `Governance` type (severity `HIGH`, matching sibling governance types such as `RISK` and `TRAC`).

### Fixed

- **`findRepoRoot` no longer mis-detects an unrelated `projects/` directory as the repo root** (#572). Hooks now treat a `projects/` directory as the ArcKit repo root only when it contains a numbered project entry (`NNN` / `NNN-…`, e.g. `000-global`), so an empty or unrelated `projects/` higher up the tree is ignored. Also normalises Windows path separators in `allow-plugin-internals` so the plugin-internals allowlist works on Windows. Adds a dedicated `findRepoRoot` unit test, wired into CI.

### Changed

- **All command cross-references standardised on the colon namespace `/arckit:<command>`** (~5,600 references across ~600 files). This matches the official Claude Code plugin invocation syntax (plugin skills use a `plugin-name:skill-name` namespace) and replaces the previous mixed convention where templates, guides, the README, scripts and several overlays used the non-runnable dot form `/arckit.<command>`. Wardley sub-commands correctly keep the dot before the sub-command (`/arckit:wardley.gameplay`). File paths and the Codex/OpenCode `arckit.<name>.md` filenames are unaffected; Codex (`$arckit-<command>`) and Copilot (`/arckit-<command>`) per-target forms are unchanged. `CLAUDE.md`, `AGENTS.md` and `CONTRIBUTING.md` are corrected (they had wrongly documented Claude and OpenCode as using the dot form). A CI guard (`scripts/standardise-colon.py --check`) now fails the build if a dot-form reference is reintroduced. Historical CHANGELOG entries and published articles are intentionally left as written.

## [5.9.2] — 2026-06-03

### Fixed

- **`CMPT` and `TNDR` now sequence correctly in `generate-document-id.sh`** (#566). The bundled helper hardcoded `MULTI_INSTANCE_TYPES` without `CMPT` or `TNDR` (both added in 5.9.0), so `/arckit:competitors` and `/arckit:tenders` received document IDs with **no sequence number** (e.g. `ARC-001-CMPT-v1.0`) and collided on every run. The plugin copy (`arckit-claude/scripts/bash/`) — the one the plugin cache actually executes — had drifted from the already-fixed CLI copy (`scripts/bash/`), despite the script's own "keep in sync with `doc-types.mjs`" comment. Added `TNDR CMPT` after `DSCT` to match `config/doc-types.mjs MULTI_INSTANCE_TYPES` and regenerated the codex / copilot / opencode / gemini copies via the converter.

### Changed

- **Writer-subagent writes pre-authorised in the dev repo** (#566). The five writer subagents (`competitors` / `tenders` / `gov-reuse` / `datascout` / `grants`) hold `Write`/`Edit` but run non-interactively, so a gated `Write` is auto-denied — a subagent cannot surface an approval prompt. Added scoped `Write(//workspaces/arc-kit/projects/**)` + `Edit(...)` rules to `.claude/settings.json`. Least-privilege: the writers have no web/MCP tools and the orchestrator schema-validates payloads before they run, so this only authorises the boundary the reader/writer split already enforces.

## [5.9.1] — 2026-06-03

### Fixed

- **All MCP-backed subagents can now reach their plugin MCP servers** (#564, #565). `/arckit:tenders` and `/arckit:competitors` (#564), and then every other MCP-backed agent (#565), were falling through to empty/degraded paths because their reader/research subagents could not call the bundled MCP servers. Two root causes, both required, confirmed against the Claude Code docs:
  - **Tool-name prefix.** Plugin-bundled MCP tools surface at runtime as `mcp__plugin_arckit_<server>__<tool>`, but the agents' `tools:` allowlists used the bare `mcp__<server>__` form, which matches nothing in a subagent allowlist. Prefixed the tool names in 8 agents: `arckit-tenders-reader` (#564) plus `arckit-aws-research`, `arckit-azure-research`, `arckit-gcp-research`, `arckit-gov-code-search`, `arckit-gov-landscape`, `arckit-gov-reuse-reader`, `arckit-datascout-reader` (#565).
  - **Deferred servers don't reach subagents.** A deferred (non-`alwaysLoad`) plugin MCP server is not injected into subagent context — only the main agent can load it on demand — so a subagent needs `alwaysLoad: true` to see it. Added `alwaysLoad` to `uk-tenders` (#564), `govreposcrape`, `google-developer-knowledge` and `datacommons-mcp` (#565), joining `aws-knowledge` / `microsoft-learn` which already had it. For the two keyed servers, a keyless user's session attempts the connection at startup; per the docs an auth failure marks the server failed and the session continues, bounded by the 5s connect timeout.
- **Codex extension `sync-guides.mjs` drift** (#562). Re-synced the hand-maintained `sync-guides.mjs` between `arckit-claude` and `arckit-codex` — restored the NHS clinical-safety block and the `{{REPO_OWNER}}` substitution that had drifted out of the Codex copy.

### Changed

- **Per-page canonical / Open Graph metadata for arckit.org viewers** (#561), plus the `pages-template.html` head, so generated documentation sites and the article viewers emit correct canonical and OG tags.
- **`/arckit:start` workflow-trigger note** corrected for the Claude Code v2.1.160 `workflow` → `ultracode` keyword rename (#522 item 59, #560).

## [5.9.0] — 2026-06-02

### Added

- **`/arckit:competitors` — Competitor Landscape** (#556). Rival suppliers, awarded-value market share, head-to-head and concentration analysis from the same ~677,000 UK contracting processes as `/arckit:tenders`. Shares the `arckit-tenders-reader` subagent (same MCP reader, different orchestrator/writer lens). Outputs `CMPT` artefact; feeds into `risk` (supplier-concentration/single-supplier-dependency risk), `sobc` (market-context benchmark), `research` (award-evidence grounding), `score` (Company Experience evidence) — all regime-gated handoffs under `governance_framework: UK Gov`.
- **Assurance wiring — TNDR/CMPT artefacts** (#556). Four existing commands now consume TNDR and/or CMPT artefacts as optional inputs: `risk` (supplier-concentration risk section), `sobc` (Economic Case market-context benchmarks), `research` (award-evidence grounding in the build-vs-buy analysis), `score` (Company Experience evidence in the vendor-evaluation scorecard). All wiring is regime-gated (UK Gov `governance_framework`) and added as optional `handoffs:` to the producing commands, plus `## Context` blocks in the consuming commands.
- **`/arckit:tenders` — Procurement Market Intelligence** (#556). Award-value benchmarks, top suppliers, incumbency and concentration from ~677,000 UK contracting processes (Find a Tender Service, Contracts Finder, Public Contracts Scotland, Sell2Wales, eTendersNI). Three-tier reader/orchestrator/writer subagent split; reader allowlists 7 read-only tools; `query_sql` never allowlisted (prompt-injection surface). Outputs `TNDR` artefact; feeds into `sobc` (Economic Case benchmarks), `risk` (concentration risk), `research` (build-vs-buy context). Shares `arckit-tenders-reader` with `/arckit:competitors`.
- **`uk-tenders` bundled MCP server** (#556). Keyless `http` MCP at `https://tenders.run.cns.me/mcp`, deferred (no `alwaysLoad`). 11 tools; 7 allowlisted by `arckit-tenders-reader`; `query_sql` documented-only and never allowlisted. Nightly refresh, best-effort single Cloud Run, no formal SLA — degrades gracefully. Data re-published under OGL v3.0.
- **`TNDR` + `CMPT` doc-types** (#556). `TNDR` (Procurement Market Intelligence, regime UK) and `CMPT` (Competitor Landscape, regime UK) registered in `config/doc-types.mjs` and `commands/pages.md`. Both now live.

## [5.8.0] — 2026-06-01

### Added

- **`arckit-au-energy` community overlay — first Australian sector overlay (11th marketplace plugin).** Adds the Australian Energy Sector overlay as a standalone sector plugin layered on the `arckit-au` jurisdiction baseline, mirroring how `arckit-uk-finance` / `arckit-uk-nhs` layer sectors on the UK baseline (rather than bundling the sector menu inside the jurisdiction overlay). Two commands — `au-aescsf` (AESCSF maturity assessment) and `au-energy-compliance` (AER ring-fencing, AEMC NER/NGR, AEMO interfaces, DERMS/DOE, CSIP-AUS, SOCI escalation) — plus the `au-energy` build recipe (22 targets, optional default-off `SERVICE_INVENTORY`). The recipe composes federal-layer targets (`AU_E8`, `AU_ISM`, `AU_OT`, `AU_SOCI`, `AU_PIA`, `AU_NDB`) from `arckit-au`, so the plugin manifest declares dependencies on **both** `arckit` core and `arckit-au` — the marketplace's first community→community plugin dependency. Doc types `AUAESCSF` + `AUENERGY` (regime AU, HIGH severity). Ships public synthetic evaluation fixtures (`tests/fixtures/au-energy/`) — an applicable DNSP case and a non-SOCI supplier negative case — with deterministic pytest coverage. Register/evidence-heavy energy review composes existing skills (`data-model`, `servicenow`, `dfd`, `diagram`, `risk`, `maturity-model`, `traceability`, `graph-report`) instead of a new inventory command. Original work by @royster70 (#549), repackaged from a stacked-on-#539 draft into a clean standalone sector plugin. Also corrected the `arckit-au` marketplace description from "8 commands" to "10 commands" (OT security + SOCI/CIRMP landed in #539).
- **govreposcrape dependency-intelligence tools wired into the gov agents** (#550). Following the upstream expansion of the `govreposcrape` MCP server from 1 tool to 9, two of the new dependency-intelligence tools are now consumed by ArcKit:
  - **`dependency_compare` → `/arckit:gov-reuse`.** The `arckit-gov-reuse-reader` subagent runs pairwise dependency-overlap between candidate repositories that share a capability and emits the results in a new optional `dependency_comparisons` array on the gov-reuse handoff schema. The orchestrator (`commands/gov-reuse.md`) uses overlap ≥ 60% to collapse near-duplicate / forked candidates — keeping the higher-scored repo as the primary recommendation and avoiding double-counting effort savings — and the writer renders a new **Dependency Overlap Analysis** section in the GOVR artefact. Reader budget capped at 3 `dependency_compare` calls / 5 comparison entries per dispatch.
  - **`vulnerability_exposure` → `/arckit:gov-landscape`.** The `arckit-gov-landscape` agent now scans the domain's major organisations and dominant packages for known-CVE blast-radius (via the SBOM graph + live OSV.dev) and renders a new **Supply-Chain & Vulnerability Exposure** section (exposure by organisation, exposure by dominant package, end-of-life flags). Flagged as a landscape-level signal, not a per-repo audit — points users to `/arckit:secure` / `/arckit:risk` for adoption decisions.
  - Both tools added to the respective agents' `tools:` frontmatter allowlists. `docs/MCP-CATALOGUE.md` updated to mark them as consumed (17 of 23 tools now wired). Non-Claude formats regenerated via `scripts/converter.py`.
- **Cross-sector OT security and SOCI/CIRMP commands added to the `arckit-au` federal overlay** (#539), taking it to 10 commands. `au-ot-security` (ASD operational technology cyber security assessment for connected OT/ICS/SCADA environments) and `au-soci-cirmp` (SOCI Act Critical Infrastructure Risk Management Program governance + evidence pack). Both are general Australian critical-infrastructure capabilities — optional default-off `AU_OT` / `AU_SOCI` targets in the `au-federal` recipe — and are reused (not redefined) by the new `arckit-au-energy` overlay. Doc types `AUOT` + `AUSOCI` (regime AU, HIGH severity).

### Fixed

- **Windows validation paths** (#548). Normalised plugin-root path comparisons in `allow-plugin-internals.mjs` and the generated `arckit-codex-hook.mjs` (`\` → `/` before prefix-matching, a no-op on POSIX) so the `isUnderPluginRoot` gate works on Windows; imported `doc-types.mjs` via `pathToFileURL()` in the dual-registration validator so Node ESM dynamic import works on Windows absolute paths. Also ignores local `.agents/skills/` and `.claude/worktrees/` dev folders.

### Changed

- **Removed references to the retired `tractorjuice/arckit-book` repository** (#536/#554). The repo is no longer available, so the README link 404'd. Dropped the "ArcKit Book" section from `README.md` and repointed the `.devin/wiki.json` authoritative-overview note at `CLAUDE.md` + `README.md` (the live canonical sources). Historical CHANGELOG entries recording the original move (#324/#325) left intact.
- Documentation: noted Claude Code v2.1.157's "workflow" keyword trigger on the start guide (#552); split the homepage stat cards into Jurisdictions / Sectors / Agents (#547).

## [5.7.0] — 2026-05-29

### Fixed

- **US regime registration** (#545, #546). `regime: 'US'` was declared on 10 doc-types (FedRAMP/FISMA/NIST 800-53/CISA Zero Trust/ICAM/AI RMF/PIA/SBOM) but `'US'` was missing from the exported `REGIMES` array and `REGIME_LABELS` in `arckit-claude/config/doc-types.mjs`. The sole consumer, `hooks/graph-inject.mjs`, iterates `REGIMES` directly, so US compliance artefacts were silently dropped from the "Compliance Artifact Presence" listing and never scored in the readiness scorecard despite validating on disk. Added `'US'` + `US: 'USA Federal'`. Same failure class as the CA omission fixed in #441.
- **`arckit-uk-finance` restored to extension conversion** (#546). `scripts/converter.py` `PLUGIN_SOURCES` omitted `arckit-uk-finance`, so its four `uk-fs-*` commands were absent from all five non-Claude extensions (Codex/OpenCode/Gemini/Copilot/Paperclip) from v5.3.0 onward. Added it and regenerated every extension. Also mirrored the eight `uk-fs` templates into `.arckit/templates/` (CLI package data — `arckit init` users had missed them) and removed a stray tracked `arckit-uk-finance/templates/.gitkeep` the converter was copying into extension dirs as noise.
- Refreshed stale overlay-enumeration lists in the test suite (`tests/plugin/test_template_consistency.py`, `tests/paperclip/test_commands_json.py`, `tests/codex/test_codex_extension.py`) to include the `us` / `uk-finance` / `uk-nhs` overlays.

### Added

- **Regime-registration guard test** (`scripts/tests/test-regime-registration.mjs`, wired into CI `lint-markdown.yml`). Asserts every declared doc-type `regime:` is present in both `REGIMES` and `REGIME_LABELS` — the invariant whose absence let the US gap (and the earlier CA gap) ship silently.

## [5.6.0] — 2026-05-29

### Changed

- **Minimum Claude Code version bumped to v2.1.156** (from v2.1.144). The new floor pulls in two Opus 4.8-era improvements ArcKit now depends on: the **v2.1.156** fix for Opus 4.8 thinking blocks being modified and causing API errors (relevant to `/arckit:*` commands and the research agents that use extended thinking), and **v2.1.154** which shipped Opus 4.8 GA plus the `defaultEnabled` plugin manifest field (below). Updated in `arckit-claude/hooks/version-check.mjs`, `README.md` (install note, "Why v2.1.156?" callout, requirements line), `CLAUDE.md` (monitors floor note), and `docs/getting-started.html`.
- **Opus 4.7 → Opus 4.8 documentation refresh** (items 43/44 of #522). `CLAUDE.md` now describes the `effort:` `xhigh` tier as covering Opus 4.7 and 4.8 (4.8 defaults to `high`) and the `/fast` backing model as Opus 4.8 as of v2.1.154 (was 4.7 on v2.1.142–v2.1.153). The `start.md` getting-started guide's token-constrained recommendation updated from "Opus 4.6 or 4.7" to "Opus 4.7 or 4.8" across all distribution copies. (Historical feature-gate references to Opus 4.7 in the README "Why?" callouts and `version-check.mjs` are intentionally left as-is — they record which version first shipped 4.7's `xhigh`/`/context`.)

### Added

- **`defaultEnabled: false` on all 9 community overlays** (`arckit-uae`, `arckit-fr`, `arckit-ca`, `arckit-eu`, `arckit-at`, `arckit-au`, `arckit-us`, `arckit-uk-finance`, `arckit-uk-nhs`). Adopts the Claude Code v2.1.154 plugin manifest field so installing the marketplace surfaces the overlays without auto-enabling all nine. Users now opt in to only the jurisdiction or sector they need; core `arckit` stays default-enabled. Formalises the "install only what you need" model already documented in `CLAUDE.md`. Addresses item 42 of #522.

### Fixed

- **UK accessibility target corrected from WCAG 2.1 AA to WCAG 2.2 AA.** UK public sector bodies are now monitored against WCAG 2.2 AA — GDS has tested against 2.2 since October 2024, and the *Public Sector Bodies (Websites and Mobile Applications) Accessibility (Amendment) (EU Exit) Regulations 2022* (SI 2022/1097) replaced the fixed WCAG version reference with a rolling reference to "the latest published version of WCAG" (currently 2.2). The `/arckit:service-assessment` command (GDS Service Standard Point 5 evidence checks) and several core templates were still hard-coded to "WCAG 2.1 AA", causing generated UK artefacts to cite the superseded standard. Updated: `service-assessment` (5 references), `backlog` command, and the `requirements`, `sow`, `research-findings`, `platform-design`, and `backlog` templates, plus the NHS example on `docs/use-cases.html`. Non-Claude formats regenerated via `scripts/converter.py`.
  - **Jurisdictional overlays intentionally left unchanged** (verified against current 2026 mandates): France `fr-dinum` correctly maps RGAA 4.1.2 → WCAG **2.1** AA (RGAA 5 / 2.2 expected end-2026, not yet in force); Canada `ca-gc-digital-standards` correctly anchors WCAG **2.1** AA via CAN/ASC-EN 301 549:2024; Australia `au-dss` already targets WCAG **2.2** AA (Digital Experience Policy, 1 Jan 2025).

## [5.5.0] — 2026-05-28

### Brand reposition

Significant identity refresh. No functional changes to commands, agents, hooks, or recipes — purely brand surfaces, assets, and positioning copy.

### Changed

- **Tagline**: "Enterprise Architecture Governance & Vendor Procurement Toolkit" → **"The Enterprise Architecture Governance Harness"**. Drops the loaded "Toolkit" category and elevates "Harness" — the structural metaphor that better matches how ArcKit actually behaves (it harnesses an AI assistant against a template-driven governance frame). Updated across every brand surface: root `README.md`, plugin `plugin.json`, marketplace `marketplace.json`, Gemini extension JSON, Codex / Copilot / OpenCode / Paperclip READMEs, `CLAUDE.md`, `docs/llms.txt`, `docs/index.html` (meta description + OG + Twitter + JSON-LD + footer + hero), all 10 docs `*.html` pages, all 6 start guides, the published article on government code discovery, the FDE pitch deck, the business plan, the CLI `__init__.py` docstring + `TAGLINE` constant + Typer help text, and the SDG repo scaffold script.
- **Category positioning**: "Architecture · Vendor Procurement · Compliance" → **"Strategy · Architecture · Delivery · Assurance"**. Reflects the actual 71-command surface, where procurement is one cluster of ~6 commands among seven; the new four-bucket framing makes Strategy (principles/SOBC/risk/Wardley/roadmap/story/framework), Architecture (ADRs/diagrams/HLD-DLD/data-mesh-contract/platform-design/data-model/backlog/servicenow), Delivery (devops/mlops/finops/operationalize/pages/presentation), and Assurance (analyze/conformance/traceability/health/navigator/maturity-model + all compliance commands) each load-bear an equivalent share of the surface. Procurement (sow, dos, evaluate, score, gcloud-*) is preserved as functional content — the SOW command, plan-template Gantt phases, procurement guide, use-case index entry — but no longer leads positioning.

### Added

- **New logo family — Bracket-B2**. Replaces the previous arc-with-three-nodes "arc-kit" mark. Built from three semantic elements that depict an AI harness: angle brackets `⟨ ⟩` (harness frame / prompt structure), inner caret `^` (prompt indicator), linchpin cursor (teal terminal anchors flanking a navy centre pin — the AI output baseline). Selected from six concept directions explored under `docs/assets/concepts/` (Bracket A/B/C, Linchpin A/B, Hybrid) and three Bracket-B grafts (B1 anchor-nodes / B2 linchpin-cursor / B3 linchpin-fan). Full asset family in production paths: `ArcKit_Mark_Light/Dark.svg`, `ArcKit_Logo_Horizontal_Light/Dark.svg`, `ArcKit_Logo_Stacked_Light/Dark.svg`, `arckit-banner-light/dark.svg`, `og-card.svg`, `favicon.svg` (large, navy 96-radius tile), `favicon-small.svg` (16/32 stripped variant).
- **Dark banner** — `arckit-banner-dark.svg` was missing from the library entirely. Added.
- **OG card** — `docs/assets/og-card.svg` 1200×630 hero with the new mark, wordmark, tagline, and four-bucket subtitle. Replaces `docs/og-image.png` content so the existing `https://arckit.org/og-image.png` URL serves the new design without breaking inbound shares.
- **Favicon set** — `favicon.svg`, `favicon-512.png`, `favicon-192.png`, `favicon-32.png`, `favicon-16.png`, plus a simplified `favicon-small.svg` for the 16/32 sizes. Wired into all 10 docs `*.html` pages via `<link rel="icon">` block placed after each page's canonical link.
- **Render script** — `scripts/render-brand-pngs.py` (uses `cairosvg`) regenerates all 22 PNG exports from the SVG sources. Run after any SVG edit to keep raster exports in sync.
- **Concept directory retained** — `docs/assets/concepts/` (six initial concept thumbnails + three B-grafts + `v2/` full Bracket-B2 family pre-promotion) kept in-repo as design source-of-truth for future iteration.
- **Brand-motif documentation** — `docs/assets/README.md` "Brand motif" section rewritten to describe the Bracket-B2 design and its colour-role assignments (`#0B1F33` navy for structure, `#1ED3C6` teal for the AI/active layer).

### Changed (external)

- GitHub repo description updated via `gh repo edit` to match the new tagline.
- **Not done by this release**: GitHub social-preview image. The repo's social-preview image is not exposed via `gh` CLI or REST API. Upload `docs/assets/og-card.png` manually at GitHub → Settings → General → Social preview.

## [5.4.0] — 2026-05-27

### Fixed

- **`desktop_notifications` SessionStart hook no longer raises `plugin option "desktop_notifications" isnt set` on fresh installs.** The `${user_config.desktop_notifications}` argv substitution in `arckit-claude/hooks/hooks.json` aborts the hook when the user has never set the field, even with a `"default": "false"` declared in the userConfig (the default does not propagate through argv substitution on at least some Claude Code versions). The hook now reads the value from the `CLAUDE_PLUGIN_OPTION_DESKTOP_NOTIFICATIONS` env var — the documented parallel access path — which degrades cleanly to `undefined` when the field is unset. Opt-in behaviour for users who set `desktop_notifications: "true"` is unchanged.
- **`/arckit:pages` now surfaces NHS clinical-safety artefacts**. Marcus Baw's `SAFETY.md` / `SAFETY-CASE.md` / `HAZARD-LOG.md` files (and their `clinical-safety/deployment/` companions from `/arckit:uk-nhs-dcb0160`) deliberately do not carry the `ARC-` prefix, so they were skipped by the manifest scanner in `arckit-claude/hooks/sync-guides.mjs`. The scanner now picks up any `.md` file in `projects/{NNN}/clinical-safety/` and `projects/{NNN}/clinical-safety/deployment/` under category `Clinical Safety`, using the file's first heading as the title. Marcus's filenames are preserved verbatim — only the manifest entry is added.

### Added

- **`arckit-uk-nhs` community plugin** — second **sector-specific** ArcKit overlay (following [`arckit-uk-finance`](#530--2026-05-27) which shipped in v5.3.0; jurisdiction overlays continue to cover legal territories). 4 commands covering NHS clinical safety (`uk-nhs-dcb0129` manufacturer, `uk-nhs-dcb0160` deployer), NHS DTAC v3 (`uk-nhs-dtac`), and UK MDR 2002 + EU MDR 2017/745 software-as-medical-device classification (`uk-mdr-classification`). Adopts [Dr Marcus Baw's SAFETY.md spec](https://github.com/pacharanero/SAFETY.md) verbatim for DCB0129/0160 file naming and YAML-frontmatter hazard log (3-file output: `SAFETY.md`, `SAFETY-CASE.md`, `HAZARD-LOG.md` inside `projects/{NNN}/clinical-safety/`). Closes part of #424.
- **`uk-nhs-clinical-safety` build recipe** (44 targets across 8 build waves) — composes with the UK SaaS baseline rather than replacing it (NHS digital products still need TCoP, Secure by Design, DPIA, ATRS).
- **2 new doc-type codes** registered in `arckit-claude/config/doc-types.mjs`: `NHSDTAC`, `NHSMDR`. Both regime `UK`, category `Compliance`, severity `HIGH`. Dual-registered in `arckit-claude/commands/pages.md` allow-list per existing dual-registration pattern.
- **Spec doc and decision log** at [`docs/superpowers/specs/2026-05-19-uk-nhs-overlay-design.md`](docs/superpowers/specs/2026-05-19-uk-nhs-overlay-design.md) — every locked decision traces back to its source; §0 written specifically for Marcus Baw to review before committing as proposed domain co-maintainer.

### Changed

- **Top-level command count** moves from **139** to **143** (71 official + 72 community-contributed). Community count: `arckit-uae` 12 + `arckit-fr` 12 + `arckit-ca` 12 + `arckit-eu` 7 + `arckit-at` 3 + `arckit-au` 8 + `arckit-us` 10 + `arckit-uk-finance` 4 + `arckit-uk-nhs` 4 = 72.
- **`scripts/bump-version.sh`** — added `arckit-uk-nhs` to jurisdictions loop and to verification output.
- **`scripts/converter.py`** — added `arckit-uk-nhs` to `PLUGIN_SOURCES`. All extension formats (Codex Extension, Codex Skills, OpenCode CLI, Gemini CLI, Copilot, Paperclip) now include the 4 NHS commands.
- **`.claude-plugin/marketplace.json`** — added 10th plugin entry for `arckit-uk-nhs` (alongside `arckit-uk-finance` from v5.3.0).

### Notes for Marcus Baw

Marcus's SAFETY.md / SAFETY-CASE.md / HAZARD-LOG.md files deliberately do NOT carry the `ARC-` prefix or a doc-type code — they pass through the `validate-arc-filename` hook untouched and are cross-referenced by relative path (`clinical-safety/SAFETY-CASE.md`) rather than document ID. This preserves his spec's "convention over configuration" principle while keeping the files inside an ArcKit project subdirectory so multi-project monorepos work. The Document Control block prepended to each file is the only addition to his spec.

## 5.3.0 — 2026-05-27

### Added

- **`arckit-uk-finance` community plugin** — first sector-specific overlay. Jurisdictional overlays cover countries (UAE, France, Canada, EU, Austria, Australia, USA federal civilian); sector overlays cover industry verticals. Four commands for architects at established UK PSPs / EMIs / PIs scaling regulated payment operations: SCA-RTS exemption design (`uk-fs-sca-rts`, `FSSCA`), EMI/PI safeguarding assessment (`uk-fs-safeguarding`, `FSSAFE`, CRITICAL severity flag), FCA Consumer Duty board report (`uk-fs-consumer-duty`, `FSCD`), Critical Third Parties dependency assessment (`uk-fs-ctp-dependency`, `FSCTP`). Recipe: `uk-fs-payments` (multi-wave payment system modernization). Ships EXPERIMENTAL; help-wanted call open for a UK FS domain co-maintainer (regulatory counsel / MLRO / Head of Architecture background welcome). See spec: `docs/superpowers/specs/2026-05-26-arckit-uk-finance-overlay-design.md`. See plan: `docs/superpowers/plans/2026-05-26-arckit-uk-finance-overlay.md`.
- Four new doc-types registered in `arckit-claude/config/doc-types.mjs`: `FSSCA` (SCA-RTS), `FSSAFE` (Safeguarding), `FSCD` (Consumer Duty), `FSCTP` (Critical Third Parties).
- New recipe `uk-fs-payments.yaml` in `arckit-claude/skills/arckit-build/recipes/`.
- Five user-facing guides in `docs/guides/uk-fs-*.md` (one per-command + one overlay-level maintenance guide with citation register).
- Site integration: UK Finance sector card on landing page (`docs/index.html`), accordion section in guides (`docs/guides.html`), filter option and 4 command rows on commands page (`docs/commands.html`).

## 5.1.0 — 2026-05-23

### Added

- **`arckit-us`** community plugin — USA Federal Civilian Overlay with 10 commands (`us-fisma-categorization`, `us-nist-800-53`, `us-fedramp-ssp`, `us-fedramp-readiness`, `us-zero-trust`, `us-icam`, `us-ai-rmf`, `us-ai-impact`, `us-privacy-pia`, `us-sbom-eo-14028`) and the `us-federal` recipe. See [`arckit-us/CHANGELOG.md`](arckit-us/CHANGELOG.md).
- 10 new doc-type codes registered in `arckit-claude/config/doc-types.mjs`: `FIPS199`, `NIST`, `FRSSP`, `FRRR`, `ZTA`, `ICAM`, `AIRMF`, `AIIA`, `USPIA`, `SBOM`.
- 11 central guides under `docs/guides/us-*.md` (10 per-command + 1 overlay-level maintenance guide with citation register).
- USA section in `docs/guides.html`, `docs/commands.html`, `docs/index.html`.

### Changed

- All 8 plugin manifests now at lockstep `5.1.0` (was 5.0.5).
- Community overlay count: 6 → 7. Total command count: 125 → 135 (71 official + 64 community).
- `scripts/bump-version.sh` jurisdiction loop now includes `us`; verification block now includes `arckit-au` and `arckit-us` (the `arckit-au` addition fixes a pre-existing verification gap).
- `scripts/converter.py` `AGENT_CONFIG` extended with `arckit-us` source.

### Statutory currency note

This release ships the USA overlay against the **post-EO-14110-revocation** policy landscape: OMB M-24-10 (use of AI) and OMB M-25-21 (acquisition of AI) are the active AI assurance mandates, FedRAMP completed the Rev 5 transition in 2024, and OMB M-22-18 / M-23-16 secure-software attestation has been active since 2024.

## [5.0.5] - 2026-05-23

### Fixed

- `owm-to-mermaid.mjs` no longer mis-parses `evolve` lines whose quoted component name contains an embedded number (#508). The target-evolution regex is now anchored at end-of-line, so `evolve "Foo (Project 003)" 0.74` is converted faithfully instead of truncating the name and dropping the real target.
- `owm-to-mermaid.mjs` now passes inline `(build)` / `(buy)` / `(outsource)` decorators through to the Mermaid output (#508), alongside the existing `(inertia)` support. Authors no longer need to add trailing standalone `build "<Name>"` / `buy "<Name>"` / `outsource "<Name>"` directives to get sourcing decorators on the converted Mermaid map.
- `/arckit:health` now flags **DRAFT staleness** and **overdue reviews** — the two signals the session-start `stale-artifact-scan` monitor was already reporting (#509). Adds two detection rules: `STALE-DRAFT` (MEDIUM, status=DRAFT unchanged for > 30 days by default, configurable via `STALE_DRAFT_DAYS=N`) and `REVIEW-OVERDUE` (HIGH, Document Control `Next Review Date` in the past on non-DRAFT/SUPERSEDED/ARCHIVED artifacts). The monitor's draft threshold moves from 14 days to 30 to match. Both surfaces now agree on the same set of artifacts.

## [5.0.4] - 2026-05-22

### Added

- **Opt-in OWM label tidying** for `/arckit:wardley`. New `--tidy-owm` flag rewrites the canonical ` ```wardley ` (OnlineWardleyMaps) block's component `label [x, y]` offsets so labels do not overlap when rendered at <https://create.wardleymaps.ai>. Backed by `owm-tidy.mjs` — a sibling of the mermaid `wardley-tidy.mjs` that reuses the same placement engine with the OnlineWardleyMaps renderer geometry (recovered from `tractorjuice/onlinewardleymaps`). Opt-in by design: the OWM block is the author-edited source of truth and OWM is an interactive drag editor, so it is never rewritten by a silent hook (unlike the Mermaid `wardley-beta` block). Collision-free authored offsets are kept; only overlapping or untuned labels move.

## [5.0.3] - 2026-05-22

### Added

- **Auto-tidy Wardley Map labels** (#506). New `tidy-wardley-labels` PostToolUse hook rewrites Mermaid `wardley-beta` component-label offsets after every Write/Edit, so clustered components no longer collide into an unreadable pile. Backed by a pure, deterministic placement engine that projects the map to pixels, generates 32 candidate slots per label, scores each against a weighted collision penalty, places the most-constrained labels first, and converges to an idempotent result.

### Documentation

- New articles: the v5 plugin-split token budget (#502) and the Wardley label-tidy placement algorithm (#500, #506). Per-article `sitemap.xml` and `llms.txt` entries backfilled (#503, #504, #505).

## [5.0.2] - 2026-05-19

### Added

- **`desktop_notifications` userConfig flag + `notify-stale-artifacts` SessionStart hook** (#497). Opt-in `terminalSequence` (Claude Code v2.1.141+) desktop notifications when stale ArcKit artefacts are detected at session start. Stacks OSC 9 (iTerm2 / Windows Terminal / WezTerm / ConEmu) and OSC 777 (urxvt / Ghostty / Warp) escapes; terminals silently drop unsupported codes per the documented allowlist. Complements (does not replace) the existing `stale-artifact-scan` background monitor.
- **"What it costs" README section** (#499). Documents the measured plugin footprint from `claude plugin details arckit`: ~10,042 always-on tokens per session plus on-invoke costs tiered (Lightweight <2K, Standard 2–7K, Heavy 7–15K, Research-heavy 15–25K, Specialist >25K).

### Changed

- **All 6 community-overlay READMEs** (`arckit-uae`, `arckit-fr`, `arckit-ca`, `arckit-eu`, `arckit-at`, `arckit-au`) now call out the v2.1.143 plugin dependency enforcement: `claude plugin disable arckit` surfaces a disable-chain hint instead of silently breaking the overlay (#497).

### Fixed

- **32 AU community-plugin guide files** under `arckit-{codex,copilot,opencode,paperclip}/docs/guides/au-*.md` are now tracked. They had been generated by `scripts/converter.py` and pushed to the published extension repos via `push-extensions.sh`, but stayed untracked in the monorepo, causing 32 "new" files at every release (#498).
- **Runtime cache `.gitignore` cleanup** (#498). `.arckit/memory/.last-session`, `.arckit/memory/.telemetry.jsonl`, and `docs/telemetry.json` are now gitignored — closes the loose end from the #494 close discussion. `.last-session` was previously tracked one commit deep; `git rm --cached` untracks it while leaving the file on disk for the running hook.

## [5.0.1] - 2026-05-19

### Changed

- **Minimum Claude Code version bumped to v2.1.144** (from v2.1.139). Adopts items 1, 3, 5, 8 from #495 — see `arckit-claude/CHANGELOG.md` for the full plugin entry.

### Fixed

- `CLAUDE.md` and `README.md` agent-count corrected from "13 agents" to **16 agents** (10 single-tier + 6 reader/writer subagents). Discovered during the #495 item 10 subagent-slug audit.

## [5.0.0] - 2026-05-18

### BREAKING

- **Community overlays moved to separate plugins**. The monolithic `arckit` plugin shipped 117 commands (71 core + 46 community). v5.0.0 splits community commands into six per-jurisdiction marketplace plugins: `arckit-uae` (12 commands + 2 recipes), `arckit-fr` (12), `arckit-ca` (12 + 1 recipe), `arckit-eu` (7), `arckit-at` (3), and `arckit-au` (8 + 1 recipe — new in v5.0.0). Users now install only the jurisdictions they need. Total surface: 125 commands across 7 plugins.
  - **Migration:** after upgrading, install the community plugins you previously used. A one-shot SessionStart banner reads `.arckit/manifest.json` and prints the exact `claude plugin install ...` command for your project. Acknowledge with `touch .arckit/v5-migration-acked`.
  - **Token savings:** UK-only users save ~5K tokens per SessionStart system reminder (estimate — to be replaced with measured figures in Task 16).
  - **No functional change** for users who install all 6 plugins — the full 117-command surface is intact, just spread across plugins.

### Added

- `scripts/check_recipes.py` — CI gate validating every recipe's structure and dep references.
- `scripts/check_doctype_collisions.py` — CI gate asserting every doc-type code in `arckit-claude/config/doc-types.mjs` is unique.
- `scripts/tag-plugins.sh` — creates native `<plugin>--vX.Y.Z` tags per release (idempotent).
- `arckit-claude/hooks/v5-migration-banner.mjs` — one-shot SessionStart hook suggesting per-jurisdiction installs based on prior project artefacts.
- 6 new plugin directories: `arckit-uae/`, `arckit-fr/`, `arckit-ca/`, `arckit-eu/`, `arckit-at/`, `arckit-au/`, each with their own `plugin.json`, `README.md`, `VERSION`, `commands/`, `templates/`, and (where applicable) `recipes/`.
- **`arckit-au`** Australian Federal / DISP-supplier overlay — 8 commands (`au-e8-posture`, `au-pia`, `au-dss`, `au-ism-controls`, `au-ndb-playbook`, `au-pspf`, `au-ai-assurance`, `au-disp-attestation`), 8 templates, and the `au-federal` recipe (35 targets, 9 waves). 8 new doc-type codes registered in `arckit-claude/config/doc-types.mjs` (`AUE8`, `AUISM`, `AUPIA`, `AUNDB`, `AUDSS`, `AUPSPF`, `AUAIA`, `AUDISP`). Adds `AU` regime; also adds `CA` retroactively (CA shipped doc-types in v4.15.0 but was missing from `REGIMES`). Domain co-maintainer: @royster70. Supersedes #441.

### Changed

- `arckit-build` skill: new three-tier recipe lookup precedence — project override → core plugin → sibling community plugins via glob.
- `scripts/converter.py` walks all 6 plugin source dirs and merges into one extension output per non-Claude format. Non-Claude extensions stay monolithic per the v5 design.
- `scripts/bump-version.sh` updates 6 plugin manifests + `marketplace.json` (all `.plugins[]` entries) instead of just one.
- `docs/RELEASING.md` updated with multi-plugin release flow.
- `CONTRIBUTING.md` adds a two-part PR rule for new doc-types (command in community plugin, doc-type registration in core).

### Note on doc-types

All doc-type codes remain in `arckit-claude/config/doc-types.mjs` — community plugins ship commands and recipes only. This keeps `validate-arc-filename.mjs` single-sourced.

### Note on plugin dependencies (Claude Code v2.1.110+)

All 6 community plugins (`arckit-uae`, `arckit-fr`, `arckit-ca`, `arckit-eu`, `arckit-at`, `arckit-au`) declare an exact (`=`) dependency on the `arckit` core plugin. Installing any community plugin auto-installs core; uninstalling with `--prune` cleans it up. The exact pin keeps the 6 plugins shipping as a coherent set — `scripts/bump-version.sh` updates `.version` and `.dependencies[arckit].version` in lockstep on every release.

## [4.22.0] - 2026-05-17

### Added

- **New build recipe: `uae-agentic-transformation`**. Focused 24-month playbook for the 23 April 2026 UAE Cabinet framework targeting 50% of federal services on agentic AI by April 2028. Distinct from the broader `uae-federal-ai` recipe — ADRs reshaped around agentic architecture (orchestration framework, human-in-the-loop boundaries, foundation-model selection, observability for autonomous decisions, kill-switch / rollback), `UAE_ZERO_BUREAUCRACY` positioned as the framework-mandated process-redesign artefact, `PLAN` + `ROADMAP` timeboxed to the 24-month window with the 50%-portfolio target. Includes all 12 UAE community commands plus core ArcKit governance; uses canonical doc-type codes from `config/doc-types.mjs`. 49 targets.

## [4.21.0] - 2026-05-15

### Added

- **PostCompact hook re-injects project context** (#475). Companion to `keep-coding-instructions: true` — static command bodies were already preserved across `/compact`, but dynamic filesystem-derived state (active projects, ARC-* artefacts, external docs, global policies) was lost. The new `postcompact-rehydrate.mjs` hook closes that gap by reusing `buildProjectContext` from the existing context-injection builder.
- **Effort tier captured + surfaced** (#471). `session-learner.mjs` and `telemetry.mjs` now read the session's effort tier from hookInput `effort.level` or `$CLAUDE_EFFORT` (Claude Code v2.1.133+); recorded per-event in the telemetry JSONL, per-session in `sessions.md` and `docs/telemetry.json`. The `/arckit:pages` dashboard's Session Telemetry panel gains an "Effort mix" row and a per-session effort chip.
- **Autoresearch explicit stop conditions** (#474). The optimisation loop now self-terminates on score-target hit (`best >= 9.5`), iteration budget (`iter >= 30`), or double-plateau detection. No more loop-forever — token budget bounded by default; thresholds tunable inline.
- **Cross-reference linter** (#464). `scripts/check_references.py` validates `${CLAUDE_PLUGIN_ROOT}` paths, `handoffs[].command` slugs, and `${user_config.KEY}` keys against disk. Wired into `.github/workflows/lint-markdown.yml`.
- **MCP catalogue** (#465). Documentation listing the 5 bundled MCP servers, what they're for, and how each plugs into the relevant ArcKit command. Closes #442 item 15.

### Changed

- **Hook config migrated to `args: string[]` exec form** (#467). All 16 entries in `arckit-claude/hooks/hooks.json` use the v2.1.139 exec form (`command: "node"` + `args: ["..."]`) instead of the legacy shell-string. The harness now execs `node <path>` directly, eliminating shell-quoting and metacharacter pitfalls in `${CLAUDE_PLUGIN_ROOT}`-substituted paths.
- **PostToolUse hooks set `continueOnBlock: true`** (#470). The 4 observational PostToolUse entries (`update-manifest`, `provenance-stamp` ×2, `telemetry`) can no longer derail the user's turn if they ever emit `decision: block`. Block-as-gate semantics retained for the genuine PreToolUse / UserPromptSubmit guards.
- **Minimum Claude Code version bumped to v2.1.139** (from v2.1.129). Required by the `args` exec form and `continueOnBlock`. Also picks up v2.1.133 subagent skill discovery fix (relevant to ArcKit's 13 agents) and v2.1.136 SessionStart env staleness fix.
- **Docs: `/fast` Opus 4.7 default + `MCP_TOOL_TIMEOUT` env var** (#473). CLAUDE.md captures the v2.1.142 `/fast` default change. New "Optional: MCP per-request timeout" section in `docs/guides/mcp-servers.md` recommends `MCP_TOOL_TIMEOUT=300000` for corporate networks with TLS-inspecting proxies; one-line cross-references added to each of the 3 cloud-research guides.
- **AGENTS.md repository guidelines** (#463). New top-level `AGENTS.md` documenting the agent-development conventions used in this repo.

### Site

- **Launch ArcKit FDE** (#460), nav/footer link to FDE (#458), GOV.UK Design System credit removed from footers (#459), opening-paragraph polish + "agentic AI" positioning (#461, #462).

## [4.20.3] - 2026-05-11

### Fixed

- **Plugin `monitors` key wrapped under `experimental` block** (#453). Claude Code v2.1.129 moved the `monitors` (and `themes`) keys under a top-level `experimental` block in plugin manifests. ArcKit's `stale-artifact-scan` background monitor was declared at the top level and would not load on v2.1.129+ clients. The manifest is now compliant with the new schema.
- **`validate-arc-filename` hook now soft-blocks via `{decision, reason}` JSON** (#454). The unknown-doc-type-code rejection path previously used `process.exit(2)` + stderr, surfacing as a hard permission error visible only to the user. The model received nothing actionable and could not self-correct. Migrated to the modern soft-block pattern (already used by `score-validator.mjs`) so Claude is told the rejection reason — including the offending filename, the valid-codes list, and an explicit "rename and retry" instruction — and can self-correct on the next turn without human intervention.

### Changed

- **Minimum Claude Code version bumped to v2.1.129** (from v2.1.121). Required by the `monitors`-under-`experimental` migration above. Also picks up the v2.1.129 fix to `ENABLE_PROMPT_CACHING_1H` (which was silently downgrading the 1-hour prompt cache TTL back to 5 minutes on earlier versions). The SessionStart version-check hook and the README/CLAUDE.md/PLATFORM-COMPARISON.md docs all reflect the new floor.

## [4.20.2] - 2026-05-11

### Changed

- **Wardley Mermaid rendering now targets Mermaid 11.15.0.** Generated ArcKit pages load `mermaid@11.15.0`, picking up the latest `wardley-beta` fixes for unquoted hyphenated component names and Wardley label text handling. Wardley guidance and templates now describe `wardley-beta` as available from Mermaid 11.14.0 onward while continuing to quote non-simple names for cross-version compatibility.

## [4.20.0] - 2026-05-10

### Added

- **Codex plugin bundle with lifecycle hooks.** `arckit-codex/` now ships a Codex plugin manifest, MCP config, hook wiring, and a native hook runner for context injection, prompt secret checks, file guardrails, MCP approval policy, artifact graph context, provenance stamping, manifest maintenance, and Stop-session memory.
- **Codex marketplace metadata and CI.** Adds `.agents/plugins/marketplace.json` pointing at the standalone `tractorjuice/arckit-codex` repo, plus a focused Codex plugin workflow that checks hook syntax, CLI syntax, and Codex extension tests.
- **Codex schemas and validators.** The Codex bundle now includes deterministic handoff schemas, scoring rubrics, `validate-handoff.mjs`, and `owm-to-mermaid.mjs` so research and Wardley workflows work in standalone extension installs.

### Changed

- **Extension generation now preserves Codex-native behavior.** The converter generates Codex plugin metadata, Codex MCP config, hook-enabled `config.toml`, hyphen-safe skill names, rewritten template override paths, and refreshed standalone extension assets.
- **Release tooling now fails on extension push errors.** `scripts/push-extensions.sh` now treats commit or push failures as real failures instead of reporting a false success.

### Fixed

- **Codex CLI project scaffolding now installs hooks and validators.** `arckit init --ai codex` copies `.codex/hooks/`, `.arckit/schemas/`, and `.arckit/scripts/validate-handoff.mjs`, and keeps `.codex/agents/**` and `.codex/hooks/**` unignored.

## [4.19.2] - 2026-05-07

### Changed

- **`/arckit:wardley` now invokes a vendored OWM → wardley-beta converter instead of regenerating Mermaid syntax by hand.** Adds `arckit-claude/scripts/owm-to-mermaid.mjs` (363 lines, kebab-cased). The script originated as `tests/mermaid-wardley/convert.mjs` in this repo (PRs #339, #340, #341, #344), was untracked in #348, and evolved at `tractorjuice/wardleymap_math_model` with explicit-block pipeline handling and evolution-stage quoting before being re-vendored here. The wardley command's "Mermaid Wardley Map (Enhanced)" section (previously 30 lines of fragile syntax-translation rules) is replaced with a three-step procedure: write OWM to a temp file, run `node ${CLAUDE_PLUGIN_ROOT}/scripts/owm-to-mermaid.mjs <file>`, paste stdout verbatim into the `<details>` block. Sourcing decorators (`build`/`buy`/`outsource`/`inertia`) flow from OWM directives the converter already reads. Hand-rolled `wardley-beta` was brittle — the parser eagerly tokenises hyphens as `->`, treats bare numeric words (`NIS 2031`) as numeric literals, and matches keywords (`label`, `evolve`, `pipeline`) at any word boundary. The converter sidesteps all of these by emitting every name as a double-quoted STRING.

### Notes

- Claude-only this release. Non-Claude extensions (Codex / Gemini / OpenCode / Copilot) of `/arckit:wardley` reference `${CLAUDE_PLUGIN_ROOT}/scripts/owm-to-mermaid.mjs`, which gets path-rewritten by `scripts/converter.py` but the script itself is not yet copied to those extensions (the converter currently propagates `scripts/{bash,python}` only). Follow-up patch will widen the converter's copy list to include `arckit-claude/scripts/`.

## [4.19.1] - 2026-05-07

### Fixed

- **Auto-allow hook now matches `gov-reuse` tempfiles.** The v4.18.1 broadened regex in `allow-plugin-internals.mjs` accepted tempfile patterns like `/tmp/grants-handoff*.json` and `/tmp/datascout-handoff-energy.json`, but its agent-name segment `[a-z][a-z0-9]*` excluded hyphens — so `/tmp/gov-reuse-handoff*.json` (and any future hyphenated agent name) failed to match, triggering a permission prompt for every per-capability dispatch in `/arckit:gov-reuse`. Widened to `[a-z][a-z0-9-]*` to allow hyphens in the agent name while still rejecting paths starting with hyphen, hidden files, and other negative cases. Verified against 18 path patterns including `/tmp/gov-reuse-handoff-appointment-booking.json`, `/tmp/aws-research-handoff.json`, `/tmp/gov-code-search-handoff.json` (positive) and `/etc/passwd`, `/tmp/-handoff.json`, hidden files (negative).

## [4.19.0] - 2026-05-07

### Added

- **`/arckit:gov-reuse` reader/orchestrator/writer split** (Claude Code plugin only — non-Claude extensions remain at the prior single-tier shape until a follow-up release). Third command after `/arckit:datascout` (v4.16.0) and `/arckit:grants` (v4.18.0) to adopt the three-tier subagent pattern. Reader (`arckit-gov-reuse-reader`, `WebFetch` + `mcp__govreposcrape__search_uk_gov_code` only — no Write/Edit/Bash/Agent/WebSearch) searches govreposcrape per capability and fetches GitHub repo evidence. Orchestrator validates each reader payload via `validate-handoff.mjs`, scores deterministically from the YAML rubric, assigns a reuse strategy band (`Fork` / `Library` / `Reference` / `None`) by score thresholds (`>= 80 / 60-79 / 40-59 / < 40`) with licence overrides for AGPL/Proprietary/Unlicensed → forced `None`. Writer (`arckit-gov-reuse-writer`, `Read`/`Write`/`Edit` only) renders the GOVR artefact and spawns one tech-note per Fork or Library candidate.
- **Gov-reuse handoff schema** (`arckit-claude/schemas/gov-reuse-handoff.schema.json`). 19 licence types in the allowlist, 22 languages, 28 framework hints, 15 installation methods. No `score`, `rank`, or `recommended_strategy` field — there is nowhere for a judgement to land.
- **Gov-reuse scoring rubrics** (`arckit-claude/schemas/scoring-rubrics/gov-reuse-{generic,uk-gov}.yaml`). 5 weighted criteria summing to 100: `license_compatibility` 25 / `code_quality` 20 / `documentation` 20 / `tech_stack_alignment` 20 / `activity_maintenance` 15. UK-Gov overlay bumps OGL above MIT/Apache and adds a `trusted_org_bonus` (alphagov, NHSDigital, dfe-digital, hmrc-digital, ministryofjustice, ONSdigital, etc.) applied additively to the `code_quality` per-criterion score before weighting.
- **CI coverage for gov-reuse schema.** New `tests/plugin/test_validate_gov_reuse_handoff.mjs` runs 2 valid + 5 reject fixtures (extra-property, oversized-summary, off-allowlist licence, injection-inflated-score, injection-extra-language) through the shared `validate-handoff.mjs`. Wired into `.github/workflows/lint-markdown.yml`.

### Removed

- Single-tier `arckit-claude/agents/arckit-gov-reuse.md` (Claude plugin only). The orchestrator role moved to the slash command body; reader and writer live in their own subagent files.

## [4.18.2] - 2026-05-07

### Added

- **`inject-agent-context.mjs` PreToolUse hook** — closes the gap where ArcKit subagents dispatched via the `Agent` tool ran without project context. UserPromptSubmit hooks fire only on real user prompts, so any orchestrator-style subagent whose body assumed "the ArcKit Project Context hook has already detected all projects, artifacts" silently lost that context when invoked indirectly. The new PreToolUse hook (matcher: `Agent`) builds the same context block as `arckit-context.mjs` and prepends it to `tool_input.prompt` via `updatedInput` (the only PreToolUse return-field that propagates into the dispatched subagent's context — `additionalContext` stays in the parent thread). Scoped to `arckit-*` subagent_types; skips reader/writer subagents (their schema-validated JSON payloads must stay clean) and skips general-purpose / Plan / Explore / claude-code-guide / etc. (no spam).
- **`project-context-builder.mjs`** — extracted the project-scanning logic from `arckit-context.mjs` into a shared module so both the UserPromptSubmit hook and the new PreToolUse hook produce identical context blocks.

## [4.18.1] - 2026-05-07

### Fixed

- **Auto-allow hook now matches per-bucket grants tempfiles.** `allow-plugin-internals.mjs` previously only matched `/tmp/datascout-handoff*.json` and `/tmp/arckit-{name}-handoff*.json`, but at runtime the LLM names per-funder-category dispatch tempfiles like `/tmp/grants-handoff-open-data.AbCdEf.json` (suffixing the bucket name for traceability across multiple Bash invocations). The regex now broadens to `(?:arckit-)?[a-z][a-z0-9]*-handoff(?:-[a-z][a-z0-9-]*)?...`, accepting an optional `arckit-` prefix and an optional hyphenated qualifier between `-handoff` and the random tail. Read auto-allow remains scoped to /tmp and read-only.

## [4.18.0] - 2026-05-07

### Added

- **`/arckit:grants` reader/orchestrator/writer split.** Second command (after `/arckit:datascout` in v4.16.0) to adopt the three-tier subagent pattern documented in `arckit-claude/agents/READER-PATTERN.md`. The reader (`arckit-grants-reader`, WebSearch+WebFetch only, no Write/Edit/Bash/Agent) fetches programme evidence per `funder_category` bucket; the orchestrator (in the slash-command body, since plugin subagents cannot dispatch further subagents) validates the reader's JSON via `validate-handoff.mjs`, scores deterministically from a YAML rubric, then dispatches the writer (`arckit-grants-writer`, Read+Write+Edit only) which renders the GRNT artefact and one tech-note per scored programme.
- **Grants handoff schema** (`arckit-claude/schemas/grants-handoff.schema.json`). 15-value `funder_type` allowlist, allowlist enums for organisation type / sector / geography / application status / complexity. No `score`, `rank`, or `recommendation` field — there is nowhere for a judgement to land in the schema even if the reader is overridden.
- **Grants scoring rubrics** (`arckit-claude/schemas/scoring-rubrics/grants-{generic,uk-gov}.yaml`). Six criteria summing to 100: `eligibility_fit` 35 (composite of organisation type / sector overlap / TRL band) / `funding_size_fit` 20 / `timing_fit` 15 (status + deadline proximity) / `complexity_burden` 10 / `historic_traction` 10 / `match_funding_burden` 10. UK-Gov overlay adds `funder_type_bonus` (UKRI / Innovate UK / NIHR / DSIT / DASA preferred) and `geography_bonus` (uk-wide preferred) as additive adjustments to the eligibility_fit per-criterion score before weighting.
- **CI coverage for the grants schema.** New `tests/plugin/test_validate_grants_handoff.mjs` (mirrors the datascout validator test) runs 2 valid + 5 reject fixtures (extra-property, oversized-field, off-allowlist funder_type, injection-inflated-score, injection-extra-org-type) through the shared `validate-handoff.mjs`. Wired into `.github/workflows/lint-markdown.yml`.

### Removed

- Single-tier `arckit-claude/agents/arckit-grants.md` and the stale generated extension agent files (`arckit-codex/agents/arckit-grants.{md,toml}`, `arckit-copilot/agents/arckit-grants.agent.md`, `arckit-gemini/agents/arckit-grants.md`, `arckit-opencode/agents/arckit-grants.md`). The orchestrator role lives in `arckit-claude/commands/grants.md` from this release onward.

## [4.17.1] - 2026-05-06

### Fixed

- **`/arckit:pages` now enumerates data-source profiles** introduced in v4.17.0. Wired the new `data-sources/{provider-slug}-profile.md` files through `sync-guides.mjs` (manifest scan + count + llms.txt entries), `pages-template.html` (sidebar section + search index category), and `commands/pages.md` (KPI table + manifest schema docs).

## [4.17.0] - 2026-05-06

### Added

- **Datascout spawns per-source profile files.** `/arckit:datascout` now produces one `projects/{P}-{NAME}/data-sources/{provider-slug}-profile.md` per scored data source (in addition to the main DSCT artefact), mirroring the `Spawned Knowledge` pattern from `/arckit:research`. Each profile carries the full reader-extracted evidence with citation links, the deterministic weighted score breakdown, and the project requirement IDs that pointed to that source. Re-running datascout on the same project applies merge rules (preserving narrative prose, replacing factual evidence + scores with the current run, appending project references). New template at `arckit-claude/templates/data-source-profile-template.md`.

## [4.16.6] - 2026-05-06

### Fixed

- **Telemetry now collects in plugin-only test repos.** `telemetry.mjs` and `session-learner.mjs` were silently exiting when `.arckit/` didn't exist — but plugin-only installs (test repos that use `extraKnownMarketplaces` and never run `arckit init`) only have `projects/`. Both hooks now treat either directory as a valid "ArcKit project" indicator and create `.arckit/memory/` on demand for the first telemetry write.

## [4.16.5] - 2026-05-06

### Fixed

- **Auto-allow hook now matches `${CLAUDE_PLUGIN_ROOT}` literal in commands** (was previously only matching the resolved absolute path; the orchestrator emits the env-var form which Claude Code passes through unexpanded to the hook).
- **Auto-allow `Read` of `/tmp/datascout-handoff*.json` tempfiles** so the orchestrator can re-inspect its own validator payloads without per-file prompts.
- **Forbid orchestrator from writing ad-hoc helper scripts.** LLM was hallucinating `dsct-score.mjs`, `dsct-build-writer-input.mjs`, etc. — added an explicit guardrail. All scoring math and payload assembly happens directly in conversation; the only bundled executables are the validator and `scripts/bash/*.sh` helpers.

## [4.16.4] - 2026-05-06

### Fixed

- **Auto-allow hook for plugin-internal Read/Bash now actually fires.** v4.16.2 registered `allow-plugin-internals.mjs` under `PermissionRequest`, but that event only fires for some tools and only when a permission dialog is about to show. Switched to `PreToolUse` with `permissionDecision: "allow"` in `hookSpecificOutput` — the documented pattern for blanket auto-allow on built-in Read/Bash. The datascout slash command's plugin-internal `Read`s and `Bash` invocations of bundled scripts now auto-approve.

## [4.16.3] - 2026-05-06

### Fixed

- **Datascout orchestrator moved from agent file to slash command.** Earlier 4.16.x releases placed orchestration in a subagent that dispatched reader/writer subagents — but Claude Code plugins forbid nested subagent dispatch (*"Subagents cannot spawn other subagents"*), so users hit *"Agent tool unavailable"* errors. Resolution: orchestration moved to `arckit-claude/commands/datascout.md` (the slash command runs in the main thread where `Agent` works). Reader and writer subagents and all security allowlists unchanged. `arckit-claude/agents/arckit-datascout.md` deleted.

## [4.16.2] - 2026-05-06

### Added

- `arckit-claude/hooks/allow-plugin-internals.mjs` — `PermissionRequest` hook that auto-approves the plugin's own internal Read/Bash patterns (any file under `${CLAUDE_PLUGIN_ROOT}/`, plus invocations of the bundled validator and `scripts/bash/*.sh` helpers). Stops the per-session permission prompts that the datascout orchestrator (and any future helper-script-using command) was triggering; non-plugin Read/Bash still falls through to the normal prompt.

## [4.16.1] - 2026-05-06

### Fixed

- **datascout: validator no longer requires `npm install` in plugin cache.** Rewrote `validate-handoff.mjs` as a pure-Node JSON Schema 2020-12 partial validator with zero npm dependencies, and removed `ajv` / `ajv-formats` from runtime deps. v4.16.0 had them in `package.json` but the plugin marketplace doesn't run `npm install`, so users hit `Error: Cannot find module 'ajv'` on first `/arckit:datascout` run. Also drops the orchestrator's "ajv-missing → legacy single-agent fallback" path, which had been surfacing a confusing secondary error about `.arckit/templates/`.

## [4.16.0] - 2026-05-06

### Security

- **datascout reader/orchestrator/writer split (#442 item 1).** `arckit-datascout` is now a three-tier agent: a reader subagent fetches external content with allowlist `WebSearch/WebFetch/MCP/Read` only (no `Write`/`Bash`/`Agent`), an orchestrator validates each reader's output against a JSON Schema and scores deterministically using a YAML rubric, and a writer subagent holds the only `Write` tool. Falls back to legacy single-agent mode when ajv is not installed. New files: `arckit-claude/agents/arckit-datascout-{reader,writer}.md`, `arckit-claude/agents/READER-PATTERN.md`, `arckit-claude/schemas/datascout-handoff.schema.json`, `arckit-claude/schemas/scoring-rubrics/{generic,uk-gov}.yaml`, `arckit-claude/scripts/validate-handoff.mjs`. New deps: `ajv` ^8, `ajv-formats` ^3.

### Added

- `arckit-claude/agents/READER-PATTERN.md` — reference doc for applying the three-tier split to other research agents.
- `arckit-claude/scripts/validate-handoff.mjs` — shared Node + ajv validator for any future handoff schema.

- **Prompt-injection hardening across all 10 research agents (#442).** Adopts patterns from `anthropics/financial-services` reference plugins:
  - **Tools allowlist (item 18).** Every research agent (`research`, `datascout`, `grants`, `aws-research`, `azure-research`, `gcp-research`, `gov-reuse`, `gov-code-search`, `gov-landscape`, `framework`) migrated from `disallowedTools: ["Edit"]` (denylist) to explicit `tools:` allowlist. New tools added to the Claude Code harness in future versions no longer auto-grant to existing agents. MCP entries enumerated per server (glob unsupported in plugin agent frontmatter — verified against current Claude Code docs).
  - **Guardrails section (item 1, partial).** Each agent body now opens with `## Guardrails` covering three primitives: untrusted-input boundary (web/MCP results never executed as instructions), citation discipline (every figure traceable to a URL or `[UNSOURCED]`), and human-decision boundary (named accountable officer per agent — SRO for research, bid director for grants, architecture board for cloud-research, etc.). The third financial-services primitive — write-tool isolation — defers to the future reader/orchestrator/writer split (#442 item 1, full).
  - **`What you produce` output contract.** Each agent body now front-loads its deliverable spec — "Given X, you deliver: 1, 2, 3" — replacing the scattered output description that previously lived inside `Your Core Responsibilities` and the Process steps.
  - **`Toolchain` trailing index.** Each agent body now ends with a flat list of templates, helper scripts, MCP servers, external tools, and related ArcKit commands — the equivalent of financial-services' `Skills this agent uses` adapted to ArcKit's reality (our agents don't dispatch sub-skills).
  - **Converter:** `tools` added to `CLAUDE_ONLY_AGENT_FIELDS` so the allowlist strips cleanly when generating Codex/OpenCode/Gemini/Copilot/Paperclip extensions (which have their own tool models). `Guardrails`, `What you produce`, and `Toolchain` body sections propagate unchanged to all 6 downstream formats.
  - **CLAUDE.md:** corrected outdated guidance — `tools` is now a valid plugin agent frontmatter field (allowlist), with `disallowedTools` applied first then the allowlist resolved against what remains.

## [4.15.2] - 2026-05-05

Documentation-only patch.

### Fixed

- **Citation traceability now covers MCP queries and web fetches (#283, #437).** `arckit-claude/references/citation-instructions.md` previously only covered files under `external/`, `policies/`, `vendors/`, leaving the External References section empty for the 10 research agents (`gov-reuse`, `research`, `datascout`, `aws-research`, `azure-research`, `gcp-research`, `gov-code-search`, `gov-landscape`, `grants`, `framework`) whose evidence is mostly MCP-sourced or web-fetched. The same Document Register / Citations / Unreferenced Documents tables now cover three source types: **Document** (unchanged), **MCP Query** (per-server prefix `GRSC` / `AWSK` / `MSL` / `GDK` / `DC` plus `Q`-index, one row per unique query), and **Web URL** (`WEB-N`, one row per unique fetched URL). WebSearch remains exploratory and does not produce citations. Two new categories added: `Reuse Evidence` and `Market Evidence`. No template changes — the existing 5-column structure is reused; only the per-cell semantics extend. No agent file changes — all 10 research agents already point at `citation-instructions.md` via a shared one-line directive. Extension copies regenerated by `scripts/converter.py`.

## [4.15.1] - 2026-05-05

Documentation-only patch.

### Documentation

- **Remote Control + push notifications adoption (#426, closes #369).** Adds a "Long runs: Remote Control + push notifications" section to the six research-heavy command guides (`research`, `datascout`, `aws-research`, `azure-research`, `gcp-research`, `grants`) — each tailored to that command's typical decision points. Adds a "Phone pings via Remote Control" subsection to `autoresearch.md`, sibling to the existing Monitor guidance, oriented at overnight runs paired with `ENABLE_PROMPT_CACHING_1H=1`. Adds a "Remote Control + push notifications (user-facing)" section to `CLAUDE.md` under the Monitor Tool docs, including pairing with the `stale-artifact-scan` monitor. Floor reference correctly states v2.1.121 (current minimum) covers the v2.1.110 RC requirement.

## [4.15.0] - 2026-05-05

Ships the Canada Federal Overlay alongside the v4.14.0 platform-capability adoption from earlier the same day.

### Added

- **Canada Federal Overlay (community)** — 12 new `ca-*` commands covering FITAA, PIA, ATIP, AIA, Charter, ITSG-33, SOIA, GC sovereign cloud residency, GC Digital Standards, Official Languages Act, federal procurement (PSPC + PSAB), and First Nations OCAP®.
- 12 new templates (`.arckit/templates/ca-*-template.md` plus plugin mirrors).
- 12 new guides (`docs/guides/ca-*.md` plus plugin mirrors).
- 12 new type codes registered in `arckit-claude/config/doc-types.mjs`: `FITAA`, `PIA`, `ATIP`, `AIA`, `CHRT`, `ITSG`, `SOIA`, `CACR`, `DIGSTD`, `OLA`, `PROC`, `OCAP`.
- `ca-federal-fitaa` build recipe with execution chains and Mermaid flow diagrams.
- Codex / OpenCode / Copilot / Paperclip extension formats regenerated.

### Changed

- Total command count: 104 → 116 (70 official + 46 community).

## [4.14.0] - 2026-05-05

Adopts Claude Code v2.1.117–v2.1.128 high-value capabilities (#427). Plugin minimum bumped to **v2.1.121**; plugin auto-update applies the new floor on next `claude plugin update`.

### Added

- **MCP `alwaysLoad` on `aws-knowledge` and `microsoft-learn` (#428, v2.1.121+).** Skips tool-search deferral so research commands see the MCP tools on turn 1 of `/arckit:aws-research` and `/arckit:azure-research`. Removes a discovery round-trip per session.
- **PostToolUse `hookSpecificOutput.updatedToolOutput` on `provenance-stamp.mjs` and `update-manifest.mjs` (#429, v2.1.121+).** The model now sees a one-line summary of what each silent file-mutating hook did — effort requested vs. effective (with downgrade reason if any), manifest sync confirmation. Closes a long-standing visibility gap; the auditable downgrade signal that issue #407 was filed for is now in-band, not just stamped on disk.
- **Session telemetry — `telemetry.mjs` hook + session-learner aggregation (#430, v2.1.84 / v2.1.119+).** Captures `duration_ms` for every tool call, `mcp__govreposcrape__*` calls (server, tool, sanitised args), and `TaskCreated` agent spawns. Aggregated into a one-line `**Telemetry:**` summary on every `sessions.md` entry — p50/p95 latency, top-3 agents, MCP call counts.
- **Dashboard surface for telemetry (#431).** Two new panels on the Architecture Governance Dashboard — *Session Telemetry* (aggregate KPIs across last 10 sessions) and *Recent Sessions* (last 5 with detail). Fed by `docs/telemetry.json` written by `session-learner.mjs` when `docs/` exists.
- **Community-recipes call article (#425).** "Wanted: Community Recipes" published at `docs/articles/` with hero PNG.

### Changed

- **Documented Claude Code minimum bumped from v2.1.117 to v2.1.121 (#430).** `version-check.mjs` SessionStart hook updated; warning copy lists the four new feature dependencies (`alwaysLoad`, `updatedToolOutput`, `duration_ms`, `claude plugin tag`).
- **Release flow uses `claude plugin tag --dry-run` (#428, v2.1.118+).** Validates plugin/marketplace version agreement before `git tag` runs — catches version drift across the 15 version files. `claude plugin prune --dry-run` also documented for orphaned-dependency cleanup.
- **`scripts/converter.py` filters `alwaysLoad` from generated Codex `config.toml` (#428).** Claude-only MCP fields no longer leak into other extensions; introduces a `CLAUDE_ONLY_MCP_FIELDS` set for future Claude-only keys.
- **Session housekeeping (#419).** Memory log cleanup, plugin enablement, and `.gitignore` refinement.

## [4.13.1] - 2026-05-03

Same-day follow-up to v4.13.0. All additive enhancements to the build harness.

### Added

- **`uae-federal-ai` recipe (#414).** Third built-in recipe for UAE Cabinet agentic AI decree compliance: 48 targets, all 12 UAE community commands, integrated research wave.
- **Research wave on `uk-saas` and `uk-mod-sovereign` (#417).** Default-on per-project research targets (RESEARCH, AWS, Azure, GCP, GOV_REUSE for UK only, DATASCOUT optional). Both recipes now ship 38 targets each.
- **`ORG_RESEARCH` upstream target (#417, #414 amendment).** New first-wave target on all three built-in recipes. Researches the target organisation once per repo, output to `projects/000-global/research/`, shared across every project.

### Documentation

- `/arckit:build` listed in `commands.html`, `guides.html`, and `DEPENDENCY-MATRIX.md` (#416).
- `sitemap.xml`, `llms.txt`, and `getting-started.html` refreshed for v4.13.0+ (#415).
- Getting-started recipe-count banner updated to reflect the post-research-wave shape.

## [4.13.0] - 2026-05-03

### Added

- **`/arckit:build` parallel build harness (#410).** New plugin skill and slash command for end-to-end ArcKit artefact generation. Reads a YAML recipe, dispatches one subagent per target per wave in parallel, commits each wave as one atomic git commit, and persists progress to `projects/{P}/.arckit/state.json` for resumability. Ships two built-in recipes: `uk-saas` (31 targets) and `uk-mod-sovereign` (32 targets). Custom recipes go in `.arckit/recipes/{name}.yaml`. Claude Code only — depends on parallel Agent tool dispatch which other targets do not support.
- **Provenance stamping hook (#409).** `provenance-stamp.mjs` injects a machine-readable `## Build Provenance` block into every ArcKit artefact, recording build recipe / wave / target plus requested vs effective effort levels. Auditable trail for governance reviewers.
- **Build harness launch article (#411).** New essay at `docs/articles/2026-05-03-build-harness-parallel-architecture-generation.md` with hero image. Surfaced on `articles.html` and `index.html`.
- **`uk-mod-sovereign` recipe.** Sovereign / air-gapped variant for MOD and accredited environments. Replaces civilian SbD with MOD Secure by Design, adds JSP 936 AI assurance, drops Service Standard assessment, rewrites all eight ADR topics for sovereign deployment.

### Fixed

- **CLAUDE.md ADR/DIAG path documentation (#408).** The project structure tree now shows ADRs in `decisions/` and diagrams in `diagrams/` subfolders, matching what `/arckit:adr` and `/arckit:diagram` actually produce.

## [4.12.3] - 2026-05-01

### Fixed

- **`/arckit:traceability` actually now reports correct coverage (#389).** Previous v4.12.2 attempt fixed regex namespace collisions but the actual bug was elsewhere: `formatTraceability` reads `node.reqIds` for every non-REQ artifact to build the coverage `refMap`, but `node.reqIds` is only assigned by `scanAllArtifacts` when the caller passes `withNodeMetadata: true`. The traceability recipe did not request that flag, so `reqIds` was always `undefined` and `refMap` always empty. Verified end-to-end against the issue's reproduction repo: coverage now reports 41 of 53 requirements (77%) with proper citation lists per requirement.

## [4.12.2] - 2026-05-01

### Fixed

- **`/arckit:traceability` reported 0% coverage on legacy projects with 1-2 digit REQ IDs (#389).** The v4.12.1 fix loosened the REQ-doc heading extractor but kept the universal `REQ_ID_PATTERN` strict at `\d{3}` to avoid namespace collisions with non-REQ artifacts. Side-effect: cross-references like `BR-1, FR-3, NFR-SEC-7` in `RSCH` / `RISK` / `STKE` / `SOBC` / `WARD` / UAE-overlay compliance assessments were not extracted, so `node.reqIds` came back empty and `formatTraceability` reported zero coverage even when 14 sibling artifacts genuinely cited the requirements. Universal scanner now also accepts `\d{1,3}`.
- **`templates/azure-research-template.md`** — Azure Security Benchmark "Backup & Recovery (BR)" row renamed to `BCK-N` to remove the namespace collision with Business-Requirement IDs. Previously `BR-1, BR-2, BR-3` in the ASB control table would, after the loose-pattern fix, be picked up as REQ cross-references. AWS and GCP research templates checked and confirmed clean (no equivalent collisions).

### Known limitations

- `templates/fr-anssi-carto-template.md` line 144 still uses `INT-01` for network-interconnection IDs, which collides with the REQ Integration namespace. Currently affects only French ANSSI cartography artifacts. Will be addressed in a follow-up.

## [4.12.1] - 2026-05-01

### Fixed

- **Templates aligned to 3-digit REQ IDs** — `requirements-template.md`, `traceability-matrix-template.md`, `hld-review-template.md`, and `jsp-936-template.md` previously used `BR-1` / `FR-1` / `NFR-P-1` placeholder form. 24 of 27 surveyed test-repo REQ documents already use 3-digit zero-padded form (`BR-001`); only the most recent 3 followed the templates literally and broke the hook. Templates now consistently use the 3-digit form. Affects all template copies (`arckit-claude`, `.arckit`, and the five extension templates regenerated by `scripts/converter.py`). `azure-research-template.md` (Azure Security Benchmark `BR-N` namespace) and `fr-anssi-carto-template.md` (`INT-NN` network-interconnection IDs) were intentionally left unchanged — different namespaces (#386).
- **`hooks/hook-utils.mjs`** — `extractRequirementDetails` heading regex now accepts 1-3 digit numeric suffixes (`### BR-1:`, `#### FR-12:`, `### BR-001:`). Previously hardcoded `\d{3}`, which silently dropped requirements from any REQ document using non-padded IDs — leaving `/arckit:traceability` with an empty graph and forcing the manual fallback. The universal `REQ_ID_PATTERN` scanner stays strict at `\d{3}` to avoid false positives in non-REQ artifacts that use the same prefix in a different namespace (#386).
- **`hooks/graph-inject.mjs`** — `formatTraceability` now emits a diagnostic message when no requirements can be extracted from a project that has artifacts, instead of returning `null` silently. The hook bail-out is now visible in the prompt context so the failure mode looks like a hook problem rather than a missing hook (#386).
- **`hooks/graph-inject.mjs`** — `DR-\d{3}` data-requirement detector loosened to `DR-\d{1,3}` so the "missing data-model" recommendation correctly fires for projects with shorter `DR-N` IDs.

## [4.12.0] - 2026-05-01

### Added

- **Document Map + Dashboard graph health rollups (#383).** The `/arckit.pages` dashboard now visualises the same health/coverage/compliance signals that `/arckit.navigator` and `/arckit.graph-report` compute, sourced from a shared rollup module so there is no duplicate scan.
  - **`arckit-claude/hooks/graph-rollups.mjs`** — new shared module exporting `tagNodeHealth()`, `computeAllProjectRollups()`, and the canonical `HIGH_SEVERITY_TYPES` / `ESSENTIAL_TYPES` / `CONTEXTUAL_TYPES` / `STALE_THRESHOLD_DAYS` constants used by both `graph-inject.mjs` and `sync-guides.mjs`.
  - **`manifest.json` enrichments** (written by `sync-guides`):
    - `dependencyGraph.nodes[*].health = { stale, draft, orphan, ageDays }` per node.
    - `manifest.projectHealth` block with per-project coverage %, compliance readiness %, density, recommendations (top 3), stale/draft/orphan counts.
  - **Document Map** tints nodes by health (stale = red border, draft = amber dashed, orphan = existing dashed); legend extended with three health swatches; tooltip shows a `⚠ Stale (151d) · Draft` row when any flag is set.
  - **New "Project Health & Next Steps" dashboard panel** renders one card per project with coverage / compliance gauges, health badges, and the top 3 recommended commands.
  - **`docs/llms.txt`** gains an opt-in `## Project status` section — one line per project with coverage %, compliance %, draft/stale/orphan counts, and the top recommended next command. Lets external agents fetch llms.txt and answer "where is this repo at" without scraping the dashboard.

### Changed

- **`graph-inject.mjs` constants extracted** to `graph-rollups.mjs` (no behaviour change). All `/arckit.navigator`, `/arckit.graph-report`, `/arckit.health`, `/arckit.analyze`, `/arckit.traceability` outputs are byte-stable.
- **`sync-guides.mjs`** now passes `{ withNodeMetadata: true }` to `scanAllArtifacts` so dependency-graph nodes carry version, owner, classification, and `reqIds`. Manifest size grows roughly 50–60% on typical projects (e.g. 80 KB → 127 KB for a 38-artifact project).
- **Hooks guide** (`docs/guides/hooks.md` + `arckit-claude/docs/guides/hooks.md`) refreshed: the per-command `*-scan.mjs` rows that were superseded in v4.11.0 are now replaced with a single `graph-inject` row listing all seven matchers; `graph-rollups.mjs` added to the Utility Files table; `sync-guides` description updated to mention the new manifest enrichments.

### Internal

- All seven `pages-template.html` copies (plugin + `.arckit/templates/` + 5 generated extension copies) propagated via `python scripts/converter.py` after the plugin source change. The `.arckit/templates/` CLI fallback was 10 days behind the plugin source and has been re-synced.

### Breaking changes

None. Manifest schema is additive — older dashboard JS that does not read `dependencyGraph.nodes[*].health` or `manifest.projectHealth` continues to render correctly. Non-Claude distributions (Codex / Copilot / OpenCode / Gemini / Paperclip) ship the new template but do not run the hook, so `manifest.projectHealth` is absent and the new panel renders nothing — no regression. Wiring those distributions into the rollup is a separate piece of work.

## [4.11.0] - 2026-05-01

### Added

- **`/arckit.navigator` (Live, Utility)** — project-level GPS that surfaces coverage against the essential ArcKit baseline, flags DRAFT / stale / orphan artifacts, and recommends the next slash command to run. Read-only diagnostic; no files written. Driven by the new `graph-inject` hook.
- **`/arckit.graph-report` (Live, Utility)** — governance metrics dashboard across every working project under `projects/`. Reports coverage by category, cross-reference density, compliance readiness, and project comparison. Read-only diagnostic; no files written.
- **`graph-inject.mjs` hook** (`arckit-claude/hooks/graph-inject.mjs`) — single graph-builder pass that consolidates what used to be five per-command scan hooks (`search-scan`, `impact-scan`, `traceability-scan`, `health-scan`, `governance-scan`). Search / impact / traceability / health / analyze commands now consume the unified graph.
- **`graph-utils` v2** (`arckit-claude/hooks/graph-utils.mjs`) — additive opts for the graph-builder API: `withNodeMetadata`, `withContent`, `withPreview`. Backward compatible — existing callers continue to work without change; the new opts are opt-in only.
- New guides: `docs/guides/navigator.md`, `docs/guides/graph-report.md` (mirrored to `arckit-claude/guides/`).

### Changed

- **Hook architecture consolidation.** `/arckit.search`, `/arckit.impact`, `/arckit.traceability`, `/arckit.health`, and `/arckit.analyze` migrated from per-command scan hooks onto the unified `graph-inject` pipeline. Net effect: one graph build per session instead of five separate scans, simpler maintenance, identical user-visible output.
- Officially-maintained baseline: 68 → **70 commands**. Community-contributed overlays unchanged at 34 (EU 7 + FR 12 + AT 3 + UAE 12). Total commands available across all tiers: 104.

### Internal

- 8 PRs merged earlier today: #360, #362, #363, #364, #365, #366, #367, plus replacement PRs #377 (search) and #378 (matrix doc). All source code already on `main` before this docs/release follow-up.

### Breaking changes

None. All hook migrations are output-equivalent; the new commands are additive.

## [4.10.1] - 2026-04-30

### Changed

- **UAE Federal Overlay reclassified from official-baseline to community-contributed.** The 12 `uae-*` commands shipped earlier today as part of the officially-maintained baseline (68 → 80). Within hours the maintainer reclassified them to community-contributed; v4.10.1 lands the corrective metadata. Officially-maintained baseline returns to 68; community-contributed overlays grow from 21 (EU + FR + AT) to 33; total commands available across all tiers stays at 101.

  Reason: solo CODEOWNERS at the official tier is not a sustainable maintenance posture for fast-moving UAE federal regulatory text without a UAE domain co-maintainer. The official-tier citation-accuracy SLA (quarterly review across the federal corpus, regression sweep across 47 reference repositories, output that an architect can hand to counsel without a paragraph of caveats) needs more than one pair of eyes on regulatory text that is still settling. The community marker is the responsible reading frame; recruiting a UAE domain co-maintainer remains the v4.11 priority. Once one joins, the overlay becomes a candidate for official-tier promotion in a future release.

  What changed (metadata only):
  - `[COMMUNITY]` prefix added to the `description:` frontmatter on all 12 `uae-*` command files (matching the `eu-*`, `fr-*`, `at-*` pattern).
  - Inline warning banner added immediately after the YAML frontmatter on each command body, listing UAE Cabinet / PDPL / IAS / Cybersecurity Council as the citation authorities to verify against.
  - `Template Origin: Community` set on all 24 `uae-*` template files (12 in `arckit-claude/templates/`, 12 in `.arckit/templates/`).
  - `EXPERIMENTAL` status tag in place of `LIVE` on the two UAE guides on `docs/guides.html`, and on the 12 UAE rows on `docs/commands.html` (`data-status="experimental"`, prefixed `[COMMUNITY]` descriptions, matching the existing 21 community rows).
  - README "UAE Federal Overlay" section heading changed from "(Official Baseline)" to "(Community-contributed)" with updated banner copy; `docs/index.html`, `docs/articles.html`, and the launch and decree articles in `docs/articles/` updated to community framing.
  - `arckit-claude/config/doc-types.mjs` UAE block comment updated to reflect community-contributed status with co-maintainer recruiting note.
  - `.github/CODEOWNERS` UAE block comment updated to flag community-contributed status with promotion gated on co-maintainer commitment.

  What did NOT change (fully backwards-compatible):
  - All 12 command names (`/arckit.uae-*`).
  - All UAE doc-type codes (`PDPL`, `IAS`, `SDC`, `NCSP`, `UPS`, `ZBUR`, `DREC`, `DSHR`, `NPRA`, `AICH`, `AAUT`, `UPRC`).
  - All frontmatter `handoffs:` chains.
  - All template structures and section bodies.
  - The Document Control conditional rendering rules and the `<!-- DOC-CONTROL-HEADER -->` marker mechanism.
  - The Smart Data classification ladder rendering when `governance_framework: UAE Federal` and `classification_scheme: UAE Smart Data` are set.
  - The canonical chain across the 12 commands.
  - The dual-registration test (`scripts/tests/test-doc-types-dual-registration.mjs`).
  - The `arckit migrate-classification` one-time CLI helper.

## [4.10.0] - 2026-04-30

### Added

- 12-command UAE Federal Overlay as official baseline (68 → 80 commands):
  - Federal data + security: `uae-classification`, `uae-pdpl`, `uae-ias`, `uae-cloud-residency`
  - Federal identity: `uae-uaepass`
  - Cabinet instruments: `uae-zero-bureaucracy`, `uae-digital-records`, `uae-data-sharing`, `uae-priorities-alignment`
  - AI governance: `uae-ai-charter`, `uae-ai-autonomy-tier`
  - Procurement: `uae-procurement`
- New `classification_scheme` plugin userConfig (UK or UAE Smart Data).
- `arckit migrate-classification` one-time CLI helper for migrating existing artefacts from UK ladder to UAE Smart Data.
- Dual-registration CI test catching `doc-types.mjs`/`pages.md` drift.
- New guide `docs/guides/uae-overlay.md` and maintenance doc `docs/guides/uae-overlay-maintenance.md`.

### Changed

- `governance_framework` userConfig description extended to recommend `UAE Federal` as a third value.
- All ~83 templates per directory: Document Control table replaced with `<!-- DOC-CONTROL-HEADER -->` marker resolved at command-execution time.

### Breaking changes

None. Non-UAE projects produce byte-identical Document Control output to v4.9.4.

### Deferred to v4.11 / v5.0

- Bilingual Arabic / English (`uae-translate`).
- Federal Mandate doc-types category (currently the four Cabinet instruments sit under `Governance`).
- Sector overlays (ADHICS, Dubai ISR) as community contributions.

## [4.9.4] - 2026-04-28

### Docs

- Added `arckit-claude/docs/guides/custom-commands.md` (mirrored to `docs/guides/custom-commands.md`) — authoring guide for contributors adding new `/arckit.*` commands. Covers the converter fan-out from the plugin source to six target formats, frontmatter reference, the `$ARGUMENTS` placeholder rewriting table, template-handling differences between Paperclip (embedded) and other targets (verbatim copy), a worked `/arckit.sla` example, the commands/skills/agents/hooks decision table, and a testing checklist. Indexed in `docs/README.md` under a new Contributing subsection. Authored by @Yumstezy (#111, #357)

### Fixed

- `arckit-claude/hooks/allow-mcp-tools.mjs` now auto-allows `mcp__govreposcrape__` tool calls. Four of the five bundled MCPs were already in the auto-allow list — govreposcrape was missing, so every `/arckit.gov-reuse`, `/arckit.gov-code-search`, and `/arckit.gov-landscape` run was hitting a permission dialog on every tool call (#215, #358)
- `scripts/converter.py` no longer recreates `arckit-paperclip/scripts/bash` and `arckit-paperclip/scripts/python` on every run. PR #353 deleted these script directories in favor of the TS-native `src/lib/arckit.ts`, but the converter's `copy_extension_files` loop kept blindly copying them back. New `copy_scripts_to_extension` flag (defaults `True`) on `AGENT_CONFIG` is set to `False` for paperclip; other extensions are unaffected (#356)

## [4.9.3] - 2026-04-28

### Added

- `/arckit.pages` dashboard now surfaces HTML deck artifacts (e.g. `ARC-001-DECK-v1.0.html`) alongside markdown documents in project artifact lists. New `DECK` doc-type code registered in `arckit-claude/config/doc-types.mjs` and the `sync-guides` hook (#354)

### Changed

- `arckit-paperclip` plugin restructured to align with the Paperclip TS plugin authoring-guide spec. Helper bash and python scripts replaced by `src/lib/arckit.ts` library; `manifest.ts`, `command-tools.ts`, `utility-tools.ts`, and `worker.ts` simplified accordingly. Net `-2,507` LOC across the plugin, removes script-execution surface, unblocks future TS-native tool additions (#353)
- `arckit-claude/.claude-plugin/plugin.json` declares `"$schema": "https://json.schemastore.org/claude-code-plugin-manifest.json"` for editor autocomplete and IDE-side validation. Recognised by `claude plugin validate` since Claude Code v2.1.120; forward-compatible because Claude Code ignores `$schema` at load time, so no minimum-version bump (#215, #355)

## [4.9.2] - 2026-04-24

### Changed

- Documented minimum Claude Code version bumped from v2.1.112 to **v2.1.117**. The v2.1.117 release fixes Opus 4.7's `/context` calculation to use the model's native 1M window (was 200K, causing ArcKit's long deep-research and synthesis sessions to autocompact prematurely) and loads agent frontmatter `mcpServers` for `--agent` sessions (lets research agents declare their own MCP surface). Also pulls in the v2.1.116 `gh` rate-limit hint surfacing (benefits 10 research agents and govreposcrape callers), faster MCP startup with multiple stdio servers, and the WebFetch hang fix on very large HTML pages. Updated: `arckit-claude/hooks/version-check.mjs` (`MIN_CLAUDE_CODE_VERSION`), README "Why" blocks, and `mcp-servers.md` prerequisites in plugin + 5 extension dirs (#215, #352)
- `/guides` page now lists all 110 guides; articles page font and hero colour fixed (#350)

### Postmortem context

The v2.1.117 floor independently clears all three Claude Code regressions described in [Anthropic's April 23 postmortem](https://www.anthropic.com/engineering/april-23-postmortem) (effort default lowered Mar 4 – Apr 7, thinking-cache clearing bug Mar 26 – Apr 10 fixed in v2.1.101, "≤25 words between tool calls" verbosity rule Apr 16 – Apr 20 fixed in v2.1.116). Users on v2.1.117+ are clear of all three. ArcKit users who saw thin or context-disconnected outputs from `/arckit.requirements`, `/arckit.research`, `/arckit.sobc`, or `/arckit.autoresearch` between Mar 26 and Apr 20 should re-run on v2.1.117+ for restored quality.

## [4.9.1] - 2026-04-22

### Fixed

- `/arckit.wardley` and `/arckit.wardley.value-chain` quoting rule now treats any whitespace-separated pure-digit word as non-simple, forcing quotes on names like `NIS 2031 FDI Outcomes Reporting`, `ISO 27001 Controls`, `Windows 11 Deployment`, and `Log4j 2024 CVE`. The mermaid `wardley-beta` parser tokenises bare numeric words as numeric literals and fails rendering with `Expecting token of type '[' but found '2031'` (#349)
- `validate-wardley-math.mjs` Stop-hook now runs a 4th check against `mermaid` / `wardley-beta` blocks: scans `component` / `anchor` / `evolve` / `pipeline` / `->` lines, strips quoted and decorator segments, and blocks Stop on any remaining bare-digit word — catches regressions before the rendered page errors (#349)

### Changed

- `docs/guides/enterprise-scale.md` now copied into the 4 extension directories (`arckit-codex`, `arckit-copilot`, `arckit-opencode`, `arckit-paperclip`) that were missing it (converter catch-up) (#349)

## [4.9.0] - 2026-04-21

### Added

- OWM → Mermaid `wardley-beta` conversion fidelity suite: `tests/mermaid-wardley/test-fidelity.mjs` parses every Wardley map in `swardley/WARDLEY-MAP-REPOSITORY`, converts via `convert.mjs`, re-parses, and reports component / anchor / link retention, `|Δε|`, `|Δν|`, pooled drift distribution. Methodology modelled on `tractorjuice/wardleymap_math_model/skills/wardley-map-workspace/compare_all_25.py`. Current result: 100% component / anchor / link retention, `|Δε|` = 0 exactly across 4,905 matched pairs (#339)

### Fixed

- Wardley converter now handles OWM's hybrid `pipeline X [min, max] { 1-D children }` syntax and `evolve` names containing `/.X`. Real-world parse rate 144/147 → 146/147 (the remaining failure is an upstream source-data typo unfixable at the converter layer) (#340)
- Wardley command guidance (`/arckit.wardley`, `/arckit.wardley.value-chain`) plus converter adopt **conditional quoting** based on the `wardley-beta` grammar's `NAME_WITH_SPACES` terminal. Quote names that fall outside `[A-Za-z][A-Za-z0-9_()&]*(?:[ \t]+[A-Za-z(][A-Za-z0-9_()&]*)*` — hyphens, dots, slashes, leading digits — or whose first word matches / prefixes a reserved keyword (`labelling`, `marketplace`, `evolved`, `build release cycle`). Previously-unquoted hyphenated names like `Real-Time Data Processing` or `GPT-4 LLM Service` broke rendering because Mermaid's lexer read the `-` as the start of `->` (#341)
- Wardley converter preserves `label [x, y]` offsets from OWM sources across all three emission sites (top-level components, explicit pipeline-block children, auto-injected pipeline children). Previously every label was silently dropped — 20 lost in `sustainability/introduction example` alone. Respects the three `wardley-beta` grammar rules found along the way: label offsets must be integers (rounded at emission), `anchor` doesn't accept `label` (dropped silently), and `label` must precede decorators on a component line (#344)

### Changed

- Pages-template CDN bumped `mermaid@11.4.1` → `mermaid@11.14.0` across all six `pages-template.html` files (plugin + 5 extensions + `.arckit/templates/`). Mermaid 11.14.0 (2026-04-01) ships the `wardley-beta` diagram type, so generated `docs/index.html` pages now render Wardley maps inline (#337)
- Test suite `tests/mermaid-wardley/` moves from the `pkg.pr.new/mermaid@7147` pre-release build to official `mermaid@^11.14.0`. No behaviour drift — 18/18 synthetic fixtures + 144/147 real-world maps pass, same as pre-release (#338)

### Companion

- Published [`tractorjuice/wardley-maps-mermaid`](https://github.com/tractorjuice/wardley-maps-mermaid) — a public mirror of `swardley/WARDLEY-MAP-REPOSITORY` with each of the 147 maps converted to Mermaid `wardley-beta` alongside the OWM source. All 147 render cleanly under Mermaid 11.14.0. Includes `tools/convert.mjs` + `tools/regenerate.mjs` for local regeneration. Content licensed CC-BY-SA 4.0 matching upstream

## [4.8.0] - 2026-04-20

### Added (Community-contributed)

> ⚠️ The 3 Austrian regulatory commands below are a seed contribution. The verification pass in #333 resolved the majority of `[NEEDS VERIFICATION]` markers with domain-authoritative citations (NISG BGBl. I Nr. 94/2025, VO 2023/2495 thresholds, three-tier CERT reporting, §107 BVergG accessibility). Remaining flagged items (DSB enforcement positions, Land competence boundaries, command-prompt internals) should still be reviewed by an Austrian practitioner (DPO / CISO / Vergabejurist) before external reliance. See #304 for the overlay design.

- `/arckit.at-dsgvo` — [COMMUNITY] assess Austrian DSG / DSGVO obligations — Datenschutzbehörde patterns, §§12–13 DSG image processing, ELGA/GTelG health, §96a ArbVG employee monitoring, age 14 consent
- `/arckit.at-nisg` — [COMMUNITY] assess Austrian NISG (idF BGBl. I Nr. 94/2025 — NIS2 transposition) — Essential/Important designation, three-tier CERT reporting (Sectoral → CERT.at → GovCERT), KSÖ, AT sectoral authorities
- `/arckit.at-bvergg` — [COMMUNITY] generate Austrian BVergG 2018 procurement documentation — Oberschwellen/Unterschwellen (€221K / €443K / €5,538K per VO 2023/2495), ANKÖ, Bestbieterprinzip, BVwG review
- `/arckit.fr-irn` — [COMMUNITY] structure an IRN (Indice de Résilience Numérique) self-assessment following the aDRI framework — 8 resilience pillars × 5 organisational layers. References the official methodology at gitlab.com/digitalresilienceinitiative/adri-irn rather than reproducing scoring criteria (CC BY-NC-ND 4.0 licence incompatible with ArcKit's MIT licence; living standard that evolves actively). Generates `ARC-{id}-IRN-v1.0.md` with scoring scaffold, pre-populated context from existing project artifacts, and clear handoff to the official aDRI evaluation grid (#322)

Registered 3 new doc type codes (ATDSG, ATNISG, BVERGG) in both `arckit-claude/config/doc-types.mjs` and `arckit-claude/commands/pages.md` (dual-registration pattern established in #317). @gtonic added as Austrian domain maintainer; CODEOWNERS lines for `at-*` staged but left commented pending explicit acceptance.

### Fixed

- Extensions: propagate the `.guide-status.community` CSS rule to `pages-template.html` so community-contributed guides render with the correct visual marker in the generated dashboard (#327)
- `sync-guides` hook: register the 18 EU/FR community guide stems so `/arckit.pages` includes them when syncing guide cards into the dashboard
- AT DSG template drift: `arckit-claude/templates/at-dsgvo-template.md` was left at the 220-line seed after #333 enriched only the `.arckit/` copy, which would have served plugin and extension users the pre-verification template. Mirrored the enriched `.arckit/` copy into `arckit-claude/` and re-ran `scripts/converter.py` to propagate to the 4 extension copies

### Docs

- Added @gtonic as a code contributor and Austrian domain maintainer in `docs/contributors.html` (hero stat 8 → 9, Community Impact refreshed to include Austrian regulatory coverage) (#328)
- Moved the architecture book, research, and plan content out to a dedicated `tractorjuice/arckit-book` repo and updated pointers in `wiki.json` accordingly (#324, #325)
- Added `.devin/wiki.json` to steer DeepWiki generation
- Added a Star History chart to `README.md` above Quick Start, with cache-buster query to keep the badge fresh
- Tidied `docs/superpowers/`: deleted shipped plans/specs and added a README explaining the directory's purpose (#326)
- Added design spec and implementation plan for consolidating the dual artifact-type registry (`arckit-claude/config/doc-types.mjs` + the `/arckit.pages` allow-list) into a single source of truth — design only, not yet implemented

## [4.7.2] - 2026-04-19

### Added

- `## Key References` tables in all 18 EU/French community commands pointing to authoritative regulatory sources (EUR-Lex, ANSSI, CNIL, EDPB, ENISA, MITRE), following the existing pattern used by official ArcKit commands (#321)
- 36 new usage guides (18 commands × 2 locations: `docs/guides/` + `arckit-claude/docs/guides/`) for the EU/FR community commands, all carrying `Guide Origin: Community` to preserve provenance. Each guide follows the standard ArcKit guide format: inputs table, syntax, document structure, one-page workflow, review checklist (#321)
- `tests/plugin/test_template_consistency.py` — parametrised test asserting every command-referenced template exists in both `arckit-claude/templates/` and `.arckit/templates/`, and that the two directories stay in sync (#321)
- `tests/plugin/test_commands_structure.py` — `STRICT_COMMANDS` set covering the 18 community commands; enforces presence of `## User Input`, `## Instructions`, `## Success Criteria`, `## Example Usage`, labelled code fences, and no trailing spaces (#321)
- Spec and implementation plan for adding a dedicated community-commands table to `docs/commands.html` (not yet implemented)

### Fixed

- Multiple stale command-count references across `docs/`: `commands.html` hero stat, `<h2>` heading, meta tags, schema, and filter UI all showed `67` instead of the correct baseline of `68` (the `/arckit.grants` row was also missing from the main table and has been added). `docs/getting-started.html` updated from "67 commands" to "68 commands" in 5 locations
- Internal inconsistency in `docs/DEPENDENCY-MATRIX.md`: REQ fan-in was listed as "36 commands" in one place and "37 commands" in another (list contains 37); stakeholders fan-out was listed as both "22 commands" and "23 commands" (list contains 23). Corrected to match the actual lists
- Stale historical reference "all 40 commands across 16 tiers" in `docs/WORKFLOW-DIAGRAMS.md` updated to 68

### Changed

- `README.md` and `docs/DEPENDENCY-MATRIX.md` updated to document the 18 EU/FR community commands: README adds a `### Phase 14.5: Compliance Assessment (EU and French Government)` workflow section (top-line count stays at 68 — community counted separately per policy); DEPENDENCY-MATRIX adds a `2026-04-19` changelog entry with dependency graph and typical compliance paths (#321)
- Regenerated extension artefacts for the 18 community commands via `scripts/converter.py`: Paperclip `src/data/commands.json` refreshed to include new Key References; 90 community guide files copied into extension directories (`arckit-codex/docs/guides/`, `arckit-copilot/docs/guides/`, `arckit-gemini/docs/guides/`, `arckit-opencode/docs/guides/`, `arckit-paperclip/docs/guides/`)

## [4.7.1] - 2026-04-19

### Fixed

- `/arckit.pages` was silently omitting the 18 v4.7.0 community-contributed type codes (RGPD, NIS2, AIACT, DORA, CRA, DSA, DATAACT, CNIL, SECNUM, MARPUB, DINUM, EBIOS, ANSSI, CARTO, DR, ALGO, PSSI, REUSE) from the rendered dashboard. The `update-manifest.mjs` hook correctly recorded the artifacts in `docs/manifest.json` (it reads from `arckit-claude/config/doc-types.mjs`), but the `/arckit.pages` prompt has its own hardcoded "Only include these known artifact types" allow-list at `arckit-claude/commands/pages.md:198` that was missing the new codes. Added all 18 to the table grouped by category, plus a note pointing back to `doc-types.mjs` as the single source of truth (#317)

### Documentation

- `arckit-claude/config/doc-types.mjs` — added a prominent `⚠️ DUAL REGISTRATION REQUIRED` warning at the top so future contributors know to update both `doc-types.mjs` and `pages.md` when adding new type codes (#317)

## [4.7.0] - 2026-04-19

### Added (Community-contributed)

> ⚠️ The 18 EU and French regulatory commands below are community-contributed and have not yet been validated against current ANSSI / CNIL / EU regulatory text. Output should be reviewed by qualified DPO / RSSI / legal counsel before reliance. Citations may lag the current source — verify before use. Domain maintainer: [@thomas-jardinet](https://github.com/thomas-jardinet) — auto-requested for review on `eu-*` / `fr-*` changes via `.github/CODEOWNERS`.

- `/arckit.eu-rgpd` — [COMMUNITY] generate GDPR (EU 2016/679) compliance assessment for EU/EEA data processing — member-state-neutral, covers all DPAs, cross-border transfers, breach notification
- `/arckit.eu-nis2` — [COMMUNITY] assess NIS2 Directive compliance obligations for EU member state operators of essential services and important entities
- `/arckit.eu-ai-act` — [COMMUNITY] assess EU AI Act (Regulation 2024/1689) compliance, risk classification, and conformity requirements
- `/arckit.eu-dora` — [COMMUNITY] assess DORA (EU 2022/2554) compliance for financial sector entities operating in the EU
- `/arckit.eu-cra` — [COMMUNITY] assess EU Cyber Resilience Act (Regulation 2024/2847) for products with digital elements
- `/arckit.eu-dsa` — [COMMUNITY] assess EU Digital Services Act (Regulation 2022/2065) for online intermediaries, platforms, and VLOPs
- `/arckit.eu-data-act` — [COMMUNITY] assess EU Data Act (Regulation 2023/2854) for connected products, data holders, and DAPS
- `/arckit.fr-secnumcloud` — [COMMUNITY] assess SecNumCloud 3.2 qualification for French sovereign cloud procurement and OIV/OSE obligations
- `/arckit.fr-marche-public` — [COMMUNITY] generate French public procurement documentation aligned with code de la commande publique, UGAP catalogue, and DINUM standards
- `/arckit.fr-dinum` — [COMMUNITY] assess French digital administration standards: RGI, RGAA, RGESN, RGS, and DINUM doctrine cloud de l'État
- `/arckit.fr-rgpd` — [COMMUNITY] French CNIL-specific GDPR layer: cookies, HDS, age 15, CNIL référentiels — supplements `/arckit.eu-rgpd`
- `/arckit.fr-ebios` — [COMMUNITY] EBIOS Risk Manager 5-workshop study following the ANSSI methodology
- `/arckit.fr-anssi` — [COMMUNITY] assess compliance with the ANSSI Guide d'hygiène informatique (42 measures) and cloud recommendations
- `/arckit.fr-anssi-carto` — [COMMUNITY] ANSSI-methodology IS cartography across business / application / system / network levels
- `/arckit.fr-dr` — [COMMUNITY] Diffusion Restreinte handling compliance (II 901/SGDSN/ANSSI)
- `/arckit.fr-algorithme-public` — [COMMUNITY] public algorithm transparency notice (Article L311-3-1 CRPA)
- `/arckit.fr-pssi` — [COMMUNITY] generate an Information System Security Policy (PSSI) per ANSSI/RGS
- `/arckit.fr-code-reuse` — [COMMUNITY] public code reuse assessment (code.gouv.fr, SILL, EUPL) before building

### Added

- `.github/CODEOWNERS` — establishes domain ownership; `@thomas-jardinet` is auto-requested for review on changes to `eu-*` / `fr-*` commands and templates. Repo owner `@tractorjuice` remains final approver via the default `*` rule.
- README — new "EU & French Regulatory Compliance (Community)" section listing all 18 commands with maintainer credit (#316)
- `docs/contributors.html` — new card for `@thomas-jardinet` (Code Contributor + Domain Maintainer EU & FR); contributor count 7 → 8 (#316)

### Fixed

- `validate-arc-filename.mjs` PreToolUse hook was blocking every Write call from the new EU and FR commands with exit code 2 ("Unknown document type code"). Registered all 18 codes (RGPD, NIS2, AIACT, DORA, CRA, DSA, DATAACT, CNIL, SECNUM, MARPUB, DINUM, EBIOS, ANSSI, CARTO, DR, ALGO, PSSI, REUSE) in `arckit-claude/config/doc-types.mjs` — the single source of truth that all 6 ArcKit hooks import for display names and categorisation. The 7 EU commands shipped via #314 had been broken at the hook layer until #316 hotfixed them (#316)

## [4.6.13] - 2026-04-19

### Fixed

- `stale-artifact-scan` monitor exited 1 mid-loop in real ArcKit repos. Two bundled fixes in `arckit-claude/scripts/bash/detect-stale-artifacts.sh`: (a) dropped an unused `source common.sh` line that was leaking `errexit + pipefail` into the monitor and aborting the script the first time a `grep | sed | tr` pipeline returned no match; (b) made the Document Control `Status` grep robust to `**markdown bold**` and anchored it so it no longer accidentally matches `| status |` rows in entity-attribute tables further down the file. Net effect: monitor now exits 0 and surfaces both review-overdue *and* DRAFT-unchanged artifacts (the latter were silently skipped before) (#307)

## [4.6.12] - 2026-04-18

### Fixed

- Plugin manifest rejected by Claude Code v2.1.114 with `userConfig.*.type` and `userConfig.*.title` validation errors. Added the newly-required `title` and `type: "string"` fields to all five `userConfig` entries in `arckit-claude/.claude-plugin/plugin.json`. Without this fix the plugin fails to install on Claude Code v2.1.114+ (#302)

## [4.6.11] - 2026-04-18

### Added

- `keep-coding-instructions: true` on 5 long-running commands (`requirements`, `research`, `sobc`, `datascout`, `framework`) — persists the command's instructions across `/compact` so Claude Code doesn't drop the template and traceability rules mid-run. Requires Claude Code v2.1.94+; the converter already strips the field for non-Claude extensions (Phase 1 work, now activated) (#215, #301)

## [4.6.10] - 2026-04-18

### Added

- Plugin `monitors` manifest key (Claude Code v2.1.105+) with a `stale-artifact-scan` monitor that runs at session start. The monitor (`arckit-claude/scripts/bash/detect-stale-artifacts.sh`) scans `projects/` for ARC-*.md artifacts whose Document Control `Next Review Date` is overdue or whose `Status: DRAFT` is 14+ days old, emitting one notification per stale file (capped at 10). Silent in non-ArcKit repos (#215, #300)
- Autoresearch guide documents the built-in `Monitor` tool (v2.1.98+) for streaming overnight autoresearch progress from a second session without blocking the experiment loop (#215, #300)

## [4.6.9] - 2026-04-18

### Added

- SessionStart version check now warns when the Claude Code client is below the documented minimum (v2.1.112). Detection prefers `$CLAUDE_CODE_VERSION` env var and falls back to `spawnSync('claude', ['--version'])` with a 2s timeout. Warning lists features lost on older clients (userConfig, hook `if:`, skill `paths:`, Opus 4.7 `xhigh`/Auto mode). Silent on detection failure (#215, #299)

## [4.6.8] - 2026-04-18

### Added

- Plugin `userConfig` (Claude Code v2.1.83+) — plugin prompts at enable time for `GOOGLE_API_KEY` / `DATA_COMMONS_API_KEY` (both sensitive, stored in system keychain) plus org defaults (`organisation_name`, `default_classification`, `governance_framework`). `.mcp.json` uses `${user_config.KEY}` placeholders; the converter rewrites these to `${KEY}` shell env vars for Codex/Gemini/OpenCode/Copilot targets (#215, #298)

### Changed

- Existing users enabling v4.6.8+ in Claude Code will be prompted once for MCP API keys and org defaults; existing `GOOGLE_API_KEY` / `DATA_COMMONS_API_KEY` shell env vars continue to work for non-plugin contexts (Codex / Gemini / OpenCode / Copilot).

## [4.6.7] - 2026-04-18

### Added

- `docs/llms.txt` — LLM-friendly site index for arckit.org following the [llmstxt.org](https://llmstxt.org/) standard. Indexes the homepage, getting started, command/guide catalogue, DDaT role guides, use cases, and source distributions. Added to `sitemap.xml`.
- `/arckit.pages` now generates `docs/llms.txt` in downstream ArcKit project repositories alongside `index.html` and `manifest.json`. Uses `raw.githubusercontent.com` URLs for project markdown artifacts and relative paths for the site-local dashboard and guides. Hand-curated `docs/llms.txt` files (without the ArcKit generation marker) are preserved across re-runs.
- Document `ENABLE_PROMPT_CACHING_1H=1` (Claude Code v2.1.108+) recommendation in MCP setup and autoresearch guides for long ArcKit workflows and overnight optimisation runs (#215)
- Phase 1 adoption of Claude Code v2.1.84+ plugin capabilities (#215, #297):
  - `paths:` globs on all 4 plugin skills (`architecture-workflow`, `mermaid-syntax`, `plantuml-syntax`, `wardley-mapping`) for sharper auto-activation on ArcKit artifact patterns
  - `if:` conditions (v2.1.85+) on `validate-arc-filename`, `score-validator`, and `update-manifest` hooks to narrow triggering to `projects/**` writes and avoid unnecessary Node process spawns
  - `CLAUDE.md` documents new command frontmatter (`keep-coding-instructions`, `xhigh` effort value), agent frontmatter (`initialPrompt`), skill frontmatter (`paths:`), and hook `if:` field with permission rule syntax examples

### Changed

- Bump minimum Claude Code version to v2.1.112 to unlock Opus 4.7 `xhigh` effort tier and Auto mode for deep-research agents and synthesis commands (#215)
- `scripts/converter.py` extends Claude-only-field stripping for non-Claude targets: commands drop `keep-coding-instructions` and `paths`; agents drop `initialPrompt`, `maxTurns`, and `disallowedTools` in addition to `effort`; reference skills copied to extension dirs have `paths:` stripped post-copy (#215, #297)

## [4.6.6] - 2026-04-09

### Added

- Managed agent deployment — deploy any of the 10 ArcKit agents as Claude Managed Agents via the Anthropic API (`scripts/managed-agents/arckit-agent.py`) (#282)
- 3 MCP servers registered on managed agents with `always_allow` permission (AWS Knowledge, Microsoft Learn, govreposcrape)
- 4 custom skills uploaded to managed agents (architecture-workflow, mermaid-syntax, plantuml-syntax, wardley-mapping)

### Changed

- Bump minimum Claude Code version to v2.1.97 (#215)

## [4.6.5] - 2026-04-08

### Fixed

- Pages dashboard not showing global project documents from subdirectories (research, diagrams, decisions, wardley-maps, data-contracts, reviews)

## [4.6.4] - 2026-04-07

### Added

- `/arckit.grants` command (68th command) — research UK government grants, charitable funding, and accelerator programmes with eligibility scoring (#277)
- `arckit-grants` agent (10th agent) — autonomous web research across UKRI, Innovate UK, NIHR, DSIT, DASA, Wellcome, Nesta, Health Foundation, 360Giving/GrantNav, and accelerators
- `GRNT` document type for grants research reports (Research category, `research/` subdirectory)
- Grants template with project funding profile, per-grant eligibility scoring, comparison table, recommended strategy, and citation traceability

## [4.6.3] - 2026-04-06

### Added

- Document version badges in pages sidebar — every document shows its version (e.g., v1.0) with an inline dropdown selector when multiple versions of the same document exist
- Citation traceability for external documents — inline citation markers (`[DOC-CN]`) and structured "External References" section with Document Register, Citations, and Unreferenced Documents tables (#158, #207)
- Shared citation instructions file referenced by all 43 commands and 7 research agents

## [4.6.2] - 2026-04-05

### Added

- Mermaid `wardley-beta` test suite — 98% pass rate on 147 real-world maps, ArcKit syntax 100% valid (#271)
- Hooks documentation guide (`docs/guides/hooks.md`) across all distribution formats
- Paperclip plugin scaffolding with TypeScript source, bash/python scripts, and VERSION file

### Fixed

- Resolve 6 hook bugs and add hooks documentation (#271)
- Add `name` field to generated Codex agent `.toml` files — Codex CLI requires a non-empty name (#269)
- Flatten `[agents.roles.X]` to `[agents.X]` in Codex `config.toml` to prevent `roles` being misinterpreted as a malformed agent role (#269)
- Bump minimum Claude Code version to v2.1.90 across all documentation

## [4.6.1] - 2026-03-28

### Fixed

- Trim all 4 skill descriptions to under 250 characters for Claude Code v2.1.86 context cap (#215)

## [4.6.0] - 2026-03-24

### Changed

- All 9 agents now use `model: inherit` instead of hardcoded `sonnet` — agents use whatever model the user is running (Opus users get Opus, Sonnet users get Sonnet)
- Added `effort: high` to 10 commands: analyze, dfd, diagram, gcloud-clarify, gcloud-search, impact, principles, principles-compliance, servicenow, story (58 of 67 commands now have effort set)
- Autoresearch: `effort:` and `model:` are now tuneable parameters alongside prompt text
- Autoresearch: plateau threshold increased from 5 to 15 consecutive discards
- Autoresearch: results.tsv now tracks effort and model columns

### Fixed

- Preserve accented characters in `slugify()` function — use locale-aware `[:alnum:]` instead of `[a-z0-9]`

## [4.5.3] - 2026-03-24

### Fixed

- Update agent count from 6 to 9 in README, plugin README, and remote-control guides
- Update MCP server count from 4 to 5 in plugin README (add govreposcrape)
- Update automation hook count from 4 to 5 in README
- Update Copilot prompt file and agent counts in README
- Merge optimised gov agent prompts (gov-reuse 9.4, gov-code-search 8.8, gov-landscape 8.6)

## [4.5.2] - 2026-03-23

### Fixed

- Add govreposcrape MCP server to Gemini extension
- Update command count from 64 to 67 across all docs, HTML pages, plugin manifests, and extension configs
- Update agent count from 6 to 9 and hook count from 4 to 5 in docs

## [4.5.0] - 2026-03-23

### Added

- **govreposcrape MCP server** — Semantic search over 24,500+ UK government repositories (no API key required)
- `/arckit.gov-reuse` command and agent — Discover reusable UK government code before building from scratch
- `/arckit.gov-code-search` command and agent — Search UK government repositories using natural language queries
- `/arckit.gov-landscape` command and agent — Map the UK government code landscape for a domain
- Government Code Reuse Check step in `/arckit.research` agent — adds "Reuse Government Code" as 5th build-vs-buy option
- Government Code for Data Integration step in `/arckit.datascout` agent — discovers existing API client libraries
- Government Implementation Patterns step in AWS, Azure, and GCP research agents — checks for government precedent
- Document type codes: GOVR (Government Reuse Assessment), GCSR (Government Code Search Report), GLND (Government Landscape Analysis)
- GOVR, GCSR, GLND added to `/arckit.pages` artifact type list

## [4.4.0] - 2026-03-21

### Added

- Wardley map mathematical model metrics in commands and autoresearch
- Git worktree isolation for autoresearch
- Autoresearch guide for self-improving command prompts
- Rate limit display in statusline

### Fixed

- Sync guides between arckit-claude and docs directories

## [4.3.1] - 2026-03-18

### Added

- Mermaid `wardley-beta` dual output for Wardley map commands — generates both OWM syntax and Mermaid diagram blocks
- Mermaid wardley-beta examples added to mapping references
- Mermaid viewing guidance added to wardley and value chain guides
- Claude Code v2.1.78 agent frontmatter support (`effort`, `maxTurns`, `disallowedTools`) and `StopFailure` hook
- Mermaid special character escaping guidance for diagram command

### Fixed

- Missing component declaration for pipeline parent in Mermaid example

## [4.3.0] - 2026-03-16

### Added

- `/arckit.wardley.value-chain` command — Decompose user needs into value chains
- `/arckit.wardley.doctrine` command — Assess organizational doctrine maturity (4 phases, 40+ principles)
- `/arckit.wardley.gameplay` command — Analyze strategic plays from 60+ gameplay patterns with D&D alignment
- `/arckit.wardley.climate` command — Assess 32 climatic patterns across 6 categories
- Wardley reference files enriched from 3 Wardley Mapping books (doctrine, gameplays, climatic patterns)
- 4 new document types: WVCH, WDOC, WGAM, WCLM
- 4 new document templates and usage guides

### Fixed

- `wardley.md` hook reference corrected from `python3 .py` to `node .mjs`

## [4.2.11] - 2026-03-16

### Added

- Systems thinking foundations in framework command: Ashby's Law of Requisite Variety, Conant-Ashby Good Regulator Theorem, Gall's Law, and Conway's Law integrated into agent guidance, template, and quality checks
- Version check SessionStart hook: compares local plugin version against latest GitHub release and notifies users when an update is available

## [4.2.10] - 2026-03-15

### Added

- Add GitHub issue forms for bugs, features, and questions (#171)

### Fixed

- Correct 9 dependency matrix discrepancies from audit (#170)
- Wrap mermaid.run() in try-catch to prevent page crash on bad diagrams (#172)

## [4.2.4] - 2026-03-11

### Fixed

- Moved STORY doc type from Other to Planning category

## [4.2.3] - 2026-03-11

### Fixed

- Deduplicated cross-reference edges in dependency graph

## [4.2.2] - 2026-03-11

### Fixed

- Dependency map always shows 000-global documents when filtering by project

## [4.2.1] - 2026-03-11

### Fixed

- Dependency map grid layout wrapping, null property crashes, and filtered hidden files from manifest

## [4.2.0] - 2026-03-11

### Added

- Interactive dependency map visualization in pages dashboard with SVG rendering, category-layered layout, hover/click interactions, project filtering, and orphan detection

### Fixed

- Explicit UTF-8 encoding on all Python file I/O operations to prevent encoding issues on non-English systems

## [4.1.1] - 2026-03-11

### Added

- `/arckit.search` command for keyword, type, and requirement ID search across all project artifacts with pre-processing hook
- `/arckit.score` command for structured vendor scoring with JSON storage, comparison, sensitivity analysis, and audit trail
- `/arckit.impact` command for blast radius analysis and reverse dependency tracing
- GitHub Copilot extension (`arckit-copilot/`) — new distribution format with `.prompt.md` files and custom agents
- GitHub Copilot tab added to `docs/index.html` and `getting-started.html`
- Session learner skill for capturing and replaying session insights

## [4.0.2] - 2026-03-08

### Added

- `/arckit.framework` command for transforming architecture artifacts into a structured, reusable framework (agent-delegating)
- `/arckit.glossary` command for generating comprehensive project glossary with terms, definitions, and cross-references
- `/arckit.maturity-model` command for generating capability maturity model with current-state assessment and improvement roadmap
- Missing guides for `dfd`, `health`, and `init` commands
- `dfd` command added to DEPENDENCY-MATRIX with row and column

### Fixed

- Framework command referenced wrong template filename (`framework-template.md` → `framework-overview-template.md`)
- Stale command counts (53 → 57) across all docs, guides, commands.html, and extension copies
- Stale agent counts (5 → 6) in MCP servers and remote control guides

## [2.22.6] - 2026-03-05

### Changed

- Add .worktrees/ to gitignore

## [2.22.5] - 2026-03-01

### Fixed

- **Template status line showed ambiguous Version label** — renamed `**Version**: [VERSION]` to `**ArcKit Version**: [VERSION]` on the status blockquote line across all 50 templates so AI correctly fills the ArcKit version instead of the document version
- **Tech-note and vendor-profile templates missing status line** — added the `> **Template Status**: Live | **ArcKit Version**: [VERSION] | **Command**: ...` blockquote to align with the other 48 templates
- **Health command always writes docs/health.json** — ensures dashboard integration works even when docs directory already exists

## [2.22.4] - 2026-03-01

### Fixed

- **Traceability hook missed FR and NFR requirements** — heading regex only matched h3 (`###`) but the requirements template uses h4 (`####`) for FR, NFR, INT, and DR sections (plugin fix, see plugin CHANGELOG for details)

---

## [2.22.0] - 2026-03-01

### Added

- **Centralized doc type config** — `arckit-claude/config/doc-types.mjs` is the single source of truth for all 49 document type codes, replacing duplicated data across 5+ files
- **Research subdirectory routing** — research types (RSCH, AWRS, AZRS, GCRS, DSCT) are now multi-instance and auto-route to `research/` with sequence numbers
- **GAPS and VEND doc type codes** — Gap Analysis (Governance) and Vendor Evaluation (Procurement)

### Fixed

- **Command filename mismatches** — HLD→HLDR, DLD→DLDR, `data-mesh-contracts/`→`data-contracts/`
- **Inconsistent categories** — DSCT (Discovery), PLAT (Architecture), DFD (Architecture) standardized across all hooks

### Changed

- **Research agents use inline filenames** — removed `generate-document-id.py` calls from 5 agents; PreToolUse hook handles filename correction
- **Multi-instance types updated** — `generate-document-id.sh` and `.py` (both copies) now list all 10 multi-instance types

---

## [2.21.0] - 2026-03-01

### Added

- **Traceability pre-processor hook** — automatically extracts requirements from project artifacts and computes coverage metrics before the traceability command runs

---

## [2.20.5] - 2026-02-28

### Fixed

- **Hooks false-positive on unrelated commands** — smart guards prevent pages/health hooks firing when other commands mention them in body text

---

## [2.20.4] - 2026-02-28

### Fixed

- **Pages command ignores hook stats** — removed all tools from allowed-tools and strengthened hook output to prevent AI from reading manifest

---

## [2.20.3] - 2026-02-28

### Fixed

- **Hooks fail via Skill tool** — removed redundant regex guards from pages and health hooks

---

## [2.20.2] - 2026-02-28

### Fixed

- **ANAL files missing from pages manifest** — fixed category mismatch and prevented AI from overwriting hook-generated manifest

---

## [2.20.1] - 2026-02-28

### Fixed

- **Analysis report type code** — standardized `ANLZ` → `ANAL` across all commands and guides

---

## [2.20.0] - 2026-02-28

### Added

- **Health pre-processor hook** — `/arckit:health` fully handled by hook (20-50+ Read tool calls → zero)

---

## [2.19.0] - 2026-02-28

### Added

- **Pages pre-processor hook** — `/arckit:pages` fully handled by hook (~310 tool calls → zero)

---

## [2.18.0] - 2026-02-28

### Added

- **Guide sync hook** — `/arckit:pages` guide sync via native fs hook instead of Read+Write tool calls

---

## [2.17.0] - 2026-02-28

### Added

- **Tiered deviation classification** for conformance assessment — GREEN/YELLOW/RED tiers overlay on PASS/FAIL, classifying FAIL findings by actionability (#95)
- **Conversational gathering rules** (max 2 rounds) on 15 commands (#94)
- **STANDALONE/SUPERCHARGED degradation** for cloud research commands (#93)

---

## [2.16.0] - 2026-02-28

### Added

- **Quality checklist** — shared `references/quality-checklist.md` with 10 common checks and 47 per-type checks for artifact verification before write (#92)
- **`argument-hint` frontmatter** on all 53 plugin commands

---

## [2.15.1] - 2026-02-28

### Fixed

- Markdown lint CI now recurses into subdirectories correctly
- Suppress MD038 false positive for intentional space-in-code-span in DEPENDENCY-MATRIX.md

---

## [2.15.0] - 2026-02-28

### Added

- **Markdown linting CI** — `.markdownlint-cli2.jsonc` config + `.github/workflows/lint-markdown.yml` enforcing consistent markdown formatting; auto-fix of 39K+ violations across 571 files

### Fixed

- Markdown formatting across all templates, commands, guides, agents, and documentation files

---

## [2.14.0] - 2026-02-28

### Added

- **Handoffs frontmatter** — 16 plugin commands declare `handoffs:` for machine-readable workflow navigation; converter renders as `## Suggested Next Steps` in Codex/OpenCode/Gemini output
- **Release automation** — `generate-release-notes.sh` + GitHub Actions workflow for automatic releases on tag push
- **Version automation** — `bump-version.sh` updates all version files in one command

### Changed

- **Config-driven converter** — `scripts/converter.py` refactored to use `AGENT_CONFIG` dictionary and PyYAML for frontmatter parsing

---

## [2.13.2] - 2026-02-28

### Fixed

- **Node.js hooks** — rewrote all 7 plugin hooks from Python to Node.js (.mjs) for Windows compatibility (#86)
- Version bump across all distribution formats

---

## [2.13.1] - 2026-02-27

### Fixed

- **Cross-platform commands & agents** — removed bash-only patterns from 7 commands and 5 agents, replacing with Glob/Read/Write tool instructions and Python scripts for full Windows compatibility
- Regenerated all Codex/OpenCode/Gemini formats via converter
- Version bump across all distribution formats

---

## [2.13.0] - 2026-02-27

### Added

- **NCSC VMS, Cyber Action Plan & Cyber Profession** — `/arckit:secure` updated with VMS enrollment (CAF C2, Section 6.1), Cyber Action Plan Alignment (Section 9.4), and Government Cyber Security Profession (Section 11)
- **Structured vulnerability management** — `/arckit:operationalize` Section 11 expanded with vulnerability scanning (VMS integration), remediation SLAs, and patch management subsections
- **Critical Vulnerability Remediation runbook** (6.7) — new runbook in `/arckit:operationalize` for critical CVEs and VMS alerts

### Changed

- GovS 007 mapping updated for principles 5 and 8 in `/arckit:secure`
- Handover checklist and NCSC guidance include VMS items in `/arckit:operationalize`
- Version bump across all distribution formats

---

## [2.12.3] - 2026-02-26

### Changed

- **Pages header: Repository icon** — replaced text link with GitHub icon next to theme toggle
- **Pages header: version badge** — ArcKit version displayed in header menu
- Version bump across all distribution formats

---

## [2.12.2] - 2026-02-26

### Fixed

- **Pages template: GitHub Pages fallback** (#80) — tries relative paths first, falls back to `raw.githubusercontent.com` for GitHub Pages
- Version bump across all distribution formats

---

## [2.12.1] - 2026-02-26

### Changed

- **Pages template: relative paths instead of GitHub raw URLs** (#79) — site now works on any static hosting provider
- **Pages command: hosting-agnostic language** (#79) — updated from "GitHub Pages" to generic "documentation site"
- **Pages error handling: safe DOM methods** (#79) — simplified to generic "Document not found" message
- Version bump across all distribution formats

---

## [2.12.0] - 2026-02-26

### Added

- **STALE-EXT detection rule for `/arckit:health`** (#77) — flags external files newer than project artifacts with command recommendations
- **External file detection hooks** (#77) — SessionStart hook auto-detects new external files; context hook flags them as **NEW**
- **PlantUML Syntax Reference skill** (`plantuml-syntax`) (#78) — 10 reference files with C4-PlantUML layout conflict rules
- **Format-specific syntax loading in `/arckit:diagram`** (#78) — loads PlantUML or Mermaid references based on selected format
- **Mermaid ERD syntax rules** (#78) — prevents invalid `PK_FK` key type

### Changed

- Version bump across all distribution formats

---

## [2.11.0] - 2026-02-26

### Added

- **Mermaid Syntax Reference skill** (`mermaid-syntax`) — 30 official Mermaid syntax reference files covering all 23 diagram types plus configuration and theming
- `/arckit.start` onboarding command with project detection and workflow routing
- 10 Mermaid-generating commands now read type-specific syntax references before generating Mermaid code

### Changed

- Getting Started guide now covers both `/arckit.start` and `/arckit.init` in a single combined guide
- GitHub Pages Getting Started section updated with `/arckit.start` and `/arckit.init` steps
- `/arckit.pages` command — added 5 missing guides to category and status tables
- Moved `c4-diagram-reference.md` to `skills/mermaid-syntax/references/c4-layout-science.md`
- Version bump across all distribution formats

---

## [2.10.0] - 2026-02-25

### Added

- **DDaT Role Guides** (#75) — 18 role-based guides mapping ArcKit commands to UK Government DDaT Capability Framework roles (Architecture, Chief Digital and Data, Product and Delivery, Data, IT Operations, Software Development)
- "Roles" nav link in GitHub Pages template with dedicated roles index page
- `roleGuides` array in manifest.json for role guide discovery

### Changed

- Version bump across all distribution formats

---

## [2.9.0] - 2026-02-25

### Added

- `/arckit.conformance` command for architecture conformance assessment — validates ADR decisions against designs, checks architecture drift, tracks technical debt, and enforces custom constraint rules (#55)

### Changed

- Version bump across all distribution formats

---

## [2.8.8] - 2026-02-25

### Fixed

- **Markdown escaping for `<` and `>` in generated documents** (#67) — added instruction to all 49 document-generating commands and 5 agents to space-separate less-than/greater-than comparisons (e.g., `< 3 seconds` instead of `<3 seconds`) so markdown renderers don't misinterpret them as HTML tags or emoji

### Changed

- Version bump across all distribution formats

---

## [2.8.7] - 2026-02-25

### Added

- **PlantUML rendering in Pages** — pages template renders PlantUML code blocks as SVG diagrams via PlantUML server, with interactive pan/zoom, dark mode, and fullscreen support

### Changed

- Version bump across all distribution formats

---

## [2.8.6] - 2026-02-25

### Fixed

- **Mermaid label compatibility for presentations** (#73, #70) — ASCII-only, no-hyphens, no-special-characters rules for Mermaid labels
- **Diagram command UX** (#71, #65) — ask both questions in single prompt, clarified skip rules

### Added

- **Mermaid Compatibility section** in presentation guide
- **Plugin setup guide and Productivity Guide** synced to OpenCode extension

### Changed

- Version bump across all distribution formats (CLI, plugin, Gemini extension, OpenCode extension, marketplace)

---

## [2.8.5] - 2026-02-24

### Added

- **PlantUML C4 output format for `/arckit.diagram`** (#65) — C4 diagram types now offer PlantUML C4 as an alternative to Mermaid
- **Platform support documentation** (#71) — README and docs note Linux as primary platform, devcontainer/WSL2 for Windows
- **Pages template support for `/arckit:customize`** (#72)

### Changed

- Version bump across all distribution formats (CLI, plugin, Gemini extension, OpenCode extension, marketplace)

---

## [2.8.4] - 2026-02-24

### Added

- **Interactive zoom/pan for Mermaid diagrams** — scroll to zoom, drag to pan, double-click to zoom in, toolbar controls (zoom-in, zoom-out, reset, fullscreen), keyboard shortcuts (`+`/`-`/`0`/`f`/`Escape`), and touch pinch-to-zoom via svg-pan-zoom library
- **Diagram fullscreen mode** — expand any diagram to a full-screen overlay with `f` key or toolbar button
- **Accessible diagram controls** — focusable viewports with ARIA labels, keyboard navigation, always-visible controls on mobile/touch devices

### Changed

- Version bump across all distribution formats (CLI, plugin, extension, marketplace)

---

## [2.8.3] - 2026-02-20

### Added

- **Dark mode for pages template** — CSS-variable-driven dark theme with sun/moon toggle in header, system preference detection (`prefers-color-scheme`), and localStorage persistence
- **Auto-sync guides from plugin** — `/arckit.pages` now copies all guides from the plugin to `docs/guides/` before scanning, ensuring repos always have the latest guides
- **4 missing guides synced to plugin** — `artifact-health`, `c4-layout-science`, `knowledge-compounding`, `security-hooks`

### Changed

- Replaced ~35 hardcoded colour values in pages template with semantic CSS variables
- Mermaid diagrams switch between default/dark theme based on mode
- SVG donut chart text colour reads from CSS variable for dark mode compatibility
- Version bump across all distribution formats (CLI, plugin, extension, marketplace)

---

## [2.8.2] - 2026-02-20

### Added

- **Health dashboard panel in `/arckit.pages`** — pages template loads `docs/health.json` (when present) and renders an Artifact Health panel with severity bars, findings-by-type breakdown, and a per-project Health column with traffic-light colours
- **`JSON=true` flag for `/arckit.health`** — writes machine-readable `docs/health.json` for dashboard integration alongside the console report

### Fixed

- **All 64 guides now listed in pages command** — added 19 missing guides to category/status tables and corrected status discrepancies (sow/evaluate/customize → live, pages → alpha per README)

### Changed

- Version bump across all distribution formats (CLI, plugin, extension, marketplace)

---

## [2.8.1] - 2026-02-20

### Added

- **Vendor profiles & tech notes in `/arckit.pages`** — pages command and HTML template now discover, index, and display vendor profiles (`vendors/*-profile.md`) and tech notes (`tech-notes/*.md`) with search, dashboard metrics, Knowledge column, and sidebar navigation (#62)

### Changed

- Version bump across all distribution formats (CLI, plugin, extension, marketplace)

---

## [2.8.0] - 2026-02-20

### Added

- **Knowledge compounding from research** — `/arckit.research` now spawns standalone vendor profiles (`vendors/`) and tech notes (`tech-notes/`) from research findings; use `--no-spawn` to skip (#59, thanks @DavidROliverBA)
- **`/arckit.health` command** (51st command) — scans projects for stale research, forgotten ADRs, unresolved review conditions, orphaned artifacts, missing traceability, and version drift (#60, thanks @DavidROliverBA)
- **Security hooks** — three new hooks for secret and sensitive file protection: prompt secret detection, file content scanning, and sensitive file path blocking (#56, thanks @DavidROliverBA)
- **C4 layout science for `/arckit.diagram`** — research-backed layout reference template (Sugiyama algorithm, tier-based ordering, edge crossing targets) and 6-criterion diagram quality gate (#57, thanks @DavidROliverBA)

### Changed

- Version bump across all distribution formats (CLI, plugin, extension, marketplace)

---

## [2.7.1] - 2026-02-20

### Added

- **Wardley Map validation Stop hook** — per-command Stop hook on `/arckit.wardley` validates generated maps for stage-evolution alignment, coordinate ranges, and OWM syntax consistency against Component Inventory tables before finalizing

### Changed

- Version bump across all distribution formats (CLI, plugin, extension, marketplace)

---

## [2.7.0] - 2026-02-19

### Added

- **UK Government Cyber Security Standard integration** — `/arckit.secure` template now includes GovAssure Status, Secure by Design Confidence Rating, and CSS Exception Register sections (#13)
- **GovS 007: Security alignment** — `/arckit.secure` template now includes GovS 007 Alignment Summary with principle-to-CAF mapping and named security roles (SSRO, DSO, SIRO) (#14)
- **National Data Strategy reference guide** — new `docs/guides/national-data-strategy.md` mapping NDS 5 missions and 4 pillars to ArcKit commands (#15)
- **Government Data Quality Framework reference guide** — new `docs/guides/data-quality-framework.md` mapping DQF 5 principles, 6 dimensions, and maturity model to ArcKit artefacts (#16)
- **UK Government Codes of Practice reference guide** — new `docs/guides/codes-of-practice.md` mapping Rainbow of Books (Magenta, AQuA, Rose, Commercial Playbooks) to ArcKit commands (#17)
- **New `/arckit.presentation` command** — generates MARP-format slide decks from existing project artifacts for governance boards, stakeholder briefings, and gate reviews; supports 4 focus modes (Executive, Technical, Stakeholder, Procurement) with configurable slide counts (#32)
- **Data Commons MCP integration for `/arckit.datascout`** — datascout agent now uses Data Commons MCP tools to discover and validate UK statistical data before web research (#40)
- **Pinecone MCP integration for `/arckit.wardley`** — wardley command now searches the Wardley Mapping book corpus via Pinecone for strategic context and case studies (#43)
- New templates, guides, and reference materials for all above features

### Changed

- Converter output synced across all distribution formats (Codex, OpenCode, Gemini)
- Version bump across all distribution formats (CLI, plugin, extension, marketplace)

---

## [2.6.0] - 2026-02-17

### Added

- **SessionStart hook for version injection** — new `hooks/arckit-session.sh` fires once at session start, injecting the ArcKit plugin version into Claude's context and exporting `ARCKIT_VERSION` as an environment variable; also detects whether a `projects/` directory exists
- **OpenCode CLI support** — 4th distribution format via `arckit init --ai opencode`; adds `arckit-opencode/` extension directory, `.opencode/commands/` for CLI usage, `scripts/converter.py` generates OpenCode markdown alongside Codex and Gemini formats, 48 commands + 5 agents + MCP servers (AWS Knowledge, Microsoft Learn, Google Developer Knowledge)

### Changed

- **Removed per-command VERSION file reads from 46 commands** — commands no longer instruct Claude to read `${CLAUDE_PLUGIN_ROOT}/VERSION`; the version is now provided via `{ARCKIT_VERSION}` from the SessionStart hook context, eliminating a redundant Read tool call on every command invocation
- Version bump across all distribution formats (CLI, plugin, extension, marketplace)

---

## [2.5.1] - 2026-02-17

### Changed

- **Removed `generate-document-id.sh` calls from 29 commands** — replaced bash script invocations with inline document ID format strings (e.g., `ARC-{PROJECT_ID}-REQ-v{VERSION}`); the PreToolUse hook now auto-corrects ARC filenames, making script calls redundant

---

## [2.5.0] - 2026-02-17

### Added

- **UserPromptSubmit hook for project context** — new `arckit-context.sh` hook automatically detects all projects, artifacts, external documents, and global policies before any `/arckit:` command runs, injecting structured context via `systemMessage`

### Changed

- **Refactored 39 commands to use hook-provided context** — removed boilerplate directory scanning, `ARC-*-TYPE-*.md` glob patterns, verbose external docs blocks, and `list-projects.sh` calls; replaced with compact hook-aware references (net -1,071 lines, 66% boilerplate reduction)

---

## [2.4.5] - 2026-02-15

### Added

- **New `/arckit.dfd` command** — Data Flow Diagram (DFD) generation with multi-instance support, document control, and DFD-specific templates across all distribution formats (plugin, Codex, Gemini extension)
- **DFD multi-instance document type** — `DFD` added to `generate-document-id.sh` for sequential numbering (ARC-001-DFD-001, ARC-001-DFD-002, etc.)

### Changed

- **Explicit VERSION file path in all commands and agents** — all 49 commands and 5 agents now reference `${CLAUDE_PLUGIN_ROOT}/VERSION` instead of bare `VERSION`, ensuring the ArcKit version is always read from the plugin's authoritative file regardless of project state

---

## [2.4.4] - 2026-02-12

### Fixed

- **Windows cp1252 encoding fix** — added explicit `encoding='utf-8'` to all file I/O operations in `arckit init` to prevent `UnicodeEncodeError` on Windows when writing files containing Unicode box-drawing characters (fixes #49)

---

## [2.4.3] - 2026-02-11

### Added

- **Data Commons MCP server for Gemini extension** — added `datacommons-mcp` to the Gemini extension MCP configuration

### Changed

- Version bump to 2.4.3 across all distribution formats

---

## [2.4.1] - 2026-02-10

### Added

- **Gemini CLI native extension** (`arckit-gemini/`) — install via `gemini extensions install https://github.com/tractorjuice/arckit-gemini` for zero-config experience with automatic updates and bundled MCP servers
  - Published as separate repo [`tractorjuice/arckit-gemini`](https://github.com/tractorjuice/arckit-gemini), generated by `scripts/converter.py`
  - Extension manifest (`gemini-extension.json`) with MCP servers (AWS Knowledge, Microsoft Learn via mcp-remote) and optional Google API Key setting
  - Context file (`GEMINI.md`) with extension paths, document control standard, and project structure reference
  - All 48 commands with paths rewritten to `~/.gemini/extensions/arckit/`

### Fixed

- **Gemini extension workspace sandbox fix**: Extension commands now instruct the model to use `run_shell_command` (e.g., `cat`, `bash`) for accessing extension files at `~/.gemini/extensions/arckit/`, since Gemini CLI's `read_file` tool is restricted to the project workspace. Also rewrites `Read` instructions to `cat` commands in extension TOML output.
- **CLI/Codex path resolution bug**: `${CLAUDE_PLUGIN_ROOT}` references in generated Codex Markdown files are now rewritten to `.arckit` (project-local paths). Previously these paths were never resolved, breaking template and script references for Codex users.

### Changed

- **CLI is now Codex-only**: Removed Gemini CLI from the CLI package. Gemini users should use the native extension instead (`gemini extensions install https://github.com/tractorjuice/arckit-gemini`). Running `arckit init --ai gemini` now prints a redirect message pointing to the extension.
- Deleted `.gemini/` directory from the repo (49 files) — project-local Gemini commands are no longer distributed via the CLI
- `scripts/converter.py` now generates 2 output formats: Codex Markdown (`.codex/`) and Gemini extension TOML (`arckit-gemini/`), with path rewriting for each target
- Removed `.gemini` from `pyproject.toml` shared-data
- Updated all documentation (README, CLAUDE.md, docs/index.html, upgrading guides) to reflect Codex-only CLI

---

## [2.3.1] - 2026-02-09

### Fixed

- Pass directory argument to `--next-num` in multi-instance commands (wardley, diagram, data-mesh-contract) to prevent unbound variable crash
- Added guard in `generate-document-id.sh` to give a clear error message when directory is missing
- Replace Mermaid `gitGraph` with `flowchart` in devops template — gitGraph has limited renderer support and fails with "No diagram type detected" errors in GitHub/VS Code
- Added diagram guidelines to devops command to prevent gitGraph usage in generated documents

---

## [2.2.1] - 2026-02-09

### Fixed

- Added explicit `list-projects.sh --json` step to 9 commands (stakeholders, requirements, adr, sow, roadmap, strategy, dpia, platform-design, data-mesh-contract) to prevent wrong script paths in plugin-based repos

---

## [2.2.0] - 2026-02-09

### Added

- **Wardley Mapping skill** in plugin (`skills/wardley-mapping/`) for conversational Wardley Mapping with interactive AskUserQuestion guidance
- 5 shared reference files: evolution stages, doctrine, gameplay patterns, climatic patterns, and mapping examples
- Enhanced `/arckit:wardley` command reads shared reference files for deeper doctrine, gameplay, and climatic pattern analysis

## [2.1.9] - 2026-02-08

### Added

- Interactive configuration using AskUserQuestion for 8 key commands (backlog, diagram, plan, adr, dpia, sow, sobc, roadmap)
- Commands now prompt users for key decision points before generating documents
- Questions are automatically skipped when users specify preferences via command arguments

### Changed

- Unified CLI and plugin version numbers (both now 2.1.9)

## [2.0.0] - 2026-02-07

### Added

- **New Command: `/arckit.customize`**: Copy templates for customization (46th ArcKit command)
  - Copy individual templates: `/arckit.customize requirements`
  - Copy all templates: `/arckit.customize all`
  - List available templates: `/arckit.customize list`
  - Default templates in `.arckit/templates/` (refreshed by `arckit init`)
  - User customizations in `.arckit/templates-custom/` (preserved across updates)
  - Commands automatically check for custom templates first, falling back to defaults
  - Common use cases: organization-specific document control, compliance sections, approval workflows
- **Template Customization Support**: All 35 document-generating commands now support template overrides
  - Two-tier template system: defaults + user customizations
  - Added "Tip" note to each command pointing to `/arckit.customize`
- **Init Script Improvements**: `arckit init` now creates `.arckit/templates-custom/` directory with README explaining customization workflow
- **New Command: `/arckit.strategy`**: Synthesise strategic artifacts into executive-level Architecture Strategy document (45th ArcKit command)
  - Reads and synthesises: principles (M), stakeholders (M), wardley (R), roadmap (R), sobc (R), risk (O)
  - Creates single coherent strategic narrative for executives
  - Includes strategic vision, drivers, principles summary, current/target state, themes, investment, risks, KPIs
  - Unique among ArcKit commands: requires TWO mandatory inputs (principles AND stakeholders)
  - Template: `.arckit/templates/architecture-strategy-template.md`
  - Guide: `docs/guides/strategy.md`
- **New Command: `/arckit.trello`**: Export product backlog to Trello boards (44th ArcKit command)
  - Reads JSON output from `/arckit.backlog FORMAT=json`
  - Creates Trello board with sprint-based lists (Product Backlog + per-sprint + In Progress + Done)
  - Creates priority labels (Must Have=red, Should Have=orange, Could Have=yellow)
  - Creates type labels (Epic=purple, Story=blue, Task=green)
  - Creates cards with GDS user story format descriptions, requirements traceability
  - Adds acceptance criteria as checklists on each card
  - Rate-limit-aware (100 req/10s Trello limit)
  - Requires `TRELLO_API_KEY` and `TRELLO_TOKEN` environment variables
- **New Guide**: `docs/guides/trello.md` with prerequisites, credential setup, board structure, and troubleshooting
- **Multi-AI Support**: Trello command available for Gemini CLI (`.gemini/commands/arckit/trello.toml`) and Codex CLI (`.codex/prompts/arckit/trello.md`)

- **Converter Codex Generation**: `scripts/converter.py` now generates both Gemini TOML and Codex Markdown from Claude commands
  - Added `generate_codex()` function alongside existing Gemini generation
  - Agent-delegating commands (research, datascout, aws-research, azure-research) have full agent prompts inlined for both formats
  - Codex prompts use YAML frontmatter with `description` field and keep `$ARGUMENTS` syntax
  - Single `python scripts/converter.py` run produces 92 files (46 Gemini + 46 Codex)

### Changed

- **Claude Code Plugin Migration**: Claude Code distribution migrated from CLI to standalone plugin (`arckit-claude/`). Claude Code users should install via `/plugin marketplace add tractorjuice/arc-kit` instead of `arckit init --ai claude`
- **CLI `--ai claude` Redirect**: CLI `--ai claude` option now shows redirect message to plugin marketplace installation
- **Plugin MCP Hook Removed**: Removed redundant SessionStart hook that checked for already-bundled MCP servers (AWS Knowledge + Microsoft Learn)
- **Test Repo Migration**: All 22 test repos migrated from synced command/agent/template files to plugin marketplace
- **Codex Prompt Sync**: All 46 Codex prompts regenerated from Claude source of truth
  - 5 previously missing commands added: `aws-research`, `customize`, `datascout`, `strategy`, `trello`
  - All 41 existing prompts updated with latest content (external docs scanning, doc control blocks, doc type codes)
  - Removed `tags` field from YAML frontmatter (unused by Codex CLI)
- **Gemini TOML Sync**: All 46 Gemini TOMLs regenerated with latest Claude command content
- **Template References**: 8 commands now explicitly reference their templates with user override support:
  - `/arckit.analyze` → `analysis-report-template.md`
  - `/arckit.dos` → `dos-requirements-template.md`
  - `/arckit.evaluate` → now references both `evaluation-criteria-template.md` and `vendor-scoring-template.md`
  - `/arckit.jsp-936` → `jsp-936-template.md`
  - `/arckit.mod-secure` → `mod-secure-by-design-template.md`
  - `/arckit.plan` → `project-plan-template.md`
  - `/arckit.principles-compliance` → `principles-compliance-assessment-template.md`
  - `/arckit.service-assessment` → `service-assessment-prep-template.md`
- **Document Control Standardization**: 17 commands now include the standard "Auto-Populate Document Control Fields" block with Generate Document ID, Populate Required Fields, Revision History, and Generation Metadata Footer:
  - `/arckit.ai-playbook`, `/arckit.analyze`, `/arckit.atrs`, `/arckit.backlog`
  - `/arckit.data-mesh-contract`, `/arckit.diagram`, `/arckit.dld-review`
  - `/arckit.dos`, `/arckit.evaluate`, `/arckit.gcloud-clarify`, `/arckit.gcloud-search`
  - `/arckit.hld-review`, `/arckit.mod-secure`, `/arckit.plan`
  - `/arckit.roadmap`, `/arckit.strategy`, `/arckit.wardley`
- **Document Type Code Standardization**: Fixed 5 mismatches between commands and templates:
  - `backlog`: BLOG → BKLG (template aligned to command)
  - `dld-review`: DLD → DLDR (template aligned to command)
  - `hld-review`: HLD → HLDR (template aligned to command)
  - `mod-secure`: SECD → SECD-MOD (template aligned to command)
  - `roadmap`: ROADMAP → ROAD (template aligned to command)
- **Document Type Name Fixes**: 8 commands had incorrect or copy-pasted DOCUMENT_TYPE_NAME values:
  - `tcop`, `sow`, `traceability`, `secure`: Had "Business and Technical Requirements" (copy-paste from requirements)
  - `ai-playbook`, `dos`, `gcloud-search`, `roadmap`: Mismatched between command and template
- **Hardcoded Version Fixes**: `roadmap-template.md` and `architecture-strategy-template.md` had hardcoded `v1.0` instead of `v[VERSION]`
- **Duplicate Footer Removal**: `sobc.md` had both standardized doc control block AND old "Populate Metadata Footer" block with wrong command reference
- **Pages Command**: Updated doc type codes (BLOG→BKLG, ROADMAP→ROAD, HLD→HLDR, DLD→DLDR), added STRAT, AWRS, AZRS, DSCT types
- **Cross-Codebase Consistency**: Updated ~85 files across commands, templates, guides, migration scripts, README, docs/index.html, COMMANDS.md, Codex prompts, and Gemini TOMLs to use correct doc type codes
- **docs/manifest.json**: Added 10 missing templates to manifest (now 45 total)
- **DEPENDENCY-MATRIX.md**: Added strategy row/column to Tier 3.5 Strategic Planning, added trello row/column to Tier 7.5 Backlog Export
- Updated command count to 46 (was 45)

### Removed

- **Claude CLI Directories**: `.claude/commands/` and `.claude/agents/` directories removed from CLI distribution (now exclusively in `arckit-claude/`)
- **`--ai claude` CLI Option**: Removed as a valid init target (redirects to plugin installation instructions)
- **Orphan Template**: Removed `uk-gov-tcop-template.md` (duplicate of `tcop-review-template.md`)
- **Orphaned Codex Subdirectory**: Removed 12 files from `.codex/prompts/arckit/` (obsolete naming convention; all prompts now at `.codex/prompts/arckit.*.md`)

---

## [1.3.0] - 2026-02-03

### Added

- **External Document Support**: Standardized external document intake across all 39 commands and 4 agents
  - Commands auto-discover and consume user-provided files (vendor HLDs, policy docs, pen test reports, RFPs, audit reports, existing schemas, architecture diagram images)
  - Three standard locations: `projects/{project}/external/`, `projects/{project}/vendors/{vendor}/`, `projects/000-global/policies/`
  - Command-specific extraction guidance for each document type
  - Non-blocking: external docs enhance output quality but are never required
  - Generated documents include "External References" table citing consumed external docs
  - 6 command groups: Vendor (6), Policy & Governance (11), User Specification (8), Research (5), Operational (9), No Changes (4)

- **External References Table**: Added to all corresponding templates in `.arckit/templates/`
  - Populated when external docs are used, shows "None provided" otherwise
  - Columns: Document, Type, Source, Key Extractions, Path

- **Standard Directories**: CLI and scripts updated to create external document directories
  - `arckit init` creates `projects/000-global/policies/` directory
  - `create-project.sh` creates `external/` subdirectory in each numbered project
  - `.gitkeep` files ensure directories are tracked by git

- **v20 Test Repository**: `arckit-test-project-v20-uae-moi-ipad` (private) for UAE MOI IPAD Framework

### Changed

- **Dynamic Version Placeholders**: All 44 template metadata lines now use `[VERSION]` placeholder instead of hardcoded version numbers
  - Template metadata line: `> **Template Status**: [status] | **Version**: [VERSION] | **Command**: [command]`
  - Commands read the `VERSION` file at generation time and populate the placeholder
  - Eliminates version drift when bumping ArcKit version — only `VERSION` file needs updating

- **Command Version Fallbacks**: Updated all 13 commands with version fallbacks from `1.0.0` to current version
  - Commands that read VERSION file now have accurate fallback values

- **Converter Improvements** (`scripts/converter.py`): Enhanced agent-delegating command handling for Gemini TOML generation

- **CLAUDE.md**: Added v20 test repo to table and sync loop, added directory creation to sync script

### Fixed

- Stale `1.0.0` version fallbacks in 13 command files (should have been updated in 1.2.0)
- Hardcoded `1.0.0` version in all 44 template metadata lines (now dynamic `[VERSION]` placeholder)
- External document sections incorrectly nested inside "Detect Version" steps in 3 commands (story, adr, platform-design)

---

## [1.2.0] - 2026-02-03

### Added

- **Autonomous Agent System**: Research-heavy commands now delegate to autonomous agents (`.claude/agents/`) that run in isolated context windows via the Task tool
  - `arckit-research` agent for technology research, vendor evaluation, build vs buy, TCO analysis
  - `arckit-datascout` agent for data source discovery, API catalogue search, scoring
  - `arckit-aws-research` agent for AWS service research via AWS Knowledge MCP
  - `arckit-azure-research` agent for Azure service research via Microsoft Learn MCP
- **Agent documentation**: CLAUDE.md updated with agent system architecture, file structure, and when to create agents
- **CLI agent support**: `arckit init` now copies `.claude/agents/` directory to new projects

### Changed

- **Command refactoring**: `/arckit.research`, `/arckit.datascout`, `/arckit.aws-research`, `/arckit.azure-research` slash commands refactored to thin wrappers that delegate to agents with fallback to direct execution
- **Template updates**: Research templates updated with document control footer
- **All command guides**: Updated with agent delegation notes
- **README.md**: Added agent architecture to Supported AI Agents section, fixed missing example links (stakeholders, risk, sobc, azure-research, aws-research, gcloud-search), fixed broken platform-design v8 link, corrected Wardley Maps/ServiceNow/Diagrams prose references
- **docs/index.html**: Matching example link fixes, updated Multi-AI Support section with agent information
- **COMMANDS.md**: Updated command reference

### Fixed

- Broken platform-design v8 example link (pointed to non-existent `gaap-ecosystem-analysis.md` instead of `ARC-001-GAAP-v1.0.md`)
- Wardley Maps prose incorrectly referenced v1-m365 and v9-cabinet-office (neither has Wardley maps)
- ServiceNow prose incorrectly referenced v7-nhs and v1-m365 (neither has ServiceNow files)
- Diagrams prose incorrectly referenced v2-hmrc and v6-patent (neither has diagram folders)
- Missing example links for 6 commands across README.md and docs/index.html

---

## [1.1.0] - 2026-02-01

### Added

- **New Command: `/arckit.datascout`**: Data source discovery command (43rd ArcKit command)
  - Discovers external data sources (APIs, datasets, open data portals, commercial providers) to fulfil project requirements
  - Data needs extraction from DR/FR/INT/NFR requirements
  - Dynamic category detection (Geospatial, Financial, Company, Demographics, Weather, Health, Transport, Energy, Education, Property, Identity, Crime, Reference)
  - Weighted evaluation scoring (Requirements Fit 25%, Data Quality 20%, License & Cost 15%, API Quality 15%, Compliance 15%, Reliability 10%)
  - UK Government open data prioritisation (data.gov.uk, ONS, NHS Digital, Companies House, OS Data Hub, Environment Agency, Land Registry, Police API)
  - TCoP Point 10 compliance (Make Better Use of Data)
  - Gap analysis for unmet data needs
  - Data model impact assessment (new entities, attributes, sync strategy)
  - Requirements traceability (every DR-xxx mapped to a source or flagged as gap)
  - Bidirectional with data-model command
- **New Template**: `datascout-template.md` for data source discovery outputs
- **New Guide**: `docs/guides/datascout.md` with usage documentation

### Changed

- Updated command count to 43 (was 42)
- Updated DEPENDENCY-MATRIX.md with datascout row/column
- Updated WORKFLOW-DIAGRAMS.md with datascout node in all 5 workflow paths
- Updated critical paths in DEPENDENCY-MATRIX.md to include datascout after requirements

---

## [1.0.4] - 2026-01-31

### Added

- **v18-smart-meter test project**: UK Smart Meter Data Consumer Mobile App added to test repos
- **Example links**: Added v17-fuel-prices and v18-smart-meter example links across README command tables (principles, stakeholders, requirements, risk, data-model, research, plan, dpia, diagram, backlog, azure-research, aws-research, secure, pages)

### Changed

- **Pages template header**: Replaced left-title/centre-stats/right-meta header with G-Cloud Kit navigation style — brand link on left, nav links (stats, GitHub, ArcKit) on right using BEM class naming
- **Pages command**: Rewrote Step 3 to mandate reading `pages-template.html` as the source of truth before generating `docs/index.html` — previously the template was an optional fallback buried at the bottom of the command, causing the AI to generate HTML from scratch instead of using the template
- **Mobile responsiveness**: Added hamburger navigation with backdrop overlay, reduced heading font sizes on mobile, fixed TOC overlay on small screens
- **MCP configuration**: Renamed `mcp.json` to `.mcp.json` (dotfile convention), added to test repo sync
- **DEPENDENCY-MATRIX.md**: Aligned tier descriptions with actual command dependencies
- **CLAUDE.md**: Added note about re-running `/arckit.pages` after template changes

### Fixed

- Multiple layout issues in `docs/index.html` (mobile navigation, TOC overlay, heading sizes)

---

## [1.0.3] - 2026-01-29

### Added

- **New Command: `/arckit.aws-research`**: AWS-specific technology research using AWS Knowledge MCP server
  - Requires AWS Knowledge MCP server (mandatory prerequisite)
  - Uses official AWS documentation via MCP tools (`search_documentation`, `read_documentation`, `get_regional_availability`, `list_regions`, `recommend`)
  - AWS service recommendations mapped to requirements
  - AWS Well-Architected Framework assessment (6 pillars including Sustainability)
  - AWS Security Hub / Foundational Security Best Practices mapping
  - UK Government compliance (G-Cloud, eu-west-2 London region, NCSC principles)
  - Real-time regional availability checks for eu-west-2
  - Cost estimates with optimization recommendations
  - CloudFormation/CDK/Terraform implementation templates
  - AWS CodePipeline examples
- **New Template**: `aws-research-template.md` for AWS research outputs
- **New Guide**: `docs/guides/aws-research.md` with usage documentation

### Changed

- Updated command count to 42 (was 41)

---

## [1.0.2] - 2026-01-29

### Added

- **New Command: `/arckit.azure-research`**: Azure-specific technology research using Microsoft Learn MCP server
  - Requires Microsoft Learn MCP server (mandatory prerequisite)
  - Uses official Microsoft documentation via MCP tools (`microsoft_docs_search`, `microsoft_docs_fetch`, `microsoft_code_sample_search`)
  - Azure service recommendations mapped to requirements
  - Azure Well-Architected Framework assessment (5 pillars)
  - Azure Security Benchmark mapping (12 control domains)
  - UK Government compliance (G-Cloud, UK regions, NCSC principles)
  - Cost estimates with optimization recommendations
  - Bicep/Terraform implementation templates
  - Azure DevOps pipeline examples
- **New Template**: `azure-research-template.md` for Azure research outputs
- **New Guide**: `docs/guides/azure-research.md` with usage documentation

### Changed

- Updated command count to 41 (was 40)

---

## [1.0.1] - 2026-01-28

### Added

- **Migration Guide**: New `docs/guides/migration.md` with comprehensive documentation for file migration
- **Research Subdirectory**: Multi-instance research documents now stored in `research/` directory
- **Auto-migrate Principles**: Migration script automatically migrates principles from legacy `.arckit/memory/` location

### Changed

- **Migration Script Enhancements**:
  - Add `--global` flag to migrate only 000-global directory
  - Handle root-level ADR, diagram, wardley, and research files
  - Add alternative filename mappings (tcop-assessment.md, hld.md, dld.md, digital-marketplace-dos.md)
  - Handle `procurement/` subdirectory files
  - Fix nullglob bug causing incorrect sequence numbers
  - Add version-suffixed traceability file handling

- **Pages Command Updates**:
  - Add `reviews`, `wardleyMaps`, `dataContracts`, `research` arrays to manifest
  - Support new subdirectory structure in navigation

- **Templates**:
  - Reverted Power-Interest grids to ASCII format (Mermaid quadrantChart had readability issues)
  - Reverted Risk matrices to ASCII 5×5 format

### Fixed

- Fixed `v8-cabinet-office-genai` → `v9-cabinet-office-genai` typo in documentation
- Added missing v7-nhs-appointment and v16-doctors-appointment to public repos list

---

## [1.0.0] - 2026-01-28

### Release Highlights

**ArcKit reaches 1.0.0** - This release marks ArcKit as production-ready for enterprise architecture governance workflows.

### What's Included

- **40 Slash Commands**: Complete toolkit for architecture governance, vendor procurement, and design review
- **UK Government Compliance**: TCoP, Service Standard, Secure by Design, AI Playbook, ATRS, JSP 936
- **HM Treasury Frameworks**: Green Book (SOBC), Orange Book (Risk Management)
- **Multi-AI Support**: Claude Code, OpenAI Codex CLI, Gemini CLI
- **Template-Driven Generation**: Comprehensive templates for all document types
- **Traceability Chain**: Stakeholders → Goals → Requirements → Design → Tests

### Stability

- All 14 Live-status commands extensively tested across 16 test repositories
- 18 Beta-status commands feature-complete and actively refined
- 4 Alpha-status commands working with limited testing
- 5 Experimental commands for early adopters

---

## [0.2.0] - 2026-01-28

### Changed

- **BREAKING: Standardized Document Filenames**: All 40 commands now output files using Document ID pattern
  - Format: `ARC-{PROJECT_ID}-{TYPE}-v{VERSION}.md` (e.g., `ARC-001-REQ-v1.0.md`)
  - Multi-instance types (ADR, DIAG, WARD, DMC): `ARC-{PROJECT_ID}-{TYPE}-{NUM}-v{VERSION}.md`
  - Unified output locations with subdirectories: `decisions/`, `diagrams/`, `wardley-maps/`, `data-contracts/`, `reviews/`
  - Architecture principles now use `ARC-000-PRIN-v1.0.md` (000 = global document)

- **Updated `generate-document-id.sh`**: Added `--filename` and `--next-num` flags
  - `--filename`: Returns ID with `.md` extension
  - `--next-num DIR`: Auto-determines next sequence number for multi-instance types

- **Updated `create-project.sh`**: Project README now documents new filename patterns
  - JSON output includes new filename patterns
  - Creates subdirectories for multi-instance types

- **Updated `common.sh`**: `create_project_dir()` now creates all subdirectories

### Added

- **`migrate-filenames.sh`**: Migration script for existing projects
  - Renames old filenames to new Document ID pattern
  - Creates backups before changes
  - Supports `--dry-run`, `--all`, `--force` options

### Removed

- **Duplicate guide**: Removed `docs/guides/wardley-mapping.md` (duplicate of `wardley.md`)

### Type Code Reference

| Command | Type Code | Output Pattern |
|---------|-----------|----------------|
| requirements | REQ | `ARC-{PID}-REQ-v1.0.md` |
| stakeholders | STKE | `ARC-{PID}-STKE-v1.0.md` |
| risk | RISK | `ARC-{PID}-RISK-v1.0.md` |
| sobc | SOBC | `ARC-{PID}-SOBC-v1.0.md` |
| principles | PRIN | `ARC-000-PRIN-v1.0.md` |
| adr | ADR | `ARC-{PID}-ADR-{NUM}-v1.0.md` |
| diagram | DIAG | `ARC-{PID}-DIAG-{NUM}-v1.0.md` |
| wardley | WARD | `ARC-{PID}-WARD-{NUM}-v1.0.md` |
| data-model | DATA | `ARC-{PID}-DATA-v1.0.md` |
| research | RSCH | `ARC-{PID}-RSCH-v1.0.md` |
| traceability | TRAC | `ARC-{PID}-TRAC-v1.0.md` |
| ... | ... | See full list in CLAUDE.md |

---

## [0.11.2] - 2026-01-26

### Added

- **Dynamic Version in Commands**: 29 commands now read VERSION file and update template metadata
  - Generated documents automatically show current ArcKit version
  - Template status remains static (Live/Beta/Alpha/Experimental)

- **Template Metadata**: All 41 templates now include status/version blockquote
  - Format: `> **Template Status**: [status] | **Version**: [version] | **Command**: [command]`
  - Status indicates maturity: Live (14), Beta (18), Alpha (4), Experimental (5)

- **New Templates**: Added templates for 5 commands that previously generated inline
  - `analysis-report-template.md` for `/arckit.analyze`
  - `project-plan-template.md` for `/arckit.plan`
  - `dos-requirements-template.md` for `/arckit.dos`
  - `gcloud-clarify-template.md` for `/arckit.gcloud-clarify`
  - `gcloud-requirements-template.md` for `/arckit.gcloud-search`

### Changed

- **Pages Template**: Moved "On this page" (TOC) from right side to left side of content
  - Better reading flow with navigation on left
  - Content remains left-aligned

### Removed

- **Unused Templates**: Removed 5 internal speckit templates not referenced by any commands
  - plan-template.md, checklist-template.md, tasks-template.md, spec-template.md, agent-file-template.md

### Fixed

- **Legacy Template Paths**: Fixed arckit.secure.md and arckit.tcop.md using old `.specify/templates/` paths

---

## [0.11.1] - 2026-01-24

- **GitHub Pages Manifest**: Added `docs/manifest.json` for programmatic document index access
  - Lists all guides, templates, and documentation
  - Enables future document viewer integration

### Changed

- **Template Footer Standardization**: All 36 templates now use consistent footer format
  - Standard fields: Generated by, Generated on, ArcKit Version, Project, Model
  - Updated: adr-template, dpia-template, platform-design-template, roadmap-template, story-template

- **Documentation**: Updated CLAUDE.md with standard footer format specification
  - Added footer format to Document Control Standard section
  - Updated test repo count to 16

### Fixed

- Inconsistent footer formats across templates (some used bullet lists, some had no footer)

---

## [0.11.0] - 2026-01-23

### Added

- **Enhanced `arckit init`**: New flags and documentation copying
  - `--all-ai` flag: Install commands for all AI assistants (Claude, Gemini, Codex)
  - `--minimal` flag: Skip copying docs and guides for lightweight install
  - Now copies `docs/guides/` with command usage documentation
  - Now copies `docs/README.md` as documentation index
  - Now copies `DEPENDENCY-MATRIX.md` for command dependencies
  - Now copies `WORKFLOW-DIAGRAMS.md` for visual workflows

- **New Command**: `/arckit.pages` (40th ArcKit command) - Generate GitHub Pages documentation site
  - **Auto-Discovery**: Scans repository for all known ArcKit artifacts across all projects
  - **Document Categories**: Discovery, Planning, Architecture, Governance, Compliance, Operations, Procurement, Diagrams, Decisions
  - **Mermaid Support**: Auto-renders all Mermaid diagrams (flowcharts, sequence, C4, ERD, Gantt, state, class)
  - **GOV.UK Styling**: Professional government design system (GOV.UK Frontend 5.13.0)
  - **Manifest Generation**: Creates `docs/manifest.json` for programmatic access to document index
  - **Hash-Based Routing**: Shareable URLs to specific documents (`#projects/001-name/requirements.md`)
  - **Mobile Responsive**: Works on all screen sizes with collapsible sidebar
  - **Lazy Loading**: Documents fetched on demand with in-memory caching
  - **Template**: `pages-template.html` - Full HTML/CSS/JS single-page application
  - **Guide**: `docs/guides/pages.md` - Usage guide with workflow and setup instructions
  - **Workflow Position**: Tier 12: Documentation Publishing (utility command)
  - **Use Cases**: Project documentation portals, architecture documentation sites, stakeholder communication

- **Command Guides**: Added 21 comprehensive guides for complete command coverage
  - All 40 commands now have dedicated playbooks in `docs/guides/`
  - Each guide includes: inputs, command usage, outputs, workflow position, review checklist, key principles
  - Guides for: ai-playbook, analyze, atrs, backlog, data-mesh-contract, devops, dld-review, dos, dpia, evaluate, finops, gcloud-clarify, gcloud-search, hld-review, jsp-936, mlops, mod-secure, operationalize, pages, platform-design, servicenow

### Changed

- **Documentation Site**: Enhanced `docs/index.html` with interactive features
  - Added Mermaid.js for workflow diagram rendering
  - Made Command and Status columns sticky for better navigation
  - Reduced table row height with tighter padding
  - Expanded example links to show multiple test projects per command
  - Changed workflow diagram to vertical layout for better readability

- **Dependency Matrix**: Updated to include pages command
  - Added pages column with Recommended (R) dependencies on all document-producing commands
  - Added Tier 12: Documentation Publishing
  - Total commands: 40

### Fixed

- Mermaid diagram syntax for cross-subgraph connections
- DOS and G-Cloud commands status changed to experimental
- Missing example links in command reference tables

## [0.10.0] - 2026-01-21

### Added

- **New Command**: `/arckit.finops` (39th ArcKit command) - Create FinOps strategy for cloud financial management
  - **Cost Visibility**: Tagging strategy, cost allocation, reporting cadence, dashboards
  - **Cost Optimization**: Rightsizing, reserved instances/savings plans, spot instances, storage tiering
  - **Commitment Management**: RI/SP inventory, utilization tracking, purchase recommendations
  - **Showback/Chargeback**: Allocation methodology, unit economics, internal billing processes
  - **Budgeting & Forecasting**: Budget types, alert thresholds, forecasting methodology
  - **Anomaly Detection**: Alert configuration, investigation workflow, escalation matrix
  - **Governance**: Cloud policies, approval workflows, exception processes
  - **Sustainability**: Carbon footprint visibility, green region preferences, sustainable practices
  - **UK Government Context**: Cabinet Office spend controls, Treasury Green Book, G-Cloud tracking
  - **Template**: `finops-template.md` (800+ lines) with 16 comprehensive sections
  - **Workflow Position**: Run AFTER /arckit.devops (Tier 8: Operations)
  - **Use Cases**: Cloud cost management, FinOps maturity assessment, cost optimization initiatives

- **New Command**: `/arckit.operationalize` (36th ArcKit command) - Create operational readiness pack for production services
  - **SRE Best Practices**: SLIs, SLOs, error budgets, golden signals monitoring
  - **Support Model**: Tiered support (L1/L2/L3), escalation procedures, on-call rotations
  - **Runbook Library**: 6 detailed runbooks (startup, shutdown, backup/restore, incident response, scaling, failover)
  - **DR/BCP**: Disaster recovery procedures, business continuity planning, RTO/RPO targets
  - **Operational Handover**: Knowledge transfer, training materials, handover checklists
  - **UK Government Context**: Service Standard operations alignment, NCSC CAF operational security
  - **Template**: `operationalize-template.md` (1,000+ lines) with 17 comprehensive sections
  - **Workflow Position**: Run AFTER /arckit.servicenow (Tier 8: Operations)
  - **Use Cases**: Production readiness, operations handover, SRE implementation, support model design

- **New Command**: `/arckit.devops` (35th ArcKit command) - Create comprehensive DevOps strategy
  - **CI/CD Pipeline Design**: Build automation, testing strategy, quality gates, artifact management
  - **Infrastructure as Code**: Terraform/Pulumi/CloudFormation patterns, module structure, state management
  - **Container Strategy**: Docker, container registries, image scanning, orchestration (Kubernetes/ECS)
  - **GitOps**: ArgoCD/Flux patterns, deployment strategies (blue-green, canary, rolling)
  - **DevSecOps**: Shift-left security, SAST/DAST/SCA integration, compliance as code
  - **Developer Experience**: Local development, devcontainers, inner loop optimization, self-service
  - **DORA Metrics**: Deployment frequency, lead time, MTTR, change failure rate tracking
  - **UK Government Context**: Cloud First (TCoP Point 5), open standards, Digital Marketplace compatibility
  - **Template**: `devops-template.md` (1,200+ lines) with 17 comprehensive sections
  - **Workflow Position**: Run AFTER /arckit.servicenow (Tier 8: Operations)

- **New Command**: `/arckit.mlops` (34th ArcKit command) - Create MLOps strategy for AI/ML projects
  - **Model Lifecycle**: Training, serving, monitoring, retirement workflows
  - **Training Pipeline**: Experiment tracking, hyperparameter optimization, model versioning
  - **Feature Engineering**: Feature stores, data versioning, feature quality checks
  - **Model Registry**: Model storage, metadata, approval workflow, promotion stages
  - **Model Monitoring**: Data drift, concept drift, performance degradation, fairness monitoring
  - **Retraining Strategy**: Automated triggers, champion-challenger deployment, rollback procedures
  - **LLM/GenAI Operations**: Prompt management, guardrails, token monitoring, RAG pipelines
  - **Responsible AI**: Bias detection, explainability (SHAP/LIME), human oversight mechanisms
  - **UK Government Context**: AI Playbook principles, ATRS compliance, JSP 936 for MOD projects
  - **Template**: `mlops-template.md` (1,100+ lines) with 15 comprehensive sections
  - **Workflow Position**: Run AFTER /arckit.devops for AI projects (Tier 8: Operations)

- **New Command**: `/arckit.platform-design` (33rd ArcKit command) - Design multi-sided platforms using Platform Design Toolkit (PDT) methodology
  - **8 PDT Canvases**: Ecosystem Canvas, Entity-Role Portraits, Motivations Matrix, Transactions Board, Learning Engine Canvas, Platform Experience Canvas, MVP Canvas, Platform Design Canvas
  - **Platform Economics**: Transaction cost reduction analysis (search, information, negotiation, coordination, enforcement costs)
  - **Network Effects**: Same-side, cross-side, data, and learning network effects for defensibility
  - **Auto-Population**: Extracts stakeholders → entity portraits, requirements → platform capabilities, Wardley maps → build vs buy, principles → governance
  - **Ecosystem Mapping**: Supply side, demand side, supporting entities with Mermaid relationship diagrams
  - **Entity Portraits**: 3-5 detailed portraits with context, performance pressures, goals, gains (pain relievers, gain creators)
  - **Motivations Matrix**: Cross-entity synergies and conflicts with mitigation strategies
  - **Transactions Board**: 10-20 transactions with cost analysis, data flows, platform services that reduce each cost
  - **Learning Engine**: 5+ services that help ecosystem participants improve (data sources, feedback loops, network learning effects)
  - **Platform Experience**: 2+ journey maps (onboarding, transaction, touchpoints, emotions, business model, unit economics)
  - **MVP Canvas**: Assumption-risk matrix, minimum feature set, liquidity bootstrapping strategy, validation metrics
  - **Liquidity Bootstrapping**: Solves chicken-and-egg problem (seed supply, incentivize demand, staged rollout, validation strategy)
  - **UK Government Context**: Government as a Platform (GaaP), TCoP Point 8 (share/reuse/collaborate), Digital Marketplace integration
  - **Template**: `platform-design-template.md` (1,800+ lines) with all 8 canvases, comprehensive PDT methodology
  - **Guide**: `docs/guides/platform-design.md` - What is PDT, when to use, 8 canvas explanations, GaaP context, examples, common pitfalls
  - **Workflow Position**: Run AFTER /arckit.requirements (Tier 3.5: Strategic Planning), BEFORE detailed design (Tier 4)
  - **Use Cases**: Government as a Platform services, data marketplaces, multi-sided platforms, NHS appointment booking, training marketplaces
  - **Based on**: Platform Design Toolkit v2.2.1 from Boundaryless.io (CC-BY-SA license)

### Changed

### Fixed

### Removed

## [0.9.1] - 2025-11-12

### Added

- **Document Control Standard**: New reference in `docs/templates/document-control.md` plus README cross-links so every command references the same metadata expectations (Document ID, classification, review cadence, distribution, revision history, etc.).
- **Guides**: Added roadmap and ADR playbooks under `docs/guides/` to document the new workflows released in 0.9.0 and highlight where document control fits in those processes.

### Changed

- **Template Alignment**: All Markdown templates in `.arckit/templates/` now share the canonical Document Control table and revision history format, with doc-specific fields (e.g., ADR Number, Financial Years) appended below the standard block.
- **Command Updates**: Claude/Codex/Gemini instructions explicitly reference the new standard, require `generate-document-id.sh`, and ensure commands populate metadata before writing body content.
- **Dynamic Version Metadata**: `/arckit.sobc` and `/arckit.service-assessment` prompts (for every agent) read `.arckit/VERSION` so generated artifacts always show the current ArcKit release.
- **Docs Refresh**: README, docs index, workflow diagrams, dependency matrix, and command references updated to advertise v0.9.1 as the latest release.

### Fixed

- **Version Drift**: Removed remaining hardcoded `v0.9.0` strings so prompts either reference `.arckit/VERSION` or historical sections only.

## [0.9.0] - 2025-01-06

### Added

- **New Command**: `/arckit.data-mesh-contract` (32nd ArcKit command) - Create federated data product contracts for mesh architectures
  - **ODCS Compliance**: Open Data Contract Standard v3.0.2 with full YAML export
  - **10 Core Sections**: Fundamentals, Schema, Data Quality, SLA, Access Methods, Security, Governance, Consumer Obligations, Pricing, Infrastructure
  - **Auto-Population**: Extracts entities from data-model.md (→ objects), DR-xxx requirements (→ quality rules), NFR-xxx (→ SLA targets), stakeholders (→ ownership roles)
  - **Schema Management**: Semantic versioning (MAJOR.MINOR.PATCH), breaking change policy with 90-day notice, backward compatibility guarantees
  - **Data Quality**: ODCS-compatible automated rules (null_check, uniqueness, referential_integrity, regex, range) executable by data quality engines
  - **SLA Commitments**: Availability (99.9%), response time (p95 <200ms), freshness (<5min), retention policies
  - **Access Methods**: REST API, GraphQL, SQL query, data lake, event streams with authentication, rate limits, consumer onboarding
  - **GDPR Compliance**: PII inventory, legal basis, data subject rights, cross-border transfers, DPIA integration, audit logging
  - **Federated Governance**: Change management (minor 7-day notice, major 90-day notice), quarterly reviews, deprecation policy
  - **Consumer Obligations**: Attribution, usage constraints, quality feedback, security requirements
  - **UK Government Context**: Technology Code of Practice alignment, National Data Strategy pillars, Data Quality Framework (5 dimensions)
  - **Template**: `data-mesh-contract-template.md` (1,100+ lines) with 16 sections, ODCS YAML export, comprehensive guidance
  - **Guide**: `docs/guides/data-mesh-contract.md` - What is data mesh, domain ownership, data as product, computational governance
  - **Workflow Position**: Run AFTER /arckit.data-model (entities → objects) and /arckit.requirements (DR-xxx → quality rules)
  - **Use Cases**: Data mesh architectures, federated data ownership, data product management, multi-domain data sharing, self-serve analytics

- **New Command**: `/arckit.dpia` (30th ArcKit command) - Generate Data Protection Impact Assessment for UK GDPR Article 35 compliance
  - **ICO 9-Criteria Screening**: Automated assessment (evaluation, automated decisions, monitoring, sensitive data, large scale, dataset matching, vulnerable subjects, innovative tech, rights prevention)
  - **Auto-Population**: Extracts entities, PII, special category data from data-model.md; processing purposes from requirements.md; data subjects from stakeholder-drivers.md
  - **Risk Assessment**: Focus on impact on individuals (privacy harm, discrimination, physical harm, financial loss), not organizational risk
  - **Likelihood × Severity Matrix**: Remote/Possible/Probable × Minimal/Significant/Severe = Low/Medium/High risk
  - **Risk Register Integration**: Bidirectional links with DPIA-xxx risk IDs in risk register
  - **Mitigation Extraction**: Links security controls from secure-by-design-assessment.md as DPIA mitigations
  - **Data Subject Rights**: Implementation checklist for SAR, rectification, erasure, portability, objection, restriction, automated decision-making
  - **Children's Data Assessment**: Age verification, parental consent, best interests, child-friendly privacy notices
  - **AI/ML Assessment**: Algorithmic bias, explainability, human oversight, links to ai-playbook and ATRS
  - **ICO Prior Consultation**: Automatic flagging when residual high risks require ICO consultation before processing
  - **International Transfers**: Safeguards assessment (SCCs, BCRs, adequacy decisions)
  - **Template**: `dpia-template.md` (1,000+ lines) with 16 sections following ICO guidance
  - **Legal Context**: UK GDPR Article 35 REQUIRES DPIAs for high-risk processing; failure to conduct when required can result in ICO enforcement
  - **Workflow Position**: Run AFTER /arckit.data-model (needs data inventory), BEFORE /arckit.research (must assess privacy risks before tech selection)
  - **Use Cases**: Health data processing, AI/ML systems, large-scale profiling, children's services, vulnerable groups, cross-border transfers

- **New Command**: `/arckit.principles-compliance` (31st ArcKit command) - Assess project compliance with architecture principles
  - **Dynamic Principle Extraction**: Extracts ALL principles from architecture-principles.md (supports 5, 10, 20+ principles - never assumes fixed count)
  - **RAG Status System**: Four-level assessment (🟢 GREEN: Fully compliant | 🟠 AMBER: Partial compliance | 🔴 RED: Non-compliant | ⚪ NOT ASSESSED: Insufficient evidence)
  - **Evidence-Based Assessment**: All RAG statuses must link to specific file:section:line references from project artifacts
  - **Validation Gates**: Each principle's validation checklist assessed individually with PASS/FAIL/N/A status
  - **Comprehensive Evidence Search**: Requirements coverage, design evidence (HLD/DLD), implementation artifacts, compliance assessments (TCoP, Secure by Design), validation results
  - **Gap Identification**: For AMBER/RED principles - specific gaps with impact, severity, remediation plan, responsible owner, target date
  - **Exception Management**: Time-bound waivers with CTO/CIO approval workflow, expiry dates, quarterly review process
  - **Point-in-Time Assessment**: Run at project gates (Discovery, Alpha, Beta, Live) and quarterly for ongoing compliance monitoring
  - **Gate Decision Support**: Overall recommendation (❌ BLOCK / ⚠️ CONDITIONAL APPROVAL / ✅ PROCEED) with prioritized action plan
  - **Template**: `principles-compliance-assessment-template.md` (340+ lines) with executive summary, compliance scorecard, detailed assessments, exception register
  - **Integration**: Feeds into /arckit.analyze and /arckit.service-assessment for comprehensive quality/compliance checks
  - **Use Cases**: Project gate reviews, quarterly compliance audits, architecture governance, demonstrating principles adoption, identifying architecture drift
  - **Workflow Position**: Run AFTER design reviews when evidence exists, BEFORE major project gates for go/no-go decisions

- **New Command**: `/arckit.story` (29th ArcKit command) - Generate comprehensive project story with timeline analysis
  - **Timeline Analysis**: 4 visualization types (Gantt chart, linear flowchart, detailed table, phase duration pie chart)
  - **Timeline Metrics**: Project duration, velocity, phase analysis, critical path identification
  - **Complete Timeline**: All events from git log or file modification dates with days-from-start
  - **8 Narrative Chapters**: Foundation → Business Case → Requirements → Research → Procurement → Design → Delivery → Compliance
  - **Traceability Demonstration**: End-to-end chains with Mermaid diagrams showing stakeholder → goals → requirements → stories → sprints
  - **Governance Achievements**: Showcase compliance (TCoP, Service Standard, NCSC CAF), risk management, decision rationale
  - **Strategic Context**: Wardley Map insights, build vs buy decisions, vendor selection rationale
  - **Lessons Learned**: Pacing analysis, timeline deviations, recommendations for future projects
  - **Comprehensive Appendices**: Artifact register, chronological activity log, DSM, command reference, glossary
  - **Template**: `story-template.md` (1,200+ lines) with timeline-first approach
  - **Use Cases**: Project milestones, completion reporting, stakeholder communication, portfolio reporting, demonstrating ArcKit governance value

### Changed

- **LICENSE**: Updated copyright holder from "GitHub" to "Mark Craddock"
- **Project README template**: Now documents all 30 commands (previously only 8)
  - Added Phase 15: Project Story & Reporting with `/arckit.story` command
  - Added 10 organized categories: Project Planning, Core Workflow, Vendor Procurement, Design Review, Architecture Diagrams, Sprint Planning, Service Management, Traceability & Quality, UK Government Compliance, Security Assessment
  - Improves command discoverability for new ArcKit projects
- **DEPENDENCY-MATRIX.md**: Added story command as Tier 11 (final reporting tier)
  - All dependencies are optional (O) - scans whatever artifacts exist
  - Added to all 5 critical paths as final reporting step
  - 29×29 matrix now complete
- **WORKFLOW-DIAGRAMS.md**: Added story command to all 5 workflow diagrams
  - Added as gold/yellow box (Tier 11: Reporting)
  - Updated legend to include gold boxes for reporting tier
  - Story command is final step in all workflow paths

### Removed

- **Obsolete documentation files** (7 files, ~123KB):
  - `PUSH-TO-GITHUB.md` - Initial push instructions (no longer needed)
  - `OPENAI-INTEGRATION-PLAN.md` - Planning doc (implemented in .codex/)
  - `UI-IMPLEMENTATION-PLAN.md` - Future planning (not current priority)
  - `arckit-backlog-command-design.md` - Design doc (command implemented)
  - `gds-service-assessment-command-design.md` - Design doc (command implemented)
  - `ARTICLE.md` - Marketing article draft
  - `GITHUB-DISCUSSION-POST.md` - Discussion post draft

## [0.8.3] - 2025-11-02

### Fixed

- **Command Template Synchronization**: Ensured all 28 commands are synchronized across Claude Code, Codex CLI, and Gemini CLI platforms
  - Fixed missing dependency checks in command templates
  - Validated all M/R/O dependencies are properly enforced

### Changed

- **Documentation Cleanup**: Removed completed dependency gap analysis files
  - Removed `DEPENDENCY-GAPS-SUMMARY.md` (Phase 1-2 fixes complete)
  - Removed `DEPENDENCY-MATRIX-GAPS.md` (all critical gaps resolved)
  - Updated `README.md` to remove gap file references
  - Updated `CHANGELOG.md` to note Phase 1-2 completion
  - Updated `CLAUDE.md` developer documentation
  - Gap analysis preserved in git history (commits 4a3f631, 5da8a62, 561902d)

- **Test Repository Updates**: All 10 arckit-test-project repositories synchronized with v0.8.3
  - Updated all commands, templates, and scripts
  - Pushed WORKFLOW-DIAGRAMS.md with Phase 2 R-level dependency visualizations
  - Removed obsolete gap analysis files
  - Repository rename: arckit-test-project-v8-cabinet-office-genai → v9-cabinet-office-genai

## [0.8.2] - 2025-11-01

### Fixed

- **Dependency Matrix Accuracy**: Corrected 4 critical (M-level) dependency errors
  - `dos` now correctly requires principles (M) - ensures evaluation framework aligned with architecture governance
  - `evaluate` now correctly requires principles (M) - ensures vendor scoring criteria match organizational standards
  - `hld-review` now correctly requires principles (M) - validates design decisions against documented principles
  - `dld-review` now correctly requires principles (M) - ensures implementation adheres to architectural standards

- **High-Priority Dependencies**: Added 9 recommended (R-level) dependencies to improve quality
  - `plan` now recommends stakeholders (R), requirements (R), principles (R), sobc (R), risk (R) - creates realistic timelines based on project scope
  - `principles` now recommends gcloud-search (R) for G-Cloud procurement - ensures search criteria align with principles
  - `stakeholders` now recommends research (R), dos (R) - better procurement strategy and vendor requirements
  - `data-model` now recommends research (R) - data modeling informed by vendor research and technology choices
  - `service-assessment` now recommends plan (R) - validates timelines and delivery approach

- **Artifact Summary Counts**: Corrected consumer counts in dependency matrix
  - `principles.md` consumer count: 10 → 14 commands (added dos, gcloud-search, service-assessment)
  - `stakeholders.md` consumer count: 7 → 9 commands (added research, dos, service-assessment)

### Added

- **Comprehensive Dependency Documentation** (3 new documents):
  - `DEPENDENCY-MATRIX.md` (191 lines) - 28×28 Dependency Structure Matrix showing all command dependencies
    - Matrix legend (M=Mandatory, R=Recommended, O=Optional)
    - 10-tier dependency hierarchy (Tier 0: Foundation → Tier 10: Compliance)
    - 5 critical paths (Standard, UK Gov, UK Gov AI, MOD Defence, MOD Defence AI)
    - Artifact fan-in/fan-out analysis (requirements.md consumed by 22 commands)
    - Design notes explaining dependency rationale
    - All critical and high-priority dependencies implemented (Phase 1-2 complete)
  - `WORKFLOW-DIAGRAMS.md` (431 lines) - Visual workflow diagrams for all 5 project paths
    - Mermaid flowcharts showing decision gates and command flows
    - Standard Project workflow (12 steps)
    - UK Government Project workflow (16 steps)
    - UK Government AI Project workflow (15 steps)
    - MOD Defence Project workflow (16 steps)
    - MOD Defence AI Project workflow (17 steps)

### Changed

- **Command Template Enforcement**: Updated 4 command templates to enforce critical dependencies
  - `.claude/commands/arckit.dos.md` - Added principles (M) check with guidance
  - `.claude/commands/arckit.evaluate.md` - Added principles (M) check with guidance
  - `.claude/commands/arckit.hld-review.md` - Added principles (M) check with guidance
  - `.claude/commands/arckit.dld-review.md` - Added principles (M) check with guidance

### Why This Matters

The dependency matrix work ensures ArcKit commands are executed in the correct order, preventing:

- **Quality Issues**: Running evaluate without principles means vendor scoring isn't aligned with organizational standards
- **Rework**: Running hld-review/dld-review without principles means design decisions may violate governance
- **Incomplete Analysis**: Running plan without requirements means timelines don't reflect actual scope
- **Procurement Failures**: Running dos without stakeholders means vendor requirements don't address real needs

The comprehensive dependency documentation provides:

- **Clear Guidance**: 5 workflow diagrams showing exactly which commands to run for different project types
- **Traceability**: Complete dependency chain from foundation commands to final compliance assessments
- **Quality Assurance**: Artifact fan-in analysis shows requirements.md consumed by 22 commands (highest)

This release completes the dependency analysis initiative (Issue #9) with:

- Phase 1: 4 critical (M-level) fixes ✅
- Phase 2: 9 high-priority (R-level) enhancements ✅
- Phase 3: 26 optional (O-level) enhancements (future work)

## [0.8.1] - 2025-11-01

### Fixed

- **Installation compatibility**: Added fallback path for system-wide pip installs
  - Resolves issues when ArcKit installed globally vs in virtual environment
  - Improved template and script discovery across different installation methods

## [0.8.0] - 2025-11-01

### Added

- **Enterprise document control system**: Complete version control and document management
  - Document metadata (version, status, approvers, classification)
  - Comprehensive change log tracking
  - Version control best practices
  - Distribution and access control
  - Applied to all generated documents

- **Enhanced backlog template**: Updated with document control metadata

### Fixed

- **Package distribution**: Added .arckit directory to package distribution
  - Templates and scripts now properly included in pip/uv installs
  - Fixed missing templates issue in fresh installations

- **Script paths**: Corrected script paths in all command files
  - Scripts now reference correct `/scripts/` directory
  - Improved script execution reliability

### Changed

- **Repository organization**: Consolidated scripts to root /scripts directory
  - Removed duplicate root templates directory
  - Cleaner repository structure
  - Improved maintainability

## [0.7.0] - 2025-10-31

### Added

- **`/arckit.jsp-936` command**: MOD JSP 936 AI assurance documentation generator
  - Comprehensive JSP 936 (Dependable Artificial Intelligence in Defence) compliance documentation
  - 5 Ethical Principles assessment: Human-Centricity, Responsibility, Understanding, Bias & Harm Mitigation, Reliability
  - AI ethical risk classification using likelihood × impact matrix (1-5 scale)
  - 5 Risk Classification Levels (Critical/Severe/Major/Moderate/Minor) with approval pathways
  - 8 AI Lifecycle Phases: Planning, Requirements, Architecture, Algorithm Design, Model Development, V&V, Integration & Use, Quality Assurance
  - Governance structure documentation (RAISOs, Ethics Managers, Independent Assurance)
  - Approval pathways (2PUS/Ministerial → Defence-Level JROC/IAC → TLB-Level)
  - Human-AI teaming strategy (human-in-loop, human-on-loop, human-out-of-loop models)
  - AI-specific security threats and controls (adversarial examples, data poisoning, model extraction, model inversion, backdoors, drift)
  - Supplier assurance for third-party AI components
  - Continuous monitoring and re-assessment plan (drift detection, retraining triggers, annual review)
  - Comprehensive compliance matrix (27 JSP 936 requirements)
  - Output: `.arckit/jsp-936/jsp-936-assessment.md`

- **docs/guides/jsp-936.md**: Comprehensive 1,000+ line user guide
  - JSP 936 framework overview (5 principles, 5 risk levels, 8 lifecycle phases, governance)
  - When to run JSP 936 assessment (Discovery/Alpha/Beta/Live phases)
  - AI component types identified (7 categories: ML models, AI algorithms, autonomous systems, decision support, NLP, computer vision, generative AI)
  - Ethical risk assessment methodology (likelihood × impact matrix)
  - Five ethical principles deep dive (requirements, assessment approach)
  - Human-AI teaming models explained (HIL/HOL/HOOL with examples)
  - AI-specific security threats (6 categories with mitigations)
  - Continuous monitoring and re-assessment requirements
  - Approval pathways for each risk classification
  - Integration with other ArcKit commands
  - Common JSP 936 patterns (image classification, decision support, autonomous vehicles, LLMs)
  - JSP 936 compliance checklist
  - FAQs (mandatory assessment, timelines, roles, COTS AI, JSP 440 relationship, risk escalation, monitoring, human control)
  - Example scenarios (satellite imagery analysis, predictive maintenance, autonomous drone)
  - Additional resources (MOD references, UK Government AI guidance, international standards)

- **`.arckit/templates/jsp-936-template.md`**: Complete JSP 936 assessment template
  - Executive summary structure
  - AI system inventory with detailed component cataloging
  - Ethical risk assessment matrices for each AI component
  - Five ethical principles compliance sections
  - Eight AI lifecycle phase documentation structures
  - Governance and approval tracking
  - Human-AI teaming strategy documentation
  - Secure by Design evidence structure
  - Supplier assurance section
  - Continuous monitoring plan
  - JSP 936 compliance matrix (27 requirements)
  - 10 appendices (risk methodology, checklists, model cards, bias reports, V&V reports, security tests, training materials, dashboards)

### Changed

- **Command count**: 27 → 28 commands
- **README.md**:
  - Added `/arckit.jsp-936` to Security Assessment commands table
  - Added JSP 936 information to MOD Projects section
  - Added JSP 936 example usage
  - Added MOD JSP 936 AI Assurance to Built-in UK Government Support list
- **docs/index.html**: To be updated with JSP 936 command (28 commands)
- **Version**: Updated from v0.6.0 to v0.7.0

### Why This Matters

JSP 936 (Dependable Artificial Intelligence in Defence), published November 2024, establishes the UK Ministry of Defence's mandatory framework for safe and responsible adoption of AI/ML systems. Defence projects using AI must complete JSP 936 assessments to receive approval at the appropriate level (2PUS/Ministerial for Critical, Defence-Level for Severe/Major, TLB-Level for Moderate/Minor).

Without JSP 936 compliance, defence AI projects face:

- Approval blockages (no deployment without JSP 936 assessment)
- Ethical risks unidentified until late stages
- Unclear accountability for AI decisions
- Inadequate bias testing and harm mitigation
- Missing security controls for AI-specific threats
- No continuous monitoring or drift detection

The `/arckit.jsp-936` command automates the creation of comprehensive JSP 936 compliance documentation, guiding project teams through:

- Systematic identification of all AI/ML components
- Ethical risk classification using MOD's likelihood × impact methodology
- Assessment against all 5 ethical principles (Human-Centricity, Responsibility, Understanding, Bias & Harm Mitigation, Reliability)
- Documentation for all 8 AI lifecycle phases
- Human-AI teaming strategy design
- AI-specific security threat assessment
- Continuous monitoring and re-assessment planning

This command ensures MOD AI projects have the documentation required for approval while embedding best practices for responsible AI throughout the lifecycle.

## [0.6.0] - 2025-10-30

### Added

- **`/arckit.backlog` command**: Product backlog generation from ArcKit artifacts
  - Automatically converts requirements to GDS-format user stories ("As a... I want... So that...")
  - Multi-factor prioritization (MoSCoW + risk + value + dependencies)
  - Groups stories into epics (from Business Requirements)
  - Generates technical tasks from NFRs and infrastructure needs
  - Creates sprint plan with capacity balancing (60% features, 20% technical, 15% testing, 5% buffer)
  - Respects dependencies (auth before features, database before operations)
  - Maintains traceability matrix (requirements → stories → sprints)
  - Exports to multiple formats: markdown, CSV (Jira/Azure DevOps), JSON (API integration)
  - Time savings: 75%+ reduction (4-6 weeks manual → 3-5 days)
  - Output: `projects/{project-dir}/backlog.md` (+ optional CSV/JSON)

- **docs/guides/backlog.md**: Comprehensive 700+ line guide
  - GDS user story format and best practices
  - Multi-factor prioritization explained (algorithms and examples)
  - Sprint planning and capacity allocation strategies
  - Velocity calibration and story point estimation
  - Backlog management best practices (refinement schedule, DoD)
  - Real-world example (NHS Appointment Booking with 8 sprints)
  - Dependency management and risk-based prioritization
  - Tool integration (Jira, Azure DevOps, GitHub Projects)
  - Common issues and solutions
  - FAQs and tips for success

- **arckit-backlog-command-design.md**: 15,000+ word design specification
  - Research findings from GDS Service Manual on user stories and backlog management
  - Conversion algorithms (FR→Story, NFR→Task, BR→Epic)
  - Multi-factor prioritization algorithm (weighted scoring)
  - Sprint planning algorithm with dependency checking
  - Story point estimation guidelines (Fibonacci 1-13)
  - Template structures and output formats
  - Integration with other ArcKit commands
  - Success criteria and future enhancements

- **`.arckit/templates/backlog-template.md`**: Complete backlog template
  - Executive summary structure
  - Epic breakdown format
  - User story template (GDS format)
  - Sprint plan structure
  - Appendices (traceability, dependencies, DoD)

### Changed

- **Command count**: 26 → 27 commands
- **README.md**: Added `/arckit.backlog` as Phase 10 (Sprint Planning), renumbered subsequent phases
- **docs/index.html**: To be updated with backlog command in phase sections
- **Version**: Updated from v0.5.0 to v0.6.0 across all files

### Why This Matters

Product backlog creation is one of the most time-consuming tasks when transitioning from design (Alpha) to implementation (Beta). Teams spend 4-6 weeks manually converting requirements into user stories, estimating effort, prioritising work, and organising into sprints. This command automates that process in minutes, saving 75%+ of the time while maintaining GDS compliance and best practices.

The backlog command bridges the gap between ArcKit's design phase commands (`/arckit.requirements`, `/arckit.hld`) and implementation, providing a sprint-ready backlog that development teams can immediately use for sprint planning.

## [0.5.0] - 2025-10-30

### Added

- **`/arckit.service-assessment` command**: GDS Service Standard assessment preparation
  - Analyzes evidence against all 14 Service Standard points
  - Generates RAG (Red/Amber/Green) ratings per point and overall readiness score
  - Provides phase-appropriate gap analysis (alpha/beta/live)
  - Creates actionable recommendations with priorities (Critical/High/Medium) and timelines
  - Includes comprehensive assessment day preparation guidance
  - Maps all ArcKit artifacts to Service Standard evidence requirements
  - Output: `projects/{project-dir}/service-assessment-{phase}-prep.md`

- **docs/guides/service-assessment.md**: Comprehensive 600+ line guide
  - GDS Service Standard overview (14 points explained)
  - Assessment process and timings (alpha/beta/live)
  - Phase-appropriate evidence requirements
  - Complete workflow (Week 0 to assessment day)
  - Real-world examples (NHS Appointment Booking alpha prep)
  - Common pitfalls and how ArcKit helps
  - Integration with other ArcKit commands
  - Tips for success and assessment day guidance

- **gds-service-assessment-command-design.md**: 800+ line design specification
  - Research findings from actual GDS assessment reports
  - Design rationale and decision log
  - Evidence discovery algorithm
  - Phase-specific evidence matrices (alpha/beta/live)
  - Recommendation generation approach
  - Success criteria and future enhancements

### Changed

- **Command count**: 25 → 26 commands
- **README.md**: Added service-assessment to Phase 13 (UK Government Compliance)
- **docs/index.html**: Added new "UK Government Compliance" section with service-assessment command
- **Version**: Updated from v0.4.1 to v0.5.0 across all files

### Deployment

Deployed to 6 test repositories:

- arckit-test-project-v1-m365
- arckit-test-project-v2-hmrc-chatbot
- arckit-test-project-v3-windows11
- arckit-test-project-v6-patent-system
- arckit-test-project-v7-nhs-appointment
- arckit-test-project-v8-cabinet-office-genai (new)

## [0.4.1] - 2025-10-29

### Added

- **CONTRIBUTING.md**: Comprehensive contribution guide (241 lines)
  - Getting started workflow (fork, clone, branch)
  - Types of contributions (bugs, features, docs, commands, code)
  - Command structure and standards
  - Documentation style guidelines (UK English, GOV.UK principles)
  - Commit message conventions (conventional commits)
  - Pull request process
  - Testing guidelines
  - UK Government standards compliance requirements
  - Command naming conventions
  - Code of conduct

### Changed

- **docs/index.html**: Complete redesign using GOV.UK Design System v5.13.0
  - Professional, accessible, mobile-responsive design
  - Official GDS components: phase banner, buttons, tags, typography, grid
  - Reduced file size 45% (978 → 542 lines)
  - CDN-hosted GOV.UK Frontend assets
  - WCAG 2.1 AA accessibility compliance
  - Progressive enhancement with js-enabled detection

- **Documentation Expansion** (+1,336 lines across 4 guides):
  - **docs/guides/analyze.md**: 535 → 876 lines (+341)
    - Added "Integration with Other Requirements" section (145 lines)
    - Added "Common Gaps and How to Fix Them" section (8 gaps, 192 lines)
  - **docs/guides/diagram.md**: 525 → 857 lines (+332)
    - Added "Integration with Other Requirements" section (139 lines)
    - Added "Common Gaps and How to Fix Them" section (8 gaps, 208 lines)
  - **docs/guides/traceability.md**: 639 → 808 lines (+169)
    - Added "Integration with Other Requirements" section (163 lines)
  - **docs/guides/wardley-mapping.md**: 112 → 606 lines (+494)
    - Added "Integration with Other Requirements" section (168 lines)
    - Added "Common Gaps and How to Fix Them" section (8 gaps, 323 lines)

- **scripts/converter.py**: Moved from root to scripts/ directory
  - Better organization alongside other tools
  - Updated all references in documentation
  - Added comprehensive section to scripts/README.md

- **scripts/bash/create-project.sh**: Removed empty file creation
  - Commands use Write tool to create files with content
  - Empty touch commands removed (requirements.md, sow.md, etc.)
  - Enhanced project README template with complete GDS workflow

### Fixed

- **Font Licensing Compliance**: GDS Transport font override for non-gov.uk domains
  - GDS Transport licensed only for *.gov.uk,*.service.gov.uk, *.blog.gov.uk
  - Added explicit system font override: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial
  - Complies with GDS typography guidelines for non-government services
  - Transparent footer note explaining font choice
  - Reference: https://design-system.service.gov.uk/styles/typeface/

- **Broken Links**: Created missing CONTRIBUTING.md (was returning 404)

### Removed

- **SETUP.md**: Deleted outdated development artifact (329 lines)
  - Referenced only 8 templates (now 25 commands)
  - Had TODOs for already-implemented commands
  - Superseded by README.md, .claude/COMMANDS.md, .codex/README.md

- **docs/index.html from test repositories**: Removed from all 8 test projects
  - Website hosting only needed in main arc-kit repository
  - Test projects are for testing commands, not hosting website

- **arckit.digital-marketplace command**: Deprecated command fully removed
  - Replaced by focused commands: `/arckit.dos` and `/arckit.gcloud-search`
  - Removed from Claude, Codex, and Gemini command sets
  - Total commands reduced from 26 to 25

## [0.4.0] - 2025-10-28

### Added

- **`/arckit.plan`**: Comprehensive project planning command
  - Generates project plans with GDS Agile Delivery phases (Discovery → Alpha → Beta → Live)
  - Mermaid Gantt charts with timeline visualization
  - Workflow diagrams showing decision gates
  - Phase-by-phase activity tables with ArcKit command recommendations
  - Approval criteria for each phase
  - Risk mitigation strategies
  - Resource allocation planning
  - Success metrics and KPIs
  - Comprehensive 660-line planning guide

### Changed

- **Documentation Guides**: Expanded procurement and design-review guides
  - **docs/guides/procurement.md**: Enhanced with detailed DOS and G-Cloud workflows
  - **docs/guides/design-review.md**: Added comprehensive 10-section assessment checklist

- **Multi-AI Deployment**: Plan command deployed to all three AI systems
  - `.claude/prompts/arckit.plan.md` - Claude Code version
  - `.codex/prompts/arckit.plan.md` - Codex CLI version
  - `.gemini/commands/arckit/plan.toml` - Gemini CLI version

- **Workflow Enhancement**: Added Phase 0 (Planning) to GDS Agile Delivery framework
  - Updated all documentation to show: Phase 0 → Discovery → Alpha → Beta → Live
  - Planning phase runs before Discovery to establish project foundation

### Fixed

- **Version Consistency**: Synchronized all version references to v0.4.0
  - VERSION file: Updated to 0.4.0
  - pyproject.toml: version = "0.4.0"
  - README.md: Latest Release links
  - docs/README.md: ArcKit Version
  - .codex/README.md: version and What's New

## [0.3.6] - 2025-10-27

### Added

- **Gemini CLI Support**: Full support for Google Gemini CLI across all commands
  - Added `scripts/converter.py` to convert Claude markdown commands to Gemini TOML format
  - All 24 commands now available for Gemini CLI (`.gemini/commands/arckit/*.toml`)
  - Automatic conversion maintains command functionality and arguments
  - Complete parity: Claude, Codex, and Gemini now have identical command sets
  - Credit: @umag (PR #5)

- **Digital Marketplace Command Split**: Split monolithic command into three focused commands
  - **`/arckit.dos`** - Digital Outcomes and Specialists (custom development)
    - ~400 lines (focused, clean - down from 754 lines)
    - Covers 95% of arc-kit use cases
    - Essential vs desirable skills extraction
    - Evaluation framework (40% Technical, 30% Team, 20% Quality, 10% Value)
    - Technology-agnostic success criteria
    - No branching logic (DOS only)
  - **`/arckit.gcloud-search`** - G-Cloud with Live Marketplace Search
    - ~500 lines with WebSearch integration
    - **Live Digital Marketplace search** using WebSearch
    - Searches: `site:digitalmarketplace.service.gov.uk g-cloud [keywords]`
    - Finds actual services with suppliers, prices, features, links
    - Service comparison table (top 3-5 services)
    - Recommendations based on requirements match
    - Covers 5% of use cases (cloud services only)
  - **`/arckit.gcloud-clarify`** - G-Cloud Service Validation (NEW!)
    - **Bridge between search and evaluation** - validates services before supplier engagement
    - Systematic gap analysis (MUST/SHOULD requirements vs service descriptions)
    - Detects three gap types: ✅ Confirmed, ⚠️ Ambiguous, ❌ Not mentioned
    - Generates prioritised questions (🔴 Critical / 🟠 High / 🔵 Medium / 🟢 Low)
    - Risk assessment matrix for each service
    - Email templates for supplier engagement
    - Evidence requirements specification
    - Completes the G-Cloud workflow: Search → Clarify → Evaluate

### Changed

- **Command Count**: Now 25 commands per AI assistant (22 original + 3 new G-Cloud commands)
- **README**: Updated to reflect new DOS, G-Cloud search, and G-Cloud clarify commands
- **Complete G-Cloud Workflow**: Requirements → Search → Clarify → Engage → Evaluate → Award

### Benefits

- **Clearer Purpose**: No framework confusion (DOS vs G-Cloud)
- **More Powerful**: G-Cloud search finds actual services, not just requirements
- **Complete Validation**: Gap analysis identifies missing/ambiguous requirements before supplier engagement
- **Risk Mitigation**: Identifies blockers BEFORE contacting suppliers
- **Better UX**: Users know which command to use at each workflow stage
- **Easier Maintenance**: Smaller, focused templates (400-500 lines vs 754)
- **Time Savings**:
  - G-Cloud search: 30+ minutes of manual marketplace searching automated
  - G-Cloud clarify: 30-60 minutes of manual gap analysis automated
  - Total: 1-2 hours saved per procurement
- **Structured Process**: End-to-end G-Cloud workflow from discovery to contract award

## [0.3.5] - 2025-10-26

### Added

- **Codex CLI Integration**: Full support for OpenAI Codex CLI in `arckit init`
  - Added `codex` to AGENT_CONFIG with proper installation URL
  - Automatic `.envrc` generation for Codex projects with `CODEX_HOME` environment variable
  - Auto-creates `.gitignore` entries to exclude auth tokens while preserving prompts
  - Copies slash commands to `.codex/prompts/` directory
  - Added Codex to interactive AI assistant selection menu
  - Enhanced next steps output with Codex-specific setup instructions (direnv recommended)
- Added `.envrc` and updated `.gitignore` for main arc-kit repository

### Changed

- Updated `arckit init` help text to include `codex` as supported AI assistant option
- Commands are now copied for both Claude and Codex (previously Claude-only)

## [0.3.4] - 2025-10-23

### Fixed

- **Critical Installation Bug**: Fixed package distribution to properly include markdown files
  - Added `[tool.hatch.build.targets.wheel.shared-data]` configuration to pyproject.toml
  - Templates, scripts, and .claude commands now correctly packaged in wheel
  - Enhanced `get_data_paths()` function to locate installed package data:
    - Supports uv tool installs (`~/.local/share/uv/tools/arckit-cli/share/arckit/`)
    - Supports pip installs (site-packages)
    - Supports platformdirs locations
    - Fallback to source directory for development mode
  - Added debug output showing resolved data paths during `arckit init`
  - Added warning messages if templates/scripts/commands not found
  - Fixed: `arckit init` now works correctly when installed via pip or uv
  - Credit: @umag (PR #3)

### Added

- **UI Implementation Plan**: Comprehensive plan for building a web-based user interface
  - Next.js 14 + FastAPI architecture for hybrid CLI/UI approach
  - Interactive dashboard with project visualization and status tracking
  - Requirements management interface with filtering, sorting, and graph views
  - Traceability matrix visualization (interactive graph + table views)
  - Diagram viewers for Mermaid diagrams and Wardley Maps
  - Vendor comparison dashboard with side-by-side evaluation
  - AI assistant chat integration for executing slash commands from UI
  - Real-time sync between CLI and UI using file watchers and WebSockets
  - 5-phase implementation roadmap (12-16 weeks)
  - Multiple deployment options: local web server, desktop app (Electron), cloud
  - Maintains markdown files as source of truth (no database lock-in)
  - Full technical specifications, API design, and risk assessment

### Documentation

- Added `UI-IMPLEMENTATION-PLAN.md` with complete architecture and implementation strategy
- Detailed backend API specifications with FastAPI endpoints
- Frontend component structure and technology stack recommendations
- Data flow diagrams showing CLI-to-UI synchronization
- Risk assessment and mitigation strategies
- Budget and resource requirements
- Success metrics and KPIs

## [0.3.2] - 2025-10-21

### Changed

- **BREAKING CHANGE: MOD Secure by Design - RMADS Removed**:
  - `/arckit.mod-secure` updated to align with current MOD framework (August 2023)
  - RMADS (Risk Management and Accreditation Documentation Set) REMOVED
  - Point-in-time accreditation process REPLACED with continuous assurance
  - **CAAT** (Cyber Activity and Assurance Tracker): Self-assessment tool now mandatory
    - All programmes must register on CAAT in Discovery/Alpha
    - Based on 7 SbD Principles question sets
    - Continuously updated throughout lifecycle (not one-time submission)
    - Available through MOD Secure by Design portal (DefenceGateway account)
  - **New Roles**:
    - Delivery Team Security Lead (DTSL): Owns security (First Line of Defence)
    - Security Assurance Coordinator (SAC): Supports DTSL
    - IAO/IAA roles replaced/redefined
  - **Terminology Changes**:
    - "Accreditation" → "Continuous assurance"
    - "Accreditation blockers" → "Deployment blockers"
    - "RMADS documentation submitted" → "CAAT self-assessment completed"
    - "Accreditation approval" → "Security governance review"
  - Supplier attestation required for vendor-delivered systems (ISN 2023/10)
  - SROs and capability owners accountable (not delegated to accreditation authority)
  - Cyber security is a "licence to operate" - cannot be traded out

- **Enhanced Analysis Command**:
  - `/arckit.analyze` updated to analyze all artifacts from v0.2.1-v0.3.1
  - **New Detection Passes**:
    - **E. Stakeholder Traceability Analysis** (if stakeholder-drivers.md exists):
      - Requirements traced to stakeholder goals
      - Orphan requirements (not linked to stakeholder goals)
      - Requirement conflicts documented and resolved
      - RACI governance alignment (risk owners, data owners from RACI)
    - **F. Risk Management Analysis** (if risk-register.md exists):
      - High/Very High risks have mitigation in requirements/design
      - Risk owners aligned with RACI matrix
      - Risk-SOBC alignment (strategic risks, financial risks in Economic Case)
      - Risk-requirements alignment (mitigation actions to requirements)
    - **G. Business Case Alignment** (if sobc.md exists):
      - Benefits traced to stakeholder goals and requirements
      - Benefits measurable and verifiable
      - Option analysis quality (Do Nothing baseline, build vs buy)
      - SOBC-requirements alignment (drivers, benefits, budget, delivery)
      - SOBC-risk alignment (risks in Management Case Part E)
    - **H. Data Model Consistency** (if data-model.md exists):
      - DR-xxx requirements mapped to entities
      - Data model-design alignment (schemas match entities, CRUD aligns)
      - Data governance alignment (owners from RACI, PII identified, GDPR)
      - Data model quality (ERD renderable, complete specs, relationships)
    - **J. MOD Secure by Design Compliance** (if mod-secure-by-design.md exists):
      - 7 SbD Principles assessment
      - NIST CSF coverage (Identify, Protect, Detect, Respond, Recover)
      - CAAT continuous assurance process (registration, self-assessment)
      - Three Lines of Defence implementation
      - Supplier attestation (ISN 2023/10)
      - Classification-specific requirements
  - **Enhanced Report Structure**:
    - Stakeholder Traceability Analysis section
    - Risk Management Analysis section
    - Business Case Analysis section
    - Data Model Analysis section
    - MOD Secure by Design Analysis section (separate from UK Gov TCoP)
  - **New Severity Criteria**:
    - CRITICAL: Orphan requirements, high/very high risks unmitigated, benefits not traced, DR-xxx unmapped, PII not identified, CAAT not registered
    - HIGH: Conflicts unresolved, medium risks unmitigated, benefits not measurable, schema mismatch, SbD gaps
    - MEDIUM: Missing stakeholder/risk/SOBC/data-model artifacts (recommended)
  - **Updated Metrics Dashboard**:
    - Stakeholder traceability score
    - Risk management score
    - Business case score
    - Data model score
    - MOD SbD score (separate from UK Gov compliance)

### Documentation

- Updated MOD Secure by Design command documentation with:
  - CAAT continuous assurance process
  - ISN 2023/09 and ISN 2023/10 references
  - JSP 453 Digital Policies
  - https://www.digital.mod.uk/policy-rules-standards-and-guidance/secure-by-design
- Updated analysis command documentation with new detection passes and report sections
- Deployed to all 7 test repositories

### Resources

- MOD Secure by Design portal: https://www.digital.mod.uk/policy-rules-standards-and-guidance/secure-by-design
- Launched 28 July 2023, mandatory from August 2023
- Replaces point-in-time accreditation with continual assurance

## [0.3.1] - 2025-10-21

### Added

- **Data Modeling Command**: `/arckit.data-model` for comprehensive data modeling with ERD, GDPR compliance, and data governance
  - Visual Entity-Relationship Diagram (ERD) using Mermaid syntax
  - Detailed entity catalog (E-001, E-002, etc.) with attributes, types, validation rules
  - PII identification and GDPR/DPA 2018 compliance (retention, erasure, subject access rights)
  - Data governance matrix (business owners from stakeholder RACI, stewards, custodians)
  - CRUD matrix showing which components Create/Read/Update/Delete each entity
  - Data integration mapping (upstream sources, downstream consumers)
  - Sector-specific compliance (PCI-DSS for payments, HIPAA for health, FCA for finance, Government classifications)
  - Data quality framework with measurable metrics (accuracy, completeness, consistency, timeliness, uniqueness)
  - Complete traceability: DR-xxx requirements → Entities → Attributes → Stakeholders
- `templates/data-model-template.md` (720 lines) - Comprehensive data modeling template
- `.claude/commands/arckit.data-model.md` - Data modeling command specification
- `.codex/prompts/arckit.data-model.md` - Data modeling command for OpenAI Codex CLI

### Changed

- **WORKFLOW UPDATE**: Data modeling now positioned after requirements, before vendor selection
  - Old workflow: Requirements → SOW → Vendor selection
  - New workflow: Requirements → **Data Model** → SOW → Vendor selection
- Total command count increased from 19 to 20

### Documentation

- Updated `README.md`:
  - Added Phase 5.5: Data Modeling
  - Updated feature list to include data modeling, risk management, and SOBC
  - Added data-model to Core Commands table
  - Updated payment gateway example workflow to include data modeling step
  - Updated project structure to include data-model.md
  - Renumbered subsequent phases (6→7, 7→8, 8→9, 9→10)
- Updated `.claude/COMMANDS.md`:
  - Added section 6 for `/arckit.data-model`
  - Renumbered subsequent sections (6→7, 7→8, 8→9, 9→10, 10→11)
  - Updated workflow overview and best practices
  - Updated common patterns to include data modeling
- Updated `.codex/README.md`:
  - Added Phase 5.5: Data Model
  - Updated to v0.3.1 with 20 commands
  - Updated file structure to show data-model files
- Deployed to all 7 test repositories

### Integration

- Data model integrates with:
  - **Input**: Requires `requirements.md` (extracts DR-xxx Data Requirements)
  - **Input**: Uses `stakeholder-drivers.md` (for data ownership RACI matrix)
  - **Input**: References `sobc.md` (for data-related costs and benefits)
  - **Output**: Feeds into `/arckit.hld-review` (validates database technology choices)
  - **Output**: Feeds into `/arckit.dld-review` (validates schema design, indexes, query patterns)
  - **Output**: Supports `/arckit.traceability` (DR-xxx → Entity → Attribute → HLD Component)

## [0.3.0] - 2025-10-21

### Added

- **Strategic Outline Business Case (SOBC) Command**: `/arckit.sobc` implementing HM Treasury Green Book 5-case model
  - Strategic Case: Problem, drivers, stakeholder goals, scope
  - Economic Case: Options analysis (Do Nothing, Minimal, Balanced, Comprehensive), benefits mapping, NPV, ROI
  - Commercial Case: Procurement strategy, Digital Marketplace routes (UK Gov)
  - Financial Case: Budget, TCO, affordability, Value for Money
  - Management Case: Governance, delivery, change management, benefits realization, risk management
- **Risk Management Command**: `/arckit.risk` implementing HM Treasury Orange Book 2023 framework
  - Part I: 5 Risk Management Principles (Governance, Integration, Collaboration, Risk Processes, Continual Improvement)
  - Part II: Risk Control Framework (4-pillar structure)
  - 6 risk categories: Strategic, Operational, Financial, Compliance, Reputational, Technology
  - 4Ts response framework: Tolerate, Treat, Transfer, Terminate
  - 5×5 risk matrix: Inherent vs Residual risk (Likelihood × Impact)
  - Complete stakeholder integration (risk owners from RACI matrix)
  - Risk appetite compliance monitoring
- `templates/sobc-template.md` (1,012 lines) - Comprehensive Green Book 5-case business case template
- `templates/risk-register-template.md` (900 lines) - Comprehensive Orange Book risk register template
- `.codex/prompts/arckit.sobc.md` - SOBC command for OpenAI Codex CLI
- `.codex/prompts/arckit.risk.md` - Risk command for OpenAI Codex CLI

### Changed

- **CRITICAL WORKFLOW CHANGE**: Risk assessment and business case now come BEFORE requirements
  - Old workflow: Principles → Stakeholders → Requirements
  - New workflow: Principles → Stakeholders → **Risk** → **SOBC** → Requirements
- Updated `/arckit.requirements` to reference SOBC approval as prerequisite
- Enhanced SOBC to use risk register for:
  - Strategic Case urgency ("Why Now?" uses strategic risks)
  - Economic Case risk-adjusted costs (optimism bias from risk scores)
  - Management Case Part E (full risk register included)
  - Recommendation (high-risk profile influences option selection)
- Total command count increased from 17 to 19

### Documentation

- Updated `README.md`:
  - Added Phase 3: Risk Assessment
  - Added Phase 4: Business Case Justification (SOBC)
  - Renumbered all subsequent phases
  - Added risk and SOBC to Core Commands table
  - Updated payment gateway example workflow
  - Updated project structure to include risk-register.md and sobc.md
- Updated `.claude/COMMANDS.md`:
  - Added section 3: Risk Management (Orange Book) - 220+ lines
  - Added section 4: Strategic Outline Business Case (SOBC)
  - Renumbered all subsequent sections (requirements=5, sow=6, evaluate=7, hld=8, dld=9, traceability=10)
  - Updated workflow overview
  - Updated Best Practices to include risk and SOBC
  - Updated Common Patterns examples
  - Updated file structure reference
- Updated `.codex/README.md`:
  - Added Phase 3: Risk Assessment (NEW - v0.3.0)
  - Added Phase 4: Business Case (updated from v0.2.3)
  - Renumbered subsequent phases
  - Added Orange Book and Green Book framework overviews
  - Documented SOBC-risk integration
- Deployed to all 7 test repositories:
  - arckit-test-project-v0-mod-chatbot
  - arckit-test-project-v1-m365
  - arckit-test-project-v2-hmrc-chatbot
  - arckit-test-project-v3-windows11
  - arckit-test-project-v4
  - arckit-test-project-v5
  - arckit-test-project-v6-patent-system

### UK Government Compliance

- **Green Book Compliance**: Full 5-case business case model for investment appraisal
  - Options analysis with do-nothing baseline
  - Benefits mapping to stakeholder goals
  - Digital Marketplace procurement routes
  - Social value (minimum 10% weighting)
  - Green Book discount rates (3.5% standard)
  - Optimism bias adjustment from risk assessment
  - Whole-life costs (3-year TCO)
- **Orange Book Compliance**: Comprehensive risk management framework
  - Systematic risk identification (6 categories)
  - Inherent vs Residual risk assessment
  - 4Ts response framework (Tolerate, Treat, Transfer, Terminate)
  - Risk appetite and tolerance monitoring
  - Risk ownership from stakeholder RACI matrix
  - Continual improvement and monitoring framework
- UK-specific risks included:
  - Strategic: Policy/ministerial changes, machinery of government, parliamentary scrutiny
  - Compliance: HMT spending controls, NAO audits, PAC scrutiny, FOI, judicial review
  - Reputational: Media scrutiny, citizen complaints, select committees
  - Operational: GDS Service Assessment, CDDO controls, security clearances

### Integration

- Complete traceability chain: Stakeholder → Driver → Goal → Risk → Benefit → Requirement
- Risk register feeds into SOBC Management Case Part E
- Financial risks inform Economic Case cost contingency (optimism bias)
- Strategic risks demonstrate urgency in Strategic Case
- Stakeholder RACI matrix provides risk owners
- Risk appetite compliance enables go/no-go decisions

### Bug Fixes

- Fixed command ordering in `.claude/COMMANDS.md` (stakeholders correctly positioned before risk/SOBC)
- Improved documentation commit messages for clarity
- Corrected workflow documentation alignment across all files

## [0.2.2] - 2025-10-20

### Added

- **OpenAI Codex CLI Support**: Complete `.codex/` folder structure with 17 prompts for OpenAI Codex CLI users
- `.codex/README.md` - Comprehensive 400+ line setup guide for Codex CLI
- `OPENAI-INTEGRATION-PLAN.md` - Integration strategy document comparing Codex CLI to alternative approaches
- Codex CLI support deployed to all 7 test repositories
- All ArcKit commands now available with `/prompts:arckit.*` format for Codex CLI users

### Changed

- Updated `README.md` to list OpenAI Codex CLI as supported AI agent
- Updated `.codex/README.md` version to v0.2.2
- Added Codex CLI usage examples throughout documentation
- Supported AI agents increased from 4 to 5 (added Codex CLI)

### Documentation

- Updated version references throughout documentation

## [0.2.1] - 2025-10-19

### Added

- **Stakeholder Analysis Command**: `/arckit.stakeholders` for comprehensive stakeholder driver analysis
- `templates/stakeholder-drivers-template.md` (400+ lines) - Stakeholder analysis template with:
  - Power-Interest Grid for stakeholder identification
  - 7 types of drivers (STRATEGIC, OPERATIONAL, FINANCIAL, COMPLIANCE, PERSONAL, RISK, CUSTOMER)
  - Driver → Goal → Outcome traceability mapping
  - Conflict analysis and resolution framework
  - RACI matrix for governance
  - Engagement plan templates
- **Conflict Resolution Framework** in requirements workflow:
  - Systematic identification of conflicting requirements
  - Trade-off analysis tables
  - 4 resolution strategies (PRIORITIZE, COMPROMISE, PHASE, INNOVATE)
  - Stakeholder management documentation (who won/lost)
  - Decision authority tracking

### Changed

- **CRITICAL WORKFLOW CHANGE**: Stakeholder analysis now comes **BEFORE** requirements
  - Old workflow: Principles → Requirements → Design
  - New workflow: Principles → **Stakeholders** → Requirements → Design
- Enhanced `/arckit.requirements` command to:
  - Check for stakeholder analysis first (recommends `/arckit.stakeholders` if missing)
  - Trace requirements back to stakeholder goals
  - Identify requirement conflicts stemming from stakeholder conflicts
  - Document conflict resolutions with stakeholder impact
- Updated `templates/requirements-template.md` with:
  - "Requirement Conflicts & Resolutions" section
  - Stakeholder traceability references
  - 6 common conflict patterns with example resolutions

### Documentation

- Updated `README.md` workflow to show stakeholders before requirements
- Updated `.claude/COMMANDS.md` with stakeholder analysis step
- Updated all 7 test repositories with:
  - New `/arckit.stakeholders` command
  - Enhanced requirements template
  - Updated README files showing 17 total commands

## [0.2.0] - 2025-10-14

### Added

- **UK Government Compliance Support**: Comprehensive support for UK Government frameworks
- `/arckit.tcop` - Technology Code of Practice assessment (13 mandatory points)
- `/arckit.ai-playbook` - AI Playbook compliance assessment (10 principles + 6 ethical themes)
- `/arckit.atrs` - Algorithmic Transparency Recording Standard assessment
- `/arckit.mod-secure` - MOD Secure by Design review (JSP 440, IAMM)
- `templates/uk-gov-tcop-template.md` (718 lines) - TCoP assessment structure
- `templates/uk-gov-ai-playbook-template.md` (853 lines) - AI Playbook assessment structure
- `templates/uk-gov-atrs-template.md` - ATRS transparency documentation
- `templates/mod-secure-by-design-template.md` - MOD security review template

### Documentation (6,000+ lines added)

- `docs/principles.md` (527 lines) - Architecture Principles Guide
- `docs/requirements.md` (628 lines) - Requirements Guide
- `docs/procurement.md` (503 lines) - Vendor Procurement Guide
- `docs/design-review.md` (668 lines) - Design Review Guide
- `docs/traceability.md` (639 lines) - Traceability Guide
- `docs/uk-government-digital-marketplace.md` (684 lines) - Digital Marketplace Guide

### Changed

- Updated `README.md` with UK Government support section
- Added UK Government example workflows
- Updated supported commands from 7 to 14

## [0.1.0] - 2025-10-13

### Added

- Initial release of ArcKit
- `/arckit.principles` - Create architecture principles
- `/arckit.requirements` - Define comprehensive requirements
- `/arckit.wardley` - Create Wardley Maps for strategic planning
- `/arckit.diagram` - Generate architecture diagrams with Mermaid
- `/arckit.sow` - Generate Statement of Work for RFPs
- `/arckit.evaluate` - Create vendor evaluation frameworks
- `/arckit.hld-review` - Review High-Level Design
- `/arckit.dld-review` - Review Detailed Design
- `/arckit.secure` - UK Government Secure by Design review
- `/arckit.traceability` - Generate requirements traceability matrix
- `/arckit.analyze` - Analyze architecture complexity
- `/arckit.servicenow` - Export to ServiceNow CMDB

### Templates

- `templates/architecture-principles-template.md`
- `templates/requirements-template.md`
- `templates/wardley-map-template.md`
- `templates/architecture-diagram-template.md`
- `templates/sow-template.md`
- `templates/evaluation-criteria-template.md`
- `templates/vendor-scoring-template.md`
- `templates/hld-review-template.md`
- `templates/dld-review-template.md`
- `templates/ukgov-secure-by-design-template.md`
- `templates/traceability-matrix-template.md`

### CLI Tool

- `arckit init` command to bootstrap new projects
- Support for Claude Code, OpenAI Codex CLI, and Gemini CLI
- Bash and PowerShell script support

### Documentation

- Comprehensive README.md with examples
- Quick start guide
- Agent compatibility matrix

---

## Release Links

- [v1.3.0](https://github.com/tractorjuice/arc-kit/releases/tag/v1.3.0) - External Document Support & Dynamic Version Placeholders
- [v1.2.0](https://github.com/tractorjuice/arc-kit/releases/tag/v1.2.0) - Autonomous Agent System
- [v1.0.0](https://github.com/tractorjuice/arc-kit/releases/tag/v1.0.0) - Production Release - Enterprise Architecture Governance Toolkit
- [v0.3.1](https://github.com/tractorjuice/arc-kit/releases/tag/v0.3.1) - Data Modeling with ERD, GDPR Compliance, and Data Governance
- [v0.3.0](https://github.com/tractorjuice/arc-kit/releases/tag/v0.3.0) - Green Book & Orange Book Edition (SOBC + Risk Management)
- [v0.2.2](https://github.com/tractorjuice/arc-kit/releases/tag/v0.2.2) - OpenAI Codex CLI Support & Enhanced Stakeholder Analysis
- [v0.2.1](https://github.com/tractorjuice/arc-kit/releases/tag/v0.2.1) - Stakeholder Analysis & Conflict Resolution
- [v0.2.0](https://github.com/tractorjuice/arc-kit/releases/tag/v0.2.0) - UK Government Compliance Edition
- [v0.1.0](https://github.com/tractorjuice/arc-kit/releases/tag/v0.1.0) - Initial Release

---

## Version Numbering

ArcKit follows [Semantic Versioning](https://semver.org/):

- **MAJOR** version (X.0.0): Incompatible API changes or breaking workflow changes
- **MINOR** version (0.X.0): New features added in a backward-compatible manner
- **PATCH** version (0.0.X): Backward-compatible bug fixes and documentation updates

**Examples**:

- v0.1.0 → v0.2.0: Added UK Government support (new features)
- v0.2.0 → v0.2.1: Added stakeholder analysis (new feature)
- v0.2.1 → v0.2.2: Added Codex CLI support (new feature)
- v0.2.2 → v0.3.0: Added Green Book SOBC + Orange Book risk management (significant new features)
- v0.3.0 → v0.3.1: Added data modeling command (new feature)
- v0.x.x → v1.0.0: Production release with 40 commands, complete governance toolkit (major)
