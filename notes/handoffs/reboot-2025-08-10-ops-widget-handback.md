# Technical-to-Strategic Reboot Prompt for rolodexterGPT

You are rolodexterGPT. Assume ownership of the Riskill Cinematic project and continue execution from the precise state below. Use this prompt as an authoritative handback of technical context and strategic implications. Maintain the narrative-first UX intent for executive audiences.

---

## 1) Implementation summary and technical achievements

- __Full-bleed Operations deck__
  - Implemented a vertical stacked card carousel in `src/widgets/Operations.tsx` with these states: Summary, Incidents, Performance, Forecast.
  - Full-surface animation: `CardWidget` gained `chrome="none"` to render the deck as a frameless, full-bleed card. See `src/widgets/CardWidget.tsx`.
  - Parallax depth: two ghost layers behind the active card with subtle scale/translate/opacity; `pointer-events-none` to avoid interception.
  - Navigation: mouse wheel/trackpad and pointer-based vertical flicks; infinite loop; auto-rotate (≈7s) with pause on hover or manual interaction; bottom-right page indicator (N / M).
  - Accessibility: deck container uses `role="region"`, `aria-label="Operations deck"`; respects reduced-motion by crossfading.

- __Input handling fixes__
  - Wheel listener bound natively on `deckRef` with `{ passive: false, capture: true }` to reliably call `preventDefault()` and stop document scrolling while rotating pages.
  - Delta normalization: handles `deltaMode` 0/1/2 for pixel/line/page devices; small threshold to catch high-resolution wheels/trackpads.
  - Telemetry events: `ops.scroll.wheel` (with delta/mode) and `ops.scroll.cycle` (from/to keys) emitted via `src/widgets/bus.ts`.

- __Overlay & GlassCard integration__
  - ChatWindow is portaled into in-grid overlay `#dashboard-overlay`; overlay root is `pointer-events-none` with an interactive subtree; rAF-batched anchoring updates; mobile bottom sheet ≤640px; keyboard-safe. See `src/components/chat/ChatWindow.tsx` and overlay components referenced from intro/dashboard scenes.
  - Visual parity with GlassCard tokens, shared widget styles.

- __Deployment__
  - Windsurf review site live: https://riskill-chat-overlay.windsurf.build (config at `windsurf_deployment.yaml`, project_id `4f899b16-7efd-48f0-8867-9860d6b8154b`). Latest redeploy triggered 2025-08-10 local time.
  - Background asset installed: `public/assets/bg/nature-vista-dark.jpg` (Pexels), referenced via `/assets/bg/nature-vista-dark.jpg`.

- __Performance posture__
  - Transform/opacity-only motion; fixed card height prevents CLS; `overscroll-contain` on the deck wrapper; pointer layering avoids hit-testing cost.
  - Console is clean on the review site (previous validation). Formal Lighthouse/axe pending.

- __Testing & feedback__
  - Manual: wheel rotation now works; flick gestures remain functional; page indicator updates; auto-rotate pauses on hover/interaction.
  - Prior issue: wheel did not rotate; resolved by capture-phase, non-passive handler, and delta normalization.

## 2) Strategic insights and business implications

- __Works better than expected__
  - Full-bleed framing increases perceived cohesion; parallax depth adds polish without distracting.
  - Capture-phase wheel handling stops document scroll reliably, improving perceived control.

- __Needs product copy and framing__
  - Idle “book cover” and hover AI blurb are not yet implemented; these are essential for first-touch narrative and inclusivity across exec backgrounds.
  - Micro-narratives should be constrained to ≤15 words with plain-first, optional technical parentheticals.

- __Capabilities unlocked__
  - Progressive disclosure to chat via widget bus topic `progressive.open` enables guided “chapter entry” into Messenger with context.
  - Deck pattern can be reused for other widgets for consistent storytelling.

- __Limitations / risks__
  - Cross-device wheel/trackpad variability handled but should be re-validated after Lighthouse/axe runs and on low-power hardware.
  - Density system not yet global; compact tokens need centralization before scaling widget library.

