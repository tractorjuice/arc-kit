# Knowledge Compounding Guide

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

`/arckit:research` automatically extracts reusable knowledge from research output into standalone vendor profiles and tech notes.

> **Compound Knowledge Pattern**: One research document contains findings about vendors and technologies that are worth keeping beyond a single run. By extracting these into standalone files, later research runs in the project can find and update existing knowledge instead of re-researching from scratch.

---

## Why Knowledge Compounding Matters

Research is expensive — each run performs dozens of web searches, fetches vendor pricing pages, and cross-references compliance data. Without compounding, this knowledge is locked inside a single research document and has to be gathered again on the next run.

**The problem:** A project researches AWS, Stripe, and Auth0 in depth. Six months later, the team re-runs research to refresh the payment processing options. Without compounding, the second run starts from zero.

**The solution:** The first run spawns `vendors/stripe-profile.md` with pricing, compliance, and strengths/weaknesses. When research runs again in the same project, the existing profile provides a head start — the run updates it with fresh data rather than rebuilding from nothing.

Profiles and tech notes are kept per project. A research run reads and updates only its own project's `vendors/` and `tech-notes/` folders, so another project starts its own.

---

## What Gets Spawned

### Vendor Profiles

Created when a vendor is evaluated with **3 or more data points** (e.g., pricing, features, compliance, reviews, UK Government presence).

**Location:** `projects/{project}/vendors/{vendor-slug}-profile.md`

**Contains:**

- Vendor overview and product lines
- Pricing model (CAPEX/OPEX/subscription)
- UK Government presence (G-Cloud, DOS, UK data centres)
- Strengths and weaknesses
- Projects where the vendor has been evaluated

**Examples:**

- `vendors/aws-profile.md`
- `vendors/stripe-profile.md`
- `vendors/auth0-profile.md`

### Tech Notes

Created when a technology, protocol, or standard is researched with **2 or more substantive facts**.

**Location:** `projects/{project}/tech-notes/{topic-slug}.md`

**Contains:**

- Summary of the technology or standard
- Key findings from research
- Relevance to current and future projects

**Examples:**

- `tech-notes/event-driven-architecture.md`
- `tech-notes/pci-dss-compliance.md`
- `tech-notes/graphql-vs-rest.md`

---

## Directory Structure

After research with spawning enabled, a project directory looks like this:

```text
projects/001-my-project/
├── ARC-001-REQ-v1.0.md          # Requirements (input)
├── research/
│   └── ARC-001-RSCH-001-v1.0.md # Research findings (main output)
├── vendors/                      # Spawned vendor profiles
│   ├── aws-profile.md
│   ├── stripe-profile.md
│   └── auth0-profile.md
└── tech-notes/                   # Spawned tech notes
    ├── event-driven-architecture.md
    └── pci-dss-compliance.md
```

---

## Deduplication

The research agent always checks for existing files before creating new ones. It uses filename glob patterns to find matches:

- `projects/{project}/vendors/*{vendor-name}*`
- `projects/{project}/tech-notes/*{topic}*`

**When a match is found**, the agent reads the existing file, merges in new findings, and updates the date fields. It does not overwrite existing content — it appends or refines.

**When no match is found**, the agent creates a new file from the appropriate template.

---

## Source Traceability

The research document ends with a `## Spawned Knowledge` section listing every vendor profile and tech note that run created or updated, so each one can be traced back to the research that produced it. Each spawned file's revision history and footer name the command that wrote it.

---

## Skipping Knowledge Spawning

In Claude Code, `/arckit:research` always writes the vendor profiles and tech notes alongside the main document. In the other assistants, use the `--no-spawn` flag to produce only the main research document without creating additional files:

```bash
/arckit:research Research options for authentication --no-spawn
```

**When to skip:**

- Quick exploratory research where you do not want to pollute the project with standalone files
- Re-running research purely to refresh the main document
- Projects where you prefer to manage vendor and technology notes manually

---

## Confidence Levels

Vendor profiles include a confidence indicator based on the depth of research:

| Confidence | Criteria |
|------------|----------|
| **high** | 5+ data points gathered (pricing, features, compliance, reviews, case studies) |
| **medium** | 3–4 data points gathered |
| **low** | Fewer than 3 data points (profile created for completeness but needs enrichment) |

---

## Follow-on Actions

- Review spawned profiles and notes for accuracy before sharing
- Reference vendor profiles from `/arckit:evaluate` scoring summaries
- Use tech notes as input for `/arckit:adr` when making technology decisions
- Update profiles manually when you learn new information outside of research runs
