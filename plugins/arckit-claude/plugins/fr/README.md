# ArcKit — French Public Sector Overlay

12 slash commands covering French public sector compliance:

- `/arckit-fr:fr-algorithme-public` — Public algorithm transparency notice (Article L311-3-1 CRPA)
- `/arckit-fr:fr-anssi` — ANSSI Guide d'hygiène informatique and cloud security recommendations
- `/arckit-fr:fr-anssi-carto` — ANSSI-methodology information system cartography (4 reading levels)
- `/arckit-fr:fr-code-reuse` — Public code reuse via code.gouv.fr and SILL
- `/arckit-fr:fr-dinum` — French digital administration standards (RGI, RGAA, RGESN, RGS, DINUM cloud doctrine)
- `/arckit-fr:fr-dr` — Diffusion Restreinte handling compliance
- `/arckit-fr:fr-ebios` — EBIOS Risk Manager risk analysis (5 ANSSI workshops)
- `/arckit-fr:fr-irn` — Indice de Résilience Numérique self-assessment (aDRI framework)
- `/arckit-fr:fr-marche-public` — French public procurement (code de la commande publique, UGAP)
- `/arckit-fr:fr-pssi` — Information System Security Policy (PSSI)
- `/arckit-fr:fr-rgpd` — CNIL-specific GDPR obligations
- `/arckit-fr:fr-secnumcloud` — SecNumCloud 3.2 qualification compliance

Recipes: No recipes ship in this overlay yet.

## Requires arckit core plugin

```bash
claude plugin install arckit@arckit-claude
claude plugin install arckit-fr@arckit-claude
```

On Claude Code v2.1.143+, `claude plugin disable arckit` will refuse with a copy-pasteable disable-chain hint while `arckit-fr` is enabled — earlier versions silently broke this overlay. Without `arckit` (core), recipes won't resolve their foundation commands (`arckit:principles`, `arckit:requirements`, etc.) and `validate-arc-filename` won't recognise FR doc-type codes.

## Maintainer

Currently maintained by @tractorjuice. Recruiting a French public sector domain co-maintainer — see [CONTRIBUTING.md](https://github.com/tractorjuice/arc-kit/blob/main/CONTRIBUTING.md).
