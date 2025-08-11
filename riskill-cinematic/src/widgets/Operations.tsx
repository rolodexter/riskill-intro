import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import CardWidget from "./CardWidget";
import { useResizeDensity } from "./useResizeDensity";
import { useProgressiveDisclosure } from "../hooks/useProgressiveDisclosure";
import { MICRO } from "../content/operationsNarrative";
import { emit } from "../utils/telemetry";
import { AnimatePresence, motion } from "framer-motion";

/*
Widget Layout Strategy — Operations Card

• Fit entire layout within the original widget height — do not increase height.
• Reduce font sizes as necessary: headline KPI 18–20px, secondary metrics 12–14px, microtext 10–11px.
• Use text-only for now — avoid buttons/icons unless essential for interaction.
• Implement a vertical stack system: multiple “pages” (e.g., Summary, Incidents, Performance, Forecast) in one widget slot.
• Rotate between stack pages via vertical slide animation (Framer Motion), without changing widget height.
• Maintain clear visual hierarchy — 1 key KPI per page, supporting data below in smaller type.
• Keep padding/margins tight but readable; ≤ 8px vertical spacing between rows.
• Ensure progressive disclosure: deeper info appears only on the active page.

Vertical Card Stack Behavior

• Treat the Operations widget as a stack of cards occupying the same footprint.
• Only the top card is fully visible; cycling is infinite.
• Interactions: mouse wheel / trackpad scroll, vertical swipe, arrow keys; optional auto-rotate.
• Visual depth: inactive cards sit behind with slight translateY, scale-down, and opacity fade (parallax).
*/

type MicroKey = typeof MICRO[number]["key"];

const MICRO_SUMMARY: Record<MicroKey, string> = MICRO.reduce((acc, m) => { acc[m.key] = m.summary; return acc; }, {} as Record<MicroKey, string>);

// Text-only stacked pages in one footprint
type Page = {
  key: string;
  label: string;
  headline: string;
  secondaries: { label: string; value: string }[];
  note: string;
};

const PAGES: Page[] = [
  {
    key: 'summary',
    label: 'Summary',
    headline: '99.9%',
    secondaries: [
      { label: 'Backlog', value: 'Low' },
      { label: 'SLA', value: 'Met' },
    ],
    note: MICRO_SUMMARY['uptime' as MicroKey] || 'Enterprise pulse steady. No critical issues.',
  },
  {
    key: 'incidents',
    label: 'Incidents',
    headline: '0 Sev-1',
    secondaries: [
      { label: 'Open', value: '2' },
      { label: 'MTTR', value: '1.4h' },
    ],
    note: MICRO_SUMMARY['backlog' as MicroKey] || 'Tickets trending down. No blockers reported.',
  },
  {
    key: 'performance',
    label: 'Performance',
    headline: 'Avg Lat. 230ms',
    secondaries: [
      { label: 'Throughput', value: '1.2k/min' },
      { label: 'SLA', value: 'Met' },
    ],
    note: MICRO_SUMMARY['sla' as MicroKey] || 'SLA within target. Watch peak-hour spikes.',
  },
  {
    key: 'forecast',
    label: 'Forecast',
    headline: 'Low risk',
    secondaries: [
      { label: 'Next week', value: 'Green' },
      { label: 'Watch', value: 'Tue upgrade' },
    ],
    note: 'Next week risk: low (infra upgrade Tue).',
  },
];

const HOVER_FLAG = "riskill:ops:hover_intro:v1";
const FIRST_CLICK_FLAG = "riskill:ops:first_click:v1";

function isTouchDevice(){
  if (typeof window === 'undefined') return false;
  return ('ontouchstart' in window) || (navigator as any)?.maxTouchPoints > 0;
}

