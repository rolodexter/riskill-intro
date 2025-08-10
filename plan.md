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
