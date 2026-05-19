"""Hero for 2026-05-19-leaf-node-problem.md.

Marketing-hero style matched to the wardley-maps-mermaid-github hero.
This is intentionally a *simplified* sketch of the leaf-node problem,
not a literal render of the source Wardley Map. The hero needs to land
one idea: AI trapped low under inertia, with a lever to lift it up to
the enterprise chain.

Composition:
  Row 1 - eyebrow + gradient-word headline + subtitle.
  Row 2 - single illustrative panel with two anchors (Enterprise top
          right, Team manager middle right), two simplified chains,
          a salmon "AI at the leaf" node sitting on three inertia
          chips, a green "Strategic AI guidance" target on the
          enterprise chain, and a glowing gold LIFT arrow between them.
  Row 3 - four icon-led stat tiles.
  Row 4 - single CTA line.

1200x630 (Open Graph standard). Dark background.
"""

from PIL import Image, ImageDraw, ImageFont
import os
import math

WIDTH = 1200
HEIGHT = 630

BG = (13, 17, 23)
TEXT_PRIMARY = (230, 237, 243)
TEXT_SECONDARY = (139, 148, 158)
TEXT_TERTIARY = (88, 96, 110)

INDIGO_TEXT = (165, 180, 252)
CYAN = (34, 211, 238)
CYAN_TEXT = (125, 234, 246)
GREEN = (34, 197, 94)
GREEN_TEXT = (140, 240, 178)
GOLD = (234, 179, 8)
GOLD_TEXT = (250, 215, 76)
SALMON = (251, 113, 133)
SALMON_TEXT = (253, 175, 184)
PURPLE = (168, 85, 247)

CARD_BG = (22, 27, 34, 255)

img = Image.new("RGBA", (WIDTH, HEIGHT), BG)
draw = ImageDraw.Draw(img)

# Background stays clean - no grid overlay (matches the updated Mermaid hero).


def draw_gradient_bar(y_start, y_end, alpha):
    for x in range(WIDTH):
        t = x / WIDTH
        if t < 0.33:
            f = t / 0.33
            r = int(CYAN[0] + (PURPLE[0] - CYAN[0]) * f)
            g = int(CYAN[1] + (PURPLE[1] - CYAN[1]) * f)
            b = int(CYAN[2] + (PURPLE[2] - CYAN[2]) * f)
        elif t < 0.66:
            f = (t - 0.33) / 0.33
            r = int(PURPLE[0] + (SALMON[0] - PURPLE[0]) * f)
            g = int(PURPLE[1] + (SALMON[1] - PURPLE[1]) * f)
            b = int(PURPLE[2] + (SALMON[2] - PURPLE[2]) * f)
        else:
            f = (t - 0.66) / 0.34
            r = int(SALMON[0] + (GOLD[0] - SALMON[0]) * f)
            g = int(SALMON[1] + (GOLD[1] - SALMON[1]) * f)
            b = int(SALMON[2] + (GOLD[2] - SALMON[2]) * f)
        draw.line([(x, y_start), (x, y_end)], fill=(r, g, b, alpha))


draw_gradient_bar(0, 4, 220)
draw_gradient_bar(HEIGHT - 3, HEIGHT, 170)

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


font_eyebrow = load_font(font_mono_paths, 12)
font_title = load_font(font_bold_paths, 48)
font_subtitle = load_font(font_regular_paths, 16)

font_anchor = load_font(font_bold_paths, 13)
font_anchor_sub = load_font(font_regular_paths, 10)
font_node_big = load_font(font_bold_paths, 13)
font_node_sub = load_font(font_regular_paths, 11)
font_chip = load_font(font_bold_paths, 11)
font_lift = load_font(font_bold_paths, 14)
font_axis = load_font(font_mono_paths, 10)

font_stat_big = load_font(font_bold_paths, 28)
font_stat_label = load_font(font_bold_paths, 14)
font_stat_sub = load_font(font_regular_paths, 11)
font_cta = load_font(font_regular_paths, 13)

PAD = 56

