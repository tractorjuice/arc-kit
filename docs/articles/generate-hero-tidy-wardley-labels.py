"""Hero for 2026-05-22-tidy-wardley-labels.md.

Concept: the same Wardley Map twice. On the left, BEFORE: every label is
drawn at Mermaid's default offset, so the clustered components collide
into an unreadable pile. On the right, AFTER: the placement engine has
scored each label into a clean, non-overlapping slot. A wardley-tidy
pill sits in the gap, the transform between the two states — carrying a
compass-ring glyph that shows the candidate-slot scoring in miniature.

1200x630 (Open Graph standard). Dark background.
"""

from PIL import Image, ImageDraw, ImageFont
import os

WIDTH = 1200
HEIGHT = 630

BG = (13, 17, 23)
TEXT_PRIMARY = (230, 237, 243)
TEXT_SECONDARY = (139, 148, 158)
TEXT_TERTIARY = (88, 96, 110)

INDIGO = (99, 102, 241)
INDIGO_TEXT = (165, 180, 252)
CYAN = (34, 211, 238)
GREEN = (34, 197, 94)
GOLD = (234, 179, 8)
SALMON = (251, 113, 133)
PURPLE = (168, 85, 247)

CARD_BG = (22, 27, 34, 255)
CARD_CHROME = (32, 38, 46, 255)

img = Image.new("RGBA", (WIDTH, HEIGHT), BG)
draw = ImageDraw.Draw(img)

# --- Soft vignette: lift the centre, darken the corners ---
glow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
gdraw = ImageDraw.Draw(glow)
gdraw.ellipse((WIDTH * 0.18, -HEIGHT * 0.45, WIDTH * 0.82, HEIGHT * 0.95),
              fill=(99, 102, 241, 22))
img.alpha_composite(glow)


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
            r = int(GREEN[0] + (GOLD[0] - GREEN[0]) * f)
            g = int(GREEN[1] + (GOLD[1] - GREEN[1]) * f)
            b = int(GREEN[2] + (GOLD[2] - GREEN[2]) * f)
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
font_title = load_font(font_bold_paths, 38)
font_subtitle = load_font(font_regular_paths, 16)
font_card_eyebrow = load_font(font_mono_paths, 11)
font_card_meta = load_font(font_mono_paths, 10)
font_node = load_font(font_bold_paths, 10)
font_axis = load_font(font_mono_paths, 10)
font_footer_stat = load_font(font_bold_paths, 15)
font_footer_meta = load_font(font_mono_paths, 10)

PAD = 56

# --- Row 1: Title block ---
draw.text((PAD, 32), "ARCKIT  ·  WARDLEY MAPPING  ·  MAY 2026",
          font=font_eyebrow, fill=INDIGO_TEXT)
draw.text((PAD, 56), "Untangling the map.",
          font=font_title, fill=TEXT_PRIMARY)
draw.text((PAD, 102),
          "A deterministic engine scores every label slot, so no two collide.",
          font=font_subtitle, fill=TEXT_SECONDARY)


# --- Card scaffolding ---
def draw_card(x0, y0, x1, y1, accent, eyebrow):
    shadow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(shadow)
    sdraw.rounded_rectangle((x0 + 4, y0 + 6, x1 + 4, y1 + 6),
                            radius=14, fill=(0, 0, 0, 130))
    img.alpha_composite(shadow)

    draw.rounded_rectangle((x0, y0, x1, y1),
                           radius=14, fill=CARD_BG, outline=accent + (255,), width=2)

    chrome_h = 30
    draw.rounded_rectangle((x0, y0, x1, y0 + chrome_h),
                           radius=14, fill=CARD_CHROME)
    draw.rectangle((x0, y0 + 14, x1, y0 + chrome_h), fill=CARD_CHROME)
    for i, col in enumerate([(255, 95, 86), (255, 189, 46), (39, 201, 63)]):
        cx = x0 + 14 + i * 14
        cy = y0 + 15
        draw.ellipse((cx - 4, cy - 4, cx + 4, cy + 4), fill=col)
    draw.text((x1 - 16, y0 + 15), "wardley-beta",
              font=font_card_meta, fill=TEXT_TERTIARY, anchor="rm")
    draw.text((x0 + 18, y0 + chrome_h + 10),
              eyebrow, font=font_card_eyebrow, fill=accent)


# Shared map: a proper value chain. User-facing components sit high
# (visible), commodity infrastructure sits low; evolution runs left
# (genesis) to right (commodity), so Compute lands bottom-right. The
# three mid-chain services cluster tightly, so their default labels
# pile into an unreadable heap.
# (x evolution 0..1, y visibility 0..1 bottom-up, label, sourcing, after-dir)
COMPONENTS = [
    (0.72, 0.93, "Citizen portal",   None,    "E"),
    (0.50, 0.70, "Booking service",  "build", "W"),
    (0.58, 0.64, "Notifications",    "buy",   "NE"),
    (0.54, 0.60, "Case store",       "build", "S"),
    (0.80, 0.42, "Identity",         "buy",   "SW"),
    (0.40, 0.26, "Foundation model", None,    "NW"),
    (0.92, 0.09, "Compute",          "buy",   "NW"),
]
EDGES = [(0, 1), (1, 2), (1, 3), (3, 4), (2, 4), (4, 5), (5, 6)]

