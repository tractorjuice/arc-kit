# LinkedIn Version: Is Max Effort Worth It?

Post on the ArcKit page with the `effort` carousel (`docs/social/out/effort/carousel.pdf`). Warm, first-person-plural voice (revised before posting from the practitioner draft); the first of the three voices under test in `docs/social/SOCIAL.md`.

## LinkedIn Post Body

Does turning an AI's effort setting up to maximum give you a better architecture document? We'd assumed so. Eighteen ArcKit commands ran at Claude's highest setting, and we had never checked. So we measured it.

53 test runs across Claude Opus 5.5 and Sonnet 5.5, $137 of recorded model time.

For one requirements document on Opus 5.5:

→ High effort: $2.90, 12 minutes, about 100 requirements
→ Max effort: $9.82, 48 minutes, about 100 requirements

The same document, with four times the wait.

Where max did help, on Sonnet 5.5, the reason surprised us. The model was working around our own templates. 13 of the 55 we checked had examples that didn't follow their own instructions. The requirements template asked for acceptance criteria on every requirement, yet only 1 of its 30 examples had them. Quite reasonably, the AI followed the examples.

So we fixed the templates. At high effort, all four test runs now produce complete requirements, for about a third of what max costs. The fixes are in ArcKit 6.16.6, so if you've updated, you already have them.

If an AI-drafted document comes back thinner than you hoped, the template is a good first place to look, before reaching for a bigger setting.

The full write-up covers the method, every cost, and the tests we got wrong along the way:
https://arckit.org/share/2026-09-29-is-max-effort-worth-it.html?utm_campaign=show-your-working&utm_source=linkedin

What have you found makes the biggest difference to the quality of AI-drafted documents?

#EnterpriseArchitecture #AIGovernance #DigitalGovernment #OpenSource

<!-- arckit:related-articles -->
## Related Articles

- [Is Max Effort Worth It? What 53 Test Runs Taught Us About ArcKit](article-viewer.html?a=2026-09-29-is-max-effort-worth-it)
- [ArcKit v6.14.0: What the Harness Enforces, What It Asks, and What It Now Measures](article-viewer.html?a=2026-09-03-arckit-v6-14-enforce-ask-measure)
- [Show Your Working: Who Uses ArcKit?](article-viewer.html?a=2026-09-23-show-your-working)

<!-- arckit:community-block -->
## Join the ArcKit Community

- **Discord** - real-time conversation, help with commands, and what people are building: [discord.gg/HsA4Y3hQ4](https://discord.gg/HsA4Y3hQ4)
- **LinkedIn Group** - announcements, case studies, and longer-form discussion: [linkedin.com/groups/17641034](https://www.linkedin.com/groups/17641034/)
- **GitHub** - code, issues, and contributions: [github.com/tractorjuice/arc-kit](https://github.com/tractorjuice/arc-kit)
