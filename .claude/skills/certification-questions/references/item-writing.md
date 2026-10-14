# Writing certification questions

Adapted, with the maintainer's agreement, from the item-writing guidelines of GCATI, the maintainer's earlier certification business. The spec (`docs/plans/2026-10-14-arckit-certification-programme.md`, §5 and §6.1) is the authority on levels, domains and weighting.

## Anatomy

Each item has a **stem** (the question), one **key** (the correct answer), three **distractors** and an **explanation**. There is exactly one best answer.

```json
{ "id": "aw31", "domain": "traceability", "prompt": "…", "options": ["…", "…", "…", "…"], "answer": 2, "explanation": "…" }
```

## Rules for every item

- **Plausible distractors.** Each wrong option should tempt someone who half-knows the topic. None should be arguably correct.
- **Balanced options.** The key is never the longest, and no option is much longer or shorter than the rest (within about 1.25x). `lint-bank` checks this.
- **Same shape.** The key must not be the only option with a qualifier clause ("X; Y"), must not be the only one carrying a hedge ("without…", "unless…", "rather than…"), and must not be the only one without an absolute word (only, always, never, exactly). `lint-bank` warns on all three.
- **Spread the key.** Vary the key's position across the bank and use at least three positions in each domain.
- **ArcKit's own words.** Use the terms the guides and templates use (`docs/guides/`, `plugins/arckit-claude/templates/`). Keep the language simple and readable for non-native speakers.
- **No "all of the above" or "none of the above".**
- **Negatives sparingly.** Use a negative only when the learning outcome is knowing what does *not* happen, and write it in capitals (NOT). `lint-bank` warns on any negative so a reviewer decides.
- **No give-aways.** Draws take several items from each domain, so no stem or option may reveal another item's answer, either word for word or by paraphrase.
- **No trivia.** No version numbers, command counts or file paths: they go stale and test memory, not understanding.
- **"Best option" questions only if unavoidable.** They invite argument; keep any you do write unambiguous.
- **Explanation.** 1–2 sentences of at most 300 characters on *why* the key is right, and where useful the misconception the distractors target. Don't repeat the option back.

## What each level tests

| Level | Cognitive level | What to write |
|---|---|---|
| Awareness | Bloom's 1–2: know, understand | Ideas someone gets from the 8-minute "ArcKit explained" video and Part 1 of "ArcKit for Beginners". Standard four-option questions. |
| Foundation | about 25% Bloom's 2 and 75% Bloom's 3: apply | Scenarios: "a team has X; which command or next step…". Exhibit items show a small REQ table, TRAC row, provenance block or hook message, with 3–4 items each. Weight domains as spec §5 sets out. |

Question types:

- **Standard four-option MCQ:** the default.
- **Missing word:** a statement with one blank and four candidates.
- **Exhibit-based:** a standard MCQ about a shown artefact, kept small and showing only what the item needs.
- **List questions ("which two…"):** don't use them until the Worker can mark more than one key.

## Grounding

Check every key and every distractor against the docs before review: `CLAUDE.md`, `README.md`, `plugins/arckit-claude/docs/ENFORCEMENT.md`, `plugins/arckit-claude/hooks/README.md`, `plugins/arckit-claude/references/`, `docs/guides/` and the privacy page. Record the source file in the private CHANGELOG entry, not in the bank. When a command, hook or template changes, retire the items that describe the old behaviour.

## Reviewer checklist (reported by item ID only)

1. Is the key true according to the docs, and is each distractor false according to the docs?
2. Is there exactly one best answer?
3. Could a beginner at this level know it? Is it free of trivia?
4. Is there no length or grammar cue, and no clue from another item in the same domain?
5. Is the explanation accurate, and does it explain rather than restate?

Classify each problem as must-fix, should-fix or nit, with the doc evidence.

## Lifecycle

**Draft** → **Reviewed** (independent reviewer) → **Approved** (released in a new `bankVersion`) → **Retired** (removed from the bank, its ID never reused, logged in the private CHANGELOG).