SOURCING_COLOUR = {"build": GREEN, "buy": GOLD}
DIRS = {
    "E": (1, 0), "NE": (0.71, -0.71), "N": (0, -1), "NW": (-0.71, -0.71),
    "W": (-1, 0), "SW": (-0.71, 0.71), "S": (0, 1), "SE": (0.71, 0.71),
}


def draw_wardley_map(x0, y0, x1, y1, accent, tidy):
    """Draw the shared map. tidy=False piles labels at the default offset;
    tidy=True spreads each label into its scored slot."""
    plot_x0 = x0 + 56
    plot_y0 = y0 + 16
    plot_x1 = x1 - 18
    plot_y1 = y1 - 34

    draw.line([(plot_x0, plot_y0), (plot_x0, plot_y1)], fill=TEXT_TERTIARY, width=1)
    draw.line([(plot_x0, plot_y1), (plot_x1, plot_y1)], fill=TEXT_TERTIARY, width=1)

    stage_w = (plot_x1 - plot_x0) / 4
    for i in range(1, 4):
        gx = int(plot_x0 + stage_w * i)
        for dy in range(plot_y0, plot_y1, 6):
            draw.line([(gx, dy), (gx, dy + 3)], fill=(255, 255, 255, 25), width=1)
    for i, lab in enumerate(["GENESIS", "CUSTOM", "PRODUCT", "COMMODITY"]):
        lab_x = int(plot_x0 + stage_w * (i + 0.5))
        draw.text((lab_x, plot_y1 + 6), lab,
                  font=font_axis, fill=TEXT_TERTIARY, anchor="mt")
    draw.text((plot_x0 - 46, plot_y0), "VISIBLE", font=font_axis, fill=TEXT_TERTIARY)
    draw.text((plot_x0 - 46, plot_y1 - 10), "INVIS.", font=font_axis, fill=TEXT_TERTIARY)

    px = [int(plot_x0 + c[0] * (plot_x1 - plot_x0)) for c in COMPONENTS]
    py = [int(plot_y1 - c[1] * (plot_y1 - plot_y0)) for c in COMPONENTS]

    for a, b in EDGES:
        draw.line([(px[a], py[a]), (px[b], py[b])],
                  fill=(139, 148, 158, 170), width=1)

    # Labels first when tidy (so node markers sit on top); for the pile,
    # draw labels last so the overlap is visibly messy.
    def draw_nodes():
        for i, (xf, yf, label, sourcing, after) in enumerate(COMPONENTS):
            cx, cy = px[i], py[i]
            ring = accent if sourcing is None else SOURCING_COLOUR.get(sourcing, accent)
            draw.ellipse((cx - 5, cy - 5, cx + 5, cy + 5),
                         fill=(13, 17, 23, 255), outline=ring + (255,), width=2)

    def draw_labels():
        for i, (xf, yf, label, sourcing, after) in enumerate(COMPONENTS):
            cx, cy = px[i], py[i]
            if tidy:
                dx, dy = DIRS[after]
                dist = 20
                lx = cx + int(dx * dist) + (5 if dx >= 0 else -5)
                ly = cy + int(dy * dist)
                anchor = "lm" if dx >= 0 else "rm"
                # Faint leader line from node to a long-offset label.
                draw.line([(cx, cy), (cx + int(dx * dist), cy + int(dy * dist))],
                          fill=(139, 148, 158, 90), width=1)
                draw.text((lx, ly), label, font=font_node,
                          fill=TEXT_PRIMARY, anchor=anchor)
            else:
                # Mermaid default: every label up-and-right by the same offset.
                lx = cx + 8
                ly = cy - 9
                draw.text((lx, ly), label, font=font_node,
                          fill=(230, 237, 243, 205), anchor="lm")

    # Labels first, node markers always on top: the components sit in the
    # exact same seven places on both cards. Only the labels move.
    draw_labels()
    draw_nodes()


CARD_TOP = 158
CARD_BOTTOM = HEIGHT - 92
CARD_GAP = 30
CARD_W = (WIDTH - PAD * 2 - CARD_GAP) // 2

LEFT_X0 = PAD
LEFT_X1 = LEFT_X0 + CARD_W
draw_card(LEFT_X0, CARD_TOP, LEFT_X1, CARD_BOTTOM,
          accent=SALMON, eyebrow="BEFORE  ·  DEFAULT LABEL OFFSETS")
draw_wardley_map(LEFT_X0, CARD_TOP + 46, LEFT_X1, CARD_BOTTOM,
                 accent=SALMON, tidy=False)

