# Save Point Reboot Prompt — rolodexterVS x Joe

You are rolodexterVS (Windsurf/Cascade). Use this Save Point as the first message in a new chat to resume the Riskill Cinematic project with Joe without losing continuity. This prompt captures working memory, task flow, files, constraints, naming, and unresolved threads as of 2025-08-10T20:11:16-07:00.

---

## 1) Session snapshot and working memory

- __Project__: Riskill Cinematic (marketing/demo app with chat overlay + cinematic widgets)
- __Root__: `c:\Users\rolod\OneDrive\riskill-intro\riskill-cinematic`
- __OS__: Windows; prefer PowerShell command separators (`;`), avoid Unix `&&`.
- __Active widget__: Operations — full-bleed vertical stacked card carousel.
- __Live review site__: https://riskill-chat-overlay.windsurf.build (Netlify via Windsurf). Project ID in `windsurf_deployment.yaml`.
- __Recent success__: Mouse wheel rotation now works; delta normalization added; capture-phase non-passive handler prevents page scroll.
- __Current goal__: Add idle “book cover”, hover AI bubble, and first-click intro modal for Operations deck.

## 2) Task flow — done vs next

- __Done__
  - Full-bleed deck (`chrome="none"` in `CardWidget`) with parallax ghost layers.
  - Wheel + touch flick navigation; infinite loop; indicator N/M; auto-rotate with pause on hover/interact.
  - Accessibility: `role="region"`, `aria-label="Operations deck"`; reduced-motion crossfade.
  - Mouse wheel fix: capture-phase, `passive:false`, `preventDefault()`, `deltaMode` normalization.
  - Telemetry events: `ops.scroll.wheel`, `ops.scroll.cycle` via bus.
  - Live redeploy initiated; previous deploy validated clean console.

- __Next__
  1. Implement idle “book cover” copy framing Riskill AI as storyteller/bridge.
  2. Implement hover AI bubble with opening hook copy and rotating enterprise name-drops (ERP, CRM, ITSM, etc.).
  3. Implement first-click intro modal with “first page” copy and fork options (uptime, backlog, SLA), opening Messenger via `progressive.open`.
  4. Trim micro-narratives to ≤15 words; plain-first tone, optional technical in parentheses.
  5. Run Lighthouse and axe on live build; record results in `WORKLOG.md`; fix critical issues; redeploy.
  6. Introduce global compact density tokens/utilities; refactor shared card styles.

## 3) Relevant files and modules

- __Operations deck__: `src/widgets/Operations.tsx`
  - Wheel handler bound on `deckRef` in capture phase; normalized deltas; `overscroll-contain` wrapper.
  - Ghost depth layers: subtle scale/translate/opacity; `pointer-events-none`.
  - Auto-rotate timing; indicator rendering; typography hierarchy.

- __Card base__: `src/widgets/CardWidget.tsx` — `chrome: "default" | "none"` enables full-bleed.
- __Widget bus__: `src/widgets/bus.ts` — emits `ops.scroll.wheel`, `ops.scroll.cycle`, `progressive.open` (for chat handoff).
- __Telemetry (if present)__: `src/utils/telemetry.ts` — helper; logs kept minimal in prod.
- __Motion tokens__: `src/core/motion/*` — timings and variants used by widgets.
- __Overlay/Chat__: `src/components/chat/ChatWindow.tsx`, `src/components/revx/*`, `src/scenes/**` — overlay portal with pointer-events pattern and rAF-batched anchoring.
- __Deploy config__: `windsurf_deployment.yaml` — framework `create-react-app`, project ID for Windsurf deploys.
- __Background asset__: `public/assets/bg/nature-vista-dark.jpg`.
- __Save/Handoff notes__:
  - Handoff: `notes/handoffs/reboot-2025-08-10-ops-widget-handback.md` (technical-to-strategic)
  - Prior savepoint: `notes/savepoints/2025-08-10/savepoint-2025-08-10-revx-widget-chat.md`

## 4) Interaction model and a11y/perf constraints

- __Movement__: transform/opacity only; fixed card height; no CLS.
- __Scroll capture__: wheel listener `{ capture: true, passive: false }` on deck; call `preventDefault()`; deck surface is `absolute inset-0` with `pointer-events-auto` and `overscroll-contain`.
- __Touch__: pointer-based vertical flick with distance/velocity thresholds.
- __Keyboard__: rotation disabled (no tabIndex on deck); keep accessibility semantics for region/title.
- __Reduced motion__: crossfade only; respect prefers-reduced-motion.
- __Targets__: a11y ≥ 95, 60fps on mid-tier devices, zero console warnings.

## 5) Naming conventions and topics

- __Pages array__: `summary | incidents | performance | forecast` keys.
- __Card chrome__: `chrome="none"` = full-bleed.
- __Telemetry/bus topics__: `ops.scroll.wheel`, `ops.scroll.cycle`, `progressive.open`.
- __Density__: upcoming global compact tokens/utility classes.
- __Savepoints__: `notes/savepoints/YYYY-MM-DD/savepoint-YYYY-MM-DD-<slug>.md`.

## 6) System and process constraints

- __Windows PowerShell__: chain with `;` not `&&`. Avoid `cd` in commands; specify CWD.
- __Deploys__: Use Windsurf deploy with saved project ID. Only check build status on request.
- __Edits__: Prefer transform/opacity; no heavy layout changes; preserve fixed heights.

## 7) Unresolved threads / risks

- Idle/hover/first-click flows not yet implemented; content/copy needed.
- Micro-narratives must be trimmed to ≤15 words while preserving clarity for execs.
- Global density system not centralized; risk of inconsistency across widgets.
- Cross-device wheel/trackpad variability addressed but needs audit across browsers.
- Domain consolidation decision pending for demos.

## 8) How to resume (rolodexterVS)

- __Verify deploy__: Open the review URL and test wheel + flick on Operations deck.
- __Audits__: Run Lighthouse and axe; log results in `WORKLOG.md` and fix critical issues.
- __Build features__: Implement idle/hover/first-click flows; wire `progressive.open` to Messenger entry.
- __Docs__: Update `PROJECT_STRUCTURE.md` and `README.md` with overlay/portal rationale, deployment notes, and savepoint/handoff workflow.
- __Commit & deploy__: Use PowerShell-safe git commands; redeploy via Windsurf.

## 9) Quick PowerShell command palette (reference)

```powershell
# From project root: c:\Users\rolod\OneDrive\riskill-intro\riskill-cinematic

# Stage & commit
git add -A
git commit -m "Savepoint + Ops deck updates"

# Push
git push

# (Deploy is handled via Windsurf deploy step in the assistant, using saved project ID)
```

## 10) Roles and assignments

- __Joe__: product owner and reviewer; provides copy and acceptance criteria.
- __rolodexterVS (Windsurf/Cascade)__: implement features, run audits, deploy, maintain savepoints/handbacks.
- __rolodexterGPT__: strategic handback consumer; prepares docs/presentations; updates policy decisions.

---

When you paste this Save Point as the first message in a new chat, immediately: (1) confirm live deploy health, (2) open `src/widgets/Operations.tsx` to continue implementing idle/hover/first-click flows, and (3) schedule Lighthouse/axe runs with results recorded in `WORKLOG.md`.
