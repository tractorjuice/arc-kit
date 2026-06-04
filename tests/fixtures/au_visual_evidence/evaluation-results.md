# AU Visual Evidence Decision Rule - Baseline Result Set

Baseline result set for the distilled AU visual-evidence fixtures.

| Fixture | Evidence State | Expected Decision | Result |
|---------|----------------|-------------------|--------|
| `complete-eastland-visual-evidence.md` | Complete | Generate companion visual artefacts | Pass |
| `partial-voltiq-visual-evidence.md` | Partial | Generate draft visual with `Pending Input` labels | Pass |
| `sparse-soci-flowdown-visual-evidence.md` | Sparse | Do not create a diagram; record a Visual Evidence Gap | Pass |

## Evaluation Criteria

- Complete evidence must include enough systems, relationships, and data context to justify companion diagram/DFD/data-model artefacts.
- Partial evidence must include real structure but clearly mark missing owners, data volumes, classifications, scores, or downstream dependencies as `Pending Input`.
- Sparse evidence must not trigger diagram generation. It must record a Visual Evidence Gap and list the minimum inputs needed.

## Notes

This result set is intentionally deterministic and fixture-based. It does not replace the full `au-energy` acceptance pack; it guards the AU Federal visual-evidence rule in ordinary CI.