RIGHT_X0 = LEFT_X1 + CARD_GAP
RIGHT_X1 = RIGHT_X0 + CARD_W
draw_card(RIGHT_X0, CARD_TOP, RIGHT_X1, CARD_BOTTOM,
          accent=GREEN, eyebrow="AFTER  ·  SCORED PLACEMENT")
draw_wardley_map(RIGHT_X0, CARD_TOP + 46, RIGHT_X1, CARD_BOTTOM,
                 accent=GREEN, tidy=True)

# --- Connecting pill between the cards: candidate-ring glyph + wordmark ---
# The pill is the transform between the two states. On its left, a compass
# ring glyph shows the mechanism in miniature — a node, two faint rings,
# eight spokes, a candidate dot at every intersection, one scored 'chosen'
# slot in green. On its right, the wardley-tidy wordmark.
LINK_CX = WIDTH // 2
LINK_CY = (CARD_TOP + CARD_BOTTOM) // 2
PILL_W, PILL_H = 188, 74
px0 = LINK_CX - PILL_W // 2
py0 = LINK_CY - PILL_H // 2
px1 = LINK_CX + PILL_W // 2
py1 = LINK_CY + PILL_H // 2

pill_shadow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
psdraw = ImageDraw.Draw(pill_shadow)
psdraw.rounded_rectangle((px0 + 3, py0 + 5, px1 + 3, py1 + 5),
                         radius=12, fill=(0, 0, 0, 120))
img.alpha_composite(pill_shadow)

draw.rounded_rectangle((px0, py0, px1, py1),
                       radius=12, fill=CARD_BG, outline=CYAN + (255,), width=2)

# Candidate-ring glyph: faint rings + spokes drawn on an alpha layer so
# they read as a delicate scaffold rather than hard lines.
GLYPH_CX = px0 + 41
GLYPH_CY = LINK_CY
RING_R = (11, 23)
CHOSEN_DIR = DIRS["NE"]

ring_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
rdraw = ImageDraw.Draw(ring_layer)
for r in RING_R:
    rdraw.ellipse((GLYPH_CX - r, GLYPH_CY - r, GLYPH_CX + r, GLYPH_CY + r),
                  outline=(139, 148, 158, 95), width=1)
for dx, dy in DIRS.values():
    rdraw.line([(GLYPH_CX, GLYPH_CY),
                (GLYPH_CX + dx * RING_R[1], GLYPH_CY + dy * RING_R[1])],
               fill=(139, 148, 158, 70), width=1)
img.alpha_composite(ring_layer)

# A candidate dot at every spoke/ring intersection; the scored winner is
# the NE outer slot, drawn larger in green with a faint selection halo.
for dx, dy in DIRS.values():
    for r in RING_R:
        dotx = GLYPH_CX + dx * r
        doty = GLYPH_CY + dy * r
        if (dx, dy) == CHOSEN_DIR and r == RING_R[1]:
            halo = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
            ImageDraw.Draw(halo).ellipse(
                (dotx - 5, doty - 5, dotx + 5, doty + 5),
                outline=GREEN + (170,), width=1)
            img.alpha_composite(halo)
            draw.ellipse((dotx - 3.2, doty - 3.2, dotx + 3.2, doty + 3.2),
                         fill=GREEN + (255,))
        else:
            draw.ellipse((dotx - 2, doty - 2, dotx + 2, doty + 2),
                         fill=(120, 128, 140, 255))

# Node marker sits on top of the scaffold.
draw.ellipse((GLYPH_CX - 4, GLYPH_CY - 4, GLYPH_CX + 4, GLYPH_CY + 4),
             fill=BG, outline=CYAN + (255,), width=2)

# Wordmark to the right of the glyph.
TEXT_X = px0 + 80
draw.text((TEXT_X, LINK_CY - 11), "wardley-tidy",
          font=font_card_eyebrow, fill=CYAN, anchor="lm")
draw.text((TEXT_X, LINK_CY + 9), "place + score",
          font=font_card_meta, fill=TEXT_SECONDARY, anchor="lm")

# Small arrowheads either side of the pill.
for sx in (px0 - 14, px1 + 6):
    draw.polygon([(sx, LINK_CY - 5), (sx, LINK_CY + 5), (sx + 8, LINK_CY)],
                 fill=CYAN)

# --- Footer stat strip ---
FOOTER_Y = HEIGHT - 58
draw.text((PAD, FOOTER_Y),
          "32 candidate slots per label  ·  most-constrained-first  ·  weighted collision scoring  ·  idempotent by design",
          font=font_footer_stat, fill=TEXT_PRIMARY)
draw.text((PAD, FOOTER_Y + 22),
          "/arckit:wardley  ·  labels auto-tidied by a PostToolUse hook on every write  ·  arckit.org",
          font=font_footer_meta, fill=TEXT_TERTIARY)

# --- Save ---
out_path = os.path.join(os.path.dirname(__file__) or ".",
                        "2026-05-22-tidy-wardley-labels-hero.png")
img.convert("RGB").save(out_path, "PNG", optimize=True)
print(f"Wrote {out_path}")
