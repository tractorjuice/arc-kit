"""Hero for 2026-04-30-uae-overlay-launch.md.

Style: ArcKit dark hero (#0d1117), gradient bars top/bottom, 4x3 grid of
twelve command cards colour-coded by category. The four Cabinet
instruments are visually emphasised with a brighter outline.

Visually distinct from the three previous UAE articles that shipped this
week: those used phase cards, decree-pull-quote panels, and a working-day
bar chart respectively. This one is a command-grid layout.
"""

from PIL import Image, ImageDraw, ImageFont
import os

WIDTH = 1200
HEIGHT = 630

BG = (13, 17, 23)
TEXT_PRIMARY = (230, 237, 243)
TEXT_SECONDARY = (139, 148, 158)
TEXT_TERTIARY = (72, 79, 88)

INDIGO = (99, 102, 241)
INDIGO_TEXT = (165, 180, 252)
ORANGE = (217, 119, 67)
ORANGE_TEXT = (232, 149, 106)
PURPLE = (168, 85, 247)
PURPLE_TEXT = (192, 132, 252)
GREEN = (34, 197, 94)
GREEN_TEXT = (134, 239, 172)
GOLD = (234, 179, 8)
GOLD_TEXT = (250, 204, 21)
SALMON = (248, 113, 113)
SALMON_TEXT = (252, 165, 165)

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
            r = int(INDIGO[0] + (ORANGE[0] - INDIGO[0]) * f)
            g = int(INDIGO[1] + (ORANGE[1] - INDIGO[1]) * f)
            b = int(INDIGO[2] + (ORANGE[2] - INDIGO[2]) * f)
        elif t < 0.75:
            f = (t - 0.5) / 0.25
            r = int(ORANGE[0] + (PURPLE[0] - ORANGE[0]) * f)
            g = int(ORANGE[1] + (PURPLE[1] - ORANGE[1]) * f)
            b = int(ORANGE[2] + (PURPLE[2] - ORANGE[2]) * f)
        else:
            f = (t - 0.75) / 0.25
            r = int(PURPLE[0] + (GREEN[0] - PURPLE[0]) * f)
            g = int(PURPLE[1] + (GREEN[1] - PURPLE[1]) * f)
            b = int(PURPLE[2] + (GREEN[2] - PURPLE[2]) * f)
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


def load_font(paths, size):
    for p in paths:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


font_eyebrow = load_font(font_mono_paths, 13)
font_title = load_font(font_bold_paths, 40)
font_subtitle = load_font(font_regular_paths, 17)
font_badge_mono = load_font(font_mono_paths, 12)
font_card_label = load_font(font_mono_paths, 10)
font_card_value = load_font(font_bold_paths, 14)
font_legend = load_font(font_mono_paths, 10)
font_stat_value = load_font(font_bold_paths, 22)
font_stat_label = load_font(font_regular_paths, 10)
font_callout = load_font(font_bold_paths, 13)
font_callout_detail = load_font(font_regular_paths, 11)


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


badge_text = "ArcKit v4.10.0"
bb = draw.textbbox((0, 0), badge_text, font=font_badge_mono)
bw = bb[2] - bb[0] + 22
bx = WIDTH - bw - 56
by = 24
draw_badge(badge_text, bx, by, INDIGO, INDIGO, INDIGO_TEXT)

baseline_text = "Official Baseline"
bb = draw.textbbox((0, 0), baseline_text, font=font_badge_mono)
ubw = bb[2] - bb[0] + 22
ubx = bx - ubw - 12
draw_badge(baseline_text, ubx, by, GREEN, GREEN, GREEN_TEXT)

# --- Eyebrow + Title ---
tx, ty = 56, 56
draw.text((tx, ty), "UAE FEDERAL OVERLAY", fill=INDIGO_TEXT, font=font_eyebrow)

