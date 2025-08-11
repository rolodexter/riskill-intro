# Windsurf — Doc-Driven Workflow (Persistent)

Authoritative docs (absolute paths):

- C:\Users\rolod\OneDrive\riskill-intro\PROJECT_STRUCTURE.md
- C:\Users\rolod\OneDrive\riskill-intro\README.md
- C:\Users\rolod\OneDrive\riskill-intro\WORKLOG.md

## Operating rules

1. Before any edit: read all three docs. If current work isn’t reflected, update docs first, then code.
2. After any meaningful change (files, routes, deps, UX/policies):
   - Append a WORKLOG entry (Completed / Decisions / Next Steps).
   - If components/zones/contracts changed → update PROJECT_STRUCTURE.md.
   - If CLI/dev UX changed → update README.md (Getting Started / Troubleshooting).
3. Preview cadence: when the app compiles cleanly, run
   `npm run dev -- --host localhost --port 5178 --strictPort`, post the URL, then continue.
4. Shell policy: Windows PowerShell; use `;` to chain (never `&&`).

## Required sections to keep current

- PROJECT_STRUCTURE.md
  - Layout grid & zone map, widget contracts, breakpoints/density rules, motion/accessibility policies, file/route checklist with [x]/[ ].
- README.md
  - Vision summary, “Landing Grid” scope, tech stack, Windows setup, dev server command, troubleshooting, Recent Updates (dated bullets).
- WORKLOG.md
  - Chronological entries using the template below.

## Current Execution Plan — Operations Deck (Act I)

- Scope: Refine Act I framing intro inside the Operations widget flow (`riskill-cinematic/src/widgets/Operations.tsx`). Keep CardWidget chrome; no overlay. Replace CTA buttons with lightweight interactions: info tooltip and clickable integration tags that open a sources modal.
- Header pattern: title + fraction + descriptor + info icon. Microcopy trimmed for executive rhythm.
- A11y: integration tags rendered as buttons; info icon has aria-label; modal dismissible (Done/ESC); deck has `role="region"` + `aria-label`.
- Telemetry: `ops.scroll.wheel`, `ops.scroll.cycle`, `progressive.open` for chat escalation hooks.
- Behavior: Act I auto-dismisses after ~5.5s or on first wheel/flick, then continues to standard rotation.
- Live preview: https://riskill-chat-overlay.windsurf.build/?revx=1 (console must remain clean).
- Next: Run Lighthouse (mobile & desktop) and axe; record results in `WORKLOG.md`; fix critical issues; redeploy.

### Visual Stratification — Top Row KPI Band

- Implement subtle transparency increase for the top row only to signal an executive/KPI band.
- Mechanism: container-level CSS variable `--rk-card-alpha` consumed by `CardWidget` background.
- Defaults: `0.70` (all cards). Top row override: `0.60`.
- Files:
  - `src/widgets/CardWidget.tsx` → uses `bg-[rgb(15_23_42/var(--rk-card-alpha,0.70))]`.
  - `src/components/landing/TopWidgets.tsx` → sets `data-band="top"` and `style={{ '--rk-card-alpha': 0.60 }}` on the grid container.
- Guardrails: maintain AA contrast; adjust inner shadow/edge by ≤15% if audits flag contrast issues.

## Current Execution Plan — Revenue revx Step 1

- Scope: Implement feature-flagged AgentBubble → Learn more → FocusOverlay (portal) → StackCarousel (placeholder slides) in `RevenuePulse.tsx`.
- Flag: `?revx=1` (handled by `src/hooks/useFeatureFlag.ts`).
- New components:
  - `src/components/revx/AgentBubble.tsx` — narrative bubble; tap/hover/focus open; outside/ESC dismiss; collision-aware placement; density-aware copy.
  - `src/components/revx/FocusOverlay.tsx` — portal modal; scroll lock; background inert; focus trap; ESC; focus restore; blur gated via `@supports`.
  - `src/components/revx/StackCarousel.tsx` — 4 placeholder slides; arrows + swipe; slide indicators.
  - `src/utils/telemetry.ts` — sampled console telemetry for revx events.
- Integration: `src/widgets/RevenuePulse.tsx` adds hotspot, bubble, overlay, telemetry, and outside-click layer that does not trigger card action.

