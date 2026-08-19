# Changelog — ArcKit Plugin

All notable changes to the ArcKit Claude Code plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **The three cloud-research commands now run as three-tier reader/orchestrator/writer splits** (#466, item 1 remainder). `/arckit:aws-research`, `/arckit:azure-research` and `/arckit:gcp-research` complete the item: **every research agent in ArcKit is now split**, and `arckit-framework` is the only single-tier agent left, deliberately exempt as synthesis-only over artefacts already in the repository.

  **Three readers, one writer, one schema.** Each provider keeps its own reader, allowlisting only that provider's MCP server — an AWS reader must not be able to reach Microsoft Learn, and that is the whole point of the tier. They share `arckit-cloud-research-writer`, because a writer holds no network tools and there is nothing to isolate between providers; sharing it is what keeps the three artefacts structurally comparable, which is what makes them worth putting side by side in `/arckit:evaluate`.

  **The star ratings stop being decorative.** All three templates carry a pillar table:

  ```text
  | Pillar                 | Rating      | Notes |
  | Operational Excellence | ⭐⭐⭐⭐⭐ | ...   |
  | Security               | ⭐⭐⭐⭐⭐ | ...   |
  ```

  Nothing defined what earned a fifth star, so a reader could not tell a service that scored five because its documentation states customer-managed keys, private networking and audit logging from one that scored five because the model was feeling generous. In practice the tables trended to five across every pillar, which made them useless for the one job they had: comparing two services. `cloud-research-generic.yaml` derives all six pillars from documented capabilities, and the artefact renders the numeric score and the evidence behind each star. The six pillars are AWS Well-Architected's and map cleanly onto the Azure Well-Architected Framework and the Google Cloud Architecture Framework, which is why one rubric serves all three providers.

  **Region availability is a gate, not a score.** A service unavailable in a region the project requires cannot be traded off against a strong security posture, so it never enters the weighted total: it is excluded from the recommendation, rendered in the artefact with the reason, and cited. A row the reader never checked is recorded as a coverage gap rather than as unavailability — the distinction the AWS availability tool makes between `isNotAvailableIn` and `Not Found`, preserved through the schema's status enum.

- **`schemas/cloud-research-handoff.schema.json` and `cloud-research-{generic,uk-gov}.yaml`.** The schema has no pillar rating, star, rank or recommendation field, and `architecture_signals` is a 21-value allowlist of capabilities the provider's *documentation states* — the readers are explicitly forbidden from inferring `multi-az-supported` from a service being a managed database, because that shortcut would score every service identically and destroy the rubric. The UK-Gov variant lifts security 25→30 and sustainability 10→15 (Greening Government ICT makes carbon reporting an obligation, not a preference), and adds two gates for UK region availability and published UK assurance.

- **`tests/plugin/fixtures/cloud-research-handoff/` (3 valid + 6 reject) and `test_validate_cloud_research_handoff.mjs`, wired into `lint-markdown.yml`.** The rejects cover a reader emitting its own `well_architected` ratings and a `recommendation`, a fabricated off-allowlist `best-in-class-security` signal, an off-enum region status, and an unknown provider. One valid fixture is a **preview-lifecycle service with no SLA and no compliance evidence**, which must round-trip cleanly: it is the case the rubric most needs to score low rather than reject.

- **`/arckit:gov-landscape` now runs as a three-tier reader/orchestrator/writer split** (#466, item 1 remainder). This completes the govreposcrape family and leaves only the three cloud-research agents unsplit. The reader holds both govreposcrape MCP tools and `WebFetch`; the orchestrator holds neither; the writer holds the only `Write`.

  **The maturity score stops being an impression.** The single-tier agent assigned five 1-5 dimension scores by eye and averaged them into a Production-Grade / Mature / Developing / Experimental label. Those dimensions had no defined inputs — "Documentation (1=no docs, 5=comprehensive README, guides, API docs, architecture docs)" left the model to decide what *comprehensive* meant, differently on each run — so the resulting label carried an authority the underlying judgement did not support. `gov-landscape-generic.yaml` derives all five from extracted evidence, and the artefact renders the dimension values and the evidence behind them alongside the band. The 1-5 scale and the four band names are preserved so existing GLND artefacts remain comparable.

  The rubric deliberately produces **no overall maturity grade for the domain**. Averaging across repositories of wildly different purpose yields a number that reads as meaningful and is not; the artefact reports the median and the distribution instead.

  One asymmetry is load-bearing and documented in both tiers: a **missing** `has_tests` scores 40, an explicit **`false`** scores 10. The reader is instructed to omit the field rather than guess `false` when it could not see the repository's file listing, and the orchestrator must not coerce missing to false. Getting this wrong silently pushes repositories down a maturity band on no evidence.

- **`gov-repo-handoff.schema.json` gains an `advisories[]` array**, so the shared schema now serves both govreposcrape commands rather than a second one being authored. `advisory_id` is pattern-constrained to real CVE, GHSA or OSV identifier forms: the pattern is the allowlist, so a reader cannot report an advisory it invented a name for. Severity is an enum, counts are bounded integers, and there is no field for remediation advice or exploitability.

  **Absence of data is not absence of vulnerabilities.** Where `vulnerability_exposure` returns nothing for a scope, that scope has *unknown* exposure. The reader records an explicit error, the orchestrator carries `scopes_with_no_data` through to the writer, and the writer must render those scopes under a heading saying exposure is unknown rather than omitting the section — an omitted supply-chain section reads as a clean result.

- **Four more fixtures on the shared `gov-repo-handoff` suite** (now 3 valid + 10 reject), covering an organisation bucket with advisories, a fabricated advisory identifier, an off-enum severity, and a reader emitting its own `maturity_band` and `maturity_score_5`.

- **`/arckit:gov-code-search` now runs as a three-tier reader/orchestrator/writer split** (#466, item 1 remainder). `arckit-gov-code-search-reader` (govreposcrape MCP + `WebFetch`, no `Write`/`Edit`/`Bash`/`Agent`) searches one query variation; the orchestrator is the slash-command body and touches neither the MCP nor the web; `arckit-gov-code-search-writer` (`Read`, `Glob`, `Write`, `Edit`) holds the only `Write` tool. Anyone can open a public repository, and a README is a document an attacker controls end to end, so this boundary matters even though the index itself is trusted.

  **The relevance grade stops being an opinion.** The single-tier agent classified results as "High relevance" or "Medium relevance" by eye, which meant the same query could rank the same repository differently on two runs with nothing recording why. `gov-code-search-generic.yaml` computes it from six weighted criteria, the largest being `query_corroboration` — how many distinct query variations surfaced the repository. That signal only exists because the orchestrator sees every variation at once; no reader can compute it, and the old agent never tried. Every artefact now shows the per-criterion breakdown that produced the band.

- **`schemas/gov-repo-handoff.schema.json`**, deliberately shared rather than per-command. It carries a `bucket_type` of `query-variation`, `organisation` or `technology-facet`, so `/arckit:gov-landscape` can reuse it with `bucket_type: organisation` instead of a third govreposcrape schema being authored. Its `language`, `framework_hints` and `licence` enums are kept identical to `gov-reuse-handoff.schema.json` so the two agree on how a repository is described. It has no relevance, score or rank field, and `match_rank` is defined as the index's own answer that the reader must not reorder.

- **`tests/plugin/fixtures/gov-repo-handoff/` (2 valid + 7 reject) and `test_validate_gov_repo_handoff.mjs`, wired into `lint-markdown.yml`.** The rejects include a reader emitting its own `relevance_band`/`score`, a fabricated off-allowlist standards signal, and an HTML-comment instruction smuggled through `summary_one_liner` — that last one is caught by the `SafeText` pattern excluding angle brackets, not by length.

  One valid fixture is an **empty result set**. A search that finds nothing must round-trip cleanly, because the command's honest-reporting requirement depends on it: a thin or empty index result is evidence about index coverage, not a finding about what government has built, and the artefact now has to say so in the Executive Summary when fewer than ten distinct repositories are found.

- **A repository-level statement of what ArcKit does not do** (#466, items 9 and 21). Every community overlay already carried a "review by qualified DPO / CSO / federal counsel before reliance" banner. The officially-maintained baseline carried none, and it is the baseline that ships `/arckit:dpia`, `/arckit:secure`, `/arckit:mod-secure`, `/arckit:atrs`, `/arckit:jsp-936` and `/arckit:sobc`. A grep for disclaimer language across `README.md` and every `docs/*.md` returned nothing, so the unsupported overlays were better hedged than the supported core.

  `README.md` gains a `## What ArcKit does not do` section, placed immediately before the UK Government Compliance section so a reader meets the limits before the compliance claims. It enumerates them concretely rather than generically: a generated DPIA is not a completed DPIA, because UK GDPR Article 35 places the assessment on the controller and Article 36 requires ICO consultation where high residual risk remains; Secure by Design and JSP 936 packs are input to an assurance decision made by named accountable individuals, not the decision itself; the EU overlay drafts documentation referencing the AI Act, NIS2, DORA and the CRA but performs no conformity assessment and is not a notified-body activity; DCB0129 / DCB0160 need a registered Clinical Safety Officer. It closes with who must review what, and states that it applies to all of ArcKit rather than only the community overlays.

  Two cross-cutting limits are stated because neither is obvious from an artefact that looks finished: citations reflect the moment they were fetched, and generated content can be wrong — schema validation and deterministic scoring reduce the blast radius of a hostile or inaccurate source page without making its facts true.

  `docs/index.html` carries a condensed version of the same statement, because a disclaimer that exists only on GitHub and not on arckit.org is half a fix.

- **`/arckit:research` now runs as a three-tier reader/orchestrator/writer split** (#466, item 1 remainder). It was the largest untrusted-input surface left in the plugin and the last single-tier agent holding `Bash`, `Write` and `WebFetch` in one context: vendor sites, pricing pages, marketplaces and AI-generated comparison pages are written to persuade, and the agent that read them could also execute and write.

  - `arckit-research-reader` (`WebSearch`, `WebFetch`, `Read`, `Glob`, `Grep`, `TodoWrite` — no `Write`, `Edit`, `Bash` or `Agent`) fetches evidence for one research category and returns JSON.
  - The orchestrator is the slash-command body in the main thread, per `docs/READER-PATTERN.md` step 5. It never calls `WebSearch` or `WebFetch`; it reads reader output only after `validate-handoff.mjs` has validated it.
  - `arckit-research-writer` (`Read`, `Glob`, `Write`, `Edit` — no network, no `Agent`) holds the only `Write` tool and renders the RSCH artefact, the per-vendor profiles and the tech-notes.

  `agents/arckit-research.md` stays exactly where it is: `converter.py` replaces a command body wholesale with the agent prompt when generating the seven non-Claude targets, which cannot dispatch subagents, so deleting it would break `/arckit:research` on all of them. It keeps its `tools:` allowlist for the same reason the other three monoliths do.

- **`schemas/research-handoff.schema.json`** — the reader's output contract, driven from `templates/research-findings-template.md` rather than from the old agent prompt. It has no `score`, `rank`, `recommendation`, `pros` or `cons` field, so a judgement has nowhere to land even if the reader's prompt is overridden by a fetched page. Every enum is an allowlist: a vendor page cannot introduce a novel certification, licence or procurement vehicle by asserting one. Free-text is confined to `notable_limits`, capped at 200 characters and pattern-restricted to exclude angle brackets, so markup cannot cross the boundary into the artefact.

- **`schemas/scoring-rubrics/research-generic.yaml` and `research-uk-gov.yaml`** — seven weighted criteria (requirements fit, 3-year TCO, compliance, integration, vendor viability, exit risk, procurement readiness) computed as set overlaps and arithmetic bands. The UK-Gov variant reweights procurement readiness 5→15 and compliance 15→20, because a product with no G-Cloud or Digital Outcomes listing is a procurement exercise rather than a purchase, and deliberately drops vendor viability 10→5 so the rubric does not entrench incumbents against the SME-access duty. It adds two fixed rules: a +10 bonus for an already-procured GOV.UK platform, and a score cap of 70 for a public-facing option with no evidence of WCAG 2.1/2.2 AA conformance.

  `analyst_rating` is captured as evidence and rendered in the artefact but is deliberately given no weight in either rubric — a Gartner quadrant position is a fact about a report, not a fact about fit.

- **`tests/plugin/fixtures/research-handoff/` (2 valid + 7 reject) and `test_validate_research_handoff.mjs`, wired into `lint-markdown.yml`.** The reject fixtures cover the four injection shapes this boundary exists to stop: a reader emitting `score`/`recommendation`, a fabricated off-allowlist certification, an oversized persuasive free-text field, and markup plus an instruction string smuggled through `notable_limits`.

- **`scripts/check-agent-frontmatter.py`, wired into `lint-markdown.yml`** (#466). Asserts that every agent declares a non-empty `tools:` allowlist, that `agents/` contains nothing but `arckit-*.md` agent files, that no file carries the `copy_agent_stripped()` writeback signature, and that MCP entries use the `mcp__plugin_<package>_<server>__<tool>` prefix. Each of the four checks was verified against a deliberately reintroduced instance of the defect it guards. Fourteen `check-*.py` guards existed and not one looked at `agents/`, which is why both defects above went unobserved.

### Changed

- **`/arckit:research`'s build-vs-buy verdict is now a rule applied to computed numbers, not a judgement.** Buy when the top option scores ≥ 70 and costs less than building; build when nothing clears 50 or everything above it costs more; hybrid when the top option scores well but covers under 70% of required capabilities; and `insufficient evidence` when fewer than two options published pricing at all — that last case previously produced a confident recommendation from a single data point. The build option's cost is an orchestrator estimate and is now explicitly labelled as one, because no reader ever fetched it.

- **`docs/READER-PATTERN.md`** now records which agents have been split and names the five that remain (`aws-research`, `azure-research`, `gcp-research`, `gov-code-search`, `gov-landscape`).

- **Corrected the Agent System section of `CLAUDE.md`** (#466). It claimed 16 agents (there are 19), said the reader/writer subagents are "dispatched only by the corresponding orchestrator agent" (`READER-PATTERN.md` step 5 requires the orchestrator to be the slash command, and the command bodies say so explicitly), and listed `arckit-datascout`, `arckit-gov-reuse` and `arckit-grants` as the agents their commands delegate to, which stopped being true at #446. Those three files are now documented for what they actually are: pre-split monoliths retained solely because the converter replaces a command body wholesale with the agent prompt for non-Claude targets, which cannot dispatch subagents. The MCP tool-naming example in the same section was also wrong — it gave the bare `mcp__<server>__<tool>` form.

### Fixed

- **Restored the `tools:` allowlist, `effort:` and `maxTurns:` on `arckit-datascout`, `arckit-grants` and `arckit-gov-reuse`** (#466). PR #445 migrated all ten research agents off a `disallowedTools` denylist onto an explicit `tools:` allowlist, so that tools added by future Claude Code versions cannot auto-grant to an existing agent. PR #446 — the three-tier reader/writer split — silently reverted it on exactly the three agents it touched, and the regression survived three months and seven minor releases. Both changes are recorded as shipped in #466's own "already done" list.

  The cause was mechanical, not a hand-edit. `converter.py::copy_agent_stripped()` pops the five `CLAUDE_ONLY_AGENT_FIELDS` and rebuilds the block with `yaml.dump()`; run with its destination pointing at the source tree it strips `effort`/`maxTurns`/`tools` from the plugin itself and leaves an alphabetised `description, model, name` block with the description reflowed from a `|` literal into a single-quoted folded scalar. All three damaged files carried that signature exactly; the other sixteen agents kept their authored field order. Until now those three ran with every tool in the harness, at session effort, with no turn cap.

  `arckit-gov-reuse`'s MCP entry is restored in the `mcp__plugin_arckit_govreposcrape__search_uk_gov_code` form rather than the bare `mcp__govreposcrape__…` it originally shipped with, which matches nothing in plugin context.

- **`READER-PATTERN.md` is no longer registered as a dispatchable agent** (#466). Claude Code registers *every* `.md` under a plugin's `agents/` directory, including one with no frontmatter, which then resolves to an unrestricted tool grant. A design reference therefore surfaced as an agent named `READER-PATTERN` with "All tools", and `claude plugin details arckit` billed it as a 2–7K on-invoke skill — it was listed as one in README's own footprint table, captured from that command. Moved to `plugins/arckit-claude/docs/READER-PATTERN.md`, next to `DEPENDENCY-MATRIX.md`.

  Not to `references/`: that tree is read at runtime by 55 commands and is consequently copied into all 15 overlay plugins by `sync-shared-assets.py`, while no command has ever read this document.

## [6.11.0] — 2026-08-19

### Documentation

- **A Bring Your Own LLM guide** (#805). ArcKit has always been runnable against a self-hosted or non-Anthropic model and nothing in `docs/` or `README.md` said so, so the only discoverable answer was that it could not be done. `docs/guides/byo-llm.md` documents the three routes that exist today, none of which need ArcKit-specific code: Claude Code against a server that serves `/v1/messages` natively (vLLM, llama.cpp, Ollama v0.14.0+, SGLang, LM Studio), which removes the translation proxy this used to require; Codex CLI or OpenCode, which speak the OpenAI protocol natively and reach the same servers with no translation at all; and an organisational LLM gateway.

  Each route records what it keeps, what it loses, and the per-server defects live at the time of writing (SGLang's `input_tokens: 0` in `message_start`, Ollama's `count_tokens` hang, vLLM's tool-parser flags and its rejection of model names containing `/`). It states plainly that Anthropic does not support routing Claude Code to non-Claude models through any gateway.

  Carries a governance section, because the point of the harness is that its artefacts can be relied on: `provenance-stamp.mjs` takes the model identifier from the footer the model writes about itself, so a remapped local model may stamp a wrong or absent one; and `downgradeEffort` treats an unrecognised model ID as supporting every level, so a command declaring `effort: max` is stamped as having run at `max` regardless, making the effort row decorative on a non-Claude model.

  Registered at four enumeration points, not one: `docs/guides.html`, `docs/llms.txt`, the plugin guide tree so it ships to all seven generated extensions, and `config/guide-groups.mjs`. The fourth was missed on the first commit and caught only by `tests/codex/`, which asserts no guide lands in "Other / Uncategorised" — `check-guide-parity.py` and `check-guide-site-links.py` both passed on the broken tree, so neither guard can see a missing section classification.

- **Removed the broken star-history chart and the DeepWiki integration from `README.md`** (#804). Both rendered as dead images.

### Fixed

- **The EU Cloud Sovereignty Framework (EUCSF) assessment shipped three wrong objective weights** — `SOV-1 Strategic Sovereignty` **15%** (should be **20%**), `SOV-5 Supply Chain Sovereignty` **20%** (should be **10%**), `SOV-7 Security & Compliance Sovereignty` **10%** (should be **15%**) — verified against the European Commission's [Implementation guidance](https://commission.europa.eu/document/download/2ad80a48-166f-4c77-a513-80c53ca2a128_en?filename=Cloud+Sovereignty+Framework+-+Implementation+guidance.pdf) p.7 and the [Annex calculator](https://commission.europa.eu/document/download/3acb8fe8-8a4a-4339-ae74-f56138d913d1_en?filename=Annex+-+Sovereignty+assessment+calculator.xlsx) XLSX cells D4/D45/D76/D102/D133/D169/D195/D231. The other five objectives were already correct.

  **The wrong set is a permutation of the correct one** — the same eight numbers, three of them assigned to the wrong objective — so it still sums to exactly 100%. That is why it survived two independent "totals 100%" checks: `quality-checklist.md`'s EUCSF item (*"Weight table reproduces the framework weights and totals exactly 100%"*) and this document's own predecessor guard both evaluate a sum, and a sum is invariant to a permutation of its addends. Neither check has ever verified a single objective's weight against its own known-correct value. `scripts/tests/test-csf-weights.mjs` closes that gap: it asserts each of the eight `SOV-N` weights individually, globbed across every canonical source and generated mirror (`plugins/arckit-eu/**`, `plugins/arckit-claude/plugins/eu/**`, `.arckit/templates/**`, `docs/guides/eu-cloud-sovereignty.md`, `plugins/arckit-claude/docs/guides/**`), and `quality-checklist.md`'s EUCSF check now lists all eight weights explicitly rather than only their total.

  The guard's red run, before any data was corrected, named exactly the three wrong objectives across every file carrying the table (7 files, 48 individual weight-occurrence failures):

  ```text
  [FAIL] plugins/arckit-eu/commands/eu-cloud-sovereignty.md:198: SOV-1 weight is 15%, the framework says 20%
  [FAIL] plugins/arckit-eu/commands/eu-cloud-sovereignty.md:202: SOV-5 weight is 20%, the framework says 10%
  [FAIL] plugins/arckit-eu/commands/eu-cloud-sovereignty.md:204: SOV-7 weight is 10%, the framework says 15%
  [FAIL] plugins/arckit-eu/templates/eu-cloud-sovereignty-template.md:30: SOV-1 weight is 15%, the framework says 20%
  [FAIL] plugins/arckit-eu/templates/eu-cloud-sovereignty-template.md:34: SOV-5 weight is 20%, the framework says 10%
  [FAIL] plugins/arckit-eu/templates/eu-cloud-sovereignty-template.md:36: SOV-7 weight is 10%, the framework says 15%
  ... (and the same three-objective pattern repeated across three tables and eight `(Weight: ...)` subsection headers per file, and across every generated mirror in `plugins/arckit-claude/plugins/eu/`, `.arckit/templates/`, and both `docs/guides/` trees)
  ```

  **The checklist item that states the eight weights is itself guarded**, after review found it was not. Replacing the sum-only check with an explicit eight-weight list is the right fix, but that list is *prose* — not a table row, not a `(Weight: ...)` header — and its 31 copies (one per plugin) sit outside the weight-table roots, so reverting `SOV-1` and `SOV-5` in the checklist alone still produced a green run. The guard now recognises a third shape, `SOV-<n> <objective name> <NN>%`, and collects `quality-checklist.md` by basename so a new plugin is covered the day it is added. Coverage goes from 128 occurrences across 7 files to 376 across 38.

  Anchoring that shape on the objective's own name, rather than on a loose `SOV-<n>...<NN>%` scan, is load-bearing twice over. It avoids a false positive the same checklist line would otherwise produce (*"weights summing to 100%"* reads as SOV-8 being 100%), and it buys a second assertion: a code paired with **another objective's name** now fails too. That is the permutation defect wearing its other face — the same one that let `SEAL-3` ship as *"Digital Resilience"*.

  `SEAL-2`'s *"EU jurisdictions apply, with material dependencies remain"* is ungrammatical in the Commission's own text and is now marked in the command as verbatim-on-purpose, so a later contributor does not silently repair it and put the artefact out of step with the normative wording a tender is assessed against.

  Also corrected in `plugins/arckit-eu/commands/eu-cloud-sovereignty.md`: `SEAL-3` was named **"Digital Resilience"**, which does not appear anywhere in the framework's SEAL scale — renamed to **"Technological Sovereignty"** per the Implementation guidance p.2-3. `SEAL-2` and `SEAL-4`'s wording was also drifting from that same normative rendering (*"EU law applicable and enforceable"* vs. the source's *"EU jurisdictions apply"*; *"subject only to EU law"* vs. *"subject only to EU jurisdiction"*) and is now verbatim.
- **`/arckit:eu-cloud-sovereignty` recorded a SEAL per objective but had no aggregate SEAL concept at all**, while already framing "minimum SEAL" as the tender's rejection gate. The framework defines that aggregation, and it is a **minimum** — never an average and never a mode. Implementation guidance p.9, quoted verbatim: *"The overall SEAL level is the lowest SEAL level achieved in any of the objectives."* The Annex calculator XLSX implements that same overall rule at finer granularity, cell F2: `="SEAL-"&MIN(H5:H251)`, where each row's SEAL is `=IF(E<n>,1*F<n>,"")` — the minimum over every answered criterion. `H5:H251` spans every answer row across **all eight** objectives (header rows 4/45/76/102/133/169/195/231), so `F2` is the **Overall** SEAL; it is the workbook's only `MIN()`, and there is no per-objective SEAL cell anywhere in it. The per-objective minimum is therefore a property of the framework that the calculator leaves implicit, and is cited as such rather than attributed to a cell. The two levels agree only because an objective's own SEAL is already the minimum across its criteria, so the framework's Overall SEAL is a minimum-of-minimums.

  The template's Executive Summary and a new Section 3.3 now carry the **Overall SEAL** alongside its **governing criterion** — the objective, and where identifiable the specific contributing factor, whose evidenced SEAL set the minimum — instead of leaving the aggregate as an unattributed number. A new Section 3.0b reproduces guidance p.10's per-objective SEAL-2/3/4 requirements table, with the note that it starts at SEAL-2 because that was the minimum set for the Commission's own competition, not a floor the framework itself imposes.

  Two further properties from the same guidance pages are now stated as properties of the derivation rather than left implicit: a criterion whose every recorded answer is SEAL-4 can never bind the minimum (p.9 — *"it must be understood that the criterion has no impact on the SEAL calculation"*), and the Overall SEAL, not the Sovereignty Score, is the framework's actual rejection gate (p.10 — *"the prevalence of the SEAL criterion over the Sovereignty Score... Sovereignty score is used to compare the offers that have reached the minimum required SEAL"*). The Commission's own SEAL-4 attainability caveat (p.13, "Lessons learnt", published 1 June 2026) is carried attributed and dated, framed as a limitation it proposes to revisit rather than a permanent property of SEAL-4.

  `references/quality-checklist.md`'s `EUCSF` section now asserts the Overall SEAL is present, derived as a minimum with its governing criterion named, and that no averaging or modal language appears in the derivation.
- **`/arckit:eu-cloud-sovereignty` stated its Sovereignty Score formula without ever defining `Score(SOVn)` or `Max.Score(SOVn)`** (#782), so the model had to invent a scale each time and the result — published as a tender **award criterion** — could disagree across two runs over identical evidence.

  Both terms are now defined from the official Annex calculator, transcribed at `plugins/arckit-eu/data/csf-criteria-calculator-2026-06-01.json`: `Score(SOVn)` is the sum of the selected answers' point values per objective; `Max.Score(SOVn)` is a shared **nominal 1000** for every objective, not each objective's own computed maximum. Because the calculator rounds answer values to 2dp, the actual per-objective maxima are 1000.03 / 1002.00 / 1000.00 / 1002.00 / 1001.00 / 1000.00 / 1001.00 / 1000.00 — so a **maximal response scores 100.0756%, not 100%**. That overshoot is the framework's own documented behaviour and is reported faithfully rather than clamped.

  The command now also states explicitly that **SEAL is not an input to the Score and the Score does not determine SEAL** — both are independent readings of the same 48 answers, and Overall SEAL is the *minimum* SEAL across every answered criterion, not an average. The generated artefact carries a new **Appendix A** with per-criterion arithmetic for all 48 criteria, so the score is checkable without re-running the scorer. The Implementation guidance's narrative describes 43 questions; the published calculator scores 48 — both counts are recorded, with the discrepancy stated.

  **`arckit init` now scaffolds `.arckit/data/`**, without which the fix never reached the runtimes it was written for. The generated Codex, OpenCode and Copilot command bodies are rewritten to read `.arckit/data/csf-criteria-calculator-2026-06-01.json` and call it *"the ONLY source"* for `Score(SOVn)`, `Max.Score(SOVn)` and each criterion's SEAL, with *"never invent, estimate, or paraphrase these values"*. That path was never created: `get_data_paths()` builds an explicit per-directory key list and `data` had no entry, so the model was pointed at a missing file and fell back to inventing the scale — #782 verbatim, on a CLI-scaffolded project. The plugin path was always fine.

  Copied unconditionally, next to `references`, rather than inside the Codex branch: all three CLI targets are rewritten to `.arckit/data/`, so gating it on one would have left `--ai opencode` and `--ai copilot` still broken. `"data"` is also added to `REQUIRED_ASSETS` in `hatch_build.py` so a hollow build cannot ship the extension without it — verified by removing the directory and confirming the check reports it.

  This is the fifth registry the change had to reach, after the three the original work found plus the `.gitignore` rule. Same signature as the others: `data/` reached every extension tree and every generated command, and every local check passed regardless.

  Two notes added to the catalogue itself, both about telling the Commission's gaps apart from ours. The two `label: null` answers on SOV-1 criterion 6 are the **workbook's** blank cells (rows 31 and 33), not a transcription loss. And `provenance.publicationDate` now records where the date came from — the Commission's download page — because neither artefact's own metadata states it and the two disagree (workbook `docProps` created 2026-05-28, guidance PDF `CreationDate` 2026-06-03), while the date is load-bearing: it names the file, chosen over the framework version because the two disagree on the question count.

  New: `plugins/arckit-claude/scripts/csf-score.mjs`, a pure-Node scorer implementing these definitions (Claude Code / Python-CLI targets only — Codex, Gemini, OpenCode, and Copilot ship the calculator data and command markdown but not the script, per the existing non-Claude script-degradation pattern; the artefact's per-criterion arithmetic requirement makes the assessment checkable either way). Guarded by `scripts/tests/test-csf-score.mjs`, wired into `lint-markdown.yml`.

## [6.10.0] — 2026-08-18

### Added

- **The doc-control guard rejects a classification ladder restated under the marker** (#746). `check-doc-control-resolution.py` check 2 asked whether the required comment was PRESENT, so anything added after it was invisible — which is how 34 templates came to carry a second ladder the router cannot see, 10 of them the wrong one. The new check 4 fails on a `| Classification | ... |` row inside the marker comment block and names the offending line. A note that adds something beyond the menu is not a row and is unaffected.

- **A guard that per-type quality-checklist checks match the artefact's own regime ladder** (#790, follow-up to #787). `scripts/check-quality-checklist-ladders.py` asserts that a section for a doc-type whose regime hard-routes — AT, AU, CA, FR, NL, UAE — never demands a classification from a different regime's ladder. That state is invisible at runtime: the artefact renders `Diffusion Restreinte` from `document-control-fr.md`, the check demands `OFFICIAL-SENSITIVE`, and a correctly classified artefact fails the check its own command gates on. Seven sections were in it until #788, every one from copying a UK section when adding an overlay type.

  Derived end to end from `config/doc-types.mjs` (`DOC_TYPES`, `REGIME_PARTIALS`, `UK_FALLBACK_BY_DESIGN`) and each partial's own `**Classification**` row, so a new regime extends the guard with no edit here. Enumerating the schemes by hand is the defect #788 fixed *in the checklist itself*, where a list of three had drifted from a registry of six, and a test asserts no ladder value is hardcoded in the guard.

  Anchored on the two assertion phrasings actually in use rather than scanning for ladder tokens. A bare token scan cannot work: `OFFICIAL` and `SECRET` sit on three ladders at once, and `Open`, `Shared`, `Secret` and `Confidential` are ordinary English — the #787 detection pass false-positived on FITAA's *"Open Items"*. The three fall-through regimes (UK, MOD, EU) are deliberately not policed, because they resolve through user config and can legitimately render a UAE or AT ladder. US was a fourth until #746 gave it a ladder of its own.

  Resolution is per plugin, matching `check-quality-checklist-refs.py`: `${CLAUDE_PLUGIN_ROOT}` has no cross-plugin fallback, so each overlay is checked against its own checklist and its own partials. Run against the tree as it stood before #788 it reports all seven, in each of the 16 copies; `tests/plugin/test_quality_checklist_ladders.py` reproduces that failure against the real registry, because a guard that cannot demonstrate a failure reads as coverage.

- **Two new `arckit-uk-gcloud` templates**: `gcloud-competitors-template.md` (`GCMP`) and `review-template.md` (`GCRV`), both with the marker, Revision History and External References. `arckit-uk-gcloud` is not in `PLUGIN_SOURCES`, so neither mirrors into `.arckit/templates/`.

- **A fourth check in `scripts/check-doc-control-resolution.py`**: a command declaring a `doc-type:` must reference a template file. The first three checks walk *templates* and ask who reads them, so a command with no template was invisible to them — which is why `GCMP` and `GCRV` needed a separate sweep rather than surfacing in the #760 pass. `doc-type: none` commands are out of scope. Both exemption lists (`NO_READER_KNOWN`, `NO_TEMPLATE_KNOWN`) are now empty, and a test asserts they stay that way.

- **`Unmet Must-Have Requirements`** in `gcloud-requirements-template.md`, plus the G-Cloud framework notes ported from the old inline skeleton. A per-service gap belongs in that service's block; a requirement *nothing* on the shortlist meets changes the procurement decision rather than the ranking, so it now has its own place and an explicit "write None rather than omitting" instruction.

- **`scripts/check-doc-control-resolution.py`** — the guard #760 asked for, wired into `lint-markdown.yml` beside `check-quality-checklist-refs.py`. It checks three things: every marker template has a reader (command *or* writer subagent) that references `_partials/RENDERING.md`; the marker comment is the current one-line form; and the converse, that a template hand-maintaining a Document Control block without the marker is declared deliberate with a reason.

  `arckit-uk-nhs`'s six DCB0129/DCB0160 safety-case templates are recorded in `INLINE_BY_DESIGN`: they follow the Marcus Baw `SAFETY.md` spec convention, whose Document ID is the literal `SAFETY.md` with no `ARC-` prefix, and converting them would break that convention on purpose. `apply_doc_control_marker.py` carries the same exemption, having converted all six by accident during this work. `uk-nhs-dtac-template.md` and `uk-mdr-classification-template.md` are explicitly **not** exempt.

  Three templates are recorded in `NO_READER_KNOWN` rather than fixed, and tracked on #792: `backlog-template.md`, `gcloud-clarify-template.md` and `gcloud-requirements-template.md` each name their owning command in their own header, and that command writes its artefact from a skeleton inlined in the command body instead — with no `## Document Control` and no `## Revision History` at all, which makes Common Checks 1, 4 and 6 unsatisfiable for `BKLG`, `GCLC` and `GCLD`. Against the Template-Driven Generation rule in `CLAUDE.md`, and a behaviour change rather than a wording one. The guard walks templates and asks who reads them, so a command writing a governed artefact with **no** template is invisible to it — `arckit-uk-gcloud`'s `gcloud-competitors` (`GCMP`) and `review` (`GCRV`) have the same defect and needed a separate sweep to find. Both noted on #792.

  15 tests in `tests/plugin/test_doc_control_resolution.py`, weighted toward the negative cases: the guard fails on an unresolved marker, an unread template, a stale comment, an undeclared inline table, a stale exemption, and on matching nothing at all.

### Changed

- **One convention for per-command classification instructions across the hard-routing regimes** (#799, split out of #790's blocker 1). Since #744 made Document Control routing regime-first, the AU, CA, FR and AT commands were still carrying instructions written when the per-command line was the only thing producing the right ladder. Four shapes were live at once, and that disagreement was what blocked extending #798's guard to command files: an anchored scan flags `OFFICIAL` in `at-bvergg.md` and has no way to tell it from the drift #788 fixed.

  The split turns on what each shape actually does. **`RENDERING.md` picks the ladder; the command picks the value on that ladder** — the partials ship a placeholder menu (`document-control-ca.md:6` is `[UNCLASSIFIED / Protected A / …]`), so something has to choose from it. Restating the menu is duplication; asserting a value is editorial judgement `RENDERING.md` cannot supply.

  - **AU (10 commands) and CA (12)** restated the menu — *"Use the Australian classification scheme (…) — replace the standard UK line in the header"* — and now defer in NL's words instead, naming the partial and the framework without repeating the values. The three carrying an extra editorial note (`au-soci-cirmp`, `ca-ocap`, `ca-soia`) keep it.
  - **FR (12) and AT (3)** assert a value with a reason — *"Diffusion Restreinte minimum (cartography reveals attack surface)"* — and are unchanged in substance.
  - **AT's five dual-notation sites** across `at-bvergg.md`, `at-dsgvo.md` and `at-barrierefreiheit.md` lost the vestigial UK token. Each already ended *"Emit the AT InfoSiG value"*, so `Classification: OFFICIAL — under the AT InfoSiG scheme use **Offen**` was carrying a UK value it then told the model to discard. It also gave `OFFICIAL` a second partner: `RENDERING.md` step 6 maps `OFFICIAL` → `Eingeschränkt`, `at-bvergg.md` paired it with `Offen`.
  - **15 `RENDERING.md` pointer sentences** (FR 12, AT 3) lost the ladder menu inlined in the parenthetical, which duplicated the Regime routing table. The sentence still names the doc-type, the regime and the partial.
  - **`fr-irn.md`** was the one FR command using a flat `**Classification**:` list item rather than the nested `- Classification:` shape the other 11 use, so one anchor now matches all 12.

  No behavioural change is intended for AU or CA: both regimes already hard-route, so the removed sentences did not affect what renders. Verified statically end to end for `/arckit:au-pia` (`AUPIA`) and `/arckit:ca-pia` (`PIA`) — doc-type declared, template referenced, marker present, `_partials/RENDERING.md` referenced, code listed in the Regime index, regime hard-routing to the right partial, and that partial carrying the right ladder. **`arckit-at` is now internally consistent too**: `at-nisg.md` already deferred and the other three no longer contradict it.

### Fixed

- **Citation instructions now resolve to tables that exist** (#783). 40 templates across ten plugins told the model to populate an `## External References` section whose tables the template did not ship. `references/citation-instructions.md` is explicit that it does not create that section — *"The template ships with these tables already; the rules below describe how to fill them"* — so where the tables were absent the instruction resolved to nothing. Nothing errored and nothing was logged; the artefact was simply written with no citation trail, and a reader had no way to check a generated claim against its source.

  `plugins/arckit-nl/commands/nl-cloud.md` was the sharpest case: it *mandated* that the Herziening rijksbreed cloudbeleid 2026 and VIRBI 2025 appear in a Document Register `nl-cloud-template.md` did not have. No `_partials/` file supplies the section either, so nothing rescued it at render time.

  It matters most where it was worst. `arckit-uk-finance` and `arckit-uk-gcloud` accounted for the largest share, and both write artefacts whose value is auditability — safeguarding reconciliations, CTP dependency registers, SCA-RTS exemption matrices, G-Cloud service definitions and supplier declarations. Those are read by a regulator or a buyer, and the citation trail is the part that makes a generated claim checkable.

  The defect came in four shapes, not one, and the issue's reproduction (a substring test for `External References`) saw only the first:

  - **23 templates had no section at all** and gained the canonical block. The four `nl-*` registers are seeded with the sources their command mandates, taking URLs from each command's own authoritative-sources table; `nl-bio` keeps a placeholder because BIO2 has no stable published URL and inventing one would be worse than the gap.
  - **Six carried the heading and one flat source table** with entirely different columns (`au-aescsf`, `au-energy-compliance`, `au-ot-security`, `au-soci-cirmp`, `uk-mdr-classification`, `uk-nhs-dtac`). The existing table is preserved under `### Authoritative Sources` and the three canonical tables follow it.
  - **`au-ism-controls` and `au-pspf` had `## External References` with an empty body.** Their registers sat under the *following* `## ArcKit Evidence Integration` heading, so the section the instruction named was literally empty. Reordered so the registers sit under External References, with the missing tables added.
  - **Four had the section as a `###` stub nested inside Traceability** (`application-inventory`, `architecture-change`, `gap-analysis`, `agent-maturity`), holding a one-row placeholder rather than a register. Promoted to a top-level numbered section carrying the canonical tables.

  Two things deliberately not changed. The **four `uk-fs-*` fragment templates** the issue listed are not artefacts: `uk-fs-sca-rts-exemption-matrix-template.md` and its three siblings define the shape of one block inlined into a parent, they carry no Document Control, and the parent now carries the citation trail — giving each fragment its own register would emit duplicate tables inside a single artefact. And **column names are untouched**: several plugins carry the three tables with locally-divergent columns (`Source` for `Source Location`, four-column registers throughout `arckit-ca`), and normalising them is a separate change from making the section exist.

  The eight `arckit-uk-gcloud` templates are plugin-copy-only. That plugin is deliberately absent from `PLUGIN_SOURCES` in `tests/plugin/test_template_consistency.py` and ships its own proprietary `LICENSE`, so mirroring them into `.arckit/templates/` would push proprietary content into MIT-licensed CLI package data. The other 32 are mirrored as usual.

  `au-aescsf` and `au-energy-compliance` also had a second `## Document Register` — a metadata table listing Document Type and Template Origin, unrelated to citations. Renamed `## Document Metadata` so the instruction names one thing.

- **New CI guard: `scripts/check-citation-section-refs.py`** (#783), run by `lint-markdown.yml` alongside `check-quality-checklist-refs.py`, which exists for the same defect class: an instruction that points at a section that is not there. For every command **or agent** referencing `references/citation-instructions.md`, every `*-template.md` it names under its own `templates/` directory must carry all three `###` sub-headings.

  Sub-headings, not the `## External References` heading. A presence-only check would have passed 16 of the 40 broken pairs on day one and frozen that drift in as compliant — the same lesson as #792, where a marker guard that only checked presence could not see what the marker said. Scanning agents as well as commands matters because the writer subagents, not the commands, hold the template reference for several research artefacts.

  Resolution is per plugin, matching `${CLAUDE_PLUGIN_ROOT}`. Templates with no Document Control block are skipped as inlined fragments, and `plugins/arckit-claude/plugins/**` is skipped as the generated publish-layout mirror, in line with the four sibling guards. No exemption list.

- **The USA Federal regime renders a US classification ladder** (#746, follow-up to #744). `REGIME_PARTIALS.US` pointed at `document-control-uk.md` and `US` sat in `UK_FALLBACK_BY_DESIGN`, so all 10 USA Federal Civilian doc-types — the FedRAMP SSP and RAR, FISMA / NIST 800-53, CISA Zero Trust, ICAM, the NIST AI RMF, the M-24-10 AI impact assessment, the E-Gov §208 PIA and the EO 14028 SBOM attestation — put `[PUBLIC / OFFICIAL / OFFICIAL-SENSITIVE / SECRET]` in the Document Control header of a US federal artefact. Six of the ten are HIGH severity.

  `document-control-us.md` now ships and US hard-routes. The ladder is `UNCLASSIFIED / CUI / CONFIDENTIAL / SECRET / TOP SECRET`, taken from the primary instruments rather than from memory: **EO 13526 §1.2** for the three classified tiers, which states that no other terms identify US classified information, and **32 CFR 2002.20** for CUI. #746 deferred rather than guessed because nothing in the repository stated a ladder, and the judgement it was waiting on is now recorded as step 7 of `RENDERING.md`: **CUI is a control marking, not a classification level**, so category and limited-dissemination markings (`CUI//SP-PRIV`, `CUI//NOFORN`) belong in `Distribution`; and a FIPS 199 impact level never belongs in the field at all, being a different axis that categorises the system rather than marking the document — the `FIPS199` artefact deriving it is itself commonly marked `CUI`.

  Two things the issue did not name had to move with it, or the new partial would have been contradicted or unreachable:

  - **All 10 `us-*` templates mandated the UK ladder** under the marker — `<!-- Classification line MUST be: -->` followed by the UK row. A `MUST` in the template outranks the router at render time, so it would have overridden `document-control-us.md`, and it already overrode the user-config chain the deferral was meant to preserve: a UAE- or AT-configured entity running a `us-*` command was told to emit the UK line regardless. 34 templates across US, CA, AU and AU-energy carried a restatement of this shape and all 34 lose the row; the notes that say something the menu does not (`au-soci-cirmp`, `ca-ocap`, `ca-soia`) stay.
  - **No `us-*` command resolved the marker.** All 10 listed `_partials/RENDERING.md` among their prerequisites, which is enough to satisfy reader-matching in `check-doc-control-resolution.py`, but none instructed the model to resolve it — the only overlay of nine missing that step (AT 4/4, AU 10/10, CA 12/12, EU 8/8, FR 12/12, NL 4/4, UAE 12/12, **US 0/10**). Each now carries it in the form #799 settled for a hard-routing regime.

  `docs/guides/us-federal-overlay.md` recorded *"CUI / Confidential / Secret / Top Secret marking is not covered in v1"* as a known limitation. That is now scoped to what the overlay genuinely does not do — CUI categorisation and classified-system architecture, which stay with the future `arckit-us-dod` overlay — rather than to how the artefacts mark themselves.

- **Five commands wrote a governed `ARC-*` artefact with no Document Control block and no Revision History** (#792). Each built its document from a skeleton inlined in the command body rather than from a template, against the Template-Driven Generation rule in `CLAUDE.md`. All five now read their template and resolve the `<!-- DOC-CONTROL-HEADER -->` marker.

  Three had a template that named its own command in its header and was never read — `/arckit:backlog` (`BKLG`), `/arckit:gcloud-clarify` (`GCLC`) and `/arckit:gcloud-search` (`GCLD`). Two had **no template at all**: `arckit-uk-gcloud`'s `/arckit:gcloud-competitors` (`GCMP`) and `/arckit:review` (`GCRV`), whose command bodies said *"there is no separate template for this doc-type; structure the report inline"*. Both now ship one.

  This was **fully-wired coverage aimed at impossible documents**, not a coverage gap. All five codes already had a `### <CODE>` section in `references/quality-checklist.md`, and all five commands instructed the model to verify the Common Checks — of which 1 (*Document Control complete: all 14 fields*), 4 (*Classification set*) and 6 (*Revision History present*) cannot be satisfied by a document with no Document Control block. Two commands went further and carried a **CRITICAL - Auto-Populate Document Control Fields** block for a header they never emitted.

  `GCMP` and `GCRV` are registered `regime: 'UK'` and listed in `RENDERING.md`'s regime index, so the index had been claiming routing coverage for two doc-types whose artefacts structurally could not hold a Classification field.

  Citation traceability was broken in the same way for the three core commands: `## External References` was in all three templates and none of the three skeletons, while `/arckit:backlog` instructed the model to *"populate the 'External References' section in the template"* — a section its own output never contained.

- **`Review Date` corrected to `Next Review Date` in 33 commands and agents.** The Document Control Standard has no `Review Date` field; the calculated-fields instruction had been naming one for the whole 14-field block, which is the same 13-vs-14 drift the six worked examples carried before #791.

- **`<!-- DOC-CONTROL-HEADER -->` templates now have a command that actually resolves them** (#760). `templates/_partials/RENDERING.md` states the rule normatively — *the command that reads the template MUST resolve the marker* — and nothing enforced it. **91 template/command pairs did not**, so those artefacts rendered a literal HTML comment and no Document Control block at all, which is strictly worse than the short hand-maintained table the marker replaced.

  The sharpest case was **France**. `FR` hard-routes and `document-control-fr.md` shipped in #752, but **0 of 12 `fr-*` commands read `RENDERING.md`**, so the French ladder was unreachable from the commands it was added for and `/arckit:fr-anssi` rendered a UK ladder for a hard-routed French artefact. **Austria** was 1 of 4, the three older commands predating `at-barrierefreiheit` (#773). Both regimes are now 100%.

  Resolution was added to 74 commands and 6 agents in total. The **writer subagents** matter most: `arckit-tenders-writer`, `arckit-competitors-writer`, `arckit-datascout-writer`, `arckit-gov-reuse-writer` and `arckit-grants-writer` are the tier that holds the `Write` call, and **0 of 20 agents referenced `RENDERING.md`** before this. Their instruction covers spawned per-item profiles and tech-notes too, not just the main artefact.

- **The marker comment contradicted the file it pointed at, on 121 of 168 templates.** It restated the routing rule as *"resolved to `document-control-uk.md` or `document-control-uae.md` based on plugin userConfig"* — true before #744 made routing regime-first, and naming two partials when there are now seven. `apply_doc_control_marker.py`'s `MARKER` constant was never updated, so the conversion in #761 wrote the stale wording into all 16 templates it converted. The comment now defers instead of paraphrasing (`<!-- Resolved at command-execution time per _partials/RENDERING.md. -->`), which is what stops it drifting again, and the script normalises existing markers rather than only converting new ones.

- **The pre-#744 classification fallback was still live in 47 commands and 9 agents.** They instructed the model to substitute `[CLASSIFICATION]` from `${user_config.default_classification}` — the operator-driven path #744 replaced with regime routing — against a placeholder that survives in **exactly 1 of 168 templates** (the MARP footer in `presentation-template.md`). All 56 now defer to the resolved header. This was also the stated reason #761 deferred the guard, on the understanding that core resolved the marker by a second legitimate mechanism; it did not.

- **Six core commands shipped a worked example that contradicted the partial.** `adr`, `requirements`, `secure`, `sow`, `tcop` and `traceability` each carried an "Example Fully Populated Document Control Section" — a **13-field** table using `Review Date` instead of `Next Review Date` and omitting `Review Cycle`. Being a concrete example, it outranked the 14-field partial for the model copying it. Replaced with the marker.

- **`/arckit:template-builder` was a factory for the defect.** Every template it generated carried a hand-written 14-row Document Control table with a hardcoded UK ladder, so each user-built template was born outside regime routing. It now emits the marker.

## [6.9.0] — 2026-08-13

### Added

- **The Document Control classification ladder now follows the artefact's jurisdiction, not the person running the command.** A Canadian Privacy Impact Assessment carried the UK `PUBLIC / OFFICIAL / OFFICIAL-SENSITIVE / SECRET` ladder unless the operator happened to have configured a matching `classification_scheme` — the wrong dependency, since the ladder is a property of the artefact and the regime it is written under, not of the workstation that generated it. Each doc-type's existing `regime:` tag now selects the partial via a new `REGIME_PARTIALS` map in `config/doc-types.mjs`, and regime beats user config.

  Four new partials ship with it: `document-control-ca.md`, `document-control-au.md`, `document-control-nl.md` (VIRBI 2025) and `document-control-fr.md` (Non protégé / Diffusion Restreinte / Secret / Très Secret). `UK`, `MOD`, `EU` and `US` deliberately do **not** hard-route — they sit in an explicit `UK_FALLBACK_BY_DESIGN` set and fall through to the user-config chain exactly as before, so the 41 doc-types tagged with those regimes render identically to previous releases. For `US` that is a deferral, not a decision: no authoritative ladder wording exists in this repository, and a wrong ladder inside a Document Control header reads more authoritative than a fallback does.

  `scripts/tests/test-regime-registration.mjs` enforces the routing rather than observing it, and holds `templates/_partials/RENDERING.md` to the registry cell by cell — that file, not `config/doc-types.mjs`, is what resolves the marker at runtime, because community overlays ship `templates/_partials/` but no `config/` directory. `RENDERING.md` is now self-contained.

- **`/arckit:at-barrierefreiheit` (`ATBFR`) — Austrian digital accessibility across both transposition tracks** (#710). The **BaFG** binds economic actors; the **WZG** binds federal public bodies. Which applies is a question about the entity, not the technology, and a federal body running an in-scope service is subject to both — so the command determines each track independently, supports "both", and marks non-applicable sections N/A with the reason rather than omitting them. One neutrally-named doc-type carries both tracks. Conformance is assessed against EN 301 549 v3.2.1, giving WCAG 2.1 AA.

- **Netherlands Public Sector Overlay (`arckit-nl`) — four commands, community-contributed** (#739). `/arckit:nl-cloud` (`RBCLOUD`) against the Herziening rijksbreed cloudbeleid 2026, `/arckit:nl-tbb` (`TBB`) for Te Beschermen Belangen categorisation, `/arckit:nl-bio` (`BIO2`) against Baseline Informatiebeveiliging Overheid 2, and `/arckit:nl-exit` (`NLEXIT`) for the exit plan clause 3.2 makes mandatory. Unlike France's SecNumCloud there is no published Dutch qualification list, so no commercial provider is named as compliant and the overlay says so where a reader would expect one.

- **`/arckit:eu-cloud-sovereignty` (`EUCSF`) — EU Cloud Sovereignty Framework assessment** (#740). Assesses a cloud service against the eight Sovereignty Objectives using the framework's own weights, recording a SEAL level per objective and computing the weighted Sovereignty Score. Two points the command is loud about: minimum SEAL levels come from the tender specification, not the framework, and a supplier's self-declared SEAL is an unverified claim until the assessor records evidence. It records an assessment; it does not certify.

### Fixed

- **`references/quality-checklist.md` checked artefacts against ladders they no longer render** (#787). Common check 4 enumerated three schemes against the six that hard-route, so a Canadian artefact correctly classified `Protected B` failed the check every `ca-*` command gates on. It now defers to `RENDERING.md`, already CI-held to the registry, rather than carrying a fourth copy of the enumeration. Seven per-type sections named a UK classification for doc-types routing elsewhere; the six `FR` ones took the values the overlay remap settled, leaving each `fr-*` command carrying two contradictory checks for the same artefact until this landed. `ATDSG` becomes `Eingeschränkt`, rising to `Vertraulich` where criminal-law confidentiality applies, and `at-dsgvo.md`'s own checklist line moves with it.

- **Fifteen doc-types told the model to verify quality checks that did not exist, and it invented them instead** (#749). Nine `arckit-togaf-adm` codes and six `arckit-agent-architecture` codes had no per-type section, so the model reached a heading that was not there and supplied its own criteria for the artefact it was about to write. Nothing errored and nothing was logged. `scripts/check-quality-checklist-refs.py` now asserts every per-type reference resolves, keyed on what files emit rather than on the doc-type registry, and covers agents as well as commands.

- **`create-project.sh` handed back a project number that already existed once a repo passed seven projects** (#762). `get_next_project_number` compared the zero-padded prefix in an arithmetic context, where bash reads a leading `0` as octal — `010` and `011` were silently read as 8 and 9. The failing `((...))` sits in an `if` condition where `errexit` is suspended, so the script reported `"success": true` and exited 0. Both arithmetic sites now force base 10.

- **`create_project_dir` wrote a whole project tree into an existing directory rather than refusing it** (#765). The directory is named `{freshly-allocated-number}-{slug}`, so a target that already exists means the numbering is wrong. Both helpers now refuse before anything is written, and emit `{"error": ..., "success": false}` rather than dying under `errexit` with zero bytes on stdout — roughly 59 command files read that stdout.

- **Every scripted project-creation path in the overlay commands called `create-project.sh` in a form it rejects** (#775, #777). 41 files across eight plugins, in two spellings, neither of which can produce a project: the script takes `--name "NAME"` and has no positional argument. Five callers were worse than a failed call, using a create-only script as a lookup and reading keys the script never emits; they now resolve the project from the context the `arckit-context.mjs` hook already injects. `scripts/check-create-project-invocations.py` is new and wired into CI.

- **`slugify` deleted accented characters from project directory names for every plugin user** (#766). The fix for this landed in `scripts/bash/common.sh` only, and marketplace users never touch that copy. All four implementations now transliterate to ASCII so the result is identical across locales and both languages. `scripts/check-common-parity.py` holds both copies of `common.sh` and `common.py` in step definition by definition, with declared divergences carrying their reason.

- **23 templates had drifted between the plugin tree and the `.arckit/templates/` CLI mirror, because the test guarding them compared filenames and not contents** (#784). Commands resolve the project-root copy *before* the plugin copy, so in a CLI-scaffolded project the drifted copy is the one that renders. Sixteen still carried the frozen Document Control table that `<!-- DOC-CONTROL-HEADER -->` replaced, so regime routing never fired for them at all.

- **The secret scanner's OIDC exemption only fired when the permission line was the last content in the input** (#737, reported by @johnfelipe). The guard was anchored with `$` against patterns built with `gi` and no `m`, so it matched end of input rather than end of line — meaning it never fired in the file scanner at all, where a `permissions:` block is always followed by the `jobs:` it authorises.

- **`/arckit:nl-tbb` no longer derives a VIRBI 2025 rubricering from the TBB category — the systematiek runs the other way** (#781). A process scoring Hoog on Beschikbaarheid alone reached TBB 2 and was stamped Stg. GEHEIM: a confidentiality marking produced by an availability score. Step 7 is inverted to record the rubricering the information already carries and apply the one authorised direction as a floor on the category.

- **Austrian overlay accuracy.** `/arckit:at-bvergg` named WCAG 2.2 AA where §107 BVergG invokes the OJ-cited EN 301 549 v3.2.1, giving 2.1 AA — a UK position carried one jurisdiction too far (#769). Every public-facing description of `/arckit:at-nisg` still named the superseded law and an authority that does not receive the report under NISG 2026 (#770).

- **French overlay accuracy.** The IGI 1300 citation in `fr-dr` described the pre-2021 three-tier scheme; a follow-up audit of the whole overlay found nine more issues verified live against ANSSI/CNIL/Légifrance, including stale procurement thresholds, three wrong circular numbers, and 11 dead or redirected URLs (#745, #752).

## [6.8.0] — 2026-08-04

### Added

- **`doc-type:` command frontmatter, and a gate that asserts recipe `output.type` matches it.** A single code, a `[A, B]` list, or `none` for the 20 commands that write no `ARC-*` artefact. It lives on the command even when the command delegates (`/arckit:framework` declares `FWRK`), because it describes what running the command produces. The registry gate previously checked only that a code *resolved*, which is why `UAE-PROC` was one de-prefixing away from silently becoming `PROC`, Canada's procurement code. Recipe coverage went from 52 of 398 targets to 398 of 398. Stripped by the converter (#715).

- **`AT InfoSiG` classification scheme** — new `_partials/document-control-at.md`, selected via `classification_scheme: AT InfoSiG` or `governance_framework: AT Gov`, with the InfoSiG ladder (Offen / Eingeschränkt / Vertraulich / Geheim / Streng geheim). `RENDERING.md` resolves UAE → AT → UK; the quality-checklist Classification check and `default_classification` are scheme-aware; `at-bvergg` / `at-dsgvo` emit InfoSiG equivalents. UK/UAE unaffected (closes #709).

### Changed

- **`generate-document-id.sh` is now `generate-document-id.mjs` and imports `config/doc-types.mjs`.** The bash version restated `MULTI_INSTANCE_TYPES` in two hand-maintained copies, which drifted and shipped three times (#566, the later `GRNT` miss, and the header comment fixed in #722) and needed `check-multi-instance-parity.py` purely to police the duplication. That guard is removed: the registry now has exactly one copy, and registering a multi-instance doc-type is one place rather than three (#723).

  Because the registry is in scope, the generator now **rejects an unregistered doc-type code** instead of emitting a name `validate-arc-filename.mjs` will block two steps later — the `GLOS`/`FWRK` failure caught where it is actionable. It also gains `--relpath`, which applies `SUBDIR_MAP` and returns the project-relative path, and it reports a doc-type passed in the `PROJECT_ID` slot rather than dying in `printf`.

  `scripts/bash/generate-document-id.sh` is now a shim that execs the `.mjs`, kept for projects scaffolded before this change and removed a release later. The generator ships to all seven extension formats and is allowlisted in `allow-plugin-internals.mjs`.

### Fixed

- **`/arckit:pages` published a local disk scan, and destroyed hand-added `<head>` content.** `sync-guides.mjs` rewrites the whole of `docs/manifest.json` but never had the gitignore guard `update-manifest.mjs` got in #690, so running it in a repo that gitignores `projects/` published an unpublishable index. It now applies the same rule where project directories are discovered, so the manifest, dependency graph and health rollups are all correct by construction; scoped to artefact directories, so a repo that gitignores its generated `docs/` keeps its guides. Fails open without git, and reports what it omitted. Separately, content between `<!-- ARCKIT:PRESERVE -->` markers in `docs/index.html` now survives regeneration, so analytics tags and verification meta are no longer wiped on every run — the template stays site-neutral, since it ships to every user (#727).

- **`uk-nhs-clinical-safety.yaml` keyed its AWS, Azure and GCP research targets to `RSCH` instead of `AWRS`/`AZRS`/`GCRS`** — a live instance of the wrong-but-registered class, found by the new check on its first run. Five targets in that recipe shared one state key, so `--resume` and `--target` could not tell them apart. The seven other recipes with those targets were already correct (#715).

- **`/arckit:pages` crashed in any repo with an `audits/` or `framework/` directory.** `sync-guides.mjs` derived its artefact-routing keys from `SUBDIR_MAP` but hand-listed the buckets it pushed into, so a doc-type registering a new subdirectory left an undefined array and `scanProject` threw. It shipped twice unreported — `audits` with `CDAU` in v6.7.0, `framework` with `FWRK` in #714 — because the crash only fires when the directory exists, and it is why `docs/manifest.json` went stale. Buckets are now derived from `SUBDIR_MAP` via the same helper the routing loop uses.

- **The doc-type registry gate was blind to every multi-instance filename.** `check-doc-type-registry.py` required the code to be followed immediately by `-v`, so `ARC-001-WGAM-001-v1.0.md` and `ARC-{PID}-ADR-{NNN}-v1.0.md` produced no match at all, leaving all 20 `MULTI_INSTANCE_TYPES` codes unchecked in the form commands actually write. `validate-arc-filename.mjs` strips the sequence segment before its own `KNOWN_TYPES` lookup, so an unregistered multi-instance code passed the gate and was then blocked at runtime: the same failure as `GLOS` and `FWRK`. The pattern now accepts an optional sequence segment and is pinned by `tests/plugin/test_doc_type_registry.py` (#715).

- **All 12 `arckit-uae` commands passed the doc-type in the `PROJECT_ID` slot when calling `generate-document-id.sh`**, e.g. `generate-document-id.sh FPRO --filename`, which exits 1 with `Error: DOC_TYPE required`. Corrected to `<PROJECT_ID> FPRO --filename`, matching the other overlays (#715).

- **`generate-document-id.sh`'s header comment listed 15 multi-instance types while `MULTI_INSTANCE_TYPES` held 20**, omitting `CDAU`, `GCSR`, `GLND`, `GOVR` and `GRNT`. `check-multi-instance-parity.py` reads the variable, not comments, so nothing caught it. The duplicate list is removed in favour of pointing at the variable (#715).

- **`/arckit:glossary` could never write a conforming filename.** `commands/glossary.md` writes `ARC-{PROJECT_ID}-GLOS-v1.0.md` in eight places, but `config/doc-types.mjs` had no `GLOS` entry, so the `validate-arc-filename.mjs` PreToolUse hook blocked every run as an unknown document type — with no correct name to fall back to. In practice the model either failed the write or invented a non-conforming name, producing an artefact that `/arckit:health`, `/arckit:graph-report`, `/arckit:traceability`, `/arckit:search` and the `docs/manifest.json` indexing could all not see. `GLOS` is now registered, and the `/arckit:build` recipes that carried `GLO` or `GLOSS` are converged on it. Reported by @chrismckelt against 6.7.5 (#712).

- **`/arckit:framework` was blocked identically, via an unregistered `FWRK`.** `agents/arckit-framework.md` writes `framework/ARC-{P}-FWRK-v{VERSION}.md`; `FWRK` is now registered with a `SUBDIR_MAP` entry routing it to `framework/`. The agent's deliverables list also described the executive guide as an `ARC-*-EXEC-*` artefact, contradicting its own write step, which names it `{Project-Name}-Executive-Guide.md` and states it is deliberately not governed — the list now matches the write step.

- **`quality-checklist.md` gained the `GLOS` and `FWRK` per-type sections.** `commands/framework.md` already instructed the model to verify "the **FWRK** per-type checks", which did not exist; `commands/glossary.md` now points at the `GLOS` checks in the same way the other commands do.

- **Recipe doc-type drift corrected where a code resolved to the wrong type.** `AIP` → `AIPB`, `HLD` → `HLDR`, `SBD` → `SECD`, `TRACE` → `TRAC`, and the twelve `UAE-`-prefixed codes in `uae-federal-ai.yaml` reduced to the bare codes its commands actually write (including `UAE-PRIORITIES` → `NPRA` and `UAE-PROC` → `FPRO`, which were not simple de-prefixings). `output.type` keys `.arckit/state.json`, so these were silent: they broke `--resume` and `--target` matching rather than the write.

The registry now holds 161 doc-type codes, up from 159.

- **Austrian overlay (`arckit-at`) legal accuracy pass.** `/arckit:at-nisg` and its template were rewritten from the mistaken "NISG 2024 / 2018-amendment" framing to the enacted standalone **NISG 2026** (BGBl. I Nr. 94/2025): in force 1 Oct 2026 (§51), registration by 31 Dec 2026 (§29), competent **Bundesamt für Cybersicherheit** (§3a), CSIRT reporting (§8/§34, CERT.at + GovCERT), and enacted §-numbering replacing fabricated references; management-body personal liability noted as not explicitly regulated (§45 fines address the entity). A follow-up paragraph-level verification against the authentic Bundesgesetzblatt then corrected four details: the §33 Abs. 1 **Selbstdeklaration** (~30 Sep 2027) is distinguished from the later independent **Wirksamkeitsnachweis** (§33 Abs. 2, requestable earliest ~Oct 2028); the old **€50k/€100k ceilings are not superseded** but survive as §45 Abs. 4's lower tier for procedural breaches (core-duty ceilings are §45 Abs. 2/3, "up to" €10M/2% and €7M/1.4%); **supervision/enforcement re-cited from §45 to §38/§39**; and the fining authority (**Bezirksverwaltungsbehörde, §44 Abs. 1**) plus size-independent designation (**§26**) resolved from `[NEEDS VERIFICATION]`. A second pass added three more: **§46 exempts public-administration bodies from the §45 fine regime** ("abweichend von § 45" — Bescheid plus remediation deadline, then publication if unremedied; no fine), which matters because public administration is in scope (§2 Z 10) and the command is offered for it; **§33 Abs. 2 gives Essential entities only two months** for the operative/organisational proof against the general two-year window; and **§44 Abs. 7 bars a NISG fine** where the DSB has already fined the same conduct under Art. 58(2)(i) GDPR. `/arckit:at-bvergg` thresholds updated to the 22 Oct 2025 regulations, each tier citing its own instrument — (EU) 2025/2152 for the classical sectors, **(EU) 2025/2150 for Sektorenauftraggeber (the €432k figure)**, (EU) 2025/2151 for concessions — and fully aligned to the Vergaberechtsgesetz 2026 (BGBl. I Nr. 8/2026, in force 1 Mar 2026; eForms from 1 Oct 2026) — permanent Direktvergabe limits (supplies/services €143k, works €200k; ≥3 offers documented from €50k), harmonised Ausschlussgründe/Selbstreinigung, eForms below-threshold, tiered Nachprüfungs fees; BVERGG doc-type label updated (closes #708). `/arckit:at-dsgvo` now flags §§12–13 DSG as contested (BVwG vs OGH), records the §30 Abs 5 DSG public-authority fine exemption, and fixes three wrong citations (§2d DSG → §7 DSG / §2d FOG; §109 TKG 2021/€37k → §188 TKG 2021/€75k; §96a → §96 Abs 1 Z 3 vs §96a ArbVG). Guide `docs/guides/at-nisg.md`, the AT `quality-checklist.md` and `.arckit/templates/at-*` updated in lockstep.

## [6.7.5] — 2026-07-28

### Fixed

- **The Build Provenance block failed markdownlint in every artefact the plugin stamps.** `provenance-stamp.mjs` emitted its preamble as `_Stamped automatically by …_`, and MD049 is configured to `asterisk`. Since the hook appends that block to every artefact written under `projects/**`, the violation reached each one — so anyone linting their own artefacts saw a failure ArcKit itself had introduced. Now emitted with asterisk emphasis, with `tests/plugin/provenance-emphasis.test.mjs` asserting the preamble both opens and closes on `*` (#701).

  The same defect existed independently in the Codex extension's hand-maintained `arckit-codex-hook.mjs`, which carries its own stamp string; both are fixed and both are covered by the test.

## [6.7.4] — 2026-07-28

No plugin changes. Commands, agents, skills, hooks, templates, MCP servers and
configuration are byte-identical to 6.7.3; the version moves only because the
CLI, plugin and all seven generated extensions ship in lockstep.

The release covers repository and site maintenance only — three contributors
who were credited in the CHANGELOGs but missing from `docs/contributors.html`,
and a new CI guard that fails the build when that happens again. See the root
`CHANGELOG.md` for detail.

## [6.7.3] — 2026-07-28

### Fixed

- **`evolve` lines carrying a trailing `label` were silently dropped from the generated Mermaid block — a side-effect of the #508 fix.** PR #511 anchored the evolve target at end-of-line to stop `003` being taken as the target in `evolve "Foo (Project 003)" 0.74`. That fix was correct, but the anchor also meant no evolve line with *any* trailing text could match, and `owm-to-mermaid.mjs` skips unmatched lines silently. The label suffix is now an optional non-capturing group, so the #508 anchor holds while labels are tolerated and stripped as they were before #511. Reported by @chrismckelt against 6.7.2 (#693).

  Wider than reported in two ways. First, this is the **documented** syntax, not an edge case: `commands/wardley.md` gives the output template as `evolve {Component Name} {target_evolution} label {label text}`, repeats it in the syntax summary, and uses it in worked examples, and both `wardley-map-template.md` copies follow suit — so a `/arckit:wardley` run that followed ArcKit's own instructions lost *every* evolve line from the Mermaid block while the OWM block above it showed them all. Second, the canonical OWM offset form `evolve X 0.8 label [10, -5]` was dropped too, not just free-text labels.

- **`validate-wardley-math.mjs` was blind to the same lines, so nothing caught the inconsistency at write time.** The hook carried the same end-anchored evolve pattern in two places. A labelled evolve line therefore never landed in the reference list, and an evolve pointing at an undeclared or misspelled component passed validation silently. Both patterns now take the same optional label suffix; the dangling-reference check fires on labelled lines as it always should have (#693).

  No documentation change was needed: `commands/wardley.md` describes the converter as handling "`evolve`-label stripping", which was true before #511 and is true again now. The code was wrong, not the doc.

## [6.7.2] — 2026-07-27

### Fixed

- **Overlay artefacts silently lost their Build Provenance block — a regression introduced in v6.7.1.** The publish-time namespacing rewrite (#685, #686) rewrites every published `.md`, template footers included, so an artefact generated from a published overlay template carries `/arckit-repo:repo-audit`. The footer pattern in `provenance-stamp.mjs` required `:` or `.` immediately after `arckit`, so `arckit-repo:` matched nothing: the command went undetected, its `effort:` was never read, and with no build context the block was skipped entirely. Source-tree runs were unaffected because sources keep the portable `/arckit:X` form, which is exactly why no test caught it. The pattern now accepts an optional `-<namespace>`, verified across `/arckit:adr` (unchanged), the legacy `/arckit.adr` form (unchanged), `/arckit-repo:repo-audit` and `/arckit-uae:uae-ai-charter` (both previously unstamped) (#689).

- **An overlay command's `effort:` could never resolve — pre-existing, all 105 overlay commands.** `readCommandFrontmatter` only ever looked at `<plugin-root>/commands/<name>.md`. Core lives there; overlays do not — in the published layout they nest under the core root, and in the dev tree they are siblings. Command lookup now falls back to a bounded search of both layouts. Bounded deliberately: an unbounded walk inside a PostToolUse hook with a 5s timeout is a bad trade. `/arckit-repo:repo-audit` now resolves `effort: max`, which is the proof that lookup reached the overlay's own plugin rather than falling back to a core default (#689).

- **`update-manifest.mjs` no longer indexes artefacts that git actively ignores.** `docs/manifest.json` is a *published* index, so indexing a gitignored artefact writes a reference to a one-machine-only file into a file everyone fetches, producing a permanent 404. Ignored, **not** merely untracked: a brand-new artefact in a repo that tracks `projects/` is untracked until committed and must still be indexed. Fails open when git is absent or the directory is not a repository, since neither can prove a path is ignored. Ownership of the manifest is now documented in the hook header (#690).

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

- **`arckit-uk-nhs` overlay — UK Data (Use and Access) Act 2025 (DUAA 2025).** DUAA 2025 (c. 18, s121 + Schedule 15) amends the Health and Social Care Act 2012 Part 9 information-standards framework so standards can reach IT, software, interoperability, portability, information access, and security, and introduces the "relevant IT provider" concept. The DCB0129 and DCB0160 `SAFETY.md` anchors gain an **"Applicable standards and assurance domains"** register and a **"Roles and responsibilities"** table, and a new `references/duaa2025.md` generation note (instrument, effect, screening questions) is wired into both commands (#646).
- **`arckit-uk-nhs` overlay — coverage-led hazard discovery.** New `references/hazard-archetypes.md` (17-family hazard taxonomy); the DCB0129/0160 hazard-log step now walks every family and records each as raised or not-applicable, rather than relying on the seeded examples.
- **`arckit-uk-nhs` overlay — review aids.** New `references/nhs-clinical-safety-checklist.md` (roles distinct, no overclaiming, well-formed hazards, DUAA register, no stale references) wired into both commands, plus a rendered "Re-review triggers" subsection in both case templates.

### Changed

- **`arckit-uk-nhs` overlay.** Statutory anchor corrected across commands and templates to "section 250 of the Health and Social Care Act 2012 (Part 9 information-standards framework, as amended by the Data (Use and Access) Act 2025)".
- Corrected two false claims about the bundled MCP servers in the documentation (#653).

### Credits

- NHS DUAA 2025 and clinical-safety reference content are ArcKit-authored adaptations informed by Dr Marcus Baw's SAFETY.md project (CC BY-SA 4.0), <https://github.com/pacharanero/SAFETY.md>.

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
  open-source ArcKit distribution. Its guide now states that it is not
  installable from the public marketplace and that no rights are granted
  without written consent.

### Fixed

- **User-config title validation guard (#639).** Added a test asserting every
  plugin `userConfig` entry declares a `title`, so a missing field fails in CI
  instead of breaking `claude plugin validate` and marketplace installs.
- **Removed DeepBook generated content from the public repository (#650).**
  Book drafts, run checkpoints, and a symlink to an absolute path outside the
  repository had been committed. They are untracked and ignored, restoring a
  green `Lint Markdown` build.

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
  in `config/guide-groups.mjs`, added manifest `section`/`pack` fields, and
  updated Codex Pages coverage so plugin operations and overlay guides no
  longer fall into the generic `Other` bucket.
- **Standalone overlay reference validation.** Updated reference checks and
  shared plugin assets so nested Claude overlay docs resolve bundled and core
  plugin references correctly.

## [6.1.3] — 2026-07-02

### Fixed

- **Codex Pages namespaced invocation (#631).** Updated the generated Codex
  hook bundle so `$arckit-codex:arckit-pages` receives the sync-guides
  statistics required by the pages command.

## [6.1.0] — 2026-06-30

### Added

- **TOGAF ADM and agent architecture overlays.** Added the community
  `arckit-togaf-adm` and `arckit-agent-architecture` plugins, with new recipe
  targets, doc types, templates, generated extension coverage, and marketplace
  wiring.

## [6.0.0] — 2026-06-30

### Added

- **Single Claude Code marketplace repo.** The standalone
  `tractorjuice/arckit-claude` repo now carries the `arckit` core plugin at the
  repo root and all Claude-only overlays under structured `plugin/...` paths,
  including `plugin/uk/finance` and the public-but-proprietary
  `plugin/uk/gcloud`.

### Changed

- **Marketplace metadata.** Updated Claude plugin manifests and marketplace
  entries so new installs use `tractorjuice/arckit-claude` while the monorepo
  remains the development source of truth.

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

### Changed

- **Documentation and extension coverage.** Refreshed ArcKit article indexes,
  getting-started assistant coverage, and generated-extension validation suites
  so plugin-adjacent documentation and release checks stay current.

## [5.15.0] — 2026-06-19

### Added

- **Self-Harness autoresearch implementation.** Added the enhanced
  `program-selfharness.md` autoresearch workflow and supporting tracer,
  weakness-miner, harness-proposer, and harness-validator utilities.
- **Open Knowledge Format interoperability.** Added `/arckit:export-okf` and
  `/arckit:import-okf` commands, Node import/export scripts, shared OKF
  frontmatter helpers, and guide docs. Export creates OKF-compatible copies of
  ArcKit artifacts; import classifies OKF Markdown and materializes safe
  entries as `RSCH` review notes.
- **Optional OKF frontmatter stamping.** `provenance-stamp.mjs` can merge OKF
  frontmatter into native ARC artifacts only when explicitly opted in through
  `ARCKIT_OKF_FRONTMATTER=1` or `.arckit/config.json`.

### Changed

- **OKF documentation coverage.** Updated plugin guide references and copied
  extension documentation so OKF import/export and opt-in frontmatter behavior
  are consistently discoverable.

## [5.14.0] — 2026-06-17

### Added

- **Mistral Vibe CLI extension support (#598).** The converter now emits Vibe
  skills, Vibe agent TOML, runtime assets, references, schemas, and MCP
  configuration from the canonical ArcKit plugin sources. The generated Vibe
  payload is published to the standalone
  [`tractorjuice/arckit-vibe`](https://github.com/tractorjuice/arckit-vibe)
  repository instead of being tracked directly in this repo.

## [5.13.2] — 2026-06-17

### Fixed

- **STALE-EXT scans `external/` recursively (#595).** `/arckit:health` now
  includes files nested under project `external/` subdirectories and reports
  their relative paths, instead of only checking direct children. Session-start
  warnings and project-context external-document listings use the same recursive
  scan.
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

- **Claude Code minimum-version floor raised v2.1.156 → v2.1.172.** v2.1.172 fixed wildcard-domain `WebFetch` permission rules (`WebFetch(domain:*.gov.uk)`) that never matched subdomains on earlier clients — the exact shape ArcKit's security-hooks guide recommends for confining research-agent traffic in OFFICIAL-SENSITIVE deployments, so the floor makes that shipped guidance actually hold. v2.1.172 also carries the Claude Fable 5 runtime (GA in v2.1.170); ArcKit defaults to the latest model tier. Updated `version-check.mjs` (`MIN_CLAUDE_CODE_VERSION` + warning bullets), `CLAUDE.md`, `README.md`, `docs/guides/enterprise-scale.md`, `hooks/README.md`, and the repo/test-repo `.claude/settings.json` `minimumVersion` (#593).

## [5.13.0] — 2026-06-10

### Added

- **arckit-uk-gcloud** (13th marketplace plugin) — Proprietary, Claude-Code-only supplier-side G-Cloud bid-authoring overlay: 11 commands (supplier-profile, service-design, sdd-lot1/2/3, declaration, pricing, security, gcloud-competitors, review, submission-pack), 8 doc-types (SUPP/SVCD/SDD/DECL/PRIC/SECA/GCMP/GCRV), 3 skills (gcloud-framework, cloud-security, sfia-skills), and the uk-gcloud-submission build recipe. Requires arckit core. Ported from the standalone gcloud-kit plugin. Not distributed to the non-Claude extension formats (proprietary).

## [5.12.1] — 2026-06-10

### Fixed

- **Secret scanner reference guard** (#590) — the generic key-value rules in
  `secret-file-scanner.mjs` and `secret-detection.mjs` matched any non-whitespace
  value and so blocked legitimate code/IaC that *references* a secret rather than
  hardcoding it (`secret = module.sm.secret_ids["x"]`, `password = var.db_password`,
  `api_key = process.env.API_KEY`, Pulumi/k8s/CDK references). A structural guard now
  exempts identifier-with-access/call values and `${...}`/`$(...)` interpolations;
  literal secrets and provider token formats are still caught. Both hooks' pattern
  libraries are realigned byte-identical and covered by a new regression test.

## [5.12.0] — 2026-06-09

### Added

- **New `arckit-fde` tooling plugin** ships in the marketplace this release: a lean,
  Claude Code only, white-label Forward Deploy Engineering site generator with one command,
  `/arckit-fde:create`, that interviews the user and renders a brandable, GitHub-Pages-ready
  consulting website into `docs/` (UK Public Sector and Generic presets; `fde-site.config.yaml`
  for repeatable re-renders). The `arckit` core plugin is unchanged — this is a lockstep
  version bump. arckit-fde has no dependencies, no governance doc-types, and is not converted
  to non-Claude formats (Claude Code only).

## [5.11.2] — 2026-06-08

### Changed

- **Generated non-Claude extension dirs moved to `extensions/`** (#588). Repository restructure only — the `arckit-claude` plugin's commands, agents, skills, hooks, templates and config are unchanged, and installation and usage are identical. The Codex/OpenCode/Copilot/Gemini/Paperclip converter outputs now live under `extensions/` instead of the repo root.

## [5.11.1] — 2026-06-07

### Changed

- **Plugin source relocated to `plugins/arckit-claude/`** (#585). Repository restructure only — the plugin's commands, agents, skills, hooks, templates and config are unchanged, and installation and usage are identical. `marketplace.json` now references `./plugins/arckit-claude`.

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

- **AU Federal visual-evidence enrichment** (derived from #569). The `arckit-au` Federal commands and templates compose with the existing architecture/evidence commands (`/arckit:diagram`, `/arckit:dfd`, `/arckit:data-model`, `/arckit:servicenow`, `/arckit:risk`, `/arckit:traceability`, `/arckit:graph-report`, `/arckit:maturity-model`) through embedded enrichment handoffs and an "ArcKit Architecture Evidence Map" section. A standard **Visual Evidence Decision Rule** across all ten Federal templates: generate companion visuals only when the evidence has enough structure for real nodes and relationships; generate a draft visual with `Pending Input` labels when evidence is partial but structurally useful; otherwise record a **Visual Evidence Gap**. Guidance stays cross-sector (SOCI/OT not made energy-specific). The `au-federal` recipe gains default visual/evidence targets and a `graph-report` post-build hook, with synthetic eval fixtures for complete / partial / sparse scenarios.
- **`MMOD` (Maturity Model Assessment) doc-type registered.** `/arckit:maturity-model` has always emitted `ARC-*-MMOD-*` IDs, but `MMOD` was never in `config/doc-types.mjs` or the `/arckit:pages` allow-list, so maturity artefacts were not graph-tracked. Registered as a regime-neutral `Governance` type (severity `HIGH`).

### Fixed

- **`findRepoRoot` no longer mis-detects an unrelated `projects/` directory as the repo root** (#572). Hooks treat a `projects/` directory as the repo root only when it contains a numbered project entry (`NNN` / `NNN-…`); also normalises Windows path separators in `allow-plugin-internals`. Adds a `findRepoRoot` unit test.

### Changed

- **All command cross-references standardised on the colon namespace `/arckit:<command>`** (~5,600 references across ~600 files), matching the official Claude Code plugin invocation syntax and replacing the previous mixed dot-form (`/arckit.<command>`) in templates, guides, scripts and several overlays. Wardley sub-commands keep the dot before the sub-command (`/arckit:wardley.gameplay`); Codex (`$arckit-<command>`) and Copilot (`/arckit-<command>`) forms are unchanged. `CLAUDE.md`, `AGENTS.md` and `CONTRIBUTING.md` corrected. A CI guard (`scripts/standardise-colon.py --check`) prevents regressions.

## [5.9.2] — 2026-06-03

### Fixed

- **`CMPT` and `TNDR` now sequence correctly in `generate-document-id.sh`** (#566). The helper hardcoded `MULTI_INSTANCE_TYPES` without `CMPT` or `TNDR` (both added in 5.9.0), so `/arckit:competitors` and `/arckit:tenders` got document IDs with **no sequence number** (e.g. `ARC-001-CMPT-v1.0`) and collided on every run. `arckit-claude/scripts/bash/` — the copy the plugin cache executes — had drifted from the already-fixed CLI copy, despite the script's "keep in sync with `doc-types.mjs`" comment. Added `TNDR CMPT` after `DSCT` to match `config/doc-types.mjs MULTI_INSTANCE_TYPES`. The converter regenerates the codex / copilot / opencode / gemini copies.

## [5.9.1] — 2026-06-03

### Fixed

- **All MCP-backed subagents can now reach their plugin MCP servers** (#564, #565). `/arckit:tenders` + `/arckit:competitors` (#564) and every other MCP-backed agent (#565) were degrading because their subagents could not call the bundled MCP servers. Two root causes, both required, confirmed against the Claude Code docs:
  - **Tool-name prefix.** Plugin-bundled MCP tools surface at runtime as `mcp__plugin_arckit_<server>__<tool>`; the agents' `tools:` allowlists used the bare `mcp__<server>__` form, which matches nothing. Prefixed the tool names in 8 agents: `arckit-tenders-reader` (#564) plus `arckit-aws-research`, `arckit-azure-research`, `arckit-gcp-research`, `arckit-gov-code-search`, `arckit-gov-landscape`, `arckit-gov-reuse-reader`, `arckit-datascout-reader` (#565).
  - **Deferred servers don't reach subagents.** A deferred (non-`alwaysLoad`) plugin MCP server is not injected into subagent context, so a subagent needs `alwaysLoad: true`. Added `alwaysLoad` to `uk-tenders` (#564), `govreposcrape`, `google-developer-knowledge` and `datacommons-mcp` (#565), joining `aws-knowledge` / `microsoft-learn`. For the keyed servers, a keyless session attempts the connection at startup; per the docs an auth failure marks the server failed and the session continues, bounded by the 5s connect timeout. `tools:` and `alwaysLoad` are Claude-only, so the converter produces no extension changes.

### Changed

- Documentation: per-page canonical / Open Graph metadata for arckit.org viewers and the `pages-template.html` head (#561); corrected the `/arckit:start` workflow-trigger note for the Claude Code v2.1.160 `workflow` → `ultracode` keyword rename (#560).

## [5.9.0] — 2026-06-02

### Added

- **`/arckit:competitors` — Competitor Landscape** (#556). Rival suppliers, awarded-value market share, head-to-head and concentration analysis from the same ~677,000 UK contracting processes as `/arckit:tenders`. Shares the `arckit-tenders-reader` subagent (same MCP reader, different orchestrator/writer lens); a new `arckit-competitors-writer` agent renders the `CMPT` artefact. Feeds into `risk` (supplier-concentration/single-supplier-dependency risk), `sobc` (market-context benchmark), `research` (award-evidence grounding), `score` (Company Experience evidence) — all regime-gated handoffs under `governance_framework: UK Gov`.
- **Assurance wiring — TNDR/CMPT artefacts** (#556). Four existing commands now consume TNDR and/or CMPT artefacts as optional inputs: `risk` (supplier-concentration risk section, reads nearest `ARC-*-TNDR-*.md` + `ARC-*-CMPT-*.md`), `sobc` (Economic Case market-context benchmarks from TNDR/CMPT), `research` (award-evidence grounding in the build-vs-buy agent — added TNDR/CMPT to `arckit-research` and the `arckit-research-reader` tool allowlist), `score` (Company Experience evidence in the vendor-evaluation scorecard via CMPT award history). All wiring is regime-gated (`governance_framework: UK Gov`); all handoffs declared in the producing commands' `handoffs:` frontmatter and in the consuming commands' `## Context` blocks.
- **`/arckit:tenders` — Procurement Market Intelligence** (#556). Award-value benchmarks, top suppliers, incumbency and concentration from ~677,000 UK contracting processes (Find a Tender Service, Contracts Finder, Public Contracts Scotland, Sell2Wales, eTendersNI). Three-tier reader/orchestrator/writer subagent split; reader (`arckit-tenders-reader`) allowlists 7 read-only `uk-tenders` tools; `query_sql` never allowlisted (prompt-injection surface). Outputs `TNDR` artefact; feeds into `sobc` (Economic Case benchmarks), `risk` (concentration risk), `research` (build-vs-buy context). Shares `arckit-tenders-reader` with `/arckit:competitors`.
- **`uk-tenders` bundled MCP server** (#556). Keyless `http` MCP added to `.mcp.json` at `https://tenders.run.cns.me/mcp`, deferred (no `alwaysLoad`). `mcp__uk-tenders__` prefix added to `hooks/allow-mcp-tools.mjs`. 11 tools exposed; 7 allowlisted by `arckit-tenders-reader`; `query_sql` documented-only and never allowlisted. Nightly refresh, best-effort single Cloud Run, no formal SLA. Data re-published under OGL v3.0.
- **`TNDR` + `CMPT` doc-types** (#556). Registered in `config/doc-types.mjs` and `commands/pages.md`. Both now live.

## [5.8.0] - 2026-06-01

### Added

- **govreposcrape dependency-intelligence tools wired into the gov agents** (#551). `dependency_compare` → `arckit-gov-reuse` (pairwise dependency-overlap between candidate repos; orchestrator collapses near-duplicates/forks at ≥60% overlap; new **Dependency Overlap Analysis** section). `vulnerability_exposure` → `arckit-gov-landscape` (CVE blast-radius across an org's major packages via the SBOM graph + live OSV.dev, plus end-of-life flags; new **Supply-Chain & Vulnerability Exposure** section). Both added to the respective agents' `tools:` allowlists; `docs/MCP-CATALOGUE.md` refreshed to all 9 govreposcrape tools (17 of 23 consumed).
- **Registry support for the Australian critical-infrastructure + energy overlays.** `config/doc-types.mjs` + `commands/pages.md` register `AUOT`, `AUSOCI` (#539) and `AUAESCSF`, `AUENERGY` (#553) — all regime `AU`, HIGH severity. `skills/arckit-build/SKILL.md` adds the `au-energy` recipe row. The commands themselves ship in the `arckit-au` and `arckit-au-energy` overlay plugins.

### Fixed

- **Windows path handling in plugin hooks** (#548). `hooks/allow-plugin-internals.mjs` normalises `\` → `/` before the plugin-root prefix check (no-op on POSIX) so the `isUnderPluginRoot` gate works on Windows; the generated Codex hook gets the same fix. The `test-doc-types-dual-registration.mjs` validator imports `doc-types.mjs` via `pathToFileURL()` for Windows ESM compatibility.

## [5.7.0] - 2026-05-29

### Fixed

- **US regime now registered** in `config/doc-types.mjs` `REGIMES` + `REGIME_LABELS` (#545). `regime: 'US'` was declared on 10 doc-types but the regime code was absent from both exports, so `hooks/graph-inject.mjs` (which iterates `REGIMES`) silently omitted US compliance artefacts (FedRAMP/FISMA/NIST 800-53/CISA Zero Trust/etc.) from the governance-context presence listing and readiness scorecard. Added `'US'` + `US: 'USA Federal'`.

### Added

- **Regime-registration guard test** (`scripts/tests/test-regime-registration.mjs`, CI-enforced): every declared doc-type `regime:` must be registered in `REGIMES` and `REGIME_LABELS`. Closes the gap that let the US (and earlier CA) regime omissions ship silently.

## [5.6.0] - 2026-05-29

### Changed

- **Minimum Claude Code version bumped to v2.1.156** (from v2.1.144) in `hooks/version-check.mjs`. Floor justifications: the **v2.1.156** Opus 4.8 thinking-block API-error fix (affects `/arckit:*` commands and research agents using extended thinking) and **v2.1.154** Opus 4.8 GA + `defaultEnabled` plugin manifest field. Added matching lines to the version-warning message and header comment.
- **Opus 4.7 → Opus 4.8 doc refresh** (items 43/44 of #522): `CLAUDE.md` `effort:`/`xhigh` and `/fast` backing-model references updated to Opus 4.8; `docs/guides/start.md` token-constrained recommendation updated to "Opus 4.7 or 4.8".

### Added

- **`defaultEnabled: false` on all 9 community overlays** (`arckit-uae`, `arckit-fr`, `arckit-ca`, `arckit-eu`, `arckit-at`, `arckit-au`, `arckit-us`, `arckit-uk-finance`, `arckit-uk-nhs`), adopting the Claude Code v2.1.154 manifest field. Marketplace install surfaces the overlays without auto-enabling all nine; core `arckit` stays default-enabled. Addresses item 42 of #522.

### Fixed

- **UK accessibility target corrected from WCAG 2.1 AA to WCAG 2.2 AA** across `commands/service-assessment.md` (5 references), `commands/backlog.md`, and the `requirements`, `sow`, `research-findings`, `platform-design`, and `backlog` templates. UK public sector bodies are monitored against WCAG 2.2 AA — the *Public Sector Bodies Accessibility (Amendment) (EU Exit) Regulations 2022* (SI 2022/1097) replaced the fixed WCAG version with a rolling reference to the latest published version (currently 2.2). Jurisdictional overlays intentionally unchanged (FR `fr-dinum` and CA `ca-gc-digital-standards` correctly remain on 2.1; AU `au-dss` already on 2.2). (#542)

See the root [`CHANGELOG.md`](../CHANGELOG.md) for the cross-repo scope.

## [5.5.0] - 2026-05-28

### Brand reposition

Plugin slice of the v5.5.0 ArcKit rebrand. No functional changes to commands, agents, hooks, recipes, or skills.

### Changed

- **`arckit-claude/.claude-plugin/plugin.json` description**: now reads "The Enterprise Architecture Governance Harness - 70 slash commands across strategy, architecture, delivery, and assurance".
- **`arckit-claude/README.md`** headline: updated to new tagline + four-bucket category line.
- **Start guide** (`arckit-claude/docs/guides/start.md`): updated banner-output mockup to the new tagline.

See the root [`CHANGELOG.md`](../CHANGELOG.md#550--2026-05-28) for the full rebrand scope (logo family, OG card, favicons, category positioning, and the brand sweep across the entire repository).

## [5.4.0] - 2026-05-27

### Fixed

- `notify-stale-artifacts.mjs` now reads the `desktop_notifications` userConfig value from the `CLAUDE_PLUGIN_OPTION_DESKTOP_NOTIFICATIONS` env var instead of via `${user_config.*}` argv substitution in `hooks.json`. The argv substitution path aborted the hook with `plugin option "desktop_notifications" isnt set` on fresh installs where the user had never opened plugin configuration, even with `"default": "false"` declared on the userConfig field. The env-var path is documented as the parallel access mechanism ("All values are exported to plugin subprocesses as `CLAUDE_PLUGIN_OPTION_<KEY>` environment variables") and degrades cleanly to `undefined` when the field is unset. The `"default": "false"` declaration is retained as a UX nicety for the configuration prompt.
- `hooks/sync-guides.mjs` now surfaces NHS clinical-safety artefacts in the manifest. Marcus Baw's `SAFETY.md` / `SAFETY-CASE.md` / `HAZARD-LOG.md` files (and the `clinical-safety/deployment/` companions from `/arckit:uk-nhs-dcb0160`) deliberately skip the `ARC-` prefix, so they were excluded by the project scanner. The hook now picks up any `.md` file in `projects/{NNN}/clinical-safety/` and `projects/{NNN}/clinical-safety/deployment/`, attaches them to the project's documents list with category `Clinical Safety` and the file's first heading as title. Filenames are preserved verbatim.

### Added

- **Two new doc-type codes** in `config/doc-types.mjs`: `NHSDTAC` (NHS Digital Technology Assessment Criteria v3), `NHSMDR` (UK MDR + EU MDR SaMD/AIaMD Classification). Required by the new `arckit-uk-nhs` community plugin. Both regime `UK`, category `Compliance`, severity `HIGH`.
- **New recipe** `skills/arckit-build/recipes/uk-nhs-clinical-safety.yaml` (44 targets across 8 build waves, composes with `uk-saas` baseline). Consumed by `arckit-uk-nhs`.

### Note

The new `arckit-uk-nhs` community plugin ships 4 commands and uses the 2 doc-type codes and 1 recipe registered here in core. Marcus Baw's `SAFETY.md` / `SAFETY-CASE.md` / `HAZARD-LOG.md` files deliberately do NOT carry doc-type codes — they bypass `validate-arc-filename` and are cross-referenced by relative path.

## [5.3.0] - 2026-05-27

### Added

- **Four new doc-type codes** in `config/doc-types.mjs`: `FSSCA` (SCA-RTS exemption design), `FSSAFE` (Safeguarding assessment), `FSCD` (Consumer Duty), `FSCTP` (Critical Third Parties). Required by the new `arckit-uk-finance` community plugin.
- **New recipe** `skills/arckit-build/recipes/uk-fs-payments.yaml` (multi-wave UK finance payments modernization). Consumed by `arckit-uk-finance`.

### Note

The new `arckit-uk-finance` community plugin ships 4 commands and uses the 4 doc-type codes and 1 recipe registered here in core. Core plugin version remains aligned with all community-plugin versions.

## [5.0.5] - 2026-05-23

### Fixed

- `owm-to-mermaid.mjs` no longer mis-parses `evolve` lines whose quoted component name contains an embedded number (#508). The target-evolution regex is now anchored at end-of-line.
- `owm-to-mermaid.mjs` now passes inline `(build)` / `(buy)` / `(outsource)` decorators through to the Mermaid output (#508), alongside the existing `(inertia)` support. Standalone `build "<Name>"` / `buy "<Name>"` / `outsource "<Name>"` directives are no longer required for sourcing decorators on the converted map.
- `/arckit:health` now flags **DRAFT staleness** and **overdue reviews** — the two signals the session-start `stale-artifact-scan` monitor was already reporting (#509). New detection rules `STALE-DRAFT` (MEDIUM, threshold `STALE_DRAFT_DAYS=30` by default, configurable per invocation) and `REVIEW-OVERDUE` (HIGH, skips DRAFT/SUPERSEDED/ARCHIVED). The monitor's draft threshold moves from 14 days to 30 to align with the new rule. `docs/health.json` `byType` now always includes both new rule IDs (0 when there are no findings).

## [5.0.4] - 2026-05-22

### Added

- **Opt-in OWM label tidying** for `/arckit:wardley`. New `--tidy-owm` flag rewrites the canonical ` ```wardley ` (OnlineWardleyMaps) block's component `label [x, y]` offsets so labels do not overlap when rendered at <https://create.wardleymaps.ai>. Backed by `owm-tidy.mjs` — a sibling of the mermaid `wardley-tidy.mjs` that reuses the same placement engine with the OnlineWardleyMaps renderer geometry (recovered from `tractorjuice/onlinewardleymaps`). Opt-in by design: the OWM block is the author-edited source of truth and OWM is an interactive drag editor, so it is never rewritten by a silent hook (unlike the Mermaid `wardley-beta` block). Collision-free authored offsets are kept; only overlapping or untuned labels move.

## [5.0.3] - 2026-05-22

### Added

- New `hooks/tidy-wardley-labels.mjs` PostToolUse hook, plus the `hooks/wardley-label-placement.mjs` placement engine and `hooks/wardley-tidy.mjs` driver. After a Write/Edit touches a file containing a Mermaid `wardley-beta` block, the hook rewrites each component label's offset into a scored, non-overlapping slot. The placement engine is pure and deterministic — 32 candidate slots per label, weighted collision scoring, most-constrained-first ordering, idempotent output (#506).

### Documentation

- `hooks/README.md` documents the new `tidy-wardley-labels` hook; `docs/guides/wardley.md` notes the auto-tidy behaviour (#506).

## [5.0.2] - 2026-05-19

### Added

- New `hooks/notify-stale-artifacts.mjs` SessionStart hook. Opt-in `terminalSequence` (Claude Code v2.1.141+) desktop notifications when `detect-stale-artifacts.sh` reports overdue artefacts at session start. Stacks OSC 9 (iTerm2 / Windows Terminal / WezTerm / ConEmu) and OSC 777 (urxvt / Ghostty / Warp) escapes; terminals silently drop unsupported codes per the documented allowlist. Gated on `${user_config.desktop_notifications} == "true"` via the `--enabled=` arg so the disabled path is a fast no-op (#497).
- New `desktop_notifications` userConfig string field. Set to `"true"` to enable the SessionStart desktop notification hook above (#497).

### Documentation

- `hooks/README.md` documents the new `notify-stale-artifacts.mjs` hook and its OSC stacking strategy (#497).
- All 6 community-overlay READMEs (`arckit-uae`, `arckit-fr`, `arckit-ca`, `arckit-eu`, `arckit-at`, `arckit-au`) call out the v2.1.143 plugin dependency enforcement so users know `claude plugin disable arckit` will warn while an overlay is enabled (#497).

## [5.0.1] - 2026-05-19

### Changed

- **Minimum Claude Code version bumped to v2.1.144** (from v2.1.139). The new floor pulls in three concrete improvements relevant to ArcKit:
  - **v2.1.143 plugin dependency enforcement** — `claude plugin disable arckit` now surfaces a copy-pasteable disable-chain hint when a community overlay (`arckit-uae`, `arckit-fr`, `arckit-ca`, `arckit-eu`, `arckit-at`, `arckit-au`) depends on it, instead of silently breaking the overlay.
  - **v2.1.144 plugin monitor / session-title fix** — direct fix for a bug where ArcKit's `stale-artifact-scan` background monitor's description leaked into new-session titles instead of the user's first prompt.
  - **v2.1.144 headless Skill-tool permission fix** — `/arckit:*` commands run via `claude -p` / CI were failing with permission errors on v2.1.141–v2.1.143 (regression in v2.1.141).
- `arckit-claude/hooks/version-check.mjs` rationale list extended with the three new entries above.

### Added

- `skills/arckit-build/SKILL.md` — new "Pairing with `/goal`" section documenting how to compose Claude Code's `/goal` command (v2.1.139+) with `/arckit:build` recipes for build-until-APPROVED, refresh-stale-slice, and drive-to-GA loops. Includes the Claude-only caveat and v2.1.143 Stop-hook block-cap interaction note.

### Fixed

- `CLAUDE.md` Agent System section — corrected agent count from "13" to **16** (10 single-tier + 6 reader/writer subagents). Adds a "Reader/writer subagents" paragraph explaining the three-tier orchestrator pattern (`datascout`, `grants`, `gov-reuse` each ship a `-reader` and `-writer` internal subagent per `READER-PATTERN.md`).
- `README.md` "Why v2.1.144?" callout — agent count corrected (13 → 16); rewritten from the prior "Why v2.1.139?" version with v2.1.143/144 context prepended.

## [5.0.0] - 2026-05-18

### BREAKING

- **Plugin split**: the `arckit` core plugin now ships only the 71 official-baseline commands. 46 community-overlay commands move to five new marketplace plugins: `arckit-uae` (12), `arckit-fr` (12), `arckit-ca` (12), `arckit-eu` (7), `arckit-at` (3). Install them alongside `arckit` to restore the previous full surface. See root `CHANGELOG.md` for the migration story.

### Added

- `hooks/v5-migration-banner.mjs` — one-shot SessionStart hook that reads `.arckit/manifest.json` and prints install suggestions for the jurisdictions a project previously used.

### Changed

- `skills/arckit-build/SKILL.md` — three-tier recipe lookup (project → core → sibling community plugins). Built-in recipes table gains a Plugin column and adds `ca-federal-fitaa` (previously missing despite shipping in v4.15.0).
- `config/doc-types.mjs` — single source of truth for ALL doc-type codes, including codes used by community-plugin commands. Adding a community command that emits a new code requires a two-part PR (see root `CONTRIBUTING.md`).
- All `uae-*`, `fr-*`, `ca-*`, `eu-*`, `at-*` commands, templates, and recipes are no longer shipped by the core plugin — moved to their respective community plugins.

## [4.22.0] - 2026-05-17

### Added

- **New `arckit-build` recipe: `uae-agentic-transformation`** (49 targets). Purpose-built for the 23 April 2026 UAE Cabinet framework on agentic AI (50% of federal services autonomous by April 2028). Distinct from the broader `uae-federal-ai` recipe — ADRs reshaped around agentic architecture: cloud + sovereign hosting, UAE Pass identity, agent orchestration framework, human-in-the-loop boundaries, foundation-model selection per classification, observability for autonomous decisions, rollback / kill-switch, federal procurement. `UAE_ZERO_BUREAUCRACY` positioned as the framework-mandated process-redesign artefact. `PLAN` + `ROADMAP` args carry `timebox=24-months target-date=2028-04-23 portfolio-target=50-percent-services-agentic`. Includes all 12 UAE community commands. Uses canonical doc-type codes from `config/doc-types.mjs` (`NPRA`, `AICH`, `AUTI`, `CLAS`, `PDPL`, `CRES`, `UPASS`, `DSHR`, `DREC`, `ZBUR`, `IAS`, `FPRO`). Registered in `arckit-claude/skills/arckit-build/SKILL.md` built-in recipes table.

## [4.21.0] - 2026-05-15

### Added

- **`postcompact-rehydrate.mjs` PostCompact hook re-injects project context after compaction** (#472). Fires after `/compact` or auto-compaction; emits the same project inventory + artifact listings + external documents + global policies that the `UserPromptSubmit` hook produces, so the summary doesn't drop filesystem-derived state until the user types the next `/arckit:` prompt. Reuses `buildProjectContext` from `project-context-builder.mjs` — no new marker-file convention; the filesystem is the source of truth. Companion to `keep-coding-instructions: true` (v2.1.94), which preserves static command bodies but not dynamic state.
- **`session-learner.mjs` and `telemetry.mjs` capture session effort level** (#215 item #27). Claude Code v2.1.133 started passing `effort.level` in hook input JSON and `$CLAUDE_EFFORT` as an env var. The effort tier is now recorded on every telemetry JSONL record (`hook_duration`, `mcp_call`, `agent_spawn`) and on every `.arckit/memory/sessions.md` entry, plus the `docs/telemetry.json` per-session record. Enables effort-aware p95 comparison (e.g. `xhigh` vs `max` for the same tool) and supports the Phase 5 audit of which `effort: max` commands could be downgraded. Silently omitted on older clients or when no explicit effort was set.
- **Effort mix surfaced on the `/arckit:pages` dashboard.** The Session Telemetry panel now shows an "Effort mix" row (e.g. `high: 4 · max: 2`) aggregated across the last 10 sessions, and each row in the Recent Sessions list carries an effort-tier chip next to the session type. Rendered only when at least one session has an effort tag — pre-v2.1.133 captures degrade gracefully to the previous layout.

### Changed

- **All 16 hook entries in `hooks.json` migrated to `args: string[]` exec form** (#215 item #24). Claude Code v2.1.139 added the exec form (`command: "node"` + `args: ["..."]`) as an alternative to the legacy single-string `command: "node /path/to/x.mjs"`. The harness now execs the binary directly instead of parsing a shell-quoted command line, eliminating shell-quoting / metacharacter pitfalls in `${CLAUDE_PLUGIN_ROOT}`-substituted paths. `arckit-claude/hooks/README.md` and `docs/PLATFORM-COMPARISON.md` document the new form.
- **All 4 PostToolUse hook entries set `continueOnBlock: true`** (#215 item #25). Claude Code v2.1.139 added `continueOnBlock` so observational PostToolUse hooks (`update-manifest`, `provenance-stamp`, `telemetry`) cannot derail the user's turn if they ever emit `decision: "block"`. None of these hooks currently emit `block`, but the flag closes off a regression class — a future bug or schema-rejection won't stop the conversation, and the block decision remains logged by the harness for diagnosis. Block-as-gate semantics retained for genuine PreToolUse / UserPromptSubmit guards (`file-protection`, `secret-detection`, `validate-arc-filename`).
- **Minimum Claude Code version bumped to v2.1.139** (from v2.1.129). Required by the `args` exec form and `continueOnBlock`. Also picks up v2.1.133 subagent skill discovery fix (relevant to ArcKit's 13 agents) and v2.1.136 SessionStart env staleness fix (relevant to the `inject-arckit-context` pattern). SessionStart `version-check.mjs` hook updated.

## [4.20.3] - 2026-05-11

### Fixed

- **Plugin `monitors` key wrapped under `experimental` block** (#453). Claude Code v2.1.129 moved the `monitors` (and `themes`) keys under a top-level `experimental` block in plugin manifests. The `stale-artifact-scan` background monitor was declared at the top level and would not load on v2.1.129+ clients.
- **`validate-arc-filename` hook soft-blocks via `{decision, reason}` JSON** (#454). The unknown-doc-type-code rejection path migrated from `process.exit(2)` + stderr to the modern soft-block pattern so the rejection reason is fed back to the model and Claude can self-correct (rename to a valid type code and retry) without human intervention.

### Changed

- **Minimum Claude Code version bumped to v2.1.129** (from v2.1.121). Required by the `monitors`-under-`experimental` migration. Also picks up the v2.1.129 fix to `ENABLE_PROMPT_CACHING_1H` (1-hour prompt cache TTL was being silently downgraded to 5 minutes on earlier versions). SessionStart `version-check.mjs` hook updated.

## [4.20.2] - 2026-05-11

### Changed

- **Wardley Mermaid rendering now targets Mermaid 11.15.0.** Generated pages load `mermaid@11.15.0`, picking up the latest `wardley-beta` fixes for unquoted hyphenated component names and Wardley label text handling. Wardley commands, guides, templates, and the OWM converter notes now keep generated names quoted for compatibility with both Mermaid 11.14.0 and 11.15.0.

## [4.20.0] - 2026-05-10

### Changed

- **Extension release sync for Codex plugin packaging.** Regenerated downstream extension formats from the shared ArcKit command sources and release tooling. Claude plugin runtime behavior is unchanged; this release primarily adds Codex plugin hooks, metadata, schemas, and standalone packaging in the generated Codex distribution.

## [4.19.2] - 2026-05-07

### Changed

- **`/arckit:wardley` now uses a vendored OWM → wardley-beta converter.** Adds `arckit-claude/scripts/owm-to-mermaid.mjs`. Replaces 30 lines of hand-rolled syntax-translation rules in `commands/wardley.md` with a three-step procedure that runs `node ${CLAUDE_PLUGIN_ROOT}/scripts/owm-to-mermaid.mjs <owm-file>` and pastes the output. Eliminates the failure modes of hand-emitted `wardley-beta` (hyphens lexed as `->`, bare numeric words `NIS 2031` mistaken for literals, `label`/`evolve`/`pipeline` matched as keywords at word boundaries). Converter quotes every name as a STRING and handles pipeline child detection, `evolve`-label stripping, and sourcing-decorator pass-through.

## [4.19.1] - 2026-05-07

### Fixed

- **`allow-plugin-internals.mjs` regex covers hyphenated agent names.** Pattern segment for the agent name was `[a-z][a-z0-9]*` (no hyphens), so `/tmp/gov-reuse-handoff*.json` and any future `aws-research-handoff*.json` / `gov-code-search-handoff*.json` failed to match, prompting on every per-capability tempfile read. Widened to `[a-z][a-z0-9-]*` while preserving negative-case rejection (paths starting with hyphen, hidden files, files outside /tmp).

## [4.19.0] - 2026-05-07

### Added

- **`/arckit:gov-reuse` reader/orchestrator/writer split.** Third command after `/arckit:datascout` and `/arckit:grants` to adopt the three-tier subagent pattern from `arckit-claude/agents/READER-PATTERN.md`. New files: `arckit-claude/agents/arckit-gov-reuse-{reader,writer}.md`, `arckit-claude/schemas/gov-reuse-handoff.schema.json`, `arckit-claude/schemas/scoring-rubrics/gov-reuse-{generic,uk-gov}.yaml`, `tests/plugin/fixtures/gov-reuse-handoff/` (2 valid + 5 reject), `tests/plugin/test_validate_gov_reuse_handoff.mjs`. The orchestrator body in `commands/gov-reuse.md` validates each reader payload via `validate-handoff.mjs`, scores deterministically from the chosen rubric, maps the score to a reuse-strategy band (Fork ≥ 80 / Library 60-79 / Reference 40-59 / None < 40 with AGPL/Proprietary/Unlicensed force-overrides), then dispatches the writer.
- Reader has only `Read`/`Glob`/`Grep`/`WebFetch`/`TodoWrite`/`mcp__govreposcrape__search_uk_gov_code` (no Write/Edit/Bash/Agent/WebSearch); writer has only `Read`/`Write`/`Edit`. Schema has no `score`, `rank`, or `recommended_strategy` field — there is nowhere for a judgement to land.
- UK-Gov rubric overlay adds `trusted_org_bonus` for known UK Gov orgs (alphagov, NHSDigital, dfe-digital, hmrc-digital, ministryofjustice, ONSdigital, etc.) applied additively to `code_quality` before weighting.

### Removed

- Single-tier `arckit-claude/agents/arckit-gov-reuse.md`. The orchestrator role moved to the slash command body (where the `Agent` tool is available); reader and writer are subagent files.

## [4.18.2] - 2026-05-07

### Added

- **PreToolUse hook on `Agent` tool dispatches injects ArcKit project context.** UserPromptSubmit hooks don't fire on Skill/Agent dispatch — subagents run in isolated contexts and inherit only the explicit `prompt` field passed in. Any orchestrator-style ArcKit subagent that assumed the project-context block was already in scope (because the slash command body says so) lost that context when invoked indirectly. The new `inject-agent-context.mjs` hook (matcher: `Agent`) prepends the same context block to `tool_input.prompt` via `updatedInput`, scoped to `arckit-*` subagent_types and skipping reader/writer tiers. Project-scanning logic lives in a new shared `project-context-builder.mjs` so both hooks produce identical output.

## [4.18.1] - 2026-05-07

### Fixed

- **`allow-plugin-internals` hook recognises per-bucket grants tempfiles.** The orchestrator dispatches the reader once per `funder_category`, and the LLM names each tempfile with the bucket suffix (e.g. `/tmp/grants-handoff-open-data.AbCdEf.json`) for traceability across the run. The previous regex required either the literal `datascout-handoff` prefix or the `arckit-{name}-handoff` form, neither of which matched. Broadened to `(?:arckit-)?[a-z][a-z0-9]*-handoff(?:-[a-z][a-z0-9-]*)?...` — covers existing datascout patterns, the bare grants form, and per-bucket suffixes for any future agent.

## [4.18.0] - 2026-05-07

### Added

- **`/arckit:grants` reader/orchestrator/writer split** — second command after `/arckit:datascout` to adopt the three-tier subagent pattern from `arckit-claude/agents/READER-PATTERN.md`. New files: `arckit-claude/agents/arckit-grants-{reader,writer}.md`, `arckit-claude/schemas/grants-handoff.schema.json`, `arckit-claude/schemas/scoring-rubrics/grants-{generic,uk-gov}.yaml`, `tests/plugin/fixtures/grants-handoff/` (2 valid + 5 reject), `tests/plugin/test_validate_grants_handoff.mjs`. The orchestrator body in `commands/grants.md` validates each reader payload via `validate-handoff.mjs`, scores deterministically from the chosen rubric, dispatches the writer. Reader has only `WebSearch`/`WebFetch`/`Read`/`Glob`/`Grep`/`TodoWrite` (no Write/Edit/Bash/Agent); writer has only `Read`/`Write`/`Edit`. Schema has no `score`/`rank`/`recommendation` field — there is nowhere for a judgement to land.

### Removed

- Single-tier `arckit-claude/agents/arckit-grants.md`. The orchestrator role moved to the slash command body (where the `Agent` tool is available); reader and writer are subagent files.

## [4.17.1] - 2026-05-06

### Fixed

- **`/arckit:pages` dashboard now enumerates data-source profiles.** v4.17.0 introduced `projects/{P}-{NAME}/data-sources/{provider-slug}-profile.md` files but the pages pipeline was unaware of them: the `sync-guides` hook didn't scan that directory, the manifest had no `dataSourceProfiles` array, the dashboard sidebar / search index / category chips didn't render them, and `llms.txt` didn't list them. Wired through:
  - `sync-guides.mjs` — initialises `project.dataSourceProfiles[]`, scans `projects/*/data-sources/*-profile.md`, populates titles from first heading or slug, deletes empty arrays, increments `dataSourceProfileCount`, lists profiles in `llms.txt` per project.
  - `pages-template.html` — adds a "Data Source Profiles" category to the search index and a sidebar section under each project (rendered via the shared `renderVersionedDocList`).
  - `pages.md` — updates the manifest schema example, the artefact-types table, and the KPI summary to include the new category.

## [4.17.0] - 2026-05-06

### Added

- **Datascout now spawns per-source profile files**, mirroring the `Spawned Knowledge` pattern from `/arckit:research`. The writer subagent renders one `projects/{P}-{NAME}/data-sources/{provider-slug}-profile.md` per scored data source in addition to the main DSCT artefact. Each profile carries:
  - The full evidence subtree (hosting country, certifications, licence type, pricing model, rate limit, refresh cadence, auth method, contract vehicles, supported data categories) with citation links to the URL where each fact was fetched from.
  - The deterministic weighted score (per-criterion breakdown + total) computed from the rubric YAML.
  - The list of project requirement IDs that pointed to this source via the trigger-keyword map.
  - Document Control metadata + Revision History.
- New template `arckit-claude/templates/data-source-profile-template.md`.
- Re-run safety: when `/arckit:datascout` runs again on the same project and finds an existing profile, the writer applies merge rules (Overview prose preserved; Evidence + Score replaced with current run; `Projects Referenced In` appended; `Revision History` gets a new row).
- Orchestrator's Step 9 input shape now carries `score_breakdown`, `total_score`, `requirements_matched` per scored source, and `mkdir -p`s `data-sources/` alongside `research/` before dispatching the writer.

## [4.16.6] - 2026-05-06

### Fixed

- **Telemetry now collects in plugin-only test repos** (no `.arckit/` directory). `telemetry.mjs` and `session-learner.mjs` previously gated on `isDir('.arckit')` and exited silently for any repo without it — meaning every test repo where the user installed the plugin via `extraKnownMarketplaces` (without ever running `arckit init`) had zero telemetry data, no session summaries, and an empty `docs/telemetry.json`. Both hooks now detect "ArcKit project" as either `.arckit/` (CLI scaffolding) **or** `projects/` (plugin-only install). The `.arckit/memory/` directory is created on demand when the first telemetry record needs to be appended.

## [4.16.5] - 2026-05-06

### Fixed

- **Auto-allow hook now matches `${CLAUDE_PLUGIN_ROOT}` literal in commands.** The orchestrator's Bash command string contains `"${CLAUDE_PLUGIN_ROOT}/scripts/validate-handoff.mjs"` with the env var unexpanded — that's how Claude Code passes the LLM-emitted command to the PreToolUse hook. v4.16.2-4.16.4 only matched the resolved absolute path, so the env-var-literal form fell through to the user prompt. Hook now matches both forms.
- **Auto-allow `Read` of `/tmp/datascout-handoff*.json` tempfiles** so the orchestrator can re-inspect the payload it just wrote without per-file prompts.
- **Forbid the orchestrator from writing ad-hoc helper scripts.** The LLM was hallucinating `dsct-score.mjs`, `dsct-build-writer-input.mjs`, etc. mid-flow to handle scoring math and payload assembly — each file triggering its own permission prompt and not actually being needed (the only bundled executables are the validator and `scripts/bash/*.sh`). Added an explicit guardrail: do all data manipulation directly in conversation; the only executables this command runs are the ones already bundled with the plugin.

## [4.16.4] - 2026-05-06

### Fixed

- **Auto-allow hook for plugin-internal Read/Bash now actually fires.** v4.16.2 registered `allow-plugin-internals.mjs` under `PermissionRequest`, but per the Claude Code hooks docs that event only fires for *some* tools and *only when a permission dialog is about to show*. For built-in Read/Bash, blanket auto-allow requires a `PreToolUse` hook returning `permissionDecision: "allow"` inside `hookSpecificOutput`. Re-registered the hook under `PreToolUse` and updated its output JSON to the documented `hookSpecificOutput` shape. Smoke-tested with six cases (plugin Read/Bash allowed; project Read, mkdir, arbitrary rm, project Write all pass-through to the normal flow). Hook auto-allow does NOT override user/project deny rules — those still take precedence.

## [4.16.3] - 2026-05-06

### Fixed

- **Move datascout orchestrator from agent file to slash command (architecture fix).** v4.16.0–v4.16.2 placed orchestration logic in `arckit-claude/agents/arckit-datascout.md` (a subagent), which dispatched `arckit-datascout-reader` and `arckit-datascout-writer` via the `Agent` tool. **Claude Code plugins do not support nested subagent dispatch** — per the official agents documentation, *"Subagents cannot spawn other subagents"*. Users hit *"Agent tool unavailable"* errors when the orchestrator subagent tried to dispatch reader/writer. The financial-services reference plugins use the Managed Agents API for nested dispatch; that runtime feature isn't available in Claude Code plugins.
- **Resolution**: orchestration moved to `arckit-claude/commands/datascout.md` (the slash command), which executes in the main thread where `Agent` is always available. Reader and writer subagents unchanged. Same security properties (reader has no `Write`/`Edit`/`Bash`/`Agent`; writer has no web/MCP; orchestrator has `Agent` + `Bash` for the validator); different file location dictated by the runtime.
- `arckit-claude/agents/arckit-datascout.md` deleted. The orchestrator now lives in the slash command body only.
- `arckit-claude/agents/READER-PATTERN.md` updated: file layout shows orchestrator-as-slash-command; "Adapting this pattern" step 5 now says *rewrite the slash command*, not *rewrite the orchestrator agent*.

### Known limitation

- **Non-Claude runtimes** (Codex, Gemini, OpenCode, Copilot) do not support subagent dispatch at all. The new datascout slash command's instructions to dispatch reader/writer subagents will not work in those runtimes. Non-Claude support for the three-tier flow is deferred — those users continue with the existing single-agent flow until per-runtime conditional logic is added (out of scope for #442 item 1).

## [4.16.2] - 2026-05-06

### Added

- `arckit-claude/hooks/allow-plugin-internals.mjs` — `PermissionRequest` hook that auto-approves plugin-internal `Read` (any file under `${CLAUDE_PLUGIN_ROOT}/`) and `Bash` (invocations of `${CLAUDE_PLUGIN_ROOT}/scripts/validate-handoff.mjs` and the existing `scripts/bash/*.sh` helpers — `create-project.sh`, `generate-document-id.sh`, etc.). Stops the orchestrator and other agents from prompting users for approval each session when reading their own bundled schemas, templates, and references, or running their own bundled validator/helper scripts. Anything outside the plugin still falls through to the normal permission dialog.

### Fixed

- The `arckit-datascout` orchestrator's bundled-script invocations (`validate-handoff.mjs`, `create-project.sh`, etc.) and bundled-file reads (`schemas/datascout-handoff.schema.json`, `schemas/scoring-rubrics/*.yaml`, `agents/READER-PATTERN.md`) no longer trigger a per-session permission prompt now that the auto-allow hook is wired in. Same benefit accrues to every other ArcKit command that reads plugin-bundled templates or runs the standard helper scripts.

## [4.16.1] - 2026-05-06

### Fixed

- **datascout: validator no longer requires `npm install` in plugin cache.** v4.16.0 declared `ajv` and `ajv-formats` as runtime deps in `package.json`, but the Claude Code plugin marketplace clones the repo without running `npm install`, so end users hit `Error: Cannot find module 'ajv'` on first `/arckit:datascout` run. The orchestrator's "ajv-missing → legacy fallback" path then read the slash command's user-override template hint and tried `.arckit/templates/datascout-template.md`, which doesn't exist in a pure-plugin install — surfacing as a second misleading error.
- `arckit-claude/scripts/validate-handoff.mjs` rewritten as a pure-Node JSON Schema 2020-12 partial validator (zero npm dependencies). Supports the keywords actually used in `datascout-handoff.schema.json`: `type`, `required`, `properties`, `additionalProperties: false`, `items`, `enum`, `pattern`, `format: uri`/`date-time`, `maxLength`/`minLength`, `maxItems`/`minItems`, `minimum`/`maximum`, `$ref` (to `#/$defs/<name>`).
- Orchestrator pre-flight simplified: drops the `node -e "require('ajv')"` probe and the legacy-single-agent-fallback edge case. The validator's mere presence is sufficient.
- All 7 fixture tests still pass against the pure-Node validator.

### Removed

- Runtime deps `ajv` ^8 and `ajv-formats` ^3 from `package.json` (introduced briefly in v4.16.0).

## [4.16.0] - 2026-05-06

### Security

- **datascout reader/orchestrator/writer split (#442 item 1).** `arckit-datascout` is now a three-tier agent: a reader subagent fetches external content with allowlist `WebSearch/WebFetch/MCP/Read` only (no `Write`/`Bash`/`Agent`), an orchestrator validates each reader's output against a JSON Schema and scores deterministically using a YAML rubric, and a writer subagent holds the only `Write` tool. Falls back to legacy single-agent mode when ajv is not installed.

### Added

- `arckit-claude/agents/arckit-datascout-reader.md` — reader subagent (untrusted-input tier).
- `arckit-claude/agents/arckit-datascout-writer.md` — writer subagent (write-tool isolation tier).
- `arckit-claude/agents/READER-PATTERN.md` — reference doc for applying the three-tier split to other research agents.
- `arckit-claude/schemas/datascout-handoff.schema.json` — JSON Schema 2020-12 contract between reader and orchestrator.
- `arckit-claude/schemas/scoring-rubrics/{generic,uk-gov}.yaml` — deterministic scoring rubrics consumed by the orchestrator.
- `arckit-claude/scripts/validate-handoff.mjs` — shared Node + ajv validator wrapper.
- New runtime deps: `ajv` ^8, `ajv-formats` ^3.

### Changed

- `arckit-datascout` rewritten as orchestrator: removes `WebSearch`/`WebFetch`/`Write`/`Edit` from tools allowlist; gains `Agent` (to dispatch reader and writer) and keeps `Bash` for the validator + project-helper scripts.
- `scripts/converter.py` filters agents with `subagent: true` frontmatter from non-Claude targets (Codex/Gemini/OpenCode/Copilot do not support subagent dispatch).

## [4.15.2] - 2026-05-05

Documentation-only patch fixing a citation-traceability gap that only surfaced in research-agent output.

### Fixed

- **Citation traceability now covers MCP queries and web fetches (#283, #437).** `references/citation-instructions.md` previously only described how to cite files under `external/`, `policies/`, `vendors/`. The 10 research agents (`gov-reuse`, `research`, `datascout`, `aws-research`, `azure-research`, `gcp-research`, `gov-code-search`, `gov-landscape`, `grants`, `framework`) gather most of their evidence via MCP servers (govreposcrape, AWS Knowledge, Microsoft Learn, Google Developer Knowledge, DataCommons) and WebFetch, which left the External References section empty even when the body referenced GitHub URLs and MCP findings inline. The same Document Register / Citations / Unreferenced Documents tables now cover three source types — **Document** (unchanged), **MCP Query** (per-server prefix plus `Q`-index, one row per unique query), and **Web URL** (`WEB-N`, one row per unique fetched URL). WebSearch remains exploratory and does not produce citations. Two new categories added: `Reuse Evidence` and `Market Evidence`. No template changes were needed — the existing 5-column structure is reused. No agent file changes — all 10 research agents already point at `citation-instructions.md` via a shared one-line directive.

## [4.15.1] - 2026-05-05

Documentation-only patch covering the Claude Code Remote Control + push notifications pattern across the research-heavy guides.

### Documentation

- **Remote Control + push notifications (#426, closes #369).** Six research command guides (`research`, `datascout`, `aws-research`, `azure-research`, `gcp-research`, `grants`) gain a "Long runs: Remote Control + push notifications" section with a command-specific decision-point example (vendor shortlist, region selection, data source pick, programme shortlist, etc.). `autoresearch.md` gets a "Phone pings via Remote Control" subsection alongside the existing Monitor tool guidance, oriented at overnight runs paired with `ENABLE_PROMPT_CACHING_1H=1`. `CLAUDE.md` adds a "Remote Control + push notifications (user-facing)" section under the Monitor Tool docs, including pairing with the `stale-artifact-scan` background monitor. Floor reference is current (v2.1.121 covers the v2.1.110 RC requirement). Constraints listed in every section: Pro/Max plans only, push is a single on/off toggle, the local `claude` process must keep running, and `/ultrareview` flows do not compose with RC.

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

Plugin adopts Claude Code v2.1.117–v2.1.128 high-value capabilities (#427). **Minimum Claude Code version bumped from v2.1.117 to v2.1.121.** All additive — no command rename, no template breaking change.

### Added

- **MCP `alwaysLoad: true` on `aws-knowledge` and `microsoft-learn` in `.mcp.json` (#428, v2.1.121+).** Skips Claude Code's tool-search deferral so the AWS Knowledge / Microsoft Learn tools are loaded eagerly at session start. Research commands (`/arckit:aws-research`, `/arckit:azure-research`) no longer pay a discovery round-trip on the first turn. Other MCP servers (`google-developer-knowledge`, `datacommons-mcp`, `govreposcrape`) remain deferred since they're only used by specific commands.
- **PostToolUse `hookSpecificOutput.updatedToolOutput` on `provenance-stamp.mjs` (#429, v2.1.121+).** The model now sees a one-line summary on every Write/Edit of an ARC artefact: `[ArcKit] provenance stamped (effort: requested=max, effective=max)` — and on Write also `[ArcKit] docs/manifest.json auto-updated`. When effort is silently downgraded (e.g. `max` requested on a Sonnet model), the message reads `effective=high (downgraded — model does not support that level)` — the auditable signal #407 was filed for, now in-band rather than only stamped on disk. Multi-hook ordering caveat documented in the file (`provenance-stamp` runs after `update-manifest` on Write and re-surfaces its signal).
- **PostToolUse `hookSpecificOutput.updatedToolOutput` on `update-manifest.mjs` (#429).** Emits `[ArcKit] docs/manifest.json updated: ARC-NNN-TYPE-vN.N → project/slot` on successful manifest update. Overwritten by `provenance-stamp.mjs` on chained Writes; visible in isolation when only `update-manifest` matches (e.g. legacy paths).
- **`emitUpdatedToolOutput()` helper in `hook-utils.mjs`.** Shared utility for writing the PostToolUse `hookSpecificOutput` JSON; documents the multi-hook last-wins ordering rule.
- **Session telemetry hook `telemetry.mjs` (#430).** New multi-purpose hook registered for PostToolUse (`.*`) and TaskCreated (`.*`). Records three event kinds to `.arckit/memory/.telemetry.jsonl`:
  - `hook_duration` — `{ tool, duration_ms }` for every tool call (Claude Code v2.1.119+); excludes `TaskCreate` and `mcp__govreposcrape__*` so the duration histogram isn't polluted by long-running async tools.
  - `mcp_call` — `{ server, tool, args }` for `mcp__govreposcrape__*` calls. Args sanitised: long strings replaced with length markers (`<string len=N>`), arrays/nested objects flattened to `<array>`/`<object>`. No payload content stored.
  - `agent_spawn` — `{ agent }` from `tool_input.subagent_type` on TaskCreated (Claude Code v2.1.84+).

  Telemetry is best-effort — any failure (write error, malformed line, missing field) is swallowed silently.
- **Session-learner telemetry aggregation (#430).** `session-learner.mjs` reads `.telemetry.jsonl` at Stop / StopFailure, computes overall p50/p95 over all latencies, top-3 agents, and MCP server counts, appends a one-line `**Telemetry:**` summary to the session entry in `sessions.md`, and deletes the JSONL so the next session starts clean. Sample output: `47 tool calls (p50=12ms, p95=4200ms) | 3 agents (arckit-research×2, arckit-datascout) | MCP: govreposcrape×8`.
- **Dashboard surface — `docs/telemetry.json` + Session Telemetry / Recent Sessions panels (#431).** When `docs/` exists, `session-learner.mjs` also writes a structured rollup to `docs/telemetry.json` (newer-first, capped at 50 sessions). The pages dashboard fetches this with the same graceful-fallback pattern as `health.json` and renders two new panels under the Health row: *Session Telemetry* (aggregate tool calls, median p50, agents spawned, MCP calls across last 10 sessions) and *Recent Sessions* (last 5 with date, type, per-session counts and failure marker if applicable). Renders only when `sessions.length > 0`; projects without telemetry render the dashboard exactly as before.
- **`claude plugin tag --dry-run` validation step in release flow (#428, v2.1.118+).** Cross-checks `arckit-claude/.claude-plugin/plugin.json` against the marketplace entry in `.claude-plugin/marketplace.json` and exits non-zero on mismatch. Documented in CLAUDE.md and `scripts/bump-version.sh` reminders. Used for validation only — `claude plugin tag` creates `arckit--vX.Y.Z` style tags which would not trigger `.github/workflows/release.yml` (matches `v[0-9]+.[0-9]+.[0-9]+`).
- **`claude plugin prune --dry-run` cleanup step (#428, v2.1.121+).** Optional dependency cleanup; documented in release flow.

### Changed

- **Documented minimum Claude Code version bumped from v2.1.117 to v2.1.121 (#430).** `version-check.mjs` SessionStart hook updated (`MIN_CLAUDE_CODE_VERSION = '2.1.121'`); warning copy lists the four new feature dependencies introduced in this release. README, `docs/guides/mcp-servers.md`, and the top-level README updated; "Why v2.1.121?" paragraph rewritten to lead with what's actually new (`alwaysLoad`, `updatedToolOutput`, `claude plugin tag`, `duration_ms`) and carries forward the v2.1.117 / v2.1.111 / v2.1.97 context.
- **`scripts/converter.py` filters `alwaysLoad` from generated Codex `config.toml` (#428).** The converter previously coerced all MCP server fields to quoted strings, which would have emitted `alwaysLoad = "True"`. New `CLAUDE_ONLY_MCP_FIELDS` set strips Claude-only keys before serialisation, leaving room for future additions.
- **Session housekeeping (#419).** Memory log cleanup, plugin enablement, and `.gitignore` refinement.

### Notes for plugin authors

- **`type: "mcp_tool"` clarification (v2.1.118).** This Claude Code feature lets a hook *invoke* an MCP tool as its action (alternative to `type: "command"` / `type: "prompt"`). It does **not** filter hooks to fire only on MCP tool calls. ArcKit logs `govreposcrape` calls via the existing tool-name matcher pattern (`mcp__govreposcrape__.*`); no `type: "mcp_tool"` registration is needed for telemetry.
- **`graph-inject.mjs` is `UserPromptSubmit`, not `PostToolUse`.** Originally listed in #427's `updatedToolOutput` checklist alongside the provenance and manifest hooks; doesn't apply because UserPromptSubmit hooks return context to the model via their own mechanism (`additionalContext`). Removed from scope in #429.

## [4.13.1] - 2026-05-03

Same-day follow-up to v4.13.0. All changes are additive enhancements to the build harness — no breaking changes, no removals.

### Added

- **`uae-federal-ai` recipe (#414).** Third built-in recipe for UAE Federal projects under the 23 April 2026 Cabinet agentic AI decree. 48 targets including all 12 UAE community commands (PDPL, IAS, AI Charter, autonomy tier, cloud residency, UAE Pass, data sharing, digital records, priorities alignment, procurement, zero bureaucracy, classification), an integrated research wave, and the core ArcKit governance suite. ADR topics rewritten for UAE federal AI (Core42 / G42 / Microsoft UAE / e& sovereign hosting, UAE Pass tiers, AI autonomy policy, MoF procurement route).
- **Research wave on `uk-saas` and `uk-mod-sovereign` (#417).** Both recipes go from 31/32 → 38 targets each. Default-on per-project research targets: `RESEARCH`, `AWS_RESEARCH`, `AZURE_RESEARCH`, `GCP_RESEARCH`, plus `GOV_REUSE` (uk-saas only) and optional `DATASCOUT`. Skip what you don't need with `--exclude AWS_RESEARCH` etc.
- **`ORG_RESEARCH` upstream target (#417, #414 amendment).** New first-wave target on all three built-in recipes. Researches the target organisation's strategy, structure, and existing systems; output goes to `projects/000-global/research/` so the org context is shared across every project in the same repo. Per-project research targets all `deps: [REQ, ORG_RESEARCH]`, so context flows organisation → project. Default on; opt out with `--exclude ORG_RESEARCH`.

### Documentation

- **Discovery surfaces caught up with v4.13.0 (#416).** `/arckit:build` now appears in `commands.html` (Foundation row), `guides.html` (Getting Started list, count 10 → 11), and a new "Meta: Build Harness" section in `DEPENDENCY-MATRIX.md`. The matrix entry explains why the harness isn't a row/column in the DSM (depends on every other command transitively).
- **sitemap.xml + llms.txt + getting-started.html (#415).** sitemap adds `articles.html` and `article-viewer.html`, refreshes `lastmod=2026-05-03` on the home / commands / guides / getting-started entries. llms.txt updated to 71 commands + 34 community, mentions the build harness with all three recipes and the new build guide, plus a new "Articles and essays" section. getting-started gains a "Faster path (Claude Code only)" notification banner introducing The GDS Harness immediately under the existing Vibe Start banner.
- **Getting-started recipe counts updated** to reflect the post-research-wave shape (uk-saas: 31→38, uk-mod-sovereign: 32→38, uae-federal-ai: 47→48). Banner now also describes the `ORG_RESEARCH` pattern and how to opt out.

### Architecture notes

- All three built-in recipes now share a consistent research-flow shape: `ORG_RESEARCH` (no deps, global) → per-project research targets (deps on REQ + ORG_RESEARCH). Recipe authors writing custom recipes are encouraged to follow this pattern.
- The research targets do not gate ADRs in any recipe — research is informational. Architects read the research outputs when drafting ADRs rather than the harness blocking on them. This keeps the wave plan tight and makes opting research targets in/out a fluid decision per build.

## [4.13.0] - 2026-05-03

### Added

- **`/arckit:build` parallel build harness (#410).** New skill `arckit-build` and slash command `/arckit:build` orchestrate parallel `/arckit:*` artefact generation via subagent isolation. Reads a YAML recipe, computes the dependency DAG, dispatches one `general-purpose` subagent per target per wave, validates outputs, and commits each wave as one atomic git commit. State persisted to `projects/{P}/.arckit/state.json` for resumability across sessions and recipe edits. Two built-in recipes ship with the plugin: `uk-saas` (31 targets — UK Government civilian SaaS with GDS Service Standard, TCoP, NCSC CAF coverage) and `uk-mod-sovereign` (32 targets — MOD / sovereign / air-gapped with `mod-secure` + `jsp-936`, no SVCASS, sealed-media distribution). Recipe schema v1 supports glob deps (`ADR-*`), variable substitution (`{P}/{NAME}/{V}/{TOPIC}`), `optional_targets` with `--enable`/`--exclude` flags, and project overrides via `.arckit/recipes/{name}.yaml`. Worker prompt trusts the existing `validate-arc-filename.mjs` PreToolUse hook for path allocation rather than constructing filenames itself, so multi-instance numbering, subfolder placement, and project-ID padding are all consistent with single-skill invocations. Skill version banner v0.4. Claude-only — `scripts/converter.py` skips both the skill and the slash command for Codex / OpenCode / Gemini / Copilot extensions because parallel `Agent` dispatch is a Claude Code-specific capability.
- **Provenance stamping hook (#409).** New `provenance-stamp.mjs` PostToolUse hook on `Write|Edit` against `projects/**` injects a `## Build Provenance` block into every ArcKit artefact, recording build context (recipe / wave / target / topic) from `state.json`, requested effort from command frontmatter, and effective effort derived via the silent-downgrade matrix (model parsed from the existing `AI Model:` footer line). Block is delimited by HTML comments and rewritten in place on subsequent edits (idempotent). Complements rather than duplicates the human-authored footer the command writes; the block stamps only fields the model cannot authoritatively self-report. When the model doesn't support the requested level, the block reads e.g. `Effective Effort: high (downgraded from max — model does not support that level)` — the auditable signal issue #407 was filed for.
- **Build harness launch article + hero (#411).** Long-form essay at `docs/articles/2026-05-03-build-harness-parallel-architecture-generation.md` plus a 1600x900 hero image with wave-plan visualization (9 waves, GDS palette). Surfaced on both `articles.html` (top of grid) and `index.html` (top of "Latest writing" teaser).
- **`uk-mod-sovereign` recipe.** Sovereign / air-gapped variant with eight rewritten ADR topics, `mod-secure` replacing standard SbD, JSP 936 AI assurance, and ATRS algorithmic transparency as opt-in. Anchored on Principle 21 (Sovereign and Air-Gapped Deployment).

### Fixed

- **CLAUDE.md ADR/DIAG path documentation (#408).** The "Project Structure Created by `arckit init`" tree showed ADRs and diagrams at project root, but `/arckit:adr` and `/arckit:diagram` actually write to `decisions/` and `diagrams/` subfolders (verified against test repos v1, v3, v17). Tree updated to show the correct subfolder layout.

### Architecture notes

- The `validate-arc-filename.mjs` hook is now treated as the authoritative path allocator for ArcKit artefacts. The build harness's worker prompt trusts the hook to normalize paths at write time rather than redundantly invoking `generate-document-id.sh` itself. Recipe `output.subfolder` and `output.multi_instance` fields are documented as orientation hints for `--plan` output; the hook's `SUBDIR_MAP` and multi-instance-types list are the runtime source of truth.

## [4.12.3] - 2026-05-01

### Fixed

- **`/arckit:traceability` actually now reports correct coverage (#389).** Previous v4.12.2 attempt fixed regex namespace collisions but the actual bug was elsewhere: `formatTraceability` reads `node.reqIds` for every non-REQ artifact to build the coverage `refMap`, but `node.reqIds` is only assigned by `scanAllArtifacts` when the caller passes `withNodeMetadata: true` (`graph-utils.mjs:181-188`). The traceability recipe in `graph-inject.mjs` did not request that flag, so `reqIds` was always `undefined` and `refMap` always empty — coverage reported 0% regardless of what was in the documents. Verified end-to-end against `arckit-test-project-v20-uae-moi-ipad` project 006: coverage now reports 41 of 53 requirements (77%), with citation lists per requirement showing the actual covering artifacts (RISK, SOBC, STKE, IAS, PDPL, CLAS, RSCH, WARD, ADR, AUTI, CRES, AICH, NPRA).

## [4.12.2] - 2026-05-01

### Fixed

- **`/arckit:traceability` reported 0% coverage on legacy projects with 1-2 digit REQ IDs (#389).** The v4.12.1 fix loosened the REQ-doc heading extractor but kept the universal `REQ_ID_PATTERN` strict at `\d{3}` to avoid namespace collisions with non-REQ artifacts. Side-effect: cross-references like `BR-1, FR-3, NFR-SEC-7` in `RSCH` / `RISK` / `STKE` / `SOBC` / `WARD` / UAE-overlay compliance assessments were not extracted, so `node.reqIds` came back empty and `formatTraceability` reported zero coverage even when 14 sibling artifacts genuinely cited the requirements. Universal scanner now also accepts `\d{1,3}`.
- **`templates/azure-research-template.md`** — Azure Security Benchmark "Backup & Recovery (BR)" row renamed to `BCK-N` to remove the namespace collision with Business-Requirement IDs. Previously `BR-1, BR-2, BR-3` in the ASB control table would, after the loose-pattern fix, be picked up as REQ cross-references. AWS and GCP research templates checked and confirmed clean (no equivalent collisions).

### Known limitations

- `templates/fr-anssi-carto-template.md` line 144 still uses `INT-01` for network-interconnection IDs, which collides with the REQ Integration namespace. Currently affects only French ANSSI cartography artifacts. Will be addressed in a follow-up.

## [4.12.1] - 2026-05-01

### Fixed

- **Templates aligned to 3-digit REQ IDs** — `requirements-template.md`, `traceability-matrix-template.md`, `hld-review-template.md`, and `jsp-936-template.md` previously used `BR-1` / `FR-1` / `NFR-P-1` placeholder form. 24 of 27 surveyed test-repo REQ documents already use 3-digit zero-padded form (`BR-001`); only the most recent 3 followed the templates literally and broke the hook. Templates now consistently use the 3-digit form. Affects all template copies (`arckit-claude`, `.arckit`, and the five extension templates regenerated by `scripts/converter.py`). `azure-research-template.md` (Azure Security Benchmark `BR-N` namespace for "Backup & Recovery") and `fr-anssi-carto-template.md` (`INT-NN` network-interconnection IDs) were intentionally left unchanged — different namespaces (#386).
- **`hooks/hook-utils.mjs`** — `extractRequirementDetails` heading regex now accepts 1-3 digit numeric suffixes (`### BR-1:`, `#### FR-12:`, `### BR-001:`). Previously hardcoded `\d{3}`, which silently dropped requirements from any REQ document using non-padded IDs — leaving `/arckit:traceability` with an empty graph and forcing the manual fallback. The universal `REQ_ID_PATTERN` scanner stays strict at `\d{3}` to avoid false positives in non-REQ artifacts that use the same prefix in a different namespace (e.g. Azure Security Benchmark `BR-1, BR-2` in `azure-research-template.md`) (#386).
- **`hooks/graph-inject.mjs`** — `formatTraceability` now emits a diagnostic message when no requirements can be extracted from a project that has artifacts, instead of returning `null` silently. The hook bail-out is now visible in the prompt context so the failure mode looks like a hook problem rather than a missing hook (#386).
- **`hooks/graph-inject.mjs`** — `DR-\d{3}` data-requirement detector loosened to `DR-\d{1,3}` so the "missing data-model" recommendation correctly fires for projects with shorter `DR-N` IDs.

## [4.12.0] - 2026-05-01

### Added

- **`hooks/graph-rollups.mjs`** — shared module with `tagNodeHealth()`, `computeAllProjectRollups()`, and the canonical `HIGH_SEVERITY_TYPES` / `ESSENTIAL_TYPES` / `CONTEXTUAL_TYPES` / `STALE_THRESHOLD_DAYS` constants. Used by both `graph-inject.mjs` and `sync-guides.mjs` (#383).
- **`manifest.json` enrichments** written by `sync-guides`:
  - `dependencyGraph.nodes[*].health = { stale, draft, orphan, ageDays }` per node.
  - New `manifest.projectHealth` block with per-project coverage %, compliance readiness %, density, top-3 recommendations, stale/draft/orphan counts.
- **`pages-template.html`** Document Map tints nodes by health (red=stale, amber=draft, dashed=orphan), extends the legend and tooltip, and adds a new "Project Health & Next Steps" dashboard panel rendering one card per project from `manifest.projectHealth`.
- **`docs/llms.txt`** gains an opt-in `## Project status` section listing per-project coverage / compliance / health flags / top recommendation.

### Changed

- `graph-inject.mjs` refactored to import constants from `graph-rollups.mjs`. No behaviour change.
- `sync-guides.mjs` passes `{ withNodeMetadata: true }` to `scanAllArtifacts`. Manifest size grows ~60% on typical projects.
- `docs/guides/hooks.md` refreshed: superseded per-command `*-scan.mjs` rows replaced with a single `graph-inject` row; `graph-rollups.mjs` added to Utility Files table; `sync-guides` description updated.

### Breaking changes

None. Manifest schema is additive.

## [4.11.0] - 2026-05-01

### Added

- `/arckit.navigator` (Live) — project-level GPS that shows coverage against the essential ArcKit baseline, flags DRAFT / stale / orphan artifacts, and recommends the next slash command. Read-only.
- `/arckit.graph-report` (Live) — governance metrics dashboard across all working projects (coverage, cross-reference density, compliance readiness, project comparison). Read-only.
- `hooks/graph-inject.mjs` — consolidated graph-builder hook that replaces the five legacy per-command scan hooks (`search-scan`, `impact-scan`, `traceability-scan`, `health-scan`, `governance-scan`).
- `hooks/graph-utils.mjs` v2 — additive `withNodeMetadata`, `withContent`, `withPreview` opts. Backward compatible.
- Guides: `guides/navigator.md`, `guides/graph-report.md`.

### Changed

- `/arckit.search`, `/arckit.impact`, `/arckit.traceability`, `/arckit.health`, `/arckit.analyze` now consume the unified `graph-inject` pipeline instead of running their own scans.
- Plugin description bumped to "70 slash commands". Officially-maintained baseline is 68 → 70.

### Breaking changes

None.

### Internal

- 8 PRs landed for v4.11.0: #360, #362, #363, #364, #365, #366, #367, with replacement PRs #377 (search) and #378 (matrix doc).

## [4.10.1] - 2026-04-30

### Changed

- UAE Federal Overlay reclassified from official-baseline to community-contributed. All 12 `uae-*` commands now carry the `[COMMUNITY]` description prefix, an inline warning banner before the prompt body, and `Template Origin: Community` in their templates. See top-level `CHANGELOG.md` `[4.10.1]` for the full reclassification notes and rationale.

## [4.10.0] - 2026-04-30

### Added

- 12-command UAE Federal Overlay (initially shipped as official-baseline; reclassified to community-contributed in 4.10.1 the same day). See top-level `CHANGELOG.md` `[4.10.0]` for the full release notes.

## [4.9.4] - 2026-04-28

### Docs

- Added `docs/guides/custom-commands.md` — authoring guide for contributors adding new `/arckit.*` commands. Covers the converter fan-out from the plugin source to six target formats, frontmatter reference, the `$ARGUMENTS` placeholder rewriting table, template-handling differences between Paperclip (embedded) and other targets (verbatim copy), a worked `/arckit.sla` example, the commands/skills/agents/hooks decision table, and a testing checklist. Authored by @Yumstezy (#111, #357)

### Fixed

- `hooks/allow-mcp-tools.mjs` now auto-allows `mcp__govreposcrape__` tool calls. Four of the five bundled MCPs were already in the auto-allow list — govreposcrape was missing, so every `/arckit.gov-reuse`, `/arckit.gov-code-search`, and `/arckit.gov-landscape` run was hitting a permission dialog on every tool call (#215, #358)

## [4.9.3] - 2026-04-28

### Added

- `/arckit.pages` dashboard now surfaces HTML deck artifacts (e.g. `ARC-001-DECK-v1.0.html`) alongside markdown documents in project artifact lists. New `DECK` doc-type code registered in `config/doc-types.mjs` and the `sync-guides` hook (#354)

### Changed

- `plugin.json` declares `"$schema": "https://json.schemastore.org/claude-code-plugin-manifest.json"` for editor autocomplete and IDE-side validation. Recognised by `claude plugin validate` since Claude Code v2.1.120; forward-compatible because Claude Code ignores `$schema` at load time, so no minimum-version bump (#215, #355)

## [4.9.2] - 2026-04-24

### Changed

- Documented minimum Claude Code version bumped from v2.1.112 to **v2.1.117**. `version-check.mjs` SessionStart hook updated (`MIN_CLAUDE_CODE_VERSION = '2.1.117'`); warning copy now lists the Opus 4.7 `/context` size fix (1M instead of 200K — long research sessions no longer autocompact early) and `--agent` `mcpServers` loading as the headline v2.1.117 reasons. `README.md` and `docs/guides/mcp-servers.md` updated to match (#215, #352)

### Postmortem context

The v2.1.117 floor independently clears all three Claude Code regressions described in [Anthropic's April 23 postmortem](https://www.anthropic.com/engineering/april-23-postmortem) (effort default lowered Mar 4 – Apr 7, thinking-cache clearing bug Mar 26 – Apr 10 fixed in v2.1.101, "≤25 words between tool calls" verbosity rule Apr 16 – Apr 20 fixed in v2.1.116). Users on v2.1.117+ are clear of all three.

## [4.9.1] - 2026-04-22

### Fixed

- `/arckit.wardley` and `/arckit.wardley.value-chain` quoting rule now forces quotes on names containing a bare numeric word (`NIS 2031`, `ISO 27001`, `Windows 11`, `Log4j 2024`). The mermaid `wardley-beta` parser tokenises bare digits as numeric literals and breaks rendering otherwise (#349)
- `validate-wardley-math.mjs` Stop-hook extended to scan `mermaid` / `wardley-beta` blocks and block Stop on any unquoted bare-digit name (declarations, `->` edges, `evolve` targets, `pipeline` parents) (#349)

## [4.9.0] - 2026-04-21

### Added

- Mermaid `wardley-beta` rendering now works in generated `docs/index.html` pages — CDN bumped to `mermaid@11.14.0` (2026-04-01 release) which ships the Wardley diagram type as a stable feature (#337)

### Fixed

- `/arckit.wardley` and `/arckit.wardley.value-chain` now emit correctly-quoted names in generated `wardley-beta` blocks using a grammar-driven conditional rule. Hyphenated names like `Real-Time Data Processing` or `GPT-4 LLM Service` previously broke rendering because Mermaid's lexer read the `-` as `->`. Simple multi-word names like `API Gateway` stay unquoted (#341)

### Companion

- [`tractorjuice/wardley-maps-mermaid`](https://github.com/tractorjuice/wardley-maps-mermaid) — public mirror of `swardley/WARDLEY-MAP-REPOSITORY` with 147 OWM-to-Mermaid conversions, all rendering cleanly under Mermaid 11.14.0+

## [4.8.0] - 2026-04-20

### Added (Community-contributed)

- 3 Austrian regulatory commands seeded in #320 and verified in #333 by @gtonic: `/arckit.at-dsgvo` (DSG/DSGVO), `/arckit.at-nisg` (NISG idF BGBl. I Nr. 94/2025 — NIS2 transposition), `/arckit.at-bvergg` (BVergG 2018, thresholds per VO 2023/2495). New doc-type codes ATDSG, ATNISG, BVERGG registered in both `config/doc-types.mjs` and `commands/pages.md`. @gtonic added as Austrian domain CODEOWNERS (#334)
- `/arckit.fr-irn` — IRN (Indice de Résilience Numérique) self-assessment per the aDRI framework (#322)

### Fixed

- Propagate `.guide-status.community` CSS to `pages-template.html` (#327)
- Register 18 EU/FR community guide stems in the `sync-guides` hook
- AT DSG template drift: sync `arckit-claude/templates/at-dsgvo-template.md` with the verified `.arckit/` copy so plugin and extension users get the enriched template
- MD040 lint error in a superpowers doc (missing language tag on code fence)

### Docs

- @gtonic added to `docs/contributors.html` as code contributor + Austrian domain maintainer (#328)
- CHANGELOG `[Unreleased]` sync covering 12 untracked commits since v4.7.2 (#329)
- Book content moved to `tractorjuice/arckit-book` (#324, #325)
- Star History chart added to README; DeepWiki `.devin/wiki.json` added
- `docs/superpowers/` tidy + README (#326)
- Registry-consolidation design spec and plan (not yet implemented)

## [4.7.2] - 2026-04-19

### Added

- `## Key References` tables in all 18 EU/French community commands (`arckit-claude/commands/{eu-,fr-}*.md`) pointing to authoritative regulatory sources — EUR-Lex, ANSSI, CNIL, EDPB, ENISA, MITRE (#321)
- 18 new usage guides in `arckit-claude/docs/guides/{eu-,fr-}*.md` covering every EU/French community command. All guides carry `Guide Origin: Community` to preserve provenance. Each guide follows the standard ArcKit guide format: inputs table, command syntax, document structure, workflow, review checklist (#321)

### Changed

- Regenerated extension artefacts for the 18 community commands via `scripts/converter.py`

## [4.7.1] - 2026-04-19

### Fixed

- `/arckit.pages` was silently omitting the 18 v4.7.0 community-contributed type codes (RGPD, NIS2, AIACT, DORA, CRA, DSA, DATAACT, CNIL, SECNUM, MARPUB, DINUM, EBIOS, ANSSI, CARTO, DR, ALGO, PSSI, REUSE) from the rendered dashboard. The `update-manifest.mjs` hook correctly recorded the artifacts in `docs/manifest.json`, but the `/arckit.pages` prompt has its own hardcoded "Only include these known artifact types" allow-list that was missing the new codes. Added all 18 to `commands/pages.md` grouped by category (#317)

### Documentation

- `config/doc-types.mjs` — added a prominent `⚠️ DUAL REGISTRATION REQUIRED` warning at the top so future contributors know to update both `doc-types.mjs` and `pages.md` when adding new type codes (#317)

## [4.7.0] - 2026-04-19

### Added (Community-contributed)

> ⚠️ The 18 EU and French regulatory commands below are community-contributed and have not yet been validated against current ANSSI / CNIL / EU regulatory text. Output should be reviewed by qualified DPO / RSSI / legal counsel before reliance. Citations may lag the current source — verify before use. Domain maintainer: [@thomas-jardinet](https://github.com/thomas-jardinet) — auto-requested for review on `eu-*` / `fr-*` changes via `.github/CODEOWNERS`.

**EU regulations** (member-state-neutral):

- `/arckit.eu-rgpd` — GDPR (EU 2016/679) compliance assessment
- `/arckit.eu-nis2` — NIS2 Directive — operators of essential / important entities
- `/arckit.eu-ai-act` — EU AI Act (Regulation 2024/1689) — risk classification + conformity
- `/arckit.eu-dora` — DORA (EU 2022/2554) — financial sector ICT resilience
- `/arckit.eu-cra` — Cyber Resilience Act (Regulation 2024/2847) — products with digital elements
- `/arckit.eu-dsa` — Digital Services Act (Regulation 2022/2065) — platforms / VLOPs
- `/arckit.eu-data-act` — Data Act (Regulation 2023/2854) — connected products / DAPS

**French government** (apply on top of EU baseline):

- `/arckit.fr-secnumcloud` — SecNumCloud 3.2 qualification (sovereign cloud, OIV/OSE)
- `/arckit.fr-dinum` — RGI / RGAA / RGESN / RGS / doctrine cloud de l'État
- `/arckit.fr-marche-public` — Code de la commande publique procurement docs
- `/arckit.fr-rgpd` — CNIL-specific GDPR layer (cookies, HDS, age 15)
- `/arckit.fr-ebios` — EBIOS Risk Manager 5-workshop study (ANSSI)
- `/arckit.fr-anssi` — ANSSI Guide d'hygiène informatique (42 measures)
- `/arckit.fr-anssi-carto` — ANSSI IS cartography (4 reading levels)
- `/arckit.fr-dr` — Diffusion Restreinte handling (II 901/SGDSN/ANSSI)
- `/arckit.fr-algorithme-public` — Article L311-3-1 CRPA transparency notice
- `/arckit.fr-pssi` — Information System Security Policy per ANSSI/RGS
- `/arckit.fr-code-reuse` — Public code reuse (code.gouv.fr, SILL, EUPL)

### Added

- `.github/CODEOWNERS` — establishes domain ownership; @thomas-jardinet is auto-requested for review on `eu-*` / `fr-*` changes (#316)

### Fixed

- `validate-arc-filename.mjs` PreToolUse hook was blocking every Write call from the new EU and FR commands with exit code 2 ("Unknown document type code"). Registered all 18 codes (RGPD, NIS2, AIACT, DORA, CRA, DSA, DATAACT, CNIL, SECNUM, MARPUB, DINUM, EBIOS, ANSSI, CARTO, DR, ALGO, PSSI, REUSE) in `config/doc-types.mjs` — the single source of truth that all 6 ArcKit hooks import for display names and categorisation. The 7 EU commands shipped via #314 had been broken at the hook layer until #316 hotfixed them (#316)

## [4.6.13] - 2026-04-19

### Fixed

- `stale-artifact-scan` monitor (`scripts/bash/detect-stale-artifacts.sh`) failed with exit 1 in real ArcKit repos, terminating mid-loop after the first artifact. Root cause: the script sourced `common.sh` (whose `set -euo pipefail` leaked into the monitor), so any `grep | sed | tr` pipeline that returned no match would abort via the assignment. Removed the unused `source` line. Also rewrote the Document Control `Status` grep to handle bolded markdown (`| **Status** |`) and anchored it so it no longer matches unrelated `| status |` rows in entity-attribute tables. Reproduced and verified against `tractorjuice/arckit-test-project-v2-hmrc-chatbot` (was: 1 line + exit 1; now: 7 lines + exit 0) (#307)

## [4.6.12] - 2026-04-18

### Fixed

- Plugin manifest rejected by Claude Code v2.1.114 with `userConfig.*.type: Invalid option` and `userConfig.*.title: expected string, received undefined` errors. Added the now-required `title` (human-readable label shown in the enable-time prompt) and `type: "string"` to all five `userConfig` entries in `.claude-plugin/plugin.json` (#302). Without this fix the plugin fails to install on Claude Code v2.1.114+.

## [4.6.11] - 2026-04-18

### Added

- `keep-coding-instructions: true` (Claude Code v2.1.94+) on `requirements`, `research`, `sobc`, `datascout`, and `framework` commands. These long-running commands now keep their template and traceability instructions in context across `/compact`, preventing Claude from "forgetting" Document Control structure, requirement ID conventions, and citation patterns mid-run (#215, #301)

## [4.6.10] - 2026-04-18

### Added

- `monitors` key in `plugin.json` registering a `stale-artifact-scan` background monitor (Claude Code v2.1.105+). At session start, the plugin runs `scripts/bash/detect-stale-artifacts.sh` which scans `projects/` for artifacts with overdue `Next Review Date` or long-unchanged `DRAFT` status and emits one notification line per stale file. Exits silently when the cwd is not an ArcKit project (#215, #300)
- `scripts/bash/detect-stale-artifacts.sh` — one-shot scanner invoked by the new monitor. Caps output at 10 lines; appends a pointer to `/arckit.health` for the full list.

### Changed

- Autoresearch guide adds a "Watching progress without blocking the main session" paragraph recommending the built-in `Monitor` tool (v2.1.98+) for streaming overnight runs from a second session (#215, #300).

## [4.6.9] - 2026-04-18

### Added

- `version-check.mjs` SessionStart hook now also checks the running Claude Code client version and warns when below v2.1.112. Complements the pre-existing plugin self-update check; both warnings combine into a single `additionalContext` block when they fire together (#215, #299)

## [4.6.8] - 2026-04-18

### Added

- Plugin `userConfig` (Claude Code v2.1.83+) in `plugin.json` with 5 fields: `GOOGLE_API_KEY` and `DATA_COMMONS_API_KEY` (sensitive, stored in system keychain) for MCP authentication, plus `organisation_name`, `default_classification`, and `governance_framework` for Document Control defaults. Claude Code prompts once at enable time (#215, #298)

### Changed

- `arckit-claude/.mcp.json` now references `${user_config.GOOGLE_API_KEY}` and `${user_config.DATA_COMMONS_API_KEY}` instead of shell env vars. The converter rewrites these to `${KEY}` for non-Claude extensions so Codex/Gemini/OpenCode continue to read from the shell environment.

## [4.6.7] - 2026-04-18

### Added

- `/arckit.pages` now generates `docs/llms.txt` alongside `index.html` and `manifest.json`, following the [llmstxt.org](https://llmstxt.org/) standard so LLM agents and crawlers can efficiently discover and fetch every artifact, guide, and project in the repository. Uses `raw.githubusercontent.com` URLs for project markdown and relative paths for the site-local dashboard and guides. Protected by a generation marker (`<!-- Generated by ArcKit /arckit:pages -->`) — hand-curated `docs/llms.txt` files without the marker are preserved across re-runs.
- Document `ENABLE_PROMPT_CACHING_1H=1` (Claude Code v2.1.108+) recommendation in MCP setup and autoresearch guides for long ArcKit workflows and overnight optimisation runs (#215)
- `paths:` globs on all 4 plugin skills (`architecture-workflow`, `mermaid-syntax`, `plantuml-syntax`, `wardley-mapping`) for sharper auto-activation (v2.1.84+) — description keywords still trigger the skill when no matching files are in context (#215, #297)
- `if:` conditions (v2.1.85+) on `validate-arc-filename`, `score-validator`, and `update-manifest` hooks to narrow triggering to `projects/**` writes, eliminating unnecessary Node process spawns for unrelated file edits (#215, #297)

### Changed

- Bump minimum Claude Code version to v2.1.112 to unlock Opus 4.7 `xhigh` effort tier and Auto mode for deep-research agents and synthesis commands (#215)
- `CLAUDE.md` documents new command frontmatter (`keep-coding-instructions`, `xhigh`), agent frontmatter (`initialPrompt`), skill frontmatter (`paths:`), hook `if:` field syntax, and newer hook events (PostCompact, PreCompact, FileChanged, CwdChanged, TaskCreated, PermissionDenied)

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

- `/arckit.grants` command — research UK grants, charitable funding, and accelerator programmes with eligibility scoring (#277)
- `arckit-grants` agent — autonomous web research across 7 categories of UK funding bodies including 360Giving/GrantNav
- `GRNT` document type and grants template with citation traceability

## [4.6.3] - 2026-04-06

### Added

- Document version badges in pages sidebar — every document shows its version (e.g., v1.0) with an inline dropdown selector when multiple versions of the same document exist
- Citation traceability for external documents — inline citation markers (`[DOC-CN]`) and structured "External References" section (#158, #207)
- Shared citation instructions file referenced by all 43 commands and 7 research agents

## [4.6.2] - 2026-04-05

### Added

- Mermaid `wardley-beta` test suite — 98% pass rate on 147 real-world maps, ArcKit syntax 100% valid (#271)
- Hooks documentation guide (`docs/guides/hooks.md`)

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

- All 9 agents now use `model: inherit` instead of hardcoded `sonnet` — agents use whatever model the user is running
- Added `effort: high` to 10 commands: analyze, dfd, diagram, gcloud-clarify, gcloud-search, impact, principles, principles-compliance, servicenow, story
- Autoresearch: effort and model are now tuneable parameters; plateau threshold increased to 15; results.tsv tracks effort/model

## [4.5.3] - 2026-03-24

### Fixed

- Update agent count from 6 to 9 and MCP server count from 4 to 5 in plugin README
- Update remote-control guide with correct command and agent counts
- Merge optimised gov agent prompts via autoresearch

## [4.5.2] - 2026-03-23

### Fixed

- Update command count from 64 to 67 in plugin.json description
- Update agent and hook counts in MCP servers guide

## [4.5.0] - 2026-03-23

### Added

- **govreposcrape MCP server** — Semantic search over 24,500+ UK government repositories (no API key required)
- `/arckit.gov-reuse` command and agent — Discover reusable UK government code before building from scratch
- `/arckit.gov-code-search` command and agent — Search UK government repositories using natural language queries
- `/arckit.gov-landscape` command and agent — Map the UK government code landscape for a domain
- Government Code Reuse Check step in `/arckit.research` agent — adds "Reuse Government Code" as 5th build-vs-buy option
- Government Code for Data Integration step in `/arckit.datascout` agent — discovers existing API client libraries
- Government Implementation Patterns step in AWS, Azure, and GCP research agents — checks for government precedent
- Document type codes: GOVR, GCSR, GLND with templates, guides, and quality checks
- GOVR, GCSR, GLND added to `/arckit.pages` artifact type list

## [4.4.0] - 2026-03-21

### Added

- Wardley map mathematical model metrics in commands and autoresearch
- Git worktree isolation for autoresearch
- Autoresearch guide for self-improving command prompts

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

- Deduplicated cross-reference edges in dependency graph (e.g. 396 → ~40 edges for 14 nodes)

## [4.2.2] - 2026-03-11

### Fixed

- Dependency map always shows 000-global documents when filtering by project

## [4.2.1] - 2026-03-11

### Fixed

- Dependency map layout now wraps nodes into grid rows (max 8 columns) instead of one long row per category
- Fixed null element ID (`doc-content` → `content`) crash when opening dependency map
- Fixed null `type`/`project` crash in dependency map node sorting
- Filtered `.gitkeep` and `README.md` from vendor docs and tech notes in manifest

## [4.2.0] - 2026-03-11

### Added

- Interactive dependency map visualization in pages dashboard (`#dependency-map` route)
- Shared `graph-utils.mjs` module extracted from `impact-scan.mjs` for graph-building logic
- Dependency graph data (`dependencyGraph`) added to `manifest.json` via `sync-guides.mjs`
- "Document Map" nav link in dashboard header with SVG rendering, category-layered layout, hover/click interactions, project filtering, and orphan detection

### Fixed

- Explicit UTF-8 encoding on all Python file I/O operations to prevent encoding issues on non-English systems

## [4.1.1] - 2026-03-11

### Added

- `/arckit.impact` command for blast radius analysis and reverse dependency tracing
- `impact-scan.mjs` hook for dependency graph pre-processing
- `/arckit.search` command for keyword, type, and requirement ID search across all project artifacts
- `/arckit.score` command for structured vendor scoring with JSON storage, comparison, sensitivity analysis, and audit trail
- Session learner skill for capturing and replaying session insights

## [4.0.2] - 2026-03-08

### Added

- `/arckit.framework` command for transforming architecture artifacts into a structured, reusable framework (agent-delegating via arckit-framework agent)
- `/arckit.glossary` command for generating comprehensive project glossary with terms, definitions, acronyms, and cross-references
- `/arckit.maturity-model` command for generating capability maturity model with current-state assessment, target-state definition, and improvement roadmap
- `arckit-framework` agent for autonomous framework synthesis from architecture artifacts
- Missing guides for `dfd`, `health`, and `init` commands
- `dfd` command added to DEPENDENCY-MATRIX with row and column

### Fixed

- Framework command referenced wrong template filename (`framework-template.md` → `framework-overview-template.md`)
- Stale command counts (53 → 57) across all docs, guides, commands.html, and extension copies
- Stale agent counts (5 → 6) in MCP servers and remote control guides

## [3.1.1] - 2026-03-05

### Fixed

- Improve skill descriptions and resolve content issues across all 4 plugin skills (#123)

### Changed

- Add .worktrees/ to gitignore

## [3.1.0] - 2026-03-05

### Added

- **Architecture Workflow process skill** — new `architecture-workflow` skill in `arckit-claude/skills/` that guides users through project onboarding with adaptive-depth questions and tailored command sequence recommendations
- 5 workflow path reference files: standard (private sector), UK Government, Defence, AI/ML modifier, Data platform modifier
- Patterns borrowed from Claude Code brainstorming skill: HARD-GATE, anti-patterns, one-question-at-a-time, adaptive depth

### Changed

- `/arckit:start` command refactored from 189-line inline logic to 21-line thin wrapper delegating to the architecture-workflow skill

## [3.0.9] - 2026-03-03

### Added

- **Governance scan pre-processor hook** (`governance-scan.mjs`) — pre-extracts all artifact metadata, requirements, principles, risks, cross-references, vendor data, and placeholder counts for `/arckit:analyze`, eliminating 20-40 Read tool calls
- Three new shared functions in `hook-utils.mjs`: `extractRequirementDetails`, `extractPrinciples`, `extractRiskEntries`
- Hook-aware shortcut preamble in `analyze.md` — skips Steps 1-2 when pre-extracted data is present

### Changed

- `extractRequirementDetails` moved from `traceability-scan.mjs` to shared `hook-utils.mjs` — no behavioral change, same function in shared location

## [3.0.8] - 2026-03-03

### Changed

- **Shared hook-utils module** — extracted 11 utility functions (`isDir`, `isFile`, `readText`, `listDir`, `mtimeMs`, `findRepoRoot`, `extractDocType`, `extractVersion`, `extractDocControlFields`, `extractRequirementIds`, `parseHookInput`) into `hook-utils.mjs`; updated 9 hooks to import from it, removing ~240 lines of duplicate code
- `COMPOUND_TYPES` now derived dynamically from `config/doc-types.mjs` instead of hardcoded — new compound doc types propagate automatically to all hooks

## [3.0.7] - 2026-03-03

### Added

- `/arckit.template-builder` command — interactive template builder that creates community-origin templates, guides, and optional shareable bundles through a 2-round interview process
- Three-tier origin model for templates and guides: Official, Custom, and Community with distinct banners
- Community guide discovery in `sync-guides.mjs` — scans `.arckit/guides-custom/` and includes community guides in the pages manifest under "Community" category
- `community.` prefix convention for user-generated slash commands
- Diagram quality gate v2 — element count thresholds per diagram type with split strategies, layout direction decision table (LR vs TB), expanded 9-criteria quality gate (was 6), per-criterion remediation table, and iterative review loop (max 3 iterations)

### Fixed

- **Wardley Maps, Data Contracts, Research, and Reviews missing from pages** — added all four doc types to sidebar navigation, search index, and dashboard counting in the pages template; added stats to the hook summary output
- **.gitkeep files leaked into manifest** — dotfiles in `external/` and `policies/` directories were included in the manifest scan; now filtered out
- **Stale statistics in docs/index.html** — updated document and command counts

### Changed

- All 50 official templates updated: `Template Status: <status>` replaced with `Template Origin: Official` banner
- All official guides updated with `Guide Origin: Official` banner after the first heading
- `/arckit:customize` now sets `Template Origin: Custom` banner when copying templates

## [2.22.5] - 2026-03-01

### Fixed

- **Template status line showed ambiguous Version label** — renamed `**Version**: [VERSION]` to `**ArcKit Version**: [VERSION]` on the status blockquote line across all 50 templates so AI correctly fills the ArcKit version instead of the document version
- **Tech-note and vendor-profile templates missing status line** — added the `> **Template Status**: Live | **ArcKit Version**: [VERSION] | **Command**: ...` blockquote to align with the other 48 templates
- **Health command always writes docs/health.json** — ensures dashboard integration works even when docs directory already exists

## [2.22.4] - 2026-03-01

### Fixed

- **Traceability hook missed FR and NFR requirements** — heading regex only matched h3 (`###`) but the requirements template uses h4 (`####`) for FR, NFR, INT, and DR sections; now matches both levels. Also changed the fallback from all-or-nothing to always-merge so regex-extracted IDs supplement heading matches instead of being silently skipped

## [2.22.3] - 2026-03-01

### Fixed

- **Pages directory tree** — moved RSCH from project root to `research/` subdirectory; added all 5 research types (RSCH, DSCT, AWRS, AZRS, GCRS) with sequence numbers to the directory tree
- **Health example filenames** — updated RSCH examples from `ARC-001-RSCH-v1.0.md` to `research/ARC-001-RSCH-001-v1.0.md`
- **Context hook missing vendor profiles and tech notes** — `arckit-context.mjs` now lists flat vendor profile files (`*-profile.md`) alongside vendor subdirectories, and scans `tech-notes/` directory so spawned knowledge from research is visible in project inventory

## [2.22.2] - 2026-03-01

### Fixed

- **Agent version detection Glob patterns** — all 5 research agents now include sequence number wildcard (`*-v*.md`) in Glob patterns for version detection, matching the multi-instance filename format (e.g., `ARC-001-RSCH-001-v1.0.md`)
- **Missing `research/` in Glob paths** — arckit-research and arckit-datascout version detection now searches `research/` subdirectory, matching where documents are actually written
- **Step numbering gaps** — fixed Step 11b → Step 11 in arckit-research (after 11a removal), fixed Step 17 → Step 16 in arckit-datascout (missing step)

## [2.22.1] - 2026-03-01

### Fixed

- **Removed VERSION file reads from 5 agents** — arckit-research, arckit-datascout, arckit-aws-research, arckit-azure-research, and arckit-gcp-research no longer instruct the agent to read `${CLAUDE_PLUGIN_ROOT}/VERSION`; the ArcKit version is already provided via the `arckit-context` SessionStart hook, eliminating unnecessary file reads (and failed `echo $CLAUDE_PLUGIN_ROOT` attempts)
- **Removed VERSION file read from start command** — `/arckit:start` now uses the ArcKit version from context instead of reading the VERSION file

## [2.22.0] - 2026-03-01

### Added

- **Centralized doc type config** — single source of truth (`config/doc-types.mjs`) for all 49 document type codes, categories, multi-instance types, and subdirectory mappings. Replaces duplicated data across 5 hooks/templates
- **Research subdirectory routing** — all research types (RSCH, AWRS, AZRS, GCRS, DSCT) now auto-route to `research/` with sequence numbers (e.g., `ARC-001-RSCH-001-v1.0.md`)
- **`typeCategories` in manifest.json** — pages-template.html reads type-to-category mappings from the manifest instead of hardcoding them, staying in sync with the central config
- **New doc type codes** — GAPS (Gap Analysis, Governance), VEND (Vendor Evaluation, Procurement) added with full metadata

### Fixed

- **HLD/DLD example filenames** — `ARC-001-HLD` → `ARC-001-HLDR`, `ARC-001-DLD` → `ARC-001-DLDR` in hld-review and dld-review commands
- **DMC subdirectory** — `data-mesh-contracts/` → `data-contracts/` in data-mesh-contract command (4 occurrences)
- **DSCT category** — standardized to Discovery (was inconsistent between hooks)
- **PLAT category** — standardized to Architecture (was inconsistent between hooks)
- **DFD missing from pages** — added to type categories

### Changed

- **Hooks import from config** — validate-arc-filename, arckit-context, sync-guides, and update-manifest now import `DOC_TYPES`, `SUBDIR_MAP`, `KNOWN_TYPES`, `MULTI_INSTANCE_TYPES` from `config/doc-types.mjs` instead of defining inline copies
- **Subdirectory scan lists derived from config** — arckit-context, sync-guides, and update-manifest derive their subdirectory scan lists from `SUBDIR_MAP` instead of hardcoding them
- **Agents use inline filenames** — removed `generate-document-id.py` calls from all 5 research agents; they now use inline filename patterns and write directly to `research/`, with the PreToolUse hook as safety net

---

## [2.21.3] - 2026-03-01

### Fixed

- **Hook context not reaching Claude** — all 4 UserPromptSubmit hooks used `systemMessage` (which per docs is only "shown to user") instead of `additionalContext` (which is "added to Claude's context"). This caused Claude to ignore hook-injected instructions like "do not call tools" and redundantly read manifest.json. Switched to `hookSpecificOutput.additionalContext` in sync-guides, health-scan, traceability-scan, and arckit-context
- **Async hooks deliver context one turn late** — `arckit-context.mjs` and `arckit-session.mjs` had `"async": true`, meaning their `additionalContext` arrived on the next conversation turn instead of the current one. Removed async flag — both are fast filesystem scans that complete in < 1 second
- **Research stats missing from pages output** — added Research row to the stats table in sync-guides.mjs

---

## [2.21.2] - 2026-03-01

(Superseded by 2.21.3 — async fix was added after tagging)

---

## [2.21.1] - 2026-03-01

### Added

- **PostToolUse manifest hook** — `update-manifest.mjs` incrementally updates `docs/manifest.json` after every ARC file write, keeping the manifest current without re-running `/arckit:pages`

### Fixed

- **Research files missing from manifest** — cloud research agents (aws-research, azure-research, gcp-research) write to `projects/*/research/` but `sync-guides.mjs` didn't scan that subdirectory. Added `research` to the subdirMap. Affected at least 3 test repos (v7, v17, v18)
- **UserPromptSubmit hooks read wrong field name** — all 5 hooks read `data.user_prompt` but the documented API field is `data.prompt`. Hooks silently got an empty string and exited. Fixed in arckit-context, sync-guides, health-scan, traceability-scan, and secret-detection
- **Hook guards reject Skill-expanded body** — `^` anchors on `isExpandedBody` regex failed when the Skill tool prefixed/wrapped the expanded command body. Removed anchors; unique `description:` strings prevent false positives. Also discovered that `UserPromptSubmit` matchers in hooks.json are silently ignored per the docs — the internal guard is the sole gating mechanism

---

## [2.21.0] - 2026-03-01

### Added

- **Traceability pre-processor hook** — automatically extracts requirements from project artifacts and computes coverage metrics before the traceability command runs

---

## [2.20.5] - 2026-02-28

### Fixed

- **Health hook fires for unrelated commands** — the `hooks.json` substring matcher triggers on any expanded command body that mentions `/arckit:health` or `/arckit:pages` (e.g. conformance, start, customize). Replaced naive regex guards with smart guards that match either the raw slash command or the Skill-expanded body's unique opening text (frontmatter description or heading). Applies to both `sync-guides.mjs` and `health-scan.mjs`.

---

## [2.20.4] - 2026-02-28

### Fixed

- **Pages command ignores hook stats and reads manifest** — removed all tools from `allowed-tools` (was `Read, Glob, Grep`), reformatted hook stats as a markdown table with explicit heading, and added triple-layered "do not call any tools" instructions to prevent the AI from second-guessing the hook's output.

---

## [2.20.3] - 2026-02-28

### Fixed

- **Hooks fail via Skill tool** — removed redundant `user_prompt` regex guards from `sync-guides.mjs` and `health-scan.mjs`. The `hooks.json` matcher already gates each hook; the internal guard silently aborted when the Skill tool passed the expanded command body instead of the raw slash command.

---

## [2.20.2] - 2026-02-28

### Fixed

- **ANAL files missing from pages manifest** — removed Write from `/arckit:pages` allowed-tools so the AI cannot overwrite the hook-generated manifest; strengthened instruction to skip all tool use. Fixed ANAL category mismatch: `sync-guides.mjs` and `pages.md` reference table now map ANAL to Governance (matching `pages-template.html`).

---

## [2.20.1] - 2026-02-28

### Fixed

- **Analysis report type code** — standardized `ANLZ` → `ANAL` across all commands (analyze, health, story, service-assessment) and guides. Files named `ARC-*-ANLZ-*.md` were invisible to the manifest scanner and health hook because metadata tables only recognized `ANAL`.

---

## [2.20.0] - 2026-02-28

### Added

- **Health pre-processor hook** (`health-scan.mjs`) — new `UserPromptSubmit` hook pre-extracts all artifact metadata and applies all 7 detection rules (STALE-RSCH, FORGOTTEN-ADR, UNRESOLVED-COND, ORPHAN-REQ, MISSING-TRACE, VERSION-DRIFT, STALE-EXT) in Node.js, eliminating 20-50+ Read tool calls. The `/arckit:health` command now just formats the console output from hook findings.

---

## [2.19.0] - 2026-02-28

### Added

- **Pages pre-processor hook** — the `sync-guides` hook now handles the entire `/arckit:pages` pipeline (guide sync, title extraction, repo info, template processing, project scanning, manifest generation), reducing the command from ~310 tool calls to zero. The 134KB HTML template and ~95 guide files never enter the context window.

---

## [2.18.0] - 2026-02-28

### Added

- **Guide sync hook** (`sync-guides.mjs`) — new `UserPromptSubmit` hook replaces ~190 Read+Write tool round-trips in `/arckit:pages` with native `fs.copyFileSync`, mtime-based smart skipping, zero tool calls

---

## [2.17.0] - 2026-02-28

### Added

- **Tiered deviation classification** for conformance assessment — GREEN/YELLOW/RED tiers overlay on PASS/FAIL system, classifying FAIL findings by actionability: RED (escalate), YELLOW (negotiate), GREEN (acceptable) (#95)
- **Conversational gathering rules** (max 2 rounds) added to 15 commands for structured user input collection (#94)
- **STANDALONE/SUPERCHARGED degradation** for cloud research commands — graceful fallback when MCP servers are unavailable (#93)

---

## [2.16.0] - 2026-02-28

### Added

- **Quality checklist** (`references/quality-checklist.md`) — shared artifact verification with 10 common checks and 47 per-type checks keyed by document type code; introduces `references/` directory pattern (#92)
- **`argument-hint` frontmatter** on all 53 plugin commands — IDE-visible hints for required arguments

---

## [2.15.1] - 2026-02-28

### Added

- **`allowed-tools` frontmatter** on all 53 plugin commands — explicit tool permissions per command for tighter security and predictability

### Fixed

- Replace Python script calls (`create-project.py`, `generate-document-id.py`, `list-projects.py`) with inline Glob/Write instructions in 20 commands — commands no longer shell out to scripts
- Remove `Bash` from `allowed-tools` in 50 commands that don't need it (down from 53 to only 3: `story`, `init`, `trello`)
- Markdown lint CI now recurses into subdirectories correctly
- Suppress MD038 false positive for intentional space-in-code-span in DEPENDENCY-MATRIX.md

---

## [2.15.0] - 2026-02-28

### Added

- **Markdown linting CI** — markdownlint-cli2 configuration and GitHub Actions workflow enforcing consistent formatting across 571 markdown files; skills override for third-party reference docs

### Fixed

- Trailing whitespace, missing blank lines around headings/lists/fences, bare code fences, emphasis style inconsistencies across all commands, templates, guides, and agents

---

## [2.14.0] - 2026-02-28

### Added

- **Handoffs frontmatter** — 16 plugin commands now declare `handoffs:` in YAML frontmatter for machine-readable workflow navigation (requirements, stakeholders, risk, sobc, research, datascout, data-model, wardley, adr, sow, roadmap, aws/azure/gcp-research, strategy, backlog)
- **Release automation** — `scripts/generate-release-notes.sh` parses git log into Keep a Changelog sections; `.github/workflows/release.yml` creates GitHub Releases on tag push
- **Version automation** — `scripts/bump-version.sh` updates all 11 version files in one command

### Changed

- **Converter uses PyYAML** — `extract_frontmatter_and_prompt()` now uses `yaml.safe_load()` instead of regex, enabling parsing of complex frontmatter fields like `handoffs:`
- **Converter renders handoffs** — `render_handoffs_section()` appends a `## Suggested Next Steps` section to Codex/OpenCode/Gemini output for commands with handoffs
- **Config-driven converter** — refactored `scripts/converter.py` to use `AGENT_CONFIG` dictionary; adding a new AI target only requires a new dict entry

---

## [2.13.2] - 2026-02-28

### Fixed

- **Node.js hooks** — rewrote all 7 plugin hooks from Python to Node.js (.mjs) for Windows compatibility; `python3` doesn't exist on Windows but Node.js is guaranteed on every Claude Code installation (#86)
- Deleted 8 legacy `.py` hook files and 5 legacy `.sh` hook files (13 files removed)
- Added `async: true` to non-blocking hooks (arckit-session, arckit-context) for faster session start
- Version bump across all distribution formats

---

## [2.13.1] - 2026-02-27

### Fixed

- **Cross-platform commands** — removed bash-only patterns (`ls|sort|tail`, `mkdir -p`, `basename`, `sed`, `xargs`) from 7 commands (adr, customize, data-mesh-contract, init, pages, trello, wardley) replacing with Glob/Read/Write tool instructions
- **Cross-platform agents** — replaced `ls|sort -V|tail` version detection with Glob instructions and `generate-document-id.sh` references with `.py` across all 5 agents (research, aws-research, azure-research, gcp-research, datascout)
- **Wardley hook** — changed from bash to python3 for validate-wardley-math hook
- **Trello command** — added Windows PowerShell alternatives for environment variable checks
- **Migration guide** — added platform note that migrate-filenames.sh requires bash (Git Bash / WSL on Windows)
- Regenerated all Codex/OpenCode/Gemini formats via converter

---

## [2.13.0] - 2026-02-27

### Added

- **NCSC Vulnerability Monitoring Service (VMS)** — `/arckit:secure` now assesses VMS enrollment in CAF C2 and includes a VMS Integration subsection (Section 6.1) with 8-day domain / 32-day general remediation benchmarks
- **Cyber Action Plan Alignment** (Section 9.4) — `/arckit:secure` template tracks departmental alignment with the £210m cross-government Cyber Action Plan across four pillars (Skills, Tooling, Resilience, Collaboration)
- **Government Cyber Security Profession** (Section 11) — `/arckit:secure` template assesses CCP certification, DDaT role mapping, Cyber Academy engagement, and workforce development planning
- **Structured vulnerability management** — `/arckit:operationalize` Section 11 expanded with 11.3 Vulnerability Scanning (VMS integration), 11.4 Remediation SLAs (severity-based + VMS benchmarks), and 11.5 Patch Management
- **Critical Vulnerability Remediation runbook** (6.7) — `/arckit:operationalize` template includes full runbook for critical CVEs and VMS alerts

### Changed

- `/arckit:secure` GovS 007 mapping updated: principle 5 (Security culture) references Cyber Security Profession, principle 8 (Continuous improvement) references Cyber Action Plan
- `/arckit:operationalize` handover checklist and NCSC guidance sections include VMS enrollment items
- Version bump across all distribution formats

---

## [2.12.3] - 2026-02-26

### Changed

- **Pages header: Repository icon** — replaced "Repository" text link with a GitHub icon positioned next to the dark/light mode toggle
- **Pages header: version badge** — added ArcKit version badge (`v{{VERSION}}`) to the header menu, populated from the plugin's VERSION file via new `{{VERSION}}` placeholder
- Version bump across all distribution formats

---

## [2.12.2] - 2026-02-26

### Fixed

- **Pages template: GitHub Pages fallback** (#80) — relative paths (`../`) don't work on GitHub Pages because only the `/docs` folder is published; template now tries relative paths first (works for local/full-repo hosting), then falls back to `raw.githubusercontent.com` (works for GitHub Pages public repos)
- **New `{{CONTENT_BASE_URL}}` placeholder** — `/arckit:pages` command sets this to the raw.githubusercontent.com base URL for GitHub repos, enabling the fallback; non-GitHub hosting can set it to empty string

### Changed

- Version bump across all distribution formats

---

## [2.12.1] - 2026-02-26

### Changed

- **Pages template: relative paths instead of GitHub raw URLs** (#79) — `docs/index.html` now loads documents via `../${path}` relative paths instead of `raw.githubusercontent.com`, making the site deployable to any static hosting provider (GitHub Pages, Netlify, Vercel, S3, etc.)
- **Pages command: hosting-agnostic language** (#79) — description and summary updated from "GitHub Pages" to generic "documentation site" terminology with multi-provider deployment instructions
- **Pages error handling: safe DOM methods** (#79) — error display refactored from innerHTML to safe DOM construction (`createElement`/`textContent`), simplified to generic "Document not found" message
- Version bump across all distribution formats

---

## [2.12.0] - 2026-02-26

### Added

- **STALE-EXT detection rule for `/arckit:health`** (#77) — 7th detection rule flags external files in `external/` that are newer than a project's latest artifact, with filename-to-command mapping (e.g., `*api*` → `/arckit:requirements`, `/arckit:data-model`, `/arckit:diagram`) for targeted remediation
- **SessionStart hook external file detection** (#77) — auto-detects new external files at session start and reports them in context with project name and file count
- **UserPromptSubmit hook external file flagging** (#77) — context hook now marks external files as `(**NEW** — newer than latest artifact)` when they are newer than the project's most recent ARC-* artifact
- **PlantUML Syntax Reference skill** (`plantuml-syntax`) (#78) — 10 reference files covering C4-PlantUML (with layout conflict rules), sequence diagrams, class diagrams, activity diagrams, state diagrams, ER diagrams, component diagrams, use case diagrams, common syntax errors, and styling guide
- **C4-PlantUML layout conflict rules** (#78) — explicit rules preventing `Rel_Down`/`Lay_Right` contradictions: directional consistency, vertical consistency, all-pairs agreement, and coverage requirements with validation checklist
- **Format-specific syntax loading in `/arckit:diagram`** (#78) — Step 1d now conditionally loads PlantUML or Mermaid references based on selected output format; PlantUML format loads `c4-plantuml.md` with layout conflict rules
- **Mermaid ERD syntax rules in `/arckit:diagram`** (#78) — explicit rules preventing invalid `PK_FK` key type (must use `PK, FK` comma-separated); loads `entityRelationshipDiagram.md` reference for ER content

### Changed

- Version bump across all distribution formats

---

## [2.11.0] - 2026-02-26

### Added

- **`/arckit.start` onboarding command** — guided entry point with project detection, tool survey, command decision tree, and context-aware workflow routing
- **Mermaid Syntax Reference skill** (`mermaid-syntax`) — 30 official Mermaid syntax reference files (auto-synced from [WH-2099/mermaid-skill](https://github.com/WH-2099/mermaid-skill)) covering all 23 diagram types plus configuration and theming, bundled with ArcKit's existing C4 layout science reference
  - 10 Mermaid-generating commands (`diagram`, `roadmap`, `plan`, `story`, `dfd`, `backlog`, `strategy`, `presentation`, `data-model`, `jsp-936`) now read type-specific syntax references before generating Mermaid code
  - Conversational skill triggers on Mermaid syntax questions (e.g., "what Mermaid diagram types can I use?", "gantt chart date format")

### Changed

- **Getting Started guide** now covers both `/arckit.start` and `/arckit.init` in a single combined guide with a quick-start section, replacing the previous start-only guide
- **GitHub Pages Getting Started section** updated with new steps 4 (`/arckit.start`) and 5 (`/arckit.init`) before the GDS phases workflow
- **`/arckit.pages` command** — added 5 missing guides to category and status tables: `start`, `conformance`, `productivity`, `remote-control`, `mcp-servers`
- Moved `c4-diagram-reference.md` from `templates/` to `skills/mermaid-syntax/references/c4-layout-science.md` — `/arckit.diagram` Step 1d path updated
- Version bump across all distribution formats

---

## [2.10.0] - 2026-02-25

### Added

- **DDaT Role Guides** (#75) — 18 new role-based guides mapping ArcKit commands to [UK Government DDaT Capability Framework](https://ddat-capability-framework.service.gov.uk/) roles, so users can find the commands relevant to their job
  - **Architecture** (7): Enterprise Architect, Solution Architect, Data Architect, Security Architect, Business Architect, Technical Architect, Network Architect
  - **Chief Digital and Data** (3): CTO/CDIO, CDO, CISO
  - **Product and Delivery** (4): Product Manager, Delivery Manager, Business Analyst, Service Owner
  - **Data** (2): Data Governance Manager, Performance Analyst
  - **IT Operations** (1): IT Service Manager
  - **Software Development** (1): DevOps Engineer
- Each guide includes primary commands, secondary commands, typical workflow, key artifacts, and related roles
- **"Roles" nav link** in GitHub Pages template — new top-level navigation alongside Dashboard and Guides
- `showRolesIndex()` function in pages template — renders role guides grouped by DDaT family with command counts
- Role guides added to search index in pages template
- `roleGuides` array in `manifest.json` schema — separate from command guides
- Updated `/arckit.pages` command to sync and index role guides from `docs/guides/roles/`

### Changed

- Version bump across all distribution formats

---

## [2.9.0] - 2026-02-25

### Added

- **Architecture Conformance Assessment** (`/arckit.conformance`) (#55) — new command for systematic decided-vs-designed conformance checking with 12 conformance rules: ADR decision implementation, cross-ADR consistency, superseded ADR enforcement, principles-to-design alignment, review condition resolution, exception register expiry/remediation, technology stack drift, architecture pattern drift, custom constraint rules (ArchCNL-style via `.arckit/conformance-rules.md`), known and untracked architecture technical debt
- New template: `conformance-assessment-template.md`
- New guide: `conformance.md`
- New doc type code: `CONF` (added to filename validation hook and context hook)
- Added `CONF` migration entry to `migrate-filenames.sh`
- Updated DEPENDENCY-MATRIX.md with conformance row/column and critical paths

### Changed

- Version bump across all distribution formats

---

## [2.8.8] - 2026-02-25

### Fixed

- **Markdown escaping for `<` and `>` in generated documents** (#67) — added instruction to all 49 document-generating commands and 5 agents to space-separate less-than/greater-than comparisons (e.g., `< 3 seconds` instead of `<3 seconds`) so markdown renderers don't misinterpret them as HTML tags or emoji
- Fixed unescaped `<` examples in `requirements.md` and `servicenow.md`

### Changed

- Version bump across all distribution formats

---

## [2.8.7] - 2026-02-25

### Added

- **PlantUML rendering in Pages** — `pages-template.html` now renders ` ```plantuml ``` ` code blocks as SVG diagrams via the PlantUML server (`plantuml.com/plantuml/svg/`), with interactive pan/zoom controls, dark mode support (CSS invert filter), fullscreen, scroll-to-zoom, keyboard shortcuts, and error fallback; no new JS dependencies required

### Changed

- Version bump across all distribution formats (CLI, plugin, Gemini extension, OpenCode extension, marketplace)

---

## [2.8.6] - 2026-02-25

### Fixed

- **Mermaid label compatibility for presentations** (#73, #70) — added ASCII-only, no-hyphens, no-special-characters rules to `/arckit.presentation` command, template, and guide; Mermaid's parser breaks on accented characters (é, í, ó) and hyphens in `quadrantChart` data point labels
- **Diagram command UX** (#71, #65) — `/arckit.diagram` now asks both diagram type and output format in a single `AskUserQuestion` call instead of sequentially; skip rules clarified for partial arguments

### Added

- **Mermaid Compatibility section** in presentation guide — documents label restrictions with troubleshooting advice
- **OpenCode extension guides** — MCP servers setup guide and Architecture Productivity Guide synced to OpenCode extension

### Changed

- Version bump across all distribution formats (CLI, plugin, Gemini extension, OpenCode extension, marketplace)

---

## [2.8.5] - 2026-02-24

### Added

- **PlantUML C4 output format for `/arckit.diagram`** (#65) — C4 diagram types (Context, Container, Component) now offer PlantUML C4 as an alternative to Mermaid, with directional layout hints (`Rel_Right`, `Rel_Down`, `Lay_Right`, `Lay_Down`) for precise control on complex diagrams with more than 12 elements
- **Format selector** — interactive prompt (Question 2) lets users choose Mermaid or PlantUML C4 for C4 types; skip with `/arckit.diagram context plantuml`
- **PlantUML C4 examples** — Modes A, B, C include PlantUML examples alongside Mermaid
- **PlantUML syntax guidelines** — include URLs, element syntax, directional relationships, invisible layout constraints
- **PlantUML validation checks** — Step 5 validates directional variants, `Lay_Right`/`Lay_Down` constraints, `@startuml`/`@enduml` wrappers
- **Template PlantUML section** — architecture diagram template includes PlantUML code block, syntax reference, and directional hints quick-reference table
- **Guide update** — diagram guide includes format comparison table (Mermaid vs PlantUML) and PlantUML example
- **Platform support documentation** (#71) — README and docs/index.html note that ArcKit targets Linux, with devcontainer/WSL2 recommended for Windows
- **Pages template support for `/arckit:customize`** (#72) — users can now customize the pages HTML template

### Changed

- Version bump across all distribution formats (CLI, plugin, Gemini extension, OpenCode extension, marketplace)

---

## [2.8.4] - 2026-02-24

### Added

- **Interactive zoom/pan for Mermaid diagrams** — scroll to zoom, drag to pan, double-click to zoom in, toolbar controls (zoom-in, zoom-out, reset, fullscreen), keyboard shortcuts (`+`/`-`/`0`/`f`/`Escape`), and touch pinch-to-zoom via svg-pan-zoom library
- **Diagram fullscreen mode** — expand any diagram to a full-screen overlay with `f` key or toolbar button
- **Accessible diagram controls** — focusable viewports with ARIA labels, keyboard navigation, always-visible controls on mobile/touch devices

### Changed

- Version bump across all distribution formats

---

## [2.8.3] - 2026-02-20

### Added

- **Dark mode for pages template** — CSS-variable-driven dark theme with sun/moon toggle in header, system preference detection (`prefers-color-scheme`), and localStorage persistence
- **Auto-sync guides from plugin** — `/arckit:pages` now copies all guides from the plugin to `docs/guides/` before scanning, ensuring repos always have the latest guides
- **4 missing guides synced to plugin** — `artifact-health`, `c4-layout-science`, `knowledge-compounding`, `security-hooks`

### Changed

- Replaced ~35 hardcoded colour values in pages template with semantic CSS variables
- Mermaid diagrams switch between default/dark theme based on mode
- SVG donut chart text colour reads from CSS variable for dark mode compatibility
- Version bump across all distribution formats

---

## [2.8.2] - 2026-02-20

### Added

- **Health dashboard panel in `/arckit:pages`** — pages template loads `docs/health.json` (when present) and renders an Artifact Health panel with severity bars, findings-by-type breakdown, and a per-project Health column with traffic-light colours
- **`JSON=true` flag for `/arckit:health`** — writes machine-readable `docs/health.json` for dashboard integration alongside the console report

### Fixed

- **All 64 guides now listed in pages command** — added 19 missing guides to category/status tables and corrected status discrepancies (sow/evaluate/customize → live, pages → alpha per README)

### Changed

- Version bump across all distribution formats

---

## [2.8.1] - 2026-02-20

### Added

- **Vendor profiles & tech notes in `/arckit:pages`** — pages command and HTML template now discover, index, and display vendor profiles (`vendors/*-profile.md`) and tech notes (`tech-notes/*.md`) with search, dashboard metrics, Knowledge column, and sidebar navigation (#62)

### Changed

- Version bump across all distribution formats

---

## [2.8.0] - 2026-02-20

### Added

- **Knowledge compounding from research** — research agent now spawns standalone vendor profiles and tech notes from research findings, extracting reusable knowledge that persists beyond the originating project
- New `vendor-profile-template.md` and `tech-note-template.md` templates for spawned knowledge files
- `--no-spawn` flag for `/arckit.research` to skip knowledge compounding when only the main research document is needed
- Documentation: `docs/guides/knowledge-compounding.md` explaining the compound knowledge pattern, deduplication, and directory structure
- **`/arckit:health` command** — scans all projects for stale research, forgotten ADRs, unresolved review conditions, orphaned artifacts, missing traceability, and version drift
- Documentation: artifact-health guide
- **Security hooks** — three new hooks for secret and sensitive file protection:
  - `file-protection.py` — blocks edits to sensitive files (environment files, credentials, private keys, lock files) with configurable exception lists
  - `secret-detection.py` — scans user prompts for potential secrets (API keys, tokens, passwords, connection strings) before they reach the model
  - `secret-file-scanner.py` — scans file content being written for embedded secrets with skip patterns for documentation files
- Documentation: `docs/guides/security-hooks.md` — three-layer protection model guide
- **C4 layout science reference template** — `c4-diagram-reference.md` with research-backed graph drawing guidance: Sugiyama algorithm, tier-based declaration ordering, edge crossing targets (Purchase et al.), C4 colour standards, node shape reference, PlantUML directional hints, prompt antipatterns, and iterative refinement process
- **Diagram quality gate** — structured 6-criterion validation checklist added to `/arckit:diagram` command (edge crossings, visual hierarchy, grouping, flow direction, traceability, abstraction level)
- **C4 layout science guide** — `docs/guides/c4-layout-science.md` standalone reference for C4 diagram best practices

### Changed

- Version bump across all distribution formats

---

## [2.7.1] - 2026-02-20

### Added

- **Wardley Map validation Stop hook** — new `validate-wardley-math.sh` hook fires on Stop for the `/arckit.wardley` command, validating stage-evolution alignment, coordinate ranges [0,1], and OWM code block consistency against Component Inventory tables; blocks stop with actionable error details on failure

### Changed

- Version bump across all distribution formats

---

## [2.7.0] - 2026-02-19

### Added

- **UK Government Cyber Security Standard integration** — `/arckit.secure` template now includes three new sections for CSS compliance (July 2025, Cabinet Office):
  - **9.1 GovAssure Status** — tracker for critical system assurance (cycle year, per-system status, findings, remediation)
  - **9.2 Secure by Design Confidence Rating** — self-assessment against SbD high-confidence profile (principles checklist, gap analysis)
  - **9.3 Cyber Security Standard Exception Register** — non-compliance management per CSS clauses 4.3/4.4 (exception ID, risk assessment, approval authority, improvement plan)
- CSS reference added to Executive Summary, External References, command prompt, and guide
- GovAssure and CSS URLs added to command Resources section
- **GovS 007: Security alignment** — `/arckit.secure` template now includes:
  - **Section 10: GovS 007 Alignment Summary** — mapping table of 9 principles to CAF sections and ArcKit artefacts, plus named security roles table (SSRO, DSO, SIRO)
  - SSRO and DSO added to Approval & Sign-Off section
  - GovS 007 entry added to External References
- New `docs/guides/govs-007-security.md` reference guide cross-mapping GovS 007 principles, security lifecycle, protective security disciplines, and key roles to ArcKit commands
- GovS 007 security roles (SSRO, DSO, SIRO, Cyber Security Lead) added to stakeholders template alongside existing GovS 005 digital roles
- **National Data Strategy reference guide** — new `docs/guides/national-data-strategy.md` mapping NDS 5 missions and 4 pillars to ArcKit commands and artefacts, with pillar checklists and National Data Library context
- NDS added to UK Government standards map (Mermaid diagram, lifecycle table, reference links)
- NDS cross-reference added to data-model command, template, and guide
- **Government Data Quality Framework reference guide** — new `docs/guides/data-quality-framework.md` mapping DQF 5 principles, 6 dimensions, 4 practical tools, maturity model, and data lifecycle to ArcKit artefacts
- DQF alignment note added to data-model template's existing Data Quality Framework section
- DQF cross-reference added to data-model command and guide
- **UK Government Codes of Practice reference guide** — new `docs/guides/codes-of-practice.md` mapping the Rainbow of Books (Magenta, AQuA, Rose, Commercial Playbooks) alongside existing Green/Orange Book coverage to ArcKit commands, with delivery lifecycle mapping
- Magenta Book and Sourcing Playbook references added to SOBC command
- Sourcing Playbook and DDaT Playbook references added to DOS command
- Sourcing Playbook reference added to SOW command
- Magenta Book, Orange Book, AQuA Book, and Rose Book nodes added to standards map Mermaid diagram
- **New `/arckit:presentation` command** — generates MARP-format slide decks from existing project artifacts for governance boards, stakeholder briefings, and gate reviews
  - Supports 4 presentation focus modes: Executive, Technical, Stakeholder, Procurement
  - Configurable slide count (6-8, 10-12, 15-20)
  - Reads all available project artifacts and extracts key content into slides
  - Embeds Mermaid diagrams (Gantt, pie, C4, quadrant charts)
  - MARP output renders to PDF/PPTX/HTML via MARP CLI or VS Code extension
  - Doc type code: `PRES`
- New `presentation-template.md` with MARP frontmatter, Document Control, and slide structure
- New `docs/guides/presentation.md` with rendering instructions and focus option reference
- **Data Commons MCP integration for `/arckit.datascout`** — datascout agent now uses `search_indicators` and `get_observations` tools from the Data Commons MCP (when available) to discover and validate UK statistical data (population, GDP, health, climate, government spending) before category-specific web research; includes sub-national NUTS2 regional queries; skips gracefully if MCP not configured
- **Pinecone MCP integration for `/arckit.wardley`** — wardley command now searches the Wardley Mapping book corpus via Pinecone `search-records` (when available) for relevant strategic context, case studies, gameplay patterns, and evolution analysis; complements local reference files with full book depth; skips gracefully if Pinecone MCP not configured
- New `docs/guides/pinecone-mcp.md` — optional integration guide covering Wardley book knowledge base, configuration, prerequisites, and command integration

---

## [2.6.0] - 2026-02-17

### Added

- **SessionStart hook for version injection** — new `hooks/arckit-session.sh` fires once at session start (and on resume/clear/compact), injecting the ArcKit plugin version into Claude's context and exporting `ARCKIT_VERSION` as an environment variable; also detects whether a `projects/` directory exists
- **OpenCode CLI support** — 4th distribution format (`arckit-opencode/`); `scripts/converter.py` now generates OpenCode markdown alongside Codex and Gemini formats

### Changed

- **Removed per-command VERSION file reads from 46 commands** — commands no longer instruct Claude to read `${CLAUDE_PLUGIN_ROOT}/VERSION`; the version is now provided via `{ARCKIT_VERSION}` from the SessionStart hook context, eliminating a redundant Read tool call on every command invocation
- Updated `hooks.json` to include `SessionStart` event alongside existing `UserPromptSubmit` and `PreToolUse` hooks
- Version bump across all distribution formats (CLI, plugin, extension, marketplace)

---

## [2.5.1] - 2026-02-17

### Changed

- **Removed `generate-document-id.sh` calls from 29 commands** — replaced bash script invocations with inline document ID format strings (e.g., `ARC-{PROJECT_ID}-REQ-v{VERSION}`); the PreToolUse hook now auto-corrects ARC filenames, making script calls redundant. The script itself is retained for `arckit init` and standalone use.
- Version bump across all distribution formats (CLI, plugin, extension, marketplace)

---

## [2.5.0] - 2026-02-17

### Added

- **UserPromptSubmit hook for project context** — new `hooks/arckit-context.sh` hook automatically detects all projects, artifacts, external documents, and global policies before any `/arckit:` command runs, injecting structured context via `systemMessage`
- **Plugin hooks configuration** — new `hooks/hooks.json` firing `arckit-context.sh` on every `UserPromptSubmit` event (skips non-arckit and utility commands)
- **PreToolUse (Write) hook for filename enforcement** — new `hooks/validate-arc-filename.sh` auto-corrects ARC filenames before the Write tool creates them: zero-pads project IDs, normalizes version format, moves multi-instance types (ADR, DIAG, DFD, WARD, DMC) to correct subdirectories, assigns next sequence numbers, and blocks unknown doc type codes

### Changed

- **Refactored 39 commands to use hook-provided context** — removed boilerplate directory scanning, `ARC-*-TYPE-*.md` glob patterns, verbose external docs blocks, and `list-projects.sh` calls; replaced with compact hook-aware references (net -1,071 lines, 66% boilerplate reduction)
- Version bump across all distribution formats (CLI, plugin, extension, marketplace)

---

## [2.4.5] - 2026-02-15

### Added

- **New `/arckit:dfd` command** — Data Flow Diagram (DFD) generation with multi-instance support, document control, and DFD-specific template
- **DFD multi-instance document type** — `DFD` added to `generate-document-id.sh` for sequential numbering (ARC-001-DFD-001, ARC-001-DFD-002, etc.)

### Changed

- **Explicit VERSION file path in all commands and agents** — all 49 commands and 5 agents now reference `${CLAUDE_PLUGIN_ROOT}/VERSION` instead of bare `VERSION`, ensuring the ArcKit version is always read from the plugin's authoritative file regardless of project state
- Version bump across all distribution formats (CLI, plugin, extension, marketplace)

---

## [2.4.4] - 2026-02-12

### Fixed

- **Windows cp1252 encoding fix** — added explicit `encoding='utf-8'` to all file I/O operations in `arckit init` to prevent `UnicodeEncodeError` on Windows (fixes #49)

### Changed

- Version bump across all distribution formats (CLI, plugin, extension, marketplace)

---

## [2.4.3] - 2026-02-11

### Added

- **Data Commons MCP server for Gemini extension** — added `datacommons-mcp` to the Gemini extension MCP configuration, matching the Claude plugin

### Changed

- Version bump across all distribution formats (plugin, extension, marketplace)

---

## [2.4.2] - 2026-02-11

### Added

- **Data Commons MCP server** — bundled as a plugin MCP server for statistical data access (population, economics, health, etc.)

### Fixed

- Version bump to force plugin cache refresh for MCP server testing

---

## [2.4.1] - 2026-02-10

### Added

- **Gemini CLI native extension** — ArcKit is now available as a Gemini CLI extension at [`tractorjuice/arckit-gemini`](https://github.com/tractorjuice/arckit-gemini), giving Gemini users the same zero-config experience as the Claude Code plugin
  - Install: `gemini extensions install https://github.com/tractorjuice/arckit-gemini`
  - Bundled MCP servers (AWS Knowledge, Microsoft Learn via mcp-remote), optional Google Developer Knowledge
  - All 48 commands, templates, scripts, guides, and Wardley Mapping skill included
  - Extension version tracks plugin version (v2.4.1)
- `scripts/converter.py` now generates extension output alongside Codex format, with path rewriting (`${CLAUDE_PLUGIN_ROOT}` -> `~/.gemini/extensions/arckit`)

### Fixed

- **Gemini extension workspace sandbox fix**: Extension commands prepend a file access instruction block telling the model to use `run_shell_command` instead of `read_file` for extension paths (Gemini CLI sandboxes `read_file` to the project directory). `Read` instructions are also rewritten to `cat` commands in extension output.

### Changed

- **CLI is now Codex-only**: Gemini CLI removed from the CLI package — Gemini users should use the native extension instead. The converter now generates 2 output formats (Codex + Extension) instead of 3.

---

## [2.4.0] - 2026-02-09

### Added

- **Google Cloud Research** (`/arckit:gcp-research`) — new command + agent for GCP-specific technology research using the [Google Developer Knowledge MCP](https://developerknowledge.googleapis.com/mcp) server
  - Mirrors the existing AWS and Azure research commands (thin wrapper + autonomous agent)
  - Architecture Framework assessment (6 pillars: Operational Excellence, Security/Privacy/Compliance, Reliability, Cost Optimization, Performance Optimization, Sustainability)
  - Security Command Center mapping (CIS Benchmark for GCP, vulnerability/misconfiguration/threat findings)
  - UK Government: G-Cloud procurement, europe-west2 (London) data residency, NCSC alignment
  - Cost optimization: Committed Use Discounts (CUDs), Sustained Use Discounts (SUDs), Spot VMs, E2 machine types
  - IaC: Terraform (primary), Cloud Build CI/CD pipelines
  - Doc type code: `GCRS`
- Added `google-developer-knowledge` MCP server to plugin `.mcp.json` (requires `GOOGLE_API_KEY` env var)
- Added GCP research template, guide, and dependency matrix entry

---

## [2.3.1] - 2026-02-09

### Fixed

- Pass directory argument to `--next-num` in multi-instance commands (wardley, diagram, data-mesh-contract) to prevent unbound variable crash with `set -u`
- Added guard in `generate-document-id.sh` to give a clear error message when directory is missing
- Replace Mermaid `gitGraph` with `flowchart` in devops template — gitGraph has limited renderer support and fails with "No diagram type detected" errors in GitHub/VS Code
- Added diagram guidelines to devops command to prevent gitGraph usage in generated documents

---

## [2.3.0] - 2026-02-09

### Added

- **Mathematical models** for Wardley Mapping skill — new `references/mathematical-models.md` with evolution scoring formulas, decision metrics (differentiation pressure, commodity leverage, dependency risk), and weak signal detection framework
- Quantitative analysis triggers in skill description (score evolution, calculate ubiquity, differentiation pressure, commodity leverage, weak signal detection, readiness score)
- Optional **Step 6: Quantitative Analysis** in SKILL.md mapping workflow
- Numeric scoring rubric (ubiquity/certainty scales) added to `references/evolution-stages.md`
- Quantitative positioning worked example added to E-Commerce Platform in `references/mapping-examples.md`

---

## [2.2.1] - 2026-02-09

### Fixed

- Added explicit `list-projects.sh --json` step to 9 commands (stakeholders, requirements, adr, sow, roadmap, strategy, dpia, platform-design, data-mesh-contract) to prevent Claude from guessing wrong script paths in plugin-based repos that no longer have `.arckit/scripts/bash/`

---

## [2.2.0] - 2026-02-09

### Added

- **Wardley Mapping skill** (`skills/wardley-mapping/`) for conversational Wardley Mapping — quick questions, evolution stage lookups, doctrine assessments, and interactive map creation with AskUserQuestion
- 5 reference files shared between skill and `/arckit:wardley` command: evolution stages, doctrine, gameplay patterns, climatic patterns, and mapping examples
- Enhanced strategic analysis in `/arckit:wardley` command — now reads shared reference files for doctrine assessment, gameplay patterns, climatic patterns, and mapping examples
- Output documents now include Doctrine Assessment Summary, Applicable Gameplay Patterns, and Climatic Pattern Analysis sections

## [2.1.9] - 2026-02-08

### Added

- Interactive configuration using AskUserQuestion for 8 key commands: backlog, diagram, plan, adr, dpia, sow, sobc, roadmap
- Commands now ask users about key decision points (prioritization approach, diagram type, contract type, evaluation weighting, etc.) before generating documents
- Questions are automatically skipped when users specify preferences via command arguments

## [2.1.8] - 2026-02-07

### Removed

- Redundant SessionStart hook that checked for already-bundled MCP servers (AWS Knowledge + Microsoft Learn are guaranteed by plugin `.mcp.json`)

## [2.1.7] - 2026-02-07

### Changed

- Plugin is now the **sole Claude Code distribution** — CLI no longer ships `.claude/commands/` or `.claude/agents/`
- All 22 test repos migrated from synced files to plugin marketplace

## [2.1.5] - 2026-02-07

### Added

- Bundled Microsoft Learn MCP server (`https://learn.microsoft.com/api/mcp`) via `.mcp.json`

### Changed

- Removed redundant MCP availability checks from Azure research commands (MCP now guaranteed by plugin)

## [2.1.4] - 2026-02-07

### Added

- Bundled AWS Knowledge MCP server (`https://knowledge-mcp.global.api.aws`) via `.mcp.json`

### Changed

- Renamed plugin commands to remove `arckit.` prefix for clean namespacing (e.g. `arckit.requirements` → `requirements`)
- Removed redundant MCP availability checks from AWS research commands (MCP now guaranteed by plugin)

## [2.1.3] - 2026-02-06

### Fixed

- Added missing `get_arckit_dir` and `get_templates_dir` functions to plugin `common.sh`
- Converted `arckit-init` from skill to slash command

## [2.1.2] - 2026-02-06

### Fixed

- Removed `hooks` field from `plugin.json` (auto-discovered from `hooks/` directory)

## [2.1.1] - 2026-02-06

### Fixed

- Reference agents by name in commands instead of `subagent_type: "general-purpose"` workaround
- Removed `agents` field from `plugin.json` (auto-discovered from `agents/` directory)
- Removed invalid `color`, `permissionMode`, `tools` fields from agent frontmatter (invalid in plugin context)

## [2.1.0] - 2026-02-06

### Added

- Initial plugin release for Claude Code marketplace
- 46 slash commands for architecture governance artifact generation
- 4 autonomous agents (research, datascout, aws-research, azure-research)
- 35 document templates with Document Control standard
- Helper scripts (`common.sh`, `create-project.sh`, `generate-document-id.sh`, etc.)
- Command usage guides
- `marketplace.json` for plugin discovery
- MIT LICENSE

### Changed

- All commands use `${CLAUDE_PLUGIN_ROOT}` for template and script references
- Agent frontmatter uses only valid plugin fields (`name`, `description`, `model`)
