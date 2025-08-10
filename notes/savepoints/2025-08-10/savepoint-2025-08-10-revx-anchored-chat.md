# Save Point — 2025-08-10 — Revx Anchored Chat

## Scope
Refine Revenue widget layout and progressive disclosure: click/tap trigger, fixed card footprint, and contextual messenger anchored next to the widget on desktop; bottom-sheet on mobile.

## Changes
- RevenuePulse (`src/widgets/RevenuePulse.tsx`)
  - Click/tap anywhere on active panel escalates (replaces Enter).
  - Prevent Enter/Space default on active panel to avoid accidental escalation.
  - Passed `anchorRect` + `primary` KPI to escalation context.
  - Content well switched to `overflow-hidden` to maintain fixed footprint; added `cursor-pointer` to active card.
- Progressive Context (`src/hooks/useProgressiveDisclosure.ts`)
  - Extended `ProgressiveContext` with `primary` and `anchorRect`.
- ChatWindow (`src/components/chat/ChatWindow.tsx`)
  - Anchors next to widget using `anchorRect` with right/left/below fallbacks and viewport clamps.
  - Mobile ≤640px: full-width bottom sheet (80vh). 
  - Header shows title + `primary` KPI; compact tiles for metrics; inline micro-viz; glassmorphic theme.
  - Focus trap, ESC close, reduced-motion respected.
- Docs
  - README Revx section updated (click/tap trigger, anchored messenger, mobile sheet).
  - WORKLOG entry added.

## QA Checklist
- Click/tap on Revenue card opens messenger adjacent to the widget on desktop.
- On ≤640px width, chat opens as full-width bottom sheet; hit targets ≥44px.
- Card stack rotates inside fixed footprint; no growth/shrink on transition; no overflow bleed.
- A11y: only active panel focusable; role="dialog" aria-modal chat; ESC closes and restores focus.
- Reduced motion: transform/opacity only; timings 250–320ms; no nonessential pulses.
- Layering: chat > overlays > widgets; tooltips/menus within chat when active.

## How to Preview
- Feature flag: append `?revx=1` to the URL.
- Local dev: http://localhost:5178/?revx=1 (already running).

## Next
- Commit, push, and redeploy to Windsurf/Netlify.
- Lighthouse mobile ≥85; quick a11y pass.
