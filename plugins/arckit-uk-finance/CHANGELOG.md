# Changelog — arckit-uk-finance

All notable changes to this plugin are documented here. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versioning tracks the `arckit` core plugin.

## 5.3.0 — 2026-05-27

### Added

- Initial release. UK Financial Services Payments Overlay for ArcKit — community-contributed, EXPERIMENTAL.
- 4 commands: `uk-fs-sca-rts`, `uk-fs-safeguarding`, `uk-fs-consumer-duty`, `uk-fs-ctp-dependency`.
- Recipe `uk-fs-payments` (lives in core `arckit-claude/skills/arckit-build/recipes/`).
- 4 doc-types registered in core: `FSSCA`, `FSSAFE`, `FSCD`, `FSCTP`.
- 5 usage guides under `docs/guides/`.
- First sector-specific overlay (jurisdiction overlays cover legal territories; sector overlays narrow to an industry vertical inside a jurisdiction).

### Status

- No named domain co-maintainer. Help wanted — see README.
