"""Generate the hero image for the ArcKit v6.25.0 release article.

Written for the person using Google Antigravity: what the one plugin brings,
broken down as the article breaks it down (75 core commands, 74 for other
countries, 16 for sectors, 19 for methods, 6 for AI agents) and the four
research MCP servers that come with it. Same house style
as the sibling generate-hero-*.py scripts.

    uv run --with pillow python docs/articles/generate-hero-v6-25-google-antigravity-plugin.py [output.png]

With no argument it writes the published hero's file name, so pass a path to
start a new design without overwriting a hero the maintainer has restyled.

The flags are drawn here as simple shapes, not loaded from image files, so the
script needs nothing but Pillow. They are small pointers to a country, not
accurate renderings.
"""

import math
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

# --- wording
VERSION = "ArcKit v6.25.0"
HEADLINE = ("ArcKit for Google Antigravity:", "190 commands as Agent Skills.")
CORE = ("75", "core commands", "From project plan", "to published docs")
COUNTRIES_TITLE = "74 for other countries"
COUNTRIES = (("uae", "UAE", 12), ("fr", "France", 12), ("ca", "Canada", 12), ("au", "Australia", 10),
             ("us", "USA", 10), ("eu", "EU", 8), ("nl", "Netherlands", 6), ("at", "Austria", 4))
GROUPS = (
    ("16", "for sectors", ("UK food safety, finance, NHS,", "legacy IT. Australian energy")),
    ("19", "for methods", ("TOGAF ADM, arc42,", "Open Agile Architecture")),
    ("6", "for AI agents", ("Inventory, design, security,", "governance and more")),
)
MCP_TITLE = "MCP servers, no key needed"
MCP_LIST = "AWS Knowledge · Microsoft Learn · UK government code · UK tenders"
FOOT = "agy plugin install https://github.com/tractorjuice/arckit-antigravity"
SMALL = "Experimental: eight core commands have been run in Antigravity so far."
PUBLISHED = "2026-11-22-arckit-v6-25-google-antigravity-plugin-agent-skills-hero.png"
assert 75 + sum(n for _, _, n in COUNTRIES) + sum(int(g[0]) for g in GROUPS) == 190

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


def star(cx, cy, r, fill, points=5):
    pts = []
    for k in range(points * 2):
        radius = r if k % 2 == 0 else r * 0.42
        angle = -math.pi / 2 + k * math.pi / points
        pts.append((cx + radius * math.cos(angle), cy + radius * math.sin(angle)))
    d.polygon(pts, fill=fill)


FW, FH = 66, 44
RED, WHITE, BLUE, NAVY = (206, 17, 38), (255, 255, 255), (0, 85, 164), (0, 33, 105)


