# PROJECT_STRUCTURE — Authoritative Spec

## Intro Scene Technical & Narrative Spec

### Vision Brief
- Immediately immerse the user in engaging with all organizational data at once.
- Riskill turns legacy, siloed systems into a high‑leverage AI business intelligence layer.
- Evoke “Neo seeing the Matrix” in a clean enterprise aesthetic: whitespace, precision typography, restrained color, dynamic data.
- Visualizations assemble in real-time, then reconfigure to reveal hidden, non‑obvious insights.
- User should feel able to act instantly on surfaced intelligence — Move37 moments.
- Audience: C‑levels, directors, analysts in legacy‑heavy enterprises.
- No cartoonish/playful motion; aim for cinematic gravity.

### Animation & Graphics Stack
- Core animation & sequencing
  - Framer Motion — panel transitions, hero entrances (installed)
  - GSAP — precise, chained sequences for layered chart + copy reveals (optional)
- Data visualization layer
  - D3.js or visx — charts that build from raw points to “insight form” (optional)
  - three.js + react‑three‑fiber — 3D/DOF data surfaces (optional, cinematic)
- GL effects / polish
  - postprocessing: bloom, depth‑of‑field (optional)
  - Shader gradient overlays for subtle “data stream” feeling (avoid sci‑fi cliché)
- UI layer
  - TailwindCSS for enterprise typography/spacing (optional)
  - shadcn/ui for consistent buttons/inputs/modals (optional)

### Scene Flow (High‑Level)
1) 0–2s: Initial Fade‑In
   - Minimal background: soft gradient; subtle vertical data drift.
   - Company name/logo scan‑reveals in.
2) 2–4s: Data Awakening
   - Abstract network of points/lines fades in.
   - Points flow into recognizable artifacts: charts, dashboards, KPIs, forms.
3) 4–6s: Insight Emergence
   - One viz morphs → new pattern; label: “INSIGHT DETECTED” (Move37 moment).
4) 6–8s: Human Integration
   - Onboarding panel slides in: “Welcome to Riskill. Let’s calibrate your intelligence streams.”
   - Role input field; background motions ease to focus attention.

### Performance / Responsiveness
- Desktop‑first; basic tablet/mobile scaling is sufficient.
- Favor richer desktop animation over perfect mobile parity.
- Lazy‑load heavy assets; intro should start immediately.

### Accessibility Guardrails
- Visible Skip Intro; logical focus order; ARIA on chips/badges; AA+ contrast.

### Routing & Handoff
- Intro → `AdaptiveConsole` CTA when onboarding completes.

---

## Zones-Only Dashboard — CardWidget Micro-App Spec

### Scope
- Replace cinematic intro with a zones‑only, glassmorphic dashboard.
- Single page; no routing. All visible panels are independent CardWidgets (micro‑apps).

### Layout Grid & Zone Map
- Top Row (wraps on small screens): `RevenuePulse`, `OpsHealth`, `RiskAlerts`, `AgentActivity`.
- Main Grid (desktop 25% / 50% / 25%; mobile stacks Top → Middle → Left → Right):
  - Left Zone: `NavigationCard`, `FiltersCard`, `DataSourcesCard`.
  - Middle Zone: `CommandCanvasCard`, `InsightStreamCard`, `ActionQueueCard`.
  - Right Zone: `RecommendationsCard`, `AlertsCard`, `CtaCard`.

### CardWidget Contract
- Props: `title`, `subtitle?`, `actions?` (quick actions), `footer?`, `status?` (idle/loading/error), `interactive?`, `onPrimaryAction?`.
- Interaction: hover lift/glow, press compress, focus‑visible ring. Min hit target 40×40.
- Quick actions: appear on hover/focus; always visible on very small screens (≤480px).
- Density: `useResizeDensity()` provides xs/sm/md/lg for per‑card tuning.
- Performance: transform/opacity only animations; respect `prefers-reduced-motion`.

### Widget Bus (pub/sub)
- Simple in‑memory event bus for inter‑widget communication.
- Topics (stabilized):
  - `action.queue.push` → `{ id: string; type: string; payload?: any; ts: number }`
  - `filters.apply` → `{ query: string; tags: string[] }`
  - `insight.highlight` → `{ id: string }`
  - `nav.goto` → `{ section: "overview" | "sources" | "agents" | "insights" }`
- Demo: `RecommendationsCard` publishes `action.queue.push`; `ActionQueueCard` subscribes and appends.
- TODO: swap to an event bridge with persistence + audit trail.

### Breakpoints / Density Contracts (Actionable)
- Buckets (by container width via `useResizeDensity()`):
  - `xs` (<360): body `text-[13px]`, `px-3 py-2`, hide subtitles, no sparklines.
  - `sm` (<560): `text-[14px]`, `px-3.5 py-2.5`.
  - `md` (<880): default.
  - `lg` (≥880): enable extra chrome (sparklines, secondary meta).
- Enforced in: `RevenuePulse`, `CommandCanvasCard`, `RecommendationsCard`.

### Motion & Accessibility Policies
- Transform/opacity only; short micro‑motions; AA contrast.
- Keyboard focus ring always visible; logical tab order.
- Reduce blur/elevation on mobile for perf.

### Background Visual (Implemented)
- Dark nature vista with overlay gradients applied via `.bg-onyx-vista` in `src/index.css`.
- Helper: `src/theme/bg.ts` exposes `BG_URL` → `/assets/bg/nature-vista-dark.jpg`.
- Mobile guard: `background-attachment: scroll` at ≤480px to avoid iOS repaint cost; desktop uses `fixed`.