export default function Operations() {
  const { ref } = useResizeDensity();
  const { escalateToChat } = useProgressiveDisclosure();
  const [idx, setIdx] = useState(0); // page index in PAGES
  const wrapRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLElement | null>(null);
  const reduceMotion = usePrefersReducedMotion();
  const [showHoverIntro, setShowHoverIntro] = useState<boolean>(() => {
    if (typeof sessionStorage === 'undefined') return false;
    return !sessionStorage.getItem(HOVER_FLAG);
  });
  const [showFirstClickIntro, setShowFirstClickIntro] = useState<boolean>(false);
  const [hintFaded, setHintFaded] = useState(false);
  const lastInteractRef = useRef<number>(Date.now());
  const [autoPaused, setAutoPaused] = useState(false);

  // compact typography handled inline per spec

  function openChat(primaryKey: string) {
    const rect = (ref.current as HTMLDivElement | null)?.getBoundingClientRect();
    escalateToChat({
      source: "operations-widget",
      cardId: "operations",
      title: "Operations",
      primary: primaryKey,
      metrics: PAGES[idx]?.secondaries || [],
      anchorRect: rect
        ? { top: rect.top, left: rect.left, right: rect.right, bottom: rect.bottom, width: rect.width, height: rect.height }
        : undefined,
      narrative: PAGES[idx]?.note || '',
    });
    emit?.("ops.chat_opened", { primary: primaryKey, anchored: true });
  }

  // Attach native wheel listener to the deck element (passive:false) so preventDefault cancels page scroll
  useEffect(() => {
    const el = deckRef.current;
    if (!el) return;
    let last = 0;
    const handler = (ev: WheelEvent) => {
      // ignore pinch-zoom; normalize delta across deltaModes (0=pixel,1=line,2=page)
      if (ev.ctrlKey) return;
      const raw = ev.deltaY;
      const delta = ev.deltaMode === 1 ? raw * 16 : (ev.deltaMode === 2 ? raw * 800 : raw);
      if (Math.abs(delta) < 0.5) return;
      const now = performance.now();
      if (now - last < 220) return; // throttle
      ev.preventDefault();
      const dir = delta > 0 ? 1 : -1;
      setIdx(prev => {
        const next = (prev + dir + PAGES.length) % PAGES.length;
        emit?.("ops.scroll.cycle", { from: PAGES[prev].key, to: PAGES[next].key });
        return next;
      });
      emit?.("ops.scroll.wheel", { delta, mode: ev.deltaMode });
      if (!hintFaded) setHintFaded(true);
      lastInteractRef.current = Date.now();
      last = now;
    };
    el.addEventListener("wheel", handler, { passive: false, capture: true } as AddEventListenerOptions);
    return () => el.removeEventListener("wheel", handler as any, { capture: true } as any);
  }, []);

  const currentPage = PAGES[idx];

  // Resolve overlay and anchor rect for popovers
  useEffect(() => {
    overlayRef.current = (typeof document !== 'undefined') ? (document.getElementById('dashboard-overlay') as HTMLElement | null) : null;
  }, []);

  // Hover intro management (once per session)
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onEnter = () => {
      setAutoPaused(true);
      if (showHoverIntro) {
        emit?.("ops.hover_intro.shown", {});
      }
    };
    const onLeave = () => {
      setAutoPaused(false);
      if (showHoverIntro) {
        setShowHoverIntro(false);
        try { sessionStorage?.setItem(HOVER_FLAG, "1"); } catch {}
        emit?.("ops.hover_intro.dismissed", {});
      }
    };
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [showHoverIntro]);

  function handlePrimary() {
    // Gate first click via localStorage flag
    const seen = typeof localStorage !== 'undefined' && !!localStorage.getItem(FIRST_CLICK_FLAG);
    if (!seen) {
      setShowFirstClickIntro(true);
      emit?.("ops.first_click_intro.shown", {});
      return;
    }
    openChat(currentPage.key);
  }

  function proceedFromIntro() {
    try { localStorage?.setItem(FIRST_CLICK_FLAG, "1"); } catch {}
    setShowFirstClickIntro(false);
    emit?.("ops.first_click_intro.proceed", {});
    openChat(currentPage.key);
  }

  // ESC to close first-click intro (does not mark as seen)
  useEffect(() => {
    if (!showFirstClickIntro) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setShowFirstClickIntro(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [showFirstClickIntro]);

  // Auto-cycle pages every 7s, pause on hover/focus or after manual interaction for 20s
  useEffect(() => {
    const interval = setInterval(() => {
      if (autoPaused) return;
      if (Date.now() - lastInteractRef.current < 20000) return;
      setIdx((i) => (i + 1) % PAGES.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [autoPaused]);

  // Pointer-based vertical flicks (mobile/tablet). We only prevent default on confirmed flicks.
  useEffect(() => {
    const el = deckRef.current;
    if (!el) return;
    const isTouchCapable = typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    if (!isTouchCapable) return;

    let startY = 0, startT = 0, moved = false;
    const MIN_DIST = 28;      // px
    const MIN_VELOCITY = 0.35; // px/ms
    const THROTTLE = 220;     // ms
    let last = 0;

    const onDown = (e: PointerEvent) => {
      if (!isTouchCapable) return;
      try { el.setPointerCapture?.(e.pointerId); } catch {}
      startY = e.clientY;
      startT = performance.now();
      moved = false;
    };
    const onMove = (e: PointerEvent) => {
      if (!isTouchCapable) return;
      const dy = e.clientY - startY;
      if (Math.abs(dy) > 6) moved = true;
      // allow native scroll until flick confirmed
    };
    const onUp = (e: PointerEvent) => {
      if (!isTouchCapable) return;
      const dy = e.clientY - startY;
      const dt = performance.now() - startT;
      const v = Math.abs(dy) / Math.max(dt, 1);
      const now = performance.now();
      if (moved && Math.abs(dy) >= MIN_DIST && v >= MIN_VELOCITY && (now - last) >= THROTTLE) {
        setIdx(i => (i + (dy < 0 ? 1 : -1) + PAGES.length) % PAGES.length);
        last = now;
        lastInteractRef.current = Date.now();
        if (!hintFaded) setHintFaded(true);
        e.preventDefault?.();
      }
      try { el.releasePointerCapture?.(e.pointerId); } catch {}
    };

    el.addEventListener('pointerdown', onDown as any, { passive: true } as any);
    el.addEventListener('pointermove', onMove as any, { passive: true } as any);
    el.addEventListener('pointerup', onUp as any, { passive: false } as any);
    el.addEventListener('pointercancel', onUp as any, { passive: false } as any);
    return () => {
      el.removeEventListener('pointerdown', onDown as any);
      el.removeEventListener('pointermove', onMove as any);
      el.removeEventListener('pointerup', onUp as any);
      el.removeEventListener('pointercancel', onUp as any);
    };
  }, [hintFaded]);

  // Reduced motion hook (local copy)
  function usePrefersReducedMotion(){
    const [reduced, setReduced] = useState(false);
    useEffect(() => {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      const update = () => setReduced(mq.matches);
      update();
      mq.addEventListener?.('change', update);
      return () => mq.removeEventListener?.('change', update);
    }, []);
    return reduced;
  }

  // Anchored popover primitive used for both hover bubble and first-click intro
  function AnchoredPopover({ children, width = 320, role = "status" as const, anchorEl }: { children: React.ReactNode, width?: number, role?: 'status'|'dialog', anchorEl?: HTMLElement | null }){
    const [pos, setPos] = useState<{top:number; left:number} | null>(null);
    const rafRef = useRef<number | null>(null);
    const overlay = overlayRef.current;
    const cardRect = (ref.current as HTMLDivElement | null)?.getBoundingClientRect();
    useEffect(() => {
      if (!overlay) return;
      const schedule = () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
          const o = overlay.getBoundingClientRect();
          const r = (anchorEl || null)?.getBoundingClientRect() || cardRect;
          const M = 12;
          let left = M, top = M;
          if (r){
            const x = r.left - o.left;
            const y = r.top - o.top;
            left = Math.min(Math.max(M, x), Math.max(M, o.width - width - M));
            top = Math.max(M, y + (anchorEl ? (r.height + 6) : -8)); // below icon, near top for card
          }
          setPos({ top, left });
        });
      };
      schedule();
      const onScroll = () => schedule();
      const onResize = () => schedule();
      window.addEventListener('scroll', onScroll, { passive: true, capture: true } as any);
      window.addEventListener('resize', onResize, { passive: true } as any);
      return () => {
        window.removeEventListener('scroll', onScroll, { capture: true } as any);
        window.removeEventListener('resize', onResize as any);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [overlay, anchorEl]);
    const node = (
      <div
        role={role}
        aria-live={role === 'status' ? 'polite' : undefined}
        className="absolute z-[95] pointer-events-auto text-[13px] text-white/90 max-w-[92vw]"
        style={{
          width,
          transition: reduceMotion ? undefined : 'opacity 200ms ease, transform 200ms cubic-bezier(0.2,0.8,0.2,1)',
          transform: reduceMotion ? 'none' : 'translateY(0)',
          opacity: 1,
          ...(pos ? { top: pos.top, left: pos.left } : { left: 12, top: 12 })
        }}
      >
        <div className="rounded-2xl border border-white/10 bg-white/8 backdrop-blur-lg shadow-[0_8px_28px_rgba(0,0,0,.28)] p-3">
          {children}
        </div>
      </div>
    );
    const mount = overlay || document.body;
    return createPortal(node, mount);
  }

  // Abbreviation rendering for narratives
  function renderWithAbbr(text: string) {
    const map: Record<string, string> = {
      'SLA': 'Service Level Adherence',
      'Sev-1': 'Critical Incident',
      'Avg Lat.': 'Average Latency',
      'BL': 'Backlog',
      'Up.': 'Uptime',
    };
    const tokens = Object.keys(map);
    if (tokens.length === 0) return text;
    const re = new RegExp(`(${tokens.map(t=>t.replace(/[-./]/g, r=>"\\"+r)).join('|')})`, 'g');
    const parts = text.split(re);
    return (
      <>
        {parts.map((p, i) => {
          const title = map[p as keyof typeof map];
          if (title) return <abbr key={i} title={title} tabIndex={0} className="underline decoration-dotted underline-offset-2">{p}</abbr>;
          return <span key={i}>{p}</span>;
        })}
      </>
    );
  }

  return (
    <div ref={ref}>
      {/* outer wrapper to capture wheel and hover */}
      <div ref={wrapRef} className="relative">
      <CardWidget chrome="none" interactive keyboardActivation={false} onPrimaryAction={handlePrimary}>
        <div
          ref={deckRef}
          role="region"
          aria-label="Operations deck"
          className="absolute inset-0 pointer-events-auto overscroll-contain"
        >
          {/* Depth preview ghosts behind active card */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <div className="absolute inset-0 scale-[0.95] translate-y-[14px] opacity-70 rounded-2xl bg-white/[0.04]" />
            <div className="absolute inset-0 scale-[0.97] translate-y-[7px]  opacity-85 rounded-2xl bg-white/[0.05]" />
          </div>

          {/* ACTIVE CARD covers full surface */}
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={currentPage.key}
              className="absolute inset-0 rounded-2xl p-3 sm:p-3.5 flex flex-col pointer-events-auto"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.99 }}
              animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.99 }}
              transition={{ duration: 0.28, ease:[0.2,0.8,0.2,1] }}
            >
              {/* Title row inside the card */}
              <div className="flex items-center justify-between">
                <div className="text-[12.5px] font-semibold tracking-[-0.01em]">Operations</div>
                <div className="text-[11.5px] text-white/60">Composite operational view</div>
              </div>

              {/* Headline */}
              <div className="mt-1 text-[20px] leading-6 font-semibold tabular-nums">{currentPage.headline}</div>

              {/* Micro narrative */}
              <div className="mt-1 text-[11.5px] text-white/75 line-clamp-2">{renderWithAbbr(currentPage.note)}</div>

              {/* Spacer to push indicator to bottom-right */}
              <div className="mt-auto text-right text-[11px] text-white/55 select-none">{idx + 1} / {PAGES.length}</div>
            </motion.div>
          </AnimatePresence>
        </div>
      </CardWidget>
      {/* Hover bubble (book cover), once per session */}
      {showHoverIntro && overlayRef.current && (
        <AnchoredPopover role="status" width={360}>
          <div className="text-[13px] leading-5 text-white/85">
            <div className="font-semibold mb-1">This view blends live data from across your systems into one clear status.</div>
            <div className="text-white/70">Scroll to explore, click to dive deeper.</div>
            <div className="mt-2 text-[11px] text-white/60">SAP • Salesforce • ServiceNow • Asana • Snowflake • SharePoint</div>
          </div>
        </AnchoredPopover>
      )}

      {/* First-click intro bubble (interstitial) */}
      {showFirstClickIntro && overlayRef.current && (
        <AnchoredPopover role="dialog" width={420}>
          <div role="document">
            <h3 className="text-sm font-semibold mb-1">Riskill AI</h3>
            <p className="text-[13px] text-white/85">
              Riskill AI is your top-layer interface for files, ERP, CRMs, service desks, project tools, databases — no more silos.
              Your intent in plain language becomes accurate, instant communication with every system you own.
            </p>
            <div className="mt-3 flex justify-end">
              <button onClick={proceedFromIntro} className="h-9 px-3 rounded-xl bg-cyan-400 text-slate-900 font-semibold hover:brightness-110 active:brightness-95">Proceed to Messenger</button>
            </div>
          </div>
        </AnchoredPopover>
      )}

      </div>
    </div>
  );
}
