"""Generate the hero image for the ArcKit v6.23.0 release article.

Written for the person running the kitchen: the five steps ArcKit walks them
through to complete their Safer food, better business (SFBB) pack, then what
they can rely on. Same house style as the sibling generate-hero-*.py scripts.

    uv run --with pillow python docs/articles/generate-hero-v6-23-safer-food-better-business.py

The published hero is a redesigned version of this layout, supplied by the
maintainer on 19 November 2026, with three lines added beside the headline.
In its foot line "England" was set half in bold; the other half was thickened
to match before publishing. Running this script overwrites the published hero
with the plain version, so only run it to start a new design.
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

W, H = 1600, 900
BG = (13, 17, 23)
PANEL = (22, 27, 34)
LINE = (48, 54, 61)
TEXT = (230, 237, 243)
MUTED = (139, 148, 158)
GOLD = (234, 179, 8)
CYAN = (34, 211, 238)
GREEN = (52, 211, 153)

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)


def font(size, bold=False):
    for path in (
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
    ):
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            continue
    return ImageFont.load_default()


d.text((80, 62), "ArcKit v6.23.0", font=font(28, True), fill=GOLD)
d.text((80, 104), "Complete your SFBB pack,", font=font(58, True), fill=TEXT)
d.text((80, 172), "one step at a time.", font=font(58, True), fill=TEXT)
d.text((80, 254), "ArcKit walks you through Safer food, better business for caterers", font=font(28), fill=MUTED)

# Five steps, in the order you do them.
TOP = 330
steps = (
    ("Describe your", "business", "Who, where and", "what you sell", CYAN),
    ("Work through the", "safe methods", "One at a time,", "with you", GOLD),
    ("Add your own", "methods", "In your own", "words", GREEN),
    ("See what's", "left to do", "What's finished", "and what isn't", CYAN),
    ("Sign off each", "document", "By a named", "person", GREEN),
)
WIDTH, GAP = 272, 20
for i, (title1, title2, detail1, detail2, colour) in enumerate(steps):
    x = 80 + i * (WIDTH + GAP)
    d.rounded_rectangle((x, TOP, x + WIDTH, TOP + 270), radius=16, fill=PANEL, outline=colour, width=3)
    d.ellipse((x + 24, TOP + 24, x + 76, TOP + 76), fill=colour)
    d.text((x + 50, TOP + 50), str(i + 1), font=font(30, True), fill=BG, anchor="mm")
    d.text((x + 24, TOP + 118), title1, font=font(27, True), fill=TEXT, anchor="lm")
    d.text((x + 24, TOP + 152), title2, font=font(27, True), fill=TEXT, anchor="lm")
    d.text((x + 24, TOP + 204), detail1, font=font(22), fill=MUTED, anchor="lm")
    d.text((x + 24, TOP + 234), detail2, font=font(22), fill=MUTED, anchor="lm")

# What you can rely on.
Y = 640
facts = (
    ("SFBB's own wording, word for word", CYAN),
    ("Your answers, in your own words", GREEN),
)
x = 80
for text, colour in facts:
    d.rounded_rectangle((x, Y, x + 710, Y + 76), radius=14, fill=PANEL, outline=LINE, width=2)
    d.text((x + 355, Y + 38), text, font=font(26, True), fill=colour, anchor="mm")
    x += 730

d.line((80, 762, 1520, 762), fill=LINE, width=2)
d.text((80, 790), "For small caterers in England and Wales. Experimental, and off until you enable it.", font=font(26), fill=TEXT)
d.text((80, 836), "Not legal advice. The Food Standards Agency has not reviewed or endorsed it.", font=font(22), fill=MUTED)

out = Path(__file__).with_name("2026-11-19-arckit-v6-23-safer-food-better-business-sfbb-for-caterers-hero.png")
img.save(out, optimize=True)
print(out)
