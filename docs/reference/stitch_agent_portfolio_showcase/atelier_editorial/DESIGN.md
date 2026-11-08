---
name: Atelier Editorial
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#444748'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c9c6c5'
  secondary: '#5e5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e3e2e2'
  on-secondary-container: '#646464'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#201b14'
  on-tertiary-container: '#8c8279'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c9c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474646'
  secondary-fixed: '#e3e2e2'
  secondary-fixed-dim: '#c7c6c6'
  on-secondary-fixed: '#1b1c1c'
  on-secondary-fixed-variant: '#464747'
  tertiary-fixed: '#ede0d5'
  tertiary-fixed-dim: '#d0c5ba'
  on-tertiary-fixed: '#201b14'
  on-tertiary-fixed-variant: '#4d463d'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-xl:
    fontFamily: Syne
    fontSize: 80px
    fontWeight: '700'
    lineHeight: 88px
    letterSpacing: -0.04em
  display-xl-mobile:
    fontFamily: Syne
    fontSize: 44px
    fontWeight: '700'
    lineHeight: 50px
    letterSpacing: -0.03em
  display-lg:
    fontFamily: Syne
    fontSize: 56px
    fontWeight: '600'
    lineHeight: 64px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Syne
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 42px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Syne
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Syne
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Syne
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Syne
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 28px
    letterSpacing: 0em
  body-xl:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '300'
    lineHeight: 32px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: 0em
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0.01em
  label-caps:
    fontFamily: Hanken Grotesk
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.15em
  label-sm:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.04em
  caption:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.02em
spacing:
  gutter: 2rem
  gutter-mobile: 1rem
  margin: 4rem
  margin-mobile: 1.25rem
  space-xs: 0.375rem
  space-sm: 0.75rem
  space-md: 1.5rem
  space-lg: 2.5rem
  space-xl: 4.5rem
  space-2xl: 8rem
---

## Brand & Style

This design system draws inspiration from high-fashion print monographs, luxury couture lookbooks, and avant-garde architectural journals. It treats digital canvas space with the reverence of physical archival paper. 

The core visual philosophy is uncompromising reduction: eliminate ornamental noise, excessive drop shadows, and saturated accents to elevate content, imagery, and typography. The aesthetic relies on extreme whitespace, razor-sharp geometric edges, structural grid divisions, and meticulous typographic cadence.

Interactions are deliberate, quiet, and effortless. Interfaces evoke museum-grade clarity, timeless luxury, and decisive editorial authority.

## Colors

The palette is anchored in high-contrast monochrome with delicate tonal gradations:

- **Canvas & Surfaces**: Grounded in pure white (`#ffffff`), secondary ivory wash (`#fcfcfc`), and muted structural panels (`#f7f7f8`).
- **Typography & Structural Accents**: Deep obsidian black (`#0a0a0a`) acts as the dominant typographic mark and primary interactive state, supported by rich charcoal (`#1a1a1a`) for dense editorial reads.
- **Muted Hierarchy**: Mid-tone neutrals (`#737373`) for secondary metadata, captions, and datelines.
- **Architectural Rules**: Subtle warm gray dividers and borders (`#e5e5e5` and `#ececec`) provide structural division without visual mass.
- **Interactive Feedback**: Contrast inversions (obsidian swapping with stark white) replace decorative accent colors.

## Typography

The type system is constructed as a dialogue between the sculptural, avant-garde character of **Syne** and the sharp, disciplined neutrality of **Hanken Grotesk**.

- **Display & Headlines (Syne)**: Tightly tracked, confident, and sculptural. Used for oversized hero mastheads, editorial thematic banners, and section markers.
- **Body & Continuous Reading (Hanken Grotesk)**: Rendered in light and regular weights with generous line heights to preserve whitespace and breathing room inside long-form articles and descriptions.
- **Labels & Overlines (Hanken Grotesk - Upper)**: Set in all-caps with generous tracking (`0.15em`) for category flags, status pills, table headers, and numerical folios.

## Layout & Spacing

The layout is built upon an architectural 12-column grid system inspired by broadsheet editorial publications:

