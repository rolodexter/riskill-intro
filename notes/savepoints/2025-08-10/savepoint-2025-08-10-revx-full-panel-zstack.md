# Save Point — 2025-08-10 — Revx Full‑Panel Z‑Stack

## Summary
- Rebuilt Revenue widget TOC into a full‑panel Z‑stack.
- Static header strip (56px) remains; body swaps panels using transform/opacity only.
- Panels are absolute full‑bleed inside the content well; identical size; only the active panel is interactive and in the a11y tree.
- Inputs: Arrow keys; wheel only over well (debounced, guarded); swipe threshold ≈36px with velocity cutoff; Enter escalates to chat via `progressive.open`.
- A11y: `role="group"`, `aria-roledescription="carousel"`, live label “Revenue overview, slide X of Y”, only active panel focusable; reduced motion uses crossfade only.
- Perf: `will-change: transform, opacity`; subtle shadows per depth; removed mobile backdrop‑blur in `CardWidget`.
- Layering: header z-10, panels z-20, indicators/hints z-30.

## Files
- `src/widgets/RevenuePulse.tsx`: full‑panel stack, panels definition (Overview, Composition, Rules), gestures, a11y, indicators, fading footer hints.
- `src/widgets/CardWidget.tsx`: mobile blur removal; optional `headerHeight` prop; stable shell.
- `WORKLOG.md`, `PROJECT_STRUCTURE.md`, `README.md`: updated to document anatomy, controls, and flags.

## Testing Notes
- URL flag: `?revx=1`.
- Verify equal top‑row heights at 360/768/1440/1920.
- Check ArrowLeft/Right, wheel over well, swipe threshold (~36px), and Enter → chat escalation.
- Toggle reduced motion: should crossfade only.
- Confirm 60fps feel, no CLS, no console warnings.

## Next
- Final QA sweep (desktop/mobile, a11y, perf) → commit, push, and deploy to `riskill-zones-glass`.
