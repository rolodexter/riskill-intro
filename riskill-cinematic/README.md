# Riskill — Zones-Only Skeleton (Onyx + Glass)

Ultra‑responsive, zones‑only glassmorphic layout. Top widgets row + three‑column grid (25/50/25). No narrative content.

## Stack
- React + TypeScript + Vite
- Tailwind CSS (custom onyx/glass theme)
- Framer Motion

## Dev Server
Windows PowerShell only. Use strict port on localhost 5178:

```powershell
npm run dev -- --host localhost --port 5178 --strictPort
```

## Tailwind Setup
Installed and configured with `tailwind.config.js`, `postcss.config.js`, and directives in `src/index.css`.

Theme extensions:
- Colors: onyx, onyx2, glass, edge, accent, textPri, textSec
- Backgrounds: `bg-onyx-grad`, `bg-spot-1`, `bg-spot-2`, `bg-sheen`
- Shadows: `shadow-glass`, `shadow-glow`
- Backdrop blur: `backdrop-blur-xs` (mobile) → `md:backdrop-blur-xl`
- Opacity scale: `opacity-15`, `opacity-6`

## Structure
- `src/components/landing/`: TopWidgets, LeftZone, MiddleCanvas, RightZone, Footer, GlassCard, GradientBackdrop, EdgeGlow
- `src/core/motion/variants.ts`: `fadeIn`, `fadeUp`
- `src/App.tsx`: Landing grid with Top row + 3-column layout

## Responsive Stacking
- Mobile (≤768px): Top widgets → Middle (50%) → Left (25%) → Right (25%)
- Desktop (≥768px): 4-col grid where Left=1 col, Middle=2 cols, Right=1 col

## Accessibility & Performance
- Semantic headings and labelled inputs
- Sparse glass layers to limit backdrop‑filter cost
- Lightweight placeholders for demos; lazy as we add media
- Test widths: 360px, 768px, 1440–1920px
- Respect `prefers-reduced-motion`; only transform/opacity animations

## Revx: Revenue Widget (Full‑Panel Z‑Stack)
- Feature flag: append `?revx=1` to the URL.
- Controls: ArrowLeft/Right; wheel only over the content well; swipe (≈36px threshold) on touch.
- Click/tap anywhere on the active panel opens the messenger (progressive disclosure).
- Messenger placement: anchored adjacent to the widget on desktop; full‑width bottom sheet on mobile (≤640px).
- A11y: Well uses `role="group"` + `aria-roledescription="carousel"`; only the active panel is focusable; reduced motion uses crossfade only.