ty2 = ty + 28
draw.text((tx, ty2), "12 Commands.", fill=TEXT_PRIMARY, font=font_title)
draw.text((tx, ty2 + 50), "One Federal Stack.", fill=GREEN_TEXT, font=font_title)

# Subtitle
sub_y = ty2 + 116
draw.text(
    (tx, sub_y),
    "Classification, PDPL, IAS, sovereign cloud, UAE Pass,",
    fill=TEXT_SECONDARY,
    font=font_subtitle,
)
draw.text(
    (tx, sub_y + 22),
    "Cabinet instruments, AI Charter, federal procurement.",
    fill=TEXT_SECONDARY,
    font=font_subtitle,
)


# --- 12 command cards in a 4x3 grid ---
CATEGORY_DATA_SECURITY = "DATA + SECURITY"
CATEGORY_IDENTITY = "IDENTITY"
CATEGORY_CABINET = "CABINET"
CATEGORY_AI = "AI GOVERNANCE"
CATEGORY_PROCUREMENT = "PROCUREMENT"

# 4 columns x 3 rows = 12 cards
# Row 0: classification, pdpl, ias, cloud-residency  (data + security, ORANGE)
# Row 1: uaepass, zero-bureaucracy*, digital-records*, data-sharing*  (identity + 3 cabinet, BLUE / PURPLE)
# Row 2: priorities-alignment*, ai-charter, ai-autonomy-tier, procurement (cabinet + AI + procurement)
# * = Cabinet instrument, gets brighter outline

CARDS = [
    # Row 0 - Data + Security (orange)
    ("uae-classification", "Smart Data Register", ORANGE, ORANGE_TEXT, False, "DATA"),
    ("uae-pdpl", "Federal Decree-Law 45/2021", ORANGE, ORANGE_TEXT, False, "DATA"),
    ("uae-ias", "188 controls (M+T)", ORANGE, ORANGE_TEXT, False, "SECURITY"),
    ("uae-cloud-residency", "Cloud Security Policy v2", ORANGE, ORANGE_TEXT, False, "SECURITY"),
    # Row 1 - Identity + first 3 Cabinet
    ("uae-uaepass", "OIDC + e-signature", INDIGO, INDIGO_TEXT, False, "IDENTITY"),
    ("uae-zero-bureaucracy", "Code for Govt Services", PURPLE, PURPLE_TEXT, True, "CABINET"),
    ("uae-digital-records", "Records-as-truth", PURPLE, PURPLE_TEXT, True, "CABINET"),
    ("uae-data-sharing", "Collect once", PURPLE, PURPLE_TEXT, True, "CABINET"),
    # Row 2 - Priorities (Cabinet) + AI + Procurement
    ("uae-priorities-alignment", "We the UAE 2031", PURPLE, PURPLE_TEXT, True, "CABINET"),
    ("uae-ai-charter", "12 AI Principles", GOLD, GOLD_TEXT, False, "AI"),
    ("uae-ai-autonomy-tier", "Tier 1 / 2 / 3", GOLD, GOLD_TEXT, False, "AI"),
    ("uae-procurement", "Decree-Law 11/2023", SALMON, SALMON_TEXT, False, "PROCUREMENT"),
]

grid_x = 56
grid_y = 285
card_w = 268
card_h = 64
card_gap_x = 14
card_gap_y = 12

