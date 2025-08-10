# WORKLOG

2025-08-08
- Completed: Initialized Vite React+TS app; installed framer-motion and @types/node; configured Vite to host localhost:5178 strict.
- Decisions: Use localhost with strictPort; typography-first cinematic; motion via transform/opacity only.
- Next Steps: Scaffold intro scene placeholders; run dev server and maintain preview cadence.

2025-08-09
- Completed: Pivoted to Landing Page First. Installed Tailwind + PostCSS + Autoprefixer; added onyx/glass theme. Implemented landing sections (`src/components/landing/*`) and wired into `src/App.tsx`. Updated docs.
- Decisions: Dark onyx theme, glass cards, framer-motion fadeUp variants. Desktop→mobile fluid layout with sparse backdrop-blur.
- Next Steps: Replace demo squares with Lottie/MP4 loops, add staggered scroll motion, consider Case Study section.

2025-08-09 (later)
- Completed: Removed cinematic sections from `App.tsx`. Implemented Top row + 3-column landing grid. Added gradient tokens (`bg-onyx-grad`, `bg-spot-1`, `bg-spot-2`, `bg-sheen`), glow shadow, and opacity scale in Tailwind. Upgraded `GlassCard` (mobile-friendly blur, top sheen). Added `GradientBackdrop` and `EdgeGlow` primitives. Created `TopWidgets`, `LeftZone`, `MiddleCanvas`, `RightZone`. Updated docs.
- Decisions: Keep backdrop-blur-xs on mobile; limit to two spot layers; animate transform/opacity only; respect reduced motion.
- Next Steps: Optional micro-parallax on spots in `MiddleCanvas`; wire CTA to form; replace demo square with lightweight media.

2025-08-09 (zones-only)
- Completed: Converted layout to zones-only skeleton. Simplified `TopWidgets`, `LeftZone`, `MiddleCanvas`, `RightZone` to neutral `GlassCard` placeholders (fixed heights). Replaced footer tagline with neutral placeholder. Adjusted `App.tsx` grid to `md:grid-cols-4` with mobile stacking order Top → Middle → Left → Right.
- Tech: Updated `GlassCard` to support empty usage (children optional), removed unused imports, marked unused props, tightened motion timings. Docs updated (`README.md`, `PROJECT_STRUCTURE.md`).
- Next Steps: Run dev server (strict port 5178), verify responsiveness at 360/768/1440+, AA contrast, and perf on low-end devices.
