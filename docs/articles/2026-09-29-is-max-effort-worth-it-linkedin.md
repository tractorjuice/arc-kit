# LinkedIn Version: Is Max Effort Worth It?

Post on the ArcKit page with the `effort` carousel (`docs/social/out/effort/carousel.pdf`). Practitioner voice, the first of the three voices under test in `docs/social/SOCIAL.md`.

## LinkedIn Post Body

I made the AI think four times as long. It wrote the same requirements.

ArcKit ran 18 of its commands at Claude's highest effort setting, and I had never measured whether that helped. This week I did: 53 test runs on Claude Opus 5.5 and Sonnet 5.5, $137 of recorded model time.

One requirements document on Opus 5.5:

→ High effort (ArcKit's usual): $2.90, 12 minutes, about 100 requirements
→ Max effort: $9.82, 48 minutes, about 100 requirements

What max did fix came from somewhere cheaper. 13 of the 55 command templates I audited had examples that contradicted their own instructions. The requirements template asked for acceptance criteria on every requirement, and its examples had them on 1 in 30. The AI copied the examples.

With the examples fixed, high effort wrote complete requirements in 4 runs out of 4. The fixes shipped in ArcKit 6.16.6.

If an AI-drafted document looks thin, check the template before you turn the effort up.

Method, results and every cost, including the tests I got wrong: https://arckit.org/share/2026-09-29-is-max-effort-worth-it.html?utm_campaign=show-your-working&utm_source=linkedin

Have you measured what your AI settings buy you on formal documents?

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
