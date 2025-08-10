# PROJECT_STRUCTURE

- src/
  - core/
    - motion/
      - timings.ts
      - variants.ts
  - components/
    - layout/
      - SafeArea.tsx
      - Container.tsx
      - GridShell.tsx
  - components/
    - landing/
      - TopWidgets.tsx
      - LeftZone.tsx
      - MiddleCanvas.tsx
      - RightZone.tsx
      - Footer.tsx
      - GlassCard.tsx
      - GradientBackdrop.tsx
      - EdgeGlow.tsx
  - scenes/
    - dashboard/
      - AdaptiveConsole.tsx

## Zones-Only Baseline
- Layout-only skeleton. All zones render neutral `GlassCard` placeholders (no labels, no CTA).
- Top widgets row spans full width; below it a 3-column grid: Left (25%), Middle (50%), Right (25%).
- Mobile stacking order: Top widgets → Middle → Left → Right.
- Desktop grid kicks in at `md:` with 4 cols (`md:grid-cols-4`), spans set via `md:col-span-*`.

## Motion Policy
- Transform/opacity only.
- Durations: micro 0.16–0.22s, section 0.65–0.8s.
- Easing: (0.2, 0.8, 0.2, 1).

## Landing Grid
- TopWidgets: four empty tiles (100% width row)
- LeftZone: empty placeholders (25%)
- MiddleCanvas: empty placeholders (50%)
- RightZone: empty placeholders (25%)
- Footer: neutral placeholder

## Notes
- Files under `src/components/landing/` like `Hero.tsx`, `Problem.tsx`, etc., are not used in the zones-only skeleton.
