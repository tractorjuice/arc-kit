# ArcKit — Netherlands Public Sector Overlay

4 slash commands covering Netherlands (Rijksoverheid) cloud and information-security compliance:

- `/arckit-nl:nl-cloud` — Rijksbreed Cloudbeleid Compliance Assessment (Herziening rijksbreed cloudbeleid 2026)
- `/arckit-nl:nl-tbb` — Te Beschermen Belangen (TBB) / VIRBI 2025 rubricering determination
- `/arckit-nl:nl-bio` — BIO2 conformance assessment
- `/arckit-nl:nl-exit` — Cloud exit plan (Rijksbreed cloudbeleid clause 3.2)

Recipes: No recipes ship in this overlay yet.

## Requires arckit core plugin

```bash
claude plugin install arckit@arckit-claude
claude plugin install arckit-nl@arckit-claude
```

On Claude Code v2.1.143+, `claude plugin disable arckit` will refuse with a copy-pasteable disable-chain hint while `arckit-nl` is enabled — earlier versions silently broke this overlay. Without `arckit` (core), recipes won't resolve their foundation commands (`arckit:principles`, `arckit:requirements`, etc.) and `validate-arc-filename` won't recognise NL doc-type codes.

## Scope note

Unlike France's SecNumCloud, the Netherlands has no published qualification list of compliant cloud providers. `/arckit-nl:nl-cloud` deliberately does not name, shortlist, or rate specific commercial cloud providers as compliant or qualified — it assesses eligibility and obligations against the Herziening rijksbreed cloudbeleid 2026 text only.

## Maintainer

Currently maintained by @tractorjuice. Recruiting a Netherlands public sector domain co-maintainer — see [CONTRIBUTING.md](https://github.com/tractorjuice/arc-kit/blob/main/CONTRIBUTING.md).
