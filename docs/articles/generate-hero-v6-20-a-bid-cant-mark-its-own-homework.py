"""Generate the hero image for the ArcKit v6.20.0 release article.

Written for the person evaluating tenders: the steps ArcKit takes them
through, then what they can rely on. Same house style as the sibling
generate-hero-*.py scripts.

    uv run --with pillow python docs/articles/generate-hero-v6-20-a-bid-cant-mark-its-own-homework.py [output.png]

With no argument it writes the published hero's file name, so pass a path to
start a new design without overwriting a hero the maintainer has restyled.

The published hero is a redesigned version of this layout, supplied by the
maintainer on 19 November 2026, with three lines added beside the headline:
"Read the bid with AI", "Score only the claims" and "Keep the bid separate".
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

# --- wording
VERSION = "ArcKit v6.20.0"
HEADLINE = ("Keep a bid's hidden instructions", "out of the score.")
SUB = "Tender evaluation with AI: the bid stays away from the part of ArcKit that scores it"
STEPS = (
    ("Export each", "bid to PDF", "One folder for", "each supplier"),
    ("An AI reader", "opens one bid", "Read-only, one", "supplier at a time"),
    ("Short claims", "come back", "Each with its file", "and location"),
    ("ArcKit scores", "the claims", "The bid stays with", "the AI reader"),
    ("Your panel", "decides", "The scores are", "a draft"),
)
FACTS = ("Planted text is reported, with where it is", "Every score traces to its source")
FOOT = "Also new: arc42 from your existing artefacts, and NORA and GEMMA for Dutch government."
SMALL = "The separate AI reader needs Claude Code. The other assistants still read bids in one place."
PUBLISHED = "2026-11-07-arckit-v6-20-a-bid-cant-mark-its-own-homework-hero.png"
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
