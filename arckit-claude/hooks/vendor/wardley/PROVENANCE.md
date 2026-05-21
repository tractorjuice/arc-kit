# Vendored module provenance

These files power the `tidy-wardley-labels.mjs` PostToolUse hook. They are
vendored verbatim (`wardley-tidy` was previously invoked over `npx`) so the
hook runs offline, with no install latency, against a pinned source.

Do not hand-edit — re-sync from upstream instead.

## Files

- `tidy.mjs` — wardley-beta label tidier. Exports `tidyMap` / `tidyToFixpoint`.
- `wardleyLabelPlacement.mjs` — pure label-placement engine.
- `tidy.test.mjs` — upstream unit tests, kept as the re-sync verification.

## Source

- Repo: https://github.com/tractorjuice/wardley-maps-mermaid
- Path: `tools/tidy.mjs`, `tools/vendor/wardleyLabelPlacement.js`, `tools/tidy.test.mjs`
- Commit: 9abfec6adb842266bb13c12105ab8f260397084a

`wardleyLabelPlacement` is itself compiled from mermaid's pure placement
module (`packages/mermaid/src/diagrams/wardley/wardleyLabelPlacement.ts`,
https://github.com/mermaid-js/mermaid, MIT licence).

## Local modifications

- `wardleyLabelPlacement.js` renamed to `.mjs` — arc-kit's root `package.json`
  has no `"type": "module"`, so a `.js` file would load as CommonJS.
- `tidy.mjs` import rewritten `./vendor/wardleyLabelPlacement.js` →
  `./wardleyLabelPlacement.mjs` to match the flattened layout.

No other changes. The `tidy.mjs` CLI block is retained but unused by the hook.

## Re-sync

1. Copy `tools/tidy.mjs`, `tools/vendor/wardleyLabelPlacement.js` and
   `tools/tidy.test.mjs` from the upstream repo.
2. Rename `wardleyLabelPlacement.js` → `wardleyLabelPlacement.mjs` and fix the
   import in `tidy.mjs` (see Local modifications).
3. Update the Commit line above.
4. Run `node --test arckit-claude/hooks/vendor/wardley/tidy.test.mjs`.