# --- Row 1: Title block ---
draw.text((PAD, 32),
          "ARCKIT  ·  GOVERNANCE PATTERN  ·  AFTER VALENTINE ET AL. 2024",
          font=font_eyebrow, fill=INDIGO_TEXT)


def draw_gradient_text(text, font, x, y, gradient_stops):
    mask = Image.new("L", (WIDTH, HEIGHT), 0)
    mdraw = ImageDraw.Draw(mask)
    mdraw.text((x, y), text, font=font, fill=255)
    bbox = font.getbbox(text)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]
    grad = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(grad)
    for i in range(text_w + 4):
        t = i / max(1, text_w)
        t = max(0.0, min(1.0, t))
        n = len(gradient_stops) - 1
        seg = min(int(t * n), n - 1)
        local = (t * n) - seg
        a = gradient_stops[seg]
        b = gradient_stops[seg + 1]
        r = int(a[0] + (b[0] - a[0]) * local)
        g = int(a[1] + (b[1] - a[1]) * local)
        bl = int(a[2] + (b[2] - a[2]) * local)
        gdraw.line([(x + i, y), (x + i, y + text_h + 12)], fill=(r, g, bl, 255))
    img.paste(grad, (0, 0), mask)


title_x = PAD
title_y = 56
draw.text((title_x, title_y), "The ", font=font_title, fill=TEXT_PRIMARY)
the_w = font_title.getbbox("The ")[2]
draw_gradient_text("Leaf Node", font_title,
                   title_x + the_w, title_y, [SALMON, GOLD])
leaf_w = font_title.getbbox("Leaf Node")[2]
draw.text((title_x + the_w + leaf_w, title_y), " Problem.",
          font=font_title, fill=TEXT_PRIMARY)

draw.text((PAD, 124),
          "Why AI pilots deployed along the org chart end up optimising the wrong thing.",
          font=font_subtitle, fill=TEXT_SECONDARY)


# --- Row 2: Illustration panel ---
PANEL_X0 = PAD
PANEL_X1 = WIDTH - PAD
PANEL_Y0 = 168
PANEL_Y1 = 432

shadow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
sdraw = ImageDraw.Draw(shadow)
sdraw.rounded_rectangle((PANEL_X0 + 4, PANEL_Y0 + 6, PANEL_X1 + 4, PANEL_Y1 + 6),
                        radius=14, fill=(0, 0, 0, 130))
img.alpha_composite(shadow)
draw.rounded_rectangle((PANEL_X0, PANEL_Y0, PANEL_X1, PANEL_Y1),
                       radius=14, fill=CARD_BG,
                       outline=(48, 54, 61, 255), width=1)

# Plot region
PL_X0 = PANEL_X0 + 70
PL_X1 = PANEL_X1 - 30
PL_Y0 = PANEL_Y0 + 30
PL_Y1 = PANEL_Y1 - 30

# Faint evolution axis baseline (dashed)
baseline_y = PL_Y1 - 10
for dx in range(PL_X0, PL_X1, 8):
    draw.line([(dx, baseline_y), (dx + 4, baseline_y)],
              fill=(255, 255, 255, 30), width=1)

# Stage labels
stage_w = (PL_X1 - PL_X0) / 4
for i, lab in enumerate(["GENESIS", "CUSTOM", "PRODUCT", "COMMODITY"]):
    lab_x = int(PL_X0 + stage_w * (i + 0.5))
    draw.text((lab_x, baseline_y + 6), lab,
              font=font_axis, fill=TEXT_TERTIARY, anchor="mt")

# Visibility axis label on the left
draw.text((PL_X0 - 56, PL_Y0 + 4), "USER",
          font=font_axis, fill=TEXT_TERTIARY)
draw.text((PL_X0 - 56, PL_Y0 + 18), "VISIBLE",
          font=font_axis, fill=TEXT_TERTIARY)
draw.text((PL_X0 - 56, baseline_y - 22), "INVISIBLE",
          font=font_axis, fill=TEXT_TERTIARY)


def at(xf, yf):
    """xf 0..1 left->right; yf 0..1 bottom->top (1 = visible)."""
    px = int(PL_X0 + xf * (PL_X1 - PL_X0))
    py = int(baseline_y - yf * (baseline_y - PL_Y0))
    return px, py


