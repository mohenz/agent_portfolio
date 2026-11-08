---
name: Obsidian Runway
colors:
  surface: '#131315'
  surface-dim: '#131315'
  surface-bright: '#39393b'
  surface-container-lowest: '#0e0e10'
  surface-container-low: '#1c1b1d'
  surface-container: '#201f22'
  surface-container-high: '#2a2a2c'
  surface-container-highest: '#353437'
  on-surface: '#e5e1e4'
  on-surface-variant: '#c4c7c9'
  inverse-surface: '#e5e1e4'
  inverse-on-surface: '#313032'
  outline: '#8e9193'
  outline-variant: '#444749'
  surface-tint: '#c6c6c7'
  primary: '#ffffff'
  on-primary: '#2f3132'
  primary-container: '#e2e2e3'
  on-primary-container: '#636466'
  inverse-primary: '#5d5e60'
  secondary: '#e9c349'
  on-secondary: '#3c2f00'
  secondary-container: '#af8d11'
  on-secondary-container: '#342800'
  tertiary: '#ffffff'
  on-tertiary: '#352f2d'
  tertiary-container: '#ebe0dc'
  on-tertiary-container: '#6a6360'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2e2e3'
  primary-fixed-dim: '#c6c6c7'
  on-primary-fixed: '#1a1c1d'
  on-primary-fixed-variant: '#454748'
  secondary-fixed: '#ffe088'
  secondary-fixed-dim: '#e9c349'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#574500'
  tertiary-fixed: '#ebe0dc'
  tertiary-fixed-dim: '#cec4c1'
  on-tertiary-fixed: '#1f1b18'
  on-tertiary-fixed-variant: '#4c4543'
  background: '#131315'
  on-background: '#e5e1e4'
  surface-variant: '#353437'
typography:
  display-xl:
    fontFamily: Syne
    fontSize: 5.5rem
    fontWeight: '700'
    lineHeight: 5.75rem
    letterSpacing: -0.04em
  display-xl-mobile:
    fontFamily: Syne
    fontSize: 2.75rem
    fontWeight: '700'
    lineHeight: 3rem
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Syne
    fontSize: 3rem
    fontWeight: '600'
    lineHeight: 3.5rem
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Syne
    fontSize: 1.75rem
    fontWeight: '600'
    lineHeight: 2.25rem
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Syne
    fontSize: 1.5rem
    fontWeight: '500'
    lineHeight: 2rem
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: '300'
    lineHeight: 1.875rem
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 0.9375rem
    fontWeight: '300'
    lineHeight: 1.6rem
    letterSpacing: 0em
  caption:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '400'
    lineHeight: 1.125rem
    letterSpacing: 0.08em
  label-caps:
    fontFamily: Inter
    fontSize: 0.6875rem
    fontWeight: '500'
    lineHeight: 0.875rem
    letterSpacing: 0.18em
spacing:
  gutter: 2rem
  gutter-mobile: 1rem
  margin: 4rem
  margin-mobile: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 2rem
  space-xl: 4rem
  space-2xl: 8rem
---

## Brand & Style

This design system serves an elite, synthetic fashion context: the personal editorial portfolio of an autonomous AI fashion model. The target audience comprises luxury fashion houses, haute couture directors, casting agents, and contemporary digital art curators. The interface must evoke tension, prestige, mystery, and surgical refinement. 

The aesthetic is ultra-minimalist editorial luxury. The interface recedes entirely, allowing hyper-realistic full-body compositions and generative silhouettes to dominate the canvas. By pairing uncompromising negative space with razor-sharp editorial framing and typographic precision, the design replicates an exclusive print retrospective experienced through a digital screen. Visual noise is treated as a defect; luxury is communicated through restraint, spatial tension, and effortless stillness.

## Colors

The palette is anchored in subterranean darks and muted, luminous lights:

- **Canvas & Background (`#09090B`)**: The deepest obsidian base layer, creating an endless, light-absorbing void for visual assets.
- **Surface Elevation (`#121214`)**: A subtly differentiated charcoal tier used sparingly for full-bleed image trays and modal backdrops.
- **Primary / Core Typography (`#F4F4F5`)**: Warm zinc ivory, delivering high readability without the sterile harshness of unadulterated pure white.
- **Muted Typography / Outlines (`#71717A` / `#27272A`)**: Receded neutral tones for micro-metadata, captions, and 1px structural framing lines.
- **Secondary / Accent (`#D4AF37`)**: Antique editorial gold, restricted strictly to hairline active states, index markers, and subtle curation badges. Use with extreme discipline.

## Typography

Typography acts as architectural framing. Two complementary typefaces define the hierarchy:

