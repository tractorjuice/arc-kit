# Superpowers — Plans and Specs

Internal design documents used by the Superpowers skill during feature development. Each feature gets a paired **spec** (design rationale) and **plan** (task-by-task implementation sequence).

## Layout

```
docs/superpowers/
├── plans/       # Active implementation plans — deleted when the feature ships
├── specs/       # Active design specs    — deleted when the feature ships
└── README.md    # This file
```

## Naming

- `plans/YYYY-MM-DD-<feature-name>.md`
- `specs/YYYY-MM-DD-<feature-name>-design.md`

Date is when the document was written, not when the feature shipped.

## Lifecycle

1. The Superpowers `writing-specs` skill creates the spec.
2. The `writing-plans` skill creates the matching plan.
3. The plan is executed task by task.
4. When the feature's PR merges, **delete both files** — the design rationale is preserved in the PR description and the shipped code is self-documenting.

The git history keeps the contents forever if anyone needs to refer back.

## Status as of 2026-04-20

**Active** — features not yet shipped:

| Date | Feature |
|---|---|
| 2026-04-19 | Community Commands Table (`commands.html`) |
| 2026-04-19 | Registry Consolidation (`guides.mjs` / `roles.mjs`) |

## Related

The book's implementation plan lived here briefly but moved to [tractorjuice/arckit-book](https://github.com/tractorjuice/arckit-book) on 2026-04-20 when the book was extracted into its own repository.