# --- Two anchors on the right ---
ent_x, ent_y = at(0.96, 0.92)
tm_x,  tm_y  = at(0.96, 0.55)

# Halo + dot
for r, a in [(15, 60), (10, 130), (7, 255)]:
    draw.ellipse((ent_x - r, ent_y - r, ent_x + r, ent_y + r), fill=CYAN + (a,))
for r, a in [(15, 60), (10, 130), (7, 255)]:
    draw.ellipse((tm_x - r, tm_y - r, tm_x + r, tm_y + r), fill=SALMON + (a,))

# Anchor labels to the LEFT of the dot so they never run off the right
draw.text((ent_x - 18, ent_y - 8), "Enterprise",
          font=font_anchor, fill=CYAN_TEXT, anchor="rt")
draw.text((ent_x - 18, ent_y + 6), "company-level outcomes",
          font=font_anchor_sub, fill=TEXT_TERTIARY, anchor="rt")
draw.text((tm_x - 18, tm_y - 8), "Team manager",
          font=font_anchor, fill=SALMON_TEXT, anchor="rt")
draw.text((tm_x - 18, tm_y + 6), "local KPIs",
          font=font_anchor_sub, fill=TEXT_TERTIARY, anchor="rt")


# --- Two key value-chain nodes (one per chain) ---
strat_x, strat_y = at(0.42, 0.74)   # Strategic AI guidance (lift target)
leaf_x,  leaf_y  = at(0.42, 0.36)   # AI deployed at the leaf (trap)


def draw_chain(stops, colour, width=2):
    for a in range(len(stops) - 1):
        x0, y0 = stops[a]
        x1, y1 = stops[a + 1]
        draw.line([(x0, y0), (x1, y1)], fill=colour + (200,), width=width)


# Enterprise chain (cyan): anchor -> bend -> strategic guidance
ent_bend = at(0.72, 0.82)
draw_chain([(ent_x, ent_y), ent_bend, (strat_x, strat_y)], CYAN, width=2)

# Team chain (salmon): anchor -> bend -> leaf AI
tm_bend = at(0.72, 0.50)
draw_chain([(tm_x, tm_y), tm_bend, (leaf_x, leaf_y)], SALMON, width=2)

# Continuation of chains toward genesis side (faded)
draw_chain([(strat_x, strat_y), at(0.20, 0.80), at(0.05, 0.85)],
           CYAN, width=1)
draw_chain([(leaf_x, leaf_y), at(0.20, 0.30), at(0.05, 0.20)],
           SALMON, width=1)


# --- Strategic AI guidance: green target ---
for r, a in [(18, 50), (13, 110), (10, 200)]:
    draw.ellipse((strat_x - r, strat_y - r, strat_x + r, strat_y + r),
                 fill=GREEN + (a,))
draw.ellipse((strat_x - 10, strat_y - 10, strat_x + 10, strat_y + 10),
             fill=BG, outline=GREEN + (255,), width=3)
draw.ellipse((strat_x - 4, strat_y - 4, strat_x + 4, strat_y + 4),
             fill=GREEN + (255,))
draw.text((strat_x + 18, strat_y - 9), "Strategic AI guidance",
          font=font_node_big, fill=GREEN_TEXT)
draw.text((strat_x + 18, strat_y + 7), "lifted to cross-functional context",
          font=font_node_sub, fill=TEXT_TERTIARY)

# --- AI deployed at the leaf: salmon ring with warning halo ---
for r, a in [(18, 60), (13, 130), (10, 220)]:
    draw.ellipse((leaf_x - r, leaf_y - r, leaf_x + r, leaf_y + r),
                 fill=SALMON + (a,))
draw.ellipse((leaf_x - 10, leaf_y - 10, leaf_x + 10, leaf_y + 10),
             fill=BG, outline=SALMON + (255,), width=3)
draw.ellipse((leaf_x - 4, leaf_y - 4, leaf_x + 4, leaf_y + 4),
             fill=SALMON + (255,))
draw.text((leaf_x + 18, leaf_y - 9), "AI deployed at the leaf",
          font=font_node_big, fill=SALMON_TEXT)
