# Changelog

## [Unreleased]

### Added

- First release of the UK Food Safety Overlay (experimental, community-maintained, England and Wales). It builds a small caterer's food safety documents from the Food Standards Agency's Safer food, better business for caterers pack: a business profile, the five sections of safe methods, the business's own methods, a completion record, and sign-off by a named person. Five commands do this: `uk-food-profile`, `uk-food-safe-methods` (one section at a time), `uk-food-own-methods`, `uk-food-check` and `uk-food-sign-off`. Each asks its questions in conversation, records only what a named person at the business says, and writes its document from the pack's wording and the business's confirmed answers, checked against a fresh print.
