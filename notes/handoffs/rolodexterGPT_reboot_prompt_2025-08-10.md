# Technical-to-Strategic Reboot Prompt — rolodexterGPT

Generated: 2025-08-10T22:59:25-07:00
Owner: rolodexterVS (Windsurf/Cascade)
Scope: Riskill Cinematic Overlay — Risk Index + Messenger Handoff + Disclosure UX Alignment

---

## 1) Implementation summary and technical achievements

- __Unified Messenger Handoff__
  - New `messengerHandoff()` in `src/utils/messenger.ts` standardizes the `progressive.open` contract and telemetry. Fields: `source`, `intent`, optional `faceId`, `cardId`, `title`, `primary`, `narrative`, `metrics`, `anchorEl/anchorRect`, `meta`.
  - Integrated into `src/ui/InlineDisclosureLink.tsx` and `src/ui/Disclosure.tsx` with a consistent “Discuss in Messenger →” footer in sheets; passes `glossaryKey`, `faceId`, `handoffSource`, `handoffMeta`.
  - Risk Index uses `messengerHandoff` for in-card “Open in Messenger →” and for all inline disclosures.

- __Disclosure UX Consistency__
  - Footer link + separator added to disclosure sheets; telemetry on open/close with reasons; singleton exclusivity respected. Portals render into `#dashboard-overlay` with viewport clamping and event swallowing.

- __Scroll-to-Rotate First-Right-of-Refusal__
  - `src/widgets/CardWidget.tsx`: added capture-phase native `wheel` listener with `{ passive: false, capture: true }`. Exposes `onWheel` prop; removes React `onWheel` on the wrapper to avoid double handling.
  - `src/widgets/RiskIndex.tsx`: moved wheel logic to card-level via `onWheel`; throttled by 220ms; prevents default only when rotation triggers. Touch flick retains prior behavior.

- __Risk Index Enhancements__
  - Inline disclosures now pass `faceId`, `handoffSource='risk-index'`, and `handoffMeta={ domainId, from }`.
  - `buildFaces()` wired to accept an `anchorEl` for accurate messenger placement.

- __A11y & Interaction__
  - Reduced-motion: crossfades maintained; disclosure pause/resume integrated with rotator via `disclosure.open`/`disclosure.close` events.

- __Files changed__
  - `src/ui/InlineDisclosureLink.tsx`: new props `faceId`, `handoffSource`, `handoffMeta`; footer link calls `messengerHandoff`.
  - `src/ui/Disclosure.tsx`: footer “Discuss in Messenger →” using `messengerHandoff`.
  - `src/utils/messenger.ts`: new helper and telemetry publish.
  - `src/widgets/CardWidget.tsx`: capture-phase wheel interception at card root; `ref` + `useEffect`.
  - `src/widgets/RiskIndex.tsx`: wheel handling migrated to `CardWidget.onWheel`; messenger links standardized; `buildFaces` anchor-aware.

- __Technical challenges & solutions__
  - Page scroll winning over widget rotation: solved by capture-phase, non-passive wheel listener on the card wrapper; consumers decide when to `preventDefault()`.
  - Avoiding duplicate wheel processing: removed React `onWheel` to prevent bubbling duplication; use a single native listener bridge.
  - Consistent messenger event contract across disparate components: centralized helper and normalized payload shape with anchor calculations.

- __Performance/A11y status__
  - No visible CLS observed during scroll/rotate in local QA.
  - No console warnings encountered after refactor.
  - Pending: Lighthouse and axe audits on deployed build; target to record metrics (CLS/LCP/INP/contrast/roles/tab order).

- __Testing & feedback__
  - QA expectations met locally:
    - While hovering card, first wheel notch cycles a face; page does not scroll.
    - Off-card, page scroll behaves normally.
    - Touch: quick vertical flick cycles; slow drag scrolls page.
    - Reduced-motion users get crossfade; no warnings.

---

