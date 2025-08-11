# Technical-to-Strategic Reboot Prompt — Riskill Cinematic (Operations Deck)

This prompt transfers implementation state, architectural discoveries, and strategic context from rolodexterVS (Windsurf/Cascade) to rolodexterGPT for immediate continuation.

Time: 2025-08-10T21:26:15-07:00
Repo root: `c:/Users/rolod/OneDrive/riskill-intro/riskill-cinematic`
Live preview: https://riskill-chat-overlay.windsurf.build

---

## 1) Implementation summary and technical achievements

- **Disclosure tooltip fix (viewport clipping + isolation)**
  - Files: `src/ui/Disclosure.tsx`, `index.html`, `src/widgets/CardWidget.tsx`.
  - Implemented portal rendering via `createPortal` into `#dashboard-overlay` to eliminate tooltip clipping by parent overflow.
  - Added fixed-position measurement with viewport clamping and vertical flip to keep tooltip fully visible.
  - Tooltip re-measures on open and closes on window scroll/resize to avoid stale coordinates.
  - Framer Motion fade/slide animations retained; tooltip uses `pointer-events: none` when appropriate.

- **Event swallowing and click isolation**
  - All pointer, mouse, touch, and key interactions on the ⓘ button call `preventDefault()` and `stopPropagation()` to avoid bubbling into underlying card surfaces.
  - Added `data-disclosure` attribute to the ⓘ button; card root click handler ignores clicks where `event.defaultPrevented` is true or where `event.target.closest('[data-disclosure]')` matches.
  - Keyboard handling: Enter, Space, and `?` open the explainer sheet while consuming the event.

- **Global exclusivity for disclosures**
  - Introduced a singleton `closeLast` in `src/ui/Disclosure.tsx` so only one disclosure (tooltip or sheet) is open across the app at any time.
  - Hover/focus and click paths route through `openTipExclusive()` / `openSheetExclusive()` helpers for consistent exclusivity.

- **Overlay root added**
  - `index.html`: Added `<div id="dashboard-overlay"></div>` alongside `#root` to host all portaled tooltips/sheets globally.

- **Build and deployment**
  - Local TypeScript + vite production build succeeded.
  - Redeploy triggered to Windsurf (Netlify) using saved project ID; site will be live at: https://riskill-chat-overlay.windsurf.build

- **Technical challenge resolved**
  - TS error (TS2554) in `Disclosure.tsx` due to passing event args to zero-arg long-press callbacks — fixed by removing args.

- **Telemetry**
  - Existing `disclosure.open` and related events preserved; click/hover/focus/longpress paths track `tooltip` vs `sheet` opens.

- **Testing outcomes**
  - Local smoke test confirmed build success; console clean in prior deployment.
  - Live verification pending current deploy completion.
  - Lighthouse/axe audits planned post-deploy (not yet executed).

- **Performance notes**
  - Smooth transform/opacity transitions are preserved.
  - No known runtime regressions observed in local test; formal metrics pending Lighthouse run.

---

## 2) Strategic insights and business implications

- **What worked well**
  - Portaling tooltips to a global overlay root eliminated clipping while maintaining visual polish and accessibility semantics.
  - Strict event swallowing on the ⓘ control, plus card-level guards, reliably prevent double-activation (no more “two windows”).

- **Trade-offs / constraints**
  - Singleton exclusivity is simple and reliable now; if multiple independent disclosure regions are needed simultaneously in the future, a scoped manager or context may be preferable.
  - Scroll/resize close behavior avoids stale positioning but can feel abrupt for prolonged reading; consider repositioning on scroll if needed.

- **Opportunities unlocked**
  - The overlay root enables broader use of global UI (toasts, spotlight, cross-card sheets) without container clipping.
  - Unified disclosure pattern can be rolled out across cards with consistent a11y and analytics.

- **UX implications**
  - Clearer interaction boundaries improve user trust and reduce cognitive load (ⓘ actions are now predictable and isolated).
  - Coarse vs fine pointer adaptation (long-press to sheet on touch, hover tooltip on desktop) aligns with user intent and accessibility.

