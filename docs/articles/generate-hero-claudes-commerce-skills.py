"""Generate the hero image for "What We Learnt from Claude's Commerce Skills, and What We Left on the Shelf".

A shopping agent on the left, the governance harness on the right, and six
lesson tiles carried across between them. Same house style as the sibling
generate-hero-*.py scripts; font lookup also covers macOS.

    uv run --with pillow python docs/articles/generate-hero-claudes-commerce-skills.py
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

W, H = 1600, 900
BG = (13, 17, 23)
PANEL = (22, 27, 34)
PANEL_2 = (17, 24, 32)
LINE = (48, 54, 61)
TEXT = (230, 237, 243)
MUTED = (139, 148, 158)
DIM = (88, 96, 110)
GOLD = (234, 179, 8)
CYAN = (34, 211, 238)
VIOLET = (139, 92, 246)
GREEN = (52, 211, 153)

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)


def font(size, bold=False, mono=False):
    candidates = []
    if mono:
        candidates += [
            "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf",
            "/System/Library/Fonts/Menlo.ttc",
        ]
    else:
        candidates += [
            "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
            "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
            "/System/Library/Fonts/Helvetica.ttc",
        ]
    for path in candidates:
        try:
            if path.endswith(".ttc"):
                return ImageFont.truetype(path, size, index=1 if bold else 0)
            return ImageFont.truetype(path, size)
        except OSError:
            continue
    return ImageFont.load_default()


def rrect(box, radius=18, fill=None, outline=None, width=1):
    d.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def arrow(x1, y, x2, color):
    d.line((x1, y, x2, y), fill=color, width=3)
    d.polygon([(x2, y), (x2 - 14, y - 8), (x2 - 14, y + 8)], fill=color)


# Subtle grid
for x in range(0, W, 40):
    d.line((x, 0, x, H), fill=(18, 24, 31), width=1)
for y in range(0, H, 40):
    d.line((0, y, W, y), fill=(18, 24, 31), width=1)

# Accent bars
for x in range(W):
    t = x / W
    if t < 0.40:
        col = GOLD
    elif t < 0.70:
        f = (t - 0.40) / 0.30
        col = tuple(int(GOLD[i] + (CYAN[i] - GOLD[i]) * f) for i in range(3))
    else:
        f = (t - 0.70) / 0.30
        col = tuple(int(CYAN[i] + (VIOLET[i] - CYAN[i]) * f) for i in range(3))
    d.line((x, 0, x, 6), fill=col)
    d.line((x, H - 5, x, H), fill=tuple(max(0, c - 35) for c in col))

# Header
d.text((76, 66), "ARCKIT · READING ANTHROPIC'S COMMERCE-AGENTS REFERENCE", font=font(26, True, True), fill=CYAN)
d.text((76, 106), "What we learnt from Claude's commerce skills,", font=font(52, True), fill=TEXT)
d.text((76, 166), "and what we left on the shelf", font=font(52, True), fill=TEXT)
d.text((76, 240), "Six ideas that transferred to an architecture governance tool, and the ones that did not.", font=font(23), fill=MUTED)

# Left: the shopping agent
lx, ly = 76, 318
rrect((lx, ly, lx + 380, ly + 420), 22, fill=PANEL, outline=GOLD, width=3)
d.text((lx + 28, ly + 26), "COMMERCE AGENTS", font=font(19, True, True), fill=GOLD)
d.text((lx + 28, ly + 58), "shopping + merchant", font=font(22, True), fill=TEXT)
for i, (label, keep) in enumerate([
    ("one page: guaranteed, asked, yours", True),
    ("clean untrusted text before use", True),
    ("test the output, twin every refusal", True),
    ("a skill says when it is not needed", True),
    ("ask everything once", True),
    ("a rule lives where it applies", True),
    ("shopping cart rules", False),
    ("changes held for approval", False),
    ("product cards in chat", False),
]):
    y = ly + 100 + i * 34
    color = GOLD if keep else DIM
    d.ellipse((lx + 30, y + 8, lx + 40, y + 18), fill=color)
    d.text((lx + 52, y + 3), label, font=font(16), fill=TEXT if keep else DIM)

# Right: the harness
rx, ry = 1144, 318
rrect((rx, ry, rx + 380, ry + 420), 22, fill=PANEL, outline=VIOLET, width=3)
d.text((rx + 28, ry + 26), "ARCKIT", font=font(19, True, True), fill=(196, 181, 253))
d.text((rx + 28, ry + 58), "what it means for you", font=font(22, True), fill=TEXT)
for i, label in enumerate([
    "see which rules are guaranteed",
    "poisoned pages cannot reach your doc",
    "commands tested on what they write",
    "skills stay out of the way",
    "one round of questions, defaults noted",
    "less boilerplate, clearer rules",
]):
    y = ry + 100 + i * 46
    rrect((rx + 26, y, rx + 354, y + 36), 9, fill=PANEL_2, outline=LINE)
    d.text((rx + 42, y + 9), label, font=font(16, True), fill=TEXT)

# Middle: six numbered lessons carried across
mx = 500
for i, (num, label) in enumerate([
    ("1", "say what is guaranteed, asked, and yours"),
    ("2", "clean the text, not just its shape"),
    ("3", "judge the result; twin every refusal"),
    ("4", "a skill names its job, and its limits"),
    ("5", "ask once; note the defaults"),
    ("6", "put a rule where it applies most"),
]):
    y = ly + 8 + i * 68
    rrect((mx, y, mx + 600, y + 52), 12, fill=(18, 22, 28), outline=CYAN, width=2)
    d.ellipse((mx + 14, y + 12, mx + 42, y + 40), fill=CYAN)
    d.text((mx + 22, y + 15), num, font=font(17, True), fill=BG)
    d.text((mx + 58, y + 15), label, font=font(18, True), fill=TEXT)
    arrow(lx + 380 + 6, y + 26, mx - 8, GOLD)
    arrow(mx + 600 + 8, y + 26, rx - 8, VIOLET)

# Footer
d.text((76, H - 52), "Four of the six became automatic checks. Two of those found a real fault the first time they ran.", font=font(17, False, True), fill=DIM)

out = Path(__file__).with_name("2026-09-03-what-we-learnt-from-claudes-commerce-skills-hero.png")
img.save(out, optimize=True)
print(f"wrote {out}")
