# Knowledge Compounding Guide

`/arckit.research` automatically extracts reusable knowledge from research output into standalone vendor profiles and tech notes.

> **Compound Knowledge Pattern**: One research document contains findings about vendors and technologies that persist beyond the project that discovered them. By extracting these into standalone files, future projects can find and reference existing knowledge instead of re-researching from scratch.

---

## Why Knowledge Compounding Matters

Research is expensive — each run performs dozens of web searches, fetches vendor pricing pages, and cross-references compliance data. Without compounding, this knowledge is locked inside a single research document and invisible to future projects.

**The problem:** Project A researches AWS, Stripe, and Auth0 in depth. Six months later, Project B needs payment processing research. Without compounding, Project B starts from zero.

**The solution:** Project A's research spawns `vendors/stripe-profile.md` with pricing, compliance, and strengths/weaknesses. When Project B runs research, the existing profile provides a head start — the agent updates it with fresh data rather than rebuilding from nothing.

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

```
projects/001-my-project/
├── ARC-001-REQ-v1.0.md          # Requirements (input)
├── ARC-001-RSCH-v1.0.md         # Research findings (main output)
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

Every spawned file includes a `Source Research` field in its Document Control table linking back to the research document that created it:

```markdown
| Source Research | ARC-001-RSCH-v1.0 |
```

The main research document includes a `## Spawned Knowledge` section at the end listing all vendor profiles and tech notes that were created or updated during that research run.

---

## Skipping Knowledge Spawning

Use the `--no-spawn` flag to produce only the main research document without creating additional files:

```bash
/arckit.research Research options for authentication --no-spawn
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