### Acceptance Criteria (Step 1)
1) No console warnings (hydration, nested interactive, a11y roles).
2) A11y: Card remains `role="button"`; bubble reachable via Tab; dismiss via ESC/outside; overlay `role="dialog" aria-modal="true"` with focus trap and focus restore.
3) Perf: transform/opacity-only; micro 160–220 ms; no layout shift; mobile steady 60fps.
4) Responsive: 360/768/1440/1920 clean; bubble doesn’t clip; carousel fits; hit targets ≥44 px; tap + swipe work; arrows on desktop.
5) Feature flag: No behavior/layout change without `?revx=1`.

### Instrumentation (sampled)
- Events: `revx.bubble_open`, `revx.learn_more`, `revx.overlay_open`, `revx.slide_change`, `revx.overlay_close`.
- Payload: `{ deviceClass, density, slideIndex? }`.

### Troubleshooting
- Vite “Outdated Optimize Dep” (504): stop dev server; delete `riskill-cinematic/node_modules/.vite`; restart dev.

## Sprint 1.5 — Quick Wins (approved)

- Clickable tracker segments in `src/components/revx/StackCarousel.tsx` with hover/focus states and `aria-current` on active.
- Per-stage micro-icons and updated copy to clarify narrative.
- Staggered micro-animations and easing tweaks to reinforce directionality.
- Inline CTA in overlay header (e.g., "Run Stack Explorer" or "Drill into revenue drivers").
- Minor visual polish: padding/density tuning, focus states, and hit target checks (≥44 px).

## Rich Placeholders — queued (behind flag)

- OCR grid animations; sparkline KPIs; rule‑chip micro‑flows.
- Enrich placeholder data modules; keep all content behind `?revx=1` until validated.

## Layering QA (explicit)

- Z‑order priorities across the app (highest to lowest): tooltips/menus → overlay content → overlay scrim/backdrop filter → AgentBubble → cards/panels → background image/gradients.
- No nested interactive collisions; tab order remains logical; no focus escape under overlay.
- Verify at 360 / 768 / 1440 / 1920 and at 125% zoom; include mobile Safari checks.
- `FocusOverlay` uses `role="dialog" aria-modal="true"` with focus trap and focus restore; no stacking‑context regressions.

## Content Config Decision

- Move stage copy/labels to `src/content/revx.ts` for faster iteration and future localization.
- Suggested shape:
  - `export const REVX_STAGES = [{ id, label, icon, tone, copy: { xs, sm, md, lg } }]`.

## Success Criteria — Compelling Demo

- Each stage presents a clear visual and narrative AI cue.
- Smooth directional transitions; no jank or layout shift; micro 160–220 ms.
- Clear CTA toward next action (drill/export/explore stack).
- Performance: sustained 60 fps on mobile; Lighthouse (mobile) ≥ 85 with background enabled.
- Accessibility: keyboard path, focus rings, `aria-*` complete; console clean.

## Feature Flag & Live Build Status

- Feature flag: `?revx=1` enables; presence‑only and `1`/`true` accepted; `0`/`false` disables. Parsing handled in `src/hooks/useFeatureFlag.ts`.
  - Live deploy: https://riskill-zones-glass.windsurf.build/?revx=1 (gated behind URL flag).
  - Status: Sprint 1 scaffolding deployed; Quick Wins in progress; validate AgentBubble + overlay open/close, slide navigation, and telemetry on live.

## Windsurf Task Brief — Revenue Widget + Progressive Disclosure Chat

### Task Overview
- Elevate `RevenuePulse` into a rotating, top-level table of contents for revenue insights (desktop + mobile).
- On tap/click “see more,” escalate context into an elegant floating chat/messenger window.

### Implementation Goals
- Revenue Widget (rotating cards):
  - Desktop: wheel/arrow keys rotate; 300–400 ms ease-out; consistent spacing to simulate continuous stack.
  - Mobile: swipe gestures (L/R) with thresholds and snap points.
  - Each card: 2–3 key metrics, short headline, small viz; click/tap escalates to chat.
- Floating Chat/Messenger:
  - Slide + fade + scale from dock (BR default, BL fallback). Glassmorphic, rounded, z-index above panels.
  - Rich content (text, charts, files); persists context; minimizes to bubble with unread badge.
- Progressive Disclosure Logic:
  - Shared hook `useProgressiveDisclosure.ts` publishes `progressive.open` with widget context for chat to consume.

