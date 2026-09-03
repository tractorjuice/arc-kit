"""Generate the hero image for the ArcKit v6.14.0 release article.

Three tiers — enforced, asked, yours — and the eval suite that measures the
second. Same house style as the sibling generate-hero-*.py scripts; font
lookup also covers macOS so the image renders on a Mac.

    uv run --with pillow python docs/articles/generate-hero-v6-14-enforce-ask-measure.py
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
RED = (248, 113, 113)

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


# Subtle grid
for x in range(0, W, 40):
    d.line((x, 0, x, H), fill=(18, 24, 31), width=1)
for y in range(0, H, 40):
    d.line((0, y, W, y), fill=(18, 24, 31), width=1)

# Accent bars: gold -> cyan -> violet
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
d.text((76, 66), "ARCKIT v6.14.0 RELEASE", font=font(28, True, True), fill=CYAN)
d.text((76, 108), "Enforce. Ask. Measure.", font=font(64, True), fill=TEXT)
d.text(
    (76, 184),
    "One page says which rules hold in code, which are asked of the model, and which are yours. Evals now score the second.",
    font=font(24),
    fill=MUTED,
)

# Three tier columns
cols = [
    ("TIER 1 · ENFORCED IN CODE", GOLD, [
        "filename convention + doc-type registry",
        "protected files, secrets in prompts + files",
        "reader payload sanitiser + schema",
        "reader / writer tool allowlists",
        "provenance stamp, stale-artefact scan",
    ]),
    ("TIER 2 · ASKED OF THE MODEL", CYAN, [
        "Document Control complete",
        "classification from the regime",
        "status DRAFT, sign-off is human",
        "no placeholder survives the write",
        "every figure carries a citation",
    ]),
    ("TIER 3 · YOURS", VIOLET, [
        "review and approval",
        "classification handling",
        "permissions and egress",
        "model, effort, retention",
        "the non-Claude runtimes",
    ]),
]
x0, top, colw, gap = 76, 262, 470, 22
for i, (title, color, rows) in enumerate(cols):
    x = x0 + i * (colw + gap)
    rrect((x, top, x + colw, top + 330), 22, fill=PANEL, outline=color, width=3)
    d.text((x + 26, top + 24), title, font=font(19, True, True), fill=color)
    y = top + 66
    for row in rows:
        rrect((x + 24, y, x + colw - 24, y + 42), 10, fill=PANEL_2, outline=LINE)
        d.ellipse((x + 40, y + 15, x + 52, y + 27), fill=color)
        d.text((x + 64, y + 11), row, font=font(17), fill=TEXT)
        y += 50

# Eval strip across the bottom
ey = 626
rrect((76, ey, 1524, ey + 200), 22, fill=(18, 22, 28), outline=GREEN, width=3)
d.text((104, ey + 22), "EVALS · plugins/arckit-claude/evals/", font=font(20, True, True), fill=GREEN)
d.text((104, ey + 54), "Run a command against a fixture repo. Grade the artefact it wrote, the tools it called, the text it returned.", font=font(19), fill=MUTED)
cases = [
    ("principles-governed-artefact", "1.0"),
    ("stakeholders-injected-external-doc", "1.0"),
    ("stakeholders-benign-external-doc", "1.0"),
    ("search-is-read-only", "1.0"),
]
cx = 104
for name, score in cases:
    w = 340
    rrect((cx, ey + 98, cx + w, ey + 170), 12, fill=PANEL, outline=LINE)
    d.text((cx + 18, ey + 110), name, font=font(15, True, True), fill=TEXT)
    d.text((cx + 18, ey + 138), f"score {score}", font=font(16, True), fill=GREEN)
    d.rectangle((cx + 120, ey + 143, cx + w - 18, ey + 151), fill=(30, 39, 51))
    d.rectangle((cx + 120, ey + 143, cx + w - 18, ey + 151), fill=GREEN)
    cx += w + 16

# Footer
d.text((76, H - 52), "ArcKit · The Enterprise Architecture Governance Harness · github.com/tractorjuice/arc-kit", font=font(17, False, True), fill=DIM)

out = Path(__file__).with_name("2026-09-03-arckit-v6-14-enforce-ask-measure-hero.png")
img.save(out, optimize=True)
print(f"wrote {out}")