## 3) Documentation requirements and communication needs

- __Update technical docs__
  - `PROJECT_STRUCTURE.md`: overlay portal rationale, pointer-events layering, capture-phase input model, card stack anatomy, density tokens plan.
  - `README.md`: deployment notes (Windsurf config, review URL), local dev steps, reduced-motion behavior.
  - `WORKLOG.md`: add Lighthouse/axe audit results and remediation checklist.
  - API/bus docs: `progressive.open` topic contract (payload, source widget context, chat prefill semantics).

- __User guidance__
  - Brief onboarding: how to interact with the deck (wheel/swipe), what the indicator means, how to enter “first page” modal.
  - Copy guidelines: ≤15-word micro-narratives, plain-first phrasing, optional technical qualifiers.

- __Process improvements__
  - Add regression checklist for input handling (wheel/trackpad/touch) and reduced-motion verification.
  - Standardize density tokens and Tailwind utilities for compact mode across widgets.

## 4) Stakeholder context and feedback integration

- __Stakeholder signals__
  - Executive audience requires inclusive first-touch: “book cover” idle, plain-language hover blurb, and purposeful first click.
  - Live review URL is used for async review; previous feedback confirmed rendering correctness and clean console.

- __Integration points__
  - Chat handoff via `progressive.open` (progressive disclosure to Messenger with context).
  - Future enterprise system name-drops in hover copy (ERP, CRM, ITSM) are content-only; no current data integrations required.

- __Approvals & flows__
  - Continue Windsurf deploys; claim site on Netlify for detailed logs if a build fails.
  - Keep notes/savepoints current; latest savepoint exists at `notes/savepoints/2025-08-10/savepoint-2025-08-10-revx-widget-chat.md`.

## 5) Strategic guidance requests and next priorities

- __Decisions needed__
  - Narrative length policy: finalize ≤15-word limit and tone rules (plain-first, optional technical).
  - Keyboard affordance policy: remain mouse/touch-only for deck rotation, but clarify focus/activation semantics for a11y.
  - Domain consolidation strategy for demos (keep Windsurf subdomain or consolidate under a branded domain).

- __Immediate next tasks__
  1. Implement idle “book cover” state with copy framing Riskill AI as storyteller/bridge.
  2. Implement hover AI bubble with opening hook copy and rotating enterprise name-drops.
  3. Implement first-click intro modal with “first page” copy and fork options (uptime, backlog, SLA) that opens Messenger via `progressive.open`.
  4. Trim/author micro-narratives to ≤15 words; verify hierarchy: headline, secondaries, microtext.
  5. Run Lighthouse and axe on the live build; record results in `WORKLOG.md`; address critical issues and redeploy.
  6. Introduce global compact density tokens and utilities; refactor shared card styles.

- __Validation & metrics__
  - Target a11y score ≥95, no CLS, 60fps motion on mid-tier devices, zero console warnings, consistent wheel/flick behavior across Windows/Chromium, macOS/Safari, and Android/iOS.

---

### Reference file paths
- Deck implementation: `src/widgets/Operations.tsx`
- Widget base: `src/widgets/CardWidget.tsx`
- Overlay/Chat: `src/components/chat/ChatWindow.tsx`, `src/scenes/**`, `src/components/revx/**`
- Motion tokens: `src/core/motion/*`
- Deployment config: `windsurf_deployment.yaml`
- Background asset: `public/assets/bg/nature-vista-dark.jpg`
- Bus: `src/widgets/bus.ts`
- Savepoint: `notes/savepoints/2025-08-10/savepoint-2025-08-10-revx-widget-chat.md`

### Deployment context
- Review site: https://riskill-chat-overlay.windsurf.build
- Project ID: `4f899b16-7efd-48f0-8867-9860d6b8154b`

Please proceed to: finalize narrative assets (idle/hover/first-click), run audits, and prepare a short demo script for the deck + chat flow. Preserve transform/opacity-only motion, ensure no CLS, and favor capture-phase input handling.
