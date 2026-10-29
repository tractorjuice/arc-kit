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

`uncertainty-example.svg` is an independently synthetic chart: set the existing
published-example fixture’s numerical inputs to 4, then make L1 and C1 null. The
chart regression reproduces it byte-for-byte and enumerates all completions to check
its envelope. It illustrates a range crossing 16 without assigning a completed score.

`chart-legend-example.svg` uses the same synthetic incomplete inputs with explicitly
invented medium confidence and a suspected aggregate position of likelihood 4.5 and
impact 4. Its test proves that these annotations leave the calculated system results
and risk ordering unchanged. The picture is not derived from a source project.
