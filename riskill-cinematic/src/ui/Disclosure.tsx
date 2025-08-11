import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import type { SyntheticEvent, MouseEvent as ReactMouseEvent, KeyboardEvent as ReactKeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "framer-motion";
import { useLongPress, isCoarsePointer } from "./useLongPress";
import { GLOSSARY, type GlossaryKey } from "../glossary/registry";
import { emit } from "../utils/telemetry";
import { pub } from "../widgets/bus";
import { messengerHandoff } from "../utils/messenger";

// keep a singleton so only one disclosure stays open at a time across the app
let closeLast: null | (() => void) = null;

export type DisclosureProps = {
  label?: string;
  glossaryKey: GlossaryKey;
  placement?: "top-right" | "bottom-right";
  autoHintKey?: string; // localStorage key to auto-show once
};

export default function Disclosure({ label = "", glossaryKey, placement = "top-right", autoHintKey }: DisclosureProps) {
  const item = GLOSSARY[glossaryKey];
  const [openTip, setOpenTip] = useState(false);
  const [openSheet, setOpenSheet] = useState(false);
  const reduce = useReducedMotion();
  const id = useId();
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const tipRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  function track(kind: "tooltip" | "sheet", how: "hover" | "click" | "longpress" | "focus" | "autohint") {
    const payload = { kind, how, key: glossaryKey } as const;
    try { emit("disclosure.open", payload); } catch {}
    try { pub("disclosure.open", payload); } catch {}
  }

  // Auto-hint once (first-time orientation)
  useEffect(() => {
    if (!autoHintKey) return;
    try {
      const seen = localStorage.getItem(`hint:${autoHintKey}`);
      if (!seen) {
        // open exclusively so any other disclosure closes
        // this runs after mount so helpers are already defined
        setOpenSheet(false);
        setOpenTip(true);
        localStorage.setItem(`hint:${autoHintKey}`, "1");
        track("tooltip", "autohint");
        const t = window.setTimeout(() => setOpenTip(false), 2200);
        return () => window.clearTimeout(t);
      }
    } catch {}
  }, [autoHintKey]);

  // Compute viewport-safe tooltip position after open
  useLayoutEffect(() => {
    if (!openTip || !btnRef.current) return;
    const pad = 12; // viewport padding
    const w = 280; // tooltip width
    const btn = btnRef.current.getBoundingClientRect();
    let left = placement.includes("right") ? btn.right - w : btn.left;
    let top = placement.startsWith("top") ? btn.top - 8 : btn.bottom + 8;
    // Wait a frame to measure actual height then clamp
    requestAnimationFrame(() => {
      const h = tipRef.current?.getBoundingClientRect().height ?? 0;
      if (placement.startsWith("top") && top - h < pad) top = btn.bottom + 8; // flip down
      if (!placement.startsWith("top") && top + h > window.innerHeight - pad) top = Math.max(pad, btn.top - h - 8);
      left = Math.max(pad, Math.min(left, window.innerWidth - w - pad));
      setPos({ top, left });
    });
  }, [openTip, placement]);

  // Close on scroll/resize to avoid stale positions
  useEffect(() => {
    if (!openTip && !openSheet) return;
    const close = () => { setOpenTip(false); setOpenSheet(false); };
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [openTip, openSheet]);

  // Long-press opens sheet on touch; click toggles sheet on coarse pointers
  const lp = useLongPress(() => { setOpenTip(false); setOpenSheet(true); track("sheet", "longpress"); });
  const swallow = (e: SyntheticEvent) => { e.preventDefault(); e.stopPropagation(); };
  // exclusive open helpers
  const openTipExclusive = () => {
    closeLast?.();
    setOpenSheet(false);
    setOpenTip(true);
    closeLast = () => setOpenTip(false);
  };
  const openSheetExclusive = () => {
    closeLast?.();
    setOpenTip(false);
    setOpenSheet(true);
    closeLast = () => setOpenSheet(false);
  };
  const handleClick = (e: ReactMouseEvent) => {
    swallow(e);
    if (isCoarsePointer()) { openSheetExclusive(); track("sheet", "click"); }
    else {
      if (openTip) { setOpenTip(false); }
      else { openTipExclusive(); track("tooltip", "click"); }
    }
  };
  const handleKeyDown = (e: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " " || e.key === "?") {
      swallow(e);
      openSheetExclusive();
      track("sheet", "click");
    }
  };

  return (
    <div className="relative inline-flex items-center gap-2" data-disclosure>
      {label ? <span className="text-white/70 text-[11px] sm:text-xs">{label}</span> : null}

      <button
        ref={btnRef}
        aria-label={`About: ${item.title}`}
        aria-haspopup="dialog"
        aria-expanded={openTip || openSheet}
        aria-describedby={openTip ? id : undefined}
        data-disclosure
        className="h-5 w-5 grid place-items-center rounded-full text-white/70 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50"
        onMouseDown={swallow}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => { if (!isCoarsePointer()) { openTipExclusive(); track("tooltip", "hover"); } }}
        onMouseLeave={() => setOpenTip(false)}
        onFocus={() => { openTipExclusive(); track("tooltip", "focus"); }}
        onBlur={() => setOpenTip(false)}
        onPointerDown={(e) => { swallow(e); lp.onPointerDown?.(); }}
        onPointerUp={(e) => { swallow(e); lp.onPointerUp?.(); }}
        onPointerLeave={(e) => { swallow(e); lp.onPointerLeave?.(); }}
        onTouchEnd={(e) => { swallow(e); lp.onTouchEnd?.(); }}
        onTouchCancel={(e) => { swallow(e); lp.onTouchCancel?.(); }}
      >
        ⓘ
      </button>

      {/* Portaled, clamped tooltip to avoid clipping */}
      {openTip && pos && createPortal(
        <motion.div
          id={id}
          ref={tipRef}
          role="tooltip"
          style={{ position: "fixed", top: pos.top, left: pos.left, width: 280, zIndex: 100000 }}
          className="rounded-lg bg-black/90 text-white text-xs p-2 shadow-xl pointer-events-none"
          initial={{ opacity: 0, y: -2 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -2 }}
          transition={reduce ? { duration: 0.12 } : { type: "tween", duration: 0.16 }}
        >
          <div className="font-medium mb-0.5">{item.title}</div>
          <div className="opacity-80">{item.quick}</div>
        </motion.div>,
        (typeof document !== "undefined" ? (document.querySelector("#dashboard-overlay") || document.body) : undefined) as Element
      )}

      <Explainer
        open={openSheet}
        onClose={() => setOpenSheet(false)}
        title={item.title}
        bullets={item.detail}
        anchorEl={btnRef.current}
        glossaryKey={glossaryKey}
      />
    </div>
  );
}

