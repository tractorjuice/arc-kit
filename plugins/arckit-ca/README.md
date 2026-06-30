# ArcKit — Canadian Federal Overlay

12 slash commands covering Canadian federal compliance:

- `/arckit:ca-aia` — Algorithmic Impact Assessment (TBS Directive on Automated Decision-Making)
- `/arckit:ca-atip` — ATIP reconciliation (Access to Information Act / Privacy Act)
- `/arckit:ca-charter` — Charter rights design review (Oakes proportionality framing)
- `/arckit:ca-cloud-residency` — Sovereign cloud residency (GC Cloud Adoption Strategy, Protected B+)
- `/arckit:ca-fitaa` — Foreign Influence Transparency and Accountability Act compliance
- `/arckit:ca-gc-digital-standards` — Government of Canada Digital Standards conformance scorecard
- `/arckit:ca-itsg-33` — ITSG-33 Statement of Applicability with TBS security categorization
- `/arckit:ca-ocap` — First Nations OCAP® sovereignty assessment (FNIGC pre-engagement)
- `/arckit:ca-ola` — Official Languages Act review (Parts IV, V, VI)
- `/arckit:ca-pia` — Privacy Impact Assessment (Privacy Act and TBS Directive on PIA)
- `/arckit:ca-pspc` — Federal procurement strategy (PSPC Supply Manual, PSAB 5%)
- `/arckit:ca-soia` — Security of Information Act handling plan

Recipes: `ca-federal-fitaa`.

## Requires arckit core plugin

```bash
claude plugin install arckit@arckit-claude
claude plugin install arckit-ca@arckit-claude
```

On Claude Code v2.1.143+, `claude plugin disable arckit` will refuse with a copy-pasteable disable-chain hint while `arckit-ca` is enabled — earlier versions silently broke this overlay. Without `arckit` (core), recipes won't resolve their foundation commands (`arckit:principles`, `arckit:requirements`, etc.) and `validate-arc-filename` won't recognise CA doc-type codes.

## Maintainer

Currently maintained by @tractorjuice. Recruiting a Canadian federal domain co-maintainer — see [CONTRIBUTING.md](https://github.com/tractorjuice/arc-kit/blob/main/CONTRIBUTING.md).
