# Netherlands Public Sector Cloud Overlay Guide

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

The Netherlands overlay adds four commands covering Dutch central government (Rijksoverheid) information classification and cloud-hosting governance: `/arckit:nl-tbb`, `/arckit:nl-cloud`, `/arckit:nl-bio`, and `/arckit:nl-exit`. It is anchored on the Herziening rijksbreed cloudbeleid 2026 (Ministerie van Economische Zaken en Klimaat, 3 July 2026, definitief), VIRBI 2025 (Besluit voorschrift informatiebeveiliging rijksdienst bijzondere informatie 2025, BWBR0051482), and BIO2 (Baseline Informatiebeveiliging Overheid 2).

---

## When to Use

Use the overlay if any of the following apply to the project:

- The contracting authority is a Dutch central government body (Rijksoverheid) in scope of the Herziening rijksbreed cloudbeleid 2026 — this excludes the Hoge Colleges van Staat, and the Ministry of Defence is explicitly exempt.
- A cloud hosting decision is being made or reviewed, and the eligibility of public cloud for the workload needs to be established (clauses 5.2, 4.5, 5.4).
- The system or dataset needs a formal Te Beschermen Belangen (TBB) category and VIRBI 2025 rubricering before any classification-dependent decision — cloud eligibility, access control, handling rules — can be made.
- An information-security baseline conformance position is needed against BIO2 (built on NEN-EN-ISO/IEC 27001:2023 and 27002:2022).
- Materieel publiek cloudgebruik has been established and the mandatory clause 3.2 exit plan has not yet been produced or tested.

For non-Dutch projects the overlay is dormant: it adds four new doc-types (RBCLOUD, TBB, BIO2, NLEXIT) and does not alter the UK, Generic, UAE, or AT Document Control rendering paths.

---

## The Four Commands

### `/arckit:nl-tbb`

Determines the **Te Beschermen Belangen (TBB) category** for a system or dataset using the TBB systematiek's BIV scoring method — Beschikbaarheid, Integriteit, and Vertrouwelijkheid scored independently on a four-point scale, with the **highest** of the three scores (never an average) setting the category. Maps the category to its VIRBI 2025 rubricering (Stg. ZEER GEHEIM down to Departementaal VERTROUWELIJK / ongerubriceerd met merking) and states the mandatory one-way inference warning: a TBB category does not imply the system holds data at the corresponding Stg. classification. Produces `ARC-{id}-TBB-v{version}.md`.

### `/arckit:nl-cloud`

Assesses **Rijksbreed Cloudbeleid** compliance: the materieel publiek cloudgebruik determination (clause 4.1), the clause 3.1 risk assessment (including the mandatory foreign-government-interference aspect), and the headline eligibility determination — clause 5.2's prohibition for Te Beschermen Belangen niveau 1–3 and staatsgeheim data, clause 4.5's three cumulative conditions for email/file-storage services, and clause 5.4's basisregistraties constraint. Also covers cybersecurity criteria (clause 4.2), critical/essential-entity discouragement (clause 4.3), Woo publication posture (clause 4.4), data location and encryption (clause 4.6), and the clause 3.3/3.4 governance obligations. Produces `ARC-{id}-RBCLOUD-v{version}.md`.

### `/arckit:nl-bio`

Assesses conformance with **BIO2 (Baseline Informatiebeveiliging Overheid 2)** against the four ISO/IEC 27002:2022 control themes — Organisational, People, Physical, Technological — and the mandatory overheidsmaatregelen layered on top. Keeps the certification-vs-conformance distinction explicit: BIO2 does not require ISO/IEC 27001 certification, and "not certified" is never reported as non-conformance on its own. Never invents an overheidsmaatregel number or requirement text; unsupplied specifics are marked `[PENDING — cite from current BIO2 text]`. Produces `ARC-{id}-BIO2-v{version}.md`.

### `/arckit:nl-exit`

