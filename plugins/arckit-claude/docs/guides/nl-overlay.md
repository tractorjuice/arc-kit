# Netherlands Public Sector Overlay Guide

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

The Netherlands overlay adds six commands. Four cover Dutch central government (Rijksoverheid) information classification and cloud-hosting governance: `/arckit:nl-tbb`, `/arckit:nl-cloud`, `/arckit:nl-bio`, and `/arckit:nl-exit`. They are anchored on the Herziening rijksbreed cloudbeleid 2026 (Ministerie van Economische Zaken en Klimaat, 3 July 2026, definitief), VIRBI 2025 (Besluit voorschrift informatiebeveiliging rijksdienst bijzondere informatie 2025, BWBR0051482), and BIO2 (Baseline Informatiebeveiliging Overheid 2).

Two cover the public reference architectures Dutch government architects are assessed against: `/arckit:nl-nora` assesses conformance with **NORA** (Nederlandse Overheid Referentie Architectuur), for every bestuurslaag, and `/arckit:nl-gemma` maps a gemeente's application landscape onto **GEMMA** (Gemeentelijke Model Architectuur, VNG Realisatie). Both work from local extracts of the official content, built on the user's machine (see [NORA and GEMMA Reference Material](#nora-and-gemma-reference-material)).

---

## When to Use

Use the overlay if any of the following apply to the project:

- The contracting authority is a Dutch central government body (Rijksoverheid) in scope of the Herziening rijksbreed cloudbeleid 2026 — this excludes the Hoge Colleges van Staat, and the Ministry of Defence is explicitly exempt.
- A cloud hosting decision is being made or reviewed, and the eligibility of public cloud for the workload needs to be established (clauses 5.2, 4.5, 5.4).
- The system or dataset needs a formal Te Beschermen Belangen (TBB) category before any classification-dependent decision — cloud eligibility, access control, handling rules — can be made.
- An information-security baseline conformance position is needed against BIO2 (built on NEN-EN-ISO/IEC 27001:2023 and 27002:2022).
- Materieel publiek cloudgebruik has been established and the mandatory clause 3.2 exit plan has not yet been produced or tested.
- A service of any Dutch government body needs a conformance position against the NORA architectuurprincipes (NAP01–NAP17), or, for a gemeente, against NORA and the GEMMA principles together.
- A gemeente wants to see its application landscape against the GEMMA referentiecomponenten and bedrijfsfuncties: what is filled, what overlaps, what is missing, and which standards and data exchange fall short.

For non-Dutch projects the overlay is dormant: it adds six new doc-types (RBCLOUD, TBB, BIO2, NLEXIT, NORA, GEMMA) and does not alter the UK, Generic, UAE, or AT Document Control rendering paths.

---

## The Commands

In Claude Code the overlay installs as its own plugin, `arckit-nl`, so its commands carry that prefix: `/arckit-nl:nl-tbb`, `/arckit-nl:nl-cloud`, `/arckit-nl:nl-bio`, `/arckit-nl:nl-exit`, `/arckit-nl:nl-nora` and `/arckit-nl:nl-gemma`. Core commands such as `/arckit:requirements` keep the `arckit` prefix.

### `/arckit:nl-tbb`

Determines the **Te Beschermen Belangen (TBB) category** for a system or dataset using the TBB systematiek's BIV scoring method — Beschikbaarheid, Integriteit, and Vertrouwelijkheid scored independently on a four-point scale, with the **highest** of the three scores (never an average) setting the category. It never produces a VIRBI 2025 rubricering: it records any rubricering the information already carries and uses it only as a floor on the category. It states the mandatory one-way inference warning: a TBB category does not imply the system holds data at the corresponding Stg. classification. Produces `ARC-{id}-TBB-v{version}.md`.

### `/arckit:nl-cloud`

Assesses **Rijksbreed Cloudbeleid** compliance: the materieel publiek cloudgebruik determination (clause 4.1), the clause 3.1 risk assessment (including the mandatory foreign-government-interference aspect), and the headline eligibility determination — clause 5.2's prohibition for Te Beschermen Belangen niveau 1–3 and staatsgeheim data, clause 4.5's three cumulative conditions for email/file-storage services, and clause 5.4's basisregistraties constraint. Also covers cybersecurity criteria (clause 4.2), critical/essential-entity discouragement (clause 4.3), Woo publication posture (clause 4.4), data location and encryption (clause 4.6), and the clause 3.3/3.4 governance obligations. Produces `ARC-{id}-RBCLOUD-v{version}.md`.

### `/arckit:nl-bio`

Assesses conformance with **BIO2 (Baseline Informatiebeveiliging Overheid 2)** against the four ISO/IEC 27002:2022 control themes — Organisational, People, Physical, Technological — and the mandatory overheidsmaatregelen layered on top. Keeps the certification-vs-conformance distinction explicit: BIO2 does not require ISO/IEC 27001 certification, and "not certified" is never reported as non-conformance on its own. Never invents an overheidsmaatregel number or requirement text; unsupplied specifics are marked `[PENDING — cite from current BIO2 text]`. Produces `ARC-{id}-BIO2-v{version}.md`.

### `/arckit:nl-exit`

Produces the mandatory **clause 3.2 cloud exit plan**: Scenario A (planned exit) and Scenario B (disruptive interruption of service), covered as two independently mandatory scenarios rather than alternatives. Scenario B does not assume provider cooperation. Addresses destruction of data at the provider after migration, the annual self-test cycle, and residual risks such as data-format lock-in. Produces `ARC-{id}-NLEXIT-v{version}.md`.

### `/arckit:nl-nora`

Assesses conformance with the **NORA architectuurprincipes** NAP01–NAP17, per implicatie and per layer of the NORA Vijflaagsmodel, rolled up to kwaliteitsdoelen and kernwaarden. Every stelling is quoted verbatim from the extract, never paraphrased. For a gemeente it adds the **GEMMA supplement**: the GEMMA-toelichting and municipal implicaties of each counterpart principle (GAP01–GAP17), and GEMMA's own principles (GAP18 onwards). NORA and GEMMA conformance are reported side by side, never merged, and there is no single score: the result is the distribution across the principles. Produces `ARC-{id}-NORA-v{version}.md`. See the [NORA conformance guide](nl-nora.md).

### `/arckit:nl-gemma`

Maps a gemeente's application landscape onto the **GEMMA referentiecomponenten** and **bedrijfsfuncties**: filled and unfilled components, overlap, unsupported bedrijfsfuncties, standards and data exchange, and roadmap candidates. Each mapping carries a confidence (Stated, Inferred, Unmapped), and only component, function and standard names from the extract are used. It never calls a product "GEMMA-compliant" and never recommends products or suppliers. Produces `ARC-{id}-GEMMA-v{version}.md`. See the [GEMMA alignment guide](nl-gemma.md).

---

## NORA and GEMMA Reference Material

NORA and GEMMA are too large to assess reliably from model knowledge (89 NORA implicaties, around 170 GEMMA referentiecomponenten), and NORA's licence rules out shipping a reworked copy. So ArcKit ships no NORA or GEMMA text. `nl-nora` and `nl-gemma` run the overlay's script `scripts/nl-references.py` first, which builds the extracts in `projects/000-global/external/` from the public sources:

| Extract | Source | Used by |
|---|---|---|
| `nora-principes.md` | NORA Online Semantic MediaWiki API, elements with *Status actualiteit = Actueel* | `nl-nora` |
| `gemma-principes.md` | `export/GEMMA release.xml` in the [GEMMA Archi-repository](https://github.com/VNG-Realisatie/GEMMA-Archi-repository) | `nl-nora` (gemeenten), `nl-gemma` |
| `gemma-referentiecomponenten.md` | same | `nl-gemma` |
| `gemma-bedrijfsfuncties.md` | same | `nl-gemma` |

Each extract keeps its title as its first line, which is how the commands identify it, and carries a version stamp on its second line: the latest change on NORA Online and the element count, or the GEMMA commit. An offline build is versioned by the latest revision in the dump plus a hash of the dump files (NORA), or by a hash of the file (GEMMA). On every run the script compares that stamp with the live source and refreshes the extract only when the source has changed, so an assessment is reproducible against a known source version. The command reports what happened:

- **`fetched`, `refreshed`, `current`** — the extract is up to date with its source: the live source, or the local file an offline build was made from (`origin` tells which).
- **`offline`** — the source, or a local file given with `--from-dump` or `--from-xml`, could not be used, or the extract could not be written (a file held open by another program, say); the existing extract is used and the artefact notes that a newer version may exist.
- **`manual`** — the extract was placed by hand or built from a local file, or a file at the extract's name is not an extract at all (another first line, or not UTF-8). The live source never replaces it unless the script runs with `--force`, and the artefact notes that its currency was not checked.
- **`missing`** — no extract, and none could be built or written: the command stops without writing an artefact and says why.

Each status line also says where the extract came from (`origin`: `api`, `file` or `hand`), and every status other than `fetched`, `refreshed` or `current` carries a note: what failed (`source unreachable`, `local file could not be used`, `the extract could not be written`) and what is used instead. The commands quote it in the artefact. The script exits with 0 when every requested source has a usable extract, 1 when one has none, and 2 for a usage error; `python3 nl-references.py --help` lists all of this.

An extract the script wrote is replaced whenever its source changes, edits included. To keep your own edits, delete the stamp line (line 2): the file then counts as placed by hand. The three GEMMA files are built as one set, so delete the stamp from all three. A set with a file missing, with files from different versions, or with a stamp on some files and not on others (an interrupted refresh, a file that could not be written) is rebuilt when the source can be reached, whatever built it, and used as it is when it cannot.

**Working offline.** The script can also build the extracts from files downloaded elsewhere:

```bash
python3 nl-references.py nora  --from-dump <NORA Online XML export> [--from-dump <another export>]
python3 nl-references.py gemma --from-xml  "<GEMMA release.xml>"
```

An offline build replaces an extract the script wrote, fetched or built from a file, but not one you placed by hand unless you add `--force`; the same file again leaves the extract as it is and reports `current`. `--from-dump` goes with `nora` (or `all`), `--from-xml` with `gemma` (or `all`).

A `--from-*` file that does not exist is a usage error (exit 2), so a typo is not mistaken for an unusable source. The script writes only inside the directory it runs from: a `--dir` outside it is refused, so the commands' pre-approved call cannot write anywhere else.

Or place extracts in `projects/000-global/external/` by hand: any Markdown file whose first line matches the titles above is used. The script needs Python 3 and no other packages.

**Licensing.** NORA is © Staat der Nederlanden, licensed CC BY-ND 3.0 NL: verbatim reuse with attribution, no adaptation or translation. That is why the extracts and the artefacts quote NORA text exactly and keep ArcKit's analysis visibly separate. GEMMA's model is EUPL, but the stelling and toelichting of GAP01–GAP17 are NORA text. The extracts carry the attribution in their header; nothing NORA- or GEMMA-derived is part of ArcKit itself.

---

## Order to Run Them In

```text
requirements
  → nl-tbb
  → nl-cloud
  → nl-exit   (if materieel cloudgebruik is confirmed, or clause 4.5(b) applies)
  → nl-bio
  → risk
```

For the reference architectures:

```text
principles, requirements
  → nl-gemma   (gemeenten: needs a landscape source, e.g. an application inventory from the TOGAF ADM overlay)
  → nl-nora    (uses the GEMMA mapping as evidence for reuse and standardisation)
  → adr        (for each deliberate deviation from a principle)
  → risk, roadmap
```

**Run `nl-tbb` before `nl-cloud`.** The classification drives eligibility, not the other way round: `nl-cloud`'s clause 5.2 prohibition check needs a TBB category to test Te Beschermen Belangen niveau 1–3 against. Running `nl-cloud` first means its eligibility section can only flag the category as pending. The inference between the two commands runs one way only — `nl-tbb` determines the category from BIV scores; `nl-cloud` consumes that category but never derives or overrides it.

`nl-exit` follows `nl-cloud` once materieel cloudgebruik is confirmed (or as one of the three cumulative conditions under clause 4.5(b)). `nl-bio` can run at any point; a TBB category, where one exists, helps it prioritise which control areas matter most, and cross-references `nl-cloud`'s data-location and encryption section for the Technological control theme rather than re-deriving it.

---

## Integration with Core ArcKit Commands

| Core command | Relationship |
|---|---|
| `requirements` | Supplies the data sensitivity, hosting requirements, and security NFRs that `nl-tbb`, `nl-cloud`, `nl-bio` and `nl-exit` read as a mandatory prerequisite. `nl-nora` requires it as the main evidence for its implicaties; `nl-gemma` reads it when present, since its mandatory input is a landscape source. |
| `data-model` | Supplies data assets and existing classification markers that `nl-tbb` reads if available. |
| `risk` | Every NL command's identified risks and gaps (foreign-interference risk, BIO2 control gaps, exit-plan residual risks) are meant to be integrated into the project risk register, not left stranded in the overlay artefact. |
| `dpia` | `nl-cloud`'s clause 3.1 risk assessment can draw on an existing DPIA where personal data are processed; it is optional and skipped if absent. |
| `secure` | BIO2 gaps identified by `nl-bio` feed control implementation the same way any other security-baseline gap would. |
| `principles` | `nl-nora` reads whether the organisation's principles already adopt NORA or GEMMA, and hands off to `principles` when they do not. |
| `adr` | A deliberate deviation from a NORA or GEMMA principle is recorded as an ADR; `nl-nora` lists every deviation without one. |
| `roadmap` | `nl-gemma`'s roadmap candidates (rationalising overlap, filling gaps, standards) feed the architecture roadmap. |

The commands otherwise stand alongside the core toolkit: they read the project's existing REQ, DATA, and RISK artefacts through the same ArcKit Project Context hook mechanism as every other command, and their Document Control header renders through the same `<!-- DOC-CONTROL-HEADER -->` marker and `templates/_partials/RENDERING.md` partials as the rest of the toolkit — with the VIRBI 2025 rubricering ladder substituted for the standard UK Classification row in each command's output.

---

## Deliberate Omissions

Two things this overlay will not do, by design:

1. **No published Dutch cloud-provider qualification list.** Unlike France's SecNumCloud regime — which qualifies named providers against a published referential — the Herziening rijksbreed cloudbeleid 2026 has no equivalent register. Eligibility is determined clause-by-clause against the workload and data in scope, not by checking a provider against a list. `/arckit:nl-cloud` never names, shortlists, or implies that any specific commercial cloud provider is compliant or qualified, and this guide does not either.
2. **No invented clause or BIO2 measure content.** Where a specific VIRBI 2025 provision, Rijksbreed cloudbeleid clause, or BIO2 overheidsmaatregel number and wording is not available in project source material, `nl-bio` marks it `[PENDING — cite from current BIO2 text]`, and `nl-cloud` flags any clause it has no text for so the assessor can complete it, rather than fabricate it. Treat any unmarked clause citation in generated output as something to verify against the primary source before relying on it.

---

## Key Notes

- **The TBB inference runs one way.** `nl-tbb` sets the category from the highest BIV score; `nl-cloud` consumes it. Neither command infers a rubricering level backwards from a TBB category, and a TBB category never implies every piece of information in that process holds the corresponding Stg. classification.
- **Clause 4.5 is cumulative, not alternative.** All three conditions for email/file-storage services must hold together — a partially met set is not eligible.
- **Certification is not conformance.** `nl-bio` treats "not ISO/IEC 27001 certified" and "non-conformant with BIO2" as different questions; do not collapse them.
- **Conformance, not compliance.** NORA and GEMMA are afsprakenstelsels, not law. `nl-nora` reports non-conformance as an architecture finding, never as a legal breach.
- **Unknown is a finding.** `nl-nora` and `nl-gemma` mark missing evidence as Unknown rather than assume conformance; an assessment with many Unknowns shows where architecture evidence is missing.
- **Community-contributed.** All six commands carry the `[COMMUNITY]` marker and are not part of the officially-maintained ArcKit baseline. Output should be reviewed by qualified counsel, the departmental CISO, and CISO Rijk before reliance — citations to Dutch government policy may lag the current text.

---

**Generated by**: ArcKit overlay documentation
**ArcKit Version**: [VERSION]