1. **Syne**: An expressive, sculpted geometric sans-serif reserved for structural titles, lookbook volume headers, and high-impact editorial numbers. It conveys contemporary digital couture.
2. **Inter**: The workhorse for high-legibility captions, technical specifications (measurements, latency, generation parameters), and navigational chrome. It is set at lightweight (`300`) for body text to maintain an airy, delicate presence.

All metadata, categories, and technical labels are rendered in uppercase (`label-caps`) with deliberate wide tracking (`0.18em`) to mimic high-fashion mastheads and physical runway notes.

## Layout & Spacing

The layout is structured around an asymmetrical 12-column grid designed specifically for vertical fashion proportions (4:5 and 9:16 aspect ratios).

- **Desktop (1440px+)**: 12-column layout with 64px (`4rem`) outer margins and 32px (`2rem`) gutters. Content sections span dramatic vertical heights, with curated image frames often occupying 7 to 9 columns, leaving balanced, intentional voids on either flank.
- **Tablet (768px - 1439px)**: 8-column layout with 32px (`2rem`) margins. Imagery expands to fill 6 to 8 columns; metadata stacks below or aligns horizontally as hairlines.
- **Mobile (< 768px)**: 4-column layout with 24px (`1.5rem`) margins. Imagery goes edge-to-margin; carousels snap horizontally with subtle peek cues (15% visibility of subsequent frames).
- **Rhythm**: Spacing relies heavily on `space-xl` (64px) and `space-2xl` (128px) between editorial sections to induce deliberate pacing and cinematic contemplation during scroll.

## Elevation & Depth

In keeping with ultra-minimalist dark aesthetics, this design system avoids simulated shadows and skeuomorphic blurs entirely. Spatial hierarchy is communicated through plane segmentation and translucency:

- **Surfaces**: The primary canvas rests on `#09090B`. Active overlays, floating navigation headers, and drawer panels render in `#121214` with a 85% opacity backdrop blur (`backdrop-filter: blur(16px)`), allowing high-contrast imagery to pass subtly underneath.
- **Borders & Separators**: Minimal structural division is achieved using crisp 1px ghost outlines in `#27272A` (or `#F4F4F5` at 8% opacity).
- **No Cast Shadows**: No drop shadows or ambient outer glows are permitted on imagery or UI containers. Depth is conveyed strictly through layering, scale, and typographic contrast.

## Shapes

The shape philosophy is strictly architectural: **Sharp (`0px` border-radius)** across all elements.

- Image frames, buttons, input fields, toolbars, and modal sheets terminate in razor-sharp 90-degree corners.
- This geometric rigidity reinforces the haute couture editorial vernacular, echoing gallery plinths, printed lookbooks, and high-fashion signage.
- The sole exception to linear geometry is circular visual elements used for editorial pagination bullets and rotating model indices, which remain pure geometric circles (`border-radius: 50%`).

## Components

### Buttons
- **Primary**: Solid ivory background (`#F4F4F5`) with obsidian text (`#09090B`). Height: 44px, zero border-radius, `label-caps` typography. Hover: Opacity transitions to 85% with an effortless 200ms ease.
- **Ghost / Editorial Outline**: Transparent background, 1px border in `#27272A`, text in `#F4F4F5`. Hover: Border transforms to `#F4F4F5` or hairline `#D4AF37`.
- **Text Link**: Monospaced or uppercase label underlined by an offset hairline rule that expands from 0% to 100% width on hover.

### Carousel & Lookbook Viewer
- Full-bleed horizontal stage supporting drag, trackpad pan, and keyboard arrow interaction.
- Minimal hairline progression indicator at screen bottom: a 1px continuous track in `#27272A` with an active slider segment in `#D4AF37`.
- Slide counters rendered as `label-caps` (e.g., `01 / 18`) positioned in the upper right quadrant.

### Form Inputs & Inquiries
- Flat, borderless baseline inputs featuring a single 1px bottom border (`#27272A`).
- Focus state: Bottom border shifts to `#F4F4F5`. Floating labels in `label-caps` positioned above the rule.
- No background color; inputs sit directly on `#09090B`.

### Editorial Cards / Look Tiles
- Pure photographic container with zero card styling (no surrounding card container background, no shadows).
- Captions and collection tags sit outside the visual boundary, pinned underneath in `caption` weight with metadata aligned to the right edge.

### Spec Sheets / Model Stats Drawer
- Slide-over architectural sheet for model parameters (Virtual Height, Render Latency, Engine, Color Space).
- Border-bottom table structure using `#18181B` lines. Left-aligned parameter titles in muted zinc; right-aligned values in ivory.