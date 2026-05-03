# Wanted: `/arckit:build` recipes for your jurisdiction

Three recipes ship with the ArcKit plugin today. `uk-saas` covers civilian UK Government departments shipping a multi-tenant SaaS. `uk-mod-sovereign` covers UK Ministry of Defence and other accredited environments running fully air-gapped. `uae-federal-ai` covers UAE federal entities under the 23 April 2026 Cabinet agentic AI decree. Between them they cover roughly 0.5 per cent of the world's public sectors.

This is an open invitation to write the rest. If you architect for the European Union, France, Germany, Australia, Canada, Singapore, Switzerland, the Nordics, the Gulf states beyond the UAE, or any other jurisdiction with its own governance regime, your recipe could ship with v4.14.

This article walks through what a recipe is, how the three existing ones are shaped, what we'd accept as a contribution, and how to send one in.

## What a recipe is

A recipe is a YAML file that lists the artefacts a typical project in your jurisdiction needs, the dependency between them, and the args each `/arckit:*` command should be invoked with. The build harness reads it, computes a parallel-wave dependency graph, and dispatches subagents to produce the artefacts in the right order. One git commit per wave, full audit trail, resumable state.

A recipe is not a fork of ArcKit. It does not change the underlying commands. It is configuration that says "for projects in my jurisdiction, this is the bundle of artefacts that constitutes governance-ready, here is the order they should be built in, and here are the topic seeds for the architecture decision records".

## How the existing three are shaped

The `uk-saas` recipe runs 38 targets in 9 parallel waves. It begins with a research phase researching the target organisation once per repo (output in `projects/000-global/research/`), then per-project market research across general technology, AWS, Azure, Google Cloud and UK Government code reuse. Then the requirements, stakeholder analysis, and eight architecture decision records on the standard UK choices: cloud platform, identity (GOV.UK One Login or Entra), data residency, AI provider, observability stack, deployment topology, build vs buy under the G-Cloud framework, and open-source licence policy. Then risk register, high-level design, business case, Technology Code of Practice review, Secure by Design assessment, Data Protection Impact Assessment, three diagrams, plans, FinOps, operationalisation, GDS Service Standard assessment, traceability matrix.

The `uk-mod-sovereign` recipe is structurally similar but swaps Secure by Design for MOD Secure by Design with the Cyber Defence Authority Assurance Toolset, adds JSP 936 AI assurance, drops the Service Standard step (sovereign deployments are not citizen-facing), and rewrites all eight architecture decisions for air-gapped operation: disconnected runtime, signed release bundles with Cosign and SLSA L3, cleared-personnel access models, on-premise AI integration, customer-controlled telemetry, JSP 440 Security Aspects Letter alignment, sealed-media distribution with diode option, long-term support release lines.

The `uae-federal-ai` recipe runs 48 targets and adds all 12 UAE community commands as part of the build: Personal Data Protection Law assessment, Information Assurance Standard 188-control statement of applicability, AI Charter compliance against the 12 principles, AI autonomy tier policy, sovereign cloud residency, UAE Pass integration, data sharing agreements, digital records plan, national priorities alignment, federal procurement strategy, zero bureaucracy service catalogue, smart data classification register. ADR topics are rewritten for UAE federal AI: Core42, G42, Microsoft UAE and e& sovereign hosting; UAE Pass tiers; the Tier 1 / 2 / 3 autonomy boundaries; the Ministry of Finance Digital Procurement Platform route.

The shape is the same across all three: a foundation wave, a research wave, ADRs, then risk and design, then planning and operations, then a traceability cross-cut at the end. What changes is which commands are in scope, what the ADR topics are, and what jurisdiction-specific compliance assessments get added.

## What we'd accept

The bar is "a serious architect for that jurisdiction would recognise this as a credible governance bundle". Concretely:

- A YAML file at `arckit-claude/skills/arckit-build/recipes/{your-recipe}.yaml` matching the schema
- Eight or so architecture decision records with topics that reflect the cloud, identity, data, AI and procurement choices an architect actually faces in your jurisdiction
- Whichever core ArcKit commands fit (most do, regardless of jurisdiction)
- Plus the relevant community-overlay commands if your jurisdiction has any (`fr-*`, `eu-*`, `at-*`, `uae-*` already exist; new prefixes welcome)
- An optional research wave following the established pattern
- Validated YAML (run `python3 -c "import yaml; yaml.safe_load(open('YOUR-RECIPE.yaml'))"` and confirm all dep references resolve)
- A short PR description naming the regulatory anchors the recipe is designed to satisfy