- **Desktop (1200px+)**: 12-column layout with 64px (`margin`) outer canvas margins and 32px (`gutter`) gutters. Major section padding leverages deliberate, exaggerated vertical gaps (`space-2xl`) to isolate key narratives.
- **Tablet (768px - 1199px)**: 8-column layout with 40px outer margins and 24px gutters.
- **Mobile (<768px)**: 4-column layout with 20px (`margin-mobile`) outer margins and 16px (`gutter-mobile`) gutters.

Grids alternate between full-width bleed containers and disciplined asymmetric columns (e.g., 4-column sticky title metadata next to an 8-column media sequence). Margins and horizontal rules create definitive structural frames.

## Elevation & Depth

This design system deliberately rejects elevation via drop shadows and soft blurred layering. Depth is structural, planar, and flat:

- **Hairline Division**: Interfaces use 1px solid low-contrast hairline dividers (`#e5e5e5`) to separate modules, rows, and viewport panels.
- **Tonal Plane Stacking**: Modals, slide-overs, and popovers achieve depth through flat background contrast (e.g., placing a pure `#ffffff` panel over a full-bleed `#0a0a0a` scrim at 40% opacity).
- **Z-Index Discretion**: Sticky headers utilize an opaque `#ffffff` or translucent backdrop blur (`blur(12px)`) with an anchor border of `#e5e5e5` along the bottom baseline.
- **State Inversion**: Hover states never elevate upward along the z-axis; instead, they shift states through solid inverted fills or subtle opacity changes.

## Shapes

The shape vocabulary is strictly sharp (`roundedness: 0`). 

All corners—including buttons, input fields, modals, tags, product image frames, and floating drawers—adhere to exact 90-degree 0px border-radii. This geometric rigor creates an unyielding editorial silhouette reminiscent of folded paper sheets, mounted prints, and architectural drafting boards.

## Components

### Buttons
- **Primary**: Solid `#0a0a0a` background with `#ffffff` text, sharp corners, 0px radius. Hover state swaps to `#1a1a1a` with an imperceptible line shift, or full negative inversion (`#ffffff` fill with 1px `#0a0a0a` border).
- **Secondary / Outline**: Transparent background, 1px solid `#0a0a0a` border, `#0a0a0a` text. Hover state inverts into a solid `#0a0a0a` fill with `#ffffff` text.
- **Ghost / Text Action**: Text-only using `label-caps` styling, accompanied by a razor-thin underline positioned 4px beneath the baseline that animates from 0 to 100% width on hover.

### Form Inputs & Text Fields
- Clean bottom-border-only style (1px solid `#e5e5e5`) or full 1px geometric perimeter box.
- Background remains pure `#ffffff` or `#fcfcfc`.
- Focus state activates a sharp 1px `#0a0a0a` border with zero glow or ambient ring shadows.
- Placeholder text is set in `Hanken Grotesk` regular in `#737373`.

### Selection Controls (Checkboxes & Radios)
- Square-only format: 16x16px boxes with 1px solid `#0a0a0a` borders and 0px radius.
- Checkboxes: Active state is marked with a centered solid black square (`#0a0a0a`) inset by 3px, maintaining pure geometric precision.
- Radios: Square outer frame containing a solid centered 6x6px black block when checked.

### Cards & Editorial Containers
- Borderless by default, using generous whitespace (`space-lg`) to delimit content boundaries.
- When bounded, containers use a 1px solid `#ececec` border.
- Images within cards adhere to rigid aspect ratios (3:4 portrait or 16:9 cinema crop) with zero corner rounding. Hover zooms within image viewports are subtle and slow (scale 1.03 over 700ms ease-out).

### Chips & Tags
- Rectangular blocks with 0px corner radii.
- Styled with `label-caps` typography, 1px solid `#e5e5e5` border, `#f7f7f8` fill, and `#0a0a0a` text.
- Interactive filter chips invert to `#0a0a0a` background and `#ffffff` text when selected.

### Editorial Dividers & Index Lists
- Lists are partitioned by continuous 1px `#e5e5e5` horizontal lines.
- Items feature oversized index numbering (`01`, `02`, `03`) in `Syne` set alongside headline copy.
- Hovering over a list row reveals an inline image thumbnail preview or shifts the text color from `#737373` to `#0a0a0a`.