def flag(code, x, y):
    """A small flag at x, y. Simple shapes only."""
    if code == "fr":
        for i, c in enumerate((BLUE, WHITE, (239, 65, 53))):
            d.rectangle((x + i * FW // 3, y, x + (i + 1) * FW // 3, y + FH), fill=c)
    elif code == "nl":
        for i, c in enumerate(((174, 28, 40), WHITE, (33, 70, 139))):
            d.rectangle((x, y + i * FH // 3, x + FW, y + (i + 1) * FH // 3 + (1 if i == 2 else 0)), fill=c)
    elif code == "at":
        for i, c in enumerate(((237, 41, 57), WHITE, (237, 41, 57))):
            d.rectangle((x, y + i * FH // 3, x + FW, y + (i + 1) * FH // 3 + (1 if i == 2 else 0)), fill=c)
    elif code == "uae":
        for i, c in enumerate(((0, 115, 47), WHITE, (0, 0, 0))):
            d.rectangle((x, y + i * FH // 3, x + FW, y + (i + 1) * FH // 3 + (1 if i == 2 else 0)), fill=c)
        d.rectangle((x, y, x + FW // 4, y + FH), fill=(255, 0, 0))
    elif code == "ca":
        d.rectangle((x, y, x + FW, y + FH), fill=WHITE)
        d.rectangle((x, y, x + FW // 4, y + FH), fill=(255, 0, 0))
        d.rectangle((x + FW - FW // 4, y, x + FW, y + FH), fill=(255, 0, 0))
        star(x + FW // 2, y + FH // 2, 12, (255, 0, 0), points=6)  # stands in for the maple leaf
    elif code == "us":
        for i in range(7):
            d.rectangle((x, y + i * FH / 7, x + FW, y + (i + 1) * FH / 7), fill=(178, 34, 52) if i % 2 == 0 else WHITE)
        d.rectangle((x, y, x + FW * 0.44, y + FH * 4 / 7), fill=(60, 59, 110))
        for row in range(3):
            for col in range(4):
                d.ellipse((x + 4 + col * 7, y + 4 + row * 7, x + 6 + col * 7, y + 6 + row * 7), fill=WHITE)
    elif code == "eu":
        d.rectangle((x, y, x + FW, y + FH), fill=(0, 51, 153))
        for k in range(12):
            angle = k * math.pi / 6
            star(x + FW / 2 + 14 * math.cos(angle), y + FH / 2 + 14 * math.sin(angle), 3, (255, 204, 0))
    elif code == "au":
        d.rectangle((x, y, x + FW, y + FH), fill=NAVY)
        # the Union Flag in the corner, as a white and red cross
        d.rectangle((x, y + 9, x + 30, y + 13), fill=WHITE)
        d.rectangle((x + 13, y, x + 17, y + 22), fill=WHITE)
        d.rectangle((x, y + 10, x + 30, y + 12), fill=RED)
        d.rectangle((x + 14, y, x + 16, y + 22), fill=RED)
        star(x + 15, y + 33, 6, WHITE, points=7)
        for sx, sy in ((48, 9), (56, 20), (48, 34), (41, 22)):
            star(x + sx, y + sy, 3, WHITE, points=7)
    d.rectangle((x, y, x + FW, y + FH), outline=LINE, width=1)


# Sizes: nothing below 28px, so the smallest line is still readable when the
# image is shown at phone width.
d.text((80, 40), VERSION, font=font(30, True), fill=GOLD)
d.text((80, 80), fits(HEADLINE[0], font(60, True), 1440), font=font(60, True), fill=TEXT)
d.text((80, 148), fits(HEADLINE[1], font(60, True), 1440), font=font(60, True), fill=TEXT)

# Row one: the core, then the countries.
TOP, ROW1 = 236, 240
d.rounded_rectangle((80, TOP, 400, TOP + ROW1), radius=16, fill=PANEL, outline=CYAN, width=3)
d.text((108, TOP + 12), CORE[0], font=font(96, True), fill=CYAN)
d.text((108, TOP + 120), fits(CORE[1], font(34, True), 270), font=font(34, True), fill=TEXT)
d.text((108, TOP + 166), fits(CORE[2], font(28), 270), font=font(28), fill=TEXT)
d.text((108, TOP + 198), fits(CORE[3], font(28), 270), font=font(28), fill=TEXT)

d.rounded_rectangle((420, TOP, 1520, TOP + ROW1), radius=16, fill=PANEL, outline=GOLD, width=3)
d.text((448, TOP + 16), fits(COUNTRIES_TITLE, font(34, True), 1040), font=font(34, True), fill=TEXT)
CELL = 268
for i, (code, name, count) in enumerate(COUNTRIES):
    cx = 448 + (i % 4) * CELL
    cy = TOP + 78 + (i // 4) * 80
    flag(code, cx, cy + 6)
    d.text((cx + FW + 12, cy + 12), fits(name, font(30, True), CELL - FW - 18), font=font(30, True), fill=TEXT, anchor="lm")
    d.text((cx + FW + 12, cy + 46), str(count), font=font(28, True), fill=GOLD, anchor="lm")

# Row two: sectors, methods, AI agents.
TOP2, ROW2 = 494, 170
WIDTH, GAP = 466, 21
for i, (number, label, lines) in enumerate(GROUPS):
    x = 80 + i * (WIDTH + GAP)
    d.rounded_rectangle((x, TOP2, x + WIDTH, TOP2 + ROW2), radius=16, fill=PANEL, outline=GREEN, width=3)
    d.text((x + 26, TOP2 + 8), number, font=font(60, True), fill=GREEN)
    offset = d.textlength(number, font=font(60, True))
    d.text((x + 40 + offset, TOP2 + 46), fits(label, font(32, True), WIDTH - 80 - offset), font=font(32, True), fill=TEXT, anchor="lm")
    for k, line in enumerate(lines):
        d.text((x + 26, TOP2 + 104 + k * 34), fits(line, font(28), WIDTH - 48), font=font(28), fill=TEXT, anchor="lm")

# The MCP servers that come with the plugin.
d.rounded_rectangle((80, 682, 1520, 746), radius=14, fill=PANEL, outline=LINE, width=2)
d.text((106, 714), MCP_TITLE, font=font(28, True), fill=CYAN, anchor="lm")
taken = d.textlength(MCP_TITLE, font=font(28, True)) + 28
d.text((106 + taken, 714), fits(MCP_LIST, font(28), 1388 - taken), font=font(28), fill=TEXT, anchor="lm")

d.line((80, 764, 1520, 764), fill=LINE, width=2)
d.text((80, 778), fits(FOOT, font(30, True), 1440), font=font(30, True), fill=TEXT)
d.text((80, 826), fits(SMALL, font(28), 1440), font=font(28), fill=MUTED)

out = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).with_name(PUBLISHED)
img.save(out, optimize=True)
print(out)