---

## 3) Documentation requirements and communication needs

- **Technical specs to update**
  - `PROJECT_STRUCTURE.md`: Document `#dashboard-overlay` rationale, placement, and usage patterns.
  - `README.md`: Note the disclosure portal approach and how to add new glossary-driven disclosures.
  - `WORKLOG.md`: Record the disclosure fix, TS error resolution, redeploy details, and upcoming Lighthouse/axe plan/results.

- **Developer guidance**
  - How to add a disclosure: use `Disclosure` with a `glossaryKey`, ensure ⓘ host gets `data-disclosure` (component already sets it), and avoid wrapping containers that intercept pointer events.
  - How to integrate new glossary entries: update `src/glossary/registry.ts` and supply concise, plain-first microcopy.

- **API/Integration docs**
  - Bus/telemetry: Document `disclosure.open`, `ops.scroll.wheel`, `ops.scroll.cycle`, and any payload contracts in a short integration guide.

- **Process improvements**
  - Add E2E tests (Playwright/Cypress) to assert: no bubbling from ⓘ to card; tooltip clamps to viewport; only one disclosure is open.
  - Add an a11y checklist for portaled components (focus management, aria, escape/close patterns).

---

## 4) Stakeholder context and feedback integration

- **Stakeholders**
  - Product/design: prioritizing polished, accessible UI with minimal clutter and cinematic depth.
  - Eng: strict linting/TypeScript, perf goals (60fps target), clean console, accessible interactions.

- **Feedback**
  - Preference for proactive pings when a new preview is live; provide URL and short verification checklist.
  - Keyboard shortcuts for disclosure not desired at this time beyond basic keys on the ⓘ control.

- **Integrations**
  - Windsurf/Netlify deployment pipeline stable; use saved project ID for redeploys.
  - Glossary registry (`src/glossary/registry.ts`) is the unified content source for disclosure copy.

- **Approval workflow**
  - Share preview URL, run Lighthouse/axe, record results, fix critical issues, then request sign-off.

---

## 5) Strategic guidance requests and next priorities

- **Decisions needed**
  - Endorse the singleton disclosure model vs. investing in a scoped disclosure manager now.
  - Confirm close-on-scroll behavior vs. implementing dynamic reposition on scroll.
  - Define acceptance criteria for a11y (axe) and performance (Lighthouse) thresholds.

- **Immediate next actions**
  1) Verify live preview: tooltip clamp, no double-activation, a11y attributes correct.
  2) Run Lighthouse and axe on the live site; add results to `WORKLOG.md` and create tasks for any critical issues.
  3) Roll out the unified disclosure pattern across remaining Operations card faces using the glossary registry.
  4) Draft short developer guide for disclosures and overlay usage in `PROJECT_STRUCTURE.md`.

- **Upcoming feature threads** (from current plan)
  - Idle “book cover” copy framing Riskill AI as storyteller/bridge.
  - Hover AI bubble with rotating enterprise name-drops.
  - First-click intro modal with fork paths, wired to Messenger via `progressive.open`.
  - Global compact density tokens/utilities; refactor shared card styles.

- **Risks and mitigations**
  - Missing `#dashboard-overlay` in other entry points: add a lint/check or runtime assert.
  - Event swallowing affecting unforeseen nested controls: maintain `[data-disclosure]` scoping and add E2E coverage.
  - Future multi-disclosure needs: plan for a DisclosureManager if requirements expand.

---

### References
- Key files:
  - `src/ui/Disclosure.tsx`
  - `src/widgets/CardWidget.tsx`
  - `index.html`
  - `src/glossary/registry.ts`
  - `src/ui/useLongPress.ts`
- Deployment config: `windsurf_deployment.yaml` (project ID cached; framework create-react-app)
- Live site: https://riskill-chat-overlay.windsurf.build

---

This reboot prompt equips rolodexterGPT with the full implementation, architectural, and strategic context to proceed with audits, documentation updates, and the next phase of UI polish and narrative features.
