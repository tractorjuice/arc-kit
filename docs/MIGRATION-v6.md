# Migration Guide: v5.x to v6.0.0

## Summary

In v6.0.0, the 15 UK Government-specific commands that previously shipped in the core `arckit` plugin have been extracted into two new officially-maintained overlays: `arckit-uk` (13 commands, enabled by default) and `arckit-uk-mod` (2 defence commands, disabled by default). The core `arckit` plugin is now jurisdiction-neutral (56 commands). Because `arckit-uk` is `defaultEnabled: true`, the out-of-box UK experience is preserved — installing `arckit` continues to surface UK compliance commands without any extra steps. The only change visible to existing users is the command namespace: UK commands moved from `/arckit:<name>` to `/arckit-uk:uk-<name>` (or `/arckit-uk-mod:uk-mod-<name>` for the two defence commands). The `risk` and `sobc` commands remain in core, now framework-aware via the `governance_framework` user-config field.

## Command Mapping

| Old command (v5.x) | New command (v6.0.0) | Plugin |
|--------------------|----------------------|--------|
| `/arckit:tcop` | `/arckit-uk:uk-tcop` | `arckit-uk` |
| `/arckit:secure` | `/arckit-uk:uk-secure` | `arckit-uk` |
| `/arckit:dpia` | `/arckit-uk:uk-dpia` | `arckit-uk` |
| `/arckit:ai-playbook` | `/arckit-uk:uk-ai-playbook` | `arckit-uk` |
| `/arckit:atrs` | `/arckit-uk:uk-atrs` | `arckit-uk` |
| `/arckit:service-assessment` | `/arckit-uk:uk-service-assessment` | `arckit-uk` |
| `/arckit:dos` | `/arckit-uk:uk-dos` | `arckit-uk` |
| `/arckit:gcloud-search` | `/arckit-uk:uk-gcloud-search` | `arckit-uk` |
| `/arckit:gcloud-clarify` | `/arckit-uk:uk-gcloud-clarify` | `arckit-uk` |
| `/arckit:gov-reuse` | `/arckit-uk:uk-gov-reuse` | `arckit-uk` |
| `/arckit:gov-code-search` | `/arckit-uk:uk-gov-code-search` | `arckit-uk` |
| `/arckit:gov-landscape` | `/arckit-uk:uk-gov-landscape` | `arckit-uk` |
| `/arckit:grants` | `/arckit-uk:uk-grants` | `arckit-uk` |
| `/arckit:mod-secure` | `/arckit-uk-mod:uk-mod-secure` | `arckit-uk-mod` |
| `/arckit:jsp-936` | `/arckit-uk-mod:uk-mod-jsp-936` | `arckit-uk-mod` |

## Dependency changes

- `arckit-uk-nhs` and `arckit-uk-finance` now depend on `arckit-uk` (in addition to `arckit` core). If you install either sector overlay, ensure `arckit-uk` is also installed: `claude plugin install arckit arckit-uk arckit-uk-nhs`.
- `arckit-uk-mod` depends on `arckit-uk`. Install with: `claude plugin install arckit arckit-uk arckit-uk-mod`.

## Commands that did NOT move

- `/arckit:risk` — remains in core, now framework-aware (reads `governance_framework` user-config to adapt output for UK Gov, Generic, or other regimes).
- `/arckit:sobc` — remains in core, framework-aware via the same mechanism.
- All other core commands are unchanged.
