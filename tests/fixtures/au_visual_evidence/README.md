# AU Visual Evidence Fixture Set

Synthetic fixture excerpts for testing the AU Federal visual-evidence decision rule.

These fixtures are distilled from the synthetic `au-energy` validation pack, not copied wholesale. They are intentionally small so they can run in ordinary repository validation while the full Energy fixture pack remains the richer acceptance/evaluation source.

## Cases

| Fixture | Evidence State | Expected Outcome |
|---------|----------------|------------------|
| `complete-eastland-visual-evidence.md` | Enough structure to identify systems, flows, and classifications | Generate companion visual artefacts |
| `partial-voltiq-visual-evidence.md` | Some structure exists, but owners/volumes/scores are pending | Generate draft visual with `Pending Input` labels |
| `sparse-soci-flowdown-visual-evidence.md` | Obligation and context only; no system relationships | Do not create a diagram; record a Visual Evidence Gap |

## Source Note

The source pack is synthetic and fictional. These excerpts are reduced test fixtures and should not be treated as real client evidence.
