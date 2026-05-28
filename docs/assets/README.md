# ArcKit Logo Usage Guide

This guide helps AI assistants (Claude Code, OpenAI Codex CLI, Gemini CLI) select the appropriate ArcKit logo for different contexts.

## Available Logo Files

### Horizontal Logos (Wide Format)

- **`ArcKit_Logo_Horizontal_Dark.svg`** - Dark logo on light backgrounds
- **`ArcKit_Logo_Horizontal_Light.svg`** - Light logo on dark backgrounds

**Aspect Ratio:** ~3:1 (wide)

### Stacked Logos (Square Format)

- **`ArcKit_Logo_Stacked_Dark.svg`** - Dark logo on light backgrounds
- **`ArcKit_Logo_Stacked_Light.svg`** - Light logo on dark backgrounds

**Aspect Ratio:** ~1:1 (square)

### Mark/Icon (Icon Only)

- **`ArcKit_Mark_Dark.svg`** - Dark icon on light backgrounds
- **`ArcKit_Mark_Light.svg`** - Light icon on dark backgrounds

**Aspect Ratio:** 1:1 (square, compact)

### Banner Images

- **`arckit-banner-light.svg`** - Banner with tagline, light theme (580×155, native SVG)
- **`arckit-banner-dark.svg`** - Banner with tagline, dark theme (580×155, native SVG)

### Social / OG Card

- **`og-card.svg`** - 1200×630 social-preview card for `og:image`, Twitter cards, LinkedIn shares
- **`og-card.png`** - Rasterised export (1200×630, 1x and 2x available)

### Favicons

- **`favicon.svg`** - Detailed mark on rounded navy tile, scales 192px+
- **`favicon-small.svg`** - Detail-stripped variant optimised for 16/32px (browser tabs)
- PNG exports: `favicon-512.png`, `favicon-192.png`, `favicon-32.png`, `favicon-16.png`

### Brand motif

The mark is built from three semantic elements that together depict an AI harness:

1. **Angle brackets `⟨ ⟩`** — the harness frame. Reads as "AI/prompt structure". Pairs naturally with Claude Code, Codex, Gemini.
2. **Inner caret `^`** — the prompt indicator. The point at which the AI generates.
3. **Linchpin cursor** — teal terminal anchors flanking a navy centre pin. The cursor is the AI's output baseline; the pin is what holds it in place. This is the harness metaphor made literal.

Colour roles: navy `#0B1F33` for structure (brackets, caret, pin); teal `#1ED3C6` for the AI/active layer (anchor nodes, cursor line).

### PNG exports

Every SVG above has 1x and (where useful) 2x PNG companions. Regenerate them after editing any SVG:

```bash
python scripts/render-brand-pngs.py
```

Requires `cairosvg` (already in the dev env).

---

## Decision Tree for Logo Selection

### 1. Determine Layout Constraint

**Is the space WIDE (≥2:1 aspect ratio)?**
→ Use **Horizontal** logos

**Is the space SQUARE or TALL (≤1.5:1 aspect ratio)?**
→ Use **Stacked** logos

**Is the space VERY SMALL (<64px)?**
→ Use **Mark** (icon only)

### 2. Determine Background Color

**Light background (white, light gray, light colors)?**
→ Use **Dark** version

**Dark background (black, dark gray, dark colors)?**
→ Use **Light** version

**Variable or unknown background?**
→ Use **Dark** version (safer default)

---

## Use Cases and Recommendations

### Documentation (Markdown/HTML)

**README.md header:**

```markdown
![ArcKit: The Enterprise Architecture Governance Harness](docs/assets/arckit-banner-light.svg)
```

→ Use: `arckit-banner-light.svg` (version-agnostic SVG, recommended)

**Inline logo in documentation:**

```markdown
![ArcKit Logo](docs/assets/ArcKit_Logo_Horizontal_Dark.svg)
```

→ Use: `ArcKit_Logo_Horizontal_Dark.svg` (assumes light background)

### Website Headers/Footers

**Website header (light theme):**

```html
<img src="assets/ArcKit_Logo_Horizontal_Dark.svg" alt="ArcKit" height="40">
```

→ Use: `ArcKit_Logo_Horizontal_Dark.svg`

