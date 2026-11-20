"""Generate the hero image for the ArcKit v6.21.0 release article.

Written for the person running a design review: the steps ArcKit takes them
through, then what they can rely on. Same house style as the sibling
generate-hero-*.py scripts.

    uv run --with pillow python docs/articles/generate-hero-v6-21-a-second-look.py [output.png]

With no argument it writes the published hero's file name, so pass a path to
start a new design without overwriting a hero the maintainer has restyled.

The published hero is a redesigned version of this layout, supplied by the
maintainer on 19 November 2026, with three lines added beside the headline:
"A second look", "Three AI reviewers" and "A decision with your board". The first
line arrived as "Independent second look" and was changed at the maintainer's
word the same day, using letters already in the image.
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

# --- wording
VERSION = "ArcKit v6.21.0"
HEADLINE = ("A second look for every", "design review.")
SUB = "Three AI reviewers that haven't seen the session read the design first"
STEPS = (
    ("Run the review", "as before", "High-level or", "detailed design"),
    ("Three AI", "reviewers read it", "They see only the", "design documents"),
    ("Every finding", "gets an outcome", "Added, matched or", "turned down"),
    ("The verdict is", "checked again", "When a new finding", "is blocking"),
    ("Your board", "decides", "The review is", "its evidence"),
)
FACTS = ("Vendor scores get a second AI scorer", "An AI moderator settles any difference")
FOOT = "In ArcKit's own tests on 8 November 2026: 34 findings, 10 of them new to the review."
SMALL = "Needs Claude Code. It checks ArcKit's own work, and your panel and design authority still decide."
PUBLISHED = "2026-11-09-arckit-v6-21-a-second-look-hero.png"
# --- drawing

W, H = 1600, 900
BG = (13, 17, 23)
PANEL = (22, 27, 34)
LINE = (48, 54, 61)
TEXT = (230, 237, 243)
MUTED = (139, 148, 158)
GOLD = (234, 179, 8)
CYAN = (34, 211, 238)
GREEN = (52, 211, 153)
COLOURS = (CYAN, GOLD, GREEN, CYAN, GREEN)

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


def fits(text, face, width):
    """Stop with the line named when wording is too wide for its space."""
    if d.textlength(text, font=face) > width:
        sys.exit(f"too wide for {width}px: {text!r}")
    return text


d.text((80, 62), VERSION, font=font(28, True), fill=GOLD)
d.text((80, 104), fits(HEADLINE[0], font(58, True), 1440), font=font(58, True), fill=TEXT)
d.text((80, 172), fits(HEADLINE[1], font(58, True), 1440), font=font(58, True), fill=TEXT)
d.text((80, 254), fits(SUB, font(28), 1440), font=font(28), fill=MUTED)

# The steps, in the order you meet them.
TOP = 330
WIDTH, GAP = 272, 20
for i, (title1, title2, detail1, detail2) in enumerate(STEPS):
    colour = COLOURS[i]
    x = 80 + i * (WIDTH + GAP)
    d.rounded_rectangle((x, TOP, x + WIDTH, TOP + 270), radius=16, fill=PANEL, outline=colour, width=3)
    d.ellipse((x + 24, TOP + 24, x + 76, TOP + 76), fill=colour)
    d.text((x + 50, TOP + 50), str(i + 1), font=font(30, True), fill=BG, anchor="mm")
    d.text((x + 24, TOP + 118), fits(title1, font(27, True), WIDTH - 40), font=font(27, True), fill=TEXT, anchor="lm")
    d.text((x + 24, TOP + 152), fits(title2, font(27, True), WIDTH - 40), font=font(27, True), fill=TEXT, anchor="lm")
    d.text((x + 24, TOP + 204), fits(detail1, font(22), WIDTH - 40), font=font(22), fill=MUTED, anchor="lm")
    d.text((x + 24, TOP + 234), fits(detail2, font(22), WIDTH - 40), font=font(22), fill=MUTED, anchor="lm")

# What you can rely on.
Y = 640
x = 80
for text, colour in zip(FACTS, (CYAN, GREEN)):
    d.rounded_rectangle((x, Y, x + 710, Y + 76), radius=14, fill=PANEL, outline=LINE, width=2)
    d.text((x + 355, Y + 38), fits(text, font(26, True), 670), font=font(26, True), fill=colour, anchor="mm")
    x += 730

d.line((80, 762, 1520, 762), fill=LINE, width=2)
d.text((80, 790), fits(FOOT, font(26), 1440), font=font(26), fill=TEXT)
d.text((80, 836), fits(SMALL, font(22), 1440), font=font(22), fill=MUTED)

out = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).with_name(PUBLISHED)
img.save(out, optimize=True)
print(out)
