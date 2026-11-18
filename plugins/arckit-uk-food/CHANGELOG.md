# Changelog

## [Unreleased]

### Added

- First release of the UK Food Safety Overlay (experimental, community-maintained, England and Wales). It builds a small caterer's food safety documents from the Food Standards Agency's Safer food, better business for caterers pack: a business profile, the five sections of safe methods, the business's own methods, a completion record, and sign-off by a named person. Five commands do this: `uk-food-profile`, `uk-food-safe-methods` (one section at a time), `uk-food-own-methods`, `uk-food-check` and `uk-food-sign-off`. The profile, safe methods and own methods commands ask their questions in conversation, record only what a named person at the business says, and write their documents from the pack's wording and the business's confirmed answers, checked against a fresh print. The check command writes the completion record from the project as it stands, and the sign-off command records a named person's sign-off through the helper.