**Website footer (dark theme):**

```html
<img src="assets/ArcKit_Logo_Horizontal_Light.svg" alt="ArcKit" height="32">
```

→ Use: `ArcKit_Logo_Horizontal_Light.svg`

### Social Media

**Twitter/X profile picture (square):**
→ Use: `ArcKit_Mark_Dark.svg` or `ArcKit_Stacked_Dark.svg`

**LinkedIn banner (wide):**
→ Use: `ArcKit_Logo_Horizontal_Dark.svg` or `arckit-banner-light.svg`

**GitHub repository social preview (1280x640):**
→ Use: `arckit-banner-light.svg` (crop/resize as needed)

### Presentation Slides

**Title slide (light background):**
→ Use: `ArcKit_Logo_Stacked_Dark.svg` or `ArcKit_Logo_Horizontal_Dark.svg`

**Dark slide:**
→ Use: `ArcKit_Logo_Stacked_Light.svg` or `ArcKit_Logo_Horizontal_Light.svg`

**Footer logo (small, continuous across slides):**
→ Use: `ArcKit_Mark_Dark.svg` (light background) or `ArcKit_Mark_Light.svg` (dark background)

### Email Signatures

**Corporate email signature:**
→ Use: `ArcKit_Logo_Horizontal_Dark.svg` (40-50px height)

**Newsletter header:**
→ Use: `arckit-banner-light.svg` or `ArcKit_Logo_Horizontal_Dark.svg`

### Favicons/App Icons

**Favicon (16x16, 32x32):**
→ Use: `ArcKit_Mark_Dark.svg` (convert to ICO)

**iOS app icon (180x180):**
→ Use: `ArcKit_Mark_Dark.svg` (export to PNG with solid background)

**Android app icon (192x192):**
→ Use: `ArcKit_Mark_Dark.svg` (export to PNG with solid background)

### GitHub/GitLab

**GitHub repository avatar:**
→ Use: `ArcKit_Mark_Dark.svg` or `ArcKit_Stacked_Dark.svg`

**README.md badge/icon:**

```markdown
![ArcKit](docs/assets/ArcKit_Mark_Dark.svg)
```

→ Use: `ArcKit_Mark_Dark.svg` (small, inline)

### VS Code Extension

**Extension icon (128x128):**
→ Use: `ArcKit_Mark_Dark.svg`

**Extension banner:**
→ Use: `arckit-banner-light.svg`

### Business Cards

**Horizontal business card:**
→ Use: `ArcKit_Logo_Horizontal_Dark.svg` (left side) or `ArcKit_Logo_Horizontal_Light.svg` (dark card)

**Vertical business card:**
→ Use: `ArcKit_Logo_Stacked_Dark.svg` (top) or `ArcKit_Logo_Stacked_Light.svg` (dark card)

---

## Quick Reference Table

| Context | Layout | Background | Recommended File |
|---------|--------|------------|------------------|
| **README header** | Wide | Light | `arckit-banner-light.svg` |
| **Website nav** | Wide | Light | `ArcKit_Logo_Horizontal_Dark.svg` |
| **Website footer** | Wide | Dark | `ArcKit_Logo_Horizontal_Light.svg` |
| **Social profile** | Square | Light | `ArcKit_Stacked_Dark.svg` |
| **Favicon** | Tiny | Light | `ArcKit_Mark_Dark.svg` |
| **Presentation title** | Square | Light | `ArcKit_Logo_Stacked_Dark.svg` |
| **Presentation footer** | Tiny | Light | `ArcKit_Mark_Dark.svg` |
| **Email signature** | Wide | Light | `ArcKit_Logo_Horizontal_Dark.svg` |
| **App icon** | Square | Solid | `ArcKit_Mark_Dark.svg` |
| **Inline doc logo** | Wide | Light | `ArcKit_Logo_Horizontal_Dark.svg` |

---

## AI Assistant Instructions

When an AI assistant (Claude Code, Codex CLI, Gemini CLI) needs to:

1. **Generate documentation with a logo:**
   - Use `arckit-banner-light.svg` for main README headers (version-agnostic)
   - Use `ArcKit_Logo_Horizontal_Dark.svg` for section headers
   - Use `ArcKit_Mark_Dark.svg` for inline icons

