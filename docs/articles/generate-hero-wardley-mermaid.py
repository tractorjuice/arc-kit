"""Hero for 2026-05-19-wardley-maps-mermaid-github.md.

Concept: side-by-side rendering of the same Wardley Map source, on the
left inside a GitHub-style markdown card, on the right inside a Claude
artifacts side panel card. The shared idea is that one piece of source
code now renders identically in two places that engineers and strategists
already work in.

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

# --- Subtle grid background ---
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
font_node = load_font(font_bold_paths, 11)
font_axis = load_font(font_mono_paths, 10)
font_footer_stat = load_font(font_bold_paths, 15)
font_footer_meta = load_font(font_mono_paths, 10)

PAD = 56

# --- Row 1: Title block ---
draw.text((PAD, 32), "ARCKIT  ·  WARDLEY MAPPING  ·  MAY 2026",
          font=font_eyebrow, fill=INDIGO_TEXT)
draw.text((PAD, 56), "Wardley Maps in Markdown.",
          font=font_title, fill=TEXT_PRIMARY)
draw.text((PAD, 102), "One source. Rendered natively in GitHub and Claude.",
          font=font_subtitle, fill=TEXT_SECONDARY)


# --- Card scaffolding (browser-style chrome + content area) ---
def draw_card(x0, y0, x1, y1, accent, eyebrow, url_label):
    # Drop shadow
    shadow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(shadow)
    sdraw.rounded_rectangle((x0 + 4, y0 + 6, x1 + 4, y1 + 6),
                            radius=14, fill=(0, 0, 0, 130))
    img.alpha_composite(shadow)

    # Card body
    draw.rounded_rectangle((x0, y0, x1, y1),
                           radius=14, fill=CARD_BG, outline=accent + (255,), width=2)

    # Browser chrome strip
    chrome_h = 30
    draw.rounded_rectangle((x0, y0, x1, y0 + chrome_h),
                           radius=14, fill=CARD_CHROME)
    draw.rectangle((x0, y0 + 14, x1, y0 + chrome_h), fill=CARD_CHROME)

    # Traffic lights
    for i, col in enumerate([(255, 95, 86), (255, 189, 46), (39, 201, 63)]):
        cx = x0 + 14 + i * 14
        cy = y0 + 15
        draw.ellipse((cx - 4, cy - 4, cx + 4, cy + 4), fill=col)

    # URL bar (visible centre strip)
    bar_x0 = x0 + 70
    bar_x1 = x1 - 16
    bar_y0 = y0 + 8
    bar_y1 = y0 + 22
    draw.rounded_rectangle((bar_x0, bar_y0, bar_x1, bar_y1),
                           radius=4, fill=(13, 17, 23, 255))
    draw.text((bar_x0 + 8, (bar_y0 + bar_y1) // 2),
              url_label, font=font_card_meta, fill=TEXT_TERTIARY, anchor="lm")

    # Eyebrow inside card
    draw.text((x0 + 18, y0 + chrome_h + 10),
              eyebrow, font=font_card_eyebrow, fill=accent)


def draw_wardley_map(x0, y0, x1, y1, accent):
    """Draw a simplified Wardley Map silhouette inside the given rect."""
    # Inner plot area (leave room for axes labels)
    plot_x0 = x0 + 60
    plot_y0 = y0 + 18
    plot_x1 = x1 - 20
    plot_y1 = y1 - 38

    # Y axis (Value Chain): top = Visible, bottom = Invisible
    draw.line([(plot_x0, plot_y0), (plot_x0, plot_y1)], fill=TEXT_TERTIARY, width=1)
    # X axis (Evolution): left = Genesis, right = Commodity
    draw.line([(plot_x0, plot_y1), (plot_x1, plot_y1)], fill=TEXT_TERTIARY, width=1)

    # Evolution dashed vertical guides (4 stages)
    stage_w = (plot_x1 - plot_x0) / 4
    for i in range(1, 4):
        gx = int(plot_x0 + stage_w * i)
        # dashed
        for dy in range(plot_y0, plot_y1, 6):
            draw.line([(gx, dy), (gx, dy + 3)], fill=(255, 255, 255, 25), width=1)

    # Axis labels (spread one per evolution stage)
    stage_labels = ["GENESIS", "CUSTOM", "PRODUCT", "COMMODITY"]
    for i, lab in enumerate(stage_labels):
        lab_x = int(plot_x0 + stage_w * (i + 0.5))
        draw.text((lab_x, plot_y1 + 6),
                  lab, font=font_axis, fill=TEXT_TERTIARY, anchor="mt")
    # Y label, rotated approximation: top "USER" bottom "INVISIBLE"
    draw.text((plot_x0 - 50, plot_y0),
              "VISIBLE", font=font_axis, fill=TEXT_TERTIARY)
    draw.text((plot_x0 - 50, plot_y1 - 10),
              "INVIS.", font=font_axis, fill=TEXT_TERTIARY)

    # Components (x_frac, y_frac, label, sourcing)
    # x evolution 0=genesis 1=commodity
    # y visibility 0=invisible (bottom) 1=visible (top)
    components = [
        (0.92, 0.92, "User",       None),
        (0.55, 0.72, "Service",    "build"),
        (0.78, 0.55, "API",        "buy"),
        (0.40, 0.38, "Model",      "build"),
        (0.88, 0.30, "Compute",    "buy"),
        (0.20, 0.20, "Research",   None),
    ]
    # Edges (by index into components above)
    edges = [
        (0, 1), (1, 2), (1, 3), (3, 4), (2, 4), (3, 5),
    ]

    px = [int(plot_x0 + c[0] * (plot_x1 - plot_x0)) for c in components]
    py = [int(plot_y1 - c[1] * (plot_y1 - plot_y0)) for c in components]

    # Draw edges first
    for a, b in edges:
        draw.line([(px[a], py[a]), (px[b], py[b])],
                  fill=(139, 148, 158, 180), width=1)

    # Draw nodes
    SOURCING_COLOUR = {
        "build": GREEN,
        "buy":   GOLD,
    }
    for i, (xf, yf, label, sourcing) in enumerate(components):
        cx, cy = px[i], py[i]
        ring = accent if sourcing is None else SOURCING_COLOUR.get(sourcing, accent)
        draw.ellipse((cx - 6, cy - 6, cx + 6, cy + 6),
                     fill=(13, 17, 23, 255), outline=ring + (255,), width=2)
        draw.text((cx + 10, cy - 6), label,
                  font=font_node, fill=TEXT_PRIMARY)


CARD_TOP = 158
CARD_BOTTOM = HEIGHT - 90
CARD_GAP = 28
CARD_W = (WIDTH - PAD * 2 - CARD_GAP) // 2

# Left card: GitHub
LEFT_X0 = PAD
LEFT_X1 = LEFT_X0 + CARD_W
draw_card(LEFT_X0, CARD_TOP, LEFT_X1, CARD_BOTTOM,
          accent=INDIGO,
          eyebrow="GITHUB  ·  README.md",
          url_label="github.com/org/platform/blob/main/STRATEGY.md")
draw_wardley_map(LEFT_X0, CARD_TOP + 50, LEFT_X1, CARD_BOTTOM, accent=INDIGO)

# Right card: Claude artifacts
RIGHT_X0 = LEFT_X1 + CARD_GAP
RIGHT_X1 = RIGHT_X0 + CARD_W
draw_card(RIGHT_X0, CARD_TOP, RIGHT_X1, CARD_BOTTOM,
          accent=PURPLE,
          eyebrow="CLAUDE  ·  ARTIFACTS PANEL",
          url_label="claude.ai/chat  ·  wardley-beta")
draw_wardley_map(RIGHT_X0, CARD_TOP + 50, RIGHT_X1, CARD_BOTTOM, accent=PURPLE)

# --- Connecting label between cards: shared source ---
# Sits in the gap between the two cards, lower than the title block
# so it never collides with the subtitle.
LINK_CX = WIDTH // 2
LINK_CY = (CARD_TOP + CARD_BOTTOM) // 2
PILL_W, PILL_H = 130, 56
draw.rounded_rectangle((LINK_CX - PILL_W // 2, LINK_CY - PILL_H // 2,
                        LINK_CX + PILL_W // 2, LINK_CY + PILL_H // 2),
                       radius=10, fill=CARD_BG, outline=CYAN + (255,), width=2)
draw.text((LINK_CX, LINK_CY - 10), "```mermaid",
          font=font_card_meta, fill=CYAN, anchor="mm")
draw.text((LINK_CX, LINK_CY + 10), "wardley-beta",
          font=font_card_eyebrow, fill=TEXT_PRIMARY, anchor="mm")

# --- Footer stat strip ---
FOOTER_Y = HEIGHT - 56
draw.text((PAD, FOOTER_Y),
          "Mermaid 11.15.0  ·  98% render success across 147 real maps  ·  100% on ArcKit-generated syntax",
          font=font_footer_stat, fill=TEXT_PRIMARY)
draw.text((PAD, FOOTER_Y + 22),
          "/arckit:wardley  ·  diff, review and version maps the same way you do code  ·  arckit.org",
          font=font_footer_meta, fill=TEXT_TERTIARY)

# --- Save ---
out_path = os.path.join(os.path.dirname(__file__) or ".",
                       "2026-05-19-wardley-maps-mermaid-github-hero.png")
img.convert("RGB").save(out_path, "PNG", optimize=True)
print(f"Wrote {out_path}")