Produces the mandatory **clause 3.2 cloud exit plan**: Scenario A (planned exit) and Scenario B (disruptive interruption of service), covered as two independently mandatory scenarios rather than alternatives. Scenario B does not assume provider cooperation. Addresses destruction of data at the provider after migration, the annual self-test cycle, and residual risks such as data-format lock-in. Produces `ARC-{id}-NLEXIT-v{version}.md`.

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

**Run `nl-tbb` before `nl-cloud`.** The classification drives eligibility, not the other way round: `nl-cloud`'s clause 5.2 prohibition check needs a TBB category to test Te Beschermen Belangen niveau 1–3 against. Running `nl-cloud` first means its eligibility section can only flag the category as pending. The inference between the two commands runs one way only — `nl-tbb` determines the category from BIV scores; `nl-cloud` consumes that category but never derives or overrides it.

`nl-exit` follows `nl-cloud` once materieel cloudgebruik is confirmed (or as one of the three cumulative conditions under clause 4.5(b)). `nl-bio` can run at any point once BIV scores are available to prioritise which control areas matter most, and cross-references `nl-cloud`'s data-location and encryption section for the Technological control theme rather than re-deriving it.

---

## Integration with Core ArcKit Commands

| Core command | Relationship |
|---|---|
| `requirements` | Supplies the data sensitivity, hosting requirements, and security NFRs that `nl-tbb` and `nl-cloud` both read as a mandatory prerequisite. |
| `data-model` | Supplies data assets and existing classification markers that `nl-tbb` reads if available. |
| `risk` | Every NL command's identified risks and gaps (foreign-interference risk, BIO2 control gaps, exit-plan residual risks) are meant to be integrated into the project risk register, not left stranded in the overlay artefact. |
| `dpia` | `nl-cloud`'s clause 3.1 risk assessment reads an existing DPIA where personal data are processed, and does not re-derive the privacy analysis. |
| `secure` | BIO2 gaps identified by `nl-bio` feed control implementation the same way any other security-baseline gap would. |

The four commands otherwise stand alongside the core toolkit: they read the project's existing REQ, DATA, and RISK artefacts through the same ArcKit Project Context hook mechanism as every other command, and their Document Control header renders through the same `<!-- DOC-CONTROL-HEADER -->` marker and `templates/_partials/RENDERING.md` partials as the rest of the toolkit — with the VIRBI 2025 rubricering ladder substituted for the standard UK Classification row in each of the four commands' output.

---

## Deliberate Omissions

Two things this overlay will not do, by design:

1. **No published Dutch cloud-provider qualification list.** Unlike France's SecNumCloud regime — which qualifies named providers against a published referential — the Herziening rijksbreed cloudbeleid 2026 has no equivalent register. Eligibility is determined clause-by-clause against the workload and data in scope, not by checking a provider against a list. `/arckit:nl-cloud` never names, shortlists, or implies that any specific commercial cloud provider is compliant or qualified, and this guide does not either.
2. **No invented clause or BIO2 measure content.** Where a specific VIRBI 2025 provision, Rijksbreed cloudbeleid clause, or BIO2 overheidsmaatregel number and wording is not available in project source material, the commands mark it `[PENDING — cite from current BIO2 text]` (or the clause equivalent) rather than fabricate it. Treat any unmarked clause citation in generated output as something to verify against the primary source before relying on it.

---

## Key Notes

- **The TBB inference runs one way.** `nl-tbb` sets the category from the highest BIV score; `nl-cloud` consumes it. Neither command infers a rubricering level backwards from a TBB category, and a TBB category never implies every piece of information in that process holds the corresponding Stg. classification.
- **Clause 4.5 is cumulative, not alternative.** All three conditions for email/file-storage services must hold together — a partially met set is not eligible.
- **Certification is not conformance.** `nl-bio` treats "not ISO/IEC 27001 certified" and "non-conformant with BIO2" as different questions; do not collapse them.
- **Community-contributed.** All four commands carry the `[COMMUNITY]` marker and are not part of the officially-maintained ArcKit baseline. Output should be reviewed by qualified counsel, the departmental CISO, and CISO Rijk before reliance — citations to Dutch government policy may lag the current text.

---

**Generated by**: ArcKit overlay documentation
**ArcKit Version**: [VERSION]
