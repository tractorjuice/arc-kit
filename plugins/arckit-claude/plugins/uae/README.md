# ArcKit — UAE Federal Overlay

12 slash commands covering UAE federal compliance:

- `/arckit-uae:uae-ai-autonomy-tier` — AI autonomy tier posture
- `/arckit-uae:uae-ai-charter` — AI Charter compliance
- `/arckit-uae:uae-classification` — Smart Data classification register
- `/arckit-uae:uae-cloud-residency` — Sovereign cloud residency
- `/arckit-uae:uae-data-sharing` — Data sharing agreement
- `/arckit-uae:uae-digital-records` — Digital records plan
- `/arckit-uae:uae-ias` — IAS Statement of Applicability
- `/arckit-uae:uae-pdpl` — PDPL compliance assessment
- `/arckit-uae:uae-priorities-alignment` — National priorities alignment
- `/arckit-uae:uae-procurement` — Federal procurement strategy
- `/arckit-uae:uae-uaepass` — UAE Pass integration design
- `/arckit-uae:uae-zero-bureaucracy` — Zero bureaucracy service review

Recipes: `uae-federal-ai`, `uae-agentic-transformation`.

## Requires arckit core plugin

```bash
claude plugin install arckit@arckit-claude
claude plugin install arckit-uae@arckit-claude
```

On Claude Code v2.1.143+, `claude plugin disable arckit` will refuse with a copy-pasteable disable-chain hint while `arckit-uae` is enabled — earlier versions silently broke this overlay. Without `arckit` (core), recipes won't resolve their foundation commands (`arckit:principles`, `arckit:requirements`, etc.) and `validate-arc-filename` won't recognise UAE doc-type codes.

## Maintainer

Currently maintained by @tractorjuice. Recruiting a UAE domain co-maintainer — see [CONTRIBUTING.md](https://github.com/tractorjuice/arc-kit/blob/main/CONTRIBUTING.md).
