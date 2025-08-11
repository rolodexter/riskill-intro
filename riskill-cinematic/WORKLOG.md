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

2025-08-10
- Completed: Fixed Revenue TOC anchoring and prevented card growth by introducing a fixed-height content well inside the card. Shell now clamps height (`min-h-[200px] lg:min-h-[220px]`, `p-4 lg:p-5`, `overflow-hidden`). TOC track is absolutely positioned within a `relative` well (`h-[88px] sm:h-[96px] lg:h-[110px]`, `overflow-visible`) so rotation uses transform/opacity only and never reflows layout. Pagination dots anchored to the well bottom.
- Completed: Normalized top-row widget heights via grid `items-stretch` and `CardWidget` `h-full`. Disabled card hover transforms for Revenue to avoid new stacking contexts while TOC animates.
- Completed: Gesture guardrails — wheel handler uses non-passive listener with scrollable-ancestor guard and debounce; swipe thresholds tuned; ArrowLeft/ArrowRight rotate; Enter escalates to chat.
- Completed: ChatWindow mobile bottom-sheet at ≤640px with ≥44px hit targets; reduced motion respected.
- Decisions: Keep card shell `overflow-hidden` to prevent bleed across adjacent widgets; allow inner TOC well `overflow-visible` to preserve card shadow aesthetics inside the shell.
- Next Steps: QA at 1440/1920 for equal heights; check 60fps while rotating; ensure Lighthouse + a11y remain ≥ targets.

2025-08-10 (full-panel Z-stack)
- Completed: Rebuilt Revenue widget TOC as full-panel Z-index stack. Static header strip (56px, z-10). Content well fills the rest via `height: calc(100% - 56px)`. Panels are `absolute inset-0`, identical size, and swap with depth crossfade (`opacity 0→1`, `scale 0.98→1`, 250–320ms, bezier(0.2,0.8,0.2,1)).
- Inputs: ArrowLeft/Right; wheel only when pointer is over the well (non-passive listener, scrollable ancestor guard, debounce); swipe threshold ~36px with velocity cutoff; Enter escalates to chat via `progressive.open`.
- A11y: Well has `role="group"` + `aria-roledescription="carousel"` and label "Revenue overview, slide X of Y". Only active panel focusable; others `aria-hidden`/`tabIndex=-1`. Live region announces slide changes. Reduced motion: crossfade only (no scale/translate).
- Perf: Transform/opacity only; `will-change: transform, opacity`; subtle shadows per depth; removed mobile backdrop-blur in `CardWidget` to avoid GPU cost.
- Layering: Header z-10; panels z-20; indicators/hints z-30. Widget footprint unchanged; zero CLS.
- Docs: Updated `PROJECT_STRUCTURE.md` (widget anatomy) and `README.md` (flag + controls). Created Save Point for this cut.
- Next Steps: Full QA desktop/mobile; verify Lighthouse and a11y; commit/push and redeploy behind `?revx=1`.

2025-08-10 (revx widget chat anchor)
- Completed: Replaced Enter key escalation with click/tap on active panel in `src/widgets/RevenuePulse.tsx`. Added hover/tap highlight and prevented Enter/Space default on the active button for clarity.
- Completed: Passed `anchorRect` + `primary` KPI via `useProgressiveDisclosure.escalateToChat()` context. Updated `ProgressiveContext` and Chat types.
- Completed: Anchored `ChatWindow` next to the widget using `anchorRect` with smart fallbacks (left/right/below + clamped to viewport). Mobile ≤640px uses full‑width bottom sheet. Header shows title + primary KPI. Removed placeholder body and added compact inline micro‑viz and metric tiles.
- Completed: Enforced fixed widget footprint by switching the content well to `overflow-hidden` and keeping all card transitions inside the fixed area. Added `cursor-pointer` on active panel.
- Docs: Updated `README.md` Revx section to reflect click/tap trigger and anchored messenger behavior.
- QA: Verified desktop placement, mobile bottom sheet, focus trap/ESC close, reduced motion compliance, and no scaling during card rotation.
- Next Steps: Create Save Point for this cut; commit and push; redeploy; run Lighthouse and a11y passes.

2025-08-10 (KPI UX polish)
- Completed: Tuned `RevenuePulse` Z-stack animation to keep next card behind at ~0.97 scale and ~0.85 opacity, with vertical translate offsets, subtle shadow depth, and cubic-bezier(0.2,0.8,0.2,1). Reduced motion uses crossfade only. All transitions remain inside fixed content well.
- Completed: Extended chat escalation context with `narrative` and rendered narrative block in `src/components/chat/ChatWindow.tsx`. Header shows title + primary.
- Fix: Removed unused `React` import from `src/components/icons/KPI.tsx` to satisfy TS build.
- Build: `npm run build` passes (tsc + vite). Ready for QA on localhost:5178 with `?revx=1`.
- Next Steps: Run dev server, QA widget transitions and chat narrative, then commit/push and redeploy.

2025-08-11 (Chat overlay anchoring)
- Completed: Introduced grid overlay inside `src/App.tsx` `<main>` as `#dashboard-overlay` (`absolute inset-0 z-[90]`). Marked app root `relative isolate` and main `relative` for correct stacking/offset context. Portaled `src/components/chat/ChatWindow.tsx` into the overlay using `createPortal`.
- Completed: Switched chat window/bubble from `fixed` to `absolute` within overlay, preserving transform/opacity-only animations and reduced-motion. Added pointer-events hygiene (overlay shell `pointer-events-none`, chat root `pointer-events-auto`).
- Completed: Rewrote placement to compute `top/left` relative to overlay rect with collision handling (prefer right of anchor; flip to left; center+below fallback; clamped). Added scroll/resize listeners and `ResizeObserver` (with TS-safe construction) and rAF batching.
- Completed: Mobile bottom-sheet keeps full-width and now accounts for on-screen keyboard via `visualViewport` offset. Min bubble anchored to overlay bottom-right.
- A11y: Added `aria-describedby` linking to narrative block; preserved dialog semantics, focus behaviors, and ESC/Minimize controls.
- Fix: TS lint error on optional `new ResizeObserver` call resolved.
- Next Steps: Full QA desktop/mobile, run Lighthouse + axe, update README/PROJECT_STRUCTURE, then commit, push, and redeploy behind `?revx=1`.

2025-08-11 (Chat as frameless GlassCard)
- Completed: Restyled `src/components/chat/ChatWindow.tsx` to match widget GlassCard aesthetics without a visible border: `rounded-2xl`, `bg-white/6–8`, `backdrop-blur-lg`, `ring-1 ring-white/[0.02]`, elevated shadow `shadow-[0_8px_28px_rgba(0,0,0,.28)]`.
- Completed: Unified paddings/typography: header/body/footer use `p-4 sm:p-5`; title `text-sm font-semibold tracking-[-0.01em]`; body `text-[13px] text-white/80`.
- Completed: Controls updated to shared style pattern: icon buttons `size-8 rounded-xl border border-white/10 bg-white/5 hover:bg-white/8`; input `h-11 rounded-xl bg-white/5 border-white/10` with focus rings; footer divider `border-white/5`.
- UX: Chat scroller has `overscroll-contain`; bottom-sheet composer adds `padding-bottom: env(safe-area-inset-bottom)`; will-change hints added; no layout thrash.
- Next: Consider transform-based translate placement, tokens for z-tiers, and grid scroller observer.
