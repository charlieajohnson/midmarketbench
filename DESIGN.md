---
name: MidMarketBench
description: An institutional benchmark framed by calibrated fields of red, orange and yellow.
colors:
  ink: "#14130F"
  ink-soft: "#4C4840"
  canvas: "#F4F2EC"
  surface: "#FCFAF4"
  rule: "#C8C4BB"
  signal-red: "#E52F45"
  signal-coral: "#EB5D4B"
  signal-orange: "#F89A15"
  signal-yellow: "#F2C105"
  signal-deep: "#8F1833"
typography:
  display:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "clamp(3.8rem, 8vw, 6rem)"
    fontWeight: 400
    lineHeight: 0.94
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "clamp(2.35rem, 5vw, 4.4rem)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Geist, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Geist, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Geist, Arial, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.06em"
  data:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: "normal"
rounded:
  control: "2px"
  surface: "4px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  section: "96px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.control}"
    padding: "12px 18px"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.signal-deep}"
    textColor: "{colors.surface}"
    rounded: "{rounded.control}"
    padding: "12px 18px"
    typography: "{typography.label}"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.surface}"
    padding: "24px"
---

# Design System: MidMarketBench

## Overview

**Creative North Star: "The Calibration Hall"**

MidMarketBench combines the order of an institutional research room with saturated geometric fields that behave like calibration plates. Red, coral, orange and yellow carry identity and energy. Neutral ledger surfaces carry evidence. The contrast is deliberate: expression at the frame, restraint at the point of judgement.

The system rejects the previous Humanist Compute Atelier treatment, generic AI SaaS gloss, beige luxury-editorial styling, dark cyber-terminal aesthetics and rainbow gradients. It also rejects italics in headlines or descriptive copy. Authority comes from alignment, evidence density and proportion rather than decoration.

**Key Characteristics:**

- Saturated warm-spectrum geometric plates with visible grain.
- Flat, fine-rule information surfaces and compact institutional controls.
- Newsreader Roman for major statements, Geist for the working interface.
- Monospaced numerals only where provenance or comparison benefits.
- One dominant composition per viewport and no ornamental effect stacking.

## Colors

The palette moves through one controlled warm spectrum against mineral neutrals and a near-black ink.

### Primary

