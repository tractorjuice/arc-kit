# ArcKit — EU Overlay

8 slash commands covering EU regulatory compliance:

- `/arckit-eu:eu-ai-act` — EU AI Act (Regulation 2024/1689) compliance and risk classification
- `/arckit-eu:eu-cloud-sovereignty` — EU Cloud Sovereignty Framework v1.2.1 assessment (SOV-1..SOV-8, SEAL levels)
- `/arckit-eu:eu-cra` — Cyber Resilience Act (Regulation 2024/2847) for products with digital elements
- `/arckit-eu:eu-data-act` — Data Act (Regulation 2023/2854) for connected products and data holders
- `/arckit-eu:eu-dora` — Digital Operational Resilience Act (EU 2022/2554) for financial sector entities
- `/arckit-eu:eu-dsa` — Digital Services Act (Regulation 2022/2065) for online intermediaries and platforms
- `/arckit-eu:eu-nis2` — NIS2 Directive compliance for essential and important entities
- `/arckit-eu:eu-rgpd` — GDPR (EU 2016/679) compliance across all member states

Recipes: No recipes ship in this overlay yet.

## Requires arckit core plugin

```bash
claude plugin install arckit@arckit-claude
claude plugin install arckit-eu@arckit-claude
```

On Claude Code v2.1.143+, `claude plugin disable arckit` will refuse with a copy-pasteable disable-chain hint while `arckit-eu` is enabled — earlier versions silently broke this overlay. Without `arckit` (core), recipes won't resolve their foundation commands (`arckit:principles`, `arckit:requirements`, etc.) and `validate-arc-filename` won't recognise EU doc-type codes.

## Maintainer

Currently maintained by @tractorjuice. Recruiting an EU regulatory domain co-maintainer — see [CONTRIBUTING.md](https://github.com/tractorjuice/arc-kit/blob/main/CONTRIBUTING.md).
