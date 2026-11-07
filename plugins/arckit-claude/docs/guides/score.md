# Vendor Scoring

Score vendor proposals against evaluation criteria with persistent structured storage, side-by-side comparison, and audit trail.

## Usage

```text
/arckit:score vendor <name> --project=NNN    # Score a vendor
/arckit:score compare --project=NNN          # Compare all scored vendors
/arckit:score audit --project=NNN            # View scoring audit trail
```

## Workflow

```text
/arckit:evaluate  →  /arckit:score vendor  →  /arckit:score compare  →  /arckit:sow
   (criteria)         (score each)             (decide)                  (procure)
```

## How bids are read

A bid is written by a party that gains from a high score, so `/arckit:score` never reads it directly. A read-only reader opens one supplier's documents and returns short claims against each criterion, and scoring uses only those claims.

- **Formats:** PDF, Markdown and text. Export a Word document to PDF first.
- **No claim, no marks:** a criterion the bid doesn't address scores 0.
- **Unreadable documents:** if any document can't be read, the vendor stays unscored and you're told which file and why. It never gets a 0.
- **Keep the vendor's folder for what the supplier sent.** ArcKit writes its own files to `vendors/_evaluations/<vendor>/`, and scoring stops for a vendor whose folder holds an `evaluation.md`, `notes.md` or `claims.json`.

Scoring is still a judgement on what the supplier claims, so check the claims behind any close result. This works in Claude Code. Other runtimes have no subagents, so they read bids in one context.

## Scoring Rubric

| Score | Meaning | Description |
|-------|---------|-------------|
| **0** | Not Met | No evidence of capability; does not address the criterion |
| **1** | Partially Met | Some evidence but significant gaps remain |
| **2** | Met | Fully addresses the criterion with adequate evidence |
| **3** | Exceeds | Goes beyond requirements with strong differentiation |

## Examples

```bash
# Score a vendor against project 001's evaluation criteria
/arckit:score vendor "Acme Cloud Services" --project=001

# Score another vendor for comparison
/arckit:score vendor "Beta Systems" --project=001

# Generate side-by-side comparison with sensitivity analysis
/arckit:score compare --project=001

# View the audit trail
/arckit:score audit --project=001
```

## Storage

Scores are stored in `projects/{id}/vendors/scores.json` as structured JSON:

```json
{
  "projectId": "001",
  "lastUpdated": "2026-03-08T10:00:00Z",
  "criteria": [...],
  "vendors": {
    "acme-cloud": {
      "displayName": "Acme Cloud Services",
      "scores": [...],
      "totalWeighted": 2.45,
      "integrityFindings": [
        { "type": "instruction", "file": "proposal.md", "location": "Section 4" }
      ]
    }
  }
}
```

This file can be committed to git for team visibility and governance audit.

`integrityFindings` lists any text in a proposal aimed at the evaluator or hidden from a human reader, which isn't followed. An empty list means none was found. A finding says where the text is, not what it says.

`failedQualifications` lists any mandatory qualification the bid doesn't evidence. A vendor with one can't be the recommendation in `compare`. To clear it, add the evidence to the vendor's folder and re-score.

The claims behind each score are saved in `vendors/_evaluations/<vendor>/claims.json`, so a score can be traced to its file and location.

## Comparison Features

The `compare` sub-action generates:

- **Score matrix** — side-by-side scores for every criterion
- **Weighted totals** — overall ranking accounting for criterion weights
- **Risk summary** — aggregated risks from each vendor's scoring
- **Integrity findings** — each vendor's findings, named in the recommendation if the top vendor has any
- **Sensitivity analysis** — how rankings change if criterion weights shift by ±10%

## Validation

A PreToolUse hook validates `scores.json` before every write:

- Score values must be 0-3
- Criteria weights must sum to approximately 1.0
- All required fields must be present
- Referenced criterion IDs must exist
- An integrity finding must hold only a type, file and location

## Governance

The structured format supports:

- **Audit trail** — who scored what and when
- **Reproducibility** — scores can be re-examined against original evidence
- **Challenge response** — if a vendor challenges the decision, the evidence chain is documented
- **Team scoring** — multiple evaluators can score independently and results can be merged