function Explainer({ open, onClose, title, bullets, anchorEl, glossaryKey }: { open: boolean; onClose: () => void; title: string; bullets: string[]; anchorEl?: Element | null; glossaryKey: GlossaryKey; }) {
  const reduce = useReducedMotion();
  const root = typeof document !== "undefined" ? (document.querySelector("#dashboard-overlay") || document.body) : null;
  if (!open || !root) return null;
  return createPortal(
    <div className="fixed inset-0 z-[72] pointer-events-auto" role="dialog" aria-modal="true" aria-label={title}>
      <motion.div className="absolute inset-0 bg-black/60" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
      <motion.div
        className="absolute right-0 top-0 h-full w-[88vw] sm:w-[420px] bg-white text-black shadow-2xl rounded-l-2xl p-5 overflow-y-auto"
        initial={reduce ? { opacity: 0 } : { x: 16, opacity: 0 }}
        animate={reduce ? { opacity: 1 } : { x: 0, opacity: 1 }}
        transition={reduce ? { duration: 0.12 } : { type: "spring", stiffness: 420, damping: 38 }}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-base font-semibold">{title}</h2>
          <button onClick={onClose} className="px-2 py-1 rounded-lg text-black/60 hover:text-black focus:outline-none focus:ring-2 focus:ring-black/30">Close</button>
        </div>
        <ul className="mt-3 space-y-2 text-sm">
          {bullets.map((b, i) => (
            <li key={i} className="leading-relaxed">• {b}</li>
          ))}
        </ul>
        <div className="mt-4 pt-3 border-t border-black/10">
          <a
            href="#"
            className="text-[13px] text-cyan-700 hover:text-cyan-800 underline underline-offset-2"
            onClick={(e) => {
              e.preventDefault();
              messengerHandoff({
                source: "disclosure",
                intent: "discuss",
                title,
                narrative: bullets[0] || undefined,
                anchorEl: anchorEl || undefined,
                meta: { glossaryKey },
              });
            }}
          >
            Discuss in Messenger →
          </a>
        </div>
      </motion.div>
    </div>,
    root
  );
}
