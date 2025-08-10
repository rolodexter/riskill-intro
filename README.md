# Riskill — Zones-Only Dashboard (CardWidget Micro-Apps)

Deliver a responsive, glassmorphic dashboard comprised of independent CardWidgets (micro-apps). Each card manages its own state and quick actions, and cards communicate via a lightweight pub/sub event bus. The layout is accessible, performant, and degrades gracefully on small devices.

## Landing Grid Scope
- Top Row: RevenuePulse, OpsHealth, RiskAlerts, AgentActivity
- Left Zone: NavigationCard, FiltersCard, DataSourcesCard
- Middle Zone: CommandCanvasCard, InsightStreamCard, ActionQueueCard
- Right Zone: RecommendationsCard, AlertsCard, CtaCard

## Tech Stack
- React + TypeScript + Vite
- Tailwind CSS v4 (via @tailwindcss/postcss)
- Framer Motion (transform/opacity-only micro-interactions)

## Visual Compass & Libraries
- Visual style: glassmorphism (backdrop blur), depth layering, minimalist enterprise typography (Inter/Manrope/IBM Plex Sans), dark neutrals + teal/blue/mint accent.
- Motion: transform/opacity only; micro 160–220 ms; section 650–800 ms; easing (0.2, 0.8, 0.2, 1).
- Preferred libs: framer-motion; TailwindCSS; optional GSAP / three.js + R3F / D3-visx when needed.
- Background: dark nature vista with overlay gradient for legibility.

## Background Implementation
- Class: `.bg-onyx-vista` in `src/index.css` applies layered gradients + image.
- Helper: `src/theme/bg.ts` exports `BG_URL` → `/assets/bg/nature-vista-dark.jpg`.
- Asset: place optimized `nature-vista-dark.jpg` (prefer WebP) under `public/assets/bg/` (~220–360 KB).
- Perf guard: desktop uses `background-attachment: fixed`; mobile (≤480px) switches to `scroll` to avoid iOS repaint overhead.

## Density Contracts (useResizeDensity)
- Buckets (by container width):
  - `xs` <360 → text `[13px]`, `px-3 py-2`, hide subtitles.
  - `sm` <560 → text `[14px]`, `px-3.5 py-2.5`.
  - `md` <880 → default.
  - `lg` ≥880 → enable extras (sparklines/meta).
- Applied in: `RevenuePulse`, `CommandCanvasCard`, `RecommendationsCard`.

## Widget Event Topics
- `action.queue.push` → `{ id, type, payload?, ts }` (Recommendations → ActionQueue demo)
- `filters.apply` → `{ query, tags[] }`
- `insight.highlight` → `{ id }`
- `nav.goto` → `{ section: "overview" | "sources" | "agents" | "insights" }`
Note: In‑memory bus (`src/widgets/bus.ts`) for now; TODO: event bridge with persistence/audit.

## Getting Started (Windows PowerShell)
```powershell
cd "C:\Users\rolod\OneDrive\riskill-intro\riskill-cinematic";
npm install;
npm run dev -- --host localhost --port 5178 --strictPort
```
Preview: http://localhost:5178

## Troubleshooting
- HMR overlay shows compile errors: fix and refresh; strictPort prevents port hopping.
- Tailwind v4/PostCSS: ensure `@tailwindcss/postcss` is in devDependencies and `postcss.config` uses it.
- Editor warnings about `@source`, `@theme` at‑rules are expected with Tailwind v4 syntax; they compile via PostCSS.
- Blank page: replace `src/App.tsx` with a one-div “Hello Riskill” smoke render to isolate Vite/runtime.
- Port conflict: ensure nothing else is bound to 5178; re-run with `--strictPort`.

## Recent Updates
- 2025-08-09: Pushed to GitHub and initiated Windsurf/Netlify deploy → https://riskill-zones-glass.windsurf.build (pending build).
- 2025-08-09: Implemented dark nature vista background + overlays; wired actionable density into RevenuePulse, CommandCanvas, and Recommendations; stabilized event topics; added assets placeholder and updated docs.
- 2025-08-09: Switched to zones-only CardWidget micro-app layout; implemented CardWidget contract, widget bus, and all widgets; wired zones; fixed TS and bus cleanup; added doc-driven workflow and plan.md; ready for preview.
- 2025-08-08: Initialized clean-room Vite app; locked dev server to localhost:5178; added motion/layout scaffolding; baseline onboarding copy in `App.tsx`.

---

### Historical (Cinematic Intro — deprecated context)
The repo previously targeted a cinematic onboarding experience. See earlier sections in `PROJECT_STRUCTURE.md` and older WORKLOG entries for context.