- **Signal Red** (#E52F45): the main chromatic signature, used for large fields, active indicators and selected emphasis.
- **Signal Yellow** (#F2C105): a high-visibility structural surface for hero panels, provenance notices and calibrated highlights. It always carries ink text.

### Secondary

- **Signal Coral** (#EB5D4B): the bridge between red and orange inside artwork and occasional section fields.
- **Signal Orange** (#F89A15): the luminous transition colour inside geometric plates, never a standalone text colour.
- **Signal Deep** (#8F1833): the only dark chromatic surface and the hover state for primary actions.

### Neutral

- **Ink** (#14130F): primary text, table headers, navigation and strongest rules.
- **Ink Soft** (#4C4840): long-form supporting copy.
- **Canvas** (#F4F2EC): page ground.
- **Surface** (#FCFAF4): tables, cards and reading panels.
- **Rule** (#C8C4BB): low-emphasis dividers and boundaries.

**The Controlled Spectrum Rule.** Every coloured field must stay within red, coral, orange and yellow. No blue, green, purple or rainbow extension is permitted in the identity layer.

## Typography

**Display Font:** Newsreader Roman (with Georgia fallback)

**Body Font:** Geist (with Arial fallback)
**Label/Mono Font:** Geist Mono

**Character:** Newsreader provides a measured institutional voice with a gentle literary edge. Geist keeps navigation, tables and explanatory copy exact. Both remain upright; the gradient plates carry the expressive work.

### Hierarchy

- **Display** (400, `clamp(3.8rem, 8vw, 6rem)`, 0.94): home hero statements only.
- **Headline** (400, `clamp(2.35rem, 5vw, 4.4rem)`, 0.98): page and section headings.
- **Title** (600, 1rem, 1.25): model, card and component titles.
- **Body** (400, 1rem, 1.6): descriptions and explanations, normally capped near 70 characters.
- **Label** (600, 0.75rem, 0.06em): navigation, status and categorisation, uppercase only when operationally useful.
- **Data** (500, 0.75rem, 1.35): scores, dates, hashes, routes and cost provenance.

**The Upright Authority Rule.** Headlines, descriptions and quotations remain Roman. Italics are prohibited unless they convey a literal editorial distinction that cannot be expressed semantically.

## Elevation

The system is flat by default. Depth comes from overlapping geometric fields, colour adjacency and one-pixel rules rather than diffuse shadows. Interactive surfaces may move by one pixel; they do not float.

### Shadow Vocabulary

- **Focus Lift** (`box-shadow: 0 0 0 3px rgba(229, 47, 69, 0.24)`): keyboard focus only.
- **Image Plate** (`box-shadow: 0 18px 50px rgba(20, 19, 15, 0.14)`): one large hero or signal plate per page at most.

**The Flat Evidence Rule.** Tables, cards and provenance notices never use ambient card shadows. Boundaries and hierarchy must survive in print.

## Components

### Buttons

- **Shape:** almost square, with a 2px control radius.
- **Primary:** Ink background, Canvas text, 12px by 18px padding and a 1px Ink border.
- **Hover / Focus:** switch to Signal Deep on hover; use the Focus Lift ring for keyboard focus.
- **Secondary:** transparent or Surface fill with an Ink border; move up by 1px on hover.

### Chips

- **Style:** 1px Ink or Rule border, 999px radius only for compact status metadata, Geist at 0.72rem.
- **State:** status wording and iconography carry meaning alongside colour.

### Cards / Containers

- **Corner Style:** 4px maximum.
- **Background:** Surface for evidence; Signal Yellow or Signal Red only for singular emphasis.
- **Shadow Strategy:** no ambient shadow.
- **Border:** 1px Rule at rest, 1px Ink for interactive hover or selected state.
- **Internal Padding:** 20px to 28px.

### Navigation

The sticky navigation is a compact Canvas or Ink bar with 1px rules. Wordmark and links use Geist, not display serif. Active state is shown with text colour plus a 2px Signal Red marker. Mobile navigation becomes a full-width flat drawer with 44px minimum targets.

### Calibration Plate

A calibration plate is a large raster or deterministic geometric field made from rectangles and circles in the controlled spectrum, softened at internal boundaries and finished with visible grain. It may anchor a hero, page header or one section, but never all three in a single viewport.

### Data Ledger

Leaderboard and provenance surfaces use tabular numerals, fixed column alignment, high-contrast headers and horizontal rules. Rank, model and overall score must remain readable before dimension detail.

## Do's and Don'ts

### Do:

- **Do** use Signal Red, Signal Coral, Signal Orange and Signal Yellow as one controlled spectrum.
- **Do** keep evidence surfaces on Canvas or Surface with Ink text and 1px rules.
- **Do** set major statements in Newsreader 400 Roman and working copy in Geist 400 to 600.
- **Do** preserve visible status text, table semantics, focus states and reduced-motion behaviour.
- **Do** use one dominant geometric composition per viewport.

### Don't:

- **Don't** return to Humanist Compute Atelier or Old Master painterly scenes.
- **Don't** use generic AI SaaS pages with soft blue gradients, floating glass cards or vague claims.
- **Don't** use beige luxury-editorial styling or serif italics as a proxy for authority.
- **Don't** use dark cyber-terminal aesthetics, neon grids or dashboard cosplay.
- **Don't** use rainbow gradients or colours outside the controlled warm spectrum in the identity layer.
- **Don't** use italics in headlines or descriptive copy.
- **Don't** repeat uppercase microtype as decoration rather than useful metadata.
