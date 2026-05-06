"""Hero for 2026-05-06-anthropics-financial-services-architecture-lesson.md.

Style: ArcKit dark hero (#0d1117). Two reaction columns (panic vs. distillation),
five pattern checklist on the right, and a small repo-card chip top-right.
"""

from PIL import Image, ImageDraw, ImageFont
import os

WIDTH = 1200
HEIGHT = 630

BG = (13, 17, 23)
TEXT_PRIMARY = (230, 237, 243)
TEXT_SECONDARY = (139, 148, 158)
TEXT_TERTIARY = (88, 96, 105)

INDIGO = (99, 102, 241)
INDIGO_TEXT = (165, 180, 252)
ORANGE = (217, 119, 67)
ORANGE_TEXT = (232, 149, 106)
PURPLE = (168, 85, 247)
PURPLE_TEXT = (192, 132, 252)
GREEN = (34, 197, 94)
GREEN_TEXT = (134, 239, 172)
RED = (248, 113, 113)
RED_TEXT = (252, 165, 165)
CYAN = (56, 189, 248)
CYAN_TEXT = (125, 211, 252)
PAPER = (24, 28, 36)
PAPER_LINE = (44, 50, 60)

img = Image.new("RGBA", (WIDTH, HEIGHT), BG)
draw = ImageDraw.Draw(img)

# --- Subtle grid ---
for x in range(0, WIDTH, 28):
    draw.line([(x, 0), (x, HEIGHT)], fill=(255, 255, 255, 8), width=1)
for y in range(0, HEIGHT, 28):
    draw.line([(0, y), (WIDTH, y)], fill=(255, 255, 255, 8), width=1)


def draw_gradient_bar(y_start, y_end, alpha):
    for x in range(WIDTH):
        t = x / WIDTH
        if t < 0.25:
            r, g, b = INDIGO
        elif t < 0.5:
            f = (t - 0.25) / 0.25
            r = int(INDIGO[0] + (CYAN[0] - INDIGO[0]) * f)
            g = int(INDIGO[1] + (CYAN[1] - INDIGO[1]) * f)
            b = int(INDIGO[2] + (CYAN[2] - INDIGO[2]) * f)
        elif t < 0.75:
            f = (t - 0.5) / 0.25
            r = int(CYAN[0] + (GREEN[0] - CYAN[0]) * f)
            g = int(CYAN[1] + (GREEN[1] - CYAN[1]) * f)
            b = int(CYAN[2] + (GREEN[2] - CYAN[2]) * f)
        else:
            f = (t - 0.75) / 0.25
            r = int(GREEN[0] + (PURPLE[0] - GREEN[0]) * f)
            g = int(GREEN[1] + (PURPLE[1] - GREEN[1]) * f)
            b = int(GREEN[2] + (PURPLE[2] - GREEN[2]) * f)
        draw.line([(x, y_start), (x, y_end)], fill=(r, g, b, alpha))


draw_gradient_bar(0, 4, 200)
draw_gradient_bar(HEIGHT - 3, HEIGHT, 150)

# --- Fonts ---
font_bold_paths = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
]
font_regular_paths = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
]
font_mono_paths = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf",
]
font_mono_regular_paths = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf",
]


def load_font(paths, size):
    for p in paths:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


font_eyebrow = load_font(font_mono_paths, 22)
font_title = load_font(font_bold_paths, 64)
font_subtitle = load_font(font_regular_paths, 18)
font_badge_mono = load_font(font_mono_paths, 13)
font_card_label = load_font(font_mono_paths, 11)
font_card_value = load_font(font_mono_regular_paths, 12)
font_card_header = load_font(font_mono_paths, 13)
font_pattern = load_font(font_bold_paths, 14)
font_pattern_sub = load_font(font_regular_paths, 12)
font_repo = load_font(font_mono_paths, 13)
font_repo_sub = load_font(font_mono_regular_paths, 12)
font_footer = load_font(font_bold_paths, 13)
font_footer_sub = load_font(font_regular_paths, 12)


