import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { sub } from "../../widgets/bus";
import { emit } from "../../utils/telemetry";

export type ChatContext = {
  source: string;
  cardId?: string;
  title?: string;
  primary?: string;
  metrics?: Array<{ label: string; value: string }>;
  anchorRect?: { top: number; left: number; right: number; bottom: number; width: number; height: number };
  narrative?: string;
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return reduced;
}

function focusFirst(el: HTMLElement | null) {
  if (!el) return;
  const focusables = el.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
  );
  (focusables[0] || el).focus();
}

export default function ChatWindow() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [unread, setUnread] = useState(false);
  const [ctx, setCtx] = useState<ChatContext | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const reduce = usePrefersReducedMotion();
  const overlayRef = useRef<HTMLElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [kbOffset, setKbOffset] = useState(0);

  // Subscribe to progressive.open
  useEffect(() => {
    return sub("progressive.open", (payload: unknown) => {
      const next = (payload || {}) as ChatContext;
      setCtx(next);
      setOpen(true);
      setMinimized(false);
      setUnread(false);
      emit("revx.chat_open", { deviceClass: inferDevice(), density: inferDensity(), cardId: next.cardId });
    });
  }, []);

  // Focus trap + restore
  useEffect(() => {
    if (open && !minimized) {
      lastFocus.current = document.activeElement as HTMLElement;
      setTimeout(() => focusFirst(containerRef.current!), 0);
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          e.preventDefault();
          handleClose();
        } else if (e.key === "Tab") {
          // simple focus trap
          const wrap = containerRef.current;
          if (!wrap) return;
          const nodes = wrap.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
          );
          if (nodes.length === 0) return;
          const first = nodes[0];
          const last = nodes[nodes.length - 1];
          const active = document.activeElement as HTMLElement;
          if (e.shiftKey && active === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && active === last) {
            e.preventDefault();
            first.focus();
          }
        }
      };
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }
  }, [open, minimized]);

  function handleClose() {
    setOpen(false);
    setMinimized(false);
    setUnread(false);
    emit("revx.chat_close", { deviceClass: inferDevice(), density: inferDensity(), cardId: ctx?.cardId });
    const prev = lastFocus.current;
    if (prev) setTimeout(() => prev.focus?.(), 0);
  }

  function handleMinimize() {
    setMinimized(true);
    setUnread(false);
  }

  function toggleBubble() {
    const next = !(open && !minimized);
    if (next) {
      setOpen(true);
      setMinimized(false);
      setUnread(false);
    } else {
      handleClose();
    }
  }

  // Simulate unread if new context arrives while minimized
  useEffect(() => {
    if (minimized && open) setUnread(true);
  }, [ctx]);

  // Dock position + responsive: BR default; at very small widths use full-width bottom sheet style
  const isNarrow = typeof window !== 'undefined' && window.innerWidth <= 640;
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  // Resolve the overlay element lazily
  useEffect(() => {
    overlayRef.current = (typeof document !== 'undefined') ? (document.getElementById('dashboard-overlay') as HTMLElement | null) : null;
  }, []);

  // Keyboard/safe-area handling for mobile bottom sheet
  useEffect(() => {
    const vv = (typeof window !== 'undefined' ? (window as any).visualViewport : undefined);
    if (!vv) return;
    const onVV = () => {
      const winH = window.innerHeight || 0;
      const offset = Math.max(0, winH - vv.height - (vv.offsetTop || 0));
      setKbOffset(offset);
    };
    vv.addEventListener?.('resize', onVV);
    vv.addEventListener?.('scroll', onVV);
    onVV();
    return () => {
      vv.removeEventListener?.('resize', onVV);
      vv.removeEventListener?.('scroll', onVV);
    };
  }, []);

  // Placement within overlay space with collision handling
  useEffect(() => {
    if (!open || minimized || isNarrow) { setPos(null); return; }
    const overlay = overlayRef.current;
    if (!overlay) { setPos(null); return; }
    const schedule = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const o = overlay.getBoundingClientRect();
        const M = 16; // gap
        const WIN_W = 340;
        const WIN_H = 460;
        const r = ctx?.anchorRect;
        let left: number;
        let top: number;
        if (r) {
          const x = r.left - o.left;
          const y = r.top - o.top;
          // Prefer right of anchor
          left = x + r.width + M;
          top = y;
          // Flip to left if overflow
          if (left + WIN_W + M > o.width) left = x - WIN_W - M;
          // If still colliding, center horizontally and go below
          if (left < M) left = (o.width - WIN_W) / 2;
          // Clamp vertical
          const maxTop = o.height - WIN_H - M;
          top = Math.min(Math.max(M, top), Math.max(M, maxTop));
          // If anchor is too tall near bottom, try placing below
          if (y + r.height + M + WIN_H <= o.height) {
            // allow below if space exists and top is near top edge
            if (top < M + 8) top = Math.min(maxTop, y + r.height + M);
          }
        } else {
          // Center in overlay when no anchor
          left = Math.max(M, (o.width - WIN_W) / 2);
          top = Math.max(M, (o.height - WIN_H) / 2);
        }
        setPos({ top, left });
      });
    };
    schedule();
    const onScroll = () => schedule();
    const onResize = () => schedule();
    window.addEventListener('scroll', onScroll, { passive: true, capture: true } as any);
    window.addEventListener('resize', onResize, { passive: true } as any);
    let ro: ResizeObserver | null = null;
    const RO = (window as any).ResizeObserver as typeof ResizeObserver | undefined;
    if (RO) {
      ro = new RO(() => schedule());
      ro.observe(overlay);
    }
    return () => {
      window.removeEventListener('scroll', onScroll, { capture: true } as any);
      window.removeEventListener('resize', onResize as any);
      ro?.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [open, minimized, isNarrow, ctx]);

  const overlayEl = overlayRef.current || (typeof document !== 'undefined' ? document.body : null);
  const content = (
    <>
      {/* Minimized bubble */}
      {(!open || minimized) && (
        <button
          type="button"
          aria-label="Open chat"
          onClick={toggleBubble}
          className="absolute bottom-4 right-4 z-[100] size-12 rounded-full bg-white/10 border border-white/15 backdrop-blur-md shadow-lg hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 pointer-events-auto"
        >
          <span className="relative inline-block text-white text-xl">💬{unread && <span className="absolute -top-1 -right-1 inline-block size-3 rounded-full bg-cyan-400 ring-2 ring-slate-900"/>}</span>
        </button>
      )}

      {/* Window */}
      {open && !minimized && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={ctx?.title || "Assistant"}
          aria-describedby={ctx?.narrative ? "chat-narrative" : undefined}
          className={
            "absolute z-[100] text-white/90 pointer-events-auto will-change-transform " +
            (isNarrow ? "left-0 right-0 h-[80vh]" : "w-[min(92vw,420px)] h-[460px]")
          }
          style={{
            transition: reduce ? undefined : "transform 280ms cubic-bezier(0.2,0.8,0.2,1), opacity 220ms ease-out",
            transform: reduce ? "none" : "translateY(0) scale(1)",
            opacity: 1,
            ...(isNarrow
              ? { left: 0, right: 0, bottom: kbOffset }
              : pos
              ? { top: pos.top, left: pos.left }
              : { right: 16, bottom: 16 }),
          }}
        >
          <div
            ref={containerRef}
            className={
              "relative flex h-full flex-col rounded-2xl ring-1 ring-white/[0.02] " +
              // Frameless glass: no border, softer background, stronger blur + shadow
              (isNarrow
                ? "rounded-t-2xl bg-white/8 backdrop-blur-lg shadow-[0_8px_28px_rgba(0,0,0,.28)]"
                : "bg-white/6 backdrop-blur-lg shadow-[0_8px_28px_rgba(0,0,0,.28)]")
            }
          >
            <header className="flex items-center justify-between p-4 sm:p-5 border-b border-white/5 min-h-[44px]">
              <div className="flex items-center gap-2 min-h-[24px]">
                <span className={`inline-flex size-2 rounded-full bg-emerald-400 ${reduce ? '' : 'animate-pulse'}`} aria-hidden/>
                <h2 className="text-sm font-semibold tracking-[-0.01em]">{ctx?.title || "Revenue Assistant"}</h2>
                {ctx?.primary && (
                  <div className="text-sm font-semibold tabular-nums text-white/90">{ctx.primary}</div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="size-8 rounded-xl border border-white/10 bg-white/5 hover:bg-white/8 active:bg-white/10"
                  onClick={handleMinimize}
                >
                  –
                </button>
                <button
                  aria-label="Close chat"
                  className="size-8 rounded-xl border border-white/10 bg-white/5 hover:bg-white/8 active:bg-white/10"
                  onClick={handleClose}
                >
                  ×
                </button>
              </div>
            </header>
            <div className="flex-1 overflow-auto overscroll-contain p-4 sm:p-5 space-y-3">
              {ctx?.narrative && (
                <div id="chat-narrative" className="text-[13px] leading-5 text-white/80">
                  {ctx.narrative}
                </div>
              )}
              {ctx?.metrics && (
                <div className="grid grid-cols-2 gap-2">
                  {ctx.metrics.map((m, i) => (
                    <div key={i} className="rounded-xl border border-white/10 bg-white/5 px-2 py-1">
                      <div className="text-[10px] uppercase tracking-wide text-white/60">{m.label}</div>
                      <div className="text-sm font-semibold tabular-nums">{m.value}</div>
                    </div>
                  ))}
                </div>
              )}
              <div className="text-xs text-white/70">
                Context from: <span className="font-mono text-white/80">{ctx?.source || "unknown"}</span>
              </div>
              {/* Inline micro-viz for quick context */}
              <div className="rounded-xl border border-white/10 bg-white/5 p-2">
                <div className="text-[10px] uppercase tracking-wide text-white/60">Last 7 days</div>
                <div className="mt-1 h-10 w-full rounded bg-white/6" aria-hidden />
              </div>
            </div>
            <footer className="border-t border-white/5 p-4 sm:p-5 pb-[max(env(safe-area-inset-bottom),0px)]">
              <div className="flex gap-3">
                <input
                  className="flex-1 h-11 rounded-xl bg-white/5 border border-white/10 px-3 text-[13px] placeholder-white/40
                             focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-white/20"
                  placeholder="Type a message…"
                />
                <button className="h-11 px-4 rounded-xl bg-cyan-400 text-slate-900 font-semibold hover:brightness-110 active:brightness-95">
                  Send
                </button>
              </div>
            </footer>
          </div>
        </div>
      )}
    </>
  );

  // Use portal so that coordinates are relative to the dashboard overlay (grid)
  // Keep a single pointer-events-auto wrapper; overlay itself is pointer-events-none
  return overlayEl ? createPortal(
    <div className="pointer-events-auto">
      {content}
    </div>
  , overlayEl) : content;
}

function inferDevice(){
  const w = typeof window !== 'undefined' ? window.innerWidth : 1440;
  return w >= 1024 ? 'desktop' : w >= 768 ? 'tablet' : 'mobile';
}
function inferDensity(){
  const w = typeof window !== 'undefined' ? window.innerWidth : 1440;
  return w >= 1024 ? 'lg' : w >= 768 ? 'md' : w >= 480 ? 'sm' : 'xs';
}
