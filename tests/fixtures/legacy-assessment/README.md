# Legacy assessment regression fixtures

`published-example.input.json` contains synthetic assessor inputs. Reproduce
`published-example.expected.json` with the offline helper:

```bash
node plugins/arckit-claude/scripts/legacy-assessment.mjs --input tests/fixtures/legacy-assessment/published-example.input.json --json
```

`published-example.report.md` renders those results using the UK Document Control
partial. These records are synthetic tests, not real evidence or approvals.
The Node suite tests calculations, dates, schema, classifications and dependency
propagation. The Python distribution suite executes the helper in Claude and all
seven generated targets and all four CLI scaffold modes.

Seven behavioural cases live in `plugins/arckit-claude/evals/legacy-*`. They test
supported, unsupported, expiring, dependent, sparse, conflicting and incomplete-risk
scenarios. Live evaluation requires the relevant authenticated runtime; structural
case validation does not establish model behaviour. See the command guide for sources.