### Motion Language
- Durations: micro 120–180 ms; panels 250–350 ms; narrative 400–600 ms.
- Easing: cubic-bezier(0.2, 0.8, 0.2, 1) for crisp UI; springs for conversational chat.
- Transform-only (translate/scale/opacity). Respect `prefers-reduced-motion`.

### Widget Micro-Interactions
- Hover/press/focus: subtle scale ≤1.02 and shadow bloom.
- Metric count-up: clamp large deltas; resolve ≤1.2 s; frame-budget friendly.
- Stagger: 20–40 ms per child; disable for heavy DOM.

### Card Rotation Patterns
- Desktop: wheel/arrow semantics; inertia limits; snap after each card.
- Mobile: swipe 30–50 px threshold; overscroll resistance; velocity cutoffs.
- Direction semantics (forward/back) and progress affordance (dots/bar).

### Floating Chat Patterns
- Summon/dismiss: dock-origin slide+fade+scale; minimize → bubble with unread; restore reverses.
- Dock positions: BR/BL with collision/viewport awareness.
- Z-index + focus: trap on open, ESC to close, restore focus.

### Message/Card Composition
- Typographic hierarchy: title/metric/body/aside.
- Inline media (charts/files) with responsive sizing + skeletons.
- Agent persona pulse + “speaking” state.

### A11y & Perf Guardrails
- Focus order, ARIA roles; `prefers-reduced-motion` respected.
- No layout thrash; CLS-safe transitions; use `content-visibility` for heavy blocks.

### QA Checklist & Acceptance
- ≥60 FPS feel on desktop/mobile Safari/Chrome.
- Reduced-motion disables non-essential transforms.
- Chat overlay always above widgets; below modals unless active.

## WORKLOG template (use verbatim)

```
## YYYY-MM-DD — <short title>
### Completed
- …
### Decisions
- …
### Next Steps
- …
```

## Optional helpers (PowerShell one-liners)

Open all three for live edit

```powershell
ii "C:\Users\rolod\OneDrive\riskill-intro\PROJECT_STRUCTURE.md"; `
ii "C:\Users\rolod\OneDrive\riskill-intro\README.md"; `
ii "C:\Users\rolod\OneDrive\riskill-intro\WORKLOG.md"
```

Append a quick WORKLOG stub

```powershell
$today=(Get-Date).ToString('yyyy-MM-dd')
@"
## $today — $(Read-Host 'Title')
### Completed
- $(Read-Host 'Completed #1')
### Decisions
- $(Read-Host 'Decision #1')
### Next Steps
- $(Read-Host 'Next step #1')
"@ | Add-Content -Encoding utf8 "C:\Users\rolod\OneDrive\riskill-intro\WORKLOG.md"
```

## Prompt for Windsurf (pasteable)

Objective: Scrap the current cinematic intro sequence entirely. Focus on delivering a compelling, responsive website layout that works well on both modern and older devices (including older iPhones).

Layout Requirements:
- Top Row: A horizontal strip of widget cards at the top (responsive, wrapping on small screens).
- Main Body:
  - Left Zone: Side panel for navigation, filters, or contextual data.
  - Middle Zone: Large central canvas area for primary content or visualizations.
  - Right Zone: Contextual detail panel, secondary metrics, or interactive elements.
- Layout must maintain full responsiveness and degrade gracefully on small devices.

Visual Styling:
- Use gradients and transparencies to add dimensionality, texture, and depth.
- Implement hover-over animations and actions for each card widget (subtle scale, glow, or shift effects).
- Background: Incorporate a dark, nature vista background image (use provided image assets). Background should be applied with an overlay gradient to ensure readability of text/UI elements.
- Design language: modern, cinematic, and data-driven, inspired by HUD interfaces.

Files to Maintain:
- Continuously update these files with changes and progress:
  1. C:\Users\rolod\OneDrive\riskill-intro\PROJECT_STRUCTURE.md
  2. C:\Users\rolod\OneDrive\riskill-intro\README.md
  3. C:\Users\rolod\OneDrive\riskill-intro\WORKLOG.md

Performance & Compatibility:
- Optimize for smooth rendering on older iPhones as well as modern desktops.
- Ensure assets are compressed and lazy-loaded where possible.
- Avoid heavy intro animations—focus on snappy, responsive transitions instead.
