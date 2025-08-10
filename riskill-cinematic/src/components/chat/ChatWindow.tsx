import { useEffect, useRef, useState } from "react";
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
  useEffect(() => {
    if (!open || minimized || isNarrow) { setPos(null); return; }
    const w = typeof window !== 'undefined' ? window.innerWidth : 1440;
    const h = typeof window !== 'undefined' ? window.innerHeight : 900;
    const M = 12; // margin
    const WIN_W = 340;
    const WIN_H = 460;
    const r = ctx?.anchorRect;
    if (r) {
      // Prefer right of widget
      let left = r.right + M;
      let top = r.top;
      // If overflow right, try left of widget
      if (left + WIN_W + M > w) {
        left = r.left - WIN_W - M;
      }
      // If still overflow (too narrow), place below widget centered to it
      if (left < M || left + WIN_W + M > w) {
        left = Math.min(Math.max(r.left + (r.width - WIN_W) / 2, M), w - WIN_W - M);
        top = r.bottom + M;
      }
      // Clamp top to viewport
      if (top + WIN_H + M > h) top = Math.max(M, h - WIN_H - M);
      if (top < M) top = M;
      setPos({ top, left });
    } else {
      setPos(null);
    }
  }, [open, minimized, isNarrow, ctx]);

  return (
    <>
      {/* Minimized bubble */}
      {(!open || minimized) && (
        <button
          type="button"
          aria-label="Open chat"
          onClick={toggleBubble}
          className="fixed bottom-4 right-4 z-[100] size-12 rounded-full bg-white/10 border border-white/15 backdrop-blur-md shadow-lg hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
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
          className={
            "fixed z-[100] text-white/90 " +
            (isNarrow ? "left-0 right-0 bottom-0 h-[80vh]" : "w-[340px] h-[460px]")
          }
          style={{
            transition: reduce ? undefined : "transform 280ms cubic-bezier(0.2,0.8,0.2,1), opacity 220ms ease-out",
            transform: reduce ? "none" : "translateY(0) scale(1)",
            opacity: 1,
            ...(isNarrow
              ? {}
              : pos
              ? { top: pos.top, left: pos.left }
              : { right: 16, bottom: 16 }),
          }}
        >
          <div
            ref={containerRef}
            className={
              "relative flex h-full flex-col rounded-2xl border border-white/15 shadow-2xl " +
              (isNarrow ? "rounded-t-2xl bg-slate-900/92" : "bg-slate-900/70 backdrop-blur-md")
            }
          >
            <header className="flex items-center justify-between px-3 py-2 border-b border-white/10 min-h-[44px]">
              <div className="flex items-baseline gap-2">
                <span className={`inline-block size-2 rounded-full bg-emerald-400 ${reduce ? '' : 'animate-pulse'}`} aria-hidden/>
                <div className="text-sm font-medium">{ctx?.title || "Revenue Assistant"}</div>
                {ctx?.primary && (
                  <div className="text-sm font-semibold tabular-nums text-white/90">{ctx.primary}</div>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button className={`${isNarrow ? 'px-3 py-2 text-sm' : 'px-2 py-1 text-xs'} rounded-md bg-white/10 hover:bg-white/15 min-h-[44px]` } onClick={handleMinimize}>Minimize</button>
                <button className={`${isNarrow ? 'px-3 py-2 text-sm' : 'px-2 py-1 text-xs'} rounded-md bg-white/10 hover:bg-white/15 min-h-[44px]`} aria-label="Close chat" onClick={handleClose}>×</button>
              </div>
            </header>
            <div className="flex-1 overflow-auto p-3 space-y-3">
              {ctx?.narrative && (
                <div className="text-sm leading-5 text-white/85">
                  {ctx.narrative}
                </div>
              )}
              {ctx?.metrics && (
                <div className="grid grid-cols-2 gap-2">
                  {ctx.metrics.map((m, i) => (
                    <div key={i} className="rounded-lg border border-white/10 bg-white/5 px-2 py-1">
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
              <div className="rounded-lg border border-white/10 bg-white/5 p-2">
                <div className="text-[10px] uppercase tracking-wide text-white/60">Last 7 days</div>
                <div className="mt-1 h-10 w-full rounded bg-white/6" aria-hidden />
              </div>
            </div>
            <footer className="border-t border-white/10 p-2">
              <div className="flex gap-2">
                <input className="flex-1 rounded-md bg-white/5 border border-white/10 px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/60 min-h-[44px]" placeholder="Type a message…" />
                <button className="px-4 py-2 rounded-md bg-cyan-500 text-slate-900 text-sm font-semibold hover:bg-cyan-400 min-h-[44px]">Send</button>
              </div>
            </footer>
          </div>
        </div>
      )}
    </>
  );
}

function inferDevice(){
  const w = typeof window !== 'undefined' ? window.innerWidth : 1440;
  return w >= 1024 ? 'desktop' : w >= 768 ? 'tablet' : 'mobile';
}
function inferDensity(){
  const w = typeof window !== 'undefined' ? window.innerWidth : 1440;
  return w >= 1024 ? 'lg' : w >= 768 ? 'md' : w >= 480 ? 'sm' : 'xs';
}
