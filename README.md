# Riskill — Zones-Only Dashboard (CardWidget Micro-Apps)

Deliver a responsive, glassmorphic dashboard comprised of independent CardWidgets (micro-apps). Each card manages its own state and quick actions, and cards communicate via a lightweight pub/sub event bus. The layout is accessible, performant, and degrades gracefully on small devices.

## Landing Grid Scope
- Top Row: RevenuePulse, OpsHealth, RiskIndex, AgentActivity
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
- `progressive.open` → `{ source: string; cardId?: string; title?: string; metrics?: { label: string; value: string }[] }`
Note: In‑memory bus (`src/widgets/bus.ts`) for now; TODO: event bridge with persistence/audit.

### Operations Deck — Ops topics
- `ops.scroll.wheel` → `{ delta: number; mode: 0 | 1 | 2 }` (normalized wheel delta; capture-phase, non-passive)
- `ops.scroll.cycle` → `{ index: number; total: number }` (card index change in Operations deck)

## Revenue revx — Sprint 1 and 1.5

- Feature flag: enable with `?revx=1` (handled by `src/hooks/useFeatureFlag.ts`, supports presence‑only and 1/0, true/false).
- Components:
  - `src/components/revx/AgentBubble.tsx`
  - `src/components/revx/FocusOverlay.tsx`
  - `src/components/revx/StackCarousel.tsx`
  - Integrated in `src/widgets/RevenuePulse.tsx`
  - Telemetry in `src/utils/telemetry.ts`

- Sprint 1 (implemented):
  - AgentBubble with AI narration; Learn more opens FocusOverlay (portal).
  - FocusOverlay with blur fallback, focus trap, ESC/outside close.
  - StackCarousel with directional transitions and segmented tracker.
  - Telemetry: `revx.bubble_open`, `revx.learn_more`, `revx.overlay_open`, `revx.slide_change`, `revx.overlay_close`.

- Sprint 1.5 (Quick Wins, approved):
  - Clickable tracker segments with hover/focus and `aria-current` on active.
  - Per‑stage micro‑icons and updated copy; inline CTA in overlay header.
  - Stagger/easing polish; density/padding tune; hit targets ≥44 px; a11y focus.

- Rich Placeholders (queued, behind flag):
  - Animated OCR grid, sparkline KPIs, rule‑chip micro‑flows; richer live‑data placeholders.

- Layering QA (explicit):
  - Z‑order: tooltips/menus → overlay content → overlay scrim/backdrop → AgentBubble → cards → background.
  - Overlay `role="dialog" aria-modal="true"`; focus trap + restore; no nested interactive collisions.
  - Validate at 360/768/1440/1920 and 125% zoom; include mobile Safari.

- Content Config Decision:
  - Move all stage copy/labels to `src/content/revx.ts` with shape `REVX_STAGES = [{ id, label, icon, tone, copy: { xs, sm, md, lg } }]`.

- Success Criteria (demo):
  - Clear visual + narrative AI cue per stage; smooth directional transitions; no layout shift; micro 160–220 ms.
  - Clear CTA toward next action; console clean; AA contrast; keyboard path intact.
  - Perf: sustained 60 fps on mobile; Lighthouse (mobile) ≥ 85 with background on.

- Feature flag & live status:
  - Live URL (gated): https://riskill-zones-glass.windsurf.build/?revx=1
  - Keep behind flag until design/content validated; run QA gates before enabling broadly.

## Revenue Widget + Progressive Disclosure Chat (Spec)

### Motion Language
- Durations: micro 120–180 ms; panels 250–350 ms; narrative 400–600 ms.
- Easing: cubic-bezier(0.2, 0.8, 0.2, 1) for crisp UI; spring params for chat.
- Performance: transform/opacity only; respect `prefers-reduced-motion`.

### Widget Micro-Interactions
- Hover/press/focus: subtle scale ≤1.02 with shadow bloom; focus-visible ring intact.
- Metric count-up: clamp large deltas; resolve ≤1.2 s; stay within frame budget.
- Stagger: 20–40 ms per child; disable for heavy DOM nodes.

### Card Rotation Patterns (TOC)
- Desktop: wheel/arrow semantics; inertia limits; snap points after each card.
- Mobile: swipe 30–50 px threshold, overscroll resistance, velocity cutoff for snap.
- Directional semantics (forward/back) with progress affordance (dots/bar).

### Floating Chat/Messenger
- Summon/dismiss: dock-origin (BR default / BL fallback) with slide + fade + scale.
- Minimize → bubble with unread badge; restore reverses animation.
- Collision/viewport aware; z-index above panels; focus trap; ESC closes; restore focus.

### Message/Card Composition
- Typographic hierarchy: title/metric/body/aside.
- Inline media (charts/files) with responsive sizing + loading skeletons.
- Agent persona pulse with “speaking” state.

### Accessibility & Performance
- Maintain tab focus order; correct ARIA roles; `prefers-reduced-motion` respected.
- CLS-safe transitions; no layout thrash; `content-visibility` for heavy offscreen blocks.

### Implementation Notes
- Hook: `src/hooks/useProgressiveDisclosure.ts` with `escalateToChat(ctx)` publishes `progressive.open`.
- Integration path: evolve `src/widgets/RevenuePulse.tsx` or add `RevenueWidget.tsx` for rotating cards; click/tap escalates to chat.

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
- 2025-08-09: revx Step 1 scaffolding landed behind `?revx=1` (AgentBubble, FocusOverlay, StackCarousel); telemetry wired; hardened feature flag parsing; added Explore Stack quick action and placeholder metric in `RevenuePulse`.
- 2025-08-09: Pushed to GitHub and initiated Windsurf/Netlify deploy → https://riskill-zones-glass.windsurf.build (pending build).
- 2025-08-09: Implemented dark nature vista background + overlays; wired actionable density into RevenuePulse, CommandCanvas, and Recommendations; stabilized event topics; added assets placeholder and updated docs.
- 2025-08-09: Switched to zones-only CardWidget micro-app layout; implemented CardWidget contract, widget bus, and all widgets; wired zones; fixed TS and bus cleanup; added doc-driven workflow and plan.md; ready for preview.
- 2025-08-08: Initialized clean-room Vite app; locked dev server to localhost:5178; added motion/layout scaffolding; baseline onboarding copy in `App.tsx`.

---

### Historical (Cinematic Intro — deprecated context)
The repo previously targeted a cinematic onboarding experience. See earlier sections in `PROJECT_STRUCTURE.md` and older WORKLOG entries for context.