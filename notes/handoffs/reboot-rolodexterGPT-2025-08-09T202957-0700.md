# Reboot Prompt — Riskill Zones-Only Dashboard (rolodexterGPT)

You are rolodexterGPT. Resume the Riskill zones-only glassmorphic dashboard project from this technical handback. Be concise, doc-driven, and keep proactive preview pings to Joe after meaningful UI/routing/visual changes.

## Project Coordinates
- Repo root: `C:\Users\rolod\OneDrive\riskill-intro`
- App path: `riskill-cinematic/`
- Tech: React + TypeScript + Vite + Tailwind v4 CSS features
- Local dev: `http://localhost:5178` with `--strictPort`
- Live: `https://riskill-zones-glass.windsurf.build`
- Deploy: Windsurf → Netlify
  - ProjectId: `f30c7c0e-885a-45af-a2e0-b49512827417`
  - Latest WindsurfDeploymentId: `6ea3a156-d955-45fc-8323-ca95a27bd604`
  - Config: `riskill-cinematic/windsurf_deployment.yaml`, `riskill-cinematic/netlify.toml`

## Authoritative Docs & Workflow
- Root docs: `PROJECT_STRUCTURE.md`, `README.md`, `WORKLOG.md`
- Always update WORKLOG after changes; update README/PROJECT_STRUCTURE if structure or commands change.
- Shell: Windows PowerShell (`;` for chaining). Never run `cd`; set Cwd.
- Browser preview cadence: post local/live URL to Joe after meaningful visual or interaction changes.

---

## 1) Implementation summary and technical achievements

- Background integration
  - Asset: `riskill-cinematic/public/assets/bg/nature-vista-dark.jpg` (Pexels starry night)
  - Theme: `riskill-cinematic/src/theme/bg.ts` → `export const BG_URL = "/assets/bg/nature-vista-dark.jpg"`
  - CSS: `riskill-cinematic/src/index.css`
    - `.bg-onyx-vista` (overlays: radial + linear softened for legibility)
    - `.bg-onyx-vista-raw` (image only)
  - Backdrop: `riskill-cinematic/src/components/landing/GradientBackdrop.tsx`
    - Fixed full-viewport, `z-0`, `pointer-events-none`
    - Default raw background; overlays opt-in via `?bg=overlay` or `#bg=overlay`
- Landing layout
  - Top row widgets rendered via `riskill-cinematic/src/components/landing/TopWidgets.tsx`
  - Widgets include `src/widgets/RevenuePulse.tsx`, `OpsHealth.tsx`, `RiskAlerts.tsx`, `AgentActivity.tsx`
- Accessibility & hydration
  - Converted outer interactive wrapper in `src/widgets/CardWidget.tsx` from nested `<button>` to a non-button container (motion div with `role="button"`, keyboard handlers). However, a nested button hydration error still appears locally (see Challenges below).
- Docs
  - WORKLOG updated previously to reflect background choice, overlay softening, and toggle behavior.

### Technical challenges encountered and solutions
- Backdrop visibility: fixed by moving from negative z-index to `z-0` while keeping `pointer-events-none`.
- Overlay legibility: reduced overlay opacities to keep content readable against the dark image.
- URL toggles: standardized `?bg=overlay`/`#bg=overlay` so overlays are opt-in; raw is default.
- Hydration warning: initial nested button issue mitigated by changing the outer wrapper, but logs still show a nested `<button>` case within `CardWidget` + quick actions.

### Performance metrics / optimization results
- No Lighthouse run recorded yet. Target: mobile ≥ 85.
- Background currently JPEG only; WebP optimization and responsive source-set are pending.

### Testing outcomes / feedback
- Local visual validation: background renders and looks good with raw default; overlays toggle works.
- Console (local) shows React hydration error related to nested buttons in top widgets; needs fix before broader QA.

---

## 2) Strategic insights and business implications

- Background direction validated: dark, minimal nature vista supports the "glass" motif and preserves content legibility with softened overlays.
- Opt-in overlays maintain readability for analytics widgets; default raw background showcases brand aesthetic.
- A11y remains a hard requirement; nested button structure undermines semantics and must be resolved before stakeholder demo.
- Top widgets are central to first-impression UX; improving micro-interactions (hover affordances, focus rings, drill-in/export placement) will materially impact perceived polish.

---

## 3) Documentation requirements and communication needs

- Update `WORKLOG.md` with:
  - Live validation status and console findings on hydration warning
  - Any UI/UX changes to top widgets (design tokens, spacing, states)
- Update `README.md` as needed if run scripts or toggles change.
- Add a short "Background Theming" section to `PROJECT_STRUCTURE.md` documenting `BG_URL`, overlay toggle, and `GradientBackdrop` behavior.
- Prepare a QA checklist doc in `notes/` for responsive sizes (360/768/1440/1920), Lighthouse, and a11y checks.

---

## 4) Stakeholder context and feedback integration

- Joe expects proactive preview pings after meaningful UI changes.
- Live site: `https://riskill-zones-glass.windsurf.build` (validate after deploy completes; use WindsurfDeploymentId above to check status).
- Event bus topics stabilized (in-memory): `action.queue.push`, `filters.apply`, `insight.highlight`, `nav.goto` — future persistence under consideration.

---

## 5) Strategic guidance requests and next priorities

### Immediate technical priorities
- Fix hydration error: audit `src/widgets/CardWidget.tsx` and any usages in top widgets.
  - Ensure outer interactive region is non-button (e.g., `div[role="button"]`).
  - Keep inner quick actions as `<button>` and stop event propagation.
  - Search for `<motion.button>` or nested button patterns across `src/widgets/`.
- Top widgets UX refinement (provided DOM sample indicates current structure):
  - Improve micro-states: hover/active, focus rings (`group-focus-within`), subtle press depth.
  - Clarify action hierarchy: primary vs secondary (drill-in, export) with iconography and tooltips.
  - Density tuning via design tokens; ensure tabular numbers and truncation are consistent.
  - Reduce visual noise while keeping affordances visible on keyboard focus.

### QA and performance
- Responsive validation at 360/768/1440/1920.
- Lighthouse mobile ≥ 85; address image format/size and CSS delivery.
- Consider `nature-vista-dark.webp` and `srcset`/`type` fallback strategy.

### A11y
- Verify keyboard interactions for card containers and action buttons.
- Color contrast with/without overlays.

### Deployment and previews
- After fixes, redeploy and post live URL; compare default and `?bg=overlay` variants.

---

## Reference Files (key)
- `riskill-cinematic/public/assets/bg/nature-vista-dark.jpg`
- `riskill-cinematic/src/theme/bg.ts`
- `riskill-cinematic/src/index.css`
- `riskill-cinematic/src/components/landing/GradientBackdrop.tsx`
- `riskill-cinematic/src/components/landing/TopWidgets.tsx`
- `riskill-cinematic/src/widgets/CardWidget.tsx`
- `riskill-cinematic/src/widgets/RevenuePulse.tsx`

## How to Resume
- Validate live deploy when ready; if outdated, run dev locally and verify.
- Prioritize hydration fix and top widget UX enhancements.
- Keep doc-driven workflow (update WORKLOG; add/adjust docs as above).
- Maintain preview cadence with Joe.
