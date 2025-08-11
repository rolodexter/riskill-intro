# Save Point — Conversation Reboot Prompt (rolodexterVS × Joe)

Date: 2025-08-10
Repo: C:\Users\rolod\OneDrive\riskill-intro
Project: riskill-cinematic (Vite + React + TypeScript + Tailwind + Framer Motion)
Dev URL: http://localhost:5178/?revx=1 (strictPort)
Live URL: https://riskill-zones-glass.windsurf.build/?revx=1
Deploy: Windsurf/Netlify (ProjectId f30c7c0e-885a-45af-a2e0-b49512827417, subdomain riskill-zones-glass)
Workflow: Doc-driven (PROJECT_STRUCTURE.md, README.md, WORKLOG.md). Save Points in `notes/savepoints/`.

---

You are rolodexterVS (Windsurf/Cascade). Reboot this session using the snapshot below. Continue execution without losing context. Joe is the product/UX partner. Maintain brevity and executive-grade quality.

## 1) Working memory snapshot — Objective and status

- **Objective**: KPI Widget UX Refactor and Animation. Align all KPI widgets to new UX writing and interaction spec. Finalize RevenuePulse Z‑stack motion. Extend ChatWindow to support narrative. Prepare for full QA and deployment.
- **Status**:
  - RevenuePulse Z‑stack animation implemented and tuned; fixed widget dimensions; transform/opacity only; reduced-motion crossfade.
  - ChatWindow supports `narrative` text and anchors adjacent to the invoking widget using `anchorRect`; mobile bottom‑sheet fallback.
  - Click/tap only escalation enforced (keyboard Enter/Space disabled on cards via `CardWidget`).
  - Build clean; deployed to Windsurf/Netlify at the URL above.

## 2) Task flow — what’s done vs. pending

- **Completed**
  - Refined `RevenuePulse` transitions and layering.
  - Progressive disclosure bus `progressive.open` with `ProgressiveContext` including `narrative`.
  - ChatWindow narrative rendering; anchored placement with fallbacks; a11y (role=dialog, aria-modal, focus trap, ESC close, focus restore).
  - Removed unused imports; successful `npm run build`; deployment live.
  - Handoff prompt created at `notes/handoffs/2025-08-10/rolodexterGPT-reboot-prompt.md`.

- **Pending / Unresolved threads**
  - Full QA: desktop/mobile, reduced-motion, keyboard navigation, hit targets ≥44px, inner scroll guards.
  - Lighthouse + a11y audits; address issues (contrast, semantics, motion preferences).
  - Narrative length policy (truncate vs. expandable “Read more”).
  - Keyboard affordances outside cards (keep click/tap-only on cards).
  - Anchoring heuristics edge cases (collision buffers, placement priorities).
  - Consistency pass for micro‑viz (sparklines, scales, colors, empty states).
  - Optionally claim Netlify site for logs/settings.

## 3) System constraints and design decisions

- **Motion/perf**: Only transform + opacity; `cubic-bezier(0.2,0.8,0.2,1)`; durations ~250–320ms; no layout shifts; respects `prefers-reduced-motion` (crossfade).
- **Layout**: Strict fixed widget dimensions; `overflow-hidden` in content well; all transitions remain inside well.
- **Interaction**: Click/tap triggers messenger escalation; keyboard Enter/Space disabled on cards; arrow/wheel/swipe rotate slides where applicable.
- **Accessibility**: Dialog a11y with focus trap, ESC; label/roledescription for carousel wells; live region for slide changes.

## 4) Naming conventions and key symbols

- **Components**: `RevenuePulse`, `OpsHealth`, `RiskAlerts`, `AgentActivity`, `CardWidget`, `ChatWindow`.
- **Hooks/Bus**: `useProgressiveDisclosure.escalateToChat(ctx)`, topic `progressive.open`.
- **Types**: `ProgressiveContext` (title, primary, metrics, anchorRect, narrative).
- **Content**: KPI content config in `src/content/kpi.ts` (with `narrative`).

## 5) Relevant project files (authoritative)

- Widgets: `src/widgets/RevenuePulse.tsx`, `src/widgets/OpsHealth.tsx`, `src/widgets/RiskAlerts.tsx`, `src/widgets/AgentActivity.tsx`, `src/widgets/CardWidget.tsx`
- Chat: `src/components/chat/ChatWindow.tsx`
- Hook/Event: `src/hooks/useProgressiveDisclosure.ts`, `src/widgets/bus.ts`
- Content: `src/content/kpi.ts`, `src/content/revx.ts`
- Telemetry: `src/utils/telemetry.ts`
- Landing shell: `src/components/landing/*`, `src/App.tsx`
- Styles/Config: `tailwind.config.js`, `src/index.css`, `vite.config.ts`
- Docs: `PROJECT_STRUCTURE.md`, `README.md`, `WORKLOG.md`
- Deploy: `windsurf_deployment.yaml`, `netlify.toml`

## 6) Agent assignments

- **rolodexterVS (you)**: Implementation, QA, code edits, local runs, deploy orchestration, doc updates.
- **Joe**: Product/UX owner; provides acceptance criteria, approves UX/animation, reviews live build.
- **rolodexterGPT**: Strategic guidance, cross-team alignment, roadmap/decision framing (handoff prompt prepared).

## 7) Immediate commands and runbook

- **Local**: `npm run dev` at `riskill-cinematic/` → open `http://localhost:5178/?revx=1`.
- **Build**: `npm run build` (tsc -b && vite build).
- **Deploy**: Use saved config `windsurf_deployment.yaml` for projectId and framework if redeploying.

## 8) Acceptance checklist for this cut

- RevenuePulse Z‑stack matches spec (next card ~0.97 scale, ~0.85 opacity; subtle vertical offsets; shadow depth).
- Click/tap escalation only from active panel; keyboard disabled on cards; telemetry events present.
- ChatWindow anchored correctly with fallbacks; mobile bottom‑sheet works; focus trap/ESC close verified.
- Reduced-motion path uses crossfade only; no translate/scale.
- No CLS; perf feels 60fps; console clean.

## 9) Next actions on resume

1. Run local server and perform full QA (desktop/mobile + reduced motion).
2. Execute Lighthouse and a11y audits; capture results; fix critical issues.
3. Decide narrative length policy and keyboard affordances outside cards; finalize anchoring heuristics.
4. Polish remaining KPIs to spec and micro‑viz consistency; update docs and WORKLOG.
5. Commit, push, and redeploy; prepare short demo script for stakeholder review.

---

Use this Save Point as the first message in a new session to instantly restore context. Continue with the "Next actions on resume" list, and keep all changes within fixed widget dimensions using transform/opacity-only motion.
