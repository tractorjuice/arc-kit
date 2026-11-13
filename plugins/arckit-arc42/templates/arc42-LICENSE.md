# arc42 and Q42 — Third-Party Notice

SPDX-License-Identifier: CC-BY-SA-4.0

This notice identifies the material in the `arckit-arc42` overlay that is licensed under CC BY-SA 4.0 rather than the MIT License: the adapted arc42 template, and the quality material derived from the Q42 quality model. Everything else in the overlay is MIT-licensed (see the last section).

## arc42 template

`arc42-template.md` is adapted from the [arc42 template](https://arc42.org/license/) by **Peter Hruschka and Gernot Starke**. Its structure, headings and guidance, including ArcKit's adaptation, are licensed under the [Creative Commons Attribution-ShareAlike 4.0 International licence](https://creativecommons.org/licenses/by-sa/4.0/). The [full licence terms](https://creativecommons.org/licenses/by-sa/4.0/legalcode.en) apply.

**Changes by ArcKit contributors**: rewritten explanatory text; added Document Control, source citations, a Gap Register, a Source Artefacts table and optional-information assumptions. No endorsement by arc42 or its authors is implied.

Retain attribution, licence links and the changes notice when copying or adapting the template. Identify further changes and distribute adaptations of the template under CC BY-SA 4.0. This includes distributed copies, customised templates and the template text embedded in generated formats such as Paperclip's `commands.json`.

This notice covers the adapted template. Original ArcKit command logic, recipes, scripts and other implementation code remain MIT-licensed. Project-specific architecture content and cited source artefacts retain their own licences and confidentiality rules; using this template does not relicense them.

arc42's [licence page](https://arc42.org/license/) states that "publishing an architecture document in arc42 structure does not place your content under CC BY-SA" and that "attribution is required whenever you pass the template or an adaptation on to others". Generated architecture descriptions therefore keep the template's written attribution notice but carry none of its licence metadata.

## Q42-derived quality material

The following material is adapted from the [Q42 quality model](https://quality.arc42.org) by **Gernot Starke** and is licensed under the [Creative Commons Attribution-ShareAlike 4.0 International licence](https://creativecommons.org/licenses/by-sa/4.0/), not the MIT License. The [full licence terms](https://creativecommons.org/licenses/by-sa/4.0/legalcode.en) apply.

- **`arc42-quality-template.md`**, as a whole, with its distributed, customised and embedded copies (such as the template text in Paperclip's `commands.json`). It classifies quality goals, scenarios and coverage by Q42's nine quality dimensions (`#reliable`, `#efficient`, `#flexible`, `#maintainable`, `#usable`, `#operable`, `#secure`, `#safe`, `#suitable`).
- **The Q42 classification in the `arc42-quality` command** (`commands/arc42-quality.md` and every converted copy of it): the nine dimension names and the step 4 table that maps each dimension to the quality goals it typically covers and to ArcKit's NFR families.

**Changes by ArcKit contributors**: selected Q42's nine top-level dimensions; wrote ArcKit's own description of the goals each dimension typically covers and mapped each to ArcKit's requirement families; arranged the template as a quality tree, quality goals, quality scenarios with quoted targets, goals without a target, approaches and verification, dimension coverage, trade-offs, a Gap Register and a Source Artefacts table, with Document Control and source citations. No endorsement by Q42, arc42 or Gernot Starke is implied.

Retain the attribution, licence links and this changes notice when copying or adapting this material, identify further changes, and distribute adaptations under CC BY-SA 4.0. The rest of the `arc42-quality` command, its procedure, rules and output instructions, remains MIT-licensed.

A generated quality scenarios document keeps the template's written Q42 attribution line but carries none of its licence metadata (YAML frontmatter or `SPDX-License-Identifier` comment). The project's quality goals, priorities, scenarios and targets are the project's own content and retain their own licences and confidentiality rules, as for an arc42 architecture description above.

## MIT-licensed material

The overlay's other templates, `arc42-concepts-template.md`, `arc42-debt-template.md` and `arc42-handover-template.md`, are original ArcKit material under the MIT License. They follow arc42's section numbering; their catalogues, structure and wording are ArcKit's own, with no text copied from the arc42 template or the Q42 model. The overlay's commands (other than the Q42 classification above), recipe, references and scripts are MIT-licensed too.