2. **Create a website:**
   - Use `ArcKit_Logo_Horizontal_Dark.svg` in navigation (light theme)
   - Use `ArcKit_Logo_Horizontal_Light.svg` in footer (dark theme)
   - Use `ArcKit_Mark_Dark.svg` for favicon

3. **Build a presentation:**
   - Use `ArcKit_Logo_Stacked_Dark.svg` for title slides
   - Use `ArcKit_Mark_Dark.svg` for slide footers
   - Use `ArcKit_Logo_Horizontal_Dark.svg` for wide slides

4. **Design social media graphics:**
   - Use `ArcKit_Stacked_Dark.svg` for profile pictures
   - Use `arckit-banner-light.svg` for cover images
   - Use `ArcKit_Mark_Dark.svg` for small thumbnails

5. **Generate HTML/CSS:**

   ```html
   <!-- Light background -->
   <img src="docs/assets/ArcKit_Logo_Horizontal_Dark.svg" alt="ArcKit" class="logo">

   <!-- Dark background -->
   <img src="docs/assets/ArcKit_Logo_Horizontal_Light.svg" alt="ArcKit" class="logo-dark">
   ```

6. **When in doubt:**
   - Default to **Horizontal Dark** for most documentation
   - Default to **Stacked Dark** for square spaces
   - Default to **Mark Dark** for icons/favicons

---

## File Format Notes

- **All logos are SVG** = Infinitely scalable without quality loss
- **Use SVG directly** whenever possible (web, documentation)
- **Convert to PNG/ICO** only when required (favicons, email clients, old systems)

---

## Color Values

| Token | Hex | Use |
|-------|-----|-----|
| **Navy (primary)** | `#0B1F33` | Light variants: arc strokes, wordmark, stems |
| **White (primary)** | `#FFFFFF` | Dark variants: arc strokes, wordmark, stems |
| **Teal (accent)** | `#1ED3C6` | Node fills, harness triangle |
| **Tagline grey (light)** | `#5A6A78` | Tagline text on light banner |
| **Tagline grey (dark)** | `#B1B4B6` | Tagline text on dark banner |

> Heads-up: pre-v5.4 banner assets used `#1A1A1A`. All assets are now aligned on `#0B1F33` (matches the existing logo lockups).

---

## Don'ts

❌ **Don't** use horizontal logos in square spaces (they'll be too small)
❌ **Don't** use stacked logos in wide spaces (they'll look cramped)
❌ **Don't** use dark logos on dark backgrounds
❌ **Don't** use light logos on light backgrounds
❌ **Don't** stretch or distort logos (maintain aspect ratio)
❌ **Don't** add filters, effects, or modifications to logos
❌ **Don't** use logos smaller than 24px height (use Mark instead)

---

## Examples of Correct Usage

### ✅ Good: README Header

```markdown
# ArcKit: The Enterprise Architecture Governance Harness

![ArcKit: The Enterprise Architecture Governance Harness](docs/assets/arckit-banner-light.svg)
```

### ✅ Good: Website Navigation

```html
<nav style="background: white;">
  <img src="assets/ArcKit_Logo_Horizontal_Dark.svg" height="40" alt="ArcKit">
</nav>
```

### ✅ Good: Dark Mode Website

```html
<header style="background: #1a1a1a;">
  <img src="assets/ArcKit_Logo_Horizontal_Light.svg" height="40" alt="ArcKit">
</header>
```

### ✅ Good: Social Media Profile

```html
<!-- 400x400 square space -->
<img src="assets/ArcKit_Stacked_Dark.svg" alt="ArcKit Profile">
```

### ✅ Good: Favicon

```html
<link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
<link rel="icon" type="image/png" sizes="32x32" href="assets/favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="assets/favicon-16.png">
<link rel="apple-touch-icon" sizes="192x192" href="assets/favicon-192.png">
```

### ✅ Good: Social-share `og:image`

```html
<meta property="og:image" content="https://arckit.org/assets/og-card.png">
<meta name="twitter:image" content="https://arckit.org/assets/og-card.png">
```

---

**Questions?** This guide is for AI assistants. For human brand guidelines, see the main ArcKit documentation.