### QA Gates (Blocking)
- Responsive: 360 / 768 / 1440 / 1920 — no overflow or layout shift.
- Performance: mobile scroll smooth; Lighthouse Perf ≥ 85 (mobile) with background enabled.
- Accessibility: correct heading order; focus rings visible; buttons ≥ 40×40; AA contrast.
- Behavior: clicking a Recommendation adds an item to ActionQueue via `bus`.

### File/Zone Checklist
- [x] Base: `CardWidget.tsx`, `QuickAction.tsx`, `useResizeDensity.ts`, `bus.ts`
- [x] Top Row: `RevenuePulse.tsx`, `OpsHealth.tsx`, `RiskAlerts.tsx`, `AgentActivity.tsx`
- [x] Left: `NavigationCard.tsx`, `FiltersCard.tsx`, `DataSourcesCard.tsx`
- [x] Middle: `CommandCanvasCard.tsx`, `InsightStreamCard.tsx`, `ActionQueueCard.tsx`
- [x] Right: `RecommendationsCard.tsx`, `AlertsCard.tsx`, `CtaCard.tsx`
- [x] Zones wired: `TopWidgets.tsx`, `LeftZone.tsx`, `MiddleCanvas.tsx`, `RightZone.tsx`
- [x] Background image + overlay gradient applied
- [x] Density tuning across key widgets (RevenuePulse, CommandCanvas, Recommendations)

---

## Windsurf Boot‑Up Prompt (Pasteable)

```
Directive: This repo is doc‑driven. Before edits, re‑read README.md, PROJECT_STRUCTURE.md, WORKLOG.md. Update docs first if reality diverges.

Goals:
- Build the cinematic enterprise intro per “Intro Scene Technical & Narrative Spec”.
- Keep motion transform/opacity only; micro 160–220 ms, section 650–800 ms; easing (0.2, 0.8, 0.2, 1).
- Maintain accessibility guardrails and preview cadence.

Dev Server:
- Windows PowerShell only. Use `;` to sequence. Start with:
  npm run dev -- --host localhost --port 5178 --strictPort
  Preview at http://localhost:5178

Libraries:
- Use Framer Motion (installed). Consider GSAP, D3/visx, R3F + postprocessing if/when needed (add via PowerShell install commands). Avoid gimmicks.

Implementation Cues:
- Animate intro beats (S0–S6). Start with lightweight Framer sequences; progressively enhance with optional stacks.
- After any routing/layout/frame change, if compile is green, (re)start dev server and post preview URL. Continue working while preview is reviewed.

Logging:
- After each meaningful change, append WORKLOG with Completed/Decisions/Next Steps. Reflect scene/component/contract changes in PROJECT_STRUCTURE.md.
```

---

## Windsurf Persistent Self‑Alignment Prompt — Visual Compass

```
Directive:
- Always re‑read README.md, PROJECT_STRUCTURE.md, WORKLOG.md before editing. Keep docs authoritative.

Visual Style (lock‑in):
- Glassmorphism: frosted panels with `backdrop-filter: blur(...)` and subtle translucency.
- Depth layering: foreground cards float above a cinematic background (gradient/video/particle field), with parallax on major transitions.
- Typography: minimalist, enterprise sans (Inter / Manrope / IBM Plex Sans), tight tracking; motion maps to meaning.
- Palette: dark neutrals with a single AI accent (teal/electric blue/mint). Avoid gamer neon overload.

Libraries (preferred):
- Motion: framer-motion (primary), GSAP (timeline when needed).
- 3D/GL: three.js + react-three-fiber; postprocessing for bloom/DOF (sparingly).
- Charts: echarts (cinematic), or D3/visx for custom flows.
- UI: TailwindCSS + shadcn/ui. Optional: react-glassmorphic-card for fast frosted prototypes.

Scene Composition:
- Left: glassmorphic nav/filters with subtle glow hovers.
- Center: conversation + data action; chat can trigger real backend actions.
- Right: insights/context cards; “Move37” callouts with micro-animations.

Animation Cues:
- Elements enter from depth; parallax and blur-to-focus on transitions.
- Data points surface from a 3D field; AI recommendations shimmer/pulse once.

Constraints & Perf:
- Transform/opacity only; micro 160–220 ms; section 650–800 ms; easing (0.2, 0.8, 0.2, 1).
- Desktop-first (16:9 @ 1920×1080 baseline); basic tablet/mobile scaling only.
- Lazy-load heavy assets so intro starts immediately.

A11y & Cadence:
- Visible Skip Intro; logical focus order; AA+ contrast; ARIA on chips/badges.
- After routing/layout/frame changes: ensure compile green, (re)start dev, post http://localhost:5178.

PowerShell (dev):
  npm run dev -- --host localhost --port 5178 --strictPort

Logging:
- Append WORKLOG with Completed/Decisions/Next Steps for each meaningful change.
```

---

## Status Checklist
- [x] Vite React+TS baseline
- [x] Dev server locked to localhost:5178
- [x] Layout primitives (`SafeArea`, `Container`, `GridShell`)
- [x] Onboarding baseline in `App.tsx`
- [x] Intro scaffolding (frames/primitives)
- [ ] Intro animation sequences (Framer)
- [ ] Optional stacks evaluated (GSAP, D3/visx, R3F, postprocessing)
