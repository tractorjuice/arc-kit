# A second look

<!-- markdownlint-disable MD018 -- hashtag lines at the end of each post are post text, not headings -->

Five silent 30-second films about ArcKit's independent reviewers: the fresh-eyes reviewers in `/arckit:hld-review` and `/arckit:dld-review`, the independent scorer and the moderator in `/arckit:score` and `/arckit:evaluate` (#1084, #1085). One film a day on the ArcKit page, and one group post that asks for views.

Voice and rules: `SOCIAL.md` (the maintainer's voice, lead with what the reader can use, no costs, no mistakes, no usage claims, "GitHub Copilot" in full).

**Not released yet.** The changes are under Unreleased in the changelog: they merged on 8 November, after 6.20.0. Every post says "Coming in the next release". Once that release is out, change the line to "Now in ArcKit" in any post still queued, and consider editing the ones already live.

## The films

All five are 1080 × 1350, 30 fps, silent, made with HyperFrames. Projects are in `~/hyperframes/arckit-second-look-{readers,proofread,moderation,not-told,checking}`, and renders in `/Volumes/External Storage/ArcKit/videos/arckit-second-look/`. Each project's `REVIEW.md` records the checks and the weakest shot.

| # | File | What it shows |
|---|---|---|
| 1 | `arckit-second-look-01-readers.mp4` | Three readers take turns on one sample design: 34 findings, 23 already raised, 10 added, 1 not accepted |
| 2 | `arckit-second-look-02-proofread.mp4` | A doubled "the" you read past, then the two gaps a fresh reader found in the real review |
| 3 | `arckit-second-look-03-moderation.mp4` | A moderation meeting from above: A gave 1, B gave 2, the moderator settles at 2 with its reason |
| 4 | `arckit-second-look-04-not-told.mp4` | Three briefings, mostly crossed out, and a reviewer's whole prompt: four lines of file paths |
| 5 | `arckit-second-look-05-checking.mp4` | A replay-style check: two blocking findings added, the verdict stands at REJECTED; a split score settles at 2 |

Every real excerpt is from the 8 November eval runs on the fictional Housing Benefits Portal design (`20261108T204230Z/hld-review-benign-design`) and the borderline sample bid, and is labelled "ArcKit test run on a sample design" or "sample bid" on screen (rule 3). The shared closing card reads "A second look from someone who wasn't in the room", then the logo, "New in ArcKit" and arckit.org.

LinkedIn ignores a video supplied by browser automation, so the maintainer attaches each film by hand. Put the text in the composer first, then attach the film: on 9 November the page post went out with no text when Post was clicked straight after the upload, and the text had to be added with Edit post.

## Cadence

- **Monday 9 November:** film 1 on the page and in the group (posted).
- **Tuesday 10 to Friday 13 November:** films 2 to 5 on the page, one a day.
- Discord: nothing until the release, when the release notes cover it.

## Posts

### Film 1: ArcKit page (posted Monday 9 November)

Posted: <https://www.linkedin.com/feed/update/urn:li:activity:7525463463314309120/>. Went out without text, then edited the same minute to the text below, so LinkedIn marks it "Edited". It carries two hashtags, not the usual three or four.

> ArcKit's design review now gets a second look from three readers who weren't in the room.
>
> A long review session explains gaps to itself. So before /arckit:hld-review writes the review, three fresh reviewers read the design, each through one lens: comprehension, principles or requirements. They get the design, the principles and the requirements. Nothing else.
>
> On a sample design they raised 34 findings. The review already had 23. It added 10 it hadn't raised, and turned down 1, with the reason written down.
>
> Coming in the next release. How it works: https://arckit.org/guide/hld-review.html
>
> #EnterpriseArchitecture #ArcKit

### Film 1: LinkedIn group (posted Monday 9 November)

Posted: <https://www.linkedin.com/feed/update/urn:li:activity:7525464245493239808/>, with film 1.

> I've been adding independent checks to ArcKit's reviews, and I'd like views from people who run design reviews and bid evaluations.
>
> All of this is in the next release:
>
> - /arckit:hld-review gets three fresh-eyes readers. They see the design, the principles and the requirements, and none of the review's working. On a sample design they raised 34 findings, 10 of them new to the review, and every one gets an outcome in the review.
> - /arckit:dld-review gets the same, with one reader checking the detailed design against the approved HLD.
> - /arckit:score and /arckit:evaluate score each bid twice. The second scorer doesn't see the first scores or the vendor's name.
> - Where the two scores differ, a moderator decides without being told whose score is whose. Both first scores are kept.
>
> The film is the first of five short ones on how it works.
>
> If you moderate evaluations or sit on a design authority: is this how you'd want a second look done? What would you want the moderator to see that it doesn't?
>
> https://arckit.org/guide/hld-review.html

### Film 2: ArcKit page (queued, Tuesday 10 November)

There's a mistake in the first three seconds of this one. Easy to miss.

A reviewer who has sat through the explanation has the same problem: it reads what it expects. ArcKit's fresh-eyes reviewers start cold, and the comprehension reader explains the design back in plain words. Where its account differs from what the supplier meant, the document is unclear.

On a sample design it couldn't tell how the components talk to each other, or whether claim decisions reach any other council system. Both became findings.

https://arckit.org/guide/hld-review.html

#EnterpriseArchitecture #ArchitectureReview #AIGovernance

### Film 3: ArcKit page (queued, Wednesday 11 November)

Every public-sector evaluator knows the moderation meeting. ArcKit now runs one.

/arckit:score and /arckit:evaluate score each bid twice. The second scorer works from the checked claims alone: no first scores, no vendor name, no conversation. Where the two differ, a moderator sees both as Evaluator A and Evaluator B, isn't told whose is whose, and decides. Its decision is recorded as it stands, and both first scores are kept.

On a sample bid it was a 1 and a 2, settled at 2: the criterion as worded named neither of the unfinished features.

Coming in the next release. https://arckit.org/guide/score.html

#EnterpriseArchitecture #Procurement #PublicSector

### Film 4: ArcKit page (queued, Thursday 12 November)

Most of their briefing is crossed out, on purpose.

ArcKit's independent reviewers are useful because of what they aren't told. The design reviewers get file paths to the design, the principles and the requirements: no conversation, no draft findings, no scores, no verdict. The second evaluator gets the criteria and the checked claims, not the first scores or the vendor's name. Its only tool lists file names, so it can't open the bid. The moderator isn't told whose score is whose.

The film shows a reviewer's whole prompt from a test run. It's four lines of file paths.

https://arckit.org/guide/hld-review.html

#EnterpriseArchitecture #AIGovernance #ArchitectureReview

### Film 5: ArcKit page (queued, Friday 13 November)

Decision under review.

When the fresh-eyes readers add a blocking finding, ArcKit's HLD review checks its verdict again before it's written. On the sample design two new blocking findings came in, and the verdict stood at REJECTED. The review says so in one line.

Split vendor scores get the same: a moderator settles them before a final score is recorded.

That's the last of five short films on the new independent checks. They need Claude Code; other assistants skip the step and say so in the review.

Coming in the next release. https://arckit.org/guide/hld-review.html

#EnterpriseArchitecture #ArchitectureReview #Procurement