# --- Top right badges ---
def draw_badge(text, x, y, fill_colour, outline_colour, text_colour):
    bb = draw.textbbox((0, 0), text, font=font_badge_mono)
    bw = bb[2] - bb[0] + 22
    bh = bb[3] - bb[1] + 14
    draw.rounded_rectangle(
        [(x, y), (x + bw, y + bh)],
        radius=6,
        fill=(*fill_colour, 13),
        outline=(*outline_colour, 90),
        width=1,
    )
    draw.text((x + 11, y + 5), text, fill=text_colour, font=font_badge_mono)
    return bw


badge_text = "ArcKit"
bb = draw.textbbox((0, 0), badge_text, font=font_badge_mono)
bw = bb[2] - bb[0] + 22
bx = WIDTH - bw - 56
by = 24
draw_badge(badge_text, bx, by, INDIGO, INDIGO, INDIGO_TEXT)

essay_text = "Essay"
bb = draw.textbbox((0, 0), essay_text, font=font_badge_mono)
ubw = bb[2] - bb[0] + 22
ubx = bx - ubw - 12
draw_badge(essay_text, ubx, by, GREEN, GREEN, GREEN_TEXT)

arch_text = "Architecture"
bb = draw.textbbox((0, 0), arch_text, font=font_badge_mono)
abw = bb[2] - bb[0] + 22
abx = ubx - abw - 12
draw_badge(arch_text, abx, by, CYAN, CYAN, CYAN_TEXT)

# --- Eyebrow + Title ---
tx, ty = 56, 56
draw.text(
    (tx, ty),
    "PARTS OF FINANCIAL SERVICES ARE COOKED.",
    fill=RED_TEXT,
    font=font_eyebrow,
)

ty2 = ty + 42
draw.text((tx, ty2), "Five patterns", fill=TEXT_PRIMARY, font=font_title)
draw.text((tx, ty2 + 78), "to steal.", fill=GREEN_TEXT, font=font_title)

# Subtitle
sub_y = ty2 + 178
draw.text(
    (tx, sub_y),
    "What every plugin author should learn from",
    fill=TEXT_SECONDARY,
    font=font_subtitle,
)
draw.text(
    (tx, sub_y + 26),
    "anthropics/financial-services.",
    fill=TEXT_SECONDARY,
    font=font_subtitle,
)

# --- Repo chip (left, below subtitle) ---
chip_x = tx
chip_y = sub_y + 70
chip_w = 360
chip_h = 56
draw.rounded_rectangle(
    [(chip_x, chip_y), (chip_x + chip_w, chip_y + chip_h)],
    radius=8,
    fill=PAPER,
    outline=PAPER_LINE,
    width=1,
)
draw.text(
    (chip_x + 16, chip_y + 9),
    "github.com/anthropics/",
    fill=TEXT_TERTIARY,
    font=font_repo_sub,
)
draw.text(
    (chip_x + 16, chip_y + 28),
    "financial-services",
    fill=CYAN_TEXT,
    font=font_repo,
)
# Star count visual hint (right side of chip)
draw.text(
    (chip_x + chip_w - 80, chip_y + 9),
    "REFERENCE",
    fill=TEXT_TERTIARY,
    font=font_card_label,
)
draw.text(
    (chip_x + chip_w - 80, chip_y + 28),
    "10 agents",
    fill=TEXT_PRIMARY,
    font=font_repo_sub,
)

# --- Patterns card (right side) ---
card_x = 720
card_y = 70
card_w = 424
card_h = 460

# Card shadow
draw.rounded_rectangle(
    [(card_x + 4, card_y + 6), (card_x + card_w + 4, card_y + card_h + 6)],
    radius=10,
    fill=(0, 0, 0, 90),
)
# Card body
draw.rounded_rectangle(
    [(card_x, card_y), (card_x + card_w, card_y + card_h)],
    radius=10,
    fill=PAPER,
    outline=PAPER_LINE,
    width=1,
)

# Header bar
draw.rectangle(
    [(card_x, card_y), (card_x + card_w, card_y + 38)],
    fill=(20, 24, 32),
)
draw.line(
    [(card_x, card_y + 38), (card_x + card_w, card_y + 38)],
    fill=(*GREEN, 180),
    width=2,
)
draw.text(
    (card_x + 18, card_y + 12),
    "PATTERNS HARVESTED",
    fill=GREEN_TEXT,
    font=font_card_header,
)
issue_no = "arc-kit#442"
bb = draw.textbbox((0, 0), issue_no, font=font_card_label)
dw = bb[2] - bb[0]
draw.text(
    (card_x + card_w - dw - 18, card_y + 14),
    issue_no,
    fill=TEXT_TERTIARY,
    font=font_card_label,
)

