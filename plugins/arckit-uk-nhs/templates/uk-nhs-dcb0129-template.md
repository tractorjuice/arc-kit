# NHS DCB0129 Clinical Safety Case — Wrapper Template

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit:uk-nhs-dcb0129`

This wrapper exists only for `/arckit:customize list` and the documentation site. The actual generated outputs are three files:

1. [`uk-nhs-dcb0129-safety-template.md`](./uk-nhs-dcb0129-safety-template.md) — renders to `clinical-safety/SAFETY.md`
2. [`uk-nhs-dcb0129-case-template.md`](./uk-nhs-dcb0129-case-template.md) — renders to `clinical-safety/SAFETY-CASE.md`
3. [`uk-nhs-dcb0129-hazard-template.md`](./uk-nhs-dcb0129-hazard-template.md) — renders to `clinical-safety/HAZARD-LOG.md`

The three files together implement the NHS DCB0129 manufacturer-side documentation expected by NHS England under the Health and Social Care Act 2012 s250. They follow Dr Marcus Baw's [SAFETY.md spec v2.0.0-draft](https://github.com/pacharanero/SAFETY.md) for filenames and YAML-frontmatter structure, prefixed with an ArcKit Document Control block.

To customise: run `/arckit:customize uk-nhs-dcb0129-safety` (or `-case`, or `-hazard`) to copy individual sub-templates into `.arckit/templates-custom/` for editing.
