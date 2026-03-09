---
description: 'Score vendor proposals against evaluation criteria with persistent structured storage'
agent: 'agent'
tools: ['readFile', 'editFiles', 'runCommand', 'codebase', 'search']
---

# Vendor Scoring

You are helping an enterprise architect score vendor proposals against evaluation criteria, compare vendors, and maintain an auditable scoring record.

## User Input

```text
${input:topic:Enter project name or topic}
```

> **Note**: Before generating, scan `projects/` for existing project directories. For each project, list all `ARC-*.md` artifacts, check `external/` for reference documents, and check `000-global/` for cross-project policies. If no external docs exist but they would improve output, ask the user.

## Sub-Actions

Parse the first word of `${input:topic:Enter project name or topic}` to determine which action to perform:

### Action 1: `vendor <name> --project=NNN`

Score a specific vendor against the project's evaluation criteria.

1. **Read the project's EVAL artifact** (evaluation criteria):
   - If no EVAL exists, tell the user to run `/arckit:evaluate` first
   - Extract all evaluation criteria with their weights and categories

2. **Read vendor proposal** from `projects/{id}/vendors/{vendor-name}/`:
   - If the directory doesn't exist, create it
   - Read any `.md` or `.pdf` files as vendor proposal content

3. **Read existing scores** from `projects/{id}/vendors/scores.json` (if exists)

4. **Score each criterion** using the 0-3 rubric:
   | Score | Meaning | Description |
   |-------|---------|-------------|
   | 0 | Not Met | No evidence of capability; does not address the criterion |
   | 1 | Partially Met | Some evidence but significant gaps remain |
   | 2 | Met | Fully addresses the criterion with adequate evidence |
   | 3 | Exceeds | Goes beyond requirements with strong differentiation |

5. **For each score, provide:**
   - The numeric score (0-3)
   - Evidence from the vendor proposal supporting the score
   - Any risks or caveats noted

6. **Calculate weighted totals**:
   - Use weights from the EVAL criteria (default to equal weighting if none specified)
   - `totalWeighted = sum(score * weight) / sum(weight)`
   - `totalRaw = sum(scores)`
   - `maxPossible = 3 * number_of_criteria`

7. **Write scores** to `projects/{id}/vendors/scores.json`:

   ```json
   {
     "projectId": "001",
     "lastUpdated": "2026-03-08T10:00:00Z",
     "criteria": [
       { "id": "C-001", "name": "Technical Capability", "weight": 0.25, "category": "Technical" }
     ],
     "vendors": {
       "acme-cloud": {
         "displayName": "Acme Cloud Services",
         "scoredDate": "2026-03-08T10:00:00Z",
         "scoredBy": "Architecture Team",
         "scores": [
           { "criterionId": "C-001", "score": 3, "evidence": "Demonstrated...", "risks": "" }
         ],
         "totalWeighted": 2.45,
         "totalRaw": 5,
         "maxPossible": 6
       }
     }
   }
   ```

8. **Output a markdown summary** to console showing all scores with evidence.

### Action 2: `compare --project=NNN`

Generate a side-by-side vendor comparison.

1. **Read** `projects/{id}/vendors/scores.json` — if it doesn't exist or has fewer than 2 vendors, explain what's needed
2. **Output comparison table**:

   ```markdown
   ## Vendor Comparison: Project 001

   | Criterion | Weight | Acme Cloud | Beta Systems | Gamma Tech |
   |-----------|--------|------------|--------------|------------|
   | Technical Capability | 25% | 3 | 2 | 2 |
   | Security Compliance | 20% | 2 | 3 | 1 |
   | **Weighted Total** | | **2.45** | **2.30** | **1.95** |

   ### Recommendation
   **Acme Cloud** scores highest overall (2.45/3.00).

   ### Risk Summary
   - Acme Cloud: [aggregated risks from scoring]
   - Beta Systems: [aggregated risks from scoring]

   ### Sensitivity Analysis
   Show how the ranking changes if the top-weighted criterion weight is adjusted by +/- 10%.
   ```

3. **Include sensitivity analysis**: Vary the weight of each criterion by ±10% to identify which criteria are decisive.

### Action 3: `audit --project=NNN`

Show the scoring audit trail.

1. **Read** `projects/{id}/vendors/scores.json`
2. **Output chronological audit**:

   ```markdown
   ## Scoring Audit Trail: Project 001

   | Date | Vendor | Scored By | Weighted Score | Criteria Count |
   |------|--------|-----------|----------------|----------------|
   | 2026-03-08 | Acme Cloud | Architecture Team | 2.45/3.00 | 8 |
   | 2026-03-07 | Beta Systems | Architecture Team | 2.30/3.00 | 8 |
   ```

3. Show total vendors scored, date range, and whether any vendors are missing scores.

### Default (no action specified)

If no recognised action, show usage:

```text
Usage: /arckit:score <action> [options]

Actions:
  vendor <name> --project=NNN   Score a vendor against evaluation criteria
  compare --project=NNN         Side-by-side vendor comparison
  audit --project=NNN           Scoring audit trail

Examples:
  /arckit:score vendor "Acme Cloud" --project=001
  /arckit:score compare --project=001
  /arckit:score audit --project=001
```

## Important Notes

- **Always preserve existing vendor scores** when adding a new vendor — append, don't overwrite
- **Criterion IDs must be consistent** across all vendors in the same project
- **The scores.json validator hook** will warn if weights don't sum to 1.0 or scores are out of range
- **Evidence field is mandatory** — never assign a score without citing supporting evidence from the proposal

## Suggested Next Steps

After completing this command, consider running:

- `/arckit-evaluate` -- Create or update evaluation framework before scoring *(when No EVAL artifact exists for the project)*
- `/arckit-sow` -- Generate Statement of Work for selected vendor *(when Vendor selection complete, ready for procurement)*
