import { useEffect, useMemo, useRef, useState } from "react";
import CardWidget from "./CardWidget";
import { QuickAction } from "./QuickAction";
import { useResizeDensity } from "./useResizeDensity";
import { useFeatureFlag } from "../hooks/useFeatureFlag";
import { AgentBubble } from "../components/revx/AgentBubble";
import { FocusOverlay } from "../components/revx/FocusOverlay";
import { StackCarousel } from "../components/revx/StackCarousel";
import { emit } from "../utils/telemetry";
import { REVX_UI } from "../content/revx";
import { escalateToChat } from "../hooks/useProgressiveDisclosure";

export default function RevenuePulse() {
  const { ref, bp } = useResizeDensity();
  // Compact header metric sizes to preserve fixed widget height across breakpoints
  const numberCls =
    bp === "xs" ? "text-[18px]" : bp === "sm" ? "text-[20px]" : bp === "md" ? "text-[22px]" : "text-2xl";
  const revx = useFeatureFlag("revx");
  const reduce = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [bubbleOpen, setBubbleOpen] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const startX = useRef<number | null>(null);
  const startT = useRef<number>(0);
  const deviceClass = bp === "lg" ? "desktop" : bp === "md" ? "tablet" : "mobile";
  const placeholderMRR = useMemo(() => 312420, []);
  const PANELS = useMemo(() => ([
    {
      id: "overview",
      title: "Current Revenue",
      primary: "$312,420",
      secondary: ["MoM +8%", "YoY +24%"],
      hint: "Click to discuss breakdowns",
      render: () => (
        <div className="flex h-full flex-col justify-between p-3">
          <div>
            <div className="text-sm font-semibold text-white/90">Current Revenue</div>
            <div className="mt-1 text-2xl sm:text-[22px] md:text-[24px] font-semibold tabular-nums">$312,420</div>
            <div className="mt-2 flex gap-4 text-xs text-white/70">
              <span>MoM +8%</span>
              <span>YoY +24%</span>
            </div>
          </div>
          <div className="flex items-end justify-end">
            <div className="h-16 w-40 rounded bg-white/6" aria-hidden />
          </div>
        </div>
      )
    },
    {
      id: "composition",
      title: "Revenue Composition",
      primary: "742,032 Symbolic Checks",
      secondary: ["64% of Total Revenue"],
      hint: "Click to explore category trends",
      render: () => (
        <div className="flex h-full flex-col justify-between p-3">
          <div>
            <div className="text-sm font-semibold text-white/90">Revenue Composition</div>
            <div className="mt-1 text-[18px] sm:text-xl md:text-2xl font-semibold">742,032 Symbolic Checks</div>
            <div className="mt-2 text-xs text-white/70">64% of Total Revenue</div>
          </div>
          <div className="flex items-center justify-end">
            <div className="relative size-16 sm:size-20 rounded-full bg-white/6" aria-hidden>
              <div className="absolute inset-2 rounded-full border-4 border-white/40 border-t-transparent" />
            </div>
          </div>
        </div>
      )
    },
    {
      id: "rules",
      title: "Rules Impact",
      primary: "14% Attributable to Automated Rules",
      secondary: ["+4% MoM"],
      hint: "Click to explore rule performance",
      render: () => (
        <div className="flex h-full flex-col justify-between p-3">
          <div>
            <div className="text-sm font-semibold text-white/90">Rules Impact</div>
            <div className="mt-1 text-[18px] sm:text-xl font-semibold">14% Attributable to Automated Rules</div>
            <div className="mt-2 text-xs text-white/70">+4% MoM</div>
          </div>
          <div className="grid grid-cols-6 items-end gap-1 pr-1" aria-hidden>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-10 rounded bg-white/6" style={{ height: 10 + i * 6 }} />
            ))}
          </div>
        </div>
      )
    },
  ]), []);
  const onLearnMore = () => {
    setOverlayOpen(true);
    emit("revx.learn_more", { deviceClass, density: bp });
    emit("revx.overlay_open", { deviceClass, density: bp });
  };

  // Footer hint visibility (fade after 3s each panel)
  const [hintVisible, setHintVisible] = useState(true);
  useEffect(() => {
    setHintVisible(true);
    const t = window.setTimeout(() => setHintVisible(false), 3000);
    return () => window.clearTimeout(t);
  }, [active]);
  useEffect(() => { setHovered(false); }, [active]);
  const onCtaClick = () => {
    emit("revx.cta_click", { deviceClass, density: bp });
  };

  // Helpers for rotation
  const clampIndex = (i: number) => (i + PANELS.length) % PANELS.length;
  const rotate = (dir: 1 | -1) => {
    setActive((prev) => {
      const next = clampIndex(prev + dir);
      emit("revx.toc_rotate", { deviceClass, density: bp, direction: dir, index: next });
      return next;
    });
  };
  // Wheel handling via non-passive listener (to allow preventDefault)
  const wheelAccum = useRef(0);
  const wheelTimeout = useRef<number | null>(null);
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const isScrollableAncestor = (node: HTMLElement | null) => {
      while (node && node !== el) {
        const style = window.getComputedStyle(node);
        const scrollable = node.scrollHeight > node.clientHeight && style.overflowY !== "visible";
        if (scrollable) return true;
        node = node.parentElement as HTMLElement | null;
      }
      return false;
    };
    const onWheel = (e: WheelEvent) => {
      if (!revx) return;
      if (!el.contains(e.target as Node)) return;
      if (isScrollableAncestor(e.target as HTMLElement)) return; // let inner scrollables consume
      e.preventDefault();
      const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      wheelAccum.current += delta;
      const threshold = 40; // ~1 card unit
      if (Math.abs(wheelAccum.current) >= threshold) {
        rotate(wheelAccum.current > 0 ? 1 : -1);
        wheelAccum.current = 0;
      }
      if (wheelTimeout.current) window.clearTimeout(wheelTimeout.current);
      wheelTimeout.current = window.setTimeout(() => (wheelAccum.current = 0), 120);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [revx, bp]);
  const handleKey = (e: React.KeyboardEvent) => {
    if (!revx) return;
    if (e.key === "ArrowRight") { e.preventDefault(); rotate(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); rotate(-1); }
  };
  const onPointerDown = (e: React.PointerEvent) => {
    if (!revx) return;
    startX.current = e.clientX;
    startT.current = performance.now();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!revx) return;
    if (startX.current == null) return;
    const dx = e.clientX - startX.current;
    const dt = performance.now() - startT.current;
    startX.current = null;
    const threshold = 36; // px
    const velocity = Math.abs(dx) / Math.max(dt, 1);
    if (Math.abs(dx) > threshold || velocity > 0.5) {
      rotate(dx < 0 ? 1 : -1);
    }
  };

  // Escalate on active card click
  const onSelectActive = () => {
    const p = PANELS[active % PANELS.length];
    emit("revx.card_select", { deviceClass, density: bp, cardId: p.id });
    const anchorEl = (ref as React.MutableRefObject<HTMLDivElement | null>).current;
    const rect = anchorEl ? anchorEl.getBoundingClientRect() : undefined;
    escalateToChat({
      source: "revenue-widget",
      cardId: p.id,
      title: p.title,
      primary: p.primary,
      anchorRect: rect ? { top: rect.top, left: rect.left, right: rect.right, bottom: rect.bottom, width: rect.width, height: rect.height } : undefined,
      metrics: [
        { label: "MRR", value: "$312k" },
        { label: "Panel", value: p.title },
      ],
    });
  };
  return (
    <div ref={ref} className={bubbleOpen ? "relative z-40" : undefined}>
      <CardWidget hoverLift={false}>
        <div className="relative z-0 h-full">
          {/* Header strip (fixed height 56px) */}
          <div className="relative z-10 h-[56px] px-1 flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <div className="text-sm font-medium">Revenue</div>
              <div className={`${numberCls} font-semibold tabular-nums`}>{placeholderMRR.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 })}</div>
            </div>
            <div className="flex items-center gap-2">
              <QuickAction label="Drill in" onClick={() => emit("revenue.drill", { deviceClass, density: bp })}>↘︎</QuickAction>
              <QuickAction label="Export" onClick={() => emit("revenue.export", { deviceClass, density: bp })}>⤓</QuickAction>
              {revx && (
                <QuickAction label={REVX_UI.actions.explore_stack} onClick={() => onLearnMore()}>
                  <svg viewBox="0 0 24 24" className="size-5 text-white/80" aria-hidden="true">
                    <path d="M12 5l6 3-6 3-6-3 6-3z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 11l6 3 6-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 15l6 3 6-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </QuickAction>
              )}
              {revx && (
                <button
                  type="button"
                  aria-label={REVX_UI.actions.bubble_toggle_aria}
                  className="size-7 rounded-lg bg-white/6 border border-white/10 hover:bg-white/10"
                  aria-expanded={bubbleOpen}
                  onClick={(e) => {
                    e.stopPropagation();
                    const next = !bubbleOpen;
                    setBubbleOpen(next);
                    if (next) emit("revx.bubble_open", { deviceClass, density: bp });
                  }}
                  onFocus={(e) => {
                    e.stopPropagation();
                    setBubbleOpen(true);
                  }}
                  title={REVX_UI.actions.bubble_toggle_title}
                >
                  <svg viewBox="0 0 24 24" className="size-4 text-white/80" aria-hidden="true">
                    <path d="M12 5l6 3-6 3-6-3 6-3z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 11l6 3 6-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 15l6 3 6-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              )}
            </div>
          </div>
          {revx && (
            <>
              {bubbleOpen && (
                <div
                  className="absolute inset-0 z-10"
                  aria-hidden
                  onClick={(e) => {
                    e.stopPropagation();
                    setBubbleOpen(false);
                  }}
                />
              )}
              {/* Full-panel content well: fills rest below header (overflow hidden to keep fixed footprint) */}
              <div className="relative overflow-hidden" style={{ height: "calc(100% - 56px)" }}>
                {/* Panels container */}
                <div
                  ref={trackRef}
                  className="absolute inset-0 z-20 pointer-events-auto select-none outline-none"
                  role="group"
                  aria-roledescription="carousel"
                  aria-label={`Revenue overview, slide ${active + 1} of ${PANELS.length}`}
                  tabIndex={0}
                  onKeyDown={handleKey}
                  onPointerDown={onPointerDown}
                  onPointerUp={onPointerUp}
                  style={{ touchAction: 'pan-y' }}
                >
                {(() => {
                  const len = PANELS.length;
                  const nextIndex = (active + 1) % len;
                  return PANELS.map((p, i) => {
                    const isActive = i === active;
                    const isNext = i === nextIndex;
                    const scale = reduce ? 1 : (isActive ? 1 : isNext ? 0.97 : 0.98);
                    const opacity = isActive ? 1 : isNext ? 0.85 : 0;
                    const z = isActive ? 3 : isNext ? 2 : 1;
                    const translateY = reduce ? 0 : (isActive ? (hovered ? -2 : 0) : isNext ? 6 : -8);
                    const tDur = isActive && hovered && !reduce ? 150 : 280;
                    const shadow = reduce
                      ? '0 0 0 rgba(0,0,0,0)'
                      : (isActive ? '0 10px 24px rgba(0,0,0,0.24)'
                        : isNext ? '0 6px 14px rgba(0,0,0,0.16)'
                        : '0 4px 10px rgba(0,0,0,0.10)');
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={isActive ? onSelectActive : undefined}
                      className={`absolute inset-0 rounded-xl border border-white/10 bg-white/5 text-left transition-colors ${isActive ? 'cursor-pointer hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 active:bg-white/8 hover:border-white/20' : 'focus:outline-none'}`}
                      style={{
                        transform: `translateY(${translateY}px) scale(${scale})`,
                        transition: reduce
                          ? 'opacity 160ms ease-out'
                          : `transform ${tDur}ms cubic-bezier(0.2,0.8,0.2,1), opacity 280ms cubic-bezier(0.2,0.8,0.2,1)`,
                        zIndex: z,
                        opacity,
                        pointerEvents: isActive ? 'auto' : 'none',
                        boxShadow: shadow,
                        willChange: 'transform, opacity',
                      }}
                      aria-current={isActive ? 'true' : undefined}
                      aria-hidden={isActive ? undefined : true}
                      tabIndex={isActive ? 0 : -1}
                      onMouseEnter={isActive ? () => setHovered(true) : undefined}
                      onMouseLeave={isActive ? () => setHovered(false) : undefined}
                      onKeyDown={isActive ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                        }
                      } : undefined}
                    >
                      {p.render()}
                    </button>
                  );
                  });
                })()}
                {/* Progress dots anchored to the well bottom (non-obstructive) */}
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-30 flex justify-center gap-1.5 pointer-events-none" aria-hidden>
                  {PANELS.map((_, i) => (
                    <span key={i} className={`inline-block size-1.5 rounded-full ${i === active ? 'bg-white/90' : 'bg-white/35'}`}/>
                  ))}
                </div>
                {/* Footer hint (fades after 3s) */}
                {PANELS[active] && PANELS[active].hint && (
                  <div
                    className="absolute bottom-1.5 left-2 z-30 text-[10px] sm:text-xs text-white/70 pointer-events-none transition-opacity duration-300"
                    style={{ opacity: hintVisible ? 1 : 0 }}
                    aria-live="polite"
                  >
                    {PANELS[active].hint}
                  </div>
                )}
                {/* Live region for SR to announce slide change */}
                <div className="sr-only" aria-live="polite">Revenue overview, slide {active + 1} of {PANELS.length}</div>
                </div>
              </div>
              <AgentBubble
                open={bubbleOpen}
                onOpen={() => setBubbleOpen(true)}
                onClose={() => setBubbleOpen(false)}
                onLearnMore={() => {
                  setBubbleOpen(false);
                  onLearnMore();
                }}
                density={bp}
              />
             <FocusOverlay
               title={REVX_UI.overlay.title}
               isOpen={overlayOpen}
               onClose={() => {
                 setOverlayOpen(false);
                 emit("revx.overlay_close", { deviceClass, density: bp });
               }}
               allowBlur={false}
               ctaLabel={REVX_UI.overlay.cta_label}
               onCta={onCtaClick}
             >
               <StackCarousel
                 onSlideChange={(i) => emit("revx.slide_change", { deviceClass, density: bp, slideIndex: i })}
               />
             </FocusOverlay>
            </>
          )}
        </div>
      </CardWidget>
    </div>
  );
}