# Pattern rows
patterns = [
    ("01", "Reader / orchestrator / writer", "isolation against prompt injection"),
    ("02", "Schema-gated handoffs", "allowlist + JSON Schema validation"),
    ("03", "Output schemas on readers", "regex, maxLength, additionalProperties:false"),
    ("04", "Cross-reference linting", "every path resolves on disk"),
    ("05", "Two ways from one source", "interactive plugin + Managed Agent cookbook"),
]

py = card_y + 60
for num, title, sub in patterns:
    # Number chip
    chip_radius = 14
    cx = card_x + 22
    cy = py + 14
    draw.ellipse(
        [(cx - chip_radius, cy - chip_radius), (cx + chip_radius, cy + chip_radius)],
        fill=(*GREEN, 30),
        outline=(*GREEN, 140),
        width=1,
    )
    bb = draw.textbbox((0, 0), num, font=font_card_label)
    nw = bb[2] - bb[0]
    nh = bb[3] - bb[1]
    draw.text((cx - nw // 2, cy - nh // 2 - 2), num, fill=GREEN_TEXT, font=font_card_label)

    # Title + subtitle
    draw.text((cx + chip_radius + 12, py + 2), title, fill=TEXT_PRIMARY, font=font_pattern)
    draw.text(
        (cx + chip_radius + 12, py + 22),
        sub,
        fill=TEXT_SECONDARY,
        font=font_pattern_sub,
    )

    py += 76

# --- Reaction strip (bottom band) ---
strip_y = HEIGHT - 95

font_icon = load_font(font_bold_paths, 22)


def draw_reaction(x, w, accent, text_colour, icon_glyph, title, body):
    draw.rounded_rectangle(
        [(x, strip_y), (x + w, strip_y + 60)],
        radius=8,
        fill=(*accent, 14),
        outline=(*accent, 80),
        width=1,
    )
    # Icon circle (left)
    icon_cx = x + 30
    icon_cy = strip_y + 30
    icon_r = 17
    draw.ellipse(
        [
            (icon_cx - icon_r, icon_cy - icon_r),
            (icon_cx + icon_r, icon_cy + icon_r),
        ],
        fill=(*accent, 50),
        outline=(*accent, 200),
        width=2,
    )
    bb = draw.textbbox((0, 0), icon_glyph, font=font_icon)
    gw = bb[2] - bb[0]
    gh = bb[3] - bb[1]
    draw.text(
        (icon_cx - gw // 2 - bb[0], icon_cy - gh // 2 - bb[1] - 1),
        icon_glyph,
        fill=text_colour,
        font=font_icon,
    )
    # Text (right of icon)
    text_x = x + 60
    draw.text((text_x, strip_y + 10), title, fill=text_colour, font=font_footer)
    draw.text(
        (text_x, strip_y + 30),
        body,
        fill=TEXT_SECONDARY,
        font=font_footer_sub,
    )


# Reaction A — panic
dev_x = 56
dev_w = 320
draw_reaction(
    dev_x,
    dev_w,
    RED,
    RED_TEXT,
    "!",
    "Reaction A",
    "Panic. The six-figure deck is now free.",
)

# Reaction B — distillation
dist_x = dev_x + dev_w + 18
dist_w = 360
draw_reaction(
    dist_x,
    dist_w,
    GREEN,
    GREEN_TEXT,
    "✓",  # ✓
    "Reaction B",
    "Read it as a reference architecture.",
)

# Source chip (right) — arckit.org
src_x = dist_x + dist_w + 18
src_w = WIDTH - src_x - 56
draw_reaction(
    src_x,
    src_w,
    INDIGO,
    INDIGO_TEXT,
    "→",  # →
    "arckit.org",
    "6 May 2026",
)

# --- Save as RGB PNG ---
final = Image.new("RGB", (WIDTH, HEIGHT), BG)
final.paste(img, mask=img.split()[3])

output_path = "/workspaces/arc-kit/docs/articles/2026-05-06-anthropics-financial-services-architecture-lesson-hero.png"
final.save(output_path, "PNG")
print(f"Hero image saved to {output_path}")
print(f"Size: {final.size[0]}x{final.size[1]}")
