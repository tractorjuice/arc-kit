# ArcKit — Netherlands Public Sector Overlay

6 slash commands covering Netherlands (Rijksoverheid) cloud and information-security compliance, and the NORA and GEMMA reference architectures:

- `/arckit:nl-cloud` — Rijksbreed Cloudbeleid Compliance Assessment (Herziening rijksbreed cloudbeleid 2026)
- `/arckit:nl-tbb` — Te Beschermen Belangen (TBB) category determination, using any existing VIRBI 2025 rubricering as a floor
- `/arckit:nl-bio` — BIO2 conformance assessment
- `/arckit:nl-exit` — Cloud exit plan (Rijksbreed cloudbeleid clause 3.2)
- `/arckit:nl-nora` — NORA conformance assessment (NAP01–NAP17, with the GEMMA supplement for gemeenten)
- `/arckit:nl-gemma` — GEMMA landscape mapping for gemeenten (referentiecomponenten and bedrijfsfuncties)

In Claude Code the overlay installs as its own plugin, `arckit-nl`, so its commands carry that prefix: `/arckit-nl:nl-tbb` and so on. Core commands such as `/arckit:requirements` keep the `arckit` prefix.

Recipes: No recipes ship in this overlay yet.

## Requires arckit core plugin

```bash
claude plugin install arckit@arckit-claude
claude plugin install arckit-nl@arckit-claude
```

On Claude Code v2.1.143+, `claude plugin disable arckit` will refuse with a copy-pasteable disable-chain hint while `arckit-nl` is enabled — earlier versions silently broke this overlay. Without `arckit` (core), recipes won't resolve their foundation commands (`arckit:principles`, `arckit:requirements`, etc.) and `validate-arc-filename` won't recognise NL doc-type codes.

## Scope note

Unlike France's SecNumCloud, the Netherlands has no published qualification list of compliant cloud providers. `/arckit:nl-cloud` deliberately does not name, shortlist, or rate specific commercial cloud providers as compliant or qualified — it assesses eligibility and obligations against the Herziening rijksbreed cloudbeleid 2026 text only.

## NORA and GEMMA reference material

ArcKit ships no NORA or GEMMA text. `/arckit:nl-nora` and `/arckit:nl-gemma` first run `scripts/nl-references.py` (Python 3, no other packages), which builds local extracts in `projects/000-global/external/` from the public sources — the NORA Online API and `export/GEMMA release.xml` in the GEMMA Archi-repository — and refreshes them only when the source has changed. Extracts placed by hand are never overwritten. Offline builds from downloaded files are supported; see the [NL overlay guide](https://github.com/tractorjuice/arc-kit/blob/main/docs/guides/nl-overlay.md#nora-and-gemma-reference-material).

## Data

This overlay adds commands, templates, reference material and one script. The script reads two public sources, `www.noraonline.nl` and GitHub (`api.github.com`, `raw.githubusercontent.com`), and sends nothing about the project. The overlay has no hooks and no MCP servers. Its commands run in Claude alongside the `arckit` core plugin, whose README lists what that plugin sends and when. Privacy policy: <https://arckit.org/privacy.html>.

## Maintainer

Currently maintained by @tractorjuice. Recruiting a Netherlands public sector domain co-maintainer — see [CONTRIBUTING.md](https://github.com/tractorjuice/arc-kit/blob/main/CONTRIBUTING.md).