## 2) Strategic insights and business implications

- __What worked better__
  - Capture-phase interception yields intuitive rotation without harming page scroll, improving perceived responsiveness and control.
  - Unified messenger handoff increases instrumentation quality and simplifies future integrations.

- __What underperformed__
  - Gauge view deferred; numeric + stacked faces sufficient MVP but visual storytelling is limited; plan phased enhancement.

- __New opportunities__
  - Normalized `messengerHandoff` enables targeted campaigns (“breakdown” threads per domain), templated summaries, and contextual deep-links.
  - Shared scroll interception pattern can be adopted by Operations and other stacked widgets for consistent UX.

- __Potential pivots/limits__
  - Wheel throttling and preventDefault must remain conservative to avoid page scroll hijacking; design docs should set guardrails.
  - Anchor-based chat placement depends on overlay mount stability; any layout changes must preserve `#dashboard-overlay` semantics.

---

## 3) Documentation requirements and communication needs

- __Technical specs to update__
  - Event contract spec for `progressive.open` and `messengerHandoff` parameters.
  - Widget interaction spec: scroll-to-rotate capture policy, throttle values, reduced-motion behavior.
  - Disclosure standard: footer link, telemetry reasons, portal target, singleton rules.

- __User/ops guidance__
  - How to open contextual Messenger from disclosures and from Risk Index faces.
  - Accessibility notes: keyboard focus, screen reader labels for Risk Index, reduced-motion expectations.

- __Integration guides__
  - “How to add messenger handoff to a new widget” using `InlineDisclosureLink` and `messengerHandoff` (code snippets, payload examples).

- __Process improvements__
  - Add Lighthouse/axe audit scripts and CI thresholds.
  - Template for QA checklists covering scroll interception, disclosures, and messenger placement.

---

## 4) Stakeholder context and feedback integration

- __Stakeholder inputs__
  - UX approved Risk Index copy, thresholds, ARIA. Direction to replace bottom CTA with inline links; stacked faces parity with Operations.
  - Request to make widget rotation win over page scroll while hovered.

- __Integrations__
  - ChatWindow listens for `progressive.open`; alignment validated with new helper. Event bus unchanged.

- __Collaboration patterns__
  - Portaled overlays and event swallowing coordinated with widget teams to avoid focus/scroll leaks.

- __Approvals__
  - Risk Index rename and numeric-first approach accepted. Gauge view queued.

---

## 5) Strategic guidance requests and next priorities

- __Decisions needed__
  - Confirm throttle (220ms) and delta normalization policy for wheel events.
  - Approve messenger payload fields as v1 contract (any additions before wider rollout?).
  - Decide on timing for gauge view and drilldown visual polish.

- __Immediate next steps__
  - Run Lighthouse and axe on deployed preview; record metrics in `WORKLOG.md`; triage/fix critical issues.
  - Extend capture-phase wheel interception to any remaining stacked widgets (verify Operations parity).
  - Write/commit docs: event contract, disclosure standard, integration guide; update `README.md`, `PROJECT_STRUCTURE.md`, `WORKLOG.md`.
  - Validate telemetry ingestion/dashboards for `risk.index.refresh`, `risk.drilldown.open`, `risk.scroll.cycle`, and messenger open events.
  - Deploy to Netlify and notify stakeholders with preview URL and audit results.

- __Cross-functional coordination__
  - UX: review of scroll feel, reduced-motion transitions, and disclosure footer microcopy.
  - Accessibility: confirm focus order and screen-reader narrative in Risk Index faces and drilldown modal.
  - Data/Analytics: confirm event schemas and dashboards.

---

### References
- `src/utils/messenger.ts`
- `src/ui/InlineDisclosureLink.tsx`
- `src/ui/Disclosure.tsx`
- `src/widgets/CardWidget.tsx`
- `src/widgets/RiskIndex.tsx`
- Overlay root: `index.html` mount `#dashboard-overlay`