draw.text((leaf_x + 18, leaf_y + 7), "trapped serving local KPIs",
          font=font_node_sub, fill=TEXT_TERTIARY)


# --- LIFT arrow from leaf up to strategic guidance ---
# Place it offset to the LEFT of both nodes so the labels stay readable.
arrow_x = leaf_x - 50
arrow_top = strat_y
arrow_bot = leaf_y

# Glow shaft (vertical)
for w, a in [(10, 50), (7, 110), (4, 220)]:
    for dy in range(arrow_top, arrow_bot, 6):
        draw.line([(arrow_x, dy), (arrow_x, dy + 3)],
                  fill=GOLD + (a,), width=w)

# Arrow head pointing up
head_len = 14
head_w = 8
tip = (arrow_x, arrow_top - 2)
left = (arrow_x - head_w, arrow_top - 2 + head_len)
right = (arrow_x + head_w, arrow_top - 2 + head_len)
draw.polygon([tip, left, right], fill=GOLD + (255,))

# LIFT label pill, sitting to the LEFT of the arrow
pill_cx = arrow_x - 40
pill_cy = (arrow_top + arrow_bot) // 2
PILL_W, PILL_H = 60, 26
draw.rounded_rectangle((pill_cx - PILL_W // 2, pill_cy - PILL_H // 2,
                        pill_cx + PILL_W // 2, pill_cy + PILL_H // 2),
                       radius=8, fill=BG, outline=GOLD + (255,), width=2)
draw.text((pill_cx, pill_cy), "LIFT",
          font=font_lift, fill=GOLD, anchor="mm")


# --- Three inertia chips sitting under the trap ---
chips = ["Team KPIs", "Org chart structure", "Siloed data schemas"]
chip_y = leaf_y + 50
chip_gap = 16
# Centre cluster horizontally around the leaf node x
chip_widths = [font_chip.getbbox(c)[2] + 36 for c in chips]
chip_total = sum(chip_widths) + chip_gap * (len(chips) - 1)
chip_x = leaf_x - chip_total // 2 + 30  # bias slightly right to clear LIFT arrow

# A faint "INERTIA LAYER" caption above the chips
draw.text((chip_x, chip_y - 22), "INERTIA  ·  PULLS AI DEPLOYMENTS DOWN",
          font=load_font(font_mono_paths, 9), fill=TEXT_TERTIARY)

cur_x = chip_x
for i, label in enumerate(chips):
    w = chip_widths[i]
    draw.rounded_rectangle((cur_x, chip_y - 12, cur_x + w, chip_y + 12),
                           radius=12, fill=BG, outline=SALMON + (255,), width=2)
    # Small inertia glyph (downward arrow)
    glyph_cx = cur_x + 14
    glyph_cy = chip_y
    draw.line([(glyph_cx, glyph_cy - 5), (glyph_cx, glyph_cy + 4)],
              fill=SALMON + (255,), width=2)
    draw.polygon([(glyph_cx, glyph_cy + 6),
                  (glyph_cx - 4, glyph_cy + 1),
                  (glyph_cx + 4, glyph_cy + 1)],
                 fill=SALMON + (255,))
    draw.text((cur_x + 26, chip_y), label,
              font=font_chip, fill=SALMON_TEXT, anchor="lm")
    cur_x += w + chip_gap


# --- Row 3: Four icon-led stat tiles ---
STAT_Y0 = 452
STAT_Y1 = 552
TILE_GAP = 16
TILE_W = (WIDTH - PAD * 2 - TILE_GAP * 3) // 4

stats = [
    ("3",   "Inertia points",     "KPIs · Org chart · Schemas",        SALMON, SALMON_TEXT, "warn"),
    ("2",   "Anchors in tension", "Enterprise vs. team manager",       CYAN,   CYAN_TEXT,   "anchor"),
    ("1",   "Question",           "Where does the chain terminate?",   GOLD,   GOLD_TEXT,   "question"),
    ("Map", "as code",            "diff · review · version",           GREEN,  GREEN_TEXT,  "doc"),
]


def draw_icon(kind, cx, cy, colour):
    r = 18
    draw.ellipse((cx - r, cy - r, cx + r, cy + r),
                 fill=BG, outline=colour + (255,), width=2)
    if kind == "warn":
        draw.polygon([(cx, cy - 9), (cx - 8, cy + 7), (cx + 8, cy + 7)],
                     outline=colour + (255,), fill=None, width=2)
        draw.line([(cx, cy - 3), (cx, cy + 2)], fill=colour + (255,), width=2)
        draw.ellipse((cx - 1, cy + 4, cx + 1, cy + 6), fill=colour + (255,))
    elif kind == "anchor":
        draw.ellipse((cx - 3, cy - 10, cx + 3, cy - 4),
                     outline=colour + (255,), width=2)
        draw.line([(cx, cy - 4), (cx, cy + 7)], fill=colour + (255,), width=2)
        draw.arc((cx - 8, cy + 1, cx + 8, cy + 11), 0, 180,
                 fill=colour + (255,), width=2)
        draw.line([(cx - 6, cy - 1), (cx + 6, cy - 1)],
                  fill=colour + (255,), width=2)
    elif kind == "question":
        draw.arc((cx - 6, cy - 9, cx + 6, cy + 3), 180, 360,
                 fill=colour + (255,), width=2)
        draw.line([(cx, cy + 0), (cx, cy + 4)],
                  fill=colour + (255,), width=2)
        draw.ellipse((cx - 1, cy + 6, cx + 1, cy + 8),
                     fill=colour + (255,))
    elif kind == "doc":
        draw.rectangle((cx - 7, cy - 9, cx + 7, cy + 9),
                       outline=colour + (255,), width=2)
        draw.line([(cx + 3, cy - 9), (cx + 7, cy - 5)],
                  fill=colour + (255,), width=2)
        for ly in [-4, 0, 4]:
            draw.line([(cx - 4, cy + ly), (cx + 4, cy + ly)],
                      fill=colour + (200,), width=1)


for idx, (big, label, sub, accent, text_col, icon_kind) in enumerate(stats):
    tx0 = PAD + idx * (TILE_W + TILE_GAP)
    tx1 = tx0 + TILE_W
    draw.rounded_rectangle((tx0, STAT_Y0, tx1, STAT_Y1),
                           radius=12, fill=CARD_BG,
                           outline=(48, 54, 61, 255), width=1)
    icon_cx = tx0 + 36
    icon_cy = (STAT_Y0 + STAT_Y1) // 2
    draw_icon(icon_kind, icon_cx, icon_cy, accent)
    big_x = tx0 + 72
    draw.text((big_x, STAT_Y0 + 18), big,
              font=font_stat_big, fill=text_col)
    big_w = font_stat_big.getbbox(big)[2]
    draw.text((big_x + big_w + 10, STAT_Y0 + 30), label,
              font=font_stat_label, fill=TEXT_PRIMARY, anchor="lm")
    draw.text((big_x, STAT_Y1 - 22), sub,
              font=font_stat_sub, fill=TEXT_SECONDARY)


# --- Row 4: CTA line ---
cta_y = HEIGHT - 38
cta_left = "/arckit:wardley"
cta_mid = "  ·  after Valentine et al. 2024 via Gonzalez, Organizing Intelligence  ·  "
cta_right = "arckit.org"

left_w = font_cta.getbbox(cta_left)[2]
mid_w = font_cta.getbbox(cta_mid)[2]
right_w = font_cta.getbbox(cta_right)[2]
total = left_w + mid_w + right_w
start_x = (WIDTH - total) // 2
draw.text((start_x, cta_y), cta_left, font=font_cta, fill=GOLD_TEXT)
draw.text((start_x + left_w, cta_y), cta_mid, font=font_cta, fill=TEXT_TERTIARY)
draw.text((start_x + left_w + mid_w, cta_y), cta_right,
          font=font_cta, fill=INDIGO_TEXT)

# --- Save ---
out_path = os.path.join(os.path.dirname(__file__) or ".",
                       "2026-05-19-leaf-node-problem-hero.png")
img.convert("RGB").save(out_path, "PNG", optimize=True)
print(f"Wrote {out_path}")
