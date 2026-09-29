# ArcKit — social kit

What goes where, in what voice, and what never goes on a post. Borrowed in shape from the Forking Chefing social kit: one page that says which file fits which slot, a small set of rules that bind every post, a voice test judged on the platforms' own numbers, and every card rendered from code so a figure is corrected once and re-rendered, not edited in an image editor.

It serves the Q4 campaign, *Show Your Working* (`docs/plans/2026-09-22-marketing-strategy-q4.md`). The campaign's goal is named adopters and case studies, not reach, so a post earns its place by moving someone one step along: aware → tried it → told us → case study.

**Status:** draft for the maintainer. Nothing here has been posted.

---

## Where ArcKit posts

| Channel | Address | Use it for |
|---|---|---|
| LinkedIn page | linkedin.com/company/**arckit-org** | Carousels, article links, release notes. **Not** linkedin.com/company/arckit, which is an unrelated education firm in Dublin |
| LinkedIn group | linkedin.com/groups/17641034 | The same posts, shorter, as a question to members. Posts appear under the maintainer's name |
| Discord | ArcKit server, #announcements (read-only) and #show-your-working | Announcements; the private route for adopters who can't post a public GitHub issue |
| Medium | medium.com/arckit | Article mirrors |
| Maintainer's own LinkedIn | — | Reshares only. Anything beyond that needs the maintainer's say-so |

The primary audience (UK public sector architects) is on LinkedIn and in the cross-government architecture community, not on TikTok or Instagram. The chef kit needed seven platforms because diners are everywhere; ArcKit needs two done well. **YouTube Shorts is the one addition worth trying**, for the 30-second video below, because a Short can be embedded in the landing page and linked from LinkedIn.

## What to upload where

| Slot | Size | File |
|---|---|---|
| LinkedIn document carousel | PDF, 1080 × 1350 pages | `docs/social/out/<series>/carousel.pdf` |
| LinkedIn single image | 1200 × 627 | the article hero, via its share link |
| Link preview (any platform) | 1200 × 630 | automatic from `https://arckit.org/share/<slug>.html` |
| Discord | any | attach slide 1 of a series; link the share page |
| Instagram / portrait (if ever used) | 1080 × 1350 | `docs/social/out/<series>/slide-N-1080x1350.png` |

Link to `https://arckit.org/share/<slug>.html`, never to `article-viewer.html?a=…`: the viewer is rendered in the browser, so link previews only ever see a generic card. LinkedIn fixes a post's preview when it is published, so a wrong card means deleting and reposting, not editing. Add `?utm_campaign=show-your-working&utm_source=<channel>` to campaign links so Google Analytics can separate campaign traffic from release traffic. On Discord, wrap GitHub links in `<…>` to stop the generic GitHub embed.

Render the cards with:

```bash
uv run --no-project --with pillow python docs/social/render.py
```

## Series

A series is a recurring shape of post, so each one is quick to make and readers learn what to expect.

1. **Measured.** One finding from ArcKit's own tests, with the number and what it cost. The first is this week's effort testing (carousel `effort`). Runs whenever the evals produce a result worth telling. It carries the campaign's first message, *same AI, with its working shown*, better than any claim.
2. **Show your working.** The adopter ask (carousel `show-your-working`). Once a fortnight, rotating the three routes: named, anonymous, not listed. Each time a real adopter joins, a spotlight post with their permission replaces one ask.
3. **One artefact, 20 minutes.** From the campaign plan: one governance document made on a public test repository, with a screenshot and a plain list of what still needed fixing by hand. The honesty about the fixes is the point.
4. **Office hours.** A date card and a one-line agenda, a week before and on the day. **Only once a date is booked**; see *Before any of this goes up*.
5. **Release notes.** Only releases that change something for the user, written the way the articles are: what changed for you, then why.

About two posts a week on the LinkedIn page, as the campaign plan budgets, with one slot in five kept free for anything reactive.

## Voice

**To be tested, the way the chef kit tests its voices.** Three voices on the same content, one post each, a week apart, judged on LinkedIn's own analytics seven days after each goes up (impressions, reactions, comments, clicks to the share page, and the one that matters: adopter-form submissions that week). Nothing changes the articles' voice; this is for posts only.

- **Practitioner, first.** First person, practical, led by one artefact or one number: *"I made the AI think four times as long. It wrote the same 100 requirements."*
- **Plain evidence, second.** No first person. The finding, the number, the cost, the link. Reads like a good briefing note.
- **Question, third.** Opens on the reader's own situation: *"How long does your next spend-control pack take to draft?"* Then the evidence.

Whatever the voice: plain words, short sentences, no hype words ("revolutionary", "game-changing", "10x"), no emoji beyond the occasional one in Discord, and "GitHub Copilot" always in full. LinkedIn page posts end with three or four hashtags (#EnterpriseArchitecture first); group posts and Discord carry none. Every post ends with one clear next step, or a question for the group.

## What never goes on one of these

A post is harder to correct than a web page: it is reshared and screenshotted. These rules bind every voice.

1. **No usage claims that haven't been confirmed.** "Used across UK Government and the NHS" is third-party reporting, not ours to repeat. Name an adopter only if they chose the named tier, and only in the words they approved.
2. **No department logos or crests,** and no artefact from a real organisation. Screenshots come from the public test repositories or the fictional Ashcombe District Council used in the tests.
3. **Numbers only from something recorded,** with the date or the source: an eval run, a traction report, a public record. Costs are list-price model costs. No "saves X hours" or "Y% faster" until the pilot workshops produce one honest timed number, which the campaign plan asks for.
4. **Say "GitHub Copilot" in full,** never "Copilot" alone. Most civil servants' Copilot is Microsoft 365 Copilot, where ArcKit doesn't run.
5. **Never "your data never leaves your repository".** Prompts go to the model provider. Say what is true: *nothing is sent to us*, and every artefact stays in your repository.
6. **No paid promotion** until the campaign's week-7 review releases the optional budget, and then only for a case-study post.

## Before any of this goes up

- **Office hours have no date yet.** The launch article promised them "starting in October". The adopter carousel says *"An open call from October"*, which is still true; don't post a date card until the slot is booked.
- **Four pilot workshops are offered** in the carousel, as in the launch article. If fewer than four can be run this quarter, change the slide first.
- **The testing article went live on 29 September** (`arckit.org/share/2026-09-29-is-max-effort-worth-it.html`), and the changes it describes are merged into `main` but not yet released. Posts can say they are coming in the next release.
- **Nobody has used the adopter form yet.** The first post in *Show your working* should say so honestly, as the launch article did: an empty list is better than a padded one.

---

## Post queue

Copy is ready to paste. Links carry UTM tags. Post each only on the maintainer's go-ahead. Page posts live beside their article as `<slug>-linkedin.md`, so the copy sits with what it promotes; shorter posts for the group and Discord live here. Drafted with the marketing plugin's `draft-content` skill and checked with its `brand-review` skill against the rules above.

### Q1. Testing results — LinkedIn page, with the `effort` carousel (Practitioner voice)

Copy: `docs/articles/2026-09-29-is-max-effort-worth-it-linkedin.md`, which follows the archive's convention for channel versions (`<slug>-linkedin.md`, `<slug>-medium.md`). Attach `docs/social/out/effort/carousel.pdf` as a document. The Medium mirror is `docs/articles/2026-09-29-is-max-effort-worth-it-medium.md`.

### Q2. The same finding — LinkedIn group (Question voice)

> How hard should an AI think when it drafts a requirements document?
>
> I measured it for ArcKit. At max effort, requirements took four times as long and cost three times as much, for about the same 100 requirements.
>
> What actually improved the documents was fixing template examples that contradicted their own instructions. The AI follows the example, and only overrules it when you pay for more thinking.
>
> Has anyone else found the examples mattering more than the settings? I'd like to hear what you've seen.
>
> Full write-up: https://arckit.org/share/2026-09-29-is-max-effort-worth-it.html?utm_campaign=show-your-working&utm_source=linkedin-group

### Q3. Discord — #announcements

> 📊 **New article: Is Max Effort Worth It?**
> 53 test runs, about $150. Max effort mostly bought longer, slower documents. The real gaps were templates whose examples contradicted their own instructions.
> • 13 templates fixed, merged, in the next release
> • `/arckit:requirements` will finish in about a quarter of the time, `/arckit:sobc` in about a third
> Questions or your own results: #show-your-working
> <https://arckit.org/share/2026-09-29-is-max-effort-worth-it.html>

### Q4. Adopter ask — LinkedIn page, with the `show-your-working` carousel (Plain evidence voice)

Copy: `docs/articles/2026-09-23-show-your-working-linkedin.md`. Attach `docs/social/out/show-your-working/carousel.pdf` as a document.

### Q5. 30-second vertical video — script (for YouTube Shorts, LinkedIn)

The chef kit's template: 30 seconds, 1080 × 1920, six cards of about five seconds, a music bed and no voice. Use only music ArcKit holds a licence for, or royalty-free music, and keep the licence on file. Here the cards are the `effort` carousel's content, re-set vertically; render them from `render.py` before cutting.

1. *We told the AI to think harder.*
2. *Same 100 requirements. Four times the wait.* (the two cost bars)
3. *The real problem: the examples.* (1 in 30)
4. *Fix the example.* (4 of 4 runs complete)
5. *Check the template before the setting.*
6. *arckit.org* — ArcKit logo, and the share link as a QR code.

No stock footage of offices or people typing, and no screen recording of anyone's real project: rule 2.
