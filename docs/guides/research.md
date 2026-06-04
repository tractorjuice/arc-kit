# Technology Research Guide

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

`/arckit:research` investigates market, SaaS, open-source, and government marketplace options to support build vs buy decisions.

> **Agent Architecture**: This command delegates to the `arckit-research` autonomous agent. The agent runs as a subprocess with its own context window, performing dozens of WebSearch and WebFetch calls for vendor pricing, reviews, and compliance data without polluting your main conversation. The slash command launches the agent and relays its summary back to you.

---

## Scenario Matrix

| Scenario | Prompt seed | Focus |
|---------|-------------|-------|
| Build vs buy | “Research options for <capability> and recommend build vs buy” | Compares custom development vs product |
| Supplier shortlist | “Research G-Cloud services for <need> including pricing tiers” | Public sector supplier discovery |
| Standards review | “Research regulatory obligations for <domain>” | Highlights policies, certifications, compliance |
| Migration | “Research tooling to migrate from <legacy> to <target>” | Guides modernisation approaches |
| Risk investigation | “Research security/operational risks for <technology>” | Informs risk register and mitigations |

Add constraints (budget, data residency, clearance) in the prompt for tailored results.

---

## Command

```bash
/arckit:research Research <topic> for <project>
```

Outputs: `projects/<id>/ARC-<id>-RSCH-v1.0.md` plus optional CSV of suppliers.

> **Auto-versioning**: Re-running this command when a document already exists automatically increments the version (minor for refreshed content, major for changed scope) instead of overwriting.

---

## Long runs: Remote Control + push notifications

`/arckit:research` frequently exceeds 10 minutes once the agent starts pulling vendor pricing pages, G-Cloud listings, and product reviews. To avoid babysitting the terminal, pair it with [Claude Code Remote Control](https://code.claude.com/docs/en/remote-control):

```bash
claude remote-control
```

Drive the session from claude.ai/code or the mobile app, then enable `/config → Push when Claude decides` so your phone gets a notification on completion or when the agent reaches a decision point (vendor shortlist confirmation, build vs buy direction). ArcKit's minimum Claude Code floor (v2.1.121) already covers the v2.1.110 RC requirement.

Caveats: Pro/Max plans only (no API keys, no Bedrock/Vertex/Foundry), push is a single on/off so chatty agents can over-notify, and the local `claude` process must keep running.

---

## Output Highlights

- Option catalogue with pros, cons, pricing, support model.
- Alignment to requirements and principles.
- Risk considerations (lock-in, data sovereignty, accessibility).
- Recommendation with rationale and next steps (PoC, procurement, or custom build).

---

## Follow-on Actions

- Feed supplier data into `/arckit:sow` and `/arckit:evaluate`.
- Update Wardley Maps with evolution stage insights.
- Add identified risks to `/arckit:risk` and mitigations to project backlog.
- Cite findings in business case and design reviews.
