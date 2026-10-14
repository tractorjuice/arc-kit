---
name: certification-questions
description: "Use when adding, rewriting, retiring or reviewing ArcKit certification quiz questions, editing a private question bank under certification/private/, or uploading a bank to the certification Worker. Not needed when changing the Worker code or quiz pages (normal development), or the public sample fixture in tests/certification/fixtures/ (placeholders only)."
paths:
  - "certification/**"
  - "tests/certification/**"
---

# Certification questions

The question banks decide who gets an ArcKit credential. Treat a question like code that ships: written to rules, checked by script, reviewed by someone else, released under a new version and smoke-tested live. The answers never leave the private folder.

## Where things live

| What | Where |
|---|---|
| Real banks (gitignored, never committed) | `certification/private/<level>.json` |
| Retirements and sources (private) | `certification/private/CHANGELOG.md` |
| Public sample (placeholders only) | `tests/certification/fixtures/awareness.sample.json` |
| Structure check | `node certification/worker/scripts/check-bank.mjs <bank>` |
| Quality lint | `node .claude/skills/certification-questions/scripts/lint-bank.mjs <bank>` |
| Live smoke test | `node .claude/skills/certification-questions/scripts/smoke-test.mjs <level> <bankVersion>` |
| Writing rules | [references/item-writing.md](references/item-writing.md), spec §5 and §6.1 |
| Live bank | Worker `arckit-cert`, KV binding `QUESTIONS`, key = level |

## Changing a bank: every step, in order

1. **Keep the shape.** Domain sizes are fixed (Awareness: 6 per domain, 30 in all). To add a question, retire one from the same domain.
2. **IDs are permanent.** A new question, or one that now tests something different, gets the next unused ID. Never reuse or repurpose an ID. Pure wording fixes keep their ID. Log every retirement and new ID in the private CHANGELOG with the date, the reason and the doc the fact comes from.
3. **Write to the rules** in `references/item-writing.md`, using ArcKit's own docs for every fact.
4. **Run both checks**: `check-bank` must say "Bank OK" and `lint-bank` must report 0 errors. Read every warning.
5. **Get an independent review.** A fresh agent or person checks accuracy against the docs, one best answer, clues between items and fairness, and reports by item ID only. Fix the must-fix items, then repeat step 4.
6. **Release.** Bump `bankVersion` (`aw-YYYY-MM-N`). Copy the bank to a private backup outside the repo (the maintainer uses `~/Documents/ArcKit/certification/banks/<level>-<bankVersion>.json`).
7. **Upload outside live sessions.** Attempts in progress get a 409 and must reload. From `certification/worker/`: `npx wrangler kv key put --binding QUESTIONS <level> --path ../private/<level>.json --remote`.
8. **Smoke test.** `node .claude/skills/certification-questions/scripts/smoke-test.mjs <level> <bankVersion>` must print `OK`. It checks that the live Worker serves the new version with no answers and correct CORS, and it prints no question text.

## Privacy

- Item text and answers stay in `certification/private/`, in your chat with the maintainer, and in deleted scratch files. They never go in commits, PRs, issues, CI logs, Discord or the public fixture.
- When reporting problems anywhere public, name the item ID and the rule only.
- Both scripts print only aggregates and IDs, so their output is safe to share.

## Common mistakes (seen in testing)

| Mistake | Fix |
|---|---|
| The correct answer is the longest option | Rebalance the lengths; `lint-bank` flags it |
| Rewriting `awNN` so it tests something new | Retire it, and add the next ID |
| A seventh question in a domain | Swap: retire one first |
| Uploading after `check-bank` alone | `lint-bank`, then independent review, then upload |
| A three-sentence explanation | Use 1–2 sentences on why the key is right |
| Only the key has a "claim; qualifier" shape, or only the key avoids "only/always/never" | Give options the same shape; `lint-bank` warns |
| Claiming the videos cover the whole pool | Say what a candidate should watch and read, and keep items within it |
| Trivia: versions, counts, file paths | Test ideas that survive releases |
| Uploading during a webinar or live session | Wait until it's over |
| No smoke test after upload | Step 8, every time |
