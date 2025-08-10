# Save Point — Revenue Widget + Progressive Disclosure Chat
Date: 2025-08-10
Repo: C:\Users\rolod\OneDrive\riskill-intro
Subapp: riskill-cinematic (Vite + React + TS + Tailwind + Framer Motion)
Live (gated): https://riskill-zones-glass.windsurf.build/?revx=1

## Context Snapshot
- RevX Sprint 1.5 completed for content centralization and UI copy migration.
- New task: Rotating Revenue Widget as top-level table-of-contents + Floating Chat with progressive disclosure.
- Docs updated with motion language, micro-interactions, rotation patterns, chat patterns, a11y/perf, QA.
- Bus topic added: `progressive.open` for escalation to chat.

## Key Files
- Content: `riskill-cinematic/src/content/revx.ts` (REVX_STAGES, REVX_UI)
- Widgets: `riskill-cinematic/src/widgets/RevenuePulse.tsx`, `riskill-cinematic/src/widgets/CardWidget.tsx`
- Components: `riskill-cinematic/src/components/revx/StackCarousel.tsx`, `AgentBubble.tsx`, `FocusOverlay.tsx`
- Hook: `riskill-cinematic/src/hooks/useProgressiveDisclosure.ts`
- Bus: `riskill-cinematic/src/widgets/bus.ts`
- Docs: `PROJECT_STRUCTURE.md`, `README.md`, `plan.md`, `WORKLOG.md`

## Feature Flags / Preview
- Flag: `?revx=1` (presence-only or 1/true enables; 0/false disables) via `src/hooks/useFeatureFlag.ts`.
- Local: http://localhost:5178/?revx=1
- Live (Netlify/Windsurf): https://riskill-zones-glass.windsurf.build/?revx=1

## Event Topics (bus)
- `action.queue.push` → `{ id, type, payload?, ts }`
- `filters.apply` → `{ query, tags[] }`
- `insight.highlight` → `{ id }`
- `nav.goto` → `{ section: "overview" | "sources" | "agents" | "insights" }`
- `progressive.open` → `{ source: string; cardId?: string; title?: string; metrics?: { label: string; value: string }[] }`

## Spec Summary (Concise)
- Motion Language: micro 120–180 ms; panels 250–350 ms; narrative 400–600 ms; easing (0.2, 0.8, 0.2, 1); transform/opacity only; respect reduced-motion.
- Widget Micro-Interactions: subtle scale ≤1.02 + shadow; count-up ≤1.2 s (clamped); stagger 20–40 ms.
- Rotation Patterns: desktop wheel/arrow with inertia/snap; mobile swipe 30–50 px threshold + velocity cutoffs; forward/back semantics; progress affordance.
- Floating Chat: dock-origin (BR default/BL fallback) slide+fade+scale; minimize→bubble with unread; focus trap; ESC to close; restore focus; collision aware.
- Composition: title/metric/body/aside; inline media responsive + skeletons; agent persona pulse + speaking state.
- A11y/Perf: focus order + ARIA; CLS-safe; no layout thrash; content-visibility for heavy blocks.
- QA: ≥60 FPS feel; reduced-motion disables non-essential transforms; chat overlay above widgets, below modals unless active.

## Current State
- UI copy centralized: `REVX_UI` used across `AgentBubble`, `RevenuePulse`, `StackCarousel`.
- Progressive disclosure hook stubbed: `useProgressiveDisclosure.ts` with event bus publish planned.
- Docs updated across root files with spec and bus topic.

## Next Actions (Do These Next)
1) Rotating Revenue Widget
   - Implement rotating TOC cards (desktop: wheel/arrow; mobile: swipe) in `RevenuePulse.tsx` or new `RevenueWidget.tsx`.
   - Use transform-only animations (300–400 ms ease-out). Snap after each card.
   - Call `escalateToChat({ source: 'revenue-widget', cardId, title, metrics })` on CTA/tap.
2) Floating Chat Window
   - Create `ChatWindow.tsx` (glassmorphic, docked BR/BL). Animate slide+fade+scale from dock.
   - Minimize to bubble with unread badge; restore reverses animation.
   - Focus trap, ESC to close, restore focus to invoking element.
3) Progressive Disclosure Wiring
   - Implement `useProgressiveDisclosure.ts` to publish `progressive.open` and a consumer in Chat.
   - Ensure context persists across minimizes/restores.
4) A11y & Perf
   - Respect `prefers-reduced-motion` in all animations.
   - Verify hit targets ≥44px, keyboard path, and ARIA labels.
5) QA & Docs
   - Validate 360/768/1440/1920; mobile Safari/Chrome ≥60 FPS feel.
   - Update `WORKLOG.md` and docs with any deviations.

## How to Run (Windows PowerShell)
```powershell
# From repo root
npm --prefix .\riskill-cinematic install
npm --prefix .\riskill-cinematic run dev
# Preview
# http://localhost:5178/?revx=1
```

## Deploy
- GitHub: https://github.com/rolodexter/riskill-intro (branch main)
- Windsurf/Netlify: subdomain `riskill-zones-glass`, ProjectId `f30c7c0e-885a-45af-a2e0-b49512827417`, DeploymentId `a06b0cba-a9bf-4bfc-a4f9-2dc44b9b2620`

## Acceptance Criteria (Recap)
- Smooth rotation interactions with clear directional semantics and progress indicator.
- Chat summon/minimize/restore behaves consistently, no z-order issues, focus managed.
- Reduced-motion adheres across widget and chat.
- Lighthouse mobile ≥85 with background enabled.

## Notes
- Maintain doc-driven workflow: update `PROJECT_STRUCTURE.md`, `README.md`, `plan.md`, `WORKLOG.md` with any changes.
- Keep features gated under `?revx=1` until QA is green.