We don't need every artefact to be perfect on day one. Recipes evolve. The point is to ship a credible starting point that an architect can run on a real project and iterate on.

## What we don't need

A recipe is not the place to fix per-command UK bias. If `/arckit:tcop` doesn't apply to your jurisdiction, the recipe simply doesn't include it. If you need a jurisdiction-specific equivalent, that's a separate community-overlay command (the way the 12 UAE, 12 French, 7 EU, and 3 Austrian commands work today). Recipes are about composition, not command-level customisation.

A recipe is also not the place to ship a parallel discovery experience. The `/arckit:start` onboarding command and the documentation site are global; recipes only affect the build harness.

## How to send one in

The simplest path is the one we used for `uae-federal-ai`. Copy `uk-saas.yaml` to a new file under `.arckit/recipes/` in your project, edit it, run `/arckit:build {project} --recipe {your-recipe} --plan` to confirm the wave plan looks right, then `/arckit:build {project} --recipe {your-recipe}` for real on a representative project. Once you're happy with the artefacts it produces, send the YAML in as a pull request against `tractorjuice/arc-kit` adding it under `arckit-claude/skills/arckit-build/recipes/`.

If you'd rather propose a recipe before writing it, open an issue with a description of the jurisdiction, the commands you'd include, and the eight ADR topics. We'll discuss before you spend the time. There's a `help wanted` issue tagged for exactly this.

## Recognition

Recipes will land with the contributor's name in the commit history and in the recipe's `description:` field. Significant recipes that establish a new jurisdiction overlay will get a credit in the article history at arckit.org, alongside how `uae-federal-ai` was credited at v4.13.1.

## A short list of jurisdictions whose recipes would be most welcome

- **EU SaaS** for projects falling under the EU AI Act, NIS2 Directive, DORA, the Data Act, and the Digital Services Act
- **France** combining `fr-*` community commands (SecNumCloud, ANSSI, EBIOS, PSSI, marché public) with the standard governance flow
- **Germany** for BSI / IT-Grundschutz / C5 catalogue
- **Australia** for Digital Transformation Agency standards, IRAP assessment, Essential Eight
- **Canada** for Treasury Board Secretariat directives, ITSG-33, PIPEDA
- **Singapore** for IMDA / GovTech standards
- **Switzerland** for FINMA-regulated financial services
- **Nordic / Baltic** combinations where joint procurement is common

These aren't exclusive. If your jurisdiction isn't on the list, that's not a no.

## And another category: consultancy and firm recipes

A recipe is a YAML file describing a coherent governance bundle. Nothing in that definition restricts it to public sector. Every Big 4 advisory practice and every strategy consultancy has its own house style for how an architecture engagement should be structured: which artefacts get produced, in which order, against which risk frameworks, with which approval gates. That house style is institutional knowledge, often locked inside slide decks and SharePoint sites.

We'd happily ship a recipe like `mckinsey-arch`, `deloitte-arch`, `pwc-tech`, `ey-tech`, `kpmg-advisory`, `accenture-tech`, `bcg-platinion`, or `bain-tech` if a contributor inside one of those firms wanted to formalise their internal governance bundle as an open recipe. The benefit cuts both ways: the firm gets a public, executable, version-controlled artefact catalogue; ArcKit users get more options when bidding into engagements where a particular firm's playbook is expected.

The same applies to system integrators, in-house architecture practices at large enterprises, and academic governance frameworks (TOGAF-aligned, Zachman-aligned). If you maintain a governance template inside a consultancy, a SI, a bank, or a university, your recipe could ship alongside `uk-saas` and benefit thousands of architects who have to reinvent the same wheel every time they start a new engagement.

Recipes are composition, not endorsement. Shipping a `mckinsey-arch` recipe doesn't mean ArcKit recommends McKinsey, and adopting it doesn't make a project a McKinsey project. It just means there's a turnkey way to run a McKinsey-style engagement governance flow if that's what the situation calls for.

The ArcKit community is small and the build harness is new. The first dozen recipes get to define what jurisdiction-specific governance looks like in this toolchain. Worth claiming yours.

---

**Generated by**: Mark Craddock, ArcKit
**Date**: 3 May 2026
**ArcKit Version**: 4.13.1