for i, (name, sub, accent, accent_text, is_cabinet, _badge) in enumerate(CARDS):
    col = i % 4
    row = i // 4
    x = grid_x + col * (card_w + card_gap_x)
    y = grid_y + row * (card_h + card_gap_y)
    outline_alpha = 200 if is_cabinet else 90
    fill_alpha = 22 if is_cabinet else 12
    draw.rounded_rectangle(
        [(x, y), (x + card_w, y + card_h)],
        radius=10,
        fill=(*accent, fill_alpha),
        outline=(*accent, outline_alpha),
        width=2 if is_cabinet else 1,
    )
    draw.text((x + 14, y + 10), name, fill=TEXT_PRIMARY, font=font_card_value)
    draw.text((x + 14, y + 34), sub, fill=accent_text, font=font_card_label)

    if is_cabinet:
        # Small "CABINET" tag in top-right of the card
        tag_text = "CABINET"
        bb = draw.textbbox((0, 0), tag_text, font=font_legend)
        tw = bb[2] - bb[0] + 10
        th = bb[3] - bb[1] + 6
        tx_tag = x + card_w - tw - 8
        ty_tag = y + 8
        draw.rounded_rectangle(
            [(tx_tag, ty_tag), (tx_tag + tw, ty_tag + th)],
            radius=4,
            fill=(*accent, 60),
            outline=(*accent, 200),
            width=1,
        )
        draw.text((tx_tag + 5, ty_tag + 1), tag_text, fill=TEXT_PRIMARY, font=font_legend)


# --- Legend strip just under the title block, above the grid ---
legend_y = 262
legend_items = [
    ("Data + Security", ORANGE),
    ("Identity", INDIGO),
    ("Cabinet (4)", PURPLE),
    ("AI Governance", GOLD),
    ("Procurement", SALMON),
]

lx = grid_x
sw = 10
for label, colour in legend_items:
    draw.rectangle(
        [(lx, legend_y + 4), (lx + sw, legend_y + 4 + sw)],
        fill=(*colour, 130),
        outline=(*colour, 200),
        width=1,
    )
    bb = draw.textbbox((0, 0), label, font=font_legend)
    tw = bb[2] - bb[0]
    draw.text((lx + sw + 6, legend_y + 2), label, fill=TEXT_SECONDARY, font=font_legend)
    lx += sw + 6 + tw + 22


# --- Stats bar at bottom ---
stats_y = 525
stat_items = [
    ("12", "COMMANDS"),
    ("80", "OFFICIAL BASELINE"),
    ("4", "CABINET INSTRUMENTS"),
    ("23 APR 2026", "DECREE"),
]

stats_x_start = 56
stat_spacing = 170

for i, (value, label) in enumerate(stat_items):
    sx = stats_x_start + i * stat_spacing + stat_spacing // 2

    if i > 0:
        sep_x = stats_x_start + i * stat_spacing
        draw.line([(sep_x, stats_y), (sep_x, stats_y + 44)], fill=(255, 255, 255, 20), width=1)

    vbb = draw.textbbox((0, 0), value, font=font_stat_value)
    vw = vbb[2] - vbb[0]
    draw.text((sx - vw // 2, stats_y), value, fill=TEXT_PRIMARY, font=font_stat_value)

    lbb = draw.textbbox((0, 0), label, font=font_stat_label)
    lw = lbb[2] - lbb[0]
    draw.text((sx - lw // 2, stats_y + 30), label, fill=TEXT_TERTIARY, font=font_stat_label)


# --- Bottom-right callout ---
src_w = 240
src_h = 48
src_x = WIDTH - src_w - 56
src_y = stats_y + 2
draw.rounded_rectangle(
    [(src_x, src_y), (src_x + src_w, src_y + src_h)],
    radius=8,
    fill=(*GREEN, 10),
    outline=(*GREEN, 64),
    width=1,
)
draw.text((src_x + 18, src_y + 8), "Federal stack, ratified", fill=GREEN_TEXT, font=font_callout)
draw.text(
    (src_x + 18, src_y + 28),
    "Reference repo: v20-uae-moi-ipad",
    fill=TEXT_SECONDARY,
    font=font_callout_detail,
)


# --- Save as RGB PNG ---
final = Image.new("RGB", (WIDTH, HEIGHT), BG)
final.paste(img, mask=img.split()[3])

output_path = "/workspaces/arc-kit/docs/articles/2026-04-30-uae-overlay-launch-hero.png"
final.save(output_path, "PNG")
print(f"Hero image saved to {output_path}")
print(f"Size: {final.size[0]}x{final.size[1]}")
